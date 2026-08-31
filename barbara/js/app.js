/* Rutina — app de entreno y nutrición.
 * Todo el estado vive en localStorage de este dispositivo. Sin cuentas, sin servidor.
 */
(function(){
"use strict";

/* ==========================================================================
   1. Utilidades
   ========================================================================== */

var ENT = { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" };
/* Escapa TODO lo que puede romper HTML, comillas incluidas: el texto acaba
   dentro de atributos (aria-label, data-*) además de en nodos de texto. */
function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return ENT[c]; }); }

function $(sel, raiz){ return (raiz || document).querySelector(sel); }
function $$(sel, raiz){ return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }
function p2(n){ return (n < 10 ? "0" : "") + n; }

/* Fecha local (no UTC): «hoy» tiene que coincidir con el día del usuario. */
function fechaDe(d){ return d.getFullYear() + "-" + p2(d.getMonth() + 1) + "-" + p2(d.getDate()); }
function hoy(){ return fechaDe(new Date()); }
function desdeISO(f){ var p = f.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
function diasEntre(a, b){ return Math.round((desdeISO(b) - desdeISO(a)) / 86400000); }
function fmtFecha(f){
  var m = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  var d = desdeISO(f);
  return d.getDate() + " " + m[d.getMonth()];
}
function num(v, def){ var n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : (def === undefined ? null : def); }
function red(n, d){ var f = Math.pow(10, d || 0); return Math.round(n * f) / f; }
/* Coma decimal: la app está en español y «12.6 g» chirría. */
function dec(n){ return String(n).replace(".", ","); }
function decr(n, d){ return dec(red(n, d)); }

/* ==========================================================================
   2. Estado
   ========================================================================== */

var CLAVE = "bbapp:v1";   /* distinta de la otra app: comparten dominio */
var memoria = {};                 /* respaldo si localStorage falla (modo privado) */
var S = null;
var guardarPdte = null;

function estadoVacio(){
  return { v:1, perfil:{ peso:null, altura:null }, sesiones:{}, pesos:{},
           corporal:[], medidas:[], nutricion:{}, supl:{}, ajustes:{},
           energia:{}, cardio:{} };
}

function leerBruto(k){
  try { return localStorage.getItem(k); } catch(e){ return memoria[k] || null; }
}
function escribirBruto(k, v){
  try { localStorage.setItem(k, v); return true; }
  catch(e){
    memoria[k] = v;
    /* QuotaExceeded: avisar en vez de perder datos en silencio. */
    if (e && (e.name === "QuotaExceededError" || e.code === 22)){
      toast("Almacenamiento lleno. Exporta una copia desde Progreso.", "Ir", function(){ irA("progreso"); });
    }
    return false;
  }
}

function cargar(){
  var crudo = leerBruto(CLAVE);
  if (!crudo){ S = estadoVacio(); return; }
  try {
    var o = JSON.parse(crudo);
    S = Object.assign(estadoVacio(), o);
    /* Blindaje: si un campo viene corrupto, se repone vacío en vez de romper la app. */
    ["sesiones","pesos","nutricion","supl","ajustes","perfil","energia","cardio"].forEach(function(k){
      if (!S[k] || typeof S[k] !== "object" || Array.isArray(S[k])) S[k] = estadoVacio()[k];
    });
    ["corporal","medidas"].forEach(function(k){ if (!Array.isArray(S[k])) S[k] = []; });
  } catch(e){ S = estadoVacio(); }
}

function guardar(){
  if (guardarPdte) clearTimeout(guardarPdte);
  guardarPdte = setTimeout(function(){
    guardarPdte = null;
    escribirBruto(CLAVE, JSON.stringify(S));
  }, 180);
}
function guardarYa(){
  if (guardarPdte){ clearTimeout(guardarPdte); guardarPdte = null; }
  escribirBruto(CLAVE, JSON.stringify(S));
}

/* Sesión del día: se crea al vuelo. Al cambiar de fecha, empieza vacía —
   ese era el fallo de la versión anterior, donde las series marcadas se
   quedaban puestas para siempre. */
function sesion(f, dia){
  f = f || hoy();
  if (!S.sesiones[f]) S.sesiones[f] = { dia: dia || diaActual, ej: {} };
  if (dia) S.sesiones[f].dia = dia;
  return S.sesiones[f];
}
function registro(id, f){
  var s = sesion(f);
  if (!s.ej[id]) s.ej[id] = { kg: null, s: [] };
  return s.ej[id];
}

/* Última sesión anterior a hoy que tenga series registradas de este ejercicio. */
function ultimaVez(id){
  var fechas = Object.keys(S.sesiones).filter(function(f){ return f < hoy(); }).sort().reverse();
  for (var i = 0; i < fechas.length; i++){
    var r = S.sesiones[fechas[i]].ej[id];
    if (r && r.s && r.s.some(Boolean)) return { f: fechas[i], r: r };
  }
  return null;
}

/* ==========================================================================
   3. Avisos (toast)
   ========================================================================== */

var toastT = null;
function toast(msg, accion, cb){
  var t = $("#toast"), b = $("#toastbtn");
  $("#toastmsg").textContent = msg;
  if (accion){ b.textContent = accion; b.classList.remove("oculto"); b.onclick = function(){ ocultarToast(); cb && cb(); }; }
  else b.classList.add("oculto");
  t.classList.add("visible");
  if (toastT) clearTimeout(toastT);
  toastT = setTimeout(ocultarToast, accion ? 8000 : 3200);
}
function ocultarToast(){ $("#toast").classList.remove("visible"); }

/* ==========================================================================
   4. Audio y temporizador
   ========================================================================== */

/* iOS crea el AudioContext en estado «suspended» salvo que nazca dentro de un
   gesto del usuario. La versión anterior lo construía al vencer el temporizador
   —fuera de todo gesto— así que nunca sonaba. Aquí se crea al primer toque. */
var actx = null;
function desbloquearAudio(){
  if (actx) return;
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    actx = new AC();
    if (actx.state === "suspended") actx.resume();
    var o = actx.createOscillator(), g = actx.createGain();
    g.gain.value = 0.00001;                       /* pitido mudo: termina de abrir el canal */
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + 0.01);
  } catch(e){ actx = null; }
}
document.addEventListener("touchend", desbloquearAudio, { passive:true });
document.addEventListener("click", desbloquearAudio);

var T = { fin:0, total:0, int:null, nodos:[], texto:"" };

/* Se programan los pitidos en la línea temporal del audio, no con setTimeout:
   los eventos ya programados suenan aunque el navegador congele el JS. */
function programarBeep(seg){
  cancelarBeep();
  if (!actx) return;
  if (actx.state === "suspended"){ try { actx.resume(); } catch(e){} }
  var t0 = actx.currentTime + seg;
  [0, 0.3].forEach(function(off){
    try {
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = "sine"; o.frequency.value = 880;
      o.connect(g); g.connect(actx.destination);
      g.gain.setValueAtTime(0.0001, t0 + off);
      g.gain.exponentialRampToValueAtTime(0.3, t0 + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + off + 0.24);
      o.start(t0 + off); o.stop(t0 + off + 0.27);
      T.nodos.push(o);
    } catch(e){}
  });
}
function cancelarBeep(){
  T.nodos.forEach(function(o){ try { o.stop(0); } catch(e){} });
  T.nodos = [];
}

function fmt(s){ return Math.floor(s / 60) + ":" + p2(s % 60); }

