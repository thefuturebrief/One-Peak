// Shells Town (Acto 1, camino pirata). Diseño en docs/shells-town.md (versión 2).
// Día 0: llegada, control del cadete, la ciudad y los tres candidatos. Día 1: desfile, base, cañonazo, pelea partida y huida.
ISLAS.shells = { n: 'Shells Town', plano: 'islas/shells.json', gente: () => GENTE_SHELLS(), objetos: () => OBJETOS_SHELLS(),
  tick: (now, dt) => shellsTick(now, dt), dibujar: (g, cam, now) => shellsDibujar(g, cam, now), encima: (g, cam, now, VW, VH) => shellsEncima(g, cam, now, VW, VH),
  init: () => shellsInit(), restaurar: d => shellsRestaurar(d), bloquea: d => shellsBloquea(d), objetivo: () => shellsObjetivo() };
const diaS = () => Math.floor(G.minutes / 1440) - (F.stD0 || 0);
const COMPA = { rufo: { n: 'Rufo', nc: 'Rufo Brasa', obj: 'cuchillas_rufo', cosa: 'sus cuchillas' }, nerea: { n: 'Nerea', nc: 'Nerea Calma', obj: 'libro_tadeo', cosa: 'el Libro de Corrientes del viejo Tadeo' }, niklas: { n: 'Niklas', nc: 'Niklas Brand', obj: 'lanza_niklas', cosa: 'la lanza de su padre' } };
const aPx = (x, y) => [x * T, y * T];
const AG = (...e) => e; // atajo para escribir agendas

// ---------- objetos nuevos ----------
const iconoCajas = p => icono32(g => { for (const [x, y] of [[3, 14], [16, 14], [9, 4]]) { g.fillStyle = '#2a1a10'; g.fillRect(x, y, 13, 12); g.fillStyle = '#a8744a'; g.fillRect(x + 1, y + 1, 11, 10); g.fillStyle = '#8aa0b8'; g.fillRect(x + 2, y + 2, 9, 3); g.fillStyle = '#6a4228'; g.fillRect(x + 1, y + 6, 11, 1); } }, p);
const iconoLlave = p => icono32(g => { g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(10, 12, 7, 0, 7); g.fill(); g.fillRect(14, 10, 15, 5); g.fillRect(23, 14, 3, 6); g.fillRect(27, 14, 3, 5); g.fillStyle = '#9a9aa2'; g.beginPath(); g.arc(10, 12, 5, 0, 7); g.fill(); g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(10, 12, 2, 0, 7); g.fill(); g.fillStyle = '#9a9aa2'; g.fillRect(15, 11, 13, 3); g.fillRect(24, 14, 1, 4); g.fillRect(28, 14, 1, 3); }, p);
const iconoCuchillas = p => icono32(g => { for (const [x, l] of [[7, 20], [15, 22], [23, 18]]) { g.fillStyle = '#2a1a10'; g.fillRect(x - 3, 3, 7, l + 2); g.fillStyle = '#d0d4dc'; g.fillRect(x - 2, 4, 5, l - 8); g.fillStyle = '#ffffff'; g.fillRect(x - 2, 4, 1, l - 8); g.fillStyle = '#6a4228'; g.fillRect(x - 2, l - 3, 5, 9); } }, p);
const iconoLibro = p => icono32(g => { g.fillStyle = '#2a1a10'; g.fillRect(5, 5, 23, 23); g.fillStyle = '#2f5a6a'; g.fillRect(6, 6, 21, 21); g.fillStyle = '#efe2bf'; g.fillRect(24, 7, 3, 19); g.strokeStyle = '#c8962e'; g.lineWidth = 1.5; g.beginPath(); for (let x = 9; x < 22; x += 2) g.lineTo(x, 16 + Math.sin(x) * 3); g.stroke(); g.fillStyle = '#c8962e'; g.fillRect(6, 9, 18, 1); g.fillRect(6, 23, 18, 1); }, p);
Object.assign(OBJETOS, {
  cajas_pescado: { n: 'Cajas de pescado', noVende: true, desc: 'Tres cajas de pescado del puesto de Marta, fiadas a nombre de Rufo. Pesan y huelen.', icono: iconoCajas },
  llave_almacen: { n: 'Llave del almacén', noVende: true, desc: 'Una llave grande de hierro, con una etiqueta: «Decomisos». Estaba en el cajón del capitán.', icono: iconoLlave },
  cuchillas_rufo: { n: 'Cuchillas de Rufo', noVende: true, desc: 'Tres cuchillas de cocina envueltas en un trapo, afiladas como para cortar el aire.', icono: iconoCuchillas },
  libro_tadeo: { n: 'Libro de Corrientes', noVende: true, desc: 'El libro del viejo Tadeo: treinta años de corrientes, mareas y arrecifes de Shells Town, a lápiz y con manchas de sal.', icono: iconoLibro },
  lanza_niklas: { n: 'Lanza del padre de Niklas', noVende: true, desc: 'Una lanza de fresno con la punta de hierro negro. En el asta, una muesca por cada año que la usó su padre.', icono: p => iconoArma(arma('lanza'), p) },
});

