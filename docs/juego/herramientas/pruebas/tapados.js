// Para cada NPC dentro de un edificio (a varias horas): % del sprite tapado por muebles que se dibujan encima, y si pisa un bloqueo.
const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 800 } }); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); await p.route('https://fonts.**', r => r.fulfill({ body: '' }));
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForFunction(() => typeof WORLD !== 'undefined' && WORLD.ready, null, { timeout: 20000 });
  await p.click('.mi[data-a="new"]'); await p.fill('#nm', 'Ilo'); await p.click('#go');
  for (let i = 0; i < 12 && await p.$('.opt, .event'); i++) { if (await p.$('.event')) await p.click('#go'); else await p.click('.opt'); await p.waitForTimeout(60); }
  await p.click('.tiza .skip'); await p.waitForTimeout(600);
  const isla = process.argv[2] || 'shells';
  const out = await p.evaluate(async (isla) => {
    if (isla !== 'kale') { F.zarpado = true; await irAIsla(isla); F.stD0 = Math.floor(G.minutes / 1440); F.stLlegada = F.stMedusaFuera = F.stControl = true; F.goaD0 = F.stD0; F.goaTerminal = true; }
    const res = new Map();
    for (const h of [6, 8, 10, 12, 14, 16, 18, 20, 21, 22, 23]) { G.minutes = Math.floor(G.minutes / 1440) * 1440 + h * 60; for (const n of PEOPLE) n.lugar = null; vecinosTick(true);
      for (const n of PEOPLE) { if (n.scene === 'town' && n.sprite && !n.route) { // en la calle: lienzo de 96x96 alrededor de sus pies
          const cam = [n.x - 48, n.y - 80], c = document.createElement('canvas'); c.width = c.height = 96; const ga = c.getContext('2d'); drawActor(ga, actor(n, n.sprite, 0, 0), ...cam, 0);
          const c2 = document.createElement('canvas'); c2.width = c2.height = 96; const gb = c2.getContext('2d');
          for (const sp of WORLD.sprites) { if (sp.visible && !sp.visible()) continue; if (!(sp.key > n.y)) continue; const [cx, cy] = cam;
            if (sp.canvas) gb.drawImage(sp.canvas, Math.round(sp.x - cx), Math.round(sp.y - cy)); else if (sp.img) put(gb, sp.img, sp.x - cx, sp.y - cy); else if (sp.tree) drawTree(gb, sp.x - cx, sp.y - cy); else if (sp.lamp) drawLamp(gb, sp.x - cx, sp.y - cy, false); }
          const da = ga.getImageData(0, 0, 96, 96).data, db = gb.getImageData(0, 0, 96, 96).data; let tot = 0, tap = 0; for (let i = 3; i < da.length; i += 4) if (da[i] > 100) { tot++; if (db[i] > 100) tap++; }
          const pie = !walkableTown(n.x, n.y - 2), k = n.id + '@town:' + (n.x / T).toFixed(1) + ',' + (n.y / T).toFixed(1), pct = tot ? Math.round(100 * tap / tot) : -1;
          if (pct > 8 || pie) res.set(k, `${k} tapado ${pct}%${pie ? ' PISA BLOQUEO' : ''} (h${h})`); continue; }
        if (n.scene === 'town' || n.scene === 'none' || !n.sprite) continue; const I = interior(n.scene); if (!I) continue;
        const mk = () => { const c = document.createElement('canvas'); c.width = I.w; c.height = I.h; return c; };
        const a = mk(), ga = a.getContext('2d'); drawActor(ga, actor(n, n.sprite, 0, 0), 0, 0, 0);
        const bb = mk(), gb = bb.getContext('2d'); for (const it of I.items) if (it.key > n.y) { if (it.img) put(gb, it.img, it.x, it.y); else it.fn(gb); }
        const da = ga.getImageData(0, 0, I.w, I.h).data, db = gb.getImageData(0, 0, I.w, I.h).data; let tot = 0, tap = 0;
        for (let i = 3; i < da.length; i += 4) if (da[i] > 100) { tot++; if (db[i] > 100) tap++; }
        const pie = I.blocks.some(([x, y, w, hh]) => n.x > x && n.x < x + w && n.y - 2 > y && n.y - 2 < y + hh);
        const k = n.id + '@' + n.scene + ':' + (n.x / T).toFixed(1) + ',' + (n.y / T).toFixed(1); const pct = tot ? Math.round(100 * tap / tot) : -1;
        if (pct > 8 || pie) res.set(k, `${k} tapado ${pct}%${pie ? ' PISA BLOQUEO' : ''} (h${h})`); }
      const en = PEOPLE.filter(n => n.scene !== 'none' && !n.route); for (let i = 0; i < en.length; i++) for (let j = i + 1; j < en.length; j++) { const a = en[i], b = en[j]; if (a.scene === b.scene && Math.hypot(a.x - b.x, a.y - b.y) < .8 * T) res.set(a.id + b.id, `JUNTOS ${a.id} y ${b.id} en ${a.scene} ${(a.x / T).toFixed(1)},${(a.y / T).toFixed(1)} (h${h})`); } }
    return [...res.values()]; }, isla);
  console.log(out.join('\n') || 'nadie tapado'); console.log(errs.join('\n') || 'sin errores'); await b.close(); })();
