// Personalización: el personaje se arma con capas LPC recoloreadas según lo que elijas.
// Marla y Corso se componen igual, con tu piel, tus ojos y tu color de pelo.
let CAT;
const LAYER = {};
async function cargarCatalogo() {
  CAT = await (await fetch('assets/lpc/catalogo.json')).json();
  const srcs = new Set([...Object.values(CAT.fijas).flatMap(v => typeof v === 'string' ? [v] : Object.values(v)),
    ...Object.values(CAT.capas).flatMap(l => l.flatMap(o => Object.values(o.f).filter(Boolean))),
    ...Object.values(CAT.familia).flatMap(f => [f.cuerpo, ...f.capas.map(c => c[0])])]);
  await Promise.all([...srcs].map(s => loadImg(s).then(i => LAYER[s] = i)));
}
// cada color de cualquier paleta del material pasa al mismo índice de la paleta elegida
const PALIDX = {}, CAPA = {};
function palIndex(mat) { if (!PALIDX[mat]) { const m = new Map(); for (const k in CAT.paletas[mat]) CAT.paletas[mat][k].forEach((h, i) => { const v = parseInt(h.slice(1), 16); if (!m.has(v)) m.set(v, i); }); PALIDX[mat] = m; } return PALIDX[mat]; }
function capa(src, mat, pal) {
  const key = src + '|' + mat + '|' + pal; if (CAPA[key]) return CAPA[key];
  const [c, g] = mkCanvas(576, 256); g.drawImage(LAYER[src], 0, 0);
  if (mat && mat !== 'none' && pal && CAT.paletas[mat] && CAT.paletas[mat][pal]) {
    const map = palIndex(mat), tgt = CAT.paletas[mat][pal].map(h => parseInt(h.slice(1), 16)), id = g.getImageData(0, 0, 576, 256), d = id.data;
    for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const k = map.get((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]); if (k != null && tgt[k] != null) { const v = tgt[k]; d[i] = v >> 16 & 255; d[i + 1] = v >> 8 & 255; d[i + 2] = v & 255; } }
    g.putImageData(id, 0, 0);
  }
  return CAPA[key] = c;
}
const componer = layers => { const [c, g] = mkCanvas(576, 256); for (const [src, mat, pal] of layers) if (src) g.drawImage(capa(src, mat, pal), 0, 0); return c; };
const LOOK0 = { cuerpo: 'male', rostro: 'male', piel: 'light', ojos: 'brown', pelo: 'messy1', peloColor: 'chestnut', arriba: 'tshirt', arribaColor: 'white', encima: 'chaleco', encimaColor: 'navy', abajo: 'pantaloons', abajoColor: 'tan', pies: 'botas', piesColor: 'brown', cabeza: 'cinta', cabezaColor: 'orange' };
const ROPA = ['arriba', 'encima', 'abajo', 'pies', 'cabeza'];
const itemOf = (cat, id) => CAT.capas[cat].find(o => o.id === id);
const opciones = (cat, cuerpo) => CAT.capas[cat].filter(o => cuerpo in o.f);
function ajustar(L) { for (const k of ROPA) if (!opciones(k, L.cuerpo).some(o => o.id === L[k])) L[k] = opciones(k, L.cuerpo)[0].id; return L; }
function capasDe(L) {
  const b = L.cuerpo, out = [[CAT.fijas.cuerpo[b], 'body', L.piel], [CAT.fijas[`cabeza_${L.rostro}${b === 'teen' ? '_small' : ''}`], 'body', L.piel], [CAT.fijas.ojos, 'eye', L.ojos], [CAT.fijas[L.rostro === 'male' ? 'cejas_gruesas' : 'cejas_finas'], 'hair', L.peloColor]];
  for (const k of ['pies', 'abajo', 'arriba', 'encima']) { const it = itemOf(k, L[k]); if (it && it.f[b]) out.push([it.f[b], 'cloth', L[k + 'Color']]); }
  out.push([itemOf('pelo', L.pelo).f[b], 'hair', L.peloColor]);
  const h = itemOf('cabeza', L.cabeza); if (h && h.f[b]) out.push([h.f[b], 'cloth', L.cabezaColor]);
  return out;
}
const SHEET_CACHE = {};
const hojaDe = L => { const k = JSON.stringify(L); return SHEET_CACHE[k] || (SHEET_CACHE[k] = componer(capasDe(L))); };
function familiaDe(L) {
  const mk = f => componer([[f.cuerpo, 'body', L.piel], ...f.capas.map(([src, mat, pal]) => mat === 'body' ? [src, 'body', L.piel] : mat === 'hair' ? [src, 'hair', L.peloColor] : mat === 'eye' ? [src, 'eye', L.ojos] : [src, mat, pal])]);
  return { madre: mk(CAT.familia.marla), nino: mk(CAT.familia.corso) };
}
function aplicarAspecto(L) { SHEETS.grumete = hojaDe(L); Object.assign(SHEETS, familiaDe(L)); }
// colores con nombre en castellano, para las muestras
const NOMBRES = { light: 'clara', amber: 'ámbar', olive: 'oliva', taupe: 'tostada', bronze: 'bronce', brown: 'morena', black: 'negra', blue: 'azul', green: 'verde', purple: 'violeta', red: 'rojo', orange: 'naranja', yellow: 'amarillo', gray: 'gris', ash: 'ceniza', platinum: 'platino', white: 'blanco', blonde: 'rubio', sandy: 'arena', strawberry: 'fresa', gold: 'dorado', ginger: 'jengibre', carrot: 'zanahoria', redhead: 'pelirrojo', light_brown: 'castaño claro', chestnut: 'castaño', dark_brown: 'castaño oscuro', dark_gray: 'gris oscuro', raven: 'azabache', rose: 'rosa', pink: 'rosa claro', violet: 'lila', navy: 'marino', leather: 'cuero', walnut: 'nogal', tan: 'tostado', maroon: 'granate', lavender: 'lavanda', teal: 'turquesa', bluegray: 'gris azulado', forest: 'bosque', sky: 'cielo', slate: 'pizarra', charcoal: 'carbón' };
const SET = { piel: ['light', 'amber', 'olive', 'taupe', 'bronze', 'brown', 'black'], ojos: ['brown', 'blue', 'green', 'gray', 'orange', 'purple', 'red', 'yellow'] };
const muestra = (mat, key) => { const a = CAT.paletas[mat][key]; return a[Math.min(a.length - 1, Math.floor(a.length * .55))]; };