function iniciarTimer(seg, texto){
  pararTimer(true);
  T.total = seg;
  T.fin = Date.now() + seg * 1000;      /* fecha límite, no un contador que se congela */
  T.texto = texto || "Descanso";
  programarBeep(seg);
  var tb = $("#timerbar");
  tb.classList.add("visible");
  tb.classList.remove("fin");
  pintarTimer();
  T.int = setInterval(pintarTimer, 250);
}
function pintarTimer(){
  if (!T.fin) return;
  var resta = Math.max(0, Math.round((T.fin - Date.now()) / 1000));
  $("#tnum").textContent = fmt(resta);
  $("#tprog").style.width = (T.total ? resta / T.total * 100 : 0) + "%";
  if (resta <= 0) finTimer(); else $("#tque").textContent = T.texto;
}
function finTimer(){
  if (T.int){ clearInterval(T.int); T.int = null; }
  T.fin = 0;
  var tb = $("#timerbar");
  tb.classList.add("fin");
  $("#tnum").textContent = "0:00";
  $("#tprog").style.width = "0%";
  $("#tque").textContent = "¡A la siguiente serie!";
  try { if (navigator.vibrate) navigator.vibrate([200,100,200]); } catch(e){}  /* Android; iOS lo ignora */
  setTimeout(function(){ if (!T.fin) tb.classList.remove("visible"); }, 3000);
}
function pararTimer(silencioso){
  if (T.int){ clearInterval(T.int); T.int = null; }
  cancelarBeep();
  T.fin = 0;
  if (!silencioso) $("#timerbar").classList.remove("visible");
}

/* Al volver de segundo plano el reloj se recalcula solo, porque guardamos la
   fecha límite en vez de ir restando segundos. */
document.addEventListener("visibilitychange", function(){ if (!document.hidden) pintarTimer(); });
window.addEventListener("pageshow", pintarTimer);

$("#tskip").addEventListener("click", function(){ pararTimer(); });
$("#tmas").addEventListener("click", function(){
  if (!T.fin) return;
  T.fin += 30000; T.total += 30;
  programarBeep(Math.round((T.fin - Date.now()) / 1000));
  pintarTimer();
});

/* ==========================================================================
   5. Pestaña ENTRENO
   ========================================================================== */

var diaActual = "A";
var NUM_DIA = { A:1, B:2, C:3, D:4 };   /* las claves siguen siendo A-D por dentro */
var animInt = null, io = null;

function objetivoSets(e){ return e.sets || 3; }

function totalSets(D){ return D.ej.reduce(function(t, e){ return t + objetivoSets(e); }, 0); }
function hechasSets(D){
  var s = sesion();
  return D.ej.reduce(function(t, e){
    var r = s.ej[e.id];
    return t + (r && r.s ? r.s.filter(Boolean).length : 0);
  }, 0);
}

/* Doble progresión (guía §3.1): tope del rango en TODAS las series → subir peso. */
function sugerencia(e){
  var r = sesion().ej[e.id];
  var n = objetivoSets(e);
  if (!r || !r.s) return null;
  var hechas = [];
  for (var i = 0; i < n; i++){ if (r.s[i]) hechas.push(r.s[i]); }
  if (hechas.length < n) return null;                       /* sesión aún incompleta */

  var todasTope = hechas.every(function(x){ return x.r >= e.max; });
  var kg = r.kg;
  if (todasTope && e.inc > 0 && kg != null){
    var sig = decr(e.inverso ? Math.max(0, kg - e.inc) : kg + e.inc, 1);
    return { tipo:"sube", txt: e.inverso
      ? "✅ Tope del rango. Baja la asistencia a " + sig + " kg la próxima."
      : "✅ Tope del rango en todas las series. Sube a " + sig + " kg la próxima." };
  }
  if (todasTope) return { tipo:"sube", txt:"✅ Tope del rango en todas las series. Toca progresar." };

  var corta = hechas.some(function(x){ return x.r < e.min; });
  if (corta) return { tipo:"baja", txt:"Te has quedado por debajo del rango. Mantén el peso hasta cerrar " + e.min + " reps en todas." };
  return null;
}

function pintarProgresoDia(){
  var D = window.DIAS[diaActual];
  var tot = totalSets(D), h = hechasSets(D);
  var f = $("#pfill"), t = $("#ptxt"), m = $("#pmsg");
  if (f) f.style.width = (tot ? h / tot * 100 : 0) + "%";
  if (t) t.textContent = h + " / " + tot + " series";
  if (m) m.textContent = (h === tot && tot > 0) ? "Sesión completada 💪" : "Progreso de hoy";
  D.ej.forEach(function(e){
    var card = document.getElementById("card-" + e.id);
    if (!card) return;
    var r = sesion().ej[e.id];
    var n = r && r.s ? r.s.filter(Boolean).length : 0;
    card.classList.toggle("completo", n >= objetivoSets(e));
  });
}

function renderEntreno(dia){
  diaActual = dia || diaActual;
  var D = window.DIAS[diaActual];
  document.documentElement.style.setProperty("--acento", D.color);
  sesion(hoy(), diaActual);

  $$(".plate").forEach(function(p){ p.classList.toggle("activo", p.dataset.dia === diaActual); });
  $$(".pwrap").forEach(function(p){ p.classList.toggle("activo", p.dataset.dia === diaActual); });

  $("#banda").innerHTML =
    '<div class="fila"><div><h2>Día ' + NUM_DIA[diaActual] + ' · ' + esc(D.titulo) + '</h2>' +
    '<p class="sub">' + esc(D.dia) + ' · ' + esc(D.sub) + '</p></div>' +
    '<button class="reset" id="btnreset">Reiniciar</button></div>' +
    '<div class="progreso"><div class="txt"><span id="pmsg">Progreso de hoy</span><span id="ptxt"></span></div>' +
    '<div class="track"><div class="fill" id="pfill"></div></div></div>';

  $("#btnreset").addEventListener("click", function(){
    if (!confirm("¿Borrar las series registradas hoy en el día " + NUM_DIA[diaActual] + "?")) return;
    var s = sesion();
    D.ej.forEach(function(e){ delete s.ej[e.id]; });
    guardar(); renderEntreno(diaActual);
  });

  var html = "";
  D.ej.forEach(function(e, i){
    var n = objetivoSets(e);
    var r = registro(e.id);
    if (r.kg == null && S.pesos[e.id] != null) r.kg = S.pesos[e.id];   /* el peso se arrastra */
    var uv = ultimaVez(e.id);

    var series = "";
    for (var k = 0; k < n; k++){
      var hecho = r.s[k];
      var valor = hecho ? hecho.r : valorSugerido(e, uv, k);
      series +=
        '<div class="serie' + (hecho ? " ok" : "") + '" data-ej="' + esc(e.id) + '" data-i="' + k + '">' +
          '<span class="nlabel">Serie ' + (k + 1) + '</span>' +
          '<div class="stepper">' +
            '<button class="menos" aria-label="Menos">−</button>' +
            '<span class="val">' + valor + (e.tiempo ? '<small>s</small>' : '') + '</span>' +
            '<button class="mas" aria-label="Más">+</button>' +
          '</div>' +
          '<button class="hecho" aria-label="Marcar serie ' + (k + 1) + ' de ' + esc(e.n) + '">✓</button>' +
        '</div>';
    }

    var ultimaTxt = uv
      ? '<b>' + fmtFecha(uv.f) + ':</b> ' + (uv.r.kg != null ? uv.r.kg + ' kg · ' : '') +
        uv.r.s.filter(Boolean).map(function(x){ return x.r; }).join(' · ')
      : 'Primera vez con este ejercicio';

    var sug = sugerencia(e);
    var yt = "https://www.youtube.com/results?search_query=" + encodeURIComponent(e.yt);

    html +=
    '<article class="ej" id="card-' + esc(e.id) + '">' +
      (e.circuito ? '<div class="circuito">' + esc(e.circuito) + '</div>' : '') +
      '<div class="ej-top">' +
        '<div class="demo">' +
          '<img class="f0" src="./img/' + esc(e.img) + '_0.webp" alt="Demostración: ' + esc(e.n) + '" loading="lazy" decoding="async">' +
          '<img class="f1" src="./img/' + esc(e.img) + '_1.webp" alt="" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="ej-info">' +
          '<div class="ej-linea1"><span class="ej-num">' + (i + 1) + '</span><h3>' + esc(e.n) + '</h3></div>' +
          '<div class="tags"><span class="tag tipo">' + esc(e.tipo) + '</span>' +
            (e.pilar ? '<span class="tag pilar">Pilar del plan</span>' : '') +
            (e.tobillo ? '<span class="tag tobillo">Ojo al tobillo</span>' : '') +
            '<span class="tag">' + esc(e.eq) + '</span><span class="tag">' + esc(e.rir) + '</span><span class="tag">' + esc(e.sr) + '</span></div>' +
          '<p class="cue">' + esc(e.cue) + ' <a href="' + esc(yt) + '" target="_blank" rel="noopener">Ver técnica →</a></p>' +
        '</div>' +
      '</div>' +
      '<div class="trabajo">' +
        '<div class="wfila">' +
          (e.corporal
            ? '<div class="wpeso"><label>Peso</label><span class="u">corporal</span></div>'
            : '<div class="wpeso"><label>Peso</label>' +
              '<input type="text" inputmode="decimal" value="' + (r.kg != null ? esc(r.kg) : "") + '" placeholder="kg" data-peso="' + esc(e.id) + '" aria-label="Peso en ' + esc(e.n) + '">' +
              '<span class="u">' + esc(e.unidad || "kg") + '</span></div>') +
          '<div class="ultima">' + ultimaTxt + '<br><span style="color:var(--mut2)">Orientativo: ' + esc(e.peso) + '</span></div>' +
        '</div>' +
        '<div class="series">' + series + '</div>' +
        (sug ? '<div class="hint' + (sug.tipo === "baja" ? " baja" : "") + '">' + esc(sug.txt) + '</div>' : '') +
        '<button class="btn-descanso reset" style="width:100%;margin-top:10px;padding:9px" data-d="' + e.d + '" data-n="' + esc(e.n) + '">Descanso ' + esc(e.dl) + '</button>' +
      '</div>' +
    '</article>';
  });
  $("#lista").innerHTML = html;

  cablearEntreno(D);
  pintarProgresoDia();
  arrancarAnimacion();
}