// ---------- gente: todos con casa y agenda (vecinos.js) ----------
const GENTE_SHELLS = () => [
  { id: 'medusa', scene: 'town', at: [8, 41.6], sprite: 'forastero', dir: 'left', name: 'La Medusa Gris', barks: [], greet: () => 'El bote no espera. Yo tampoco.' },
  // la Marina
  { id: 'severin', casa: 'barracon', agenda: AG([0, 'casa'], [5, ['calle', 11.4, 36.2, 'down']], [9.5, ['calle', 35.4, 21.4, 'left']], [13, ['dentro', 'cuartel', 9.8, 6.6, 'down']], [17, ['calle', 30.4, 38.4, 'right']], [21, 'casa']),
    scene: 'town', at: [11.4, 36.2], sprite: 'severin', dir: 'down', name: 'Cadete Darío Severin', arma: 'reglamento', vel: 70,
    barks: { dia: ['Circulen.', 'Documentos, por favor.'], tarde: ['Todo en orden. De momento.'], noche: ['Ronda de noche. Sin novedad.'] },
    greet: c => F.stSeverinGolpe ? '...' : c.n <= 1 ? 'Sigues aquí. Bien: así sé dónde estás.' : pick(['¿Otra vez tú?', 'Si vas a preguntar algo, que sea rápido.']),
    topics: [
      { id: 'por', once: true, ask: '¿Por qué te hiciste marine?', a: () => ['Porque alguien tiene que poner orden. Donde no hay orden, mandan los que más gritan.', '...Y los que más gritan casi nunca son buena gente.'] },
      { id: 'niklas', once: true, need: () => asked('niklas', 'marina'), ask: '¿Conoces a Niklas Brand?', a: () => ['(Se le endurece la cara.)', 'Fuimos compañeros de litera en la academia. Él hizo lo que creía correcto y yo hice lo que era correcto.', 'No siempre es lo mismo. Ya lo aprenderás.'], learn: L('shells', 'Severin y Niklas', 'Severin y Niklas fueron compañeros en la academia. Severin firmó el parte que echó a Niklas.') },
      { id: 'estatua', once: true, ask: '¿Qué tapan en lo alto de la base?', a: () => ['El capitán Brisco. En bronce. Tres metros de capitán Brisco, mirando al pueblo desde el tejado.', '(Lo dice sin cambiar la cara, pero se le escapa un suspiro.)'] },
    ] },
  { id: 'guardia_cala', casa: 'barracon', agenda: AG([0, 'casa'], [5, ['calle', 12.4, 36.6, 'down']], [9.5, 'casa']), scene: 'town', at: [12.4, 36.6], sprite: 'marine', dir: 'down', name: 'Marine', arma: 'mosquete', barks: { dia: ['Bostezo... digo, sin novedad.'], tarde: [], noche: [] }, greet: () => 'Habla con el cadete. Yo solo sujeto el mosquete.' },
  { id: 'guardia1', casa: 'barracon', agenda: AG([0, ['calle', 31.6, 16.9, 'down']]), scene: 'town', at: [31.6, 16.9], sprite: 'marine', dir: 'down', name: 'Guardia del portón', arma: 'mosquete', barks: { dia: ['Portón de la base. Paso restringido.'], tarde: ['Mañana desfile. Llevo una semana sacando brillo a botones.'], noche: ['...'] }, greet: () => 'La base no es un paseo. Sigue tu camino.' },
  { id: 'guardia2', casa: 'barracon', agenda: AG([0, ['calle', 34.4, 16.9, 'down']]), scene: 'town', at: [34.4, 16.9], sprite: 'marine', dir: 'down', name: 'Guardia del portón', arma: 'pistola', barks: { dia: ['¿Has visto la lona del tejado? Yo tampoco sé lo que hay debajo.'], tarde: [], noche: ['...'] }, greet: () => 'Sigue tu camino.' },
  { id: 'patrulla1', casa: 'barracon', agenda: AG([0, 'casa'], [8, ['ruta', [[27.6, 24.8], [38.6, 24.8], [38.6, 18.4], [27.6, 18.4]]]], [20, 'casa']), scene: 'town', at: [27.6, 24.8], sprite: 'marine', dir: 'right', name: 'Marine de patrulla', arma: 'reglamento', barks: { dia: ['Circulen, circulen.'], tarde: ['¿Ese de ahí lleva permiso de pesca?'], noche: [] } },
  { id: 'patrulla2', casa: 'barracon', agenda: AG([0, 'casa'], [9, ['ruta', [[14, 37.6], [52, 37.6]]]], [19, 'casa']), scene: 'town', at: [14, 37.6], sprite: 'marine', dir: 'right', name: 'Marine de patrulla', arma: 'mosquete', barks: { dia: ['Nada que declarar, ¿verdad?'], tarde: [], noche: [] } },
  { id: 'ruiz', casa: 'barracon', agenda: AG([0, 'casa'], [14, ['dentro', 'cantina', 11.4, 4.9, 'down']], [22, 'casa']), scene: 'cantina', at: [11.4, 4.9], sprite: 'marine', dir: 'down', name: 'Cabo Ruiz', barks: { dia: [], tarde: ['¡Otra mano! Esta vez sí que pierdes, Calma.', '(El cabo Ruiz se rasca la oreja y sonríe.)'], noche: [] }, greet: () => '¿Juegas? No, tú no tienes cara de tener dinero.' },
  { id: 'pardo', casa: 'cuartel', agenda: AG([0, ['dentro', 'cuartel', 3.2, 6.9, 'down']]), scene: 'cuartel', at: [3.2, 6.9], sprite: 'sargento', dir: 'down', name: 'Sargento Pardo', arma: 'reglamento',
    barks: { dia: ['¡Firmes! ...Ah, eres un civil.'], tarde: ['Papeles, papeles y más papeles.'], noche: ['Zzz...'] },
    greet: () => F.stDentro ? 'Zzz... ¿el desfile? ...cinco minutos más, mamá...' : '¿Asuntos con la base? Aquí no se te ha perdido nada, salvo que vengas a alistarte.' },
  { id: 'brisco', casa: 'cuartel', agenda: AG([0, 'casa'], [9, ['dentro', 'cuartel', 8.5, 1.1, 'down']], [11.5, ['calle', 34.6, 21.2, 'left']], [13, ['dentro', 'cuartel', 8.5, 1.1, 'down']], [19, 'casa']), scene: 'cuartel', at: [8.5, 1.1], sprite: 'brisco', dir: 'down', name: 'Capitán Pelayo Brisco', arma: 'sable',
    barks: { dia: ['¡Mañana, la historia!', '¿Ese botón está torcido? ¡Ese botón está torcido!'], tarde: ['El vicealmirante quedará conmovido. Conmovido.'], noche: [] },
    greet: c => c.n === 0 ? '¿Ha visto usted lo que hay en lo alto de la base? ¡Todavía no! Nadie lo ha visto. Mañana, mañana todo Shells Town lo verá.' : '¿Otra vez usted? Admiro su interés por el arte.',
    topics: [{ id: 'estatua', once: true, ask: '¿Qué hay debajo de la lona del tejado?', a: () => ['¡Yo! En bronce. Tres meses de trabajo del mejor escultor del East Blue.', 'Mirando a Shells Town desde lo alto, para que nadie olvide quién lo protege.', 'Me costó la paga de un año. Pero el reconocimiento no tiene precio.', '(Lo piensa.) Bueno, sí. El de la estatua.'] }] },
  // los candidatos
  { id: 'rufo', casa: 'cantina', agenda: AG([0, 'casa'], [7, ['dentro', 'cantina', 8.6, 1.5, 'down']], [23.5, 'casa']), scene: 'cantina', at: [8.6, 1.5], sprite: 'rufo', dir: 'down', name: 'Rufo Brasa',
    barks: { dia: ['¡Guiso de almejas, recién hecho!', '¡Ese caldo no se remueve solo!'], tarde: ['Hoy hay pulpo. Ayer también. Mañana, quién sabe.'], noche: ['Última ronda y a la cama.'] },
    greet: c => F.stCompa === 'rufo' ? '¡Mañana a las once menos cuarto en la puerta! Con hambre, que en las misiones se piensa mejor comido.' : F.stCompa ? '¡Buena suerte en Goa! Si vuelves, tu plato te espera.' : c.n === 0 ? '¡Eh, tú! Tienes cara de no haber desayunado. Siéntate, que esto no muerde.' : pick(['¡Mi pinche favorito!', '¿Hambre? Siempre hay hambre.']),
    first: L('gente', 'Rufo Brasa', 'Cocinero y dueño de la cantina El Caldero. Grande como una puerta, se ríe como un trueno. No soporta ver a nadie con hambre.'),
    topics: [
      { id: 'sitio', once: true, ask: '¿Qué sitio es este?', a: () => ['El Caldero. La mejor cantina de Shells Town.', 'Bueno, la única. Pero si hubiera otra, seguiría siendo la mejor.'] },
      { id: 'cuchillas', once: true, need: () => asked('rufo', 'sitio'), ask: '¿Por qué cocinas con un cuchillo de untar?', a: () => ['(Mira el cuchillito y suspira.)', 'Porque mis cuchillas las tiene la Marina. Un marine se zampó tres platos y se fue sin pagar. Le di con la sartén.', 'Con la sartén, ¿eh? No con las cuchillas. Pero se las llevaron igual, «como prueba». Están en el almacén de decomisos de la base.'],
        learn: L('shells', 'Las cuchillas de Rufo', 'La Marina le confiscó a Rufo sus cuchillas de cocina. Las guardan en el almacén de decomisos de la base.') },
      { id: 'trabajo', once: true, ask: 'Busco trabajo.', a: () => (encargo('Pescado para Rufo', 'Rufo me ha pedido que recoja tres cajas de pescado en el puesto de Marta, en el mercado del muelle.'), F.stRufoEnc = true,
        ['¿Trabajo? Tengo trabajo para diez y manos para uno.', 'Ve al mercado del muelle y pídele a Marta tres cajas de pescado a mi nombre. Me las fía.', 'Y si ves al cadete rubio, da un rodeo. Le debo un plato... o él me lo debe a mí, ya no me acuerdo.']) },
      { id: 'entrega', once: true, need: () => tiene('cajas_pescado'), ask: 'Aquí tienes el pescado.', a: () => { quitarObjeto('cajas_pescado'); cobrar(60); S.comido = Math.max(S.comido || 0, 12); F.stRufoHecho = true; encargoHecho('Pescado para Rufo', 'Rufo me pagó sesenta berries y un plato de guiso.');
        return ['(Deja las cajas en la cocina de un golpe.) ¡Eso es pescado y no lo de ayer!', 'Toma. Sesenta berries. Y un plato de guiso, que se te ven las costillas.', '(El guiso está tan bueno que se te olvida por un momento dónde estás.)']; }, aff: () => 2 },
      { id: 'sueno', once: true, need: () => F.stRufoHecho, ask: '¿Siempre quisiste ser cocinero?', a: () => ['Siempre quise ser cocinero de barco. De un barco que fuera a todas partes.', 'Quiero hacer un plato con algo de cada mar. Del East Blue, del West, del North, del South... y del Grand Line, que dicen que allí los peces vuelan.', 'Aquí, en Shells Town, lo más exótico que llega es el bacalao.'], aff: () => 1,
        learn: L('shells', 'El sueño de Rufo', 'Rufo quiere ser cocinero de un barco que vaya a todas partes y hacer un plato con algo de cada mar.') },
      { id: 'unete', need: () => F.stRufoHecho && !F.stCompa, ask: 'Vente conmigo. Mañana zarpo a Goa.', a: () => ['(Rufo deja de remover el caldo.)', '¿A Goa? ¿Y quién cocina aquí?', '(Mira la cocina vacía, las mesas vacías, la cantina vacía.)', '...Nadie, la verdad. La cantina es del banco desde el invierno. Solo faltaba que me lo dijeran por escrito.', 'Vale. Pero sin mis cuchillas no voy ni a la esquina.', 'Mañana a las once es el desfile por el vicealmirante, y a mí me han encargado el banquete de la base. Entro por la puerta de servicio, con el carro.', 'Tú vienes de pinche. Recogemos las cuchillas del almacén y salimos antes de que nadie pruebe la sopa.', 'Te espero en la puerta de la cantina a las once menos cuarto.'], then: () => unirse('rufo') },
      { id: 'tienda', ask: '¿Qué hay de comer?', tienda: 'celes' },
    ] },
  { id: 'nerea', casa: 'practico', agenda: AG([0, 'casa'], [7, ['calle', 33.1, 42.2, 'right']], [13, 'casa'], [14, ['dentro', 'cantina', 12.4, 6.9, 'up']], [22, 'casa']), scene: 'town', at: [33.1, 42.2], sprite: 'iria', dir: 'right', name: 'Nerea Calma',
    barks: { dia: ['¡Dos cuartas a babor! ¡Más! ¡Así!', '(Nerea silba una señal larga al pesquero que entra.)'], tarde: ['Pago. Y subo.', '(Nerea baraja sin mirar las cartas.)'], noche: [] },
    greet: c => F.stCompa === 'nerea' ? 'Mañana, a las once menos cuarto, en el portón. Cara de ayudante de práctico: es decir, de no entender nada.' : F.stCompa ? 'Que el mar te sea leve. Lo será: lo he mirado.' : c.n === 0 ? (hourNow() < 13.5 ? 'Si vas a cruzar el muelle, no pises la cuerda. Estoy metiendo un pesquero entre los arrecifes.' : '¿Vienes a jugar o a mirar? Si es a mirar, siéntate detrás de mí. Da suerte.') : pick(['¿Qué hay?', '(Nerea te guiña un ojo sin dejar de mirar el mar.)']),
    first: L('gente', 'Nerea Calma', 'La práctica del puerto: guía los barcos entre los arrecifes de Shells Town. Por las tardes gana a las cartas en El Caldero. Nunca parece tener prisa.'),
    topics: [
      { id: 'que', once: true, ask: '¿A qué te dedicas?', a: () => ['Soy la práctica del puerto. Cuando un barco quiere entrar en Shells Town, lo guío entre los arrecifes. Sin mí, la mitad acabaría en el fondo.', 'Y por las tardes juego a las cartas. Se me da mejor que guiar barcos. Y paga más.'] },
      { id: 'tadeo', once: true, need: () => asked('nerea', 'que'), ask: '¿Quién te enseñó?', a: () => ['El viejo Tadeo. Treinta años de práctico. Conocía cada corriente de esta costa por su nombre.', 'El invierno pasado metió en el puerto un barco pirata en plena tormenta. Veinte personas a bordo, la mitad críos. Si no lo mete, se hunden.', 'El capitán Brisco lo encerró por «colaborar con piratas» y le quitó su Libro de Corrientes. Tadeo está en un calabozo de Loguetown. El libro, en el almacén de la base.'],
        learn: L('shells', 'El viejo Tadeo', 'Tadeo, el maestro de Nerea, salvó a veinte personas de un barco pirata en una tormenta. Brisco lo encerró y le quitó su Libro de Corrientes, que está en el almacén de la base.') },
      { id: 'sueno', once: true, need: () => asked('nerea', 'tadeo'), ask: '¿Y tú qué quieres?', a: () => ['Cruzar un Calm Belt. Allí el mar se queda quieto y no sopla el viento. Nadie lo cruza porque nadie sabe leer un mar quieto.', 'Tadeo decía que hasta el agua quieta tiene corrientes. Que solo hay que saber escucharlas. Quiero comprobarlo.'], aff: () => 1,
        learn: L('shells', 'El sueño de Nerea', 'Nerea quiere cruzar un Calm Belt, donde el mar se queda quieto. Su maestro decía que hasta el agua quieta tiene corrientes.') },
      { id: 'cartas', need: () => asked('nerea', 'tadeo') && !F.stNereaHecho && G.scene.startsWith('cantina') && P('ruiz').scene === G.scene, ask: 'Te veo perder mucho contra ese cabo.', a: () => (encargo('La partida del cabo', 'El cabo Ruiz le gana siempre a Nerea a las cartas en El Caldero. Nerea cree que hace trampas.'), ['El cabo Ruiz. Gana siempre. Nadie gana siempre.', 'Siéntate a mi lado y mírale las manos. Si lo pillas haciendo trampa, el bote es mío. Bueno: nuestro.']), then: () => partidaCartas() },
      { id: 'cartas_info', need: () => asked('nerea', 'tadeo') && !F.stNereaHecho && !G.scene.startsWith('cantina'), ask: '¿Dónde juegas a las cartas?', a: () => ['En El Caldero, a partir de las dos. Contra el cabo Ruiz, que gana siempre.', 'Nadie gana siempre. Ven a mirar y me dices qué ves.'] },
      { id: 'unete', need: () => F.stNereaHecho && !F.stCompa, ask: 'Vente conmigo. Mañana zarpo a Goa.', a: () => ['(Nerea baraja sin mirar las cartas.)', '¿Un barco que todavía no existe, con alguien al mando que no sabe ni hacer un nudo?', '...Las mejores apuestas son las que todo el mundo da por perdidas.', 'Pero el Libro de Tadeo viene conmigo. Mañana tengo que llevar a la base la tabla de mareas para el barco del vicealmirante: me dejan pasar por el portón.', 'Te espero en el portón a las once menos cuarto. Y trae cara de ayudante de práctico. Es decir: de no entender nada.'], then: () => unirse('nerea') },
    ] },
  { id: 'niklas', casa: 'almacen_c', agenda: AG([0, 'casa'], [7, ['calle', 26.4, 37.9, 'down']], [13.5, ['calle', 36.4, 35, 'right']], [20, ['dentro', 'cantina', 9.6, 8.6, 'up']], [23, 'casa']), scene: 'town', at: [26.4, 37.9], sprite: 'tobi', dir: 'down', name: 'Niklas Brand',
    barks: { dia: ['¡Una! ¡Dos! ¡Arriba!', 'Esta caja pesa como un remordimiento.'], tarde: ['¡Siguiente! ¿Nadie?', '¡Pago doble al que me tumbe!'], noche: ['...'] },
    greet: c => F.stCompa === 'niklas' ? 'Mañana, muralla oeste, junto a la leña, a las once menos cuarto. Trae ropa vieja: el desagüe no perdona.' : F.stCompa ? 'Si un día necesitas un puño de más, ya sabes dónde estoy.' : c.n === 0 ? '¿Qué miras? Si vienes a por pelea, es por la tarde y en el Foso. Si vienes a por cajas, ayúdame a cargar.' : pick(['¡Eh!', '¿Qué hay?']),
    first: L('gente', 'Niklas Brand', 'Estibador por la mañana y luchador del Foso por la tarde. Fue recluta de la Marina hasta que lo echaron. Se ríe fuerte y pega más fuerte.'),
    topics: [
      { id: 'marina', once: true, ask: '¿Es verdad que fuiste marine?', a: () => ['Seis meses en la academia. Me echaron por darle un puñetazo a un teniente.', 'El teniente le estaba pegando a un pescador viejo por no apartarse. Yo me aparté para pegarle a él.', 'Mi compañero de litera, Darío Severin, me dijo que había hecho lo correcto. Y después firmó el parte. Así es la Marina.'] },
      { id: 'lanza', once: true, ask: '¿Peleas sin arma?', a: () => ['Peleaba con la lanza de mi padre. Al echarme, la Marina se la quedó: «material del cuerpo».', 'No era del cuerpo. Era de mi padre. La tienen en el almacén de decomisos de la base.'],
        learn: L('shells', 'La lanza de Niklas', 'Al echarlo de la Marina, le quitaron a Niklas la lanza de su padre. Está en el almacén de decomisos de la base.') },
      { id: 'foso', need: () => !F.stFosoPeleado && enFoso(), ask: 'Quiero pelear en el Foso.', a: () => (encargo('El Foso', 'Niklas organiza peleas en el Foso, junto a los almacenes. Cincuenta berries por victoria.'), ['¡Eso es hablar! Dos asaltos contra Bruto. Si ganas, cincuenta berries.', 'Si pierdes, te ríes y te levantas. Aquí nadie se queda en el suelo.']), then: () => pelearFoso() },
      { id: 'foso_info', need: () => !F.stFosoPeleado && !enFoso(), ask: '¿Qué es el Foso?', a: () => ['El ring de arena entre los almacenes. Por las tardes, a partir de la una y media, se pelea por dinero.', 'Ven por la tarde si tienes agallas.'] },
      { id: 'contra', once: true, need: () => F.stFosoPeleado && enFoso(), ask: 'Pelea conmigo tú, Niklas.', a: () => ['(Se le ilumina la cara.)', 'Por fin alguien con agallas. Si me tumbas, te escucho. Si te tumbo, también. Hoy estoy de buenas.'], then: () => pelearNiklas() },
      { id: 'unete', need: () => F.stNiklasHecho && !F.stCompa, ask: 'Vente conmigo. Mañana zarpo a Goa.', a: () => ['(Niklas se queda callado. Después se ríe, fuerte.)', '¿Pirata? ¿Yo? Mi padre me mataría. Bueno, si estuviera vivo.', 'Vale. Pero la lanza de mi padre viene conmigo.', 'Sé de un desagüe que pasa por debajo de la muralla, por el lado oeste. Mañana, con el desfile, la base estará medio vacía.', 'Nos vemos en la muralla oeste, junto al montón de leña, a las once menos cuarto.'], then: () => unirse('niklas') },
    ] },
  { id: 'bruto', casa: 'almacen_e', agenda: AG([0, 'casa'], [13.5, ['calle', 41.2, 35, 'left']], [20, ['dentro', 'cantina', 4.6, 8.8, 'up']], [23, 'casa']), scene: 'town', at: [41.2, 35], sprite: 'maton', dir: 'left', name: 'Bruto', barks: { dia: [], tarde: ['¡Al Foso! ¡Al Foso!', '(Bruto hace crujir el cuello.)'], noche: [] }, greet: () => '¿Peleas o miras? Mirar es gratis. Pelear, también, pero duele.' },
  // la gente del puerto y de la ciudad
  { id: 'quill', casa: 'almacen_e', agenda: AG([0, 'fuera'], [7, ['calle', 42.8, 47.5, 'down']], [20, ['dentro', 'cantina', 12.6, 8.8, 'left']], [23, 'fuera']), scene: 'town', at: [42.8, 47.5], sprite: 'quill', dir: 'down', name: 'Capitana Hesper Quill',
    barks: { dia: ['¡Ese barril, con cuidado, que es aceite!', '¡Estiba, no tiro al blanco!'], tarde: ['Mañana con la marea. Ni un minuto más.'], noche: [] },
    greet: c => c.n === 0 ? '¿Carga, pasaje o curiosidad? Las dos primeras se pagan.' : 'Mañana a mediodía. Con la marea o sin ti.',
    topics: [
      { id: 'pasaje', once: true, ask: '¿Vas a Goa?', a: () => (encargo('Pasaje a Goa', 'La Tortuga Parda zarpa mañana a mediodía hacia Goa. La capitana Quill cobra trescientos berries por persona, al subir.'), ['Mañana a mediodía, con la marea. Trescientos berries por cabeza, se paga al subir.', 'No pregunto nombres ni de dónde viene nadie. Pregunto si el dinero es de verdad.']) },
      { id: 'barco', once: true, ask: '¿Qué lleva la Tortuga?', a: () => ['Sal, aceite, telas y paciencia. Mucha paciencia: no es rápida, pero llega.', 'Treinta años navegando y nunca me han hundido. Me han robado dos veces, eso sí.'] },
    ] },
  { id: 'marinero', casa: 'almacen_e', agenda: AG([0, 'fuera'], [7, ['calle', 39.4, 47.5, 'down']], [20, 'fuera']), scene: 'town', at: [39.4, 47.5], sprite: 'navegante', dir: 'down', name: 'Marinera de la Tortuga', barks: { dia: ['¡Cabo listo!', 'Otra caja de sal. Siempre sal.'], tarde: [], noche: [] }, greet: () => 'Sin pasaje no se sube. Habla con la capitana.' },
  { id: 'celes', casa: 'posada', agenda: AG([0, ['dentro', 'posada', 8.4, 1.2, 'down']]), scene: 'posada', at: [8.4, 1.2], sprite: 'tabernera', dir: 'down', name: 'Doña Celes',
    barks: { dia: ['¡La Concha, camas limpias y sin pulgas! Casi.'], tarde: ['¿Cama? ¿Cena? ¿Las dos?'], noche: ['Silencio, que hay gente durmiendo.'] },
    greet: c => c.n === 0 ? 'Bienvenido a La Concha. Cama, veinte berries. Rumores, gratis.' : pick(['¿Qué te pongo, cielo?', 'Aquí estoy, como siempre.']),
    topics: [
      { id: 'cama', need: () => F.stCama !== diaS(), ask: 'Quiero una cama para esta noche. (20 ฿)', a: () => pagar(20) ? (F.stCama = diaS(), ['La habitación del fondo. Las sábanas son nuevas. Bueno, casi nuevas.', 'Puedes dormir cuando quieras: túmbate en la cama.']) : ['Sin veinte berries no hay colchón, cielo. Pero la playa es gratis.'] },
      { id: 'rumores', ask: '¿Qué se cuenta?', a: () => F.estatua === 'rota' ? ['...'] : ['Lalo dice que vio un barco negro en la cala. Ayer vio una sirena. La semana pasada, al Rey de los Piratas resucitado.', 'Lo que sí es verdad: mañana viene un vicealmirante. El capitán Brisco lleva tres días sin dormir.', 'Y en lo alto de la base, tapada con una lona... Dicen que es una estatua suya. De bronce macizo. Dicen que le costó la paga de un año.'],
        learn: L('rumores', 'El desfile', 'Mañana viene un vicealmirante a Shells Town. Habrá desfile y se destapará una estatua del capitán Brisco en lo alto de la base.') },
      { id: 'comer', ask: '¿Qué hay de cenar?', tienda: 'celes' },
    ] },
  { id: 'ulloa', casa: 'casa_a5', agenda: AG([0, 'casa'], [9, ['dentro', 'pertrechos', 4, 4.2, 'down']], [13, ['calle', 37, 20.8, 'down']], [16, ['dentro', 'pertrechos', 4, 4.2, 'down']], [20, 'casa']), scene: 'pertrechos', at: [4, 4.2], sprite: 'v_comerciante', dir: 'down', name: 'Don Anselmo Ulloa',
    barks: { dia: ['Cabos, lonas, anzuelos. Lo que el mar pide.'], tarde: [], noche: [] }, greet: () => 'Lo que un barco necesita, y lo que no sabe que necesita.', topics: [{ id: 'tienda', ask: 'Quiero ver lo que tienes.', tienda: 'ulloa' }] },
  { id: 'marta', casa: 'casa_b5', agenda: AG([0, 'casa'], [7, ['calle', 13.6, 38.6, 'right']], [14, 'casa'], [18, ['calle', 44.6, 32.6, 'down']], [21, 'casa']), scene: 'town', at: [13.6, 38.6], sprite: 'pescadora', dir: 'right', name: 'Marta',
    barks: { dia: ['¡Sardinas, que saltan solas!', '¡Pescado fresco, del de hoy!'], tarde: [], noche: [] }, greet: () => '¿Qué te pongo? Si es fiado, ni lo pidas.',
    topics: [{ id: 'rufo', once: true, need: () => F.stRufoEnc && !F.stRufoHecho, ask: 'Vengo de parte de Rufo.', a: () => (darObjeto('cajas_pescado'), ['¿Rufo? ¿Otra vez fiado?', '(Suspira y te carga tres cajas.) Dile que ya me debe media ballena.']) }] },
  { id: 'lalo', casa: 'casa_a6', agenda: AG([0, 'casa'], [6, ['calle', 9.6, 39.2, 'down']], [9, ['calle', 29.2, 21, 'down']], [18, ['dentro', 'cantina', 2.6, 8.8, 'up']], [22, 'casa']), scene: 'town', at: [9.6, 39.2], sprite: 'viejo', dir: 'down', name: 'Lalo',
    barks: { dia: ['¡Un barco negro! ¡En la cala! ¡Lo he visto con estos ojos!', '¡Con un gigante encapuchado, os lo juro!'], tarde: ['Nadie me cree. Nunca nadie me cree.'], noche: ['¿Has oído eso? ...Nada. Será el mar.'] },
    greet: () => '¿Tú también vienes a reírte de mí?',
    topics: [{ id: 'barco', once: true, ask: '¿Qué viste exactamente?', a: () => ['Un barco negro como el carbón, con velas de humo. Y un gigante con capucha, de tres metros. ¡Y un crío!', '(Te mira de arriba abajo.) ...Un crío más o menos como tú, ahora que lo pienso.', '(Entorna los ojos.) No, no. El crío era más feo.'], learn: L('shells', 'El pirata de la cala', 'Lalo vio la Corneja en la cala y se lo ha contado a todo el pueblo. Por suerte, nadie le cree... del todo.') }] },
  { id: 'amaro', casa: 'casa_a3', agenda: AG([0, 'casa'], [8, ['calle', 21.6, 38.7, 'up']], [12, 'casa'], [16, ['calle', 36.8, 21.3, 'down']], [19, 'casa']), scene: 'town', at: [21.6, 38.7], sprite: 'vecina', dir: 'up', name: 'Viuda Amaro', barks: { dia: ['Este pescado ayer valía la mitad.', '¿Has visto qué cara traía el capitán?'], tarde: ['Una estatua. Con lo que hace falta un tejado nuevo en la escuela.'], noche: [] }, greet: () => 'Buenos días. Si es que lo son.' },
  { id: 'pipo', casa: 'casa_b4', agenda: AG([0, 'casa'], [9, ['ruta', [[30.4, 21.4], [35.6, 21.4], [35.6, 24], [30.4, 24]]]], [13, 'casa'], [15, ['ruta', [[30.4, 21.4], [35.6, 21.4], [35.6, 24], [30.4, 24]]]], [19, 'casa']), scene: 'town', at: [30.4, 21.4], sprite: 'nino', dir: 'right', name: 'Pipo Vidal', barks: { dia: ['¡Bum! ¡Te he dado!', '¡Yo seré vicealmirante!'], tarde: ['¿Tú has visto un pirata de verdad?'], noche: [] }, greet: () => '¿Eres un pirata? Lalo dice que hay un pirata en la cala.' },
  // vecinos de paso (algunos saludan)
  { id: 'tomas', casa: 'casa_a1', agenda: AG([0, 'casa'], [6, ['calle', 26.8, 40.4, 'down']], [12, 'casa'], [14, ['calle', 23.8, 41.8, 'down']], [18, ['dentro', 'cantina', 2.4, 6.2, 'right']], [21.5, 'casa']), scene: 'town', at: [26.8, 40.4], sprite: 'v_pescador', dir: 'down', name: 'Tomás Llanes', barks: { dia: ['Esta red tiene más agujeros que mi bolsillo.'], tarde: ['Hoy no pican.'], noche: [] }, greet: () => 'Buen día. Si buscas trabajo, aquí sobra red y falta pescado.' },
  { id: 'lucia', casa: 'casa_a1', agenda: AG([0, 'casa'], [8, ['calle', 19.4, 38.8, 'up']], [12, 'casa'], [16, ['calle', 29.2, 23.8, 'up']], [19, 'casa']), scene: 'town', at: [19.4, 38.8], sprite: 'v_moza', dir: 'up', name: 'Lucía Llanes', barks: { dia: ['¿Y este precio? ¿Es broma?'], tarde: ['Tomás, ¿has visto qué hora es?'], noche: [] } },
  { id: 'ines', casa: 'casa_b1', agenda: AG([0, 'casa'], [6, ['calle', 17.2, 38.8, 'up']], [13, 'casa'], [17, ['dentro', 'posada', 3.2, 7.6, 'up']], [21, 'casa']), scene: 'town', at: [17.2, 38.8], sprite: 'v_panadera', dir: 'up', name: 'Inés Oria', barks: { dia: ['¡Pan del día! ¡Calentito!'], tarde: [], noche: [] }, greet: () => '¿Pan? Del de esta mañana, tierno todavía.' },
  { id: 'abuela', casa: 'casa_b4', agenda: AG([0, 'casa'], [10, ['calle', 29.2, 23.9, 'up']], [13, 'casa'], [16, ['calle', 36.8, 23.9, 'up']], [19, 'casa']), scene: 'town', at: [29.2, 23.9], sprite: 'v_anciana', dir: 'up', name: 'Abuela Vidal', barks: { dia: ['Pipo, no corras.', 'En mis tiempos el capitán no tenía estatua.'], tarde: ['Pipo, ¡a casa!'], noche: [] }, greet: () => 'Siéntate, joven. Las piernas ya no me aguantan las colas del mercado.' },
  { id: 'ramon', casa: 'casa_b3', agenda: AG([0, 'casa'], [7, ['calle', 25.4, 31.6, 'down']], [13, 'casa'], [15, ['calle', 25.4, 31.6, 'down']], [20, ['dentro', 'cantina', 6, 8.6, 'up']], [23, 'casa']), scene: 'town', at: [25.4, 31.6], sprite: 'v_herrero', dir: 'down', name: 'Ramón Pons', arma: 'martillo', barks: { dia: ['(¡Clang! ¡Clang!)', 'Hierro caliente, palabras frías.'], tarde: ['(¡Clang!)'], noche: [] }, greet: () => 'Herraduras, anclas, clavos. Espadas no: eso es cosa de la Marina.' },
  { id: 'jaime', casa: 'casa_b6', agenda: AG([0, 'casa'], [7, ['calle', 24.6, 37.2, 'down']], [13, 'casa'], [15, ['calle', 44.8, 35.2, 'left']], [20, ['dentro', 'cantina', 4.6, 6.2, 'right']], [23, 'casa']), scene: 'town', at: [24.6, 37.2], sprite: 'v_estibador', dir: 'down', name: 'Jaime Sastre', barks: { dia: ['¡Arriba esa caja!'], tarde: ['Me duele la espalda hasta en sueños.'], noche: [] } },
  { id: 'goyo', casa: 'almacen_o', agenda: AG([0, 'casa'], [7, ['calle', 16.6, 37.2, 'down']], [14, ['calle', 43.6, 35.4, 'left']], [19, ['dentro', 'cantina', 8.2, 6.2, 'left']], [23, 'casa']), scene: 'town', at: [16.6, 37.2], sprite: 'v_estibador', dir: 'down', name: 'Goyo', barks: { dia: ['Sal, sal y más sal.'], tarde: [], noche: [] } },
  { id: 'clara', casa: 'casa_b6', agenda: AG([0, 'casa'], [9, ['calle', 52.6, 31.8, 'down']], [12, 'casa'], [17, ['calle', 36.6, 23.9, 'up']], [20, 'casa']), scene: 'town', at: [52.6, 31.8], sprite: 'v_moza', dir: 'down', name: 'Clara Sastre', barks: { dia: ['Si llueve hoy, me tiro al mar.'], tarde: [], noche: [] } },
  { id: 'artillero', casa: 'barracon', agenda: AG([0, 'casa']), scene: 'town', at: [36, 14], sprite: 'marine', dir: 'down', name: 'Artillero', barks: [] },
];
const enFoso = () => hourNow() >= 13.5 && hourNow() < 20 && diaS() === 0;
const openBase = () => !!F.stDentro;

