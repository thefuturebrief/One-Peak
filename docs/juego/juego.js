// Menú, prólogo, conversaciones, diario y el bucle del juego. El mundo lo construye mundo.js desde plano.json.
const PERSONAJES = ['grumete', 'madre', 'nino', 'viejo', 'navegante', 'pescadora', 'vecina', 'marine', 'tabernera', 'capitan', 'maton', 'padre', 'hermana', 'forastero', 'teniente', 'pirata'];
const SHEETS = {}, ROW = { up: 0, left: 1, down: 2, right: 3 };
const loadImg = s => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('No se pudo cargar ' + s)); i.src = s; });
function drawLPC(g, id, x, y, dir, frame, scale = 1) { const im = SHEETS[id]; if (!im) return; g.drawImage(im, frame * 64, ROW[dir] * 64, 64, 64, Math.round(x - 32 * scale), Math.round(y - 60 * scale), 64 * scale, 64 * scale); }
let PLANO, CREDITOS;
const listo = (async () => {
  await Promise.all([...Object.entries(ATLAS).map(([k, s]) => loadImg(s).then(i => A[k] = i)), ...PERSONAJES.map(id => loadImg('assets/personajes/' + id + '.png').then(i => SHEETS[id] = i))]);
  await cargarCatalogo();
  PLANO = await (await fetch('plano.json')).json(); CREDITOS = await (await fetch('assets/creditos.json')).json();
  buildIsland(PLANO);
})();

// =====================================================================
// PRÓLOGO: seis recuerdos, cada uno define una sola cosa
// =====================================================================
const AX = { coraje: ['Cauto', 'Temerario'], corazon: ['Frío', 'Compasivo'], orgullo: ['Humilde', 'Orgulloso'], libertad: ['Disciplinado', 'Libre'], ambicion: ['Sereno', 'Ambicioso'] };
const STATS = [['fuerza', 'Fuerza'], ['resistencia', 'Resistencia'], ['agilidad', 'Agilidad'], ['iq', 'IQ de combate'], ['intelecto', 'Intelecto'], ['voluntad', 'Voluntad'], ['carisma', 'Carisma']];
const OFICIOS = { carpintero: 'Aprendiz de carpintero naval', cocinero: 'Pinche de cocina', navegante: 'Ayudante del cartógrafo', medico: 'Ayudante del médico', arqueologo: 'Lector del faro', combatiente: 'Pendenciero del puerto', musico: 'Músico callejero', tirador: 'Cazador de gaviotas' };
const Q = [
  { age: '7 años', q: '¿Qué historia te contaban para dormir?', o: [{ t: 'La del Rey de los Piratas y su tesoro al final del mar.', ax: { ambicion: 1, libertad: 1 }, tags: ['tesoro'] }, { t: 'La de un barco que navegó más allá de todos los mapas.', ax: { coraje: 1 }, of: { navegante: 1 }, tags: ['explorar'] }, { t: 'Ninguna. En casa nadie contaba historias desde que se fue papá.', ax: { corazon: -1 }, st: { resistencia: 1 }, tags: ['padre'] }] },
  { age: '9 años', q: 'Un chico mayor te quitó algo que querías mucho.', o: [{ t: 'Le pegaste, aunque sabías que ibas a perder.', ax: { orgullo: 1, coraje: 1 }, st: { voluntad: 2 }, bond: 'rival' }, { t: 'Lo recuperaste con una trampa.', ax: { libertad: 1 }, st: { iq: 2 }, bond: 'rival' }, { t: 'Lo dejaste estar. No valía la pena.', ax: { orgullo: -1 }, st: { intelecto: 1 } }] },
  { age: '11 años', many: true, q: '¿Dónde se te iban las tardes?', o: [{ t: 'En el astillero, entre virutas.', of: { carpintero: 3 }, st: { fuerza: 1 } }, { t: 'En la cocina de la taberna.', of: { cocinero: 3 }, st: { resistencia: 1 } }, { t: 'Dibujando la costa y las estrellas.', of: { navegante: 3 }, st: { intelecto: 1 } }, { t: 'Con el médico, sujetando vendas.', of: { medico: 3 }, ax: { corazon: 1 } }, { t: 'Leyendo los libros viejos del faro.', of: { arqueologo: 3 }, st: { intelecto: 1 } }, { t: 'Peleándote en el puerto.', of: { combatiente: 3 }, st: { fuerza: 1, agilidad: 1 } }, { t: 'Tocando cualquier cosa que sonara.', of: { musico: 3 }, st: { carisma: 1 } }, { t: 'Tirando piedras a las gaviotas.', of: { tirador: 3 }, st: { agilidad: 2 } }] },
  { age: '13 años', q: 'Tu mejor amigo de la infancia…', o: [{ t: '…era más fuerte que tú y te protegía.', ax: { corazon: 1 }, bond: 'amigo:protector' }, { t: '…se fue en un barco y nunca escribió.', ax: { corazon: 1 }, bond: 'perdido', tags: ['explorar'] }, { t: 'No tenías. Te bastaba con cuidar de Corso.', ax: { corazon: 1, orgullo: 1 }, st: { voluntad: 1 } }] },
  { age: '15 años', q: 'Un marine le pegaba a un pescador viejo en el muelle.', o: [{ t: 'Te metiste en medio.', ax: { coraje: 1, corazon: 1 }, st: { voluntad: 1 }, tags: ['justicia'] }, { t: 'Le tiraste una piedra y saliste corriendo.', ax: { libertad: 1 }, st: { agilidad: 1 }, tr: ['Desconfía de la Marina'] }, { t: 'Nada. Los marines son la ley.', ax: { libertad: -2 }, tags: ['justicia'] }] },
  { age: 'Anoche', q: 'Entró en el puerto un barco con bandera negra. ¿Qué pensaste?', o: [{ t: 'Que por fin pasaba algo en esta isla.', ax: { coraje: 1, ambicion: 1 } }, { t: 'Que había que avisar a la Marina.', ax: { libertad: -1, corazon: 1 } }, { t: 'Que era tu oportunidad de irte.', ax: { libertad: 1, ambicion: 1 }, tags: ['barco'] }] },
];
const EVENTS = [
  { t: () => 'Un forastero pasó un verano entero en la isla. Antes de irse, te enseñó a pelear de verdad.', fx: { st: { fuerza: 2, iq: 1 }, of: { combatiente: 1 }, bond: 'maestro' } },
  { t: () => 'La marea dejó en la playa un trozo de mapa envuelto en hule. Nadie supo decirte de dónde era.', fx: { tags: ['explorar'], item: 'Trozo de mapa' } },
  { t: () => 'Casi te ahogas en el puerto. Te sacó del agua alguien a quien nunca volviste a ver.', fx: { tr: ['Miedo al mar de noche'], bond: 'salvador', st: { voluntad: 1 } } },
  { t: () => 'Una noche viste a tu madre llorando frente al mar. Cuando te vio, se secó la cara y no dijo nada.', fx: { tags: ['padre'], ax: { corazon: 1 } } },
];
const DREAMS = [
  { t: 'Encontrar el gran tesoro y vivir sin que nadie te diga qué hacer.', sc: s => s.ax.libertad + s.ax.ambicion + 2 * s.tag('tesoro') },
  { t: 'Llegar a lo más alto de la Marina y cambiarla desde dentro.', sc: s => -s.ax.libertad + s.ax.corazon + 2 * s.tag('justicia') },
  { t: 'Navegar hasta donde ningún mapa llega.', sc: s => 2 * s.tag('explorar') + s.of.navegante / 2 + s.ax.coraje },
  { t: 'Saber quién era tu padre, y por qué se fue.', sc: s => 1 + 2 * s.tag('padre') + s.ax.corazon * .5 },
  { t: 'Que tu nombre se cuente en todas las tabernas del mundo.', sc: s => s.ax.orgullo + s.ax.ambicion },
  { t: 'Tener un barco propio y volver a buscar a Corso.', sc: s => 2 * s.tag('barco') + s.ax.corazon * .7 },
  { t: 'Construir el barco que cruce el Grand Line.', sc: s => s.of.carpintero / 1.5 + s.ax.ambicion },
  { t: 'Cocinar para gente de todos los mares.', sc: s => s.of.cocinero / 1.5 + s.ax.corazon * .5 },
  { t: 'Curar lo que nadie sabe curar.', sc: s => s.of.medico / 1.5 + s.ax.corazon },
  { t: 'Leer lo que el Gobierno quiere que nadie lea.', sc: s => s.of.arqueologo / 1.5 + s.ax.libertad },
];
const rnd = Math.random, pick = a => a[Math.floor(rnd() * a.length)];
const S = {}, player = { name: '', last: '' };
function reset() { Object.assign(S, { step: 0, ax: { coraje: 0, corazon: 0, orgullo: 0, libertad: 0, ambicion: 0 }, st: {}, of: {}, trs: [], tags: [], bonds: [], items: [], dream: null, ev: 1 + Math.floor(rnd() * 4), evDone: false, asked: {}, aff: {}, talks: {} });
  STATS.forEach(([k]) => S.st[k] = 8); Object.keys(OFICIOS).forEach(k => S.of[k] = 0); S.tag = t => S.tags.filter(x => x === t).length; }
function apply(fx) { if (!fx) return; for (const k in fx.ax || {}) S.ax[k] += fx.ax[k]; for (const k in fx.st || {}) S.st[k] += fx.st[k]; for (const k in fx.of || {}) S.of[k] += fx.of[k];
  (fx.tr || []).forEach(t => S.trs.includes(t) || S.trs.push(t)); (fx.tags || []).forEach(t => S.tags.push(t)); if (fx.bond) S.bonds.push(fx.bond); if (fx.item) S.items.push(fx.item); }
function motive() { if (S.tag('padre')) return 'Nunca supiste quién era tu padre. Tu madre se niega a hablar de él.';
  if (S.tag('justicia') >= 2) return 'Viste demasiadas veces que la ley y la justicia no son lo mismo.';
  if (S.tag('tesoro')) return 'Desde aquella historia para dormir no has dejado de pensar en lo que hay al final del mar.';
  if (S.bonds.includes('rival')) return 'Alguien te dijo que nunca saldrías de esta isla.';
  return 'No sabes bien de dónde viene. Pero está ahí, todas las mañanas.'; }
