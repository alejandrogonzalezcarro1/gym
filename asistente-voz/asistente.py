#!/usr/bin/env python3
"""Asistente de voz con atajo de teclado global.

Pulsas el atajo, aparece una ventanita y te escucha. Gemini entiende la orden
directamente del audio y elige una de las acciones permitidas: abrir una web,
buscar en Google/YouTube/Maps/Wikipedia o abrir una app de tu lista.

    python3 asistente.py          # se queda en segundo plano esperando el atajo
    python3 asistente.py --show   # igual, pero abre la ventana ya

Si ya hay una instancia en marcha, `--show` solo le pide que abra la ventana:
sirve para enlazarlo a un atajo del sistema cuando el global no funciona
(Wayland, por ejemplo).

Seguridad: la IA nunca ejecuta comandos libres. Solo puede abrir URLs http(s)
y las apps que listes tú en config.json.
"""
import argparse
import io
import json
import os
import platform
import queue
import re
import socket
import subprocess
import sys
import threading
import wave
import webbrowser
from pathlib import Path
from urllib.parse import quote_plus, urlparse

AQUI = Path(__file__).resolve().parent
PUERTO = 47653          # UDP en localhost: instancia única + orden "abre la ventana"
FRECUENCIA = 16000
BLOQUE = 1600           # 100 ms de audio por bloque

CONFIG_POR_DEFECTO = {
    "atajo": "<ctrl>+<alt>+<space>",   # sintaxis de pynput
    "modelo": "gemini-3.8-flash",
    "cerrar_tras_segundos": 1.5,
    "apps": {},                        # se suman a las de cada sistema
}

APPS_POR_SISTEMA = {
    "Windows": {"calculadora": ["calc"], "bloc de notas": ["notepad"], "explorador": ["explorer"]},
    "Darwin": {"calculadora": ["open", "-a", "Calculator"], "notas": ["open", "-a", "Notes"],
               "finder": ["open", "-a", "Finder"]},
    "Linux": {"calculadora": ["gnome-calculator"], "archivos": ["xdg-open", str(Path.home())]},
}

BUSCADORES = {
    "google": "https://www.google.com/search?q={}",
    "youtube": "https://www.youtube.com/results?search_query={}",
    "maps": "https://www.google.com/maps/search/{}",
    "wikipedia": "https://es.wikipedia.org/w/index.php?search={}",
}

INSTRUCCIONES = (
    "Eres el asistente de voz de un ordenador de escritorio. El usuario te da una orden corta, "
    "hablada (audio) o escrita, normalmente en español. Cumple la orden llamando a las funciones "
    "disponibles; si pide varias cosas, llama a varias funciones en orden. "
    "Para abrir un sitio web que conozcas bien (YouTube, Gmail, GitHub, Netflix...) usa open_url "
    "con su dirección oficial. Si no estás seguro de la dirección, usa search en vez de inventarla. "
    "Si la orden no se puede hacer con las funciones disponibles, o no la entiendes, responde con "
    "una sola frase corta en español explicando por qué y sin llamar a ninguna función."
)


# --------------------------------------------------------------------------- config

def cargar_config():
    config = dict(CONFIG_POR_DEFECTO)
    ruta = AQUI / "config.json"
    if ruta.exists():
        config.update(json.loads(ruta.read_text(encoding="utf-8")))
    apps = dict(APPS_POR_SISTEMA.get(platform.system(), {}))
    for nombre, comando in config["apps"].items():
        apps[nombre.lower()] = [comando] if isinstance(comando, str) else list(comando)
    config["apps"] = apps
    return config


def cargar_clave():
    """GEMINI_API_KEY del entorno o, si no está, del archivo .env de esta carpeta."""
    clave = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    env = AQUI / ".env"
    if not clave and env.exists():
        for linea in env.read_text(encoding="utf-8").splitlines():
            nombre, _, valor = linea.partition("=")
            if nombre.strip() in ("GEMINI_API_KEY", "GOOGLE_API_KEY") and valor.strip():
                return valor.strip().strip("\"'")
    return clave


# --------------------------------------------------------------------------- acciones

def normalizar_url(url):
    url = url.strip()
    if "://" not in url:
        url = "https://" + url
    partes = urlparse(url)
    try:
        partes.port    # lanza ValueError si el puerto no es un número: "javascript:alert(1)" cae aquí
        valida = partes.scheme in ("http", "https") and re.fullmatch(r"[A-Za-z0-9.-]+", partes.hostname or "")
    except ValueError:
        valida = False
    if not valida:
        raise ValueError(f"URL no válida: {url}")
    return url


