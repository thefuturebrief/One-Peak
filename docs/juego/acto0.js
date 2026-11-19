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
  lin: [[0, 12.5, 'town', [31.6, 23.8]], [12.5, 15, 'town', [55.2, 9.8]], [15, 24, 'town', [31.6, 23.8]]],
  rosa: [[0, 13, 'town', [26.8, 24.4]], [13, 24, 'town', [18.6, 26.4]]],
  pura: [[0, 13, 'town', [28.1, 24.4]], [13, 15.5, 'none'], [15.5, 24, 'town', [28.1, 24.4]]],
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
  rutinas(true);
  OBJS.push(...[{ scene: 'casa', at: [7.25, 4.1], label: 'Descansar', act: descansar }].map(o => { const [scene, [x, y]] = place(o.scene, o.at); return { ...o, scene, x, y }; }));
}
function descansar() {
  const h = hourNow(); if (h >= 16.5 || F.campana) return narr(['No tienes sueño. Y no es momento de dormir.']);
  narr(['Te tumbas un rato en la cama. Se oye el mar y, a lo lejos, a Corso cantando.'], () => fade(() => { G.minutes = Math.min(17 * 60 - 10, G.minutes + 120); rutinas(true); }));
}
let lastTick = 0;
function actoTick(now) {
  if (now - lastTick < 400) return; lastTick = now;
  rutinas(false);
  if (!F.campana && hourNow() >= 17) return campana();
  if (F.campana && !F.plaza && G.scene === 'town' && Math.hypot(G.x - 30 * T, G.y - 21 * T) < 6 * T) { F.plaza = true; plaza(); }
}
function campana() {
  F.campana = true; const fam = player.last; clearBubbles(); for (const n of PEOPLE) n.nextBark = 1e15;
  P('dorne').scene = 'none'; P('marla').slot = null;
  const spots = { lin: [34.6, 24.6, 'left'], rosa: [26, 25.2, 'right'], pura: [27, 25.6, 'right'], brin: [25.2, 23.4, 'right'], corso: [27.4, 24.2, 'up'] };
  for (const [id, [x, y, d]] of Object.entries(spots)) { const n = P(id); moveNpc(n, 'town', [x, y], d); n.chat = false; n.route = null; }
  const m = P('mar1'); m.route = null; moveNpc(m, 'town', [33.6, 18.6], 'down');
  npcAdd('dorneP', 'capitan', '"Garra" Dorne', 'town', [32.4, 22.8], 'left');
  npcAdd('pirata', 'pirata', 'Pirata de Dorne', 'town', [27.6, 21.4], 'right');
  npcAdd('pirata2', 'maton', 'Pirata de Dorne', 'town', [32.4, 21], 'left');
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
  bubble(c, '¡Deja en paz a mi hermano!', 2400);
  narr(['Corso le tira una piedra a Dorne. Le da en el sombrero.', 'El pirata de la cadena lo agarra del cuello de la camisa.'], () => {
    moveNpc(pi, 'town', [28.2, 23.4], 'right'); moveNpc(c, 'town', [27.5, 23.6], 'right'); G.x = 30.2 * T; G.y = 23.4 * T; G.dir = 'left';
    say(P('dorneP'), { lines: ['Encárgate del mayor. Y no me lo rompas del todo: lo necesito para hablar.'], done: pelea }); });
}

