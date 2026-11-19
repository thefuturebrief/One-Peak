// Acto 0: la introducción en tiza, las rutinas del día, la campana, la pelea y la partida. Guion en docs/acto0.md.
const F = {};
// =====================================================================
// INTRODUCCIÓN EN TIZA
// =====================================================================
const tz = {
  line: (a, b) => [a, b],
  poly: (pts, close) => close ? [...pts, pts[0]] : pts,
  circle: (cx, cy, rx, ry = rx, n = 28, a0 = 0, a1 = Math.PI * 2) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; }),
  wave: (x0, y, x1, amp = 4, step = 14) => { const p = []; for (let x = x0; x <= x1; x += step / 2) p.push([x, y + ((x - x0) / (step / 2)) % 2 * amp - amp / 2]); return p; },
  blob: (cx, cy, rx, ry, seed) => Array.from({ length: 33 }, (_, i) => { const a = i / 32 * Math.PI * 2, k = 1 + (hash(i % 32, 3, seed) - .5) * .22; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; }),
};
const TIZA = [
  { t: () => 'Kalé. Una isla pequeña del East Blue que no sale en ningún mapa.', d: () => [tz.blob(320, 170, 150, 80, 4), tz.poly([[398, 150], [398, 112], [410, 112], [410, 150]]), tz.poly([[394, 112], [404, 96], [414, 112]]), tz.poly([[260, 175], [260, 158], [292, 158], [292, 175]]), tz.poly([[254, 160], [276, 144], [298, 160]]),
    tz.wave(110, 280, 220), tz.wave(400, 290, 540), tz.wave(150, 70, 250), tz.wave(420, 60, 520), tz.line([60, 40], [60, 320]), tz.line([580, 40], [580, 320]), tz.line([60, 40], [580, 40]), tz.line([60, 320], [580, 320]), tz.poly([[520, 90], [530, 76], [542, 80], [540, 92], [532, 98], [532, 106]]), tz.circle(532, 116, 2, 2, 6)] },
  { t: () => `Vives con tu madre, Marla, en la casa del tejado de paja.`, d: () => [tz.poly([[200, 150], [230, 90], [410, 90], [440, 150]], true), tz.poly([[220, 150], [220, 260], [420, 260], [420, 150]]), tz.poly([[305, 260], [305, 200], [335, 200], [335, 260]]), tz.poly([[240, 180], [280, 180], [280, 215], [240, 215]], true), tz.poly([[360, 180], [400, 180], [400, 215], [360, 215]], true),
    tz.line([260, 180], [260, 215]), tz.line([380, 180], [380, 215]), tz.poly([[372, 90], [372, 66], [390, 66], [390, 90]]), tz.circle(384, 50, 8, 6, 12, Math.PI * .8, Math.PI * 2.4), tz.circle(396, 30, 10, 7, 12, Math.PI * .8, Math.PI * 2.4), tz.line([150, 262], [490, 262])] },
  { t: () => `Y con Corso, tu hermano pequeño, que te sigue a todas partes.`, d: () => [tz.circle(320, 120, 24), tz.poly([[300, 104], [306, 88], [314, 100], [320, 84], [326, 100], [336, 88], [340, 104]]), tz.line([320, 144], [320, 210]), tz.poly([[320, 160], [290, 185], [282, 196]]), tz.poly([[320, 160], [352, 182], [364, 178]]),
    tz.poly([[320, 210], [300, 262]]), tz.poly([[320, 210], [340, 262]]), tz.poly([[350, 180], [394, 180], [384, 196], [360, 196]], true), tz.poly([[372, 180], [372, 152], [390, 176]]), tz.circle(312, 118, 2, 2, 6), tz.circle(328, 118, 2, 2, 6), tz.circle(320, 130, 6, 3, 10, 0, Math.PI)] },
  { t: () => 'De tu padre solo sabes una cosa: un invierno se fue. Y tu madre no habla de él.', d: () => [tz.poly([[250, 160], [250, 70], [330, 70], [330, 160]], true), tz.line([290, 70], [290, 160]), tz.line([250, 115], [330, 115]), tz.circle(306, 92, 10, 10, 16),
    tz.poly([[390, 140], [390, 260]]), tz.poly([[390, 200], [460, 200], [460, 260]]), tz.line([400, 200], [400, 260]), tz.poly([[390, 140], [400, 140], [400, 200]]), tz.line([150, 262], [500, 262])] },
  { t: () => 'Tienes diecisiete años. Y anoche entró en el puerto un barco con bandera negra.', d: () => [tz.poly([[170, 220], [200, 260], [440, 260], [470, 220]], true), tz.line([260, 220], [260, 80]), tz.line([370, 220], [370, 90]), tz.poly([[268, 96], [330, 104], [330, 190], [268, 200]], true), tz.poly([[378, 104], [430, 110], [430, 190], [378, 196]], true),
    tz.poly([[370, 90], [370, 60], [420, 60], [420, 88], [370, 88]]), tz.circle(395, 72, 7, 6, 14), tz.line([388, 78], [384, 86]), tz.line([395, 79], [395, 87]), tz.line([402, 78], [406, 86]), tz.wave(100, 280, 560, 6, 18), tz.wave(140, 300, 520, 5, 18)] },
];
// trazo de tiza: líneas ásperas que se dibujan solas, con polvo alrededor
function chalkDraw(g, strokes, prog, seed) {
  const segs = []; strokes.forEach((s, k) => { for (let i = 1; i < s.length; i++) segs.push([s[i - 1], s[i], k]); });
  const total = segs.length, upto = prog * total;
  g.lineCap = 'round'; g.lineJoin = 'round';
  segs.forEach(([a, b, k], i) => { if (i > upto) return; const f = Math.min(1, upto - i), x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
    for (let pass = 0; pass < 2; pass++) { const j = (hash(i, pass, seed) - .5) * 1.6; g.strokeStyle = pass ? 'rgba(245,240,228,.35)' : 'rgba(245,240,228,.85)'; g.lineWidth = pass ? 1.2 : 2.6;
      g.beginPath(); g.moveTo(a[0] + j, a[1] - j); g.lineTo(x - j, y + j); g.stroke(); }
    if (hash(i, 9, seed) < .5) { g.fillStyle = 'rgba(245,240,228,.25)'; g.fillRect(Math.round(x + (hash(i, 7, seed) - .5) * 8), Math.round(y + (hash(i, 8, seed) - .5) * 8), 1, 1); } });
}
function intro(done) {
  keyHandler = null; show(''); attract.on = false;
  const ov = document.createElement('div'); ov.className = 'tiza'; ov.innerHTML = `<canvas width="640" height="360" aria-hidden="true"></canvas><p aria-live="polite"></p><button type="button" class="skip">Saltar</button>`;
  app.appendChild(ov); const c = ov.querySelector('canvas'), g = c.getContext('2d'), p = ov.querySelector('p'); let i = 0, t0 = performance.now(), live = true;
  const end = () => { if (!live) return; live = false; ov.remove(); keyHandler = null; done(); };
  const next = () => { const prog = (performance.now() - t0) / 2400; if (prog < 1) { t0 -= 2400; return; } i++; if (i >= TIZA.length) return end(); t0 = performance.now(); p.classList.remove('on'); p.textContent = ''; };
  const frame = now => { if (!live) return; const prog = Math.min(1, (now - t0) / 2400); g.fillStyle = 'rgb(22,26,24)'; g.fillRect(0, 0, 640, 360);
    for (let k = 0; k < 140; k++) { g.fillStyle = 'rgba(255,255,255,.025)'; g.fillRect(hash(k, i, 3) * 640, hash(k, i, 4) * 360, 30, 2); }
    chalkDraw(g, TIZA[i].d(), prog, i + 1);
    if (prog >= 1 && !p.classList.contains('on')) { p.textContent = TIZA[i].t(); p.classList.add('on'); }
    if (prog >= 1 && now - t0 > 2400 + 4200) next();
    requestAnimationFrame(frame); };
  ov.onclick = e => { if (e.target.classList.contains('skip')) end(); else next(); };
  keyHandler = e => { if (e.key === 'Escape') end(); else if (['Enter', ' ', 'e', 'E'].includes(e.key)) next(); };
  requestAnimationFrame(frame);
}

// =====================================================================
// RUTINAS: dónde está cada uno según la hora (hasta que suena la campana)
// =====================================================================
const RUTINA = {
  marla: [[0, 12, 'casa', [2.6, 8.4]], [12, 15, 'town', [17.2, 26.4]], [15, 24, 'casa', [2.6, 8.4]]],
  brin: [[0, 12, 'town', [3.2, 24.6]], [12, 14, 'taberna', [7.6, 8.8]], [14, 24, 'town', [3.2, 24.6]]],
  lin: [[0, 12.5, 'town', [31.6, 23.8]], [12.5, 15, 'faro', [5.2, 3.9]], [15, 24, 'town', [31.6, 23.8]]],
  rosa: [[0, 13, 'town', [26.8, 24.4]], [13, 24, 'town', [18.6, 26.4]]],
  pura: [[0, 13, 'town', [28.1, 24.4]], [13, 15.5, 'none'], [15.5, 24, 'town', [28.1, 24.4]]],
  yago: [[0, 24, 'town', [24.6, 30.3]]],
};
function moveNpc(n, scene, at, dir) { const [sc, [x, y]] = place(scene, at); Object.assign(n, { scene: sc, x, y }); if (dir) n.dir = dir; }
function rutinas(force) {
  if (F.campana) return; const h = hourNow();
  for (const n of PEOPLE) { const r = RUTINA[n.id]; if (!r) continue; const k = r.findIndex(([a, b]) => h >= a && h < b); if (k === n.slot) continue;
    const [, , scene, at] = r[k];
    if (scene === 'none') { if (force || n.scene !== G.scene || Math.hypot(n.x - G.x, n.y - G.y) > 400) { n.scene = 'none'; n.slot = k; } continue; }
    const [sc] = place(scene, at); if (!force && (n.scene === G.scene || sc === G.scene) && Math.hypot(n.x - G.x, n.y - G.y) < 400) continue; // nadie aparece ni desaparece delante tuyo
    moveNpc(n, scene, at); n.slot = k; }
}

