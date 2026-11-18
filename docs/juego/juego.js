// Menú, prólogo, conversaciones, diario y el bucle del juego. El mundo lo construye mundo.js desde plano.json.
const PERSONAJES = ['grumete', 'madre', 'nino', 'viejo', 'navegante', 'pescadora', 'vecina', 'marine', 'tabernera', 'capitan', 'maton', 'padre'];
const SHEETS = {}, ROW = { up: 0, left: 1, down: 2, right: 3 };
const loadImg = s => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error('No se pudo cargar ' + s)); i.src = s; });
function drawLPC(g, id, x, y, dir, frame, scale = 1) { const im = SHEETS[id]; if (!im) return; g.drawImage(im, frame * 64, ROW[dir] * 64, 64, 64, Math.round(x - 32 * scale), Math.round(y - 60 * scale), 64 * scale, 64 * scale); }
let PLANO, CREDITOS;
const listo = (async () => {
  await Promise.all([...Object.entries(ATLAS).map(([k, s]) => loadImg(s).then(i => A[k] = i)), ...PERSONAJES.map(id => loadImg('assets/personajes/' + id + '.png').then(i => SHEETS[id] = i))]);
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
function reset() { Object.assign(S, { step: 0, ax: { coraje: 0, corazon: 0, orgullo: 0, libertad: 0, ambicion: 0 }, st: {}, of: {}, trs: [], tags: [], bonds: [], items: [], dream: null, ev: 1 + Math.floor(rnd() * 4), evDone: false, asked: {} });
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
function preview(canvas, id) { const g = canvas.getContext('2d'); g.imageSmoothingEnabled = false; const dirs = ['down', 'left', 'up', 'right'], t0 = performance.now(); clearInterval(previewTimer);
  previewTimer = setInterval(() => { const t = (performance.now() - t0) / 1000; g.clearRect(0, 0, canvas.width, canvas.height); drawLPC(g, id, canvas.width / 2, canvas.height * .86, dirs[Math.floor(t / 1.6) % 4], 1 + Math.floor(t * 9) % 8, canvas.width / 72); }, 60); }
function create() {
  show(`<div class="create"><div class="stagebox"><canvas id="pv" width="288" height="288" aria-label="Tu personaje"></canvas></div><div class="glass panel"><div class="kick">Nueva partida</div><h1 class="t">¿Quién eres?</h1>
    <label class="f" for="nm">Nombre<input class="name" id="nm" maxlength="16" autocomplete="off" value="${player.name}" autofocus></label>
    <label class="f" for="ap">Apellido<input class="name" id="ap" maxlength="16" autocomplete="off" value="${player.last}"></label>
    <div class="row"><button class="btn" type="button" id="go">Comenzar</button><button class="btn ghost" type="button" id="back">Volver</button></div></div></div>`);
  preview(document.getElementById('pv'), 'grumete');
  const stop = () => clearInterval(previewTimer);
  document.getElementById('back').onclick = () => { stop(); menu(); };
  document.getElementById('go').onclick = () => { player.name = document.getElementById('nm').value.trim() || pick(['Ilo', 'Nara', 'Cato', 'Brisa', 'Joel', 'Sira']); player.last = document.getElementById('ap').value.trim() || pick(['Malatesta', 'Varga', 'Salvatierra', 'Brakken']); stop(); reset(); question(); };
  keys(e => { if (e.key === 'Escape') { stop(); menu(); } if (e.key === 'Enter') document.getElementById('go').click(); });
}
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
  const btns = [...root.querySelectorAll('.opt')]; btns.forEach(b => b.onclick = () => { S.dream = list[+b.dataset.i].t; startGame(); }); keys(e => { const n = +e.key; if (n >= 1 && n <= btns.length) btns[n - 1].click(); }); }

// =====================================================================
// GENTE: dónde está cada uno, qué comenta y de qué se puede hablar con él
// =====================================================================
// Una conversación: saludo y después temas. Cada tema puede cambiar según cuántas veces lo preguntaste o lo que ya sabes.
const knows = title => Object.values(DIARY).some(sec => sec.some(e => e.title === title));
function makePeople() {
  const fam = player.last;
  return [
    { id: 'marla', scene: 'casa', at: [2.6, 8.4], sprite: 'madre', dir: 'right', name: `Marla ${fam}`, barks: ['El agua ya hierve.', '¿Has visto el cuchillo grande?', 'Abrígate, que sopla del norte.'],
      hello: () => S.asked.marla ? pick(['¿Qué quieres ahora?', '¿Sigues aquí?', 'Dime.']) : `Por fin te levantas, ${player.name}. Ha entrado un barco con bandera negra en el puerto y todo el pueblo está nervioso.`,
      first: [['familia', `Mi madre: Marla ${fam}`, 'Me crió sola, con Corso. Trabaja limpiando pescado en el mercado.']],
      topics: [
        { t: '¿Qué pasa en el puerto?', a: ['Un barco negro. Nadie sabe qué quieren. La Marina dice que no nos acerquemos.', 'Ve a ver si Brin necesita algo en el muelle. Y no te metas en líos.'], learn: [['rumores', 'El barco negro', 'Entró anoche con bandera negra. La Marina pide no acercarse.']] },
        { t: 'Háblame de papá.', a: n => [['No empieces, ' + player.name + '.'], ['Te he dicho que no quiero hablar de eso.'], ['(Se queda mirando el fuego un buen rato.)', 'Era alguien que se fue. Es todo lo que necesitas saber.']][Math.min(n, 2)], learn: n => n >= 2 ? [['familia', 'Mi padre', 'Se fue cuando yo era pequeño. Mamá no quiere hablar de él.']] : [] },
        { t: 'Algún día me voy a ir de Kalé.', when: () => S.ax.libertad + S.ax.ambicion > 0, a: ['Ya lo sé. Lo sé desde que eras así de pequeño.', 'Pero hoy no. Hoy hay un barco pirata en el puerto.'] },
        { t: '¿Necesitas ayuda con algo?', a: ['Si quieres ayudar, lleva a Corso lejos del muelle. Se le van los ojos detrás de ese barco.'] },
      ] },
    { id: 'corso', scene: 'casa', at: [10.8, 4.9], sprite: 'nino', dir: 'left', name: `Corso ${fam}`, barks: ['¡Mira, un barco!', '¿Jugamos a piratas?', 'Mamá está rara hoy.'],
      hello: () => S.asked.corso ? pick(['¿Qué?', '¡Eh!', '¿Ya vuelves?']) : '¡Por fin! ¿Has visto el barco negro? ¡Es enorme!',
      first: [['familia', `Mi hermano: Corso ${fam}`, 'Once años. Me sigue a todas partes y dibuja barcos en todas las paredes.']],
      topics: [
        { t: '¿Qué dibujas?', a: ['Barcos. Este es el mío. Va a ser más grande que el del puerto.', 'Y este de aquí eres tú. Eres el capitán. Bueno, segundo capitán.'] },
        { t: '¿Te acuerdas de papá?', a: ['Yo era muy pequeño... Solo me acuerdo de una voz.', 'Pero mamá guarda algo en el cofre de su cuarto. La he visto abrirlo de noche.'], learn: [['familia', 'El cofre de mamá', 'Corso dice que mamá abre de noche un cofre que guarda en su cuarto.']] },
        { t: 'Algún día me iré a navegar.', a: n => n ? ['Ya me lo dijiste.', '...Prometiste que me llevarías.'] : ['¿En serio? ¿Y me llevarás?', '¡Prométemelo!'], learn: () => [['familia', 'Una promesa', 'Le prometí a Corso que algún día me lo llevaría a navegar.']] },
      ] },
    { id: 'brin', scene: 'town', at: [3.2, 24.6], sprite: 'viejo', dir: 'down', name: 'Viejo Brin', barks: ['Hoy no pican.', 'Esa bandera... no me gusta nada.', 'El mar se pone nervioso con barcos así.'],
      hello: () => S.asked.brin ? 'Sigue sin picar nada.' : `Ah, el chico de Marla. ¿Vienes a ver el barco negro, como todos?`,
      first: [['gente', 'Viejo Brin', 'Pescador del muelle. Vive en una choza sobre pilotes.']],
      topics: [
        { t: 'Esa bandera, ¿la conoces?', a: ['Una medusa. La vi una vez, hace veinte años. Aquel invierno el mar se tragó tres barcas.', 'Y algo más se fue de Kalé aquel invierno. Pero eso no me toca contarlo a mí.'], learn: [['rumores', 'La bandera de la medusa', 'Brin la vio hace veinte años, el invierno en que el mar se tragó tres barcas.']] },
        { t: '¿Conociste a mi padre?', when: () => knows('Mi padre') || S.tag('padre'), a: ['(Brin tira de la caña sin mirarte.)', 'Pregúntale a tu madre. Si ella no te lo cuenta, tendrá sus motivos.'] },
        { t: '¿Necesitas algo?', a: ['Que ese barco se vaya. Y una red nueva. Lo primero no depende de ti.'] },
      ] },
    { id: 'lin', scene: 'town', at: [31.6, 23.8], sprite: 'navegante', dir: 'up', name: 'Lin', barks: ['Curioso...', '¿Quién pondría un ancla así en medio de una plaza?'],
      hello: () => S.asked.lin ? '¿Otra vez tú? Bien, me vendrá bien alguien que conozca la isla.' : '¿Sabes quién dejó esta ancla aquí?',
      first: [['gente', 'Lin', 'Cartógrafa de paso. Le interesa el ancla de la plaza.']],
      topics: [{ t: '¿Qué buscas en Kalé?', a: ['En las cartas de la Marina, Kalé ni siquiera tiene nombre. Las islas sin nombre suelen esconder algo.'], learn: [['rumores', 'Kalé no está en los mapas', 'Según Lin, en las cartas de la Marina la isla no tiene nombre.']] },
        { t: '¿Cómo llegaste?', a: ['En el mismo barco que trae la sal cada mes. Me voy en el próximo... o en el que salga antes.'] }] },
    { id: 'rosa', scene: 'town', at: [26.8, 24.4], sprite: 'pescadora', dir: 'right', name: 'Rosa', chat: true, barks: ['Hoy el pescado está caro.', '¡Fresco, recién salido del agua!'] },
    { id: 'pura', scene: 'town', at: [28.1, 24.4], sprite: 'vecina', dir: 'left', name: 'Doña Pura', chat: true, barks: ['En mis tiempos esto no pasaba.', `¿Y tu madre, cómo está?`] },
    { id: 'mar1', scene: 'town', route: [[42.5, 15.2], [42.5, 22.6], [35, 22.6], [31.5, 26.8], [35, 22.6], [42.5, 22.6]], speed: 32, sprite: 'marine', name: 'Marine', barks: ['Circula, chaval.', 'Orden del capitán: nadie se acerca al barco negro.', 'Hace demasiado calor para este uniforme.'],
      hello: () => 'No tengo tiempo para charlas. Hay un barco pirata fondeado frente al puerto.', topics: [{ t: '¿Qué buscan los piratas?', a: ['Si lo supiera no estaría patrullando. Si ves a alguien con un garfio, avisa al destacamento.'], learn: [['rumores', 'La Marina vigila', 'Buscan a alguien con un garfio.']] }] },
    { id: 'mara', scene: 'taberna', at: [8, 2.3], sprite: 'tabernera', dir: 'down', name: 'Mara', barks: ['¡Arriba esas jarras!', 'Hoy no fío.'],
      hello: () => S.asked.mara ? '¿Otra?' : '¿Lo de siempre? Hoy no fío, que la Marina anda rara.', first: [['gente', 'Mara', 'Tabernera de El Ancla Seca. Se entera de todo.']],
      topics: [{ t: '¿Qué se cuenta hoy?', a: ['Que el del rincón lleva toda la mañana preguntando por alguien de Kalé.', 'No ha dicho por quién. Pero ha dicho tu apellido dos veces.'], learn: [['rumores', 'El del garfio pregunta', `Según Mara, el del rincón ha preguntado por los ${fam}.`]] },
        { t: '¿Quién es el del rincón?', a: ['"Garra" Dorne. El capitán del barco negro. Paga bien y mira mal.'] }] },
    { id: 'dorne', scene: 'taberna', at: [14.2, 11.2], sprite: 'capitan', dir: 'left', name: '"Garra" Dorne', barks: ['Krakaka...', 'Esta isla huele a pescado y a miedo.'],
      hello: () => S.asked.dorne ? 'Krakaka... ¿Otra vez tú?' : `Krakaka... ¿Y tú qué miras, mocoso? Espera. Esa cara... ¿Eres un ${fam}?`,
      first: [['gente', '"Garra" Dorne', 'Capitán de la bandera de la medusa. Me reconoció por la cara.']],
      topics: [{ t: '¿Qué buscas en Kalé?', a: ['Algo que es mío. Lo dejé aquí hace veinte años y alguien lo ha guardado muy bien.'] }, { t: '¿Conoces a mi familia?', a: ['Conocí a alguien con tu cara. Dile a tu madre que Dorne ha vuelto. Ella sabrá.'], learn: [['familia', 'Dorne conoce a mamá', 'Dorne me reconoció por la cara y dijo que mamá sabría quién es.']] }] },
  ];
}
const OBJECTS = () => [
  { scene: 'town', at: [30, 21.9], label: 'Leer', text: '«Aquí echó el ancla el primer barco que llegó a Kalé. Que nadie la levante.» Debajo, alguien ha rayado: «Ya veremos».', learn: ['kale', 'El Ancla de Kalé', 'La placa dice que nadie debe levantarla. Alguien rayó debajo: «Ya veremos».'] },
  { scene: 'town', at: [35.5, 19.3], label: 'Leer', text: 'SE BUSCA: «Garra» Dorne. 8.000.000 de berries. Debajo, un papel nuevo de la Marina: «Prohibido acercarse al barco fondeado».', learn: ['rumores', 'Dorne tiene recompensa', 'El tablón de la Marina ofrece 8.000.000 de berries por «Garra» Dorne.'] },
  { scene: 'casa', at: [4.95, 5.6], label: 'Mirar', text: 'El cofre de mamá. Cerrado con llave. Nunca lo has visto abierto.', learn: ['familia', 'El cofre de mamá', 'En el cuarto de mamá hay un cofre cerrado con llave.'] },
  { scene: 'casa', at: [4.8, 1.4], label: 'Mirar', text: 'Un retrato boca abajo sobre la cómoda. Al levantarlo, está vacío: alguien sacó la imagen y dejó solo el marco.', learn: ['familia', 'El retrato vacío', 'Sobre la cómoda de mamá hay un marco boca abajo, sin la imagen.'] },
  { scene: 'brin', at: [3.7, 0.9], label: 'Mirar', text: 'Un mapa viejo y descolorido. Alguien marcó una cruz lejos de cualquier isla conocida.', learn: ['rumores', 'La cruz del mapa de Brin', 'En casa de Brin hay un mapa con una cruz lejos de cualquier isla conocida.'] },
];
const CHAT = [['pura', '¿Has visto el barco que entró anoche?'], ['rosa', 'Bandera negra. Mi Tomás no quiere salir a faenar.'], ['pura', 'Dicen que buscan a alguien.'], ['rosa', 'En Kalé no hay nada que buscar... salvo lo de siempre.'], ['pura', 'Calla, que te oyen.']];
const CLOSED = { tienda: 'La puerta está cerrada. Un cartel: «Vuelvo enseguida. Gaspar».', medico: 'Llamas, pero nadie contesta.', faro: 'La puerta del faro está cerrada con llave.', panaderia: 'Huele a pan, pero la puerta está atrancada.', marina: 'Un marine de guardia te corta el paso: «Solo personal de la Marina».', pura: 'Es la casa de Doña Pura. No está.', rosa: 'Es la casa de Rosa. No hay nadie.' };

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
const G = { scene: 'town', x: 0, y: 0, dir: 'down', walk: 0, moving: false, paused: true, keys: {}, VW: 640, VH: 360, scale: 2, minutes: 8 * 60, talking: null, lastT: 0, bubbles: [], chat: null, ints: {} };
let PEOPLE = [];
const hourNow = () => (G.minutes % 1440) / 60;
function fitGame() { const w = innerWidth, h = innerHeight; G.VW = Math.min(640, Math.max(300, Math.round(w / 1.6))); G.VH = Math.round(G.VW * h / w); G.scale = w / G.VW; cv.width = G.VW; cv.height = G.VH; cv.style.width = w + 'px'; cv.style.height = G.VH * G.scale + 'px'; cv.style.left = '0'; cv.style.top = ((h - G.VH * G.scale) / 2) + 'px'; g.imageSmoothingEnabled = false; }
addEventListener('resize', () => { fitBg(); if (!cv.hidden) fitGame(); });
const interior = id => G.ints[id] || (G.ints[id] = buildInterior(PLANO.edificios.find(b => b.id === id)));
const sceneOf = id => id === 'town' ? null : interior(id);
const toPx = (scene, [x, y]) => scene === 'town' ? [x * T, y * T] : [interior(scene).X(x), interior(scene).Y(y)];
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
  if (G.scene === 'town') return !walkableTown(x, y) || PEOPLE.some(n => n.scene === 'town' && Math.abs(n.x - x) < 10 && Math.abs(n.y - y) < 6);
  const I = interior(G.scene); if (x < I.area[0] + 6 || x > I.area[0] + I.area[2] - 6 || y > I.h - 2) return true;
  if (hit(I.walk, x, y)) return false; return hit(I.blocks, x, y) || PEOPLE.some(n => n.scene === G.scene && Math.abs(n.x - x) < 10 && Math.abs(n.y - y) < 6);
}
function fade(cb) { const f = document.getElementById('fadeov'); f.style.opacity = 1; setTimeout(() => { cb(); f.style.opacity = 0; }, 360); }
function enter(scene, [x, y], dir) { G.scene = scene; G.x = x; G.y = y; G.dir = dir; clearBubbles(); const pn = document.getElementById('placeName'); pn.textContent = scene === 'town' ? 'Kalé' : interior(scene).name; pn.style.opacity = 1; clearTimeout(pn._t); pn._t = setTimeout(() => pn.style.opacity = 0, 2600); }
function startGame() {
  attract.on = false; keyHandler = null; show(''); app.classList.add('playing'); cv.hidden = false; document.getElementById('hud').hidden = false; fitGame();
  PEOPLE = makePeople().map(n => { const [x, y] = n.route ? [0, 0] : toPx(n.scene, n.at); return { ...n, x, y, frame: 0, nextBark: performance.now() + 3000 + rnd() * 6000 }; });
  if (matchMedia('(pointer:coarse)').matches) document.getElementById('pad').hidden = false;
  enter('casa', toPx('casa', [8.6, 4.2]), 'down'); G.paused = false; G.minutes = 8 * 60;
  const corso = PEOPLE.find(n => n.id === 'corso');
  setTimeout(() => say(corso, { lines: ['¡Por fin te despiertas! Mamá te está esperando en la cocina.', 'Y hay un barco negro en el puerto. ¡Un barco pirata de verdad!'] }), 600);
  requestAnimationFrame(loop);
}
// ---------- conversaciones ----------
function face(canvas, sprite) { const c = canvas.getContext('2d'); c.imageSmoothingEnabled = false; c.clearRect(0, 0, 64, 64); c.drawImage(SHEETS[sprite], 0, ROW.down * 64, 64, 40, 0, 4, 64, 40); }
function say(npc, conv) { G.talking = { npc, conv, i: 0 }; if (npc.x != null) { const dx = G.x - npc.x, dy = G.y - npc.y; npc.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); } renderTalk(); }
function talkTo(npc) {
  const first = !S.asked[npc.id]; const lines = [npc.hello()]; S.asked[npc.id] = S.asked[npc.id] || {};
  if (first) (npc.first || []).forEach(learn);
  say(npc, { lines, topics: true });
}
function topicsOf(npc) { return (npc.topics || []).filter(t => !t.when || t.when()); }
function renderTalk() {
  const ov = document.getElementById('overlays'); let box = ov.querySelector('.dlg'); const t = G.talking; document.getElementById('hud').classList.toggle('talking', !!t);
  if (!t) { box && box.remove(); return; }
  if (!box) { box = document.createElement('div'); box.className = 'dlg glass'; box.setAttribute('role', 'dialog'); ov.appendChild(box); }
  const last = t.i >= t.conv.lines.length - 1, tops = last && t.conv.topics ? topicsOf(t.npc) : [], ch = last && (tops.length || t.conv.choices);
  const opts = t.conv.choices || (tops.length ? [...tops.map(x => x.t), 'Nada, me voy.'] : []);
  box.innerHTML = `<div class="face"><canvas width="64" height="48" aria-hidden="true"></canvas></div><div><b class="nm">${t.npc.name || ''}</b><p>${t.conv.lines[t.i]}</p>${ch ? `<div class="ch">${opts.map((c, i) => `<button type="button" data-i="${i}">${c}</button>`).join('')}</div>` : ''}</div>${ch ? '' : '<span class="more">E / clic para seguir</span>'}`;
  face(box.querySelector('canvas'), t.npc.sprite || 'grumete');
  box.onclick = e => { const b = e.target.closest('button'); if (b) choose(+b.dataset.i); else if (!ch) advance(); };
  if (ch) box.querySelector('button').focus();
}
function choose(i) {
  const t = G.talking; if (!t) return;
  if (t.conv.choices) { const c = t.conv.choices[i]; G.talking = null; renderTalk(); if (c.then) c.then(); return; }
  const tops = topicsOf(t.npc); if (i >= tops.length) { G.talking = null; renderTalk(); return; }
  const tp = tops[i], asked = S.asked[t.npc.id], n = asked[tp.t] || 0; asked[tp.t] = n + 1;
  const a = typeof tp.a === 'function' ? tp.a(n) : tp.a, l = typeof tp.learn === 'function' ? tp.learn(n) : tp.learn;
  (l || []).forEach(learn); G.talking = { npc: t.npc, conv: { lines: a, topics: true }, i: 0 }; renderTalk();
}
function advance() { const t = G.talking; if (!t) return; if (t.i < t.conv.lines.length - 1) { t.i++; renderTalk(); } else if (!t.conv.topics) { (t.conv.learn || []).forEach(learn); G.talking = null; renderTalk(); } }
function clearBubbles() { G.bubbles.forEach(b => b.el.remove()); G.bubbles = []; G.chat = null; }
function bubble(npc, text, ms = 3200) { const el = document.createElement('div'); el.className = 'bubble'; el.textContent = text; document.getElementById('overlays').appendChild(el); G.bubbles.push({ npc, el, until: performance.now() + ms }); }
// ---------- interacción ----------
function nearest() {
  let best = null, bd = 44;
  for (const n of PEOPLE) if (n.scene === G.scene && (n.topics || n.hello)) { const d = Math.hypot(n.x - G.x, n.y - G.y); if (d < bd) { bd = d; best = { type: 'npc', n }; } }
  for (const o of OBJECTS()) if (o.scene === G.scene) { const [x, y] = toPx(o.scene, o.at), d = Math.hypot(x - G.x, y - G.y); if (d < bd) { bd = d; best = { type: 'obj', o, x, y }; } }
  if (G.scene === 'town') { for (const s of WORLD.doors) { const [dx, dy] = s.door; if (Math.abs(G.x - dx) < 18 && G.y > dy - 6 && G.y < dy + 26) return { type: 'door', s }; } }
  else for (const ex of interior(G.scene).exits) if (hit([ex.r], G.x, G.y)) return { type: 'exit' };
  return best;
}
function interact() {
  if (G.talking) { if (!document.querySelector('.dlg .ch')) advance(); return; }
  const t = nearest(); if (!t) return;
  if (t.type === 'npc') talkTo(t.n);
  else if (t.type === 'obj') say({ name: '', sprite: 'grumete' }, { lines: [t.o.text], learn: t.o.learn ? [t.o.learn] : [] });
  else if (t.type === 'door') { const id = t.s.id; if (['casa', 'taberna', 'brin'].includes(id)) fade(() => { const I = interior(id); enter(id, I.exits[0].at, 'up'); }); else say({ name: '', sprite: 'grumete' }, { lines: [CLOSED[id]] }); }
  else fade(() => { const s = WORLD.doors.find(d => d.id === G.scene); enter('town', [s.door[0], s.door[1] + 18], 'down'); });
}
document.addEventListener('keydown', e => { if (cv.hidden) return; const k = e.key.toLowerCase();
  if (document.querySelector('.diary')) { if (k === 'escape' || k === 'j') closeDiary(); return; }
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) { G.keys[k] = true; e.preventDefault(); }
  if (k === 'e' || k === ' ' || k === 'enter') { if (!e.target.closest || !e.target.closest('button')) interact(); e.preventDefault(); }
  if (k === 'j' && !G.talking) openDiary(); });
