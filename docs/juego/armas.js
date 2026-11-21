// Armas: catálogo, grados, dibujo en el personaje (piezas LPC recoloreadas) e iconos para la bolsa (dibujados por código).
// Los nombres son originales. Los grados son los del mundo, y las armas con grado ocupan solo los huecos que el canon deja sin nombre.
const GRADOS = { saijo: 'Saijō Ō Wazamono', o: 'Ō Wazamono', ryo: 'Ryō Wazamono', waza: 'Wazamono', sin: 'Sin grado' };
// tipo: nombre, grupo (comun, oficio, personaje), familia (corte, golpe, asta, distancia, fuego). La pieza LPC se llama igual que el tipo (assets/armas/<tipo>.png)
const TIPO = {
  daga: ['Daga', 'comun', 'corte'], espada_corta: ['Espada corta', 'comun', 'corte'], sable: ['Sable', 'comun', 'corte'], lanza: ['Lanza', 'comun', 'asta'], hacha: ['Hacha de leñador', 'comun', 'golpe'],
  martillo: ['Martillo', 'comun', 'golpe'], garrote: ['Garrote', 'comun', 'golpe'], arco: ['Arco', 'comun', 'distancia'], tirachinas: ['Tirachinas', 'comun', 'distancia'], pistola: ['Pistola', 'comun', 'fuego'], mosquete: ['Mosquete', 'comun', 'fuego'],
  mandoble: ['Mandoble', 'oficio', 'corte'], maza: ['Maza', 'oficio', 'golpe'], cimitarra: ['Cimitarra', 'oficio', 'corte'], estoque: ['Estoque', 'oficio', 'corte'], ballesta: ['Ballesta', 'oficio', 'distancia'], alabarda: ['Alabarda', 'oficio', 'asta'], pico: ['Pico', 'oficio', 'golpe'],
  katana: ['Katana', 'personaje', 'corte'], guadana: ['Guadaña', 'personaje', 'asta'], tridente: ['Tridente', 'personaje', 'asta'], lanza_larga: ['Lanza larga', 'personaje', 'asta'], lanza_dragon: ['Lanza dragón', 'personaje', 'asta'], mangual: ['Mangual', 'personaje', 'golpe'],
  hacha_guerra: ['Hacha de guerra', 'personaje', 'golpe'], mandoble_fino: ['Mandoble fino', 'personaje', 'corte'], latigo: ['Látigo', 'personaje', 'golpe'], bumeran: ['Bumerán', 'personaje', 'distancia'], baston: ['Bastón', 'comun', 'asta'],
};
const TIPOS = Object.fromEntries(Object.entries(TIPO).map(([k, v]) => [k, v[0]]));
const GRUPOS = { comun: 'Común', oficio: 'De oficio', personaje: 'De personaje' };
// las que puedes elegir al empezar: las más distintas entre sí
const INICIALES = ['sable', 'mandoble', 'espada_corta', 'martillo', 'hacha', 'lanza', 'arco', 'daga'];
// hoja de oscuro a claro
const HOJA = {
  acero: ['#2a2e38', '#5c6474', '#9aa4b4', '#e4ecf4'], negra: ['#08080e', '#1a1a24', '#30303c', '#5e5e70'], plata: ['#2c3448', '#6a7898', '#b4c4e0', '#f4f8ff'],
  oro: ['#4a3010', '#8a6420', '#d6a83a', '#fff0a8'], bronce: ['#3a2210', '#7a4a22', '#b8783a', '#e8b878'], carmesi: ['#2a0a10', '#6a1a24', '#b8343e', '#f08a8a'],
  verdemar: ['#0a2a2a', '#1e5a56', '#3a9a8e', '#9ae8d8'], oxido: ['#2a1a12', '#5a3a24', '#8a6a4a', '#c0a080'], madera: ['#3a2414', '#6a4228', '#9a6a3e', '#c8965a'],
  hueso: ['#4a4030', '#8a7a60', '#c8b898', '#f4ecd8'], azul: ['#0c1a3a', '#24407a', '#4a78c8', '#a8c8ff'],
};
// id, nombre, tipo, grado, hoja, aura (color o nada), descripción
const ARMAS = [
  ['tsukikage', 'Tsukikage', 'katana', 'saijo', 'plata', '#8ab4ff', 'Dicen que su filo solo se ve de noche. De día parece una hoja vulgar, y por eso sigue sin dueño.'],
  ['umibozu', 'Umibōzu', 'lanza', 'saijo', 'verdemar', '#5ae0c8', 'Una lanza de asta negra que pesa como un mástil. Quien la empuña dice que oye el mar dentro.'],
  ['shiranami', 'Shiranami', 'sable', 'o', 'acero', '#e8f4ff', 'Ola blanca. Hoja larga, curva suave. Corta la espuma sin mojarse, según los que la vieron.'],
  ['rompemares', 'Rompemares', 'hacha_guerra', 'o', 'negra', '#c83a3a', 'Hacha de abordaje de hoja negra. Partió el palo mayor de un galeón de un solo golpe.'],
  ['durgan', 'Durgan', 'mandoble', 'o', 'oro', '#ffd27a', 'Espada ancha de empuñadura dorada. Sus dueños nunca mueren en la cama.'],
  ['colibri', 'Colibrí', 'estoque', 'ryo', 'plata', null, 'Ligero como una pluma. Pica tres veces antes de que veas la primera.'],
  ['kagero', 'Kagerō', 'katana', 'ryo', 'carmesi', null, 'Hoja de reflejos rojos. Tiembla como el aire caliente cuando se desenvaina.'],
  ['campana', 'Campana de Bronce', 'maza', 'ryo', 'bronce', null, 'Suena al golpear. Los marineros dicen que se oye desde la otra punta del puerto.'],
  ['diente', 'Diente de Sirena', 'daga', 'ryo', 'hueso', null, 'Hoja de hueso blanco, más dura que el acero. Nadie sabe de qué animal salió.'],
  ['arpon_norte', 'Arpón del Norte', 'lanza', 'ryo', 'azul', null, 'Forjado para cazar reyes marinos. Tiene la punta mellada por algo muy grande.'],
  ['nagi', 'Nagi', 'katana', 'waza', 'acero', null, 'Calma chicha. Una katana honrada, sin historia, que no falla.'],
  ['viento_sur', 'Viento Sur', 'espada_corta', 'waza', 'acero', null, 'Espada de oficial retirado. Bien equilibrada, mejor cuidada.'],
  ['lenadora', 'Leñadora', 'hacha', 'waza', 'acero', null, 'Empezó cortando troncos en un astillero y acabó cortando otras cosas.'],
  ['aguja', 'Aguja de Plata', 'estoque', 'waza', 'plata', null, 'Fina como un hilo. Se dobla y no se rompe.'],
  ['escama', 'Escama', 'daga', 'waza', 'verdemar', null, 'Daga corta de hoja verdosa. Cabe en una bota.'],
  ['astillero', 'Martillo de Astillero', 'martillo', 'waza', 'acero', null, 'Clavaba quillas. Ahora rompe cascos.'],
  ['colmillo_negro', 'Colmillo Negro', 'guadana', 'ryo', 'negra', null, 'La guadaña de «Garra» Dorne. La hoja es curva como un garfio y está mellada en tres sitios.'],
  ['remo', 'Remo', 'baston', 'sin', 'madera', null, 'El remo de Brin. Lleva cuarenta años en el agua y un día en la espalda de un pirata.'],
  ['reglamento', 'Espada de reglamento', 'espada_corta', 'sin', null, null, 'La espada corta de los marines rasos. Fea, fiable y sin nombre.'],
].map(([id, n, tipo, grado, hoja, aura, desc]) => ({ id, n, tipo, grado, hoja, aura, desc }));
// las armas de tu padre: una por cada tipo inicial, viejas pero buenas
const DEL_PADRE = { sable: 'Marejada', mandoble: 'Rompeolas', espada_corta: 'Aguja de Proa', martillo: 'Ancla de Mano', hacha: 'Hacha de Proa', lanza: 'Arpón Viejo', arco: 'Arco de Gaviero', daga: 'Colmillo' };
for (const [tipo, n] of Object.entries(DEL_PADRE)) ARMAS.push({ id: 'padre_' + tipo, n, tipo, grado: 'sin', hoja: 'oxido', desc: 'Era de tu padre. Está gastada y huele a sal, pero aguanta.' });
for (const tipo of INICIALES) ARMAS.push({ id: 'madera_' + tipo, n: TIPOS[tipo] + ' de madera', tipo, grado: 'sin', hoja: 'madera', desc: 'De entrenamiento. Duele igual, pero no corta.' });
const DESC_TIPO = { comun: 'Un arma corriente, de las que se venden en cualquier puerto.', oficio: 'Un arma de oficio: hace falta saber usarla.', personaje: 'No es un arma que lleve cualquiera.' };
for (const [tipo, [n, gr]] of Object.entries(TIPO)) if (!ARMAS.some(a => a.id === tipo)) ARMAS.push({ id: tipo, n, tipo, grado: 'sin', hoja: null, desc: DESC_TIPO[gr] });
const arma = id => ARMAS.find(a => a.id === id);