def declaraciones(apps):
    """Las funciones que Gemini puede pedir. Solo estas: nada de comandos libres."""
    funciones = [
        {
            "name": "open_url",
            "description": "Abre una página web en el navegador.",
            "parameters": {
                "type": "object",
                "properties": {"url": {"type": "string", "description": "URL completa, p. ej. https://www.youtube.com"}},
                "required": ["url"],
            },
        },
        {
            "name": "search",
            "description": "Busca algo en un buscador y abre los resultados en el navegador.",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Texto a buscar"},
                    "engine": {"type": "string", "enum": list(BUSCADORES), "description": "Por defecto, google"},
                },
                "required": ["query"],
            },
        },
    ]
    if apps:
        funciones.append({
            "name": "open_app",
            "description": "Abre una aplicación del ordenador.",
            "parameters": {
                "type": "object",
                "properties": {"name": {"type": "string", "enum": sorted(apps)}},
                "required": ["name"],
            },
        })
    return funciones


def ejecutar(nombre, args, apps):
    """Hace lo que pide la IA y devuelve una frase para mostrar en la ventana."""
    if nombre == "open_url":
        url = normalizar_url(args["url"])
        webbrowser.open(url)
        return f"Abriendo {urlparse(url).netloc}"
    if nombre == "search":
        plantilla = BUSCADORES.get(args.get("engine") or "google")
        if plantilla is None:
            raise ValueError(f"Buscador desconocido: {args.get('engine')}")
        webbrowser.open(plantilla.format(quote_plus(args["query"])))
        return f"Buscando «{args['query']}»"
    if nombre == "open_app":
        comando = apps.get(str(args.get("name", "")).lower())
        if comando is None:
            raise ValueError(f"App no permitida: {args.get('name')}")
        subprocess.Popen(comando, stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL,
                         stderr=subprocess.DEVNULL, start_new_session=(os.name == "posix"))
        return f"Abriendo {args['name']}"
    raise ValueError(f"Acción desconocida: {nombre}")


# --------------------------------------------------------------------------- Gemini

_cliente = None


def preguntar(config, wav=None, texto=None):
    """Manda el audio (o el texto) a Gemini. Devuelve (llamadas, respuesta_de_texto)."""
    global _cliente
    from google import genai
    from google.genai import types

    if _cliente is None:
        clave = cargar_clave()
        if not clave:
            raise RuntimeError("Falta GEMINI_API_KEY (mira el README, paso 2).")
        _cliente = genai.Client(api_key=clave)

    partes = []
    if texto:
        partes.append(types.Part.from_text(text=texto))
    else:
        partes.append(types.Part.from_bytes(data=wav, mime_type="audio/wav"))
    respuesta = _cliente.models.generate_content(
        model=config["modelo"],
        contents=partes,
        config=types.GenerateContentConfig(
            system_instruction=INSTRUCCIONES,
            tools=[types.Tool(function_declarations=declaraciones(config["apps"]))],
            temperature=0,
            automatic_function_calling=types.AutomaticFunctionCallingConfig(disable=True),
        ),
    )
    llamadas = [(c.name, dict(c.args or {})) for c in (respuesta.function_calls or [])]
    return llamadas, ("" if llamadas else (respuesta.text or "").strip())


# --------------------------------------------------------------------------- micrófono

class DetectorDeFin:
    """Decide cuándo has terminado de hablar a partir del volumen de cada bloque de 100 ms."""

    def __init__(self, silencio_s=0.9, maximo_s=12, sin_voz_s=6, bloque_s=0.1):
        self.silencio, self.maximo, self.sin_voz, self.bloque = silencio_s, maximo_s, sin_voz_s, bloque_s
        self.ruido = []        # primeros bloques: estimación del ruido de fondo
        self.hablando = False  # ¿se ha oído voz alguna vez?
        self.callado = 0       # bloques seguidos sin voz
        self.n = 0

    def alimentar(self, rms):
        """Devuelve None mientras siga grabando, o "fin" / "sin_voz" cuando haya que parar."""
        self.n += 1
        if self.n <= 5:
            self.ruido.append(rms)
        umbral = min(max(300, 2.5 * min(self.ruido)), 1500)
        if rms > umbral:
            self.hablando, self.callado = True, 0
        else:
            self.callado += 1
        transcurrido = self.n * self.bloque
        if self.hablando and self.callado * self.bloque >= self.silencio:
            return "fin"
        if transcurrido >= (self.maximo if self.hablando else self.sin_voz):
            return "fin" if self.hablando else "sin_voz"
        return None


