// Shells Town (Acto 1, camino pirata): la isla donde te deja la Medusa Gris. Diseño en docs/shells-town.md.
// Día 0: llegada, control del cadete, la ciudad y los tres candidatos. Día 1: desfile, base, cañonazo, pelea y huida.
ISLAS.shells = { n: 'Shells Town', plano: 'islas/shells.json', gente: () => GENTE_SHELLS(), objetos: () => OBJETOS_SHELLS(),
  tick: (now, dt) => shellsTick(now, dt), dibujar: (g, cam, now) => shellsDibujar(g, cam, now), encima: (g, cam, now, VW, VH) => shellsEncima(g, cam, now, VW, VH),
  init: () => shellsInit(), restaurar: d => shellsRestaurar(d), bloquea: d => shellsBloquea(d) };
const diaS = () => Math.floor(G.minutes / 1440) - (F.stD0 || 0);
const COMPA = { rufo: { n: 'Rufo', obj: 'cuchillas_rufo', cosa: 'sus cuchillas' }, iria: { n: 'Iria', obj: 'carta_iria', cosa: 'la carta de su madre' }, tobi: { n: 'Tobi', obj: 'lanza_tobi', cosa: 'la lanza de su padre' } };

// ---------- objetos nuevos ----------
const iconoCajas = px => icono32(g => { for (const [x, y] of [[3, 14], [16, 14], [9, 4]]) { g.fillStyle = '#2a1a10'; g.fillRect(x, y, 13, 12); g.fillStyle = '#a8744a'; g.fillRect(x + 1, y + 1, 11, 10); g.fillStyle = '#8aa0b8'; g.fillRect(x + 2, y + 2, 9, 3); g.fillStyle = '#6a4228'; g.fillRect(x + 1, y + 6, 11, 1); } }, px);
const iconoCompas = px => icono32(g => { g.strokeStyle = '#2a1a10'; g.lineWidth = 4; g.beginPath(); g.moveTo(16, 6); g.lineTo(8, 28); g.moveTo(16, 6); g.lineTo(24, 28); g.stroke(); g.strokeStyle = '#d8b04a'; g.lineWidth = 2; g.stroke(); g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(16, 6, 4, 0, 7); g.fill(); g.fillStyle = '#f0d27a'; g.beginPath(); g.arc(16, 6, 2.5, 0, 7); g.fill(); g.strokeStyle = '#8a6a2a'; g.lineWidth = 1; g.beginPath(); g.moveTo(11, 19); g.lineTo(21, 19); g.stroke(); }, px);
const iconoLlave = px => icono32(g => { g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(10, 12, 7, 0, 7); g.fill(); g.fillRect(14, 10, 15, 5); g.fillRect(23, 14, 3, 6); g.fillRect(27, 14, 3, 5); g.fillStyle = '#9a9aa2'; g.beginPath(); g.arc(10, 12, 5, 0, 7); g.fill(); g.fillStyle = '#2a1a10'; g.beginPath(); g.arc(10, 12, 2, 0, 7); g.fill(); g.fillStyle = '#9a9aa2'; g.fillRect(15, 11, 13, 3); g.fillRect(24, 14, 1, 4); g.fillRect(28, 14, 1, 3); }, px);
const iconoCuchillas = px => icono32(g => { for (const [x, l] of [[7, 20], [15, 22], [23, 18]]) { g.fillStyle = '#2a1a10'; g.fillRect(x - 3, 3, 7, l + 2); g.fillStyle = '#d0d4dc'; g.fillRect(x - 2, 4, 5, l - 8); g.fillStyle = '#ffffff'; g.fillRect(x - 2, 4, 1, l - 8); g.fillStyle = '#6a4228'; g.fillRect(x - 2, l - 3, 5, 9); } }, px);
Object.assign(OBJETOS, {
  cajas_pescado: { n: 'Cajas de pescado', noVende: true, desc: 'Tres cajas de pescado del puesto de Marta, fiadas a nombre de Rufo. Pesan y huelen.', icono: iconoCajas },
  compas_iria: { n: 'Compás de latón', noVende: true, desc: 'Un compás de dibujo con las puntas finas. En el brazo, grabado: «Para que midas lejos».', icono: iconoCompas },
  llave_almacen: { n: 'Llave del almacén', noVende: true, desc: 'Una llave grande de hierro, con una etiqueta: «Decomisos». Estaba en el cajón del capitán.', icono: iconoLlave },
  cuchillas_rufo: { n: 'Cuchillas de Rufo', noVende: true, desc: 'Tres cuchillas de cocina envueltas en un trapo, afiladas como para cortar el aire.', icono: iconoCuchillas },
  carta_iria: { n: 'Carta de la madre de Iria', noVende: true, desc: 'Una carta náutica gastada. En una esquina, un círculo a tinta y tres palabras: «aquí canta el mar».', icono: px => iconoMapa(px) },
  lanza_tobi: { n: 'Lanza del padre de Tobi', noVende: true, desc: 'Una lanza de fresno con la punta de hierro negro. En el asta, una muesca por cada año que la usó su padre.', icono: px => iconoArma(arma('lanza'), px) },
});

