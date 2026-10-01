# Asistente de voz con atajo

Pulsas un atajo de teclado, aparece una ventanita y le dices «abre YouTube»,
«busca rutinas de pierna en YouTube» o «abre la calculadora». Usa **Gemini**,
que entiende el audio directamente (no hace falta un reconocedor de voz aparte).

Es un programa de **escritorio**: se ejecuta en tu ordenador, no en la web
del gimnasio que hay en el resto del repo.

## Instalación

**1. Python 3.10 o superior y tkinter**

- Windows / macOS: el instalador de [python.org](https://www.python.org/downloads/) ya lo trae.
- Linux (Debian/Ubuntu): `sudo apt install python3-tk python3-venv libportaudio2`

**2. Clave de Gemini** (gratis para empezar): créala en <https://aistudio.google.com/apikey>
y guárdala en un archivo `.env` junto a `asistente.py`:

```
GEMINI_API_KEY=tu-clave
```

(o como variable de entorno con ese mismo nombre; `.env` está en el `.gitignore`).

**3. Dependencias**, desde esta carpeta:

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Uso

```bash
python3 asistente.py
```

Se queda en segundo plano. Pulsa **Ctrl + Alt + Espacio**, habla, y deja de
hablar un segundo: se cierra sola tras hacerlo.

| Tecla | Qué hace |
|---|---|
| el atajo, con la ventana abierta | «ya he terminado»: envía lo grabado sin esperar al silencio |
| escribir + Intro | manda una orden por texto (útil sin micro o en sitios silenciosos) |
| Esc | cancela y cierra |

Cambia el atajo, el modelo o las apps en `config.json`. El atajo usa la
sintaxis de pynput: `"<ctrl>+<alt>+h"`, `"<cmd>+<shift>+<space>"`…

## Qué puede hacer (y solo eso)

| Acción | Ejemplo |
|---|---|
| Abrir una web | «abre YouTube», «abre Gmail y GitHub» |
| Buscar (Google, YouTube, Maps, Wikipedia) | «busca en Maps gimnasios cerca» |
| Abrir una app **de tu lista** | «abre la calculadora» |

La IA **no puede ejecutar comandos libres**: solo abre URLs `http(s)` y las
apps que tú pongas en `config.json`. Hay unas por defecto según el sistema;
añade las tuyas así (nombre hablado → comando como lista):

```json
"apps": {
  "spotify": ["spotify"],
  "visual studio code": ["code"],
  "chrome": ["open", "-a", "Google Chrome"]
}
```

## Si el atajo no funciona

- **macOS**: da permiso al terminal (o a Python) en *Ajustes → Privacidad y
  seguridad* → *Accesibilidad*, *Monitorización de entrada* y *Micrófono*.
- **Linux con Wayland** (por defecto en Ubuntu/Fedora recientes): los atajos
  globales de una app no funcionan. Crea un atajo en los ajustes del sistema
  que ejecute `python3 /ruta/a/asistente.py --show`; si ya está en marcha solo
  le pide que abra la ventana.
- Cualquier sistema: lo mismo vale con AutoHotkey, Karabiner, etc.

## Arrancar con el ordenador

- **Windows**: crea un acceso directo a `.venv\Scripts\pythonw.exe asistente.py`
  (sin consola) y ponlo en la carpeta `shell:startup`.
- **macOS**: *Ajustes → General → Items de inicio de sesión* con un script que lance el comando.
- **Linux**: un `.desktop` en `~/.config/autostart/` con `Exec=/ruta/.venv/bin/python /ruta/asistente.py`.

## Privacidad

Lo que dices se envía como audio a la API de Gemini (Google). Revisa sus
condiciones, sobre todo las del nivel gratuito, antes de usarlo para algo sensible.
Si prefieres no usar la voz, escribir la orden también funciona, pero el texto
también va a Gemini.

## Problemas

- *«Falta GEMINI_API_KEY»*: mira el paso 2.
- *Error 404 / modelo no encontrado*: Google renueva sus modelos; pon uno vigente
  en `"modelo"` de `config.json` (lista en <https://ai.google.dev/gemini-api/docs/models>).
- *«No puedo usar el micrófono»*: comprueba el micrófono por defecto del sistema
  y, en Linux, que está `libportaudio2`.

## Pruebas

```bash
python3 -m unittest test_asistente -v
```

Cubren la lógica (validación de URLs, acciones, detección del final de la
frase, formato del audio, llamada a Gemini simulada). No usan micro, pantalla
ni red.
