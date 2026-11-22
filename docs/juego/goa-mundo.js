// Goa: suelos y objetos propios de la isla (los registra en SUELO_EXTRA y OBJ_EXTRA de mundo.js).
// Ciudad Alta de piedra blanca; Terminal Gris de chatarra, humo y brasas; el barranco con su puente.
const GO = '#1e1a20'; // contorno
const hs = (a, b, s) => hash(a, b, s);
// ---------- suelos ----------
SUELO_EXTRA.push((g, M) => { if (!M.suelos) return;
  for (const s of M.suelos) { const x = s.x * T, y = (s.y ?? 0) * T, w = (s.w || 0) * T, h = (s.h || 0) * T;
    if (s.t === 'losas') { g.fillStyle = '#d6d0c2'; g.fillRect(x, y, w, h); // losas blancas en hileras desfasadas
      for (let py = 0, r = 0; py < h; py += 16, r++) for (let px = (r % 2) * 12 - 12; px < w; px += 24) { const k = hs(px, py, 61); g.fillStyle = k < .3 ? '#cdc6b6' : k < .7 ? '#dcd6c8' : '#e4dfd2'; g.fillRect(x + px + 1, y + py + 1, 22, 14); }
      g.fillStyle = 'rgba(120,110,95,.18)'; for (let py = 0; py < h; py += 16) g.fillRect(x, y + py, w, 1); }
    if (s.t === 'jardin') { for (let ty = 0; ty < h; ty += 32) for (let tx = 0; tx < w; tx += 32) put(g, R.grass[hs(tx, ty, 62) < .7 ? 0 : 1], x + tx, y + ty);
      g.fillStyle = '#cfc6b0'; g.fillRect(x + w / 2 - 24, y, 48, h); g.fillRect(x, y + h / 2 + 6, w, 20); // senderos de grava en cruz
      for (let k = 0; k < 220; k++) { g.fillStyle = k % 2 ? '#bdb39a' : '#e0d8c4'; g.fillRect(x + w / 2 - 22 + hs(k, 1, 63) * 44, y + hs(k, 2, 63) * h, 2, 1); }
      for (const [cx, cy] of [[.22, .28], [.78, .28], [.22, .82], [.78, .82]]) { const px = x + cx * w, py = y + cy * h; // parterres de flores con borde de boj
        g.fillStyle = '#2e5a2a'; g.beginPath(); g.ellipse(px, py, 58, 26, 0, 0, 7); g.fill(); g.fillStyle = '#4a7e3a'; g.beginPath(); g.ellipse(px, py - 2, 54, 22, 0, 0, 7); g.fill();
        for (let k = 0; k < 40; k++) { const a = hs(k, cx * 9, 64) * 7, rr = hs(k, cy * 9, 65); g.fillStyle = ['#e85a6a', '#f4e070', '#f0f0ff', '#c07ae0'][k % 4]; g.fillRect(px + Math.cos(a) * 46 * rr, py + Math.sin(a) * 18 * rr, 3, 3); } } }
    if (s.t === 'plaza') { const quem = s.tono === 'quemada'; g.fillStyle = quem ? 'rgba(30,22,18,.5)' : 'rgba(80,75,70,.3)'; g.fillRect(x - 4, y - 4, w + 8, h + 8);
      const ts = quem ? 14 : 24; for (let py = 0; py < h; py += ts) for (let px = (quem && (py / ts) % 2 ? -7 : 0); px < w; px += ts) { const k = hs(px, py, 66); g.fillStyle = quem ? (k < .4 ? '#6a5a4e' : k < .8 ? '#7a6a5a' : '#5a4c42') : (k < .4 ? '#e6e0d2' : k < .8 ? '#d8d0c0' : '#c8c0ae'); g.fillRect(x + Math.max(0, px) + 1, y + py + 1, ts - 2 + Math.min(0, px), ts - 2); }
      if (!quem) { g.strokeStyle = '#b8ae98'; g.lineWidth = 3; g.strokeRect(x + 8, y + 8, w - 16, h - 16); g.strokeStyle = '#c8a050'; g.lineWidth = 1; g.strokeRect(x + 12, y + 12, w - 24, h - 24); }
      else { const gr = g.createRadialGradient(x + w / 2, y + h / 2, 10, x + w / 2, y + h / 2, w * .6); gr.addColorStop(0, 'rgba(10,6,4,.55)'); gr.addColorStop(1, 'rgba(10,6,4,0)'); g.fillStyle = gr; g.fillRect(x, y, w, h); } }
    if (s.t === 'chatarra') { g.fillStyle = pat(g, R.dirt); g.fillRect(x, y + 24, w, h - 24); for (let px = 0; px < w; px += 12) { const d = 8 + hs(px, 1, 76) * 24; g.fillRect(x + px, y + 24 - d, 12, d); } // borde irregular con el pasto
      g.fillStyle = 'rgba(60,44,34,.38)'; g.fillRect(x, y + 24, w, h - 24); // tierra quemada, aceite y trozos de metal
      for (let k = 0; k < w * h / 900; k++) { const px = x + hs(k, 1, 68) * w, py = y + hs(k, 2, 68) * h, v = hs(k, 3, 68);
        if (v < .08) { g.fillStyle = 'rgba(20,16,14,.28)'; g.beginPath(); g.ellipse(px, py, 8 + v * 120, 4 + v * 40, 0, 0, 7); g.fill(); }
        else if (v < .55) { g.fillStyle = ['#7a5a42', '#6a6e72', '#8a4a2a', '#5a6a5a'][k % 4]; g.fillRect(px, py, 3 + v * 6, 2); g.fillStyle = 'rgba(255,255,255,.2)'; g.fillRect(px, py, 2, 1); }
        else if (v < .62) { g.strokeStyle = 'rgba(150,140,120,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(px, py); g.lineTo(px + 6, py + 3); g.stroke(); }
        else { g.fillStyle = 'rgba(40,30,24,.25)'; g.fillRect(px, py, 2, 2); } } }
    if (s.t === 'muelle_piedra') { g.fillStyle = pat(g, R.stonewall); g.fillRect(x, y, w, h); g.fillStyle = 'rgba(200,190,170,.25)'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x, y + h - 4, w, 4);
      for (let px = 0; px < w; px += 96) { g.fillStyle = '#3a3a40'; g.fillRect(x + px + 40, y + h - 14, 10, 10); g.fillStyle = '#5a5a62'; g.fillRect(x + px + 41, y + h - 14, 8, 3); } } // norays
    if (s.t === 'barranco') { const x0 = s.x * T, x1 = (s.x + s.w) * T, y0 = s.y0 * T, y1 = s.y1 * T, mid = (x0 + x1) / 2;
      const borde = (sg, yy) => mid + sg * (s.w * T / 2) + (hs(Math.floor(yy / 16), sg, 69) - .5) * 14;
      g.beginPath(); for (let yy = y0; yy <= y1; yy += 16) g.lineTo(borde(-1, yy), yy); for (let yy = y1; yy >= y0; yy -= 16) g.lineTo(borde(1, yy), yy); g.closePath();
      const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, '#1a1410'); gr.addColorStop(.5, '#060404'); gr.addColorStop(1, '#1a1410'); g.fillStyle = gr; g.fill();
      g.lineWidth = 6; g.strokeStyle = '#4a4038'; g.stroke(); g.lineWidth = 2; g.strokeStyle = '#7a6e60'; g.stroke();
      for (let yy = y0; yy < y1; yy += 22) for (const sg of [-1, 1]) { g.fillStyle = 'rgba(90,80,70,.8)'; g.fillRect(borde(sg, yy) - sg * 10 - 3, yy + 4, 6, 10); } // rocas de la pared
      for (let k = 0; k < 18; k++) { g.fillStyle = 'rgba(60,110,60,.7)'; g.fillRect(borde(k % 2 ? 1 : -1, k * 140) - 6, k * 140 + 6, 10, 3); } // matas en el borde
      const py = s.puente * T; g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(x0 - 30, py + 16, x1 - x0 + 60, 10);
      g.fillStyle = '#2a1a12'; g.fillRect(x0 - 34, py - 24, x1 - x0 + 68, 48); for (let px = x0 - 32; px < x1 + 32; px += 10) { g.fillStyle = hs(px, 2, 77) < .5 ? '#8a6040' : '#7a5234'; g.fillRect(px, py - 22, 9, 44); g.fillStyle = 'rgba(255,230,190,.15)'; g.fillRect(px, py - 22, 9, 2); }
      for (const yy of [py - 24, py + 20]) { g.fillStyle = '#3a2418'; for (let px = x0 - 34; px <= x1 + 30; px += 24) g.fillRect(px, yy - 2, 6, 8); g.strokeStyle = '#c8a870'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0 - 32, yy); for (let px = x0 - 32; px <= x1 + 32; px += 24) g.quadraticCurveTo(px + 12, yy + 5, px + 24, yy); g.stroke(); }
      WORLD.blocks.push([x0 - 8, y0, x1 - x0 + 16, py - 22 - y0], [x0 - 8, py + 22, x1 - x0 + 16, y1 - py - 22]); } } });

