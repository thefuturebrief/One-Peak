// El Reino de Goa (Acto 2). Diseño en docs/goa.md. Plano: islas/goa.json (herramientas/goa_plano.py); dibujos propios: goa-mundo.js.
// Esta versión pone en el juego la ciudad entera (barrios, gente, tiendas, astillero) y el día de llegada, con el edicto recién pegado.
// Los días 1 a 4 (Vardán, la fiesta, la huida y el desalojo) van después, sobre esta base.
ISLAS.goa = { n: 'Goa', plano: 'islas/goa.json', gente: () => GENTE_GOA(), objetos: () => OBJETOS_GOA(),
  tick: (now, dt) => goaTick(now, dt), dibujar: (g, cam, now) => goaDibujar(g, cam, now), encima: (g, cam, now, VW, VH) => goaEncima(g, cam, now, VW, VH),
  init: () => goaInit(), restaurar: d => goaRestaurar(d), bloquea: d => goaBloquea(d), objetivo: () => goaObjetivo() };
// sus personajes se cargan al llegar a la isla (herramientas/lpc-chars-goa.js)
ISLAS.goa.sprites = ['ama_sel', 'vardan', 'marques', 'duval', 'fina', 'isolda', 'teo', 'bram', 'coque', 'pina', 'lucho', 'toto', 'mola', 'ferro', 'lis',
  ...[['noble', 8], ['guardia', 5], ['criado', 4], ['mercader', 8], ['marinero', 6], ['terminal', 8], ['nino', 4]].flatMap(([c, n]) => Array.from({ length: n }, (_, k) => `g_${c}${k + 1}`))];
const goaSinAnim = () => { for (const id of ['ama_sel', 'bram', 'mola', 'ferro', 'g_guardia4', 'g_mercader5', 'g_marinero2', 'g_marinero4', 'g_marinero6', 'g_terminal3', 'g_terminal7']) SIN_ANIM[id] = ['shoot']; for (const id of ['pina', 'lucho', 'toto', 'g_nino1', 'g_nino2', 'g_nino3', 'g_nino4']) SIN_ANIM[id] = ['slash', 'thrust', 'shoot', 'hurt']; }; // los cuerpos fornidos no disparan y los críos solo caminan
const diaG = () => Math.floor(G.minutes / 1440) - (F.goaD0 || 0);
const quedan = () => Math.max(0, 5 - diaG());
const SPRITE_COMPA = { rufo: 'rufo', nerea: 'iria', niklas: 'tobi' };
const tPx = (x, y) => [x * T, y * T];

// ---------- la gente de la ciudad: generada por clase, con casa, horario y frases ----------
const FRASES = {
  noble: { dia: ['¿Has visto el sombrero de la condesa? Un escándalo.', 'Dicen que el marqués se va de viaje. A saber adónde.', 'Huele a puerto. Qué horror.', 'La fiesta del marqués será la de la temporada.', 'Mi sastre dice que este año se lleva el morado.'], tarde: ['Un té, un paseo y a casa. La vida es dura.', 'Esa gente de la Terminal... ¿por qué no se van ya?'], noche: [] },
  guardia: { dia: ['Circulen.', 'Sin novedad en la Ciudad Alta.', 'La Puerta Real no es una plaza.'], tarde: ['Dos horas más de guardia. Dos.'], noche: ['Ronda de noche. Sin novedad.'] },
  criado: { dia: ['El señor quiere las flores azules. Ayer las quería blancas.', 'Llego tarde, llego tarde...', 'Tres docenas de copas para la fiesta. Tres docenas.'], tarde: ['Plata que pulir. Siempre hay plata que pulir.'], noche: [] },
  mercader: { dia: ['¡Manzanas de Foosha, dulces como la miel!', '¡Telas de Loguetown! ¡Tocar es gratis!', '¡Pescado del día, todavía se mueve!', '¡Especias del South Blue!', '¡Quesos de cabra! ¡Prueba, prueba!', '¡Flores para la señora!'], tarde: ['Última hora, todo a mitad de precio. Bueno, a tres cuartos.'], noche: [] },
  marinero: { dia: ['Esa caja pesa más que mi suegra.', '¡Cuidado con la cabeza!', 'Mañana zarpamos a Orange Town.', '¿Has visto el humo de la Terminal? Peor que nunca.'], tarde: ['A la taberna, que ya toca.'], noche: ['Una más y a dormir. Bueno, dos.'] },
  terminal: { dia: ['¿Vienes a comprar o a mirar?', 'Cinco días. Dicen que en cinco días nos echan.', 'Esto ya ardió una vez. No va a arder otra.', 'Un tornillo, dos tornillos... hoy se come.', 'El edicto, el edicto. ¿Y adónde vamos? ¿Al mar?'], tarde: ['Del barranco para allá, nadie nos quiere. Del barranco para acá, tampoco.'], noche: ['(Alguien canta bajito junto a una hoguera.)'] },
  nino: { dia: ['¡No me pillas!', '¡Al fuerte, al fuerte!', '¡Pina dice que hoy vamos al puerto!'], tarde: ['¡Me toca a mí!'], noche: [] },
};
const NOMBRE_CL = { noble: ['Caballero de la Ciudad Alta', 'Dama de la Ciudad Alta'], guardia: ['Guardia Real', 'Guardia Real'], criado: ['Criado', 'Criada'], mercader: ['Mercader', 'Mercadera'], marinero: ['Marinero', 'Marinera'], terminal: ['Chatarrero', 'Chatarrera'], nino: ['Crío', 'Cría'] };
const SALUDO = { noble: ['¿Sí? ¿Nos conocemos?', 'Disculpe, tengo prisa.', '(Te mira de arriba abajo y sigue andando.)'], guardia: ['Circule.', '¿Algún problema?', 'Documentos no, gracias. Circule.'], criado: ['Perdone, el señor me espera.', 'No puedo pararme, de verdad.'],
  mercader: ['¿Te pongo algo?', 'Mira, mira, que mirar es gratis.', 'Para ti, precio de amigo.'], marinero: ['¿Buscas barco? Pregunta en la taberna.', 'Aparta, que llevo prisa.'], terminal: ['¿Forastero? Aquí no hay nada para ti.', 'Si vienes de la Ciudad Alta, vuélvete.', 'Mientras no vengas a echarnos...'], nino: ['¡Pina manda! ¡Pregúntale a ella!', '¿Tienes un berry? ¿Uno?'] };
const RUTAS = { alta: [[24.6, 10.6], [45.4, 10.6], [45.4, 15.2], [24.6, 15.2]], faroles: [[47.6, 12.4], [63, 12.4]], calleAlta: [[7, 21.8], [63, 21.8]], real: [[35, 25.6], [35, 56.8]], mercaderes: [[4, 31], [64, 31]],
  puente: [[4, 40], [24, 40]], molino: [[13, 49], [56, 49]], puerto: [[4, 58], [64, 58]], muelle1: [[12, 64.6], [32, 64.6]], muelle2: [[38, 64.6], [62, 64.6]], plaza: [[26, 44.6], [44, 44.6], [44, 48.2], [26, 48.2]],
  chatarra1: [[74, 29.6], [104, 29.6]], chatarra2: [[72.6, 40.6], [86, 40.6]], chatarra3: [[90, 50.4], [106, 50.4]], montana: [[76, 22.6], [85, 22.6]], montana2: [[92, 21.6], [104, 21.6]], fuerte: [[100, 40.4], [107, 46.4]] };
