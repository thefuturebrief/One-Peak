# Registro de decisiones

Fuente de verdad del diseño mientras planificamos. Cada punto está en una de tres listas: **decidido**, **en discusión** o **descartado**. Si algo cambia, se mueve de lista; no se borra.

## Visión

Un juego para un solo jugador ambientado en el mundo de One Piece. Gráficos simples, sistemas profundos y un mundo que se mueve aunque el jugador no haga nada. Empezás siendo nadie y construís tu propia historia a partir de las oportunidades que el mundo te ofrece.

La fidelidad es al **mundo** (sus reglas, sus dinámicas y su construcción), no a la trama.

---

## Decidido

### Marco general
- Un solo jugador y sin conexión. Nada de online por ahora.
- Destino: primero lo juega el autor durante un mes y lo vamos ajustando. Más adelante, quizás publicarlo gratis. Sin monetización.
- Identidad visual propia. Nada que parezca una plantilla genérica: tipografía, paneles y HUD diseñados para este juego.
- Trabajo en conjunto: los dos proponemos ideas y las discutimos. Se planifica a fondo antes de escribir código.

### Formato
- **Base permanente: formato B.** Juego visual en 2D cenital, caminando la isla con control directo.
- **Momentos puntuales: formato A.** Los eventos, las decisiones importantes y los momentos dramáticos se presentan como página de manga con opciones.
- Referencias de las maquetas: `docs/maquetas/maquetas-puerto.html`.

### Tiempo
- **Tiempo elástico.** En tierra corre a un ritmo natural (referencia: 24 h de juego ≈ 30 min reales), con pausa y control de velocidad.
- **El viaje en barco se acelera.** Se ve una animación del barco navegando y podés dejarlo a velocidad normal o adelantarlo hasta que pase algo o hasta llegar.
- Durante el viaje pueden pasar cosas: corrientes que te desvían, barcos enemigos (pelear o huir), tormentas, etc.

### Mundo y simulación
- **Simulación en dos niveles.** La isla donde estás se simula en detalle (personas con rutinas, relaciones y necesidades). El resto del mundo se simula de forma abstracta: facciones, poder, territorios y eventos.
- Te enterás de lo que pasa lejos por el diario de los News Coo, los rumores y los carteles de recompensa.
- **Época de inicio: 22 años después de la ejecución de Roger,** en plena Gran Era Pirata.

### Nueva generación: personajes canon
- **El mundo es canon hasta la ejecución de Roger:** instituciones, geografía, reglas, el One Piece como tesoro, el Siglo Vacío. Las figuras históricas se mencionan por nombre, solo en texto, y nunca aparecen en pantalla.
- **Todos los personajes vivos son originales,** incluidos los grandes puestos: Emperadores, almirantes, Shichibukai, Gorosei, etc. Los importantes se diseñan en conjunto con el estilo de One Piece y el resto lo genera el juego.
- Ventajas: libertad total para la simulación, sin canon que se rompa ni spoilers, y el jugador puede llegar a ocupar esos puestos de forma creíble.

### Mapa y conocimiento
- El mapa no se tiene desde el inicio: **se encuentra y se va completando** con lo que descubrís viajando y lo que la gente te cuenta o te muestra.
- Dos preguntas separadas: **dónde está** una isla y **cómo llegar**. Log Pose, Eternal Pose y rutas.
- Las islas con acceso especial (Skypiea, Isla Gyojin, Zou…) tienen un método que se descubre jugando.
- **Todo es conocimiento.** Mapas, rutas, secretos y rumores son datos que tienen los NPCs, con distinto grado de certeza. Lo que te cuentan depende de su personalidad, de cuánto confían en vos y de lo que les des a cambio.

### NPCs e historia
- Cada NPC tiene personalidad propia y una historia con los demás. No hace falta mostrarla; alcanza con que exista y te la puedan contar.
- **El pasado se simula.** Antes de empezar la partida se corren varias décadas de historia simplificada (nacimientos, vínculos, conflictos, viajes, muertes) para que las historias sean coherentes y estén conectadas.

