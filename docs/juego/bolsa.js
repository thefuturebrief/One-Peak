// Bolsa, avisos de objetos, panel (Bolsa · Diario), brújula y cartel de recompensa.
// ---------- objetos ----------
const OBJETOS = {
  brujula: { n: 'Brújula de tu padre', desc: 'Latón gastado y cristal rayado. La aguja no apunta al norte: tiembla y señala adonde tienes que ir.', acc: ['sacar', 'Sacar (C)'], icono: () => iconoBrujula() },
  nota: { n: 'Nota de tu padre', desc: '«Para cuando sepas adónde ir. Si la aguja se vuelve loca, es que estás cerca. No dejes que tu madre cargue con todo. — P.»', acc: ['ver', 'Leer'], icono: () => iconoPapel() },
  mapa: { n: 'Trozo de mapa', desc: 'Lo dejó la marea en la playa, envuelto en hule. Una costa que no reconoces y una línea de puntos que se corta en el borde.', acc: ['ver', 'Mirar'], icono: () => iconoMapa() },
  emulsion: { n: 'Emulsión del doctor', cuenta: true, desc: 'Un frasco de emulsión de árnica y aceite. Sobre la herida limpia, deja de sangrar.', acc: ['curar', 'Curar'], icono: () => iconoFrasco() },
  vendas: { n: 'Vendas', cuenta: true, desc: 'Vendas de lino, enrolladas. Tapan la herida mientras cierra.', acc: ['curar', 'Curar'], icono: () => iconoVendas() },
  carta: { n: 'Carta náutica del East Blue', noVende: true, desc: 'La carta del forastero. Una ruta a lápiz sale de una isla sin nombre; al lado, con otra letra, alguien escribió «Kalé».', acc: ['ver', 'Mirar'], icono: () => iconoMapa() },
  retrato: { n: 'Retrato de tu padre', desc: 'La imagen que faltaba en el marco de mamá. Un hombre joven en un muelle, riéndose. Tiene tu cara.', acc: ['ver', 'Mirar'], icono: () => iconoRetrato() },
};
const infoObjeto = id => OBJETOS[id] || (arma(id) && { n: arma(id).n, desc: arma(id).desc, arma: arma(id), icono: px => iconoArma(arma(id), px) });
const tiene = id => (S.bag || []).includes(id);
function darObjeto(id, silencio, n) { S.bag = S.bag || []; if (n) { S.cant = S.cant || {}; S.cant[id] = (S.cant[id] || 0) + n; } if (tiene(id)) return; S.bag.push(id); document.getElementById('openBag').classList.add('new'); if (!silencio) aviso(id); if (id === 'brujula') document.getElementById('compBtn').hidden = false; }
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
const iconoFrasco = px => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(10, 8, 12, 21); g.fillRect(12, 4, 8, 5); g.fillStyle = '#8a5a2a'; g.fillRect(13, 5, 6, 3); g.fillStyle = '#c8e0d0'; g.fillRect(11, 9, 10, 19); g.fillStyle = '#e8b84a'; g.fillRect(11, 15, 10, 13); g.fillStyle = '#ffe08a'; g.fillRect(12, 16, 2, 10); g.fillStyle = '#efe2bf'; g.fillRect(11, 18, 10, 6); g.fillStyle = '#9a3a2a'; g.fillRect(14, 20, 4, 2); }, px);
const iconoVendas = px => icono32(g => { g.fillStyle = '#2a1a10'; g.beginPath(); g.ellipse(13, 18, 10, 9, 0, 0, 7); g.fill(); g.fillStyle = '#f4f0e6'; g.beginPath(); g.ellipse(13, 18, 9, 8, 0, 0, 7); g.fill(); g.strokeStyle = '#c8c0b0'; g.lineWidth = 1; for (const r of [3, 5.5]) { g.beginPath(); g.ellipse(13, 18, r, r * .9, 0, 0, 7); g.stroke(); }
  g.fillStyle = '#2a1a10'; g.fillRect(18, 22, 12, 6); g.fillStyle = '#f4f0e6'; g.fillRect(18, 23, 11, 4); g.fillStyle = '#d8d0c0'; g.fillRect(18, 25, 11, 1); }, px);
const iconoRetrato = px => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(4, 3, 24, 27); g.fillStyle = '#a8744a'; g.fillRect(5, 4, 22, 25); g.fillStyle = '#d8c8a0'; g.fillRect(8, 7, 16, 19); g.fillStyle = '#9fb8c8'; g.fillRect(8, 7, 16, 10);
  g.fillStyle = '#6a4228'; g.fillRect(12, 9, 8, 4); g.fillStyle = '#e4a47c'; g.fillRect(13, 12, 6, 5); g.fillStyle = '#2a2a3a'; g.fillRect(14, 14, 1, 1); g.fillRect(17, 14, 1, 1); g.fillStyle = '#4a5a7a'; g.fillRect(11, 17, 10, 9); g.fillStyle = '#7a8aa8'; g.fillRect(8, 22, 16, 1); }, px);

