// Bolsa, avisos de objetos, panel (Bolsa · Diario), brújula y cartel de recompensa.
// ---------- objetos ----------
const OBJETOS = {
  brujula: { n: 'Brújula de tu padre', desc: 'Latón gastado y cristal rayado. La aguja no apunta al norte: tiembla y señala adonde tienes que ir.', usar: 'Sacar', icono: () => iconoBrujula() },
  nota: { n: 'Nota de tu padre', desc: '«Para cuando sepas adónde ir. Si la aguja se vuelve loca, es que estás cerca. No dejes que tu madre cargue con todo. — P.»', icono: () => iconoPapel() },
  mapa: { n: 'Trozo de mapa', desc: 'Lo dejó la marea en la playa, envuelto en hule. Una costa que no reconoces y una línea de puntos que se corta en el borde.', icono: () => iconoMapa() },
  retrato: { n: 'Retrato de tu padre', desc: 'La imagen que faltaba en el marco de mamá. Un hombre joven en un muelle, riéndose. Tiene tu cara.', icono: () => iconoRetrato() },
};
const infoObjeto = id => OBJETOS[id] || (arma(id) && { n: arma(id).n, desc: arma(id).desc, arma: arma(id), icono: px => iconoArma(arma(id), px) });
const tiene = id => (S.bag || []).includes(id);
function darObjeto(id, silencio) { S.bag = S.bag || []; if (tiene(id)) return; S.bag.push(id); document.getElementById('openBag').classList.add('new'); if (!silencio) aviso(id); if (id === 'brujula') document.getElementById('compBtn').hidden = false; }
function quitarObjeto(id) { S.bag = (S.bag || []).filter(x => x !== id); if (S.arma === id) S.arma = null; }
// aviso arriba al centro, con la imagen del objeto; si llegan varios, van en fila
const AVISOS = [];
function aviso(id) { AVISOS.push(id); if (AVISOS.length === 1) sigAviso(); }
function sigAviso() { const id = AVISOS[0]; if (!id) return; const o = infoObjeto(id), el = document.createElement('div'); el.className = 'toast glass'; el.setAttribute('role', 'status');
  el.innerHTML = `<div class="ti"></div><div><small>Guardado en la bolsa</small><b>${o.n}</b></div>`; el.querySelector('.ti').appendChild(o.icono(96)); document.getElementById('overlays').appendChild(el);
  setTimeout(() => el.classList.add('out'), 2900); setTimeout(() => { el.remove(); AVISOS.shift(); sigAviso(); }, 3400); }

// ---------- iconos de objetos (32x32, escalados sin suavizar) ----------
const icono32 = (fn, px = 64) => { const [c, g] = mkCanvas(32, 32); fn(g); const [o, og] = mkCanvas(px, px); og.imageSmoothingEnabled = false; og.drawImage(c, 0, 0, px, px); return o; };
const iconoBrujula = px => icono32(g => { g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(16, 17, 13, 0, 7); g.fill(); g.fillStyle = '#c8962e'; g.beginPath(); g.arc(16, 17, 12, 0, 7); g.fill(); g.fillStyle = '#f0d27a'; g.beginPath(); g.arc(15, 16, 11, 3.6, 5.4); g.lineTo(15, 16); g.fill();
  g.fillStyle = '#f4ead2'; g.beginPath(); g.arc(16, 17, 9, 0, 7); g.fill(); g.fillStyle = '#c8962e'; g.fillRect(14, 2, 4, 4); g.fillStyle = '#2a1a10'; g.fillRect(15, 3, 2, 2);
  g.fillStyle = '#c83a3a'; g.beginPath(); g.moveTo(22, 11); g.lineTo(15, 16); g.lineTo(17, 18); g.fill(); g.fillStyle = '#2c3448'; g.beginPath(); g.moveTo(10, 23); g.lineTo(15, 16); g.lineTo(17, 18); g.fill(); g.fillStyle = '#c8962e'; g.fillRect(15, 16, 2, 2); }, px);