// =====================================================================
// EL DÍA
// =====================================================================
const narr = (lines, then) => say({ name: '', sprite: 'grumete' }, { lines, done: then });
function npcAdd(id, sprite, name, scene, at, dir, extra = {}) { const [sc, [x, y]] = place(scene, at); const n = { id, sprite, name, scene: sc, x, y, dir, frame: 0, nextBark: 1e15, barks: [], greet: null, ...extra }; PEOPLE.push(n); return n; }
const P = id => PEOPLE.find(n => n.id === id);
function actoInit() {
  for (const k in F) delete F[k];
  yagoInit(); brinCaja(); faroYMarina(); rutinas(true);
  OBJS.push({ scene: 'town', x: HOYO[0] * T, y: HOYO[1] * T, label: 'Cavar', act: cavar });
  OBJS.push(...[{ scene: 'casa', at: [7.25, 4.1], label: 'Descansar', act: descansar }].map(o => { const [scene, [x, y]] = place(o.scene, o.at); return { ...o, scene, x, y }; }));
}
function descansar() {
  const h = hourNow(); if (h >= 16.5 || F.campana) return narr(['No tienes sueño. Y no es momento de dormir.']);
  narr(['Te tumbas un rato en la cama. Se oye el mar y, a lo lejos, a Corso cantando.'], () => { G.paused = true; timelapse(Math.min(17 * 60 - 10, G.minutes + 120), 2600, () => { G.paused = false; rutinas(true); guardarAuto(); }); });
}
let lastTick = 0;
function actoTick(now) {
  if (now - lastTick < 400) return; lastTick = now;
  rutinas(false);
  const y = P('yago'); if (y && y.scene === 'town' && !F.campana && !y.act && !y.goal && !G.paused && !G.talking && Math.random() < .55 && Math.hypot(y.x - G.x, y.y - G.y) < 500) { y.dir = 'right'; act(y, 'slash', { fps: 13 }); F.golpeMuneco = performance.now() + 260; }
  if (!F.campana && hourNow() >= 17) return campana();
  if (F.campana && !F.plaza && G.scene === 'town' && Math.hypot(G.x - 30 * T, G.y - 21 * T) < 6 * T) { F.plaza = true; plaza(); }
}
function campana() {
  F.campana = true; const fam = player.last; clearBubbles(); for (const n of PEOPLE) n.nextBark = 1e15;
  P('dorne').scene = 'none'; P('marla').slot = null;
  const spots = { lin: [34.6, 24.6, 'left'], rosa: [26, 25.2, 'right'], pura: [27, 25.6, 'right'], brin: [25.2, 23.4, 'right'], corso: [27.4, 24.2, 'up'], yago: [34.2, 25.8, 'left'] };
  for (const [id, [x, y, d]] of Object.entries(spots)) { const n = P(id); moveNpc(n, 'town', [x, y], d); n.chat = false; n.route = null; }
  const m = P('mar1'); m.route = null; moveNpc(m, 'town', [33.6, 18.6], 'down');
  npcAdd('dorneP', 'capitan', '"Garra" Dorne', 'town', [32.4, 22.8], 'left', { arma: 'colmillo_negro' });
  npcAdd('pirata', 'pirata', 'Pirata de Dorne', 'town', [27.4, 21.6], 'left', { arma: 'cimitarra', tira: true });
  npcAdd('pirata2', 'maton', 'Pirata de Dorne', 'town', [32.6, 21.4], 'right', { tira: true, arma: 'garrote' });
  for (const n of PEOPLE) if (n.scene === 'town' && ['lin', 'rosa', 'pura', 'brin', 'corso', 'yago'].includes(n.id)) later(300 + Math.random() * 900, () => emote(n, '!', 1400));
  narr(['Suena la campana del puerto. Una vez, dos, tres...', 'Alguien grita en la calle: «¡En la plaza! ¡Están levantando el ancla!»']);
}
function plaza() {
  const fam = player.last, d = P('dorneP');
  const opts = [];
  if (knows('La leyenda del ancla')) opts.push({ t: 'Si levantas el ancla, Kalé se hunde.', then: () => { F.vecinos = true; say(d, { lines: ['Krakaka... ¿Cuentos de viejas?', '(Pero los vecinos dan un paso al frente. Brin se arremanga.)'], done: corsoPiedra }); } });
  if (knows('La Marina espera refuerzos')) opts.push({ t: 'Los refuerzos de Loguetown están al llegar.', then: () => { F.prisa = true; say(d, { lines: ['¿Refuerzos? Entonces habrá que darse prisa.'], done: corsoPiedra }); } });
  if (knows('El cofre de mamá')) opts.push({ t: '¿Buscas lo que guarda mi madre?', then: () => { F.dorneCofre = true; learn(['familia', 'Le hablé del cofre a Dorne', 'Le pregunté a Dorne si buscaba lo que guarda mamá. Ahora sabe dónde buscar.']); say(d, { lines: ['(Dorne sonríe despacio.)', 'Así que lo tiene tu madre. Gracias, mocoso.'], done: corsoPiedra }); } });
  opts.push({ t: voz({ def: 'Vete de mi isla.', temerario: 'Vete de mi isla, Dorne. Ahora.', cauto: 'Por favor... deja el ancla.' }), then: () => say(d, { lines: [rasgo() === 'cauto' ? '¿Por favor? Krakaka. Qué educado.' : 'Krakaka. Tienes agallas.'], done: corsoPiedra }) });
  opts.push({ t: '(No decir nada.)', then: () => say(d, { lines: ['¿Nada? Mejor. Los mudos viven más.'], done: corsoPiedra }) });
  G.x = 30 * T; G.y = 24.2 * T; G.dir = 'up';
  say(d, { lines: [`Krakaka... Justo a quien quería ver. El cachorro de los ${fam}.`, 'Tu padre se llevó algo mío hace veinte años y lo escondió en esta isla de mala muerte.', 'Si no aparece, me llevo el ancla. Y a ver qué pasa con Kalé.'], opts });
}
function corsoPiedra() {
  const c = P('corso'), pi = P('pirata');
  bubble(c, '¡Deja en paz a mi hermano!', 2400); act(c, 'slash', { fps: 12 }); later(500, () => emote(P('dorneP'), '!', 1200));
  narr(['Corso le tira una piedra a Dorne. Le da en el sombrero.', 'El pirata de la cadena lo agarra del cuello de la camisa.'], () => {
    pi.tira = false; emote(c, '!'); moveNpc(pi, 'town', [28.2, 23.4], 'right'); moveNpc(c, 'town', [27.5, 23.6], 'right'); G.x = 30.2 * T; G.y = 23.4 * T; G.dir = 'left';
    say(P('dorneP'), { lines: ['Encárgate del mayor. Y no me lo rompas del todo: lo necesito para hablar.'], done: () => pelea({ kind: 'plaza', foe: pi, foeName: 'Pirata de Dorne', foeMax: 110, rounds: F.prisa ? 3 : 4, arma: S.arma }) }); });
}

// =====================================================================
// LA PELEA: instinto con pausas. Se congela en cada momento y eliges lo que te pide el cuerpo.
// Sirve para el duelo con Yago y para la plaza; los dos se ven: tajos, estocadas, golpes y caídas.
// =====================================================================
const OFICIO_GOLPE = { tirador: ['Una piedra, directa a la cara', 'agilidad', 18, true], cocinero: ['Volcarle encima la caja de pescado', 'fuerza', 20, true], carpintero: ['Un tablón suelto del puesto', 'fuerza', 28], medico: ['Un punto de presión en el cuello', 'intelecto', 16, true], navegante: ['Enredarle los pies con la cadena', 'iq', 14, true], combatiente: ['El golpe del puerto', 'fuerza', 34], musico: ['Un grito que le revienta los oídos', 'carisma', 10, true], arqueologo: ['Leer su postura y golpear donde falla', 'intelecto', 26] };
// lo que pide cada arma: texto, atributo, daño, aturde, esquiva
// lo que pide cada arma: texto, atributo, daño, aturde, esquiva, ajuste. Primero el tipo; si no, su familia.
const ARMA_GOLPE = { daga: ['Entrar corto y clavar', 'agilidad', 30, false, false, -.08], espada_corta: ['Una estocada corta y seca', 'agilidad', 24, false, false, .05], sable: ['Un sablazo de lado', 'agilidad', 26],
  mandoble: ['Un tajo de arriba abajo', 'fuerza', 32, false, false, -.05], estoque: ['Tres estocadas rápidas', 'agilidad', 22], katana: ['Un tajo limpio', 'agilidad', 28], cimitarra: ['Un corte en arco', 'fuerza', 27],
  hacha: ['Un hachazo al hombro', 'fuerza', 30, true], martillo: ['Un martillazo que aturde', 'fuerza', 30, true, false, -.04], lanza: ['Tenerlo a raya con la punta', 'iq', 22, false, true],
  arco: ['Una flecha antes de que se acerque', 'agilidad', 24, false, true], guadana: ['Un tajo curvo, de abajo arriba', 'fuerza', 30], baston: ['Un golpe seco con el palo', 'agilidad', 18, true] };
