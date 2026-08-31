"""Descarga de free-exercise-db los ejercicios nuevos de la rutina de tren
inferior y los deja en el mismo formato que los ya existentes (WebP 340x226)."""
import urllib.request, io, pathlib, shutil, sys
from PIL import Image

RAW = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/"
root = pathlib.Path("/home/user/gym")
dest = root / "barbara" / "img"

NUEVOS = [
    "Barbell_Hip_Thrust", "Thigh_Abductor", "Hyperextensions_Back_Extensions",
    "Dead_Bug", "Leverage_Chest_Press", "Machine_Shoulder_Military_Press",
    "Standing_Biceps_Cable_Curl", "Lying_Leg_Curls", "Side_Bridge",
]
# Los que ya tenemos descargados para la otra app: se copian tal cual.
REUSADOS = [
    "Leg_Press", "Seated_Leg_Curl", "Leg_Extensions", "Plank", "Cable_Crunch",
    "Wide-Grip_Lat_Pulldown", "Seated_Cable_Rows", "Side_Lateral_Raise",
    "Triceps_Pushdown_-_Rope_Attachment", "Band_Assisted_Pull-Up",
    "Incline_Dumbbell_Press", "One-Arm_Dumbbell_Row", "Face_Pull",
    "Hammer_Curls", "Stiff-Legged_Dumbbell_Deadlift",
]

TAM = (340, 226)
ok = fallo = 0
for nombre in NUEVOS:
    for i in (0, 1):
        url = f"{RAW}{nombre}/{i}.jpg"
        salida = dest / f"{nombre}_{i}.webp"
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "curl/8"})
            with urllib.request.urlopen(req, timeout=60) as r:
                im = Image.open(io.BytesIO(r.read())).convert("RGB")
            im = im.resize(TAM, Image.LANCZOS)
            im.save(salida, "WEBP", quality=80, method=6)
            ok += 1
        except Exception as e:
            print(f"  FALLO {nombre}/{i}.jpg → {e}", file=sys.stderr)
            fallo += 1

for nombre in REUSADOS:
    for i in (0, 1):
        src = root / "img" / f"{nombre}_{i}.webp"
        if src.exists():
            shutil.copy2(src, dest / f"{nombre}_{i}.webp")
            ok += 1
        else:
            print(f"  FALLO copia {src.name}", file=sys.stderr); fallo += 1

print(f"imágenes listas: {ok} · fallos: {fallo}")
print(f"total en barbara/img: {len(list(dest.glob('*.webp')))}")