// puestos del mercado: quién vende y quién compra delante
const PUESTOS = [[26, 41.6], [28.8, 41.6], [31.6, 41.6], [37, 41.6], [39.8, 41.6], [42.6, 41.6], [26, 45], [28.8, 45], [31.6, 45], [37, 45], [39.8, 45]];
const CASAS = { centro: ['casa_a0', 'casa_a1', 'casa_a2', 'casa_a3', 'casa_a4', 'casa_a5', 'casa_b0', 'casa_b1', 'casa_c0', 'casa_c1', 'casa_c2', 'casa_c3', 'casa_c4', 'casa_c5'], alta: ['noble1', 'noble2', 'mansion'],
  puerto: ['almacen0', 'almacen1', 'almacen2', 'almacen3', 'almacen4', 'almacen5', 'posada_goa'], terminal: ['chabola0', 'chabola1', 'chabola2', 'chabola3', 'chabola4', 'chabola5', 'chabola6', 'chabola7', 'chabola8', 'chabola9', 'chabola10'] };
// el cuerpo de cada diseño, como en el generador: para llamar a cada uno «vecino» o «vecina» según se ve
const CUERPOS_G = { noble: 'mf', guardia: 'mmfm', criado: 'mf', mercader: 'mfmfm', marinero: 'mmfm', terminal: 'mfmm', nino: 'm' };
const esMujer = sp => { const m = /^g_([a-z]+)(\d+)$/.exec(sp); if (!m) return false; const c = CUERPOS_G[m[1]]; return c[(+m[2] - 1) % c.length] === 'f'; };
function vecinoGoa(cl, i, sprite, extra) { const fem = esMujer(sprite), cs = { noble: 'alta', guardia: 'alta', criado: 'alta', terminal: 'terminal', marinero: 'puerto' }[cl] || 'centro', casa = cl === 'guardia' ? 'guardia_real' : CASAS[cs][i % CASAS[cs].length];
  return { id: `${cl}_${i}`, casa, scene: 'town', at: [35, 30], sprite, dir: 'down', name: NOMBRE_CL[cl][fem ? 1 : 0], clase: cl, barks: FRASES[cl], greet: () => pick(SALUDO[cl]), vel: 40 + (i * 7) % 22, ...extra }; }
const j = (i, k) => ((i * 37 + k * 11) % 10) / 10; // desfase de horario por persona, sin azar
function genteCiudad() { const out = [], add = (cl, sp, agenda, extra) => out.push(vecinoGoa(cl, out.filter(n => n.clase === cl).length, sp, { agenda, ...extra }));
  const S8 = n => Array.from({ length: n }, (_, k) => k + 1);
  // nobles: pasean por la plaza alta y el paseo de los faroles
  for (const k of S8(8)) add('noble', 'g_noble' + k, AG([0, 'casa'], [8.5 + j(k, 1) * 2, ['ruta', k % 3 ? RUTAS.alta : RUTAS.faroles]], [12.5 + j(k, 2), 'casa'], [15 + j(k, 3) * 2, ['ruta', k % 2 ? RUTAS.calleAlta : RUTAS.alta]], [19.5 + j(k, 4), 'casa']));
  // Guardia Real: la Puerta Real, el palacio y la ronda
  add('guardia', 'g_guardia1', AG([0, ['calle', 33.4, 25.4, 'down']]), { arma: 'lanza' }); add('guardia', 'g_guardia2', AG([0, ['calle', 36.6, 25.4, 'down']]), { arma: 'lanza' });
  add('guardia', 'g_guardia3', AG([0, ['calle', 32.6, 10.2, 'down']]), { arma: 'alabarda' }); add('guardia', 'g_guardia4', AG([0, ['calle', 37.4, 10.2, 'down']]), { arma: 'alabarda' });
  add('guardia', 'g_guardia5', AG([0, 'casa'], [7, ['ruta', RUTAS.calleAlta]], [21, 'casa']), { arma: 'mosquete' });
  // criados: recados entre la Ciudad Alta y el mercado
  for (const k of S8(4)) { const [px, py] = PUESTOS[[1, 3, 5, 4][k - 1]]; add('criado', 'g_criado' + k, AG([0, 'casa'], [7 + j(k, 1) * 2, ['calle', px + 1.25, py + 3.6, 'up']], [10 + j(k, 2), ['ruta', RUTAS.alta]], [12, 'casa'], [16 + j(k, 3), ['calle', 30 + k * 1.6, 21.6, 'down']], [18, 'casa'])); }
  // mercaderes: cada uno en su puesto, de mañana; por la tarde, la taberna o la calle
  PUESTOS.forEach(([px, py], k) => add('mercader', ['g_mercader1', 'g_mercader5', 'g_criado4', 'g_mercader6', 'g_terminal2', 'g_mercader8', 'g_noble7', 'g_marinero3', 'g_mercader2', 'g_terminal6', 'g_mercader7'][k],
    AG([0, 'casa'], [6.5 + j(k, 1), ['calle', px + 1.25, py + 2.6, 'down']], [14 + j(k, 2) * 2, k % 2 ? ['ruta', RUTAS.molino] : ['calle', 36.2 + k * .65, 40.7, 'up']], [19 + j(k, 3), 'casa'])));
  // compradores que van de puesto en puesto
  for (const k of S8(10)) { const a = PUESTOS[k % PUESTOS.length], b = PUESTOS[(k * 5 + 2) % PUESTOS.length], sp = ['g_noble1', 'g_mercader3', 'g_marinero1', 'g_criado1', 'g_noble5', 'g_terminal5', 'g_mercader4', 'g_marinero6', 'g_noble2', 'g_terminal8'][k - 1];
    add('mercader', sp, AG([0, 'casa'], [8 + j(k, 1) * 2, ['calle', a[0] + (k % 2 ? .3 : 2.2), a[1] + 3.4, 'up']], [9.5 + j(k, 2) * 2, ['calle', b[0] + (k % 2 ? 2.2 : .3), b[1] + 3.4, 'up']], [11 + j(k, 3) * 2, ['ruta', k % 2 ? RUTAS.real : RUTAS.mercaderes]], [13.5 + j(k, 4), 'casa'], [16, ['ruta', k % 3 ? RUTAS.plaza : RUTAS.puente]], [19, 'casa']), { name: esMujer(sp) ? 'Vecina' : 'Vecino', greet: () => pick(['Buenos días.', '¿Has probado la fruta de ese puesto? Una maravilla.', 'Qué jaleo hay hoy en el mercado.']) }); }
  // el puerto: estibadores, marineros y pescadores
  for (const k of S8(6)) add('marinero', 'g_marinero' + k, AG([0, 'casa'], [6 + j(k, 1), ['ruta', k % 2 ? RUTAS.muelle1 : RUTAS.muelle2]], [13 + j(k, 2), ['calle', [12.6, 21, 29.4, 33, 47.6, 52.4][k - 1], 63.8 + (k % 2) * .4, 'down']], [14 + j(k, 3), ['ruta', k % 2 ? RUTAS.puerto : RUTAS.muelle2]], [20, k % 2 ? ['dentro', 'ballena', 4.6 + k * .65, 6.15, 'up'] : 'casa'], [23, 'casa']));
  for (const k of [1, 2]) add('marinero', 'g_terminal' + (k + 2), AG([0, 'casa'], [5.5, ['calle', k === 1 ? 23 : 53, 73.2, 'down']], [12, ['calle', 59.5 + k * 2, 58.3, 'down']], [18, 'casa']), { name: 'Pescador', greet: () => pick(['Hoy pican poco.', 'Ese muelle es mío desde las cinco. Búscate otro.']) });
  // la Terminal Gris: chatarreros que suben y bajan las montañas, el mercado de chatarra y las hogueras
  for (const k of S8(8)) add('terminal', 'g_terminal' + k, AG([0, 'casa'], [6 + j(k, 1), ['ruta', [RUTAS.montana, RUTAS.montana2, RUTAS.chatarra1, RUTAS.chatarra3][k % 4]]], [12 + j(k, 2), ['calle', 74.6 + k * 1.4, 41.4, 'up']],
    [14 + j(k, 3), ['ruta', [RUTAS.chatarra2, RUTAS.montana, RUTAS.chatarra3, RUTAS.montana2][k % 4]]], [19.5, ['calle', [92.6, 80.4, 102][k % 3] + [-1.2, 1.2, 0][Math.floor(k / 3) % 3], [38.4, 49.4, 49.4][k % 3] + [0, 0, 1][Math.floor(k / 3) % 3], ['right', 'left', 'up'][Math.floor(k / 3) % 3]]], [22.5 + j(k, 4), 'casa']));
  for (const k of [5, 6, 7]) add('terminal', 'g_terminal' + k, AG([0, 'casa'], [7, ['calle', 90 + k * 2, 31, 'down']], [11, ['ruta', RUTAS.chatarra1]], [16, ['calle', 74 + k, 51.2, 'up']], [20, ['dentro', 'cantina_lata', .9 + (k - 5) * 1.1, 4.1, 'up']], [23, 'casa']));
  // críos: corren por el mercado y por la Terminal
  for (const k of S8(4)) add('nino', 'g_nino' + k, AG([0, 'casa'], [9, ['ruta', k % 2 ? RUTAS.plaza : RUTAS.fuerte]], [13, 'casa'], [15, ['ruta', k % 2 ? RUTAS.chatarra1 : RUTAS.plaza]], [19, 'casa']), { vel: 78 });
  return out; }