// ---------- objetos de la isla ----------
const OBJETOS_SHELLS = () => [
  { scene: 'town', at: [38.3, 18.9], label: 'Leer', act: () => narr(['«Por orden del capitán Pelayo Brisco: mañana, a las once, desfile en honor del vicealmirante de visita e inauguración del monumento al capitán Pelayo Brisco, en lo alto de la base.»',
    ...(F.stControl ? ['Debajo, un dibujo a carboncillo: un gigante con capucha y un crío con la cabeza enorme. «SE BUSCA: EL PIRATA DE LA CALA». Firmado: Lalo.', '(El crío del dibujo no se te parece en nada. Casi en nada.)'] : [])]) },
  { scene: 'town', at: [33, 23.2], label: 'Mirar', act: () => narr(['Una fuente de piedra con el agua verdosa. Alguien ha tirado monedas al fondo: la mayoría son botones de uniforme.']) },
  { scene: 'town', at: [33, 18.4], label: 'Mirar arriba', act: () => narr(F.estatua === 'rota' ? ['En lo alto de la base ya no hay estatua: quedan dos botas de bronce sobre el tejado, como si el capitán se hubiera ido descalzo.'] : ['En lo alto del cuartel, sobre el tejado, una figura enorme tapada con una lona y atada con cuerdas. Por debajo asoma una bota de bronce del tamaño de un barril.', 'Desde la plaza, todo el pueblo la tiene encima. Supongo que de eso se trata.']) },
  { scene: 'town', at: [7.4, 41.4], label: 'Dormir en la arena', si: () => diaS() === 0 && hourNow() >= 19, act: () => dormir('cala') },
  { scene: 'posada', at: [1.3, 3.8], label: 'Dormir', si: () => F.stCama === diaS() && diaS() === 0, act: () => dormir('posada') },
  { scene: 'cuartel', at: [10.6, 2.3], label: 'Abrir el cajón', si: () => F.stDentro && !tiene('llave_almacen') && !F.stTengo, act: () => { darObjeto('llave_almacen'); narr(['En el cajón del capitán: un peine, tres cartas de amor sin enviar, un retrato del propio capitán... y una llave grande con una etiqueta: «Decomisos».']); } },
  { scene: 'cuartel', at: [17.2, 2.6], label: 'Buscar', si: () => F.stDentro && !F.stTengo && tiene('llave_almacen'), act: () => recuperar() },
  { scene: 'cuartel', at: [3.2, 7.7], label: 'Mirar', si: () => F.stDentro, act: () => narr(['El sargento Pardo duerme con la boca abierta, sentado en la guardia. En la mesa, un plato con migas y una nota: «Despertarme a las doce».']) },
  { scene: 'town', at: [40.8, 15.2], label: 'Mirar', si: () => F.stDentro, act: () => narr(['El poste del patio. Las cuerdas están gastadas de tanto atar a gente. Dicen que hubo un tiempo en que había alguien atado aquí semanas enteras.']) },
  { scene: 'town', at: [16.6, 12.4], label: 'Entrar por el desagüe', si: () => F.stCompa === 'niklas' && F.stDesfile && !F.stDentro, act: () => entrarBase() },
];