// ---------- en el personaje ----------
// assets/armas/<tipo>.png + armas.json: por animación, delante (f) y detrás (b): [y, celda, cuadros]
let ARMA_MAN = {}; const ARMA_IMG = {}, ARMA_TINTE = {};
const cargarArmas = async () => { try { ARMA_MAN = await (await fetch('assets/armas/armas.json')).json(); } catch (e) { ARMA_MAN = {}; } };
function atlasArma(tipo) { if (!(tipo in ARMA_IMG)) { ARMA_IMG[tipo] = null; loadImg('assets/armas/' + tipo + '.png').then(i => ARMA_IMG[tipo] = i, () => {}); } return ARMA_IMG[tipo]; }
// con qué animación del cuerpo ataca: la que el arma trae
const golpeDe = a => { if (!a) return 'slash'; if (TIPO[a.tipo][2] === 'fuego') return 'shoot'; const m = ARMA_MAN[a.tipo] || {}; return m.slash ? 'slash' : m.thrust ? 'thrust' : m.shoot ? 'shoot' : 'slash'; };
// color propio solo para las que lo tienen: la hoja (gris claro) toma la rampa; la madera tiñe todo
function tinte(a) { const im = atlasArma(a.tipo); if (!im || !a.hoja) return im; const k = a.id; if (ARMA_TINTE[k]) return ARMA_TINTE[k];
  const [c, g] = mkCanvas(im.width, im.height); g.drawImage(im, 0, 0); const id = g.getImageData(0, 0, c.width, c.height), d = id.data, ramp = HOJA[a.hoja].map(h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]), todo = a.hoja === 'madera';
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b), l = (.3 * r + .59 * gg + .11 * b) / 255;
    if (todo || (mx > 70 && (mx - mn) / mx < .16)) { const t = Math.min(2.999, l * 3.2), k0 = Math.floor(t), f = t - k0, A = ramp[k0], B = ramp[k0 + 1]; d[i] = A[0] + (B[0] - A[0]) * f; d[i + 1] = A[1] + (B[1] - A[1]) * f; d[i + 2] = A[2] + (B[2] - A[2]) * f; } }
  g.putImageData(id, 0, 0); return ARMA_TINTE[k] = c; }