### Personaje
- Personaje propio y muy personalizable: cuerpo, piel, pelo, ojos, rasgos y accesorios.
- **Origen aleatorio.** Familia de composición variable (padres, hermanos, de 0 a muchos), cada miembro con pocos rasgos. Son personas reales dentro de la simulación: pueden aparecer en el diario, tener una recompensa, ser capturadas.
- Los familiares pueden tener secretos y vínculos con personajes del mundo, o con leyendas del pasado (por ejemplo, haber cruzado el camino de Roger).
- **Linaje "D."**: aleatorio, ultra raro y oculto. Nunca se sabe al empezar; se descubre jugando.
- **Prólogo como cuestionario de vida** (ver `docs/prologo.md` y `docs/menu/`): diez preguntas de los 6 a los 17 años que forman carácter (cinco ejes), rasgos, estadísticas iniciales, oficio, vínculos, sueño y punto de partida. **Sin modos Destino/Libre:** el jugador elige raza y ve todas las respuestas; un suceso de vida al azar aparece sin anunciarse. Sin explicaciones de más: el juego habla solo.
- **El protagonista es humano.** No hay elección de raza. Las demás razas existen en el mundo (Gyojin, Mink, Brazos largos, Piernas largas, Tontatta).
- **La familia se sortea y no depende del prólogo.** Es igual en ambos modos; las preguntas se adaptan a ella.
- **El oficio se resuelve en el prólogo, no se juega.** Es una simulación de piratas, no de carpinteros. Sale de tu origen y de tus decisiones de infancia, y define tus habilidades, tu rol en un barco (navegante, cocinero, carpintero naval, médico…) y parte de tu estilo de pelea. Se usa cuando hace falta; no hay "trabajar 4 horas".
- **El oficio del prólogo es un dato de tu historia,** con influencia en tu rol a bordo (navegante, espadachín, cocinero, músico, médico, arqueólogo…). No define estadísticas ni afinidades.
- **El final del prólogo decide dónde empezás:** *listo para zarpar* (en tu isla, con la salida disponible entre los días 10 y 15) o *ya zarpaste* (te escapaste, te reclutaron, te llevaron a la fuerza), y entonces arrancás en el mar o en tu primer destino.
- **Sueño**: se construye a partir de las decisiones del prólogo y se conecta con algo de tu vida que le dé sentido. Ejemplo: querer una familia por haber crecido huérfano.
- **Rol emergente.** No hay clases: pirata, marine, ciudadano, revolucionario, etc. surgen de lo que hacés. El mundo reacciona con reputación por facción y por isla.
- **Personajes que atraviesan tu historia**, generados desde tu origen: un rival, un amigo perdido que buscás, alguien que conociste de chico y que reaparece.

### Necesidades
- **La salud es central:** las heridas pesan en las peleas y en todo lo demás.
- Hambre, cansancio, plata y ánimo son **presión**: si se descuidan mucho, condicionan las decisiones y el día a día.

### Ritmo de exploración
- En la isla de origen, la posibilidad de zarpar aparece entre los días 10 y 15. Con barco propio hay más libertad.
- **El juego invita a tomarse el tiempo.** El mundo tiene que ser lo bastante interesante para querer explorarlo entero sin apurarse.

### Razas
- Están todas, con distinta rareza. Las raras son posibles pero poco frecuentes.
- **Más rara, más poderosa, pero más perseguida.** Cada raza tiene ventajas y costos, también sociales.
- La ventaja de la raza pesa al principio. Haki y voluntad igualan la cancha al final.
- La raza se elige al crear el personaje.

### Frutas del Diablo
- Se respetan las categorías canon: Paramecia, Zoan (incluidas antiguas y míticas) y Logia.
- Hay frutas canon (como objetos del mundo, con dueños originales) y frutas originales. Las originales tienen que sentirse de One Piece, ni rebuscadas ni fuera de tono.
- **Cada fruta es un objeto del mundo**, con estado: tiene dueño, está en tránsito, escondida o perdida. Se venden, se roban y aparecen donde nadie las espera.
- **Cuando un usuario muere, la fruta reaparece** y la puede conseguir cualquiera: el jugador o cualquier personaje del mundo.
- **No sabés qué comiste** salvo que tengas acceso al catálogo de frutas, un objeto raro.
- Muy pocas en el East Blue.

### Combate
- **La pelea la simula el motor** sobre el mapa B, en movimiento y con impacto. Tu personaje actúa por instinto según sus habilidades, su personalidad y su estado. No hay modo por turnos.
- **Tres o cuatro pausas por pelea** en momentos clave. Las opciones dependen del rival y de tu personaje: lo que tiene cada uno, lo que sabés del otro y el estado de ambos.
- **Pantalla limpia:** carteles breves que anuncian un ataque o una acción importante. El estado físico (cansancio general, heridas por zona) y el estado mental se despliegan solo cuando el jugador quiere verlos.
- **Heridas por zona con color:** cuanto más roja la zona, más probable quedar fuera de combate en el próximo golpe. Cabeza, órganos, piernas y zonas sensibles pesan más. Una fractura puede obligarte a retirarte según varios factores.
- **Chances de ganar como indicador general** (pocas, parejas, altas), que resume tu estado completo frente al rival. Sin porcentajes y sin explicar el porqué: el jugador lo deduce mirando su estado. Siempre podés seguir peleando aunque las chances sean pocas.
- **Voluntad sin números:** el jugador entiende si está alta o baja por cómo se ve y se comporta su personaje.
- **Efectos visuales característicos obligatorios:** grietas en el aire de una fruta sísmica, fuego, la onda del Haki del rey, etc. Son parte del ambiente de la pelea.
- **Encuentros, no solo peleas:** hablar, mentir, sobornar, provocar, intimidar, huir o rendirse. Lo social cambia el combate.
- Las frutas definen verbos de los que salen las técnicas. Las debilidades del rival se aprenden y son conocimiento.

### Cicatrices
- Cada cicatriz guarda quién, con qué y cuándo, y puede dejar nada (solo marca), dolor, miedo o debilidad. El miedo y el dolor se pueden superar.
- Al mirar una cicatriz se abre el recuerdo.

### Páginas de manga
- **No se usan en combate.** Son para lo narrativo: recuerdos y flashbacks (también los de las cicatrices), momentos del prólogo, revelaciones, el primer cartel de recompensa y títulos de capítulo.
- Tienen que estar muy bien diseñadas y ser fieles a lo que pasa: el jugador tiene que celebrarlas cuando aparecen.