// ---------- llegada (cinemática) ----------
async function llegadaShells() {
  G.paused = true; F.navegando = false; await irAIsla('shells');
  const d0 = Math.floor(G.minutes / 1440) + 1; G.minutes = d0 * 1440 + 5.5 * 60; F.stD0 = d0; F.stLlegada = true; F.stBote = true; F.stBoteT0 = 0; WORLD.estatua = 'tapada';
  vecinosTick(true); const m = P('medusa'); moveNpc(m, 'town', [8.1, 41.8], 'left'); enter('town', aPx(7.2, 42.2), 'right');
  cineOn(); G.foco = aPx(7.6, 42); await esperar(900);
  await camara(aPx(30, 14), 2200); await esperar(400); bubble(m, 'Shells Town. La base de la Marina, en lo alto.', 2400); await esperar(2200); await camara(aPx(7.6, 42), 1600); cineOff();
  m.dir = 'left'; G.dir = 'right';
  say(m, { lines: ['Hasta aquí te llevo. Shells Town está detrás de esa loma.', 'Desde aquí salen mercantes a Goa. Busca a Ama Sel. Y no le digas a nadie quién te ha traído.', '(Te pone una bolsita en la mano.) Ciento cincuenta berries. No es un regalo: es un préstamo. Me lo devolverás cuando tengas un barco con bandera.'],
    opts: [{ t: '¿Volveré a verte?', then: () => despedida('Cuando estés listo. O cuando no lo estés y haga falta.') }, { t: 'Gracias. Por todo.', then: () => despedida('No me des las gracias todavía. Dámelas cuando sigas vivo.') }] });
}
async function despedida(linea) { const m = P('medusa');
  await dialogo(m, [linea]); cineOn(); cobrar(150);
  await anda(m, aPx(6.6, 43.2), 60); await globo(m, '(Se para sin girarse.)', 1500);
  await dialogo(m, ['Una cosa más: aquí hay base de la Marina. Si alguien te pregunta por mí, no me conoces.', 'Y si alguien te pregunta por la Medusa Gris... tampoco.']);
  await anda(m, aPx(5.4, 43.8), 60); m.scene = 'none'; F.stBoteT0 = performance.now(); await esperar(2600); emote(G, '…', 2000); await esperar(2200); cineOff();
  learn(['yo', 'En Shells Town', 'La Medusa Gris me dejó al amanecer en una cala, detrás de Shells Town, con ciento cincuenta berries prestados. Tengo que encontrar la manera de llegar a Goa.']);
  later(4000, () => { F.stBote = false; F.stMedusaFuera = true; guardarAuto(); }); }