// ---------- personajes con nombre ----------
const TOP_MEDUSA = { id: 'medusa', once: true, ask: 'Me manda la Medusa Gris.' };
const GENTE_GOA = () => [
  ...genteCiudad(),
  { id: 'quill', casa: 'almacen3', agenda: AG([0, ['calle', 34.4, 67.6, 'down']]), scene: 'town', at: [34.4, 67.6], sprite: 'quill', dir: 'down', name: 'Capitana Hesper Quill',
    barks: { dia: ['¡Esa carga, a la bodega! ¡Con cuidado, que es loza!'], tarde: [], noche: [] },
    greet: () => F.goaQuillAdios ? 'La Tortuga sale a la una. Si cambias de idea, a esa hora ya no estoy.' : '¿Qué? ¿Todavía aquí? La ciudad está para arriba.',
    topics: [{ id: 'goa', once: true, ask: '¿Qué me cuentas de Goa?', a: () => ['Arriba, la Ciudad Alta: piedra blanca y gente que no te mira. Para pasar la Puerta Real hay que parecer de allí.', 'En medio, la ciudad de verdad: el mercado, la taberna, la armería. Ahí es donde se vive.', 'Y al otro lado del barranco, la Terminal Gris. Chatarra, humo y gente a la que nadie quiere. Ahí está tu Ama Sel.'],
      learn: L('goa', 'Los tres barrios', 'Goa tiene tres partes: la Ciudad Alta, amurallada; la ciudad de en medio, con el mercado y el puerto; y la Terminal Gris, al otro lado del barranco, donde vive Ama Sel.') },
      { id: 'edicto', once: true, need: () => asked('quill', 'goa'), ask: '¿Por qué hay tanta gente nerviosa en el puerto?', a: () => ['Dicen que esta mañana han pegado un edicto en la Terminal. Que les dan cinco días para irse.', '(Escupe al agua.) La Ciudad Alta lleva años queriendo quitarse de encima la Terminal. Lo raro es que ahora tengan prisa.'] }] },
  { id: 'ama_sel', casa: 'taller_sel', agenda: AG([0, 'casa'], [6.5, ['calle', 92.4, 62.4, 'down']], [13, ['dentro', 'taller_sel', 2.8, 1.2, 'down']], [21, 'casa']), scene: 'town', at: [92.4, 62.4], sprite: 'ama_sel', dir: 'down', name: 'Ama Sel', arma: 'martillo',
    barks: { dia: ['¡Esa cuaderna está torcida! ¡Torcida!', '(Martillazos.)', '¡Más brea! ¡Que no se diga que un barco de Ama Sel hace agua!'], tarde: ['(Ama Sel dibuja un casco en un papel, lo tacha y vuelve a empezar.)'], noche: [] },
    greet: c => F.goaSelMedusa ? (barcoDe() ? `¿Qué tal la ${MODELOS[barcoDe().modelo].corto}? Si quieres cambiarle algo, aquí estoy.` : 'Elige con calma. Pero elige.') : F.goaSelEcha ? '¿Otra vez tú? Te he dicho que vuelvas con barba.' : c.n === 0 ? '(Ni levanta la vista de las gafas de soldar.) Si vienes a mirar, mira desde lejos. Si vienes a tocar, vete.' : '¿Sigues aquí?',
    first: L('gente', 'Ama Sel', 'La constructora de barcos de la Terminal Gris. Gafas de soldar, brazos como cabos y cero paciencia. No levanta la vista del trabajo para cualquiera.'),
    topics: [
      { id: 'barco', once: true, need: () => !F.goaSelMedusa, ask: 'Quiero un barco.', a: () => ['(Ama Sel se sube las gafas. Te mira. Mira a tu compañero. Se ríe, corto y sin ganas.)', '¿Un barco? ¿Vosotros? Volved cuando os salga barba. A los dos.', 'Un barco no es un juguete. Un barco es lo único que hay entre tú y el fondo del mar.'] },
      { id: 'insiste', once: true, need: () => asked('ama_sel', 'barco') && !F.goaSelMedusa, ask: 'Va en serio. Necesito un barco.', a: () => (F.goaSelEcha = true, later(2600, () => echarDelTaller()), ['¿En serio? Yo también voy en serio. Fuera de mi astillero.', '(Te señala la puerta con el martillo. No es una invitación.)']) },
      { ...TOP_MEDUSA, need: () => !F.goaSelMedusa, a: () => (F.goaSelMedusa = true, encargoHecho('Buscar a Ama Sel', 'La encontré en su astillero. Cuando oyó el nombre de la Medusa Gris, cambió de cara.'),
        ['(Ama Sel deja el soplete. Se quita las gafas despacio.)', '¿Quién te manda?', '(Te mira de arriba abajo. Otra vez, más despacio.)', '...Tienes su forma de plantarte. No. La de otro. Da igual.', 'Cuando ardió la Terminal, el de gris sacó a gente del fuego con sus propias manos. Y después pagó la madera para levantar media Terminal. No pidió nada.',
          'Así que escucha: tengo tres barcos en la grada o a medio hacer. Elige uno. No me debes nada. Se lo debo yo a él.']),
        learn: L('goa', 'La deuda de Ama Sel', 'Cuando ardió la Terminal Gris, la Medusa Gris sacó gente del fuego y pagó la madera para reconstruirla. Ama Sel me da un barco gratis por él.') },
      { id: 'ver', need: () => F.goaSelMedusa, ask: () => barcoDe() ? 'Quiero cambiarle algo al barco.' : 'Enséñame los barcos.', a: () => (later(200, () => abrirAstillero()), [barcoDe() ? 'Vamos a ver qué le quieres hacer a mi barco. Tu barco.' : 'Ven. Míralos bien.']) },
      { id: 'edicto', once: true, need: () => F.goaSelMedusa, ask: '¿Y el edicto?', a: () => ['(Aprieta el martillo.) Cinco días. Cinco días para irnos de donde vivimos desde siempre.', 'Si nos echan, tu barco se queda en la grada. Así que más te vale que eso no pase.', 'Nadie sabe por qué ahora. La Ciudad Alta lleva años amenazando, pero nunca con fecha.'] }] },
  { id: 'bram', casa: 'chabola6', agenda: AG([0, 'casa'], [6, ['calle', 72.9, 40.1, 'left']], [22, 'casa']), scene: 'town', at: [72.9, 40.1], sprite: 'bram', dir: 'left', name: 'Bram el Tuerto', arma: 'garrote',
    barks: { dia: ['De este lado del puente, mando yo.', '(Bram se rasca la barba con el garrote.)'], tarde: ['Cinco días... (Mira el edicto y escupe.)'], noche: [] },
    greet: c => F.goaTerminal ? pick(['Pasa, pasa. Pero sin tocar nada que no sea tuyo.', '¿Vienes a comprar? El mercado está ahí detrás.']) : c.n === 0 ? 'Alto. Forasteros, no. Hoy menos que nunca.' : 'Ya te lo he dicho: forasteros, no.',
    first: L('gente', 'Bram el Tuerto', 'Manda en el mercado de chatarra y en el puente del barranco. Un ojo, una barba roja y un garrote. No deja pasar a forasteros a la Terminal.'),
    topics: [
      { id: 'por', once: true, ask: '¿Por qué no puedo pasar?', a: () => ['Porque esta mañana han clavado un papel en ese poste que dice que en cinco días nos echan.', 'Y desde esta mañana, todo el que viene de la ciudad me huele a Guardia Real.', 'Si alguien de aquí responde por ti, pasas. Si no, no.'] },
      { ...TOP_MEDUSA, need: () => !F.goaTerminal, a: () => (abrirTerminal(), ['(El ojo bueno de Bram se abre de golpe.)', '¿El de gris? ¿El de la capucha?', '(Mira a los lados. Baja la voz.) Pasa. Y no lo digas tan alto: aquí hay gente que le debe la vida y gente que le debe dinero.']) },
      { id: 'gorriones', once: true, need: () => F.goaPina && !F.goaTerminal, ask: 'Vengo de parte de los Gorriones.', a: () => (abrirTerminal(), ['(Bram suspira como si le hubieran pedido un riñón.)', 'Pina. Siempre Pina. Pasa, anda. Si rompes algo, lo paga ella.']) },
      { id: 'tienda', need: () => F.goaTerminal, ask: '¿Qué vendes?', tienda: 'bram' }] },
  { id: 'coque', casa: 'chabola1', agenda: AG([0, 'casa'], [6.5, ['calle', 84.2, 46.5, 'up']], [20.5, 'casa']), scene: 'town', at: [84.2, 46.5], sprite: 'coque', dir: 'up', name: 'Abuela Coque',
    barks: { dia: ['(La Abuela Coque enciende una vela con otra.)', 'Cuarenta y tres nombres. Me los sé todos.'], tarde: ['(Tararea algo antiguo.)'], noche: [] },
    greet: c => c.n === 0 ? 'Acércate, que no muerdo. ¿Vienes a ver el Memorial o te has perdido?' : 'Siéntate un rato, si quieres.',
    first: L('gente', 'Abuela Coque', 'Cuida el Memorial del Fuego, en el centro de la Terminal. Se sabe de memoria los nombres de los que murieron en el incendio.'),
    topics: [
      { id: 'memorial', once: true, ask: '¿Qué es esto?', a: () => ['El mástil de un barco que ardió en el puerto la noche del gran incendio. Lo plantamos aquí cuando se apagó todo.', 'Cada cinta es un nombre. Cuarenta y tres. Mi hijo es la azul.', '(Se queda callada un rato.)', 'La Ciudad Alta dijo que fue un accidente. Aquí nadie se lo cree.'],
        learn: L('goa', 'El Memorial del Fuego', 'Hace años ardió la Terminal Gris: cuarenta y tres muertos. La Ciudad Alta dijo que fue un accidente; en la Terminal nadie se lo cree. La Abuela Coque cuida el mástil quemado que los recuerda.') },
      { id: 'edicto', once: true, need: () => asked('coque', 'memorial'), ask: '¿Os vais a ir?', a: () => ['¿Irnos? ¿Adónde? (Señala el mástil.) Ellos se quedaron. Nosotros también.', 'Pero esta vez es distinto, niño. Antes nos amenazaban. Ahora hay fecha. Cuando hay fecha, es que alguien ha pagado.'] },
      { ...TOP_MEDUSA, a: () => ['(Sonríe con todos los dientes que le quedan.)', 'El de gris. Me sacó de ahí dentro a hombros, con el pelo ardiendo. A mí y a otros cuatro.', 'Si vienes de su parte, en esta Terminal tienes casa.'] }] },
  { id: 'pina', casa: 'chabola4', agenda: AG([0, 'casa'], [8, ['calle', 34.6, 44.8, 'down']], [13, ['ruta', RUTAS.fuerte]], [16, ['calle', 34.6, 44.8, 'down']], [19.5, 'casa']), scene: 'town', at: [34.6, 44.8], sprite: 'pina', dir: 'down', name: 'Pina', vel: 80,
    barks: { dia: ['(Pina te mira la bolsa. Luego te mira a ti. Luego otra vez la bolsa.)', '¡Lucho, Totó, al fuerte!'], tarde: [], noche: [] },
    greet: c => c.n === 0 ? '¿Qué miras? No he robado nada. Todavía.' : F.goaPina ? 'Ya te lo he dicho: «de parte de los Gorriones». Bram refunfuña, pero pasa.' : '¿Otra vez tú?',
    first: L('gente', 'Pina', 'Una cría de la Terminal con una cinta amarilla en la cabeza. Manda en una pandilla de críos, los Gorriones. Tiene los dedos muy rápidos.'),
    topics: [
      { id: 'quien', once: true, ask: '¿Quién eres?', a: () => ['Pina. Jefa de los Gorriones. Lucho y Totó son mis tenientes.', 'Vivimos en la Terminal. Bajamos al mercado a... comprar.', '(Se le escapa una manzana de la manga. La recoge sin pestañear.)'] },
      { id: 'pasar', once: true, need: () => !F.goaTerminal, ask: 'Necesito pasar a la Terminal y Bram no me deja.', a: () => (F.goaPina = true, ['¿Bram? Bram ladra mucho y no muerde nunca.', 'Dile que vienes de parte de los Gorriones. Le dará rabia, pero te dejará pasar. Siempre le da rabia.', 'A cambio, me debes una. Ya te diré cuál.']),
        learn: L('goa', 'Los Gorriones', 'Pina, la jefa de una pandilla de críos de la Terminal, me ha dicho que le diga a Bram que voy de parte de los Gorriones.') },
      { id: 'edicto', once: true, need: () => asked('pina', 'quien'), ask: '¿Sabes algo del edicto?', a: () => ['Sé que anoche había un barco negro sin bandera fondeado detrás del cabo. Sin luces.', 'Y sé que esta mañana el edicto ya estaba clavado. Antes de que nadie se levantara.', 'Tú sabrás si eso tiene que ver. Yo solo digo lo que veo.'],
        learn: L('goa', 'El barco negro', 'Según Pina, la noche antes del edicto fondeó detrás del cabo un barco negro, sin bandera y sin luces.') }] },
  { id: 'lucho', casa: 'chabola4', agenda: AG([0, 'casa'], [8.5, ['ruta', RUTAS.fuerte]], [12, ['ruta', RUTAS.plaza]], [17, ['ruta', RUTAS.fuerte]], [19.5, 'casa']), scene: 'town', at: [104, 44], sprite: 'lucho', dir: 'down', name: 'Lucho', vel: 84,
    barks: { dia: ['¡Pina, espérame!', '¡El último es un percebe!'], tarde: [], noche: [] }, greet: () => 'Yo no sé nada. Pregúntale a Pina.' },
  { id: 'toto', casa: 'chabola4', agenda: AG([0, 'casa'], [8.5, ['ruta', RUTAS.chatarra1]], [12, ['ruta', RUTAS.fuerte]], [19.5, 'casa']), scene: 'town', at: [80, 29.6], sprite: 'toto', dir: 'down', name: 'Totó', vel: 74,
    barks: { dia: ['(Totó se suena con la manga.)', '¿Has visto mi tornillo? Era mi favorito.'], tarde: [], noche: [] }, greet: () => '...(Totó se esconde detrás de una chapa.)' },
  { id: 'mola', casa: 'chabola8', agenda: AG([0, 'casa'], [8, ['dentro', 'cantina_lata', 6.4, 2.6, 'left']], [14, ['calle', 100.5, 55.4, 'down']], [20, ['dentro', 'cantina_lata', 6.3, 3, 'left']], [23, 'casa']), scene: 'town', at: [100.5, 55.4], sprite: 'mola', dir: 'down', name: 'Mola',
    barks: { dia: ['(Mola levanta un yunque. Lo deja. Lo vuelve a levantar.)'], tarde: ['¿Alguien? ¿Nadie? Cobardes.'], noche: [] },
    greet: c => c.n === 0 ? '¿Vienes a pelear o a mirarme los brazos?' : 'Cuando quieras.',
    first: L('gente', 'Mola', 'La campeona de la Fosa de Chatarra. Nadie le ha ganado en tres temporadas. Por las tardes espera en la fosa a que alguien se atreva.'),
    topics: [{ id: 'fosa', once: true, ask: '¿Qué es la Fosa?', a: () => ['Un agujero con arena, cuatro postes y una cuerda. Se pelea hasta que uno no se levanta.', 'Los de la ciudad bajan a apostar. Los de aquí bajamos a pelear.', 'Hoy no hay combate. Con el edicto, nadie tiene ganas de apostar.'] }] },
  { id: 'ferro', casa: 'armeria_goa', agenda: AG([0, 'casa'], [8, ['dentro', 'armeria_goa', 4.5, 3.4, 'down']], [20, 'casa']), scene: 'armeria_goa', at: [4.5, 3.4], sprite: 'ferro', dir: 'down', name: 'Dagoberto Ferro',
    barks: { dia: ['(Ferro pasa una piedra de afilar por una hoja, sin prisa.)'], tarde: [], noche: [] },
    greet: c => c.n === 0 ? 'Dagoberto Ferro. Tres generaciones vendiendo hierro en Goa. ¿Qué buscas?' : '¿Qué buscas hoy?',
    first: L('gente', 'Dagoberto Ferro', 'El armero de Goa. Bigote de morsa, manos llenas de cicatrices. Vende cada arma en tres calidades: tosca, corriente y fina.'),
    topics: [{ id: 'tienda', ask: 'Enséñame las armas.', tienda: 'armeria' },
      { id: 'calidad', once: true, ask: '¿Qué diferencia hay entre una tosca y una fina?', a: () => ['La tosca es acero malo, con óxido. Corta, pero se mella y pesa donde no debe.', 'La corriente es lo normal. La fina está templada dos veces y pulida. Pega más fuerte y no te deja tirado.', 'Y las de la vitrina tienen nombre y grado. Esas son otra cosa: esas eligen a su dueño.'] }] },
  { id: 'lis', casa: 'sastreria', agenda: AG([0, 'casa'], [9, ['dentro', 'sastreria', 2.5, 3.1, 'down']], [19, 'casa']), scene: 'sastreria', at: [2.5, 3.1], sprite: 'lis', dir: 'down', name: 'Madame Lis',
    barks: { dia: ['(Madame Lis toma medidas al aire, a nadie en concreto.)'], tarde: [], noche: [] },
    greet: c => c.n === 0 ? '(Te mira de los pies a la cabeza y suspira.) Ay, ay, ay. Pasa, pasa. Esto tiene arreglo.' : 'Bienvenido otra vez. ¿Seguimos con lo nuestro?',
    first: L('gente', 'Madame Lis', 'La sastra de La Aguja de Oro, en la Calle de los Mercaderes. Viste a la Ciudad Alta y a quien pueda pagarlo.'),
    topics: [{ id: 'tienda', ask: 'Quiero ver ropa.', tienda: 'sastreria' },
      { id: 'puerta', once: true, ask: '¿Qué hace falta para pasar la Puerta Real?', a: () => ['Parecer de allí, cariño. La Guardia no mira la cara: mira la ropa.', 'Una levita, un corsé o una buena chaqueta. Pantalón de vestir. Zapatos, nada de sandalias. Un sombrero fino ayuda.', 'Con eso, te abren la puerta y te dan los buenos días.'],
        learn: L('goa', 'La Puerta Real', 'Para pasar la Puerta Real hay que vestir como la Ciudad Alta: la Guardia mira la ropa, no la cara. Madame Lis vende de eso.') }] },
  { id: 'fina', casa: 'ballena', agenda: AG([0, 'casa'], [10, ['dentro', 'ballena', 2, 3.1, 'down']], [24, 'casa']), scene: 'ballena', at: [2, 3.1], sprite: 'fina', dir: 'down', name: 'Fina Roble',
    barks: { dia: ['¡Ese vaso no se friega solo!'], tarde: ['¡Otra ronda para la mesa del fondo!', '(Fina se ríe de algo que dice un marinero.)'], noche: ['Última ronda. Y lo digo en serio.'] },
    greet: c => c.n === 0 ? 'Bienvenido a La Ballena Varada. Si buscas pelea, la puerta. Si buscas guiso, la barra.' : '¿Lo de siempre?',
    first: L('gente', 'Fina Roble', 'La dueña de la taberna La Ballena Varada. Pelirroja, rápida, se entera de todo lo que pasa en Goa sin salir de detrás de la barra.'),
    topics: [{ id: 'tienda', ask: '¿Qué hay de comer?', tienda: 'ballena' },
      { id: 'rumor', once: true, ask: '¿Se sabe algo del edicto?', a: () => ['(Baja la voz y se apoya en la barra.)', 'Lo que se sabe es que la costa de la Terminal la administra el marqués de Albamar. Y que el marqués anda gastando como si le fuera a llover dinero.', 'Lo que no se sabe es de dónde le va a llover.', 'Si quieres saber más, vuelve otro día. Por aquí pasa mucha gente con la lengua suelta.'],
        learn: L('goa', 'El marqués de Albamar', 'Según Fina, la costa de la Terminal la administra el marqués Teodoro de Albamar, que gasta últimamente como si esperara mucho dinero.') }] },
  { id: 'isolda', casa: 'cartografa', agenda: AG([0, 'casa'], [9, ['dentro', 'cartografa', 3.4, 1.4, 'down']], [18, 'casa']), scene: 'cartografa', at: [3.4, 1.4], sprite: 'isolda', dir: 'down', name: 'Isolda Mapp',
    barks: { dia: ['(Isolda moja la pluma, traza una línea finísima y contiene la respiración.)'], tarde: [], noche: [] },
    greet: () => 'No toques la tinta. Ni los mapas. Ni la mesa. ¿Qué quieres?',
    first: L('gente', 'Isolda Mapp', 'Cartógrafa de Goa. Sus cartas del East Blue son las mejores de la ciudad. Odia que le toquen la mesa.'),
    topics: [{ id: 'tienda', ask: '¿Vendes cartas?', tienda: 'cartografa' },
      { id: 'kale', once: true, ask: '¿Conoces una isla llamada Kalé?', a: () => ['(Deja la pluma.) ¿Kalé? No. Y conozco todas las islas del East Blue.', '(Saca una carta grande y la recorre con el dedo.) No. No existe. Te la habrán contado en una taberna.', '...Aunque es raro. Hay un trozo de mar, al este de Shells Town, que las cartas antiguas dejan en blanco. Siempre lo he tomado por un error del grabador.'],
        learn: L('goa', 'Kalé no está en las cartas', 'Isolda Mapp no conoce Kalé. Pero dice que hay un trozo de mar, al este de Shells Town, que las cartas antiguas dejan en blanco.') }] },
  { id: 'teo', casa: 'veleria', agenda: AG([0, 'casa'], [7, ['dentro', 'veleria', 3.2, 2.2, 'down']], [18, ['calle', 50.6, 49.8, 'down']], [20, 'casa']), scene: 'veleria', at: [3.2, 2.2], sprite: 'teo', dir: 'down', name: 'Maese Teo Lona',
    barks: { dia: ['(Teo cose una vela con una aguja del tamaño de un dedo.)'], tarde: ['El viento de hoy es de los buenos.'], noche: [] },
    greet: () => 'Buenas. ¿Lona, cuerda o conversación? Lo último es gratis.',
    first: L('gente', 'Maese Teo Lona', 'El velero de Goa. Cose las velas de medio East Blue y las de Ama Sel. Habla del viento como de un viejo amigo.'),
    topics: [{ id: 'tienda', ask: '¿Qué vendes?', tienda: 'veleria' },
      { id: 'sel', once: true, ask: '¿Conoces a Ama Sel?', a: () => ['¿A Sel? Le coso las velas desde hace veinte años. Ella me grita, yo le cobro de más. Así funciona.', 'Es la mejor constructora del East Blue y vive en un sitio que la Ciudad Alta quiere borrar del mapa. Así va el mundo.'] }] },
  { id: 'marques', casa: 'mansion', agenda: AG([0, 'casa'], [9, ['dentro', 'mansion', 4.3, 2, 'left']], [17, ['calle', 9.6, 15, 'right']], [18.5, ['dentro', 'mansion', 8, 3, 'down']], [22, 'casa']), scene: 'mansion', at: [4.3, 2], sprite: 'marques', dir: 'down', name: 'Marqués Teodoro de Albamar',
    barks: { dia: ['(El marqués se mira en el reflejo de la fuente y se atusa el bigote.)'], tarde: ['Las rosas de la izquierda están mustias. ¿Quién ha regado las rosas de la izquierda?'], noche: [] },
    greet: () => '¿Quién le ha dejado pasar? (No espera la respuesta.) Da igual. Váyase.' },
  { id: 'duval', casa: 'guardia_real', agenda: AG([0, 'casa'], [7, ['dentro', 'guardia_real', 6.8, 3.1, 'down']], [9.5, ['calle', 36.4, 26.8, 'left']], [12, ['dentro', 'guardia_real', 6.8, 3.1, 'down']], [16, ['ruta', RUTAS.calleAlta]], [19, 'casa']), scene: 'town', at: [36.4, 26.8], sprite: 'duval', dir: 'left', name: 'Capitana Irene Duval', arma: 'sable',
    barks: { dia: ['(La capitana Duval lee el edicto que lleva en la mano. Otra vez.)'], tarde: [], noche: [] },
    greet: c => c.n === 0 ? 'Irene Duval, capitana de la Guardia Real. Si tienes algo que decir, dilo rápido. Si no, circula.' : '¿Otra vez tú?',
    first: L('gente', 'Capitana Irene Duval', 'Jefa de la Guardia Real de Goa. Seria, cansada, con una copia del edicto en la mano que lee como si no terminara de creérsela.'),
    topics: [{ id: 'edicto', once: true, ask: '¿Va a echar a la gente de la Terminal?', a: () => ['Voy a cumplir las órdenes. Para eso me pagan.', '(Mira el papel.) La orden lleva el sello del Consejo y la firma del marqués de Albamar, que administra esa costa. Es legal.', '...Legal no siempre quiere decir justo. Pero eso no lo has oído de mí.'] }] },
  // dependientes de las demás tiendas
  ...[['boticaria', 'botica', [2.5, 1.1], 'g_mercader4', 'Boticaria', 'botica', 'Para lo que duele y para lo que va a doler.'], ['panadera', 'panaderia_goa', [2.5, 1.1], 'g_mercader2', 'Panadera', 'panaderia_goa', '¡Pan del molino de la esquina!'],
    ['prestamista', 'empeno', [3, 1.3], 'g_mercader7', 'Prestamista', 'empeno', 'Todo tiene un precio. Hasta lo que no vale nada.'], ['joyera', 'joyeria', [2.5, 1.1], 'g_noble6', 'Joyera', 'joyeria', '(Te mira los zapatos antes que la cara.) ¿Sí?'],
    ['perfumista', 'perfumeria', [2.5, 1.1], 'g_noble8', 'Perfumista', 'perfumeria', 'Bienvenido. Huele, huele sin miedo.'], ['frutera', 'mercado', [1.9, 1.3], 'g_mercader3', 'Frutera', 'mercado_goa', '¡Fruta, pan y guiso! ¡Todo fresco!'],
    ['posadero', 'posada_goa', [2.6, 3.2], 'g_mercader6', 'Posadero', 'ballena', 'Camas limpias y guiso caliente. Lo uno no quita lo otro.'], ['pescadera', 'lonja', [1.9, 1.3], 'g_marinero5', 'Pescadera', 'mercado_goa', '¡Pescado de la bahía!'],
    ['herrero', 'herreria', [3.5, 2.2], 'g_marinero4', 'Herrero', null, '(Martillazos.) ¡Ahora no! ¡Ahora sí! ¿Qué quieres?'], ['archivero', 'archivo', [2.3, 2], 'g_criado3', 'Archivero real', null, 'El Archivo Real solo atiende con cita. ¿Tiene cita? No tiene cita.']]
    .map(([id, b, at, sprite, name, tienda, hola]) => ({ id, casa: b, agenda: AG([0, 'casa'], [8, ['dentro', b, ...at, 'down']], [20, 'casa']), scene: b, at, sprite, dir: 'down', name, barks: { dia: [], tarde: [], noche: [] }, greet: () => hola, topics: tienda ? [{ id: 'tienda', ask: '¿Qué vendes?', tienda }] : [] })),
  ...(F.stCompa ? [compaGoa()] : []),
];
// tu compañero: te sigue y opina de lo que ve
function compaGoa() { const id = F.stCompa, c = COMPA[id];
  const DICE = { rufo: { ciudad: ['¿Has olido el mercado? Ahí hay especias que no había visto en mi vida.', 'Si me dejan una cocina un día aquí, hago historia.'], terminal: ['Esta gente come lo que encuentra. Y aun así huele a guiso desde cada chabola.'], alta: ['Aquí arriba todo huele a jabón. No me fío de un sitio que no huele a comida.'] },
    nerea: { ciudad: ['La corriente de la bahía entra por el este y sale pegada al cabo. Bonito puerto. Traicionero, pero bonito.'], terminal: ['Desde la grada, el agua es profunda enseguida. Buen sitio para botar un barco.'], alta: ['Mira cómo nos miran. Como si fuéramos una mancha en el suelo.'] },
    niklas: { ciudad: ['La Guardia Real no es la Marina, pero se mueve igual. Dos en la puerta, uno de ronda, uno que mira desde la muralla.'], terminal: ['Aquí la gente se defiende sola. Me cae bien.'], alta: ['Guardias con alabarda. Más para lucir que para pelear.'] } }[id];
  return { id, scene: 'town', at: [36, 68.2], sprite: SPRITE_COMPA[id], dir: 'up', name: c.nc, quieto: true, barks: { dia: [], tarde: [], noche: [] },
    greet: () => { const zona = G.x > 70 * T ? 'terminal' : G.y < 24 * T ? 'alta' : 'ciudad'; return pick(DICE[zona]); },
    topics: [{ id: 'espera', need: () => F.goaSigue !== false, ask: 'Espérame aquí.', a: () => (F.goaSigue = false, P(id).quieto = true, ['Vale. Aquí estaré. No tardes.']) },
      { id: 'vamos', need: () => F.goaSigue === false, ask: 'Vámonos.', a: () => (F.goaSigue = true, ['¡Por fin!']) },
      { id: 'plan', once: true, ask: '¿Qué hacemos ahora?', a: () => [F.goaSelMedusa ? 'Ya tenemos barco, o casi. Ahora hay que conseguir que no echen a esa gente antes de que lo terminen.' : 'Lo que dijo la Medusa: encontrar a Ama Sel, en la Terminal Gris. Al otro lado del barranco, por el puente.'] }] }; }