function drawArma(g, a, x, y, dir, anim, frame, tras) {
  if (TIPO[a.tipo] && TIPO[a.tipo][2] === 'fuego') return drawFuego(g, a, x, y, dir, anim, frame, tras);
  if (anim === 'hurt') return; const e = (ARMA_MAN[a.tipo] || {})[anim]; if (!e) return; const L = e[tras ? 'b' : 'f']; if (!L) return; const im = tinte(a); if (!im) return;
  const [y0, c, n] = L, f = Math.min(frame | 0, n - 1), off = (c - 64) / 2;
  g.drawImage(im, f * c, y0 + ROW[dir] * c, c, c, Math.round(x - 32 - off), Math.round(y - 60 - off), c, c);
}
// ---------- armas de fuego: un solo diseño de pistola y uno de mosquete, para todos ----------
// Se dibujan una vez (mirando a la derecha) y se colocan en la mano según el cuadro de la animación de disparo.
// La mano adelantada del cuerpo LPC en la pose de disparo (medida en las hojas base): x 50-51, y de 34 a 30 y vuelta a 34.
const MANO_DISP = [[38, 36], [38, 36], [46, 41], [49, 41], [49, 34], [50, 32], [50, 30], [50, 31], [50, 33], [50, 34], [50, 34], [50, 34], [50, 34]];
const FUEGO_SPR = {};
function spriteFuego(tipo, hoja) { const k = tipo + hoja; if (FUEGO_SPR[k]) return FUEGO_SPR[k]; const M = HOJA[hoja || 'acero'], O = '#140c08', W = ['#3a2214', '#6a4024', '#8e5a32', '#b07a48'], B = ['#6a4a14', '#b08a2a', '#e8c860'];
  let c, g, info; const px = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  if (tipo === 'mosquete') { [c, g] = mkCanvas(42, 10); // culata, llave, caja, cañón largo con abrazaderas y baqueta
    px(1, 3, 13, 5, O); px(0, 4, 2, 4, O); px(1, 4, 12, 3, W[1]); px(2, 4, 10, 1, W[2]); px(1, 7, 3, 1, O); px(1, 4, 1, 3, B[1]);   // culata con cantonera
    px(11, 3, 6, 4, O); px(12, 4, 4, 2, M[2]); px(12, 4, 4, 1, M[3]); px(14, 2, 2, 2, O); px(14, 2, 1, 1, M[2]);                    // llave y pedernal
    px(13, 6, 4, 3, O); px(14, 7, 2, 1, B[1]);                                                                                       // guardamonte
    px(16, 4, 16, 3, O); px(16, 5, 15, 1, W[1]); px(16, 4, 15, 1, W[2]);                                                            // caja de madera
    px(15, 2, 27, 3, O); px(16, 3, 25, 1, M[1]); px(16, 3, 25, 1, M[2]); px(16, 3, 24, 1, M[2]); px(17, 3, 22, 1, M[3]);             // cañón
    px(16, 6, 20, 1, '#2a1a10');                                                                                                     // baqueta
    for (const x of [22, 29]) { px(x, 2, 2, 5, O); px(x, 3, 1, 3, B[2]); } px(40, 1, 1, 2, M[3]); px(41, 2, 1, 3, O);              // abrazaderas, mira, boca
    info = { c, mano: [24, 4], boca: [41, 3], atras: 13 }; }
  else { [c, g] = mkCanvas(20, 11); // pistola de chispa: empuñadura curva con pomo, llave, cañón corto
    px(1, 4, 6, 7, O); px(2, 5, 4, 5, W[1]); px(2, 5, 2, 5, W[2]); px(0, 8, 4, 3, O); px(1, 9, 2, 1, B[1]);                     // empuñadura y pomo
    px(5, 2, 5, 5, O); px(6, 3, 3, 3, M[2]); px(6, 3, 3, 1, M[3]); px(7, 1, 2, 2, O);                                               // llave
    px(6, 6, 4, 3, O); px(7, 7, 2, 1, B[1]);                                                                                         // guardamonte
    px(8, 2, 12, 4, O); px(9, 3, 10, 2, M[1]); px(9, 3, 10, 1, M[2]); px(10, 3, 8, 1, M[3]); px(18, 2, 1, 1, M[3]);                 // cañón
    px(8, 5, 6, 1, W[1]);
    info = { c, mano: [3, 5], boca: [19, 4], atras: 0 }; }
  return FUEGO_SPR[k] = info; }
