// Sonido generado en el navegador, sin archivos: ambiente (mar, viento, gaviotas, grillos, crujidos), efectos y temas cortos.
// Arranca con el primer clic o tecla (los navegadores no dejan sonar antes). Música y efectos se apagan por separado.
const PREFS = (() => { try { return { musica: true, efectos: true, rapido: false, ...JSON.parse(localStorage.getItem('onepeak-prefs') || '{}') }; } catch (e) { return { musica: true, efectos: true, rapido: false }; } })();
const guardarPrefs = () => { try { localStorage.setItem('onepeak-prefs', JSON.stringify(PREFS)); } catch (e) {} aplicarPrefs(); };
const AU = { ctx: null };
function audioInit() {
  if (AU.ctx) return; const C = window.AudioContext || window.webkitAudioContext; if (!C) return; const ctx = AU.ctx = new C();
  AU.master = ctx.createGain(); AU.master.gain.value = .8; AU.master.connect(ctx.destination);
  const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(AU.master);
  AU.mus = ctx.createGain(); AU.fx = ctx.createGain(); AU.amb = ctx.createGain(); for (const g of [AU.mus, AU.fx, AU.amb]) g.connect(comp);
  // ruido rosa compartido
  const n = ctx.sampleRate * 2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0); let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; b0 = .99765 * b0 + w * .099; b1 = .963 * b1 + w * .2965; b2 = .57 * b2 + w * 1.0526; d[i] = (b0 + b1 + b2 + w * .1848) * .2; } AU.ruido = buf;
  const lazo = (freq, q, tipo = 'lowpass') => { const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; const f = ctx.createBiquadFilter(); f.type = tipo; f.frequency.value = freq; f.Q.value = q; const g = ctx.createGain(); g.gain.value = 0; src.connect(f); f.connect(g); g.connect(AU.amb); src.start(); return { f, g }; };
  AU.mar = lazo(520, .7); AU.viento = lazo(900, 2.5, 'bandpass');
  aplicarPrefs(); AU.t = 0; setInterval(audioTick, 120);
}
['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => { audioInit(); if (AU.ctx && AU.ctx.state === 'suspended') AU.ctx.resume(); }, { capture: true }));
function aplicarPrefs() { if (!AU.ctx) return; const t = AU.ctx.currentTime; AU.mus.gain.setTargetAtTime(PREFS.musica ? .55 : 0, t, .3); AU.fx.gain.setTargetAtTime(PREFS.efectos ? .9 : 0, t, .1); AU.amb.gain.setTargetAtTime(PREFS.efectos ? .7 : 0, t, .3); }
const nota = m => 440 * Math.pow(2, (m - 69) / 12);
// ---------- instrumentos ----------
function env(g, t, a, peak, dec, sus = 0, rel = .2, dur = 0) { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(Math.max(.0001, sus || .0001), t + a + dec); if (dur) { g.gain.setValueAtTime(Math.max(.0001, sus || .0001), t + dur); g.gain.exponentialRampToValueAtTime(.0001, t + dur + rel); } }
function pulsada(m, t, dur, vol = .18, dest = AU.mus) { const c = AU.ctx, o = c.createOscillator(), o2 = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain(); o.type = 'triangle'; o2.type = 'sawtooth'; o.frequency.value = nota(m); o2.frequency.value = nota(m) * 1.003;
  const g2 = c.createGain(); g2.gain.value = .25; o2.connect(g2); g2.connect(f); o.connect(f); f.type = 'lowpass'; f.frequency.setValueAtTime(2400, t); f.frequency.exponentialRampToValueAtTime(500, t + dur); f.connect(g); g.connect(dest); env(g, t, .006, vol, Math.min(1.2, dur * 1.4)); o.start(t); o2.start(t); o.stop(t + dur * 1.6 + .1); o2.stop(t + dur * 1.6 + .1); }
function colchon(ms, t, dur, vol = .05) { const c = AU.ctx, g = c.createGain(), f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900; f.connect(g); g.connect(AU.mus); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + dur * .3); g.gain.linearRampToValueAtTime(vol * .8, t + dur * .7); g.gain.linearRampToValueAtTime(0, t + dur);
  for (const m of ms) for (const det of [-5, 5]) { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = nota(m); o.detune.value = det; o.connect(f); o.start(t); o.stop(t + dur + .05); } }