const FAMILIA_GOLPE = { corte: ['Un tajo limpio', 'agilidad', 26], golpe: ['Un golpe que rompe la guardia', 'fuerza', 30, true], asta: ['Tenerlo a raya con la punta', 'iq', 22, false, true], distancia: ['Disparar antes de que se acerque', 'agilidad', 24, false, true], fuego: ['Un disparo a quemarropa', 'agilidad', 38] };
const chance = (v, b = 0) => Math.max(.15, Math.min(.88, .42 + (v - 8) * .07 + b));
const riesgo = p => p >= .62 ? ['Seguro', 'ok'] : p >= .4 ? ['Arriesgado', 'mid'] : ['Muy difícil', 'hard'];
const tipoDe = id => id && arma(id) ? arma(id).tipo : 'punos';
function instinto() {
  const f = F.fight, st = S.st, top = Object.entries(S.of).sort((a, b) => b[1] - a[1])[0], of = top[1] > 0 ? top[0] : null, list = [], t = tipoDe(f.arma);
  const G0 = ARMA_GOLPE[t] || (TIPO[t] && FAMILIA_GOLPE[TIPO[t][2]]);
  if (G0 && TIPO[t][2] === 'fuego' && f.disparo) list.push({ id: 'culata', t: 'Golpear con la culata', p: chance(st.fuerza), dmg: 14, stun: true });
  else if (G0) { const [tx, s, dmg, stun, dodge, b = 0] = G0; list.push({ id: 'arma', t: tx, p: chance(st[s], b), dmg: dmg + Math.floor(st[s] / 2), stun, dodge, fuego: TIPO[t][2] === 'fuego' }); }
  else list.push({ id: 'golpe', t: 'Golpearlo', p: chance(st.fuerza), dmg: 20 + st.fuerza });
  list.push({ id: 'esquiva', t: 'Esquivar y responder', p: chance((st.agilidad + st.iq) / 2), dmg: 14, dodge: true });
  if (f.corso) list.push({ id: 'proteger', t: 'Ponerte delante de Corso', p: chance(st.voluntad, S.ax.corazon > 0 ? .15 : 0), protect: true });
  if (f.kind === 'plaza') { if (of) { const [tx, s, dmg, stun] = OFICIO_GOLPE[of]; list.push({ id: 'oficio', t: tx, p: chance(st[s], .06), dmg, stun }); } else list.push({ id: 'arena', t: 'Echarle arena a los ojos', p: chance(st.intelecto, .06), dmg: 6, stun: true }); }
  return list;
}
function pelea(o) {
  const C = Object.values(S.cuerpo || {}), meMax = 40 + S.st.resistencia * 6 - 5 * C.filter(e => e === 'herida').length - 2 * C.filter(e => e === 'tratada').length + (S.comido || 0); S.comido = 0; F.fight = { kind: o.kind, foe: o.foe, foeName: o.foeName, me: meMax, meMax, foeHP: o.foeMax, foeMax: o.foeMax, round: 0, rounds: o.rounds, corso: o.kind === 'plaza', protected: false, hard: 0, arma: o.arma, fin: o.fin };
  G.paused = true; G.arma0 = S.arma; S.arma = o.arma; G.dir = dirTo(G, o.foe); o.foe.dir = dirTo(o.foe, G);
  const ov = document.getElementById('overlays'), box = document.createElement('div'); box.className = 'fight glass'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Pelea'); ov.appendChild(box);
  document.getElementById('hud').classList.add('talking'); momento();
}
function fightUI(text, opts) {
  const f = F.fight, box = document.querySelector('.fight'), bar = (v, m, me) => `<i class="bar${me ? ' me' : ''}"><s style="width:${Math.max(0, v / m * 100)}%"></s></i>`;
  box.innerHTML = `<div class="bars"><div><b>${f.foeName}</b>${bar(f.foeHP, f.foeMax)}</div><div><b>${player.name}</b>${bar(f.me, f.meMax, true)}</div></div><p class="nar">${text}</p>${opts ? `<div class="ch">${opts.map((o, i) => { const [r, c] = riesgo(o.p); return `<button type="button" data-i="${i}"><kbd>${i + 1}</kbd>${o.t}<span class="risk ${c}">${r}</span></button>`; }).join('')}</div>` : '<span class="more">…</span>'}`;
  if (opts) { const bs = [...box.querySelectorAll('button')]; bs.forEach(b => b.onclick = () => elegir(opts[+b.dataset.i])); bs[0].focus(); keyHandler = e => { const n = +e.key; if (n >= 1 && n <= opts.length) elegir(opts[n - 1]); }; }
  else keyHandler = null;
}
function momento() { const f = F.fight; f.round++; fightUI(f.round === 1 ? (f.kind === 'duelo' ? 'Yago levanta el arma y sonríe. «Cuando quieras.»' : 'El pirata se te echa encima. El tiempo se estira: lo ves venir.') : 'Otra vez. Respiras. Decides.', instinto()); }
const later = (ms, fn) => setTimeout(fn, ms);
function golpeVisual(quien) { const f = F.fight, tg = quien === 'me' ? G : f.foe; if (tg) F.fx = { x: tg.x + (tg.dx || 0), y: tg.y - 26, t0: performance.now(), me: quien === 'me' }; const el = document.getElementById('game'); el.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-4px,2px)' }, { transform: 'translate(3px,-2px)' }, { transform: 'translate(0,0)' }], { duration: 220 });
  if (quien === 'me') { const fl = document.createElement('div'); fl.className = 'hitflash'; document.getElementById('overlays').appendChild(fl); later(380, () => fl.remove()); } }
