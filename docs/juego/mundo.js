// Kalé construida desde plano.json con piezas LPC. Todo se mide en casillas de 32 px.
// Capas: mar animado, suelo (estático), sombras según el sol, objetos y personajes ordenados por su base, luz.
const T = 32;
const ATLAS = { ter: 'assets/terreno.png', ext: 'assets/exterior.png', obj: 'assets/objetos.png', int: 'assets/interior.png', cab: 'assets/cabana.png', paja: 'assets/paja.png', pue: 'assets/puertas.png', casa: 'assets/casa.png' };
const A = {};
const R = { // recortes exactos [atlas, x, y, w, h]
  grass: [['ter', 0, 352, 32, 32], ['ter', 32, 352, 32, 32], ['ter', 64, 352, 32, 32]], flowers: ['ter', 128, 352, 32, 32],
  dirt: ['ter', 32, 96, 32, 32], sand: ['ter', 608, 288, 32, 32], water: ['ter', 896, 160, 32, 32], cobble: ['ter', 224, 448, 32, 32], rock: ['ter', 416, 96, 32, 32],
  slate: ['ext', 128, 384, 32, 32], stonewall: ['ext', 32, 96, 32, 32], planks: ['int', 64, 928, 32, 32], thatch: ['paja', 0, 128, 64, 64], cottage: ['cab', 0, 128, 96, 96],
  door: { azul: ['pue', 144, 256, 32, 48], verde: ['pue', 208, 256, 32, 48], roja: ['pue', 80, 256, 32, 48], marron: ['pue', 16, 256, 32, 48] },
  win: ['ext', 544, 192, 32, 32], winTall: ['ext', 576, 202, 32, 44], flowerbox: ['ext', 369, 101, 35, 22], step: ['ext', 192, 352, 32, 24], chimney: ['casa', 192, 0, 32, 64],
  crown: ['obj', 194, 0, 94, 80], trunk: ['obj', 17, 448, 64, 73], barrel: ['obj', 963, 24, 26, 36], woodpile: ['obj', 487, 453, 52, 55], logs: ['obj', 434, 448, 30, 32],
  sacks: ['obj', 480, 513, 64, 63], sack: ['obj', 432, 513, 32, 31], crate: ['obj', 751, 368, 34, 33], fish: ['obj', 988, 648, 28, 16], tuna: ['obj', 874, 961, 48, 29],
  boat: ['obj', 741, 898, 123, 63], boat2: ['obj', 609, 960, 127, 61], cart: ['obj', 288, 805, 64, 55], hay: ['obj', 323, 561, 57, 78], stump: ['obj', 432, 583, 32, 25],
  fence: ['obj', 108, 544, 72, 25], veg: [['obj', 865, 221, 31, 33], ['obj', 897, 169, 31, 20], ['obj', 709, 324, 25, 25]], wellRing: ['ext', 832, 465, 64, 47], windlass: ['ext', 852, 568, 101, 64],
  wallUp: ['int', 0, 224, 32, 32], wainscot: ['int', 288, 864, 32, 32], floorWood: ['int', 64, 928, 32, 32], floorStone: ['int', 0, 864, 96, 48], rug: ['int', 320, 928, 96, 96],
  fireplace: ['int', 364, 298, 72, 70], flame: ['int', 994, 675, 30, 29], kitchen: ['int', 832, 96, 128, 64], stoveTop: ['int', 832, 96, 96, 64], pots: ['int', 864, 256, 32, 27],
  table: ['int', 456, 192, 48, 80], longTable: ['int', 840, 438, 80, 42], chairFront: ['int', 515, 364, 26, 36], chairBack: ['int', 547, 373, 26, 27], plate: ['int', 997, 229, 22, 13],
  jars: ['int', 546, 416, 28, 64], plant: ['int', 896, 359, 32, 57], books: ['int', 672, 192, 32, 64], dishes: ['int', 704, 192, 32, 64], dresser: ['int', 512, 190, 64, 50],
  wardrobe: ['int', 514, 112, 60, 64], bedM: ['int', 840, 14, 48, 82], bedA: ['int', 680, 505, 48, 71], smallTable: ['int', 768, 416, 32, 30], lamp: ['int', 964, 288, 24, 31],
  stove: ['int', 832, 256, 32, 66], stool: ['int', 420, 384, 24, 32], rtable: ['int', 768, 416, 32, 30],
};
// ---------- utilidades ----------
const hash = (x, y, s = 0) => { let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s, 982451653)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const mkCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; };
const put = (g, r, x, y) => g.drawImage(A[r[0]], r[1], r[2], r[3], r[4], Math.round(x), Math.round(y), r[3], r[4]);
const putAt = (g, r, cx, by) => put(g, r, cx - r[3] / 2, by - r[4]); // apoyado: centro abajo
const patterns = {};
const pat = (g, r, rot) => { const k = r.join() + (rot || ''); if (!patterns[k]) { const [c, cg] = rot ? mkCanvas(r[4], r[3]) : mkCanvas(r[3], r[4]); if (rot) { cg.translate(r[4], 0); cg.rotate(Math.PI / 2); } put(cg, r, 0, 0); patterns[k] = c; } return g.createPattern(patterns[k], 'repeat'); };
function nine(g, r, k, x, y, w, h) {
  const [a, sx, sy, sw, sh] = r, im = A[a], tile = (px, py, pw, ph, dx, dy, dw, dh) => { for (let j = 0; j < dh; j += ph) for (let i = 0; i < dw; i += pw) { const cw = Math.min(pw, dw - i), ch = Math.min(ph, dh - j); g.drawImage(im, px, py, cw, ch, dx + i, dy + j, cw, ch); } };
  tile(sx + k, sy + k, sw - 2 * k, sh - 2 * k, x + k, y + k, w - 2 * k, h - 2 * k);
  tile(sx + k, sy, sw - 2 * k, k, x + k, y, w - 2 * k, k); tile(sx + k, sy + sh - k, sw - 2 * k, k, x + k, y + h - k, w - 2 * k, k);
  tile(sx, sy + k, k, sh - 2 * k, x, y + k, k, h - 2 * k); tile(sx + sw - k, sy + k, k, sh - 2 * k, x + w - k, y + k, k, h - 2 * k);
  g.drawImage(im, sx, sy, k, k, x, y, k, k); g.drawImage(im, sx + sw - k, sy, k, k, x + w - k, y, k, k); g.drawImage(im, sx, sy + sh - k, k, k, x, y + h - k, k, k); g.drawImage(im, sx + sw - k, sy + sh - k, k, k, x + w - k, y + h - k, k, k);
}
const poly = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); };
function inPoly([x, y], pts) { let c = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; }
// borde natural: subdivide cada lado y lo mueve un poco, siempre igual
function wobble(pts, amp, seed) { const out = []; pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 12));
  for (let k = 0; k < n; k++) { const t = k / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; out.push([x + (hash(x, y, seed) - .5) * amp, y + (hash(y, x, seed + 1) - .5) * amp]); } }); return out; }
function hull(pts) { pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = [];
  for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (const p of pts.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); } return lo.slice(0, -1).concat(up.slice(0, -1)); }