const fullName = () => `${player.name} ${player.last}`.trim();

// =====================================================================
// PANTALLAS
// =====================================================================
const root = document.getElementById('root'), app = document.getElementById('app');
const ANCHOR = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 2.5 L14 12 L12 21.5 L10 12 Z" fill="currentColor"/><path d="M2.5 12 L12 10 L21.5 12 L12 14 Z" fill="currentColor" opacity=".5"/></svg>';
function show(html, deep = true) { app.classList.toggle('deep', deep); root.innerHTML = html ? `<section class="screen">${html}</section>` : ''; const f = root.querySelector('[autofocus],.mi:not(:disabled),.opt,.btn'); f && f.focus({ preventScroll: true }); }
let keyHandler = null; document.addEventListener('keydown', e => keyHandler && keyHandler(e));
const keys = h => { keyHandler = e => { if (e.target.tagName === 'INPUT' && e.key !== 'Enter') return; h(e); }; };
function menu() {
  attract.on = true; requestAnimationFrame(attractFrame);
  show(`<div class="col"><h1 class="logo"><span>One</span><span>Peak</span></h1><nav class="menu" aria-label="Menú principal">
    <button class="mi" data-a="new" type="button">${ANCHOR}Nueva partida</button><button class="mi" type="button" disabled>${ANCHOR}Continuar</button>
    <button class="mi" data-a="opt" type="button">${ANCHOR}Opciones</button><button class="mi" data-a="cred" type="button">${ANCHOR}Créditos</button></nav></div><div class="ver">v0.3</div>`, false);
  const items = [...root.querySelectorAll('.mi:not(:disabled)')]; items.forEach(b => b.onclick = () => ({ new: create, opt: options, cred: credits })[b.dataset.a]());
  keys(e => { const i = items.indexOf(document.activeElement); if (e.key === 'ArrowDown') { items[(i + 1) % items.length].focus(); e.preventDefault(); } if (e.key === 'ArrowUp') { items[(i - 1 + items.length) % items.length].focus(); e.preventDefault(); } });
}
function options() { show(`<div class="col"><div class="kick">Opciones</div><div class="glass" style="padding:8px 22px"><div class="tog">Música<button class="sw" type="button" aria-pressed="true" aria-label="Música"></button></div><div class="tog">Efectos de sonido<button class="sw" type="button" aria-pressed="true" aria-label="Efectos"></button></div><div class="tog" style="border:0">Textos rápidos<button class="sw" type="button" aria-pressed="false" aria-label="Textos rápidos"></button></div></div><div class="row"><button class="btn ghost" type="button" id="back">Volver</button></div></div>`);
  root.querySelectorAll('.sw').forEach(s => s.onclick = () => s.setAttribute('aria-pressed', s.getAttribute('aria-pressed') !== 'true')); document.getElementById('back').onclick = menu; keys(e => { if (e.key === 'Escape') menu(); }); }
function credits() { show(`<div class="col"><div class="kick">Créditos</div><h2 class="t">One Peak</h2><div class="glass credits" style="padding:20px 22px">
  <p style="margin-top:0"><b>Personajes y escenarios:</b> piezas del Liberated Pixel Cup (LPC), bajo licencias ${CREDITOS.licencias.join(', ')}.</p>
  <p><b>Personajes:</b> ${CREDITOS.personajes.join(', ')}.</p><p><b>Escenarios:</b> ${CREDITOS.escenarios.join(', ')}.</p>
  <p style="margin-bottom:0"><b>Kalé, luz, interfaz y código:</b> hechos para este proyecto.</p></div><div class="row"><button class="btn ghost" type="button" id="back">Volver</button></div></div>`);
  document.getElementById('back').onclick = menu; keys(e => { if (e.key === 'Escape') menu(); }); }
let previewTimer;
function preview(canvas, sheet) { const g = canvas.getContext('2d'); g.imageSmoothingEnabled = false; const dirs = ['down', 'left', 'up', 'right'], t0 = performance.now(); clearInterval(previewTimer);
  previewTimer = setInterval(() => { const t = (performance.now() - t0) / 1000, sc = canvas.width / 72, d = dirs[Math.floor(t / 1.6) % 4], f = 1 + Math.floor(t * 9) % 8; g.clearRect(0, 0, canvas.width, canvas.height);
    g.drawImage(sheet, f * 64, ROW[d] * 64, 64, 64, Math.round(canvas.width / 2 - 32 * sc), Math.round(canvas.height * .86 - 60 * sc), 64 * sc, 64 * sc); }, 60); }
function question() {
  if (S.step >= Q.length) return dream();
  if (!S.evDone && S.step === S.ev) { S.evDone = true; const e = pick(EVENTS); apply(e.fx);
    show(`<div class="col"><div class="prog"><i style="width:${S.step / Q.length * 100}%"></i></div><p class="event">${e.t()}</p><div class="row"><button class="btn" type="button" id="go">Continuar</button></div></div>`); document.getElementById('go').onclick = question; keys(() => { }); return; }
  const q = Q[S.step];
  show(`<div class="col"><div class="prog"><i style="width:${S.step / Q.length * 100}%"></i></div><div class="kick">${q.age}</div><h2 class="t">${q.q}</h2><div class="opts${q.many ? ' many' : ''}">${q.o.map((o, i) => `<button class="opt" type="button" data-i="${i}"><kbd>${i + 1}</kbd><span>${o.t}</span></button>`).join('')}</div></div>`);
  const btns = [...root.querySelectorAll('.opt')]; btns.forEach(b => b.onclick = () => { apply(q.o[+b.dataset.i]); S.step++; question(); });
  keys(e => { const n = +e.key; if (n >= 1 && n <= btns.length) btns[n - 1].click(); const i = btns.indexOf(document.activeElement); if (e.key === 'ArrowDown') { btns[(i + 1) % btns.length].focus(); e.preventDefault(); } if (e.key === 'ArrowUp') { btns[(i - 1 + btns.length) % btns.length].focus(); e.preventDefault(); } });
}
function dream() { const list = DREAMS.map(x => ({ t: x.t, s: x.sc(S) })).sort((a, b) => b.s - a.s).slice(0, 3);
  show(`<div class="col"><div class="prog"><i style="width:100%"></i></div><div class="kick">17 años</div><h2 class="t">¿Qué sueño te llevas al mar?</h2><p class="lead">${motive()}</p><div class="opts">${list.map((x, i) => `<button class="opt" type="button" data-i="${i}"><kbd>${i + 1}</kbd><span>${x.t}</span></button>`).join('')}</div></div>`);
  const btns = [...root.querySelectorAll('.opt')]; btns.forEach(b => b.onclick = () => { S.dream = list[+b.dataset.i].t; intro(startGame); }); keys(e => { const n = +e.key; if (n >= 1 && n <= btns.length) btns[n - 1].click(); }); }