// ---------- cosas que se miran y se tocan ----------
const OBJETOS_GOA = () => [
  { scene: 'town', at: [74.6, 41.8], label: 'Leer el edicto', act: () => { narr(['EDICTO REAL', '«Por orden de Su Majestad y del Consejo de la Ciudad Alta: la costa conocida como Terminal Gris, desde el barranco hasta el cabo del este, queda reservada para uso de la Corona.»',
    `«Sus ocupantes deberán abandonarla en el plazo de cinco días. Pasado ese plazo, la Guardia Real procederá al desalojo.»`, '«Por el Consejo, el marqués Teodoro de Albamar, administrador de la costa.»', `(Alguien ha escrito debajo, con carbón: «${quedan()} días». La cifra está tachada y vuelta a escribir.)`]);
    learn(['goa', 'El edicto', 'En la entrada de la Terminal hay un edicto clavado: en cinco días, la Terminal Gris debe quedar vacía. Lo firma el marqués Teodoro de Albamar, «administrador de la costa». Nadie sabe por qué ahora.']); } },
  { scene: 'town', at: [37.4, 30.6], label: 'Leer el tablón', act: () => narr(['«Se busca grumete con experiencia. Preguntar por el Albatros Rojo, muelle tercero.»', '«Fiesta en la mansión del marqués de Albamar, el cuarto día de la luna nueva. Solo con invitación.»', '«Se ha perdido un gato naranja. Responde a "Capitán". No responde a nada más.»']) },
  { scene: 'town', at: [35, 13.4], label: 'Mirar la estatua', act: () => narr(['Un rey de mármol con corona de oro, un cetro y cara de no haberse reído nunca.', 'En la placa: «A Su Majestad, protector de Goa. El reino más limpio del East Blue».', '(Alguien ha rayado «limpio» con una piedra.)']) },
  { scene: 'town', at: [84.2, 47], label: 'Mirar el Memorial', act: () => narr(['El mástil quemado de un barco, plantado en el suelo. De la verga cuelgan cintas de colores, y al pie arden velas.', 'En una tabla, con letra cuidada, cuarenta y tres nombres.']) },
  { scene: 'town', at: [104.6, 7.2], label: 'Leer el cartel', act: () => narr(['Hacia el este: «Villa Foosha». Hacia el norte: «Monte Colubo · Peligro: bandidos».', '(Más adelante habrá motivo para ir. Hoy, no.)']) },
  { scene: 'town', at: [35, 10.6], label: 'Llamar al palacio', act: () => bubble(P('guardia_3') || { x: 32.6 * T, y: 10.2 * T, scene: 'town' }, 'El palacio no recibe. Ni hoy ni nunca.', 2200) },
  { scene: 'town', at: [94, 62.4], label: 'Mirar la grada', act: () => narr(barcoDe() ? [`La ${MODELOS[barcoDe().modelo].n}${barcoDe().nombre ? ', «' + barcoDe().nombre + '»' : ''}, en la grada. ${progresoBarco() >= 2 ? 'Terminada: palos, velas y jarcia.' : 'El casco ya está; mañana suben los palos y las velas.'}`]
    : ['Una grada de madera que baja hasta el agua. Encima, las cuadernas de un barco a medio hacer, como las costillas de una ballena.']) },
];

