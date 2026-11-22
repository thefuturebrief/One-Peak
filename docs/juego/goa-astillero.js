// El astillero de Ama Sel: tres barcos gratis (se elige uno), nombre gratis y piezas que se pagan. Diseño en docs/goa.md, sección 3.
// El barco se dibuja de perfil, como el resto de barcos del juego, con las piezas elegidas; se ve en la grada y en la pantalla del taller.
const MODELOS = {
  liebre: { n: 'Balandra «Liebre»', corto: 'Liebre', L: 300, tipo: 'balandra', can: 2, max: 4, vel: 3, bod: 1, res: 1, desc: 'Un palo, casco fino y vela grande. La más rápida y la que mejor gira.' },
  albatros: { n: 'Goleta «Albatros»', corto: 'Albatros', L: 360, tipo: 'goleta', can: 4, max: 8, vel: 2, bod: 2, res: 2, desc: 'Dos palos y equilibrio. Ni la más rápida ni la más dura: la que no falla.' },
  tortuga: { n: 'Carraca «Tortuga Vieja»', corto: 'Tortuga Vieja', L: 380, tipo: 'carraca', can: 6, max: 10, vel: 1, bod: 3, res: 3, desc: 'Casco ancho y alto, de chatarra reforzada. Lenta, pero aguanta lo que le echen.' },
};
// piezas: id → [nombre, precio, colores]
const PIEZAS = {
  vela: { n: 'Velas', ops: { crudo: ['Crudo', 0, ['#cfc2a4', '#e2d6ba', '#f0e6cc']], blanco: ['Blanco', 150, ['#d8d6d0', '#f0eee8', '#ffffff']], rojo: ['Rojo', 250, ['#7a2420', '#a8342e', '#c8504a']],
    azul: ['Azul', 250, ['#1e3060', '#2e4a8a', '#4a6ab0']], negro: ['Negro', 300, ['#141214', '#24202a', '#36303a']], rayas: ['A rayas', 400, ['#c8b8a0', '#f0e8d8', '#ffffff']] } },
  casco: { n: 'Casco', ops: { natural: ['Madera natural', 0, ['#4a2e1a', '#6a4428', '#8a5c36']], azul: ['Azul', 200, ['#14203e', '#24386a', '#3a5494']], rojo: ['Rojo', 250, ['#4a1410', '#7a2420', '#a03a30']],
    verdemar: ['Verde mar', 300, ['#0e2a28', '#1a4a46', '#2a6a62']], negro: ['Negro', 350, ['#121014', '#1e1a20', '#2e2832']], blanco: ['Blanco y oro', 500, ['#b8b4aa', '#e0ddd4', '#f6f4ee']] } },
  mascaron: { n: 'Mascarón', ops: { ninguno: ['Ninguno', 0], ave: ['Ave', 300], sol: ['Sol', 400], sirena: ['Sirena', 500], calavera: ['Calavera', 600], medusa: ['Medusa', 800] } },
};
const REFUERZO = 600, CANON = 250;
const SEL_DICE = { ave: '«Un ave. Para un barco que quiere irse lejos. Me gusta.»', sol: '«Un sol en la proa. Que te vean venir de día y de noche.»', sirena: '«Las sirenas traen suerte. O eso cuentan los que no se ahogaron.»',
  calavera: '«Una calavera. ¿Seguro? Después no te quejes si te reciben a cañonazos.»', medusa: '(Ama Sel se queda quieta con el cincel en la mano.) «...¿Una medusa? Él no lleva mascarón. Pero si la llevara, sería esa.»', ninguno: '«Sin mascarón. Un barco honrado.»' };
const barcoDe = () => S.barco || null;
const fraseCasco = { natural: 'madera', azul: 'azul', rojo: 'rojo', verdemar: 'verde mar', negro: 'negro', blanco: 'blanco y oro' };