// ---------- gente ----------
const GENTE_SHELLS = () => [
  { id: 'medusa', scene: 'town', at: [8.7, 38.9], sprite: 'forastero', dir: 'left', name: 'La Medusa Gris', barks: [], greet: () => 'El bote no espera. Yo tampoco.' },
  { id: 'severin', scene: 'town', at: [10.8, 28.2], sprite: 'severin', dir: 'down', name: 'Cadete Severin', arma: 'reglamento',
    barks: { dia: ['Circulen.', 'Documentos, por favor.'], tarde: ['Todo en orden. De momento.'], noche: ['Ronda de noche. Sin novedad.'] },
    greet: c => F.stSeverinGolpe ? '...' : c.n <= 1 ? 'Sigues aquí. Bien: así sé dónde estás.' : pick(['¿Otra vez tú?', 'Si vas a preguntar algo, que sea rápido.']),
    topics: [
      { id: 'por', once: true, ask: '¿Por qué te hiciste marine?', a: () => ['Porque alguien tiene que poner orden. Donde no hay orden, mandan los que más gritan.', '...Y los que más gritan casi nunca son buena gente.'] },
      { id: 'tobi', once: true, need: () => asked('tobi', 'marina'), ask: '¿Conoces a Tobi Garra?', a: () => ['(Se le endurece la cara.)', 'Fuimos compañeros de litera en la academia. Él hizo lo que creía correcto y yo hice lo que era correcto.', 'No siempre es lo mismo. Ya lo aprenderás.'], learn: L('shells', 'Severin y Tobi', 'Severin y Tobi fueron compañeros en la academia. Severin firmó el parte que echó a Tobi.') },
      { id: 'estatua', once: true, ask: '¿Qué hay debajo de esa lona?', a: () => ['El capitán Brisco. En bronce. Tres metros de capitán Brisco.', '(Lo dice sin cambiar la cara, pero se le escapa un suspiro.)'] },
    ] },
  { id: 'guardia_cala', scene: 'town', at: [11.8, 28.4], sprite: 'marine', dir: 'down', name: 'Marine', arma: 'mosquete', barks: { dia: ['Bostezo... digo, sin novedad.'], tarde: [], noche: [] }, greet: () => 'Habla con el cadete. Yo solo sujeto el mosquete.' },
  { id: 'guardia1', scene: 'town', at: [31.4, 16.6], sprite: 'marine', dir: 'down', name: 'Guardia del portón', arma: 'mosquete', barks: { dia: ['Portón de la base. Paso restringido.'], tarde: ['Nueve a cinco, la oficina de cartas. Lo demás, cerrado.'], noche: ['...'] },
    greet: () => openBase() ? 'Si vienes a la oficina de cartas, adelante. Si no, ni lo intentes.' : 'La base está cerrada. Vuelve en horario de oficina.' },
  { id: 'guardia2', scene: 'town', at: [34.6, 16.6], sprite: 'marine', dir: 'down', name: 'Guardia del portón', arma: 'pistola', barks: { dia: ['¿Has visto la lona de la plaza? Yo tampoco sé lo que hay debajo.'], tarde: ['Mañana desfile. Llevo una semana sacando brillo a botones.'], noche: ['...'] }, greet: () => 'Sigue tu camino.' },
  { id: 'pardo', scene: 'cuartel', at: [3.2, 6.9], sprite: 'sargento', dir: 'down', name: 'Sargento Pardo', arma: 'reglamento',
    barks: { dia: ['¡Firmes! ...Ah, eres un civil.'], tarde: ['Papeles, papeles y más papeles.'], noche: ['Zzz...'] },
    greet: () => F.stDentro ? 'Zzz... ¿el desfile? ...cinco minutos más, mamá...' : '¿Asuntos con la oficina de cartas? A la izquierda. ¿Asuntos con el capitán? No los tienes.' },
  { id: 'brisco', scene: 'cuartel', at: [8.4, 2.6], sprite: 'brisco', dir: 'down', name: 'Capitán Pelayo Brisco', arma: 'sable',
    barks: { dia: ['¡Mañana, la historia!', '¿Ese botón está torcido? ¡Ese botón está torcido!'], tarde: ['El vicealmirante quedará conmovido. Conmovido.'], noche: [] },
    greet: c => c.n === 0 ? '¿Ha visto usted la estatua? ¡Todavía no! Nadie la ha visto. Mañana, mañana todo Shells Town la verá.' : '¿Otra vez usted? Admiro su interés por el arte.',
    topics: [{ id: 'estatua', once: true, ask: '¿Qué tiene de especial la estatua?', a: () => ['Tres meses de trabajo del mejor escultor del East Blue. Bronce macizo.', 'Me costó la paga de un año. Pero el reconocimiento no tiene precio.', '(Lo piensa.) Bueno, sí. El de la estatua.'] }] },
  { id: 'rufo', scene: 'cantina', at: [8.6, 1.5], sprite: 'rufo', dir: 'down', name: 'Rufo Brasa',
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
  { id: 'iria', scene: 'cuartel', at: [4.2, 2], sprite: 'iria', dir: 'left', name: 'Iria Vendaval',
    barks: { dia: ['Tres brazas... no, cuatro.', '(Iria murmura números mientras dibuja.)'], tarde: ['Las nubes del oeste traen viento mañana.'], noche: ['(Iria dibuja a la luz de una vela.)'] },
    greet: c => F.stCompa === 'iria' ? 'Mañana, a las once menos cuarto, en el portón. Trae cara de ayudante.' : F.stCompa ? 'Que el viento te sea favorable. Lo será: lo he mirado.' : c.n === 0 ? 'Copias de cartas, cinco berries y dos días de espera. Si viene a mirar, mire, pero no toque la tinta.' : pick(['Hola.', '(Iria levanta la vista un segundo y vuelve a dibujar.)']),
    first: L('gente', 'Iria Vendaval', 'Copista en la oficina de cartas de la base. Habla poco, dibuja costas de memoria y lee el tiempo en las nubes.'),
    topics: [
      { id: 'que', once: true, ask: '¿Qué dibujas?', a: () => ['La costa de Shells Town. Otra vez.', 'La carta oficial tiene la cala mal puesta. Se lo dije al capitán. Me dijo que la carta oficial no se equivoca: se equivoca la costa.'] },
      { id: 'tiempo', once: true, ask: '¿Cómo sabes qué tiempo hará?', a: () => ['Las nubes altas, en hilera, como peinadas. Mi madre las llamaba «colas de yegua»: viento en un día.', 'Ella sabía leer el cielo como yo leo una carta. Mejor, incluso.'] },
      { id: 'madre', once: true, need: () => asked('iria', 'tiempo'), ask: '¿Y tu madre?', a: () => ['Era navegante. Se fue a buscar una isla que no sale en ninguna carta y no volvió.', 'Me dejó su carta, la única donde aparece esa isla. Cuando llegué aquí, la aduana de la base me la quitó. «Cartografía no autorizada», dicen.', 'Está en el almacén de decomisos, con las cosas que la Marina no sabe ni qué son.'],
        learn: L('shells', 'La carta de Iria', 'La madre de Iria era navegante y desapareció buscando una isla que no sale en las cartas. La Marina le confiscó a Iria la carta de su madre.') },
      { id: 'compas', once: true, need: () => asked('iria', 'madre'), ask: '¿Puedo ayudarte en algo?', a: () => (F.stIriaEnc = true, encargo('El compás de Iria', 'Iria perdió esta mañana el compás de su madre en la arena de la cala, al suroeste de la ciudad.'),
        ['(Te mira un rato largo, como midiendo una distancia.)', 'Esta mañana fui a dibujar la cala y se me cayó el compás de mi madre en la arena. Uno de latón, con las puntas finas.', 'Me tocaba entrar a trabajar y no pude buscarlo. Si lo encuentras... te lo pagaré.']) },
      { id: 'entrega', once: true, need: () => tiene('compas_iria'), ask: 'He encontrado tu compás.', a: () => { quitarObjeto('compas_iria'); cobrar(40); F.stIriaHecho = true; encargoHecho('El compás de Iria', 'Iria me pagó cuarenta berries.');
        return ['(Lo coge con las dos manos.)', 'Está entero. Gracias. De verdad.', 'Toma, cuarenta berries. Y... si alguna vez necesitas una carta, te la hago gratis.']; }, aff: () => 2 },
      { id: 'isla', once: true, need: () => F.stIriaHecho, ask: '¿Cómo se llama la isla de tu madre?', a: () => ['No tiene nombre. En la carta solo hay un círculo y tres palabras: «aquí canta el mar».', 'Quiero encontrarla. Quiero dibujar el mapa entero del mundo, con esa isla dentro.'], aff: () => 1 },
      { id: 'unete', need: () => F.stIriaHecho && !F.stCompa, ask: 'Vente conmigo. Mañana zarpo a Goa.', a: () => ['(Iria deja la pluma.)', '¿Me estás ofreciendo un sitio en un barco que todavía no tienes?', '...Es la oferta más absurda que me han hecho. Y la única que quiero aceptar.', 'Pero sin la carta de mi madre no me muevo. Está en el almacén de decomisos.', 'Mañana tengo pase de copista para entrar durante el desfile: hay que llevarle al capitán la carta de la ruta del vicealmirante.', 'Te espero en el portón de la base a las once menos cuarto. Trae cara de ayudante.'], then: () => unirse('iria') },
    ] },
  { id: 'tobi', scene: 'town', at: [44.5, 35.6], sprite: 'tobi', dir: 'down', name: 'Tobi Garra',
    barks: { dia: ['¡Una! ¡Dos! ¡Arriba!', 'Esta caja pesa como un remordimiento.'], tarde: ['¡Siguiente! ¿Nadie?', '¡Pago doble al que me tumbe!'], noche: ['...'] },
    greet: c => F.stCompa === 'tobi' ? 'Mañana, muralla oeste, junto a la leña, a las once menos cuarto. Trae ropa vieja: el desagüe no perdona.' : F.stCompa ? 'Si un día necesitas un puño de más, ya sabes dónde estoy.' : c.n === 0 ? '¿Qué miras? Si vienes a por pelea, es por la tarde y en el Foso. Si vienes a por cajas, ayúdame a cargar.' : pick(['¡Eh!', '¿Qué hay?']),
    first: L('gente', 'Tobi Garra', 'Estibador por la mañana y luchador del Foso por la tarde. Dicen que fue recluta de la Marina hasta que lo echaron.'),
    topics: [
      { id: 'marina', once: true, ask: '¿Es verdad que fuiste marine?', a: () => ['Seis meses en la academia. Me echaron por darle un puñetazo a un teniente.', 'El teniente le estaba pegando a un pescador viejo por no apartarse. Yo me aparté para pegarle a él.', 'Mi compañero de litera, Darío, me dijo que había hecho lo correcto. Y después firmó el parte. Así es la Marina.'] },
      { id: 'lanza', once: true, ask: '¿Peleas sin arma?', a: () => ['Peleaba con la lanza de mi padre. Al echarme, la Marina se la quedó: «material del cuerpo».', 'No era del cuerpo. Era de mi padre. La tienen en el almacén de decomisos de la base.'],
        learn: L('shells', 'La lanza de Tobi', 'Al echarlo de la Marina, le quitaron a Tobi la lanza de su padre. Está en el almacén de decomisos de la base.') },
      { id: 'foso', need: () => !F.stFosoPeleado && enFoso(), ask: 'Quiero pelear en el Foso.', a: () => (encargo('El Foso', 'Tobi organiza peleas en el Foso, junto a los almacenes. Cincuenta berries por victoria.'), ['¡Eso es hablar! Dos asaltos contra Bruto. Si ganas, cincuenta berries.', 'Si pierdes, te ríes y te levantas. Aquí nadie se queda en el suelo.']), then: () => pelearFoso() },
      { id: 'foso_info', need: () => !F.stFosoPeleado && !enFoso(), ask: '¿Qué es el Foso?', a: () => ['El ring de arena junto a los almacenes. Por las tardes, a partir de la una y media, se pelea por dinero.', 'Ven por la tarde si tienes agallas.'] },
      { id: 'contra', once: true, need: () => F.stFosoPeleado && enFoso(), ask: 'Pelea conmigo tú, Tobi.', a: () => ['(Se le ilumina la cara.)', 'Por fin alguien con agallas. Si me tumbas, te escucho. Si te tumbo, también. Hoy estoy de buenas.'], then: () => pelearTobi() },
      { id: 'unete', need: () => F.stTobiHecho && !F.stCompa, ask: 'Vente conmigo. Mañana zarpo a Goa.', a: () => ['(Tobi se queda callado. Después se ríe, fuerte.)', '¿Pirata? ¿Yo? Mi padre me mataría. Bueno, si estuviera vivo.', 'Vale. Pero la lanza de mi padre viene conmigo.', 'Sé de un desagüe que pasa por debajo de la muralla, por el lado de la cantina. Mañana, con el desfile, la base estará medio vacía.', 'Nos vemos en la muralla oeste, junto al montón de leña, a las once menos cuarto.'], then: () => unirse('tobi') },
    ] },
  { id: 'bruto', scene: 'town', at: [49.4, 32.4], sprite: 'maton', dir: 'left', name: 'Bruto', barks: { dia: [], tarde: ['¡Al Foso! ¡Al Foso!', '(Bruto hace crujir el cuello.)'], noche: [] }, greet: () => '¿Peleas o miras? Mirar es gratis. Pelear, también, pero duele.' },
  { id: 'quill', scene: 'town', at: [40.8, 42.1], sprite: 'quill', dir: 'down', name: 'Capitana Hesper Quill',
    barks: { dia: ['¡Ese barril, con cuidado, que es aceite!', '¡Estiba, no tiro al blanco!'], tarde: ['Mañana con la marea. Ni un minuto más.'], noche: [] },
    greet: c => c.n === 0 ? '¿Carga, pasaje o curiosidad? Las dos primeras se pagan.' : 'Mañana a mediodía. Con la marea o sin ti.',
    topics: [
      { id: 'pasaje', once: true, ask: '¿Vas a Goa?', a: () => (encargo('Pasaje a Goa', 'La Tortuga Parda zarpa mañana a mediodía hacia Goa. La capitana Quill cobra trescientos berries por persona, al subir.'), ['Mañana a mediodía, con la marea. Trescientos berries por cabeza, se paga al subir.', 'No pregunto nombres ni de dónde viene nadie. Pregunto si el dinero es de verdad.']) },
      { id: 'barco', once: true, ask: '¿Qué lleva la Tortuga?', a: () => ['Sal, aceite, telas y paciencia. Mucha paciencia: no es rápida, pero llega.', 'Treinta años navegando y nunca me han hundido. Me han robado dos veces, eso sí.'] },
    ] },
  { id: 'celes', scene: 'posada', at: [8.4, 1.2], sprite: 'tabernera', dir: 'down', name: 'Doña Celes',
    barks: { dia: ['¡La Concha, camas limpias y sin pulgas! Casi.'], tarde: ['¿Cama? ¿Cena? ¿Las dos?'], noche: ['Silencio, que hay gente durmiendo.'] },
    greet: c => c.n === 0 ? 'Bienvenido a La Concha. Cama, veinte berries. Rumores, gratis.' : pick(['¿Qué te pongo, cielo?', 'Aquí estoy, como siempre.']),
    topics: [
      { id: 'cama', need: () => F.stCama !== diaS(), ask: 'Quiero una cama para esta noche. (20 ฿)', a: () => pagar(20) ? (F.stCama = diaS(), ['La habitación del fondo. Las sábanas son nuevas. Bueno, casi nuevas.', 'Puedes dormir cuando quieras: túmbate en la cama.']) : ['Sin veinte berries no hay colchón, cielo. Pero la playa es gratis.'] },
      { id: 'rumores', ask: '¿Qué se cuenta?', a: () => F.estatua === 'rota' ? ['...'] : ['Lalo dice que vio un barco negro en la cala. Ayer vio una sirena. La semana pasada, al Rey de los Piratas resucitado.', 'Lo que sí es verdad: mañana viene un vicealmirante. El capitán Brisco lleva tres días sin dormir.', 'Y la estatua... Dicen que es de bronce macizo. Dicen que le costó la paga de un año.'],
        learn: L('rumores', 'El desfile', 'Mañana viene un vicealmirante a Shells Town. Habrá desfile y se destapará una estatua del capitán Brisco.') },
      { id: 'comer', ask: '¿Qué hay de cenar?', tienda: 'celes' },
    ] },
  { id: 'marta', scene: 'town', at: [23.2, 33.7], sprite: 'pescadora', dir: 'down', name: 'Marta',
    barks: { dia: ['¡Sardinas, que saltan solas!', '¡Pescado fresco, del de hoy!'], tarde: [], noche: [] }, greet: () => '¿Qué te pongo? Si es fiado, ni lo pidas.',
    topics: [{ id: 'rufo', once: true, need: () => F.stRufoEnc && !F.stRufoHecho, ask: 'Vengo de parte de Rufo.', a: () => (darObjeto('cajas_pescado'), ['¿Rufo? ¿Otra vez fiado?', '(Suspira y te carga tres cajas.) Dile que ya me debe media ballena.']) }] },
  { id: 'lalo', scene: 'town', at: [12.6, 35.4], sprite: 'viejo', dir: 'down', name: 'Lalo',
    barks: { dia: ['¡Un barco negro! ¡En la cala! ¡Lo he visto con estos ojos!', '¡Con un gigante encapuchado, os lo juro!'], tarde: ['Nadie me cree. Nunca nadie me cree.'], noche: ['¿Has oído eso? ...Nada. Será el mar.'] },
    greet: () => '¿Tú también vienes a reírte de mí?',
    topics: [{ id: 'barco', once: true, ask: '¿Qué viste exactamente?', a: () => ['Un barco negro como el carbón, con velas de humo. Y un gigante con capucha, de tres metros. ¡Y un crío!', '(Te mira de arriba abajo.) ...Un crío más o menos como tú, ahora que lo pienso.', '(Entorna los ojos.) No, no. El crío era más feo.'], learn: L('shells', 'El pirata de la cala', 'Lalo vio la Corneja en la cala y se lo ha contado a todo el pueblo. Por suerte, nadie le cree... del todo.') }] },
  { id: 'amaro', scene: 'town', at: [21, 33.7], sprite: 'vecina', dir: 'down', name: 'Viuda Amaro', barks: { dia: ['Este pescado ayer valía la mitad.', '¿Has visto qué cara traía el capitán?'], tarde: ['Una estatua. Con lo que hace falta un tejado nuevo en la escuela.'], noche: [] }, greet: () => 'Buenos días. Si es que lo son.' },
  { id: 'nino_s', scene: 'town', at: [30.6, 24.4], sprite: 'nino', dir: 'up', name: 'Pipo', barks: { dia: ['¡Bum! ¡Te he dado!', '¡Yo seré vicealmirante!'], tarde: ['¿Tú has visto un pirata de verdad?'], noche: [] }, greet: () => '¿Eres un pirata? Lalo dice que hay un pirata en la cala.' },
  { id: 'marinero', scene: 'town', at: [37.6, 42.1], sprite: 'navegante', dir: 'down', name: 'Marinera de la Tortuga', barks: { dia: ['¡Cabo listo!', 'Otra caja de sal. Siempre sal.'], tarde: [], noche: [] }, greet: () => 'Sin pasaje no se sube. Habla con la capitana.' },
  { id: 'artillero', scene: 'bateria', at: [6, 2.2], sprite: 'marine', dir: 'down', name: 'Artillero', barks: [], greet: () => '¡Salva a las doce en punto! ...¿Y tú quién eres?' },
];
// hora: [desde, hasta, escena, punto, mirada]. 'none' = fuera de escena.
const RUT_S = {
  rufo: [[0, 7, 'none'], [7, 23.5, 'cantina', [8.6, 1.5], 'down'], [23.5, 24, 'none']],
  iria: [[0, 8.5, 'none'], [8.5, 17, 'cuartel', [4.2, 2], 'left'], [17, 22, 'posada', [3.2, 7.9], 'up'], [22, 24, 'none']],
  tobi: [[0, 7, 'none'], [7, 13.5, 'town', [44.5, 35.6], 'down'], [13.5, 20, 'town', [47.4, 32.6], 'right'], [20, 23, 'cantina', [9.6, 8.6], 'up'], [23, 24, 'none']],
  bruto: [[0, 13.5, 'none'], [13.5, 20, 'town', [49.4, 32.4], 'left'], [20, 24, 'none']],
  severin: [[0, 5, 'none'], [5, 9.5, 'town', [10.8, 28.2], 'down'], [9.5, 13, 'town', [36.4, 24.2], 'left'], [13, 17, 'cuartel', [9.4, 6.6], 'down'], [17, 21, 'town', [30.4, 35], 'right'], [21, 24, 'none']],
  guardia_cala: [[0, 5, 'none'], [5, 9.5, 'town', [11.8, 28.4], 'down'], [9.5, 24, 'none']],
  brisco: [[0, 9, 'none'], [9, 11.5, 'cuartel', [8.4, 2.6], 'down'], [11.5, 13, 'town', [35.4, 23.2], 'left'], [13, 18, 'cuartel', [8.4, 2.6], 'down'], [18, 24, 'none']],
  quill: [[0, 7, 'none'], [7, 20, 'town', [40.8, 42.1], 'down'], [20, 23, 'cantina', [12.3, 6.6], 'left'], [23, 24, 'none']],
  marinero: [[0, 7, 'none'], [7, 20, 'town', [37.6, 42.1], 'down'], [20, 24, 'none']],
  celes: [[0, 24, 'posada', [8.4, 1.2], 'down']],
  marta: [[0, 7, 'none'], [7, 14, 'town', [23.2, 33.7], 'down'], [14, 24, 'none']],
  amaro: [[0, 8, 'none'], [8, 13, 'town', [21, 33.7], 'down'], [13, 18, 'town', [42, 22.6], 'left'], [18, 24, 'none']],
  lalo: [[0, 6, 'none'], [6, 9, 'town', [12.6, 35.4], 'down'], [9, 18, 'town', [29.4, 23.4], 'right'], [18, 22, 'cantina', [2.6, 8.8], 'up'], [22, 24, 'none']],
  nino_s: [[0, 9, 'none'], [9, 19, 'town', [30.6, 24.4], 'up'], [19, 24, 'none']],
  pardo: [[0, 24, 'cuartel', [3.2, 6.9], 'down']],
  artillero: [[0, 24, 'none']],
};
function rutinasS(force) {
  if (F.stDesfile || F.stHuida) return; const h = hourNow();
  for (const n of PEOPLE) { const r = RUT_S[n.id]; if (!r || (n.id === F.stCompa && F.stSigue) || n.goal) continue; const k = r.findIndex(([a, b]) => h >= a && h < b); if (k < 0 || k === n.slot) continue;
    const [, , scene, at, dir] = r[k], cerca = Math.hypot(n.x - G.x, n.y - G.y) < 400;
    if (scene === 'none') { if (force || n.scene !== G.scene || !cerca) { n.scene = 'none'; n.slot = k; } continue; }
    const [sc] = place(scene, at); if (!force && (n.scene === G.scene || sc === G.scene) && cerca) continue; // nadie aparece ni desaparece delante tuyo
    moveNpc(n, scene, at, dir); n.slot = k; }
}
const openBase = () => F.stDentro || (hourNow() >= 9 && hourNow() < 17 && !(diaS() >= 1 && hourNow() >= 10.5));
const enFoso = () => hourNow() >= 13.5 && hourNow() < 20 && diaS() === 0;

// ---------- objetos de la isla ----------
const OBJETOS_SHELLS = () => [
  { scene: 'town', at: [38.6, 18.9], label: 'Leer', act: () => narr(['«Por orden del capitán Pelayo Brisco: mañana, a las once, desfile en honor del vicealmirante de visita e inauguración del monumento al capitán Pelayo Brisco.»',
    ...(F.stControl ? ['Debajo, un dibujo a carboncillo: un gigante con capucha y un crío con la cabeza enorme. «SE BUSCA: EL PIRATA DE LA CALA». Firmado: Lalo.', '(El crío del dibujo no se te parece en nada. Casi en nada.)'] : [])]) },
  { scene: 'town', at: [33, 21.9], label: 'Mirar', act: () => narr(F.estatua === 'rota' ? ['Lo que queda de la estatua: dos botas de bronce y un sombrero que ha rodado hasta la fuente.', 'Alguien ha dejado una flor encima. Seguramente con sorna.'] : ['Una estatua tapada con una lona y atada con cuerdas. Por debajo asoma una bota de bronce del tamaño de un barril.', 'En la placa del pedestal pone: «Al capitán Pelayo Brisco, guardián de Shells Town». La placa también es de bronce. Y también es enorme.']) },
  { scene: 'town', at: [9.4, 37.4], label: 'Mirar', si: () => F.stIriaEnc && !tiene('compas_iria') && !F.stIriaHecho, act: () => (darObjeto('compas_iria'), narr(['Algo brilla entre la arena y las algas. Un compás de latón, de los de dibujar.'])) },
  { scene: 'town', at: [7.2, 37], label: 'Dormir en la arena', si: () => diaS() === 0 && hourNow() >= 19, act: () => dormir('cala') },
  { scene: 'posada', at: [1.3, 3.8], label: 'Dormir', si: () => F.stCama === diaS() && diaS() === 0, act: () => dormir('posada') },
  { scene: 'town', at: [24.9, 13.8], label: 'Subir a la muralla', si: () => F.stDentro, act: () => subirBateria() },
  { scene: 'cuartel', at: [10, 2.4], label: 'Abrir el cajón', si: () => F.stDentro && !tiene('llave_almacen') && !F.stTengo, act: () => { darObjeto('llave_almacen'); narr(['En el cajón del capitán: un peine, tres cartas de amor sin enviar, un retrato del propio capitán... y una llave grande con una etiqueta: «Decomisos».']); } },
  { scene: 'cuartel', at: [15.2, 2.6], label: 'Buscar', si: () => F.stDentro && !F.stTengo, act: () => recuperar() },
  { scene: 'cuartel', at: [3.2, 7.6], label: 'Mirar', si: () => F.stDentro, act: () => narr(['El sargento Pardo duerme con la boca abierta, sentado en la guardia. En la mesa, un plato con migas y una nota: «Despertarme a las doce».']) },
  { scene: 'town', at: [19.6, 12.4], label: 'Entrar por el desagüe', si: () => F.stCompa === 'tobi' && F.stDesfile && !F.stDentro, act: () => entrarBase() },
  { scene: 'bateria', at: [6, 3], label: 'Mirar el cañón', si: () => !F.stCanon, act: () => narr(['El cañón del centro tiene la mecha encendida. Una mecha larga, de las de saludo, que tardará un buen rato en llegar.', 'Las salvas de saludo no llevan bala. Eso dicen.']) },
];

// ---------- llegada ----------
async function llegadaShells() {
  G.paused = true; F.navegando = false; await irAIsla('shells');
  const d0 = Math.floor(G.minutes / 1440) + 1; G.minutes = d0 * 1440 + 5.5 * 60; F.stD0 = d0; F.stLlegada = true; F.stBote = true;
  const m = P('medusa'); moveNpc(m, 'town', [8.7, 38.9], 'left'); enter('town', [7.6 * T, 38.7 * T], 'right'); G.paused = false; rutinasS(true); WORLD.estatua = 'tapada';
  later(900, () => say(m, { lines: ['Hasta aquí te llevo. Shells Town está detrás de esa loma.', 'Desde aquí salen mercantes a Goa. Busca a Ama Sel. Y no le digas a nadie quién te ha traído.', '(Te pone una bolsita en la mano.) Ciento cincuenta berries. No es un regalo: es un préstamo. Me lo devolverás cuando tengas un barco con bandera.'],
    opts: [{ t: '¿Volveré a verte?', then: () => despedida('Cuando estés listo. O cuando no lo estés y haga falta.') }, { t: 'Gracias. Por todo.', then: () => despedida('No me des las gracias todavía. Dámelas cuando sigas vivo.') }] }));
}
function despedida(linea) { const m = P('medusa');
  say(m, { lines: [linea, '(Se da la vuelta. A mitad de camino hacia el bote, se para sin girarse.)', 'Una cosa más: aquí hay base de la Marina. Si alguien te pregunta por mí, no me conoces.', 'Y si alguien te pregunta por la Medusa Gris... tampoco.'], done: () => {
    cobrar(150); learn(['yo', 'En Shells Town', 'La Medusa Gris me dejó al amanecer en una cala, detrás de Shells Town, con ciento cincuenta berries prestados. Tengo que encontrar la manera de llegar a Goa.']);
    walkTo(m, [5.9, 39.9], 70, n => { n.scene = 'none'; F.stBoteT0 = performance.now(); later(6000, () => { F.stBote = false; F.stMedusaFuera = true; guardarAuto(); }); }); } }); }

// ---------- el control del cadete ----------
function control() { const s = P('severin'); F.stControl = 'en curso'; G.paused = true; emote(s, '!'); bubble(s, '¡Alto ahí!', 1600);
  walkTo(s, [G.x / T + .9, G.y / T - .2], 110, () => { G.paused = false; s.dir = dirTo(s, G);
    say(s, { lines: ['Tú. No te había visto nunca en Shells Town. Y aquí nos conocemos todos.', 'Esta mañana un pescador ha visto un barco negro en la cala. Y ahora apareces tú, viniendo justo de la cala.', '¿Quién eres y qué haces aquí?'],
      opts: [{ t: 'Soy pescador. Vengo de Kalé con mi bote.', then: () => controlFin('mentira', ['¿De Kalé? ¿En un bote? (Mira tus manos.) Esas manos no han tirado una red en su vida.', 'No te creo. Pero tampoco tengo pruebas. Todavía.']) },
        { t: 'Soy el pirata más temido del East Blue.', then: () => controlFin('broma', ['(El marine que lo acompaña se ríe. Severin no.)', 'Muy gracioso. Me acordaré de la gracia.']) },
        { t: 'Busco un barco que me lleve a Goa.', then: () => controlFin('verdad', ['A Goa sale la Tortuga Parda mañana a mediodía. Hasta entonces, no te metas en líos.', '(Te mira un segundo de más.) Lo digo en serio.']) }] }); }); }
function controlFin(tono, lineas) { F.stTono = tono; const s = P('severin');
  say(s, { lines: [...lineas, 'Me llamo Darío Severin, cadete de la base. Si en Shells Town pasa algo raro mientras estás aquí, iré a buscarte a ti primero.'], done: () => { F.stControl = true; s.goal = null; s.slot = null; rutinasS(true);
    learn(['gente', 'Darío Severin', 'Cadete de la Marina en Shells Town. Rubio, recto, con cara de no haber sonreído nunca. Me paró al llegar y se quedó con mi cara.']); guardarAuto(); } }); }

// ---------- el Foso ----------
function pelearFoso() { const b = P('bruto'); G.x = 46 * T; G.y = 32.6 * T; b.x = 48.6 * T; b.y = 32.6 * T; b.scene = 'town';
  pelea({ kind: 'foso', foe: b, foeName: 'Bruto', foeMax: 60, rounds: 2, arma: S.arma, hitP: .56, dmgBase: 10, fin: f => { F.stFosoPeleado = true; if (f.won) { cobrar(50); S.aff.tobi = aff('tobi') + 1; F.stFosoGanado = true; }
      encargoHecho('El Foso', f.won ? 'Le gané a Bruto: cincuenta berries.' : 'Bruto me ganó, pero me levanté.'); const t = P('tobi');
      later(400, () => say(t, { lines: f.won ? ['¡Ja! ¡Bruto en la arena! Toma, cincuenta berries, te las has ganado.', 'Si quieres algo de verdad, pelea conmigo.'] : ['¡Te has levantado! Eso cuenta más que ganar. Bueno, casi.', 'Si quieres probar con algo más duro, pelea conmigo.'] })); },
    tx: { inicio: 'Bruto escupe en la arena y levanta los puños. El Foso grita.', fuerte: 'Bruto te encaja un derechazo. Ves estrellas de verdad.', flojo: 'Te roza la oreja. La gente aplaude igual.', falla: 'Bruto golpea al aire y casi se cae solo.', cae: 'Bruto se sienta en la arena y no quiere levantarse. El Foso estalla.', aturde: 'Bruto se tambalea, buscando la cuerda.', caes: 'Acabas mirando el cielo desde la arena. Alguien te echa un cubo de agua.', tablas: '¡Tiempo! Los dos en pie. El Foso abuchea, pero contento.' } }); }
function pelearTobi() { const t = P('tobi'); G.x = 46 * T; G.y = 32.6 * T; t.x = 48.6 * T; t.y = 32.6 * T; t.scene = 'town';
  pelea({ kind: 'foso', foe: t, foeName: 'Tobi', foeMax: 75, rounds: 3, arma: S.arma, hitP: .6, dmgBase: 11, fin: f => { F.stTobiHecho = true; S.aff.tobi = aff('tobi') + 2; if (f.won) cobrar(80);
      learn(['shells', 'Pelea con Tobi', f.won ? 'Le gané a Tobi en el Foso. Se rio más que yo.' : 'Peleé con Tobi en el Foso. Me ganó, pero me tendió la mano.']);
      later(400, () => say(t, { lines: [f.won ? '(Tobi se levanta riéndose, con la nariz roja.) ¡Me has tumbado! Ochenta berries, la bolsa es tuya.' : '(Tobi te levanta de un tirón.) No está mal. Aguantas como una mula.', 'Hacía tiempo que nadie peleaba así conmigo. Sin miedo y sin trampas.', 'Dime una cosa: ¿qué haces de verdad en Shells Town?'] })); },
    tx: { inicio: 'Tobi salta de un pie a otro, sonriendo. «Venga, que no muerdo. Mucho.»', fuerte: 'Tobi te mete un gancho en las costillas. Pega como un marine. Pega como un exmarine.', flojo: 'Un jab rápido en el hombro. Tobi se ríe.', falla: 'Tobi falla y se encoge de hombros. «Ese no contaba.»', cae: 'Tobi cae de espaldas en la arena y se queda mirando el cielo, riéndose.', aturde: 'Tobi sacude la cabeza como un perro mojado.', caes: 'Tobi te barre los pies y acabas en la arena. Te tiende la mano antes de que toques el suelo.', tablas: '¡Tiempo! Tobi levanta tu brazo y el suyo a la vez. El Foso aplaude.' } }); }

// ---------- la elección ----------
function unirse(id) { F.stCompa = id; const c = COMPA[id]; S.aff[id] = aff(id) + 2;
  learn(['yo', 'Mi primer compañero', `${c.n} se viene conmigo a Goa. Antes, mañana durante el desfile, vamos a recuperar ${c.cosa} del almacén de la base.`]);
  encargo('El plan del desfile', `Mañana a las once menos cuarto, quedar con ${c.n}, entrar en la base durante el desfile y recuperar ${c.cosa}. La Tortuga Parda zarpa a mediodía.`);
  guardarAuto(); }
function dormir(lugar) { if (diaS() >= 1) return narr(['Hoy no hay tiempo para dormir.']);
  narr([lugar === 'posada' ? 'Te tumbas en la cama de La Concha. Las sábanas huelen a sal y a jabón.' : 'Te tumbas en la arena, con la bolsa de almohada. Las estrellas no son las de Kalé, pero se parecen.'], () => {
    G.paused = true; timelapse((F.stD0 + 1) * 1440 + 8 * 60, 2800, () => { G.paused = false; rutinasS(true);
      narr([lugar === 'posada' ? 'Te despiertas con el olor del pan de Doña Celes. Hoy es el día del desfile.' : 'Te despiertas con arena hasta en las orejas. Hoy es el día del desfile.', F.stCompa ? `${COMPA[F.stCompa].n} te espera a las once menos cuarto.` : 'Todavía no has encontrado a nadie con quien ir a Goa.']); guardarAuto(); }); }); }

// ---------- el desfile ----------
const PUNTO = { rufo: ['town', [15, 20.9], 'down'], iria: ['town', [33, 17.4], 'down'], tobi: ['town', [19.4, 13.2], 'down'] };
const PLAZA_GENTE = { celes: [29.2, 24.8, 'up'], marta: [30.4, 25.6, 'up'], lalo: [36.8, 24.9, 'up'], amaro: [35.6, 25.6, 'up'], nino_s: [32.2, 25.4, 'up'], brisco: [35.2, 21.8, 'left'], severin: [34.4, 19.2, 'down'], pardo: null, bruto: [28.6, 23.6, 'right'] };
function empiezaDesfile() { F.stDesfile = true; F.noGuardar = true; WORLD.estatua = 'tapada';
  for (const [id, at] of Object.entries(PLAZA_GENTE)) { const n = P(id); if (!n || id === F.stCompa) continue; if (!at) { moveNpc(n, 'cuartel', [3.2, 6.9], 'down'); emote(n, 'zzz', 1e9); continue; } moveNpc(n, 'town', [at[0], at[1]], at[2]); n.slot = null; }
  for (const id of Object.keys(COMPA)) { const n = P(id); if (!n || id === F.stCompa) continue; moveNpc(n, 'town', id === 'rufo' ? [27.8, 24.6] : id === 'iria' ? [37.8, 24.2] : [38.6, 23.2], 'up'); }
  const c = P(F.stCompa); if (c) { const [sc, at, dir] = PUNTO[F.stCompa]; moveNpc(c, sc, at, dir); c.greet = () => '¡Por fin! ¿Listo?'; c.topics = [{ id: 'vamos', ask: 'Vamos.', a: () => ['Vamos. Y no hagas ruido.'], then: () => entrarBase() }]; if (F.stCompa === 'tobi') c.topics = [{ id: 'vamos', ask: 'Vamos.', a: () => ['Por el desagüe. Detrás de mí. Y respira por la boca.'], then: () => entrarBase() }]; }
  P('artillero').scene = 'none'; }
function eleccionForzada() { const c = Object.keys(COMPA).sort((a, b) => aff(b) - aff(a))[0], n = P(c); unirse(c); Object.assign(n, { scene: G.scene, x: G.x + 30, y: G.y, dir: 'left', goal: null });
  say(n, { lines: ['¡Eh! Te estaba buscando.', 'Lo de Goa... he estado pensando. Si te vas, me voy contigo. Pero antes tengo que recuperar ' + COMPA[c].cosa + ' del almacén de la base.', 'Hoy, con el desfile, es la única ocasión. A las once menos cuarto, ¿vale?'] }); }
function entrarBase() { const id = F.stCompa, c = P(id); F.stDentro = true; F.stSigue = true; G.paused = true;
  fade(() => { G.paused = false;
    if (id === 'tobi') { enter('town', [22.6 * T, 12.6 * T], 'right'); moveNpc(c, 'town', [22.2, 13.1], 'right'); narr(['Salís del desagüe al patio de armas, cubiertos de barro hasta las rodillas. El patio está vacío: todos están en la plaza.']); }
    else if (id === 'iria') { enter('town', [33 * T, 13.2 * T], 'up'); moveNpc(c, 'town', [32.2, 13.4], 'up'); narr(['El guardia del portón mira el pase de Iria, te mira a ti, mira el pase otra vez. «Copista y ayudante. Adelante.»']); }
    else { const [sc, [x, y]] = place('cuartel', [8, 8.2]); enter(sc, [x, y], 'up'); moveNpc(c, 'cuartel', [7, 8.2], 'up'); narr(['Entráis por la puerta de servicio empujando el carro del banquete. El sargento de guardia duerme como un tronco.']); } }); }
function recuperar() { if (!tiene('llave_almacen')) return; const id = F.stCompa, c = P(id); F.stTengo = true; quitarObjeto('llave_almacen'); darObjeto(COMPA[id].obj);
  const lin = { rufo: ['(Entre cajas de botellas y redes, un trapo atado. Rufo lo abre con cuidado: tres cuchillas que brillan.)', '¡Mis niñas! ¿Os han tratado bien? ¿Os han dado de comer?', '...Les hablo. Ya lo sé. No me mires así.'],
    iria: ['(En un cajón con la etiqueta «Cartografía no autorizada», una carta enrollada. Iria la abre con las manos temblando.)', 'Es ella. Es su letra.', '(Iria la enrolla y se la guarda en la camisa, contra el pecho.) Vámonos.'],
    tobi: ['(Apoyada en la pared, entre picas oxidadas, una lanza de fresno con la punta de hierro negro.)', '(Tobi la coge como quien saluda a alguien después de mucho tiempo.)', 'Hola, viejo.'] }[id];
  say(c, { lines: [...lin, 'Por la puerta no: el portón está lleno de marines. Hay una escalera a la batería, en la muralla sur. Desde arriba se baja por los tejados de la cantina.'], done: () => { if (id === 'tobi') c.arma = 'lanza'; if (id === 'rufo') c.arma = 'daga'; quitarObjeto(COMPA[id].obj); learn(['yo', 'Lo recuperamos', `Recuperamos ${COMPA[id].cosa} del almacén de decomisos. Ahora hay que salir de la base sin que nos vean.`]); } }); }
function subirBateria() { if (!F.stTengo) return narr(['Primero, lo que habéis venido a buscar.']); fade(() => { const B = bld('bateria').entrance, d = B.doors.find(d => d.to === 'town'), [at, dir] = B.doorArrival(...d.args); enter(B.id, at, 'down'); }); }

// ---------- el cañonazo ----------
function tropiezo() { F.stCanon = 'tropiezo'; G.paused = true; const id = F.stCompa, c = P(id);
  const lin = { rufo: ['(Rufo se agacha a mirar la mecha encendida.) ¿Esto se apaga soplando?', '(Sopla. La mecha chisporrotea más fuerte. Al apartarse, empuja el cañón con la barriga.)'],
    iria: ['(Iria mide el ángulo del cañón con dos dedos, por pura costumbre.) Está mal apuntado. Apunta al mar, pero un saludo debería...', '(Lo empuja un poco para corregirlo. Un poco demasiado.)'],
    tobi: ['(Tobi se apoya en el cañón, chulo.) Tranquilo, las salvas no llevan bala.', '(El cañón gira bajo su peso y apunta, muy despacio, a la plaza.) ...Normalmente.'] }[id];
  say(c, { lines: [...lin, '(La mecha llega al final.)'], done: () => { sfx('disparo'); later(200, canonazo); } }); }
function canonazo() { F.stCanon = 'disparo'; const c = P(F.stCompa);
  G.scene = 'town'; G.x = 29.1 * T; G.y = 14.1 * T; G.dir = 'down'; moveNpc(c, 'town', [28.1, 14.1], 'down'); G.foco = [31.5 * T, 18.5 * T]; F.stSigue = false;
  const b = P('brisco'); bubble(b, '¡Shells Town... os presento...!', 2000);
  later(1400, () => { WORLD.estatua = 'descubierta'; emote(b, '!'); F.stBala = { t0: performance.now() }; sfx('disparo'); });
  later(2600, () => { WORLD.estatua = 'rota'; F.estatua = 'rota'; F.stBoom = { t0: performance.now() }; sfx('golpe'); sfx('haki'); const el = document.getElementById('game'); el.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-8px,4px)' }, { transform: 'translate(6px,-4px)' }, { transform: 'translate(0,0)' }], { duration: 400 });
    for (const n of PEOPLE) if (n.scene === 'town' && Math.hypot(n.x - 33 * T, n.y - 21 * T) < 7 * T) emote(n, '!', 2400); });
  later(3700, () => bubble(b, '¡¡MI ESTATUA!!', 2400));
  later(5600, () => { G.foco = null; const s = P('severin'); emote(s, '!!'); bubble(s, '¡En la muralla! ¡Son ellos!', 2200); for (const id of ['guardia1', 'guardia2']) emote(P(id), '!'); });
  later(8000, () => { bubble(c, '¡¡CORRE!!', 1600); later(1400, () => fade(rivalEnElPatio)); }); }
