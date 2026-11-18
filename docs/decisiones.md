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
- **Razas jugables al inicio:** Humano, Gyojin, Mink, Brazos largos y Piernas largas. Los Tontatta existen en el mundo, pero no se juegan.
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
- **Razas jugables:** Humano, Mink y Gyojin. Brazos largos y Piernas largas quedan para más adelante.
- **Origen según raza:** los Mink vienen de Zou y los Gyojin de la Isla Gyojin, o arrancan en un barco. Gyojin y Mink, por regla general, no pueden ser marines.
- **Lugar de inicio:** idealmente al azar entre los cuatro Blues. Se empieza por el East Blue (Kalé) y se suman los demás.
- **Islas:** todas las canon de los arcos principales y las secundarias más importantes, más algunas generadas. La lista del autor, ordenada según la ruta de la obra, está en `docs/islas.md`.
- **SpriteCook** (plugin conectado, cuenta gratuita con créditos limitados) se usa para piezas puntuales que LPC no tiene, como interiores y objetos. Primer resultado: `assets/interiores/casa-familia.png`.
- **La familia se descubre jugando, no en el prólogo:** al terminar el prólogo despertás en tu casa; tu familia está ahí como gente que ya conocés. Lo que sabés de ellos y de tu historia se va revelando al hablar, con objetos de la casa y en tu diario.
- **Comentarios y conversaciones ambientales:** los NPCs dicen frases sobre su cabeza según el contexto y conversan entre sí; lo que escuchás puede darte información.
- **Diario del protagonista:** lo más relevante sobre vos, tu familia, la gente y los rumores, escrito a medida que lo descubrís.
- **Kalé jugable v1** (`docs/juego/`): menú, prólogo y despertar en casa con la familia sorteada. La isla tiene una plaza con el Ancla de Kalé como monumento, una taberna (El Ancla Seca), un muelle en T con botes, la casa del jugador, la casa de Brin, un astillero chico, puestos de mercado y el destacamento de la Marina, que todavía no se puede entrar. Por ahora se entra a tres interiores: la casa, la taberna y la casa de Brin. Hay comentarios en globos, una conversación que se puede escuchar en la plaza y un diario (J) con las secciones Yo, Familia, Gente, Rumores y Kalé. Sin carteles de "dato nuevo": un punto en el botón del diario avisa que se escribió algo.
- **Presupuesto de arte:** SpriteCook solo para interiores clave (8 créditos por imagen). Para todo lo demás, el arte se dibuja por código o con piezas LPC gratuitas.
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