// ---------- llegada: la Tortuga entra en el puerto ----------
async function llegadaGoa() { G.paused = true; F.navegando = false; await irAIsla('goa');
  const d0 = Math.floor(G.minutes / 1440) + 3; G.minutes = d0 * 1440 + 9 * 60; F.goaD0 = d0; F.goaLlegada = true; F.goaSigue = true; S.isla = 'goa';
  vecinosTick(true); const q = P('quill'), c = F.stCompa && P(F.stCompa); enter('town', tPx(35, 68.4), 'up'); if (c) moveNpc(c, 'town', [36.2, 68.6], 'up'); if (q) q.dir = 'up';
  cineOn(); G.foco = tPx(35, 64); await esperar(700);
  await camara(tPx(92, 24), 2600); if (c) bubble(c, '¿Eso es humo? ¿Está ardiendo algo?', 2200); await esperar(1600);
  await camara(tPx(35, 12), 2600); await esperar(1300); await camara(tPx(35, 66), 1800); cineOff();
  say(q, { lines: ['Goa. Arriba, la Ciudad Alta. Abajo, el puerto. Y lo que humea al otro lado del barranco es la Terminal Gris.', 'La Tortuga sale a la una para Orange Town. Hasta aquí os traje.', '(Te estrecha la mano. Aprieta fuerte.) Fregasteis la cubierta peor que nadie que haya llevado. Pero sin quejaros. Eso cuenta.'],
    opts: [{ t: 'Gracias por traernos.', then: () => adiosQuill('No hay de qué. Bueno, sí: tres días de cubierta. Estamos en paz.') }, { t: '¿Qué sabes de la Terminal Gris?', then: () => adiosQuill('Que la Guardia no entra ni a recoger la basura. Y que esta mañana alguien ha pegado un edicto en la entrada. Cuidado con dónde os metéis.') }] }); }