// ---------- panel: Bolsa, Cuerpo y Diario en un mismo sitio ----------
let PANEL = null;
const PESTANAS = [['bolsa', 'Bolsa', 'I'], ['cuerpo', 'Cuerpo', 'K'], ['diario', 'Diario', 'J']];
function openPanel(tab = 'bolsa', sub) { G.paused = true; G.keys = {}; PANEL = { ...(PANEL || {}), tab, sub: sub || (PANEL && PANEL.sub) || null }; if (tab === 'bolsa') document.getElementById('openBag').classList.remove('new'); if (tab === 'diario') document.getElementById('openBag').classList.remove('new-d');
  const ov = document.getElementById('overlays'), old = ov.querySelector('.panelj'); old && old.remove(); const d = document.createElement('div'); d.className = 'panelj';
  d.innerHTML = `<div class="glass book" role="dialog" aria-label="${PESTANAS.find(p => p[0] === tab)[1]}"><div class="tabs top">${PESTANAS.map(([k, n, kb]) => `<button type="button" data-t="${k}" class="${k === tab ? 'on' : ''}">${n} <kbd>${kb}</kbd></button>`).join('')}<button type="button" class="x" aria-label="Cerrar">Cerrar ✕</button></div>
    <div class="pbody">${tab === 'bolsa' ? bolsaHTML() : tab === 'cuerpo' ? cuerpoHTML() : diarioHTML(sub || 'yo')}</div></div>`;
  ov.appendChild(d); d.querySelectorAll('[data-t]').forEach(b => b.onclick = () => openPanel(b.dataset.t)); d.querySelector('.x').onclick = closePanel; d.onclick = e => { if (e.target === d) closePanel(); };
  if (tab === 'diario') d.querySelectorAll('[data-k]').forEach(b => b.onclick = () => openPanel('diario', b.dataset.k));
  if (tab === 'cuerpo') { d.querySelectorAll('[data-z]').forEach(z => { z.onclick = () => { PANEL.zona = z.dataset.z; openPanel('cuerpo'); }; z.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); z.onclick(); } }; });
    d.querySelectorAll('[data-cura]').forEach(b => b.onclick = () => { curar(PANEL.zona, b.dataset.cura); openPanel('cuerpo'); }); }
  if (tab === 'bolsa') { d.querySelectorAll('button.slot').forEach(b => b.onclick = () => { PANEL.sel = b.dataset.id; openPanel('bolsa'); }); const sel = PANEL.sel && tiene(PANEL.sel) ? PANEL.sel : (S.bag || [])[0];
    d.querySelectorAll('button.slot').forEach(b => b.prepend(infoObjeto(b.dataset.id).icono(64)));
    const det = d.querySelector('.det .ic'); if (det && sel) det.appendChild(infoObjeto(sel).icono(128));
    d.querySelectorAll('[data-act]').forEach(act => act.onclick = () => { const a = act.dataset.act; if (a === 'equipar') { S.arma = S.arma === sel ? null : sel; openPanel('bolsa'); } if (a === 'sacar') { closePanel(); toggleBrujula(true); } if (a === 'ver') { closePanel(); verObjeto(sel); } if (a === 'curar') openPanel('cuerpo'); if (a === 'comer') { comer(sel); openPanel('bolsa'); } }); }
  (d.querySelector('.slot.on') || d.querySelector('.tabs .on')).focus(); }
