/* Contenido de la pestaña Guía.
 * Resumen operativo: lo que hay que consultar en el gimnasio.
 * Sin datos personales — el perfil (peso, altura) se introduce en el móvil y
 * vive únicamente en el almacenamiento de este dispositivo.
 */
window.GUIA = [
  {
    id: "avisos",
    h: "Antes de nada: dos avisos",
    abierto: true,
    html: `
      <h4>1. El tobillo manda sobre todo lo demás</h4>
      <p>Toda la rutina de tren inferior está diseñada en versión conservadora: máquinas,
      movimientos sentados o tumbados, sin equilibrio a una pierna, sin impacto y sin carga
      directa sobre el tobillo.</p>
      <p class="gaviso"><b>Aun así, enseña esta rutina a tu fisio antes de empezar.</b> Es quien sabe
      qué lesión es, en qué fase estás y qué rangos tienes permitidos. Pregúntale en concreto por:
      prensa de piernas, hip thrust, peso muerto rumano, bicicleta estática y cuántos pasos diarios
      puedes hacer.</p>

      <h4>2. El cansancio puede no ser solo falta de forma</h4>
      <p>Entrenar ayuda, pero la <b>deficiencia de hierro</b> es una causa muy común de ese mismo
      síntoma en mujeres jóvenes, y no siempre aparece como anemia en un análisis básico: se puede
      tener la hemoglobina normal y la ferritina baja, con cansancio, peor recuperación y menos
      resistencia.</p>
      <p>No es un diagnóstico. Es una petición concreta que puedes hacer en tu terveysasema:
      <b>análisis de sangre con hemoglobina y ferritina</b> — las dos, porque mirar solo la
      hemoglobina deja pasar casos. Si sale bien, descartado. Si sale baja, tratarlo puede cambiarte
      más el nivel de energía que seis meses de gimnasio.</p>`
  },
  {
    id: "definir",
    h: "Una aclaración sobre «definir»",
    html: `
      <p>No existe un entrenamiento de «tonificar» distinto del de ganar músculo. Lo que llamamos
      definición es una sola cosa: <b>tener músculo debajo y menos grasa encima</b>. Se consigue con
      entrenamiento de fuerza de verdad más un déficit calórico moderado.</p>
      <p>No hay pesos ligeros mágicos ni ejercicios que «afinen» una zona: la grasa no se pierde
      localmente, se pierde de todo el cuerpo a la vez y en el orden que decide tu genética.</p>
      <p>La buena noticia: la <b>recomposición corporal</b> (perder grasa y ganar músculo a la vez)
      está bien documentada y es fiable en principiantes sin entrenar, en personas con más porcentaje
      graso y durante el primer año de entrenamiento estructurado. Es un privilegio de principiante
      que no se repite.</p>`
  },
  {
    id: "resumen",
    h: "Resumen ejecutivo",
    html: `
      <table class="gtabla">
        <tr><td>Estructura</td><td>Inferior / Superior / Inferior / Superior — Lun, Mar, Jue, Vie</td></tr>
        <tr><td>Series y reps</td><td>3 series, 10-20 reps según ejercicio</td></tr>
        <tr><td>Esfuerzo</td><td>RIR 3 las semanas 1-3 → RIR 2 después</td></tr>
        <tr><td>Descanso</td><td>90-120 s en los grandes · 45-60 s en el resto</td></tr>
        <tr><td>Progresión</td><td>Doble progresión: reps hasta el tope del rango → subir peso</td></tr>
        <tr><td>Calorías</td><td>Mantenimiento − 350 kcal, con suelo de 1.600</td></tr>
        <tr><td>Proteína</td><td>~135 g/día repartidos en <b>3 comidas</b>, no 2</td></tr>
        <tr><td>Ritmo de pérdida</td><td>0,3-0,5 kg/semana como máximo</td></tr>
        <tr><td>Cardio</td><td>2 sesiones/semana, sin impacto</td></tr>
        <tr><td>Suplementos</td><td>Creatina 5 g · Vitamina D · Hierro solo si el análisis lo indica</td></tr>
        <tr><td>Sueño</td><td>7-9 h</td></tr>
        <tr><td>Descarga</td><td>1 semana suave cada 8-10 semanas</td></tr>
        <tr><td>Revisión</td><td>Cada 4 semanas: peso, medidas, fuerza, fotos y energía</td></tr>
      </table>`
  },
  {
    id: "estructura",
    h: "Por qué esta estructura",
    html: `
      <p><b>Frecuencia 2× por semana para todo.</b> Es lo que la investigación señala como óptimo,
      y aplica igual a glúteos que a bíceps.</p>
      <p><b>Volumen de glúteo: 12 series directas por semana</b> (hip thrust ×2 días, abducción ×2 días)
      más lo que aportan prensa, rumano e hiperextensión. Parte alta del rango productivo, que es lo
      que corresponde a un músculo prioritario.</p>
      <p><b>Por qué el hip thrust es el pilar.</b> Un estudio de 2023 comparó nueve semanas de hip
      thrust contra sentadilla en personas sin entrenar, con volumen igualado: ambos produjeron
      aumentos similares del glúteo mayor, pero la sentadilla generó más crecimiento de cuádriceps y
      aductores. Como el tobillo no permite sentadilla libre por ahora, el hip thrust da el estímulo
      de glúteo sin la exigencia técnica ni articular, y la prensa cubre el cuádriceps. Combinarlo con
      al menos un ejercicio de glúteo en posición alargada da mejores resultados que uno solo — ese
      papel lo hacen el rumano y la hiperextensión.</p>
      <p><b>Repeticiones más altas (10-20) y descansos más cortos.</b> No por ser mujer, sino porque el
      objetivo incluye resistencia. Rangos altos con 45-60 s de descanso en el accesorio entrenan la
      capacidad de sostener esfuerzo. El músculo crece bien en todo el rango de 5 a 30 reps mientras el
      esfuerzo sea real.</p>
      <p><b>Abdomen: 6 series semanales de core directo.</b> Ojo con la expectativa: los abdominales se
      ven cuando baja la grasa, no cuando se hacen muchos crunches. El core de aquí es para fuerza y
      postura; la parte visual la hace la nutrición.</p>`
  },
  {
    id: "cardio",
    h: "Cardio y pasos (con el tobillo)",
    html: `
      <table class="gtabla">
        <tr><th>Opción</th><th>Impacto</th><th>Notas</th></tr>
        <tr><td><b>Natación</b></td><td>Ninguno</td><td>La mejor opción. Cardio completo, cero carga articular. Helsinki está llena de piscinas municipales baratas</td></tr>
        <tr><td>Bici estática</td><td>Bajo</td><td>Cómoda y medible. Confírmalo con el fisio</td></tr>
        <tr><td>Elíptica</td><td>Medio</td><td>El pie va fijo pero el tobillo trabaja. Solo con permiso</td></tr>
        <tr><td>Remo</td><td>Medio-alto</td><td>Carga el tobillo en la fase de empuje. Por ahora, mejor no</td></tr>
        <tr><td>Correr / andar mucho</td><td>Alto</td><td><b>Fuera del plan hasta que el fisio lo autorice</b></td></tr>
      </table>
      <p><b>Plan:</b> 2 sesiones de 20-30 min a intensidad suave-media por semana, en los días libres
      (miércoles y sábado o domingo), más el bloque de intervalos del día 4.</p>
      <p><b>Sobre los pasos:</b> sin cifra hasta que el fisio diga cuánto tolera el tobillo.
      Sustitúyelos por bici o natación mientras tanto.</p>`
  },
  {
    id: "calibracion",
    h: "Calibración de pesos (semanas 1-2)",
    html: `
      <p>Los pesos orientativos son un punto de partida, no tu peso real.</p>
      <p><b>Semana 1 — explorar.</b> Tras la primera serie pregúntate: ¿podría haber hecho 5 reps más?</p>
      <ul>
        <li>Sí, de sobra → sube un escalón en la siguiente serie</li>
        <li>Justo 2-3 más → ese es tu peso, apúntalo</li>
        <li>No llegué al mínimo del rango → baja</li>
      </ul>
      <p><b>Semana 2 — confirmar.</b> Repite con los pesos apuntados. Al final tienes tu tabla personal.</p>
      <p class="gaviso">La técnica va por delante del peso, siempre. Y con el tobillo hay una regla
      añadida: <b>si notas cualquier molestia durante o después de un ejercicio, ese ejercicio sale del
      plan hasta que lo hables con tu fisio.</b> No lo negocies contigo misma.</p>`
  },
  {
    id: "progresion",
    h: "Doble progresión",
    html: `
      <pre class="gpre">Semana 1:  25 kg → 10, 10, 10   (entras por abajo del rango 10-12)
Semana 2:  25 kg → 11, 10, 10
Semana 3:  25 kg → 12, 11, 10
Semana 4:  25 kg → 12, 12, 11
Semana 5:  25 kg → 12, 12, 12   ✅ tope en las 3 series
Semana 6:  30 kg → 10, 10, 9    (subes peso, vuelves a empezar)</pre>
      <p>Sube el escalón mínimo: 1-2 kg en mancuernas, 2,5-5 kg en máquinas.</p>
      <p><b>Las primeras 6-8 semanas subirás casi cada semana.</b> Es adaptación del sistema nervioso,
      no todavía músculo. Después el ritmo baja y es normal.</p>
      <p class="gnota">La app te marca el ejercicio y te propone el siguiente peso cuando cierras el
      tope del rango en todas las series.</p>`
  },
  {
    id: "rir",
    h: "Esfuerzo por fases",
    html: `
      <table class="gtabla">
        <tr><th>Fase</th><th>Semanas</th><th>RIR</th></tr>
        <tr><td>Aprendizaje</td><td>1-3</td><td>3</td></tr>
        <tr><td>Construcción</td><td>4-8</td><td>2</td></tr>
        <tr><td>Consolidación</td><td>9-10</td><td>1-2</td></tr>
        <tr><td><b>Descarga</b></td><td>11</td><td>4-5, mitad de series</td></tr>
        <tr><td>Siguiente ciclo</td><td>12+</td><td>2</td></tr>
      </table>
      <p>RIR = repeticiones que te quedan en recámara al acabar la serie.</p>`
  },
  {
    id: "descanso",
    h: "Descanso y recuperación",
    html: `
      <p><b>Entre series:</b> 90-120 s en los dos primeros ejercicios, 45-60 s en el resto. Los descansos
      cortos del accesorio son parte del entrenamiento de resistencia, no un atajo para acabar antes.</p>
      <p><b>Entre sesiones:</b> miércoles, sábado y domingo sin pesas. El cardio suave va en esos días.</p>
      <p><b>Sueño 7-9 h.</b> Con este objetivo no es relleno: dormir poco te va a dejar cansada hagas lo
      que hagas en el gimnasio, y sabotea tanto la recuperación como el control del apetito. Si tienes
      que arreglar una sola cosa fuera del gimnasio, es esta.</p>
      <p><b>Descarga cada 8-10 semanas:</b> misma rutina, 2 series en vez de 3, 60-70 % del peso.</p>`
  },
  {
    id: "nutricion",
    h: "Nutrición: las reglas",
    html: `
      <p><b>Déficit moderado de ~350 kcal.</b> El punto óptimo para recomposición está en unas 200-400 kcal
      por debajo del mantenimiento: suficientemente pequeño para seguir construyendo músculo mientras
      tiras de la grasa. Un déficit agresivo mueve más rápido la báscula, pero cuesta músculo,
      rendimiento y energía — justo lo contrario de lo que buscas.</p>
      <p class="gaviso"><b>Suelo innegociable: no bajes de 1.600 kcal.</b> Por debajo es muy difícil cubrir
      micronutrientes y el cansancio empeora en lugar de mejorar. Si te ves con hambre constante, sin
      fuerza y de mal humor, la respuesta es comer más, no menos.</p>
      <table class="gtabla">
        <tr><th>Macro</th><th>Objetivo</th><th>Por qué</th></tr>
        <tr><td><b>Proteína</b></td><td>~135 g</td><td>Lo más importante del plan. En déficit es lo que hace que pierdas grasa y no músculo. Y sacia mucho más que carbos o grasa</td></tr>
        <tr><td>Grasas</td><td>~60 g</td><td>Suelo hormonal. No bajes de 50 g</td></tr>
        <tr><td>Carbos</td><td>El resto</td><td>Energía para entrenar. No los elimines: son lo que te evita entrenar cansada</td></tr>
      </table>
      <h4>El cambio que más te va a notar: de 2 comidas a 3</h4>
      <p>Meter 135 g de proteína en dos comidas son casi 70 g de golpe: mucho volumen y difícil de
      sostener. Y pasar toda la mañana sin comer encaja bastante con «me canso mucho».
      <b>Añade un desayuno con proteína, unos 40-45 g.</b> No hace falta cocinar.</p>
      <p class="gnota">Truco práctico para los tuppers compartidos: misma comida, misma proteína,
      menos guarnición de arroz/pasta/patata en tu plato. No hace falta cocinar dos veces.</p>`
  },
  {
    id: "proteinabarata",
    h: "Proteína barata (Finlandia)",
    html: `
      <p>Por € por gramo de proteína, en orden aproximado:</p>
      <ol>
        <li>Huevos</li>
        <li>Rahka / maitorahka — muchísima proteína por euro, cero preparación, aguanta en la mochila</li>
        <li>Pollo entero o contramuslos</li>
        <li>Atún en lata</li>
        <li>Legumbres (lentejas, garbanzos)</li>
        <li>Queso fresco</li>
        <li>Leche</li>
        <li>Raejuusto (cottage)</li>
      </ol>`
  },
  {
    id: "ciclo",
    h: "Ciclo menstrual",
    html: `
      <p>La forma de saber si te afecta es medirlo, no adivinarlo: apunta cada día tu energía del 1 al 5
      y el día de ciclo. En dos o tres meses vas a ver si hay un patrón real.</p>
      <p>Si lo hay, el ajuste es simple y no cambia el plan: en los días de peor energía mantienes la
      rutina pero bajas peso o series y aceptas RIR 3-4. <b>No se salta la sesión, se hace más suave.</b></p>
      <p class="gnota">Muchas mujeres no notan diferencia relevante, así que no asumas que la vas a tener.</p>`
  },
  {
    id: "seguimiento",
    h: "Qué medir",
    html: `
      <p>La báscula sola te va a engañar, porque estás ganando músculo mientras pierdes grasa. Durante la
      recomposición es normal y esperable que la báscula se mueva poco: algunas semanas sube algo, otras
      baja, porque los dos cambios se cancelan entre sí. Por eso medimos cuatro cosas:</p>
      <table class="gtabla">
        <tr><th>Métrica</th><th>Frecuencia</th><th>Cómo</th></tr>
        <tr><td>Peso</td><td>1×/semana</td><td>Ayunas, misma hora. Decisiones solo con la media de 4 semanas</td></tr>
        <tr><td><b>Medidas</b></td><td>Cada 4 semanas</td><td>Cintura (ombligo), cadera (parte más ancha), muslo. Más fiable que el peso</td></tr>
        <tr><td>Fuerza</td><td>Cada sesión</td><td>La app lo registra. Testigos: hip thrust, prensa, jalón</td></tr>
        <tr><td>Fotos</td><td>Cada 4 semanas</td><td>Frente, lado, espalda. Misma luz, misma hora, mismo sitio</td></tr>
        <tr><td><b>Energía</b></td><td>Diaria, 1-5</td><td>Tu objetivo principal. Si sube la media mensual, el plan funciona</td></tr>
      </table>`
  },
  {
    id: "expectativas",
    h: "Expectativas realistas",
    html: `
      <ul>
        <li><b>Semanas 1-3:</b> agujetas, aprendizaje, subidas rápidas de peso en las máquinas. Ningún cambio visual.</li>
        <li><b>Semanas 4-8:</b> la ropa empieza a sentar distinto antes de que se note en el espejo. Aquí suele mejorar ya el nivel de energía: es lo primero que cambia.</li>
        <li><b>Meses 3-4:</b> cambio visible en las fotos y en las medidas. Los glúteos responden razonablemente rápido en principiantes.</li>
        <li><b>Meses 5-6:</b> cambio evidente.</li>
      </ul>
      <p class="gaviso">Este plan solo funciona si es aburridamente consistente. <b>Doce semanas seguidas de
      una rutina mediocre baten seis semanas de una rutina perfecta abandonada.</b></p>`
  },
  {
    id: "plan6",
    h: "Plan a 6 meses",
    html: `
      <p><b>Meses 1-3:</b> esta rutina tal cual.</p>
      <p><b>Meses 4-6:</b> según cómo vaya el tobillo. Si te dan el alta, entran sentadilla goblet, zancadas
      y trabajo unilateral, que abren mucho el abanico de tren inferior. Si sigue limitado, se añade una
      cuarta serie a los dos primeros ejercicios de cada día y se rota alguna variante.</p>`
  },
  {
    id: "fuentes",
    h: "Fuentes",
    html: `
      <ul class="gfuentes">
        <li>Plotkin et al. 2023 (Auburn University) — hip thrust vs sentadilla, hipertrofia de glúteo por RMN</li>
        <li>Morton et al. 2017 (Br J Sports Med) — meta-análisis de proteína y masa magra</li>
        <li>Barakat et al. 2020 (NSCA Strength &amp; Conditioning Journal) — recomposición corporal</li>
        <li>Weightology (J. Krieger) — volumen y frecuencia de entrenamiento</li>
        <li>ISSN Position Stand — creatina: eficacia y seguridad</li>
        <li>Cleveland Clinic / USA Triathlon — cribado de ferritina y deficiencia de hierro sin anemia</li>
        <li>Harrabi et al. 2025 (PLOS One) — suplementación de hierro, fatiga y resistencia en mujeres jóvenes</li>
        <li>MuscleWiki — biblioteca de técnica</li>
      </ul>
      <p class="gnota">Imágenes de demostración: free-exercise-db (base de datos abierta).</p>`
  }
];

