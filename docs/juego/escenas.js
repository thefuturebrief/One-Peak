// Escenas sueltas: para probar un momento concreto sin rejugar todo. Arma una partida de prueba (como un guardado),
// te deja justo antes del momento y lo dispara. En modo prueba NO se guarda nada: tu partida de verdad queda intacta.
// También por enlace: index.html?escena=canon&compa=nerea
let PRUEBA = false;
const BASE_SH = { zarpado: true, invitacion: true, stD0: 1, stLlegada: true, stMedusaFuera: true };
const TRAS_CONTROL = { ...BASE_SH, stControl: true, stTono: 'verdad' }, TRAS_MERCADO = { ...TRAS_CONTROL, stPresenta: true };
// el día del desfile, con la elección hecha
function prepDesfile(c) { F.stCompa = c; S.aff[c] = 3; empiezaDesfile(); }
function enPatio(c, lejos) { prepDesfile(c); F.stDentro = F.stTengo = F.stSigue = true; const [x, y] = WORLD.canonPos; enter('town', lejos ? [x - 1.2 * T, y - 2 * T] : [x - 2.6 * T, y + 12], 'right'); const n = P(c); moveNpc(n, 'town', [G.x / T - .9, G.y / T + .1], 'right'); }
const ESCENAS = [
  { id: 'llegada', t: 'Llegada a Shells Town', d: 'La Medusa Gris te deja en la cala y se despide.', isla: 'kale', F: { zarpado: true, invitacion: true }, pos: ['town', 20, 24, 'down'], go: () => llegadaShells() },
  { id: 'control', t: 'El control del cadete', d: 'Severin te para al salir de la cala.', F: BASE_SH, hora: 5.6, pos: ['town', 10.2, 37.8, 'right'] },
  { id: 'mercado', t: 'Los tres candidatos', d: 'El lío del pan en el mercado, las presentaciones y Lalo explicando la isla.', F: TRAS_CONTROL, hora: 6.2, pos: ['town', 13.4, 37.6, 'right'], go: () => presentacion() },
  { id: 'cartas', t: 'La partida del cabo', d: 'Mirar las manos de Ruiz y pillarlo (Nerea).', F: TRAS_MERCADO, asked: { nerea: { que: 1, tadeo: 1 } }, hora: 14.6, pos: ['cantina', 11.2, 7.6, 'right'], go: () => partidaCartas() },
  { id: 'foso', t: 'El Foso: Bruto', d: 'Pelea de dos asaltos por cincuenta berries.', F: TRAS_MERCADO, hora: 14, pos: ['town', 36.6, 35, 'right'], go: () => pelearFoso() },
  { id: 'niklas', t: 'El Foso: Niklas', d: 'La pelea con Niklas.', F: { ...TRAS_MERCADO, stFosoPeleado: true }, hora: 15, pos: ['town', 36.6, 35, 'right'], go: () => pelearNiklas() },
  { id: 'desfile', t: 'La mañana del desfile', d: 'Tu compañero te espera en el punto de encuentro.', compa: true, F: TRAS_MERCADO, dia: 1, hora: 10.55, go: c => { prepDesfile(c); const [x, y] = PUNTO[c]; enter('town', [(x + 1.2) * T, y * T], 'left'); } },
  { id: 'base', t: 'Dentro de la base', d: 'Buscar la llave y el almacén de decomisos.', compa: true, F: TRAS_MERCADO, dia: 1, hora: 10.8, go: c => { prepDesfile(c); entrarBase(); } },
  { id: 'canon', t: 'El cañonazo', d: 'Con lo recuperado, al cruzar el patio junto al cañón de saludo.', compa: true, F: TRAS_MERCADO, dia: 1, hora: 11.2, go: c => enPatio(c) },
  { id: 'severin', t: 'Pelea con Severin', d: 'Tu compañero se lleva a los marines y tú te quedas con el cadete. Si pierdes, te rescata.', compa: true, F: TRAS_MERCADO, dia: 1, hora: 11.3,
    go: c => { enPatio(c, true); F.stCanon = true; WORLD.canonNorte = true; WORLD.estatua = F.estatua = 'rota'; const s = P('severin'), m1 = P('patrulla1'), m2 = P('patrulla2');
      for (const [n, dx, dy] of [[s, 66, 0], [m1, 100, -20], [m2, 98, 30]]) { n.quieto = true; n.camino = null; Object.assign(n, { scene: 'town', x: G.x + dx, y: G.y + dy, dir: 'left' }); } F.stSigue = false; rivalEnElPatio(); } },
  { id: 'huida', t: 'La huida', d: 'Campanas, disparos y la Tortuga Parda soltando amarras.', compa: true, F: TRAS_MERCADO, dia: 1, hora: 11.5,
    go: c => { enPatio(c, true); F.stCanon = true; WORLD.canonNorte = true; WORLD.estatua = F.estatua = 'rota'; F.stSeverin = 'ganaste'; F.stSeverinGolpe = true; const s = P('severin'); s.quieto = true; Object.assign(s, { scene: 'town', x: G.x + 60, y: G.y }); act(s, 'hurt', { hold: true, fps: 10 }); huida(); } },
];
async function jugarEscena(id, c = 'nerea') { const e = ESCENAS.find(x => x.id === id); if (!e) return menu(); PRUEBA = true;
  reset(); Object.assign(player, { name: 'Ilo', last: 'Arena', look: ajustar({ ...LOOK0 }) }); for (const k in DIARY) DIARY[k] = []; S.berries = 600;
  if (e.asked) Object.assign(S.asked, JSON.parse(JSON.stringify(e.asked)));
  const isla = e.isla || 'shells', dia = (e.F.stD0 || 0) + (e.dia || 0), [sc, x, y, dir] = e.pos || ['town', 33, 27, 'down'];
  const d = { S: { ...JSON.parse(JSON.stringify(S)), isla }, player, DIARY, F: { ...e.F, ...(e.compa ? { stCompa: c } : {}) }, G: { scene: 'town', x: 33 * T, y: 27 * T, dir, minutes: dia * 1440 + (e.hora ?? 8) * 60 } };
  aplicarAspecto(player.look); startGame(d);
  // restaurar() viaja a la isla; cuando llega, se pone al jugador en su sitio y se dispara el momento
  while (!(S.isla === isla && !G.paused && PEOPLE.length)) await esperar(60);
  if (isla !== 'kale') { for (const n of PEOPLE) n.lugar = null; vecinosTick(true); }
  if (sc === 'town') enter('town', [x * T, y * T], dir); else { const [s2, p] = place(sc, [x, y]); enter(s2, p, dir); }
  document.querySelectorAll('.tip').forEach(t => t.remove());
  aviso(`Escena de prueba: ${e.t}${e.compa ? ' · con ' + COMPA[c].n : ''}. No se guarda.`);
  await esperar(500); e.go && e.go(c); }