async function adiosQuill(linea) { const q = P('quill'); await dialogo(q, [linea, 'Buena suerte con lo vuestro. Y si alguna vez tenéis barco con bandera, no abordéis a una mercante vieja. Me ofendería.']);
  F.goaQuillAdios = true; encargo('Buscar a Ama Sel', 'La Medusa Gris me dijo que en Goa buscara a Ama Sel, en la Terminal Gris, de su parte. La Terminal está al otro lado del barranco, por el puente.');
  learn(['goa', 'Llegada a Goa', 'Llegamos a Goa en la Tortuga Parda. La ciudad sube del puerto a la Ciudad Alta, amurallada. Al otro lado de un barranco humea la Terminal Gris.']);
  const c = F.stCompa && P(F.stCompa); if (c) { c.dir = dirTo(c, G); await globo(c, { rufo: '¿Has olido eso? ¡Pan recién hecho! ¡Y especias! ¡Y... chatarra quemada!', nerea: 'Buen puerto. Mal sitio para tener prisa.', niklas: 'Guardia en la muralla. Cuatro, cinco... Esta ciudad tiene miedo de algo.' }[F.stCompa], 2600); }
  guardarAuto(); }

// ---------- reglas de la ciudad ----------
function abrirTerminal() { F.goaTerminal = true; const b = P('bram'); if (b) { b.lugar = null; b.agenda = AG([0, 'casa'], [6, ['calle', 73.2, 41.4, 'up']], [22, 'casa']); } learn(['goa', 'La Terminal Gris', 'Bram me deja pasar a la Terminal Gris. Al otro lado del puente: chatarra, humo, chabolas sobre pilotes y gente que no quiere irse.']); guardarAuto(); }
function echarDelTaller() { const s = P('ama_sel'); if (G.scene.startsWith('taller_sel')) { fade(() => { enter('town', tPx(88.5, 60.2), 'down'); }); }
  else { G.y += 40; } if (s) bubble(s, '¡Y no vuelvas sin barba!', 2000); }