// ---------- objetos ----------
const empuja = (canvas, x, y, key, extra) => WORLD.sprites.push({ canvas, x, y, key, ...extra });
const anima = (x, y, w, h, key, fn) => WORLD.sprites.push({ anim: fn, x, y, w, h, key });
// verja de hierro con pilares de piedra blanca (el jardín del marqués)
OBJ_EXTRA.verja = o => { const x0 = o.x * T, y0 = o.y * T, x1 = (o.x + o.w) * T, y1 = (o.y + o.h) * T, gx0 = (o.puerta - 1.1) * T, gx1 = (o.puerta + 1.1) * T;
  const tramo = len => spr(len + 2, 44, g => { g.fillStyle = GO; g.fillRect(0, 34, len + 2, 6); g.fillStyle = '#d8d2c4'; g.fillRect(1, 35, len, 4);
    for (let px = 3; px < len; px += 6) { g.fillStyle = GO; g.fillRect(px, 6, 3, 30); g.fillStyle = '#3a3a46'; g.fillRect(px + 1, 7, 1, 28); g.fillStyle = '#c8a040'; g.fillRect(px, 3, 3, 4); }
    g.fillStyle = GO; g.fillRect(0, 12, len + 2, 2); g.fillRect(0, 28, len + 2, 2); });
  const pilar = () => spr(16, 58, g => { g.fillStyle = GO; g.fillRect(1, 4, 14, 54); g.fillStyle = '#e8e2d4'; g.fillRect(2, 5, 12, 52); g.fillStyle = '#b8b0a0'; g.fillRect(11, 5, 3, 52); g.fillStyle = GO; g.fillRect(0, 0, 16, 6); g.fillStyle = '#f4efe4'; g.fillRect(1, 1, 14, 4); g.fillStyle = '#c8a040'; g.beginPath(); g.arc(8, 0, 3, 0, 7); g.fill(); });
  for (const [a, b] of [[x0, gx0], [gx1, x1]]) { empuja(tramo(b - a), a, y1 - 40, y1 + 2); WORLD.blocks.push([a, y1 - 8, b - a, 10]); }
  for (const x of [x0, x1]) { for (let y = y0 + 12; y < y1 - 6; y += 14) empuja(spr(6, 40, g => { g.fillStyle = GO; g.fillRect(1, 4, 4, 36); g.fillStyle = '#c8a040'; g.fillRect(1, 0, 4, 5); }), x - 3, y - 36, y + 2); WORLD.blocks.push([x - 5, y0, 10, y1 - y0]); }
  for (const x of [x0, gx0, gx1, x1]) empuja(pilar(), x - 8, y1 - 54, y1 + 4); };
