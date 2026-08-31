/* Rutina 4 días — Tren inferior / Tren superior / Tren inferior / Tren superior
 *
 * Diseñada en versión conservadora de tobillo: máquinas, movimientos sentados o
 * tumbados, sin equilibrio a una pierna, sin impacto y sin carga directa sobre
 * el tobillo. Rangos de 10-20 reps y descansos cortos en el trabajo accesorio,
 * porque el objetivo incluye resistencia.
 *
 * Campos: ver el README. Añadidos respecto a la otra app:
 *   tobillo  true → muestra el aviso de tobillo en la tarjeta
 *   pilar    true → ejercicio central del plan, se destaca
 *   acond    true → bloque de acondicionamiento por intervalos
 */
window.DIAS = {
  A: {
    color: "var(--rojo)",
    dia: "Lunes",
    corto: "Inferior",
    titulo: "Tren inferior — énfasis glúteo",
    sub: "~60 min · Calienta 5-6 min de bici suave + 2 series de aproximación en el hip thrust",
    ej: [
      { id:"a1", n:"Hip thrust", img:"Barbell_Hip_Thrust", tipo:"Compuesto", eq:"Máquina de hip thrust o barra + banco",
        sr:"3 × 10-12", rir:"RIR 3", d:120, dl:"2 min", peso:"20-30 kg", min:10, max:12, inc:5, unidad:"kg", pilar:true,
        cue:"El ejercicio central de tu plan. Empuja con los talones, aprieta el glúteo 1 s arriba, barbilla al pecho. Cero carga en el tobillo.",
        yt:"hip thrust form" },
      { id:"a2", n:"Prensa de piernas, pies altos", img:"Leg_Press", tipo:"Compuesto", eq:"Máquina de prensa",
        sr:"3 × 12-15", rir:"RIR 3", d:120, dl:"2 min", peso:"40-60 kg", min:12, max:15, inc:5, unidad:"kg", tobillo:true,
        cue:"Pies altos y anchos en la plataforma: más glúteo y femoral. Baja solo hasta donde el tobillo no note nada.",
        yt:"leg press high foot placement" },
      { id:"a3", n:"Curl femoral sentado", img:"Seated_Leg_Curl", tipo:"Aislamiento", eq:"Máquina femoral",
        sr:"3 × 12-15", rir:"RIR 3", d:90, dl:"90 s", peso:"20-30 kg", min:12, max:15, inc:5, unidad:"kg",
        cue:"Bajada lenta de 3 segundos. Sin implicación del tobillo.", yt:"seated leg curl form" },
      { id:"a4", n:"Abducción de cadera sentada", img:"Thigh_Abductor", tipo:"Aislamiento", eq:"Máquina de abductores",
        sr:"3 × 15-20", rir:"RIR 2", d:60, dl:"60 s", peso:"25-35 kg", min:15, max:20, inc:5, unidad:"kg",
        cue:"Glúteo medio: es lo que da forma redondeada al lateral de la cadera. Inclínate un poco hacia delante.",
        yt:"hip abduction machine form" },
      { id:"a5", n:"Extensión de cuádriceps", img:"Leg_Extensions", tipo:"Aislamiento", eq:"Máquina de extensiones",
        sr:"3 × 12-15", rir:"RIR 2", d:60, dl:"60 s", peso:"20-30 kg", min:12, max:15, inc:5, unidad:"kg",
        cue:"Pausa de 1 segundo arriba.", yt:"leg extension form" },
      { id:"a6", n:"Hiperextensión a 45°", img:"Hyperextensions_Back_Extensions", tipo:"Aislamiento", eq:"Banco a 45°",
        sr:"3 × 12-15", rir:"RIR 2", d:60, dl:"60 s", peso:"corporal", min:12, max:15, inc:0, corporal:true,
        cue:"Redondea ligeramente la espalda alta y aprieta el glúteo al subir. Si te marea, salta este ejercicio.",
        yt:"45 degree back extension glute form" },
      { id:"a7", n:"Plancha frontal", img:"Plank", tipo:"Isométrico", eq:"Peso corporal",
        sr:"3 × 30-40 s", rir:"—", d:15, dl:"sin descanso", peso:"corporal", min:30, max:40, inc:0,
        corporal:true, tiempo:true, circuito:"Circuito de core, ronda 1 de 2",
        cue:"Encadena con el dead bug sin descansar.", yt:"plank form" },
      { id:"a8", n:"Dead bug", img:"Dead_Bug", tipo:"Isométrico", eq:"Peso corporal",
        sr:"3 × 10 /lado", rir:"—", d:45, dl:"45 s", peso:"corporal", min:10, max:12, inc:0,
        corporal:true, circuito:"Circuito de core, ronda 2 de 2",
        cue:"Lumbar pegada al suelo todo el rato. Descansa aquí y repite la ronda.", yt:"dead bug exercise form" }
    ]
  },

  B: {
    color: "var(--azul)",
    dia: "Martes",
    corto: "Superior",
    titulo: "Tren superior",
    sub: "~55 min · Calienta 5-6 min de bici + 2 series de aproximación en el jalón",
    ej: [
      { id:"b1", n:"Jalón al pecho", img:"Wide-Grip_Lat_Pulldown", tipo:"Compuesto", eq:"Polea alta",
        sr:"3 × 10-12", rir:"RIR 3", d:120, dl:"2 min", peso:"25-35 kg", min:10, max:12, inc:5, unidad:"kg",
        cue:"Pecho arriba, codos hacia las costillas. Construye la espalda que estiliza la cintura.",
        yt:"lat pulldown form" },
      { id:"b2", n:"Press de pecho en máquina", img:"Leverage_Chest_Press", tipo:"Compuesto", eq:"Máquina de press",
        sr:"3 × 10-12", rir:"RIR 3", d:120, dl:"2 min", peso:"15-25 kg", min:10, max:12, inc:5, unidad:"kg",
        cue:"Máquina antes que mancuernas mientras aprendes el patrón.", yt:"chest press machine form" },
      { id:"b3", n:"Remo sentado en polea", img:"Seated_Cable_Rows", tipo:"Compuesto", eq:"Polea baja",
        sr:"3 × 12-15", rir:"RIR 3", d:90, dl:"90 s", peso:"20-30 kg", min:12, max:15, inc:5, unidad:"kg",
        cue:"Torso quieto, junta los omóplatos al final del tirón.", yt:"seated cable row form" },
      { id:"b4", n:"Press de hombro en máquina", img:"Machine_Shoulder_Military_Press", tipo:"Compuesto", eq:"Máquina de press de hombro",
        sr:"3 × 12-15", rir:"RIR 2", d:90, dl:"90 s", peso:"10-20 kg", min:12, max:15, inc:5, unidad:"kg",
        cue:"Core apretado, sin arquear la lumbar.", yt:"machine shoulder press form" },
      { id:"b5", n:"Elevaciones laterales", img:"Side_Lateral_Raise", tipo:"Aislamiento", eq:"Mancuernas",
        sr:"3 × 12-15", rir:"RIR 2", d:45, dl:"45 s", peso:"3-4 kg/mano", min:12, max:15, inc:1, unidad:"kg/mano",
        cue:"Hombros más anchos = cintura visualmente más estrecha.", yt:"dumbbell lateral raise form" },
      { id:"b6", n:"Curl de bíceps en polea", img:"Standing_Biceps_Cable_Curl", tipo:"Aislamiento", eq:"Polea baja",
        sr:"3 × 12-15", rir:"RIR 2", d:45, dl:"45 s", peso:"10-15 kg", min:12, max:15, inc:2.5, unidad:"kg",
        cue:"Codos fijos al costado, sin balancear el cuerpo.", yt:"cable biceps curl form" },
      { id:"b7", n:"Extensión de tríceps en polea", img:"Triceps_Pushdown_-_Rope_Attachment", tipo:"Aislamiento", eq:"Polea alta + cuerda",
        sr:"3 × 12-15", rir:"RIR 2", d:45, dl:"45 s", peso:"10-15 kg", min:12, max:15, inc:2.5, unidad:"kg",
        cue:"Codo pegado al costado, solo se mueve el antebrazo.", yt:"tricep rope pushdown form" }
    ]
  },

  C: {
    color: "var(--amarillo)",
    dia: "Jueves",
    corto: "Inferior",
    titulo: "Tren inferior — cuádriceps y femoral",
    sub: "~60 min · Calienta 5-6 min de bici + 2 series de aproximación en el rumano",
    ej: [
      { id:"c1", n:"Peso muerto rumano con mancuernas", img:"Stiff-Legged_Dumbbell_Deadlift", tipo:"Compuesto", eq:"Mancuernas",
        sr:"3 × 10-12", rir:"RIR 3", d:120, dl:"2 min", peso:"8-12 kg/mano", min:10, max:12, inc:2, unidad:"kg/mano", tobillo:true,
        cue:"De pie pero sin desequilibrio: pies fijos, cadera atrás, espalda neutra. Si el tobillo protesta, cámbialo por curl femoral tumbado.",
        yt:"dumbbell romanian deadlift form" },
      { id:"c2", n:"Prensa de piernas, pies bajos", img:"Leg_Press", tipo:"Compuesto", eq:"Máquina de prensa",
        sr:"3 × 10-12", rir:"RIR 3", d:120, dl:"2 min", peso:"40-60 kg", min:10, max:12, inc:5, unidad:"kg", tobillo:true,
        cue:"Pies bajos y juntos: más cuádriceps. Mismo límite de rango que el día 1.", yt:"leg press form" },
      { id:"c3", n:"Hip thrust", img:"Barbell_Hip_Thrust", tipo:"Compuesto", eq:"Máquina de hip thrust o barra + banco",
        sr:"3 × 12-15", rir:"RIR 2", d:90, dl:"90 s", peso:"~80 % del día 1", min:12, max:15, inc:5, unidad:"kg", pilar:true,
        cue:"Segunda dosis semanal de glúteo. La frecuencia 2× por semana es la que hace crecer.",
        yt:"hip thrust form" },
      { id:"c4", n:"Curl femoral tumbado", img:"Lying_Leg_Curls", tipo:"Aislamiento", eq:"Máquina femoral",
        sr:"3 × 12-15", rir:"RIR 2", d:90, dl:"90 s", peso:"15-25 kg", min:12, max:15, inc:5, unidad:"kg",
        cue:"Bajada controlada, sin dar tirones con la cadera.", yt:"lying leg curl form" },
      { id:"c5", n:"Abducción de cadera sentada", img:"Thigh_Abductor", tipo:"Aislamiento", eq:"Máquina de abductores",
        sr:"3 × 15-20", rir:"RIR 2", d:60, dl:"60 s", peso:"25-35 kg", min:15, max:20, inc:5, unidad:"kg",
        cue:"Segunda ración semanal de glúteo medio.", yt:"hip abduction machine form" },
      { id:"c6", n:"Extensión de cuádriceps", img:"Leg_Extensions", tipo:"Aislamiento", eq:"Máquina de extensiones",
        sr:"3 × 15-20", rir:"RIR 2", d:60, dl:"60 s", peso:"algo menos que el día 1", min:15, max:20, inc:5, unidad:"kg",
        cue:"Reps más altas hoy: baja el peso respecto al lunes.", yt:"leg extension form" },
      { id:"c7", n:"Crunch en polea alta", img:"Cable_Crunch", tipo:"Aislamiento", eq:"Polea alta + cuerda",
        sr:"3 × 15", rir:"RIR 2", d:15, dl:"sin descanso", peso:"15-20 kg", min:15, max:15, inc:2.5, unidad:"kg",
        circuito:"Circuito de core, ronda 1 de 2",
        cue:"Flexiona la columna; no tires con las caderas. Encadena con la plancha lateral.", yt:"cable crunch form" },
      { id:"c8", n:"Plancha lateral", img:"Side_Bridge", tipo:"Isométrico", eq:"Peso corporal",
        sr:"3 × 20-30 s /lado", rir:"—", d:45, dl:"45 s", peso:"corporal", min:20, max:30, inc:0,
        corporal:true, tiempo:true, circuito:"Circuito de core, ronda 2 de 2",
        cue:"Cadera alta, cuerpo en línea. Descansa aquí y repite la ronda.", yt:"side plank form" }
    ]
  },

  D: {
    color: "var(--verde)",
    dia: "Viernes",
    corto: "Superior",
    titulo: "Tren superior + acondicionamiento",
    sub: "~60 min · Calienta 5-6 min de bici + 2 series de aproximación en el jalón",
    ej: [
      { id:"d1", n:"Jalón agarre neutro o dominadas asistidas", img:"Band_Assisted_Pull-Up", tipo:"Compuesto", eq:"Máquina asistida o polea",
        sr:"3 × 10-12", rir:"RIR 3", d:120, dl:"2 min", peso:"asistencia p/ 10", min:10, max:12, inc:5,
        unidad:"kg de asistencia", inverso:true,
        cue:"Progresar aquí es bajar la asistencia, no subirla.", yt:"assisted pull up form" },
      { id:"d2", n:"Press inclinado", img:"Incline_Dumbbell_Press", tipo:"Compuesto", eq:"Máquina o mancuernas, banco 30°",
        sr:"3 × 10-12", rir:"RIR 3", d:120, dl:"2 min", peso:"6-8 kg/mano", min:10, max:12, inc:2, unidad:"kg/mano",
        cue:"Banco a 30°, recorrido completo y controlado.", yt:"incline press form" },
      { id:"d3", n:"Remo con mancuerna a una mano", img:"One-Arm_Dumbbell_Row", tipo:"Compuesto", eq:"Mancuerna + banco",
        sr:"3 × 12-15 /lado", rir:"RIR 2", d:90, dl:"90 s", peso:"8-12 kg", min:12, max:15, inc:2, unidad:"kg",
        cue:"Apoyada en el banco, no de pie a una pierna. Tira hacia la cadera.", yt:"one arm dumbbell row form" },
      { id:"d4", n:"Face pull", img:"Face_Pull", tipo:"Aislamiento", eq:"Polea alta + cuerda",
        sr:"3 × 15", rir:"RIR 2", d:60, dl:"60 s", peso:"10-15 kg", min:15, max:15, inc:2.5, unidad:"kg",
        cue:"Postura y salud del hombro. Si pasas horas sentada estudiando, este te va a sentar bien.",
        yt:"face pull form" },
      { id:"d5", n:"Elevaciones laterales", img:"Side_Lateral_Raise", tipo:"Aislamiento", eq:"Mancuernas",
        sr:"3 × 15", rir:"RIR 2", d:45, dl:"45 s", peso:"3-4 kg/mano", min:15, max:15, inc:1, unidad:"kg/mano",
        cue:"Sube hasta la altura del hombro, sin encoger el trapecio.", yt:"dumbbell lateral raise form" },
      { id:"d6", n:"Curl martillo", img:"Hammer_Curls", tipo:"Aislamiento", eq:"Mancuernas",
        sr:"3 × 12-15", rir:"RIR 2", d:45, dl:"45 s", peso:"5-7 kg/mano", min:12, max:15, inc:1, unidad:"kg/mano",
        cue:"Agarre neutro, codos fijos.", yt:"hammer curl form" },
      { id:"d7", n:"Acondicionamiento por intervalos", img:"Bicycling_Stationary", tipo:"Cardio", eq:"Bici estática o remo",
        sr:"5-6 rondas de 40 s", rir:"—", d:80, dl:"80 s suave", peso:"—", min:40, max:40, inc:0,
        sets:6, corporal:true, tiempo:true, acond:true,
        cue:"40 s fuerte y 80 s suave. El temporizador de descanso ES la parte suave: dale a la serie y pedalea flojo hasta que suene. Aquí se construye la resistencia.",
        yt:"stationary bike interval training" }
    ]
  }
};

/* Día sugerido según el día de la semana (Lun, Mar, Jue, Vie). */
window.DIA_SUGERIDO = { 1:"A", 2:"B", 4:"C", 5:"D" };

/* Aviso permanente de la guía: el tobillo manda sobre todo lo demás. */
window.AVISO_TOBILLO =
  "Esta rutina está diseñada en versión conservadora de tobillo. Aun así, enséñasela a tu fisio " +
  "antes de empezar y pregúntale en concreto por prensa, hip thrust, peso muerto rumano y bici. " +
  "Si notas cualquier molestia en el tobillo durante o después de un ejercicio, ese ejercicio sale " +
  "del plan hasta que lo hables con tu fisio.";