function aviso(txt) { const el = document.createElement('div'); el.className = 'guardado'; el.textContent = txt; document.getElementById('overlays').appendChild(el); setTimeout(() => el.classList.add('out'), 3200); setTimeout(() => el.remove(), 3800); }
function escenasMenu() {
  const fila = e => `<div class="esc"><div><b>${e.t}</b><small>${e.d}</small></div><div class="esc-b">${e.compa ? Object.keys(COMPA).map(c => `<button class="btn sm" type="button" data-e="${e.id}" data-c="${c}">${COMPA[c].n}</button>`).join('') : `<button class="btn sm" type="button" data-e="${e.id}">Jugar</button>`}</div></div>`;
  show(`<div class="col"><div class="kick">Escenas sueltas</div><h2 class="t">Shells Town</h2><p class="lead">Empieza justo antes de cada momento, con un personaje de prueba. No toca tu partida guardada.</p>
    <div class="glass escenas">${ESCENAS.map(fila).join('')}</div><div class="row"><button class="btn ghost" type="button" id="back">Volver</button></div></div>`);
  root.querySelectorAll('[data-e]').forEach(b => b.onclick = () => jugarEscena(b.dataset.e, b.dataset.c));
  document.getElementById('back').onclick = menu; keys(e => { if (e.key === 'Escape') menu(); }); }