// ---------- el control del cadete (cinemática corta) ----------
async function control() { const s = P('severin'), g1 = P('guardia_cala'); F.stControl = 'en curso'; s.quieto = true; s.camino = null; cineOn(); emote(s, '!'); bubble(s, '¡Alto ahí!', 1600);
  await camara([(s.x + G.x) / 2, (s.y + G.y) / 2], 700); await anda(s, [G.x + 30, G.y - 6], 120); s.dir = dirTo(s, G); G.dir = dirTo(G, s); if (g1) g1.dir = dirTo(g1, G); cineOff(); G.foco = [(s.x + G.x) / 2, (s.y + G.y) / 2];
  say(s, { lines: ['Tú. No te había visto nunca en Shells Town. Y aquí nos conocemos todos.', 'Esta mañana un pescador ha visto un barco negro en la cala. Y ahora apareces tú, viniendo justo de la cala.', '¿Quién eres y qué haces aquí?'],
    opts: [{ t: 'Soy pescador. Vengo de Kalé con mi bote.', then: () => controlFin('mentira', ['¿De Kalé? ¿En un bote? (Mira tus manos.) Esas manos no han tirado una red en su vida.', 'No te creo. Pero tampoco tengo pruebas. Todavía.']) },
      { t: 'Soy el pirata más temido del East Blue.', then: () => { if (g1) emote(g1, '!'); controlFin('broma', ['(El marine que lo acompaña se ríe. Severin no.)', 'Muy gracioso. Me acordaré de la gracia.']); } },
      { t: 'Busco un barco que me lleve a Goa.', then: () => controlFin('verdad', ['A Goa sale la Tortuga Parda mañana a mediodía. Hasta entonces, no te metas en líos.', '(Te mira un segundo de más.) Lo digo en serio.']) }] }); }
function controlFin(tono, lineas) { F.stTono = tono; const s = P('severin');
  say(s, { lines: [...lineas, '(Saca una libreta y apunta algo sin dejar de mirarte.)', 'Me llamo Darío Severin, cadete de la base. Si en Shells Town pasa algo raro mientras estás aquí, iré a buscarte a ti primero.'], done: () => { F.stControl = true; s.quieto = false; G.foco = null; s.lugar = null;
    learn(['gente', 'Darío Severin', 'Cadete de la Marina en Shells Town. Rubio, recto, con cara de no haber sonreído nunca. Me paró al llegar, apuntó algo en una libreta y se quedó con mi cara.']); guardarAuto(); } }); }

// ---------- encargos: el Foso y las cartas ----------
function pelearFoso() { const b = P('bruto'); b.quieto = true; G.x = 37 * T; G.y = 35 * T; b.x = 40.2 * T; b.y = 35 * T; b.scene = 'town';
  pelea({ kind: 'foso', foe: b, foeName: 'Bruto', foeMax: 60, rounds: 2, arma: S.arma, hitP: .56, dmgBase: 10, fin: f => { b.quieto = false; F.stFosoPeleado = true; if (f.won) { cobrar(50); S.aff.niklas = aff('niklas') + 1; F.stFosoGanado = true; }
      encargoHecho('El Foso', f.won ? 'Le gané a Bruto: cincuenta berries.' : 'Bruto me ganó, pero me levanté.'); const t = P('niklas');
      later(400, () => say(t, { lines: f.won ? ['¡Ja! ¡Bruto en la arena! Toma, cincuenta berries, te las has ganado.', 'Si quieres algo de verdad, pelea conmigo.'] : ['¡Te has levantado! Eso cuenta más que ganar. Bueno, casi.', 'Si quieres probar con algo más duro, pelea conmigo.'] })); },
    tx: { inicio: 'Bruto escupe en la arena y levanta los puños. Las gradas rugen.', fuerte: 'Bruto te encaja un derechazo. Ves estrellas de verdad.', flojo: 'Te roza la oreja. La gente aplaude igual.', falla: 'Bruto golpea al aire y casi se cae solo.', cae: 'Bruto se sienta en la arena y no quiere levantarse. El Foso estalla.', aturde: 'Bruto se tambalea, buscando la cuerda.', caes: 'Acabas mirando el cielo desde la arena. Alguien te echa un cubo de agua.', tablas: '¡Tiempo! Los dos en pie. El Foso abuchea, pero contento.' } }); }
function pelearNiklas() { const t = P('niklas'); t.quieto = true; G.x = 37 * T; G.y = 35 * T; t.x = 40.2 * T; t.y = 35 * T; t.scene = 'town';
  pelea({ kind: 'foso', foe: t, foeName: 'Niklas', foeMax: 75, rounds: 3, arma: S.arma, hitP: .6, dmgBase: 11, fin: f => { t.quieto = false; F.stNiklasHecho = true; S.aff.niklas = aff('niklas') + 2; if (f.won) cobrar(80);
      learn(['shells', 'Pelea con Niklas', f.won ? 'Le gané a Niklas en el Foso. Se rio más que yo.' : 'Peleé con Niklas en el Foso. Me ganó, pero me tendió la mano.']);
      later(400, () => say(t, { lines: [f.won ? '(Niklas se levanta riéndose, con la nariz roja.) ¡Me has tumbado! Ochenta berries, la bolsa es tuya.' : '(Niklas te levanta de un tirón.) No está mal. Aguantas como una mula.', 'Hacía tiempo que nadie peleaba así conmigo. Sin miedo y sin trampas.', 'Dime una cosa: ¿qué haces de verdad en Shells Town?'] })); },
    tx: { inicio: 'Niklas salta de un pie a otro, sonriendo. «Venga, que no muerdo. Mucho.»', fuerte: 'Niklas te mete un gancho en las costillas. Pega como un marine. Como un exmarine.', flojo: 'Un jab rápido en el hombro. Niklas se ríe.', falla: 'Niklas falla y se encoge de hombros. «Ese no contaba.»', cae: 'Niklas cae de espaldas en la arena y se queda mirando el cielo, riéndose.', aturde: 'Niklas sacude la cabeza como un perro mojado.', caes: 'Niklas te barre los pies y acabas en la arena. Te tiende la mano antes de que toques el suelo.', tablas: '¡Tiempo! Niklas levanta tu brazo y el suyo a la vez. El Foso aplaude.' } }); }
// la partida del cabo Ruiz: mirar bien y acusar con pruebas
async function partidaCartas() { const r = P('ruiz'), n = P('nerea'); cineOn(); await camara([(r.x + n.x) / 2, (r.y + n.y) / 2], 700); cineOff();
  const a = await elige(r, ['(Ruiz reparte. Nerea mira sus cartas sin expresión. Tú te sientas a su lado.)', '(Primera mano. Ruiz gana con dos reinas.) ¿Dónde miras?'], ['Sus manos al repartir.', 'Su cara.', 'La baraja.']);
  const pista1 = ['Reparte rápido, demasiado rápido. Y siempre con la izquierda.', 'Sonríe antes de mirar sus cartas. Como si ya supiera lo que le ha tocado.', 'La baraja está gastada, pero normal. Nada raro.'][a];
  const b = await elige(r, [`(${pista1})`, '(Segunda mano. Ruiz vuelve a ganar. Se rasca la oreja con la mano izquierda y la deja caer junto a la manga.) ¿Dónde miras ahora?'], ['Su manga izquierda.', 'Sus ojos.', 'El montón de berries.']);
  const pista2 = ['Al bajar la mano, la manga se abomba un instante. Hay algo dentro, plano y rectangular.', 'Mira a Nerea cada vez que ella piensa. No a las cartas: a ella.', 'Ruiz ya tiene delante casi todo el dinero de Nerea.'][b];
  const c = await elige(n, [`(${pista2})`, '(Nerea te da un codazo por debajo de la mesa. Es tu momento.)'], ['«¡Tiene una carta en la manga!»', '«¡Las cartas están marcadas!»', '«...Nada. Sigue jugando.»']);
  G.foco = null;
  if (c === 0 && b === 0) { emote(r, '!'); act(r, 'hurt', { stop: 1, dur: 500, fps: 14 }); F.stNereaHecho = true; S.aff.nerea = aff('nerea') + 3; cobrar(40); encargoHecho('La partida del cabo', 'Pillé al cabo Ruiz con una carta en la manga. Nerea recuperó su dinero y me dio cuarenta berries.');
    await dialogo(n, ['(Nerea le agarra la muñeca y le saca de la manga una reina de corazones.)', 'Vaya, vaya. Una reina que se esconde. Como la de tu madre, Ruiz.', '(La cantina entera se ríe. Ruiz se va sin su gorra y sin su dinero.)', '(Nerea reparte el bote en dos montones y te empuja uno.) Cuarenta para ti. Tienes buen ojo. Eso no se enseña.']);
    r.scene = 'none'; r.agenda = [[0, 'casa']]; r.lugar = 'casa'; }
  else if (c === 0) await dialogo(r, ['(Ruiz se levanta de un salto y se sacude la manga: no cae nada.)', '¡Mentiroso! ¡Fuera de mi mesa!', '(Nerea suspira.) Acusar sin ver es perder dos veces. Vuelve a mirar en la próxima mano.']);
  else if (c === 1) await dialogo(n, ['(Nerea coge una carta y la mira a contraluz.) No están marcadas. Lo habría visto yo.', '(Ruiz sonríe.) Sigue mirando. Pero mira mejor.']);
  else await dialogo(n, ['(Nerea pierde la mano. Y la siguiente.)', 'Bueno. Habrá más manos.']); }

// ---------- la elección ----------
function unirse(id) { F.stCompa = id; const c = COMPA[id]; S.aff[id] = aff(id) + 2;
  learn(['yo', 'Mi primer compañero', `${c.nc} se viene conmigo a Goa. Antes, mañana durante el desfile, vamos a recuperar ${c.cosa} del almacén de la base.`]);
  encargo('El plan del desfile', `Mañana a las once menos cuarto, quedar con ${c.n}, entrar en la base durante el desfile y recuperar ${c.cosa}. La Tortuga Parda zarpa a mediodía.`); guardarAuto(); }
function dormir(lugar) { if (diaS() >= 1) return narr(['Hoy no hay tiempo para dormir.']);
  narr([lugar === 'posada' ? 'Te tumbas en la cama de La Concha. Las sábanas huelen a sal y a jabón.' : 'Te tumbas en la arena, con la bolsa de almohada. Las estrellas no son las de Kalé, pero se parecen.'], () => {
    G.paused = true; timelapse((F.stD0 + 1) * 1440 + 8 * 60, 2800, () => { G.paused = false; vecinosTick(true);
      narr([lugar === 'posada' ? 'Te despiertas con el olor del pan de Inés y el ruido de las botas de la Marina. Hoy es el día del desfile.' : 'Te despiertas con arena hasta en las orejas. Hoy es el día del desfile.', F.stCompa ? `${COMPA[F.stCompa].n} te espera a las once menos cuarto.` : 'Todavía no has encontrado a nadie con quien ir a Goa.']); guardarAuto(); }); }); }

