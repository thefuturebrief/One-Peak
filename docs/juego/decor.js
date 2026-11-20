// Decoración de los interiores: piezas LPC y objetos dibujados por código con la misma paleta, contorno oscuro y luz de arriba.
// Cada pieza va anclada a un punto de la planta ("at") para saber en qué escena cae. fn recibe el lienzo de la escena,
// las funciones X/Y de la planta a píxeles y "add" para sumar objetos que se ordenan con los personajes, bloqueos y luces.
const RD = {
  reloj: ['int', 583, 685, 18, 71], esqueleto: ['int', 672, 682, 32, 51], candelabro: ['int', 608, 679, 32, 71], retrato: ['int', 978, 517, 28, 48], calavera: ['int', 711, 384, 17, 16],
  pocion1: ['int', 744, 384, 15, 16], pocion2: ['int', 777, 384, 14, 16], pocion3: ['int', 873, 385, 12, 23], frasco: ['int', 843, 392, 8, 16], botella1: ['int', 588, 353, 8, 14], botella2: ['int', 626, 353, 8, 14],
  florero: ['int', 934, 378, 19, 30], jarron: ['int', 813, 387, 14, 21], cuenco: ['int', 836, 360, 22, 20], palangana: ['int', 929, 336, 28, 16], soga: ['int', 871, 225, 18, 29], lampara: ['int', 966, 324, 20, 28],
  escudo: ['int', 679, 388, 18, 22], antorcha: ['int', 519, 420, 16, 56], caldero: ['int', 641, 417, 31, 31], marco: ['int', 418, 489, 28, 31],
};
const INK = '#2a1a12', WOOD = ['#4a2c18', '#6a4228', '#8a5a34', '#a8744a'], IRON = ['#2c2a34', '#4a4856', '#6e6c7c'];
const o = (g, x, y, w, h) => { g.strokeStyle = INK; g.lineWidth = 1; g.strokeRect(Math.round(x) + .5, Math.round(y) + .5, w - 1, h - 1); };
// ---------- objetos dibujados ----------
function cuadro(g, x, y, w, h, tema) { g.fillStyle = WOOD[1]; g.fillRect(x, y, w, h); g.fillStyle = WOOD[3]; g.fillRect(x, y, w, 1); o(g, x, y, w, h);
  const ix = x + 3, iy = y + 3, iw = w - 6, ih = h - 6;
  if (tema === 'mar') { g.fillStyle = '#9fd0f0'; g.fillRect(ix, iy, iw, ih); g.fillStyle = '#ffe2a0'; g.fillRect(ix + iw - 6, iy + 2, 3, 3); g.fillStyle = '#2f6fb7'; g.fillRect(ix, iy + ih * .6, iw, ih * .4); g.fillStyle = '#e8f6ff'; g.fillRect(ix + 2, iy + ih * .6 + 2, 4, 1);
    g.fillStyle = INK; g.fillRect(ix + iw * .4, iy + ih * .2, 1, ih * .4); g.fillStyle = '#f4ecd8'; g.fillRect(ix + iw * .4 + 1, iy + ih * .22, 4, ih * .3); g.fillStyle = WOOD[0]; g.fillRect(ix + iw * .25, iy + ih * .58, iw * .4, 2); }
  else if (tema === 'diploma') { g.fillStyle = '#f4ecd8'; g.fillRect(ix, iy, iw, ih); g.fillStyle = '#7a5a3a'; for (let k = 0; k < 3; k++) g.fillRect(ix + 3, iy + 3 + k * 4, iw - 6, 1); g.fillStyle = '#c8402e'; g.beginPath(); g.arc(ix + iw - 5, iy + ih - 4, 2.5, 0, 7); g.fill(); }
}
function cartel(g, x, y, titulo) { g.fillStyle = '#efe2bf'; g.fillRect(x, y, 20, 26); g.fillStyle = '#d8c8a0'; g.fillRect(x, y + 24, 20, 2); o(g, x, y, 20, 26);
  g.fillStyle = '#5a4030'; g.fillRect(x + 4, y + 3, 12, 2); g.fillStyle = '#3a2418'; g.fillRect(x + 6, y + 7, 8, 9); g.fillStyle = '#efe2bf'; g.fillRect(x + 8, y + 9, 1, 1); g.fillRect(x + 11, y + 9, 1, 1); g.fillStyle = '#8a8a96'; g.fillRect(x + 13, y + 13, 3, 1);
  g.fillStyle = '#5a4030'; g.fillRect(x + 4, y + 18, 12, 1); g.fillRect(x + 6, y + 21, 8, 1); g.fillStyle = '#c8402e'; g.fillRect(x + 9, y + 1, 2, 2); }