const iconoPapel = px => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(6, 4, 20, 25); g.fillStyle = '#efe2bf'; g.fillRect(7, 5, 18, 23); g.fillStyle = '#d8c8a0'; g.fillRect(7, 5, 18, 2); g.fillStyle = '#5a4030'; for (let y = 10; y < 25; y += 3) g.fillRect(9, y, y % 2 ? 14 : 11, 1); g.fillStyle = '#9a3a2a'; g.fillRect(20, 23, 4, 4); }, px);
const iconoMapa = px => icono32(g => { g.fillStyle = '#2a1a10'; g.beginPath(); g.moveTo(4, 7); g.lineTo(27, 4); g.lineTo(29, 26); g.lineTo(18, 24); g.lineTo(5, 28); g.fill(); g.fillStyle = '#e8d6a8'; g.beginPath(); g.moveTo(5, 8); g.lineTo(26, 5); g.lineTo(28, 25); g.lineTo(18, 23); g.lineTo(6, 27); g.fill();
  g.fillStyle = '#9fc8d8'; g.fillRect(6, 9, 8, 6); g.fillStyle = '#7a9a5a'; g.fillRect(14, 10, 8, 9); g.fillStyle = '#5a4030'; for (let i = 0; i < 5; i++) g.fillRect(9 + i * 3, 21 - i, 2, 1); g.fillStyle = '#c8302e'; g.fillRect(23, 15, 3, 1); g.fillRect(24, 14, 1, 3); }, px);
const iconoRetrato = px => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(4, 3, 24, 27); g.fillStyle = '#a8744a'; g.fillRect(5, 4, 22, 25); g.fillStyle = '#d8c8a0'; g.fillRect(8, 7, 16, 19); g.fillStyle = '#9fb8c8'; g.fillRect(8, 7, 16, 10);
  g.fillStyle = '#6a4228'; g.fillRect(12, 9, 8, 4); g.fillStyle = '#e4a47c'; g.fillRect(13, 12, 6, 5); g.fillStyle = '#2a2a3a'; g.fillRect(14, 14, 1, 1); g.fillRect(17, 14, 1, 1); g.fillStyle = '#4a5a7a'; g.fillRect(11, 17, 10, 9); g.fillStyle = '#7a8aa8'; g.fillRect(8, 22, 16, 1); }, px);

// ---------- panel: Bolsa y Diario en un mismo sitio ----------
let PANEL = null;
function openPanel(tab = 'bolsa', sub) { G.paused = true; G.keys = {}; PANEL = { tab, sub: sub || (PANEL && PANEL.sub) || null }; if (tab === 'bolsa') document.getElementById('openBag').classList.remove('new'); else document.getElementById('openBag').classList.remove('new-d');
  const ov = document.getElementById('overlays'), old = ov.querySelector('.panelj'); old && old.remove(); const d = document.createElement('div'); d.className = 'panelj';
  d.innerHTML = `<div class="glass book" role="dialog" aria-label="${tab === 'bolsa' ? 'Bolsa' : 'Diario'}"><div class="tabs top">${[['bolsa', 'Bolsa', 'I'], ['diario', 'Diario', 'J']].map(([k, n, kb]) => `<button type="button" data-t="${k}" class="${k === tab ? 'on' : ''}">${n} <kbd>${kb}</kbd></button>`).join('')}<button type="button" class="x" aria-label="Cerrar">Cerrar ✕</button></div>
    <div class="pbody">${tab === 'bolsa' ? bolsaHTML() : diarioHTML(sub || 'yo')}</div></div>`;
  ov.appendChild(d); d.querySelectorAll('[data-t]').forEach(b => b.onclick = () => openPanel(b.dataset.t)); d.querySelector('.x').onclick = closePanel; d.onclick = e => { if (e.target === d) closePanel(); };
  if (tab === 'diario') d.querySelectorAll('[data-k]').forEach(b => b.onclick = () => openPanel('diario', b.dataset.k));
  else { d.querySelectorAll('button.slot').forEach(b => b.onclick = () => { PANEL.sel = b.dataset.id; openPanel('bolsa'); }); const sel = PANEL.sel && tiene(PANEL.sel) ? PANEL.sel : (S.bag || [])[0];
    d.querySelectorAll('button.slot').forEach(b => b.prepend(infoObjeto(b.dataset.id).icono(64)));
    const det = d.querySelector('.det .ic'); if (det && sel) det.appendChild(infoObjeto(sel).icono(128));
    const act = d.querySelector('[data-act]'); if (act) act.onclick = () => { const a = act.dataset.act; if (a === 'equipar') { S.arma = S.arma === sel ? null : sel; openPanel('bolsa'); } if (a === 'Sacar') { closePanel(); toggleBrujula(true); } }; }
  (d.querySelector('.slot.on') || d.querySelector('.tabs .on')).focus(); }