// estatua del rey: mármol sobre pedestal, corona dorada y capa
OBJ_EXTRA.rey = o => { const c = spr(84, 176, g => { const cx = 42;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(cx, 170, 40, 6, 0, 0, 7); g.fill();
  for (const [y, w, h, col] of [[150, 76, 22, '#cfc8b8'], [126, 58, 26, '#ddd6c6']]) { g.fillStyle = GO; g.fillRect(cx - w / 2 - 1, y - 1, w + 2, h + 2); g.fillStyle = col; g.fillRect(cx - w / 2, y, w, h); g.fillStyle = '#f0ebe0'; g.fillRect(cx - w / 2, y, w, 3); g.fillStyle = '#a8a090'; g.fillRect(cx - w / 2, y + h - 3, w, 3); }
  g.fillStyle = '#c8a040'; g.fillRect(cx - 16, 134, 32, 9); g.fillStyle = '#8a6a20'; g.fillRect(cx - 12, 137, 24, 1); g.fillRect(cx - 12, 140, 24, 1);
  const M = ['#9a9488', '#c8c2b4', '#e8e4da', '#fbf8f0'];
  g.fillStyle = GO; g.beginPath(); g.moveTo(cx - 26, 126); g.lineTo(cx - 14, 50); g.lineTo(cx + 14, 50); g.lineTo(cx + 26, 126); g.fill(); // capa
  g.fillStyle = M[1]; g.beginPath(); g.moveTo(cx - 24, 125); g.lineTo(cx - 13, 52); g.lineTo(cx + 13, 52); g.lineTo(cx + 24, 125); g.fill();
  g.fillStyle = M[2]; g.fillRect(cx - 10, 54, 20, 70); g.fillStyle = M[0]; g.fillRect(cx - 24, 118, 48, 7);
  g.fillStyle = M[3]; g.fillRect(cx - 8, 56, 5, 60); g.fillStyle = M[0]; for (const y of [70, 90, 108]) g.fillRect(cx - 10, y, 20, 1);
  g.fillStyle = GO; g.fillRect(cx + 10, 40, 6, 60); g.fillStyle = M[2]; g.fillRect(cx + 11, 41, 4, 58); g.fillStyle = '#c8a040'; g.beginPath(); g.arc(cx + 13, 38, 5, 0, 7); g.fill(); // cetro
  g.fillStyle = GO; g.beginPath(); g.arc(cx, 40, 12, 0, 7); g.fill(); g.fillStyle = M[2]; g.beginPath(); g.arc(cx, 40, 10, 0, 7); g.fill(); g.fillStyle = M[3]; g.fillRect(cx - 6, 34, 4, 6); g.fillStyle = M[0]; g.fillRect(cx - 5, 46, 10, 4); // cabeza y barba
  g.fillStyle = GO; g.fillRect(cx - 11, 24, 22, 9); g.fillStyle = '#e0b850'; g.fillRect(cx - 10, 25, 20, 7); for (const px of [-10, -4, 2, 8]) { g.fillStyle = GO; g.fillRect(cx + px - 1, 18, 4, 8); g.fillStyle = '#f0d070'; g.fillRect(cx + px, 19, 2, 6); }
  g.fillStyle = '#c8402e'; g.fillRect(cx - 2, 27, 3, 3); });
  empuja(c, o.x * T - 42, o.y * T - 150, o.y * T + 20); WORLD.blocks.push([o.x * T - 36, o.y * T, 72, 22]); };
// campanario de piedra con reloj de verdad (las agujas marcan la hora del juego)
OBJ_EXTRA.campanario = o => { const W = 3.4 * T, Hh = 300, bx = o.x * T - W / 2, by = o.y * T;
  const c = spr(W + 20, Hh, g => { const x = 10, top = 40;
    g.fillStyle = GO; g.fillRect(x - 1, top, W + 2, Hh - top); g.fillStyle = pat(g, R.stonewall); g.fillRect(x, top + 1, W, Hh - top - 1); g.fillStyle = 'rgba(240,232,214,.35)'; g.fillRect(x, top + 1, W, Hh - top - 1);
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x + W - 14, top, 14, Hh - top);
    for (const y of [top + 70, top + 150]) { g.fillStyle = '#b8ae98'; g.fillRect(x - 4, y, W + 8, 6); g.fillStyle = GO; g.fillRect(x - 4, y + 6, W + 8, 1); }
    g.fillStyle = '#1a1416'; g.beginPath(); g.moveTo(x + 24, top + 66); g.lineTo(x + 24, top + 30); g.arc(x + W / 2, top + 30, W / 2 - 24, Math.PI, 0); g.lineTo(x + W - 24, top + 66); g.fill(); // arco de la campana
    g.fillStyle = '#c89a40'; g.beginPath(); g.moveTo(x + W / 2 - 14, top + 58); g.quadraticCurveTo(x + W / 2 - 12, top + 26, x + W / 2, top + 24); g.quadraticCurveTo(x + W / 2 + 12, top + 26, x + W / 2 + 14, top + 58); g.fill(); g.fillStyle = '#f0d070'; g.fillRect(x + W / 2 - 9, top + 32, 3, 20);
    g.fillStyle = GO; g.beginPath(); g.moveTo(x - 8, top + 2); g.lineTo(x + W / 2, 0); g.lineTo(x + W + 8, top + 2); g.fill(); g.fillStyle = '#5a7ab0'; g.beginPath(); g.moveTo(x - 5, top); g.lineTo(x + W / 2, 4); g.lineTo(x + W + 5, top); g.fill(); g.fillStyle = '#7a9ad0'; g.beginPath(); g.moveTo(x + W / 2, 4); g.lineTo(x + W / 2 - 4, top); g.lineTo(x + 4, top); g.fill();
    const ccy = top + 112; g.fillStyle = GO; g.beginPath(); g.arc(x + W / 2, ccy, 30, 0, 7); g.fill(); g.fillStyle = '#c8a040'; g.beginPath(); g.arc(x + W / 2, ccy, 28, 0, 7); g.fill(); g.fillStyle = '#f4eedc'; g.beginPath(); g.arc(x + W / 2, ccy, 24, 0, 7); g.fill();
    g.fillStyle = GO; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.fillRect(x + W / 2 + Math.cos(a) * 20 - 1, ccy + Math.sin(a) * 20 - 1, k % 3 ? 2 : 3, k % 3 ? 2 : 3); }
    g.fillStyle = '#2a1a12'; g.fillRect(x + W / 2 - 14, Hh - 50, 28, 50); g.fillStyle = '#5a3a24'; g.fillRect(x + W / 2 - 12, Hh - 48, 24, 48); g.fillStyle = '#c8a040'; g.fillRect(x + W / 2 + 6, Hh - 26, 3, 3);
    for (const y of [top + 180, top + 220]) { g.fillStyle = GO; g.fillRect(x + W / 2 - 5, y, 10, 20); g.fillStyle = '#2a3a4a'; g.fillRect(x + W / 2 - 4, y + 1, 8, 18); } });
  empuja(c, bx - 10, by - Hh, by); WORLD.blocks.push([bx, by - 40, W, 40]);
  WORLD.relojGoa = [o.x * T, by - Hh + 152];
  anima(o.x * T - 30, by - Hh + 122, 60, 60, by + 1, (g, x, y) => { const h = hourNow(), cx = x + 30, cy = y + 30, ah = (h % 12) / 12 * Math.PI * 2 - Math.PI / 2, am = (h % 1) * Math.PI * 2 - Math.PI / 2;
    g.strokeStyle = GO; g.lineCap = 'round'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(ah) * 12, cy + Math.sin(ah) * 12); g.stroke();
    g.lineWidth = 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(am) * 19, cy + Math.sin(am) * 19); g.stroke(); g.lineCap = 'butt'; g.fillStyle = '#c8402e'; g.fillRect(cx - 1, cy - 1, 3, 3); }); };
