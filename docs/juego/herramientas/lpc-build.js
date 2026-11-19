// 1) Resuelve qué archivos de caminar hacen falta, 2) los baja con sparse-checkout, 3) los compone en el navegador.
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const dir = __dirname, repo = dir + '/lpc';
const files = new Set(fs.readFileSync(dir + '/lpc-files.txt', 'utf8').split('\n'));
const chars = require('./lpc-chars.js');
const bodyAlt = { male: ['male', 'adult', ''], female: ['female', 'thin', 'adult', ''], muscular: ['muscular', 'male', 'adult', ''], teen: ['teen', 'male', 'adult', ''], child: ['child', 'adult', ''] };
function resolve(base, body, spec) {
  const [kind, val] = spec.split(':');
  for (const v of bodyAlt[body]) {
    const root = 'spritesheets/' + base + (v ? '/' + v : '');
    if (kind === 'file' && files.has(`${root}/walk/${val}.png`)) return { path: `${root}/walk/${val}.png` };
    if (kind !== 'file' && files.has(`${root}/walk.png`)) return { path: `${root}/walk.png`, mat: kind, pal: val };
  }
  return null;
}
const plan = chars.map(c => ({ ...c,
  bodyLayer: resolve('body/bodies/' + c.body, c.body, 'body:' + c.skin) || resolve('body/bodies/' + c.body, 'male', 'body:' + c.skin),
  res: c.layers.map(([b, s]) => ({ base: b, r: resolve(b, c.body, s) })) }));
const need = new Set();
plan.forEach(c => { if (c.bodyLayer) need.add(c.bodyLayer.path); c.res.forEach(l => l.r && need.add(l.r.path)); });
plan.forEach(c => console.log(c.id, 'faltan:', c.res.filter(l => !l.r).map(l => l.base).join(', ') || 'nada'));
execFileSync('git', ['-C', repo, 'sparse-checkout', 'set', '--no-cone', 'palette_definitions/*', 'CREDITS.csv', 'LICENSE', ...[...need].map(p => '/' + p)], { stdio: 'inherit' });
const pal = {};
for (const m of ['body', 'hair', 'cloth', 'eye', 'metal']) { const f = `${repo}/palette_definitions/${m}/${m}_ulpc.json`; if (fs.existsSync(f)) pal[m] = JSON.parse(fs.readFileSync(f, 'utf8')); }
const img = p => 'data:image/png;base64,' + fs.readFileSync(repo + '/' + p).toString('base64');
const data = plan.map(c => ({ id: c.id, name: c.name, layers: [c.bodyLayer, ...c.res.map(l => l.r)].filter(Boolean).map(l => ({ src: img(l.path), mat: l.mat, pal: l.pal })) }));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const out = await p.evaluate(async ({ data, pal }) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const hex = h => parseInt(h.slice(1), 16);
    const result = {};
    for (const c of data) {
      const cv = document.createElement('canvas'); cv.width = 576; cv.height = 256; const g = cv.getContext('2d');
      for (const l of c.layers) {
        const im = await load(l.src), t = document.createElement('canvas'); t.width = 576; t.height = 256; const tg = t.getContext('2d'); tg.drawImage(im, 0, 0);
        if (l.mat && pal[l.mat] && pal[l.mat][l.pal]) {
          // mapea cada color de cualquier paleta del material al mismo índice de la paleta destino
          const map = new Map(); for (const k in pal[l.mat]) pal[l.mat][k].forEach((h, i) => { if (!map.has(hex(h))) map.set(hex(h), i); });
          const target = pal[l.mat][l.pal].map(hex), id = tg.getImageData(0, 0, 576, 256), d = id.data;
          for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const c0 = (d[i] << 16) | (d[i + 1] << 8) | d[i + 2], idx = map.get(c0); if (idx != null && target[idx] != null) { const v = target[idx]; d[i] = v >> 16 & 255; d[i + 1] = v >> 8 & 255; d[i + 2] = v & 255; } }
          tg.putImageData(id, 0, 0);
        }
        g.drawImage(t, 0, 0);
      }
      result[c.id] = cv.toDataURL();
    }
    return result;
  }, { data, pal });
  fs.writeFileSync(dir + '/lpc-out.json', JSON.stringify(data.map(c => ({ id: c.id, name: c.name, png: out[c.id] }))));
  console.log('ok', Object.keys(out).length);
  await b.close();
})();