// un paso hacia el otro y vuelta
function lunge(o, dx, ms = 180) { o.dx = dx; later(ms, () => o.dx = 0); }
const hacia = (a, b) => b.x > a.x ? 1 : -1;
function atacar(o, armaId, target) { act(o, golpeDe(armaId && arma(armaId)), { fps: 14 }); lunge(o, hacia(o, target) * 9, 260); }
function encaja(o) { act(o, 'hurt', { stop: 1, dur: 420, fps: 14 }); lunge(o, -hacia(o, o === G ? F.fight.foe : G) * 5, 300); }
function elegir(o) {
  const f = F.fight, foe = f.foe, ok = Math.random() < o.p; let stun = false, txt;
  keyHandler = null;
  if (o.protect) { if (ok) { f.protected = true; f.corso = false; const c = P('corso'); emote(c, '!'); walkTo(c, [26, 24.6], 110, n => n.dir = 'right'); lunge(G, -14, 500); txt = 'Te metes entre Corso y el pirata. Corso se suelta y corre hacia Brin.'; } else { lunge(G, -8); txt = 'Intentas llegar hasta Corso, pero el pirata te corta el paso.'; } }
  else { if (o.fuego) f.disparo = true; atacar(G, f.arma, foe);
    if (ok) { f.foeHP -= o.dmg; stun = !!o.stun; txt = { golpe: 'Le das de lleno. Se tambalea.', esquiva: 'Te agachas, el golpe te pasa por encima y respondes en las costillas.', arena: 'Le echas un puñado de arena a los ojos. Se queda ciego un momento.' }[o.id] || `${o.t}. Funciona.`; later(180, () => { encaja(foe); golpeVisual('foe'); }); }
    else { txt = { golpe: 'Lanzas el golpe, pero lo ve venir.', esquiva: 'Esquivas tarde.', arena: 'La arena se la lleva el viento.' }[o.id] || `${o.t}... pero no sale como esperabas.`; later(120, () => lunge(foe, hacia(foe, G) * -12, 320)); } }
  fightUI(txt);
  later(1300, () => {
    if (f.foeHP > 0 && F.vecinos && f.kind === 'plaza' && f.round === 2) { const b = P('brin'); f.foeHP -= 22; b.arma = 'remo'; walkTo(b, [foe.x / T - .9, foe.y / T + .2], 160, n => { n.dir = 'right'; act(n, 'thrust', { fps: 14 }); later(1400, () => n.arma = null); later(160, () => { encaja(foe); golpeVisual('foe'); }); });
      fightUI('Brin aparece por detrás y le rompe un remo en la espalda al pirata.'); return later(1600, contra.bind(null, stun, o, ok)); }
    contra(stun, o, ok);
  });
}
function contra(stun, o, ok) {
  const f = F.fight, foe = f.foe;
  if (f.foeHP <= 0) { act(foe, 'hurt', { hold: true, fps: 10 }); later(900, () => emote(foe, f.kind === 'duelo' ? '…' : 'zzz', 4000)); return finPelea(f.kind === 'duelo' ? 'Yago acaba sentado en el serrín, riéndose sin aire.' : 'El pirata cae de espaldas, sin aire. Nadie en la plaza se lo esperaba.'); }
  if (stun) { emote(foe, '?', 1200); fightUI(f.kind === 'duelo' ? 'Yago se queda un segundo sin saber dónde está. Ganas un respiro.' : 'El pirata no puede responder. Ganas un respiro.'); return later(1200, sigue); }
  atacar(foe, foe.arma, G);
  const hitP = .62 - (o.dodge && ok ? .35 : 0) - (f.kind === 'duelo' ? .08 : 0), dmg = (f.kind === 'duelo' ? 10 : 14) + Math.floor(Math.random() * 12) + (o.protect && ok ? 6 : 0);
  if (Math.random() < hitP) { f.me -= dmg; if (dmg >= 22 && f.kind === 'plaza') f.hard++; later(200, () => herir(dmg >= 22 && f.kind === 'plaza' ? 'cara' : pick(f.kind === 'duelo' ? ['brazos', 'torso', 'piernas'] : ['brazos', 'torso', 'piernas', 'cabeza']))); later(180, () => { encaja(G); golpeVisual('me'); }); fightUI(f.kind === 'duelo' ? (dmg >= 18 ? 'La madera te da en el hombro. Suena feo.' : 'Te roza el brazo. Escuece.') : dmg >= 22 ? 'El golpe te llega a la ceja. Ves blanco un instante.' : 'Te alcanza en el costado. Duele, pero sigues en pie.'); }
  else { later(150, () => lunge(G, hacia(G, foe) * -12, 320)); fightUI(f.kind === 'duelo' ? 'Yago golpea al aire. «¡Quieto!»' : 'El pirata golpea al aire.'); }
  later(1300, sigue);
}
function sigue() { const f = F.fight; if (f.me <= 0) { act(G, 'hurt', { hold: true, fps: 10 }); return finPelea(f.kind === 'duelo' ? 'Acabas en el suelo, mirando el cielo entre los andamios.' : 'Caes al suelo. Lo último que ves es la bota del pirata.', true); } if (f.round >= f.rounds) return finPelea(f.kind === 'duelo' ? 'Paráis los dos a la vez, sin aire. Ninguno quiere decir que está cansado.' : 'Seguís en pie los dos, jadeando. El pirata ya no sonríe.'); momento(); }
function finPelea(txt, caido) {
  const f = F.fight; f.won = f.foeHP <= 0; f.down = !!caido; fightUI(txt);
  if (f.hard) { S.trs.push('Cicatriz en la ceja'); learn(['yo', 'Una cicatriz', 'La pelea de la plaza me dejó una cicatriz en la ceja. Cada vez que la toco, me acuerdo de Corso.']); }
  later(1800, () => { document.querySelector('.fight').remove(); document.getElementById('hud').classList.remove('talking'); G.paused = false; S.arma = G.arma0; if (f.kind === 'plaza') { F.plazaFight = f; forastero(); } else { if (caido) later(600, () => G.act = null); f.fin(f); } });
}
// =====================================================================
// EL FORASTERO, EL HAKI Y LOS REFUERZOS
// =====================================================================
function forastero() {
  const d = P('dorneP'), f = F.plazaFight, fo = npcAdd('forastero', 'forastero', 'Forastero', 'town', [37.5, 22.4], 'left', { fijo: true });
  if (!f.down) G.act = null;
  say(d, { lines: ['Basta de juegos. Si quieres algo bien hecho...', '(Dorne da un paso hacia ti, con el garfio por delante.)'], done: () => { act(d, 'slash', { stop: 2, hold: true, fps: 10 });
    walkTo(fo, [35.4, 22.6], 55, () => { fo.dir = 'left'; for (const n of PEOPLE) if (n.scene === 'town' && n !== fo && Math.hypot(n.x - fo.x, n.y - fo.y) < 14 * T) { n.dir = dirTo(n, fo); } G.dir = dirTo(G, fo); for (const n of PEOPLE.filter(n => ['lin', 'rosa', 'pura', 'brin', 'corso'].includes(n.id))) emote(n, '?', 1400);
      say(fo, { lines: ['Dorne. Veinte años y sigues peleándote con críos.'], done: () => { d.act = null; haki(fo); G.paused = true; later(3100, () => (G.paused = false, narr(['Por un instante, todos en la plaza sienten un peso en el pecho, como si el aire se hubiera vuelto agua.', 'Casi todos caen redondos. Rosa, Doña Pura, Lin, los dos piratas.', 'Tú aguantas de rodillas. Corso tiembla, pero sigue en pie. Dorne también: es el único que no aparta la vista.'],
        () => { G.act = null; say(d, { lines: ['(Dorne da un paso atrás. Después otro.)', 'Tú... Krakaka. Así que eras tú. Esto no ha terminado.', '¡Arriba, gandules! ¡Nos vamos!'], done: dorneSeVa }); }))); } }); }); } });
}
// Haki del rey: una onda que sale del forastero; el aire se oscurece, rayos negros con filo rojo; la plaza cae
const HAKI_CARGA = .6;
function haki(fo) {
  F.haki = { t0: performance.now(), x: fo.x, y: fo.y - 30, hx: fo.x, hy: fo.y }; const R = HAKI_CARGA * 1000;
  const el = document.getElementById('game');
  el.animate([{ filter: 'none' }, { filter: 'brightness(.9) contrast(1.15)', offset: .2 }, { filter: 'grayscale(.95) contrast(1.7) brightness(.75)', offset: .24 }, { filter: 'grayscale(.7) contrast(1.35) brightness(.85)', offset: .7 }, { filter: 'none' }], { duration: 2800, easing: 'ease-out' });
  later(R, () => el.animate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => ({ transform: k % 9 ? `translate(${(k % 2 ? -1 : 1) * (7 - k * .7)}px,${(k % 3 - 1) * 3}px)` : 'translate(0,0)' })), { duration: 800 }));
  later(R, () => { emote(G, '!!', 2000); later(200, () => act(G, 'hurt', { stop: 3, hold: true, fps: 8 })); });
  for (const n of PEOPLE) { if (n === fo || n.scene !== 'town' || Math.hypot(n.x - fo.x, n.y - fo.y) > 16 * T) continue; const d = R + 60 + Math.random() * 340;
    if (n.id === 'dorneP') { later(d, () => { emote(n, '!!', 1800); lunge(n, -hacia(n, fo) * 6, 900); }); continue; }
    if (n.id === 'corso') { later(d, () => { emote(n, '!', 2400); const t0 = performance.now(), sh = setInterval(() => { n.dx = Math.round(Math.sin((performance.now() - t0) / 30)); if (performance.now() - t0 > 2400) { clearInterval(sh); n.dx = 0; } }, 30); }); continue; }
    if (n.id === 'pirata' && F.plazaFight && F.plazaFight.won) continue;
    later(d, () => emote(n, '!', 600)); later(d + 380, () => { n.desmayado = true; act(n, 'hurt', { hold: true, fps: 11 }); }); later(d + 2300, () => n.desmayado && emote(n, 'zzz', 5000)); }
  later(R + 2600, () => F.haki = null);
}
function despertar() { for (const n of PEOPLE) if (n.desmayado) { const d = Math.random() * 1400; later(d, () => { n.act = null; n.desmayado = false; emote(n, '?', 1600); }); } }
function dorneSeVa() {
  const d = P('dorneP'); for (const id of ['pirata', 'pirata2']) { const n = P(id); n.act = null; n.desmayado = false; emote(n, '…', 1500); }
  d.dir = 'left'; walkTo(d, [22, 22.2], 75, n => n.scene = 'none'); later(500, () => { walkTo(P('pirata'), [21.5, 22.6], 85, n => n.scene = 'none'); walkTo(P('pirata2'), [21, 21.8], 85, n => n.scene = 'none'); });
  despertar(); later(1600, () => { const fo = P('forastero'), f = F.plazaFight; G.dir = dirTo(G, fo); fo.dir = dirTo(fo, G);
    say(fo, { lines: [f.protected ? 'Protegiste al pequeño. Bien hecho.' : 'Tienes buenos puños. Te falta saber cuándo usarlos.', 'Zarpo esta noche, con la marea. Hay sitio para uno más. Te espero en la punta del muelle.', 'No preguntes adónde.'], done: () => {
      narr(['En el muelle suena una corneta. Un barco de la Marina acaba de amarrar.'], () => say(fo, { lines: ['La Marina. Mejor que no me vean por aquí.', '(Se cala la capucha y se va calle abajo, sin prisa.)'], done: () => { walkTo(fo, [20, 22.4], 70, n => n.scene = 'none'); later(1400, refuerzos); } })); } }); });
}
function refuerzos() {
  F.refuerzos = true; const f = F.plazaFight, te = npcAdd('teniente', 'teniente', 'Teniente Breda Nisi', 'town', [42.5, 15], 'down', { arma: 'estoque' });
  const m2 = npcAdd('mar2', 'marine', 'Marine', 'town', [41.8, 14.2], 'down', { arma: 'mosquete' }), m3 = npcAdd('mar3', 'marine', 'Marine', 'town', [43.2, 14.2], 'down', { arma: 'reglamento' });
  for (const n of PEOPLE) if (n.scene === 'town' && Math.hypot(n.x - 30 * T, n.y - 22 * T) < 14 * T && n !== te) later(600, () => { n.dir = 'right'; });
  walkTo(m2, [42.5, 21.4], 80, () => walkTo(m2, [36, 22.4], 80, n => n.dir = 'left')); walkTo(m3, [43.2, 21.4], 80, () => walkTo(m3, [36, 24], 80, n => n.dir = 'left'));
  walkTo(te, [42.5, 22.4], 80, () => walkTo(te, [33.2, 23.4], 80, n => { n.dir = 'left'; G.dir = 'right';
    say(te, { lines: ['Teniente Breda Nisi, de Loguetown. Por lo que veo, llegamos tarde.', f.protected ? 'Te pusiste delante de un pirata para proteger a un crío. Eso no se enseña en ninguna academia.' : f.won ? 'Tumbaste a uno de los hombres de Dorne. No está nada mal.' : 'Aguantaste contra uno de los hombres de Dorne. No está mal.', 'Mi barco sale esta noche. Si quieres entrar en la Marina, búscame frente al destacamento.'], done: atardecer }); }));
}

// =====================================================================
// LA MAÑANA: Yago entrena en el astillero y te reta; Brin te cuenta lo de la caja; la roca de la ballena
// =====================================================================
const ROCA = [49.2, 9.9], HOYO = [50.4, 10.9];
const ESTILOS = [['sable', 'El sable'], ['mandoble', 'El mandoble'], ['espada_corta', 'La espada corta'], ['martillo', 'El martillo'], ['hacha', 'El hacha'], ['lanza', 'La lanza'], ['arco', 'El arco'], ['daga', 'La daga'], ['punos', 'Con los puños']];
const CON = { sable: 'un sable', mandoble: 'un mandoble', espada_corta: 'una espada corta', martillo: 'un martillo', hacha: 'un hacha', lanza: 'una lanza', arco: 'un arco', daga: 'una daga' };
function rocaBallena() { const [c, g] = mkCanvas(96, 56), O = '#1e1a20';
  g.fillStyle = 'rgba(20,20,30,.25)'; g.beginPath(); g.ellipse(46, 50, 44, 6, 0, 0, 7); g.fill();
  g.fillStyle = O; g.beginPath(); g.moveTo(6, 50); g.quadraticCurveTo(10, 14, 46, 12); g.quadraticCurveTo(74, 12, 80, 34); g.lineTo(92, 20); g.lineTo(90, 40); g.lineTo(84, 50); g.closePath(); g.fill();
  g.fillStyle = '#7a7a84'; g.beginPath(); g.moveTo(8, 49); g.quadraticCurveTo(12, 16, 46, 14); g.quadraticCurveTo(72, 14, 78, 35); g.lineTo(89, 24); g.lineTo(88, 40); g.lineTo(83, 49); g.closePath(); g.fill();
  g.fillStyle = '#9a9aa4'; g.beginPath(); g.moveTo(14, 36); g.quadraticCurveTo(20, 18, 46, 17); g.quadraticCurveTo(30, 22, 18, 40); g.fill();
  g.fillStyle = '#5a5a64'; g.fillRect(12, 44, 70, 5); g.fillStyle = O; g.fillRect(24, 30, 3, 3); g.fillStyle = '#4a7a3a'; g.fillRect(30, 15, 10, 2); g.fillRect(60, 46, 12, 2); g.fillStyle = '#e8e8f0'; g.fillRect(24, 30, 1, 1);
  return { canvas: c, x: ROCA[0] * T - 46, y: ROCA[1] * T - 50, key: ROCA[1] * T }; }
