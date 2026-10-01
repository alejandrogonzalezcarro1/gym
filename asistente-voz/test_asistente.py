"""Pruebas de la lógica del asistente (sin micrófono, sin pantalla, sin red).

    python3 -m unittest test_asistente -v     # desde esta carpeta; necesita google-genai
"""
import io
import unittest
import wave
from types import SimpleNamespace
from unittest import mock

import asistente


class Url(unittest.TestCase):
    def test_añade_https(self):
        self.assertEqual(asistente.normalizar_url("youtube.com"), "https://youtube.com")

    def test_rechaza_esquemas_peligrosos(self):
        for url in ("file:///etc/passwd", "javascript:alert(1)", "ftp://x.com", "https://", ""):
            with self.assertRaises(ValueError, msg=url):
                asistente.normalizar_url(url)


class Acciones(unittest.TestCase):
    def test_abrir_url(self):
        with mock.patch("webbrowser.open") as abrir:
            msg = asistente.ejecutar("open_url", {"url": "https://www.youtube.com"}, {})
        abrir.assert_called_once_with("https://www.youtube.com")
        self.assertIn("youtube.com", msg)

    def test_buscar_escapa_la_consulta(self):
        with mock.patch("webbrowser.open") as abrir:
            asistente.ejecutar("search", {"query": "pesas & cardio", "engine": "youtube"}, {})
        abrir.assert_called_once_with("https://www.youtube.com/results?search_query=pesas+%26+cardio")

    def test_buscar_por_defecto_en_google(self):
        with mock.patch("webbrowser.open") as abrir:
            asistente.ejecutar("search", {"query": "hola"}, {})
        self.assertTrue(abrir.call_args[0][0].startswith("https://www.google.com/search?q="))

    def test_app_permitida(self):
        with mock.patch("subprocess.Popen") as popen:
            asistente.ejecutar("open_app", {"name": "Calculadora"}, {"calculadora": ["calc"]})
        self.assertEqual(popen.call_args[0][0], ["calc"])

    def test_app_fuera_de_la_lista(self):
        with mock.patch("subprocess.Popen") as popen, self.assertRaises(ValueError):
            asistente.ejecutar("open_app", {"name": "rm -rf /"}, {"calculadora": ["calc"]})
        popen.assert_not_called()

    def test_accion_desconocida(self):
        with self.assertRaises(ValueError):
            asistente.ejecutar("run_shell", {"cmd": "ls"}, {})

    def test_open_app_solo_se_declara_si_hay_apps(self):
        sin = [f["name"] for f in asistente.declaraciones({})]
        con = asistente.declaraciones({"b": ["x"], "a": ["y"]})
        self.assertEqual(sin, ["open_url", "search"])
        self.assertEqual(con[-1]["parameters"]["properties"]["name"]["enum"], ["a", "b"])


class Detector(unittest.TestCase):
    def correr(self, volumenes, **kw):
        d = asistente.DetectorDeFin(**kw)
        for i, v in enumerate(volumenes, 1):
            if (res := d.alimentar(v)):
                return res, i
        return None, len(volumenes)

    def test_para_tras_el_silencio_posterior_a_la_voz(self):
        res, n = self.correr([50] * 5 + [2000] * 10 + [50] * 20)
        self.assertEqual((res, n), ("fin", 15 + 9))   # 0,9 s de silencio = 9 bloques

    def test_pausa_corta_no_corta_la_frase(self):
        res, _ = self.correr([50] * 5 + [2000] * 5 + [50] * 5 + [2000] * 5 + [50] * 20)
        self.assertEqual(res, "fin")
        d = asistente.DetectorDeFin()
        for v in [50] * 5 + [2000] * 5 + [50] * 5 + [2000] * 5:
            self.assertIsNone(d.alimentar(v))

    def test_sin_voz(self):
        res, n = self.correr([50] * 100)
        self.assertEqual((res, n), ("sin_voz", 60))

    def test_ruido_de_fondo_alto_no_cuenta_como_voz(self):
        res, _ = self.correr([400] * 100)   # 400 > 300 pero ≈ ruido de fondo
        self.assertEqual(res, "sin_voz")

    def test_limite_de_duracion(self):
        res, n = self.correr([50] * 5 + [2000] * 200)
        self.assertEqual((res, n), ("fin", 120))


class Wav(unittest.TestCase):
    def test_formato(self):
        datos = asistente.a_wav(b"\x00\x01" * 1600)
        with wave.open(io.BytesIO(datos)) as w:
            self.assertEqual((w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()),
                             (1, 2, 16000, 1600))


class Gemini(unittest.TestCase):
    def falso(self, partes):
        from google.genai import types
        resp = types.GenerateContentResponse(candidates=[types.Candidate(
            content=types.Content(role="model", parts=partes))])
        generar = mock.Mock(return_value=resp)
        return SimpleNamespace(models=SimpleNamespace(generate_content=generar)), generar

    def test_audio_y_llamadas(self):
        from google.genai import types
        cliente, generar = self.falso([types.Part(function_call=types.FunctionCall(
            name="open_url", args={"url": "https://www.youtube.com"}))])
        with mock.patch.object(asistente, "_cliente", cliente):
            llamadas, texto = asistente.preguntar(asistente.cargar_config(), wav=b"RIFF....")
        self.assertEqual(llamadas, [("open_url", {"url": "https://www.youtube.com"})])
        self.assertEqual(texto, "")
        enviado = generar.call_args.kwargs
        self.assertEqual(enviado["contents"][0].inline_data.mime_type, "audio/wav")
        self.assertTrue(enviado["config"].automatic_function_calling.disable)

    def test_respuesta_de_texto(self):
        from google.genai import types
        cliente, _ = self.falso([types.Part(text="No sé hacer eso.")])
        with mock.patch.object(asistente, "_cliente", cliente):
            self.assertEqual(asistente.preguntar(asistente.cargar_config(), texto="baila"),
                             ([], "No sé hacer eso."))


if __name__ == "__main__":
    unittest.main()