document.addEventListener('keyup', e => { G.keys[e.key.toLowerCase()] = false; });
document.getElementById('openDiary').onclick = () => openDiary();
document.getElementById('actBtn').addEventListener('pointerdown', e => { e.preventDefault(); interact(); });
document.querySelectorAll('#pad .pad button').forEach(b => { const d = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' }[b.dataset.d];
  b.addEventListener('pointerdown', e => { e.preventDefault(); G.keys[d] = true; }); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => G.keys[d] = false)); });
cv.addEventListener('click', () => { if (G.talking && !document.querySelector('.dlg .ch')) advance(); });
function where(pts, v, t) { let L = 0; const seg = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); seg.push([a, b, l]); L += l; }
  let d = (t * v) % L; for (const [a, b, l] of seg) { if (d <= l) { const f = d / l, dx = b[0] - a[0], dy = b[1] - a[1]; return [a[0] + dx * f, a[1] + dy * f, Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up')]; } d -= l; } return [pts[0][0], pts[0][1], 'down']; }
// ---------- bucle ----------
function loop(now) {
  const dt = Math.min(50, now - (G.lastT || now)) / 1000; G.lastT = now;
  if (!G.paused && !G.talking) {
    let vx = 0, vy = 0; const K = G.keys; if (K.arrowleft || K.a) vx = -1; else if (K.arrowright || K.d) vx = 1; if (K.arrowup || K.w) vy = -1; else if (K.arrowdown || K.s) vy = 1;
    G.moving = !!(vx || vy);
    if (G.moving) { const sp = 84 * dt * (vx && vy ? .7071 : 1), nx = G.x + vx * sp, ny = G.y + vy * sp;
      if (!blocked(nx - 6, G.y) && !blocked(nx + 6, G.y)) G.x = nx; if (!blocked(G.x - 6, ny) && !blocked(G.x + 6, ny)) G.y = ny;
      G.dir = vx < 0 ? 'left' : vx > 0 ? 'right' : vy < 0 ? 'up' : 'down'; G.walk += dt * 10; }
    G.minutes += dt * .8;
    for (const n of PEOPLE) { if (n.route) { n.t = (n.t || rnd() * 100) + dt; const [x, y, d] = where(n.route.map(([a, b]) => [a * T, b * T]), n.speed, n.t); n.x = x; n.y = y; n.dir = d; n.frame = 1 + Math.floor(n.t * 9) % 8; }
      if (n.scene === G.scene && now > n.nextBark && !n.chat && Math.hypot(n.x - G.x, n.y - G.y) < 240) { bubble(n, pick(n.barks)); n.nextBark = now + 8000 + rnd() * 8000; } }
    const pura = PEOPLE.find(n => n.id === 'pura');
    if (G.scene === 'town' && pura && !G.chat && Math.hypot(pura.x - G.x, pura.y - G.y) < 130 && !knows('Buscan a alguien')) G.chat = { i: 0, next: now };
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
  if (t) { if (!pr) { pr = document.createElement('div'); pr.className = 'prompt'; ov.appendChild(pr); } const lbl = t.type === 'npc' ? 'Hablar' : t.type === 'obj' ? t.o.label : t.type === 'exit' ? 'Salir' : 'Entrar'; pr.innerHTML = `<kbd>E</kbd>${lbl}`;
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
  g.drawImage(WORLD.ground, cx, cy, VW, VH, 0, 0, VW, VH);
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
