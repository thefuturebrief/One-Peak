// Abre cada escena suelta por enlace y comprueba que arranca sin errores y en el estado esperado.
const { chromium } = require('playwright'); const D = __dirname;
const lista = (process.argv[2] || 'llegada,control,mercado,cartas,foso,niklas,desfile,base,canon,severin,huida').split(',');
(async () => { const b = await chromium.launch(); let mal = 0;
  for (const id of lista) { const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const errs = []; p.on('pageerror', e => errs.push(e.message)); await p.route('https://fonts.**', r => r.fulfill({ body: '' }));
    await p.goto(`http://127.0.0.1:8765/index.html?escena=${id}&compa=${process.env.COMPA || 'nerea'}`); await p.waitForTimeout(id === 'llegada' ? 9000 : 5500);
    const st = await p.evaluate(() => ({ isla: S.isla, scene: G.scene, x: (G.x / T).toFixed(1), y: (G.y / T).toFixed(1), h: hourNow().toFixed(2), dlg: !!document.querySelector('.dlg'), cine: CINE.on, pelea: !!document.querySelector('.fight, .pelea'), guardado: !!localStorage.getItem('onepeak-partida-v1'), txt: (document.querySelector('.dlg') || {}).innerText || '' }));
    await p.screenshot({ path: `${D}/esc-${id}.png` }); console.log(id, JSON.stringify({ ...st, txt: st.txt.slice(0, 90).replace(/\n/g, ' ') }), errs.length ? 'ERRORES: ' + errs.join(' | ') : 'ok'); if (errs.length || st.guardado) mal++; await p.close(); }
  console.log(mal ? `${mal} con problemas` : 'todas bien'); await b.close(); })();