// ---------- el desfile ----------
const PUNTO = { rufo: [15.9, 24.7, 'down'], nerea: [29.4, 18.4, 'right'], niklas: [16.8, 13.2, 'down'] };
const PLAZA_GENTE = { celes: [29.4, 24.4], marta: [30.6, 24.6], lalo: [35.4, 24.4], amaro: [36.6, 24.6], pipo: [32.2, 24.8], abuela: [29.4, 23], tomas: [31, 23.4], lucia: [35, 23.4], ines: [36.6, 23.2], ramon: [28.6, 22], jaime: [37.6, 22], goyo: [28.4, 23.2], clara: [37.4, 24.2], ulloa: [30.4, 22.2], bruto: [36, 22.2] };
function empiezaDesfile() { F.stDesfile = true; F.noGuardar = true; WORLD.estatua = 'tapada';
  const coro = ['¡Viva el vicealmirante!', '¿Y qué hay debajo de la lona?', 'Dicen que es de bronce macizo.', 'Mi primo dice que es un caballo.', '¡Que la destapen ya!', '(Bostezo.)', 'Con lo que costó, podían haber arreglado el muelle.', '¿Ese de la tarima es el capitán? Parece más bajo.'];
  for (const n of PEOPLE) { if (n.id === F.stCompa) continue; const at = PLAZA_GENTE[n.id]; if (at) { n.quieto = true; n.camino = null; n.goal = null; n.route = null; moveNpc(n, 'town', at, 'up'); n.barks = coro; n.nextBark = performance.now() + 4000 + Math.random() * 30000; } }
  for (const id of Object.keys(COMPA)) { const n = P(id); if (!n || id === F.stCompa) continue; n.quieto = true; n.camino = null; moveNpc(n, 'town', id === 'rufo' ? [27.8, 24.2] : id === 'nerea' ? [38.2, 23.6] : [38.6, 22.6], 'up'); }
  const b = P('brisco'); b.quieto = true; moveNpc(b, 'town', [33, 19.6], 'down');
  const s = P('severin'); s.quieto = true; s.camino = null; moveNpc(s, 'town', [34.6, 19.4], 'down');
  P('pardo').quieto = true; emote(P('pardo'), 'zzz', 1e9);
  for (const [id, at] of [['patrulla1', [30.6, 19.6]], ['patrulla2', [31.6, 19.6]], ['guardia_cala', [35.6, 19.8]], ['artillero', [36.6, 19.8]]]) { const n = P(id); n.quieto = true; n.route = null; n.camino = null; moveNpc(n, 'town', at, 'down'); }
  const c = P(F.stCompa); if (c) { const [x, y, dir] = PUNTO[F.stCompa]; c.quieto = true; c.camino = null; c.goal = null; moveNpc(c, 'town', [x, y], dir); c.greet = () => '¡Por fin! ¿Listo?';
    c.topics = [{ id: 'vamos', ask: 'Vamos.', a: () => [F.stCompa === 'niklas' ? 'Por el desagüe. Detrás de mí. Y respira por la boca.' : 'Vamos. Y no hagas ruido.'], then: () => entrarBase() }]; } }
function eleccionForzada() { const c = Object.keys(COMPA).sort((a, b) => aff(b) - aff(a))[0], n = P(c); unirse(c); n.quieto = true; Object.assign(n, { scene: G.scene, x: G.x + 30, y: G.y, dir: 'left', goal: null, camino: null });
  say(n, { lines: ['¡Eh! Te estaba buscando.', 'Lo de Goa... he estado pensando. Si te vas, me voy contigo. Pero antes tengo que recuperar ' + COMPA[c].cosa + ' del almacén de la base.', 'Hoy, con el desfile, es la única ocasión. A las once menos cuarto, ¿vale?'], done: () => { n.quieto = false; n.lugar = null; } }); }
function entrarBase() { const id = F.stCompa, c = P(id); F.stDentro = true; F.stSigue = true; G.paused = true;
  fade(() => {
    if (id === 'niklas') { enter('town', aPx(19.2, 13.4), 'right'); moveNpc(c, 'town', [18.6, 13.6], 'right'); G.paused = false; narr(['Salís del desagüe al patio de armas, cubiertos de barro hasta las rodillas. El patio está vacío: todos están en la plaza, al otro lado de la muralla.']); }
    else if (id === 'nerea') { enter('town', aPx(33.6, 14.2), 'up'); moveNpc(c, 'town', [32.6, 14.4], 'up'); G.paused = false; narr(['El guardia del portón mira el pase de Nerea, te mira a ti, mira el pase otra vez. «Práctica y ayudante. Adelante. Y rapidito.»']); }
    else { const [sc, [x, y]] = place('cuartel', [8.4, 8.2]); enter(sc, [x, y], 'up'); moveNpc(c, 'cuartel', [7.4, 8.2], 'up'); G.paused = false; narr(['Entráis por la puerta de servicio empujando el carro del banquete. El sargento de guardia duerme como un tronco.']); } }); }
function recuperar() { const id = F.stCompa, c = P(id); F.stTengo = true; quitarObjeto('llave_almacen'); darObjeto(COMPA[id].obj);
  const lin = { rufo: ['(Entre cajas de botellas y redes, un trapo atado. Rufo lo abre con cuidado: tres cuchillas que brillan.)', '¡Mis niñas! ¿Os han tratado bien? ¿Os han dado de comer?', '...Les hablo. Ya lo sé. No me mires así.'],
    nerea: ['(En un cajón con la etiqueta «Material pirata», un libro de tapas azules hinchado de humedad. Nerea lo abre: páginas y páginas de corrientes dibujadas a lápiz.)', 'Es su letra. Treinta años de mar en un libro.', '(Se lo guarda contra el pecho.) Vámonos.'],
    niklas: ['(Apoyada en la pared, entre picas oxidadas, una lanza de fresno con la punta de hierro negro.)', '(Niklas la coge como quien saluda a alguien después de mucho tiempo.)', 'Hola, viejo.'] }[id];
  say(c, { lines: [...lin, 'Por la puerta grande no: el portón está lleno de marines mirando hacia la plaza. Cruzamos el patio pegados a la muralla y salimos por el desagüe del oeste.'], done: () => { if (id === 'niklas') c.arma = 'lanza'; if (id === 'rufo') c.arma = 'daga'; quitarObjeto(COMPA[id].obj); learn(['yo', 'Lo recuperamos', `Recuperamos ${COMPA[id].cosa} del almacén de decomisos. Ahora hay que salir de la base sin que nos vean.`]); } }); }

// ---------- el cañonazo (cinemática) ----------
async function canonazo() { F.stCanon = 'escena'; const c = P(F.stCompa), b = P('brisco'), s = P('severin'), [cx, cy] = WORLD.canonPos, [ex, ey] = WORLD.estatuaPos;
  cineOn(); c.quieto = true; F.stSigue = false; await camara([cx, cy - 20], 700);
  await anda(c, [cx - 34, cy + 6], 90); c.dir = 'right';
  const lin = { rufo: ['(Rufo se agacha a mirar el cañón de saludo, que tiene la mecha encendida.)', '¿Esto se apaga soplando?', '(Sopla. La mecha chisporrotea más fuerte. Al apartarse, empuja el cañón con la barriga.)'],
    nerea: ['(Nerea mira el cañón de saludo con la cabeza ladeada.)', 'Está mal apuntado. Una salva se tira al mar, no a las gaviotas.', '(Lo empuja un poco para corregirlo. Un poco demasiado.)'],
    niklas: ['(Niklas se apoya en el cañón de saludo, chulo.)', 'Tranquilo, las salvas no llevan bala.', '(El cañón gira bajo su peso y apunta, muy despacio, al tejado del cuartel.) ...Normalmente.'] }[F.stCompa];
  await dialogo(c, lin); WORLD.canonNorte = true; sfx('golpe'); temblor(200, 3); emote(c, '!'); emote(G, '!'); await esperar(900);
  // en la plaza, el capitán tira de la cuerda
  await camara([ex, ey + 40], 1400); bubble(b, '¡Pueblo de Shells Town! ¡Os presento... al guardián de esta ciudad!', 2600); await esperar(1800); WORLD.estatua = 'descubierta'; sfx('pagina'); await esperar(900);
  await camara([cx, cy - 20], 600); destello('rgba(255,235,180,.85)', 300); sfx('disparo'); temblor(400, 8); F.stBala = { t0: performance.now(), from: [cx, cy - 40], to: [ex, ey + 30] }; await esperar(250);
  await camara([ex, ey + 20], 700); await esperar(150);
  WORLD.estatua = 'rota'; F.estatua = 'rota'; F.stBoom = { t0: performance.now(), x: ex, y: ey + 20 }; sfx('golpe'); sfx('haki'); destello('rgba(255,250,230,.9)', 350); temblor(500, 10);
  await esperar(1400); await camara(aPx(33, 20), 900); for (const n of PEOPLE) if (n.scene === 'town' && Math.hypot(n.x - 33 * T, n.y - 22 * T) < 7 * T) emote(n, '!', 2400);
  act(b, 'hurt', { stop: 1, dur: 700, fps: 10 }); await globo(b, '¡¡MI ESTATUA!!', 2200);
  await camara([s.x, s.y], 700); emote(s, '!!'); await globo(s, '¡El cañón del patio! ¡Hay alguien dentro! ¡Conmigo!', 1900);
  const m1 = P('patrulla1'), m2 = P('patrulla2'); for (const n of [s, m1, m2]) { n.quieto = true; n.camino = null; }
  anda(s, aPx(33, 15.4), 150); anda(m1, aPx(32.2, 15.6), 150); anda(m2, aPx(33.8, 15.6), 150); await camara([G.x, G.y - 30], 900);
  await Promise.all([anda(s, [G.x + 70, G.y + 4], 150), anda(m1, [G.x + 90, G.y + 40], 150), anda(m2, [G.x + 96, G.y - 30], 150)]);
  s.dir = 'left'; G.dir = 'right'; cineOff(); G.foco = [G.x + 30, G.y]; F.stCanon = true; rivalEnElPatio(); }
function rivalEnElPatio() { const s = P('severin');
  say(s, { lines: [F.stTono === 'broma' ? 'El pirata más temido del East Blue, ¿no? Ya decía yo que no era una broma.' : 'Tú. Sabía que te volvería a ver. No sabía que tan pronto.', ...(F.stCompa === 'niklas' ? ['(Mira a Niklas.) ...Y tú. Claro. Siempre tú.'] : []), 'Esa estatua le costó al capitán la paga de un año. A mí me va a costar el ascenso.', 'Ríndete.'],
    opts: [{ t: 'Apártate.', then: separar }, { t: 'Ha sido un accidente. De verdad.', then: () => say(s, { lines: ['(Por un segundo, casi te cree. Casi.)', 'Se lo explicas al juez.'], done: separar }) }] }); }
// tu compañero se lleva a los dos marines aparte; tú te quedas con Severin
async function separar() { const c = P(F.stCompa), m1 = P('patrulla1'), m2 = P('patrulla2'), grito = { rufo: '¡Vosotros dos! ¿Quién quiere sopa? ¡Está hirviendo!', nerea: '¡Eh! ¡Los de los botones! ¡Apuesto a que no me cogéis!', niklas: '¡Dos contra uno! ¡Por fin una pelea justa... para mí!' }[F.stCompa];
  cineOn(); await globo(c, grito, 1700); emote(m1, '!'); emote(m2, '!');
  anda(c, aPx(43.4, 12.4), 150); await esperar(500); anda(m1, aPx(42.4, 12.6), 140); await anda(m2, aPx(44.6, 12.2), 140);
  F.stRina = { t0: performance.now(), x: 43.6 * T, y: 12.3 * T }; for (const n of [c, m1, m2]) n.scene = 'none'; // la pelea sigue al fondo del patio: solo se ve el polvo
  await camara([G.x + 30, G.y], 600); cineOff(); duelSeverin(); }