// molino de viento: las aspas giran con el viento
OBJ_EXTRA.molino = o => { const bx = o.x * T, by = o.y * T;
  empuja(spr(110, 170, g => { const cx = 55; g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(cx, 164, 46, 6, 0, 0, 7); g.fill();
    g.fillStyle = GO; g.beginPath(); g.moveTo(cx - 36, 166); g.lineTo(cx - 22, 50); g.lineTo(cx + 22, 50); g.lineTo(cx + 36, 166); g.fill();
    g.fillStyle = '#ece4d0'; g.beginPath(); g.moveTo(cx - 34, 165); g.lineTo(cx - 21, 52); g.lineTo(cx + 21, 52); g.lineTo(cx + 34, 165); g.fill(); g.fillStyle = '#d0c6ae'; g.beginPath(); g.moveTo(cx + 8, 165); g.lineTo(cx + 6, 52); g.lineTo(cx + 21, 52); g.lineTo(cx + 34, 165); g.fill();
    g.fillStyle = GO; g.beginPath(); g.moveTo(cx - 28, 54); g.quadraticCurveTo(cx, 12, cx + 28, 54); g.fill(); g.fillStyle = '#9a5a34'; g.beginPath(); g.moveTo(cx - 25, 53); g.quadraticCurveTo(cx, 16, cx + 25, 53); g.fill();
    g.fillStyle = '#5a3a24'; g.fillRect(cx - 10, 140, 20, 26); g.fillStyle = GO; g.fillRect(cx - 6, 92, 12, 14); g.fillStyle = '#2a3a4a'; g.fillRect(cx - 5, 93, 10, 12); }), bx - 55, by - 166, by);
  WORLD.blocks.push([bx - 34, by - 30, 68, 32]);
  anima(bx - 80, by - 210, 160, 160, by + 1, (g, x, y, now) => { const cx = x + 80, cy = y + 80, a0 = now / 1600;
    for (let k = 0; k < 4; k++) { const a = a0 + k * Math.PI / 2; g.save(); g.translate(cx, cy); g.rotate(a); g.fillStyle = GO; g.fillRect(-3, -4, 72, 8); g.fillStyle = '#6a4228'; g.fillRect(-2, -3, 70, 6);
      g.fillStyle = 'rgba(30,20,14,.8)'; g.fillRect(16, 3, 52, 18); g.fillStyle = '#efe6cc'; g.fillRect(17, 4, 50, 16); g.fillStyle = 'rgba(120,100,70,.4)'; for (let px = 24; px < 66; px += 9) g.fillRect(px, 4, 1, 16); g.restore(); }
    g.fillStyle = GO; g.beginPath(); g.arc(cx, cy, 7, 0, 7); g.fill(); g.fillStyle = '#c8a040'; g.beginPath(); g.arc(cx, cy, 4, 0, 7); g.fill(); }); };
// lavaderos: pila de piedra con agua que tiembla y ropa a remojo
OBJ_EXTRA.lavadero = o => { const x = o.x * T, y = o.y * T, w = o.w * T, h = o.h * T;
  empuja(spr(w, h + 10, g => { g.fillStyle = GO; g.fillRect(0, 0, w, h + 8); g.fillStyle = '#b8b0a0'; g.fillRect(2, 2, w - 4, h + 4); g.fillStyle = '#d8d0c0'; g.fillRect(2, 2, w - 4, 6);
    g.fillStyle = '#3a6a8a'; g.fillRect(12, 12, w - 24, h - 20); g.fillStyle = 'rgba(160,210,240,.6)'; for (let k = 0; k < 12; k++) g.fillRect(16 + hs(k, 1, 70) * (w - 40), 16 + hs(k, 2, 70) * (h - 30), 10, 1);
    for (let px = 22; px < w - 30; px += 46) { g.fillStyle = '#8a8478'; g.fillRect(px, 8, 22, 6); g.fillStyle = ['#e8e2d0', '#c8402e', '#4a6ab0'][(px / 46 | 0) % 3]; g.fillRect(px + 2, 14, 18, 8); } }), x, y, y + h);
  WORLD.blocks.push([x, y + 4, w, h]); };
// teatro de títeres: retablo con telón y dos muñecos que se pelean
OBJ_EXTRA.titeres = o => { const x = o.x * T, y = o.y * T;
  empuja(spr(80, 100, g => { g.fillStyle = GO; g.fillRect(4, 10, 72, 90); g.fillStyle = '#8a2a2a'; g.fillRect(6, 12, 68, 86); g.fillStyle = '#b8403a'; for (let px = 8; px < 72; px += 8) g.fillRect(px, 52, 4, 46);
    g.fillStyle = '#1a1210'; g.fillRect(14, 22, 52, 28); g.fillStyle = GO; g.fillRect(0, 0, 80, 14); g.fillStyle = '#e8c060'; g.fillRect(2, 2, 76, 10); g.fillStyle = '#8a2a2a'; for (let px = 4; px < 76; px += 10) g.fillRect(px, 4, 5, 6); }), x - 40, y - 100, y);
  WORLD.blocks.push([x - 38, y - 12, 76, 14]);
  anima(x - 26, y - 82, 52, 30, y + 1, (g, px, py, now) => { if (hourNow() < 10 || hourNow() > 19) return; const t = now / 220;
    for (const [dx, col, f] of [[12, '#3a6ab0', 0], [38, '#c8402e', 1.6]]) { const yy = py + 12 + Math.abs(Math.sin(t + f)) * -6, xx = px + dx + Math.sin(t * .7 + f) * 3;
      g.fillStyle = GO; g.fillRect(xx - 5, yy, 10, 16); g.fillStyle = col; g.fillRect(xx - 4, yy + 6, 8, 10); g.fillStyle = '#f0c8a0'; g.fillRect(xx - 3, yy + 1, 6, 5); g.fillStyle = GO; g.fillRect(xx - 1, yy + 3, 1, 1); g.fillRect(xx + 1, yy + 3, 1, 1); } }); };