// ---------- el sol ----------
// 6 h sol al este, 12 h al sur, 18 h al oeste. Devuelve el corrimiento de la sombra por cada píxel de altura.
function sun(h) { const a = Math.PI * (h - 6) / 12; if (h < 6.2 || h > 17.8) return null; const elev = Math.sin(a); return { dx: -Math.cos(a) * (1.1 - elev * .7), dy: -(.25 + elev * .25), alpha: .16 + elev * .12 }; }
function ambient(h) { // color sobre el mundo según la hora
  const k = [[0, [18, 26, 70, .58]], [5, [18, 26, 70, .58]], [6.3, [255, 150, 110, .22]], [8, [255, 210, 160, .06]], [10, [0, 0, 0, 0]], [16, [0, 0, 0, 0]], [17.6, [255, 150, 70, .16]], [19, [190, 80, 90, .3]], [20.3, [18, 26, 70, .55]], [24, [18, 26, 70, .58]]];
  for (let i = 0; i < k.length - 1; i++) if (h >= k[i][0] && h <= k[i + 1][0]) { const t = (h - k[i][0]) / (k[i + 1][0] - k[i][0]); return k[i][1].map((v, j) => v + (k[i + 1][1][j] - v) * t); } return [0, 0, 0, 0]; }
const isNight = h => h < 6.4 || h > 19.2;