### Gráficos
- **Referencias concretas del autor:** Pokémon Añil (RPG Maker XP, estilo cercano a la tercera generación) y "Revelations" (a confirmar cuál). Se toma el aspecto, no los recursos, y se suma nuestra propia impronta.
- **Referencia:** juegos fan de Pokémon y Pokémon de mitad de generaciones, en estilo, no en contenido. Vista cenital con tiles, sprites de 4 direcciones, paleta colorida y nivel de detalle intermedio. Nunca se usan recursos sacados de juegos de Pokémon.
- Lo que viene después en combate se muestra en movimiento, no en maquetas estáticas.
- **Devolución de la biblia v1:** lo mejor encaminado es el ambiente y la luz por hora. El arte del mundo está "a pocos pasos".
- **Interfaz en alta definición:** HUD, menús y textos tienen que verse modernos, nítidos y legibles, no pixelados. El mundo sigue en píxel; la interfaz no.
- **Dirección de personajes (con aportes del texto de ChatGPT):** siluetas reconocibles sin colores, variedad real de cuerpos, caras y peinados, volumen y materiales en lugar de colores planos, paleta limitada por personaje, y siempre pensados para animarse en cuatro direcciones. Escala razonable para una producción chica.
- **La vista lateral sale del mismo modelo que la frontal:** ojos a la misma altura y del mismo tamaño. Capas y chaquetas sobre los hombros van detrás del cuerpo.
- **Personajes con aspecto de juego, no de cuento:** proporciones compactas (cabeza grande, cuerpo chico), brazos pegados al cuerpo, una plantilla común para todos, cuatro direcciones y caminata. Cuerpos y cabezas combinables que mantienen la misma línea.
- **El protagonista y sus opciones de diseño tienen el mismo estándar que el resto:** no es mejor ni peor que los demás personajes.
- **Nada de detalles de más:** la información se da en el diálogo o la narración, no en carteles ("preocupado", "dato nuevo"). Tu estado y el del rival se abren a pedido.
- **"Momento decisivo"** en lugar de "pausa".
- **El panel del cuerpo es una figura bien dibujada por zonas:** al tocar una zona dice qué tiene; al costado, solo lo general.
- **Ficha del protagonista al tocar su retrato:** edad, origen, tripulación, recompensa y estado.
- **Nada de cámara lenta en la pausa:** la pelea se detiene para decidir, como en la prueba de estilo 1.
- **Zoom:** la cámara por defecto está más cerca, con un nivel para alejarse y otro para acercarse; siempre se vuelve al normal.
- **Referencias de interfaz:** Eastward (calidez y terminación) y RimWorld (información completa). La interfaz es original.
- **Marines con equipo variado:** chaqueta sobre los hombros para oficiales, sables al cinto o cruzados, pistolas, mosquetes. Caras humanas con ojos elaborados.
- **La pausa de la pelea acompaña, no tapa:** formato compacto como en la prueba de estilo 1, mejor resuelto. La viñeta grande en el centro queda descartada.
- **Personajes con diseño propio:** los importantes se diseñan uno por uno, con la rareza y la personalidad de los diseños de One Piece. El generador queda para la multitud.
- **Biblia visual v1** en `docs/biblia-visual/`: concepto "dos tintas" (mundo en píxel a color, historia en tinta sobre papel), paleta, luz por hora, sistema de personajes, materiales de interfaz (madera, lona, papel, latón) y organización de cada pantalla. Pendiente de aprobación del autor.
- **La prueba de estilo 1 no alcanza el estándar** (`prototipos/prueba-estilo/`): interfaces sin personalidad, diseños insípidos, gráficos pobres. Hace falta una identidad visual propia antes de producir más arte.

### Islas y lugares canon
- Las islas y lugares canon están en el juego, preferentemente con sus nombres oficiales. Su aspecto es nuestra propia interpretación en el estilo del juego.

### Barcos
- Los barcos tienen diseños particulares, como en la obra.
- Se pueden comprar modelos ya hechos, mejorarlos o encargar uno a un carpintero naval eligiendo partes. Todo se paga en berries.

### Diálogos
- Los personajes hablan con estilo One Piece: exagerados, con gritos, nombres de técnicas, risas propias y apodos. Nada de registro rioplatense en los textos del juego.
- **Castellano de España** como punto de partida, siguiendo el registro del doblaje español.
- Los personajes importantes tienen una risa propia.

