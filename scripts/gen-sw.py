import pathlib, json, hashlib

root = pathlib.Path("/home/user/gym")

core = ["./", "./index.html", "./manifest.webmanifest",
        "./js/datos-ejercicios.js", "./js/datos-alimentos.js",
        "./js/datos-guia.js", "./js/app.js"]
imgs  = sorted("./img/" + p.name for p in (root / "img").glob("*.webp"))
icons = sorted("./icons/" + p.name for p in (root / "icons").glob("*.png"))
assets = core + imgs + icons

# Version derived from the content of everything we ship, so a changed byte
# anywhere produces a new cache name and the SW actually updates.
h = hashlib.sha256()
for rel in sorted(a for a in assets if a not in ("./",)):
    p = root / rel[2:]
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
 */
const VERSION = "%s";
const CACHE = "rutina-" + VERSION;

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
        ks.filter((k) => k.startsWith("rutina-") && k !== CACHE).map((k) => caches.delete(k))
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
''' % (version, lista)

(root / "sw.js").write_text(sw, encoding="utf-8")
print(f"sw.js generado · versión {version} · {len(assets)} recursos precacheados")