// ---------- edificios ----------
const ROOFS = { paja: { tex: R.thatch, tint: null }, tejas: { tex: R.slate, tint: '#c4643f' }, pizarra: { tex: R.slate, tint: null }, 'pizarra-azul': { tex: R.slate, tint: '#6f8fc4' }, tablas: { tex: R.planks, tint: '#a07850', rot: true } };
function drawRoof(g, x, y, w, h, kind) {
  const rf = ROOFS[kind] || ROOFS.pizarra, ry = Math.round(h * .36), rx = Math.round(Math.min(h * .6, w * .3));
  const back = [[x, y], [x + w, y], [x + w - rx, y + ry], [x + rx, y + ry]], left = [[x, y], [x + rx, y + ry], [x, y + h]], right = [[x + w, y], [x + w, y + h], [x + w - rx, y + ry]], front = [[x + rx, y + ry], [x + w - rx, y + ry], [x + w, y + h], [x, y + h]];
  g.save(); g.fillStyle = pat(g, rf.tex, rf.rot); g.fillRect(x, y, w, h);
  if (rf.tint) { g.globalCompositeOperation = 'multiply'; g.fillStyle = rf.tint; g.fillRect(x, y, w, h); g.globalCompositeOperation = 'source-over'; }
  if (kind === 'paja') for (let i = 0; i < w * h / 26; i++) { const px = x + hash(i, w, 3) * w, py = y + hash(i, h, 4) * h; g.fillStyle = hash(i, 9, 5) < .5 ? 'rgba(120,80,20,.35)' : 'rgba(255,240,180,.35)'; g.fillRect(Math.round(px), Math.round(py), 1, 3 + Math.round(hash(i, 2, 6) * 4)); }
  for (const [pts, c] of [[back, 'rgba(255,255,255,.16)'], [left, 'rgba(255,240,200,.07)'], [right, 'rgba(0,0,0,.26)'], [front, 'rgba(0,0,0,.04)']]) { poly(g, pts); g.fillStyle = c; g.fill(); }
  g.strokeStyle = 'rgba(30,18,10,.45)'; g.lineWidth = 1; for (const [a, b] of [[back[0], back[3]], [back[1], back[2]], [front[0], front[3]], [front[1], front[2]]]) { g.beginPath(); g.moveTo(a[0] + .5, a[1] + .5); g.lineTo(b[0] + .5, b[1] + .5); g.stroke(); }
  g.strokeStyle = 'rgba(255,250,220,.45)'; g.beginPath(); g.moveTo(x + rx, y + ry - .5); g.lineTo(x + w - rx, y + ry - .5); g.stroke();
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(x, y + h - 5, w, 5); g.fillStyle = '#2a1a12'; g.fillRect(x, y + h - 1, w, 1); g.strokeStyle = '#2a1a12'; g.strokeRect(x + .5, y + .5, w - 1, h - 1); g.restore();
  return { ridgeY: y + ry };
}
function drawFacade(g, x, y, w, h, kind) {
  if (kind === 'entramado') nine(g, R.cottage, 32, x, y, w, h);
  else { g.fillStyle = kind === 'piedra' ? pat(g, R.stonewall) : pat(g, R.planks, true); g.fillRect(x, y, w, h);
    if (kind === 'madera') { g.fillStyle = 'rgba(70,40,20,.25)'; g.fillRect(x, y, w, h); for (let px = x; px <= x + w - 6; px += 3 * T) { g.fillStyle = '#4a2c18'; g.fillRect(px, y, 6, h); g.fillStyle = '#7a5030'; g.fillRect(px + 1, y, 2, h); } g.fillStyle = '#4a2c18'; g.fillRect(x + w - 6, y, 6, h); }
    else { for (let py = y; py < y + h; py += 16) for (const px of [x, x + w - 12]) { g.fillStyle = (py / 16) % 2 ? '#c9c4bc' : '#b3ada5'; g.fillRect(px, py, 12, 15); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(px, py + 15, 12, 1); } } }
  const gr = g.createLinearGradient(0, y, 0, y + 12); gr.addColorStop(0, 'rgba(0,0,0,.42)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x, y, w, 12);
  g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x + w - 5, y, 5, h);
  g.fillStyle = '#8a8478'; g.fillRect(x, y + h - 6, w, 6); g.fillStyle = '#6a6458'; g.fillRect(x, y + h - 1, w, 1); g.fillStyle = '#b0aa9e'; g.fillRect(x, y + h - 6, w, 1);
  g.strokeStyle = '#2a1a12'; g.strokeRect(x + .5, y + .5, w - 1, h - 1);
}
function drawSign(g, cx, y, icon) {
  g.fillStyle = '#3a2418'; g.fillRect(cx - 1, y - 6, 2, 6); g.fillRect(cx - 12, y - 7, 24, 2);
  g.fillStyle = '#2a1a12'; g.fillRect(cx - 15, y, 30, 18); g.fillStyle = '#8a5a34'; g.fillRect(cx - 14, y + 1, 28, 16); g.fillStyle = '#a8744a'; g.fillRect(cx - 14, y + 1, 28, 2);
  g.fillStyle = '#f2d27a';
  if (icon === 'jarra') { g.fillRect(cx - 5, y + 5, 8, 9); g.fillStyle = '#fff6dc'; g.fillRect(cx - 5, y + 4, 8, 3); g.fillStyle = '#f2d27a'; g.fillRect(cx + 3, y + 7, 3, 1); g.fillRect(cx + 5, y + 7, 1, 5); g.fillRect(cx + 3, y + 11, 3, 1); }
  else if (icon === 'ancla') { g.fillRect(cx - 1, y + 3, 2, 11); g.fillRect(cx - 4, y + 5, 8, 2); g.fillRect(cx - 6, y + 12, 12, 2); g.fillRect(cx - 6, y + 10, 2, 2); g.fillRect(cx + 4, y + 10, 2, 2); }
  else { g.fillRect(cx - 8, y + 7, 16, 6); g.fillStyle = '#c88a3a'; g.fillRect(cx - 8, y + 11, 16, 2); g.fillStyle = '#fff2c0'; g.fillRect(cx - 5, y + 8, 2, 2); g.fillRect(cx + 1, y + 8, 2, 2); }
}
const DOORCOLOR = { casa: 'azul', taberna: 'marron', brin: 'verde', tienda: 'roja', medico: 'verde', faro: 'roja', panaderia: 'azul', marina: 'marron', pura: 'verde', rosa: 'roja' };
const SIGN = { taberna: 'jarra', tienda: 'ancla', panaderia: 'pan' };
function buildBuilding(b) {
  const e = b.ext, wx = e.x * T, wy = e.y * T, w = e.w * T, base = (e.y + e.d) * T, over = T / 2;
  if (e.redondo) return buildLighthouse(b);
  const FH = 3 * T, roofH = (e.d - 3) * T + over + 10, top = wy - over, extra = e.pilotes ? 18 : 0;
  const [c, g] = mkCanvas(w + 2 * over, base - top + extra), ox = over;
  if (e.pilotes) for (let px = 4; px < w; px += 30) { g.fillStyle = '#3a2418'; g.fillRect(ox + px, base - top - 4, 6, extra + 4); g.fillStyle = '#6a4228'; g.fillRect(ox + px + 1, base - top - 4, 2, extra + 4); }
  const fy = roofH - 10;
  drawFacade(g, ox, fy, w, FH, e.fachada);
  const { ridgeY } = drawRoof(g, 0, 0, w + 2 * over, roofH, e.techo);
  if (e.chimenea != null) put(g, R.chimney, ox + e.chimenea * T - 16, ridgeY - 50);
  const wins = [];
  for (const wv of e.ventanas) { const cx = ox + wv * T; put(g, R.win, cx - 16, fy + 26); if (e.fachada !== 'piedra' || b.id === 'pura') put(g, R.flowerbox, cx - 17, fy + 54); wins.push([wx + wv * T - 13, wy - over + fy + 29, 26, 24]); }
  const dc = ox + e.puerta * T; put(g, R.door[DOORCOLOR[b.id] || 'marron'], dc - 16, fy + FH - 6 - 48 + 4);
  if (SIGN[b.id]) drawSign(g, dc + 34, fy + 18, SIGN[b.id]);
  if (e.bandera) { const px = ox + w - 20; g.fillStyle = '#3a3a44'; g.fillRect(px, -2, 3, ridgeY + 20); g.fillStyle = '#2f6fb7'; g.fillRect(px + 3, 0, 26, 16); g.fillStyle = '#fff'; g.fillRect(px + 10, 6, 12, 2); g.fillRect(px + 14, 4, 2, 6); }
  return { id: b.id, b, canvas: c, x: wx - over, y: top, base, foot: [wx, wy + T, w, (e.d - 1) * T], door: [wx + e.puerta * T, base], wins, h: e.d * T + FH };
}
function buildLighthouse(b) {
  const e = b.ext, wx = e.x * T, w = e.w * T, base = (e.y + e.d) * T, H = 6 * T, [c, g] = mkCanvas(w + 16, H + 40), ox = 8, by = H + 40;
  const body = (x, y, ww, hh) => { g.fillStyle = pat(g, R.stonewall); g.fillRect(x, y, ww, hh); const gr = g.createLinearGradient(x, 0, x + ww, 0); gr.addColorStop(0, 'rgba(255,255,255,.25)'); gr.addColorStop(.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(x, y, ww, hh); };
  body(ox + 10, 70, w - 20, by - 70 - 4);
  for (const yy of [110, 170]) { g.globalCompositeOperation = 'multiply'; g.fillStyle = '#d0503c'; g.fillRect(ox + 10, yy, w - 20, 26); g.globalCompositeOperation = 'source-over'; }
  g.fillStyle = '#2a1a12'; g.strokeStyle = '#2a1a12'; g.strokeRect(ox + 10.5, 70.5, w - 21, by - 75);
  g.fillStyle = '#3a3a44'; g.fillRect(ox + 2, 60, w - 4, 10); g.fillStyle = '#5a5a66'; g.fillRect(ox + 2, 60, w - 4, 3);
  g.fillStyle = '#2a2a33'; g.fillRect(ox + 22, 26, w - 44, 34); g.fillStyle = '#f6e7a6'; g.fillRect(ox + 26, 30, w - 52, 26); g.fillStyle = '#2a2a33'; for (let i = 0; i < 3; i++) g.fillRect(ox + 26 + i * (w - 52) / 3, 30, 2, 26);
  poly(g, [[ox + 16, 26], [ox + w / 2, 4], [ox + w - 16, 26]]); g.fillStyle = '#b8402e'; g.fill(); g.strokeStyle = '#2a1a12'; g.stroke();
  for (const yy of [140, 200]) { g.fillStyle = '#1d2733'; g.fillRect(ox + w / 2 - 4, yy, 8, 14); }
  put(g, R.door.roja, ox + e.puerta * T - 16, by - 52); put(g, R.step, ox + e.puerta * T - 16, by - 10);
  return { id: b.id, b, canvas: c, x: wx - ox, y: base - by, base, foot: [wx + 8, (e.y + 1) * T, w - 16, (e.d - 1) * T], door: [wx + e.puerta * T, base], wins: [], lantern: [wx + w / 2, base - by + 42], h: H };
}

// ---------- isla ----------
const WORLD = { ready: false, sprites: [], blocks: [], doors: [], trees: [], lamps: [], foam: [] };
function buildIsland(P) {
  const M = P.mapa, S = p => p.map(([x, y]) => [x * T, y * T]);
  const land = wobble(S(M.costa), 10, 7), beach = wobble(S(M.playa), 8, 8), cliff = wobble(S(M.acantilado), 8, 9);
  WORLD.land = land; WORLD.w = M.w * T; WORLD.h = M.h * T;
  const [c, g] = mkCanvas(WORLD.w, WORLD.h);
  // muelles y su sombra sobre el agua (el mar se dibuja aparte, animado)
  for (const [x, y, w, h] of M.muelle) { g.fillStyle = 'rgba(0,20,40,.3)'; g.fillRect(x * T + 6, y * T + 8, w * T, h * T); }
  g.save(); poly(g, land); g.clip();
  for (let ty = 0; ty < M.h; ty++) for (let tx = 0; tx < M.w; tx++) { const v = hash(tx, ty, 1); put(g, R.grass[v < .55 ? 0 : v < .85 ? 1 : 2], tx * T, ty * T); }
  for (let i = 0; i < 90; i++) { const x = Math.floor(hash(i, 3, 11) * M.w), y = Math.floor(hash(i, 4, 11) * M.h); if ([[0, 0], [1, 0], [0, 1], [1, 1]].every(([a, b]) => inPoly([(x + a * 1.6 - .3) * T, (y + b * 1.6 - .3) * T], land)) && !inPoly([x * T, y * T], beach)) put(g, R.flowers, x * T, y * T); }
  g.strokeStyle = pat(g, R.sand); g.lineWidth = 2.2 * T; poly(g, land); g.stroke();
  g.fillStyle = pat(g, R.sand); poly(g, beach); g.fill();
  g.fillStyle = pat(g, R.rock); poly(g, cliff); g.fill(); g.strokeStyle = 'rgba(30,25,20,.5)'; g.lineWidth = 2; g.stroke();
  // caminos con borde irregular
  for (const cm of M.caminos) { const pts = S(cm.p);
    if (cm.madera) { g.strokeStyle = '#2a1a12'; g.lineWidth = 1.5 * T + 4; } else { g.strokeStyle = 'rgba(80,55,30,.22)'; g.lineWidth = 2 * T + 6; }
    g.lineJoin = g.lineCap = cm.madera ? 'butt' : 'round'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
    g.strokeStyle = cm.madera ? pat(g, R.planks) : pat(g, R.dirt); g.lineWidth = cm.madera ? 1.5 * T : 2 * T; g.stroke();
    if (!cm.madera) for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
      for (let d = 0; d < L; d += 7) for (const s of [-1, 1]) { const k = hash(a[0] + d, a[1] + s, 12); if (k < .6) continue; const off = T - 3 + k * 4, px = a[0] + (b[0] - a[0]) * d / L + nx * s * off, py = a[1] + (b[1] - a[1]) * d / L + ny * s * off; g.fillStyle = pat(g, R.dirt); g.beginPath(); g.arc(px, py, 2 + k * 3, 0, 7); g.fill(); } } }
  // plaza
  const pz = M.plaza; g.fillStyle = 'rgba(40,40,50,.35)'; g.beginPath(); g.arc(pz.x * T, pz.y * T, pz.r * T + 4, 0, 7); g.fill(); g.fillStyle = pat(g, R.cobble); g.beginPath(); g.arc(pz.x * T, pz.y * T, pz.r * T, 0, 7); g.fill(); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#d4c8b2'; g.fill(); g.globalCompositeOperation = 'source-over'; g.strokeStyle = '#8a7e6a'; g.lineWidth = 4; g.stroke();
  g.restore();
  // muelle de tablas, con pilotes
  for (const [x, y, w, h] of M.muelle) { const horiz = w > h; g.fillStyle = pat(g, R.planks, horiz); g.fillRect(x * T, y * T, w * T, h * T); g.strokeStyle = '#2a1a12'; g.lineWidth = 2; g.strokeRect(x * T + 1, y * T + 1, w * T - 2, h * T - 2);
    for (let i = 0; i <= (horiz ? w : h); i += 2) { const px = horiz ? (x + i) * T - 3 : x * T - 4, py = horiz ? (y + h) * T - 2 : (y + i) * T - 3; g.fillStyle = '#3a2418'; g.fillRect(px, py, 7, 7); if (!horiz) g.fillRect((x + w) * T - 3, py, 7, 7); else g.fillRect(px, y * T - 4, 7, 7); } }
  // huerto: surcos y verduras
  const ob = (t) => M.objetos.filter(o => o.t === t);
  for (const o of ob('huerto')) { for (let r = 0; r < o.h * 2; r++) { g.fillStyle = r % 2 ? '#6a4a2c' : '#7d5834'; g.fillRect(o.x * T, o.y * T + r * T / 2, o.w * T, T / 2); } for (let r = 0; r < o.h * 2; r += 2) { const v = R.veg[(r / 2) % 3]; for (let px = 2; px + v[3] <= o.w * T; px += v[3] + 4) put(g, v, o.x * T + px, o.y * T + (r + 1) * T / 2 - v[4] + 4); } }
  for (const o of ob('grada')) { g.fillStyle = pat(g, R.planks); g.fillRect(o.x * T, o.y * T, o.w * T, o.h * T); g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < o.h; i++) g.fillRect(o.x * T, (o.y + i) * T, o.w * T, 2); }
  for (const o of ob('astillero')) { g.fillStyle = 'rgba(90,60,30,.25)'; g.fillRect(o.x * T, o.y * T, o.w * T, o.h * T); for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(220,180,120,.7)'; g.fillRect(o.x * T + hash(i, 1, 30) * o.w * T, o.y * T + hash(i, 2, 30) * o.h * T, 3, 1); } }
  // mercado: toldos con pescado
  for (const o of ob('puestos')) for (let i = 0; i < 3; i++) WORLD.sprites.push(stall((o.x + i * 2.8) * T, o.y * T, i));
  // botes amarrados y el barco de Dorne
  for (const [x, y] of M.botes) put(g, hash(x, y, 2) < .5 ? R.boat : R.boat2, x * T - 60, y * T - 30);
  drawBlackShip(g, ...M.barcoNegro.map(v => v * T));
  WORLD.ground = c;
  WORLD.beach = beach;
  // espuma: puntos sobre la costa
  for (let i = 0; i < land.length; i += 2) WORLD.foam.push(land[i]);
  // edificios
  for (const b of P.edificios) { const s = buildBuilding(b); WORLD.sprites.push({ kind: 'bld', canvas: s.canvas, x: s.x, y: s.y, key: s.base, s }); WORLD.blocks.push(s.foot); WORLD.doors.push(s); }
  // objetos con volumen
  for (const o of M.objetos) {
    if (o.t === 'monumento') WORLD.sprites.push(monument(o.x * T, o.y * T));
    if (o.t === 'tablon') WORLD.sprites.push(noticeBoard(o.x * T, o.y * T));
    if (o.t === 'pozo') { const [cc, cg] = mkCanvas(110, 80); put(cg, R.windlass, 4, 4); put(cg, R.wellRing, 22, 32); cg.fillStyle = '#1d3f6e'; cg.beginPath(); cg.ellipse(54, 48, 21, 9, 0, 0, 7); cg.fill(); cg.fillStyle = 'rgba(170,215,240,.7)'; cg.fillRect(44, 44, 8, 2); WORLD.sprites.push({ canvas: cc, x: o.x * T - 54, y: o.y * T - 64, key: o.y * T + 14 }); WORLD.blocks.push([o.x * T - 32, o.y * T - 20, 64, 34]); }
    if (o.t === 'empalizada') { const x0 = o.x * T, y0 = o.y * T, x1 = (o.x + o.w) * T, y1 = (o.y + o.h) * T, gap = [(o.puerta - 1) * T, (o.puerta + 1) * T];
      for (let x = x0; x < x1; x += 70) { WORLD.sprites.push({ img: R.fence, x, y: y0 - 20, key: y0 }); if (x + 70 <= gap[0] || x >= gap[1]) WORLD.sprites.push({ img: R.fence, x, y: y1 - 20, key: y1 }); }
      for (let y = y0; y < y1; y += 22) for (const x of [x0 - 4, x1 - 4]) WORLD.sprites.push({ rect: [x, y - 20, 6, 24, '#5a3a22'], key: y });
      WORLD.blocks.push([x0, y0 - 6, x1 - x0, 10], [x0, y1 - 6, gap[0] - x0, 10], [gap[1], y1 - 6, x1 - gap[1], 10], [x0 - 4, y0, 8, y1 - y0], [x1 - 4, y0, 8, y1 - y0]); }
    if (o.t === 'astillero') { WORLD.sprites.push(shipyard(o.x * T, o.y * T, o.w * T, o.h * T)); }
  }
  // árboles: el bosquecillo y algunos sueltos, lejos de edificios y caminos
  const bosque = S(M.bosque), free = (x, y) => inPoly([x, y], land) && !WORLD.blocks.some(([a, b, w, h]) => x > a - 40 && x < a + w + 40 && y > b - 30 && y < b + h + 70) && !M.caminos.some(cm => near(cm.p.map(([a, b]) => [a * T, b * T]), x, y) < 2.8 * T) && !WORLD.doors.some(d => Math.hypot(d.door[0] - x, d.door[1] + 2 * T - y) < 3.5 * T) && Math.hypot(x - pz.x * T, y - pz.y * T) > (pz.r + 2) * T && !inPoly([x, y], beach);
  const near = (pts, x, y) => { let m = 1e9; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1))); m = Math.min(m, Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy)); } return m; };
  for (let i = 0; i < 400 && WORLD.trees.length < 46; i++) { const inB = i < 160, x = inB ? (53 + hash(i, 1, 40) * 9) * T : (14 + hash(i, 1, 41) * 47) * T, y = inB ? (6.5 + hash(i, 2, 40) * 7) * T : (5 + hash(i, 2, 41) * 33) * T;
    if ((inB ? inPoly([x, y], bosque) : hash(i, 3, 42) < .5) && free(x, y) && !WORLD.trees.some(t => Math.hypot(t[0] - x, t[1] - y) < 70)) WORLD.trees.push([x, y]); }
  for (const [x, y] of WORLD.trees) { WORLD.sprites.push({ tree: true, x, y, key: y }); WORLD.blocks.push([x - 12, y - 10, 24, 14]); }
  // cosas sueltas que dan vida
  const props = [['barrel', 13.4, 20.4], ['barrel', 14.1, 20.6], ['crate', 6.4, 22.8], ['crate', 7.5, 22.8], ['sacks', 9.9, 23], ['tuna', 3.6, 22.6], ['woodpile', 43.6, 31.6], ['cart', 33.6, 20.4], ['barrel', 30.8, 15.8], ['crate', 31, 33.2], ['logs', 25.5, 35.3], ['stump', 20, 30], ['sack', 18.8, 19.8], ['barrel', 41.8, 18.6]];
  for (const [k, x, y] of props) { const r = R[k]; WORLD.sprites.push({ img: r, x: x * T - r[3] / 2, y: y * T - r[4], key: y * T }); WORLD.blocks.push([x * T - r[3] / 2 + 2, y * T - 12, r[3] - 4, 12]); }
  for (const [x, y] of [[26, 22.8], [34, 22.8], [24.6, 17], [35.4, 25.4], [12.6, 22.8], [50, 22.8], [59.2, 30.4]]) { WORLD.lamps.push([x * T, y * T]); WORLD.sprites.push({ lamp: true, x: x * T, y: y * T, key: y * T }); WORLD.blocks.push([x * T - 4, y * T - 6, 8, 8]); }
  WORLD.ready = true;
}
function stall(x, y, i) { const [c, g] = mkCanvas(76, 70), col = ['#c8402e', '#2f78b7', '#d39418'][i % 3];
  g.fillStyle = '#5a3a22'; g.fillRect(4, 18, 4, 50); g.fillRect(68, 18, 4, 50); put(g, R.crate, 8, 38); put(g, R.crate, 40, 38); put(g, R.fish, 12, 34); put(g, R.fish, 44, 36); put(g, R.fish, 26, 30);
  for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#f4ecd8' : col; g.fillRect(k * 8 + 2, 6, 8, 16); } g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(2, 20, 72, 2); g.strokeStyle = '#2a1a12'; g.strokeRect(2.5, 6.5, 71, 15);
  WORLD.blocks.push([x + 4, y + 40, 68, 28]); return { canvas: c, x, y, key: y + 68 }; }
