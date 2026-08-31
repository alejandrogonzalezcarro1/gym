# Rutina · entreno y nutrición

App web para una rutina de 4 días (Torso / Pierna / Torso / Pierna) con registro de
series, doble progresión automática, planificador de nutrición y seguimiento de peso.

Funciona sin conexión y se instala en la pantalla de inicio del iPhone como una app
más. No tiene servidor, ni cuentas, ni analítica: **todos tus datos viven solo en tu
teléfono**, en el almacenamiento local del navegador.

---

## Ponerla en marcha (3 pasos, una sola vez)

GitHub Pages solo sirve repositorios públicos en las cuentas gratuitas, así que:

1. **Hacer público el repositorio**
   `Settings` → `General` → abajo del todo, `Change repository visibility` → `Public`.

2. **Activar GitHub Pages**
   `Settings` → `Pages` → en `Source` elige `Deploy from a branch`,
   rama `main`, carpeta `/ (root)` → `Save`.
   Tarda un par de minutos la primera vez.

3. **Instalarla en el iPhone**
   Abre <https://alejandrogonzalezcarro1.github.io/gym/> **en Safari**
   (tiene que ser Safari; desde Chrome no aparece la opción).
   Toca `Compartir` → `Añadir a pantalla de inicio` → `Añadir`.

Ya tienes el icono en la pantalla de inicio. Se abre a pantalla completa, sin barra de
direcciones, y funciona aunque el gimnasio no tenga cobertura.

> **Qué se hace público y qué no.** Al repositorio solo sube la app: la rutina, la base
> de alimentos y el texto de la guía, sin nombre, edad ni peso. Tu perfil lo introduces
> al abrirla por primera vez y no sale nunca del teléfono. La guía personal en `.md`
> no está en el repositorio a propósito.

---

## Qué hace

### Entreno
- Los 4 días con sus 7 ejercicios, imagen de técnica animada y enlace a vídeo.
- **Registro por serie**: repeticiones y kilos de cada serie, no solo un tick.
- **Doble progresión** (guía §3.1): cuando cierras el tope del rango en todas las
  series, la app te dice a qué peso subir la próxima vez, con el escalón real de cada
  ejercicio (2 kg en mancuernas, 5 kg en máquinas, 2,5 kg en barra EZ). En las
  dominadas asistidas progresar es *bajar* la asistencia, y lo tiene en cuenta.
- Referencia de la última sesión en cada ejercicio, para saber qué hay que batir.
- El peso se arrastra de una sesión a la siguiente; las series marcadas no.
- Temporizador de descanso con aviso sonoro.

### Nutrición
- Objetivo de calorías calculado desde tu peso (guía §5.1) y macros repartidos según
  §5.2: proteína a 1,8 g/kg, grasas ~25 % de las kcal con suelo de 60 g, carbos el resto.
- Cuatro comidas, cada una marcada en verde al llegar a 30 g de proteína.
- Base de ~45 alimentos con los básicos baratos de Finlandia de §5.3 (maitorahka,
  raejuusto, huevos, contramuslo, atún, legumbres…), con ración típica de un toque.
- Entrada manual para lo que no esté en la lista.
- Casillas de suplementos del día (creatina, vitamina D, whey).

### Progreso
- Peso corporal con **media de 4 semanas** y ritmo en kg/mes, que es como la guía pide
  tomar decisiones — nunca con el número de un día suelto.
- Cintura y recordatorio de fotos cada 4 semanas.
- El árbol de decisión de §7 completo, con el escenario que te toca resaltado según
  tu ritmo real.
- Historial de entrenos.
- Exportar e importar copia de seguridad.

### Guía
El resumen operativo de la guía v2: calibración, doble progresión, fases de RIR,
descarga, reglas de nutrición, proteína barata, suplementos, errores típicos y fuentes.

---

## Cambios respecto a la versión anterior

Seis fallos reales de `rutinaapp.html`, todos corregidos:

| Fallo | Qué pasaba | Arreglo |
|---|---|---|
| Temporizador congelado | `setInterval` restando 1 por tick: iOS congela los timers en segundo plano, así que al bloquear la pantalla el reloj se paraba | Se guarda la **fecha límite** y se recalcula al volver |
| Aviso mudo en iPhone | `navigator.vibrate` no existe en iOS Safari, y el `AudioContext` se creaba al vencer el temporizador, fuera de un gesto → nacía «suspended» y no sonaba | Un solo `AudioContext` desbloqueado al primer toque, con los pitidos **programados en la línea temporal del audio** (suenan aunque el JS esté congelado) |
| Series que no se reiniciaban | `sets:<id>` se guardaba sin fecha: entrenabas el lunes y el lunes siguiente seguía todo marcado | Estado con **sesiones por fecha**; al cambiar de día empieza vacío |
| Sin historial | Solo un campo de texto de peso y un contador de series, así que la doble progresión de la guía era imposible | Registro de reps y kilos por serie, con historial y sugerencia de subida |
| `esc()` incompleto | Escapaba `&` y `<` pero no comillas, y el resultado acababa dentro de atributos HTML | Escapa `& < > " '` |
| «Funciona sin conexión» | Lo decía el aviso de instalación, pero no había service worker | Service worker que precachea los 62 recursos |

Además: el manifest pasa de `data:` URI a archivo real, la animación de las fichas solo
corre en las tarjetas visibles, y el botón de reiniciar pide confirmación.

Las 50 imágenes salen de base64 a archivos propios: el HTML baja de **565 KB a 22 KB**,
las imágenes dejan de bloquear el primer pintado (cargan en paralelo y en diferido), y
pesan 364 KB en vez de los 487 KB que ocupaban codificadas en base64.

---

## Desarrollo

```bash
# servir en la misma subcarpeta que en producción (/gym/)
npx http-server .. -p 8080 -c-1
# → http://127.0.0.1:8080/gym/
```

Tras tocar cualquier archivo hay que regenerar el service worker, que lleva la lista de
recursos y una versión derivada del contenido:

```bash
python3 scripts/gen-sw.py
```

Si no lo haces, los navegadores que ya tengan la app instalada seguirán sirviendo la
versión antigua desde la caché.

### Estructura

```
index.html               maquetación y estilos
js/app.js                lógica: estado, entreno, nutrición, progreso, temporizador
js/datos-ejercicios.js   los 4 días y sus ejercicios
js/datos-alimentos.js    base de alimentos por 100 g
js/datos-guia.js         texto de la pestaña Guía
img/                     50 fotogramas de demostración (free-exercise-db)
icons/                   iconos de app y splash
sw.js                    service worker — GENERADO, no editar a mano
scripts/                 utilidades de construcción
```

### Notas técnicas

- **Rutas relativas siempre.** El sitio vive en `/gym/`, no en la raíz del dominio: una
  ruta absoluta como `/sw.js` apunta fuera del proyecto y rompe la instalación.
- **Los datos son frágiles por diseño.** iOS exime a las apps de pantalla de inicio del
  borrado de almacenamiento a los 7 días, pero la documentación de Apple es vaga y
  borrar los datos de Safari o cambiar de móvil se lo lleva todo. Exporta de vez en cuando.
- Los valores nutricionales son de referencia, redondeados. Si el producto trae
  etiqueta, manda la etiqueta.