// =====================================================================
// GENTE: dónde está cada uno, cómo habla y de qué se puede hablar con él (ver docs/conversaciones.md)
// =====================================================================
const knows = title => Object.values(DIARY).some(sec => sec.some(e => e.title === title));
// tu rasgo más marcado decide cómo suenan tus preguntas
function rasgo() { let best = 'neutro', bv = 0; for (const [k, p, n] of [['coraje', 'temerario', 'cauto'], ['corazon', 'compasivo', 'frio'], ['orgullo', 'orgulloso', 'humilde'], ['libertad', 'libre', 'disciplinado'], ['ambicion', 'ambicioso', 'sereno']]) { const v = S.ax[k]; if (Math.abs(v) > bv) { bv = Math.abs(v); best = v > 0 ? p : n; } } return best; }
const voz = o => typeof o === 'string' ? o : (o[rasgo()] || o.def);
const aff = id => S.aff[id] || 0;
const asked = (id, tp) => (S.asked[id] || {})[tp] || 0;
const tod = () => { const h = hourNow(); return h < 12.5 ? 'dia' : h < 19.5 ? 'tarde' : 'noche'; };
const L = (sec, title, txt) => [[sec, title, txt]];
function makePeople() {
  const fam = player.last, nom = player.name;
  return [
    { id: 'marla', scene: 'casa', at: [2.6, 8.4], sprite: 'madre', dir: 'right', name: `Marla ${fam}`,
      barks: { dia: ['El agua ya hierve.', '¿Has visto el cuchillo grande?'], tarde: ['Este pescado no se limpia solo.', '¿Dónde se habrá metido Corso?'], noche: ['Cierra bien la puerta.', 'Qué silencio hay esta noche...'] },
      greet: c => knows('Dorne conoce a mamá') && !asked('marla', 'dorne') ? '(Marla te mira fijamente.) Te ha pasado algo. Lo veo en tu cara.' : c.n === 0 ? `Por fin te levantas, ${nom}. Ha entrado un barco con bandera negra y medio pueblo está en el muelle mirando.` : { dia: ['¿Has comido algo?', 'Dime.', '¿Ya vuelves?'], tarde: ['¿Dónde te habías metido?', 'Ayúdame con esto, anda.'], noche: ['Es tarde. ¿Dónde estabas?', 'Deberías estar durmiendo.'] }[c.tod],
      first: L('familia', `Mi madre: Marla ${fam}`, 'Me crió sola, con Corso. Trabaja limpiando pescado en el mercado.'),
      topics: [
        { id: 'puerto', once: true, ask: { def: '¿Qué pasa en el puerto?', temerario: 'He visto el barco pirata. Voy a ir a verlo de cerca.', cauto: '¿Es peligroso ese barco del puerto?' },
          a: c => c.tone === 'temerario' ? ['Ni se te ocurra acercarte.', 'La Marina dice que nadie se acerque, y por una vez tienen razón.'] : ['Un barco negro. Nadie sabe qué quieren.', 'La Marina pide que no nos acerquemos. Y tú tampoco.'], learn: L('rumores', 'El barco negro', 'Entró anoche con bandera negra. La Marina pide no acercarse.') },
        { id: 'papa', hideAfter: 3, ask: { def: 'Háblame de papá.', temerario: '¿Por qué nunca me hablas de papá?', compasivo: 'Mamá... ¿te acuerdas mucho de papá?', cauto: '¿Puedo preguntarte algo sobre papá?', orgulloso: 'Tengo derecho a saber quién era mi padre.' },
          a: c => c.n === 0 ? (c.tone === 'compasivo' ? ['(Se le escapa media sonrisa.) Todos los días. Aunque no quiera.', 'Pero hoy no, cariño.'] : c.tone === 'orgulloso' ? ['¿Derecho? (Deja el cuchillo en la mesa.)', 'Lo que tienes es un techo y un plato caliente. No me hables así.'] : [`No empieces, ${nom}.`]) : c.n === 1 ? ['Te he dicho que no quiero hablar de eso.'] : c.aff >= 1 ? ['(Se queda mirando el fuego un buen rato.)', 'Se fue un invierno, cuando Corso era un bebé. Se fue por nosotros.', 'Algún día lo entenderás.'] : ['(Se queda mirando el fuego un buen rato.)', 'Era alguien que se fue. Es todo lo que necesitas saber.'],
          aff: c => c.n === 0 ? (c.tone === 'compasivo' ? 1 : c.tone === 'orgulloso' ? -1 : 0) : 0,
          learn: c => c.n >= 2 ? (c.aff >= 1 ? L('familia', 'Mi padre', 'Se fue un invierno, cuando Corso era un bebé. Mamá dice que se fue por nosotros.') : L('familia', 'Mi padre', 'Se fue cuando yo era pequeño. Mamá no quiere hablar de él.')) : [] },
        { id: 'irse', once: true, need: () => S.ax.libertad + S.ax.ambicion > 0, ask: { def: 'Algún día me voy a ir de Kalé.', temerario: 'Me voy a ir de Kalé, mamá. Y pronto.' }, a: () => ['Ya lo sé. Lo sé desde que eras así de pequeño.', 'Pero hoy no. Hoy hay un barco pirata en el puerto.'] },
        { id: 'ayuda', hideAfter: 2, ask: '¿Necesitas ayuda con algo?', a: c => c.n === 0 ? ['Si quieres ayudar, mantén a Corso lejos del muelle. Se le van los ojos detrás de ese barco.'] : ['Ya te lo he dicho: Corso. Que no se acerque al muelle.'], aff: c => c.n === 0 ? 1 : 0 },
        { id: 'cofre', once: true, need: () => knows('El cofre de mamá'), ask: { def: '¿Qué guardas en el cofre de tu cuarto?', compasivo: 'Corso dice que abres el cofre de noche... ¿estás bien?' },
          a: c => c.tone === 'compasivo' && c.aff >= 0 ? ['(Se queda quieta.) Cosas de antes. Cosas que no se tiran.', 'No se lo digas a Corso, ¿vale? Es pequeño.'] : ['Eso no es asunto tuyo. Ni de Corso.', '(Sigue cortando el pescado, más fuerte que antes.)'], aff: c => c.tone === 'compasivo' ? 1 : -1 },
        { id: 'bandera', once: true, need: () => knows('La bandera de la medusa'), ask: 'Brin dice que esa bandera ya estuvo aquí hace veinte años.', a: () => ['(Se le cae la cuchara al suelo.)', 'Brin habla demasiado. Recoge eso, anda.'], learn: L('familia', 'Mamá y la bandera', 'Cuando le hablé de la bandera de la medusa, a mamá se le cayó la cuchara.') },
        { id: 'dorne', once: true, need: () => knows('Dorne conoce a mamá'), ask: { def: 'Hay un tal Dorne en la taberna. Dice que te conoce.', temerario: 'Dorne dice que tú sabes quién es. ¿Quién es, mamá?' },
          a: () => ['(Marla se pone pálida.)', '¿Has hablado con él? ¿Qué le has dicho? ¿Le has dicho dónde vivimos?', 'Escúchame bien. Esta noche no sale nadie de esta casa. Ni tú ni Corso.'], learn: L('familia', 'Mamá conoce a Dorne', 'Al oír el nombre de Dorne, mamá se puso pálida y nos prohibió salir esta noche.') },
      ] },
    { id: 'corso', scene: 'casa', at: [10.8, 4.9], sprite: 'nino', dir: 'left', name: `Corso ${fam}`,
      barks: { dia: ['¡Mira, un barco!', '¿Jugamos a piratas?'], tarde: ['Mamá está rara hoy.', '¡Me aburrooo!'], noche: ['No puedo dormir...', '¿Tú crees que los piratas duermen?'] },
      greet: c => c.aff >= 3 ? pick(['¡Capitán!', '¡Mi capitán!']) : { dia: ['¡Eh!', '¿Ya te has despertado del todo?'], tarde: ['¿Me llevas al muelle? ¿Porfa?', '¡Por fin vuelves!'], noche: ['¿Tú tampoco puedes dormir?', 'Shh, que mamá se despierta.'] }[c.tod],
      first: L('familia', `Mi hermano: Corso ${fam}`, 'Once años. Me sigue a todas partes y dibuja barcos en todas las paredes.'),
      topics: [
        { id: 'dibujos', hideAfter: 2, ask: '¿Qué dibujas?', a: c => c.n === 0 ? ['Barcos. Este es el mío. Va a ser más grande que el del puerto.', 'Y este de aquí eres tú. Eres el capitán. Bueno, segundo capitán.'] : ['¡Hoy he dibujado una medusa! Como la de la bandera. Con muchos brazos.'], aff: c => c.n === 0 ? 1 : 0 },
        { id: 'papa', once: true, ask: { def: '¿Te acuerdas de papá?', compasivo: '¿Echas de menos a papá?' }, a: () => ['Yo era muy pequeño... Solo me acuerdo de una voz que cantaba.', 'Pero mamá guarda algo en el cofre de su cuarto. La he visto abrirlo de noche.'], learn: L('familia', 'El cofre de mamá', 'Corso dice que mamá abre de noche un cofre que guarda en su cuarto.') },
        { id: 'navegar', once: true, ask: { def: 'Algún día me iré a navegar.', temerario: 'Algún día tendré mi propio barco.', ambicioso: 'Algún día voy a ser el pirata más famoso del mar.' }, a: () => ['¿En serio? ¿Y me llevarás?', '¡Prométemelo!'] },
        { id: 'prometo', once: true, need: () => asked('corso', 'navegar') && !asked('corso', 'pequeno'), ask: 'Te lo prometo.', a: () => ['(Corso te abraza tan fuerte que casi te tira.)', '¡Lo has prometido! ¡Ya no vale echarse atrás!'], aff: () => 2, learn: L('familia', 'Una promesa', 'Le prometí a Corso que algún día me lo llevaría a navegar.') },
        { id: 'pequeno', once: true, need: () => asked('corso', 'navegar') && !asked('corso', 'prometo'), ask: 'Todavía eres muy pequeño, Corso.', a: () => ['¡No soy pequeño! ¡Tengo once años!', '(Se va a la ventana y no te mira.)'], aff: () => -1 },
        { id: 'muelle', once: true, ask: '¿Has ido a ver el barco?', a: () => ['¡No! Mamá no me deja.', 'Pero desde la ventana se ve la bandera. Tiene una medusa con... con muchos brazos.'] },
      ] },
    { id: 'brin', scene: 'town', at: [3.2, 24.6], sprite: 'viejo', dir: 'down', name: 'Viejo Brin',
      barks: { dia: ['Hoy no pican.', 'Mar en calma, pescador en la cama.'], tarde: ['Esa bandera... no me gusta nada.', 'El mar se pone nervioso con barcos así.'], noche: ['De noche el mar habla. Hoy no dice nada bueno.'] },
      greet: c => c.n === 0 ? 'Ah, el chico de Marla. ¿Vienes a ver el barco negro, como todos?' : c.aff >= 2 ? pick(['Siéntate, chico.', 'Tú otra vez. Bien.']) : { dia: ['Buenos días, si lo son.', 'Sigue sin picar nada.'], tarde: ['Sigue sin picar nada.', '¿Qué quieres, chico?'], noche: ['¿Qué haces aquí a estas horas? El muelle de noche no es para chiquillos.'] }[c.tod],
      first: L('gente', 'Viejo Brin', 'Pescador del muelle. Vive en una choza sobre pilotes.'),
      topics: [
        { id: 'redes', hideAfter: 2, ask: '¿Te echo una mano con las redes?', a: c => c.n === 0 ? ['(Te pasa un extremo de la red sin decir nada. Trabajáis un rato en silencio.)', 'Tienes buenas manos. Como... Bueno. Tienes buenas manos.'] : ['Por hoy ya está. Gracias, chico.'], aff: c => c.n === 0 ? 2 : 0 },
        { id: 'bandera', hideAfter: 2, ask: { def: 'Esa bandera, ¿la conoces?', temerario: 'Vamos, Brin. Tú sabes algo de esa bandera.' },
          a: c => c.n === 0 ? ['Una medusa. La vi una vez, hace veinte años. Aquel invierno el mar se tragó tres barcas.', 'Y algo más se fue de Kalé aquel invierno. Pero eso no me toca contarlo a mí.'] : c.aff >= 2 ? ['(Brin suspira.)', 'Tu padre se fue la misma noche que se fue ese barco. Ya está. Ya lo he dicho.'] : ['Ya te he dicho lo que tenía que decir. El resto, pregúntaselo a tu madre.'],
          learn: c => c.n === 0 ? L('rumores', 'La bandera de la medusa', 'Brin la vio hace veinte años, el invierno en que el mar se tragó tres barcas.') : c.aff >= 2 ? L('familia', 'Papá y la medusa', 'Según Brin, papá se fue la misma noche que el barco de la medusa, hace veinte años.') : [] },
        { id: 'padre', hideAfter: 2, need: () => knows('Mi padre') || S.tag('padre'), ask: '¿Conociste a mi padre?', a: c => c.aff >= 2 ? ['Lo conocí. Pescaba conmigo en este mismo muelle.', 'Era el único que leía el cielo mejor que yo.'] : ['(Brin tira de la caña sin mirarte.)', 'Pregúntale a tu madre. Si no te lo cuenta, tendrá sus motivos.'], learn: c => c.aff >= 2 ? L('familia', 'Papá pescaba con Brin', 'Brin dice que papá pescaba con él en el muelle y que leía el cielo mejor que nadie.') : [] },
        { id: 'mapas', once: true, need: () => knows('Kalé no está en los mapas'), ask: 'Una cartógrafa dice que Kalé no sale en los mapas de la Marina.', a: () => ['Claro que no sale. Alguien se encargó de que no saliera.', 'Y ese alguien lo pagó caro.'], learn: L('rumores', 'Alguien borró Kalé', 'Brin dice que alguien se encargó de que Kalé no saliera en los mapas. Y que lo pagó caro.') },
      ] },
    { id: 'lin', scene: 'town', at: [31.6, 23.8], sprite: 'navegante', dir: 'up', name: 'Lin',
      barks: { dia: ['Buena luz para dibujar.', 'Curioso...'], tarde: ['¿Quién pondría un ancla así en medio de una plaza?'], noche: ['Con estas estrellas se podría fijar la posición exacta de Kalé.'] },
      greet: c => c.n === 0 ? '¿Sabes quién dejó esta ancla aquí? No consta en ningún registro.' : pick(['Ah, mi guía local.', '¿Traes algo interesante?', 'Hola otra vez.']),
      first: L('gente', 'Lin', 'Cartógrafa de paso. Le interesa el ancla de la plaza.'),
      topics: [
        { id: 'busca', once: true, ask: '¿Qué buscas en Kalé?', a: () => ['En las cartas de la Marina, Kalé ni siquiera tiene nombre. Una isla con puerto, faro y taberna... y sin nombre.', 'Las islas sin nombre suelen esconder algo.'], learn: L('rumores', 'Kalé no está en los mapas', 'Según Lin, en las cartas de la Marina la isla no tiene nombre.') },
        { id: 'llegar', once: true, ask: '¿Cómo llegaste?', a: () => ['En el barco que trae la sal cada mes. Me iré en el próximo... o en el que salga antes.'] },
        { id: 'borrar', once: true, need: () => knows('Alguien borró Kalé'), ask: '¿Por qué alguien borraría una isla de los mapas?', a: () => ['Para esconder algo. O a alguien.', '(Lo anota en su cuaderno.) Interesante. Muy interesante.'] },
        { id: 'cadena', once: true, need: () => knows('Mucha cadena'), ask: 'Los del barco negro compraron cadena. Mucha.', a: () => ['¿Cadena? (Mira el ancla de la plaza.)', 'Esa ancla pesa más que un barco. Hace falta mucha cadena para moverla.'], learn: L('rumores', 'Quieren levantar el ancla', 'Lin cree que los del barco negro quieren levantar el ancla de la plaza.') },
      ] },
    { id: 'rosa', scene: 'town', at: [26.8, 24.4], sprite: 'pescadora', dir: 'right', name: 'Rosa', chat: true,
      barks: { dia: ['¡Fresco, recién salido del agua!', 'Hoy el pescado está caro.'], tarde: ['A mitad de precio, que se pone malo.'], noche: ['Ya está bien por hoy.'] },
      greet: () => pick(['¿Vas a comprar o a mirar?', '¡Hombre, el de Marla!']), topics: [{ id: 'tomas', once: true, ask: '¿Tu marido no sale a faenar?', a: () => ['Mi Tomás dice que con ese barco ahí fuera no se le ha perdido nada en el mar.', 'Veinte años lleva diciendo que se jubila. Hoy por fin tiene excusa.'] }] },
    { id: 'pura', scene: 'town', at: [28.1, 24.4], sprite: 'vecina', dir: 'left', name: 'Doña Pura', chat: true,
      barks: { dia: ['En mis tiempos esto no pasaba.', '¿Y tu madre, cómo está?'], tarde: ['Qué calor, Señor.'], noche: ['A estas horas, a casa.'] },
      greet: c => c.n === 0 ? '¡Ay, el hijo de Marla! Cada día te pareces más a... (se calla) ...a tu madre, claro.' : pick(['¿Y tu madre?', 'Dale recuerdos a Marla.']),
      topics: [{ id: 'parecido', once: true, need: () => (S.talks.pura || 0) >= 1, ask: 'Ibas a decir que me parezco a alguien.', a: () => ['¿Yo? No, no. A tu madre. Igualito.', '(Mira a Rosa. Rosa mira al suelo.)'], learn: L('familia', 'Me parezco a alguien', 'Doña Pura casi dijo a quién me parezco. Se calló a tiempo.') }] },
    { id: 'mar1', scene: 'town', route: [[42.5, 15.2], [42.5, 22.6], [35, 22.6], [31.5, 26.8], [35, 22.6], [42.5, 22.6]], speed: 32, sprite: 'marine', name: 'Marine',
      barks: { dia: ['Circula, chaval.', 'Orden del capitán: nadie se acerca al barco negro.'], tarde: ['Hace demasiado calor para este uniforme.'], noche: ['¿Qué haces en la calle? A casa.'] },
      greet: c => c.n === 0 ? 'No tengo tiempo para charlas. Hay un barco pirata fondeado frente al puerto.' : pick(['¿Otra vez tú?', 'Circula.']),
      topics: [{ id: 'buscan', once: true, ask: '¿Qué buscan los piratas?', a: () => ['Si lo supiera no estaría patrullando. Si ves a alguien con un garfio, avisa al destacamento.'], learn: L('rumores', 'La Marina vigila', 'Buscan a alguien con un garfio.') },
        { id: 'detener', once: true, need: () => knows('Dorne tiene recompensa'), ask: { def: 'Si Dorne tiene recompensa, ¿por qué no lo detenéis?', temerario: '¿Y a qué esperáis para detener a Dorne?' }, a: () => ['¿Con seis hombres y un cañón oxidado? Esperamos refuerzos de Loguetown.', 'Y hasta entonces, nadie hace nada raro. ¿Entendido?'], learn: L('rumores', 'La Marina espera refuerzos', 'El destacamento de Kalé solo tiene seis hombres y espera refuerzos de Loguetown.') }] },
    { id: 'mara', scene: 'taberna', at: [8, 2.3], sprite: 'tabernera', dir: 'down', name: 'Mara',
      barks: { dia: ['Aún no ha llegado el vino.', 'Hoy no fío.'], tarde: ['¡Arriba esas jarras!'], noche: ['Esta noche hay más piratas que clientes.'] },
      greet: c => c.n === 0 ? '¿Lo de siempre? Hoy no fío, que la Marina anda rara.' : pick(['¿Qué te pongo?', '¿Otra?', 'Dime, que tengo prisa.']),
      first: L('gente', 'Mara', 'Tabernera de El Ancla Seca. Se entera de todo.'),
      topics: [
        { id: 'cuenta', once: true, ask: '¿Qué se cuenta hoy?', a: () => ['Que el del rincón lleva toda la mañana preguntando por alguien de Kalé.', 'No ha dicho por quién. Pero ha dicho tu apellido dos veces.'], learn: L('rumores', 'El del garfio pregunta', `Según Mara, el del rincón ha preguntado por los ${fam}.`) },
        { id: 'quien', once: true, ask: '¿Quién es el del rincón?', a: () => ['"Garra" Dorne. El capitán del barco negro. Paga bien y mira mal.'] },
        { id: 'cocina', once: true, need: () => S.of.cocinero >= 3, ask: 'Si necesitas ayuda en la cocina...', a: () => ['Siempre fuiste el mejor pinche que tuve.', 'Hoy no, que hay mucho pirata suelto. Mañana, si el pueblo sigue en pie.'], aff: () => 1 },
      ] },
    { id: 'dorne', scene: 'taberna', at: [14.2, 11.2], sprite: 'capitan', dir: 'left', name: '"Garra" Dorne',
      barks: { dia: ['Krakaka...', 'Esta isla huele a pescado y a miedo.'], tarde: ['Krakaka...'], noche: ['La noche es de los piratas, mocosos.'] },
      greet: c => c.n === 0 ? `Krakaka... ¿Y tú qué miras, mocoso? Espera. Esa cara... ¿Eres un ${fam}?` : pick(['Krakaka... ¿Otra vez tú?', `El mocoso de los ${fam}. Siéntate, si te atreves.`]),
      first: L('gente', '"Garra" Dorne', 'Capitán de la bandera de la medusa. Me reconoció por la cara.'),
      topics: [
        { id: 'busca', once: true, ask: '¿Qué buscas en Kalé?', a: () => ['Algo que es mío. Lo dejé aquí hace veinte años y alguien lo ha guardado muy bien.'] },
        { id: 'familia', once: true, ask: { def: '¿Conoces a mi familia?', temerario: 'Deja en paz a mi familia.', cauto: '¿De qué conoces a los ' + fam + '?' },
          a: c => c.tone === 'temerario' ? ['Krakaka. Tiene dientes, el mocoso. Igual que su padre.', 'Dile a tu madre que Dorne ha vuelto. Ella sabrá.'] : ['Conocí a alguien con tu cara.', 'Dile a tu madre que Dorne ha vuelto. Ella sabrá.'],
          learn: c => [...L('familia', 'Dorne conoce a mamá', 'Dorne me reconoció por la cara y dijo que mamá sabría quién es.'), ...(c.tone === 'temerario' ? L('familia', 'Dorne conoció a papá', 'Dorne dijo que tengo los mismos dientes que mi padre.') : [])] },
        { id: 'porque', once: true, need: () => knows('El del garfio pregunta'), ask: '¿Por qué preguntas por mi familia?', a: () => ['Porque tu familia tiene algo mío.', 'Y si no me lo devuelven por las buenas... Krakaka. Kalé es una isla muy pequeña.'] },
      ] },
    { id: 'gaspar', scene: 'tienda', at: [4, 4.45], sprite: 'maton', dir: 'down', name: 'Gaspar',
      barks: { dia: ['¡No toques eso!', 'Brea, cuerda, anzuelos...'], tarde: ['Se acerca la hora de cerrar.'], noche: ['Cerrado.'] },
      greet: c => c.n === 0 ? 'Aparejos Gaspar. Si no compras, no toques.' : pick(['¿Qué quieres?', 'Tú otra vez.']),
      first: L('gente', 'Gaspar', 'Dueño de la tienda de aparejos. Gruñón, pero sabe todo lo que se compra y se vende en Kalé.'),
      topics: [
        { id: 'vende', once: true, ask: '¿Qué vendes?', a: () => ['Cuerda, redes, anzuelos, brea, velas. Lo que haga falta para no hundirse.'] },
        { id: 'piratas', once: true, ask: '¿Los del barco negro te han comprado algo?', a: () => ['Buenos clientes, los piratas. Pagan sin regatear.', 'Esta mañana se llevaron cien brazas de cadena gruesa. ¿Para qué quiere tanta cadena un barco fondeado?'], learn: L('rumores', 'Mucha cadena', 'Gaspar les vendió a los del barco negro cien brazas de cadena gruesa.') },
        { id: 'ancla', once: true, need: () => knows('Quieren levantar el ancla'), ask: '¿Y si quieren levantar el ancla de la plaza?', a: () => ['(Gaspar deja de contar monedas.)', 'Esa ancla no se mueve. Mi abuelo decía que si alguien la levanta, Kalé se hunde.', 'Tonterías de viejos. ...Supongo.'], learn: L('kale', 'La leyenda del ancla', 'Según el abuelo de Gaspar, si alguien levanta el ancla de la plaza, Kalé se hunde.') },
      ] },
    { id: 'medico', scene: 'medico', at: [6.2, 5.6], sprite: 'padre', dir: 'down', name: 'Doctor Ansel',
      barks: { dia: ['Siguiente.', 'Lávate las manos antes de tocar nada.'], tarde: ['Qué día más largo.'], noche: ['Las urgencias, por la puerta de atrás.'] },
      greet: c => c.n === 0 ? (S.of.medico >= 3 ? `¡${nom}! Mi mejor ayudante. ¿Vienes a echarme una mano?` : 'Buenos días. ¿Te duele algo?') : pick(['¿Otra vez por aquí?', 'Siéntate, siéntate.']),
      first: L('gente', 'Doctor Ansel', 'El médico de Kalé. Tranquilo y observador.'),
      topics: [
        { id: 'herido', once: true, ask: '¿Ha venido alguien del barco negro?', a: () => ['Anoche me trajeron a uno de esos piratas con un corte en el brazo.', 'Tenía la medusa tatuada. Y una cicatriz muy vieja, de las que hace un garfio.'], learn: L('rumores', 'El pirata herido', 'El médico curó anoche a un pirata con la medusa tatuada y una cicatriz de garfio.') },
        { id: 'ayudar', once: true, need: () => S.of.medico >= 3, ask: '¿Necesitas ayuda?', a: () => ['Siempre. Pásame esas vendas. (Trabajáis un rato.)', 'Tienes buen pulso. Ojalá te quedaras en Kalé.'], aff: () => 2 },
        { id: 'padre', once: true, need: () => knows('Papá y la medusa'), ask: '¿Conociste a mi padre?', a: () => ['(El doctor deja la pluma.)', 'Le curé una mano la noche antes de que se fuera. Una herida de garfio.', 'No me preguntes más. Le prometí a tu madre que no hablaría.'], learn: L('familia', 'La herida de papá', 'El doctor le curó a papá una herida de garfio la noche antes de que se fuera.') },
      ] },
    { id: 'nell', scene: 'panaderia', at: [3.2, 2.2], sprite: 'hermana', dir: 'down', name: 'Nell',
      barks: { dia: ['¡Pan recién hecho!', '¡Cuidado, que quema!'], tarde: ['Hoy lo he vendido todo.'], noche: [''] },
      greet: c => c.n === 0 ? '¡Hola! ¿Pan del día? Es lo último que queda.' : pick(['¡Hola otra vez!', '¿Vienes a por más?']),
      first: L('gente', 'Nell', 'La hija del panadero. Lo sabe todo, y lo cuenta todo.'),
      topics: [
        { id: 'trabajo', once: true, ask: '¿Mucho trabajo hoy?', a: () => ['¡Los del barco negro! Vinieron a por pan para treinta.', 'Pagaron con monedas viejas, de las de antes. Mi padre dice que esas monedas no se ven desde hace veinte años.'], learn: L('rumores', 'Monedas viejas', 'Los piratas pagaron el pan con monedas que no circulan desde hace veinte años.') },
        { id: 'veinte', once: true, need: () => knows('Monedas viejas') && knows('La bandera de la medusa'), ask: 'Veinte años... como la bandera.', a: () => ['¡Uy! ¿Tú crees?', '(Se ríe, pero se queda mirando hacia el puerto.)'] },
      ] },
  ];
}
const OBJECTS = () => [
  { scene: 'town', at: [30, 21.9], label: 'Leer', text: '«Aquí echó el ancla el primer barco que llegó a Kalé. Que nadie la levante.» Debajo, alguien ha rayado: «Ya veremos».', learn: ['kale', 'El Ancla de Kalé', 'La placa dice que nadie debe levantarla. Alguien rayó debajo: «Ya veremos».'] },
  { scene: 'town', at: [35.5, 19.3], label: 'Leer', text: 'SE BUSCA: «Garra» Dorne. 8.000.000 de berries. Debajo, un papel nuevo de la Marina: «Prohibido acercarse al barco fondeado».', learn: ['rumores', 'Dorne tiene recompensa', 'El tablón de la Marina ofrece 8.000.000 de berries por «Garra» Dorne.'] },
  { scene: 'casa', at: [1.05, 5.6], label: 'Mirar', text: 'El cofre de mamá. Cerrado con llave. Nunca lo has visto abierto.', learn: ['familia', 'El cofre de mamá', 'En el cuarto de mamá hay un cofre cerrado con llave.'] },
  { scene: 'casa', at: [4.8, 1.4], label: 'Mirar', text: 'Un retrato boca abajo sobre la cómoda. Al levantarlo, está vacío: alguien sacó la imagen y dejó solo el marco.', learn: ['familia', 'El retrato vacío', 'Sobre la cómoda de mamá hay un marco boca abajo, sin la imagen.'] },
  { scene: 'brin', at: [3.7, 0.9], label: 'Mirar', text: 'Un mapa viejo y descolorido. Alguien marcó una cruz lejos de cualquier isla conocida.', learn: ['rumores', 'La cruz del mapa de Brin', 'En casa de Brin hay un mapa con una cruz lejos de cualquier isla conocida.'] },
];
const CHAT = [['pura', '¿Has visto el barco que entró anoche?'], ['rosa', 'Bandera negra. Mi Tomás no quiere salir a faenar.'], ['pura', 'Dicen que buscan a alguien.'], ['rosa', 'En Kalé no hay nada que buscar... salvo lo de siempre.'], ['pura', 'Calla, que te oyen.']];
// lo que encuentras en la puerta de un sitio cerrado
const CLOSED = { faro: 'La puerta del faro está cerrada con llave.', marina: 'Un marine de guardia te corta el paso: «Solo personal de la Marina».', pura: 'Es la casa de Doña Pura. No está.', rosa: 'Es la casa de Rosa. No hay nadie.' };
const LOCKED = new Set(['faro', 'marina']);
const horas = r => r.map(([a, b]) => `de ${a} a ${b}`).join(' y ');
const openNow = b => !b.ext.horario || b.ext.horario.some(([a, z]) => hourNow() >= a && hourNow() < z);

