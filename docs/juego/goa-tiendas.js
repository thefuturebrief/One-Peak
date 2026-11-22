// Tiendas de Goa: la armería «Hierro y Pólvora» (familias y calidades), la sastrería «La Aguja de Oro» (probador y ropero) y el resto.
// ---------- objetos nuevos ----------
const iconoFarol = p => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(9, 6, 14, 22); g.fillRect(13, 2, 6, 5); g.fillStyle = '#3a3a46'; g.fillRect(10, 7, 12, 20); g.fillStyle = '#ffd860'; g.fillRect(12, 10, 8, 14); g.fillStyle = '#fff6c0'; g.fillRect(14, 13, 3, 7); }, p);
const iconoLona = p => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(4, 9, 24, 16); g.fillStyle = '#e2d6ba'; g.fillRect(5, 10, 22, 14); g.fillStyle = '#c8b898'; for (const y of [14, 19]) g.fillRect(5, y, 22, 1); g.fillStyle = '#8a6a3a'; g.fillRect(24, 10, 3, 14); }, p);
const iconoCarta = p => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(3, 6, 26, 20); g.fillStyle = '#efe2bf'; g.fillRect(4, 7, 24, 18); g.strokeStyle = '#8a5a34'; g.beginPath(); g.moveTo(7, 20); g.lineTo(12, 12); g.lineTo(18, 17); g.lineTo(25, 10); g.stroke(); g.fillStyle = '#c8402e'; g.fillRect(23, 9, 3, 3); g.fillStyle = '#4a6ab0'; g.fillRect(5, 22, 8, 2); }, p);
const iconoFruta = p => icono32(g => { for (const [x, y, c] of [[11, 18, '#c8402e'], [20, 17, '#e8a030'], [15, 11, '#6aa040']]) { g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(x, y, 7, 0, 7); g.fill(); g.fillStyle = c; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.45)'; g.fillRect(x - 3, y - 3, 2, 2); } }, p);
const iconoPerfume = p => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(12, 4, 8, 6); g.beginPath(); g.arc(16, 19, 10, 0, 7); g.fill(); g.fillStyle = '#c8a040'; g.fillRect(13, 5, 6, 4); g.fillStyle = '#c07ae0'; g.beginPath(); g.arc(16, 19, 8, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(11, 14, 3, 4); }, p);
const iconoAnillo = p => icono32(g => { g.strokeStyle = '#2a1a10'; g.lineWidth = 6; g.beginPath(); g.arc(16, 19, 8, 0, 7); g.stroke(); g.strokeStyle = '#e0b850'; g.lineWidth = 3; g.stroke(); g.fillStyle = '#2a1a10'; g.fillRect(12, 4, 8, 8); g.fillStyle = '#5ab0e8'; g.fillRect(13, 5, 6, 6); g.fillStyle = '#fff'; g.fillRect(14, 6, 2, 2); }, p);
const iconoChatarra = p => icono32(g => { for (const [x, y, w, h, c] of [[4, 16, 12, 10, '#8a5a3a'], [14, 10, 14, 8, '#6a6e72'], [10, 20, 16, 7, '#9a7a4a']]) { g.fillStyle = '#2a1a10'; g.fillRect(x - 1, y - 1, w + 2, h + 2); g.fillStyle = c; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x, y, w, 1); } g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(24, 24, 5, 0, 7); g.fill(); g.strokeStyle = '#a8a8a0'; g.lineWidth = 2; g.beginPath(); g.arc(24, 24, 3, 0, 7); g.stroke(); }, p);
const iconoRopa = p => icono32(g => { g.fillStyle = '#2a1a10'; g.beginPath(); g.moveTo(8, 6); g.lineTo(13, 4); g.lineTo(16, 8); g.lineTo(19, 4); g.lineTo(24, 6); g.lineTo(29, 12); g.lineTo(25, 15); g.lineTo(23, 13); g.lineTo(23, 28); g.lineTo(9, 28); g.lineTo(9, 13); g.lineTo(7, 15); g.lineTo(3, 12); g.fill();
  g.fillStyle = '#4a6ab0'; g.beginPath(); g.moveTo(9, 7); g.lineTo(13, 6); g.lineTo(16, 10); g.lineTo(19, 6); g.lineTo(23, 7); g.lineTo(27, 12); g.lineTo(25, 13); g.lineTo(22, 11); g.lineTo(22, 27); g.lineTo(10, 27); g.lineTo(10, 11); g.lineTo(7, 13); g.lineTo(5, 12); g.fill(); g.fillStyle = '#e0b850'; for (const y of [14, 18, 22]) g.fillRect(15, y, 2, 2); }, p);
