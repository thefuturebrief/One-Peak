// Barcos a los que se sube: cubierta dibujada a medida (forma de casco, mar alrededor) y bajo cubierta armado como una casa.
// En el pueblo se suben por una pasarela; amarrados o en alta mar, son escenas como cualquier cuarto.
const BARCOS = {
  corneja: { n: 'La Corneja', estilo: 'corneja', L: 13, H: 6, mastiles: [6.2], timon: [2.9, 5], escotilla: [8.8, 5], pasarela: [8.2, 21.25], bajada: [[8.2, 21.8], 'down'], sprite: [4.2, 20.9, 7], tablon: 21,
    visible: () => !!(F.refuerzos || F.invitacion), cosas: [['barrel', 4.2, 3.2], ['crate', 11, 5.6], ['soga', 10.2, 3.4]],
    subir: () => null, cerrada: () => !F.zarpado && 'La escotilla tiene un candado. El forastero lleva la llave colgada del cuello.',
    bajo: { w: 8, h: 6, cuartos: [['Camarote', 0, 0, 8, 6, 'madera']], paredes: [], puertas: [[3.5, 0, 'h', 1, 'cubierta']], ventanas: [[0, 2.5, 'v', 1, 'O'], [8, 2.5, 'v', 1, 'E']],
      muebles: [['Cama', 0.3, 3.3, 1.6, 2.4], ['Escritorio', 5.2, 0.4, 2.4, 1.1], ['Baúl', 0.4, 0.5, 1.4, 0.9], ['Estantes', 2.1, 0.2, 1.2, 0.8], ['Mesita', 2.2, 4.6, 0.9, 0.9], ['Barril', 6.8, 4.6, 0.9, 1]] } },
  gaviota: { n: 'Gaviota Blanca', estilo: 'marina', L: 20, H: 8, mastiles: [7.5, 13.5], timon: [3.2, 6], escotilla: [10.5, 4.6], pasarela: [3, 28.85], bajada: [[3, 28.4], 'up'], sprite: [0.6, 31.9, 9], tablon: 29, canones: true,
    visible: () => !!F.refuerzos, cosas: [['barrel', 5, 3.2], ['barrel', 5.8, 3.1], ['crate', 17, 7.6], ['soga', 16, 3.6]],
    subir: () => null, cerrada: () => !F.zarpado && 'Un marine se cruza de brazos: «Abajo solo la tripulación, chaval.»',
    bajo: { w: 12, h: 6, cuartos: [['Literas', 0, 0, 12, 6, 'madera']], paredes: [], puertas: [[5.5, 0, 'h', 1, 'cubierta']], ventanas: [[0, 2.5, 'v', 1, 'O'], [12, 2.5, 'v', 1, 'E']],
      muebles: [['Cama', 0.3, 0.6, 1.4, 2.2], ['Cama', 0.3, 3.4, 1.4, 2.2], ['Cama', 10.3, 0.6, 1.4, 2.2], ['Cama', 10.3, 3.4, 1.4, 2.2], ['Mesa', 4.6, 3.6, 2.8, 1.3], ['Baúl', 2.2, 0.5, 1.2, 0.8], ['Baúl', 8.6, 0.5, 1.2, 0.8], ['Barriles', 8.4, 4.4, 1.3, 1.3]] } },
};
const MARGEN = 2; // casillas de mar alrededor del casco en la escena de cubierta
function casco(def) { const x0 = MARGEN * T, x1 = (MARGEN + def.L) * T, y0 = MARGEN * T, y1 = (MARGEN + def.H) * T, ym = (y0 + y1) / 2;
  return [[x0 + .7 * T, y0], [x1 - 2.6 * T, y0], [x1 - .8 * T, ym - .9 * T], [x1, ym], [x1 - .8 * T, ym + .9 * T], [x1 - 2.6 * T, y1], [x0 + .7 * T, y1], [x0, y1 - .9 * T], [x0, y0 + .9 * T]]; }
