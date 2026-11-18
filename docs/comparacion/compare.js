// Dibuja la misma casa (exterior e interior con cuartos) en dos estilos: piezas LPC y dibujo por código.
// Corre dentro de la página del juego para reutilizar el motor (PB, C, house, room...) y los personajes LPC.
const { chromium } = require('playwright'); const fs = require('fs');
const D = __dirname, b64 = f => 'data:image/png;base64,' + fs.readFileSync(D + '/lpct/' + f).toString('base64');
const ATL = { int: b64('Interior.png'), ter: b64('Terrain and Outside.png'), obj: b64('Outside Objects.png'), ext: b64('Exterior Tiles.png'),
  cot: b64('Bluecarrot16_cottage.png'), roof: b64('Bluecarrot16_thatched-roof.png'), sh: b64('Sharm_house.png') };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); await p.route('https://fonts.**', r => r.fulfill({ body: '' }));
  await p.setContent('<body>' + fs.readFileSync('/home/user/one-peak/docs/juego/index.html', 'utf8') + '</body>'); await p.waitForTimeout(1000);
  const out = await p.evaluate(async ATL => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const A = {}; for (const k in ATL) A[k] = await load(ATL[k]);
    const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; };
    const blit = (g, im, [sx, sy, sw, sh], dx, dy) => g.drawImage(im, sx, sy, sw, sh, dx, dy, sw, sh);
    const fill = (g, im, [sx, sy, sw, sh], x, y, w, h) => { for (let j = 0; j < h; j += sh) for (let i = 0; i < w; i += sw) g.drawImage(im, sx, sy, Math.min(sw, w - i), Math.min(sh, h - j), x + i, y + j, Math.min(sw, w - i), Math.min(sh, h - j)); };
    const nine = (g, im, [sx, sy, sw, sh], k, x, y, w, h) => {
      fill(g, im, [sx + k, sy + k, sw - 2 * k, sh - 2 * k], x + k, y + k, w - 2 * k, h - 2 * k);
      fill(g, im, [sx + k, sy, sw - 2 * k, k], x + k, y, w - 2 * k, k); fill(g, im, [sx + k, sy + sh - k, sw - 2 * k, k], x + k, y + h - k, w - 2 * k, k);
      fill(g, im, [sx, sy + k, k, sh - 2 * k], x, y + k, k, h - 2 * k); fill(g, im, [sx + sw - k, sy + k, k, sh - 2 * k], x + w - k, y + k, k, h - 2 * k);
      blit(g, im, [sx, sy, k, k], x, y); blit(g, im, [sx + sw - k, sy, k, k], x + w - k, y); blit(g, im, [sx, sy + sh - k, k, k], x, y + h - k); blit(g, im, [sx + sw - k, sy + sh - k, k, k], x + w - k, y + h - k); };
    const chars = (g, list) => list.sort((a, b) => a[2] - b[2]).forEach(([id, x, y, d]) => { g.fillStyle = 'rgba(20,10,5,.28)'; g.beginPath(); g.ellipse(x, y, 11, 4, 0, 0, 7); g.fill(); drawLPC(g, id, x, y, d, 0); });
    const pbc = pb => pbToCanvas(pb);
    // ---------- EXTERIOR ----------
    const EW = 512, EH = 320, BASE = 208;
    const front = [['grumete', 300, 292, 'down'], ['madre', 224, 236, 'down']], behind = [['hermano', 356, 150, 'left']];
    // LPC
    const [e1, g1] = cv(EW, EH);
    for (let y = 0; y < EH; y += 32) for (let x = 0; x < EW; x += 32) blit(g1, A.ter, [32 * ((x / 32 + y / 32) % 3), 352, 32, 32], x, y);
    for (const [x, y] of [[32, 224], [64, 240], [464, 232], [16, 120]]) blit(g1, A.ter, [128, 352, 32, 32], x, y);
    nine(g1, A.ter, [0, 64, 96, 96], 24, -24, 248, EW + 48, 80); nine(g1, A.ter, [0, 64, 96, 96], 24, 196, 196, 56, 84);
    blit(g1, A.obj, [512, 448, 40, 64], 40, 150); blit(g1, A.ext, [832, 448, 64, 64], 424, 182);
    blit(g1, A.obj, [32, 448, 96, 64], 408, 92); blit(g1, A.obj, [192, 0, 96, 96], 404, 30);
    chars(g1, behind.map(c => [...c]));
    const [h1, hg1] = cv(EW, EH);
    nine(hg1, A.cot, [0, 128, 96, 96], 32, 96, 112, 256, 96);
    fill(hg1, A.roof, [140, 0, 8, 112], 156, 10, 136, 112); blit(hg1, A.roof, [64, 0, 76, 112], 80, 10); blit(hg1, A.roof, [148, 0, 76, 112], 292, 10);
    blit(hg1, A.sh, [96, 0, 32, 64], 208, 144); blit(hg1, A.sh, [224, 0, 32, 32], 136, 146); blit(hg1, A.sh, [224, 0, 32, 32], 280, 146);
    blit(hg1, A.sh, [192, 0, 32, 64], 296, -16); g1.drawImage(h1, 0, 0);
    blit(g1, A.obj, [960, 30, 32, 34], 360, 178);
    chars(g1, front.map(c => [...c]));
    // código
    const pe = new PB(EW, EH);
    for (let y = 0; y < EH; y++) for (let x = 0; x < EW; x++) pe.set(x, y, hash(x >> 1, y >> 1, 4) < .04 ? C.g2 : C.g3);
    for (let i = 0; i < 70; i++) tuft(pe, Math.floor(hash(i, 1, 70) * EW), Math.floor(hash(i, 2, 70) * EH));
    const dirt = (x0, y0, w, h) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) { const e = Math.min(x - x0, x0 + w - 1 - x, y - y0, y0 + h - 1 - y); if (e < 3 && hash(x, y, 8) < .5) continue; const k = hash(x >> 1, y >> 1, 7); pe.set(x, y, k < .08 ? C.d2 : k < .11 ? C.d4 : C.d3) } };
    dirt(0, 252, EW, 68); dirt(200, 200, 48, 60);
    for (const [x, y] of [[40, 232], [74, 246], [472, 238], [24, 128]]) for (let i = 0; i < 5; i++) { const fx = x + i * 5, fy = y + (i % 2) * 4; for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) pe.set(fx + dx, fy + dy, [C.p4, C.r3, C.pink][i % 3]); pe.set(fx, fy, C.b4) }
    for (let i = 0; i < 6; i++) { pe.rect(44, 160 + i * 9, 30, 8, C.k3); pe.rect(44, 160 + i * 9, 30, 2, C.k4); pe.ell(44, 164 + i * 9, 4, 4, C.k5); pe.ell(44, 164 + i * 9, 2, 2, C.k3) }
    pe.ell(456, 236, 28, 14, C.n1); pe.ell(456, 232, 28, 14, C.n3); pe.ell(456, 232, 20, 9, C.w1); for (let a = 0; a < 6.28; a += .5) pe.rect(456 + Math.cos(a) * 24, 230 + Math.sin(a) * 11, 6, 4, C.n4);
    pe.rect(430, 180, 4, 52, C.k2); pe.rect(478, 180, 4, 52, C.k2); pe.rect(426, 178, 60, 5, C.k3);
    const tr = (x, y, r) => { pe.ell(x + 6, y + r * .9, r * .9, r * .35, C.g2); pe.rect(x - 5, y, 10, r, C.k2); pe.rect(x - 5, y, 4, r, C.k3); pe.ell(x, y - r * .3, r, r * .85, C.g1); pe.ell(x - r * .2, y - r * .45, r * .8, r * .65, C.g2); pe.ell(x - r * .35, y - r * .6, r * .5, r * .4, C.g3); pe.ell(x - r * .45, y - r * .7, r * .22, r * .18, C.g4) };
    tr(456, 110, 44);
    const [e2, g2] = cv(EW, EH); g2.drawImage(pbc(pe), 0, 0); chars(g2, behind.map(c => [...c]));
    const ph = new PB(EW, EH);
    house(ph, { x: 96, y: 0, w: 256, rh: 108, wh: 100, roof: [C.b1, C.b2, C.b3, C.b4], wins: [[36, 34], [196, 34]], beams: [120, 132] });
    ph.rect(200, 136, 48, 76, C.k1); ph.rect(204, 140, 40, 68, C.k3); for (let x = 206; x < 244; x += 7) ph.rect(x, 140, 1, 68, C.k2); ph.rect(204, 156, 40, 3, C.n1); ph.rect(204, 188, 40, 3, C.n1); ph.rect(236, 172, 4, 4, C.b3);
    ph.rect(196, 208, 56, 6, C.n3); ph.rect(196, 213, 56, 1, C.n2); ph.rect(300, -2, 22, 40, C.n3); ph.rect(311, -2, 11, 40, C.n2); ph.rect(296, -4, 30, 5, C.n4);
    g2.drawImage(pbc(ph), 0, 0); const pb2 = new PB(24, 26); barrel(pb2, 2, 2); g2.drawImage(pbc(pb2), 358, 176); chars(g2, front.map(c => [...c]));
    // ---------- INTERIOR ----------
    const IW = 512, IH = 352;
    const ichars = [['madre', 240, 120, 'down'], ['hermano', 420, 334, 'up'], ['grumete', 144, 316, 'up']];
    // LPC
    const [i1, q1] = cv(IW, IH);
    fill(q1, A.int, [64, 928, 32, 32], 0, 64, IW, IH - 64);
    fill(q1, A.int, [0, 224, 32, 32], 0, 0, IW, 32); fill(q1, A.int, [288, 864, 32, 32], 0, 32, IW, 32);
    const wallTop = (g, x, y, w, h) => { g.fillStyle = '#2a1a12'; g.fillRect(x, y, w, h); g.fillStyle = '#5a3a26'; g.fillRect(x + 1, y + 1, w - 2, 2) };
    const partitions = (g, face) => { wallTop(g, 320, 56, 16, 40); wallTop(g, 320, 160, 16, 88); wallTop(g, 320, 312, 16, 30); wallTop(g, 336, 184, 176, 10); face(336, 194, 176, 30);
      wallTop(g, 0, 0, IW, 4); wallTop(g, 0, 0, 8, IH); wallTop(g, IW - 8, 0, 8, IH); wallTop(g, 0, IH - 12, 128, 12); wallTop(g, 160, IH - 12, IW - 160, 12) };
    partitions(q1, (x, y, w, h) => fill(q1, A.int, [288, 864 + 2, 32, 30], x, y, w, h));
    blit(q1, A.int, [364, 298, 72, 70], 20, 4); blit(q1, A.sh, [224, 0, 32, 32], 116, 14); blit(q1, A.int, [832, 96, 128, 64], 168, 26); blit(q1, A.int, [864, 256, 32, 27], 186, 2);
    nine(q1, A.int, [320, 928, 96, 96], 16, 96, 270, 96, 56);
    blit(q1, A.int, [547, 373, 26, 27], 147, 130); blit(q1, A.int, [456, 192, 48, 80], 136, 150); blit(q1, A.int, [454, 304, 22, 32], 112, 172); blit(q1, A.int, [484, 304, 22, 32], 186, 172); blit(q1, A.int, [515, 364, 26, 36], 147, 226);
    blit(q1, A.int, [611, 267, 60, 44], 14, 286); blit(q1, A.int, [546, 416, 28, 64], 282, 70); blit(q1, A.int, [896, 359, 32, 57], 282, 270);
    blit(q1, A.int, [840, 14, 48, 82], 360, 66); blit(q1, A.int, [514, 112, 60, 64], 436, 40); blit(q1, A.int, [962, 226, 28, 18], 376, 156); blit(q1, A.int, [964, 288, 24, 31], 414, 72);
    blit(q1, A.int, [616, 15, 48, 81], 352, 228); blit(q1, A.int, [616, 15, 48, 81], 444, 228); blit(q1, A.int, [768, 416, 32, 30], 408, 270);
    chars(q1, ichars.map(c => [...c]));
    // código
    const R = room(IW, IH, 64, 144, { floor: [C.k2, C.k4, C.k4, C.k5], wall: [C.cream2, C.cream] }); const pr = R.p;
    fireplace(R, 24, 64, true); windowW(R, 120, 16, 30, 26, [C.t2, C.t3]); counter(R, 168, 40, 128); for (let i = 0; i < 3; i++) { pr.rect(200 + i * 12, 6, 2, 10, C.n1); pr.ell(201 + i * 12, 20, 5, 4, C.n2) }
    rug(R, 96, 274, 96, 52, [C.t2, C.p3, C.t3]);
    stool(R, 160, 140); table(R, 136, 150, 48, 74); stool(R, 122, 186); stool(R, 198, 186); stool(R, 160, 240);
    barrel(pr, 14, 290); barrel(pr, 34, 300); barrel(pr, 24, 282); for (const y of [74, 104]) { pr.ell(296, y + 12, 12, 14, C.r2); pr.ell(296, y + 10, 11, 12, C.r3); pr.ell(296, y - 1, 6, 2, C.k1) } plant(R, 296, 318);
    const fr = (x, y, w, h) => { pr.rect(x, y, w, h, C.k3); for (let i = x; i < x + w; i += 8) pr.rect(i, y, 1, h, C.k2); pr.rect(x, y + h - 2, w, 2, OUT) };
    for (const [x, y, w, h] of [[320, 56, 16, 40], [320, 160, 16, 88], [320, 312, 16, 30], [336, 184, 176, 10], [0, 0, 512, 4]]) { pr.rect(x, y, w, h, OUT); pr.rect(x + 1, y + 1, w - 2, 2, C.k2) } fr(336, 194, 176, 30);
    bed(R, 360, 78, 48, 74, [C.r1, C.r2, C.r3]); cupboard(R, 436, 60, 60, 40); rug(R, 376, 158, 32, 20, [C.r2, C.b2, C.r3]);
    bed(R, 352, 240, 44, 70, [C.t1, C.t2, C.t3]); bed(R, 444, 240, 44, 70, [C.g1, C.g2, C.g3]); box3(R, 408, 282, 28, 12, 10, C.k4, C.k2, C.k5);
    const [i2, q2] = cv(IW, IH); q2.drawImage(pbc(pr), 0, 0); chars(q2, ichars.map(c => [...c]));
    return { 'cmp-ext-lpc': e1.toDataURL(), 'cmp-ext-code': e2.toDataURL(), 'cmp-int-lpc': i1.toDataURL(), 'cmp-int-code': i2.toDataURL() };
  }, ATL);
  for (const k in out) fs.writeFileSync(`${D}/${k}.png`, Buffer.from(out[k].split(',')[1], 'base64'));
  console.log(errs.join('\n') || 'ok'); await b.close();
})();