function goaBloquea(d) { const to = String(d.to);
  if (to.startsWith('mansion:')) return 'Un criado de librea entreabre la puerta: «La casa del marqués no recibe visitas.» Y la cierra.';
  if (to.startsWith('guardia_real:')) return 'Un guardia te corta el paso: «Cuartel de la Guardia Real. Si no llevas uniforme, no entras.»';
  return null; }
function goaObjetivo() { const at = id => { const n = P(id); return n && n.scene !== 'none' ? { scene: n.scene, x: n.x, y: n.y } : null; };
  if (!F.goaSelMedusa) return F.goaTerminal ? at('ama_sel') || { scene: 'town', x: 92 * T, y: 61 * T } : F.goaPina || asked('bram', 'por') ? at('bram') : { scene: 'town', x: 68 * T, y: 40 * T };
  if (!barcoDe()) return at('ama_sel'); return null; }
function goaInit() { goaSinAnim(); for (const n of PEOPLE) { n.lugar = null; n.dentroDe = null; } if (F.goaQuillFuera) { const q = P('quill'); if (q) q.scene = 'none'; }
  WORLD.sprites.push({ ...barcoSprite('mercante', 36.8 * T, 74.2 * T, 10 * T), id: 'tortuga_goa', visible: () => !F.goaQuillFuera });
  vecinosTick(true); }