function closePanel() { const d = document.querySelector('.panelj'); d && d.remove(); G.paused = false; }
const cant = id => (S.cant || {})[id] || 0;
function bolsaHTML() {
  const bag = S.bag || []; if (!bag.length) return '<p class="empty">La bolsa está vacía. Lo que encuentres o te den aparecerá aquí.</p>';
  const sel = PANEL.sel && tiene(PANEL.sel) ? PANEL.sel : bag[0]; PANEL.sel = sel; const o = infoObjeto(sel), a = o.arma;
  const grado = a ? `<span class="grado g-${a.grado}">${GRADOS[a.grado]}</span>` : '';
  const btn = a ? `<button type="button" class="btn sm" data-act="equipar">${S.arma === sel ? 'Guardar' : 'Llevar en la mano'}</button>` : o.acc ? `<button type="button" class="btn sm" data-act="${o.acc[0]}">${o.acc[1]}</button>` : '';
  return `<div class="bolsa"><div class="slots">${bag.map(id => `<button type="button" class="slot${id === sel ? ' on' : ''}" data-id="${id}" aria-label="${infoObjeto(id).n}">${S.arma === id ? '<i class="eq">En mano</i>' : ''}${OBJETOS[id] && OBJETOS[id].cuenta ? `<i class="ct">×${cant(id)}</i>` : ''}</button>`).join('')}${Array.from({ length: Math.max(0, 15 - bag.length) }, () => '<span class="slot vacio"></span>').join('')}</div>
    <div class="det"><div class="ic"></div><b>${o.n}${o.cuenta ? ` <span class="cnt">×${cant(sel)}</span>` : ''}</b>${a ? `<div class="meta">${TIPOS[a.tipo]} · ${GRUPOS[TIPO[a.tipo][1]]}${grado}</div>` : ''}<p>${o.desc}</p>${btn}</div></div>`;
}
// ---------- cuerpo: una figura por zonas; tocas una y ves qué tiene y qué le puedes poner ----------
const ESTADO = { sana: ['Sana', 'Nada que curar.'], herida: ['Herida', 'Sangra un poco. Primero la emulsión, después la venda.'], tratada: ['Con emulsión', 'Ya no sangra. Una venda la protege mientras cierra.'], vendada: ['Vendada', 'Bien tapada. Cerrará sola en unos días.'] };
const estadoDe = z => (S.cuerpo || {})[z] || 'sana';
function curar(z, que) { if (!z || !cant(que)) return; const e = estadoDe(z); if (que === 'emulsion' && e === 'herida') S.cuerpo[z] = 'tratada'; else if (que === 'vendas' && (e === 'herida' || e === 'tratada')) S.cuerpo[z] = 'vendada'; else return;
  S.cant[que]--; if (!S.cant[que]) quitarObjeto(que); refrescarJugador(); guardarAuto(); }