// =====================================================================
// DIARIO
// =====================================================================
const DIARY = { yo: [], familia: [], gente: [], rumores: [], kale: [] };
function learn(e) { if (!e) return; const [sec, title, txt] = e; if (DIARY[sec].some(x => x.title === title)) return; DIARY[sec].push({ title, txt }); document.getElementById('openDiary').classList.add('new'); }
function openDiary(tab = 'yo') { G.paused = true; document.getElementById('openDiary').classList.remove('new'); const ov = document.getElementById('overlays'); const old = ov.querySelector('.diary'); old && old.remove();
  const d = document.createElement('div'); d.className = 'diary'; const TABS = [['yo', 'Yo'], ['familia', 'Familia'], ['gente', 'Gente'], ['rumores', 'Rumores'], ['kale', 'Kalé']];
  const page = k => { if (k === 'yo') { const top = Object.entries(S.of).sort((a, b) => b[1] - a[1])[0], of = top[1] > 0 ? OFICIOS[top[0]] : 'Sin oficio fijo';
      return `<div class="entry"><b>${fullName()}</b><span>17 años. Nací en Kalé, en el East Blue. ${of}.</span></div><div class="entry"><b>Mi sueño</b><span>${S.dream}<br><i>${motive()}</i></span></div>
      <div class="axes">${Object.entries(AX).map(([k, [a, b]]) => { const v = Math.max(-4, Math.min(4, S.ax[k])); return `<div class="ax"><span class="${v < 0 ? 'on' : ''}">${a}</span><span class="tr"><i style="left:${50 + v * 12}%"></i></span><span class="${v > 0 ? 'on' : ''}">${b}</span></div>`; }).join('')}</div>
      <div class="stats">${STATS.map(([k, n]) => `<div>${n}<b>${S.st[k]}</b></div>`).join('')}</div>${S.trs.length || S.items.length ? `<div class="entry"><span>${[...S.trs, ...S.items].join(' · ')}</span></div>` : ''}`; }
    return DIARY[k].length ? DIARY[k].map(e => `<div class="entry"><b>${e.title}</b><span>${e.txt}</span></div>`).join('') : '<p class="empty">Todavía no has escrito nada aquí.</p>'; };
  d.innerHTML = `<div class="glass book" role="dialog" aria-label="Diario"><div class="tabs">${TABS.map(([k, n]) => `<button type="button" data-k="${k}" class="${k === tab ? 'on' : ''}">${n}</button>`).join('')}<button type="button" class="x" aria-label="Cerrar diario">Cerrar ✕</button></div><div class="page">${page(tab)}</div></div>`;
  ov.appendChild(d); d.querySelectorAll('[data-k]').forEach(b => b.onclick = () => openDiary(b.dataset.k)); d.querySelector('.x').onclick = closeDiary; d.onclick = e => { if (e.target === d) closeDiary(); }; d.querySelector('.on').focus(); }