function rivalEnElPatio() { const s = P('severin'), c = P(F.stCompa); G.scene = 'town'; enter('town', [26.4 * T, 13.2 * T], 'right'); moveNpc(c, 'town', [25.6, 13.4], 'right'); moveNpc(s, 'town', [30.6, 13.2], 'left'); F.stSigue = true; G.paused = false; F.stCanon = true;
  later(300, () => say(s, { lines: [F.stTono === 'broma' ? 'El pirata más temido del East Blue, ¿no? Ya decía yo que no era una broma.' : 'Tú. Sabía que te volvería a ver. No sabía que tan pronto.', ...(F.stCompa === 'tobi' ? ['(Mira a Tobi.) ...Y tú. Claro. Siempre tú.'] : []), 'Esa estatua le costó al capitán la paga de un año. A mí me va a costar el ascenso.', 'Ríndete.'],
    opts: [{ t: 'Apártate.', then: duelSeverin }, { t: 'Ha sido un accidente. De verdad.', then: () => say(s, { lines: ['(Por un segundo, casi te cree. Casi.)', 'Se lo explicas al juez.'], done: duelSeverin }) }] })); }
function duelSeverin() { const s = P('severin');
  pelea({ kind: 'severin', foe: s, foeName: 'Cadete Severin', foeMax: 85, rounds: 3, arma: S.arma, hitP: .64, dmgBase: 12, fin: finSeverin,
    tx: { inicio: 'Severin desenvaina la espada reglamentaria. «Ríndete y será más fácil para los dos.»', otra: 'Severin respira hondo y vuelve a la guardia. Es bueno. Muy bueno.', fuerte: 'La hoja plana te da en las costillas. Severin no quiere matarte: quiere detenerte.', flojo: 'Te corta la manga. Por poco.', falla: 'Severin falla y se le escapa un gruñido. No está acostumbrado.', cae: 'Severin cae de rodillas, sin aire. Por primera vez te mira con algo parecido al respeto.', aturde: 'Severin retrocede, aturdido, buscando la guardia.', caes: 'Severin te desarma y te pone la punta en el pecho. «Se acabó.»', tablas: 'Os separáis jadeando. Severin no baja la espada, pero le tiembla.' } }); }