### Escalas de poder y efectos
- **Al principio, la diferencia entre tener fruta y no tenerla es abismal.** Quien no tiene fruta solo gana en circunstancias raras: debilidades (mar, kairoseki), terreno, ingenio, ayuda o un usuario con poco dominio.
- **Siete estadísticas de 1 a 100:** Fuerza, Resistencia, Agilidad, IQ de combate, Intelecto, Voluntad y Carisma. Crecen haciendo. 100 es la cima del mundo; referencia orientativa: en el East Blue un marine raso ronda 20 y un capitán pirata chico entre 35 y 45 (a calibrar).
- **IQ de combate e Intelecto son distintos:** se puede ser torpe fuera de la pelea y brillante dentro (como Luffy). El IQ de combate pesa mucho en el uso de las frutas.
- **Voluntad:** es una estadística de fondo. Dentro de la pelea se ve como temple (aura, postura, expresión), sin números.
- **La afinidad no impide comer ninguna fruta:** acelera el dominio.
- **Compatibilidad con las frutas** según las características del personaje. Las frutas se agrupan por afinidad (por ejemplo, una fruta compleja de tipo quirúrgico pide ingenio; una sísmica, fuerza bruta). Esto resuelve el dominio.
- **Poder por mar como distribución:** el East Blue es bajo y parejo; el Nuevo Mundo tiene enorme variedad, con gente de todos los calibres.
- Hay que definir con claridad las escalas de poder y cómo se organizan. Un aprendiz no le gana a un usuario de fruta poderoso al principio.
- **Cada fruta, Haki y habilidad tiene su propia identidad visual,** y la magnitud del efecto refleja su poder real. Las frutas originales no pueden parecerse visualmente a una fruta canon conocida (las grietas en el aire se leen como la fruta sísmica).

### Haki
- El Haki no está disponible al principio. Se aprende tras experiencias fuertes.
- **La derrota casi nunca mata.** Cada rival tiene una intención (matar, derrotar, capturar, humillar, reclutar) según su personalidad, su facción y el contexto.
- La derrota abre caminos: prisión, subasta, perder el barco, rescatar a un compañero. Podés perderlo todo y quedar marcado.

---

## En discusión
- **Edificios entrables:** no todos, pero una gran variedad (casas, tabernas, tiendas, astilleros, edificios de la Marina si sos marine), siempre con gente y vida adentro; alguien puede tener algo importante que decir, o no.
- **Islas:** todas las canon de los arcos principales y las secundarias más importantes, más algunas generadas. La lista del autor, ordenada según la ruta de la obra, está en `docs/islas.md`.
- **Estilo del mundo: piezas LPC (opción A)**, las mismas de los personajes, con recortes exactos. Lo que LPC no tiene (barcos, cosas de la Marina, objetos de One Piece) se dibuja por código imitando su estilo. La luz va por código: rayos de ventana con degradado, resplandor del fuego y luz ambiente según la hora. Comparación en `docs/comparacion/`.
- **Familia fija (reemplaza la familia al azar):** tu madre **Marla** y tu hermano menor **Corso** viven con vos en Kalé. Tu padre desapareció y Marla no quiere hablar de él. Vos sos el que zarpa y Corso se queda. El **apellido lo elige el jugador** junto con el nombre, y lo lleva toda la familia, el padre incluido. Somos humanos, sin elección de raza. La historia cambia según seas pirata o marine.
- **Kalé está en el East Blue** y es siempre el punto de partida. Se descarta el inicio al azar entre los Blues.
- **Primero el plano, después la construcción:** `docs/kale/plano.json` es la fuente única de la isla (mapa, edificios, fachadas e interiores) y el juego la va a leer. `docs/kale/index.html` lo dibuja y `docs/kale/validar.py` revisa solapes, puertas sin camino y ventanas mal puestas. Reglas: vista 3/4 con techo entero y fachada sur, puertas de calle al sur, caminos que llegan a las puertas, interior coherente con el exterior, cuartos con paredes, luz según la orientación de la ventana y la hora, sombras opuestas al sol y techos por encima de los personajes.
- **Kalé v0.3, construida desde el plano** (`docs/juego/`): `mundo.js` lee `plano.json` y arma la isla con piezas LPC (suelo, caminos, plaza, muelle, edificios con techo a cuatro aguas y fachada según el material, objetos y árboles), sombras que siguen al sol, luz de día, atardecer y noche, y los interiores generados desde las plantas. Se entra a la casa, la taberna y la casa de Brin. La tienda, el médico y el faro todavía están cerrados (con un motivo dentro del juego). Familia fija con el apellido elegido, conversaciones por temas y prólogo de seis recuerdos.
- **Reglas fijas para todos los edificios** (también en el plano): cada cuarto es su propia escena; las puertas se abren con E, con transición; lo demás de la casa no se ve. Las tiendas y oficios tienen horario. Todo lo transitable se alcanza caminando. Estas reglas se suman a las de vista, puertas, caminos, escala, coherencia entre interior y exterior, luz, sombras y capas.
- **Movimiento:** paso de 112 px/s y carrera de 175 px/s (Shift, o el botón Correr en el teléfono). Zoom con la rueda, con + y −, o con dos dedos.
- **Conversaciones:** estrategia en `docs/conversaciones.md`: la pregunta suena según tu rasgo más marcado, cada persona guarda confianza, lo que sabés abre temas con otros, los temas se agotan y los saludos y comentarios cambian con la hora. Se suman Gaspar (tienda), el Doctor Ansel y Nell (panadería).
- **Personalización antes del prólogo:**
  - Nombre y apellido.
  - Pestaña Aspecto: cuerpo (masculino, femenino, fornido o menudo), rostro (rasgos marcados o suaves), piel, ojos, peinado y color de pelo.
  - Pestaña Ropa: arriba, encima, abajo, pies y cabeza, cada una con su color.
  - Botón Al azar.
  - Se arma con capas LPC recoloreadas en el juego. Marla y Corso heredan tu piel, tus ojos y tu color de pelo.