function closeDiary() { const d = document.querySelector('.diary'); d && d.remove(); G.paused = false; }

// =====================================================================
// EL JUEGO
// =====================================================================
const cv = document.getElementById('game'), g = cv.getContext('2d');
const G = { scene: 'town', x: 0, y: 0, dir: 'down', walk: 0, moving: false, paused: true, keys: {}, VW: 640, VH: 360, scale: 2, minutes: 8 * 60, talking: null, lastT: 0, bubbles: [], chat: null, zoom: 1, run: false };
let PEOPLE = [];
const hourNow = () => (G.minutes % 1440) / 60;
function fitGame() { const w = innerWidth, h = innerHeight; G.VW = Math.round(Math.min(640, Math.max(300, w / 1.6)) / G.zoom); G.VH = Math.round(G.VW * h / w); G.scale = w / G.VW; cv.width = G.VW; cv.height = G.VH; cv.style.width = w + 'px'; cv.style.height = G.VH * G.scale + 'px'; cv.style.left = '0'; cv.style.top = ((h - G.VH * G.scale) / 2) + 'px'; g.imageSmoothingEnabled = false; }
addEventListener('resize', () => { fitBg(); if (!cv.hidden) fitGame(); });
// edificios por dentro: cada uno se arma una vez, con una escena por cuarto
const BLD = {}, SC = {};
const bld = id => { if (!BLD[id]) { BLD[id] = buildInteriors(PLANO.edificios.find(b => b.id === id)); BLD[id].scenes.forEach(s => SC[s.id] = s); } return BLD[id]; };
const interior = sid => SC[sid] || (bld(sid.split(':')[0]), SC[sid]);
// "casa" + un punto de la planta → la escena donde cae y su posición en píxeles
function place(scene, at) { if (scene === 'town') return ['town', [at[0] * T, at[1] * T]]; const s = bld(scene).sceneOfPt(at[0], at[1]); return [s.id, [s.X(at[0]), s.Y(at[1])]]; }
const hit = (list, x, y) => list.some(([a, b, w, h]) => x >= a && x < a + w && y >= b && y < b + h);
function walkableTown(x, y) {
  if (x < 8 || y < 8 || x > WORLD.w - 8 || y > WORLD.h - 8) return false;
  const onDock = PLANO.mapa.muelle.some(([a, b, w, h]) => x >= a * T && x < (a + w) * T && y >= b * T && y < (b + h) * T);
  const onBridge = PLANO.mapa.caminos.filter(c => c.madera).some(c => c.p.some((p, i) => i && segDist(c.p[i - 1], p, x / T, y / T) < .7));
  if (!onDock && !onBridge && !inPoly([x, y], WORLD.land)) return false;
  if (!onDock && hit(WORLD.blocks, x, y)) return false;
  return true;
}
function segDist(a, b, x, y) { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); }
function blocked(x, y) {
  const crowd = PEOPLE.some(n => n.scene === G.scene && Math.abs(n.x - x) < 10 && Math.abs(n.y - y) < 6);
  if (G.scene === 'town') return !walkableTown(x, y) || crowd;
  const I = interior(G.scene); return x < WALL + 2 || x > I.w - WALL - 2 || y > I.h - WALL || hit(I.blocks, x, y) || crowd;
}
function fade(cb) { const f = document.getElementById('fadeov'); f.style.opacity = 1; setTimeout(() => { cb(); f.style.opacity = 0; }, 330); }
function enter(scene, [x, y], dir) { G.scene = scene; G.x = x; G.y = y; G.dir = dir; clearBubbles(); const pn = document.getElementById('placeName'); pn.textContent = scene === 'town' ? 'Kalé' : interior(scene).name; pn.style.opacity = 1; clearTimeout(pn._t); pn._t = setTimeout(() => pn.style.opacity = 0, 2600); }
let OBJS = [];
function startGame() {
  attract.on = false; keyHandler = null; show(''); app.classList.add('playing'); cv.hidden = false; document.getElementById('hud').hidden = false; fitGame();
  PEOPLE = makePeople().map(n => { const [scene, [x, y]] = n.route ? ['town', [0, 0]] : place(n.scene, n.at); return { ...n, scene, x, y, frame: 0, nextBark: performance.now() + 3000 + rnd() * 6000 }; });
  OBJS = OBJECTS().map(o => { const [scene, [x, y]] = place(o.scene, o.at); return { ...o, scene, x, y }; });
  if (matchMedia('(pointer:coarse)').matches) document.getElementById('pad').hidden = false;
  const [sc, at] = place('casa', [8.6, 4.2]); enter(sc, at, 'down'); G.paused = false; G.minutes = 8 * 60;
  actoInit();
  const corso = PEOPLE.find(n => n.id === 'corso');
  setTimeout(() => say(corso, { lines: ['¡Por fin te despiertas! Mamá te está esperando en la cocina.', 'Y hay un barco negro en el puerto. ¡Un barco pirata de verdad!'] }), 600);
  requestAnimationFrame(loop);
}
// ---------- conversaciones ----------
function face(canvas, sprite) { const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false; c.clearRect(0, 0, 64, 64); c.drawImage(SHEETS[sprite], 0, ROW.down * 64, 64, 40, 0, 4, 64, 40); }
function say(npc, conv) { G.talking = { npc, conv, i: 0 }; if (npc.x != null) { const dx = G.x - npc.x, dy = G.y - npc.y; npc.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); } renderTalk(); }
const ctxOf = (npc, n) => ({ n, aff: aff(npc.id), tone: rasgo(), tod: tod(), h: hourNow() });
const oneOf = (v, last) => { if (!Array.isArray(v)) return v; const opts = v.filter(x => x !== last); return pick(opts.length ? opts : v); };
function talkTo(npc) {
  const n = S.talks[npc.id] || 0, line = oneOf(npc.greet(ctxOf(npc, n)), npc._lastGreet); npc._lastGreet = line;
  if (n === 0) (npc.first || []).forEach(learn); S.talks[npc.id] = n + 1; S.asked[npc.id] = S.asked[npc.id] || {};
  say(npc, { lines: [line], topics: true });
}
function topicsOf(npc) { return (npc.topics || []).filter(t => (!t.need || t.need()) && !(t.once && asked(npc.id, t.id)) && !(t.hideAfter && asked(npc.id, t.id) >= t.hideAfter)); }
function renderTalk() {
  const ov = document.getElementById('overlays'); let box = ov.querySelector('.dlg'); const t = G.talking; document.getElementById('hud').classList.toggle('talking', !!t);
  if (!t) { box && box.remove(); return; }
  if (!box) { box = document.createElement('div'); box.className = 'dlg glass'; box.setAttribute('role', 'dialog'); ov.appendChild(box); }
  const last = t.i >= t.conv.lines.length - 1, tops = last && t.conv.topics ? topicsOf(t.npc) : [], ch = last && (t.conv.topics || t.conv.opts);
  const opts = !ch ? [] : t.conv.opts ? t.conv.opts.map(o => o.t) : [...tops.map(x => voz(x.ask)), tops.length ? 'Nada, me voy.' : 'Adiós.'];
  box.innerHTML = `<div class="face"><canvas width="64" height="48" aria-hidden="true"></canvas></div><div><b class="nm">${t.npc.name || ''}</b><p>${t.conv.lines[t.i]}</p>${ch ? `<div class="ch">${opts.map((c, i) => `<button type="button" data-i="${i}">${c}</button>`).join('')}</div>` : ''}</div>${ch ? '' : '<span class="more">E / clic para seguir</span>'}`;
  face(box.querySelector('canvas'), t.npc.sprite || 'grumete');
  box.onclick = e => { const b = e.target.closest('button'); if (b) choose(+b.dataset.i); else if (!ch) advance(); };
  if (ch) box.querySelector('button').focus();
}
function choose(i) {
  const t = G.talking; if (!t) return;
  if (t.conv.opts) { const o = t.conv.opts[i]; G.talking = null; renderTalk(); o.then && o.then(); return; }
  if (actoChoose(t, i)) return;
  const tops = topicsOf(t.npc); if (i >= tops.length) { G.talking = null; renderTalk(); return; }
  const tp = tops[i], id = t.npc.id, n = asked(id, tp.id), c = ctxOf(t.npc, n);
  const lines = tp.a(c), l = typeof tp.learn === 'function' ? tp.learn(c) : tp.learn, d = typeof tp.aff === 'function' ? tp.aff(c) : (tp.aff || 0);
  S.asked[id][tp.id] = n + 1; S.aff[id] = aff(id) + d; (l || []).forEach(learn);
  G.talking = { npc: t.npc, conv: { lines, topics: true }, i: 0 }; renderTalk();
}
function advance() { const t = G.talking; if (!t) return; if (t.i < t.conv.lines.length - 1) { t.i++; renderTalk(); } else if (!t.conv.topics && !t.conv.opts) { (t.conv.learn || []).forEach(learn); G.talking = null; renderTalk(); t.conv.done && t.conv.done(); } }
function clearBubbles() { G.bubbles.forEach(b => b.el.remove()); G.bubbles = []; G.chat = null; }
function bubble(npc, text, ms = 3200) { if (!text) return; const el = document.createElement('div'); el.className = 'bubble'; el.textContent = text; document.getElementById('overlays').appendChild(el); G.bubbles.push({ npc, el, until: performance.now() + ms }); }
const barkOf = n => { const b = Array.isArray(n.barks) ? n.barks : n.barks[tod()]; const line = oneOf(b, n._lastBark); n._lastBark = line; return line; };
// ---------- interacción ----------
function nearest() {
  let best = null, bd = 44;
  for (const n of PEOPLE) if (n.scene === G.scene && n.greet) { const d = Math.hypot(n.x - G.x, n.y - G.y); if (d < bd) { bd = d; best = { type: 'npc', n }; } }
  for (const o of OBJS) if (o.scene === G.scene) { const d = Math.hypot(o.x - G.x, o.y - G.y); if (d < bd) { bd = d; best = { type: 'obj', o, x: o.x, y: o.y }; } }
  if (G.scene === 'town') { for (const s of WORLD.doors) { const [dx, dy] = s.door; if (Math.abs(G.x - dx) < 18 && G.y > dy - 6 && G.y < dy + 26) return { type: 'door', s }; } }
  else for (const d of interior(G.scene).doors) if (hit([d.r], G.x, G.y)) return { type: 'idoor', d };
  return best;
}
const note = text => say({ name: '', sprite: 'grumete' }, { lines: [text] });
function interact() {
  if (G.talking) { if (!document.querySelector('.dlg .ch')) advance(); return; }
  const t = nearest(); if (!t) return;
  if (t.type === 'npc') talkTo(t.n);
  else if (t.type === 'obj' && t.o.act) t.o.act();
  else if (t.type === 'obj') say({ name: '', sprite: 'grumete' }, { lines: [t.o.text], learn: t.o.learn ? [t.o.learn] : [] });
  else if (t.type === 'door') { const b = t.s.b;
    if (!b.entrable || !b.int || LOCKED.has(b.id)) return note(CLOSED[b.id] || 'Está cerrado.');
    if (!openNow(b)) return note(`${b.n}. En la puerta, un cartel: «Abierto ${horas(b.ext.horario)}».`);
    fade(() => { const e = bld(b.id).entrance, d = e.doors.find(d => d.to === 'town'), [at, dir] = e.doorArrival(...d.args); enter(e.id, at, dir); }); }
  else if (t.d.to === 'town') fade(() => { const s = WORLD.doors.find(d => d.id === interior(G.scene).bid); enter('town', [s.door[0], s.door[1] + 18], 'down'); });
  else fade(() => enter(t.d.to, t.d.at[0], t.d.at[1]));
}
document.addEventListener('keydown', e => { if (cv.hidden) return; const k = e.key.toLowerCase();
  if (document.querySelector('.diary')) { if (k === 'escape' || k === 'j') closeDiary(); return; }
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', 'shift'].includes(k)) { G.keys[k] = true; e.preventDefault(); }
  if (k === 'e' || k === ' ' || k === 'enter') { if (!e.target.closest || !e.target.closest('button')) interact(); e.preventDefault(); }
  if (k === '+' || k === '=') zoom(1.15); if (k === '-' || k === '_') zoom(1 / 1.15);
  if (k === 'j' && !G.talking) openDiary(); });