function finSeverin(f) { const s = P('severin'), c = P(F.stCompa); F.stSeverin = f.won ? 'ganaste' : 'perdiste'; S.fama = { ...(S.fama || {}), estatua: true, cadete: F.stSeverin, compa: F.stCompa };
  const salva = { rufo: '(Rufo aparece por detrás con una sartén del banquete. ¡CLONC!)', iria: '(Iria le tira el tintero a la cara. Severin se queda ciego, con la cara azul.)', tobi: '(Tobi le barre los pies con el asta de la lanza. Severin cae de espaldas.)' }[F.stCompa];
  const sigue = () => { act(s, 'hurt', { hold: true, fps: 10 }); F.stSeverinGolpe = true; later(500, () => say(s, { lines: ['(Desde el suelo, Severin te mira a los ojos.)', 'Esto... no ha terminado. Me acordaré de tu cara.'], done: huida })); };
  learn(['shells', 'La pelea del patio', f.won ? 'Me batí con el cadete Severin en el patio de la base y gané. No le hizo ninguna gracia.' : `Severin me ganó en el patio de la base. Si no llega a ser por ${COMPA[F.stCompa].n}, ahora estaría en un calabozo.`]);
  if (f.won) sigue(); else { G.act = null; say(c, { lines: [salva, '¡Arriba! ¡Que se nos va el barco!'], done: sigue }); } }

