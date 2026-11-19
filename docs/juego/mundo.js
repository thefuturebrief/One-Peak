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
  stove: ['int', 832, 256, 32, 66], stool: ['int', 420, 384, 24, 32], rtable: ['int', 768, 416, 32, 30], desk: ['int', 576, 192, 64, 64],
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
  return { id: b.id, b, canvas: c, x: wx - over, y: top, base, foot: [wx, wy + T, w, (e.d - 1) * T], door: [wx + e.puerta * T, base], wins, h: e.d * T + FH, chim: e.chimenea != null ? [wx + e.chimenea * T, top + ridgeY - 46] : null };
}
function buildLighthouse(b) {
  const e = b.ext, wx = e.x * T, w = e.w * T, base = (e.y + e.d) * T, H = 6.4 * T, PADX = 16, [c, g] = mkCanvas(w + 2 * PADX, H + 56), ox = PADX, by = H + 56, cx = ox + w / 2, O = '#1e1a20';
  const yTop = 92, yBot = by - 18, rTop = w * .30, rBot = w * .42, rx = y => rTop + (rBot - rTop) * (y - yTop) / (yBot - yTop);
  // zócalo de piedra
  g.fillStyle = O; g.fillRect(cx - rBot - 7, yBot - 3, 2 * rBot + 14, 21); g.fillStyle = pat(g, R.stonewall); g.fillRect(cx - rBot - 6, yBot - 2, 2 * rBot + 12, 19); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(cx - rBot - 6, yBot + 12, 2 * rBot + 12, 5); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(cx - rBot - 6, yBot - 2, 2 * rBot + 12, 2);
  // torre: blanco con dos franjas rojas, sombreada como un cilindro
  for (let y = yTop; y < yBot; y++) { const r = rx(y), band = ((y - yTop) / (yBot - yTop) * 5 | 0) % 2 === 1, gr = g.createLinearGradient(cx - r, 0, cx + r, 0);
    const col = band ? ['#e88a72', '#c8402e', '#7a2018'] : ['#ffffff', '#e8e4dc', '#9a968e'];
    gr.addColorStop(0, col[1]); gr.addColorStop(.28, col[0]); gr.addColorStop(.6, col[1]); gr.addColorStop(1, col[2]); g.fillStyle = gr; g.fillRect(cx - r, y, 2 * r, 1); g.fillStyle = O; g.fillRect(cx - r - 1, y, 1, 1); g.fillRect(cx + r, y, 1, 1); }
  for (let k = 1; k < 5; k++) { const y = yTop + (yBot - yTop) * k / 5; g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(cx - rx(y), y | 0, 2 * rx(y), 1); }
  // ventanucos
  for (const y of [yTop + 40, yTop + 100]) { g.fillStyle = O; g.fillRect(cx - 5, y - 1, 10, 16); g.fillStyle = '#2a3a4a'; g.fillRect(cx - 4, y, 8, 14); g.fillStyle = '#6a8aa8'; g.fillRect(cx - 4, y, 3, 5); g.fillStyle = '#c8c0b0'; g.fillRect(cx - 5, y + 14, 10, 2); }
  // balcón con baranda
  g.fillStyle = O; g.fillRect(cx - rTop - 14, yTop - 9, 2 * rTop + 28, 11); g.fillStyle = '#3a3a46'; g.fillRect(cx - rTop - 13, yTop - 8, 2 * rTop + 26, 9); g.fillStyle = '#5a5a68'; g.fillRect(cx - rTop - 13, yTop - 8, 2 * rTop + 26, 2);
  g.fillStyle = '#2a2a33'; for (let k = 0; k < 7; k++) { const t = k / 6; g.fillRect(cx - rTop - 8 + t * (2 * rTop + 16), yTop - 9, 3, 6); } // ménsulas
  g.fillStyle = O; g.fillRect(cx - rTop - 13, yTop - 26, 2 * rTop + 26, 2); for (let px = cx - rTop - 13; px <= cx + rTop + 12; px += 6) g.fillRect(px, yTop - 26, 2, 18);
  // linterna: cristales encendidos y montantes
  const lw = rTop * 1.5; g.fillStyle = O; g.fillRect(cx - lw - 1, yTop - 52, 2 * lw + 2, 45); g.fillStyle = '#2a2a33'; g.fillRect(cx - lw, yTop - 51, 2 * lw, 43);
  const gl = g.createLinearGradient(0, yTop - 48, 0, yTop - 12); gl.addColorStop(0, '#fff6c8'); gl.addColorStop(1, '#f2c65a'); g.fillStyle = gl; g.fillRect(cx - lw + 3, yTop - 48, 2 * lw - 6, 36);
  g.fillStyle = '#2a2a33'; for (let k = 1; k < 4; k++) g.fillRect(cx - lw + 3 + k * (2 * lw - 6) / 4 - 1, yTop - 48, 2, 36); g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(cx - lw + 6, yTop - 46, 3, 14);
  g.fillStyle = '#c8962e'; g.beginPath(); g.arc(cx, yTop - 26, 6, 0, 7); g.fill();
  // cúpula roja con veleta
  g.fillStyle = O; g.beginPath(); g.moveTo(cx - lw - 5, yTop - 51); g.quadraticCurveTo(cx, yTop - 92, cx + lw + 5, yTop - 51); g.fill(); g.fillStyle = '#b8402e'; g.beginPath(); g.moveTo(cx - lw - 3, yTop - 52); g.quadraticCurveTo(cx, yTop - 89, cx + lw + 3, yTop - 52); g.fill();
  g.fillStyle = '#e8705a'; g.beginPath(); g.moveTo(cx - lw + 2, yTop - 54); g.quadraticCurveTo(cx - lw / 2, yTop - 76, cx - 2, yTop - 72); g.lineTo(cx - 4, yTop - 66); g.quadraticCurveTo(cx - lw / 2, yTop - 68, cx - lw + 2, yTop - 54); g.fill();
  g.fillStyle = O; g.fillRect(cx - 1, yTop - 100, 2, 16); g.beginPath(); g.arc(cx, yTop - 84, 3.5, 0, 7); g.fill(); g.fillStyle = '#c8962e'; g.beginPath(); g.arc(cx, yTop - 84, 2.5, 0, 7); g.fill(); g.fillStyle = O; g.beginPath(); g.moveTo(cx, yTop - 98); g.lineTo(cx + 10, yTop - 96); g.lineTo(cx, yTop - 94); g.fill();
  // puerta con peldaño
  const dx = ox + e.puerta * T; put(g, R.door.roja, dx - 16, yBot - 46); g.fillStyle = O; g.fillRect(dx - 18, yBot - 48, 36, 2); put(g, R.step, dx - 16, by - 10);
  return { id: b.id, b, canvas: c, x: wx - ox, y: base - by, base, foot: [wx + 8, (e.y + 1) * T, w - 16, (e.d - 1) * T], door: [wx + e.puerta * T, base], wins: [], lantern: [wx + w / 2, base - by + yTop - 30], h: H };
}