- **Introducción en tiza** después del prólogo: cinco dibujos que se trazan solos, con una frase cada uno.
- **Acto 0 jugable** (guion en `docs/acto0.md`):
  - a las 17:00 suena la campana;
  - en la plaza, Dorne encadena el ancla, con opciones según lo que sabés;
  - pelea de instinto con pausas para proteger a Corso;
  - aparecen el forastero y la teniente Breda Nisi;
  - al atardecer, despedidas: Marla te da la brújula del padre si hay confianza;
  - de noche, la partida por el camino pirata o el marine, y el fin del Acto 0.
- **Rutinas de la gente durante el día:**
  - Marla va al mercado al mediodía.
  - Brin come en la taberna.
  - Lin dibuja junto al faro.
  - Rosa vende en el mercado.
  - Pura duerme la siesta.
  - Nadie aparece ni desaparece delante tuyo.
- **Descansar:** en tu cama podés descansar para que pase el tiempo.
- **Pelo de niños:** los niños usan peinados LPC de niño, no los de adulto, que en la cabeza chica flotaban.
- **El forastero va encapuchado, de negro, sin cara visible.** Su gesto en la plaza es un Haki del rey animado: una onda oscura que sale de él, rayos negros con filo rojo, la imagen se desatura y tiembla, y la gente se echa atrás.
- **Interiores decorados** (`docs/juego/decor.js`): piezas LPC y objetos dibujados por código con la misma paleta y contorno.
  - Casa: el mapa y los dibujos de Corso, el barquito, un espejo, un cuadro del mar y pescado seco.
  - Taberna: un retrato, el cartel de Dorne, una antorcha, un reloj, un candelabro, laúd y tambor en la tarima, y un barco en botella.
  - Tienda: sogas, remos, un ancla chica, una balanza, un farol y cañas.
  - Médico: un esqueleto, un reloj, el diploma, frascos, hierbas colgadas y una palangana.
  - Panadería: estantes de pan, cestas, la pala del horno y trigo.
  - Todo bloquea lo que tiene que bloquear, y una prueba comprueba que cada puerta sigue siendo accesible.
- **Interfaz del juego:**
  - Esc (o el botón ❚❚) abre la pausa con los controles.
  - Al empezar, una pista de controles que se va sola.
  - El diálogo aparece letra a letra; E lo completa.
  - El monedero queda oculto hasta que haya economía.
  - Golpes con estrella de impacto.
  - Sombras de nubes que cruzan la isla y una viñeta suave en los bordes.
- **Versión 0.5 (después de la segunda prueba completa):**
  - **Animaciones LPC completas:** caminar, tajo, estocada, disparo y caída, para todos los personajes y para el tuyo.
  - **Pelea y escenas animadas.** Ataques, golpes que se encajan y caídas. La gente mira a quien habla, y aparecen signos sobre la cabeza (!, ?, …, zzz).
  - **Haki:** casi toda la plaza se desmaya. Tú caes de rodillas; Corso tiembla y Dorne retrocede.
  - **El forastero se va antes de que llegue la Marina:** no se cruzan.
  - **La cadena** es de eslabones de verdad. Los piratas tiran a tirones y el ancla suelta polvo.
  - **Mañana con cosas para hacer:**
    - duelo con Yago en el astillero, eligiendo arma;
    - Brin cuenta que tu padre enterró una caja junto a la Vieja, la roca con forma de ballena;
    - la caja trae el arma de tu padre del tipo que elegiste, la brújula y una nota.
    - El reloj va un poco más rápido.
  - **Bolsa:** aviso con la imagen del objeto, y Bolsa y Diario en un mismo panel (I y J).
  - **Brújula (C):** latón y aguja con inercia. Apunta a lo siguiente que importa: la caja, el ancla, el forastero.
  - **Marla** ahora te da el retrato que faltaba en el marco, si hay confianza. La brújula viene de la caja.
  - **Cartel de recompensa** con la foto de Dorne a mitad de un tajo.
  - **Marina con uniforme:**
    - los marineros llevan gorra blanca con banda azul, cuello marinero y corbatín, dibujados sobre la cabeza en cada cuadro;
    - los oficiales llevan el abrigo blanco sobre los hombros.
    - Los rangos siguen pendientes.
  - **Creación:**
    - sexo y complexión por separado (no hay cuerpo de mujer fornida en LPC);
    - diez tonos de piel, entre ellos pálida, trigueña, café con leche y canela;
    - treinta colores de pelo;
    - los ojos ya cambian de color.
  - **Mundo:**
    - los caminos se dibujan como uno solo;
    - ancla y faro rehechos;
    - la casa de Brin pasa a tierra firme;
    - pasto con matas, flores y piedras;
    - humo de chimenea, gaviotas, mariposas, una ardilla, luciérnagas y el haz del faro.
  - **Tiempo y movimiento:** el atardecer y el descanso pasan a la vista, no de golpe, y el zoom es suave.
  - **Frases según el momento del acto,** sin repetir las últimas.