Object.assign(OBJETOS, {
  farol: { n: 'Farol de mano', precio: 45, desc: 'Un farol de latón con su mecha. Para la bodega, la noche y los callejones.', icono: iconoFarol },
  lona: { n: 'Lona de remiendo', cuenta: true, precio: 30, desc: 'Un metro de lona de vela, de la buena. Tapa un agujero en la vela o en el tejado.', icono: iconoLona },
  carta_east: { n: 'Carta del East Blue', precio: 180, desc: 'La carta impresa de Isolda Mapp, con las rutas mercantes del East Blue. Kalé no está.', icono: iconoCarta },
  fruta: { n: 'Fruta del mercado', cuenta: true, comida: 6, precio: 6, desc: 'Manzanas, naranjas y una pera. Del puesto de la plaza.', acc: ['comer', 'Comer'], icono: iconoFruta },
  perfume: { n: 'Agua de violetas', precio: 220, desc: 'Un frasquito de la perfumería de la Ciudad Alta. Huele a dinero.', icono: iconoPerfume },
  anillo: { n: 'Anillo de aguamarina', precio: 1400, desc: 'Oro y una piedra azul del tamaño de una lenteja. En la Ciudad Alta es una baratija.', icono: iconoAnillo },
  chatarra: { n: 'Cacharro de la Terminal', cuenta: true, precio: 4, desc: 'Un engranaje, una bisagra, un tornillo largo. Algo hará con ello alguien.', icono: iconoChatarra },
  ropero: { n: 'Tu ropa', noVende: true, desc: 'Lo que tienes para ponerte. Te cambias cuando quieras.', acc: ['vestir', 'Cambiarte'], icono: iconoRopa },
});
Object.assign(TIENDAS, {
  armeria: { n: 'Armería Hierro y Pólvora', vende: [], compra: true, abrir: () => abrirArmeria(), hola: 'Mira lo que quieras. Lo que se rompe, se paga.' },
  sastreria: { n: 'La Aguja de Oro', vende: [], abrir: () => abrirSastre('tienda'), hola: '' },
  veleria: { n: 'Velería Teo Lona', vende: ['cuerda', 'lona', 'farol', 'anzuelos'], compra: true, hola: 'Lona, cuerda y luz. Lo demás lo pone el viento.' },
  cartografa: { n: 'Cartografía Mapp', vende: ['carta_east'], hola: 'Cartas de verdad, no garabatos de taberna.' },
  botica: { n: 'Botica del Puerto', vende: ['vendas', 'emulsion'], hola: 'Para lo que duele y para lo que va a doler.' },
  panaderia_goa: { n: 'Panadería del Molino', vende: ['pan'], hola: '¡Del horno al molino y del molino al horno!' },
  ballena: { n: 'La Ballena Varada', vende: ['guiso', 'pan'], hola: 'Guiso del día. Si no te gusta, hay guiso del día.' },
  empeno: { n: 'La Segunda Vida', vende: ['catalejo', 'farol', 'daga__tosca', 'garrote'], compra: true, hola: 'Todo tiene una segunda vida. Y un segundo precio.' },
  joyeria: { n: 'Joyería Oropel', vende: ['anillo'], hola: '(La joyera te mira los zapatos antes que la cara.) ¿Sí?' },
  perfumeria: { n: 'Perfumería Violeta', vende: ['perfume'], hola: 'Un perfume dice quién eres antes de que abras la boca.' },
  mercado_goa: { n: 'Mercado cubierto', vende: ['fruta', 'pan', 'guiso'], hola: '¡Fruta fresca, pan del día, guiso de la abuela!' },
  bram: { n: 'Mercado de chatarra', vende: ['chatarra', 'cuerda', 'farol', 'espada_corta__tosca', 'tirachinas'], compra: true, hola: 'Lo que buscas, lo tengo. Lo que no buscas, también.' },
});
{ const t0 = abrirTienda; abrirTienda = (id, modo = 'comprar') => TIENDAS[id] && TIENDAS[id].abrir && modo === 'comprar' ? TIENDAS[id].abrir() : t0(id, modo); }