function monument(x, y) { const [c, g] = mkCanvas(96, 130), cx = 48;
  g.fillStyle = '#6e6a62'; g.fillRect(cx - 38, 96, 76, 26); g.fillStyle = '#a8a298'; g.fillRect(cx - 38, 96, 76, 6); g.fillStyle = '#56524a'; g.fillRect(cx - 38, 118, 76, 4); g.strokeStyle = '#2a1a12'; g.strokeRect(cx - 37.5, 96.5, 75, 25);
  g.fillStyle = '#d6b35a'; g.fillRect(cx - 12, 104, 24, 10); g.fillStyle = '#8a6a2a'; g.fillRect(cx - 9, 108, 18, 1);
  const iron = '#3c3a46', lit = '#6a6878';
  g.fillStyle = iron; g.fillRect(cx - 4, 18, 8, 80); g.fillStyle = lit; g.fillRect(cx - 4, 18, 2, 80);
  g.fillRect(cx - 22, 28, 44, 6); g.fillStyle = iron; g.fillRect(cx - 22, 31, 44, 4);
  g.strokeStyle = iron; g.lineWidth = 5; g.beginPath(); g.arc(cx, 12, 7, 0, 7); g.stroke();
  g.lineWidth = 7; g.beginPath(); g.arc(cx, 70, 32, .15, Math.PI - .15); g.stroke(); g.strokeStyle = lit; g.lineWidth = 2; g.beginPath(); g.arc(cx, 69, 33, .5, Math.PI - .6); g.stroke();
  for (const s of [-1, 1]) { poly(g, [[cx + s * 32, 72], [cx + s * 44, 58], [cx + s * 28, 64]]); g.fillStyle = iron; g.fill(); }
  g.fillStyle = '#8a5a3a'; for (let i = 0; i < 12; i++) g.fillRect(cx + 10 + i * 1.6, 22 + i * 5, 3, 3);
  WORLD.blocks.push([x - 40, y - 6, 80, 30]); return { canvas: c, x: x - cx, y: y - 104, key: y + 18 }; }