// =====================================================================
// LA PELEA: instinto con pausas. Se congela en cada momento y eliges lo que te pide el cuerpo.
// =====================================================================
const OFICIO_GOLPE = { tirador: ['Una piedra, directa a la cara', 'agilidad', 18, true], cocinero: ['Volcarle encima la caja de pescado', 'fuerza', 20, true], carpintero: ['Un tablón suelto del puesto', 'fuerza', 28], medico: ['Un punto de presión en el cuello', 'intelecto', 16, true], navegante: ['Enredarle los pies con la cadena', 'iq', 14, true], combatiente: ['El golpe del puerto', 'fuerza', 34], musico: ['Un grito que le revienta los oídos', 'carisma', 10, true], arqueologo: ['Leer su postura y golpear donde falla', 'intelecto', 26] };
const chance = (v, b = 0) => Math.max(.15, Math.min(.88, .42 + (v - 8) * .07 + b));
const riesgo = p => p >= .62 ? ['Seguro', 'ok'] : p >= .4 ? ['Arriesgado', 'mid'] : ['Muy difícil', 'hard'];
function instinto() {
  const st = S.st, top = Object.entries(S.of).sort((a, b) => b[1] - a[1])[0], of = top[1] > 0 ? top[0] : null, list = [];
  list.push({ id: 'golpe', t: 'Golpearlo', p: chance(st.fuerza), dmg: 20 + st.fuerza });
  list.push({ id: 'esquiva', t: 'Esquivar y responder', p: chance((st.agilidad + st.iq) / 2), dmg: 14, dodge: true });
  if (F.fight.corso) list.push({ id: 'proteger', t: 'Ponerte delante de Corso', p: chance(st.voluntad, S.ax.corazon > 0 ? .15 : 0), protect: true });
  if (of) { const [t, s, dmg, stun] = OFICIO_GOLPE[of]; list.push({ id: 'oficio', t, p: chance(st[s], .06), dmg, stun }); }
  else list.push({ id: 'arena', t: 'Echarle arena a los ojos', p: chance(st.intelecto, .06), dmg: 6, stun: true });
  return list;
}
function pelea() {
  const meMax = 40 + S.st.resistencia * 6; F.fight = { me: meMax, meMax, foe: 110, foeMax: 110, round: 0, rounds: F.prisa ? 3 : 4, corso: true, protected: false, hard: 0 };
  G.paused = true; const ov = document.getElementById('overlays'), box = document.createElement('div'); box.className = 'fight glass'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Pelea'); ov.appendChild(box);
  document.getElementById('hud').classList.add('talking'); momento();
}
function fightUI(text, opts) {
  const f = F.fight, box = document.querySelector('.fight'), bar = (v, m, me) => `<i class="bar${me ? ' me' : ''}"><s style="width:${Math.max(0, v / m * 100)}%"></s></i>`;
  box.innerHTML = `<div class="bars"><div><b>Pirata de Dorne</b>${bar(f.foe, f.foeMax)}</div><div><b>${player.name}</b>${bar(f.me, f.meMax, true)}</div></div><p class="nar">${text}</p>${opts ? `<div class="ch">${opts.map((o, i) => { const [r, c] = riesgo(o.p); return `<button type="button" data-i="${i}"><kbd>${i + 1}</kbd>${o.t}<span class="risk ${c}">${r}</span></button>`; }).join('')}</div>` : '<span class="more">…</span>'}`;
  if (opts) { const bs = [...box.querySelectorAll('button')]; bs.forEach(b => b.onclick = () => elegir(opts[+b.dataset.i])); bs[0].focus(); keyHandler = e => { const n = +e.key; if (n >= 1 && n <= opts.length) elegir(opts[n - 1]); }; }
  else keyHandler = null;
}
function momento() { const f = F.fight; f.round++; fightUI(f.round === 1 ? 'El pirata se te echa encima. El tiempo se estira: lo ves venir.' : 'Otra vez. Respiras. Decides.', instinto()); }
const later = (ms, fn) => setTimeout(fn, ms);
function golpeVisual(quien) { const el = document.getElementById('game'); el.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-4px,2px)' }, { transform: 'translate(3px,-2px)' }, { transform: 'translate(0,0)' }], { duration: 220 });
  if (quien === 'me') { const fl = document.createElement('div'); fl.className = 'hitflash'; document.getElementById('overlays').appendChild(fl); later(380, () => fl.remove()); } }