/* Valor por defecto del stepper: lo que hiciste la última vez en esa serie,
   si no el mínimo del rango. */
function valorSugerido(e, uv, k){
  if (uv && uv.r.s && uv.r.s[k]) return uv.r.s[k].r;
  return e.min;
}

function cablearEntreno(D){
  var porId = {};
  D.ej.forEach(function(e){ porId[e.id] = e; });

  $$("[data-peso]", $("#lista")).forEach(function(inp){
    inp.addEventListener("change", function(){
      var id = inp.dataset.peso, v = num(inp.value);
      registro(id).kg = v;
      if (v != null) S.pesos[id] = v;
      guardar();
      renderEntreno(diaActual);
    });
  });

  $$(".serie", $("#lista")).forEach(function(fila){
    var e = porId[fila.dataset.ej], i = +fila.dataset.i;
    var val = $(".val", fila);
    var paso = e.tiempo ? 5 : 1;

    function leer(){ return parseInt(val.textContent, 10) || 0; }
    function poner(v){
      v = Math.max(0, v);
      val.innerHTML = v + (e.tiempo ? '<small>s</small>' : '');
      var r = registro(e.id);
      if (r.s[i]){ r.s[i].r = v; guardar(); }
    }
    $(".menos", fila).addEventListener("click", function(){ poner(leer() - paso); });
    $(".mas",  fila).addEventListener("click", function(){ poner(leer() + paso); });

    $(".hecho", fila).addEventListener("click", function(){
      var r = registro(e.id);
      if (r.s[i]){                                  /* desmarcar */
        r.s[i] = null;
        fila.classList.remove("ok");
      } else {
        r.s[i] = { r: leer(), kg: r.kg };
        fila.classList.add("ok");
        iniciarTimer(e.d, e.n + " · serie " + (i + 1));
      }
      guardar();
      pintarProgresoDia();
      refrescarHint(e);
    });
  });

  $$(".btn-descanso", $("#lista")).forEach(function(b){
    b.addEventListener("click", function(){ iniciarTimer(parseInt(b.dataset.d, 10), b.dataset.n); });
  });
}

/* Repinta solo el aviso de progresión de una tarjeta, sin re-renderizar el día
   (re-renderizar cerraría el teclado y perdería el scroll). */
function refrescarHint(e){
  var card = document.getElementById("card-" + e.id);
  if (!card) return;
  var vieja = $(".hint", card);
  if (vieja) vieja.remove();
  var sug = sugerencia(e);
  if (!sug) return;
  var div = document.createElement("div");
  div.className = "hint" + (sug.tipo === "baja" ? " baja" : "");
  div.textContent = sug.txt;
  $(".series", card).insertAdjacentElement("afterend", div);
}

/* Animación de 2 fotogramas solo en las tarjetas visibles: la versión anterior
   animaba las 7 a la vez, siempre, aunque estuvieran fuera de pantalla. */
function arrancarAnimacion(){
  if (animInt){ clearInterval(animInt); animInt = null; }
  if (io){ io.disconnect(); io = null; }
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (window.IntersectionObserver){
    io = new IntersectionObserver(function(ents){
      ents.forEach(function(x){ x.target.dataset.ver = x.isIntersecting ? "1" : "0"; });
    }, { rootMargin: "100px" });
    $$(".demo").forEach(function(d){ io.observe(d); });
  } else {
    $$(".demo").forEach(function(d){ d.dataset.ver = "1"; });
  }
  animInt = setInterval(function(){
    if (document.hidden) return;
    $$('.demo[data-ver="1"]').forEach(function(d){ d.classList.toggle("anima"); });
  }, 1100);
}

/* ==========================================================================
   6. Pestaña NUTRICIÓN
   ========================================================================== */

/* Objetivos derivados del peso corporal — guía §7.2 y §7.3.
   Déficit moderado de ~350 kcal. La tabla de la guía es lineal:
   75 kg → 1.800 kcal, +20 kcal por kg, con SUELO INNEGOCIABLE de 1.600. */
var SUELO_KCAL = 1600;
function objetivos(peso){
  var p = Math.min(150, Math.max(40, peso));
  var kcal = Math.max(SUELO_KCAL, Math.round((1800 + (p - 75) * 20) / 10) * 10);
  var prot = Math.round(p * 1.75 / 5) * 5;              /* ~135 g a 77,5 kg */
  var gras = Math.max(50, Math.round(kcal * 0.29 / 9)); /* ~60 g, suelo hormonal de 50 */
  var carb = Math.max(0, Math.round((kcal - prot * 4 - gras * 9) / 4));
  return { kcal:kcal, prot:prot, gras:gras, carb:carb, suelo: kcal === SUELO_KCAL };
}

function pesoActual(){
  if (S.corporal.length) return S.corporal[S.corporal.length - 1].kg;
  return S.perfil.peso;
}

function diaNutri(f){
  f = f || hoy();
  if (!S.nutricion[f]) S.nutricion[f] = { comidas: {} };
  var d = S.nutricion[f];
  window.COMIDAS.forEach(function(c){ if (!Array.isArray(d.comidas[c.id])) d.comidas[c.id] = []; });
  return d;
}

/* Macros de una entrada. Las manuales llevan sus valores dentro; las del
   catálogo se calculan al vuelo desde ALIMENTOS. */