// ---------- la huida ----------
function huida() { F.stHuida = true; F.stSigue = true; G.paused = false; encargoHecho('El plan del desfile', 'La estatua del capitán ya no existe. Huimos hacia el muelle.');
  narr(['Cruzáis el portón a la carrera. En la plaza, la gente se aparta; los marines todavía buscan entre los escombros de la estatua.', 'Las campanas de la base empiezan a sonar. La Tortuga Parda está soltando amarras en el muelle. ¡Corre!']);
  for (const id of ['guardia1', 'guardia2']) { const n = P(id); if (n) { n.persigue = true; n.goal = null; } } }
function alMuelle() { F.stFin = true; G.paused = true; const q = P('quill'); moveNpc(q, 'town', [40.4, 42.1], 'left');
  const total = Math.min(berries(), 1200);
  say(q, { lines: ['¿Os persigue media base de la Marina? ¡Subid, subid!', '(Te mira con los ojos entornados.) Con la Marina detrás, el pasaje vale el doble: mil doscientos berries.', total >= 1200 ? '(Pagas. Te quedas con la bolsa ligera y el corazón a mil.)' : `(Le das todo lo que llevas: ${total.toLocaleString('es-ES')} berries.) ...Y el resto lo pagáis fregando la cubierta hasta Goa.`], done: () => {
    pagar(total); F.tortugaFuera = true; learn(['yo', 'Rumbo a Goa', `Huimos de Shells Town en la Tortuga Parda con ${COMPA[F.stCompa].n}. Pagué ${total.toLocaleString('es-ES')} berries${total < 1200 ? ' y fregaremos la cubierta hasta Goa' : ''}.`]);
    F.noGuardar = false; guardarAuto(); finActo1(); } }); }