// coloca el arma con la mano en (hx, hy), mirando a la derecha (s = 1) o a la izquierda (s = -1)
function ponFuego(g, sp, hx, hy, s, ang = 0) { g.save(); g.translate(hx, hy); g.scale(s, 1); g.rotate(ang); g.drawImage(sp.c, -sp.mano[0], -sp.mano[1]); g.restore(); }
function fogonazo(g, x, y, s, k) { // k: 0 al disparar, 1 cuando se apaga
  if (k < .5) { const r = 6 * (1 - k * 1.6); g.fillStyle = 'rgba(255,240,170,.95)'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, rr = i % 2 ? r * .45 : r; g.lineTo(x + s * (Math.cos(a) * rr + r * .6), y + Math.sin(a) * rr * .7); } g.fill();
    g.fillStyle = 'rgba(255,150,50,.9)'; g.beginPath(); g.arc(x + s * 2, y, 2.2, 0, 7); g.fill(); }
  for (let i = 0; i < 3; i++) { const kk = Math.max(0, k - i * .12); if (kk <= 0) continue; g.fillStyle = `rgba(225,225,225,${.5 * (1 - kk)})`; g.beginPath(); g.arc(x + s * (4 + kk * 10 + i * 3), y - kk * 8 - i, 2 + kk * 4, 0, 7); g.fill(); } }