// grúa de madera del puerto, con su gancho que se balancea
OBJ_EXTRA.grua = o => { const x = o.x * T, y = o.y * T;
  empuja(spr(120, 190, g => { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(14, 182, 46, 6); g.fillStyle = GO; g.fillRect(28, 20, 14, 166); g.fillStyle = '#7a5030'; g.fillRect(30, 22, 10, 164); g.fillStyle = '#9a6a3e'; g.fillRect(30, 22, 3, 164);
    g.fillStyle = GO; g.fillRect(16, 160, 40, 26); g.fillStyle = '#6a4228'; g.fillRect(18, 162, 36, 22); g.fillStyle = '#4a2c18'; g.beginPath(); g.arc(36, 172, 9, 0, 7); g.fill(); g.fillStyle = '#c8b080'; g.beginPath(); g.arc(36, 172, 5, 0, 7); g.fill();
    g.save(); g.translate(35, 26); g.rotate(-.18); g.fillStyle = GO; g.fillRect(0, -6, 86, 12); g.fillStyle = '#7a5030'; g.fillRect(0, -4, 84, 8); g.restore();
    g.strokeStyle = 'rgba(60,40,24,.9)'; g.lineWidth = 1; g.beginPath(); g.moveTo(36, 30); g.lineTo(26, 160); g.stroke(); }), x - 36, y - 186, y);
  WORLD.blocks.push([x - 20, y - 26, 40, 28]);
  anima(x + 60, y - 180, 30, 110, y + 2, (g, px, py, now) => { const sw = Math.sin(now / 1400) * 4, hx = px + 12 + sw, len = 74; g.strokeStyle = 'rgba(40,28,18,.9)'; g.lineWidth = 1; g.beginPath(); g.moveTo(px + 12, py); g.lineTo(hx, py + len); g.stroke();
    g.fillStyle = GO; g.fillRect(hx - 9, py + len, 18, 14); g.fillStyle = '#a8744a'; g.fillRect(hx - 8, py + len + 1, 16, 12); g.fillStyle = '#6a4228'; g.fillRect(hx - 8, py + len + 6, 16, 1); }); };
// chatarra: montana de metal viejo, con humo que sube y alguna brasa
const montana = r => { const W = r * T * 2 + 40, Hh = r * T * 1.5 + 40; return spr(W, Hh, g => { const cx = W / 2, by = Hh - 8;
  g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(cx, by, r * T, r * T * .3, 0, 0, 7); g.fill();
  const pico = (x, w, h) => { g.beginPath(); g.moveTo(x - w, by); g.quadraticCurveTo(x - w * .4, by - h * 1.05, x, by - h); g.quadraticCurveTo(x + w * .4, by - h * 1.05, x + w, by); g.closePath(); };
  pico(cx, r * T, r * T * 1.2); g.fillStyle = GO; g.fill(); pico(cx, r * T - 3, r * T * 1.2 - 3); g.fillStyle = '#4a3a30'; g.fill();
  for (let k = 0; k < r * r * 26; k++) { const a = hs(k, r, 71), d = Math.sqrt(hs(k, 2, 71)), px = cx + (a - .5) * 2 * r * T * d, hy = r * T * 1.2 * (1 - Math.pow(Math.abs(px - cx) / (r * T), 1.6)), py = by - hs(k, 3, 71) * hy;
    const v = hs(k, 4, 71), col = ['#8a5a3a', '#6a6e72', '#9a7a4a', '#5a7a6a', '#7a3a2a', '#a8a8a0', '#3a3a40'][k % 7];
    g.save(); g.translate(px, py); g.rotate(v * 6); g.fillStyle = GO; g.fillRect(-1, -1, 8 + v * 14, 5 + v * 6); g.fillStyle = col; g.fillRect(0, 0, 6 + v * 14, 3 + v * 6); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(0, 0, 6 + v * 14, 1); g.restore();
    if (v > .93) { g.fillStyle = GO; g.beginPath(); g.arc(px, py, 7, 0, 7); g.fill(); g.strokeStyle = '#6a6e72'; g.lineWidth = 2; g.beginPath(); g.arc(px, py, 5, 0, 7); g.stroke(); } } // ruedas
  g.strokeStyle = '#3a3a40'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - r * 6, by - r * T * .8); g.lineTo(cx + r * 9, by - r * T * 1.1); g.stroke(); }); };
OBJ_EXTRA.chatarra = o => { const c = montana(o.r), x = o.x * T, y = o.y * T; empuja(c, x - c.width / 2, y - c.height + 8, y);
  WORLD.blocks.push([x - o.r * T * .8, y - o.r * T * .5, o.r * T * 1.6, o.r * T * .5]); (WORLD.humos = WORLD.humos || []).push([x + o.r * 4, y - o.r * T * 1.1, o.r]); };
// barricada de chapas, ruedas y un tonel: el control de Bram
OBJ_EXTRA.barricada = o => { const x = o.x * T, y = o.y * T;
  empuja(spr(70, 46, g => { g.fillStyle = GO; g.fillRect(2, 14, 66, 30); for (let k = 0; k < 6; k++) { g.fillStyle = ['#8a5a3a', '#6a6e72', '#5a7a6a', '#9a7a4a', '#7a3a2a', '#6a6e72'][k]; g.save(); g.translate(6 + k * 11, 30); g.rotate((hs(k, 1, 72) - .5) * .5); g.fillRect(-5, -16, 10, 28); g.restore(); }
    g.fillStyle = GO; g.beginPath(); g.arc(56, 30, 12, 0, 7); g.fill(); g.strokeStyle = '#3a3a40'; g.lineWidth = 3; g.beginPath(); g.arc(56, 30, 9, 0, 7); g.stroke(); g.fillStyle = '#c8b050'; g.fillRect(4, 20, 30, 4); g.fillStyle = GO; for (let px = 6; px < 34; px += 6) g.fillRect(px, 20, 3, 4); }), x - 35, y - 44, y);
  WORLD.blocks.push([x - 34, y - 14, 68, 16]); };
// Memorial del Fuego: el mástil quemado de un barco, con cintas y velas encendidas
OBJ_EXTRA.memorial = o => { const x = o.x * T, y = o.y * T; WORLD.lamps.push([x, y + 34]);
  empuja(spr(90, 150, g => { const cx = 45; g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(cx, 144, 40, 7, 0, 0, 7); g.fill();
    for (let k = 0; k < 9; k++) { g.fillStyle = GO; g.fillRect(6 + k * 9, 132 + (k % 2) * 3, 9, 10); g.fillStyle = '#5a5a5e'; g.fillRect(7 + k * 9, 133 + (k % 2) * 3, 7, 8); } // corro de piedras
    g.fillStyle = GO; g.fillRect(cx - 7, 8, 14, 130); g.fillStyle = '#2a1e18'; g.fillRect(cx - 6, 9, 12, 128); g.fillStyle = '#4a3428'; g.fillRect(cx - 5, 9, 3, 128);
    for (let k = 0; k < 14; k++) { g.fillStyle = hs(k, 1, 73) < .5 ? '#0e0a08' : '#6a3a20'; g.fillRect(cx - 6 + hs(k, 2, 73) * 10, 14 + hs(k, 3, 73) * 120, 3, 4); }
    g.fillStyle = GO; g.fillRect(cx - 30, 30, 60, 8); g.fillStyle = '#2a1e18'; g.fillRect(cx - 29, 31, 58, 6); // verga partida
    for (let k = 0; k < 7; k++) { const px = cx - 26 + k * 9, col = ['#c8402e', '#e8c060', '#4a8ab0', '#e8e2d0', '#6a9a4a', '#c07ae0', '#e88a3a'][k]; g.fillStyle = col; g.beginPath(); g.moveTo(px, 37); g.lineTo(px + 4, 37); g.lineTo(px + 2 + Math.sin(k) * 4, 70 + (k % 3) * 9); g.lineTo(px - 2, 64 + (k % 3) * 9); g.fill(); }
    g.fillStyle = '#e8dcc0'; g.fillRect(cx - 14, 96, 28, 18); g.fillStyle = GO; g.fillRect(cx - 14, 96, 28, 1); for (const yy of [101, 105, 109]) g.fillRect(cx - 10, yy, 20, 1); }), x - 45, y - 146, y);
  WORLD.blocks.push([x - 36, y - 16, 72, 18]);
  anima(x - 40, y - 30, 80, 30, y + 2, (g, px, py, now) => { for (let k = 0; k < 6; k++) { const vx = px + 6 + k * 13, vy = py + 18 + (k % 2) * 4, fl = Math.sin(now / 90 + k * 2) > 0 ? 1 : 0;
    g.fillStyle = '#f0ead8'; g.fillRect(vx, vy, 4, 8); g.fillStyle = fl ? '#ffd860' : '#ffb040'; g.fillRect(vx + 1, vy - 4 - fl, 2, 4 + fl); g.fillStyle = 'rgba(255,200,90,.25)'; g.beginPath(); g.arc(vx + 2, vy - 2, 6, 0, 7); g.fill(); } }); };
