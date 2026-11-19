// Tiza: escenas dibujadas a mano alzada sobre una pizarra. Trazos de tres grosores, sombreado a rayas,
// borrones de polvo y un poco de tiza de color para lo importante. pizarra(escenas, fin) las pasa una por una.
const TZ_COL = { b: '245,240,228', a: '242,211,107', r: '232,130,110', z: '142,198,232' };
const tz = {
  line: (a, b) => [a, b],
  poly: (pts, close) => close ? [...pts, pts[0]] : pts,
  circle: (cx, cy, rx, ry = rx, n = 28, a0 = 0, a1 = Math.PI * 2) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; }),
  wave: (x0, y, x1, amp = 4, step = 14) => { const p = []; for (let x = x0; x <= x1; x += step / 2) p.push([x, y + ((x - x0) / (step / 2)) % 2 * amp - amp / 2]); return p; },
  blob: (cx, cy, rx, ry, seed) => Array.from({ length: 33 }, (_, i) => { const a = i / 32 * Math.PI * 2, k = 1 + (hash(i % 32, 3, seed) - .5) * .22; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; }),
};
// atajos para componer: tzS(puntos, opciones) devuelve un trazo con estilo
const tzS = (p, o = {}) => ({ p, ...o });
const olas = (y0, n, x0 = 40, x1 = 600, c) => Array.from({ length: n }, (_, k) => tzS(tz.wave(x0 + (k % 2) * 20, y0 + k * 18, x1 - (k % 2) * 30, 4 - k * .3, 16 + k * 2), { w: k ? 1 : 2, c }));
const pajaro = (x, y, k = 1) => tzS([[x - 8 * k, y - 3 * k], [x - 3 * k, y], [x, y - 2 * k], [x + 3 * k, y], [x + 8 * k, y - 3 * k]], { w: 1 });
const estrella = (x, y, r = 3, c = 'b') => [tzS([[x - r, y], [x + r, y]], { w: 1, c }), tzS([[x, y - r], [x, y + r]], { w: 1, c })];
const persona = (x, y, h = 60, o = {}) => { const r = h * .13, cab = tz.circle(x, y - h + r, r, r, 14), out = [tzS(cab, { w: 2 }), tzS([[x, y - h + 2 * r], [x, y - h * .38]], { w: 2 }), tzS([[x, y - h * .38], [x - h * .16, y]], { w: 2 }), tzS([[x, y - h * .38], [x + h * .16, y]], { w: 2 })];
  const brazo = o.saluda ? [[x, y - h * .72], [x + h * .2, y - h * .9], [x + h * .26, y - h * 1.08]] : [[x, y - h * .72], [x + h * .2, y - h * .5]]; out.push(tzS([[x, y - h * .72], [x - h * .2, y - h * .5]], { w: 2 }), tzS(brazo, { w: 2 }));
  if (o.falda) out.push(tzS([[x - h * .05, y - h * .62], [x - h * .2, y - h * .3], [x + h * .2, y - h * .3], [x + h * .05, y - h * .62]], { w: 1, h: .9 }));
  if (o.capucha) out.push(tzS(tz.circle(x, y - h + r, r * 1.5, r * 1.5, 14, Math.PI * .9, Math.PI * 2.1), { w: 2, h: .7, dense: true }), tzS([[x - r * 1.4, y - h + r * 1.5], [x - h * .24, y - h * .1], [x + h * .24, y - h * .1], [x + r * 1.4, y - h + r * 1.5]], { w: 2, h: .8, dense: true }));
  if (o.gorra) out.push(tzS([[x - r * 1.3, y - h + r * .3], [x + r * 1.3, y - h + r * .3], [x + r * 1.1, y - h - r * .5], [x - r * 1.1, y - h - r * .5]], { w: 1, c: 'z', close: true }));
  return out; };
const casita = (x, y, w, h, o = {}) => [tzS(tz.poly([[x, y], [x, y - h], [x + w, y - h], [x + w, y]]), { w: 2 }), tzS(tz.poly([[x - 6, y - h], [x + w / 2, y - h - h * .7], [x + w + 6, y - h]], true), { w: 2, h: o.paja ? -.6 : .6 }),
  tzS(tz.poly([[x + w * .42, y], [x + w * .42, y - h * .55], [x + w * .62, y - h * .55], [x + w * .62, y]]), { w: 1 }), ...(o.luz ? [tzS(tz.poly([[x + w * .12, y - h * .7], [x + w * .3, y - h * .7], [x + w * .3, y - h * .45], [x + w * .12, y - h * .45]], true), { w: 1, c: 'a', sm: true })] : [])];
