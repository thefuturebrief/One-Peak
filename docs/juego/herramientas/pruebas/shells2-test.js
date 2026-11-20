// Acto 1 v2 en Shells Town con el compañero indicado (rufo | nerea | niklas). PERDER=1 fuerza a perder con Severin.
const { chromium } = require('playwright'); const D = __dirname, compa = process.argv[2] || 'rufo', errs = [], log = [];
process.on('unhandledRejection', e => { console.log(JSON.stringify(log, null, 0).replace(/\],\[/g, '],\n[')); console.log('FALLO:', e.message.split('\n')[0]); console.log(errs.join('\n')); process.exit(1); });
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } });
  p.on('pageerror', e => errs.push(e.message)); await p.route('https://fonts.**', r => r.fulfill({ body: '' }));
  await p.goto('http://127.0.0.1:8765/index.html'); await p.waitForFunction(() => typeof WORLD !== 'undefined' && WORLD.ready, null, { timeout: 20000 });
  const shot = async n => { await p.waitForTimeout(250); await p.screenshot({ path: `${D}/s2-${compa}-${n}.png` }); };
  const ev = f => p.evaluate(f);
  // avanza diálogos y peleas hasta que haya que elegir o se cumpla la condición
  const auto = async (cond, max = 120, perder) => { for (let i = 0; i < max; i++) { if (cond && await ev(cond)) return 'ok'; if (await p.$('.dlg.pedir')) return 'pedir';
      if (await p.$('.fight .ch button')) { await p.click(perder ? '.fight .ch button:last-child' : '.fight .ch button'); await p.waitForTimeout(200); continue; }
      if (await p.$('.dlg .ch:not(.wait)')) { if (!cond) return 'ch'; } else if (await p.$('.dlg')) { await p.keyboard.press('e'); }
      await p.waitForTimeout(220); } return 'tope'; };
  const elegir = async re => { await auto(null, 60); const o = await p.$$eval('.dlg .ch button', bs => bs.map(b => b.textContent)); const k = o.findIndex(x => re.test(x)); if (k < 0) { log.push(['NO HAY OPCIÓN', String(re), o]); return false; } await p.click(`.dlg .ch button:nth-child(${k + 1})`); await p.waitForTimeout(180); return true; };
  const cerrar = async () => { for (let i = 0; i < 5; i++) { const st = await auto(null, 40); if (st !== 'ch') return; await p.click('.dlg .ch button:last-child'); await p.waitForTimeout(150); } };
  const hablar = async id => { await cerrar(); await p.evaluate(id => { const n = P(id); G.scene = n.scene; G.x = n.x; G.y = n.y + 24; G.dir = 'up'; }, id); await p.waitForTimeout(250); await p.keyboard.press('e'); await p.waitForTimeout(200); };
  const objeto = async (label, cerca) => { await cerrar(); const ok = await p.evaluate(([l, c]) => { const o = OBJS.filter(o => o.label === l && (!o.si || o.si())).sort((a, b) => c ? Math.hypot(a.x - c[0] * T, a.y - c[1] * T) - Math.hypot(b.x - c[0] * T, b.y - c[1] * T) : 0)[0]; if (!o) return false; G.scene = o.scene; G.x = o.x; G.y = o.y + 14; return true; }, [label, cerca]); if (!ok) { log.push(['NO HAY OBJETO', label]); return; } await p.waitForTimeout(200); await p.keyboard.press('e'); await p.waitForTimeout(250); };
  const hora = async (d, h) => { await ev(`G.minutes = (F.stD0 + ${d}) * 1440 + ${h} * 60; for (const n of PEOPLE) { n.lugar = null; } vecinosTick(true);`); await p.waitForTimeout(300); };
  await p.click('.mi[data-a="new"]'); await p.fill('#nm', 'Ilo'); await p.click('#go');
  for (let i = 0; i < 12 && await p.$('.opt, .event'); i++) { if (await p.$('.event')) await p.click('#go'); else await p.click('.opt'); await p.waitForTimeout(60); }
  await p.click('.tiza .skip'); await p.waitForTimeout(600); await auto(null, 20); await ev(() => document.querySelectorAll('.tip').forEach(t => t.remove()));
  // llegada
  await ev(() => { F.zarpado = true; F.invitacion = true; F.campana = true; llegadaShells(); }); await p.waitForTimeout(3500); await shot('1-llegada');
  await elegir(/Volveré/); await auto(() => F.stMedusaFuera, 100); log.push(['tras la cala', await ev(() => [berries(), P('medusa').scene, !!F.stMedusaFuera, hourNow().toFixed(2)])]);
  // control: andar por la senda hasta el cadete
  await ev(() => { G.x = 9.6 * T; G.y = 38.6 * T; }); await p.waitForTimeout(2500); await shot('2-control'); await elegir(/Goa/); await auto(() => F.stControl === true, 40); log.push(['control', await ev(() => [F.stControl, F.stTono])]);
  // el candidato
  if (compa === 'rufo') { await hora(0, 9.5); await hablar('rufo'); await elegir(/trabajo/); await hablar('marta'); await elegir(/Rufo/); await hablar('rufo'); await elegir(/pescado/); await hablar('rufo'); await elegir(/Vente/); }
  if (compa === 'nerea') { await hora(0, 15); await hablar('nerea'); await elegir(/dedicas/); await elegir(/enseñó/); await elegir(/perder/); await elegir(/manos/); await elegir(/manga/); await elegir(/carta en la manga/); await auto(() => F.stNereaHecho, 40); await shot('3-cartas'); await hablar('nerea'); await elegir(/Vente/); }
  if (compa === 'niklas') { await hora(0, 14.5); await hablar('niklas'); await elegir(/Foso\./); await auto(() => F.stFosoPeleado && !document.querySelector('.fight'), 120); await hablar('niklas'); await elegir(/Pelea conmigo/); await auto(() => F.stNiklasHecho && !document.querySelector('.fight'), 120); await shot('3-niklas'); await hablar('niklas'); await elegir(/Vente/); }
  await auto(() => !!F.stCompa, 40); await cerrar(); log.push(['compañero', await ev(() => [F.stCompa, berries(), DIARY.encargos.map(e => e.title + (e.hecho ? ' ✓' : ''))])]);
  // dormir en la posada
  await hablar('celes'); await elegir(/cama/); await cerrar(); await objeto('Dormir'); await auto(() => diaS() === 1 && !G.lapse, 60); await cerrar(); log.push(['mañana', await ev(() => [diaS(), hourNow().toFixed(1)])]);
  // el desfile
  await ev(() => { G.minutes = (F.stD0 + 1) * 1440 + 10.6 * 60; }); await p.waitForTimeout(900); log.push(['desfile', await ev(() => [F.stDesfile, P(F.stCompa).scene])]);
  await ev(() => { G.scene = 'town'; G.x = 33 * T; G.y = 23.6 * T; G.dir = 'up'; }); await p.waitForTimeout(500); await shot('4-plaza');
  await hablar(compa); await elegir(/Vamos/); await auto(() => F.stDentro && !document.getElementById('fadeov').style.opacity * 1, 30); await cerrar(); log.push(['dentro', await ev(() => [G.scene, F.stDentro])]);
  if (compa !== 'rufo') { await ev(() => { const s = WORLD.doors.find(d => d.b.id === 'cuartel'); G.scene = 'town'; G.x = s.door[0]; G.y = s.door[1] + 14; G.dir = 'up'; }); await p.keyboard.press('e'); await p.waitForTimeout(800); }
  await objeto('Abrir el cajón'); await cerrar(); await objeto('Buscar'); await cerrar(); await shot('5-almacen'); log.push(['recuperado', await ev(() => [F.stTengo, P(F.stCompa).arma || null])]);
  // salir al patio y cruzar junto al cañón: cinemática
  await ev(() => { enter('town', [33 * T, 11 * T], 'down'); }); await p.waitForTimeout(500); await ev(() => { G.x = 30.6 * T; G.y = 12.8 * T; }); await p.waitForTimeout(600);
  await auto(() => document.body.classList.contains('cine') && WORLD.canonNorte, 40); await shot('6-canon'); await auto(() => !!F.stBala, 60); await p.waitForTimeout(500); await shot('7-bala');
  await auto(() => F.estatua === 'rota', 40); await p.waitForTimeout(700); await shot('8-estatua'); await auto(() => F.stCanon === true, 80); await shot('9-severin');
  await elegir(/Apártate/); await auto(() => !!document.querySelector('.fight'), 60); await shot('10-pelea');
  await auto(() => F.stHuida, 200, !!process.env.PERDER); await shot('11-tras-pelea'); log.push(['pelea', await ev(() => [F.stSeverin, !!F.stHuida])]);
  await cerrar(); await ev(() => { G.scene = 'town'; G.x = 33 * T; G.y = 30 * T; }); await p.waitForTimeout(1600); await shot('12-huida');
  await ev(() => { G.x = 41 * T; G.y = 46.9 * T; }); await auto(() => F.stSalto, 40); await p.waitForTimeout(900); await shot('13-salto'); await auto(() => !!document.querySelector('.tiza'), 100); await p.waitForTimeout(3000); await shot('14-tiza');
  for (let i = 0; i < 3; i++) { await p.mouse.click(640, 300); await p.waitForTimeout(600); } await p.waitForTimeout(3000); await shot('15-fin');
  log.push(['fin', await ev(() => [!!document.querySelector('.tiza .fin:not([hidden])'), F.estatua, berries(), JSON.stringify(S.fama)])]);
  console.log(JSON.stringify(log, null, 0).replace(/\],\[/g, '],\n[')); console.log(errs.join('\n') || 'sin errores'); await b.close();
})();