function pescadoSeco(g, x, y) { g.strokeStyle = '#8a7a5a'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 30, y); g.stroke();
  for (let k = 0; k < 3; k++) { const px = x + 4 + k * 10; g.fillStyle = '#9a8a6a'; g.fillRect(px, y + 1, 1, 3); g.fillStyle = '#b8a070'; g.beginPath(); g.ellipse(px, y + 10, 3, 6, 0, 0, 7); g.fill(); g.fillStyle = '#8a7048'; g.beginPath(); g.moveTo(px - 3, y + 17); g.lineTo(px + 3, y + 17); g.lineTo(px, y + 14); g.fill(); g.fillStyle = INK; g.fillRect(px - 1, y + 6, 1, 1); } }
function espejo(g, x, y) { g.fillStyle = WOOD[2]; g.beginPath(); g.ellipse(x, y, 10, 13, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.stroke(); g.fillStyle = '#c8dcea'; g.beginPath(); g.ellipse(x, y, 7, 10, 0, 0, 7); g.fill(); g.fillStyle = '#eef6fb'; g.fillRect(x - 4, y - 6, 2, 6); }
function barquito(g, x, y) { g.fillStyle = WOOD[2]; g.beginPath(); g.moveTo(x - 10, y - 4); g.lineTo(x + 10, y - 4); g.lineTo(x + 6, y); g.lineTo(x - 7, y); g.fill(); g.strokeStyle = INK; g.stroke(); g.fillStyle = INK; g.fillRect(x, y - 16, 1, 12); g.fillStyle = '#f4ecd8'; g.beginPath(); g.moveTo(x + 1, y - 15); g.lineTo(x + 8, y - 6); g.lineTo(x + 1, y - 6); g.fill(); }
function alfombraVieja(g, x, y, w, h) { g.fillStyle = '#7a5a3a'; g.fillRect(x, y, w, h); g.fillStyle = '#9a7a52'; g.fillRect(x + 2, y + 2, w - 4, h - 4); g.fillStyle = '#6a4a2c'; for (let k = y + 6; k < y + h - 4; k += 6) g.fillRect(x + 3, k, w - 6, 1); for (let i = x + 1; i < x + w; i += 3) { g.fillStyle = '#c8b090'; g.fillRect(i, y - 1, 1, 2); g.fillRect(i, y + h - 1, 1, 2); } }
function laud(g, x, y) { g.fillStyle = WOOD[2]; g.beginPath(); g.ellipse(x, y, 7, 9, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.stroke(); g.fillStyle = INK; g.beginPath(); g.arc(x, y - 1, 2, 0, 7); g.fill(); g.fillStyle = WOOD[1]; g.fillRect(x - 1, y - 22, 3, 14); g.fillStyle = WOOD[0]; g.fillRect(x - 2, y - 25, 5, 4); }
function tambor(g, x, y) { g.fillStyle = '#c8402e'; g.fillRect(x - 9, y - 12, 18, 12); g.fillStyle = '#efe2bf'; g.beginPath(); g.ellipse(x, y - 12, 9, 4, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.stroke(); g.strokeStyle = '#e6c25e'; for (let k = -6; k <= 6; k += 6) { g.beginPath(); g.moveTo(x + k, y - 10); g.lineTo(x + k + 3, y - 1); g.stroke(); } o(g, x - 9, y - 12, 18, 12); }
function barcoBotella(g, x, y) { g.fillStyle = 'rgba(200,235,220,.55)'; g.beginPath(); g.ellipse(x, y - 5, 10, 5, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(40,60,50,.8)'; g.stroke(); g.fillStyle = 'rgba(200,235,220,.55)'; g.fillRect(x + 9, y - 7, 5, 4); g.fillStyle = WOOD[2]; g.fillRect(x + 13, y - 7, 2, 4);
  g.fillStyle = WOOD[1]; g.fillRect(x - 5, y - 5, 9, 2); g.fillStyle = '#fff'; g.fillRect(x - 2, y - 9, 3, 4); }
function balanza(g, x, y) { g.fillStyle = IRON[1]; g.fillRect(x - 1, y - 14, 2, 14); g.fillRect(x - 10, y - 14, 20, 2); g.fillStyle = '#d6b35a'; g.beginPath(); g.ellipse(x - 9, y - 7, 5, 2, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + 9, y - 9, 5, 2, 0, 0, 7); g.fill(); g.strokeStyle = IRON[2]; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * 9, y - 13); g.lineTo(x + s * 9, y - 8); g.stroke(); } g.fillStyle = IRON[0]; g.fillRect(x - 5, y - 1, 10, 2); }
function anclaPequena(g, x, y) { g.fillStyle = IRON[1]; g.fillRect(x - 2, y - 30, 4, 28); g.fillStyle = IRON[2]; g.fillRect(x - 2, y - 30, 1, 28); g.fillStyle = IRON[1]; g.fillRect(x - 9, y - 25, 18, 3); g.strokeStyle = IRON[1]; g.lineWidth = 3; g.beginPath(); g.arc(x, y - 33, 3, 0, 7); g.stroke(); g.beginPath(); g.arc(x, y - 10, 10, .2, Math.PI - .2); g.stroke(); g.lineWidth = 1; }
function remos(g, x, y) { for (let k = 0; k < 2; k++) { const px = x + k * 7; g.fillStyle = WOOD[2]; g.fillRect(px, y - 46, 2, 34); g.fillStyle = WOOD[3]; g.fillRect(px - 3, y - 14, 8, 14); g.strokeStyle = INK; g.strokeRect(px - 2.5, y - 13.5, 7, 13); } }
function barrilCanas(g, x, y) { put(g, R.barrel, x - 13, y - 36); g.strokeStyle = WOOD[2]; g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 6 + k * 4, y - 32); g.lineTo(x - 10 + k * 7, y - 62); g.stroke(); } g.lineWidth = 1; }
function hierbas(g, x, y) { g.strokeStyle = '#8a7a5a'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 34, y); g.stroke(); for (let k = 0; k < 4; k++) { const px = x + 4 + k * 9; g.fillStyle = ['#5a8a3a', '#7a9a4a', '#4a7a3a', '#8a9a5a'][k]; g.beginPath(); g.moveTo(px - 4, y + 2); g.lineTo(px + 4, y + 2); g.lineTo(px, y + 14); g.fill(); g.fillStyle = '#c8a070'; g.fillRect(px - 1, y, 2, 3); } }
function estantePan(g, x, y, w) { for (const dy of [0, 16]) { g.fillStyle = WOOD[2]; g.fillRect(x, y + dy + 12, w, 3); g.fillStyle = WOOD[0]; g.fillRect(x, y + dy + 15, w, 1); for (let px = x + 3; px < x + w - 6; px += 9) { g.fillStyle = (px / 9 | 0) % 2 ? '#c88a3a' : '#b8742a'; g.beginPath(); g.ellipse(px + 3, y + dy + 9, 4, 3, 0, 0, 7); g.fill(); g.fillStyle = '#e8b86a'; g.fillRect(px + 1, y + dy + 7, 3, 1); } } }
function cesta(g, x, y) { g.fillStyle = '#a8844a'; g.beginPath(); g.ellipse(x, y - 4, 10, 5, 0, 0, Math.PI); g.fill(); g.fillRect(x - 10, y - 9, 20, 5); g.strokeStyle = '#6a4a2c'; for (let k = -8; k <= 8; k += 4) { g.beginPath(); g.moveTo(x + k, y - 9); g.lineTo(x + k, y - 1); g.stroke(); }
  for (const [dx, c] of [[-4, '#c88a3a'], [3, '#b8742a'], [0, '#d89a4a']]) { g.fillStyle = c; g.beginPath(); g.ellipse(x + dx, y - 10, 4, 3, 0, 0, 7); g.fill(); } }