function closePanel() { const d = document.querySelector('.panelj'); d && d.remove(); G.paused = false; }
function bolsaHTML() {
  const bag = S.bag || []; if (!bag.length) return '<p class="empty">La bolsa está vacía. Lo que encuentres o te den aparecerá aquí.</p>';
  const sel = PANEL.sel && tiene(PANEL.sel) ? PANEL.sel : bag[0]; PANEL.sel = sel; const o = infoObjeto(sel), a = o.arma;
  const grado = a ? `<span class="grado g-${a.grado}">${GRADOS[a.grado]}</span>` : '';
  return `<div class="bolsa"><div class="slots">${bag.map(id => `<button type="button" class="slot${id === sel ? ' on' : ''}" data-id="${id}" aria-label="${infoObjeto(id).n}">${S.arma === id ? '<i class="eq">En mano</i>' : ''}</button>`).join('')}${Array.from({ length: Math.max(0, 15 - bag.length) }, () => '<span class="slot vacio"></span>').join('')}</div>
    <div class="det"><div class="ic"></div><b>${o.n}</b>${a ? `<div class="meta">${TIPOS[a.tipo]}${grado}</div>` : ''}<p>${o.desc}</p>
    ${a ? `<button type="button" class="btn sm" data-act="equipar">${S.arma === sel ? 'Guardar' : 'Llevar en la mano'}</button>` : o.usar ? `<button type="button" class="btn sm" data-act="${o.usar}">${o.usar} <kbd>C</kbd></button>` : ''}</div></div>`;
}

// ---------- brújula: la aguja busca el objetivo con inercia, como una de verdad ----------
const BRU = { on: false, ang: 0, vel: 0, t: 0 };
function toggleBrujula(on = !BRU.on) { if (on && !tiene('brujula')) return; BRU.on = on; const el = document.getElementById('brujula'); el.hidden = !on; document.getElementById('compBtn').setAttribute('aria-pressed', on);
  if (on && !F.brujulaVista) { F.brujulaVista = true; later(400, () => !G.talking && bubble({ x: G.x, y: G.y, scene: G.scene }, 'No apunta al norte...', 2600)); } }
function rumbo() { // ángulo en pantalla hacia el objetivo (0 = arriba); null si no hay
  const o = objetivo(); if (!o) return null; let tx, ty;
  if (G.scene === 'town') { if (o.scene && o.scene !== 'town') { const b = WORLD.doors.find(s => s.id === o.scene.split(':')[0]); if (!b) return null; [tx, ty] = b.door; } else [tx, ty] = [o.x, o.y]; }
  else { const I = interior(G.scene); if (o.scene === G.scene) [tx, ty] = [o.x, o.y]; else { const d = I.doors.find(d => d.to === 'town') || I.doors[0]; [tx, ty] = [d.r[0] + d.r[2] / 2, d.r[1] + d.r[3] / 2]; } }
  if (Math.hypot(tx - G.x, ty - G.y) < 40) return 'aqui'; return Math.atan2(tx - G.x, -(ty - G.y)); }