// ---------- armería ----------
const FAMILIAS = [['corte', 'Corte'], ['golpe', 'Golpe'], ['asta', 'Asta'], ['distancia', 'A distancia'], ['fuego', 'Fuego']];
const VITRINA = ['viento_sur', 'aguja'];
const DICE_FERRO = { tosca: 'Óxido y mellas. Para empezar, o para tirarla después.', fina: 'Acero pulido, templado dos veces. Esa no te deja tirado.', corriente: 'Acero normal. Hace lo que tiene que hacer.' };
let ARM = { fam: 'corte', dice: null };
function abrirArmeria() { G.paused = true; G.keys = {}; TIENDA = { id: 'armeria', modo: 'comprar' }; const ov = document.getElementById('overlays'); ov.querySelector('.tienda-ov') && ov.querySelector('.tienda-ov').remove();
  const el = document.createElement('div'); el.className = 'tienda-ov panelj';
  const tipos = Object.entries(TIPO).filter(([k, v]) => v[2] === ARM.fam && v[1] !== 'personaje').sort((a, b) => precioArma(arma(a[0])) - precioArma(arma(b[0])));
  const boton = id => { const a = arma(id), p = precioDe(id), ya = tiene(id), cal = a.calidad || 'corriente';
    return `<button type="button" class="cal cal-${cal}" data-c="${id}" ${ya || berries() < p ? 'disabled' : ''} title="${a.n}"><span>${{ tosca: 'Tosca', corriente: 'Corriente', fina: 'Fina' }[cal]}</span><em>${ya ? 'La tienes' : p + ' ฿'}</em></button>`; };
  const filas = tipos.map(([k, [n, gr]]) => `<li class="arm"><span class="ti" data-ic="${k}"></span><b>${n}</b><small>${GRUPOS[gr]}${ARM.fam === 'fuego' ? ' · un solo modelo, el de siempre' : ''}</small>
    <div class="cals">${(TIPO[k][2] === 'fuego' ? [k] : [k + '__tosca', k, k + '__fina']).map(boton).join('')}</div></li>`).join('');
  const vit = VITRINA.map(id => { const a = arma(id), p = precioDe(id), ya = tiene(id); return `<li class="arm vit"><span class="ti" data-ic="${id}"></span><b>${a.n} <span class="grado g-${a.grado}">${GRADOS[a.grado]}</span></b><small>${a.desc}</small>
    <div class="cals"><button type="button" class="cal cal-waza" data-c="${id}" ${ya || berries() < p ? 'disabled' : ''}><span>${TIPOS[a.tipo]}</span><em>${ya ? 'La tienes' : p + ' ฿'}</em></button></div></li>`; }).join('');
  el.innerHTML = `<div class="glass book tienda armeria" role="dialog" aria-label="Armería Hierro y Pólvora"><div class="tabs top"><button type="button" class="on">Comprar</button><button type="button" data-vender>Vender</button><span class="bolsa-b"><i></i>${berries()} ฿</span><button type="button" class="x" aria-label="Cerrar">Cerrar ✕</button></div>
    <div class="pbody"><p class="hola">${ARM.dice || '«Dagoberto Ferro. Tres calidades de cada cosa: la tosca, la corriente y la fina. Lo que pagas es lo que llevas.»'}</p>
    <nav class="sub fams">${FAMILIAS.map(([k, n]) => `<button type="button" data-f="${k}" class="${k === ARM.fam ? 'on' : ''}">${n}</button>`).join('')}</nav>
    <ul class="lista armas">${filas}</ul><div class="kick vt">La vitrina</div><ul class="lista armas">${vit}</ul>
    <p class="nota">Las armas «de personaje» (katana, guadaña, tridente…) y las legendarias no se venden: se encuentran, se ganan o se heredan.</p></div></div>`;
  ov.appendChild(el); el.querySelectorAll('[data-ic]').forEach(s => s.appendChild(iconoArma(arma(s.dataset.ic), 48)));
  const cierra = () => { el.remove(); G.paused = false; TIENDA = null; guardarAuto(); };
  el.querySelector('.x').onclick = cierra; el.onclick = e => { if (e.target === el) cierra(); }; keyHandler = e => { if (e.key === 'Escape') cierra(); };
  el.querySelector('[data-vender]').onclick = () => { el.remove(); abrirTienda('armeria', 'vender'); };
  el.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { ARM.fam = b.dataset.f; ARM.dice = null; abrirArmeria(); });
  el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const id = b.dataset.c, a = arma(id); if (!pagar(precioDe(id))) return; darObjeto(id, true);
    ARM.dice = '«' + (a.grado !== 'sin' ? 'Esa no la vendo a cualquiera. Cuídala.' : DICE_FERRO[a.calidad || 'corriente']) + '»'; abrirArmeria(); });
  (el.querySelector('.fams .on') || el.querySelector('.x')).focus(); }