document.addEventListener('keyup', e => { G.keys[e.key.toLowerCase()] = false; });
addEventListener('blur', () => { G.keys = {}; });
document.getElementById('openDiary').onclick = () => openDiary();
document.getElementById('actBtn').addEventListener('pointerdown', e => { e.preventDefault(); interact(); });
document.getElementById('runBtn').addEventListener('click', e => { G.run = !G.run; e.currentTarget.setAttribute('aria-pressed', G.run); });
document.querySelectorAll('#pad .pad button').forEach(b => { const d = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' }[b.dataset.d];
  b.addEventListener('pointerdown', e => { e.preventDefault(); G.keys[d] = true; }); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => G.keys[d] = false)); });
cv.addEventListener('click', () => { if (G.talking && !document.querySelector('.dlg .ch')) advance(); });
// zoom: rueda, + y -, o dos dedos
function zoom(f) { G.zoom = Math.max(.7, Math.min(2.4, G.zoom * f)); fitGame(); }
addEventListener('wheel', e => { if (cv.hidden || document.querySelector('.diary')) return; e.preventDefault(); zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1); }, { passive: false });
let pinch = null;
cv.addEventListener('touchstart', e => { if (e.touches.length === 2) pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
cv.addEventListener('touchmove', e => { if (e.touches.length === 2 && pinch) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); zoom(d / pinch); pinch = d; } }, { passive: true });
cv.addEventListener('touchend', () => { pinch = null; });
function where(pts, v, t) { let L = 0; const seg = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, l]); L += l; }
  let d = (t * v) % L; for (const [a, b, l] of seg) { if (d <= l) { const f = d / l, dx = b[0] - a[0], dy = b[1] - a[1]; return [a[0] + dx * f, a[1] + dy * f, Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')]; } d -= l; } return [pts[0][0], pts[0][1], 'down']; }
// ---------- bucle ----------
function loop(now) {
  const dt = Math.min(50, now - (G.lastT || now)) / 1000; G.lastT = now;
  if (!G.paused && !G.talking) {
    let vx = 0, vy = 0; const K = G.keys; if (K.arrowleft || K.a) vx = -1; else if (K.arrowright || K.d) vx = 1; if (K.arrowup || K.w) vy = -1; else if (K.arrowdown || K.s) vy = 1;
    G.moving = !!(vx || vy);
    if (G.moving) { const running = K.shift || G.run, sp = (running ? 175 : 112) * dt * (vx && vy ? .7071 : 1), nx = G.x + vx * sp, ny = G.y + vy * sp;
      if (!blocked(nx - 6, G.y) && !blocked(nx + 6, G.y)) G.x = nx; if (!blocked(G.x - 6, ny) && !blocked(G.x + 6, ny)) G.y = ny;
      G.dir = vx < 0 ? 'left' : vx > 0 ? 'right' : vy < 0 ? 'up' : 'down'; G.walk += dt * (running ? 17 : 12); }
    G.minutes += dt * .8; actoTick(now, dt);
    for (const n of PEOPLE) { if (n.route) { n.t = (n.t || rnd() * 100) + dt; const [x, y, d] = where(n.route.map(([a, b]) => [a * T, b * T]), n.speed, n.t); n.x = x; n.y = y; n.dir = d; n.frame = 1 + Math.floor(n.t * 9) % 8; }
      if (n.scene === G.scene && now > n.nextBark && !n.chat && Math.hypot(n.x - G.x, n.y - G.y) < 240) { bubble(n, barkOf(n)); n.nextBark = now + 8000 + rnd() * 8000; } }
    const pura = PEOPLE.find(n => n.id === 'pura');
    if (G.scene === 'town' && pura && !G.chat && !F.campana && Math.hypot(pura.x - G.x, pura.y - G.y) < 130 && !knows('Buscan a alguien')) G.chat = { i: 0, next: now };
    if (G.chat && now >= G.chat.next) { const line = CHAT[G.chat.i]; if (!line) { G.chat = null; learn(['rumores', 'Buscan a alguien', 'Las vecinas dicen que los del barco negro buscan a alguien. Y que en Kalé hay «lo de siempre».']); } else { bubble(PEOPLE.find(n => n.id === line[0]), line[1], 2600); G.chat.i++; G.chat.next = now + 2700; } }
  }
  draw(now); if (!cv.hidden) requestAnimationFrame(loop);
}
function draw(now) {
  const VW = G.VW, VH = G.VH, inside = G.scene !== 'town', I = inside && interior(G.scene), SW = inside ? I.w : WORLD.w, SH = inside ? I.h : WORLD.h;
  const cam = [Math.round(SW < VW ? -(VW - SW) / 2 : Math.max(0, Math.min(SW - VW, G.x - VW / 2))), Math.round(SH < VH ? -(VH - SH) / 2 : Math.max(0, Math.min(SH - VH, G.y - VH / 2)))];
  const chars = PEOPLE.filter(n => n.scene === G.scene).map(n => ({ id: n.sprite, x: n.x, y: n.y, dir: n.dir, f: n.route ? n.frame : 0 }));
  chars.push({ id: 'grumete', x: G.x, y: G.y, dir: G.dir, f: G.moving ? 1 + Math.floor(G.walk) % 8 : 0 });
  if (inside) drawInterior(g, I, cam, VW, VH, chars, now, hourNow()); else drawTown(g, cam, VW, VH, chars, now, hourNow());
  // globos y aviso de acción siguen a quien corresponde
  const toScr = (x, y) => [(x - cam[0]) * G.scale, (y - cam[1]) * G.scale + parseFloat(cv.style.top)];
  G.bubbles = G.bubbles.filter(b => { if (now > b.until || b.npc.scene !== G.scene) { b.el.remove(); return false; } const [x, y] = toScr(b.npc.x, b.npc.y - 58); b.el.style.left = x + 'px'; b.el.style.top = y + 'px'; return true; });
  const ov = document.getElementById('overlays'); let pr = ov.querySelector('.prompt'); const t = !G.talking && !G.paused && nearest();
  if (t) { if (!pr) { pr = document.createElement('div'); pr.className = 'prompt'; ov.appendChild(pr); } const lbl = t.type === 'npc' ? 'Hablar' : t.type === 'obj' ? t.o.label : t.type === 'idoor' ? (t.d.to === 'town' ? 'Salir' : 'Abrir') : 'Entrar'; pr.innerHTML = `<kbd>E</kbd>${lbl}`;
    const [px, py] = t.type === 'npc' ? [t.n.x, t.n.y - 62] : t.type === 'obj' ? [t.x, t.y - 26] : t.type === 'door' ? [t.s.door[0], t.s.door[1] - 56] : [G.x, G.y - 62]; const [sx, sy] = toScr(px, py); pr.style.left = sx + 'px'; pr.style.top = sy + 'px'; } else if (pr) pr.remove();
  const m = Math.floor(G.minutes) % 1440; document.getElementById('hour').textContent = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
function shade(g, x, y, r) { g.fillStyle = 'rgba(20,10,5,.28)'; g.beginPath(); g.ellipse(Math.round(x), Math.round(y), r, 4, 0, 0, 7); g.fill(); }
function drawSorted(g, list, cam) { list.sort((a, b) => a.key - b.key); for (const s of list) s.draw(g, cam); }
function drawTown(g, cam, VW, VH, chars, now, h) {
  const t = now / 1000, [cx, cy] = cam;
  // mar que se mueve
  const wp = pat(g, R.water); wp.setTransform(new DOMMatrix().translate(-cx + Math.round(Math.sin(t * .6) * 6), -cy + Math.round(t * 4) % 32)); g.fillStyle = wp; g.fillRect(0, 0, VW, VH);
  g.fillStyle = 'rgba(255,255,255,.75)'; for (let i = 0; i < WORLD.foam.length; i++) { const [x, y] = WORLD.foam[i]; if (x < cx - 20 || x > cx + VW + 20 || y < cy - 20 || y > cy + VH + 20) continue; if (Math.sin(t * 2 + i * 1.7) > .2) g.fillRect(Math.round(x - cx - 2), Math.round(y - cy), 4, 1); }
  g.drawImage(WORLD.ground, cx, cy, VW, VH, 0, 0, VW, VH); actoDrawTown(g, cam, now);
  // sombras según el sol
  const sn = sun(h);
  if (sn) { g.fillStyle = `rgba(15,20,45,${sn.alpha})`;
    for (const sp of WORLD.sprites) { if (sp.kind !== 'bld') continue; const s = sp.s, [fx, fy, fw, fh] = s.foot, H = s.b.ext.redondo ? 7 * T : 4 * T;
      if (fx > cx + VW + 300 || fx + fw < cx - 300 || fy > cy + VH + 300 || fy + fh < cy - 300) continue;
      const c = [[fx, fy], [fx + fw, fy], [fx + fw, fy + fh], [fx, fy + fh]]; poly(g, hull([...c, ...c.map(([x, y]) => [x + sn.dx * H, y + sn.dy * H])]).map(([x, y]) => [x - cx, y - cy])); g.fill(); }
    for (const [x, y] of WORLD.trees) { if (x < cx - 200 || x > cx + VW + 200 || y < cy - 100 || y > cy + VH + 200) continue; g.beginPath(); g.ellipse(x - cx + sn.dx * 70, y - cy + sn.dy * 50 - 6, 40, 18, 0, 0, 7); g.fill(); } }
  const night = isNight(h), list = [];
  for (const sp of WORLD.sprites) { const w = sp.canvas ? sp.canvas.width : 140, hh = sp.canvas ? sp.canvas.height : 160; const x0 = sp.tree ? sp.x - 50 : sp.x, y0 = sp.tree ? sp.y - 140 : sp.y;
    if (x0 > cx + VW || x0 + w < cx || y0 > cy + VH || y0 + hh < cy - 20) continue;
    list.push({ key: sp.key, draw: (g, [cx, cy]) => { if (sp.canvas) g.drawImage(sp.canvas, Math.round(sp.x - cx), Math.round(sp.y - cy)); else if (sp.img) put(g, sp.img, sp.x - cx, sp.y - cy); else if (sp.tree) drawTree(g, sp.x - cx, sp.y - cy); else if (sp.lamp) drawLamp(g, sp.x - cx, sp.y - cy, night); else if (sp.rect) { g.fillStyle = sp.rect[4]; g.fillRect(sp.rect[0] - cx, sp.rect[1] - cy, sp.rect[2], sp.rect[3]); } } }); }
  for (const c of chars) list.push({ key: c.y, draw: (g, [cx, cy]) => { shade(g, c.x - cx, c.y - cy, 11); drawLPC(g, c.id, c.x - cx, c.y - cy, c.dir, c.f); } });
  drawSorted(g, list, cam);
  const [r, gg, b, a] = ambient(h); if (a > 0) { g.fillStyle = `rgba(${r | 0},${gg | 0},${b | 0},${a})`; g.fillRect(0, 0, VW, VH); }
  if (night) { g.globalCompositeOperation = 'lighter';
    const glow = (x, y, rad, c) => { const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - rad, y - rad, 2 * rad, 2 * rad); };
    for (const s of WORLD.doors) for (const [x, y, w, hh] of s.wins) if (x > cx - 60 && x < cx + VW + 60 && y > cy - 60 && y < cy + VH + 60) { g.fillStyle = 'rgba(255,200,110,.55)'; g.fillRect(x - cx, y - cy, w, hh); glow(x - cx + w / 2, y - cy + hh, 50, 'rgba(255,170,80,.25)'); }
    for (const [x, y] of WORLD.lamps) glow(x - cx, y - cy - 50, 90, 'rgba(255,200,110,.35)');
    for (const s of WORLD.doors) if (s.lantern) glow(s.lantern[0] - cx, s.lantern[1] - cy, 160 + Math.sin(now / 300) * 10, 'rgba(255,230,150,.45)');
    g.globalCompositeOperation = 'source-over'; }
}
// sol que entra por una ventana según hacia dónde mira y la hora
function windowSun(dir, h) { const a = { E: [6, 11.5], S: [10, 15], O: [14, 19] }[dir]; if (!a || h < a[0] || h > a[1]) return 0; return Math.sin(Math.PI * (h - a[0]) / (a[1] - a[0])); }
function drawInterior(g, I, cam, VW, VH, chars, now, h) {
  const [cx, cy] = cam; g.fillStyle = '#120b07'; g.fillRect(0, 0, VW, VH); g.drawImage(I.canvas, -cx, -cy);
  const list = I.items.map(it => ({ key: it.key, draw: (g, [cx, cy]) => { if (it.img) put(g, it.img, it.x - cx, it.y - cy); else { g.save(); g.translate(-cx, -cy); it.fn(g); g.restore(); } } }));
  for (const c of chars) list.push({ key: c.y, draw: (g, [cx, cy]) => { shade(g, c.x - cx, c.y - cy, 11); drawLPC(g, c.id, c.x - cx, c.y - cy, c.dir, c.f); } });
  drawSorted(g, list, cam);
  const night = isNight(h), day = !night;
  g.globalCompositeOperation = 'multiply'; g.fillStyle = night ? 'rgb(96,92,128)' : 'rgb(208,198,192)'; g.fillRect(0, 0, VW, VH);
  g.globalCompositeOperation = 'screen';
  for (const L of I.lights) {
    if (L.wall === 'N') { if (day) { const gr = g.createRadialGradient(L.x - cx, L.y - cy, 0, L.x - cx, L.y - cy, 60); gr.addColorStop(0, 'rgba(220,235,255,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(L.x - cx - 60, L.y - cy - 60, 120, 120); } continue; }
    const s = windowSun(L.dir, h); if (s <= 0) continue; const len = 90 + 120 * (1 - s), al = .45 * s;
    let gr, pts;
    if (L.wall === 'E' || L.wall === 'O') { const sg = L.wall === 'E' ? -1 : 1, x0 = L.x - cx, y0 = L.y - cy; pts = [[x0, y0 - L.w / 2], [x0, y0 + L.w / 2], [x0 + sg * len, y0 + L.w / 2 + len * .35], [x0 + sg * len, y0 - L.w / 2 + len * .35]]; gr = g.createLinearGradient(x0, 0, x0 + sg * len, 0); }
    else { const x0 = L.x - cx, y0 = L.y - cy, sk = (12 - h) * 10; pts = [[x0 - L.w / 2, y0], [x0 + L.w / 2, y0], [x0 + L.w / 2 + sk, y0 - len], [x0 - L.w / 2 + sk, y0 - len]]; gr = g.createLinearGradient(0, y0, 0, y0 - len); }
    gr.addColorStop(0, `rgba(255,232,180,${al})`); gr.addColorStop(1, 'rgba(255,232,180,0)'); g.fillStyle = gr; poly(g, pts); g.fill(); }
  for (const f of I.fires) { const fl = f.kind === 'fuego' ? 1 + Math.sin(now / 90) * .05 + Math.sin(now / 37) * .04 : 1, r = f.r * fl, x = f.x - cx, y = f.y - cy, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, f.kind === 'fuego' ? `rgba(255,140,50,${night ? .7 : .4})` : `rgba(255,200,120,${night ? .55 : .2})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  g.globalCompositeOperation = 'source-over';
  for (const f of I.fires) if (f.kind === 'fuego' && f.flame !== false) { const k = Math.floor(now / 110); g.fillStyle = 'rgba(255,220,120,.6)'; for (let i = 0; i < 3; i++) if (hash(k, i, 7) < .5) g.fillRect(Math.round(f.x - cx - 8 + hash(k, i, 8) * 16), Math.round(f.y - cy - 4 - hash(k, i, 9) * 8), 2, 2); }
}
// ---------- fondo del menú: Kalé de verdad, con la cámara recorriendo el puerto ----------
const bg = document.getElementById('bg'), bgg = bg.getContext('2d'); bgg.imageSmoothingEnabled = false;
const attract = { on: false };
function fitBg() { const s = Math.max(innerWidth / 640, innerHeight / 360) * 1.04; bg.style.width = 640 * s + 'px'; bg.style.height = 360 * s + 'px'; }
function attractFrame(now) { if (!attract.on) return; const t = now / 1000, cam = [Math.round(180 + Math.sin(t / 18) * 160), Math.round(13 * T + Math.sin(t / 23) * 40)];
  const ppl = [['viejo', 3.2 * T, 24.6 * T, 'down', 0], ['pescadora', 16 * T, 26.2 * T, 'right', 0], ['vecina', 17 * T, 26.2 * T, 'left', 0]];
  const [x, y, d] = where([[12, 22.2], [24, 22.2]].map(([a, b]) => [a * T, b * T]), 40, t); ppl.push(['marine', x, y, d, 1 + Math.floor(t * 9) % 8]);
  drawTown(bgg, cam, 640, 360, ppl.map(([id, x, y, dir, f]) => ({ id, x, y, dir, f })), now, 17.2); requestAnimationFrame(attractFrame); }
fitBg();
listo.then(menu).catch(e => { root.innerHTML = `<section class="screen"><div class="col"><h2 class="t">No se pudo cargar Kalé</h2><p class="lead">${e.message}</p></div></section>`; });