function lunge(n, dx) { const x0 = n.x; n.x += dx; later(150, () => n.x = x0); }
function elegir(o) {
  const f = F.fight, pi = P('pirata'), me = { get x() { return G.x; }, set x(v) { G.x = v; } }, ok = Math.random() < o.p; let stun = false, txt;
  keyHandler = null;
  if (o.protect) { if (ok) { f.protected = true; f.corso = false; moveNpc(P('corso'), 'town', [26, 24.6], 'right'); txt = 'Te metes entre Corso y el pirata. Corso se suelta y corre hacia Brin.'; } else txt = 'Intentas llegar hasta Corso, pero el pirata te corta el paso.'; }
  else { lunge(me, -10); if (ok) { f.foe -= o.dmg; stun = !!o.stun; txt = { golpe: 'Le das de lleno. El pirata se tambalea.', esquiva: 'Te agachas, el puño te pasa por encima y le respondes en las costillas.', arena: 'Le echas un puñado de arena a los ojos. Se queda ciego un momento.' }[o.id] || `${o.t}. Funciona.`; golpeVisual('foe'); }
    else txt = { golpe: 'Lanzas el puño, pero lo ve venir.', esquiva: 'Esquivas tarde.', arena: 'La arena se la lleva el viento.' }[o.id] || `${o.t}... pero no sale como esperabas.`; }
  fightUI(txt);
  later(1300, () => {
    if (f.foe > 0 && F.vecinos && f.round === 2) { f.foe -= 22; fightUI('Brin aparece por detrás y le rompe un remo en la espalda al pirata.'); return later(1400, contra.bind(null, stun, o, ok)); }
    contra(stun, o, ok);
  });
}
function contra(stun, o, ok) {
  const f = F.fight, pi = P('pirata');
  if (f.foe <= 0) return finPelea('El pirata cae de rodillas, sin aire. Nadie en la plaza se lo esperaba.');
  if (stun) { fightUI('El pirata no puede responder. Ganas un respiro.'); return later(1200, sigue); }
  lunge(pi, 10);
  const hitP = .62 - (o.dodge && ok ? .35 : 0), dmg = 14 + Math.floor(Math.random() * 12) + (o.protect && ok ? 6 : 0);
  if (Math.random() < hitP) { f.me -= dmg; if (dmg >= 22) f.hard++; golpeVisual('me'); fightUI(dmg >= 22 ? 'El puñetazo te llega a la ceja. Ves blanco un instante.' : 'Te alcanza en el costado. Duele, pero sigues en pie.'); }
  else fightUI('El pirata golpea al aire.');
  later(1300, sigue);
}
function sigue() { const f = F.fight; if (f.me <= 0) return finPelea('Caes al suelo. Lo último que ves es la bota del pirata.', true); if (f.round >= f.rounds) return finPelea('Seguís en pie los dos, jadeando. El pirata ya no sonríe.'); momento(); }
function finPelea(txt, caido) {
  const f = F.fight; f.won = f.foe <= 0; f.down = !!caido; fightUI(txt);
  if (f.hard) { S.trs.push('Cicatriz en la ceja'); learn(['yo', 'Una cicatriz', 'La pelea de la plaza me dejó una cicatriz en la ceja. Cada vez que la toco, me acuerdo de Corso.']); }
  later(1800, () => { document.querySelector('.fight').remove(); G.paused = false; forastero(); });
}
// =====================================================================
// EL FORASTERO Y LOS REFUERZOS
// =====================================================================
function forastero() {
  const d = P('dorneP'), f = F.fight, fo = npcAdd('forastero', 'forastero', 'Forastero', 'town', [35.6, 22.4], 'left');
  say(d, { lines: ['Basta de juegos. Si quieres algo bien hecho...', '(Dorne da un paso hacia ti, con el garfio por delante.)'], done: () => say(fo, { lines: ['Dorne. Veinte años y sigues peleándote con críos.'], done: () => narr(['Por un instante, todos en la plaza sienten un peso en el pecho, como si el aire se hubiera vuelto agua.', 'A Rosa se le caen los pescados.', f.won ? 'El pirata del suelo deja de respirar un segundo.' : 'El pirata que peleaba contigo baja los puños sin darse cuenta.'], () => say(d, { lines: ['(Dorne retrocede.)', 'Tú... Krakaka. Esto no ha terminado. ¡Nos vamos!'], done: refuerzos })) }) });
}
function refuerzos() {
  for (const id of ['dorneP', 'pirata', 'pirata2']) P(id).scene = 'none';
  F.refuerzos = true; const fo = P('forastero'), te = npcAdd('teniente', 'teniente', 'Teniente Breda Nisi', 'town', [33.8, 23.6], 'left'), f = F.fight;
  narr(['En el muelle suena una corneta. Un barco de la Marina acaba de amarrar.'], () => say(te, { lines: ['Teniente Breda Nisi, de Loguetown. Por lo que veo, llegamos tarde.', f.protected ? 'Te pusiste delante de un pirata para proteger a un crío. Eso no se enseña en ninguna academia.' : f.won ? 'Tumbaste a uno de los hombres de Dorne. No está nada mal.' : 'Aguantaste contra uno de los hombres de Dorne. No está mal.', 'Mi barco sale esta noche. Si quieres entrar en la Marina, búscame frente al destacamento.'],
    done: () => say(fo, { lines: [f.protected ? 'Protegiste al pequeño. Bien hecho.' : 'Tienes buenos puños. Te falta saber cuándo usarlos.', 'Zarpo esta noche, con la marea. Hay sitio para uno más. Te espero en la punta del muelle.', 'No preguntes adónde.'], done: atardecer }) }));
}
function atardecer() {
  F.invitacion = true; G.minutes = Math.max(G.minutes, 18.5 * 60); for (const n of PEOPLE) n.nextBark = performance.now() + 6000 + Math.random() * 8000;
  learn(['gente', 'El forastero', 'Un hombre de levita negra. Dorne retrocedió solo con verlo. Dice que zarpa esta noche y que hay sitio para mí.']);
  learn(['gente', 'Teniente Breda Nisi', 'Oficial de la Marina de Loguetown. Me ofreció alistarme. Su barco sale esta noche.']);
  moveNpc(P('forastero'), 'town', [4.6, 22.2], 'left'); moveNpc(P('teniente'), 'town', [44.5, 14.6], 'down');
  moveNpc(P('corso'), 'casa', [10.8, 4.9], 'left'); moveNpc(P('marla'), 'casa', [2.6, 8.4], 'right');
  for (const [id, at] of [['lin', [31.6, 23.8]], ['rosa', [26.8, 24.4]], ['pura', [28.1, 24.4]], ['brin', [3.2, 24.6]]]) moveNpc(P(id), 'town', at);
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
    if (aff('marla') >= 1 || knows('Mamá conoce a Dorne')) { F.brujula = true; S.items.push('Brújula de tu padre'); learn(['familia', 'La brújula de papá', 'Mamá me dio la brújula de papá. No apunta al norte. Él decía que apunta adonde está él.']);
      return [...lines, '(Marla no dice nada. Va a su cuarto y vuelve con algo en la mano.)', 'Era de tu padre. Una brújula que no apunta al norte.', 'Él decía que apunta adonde está él. Nunca le creí.', 'Vuelve. ¿Me oyes? Vuelve.']; }
    return [...lines, '(Marla te abraza muy fuerte y tarda en soltarte.)', 'Ya sabía que este día iba a llegar.', 'Vuelve. ¿Me oyes? Vuelve.']; } }, ...marla.topics.filter(t => t.id === 'papa')];
  marla.greet = () => '(Marla tiene los ojos rojos.) Me lo ha contado todo Corso. Todo.';
  corso.topics = [{ id: 'adios', once: true, ask: 'Corso, me voy.', a: () => asked('corso', 'prometo') ? ['¿Te vas? ¿Sin mí?', '...Lo prometiste. Me llevarás. Algún día.', 'Hasta entonces, cuido yo de mamá.'] : ['¿Te vas?', '(Corso se muerde el labio.) Escríbeme. Aunque sea una carta.'] }];
  corso.greet = () => F.fight.protected ? '¡Le pegaste a un pirata! ¡A un pirata de verdad!' : '¿Estás bien? Tienes sangre en la ceja.';
  narr(['El sol ya toca el mar. Tienes hasta esta noche para decidir.', 'El forastero espera en la punta del muelle. La teniente, frente al destacamento.']);
}
// confirmación al elegir camino: el juego pregunta aquí antes de responder un tema
function actoChoose(t, i) {
  if (t.conv.opts) return false; const tp = topicsOf(t.npc)[i];
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
  learn(['yo', 'Me fui de Kalé', path === 'pirata' ? 'Zarpé de noche con el forastero de la levita negra, sin saber adónde.' : 'Me alisté en la Marina con la teniente Breda Nisi. Rumbo a Loguetown.']);
  const lines = path === 'pirata'
    ? ['Esa noche, Kalé se hizo pequeña detrás de ti.', asked('corso', 'prometo') ? 'Corso te despidió desde el muelle hasta que ya no pudo verte. Le habías hecho una promesa.' : 'Corso te despidió desde el muelle hasta que ya no pudo verte.', F.brujula ? 'En el bolsillo llevabas la brújula de tu padre. No apuntaba al norte.' : 'El forastero no dijo una palabra en toda la noche.']
    : ['Esa noche subiste a un barco de la Marina rumbo a Loguetown.', asked('corso', 'prometo') ? 'Corso no lloró. Te había hecho prometer que volverías a por él.' : 'Corso te despidió desde el muelle con la gorra de un marine que le habían regalado.', F.brujula ? 'En el bolsillo llevabas la brújula de tu padre. No apuntaba al norte.' : 'La teniente Nisi te miró una vez y asintió.'];
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
function actoDrawTown(g, [cx, cy], now) {
  if (F.campana && P('pirata') && P('pirata').scene === 'town') { g.strokeStyle = '#6a6a76'; g.lineWidth = 3; g.setLineDash([4, 3]);
    for (const id of ['pirata', 'pirata2']) { const n = P(id); g.beginPath(); g.moveTo(30 * T - cx, 20.4 * T - cy); g.lineTo(n.x - cx, n.y - 24 - cy); g.stroke(); } g.setLineDash([]); }
  if (F.refuerzos) drawMarineShip(g, 5.4 * T - cx, 17.4 * T - cy, 8 * T, 3.2 * T);
}
function drawMarineShip(g, x, y, w, h) {
  g.save(); g.fillStyle = 'rgba(0,10,30,.3)'; g.beginPath(); g.ellipse(x + w / 2 + 8, y + h / 2 + 10, w / 2, h / 2.1, 0, 0, 7); g.fill();
  const hull = [[x + 4, y + 8], [x + w * .72, y + 3], [x + w * .93, y + h * .3], [x + w + 14, y + h / 2], [x + w * .93, y + h * .7], [x + w * .72, y + h - 3], [x + 4, y + h - 8]];
  poly(g, hull); g.fillStyle = '#e8ecf2'; g.fill(); g.strokeStyle = '#1d2733'; g.lineWidth = 2; g.stroke();
  poly(g, hull.map(([px, py]) => [x + w / 2 + (px - x - w / 2) * .9, y + h / 2 + (py - y - h / 2) * .74])); g.fillStyle = '#b89a6a'; g.fill(); g.strokeStyle = '#2f6fb7'; g.lineWidth = 3; g.stroke();
  for (const mx of [x + w * .36, x + w * .64]) { g.fillStyle = '#5a4030'; g.fillRect(mx - 2, y + 5, 4, h - 10); g.fillStyle = '#f4f6fa'; g.fillRect(mx - 5, y + 7, 4, h - 14); g.fillStyle = '#2a1a12'; g.beginPath(); g.arc(mx, y + h / 2, 5, 0, 7); g.fill(); }
  g.fillStyle = '#2f6fb7'; g.fillRect(x - 26, y + h / 2 - 11, 24, 16); g.fillStyle = '#fff'; g.fillRect(x - 20, y + h / 2 - 4, 12, 2); g.fillRect(x - 15, y + h / 2 - 8, 2, 8);
  g.restore();
}