// ---------- sastrería y ropero ----------
const CATS_SASTRE = [['arriba', 'Camisas'], ['encima', 'Encima'], ['abajo', 'Pantalones'], ['pies', 'Calzado'], ['cabeza', 'Sombreros'], ['accesorio', 'Accesorios']];
// precio y «clase» (lo elegante que es: con 3 o más, la Guardia de la Puerta Real te deja pasar)
const PRENDA = { arriba: { tshirt: [20, 0], longsleeve: [30, 0], sinmangas: [15, 0], nada: [0, -1], formal: [90, 1], abotonada: [60, 0], pico: [45, 0], rebeca: [70, 0], blusa: [120, 1] },
  encima: { nada: [0, 0], chaleco: [80, 0], chaleco_cerrado: [110, 1], levita: [350, 2], chaqueta: [260, 2], tabardo: [150, 0], corse: [300, 2] },
  abajo: { pants: [30, 0], pantaloons: [35, 0], shorts: [20, -1], falda: [60, 0], vestir: [140, 1], rayas: [160, 1] },
  pies: { botas: [60, 0], zapatos: [90, 1], sandalias: [15, -1], descalzo: [0, -2] },
  cabeza: { nada: [0, 0], cinta: [10, 0], panuelo: [25, 0], bandana: [25, -1], tricornio: [180, 0], bicornio: [260, 1], kerchief: [40, -1], bombin: [150, 1], chistera: [400, 2], gorra: [60, 0], pluma: [120, 0], cofia: [90, 1], chambergo: [320, 1] },
  accesorio: { nada: [0, 0], gafas: [120, 0], parche: [30, -1], monoculo: [250, 1], pendientes: [90, 0], guantes: [110, 1], corbata: [70, 1], bufanda: [60, 0] } };
const claseDe = L => ROPA_TODA.reduce((s, k) => s + ((PRENDA[k] || {})[L[k]] || [0, 0])[1], 0);
const vaElegante = () => claseDe(player.look) >= 3;
// lo que tienes: la ropa de casa más lo comprado
const ropero = () => { if (!S.ropero) S.ropero = []; return new Set([...Object.entries(ROPA_INICIAL).flatMap(([k, ids]) => ids.map(i => k + ':' + i)), 'accesorio:nada', ...S.ropero]); };
const DICE_LIS = { chistera: '«La chistera. Media Ciudad Alta te saludará sin saber quién eres.»', levita: '«Una levita como Dios manda. Con eso, la Guardia te abre la puerta.»', corse: '«El corsé de la temporada. No respirarás, pero pasarás.»',
  chaqueta: '«Cuello alto, botones dorados. Muy de la Ciudad Alta.»', parche: '«¿Un parche? ...Bueno. Cada uno sabe lo que esconde.»', bandana: '«Una bandana. Muy de... puerto.»', monoculo: '«El monóculo. Imprescindible para mirar por encima del hombro.»' };
