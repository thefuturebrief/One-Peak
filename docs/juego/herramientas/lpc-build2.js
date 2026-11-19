// Arma la hoja completa de cada personaje: caminar, tajo, estocada, disparo y caída, en una sola imagen (ver ANIMS).
// Capa con "<" delante del nombre: va detrás del cuerpo (fondo de capas, armas a la espalda).
const fs = require('fs'); const { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const dir = __dirname, repo = dir + '/lpc', OUT = process.env.OUT || '/home/user/one-peak/docs/juego/assets/personajes';
const files = new Set(fs.readFileSync(dir + '/lpc-files.txt', 'utf8').split('\n'));
const ANIMS = [['walk', 0, 9, 4], ['slash', 4, 6, 4], ['thrust', 8, 8, 4], ['shoot', 12, 13, 4], ['hurt', 16, 6, 1]]; // nombre, fila, cuadros, filas
const W = 832, H = 17 * 64;
const chars = require(process.env.CHARS || './lpc-chars.js').filter(c => !process.env.ONLY || process.env.ONLY.split(',').includes(c.id));
const bodyAlt = { male: ['male', 'adult', ''], female: ['female', 'thin', 'adult', ''], muscular: ['muscular', 'male', 'adult', ''], teen: ['teen', 'male', 'adult', ''], child: ['child', 'adult', ''] };
function resolve(base, body, spec, anim) {
  const [kind, val] = spec.split(':');
  for (const v of bodyAlt[body]) { const root = 'spritesheets/' + base + (v ? '/' + v : '');
    if (kind === 'file' && files.has(`${root}/${anim}/${val}.png`)) return { path: `${root}/${anim}/${val}.png` };
    if (kind !== 'file' && files.has(`${root}/${anim}.png`)) return { path: `${root}/${anim}.png`, mat: kind, pal: val }; }
  return null;
}
const need = new Set(), warn = [];
const plan = chars.map(c => { const layers = [[(c.bodyBase || 'body/bodies/' + c.body), 'body:' + c.skin], ...c.layers.filter(l => !l[0].startsWith('code:'))];
  const L = layers.map(([b0, s]) => { const behind = b0.startsWith('<'), b = b0.replace('<', '');
    const per = {}; for (const [a] of ANIMS) { const r = resolve(b, c.body, s, a) || (b.startsWith('body/') ? resolve(b, 'male', s, a) : null); if (r) { per[a] = r; need.add(r.path); } else warn.push(`${c.id}: ${b} sin ${a}`); }
    return { behind, per }; });
  return { id: c.id, code: c.layers.filter(l => l[0].startsWith('code:')).map(l => l[0].slice(5)), headIdx: layers.findIndex(l => l[0].startsWith('head/heads')), layers: [...L.filter(l => l.behind), ...L.filter(l => !l.behind)] }; });
console.log(warn.join('\n') || 'todas las capas tienen todas las animaciones');
execFileSync('git', ['-C', repo, 'sparse-checkout', 'add', '--no-cone', 'palette_definitions/*', ...[...need].map(p => '/' + p)], { stdio: 'inherit' });
const pal = {}; for (const m of ['body', 'hair', 'cloth', 'eye', 'metal']) { const f = `${repo}/palette_definitions/${m}/${m}_ulpc.json`; if (fs.existsSync(f)) pal[m] = JSON.parse(fs.readFileSync(f, 'utf8')); }
const img = p => 'data:image/png;base64,' + fs.readFileSync(repo + '/' + p).toString('base64');
const data = plan.map(c => ({ id: c.id, code: c.code, head: c.headIdx - 1 + c.layers.filter(l => l.behind).length + 1, layers: c.layers.map(l => Object.fromEntries(Object.entries(l.per).map(([a, r]) => [a, { src: img(r.path), mat: r.mat, pal: r.pal }]))) }));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const out = await p.evaluate(async ({ data, pal, ANIMS, W, H }) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; }), hex = h => parseInt(h.slice(1), 16), res = {};
    for (const c of data) { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
      for (const l of c.layers) for (const [a, row, n, rows] of ANIMS) { const s = l[a]; if (!s) continue;
        const im = await load(s.src), t = document.createElement('canvas'); t.width = n * 64; t.height = rows * 64; const tg = t.getContext('2d'); tg.drawImage(im, 0, 0);
        if (s.mat && pal[s.mat] && pal[s.mat][s.pal]) { const map = new Map(); for (const k in pal[s.mat]) pal[s.mat][k].forEach((h, i) => { if (!map.has(hex(h))) map.set(hex(h), i); });
          const tgt = pal[s.mat][s.pal].map(hex), id = tg.getImageData(0, 0, t.width, t.height), d = id.data;
          for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const idx = map.get((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]); if (idx != null && tgt[idx] != null) { const v = tgt[idx]; d[i] = v >> 16 & 255; d[i + 1] = v >> 8 & 255; d[i + 2] = v & 255; } }
          tg.putImageData(id, 0, 0); }
        g.drawImage(t, 0, row * 64); if (c.layers.indexOf(l) === c.head) { if (!c.hc) { c.hc = document.createElement('canvas'); c.hc.width = W; c.hc.height = H; } c.hc.getContext('2d').drawImage(t, 0, row * 64); } }
      if (c.code.length && c.hc) { const hd = c.hc.getContext('2d').getImageData(0, 0, W, H).data;
        for (const [a, row, n, rows] of ANIMS) for (let r = 0; r < rows; r++) for (let f = 0; f < n; f++) { const X0 = f * 64, Y0 = (row + r) * 64; let x0 = 99, x1 = -1, y0 = 99, y1 = -1;
          for (let y = 0; y < 64; y++) for (let x = 0; x < 64; x++) if (hd[((Y0 + y) * W + X0 + x) * 4 + 3] > 0) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
          if (x1 < 0) continue; const dir = a === 'hurt' ? 'down' : ['up', 'left', 'down', 'right'][r], px = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(X0 + x, Y0 + y, w, h); };
          const cx = Math.round((x0 + x1) / 2), hw = x1 - x0 + 1;
          for (const k of c.code) {
            const [kk, var1] = k.split(':'), banda = var1 === 'oro' ? '#d8a830' : '#2f4f9a';
            if (kk === 'marinecap') { const top = y0 - 1, L = x0 - 1, Wc = hw + 2; // copa blanca, banda (azul o dorada) y visera hacia donde mira
              px(L + 1, top - 1, Wc - 2, 1, '#2a2a3a'); px(L, top, Wc, 5, '#2a2a3a'); px(L + 1, top, Wc - 2, 4, '#f4f6fa'); px(L + 1, top, Wc - 2, 1, '#ffffff'); px(L + Wc - 4, top + 1, 2, 3, '#c8ccd8');
              px(L, top + 4, Wc, 3, '#2a2a3a'); px(L + 1, top + 4, Wc - 2, 2, banda); if (dir !== 'up') px(cx - 2, top + 4, 4, 1, '#e8eef8');
              if (dir === 'down') px(L + 2, top + 7, Wc - 4, 1, '#3a3a4a'); if (dir === 'left') px(L - 3, top + 6, 5, 2, '#2a2a3a'); if (dir === 'right') px(L + Wc - 2, top + 6, 5, 2, '#2a2a3a'); }
            if (kk === 'collar') { const ny = y1 + 1; // cuello marinero azul con raya blanca
              if (dir === 'up') { px(cx - 7, ny - 1, 14, 8, '#1e2a52'); px(cx - 6, ny - 1, 12, 7, '#2f4f9a'); px(cx - 6, ny + 4, 12, 1, '#f4f6fa'); }
              else if (dir === 'down') { px(cx - 6, ny - 1, 12, 2, '#2f4f9a'); px(cx - 3, ny + 1, 2, 2, '#2f4f9a'); px(cx + 1, ny + 1, 2, 2, '#2f4f9a'); px(cx - 1, ny + 2, 2, 3, '#c83a3a'); px(cx - 6, ny, 12, 1, '#f4f6fa'); }
              else { const s = dir === 'left' ? 1 : -1; px(cx - 4 + s * 2, ny - 1, 8, 2, '#2f4f9a'); px(cx + s * 4 - 2, ny, 5, 5, '#2f4f9a'); px(cx + s * 4 - 2, ny + 3, 5, 1, '#f4f6fa'); } } } } }
      res[c.id] = cv.toDataURL(); }
    return res; }, { data, pal, ANIMS, W, H });
  fs.mkdirSync(OUT, { recursive: true });
  for (const [id, png] of Object.entries(out)) fs.writeFileSync(`${OUT}/${id}.png`, Buffer.from(png.split(',')[1], 'base64'));
  console.log('ok', Object.keys(out).length, '→', OUT); await b.close();
})();
