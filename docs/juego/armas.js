// Armas: catálogo, grados, dibujo en el personaje (piezas LPC recoloreadas) e iconos para la bolsa (dibujados por código).
// Los nombres son originales. Los grados son los del mundo, y las armas con grado ocupan solo los huecos que el canon deja sin nombre.
const GRADOS = { saijo: 'Saijō Ō Wazamono', o: 'Ō Wazamono', ryo: 'Ryō Wazamono', waza: 'Wazamono', sin: 'Sin grado' };
const TIPOS = { katana: 'Katana', espada: 'Espada', estoque: 'Estoque', daga: 'Daga', lanza: 'Lanza', hacha: 'Hacha', maza: 'Maza', pistola: 'Pistola', mosquete: 'Mosquete' };
// con qué animación ataca cada tipo; las de fuego se dibujan por código sobre la pose de disparar
const GOLPE_DE = { katana: 'slash', espada: 'slash', estoque: 'slash', daga: 'thrust', lanza: 'thrust', hacha: 'slash', maza: 'slash', pistola: 'shoot', mosquete: 'shoot', punos: 'slash' };
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
  ['shiranami', 'Shiranami', 'katana', 'o', 'acero', '#e8f4ff', 'Ola blanca. Hoja larga, curva suave. Corta la espuma sin mojarse, según los que la vieron.'],
  ['rompemares', 'Rompemares', 'hacha', 'o', 'negra', '#c83a3a', 'Hacha de abordaje de hoja negra. Partió el palo mayor de un galeón de un solo golpe.'],
  ['durgan', 'Durgan', 'espada', 'o', 'oro', '#ffd27a', 'Espada ancha de empuñadura dorada. Sus dueños nunca mueren en la cama.'],
  ['colibri', 'Colibrí', 'estoque', 'ryo', 'plata', null, 'Ligero como una pluma. Pica tres veces antes de que veas la primera.'],
  ['kagero', 'Kagerō', 'katana', 'ryo', 'carmesi', null, 'Hoja de reflejos rojos. Tiembla como el aire caliente cuando se desenvaina.'],
  ['campana', 'Campana de Bronce', 'maza', 'ryo', 'bronce', null, 'Suena al golpear. Los marineros dicen que se oye desde la otra punta del puerto.'],
  ['diente', 'Diente de Sirena', 'daga', 'ryo', 'hueso', null, 'Hoja de hueso blanco, más dura que el acero. Nadie sabe de qué animal salió.'],
  ['arpon_norte', 'Arpón del Norte', 'lanza', 'ryo', 'azul', null, 'Forjado para cazar reyes marinos. Tiene la punta mellada por algo muy grande.'],
  ['nagi', 'Nagi', 'katana', 'waza', 'acero', null, 'Calma chicha. Una katana honrada, sin historia, que no falla.'],
  ['viento_sur', 'Viento Sur', 'espada', 'waza', 'acero', null, 'Espada de oficial retirado. Bien equilibrada, mejor cuidada.'],
  ['lenadora', 'Leñadora', 'hacha', 'waza', 'acero', null, 'Empezó cortando troncos en un astillero y acabó cortando otras cosas.'],
  ['aguja', 'Aguja de Plata', 'estoque', 'waza', 'plata', null, 'Fina como un hilo. Se dobla y no se rompe.'],
  ['escama', 'Escama', 'daga', 'waza', 'verdemar', null, 'Daga corta de hoja verdosa. Cabe en una bota.'],
  ['astillero', 'Martillo de Astillero', 'maza', 'waza', 'acero', null, 'Clavaba quillas. Ahora rompe cascos.'],
  ['sable_marinero', 'Sable de marinero', 'katana', 'sin', 'acero', null, 'Un sable curvo cualquiera, de los que se venden en todos los puertos.'],
  ['espada_ronda', 'Espada de ronda', 'espada', 'sin', 'acero', null, 'La espada reglamentaria de los guardias de puerto.'],
  ['pistola_chispa', 'Pistola de chispa', 'pistola', 'sin', 'acero', null, 'Un tiro y a recargar. Más ruido que puntería.'],
  ['mosquete_marina', 'Mosquete de la Marina', 'mosquete', 'sin', 'acero', null, 'El arma de los marines rasos. Larga, pesada y sorprendentemente precisa.'],
].map(([id, n, tipo, grado, hoja, aura, desc]) => ({ id, n, tipo, grado, hoja, aura, desc }));
// las armas de tu padre: una por tipo, viejas pero buenas
const DEL_PADRE = { katana: 'Marejada', espada: 'Rompeolas', estoque: 'Aguijón', daga: 'Colmillo', lanza: 'Arpón Viejo', hacha: 'Hacha de Proa', maza: 'Ancla de Mano' };
for (const [tipo, n] of Object.entries(DEL_PADRE)) ARMAS.push({ id: 'padre_' + tipo, n, tipo, grado: 'sin', hoja: 'oxido', desc: 'Era de tu padre. Está mellada y la empuñadura huele a sal, pero el filo aguanta.' });
for (const tipo of Object.keys(DEL_PADRE)) ARMAS.push({ id: 'madera_' + tipo, n: TIPOS[tipo] + ' de madera', tipo, grado: 'sin', hoja: 'madera', desc: 'De entrenamiento. Duele igual, pero no corta.' });
const arma = id => ARMAS.find(a => a.id === id);