let SAS = null;
function abrirSastre(modo, cat) { G.paused = true; G.keys = {}; const ov = document.getElementById('overlays'); ov.querySelector('.sastre-ov') && ov.querySelector('.sastre-ov').remove();
  if (!SAS || SAS.modo !== modo) SAS = { modo, cat: 'cabeza', prueba: { ...player.look }, dice: null }; if (cat) SAS.cat = cat;
  const L = SAS.prueba, tengo = ropero(), tienda = modo === 'tienda', el = document.createElement('div'); el.className = 'tienda-ov sastre-ov panelj';
  const items = opciones(SAS.cat, L.cuerpo).filter(o => tienda || tengo.has(SAS.cat + ':' + o.id));
  const fila = o => { const k = SAS.cat + ':' + o.id, [p, cl] = (PRENDA[SAS.cat] || {})[o.id] || [0, 0], mio = tengo.has(k), puesto = L[SAS.cat] === o.id;
    return `<button type="button" class="prenda${puesto ? ' on' : ''}" data-i="${o.id}" aria-pressed="${puesto}"><b>${o.n}</b><small>${cl >= 2 ? 'Ciudad Alta' : cl === 1 ? 'Elegante' : cl < 0 ? 'De puerto' : 'Corriente'}</small><em>${mio ? (tienda ? 'Ya la tienes' : '') : p + ' ฿'}</em></button>`; };
  const it = itemOf(SAS.cat, L[SAS.cat]), conColor = it && it.f[L.cuerpo];
  const nuevas = ROPA_TODA.filter(k => !tengo.has(k + ':' + L[k])), total = nuevas.reduce((s, k) => s + ((PRENDA[k] || {})[L[k]] || [0])[0], 0), cambio = ROPA_TODA.some(k => L[k] !== player.look[k] || L[k + 'Color'] !== player.look[k + 'Color']);
  const cl = claseDe(L);
  el.innerHTML = `<div class="glass book tienda sastre" role="dialog" aria-label="${tienda ? 'La Aguja de Oro' : 'Tu ropa'}"><div class="tabs top"><b class="tt">${tienda ? 'La Aguja de Oro' : 'Tu ropa'}</b>${tienda ? `<span class="bolsa-b"><i></i>${berries()} ฿</span>` : ''}<button type="button" class="x" aria-label="Cerrar">Cerrar ✕</button></div>
    <div class="pbody sas"><div class="probador"><canvas id="prob" width="192" height="192" aria-label="Tú, con lo que te pruebas"></canvas><div class="clase"><span>Elegancia</span><i style="--v:${Math.max(0, Math.min(6, cl)) / 6}"></i><small>${cl >= 3 ? 'Pasarías por la Puerta Real' : 'La Guardia te pararía en la Puerta Real'}</small></div></div>
      <div class="sas-r"><p class="hola">${SAS.dice || (tienda ? '«Madame Lis. Pruébate lo que quieras: probar es gratis, llevárselo no.»' : 'Lo que tienes, en el color que quieras.')}</p>
      <nav class="sub">${CATS_SASTRE.map(([k, n]) => `<button type="button" data-cat="${k}" class="${k === SAS.cat ? 'on' : ''}">${n}</button>`).join('')}</nav>
      <div class="prendas">${items.map(fila).join('') || '<p class="vacio">Nada de esto en tu ropero todavía.</p>'}</div>
      ${conColor ? `<div class="sws">${Object.keys(CAT.paletas.cloth).map(c => `<button type="button" class="swt${L[SAS.cat + 'Color'] === c ? ' on' : ''}" data-col="${c}" aria-label="${NOMBRES[c] || c}" title="${NOMBRES[c] || c}" style="background:${muestra('cloth', c)}"></button>`).join('')}</div>` : ''}
      <div class="row fin">${tienda ? `<span class="tot">${nuevas.length ? `${nuevas.length} prenda${nuevas.length > 1 ? 's' : ''} nueva${nuevas.length > 1 ? 's' : ''} · <b>${total} ฿</b>` : 'Nada nuevo'}</span>` : ''}
        <button type="button" class="btn ghost sm" id="deshacer" ${cambio ? '' : 'disabled'}>Como antes</button><button type="button" class="btn sm" id="vale" ${!cambio || berries() < total ? 'disabled' : ''}>${tienda && total ? 'Comprar y ponérmelo' : 'Ponérmelo'}</button></div></div></div></div>`;
  ov.appendChild(el); preview(el.querySelector('#prob'), hojaDe(ajustar({ ...L })));
  const cierra = () => { clearInterval(previewTimer); el.remove(); SAS = null; G.paused = false; guardarAuto(); };
  el.querySelector('.x').onclick = cierra; el.onclick = e => { if (e.target === el) cierra(); }; keyHandler = e => { if (e.key === 'Escape') cierra(); };
  el.querySelectorAll('[data-cat]').forEach(b => b.onclick = () => abrirSastre(modo, b.dataset.cat));
  el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { L[SAS.cat] = b.dataset.i; SAS.dice = tienda && DICE_LIS[b.dataset.i] || null; abrirSastre(modo); });
  el.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { L[SAS.cat + 'Color'] = b.dataset.col; abrirSastre(modo); });
  el.querySelector('#deshacer').onclick = () => { SAS.prueba = { ...player.look }; abrirSastre(modo); };
  el.querySelector('#vale').onclick = () => { if (total && !pagar(total)) return; S.ropero = [...new Set([...(S.ropero || []), ...nuevas.map(k => k + ':' + L[k])])];
    player.look = ajustar({ ...L }); aplicarAspecto(player.look); if (!tiene('ropero')) darObjeto('ropero', false);
    SAS.dice = tienda ? (claseDe(player.look) >= 3 ? '«Así sí. Ahora pareces de aquí arriba.»' : '«Te queda bien. Para la Ciudad Alta te faltaría algo más fino.»') : null; abrirSastre(modo); };
  (el.querySelector('.sub .on') || el.querySelector('.x')).focus(); }