const faro = (x, y, h, haz) => [tzS(tz.poly([[x - 12, y], [x - 8, y - h], [x + 8, y - h], [x + 12, y]]), { w: 2 }), tzS([[x - 11, y - h * .35], [x + 11, y - h * .35]], { w: 1, c: 'r' }), tzS([[x - 10, y - h * .65], [x + 10, y - h * .65]], { w: 1, c: 'r' }),
  tzS(tz.poly([[x - 9, y - h], [x - 9, y - h - 12], [x + 9, y - h - 12], [x + 9, y - h]], true), { w: 1, c: 'a', sm: true }), tzS(tz.poly([[x - 11, y - h - 12], [x, y - h - 22], [x + 11, y - h - 12]]), { w: 2 }),
  ...(haz ? [tzS(tz.poly([[x + 9, y - h - 7], [x + haz, y - h - 30], [x + haz, y - h + 16]], true), { w: 1, c: 'a', sm: true })] : [])];
// barco de perfil: tipo 'balandra' (un palo), 'marina' (dos palos, gaviota azul) o 'negro' (todo sombreado, medusa roja)
function barcoT(x, y, k, tipo) { const L = 150 * k, out = [], dens = tipo === 'negro';
  out.push(tzS(tz.poly([[x, y - 14 * k], [x + L, y - 14 * k], [x + L * .86, y + 10 * k], [x + L * .1, y + 10 * k]], true), { w: 2, h: .5, dense: dens }));
  out.push(tzS([[x + L, y - 14 * k], [x + L + 22 * k, y - 26 * k]], { w: 1 }));
  const palos = tipo === 'balandra' ? [.48] : [.32, .66];
  for (const f of palos) { const mx = x + L * f, top = y - 110 * k; out.push(tzS([[mx, y - 14 * k], [mx, top]], { w: 2 }));
    out.push(tzS(tz.poly([[mx - 30 * k, top + 12 * k], [mx + 30 * k, top + 12 * k], [mx + 34 * k, top + 52 * k], [mx - 34 * k, top + 52 * k]], true), { w: 1, h: tipo === 'negro' ? .4 : null, dense: dens }));
    out.push(tzS(tz.poly([[mx - 36 * k, top + 58 * k], [mx + 36 * k, top + 58 * k], [mx + 40 * k, top + 92 * k], [mx - 40 * k, top + 92 * k]], true), { w: 1, h: tipo === 'negro' ? .4 : null, dense: dens }));
    if (tipo === 'marina') out.push(tzS([[mx - 12 * k, top + 74 * k], [mx - 5 * k, top + 70 * k], [mx, top + 75 * k], [mx + 5 * k, top + 70 * k], [mx + 12 * k, top + 74 * k]], { w: 2, c: 'z' }));
    out.push(tzS(tz.poly([[mx, top], [mx + 18 * k, top + 4 * k], [mx, top + 9 * k]]), { w: 1, c: tipo === 'negro' ? 'r' : tipo === 'marina' ? 'z' : 'b' })); }
  if (tipo === 'negro') { const fx = x + L * .32 + 9 * k, fy = y - 104 * k; out.push(tzS(tz.circle(fx, fy, 3 * k, 3 * k, 8), { w: 1, c: 'r' }), tzS([[fx - 3 * k, fy + 2 * k], [fx - 4 * k, fy + 7 * k]], { w: 1, c: 'r' }), tzS([[fx + 3 * k, fy + 2 * k], [fx + 4 * k, fy + 7 * k]], { w: 1, c: 'r' })); }
  out.push(tzS(tz.wave(x - 30 * k, y + 14 * k, x + L * .9, 3, 12), { w: 1 })); return out; }