function noticeBoard(x, y) { const [c, g] = mkCanvas(48, 56); g.fillStyle = '#4a2c18'; g.fillRect(6, 20, 4, 36); g.fillRect(38, 20, 4, 36); g.fillStyle = '#7a5030'; g.fillRect(2, 4, 44, 30); g.strokeStyle = '#2a1a12'; g.strokeRect(2.5, 4.5, 43, 29);
  for (const [px, py, col] of [[6, 8, '#f4ecd8'], [20, 7, '#efe2bf'], [33, 9, '#f4ecd8']]) { g.fillStyle = col; g.fillRect(px, py, 11, 14); g.fillStyle = '#5a4a3a'; g.fillRect(px + 2, py + 3, 7, 1); g.fillRect(px + 3, py + 6, 5, 4); g.fillRect(px + 2, py + 11, 7, 1); }
  g.fillStyle = '#2f6fb7'; g.fillRect(16, 26, 16, 5); WORLD.blocks.push([x - 22, y - 4, 44, 8]); return { canvas: c, x: x - 24, y: y - 54, key: y + 2 }; }
function shipyard(x, y, w, h) { const [c, g] = mkCanvas(w, h + 20);
  g.fillStyle = '#4a2c18'; for (const px of [6, w / 2 - 3, w - 12]) { g.fillRect(px, 10, 6, h + 6); }
  g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(14, h - 8, w - 28, 14);
  g.strokeStyle = '#6a4228'; g.lineWidth = 4; for (let i = 0; i < 7; i++) { const px = 40 + i * (w - 80) / 6; g.beginPath(); g.moveTo(px, h + 4); g.quadraticCurveTo(px + (i - 3) * 2, 20, px, 16); g.stroke(); }
  g.fillStyle = '#7a5030'; g.fillRect(32, h - 2, w - 64, 8); g.fillStyle = '#9a6a40'; g.fillRect(36, 30, w - 72, 5);
  put(g, R.logs, w - 70, h - 24); put(g, R.logs, w - 44, h - 20);
  WORLD.blocks.push([x + 30, y + h - 10, w - 60, 16]); return { canvas: c, x, y, key: y + h + 8 }; }