function goaRestaurar() { for (const n of PEOPLE) n.lugar = null; vecinosTick(true); }
let lastG = 0;
function goaTick(now) { if (G.lapse) return;
  const tg = WORLD.sprites.find(s => s.id === 'tortuga_goa'); if (F.goaZarpa && tg) { tg.x0 = tg.x0 ?? tg.x; tg.x = tg.x0 + Math.min(1, (now - F.goaZarpa) / 12000) ** 1.6 * 900; if (now - F.goaZarpa > 12000) { F.goaQuillFuera = true; F.goaZarpa = 0; } }
  if (now - lastG < 300) return; lastG = now; const h = hourNow();
  vecinosTick(false);
  // la Tortuga se va a la una
  if (!F.goaQuillFuera && !F.goaZarpa && (diaG() > 0 || h >= 13)) { const q = P('quill'); if (q) q.scene = 'none'; F.goaZarpa = G.scene === 'town' ? now : 0; if (!F.goaZarpa) F.goaQuillFuera = true; }
  // el herrero da martillazos y Ama Sel también
  for (const id of ['herrero', 'ama_sel']) { const n = P(id); if (n && n.scene === G.scene && !n.goal && !(n.camino && n.camino.length) && Math.random() < .45 && Math.hypot(n.x - G.x, n.y - G.y) < 500) { act(n, 'slash', { fps: 12 }); if (Math.random() < .5) sfx('golpe'); } }
  if (CINE.on || G.paused || G.talking) return;
  // la Puerta Real: la Guardia mira la ropa, no la cara
  if (G.scene === 'town' && G.x > 33.6 * T && G.x < 36.4 * T && G.y < 24.9 * T && G.y > 23.2 * T && G.dir === 'up') {
    const gd = P('guardia_1') || P('guardia_0'); if (vaElegante() || F.goaPase) { if (!F.goaPasoAlta) { F.goaPasoAlta = true; if (gd) bubble(gd, 'Adelante. Buenos días.', 1800); learn(['goa', 'La Ciudad Alta', 'Con ropa fina, la Guardia de la Puerta Real me abre paso sin preguntar.']); } }
    else { G.y = 25.8 * T; if (gd) { gd.dir = dirTo(gd, G); bubble(gd, pick(['Alto. La Ciudad Alta no es para cualquiera.', 'Con esa ropa no pasas. Vuelve cuando parezcas de aquí arriba.', '¿Adónde crees que vas?']), 2200); } F.goaPuertaVista = true; } }
  // el puente del barranco: Bram no deja pasar forasteros
  if (!F.goaTerminal && G.scene === 'town' && G.x > 71.2 * T && G.y > 38.6 * T && G.y < 41.6 * T) { G.x = 70.4 * T; const b = P('bram'); if (b) { b.dir = 'left'; bubble(b, pick(['Alto. Forasteros, no.', 'Ni un paso más. Hoy no.', 'Que no. Que te des la vuelta.']), 2000); } }
  // el compañero te sigue de escena en escena
  const c = F.stCompa && F.goaSigue !== false && P(F.stCompa);
  if (c) { c.quieto = true; if (c.scene !== G.scene) { c.scene = G.scene; c.x = G.x - 24; c.y = G.y + 2; } else if (Math.hypot(c.x - G.x, c.y - G.y) > 52) c.goal = { x: G.x - (G.dir === 'left' ? -26 : 26), y: G.y + 4, speed: G.run ? 190 : 130 }; }
  // a veces, dos vecinos se paran a charlar
  if (Math.random() < .08) charlaGoa(); }
const CHARLAS = [['¿Te has enterado de lo del edicto?', 'Cinco días. Pobre gente.'], ['Dicen que el marqués da una fiesta.', 'El marqués siempre da una fiesta.'], ['¿Has visto el barco de la Marina?', '¿Qué barco? Yo no he visto nada.'], ['El pan ha subido otra vez.', 'Todo sube menos mi paga.'],
  ['Mi primo dice que en la Terminal tienen armas.', 'Tu primo dice muchas cosas.'], ['¿Vas al mercado?', 'Voy a ver. Comprar ya es otra cosa.']];
function charlaGoa() { const cerca = PEOPLE.filter(n => n.scene === 'town' && n.clase && n.clase !== 'guardia' && !n.quieto && Math.hypot(n.x - G.x, n.y - G.y) < 360); if (cerca.length < 2) return;
  const a = pick(cerca), b = cerca.filter(n => n !== a).sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y))[0]; if (Math.hypot(a.x - b.x, a.y - b.y) > 90) return;
  const [l1, l2] = pick(CHARLAS); a.dir = dirTo(a, b); b.dir = dirTo(b, a); bubble(a, l1, 2000); later(2100, () => bubble(b, l2, 2000)); }

// ---------- dibujo ----------
function goaDibujar(g, [cx, cy], now) { typeof animales === 'function' && animales(g, cx, cy, now); }
function goaEncima(g, cam, now, VW, VH) { goaVida(g, cam, now, VW, VH); goaPalomas(g, cam, now); goaLuces(g, cam, now, VW, VH); }