// ---------- dibujo ----------
// x0: popa; wl: línea de flotación; prog: 0 cuadernas, 1 casco sin palos, 2 terminado
function dibujarBarcoPropio(g, b, x0, wl, prog = 2, now = 0) {
  const M = MODELOS[b.modelo], L = M.L, x1 = x0 + L, O = '#120c0e', cas = PIEZAS.casco.ops[b.casco || 'natural'][2], vel = PIEZAS.vela.ops[b.vela || 'crudo'][2], alto = M.tipo === 'carraca' ? 74 : M.tipo === 'goleta' ? 62 : 54;
  const hull = M.tipo === 'carraca' ? [[x0 - 4, wl - alto - 18], [x0 + 70, wl - alto - 18], [x0 + 76, wl - alto], [x1 - 70, wl - alto], [x1 - 30, wl - alto - 16], [x1 + 4, wl - alto - 14], [x1 - 14, wl - 4], [x0 + 40, wl + 4], [x0 + 6, wl - 16]]
    : [[x0, wl - alto], [x0 + 40, wl - alto], [x1 - 30, wl - alto + 4], [x1 + 4, wl - alto - 6], [x1 + 8, wl - alto + 6], [x1 - 22, wl - 6], [x0 + 34, wl + 2], [x0 + 6, wl - 12]];
  if (prog === 0) { // quilla, roda, codaste y cuadernas
    g.fillStyle = O; g.fillRect(x0 + 10, wl - 6, L - 20, 8); g.fillStyle = '#c8a070'; g.fillRect(x0 + 11, wl - 5, L - 22, 5);
    g.strokeStyle = O; g.lineWidth = 5; g.beginPath(); g.moveTo(x1 - 14, wl - 2); g.quadraticCurveTo(x1 + 8, wl - alto / 2, x1 + 4, wl - alto - 6); g.moveTo(x0 + 12, wl - 2); g.lineTo(x0 + 2, wl - alto); g.stroke();
    g.strokeStyle = '#c8a070'; g.lineWidth = 3; g.stroke();
    for (let k = 0; k < 13; k++) { const px = x0 + 30 + k * (L - 60) / 12, hh = alto * (1 - Math.pow(Math.abs(k - 6) / 9, 2) * .2); g.strokeStyle = O; g.lineWidth = 5; g.beginPath(); g.moveTo(px, wl - 2); g.quadraticCurveTo(px - 6, wl - hh * .5, px, wl - hh); g.stroke(); g.strokeStyle = '#d8b080'; g.lineWidth = 3; g.stroke(); }
    g.strokeStyle = O; g.lineWidth = 4; g.beginPath(); g.moveTo(x0 + 4, wl - alto + 2); g.lineTo(x1 + 2, wl - alto); g.stroke(); g.strokeStyle = '#a8805a'; g.lineWidth = 2; g.stroke(); return; }
  poly(g, hull); g.fillStyle = O; g.fill(); g.lineWidth = 3; g.strokeStyle = O; g.stroke();
  g.save(); poly(g, hull); g.clip();
  const gr = g.createLinearGradient(0, wl - alto - 20, 0, wl + 4); gr.addColorStop(0, cas[2]); gr.addColorStop(.4, cas[1]); gr.addColorStop(1, cas[0]); g.fillStyle = gr; g.fillRect(x0 - 10, wl - alto - 30, L + 30, alto + 40);
  g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1; for (let y = wl - alto + 6; y < wl; y += 7) { g.beginPath(); g.moveTo(x0 - 10, y); g.lineTo(x1 + 10, y + (y - wl) * .05); g.stroke(); }
  if (b.casco === 'blanco') { g.fillStyle = '#d6a83a'; g.fillRect(x0 - 10, wl - alto + 10, L + 30, 3); g.fillRect(x0 - 10, wl - 22, L + 30, 2); }
  else { g.fillStyle = 'rgba(255,240,200,.35)'; g.fillRect(x0 - 10, wl - alto + 10, L + 30, 2); }
  if (M.tipo === 'carraca') for (let k = 0; k < 9; k++) { const px = x0 + 30 + k * (L - 60) / 8, py = wl - 30 + (k % 2) * 6; g.fillStyle = ['#6a6e72', '#8a5a3a', '#5a7a6a'][k % 3]; g.fillRect(px, py, 22, 14); g.fillStyle = '#2a2a2a'; for (const [a, c] of [[2, 2], [18, 2], [2, 10], [18, 10]]) g.fillRect(px + a, py + c, 2, 2); } // chapas de chatarra
  if (b.refuerzo) { for (let px = x0 + 26; px < x1 - 20; px += 40) { g.fillStyle = '#3a3a42'; g.fillRect(px, wl - alto, 5, alto); g.fillStyle = '#8a8a96'; g.fillRect(px + 1, wl - alto, 1, alto); for (let y = wl - alto + 6; y < wl; y += 10) { g.fillStyle = '#c8c8d0'; g.fillRect(px + 1, y, 3, 2); } } }
  g.fillStyle = '#3a5a3a'; g.fillRect(x0 - 10, wl - 6, L + 30, 12); g.restore();
  if (prog < 1.5) { // andamio mientras se termina
    g.strokeStyle = '#6a4a2a'; g.lineWidth = 3; for (let px = x0 + 20; px < x1; px += 60) { g.beginPath(); g.moveTo(px, wl + 6); g.lineTo(px, wl - alto - 40); g.stroke(); } g.beginPath(); g.moveTo(x0 + 10, wl - alto - 20); g.lineTo(x1, wl - alto - 20); g.stroke(); }
  // cañoneras según los cañones del barco
  const nc = Math.ceil((b.canones || M.can) / 2); for (let k = 0; k < nc; k++) { const px = x0 + 70 + k * (L - 140) / Math.max(1, nc - 1), py = wl - alto / 2 - 4; g.fillStyle = O; g.fillRect(px - 6, py - 5, 12, 10); g.fillStyle = '#4a2a1a'; g.fillRect(px - 5, py - 4, 10, 8); g.fillStyle = '#1a1a1e'; g.beginPath(); g.arc(px, py, 3, 0, 7); g.fill(); g.fillStyle = '#5a5a62'; g.fillRect(px - 1, py - 2, 2, 1); }
  // borda y castillo de popa
  for (let px = x0 + 40; px < x1 - 20; px += 8) { g.fillStyle = O; g.fillRect(px, wl - alto - 10, 2, 10); } g.fillStyle = O; g.fillRect(x0 + 38, wl - alto - 12, L - 56, 3);
  const ch = M.tipo === 'carraca' ? 30 : 22; g.fillStyle = O; g.fillRect(x0 - 2, wl - alto - ch - (M.tipo === 'carraca' ? 18 : 0), 54, ch + 2); g.fillStyle = cas[1]; g.fillRect(x0, wl - alto - ch + 2 - (M.tipo === 'carraca' ? 18 : 0), 50, ch - 2);
  for (let k = 0; k < 3; k++) { const yy = wl - alto - ch + 8 - (M.tipo === 'carraca' ? 18 : 0); g.fillStyle = O; g.fillRect(x0 + 6 + k * 14, yy, 9, 9); g.fillStyle = '#ffcf6a'; g.fillRect(x0 + 7 + k * 14, yy + 1, 7, 7); }
  // el nombre en la popa
  if (b.nombre) { g.save(); g.font = '700 11px Georgia, serif'; g.textAlign = 'left'; g.fillStyle = b.casco === 'blanco' ? '#3a2a10' : '#f0d890'; g.fillText(b.nombre.slice(0, 18), x0 + 58, wl - 12); g.restore(); }
  // bauprés y mascarón
  g.strokeStyle = O; g.lineWidth = 4; g.beginPath(); g.moveTo(x1 - 4, wl - alto - 4); g.lineTo(x1 + 60, wl - alto - 36); g.stroke(); g.strokeStyle = '#6a4a2a'; g.lineWidth = 2; g.stroke();
  mascaron(g, b.mascaron || 'ninguno', x1 + 6, wl - alto + 6);
  if (prog < 2) return;
  // palos, velas y jarcia
  const palos = M.tipo === 'balandra' ? [[x0 + L * .48, 210]] : M.tipo === 'goleta' ? [[x0 + L * .36, 214], [x0 + L * .66, 200]] : [[x0 + L * .26, 190], [x0 + L * .52, 230], [x0 + L * .76, 200]];
  g.strokeStyle = 'rgba(30,20,20,.7)'; g.lineWidth = 1; for (const [mx, mh] of palos) for (const tx of [x0 + 10, x1 + 56]) { g.beginPath(); g.moveTo(mx, wl - alto - mh + 10); g.lineTo(tx, tx > x1 ? wl - alto - 34 : wl - alto - 4); g.stroke(); }
  const viento = Math.sin(now / 900) * 3;
  const tela = (pts, k) => { poly(g, pts); g.lineWidth = 3; g.strokeStyle = O; g.stroke(); const sg = g.createLinearGradient(pts[0][0], 0, pts[1][0], 0); sg.addColorStop(0, vel[0]); sg.addColorStop(.4, vel[2]); sg.addColorStop(1, vel[1]); g.fillStyle = sg; g.fill();
    if (b.vela === 'rayas') { g.save(); poly(g, pts); g.clip(); g.fillStyle = '#b8403a'; const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); for (let y = Math.min(...ys); y < Math.max(...ys); y += 18) g.fillRect(Math.min(...xs) - 10, y, Math.max(...xs) - Math.min(...xs) + 20, 8); g.restore(); }
    g.strokeStyle = 'rgba(0,0,0,.16)'; g.lineWidth = 1; for (let i = 1; i < 4; i++) { const a = pts[0], z = pts[pts.length - 1]; g.beginPath(); g.moveTo(a[0] + (pts[1][0] - a[0]) * i / 4, a[1] + (pts[1][1] - a[1]) * i / 4); g.lineTo(z[0] + (pts[2][0] - z[0]) * i / 4, z[1] + (pts[2][1] - z[1]) * i / 4); g.stroke(); } };
  for (const [mx, mh] of palos) { const top = wl - alto - mh; g.fillStyle = O; g.fillRect(mx - 3, top, 6, mh); g.fillStyle = '#6a4a2a'; g.fillRect(mx - 2, top, 4, mh); g.fillStyle = '#8a6a3a'; g.fillRect(mx - 2, top, 1, mh); }
  if (M.tipo === 'carraca') for (const [mx, mh] of palos) { const top = wl - alto - mh; for (const [yy, ww, hh] of [[top + 28, 96, 56], [top + 92, 124, 64]]) { if (yy + hh > wl - alto - 10) continue; g.fillStyle = O; g.fillRect(mx - ww / 2 - 2, yy - 3, ww + 4, 5);
      tela([[mx - ww / 2, yy], [mx + ww / 2, yy], [mx + ww / 2 - 4 + viento, yy + hh], [mx - ww / 2 + 4 + viento, yy + hh]]); } }
  else { for (const [mx, mh] of palos) { const top = wl - alto - mh, bot = wl - alto - 14, boom = M.tipo === 'balandra' ? 130 : 96; // cangreja: botavara hacia popa
      tela([[mx - 4, top + 14], [mx - boom * .8, top + 30 + viento], [mx - boom, bot], [mx - 4, bot]]); g.fillStyle = O; g.fillRect(mx - boom - 2, bot - 2, boom, 4); g.fillRect(mx - boom * .8, top + 28 + viento, boom * .8, 3); }
    const [fx, fh] = palos[palos.length - 1]; tela([[fx + 3, wl - alto - fh + 18], [x1 + 54, wl - alto - 34], [fx + 3, wl - alto - 18]]); } // foque
  for (const [mx, mh] of palos) { const top = wl - alto - mh; g.fillStyle = O; g.fillRect(mx - 1, top - 16, 2, 18); g.fillStyle = '#141014'; g.beginPath(); g.moveTo(mx + 1, top - 16); g.lineTo(mx + 24 + viento, top - 12); g.lineTo(mx + 20, top - 8); g.lineTo(mx + 25 + viento, top - 3); g.lineTo(mx + 1, top - 4); g.fill(); g.fillStyle = '#e8e2d8'; g.beginPath(); g.arc(mx + 10, top - 10, 2.5, 0, 7); g.fill(); }
}
function mascaron(g, m, x, y) { const O = '#120c0e', D = '#d6a83a', C = '#f0e6cc';
  if (m === 'ninguno') return; g.save(); g.translate(x, y); g.fillStyle = O;
  if (m === 'ave') { g.beginPath(); g.moveTo(0, 0); g.lineTo(20, -10); g.lineTo(28, -8); g.lineTo(18, 0); g.lineTo(26, 8); g.lineTo(6, 8); g.fill(); g.fillStyle = C; g.beginPath(); g.moveTo(2, 0); g.lineTo(19, -8); g.lineTo(25, -7); g.lineTo(16, 1); g.lineTo(22, 6); g.lineTo(6, 6); g.fill(); g.fillStyle = D; g.fillRect(24, -8, 6, 2); g.fillStyle = O; g.fillRect(20, -7, 2, 2); }
  if (m === 'sol') { g.beginPath(); g.arc(12, -2, 11, 0, 7); g.fill(); g.fillStyle = D; g.beginPath(); g.arc(12, -2, 9, 0, 7); g.fill(); for (let k = 0; k < 8; k++) { const a = k / 8 * 7; g.fillRect(12 + Math.cos(a) * 11 - 2, -2 + Math.sin(a) * 11 - 2, 4, 4); } g.fillStyle = '#8a5a1a'; g.fillRect(8, -4, 2, 2); g.fillRect(14, -4, 2, 2); g.fillRect(9, 1, 6, 1); }
  if (m === 'sirena') { g.fillRect(2, -14, 10, 30); g.beginPath(); g.arc(9, -16, 6, 0, 7); g.fill(); g.fillStyle = '#e8c0a0'; g.fillRect(3, -12, 8, 12); g.beginPath(); g.arc(9, -16, 5, 0, 7); g.fill(); g.fillStyle = '#c8502e'; g.fillRect(3, -22, 8, 8); g.fillRect(2, -16, 3, 14); g.fillStyle = '#3a8a7a'; g.fillRect(3, 0, 8, 14); g.fillRect(8, 12, 8, 4); }
  if (m === 'calavera') { g.beginPath(); g.arc(10, -4, 10, 0, 7); g.fill(); g.fillRect(4, 2, 12, 9); g.fillStyle = C; g.beginPath(); g.arc(10, -4, 8, 0, 7); g.fill(); g.fillRect(5, 2, 10, 7); g.fillStyle = O; g.fillRect(5, -6, 4, 4); g.fillRect(11, -6, 4, 4); g.fillRect(9, 0, 2, 2); for (const px of [6, 9, 12]) g.fillRect(px, 5, 1, 4); }
  if (m === 'medusa') { g.beginPath(); g.ellipse(10, -6, 12, 9, 0, Math.PI, 0); g.fill(); g.fillRect(-2, -6, 24, 4); g.fillStyle = '#5a5a66'; g.beginPath(); g.ellipse(10, -6, 10, 7, 0, Math.PI, 0); g.fill(); g.strokeStyle = '#5a5a66'; g.lineWidth = 2; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(k * 5, -4); g.bezierCurveTo(k * 5 - 4, 4, k * 5 + 4, 8, k * 5 + (k % 2 ? 3 : -3), 16); g.stroke(); } }
  g.restore(); }