function drawBlackShip(g, x, y, w, h) { // fondeado, visto desde arriba, proa al este: casco negro, camarote a popa, velas recogidas y la bandera de la medusa
  g.save(); g.fillStyle = 'rgba(0,10,30,.35)'; g.beginPath(); g.ellipse(x + w / 2 + 10, y + h / 2 + 12, w / 2, h / 2.1, 0, 0, 7); g.fill();
  const hullP = [[x + 4, y + 10], [x + w * .7, y + 4], [x + w * .92, y + h * .3], [x + w + 18, y + h / 2], [x + w * .92, y + h * .7], [x + w * .7, y + h - 4], [x + 4, y + h - 10]];
  poly(g, hullP); g.fillStyle = '#121016'; g.fill(); g.strokeStyle = '#000'; g.lineWidth = 2; g.stroke();
  poly(g, hullP.map(([px, py]) => [x + w / 2 + (px - x - w / 2) * .9, y + h / 2 + (py - y - h / 2) * .78])); g.strokeStyle = '#b08a3a'; g.lineWidth = 1.5; g.stroke(); g.fillStyle = '#2e2620'; g.fill();
  g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1; for (let py = y + 16; py < y + h - 14; py += 6) { g.beginPath(); g.moveTo(x + 16, py); g.lineTo(x + w * .82, py); g.stroke(); }
  g.fillStyle = '#3a2418'; g.fillRect(x + 8, y + 14, w * .16, h - 28); g.strokeStyle = '#b08a3a'; g.strokeRect(x + 8.5, y + 14.5, w * .16 - 1, h - 29); g.fillStyle = '#ffd98a'; g.fillRect(x + 12, y + h / 2 - 4, 4, 3); g.fillRect(x + 12, y + h / 2 + 4, 4, 3);
  g.strokeStyle = '#5a4030'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + w * .95, y + h / 2); g.lineTo(x + w + 40, y + h / 2 - 2); g.stroke();
  for (const mx of [x + w * .38, x + w * .66]) { g.strokeStyle = 'rgba(30,20,10,.7)'; g.lineWidth = 1; for (const ty of [y + 10, y + h - 10]) { g.beginPath(); g.moveTo(mx, y + h / 2); g.lineTo(mx - 14, ty); g.stroke(); }
    g.fillStyle = '#5a4030'; g.fillRect(mx - 2, y + 6, 4, h - 12); g.fillStyle = '#cfc4a8'; g.fillRect(mx - 4, y + 8, 3, h - 16); g.fillStyle = '#9a8e74'; g.fillRect(mx - 2, y + 8, 1, h - 16); g.fillStyle = '#2a1a12'; g.beginPath(); g.arc(mx, y + h / 2, 5, 0, 7); g.fill(); }
  const fx = x - 30, fy = y + h / 2 - 12; g.fillStyle = '#5a4030'; g.fillRect(x + 4, y + h / 2 - 1, -8, 2); g.fillStyle = '#0c0c0c'; g.fillRect(fx, fy, 28, 20); g.fillStyle = '#e8e8e8'; g.beginPath(); g.arc(fx + 14, fy + 8, 4, 0, 7); g.fill(); g.strokeStyle = '#e8e8e8'; g.lineWidth = 1.2;
  for (let k2 = 0; k2 < 6; k2++) { const a = Math.PI * (.12 + k2 * .15); g.beginPath(); g.moveTo(fx + 14 + Math.cos(a) * 4, fy + 8 + Math.sin(a) * 4); g.quadraticCurveTo(fx + 14 + Math.cos(a) * 8, fy + 8 + Math.sin(a) * 8 - 3, fx + 14 + Math.cos(a) * 10, fy + 8 + Math.sin(a) * 10); g.stroke(); }
  g.restore(); }
function drawTree(g, x, y) { put(g, R.trunk, x - 32, y - 66); put(g, R.crown, x - 47, y - 130); }
function drawLamp(g, x, y, night) { g.fillStyle = '#2a2a33'; g.fillRect(x - 2, y - 44, 4, 44); g.fillRect(x - 6, y - 2, 12, 3); g.fillStyle = '#2a2a33'; g.fillRect(x - 7, y - 58, 14, 15); g.fillStyle = night ? '#ffe9a0' : '#c9a85a'; g.fillRect(x - 5, y - 56, 10, 11); g.fillStyle = '#2a2a33'; g.fillRect(x - 8, y - 60, 16, 3); }