function palaHorno(g, x, y) { g.fillStyle = WOOD[3]; g.fillRect(x, y - 52, 2, 40); g.fillStyle = WOOD[2]; g.beginPath(); g.ellipse(x + 1, y - 8, 7, 9, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.stroke(); }
function harina(g, x, y, w, h) { for (let k = 0; k < w * h / 18; k++) { g.fillStyle = 'rgba(250,245,232,.55)'; g.fillRect(x + hash(k, 1, 77) * w, y + hash(k, 2, 77) * h, 1 + (hash(k, 3, 77) * 2 | 0), 1); } }
function farolPared(g, x, y) { g.fillStyle = IRON[0]; g.fillRect(x - 1, y - 4, 2, 4); g.fillRect(x - 5, y, 10, 2); g.fillStyle = '#ffd98a'; g.fillRect(x - 4, y + 2, 8, 9); g.fillStyle = IRON[0]; g.fillRect(x - 5, y + 11, 10, 2); g.fillRect(x - 4, y + 2, 1, 9); g.fillRect(x + 3, y + 2, 1, 9); }
function boyas(g, x, y) { g.strokeStyle = '#a89a7a'; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 18, y + 10, x + 36, y); g.stroke(); for (const [k, c] of [[6, '#c8402e'], [18, '#f4ecd8'], [30, '#c8402e']]) { g.fillStyle = c; g.beginPath(); g.arc(x + k, y + 4 + Math.sin(k / 36 * Math.PI) * 5, 3.5, 0, 7); g.fill(); g.strokeStyle = INK; g.stroke(); } }
// ---------- por edificio ----------
const it = (add, fn, key) => add.item({ fn, key });
const gaviota = (g, x, y) => { g.fillStyle = '#2f4f9a'; g.beginPath(); g.moveTo(x - 14, y); g.quadraticCurveTo(x - 6, y - 8, x, y); g.quadraticCurveTo(x + 6, y - 8, x + 14, y); g.quadraticCurveTo(x + 6, y - 4, x, y + 3); g.quadraticCurveTo(x - 6, y - 4, x - 14, y); g.fill(); };
function catalejoTripode(g, x, y) { g.strokeStyle = '#3a2418'; g.lineWidth = 2; for (const dx of [-8, 0, 8]) { g.beginPath(); g.moveTo(x, y - 22); g.lineTo(x + dx, y); g.stroke(); } g.save(); g.translate(x, y - 24); g.rotate(-.35); g.fillStyle = '#2a1a10'; g.fillRect(-14, -4, 30, 8); g.fillStyle = '#c8962e'; g.fillRect(-13, -3, 28, 6); g.fillStyle = '#f0d27a'; g.fillRect(-13, -3, 28, 1); g.fillStyle = '#9fd0f0'; g.fillRect(14, -2, 2, 4); g.restore(); }
const DECOR = {
  casa: [
    { at: [7, .5], fn: (g, X, Y) => { g.fillStyle = '#e8d6a8'; g.fillRect(X(6.6), Y(0) - 52, 36, 24); g.fillStyle = '#7a5a3a'; for (let i = 0; i < 4; i++) g.fillRect(X(6.6) + 4 + i * 8, Y(0) - 46 + (i % 2) * 6, 6, 1); g.fillStyle = '#c8402e'; g.fillRect(X(6.6) + 26, Y(0) - 40, 3, 3);
        for (const [px, c] of [[12.1, '#4a7ab8'], [12.9, '#c8402e']]) { g.fillStyle = '#f4ecd8'; g.fillRect(X(px), Y(0) - 50, 18, 14); g.fillStyle = c; g.fillRect(X(px) + 3, Y(0) - 42, 12, 2); g.fillRect(X(px) + 8, Y(0) - 47, 2, 6); } } },
    { at: [9, 4], fn: (g, X, Y, add) => { alfombraVieja(g, X(8.4), Y(3.9), 3.2 * T, 1.5 * T); it(add, gg => barquito(gg, X(9.3), Y(5.3)), Y(5.3)); } },
    { at: [4, .5], fn: (g, X, Y) => { espejo(g, X(4.85), Y(0) - 44); nine(g, R.rug, 16, X(2.4), Y(3.4), 2.6 * T, 1.8 * T); } },
    { at: [4.85, 1], fn: (g, X, Y, add) => it(add, gg => put(gg, RD.florero, X(4.5) - 9, Y(1.1) - 50 - 26), Y(1.1) + 2) },
    { at: [1.4, 6.5], fn: (g, X, Y) => { put(g, R.pots, X(1.4), Y(6) - 2 * T - 2); pescadoSeco(g, X(2.9), Y(6) - 2 * T + 8); cuadro(g, X(10.05), Y(6) - 2 * T + 8, 26, 20, 'mar'); } },
    { at: [5.8, 8.6], fn: (g, X, Y, add) => it(add, gg => put(gg, RD.florero, X(5.8) - 9, Y(10.1) - 42 - 24), Y(10.1) + 3) },
    { at: [3.6, 8], fn: (g, X, Y, add) => it(add, gg => cesta(gg, X(3.6), Y(7.9)), Y(7.9)) },
  ],
  taberna: [
    { at: [1, .5], fn: (g, X, Y) => { put(g, R.pots, X(1.6), Y(0) - 2 * T); pescadoSeco(g, X(2.6), Y(0) - 2 * T + 6); } },
    { at: [2.6, 2.6], fn: (g, X, Y, add) => { add.item({ img: RD.caldero, x: X(2.6) - 15, y: Y(2.8) - 31, key: Y(2.8) }); add.block([X(2.6) - 14, Y(2.8) - 12, 28, 12]); add.item({ img: R.sack, x: X(3.2) - 16, y: Y(4.6) - 31, key: Y(4.6) }); } },
    { at: [11.9, 1], fn: (g, X, Y, add) => { add.item({ img: RD.reloj, x: X(12) - 9, y: Y(1.25) - 71, key: Y(1.25) }); add.block([X(12) - 9, Y(1.25) - 12, 18, 12]); } },
    { at: [2, 5.5], fn: (g, X, Y) => { put(g, RD.retrato, X(0.6), Y(5) - 2 * T + 6); cartel(g, X(1.9), Y(5) - 2 * T + 10); put(g, RD.antorcha, X(3.3), Y(5) - 2 * T + 4); put(g, RD.escudo, X(11.75) - 9, Y(0) - 2 * T + 6); } },
    { at: [15.4, 6], fn: (g, X, Y, add) => { add.item({ img: RD.candelabro, x: X(15.4) - 16, y: Y(6.4) - 71, key: Y(6.4) }); add.block([X(15.4) - 12, Y(6.4) - 10, 24, 10]); add.fire({ x: X(15.4), y: Y(6.4) - 62, r: 70, kind: 'vela' }); } },
    { at: [13.5, 7.5], fn: (g, X, Y, add) => { it(add, gg => laud(gg, X(13.2), Y(8.3)), Y(8.6)); it(add, gg => tambor(gg, X(14.9), Y(8.5)), Y(8.6)); } },
    { at: [6, 3.5], fn: (g, X, Y, add) => { it(add, gg => { barcoBotella(gg, X(5.3), Y(3.1) - 6); put(gg, RD.botella1, X(9.8), Y(3.1) - 30); put(gg, RD.botella2, X(10.3), Y(3.1) - 30); }, Y(4.3) + 2); } },
  ],
  brin: [
    { at: [4.6, .5], fn: (g, X, Y) => { put(g, R.pots, X(4.6), Y(0) - 2 * T - 2); pescadoSeco(g, X(0.6), Y(0) - 2 * T + 6); boyas(g, X(5.2), Y(0) - 2 * T + 22); } },
    { at: [3.2, 4.3], fn: (g, X, Y) => alfombraVieja(g, X(2.6), Y(4.1), 1.6 * T, 0.9 * T) },
    { at: [5.4, 3.2], fn: (g, X, Y, add) => { it(add, gg => barcoBotella(gg, X(5.9), Y(2.8) - 6), Y(3.9) + 2); add.item({ img: RD.lampara, x: X(4.6) - 10, y: Y(2.8) - 36, key: Y(3.9) + 3 }); add.fire({ x: X(4.6), y: Y(2.8) - 24, r: 60, kind: 'vela' }); } },
  ],
  tienda: [
    { at: [7, 2.4], fn: (g, X, Y, add) => { add.item({ img: RD.soga, x: X(7) - 9, y: Y(2.5) - 29, key: Y(2.5) }); add.item({ img: RD.soga, x: X(9.2) - 9, y: Y(2.5) - 29, key: Y(2.5) }); remos(g, X(8.5), Y(0) + 2); it(add, gg => anclaPequena(gg, X(9.4), Y(1.4)), Y(1.4)); } },
    { at: [9.5, 3.5], fn: (g, X, Y, add) => { it(add, gg => barrilCanas(gg, X(9.5), Y(4.1)), Y(4.1)); add.block([X(9.5) - 12, Y(4.1) - 14, 24, 14]); farolPared(g, X(9.5), Y(3) - 2 * T + 10); add.fire({ x: X(9.5), y: Y(3) - 2 * T + 16, r: 55, kind: 'vela' }); } },
    { at: [4, 5], fn: (g, X, Y, add) => it(add, gg => { balanza(gg, X(2.3), Y(4.7) - 14); put(gg, RD.soga, X(3.6), Y(4.7) - 40); put(gg, RD.lampara, X(5.7), Y(4.7) - 42); }, Y(5.7) + 2) },
    { at: [0.7, 5.3], fn: (g, X, Y, add) => { it(add, gg => anclaPequena(gg, X(0.75), Y(5.6)), Y(5.6)); add.block([X(0.75) - 10, Y(5.6) - 10, 20, 10]); } },
    { at: [7.8, 4.3], fn: (g, X, Y, add) => it(add, gg => remos(gg, X(7.65), Y(4.4)), Y(4.4)) },
  ],
  medico: [
    { at: [4.9, .6], fn: (g, X, Y, add) => { add.item({ img: R.books, x: X(4.4), y: Y(1) - 64, key: Y(1) }); add.block([X(4.4), Y(1) - 20, 32, 20]); add.item({ img: RD.lampara, x: X(2.15) - 10, y: Y(0.9) - 28, key: Y(0.9) }); } },
    { at: [8.8, .5], fn: (g, X, Y, add) => { hierbas(g, X(8.1), Y(0) - 2 * T + 8); put(g, R.pots, X(6.6), Y(0) - 2 * T); add.item({ img: RD.cuenco, x: X(8.7) - 11, y: Y(1.6) - 30, key: Y(2.4) + 1 }); } },
    { at: [6.8, 3.6], fn: (g, X, Y, add) => { add.item({ img: RD.esqueleto, x: X(6.8) - 16, y: Y(4.05) - 51, key: Y(4.05) }); add.block([X(6.8) - 10, Y(4.05) - 10, 20, 10]); } },
    { at: [9.5, 3.6], fn: (g, X, Y, add) => { add.item({ img: RD.reloj, x: X(9.55) - 9, y: Y(4.05) - 71, key: Y(4.05) }); add.block([X(9.55) - 9, Y(4.05) - 10, 18, 10]); } },
    { at: [1.2, 3.5], fn: (g, X, Y) => cuadro(g, X(0.7), Y(3) - 2 * T + 8, 32, 24, 'diploma') },
    { at: [8.2, 5], fn: (g, X, Y, add) => it(add, gg => { put(gg, RD.calavera, X(7.3), Y(4.4) - 30); put(gg, RD.pocion1, X(8.2), Y(4.4) - 30); put(gg, RD.pocion3, X(8.8), Y(4.4) - 37); put(gg, RD.frasco, X(9.1), Y(4.4) - 30); }, Y(5.6) + 2) },
    { at: [0.9, 7.5], fn: (g, X, Y, add) => { add.item({ img: RD.palangana, x: X(0.9) - 14, y: Y(7.7) - 16, key: Y(7.7) }); add.item({ img: R.plant, x: X(6.6) - 16, y: Y(7.7) - 57, key: Y(7.7) }); } },
  ],
  faro: [
    { at: [3.5, 1], fn: (g, X, Y, add) => { cuadro(g, X(0.6), Y(0) - 2 * T + 10, 30, 22, 'mar'); farolPared(g, X(3.5), Y(0) - 2 * T + 8); add.fire({ x: X(3.5), y: Y(0) - 2 * T + 14, r: 60, kind: 'vela' }); } },
    { at: [6, 2.4], fn: (g, X, Y, add) => { it(add, gg => catalejoTripode(gg, X(6.1), Y(3.2)), Y(3.2)); add.block([X(6.1) - 9, Y(3.2) - 6, 18, 6]); add.item({ img: RD.soga, x: X(1.2) - 9, y: Y(6.3) - 29, key: Y(6.3) }); } },
    { at: [5.3, 4.9], fn: (g, X, Y, add) => it(add, gg => { gg.fillStyle = '#efe2bf'; gg.fillRect(X(5) , Y(4.4) - 22, 18, 12); gg.fillStyle = '#5a4030'; for (let k = 0; k < 3; k++) gg.fillRect(X(5) + 3, Y(4.4) - 19 + k * 3, 12, 1); put(gg, RD.frasco, X(5.9), Y(4.4) - 28); }, Y(5.5) + 2) },
  ],
  cuartel: [
    { at: [9, 6], fn: (g, X, Y, add) => { gaviota(g, X(9), Y(4) - 2 * T + 22); g.fillStyle = '#2f4f9a'; g.font = '900 11px Georgia, serif'; g.textAlign = 'center'; g.fillText('MARINE', X(9), Y(4) - 2 * T + 40);
      for (const px of [4.2, 4.9, 13.4, 14.1]) { g.fillStyle = '#efe2bf'; g.fillRect(X(px), Y(4) - 2 * T + 12, 18, 24); g.fillStyle = '#5a4030'; g.fillRect(X(px) + 4, Y(4) - 2 * T + 16, 10, 9); g.fillRect(X(px) + 3, Y(4) - 2 * T + 28, 12, 2); }
      farolPared(g, X(7), Y(4) - 2 * T + 8); farolPared(g, X(11), Y(4) - 2 * T + 8); add.fire({ x: X(7), y: Y(4) - 2 * T + 14, r: 70, kind: 'vela' }); add.fire({ x: X(11), y: Y(4) - 2 * T + 14, r: 70, kind: 'vela' }); } },
    { at: [3, 2], fn: (g, X, Y) => { cuadro(g, X(4.2), Y(0) - 2 * T + 10, 30, 22, 'mar'); } },
    { at: [9, 2], fn: (g, X, Y) => { cuadro(g, X(9.8), Y(0) - 2 * T + 6, 34, 28, 'retrato'); gaviota(g, X(8.2), Y(0) - 2 * T + 30); } },
  ],
  bateria: [
    { at: [6, 2], fn: (g, X, Y, add) => { for (const cx of [2, 5, 8, 10.7]) { const x = X(cx), y = Y(3.6); it(add, gg => { gg.fillStyle = 'rgba(0,0,0,.3)'; gg.beginPath(); gg.ellipse(x, y + 2, 20, 6, 0, 0, 7); gg.fill();
        gg.fillStyle = '#2a1a10'; gg.fillRect(x - 15, y - 14, 30, 16); gg.fillStyle = '#5a3a22'; gg.fillRect(x - 14, y - 13, 28, 14); gg.fillStyle = '#1a1a20'; gg.beginPath(); gg.arc(x - 9, y + 1, 5, 0, 7); gg.arc(x + 9, y + 1, 5, 0, 7); gg.fill();
        gg.fillStyle = '#1a1a20'; gg.fillRect(x - 6, y - 22, 12, 30); gg.fillStyle = '#3a3a46'; gg.fillRect(x - 5, y - 21, 10, 28); gg.fillStyle = '#5a5a66'; gg.fillRect(x - 5, y - 21, 2, 28); gg.fillStyle = '#0a0a0c'; gg.beginPath(); gg.ellipse(x, y + 8, 4, 2, 0, 0, 7); gg.fill(); }, y + 4);
        add.block([x - 15, y - 14, 30, 18]); }
      for (const [bx, by] of [[3.4, 3.4], [6.5, 3.5], [9.4, 3.4]]) it(add, gg => { for (let k = 0; k < 3; k++) { gg.fillStyle = '#1a1a20'; gg.beginPath(); gg.arc(X(bx) + k * 7 - 7, Y(by), 3.5, 0, 7); gg.fill(); } gg.fillStyle = '#1a1a20'; gg.beginPath(); gg.arc(X(bx), Y(by) - 5, 3.5, 0, 7); gg.fill(); }, Y(by) + 2); } },
  ],
  cantina: [
    { at: [1, .5], fn: (g, X, Y) => { put(g, R.pots, X(1.6), Y(0) - 2 * T); pescadoSeco(g, X(3), Y(0) - 2 * T + 6); } },
    { at: [2.6, 2.6], fn: (g, X, Y, add) => { add.item({ img: RD.caldero, x: X(2.8) - 15, y: Y(2.2) - 31, key: Y(2.2) }); add.block([X(2.8) - 14, Y(2.2) - 12, 28, 12]); add.fire({ x: X(2.8), y: Y(2) - 20, r: 90, kind: 'fuego', flame: false }); } },
    { at: [3, 5.5], fn: (g, X, Y) => { cuadro(g, X(0.6), Y(4) - 2 * T + 10, 30, 22, 'mar'); put(g, RD.antorcha, X(3.6), Y(4) - 2 * T + 4); cartel(g, X(2.4), Y(4) - 2 * T + 10); } },
    { at: [12, 6], fn: (g, X, Y, add) => { add.item({ img: RD.candelabro, x: X(13.3) - 16, y: Y(8.6) - 71, key: Y(8.6) }); add.block([X(13.3) - 12, Y(8.6) - 10, 24, 10]); add.fire({ x: X(13.3), y: Y(8.6) - 56, r: 110, kind: 'vela' }); } },
  ],
  posada: [
    { at: [3, 1.5], fn: (g, X, Y) => { espejo(g, X(4.9), Y(0) - 44); cuadro(g, X(0.6), Y(0) - 2 * T + 10, 26, 20, 'mar'); } },
    { at: [9, 1.5], fn: (g, X, Y, add) => { it(add, gg => { barcoBotella(gg, X(7), Y(1.8) - 6); put(gg, RD.botella1, X(9.4), Y(1.8) - 30); }, Y(2.9) + 2); farolPared(g, X(12), Y(0) - 2 * T + 10); add.fire({ x: X(12), y: Y(0) - 2 * T + 16, r: 80, kind: 'vela' }); } },
    { at: [3, 6], fn: (g, X, Y, add) => { cuadro(g, X(8), Y(4) - 2 * T + 8, 34, 24, 'mar'); it(add, gg => cesta(gg, X(4.8), Y(6.1)), Y(6.1)); } },
  ],
  marina: [
    { at: [6, 6], fn: (g, X, Y) => { gaviota(g, X(5.5), Y(4) - 2 * T + 22); g.fillStyle = '#2f4f9a'; g.font = '900 11px Georgia, serif'; g.textAlign = 'center'; g.fillText('MARINE', X(5.5), Y(4) - 2 * T + 40); cuadro(g, X(1.4), Y(4) - 2 * T + 10, 34, 24, 'mar'); g.fillStyle = '#efe2bf'; g.fillRect(X(10.2), Y(4) - 2 * T + 12, 18, 24); g.fillStyle = '#5a4030'; for (let k = 0; k < 5; k++) g.fillRect(X(10.2) + 3, Y(4) - 2 * T + 16 + k * 4, 12, 1); } },
  ],
  panaderia: [
    { at: [4, 1], fn: (g, X, Y, add) => { estantePan(g, X(3.15), Y(0) - 2 * T + 6, 1.8 * T); harina(g, X(0.4), Y(1.4), 2.8 * T, 0.9 * T); it(add, gg => palaHorno(gg, X(4.6), Y(1.7)), Y(1.7)); add.item({ img: R.logs, x: X(6.3) - 15, y: Y(2.3) - 32, key: Y(2.3) }); } },
    { at: [3, 3], fn: (g, X, Y, add) => it(add, gg => { cesta(gg, X(1.8), Y(2.7) - 12); cesta(gg, X(3.3), Y(2.7) - 12); cesta(gg, X(4.8), Y(2.7) - 12); }, Y(3.6) + 2) },
    { at: [7.6, 3], fn: (g, X, Y, add) => it(add, gg => { gg.fillStyle = '#d6b35a'; for (let k = 0; k < 7; k++) gg.fillRect(X(7.5) - 7 + k * 2, Y(3.2) - 28 + (k % 2) * 2, 1, 26); gg.fillStyle = '#a07830'; gg.fillRect(X(7.5) - 8, Y(3.2) - 12, 16, 3); }, Y(3.2)) },
  ],
};
