// Berries, tiendas y encargos. Los objetos nuevos se suman a OBJETOS (bolsa.js).
// ---------- objetos de comer, de oficio y de encargo ----------
Object.assign(OBJETOS, {
  pan: { n: 'Pan de Nell', cuenta: true, comida: 8, precio: 10, desc: 'Una hogaza pequeña, todavía tibia. Con el estómago lleno se aguanta más.', acc: ['comer', 'Comer'], icono: () => iconoPan() },
  guiso: { n: 'Guiso de Mara', cuenta: true, comida: 16, precio: 25, desc: 'Pescado, patata y algo que Mara no confiesa. Llena para todo el día.', acc: ['comer', 'Comer'], icono: () => iconoGuiso() },
  cuerda: { n: 'Cuerda', cuenta: true, precio: 15, desc: 'Diez brazas de cáñamo. En un barco nunca sobra.', icono: () => iconoCuerda() },
  anzuelos: { n: 'Anzuelos', cuenta: true, precio: 8, desc: 'Una cajita de anzuelos de hierro. Para cuando haya que comer de lo que dé el mar.', icono: () => iconoAnzuelos() },
  pescado: { n: 'Pescado para Mara', noVende: true, desc: 'Dos besugos envueltos en papel de estraza. Rosa te ha pedido que se los lleves a Mara, a la taberna.', icono: () => iconoPescado() },
  hogaza: { n: 'Hogaza para el doctor', noVende: true, desc: 'Nell dice que el doctor se olvida de comer. Llévasela a su casa.', icono: () => iconoPan(true) },
  catalejo: { n: 'Catalejo viejo', precio: 90, desc: 'Latón abollado y una G grabada. Se ve lejos, aunque un poco torcido.', icono: () => iconoCatalejo() },
});
for (const k of ['emulsion', 'vendas']) OBJETOS[k].precio = { emulsion: 30, vendas: 12 }[k];
for (const k of ['brujula', 'nota', 'retrato', 'mapa']) OBJETOS[k].noVende = true;
const iconoPan = (envuelta, px) => icono32(g => { if (envuelta) { g.fillStyle = '#2a1a10'; g.fillRect(3, 14, 26, 14); g.fillStyle = '#e8dcc0'; g.fillRect(4, 15, 24, 12); g.fillStyle = '#c8402e'; g.fillRect(4, 19, 24, 2); }
  g.fillStyle = '#2a1a10'; g.beginPath(); g.ellipse(16, 15, 12, 8, 0, 0, 7); g.fill(); g.fillStyle = '#c88a3a'; g.beginPath(); g.ellipse(16, 15, 11, 7, 0, 0, 7); g.fill(); g.fillStyle = '#e8b86a'; g.beginPath(); g.ellipse(14, 12, 7, 3, 0, 0, 7); g.fill();
  g.strokeStyle = '#8a5a22'; g.lineWidth = 1.2; for (const x of [11, 16, 21]) { g.beginPath(); g.moveTo(x - 2, 11); g.lineTo(x + 2, 17); g.stroke(); } }, px);
const iconoGuiso = px => icono32(g => { g.fillStyle = 'rgba(255,255,255,.5)'; for (const x of [12, 17, 21]) g.fillRect(x, 3 + (x % 3), 1, 5); g.fillStyle = '#2a1a10'; g.beginPath(); g.ellipse(16, 18, 13, 5, 0, 0, 7); g.fill(); g.fillRect(3, 18, 26, 6); g.beginPath(); g.ellipse(16, 24, 13, 5, 0, 0, Math.PI); g.fill();
  g.fillStyle = '#8a5a34'; g.fillRect(4, 18, 24, 6); g.beginPath(); g.ellipse(16, 24, 12, 4, 0, 0, Math.PI); g.fill(); g.fillStyle = '#c87a3a'; g.beginPath(); g.ellipse(16, 18, 12, 4, 0, 0, 7); g.fill(); g.fillStyle = '#f0d890'; g.fillRect(11, 17, 3, 2); g.fillStyle = '#e8e2d0'; g.fillRect(18, 16, 4, 2); g.fillStyle = '#7aa04a'; g.fillRect(15, 18, 2, 1); }, px);