// ---------- interiores ----------
// La planta del plano es vista desde arriba. En tres cuartos, cada pared horizontal muestra su cara de 2 casillas,
// así que cada línea de pared agrega 2 filas a la escena. Las ventanas toman la luz según hacia dónde miran.
const WALL = 10;
function buildInterior(b) {
  const I = b.int, hw = I.paredes.filter(([x1, y1, x2, y2]) => y1 === y2), vw = I.paredes.filter(([x1, y1, x2, y2]) => x1 === x2);
  const lines = [[0, 0, I.w], ...hw.map(([x1, y, x2]) => [y, Math.min(x1, x2), Math.max(x1, x2)])];
  const sy = y => y + 2 * lines.filter(l => l[0] <= y + 1e-6).length, X = x => WALL + x * T, Y = y => sy(y) * T;
  const W = I.w * T + 2 * WALL, H = Y(I.h) + WALL, [c, g] = mkCanvas(W, H), blocks = [], items = [], fires = [], lights = [], walk = [];
  // pisos
  for (const [n, x, y, w, h, f] of I.cuartos) { g.fillStyle = f === 'piedra' ? pat(g, R.floorStone) : pat(g, R.floorWood); const closes = lines.some(l => l[0] === y + h && l[1] <= x && l[2] >= x + w); g.fillRect(X(x), Y(y), w * T, Y(y + h) - Y(y) - (closes ? 2 * T : 0)); }
  if (I.redondo) { g.save(); g.globalCompositeOperation = 'destination-in'; g.beginPath(); g.ellipse(W / 2, (H + 2 * T) / 2, W / 2 - 2, (H - 2 * T) / 2, 0, 0, 7); g.rect(0, 0, W, 2 * T + 8); g.fill(); g.restore(); }
  // caras de pared (pared norte y paredes interiores horizontales)
  for (const [ly, x1, x2] of lines) { const top = Y(ly) - 2 * T, x = X(x1), w = (x2 - x1) * T;
    g.fillStyle = pat(g, R.wallUp); g.fillRect(x, top, w, T); g.fillStyle = pat(g, R.wainscot); g.fillRect(x, top + T, w, T);
    g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x, top + 2 * T, w, 5); g.fillStyle = '#24160f'; g.fillRect(x - (ly ? 4 : 0), top - (ly ? 6 : 0), w + (ly ? 8 : 0), ly ? 8 : 6); g.fillStyle = '#4e3424'; g.fillRect(x - (ly ? 4 : 0), top - (ly ? 6 : 0), w + (ly ? 8 : 0), 2);
    blocks.push([x, top - 8, w, 2 * T + 8 - 6]); }
  // paredes verticales (se ven desde arriba como un borde)
  const vTop = y => lines.some(l => Math.abs(l[0] - y) < 1e-6) ? Y(y) - 2 * T - 6 : Y(y), vBot = y => lines.some(l => Math.abs(l[0] - y) < 1e-6) ? Y(y) - 2 * T : Y(y);
  for (const [x, y1, , y2] of vw) { const a = vTop(Math.min(y1, y2)), z = vBot(Math.max(y1, y2)); g.fillStyle = '#24160f'; g.fillRect(X(x) - 4, a, 8, z - a); g.fillStyle = '#4e3424'; g.fillRect(X(x) - 4, a, 2, z - a); blocks.push([X(x) - 5, a, 10, z - a]); }
  // muros exteriores de los costados y de abajo
  g.fillStyle = '#24160f'; g.fillRect(0, 0, WALL, H); g.fillRect(W - WALL, 0, WALL, H); g.fillRect(0, H - WALL, W, WALL); g.fillStyle = '#4e3424'; g.fillRect(WALL - 2, 0, 2, H); g.fillRect(W - WALL, 0, 2, H); g.fillRect(0, H - WALL, W, 2);
  blocks.push([0, 0, WALL + 2, H], [W - WALL - 2, 0, WALL + 2, H]);
  // ventanas
  for (const [x, y, o, len, dir] of I.ventanas) {
    if (o === 'h' && y === 0) { const cx = X(x + len / 2); put(g, R.winTall, cx - 16, Y(0) - 2 * T + 8); if (len > 1.6) { g.fillStyle = pat(g, R.wallUp); g.fillRect(cx - 16, Y(0) - 2 * T + 8, 32, 44); put(g, R.winTall, cx - 32, Y(0) - 2 * T + 8); put(g, R.winTall, cx, Y(0) - 2 * T + 8); } lights.push({ dir, x: cx, y: Y(0) - 2 * T + 30, w: len * T, wall: 'N' }); }
    else if (o === 'h') { const x0 = X(x), yy = H - WALL; g.fillStyle = '#9fd0f0'; g.fillRect(x0, yy + 2, len * T, 5); g.fillStyle = '#e8f6ff'; g.fillRect(x0, yy + 2, len * T, 1); lights.push({ dir, x: x0 + len * T / 2, y: yy, w: len * T, wall: 'S' }); }
    else { const xx = x === 0 ? 0 : W - WALL, y0 = Y(y), hh = len * T; g.fillStyle = '#9fd0f0'; g.fillRect(xx + 2, y0, WALL - 4, hh); g.fillStyle = '#e8f6ff'; g.fillRect(xx + (x === 0 ? WALL - 4 : 2), y0, 2, hh); lights.push({ dir, x: x === 0 ? WALL : W - WALL, y: y0 + hh / 2, w: hh, wall: x === 0 ? 'O' : 'E' }); } }
  // puertas
  const exits = [];
  for (const [x, y, o, len, to] of I.puertas) {
    if (o === 'h' && y === I.h) { const x0 = X(x), w = len * T; g.fillStyle = '#7a6a58'; g.fillRect(x0, H - WALL, w, WALL); g.fillStyle = '#9a3a2a'; g.fillRect(x0 + 2, H - WALL - 14, w - 4, 12); g.fillStyle = '#b8503a'; g.fillRect(x0 + 4, H - WALL - 12, w - 8, 8);
      walk.push([x0, H - WALL - 4, w, WALL + 4]); exits.push({ r: [x0 - 6, H - WALL - 18, w + 12, 26], at: [x0 + w / 2, H - WALL - 22] }); }
    else if (o === 'h') { const x0 = X(x), top = Y(y) - 2 * T; put(g, R.door.verde, x0 + (len * T - 32) / 2, top + 2 * T - 48); g.fillStyle = '#2a1a12'; g.fillRect(x0 + (len * T - 32) / 2 - 2, top + 2 * T - 50, 36, 2); walk.push([x0 + 4, top - 8, len * T - 8, 2 * T + 12]); }
    else { const y0 = Y(y); g.fillStyle = pat(g, R.floorWood); g.fillRect(X(x) - 5, y0, 10, len * T); walk.push([X(x) - 6, y0, 12, len * T]); } }
  // muebles
  const box = ([n, x, y, w, h]) => [X(x), Y(y), w * T, h * T];
  for (const m of I.muebles) furniture(b.id, m[0], box(m), items, blocks, fires, g);
  for (const d of DECOR[b.id] || []) d(g, X, Y);
  return { id: b.id, name: b.n, canvas: c, w: W, h: H, blocks, walk, items, fires, lights, exits, X, Y, area: [WALL, 0, W - 2 * WALL, H - WALL] };
}
// cada etiqueta de la planta se dibuja con su pieza LPC, apoyada en la base de su caja
function furniture(bid, label, [x, y, w, h], items, blocks, fires, g) {
  const L = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''), cx = x + w / 2, by = y + h, add = (r, px, py, solid = true, key) => { items.push({ img: r, x: Math.round(px), y: Math.round(py), key: key ?? py + r[4] }); if (solid) blocks.push([px + 3, py + r[4] * .45, r[3] - 6, r[4] * .55]); };
  const flat = (fn) => fn(g);
  if (L.startsWith('alfombra')) return flat(gg => nine(gg, R.rug, 16, x, y, w, h));
  if (L.startsWith('trampilla')) return flat(gg => { gg.fillStyle = '#3a2418'; gg.fillRect(x, y, 30, 30); gg.fillStyle = '#7a5030'; gg.fillRect(x + 2, y + 2, 26, 26); gg.fillStyle = '#5a3a22'; for (let i = 8; i < 28; i += 7) gg.fillRect(x + 2, y + i, 26, 1); gg.strokeStyle = '#8a8a96'; gg.lineWidth = 2; gg.beginPath(); gg.arc(x + 15, y + 22, 4, 0, 7); gg.stroke(); });
  if (L.startsWith('mapa')) return flat(gg => { gg.fillStyle = '#e8d6a8'; gg.fillRect(x, y - 30, w, 26); gg.fillStyle = '#b89a66'; gg.fillRect(x, y - 5, w, 1); gg.fillStyle = '#7a5a3a'; for (let i = 0; i < 5; i++) gg.fillRect(x + 6 + i * (w - 12) / 5, y - 24 + (i % 2) * 8, 8, 1); gg.fillStyle = '#c8402e'; gg.fillRect(x + w - 14, y - 16, 4, 4); });
  if (L.startsWith('tu cama') || L.startsWith('cama de corso') || L.startsWith('cama del farero') || (L === 'cama' && bid === 'brin')) return add(R.bedA, cx - 24, by - 71 - 6);
  if (L === 'cama') return add(R.bedM, cx - 24, by - 82 - 4);
  if (L.startsWith('silla') || L.startsWith('mecedora')) return add(R.chairFront, cx - 13, by - 36);
  if (L.startsWith('comoda')) { add(R.dresser, cx - 32, by - 50); items.push({ fn: gg => { gg.fillStyle = '#5a3a24'; gg.fillRect(cx - 24, by - 54, 16, 5); gg.fillStyle = '#3a2418'; gg.fillRect(cx - 24, by - 50, 16, 1); }, key: by + 1 }); return; }
  if (L.startsWith('cofre') || L.startsWith('baul')) { items.push({ fn: gg => { gg.fillStyle = '#4a2c1c'; gg.fillRect(cx - 15, by - 18, 30, 18); gg.fillStyle = '#6a4228'; gg.fillRect(cx - 15, by - 18, 30, 6); gg.fillStyle = '#8a8a9a'; gg.fillRect(cx - 15, by - 13, 30, 1); gg.fillRect(cx - 11, by - 18, 2, 18); gg.fillRect(cx + 9, by - 18, 2, 18); gg.fillStyle = '#e6c25e'; gg.fillRect(cx - 2, by - 10, 4, 4); gg.strokeStyle = '#2a1a12'; gg.strokeRect(cx - 14.5, by - 17.5, 29, 17); }, key: by }); blocks.push([cx - 15, by - 14, 30, 14]); return; }
  if (L.startsWith('estante') || L.startsWith('libros')) { for (let px = x; px + 30 <= x + w + 4; px += 32) add(R.books, px, by - 64); return; }
  if (L.startsWith('botellero')) { let i = 0; for (let px = x; px + 30 <= x + w + 4; px += 32) add(i++ % 2 ? R.dishes : R.books, px, by - 64 + 8); return; }
  if (L.startsWith('mesita')) { add(R.smallTable, cx - 16, by - 30); items.push({ fn: gg => { gg.fillStyle = '#f4ecd8'; gg.fillRect(cx - 2, by - 38, 4, 7); gg.fillStyle = '#ffd25a'; gg.fillRect(cx - 1, by - 41, 2, 3); }, key: by + 1 }); fires.push({ x: cx, y: by - 38, r: 40, kind: 'vela' }); return; }
  if (L.startsWith('juguetes')) { add(R.crate, cx - 17, by - 33); items.push({ fn: gg => { gg.fillStyle = '#8a5a34'; gg.fillRect(cx + 14, by - 30, 3, 24); gg.fillRect(cx + 9, by - 25, 13, 3); }, key: by + 1 }); return; }
  if (L.startsWith('fogon y pila')) return add(R.kitchen, cx - 64, by - 64);
  if (L.startsWith('fogon')) return add(R.stoveTop, cx - 48, by - 64);
  if (L.startsWith('alacena') || L.startsWith('despensa') || L.startsWith('remedios')) return add(R.dishes, cx - 16, by - 64);
  if (L.startsWith('chimenea')) { add(R.fireplace, cx - 36, by - 70); items.push({ img: R.flame, x: cx - 15, y: by - 70 + 32, key: by + 1 }); fires.push({ x: cx, y: by - 24, r: 150, kind: 'fuego' }); return; }
  if (L.startsWith('mesa') && w > h * 1.3) { items.push({ img: R.chairFront, x: cx - 34, y: y - 22, key: y + 14 }, { img: R.chairFront, x: cx + 8, y: y - 22, key: y + 14 }); add(R.longTable, cx - 40, by - 42); items.push({ img: R.plate, x: cx - 26, y: by - 36, key: by + 1 }, { img: R.plate, x: cx + 6, y: by - 36, key: by + 1 }, { img: R.fish, x: cx - 12, y: by - 30, key: by + 2 }, { img: R.chairBack, x: cx - 34, y: by - 8, key: by + 18 }, { img: R.chairBack, x: cx + 8, y: by - 8, key: by + 18 }); return; }
  if (L.startsWith('mesa') || L.startsWith('rincon')) { add(R.rtable, cx - 16, by - 34); items.push({ img: R.stool, x: cx - 40, y: by - 32, key: by - 2 }, { img: R.stool, x: cx + 16, y: by - 32, key: by - 2 }, { fn: gg => { gg.fillStyle = '#e6c25e'; gg.fillRect(cx - 6, by - 36, 6, 7); gg.fillStyle = '#fff6dc'; gg.fillRect(cx - 6, by - 37, 6, 2); }, key: by - 1 }); blocks.push([cx - 40, by - 14, 80, 14]); fires.push({ x: cx, y: by - 30, r: L.startsWith('rincon') ? 40 : 70, kind: 'vela' }); return; }
  if (L.startsWith('banco de aparejos')) { add(R.longTable, cx - 40, by - 42); items.push({ img: R.fish, x: cx - 20, y: by - 38, key: by + 1 }, { fn: gg => { gg.strokeStyle = '#b89a6a'; for (let i = 0; i < 6; i++) { gg.beginPath(); gg.moveTo(cx + 2 + i * 4, by - 40); gg.lineTo(cx + i * 4 + 6, by - 26); gg.stroke(); } }, key: by + 1 }); return; }
  if (L.startsWith('banco')) return add(R.longTable, cx - 40, by - 42);
  if (L.startsWith('sacos')) return add(R.sacks, cx - 32, by - 63);
  if (L.startsWith('barriles')) { for (let px = x; px + 24 <= x + w + 4; px += 26) for (let py = by; py - 30 > y - 4; py -= 30) add(R.barrel, px, py - 36); return; }
  if (L.startsWith('barril')) return add(R.barrel, cx - 13, by - 36);
  if (L.startsWith('planta')) return add(R.plant, cx - 16, by - 57);
  if (L.startsWith('barra')) { items.push({ fn: gg => nine(gg, R.dresser, 14, x, by - h - 18, w, h + 18), key: by }); blocks.push([x, by - h - 4, w, h + 4]); items.push({ img: R.plate, x: x + 20, y: by - h - 14, key: by + 1 }, { fn: gg => { for (let i = 0; i < 4; i++) { gg.fillStyle = '#e6c25e'; gg.fillRect(x + 60 + i * 44, by - h - 16, 7, 8); gg.fillStyle = '#fff6dc'; gg.fillRect(x + 60 + i * 44, by - h - 17, 7, 2); } }, key: by + 1 }); return; }
  if (L.startsWith('taburetes')) { for (let px = x; px + 22 <= x + w; px += 34) add(R.stool, px, by - 32, true); return; }
  if (L.startsWith('tarima')) { items.push({ fn: gg => { gg.fillStyle = pat(gg, R.floorWood); gg.fillRect(x, y, w, h - 10); gg.fillStyle = 'rgba(255,230,180,.18)'; gg.fillRect(x, y, w, h - 10); gg.fillStyle = '#4a2c18'; gg.fillRect(x, by - 10, w, 10); gg.fillStyle = '#6a4228'; gg.fillRect(x, by - 10, w, 2); gg.strokeStyle = '#2a1a12'; gg.strokeRect(x + .5, y + .5, w - 1, h - 1); }, key: y }); items.push({ img: R.stool, x: cx - 12, y: y + 10, key: y + 42 }); blocks.push([x, by - 12, w, 12]); return; }
  if (L.startsWith('estufa')) { add(R.stove, cx - 16, by - 66); fires.push({ x: cx, y: by - 30, r: 70, kind: 'fuego' }); return; }
  if (L.startsWith('redes')) return flat(gg => { gg.fillStyle = '#9a8460'; gg.beginPath(); gg.ellipse(cx, by - 12, w / 2 - 4, 12, 0, 0, 7); gg.fill(); gg.strokeStyle = '#6a5a40'; for (let i = -w / 2; i < w / 2; i += 5) { gg.beginPath(); gg.moveTo(cx + i, by - 22); gg.lineTo(cx + i + 6, by - 2); gg.stroke(); } for (const dx of [-14, 6, 18]) { gg.fillStyle = '#c8402e'; gg.beginPath(); gg.arc(cx + dx, by - 12, 3, 0, 7); gg.fill(); } });
  if (L.startsWith('canas')) return flat(gg => { for (let i = 0; i < 3; i++) { gg.strokeStyle = i ? '#9a6a40' : '#c8a070'; gg.lineWidth = 2; gg.beginPath(); gg.moveTo(cx - 4 + i * 4, by); gg.lineTo(cx - 8 + i * 6, y - 20); gg.stroke(); } });
  // sin pieza todavía: un bulto neutro para no dejar el hueco
  items.push({ fn: gg => { gg.fillStyle = '#6a4228'; gg.fillRect(x, y, w, h); gg.strokeStyle = '#2a1a12'; gg.strokeRect(x + .5, y + .5, w - 1, h - 1); }, key: by }); blocks.push([x, y, w, h]);
}
// detalles de cada interior que no son muebles de la planta
const DECOR = {
  casa: [(g, X, Y) => { // el mapa sobre tu cama y los dibujos de Corso, las ollas sobre el fogón
    g.fillStyle = '#e8d6a8'; g.fillRect(X(6.6), Y(0) - 52, 36, 24); g.fillStyle = '#7a5a3a'; for (let i = 0; i < 4; i++) g.fillRect(X(6.6) + 4 + i * 8, Y(0) - 46 + (i % 2) * 6, 6, 1); g.fillStyle = '#c8402e'; g.fillRect(X(6.6) + 26, Y(0) - 40, 3, 3);
    for (const [px, c] of [[12.1, '#4a7ab8'], [12.9, '#c8402e']]) { g.fillStyle = '#f4ecd8'; g.fillRect(X(px), Y(0) - 50, 18, 14); g.fillStyle = c; g.fillRect(X(px) + 3, Y(0) - 42, 12, 2); g.fillRect(X(px) + 8, Y(0) - 47, 2, 6); }
    put(g, R.pots, X(1.4), Y(6) - 2 * T - 2); }],
  taberna: [(g, X, Y) => { put(g, R.pots, X(1), Y(0) - 2 * T); g.fillStyle = '#e8d6a8'; g.fillRect(X(13.2), Y(5.6) - 4, 1, 1); }],
  brin: [(g, X, Y) => { put(g, R.pots, X(4.6), Y(0) - 2 * T - 2); }],
};
