// Guardado de partida: en este navegador (localStorage). Se guarda solo al cambiar de lugar y en momentos clave,
// y a mano desde la pausa. No se guarda durante el ataque a la plaza: si sales ahí, vuelves al último guardado de antes.
const CLAVE = 'onepeak-partida-v1';
const leerGuardado = () => { try { const t = localStorage.getItem(CLAVE); return t ? JSON.parse(t) : null; } catch (e) { return null; } };
const sePuedeGuardar = () => !cv.hidden && !(F.campana && !F.invitacion) && !G.lapse;
function guardar(manual) {
  if (!sePuedeGuardar()) return false;
  const flags = {}; for (const [k, v] of Object.entries(F)) if (['string', 'number', 'boolean'].includes(typeof v)) flags[k] = v;
  if (F.plazaFight) flags.plazaFight = { won: !!F.plazaFight.won, protected: !!F.plazaFight.protected, down: !!F.plazaFight.down };
  const data = { v: 1, t: Date.now(), player: { name: player.name, last: player.last, look: player.look }, S: JSON.parse(JSON.stringify(S)), DIARY, F: flags,
    G: { scene: G.scene, x: Math.round(G.x), y: Math.round(G.y), dir: G.dir, minutes: G.minutes } };
  try { localStorage.setItem(CLAVE, JSON.stringify(data)); } catch (e) { if (manual) note('No se pudo guardar: este navegador no deja guardar datos.'); return false; }
  avisoGuardado(); return true;
}
let ultimoAuto = 0;
function guardarAuto() { const now = performance.now(); if (now - ultimoAuto < 4000) return; if (guardar()) ultimoAuto = now; }
function avisoGuardado() { const el = document.createElement('div'); el.className = 'guardado'; el.textContent = 'Partida guardada'; document.getElementById('overlays').appendChild(el); setTimeout(() => el.classList.add('out'), 1400); setTimeout(() => el.remove(), 2000); }
// continuar: se rehace el mundo como al empezar y encima se pone lo guardado
function continuar() {
  const d = leerGuardado(); if (!d) return menu();
  reset(); Object.assign(S, d.S); Object.assign(player, d.player); for (const k in DIARY) DIARY[k] = d.DIARY[k] || [];
  aplicarAspecto(player.look); startGame(d);
}
function restaurar(d) {
  Object.assign(F, d.F); G.minutes = d.G.minutes;
  if (tiene('brujula')) document.getElementById('compBtn').hidden = false;
  if (F.caja) { const o = OBJS.find(o => o.label === 'Cavar'); if (o) o.label = 'Mirar'; }
  if (F.invitacion) restaurarNoche(); else rutinas(true);
  enter(d.G.scene, [d.G.x, d.G.y], d.G.dir);
}
// de noche: la plaza ya pasó; vuelven el forastero y la teniente a sus sitios y todos a sus frases de despedida
function restaurarNoche() {
  F.campana = F.plaza = F.refuerzos = true; P('dorne').scene = 'none';
  npcAdd('forastero', 'forastero', 'Forastero', 'town', [4.6, 22.2], 'left'); npcAdd('teniente', 'teniente', 'Teniente Breda Nisi', 'town', [44.5, 14.6], 'down', { arma: 'estoque' });
  atardecerEstado();
}