function macrosDe(it){
  if (it.manual) return { kcal:it.kcal||0, prot:it.prot||0, carb:it.carb||0, gras:it.gras||0, n:it.n };
  var a = window.ALIMENTOS.filter(function(x){ return x.id === it.a; })[0];
  if (!a) return { kcal:0, prot:0, carb:0, gras:0, n:"(desconocido)" };
  var f = it.g / 100;
  return { kcal:a.kcal*f, prot:a.prot*f, carb:a.carb*f, gras:a.gras*f, n:a.n };
}
function sumaDia(f){
  var d = diaNutri(f), t = { kcal:0, prot:0, carb:0, gras:0 };
  window.COMIDAS.forEach(function(c){
    d.comidas[c.id].forEach(function(it){
      var m = macrosDe(it);
      t.kcal += m.kcal; t.prot += m.prot; t.carb += m.carb; t.gras += m.gras;
    });
  });
  return t;
}
function sumaComida(f, cid){
  var t = { kcal:0, prot:0 };
  diaNutri(f).comidas[cid].forEach(function(it){
    var m = macrosDe(it); t.kcal += m.kcal; t.prot += m.prot;
  });
  return t;
}

function anilloSVG(pct){
  var R = 42, C = 2 * Math.PI * R;
  var off = C * (1 - Math.min(1, pct));
  return '<svg width="96" height="96" viewBox="0 0 96 96">' +
    '<circle cx="48" cy="48" r="' + R + '" fill="none" stroke="var(--card3)" stroke-width="8"></circle>' +
    '<circle cx="48" cy="48" r="' + R + '" fill="none" stroke="var(--acento)" stroke-width="8" stroke-linecap="round"' +
    ' stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"></circle></svg>';
}

function renderNutricion(){
  var v = $("#v-nutricion");
  var peso = pesoActual();

  if (!peso){
    v.innerHTML =
      '<div class="bloque"><h3>Primero, tu peso</h3>' +
      '<p class="desc">Los objetivos de calorías y proteína salen de tu peso corporal. ' +
      'La guía pide pesarte 3 mañanas seguidas en ayunas y usar la media.</p>' +
      '<div class="entrada"><input type="text" inputmode="decimal" id="pesoInicial" placeholder="kg" aria-label="Tu peso en kg">' +
      '<button id="guardarPeso">Guardar</button></div></div>';
    $("#guardarPeso").addEventListener("click", function(){
      var kg = num($("#pesoInicial").value);
      if (kg == null || kg < 30 || kg > 250){ toast("Introduce un peso válido en kg."); return; }
      S.perfil.peso = kg;
      S.corporal.push({ d: hoy(), kg: kg });
      guardar(); renderNutricion(); renderProgreso();
    });
    return;
  }

  var o = objetivos(peso), t = sumaDia();
  var f = hoy();

  var html =
    '<div class="anillos">' +
      '<div class="anillo">' + anilloSVG(t.kcal / o.kcal) +
        '<div class="centro"><span class="big">' + Math.round(t.kcal) + '</span><span class="lil">de ' + o.kcal + ' kcal</span></div>' +
      '</div>' +
      '<div class="macros">' +
        barraMacro("Proteína", t.prot, o.prot, "var(--rojo)") +
        barraMacro("Carbos",   t.carb, o.carb, "var(--azul)") +
        barraMacro("Grasas",   t.gras, o.gras, "var(--amarillo)") +
      '</div>' +
    '</div>';

  window.COMIDAS.forEach(function(c){
    var items = diaNutri(f).comidas[c.id];
    var sc = sumaComida(f, c.id);
    var protOk = sc.prot >= (window.PROTE_COMIDA || 40);
    html +=
      '<div class="comida">' +
        '<div class="ch"><span>' + c.icono + '</span><h3>' + esc(c.n) + '</h3>' +
          '<span class="pr' + (protOk ? " ok" : "") + '">' + Math.round(sc.prot) + ' g P</span>' +
          '<span class="kc">' + Math.round(sc.kcal) + ' kcal</span></div>';
    if (!items.length){
      html += '<div class="vacio">Sin nada apuntado todavía</div>';
    } else {
      html += '<ul class="items">';
      items.forEach(function(it, idx){
        var m = macrosDe(it);
        html += '<li><span class="nm">' + esc(m.n) + '</span>' +
                '<span class="gr">' + it.g + ' g</span>' +
                '<span class="kc">' + Math.round(m.kcal) + '</span>' +
                '<button class="quitar" data-c="' + esc(c.id) + '" data-i="' + idx + '" aria-label="Quitar ' + esc(m.n) + '">×</button></li>';
      });
      html += '</ul>';
    }
    html += '<button class="addbtn" data-add="' + esc(c.id) + '">+ Añadir alimento</button></div>';
  });

  /* Suplementos del día — guía §5.4 */
  html += '<div class="bloque"><h3>Suplementos de hoy</h3><ul class="supl">';
  window.SUPLEMENTOS.forEach(function(s){
    var on = (S.supl[f] || {})[s.id];
    html += '<li><button class="chk' + (on ? " on" : "") + '" data-supl="' + esc(s.id) + '" aria-label="' + esc(s.n) + '">✓</button>' +
            '<span class="sn"><b>' + esc(s.n) + '</b><small>' + esc(s.nota) + '</small></span>' +
            '<span class="sd">' + esc(s.dosis) + '</span></li>';
  });
  html += '</ul></div>';

  html += '<div class="bloque"><h3>Reparto que buscas</h3>' +
    '<p class="desc">3 comidas con unos ' + (window.PROTE_COMIDA || 40) + ' g de proteína cada una. ' +
    'El cambio que más se nota es justo el desayuno: pasar la mañana sin comer encaja bastante con «me canso mucho».</p>' +
    '<ul class="hist" style="margin-top:4px">';
  (window.DESAYUNOS || []).forEach(function(d){
    html += '<li><span>' + esc(d.n) + '</span><b>' + esc(d.prot) + '</b></li>';
  });
  html += '</ul></div>';

  v.innerHTML = html;

  $$("[data-add]", v).forEach(function(b){
    b.addEventListener("click", function(){ abrirSelector(b.dataset.add); });
  });
  $$(".quitar", v).forEach(function(b){
    b.addEventListener("click", function(){
      diaNutri(f).comidas[b.dataset.c].splice(+b.dataset.i, 1);
      guardar(); renderNutricion();
    });
  });
  $$("[data-supl]", v).forEach(function(b){
    b.addEventListener("click", function(){
      if (!S.supl[f]) S.supl[f] = {};
      S.supl[f][b.dataset.supl] = !S.supl[f][b.dataset.supl];
      guardar(); renderNutricion();
    });
  });
}

function barraMacro(nombre, act, obj, color){
  var pct = Math.min(1, obj ? act / obj : 0);
  return '<div class="macro"><div class="mt"><b>' + nombre + '</b>' +
    '<span>' + Math.round(act) + ' / ' + obj + ' g</span></div>' +
    '<div class="mbar"><i style="width:' + (pct * 100).toFixed(0) + '%;background:' + color + '"></i></div></div>';
}

/* ---------- selector de alimentos ---------- */

