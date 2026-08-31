/* Rutina 4 días — Torso / Pierna / Torso / Pierna
 *
 * Campos por ejercicio:
 *   id      identificador estable (se usa como clave de historial)
 *   n       nombre
 *   img     base del archivo en img/ (se le añade _0.webp y _1.webp)
 *   tipo    Compuesto | Aislamiento | Isométrico
 *   eq      equipamiento
 *   sr      texto de series × reps
 *   rir     esfuerzo objetivo
 *   d       descanso en segundos
 *   dl      descanso en texto
 *   peso    orientación de peso inicial (guía §1)
 *   cue     recordatorio de técnica
 *   yt      búsqueda de YouTube para ver la técnica
 *   sets    nº de series (3 salvo que se indique)
 *   min/max rango de reps → motor de doble progresión (guía §3.1)
 *   inc     escalón mínimo de peso en kg (guía §3.1: 1-2 mancuernas, 2,5-5 máquinas y barras)
 *   unidad  cómo se interpreta el peso que registras
 *   corporal  true → sin carga externa
 *   tiempo    true → se registran segundos en vez de repeticiones
 *   inverso   true → progresar es BAJAR el número (asistencia), no subirlo
 */
window.DIAS = {
  A: {
    color: "var(--rojo)",
    dia: "Lunes",
    titulo: "Torso — pecho y hombro",
    sub: "~65 min · Calienta 5 min de cardio suave + 2 series de aproximación en el press",
    ej: [
      { id:"a1", n:"Press banca con mancuernas", img:"Dumbbell_Bench_Press", tipo:"Compuesto", eq:"Mancuernas + banco plano",
        sr:"3 × 8-10", rir:"RIR 2", d:150, dl:"2-3 min", peso:"10-14 kg/mano", min:8, max:10, inc:2, unidad:"kg/mano",
        cue:"Baja 2-3 s hasta rozar el pecho, omóplatos atrás y abajo.", yt:"dumbbell bench press form" },
      { id:"a2", n:"Jalón al pecho", img:"Wide-Grip_Lat_Pulldown", tipo:"Compuesto", eq:"Polea alta",
        sr:"3 × 10-12", rir:"RIR 2", d:120, dl:"2 min", peso:"35-45 kg", min:10, max:12, inc:5, unidad:"kg",
        cue:"Pecho arriba, codos hacia las costillas. Si tiras con los brazos, baja peso.", yt:"lat pulldown form" },
      { id:"a3", n:"Press militar sentado", img:"Seated_Dumbbell_Press", tipo:"Compuesto", eq:"Mancuernas + banco alto",
        sr:"3 × 10-12", rir:"RIR 2", d:120, dl:"2 min", peso:"8-10 kg/mano", min:10, max:12, inc:2, unidad:"kg/mano",
        cue:"Core apretado, no arquees la lumbar.", yt:"seated dumbbell shoulder press form" },
      { id:"a4", n:"Remo sentado en polea", img:"Seated_Cable_Rows", tipo:"Compuesto", eq:"Polea baja + agarre estrecho",
        sr:"3 × 10-12", rir:"RIR 2", d:120, dl:"2 min", peso:"30-40 kg", min:10, max:12, inc:5, unidad:"kg",
        cue:"Torso quieto, junta los omóplatos al final del tirón.", yt:"seated cable row form" },
      { id:"a5", n:"Elevaciones laterales", img:"Side_Lateral_Raise", tipo:"Aislamiento", eq:"Mancuernas",
        sr:"3 × 12-15", rir:"RIR 1", d:75, dl:"60-90 s", peso:"4-6 kg/mano", min:12, max:15, inc:2, unidad:"kg/mano",
        cue:"Hasta la altura del hombro. Lo que más te ensancha.", yt:"dumbbell lateral raise form" },
      { id:"a6", n:"Curl inclinado", img:"Incline_Dumbbell_Curl", tipo:"Aislamiento", eq:"Mancuernas + banco 45°",
        sr:"3 × 10-12", rir:"RIR 1", d:75, dl:"60-90 s", peso:"6-8 kg/mano", min:10, max:12, inc:2, unidad:"kg/mano",
        cue:"Codos atrás y fijos, supina la muñeca al subir.", yt:"incline dumbbell curl form" },
      { id:"a7", n:"Extensión de tríceps en polea", img:"Triceps_Pushdown_-_Rope_Attachment", tipo:"Aislamiento", eq:"Polea alta + cuerda",
        sr:"3 × 10-12", rir:"RIR 1", d:75, dl:"60-90 s", peso:"15-20 kg", min:10, max:12, inc:5, unidad:"kg",
        cue:"Codo pegado al costado, abre la cuerda abajo.", yt:"tricep rope pushdown form" }
    ]
  },

  B: {
    color: "var(--azul)",
    dia: "Martes",
    titulo: "Pierna y core",
    sub: "~60 min · Calienta 5 min de bici + 2 series de aproximación en la prensa",
    ej: [
      { id:"b1", n:"Prensa de piernas", img:"Leg_Press", tipo:"Compuesto", eq:"Máquina de prensa",
        sr:"3 × 10-12", rir:"RIR 2", d:150, dl:"2-3 min", peso:"60-80 kg", min:10, max:12, inc:5, unidad:"kg",
        cue:"Baja hasta 90° sin despegar la lumbar del respaldo.", yt:"leg press form" },
      { id:"b2", n:"Curl femoral", img:"Seated_Leg_Curl", tipo:"Aislamiento", eq:"Máquina femoral",
        sr:"3 × 10-12", rir:"RIR 2", d:120, dl:"2 min", peso:"25-35 kg", min:10, max:12, inc:5, unidad:"kg",
        cue:"Bajada lenta de 2-3 segundos.", yt:"seated leg curl form" },
      { id:"b3", n:"Sentadilla goblet", img:"Goblet_Squat", tipo:"Compuesto", eq:"Mancuerna o kettlebell",
        sr:"3 × 10-12", rir:"RIR 2", d:120, dl:"2 min", peso:"12-16 kg", min:10, max:12, inc:2, unidad:"kg",
        cue:"Mancuerna al pecho, talones firmes, rodillas en línea con los pies.", yt:"goblet squat form" },
      { id:"b4", n:"Extensión de cuádriceps", img:"Leg_Extensions", tipo:"Aislamiento", eq:"Máquina de extensiones",
        sr:"2 × 12-15", rir:"RIR 1", d:90, dl:"90 s", peso:"25-35 kg", sets:2, min:12, max:15, inc:5, unidad:"kg",
        cue:"Pausa de 1 segundo arriba.", yt:"leg extension form" },
      { id:"b5", n:"Elevación de gemelos", img:"Standing_Calf_Raises", tipo:"Aislamiento", eq:"Máquina o escalón",
        sr:"3 × 12-15", rir:"RIR 1", d:75, dl:"60-90 s", peso:"cómodo a 15", min:12, max:15, inc:5, unidad:"kg",
        cue:"Rango completo, pausa de 1-2 s abajo estirando.", yt:"standing calf raise form" },
      { id:"b6", n:"Crunch en polea alta", img:"Cable_Crunch", tipo:"Aislamiento", eq:"Polea alta + cuerda",
        sr:"3 × 12-15", rir:"RIR 1", d:60, dl:"60 s", peso:"25-30 kg", min:12, max:15, inc:5, unidad:"kg",
        cue:"Flexiona la columna; no tires con las caderas.", yt:"cable crunch form" },
      { id:"b7", n:"Plancha frontal", img:"Plank", tipo:"Isométrico", eq:"Peso corporal",
        sr:"3 × 30-45 s", rir:"—", d:60, dl:"60 s", peso:"corporal", min:30, max:45, inc:0,
        corporal:true, tiempo:true,
        cue:"Glúteo y abdomen apretados, cadera ni alta ni caída.", yt:"plank form" }
    ]
  },

  C: {
    color: "var(--amarillo)",
    dia: "Jueves",
    titulo: "Torso — espalda y brazos",
    sub: "~65 min · Calienta 5 min + 2 series de aproximación en dominadas/jalón",
    ej: [
      { id:"c1", n:"Dominadas asistidas", img:"Band_Assisted_Pull-Up", tipo:"Compuesto", eq:"Máquina asistida o goma",
        sr:"3 × 8-10", rir:"RIR 2", d:150, dl:"2-3 min", peso:"asistencia p/ 8", min:8, max:10, inc:5,
        unidad:"kg de asistencia", inverso:true,
        cue:"Ve quitando asistencia con las semanas. Objetivo: dominadas limpias.", yt:"assisted pull up form" },
      { id:"c2", n:"Press inclinado con mancuernas", img:"Incline_Dumbbell_Press", tipo:"Compuesto", eq:"Mancuernas + banco 30°",
        sr:"3 × 8-10", rir:"RIR 2", d:150, dl:"2-3 min", peso:"8-12 kg/mano", min:8, max:10, inc:2, unidad:"kg/mano",
        cue:"Pecho superior: la parte alta de la camiseta.", yt:"incline dumbbell press form" },
      { id:"c3", n:"Remo con mancuerna a una mano", img:"One-Arm_Dumbbell_Row", tipo:"Compuesto", eq:"Mancuerna + banco",
        sr:"3 × 10-12 /lado", rir:"RIR 2", d:105, dl:"90 s-2 min", peso:"14-18 kg", min:10, max:12, inc:2, unidad:"kg",
        cue:"Espalda plana apoyado en el banco, tira hacia la cadera.", yt:"one arm dumbbell row form" },
      { id:"c4", n:"Elevaciones laterales", img:"Side_Lateral_Raise", tipo:"Aislamiento", eq:"Mancuernas",
        sr:"3 × 12-15", rir:"RIR 1", d:75, dl:"60-90 s", peso:"4-6 kg/mano", min:12, max:15, inc:2, unidad:"kg/mano",
        cue:"Segunda ración semanal de deltoides lateral.", yt:"dumbbell lateral raise form" },
      { id:"c5", n:"Curl en banco predicador", img:"Preacher_Curl", tipo:"Aislamiento", eq:"Banco predicador + barra EZ",
        sr:"3 × 10-12", rir:"RIR 1", d:75, dl:"60-90 s", peso:"EZ 10-15 kg", min:10, max:12, inc:2.5, unidad:"kg",
        cue:"Axilas pegadas al pad, bajada de 2-3 s, sin soltar de golpe.", yt:"ez bar preacher curl form" },
      { id:"c6", n:"Curl martillo", img:"Hammer_Curls", tipo:"Aislamiento", eq:"Mancuernas",
        sr:"3 × 10-12", rir:"RIR 1", d:75, dl:"60-90 s", peso:"7-9 kg/mano", min:10, max:12, inc:2, unidad:"kg/mano",
        cue:"Agarre neutro: grosor de brazo, no solo pico.", yt:"hammer curl form" },
      { id:"c7", n:"Press francés con barra EZ", img:"EZ-Bar_Skullcrusher", tipo:"Aislamiento", eq:"Barra EZ + banco plano",
        sr:"3 × 10-12", rir:"RIR 1", d:75, dl:"60-90 s", peso:"EZ 12-17 kg", min:10, max:12, inc:2.5, unidad:"kg",
        cue:"Codos al techo; baja a la frente o algo detrás.", yt:"ez bar skull crusher form" }
    ]
  },

  D: {
    color: "var(--verde)",
    dia: "Viernes",
    titulo: "Pierna y hombro posterior",
    sub: "~60 min · Calienta 5 min + 2 series de aproximación en el rumano",
    ej: [
      { id:"d1", n:"Peso muerto rumano con mancuernas", img:"Stiff-Legged_Dumbbell_Deadlift", tipo:"Compuesto", eq:"Mancuernas",
        sr:"3 × 10-12", rir:"RIR 2", d:150, dl:"2-3 min", peso:"12-16 kg/mano", min:10, max:12, inc:2, unidad:"kg/mano",
        cue:"Cadera atrás, rodillas semiflexionadas, espalda neutra siempre.", yt:"dumbbell romanian deadlift form" },
      { id:"d2", n:"Zancadas con mancuernas", img:"Dumbbell_Lunges", tipo:"Compuesto", eq:"Mancuernas",
        sr:"3 × 10-12 /pierna", rir:"RIR 2", d:120, dl:"2 min", peso:"6-10 kg/mano", min:10, max:12, inc:2, unidad:"kg/mano",
        cue:"Paso largo, rodilla trasera casi al suelo.", yt:"dumbbell lunge form" },
      { id:"d3", n:"Prensa de piernas", img:"Leg_Press", tipo:"Compuesto", eq:"Máquina de prensa",
        sr:"3 × 12-15", rir:"RIR 2", d:120, dl:"2 min", peso:"~70% del día B", min:12, max:15, inc:5, unidad:"kg",
        cue:"Pies algo más altos en la plataforma: más glúteo y femoral.", yt:"leg press high foot placement" },
      { id:"d4", n:"Face pull", img:"Face_Pull", tipo:"Aislamiento", eq:"Polea alta + cuerda",
        sr:"3 × 15", rir:"RIR 1", d:75, dl:"60-90 s", peso:"15-20 kg", min:15, max:15, inc:5, unidad:"kg",
        cue:"Cuerda hacia la cara, codos altos. Salud de hombro: innegociable.", yt:"face pull form" },
      { id:"d5", n:"Pájaros", img:"Reverse_Flyes", tipo:"Aislamiento", eq:"Mancuernas",
        sr:"3 × 12-15", rir:"RIR 1", d:60, dl:"60 s", peso:"4-6 kg/mano", min:12, max:15, inc:2, unidad:"kg/mano",
        cue:"Torso inclinado, brazos casi rectos, aprieta la parte trasera del hombro.", yt:"rear delt fly dumbbell form" },
      { id:"d6", n:"Elevación de gemelos", img:"Standing_Calf_Raises", tipo:"Aislamiento", eq:"Máquina o escalón",
        sr:"3 × 12-15", rir:"RIR 1", d:60, dl:"60 s", peso:"igual que día B", min:12, max:15, inc:5, unidad:"kg",
        cue:"Rango completo, pausa abajo.", yt:"standing calf raise form" },
      { id:"d7", n:"Elevación de rodillas colgado", img:"Hanging_Leg_Raise", tipo:"Aislamiento", eq:"Barra de dominadas",
        sr:"3 × 10-15", rir:"RIR 1", d:60, dl:"60 s", peso:"corporal", min:10, max:15, inc:0, corporal:true,
        cue:"Rodillas al pecho sin balanceo. Si no llegas: en banco.", yt:"hanging knee raise form" }
    ]
  }
};

/* Día sugerido según el día de la semana (guía §1: Lun, Mar, Jue, Vie). */
window.DIA_SUGERIDO = { 1:"A", 2:"B", 4:"C", 5:"D" };