/* Árbol de decisión — guía §9. Se evalúa cada 4 semanas, nunca antes. */
window.ESCENARIOS = [
  { id:1, t:"El peso no baja pero las medidas sí", cond:"báscula plana, cintura bajando",
    txt:"<b>Esto es éxito, no fracaso.</b> Estás cambiando grasa por músculo. No toques nada." },
  { id:2, t:"Ni peso ni medidas se mueven", cond:"4 semanas sin cambios",
    txt:"Tu mantenimiento real es más bajo que el estimado, o hay calorías sin contar. Primero revisa lo invisible: aceite a ojo, salsas, bebidas, picoteo — suele estar ahí. Si está controlado, <b>quita 150 kcal/día</b> y reevalúa en 4 semanas. Nunca más de 150 de golpe." },
  { id:3, t:"Bajas demasiado rápido", cond:"más de 0,7 kg/semana sostenido",
    txt:"A ese ritmo se pierde músculo y energía. <b>Añade 150-200 kcal/día.</b> Sí, comer más: el objetivo no es adelgazar rápido, es cambiar de composición." },
  { id:4, t:"Sigues igual de cansada tras 8 semanas", cond:"la media de energía no sube",
    txt:"Por orden: 1) <b>¿te hiciste el análisis de ferritina?</b> Si no, ese es el paso. 2) ¿Duermes 7+ h de forma consistente? 3) ¿Estás comiendo el objetivo, o has ido bajando sin darte cuenta? 4) ¿Estás haciendo las 2 sesiones de cardio? 5) Si todo lo anterior está bien → consulta médica." },
  { id:5, t:"La fuerza no sube en 3+ semanas", cond:"en varios ejercicios a la vez",
    txt:"Suele ser señal de recuperación insuficiente, no de mala rutina. Revisa sueño y calorías, haz una semana de descarga y vuelve." },
  { id:6, t:"El tobillo se queja", cond:"molestia durante o después",
    txt:"Para ese ejercicio. Habla con tu fisio antes de la siguiente sesión. <b>Un tobillo mal rehabilitado te puede costar meses</b>, y esto es una carrera de fondo." }
];

/* Opciones de cardio, ordenadas por impacto en el tobillo (guía §3). */
window.CARDIOS = [
  { id:"natacion", n:"Natación",       icono:"🏊", impacto:"Sin impacto" },
  { id:"bici",     n:"Bici estática",  icono:"🚴", impacto:"Impacto bajo" },
  { id:"eliptica", n:"Elíptica",       icono:"🏃", impacto:"Solo con permiso del fisio" },
  { id:"otro",     n:"Otro",           icono:"💪", impacto:"" }
];