def a_wav(pcm):
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(FRECUENCIA)
        w.writeframes(pcm)
    return buf.getvalue()


def grabar(parar, al_nivel):
    """Graba hasta que dejes de hablar (o `parar` se active). Devuelve WAV, o None si no hubo voz."""
    import numpy as np
    import sounddevice as sd

    detector, trozos, cola = DetectorDeFin(), [], queue.Queue()
    with sd.InputStream(samplerate=FRECUENCIA, channels=1, dtype="int16", blocksize=BLOQUE,
                        callback=lambda datos, *_: cola.put(datos.copy())):
        while not parar.is_set():
            try:
                bloque = cola.get(timeout=0.5)
            except queue.Empty:
                continue
            trozos.append(bloque)
            rms = float(np.sqrt(np.mean(bloque.astype(np.float32) ** 2)))
            al_nivel(rms)
            if detector.alimentar(rms):
                break
    if not detector.hablando:
        return None
    return a_wav(np.concatenate(trozos).tobytes())


# --------------------------------------------------------------------------- ventana

FONDO, TEXTO, ACENTO = "#16181d", "#e8e8e8", "#4f8cff"


class Ventana:
    """Ventanita siempre visible. Los hilos de fondo solo hablan con ella por la cola."""

    def __init__(self, config, cola):
        import tkinter as tk
        self.tk, self.config, self.cola = tk, config, cola
        self.generacion = 0           # se incrementa al empezar/cancelar; los hilos viejos se ignoran
        self.parar = threading.Event()
        self.estado = "oculta"        # oculta | escuchando | pensando | listo

        self.raiz = raiz = tk.Tk()
        raiz.withdraw()
        raiz.title("Asistente")
        raiz.configure(bg=FONDO, padx=20, pady=16)
        raiz.attributes("-topmost", True)
        raiz.resizable(False, False)
        raiz.protocol("WM_DELETE_WINDOW", self.cancelar)
        raiz.bind("<Escape>", lambda _: self.cancelar())

        self.titulo = tk.Label(raiz, bg=FONDO, fg=TEXTO, font=("TkDefaultFont", 15, "bold"),
                              width=34, wraplength=380)
        self.titulo.pack()
        self.nivel = tk.Canvas(raiz, width=360, height=8, bg="#2a2d35", highlightthickness=0)
        self.barra = self.nivel.create_rectangle(0, 0, 0, 8, fill=ACENTO, width=0)
        self.nivel.pack(pady=8)
        self.detalle = tk.Label(raiz, bg=FONDO, fg="#a0a4ad", wraplength=360, justify="center")
        self.detalle.pack()
        self.entrada = tk.Entry(raiz, bg="#22252d", fg=TEXTO, insertbackground=TEXTO, relief="flat", width=44)
        self.entrada.pack(pady=(10, 4), ipady=4)
        self.entrada.bind("<Return>", self.enviar_texto)
        tk.Label(raiz, bg=FONDO, fg="#6b6f78", font=("TkDefaultFont", 9),
                 text="Habla · o escribe y pulsa Intro · Esc cierra · el atajo otra vez = enviar ya").pack()

        raiz.after(100, self.sondear)

    # -- ciclo de vida

    def alternar(self):
        if self.estado == "escuchando":
            self.parar.set()               # "ya he terminado": manda lo grabado
        elif self.estado != "pensando":
            self.empezar()

    def empezar(self, texto=None):
        self.parar.set()                   # corta una grabación anterior, si la hubiera
        self.generacion += 1
        self.parar = parar = threading.Event()
        self.entrada.delete(0, "end")
        self.mostrar("escuchando" if texto is None else "pensando",
                     "Te escucho…" if texto is None else "Pensando…", texto or "")
        self.raiz.deiconify()
        self.raiz.update_idletasks()
        x = (self.raiz.winfo_screenwidth() - self.raiz.winfo_reqwidth()) // 2
        self.raiz.geometry(f"+{x}+{self.raiz.winfo_screenheight() // 6}")
        self.raiz.lift()
        self.raiz.focus_force()
        self.entrada.focus_set()
        threading.Thread(target=self.trabajar, args=(self.generacion, parar, texto), daemon=True).start()

    def cancelar(self):
        self.generacion += 1
        self.parar.set()
        self.ocultar()

    def ocultar(self):
        self.estado = "oculta"
        self.raiz.withdraw()

    def enviar_texto(self, _evento=None):
        texto = self.entrada.get().strip()
        if texto and self.estado != "pensando":
            self.empezar(texto)

    def mostrar(self, estado, titulo, detalle=""):
        self.estado = estado
        self.titulo.config(text=titulo)
        self.detalle.config(text=detalle)
        if estado != "escuchando":
            self.nivel.coords(self.barra, 0, 0, 0, 8)

    # -- trabajo en segundo plano (no toca widgets: solo publica en la cola)

    def publicar(self, generacion, tipo, *datos):
        self.cola.put((generacion, tipo, datos))

    def trabajar(self, generacion, parar, texto):
        try:
            wav = None
            if texto is None:
                try:
                    wav = grabar(parar, lambda v: self.publicar(generacion, "nivel", v))
                except Exception as e:  # sin micrófono, sin PortAudio...
                    self.publicar(generacion, "fallo", f"No puedo usar el micrófono ({e}). Escribe la orden abajo.")
                    return
                if wav is None:   # si se canceló, la generación ya no coincide y la cola lo ignora
                    self.publicar(generacion, "listo", "No te he oído", "Pulsa el atajo e inténtalo otra vez.", 2.5)
                    return
                self.publicar(generacion, "pensando")
            llamadas, respuesta = preguntar(self.config, wav=wav, texto=texto)
            if generacion != self.generacion:      # cancelado mientras pensaba
                return
            if not llamadas:
                self.publicar(generacion, "listo", respuesta or "No sé hacer eso.", "", 6)
                return
            hechas = []
            for nombre, args in llamadas[:5]:
                hechas.append(ejecutar(nombre, args, self.config["apps"]))
            self.publicar(generacion, "listo", "✓ " + " · ".join(hechas), "", self.config["cerrar_tras_segundos"])
        except Exception as e:
            self.publicar(generacion, "fallo", str(e))

    # -- cola -> widgets (hilo principal)

    def sondear(self):
        try:
            while True:
                generacion, tipo, datos = self.cola.get_nowait()
                if tipo == "alternar":
                    self.alternar()
                elif generacion == self.generacion:
                    self.atender(generacion, tipo, datos)
        except queue.Empty:
            pass
        self.raiz.after(100, self.sondear)

    def atender(self, generacion, tipo, datos):
        if tipo == "nivel":
            self.nivel.coords(self.barra, 0, 0, 360 * min(datos[0] / 3000, 1), 8)
        elif tipo == "pensando":
            self.mostrar("pensando", "Pensando…")
        elif tipo == "fallo":
            self.mostrar("listo", "No he podido", datos[0])
            self.entrada.focus_set()
        elif tipo == "listo":
            titulo, detalle, cerrar = datos
            self.mostrar("listo", titulo, detalle)
            self.raiz.after(int(cerrar * 1000), lambda: generacion == self.generacion and self.ocultar())