const iconoCuerda = px => icono32(g => { g.lineWidth = 3; for (const [r, col] of [[11, '#2a1a10'], [11, '#c8a870'], [7.5, '#2a1a10'], [7.5, '#b8945a'], [4, '#2a1a10'], [4, '#c8a870']]) { g.strokeStyle = col; g.lineWidth = col === '#2a1a10' ? 4.5 : 2.5; g.beginPath(); g.ellipse(16, 17, r, r * .8, 0, 0, 7); g.stroke(); } g.strokeStyle = '#c8a870'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(27, 17); g.quadraticCurveTo(30, 26, 22, 29); g.stroke(); }, px);
const iconoAnzuelos = px => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(4, 10, 24, 16); g.fillStyle = '#6a4228'; g.fillRect(5, 11, 22, 14); g.fillStyle = '#8a5a34'; g.fillRect(5, 11, 22, 3); g.strokeStyle = '#c8ccd8'; g.lineWidth = 1.5; for (const x of [10, 16, 22]) { g.beginPath(); g.moveTo(x, 15); g.lineTo(x, 21); g.arc(x - 2, 21, 2, 0, Math.PI); g.stroke(); } }, px);
const iconoPescado = px => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(2, 12, 28, 12); g.fillStyle = '#d8c8a0'; g.fillRect(3, 13, 26, 10); for (const [y, c] of [[15, '#8aa0b8'], [19, '#a0b4c8']]) { g.fillStyle = c; g.beginPath(); g.ellipse(14, y + 1, 9, 3, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(22, y + 1); g.lineTo(28, y - 2); g.lineTo(28, y + 4); g.fill(); g.fillStyle = '#1a1210'; g.fillRect(8, y, 1, 1); } }, px);
const iconoCatalejo = px => icono32(g => { const seg = [[4, 26, 7], [10, 20, 6], [16, 14, 5], [22, 8, 4]]; for (const [x, y, r] of seg) { g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(x, y, r + 1, 0, 7); g.fill(); } g.lineCap = 'round'; g.strokeStyle = '#2a1a10'; g.lineWidth = 10; g.beginPath(); g.moveTo(5, 25); g.lineTo(24, 6); g.stroke(); g.strokeStyle = '#c8962e'; g.lineWidth = 7; g.stroke(); g.strokeStyle = '#f0d27a'; g.lineWidth = 2; g.beginPath(); g.moveTo(6, 22); g.lineTo(23, 5); g.stroke();
  g.strokeStyle = '#6a4410'; g.lineWidth = 1.5; for (const k of [.3, .6]) { g.beginPath(); g.moveTo(5 + 19 * k - 3, 25 - 19 * k - 3); g.lineTo(5 + 19 * k + 3, 25 - 19 * k + 3); g.stroke(); } g.fillStyle = '#9fd0f0'; g.beginPath(); g.arc(24.5, 5.5, 2.5, 0, 7); g.fill(); }, px);