function munecoPractica(x, y) { const [c, g] = mkCanvas(32, 60), O = '#1e1a20';
  g.fillStyle = O; g.fillRect(14, 14, 5, 46); g.fillStyle = '#7a5030'; g.fillRect(15, 14, 3, 46); g.fillStyle = O; g.fillRect(5, 22, 23, 4); g.fillStyle = '#8a6038'; g.fillRect(6, 23, 21, 2);
  g.fillStyle = O; g.fillRect(8, 3, 17, 22); g.fillStyle = '#d8b878'; g.fillRect(9, 4, 15, 20); g.fillStyle = '#b8984a'; for (let k = 0; k < 4; k++) g.fillRect(9, 7 + k * 5, 15, 1); g.fillStyle = '#c83a3a'; g.fillRect(14, 10, 5, 5); g.fillStyle = '#fff6dc'; g.fillRect(16, 12, 1, 1);
  return { canvas: c, x: x - 16, y: y - 58, key: y, muneco: true }; }
function yagoInit() {
  const y = npcAdd('yago', 'hermano', 'Yago', 'town', [24.6, 30.3], 'right', { arma: 'madera_sable', nextBark: performance.now() + 9000,
    barks: { dia: ['¡Ha! ¡Ha!', 'Otra vez. Más rápido.', 'Mi padre dice que soy cabezota. Yo digo constante.'], tarde: ['Una más y lo dejo... Una más.'], noche: [''] },
    fases: { ancla: [''], despedida: ['¿Te vas de verdad? Llévate lo que aprendiste en el astillero.', 'La próxima vez que nos veamos, te gano.'] },
    greet: c => F.duelo ? pick(['¿Otra vez por aquí?', 'Todavía me duele el hombro, ¿eh?']) : c.n === 0 ? `¡Eh, ${player.name}! ¿Vienes a mirar o a sudar?` : pick(['¿Te lo has pensado?', 'El muñeco no se queja, pero tampoco aprende.']),
    first: L('gente', 'Yago', 'El hijo del carpintero del astillero. Entrena todas las mañanas con armas de madera que talla su padre.'),
    topics: [
      { id: 'que', once: true, ask: '¿Qué haces?', a: () => ['Entreno. Algún día me iré en un barco de verdad, y en el mar no hay segundas oportunidades.', 'Mi padre talla las armas. De todas las que hay: katanas, lanzas, hachas... Hasta un estoque, que es una aguja con pretensiones.'] },
      { id: 'duelo', need: () => !F.duelo, ask: { def: '¿Un combate?', temerario: 'Pelea conmigo. Ahora.', cauto: '¿Me enseñas un poco?' },
        a: () => ['¡Eso! Elige con qué. Tengo de madera de todo.'] },
      { id: 'otro', hideAfter: 1, need: () => F.duelo, ask: '¿La revancha?', a: () => ['Hoy no, que me duele hasta la sombra. Mañana.', '(Se ríe.) Si sigues en Kalé mañana.'] },
    ] });
  WORLD.sprites.push(munecoPractica(25.9 * T, 30.3 * T), rocaBallena()); WORLD.blocks.push([25.9 * T - 6, 30.3 * T - 8, 12, 10], [ROCA[0] * T - 40, ROCA[1] * T - 16, 80, 18]);
  OBJS.push({ scene: 'town', x: ROCA[0] * T, y: ROCA[1] * T + 6, label: 'Mirar', text: 'Una roca gris con forma de ballena: la joroba, la cola levantada, hasta un ojo hecho por un agujero. Los críos de Kalé la llaman la Vieja.' });
  return y;
}
// elegir arma para el duelo (al preguntar «¿Un combate?»)
function duelChoose(t, i) {
  const tp = topicsOf(t.npc)[i]; if (!tp || t.npc.id !== 'yago' || tp.id !== 'duelo') return false;
  S.asked.yago.duelo = 1;
  G.talking = { npc: t.npc, conv: { lines: ['¡Eso! Elige con qué. Tengo de madera de todo.'], opts: ESTILOS.map(([k, n]) => ({ t: n, then: () => duelo(k) })) }, i: 0 }; renderTalk(); return true;
}
function duelo(tipo) {
  const y = P('yago'); F.armaTipo = tipo; if (tipo !== 'punos') { S.armaDuelo = 'madera_' + tipo; }
  const linea = { sable: 'El sable. Rápido y con mala leche, como los piratas de los cuentos.', mandoble: '¿El mandoble? Vas a necesitar las dos manos y algo de suerte.', espada_corta: 'Espada corta. La de los marines. Seria, ¿eh?', martillo: 'Martillo. Mi padre aprobaría: con eso se hacen barcos.', hacha: 'El hacha. Mi padre dice que los del hacha piensan después.', lanza: 'Lanza. Vas a querer tenerme lejos, ¿eh?', arco: '¿Arco? Flechas sin punta, que no quiero un ojo menos.', daga: 'Daga. Hay que tener valor para pelear tan cerca.', punos: 'Con los puños. Bueno, pues yo también.' }[tipo];
  if (tipo === 'punos') y.armaDuelo = null; else y.armaDuelo = 'madera_' + (tipo === 'punos' ? 'sable' : tipo);
  say(y, { lines: [linea, tipo === 'punos' ? '(Yago deja su espada de madera apoyada en el muñeco.)' : '(Te lanza un arma de madera. La atrapas al vuelo.)', 'A tres asaltos. El que acabe en el suelo invita a pan.'], done: () => {
    G.x = 23.2 * T; G.y = 30.3 * T; G.dir = 'right'; y.x = 24.8 * T; y.y = 30.3 * T; y.dir = 'left'; if (tipo !== 'punos') y.arma = y.armaDuelo; else y.arma = null;
    pelea({ kind: 'duelo', foe: y, foeName: 'Yago', foeMax: 70, rounds: 3, arma: tipo === 'punos' ? null : 'madera_' + tipo, fin: finDuelo }); } });
}
function finDuelo(f) {
  const y = P('yago'); F.duelo = true; later(3000, guardarAuto); y.arma = 'madera_sable'; const won = f.won, tipo = F.armaTipo;
  learn(['yo', 'El duelo del astillero', `Peleé con Yago en el astillero ${tipo === 'punos' ? 'a puñetazo limpio' : 'con ' + CON[tipo] + ' de madera'}. ${won ? 'Gané.' : f.down ? 'Acabé en el suelo.' : 'Quedamos en tablas.'}`]);
  later(500, () => { y.act = null; y.emo = null; G.act = null; y.dir = dirTo(y, G);
    say(y, { lines: [won ? '(Yago se levanta frotándose las costillas.) Vale, vale. Invito yo al pan.' : f.down ? '(Yago te tiende la mano para levantarte.) No está mal. Para ser la primera vez.' : '(Yago jadea.) Tablas. Odio las tablas.',
      'Oye... peleas como si ya hubieras tenido un arma en la mano. ¿Quién te enseñó?', '¿Nadie? Pues el viejo Brin siempre dice que tu padre peleaba igual. Pregúntale a él.'],
      learn: [['familia', 'Papá peleaba', 'Yago dice que el viejo Brin cuenta que papá peleaba igual que yo.']] }); });
}
// el faro abre de día y el destacamento deja ver la sala de guardia; el catalejo de Gaspar espera en la playa
function faroYMarina() {
  const o = (scene, at, label, extra) => { const [sc, [x, y]] = place(scene, at); OBJS.push({ scene: sc, x, y, label, ...extra }); };
  o('faro', [5.35, 5.1], 'Leer', { act: () => narr(['El diario del farero, abierto por la última página escrita. La letra tiembla.', '«Invierno. Esta noche ha vuelto la medusa. Un hombre de la isla ha subido a su barco por su propio pie.»', '«Le he visto la cara a la luz del faro. No lo pondré aquí. Que lo cuente él, si vuelve.»'], () => learn(['kale', 'El diario del farero', 'El farero escribió que la noche de la medusa, hace veinte años, un hombre de Kalé subió a ese barco por su propio pie. No quiso poner su nombre.'])) });
  o('faro', [1.45, 2.9], 'Mirar', { text: 'Libros de mareas, cartas de estrellas, un tratado de nudos. Uno, sin título, habla de islas que «se borran de los mapas cuando alguien paga por ello».', learn: ['kale', 'Islas que se borran', 'En el faro hay un libro sin título sobre islas que se borran de los mapas cuando alguien paga por ello.'] });
  o('marina', [8.3, 4.9], 'Leer', { cartel: 'dorne', learn: ['rumores', 'Dorne tiene recompensa', 'El tablón de la Marina ofrece 8.000.000 de berries por «Garra» Dorne.'] });
  o('town', [24, 38.3], 'Mirar', { act: () => { if (F.catalejo) return narr(['Arena, conchas y el hoyo donde estaba el catalejo.']); F.catalejo = true; darObjeto('catalejo'); narr([F.catalejoPerdido ? 'Medio enterrado en la arena, junto a la grada: el catalejo de Gaspar.' : 'Algo brilla medio enterrado en la arena: un catalejo viejo, con una G grabada.']); } });
  npcAdd('sargento', 'sargento', 'Sargento Bruno Vela', 'marina', [6, 5.05], 'down', { arma: 'reglamento', nextBark: performance.now() + 8000,
    barks: { dia: ['Siguiente.', 'Esto no es una taberna.'], tarde: ['Firmes, que viene el capitán.'], noche: [''] }, fases: { despedida: ['Vaya día. Vaya día.'] },
    greet: c => c.n === 0 ? 'Destacamento de Kalé. Si vienes a denunciar algo, habla claro y rápido.' : pick(['¿Otra vez tú?', 'Dime.']),
    first: L('gente', 'Sargento Bruno Vela', 'El sargento del destacamento. Gorra con banda dorada y cara de no haber dormido en diez años.'),
    topics: [
      { id: 'galones', once: true, ask: '¿Qué significan los galones?', a: () => ['(Se señala la gorra.) Banda azul, marinero. Banda dorada y charreteras, sargento.', 'Los oficiales llevan el abrigo de la Justicia sobre los hombros. Teniente, capitán, comodoro... y más arriba, gente que tú y yo no vamos a ver nunca.'], learn: L('rumores', 'Los rangos de la Marina', 'Banda azul en la gorra, marinero. Banda dorada y charreteras, sargento. Los oficiales llevan el abrigo de la Justicia sobre los hombros.') },
      { id: 'entrar', once: true, ask: { def: '¿Cómo se entra en la Marina?', temerario: 'Quiero ser marine. ¿Dónde firmo?' }, a: () => ['Con dieciocho años y ganas de obedecer. Tú tienes una de las dos.', 'Si de verdad quieres, el destacamento de Loguetown recluta. Pregunta por un oficial, no por mí.'] },
      { id: 'dorne', once: true, need: () => !F.campana, ask: '¿Por qué no detenéis a Dorne?', a: () => ['¿Con seis hombres y un cañón oxidado? Esperamos refuerzos de Loguetown.', 'Y hasta entonces, nadie hace nada raro. ¿Entendido?'], learn: L('rumores', 'La Marina espera refuerzos', 'El destacamento espera refuerzos de Loguetown antes de enfrentarse a Dorne.') } ] });
  npcAdd('capitanm', 'capitanm', 'Capitán Oren Malva', 'marina', [10.6, 5.4], 'left', { nextBark: performance.now() + 14000,
    barks: { dia: ['(Repasa un informe sin leerlo.)', 'Seis hombres. Seis.'], tarde: ['¿Dónde están esos refuerzos?'], noche: [''] }, fases: { despedida: ['La teniente Nisi ha hecho en una tarde lo que yo no hice en un año.'] },
    greet: c => c.n === 0 ? 'No tengo tiempo para chiquillos. ¿Qué quieres?' : 'Sé breve.',
    first: L('gente', 'Capitán Oren Malva', 'El capitán del destacamento de Kalé. Abrigo blanco sobre los hombros, charreteras doradas y muchas ojeras.'),
    topics: [{ id: 'kale', once: true, ask: '¿Por qué hay un destacamento en una isla tan pequeña?', a: () => ['(Te mira un buen rato.) Buena pregunta. Me la hago todos los días.', 'Órdenes de arriba. Hace veinte años alguien decidió que Kalé necesitaba vigilancia. Nadie me dijo de qué.'], learn: L('kale', 'Vigilancia desde hace veinte años', 'El capitán Malva dice que el destacamento existe porque hace veinte años alguien de arriba decidió vigilar Kalé. No sabe de qué.') }] });
}
// lo que Brin sabe de la caja (se suma a sus temas al empezar)
function brinCaja() {
  const b = P('brin'); b.topics.unshift({ id: 'caja', once: true, need: () => knows('Papá peleaba'), ask: { def: 'Yago dice que mi padre peleaba como yo.', temerario: 'Brin, ¿cómo peleaba mi padre?' },
    a: () => ['(Brin deja la caña en el suelo, muy despacio.)', 'Así que ya ha llegado el día. Tu padre me hizo jurar una cosa antes de irse.', 'Enterró una caja junto a la Vieja, la roca con forma de ballena que hay de camino al faro.', '«Cuando el crío agarre un arma, que sea la mía.» Eso dijo. Y que no se lo contara a tu madre.', 'Ve. Y no le digas a Marla que te lo he dicho yo.'],
    learn: L('familia', 'La caja de papá', 'Brin dice que papá enterró una caja junto a la Vieja, la roca con forma de ballena de camino al faro.') });
}
function cavar() {
  if (!knows('La caja de papá')) return narr(['Tierra removida hace mucho. No hay nada que ver... ¿o sí?']);
  if (F.caja) return narr(['El hoyo donde estaba la caja de tu padre.']);
  G.dir = 'up'; act(G, 'thrust', { fps: 8, dur: 1600 });
  later(900, () => narr(['Cavas con las manos al lado de la Vieja. A un palmo, la tierra suena a madera.', 'Una caja pequeña, envuelta en lona encerada. Dentro hay un arma vieja, una brújula y una nota doblada.'], () => {
    F.caja = true; const tipo = F.armaTipo && F.armaTipo !== 'punos' ? F.armaTipo : 'daga', id = 'padre_' + tipo;
    darObjeto(id); darObjeto('brujula'); darObjeto('nota'); S.arma = id;
    later(4000, guardarAuto); learn(['familia', 'El arma de papá', `En la caja había ${arma(id).n}, el arma de papá. ${F.armaTipo === 'punos' ? 'Una daga: dice Brin que no hay puño que no mejore con una.' : 'La misma que elegí con Yago, como si lo hubiera sabido.'}`]);
    learn(['familia', 'La brújula de papá', 'Estaba en la caja. No apunta al norte: tiembla y señala adonde tengo que ir.']);
    const o = OBJS.find(o => o.label === 'Cavar'); if (o) o.label = 'Mirar';
    later(3600, () => !G.talking && bubble({ x: G.x, y: G.y, scene: G.scene }, 'C para sacar la brújula', 3200)); }));
}
// adónde apunta la brújula: siempre hacia lo siguiente que importa
function objetivo() {
  if (F.invitacion) { const f = P('forastero'); return f && f.scene === 'town' ? { scene: 'town', x: f.x, y: f.y } : null; }
  if (F.campana && !F.plaza) return { scene: 'town', x: 30 * T, y: 22.5 * T };
  if (F.campana) return null;
  if (knows('La caja de papá') && !F.caja) return { scene: 'town', x: HOYO[0] * T, y: HOYO[1] * T };
  return { scene: 'town', x: 30 * T, y: 22.5 * T }; // la aguja se queda mirando el ancla de la plaza
}

