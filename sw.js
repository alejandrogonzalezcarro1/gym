/* Service worker — hace que la app funcione sin conexión.
 *
 * La versión sale del contenido de los archivos: si cambia un byte, cambia el
 * nombre de la caché y el navegador se trae la versión nueva. Generado por
 * scripts/gen-sw.py — no lo edites a mano, se regenera.
 */
const VERSION = "723d93833af7";
const CACHE = "rutina-" + VERSION;

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./js/datos-ejercicios.js",
  "./js/datos-alimentos.js",
  "./js/datos-guia.js",
  "./js/app.js",
  "./img/Band_Assisted_Pull-Up_0.webp",
  "./img/Band_Assisted_Pull-Up_1.webp",
  "./img/Cable_Crunch_0.webp",
  "./img/Cable_Crunch_1.webp",
  "./img/Dumbbell_Bench_Press_0.webp",
  "./img/Dumbbell_Bench_Press_1.webp",
  "./img/Dumbbell_Lunges_0.webp",
  "./img/Dumbbell_Lunges_1.webp",
  "./img/EZ-Bar_Skullcrusher_0.webp",
  "./img/EZ-Bar_Skullcrusher_1.webp",
  "./img/Face_Pull_0.webp",
  "./img/Face_Pull_1.webp",
  "./img/Goblet_Squat_0.webp",
  "./img/Goblet_Squat_1.webp",
  "./img/Hammer_Curls_0.webp",
  "./img/Hammer_Curls_1.webp",
  "./img/Hanging_Leg_Raise_0.webp",
  "./img/Hanging_Leg_Raise_1.webp",
  "./img/Incline_Dumbbell_Curl_0.webp",
  "./img/Incline_Dumbbell_Curl_1.webp",
  "./img/Incline_Dumbbell_Press_0.webp",
  "./img/Incline_Dumbbell_Press_1.webp",
  "./img/Leg_Extensions_0.webp",
  "./img/Leg_Extensions_1.webp",
  "./img/Leg_Press_0.webp",
  "./img/Leg_Press_1.webp",
  "./img/One-Arm_Dumbbell_Row_0.webp",
  "./img/One-Arm_Dumbbell_Row_1.webp",
  "./img/Plank_0.webp",
  "./img/Plank_1.webp",
  "./img/Preacher_Curl_0.webp",
  "./img/Preacher_Curl_1.webp",
  "./img/Reverse_Flyes_0.webp",
  "./img/Reverse_Flyes_1.webp",
  "./img/Seated_Cable_Rows_0.webp",
  "./img/Seated_Cable_Rows_1.webp",
  "./img/Seated_Dumbbell_Press_0.webp",
  "./img/Seated_Dumbbell_Press_1.webp",
  "./img/Seated_Leg_Curl_0.webp",
  "./img/Seated_Leg_Curl_1.webp",
  "./img/Side_Lateral_Raise_0.webp",
  "./img/Side_Lateral_Raise_1.webp",
  "./img/Standing_Calf_Raises_0.webp",
  "./img/Standing_Calf_Raises_1.webp",
  "./img/Stiff-Legged_Dumbbell_Deadlift_0.webp",
  "./img/Stiff-Legged_Dumbbell_Deadlift_1.webp",
  "./img/Triceps_Pushdown_-_Rope_Attachment_0.webp",
  "./img/Triceps_Pushdown_-_Rope_Attachment_1.webp",
  "./img/Wide-Grip_Lat_Pulldown_0.webp",
  "./img/Wide-Grip_Lat_Pulldown_1.webp",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/splash.png"
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