// en la grada del astillero: el esqueleto antes de elegir; tu barco, con las piezas, después
function dibujarGrada(g, x, y, w, h, now) { const b = barcoDe(); if (F.barcoBotado) return; const wl = y + h - 8;
  if (!b) { dibujarBarcoPropio(g, { modelo: 'albatros' }, x + (w - MODELOS.albatros.L) / 2, wl, 0); return; }
  const M = MODELOS[b.modelo]; dibujarBarcoPropio(g, b, x + (w - M.L) / 2 - 20, wl, progresoBarco(), now); }
// el equipo de Ama Sel lo termina en un día: casco el día que lo eliges, palos y velas a la mañana siguiente
const progresoBarco = () => { const b = barcoDe(); if (!b) return 0; return G.minutes - b.desde >= 18 * 60 ? 2 : 1; };

// ---------- la pantalla del taller ----------
function retratoBarco(b, w = 520, h = 300, prog = 2) { const [c, g] = mkCanvas(w, h), M = MODELOS[b.modelo];
  const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#2a3a5a'); sky.addColorStop(.7, '#6a7a8a'); sky.addColorStop(.72, '#2a4a6a'); sky.addColorStop(1, '#14283e'); g.fillStyle = sky; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 0; k < 30; k++) g.fillRect(hash(k, 1, 90) * w, h * .74 + hash(k, 2, 90) * h * .24, 10 + hash(k, 3, 90) * 20, 1);
  const s = Math.min(1, (w - 80) / (M.L + 80)); g.save(); g.translate(w / 2 - (M.L / 2 + 20) * s, h * .78); g.scale(s, s); dibujarBarcoPropio(g, b, 0, 0, prog); g.restore(); return c; }