function construirBarco(id) {
  const def = BARCOS[id], W = (def.L + 2 * MARGEN) * T, H = (def.H + 2 * MARGEN + 1) * T, [c, g] = mkCanvas(W, H), O = '#1a1210', P = casco(def), M = def.estilo === 'marina';
  const items = [], blocks = [], fires = [], doors = [], dentroP = P.map(([x, y]) => [x + (x < W / 2 ? 9 : -9), y + (y < H / 2 ? 9 : -9)]);
  // casco y borda
  g.fillStyle = 'rgba(0,15,35,.35)'; poly(g, P.map(([x, y]) => [x + 6, y + 10])); g.fill();
  poly(g, P); g.fillStyle = O; g.fill(); g.lineWidth = 4; g.strokeStyle = O; g.stroke();
  poly(g, P); g.fillStyle = M ? '#e8ecf2' : '#2c2c34'; g.fill();
  const inner = P.map(([x, y]) => [x + (x < W / 2 ? 7 : x > W / 2 ? -7 : 0), y + (y < H / 2 ? 7 : -7)]);
  g.save(); poly(g, inner); g.clip(); g.fillStyle = pat(g, R.planks); g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 1; for (let y = MARGEN * T; y < H; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  for (let k = 0; k < 160; k++) { g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(hash(k, 1, 71) * W | 0, (MARGEN * T + hash(k, 2, 71) * def.H * T) | 0, 1, 1); }
  const gr = g.createLinearGradient(0, MARGEN * T, 0, (MARGEN + def.H) * T); gr.addColorStop(0, 'rgba(255,255,255,.08)'); gr.addColorStop(1, 'rgba(0,0,0,.18)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
  g.strokeStyle = M ? '#2f4f9a' : '#8a2a2a'; g.lineWidth = 2; poly(g, P.map(([x, y]) => [x + (x < W / 2 ? 3 : -3), y + (y < H / 2 ? 3 : -3)])); g.stroke();
  for (let i = 0; i < P.length; i++) { const [a, b] = [P[i], P[(i + 1) % P.length]], L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let d = 10; d < L - 6; d += 26) { const x = a[0] + (b[0] - a[0]) * d / L, y = a[1] + (b[1] - a[1]) * d / L; g.fillStyle = O; g.fillRect(x - 2, y - 2, 5, 5); g.fillStyle = M ? '#ffffff' : '#4a4a56'; g.fillRect(x - 1, y - 1, 3, 3); } }
  // escotilla
  const [ex, ey] = def.escotilla.map(v => (v + MARGEN) * T); g.fillStyle = O; g.fillRect(ex - 16, ey - 16, 32, 32); g.fillStyle = '#4a3020'; g.fillRect(ex - 14, ey - 14, 28, 28); g.fillStyle = '#2a1a10'; for (let k = 0; k < 4; k++) g.fillRect(ex - 14, ey - 12 + k * 7, 28, 2); g.fillStyle = '#c8962e'; g.fillRect(ex - 3, ey + 9, 6, 4);
  // timón
  const [tx, ty] = def.timon.map(v => (v + MARGEN) * T); items.push({ key: ty + 4, fn: gg => { gg.fillStyle = '#4a2c18'; gg.fillRect(tx - 3, ty - 18, 6, 20); gg.strokeStyle = O; gg.lineWidth = 4; gg.beginPath(); gg.arc(tx, ty - 26, 12, 0, 7); gg.stroke(); gg.strokeStyle = '#8a5a34'; gg.lineWidth = 2.5; gg.stroke();
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; gg.beginPath(); gg.moveTo(tx, ty - 26); gg.lineTo(tx + Math.cos(a) * 16, ty - 26 + Math.sin(a) * 16); gg.stroke(); } gg.fillStyle = '#c8962e'; gg.beginPath(); gg.arc(tx, ty - 26, 3, 0, 7); gg.fill(); } }); blocks.push([tx - 10, ty - 8, 20, 10]);
  // mástiles: el palo sube por encima de la cubierta, con la vela recogida en la verga
  for (const mxT of def.mastiles) { const mx = (mxT + MARGEN) * T, my = (MARGEN + def.H / 2) * T + 4;
    g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(mx + 4, my + 4, 12, 6, 0, 0, 7); g.fill();
    items.push({ key: my, fn: gg => { gg.fillStyle = O; gg.fillRect(mx - 6, my - 190, 12, 192); gg.fillStyle = '#6a4228'; gg.fillRect(mx - 4, my - 190, 8, 190); gg.fillStyle = '#8a5a34'; gg.fillRect(mx - 4, my - 190, 2, 190);
      for (const [yy, w] of [[my - 170, 120], [my - 100, 150]]) { gg.fillStyle = O; gg.fillRect(mx - w / 2, yy - 4, w, 8); gg.fillStyle = M ? '#f0f2f6' : def.estilo === 'corneja' ? '#3a3a42' : '#2a2428'; gg.beginPath(); gg.ellipse(mx, yy + 2, w / 2 - 4, 7, 0, 0, 7); gg.fill(); gg.strokeStyle = 'rgba(0,0,0,.35)'; gg.lineWidth = 1; for (let k = -2; k <= 2; k++) { gg.beginPath(); gg.moveTo(mx + k * w / 6, yy - 4); gg.lineTo(mx + k * w / 6 + 2, yy + 8); gg.stroke(); } }
      gg.fillStyle = O; gg.fillRect(mx - 14, my - 140, 28, 6); gg.fillStyle = '#ffd98a'; gg.fillRect(mx + 6, my - 60, 6, 8); } });
    blocks.push([mx - 9, my - 8, 18, 12]); fires.push({ x: mx + 9, y: my - 56, r: 90, kind: 'vela' }); }
  // cañones a lo largo de la borda (barco de la Marina)
  if (def.canones) for (let k = 0; k < 4; k++) for (const s of [-1, 1]) { const cx2 = (MARGEN + 5 + k * 3.2) * T, cy2 = s < 0 ? (MARGEN + .7) * T : (MARGEN + def.H - .5) * T;
    items.push({ key: cy2 + 8, fn: gg => { gg.fillStyle = '#4a2c18'; gg.fillRect(cx2 - 10, cy2 - 4, 20, 10); gg.fillStyle = O; gg.fillRect(cx2 - 5, cy2 - 4 + (s < 0 ? -12 : 4), 10, 14); gg.fillStyle = '#3a3a44'; gg.fillRect(cx2 - 4, cy2 - 3 + (s < 0 ? -12 : 4), 8, 12); gg.fillStyle = '#6a6a78'; gg.fillRect(cx2 - 4, cy2 - 3 + (s < 0 ? -12 : 4), 2, 12); } }); blocks.push([cx2 - 10, cy2 - 6, 20, 12]); }
  for (const [k, x, y] of def.cosas) { const r = R[k] || RD[k]; const px = (x + MARGEN) * T, py = (y + MARGEN) * T; items.push({ img: r, x: px - r[3] / 2, y: py - r[4], key: py }); blocks.push([px - r[3] / 2 + 3, py - 10, r[3] - 6, 10]); }
  // pasarela al muelle (solo amarrado)
  const pxp = (def.pasarelaCubierta || 6.5) * T + MARGEN * T, pyp = (MARGEN + def.H) * T;
  const S0 = { id: id + ':cubierta', name: def.n + ' · Cubierta', bid: id, rooms: [{ n: 'Cubierta' }], canvas: c, w: W, h: H, blocks, items, fires, lights: [], doors, X: v => v * T, Y: v => v * T, area: [0, 0, W, H], mar: true,
    dentro: (x, y) => inPoly([x, y], dentroP) || (S0.amarrado && x > pxp - 14 && x < pxp + 14 && y > pyp - 12 && y < H), amarrado: true };
  items.push({ key: H, fn: gg => { if (!S0.amarrado) return; gg.fillStyle = '#2a1a10'; gg.fillRect(pxp - 12, pyp - 8, 24, H - pyp + 8); gg.fillStyle = '#8a5a34'; gg.fillRect(pxp - 10, pyp - 8, 20, H - pyp + 8); gg.fillStyle = '#5a3a22'; for (let y = pyp - 4; y < H; y += 7) gg.fillRect(pxp - 10, y, 20, 1); } });
  S0.pasarela = { r: [pxp - 16, H - 26, 32, 26], look: 'down', to: 'town', salida: [def.bajada[0].map(v => v * T), def.bajada[1]], entra: [[pxp, pyp - 14], 'up'] };
  doors.push(S0.pasarela);
  // bajo cubierta
  const B = buildInteriors({ id, n: def.n, int: def.bajo }), bajo = B.scenes[0], puerta = bajo.doors.find(d => d.to === 'town');
  puerta.to = S0.id; puerta.at = [[ex, ey + 26], 'down']; bajo.name = def.n + ' · ' + def.bajo.cuartos[0][0];
  doors.push({ r: [ex - 18, ey - 18, 36, 36], look: 'down', to: bajo.id, at: bajo.doorArrival(...puerta.args), cerrada: def.cerrada });
  return { scenes: [S0, ...B.scenes], entrance: S0, sceneOfPt: B.sceneOfPt, def };
}
// dibujo en el pueblo: el barco amarrado, solo cuando corresponde
function barcosEnPueblo() { for (const [id, def] of Object.entries(BARCOS)) { const [x, wl, L] = def.sprite, s = barcoSprite(def.estilo, x * T, wl * T, L * T); s.visible = def.visible; WORLD.sprites.push(s);
  const [px] = def.pasarela.map(v => v * T), a = def.tablon * T, b = wl * T - 56, top = Math.min(a, b) - 2, bot = Math.max(a, b) + 2, [c, g] = mkCanvas(18, bot - top); g.fillStyle = '#2a1a10'; g.fillRect(0, 0, 18, c.height); g.fillStyle = '#8a5a34'; g.fillRect(2, 0, 14, c.height); g.fillStyle = '#5a3a22'; for (let y = 4; y < c.height; y += 7) g.fillRect(2, y, 14, 1);
  WORLD.sprites.push({ canvas: c, x: px - 9, y: top, key: Math.max(top + 2, wl * T + 6), visible: def.visible }); } }
// pasarela más cercana (en el pueblo)
function pasarelaCerca() { for (const [id, def] of Object.entries(BARCOS)) { if (!def.visible()) continue; const [px, py] = def.pasarela.map(v => v * T); if (Math.hypot(G.x - px, G.y - py) < 26) return { type: 'barco', id, def }; } return null; }
function subirA(id) { const def = BARCOS[id], no = def.subir(); if (no) return note(no); const s = bld(id).entrance; fade(() => enter(s.id, ...s.pasarela.entra)); }