function duelSeverin() { const s = P('severin');
  pelea({ kind: 'severin', foe: s, foeName: 'Cadete Darío Severin', foeMax: 85, rounds: 3, arma: S.arma, hitP: .64, dmgBase: 12, fin: finSeverin,
    tx: { inicio: 'Severin desenvaina la espada reglamentaria. Al fondo del patio se oyen golpes y la voz de tu compañero. «Ríndete y será más fácil para los dos.»', otra: 'Severin respira hondo y vuelve a la guardia. Es bueno. Muy bueno. Al fondo del patio, algo metálico cae al suelo.', fuerte: 'La hoja plana te da en las costillas. Severin no quiere matarte: quiere detenerte.', flojo: 'Te corta la manga. Por poco.', falla: 'Severin falla y se le escapa un gruñido. No está acostumbrado.', cae: 'Severin cae de rodillas, sin aire. Por primera vez te mira con algo parecido al respeto.', aturde: 'Severin retrocede, aturdido, buscando la guardia.', caes: 'Severin te desarma y te pone la punta en el pecho. «Se acabó.»', tablas: 'Os separáis jadeando. Severin no baja la espada, pero le tiembla.' } }); }
async function finSeverin(f) { const s = P('severin'), c = P(F.stCompa), m1 = P('patrulla1'), m2 = P('patrulla2'); F.stSeverin = f.won ? 'ganaste' : 'perdiste'; S.fama = { ...(S.fama || {}), estatua: true, cadete: F.stSeverin, compa: F.stCompa };
  F.stRina = null; for (const [n, at] of [[m1, [42.6, 13.6]], [m2, [44.4, 13.4]]]) { moveNpc(n, 'town', at, 'down'); act(n, 'hurt', { hold: true, fps: 10 }); emote(n, 'zzz', 1e9); }
  learn(['shells', 'La pelea del patio', f.won ? 'Me batí con el cadete Severin en el patio de la base y gané. Mientras, mi compañero tumbó a dos marines.' : `Severin me ganó en el patio de la base. Si no llega a ser por ${COMPA[F.stCompa].n}, que venía de tumbar a dos marines, ahora estaría en un calabozo.`]);
  cineOn(); moveNpc(c, 'town', [43.4, 12.6], 'left'); c.quieto = true;
  if (f.won) { act(s, 'hurt', { hold: true, fps: 10 }); await anda(c, [G.x + 34, G.y + 10], 130); c.dir = 'left';
    await globo(c, { rufo: '¿Necesitabas ayuda? ...Ah, no. Mira tú.', nerea: 'Dos a cero. ¿Y tú? ...Ah. Uno a cero. No está mal.', niklas: '¡Je! Dos marines y ni me he despeinado. ...¿Y tú has tumbado a Darío? ¡Ja!' }[F.stCompa], 2400); }
  else { const salva = { rufo: '(Rufo cruza el patio a la carrera con una sartén del banquete en la mano. ¡CLONC!)', nerea: '(Nerea aparece por detrás de Severin y le tira el tintero de la tabla de mareas a los ojos.)', niklas: '(Niklas llega corriendo y le barre los pies con el asta de la lanza. Severin cae de espaldas.)' }[F.stCompa];
    emote(s, '!'); await anda(c, [s.x + 26, s.y], 230); c.dir = 'left'; act(c, F.stCompa === 'niklas' ? 'thrust' : 'slash', { fps: 14 }); sfx('golpe'); temblor(260, 6); act(s, 'hurt', { hold: true, fps: 10 }); await esperar(500);
    G.act = null; await dialogo(c, [salva, '¡Arriba! ¡Que se nos va el barco!']); }
  cineOff(); F.stSeverinGolpe = true; await dialogo(s, ['(Desde el suelo, Severin te mira a los ojos.)', 'Esto... no ha terminado. Me acordaré de tu cara.']); G.foco = null; huida(); }

// ---------- la huida (urgente) ----------
function huida() { F.stHuida = true; F.stSigue = true; const c = P(F.stCompa); c.quieto = false; G.run = true; encargoHecho('El plan del desfile', 'La estatua del capitán ya no existe. Huimos hacia el muelle.');
  sfx('campana'); temblor(300, 4);
  // el pueblo corre a casa; los marines salen a por ti
  for (const n of PEOPLE) { if (n.agenda && n.quieto && PLAZA_GENTE[n.id]) { n.quieto = false; n.lugar = null; n.vel = 150; n.agenda = [[0, 'casa']]; } }
  for (const id of ['guardia1', 'guardia2', 'guardia_cala', 'artillero']) { const n = P(id); if (n) { n.quieto = true; n.route = null; n.camino = null; } }
  narr(['Las campanas de la base revientan el aire. La gente de la plaza grita y corre en todas direcciones.', '¡Los marines del portón vienen a por vosotros! La Tortuga Parda está soltando amarras en el muelle. ¡CORRE!']); }
async function alMuelle() { F.stFin = true; const q = P('quill'), c = P(F.stCompa), sp = WORLD.sprites.find(s => s.id === 'tortuga'); F.tortugaSuelta = true; cineOn();
  await camara(aPx(41, 46.2), 700); await globo(q, '¡Saltad! ¡SALTAD, que no espero!', 1500);
  // el barco se separa del muelle y saltáis a cubierta
  F.stZarpa = performance.now(); await esperar(400); F.stSalto = { t0: performance.now(), from: [G.x, G.y], to: [sp.x + 230, 44.9 * T] }; G.oculto = true; c.scene = 'none'; q.scene = 'none'; P('marinero').scene = 'none'; sfx('golpe'); await esperar(900);
  const total = Math.min(berries(), 1200); pagar(total);
  await dialogo({ name: 'Capitana Hesper Quill', sprite: 'quill' }, ['(Aterrizas en cubierta rodando entre sacos de sal. Detrás, tu compañero cae encima de ti.)', '¿Os persigue media base de la Marina? Me lo imaginaba.', '(Te mira con los ojos entornados.) Con la Marina detrás, el pasaje vale el doble: mil doscientos berries.', total >= 1200 ? '(Pagas. Te quedas con la bolsa ligera y el corazón a mil.)' : `(Le das todo lo que llevas: ${total.toLocaleString('es-ES')} berries.) ...Y el resto lo pagáis fregando la cubierta hasta Goa.`]);
  const s = P('severin'); s.quieto = true; s.act = null; moveNpc(s, 'town', [33, 39.6], 'down'); await camara(aPx(39, 45.4), 900); await anda(s, aPx(41.4, 47.4), 170); s.dir = 'down';
  await globo(s, '¡¡TE ENCONTRARÉ!! ¡¡ME ACORDARÉ DE TU CARA!!', 2600);
  learn(['yo', 'Rumbo a Goa', `Huimos de Shells Town en la Tortuga Parda con ${COMPA[F.stCompa].nc}. Pagué ${total.toLocaleString('es-ES')} berries${total < 1200 ? ' y fregaremos la cubierta hasta Goa' : ''}.`]);
  F.tortugaFuera = true; F.noGuardar = false; cineOff(); G.oculto = false; guardarAuto(); finActo1(); }
function finActo1() { const c = COMPA[F.stCompa];
  pizarra([{ d: ESC.huida, t: 'La Tortuga Parda salió del puerto con la Marina en el muelle. Desde la borda veías al cadete Severin, de pie al final del muelle, sin moverse.' },
    { d: ESC.goa, t: `Shells Town se hizo pequeña detrás. ${c.n} se sentó a tu lado en la cubierta, sin decir nada. Rumbo a Goa: ya erais dos.` }], null,
    { cierre: `<b>Fin del Acto 1</b><span>${fullName()} · ${S.tripulacion ? S.tripulacion + ' · ' : ''}con ${c.nc}</span><small>El Acto 2 empieza en Goa.</small><button type="button" class="btn" id="finmenu">Volver al menú</button>`, semilla: 52 });
  const b = document.getElementById('finmenu'); if (b) b.onclick = () => location.reload(); keyHandler = null; }

// ---------- reglas de la isla ----------
function shellsBloquea(d) { if (!String(d.to).startsWith('cuartel:')) return null; const cuarto = interior(d.to).rooms.map(r => r.n);
  if (cuarto.includes('Almacén de decomisos')) return !F.stDentro ? 'El sargento Pardo levanta la vista: «Ahí dentro no se te ha perdido nada.»' : !tiene('llave_almacen') && !F.stTengo ? 'La puerta del almacén tiene un candado del tamaño de un puño.' : null;
  if (cuarto.includes('Despacho del capitán') || cuarto.includes('Archivo')) return !F.stDentro ? 'El sargento Pardo carraspea: «El capitán no recibe. Y menos hoy.»' : null; return null; }
// la brújula apunta a lo que toca hacer
function shellsObjetivo() { const at = id => { const n = P(id); return n && n.scene !== 'none' ? { scene: n.scene, x: n.x, y: n.y } : null; };
  if (F.stHuida) return { scene: 'town', x: 41 * T, y: 47 * T };
  if (F.stDentro) return F.stTengo ? { scene: 'town', x: WORLD.canonPos[0], y: WORLD.canonPos[1] } : null;
  if (F.stCompa) { if (diaS() >= 1) { const [x, y] = PUNTO[F.stCompa]; return { scene: 'town', x: x * T, y: y * T }; } return { scene: 'town', x: 41 * T, y: 47 * T }; }
  if (tiene('cajas_pescado')) return at('rufo'); if (F.stRufoEnc && !F.stRufoHecho) return at('marta');
  if (!F.stControl) return at('severin'); return at('rufo') || at('nerea') || at('niklas'); }
function shellsInit() { WORLD.estatua = F.estatua || 'tapada'; WORLD.canonNorte = !!F.stCanon;
  WORLD.sprites.push({ ...barcoSprite('marina', 50 * T, 49.9 * T, 12 * T), visible: () => F.stDesfile && !F.tortugaFuera });
  for (const n of PEOPLE) { n.lugar = null; n.dentroDe = null; } if (F.stMedusaFuera || !F.stLlegada) { const m = P('medusa'); if (m) m.scene = 'none'; } vecinosTick(true); }