function notaBajo(m, t, dur, vol = .16) { const c = AU.ctx, o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = nota(m); o.connect(g); g.connect(AU.mus); env(g, t, .01, vol, dur * .9); o.start(t); o.stop(t + dur + .1); }
function golpeTambor(t, vol = .25, tono = 90, dest = AU.mus) { const c = AU.ctx, o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(tono * 1.8, t); o.frequency.exponentialRampToValueAtTime(tono * .6, t + .25); o.connect(g); g.connect(dest); env(g, t, .002, vol, .3); o.start(t); o.stop(t + .35);
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g2 = c.createGain(); s.buffer = AU.ruido; f.type = 'bandpass'; f.frequency.value = 1400; s.connect(f); f.connect(g2); g2.connect(dest); env(g2, t, .001, vol * .4, .08); s.start(t); s.stop(t + .12); }
// ---------- temas: compás, acordes por compás y melodía (MIDI, duración en tiempos; 0 = silencio) ----------
const TEMAS = {
  kale: { bpm: 96, beats: 3, acordes: [[50, 57, 62], [48, 55, 60], [50, 57, 62], [45, 52, 57], [50, 57, 62], [48, 55, 64], [46, 53, 62], [45, 52, 61]],
    mel: [[74, 1], [76, .5], [77, .5], [79, 1], [77, 1], [76, 1], [74, 1], [72, 2], [0, 1], [74, 1], [72, .5], [71, .5], [69, 1], [72, 1.5], [74, .5], [76, 1], [77, 1], [79, 1], [81, 1], [79, 1], [77, 1], [76, 2], [74, 1], [72, 1], [74, 1], [76, 1], [73, 2], [0, 1]] },
  plaza: { bpm: 112, beats: 4, tambor: [0, 1.5, 2, 3], acordes: [[45, 52], [45, 52], [44, 51], [43, 50]], mel: [[69, .5], [0, .5], [69, .5], [72, .5], [71, 1], [0, 1], [69, .5], [0, .5], [67, .5], [68, .5], [69, 2], [0, 2], [64, 1], [65, 1], [68, 2]] },
  noche: { bpm: 64, beats: 4, acordes: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]], mel: [[76, 2], [0, 2], [72, 1], [74, 1], [71, 2], [0, 4], [69, 3], [0, 1], [67, 2], [64, 2]] },
  mar: { bpm: 84, beats: 3, acordes: [[43, 50, 55], [41, 48, 53], [43, 50, 55], [48, 55, 60]], mel: [[67, 1], [71, 1], [74, 1], [76, 2], [74, 1], [72, 1], [71, 1], [69, 1], [67, 3], [0, 3], [74, 1], [72, 1], [71, 1], [69, 2], [71, 1], [67, 3]] },
  tiza: { bpm: 72, beats: 4, acordes: [[48, 55, 64], [45, 52, 60], [41, 48, 57], [43, 50, 59]], mel: [[72, .5], [76, .5], [79, .5], [76, .5], [72, .5], [76, .5], [79, .5], [84, .5], [69, .5], [72, .5], [76, .5], [72, .5], [65, .5], [69, .5], [72, .5], [69, .5], [67, .5], [71, .5], [74, .5], [71, .5], [67, 2]] },
};
let TEMA = null;
function sonarTema(id) { if (!AU.ctx || (TEMA && TEMA.id === id)) return; const t = AU.ctx.currentTime; if (TEMA) TEMA.fin = true; TEMA = { id, prox: t + .3, compas: 0, mi: 0, mt: t + .3 }; }
function programar() { const T0 = TEMA; if (!T0 || T0.fin) return; const D = TEMAS[T0.id], b = 60 / D.bpm, c = AU.ctx, hasta = c.currentTime + .5;
  while (T0.prox < hasta) { const k = T0.compas % D.acordes.length, ac = D.acordes[k], dur = b * D.beats; colchon(ac.map(m => m + 12), T0.prox, dur, T0.id === 'plaza' ? .035 : .045); notaBajo(ac[0] - 12, T0.prox, dur * .9, .12);
    if (D.tambor) for (const x of D.tambor) golpeTambor(T0.prox + x * b, .22, 70); T0.prox += dur; T0.compas++; }
  while (T0.mt < hasta) { const [m, l] = D.mel[T0.mi % D.mel.length]; if (m) pulsada(m, T0.mt, l * b, T0.id === 'tiza' ? .1 : .13); T0.mt += l * b; T0.mi++; } }
