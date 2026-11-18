// Versión A corregida: piezas LPC con recortes exactos, luz por código y cuartos separados.
const { chromium } = require('playwright'); const fs = require('fs');
const D = __dirname, b64 = f => 'data:image/png;base64,' + fs.readFileSync(D + '/lpct/' + f).toString('base64');
const ATL = { int: b64('Interior.png'), ter: b64('Terrain and Outside.png'), obj: b64('Outside Objects.png'), ext: b64('Exterior Tiles.png'),
  cot: b64('Bluecarrot16_cottage.png'), roof: b64('Bluecarrot16_thatched-roof.png'), sh: b64('Sharm_house.png'), door: b64('Bluecarrot16_doors.png') };
(async () => {
  const b = await chromium.launch(); const p = await b.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); await p.route('https://fonts.**', r => r.fulfill({ body: '' }));
  await p.setContent('<body>' + fs.readFileSync('/home/user/one-peak/docs/juego/index.html', 'utf8') + '</body>'); await p.waitForTimeout(1000);
  const out = await p.evaluate(async ATL => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const A = {}; for (const k in ATL) A[k] = await load(ATL[k]);
    const cv = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; return [c, g]; };
    const blit = (g, im, [sx, sy, sw, sh], dx, dy) => g.drawImage(im, sx, sy, sw, sh, Math.round(dx), Math.round(dy), sw, sh);
    const fill = (g, im, [sx, sy, sw, sh], x, y, w, h) => { for (let j = 0; j < h; j += sh) for (let i = 0; i < w; i += sw) { const cw = Math.min(sw, w - i), ch = Math.min(sh, h - j); g.drawImage(im, sx, sy, cw, ch, x + i, y + j, cw, ch); } };
    const nine = (g, im, [sx, sy, sw, sh], k, x, y, w, h) => {
      fill(g, im, [sx + k, sy + k, sw - 2 * k, sh - 2 * k], x + k, y + k, w - 2 * k, h - 2 * k);
      fill(g, im, [sx + k, sy, sw - 2 * k, k], x + k, y, w - 2 * k, k); fill(g, im, [sx + k, sy + sh - k, sw - 2 * k, k], x + k, y + h - k, w - 2 * k, k);
      fill(g, im, [sx, sy + k, k, sh - 2 * k], x, y + k, k, h - 2 * k); fill(g, im, [sx + sw - k, sy + k, k, sh - 2 * k], x + w - k, y + k, k, h - 2 * k);
      blit(g, im, [sx, sy, k, k], x, y); blit(g, im, [sx + sw - k, sy, k, k], x + w - k, y); blit(g, im, [sx, sy + sh - k, k, k], x, y + h - k); blit(g, im, [sx + sw - k, sy + sh - k, k, k], x + w - k, y + h - k); };
    const chars = (g, list) => list.slice().sort((a, b) => a[2] - b[2]).forEach(([id, x, y, d]) => { g.fillStyle = 'rgba(20,10,5,.28)'; g.beginPath(); g.ellipse(x, y, 11, 4, 0, 0, 7); g.fill(); drawLPC(g, id, x, y, d, 0); });
    // piezas (recortes exactos)
    const P = {
      grass: [A.ter, [0, 352, 32, 32]], flowers: [A.ter, [128, 352, 32, 32]], dirt: [A.ter, [0, 64, 96, 96]],
      wall: [A.cot, [0, 128, 96, 96]], doorBlue: [A.door, [144, 256, 32, 48]], doorGreen: [A.door, [208, 256, 32, 48]],
      win: [A.ext, [544, 192, 32, 32]], winTall: [A.ext, [576, 202, 32, 44]], flowerbox: [A.ext, [369, 101, 35, 22]], step: [A.ext, [192, 352, 32, 24]],
      chimney: [A.sh, [192, 0, 32, 64]], crown: [A.obj, [194, 0, 94, 80]], trunk: [A.obj, [17, 448, 64, 73]], barrel: [A.obj, [963, 24, 26, 36]],
      woodpile: [A.obj, [487, 453, 52, 55]], logs: [A.obj, [434, 448, 30, 32]], bucket: [A.obj, [579, 480, 29, 31]], sacks: [A.obj, [480, 513, 64, 63]],
      crate: [A.obj, [751, 368, 34, 33]], fish: [A.obj, [988, 648, 28, 16]], boat: [A.obj, [741, 898, 123, 63]],
      wellRing: [A.ext, [832, 465, 64, 47]], windlass: [A.ext, [852, 568, 101, 64]],
      wallUp: [A.int, [0, 224, 32, 32]], wainscot: [A.int, [288, 864, 32, 32]], planks: [A.int, [64, 928, 32, 32]], stone: [A.int, [0, 864, 96, 48]], rug: [A.int, [320, 928, 96, 96]],
      fireplace: [A.int, [364, 298, 72, 70]], flame: [A.int, [994, 675, 30, 29]], kitchen: [A.int, [832, 96, 128, 64]], pots: [A.int, [864, 256, 32, 27]],
      table: [A.int, [456, 192, 48, 80]], chairR: [A.int, [454, 304, 22, 32]], chairL: [A.int, [484, 304, 22, 32]], chairBack: [A.int, [547, 373, 26, 27]], chairFront: [A.int, [515, 364, 26, 36]],
      plate: [A.int, [997, 229, 22, 13]], jars: [A.int, [546, 416, 28, 64]], plant: [A.int, [896, 359, 32, 57]], bench: [A.int, [840, 438, 80, 42]],
      books: [A.int, [672, 192, 32, 64]], dishes: [A.int, [704, 192, 32, 64]], dresser: [A.int, [512, 190, 64, 50]], wardrobe: [A.int, [514, 112, 60, 64]],
      bedM: [A.int, [840, 14, 48, 82]], bedA: [A.int, [680, 505, 48, 71]], bedB: [A.int, [744, 505, 48, 71]], smallTable: [A.int, [768, 416, 32, 30]], lamp: [A.int, [964, 288, 24, 31]], rugSmall: [A.int, [962, 226, 28, 18]],
    };
    const put = (g, k, x, y) => blit(g, P[k][0], P[k][1], x, y);
    // luz por código: ambiente, rayo de ventana con degradado y resplandor del fuego
    const light = (g, W, H, { amb, shafts = [], glows = [] }) => {
      if (amb) { g.globalCompositeOperation = 'multiply'; g.fillStyle = amb; g.fillRect(0, 0, W, H); }
      g.globalCompositeOperation = 'screen';
      for (const [x, y, w, len, dx] of shafts) { const gr = g.createLinearGradient(0, y, 0, y + len); gr.addColorStop(0, 'rgba(255,236,190,.55)'); gr.addColorStop(1, 'rgba(255,236,190,0)'); g.fillStyle = gr;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + w, y); g.lineTo(x + w + dx, y + len); g.lineTo(x + dx, y + len); g.closePath(); g.fill(); }
      for (const [x, y, r, c] of glows) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
      g.globalCompositeOperation = 'source-over'; };
    const shell = (g, W, H, doorX) => { const dark = '#24160f', edge = '#4e3424';
      const wt = (x, y, w, h) => { g.fillStyle = dark; g.fillRect(x, y, w, h); g.fillStyle = edge; g.fillRect(x, y, w, 2); };
      wt(0, 0, W, 4); wt(0, 0, 8, H); wt(W - 8, 0, 8, H); wt(0, H - 10, doorX - 16, 10); wt(doorX + 16, H - 10, W - doorX - 16, 10);
      g.fillStyle = '#8a6a4a'; g.fillRect(doorX - 16, H - 10, 32, 10); };
    const walls = (g, W) => { fill(g, ...P.wallUp, 0, 0, W, 32); fill(g, ...P.wainscot, 0, 32, W, 32); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, 64, W, 4); };
    // ---------- EXTERIOR ----------
    const EW = 512, EH = 320;
    const [e, eg] = cv(EW, EH);
    for (let y = 0; y < EH; y += 32) for (let x = 0; x < EW; x += 32) put(eg, 'grass', x, y);
    for (const [x, y] of [[24, 228], [60, 236], [470, 120], [8, 112], [300, 232]]) put(eg, 'flowers', x, y);
    nine(eg, ...P.dirt, 24, -24, 252, EW + 48, 76); nine(eg, ...P.dirt, 24, 196, 206, 56, 70);
    put(eg, 'woodpile', 30, 150); put(eg, 'logs', 70, 176);
    put(eg, 'trunk', 404, 70); put(eg, 'crown', 389, 4);
    put(eg, 'windlass', 404, 160); put(eg, 'wellRing', 422, 190);
    eg.fillStyle = '#1d3f6e'; eg.beginPath(); eg.ellipse(454, 206, 21, 9, 0, 0, 7); eg.fill(); eg.fillStyle = 'rgba(160,210,240,.7)'; eg.fillRect(444, 202, 8, 2); eg.fillRect(458, 208, 5, 1);
    const behind = [['hermano', 356, 150, 'left']], front = [['grumete', 300, 292, 'down'], ['madre', 224, 236, 'down']];
    chars(eg, behind);
    // la casa va en su propia capa: lo que pasa por detrás queda tapado
    nine(eg, ...P.wall, 32, 96, 112, 256, 100);
    fill(eg, A.roof, [140, 0, 8, 112], 156, 10, 136, 112); blit(eg, A.roof, [64, 0, 76, 112], 80, 10); blit(eg, A.roof, [148, 0, 76, 112], 292, 10); put(eg, 'chimney', 296, -10);
    put(eg, 'win', 136, 146); put(eg, 'win', 280, 146); put(eg, 'flowerbox', 135, 176); put(eg, 'flowerbox', 279, 176);
    put(eg, 'doorBlue', 208, 164); put(eg, 'step', 208, 206);
    put(eg, 'barrel', 362, 178); put(eg, 'crate', 66, 210); put(eg, 'fish', 70, 204);
    chars(eg, front);
    light(eg, EW, EH, { glows: [[0, 0, 420, 'rgba(255,214,150,.18)']] });
    // ---------- SALA Y COCINA ----------
    const SW = 384, SH = 320;
    const [s, sg] = cv(SW, SH);
    fill(sg, ...P.planks, 0, 64, SW, SH - 64); fill(sg, ...P.stone, 248, 64, 96, 112);
    sg.fillStyle = 'rgba(0,0,0,.25)'; sg.fillRect(248, 64, 2, 112); sg.fillRect(248, 174, 96, 2); sg.fillRect(342, 64, 2, 112);
    walls(sg, SW);
    put(sg, 'fireplace', 16, 0); put(sg, 'flame', 37, 32); put(sg, 'logs', 92, 40);
    put(sg, 'winTall', 108, 12); put(sg, 'doorGreen', 152, 16); put(sg, 'doorBlue', 200, 16);
    put(sg, 'kitchen', 248, 24); put(sg, 'pots', 278, 0); put(sg, 'dishes', 344, 4);
    nine(sg, ...P.rug, 16, 16, 186, 112, 72); put(sg, 'bench', 28, 150);
    put(sg, 'chairBack', 179, 150); put(sg, 'table', 168, 170); put(sg, 'chairR', 144, 192); put(sg, 'chairL', 218, 192); put(sg, 'chairFront', 179, 244);
    put(sg, 'plate', 174, 186); put(sg, 'plate', 186, 220); put(sg, 'fish', 178, 200);
    put(sg, 'sacks', 312, 196); put(sg, 'barrel', 290, 206); put(sg, 'jars', 352, 236); put(sg, 'plant', 12, 252);
    chars(sg, [['madre', 300, 130, 'left'], ['grumete', 192, 304, 'up']]); shell(sg, SW, SH, 192);
    light(sg, SW, SH, { amb: 'rgb(196,182,176)', shafts: [[110, 56, 28, 150, 46]], glows: [[52, 50, 120, 'rgba(255,140,50,.45)'], [124, 34, 40, 'rgba(255,240,200,.35)']] });
    // ---------- CUARTO DE LOS CHICOS ----------
    const KW = 256, KH = 224;
    const [k, kg] = cv(KW, KH);
    fill(kg, ...P.planks, 0, 64, KW, KH - 64); walls(kg, KW);
    put(kg, 'books', 64, 6); put(kg, 'winTall', 112, 12); put(kg, 'dresser', 156, 18);
    nine(kg, ...P.rug, 16, 84, 140, 88, 52);
    put(kg, 'bedA', 14, 66); put(kg, 'bedA', 194, 76); put(kg, 'smallTable', 112, 80); put(kg, 'crate', 206, 170);
    // detalles por código: el mapa sobre tu cama y los dibujos de Corso
    kg.fillStyle = '#e8d6a8'; kg.fillRect(18, 14, 36, 24); kg.fillStyle = '#b89a66'; kg.fillRect(18, 37, 36, 1); kg.fillStyle = '#7a5a3a'; for (let i = 0; i < 4; i++) kg.fillRect(22 + i * 8, 20 + (i % 2) * 6, 6, 1); kg.fillStyle = '#c8402e'; kg.fillRect(44, 26, 3, 3);
    for (const [x, y, c] of [[200, 30, '#4a7ab8'], [226, 26, '#c8402e']]) { kg.fillStyle = '#f4ecd8'; kg.fillRect(x, y, 18, 14); kg.fillStyle = c; kg.fillRect(x + 3, y + 8, 12, 2); kg.fillRect(x + 8, y + 3, 2, 6); kg.fillRect(x + 4, y + 4, 4, 3); }
    kg.fillStyle = '#8a5a34'; kg.fillRect(176, 160, 3, 22); kg.fillRect(171, 164, 13, 3); kg.fillStyle = '#5a3a24'; kg.fillRect(176, 178, 3, 5);
    chars(kg, [['hermano', 150, 176, 'left']]); shell(kg, KW, KH, 128);
    light(kg, KW, KH, { amb: 'rgb(200,188,184)', shafts: [[114, 56, 28, 120, 40]], glows: [[128, 34, 40, 'rgba(255,240,200,.35)'], [128, 84, 36, 'rgba(255,200,120,.25)']] });
    // ---------- CUARTO DE MARLA ----------
    const [m, mg] = cv(KW, KH);
    fill(mg, ...P.planks, 0, 64, KW, KH - 64); walls(mg, KW);
    put(mg, 'winTall', 70, 12); put(mg, 'dresser', 118, 18); put(mg, 'lamp', 150, -2); put(mg, 'wardrobe', 186, 6);
    mg.fillStyle = '#5a3a24'; mg.fillRect(126, 14, 16, 5); mg.fillStyle = '#3a2418'; mg.fillRect(126, 18, 16, 1);
    nine(mg, ...P.rug, 16, 74, 120, 104, 64); put(mg, 'bedM', 18, 62); put(mg, 'rugSmall', 30, 150); put(mg, 'chairFront', 96, 70); put(mg, 'plant', 214, 166);
    mg.fillStyle = '#4a2c1c'; mg.fillRect(176, 172, 26, 16); mg.fillStyle = '#6a4228'; mg.fillRect(176, 172, 26, 5); mg.fillStyle = '#8a8a9a'; mg.fillRect(176, 176, 26, 1); mg.fillStyle = '#e6c25e'; mg.fillRect(187, 179, 4, 4);
    shell(mg, KW, KH, 128);
    light(mg, KW, KH, { amb: 'rgb(196,184,186)', shafts: [[72, 56, 28, 120, 40]], glows: [[86, 34, 40, 'rgba(255,240,200,.35)'], [162, 20, 40, 'rgba(255,200,120,.3)']] });
    return { ext: e.toDataURL(), sala: s.toDataURL(), chicos: k.toDataURL(), marla: m.toDataURL() };
  }, ATL);
  for (const k in out) fs.writeFileSync(`${D}/a2-${k}.png`, Buffer.from(out[k].split(',')[1], 'base64'));
  console.log(errs.join('\n') || 'ok'); await b.close();
})();
