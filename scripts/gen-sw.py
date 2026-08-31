#!/usr/bin/env python3
"""Genera el service worker de una de las apps.

    python3 scripts/gen-sw.py            # app principal (raíz del repo)
    python3 scripts/gen-sw.py barbara    # app de la subcarpeta

La versión sale del hash del contenido de todo lo que se sirve: si cambia un
byte en cualquier archivo, cambia el nombre de la caché y el navegador se trae
la versión nueva.

Ojo al prefijo de caché: las dos apps se sirven desde el mismo dominio y por
tanto comparten CacheStorage. Cada una limpia solo las cachés de su prefijo;
si compartieran prefijo se borrarían la caché la una a la otra.
"""
import pathlib, json, hashlib, sys

REPO = pathlib.Path(__file__).resolve().parent.parent

APPS = {
    "":        {"raiz": REPO,              "prefijo": "rutina"},
    "barbara": {"raiz": REPO / "barbara",  "prefijo": "barbara"},
}

destino = (sys.argv[1] if len(sys.argv) > 1 else "").strip("/")
if destino not in APPS:
    sys.exit(f"App desconocida: {destino!r}. Opciones: {', '.join(repr(k) for k in APPS)}")

cfg = APPS[destino]
raiz, prefijo = cfg["raiz"], cfg["prefijo"]

core = ["./", "./index.html", "./manifest.webmanifest",
        "./js/datos-ejercicios.js", "./js/datos-alimentos.js",
        "./js/datos-guia.js", "./js/app.js"]
imgs = sorted("./img/" + p.name for p in (raiz / "img").glob("*.webp"))
icons = sorted("./icons/" + p.name for p in (raiz / "icons").glob("*.png"))
assets = core + imgs + icons

h = hashlib.sha256()
for rel in sorted(a for a in assets if a != "./"):
    p = raiz / rel[2:]
    if p.exists():
        h.update(rel.encode())
        h.update(p.read_bytes())
version = h.hexdigest()[:12]

lista = ",\n  ".join(json.dumps(a) for a in assets)

sw = '''/* Service worker — hace que la app funcione sin conexión.
 *
 * La versión sale del contenido de los archivos: si cambia un byte, cambia el
 * nombre de la caché y el navegador se trae la versión nueva. Generado por
 * scripts/gen-sw.py — no lo edites a mano, se regenera.
 *
 * El prefijo de caché es propio de esta app: las dos comparten dominio y por
 * tanto CacheStorage, y cada una debe limpiar solo lo suyo.
 */
const VERSION = "%s";
const PREFIJO = "%s-";
const CACHE = PREFIJO + VERSION;

const ASSETS = [
  %s
];

self.addEventListener("install", (ev) => {
  ev.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(
        ks.filter((k) => k.startsWith(PREFIJO) && k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* El cliente pide saltar la espera cuando el usuario toca «Actualizar». */
self.addEventListener("message", (ev) => {
  if (ev.data && ev.data.tipo === "saltar") self.skipWaiting();
});

self.addEventListener("fetch", (ev) => {
  const req = ev.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   /* enlaces externos: sin tocar */

  /* Navegaciones: red primero para pillar actualizaciones, caché si no hay señal.
     Es lo que hace que la app abra en un gimnasio sin cobertura. */
  if (req.mode === "navigate") {
    ev.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copia));
          return res;
        })
        .catch(() => caches.match("./index.html", { ignoreSearch: true })
                       .then((r) => r || caches.match("./")))
    );
    return;
  }

  /* Resto de recursos: caché primero (son estáticos y pesan), red de reserva. */
  ev.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return res;
      });
    })
  );
});
''' % (version, prefijo, lista)

(raiz / "sw.js").write_text(sw, encoding="utf-8")
etiqueta = destino or "principal"
print(f"sw.js de «{etiqueta}» generado · prefijo {prefijo}- · versión {version} · {len(assets)} recursos")