// distancia de un punto a una polilínea
const distPts = (pts, x, y) => { let m = 1e9; for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1))); m = Math.min(m, Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy)); } return m; };
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
  for (let i = 0; i < 5200; i++) { const x = hash(i, 7, 21) * WORLD.w, y = hash(i, 8, 21) * WORLD.h, k = hash(i, 9, 21);
    if (k < .55) { g.fillStyle = k < .3 ? 'rgba(30,70,25,.55)' : 'rgba(150,200,90,.55)'; g.fillRect(x, y, 1, 3); g.fillRect(x + 2, y + 1, 1, 2); g.fillRect(x - 2, y + 1, 1, 2); }
    else if (k < .7) { g.fillStyle = 'rgba(60,110,40,.5)'; for (const [dx, dy] of [[0, 0], [2, 0], [1, -2], [1, 1]]) g.fillRect(x + dx, y + dy, 2, 2); }
    else if (k < .8) { g.fillStyle = ['#fff6dc', '#ffd85a', '#e86a8a', '#9ac8ff', '#d8a0ff'][i % 5]; g.fillRect(x, y, 2, 2); g.fillStyle = 'rgba(40,80,30,.6)'; g.fillRect(x + .5, y + 2, 1, 2); }
    else if (k < .86) { g.fillStyle = 'rgba(40,40,40,.25)'; g.fillRect(x, y + 2, 4, 1); g.fillStyle = '#9a968a'; g.fillRect(x, y, 4, 2); g.fillStyle = '#c8c4b8'; g.fillRect(x, y, 2, 1); }
    else if (k < .9) { g.fillStyle = 'rgba(120,150,60,.35)'; g.beginPath(); g.ellipse(x, y, 6 + k * 6, 3 + k * 2, 0, 0, 7); g.fill(); } }
  g.strokeStyle = pat(g, R.sand); g.lineWidth = 2.2 * T; poly(g, land); g.stroke();
  g.fillStyle = pat(g, R.sand); poly(g, beach); g.fill();
  g.fillStyle = pat(g, R.rock); poly(g, cliff); g.fill(); g.strokeStyle = 'rgba(30,25,20,.5)'; g.lineWidth = 2; g.stroke();
  // caminos: primero todos los bordes y después todos los rellenos, así los cruces son un solo camino
  const tierra = M.caminos.filter(c => !c.madera).map(c => S(c.p)), tablas = M.caminos.filter(c => c.madera).map(c => S(c.p));
  const trazo = pts => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  g.lineJoin = g.lineCap = 'round'; g.strokeStyle = 'rgba(80,55,30,.22)'; g.lineWidth = 2 * T + 6; tierra.forEach(trazo);
  g.strokeStyle = pat(g, R.dirt); g.lineWidth = 2 * T; tierra.forEach(trazo);
  for (const pts of tierra) for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]), nx = -(b[1] - a[1]) / L, ny = (b[0] - a[0]) / L;
    for (let d = 0; d < L; d += 7) for (const s of [-1, 1]) { const k = hash(a[0] + d, a[1] + s, 12); if (k < .6) continue; const off = T - 3 + k * 4, px = a[0] + (b[0] - a[0]) * d / L + nx * s * off, py = a[1] + (b[1] - a[1]) * d / L + ny * s * off;
      if (tierra.some(q => q !== pts && distPts(q, px, py) < T - 2)) continue; g.fillStyle = pat(g, R.dirt); g.beginPath(); g.arc(px, py, 2 + k * 3, 0, 7); g.fill(); } }
  // piedrecitas y huellas sobre la tierra
  for (const pts of tierra) for (let i = 0; i < pts.length - 1; i++) { const [a, b] = [pts[i], pts[i + 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (let d = 0; d < L; d += 11) { const k = hash(a[0] + d, a[1], 13); if (k < .55) continue; const px = a[0] + (b[0] - a[0]) * d / L + (hash(d, a[1], 14) - .5) * T * 1.4, py = a[1] + (b[1] - a[1]) * d / L + (hash(a[0], d, 15) - .5) * T * 1.4;
      g.fillStyle = k > .85 ? 'rgba(60,40,25,.35)' : 'rgba(255,240,210,.35)'; g.fillRect(Math.round(px), Math.round(py), k > .8 ? 2 : 1, 1); } }
  g.lineCap = 'butt'; g.lineJoin = 'miter'; g.strokeStyle = '#2a1a12'; g.lineWidth = 1.5 * T + 4; tablas.forEach(trazo); g.strokeStyle = pat(g, R.planks); g.lineWidth = 1.5 * T; tablas.forEach(trazo);
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
  { const [bx, by, bw, bh] = M.barcoNegro; WORLD.barcoNegro = barcoSprite('pirata', bx * T, (by + bh) * T, bw * T); }
  WORLD.ground = c;
  WORLD.beach = beach;
  // espuma: puntos sobre la costa
  for (let i = 0; i < land.length; i += 2) WORLD.foam.push(land[i]);
  WORLD.sprites.push(WORLD.barcoNegro);
  // edificios
  for (const b of P.edificios) { const s = buildBuilding(b); WORLD.sprites.push({ kind: 'bld', canvas: s.canvas, x: s.x, y: s.y, key: s.base, s }); WORLD.blocks.push(s.foot); WORLD.doors.push(s); }
  // objetos con volumen
  for (const o of M.objetos) {
    if (o.t === 'monumento') WORLD.sprites.push(monument(o.x * T, o.y * T));
    if (o.t === 'tablon') WORLD.sprites.push(noticeBoard(o.x * T, o.y * T));
    if (o.t === 'pozo') { const [cc, cg] = mkCanvas(110, 80); put(cg, R.windlass, 4, 4); put(cg, R.wellRing, 22, 32); cg.fillStyle = '#1d3f6e'; cg.beginPath(); cg.ellipse(54, 48, 21, 9, 0, 0, 7); cg.fill(); cg.fillStyle = 'rgba(170,215,240,.7)'; cg.fillRect(44, 44, 8, 2); WORLD.sprites.push({ canvas: cc, x: o.x * T - 54, y: o.y * T - 64, key: o.y * T + 14 }); WORLD.blocks.push([o.x * T - 32, o.y * T - 20, 64, 34]); }
    if (o.t === 'empalizada') { const x0 = o.x * T, y0 = o.y * T, x1 = (o.x + o.w) * T, y1 = (o.y + o.h) * T, gap = [(o.puerta - 1) * T, (o.puerta + 1) * T];
      const tramo = (a, b, y) => { const c = valla(b - a); WORLD.sprites.push({ canvas: c, x: a - 3, y: y - 26, key: y + 2 }); };
      tramo(x0, x1, y0); tramo(x0, gap[0], y1); tramo(gap[1], x1, y1);
      for (const x of [x0, x1]) for (let y = y0 + 16; y < y1 - 4; y += 16) WORLD.sprites.push({ canvas: postePerfil(), x: x - 4, y: y - 26, key: y + 2 });
      for (const x of [gap[0], gap[1]]) WORLD.sprites.push({ canvas: posteGrande(), x: x - 5, y: y1 - 32, key: y1 + 3 });
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
  for (const [x, y] of [[26, 22.8], [34, 22.8], [22.2, 17.4], [35.4, 25.4], [14.8, 20.7], [50, 22.8], [59.2, 30.4]]) { WORLD.lamps.push([x * T, y * T]); WORLD.sprites.push({ lamp: true, x: x * T, y: y * T, key: y * T }); WORLD.blocks.push([x * T - 4, y * T - 6, 8, 8]); }
  WORLD.ready = true;
}
function stall(x, y, i) { const [c, g] = mkCanvas(76, 70), col = ['#c8402e', '#2f78b7', '#d39418'][i % 3];
  g.fillStyle = '#5a3a22'; g.fillRect(4, 18, 4, 50); g.fillRect(68, 18, 4, 50); put(g, R.crate, 8, 38); put(g, R.crate, 40, 38); put(g, R.fish, 12, 34); put(g, R.fish, 44, 36); put(g, R.fish, 26, 30);
  for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#f4ecd8' : col; g.fillRect(k * 8 + 2, 6, 8, 16); } g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(2, 20, 72, 2); g.strokeStyle = '#2a1a12'; g.strokeRect(2.5, 6.5, 71, 15);
  WORLD.blocks.push([x + 4, y + 40, 68, 28]); return { canvas: c, x, y, key: y + 68 }; }
// el Ancla de Kalé: ancla de almirantazgo de hierro viejo, con cepo de madera, sobre un pedestal de piedra con musgo
function monument(x, y) { const [c, g] = mkCanvas(112, 150), cx = 56, O = '#1e1a20', IR = ['#2a2832', '#45434f', '#66646f', '#8e8c96'], RU = ['#5a3220', '#8a4e2a', '#b0703a'];
  // pedestal en dos cuerpos
  const block = (x0, y0, w, h, top) => { g.fillStyle = O; g.fillRect(x0 - 1, y0 - 1, w + 2, h + 2); g.fillStyle = '#7c776c'; g.fillRect(x0, y0, w, h); g.fillStyle = '#a49e90'; g.fillRect(x0, y0, w, top); g.fillStyle = '#5c5850'; g.fillRect(x0, y0 + h - 3, w, 3);
    for (let k = 0; k < w; k += 12) { g.fillStyle = 'rgba(40,36,30,.35)'; g.fillRect(x0 + k + (y0 % 7), y0 + top + 4, 1, h - top - 7); } };
  block(cx - 44, 124, 88, 22, 5); block(cx - 32, 108, 64, 18, 4);
  g.fillStyle = '#4a3a10'; g.fillRect(cx - 15, 113, 30, 10); g.fillStyle = '#d6b35a'; g.fillRect(cx - 14, 114, 28, 8); g.fillStyle = '#f0d890'; g.fillRect(cx - 14, 114, 28, 1); g.fillStyle = '#8a6a2a'; for (const yy of [117, 119]) g.fillRect(cx - 10, yy, 20, 1);
  for (const [mx, my, mw] of [[cx - 44, 141, 14], [cx + 30, 141, 14], [cx - 32, 122, 8], [cx + 26, 122, 7]]) { g.fillStyle = '#4a7a3a'; g.fillRect(mx, my, mw, 3); g.fillStyle = '#6a9a4a'; g.fillRect(mx + 2, my, mw - 5, 1); }
  // brazos curvos con uñas en punta de flecha
  const arm = (col, w) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.arc(cx, 66, 36, .28, Math.PI - .28); g.stroke(); };
  arm(O, 11); arm(IR[1], 8); g.strokeStyle = IR[3]; g.lineWidth = 2; g.beginPath(); g.arc(cx, 65, 36, .75, Math.PI - .9); g.stroke();
  for (const sgn of [-1, 1]) { const tx = cx + sgn * 34, ty = 76; const tri = [[tx + sgn * 10, ty - 18], [tx + sgn * 13, ty + 2], [tx - sgn * 5, ty + 4]];
    g.fillStyle = O; poly(g, tri.map(([a, b]) => [a + sgn * 1.5, b])); g.fill(); g.lineWidth = 3; g.strokeStyle = O; g.stroke(); g.fillStyle = IR[1]; poly(g, tri); g.fill(); g.fillStyle = IR[2]; poly(g, [tri[0], tri[1], [tx + sgn * 6, ty - 4]]); g.fill(); }
  // caña y cruz
  g.fillStyle = O; g.fillRect(cx - 6, 20, 12, 84); g.fillStyle = IR[1]; g.fillRect(cx - 5, 21, 10, 82); g.fillStyle = IR[3]; g.fillRect(cx - 4, 21, 2, 82); g.fillStyle = IR[0]; g.fillRect(cx + 3, 21, 2, 82);
  g.fillStyle = O; g.beginPath(); g.arc(cx, 102, 9, 0, 7); g.fill(); g.fillStyle = IR[1]; g.beginPath(); g.arc(cx, 102, 7, 0, 7); g.fill(); g.fillStyle = IR[3]; g.fillRect(cx - 4, 98, 3, 2);
  // cepo de madera con bandas de hierro y bolas en los extremos
  g.fillStyle = O; g.fillRect(cx - 34, 27, 68, 10); g.fillStyle = '#6a4228'; g.fillRect(cx - 33, 28, 66, 8); g.fillStyle = '#9a6a3e'; g.fillRect(cx - 33, 28, 66, 2); g.fillStyle = '#4a2c18'; g.fillRect(cx - 33, 34, 66, 2);
  for (const bx of [cx - 22, cx + 18]) { g.fillStyle = IR[0]; g.fillRect(bx, 27, 4, 10); g.fillStyle = IR[2]; g.fillRect(bx, 28, 1, 8); }
  for (const sgn of [-1, 1]) { g.fillStyle = O; g.beginPath(); g.arc(cx + sgn * 36, 32, 5, 0, 7); g.fill(); g.fillStyle = IR[1]; g.beginPath(); g.arc(cx + sgn * 36, 32, 3.5, 0, 7); g.fill(); g.fillStyle = IR[3]; g.fillRect(cx + sgn * 36 - 2, 30, 1, 1); }
  // argolla
  g.strokeStyle = O; g.lineWidth = 7; g.beginPath(); g.arc(cx, 13, 8, 0, 7); g.stroke(); g.strokeStyle = IR[1]; g.lineWidth = 4; g.stroke(); g.strokeStyle = IR[3]; g.lineWidth = 1.5; g.beginPath(); g.arc(cx, 13, 8, 3.6, 5); g.stroke();
  // óxido y musgo: el ancla lleva siglos ahí
  for (let k = 0; k < 46; k++) { const px = cx - 40 + hash(k, 1, 77) * 80, py = 14 + hash(k, 2, 77) * 92, v = hash(k, 3, 77); const d = g.getImageData(px | 0, py | 0, 1, 1).data; if (d[3] && d[0] < 120 && Math.abs(d[0] - d[2]) < 30) { g.fillStyle = RU[(v * 3) | 0]; g.fillRect(px | 0, py | 0, v > .7 ? 2 : 1, 1); } }
  g.fillStyle = '#4a7a3a'; g.fillRect(cx - 5, 100, 4, 2); g.fillRect(cx + 26, 82, 3, 2);
  WORLD.blocks.push([x - 44, y - 8, 88, 32]); return { canvas: c, x: x - cx, y: y - 126, key: y + 20 }; }
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
// Cada cuarto es una escena propia; los cuartos sin pared entre ellos (o con el mismo nombre) forman una sola.
// Se pasa de una a otra abriendo la puerta con E. En tres cuartos, cada borde superior de un cuarto muestra
// la cara de su pared (2 casillas), así que cada una de esas líneas agrega 2 filas a la escena.
const WALL = 10;
const near0 = (a, b) => Math.abs(a - b) < 1e-6;
function sceneGroups(I) {
  const rooms = I.cuartos.map(([n, x, y, w, h, f], i) => ({ i, n, x, y, w, h, f })), par = rooms.map((_, i) => i);
  const find = i => par[i] === i ? i : (par[i] = find(par[i])), uni = (a, b) => { par[find(a)] = find(b); };
  const covered = (x1, y1, x2, y2) => I.paredes.some(([a, b, c, d]) => (near0(y1, y2) && near0(b, d) && near0(b, y1) && Math.min(a, c) <= x1 + 1e-6 && Math.max(a, c) >= x2 - 1e-6) || (near0(x1, x2) && near0(a, c) && near0(a, x1) && Math.min(b, d) <= y1 + 1e-6 && Math.max(b, d) >= y2 - 1e-6));
  for (const r of rooms) for (const q of rooms) { if (r.i >= q.i) continue; if (r.n === q.n) { uni(r.i, q.i); continue; }
    if (near0(r.x + r.w, q.x) || near0(q.x + q.w, r.x)) { const x = near0(r.x + r.w, q.x) ? q.x : r.x, a = Math.max(r.y, q.y), b = Math.min(r.y + r.h, q.y + q.h); if (b - a > 1e-6 && !covered(x, a, x, b)) uni(r.i, q.i); }
    if (near0(r.y + r.h, q.y) || near0(q.y + q.h, r.y)) { const y = near0(r.y + r.h, q.y) ? q.y : r.y, a = Math.max(r.x, q.x), b = Math.min(r.x + r.w, q.x + q.w); if (b - a > 1e-6 && !covered(a, y, b, y)) uni(r.i, q.i); } }
  const groups = {}; rooms.forEach(r => (groups[find(r.i)] = groups[find(r.i)] || []).push(r)); return Object.values(groups);
}
const sceneName = (b, g) => b.n + ' · ' + [...new Set(g.map(r => r.n))].map((n, i) => i ? n[0].toLowerCase() + n.slice(1) : n).join(' y ');
// tramos de un borde horizontal (y) entre x1 y x2 donde del otro lado no hay escena
function runs(x1, x2, outside) { const out = []; let start = null; for (let x = x1; x <= x2 + 1e-6; x += .25) { const o = x < x2 - 1e-6 && outside(x + .125); if (o && start === null) start = x; if (!o && start !== null) { out.push([start, x]); start = null; } } return out; }
function buildInteriors(b) {
  const I = b.int, groups = sceneGroups(I), scenes = groups.map((g, k) => ({ id: b.id + ':' + k, rooms: g, name: sceneName(b, g), bid: b.id }));
  const sceneOfPt = (x, y) => scenes.find(s => s.rooms.some(r => x >= r.x - 1e-6 && x <= r.x + r.w + 1e-6 && y >= r.y - 1e-6 && y <= r.y + r.h + 1e-6));
  for (const sc of scenes) buildScene(b, sc, scenes);
  // puertas: cada una aparece en las dos escenas que une, o lleva a la calle
  for (const [x, y, o, len, to] of I.puertas) {
    const mid = o === 'h' ? [x + len / 2, y] : [x, y + len / 2], eps = .3;
    const a = o === 'h' ? sceneOfPt(mid[0], y - eps) : sceneOfPt(x - eps, mid[1]), c = o === 'h' ? sceneOfPt(mid[0], y + eps) : sceneOfPt(x + eps, mid[1]);
    const sides = [[a, o === 'h' ? 'S' : 'E'], [c, o === 'h' ? 'N' : 'O']].filter(([s]) => s);
    for (const [s, side] of sides) { const other = sides.find(([t]) => t !== s), d = s.addDoor(x, y, o, len, side); d.to = other ? other[0].id : 'town'; d.twin = other ? { s: other[0], side: other[1], x, y, o, len } : null; }
  }
  for (const s of scenes) for (const d of s.doors) if (d.twin) d.at = d.twin.s.doorArrival(d.twin.x, d.twin.y, d.twin.o, d.twin.len, d.twin.side);
  return { scenes, entrance: scenes.find(s => s.doors.some(d => d.to === 'town')), sceneOfPt };
}
function buildScene(b, sc, all) {
  const I = b.int, rs = sc.rooms, inS = (x, y) => rs.some(r => x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h);
  const bx = Math.min(...rs.map(r => r.x)), by = Math.min(...rs.map(r => r.y)), bx2 = Math.max(...rs.map(r => r.x + r.w)), by2 = Math.max(...rs.map(r => r.y + r.h));
  const lines = []; for (const r of rs) for (const [a, z] of runs(r.x, r.x + r.w, x => !inS(x, r.y - .1))) lines.push([r.y, a, z]);
  const ys = [...new Set(lines.map(l => l[0]))], sy = y => y + 2 * ys.filter(v => v <= y + 1e-6).length;
  const X = x => WALL + (x - bx) * T, Y = y => (sy(y) - by) * T, W = (bx2 - bx) * T + 2 * WALL, H = Y(by2) + WALL;
  const [c, g] = mkCanvas(W, H), blocks = [], items = [], fires = [], lights = [], doors = [];
  g.fillStyle = '#1a100b'; g.fillRect(0, 0, W, H);
  // pisos: un cuarto sigue por debajo de la línea de abajo salvo que esa línea lo cierre entero
  for (const r of rs) { g.fillStyle = r.f === 'piedra' ? pat(g, R.floorStone) : pat(g, R.floorWood); const closes = lines.some(l => near0(l[0], r.y + r.h) && l[1] <= r.x + 1e-6 && l[2] >= r.x + r.w - 1e-6); g.fillRect(X(r.x), Y(r.y), r.w * T, Y(r.y + r.h) - Y(r.y) - (closes ? 2 * T : 0)); }
  if (I.redondo) { g.save(); g.globalCompositeOperation = 'destination-in'; g.beginPath(); g.ellipse(W / 2, (H + 2 * T) / 2, W / 2 - 2, (H - 2 * T) / 2, 0, 0, 7); g.rect(0, 0, W, 2 * T + 8); g.fill(); g.restore(); }
  // caras de pared en cada borde superior
  for (const [ly, x1, x2] of lines) { const top = Y(ly) - 2 * T, x = X(x1), w = (x2 - x1) * T;
    g.fillStyle = pat(g, R.wallUp); g.fillRect(x, top, w, T); g.fillStyle = pat(g, R.wainscot); g.fillRect(x, top + T, w, T);
    g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(x, top + 2 * T, w, 5); g.fillStyle = '#24160f'; g.fillRect(x - 4, top - 6, w + 8, 7); g.fillStyle = '#4e3424'; g.fillRect(x - 4, top - 6, w + 8, 2);
    blocks.push([x, top - 8, w, 2 * T + 2]); }
  // bordes de los costados y de abajo: muro visto desde arriba
  const vTop = y => ys.some(v => near0(v, y)) ? Y(y) - 2 * T - 6 : Y(y);
  for (const r of rs) for (const [x, side] of [[r.x, -1], [r.x + r.w, 1]]) for (const [a, z] of runs(r.y, r.y + r.h, y => !inS(x + side * .1, y))) {
    const top = vTop(a), bot = Y(z) + (z >= by2 - 1e-6 ? WALL : 0), px = side < 0 ? X(x) - WALL : X(x);
    g.fillStyle = '#24160f'; g.fillRect(px, top, WALL, bot - top); g.fillStyle = '#4e3424'; g.fillRect(side < 0 ? px + WALL - 2 : px, top, 2, bot - top); blocks.push([px - (side < 0 ? 0 : 0), top, WALL + 2, bot - top]); }
  for (const r of rs) for (const [a, z] of runs(r.x, r.x + r.w, x => !inS(x, r.y + r.h + .1))) { const yy = Y(r.y + r.h); g.fillStyle = '#24160f'; g.fillRect(X(a) - WALL, yy, (z - a) * T + 2 * WALL, WALL); g.fillStyle = '#4e3424'; g.fillRect(X(a) - WALL, yy, (z - a) * T + 2 * WALL, 2); blocks.push([X(a) - WALL, yy - 4, (z - a) * T + 2 * WALL, WALL + 4]); }
  // ventanas que dan afuera desde esta escena
  for (const [x, y, o, len, dir] of I.ventanas) {
    if (o === 'h') { const cxp = x + len / 2; if (inS(cxp, y + .1) && lines.some(l => near0(l[0], y) && l[1] <= cxp && l[2] >= cxp)) { const cx = X(cxp), wy = Y(y) - 2 * T + 8;
        if (len > 1.6) { put(g, R.winTall, cx - 32, wy); put(g, R.winTall, cx, wy); } else put(g, R.winTall, cx - 16, wy); lights.push({ dir, x: cx, y: wy + 22, w: len * T, wall: 'N' }); }
      else if (inS(cxp, y - .1)) { const x0 = X(x), yy = Y(y); g.fillStyle = '#9fd0f0'; g.fillRect(x0, yy + 2, len * T, 5); g.fillStyle = '#e8f6ff'; g.fillRect(x0, yy + 2, len * T, 1); lights.push({ dir, x: x0 + len * T / 2, y: yy, w: len * T, wall: 'S' }); } }
    else { const cyp = y + len / 2, left = inS(x + .1, cyp), right = inS(x - .1, cyp); if (!left && !right) continue; const px = left ? X(x) - WALL : X(x), y0 = Y(y), hh = Y(y + len) - Y(y);
      g.fillStyle = '#9fd0f0'; g.fillRect(px + 2, y0, WALL - 4, hh); g.fillStyle = '#e8f6ff'; g.fillRect(left ? px + WALL - 4 : px + 2, y0, 2, hh); lights.push({ dir, x: left ? X(x) : X(x), y: y0 + hh / 2, w: hh, wall: left ? 'O' : 'E' }); } }
  // muebles y detalles que caen dentro de esta escena
  const box = ([n, x, y, w, h]) => [X(x), Y(y), w * T, h * T];
  for (const m of I.muebles) if (inS(m[1] + m[3] / 2, m[2] + m[4] / 2)) furniture(b.id, m[0], box(m), items, blocks, fires, g);
  const add = { item: o => items.push(o), block: r => blocks.push(r), fire: f => fires.push(f) };
  for (const d of DECOR[b.id] || []) if (inS(...d.at)) d.fn(g, X, Y, add);
  // una puerta en el borde de arriba es una puerta en la cara de la pared; abajo, un umbral; a los lados, un hueco en el muro
  sc.addDoor = (x, y, o, len, side) => { let r, look;
    if (side === 'N') { const x0 = X(x) + (len * T - 32) / 2, top = Y(y) - 2 * T; put(g, R.door[b.id === 'casa' ? 'verde' : 'marron'], x0, top + 2 * T - 48); g.fillStyle = '#2a1a12'; g.fillRect(x0 - 2, top + 2 * T - 50, 36, 2); r = [X(x) - 4, Y(y) - 6, len * T + 8, 0.9 * T]; look = 'up'; }
    else if (side === 'S') { const x0 = X(x), w = len * T, yy = Y(y); g.fillStyle = '#7a6a58'; g.fillRect(x0, yy, w, WALL); g.fillStyle = '#9a3a2a'; g.fillRect(x0 + 2, yy - 14, w - 4, 12); g.fillStyle = '#b8503a'; g.fillRect(x0 + 4, yy - 12, w - 8, 8); r = [x0 - 6, yy - 0.9 * T, w + 12, 0.9 * T + 4]; look = 'down'; }
    else { const leftWall = side === 'O', px = leftWall ? X(x) - WALL : X(x), y0 = Y(y), hh = Y(y + len) - Y(y); g.fillStyle = '#3a2418'; g.fillRect(px, y0, WALL, hh); g.fillStyle = '#7a5030'; g.fillRect(px + 2, y0 + 2, WALL - 4, hh - 4); r = leftWall ? [X(x), y0, 0.9 * T, hh] : [X(x) - 0.9 * T, y0, 0.9 * T, hh]; look = leftWall ? 'left' : 'right'; }
    const d = { r, look, args: [x, y, o, len, side] }; doors.push(d); return d; };
  sc.doorArrival = (x, y, o, len, side) => side === 'N' ? [[X(x + len / 2), Y(y) + 0.8 * T], 'down'] : side === 'S' ? [[X(x + len / 2), Y(y) - 0.7 * T], 'up'] : side === 'O' ? [[X(x) + 0.8 * T, Y(y + len / 2) + 6], 'right'] : [[X(x) - 0.8 * T, Y(y + len / 2) + 6], 'left'];
  Object.assign(sc, { canvas: c, w: W, h: H, blocks, items, fires, lights, doors, X, Y, area: [WALL, 0, W - 2 * WALL, H - WALL] });
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
  if (L === 'estante' || L.startsWith('libros')) { for (let px = x; px + 30 <= x + w + 4; px += 32) add(R.books, px, by - 64); return; }
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
  if (L === 'estantes') { let i = 0; for (let px = x; px + 28 <= x + w + 4; px += 32) { const r = [R.dishes, R.jars, R.dishes, R.sacks][i++ % 4]; add(r, px + (32 - r[3]) / 2, by - r[4] + 8); } return; }
  if (L.startsWith('cajas')) { for (let px = x; px + 30 <= x + w + 4; px += 34) for (let py = by; py - 30 > y - 6; py -= 30) add(R.crate, px, py - 33); return; }
  if (L.startsWith('lonas')) return add(R.sacks, cx - 32, by - 63);
  if (L.startsWith('sogas')) return flat(gg => { for (let k = 0; k < 3; k++) { gg.strokeStyle = k % 2 ? '#a88a5a' : '#c8a870'; gg.lineWidth = 3; gg.beginPath(); gg.ellipse(cx, by - 12 - k * 5, w / 2 - 6 - k * 3, 7, 0, 0, 7); gg.stroke(); } });
  if (L.startsWith('mostrador')) { items.push({ fn: gg => nine(gg, R.dresser, 14, x, by - h - 18, w, h + 18), key: by }); blocks.push([x, by - h - 4, w, h + 4]); return; }
  if (L.startsWith('camilla')) return add(R.bedA, cx - 24, by - 71 - 6);
  if (L.startsWith('biombo')) { items.push({ fn: gg => { for (let k = 0; k < 3; k++) { const py = y + k * h / 3; gg.fillStyle = '#5a3a24'; gg.fillRect(cx - 4, py, 8, h / 3 - 1); gg.fillStyle = '#efe4cc'; gg.fillRect(cx - 3, py + 2, 6, h / 3 - 5); } }, key: by }); blocks.push([cx - 5, y, 10, h]); return; }
  if (L.startsWith('escritorio')) return add(R.desk, cx - 32, by - 64);
  if (L.startsWith('escalera')) { items.push({ fn: gg => { for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; gg.fillStyle = k % 2 ? '#8a8478' : '#a8a296'; gg.beginPath(); gg.moveTo(cx, y + h / 2); gg.arc(cx, y + h / 2, w / 2, a, a + Math.PI / 4); gg.fill(); } gg.fillStyle = '#5a5448'; gg.beginPath(); gg.arc(cx, y + h / 2, 6, 0, 7); gg.fill(); gg.strokeStyle = '#2a1a12'; gg.beginPath(); gg.arc(cx, y + h / 2, w / 2, 0, 7); gg.stroke(); }, key: by }); blocks.push([x + 4, y + 4, w - 8, h - 8]); return; }
  if (L.startsWith('artesa')) { add(R.longTable, cx - 40, by - 42); items.push({ fn: gg => { gg.fillStyle = '#f4ecd8'; gg.beginPath(); gg.ellipse(cx, by - 34, 18, 5, 0, 0, 7); gg.fill(); }, key: by + 1 }); return; }
  if (L.startsWith('horno')) { add(R.fireplace, cx - 36, by - 70); items.push({ img: R.flame, x: cx - 15, y: by - 38, key: by + 1 }); fires.push({ x: cx, y: by - 24, r: 120, kind: 'fuego' }); return; }
  if (L === 'pan') { add(R.crate, cx - 17, by - 33); items.push({ fn: gg => { for (let k = 0; k < 4; k++) { gg.fillStyle = '#c88a3a'; gg.beginPath(); gg.ellipse(cx - 10 + k * 7, by - 32, 5, 3, 0, 0, 7); gg.fill(); gg.fillStyle = '#e8b86a'; gg.fillRect(cx - 12 + k * 7, by - 34, 3, 1); } }, key: by + 1 }); return; }
  // sin pieza todavía: un bulto neutro para no dejar el hueco
  items.push({ fn: gg => { gg.fillStyle = '#6a4228'; gg.fillRect(x, y, w, h); gg.strokeStyle = '#2a1a12'; gg.strokeRect(x + .5, y + .5, w - 1, h - 1); }, key: by }); blocks.push([x, y, w, h]);
}
// ---------- vida: humo, gaviotas, mariposas, una ardilla, luciérnagas y el haz del faro ----------
function vida(g, [cx, cy], now, VW, VH, h, fase) {
  const t = now / 1000, inV = (x, y, m = 40) => x > cx - m && x < cx + VW + m && y > cy - m && y < cy + VH + m, night = isNight(h);
  // humo de las chimeneas: bocanadas que suben, se abren y se las lleva el viento
  for (const s of WORLD.doors) { if (!s.chim) continue; const [x0, y0] = s.chim; if (!inV(x0, y0, 120)) continue;
    for (let k = 0; k < 9; k++) { const a = ((t * .22 + k / 9) % 1), x = x0 + a * 26 + Math.sin(t * 1.3 + k) * 3 * a, y = y0 - a * 70, r = 3 + a * 9;
      g.fillStyle = `rgba(${night ? '120,120,140' : '235,235,240'},${(1 - a) * .45})`; g.beginPath(); g.arc(x - cx, y - cy, r, 0, 7); g.fill(); } }
  // mariposas de día cerca de las flores, luciérnagas de noche
  for (let i = 0; i < 14; i++) { const hx = (14 + hash(i, 1, 61) * 46) * T, hy = (8 + hash(i, 2, 61) * 30) * T; if (!inPoly([hx, hy], WORLD.land) || !inV(hx, hy)) continue;
    if (!night && h > 7 && h < 18.5 && i < 8) { const x = hx + Math.sin(t * .7 + i) * 26 + Math.sin(t * 2.3 + i * 2) * 6, y = hy + Math.cos(t * .5 + i) * 14 + Math.sin(t * 3.1 + i) * 4 - 14, fl = Math.sin(t * 22 + i) > 0, col = ['#fff6dc', '#ffd85a', '#e8a0ff', '#9ad8ff'][i % 4];
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(Math.round(x - cx - 1), Math.round(y - cy + 16), 3, 1); g.fillStyle = col; if (fl) { g.fillRect(Math.round(x - cx - 3), Math.round(y - cy - 1), 2, 3); g.fillRect(Math.round(x - cx + 2), Math.round(y - cy - 1), 2, 3); } else { g.fillRect(Math.round(x - cx - 1), Math.round(y - cy - 2), 1, 3); g.fillRect(Math.round(x - cx + 1), Math.round(y - cy - 2), 1, 3); }
      g.fillStyle = '#2a1a12'; g.fillRect(Math.round(x - cx), Math.round(y - cy - 1), 1, 3); }
    if (night) { const x = hx + Math.sin(t * .4 + i * 3) * 30, y = hy + Math.cos(t * .33 + i) * 20 - 10, on = (Math.sin(t * 2 + i * 1.7) + 1) / 2; g.fillStyle = `rgba(220,255,140,${on * .9})`; g.fillRect(Math.round(x - cx), Math.round(y - cy), 2, 2); g.fillStyle = `rgba(220,255,140,${on * .2})`; g.beginPath(); g.arc(x - cx + 1, y - cy + 1, 5, 0, 7); g.fill(); } }
  // una ardilla que sube por el tronco de un árbol cada tanto
  if (!night) for (let i = 0; i < WORLD.trees.length; i += 7) { const [tx, ty] = WORLD.trees[i]; if (!inV(tx, ty, 80)) continue; const per = 9 + (i % 5), ph = ((t + i * 1.7) % per) / per; if (ph > .45) continue;
    const k = ph / .45, x = tx - cx + 3 + (k < .2 ? (1 - k / .2) * 30 : 0), y = ty - cy - 6 - (k < .2 ? 0 : (k - .2) / .8 * 46); const up = k >= .2, f = Math.floor(t * 12) % 2;
    g.fillStyle = '#7a4a22'; if (up) { g.fillRect(x - 2, y - 5, 4, 7); g.fillRect(x - 1, y - 7, 3, 2); g.fillStyle = '#a8703a'; g.fillRect(x - 4 - f, y - 2, 3, 5); g.fillRect(x - 5 - f, y - 5, 2, 4); }
    else { g.fillRect(x - 3, y - 3, 6, 3); g.fillRect(x - 5, y - 4, 2, 2); g.fillStyle = '#a8703a'; g.fillRect(x + 3, y - 7 + f, 3, 5); g.fillRect(x + 4, y - 9 + f, 2, 3); } g.fillStyle = '#1a1210'; g.fillRect(up ? x : x - 5, up ? y - 7 : y - 4, 1, 1); }
  // gaviotas sobre el mar y la costa, con su sombra
  for (let i = 0; i < 5; i++) { const R0 = 140 + i * 40, x = (6 + i * 9) * T + Math.cos(t * (.18 + i * .03) + i) * R0, y = (14 + (i % 3) * 9) * T + Math.sin(t * (.18 + i * .03) + i) * R0 * .5; if (!inV(x, y, 60)) continue;
    const fl = Math.sin(t * 7 + i * 2), X = Math.round(x - cx), Y = Math.round(y - cy - 60);
    g.fillStyle = 'rgba(0,20,40,.18)'; g.fillRect(X - 4, Y + 70, 9, 2);
    g.fillStyle = '#2a2a33'; g.fillRect(X - 5, Y - (fl > 0 ? 2 : 0), 4, 1); g.fillRect(X + 2, Y - (fl > 0 ? 2 : 0), 4, 1); g.fillStyle = '#f4f6fa'; g.fillRect(X - 4, Y - (fl > 0 ? 1 : -1), 3, 1); g.fillRect(X + 2, Y - (fl > 0 ? 1 : -1), 3, 1); g.fillRect(X - 1, Y, 3, 2); g.fillStyle = '#f0a030'; g.fillRect(X + 2, Y + 1, 1, 1); }
  // haz del faro de noche: un cono que barre el mar
  const fa = WORLD.doors.find(s => s.lantern && s.b.ext.redondo); if (night && fa) { const [lx, ly] = fa.lantern, a = t * .7, gr = g.createRadialGradient(lx - cx, ly - cy, 4, lx - cx, ly - cy, 700);
    gr.addColorStop(0, 'rgba(255,240,170,.35)'); gr.addColorStop(1, 'rgba(255,240,170,0)'); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.moveTo(lx - cx, ly - cy); g.arc(lx - cx, ly - cy, 700, a - .12, a + .12); g.closePath(); g.fill(); g.restore(); }
}
// ---------- barcos: de perfil, como las fachadas, con proa al este ----------
// estilo 'pirata' (casco negro, velas negras con la medusa) o 'marina' (casco blanco y azul, velas con la gaviota)
function barcoCanvas(estilo, L = 300) {
  const K = estilo === 'corneja', P = estilo === 'pirata' || K, W = L + 70, H = 320, [c, g] = mkCanvas(W, H), O = '#120c0e', wl = H - 40, x0 = 10, x1 = x0 + L;
  const C = K ? { casco: ['#24242c', '#34343e', '#464652'], franja: '#7a2a2a', vela: ['#3a3a44', '#4c4c58', '#5e5e6a'], marca: '#e8e2d8', bandera: '#141014', luz: '#ffcf6a' } : P ? { casco: ['#1a1416', '#2a2024', '#3a2e32'], franja: '#8a6a2a', vela: ['#1e1a1e', '#2e282e', '#3e363e'], marca: '#e8e2d8', bandera: '#141014', luz: '#ffcf6a' }
    : { casco: ['#d8dce4', '#eef2f6', '#ffffff'], franja: '#2f4f9a', vela: ['#d8dce4', '#eef0f4', '#ffffff'], marca: '#2f4f9a', bandera: '#2f4f9a', luz: '#ffe8a8' };
  // reflejo y sombra en el agua
  g.fillStyle = 'rgba(0,15,35,.35)'; g.beginPath(); g.ellipse(x0 + L / 2 + 6, wl + 14, L / 2 + 14, 16, 0, 0, 7); g.fill();
  // casco: línea de cubierta, popa alta, proa que sube
  const hull = [[x0, wl - 62], [x0 + 46, wl - 62], [x0 + 52, wl - 44], [x1 - 40, wl - 46], [x1, wl - 60], [x1 + 6, wl - 50], [x1 - 20, wl - 6], [x0 + 36, wl + 2], [x0 + 8, wl - 10]];
  poly(g, hull); g.fillStyle = O; g.fill(); g.lineWidth = 3; g.strokeStyle = O; g.stroke();
  g.save(); poly(g, hull); g.clip();
  const gr = g.createLinearGradient(0, wl - 62, 0, wl + 2); gr.addColorStop(0, C.casco[2]); gr.addColorStop(.35, C.casco[1]); gr.addColorStop(1, C.casco[0]); g.fillStyle = gr; g.fillRect(x0, wl - 70, L + 10, 80);
  g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 1; for (let y = wl - 56; y < wl; y += 6) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x1 + 8, y + (y - wl) * .04); g.stroke(); }
  for (let k = 0; k < 40; k++) { const px = x0 + hash(k, 1, 51) * L, py = wl - 50 + hash(k, 2, 51) * 46; g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(px, py, 1, 4); }
  g.fillStyle = C.franja; g.fillRect(x0, wl - 40, L + 10, 4); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x0, wl - 40, L + 10, 1);
  g.fillStyle = P ? '#3a5a3a' : '#7a2a2a'; g.fillRect(x0, wl - 6, L + 10, 10); // obra viva
  g.restore();
  // cañoneras
  for (let k = 0, nk = K ? 3 : 7; k < nk; k++) { const px = x0 + 66 + k * (L - 120) / Math.max(1, nk - 1), py = wl - 31; g.fillStyle = O; g.fillRect(px - 5, py - 4, 10, 9); g.fillStyle = P ? '#5a2a1a' : '#24304a'; g.fillRect(px - 4, py - 3, 8, 7); g.fillStyle = '#0a0a0c'; g.beginPath(); g.arc(px, py + 1, 2.4, 0, 7); g.fill(); }
  // castillo de popa con ventanas encendidas
  g.fillStyle = O; g.fillRect(x0 - 2, wl - 86, 56, 26); g.fillStyle = C.casco[1]; g.fillRect(x0, wl - 84, 52, 22); g.fillStyle = C.franja; g.fillRect(x0, wl - 84, 52, 3);
  for (let k = 0; k < 3; k++) { g.fillStyle = O; g.fillRect(x0 + 6 + k * 15, wl - 78, 9, 9); g.fillStyle = C.luz; g.fillRect(x0 + 7 + k * 15, wl - 77, 7, 7); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x0 + 7 + k * 15, wl - 77, 2, 3); }
  for (let px = x0 + 54; px < x1 - 30; px += 7) { g.fillStyle = O; g.fillRect(px, wl - 54, 2, 8); } g.fillStyle = O; g.fillRect(x0 + 52, wl - 56, L - 84, 2); // borda
  // bauprés y mascarón
  g.strokeStyle = O; g.lineWidth = 4; g.beginPath(); g.moveTo(x1 - 6, wl - 54); g.lineTo(x1 + 56, wl - 84); g.stroke(); g.strokeStyle = '#6a4a2a'; g.lineWidth = 2; g.stroke();
  if (P) { g.fillStyle = '#d8d0b8'; g.beginPath(); g.arc(x1 + 4, wl - 46, 5, 0, 7); g.fill(); g.strokeStyle = '#d8d0b8'; g.lineWidth = 1.5; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(x1 + 2 + k, wl - 42); g.quadraticCurveTo(x1 + 8 + k * 2, wl - 30, x1 + k * 3, wl - 24); g.stroke(); } }
  else { g.fillStyle = '#f4f6fa'; g.beginPath(); g.moveTo(x1 - 2, wl - 50); g.lineTo(x1 + 14, wl - 56); g.lineTo(x1 + 4, wl - 44); g.fill(); g.fillStyle = '#f0a030'; g.fillRect(x1 + 12, wl - 56, 4, 2); }
  // mástiles, vergas y velas
  const masts = K ? [[x0 + L * .52, 190]] : [[x0 + 110, 200], [x0 + 210, 176]];
  g.strokeStyle = 'rgba(30,20,20,.75)'; g.lineWidth = 1; for (const [mx, mh] of masts) for (const tx of [x0 + 20, x1 + 50, mx - 60, mx + 60]) { g.beginPath(); g.moveTo(mx, wl - 50 - mh + 14); g.lineTo(tx, tx === x1 + 50 ? wl - 82 : wl - 54); g.stroke(); }
  for (const [mx, mh] of masts) { const top = wl - 50 - mh;
    g.fillStyle = O; g.fillRect(mx - 3, top, 6, mh); g.fillStyle = '#6a4a2a'; g.fillRect(mx - 2, top, 4, mh); g.fillStyle = '#8a6a3a'; g.fillRect(mx - 2, top, 1, mh);
    g.fillStyle = O; g.fillRect(mx - 9, top + 18, 18, 5); // cofa
    for (const [yy, ww, hh] of [[top + 30, 104, 58], [top + 96, 128, 66]]) {
      g.fillStyle = O; g.fillRect(mx - ww / 2 - 2, yy - 3, ww + 4, 5);
      g.beginPath(); g.moveTo(mx - ww / 2, yy); g.lineTo(mx + ww / 2, yy); g.quadraticCurveTo(mx + ww / 2 + 8, yy + hh / 2, mx + ww / 2 - 4, yy + hh); g.quadraticCurveTo(mx, yy + hh + 10, mx - ww / 2 + 4, yy + hh); g.quadraticCurveTo(mx - ww / 2 - 8, yy + hh / 2, mx - ww / 2, yy); g.closePath();
      g.fillStyle = O; g.lineWidth = 3; g.strokeStyle = O; g.stroke(); const sg = g.createLinearGradient(mx - ww / 2, 0, mx + ww / 2, 0); sg.addColorStop(0, C.vela[0]); sg.addColorStop(.35, C.vela[2]); sg.addColorStop(1, C.vela[1]); g.fillStyle = sg; g.fill();
      g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(mx - ww / 2 + k * ww / 4, yy + 2); g.quadraticCurveTo(mx - ww / 2 + k * ww / 4 + 3, yy + hh / 2, mx - ww / 2 + k * ww / 4, yy + hh); g.stroke(); }
      if (P) for (let k = 0; k < 3; k++) { g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(mx - ww / 2 + 10 + hash(k, mx, 3) * (ww - 20), yy + hh - 6 - hash(k, 2, mx) * 10, 3, 6); } } }
  // emblema en la vela grande
  const [ex, eh] = masts[0], ey = wl - 50 - eh + 96 + 30;
  if (K) { /* la balandra no lleva emblema */ } else if (P) { g.fillStyle = C.marca; g.beginPath(); g.ellipse(ex, ey - 6, 15, 11, 0, Math.PI, 0); g.fill(); g.fillRect(ex - 15, ey - 6, 30, 3); g.strokeStyle = C.marca; g.lineWidth = 2.5; for (let k = 0; k < 6; k++) { const sx = ex - 12 + k * 5; g.beginPath(); g.moveTo(sx, ey - 3); g.bezierCurveTo(sx - 5, ey + 8, sx + 6, ey + 14, sx + (k % 2 ? 4 : -4), ey + 22); g.stroke(); }
    g.fillStyle = '#1e1a1e'; g.fillRect(ex - 7, ey - 11, 4, 3); g.fillRect(ex + 3, ey - 11, 4, 3); }
  else { g.fillStyle = C.marca; g.beginPath(); g.moveTo(ex - 24, ey - 6); g.quadraticCurveTo(ex - 10, ey - 18, ex, ey - 6); g.quadraticCurveTo(ex + 10, ey - 18, ex + 24, ey - 6); g.quadraticCurveTo(ex + 10, ey - 12, ex, ey); g.quadraticCurveTo(ex - 10, ey - 12, ex - 24, ey - 6); g.fill();
    g.font = '900 15px Georgia, serif'; g.textAlign = 'center'; g.fillText('MARINE', ex, ey + 20); const [ex2, eh2] = masts[1]; g.fillText('MARINE', ex2, wl - 50 - eh2 + 96 + 40); }
  // banderas en lo alto
  if (!K) for (const [mx, mh] of masts) { const top = wl - 50 - mh; g.fillStyle = O; g.fillRect(mx - 1, top - 16, 2, 18); g.fillStyle = C.bandera; g.beginPath(); g.moveTo(mx + 1, top - 16); g.lineTo(mx + 26, top - 13); g.lineTo(mx + 22, top - 8); g.lineTo(mx + 27, top - 3); g.lineTo(mx + 1, top - 4); g.fill();
    g.fillStyle = P ? C.marca : '#ffffff'; g.beginPath(); g.arc(mx + 11, top - 10, 2.5, 0, 7); g.fill(); }
  // espuma en la línea de flotación
  g.fillStyle = 'rgba(255,255,255,.7)'; for (let k = 0; k < 26; k++) g.fillRect(x0 + 30 + k * (L - 40) / 25 + hash(k, 1, 61) * 6, wl + 1 + hash(k, 2, 61) * 3, 4 + hash(k, 3, 61) * 5, 1);
  return { canvas: c, ox: x0, wl };
}
// coloca un barco: x, y es la proa-popa a la altura de la línea de flotación (en píxeles del mundo)
function barcoSprite(estilo, x, y, L) { const b = barcoCanvas(estilo, L); return { canvas: b.canvas, x: x - b.ox, y: y - b.wl, key: y + 4, barco: true }; }