// ---------- pantalla de creación ----------
function create() {
  const L = player.look = ajustar({ ...(player.look || LOOK0) });
  const tab = player.ccTab || 'aspecto';
  const sw = (field, mat, keys) => `<div class="sws" role="radiogroup" aria-label="${field}">${keys.map(k => `<button type="button" role="radio" class="swt${L[field] === k ? ' on' : ''}" data-f="${field}" data-v="${k}" aria-checked="${L[field] === k}" aria-label="${NOMBRES[k] || k}" title="${NOMBRES[k] || k}" style="background:${muestra(mat, k)}"></button>`).join('')}</div>`;
  const seg = (field, opts) => `<div class="seg" role="radiogroup" aria-label="${field}">${opts.map(([v, n]) => `<button type="button" role="radio" class="${L[field] === v ? 'on' : ''}" aria-checked="${L[field] === v}" data-f="${field}" data-v="${v}">${n}</button>`).join('')}</div>`;
  const pickr = (field, list) => { const i = list.findIndex(o => o.id === L[field]); return `<div class="pk"><button type="button" class="ar" data-f="${field}" data-d="-1" aria-label="Anterior">‹</button><b>${list[i].n}</b><button type="button" class="ar" data-f="${field}" data-d="1" aria-label="Siguiente">›</button></div>`; };
  const ropa = k => { const it = itemOf(k, L[k]), noColor = !it.f[L.cuerpo]; return `<div class="cc-row"><span class="lbl">${{ arriba: 'Arriba', encima: 'Encima', abajo: 'Abajo', pies: 'Pies', cabeza: 'Cabeza' }[k]}</span>${pickr(k, opciones(k, L.cuerpo))}${noColor ? '' : sw(k + 'Color', 'cloth', Object.keys(CAT.paletas.cloth))}</div>`; };
  const nameV = document.getElementById('nm') ? document.getElementById('nm').value : player.name, lastV = document.getElementById('ap') ? document.getElementById('ap').value : player.last;
  const scroll = root.querySelector('.cc-scroll') ? root.querySelector('.cc-scroll').scrollTop : 0;
  show(`<div class="create"><div class="stagebox"><canvas id="pv" width="288" height="288" aria-label="Tu personaje"></canvas><div class="pv-dirs"><button type="button" class="btn ghost sm" id="rnd">Al azar</button></div></div>
    <div class="glass panel cc"><div class="kick">Nueva partida</div><h1 class="t">¿Quién eres?</h1>
    <div class="cc-scroll">
      <div class="cc-names"><label class="f" for="nm">Nombre<input class="name" id="nm" maxlength="16" autocomplete="off" value="${nameV}"></label><label class="f" for="ap">Apellido<input class="name" id="ap" maxlength="16" autocomplete="off" value="${lastV}"></label></div>
      <div class="cc-tabs" role="tablist"><button type="button" role="tab" data-tab="aspecto" aria-selected="${tab === 'aspecto'}">Aspecto</button><button type="button" role="tab" data-tab="ropa" aria-selected="${tab === 'ropa'}">Ropa</button></div>
      ${tab === 'aspecto' ? `<div class="cc-row"><span class="lbl">Cuerpo</span>${seg('cuerpo', CAT.cuerpos)}</div>
      <div class="cc-row"><span class="lbl">Rostro</span>${seg('rostro', [['male', 'Rasgos marcados'], ['female', 'Rasgos suaves']])}</div>
      <div class="cc-row"><span class="lbl">Piel</span>${sw('piel', 'body', SET.piel)}</div>
      <div class="cc-row"><span class="lbl">Ojos</span>${sw('ojos', 'eye', SET.ojos)}</div>
      <div class="cc-row"><span class="lbl">Pelo</span>${pickr('pelo', CAT.capas.pelo)}${sw('peloColor', 'hair', Object.keys(CAT.paletas.hair))}</div>` : ROPA.map(ropa).join('')}
    </div>
    <div class="row"><button class="btn" type="button" id="go">Comenzar</button><button class="btn ghost" type="button" id="back">Volver</button></div></div></div>`);
  root.querySelector('.cc-scroll').scrollTop = scroll;
  preview(document.getElementById('pv'), hojaDe(L));
  const redo = () => { player.name = document.getElementById('nm').value; player.last = document.getElementById('ap').value; create(); };
  root.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { player.ccTab = b.dataset.tab; redo(); root.querySelector('.cc-scroll').scrollTop = 0; });
  root.querySelectorAll('[data-f][data-v]').forEach(b => b.onclick = () => { L[b.dataset.f] = b.dataset.v; ajustar(L); redo(); });
  root.querySelectorAll('.ar').forEach(b => b.onclick = () => { const f = b.dataset.f, list = f === 'pelo' ? CAT.capas.pelo : opciones(f, L.cuerpo), i = list.findIndex(o => o.id === L[f]); L[f] = list[(i + +b.dataset.d + list.length) % list.length].id; redo(); });
  document.getElementById('rnd').onclick = () => { const p = a => a[Math.floor(Math.random() * a.length)]; L.cuerpo = p(CAT.cuerpos)[0]; L.rostro = p(['male', 'female']); L.piel = p(SET.piel); L.ojos = p(SET.ojos); L.pelo = p(CAT.capas.pelo).id; L.peloColor = p(Object.keys(CAT.paletas.hair));
    for (const k of ROPA) { L[k] = p(opciones(k, L.cuerpo)).id; L[k + 'Color'] = p(Object.keys(CAT.paletas.cloth)); } redo(); };
  const stop = () => clearInterval(previewTimer);
  document.getElementById('back').onclick = () => { stop(); menu(); };
  document.getElementById('go').onclick = () => { player.name = document.getElementById('nm').value.trim() || pick(['Ilo', 'Nara', 'Cato', 'Brisa', 'Joel', 'Sira']); player.last = document.getElementById('ap').value.trim() || pick(['Malatesta', 'Varga', 'Salvatierra', 'Brakken']); stop(); aplicarAspecto(L); reset(); question(); };
  keys(e => { if (e.key === 'Escape') { stop(); menu(); } if (e.key === 'Enter') document.getElementById('go').click(); });
}