function shellsRestaurar() { WORLD.estatua = F.estatua || 'tapada'; for (const n of PEOPLE) n.lugar = null; const m = P('medusa'); if (m) m.scene = 'none'; F.stBote = false; vecinosTick(true); }
let lastS = 0;
function shellsTick(now) {
  if (G.lapse) return;
  // la ceremonia espera mientras estás dentro de la base: no se pierde el barco por ir despacio
  if (F.stDentro && !F.stFin) G.minutes = Math.min(G.minutes, (F.stD0 + 1) * 1440 + 11.9 * 60);
  // la Tortuga se separa del muelle
  if (F.stZarpa) { const sp = WORLD.sprites.find(s => s.id === 'tortuga'); if (sp) { sp.x0 = sp.x0 ?? sp.x; sp.x = sp.x0 + Math.min(1, (now - F.stZarpa) / 9000) ** 1.6 * 340; } }
  if (F.stRina && now - (F.stRinaSon || 0) > 1100 + Math.random() * 900) { F.stRinaSon = now; sfx(Math.random() < .3 ? 'tajo' : 'golpe'); }
  if (now - lastS < 300) return; lastS = now; const h = hourNow(), d = diaS();
  vecinosTick(false);
  // el herrero da martillazos en la puerta de la herrería
  const rm = P('ramon'); if (rm && rm.scene === 'town' && !rm.goal && !(rm.camino && rm.camino.length) && rm.lugar && rm.lugar[0] === 'calle' && Math.random() < .5 && Math.hypot(rm.x - G.x, rm.y - G.y) < 500) { rm.dir = 'down'; act(rm, 'slash', { fps: 12 }); }
  if (CINE.on) return;
  if (!F.stControl && !G.talking && !G.paused) { const s = P('severin'); if (s && s.scene === 'town' && G.scene === 'town' && Math.hypot(s.x - G.x, s.y - G.y) < 3.4 * T) control(); }
  if (d >= 1 && h >= 9.5 && !F.stCompa && !G.talking && !G.paused) eleccionForzada();
  if (d >= 1 && h >= 10.5 && F.stCompa && !F.stDesfile) empiezaDesfile();
  // la base: nadie entra sin motivo
  if (G.scene === 'town' && !openBase() && G.x > 18.2 * T && G.x < 47.8 * T && G.y > 2.6 * T && G.y < 15.2 * T && !G.paused) { G.x = 33 * T; G.y = 17.6 * T; bubble(P('guardia1'), F.stDesfile ? '¡Hoy no entra nadie! ¡Hay desfile!' : 'Esto es una base de la Marina, no un paseo. Fuera.', 2200); }
  // el compañero te sigue de escena en escena
  const c = F.stSigue && P(F.stCompa);
  if (c && !G.paused && !G.talking) { c.quieto = true; if (c.scene !== G.scene) { c.scene = G.scene; c.x = G.x - 24; c.y = G.y + 2; } else if (Math.hypot(c.x - G.x, c.y - G.y) > 52) c.goal = { x: G.x - (G.dir === 'left' ? -26 : 26), y: G.y + 4, speed: G.run ? 190 : 130 }; }
  // al cruzar el patio con lo recuperado, junto al cañón de saludo
  if (F.stTengo && !F.stCanon && G.scene === 'town' && !G.talking && Math.hypot(G.x - WORLD.canonPos[0], G.y - WORLD.canonPos[1]) < 3 * T) canonazo();
  // la huida: disparos, marines detrás y el barco esperando
  if (F.stHuida && !F.stFin) { for (const id of ['guardia1', 'guardia2', 'guardia_cala', 'artillero']) { const n = P(id); if (n && n.scene === G.scene && G.scene === 'town') { n.goal = { x: G.x + (id.length % 2 ? -70 : 70), y: G.y - 60, speed: 125 }; if (Math.random() < .07) bubble(n, pick(['¡Alto!', '¡Detenedlos!', '¡En nombre de la Marina!']), 1100); if (Math.random() < .06 && (n.arma === 'mosquete' || n.arma === 'pistola')) { n.dir = dirTo(n, G); act(n, 'shoot', { fps: 18 }); sfx('disparo'); F.stTiro = { t0: performance.now(), x: n.x, y: n.y - 30 }; temblor(150, 3); } } }
    if (G.scene === 'town' && Math.hypot(G.x - 41 * T, G.y - 47 * T) < 2.6 * T) alMuelle(); }
}
// ---------- dibujos de la isla ----------
function shellsDibujar(g, [cx, cy], now) {
  // el bote de la Medusa Gris, varado en la arena o alejándose
  if (F.stBote) { const k = F.stBoteT0 ? Math.min(1, (now - F.stBoteT0) / 6000) : 0, x = 5.2 * T - k * 240 - cx, y = 44.4 * T + k * 70 - cy;
    g.fillStyle = 'rgba(0,20,40,.3)'; g.beginPath(); g.ellipse(x + 4, y + 8, 34, 9, 0, 0, 7); g.fill(); g.fillStyle = '#1a1210'; g.beginPath(); g.moveTo(x - 34, y - 6); g.lineTo(x + 34, y - 6); g.lineTo(x + 24, y + 8); g.lineTo(x - 26, y + 8); g.closePath(); g.fill();
    g.fillStyle = '#6a4428'; g.beginPath(); g.moveTo(x - 31, y - 4); g.lineTo(x + 31, y - 4); g.lineTo(x + 22, y + 6); g.lineTo(x - 24, y + 6); g.closePath(); g.fill(); g.fillStyle = '#4a2e1a'; g.fillRect(x - 8, y - 4, 4, 10); g.fillRect(x + 8, y - 4, 4, 10);
    if (k > 0) { g.fillStyle = '#2a2a33'; g.fillRect(x - 6, y - 24, 12, 20); g.beginPath(); g.arc(x, y - 26, 7, 0, 7); g.fill(); g.strokeStyle = '#4a3020'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 30, y - 10 + Math.sin(now / 300) * 4); g.lineTo(x + 30, y - 2 - Math.sin(now / 300) * 4); g.stroke(); } }
  // banderines en la plaza y la tarima del capitán, el día del desfile
  if (diaS() >= 1 && F.stCompa) { for (const [a, b] of [[[27.4, 17.6], [38.6, 17.6]], [[27.4, 25.4], [38.6, 25.4]], [[27.4, 17.6], [27.4, 25.4]], [[38.6, 17.6], [38.6, 25.4]]]) { const ax = a[0] * T - cx, ay = a[1] * T - cy - 44, bx = b[0] * T - cx, by = b[1] * T - cy - 44, n = 18;
      g.strokeStyle = 'rgba(40,30,20,.7)'; g.lineWidth = 1; g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo((ax + bx) / 2, (ay + by) / 2 + 14, bx, by); g.stroke();
      for (let k = 1; k < n; k++) { const t = k / n, x = ax + (bx - ax) * t, y = ay + (by - ay) * t + Math.sin(t * Math.PI) * 7, sw = Math.sin(now / 400 + k) * 1.5; g.fillStyle = k % 2 ? '#2f4f9a' : '#f4f6fa'; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x + 4, y); g.lineTo(x + sw, y + 9); g.closePath(); g.fill(); } }
    const x = 33 * T - cx, y = 19.9 * T - cy; g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x - 32, y + 4, 66, 6); g.fillStyle = '#2a1a10'; g.fillRect(x - 32, y - 12, 64, 18); g.fillStyle = '#8a5a34'; g.fillRect(x - 30, y - 10, 60, 14); g.fillStyle = '#2f4f9a'; g.fillRect(x - 30, y - 10, 60, 4); }
}
function shellsEncima(g, [cx, cy], now) {
  // la mecha encendida del cañón de saludo
  if (WORLD.canonPos && F.stDesfile && F.stCanon !== true && !F.stBala && !WORLD.canonNorte) { const [x0, y0] = WORLD.canonPos, x = x0 - cx + 6, y = y0 - cy - 20, fl = Math.floor(now / 90) % 3;
    const gl = g.createRadialGradient(x, y, 1, x, y, 22); gl.addColorStop(0, 'rgba(255,200,90,.6)'); gl.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gl; g.fillRect(x - 22, y - 22, 44, 44);
    g.fillStyle = ['#ffd85a', '#ff9a3a', '#fff2c0'][fl]; g.fillRect(x - 2 + fl, y - 3, 4, 4); g.fillRect(x + 3 - fl, y - 6, 2, 2); g.fillStyle = 'rgba(200,200,200,.45)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(x + Math.sin(now / 300 + k) * 4, y - 8 - ((now / 40 + k * 8) % 24), 3 + k, 0, 7); g.fill(); } }
  // la bala, con su estela
  if (F.stBala) { const B = F.stBala, k = (now - B.t0) / 650; if (k > 1) F.stBala = null; else { const [x0, y0] = B.from, [x1, y1] = B.to, P2 = kk => [x0 + (x1 - x0) * kk - cx, y0 + (y1 - y0) * kk - Math.sin(kk * Math.PI) * 60 - cy];
    g.fillStyle = 'rgba(210,210,210,.55)'; for (let i = 1; i < 7; i++) { const [sx, sy] = P2(Math.max(0, k - i * .035)); g.beginPath(); g.arc(sx, sy, 7 - i * .8, 0, 7); g.fill(); }
    const [bx, by] = P2(k); g.fillStyle = '#121218'; g.beginPath(); g.arc(bx, by, 6, 0, 7); g.fill(); g.fillStyle = '#5a5a66'; g.fillRect(bx - 3, by - 4, 2, 2); } }
  // el impacto: fogonazo, bronce volando y polvo que cae al patio
  if (F.stBoom) { const B = F.stBoom, k = (now - B.t0) / 3200; if (k > 1) F.stBoom = null; else { const x = B.x - cx, y = B.y - cy;
    if (k < .12) { g.fillStyle = `rgba(255,240,190,${1 - k / .12})`; g.beginPath(); g.arc(x, y, 30 + k * 420, 0, 7); g.fill(); }
    for (let i = 0; i < 22; i++) { const a = hash(i, 1, 97) * Math.PI * 2, v = 60 + hash(i, 2, 97) * 140, t = Math.min(1, k * 2.2), px2 = x + Math.cos(a) * v * t, py2 = y - Math.abs(Math.sin(a)) * v * t * .8 + 380 * t * t;
      g.fillStyle = i % 3 ? '#946a36' : '#c09050'; g.fillRect(px2 - 3, py2 - 3, 6, 5); g.fillStyle = '#4a321a'; g.fillRect(px2 - 3, py2 + 1, 6, 1); }
    for (let i = 0; i < 12; i++) { const a = hash(i, 4, 97) * Math.PI * 2, r = 20 + k * 110; g.fillStyle = `rgba(220,210,190,${.55 * (1 - k)})`; g.beginPath(); g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * .5 - k * 30, 14 + k * 30, 0, 7); g.fill(); } } }
  // la riña de tu compañero con los dos marines, al fondo del patio: polvo y golpes
  if (F.stRina && G.scene === 'town') { const R2 = F.stRina, x = R2.x - cx, y = R2.y - cy, t = (now - R2.t0) / 1000;
    for (let i = 0; i < 9; i++) { const a = t * 2 + i, r = 18 + (i % 3) * 10; g.fillStyle = `rgba(200,185,160,${.35 + .2 * Math.sin(t * 3 + i)})`; g.beginPath(); g.arc(x + Math.cos(a) * r, y + Math.sin(a * 1.3) * r * .5, 14 + (i % 4) * 4, 0, 7); g.fill(); }
    const pal = ['¡PAF!', '¡CLONC!', '¡ZAS!', '¡AY!']; if (Math.floor(t * 1.4) % 2 === 0) { g.font = '900 15px Outfit, sans-serif'; g.textAlign = 'center'; g.lineWidth = 4; g.strokeStyle = '#1a1210'; const w = pal[Math.floor(t * 1.4 / 2) % pal.length]; g.strokeText(w, x + Math.sin(t * 5) * 14, y - 36); g.fillStyle = '#ffe08a'; g.fillText(w, x + Math.sin(t * 5) * 14, y - 36); } }
  // fogonazo de los disparos durante la huida
  if (F.stTiro && now - F.stTiro.t0 < 160) { const x = F.stTiro.x - cx, y = F.stTiro.y - cy; g.fillStyle = 'rgba(255,230,140,.9)'; g.beginPath(); g.arc(x, y, 10, 0, 7); g.fill(); g.fillStyle = 'rgba(220,220,220,.5)'; g.beginPath(); g.arc(x + 8, y - 6, 12, 0, 7); g.fill(); }
  // el salto a la Tortuga y tú en cubierta, alejándote
  if (F.stSalto) { const S2 = F.stSalto, k = Math.min(1, (now - S2.t0) / 800), sp = WORLD.sprites.find(s => s.id === 'tortuga'), dx = sp ? sp.x - (sp.x0 ?? sp.x) : 0, [x0, y0] = S2.from, [x1, y1] = [S2.to[0] + dx, S2.to[1]];
    const x = x0 + (x1 - x0) * k - cx, y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 70 - cy; drawLPC(g, 'grumete', x, y, 'right', k < 1 ? 3 : 0, 1);
    const c = F.stCompa && P(F.stCompa); if (c) drawLPC(g, c.sprite, x - 26 + (k < 1 ? -20 * (1 - k) : 0), y + 4, 'right', k < 1 ? 5 : 0, 1); }
}