// ---------- vallas de madera hechas a medida: estacas con punta, dos travesaños y sombra ----------
const VALLA = ['#2a1a10', '#5a3a22', '#7a5030', '#9a6a40'];
function valla(len) { const w = Math.round(len) + 6, [c, g] = mkCanvas(w, 32), O = VALLA[0];
  g.fillStyle = 'rgba(20,12,6,.25)'; g.fillRect(2, 28, w - 4, 3);
  for (const ry of [11, 20]) { g.fillStyle = O; g.fillRect(1, ry - 1, w - 2, 6); g.fillStyle = VALLA[1]; g.fillRect(2, ry, w - 4, 4); g.fillStyle = VALLA[2]; g.fillRect(2, ry, w - 4, 1); }
  const n = Math.max(2, Math.round(len / 14)); for (let k = 0; k <= n; k++) { const px = Math.round(3 + k * (len / n)) - 2; g.fillStyle = O; g.beginPath(); g.moveTo(px - 1, 29); g.lineTo(px - 1, 6); g.lineTo(px + 2.5, 2); g.lineTo(px + 6, 6); g.lineTo(px + 6, 29); g.fill();
    g.fillStyle = VALLA[2]; g.fillRect(px, 6, 5, 22); g.fillStyle = VALLA[3]; g.fillRect(px, 6, 1, 22); g.fillStyle = VALLA[1]; g.fillRect(px + 4, 6, 1, 22); g.fillStyle = VALLA[2]; g.beginPath(); g.moveTo(px, 6); g.lineTo(px + 2.5, 3); g.lineTo(px + 5, 6); g.fill(); }
  return c; }
let _poste, _posteG;
function postePerfil() { if (_poste) return _poste; const [c, g] = mkCanvas(8, 30); g.fillStyle = 'rgba(20,12,6,.25)'; g.fillRect(0, 26, 8, 3); g.fillStyle = VALLA[0]; g.fillRect(1, 4, 6, 24); g.fillStyle = VALLA[2]; g.fillRect(2, 5, 4, 22); g.fillStyle = VALLA[3]; g.fillRect(2, 5, 1, 22);
  g.fillStyle = VALLA[1]; g.fillRect(2, 12, 4, 3); g.fillRect(2, 20, 4, 3); g.fillStyle = VALLA[0]; g.fillRect(2, 2, 4, 3); return _poste = c; }
function posteGrande() { if (_posteG) return _posteG; const [c, g] = mkCanvas(10, 36); g.fillStyle = VALLA[0]; g.fillRect(0, 2, 10, 32); g.fillStyle = VALLA[1]; g.fillRect(1, 4, 8, 29); g.fillStyle = VALLA[3]; g.fillRect(1, 4, 2, 29); g.fillStyle = '#c8a040'; g.fillRect(0, 0, 10, 4); g.fillStyle = VALLA[0]; g.fillRect(0, 4, 10, 1); return _posteG = c; }