// ---------- en el personaje ----------
// atlas por tipo (ver herramientas/prep_armas.py): arriba celdas de 64 (caminar 0-3, estocada 4-7, caída 8); abajo el tajo en celdas de 192
const ARMA_IMG = {}, ARMA_TINTE = {};
function atlasArma(tipo, tras) { const k = tipo + (tras ? '_tras' : ''); if (!(k in ARMA_IMG)) { ARMA_IMG[k] = null; loadImg('assets/armas/' + k + '.png').then(i => ARMA_IMG[k] = i, () => {}); } return ARMA_IMG[k]; }
// la hoja (píxeles grises) toma la rampa del arma; la empuñadura conserva su color
function tinte(a, tras) { const k = a.id + (tras ? '_t' : ''); if (ARMA_TINTE[k]) return ARMA_TINTE[k]; const im = atlasArma(a.tipo, tras); if (!im) return null;
  const [c, g] = mkCanvas(im.width, im.height); g.drawImage(im, 0, 0); const id = g.getImageData(0, 0, c.width, c.height), d = id.data, ramp = HOJA[a.hoja].map(h => parseInt(h.slice(1), 16));
  for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const r = d[i], gg = d[i + 1], b = d[i + 2], mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    if (mx > 40 && (mx - mn) / mx < .22) { const v = ramp[Math.min(3, Math.floor((.3 * r + .59 * gg + .11 * b) / 64))]; d[i] = v >> 16 & 255; d[i + 1] = v >> 8 & 255; d[i + 2] = v & 255; }
    else if (a.hoja === 'madera' || a.hoja === 'oxido') { d[i] = d[i] * .8 | 0; d[i + 1] = d[i + 1] * .7 | 0; d[i + 2] = d[i + 2] * .6 | 0; } }
  g.putImageData(id, 0, 0); return ARMA_TINTE[k] = c; }