// ---------- interiores: lo que cuelga de las paredes y lo que se ve en cada tienda ----------
const OI = '#1a1210';
const espadaPared = (g, x, y, tipo, hoja) => { const H = HOJA[hoja || 'acero']; g.save(); g.translate(x, y);
  if (tipo === 'lanza') { g.fillStyle = OI; g.fillRect(-2, -2, 4, 46); g.fillStyle = '#8a5a34'; g.fillRect(-1, 6, 2, 40); g.fillStyle = OI; g.beginPath(); g.moveTo(0, -12); g.lineTo(5, 0); g.lineTo(-5, 0); g.fill(); g.fillStyle = H[2]; g.beginPath(); g.moveTo(0, -10); g.lineTo(3, -1); g.lineTo(-3, -1); g.fill(); }
  else if (tipo === 'hacha') { g.fillStyle = OI; g.fillRect(-2, -2, 4, 34); g.fillStyle = '#8a5a34'; g.fillRect(-1, -1, 2, 32); g.fillStyle = OI; g.beginPath(); g.moveTo(1, 0); g.quadraticCurveTo(16, 2, 13, 14); g.lineTo(1, 10); g.fill(); g.fillStyle = H[2]; g.beginPath(); g.moveTo(2, 2); g.quadraticCurveTo(13, 3, 11, 12); g.lineTo(2, 9); g.fill(); }
  else { const L = tipo === 'mandoble' ? 40 : tipo === 'daga' ? 16 : 30, curva = tipo === 'sable' || tipo === 'cimitarra'; g.fillStyle = OI; g.fillRect(-3, -L - 1, 6, L + 2); g.fillStyle = H[2]; g.fillRect(-2, -L, 4, L); g.fillStyle = H[3]; g.fillRect(-2, -L, 1, L);
    if (curva) { g.fillStyle = H[1]; g.fillRect(1, -L, 1, L); } g.fillStyle = OI; g.fillRect(-7, -1, 14, 4); g.fillStyle = '#c8962e'; g.fillRect(-6, 0, 12, 2); g.fillStyle = '#5a3a24'; g.fillRect(-2, 3, 4, 9); g.fillStyle = '#c8962e'; g.fillRect(-2, 12, 4, 3); }
  g.restore(); };
