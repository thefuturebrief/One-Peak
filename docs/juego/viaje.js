// El viaje: tiza de la partida, despertar a bordo, investigar, una conversación larga y la llegada.
// Camino pirata: La Corneja, el Cuervo, Reino de Goa. Camino marine: Gaviota Blanca, la teniente Nisi, Loguetown.
const VIAJE = {
  pirata: { barco: 'corneja', jefe: 'forastero', cama: [2.4, 3.7], destino: 'Reino de Goa, isla Dawn', escena: 'goa',
    cosas: [
      { at: [6.4, 1.7], label: 'Mirar', id: 'carta', act: () => { darObjeto('carta'); return ['Sobre el escritorio, una carta náutica del East Blue. Alguien ha trazado a lápiz una ruta desde una isla sin nombre.', 'Al lado de la isla, con otra letra, pone «Kalé».']; } },
      { at: [1.1, 1.6], label: 'Abrir', id: 'foto', act: () => { F.foto = true; learn(['familia', 'Cinco hombres en una cubierta', 'En el baúl del forastero hay una foto vieja: cinco hombres jóvenes en la cubierta de un barco. Uno lleva capucha. Otro tiene mi cara.']); return ['Dentro del baúl, entre camisas dobladas, una foto vieja.', 'Cinco hombres jóvenes en la cubierta de un barco, riéndose de algo. Uno lleva capucha.', 'Otro tiene tu cara.']; } },
      { at: [2.7, 1.2], label: 'Leer', id: 'bitacora', act: () => { learn(['familia', 'La bitácora', 'En la bitácora de La Corneja hay una página con la letra de papá: «Si la aguja tiembla, sigue».']); return ['El cuaderno de bitácora. Las primeras páginas están arrancadas.', 'En una queda una sola frase, con otra letra: «Si la aguja tiembla, sigue».', tiene('nota') ? 'Es la misma letra que la nota de la caja.' : 'La letra se te hace conocida, sin saber por qué.']; } },
      { at: [2.65, 5.7], label: 'Mirar', id: 'botella', act: () => ['Una botella vacía de ron de Loguetown. En la etiqueta, alguien ha rayado una medusa con la punta de un cuchillo.'] },
    ] },
  marine: { barco: 'gaviota', jefe: 'teniente', cama: [2.2, 2.0], destino: 'Loguetown', escena: 'loguetown',
    cosas: [
      { at: [1.0, 3.1], label: 'Mirar', id: 'uniforme', act: () => { ponerUniforme(); return ['Sobre la litera de al lado, doblado con cuidado: un uniforme de marinero. Gorra, cuello azul y un pañuelo rojo.', '(Te lo pones. Te queda un poco grande en los hombros.)']; } },
      { at: [6, 5.05], label: 'Leer', id: 'reglamento', act: () => { learn(['yo', 'El reglamento', 'Artículo primero del reglamento de la Marina: «La Justicia no se discute: se obedece». Alguien escribió debajo, a lápiz: «Casi siempre».']); return ['Un reglamento de la Marina, gastado de tanto pasar de mano en mano.', '«Artículo primero: la Justicia no se discute; se obedece.»', 'Debajo, a lápiz, alguien ha escrito: «Casi siempre».']; } },
      { at: [9.2, 1.45], label: 'Mirar', id: 'baul', act: () => ['El baúl de otro recluta. Encima, una carta sin terminar: «Mamá: ya casi soy marine. No te preocupes por...».', 'No sigue.'] },
    ] },
};
// zarpar: tiza de la partida y la noche en el mar, después despiertas a bordo
function viaje(path) {
  const V = VIAJE[path], prom = asked('corso', 'prometo'); F.camino = path;
  learn(['yo', 'Me fui de Kalé', path === 'pirata' ? 'Zarpé de noche en La Corneja, la balandra del forastero, sin saber adónde.' : 'Me fui de Kalé en la Gaviota Blanca, el barco de la teniente Nisi, para alistarme en Loguetown.']);
  G.paused = true; G.talking = null; renderTalk(); toggleBrujula(false);
  const l1 = path === 'pirata' ? (prom ? 'Corso te despidió desde el muelle hasta que ya no pudo verte. Le habías hecho una promesa.' : 'Corso te despidió desde el muelle hasta que ya no pudo verte. Tu madre no dijo nada.')
    : 'Subiste a la Gaviota Blanca casi a medianoche.' + (prom ? ' Corso no lloró: te había hecho prometer que volverías a por él.' : ' Corso llevaba puesta la gorra de un marine.');
  const l2 = tiene('brujula') ? 'En alta mar, la aguja de la brújula no paró de temblar en toda la noche.' : 'El faro de Kalé estuvo a la vista hasta pasada la medianoche. Después, solo el mar.';
  pizarra([{ d: () => ESC[path === 'pirata' ? 'zarpa_pirata' : 'zarpa_marina']({ promesa: prom }), t: l1 }, { d: () => ESC.noche({ tipo: path === 'pirata' ? 'balandra' : 'marina' }), t: l2 }], () => despertarABordo(path), { semilla: 20 });
}
function despertarABordo(path) {
  const V = VIAJE[path], B = bld(V.barco), S0 = B.entrance; F.zarpado = true; F.navegando = true; F.vistos = 0; F.desperto = performance.now();
  S0.amarrado = false; S0.doors = S0.doors.filter(d => d !== S0.pasarela);
  G.minutes = 24 * 60 + 7.6 * 60; clearBubbles();
  for (const n of PEOPLE) if (n.scene === 'town' || n.scene.startsWith('gaviota') || n.scene.startsWith('corneja')) n.scene = 'none';
  if (path === 'marine') for (const [id, at] of [['mar2', [9, 4.4]], ['mar3', [16, 9]]]) { const n = P(id); if (n) moveNpc(n, 'gaviota:cubierta', at, 'down'); }
  for (const c of V.cosas) { const [sc, [x, y]] = place(V.barco, c.at); OBJS.push({ scene: sc, x, y, label: c.label, act: () => { const lines = c.act(); if (!c.visto) { c.visto = true; F.vistos++; } narr(lines, () => { if (F.vistos >= 2 && !F.entra) later(700, () => entraJefe(path)); }); } }); }
  const [sc, at] = place(V.barco, V.cama); enter(sc, at, 'left'); G.paused = false;
  later(500, () => narr(path === 'pirata' ? ['Te despierta el crujido de la madera. Todo se mece.', 'Estás en un camarote pequeño. Por la ventana solo se ve agua.'] : ['Te despierta una corneta. Todo se mece.', 'Estás en las literas de la Gaviota Blanca. Los demás reclutas ya han subido.']));
}
// entra quien manda en el barco y hay una conversación larga, con preguntas que dependen de lo que llevas y de lo que has visto
function entraJefe(path) {
  if (F.entra) return; F.entra = true; const V = VIAJE[path], j = P(V.jefe), bajo = bld(V.barco).scenes[1], d = bajo.doors[0], [at] = bajo.doorArrival(...d.args);
  Object.assign(j, { scene: bajo.id, x: at[0], y: at[1], dir: 'down', fijo: false, act: null, emo: null, goal: null }); emote(G, '!', 1200);
  walkTo(j, [Math.max(40, G.x + (G.x > at[0] ? -44 : 44)), G.y], 60, () => { j.dir = dirTo(j, G); G.dir = dirTo(G, j); charla(path); });
}
function charla(path) {
  const j = P(VIAJE[path].jefe), hechas = new Set(), Q = path === 'pirata' ? PREGUNTAS_CUERVO() : PREGUNTAS_NISI();
  const ronda = primera => { const abiertas = Q.filter(q => !hechas.has(q.id) && (!q.need || q.need())), fin = abiertas.filter(q => q.fin), resto = abiertas.filter(q => !q.fin);
    say(j, { lines: [primera || pick(['¿Algo más?', 'Pregunta.', '...'])], opts: [...resto, ...fin].map(q => ({ t: q.t, then: () => { hechas.add(q.id); q.learn && learn(q.learn); say(j, { lines: q.a(), done: () => q.fin ? cierre(path) : ronda() }); } })) }); };
  ronda(path === 'pirata' ? 'Despierto. Bien. El mareo se pasa al tercer día.' : 'Buenos días. Todavía no eres recluta: lo serás mañana, si firmas en Loguetown.');
}
const PREGUNTAS_CUERVO = () => [
  { id: 'quien', t: '¿Quién eres?', a: () => (P('forastero').name = 'El Cuervo', ['Un viejo amigo de tu padre. Navegamos juntos más años de los que tú tienes.', 'En el mar me llaman el Cuervo. Con eso te basta.', '(Cuando le preguntas su nombre, solo sonríe.)']), learn: ['gente', 'El Cuervo', 'El forastero se hace llamar el Cuervo. Navegó con papá durante años. No me quiso decir su nombre y nunca se quita la capucha.'] },
  { id: 'padre', t: '¿Dónde está mi padre?', a: () => ['Vivo, la última vez que supe de él. De eso hace tres años, en el Grand Line.', 'No me preguntes más. Si te lo digo, irás a buscarlo antes de estar listo. Y te matarán por el camino.'], learn: ['familia', 'Papá vive', 'El Cuervo dice que papá estaba vivo hace tres años, en el Grand Line. No quiere decirme más.'] },
  { id: 'brujula', need: () => tiene('brujula'), t: 'Esta brújula era suya.', a: () => ['(Se queda mirándola mucho rato.)', 'La llevaba siempre. Decía que no apunta al norte: apunta a lo que te falta.', 'Si un día tiembla sin parar, síguela.'] },
  { id: 'retrato', need: () => tiene('retrato'), t: 'Mamá me dio esto.', a: () => ['(Se le escapa algo parecido a una risa.)', 'Esa foto la saqué yo. Se reía de que no supiera sujetar la cámara.', 'Tu madre no la tiró. Eso dice mucho de tu madre.'] },
  { id: 'foto', need: () => F.foto, t: 'En tu baúl hay una foto. Cinco hombres.', a: () => ['Éramos cinco. Tu padre, yo, dos que ya no están...', '...y Dorne. Antes de perder la mano y lo poco que tenía de bueno.', 'Lo que busca en Kalé lo escondió tu padre para que nunca lo encontrara. Tu madre sabe dónde.'], learn: ['familia', 'Dorne navegó con papá', 'El Cuervo dice que eran cinco en la tripulación: papá, él, dos que murieron y Dorne. Lo que Dorne busca lo escondió papá, y mamá sabe dónde.'] },
  { id: 'dorne', t: '¿Volverá Dorne a Kalé?', a: () => ['Volverá. No esta semana, pero volverá.', 'La teniente de Loguetown tiene buen olfato. Mientras ella ande cerca, tu madre y tu hermano estarán más seguros que conmigo.'] },
  { id: 'adonde', fin: true, t: '¿Adónde vamos?', a: () => ['Yo, a un sitio adonde no puedes venir. Tengo asuntos pendientes que no esperan.', 'A ti te dejo mañana al amanecer en el Reino de Goa, en la isla Dawn.', 'Busca en la Terminal Gris a una mujer que se llama Ama Sel. Dile que vas de parte del Cuervo. Te enseñará lo que yo no tengo tiempo de enseñarte.', 'No me vas a ver en un tiempo. Cuando vuelva, quiero ver otra cara. Una que haya aprendido algo.', 'Sube a cubierta cuando quieras. Ya se ve la costa.'],
    learn: ['gente', 'Ama Sel', 'El Cuervo me dijo que busque en la Terminal Gris, en el Reino de Goa, a una mujer llamada Ama Sel, y que le diga que voy de parte del Cuervo.'] },
];
const PREGUNTAS_NISI = () => [
  { id: 'loguetown', t: '¿Qué voy a hacer en Loguetown?', a: () => ['Seis meses de instrucción en la base. Nadar con peso, disparar, obedecer. Y más obedecer.', 'Si aguantas, te darán destino. Si destacas, quizá te quiera en mi barco.'] },
  { id: 'padre', t: '¿Conoce a mi padre?', a: () => ['No. Pero conozco tu apellido.', 'En los archivos de Loguetown hay un expediente con tu apellido. Lo vi una vez, de casualidad. Tenía el sello de un vicealmirante y estaba casi vacío.', 'Los expedientes casi vacíos son los que más cosas esconden.'], learn: ['familia', 'Un expediente en Loguetown', 'La teniente Nisi vio en Loguetown un expediente con nuestro apellido, casi vacío y con el sello de un vicealmirante.'] },
  { id: 'retrato', need: () => tiene('retrato'), t: 'Esta es la cara de mi padre.', a: () => ['(Mira la foto. Después te mira a ti.)', 'Esta cara estaba en ese expediente. Más joven, sin nombre debajo. Solo una palabra: «Desaparecido».'], learn: ['familia', 'Desaparecido', 'La teniente reconoció a papá en el retrato: estaba en el expediente de Loguetown, sin nombre, con la palabra «Desaparecido».'] },
  { id: 'forastero', t: '¿Sabe quién era el forastero?', a: () => ['Un hombre con capucha que hace retroceder a un pirata de ocho millones solo con estar ahí.', 'No, no sé quién era. Y eso es lo que más me preocupa.'] },
  { id: 'dorne', t: '¿Y mi familia? ¿Y Dorne?', a: () => ['He dejado dos hombres en Kalé hasta que lleguen relevos. Tu madre y tu hermano estarán vigilados.', 'A Dorne lo seguimos. Tarde o temprano, los piratas cometen un error.'] },
  { id: 'cuando', fin: true, t: '¿Cuándo llegamos?', a: () => [S.uniforme ? 'A mediodía. Sube a cubierta: quiero que veas Loguetown con los ojos de quien llega, no de quien pasa.' : 'A mediodía. Ponte el uniforme que tienes en la litera y sube a cubierta.', 'La ciudad donde empezó todo y donde terminó todo. Te va a gustar.'], learn: ['yo', 'Rumbo a Loguetown', 'La teniente Nisi dice que llegamos a Loguetown a mediodía. Seis meses de instrucción en la base.'] },
];
// después de la charla, el jefe sube a cubierta y espera; en cubierta, hablar con él o mirar a proa trae la llegada
function cierre(path) {
  const V = VIAJE[path], j = P(V.jefe), bajo = bld(V.barco).scenes[1], d = bajo.doors[0], [at] = bajo.doorArrival(...d.args); F.hablado = true; guardarAuto();
  walkTo(j, at, 70, () => { const def = BARCOS[V.barco]; moveNpc(j, V.barco + ':cubierta', path === 'pirata' ? [def.timon[0] + MARGEN + .9, def.timon[1] + MARGEN - .2] : [def.L + MARGEN - 3.5, MARGEN + def.H / 2], path === 'pirata' ? 'right' : 'right');
    j.greet = () => path === 'pirata' ? 'Ahí la tienes. Los muros blancos son el reino. Lo de abajo, el humo, es la Terminal Gris.' : 'Ahí está. Loguetown. Mira el cadalso de la plaza: desde aquí se ve.';
    j.topics = [{ id: 'listo', ask: path === 'pirata' ? 'Estoy listo.' : 'Estoy listo, teniente.', a: () => (later(300, () => llegada(path)), ['Eso ya lo veremos.']) }]; });
  const [sc, [x, y]] = place(V.barco + ':cubierta', [BARCOS[V.barco].L + MARGEN - 1.6, MARGEN + BARCOS[V.barco].H / 2]); OBJS.push({ scene: sc, x, y, label: 'Mirar a proa', act: () => narr([path === 'pirata' ? 'A lo lejos, una isla con murallas blancas y, a sus pies, columnas de humo que no se mueven.' : 'A lo lejos, una ciudad grande, más grande que nada que hayas visto. En la plaza, algo alto y de madera.'], () => llegada(path)) });
}
function llegada(path) {
  const V = VIAJE[path]; F.navegando = false; cv.style.transform = '';
  pizarra([{ d: ESC[V.escena], t: path === 'pirata' ? 'Al amanecer, La Corneja te dejó en una playa de la isla Dawn. Cuando miraste atrás, la balandra ya era un punto.' : 'A mediodía, la Gaviota Blanca entró en el puerto de Loguetown. Desde la cubierta se veía el cadalso de la plaza.' }], null,
    { cierre: `<b>Fin del Acto 0</b><span>${fullName()} · ${V.destino}</span><small>El Acto 1 empieza aquí.</small><button type="button" class="btn" id="finmenu">Volver al menú</button>`, semilla: 40 });
  const b = document.getElementById('finmenu'); b.onclick = () => location.reload(); keyHandler = null;
}
// el uniforme cambia tu ropa: camisa y pantalón blancos, gorra y cuello azul dibujados encima
function ponerUniforme() { if (S.uniforme) return; S.uniforme = true; Object.assign(player.look, { arriba: 'longsleeve', arribaColor: 'white', encima: 'nada', abajo: 'pants', abajoColor: 'white', pies: 'zapatos', piesColor: 'black', cabeza: 'nada' }); ajustar(player.look); aplicarAspecto(player.look); }
