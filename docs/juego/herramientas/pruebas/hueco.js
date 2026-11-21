// Busca, cerca de cada punto de la planta, el sitio libre más cercano donde el NPC no quede tapado ni pise un mueble.
// Uso: node hueco.js shells "celes:posada:8.4,1.2" ...
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage(); await p.route('https://fonts.**', r => r.fulfill({ body: '' }));
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForFunction(() => typeof WORLD !== 'undefined' && WORLD.ready, null, { timeout: 20000 });
  await p.click('.mi[data-a="new"]'); await p.fill('#nm', 'Ilo'); await p.click('#go');
  for (let i = 0; i < 12 && await p.$('.opt, .event'); i++) { if (await p.$('.event')) await p.click('#go'); else await p.click('.opt'); await p.waitForTimeout(60); }
  await p.click('.tiza .skip'); await p.waitForTimeout(600);
  const out = await p.evaluate(async ([isla, qs]) => { if (isla !== 'kale') { F.zarpado = true; await irAIsla(isla); }
    const res = [];
    for (const q of qs) { const [id, bid, xy] = q.split(':'), [x0, y0] = xy.split(',').map(Number), n = P(id) || { sprite: id, dir: 'down' };
      const tapaT = (px, py) => { const x = px * T, y = py * T, m = { ...n, x, y, dir: 'down', goal: null, pose: null, route: null }; if (!walkableTown(x, y - 2) || !walkableTown(x - 10, y - 2) || !walkableTown(x + 10, y - 2)) return 999;
        const cam = [x - 48, y - 80], c = document.createElement('canvas'); c.width = c.height = 96; const ga = c.getContext('2d'); drawActor(ga, actor(m, m.sprite, 0, 0), ...cam, 0);
        const c2 = document.createElement('canvas'); c2.width = c2.height = 96; const gb = c2.getContext('2d');
        for (const sp of WORLD.sprites) { if (sp.visible && !sp.visible()) continue; if (!(sp.key > y)) continue; const [cx, cy] = cam;
          if (sp.canvas) gb.drawImage(sp.canvas, Math.round(sp.x - cx), Math.round(sp.y - cy)); else if (sp.img) put(gb, sp.img, sp.x - cx, sp.y - cy); else if (sp.tree) drawTree(gb, sp.x - cx, sp.y - cy); else if (sp.lamp) drawLamp(gb, sp.x - cx, sp.y - cy, false); }
        const da = ga.getImageData(0, 0, 96, 96).data, db = gb.getImageData(0, 0, 96, 96).data; let t = 0, k = 0; for (let i = 3; i < da.length; i += 4) if (da[i] > 100) { t++; if (db[i] > 100) k++; } return t ? 100 * k / t : 999; };
      const tapa = (px, py) => { if (bid === 'town') return tapaT(px, py); const [sid, [x, y]] = place(bid, [px, py]); const I = SC[sid]; const m = { ...n, x, y, dir: 'down', goal: null, pose: null };
        if (I.blocks.some(([a, c, w, h]) => x + 10 > a && x - 10 < a + w && y + 2 > c && y - 8 < c + h)) return 999; // los pies (y algo de margen) fuera de muebles
        if (x < I.area[0] + 14 || x > I.area[0] + I.area[2] - 14 || y > I.area[1] + I.area[3] - 4 || y < 44) return 999;
        const c = document.createElement('canvas'); c.width = I.w; c.height = I.h; const ga = c.getContext('2d'); drawActor(ga, actor(m, m.sprite, 0, 0), 0, 0, 0);
        const c2 = document.createElement('canvas'); c2.width = I.w; c2.height = I.h; const gb = c2.getContext('2d'); for (const it of I.items) if (it.key > y) { if (it.img) put(gb, it.img, it.x, it.y); else it.fn(gb); }
        const da = ga.getImageData(0, 0, I.w, I.h).data, db = gb.getImageData(0, 0, I.w, I.h).data; let t = 0, k = 0; for (let i = 3; i < da.length; i += 4) if (da[i] > 100) { t++; if (db[i] > 100) k++; } return t ? 100 * k / t : 999; };
      const orig = tapa(x0, y0); let best = null;
      for (let r = 0; r <= 3 && !best; r += .1) for (let a = 0; a < 24 && !best; a++) { const px = +(x0 + r * Math.cos(a * Math.PI / 12)).toFixed(1), py = +(y0 + r * Math.sin(a * Math.PI / 12)).toFixed(1);
        if (bid !== 'town' && bld(bid).sceneOfPt(px, py)?.id !== bld(bid).sceneOfPt(x0, y0)?.id) continue; if (tapa(px, py) <= 2) best = [px, py]; }
      res.push(`${q}: antes ${Math.round(orig)}% → ${best ? best.join(', ') : 'nada cerca'}`); }
    return res; }, [process.argv[2], process.argv.slice(3)]);
  console.log(out.join('\n')); await b.close(); })();