let ASTI = null;
function abrirAstillero(paso) { G.paused = true; G.keys = {}; const ov = document.getElementById('overlays'); ov.querySelector('.astillero-ov') && ov.querySelector('.astillero-ov').remove();
  const b = barcoDe(), el = document.createElement('div'); el.className = 'tienda-ov astillero-ov panelj'; ASTI = ASTI || {};
  const cierra = () => { el.remove(); G.paused = false; guardarAuto(); };
  if (!b || paso === 'elegir') {
    el.innerHTML = `<div class="glass book tienda asti" role="dialog" aria-label="Astillero de Ama Sel"><div class="tabs top"><b class="tt">Elige tu barco</b><span class="bolsa-b">Gratis</span><button type="button" class="x" aria-label="Cerrar">Cerrar ✕</button></div>
      <p class="hola">«Los tres están en la grada o a medio hacer. El que elijas, lo termino. El nombre se lo pones tú.»</p>
      <div class="modelos">${Object.entries(MODELOS).map(([id, M]) => `<div class="modelo"><div class="lz" data-pv="${id}"></div><b>${M.n}</b><small>${M.desc}</small>
        <dl><dt>Velocidad</dt><dd>${'●'.repeat(M.vel)}${'○'.repeat(3 - M.vel)}</dd><dt>Bodega</dt><dd>${'●'.repeat(M.bod)}${'○'.repeat(3 - M.bod)}</dd><dt>Resistencia</dt><dd>${'●'.repeat(M.res)}${'○'.repeat(3 - M.res)}</dd><dt>Cañones</dt><dd>${M.can} (hasta ${M.max})</dd></dl>
        <button type="button" class="btn sm" data-m="${id}">Este</button></div>`).join('')}</div></div>`;
    ov.appendChild(el);
    el.querySelectorAll('[data-pv]').forEach(d => d.appendChild(retratoBarco({ modelo: d.dataset.pv }, 300, 190)));
    el.querySelectorAll('[data-m]').forEach(bt => bt.onclick = () => { const m = bt.dataset.m; S.barco = { modelo: m, nombre: '', vela: 'crudo', casco: 'natural', mascaron: 'ninguno', refuerzo: false, canones: MODELOS[m].can, compras: {}, desde: G.minutes };
      learn(['goa', 'Tu barco', `Ama Sel me dio la ${MODELOS[m].n}. No quiso cobrarme nada: dice que se lo debe al de gris.`]); abrirAstillero('piezas'); });
  } else {
    const M = MODELOS[b.modelo], fila = (pz) => Object.entries(PIEZAS[pz].ops).map(([k, [n, p, col]]) => { const ya = k === b[pz], pagado = p === 0 || b.compras[pz + ':' + k];
      return `<button type="button" class="op${ya ? ' on' : ''}" data-p="${pz}" data-k="${k}" aria-pressed="${ya}">${col ? `<i style="background:${k === 'rayas' ? 'repeating-linear-gradient(0deg,#b8403a 0 5px,#f0e8d8 5px 10px)' : col[1]}"></i>` : `<i class="mc mc-${k}"></i>`}<span>${n}</span><em>${pagado ? (p ? 'Pagado' : 'De serie') : p + ' ฿'}</em></button>`; }).join('');
    el.innerHTML = `<div class="glass book tienda asti" role="dialog" aria-label="Astillero de Ama Sel"><div class="tabs top"><b class="tt">${M.n}</b><span class="bolsa-b"><i></i>${berries()} ฿</span><button type="button" class="x" aria-label="Cerrar">Cerrar ✕</button></div>
      <div class="pbody"><div class="lz grande" id="pvb"></div><p class="hola" id="dice">${ASTI.dice || '«Ponle nombre. Lo demás se paga: la madera la regalo, la pintura no.»'}</p>
      <label class="nombre-b">Nombre <input id="nb" maxlength="18" value="${(b.nombre || '').replace(/"/g, '')}" placeholder="Escríbelo tú (gratis)"></label>
      ${['vela', 'casco', 'mascaron'].map(pz => `<div class="pz"><b>${PIEZAS[pz].n}</b><div class="ops">${fila(pz)}</div></div>`).join('')}
      <div class="pz"><b>Taller</b><div class="ops"><button type="button" class="op" data-x="refuerzo" ${b.refuerzo ? 'disabled' : ''}><span>Refuerzo del casco</span><em>${b.refuerzo ? 'Hecho' : REFUERZO + ' ฿'}</em></button>
        <button type="button" class="op" data-x="canon" ${b.canones >= M.max ? 'disabled' : ''}><span>Un cañón más (${b.canones}/${M.max})</span><em>${b.canones >= M.max ? 'Completo' : CANON + ' ฿'}</em></button>
        <button type="button" class="op" data-x="otro"><span>Cambiar de barco</span><em>Gratis</em></button></div></div></div></div>`;
    ov.appendChild(el); el.querySelector('#pvb').appendChild(retratoBarco(b, 560, 250, progresoBarco() || 1));
    const nb = el.querySelector('#nb'); nb.oninput = () => { b.nombre = nb.value.trim(); const pv = el.querySelector('#pvb'); pv.innerHTML = ''; pv.appendChild(retratoBarco(b, 560, 250, progresoBarco() || 1)); };
    nb.onkeydown = e => e.stopPropagation();
    el.querySelectorAll('[data-p]').forEach(bt => bt.onclick = () => { const pz = bt.dataset.p, k = bt.dataset.k, p = PIEZAS[pz].ops[k][1], clave = pz + ':' + k;
      if (p && !b.compras[clave]) { if (!pagar(p)) { ASTI.dice = '«Eso cuesta ' + p + ' berries. Vuelve cuando los tengas.»'; return abrirAstillero(); } b.compras[clave] = true; }
      b[pz] = k; ASTI.dice = pz === 'mascaron' ? SEL_DICE[k] : pz === 'casco' ? `«Casco ${fraseCasco[k]}. Mañana está seco.»` : '«Velas nuevas. Las cose Teo Lona, el velero de la ciudad: no hay otro mejor.»'; abrirAstillero(); });
    el.querySelectorAll('[data-x]').forEach(bt => bt.onclick = () => { const x = bt.dataset.x;
      if (x === 'otro') { if (Object.keys(b.compras).length || b.refuerzo || b.canones > M.can) ASTI.dice = '«Si cambias de barco, lo que pagaste se queda en este. Piénsalo.»'; else S.barco = null; return abrirAstillero(S.barco ? undefined : 'elegir'); }
      if (x === 'refuerzo') { if (!pagar(REFUERZO)) { ASTI.dice = '«Seiscientos. Ni uno menos.»'; return abrirAstillero(); } b.refuerzo = true; ASTI.dice = '«Planchas de hierro por dentro y por fuera. Ahora sí, que te disparen.»'; }
      if (x === 'canon') { if (!pagar(CANON)) { ASTI.dice = '«Un cañón son doscientos cincuenta. Y las balas, aparte.»'; return abrirAstillero(); } b.canones++; ASTI.dice = '«Otro cañón. Bram me trae el hierro de la chatarra.»'; }
      abrirAstillero(); });
  }
  el.querySelector('.x').onclick = cierra; el.onclick = e => { if (e.target === el) cierra(); };
  keyHandler = e => { if (e.key === 'Escape') cierra(); }; (el.querySelector('button.btn, #nb') || el.querySelector('.x')).focus(); }