// puestos del mercado de chatarra: lonas de colores remendadas y cacharros
OBJ_EXTRA.puestos_chatarra = o => { for (let i = 0; i < 3; i++) { const x = (o.x + i * 3) * T, y = o.y * T, col = ['#4a8a6a', '#c88a3a', '#8a4a8a'][i];
  empuja(spr(84, 72, g => { g.fillStyle = '#3a2a1e'; g.fillRect(4, 18, 4, 52); g.fillRect(74, 18, 4, 52); g.fillStyle = GO; g.fillRect(6, 40, 72, 30); g.fillStyle = '#6a5a4a'; g.fillRect(7, 41, 70, 28);
    for (let k = 0; k < 9; k++) { g.fillStyle = ['#a8a8a0', '#8a5a3a', '#c8a040', '#6a6e72', '#4a6ab0'][(k + i) % 5]; g.fillRect(10 + k * 7, 34 + (k % 3) * 2, 6, 7); g.fillStyle = GO; g.fillRect(10 + k * 7, 41, 6, 1); }
    for (let k = 0; k < 10; k++) { g.fillStyle = k % 3 === 2 ? '#d8c8a0' : col; g.fillRect(k * 8 + 2, 6 + (k % 2), 8, 16); } g.strokeStyle = GO; g.strokeRect(2.5, 6.5, 79, 16); g.fillStyle = '#e8d8b0'; g.fillRect(30, 9, 9, 7); }), x, y, y + 70);
  WORLD.blocks.push([x + 4, y + 40, 76, 30]); } };
// el fuerte de los Gorriones: tablas y toneles sobre pilotes, con bandera de trapo
OBJ_EXTRA.fuerte = o => { const x = o.x * T, y = o.y * T;
  empuja(spr(110, 140, g => { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(10, 132, 90, 6); for (const px of [16, 50, 88]) { g.fillStyle = GO; g.fillRect(px, 60, 8, 76); g.fillStyle = '#6a4228'; g.fillRect(px + 1, 60, 5, 76); }
    g.fillStyle = GO; g.fillRect(8, 40, 94, 28); for (let k = 0; k < 11; k++) { g.fillStyle = ['#8a6a4a', '#7a5a3a', '#9a7a5a', '#6a6e72', '#8a5a3a'][k % 5]; g.fillRect(10 + k * 8.4, 42, 7.4, 24); }
    g.fillStyle = GO; g.beginPath(); g.moveTo(4, 42); g.lineTo(55, 12); g.lineTo(106, 42); g.fill(); g.fillStyle = '#5a7a6a'; g.beginPath(); g.moveTo(9, 40); g.lineTo(55, 15); g.lineTo(101, 40); g.fill(); g.fillStyle = '#c8402e'; g.fillRect(30, 26, 12, 10); g.fillStyle = '#e8c060'; g.fillRect(66, 28, 10, 8);
    g.fillStyle = '#1a1210'; g.fillRect(46, 48, 16, 18); g.strokeStyle = '#6a4228'; g.lineWidth = 2; for (let yy = 70; yy < 132; yy += 10) { g.beginPath(); g.moveTo(66, yy); g.lineTo(78, yy); g.stroke(); } g.fillStyle = GO; g.fillRect(65, 66, 2, 66); g.fillRect(78, 66, 2, 66);
    g.fillStyle = GO; g.fillRect(54, 0, 2, 16); }), x - 55, y - 136, y);
  WORLD.blocks.push([x - 44, y - 16, 88, 18]);
  anima(x, y - 136, 30, 16, y, (g, px, py, now) => { g.fillStyle = '#e8e2d0'; g.beginPath(); g.moveTo(px + 1, py); for (let k = 0; k <= 18; k += 3) g.lineTo(px + 1 + k, py + 2 + Math.sin(now / 160 + k / 3) * 2); for (let k = 18; k >= 0; k -= 3) g.lineTo(px + 1 + k, py + 10 + Math.sin(now / 160 + k / 3) * 2); g.fill(); g.fillStyle = '#1a1a1a'; g.fillRect(px + 7, py + 4 + Math.sin(now / 160 + 2) * 2, 5, 4); }); };
// hoguera en un bidón: fuego vivo, chispas y luz de noche
OBJ_EXTRA.hoguera = o => { const x = o.x * T, y = o.y * T; (WORLD.hogueras = WORLD.hogueras || []).push([x, y - 26]); WORLD.lamps.push([x, y + 22]);
  empuja(spr(30, 34, g => { g.fillStyle = GO; g.fillRect(3, 6, 24, 28); g.fillStyle = '#5a4a40'; g.fillRect(4, 7, 22, 26); g.fillStyle = '#7a3a2a'; g.fillRect(4, 14, 22, 3); g.fillRect(4, 25, 22, 3); g.fillStyle = '#8a7a70'; g.fillRect(5, 7, 3, 26); g.fillStyle = '#1a0e08'; g.fillRect(4, 5, 22, 4); }), x - 15, y - 32, y);
  WORLD.blocks.push([x - 12, y - 10, 24, 12]);
  anima(x - 20, y - 70, 40, 44, y + 1, (g, px, py, now) => { const k = Math.floor(now / 90);
    for (let i = 0; i < 5; i++) { const fx = px + 10 + i * 4 + (hs(k, i, 74) - .5) * 3, fh = 10 + hs(k, i, 75) * 14; g.fillStyle = i % 2 ? '#ff9a30' : '#ffcc50'; g.fillRect(fx, py + 40 - fh, 4, fh); g.fillStyle = '#fff2b0'; g.fillRect(fx + 1, py + 40 - fh * .5, 2, fh * .5); }
    for (let i = 0; i < 3; i++) { const t = ((now / 900) + i / 3) % 1; g.fillStyle = `rgba(255,${180 - t * 120},60,${1 - t})`; g.fillRect(px + 20 + Math.sin(t * 9 + i) * 8, py + 30 - t * 40, 2, 2); } }); };