function finActo1() { const c = COMPA[F.stCompa];
  pizarra([{ d: ESC.huida, t: `La Tortuga Parda soltó amarras con la Marina en el muelle. Desde la borda veías al cadete Severin gritar algo que el viento se llevaba. No hacía falta oírlo.` },
    { d: ESC.goa, t: `Shells Town se hizo pequeña detrás. ${c.n} se sentó a tu lado en la cubierta, sin decir nada. Rumbo a Goa: ya erais dos.` }], null,
    { cierre: `<b>Fin del Acto 1</b><span>${fullName()} · ${S.tripulacion ? S.tripulacion + ' · ' : ''}con ${c.n}</span><small>El Acto 2 empieza en Goa.</small><button type="button" class="btn" id="finmenu">Volver al menú</button>`, semilla: 52 });
  const b = document.getElementById('finmenu'); if (b) b.onclick = () => location.reload(); keyHandler = null; }

// ---------- reglas de la isla ----------
function shellsBloquea(d) { if (!String(d.to).startsWith('cuartel:')) return null; const I = interior(d.to), cuarto = I.rooms.map(r => r.n);
  if (cuarto.includes('Almacén de decomisos')) return !F.stDentro ? 'El sargento Pardo levanta la vista: «Ahí dentro no se te ha perdido nada.»' : !tiene('llave_almacen') && !F.stTengo ? 'La puerta del almacén tiene un candado del tamaño de un puño.' : null;
  if (cuarto.includes('Despacho del capitán')) return !F.stDentro ? 'El sargento Pardo carraspea: «El capitán no recibe. Y menos hoy.»' : null; return null; }