function drawBrujula(now) {
  if (!BRU.on) return; const cv = document.getElementById('bruCv'), g = cv.getContext('2d'), S2 = cv.width, c = S2 / 2, dt = Math.min(.05, (now - (BRU.t || now)) / 1000); BRU.t = now;
  const r = rumbo(); let target = typeof r === 'number' ? r : BRU.ang + Math.sin(now / 300) * (r === 'aqui' ? 2.5 : .5);
  let d = ((target - BRU.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI; BRU.vel += d * 22 * dt; BRU.vel *= Math.pow(.04, dt); BRU.ang += BRU.vel * dt * 4;
  g.clearRect(0, 0, S2, S2);
  // caja de latón
  let gr = g.createRadialGradient(c * .7, c * .6, 4, c, c, c); gr.addColorStop(0, '#f6dc8a'); gr.addColorStop(.6, '#c8922e'); gr.addColorStop(1, '#6a4410'); g.fillStyle = gr; g.beginPath(); g.arc(c, c, c - 2, 0, 7); g.fill();
  g.strokeStyle = '#3a2408'; g.lineWidth = 2; g.stroke();
  // esfera de papel
  gr = g.createRadialGradient(c, c * .8, 4, c, c, c * .8); gr.addColorStop(0, '#fbf3df'); gr.addColorStop(1, '#e2d2a8'); g.fillStyle = gr; g.beginPath(); g.arc(c, c, c * .78, 0, 7); g.fill(); g.strokeStyle = '#8a6a2a'; g.lineWidth = 1.5; g.stroke();
  g.save(); g.translate(c, c);
  for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2, l = i % 8 === 0 ? 10 : i % 4 === 0 ? 7 : 4; g.strokeStyle = i % 8 === 0 ? '#5a3a1a' : '#a8885a'; g.lineWidth = i % 8 === 0 ? 2 : 1; g.beginPath(); g.moveTo(Math.sin(a) * (c * .74), -Math.cos(a) * (c * .74)); g.lineTo(Math.sin(a) * (c * .74 - l), -Math.cos(a) * (c * .74 - l)); g.stroke(); }
  // rosa de los vientos
  for (const [a, L, col] of [[0, .6, '#5a3a1a'], [Math.PI / 2, .45, '#8a6a3a'], [Math.PI, .45, '#8a6a3a'], [-Math.PI / 2, .45, '#8a6a3a']]) { g.save(); g.rotate(a); g.fillStyle = col; g.beginPath(); g.moveTo(0, -c * L); g.lineTo(5, 0); g.lineTo(-5, 0); g.fill(); g.fillStyle = '#d8c090'; g.beginPath(); g.moveTo(0, -c * L); g.lineTo(5, 0); g.lineTo(0, 0); g.fill(); g.restore(); }
  g.font = `700 ${Math.round(S2 * .09)}px Outfit, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#3a2410';
  for (const [t, a] of [['N', 0], ['E', Math.PI / 2], ['S', Math.PI], ['O', -Math.PI / 2]]) g.fillText(t, Math.sin(a) * c * .52, -Math.cos(a) * c * .52);
  // aguja
  g.rotate(BRU.ang); g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 4; g.shadowOffsetY = 2;
  g.fillStyle = '#c8302e'; g.beginPath(); g.moveTo(0, -c * .66); g.lineTo(6, 0); g.lineTo(-6, 0); g.fill(); g.fillStyle = '#2c3448'; g.beginPath(); g.moveTo(0, c * .5); g.lineTo(6, 0); g.lineTo(-6, 0); g.fill();
  g.shadowColor = 'transparent'; g.fillStyle = '#f08a7a'; g.beginPath(); g.moveTo(0, -c * .66); g.lineTo(-6, 0); g.lineTo(0, 0); g.fill();
  g.restore(); g.fillStyle = '#c8922e'; g.beginPath(); g.arc(c, c, 5, 0, 7); g.fill(); g.strokeStyle = '#3a2408'; g.lineWidth = 1.5; g.stroke();
  // reflejo del cristal
  g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(c * .72, c * .62, c * .32, c * .16, -.6, 0, 7); g.fill();
}

// ---------- cartel de recompensa ----------
function verCartel(id) {
  const P0 = { dorne: { sprite: 'capitan', nombre: '«GARRA» DORNE', cifra: '8.000.000' } }[id]; G.paused = true;
  const el = document.createElement('div'); el.className = 'wanted-ov'; el.innerHTML = `<div class="wanted" role="dialog" aria-label="Cartel de recompensa"><h3>SE BUSCA</h3><div class="foto"><canvas width="200" height="150"></canvas></div><div class="vom">VIVO O MUERTO</div><div class="nom">${P0.nombre}</div><div class="cifra"><span>฿</span>${P0.cifra}<small>-</small></div><div class="mar">MARINA</div></div>`;
  document.getElementById('overlays').appendChild(el); const cv = el.querySelector('canvas'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
  // foto: fondo de muelle, y él a mitad de un tajo con el garfio
  const gr = g.createLinearGradient(0, 0, 0, 150); gr.addColorStop(0, '#9a8a6a'); gr.addColorStop(1, '#6a5a40'); g.fillStyle = gr; g.fillRect(0, 0, 200, 150);
  g.fillStyle = 'rgba(40,30,20,.35)'; for (let i = 0; i < 6; i++) g.fillRect(0, 100 + i * 9, 200, 3);
  g.drawImage(SHEETS[P0.sprite], 2 * 64, (ANIM.slash[0] + ROW.down) * 64, 64, 46, 4, -2, 192, 138);
  const id2 = g.getImageData(0, 0, 200, 150), d = id2.data; for (let i = 0; i < d.length; i += 4) { const l = .3 * d[i] + .59 * d[i + 1] + .11 * d[i + 2]; d[i] = l * 1.05 + 20; d[i + 1] = l * .92 + 10; d[i + 2] = l * .72; } g.putImageData(id2, 0, 0);
  const close = () => { el.remove(); G.paused = false; keyHandler = null; }; el.onclick = close; keyHandler = e => { if (['e', 'E', ' ', 'Enter', 'Escape'].includes(e.key)) { e.preventDefault(); e.stopImmediatePropagation(); close(); } };
}
