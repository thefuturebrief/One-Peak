// El viaje: tiza de la partida, despertar a bordo, investigar, una conversación larga y la llegada.
// Solo hay camino pirata: La Corneja, la Medusa Gris, Shells Town.
const VIAJE = {
  pirata: { barco: 'corneja', jefe: 'forastero', cama: [2.4, 3.7], destino: 'Shells Town', escena: 'shells',
    cosas: [
      { at: [6.4, 1.7], label: 'Mirar', id: 'carta', act: () => { darObjeto('carta'); return ['Sobre el escritorio, una carta náutica del East Blue. Alguien ha trazado a lápiz una ruta desde una isla sin nombre.', 'Al lado de la isla, con otra letra, pone «Kalé».']; } },
      { at: [1.1, 1.6], label: 'Abrir', id: 'foto', act: () => { F.foto = true; learn(['familia', 'Cinco hombres en una cubierta', 'En el baúl del forastero hay una foto vieja: cinco hombres jóvenes en la cubierta de un barco. Uno lleva capucha. Otro tiene mi cara.']); return ['Dentro del baúl, entre camisas dobladas, una foto vieja.', 'Cinco hombres jóvenes en la cubierta de un barco, riéndose de algo. Uno lleva capucha.', 'Otro tiene tu cara.']; } },
      { at: [2.7, 1.2], label: 'Leer', id: 'bitacora', act: () => { learn(['familia', 'La bitácora', 'En la bitácora de La Corneja hay una página con la letra de papá: «Si la aguja tiembla, sigue».']); return ['El cuaderno de bitácora. Las primeras páginas están arrancadas.', 'En una queda una sola frase, con otra letra: «Si la aguja tiembla, sigue».', tiene('nota') ? 'Es la misma letra que la nota de la caja.' : 'La letra se te hace conocida, sin saber por qué.']; } },
      { at: [2.65, 5.7], label: 'Mirar', id: 'botella', act: () => ['Una botella vacía de ron de Loguetown. En la etiqueta, alguien ha rayado una medusa con la punta de un cuchillo.'] },
    ] },
};
// zarpar: tiza de la partida y la noche en el mar, después despiertas a bordo
function viaje(path) {
  const prom = asked('corso', 'prometo'); path = 'pirata'; F.camino = path;
  learn(['yo', 'Me fui de Kalé', 'Zarpé de noche en La Corneja, la balandra del forastero, sin saber adónde.']);
  G.paused = true; G.talking = null; renderTalk(); toggleBrujula(false);
  const l1 = prom ? 'Corso te despidió desde el muelle hasta que ya no pudo verte. Le habías hecho una promesa.' : 'Corso te despidió desde el muelle hasta que ya no pudo verte. Tu madre no dijo nada.';
  const l2 = tiene('brujula') ? 'En alta mar, la aguja de la brújula no paró de temblar en toda la noche.' : 'El faro de Kalé estuvo a la vista hasta pasada la medianoche. Después, solo el mar.';
  pizarra([{ d: () => ESC.zarpa_pirata({ promesa: prom }), t: l1 }, { d: () => ESC.noche({ tipo: 'balandra' }), t: l2 }], () => despertarABordo(path), { semilla: 20 });
}
function despertarABordo(path) {
  const V = VIAJE[path], B = bld(V.barco), S0 = B.entrance; F.zarpado = true; F.navegando = true; F.vistos = 0; F.desperto = performance.now();
  S0.amarrado = false; S0.doors = S0.doors.filter(d => d !== S0.pasarela);
  G.minutes = 24 * 60 + 7.6 * 60; clearBubbles();
  for (const n of PEOPLE) if (n.scene === 'town' || n.scene.startsWith('gaviota') || n.scene.startsWith('corneja')) n.scene = 'none';
  for (const c of V.cosas) { const [sc, [x, y]] = place(V.barco, c.at); OBJS.push({ scene: sc, x, y, label: c.label, act: () => { const lines = c.act(); if (!c.visto) { c.visto = true; F.vistos++; } narr(lines, () => { if (F.vistos >= 2 && !F.entra) later(700, () => entraJefe(path)); }); } }); }
  const [sc, at] = place(V.barco, V.cama); enter(sc, at, 'left'); G.paused = false;
  later(500, () => narr(['Te despierta el crujido de la madera. Todo se mece.', 'Estás en un camarote pequeño. Por la ventana solo se ve agua.']));
}
// entra quien manda en el barco y hay una conversación larga, con preguntas que dependen de lo que llevas y de lo que has visto
function entraJefe(path) {
  if (F.entra) return; F.entra = true; const V = VIAJE[path], j = P(V.jefe), bajo = bld(V.barco).scenes[1], d = bajo.doors[0], [at] = bajo.doorArrival(...d.args);
  Object.assign(j, { scene: bajo.id, x: at[0], y: at[1], dir: 'down', fijo: false, act: null, emo: null, goal: null }); emote(G, '!', 1200);
  walkTo(j, [Math.max(40, G.x + (G.x > at[0] ? -44 : 44)), G.y], 60, () => { j.dir = dirTo(j, G); G.dir = dirTo(G, j); charla(path); });
}
function charla(path) {
  const j = P(VIAJE[path].jefe), hechas = new Set(), Q = PREGUNTAS_CUERVO();
  const ronda = primera => { const abiertas = Q.filter(q => !hechas.has(q.id) && (!q.need || q.need())), fin = abiertas.filter(q => q.fin), resto = abiertas.filter(q => !q.fin);
    say(j, { lines: [primera || pick(['¿Algo más?', 'Pregunta.', '...'])], opts: [...resto, ...fin].map(q => ({ t: q.t, then: () => { hechas.add(q.id); q.learn && learn(q.learn); say(j, { lines: q.a(), done: () => q.fin ? cierre(path) : ronda() }); } })) }); };
  ronda('Despierto. Bien. El mareo se pasa al tercer día.');
}
const PREGUNTAS_CUERVO = () => [
  { id: 'quien', t: '¿Quién eres?', a: () => (P('forastero').name = 'La Medusa Gris', ['Un viejo amigo de tu padre. Navegamos juntos más años de los que tú tienes.', 'En el mar me llaman la Medusa Gris. Con eso te basta.', '(Cuando le preguntas su nombre, solo sonríe.)']), learn: ['gente', 'La Medusa Gris', 'El forastero dice que en el mar lo llaman la Medusa Gris. Navegó con papá durante años. No me quiso decir su nombre y nunca se quita la capucha.'] },
  { id: 'padre', t: '¿Dónde está mi padre?', a: () => ['Vivo, la última vez que supe de él. De eso hace tres años, en el Grand Line.', 'No me preguntes más. Si te lo digo, irás a buscarlo antes de estar listo. Y te matarán por el camino.'], learn: ['familia', 'Papá vive', 'La Medusa Gris dice que papá estaba vivo hace tres años, en el Grand Line. No quiere decirme más.'] },
  { id: 'brujula', need: () => tiene('brujula'), t: 'Esta brújula era suya.', a: () => ['(Se queda mirándola mucho rato.)', 'La llevaba siempre. Decía que no apunta al norte: apunta a lo que te falta.', 'Si un día tiembla sin parar, síguela.'] },
  { id: 'retrato', need: () => tiene('retrato'), t: 'Mamá me dio esto.', a: () => ['(Se le escapa algo parecido a una risa.)', 'Esa foto la saqué yo. Se reía de que no supiera sujetar la cámara.', 'Tu madre no la tiró. Eso dice mucho de tu madre.'] },
  { id: 'foto', need: () => F.foto, t: 'En tu baúl hay una foto. Cinco hombres.', a: () => ['Éramos cinco. Tu padre, yo, dos que ya no están...', '...y Dorne. Antes de perder la mano y lo poco que tenía de bueno.', 'Lo que busca en Kalé lo escondió tu padre para que nunca lo encontrara. Tu madre sabe dónde.'], learn: ['familia', 'Dorne navegó con papá', 'La Medusa Gris dice que eran cinco en la tripulación: papá, él, dos que murieron y Dorne. Lo que Dorne busca lo escondió papá, y mamá sabe dónde.'] },
  { id: 'dorne', t: '¿Volverá Dorne a Kalé?', a: () => ['Volverá. No esta semana, pero volverá.', 'La teniente de Loguetown tiene buen olfato. Mientras ella ande cerca, tu madre y tu hermano estarán más seguros que conmigo.'] },
  { id: 'adonde', fin: true, t: '¿Adónde vamos?', a: () => ['Yo, a un sitio adonde no puedes venir. Tengo asuntos pendientes que no esperan.', 'A ti te dejo mañana al amanecer en una cala, cerca de Shells Town. Un barco como este no entra en un puerto con base de la Marina.', 'Desde Shells Town salen mercantes al Reino de Goa, en la isla Dawn. Busca en la Terminal Gris a una mujer que se llama Ama Sel. Dile que vas de parte de la Medusa Gris. Te enseñará lo que yo no tengo tiempo de enseñarte.', 'No me vas a ver en un tiempo. Cuando vuelva, quiero ver otra cara. Una que haya aprendido algo.', 'Sube a cubierta cuando quieras. Ya se ve la costa.'],
    learn: ['gente', 'Ama Sel', 'La Medusa Gris me dejará en Shells Town. Desde allí tengo que llegar al Reino de Goa y buscar en la Terminal Gris a una mujer llamada Ama Sel, de su parte.'] },
];
// después de la charla, el jefe sube a cubierta y espera; en cubierta, hablar con él o mirar a proa trae la llegada
function cierre(path) {
  const V = VIAJE[path], j = P(V.jefe), bajo = bld(V.barco).scenes[1], d = bajo.doors[0], [at] = bajo.doorArrival(...d.args); F.hablado = true; guardarAuto();
  walkTo(j, at, 70, () => { const def = BARCOS[V.barco]; moveNpc(j, V.barco + ':cubierta', [def.timon[0] + MARGEN + .9, def.timon[1] + MARGEN - .2], 'right');
    j.greet = () => 'Ahí la tienes: Shells Town. Lo de la loma es la base de la Marina. Nosotros vamos a la cala de detrás, donde no mira nadie.';
    j.topics = [{ id: 'listo', ask: 'Estoy listo.', a: () => (later(300, () => llegada(path)), ['Eso ya lo veremos.']) }]; });
  const [sc, [x, y]] = place(V.barco + ':cubierta', [BARCOS[V.barco].L + MARGEN - 1.6, MARGEN + BARCOS[V.barco].H / 2]); OBJS.push({ scene: sc, x, y, label: 'Mirar a proa', act: () => narr(['A lo lejos, una loma con una muralla de piedra y una bandera con una gaviota. A sus pies, tejados y el humo de las chimeneas.'], () => llegada(path)) });
}
function llegada() { F.navegando = false; cv.style.transform = '';
  pizarra([{ d: ESC.shells, t: 'Al amanecer, la Medusa Gris echó el bote al agua y remó contigo hasta una cala escondida, detrás de Shells Town.' }], () => llegadaShells(), { semilla: 41 }); }