function shellsInit() { WORLD.estatua = F.estatua || 'tapada';
  const B = bld('bateria').entrance, d = B.doors.find(d => d.to === 'town'); d.salida = [[24.9 * T, 13.4 * T], 'down']; d.etiqueta = 'Bajar al patio';
  WORLD.sprites.push({ ...barcoSprite('marina', 46 * T, 47.4 * T, 12 * T), visible: () => F.stDesfile && !F.tortugaFuera });
  for (const n of PEOPLE) n.slot = null; if (F.stMedusaFuera || !F.stLlegada) { const m = P('medusa'); if (m) m.scene = 'none'; } rutinasS(true); }
function shellsRestaurar() { WORLD.estatua = F.estatua || 'tapada'; for (const n of PEOPLE) n.slot = null; const m = P('medusa'); if (m) m.scene = 'none'; F.stBote = false; rutinasS(true); }
let lastS = 0;
function shellsTick(now) {
  if (G.lapse) return;
  // la ceremonia espera mientras estás dentro de la base: no se pierde el barco por ir despacio
  if (F.stDentro && !F.stFin) G.minutes = Math.min(G.minutes, (F.stD0 + 1) * 1440 + 11.9 * 60);
  if (now - lastS < 300) return; lastS = now; const h = hourNow(), d = diaS();
  rutinasS(false);
  if (!F.stControl && !G.talking && !G.paused) { const s = P('severin'); if (s && s.scene === 'town' && G.scene === 'town' && Math.hypot(s.x - G.x, s.y - G.y) < 3.4 * T) control(); }
  if (d >= 1 && h >= 9.5 && !F.stCompa && !G.talking && !G.paused) eleccionForzada();
  if (d >= 1 && h >= 10.5 && F.stCompa && !F.stDesfile) empiezaDesfile();
  // el portón: fuera de horario, los guardias te devuelven a la calle
  if (G.scene === 'town' && !openBase() && G.x > 21.5 * T && G.x < 44.5 * T && G.y > 3 * T && G.y < 14.6 * T && !G.paused) { G.x = 33 * T; G.y = 17 * T; bubble(P('guardia1'), F.stDesfile ? '¡Hoy no entra nadie! ¡Hay desfile!' : 'La base está cerrada. Fuera.', 2200); }
  // el compañero te sigue de escena en escena
  const c = F.stSigue && P(F.stCompa);
  if (c && !G.paused && !G.talking) { if (c.scene !== G.scene) { c.scene = G.scene; c.x = G.x - 24; c.y = G.y + 2; } else if (Math.hypot(c.x - G.x, c.y - G.y) > 52) c.goal = { x: G.x - (G.dir === 'left' ? -26 : 26), y: G.y + 4, speed: G.run ? 180 : 130 }; }
  // en la batería, al acercarte a los cañones, tu compañero tropieza
  if (F.stTengo && !F.stCanon && G.scene.startsWith('bateria') && !G.talking && G.y > interior(G.scene).Y(2.1)) tropiezo();
  // la huida: los guardias te persiguen y el barco espera en el muelle
  if (F.stHuida && !F.stFin) { for (const id of ['guardia1', 'guardia2']) { const n = P(id); if (n && n.scene === G.scene && G.scene === 'town') { n.goal = { x: G.x + (id === 'guardia1' ? -60 : 60), y: G.y - 40, speed: 95 }; if (Math.random() < .08) bubble(n, pick(['¡Alto!', '¡Detenedlos!', '¡En nombre de la Marina!']), 1200); } }
    if (G.scene === 'town' && Math.hypot(G.x - 39 * T, G.y - 41.9 * T) < 2.6 * T) alMuelle(); }
}
// ---------- dibujos de la isla ----------
function shellsDibujar(g, [cx, cy], now) {
  // el bote de la Medusa Gris, amarrado en la arena o alejándose
  if (F.stBote) { const k = F.stBoteT0 ? Math.min(1, (now - F.stBoteT0) / 6000) : 0, x = 5.4 * T - k * 220 - cx, y = 40.4 * T + k * 60 - cy;
    g.fillStyle = 'rgba(0,20,40,.3)'; g.beginPath(); g.ellipse(x + 4, y + 8, 34, 9, 0, 0, 7); g.fill(); g.fillStyle = '#1a1210'; g.beginPath(); g.moveTo(x - 34, y - 6); g.lineTo(x + 34, y - 6); g.lineTo(x + 24, y + 8); g.lineTo(x - 26, y + 8); g.closePath(); g.fill();
    g.fillStyle = '#6a4428'; g.beginPath(); g.moveTo(x - 31, y - 4); g.lineTo(x + 31, y - 4); g.lineTo(x + 22, y + 6); g.lineTo(x - 24, y + 6); g.closePath(); g.fill(); g.fillStyle = '#4a2e1a'; g.fillRect(x - 8, y - 4, 4, 10); g.fillRect(x + 8, y - 4, 4, 10);
    if (k > 0) { g.fillStyle = '#2a2a33'; g.fillRect(x - 6, y - 24, 12, 20); g.beginPath(); g.arc(x, y - 26, 7, 0, 7); g.fill(); g.strokeStyle = '#4a3020'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 30, y - 10 + Math.sin(now / 300) * 4); g.lineTo(x + 30, y - 2 - Math.sin(now / 300) * 4); g.stroke(); } }
  // banderines en la plaza el día del desfile
  if (diaS() >= 1 && F.stCompa) for (const [a, b] of [[[28.6, 17], [37.4, 17]], [[28.4, 25], [37.6, 25]], [[28.6, 17], [28.4, 25]], [[37.4, 17], [37.6, 25]]]) { const ax = a[0] * T - cx, ay = a[1] * T - cy - 40, bx = b[0] * T - cx, by = b[1] * T - cy - 40, n = 16;
    g.strokeStyle = 'rgba(40,30,20,.7)'; g.lineWidth = 1; g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo((ax + bx) / 2, (ay + by) / 2 + 14, bx, by); g.stroke();
    for (let k = 1; k < n; k++) { const t = k / n, x = ax + (bx - ax) * t, y = ay + (by - ay) * t + Math.sin(t * Math.PI) * 7, sw = Math.sin(now / 400 + k) * 1.5; g.fillStyle = k % 2 ? '#2f4f9a' : '#f4f6fa'; g.beginPath(); g.moveTo(x - 4, y); g.lineTo(x + 4, y); g.lineTo(x + sw, y + 9); g.closePath(); g.fill(); } }
  // la tarima del capitán
  if (diaS() >= 1 && F.stCompa) { const x = 35.2 * T - cx, y = 22.6 * T - cy; g.fillStyle = '#2a1a10'; g.fillRect(x - 30, y - 12, 60, 18); g.fillStyle = '#8a5a34'; g.fillRect(x - 28, y - 10, 56, 14); g.fillStyle = '#c8402e'; g.fillRect(x - 28, y - 10, 56, 4); }
}
function shellsEncima(g, [cx, cy], now) {
  // la bala: de la tronera a la estatua, con su arco
  if (F.stBala) { const k = (now - F.stBala.t0) / 1200; if (k > 1) F.stBala = null; else { const x0 = 28.5 * T, y0 = 14.4 * T, x1 = 33 * T, y1 = 18.8 * T, x = x0 + (x1 - x0) * k - cx, y = y0 + (y1 - y0) * k - Math.sin(k * Math.PI) * 120 - cy;
    g.fillStyle = 'rgba(200,200,200,.5)'; for (let i = 1; i < 6; i++) { const kk = Math.max(0, k - i * .03); g.beginPath(); g.arc(x0 + (x1 - x0) * kk - cx, y0 + (y1 - y0) * kk - Math.sin(kk * Math.PI) * 120 - cy, 6 - i * .8, 0, 7); g.fill(); }
    g.fillStyle = '#121218'; g.beginPath(); g.arc(x, y, 6, 0, 7); g.fill(); g.fillStyle = '#5a5a66'; g.fillRect(x - 3, y - 4, 2, 2); } }
  // el impacto: fogonazo, trozos de bronce y polvo
  if (F.stBoom) { const k = (now - F.stBoom.t0) / 2600; if (k > 1) F.stBoom = null; else { const x = 33 * T - cx, y = 19.4 * T - cy;
    if (k < .15) { g.fillStyle = `rgba(255,240,190,${1 - k / .15})`; g.beginPath(); g.arc(x, y, 30 + k * 400, 0, 7); g.fill(); }
    for (let i = 0; i < 18; i++) { const a = hash(i, 1, 97) * Math.PI * 2, r = (40 + hash(i, 2, 97) * 120) * Math.min(1, k * 3), px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * .6 - Math.sin(Math.min(1, k * 2) * Math.PI) * 50 * hash(i, 3, 97);
      g.fillStyle = i % 3 ? '#946a36' : '#c09050'; g.fillRect(px - 3, py - 3, 6, 5); }
    for (let i = 0; i < 10; i++) { const a = hash(i, 4, 97) * Math.PI * 2, r = 20 + k * 90; g.fillStyle = `rgba(220,210,190,${.5 * (1 - k)})`; g.beginPath(); g.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * .5 - k * 30, 14 + k * 26, 0, 7); g.fill(); } } }
  // la mecha encendida en la batería
  if (G.scene.startsWith('bateria') && !F.stCanon) { const I = interior(G.scene), x = I.X ? I.X(5.4) - cx : 0, y = I.Y ? I.Y(3.2) - cy : 0, fl = Math.floor(now / 90) % 3;
    const gl = g.createRadialGradient(x, y, 1, x, y, 26); gl.addColorStop(0, 'rgba(255,200,90,.55)'); gl.addColorStop(1, 'rgba(255,200,90,0)'); g.fillStyle = gl; g.fillRect(x - 26, y - 26, 52, 52);
    g.fillStyle = ['#ffd85a', '#ff9a3a', '#fff2c0'][fl]; g.fillRect(x - 3 + fl, y - 4, 5, 5); g.fillRect(x - 6 + fl * 3, y - 7 + fl, 2, 2); g.fillRect(x + 4 - fl, y - 6, 2, 2); g.fillStyle = 'rgba(200,200,200,.45)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(x + Math.sin(now / 300 + k) * 4, y - 8 - ((now / 40 + k * 8) % 24), 3 + k, 0, 7); g.fill(); } }
}