function cuerpoHTML() {
  const C = S.cuerpo || {}, z = PANEL.zona && ZONAS.some(q => q[0] === PANEL.zona) ? PANEL.zona : (ZONAS.find(([k]) => C[k] && C[k] !== 'sana') || ZONAS[2])[0]; PANEL.zona = z;
  const e = estadoDe(z), cls = k => `zona e-${estadoDe(k)}${k === z ? ' sel' : ''}`, a = k => `data-z="${k}" class="${cls(k)}" tabindex="0" role="button" aria-label="${ZONAS.find(q => q[0] === k)[1]}: ${ESTADO[estadoDe(k)][0]}"`;
  const fig = `<svg viewBox="0 0 160 300" class="fig" aria-label="Tu cuerpo">
    <path ${a('cabeza')} d="M56 46 Q56 14 80 14 Q104 14 104 46 Q104 50 100 52 L60 52 Q56 50 56 46Z"/>
    <path ${a('cara')} d="M60 52 L100 52 Q100 78 80 84 Q60 78 60 52Z"/>
    <path ${a('torso')} d="M52 96 Q80 86 108 96 L112 172 Q80 182 48 172Z"/>
    <path ${a('brazos')} d="M48 98 Q34 104 30 130 L24 186 Q28 192 34 188 L44 136 L50 110Z M112 98 Q126 104 130 130 L136 186 Q132 192 126 188 L116 136 L110 110Z"/>
    <path ${a('piernas')} d="M50 176 Q80 186 110 176 L106 284 Q96 290 88 284 L82 200 L78 200 L72 284 Q64 290 54 284Z"/>
    <path class="cuello" d="M72 82 L88 82 L90 94 L70 94Z"/></svg>`;
  const usa = (q, n, ok) => `<button type="button" class="btn sm${ok ? '' : ' ghost'}" data-cura="${q}" ${ok ? '' : 'disabled'}>${n} <span class="cnt">×${cant(q)}</span></button>`;
  const lista = ZONAS.map(([k, n]) => `<li><span>${n}</span><b class="e-${estadoDe(k)}">${ESTADO[estadoDe(k)][0]}</b></li>`).join('');
  return `<div class="cuerpo">${fig}<div class="det"><b>${ZONAS.find(q => q[0] === z)[1]}</b><div class="meta"><span class="grado e-${e}">${ESTADO[e][0]}</span></div><p>${ESTADO[e][1]}</p>
    <div class="curas">${usa('emulsion', 'Emulsión', e === 'herida' && cant('emulsion'))}${usa('vendas', 'Venda', (e === 'herida' || e === 'tratada') && cant('vendas'))}</div>
    ${!cant('emulsion') && !cant('vendas') ? '<p class="peq">No llevas curas. El doctor Ansel tiene.</p>' : ''}<ul class="zonas">${lista}</ul></div></div>`;
}
// una herida en una zona (en las peleas). La cara recibe los golpes fuertes.
function herir(z) { S.cuerpo = S.cuerpo || {}; const e = estadoDe(z); if (e === 'sana' || e === 'vendada') S.cuerpo[z] = 'herida'; refrescarJugador(); }
// ---------- ver de cerca: la nota, el mapa y el retrato ----------
function verObjeto(id) {
  G.paused = true; const el = document.createElement('div'); el.className = 'ver-ov';
  if (id === 'nota') el.innerHTML = `<div class="papel nota-p" role="dialog" aria-label="Nota de tu padre"><p>Para cuando sepas adónde ir.</p><p>Si la aguja se vuelve loca, es que estás cerca.</p><p>No dejes que tu madre cargue con todo.</p><p class="firma">— P.</p></div>`;
  else { el.innerHTML = `<div class="papel lienzo" role="dialog" aria-label="${infoObjeto(id).n}"><canvas width="560" height="400"></canvas><small>${{ mapa: 'Ninguna costa que conozcas. La línea de puntos sale del borde roto.', carta: 'El East Blue. La ruta a lápiz termina en la isla Dawn.' }[id] || 'Detrás, a lápiz: «Kalé, el verano antes».'}</small></div>`;
    const c = el.querySelector('canvas'); ({ mapa: dibujarMapa, carta: dibujarCarta }[id] || dibujarRetrato)(c.getContext('2d'), 560, 400); }
  document.getElementById('overlays').appendChild(el);
  const close = () => { el.remove(); G.paused = false; keyHandler = null; }; el.onclick = close;
  keyHandler = e => { if (['e', 'E', ' ', 'Enter', 'Escape'].includes(e.key)) { e.preventDefault(); e.stopImmediatePropagation(); close(); } };
}
function dibujarMapa(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * .7); gr.addColorStop(0, '#efdcae'); gr.addColorStop(1, '#c9a86a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(90,60,30,${hash(i, 1, 5) * .08})`; g.fillRect(hash(i, 2, 5) * W, hash(i, 3, 5) * H, 2, 2); }
  // borde roto a la derecha
  g.fillStyle = '#16110d'; g.beginPath(); g.moveTo(W, 0); for (let y = 0; y <= H; y += 16) g.lineTo(W - 18 - hash(y, 1, 9) * 26, y); g.lineTo(W, H); g.fill();
  // costa desconocida: una isla larga con bahía
  g.strokeStyle = '#5a3a1e'; g.lineWidth = 2.5; g.fillStyle = 'rgba(120,150,80,.35)'; g.beginPath();
  const pts = Array.from({ length: 40 }, (_, i) => { const a = i / 40 * Math.PI * 2, r = 1 + (hash(i, 4, 7) - .5) * .35 - (a > 4 && a < 4.8 ? .35 : 0); return [180 + Math.cos(a) * 110 * r, 210 + Math.sin(a) * 70 * r]; });
  pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(90,58,30,.35)'; g.lineWidth = 1; for (let k = 1; k < 4; k++) { g.beginPath(); pts.forEach(([x, y], i) => { const q = [180 + (x - 180) * (1 + k * .12), 210 + (y - 210) * (1 + k * .12)]; i ? g.lineTo(...q) : g.moveTo(...q); }); g.closePath(); g.stroke(); }
  // montes y un nombre borrado
  g.strokeStyle = '#5a3a1e'; g.lineWidth = 1.5; for (const [x, y] of [[150, 200], [170, 190], [195, 205]]) { g.beginPath(); g.moveTo(x - 9, y + 6); g.lineTo(x, y - 8); g.lineTo(x + 9, y + 6); g.stroke(); }
  g.fillStyle = 'rgba(90,58,30,.55)'; g.font = 'italic 600 20px Georgia, serif'; g.fillText('I. de ▒▒▒▒', 120, 300);
  // ruta de puntos que sale del borde
  g.strokeStyle = '#8a2a1e'; g.lineWidth = 2.5; g.setLineDash([6, 7]); g.beginPath(); g.moveTo(270, 180); g.bezierCurveTo(340, 120, 420, 230, 520, 150); g.stroke(); g.setLineDash([]);
  g.strokeStyle = '#8a2a1e'; g.lineWidth = 3; g.beginPath(); g.moveTo(262, 172); g.lineTo(278, 188); g.moveTo(278, 172); g.lineTo(262, 188); g.stroke();
  // rosa de los vientos
  g.save(); g.translate(80, 80); g.fillStyle = '#5a3a1e'; for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, -38); g.lineTo(6, 0); g.lineTo(-6, 0); g.fill(); } g.font = '700 14px Georgia, serif'; g.textAlign = 'center'; g.fillText('N', 0, -44); g.restore();
  g.strokeStyle = 'rgba(60,40,20,.6)'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6);
}
function dibujarRetrato(g, W, H) {
  g.fillStyle = '#d8c8a0'; g.fillRect(0, 0, W, H); const sky = g.createLinearGradient(0, 0, 0, H * .6); sky.addColorStop(0, '#b8c8c8'); sky.addColorStop(1, '#d8d4c0'); g.fillStyle = sky; g.fillRect(20, 20, W - 40, H * .6);
  g.fillStyle = '#7a8a8a'; g.fillRect(20, H * .55, W - 40, H * .1); g.fillStyle = '#8a6a48'; g.fillRect(20, H * .65, W - 40, H * .35 - 20);
  for (let x = 20; x < W - 20; x += 26) { g.fillStyle = 'rgba(60,40,20,.35)'; g.fillRect(x, H * .65, 2, H * .35 - 20); }
  // él: el mismo aspecto que tú, de pie en el muelle (la hoja del jugador, en grande y en sepia)
  g.imageSmoothingEnabled = false; g.drawImage(SHEETS.grumete, 0, ROW.down * 64, 64, 64, W / 2 - 128, H * .2, 256, 256);
  const d = g.getImageData(0, 0, W, H), p = d.data; for (let i = 0; i < p.length; i += 4) { const l = .3 * p[i] + .59 * p[i + 1] + .11 * p[i + 2]; p[i] = l * 1.08 + 12; p[i + 1] = l * .95 + 6; p[i + 2] = l * .75; } g.putImageData(d, 0, 0);
  g.strokeStyle = '#efe6cf'; g.lineWidth = 20; g.strokeRect(10, 10, W - 20, H - 20);
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

// la carta del East Blue: islas canon con su nombre, Kalé a lápiz y la ruta hasta Dawn
function dibujarCarta(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * .7); gr.addColorStop(0, '#f0e2b8'); gr.addColorStop(1, '#cfae70'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(90,60,30,.18)'; g.lineWidth = 1; for (let x = 40; x < W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = 40; y < H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  const isla = (x, y, r, n, s2) => { g.fillStyle = 'rgba(120,150,80,.45)'; g.strokeStyle = '#5a3a1e'; g.lineWidth = 1.8; g.beginPath(); for (let i = 0; i <= 18; i++) { const a = i / 18 * Math.PI * 2, k = 1 + (hash(i, s2, 3) - .5) * .4; g.lineTo(x + Math.cos(a) * r * k, y + Math.sin(a) * r * .7 * k); } g.fill(); g.stroke();
    if (n) { g.fillStyle = '#4a2e14'; g.font = 'italic 600 13px Georgia, serif'; g.textAlign = 'center'; g.fillText(n, x, y + r + 14); } };
  isla(150, 290, 14, null, 1); g.fillStyle = '#5a5a5a'; g.font = '600 15px Caveat, cursive'; g.textAlign = 'center'; g.fillText('Kalé', 150, 322);
  isla(320, 250, 26, 'Dawn · Reino de Goa', 2); isla(250, 120, 16, 'Orange Town', 3); isla(420, 150, 18, 'Conomi', 4); g.fillStyle = '#4a2e14'; g.fillRect(372, 300, 10, 5); g.font = 'italic 600 12px Georgia, serif'; g.fillText('Baratie', 377, 320); isla(490, 70, 22, 'Loguetown', 5);
  g.strokeStyle = '#6a6a6a'; g.lineWidth = 2; g.setLineDash([5, 6]); g.beginPath(); g.moveTo(164, 286); g.bezierCurveTo(210, 300, 260, 290, 296, 262); g.stroke(); g.setLineDash([]);
  g.strokeStyle = '#8a2a1e'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(300, 250); g.lineTo(312, 262); g.moveTo(312, 250); g.lineTo(300, 262); g.stroke();
  g.fillStyle = 'rgba(90,58,30,.7)'; g.font = '700 22px Georgia, serif'; g.fillText('EAST BLUE', W / 2, 40);
  g.save(); g.translate(500, 320); g.fillStyle = '#5a3a1e'; for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, -30); g.lineTo(5, 0); g.lineTo(-5, 0); g.fill(); } g.font = '700 12px Georgia, serif'; g.fillText('N', 0, -36); g.restore();
  g.strokeStyle = 'rgba(60,40,20,.6)'; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6);
}
