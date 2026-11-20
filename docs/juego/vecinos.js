// Vecinos: gente con casa y agenda que camina por las calles del plano (grafo de caminos con cruces).
// Agenda: [[hora, lugar], ...]. Lugar: 'casa' | ['calle', x, y, dir] | ['dentro', edificio, x, y, dir] | ['ruta', [[x, y], ...]] | 'fuera'.
let CALLES = null;
function cruceSeg([a, b], [c, d]) { const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0], e = .02;
  const sobre = (p, [u, v]) => { const L = Math.hypot(v[0] - u[0], v[1] - u[1]) || 1, t = ((p[0] - u[0]) * (v[0] - u[0]) + (p[1] - u[1]) * (v[1] - u[1])) / L / L; if (t < -e || t > 1 + e) return false; return Math.hypot(u[0] + (v[0] - u[0]) * t - p[0], u[1] + (v[1] - u[1]) * t - p[1]) < .25; };
  for (const p of [a, b]) if (sobre(p, [c, d])) return p; for (const p of [c, d]) if (sobre(p, [a, b])) return p;
  if (Math.abs(den) < 1e-9) return null; const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den;
  return t > -e && t < 1 + e && u > -e && u < 1 + e ? [a[0] + r[0] * t, a[1] + r[1] * t] : null; }
function grafoCalles(M) {
  const segs = []; for (const c of M.caminos) for (let i = 0; i < c.p.length - 1; i++) segs.push([c.p[i], c.p[i + 1]]);
  const N = new Map(), k = p => p[0].toFixed(1) + ',' + p[1].toFixed(1), add = p => { const q = k(p); if (!N.has(q)) N.set(q, { p, ad: new Set() }); return q; }, une = (u, v) => { if (u !== v) { N.get(u).ad.add(v); N.get(v).ad.add(u); } };
  const cortes = segs.map(() => []); for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) { const x = cruceSeg(segs[i], segs[j]); if (x) { cortes[i].push(x); cortes[j].push(x); } }
  segs.forEach(([a, b], i) => { const d = p => Math.hypot(p[0] - a[0], p[1] - a[1]), ps = [a, ...cortes[i], b].sort((p, q) => d(p) - d(q)); for (let j = 0; j < ps.length - 1; j++) une(add(ps[j]), add(ps[j + 1])); });
  // la plaza es espacio abierto: los nodos de su borde se unen entre sí
  const pz = M.plaza; if (pz && pz.w) { const en = [...N.keys()].filter(q => { const [x, y] = N.get(q).p; return x > pz.x - .7 && x < pz.x + pz.w + .7 && y > pz.y - .7 && y < pz.y + pz.h + .7; }); for (const u of en) for (const v of en) une(u, v); }
  return N; }
function rutaCalles(desde, hasta) { const N = CALLES, cerca = p => [...N.keys()].reduce((m, q) => { const d = Math.hypot(N.get(q).p[0] - p[0], N.get(q).p[1] - p[1]); return d < m[1] ? [q, d] : m; }, [null, 1e9])[0];
  const a = cerca(desde), b = cerca(hasta); if (!a || !b) return [hasta]; const dist = new Map([[a, 0]]), prev = new Map(), abiertos = new Set([a]);
  while (abiertos.size) { let u = null; for (const q of abiertos) if (u === null || dist.get(q) < dist.get(u)) u = q; abiertos.delete(u); if (u === b) break;
    for (const v of N.get(u).ad) { const nd = dist.get(u) + Math.hypot(N.get(u).p[0] - N.get(v).p[0], N.get(u).p[1] - N.get(v).p[1]); if (nd < (dist.get(v) ?? 1e9)) { dist.set(v, nd); prev.set(v, u); abiertos.add(v); } } }
  const camino = []; for (let q = b; q; q = prev.get(q)) camino.unshift(N.get(q).p); return [...camino, hasta]; }
const puertaDe = id => { const s = WORLD.doors.find(d => d.id === id); return s ? [s.door[0] / T, s.door[1] / T + .4] : null; };
function lugarActual(n) { const h = hourNow(); let L = n.agenda[n.agenda.length - 1][1]; for (const [hh, l] of n.agenda) if (h >= hh) L = l; return L; }
const mismoLugar = (a, b) => JSON.stringify(a) === JSON.stringify(b);
// arranca o actualiza a cada vecino según la hora; con fuerza, los pone en su sitio sin caminar
function vecinosTick(force) {
  if (!CALLES) CALLES = grafoCalles(PLANO.mapa);
  for (const n of PEOPLE) { if (!n.agenda || n.quieto) continue; const L = lugarActual(n);
    if (n.camino && n.camino.length && !n.goal) { const [x, y] = n.camino.shift(); n.goal = { x: x * T, y: y * T, speed: n.vel || 60, done: () => { if (!n.camino.length) llega(n); } }; }
    if (mismoLugar(L, n.lugar)) continue;
    const cerca = n.scene === G.scene && Math.hypot(n.x - G.x, n.y - G.y) < 300 && G.scene !== 'town'; if (cerca && !force) continue; // no desaparece delante tuyo dentro de un cuarto
    n.lugar = L; n.route = null; n.goal = null;
    if (force) { pon(n, L); continue; }
    // de dónde sale: de su sitio en la calle, o de la puerta del edificio donde estaba
    let desde = n.scene === 'town' ? [n.x / T, n.y / T] : n.dentroDe ? puertaDe(n.dentroDe) : puertaDe(n.casa);
    if (!desde) { pon(n, L); continue; }
    const hasta = L === 'casa' ? puertaDe(n.casa) : L[0] === 'calle' ? [L[1], L[2]] : L[0] === 'dentro' ? puertaDe(L[1]) : L[0] === 'ruta' ? L[1][0] : null;
    if (!hasta) { pon(n, L); continue; }
    if (n.scene !== 'town') { n.scene = 'town'; n.x = desde[0] * T; n.y = desde[1] * T; n.dentroDe = null; }
    n.camino = rutaCalles(desde, hasta); }
}
function llega(n) { const L = n.lugar; if (L === 'casa' || L === 'fuera') { n.scene = 'none'; n.dentroDe = n.casa; return; }
  if (L[0] === 'calle') { n.dir = L[3] || 'down'; return; }
  if (L[0] === 'dentro') { moveNpc(n, L[1], [L[2], L[3]], L[4] || 'down'); n.dentroDe = L[1]; return; }
  if (L[0] === 'ruta') { n.route = L[1]; n.speed = 28; n.t = 0; } }
function pon(n, L) { n.camino = null; n.goal = null; n.route = null;
  if (L === 'casa' || L === 'fuera') { n.scene = 'none'; n.dentroDe = n.casa; }
  else if (L[0] === 'calle') { moveNpc(n, 'town', [L[1], L[2]], L[3] || 'down'); n.dentroDe = null; }
  else if (L[0] === 'dentro') { moveNpc(n, L[1], [L[2], L[3]], L[4] || 'down'); n.dentroDe = L[1]; }
  else if (L[0] === 'ruta') { n.scene = 'town'; n.route = L[1]; n.speed = 28; n.t = Math.random() * 100; n.dentroDe = null; } }