- **Versión 0.8: Acto 1, Shells Town** (diseño en `docs/shells-town.md`, plan en `docs/plan-v08.md`):
  - **Motor de islas:**
    - cada isla tiene su plano, su gente, sus objetos y sus reglas;
    - Kalé es una isla más;
    - se puede guardar y continuar en otra isla.
  - **La Medusa Gris:** el forastero se llama así en el mar y no dice su nombre. Te deja al amanecer en una cala, detrás de Shells Town.
  - **Shells Town:**
    - **los lugares:** la base de la Marina con muralla, batería y portón; la cantina El Caldero; la Posada La Concha; Pertrechos Ulloa; el Foso; el muelle con la Tortuga Parda; la cala;
    - **personajes nuevos:** Rufo, Iria, Tobi, el cadete Severin (el rival), el capitán Brisco y la capitana Quill.
  - **Tres candidatos a compañero,** cada uno con su encargo; eliges uno.
  - **El desfile, en un solo tramo:**
    1. entras en la base y recuperas lo que le confiscaron a tu compañero;
    2. un tropiezo en la batería dispara el cañón de saludo y la bala destroza la estatua del capitán justo al destaparla;
    3. pelea con Severin;
    4. huida al muelle;
    5. pagas todo lo que tengas en la Tortuga Parda, rumbo a Goa.
  - **Fama:** lo que hiciste en Shells Town queda anotado para el periódico y el cartel.
  - **Versión 2 de Shells Town (después de la primera prueba):**
    - **La ciudad, rediseñada:**
      - base de la Marina de tres plantas con el emblema, torres de vigía, patio de armas con mástil, el poste, muñecos, armeros y el cañón de saludo;
      - la estatua del capitán va en lo alto del cuartel, como en la obra;
      - casas de dos plantas con estuco, ladrillo, balcones, toldos y tendederos, y una plaza con fuente.
    - **Unos 25 vecinos con casa y agenda.** Salen por la puerta, caminan por las calles (red de calles con rutas cortas), trabajan, van a la cantina y vuelven a casa. Con algunos se habla.
    - **Nombres:**
      - los candidatos son Rufo Brasa, Niklas Brand (antes Tobi) y Nerea Calma (antes Iria);
      - Nerea es la práctica del puerto y tahúr: su maestro, el viejo Tadeo, salvó a veinte personas de un barco pirata y está preso, y su encargo es pillar a un cabo que hace trampas a las cartas;
      - el rival es el cadete Darío Severin.
    - **Cinemáticas con el motor:** franjas, cámara que viaja sola y personajes que caminan, reaccionan y hablan en globos. Las hay en la llegada, el control, la partida de cartas, el cañonazo, la pelea partida y la huida.
    - **El cierre:**
      - tu compañero se lleva a dos marines al fondo del patio (polvo y golpes) mientras peleas con Severin;
      - si pierdes, tu compañero te rescata;
      - la huida tiene campanas, disparos y gente corriendo, y saltas a la Tortuga Parda cuando ya se separa del muelle.
    - **La brújula** apunta a lo que toca hacer.
    - **Frutas:** la propuesta de cuáles quedan reservadas está en `docs/frutas.md`.
  - **Solo camino pirata (decidido):** se quita la opción de alistarse en la Marina. Es lo más común y lo más entretenido, y evita mantener dos caminos. En Kalé, la teniente Nisi sigue existiendo y te ofrece alistarte, pero solo se le puede decir que no. Se quitaron el viaje en la Gaviota Blanca y su tiza.
  - **Sonido:** se quitó el graznido de gaviota, que sonaba raro.
  - **Versión 3 de Shells Town (después de la segunda prueba):**
    - **Nadie queda tapado:** ningún mueble ni puesto tapa a un tendero o vecino. Un chequeo automático (`herramientas/pruebas/tapados.js`) recorre todas las horas y avisa si alguien queda tapado, pisa un mueble o se amontona con otro.
    - **Diseños propios:** 16 personajes nuevos para quienes repetían el sprite de Kalé (Pipo, Lalo, Marta, la viuda Amaro, doña Celes, la marinera, Bruto, el sargento Pardo, el cabo Ruiz, cinco marines distintos, Clara y Goyo).
    - **Casas con volumen:** paredes laterales en sombra bajo el alero y sombra del alero en la fachada.
    - **Presentación de los candidatos:**
      - al entrar al pueblo, en el mercado, el cabo Ruiz le quita pan a Inés;
      - Rufo protesta, Niklas se planta y Nerea apuesta;
      - Severin hace pagar al cabo;
      - los tres se presentan y dicen dónde encontrarlos;
      - después, Lalo explica la isla.
    - **Recordatorios:** cuando un encargo está pendiente, el candidato te recuerda qué falta y dónde está. Dentro de la base, tu compañero dice dónde buscar la llave y el almacén, y la brújula apunta allí.
    - **Vecinos:**
      - quien camina no te corta el paso;
      - van por las calles, sin atravesar casas;
      - cada uno anda a su ritmo.
    - **Más vida:** macetas en las puertas, nasas, más carga en el puerto, gatos, gaviotas que se espantan, un perro y gallinas.
    - **Escenas sueltas:** en el menú, "Escenas" deja jugar cada momento de Shells Town con un personaje de prueba (y con el compañero que elijas), sin tocar la partida guardada. También por enlace: `index.html?escena=canon&compa=nerea`.
    - **Frutas:**
      - la Medusa Gris tiene la Kurage no Hinotama (Zoan mitológica): ropa oscura y, transformado, azul con fuego rojizo dentro;
      - la propuesta para la subasta son 15 frutas originales, una de ellas la mítica (catálogo para aprobar en `docs/frutas.md`).
  - **Detalles:**
    - el nombre de la tripulación se elige con Corso en el desayuno;
    - las cubiertas de los barcos se dibujan con detalle y la escotilla ya no traba.