// la grada del astillero: rampa al mar, cuadernas del barco a medio hacer y andamios
OBJ_EXTRA.gradagoa = o => { const x = o.x * T, y = o.y * T, w = o.w * T, h = o.h * T; WORLD.grada = [x, y, w, h];
  empuja(spr(w + 20, h + 90, g => { g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(14, 10, w, h);
    g.fillStyle = GO; g.fillRect(10, 0, w, h); g.fillStyle = pat(g, R.planks); g.fillRect(12, 2, w - 4, h - 4); g.fillStyle = 'rgba(0,0,0,.18)'; for (let px = 12; px < w; px += 32) g.fillRect(px, 2, 2, h - 4);
    for (let k = 0; k < 6; k++) { const px = 30 + k * (w - 60) / 5; g.fillStyle = GO; g.fillRect(px - 1, 0, 12, h + 86); g.fillStyle = '#5a3a22'; g.fillRect(px, 0, 10, h + 86); g.fillStyle = '#8a6040'; g.fillRect(px, 0, 3, h + 86); // vigas que bajan al agua
      g.fillStyle = 'rgba(40,30,20,.5)'; g.fillRect(px - 1, h + 60, 12, 26); }
    g.fillStyle = 'rgba(255,240,200,.3)'; for (let k = 0; k < 50; k++) g.fillRect(12 + hs(k, 1, 78) * (w - 20), 4 + hs(k, 2, 78) * (h - 8), 3, 1); }), x - 10, y, y);
  WORLD.blocks.push([x - 8, y + T, w + 16, h - T]);
  anima(x - 40, y - 200, w + 120, h + 210, y + h - 4, (g, px, py, now) => typeof dibujarGrada === 'function' && dibujarGrada(g, px + 40, py + 200, w, h, now)); };
// puestos del mercado de Goa: cada uno con su género bajo el toldo
const GENERO_PUESTO = { fruta: ['#c8402e', '#e8a030', '#6aa040', '#e8d050'], verdura: ['#5a9a3a', '#8ac050', '#c86a3a', '#e8e0c0'], pescado: ['#8aa0b8', '#a0b4c8', '#c8d4e0', '#6a8098'],
  telas: ['#b8403a', '#3a6ab0', '#e8c060', '#6a3a8a'], especias: ['#c8702a', '#e8c040', '#8a3a2a', '#d89050'], cacharros: ['#a8744a', '#8a5a3a', '#c89060', '#e8d8b8'],
  flores: ['#e85a8a', '#f0f0ff', '#e8d050', '#c07ae0'], pan: ['#c88a3a', '#e8b86a', '#a8682a', '#f0d890'], quesos: ['#f0d870', '#e8c050', '#d8b040', '#f8ecb0'] };
OBJ_EXTRA.puesto = o => { const x = o.x * T, y = o.y * T, gen = GENERO_PUESTO[o.g] || GENERO_PUESTO.fruta, col = ['#c8402e', '#2f78b7', '#d39418', '#3a8a5a', '#8a3a8a'][o.i % 5];
  empuja(spr(80, 72, g => { g.fillStyle = '#5a3a22'; g.fillRect(4, 18, 4, 52); g.fillRect(70, 18, 4, 52); g.fillStyle = GO; g.fillRect(6, 38, 66, 32); put(g, R.crate, 8, 38); put(g, R.crate, 40, 38);
    for (let k = 0; k < 16; k++) { const px = 10 + (k % 8) * 7.6, py = 33 + Math.floor(k / 8) * 5 + (k % 2); g.fillStyle = GO; g.fillRect(px - 1, py - 1, 7, 6);
      g.fillStyle = gen[k % 4]; if (o.g === 'telas') g.fillRect(px, py - 2, 6, 6); else if (o.g === 'pescado') { g.fillRect(px - 2, py + 1, 9, 3); } else { g.beginPath(); g.arc(px + 2.5, py + 2, 3, 0, 7); g.fill(); } g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(px + 1, py, 2, 1); }
    if (o.g === 'flores' || o.g === 'telas') for (let k = 0; k < 4; k++) { g.fillStyle = gen[k]; g.fillRect(12 + k * 16, 22, 6, 12); }
    for (let k = 0; k < 9; k++) { g.fillStyle = k % 2 ? '#f4ecd8' : col; g.fillRect(k * 8 + 4, 6, 8, 16); } g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(4, 20, 72, 2); g.strokeStyle = '#2a1a12'; g.strokeRect(4.5, 6.5, 71, 15); }), x, y, y + 70);
  WORLD.blocks.push([x + 4, y + 40, 70, 30]); };
OBJ_EXTRA.cartel = o => { const x = o.x * T, y = o.y * T; empuja(spr(70, 70, g => { g.fillStyle = GO; g.fillRect(32, 10, 6, 60); g.fillStyle = '#6a4228'; g.fillRect(33, 10, 4, 60);
  for (const [yy, dir] of [[12, 1], [32, -1]]) { g.fillStyle = GO; g.beginPath(); g.moveTo(35 - dir * 30, yy); g.lineTo(35 + dir * 26, yy); g.lineTo(35 + dir * 34, yy + 8); g.lineTo(35 + dir * 26, yy + 16); g.lineTo(35 - dir * 30, yy + 16); g.fill();
    g.fillStyle = '#c8a070'; g.beginPath(); g.moveTo(35 - dir * 29, yy + 1); g.lineTo(35 + dir * 25, yy + 1); g.lineTo(35 + dir * 32, yy + 8); g.lineTo(35 + dir * 25, yy + 15); g.lineTo(35 - dir * 29, yy + 15); g.fill(); g.fillStyle = '#4a2c18'; g.fillRect(35 - (dir > 0 ? 22 : 24), yy + 7, 44, 2); } }), x - 35, y - 68, y);
  WORLD.blocks.push([x - 6, y - 8, 12, 10]); };
