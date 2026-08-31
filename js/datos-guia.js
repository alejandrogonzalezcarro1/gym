/* Contenido de la pestaña Guía.
 * Resumen operativo de la guía v2: lo que necesitas consultar en el gimnasio.
 * Sin datos personales — el perfil (peso, altura) lo introduces tú y vive
 * únicamente en el almacenamiento de tu teléfono.
 */
window.GUIA = [
  {
    id: "resumen",
    h: "Resumen ejecutivo",
    abierto: true,
    html: `
      <table class="gtabla">
        <tr><td>Estructura</td><td>Torso / Pierna / Torso / Pierna — Lun, Mar, Jue, Vie</td></tr>
        <tr><td>Series y reps</td><td>3 series por ejercicio, mayoría 8-12 reps</td></tr>
        <tr><td>Esfuerzo</td><td>RIR 2-3 semanas 1-3 → RIR 1-2 después</td></tr>
        <tr><td>Descanso</td><td>2-3 min compuestos · 60-90 s aislamiento</td></tr>
        <tr><td>Progresión</td><td>Doble progresión: reps hasta el tope del rango → subir peso</td></tr>
        <tr><td>Calorías</td><td>Mantenimiento + 300 kcal</td></tr>
        <tr><td>Proteína</td><td>1,6-1,8 g/kg/día en 3-4 comidas</td></tr>
        <tr><td>Ritmo de ganancia</td><td>+0,25 a +0,5 kg/mes (media de 4 semanas)</td></tr>
        <tr><td>Suplementos</td><td>Creatina 5 g/día. Whey si no llegas. Vitamina D en invierno</td></tr>
        <tr><td>Sueño</td><td>7-9 h</td></tr>
        <tr><td>Pasos</td><td>8-10.000/día</td></tr>
        <tr><td>Descarga</td><td>1 semana suave cada 8-10 semanas</td></tr>
        <tr><td>Revisión</td><td>Cada 4 semanas con peso, fuerza y fotos</td></tr>
      </table>`
  },
  {
    id: "calentar",
    h: "Antes de cada sesión",
    html: `
      <ul>
        <li>5 min de bici, cinta o remo suave.</li>
        <li>En el <b>primer ejercicio</b> del día: 2 series de aproximación — una con ~40 % del peso de trabajo × 12 reps, otra con ~70 % × 6-8 reps.</li>
        <li>En el resto basta 1 serie ligera si cambias de patrón de movimiento.</li>
      </ul>
      <p class="gnota">Las series de aproximación no se registran: no cuentan como volumen.</p>`
  },
  {
    id: "calibracion",
    h: "Calibración de pesos (semanas 1-2)",
    html: `
      <p>Los pesos orientativos de cada ejercicio son el <b>punto de partida de la búsqueda</b>, no tu peso de trabajo.</p>
      <p><b>Semana 1 — explorar.</b> Haz la primera serie y pregúntate: ¿podría haber hecho 4-5 reps más?</p>
      <ul>
        <li>Sí, sobradamente → sube un escalón en la siguiente serie.</li>
        <li>Justo 2-3 más → ese es tu peso. Apúntalo.</li>
        <li>No llegué al mínimo del rango → baja un escalón.</li>
      </ul>
      <p><b>Semana 2 — confirmar.</b> Repite con los pesos apuntados; deberías quedarte a RIR 2-3 en todas las series.</p>
      <p class="gaviso">Regla de oro: <b>técnica &gt; peso</b>. Cada rep fea con más kilos no entrena al músculo objetivo, entrena a tus articulaciones.</p>`
  },
  {
    id: "progresion",
    h: "Doble progresión: el motor",
    html: `
      <p>Cada ejercicio tiene un rango (por ejemplo 8-10). El ciclo:</p>
      <pre class="gpre">Semana 1:  20 kg → 8, 8, 8      (entras por abajo)
Semana 2:  20 kg → 9, 8, 8
Semana 3:  20 kg → 10, 9, 8
Semana 4:  20 kg → 10, 10, 9
Semana 5:  20 kg → 10, 10, 10   ✅ tope en TODAS
Semana 6:  22 kg → 8, 8, 7      (subes peso, vuelves a empezar)</pre>
      <ul>
        <li>Sube el escalón mínimo: 1-2 kg en mancuernas, 2,5-5 kg en máquinas y barras.</li>
        <li>Si al subir no llegas al mínimo del rango, el salto fue grande: vuelve una semana más o busca un escalón intermedio.</li>
        <li><b>Las primeras 6-8 semanas subirás casi cada semana.</b> Es adaptación neural, no músculo todavía. Después, subir cada 2-4 semanas ya es excelente.</li>
      </ul>
      <p class="gnota">La app marca el ejercicio en verde y te propone el siguiente peso cuando cumples el tope del rango en todas las series.</p>`
  },
  {
    id: "rir",
    h: "Esfuerzo (RIR) por fases",
    html: `
      <table class="gtabla">
        <tr><th>Fase</th><th>Semanas</th><th>RIR</th></tr>
        <tr><td>Aprendizaje</td><td>1-3</td><td>3</td></tr>
        <tr><td>Construcción</td><td>4-8</td><td>2</td></tr>
        <tr><td>Consolidación</td><td>9-10</td><td>1-2</td></tr>
        <tr><td><b>Descarga</b></td><td>11</td><td>4-5</td></tr>
        <tr><td>Siguiente ciclo</td><td>12+</td><td>1-2</td></tr>
      </table>
      <p>RIR = repeticiones en recámara. Llegar al fallo absoluto no es necesario ni recomendable en compuestos; en el último ejercicio de aislamiento del día puedes rozarlo en la última serie.</p>`
  },
  {
    id: "estancado",
    h: "Cuando un ejercicio se estanca",
    html: `
      <p>Tres semanas sin sumar ni una rep en un ejercicio concreto:</p>
      <ol>
        <li>Grábate una serie y revisa la técnica. Es la herramienta más infravalorada del gimnasio.</li>
        <li>Baja el peso un 10 % y vuelve a subir en 2-3 semanas (reset corto).</li>
        <li>Si vuelve a pasar, cambia a una variante del mismo patrón y progresa ahí 8 semanas.</li>
      </ol>`
  },
  {
    id: "descanso",
    h: "Descanso, sueño y descarga",
    html: `
      <p><b>Entre series:</b> 1-2 min ya maximizan la hipertrofia en la mayoría de casos; en compuestos pesados quédate en 2-3 min para no perder reps por fatiga.</p>
      <p><b>Entre sesiones:</b> miércoles, sábado y domingo libres. «Libre» = sin pesas, no sin moverte: los 8-10.000 pasos son diarios.</p>
      <p><b>Sueño 7-9 h.</b> Dormir poco recorta la síntesis de proteína muscular y el rendimiento. Si solo puedes optimizar una cosa fuera del gimnasio, que sea esta.</p>
      <p><b>Descarga cada 8-10 semanas:</b> misma rutina, 2 series por ejercicio en vez de 3, ~60-70 % del peso habitual, RIR 4-5.</p>
      <p class="gaviso">Señales para descargar antes: fuerza bajando en varios ejercicios a la vez, dolor articular que persiste entre sesiones, dormir mal varios días, pulsaciones en reposo altas.</p>`
  },
  {
    id: "nutricion",
    h: "Nutrición: las reglas",
    html: `
      <p><b>Pésate de verdad:</b> 3 mañanas seguidas, en ayunas, después de orinar, misma báscula. La media es tu peso real.</p>
      <p><b>Calorías:</b> mantenimiento + ~300 kcal. Para principiantes está dentro del rango que la evidencia recomienda (300-500).</p>
      <p><b>Proteína:</b> 1,6-1,8 g/kg/día. El techo de beneficio está en ~1,6 g/kg; apuntar a 1,8 te da margen los días flojos. Más de 2,2 no aporta nada.</p>
      <p><b>Grasas:</b> ~25 % de las kcal, nunca por debajo de 60 g (soporte hormonal). <b>Carbos:</b> el resto — tu gasolina.</p>
      <p><b>Reparto:</b> 3-4 comidas con 30-40 g de proteína cada una. El timing importa muchísimo menos que el total diario; lo único que vale la pena: carbos 1-2 h antes de entrenar y una comida completa después.</p>
      <h4>Lo que NO vas a hacer</h4>
      <ul>
        <li>Déficit calórico todavía. El déficit llega después de construir, no antes.</li>
        <li>Bulk sucio. Por encima de +500 kcal solo aceleras la grasa.</li>
        <li>Pesarte cada día y decidir con ese número. El peso diario baila 1-2 kg por agua.</li>
      </ul>`
  },
  {
    id: "proteinabarata",
    h: "Proteína barata (Finlandia)",
    html: `
      <p>Por € por gramo de proteína, en orden aproximado:</p>
      <ol>
        <li>Huevos</li>
        <li>Rahka / maitorahka — el skyr finlandés, brutal en proteína/precio</li>
        <li>Pollo entero o contramuslos</li>
        <li>Atún en lata</li>
        <li>Legumbres (lentejas, garbanzos)</li>
        <li>Queso fresco</li>
        <li>Leche</li>
        <li>Raejuusto (cottage)</li>
      </ol>
      <p>El salmón está bien pero caro: congelado o en ofertas sale mejor. Con rahka + huevos + pollo + legumbres cubres el objetivo sin destrozar el presupuesto, y todo encaja en batch cooking.</p>`
  },
  {
    id: "suplementos",
    h: "Suplementos",
    html: `
      <table class="gtabla">
        <tr><th>Qué</th><th>Dosis</th><th>Veredicto</th></tr>
        <tr><td><b>Creatina monohidrato</b></td><td>5 g/día</td><td>El suplemento con más evidencia que existe. Cualquier hora, también días de descanso. Monohidrato a secas: las variantes caras no han demostrado ser mejores</td></tr>
        <tr><td>Proteína whey</td><td>25-30 g</td><td>Solo si no llegas con comida. Es comida en polvo, no magia</td></tr>
        <tr><td>Vitamina D</td><td>~20 µg/día</td><td>Otoño-invierno en Finlandia</td></tr>
        <tr><td>Cafeína</td><td>Café pre-entreno</td><td>Mejora leve. Un pre-workout no es necesario</td></tr>
        <tr><td>Todo lo demás</td><td>—</td><td>Marketing. BCAA, glutamina, quemagrasas, boosters de testosterona: no</td></tr>
      </table>`
  },
  {
    id: "seguimiento",
    h: "Qué medir y cuándo",
    html: `
      <table class="gtabla">
        <tr><th>Métrica</th><th>Frecuencia</th><th>Cómo</th></tr>
        <tr><td>Peso</td><td>Semanal o diario</td><td>Ayunas, misma hora. Decisiones solo con la media de 4 semanas</td></tr>
        <tr><td>Fuerza</td><td>Cada sesión</td><td>La app lo registra. Testigos: press banca, jalón, prensa, curl predicador</td></tr>
        <tr><td>Fotos</td><td>Cada 4 semanas</td><td>Frente, lado, espalda. Misma luz, misma hora, mismo sitio</td></tr>
        <tr><td>Cintura</td><td>Cada 4 semanas</td><td>Cinta a la altura del ombligo, relajado</td></tr>
      </table>`
  },
  {
    id: "errores",
    h: "Errores que matan el progreso",
    html: `
      <ol>
        <li><b>Cambiar de rutina cada 3 semanas.</b> Esta funciona si le das 12+ semanas. La consistencia aburrida gana.</li>
        <li><b>No apuntar los entrenamientos.</b> Sin datos no hay progresión, hay improvisación.</li>
        <li><b>Entrenar con el ego.</b> Peso que no controlas en la bajada = peso que no te hace crecer.</li>
        <li><b>Comer bien de lunes a viernes y desaparecer el finde.</b> Dos días a 2.000 kcal se comen el superávit de toda la semana.</li>
        <li><b>Copiar a los grandes del gimnasio.</b> Llevan años y otro contexto.</li>
        <li><b>Buscar el suplemento o el hack que lo cambia todo.</b> No existe. Existe comer, entrenar, dormir y repetir 6 meses.</li>
      </ol>`
  },
  {
    id: "plan6",
    h: "Plan a 6 meses",
    html: `
      <p><b>Meses 1-3:</b> esta rutina tal cual. Aprendizaje + primeras ganancias.</p>
      <p><b>Meses 4-6:</b> misma estructura con 3 cambios — añade una 4ª serie a los 2 primeros ejercicios de cada día, cambia 1-2 ejercicios por variantes, e introduce sentadilla con barra y peso muerto rumano con barra si la técnica en goblet/mancuernas ya es sólida, a poder ser con alguien mirando las primeras sesiones.</p>`
  },
  {
    id: "fuentes",
    h: "Fuentes",
    html: `
      <ul class="gfuentes">
        <li>Morton et al. 2017 (Br J Sports Med) — meta-análisis proteína: techo ~1,6 g/kg/día</li>
        <li>Weightology (J. Krieger) — volumen y frecuencia: 12-24 series/semana, frecuencia 2×</li>
        <li>Stronger by Science — descansos: 1-2 min suficiente para hipertrofia</li>
        <li>Tagawa et al. 2022 (Sports Med) — proteína y fuerza, meseta ~1,5 g/kg</li>
        <li>ISSN Position Stand — creatina: eficacia y seguridad</li>
        <li>Iraki, Fitschen, Espinar &amp; Helms 2019 — superávit 200-500 kcal en atletas naturales</li>
        <li>MuscleWiki — biblioteca de técnica</li>
      </ul>
      <p class="gnota">Imágenes de demostración: free-exercise-db (base de datos abierta).</p>`
  }
];