function drawArma(g, a, x, y, dir, anim, frame, tras) {
  if (a.tipo === 'pistola' || a.tipo === 'mosquete') return tras ? null : drawFuego(g, a, x, y, dir, anim, frame);
  const im = tinte(a, tras); if (!im) return; const r = ROW[dir], f = frame | 0;
  if (anim === 'slash') g.drawImage(im, f * 192, 576 + r * 192, 192, 192, Math.round(x - 96), Math.round(y - 124), 192, 192);
  else { const sy = anim === 'thrust' ? 256 + r * 64 : anim === 'hurt' ? 512 : r * 64, sx = anim === 'walk' || anim === 'thrust' || anim === 'hurt' ? f * 64 : 0;
    g.drawImage(im, sx, sy, 64, 64, Math.round(x - 32), Math.round(y - 60), 64, 64); }
}
// pistola y mosquete: en la cadera al caminar; con el brazo extendido en la pose de disparar (cuadros 4 en adelante)
function drawFuego(g, a, x, y, dir, anim, f) {
  const H = HOJA[a.hoja], largo = a.tipo === 'mosquete' ? 20 : 9, s = dir === 'left' ? -1 : 1;
  g.save(); g.translate(Math.round(x), Math.round(y - 60));
  const arma = (px, py, ang) => { g.save(); g.translate(px, py); g.rotate(ang); g.fillStyle = '#2a1a12'; g.fillRect(-2, -2, largo + 3, 4); g.fillStyle = H[1]; g.fillRect(-1, -1, largo + 1, 2); g.fillStyle = H[3]; g.fillRect(0, -1, largo, 1);
    g.fillStyle = '#6a4228'; g.fillRect(-4, -1, 4, 5); g.fillStyle = '#3a2414'; g.fillRect(-4, 3, 4, 1); g.restore(); };
  if (anim === 'shoot' && f >= 4) {
    if (dir === 'left' || dir === 'right') { const hx = 32 + s * 18, hy = 31; arma(hx, hy, dir === 'left' ? Math.PI : 0);
      if (f >= 6 && f <= 7) { g.fillStyle = '#fff3b0'; g.beginPath(); g.arc(hx + s * (largo + 4), hy, 4, 0, 7); g.fill(); g.fillStyle = '#ff9a3a'; g.beginPath(); g.arc(hx + s * (largo + 6), hy, 2.5, 0, 7); g.fill(); }
      if (f >= 7) { g.fillStyle = 'rgba(220,220,220,.5)'; g.beginPath(); g.arc(hx + s * (largo + 8 + (f - 7) * 3), hy - (f - 7) * 2, 3 + (f - 7), 0, 7); g.fill(); } }
    else if (dir === 'down') { g.fillStyle = '#2a1a12'; g.fillRect(29, 34, 6, 6); g.fillStyle = H[2]; g.fillRect(30, 35, 4, 4); g.fillStyle = '#111'; g.fillRect(31, 36, 2, 2); if (f >= 6 && f <= 7) { g.fillStyle = '#fff3b0'; g.beginPath(); g.arc(32, 41, 5, 0, 7); g.fill(); } }
  } else if (dir !== 'up') arma(dir === 'left' ? 26 : dir === 'right' ? 38 : 40, 42, a.tipo === 'mosquete' ? -1.2 : 1.4);
  g.restore();
}

