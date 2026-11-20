// Cinemáticas con el propio motor: franjas negras, cámara que viaja sola, gente que camina, reacciona y habla.
// Todo devuelve promesas para escribir las escenas en orden: await camara(...); await anda(...); await globo(...).
const CINE = { on: false };
function cineOn() { CINE.on = true; G.paused = true; G.keys = {}; document.body.classList.add('cine'); }
function cineOff() { CINE.on = false; G.paused = false; G.foco = null; G.focoT = null; document.body.classList.remove('cine'); }
const esperar = ms => new Promise(r => setTimeout(r, ms));
// la cámara viaja hasta (x, y) en píxeles del mundo; null vuelve al jugador
function camara(p, ms = 1000) { return new Promise(r => { const [x0, y0] = G.foco || [G.x, G.y], [x, y] = p || [G.x, G.y]; G.focoT = { x0, y0, x, y, t0: performance.now(), ms, r, suelta: !p }; }); }
function moverCamara(now) { const q = G.focoT; if (!q) return; const k = Math.min(1, (now - q.t0) / q.ms), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  G.foco = [q.x0 + (q.x - q.x0) * e, q.y0 + (q.y - q.y0) * e]; if (k >= 1) { G.focoT = null; if (q.suelta) G.foco = null; q.r(); } }
// caminar hasta un punto en píxeles (en cualquier escena)
function anda(n, [x, y], speed = 90) { return new Promise(r => { n.goal = { x, y, speed, done: () => r() }; }); }
function globo(n, txt, ms = 1900) { bubble(n, txt, ms); return esperar(ms); }
function dialogo(n, lines) { return new Promise(r => say(n, { lines, done: r })); }
function elige(n, lines, opts) { return new Promise(r => say(n, { lines, opts: opts.map((t, i) => ({ t, then: () => r(i) })) })); }
function temblor(ms = 300, f = 6) { document.getElementById('game').animate([{ transform: 'translate(0,0)' }, { transform: `translate(${-f}px,${f / 2}px)` }, { transform: `translate(${f}px,${-f / 2}px)` }, { transform: 'translate(0,0)' }], { duration: ms }); }
function destello(color = 'rgba(255,245,210,.9)', ms = 260) { const el = document.createElement('div'); el.className = 'destello'; el.style.background = color; document.getElementById('overlays').appendChild(el); el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms }); setTimeout(() => el.remove(), ms); }