// ---------- berries ----------
const berries = () => S.berries || 0;
function cobrar(n) { S.berries = berries() + n; avisoDinero('+' + n); }
function pagar(n) { if (berries() < n) return false; S.berries = berries() - n; avisoDinero('−' + n); return true; }
function avisoDinero(t) { sfx('moneda'); const p = document.querySelector('.purse'); if (!p) return; p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop'); const el = document.createElement('i'); el.className = 'pdelta'; el.textContent = t + ' ฿'; p.appendChild(el); setTimeout(() => el.remove(), 1400); }
const precioArma = a => a.id.startsWith('padre_') || a.id.startsWith('madera_') ? 0 : a.grado !== 'sin' ? { waza: 2000, ryo: 9000, o: 40000, saijo: 200000 }[a.grado] : { daga: 120, garrote: 60 }[a.id] || { comun: 90, oficio: 220, personaje: 600 }[TIPO[a.tipo][1]];
const precioDe = id => OBJETOS[id] ? OBJETOS[id].precio || 0 : arma(id) ? precioArma(arma(id)) : 0;
const vendible = id => !(OBJETOS[id] && OBJETOS[id].noVende) && precioDe(id) > 0 && S.arma !== id;
function comer(id) { const o = OBJETOS[id]; if (!cant(id)) return; S.cant[id]--; if (!S.cant[id]) quitarObjeto(id); S.comido = Math.max(S.comido || 0, o.comida); bubble({ x: G.x, y: G.y, scene: G.scene }, id === 'guiso' ? 'Esto sí que llena.' : 'Mmm. Recién hecho.', 2200); }

// ---------- tiendas ----------
const TIENDAS = {
  gaspar: { n: 'Aparejos Gaspar', vende: ['cuerda', 'anzuelos', 'vendas', 'daga', 'garrote'], compra: true, hola: 'Mira, pero no toques lo que no vayas a pagar.' },
  nell: { n: 'Panadería', vende: ['pan'], hola: '¡Pan del día! Lo demás, mañana.' },
  mara: { n: 'El Ancla Seca', vende: ['guiso'], hola: 'Guiso del día. Lo que haya, no preguntes.' },
  medico: { n: 'Doctor Ansel', vende: ['emulsion', 'vendas'], hola: 'Al precio de coste. Que no se diga.' },
};
let TIENDA = null;
function abrirTienda(id, modo = 'comprar') { G.paused = true; G.keys = {}; TIENDA = { id, modo }; const T0 = TIENDAS[id], ov = document.getElementById('overlays'); ov.querySelector('.tienda-ov') && ov.querySelector('.tienda-ov').remove();
  const el = document.createElement('div'); el.className = 'tienda-ov panelj';
  const filas = modo === 'comprar' ? T0.vende.map(k => { const p = precioDe(k), ya = arma(k) && tiene(k); return `<li><span class="ti" data-ic="${k}"></span><b>${infoObjeto(k).n}</b>${OBJETOS[k] && OBJETOS[k].cuenta && cant(k) ? `<small>Llevas ${cant(k)}</small>` : ''}<span class="pr">${p} ฿</span><button type="button" class="btn sm" data-c="${k}" ${ya || berries() < p ? 'disabled' : ''}>${ya ? 'Ya la tienes' : 'Comprar'}</button></li>`; }).join('')
    : (S.bag || []).filter(vendible).map(k => { const p = Math.max(1, Math.floor(precioDe(k) * .4)); return `<li><span class="ti" data-ic="${k}"></span><b>${infoObjeto(k).n}</b>${OBJETOS[k] && OBJETOS[k].cuenta ? `<small>Llevas ${cant(k)}</small>` : ''}<span class="pr">${p} ฿</span><button type="button" class="btn sm ghost" data-v="${k}" data-p="${p}">Vender</button></li>`; }).join('') || '<li class="vacio">No llevas nada que le interese.</li>';
  el.innerHTML = `<div class="glass book tienda" role="dialog" aria-label="${T0.n}"><div class="tabs top"><button type="button" data-m="comprar" class="${modo === 'comprar' ? 'on' : ''}">Comprar</button>${T0.compra ? `<button type="button" data-m="vender" class="${modo === 'vender' ? 'on' : ''}">Vender</button>` : ''}<span class="bolsa-b"><i></i>${berries()} ฿</span><button type="button" class="x" aria-label="Cerrar">Cerrar ✕</button></div>
    <div class="pbody"><p class="hola">${T0.n} · <i>${T0.hola}</i></p><ul class="lista">${filas}</ul></div></div>`;
  ov.appendChild(el); el.querySelectorAll('[data-ic]').forEach(s => s.appendChild(infoObjeto(s.dataset.ic).icono(48)));
  el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => abrirTienda(id, b.dataset.m)); el.querySelector('.x').onclick = cerrarTienda; el.onclick = e => { if (e.target === el) cerrarTienda(); };
  el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const k = b.dataset.c; if (!pagar(precioDe(k))) return; if (OBJETOS[k] && OBJETOS[k].cuenta) darObjeto(k, true, 1); else darObjeto(k, true); abrirTienda(id, 'comprar'); });
  el.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { const k = b.dataset.v; if (OBJETOS[k] && OBJETOS[k].cuenta) { S.cant[k]--; if (!S.cant[k]) quitarObjeto(k); } else quitarObjeto(k); cobrar(+b.dataset.p); abrirTienda(id, 'vender'); });
  (el.querySelector('button.btn:not([disabled])') || el.querySelector('.tabs .on')).focus();
}
function cerrarTienda() { const el = document.querySelector('.tienda-ov'); el && el.remove(); G.paused = false; TIENDA = null; guardarAuto(); }

// ---------- encargos: se apuntan en el diario y se tachan al cumplirlos ----------
function encargo(titulo, txt) { learn(['encargos', titulo, txt]); }
function encargoHecho(titulo, extra) { const e = DIARY.encargos.find(x => x.title === titulo); if (e && !e.hecho) { e.hecho = true; e.txt += ' ' + (extra || 'Hecho.'); } guardarAuto(); }