// ---------- efectos ----------
function sfx(nom) { if (!AU.ctx || !PREFS.efectos) return; const c = AU.ctx, t = c.currentTime, fx = AU.fx, ruido = (dur, f0, f1, vol, tipo = 'bandpass', q = 1) => { const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.ruido; f.type = tipo; f.Q.value = q; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur); s.connect(f); f.connect(g); g.connect(fx); env(g, t, .005, vol, dur); s.start(t); s.stop(t + dur + .05); };
  const tono = (f0, f1, dur, vol, tipo = 'sine', at = 0) => { const o = c.createOscillator(), g = c.createGain(); o.type = tipo; o.frequency.setValueAtTime(f0, t + at); o.frequency.exponentialRampToValueAtTime(f1, t + at + dur); o.connect(g); g.connect(fx); g.gain.setValueAtTime(0, t + at); g.gain.linearRampToValueAtTime(vol, t + at + .005); g.gain.exponentialRampToValueAtTime(.0001, t + at + dur); o.start(t + at); o.stop(t + at + dur + .05); };
  if (nom === 'campana') for (let k = 0; k < 3; k++) { const o = c.createOscillator(), m = c.createOscillator(), mg = c.createGain(), g = c.createGain(), at = t + k * 1.1; o.frequency.value = 392; m.frequency.value = 392 * 1.41; mg.gain.setValueAtTime(600, at); mg.gain.exponentialRampToValueAtTime(10, at + 2.5); m.connect(mg); mg.connect(o.frequency); o.connect(g); g.connect(fx); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(.3, at + .01); g.gain.exponentialRampToValueAtTime(.0001, at + 3); o.start(at); m.start(at); o.stop(at + 3.1); m.stop(at + 3.1); }
  if (nom === 'puerta') { ruido(.25, 300, 120, .35, 'lowpass'); tono(180, 140, .4, .06, 'sawtooth', .05); }
  if (nom === 'golpe') { ruido(.18, 1800, 300, .5, 'lowpass'); tono(120, 50, .2, .45); }
  if (nom === 'tajo') ruido(.22, 5000, 900, .28, 'bandpass', 2);
  if (nom === 'disparo') { ruido(.4, 3000, 200, .7, 'lowpass'); tono(90, 40, .3, .5); }
  if (nom === 'haki') { tono(70, 28, 2.4, .7); tono(140, 50, 1.6, .25, 'sawtooth'); ruido(2.2, 200, 60, .5, 'lowpass'); }
  if (nom === 'moneda') { tono(1320, 1320, .12, .12, 'triangle'); tono(1980, 1980, .25, .1, 'triangle', .07); }
  if (nom === 'aviso') [72, 76, 79, 84].forEach((m, i) => tono(nota(m), nota(m), .35, .09, 'triangle', i * .07));
  if (nom === 'pagina') ruido(.15, 3000, 6000, .12, 'highpass');
  if (nom === 'tiza') ruido(.06 + Math.random() * .05, 2500 + Math.random() * 2000, 1800, .05, 'highpass');
  if (nom === 'ui') tono(880, 880, .05, .05, 'triangle');
}
// ---------- cada 120 ms: ambiente según el sitio y la hora, gaviotas, grillos, crujidos y el tema que toca ----------
function audioTick() {
  if (!AU.ctx) return; const c = AU.ctx, t = c.currentTime, jugando = typeof G !== 'undefined' && !cv.hidden, h = jugando ? hourNow() : 12, noche = jugando && isNight(h), dentro = jugando && G.scene !== 'town', barco = jugando && /^(corneja|gaviota):cubierta/.test(G.scene), amar = jugando && F.navegando;
  const mar = !jugando ? .25 : barco ? (amar ? .9 : .55) : dentro ? .08 : .45, viento = !jugando ? .05 : barco && amar ? .3 : dentro ? 0 : noche ? .12 : .08;
  AU.mar.g.gain.setTargetAtTime(mar * (.75 + .25 * Math.sin(t * .5)), t, .5); AU.mar.f.frequency.setTargetAtTime(dentro && !barco ? 280 : 520 + 200 * Math.sin(t * .23), t, .5); AU.viento.g.gain.setTargetAtTime(viento * (.6 + .4 * Math.sin(t * .37)), t, .8);
  if (jugando && PREFS.efectos) { const r = Math.random();
    if (!dentro && !noche && r < .012) { const o = c.createOscillator(), g = c.createGain(), f0 = 1300 + Math.random() * 500; o.type = 'triangle'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f0 * .7, t + .3); o.frequency.setValueAtTime(f0 * .95, t + .35); o.frequency.exponentialRampToValueAtTime(f0 * .6, t + .7); o.connect(g); g.connect(AU.amb); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .03); g.gain.linearRampToValueAtTime(.0001, t + .75); o.start(t); o.stop(t + .8); }
    if (!dentro && noche && r < .25) { const o = c.createOscillator(), g = c.createGain(), at = t + Math.random() * .1; o.frequency.value = 4400 + Math.random() * 300; o.connect(g); g.connect(AU.amb); for (let k = 0; k < 3; k++) { g.gain.setValueAtTime(0, at + k * .05); g.gain.linearRampToValueAtTime(.012, at + k * .05 + .01); g.gain.linearRampToValueAtTime(0, at + k * .05 + .03); } o.start(at); o.stop(at + .2); }
    if ((barco || amar) && r < .02) { const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.ruido; f.type = 'bandpass'; f.Q.value = 12; f.frequency.setValueAtTime(220, t); f.frequency.linearRampToValueAtTime(140, t + .6); s.connect(f); f.connect(g); g.connect(AU.amb); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.5, t + .2); g.gain.linearRampToValueAtTime(0, t + .7); s.start(t); s.stop(t + .75); } }
  const tiza = document.querySelector('.tiza'); sonarTema(tiza ? 'tiza' : !jugando ? 'kale' : F.campana && !F.invitacion ? 'plaza' : amar || barco ? 'mar' : noche ? 'noche' : 'kale'); programar();
  if (tiza && PREFS.efectos && Math.random() < .35 && !(tiza.querySelector('p.on'))) sfx('tiza');
}
