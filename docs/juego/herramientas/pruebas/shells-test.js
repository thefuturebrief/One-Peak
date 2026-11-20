// Acto 1 completo en Shells Town con el compañero indicado (rufo | iria | tobi).
const { chromium } = require('playwright'); const D = __dirname, compa = process.argv[2] || 'rufo'; const errs = [], log = [];
process.on('unhandledRejection', e => { console.log(JSON.stringify(log, null, 0).replace(/\],\[/g, '],\n[')); console.log('FALLO:', e.message.split('\n')[0]); console.log(errs.join('\n')); process.exit(1); });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', e => errs.push(e.message)); await p.route('https://fonts.**', r => r.fulfill({ body: '' }));
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForFunction(() => typeof WORLD !== 'undefined' && WORLD.ready, null, { timeout: 20000 });
  const shot = async n => { await p.waitForTimeout(300); await p.screenshot({ path: `${D}/s-${compa}-${n}.png` }); };
  const pasar = async (max = 80) => { for (let i = 0; i < max; i++) { if (await p.$('.dlg.pedir')) return 'pedir'; if (await p.$('.fight .ch button')) return 'pelea'; if (await p.$('.dlg .ch:not(.wait)')) return 'ch'; if (await p.$('.dlg')) { await p.keyboard.press('e'); await p.waitForTimeout(90); } else return 'libre'; } return 'tope'; };
  const elegir = async re => { await pasar(); const o = await p.$$eval('.dlg .ch button', bs => bs.map(b => b.textContent)); const k = o.findIndex(x => re.test(x)); if (k < 0) { log.push(['NO HAY OPCIÓN', String(re), o]); return false; } await p.click(`.dlg .ch button:nth-child(${k + 1})`); await p.waitForTimeout(150); return true; };
  const cerrar = async () => { for (let i = 0; i < 4; i++) { const st = await pasar(); if (st !== 'ch') return; await p.click('.dlg .ch button:last-child'); await p.waitForTimeout(150); } };
  const hablar = async id => { await cerrar(); await p.evaluate(id => { const n = P(id); G.scene = n.scene; G.x = n.x; G.y = n.y + 24; G.dir = 'up'; }, id); await p.waitForTimeout(250); await p.keyboard.press('e'); await p.waitForTimeout(200); };
  const objeto = async (label, cerca) => { await cerrar(); const ok = await p.evaluate(([l, c]) => { const o = OBJS.filter(o => o.label === l && (!o.si || o.si())).sort((a, b) => c ? Math.hypot(a.x - c[0] * T, a.y - c[1] * T) - Math.hypot(b.x - c[0] * T, b.y - c[1] * T) : 0)[0]; if (!o) return false; G.scene = o.scene; G.x = o.x; G.y = o.y + 14; return true; }, [label, cerca]); if (!ok) { log.push(['NO HAY OBJETO', label]); return; } await p.waitForTimeout(200); await p.keyboard.press('e'); await p.waitForTimeout(250); };
  const pelear = async () => { for (let i = 0; i < 60; i++) { await p.waitForTimeout(400); if (await p.$(".fight .ch button")) { await p.click('.fight .ch button'); } else if (!await p.$('.fight')) break; } await p.waitForTimeout(2500); };
  await p.click('.mi[data-a="new"]'); await p.fill('#nm', 'Ilo'); await p.click('#go');
  for (let i = 0; i < 12 && await p.$('.opt, .event'); i++) { if (await p.$('.event')) await p.click('#go'); else await p.click('.opt'); await p.waitForTimeout(60); }
  await p.click('.tiza .skip'); await p.waitForTimeout(600); await pasar(); await p.evaluate(() => document.querySelectorAll('.tip').forEach(t => t.remove()));
  await p.evaluate(() => { F.zarpado = true; F.invitacion = true; F.campana = true; llegadaShells(); }); await p.waitForTimeout(2500); await shot('1-cala');
  await elegir(/Volveré/); await pasar(); await p.waitForTimeout(9000); log.push(['tras la cala', await p.evaluate(() => [berries(), P('medusa').scene, F.stMedusaFuera, hourNow().toFixed(2)])]);
  // control del cadete
  await p.evaluate(() => { G.x = 9.8 * T; G.y = 31.4 * T; }); await p.waitForTimeout(2500); await shot('2-control'); await elegir(/Goa/); await pasar(); log.push(['control', await p.evaluate(() => [F.stControl, F.stTono])]);
  // el candidato
  if (compa === 'rufo') { await p.evaluate(() => { G.minutes = Math.floor(G.minutes / 1440) * 1440 + 9.5 * 60; rutinasS(true); }); await hablar('rufo'); await elegir(/trabajo/); await pasar(); await hablar('marta'); await elegir(/Rufo/); await pasar(); await hablar('rufo'); await elegir(/pescado/); await pasar(); await shot('3-rufo'); await hablar('rufo'); await elegir(/Vente/); }
  if (compa === 'iria') { await p.evaluate(() => { G.minutes = Math.floor(G.minutes / 1440) * 1440 + 10 * 60; rutinasS(true); }); for (const re of [/tiempo/, /tu madre/, /ayudarte/]) { await hablar('iria'); await elegir(re); await pasar(); } await objeto('Mirar', [9.4, 37.4]); await pasar(); log.push(['compás', await p.evaluate(() => tiene('compas_iria'))]); await p.evaluate(() => rutinasS(true)); await hablar('iria'); await elegir(/compás/); await pasar(); await shot('3-iria'); await hablar('iria'); await elegir(/Vente/); }
  if (compa === 'tobi') { await p.evaluate(() => { G.minutes = Math.floor(G.minutes / 1440) * 1440 + 14 * 60; rutinasS(true); }); await hablar('tobi'); await elegir(/Foso\./); await pasar(); await pelear(); await pasar(); await hablar('tobi'); await elegir(/Pelea conmigo/); await pasar(); await pelear(); await pasar(); await shot('3-tobi'); await hablar('tobi'); await elegir(/Vente/); }
  await pasar(); log.push(['compañero', await p.evaluate(() => [F.stCompa, berries(), DIARY.encargos.map(e => e.title + (e.hecho ? ' ✓' : ''))])]);
  // dormir en la posada
  await hablar('celes'); await elegir(/cama/); await pasar(); await objeto('Dormir'); await pasar(); await p.waitForTimeout(3500); await pasar(); log.push(['mañana', await p.evaluate(() => [diaS(), hourNow().toFixed(1)])]);
  // el desfile
  await p.evaluate(() => { G.minutes = (F.stD0 + 1) * 1440 + 10.6 * 60; }); await p.waitForTimeout(800); log.push(['desfile', await p.evaluate(() => [F.stDesfile, P(F.stCompa).scene])]);
  await p.evaluate(() => { const c = P(F.stCompa); G.scene = 'town'; G.x = 32 * T; G.y = 22.6 * T; }); await p.waitForTimeout(400); await shot('4-plaza');
  await hablar(compa); await elegir(/Vamos/); await pasar(); await p.waitForTimeout(800); await pasar(); log.push(['dentro', await p.evaluate(() => [G.scene, F.stDentro])]);
  if (compa !== 'rufo') { await p.evaluate(() => { const s = WORLD.doors.find(d => d.b.id === 'cuartel'); G.scene = 'town'; G.x = s.door[0]; G.y = s.door[1] + 14; G.dir = 'up'; }); await p.keyboard.press('e'); await p.waitForTimeout(800); }
  await objeto('Abrir el cajón'); await pasar(); await objeto('Buscar'); await pasar(); await shot('5-almacen'); log.push(['recuperado', await p.evaluate(() => [F.stTengo, P(F.stCompa).arma || null])]);
  await objeto('Subir a la muralla'); await p.waitForTimeout(900); await shot('6-bateria');
  await p.evaluate(() => { G.y = interior(G.scene).Y(2.6); }); await p.waitForTimeout(800); await pasar(); await p.waitForTimeout(2200); await shot('7-bala'); await p.waitForTimeout(1200); await shot('8-estatua'); await p.waitForTimeout(8000);
  await pasar(); await shot('9-severin'); await elegir(/Apártate/); await p.waitForTimeout(300); await pelear(); await pasar(); await shot('10-tras-pelea'); log.push(['pelea', await p.evaluate(() => [F.stSeverin, F.stHuida])]);
  await pasar(); await p.evaluate(() => { G.scene = 'town'; G.x = 33 * T; G.y = 30 * T; }); await p.waitForTimeout(1200); await shot('11-huida');
  await p.evaluate(() => { G.x = 39 * T; G.y = 41.9 * T; }); await p.waitForTimeout(1200); await pasar(); await p.waitForTimeout(3500); await shot('12-tiza'); for (let i = 0; i < 3; i++) { await p.mouse.click(640, 300); await p.waitForTimeout(600); } await p.waitForTimeout(3000); await shot('13-fin');
  log.push(['fin', await p.evaluate(() => [!!document.querySelector('.tiza .fin:not([hidden])'), F.estatua, berries(), JSON.stringify(S.fama)])]);
  console.log(JSON.stringify(log, null, 0).replace(/\],\[/g, '],\n[')); console.log(errs.join('\n') || 'sin errores'); await b.close();
})();