- **Versión 0.7: zarpar** (plan en `docs/plan-v07.md`):
  - **Armas para todos:** las 27 de LPC en tres grupos:
    - comunes;
    - de oficio;
    - de personajes importantes.
  - **Armas iniciales:** se elige entre ocho, las más distintas (sable, mandoble, espada corta, martillo, hacha, lanza, arco, daga), cada una con su versión del padre y de madera.
  - **Armas de los NPC:**
    - los marines llevan espada corta, pistola o mosquete;
    - los piratas, armas distintas;
    - Dorne, una guadaña propia (Colmillo Negro).
  - **Economía:**
    - berries;
    - tiendas de Gaspar, Nell, Mara y el médico;
    - comprar y vender (pagan el 40%);
    - comida que repone aguante;
    - encargos con recompensa, en su pestaña del diario.
  - **Kalé más vivo:**
    - el faro y el destacamento de la Marina se pueden entrar, con su gente (Lin en el faro, el sargento Vela y el capitán Malva en la guardia);
    - un catalejo perdido en la playa.
  - **Barcos a los que se sube:**
    - la Corneja (del forastero) y la Gaviota (de la Marina), con cubierta, pasarela y bajo cubierta;
    - la escotilla queda cerrada hasta zarpar;
    - en el mar la imagen se mece.
  - **Zarpar:**
    - escenas de tiza nuevas;
    - despertás en el camarote, investigás, y entra el forastero (el Cuervo; su nombre queda en secreto) o la teniente (Nisi) a conversar sobre tu padre;
    - el forastero da una pista y se va por asuntos pendientes;
    - destino: Reino de Goa (pirata) o Loguetown (marine).
  - **Sonido generado en el navegador:**
    - ambiente según lugar y hora;
    - efectos;
    - cinco temas cortos (Kalé, plaza, noche, mar, tiza);
    - música, efectos y textos rápidos se activan por separado y se recuerdan.
  - **Goa y Loguetown se construyen en la próxima versión (Acto 1).** Por qué esas islas:
    - Goa es la isla del East Blue con más canon fuera de los personajes (la Terminal Gris, el reino, el puerto), y queda cerca de una isla chica como Kalé;
    - Loguetown es la base natural de un recluta antes de la Grand Line.
- **Versión 0.6:**
  - **Guardado de partida** en el navegador:
    - se guarda solo al cambiar de lugar y en momentos clave;
    - también a mano desde la pausa;
    - "Continuar" en el menú;
    - no se guarda durante el ataque a la plaza.
  - **Heridas por zona:** cabeza, cara, torso, brazos y piernas. Los golpes de las peleas hieren una zona, y las heridas se ven en el personaje.
  - **El doctor Ansel te da emulsión y vendas** si le dices que te vas.
  - **Pestaña Cuerpo (K):** una figura por zonas; primero la emulsión, después la venda. Las vendas se ven en el sprite. Las heridas sin curar bajan el aguante en las peleas.
  - **Haki:** carga con aura negra y roja, descarga con onda que deforma la imagen, rayos pegados al forastero, grietas en el suelo y una presión que late.
  - **Barcos de perfil**, como las fachadas. El de Dorne lleva velas negras con la medusa. El de la Marina, blanco y azul, con la gaviota y "MARINE".
  - **Vallas a medida,** con estacas, travesaños y postes de portón.
  - **La nota, el mapa y el retrato** se pueden ver de cerca desde la bolsa.
  - **Armería** (artifact aparte): las 27 armas de LPC sobre el personaje, con su golpe animado, para elegir cuáles entran.
- **Armas:** plan en `docs/armas.md`.
  - LPC para espadas, contundentes y astas, con paletas.
  - Armas de fuego dibujadas por código sobre la pose de disparar.
  - El grado decide la resistencia y el filo, no el daño.
  - Las espadas con nombre del canon no se poseen.
