/* Base de alimentos — valores por 100 g (o 100 ml en líquidos).
 *
 * Son valores de referencia redondeados, suficientes para llevar el objetivo
 * diario. No son análisis de laboratorio: si un producto concreto trae etiqueta,
 * la etiqueta manda. Las carnes van EN CRUDO salvo que ponga otra cosa, porque
 * es como suelen venir pesadas en el paquete.
 *
 * cat     categoría para agrupar en el selector
 * racion  ración típica en gramos → un toque la añade sin teclear
 * barato  aparece en el ranking de proteína barata (guía §5.3)
 */
window.ALIMENTOS = [
  /* ---------- proteína ---------- */
  { id:"huevo",      n:"Huevo entero",             cat:"Proteína", kcal:143, prot:12.6, carb:0.7, gras:9.5,  racion:110, barato:1, nota:"~2 huevos M" },
  { id:"clara",      n:"Clara de huevo",           cat:"Proteína", kcal:52,  prot:11,   carb:0.7, gras:0.2,  racion:100 },
  { id:"maitorahka", n:"Maitorahka / rahka 0 %",   cat:"Proteína", kcal:79,  prot:11.5, carb:5.5, gras:0.2,  racion:200, barato:2, nota:"El skyr finlandés: proteína/precio brutal" },
  { id:"raejuusto",  n:"Raejuusto (cottage)",      cat:"Proteína", kcal:79,  prot:13,   carb:2.5, gras:1.5,  racion:200, barato:8 },
  { id:"pollo",      n:"Pechuga de pollo (cruda)", cat:"Proteína", kcal:120, prot:23,   carb:0,   gras:2.6,  racion:150, barato:3 },
  { id:"contramuslo",n:"Contramuslo de pollo",     cat:"Proteína", kcal:119, prot:19.7, carb:0,   gras:3.9,  racion:150, barato:3, nota:"Sin piel, crudo. Más barato que la pechuga" },
  { id:"atun",       n:"Atún en lata al natural",  cat:"Proteína", kcal:116, prot:26,   carb:0,   gras:1,    racion:80,  barato:4, nota:"Escurrido" },
  { id:"lentejas",   n:"Lentejas cocidas",         cat:"Proteína", kcal:116, prot:9,    carb:20,  gras:0.4,  racion:200, barato:5 },
  { id:"garbanzos",  n:"Garbanzos cocidos",        cat:"Proteína", kcal:164, prot:8.9,  carb:27,  gras:2.6,  racion:200, barato:5 },
  { id:"quesofresco",n:"Queso fresco batido 0 %",  cat:"Proteína", kcal:47,  prot:8,    carb:4,   gras:0.2,  racion:250, barato:6 },
  { id:"leche",      n:"Leche semidesnatada",      cat:"Proteína", kcal:46,  prot:3.3,  carb:4.8, gras:1.6,  racion:250, barato:7, unidad:"ml" },
  { id:"lechedes",   n:"Leche desnatada",          cat:"Proteína", kcal:34,  prot:3.4,  carb:5,   gras:0.1,  racion:250, unidad:"ml" },
  { id:"yogurgriego",n:"Yogur griego natural",     cat:"Proteína", kcal:97,  prot:9,    carb:4,   gras:5,    racion:150 },
  { id:"salmon",     n:"Salmón",                   cat:"Proteína", kcal:208, prot:20,   carb:0,   gras:13,   racion:150, nota:"Caro: mejor congelado o en oferta" },
  { id:"ternera",    n:"Ternera picada 5 %",       cat:"Proteína", kcal:137, prot:21,   carb:0,   gras:5,    racion:150 },
  { id:"lomocerdo",  n:"Lomo de cerdo",            cat:"Proteína", kcal:143, prot:21,   carb:0,   gras:6,    racion:150 },
  { id:"gambas",     n:"Gambas",                   cat:"Proteína", kcal:85,  prot:20,   carb:0,   gras:0.5,  racion:150 },
  { id:"tofu",       n:"Tofu",                     cat:"Proteína", kcal:76,  prot:8,    carb:1.9, gras:4.8,  racion:150 },
  { id:"whey",       n:"Proteína whey en polvo",   cat:"Proteína", kcal:380, prot:78,   carb:8,   gras:5,    racion:30,  nota:"Ración = 1 cazo (~30 g)" },

  /* ---------- carbohidratos ---------- */
  { id:"arrozcrudo", n:"Arroz blanco (crudo)",     cat:"Carbos", kcal:360, prot:7,    carb:79, gras:0.6, racion:80 },
  { id:"arrozcocido",n:"Arroz blanco (cocido)",    cat:"Carbos", kcal:130, prot:2.7,  carb:28, gras:0.3, racion:250 },
  { id:"avena",      n:"Avena",                    cat:"Carbos", kcal:389, prot:16.9, carb:66, gras:6.9, racion:80 },
  { id:"pastacruda", n:"Pasta (cruda)",            cat:"Carbos", kcal:371, prot:13,   carb:75, gras:1.5, racion:100 },
  { id:"pastacocida",n:"Pasta (cocida)",           cat:"Carbos", kcal:158, prot:5.8,  carb:31, gras:0.9, racion:250 },
  { id:"patata",     n:"Patata cocida",            cat:"Carbos", kcal:87,  prot:2,    carb:20, gras:0.1, racion:300 },
  { id:"boniato",    n:"Boniato",                  cat:"Carbos", kcal:86,  prot:1.6,  carb:20, gras:0.1, racion:250 },
  { id:"panintegral",n:"Pan integral",             cat:"Carbos", kcal:247, prot:13,   carb:41, gras:3.4, racion:80 },
  { id:"ruisleipa",  n:"Pan de centeno (ruisleipä)",cat:"Carbos",kcal:259, prot:8.5,  carb:48, gras:3.3, racion:80 },
  { id:"platano",    n:"Plátano",                  cat:"Carbos", kcal:89,  prot:1.1,  carb:23, gras:0.3, racion:120 },
  { id:"manzana",    n:"Manzana",                  cat:"Carbos", kcal:52,  prot:0.3,  carb:14, gras:0.2, racion:180 },
  { id:"naranja",    n:"Naranja",                  cat:"Carbos", kcal:47,  prot:0.9,  carb:12, gras:0.1, racion:180 },
  { id:"arandanos",  n:"Arándanos",                cat:"Carbos", kcal:57,  prot:0.7,  carb:14, gras:0.3, racion:125 },

  /* ---------- grasas ---------- */
  { id:"aceite",     n:"Aceite de oliva",          cat:"Grasas", kcal:884, prot:0,    carb:0,   gras:100, racion:10, unidad:"ml", nota:"1 cucharada ≈ 10 ml. Aquí es donde se esconden las kcal" },
  { id:"almendras",  n:"Almendras",                cat:"Grasas", kcal:579, prot:21,   carb:22,  gras:50,  racion:30 },
  { id:"cacahuetes", n:"Cacahuetes",               cat:"Grasas", kcal:567, prot:26,   carb:16,  gras:49,  racion:30 },
  { id:"cremacacah", n:"Crema de cacahuete",       cat:"Grasas", kcal:588, prot:25,   carb:20,  gras:50,  racion:30 },
  { id:"nueces",     n:"Nueces",                   cat:"Grasas", kcal:654, prot:15,   carb:14,  gras:65,  racion:30 },
  { id:"aguacate",   n:"Aguacate",                 cat:"Grasas", kcal:160, prot:2,    carb:9,   gras:15,  racion:100 },
  { id:"mantequilla",n:"Mantequilla",              cat:"Grasas", kcal:717, prot:0.9,  carb:0.1, gras:81,  racion:10 },

  /* ---------- verdura ---------- */
  { id:"brocoli",    n:"Brócoli",                  cat:"Verdura", kcal:34, prot:2.8, carb:7,   gras:0.4, racion:200 },
  { id:"zanahoria",  n:"Zanahoria",                cat:"Verdura", kcal:41, prot:0.9, carb:10,  gras:0.2, racion:150 },
  { id:"espinacas",  n:"Espinacas",                cat:"Verdura", kcal:23, prot:2.9, carb:3.6, gras:0.4, racion:150 },
  { id:"tomate",     n:"Tomate",                   cat:"Verdura", kcal:18, prot:0.9, carb:3.9, gras:0.2, racion:150 },
  { id:"pimiento",   n:"Pimiento",                 cat:"Verdura", kcal:31, prot:1,   carb:6,   gras:0.3, racion:150 },
  { id:"cebolla",    n:"Cebolla",                  cat:"Verdura", kcal:40, prot:1.1, carb:9,   gras:0.1, racion:100 }
];

/* Huecos de comida — guía §5.2: 3-4 comidas con 30-40 g de proteína cada una. */
window.COMIDAS = [
  { id:"desayuno", n:"Desayuno", icono:"☕" },
  { id:"comida",   n:"Comida",   icono:"🍽️" },
  { id:"merienda", n:"Merienda", icono:"🥤" },
  { id:"cena",     n:"Cena",     icono:"🌙" }
];

/* Suplementos — guía §5.4. */
window.SUPLEMENTOS = [
  { id:"creatina", n:"Creatina monohidrato", dosis:"5 g", diario:true,
    nota:"Todos los días, también los de descanso. El suplemento con más evidencia que existe." },
  { id:"vitd",     n:"Vitamina D",           dosis:"~20 µg", diario:true,
    nota:"Otoño-invierno en Finlandia: falta de sol." },
  { id:"whey",     n:"Batido de proteína",   dosis:"25-30 g", diario:false,
    nota:"Solo si no llegas al objetivo de proteína con comida." }
];