function atardecer() {
  F.invitacion = true; G.paused = true; timelapse(Math.max(G.minutes, 18.5 * 60), 5200, () => { G.paused = false; guardarAuto(); narr(['El sol ya toca el mar. Tienes hasta esta noche para decidir.', 'El forastero espera en la punta del muelle. La teniente, frente al destacamento.']); }); atardecerEstado();
}
function atardecerEstado() {
  for (const n of PEOPLE) n.nextBark = performance.now() + 9000 + Math.random() * 8000;
  for (const [id, at] of [['mar2', [9, 4.4]], ['mar3', [16, 9]]]) { const n = P(id); if (n) { n.goal = null; moveNpc(n, 'gaviota:cubierta', at, 'down'); n.greet = () => pick(['Sin órdenes de la teniente, nada.', '¿Vienes a alistarte? Habla con la teniente.']); n.topics = []; } }
  learn(['gente', 'El forastero', 'Encapuchado, de negro. No le vi la cara. Dorne retrocedió solo con verlo. Dice que zarpa esta noche y que hay sitio para mí.']);
  learn(['gente', 'Teniente Breda Nisi', 'Oficial de la Marina de Loguetown. Me ofreció alistarme. Su barco sale esta noche.']);
  const fo0 = P('forastero'); fo0.fijo = false; moveNpc(fo0, 'town', [9.6, 21.9], 'left'); moveNpc(P('teniente'), 'town', [44.5, 14.6], 'down');
  moveNpc(P('corso'), 'casa', [10.8, 4.9], 'left'); moveNpc(P('marla'), 'casa', [2.6, 8.4], 'right');
  for (const [id, at] of [['lin', [31.6, 23.8]], ['rosa', [26.8, 24.4]], ['pura', [28.1, 24.4]], ['brin', [3.2, 24.6]], ['yago', [24.6, 30.3]]]) { const n = P(id); n.act = null; n.emo = null; moveNpc(n, 'town', at); }
  const FR = { lin: ['Una isla sin nombre, un ancla que nadie puede mover... y ahora esto.', 'Tengo que apuntar todo lo de hoy antes de que se me olvide.'], rosa: ['Todavía me tiemblan las piernas.', '¿Quién era ese hombre de la capucha?'], pura: ['En mis tiempos esto no pasaba. Bueno... una vez sí.', 'Me desmayé como una jovencita, qué vergüenza.'],
    brin: ['Ese de la capucha... Juraría que lo conozco.', 'Esta noche el mar está demasiado quieto.'], marla: ['...', '(Marla dobla la misma camisa por tercera vez.)'], corso: ['¿De verdad te vas a ir?', 'Si te vas, ¿quién me va a enseñar a pelear?'], mar1: ['Menudo día. Y yo de guardia.'], mara: ['Hoy invita la casa. Por si acaso es la última.'], gaspar: ['Hoy cierro antes. No quiero más sustos.'], medico: ['Media plaza ha pasado por aquí con chichones.'], nell: ['¡Dicen que te pegaste con un pirata!'] };
  for (const [id, l] of Object.entries(FR)) { const n = P(id); if (n) n.fases = { ...(n.fases || {}), despedida: l }; }
  const lin = P('lin'); lin.greet = () => pick(['Después de lo de hoy, esa ancla me interesa todavía más.', '¿Estás bien? Te vi de rodillas.']);
  const fam = player.last, fo = P('forastero'), te = P('teniente');
  fo.greet = () => pick(['La marea no espera.', '¿Ya lo has decidido?']); fo.barks = ['...'];
  fo.topics = [{ id: 'quien', once: true, ask: '¿Quién eres?', a: () => ['Alguien que conoció a tu padre. Con eso basta, por ahora.'], learn: L('familia', 'El forastero conoció a papá', 'El forastero dice que conoció a mi padre.') },
    { id: 'vamos', ask: 'Me voy contigo.', a: () => ['Bien. Despídete de quien tengas que despedirte. Cuando subas, no hay vuelta atrás.'], aff: () => 0 }];
  te.greet = () => pick(['¿Y bien?', 'El barco no esperará toda la noche.']); te.barks = ['...'];
  te.topics = [{ id: 'marina', once: true, ask: '¿Qué es la Marina para usted?', a: () => ['Orden. Y a veces justicia, cuando las dos coinciden.', 'Cuando no coinciden, uno tiene que elegir. Esa parte no sale en los carteles.'] },
    { id: 'alistar', ask: 'Quiero alistarme.', a: () => ['Bien. Despídete de tu familia. A medianoche soltamos amarras.'] }];
  const marla = P('marla'), corso = P('corso');
  marla.topics = [{ id: 'adios', once: true, ask: 'Mamá... me voy de Kalé. Esta noche.', a: () => {
    const lines = []; if (F.dorneCofre) lines.push('Dorne sabe lo del cofre, ¿verdad? Lo he visto en tu cara.');
    if (tiene('brujula')) lines.push('(Marla ve la brújula asomando de tu bolsa y se queda quieta.)', 'Así que Brin te lo ha contado. Esa brújula... él decía que apunta adonde está él. Nunca le creí.');
    if (aff('marla') >= 1 || knows('Mamá conoce a Dorne')) { F.retrato = true; later(200, () => darObjeto('retrato')); learn(['familia', 'El retrato de papá', 'Mamá me dio la imagen que faltaba en el marco de su cómoda. Papá, joven, riéndose en un muelle. Tiene mi cara.']);
      return [...lines, '(Marla va a su cuarto y vuelve con un papel doblado en la mano.)', 'La saqué del marco el día que se fue. No soportaba verlo.', 'Llévatela tú. Para que sepas a quién buscas.', 'Vuelve. ¿Me oyes? Vuelve.']; }
    return [...lines, '(Marla te abraza muy fuerte y tarda en soltarte.)', 'Ya sabía que este día iba a llegar.', 'Vuelve. ¿Me oyes? Vuelve.']; } }, ...marla.topics.filter(t => t.id === 'papa')];
  marla.greet = () => '(Marla tiene los ojos rojos.) Me lo ha contado todo Corso. Todo.';
  corso.topics = [{ id: 'adios', once: true, ask: 'Corso, me voy.', a: () => { corso.fases.despedida = ['(Corso hace como que dibuja, pero no dibuja nada.)', '...']; corso.nextBark = performance.now() + 20000; return asked('corso', 'prometo') ? ['¿Te vas? ¿Sin mí?', '...Lo prometiste. Me llevarás. Algún día.', 'Hasta entonces, cuido yo de mamá.'] : ['¿Te vas?', '(Corso se muerde el labio.) Escríbeme. Aunque sea una carta.']; } }];
  corso.greet = () => F.plazaFight.protected ? '¡Le pegaste a un pirata! ¡A un pirata de verdad!' : '¿Estás bien? Tienes sangre en la ceja.';
}
// confirmación al elegir camino: el juego pregunta aquí antes de responder un tema
function actoChoose(t, i) {
  if (t.conv.opts) return false; if (duelChoose(t, i)) return true; const tp = topicsOf(t.npc)[i];
  if (!tp || !((t.npc.id === 'forastero' && tp.id === 'vamos') || (t.npc.id === 'teniente' && tp.id === 'alistar'))) return false;
  const path = t.npc.id === 'forastero' ? 'pirata' : 'marine';
  G.talking = { npc: t.npc, conv: { lines: [path === 'pirata' ? '¿Seguro? Cuando subas, no hay vuelta atrás.' : '¿Seguro? Una vez firmes, eres de la Marina.'], opts: [{ t: path === 'pirata' ? 'Sí. Zarpemos.' : 'Sí. Quiero alistarme.', then: () => final(path) }, { t: 'Todavía no.', then: () => { } }] }, i: 0 };
  renderTalk(); return true;
}
// =====================================================================
// LA PARTIDA
// =====================================================================
function final(path) {
  const fam = player.last, f = F.fight || {};
  learn(['yo', 'Me fui de Kalé', path === 'pirata' ? 'Zarpé de noche con el forastero de la capucha, sin saber adónde.' : 'Me alisté en la Marina con la teniente Breda Nisi. Rumbo a Loguetown.']);
  const lines = path === 'pirata'
    ? ['Esa noche, Kalé se hizo pequeña detrás de ti.', asked('corso', 'prometo') ? 'Corso te despidió desde el muelle hasta que ya no pudo verte. Le habías hecho una promesa.' : 'Corso te despidió desde el muelle hasta que ya no pudo verte.', tiene('brujula') ? 'En el bolsillo llevabas la brújula de tu padre. La aguja no apuntaba al norte: apuntaba mar adentro.' : 'El forastero no dijo una palabra en toda la noche.']
    : ['Esa noche subiste a un barco de la Marina rumbo a Loguetown.', asked('corso', 'prometo') ? 'Corso no lloró. Te había hecho prometer que volverías a por él.' : 'Corso te despidió desde el muelle con la gorra de un marine que le habían regalado.', tiene('retrato') ? 'En el bolsillo llevabas el retrato de tu padre. Alguien en la Marina tenía que conocer esa cara.' : 'La teniente Nisi te miró una vez y asintió.'];
  G.paused = true; G.talking = null; renderTalk(); keyHandler = null;
  const ov = document.createElement('div'); ov.className = 'tiza'; ov.innerHTML = `<canvas width="640" height="360" aria-hidden="true"></canvas><p class="on"></p><div class="fin" hidden><b>Fin del Acto 0</b><span>${fullName()} · ${path === 'pirata' ? 'Rumbo desconocido' : 'Rumbo a Loguetown'}</span><button type="button" class="btn" id="finmenu">Volver al menú</button></div>`;
  app.appendChild(ov); const c = ov.querySelector('canvas'), g = c.getContext('2d'), p = ov.querySelector('p'); let i = 0, t0 = performance.now();
  const barco = [tz.poly([[200, 220], [226, 254], [414, 254], [440, 220]], true), tz.line([320, 220], [320, 90]), tz.poly([[326, 100], [390, 112], [386, 200], [326, 206]], true), tz.circle(500, 80, 22, 22, 24), tz.wave(80, 270, 560, 6, 18), tz.wave(120, 292, 520, 5, 18), ...(path === 'pirata' ? [] : [tz.poly([[320, 90], [354, 92], [352, 76], [320, 76]])])];
  const frame = now => { if (!ov.isConnected) return; const prog = Math.min(1, (now - t0) / 2600); g.fillStyle = 'rgb(22,26,24)'; g.fillRect(0, 0, 640, 360); chalkDraw(g, barco, prog, 9);
    p.textContent = lines[Math.min(i, lines.length - 1)]; requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
  const nextLine = () => { i++; if (i >= lines.length) { p.remove(); ov.querySelector('.fin').hidden = false; ov.querySelector('#finmenu').focus(); } };
  ov.onclick = e => { if (e.target.id === 'finmenu') { ov.remove(); location.reload(); } else if (i < lines.length) nextLine(); };
  keyHandler = e => { if (['Enter', ' ', 'e', 'E'].includes(e.key) && i < lines.length) nextLine(); };
  cv.hidden = true; document.getElementById('hud').hidden = true;
}
// =====================================================================
// LO QUE SE DIBUJA EN EL MUNDO DURANTE EL ACTO
// =====================================================================
function actoDrawOver(g, [cx, cy], now, VW, VH) {
  // los piratas tiran de la cadena: se inclinan hacia atrás, a tirones, y el ancla suelta polvo
  const tc = now / 1000, ring = [30 * T - cx, 21 * T - 113 - cy];
  if (F.campana && !F.refuerzos) for (const id of ['pirata', 'pirata2']) { const n = P(id); if (!n || n.scene !== 'town' || !n.tira) continue; const s = n.x < 30 * T ? -1 : 1, tir = Math.max(0, Math.sin(tc * 3 + (s > 0 ? 1 : 0)));
    n.dir = s < 0 ? 'left' : 'right'; n.dx = Math.round(s * tir * 3); n.paso = true; n.frame = 1 + Math.floor(tc * 5 + (s > 0 ? 3 : 0)) % 8;
    drawChain(g, ring, [n.x + n.dx - cx - s * 8, n.y - 30 - cy], 10 - tir * 7, tc);
    if (tir > .9) { g.fillStyle = 'rgba(200,190,170,.5)'; for (let k = 0; k < 4; k++) g.fillRect(Math.round(30 * T - cx + s * (20 + k * 5) + Math.sin(tc * 20 + k) * 2), Math.round(21 * T - cy + 12 - k), 2, 2); } }
  else if (F.campana && P('pirata') && !P('pirata').tira && P('pirata').scene === 'town' && !F.refuerzos) drawChain(g, ring, [27.6 * T - cx, 21.9 * T - cy], 4, 0);
  // golpe: estrella de impacto y líneas de velocidad, 220 ms
  const fx = F.fx; if (fx && now - fx.t0 < 220) { const k = (now - fx.t0) / 220, x = fx.x - cx, y = fx.y - cy, r = 6 + k * 16; g.save(); g.globalAlpha = 1 - k;
    g.fillStyle = fx.me ? '#ff6a4a' : '#fff6dc'; g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = i % 2 ? r * .45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.fill();
    g.strokeStyle = '#2a1a12'; g.lineWidth = 1; g.stroke(); g.strokeStyle = '#fff6dc'; for (let i = 0; i < 6; i++) { const a = hash(i, fx.t0 | 0, 3) * 7; g.beginPath(); g.moveTo(x + Math.cos(a) * (r + 3), y + Math.sin(a) * (r + 3)); g.lineTo(x + Math.cos(a) * (r + 12), y + Math.sin(a) * (r + 12)); g.stroke(); } g.restore(); }
  const H = F.haki; if (!H) return; const t = (now - H.t0) / 1000, r = t - HAKI_CARGA; if (r > 2.6) return;
  const x = H.x - cx, y = H.y - cy, hx = H.hx - cx, hy = H.hy - cy, M = Math.max(VW, VH);
  // carga: el aire se oscurece alrededor y le sube un aura negra con filo rojo, como llamas
  if (r < 0) { const k = t / HAKI_CARGA; const vg = g.createRadialGradient(x, y, 10, x, y, M * .9); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(12,0,6,${.55 * k})`); g.fillStyle = vg; g.fillRect(0, 0, VW, VH);
    for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, rr = 13 + Math.sin(now / 40 + i * 2) * 2, h = (14 + hash(i, Math.floor(now / 60), 3) * 18) * k, bx = hx + Math.cos(a) * rr, by = hy - 30 + Math.sin(a) * rr * 1.6;
      g.fillStyle = i % 3 ? `rgba(8,0,6,${.85 * k})` : `rgba(200,20,40,${.7 * k})`; g.beginPath(); g.moveTo(bx - 3, by + 6); g.quadraticCurveTo(bx + Math.sin(now / 50 + i) * 4, by - h * .6, bx, by - h); g.lineTo(bx + 3, by + 6); g.fill(); }
    for (let i = 0; i < 10; i++) { const a = hash(i, 1, 8) * 7, d = 20 + hash(i, 2, 8) * 40, lift = k * (8 + hash(i, 3, 8) * 16); g.fillStyle = '#5a5048'; g.fillRect(Math.round(hx + Math.cos(a) * d), Math.round(hy + Math.sin(a) * d * .5 - lift), 2, 2); }
    return; }
  // descarga: la imagen se refracta en la onda (copia escalada dentro de un anillo), aberración y destello
  const snap = actoDrawOver.snap || (actoDrawOver.snap = document.createElement('canvas')); if (snap.width !== VW || snap.height !== VH) { snap.width = VW; snap.height = VH; }
  const sg = snap.getContext('2d'); sg.clearRect(0, 0, VW, VH); sg.drawImage(g.canvas, 0, 0);
  for (let k = 0; k < 2; k++) { const tt = r - k * .28; if (tt < 0 || tt > 1.1) continue; const rad = 10 + tt * M * 1.05, w = 26 * (1 - tt / 1.1) + 6;
    g.save(); g.beginPath(); g.ellipse(x, y, rad + w, (rad + w) * .62, 0, 0, 7); g.ellipse(x, y, Math.max(1, rad - w), Math.max(1, rad - w) * .62, 0, 0, 7, true); g.clip('evenodd');
    const sc = 1.06 + .04 * (1 - tt); g.translate(x, y); g.scale(sc, sc); g.translate(-x, -y); g.drawImage(snap, 0, 0); g.restore();
    const a = 1 - tt / 1.1; g.lineWidth = 3 * a + 1; g.strokeStyle = `rgba(0,0,0,${.75 * a})`; g.beginPath(); g.ellipse(x, y, rad, rad * .62, 0, 0, 7); g.stroke(); g.lineWidth = 1.2; g.strokeStyle = `rgba(230,40,60,${.8 * a})`; g.beginPath(); g.ellipse(x, y, rad - 3, (rad - 3) * .62, 0, 0, 7); g.stroke(); }
  if (r < .35) { const k = 1 - r / .35; g.save(); g.globalAlpha = .35 * k; g.globalCompositeOperation = 'lighter'; g.drawImage(snap, 4 * k, 0); g.fillStyle = `rgba(255,0,40,${.12 * k})`; g.fillRect(0, 0, VW, VH); g.drawImage(snap, -4 * k, 0); g.restore(); }
  // presión: viñeta que late dos veces, como un corazón apretado
  const beat = Math.max(0, Math.sin(r * 9)) * Math.exp(-r * 1.6), fade = Math.max(0, 1 - r / 2.4), vg = g.createRadialGradient(x, y, 30, x, y, M); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(.45, `rgba(20,0,8,${(.25 + .25 * beat) * fade})`); vg.addColorStop(1, `rgba(8,0,4,${(.6 + .3 * beat) * fade})`); g.fillStyle = vg; g.fillRect(0, 0, VW, VH);
  // rayos: negros con filo rojo, pegados a él, que crepitan hacia afuera; y algunos largos que cruzan la plaza
  if (r < 1.8) { const seed = Math.floor(now / 55); g.save(); g.lineCap = g.lineJoin = 'round';
    for (let b = 0; b < 10; b++) { if (hash(b, seed, 5) < .3) continue; const longo = b < 3; let an = hash(b, seed, 1) * Math.PI * 2, px = hx + Math.cos(an) * 10, py = hy - 28 + Math.sin(an) * 14; const pts = [[px, py]], len = longo ? 160 + hash(b, seed, 2) * 200 : 40 + hash(b, seed, 2) * 70, n = longo ? 10 : 6;
      for (let s2 = 0; s2 < n; s2++) { an += (hash(b, s2, seed) - .5) * 1.5; px += Math.cos(an) * len / n; py += Math.sin(an) * len / n * .6; pts.push([px, py]); if (s2 === 3 && hash(b, 7, seed) > .5) pts.push([px + 12, py - 10], [px, py]); }
      const al = longo ? Math.max(0, 1 - r / 1.2) : 1; for (const [w, c] of [[7, `rgba(210,20,50,${.35 * al})`], [3.2, `rgba(255,60,80,${.55 * al})`], [1.8, `rgba(0,0,0,${.95 * al})`]]) { g.strokeStyle = c; g.lineWidth = w; g.beginPath(); pts.forEach(([a2, b2], i) => i ? g.lineTo(a2, b2) : g.moveTo(a2, b2)); g.stroke(); } }
    g.restore(); }
  // destello al soltarlo
  if (r < .1) { g.fillStyle = `rgba(255,255,255,${.6 * (1 - r / .1)})`; g.fillRect(0, 0, VW, VH); }
}
function actoDrawTown(g, [cx, cy], now) {
  if (!F.catalejo) { const x = 24 * T - cx, y = 38 * T - cy, k = (Math.sin(now / 260) + 1) / 2; if (k > .55) { g.fillStyle = `rgba(255,250,220,${k})`; g.fillRect(x - 1, y - 4, 2, 8); g.fillRect(x - 4, y - 1, 8, 2); } g.fillStyle = '#c8962e'; g.fillRect(x - 3, y + 2, 6, 2); }
  const Hk = F.haki; if (Hk) { const r = (now - Hk.t0) / 1000 - HAKI_CARGA; if (r > 0) { const fx = Hk.hx - cx, fy = Hk.hy - cy, al = Math.max(0, 1 - r / 3);
    g.save(); g.strokeStyle = `rgba(20,12,10,${.75 * al})`; g.lineCap = 'round';
    for (let i = 0; i < 9; i++) { let an = i / 9 * Math.PI * 2 + hash(i, 1, 4), px = fx, py = fy, L = Math.min(1, r * 4) * (40 + hash(i, 2, 4) * 50); g.lineWidth = 2; g.beginPath(); g.moveTo(px, py);
      for (let k = 0; k < 5; k++) { an += (hash(i, k, 6) - .5) * .9; px += Math.cos(an) * L / 5; py += Math.sin(an) * L / 5 * .55; g.lineTo(px, py); g.lineWidth = 2 - k * .3; } g.stroke(); }
    for (let i = 0; i < 26; i++) { const an = i / 26 * Math.PI * 2, d = 18 + r * 160 + hash(i, 3, 4) * 20; g.fillStyle = `rgba(180,165,140,${.5 * Math.max(0, 1 - r / 1.2)})`; g.beginPath(); g.ellipse(fx + Math.cos(an) * d, fy + Math.sin(an) * d * .5, 4, 2, 0, 0, 7); g.fill(); }
    g.restore(); } }
  // tierra removida junto a la Vieja: casi no se ve hasta que sabes buscarla
  const hx = HOYO[0] * T - cx, hy = HOYO[1] * T - cy, sabe = knows('La caja de papá');
  g.fillStyle = F.caja ? 'rgba(40,24,12,.7)' : `rgba(110,76,44,${sabe ? .55 : .25})`; g.beginPath(); g.ellipse(hx, hy, 13, 6, 0, 0, 7); g.fill();
  if (sabe && !F.caja) { g.fillStyle = '#8a8a94'; for (const [a, b] of [[-6, -3], [-3, -1], [0, 0], [3, 1], [6, 3], [-6, 3], [-3, 1], [3, -1], [6, -3]]) g.fillRect(Math.round(hx + a) - 1, Math.round(hy + b) - 1, 3, 2); }
  if (F.caja) { g.fillStyle = 'rgba(140,100,60,.8)'; g.beginPath(); g.ellipse(hx + 12, hy + 3, 7, 3, 0, 0, 7); g.fill(); }
}
// cadena de verdad: eslabones alternos que cuelgan entre la argolla del ancla y las manos de quien tira
function drawChain(g, a, b, sag, t) { const n = Math.max(6, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 5));
  for (let i = 0; i <= n; i++) { const k = i / n, x = a[0] + (b[0] - a[0]) * k, y = a[1] + (b[1] - a[1]) * k + Math.sin(k * Math.PI) * sag + Math.sin(t * 9 + k * 6) * .6, along = i % 2 === 0;
    g.fillStyle = '#1e1a20'; g.beginPath(); g.ellipse(x, y, along ? 4 : 2, along ? 2.4 : 3.6, Math.atan2(b[1] - a[1], b[0] - a[0]), 0, 7); g.fill();
    g.fillStyle = along ? '#6e6c78' : '#4a4856'; g.beginPath(); g.ellipse(x, y, along ? 3 : 1.2, along ? 1.4 : 2.6, Math.atan2(b[1] - a[1], b[0] - a[0]), 0, 7); g.fill(); if (along) { g.fillStyle = '#1e1a20'; g.fillRect(Math.round(x) - 1, Math.round(y), 2, 1); } } }
function drawMarineShip(g, x, y, w, h) {
  g.save(); g.fillStyle = 'rgba(0,10,30,.3)'; g.beginPath(); g.ellipse(x + w / 2 + 8, y + h / 2 + 10, w / 2, h / 2.1, 0, 0, 7); g.fill();
  const hull = [[x + 4, y + 8], [x + w * .72, y + 3], [x + w * .93, y + h * .3], [x + w + 14, y + h / 2], [x + w * .93, y + h * .7], [x + w * .72, y + h - 3], [x + 4, y + h - 8]];
  poly(g, hull); g.fillStyle = '#e8ecf2'; g.fill(); g.strokeStyle = '#1d2733'; g.lineWidth = 2; g.stroke();
  poly(g, hull.map(([px, py]) => [x + w / 2 + (px - x - w / 2) * .9, y + h / 2 + (py - y - h / 2) * .74])); g.fillStyle = '#b89a6a'; g.fill(); g.strokeStyle = '#2f6fb7'; g.lineWidth = 3; g.stroke();
  for (const mx of [x + w * .36, x + w * .64]) { g.fillStyle = '#5a4030'; g.fillRect(mx - 2, y + 5, 4, h - 10); g.fillStyle = '#f4f6fa'; g.fillRect(mx - 5, y + 7, 4, h - 14); g.fillStyle = '#2a1a12'; g.beginPath(); g.arc(mx, y + h / 2, 5, 0, 7); g.fill(); }
  g.fillStyle = '#2f6fb7'; g.fillRect(x - 26, y + h / 2 - 11, 24, 16); g.fillStyle = '#fff'; g.fillRect(x - 20, y + h / 2 - 4, 12, 2); g.fillRect(x - 15, y + h / 2 - 8, 2, 8);
  g.restore();
}