function abrirSelector(cid){
  modal("Añadir a " + window.COMIDAS.filter(function(c){ return c.id === cid; })[0].n, function(cuerpo){
    cuerpo.innerHTML =
      '<input class="buscador" id="buscar" placeholder="Buscar alimento…" autocomplete="off">' +
      '<div id="resultados"></div>' +
      '<button class="btns" id="manual" style="margin-top:14px">Añadir algo que no está en la lista</button>';

    function pinta(filtro){
      var q = (filtro || "").trim().toLowerCase();
      var lista = window.ALIMENTOS.filter(function(a){ return !q || a.n.toLowerCase().indexOf(q) >= 0; });
      var cats = {}, orden = [];
      lista.forEach(function(a){
        if (!cats[a.cat]){ cats[a.cat] = []; orden.push(a.cat); }
        cats[a.cat].push(a);
      });
      var h = "";
      if (!lista.length) h = '<div class="vacio">Nada con ese nombre. Usa «añadir algo que no está en la lista».</div>';
      orden.forEach(function(c){
        h += '<div class="catlabel">' + esc(c) + '</div><ul class="flista">';
        cats[c].forEach(function(a){
          h += '<li data-a="' + esc(a.id) + '"><span class="fn"><b>' + esc(a.n) + '</b>' +
               (a.nota ? '<small>' + esc(a.nota) + '</small>' : '') + '</span>' +
               '<span class="fmac">' + a.kcal + ' kcal<br>' + dec(a.prot) + ' g P</span></li>';
        });
        h += '</ul>';
      });
      $("#resultados").innerHTML = h;
      $$("#resultados li").forEach(function(li){
        li.addEventListener("click", function(){ abrirGramos(cid, li.dataset.a); });
      });
    }
    pinta("");
    $("#buscar").addEventListener("input", function(){ pinta(this.value); });
    $("#manual").addEventListener("click", function(){ abrirManual(cid); });
  });
}

function abrirGramos(cid, aid){
  var a = window.ALIMENTOS.filter(function(x){ return x.id === aid; })[0];
  modal(a.n, function(cuerpo){
    cuerpo.innerHTML =
      '<div class="previsual" id="prev"></div>' +
      '<div class="gramos"><button class="btns" id="gmenos" style="width:56px">−</button>' +
      '<input type="text" inputmode="numeric" id="gval" value="' + a.racion + '" aria-label="Gramos">' +
      '<button class="btns" id="gmas" style="width:56px">+</button></div>' +
      '<button class="btnp" id="add">Añadir</button>';

    function refresca(){
      var g = num($("#gval").value, 0) || 0;
      var f = g / 100;
      $("#prev").innerHTML =
        '<b>' + Math.round(a.kcal * f) + ' kcal</b> · ' +
        decr(a.prot * f, 1) + ' g proteína · ' +
        decr(a.carb * f, 1) + ' g carbos · ' +
        decr(a.gras * f, 1) + ' g grasas<br>' +
        '<span style="color:var(--mut2)">Por 100 ' + (a.unidad || "g") + ': ' + a.kcal + ' kcal, ' + dec(a.prot) + ' g proteína</span>';
    }
    refresca();
    $("#gval").addEventListener("input", refresca);
    $("#gmenos").addEventListener("click", function(){ $("#gval").value = Math.max(0, (num($("#gval").value, 0) || 0) - 10); refresca(); });
    $("#gmas").addEventListener("click", function(){ $("#gval").value = (num($("#gval").value, 0) || 0) + 10; refresca(); });
    $("#add").addEventListener("click", function(){
      var g = num($("#gval").value, 0) || 0;
      if (g <= 0){ toast("Pon una cantidad mayor que cero."); return; }
      diaNutri().comidas[cid].push({ a: aid, g: Math.round(g) });
      guardar(); cerrarModal(); renderNutricion();
    });
  });
}

function abrirManual(cid){
  modal("Alimento manual", function(cuerpo){
    cuerpo.innerHTML =
      '<input class="buscador" id="mn" placeholder="Nombre" autocomplete="off">' +
      '<input class="buscador" id="mg" placeholder="Gramos" inputmode="numeric">' +
      '<input class="buscador" id="mk" placeholder="Calorías totales" inputmode="numeric">' +
      '<input class="buscador" id="mp" placeholder="Proteína total (g)" inputmode="decimal">' +
      '<input class="buscador" id="mc" placeholder="Carbos totales (g) — opcional" inputmode="decimal">' +
      '<input class="buscador" id="mf" placeholder="Grasas totales (g) — opcional" inputmode="decimal">' +
      '<button class="btnp" id="add" style="margin-top:6px">Añadir</button>' +
      '<p class="gnota" style="margin-top:10px">Copia los valores de la etiqueta del producto, ya multiplicados por lo que te vayas a comer.</p>';
    $("#add").addEventListener("click", function(){
      var n = $("#mn").value.trim();
      if (!n){ toast("Ponle un nombre."); return; }
      diaNutri().comidas[cid].push({
        manual:true, n:n,
        g: Math.round(num($("#mg").value, 0) || 0),
        kcal: num($("#mk").value, 0) || 0,
        prot: num($("#mp").value, 0) || 0,
        carb: num($("#mc").value, 0) || 0,
        gras: num($("#mf").value, 0) || 0
      });
      guardar(); cerrarModal(); renderNutricion();
    });
  });
}

/* ==========================================================================
   7. Pestaña PROGRESO
   ========================================================================== */

/* Media de una ventana de días hacia atrás. La guía insiste: ninguna decisión
   con el peso de un solo día, que baila 1-2 kg por agua. */
function mediaVentana(desdeDias, hastaDias){
  var hoyF = hoy();
  var xs = S.corporal.filter(function(p){
    var d = diasEntre(p.d, hoyF);
    return d >= hastaDias && d < desdeDias;
  });
  if (!xs.length) return null;
  return xs.reduce(function(a, p){ return a + p.kg; }, 0) / xs.length;
}

/* Negativo = está bajando. Objetivo: 0,3-0,5 kg/semana ⇒ -1,2 a -2,0 al mes. */
function ritmoMensual(){
  var reciente = mediaVentana(28, 0);
  var previa   = mediaVentana(56, 28);
  if (reciente == null || previa == null) return null;
  return reciente - previa;
}
var RITMO_MIN = -2.0, RITMO_MAX = -1.2, RITMO_RAPIDO = -2.8;  /* -0,7 kg/semana */

function mediaEnergia(desdeDias, hastaDias){
  var hoyF = hoy(), suma = 0, n = 0;
  Object.keys(S.energia).forEach(function(f){
    var d = diasEntre(f, hoyF);
    if (d >= hastaDias && d < desdeDias && S.energia[f] && S.energia[f].n){
      suma += S.energia[f].n; n++;
    }
  });
  return n ? { media: suma / n, n: n } : null;
}

/* Cambio de una medida entre la última toma y la más antigua dentro de la ventana. */
function cambioMedida(campo, dias){
  var hoyF = hoy();
  var xs = S.medidas.filter(function(m){
    return m[campo] != null && diasEntre(m.d, hoyF) <= dias;
  });
  if (xs.length < 2) return null;
  return xs[xs.length - 1][campo] - xs[0][campo];
}

/* Árbol de decisión de la guía §9, resuelto con los datos que hay.
   Ojo al orden: el escenario 1 (báscula plana pero medidas bajando) es ÉXITO,
   no fracaso, y hay que distinguirlo del 2 antes de tocar nada. */
function escenarioActivo(){
  var r = ritmoMensual();
  var en = mediaEnergia(28, 0), en0 = mediaEnergia(84, 56);
  if (en && en0 && en.n >= 8 && en0.n >= 8 && en.media <= en0.media) return 4;
  if (r == null) return null;
  if (r < RITMO_RAPIDO) return 3;
  if (r > -0.4){
    var cint = cambioMedida("cintura", 60);
    if (cint != null && cint <= -1) return 1;
    return 2;
  }
  return null;
}

function sparkline(pts, campo){
  campo = campo || "kg";
  pts = pts.filter(function(p){ return p[campo] != null; });
  if (pts.length < 2) return "";
  var w = 320, h = 70, pad = 6;
  var ks = pts.map(function(p){ return p[campo]; });
  var min = Math.min.apply(null, ks), max = Math.max.apply(null, ks);
  if (max - min < 0.5){ min -= 0.5; max += 0.5; }
  var t0 = desdeISO(pts[0].d).getTime(), t1 = desdeISO(pts[pts.length - 1].d).getTime();
  var span = Math.max(1, t1 - t0);
  var d = pts.map(function(p, i){
    var x = pad + (desdeISO(p.d).getTime() - t0) / span * (w - pad * 2);
    var y = h - pad - (p[campo] - min) / (max - min) * (h - pad * 2);
    return (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1);
  }).join(" ");
  return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
    '<path d="' + d + '" fill="none" stroke="var(--acento)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>';
}