// tras: capa de detrás del cuerpo (mosquete colgado a la espalda)
function drawFuego(g, a, x, y, dir, anim, f, tras) {
  const sp = spriteFuego(a.tipo, a.hoja), rifle = a.tipo === 'mosquete', s = dir === 'left' ? -1 : 1, fr = Math.min(12, f | 0);
  g.save(); g.translate(Math.round(x - 32), Math.round(y - 60)); // coordenadas del cuadro de 64 x 64
  if (anim === 'shoot' && !tras) {
    if (dir === 'left' || dir === 'right') { const [mx, my] = MANO_DISP[fr], hx = s > 0 ? mx - 1 : 64 - mx, hy = my + 1, retro = fr === 8 ? 2 : fr === 9 ? 1 : 0, ang = fr < 4 ? .9 - fr * .22 : fr === 8 ? -.12 : fr === 9 ? -.05 : 0;
      ponFuego(g, sp, hx - s * retro, hy, s, ang);
      if (fr >= 8) { const bx = hx + s * (sp.boca[0] - sp.mano[0]), by = hy + (sp.boca[1] - sp.mano[1]) - (fr === 8 ? 2 : 0); fogonazo(g, bx, by, s, (fr - 8) / 5); } }
    else if (dir === 'down' && fr >= 4) { const cx = 27, cy = 33; g.fillStyle = '#140c08'; g.fillRect(cx - 3, cy - 3, 7, rifle ? 8 : 6); g.fillStyle = HOJA[a.hoja || 'acero'][2]; g.fillRect(cx - 2, cy - 2, 5, 4); g.fillStyle = '#050505'; g.beginPath(); g.arc(cx + .5, cy, 1.4, 0, 7); g.fill();
      if (rifle) { g.fillStyle = '#6a4024'; g.fillRect(cx - 2, cy + 2, 5, 3); }
      if (fr >= 8 && fr < 10) { const r = fr === 8 ? 5 : 3; g.fillStyle = 'rgba(255,240,170,.9)'; g.beginPath(); for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2, rr = i % 2 ? r * .4 : r; g.lineTo(cx + .5 + Math.cos(an) * rr, cy + 1 + Math.sin(an) * rr); } g.fill(); } }
  } else if (anim !== 'shoot' && anim !== 'hurt') {
    if (rifle) { // colgado a la espalda, en diagonal; de frente asoma por encima del hombro
      const detras = dir !== 'up'; if (tras === detras) { g.save(); if (dir === 'left' || dir === 'right') { g.translate(32 - s * 10, 32); g.scale(s, 1); g.rotate(-1.75); } else { g.translate(dir === 'up' ? 31 : 30, dir === 'up' ? 33 : 30); g.rotate(dir === 'up' ? -1.1 : -2.25); } g.drawImage(sp.c, -21, -4); g.restore(); } }
    else if (!tras && dir !== 'up') { // pistola en la funda: cuero en la cadera y la culata asomando
      const hx = dir === 'down' ? 39 : 32 - s * 2, hy = 41; g.fillStyle = '#140c08'; g.fillRect(hx - 2, hy - 1, 5, 7); g.fillStyle = '#5a3a20'; g.fillRect(hx - 1, hy, 3, 5); g.fillStyle = '#7a5030'; g.fillRect(hx - 1, hy, 1, 5);
      g.fillStyle = '#140c08'; g.fillRect(hx - 2 + (dir === 'left' ? -1 : 1), hy - 5, 3, 5); g.fillStyle = '#8e5a32'; g.fillRect(hx - 1 + (dir === 'left' ? -1 : 1), hy - 4, 1, 3); }
  }
  g.restore();
}