// el edicto clavado en un poste, con el sello rojo de la Ciudad Alta
OBJ_EXTRA.edicto = o => { const x = o.x * T, y = o.y * T; empuja(spr(40, 64, g => { g.fillStyle = GO; g.fillRect(17, 8, 6, 56); g.fillStyle = '#5a3a24'; g.fillRect(18, 8, 4, 56);
  g.fillStyle = GO; g.fillRect(2, 4, 36, 30); g.fillStyle = '#f2ead4'; g.fillRect(3, 5, 34, 28); g.fillStyle = '#3a2a20'; g.fillRect(8, 8, 24, 2); for (const yy of [13, 16, 19, 22]) g.fillRect(6, yy, 28, 1);
  g.fillStyle = '#b8302a'; g.beginPath(); g.arc(28, 28, 4, 0, 7); g.fill(); g.fillStyle = '#e8c060'; g.fillRect(19, 3, 2, 3); }), x - 20, y - 62, y);
  WORLD.blocks.push([x - 6, y - 8, 12, 10]); };

// ---------- vida por encima del suelo ----------
// humo de las montanas de chatarra, chispas, palomas que se espantan al pasar
function goaVida(g, [cx, cy], now, VW, VH) { const t = now / 1000;
  for (const [x, y, r] of WORLD.humos || []) { if (x < cx - 300 || x > cx + VW + 300 || y < cy - 600 || y > cy + VH + 200) continue;
    for (let i = 0; i < 9; i++) { const k = ((t * .07 + i / 9) % 1), px = x - cx + Math.sin(k * 5 + i) * 18 + k * 90, py = y - cy - k * 260, rr = 10 + k * 46 * (r / 5);
      g.fillStyle = `rgba(70,64,60,${.32 * (1 - k)})`; g.beginPath(); g.arc(px, py, rr, 0, 7); g.fill(); }
    if (Math.sin(t * 3 + x) > .6) { g.fillStyle = '#ffb040'; g.fillRect(x - cx + Math.sin(t * 7) * 20, y - cy + 40 - (t * 30 % 40), 2, 2); } } }
// palomas: picotean en la plaza y salen volando si pasás cerca
const PALOMAS = [];
function goaPalomas(g, [cx, cy], now) { const A = PLANO.mapa.animales && PLANO.mapa.animales.palomas; if (!A) return;
  if (!PALOMAS.length) for (const [x, y] of A) PALOMAS.push({ x: x * T, y: y * T, x0: x * T, y0: y * T, vuelo: 0 });
  for (const p of PALOMAS) { const d = Math.hypot(G.x - p.x, G.y - p.y);
    if (!p.vuelo && d < 46 && G.scene === 'town') p.vuelo = now;
    let x = p.x, y = p.y, alt = 0;
    if (p.vuelo) { const k = (now - p.vuelo) / 2600; if (k > 1) { p.vuelo = 0; p.x = p.x0 + (Math.random() - .5) * 60; p.y = p.y0 + (Math.random() - .5) * 30; } else { alt = Math.sin(k * Math.PI) * 120; x += k * 140 * (p.x0 % 2 ? 1 : -1); } }
    const px = Math.round(x - cx), py = Math.round(y - cy - alt), ala = p.vuelo ? (Math.floor(now / 80) % 2 ? -3 : 2) : 0, pic = !p.vuelo && Math.sin(now / 300 + p.x0) > .7 ? 1 : 0;
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(Math.round(x - cx) - 3, Math.round(y - cy) + 2, 7, 2);
    g.fillStyle = GO; g.fillRect(px - 4, py - 4, 9, 5); g.fillStyle = '#8a8a96'; g.fillRect(px - 3, py - 3, 7, 3); g.fillStyle = '#5a7a7a'; g.fillRect(px + 2, py - 5 + pic, 3, 3); g.fillStyle = '#e8a040'; g.fillRect(px + 5, py - 4 + pic, 1, 1);
    if (p.vuelo) { g.fillStyle = '#a8a8b4'; g.fillRect(px - 2, py - 4 + ala, 6, 2); } } }

// ---------- luz y aire ----------
// niebla en el puerto al amanecer, destellos en el agua, el tono de cada barrio y una viñeta suave
function goaLuces(g, [cx, cy], now, VW, VH) { const h = hourNow(), t = now / 1000;
  // niebla matinal sobre el puerto y el mar: bandas que se deshacen hacia las nueve
  const niebla = h > 5 && h < 9.5 ? Math.min(1, (h - 5) * 2) * Math.min(1, (9.5 - h) / 1.5) : 0;
  if (niebla > 0) for (let i = 0; i < 7; i++) { const y = (58 + i * 2.6) * T - cy, x = ((t * (8 + i * 2) + i * 400) % (VW + 900)) - 450; if (y < -120 || y > VH + 120) continue;
    const gr = g.createRadialGradient(x, y, 0, x, y, 420); gr.addColorStop(0, `rgba(230,236,240,${.32 * niebla})`); gr.addColorStop(1, 'rgba(230,236,240,0)'); g.save(); g.translate(x, y); g.scale(1, .3); g.translate(-x, -y); g.fillStyle = gr; g.fillRect(x - 420, y - 420, 840, 840); g.restore(); }
  // destellos de sol en el agua
  if (h > 7 && h < 18.5) { g.fillStyle = 'rgba(255,255,240,.8)'; for (let i = 0; i < 40; i++) { const x = hs(i, 1, 97) * VW, y = hs(i, 2, 97) * VH, wx = x + cx, wy = y + cy; if (wy < 66 * T || inPoly([wx, wy], WORLD.land)) continue; if (Math.sin(t * 3 + i * 7.3) > .82) g.fillRect(Math.round(x), Math.round(y), 3, 1); } }
  // el tono de cada barrio: Alta fría, Terminal cálida y sucia
  const enTerminal = Math.max(0, Math.min(1, ((cx + VW / 2) / T - 66) / 8)), enAlta = Math.max(0, Math.min(1, (26 - (cy + VH / 2) / T) / 6)) * (1 - enTerminal);
  if (enTerminal > 0) { g.fillStyle = `rgba(150,90,40,${.1 * enTerminal})`; g.fillRect(0, 0, VW, VH); }
  if (enAlta > 0) { g.fillStyle = `rgba(150,180,230,${.08 * enAlta})`; g.fillRect(0, 0, VW, VH); }
  if (!(typeof S !== 'undefined' && S.efectos === 'bajos')) { const vg = g.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * .45, VW / 2, VH / 2, Math.max(VW, VH) * .75); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,6,4,.32)'); g.fillStyle = vg; g.fillRect(0, 0, VW, VH); } }