var ENERGIA_ET = { 1:"En el suelo", 2:"Floja", 3:"Normal", 4:"Bien", 5:"A tope" };

function sesionesCardioSemana(){
  var hoyF = hoy(), n = 0;
  Object.keys(S.cardio).forEach(function(f){
    if (diasEntre(f, hoyF) < 7 && (S.cardio[f] || []).length) n += S.cardio[f].length;
  });
  return n;
}

function renderProgreso(){
  var v = $("#v-progreso");
  var f = hoy();
  var media = mediaVentana(28, 0);
  var ritmo = ritmoMensual();
  var ult = S.corporal.length ? S.corporal[S.corporal.length - 1] : null;
  var escN = escenarioActivo();

  /* ---------- energía: su métrica principal ---------- */
  var hoyE = S.energia[f] || {};
  var en4 = mediaEnergia(28, 0), enPrev = mediaEnergia(56, 28);
  var html =
    '<div class="bloque"><h3>Energía de hoy</h3>' +
    '<p class="desc">Tu objetivo número uno es dejar de cansarte tanto, así que hay que medirlo. ' +
    'Del 1 al 5, cómo has estado hoy.</p>' +
    '<div class="energia">';
  for (var i = 1; i <= 5; i++){
    html += '<button data-en="' + i + '" class="' + (hoyE.n === i ? "on" : "") + '">' + i +
            '<small>' + esc(ENERGIA_ET[i]) + '</small></button>';
  }
  html += '</div>';
  html += '<div class="entrada" style="margin-top:10px">' +
    '<input type="text" inputmode="numeric" id="ciclo" placeholder="Día de ciclo (opcional)" ' +
    'value="' + (hoyE.ciclo != null ? esc(hoyE.ciclo) : "") + '" aria-label="Día de ciclo">' +
    '<button id="addCiclo">Guardar</button></div>' +
    '<p class="gnota" style="margin-top:8px">Apuntar el día de ciclo junto a la energía es lo que te va ' +
    'a decir, en dos o tres meses, si hay un patrón real o no.</p>';
  if (en4){
    html += '<div class="kpis" style="margin-top:12px">' +
      '<div class="kpi"><div class="v">' + decr(en4.media, 1) + '</div><div class="l">Media<br>4 semanas</div></div>' +
      '<div class="kpi"><div class="v">' + (enPrev ? decr(enPrev.media, 1) : "—") + '</div><div class="l">Media<br>4 anteriores</div></div>' +
      '<div class="kpi"><div class="v">' + en4.n + '</div><div class="l">Días<br>apuntados</div></div>' +
      '</div>';
  }
  html += '</div>';

  /* ---------- cardio ---------- */
  var nCardio = sesionesCardioSemana();
  html += '<div class="bloque"><h3>Cardio de esta semana</h3>' +
    '<p class="desc">2 sesiones de 20-30 min por semana, sin impacto. Aquí es donde se construye ' +
    'la resistencia, no solo con las pesas.</p>' +
    '<div class="semana">' +
      '<i class="' + (nCardio >= 1 ? "hecho" : "") + '"></i>' +
      '<i class="' + (nCardio >= 2 ? "hecho" : "") + '"></i>' +
    '</div>' +
    '<p class="gnota" style="margin-bottom:10px">' + nCardio + ' de 2 sesiones' +
    (nCardio >= 2 ? ' — objetivo cumplido 👏' : '') + '</p>' +
    '<div class="cardios">';
  (window.CARDIOS || []).forEach(function(c){
    html += '<button data-cardio="' + esc(c.id) + '"><span class="ic">' + c.icono + '</span>' + esc(c.n) + '</button>';
  });
  html += '</div></div>';

  /* ---------- peso ---------- */
  html += '<div class="bloque"><h3>Peso corporal</h3>' +
    '<p class="desc">Ayunas, misma hora, misma báscula. La báscula sola engaña: estás ganando músculo ' +
    'mientras pierdes grasa, así que puede moverse poco. Decisiones solo con la media de 4 semanas.</p>' +
    '<div class="kpis">' +
      '<div class="kpi"><div class="v">' + (ult ? decr(ult.kg, 1) : "—") + '</div><div class="l">Último<br>kg</div></div>' +
      '<div class="kpi"><div class="v">' + (media != null ? decr(media, 1) : "—") + '</div><div class="l">Media<br>4 semanas</div></div>' +
      '<div class="kpi"><div class="v">' + (ritmo != null ? (ritmo > 0 ? "+" : "") + decr(ritmo, 2) : "—") + '</div><div class="l">Ritmo<br>kg/mes</div></div>' +
    '</div>' +
    sparkline(S.corporal.slice(-60)) +
    '<div class="entrada"><input type="text" inputmode="decimal" id="nuevoPeso" placeholder="kg de hoy" aria-label="Peso de hoy">' +
    '<button id="addPeso">Apuntar</button></div>';

  if (ritmo != null){
    var dentro = ritmo <= RITMO_MAX && ritmo >= RITMO_MIN;
    var txt, tit;
    if (dentro){ tit = "Ritmo correcto"; txt = "Vas justo donde toca. No toques nada."; }
    else if (ritmo < RITMO_RAPIDO){ tit = "Estás bajando demasiado rápido"; txt = "A este ritmo se pierde músculo y energía. Toca <b>comer más</b>, no menos."; }
    else if (ritmo < RITMO_MIN){ tit = "Algo rápido"; txt = "Un poco por encima del objetivo. Vigila que no se acelere más."; }
    else if (ritmo > -0.4){ tit = "La báscula no se mueve"; txt = "Mira las medidas antes de tocar las calorías: si la cintura baja, esto es éxito y no hay que cambiar nada."; }
    else { tit = "Bajando despacio"; txt = "Por debajo del objetivo pero en la dirección correcta. Dale 4 semanas más antes de tocar nada."; }
    html += '<div class="esc' + (dentro ? "" : " activo") + '" id="ritmobox" style="margin-top:12px">' +
      '<h4>' + tit + '</h4><div class="cond">Objetivo: −0,3 a −0,5 kg/semana (−1,2 a −2,0 al mes)</div>' + txt + '</div>';
  } else {
    html += '<p class="gnota" style="margin-top:12px">Necesitas ~8 semanas de pesos apuntados para calcular el ritmo.</p>';
  }
  html += '</div>';

  /* ---------- medidas: más fiables que el peso ---------- */
  var ultM = S.medidas.length ? S.medidas[S.medidas.length - 1] : null;
  html += '<div class="bloque"><h3>Medidas</h3>' +
    '<p class="desc">Cada 4 semanas, relajada y siempre en el mismo sitio. Son más fiables que la ' +
    'báscula durante una recomposición.</p>';
  if (ultM){
    html += '<div class="kpis">' +
      '<div class="kpi"><div class="v">' + (ultM.cintura != null ? decr(ultM.cintura, 1) : "—") + '</div><div class="l">Cintura<br>cm</div></div>' +
      '<div class="kpi"><div class="v">' + (ultM.cadera != null ? decr(ultM.cadera, 1) : "—") + '</div><div class="l">Cadera<br>cm</div></div>' +
      '<div class="kpi"><div class="v">' + (ultM.muslo != null ? decr(ultM.muslo, 1) : "—") + '</div><div class="l">Muslo<br>cm</div></div>' +
      '</div>';
    var dc = cambioMedida("cintura", 60);
    if (dc != null){
      html += '<p class="gnota" style="margin-bottom:10px">Cintura: <b>' +
        (dc > 0 ? "+" : "") + decr(dc, 1) + ' cm</b> en las últimas 8 semanas.</p>';
    }
  }
  html += '<div class="entrada" style="margin-bottom:8px">' +
    '<input type="text" inputmode="decimal" id="mCintura" placeholder="Cintura" aria-label="Cintura en cm">' +
    '<input type="text" inputmode="decimal" id="mCadera" placeholder="Cadera" aria-label="Cadera en cm">' +
    '<input type="text" inputmode="decimal" id="mMuslo" placeholder="Muslo" aria-label="Muslo en cm"></div>' +
    '<button class="btns" id="addMedidas">Apuntar medidas</button></div>';

  /* ---------- fotos ---------- */
  var ultFoto = S.ajustes.ultimaFoto;
  var diasFoto = ultFoto ? diasEntre(ultFoto, hoy()) : null;
  html += '<div class="bloque"><h3>Fotos de progreso</h3>' +
    '<p class="desc">Frente, lado y espalda cada 4 semanas. Misma luz, misma hora, mismo sitio. ' +
    'La ropa empieza a sentar distinto antes de que se note en el espejo.</p>' +
    (diasFoto == null
      ? '<p class="gnota">Aún no has marcado ninguna sesión de fotos.</p>'
      : '<p class="gnota">Últimas hace ' + diasFoto + ' días' + (diasFoto >= 28 ? ' — <b style="color:var(--warn)">toca hacerlas</b>' : '') + '.</p>') +
    '<button class="btns" id="addFoto" style="margin-top:10px">Marcar fotos hechas hoy</button></div>';

  /* ---------- árbol de decisión ---------- */
  html += '<div class="bloque"><h3>Árbol de decisión</h3>' +
    '<p class="desc">Se evalúa cada 4 semanas, nunca antes.</p>';
  window.ESCENARIOS.forEach(function(e){
    html += '<div class="esc' + (escN === e.id ? " activo" : "") + '" style="margin-bottom:8px">' +
      '<h4>' + (escN === e.id ? "▶ " : "") + e.id + ". " + esc(e.t) + '</h4>' +
      '<div class="cond">' + e.cond + '</div>' + e.txt + '</div>';
  });
  html += '</div>';

  /* ---------- historial ---------- */
  var fechas = Object.keys(S.sesiones).filter(function(x){
    var ss = S.sesiones[x];
    return Object.keys(ss.ej).some(function(id){ return ss.ej[id].s && ss.ej[id].s.some(Boolean); });
  }).sort().reverse().slice(0, 12);
  html += '<div class="bloque"><h3>Últimos entrenos</h3>';
  if (!fechas.length) html += '<p class="gnota">Todavía no has registrado ninguna serie.</p>';
  else {
    html += '<ul class="hist">';
    fechas.forEach(function(x){
      var ss = S.sesiones[x], n = 0;
      Object.keys(ss.ej).forEach(function(id){ n += (ss.ej[id].s || []).filter(Boolean).length; });
      var D = window.DIAS[ss.dia];
      html += '<li><span>' + fmtFecha(x) + ' · ' + esc(D ? D.corto : "?") + '</span><b>' + n + ' series</b></li>';
    });
    html += '</ul>';
  }
  html += '</div>';

  /* ---------- datos ---------- */
  html += '<div class="bloque"><h3>Tus datos</h3>' +
    '<p class="desc">Todo vive solo en este teléfono. Si borras los datos de Safari o cambias de móvil, ' +
    'se pierde. Haz una copia de vez en cuando.</p>' +
    '<button class="btns" id="exportar" style="margin-bottom:8px">Exportar copia de seguridad</button>' +
    '<button class="btns" id="importar">Restaurar desde una copia</button></div>';

  v.innerHTML = html;

  $$("[data-en]", v).forEach(function(b){
    b.addEventListener("click", function(){
      if (!S.energia[f]) S.energia[f] = {};
      S.energia[f].n = +b.dataset.en;
      guardar(); renderProgreso();
    });
  });
  $("#addCiclo").addEventListener("click", function(){
    var d = num($("#ciclo").value);
    if (!S.energia[f]) S.energia[f] = {};
    if (d == null) delete S.energia[f].ciclo;
    else if (d < 1 || d > 60){ toast("El día de ciclo va de 1 a 60."); return; }
    else S.energia[f].ciclo = Math.round(d);
    guardar(); renderProgreso(); toast("Anotado.");
  });
  $$("[data-cardio]", v).forEach(function(b){
    b.addEventListener("click", function(){
      if (!Array.isArray(S.cardio[f])) S.cardio[f] = [];
      S.cardio[f].push({ tipo: b.dataset.cardio });
      guardar(); renderProgreso(); toast("Sesión de cardio apuntada.");
    });
  });
  $("#addPeso").addEventListener("click", function(){
    var kg = num($("#nuevoPeso").value);
    if (kg == null || kg < 30 || kg > 250){ toast("Introduce un peso válido en kg."); return; }
    var yaHoy = S.corporal.filter(function(x){ return x.d === f; })[0];
    if (yaHoy) yaHoy.kg = kg; else S.corporal.push({ d:f, kg:kg });
    S.corporal.sort(function(a, b){ return a.d < b.d ? -1 : 1; });
    S.perfil.peso = kg;
    guardar(); renderProgreso(); renderNutricion();
    toast("Peso apuntado.");
  });
  $("#addMedidas").addEventListener("click", function(){
    var m = { d:f, cintura:num($("#mCintura").value), cadera:num($("#mCadera").value), muslo:num($("#mMuslo").value) };
    if (m.cintura == null && m.cadera == null && m.muslo == null){ toast("Rellena al menos una medida."); return; }
    var mal = ["cintura","cadera","muslo"].some(function(k){ return m[k] != null && (m[k] < 20 || m[k] > 200); });
    if (mal){ toast("Alguna medida está fuera de rango (20-200 cm)."); return; }
    var yaHoy = S.medidas.filter(function(x){ return x.d === f; })[0];
    if (yaHoy) Object.assign(yaHoy, m); else S.medidas.push(m);
    S.medidas.sort(function(a, b){ return a.d < b.d ? -1 : 1; });
    guardar(); renderProgreso(); toast("Medidas apuntadas.");
  });
  $("#addFoto").addEventListener("click", function(){
    S.ajustes.ultimaFoto = hoy(); guardar(); renderProgreso(); toast("Anotado.");
  });
  $("#exportar").addEventListener("click", exportar);
  $("#importar").addEventListener("click", importar);
}