/* Árbol de decisión — guía §7. Se evalúa cada 4 semanas, nunca antes. */
window.ESCENARIOS = [
  { id:1, t:"El peso no sube", cond:"media de 4 semanas plana",
    txt:"Tu mantenimiento real es más alto que el estimado. <b>Añade 150-200 kcal/día</b> y reevalúa en 4 semanas. Repite si sigue plano." },
  { id:2, t:"El peso sube demasiado rápido", cond:"&gt;1 kg/mes sostenido tras el primer mes",
    txt:"<b>Quita 150-200 kcal/día.</b> Comprueba las calorías invisibles: aceite a ojo, salsas, bebidas. Ojo: el primer mes puedes subir 1-2 kg «gratis» de glucógeno, agua y creatina — eso no es grasa." },
  { id:3, t:"La fuerza no sube", cond:"3+ semanas en varios ejercicios a la vez",
    txt:"Por orden de probabilidad: 1) ¿duermes 7+ h? 2) ¿comes el objetivo? 3) ¿técnica degradada? 4) si todo está bien, <b>semana de descarga</b>. 5) si tras la descarga sigue, cambia variantes." },
  { id:4, t:"Subes pero no te ves distinto", cond:"semana 8-12",
    txt:"Normal y esperado: el cambio llega antes a la báscula y al cuaderno que al espejo. Compara <b>fotos de la semana 0 vs actual</b>; el espejo diario no detecta cambios graduales. Los meses 4-6 son donde se nota." },
  { id:5, t:"La cintura crece de más", cond:"+2-3 cm y ganancia blanda",
    txt:"Baja el superávit a +150-200 kcal, sube a 10-12.000 pasos y comprueba que el ritmo vuelve a ≤0,5 kg/mes. Si tras 4-5 meses quieres afinar: <b>mini-cut</b> de 4-6 semanas a -300/-400 kcal manteniendo proteína alta." },
  { id:6, t:"Algo duele", cond:"dolor articular o punzante, no agujetas",
    txt:"No entrenes a través del dolor. Sustituye el ejercicio por una variante sin molestia, baja peso, y si persiste 2+ semanas, fisio." }
];