- **Casa con cuartos:** una sola escena con la sala y la cocina abajo, y el cuarto de Marla y el de los hermanos arriba, separados por una pared con dos puertas.
- **Después del prólogo, una introducción corta** cuenta lo esencial de tu vida: dónde vivís, con quién, tu hermano, y que no conocés a tu padre.
- **Acto 0 en Kalé (propuesta):** Dorne en la taberna, una pelea en el muelle y un mentor que te invita a zarpar (o un marine que te invita a alistarte). Al atardecer recorrés la isla y te despedís.
- **Comentarios y conversaciones ambientales:** los NPCs dicen frases sobre su cabeza según el contexto y conversan entre sí; lo que escuchás puede darte información.
- **Diario del protagonista:** lo más relevante sobre vos, tu familia, la gente y los rumores, escrito a medida que lo descubrís.
- **Kalé jugable v1** (`docs/juego/`): menú, prólogo y despertar en casa con la familia sorteada. La isla tiene una plaza con el Ancla de Kalé como monumento, una taberna (El Ancla Seca), un muelle en T con botes, la casa del jugador, la casa de Brin, un astillero chico, puestos de mercado y el destacamento de la Marina, que todavía no se puede entrar. Por ahora se entra a tres interiores, dibujados por código: la casa, la taberna y la casa de Brin. Hay comentarios en globos, una conversación que se puede escuchar en la plaza y un diario (J) con las secciones Yo, Familia, Gente, Rumores y Kalé. Sin carteles de "dato nuevo": un punto en el botón del diario avisa que se escribió algo.
- **Base de personajes: LPC en prueba** (`docs/menu/`). Piezas del Universal LPC Character Generator (gratis; CC-BY-SA 3.0, GPL 3.0, OGA-BY 3.0; obliga a dar crédito y a compartir bajo la misma licencia lo derivado). Créditos incluidos en la pantalla de Créditos. Mana Seed descartado (pago y su licencia prohíbe combinarlo con recursos generados por IA). Limitación de LPC: pocas complexiones (hombre, mujer, musculoso, adolescente, niño).
- **Menú principal e interfaz moderna:** fondo vivo del puerto, interfaz en vidrio oscuro cálido con oro, tipografías Rammetto One (logo) y Outfit (todo lo demás). Pendiente de aprobación.
- **Herramientas para que no haga falta apurarse:** Log Pose que tarda en cargar, peligro que escala, islas con profundidad.
- **Iteración visual 4** (`docs/iteracion-4/`), pendiente de devolución: personajes reconstruidos con volumen por luz, contorno del color de la pieza, formas de cara, capas de ropa en orden y vista lateral coherente. Tres proporciones para elegir (A compacta, B intermedia, C estilizada). Plan de mejoras en `docs/plan.md`.
- Iteración visual 3 (`docs/iteracion-3/`), con devolución recibida: personajes sobre una plantilla común (seis complexiones, cuatro direcciones, caminata), mezclas al azar, elenco rehecho, interfaz más chica y bajo demanda, panel del cuerpo por zonas.
- Iteración visual 2 (`docs/iteracion-2/`), con devolución recibida: casillas de 32 px, personajes de unos 52 px, zoom de tres niveles (alejado, normal, cerca), interfaz en alta definición, ocho personajes originales diseñados uno por uno, barco nuevo con mascarón y pausa compacta.
- **Escala de poder:** niveles por mar, recompensas, potencial de la fruta por dominio del usuario, Haki.
- **Afinidad:** si además de la velocidad limita el techo del dominio, y qué grupos de frutas pesan sobre qué estadísticas.
- **Peleas grupales:** propuesta de una sola pelea donde los duelos aparecen solos, con órdenes a la tripulación.
- **Cómo se representa la voluntad** sin números (ver propuesta en la conversación: expresión del retrato, postura y aura del sprite).
- **Cómo se producen las páginas de manga** si el protagonista es personalizable (propuesta: componer con entorno, objetos, rivales y el protagonista de espaldas, en silueta o en primer plano parcial).
- Mapa del mundo: ¿hay un modo con el mapa entero conocido desde el inicio?
- Detalle de la simulación del pasado: cuántos años, qué eventos, qué escala.
- Lista de razas, rarezas y costos (hay que verificar contra el canon).
- Catálogo de frutas: cuántas, cuáles canon, cómo diseñar las originales.
- Stack técnico: web con TypeScript y Phaser (motor 2D con mapas de tiles, animación, partículas y cámara), con mapas en Tiled. Propuesta, sin cerrar.
- **Origen del arte:** dibujado por Claude como pixel art a mano, paquetes con licencia libre, generado con IA y retocado, o una mezcla. Se decide con una prueba de estilo.

## Descartado
- Texto e interfaz pixelados. Pasan a alta definición.
- Viñeta de decisión grande en el centro de la pantalla durante la pelea.
- Modo de combate "al mando" por turnos. El instinto con pausas es el sistema.
- Página de manga para el remate de las peleas.
- Personajes canon vivos en el juego, ya sea dibujados o solo a distancia. Reemplazado por la nueva generación.
- Formato C (carta náutica) como formato principal. Puede quedar alguna idea suelta, por ejemplo para el mapa del mundo.
- Copiar las estructuras de RimWorld o Project Zomboid. Son referencias de gráficos simples con sistemas complejos, no de mecánicas.

---

## Límites conocidos
- **Arte de personajes canon:** Claude no dibuja personajes canon reconocibles, ni siquiera simplificados o en pixel, porque lo que cuenta es que se reconozcan, no el nivel de detalle. Por eso se eligió la nueva generación: todos los personajes vivos son originales.
- **Separar motor y contenido:** el motor es un simulador de mundo pirata y One Piece es un paquete de datos. Facilita una publicación futura.
- **Lore:** los datos canon que aporte Claude se verifican antes de darlos por buenos. El autor tiene la última palabra sobre el canon.