/* ==========================================================================
   8. Copia de seguridad
   ========================================================================== */

function exportar(){
  guardarYa();
  var json = JSON.stringify(S, null, 2);
  var nombre = "rutina-copia-" + hoy() + ".json";
  modal("Copia de seguridad", function(cuerpo){
    cuerpo.innerHTML =
      '<p class="previsual">Guarda este archivo en algún sitio seguro (Archivos, correo, notas). ' +
      'Contiene tus entrenos, pesos y nutrición.</p>' +
      '<a class="btnp" id="descargar" style="display:block;text-align:center;text-decoration:none" download="' + esc(nombre) + '">Descargar archivo</a>' +
      '<button class="btns" id="copiar" style="margin-top:8px">Copiar al portapapeles</button>' +
      '<textarea class="buscador" id="salida" rows="6" readonly style="margin-top:12px;font-family:ui-monospace,monospace;font-size:11px"></textarea>';
    $("#salida").value = json;
    var url = URL.createObjectURL(new Blob([json], { type:"application/json" }));
    $("#descargar").href = url;
    $("#copiar").addEventListener("click", function(){
      var ta = $("#salida");
      ta.select(); ta.setSelectionRange(0, 999999);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch(e){}
      if (navigator.clipboard) navigator.clipboard.writeText(json).then(function(){ toast("Copiado."); }, function(){});
      else toast(ok ? "Copiado." : "Selecciona el texto y cópialo a mano.");
    });
  });
}