const soporte = (g, x, y, w) => { g.fillStyle = OI; g.fillRect(x - 1, y - 1, w + 2, 6); g.fillStyle = '#6a4228'; g.fillRect(x, y, w, 4); g.fillStyle = '#9a6a3e'; g.fillRect(x, y, w, 1); };
const pieza = (add, fn, key) => add.item({ fn, key });
Object.assign(DECOR, {
  armeria_goa: [{ at: [4.5, 3.2], fn: (g, X, Y, add) => { const wy = Y(2.4) - 2 * T + 10;
    soporte(g, X(.3), wy + 44, 1.9 * T); [['sable', 'acero'], ['espada_corta', 'acero'], ['cimitarra', 'plata'], ['daga', 'oxido']].forEach(([t, h], k) => espadaPared(g, X(.5) + k * 15, wy + 42, t, h));
    soporte(g, X(3), wy + 44, 3 * T); [['mandoble', 'acero'], ['hacha'], ['estoque', 'plata'], ['sable', 'oxido'], ['lanza'], ['espada_corta', 'plata']].forEach(([t, h], k) => espadaPared(g, X(3.2) + k * 16, wy + (t === 'lanza' ? 20 : 42), t, h));
    // escudo con dos pistolas cruzadas: la marca de la casa
    g.fillStyle = OI; g.beginPath(); g.arc(X(8.4), wy + 22, 14, 0, 7); g.fill(); g.fillStyle = '#8a5a34'; g.beginPath(); g.arc(X(8.4), wy + 22, 12, 0, 7); g.fill(); g.fillStyle = '#c8962e'; g.beginPath(); g.arc(X(8.4), wy + 22, 5, 0, 7); g.fill();
    pieza(add, gg => gg.drawImage(armero(), X(.2), Y(4.4) - 40), Y(4.4) + 30); add.block([X(.2), Y(4.4) + 10, 68, 20]);
    pieza(add, gg => { const x = X(8.2), y = Y(4.4); gg.fillStyle = OI; gg.fillRect(x - 15, y - 4, 30, 30); gg.fillStyle = '#6a4228'; gg.fillRect(x - 14, y - 3, 28, 28); gg.fillStyle = '#4a2c18'; for (const yy of [4, 14]) gg.fillRect(x - 14, y + yy, 28, 3);
      for (let k = 0; k < 4; k++) espadaPared(gg, x - 9 + k * 6, y + 2, k % 2 ? 'lanza' : 'sable', 'acero'); }, Y(4.4) + 26); add.block([X(8.2) - 15, Y(4.4) + 4, 30, 22]); } }],
  sastreria: [{ at: [5, 3.2], fn: (g, X, Y, add) => { const wy = Y(2.4) - 2 * T + 10;
    // estantería de telas en rollos
    g.fillStyle = OI; g.fillRect(X(2.6), wy + 2, 3.6 * T + 2, 52); g.fillStyle = '#5a3a24'; g.fillRect(X(2.6) + 1, wy + 3, 3.6 * T, 50);
    ['#b8403a', '#3a6ab0', '#e8c060', '#6a3a8a', '#4a8a5a', '#e8e2d0', '#2a2a32', '#c87a9a', '#8a5a34', '#6aa0c8', '#d8a040', '#a03a5a'].forEach((c, k) => { const px = X(2.7) + (k % 6) * 19, py = wy + 6 + Math.floor(k / 6) * 24; g.fillStyle = OI; g.fillRect(px, py, 17, 20); g.fillStyle = c; g.fillRect(px + 1, py + 1, 15, 18); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(px + 1, py + 1, 15, 2); g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(px + 12, py + 1, 4, 18); });
    // maniquíes con lo último de la temporada
    for (const [mx, col] of [[6.5, '#3a3a6a'], [7.7, '#7a2a4a']]) { const x = X(mx), y = Y(4.6); pieza(add, gg => { gg.fillStyle = OI; gg.fillRect(x - 1, y + 10, 3, 18); gg.fillRect(x - 8, y + 26, 17, 3); gg.beginPath(); gg.ellipse(x, y - 8, 10, 15, 0, 0, 7); gg.fill();
      gg.fillStyle = col; gg.beginPath(); gg.ellipse(x, y - 8, 9, 14, 0, 0, 7); gg.fill(); gg.fillStyle = '#e8c060'; for (const yy of [-16, -10, -4]) gg.fillRect(x - 1, y + yy, 2, 2); gg.fillStyle = '#d8c8a8'; gg.fillRect(x - 3, y - 26, 6, 5); }, y + 28); add.block([x - 10, y + 12, 20, 16]); }
    // espejo de cuerpo entero
    g.fillStyle = OI; g.fillRect(X(.3), Y(3.2) - 4, 22, 58); g.fillStyle = '#c8962e'; g.fillRect(X(.3) + 1, Y(3.2) - 3, 20, 56); g.fillStyle = '#9fc0d8'; g.fillRect(X(.3) + 4, Y(3.2), 14, 50); g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(X(.3) + 6, Y(3.2) + 2, 3, 30); } }],
  taller_sel: [{ at: [4.5, 2.5], fn: (g, X, Y, add) => { const wy = Y(0) - 2 * T + 8;
    for (const [x, w] of [[5.6, 1.6], [7.4, 1.3]]) { g.fillStyle = '#e8dcc0'; g.fillRect(X(x), wy + 4, w * T, 30); g.strokeStyle = '#4a6a9a'; g.lineWidth = 1; g.beginPath(); g.moveTo(X(x) + 4, wy + 26); g.quadraticCurveTo(X(x) + w * T / 2, wy + 34, X(x) + w * T - 4, wy + 20); g.lineTo(X(x) + w * T - 8, wy + 14); g.lineTo(X(x) + 6, wy + 16); g.closePath(); g.stroke(); for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(X(x) + k * w * T / 5, wy + 16); g.lineTo(X(x) + k * w * T / 5, wy + 30); g.stroke(); } }
    // medio casco de muestra en la pared
    g.fillStyle = OI; g.beginPath(); g.moveTo(X(.4), wy + 36); g.lineTo(X(1.9), wy + 36); g.quadraticCurveTo(X(1.8), wy + 50, X(1.1), wy + 52); g.quadraticCurveTo(X(.5), wy + 50, X(.4), wy + 36); g.fill(); g.fillStyle = '#8a5c36'; g.beginPath(); g.moveTo(X(.4) + 2, wy + 37); g.lineTo(X(1.9) - 2, wy + 37); g.quadraticCurveTo(X(1.8) - 2, wy + 49, X(1.1), wy + 50); g.quadraticCurveTo(X(.5) + 2, wy + 49, X(.4) + 2, wy + 37); g.fill();
    // maqueta en la mesa
    pieza(add, gg => { gg.save(); gg.translate(X(2.8), Y(2.2)); gg.scale(.16, .16); if (typeof dibujarBarcoPropio === 'function') dibujarBarcoPropio(gg, barcoDe() || { modelo: 'albatros' }, -180, 0, barcoDe() ? 2 : 0); gg.restore(); }, Y(3.3)); } }],
  ballena: [{ at: [6, 4.5], fn: (g, X, Y) => { const wy = Y(2.8) - 2 * T + 8;
    // la mandíbula de ballena que da nombre a la taberna, sobre la puerta de la bodega
    g.strokeStyle = OI; g.lineWidth = 9; g.beginPath(); g.arc(X(6.5), wy + 46, 40, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); g.strokeStyle = '#efe6d0'; g.lineWidth = 6; g.stroke();
    g.fillStyle = '#7a4a2a'; g.fillRect(X(4.6), wy + 4, 80, 14); g.fillStyle = '#f0d890'; g.font = '700 9px Georgia, serif'; g.textAlign = 'center'; g.fillText('LA BALLENA VARADA', X(4.6) + 40, wy + 14); g.textAlign = 'left'; } }],
});