// ---------- icono (bolsa, avisos) ----------
// dibujado en 32x32 y escalado sin suavizar. Las espadas salen de unos pocos números: largo, ancho, curva y guarda.
const FORMA_ESPADA = { daga: [11, 3, 0, 'cruz'], espada_corta: [15, 3, 0, 'cruz'], sable: [17, 2.6, .35, 'cazoleta'], mandoble: [22, 4, 0, 'cruz'], mandoble_fino: [21, 2.4, 0, 'cruz'], cimitarra: [16, 3.6, .6, 'cruz'], katana: [19, 2, .22, 'tsuba'], estoque: [21, 1.4, 0, 'taza'] };
function iconoArma(a, px = 64) {
  const [c, g] = mkCanvas(32, 32), H = HOJA[a.hoja || 'acero'], O = '#1a1210', wood = ['#3a2414', '#6a4228', '#9a6a3e'], t = a.tipo;
  if (a.aura) { const gr = g.createRadialGradient(16, 16, 2, 16, 16, 16); gr.addColorStop(0, a.aura + 'aa'); gr.addColorStop(1, a.aura + '00'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); }
  const line = (pts, w, col, cap = 'square') => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = cap; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  const palo = (a0, a1, w = 2) => { line([a0, a1], w + 2, O); line([a0, a1], w, wood[2]); };
  const metal = (path, fill = H[2]) => { g.fillStyle = O; path(1.2); g.fill(); g.fillStyle = fill; path(0); g.fill(); };
  if (FORMA_ESPADA[t]) { const [L, W, cur, guard] = FORMA_ESPADA[t], bx = 10, by = 22, ex = bx + L * .72, ey = by - L * .72, cx = (bx + ex) / 2 - cur * 6, cy = (by + ey) / 2 - cur * 6;
    line([[4, 28], [bx - 1, by + 1]], 5, O); line([[4, 28], [bx - 1, by + 1]], 3, t === 'katana' ? '#2a2a3a' : wood[1]); if (t === 'katana') for (const k of [.3, .65]) { g.fillStyle = '#d8d0c0'; g.fillRect(4 + (bx - 5) * k, 28 - (28 - by - 1) * k - 1, 2, 2); }
    g.lineCap = 'round'; g.strokeStyle = O; g.lineWidth = W + 2; g.beginPath(); g.moveTo(bx, by); g.quadraticCurveTo(cx, cy, ex, ey); g.stroke(); g.strokeStyle = H[2]; g.lineWidth = W; g.stroke(); g.strokeStyle = H[3]; g.lineWidth = 1; g.beginPath(); g.moveTo(bx, by - 1); g.quadraticCurveTo(cx - .6, cy - .6, ex - .5, ey - .5); g.stroke();
    if (guard === 'cruz') { line([[bx - 4, by - 4], [bx + 3, by + 3]], 4, O); line([[bx - 4, by - 4], [bx + 3, by + 3]], 2, '#c8a040'); }
    if (guard === 'tsuba') { g.fillStyle = O; g.beginPath(); g.ellipse(bx, by, 3.5, 2.2, -.8, 0, 7); g.fill(); g.fillStyle = '#c8a040'; g.beginPath(); g.ellipse(bx, by, 2.6, 1.4, -.8, 0, 7); g.fill(); }
    if (guard === 'cazoleta' || guard === 'taza') { g.strokeStyle = O; g.lineWidth = 3; g.beginPath(); g.arc(bx - 1, by + 1, guard === 'taza' ? 4 : 3, 0, 7); g.stroke(); g.strokeStyle = '#c8a040'; g.lineWidth = 1.5; g.stroke(); }
    g.fillStyle = '#c8a040'; g.fillRect(3, 27, 3, 3); }
  else if (t === 'hacha' || t === 'hacha_guerra') { palo([5, 29], [21, 9], 2); const d = t === 'hacha_guerra';
    metal(o => { g.beginPath(); g.moveTo(18 - o, 7 - o); g.quadraticCurveTo(29 + o, 6, 28 + o, 18 + o); g.lineTo(20, 13); g.closePath(); if (d) { g.moveTo(17 + o, 9); g.quadraticCurveTo(6 - o, 6, 8 - o, 18 + o); g.lineTo(15, 13); g.closePath(); } }); g.fillStyle = H[3]; g.fillRect(25, 10, 1, 5); }
  else if (t === 'martillo' || t === 'maza' || t === 'pico' || t === 'garrote' || t === 'mangual') { if (t === 'garrote') { line([[5, 29], [23, 9]], 7, O, 'round'); line([[5, 29], [23, 9]], 5, wood[1], 'round'); line([[14, 19], [24, 8]], 7, O, 'round'); line([[14, 19], [24, 8]], 5, wood[2], 'round'); }
    else if (t === 'mangual') { palo([4, 29], [13, 18]); g.strokeStyle = '#6a6878'; g.lineWidth = 1; for (let k = 0; k < 4; k++) g.strokeRect(13 + k * 2.5, 15 - k * 2.5, 2, 2); g.fillStyle = O; g.beginPath(); g.arc(24, 8, 5.5, 0, 7); g.fill(); g.fillStyle = H[1]; g.beginPath(); g.arc(24, 8, 4, 0, 7); g.fill(); g.fillStyle = H[0]; for (const [dx, dy] of [[-6, 0], [6, 0], [0, -6], [0, 6]]) g.fillRect(24 + dx - 1, 8 + dy - 1, 2, 2); }
    else { palo([5, 29], [19, 13]); if (t === 'martillo') metal(o => { g.beginPath(); g.rect(14 - o, 4 - o, 14 + 2 * o, 8 + 2 * o); }); else if (t === 'pico') { line([[11, 6], [20, 9], [29, 6]], 5, O, 'round'); line([[11, 6], [20, 9], [29, 6]], 3, H[2], 'round'); } else { metal(o => { g.beginPath(); g.arc(22, 10, 6.5 + o, 0, 7); }); g.fillStyle = H[0]; for (const [dx, dy] of [[-7, 0], [7, 0], [0, -7], [0, 7]]) g.fillRect(22 + dx - 1, 10 + dy - 1, 3, 3); }
      if (t === 'martillo') { g.fillStyle = H[3]; g.fillRect(15, 5, 12, 1); } } }
  else if (['lanza', 'lanza_larga', 'lanza_dragon', 'tridente', 'alabarda', 'guadana', 'baston'].includes(t)) { palo([3, 30], [24, 9], t === 'baston' ? 2.5 : 2);
    if (t === 'tridente') { for (const [a0, a1] of [[[24, 9], [29, 3]], [[22, 7], [25, 1]], [[26, 11], [31, 7]]]) { line([a0, a1], 4, O); line([a0, a1], 2, H[2]); } }
    else if (t === 'guadana') { g.lineCap = 'round'; g.strokeStyle = O; g.lineWidth = 4.5; g.beginPath(); g.moveTo(24, 9); g.quadraticCurveTo(14, 1, 4, 6); g.stroke(); g.strokeStyle = H[2]; g.lineWidth = 2.5; g.stroke(); }
    else if (t === 'alabarda') { metal(o => { g.beginPath(); g.moveTo(19 - o, 9); g.quadraticCurveTo(19, 18 + o, 27 + o, 15 + o); g.lineTo(23, 11); g.closePath(); }); metal(o => { g.beginPath(); g.moveTo(30 + o, 2 - o); g.lineTo(21 - o, 8); g.lineTo(25, 12 + o); g.closePath(); }); }
    else if (t !== 'baston') metal(o => { g.beginPath(); g.moveTo(30 + o, 2 - o); g.lineTo(20 - o, 8); g.lineTo(24, 13 + o); g.closePath(); }, t === 'lanza_dragon' ? '#c8402e' : H[2]); }
  else if (t === 'arco' || t === 'ballesta') { if (t === 'arco') { g.strokeStyle = O; g.lineWidth = 4; g.beginPath(); g.arc(4, 28, 22, -1.45, -.12); g.stroke(); g.strokeStyle = wood[2]; g.lineWidth = 2; g.stroke(); line([[6, 6], [26, 25]], 1, '#e8e2d0'); line([[9, 24], [27, 6]], 3, O); line([[9, 24], [27, 6]], 1.5, wood[1]); g.fillStyle = H[2]; g.fillRect(25, 5, 3, 3); }
    else { palo([6, 26], [24, 8], 3); g.strokeStyle = O; g.lineWidth = 4; g.beginPath(); g.moveTo(11, 5); g.quadraticCurveTo(20, 9, 26, 19); g.stroke(); g.strokeStyle = H[1]; g.lineWidth = 2; g.stroke(); line([[11, 5], [26, 19]], 1, '#e8e2d0'); } }
  else if (t === 'tirachinas') { line([[13, 30], [15, 18]], 4, O); line([[13, 30], [15, 18]], 2, wood[2]); line([[15, 18], [10, 8]], 4, O); line([[15, 18], [10, 8]], 2, wood[2]); line([[15, 18], [22, 9]], 4, O); line([[15, 18], [22, 9]], 2, wood[2]); line([[10, 8], [16, 14], [22, 9]], 1.2, '#7a4a2a'); }
  else if (t === 'bumeran') { g.lineCap = 'round'; for (const [w, col] of [[6, O], [4, wood[2]]]) { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); g.moveTo(5, 24); g.quadraticCurveTo(10, 8, 16, 9); g.quadraticCurveTo(22, 8, 28, 24); g.stroke(); } }
  else if (t === 'latigo') { line([[4, 29], [9, 23]], 5, O); line([[4, 29], [9, 23]], 3, wood[1]); g.strokeStyle = O; g.lineWidth = 2.5; g.beginPath(); g.moveTo(9, 23); g.bezierCurveTo(30, 18, 2, 6, 27, 4); g.stroke(); g.strokeStyle = '#7a4a2a'; g.lineWidth = 1.2; g.stroke(); }
  else if (t === 'pistola' || t === 'mosquete') { const L = t === 'mosquete' ? 26 : 16, x0 = t === 'mosquete' ? 3 : 8; g.fillStyle = O; g.fillRect(x0 + 6, 11, L - 4, 5); g.fillStyle = H[2]; g.fillRect(x0 + 7, 12, L - 6, 2); g.fillStyle = H[3]; g.fillRect(x0 + 7, 12, L - 6, 1);
    g.fillStyle = O; g.beginPath(); g.moveTo(x0 + 9, 15); g.lineTo(x0 + 2, 25); g.lineTo(x0 + 7, 26); g.lineTo(x0 + 13, 16); g.fill(); g.fillStyle = wood[2]; g.beginPath(); g.moveTo(x0 + 9, 16); g.lineTo(x0 + 3.5, 24); g.lineTo(x0 + 6.5, 24.5); g.lineTo(x0 + 11.5, 16); g.fill(); g.fillStyle = '#c8a040'; g.fillRect(x0 + 8, 9, 2, 3); }
  const [o, og] = mkCanvas(px, px); og.imageSmoothingEnabled = false; og.drawImage(c, 0, 0, px, px); return o;
}