function importar(){
  modal("Restaurar copia", function(cuerpo){
    cuerpo.innerHTML =
      '<p class="previsual"><b>Ojo:</b> esto reemplaza todos los datos actuales de la app por los de la copia.</p>' +
      '<input type="file" id="fichero" accept="application/json,.json" class="buscador">' +
      '<p class="catlabel">o pega el contenido</p>' +
      '<textarea class="buscador" id="entrada" rows="6" placeholder="{ … }" style="font-family:ui-monospace,monospace;font-size:11px"></textarea>' +
      '<button class="btnp" id="restaurar" style="margin-top:10px">Restaurar</button>';
    $("#fichero").addEventListener("change", function(){
      var f = this.files && this.files[0];
      if (!f) return;
      var fr = new FileReader();
      fr.onload = function(){ $("#entrada").value = fr.result; };
      fr.readAsText(f);
    });
    $("#restaurar").addEventListener("click", function(){
      var txt = $("#entrada").value.trim();
      if (!txt){ toast("Elige un archivo o pega el contenido."); return; }
      var o;
      try { o = JSON.parse(txt); } catch(e){ toast("Ese texto no es una copia válida."); return; }
      if (!o || typeof o !== "object" || !("sesiones" in o)){ toast("Ese archivo no parece una copia de esta app."); return; }
      if (!confirm("Se van a reemplazar todos los datos actuales. ¿Seguro?")) return;
      S = Object.assign(estadoVacio(), o);
      guardarYa(); cerrarModal();
      renderEntreno(diaActual); renderNutricion(); renderProgreso();
      toast("Copia restaurada.");
    });
  });
}

/* ==========================================================================
   9. Pestaña GUÍA
   ========================================================================== */

function renderGuia(){
  var h = "";
  window.GUIA.forEach(function(s){
    h += '<details class="gsec"' + (s.abierto ? " open" : "") + '>' +
         '<summary>' + esc(s.h) + '</summary>' +
         '<div class="gcuerpo">' + s.html + '</div></details>';
  });
  $("#v-guia").innerHTML = h;
}

/* ==========================================================================
   10. Modal
   ========================================================================== */

function modal(titulo, construir){
  $("#modaltitulo").textContent = titulo;
  var cuerpo = $("#modalcuerpo");
  cuerpo.innerHTML = "";
  construir(cuerpo);
  $("#modal").classList.add("abierto");
}
function cerrarModal(){ $("#modal").classList.remove("abierto"); }
$("#modalcerrar").addEventListener("click", cerrarModal);
$("#modalvelo").addEventListener("click", cerrarModal);

/* ==========================================================================
   11. Navegación
   ========================================================================== */

var tabActual = "entreno";
function irA(tab){
  tabActual = tab;
  $$(".vista").forEach(function(v){ v.classList.toggle("activa", v.id === "v-" + tab); });
  $$("#tabbar button").forEach(function(b){ b.classList.toggle("activo", b.dataset.tab === tab); });
  $("#plates").classList.toggle("oculto", tab !== "entreno");

  var titulos = {
    entreno:   ["Rutina 4 días", "Inferior · Superior · ×2 por músculo"],
    nutricion: ["Nutrición", "Déficit moderado · proteína alta"],
    progreso:  ["Progreso", "Energía, peso y medidas"],
    guia:      ["Guía", "Lo que necesitas en el gimnasio"]
  };
  $("#ttitulo").textContent = titulos[tab][0];
  $("#tsub").textContent = titulos[tab][1];

  if (tab === "nutricion") renderNutricion();
  if (tab === "progreso")  renderProgreso();
  if (tab === "guia" && !$("#v-guia").innerHTML) renderGuia();
  window.scrollTo({ top:0 });
}
$$("#tabbar button").forEach(function(b){
  b.addEventListener("click", function(){ irA(b.dataset.tab); });
});
$$(".plate").forEach(function(p){
  p.addEventListener("click", function(){ renderEntreno(p.dataset.dia); });
});

/* ==========================================================================
   12. Aviso de instalación y service worker
   ========================================================================== */

function esStandalone(){
  return window.navigator.standalone === true ||
         (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
}
/* El tobillo manda sobre todo lo demás: el aviso sale hasta que se descarta,
   y las etiquetas «Ojo al tobillo» de cada ejercicio se quedan siempre. */
(function avisoTobillo(){
  var caja = $("#avisotobillo");
  if (!caja || !window.AVISO_TOBILLO) return;
  if (leerBruto("aviso:tobillo") === "1") return;
  caja.innerHTML = '<span class="ic">\u26a0\ufe0f</span><div>' + esc(window.AVISO_TOBILLO) + '</div>' +
                   '<button id="cerraraviso" aria-label="Cerrar aviso">\u00d7</button>';
  caja.classList.remove("oculto");
  $("#cerraraviso").addEventListener("click", function(){
    caja.classList.add("oculto");
    escribirBruto("aviso:tobillo", "1");
  });
})();

(function avisoInstalar(){
  var esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (esStandalone() || !esIOS) return;
  if (leerBruto("instala:oculto") === "1") return;
  $("#instala").classList.remove("oculto");
  $("#cerrarinstala").addEventListener("click", function(){
    $("#instala").classList.add("oculto");
    escribirBruto("instala:oculto", "1");
  });
})();

if ("serviceWorker" in navigator){
  window.addEventListener("load", function(){
    navigator.serviceWorker.register("./sw.js").then(function(reg){
      reg.addEventListener("updatefound", function(){
        var nuevo = reg.installing;
        if (!nuevo) return;
        nuevo.addEventListener("statechange", function(){
          if (nuevo.state === "installed" && navigator.serviceWorker.controller){
            toast("Hay una versión nueva.", "Actualizar", function(){
              nuevo.postMessage({ tipo:"saltar" });
            });
          }
        });
      });
    }).catch(function(){ /* sin SW la app sigue funcionando, solo pierde el offline */ });

    var recargando = false;
    navigator.serviceWorker.addEventListener("controllerchange", function(){
      if (recargando) return;
      recargando = true;
      location.reload();
    });
  });
}

/* ==========================================================================
   13. Arranque
   ========================================================================== */

cargar();

/* Día sugerido por el día de la semana, salvo que ya haya trabajo hecho hoy. */
(function elegirDia(){
  var s = S.sesiones[hoy()];
  if (s && Object.keys(s.ej).some(function(id){ return (s.ej[id].s || []).some(Boolean); })){
    diaActual = s.dia || "A";
  } else {
    diaActual = window.DIA_SUGERIDO[new Date().getDay()] || "A";
  }
})();

renderEntreno(diaActual);
renderGuia();

/* Si el día cambia mientras la app sigue abierta (medianoche, o vuelves al día
   siguiente sin cerrarla), se repinta con la sesión nueva y vacía. */
var diaCargado = hoy();
document.addEventListener("visibilitychange", function(){
  if (document.hidden) return;
  if (hoy() !== diaCargado){
    diaCargado = hoy();
    diaActual = window.DIA_SUGERIDO[new Date().getDay()] || diaActual;
    renderEntreno(diaActual);
    if (tabActual === "nutricion") renderNutricion();
    if (tabActual === "progreso") renderProgreso();
  }
});

/* Al irse a segundo plano solo se vuelca lo que quede pendiente del debounce.
   Reescribir siempre el estado en memoria pisaría cambios hechos fuera. */
window.addEventListener("pagehide", function(){ if (guardarPdte) guardarYa(); });

})();