const luna = (x, y, r) => [tzS(tz.circle(x, y, r, r, 30), { w: 2, sm: true }), tzS(tz.circle(x + r * .35, y - r * .1, r * .18, r * .18, 10), { w: 1 })];
const rosa = (x, y, r, aguja) => [tzS(tz.circle(x, y, r, r, 24), { w: 1 }), tzS([[x, y - r - 6], [x, y + r + 6]], { w: 1 }), tzS([[x - r - 6, y], [x + r + 6, y]], { w: 1 }), ...(aguja ? [tzS([[x - Math.cos(aguja) * r * .8, y - Math.sin(aguja) * r * .8], [x + Math.cos(aguja) * r * .8, y + Math.sin(aguja) * r * .8]], { w: 2, c: 'r' })] : [])];
const ESC = {
  kale: () => [tzS(tz.blob(320, 214, 175, 52, 4), { w: 2, h: .9 }), ...faro(452, 190, 46, 120), ...casita(250, 196, 26, 18, { paja: true }), ...casita(292, 200, 22, 15), ...casita(352, 198, 24, 16, { luz: true }),
    tzS(tz.circle(320, 176, 4, 4, 10), { w: 1 }), tzS([[320, 180], [320, 196]], { w: 2 }), tzS(tz.circle(320, 192, 9, 7, 12, .2, Math.PI - .2), { w: 1 }),
    tzS(tz.circle(206, 196, 12, 10, 14), { w: 1, h: .3 }), tzS([[206, 206], [206, 214]], { w: 2 }), tzS(tz.circle(395, 199, 10, 9, 14), { w: 1, h: .3 }),
    ...olas(262, 4), pajaro(150, 80), pajaro(178, 92, .8), pajaro(520, 70, .9), ...rosa(84, 70, 22), tzS([[84, 40], [80, 32], [88, 32], [84, 24]], { w: 1 })],
  casa: () => [...casita(220, 268, 200, 120, { paja: true, luz: true }), tzS(tz.poly([[245, 200], [285, 200], [285, 236], [245, 236]], true), { w: 1, c: 'a', sm: true }), tzS(tz.poly([[365, 200], [395, 200], [395, 236], [365, 236]], true), { w: 1, c: 'a', sm: true }),
    tzS(tz.poly([[372, 128], [372, 96], [390, 96], [390, 140]]), { w: 2 }), tzS(tz.circle(386, 80, 10, 7, 14, Math.PI * .8, Math.PI * 2.4), { w: 1 }), tzS(tz.circle(398, 58, 13, 9, 14, Math.PI * .8, Math.PI * 2.4), { w: 1 }), tzS(tz.circle(412, 34, 16, 10, 14, Math.PI * .8, Math.PI * 2.4), { w: 1 }),
    ...persona(318, 268, 58, { falda: true }), tzS(tz.circle(318, 205, 5, 5, 8), { w: 1 }), tzS([[120, 270], [520, 270]], { w: 2 }), ...Array.from({ length: 6 }, (_, k) => tzS([[452 + k * 12, 270], [452 + k * 12, 248], [456 + k * 12, 244], [460 + k * 12, 248], [460 + k * 12, 270]], { w: 1 })), tzS([[452, 258], [524, 258]], { w: 1 }),
    ...[150, 170, 190].map(x => tzS(tz.circle(x, 262, 4, 4, 8), { w: 1, c: 'r' }))],
  corso: () => [...persona(280, 280, 110), ...persona(352, 280, 62, { saluda: true }), tzS([[302, 205], [338, 238]], { w: 2 }), tzS(tz.poly([[372, 222], [400, 222], [394, 232], [378, 232]], true), { w: 1 }), tzS(tz.poly([[386, 222], [386, 200], [398, 218]], true), { w: 1, c: 'a', sm: true }),
    tzS(tz.circle(500, 80, 24, 24, 24), { w: 2, c: 'a', sm: true }), ...Array.from({ length: 8 }, (_, k) => { const a = k / 8 * Math.PI * 2; return tzS([[500 + Math.cos(a) * 32, 80 + Math.sin(a) * 32], [500 + Math.cos(a) * 42, 80 + Math.sin(a) * 42]], { w: 1, c: 'a' }); }), tzS([[140, 282], [520, 282]], { w: 2 }), ...olas(302, 2)],
  padre: () => [tzS(tz.poly([[200, 170], [200, 70], [300, 70], [300, 170]], true), { w: 3 }), tzS(tz.poly([[212, 158], [212, 82], [288, 82], [288, 158]], true), { w: 1, h: .8, dense: true }), tzS([[160, 176], [340, 176]], { w: 2 }), tzS([[176, 176], [176, 240]], { w: 2 }), tzS([[324, 176], [324, 240]], { w: 2 }),
    ...rosa(250, 160, 9, -.5), tzS(tz.poly([[400, 70], [560, 70], [560, 190], [400, 190]], true), { w: 2 }), tzS([[480, 70], [480, 190]], { w: 1 }), tzS(tz.wave(404, 150, 556, 3, 12), { w: 1, c: 'z' }), ...barcoT(500, 132, .14, 'balandra'),
    ...Array.from({ length: 6 }, (_, k) => tzS(tz.circle(380 + k * 34, 280 - k * 10, 5, 3, 8), { w: 1 })), tzS([[120, 296], [560, 296]], { w: 2 })],
  negro: () => [...luna(520, 70, 26), ...barcoT(160, 230, 1.4, 'negro'), ...olas(256, 4), ...estrella(90, 60), ...estrella(140, 40, 2), ...estrella(420, 50, 2)],
  zarpa_pirata: (o) => [tzS([[30, 250], [210, 250]], { w: 2 }), ...[50, 110, 170].map(x => tzS([[x, 250], [x, 290]], { w: 2 })), tzS(tz.blob(90, 240, 120, 22, 7), { w: 1, h: .9 }), ...faro(60, 230, 40, 150),
    ...(o.promesa ? persona(150, 250, 40, { saluda: true }) : persona(150, 250, 40)), ...persona(124, 250, 52, { falda: true }), ...barcoT(330, 250, .9, 'balandra'), tzS(tz.wave(300, 270, 560, 3, 10), { w: 1 }), tzS(tz.wave(320, 284, 580, 3, 12), { w: 1 }),
    ...luna(540, 64, 20), ...estrella(420, 40, 2), ...estrella(470, 90, 2), ...estrella(280, 60, 3)],
  zarpa_marina: (o) => [tzS([[30, 250], [190, 250]], { w: 2 }), ...[50, 110, 170].map(x => tzS([[x, 250], [x, 290]], { w: 2 })), ...faro(70, 236, 40, 140), ...(o.promesa ? persona(140, 250, 40, { saluda: true }) : persona(140, 250, 40)),
    ...barcoT(290, 250, 1.05, 'marina'), ...persona(430, 236, 26, { gorra: true }), tzS(tz.wave(270, 272, 600, 3, 10), { w: 1 }), ...luna(560, 60, 18), ...estrella(250, 50, 2), ...estrella(520, 120, 2)],
  noche: (o) => [...luna(320, 90, 42), ...Array.from({ length: 7 }, (_, k) => tzS([[300 - k * 4, 168 + k * 14], [340 + k * 4, 168 + k * 14]], { w: 1, c: 'a' })), ...olas(200, 6, 30, 610),
    ...barcoT(150, 196, .45, o.tipo), ...rosa(560, 300, 24, o.tipo === 'balandra' ? -.4 : -.1), ...[[80, 60], [140, 30], [470, 40], [520, 100], [600, 60], [220, 70]].flatMap(([x, y]) => estrella(x, y, 2))],
  goa: () => [tzS(tz.circle(470, 210, 60, 60, 26, Math.PI, Math.PI * 2), { w: 2, c: 'a', sm: true }), ...Array.from({ length: 7 }, (_, k) => { const a = Math.PI + (k + .5) / 7 * Math.PI; return tzS([[470 + Math.cos(a) * 70, 210 + Math.sin(a) * 70], [470 + Math.cos(a) * 92, 210 + Math.sin(a) * 92]], { w: 1, c: 'r' }); }),
    tzS(tz.poly([[230, 210], [230, 120], [420, 120], [420, 210]]), { w: 2 }), ...[230, 290, 360, 420].map(x => tzS(tz.poly([[x - 12, 120], [x - 12, 90], [x + 12, 90], [x + 12, 120]], true), { w: 2, h: .7 })), ...[230, 290, 360, 420].map(x => tzS([[x, 90], [x, 72], [x + 14, 76], [x, 80]], { w: 1, c: 'a' })),
    tzS(tz.poly([[300, 120], [325, 60], [350, 120]], true), { w: 2, h: -.6 }), tzS(tz.blob(150, 214, 110, 26, 9), { w: 2, h: .8, dense: true }), ...[110, 160, 200].map((x, k) => tzS(Array.from({ length: 12 }, (_, i) => [x + Math.sin(i * .9 + k) * 6, 200 - i * 9]), { w: 1 })),
    tzS([[40, 214], [600, 214]], { w: 1 }), ...olas(236, 4), ...barcoT(70, 268, .35, 'balandra'), pajaro(400, 160), pajaro(430, 150, .8)],
  loguetown: () => [tzS(tz.circle(140, 200, 50, 50, 24, Math.PI, Math.PI * 2), { w: 2, c: 'a', sm: true }), ...Array.from({ length: 9 }, (_, k) => { const x = 200 + k * 42, h = 40 + hash(k, 2, 5) * 50; return tzS(tz.poly([[x, 210], [x, 210 - h], [x + 20, 210 - h - 14], [x + 38, 210 - h], [x + 38, 210]]), { w: 1, h: k % 2 ? .6 : -.6 }); }),
    tzS(tz.poly([[330, 210], [330, 150], [400, 150], [400, 210]]), { w: 2 }), tzS([[330, 150], [365, 130], [400, 150]], { w: 2 }), ...[340, 355, 370, 385].map(x => tzS([[x, 150], [x, 210]], { w: 1 })), tzS([[365, 130], [365, 104]], { w: 2 }), tzS(tz.poly([[365, 104], [392, 110], [365, 116]]), { w: 1, c: 'r' }),
    tzS(tz.poly([[520, 210], [520, 90], [556, 90], [556, 210]]), { w: 2, h: .7 }), tzS([[538, 90], [538, 64]], { w: 2 }), tzS(tz.poly([[538, 64], [568, 70], [538, 76]]), { w: 1, c: 'z' }), tzS([[541, 70], [546, 67], [550, 70]], { w: 1, c: 'z' }),
    tzS([[40, 212], [600, 212]], { w: 1 }), ...olas(234, 4), ...barcoT(60, 272, .42, 'marina')],
};
// --------- dibujo ---------
const TZ_FONDO = (() => { const [c, g] = mkCanvas(640, 360); g.fillStyle = '#1a201d'; g.fillRect(0, 0, 640, 360);
  for (let k = 0; k < 28; k++) { const x = hash(k, 1, 13) * 640, y = hash(k, 2, 13) * 360, r = 40 + hash(k, 3, 13) * 120, gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(230,240,230,.035)'); gr.addColorStop(1, 'rgba(230,240,230,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
  g.strokeStyle = 'rgba(230,240,230,.016)'; g.lineWidth = 26; g.lineCap = 'round'; for (let k = 0; k < 7; k++) { const y = 30 + hash(k, 5, 13) * 300, x = hash(k, 4, 13) * 400; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 140 + hash(k, 6, 13) * 200, y + (hash(k, 7, 13) - .5) * 30); g.stroke(); }
  for (let k = 0; k < 2500; k++) { g.fillStyle = `rgba(255,255,255,${hash(k, 8, 13) * .05})`; g.fillRect(hash(k, 9, 13) * 640, hash(k, 10, 13) * 360, 1, 1); } return c; })();
const largo = p => p.reduce((L, q, i) => i ? L + Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0, 0);
function chalkDraw(g, strokes, prog, seed) {
  const S2 = strokes.map(x => Array.isArray(x) ? { p: x } : x), Ls = S2.map(x => largo(x.p)), total = Ls.reduce((a, b) => a + b, 0) || 1; let hecho = prog * total;
  g.lineCap = 'round'; g.lineJoin = 'round';
  S2.forEach((st, k) => { const L = Ls[k]; if (hecho <= 0) return; const f = Math.min(1, hecho / (L || 1)); hecho -= L; const col = TZ_COL[st.c || 'b'], w = st.w || 2;
    let acc = 0, lim = f * L; const pts = [st.p[0]]; for (let i = 1; i < st.p.length; i++) { const a = st.p[i - 1], b = st.p[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (acc + l <= lim) { pts.push(b); acc += l; } else { const t = (lim - acc) / (l || 1); pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); break; } }
    // relleno cuando el contorno está completo: rayas o polvo
    if (f >= 1 && (st.h != null || st.sm)) { g.save(); g.beginPath(); st.p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip();
      const xs = st.p.map(q => q[0]), ys = st.p.map(q => q[1]), x0 = Math.min(...xs) - 20, x1 = Math.max(...xs) + 20, y0 = Math.min(...ys) - 20, y1 = Math.max(...ys) + 20;
      if (st.sm) { g.fillStyle = `rgba(${col},.16)`; g.fillRect(x0, y0, x1 - x0, y1 - y0); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(${col},.18)`; g.fillRect(x0 + hash(i, k, seed) * (x1 - x0), y0 + hash(k, i, seed) * (y1 - y0), 2, 1); } }
      if (st.h != null) { const a = st.h, step = st.dense ? 3.2 : 5.5, dx = Math.cos(a), dy = Math.sin(a), R0 = Math.hypot(x1 - x0, y1 - y0), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; g.strokeStyle = `rgba(${col},.42)`; g.lineWidth = 1;
        for (let o = -R0; o < R0; o += step) { const j = (hash(o | 0, k, seed) - .5) * 1.5; g.beginPath(); g.moveTo(cx + dx * -R0 - dy * (o + j), cy + dy * -R0 + dx * (o + j)); g.lineTo(cx + dx * R0 - dy * (o - j), cy + dy * R0 + dx * (o - j)); g.stroke(); } }
      g.restore(); }
    for (let pass = 0; pass < 2; pass++) { g.strokeStyle = `rgba(${col},${pass ? .35 : .88})`; g.lineWidth = pass ? w * .45 : w * 1.2; g.beginPath();
      pts.forEach(([x, y], i) => { const j = (hash(i, pass + k * 3, seed) - .5) * (pass ? 1.6 : .9); i ? g.lineTo(x + j, y - j) : g.moveTo(x + j, y - j); }); if (st.close && f >= 1) g.closePath(); g.stroke(); }
    if (f < 1) { const [x, y] = pts[pts.length - 1]; g.fillStyle = `rgba(${col},.5)`; for (let i = 0; i < 3; i++) g.fillRect(Math.round(x + (hash(i, k, seed + 9) - .5) * 6), Math.round(y + (hash(k, i, seed + 9) - .5) * 6), 1, 1); } });
}
// pasa escenas [{d, t}] con su texto; fin() al terminar. opts.cierre: html que se muestra al final en vez de seguir
function pizarra(escenas, fin, opts = {}) {
  keyHandler = null; const ov = document.createElement('div'); ov.className = 'tiza'; ov.innerHTML = `<canvas width="640" height="360" aria-hidden="true"></canvas><p aria-live="polite"></p>${opts.saltar === false ? '' : '<button type="button" class="skip">Saltar</button>'}${opts.cierre ? `<div class="fin" hidden>${opts.cierre}</div>` : ''}`;
  app.appendChild(ov); const c = ov.querySelector('canvas'), g = c.getContext('2d'), p = ov.querySelector('p'); let i = 0, t0 = performance.now(), live = true; const DUR = 3000;
  const end = () => { if (!live) return; live = false; if (opts.cierre) { p.remove(); const f = ov.querySelector('.fin'); f.hidden = false; f.querySelector('button') && f.querySelector('button').focus(); return; } ov.remove(); keyHandler = null; fin && fin(); };
  const next = () => { if (performance.now() - t0 < DUR) { t0 -= DUR; return; } i++; if (i >= escenas.length) return end(); t0 = performance.now(); p.classList.remove('on'); p.textContent = ''; };
  const frame = now => { if (!live || !ov.isConnected) return; const prog = Math.min(1, (now - t0) / DUR); g.drawImage(TZ_FONDO, 0, 0); chalkDraw(g, escenas[i].d(), prog, i + 1 + (opts.semilla || 0));
    if (prog >= 1 && !p.classList.contains('on')) { p.textContent = escenas[i].t; p.classList.add('on'); }
    if (prog >= 1 && now - t0 > DUR + 4600 && !opts.manual) next(); requestAnimationFrame(frame); };
  ov.onclick = e => { if (e.target.classList.contains('skip')) { i = escenas.length; end(); } else if (live) next(); };
  keyHandler = e => { if (!live) return; if (e.key === 'Escape' && opts.saltar !== false) { i = escenas.length; end(); } else if (['Enter', ' ', 'e', 'E'].includes(e.key)) next(); };
  requestAnimationFrame(frame); return ov;
}
// la introducción después del prólogo
function intro(done) { show(''); attract.on = false; pizarra([
  { d: ESC.kale, t: 'Kalé. Una isla pequeña del East Blue que no sale en ningún mapa.' },
  { d: ESC.casa, t: 'Vives con tu madre, Marla, en la casa del tejado de paja.' },
  { d: ESC.corso, t: 'Y con Corso, tu hermano pequeño, que te sigue a todas partes.' },
  { d: ESC.padre, t: 'De tu padre solo sabes una cosa: un invierno se fue. Y tu madre no habla de él.' },
  { d: ESC.negro, t: 'Tienes diecisiete años. Y anoche entró en el puerto un barco con bandera negra.' }], done); }