# --------------------------------------------------------------------------- arranque

def escuchar_ordenes(sock, cola):
    """Otro `asistente.py --show` nos pide por UDP que abramos la ventana."""
    while True:
        datos, _ = sock.recvfrom(64)
        if datos == b"show":
            cola.put((None, "alternar", ()))


def activar_atajo(atajo, cola):
    try:
        from pynput import keyboard
        escucha = keyboard.GlobalHotKeys({atajo: lambda: cola.put((None, "alternar", ()))})
        escucha.daemon = True
        escucha.start()
        print(f"Atajo activo: {atajo}")
    except Exception as e:
        print(f"No he podido activar el atajo global ({e}).\n"
              f"Enlaza un atajo del sistema al comando:  python3 {Path(__file__).name} --show")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--show", action="store_true", help="abre la ventana nada más arrancar")
    args = ap.parse_args()

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.bind(("127.0.0.1", PUERTO))
    except OSError:                       # ya hay una instancia: le pedimos que se muestre
        sock.sendto(b"show", ("127.0.0.1", PUERTO))
        print("El asistente ya estaba en marcha.")
        return

    config, cola = cargar_config(), queue.Queue()
    ventana = Ventana(config, cola)
    threading.Thread(target=escuchar_ordenes, args=(sock, cola), daemon=True).start()
    activar_atajo(config["atajo"], cola)
    if args.show:
        cola.put((None, "alternar", ()))
    try:
        ventana.raiz.mainloop()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    sys.exit(main())