// ---------- icono (bolsa, avisos) ----------
// dibujado en 32x32 y escalado sin suavizar, para que se vea como el resto del píxel
function iconoArma(a, px = 64) {
  const [c, g] = mkCanvas(32, 32), H = HOJA[a.hoja], O = '#1a1210', wood = ['#3a2414', '#6a4228', '#9a6a3e'];
  if (a.aura) { const gr = g.createRadialGradient(16, 16, 2, 16, 16, 16); gr.addColorStop(0, a.aura + 'aa'); gr.addColorStop(1, a.aura + '00'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); }
  const line = (pts, w, col) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'square'; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); };
  const hoja = (pts, w) => { line(pts, w + 2, O); line(pts, w, H[2]); line(pts.map(([x, y]) => [x - .7, y - .7]), 1, H[3]); };
  const mango = (a0, a1, w = 3) => { line([a0, a1], w + 2, O); line([a0, a1], w, a.tipo === 'katana' ? '#2a2a3a' : wood[1]); if (a.tipo === 'katana') for (let t = .2; t < 1; t += .25) { const x = a0[0] + (a1[0] - a0[0]) * t, y = a0[1] + (a1[1] - a0[1]) * t; g.fillStyle = '#d8d0c0'; g.fillRect(x - 1, y - 1, 2, 2); } };
  const t = a.tipo;
  if (t === 'katana') { mango([5, 27], [11, 21]); g.fillStyle = O; g.beginPath(); g.ellipse(12, 20, 4, 2.5, -.8, 0, 7); g.fill(); g.fillStyle = '#c8a040'; g.beginPath(); g.ellipse(12, 20, 3, 1.6, -.8, 0, 7); g.fill(); hoja([[13, 19], [20, 11], [25, 6], [28, 2]], 2); }
  else if (t === 'espada') { mango([5, 27], [10, 22]); line([[7, 18], [14, 25]], 4, O); line([[7, 18], [14, 25]], 2, '#c8a040'); hoja([[11, 21], [27, 5]], 4); g.fillStyle = '#c8a040'; g.fillRect(3, 27, 3, 3); }
  else if (t === 'estoque') { mango([5, 27], [9, 23], 2); g.strokeStyle = O; g.lineWidth = 3; g.beginPath(); g.arc(10, 22, 4, 0, 7); g.stroke(); g.strokeStyle = H[3]; g.lineWidth = 1.5; g.stroke(); hoja([[12, 20], [29, 3]], 1.5); }
  else if (t === 'daga') { mango([8, 24], [12, 20]); line([[9, 17], [15, 23]], 3, O); line([[9, 17], [15, 23]], 1.5, H[1]); hoja([[13, 19], [22, 10]], 3.5); }
  else if (t === 'lanza') { line([[3, 29], [22, 10]], 4, O); line([[3, 29], [22, 10]], 2, wood[2]); g.fillStyle = O; g.beginPath(); g.moveTo(29, 3); g.lineTo(18, 9); g.lineTo(23, 14); g.closePath(); g.fill(); g.fillStyle = H[2]; g.beginPath(); g.moveTo(28, 4); g.lineTo(19.5, 9.5); g.lineTo(22.5, 12.5); g.closePath(); g.fill(); }
  else if (t === 'hacha') { line([[5, 29], [22, 8]], 4, O); line([[5, 29], [22, 8]], 2, wood[2]); g.fillStyle = O; g.beginPath(); g.moveTo(17, 7); g.quadraticCurveTo(29, 6, 28, 18); g.lineTo(20, 13); g.closePath(); g.fill(); g.fillStyle = H[2]; g.beginPath(); g.moveTo(19, 8); g.quadraticCurveTo(27, 8, 26.5, 16); g.lineTo(21, 12); g.closePath(); g.fill(); g.fillStyle = H[3]; g.fillRect(25, 10, 1, 5); }
  else if (t === 'maza') { line([[5, 29], [19, 13]], 4, O); line([[5, 29], [19, 13]], 2, wood[2]); g.fillStyle = O; g.beginPath(); g.arc(22, 10, 7, 0, 7); g.fill(); g.fillStyle = H[2]; g.beginPath(); g.arc(22, 10, 5.5, 0, 7); g.fill(); g.fillStyle = H[3]; g.fillRect(19, 7, 2, 2); g.fillStyle = H[0]; for (const [dx, dy] of [[-7, 0], [7, 0], [0, -7], [0, 7]]) g.fillRect(22 + dx - 1, 10 + dy - 1, 3, 3); }
  else if (t === 'pistola' || t === 'mosquete') { const L = t === 'mosquete' ? 26 : 16, x0 = t === 'mosquete' ? 3 : 8; g.fillStyle = O; g.fillRect(x0 + 6, 11, L - 4, 5); g.fillStyle = H[2]; g.fillRect(x0 + 7, 12, L - 6, 2); g.fillStyle = H[3]; g.fillRect(x0 + 7, 12, L - 6, 1);
    g.fillStyle = O; g.beginPath(); g.moveTo(x0 + 9, 15); g.lineTo(x0 + 2, 25); g.lineTo(x0 + 7, 26); g.lineTo(x0 + 13, 16); g.fill(); g.fillStyle = wood[2]; g.beginPath(); g.moveTo(x0 + 9, 16); g.lineTo(x0 + 3.5, 24); g.lineTo(x0 + 6.5, 24.5); g.lineTo(x0 + 11.5, 16); g.fill(); g.fillStyle = '#c8a040'; g.fillRect(x0 + 8, 9, 2, 3); }
  const [o, og] = mkCanvas(px, px); og.imageSmoothingEnabled = false; og.drawImage(c, 0, 0, px, px); return o;
}
