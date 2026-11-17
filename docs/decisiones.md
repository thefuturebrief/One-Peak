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
- **Época de inicio: cuando Luffy zarpa (1522).** Cómo entran los personajes canon está en discusión.
- Puede haber personajes y tripulaciones originales, con sus propios poderes y frutas.

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
- Los familiares pueden tener secretos y vínculos con personajes del mundo, canon u originales.
- **Linaje "D."**: aleatorio, ultra raro y oculto. Nunca se sabe al empezar; se descubre jugando.
- **Prólogo de infancia y adolescencia** jugado de forma comprimida. Ahí se forman el sueño, las habilidades heredadas (por ejemplo, armas del dojo familiar) y los vínculos.
- **El oficio se resuelve en el prólogo, no se juega.** Es una simulación de piratas, no de carpinteros. Sale de tu origen y de tus decisiones de infancia, y define tus habilidades, tu rol en un barco (navegante, cocinero, carpintero naval, médico…) y parte de tu estilo de pelea. Se usa cuando hace falta; no hay "trabajar 4 horas".
- **El juego empieza con el personaje listo para zarpar,** o ya zarpando si su historia lo llevó a eso (ver "En discusión").
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
- **Dos modos de inicio:** *Destino* (raza sorteada según cuánta gente de cada raza hay en el mundo; es el preferido) y *Libre* (elegís).

### Frutas del Diablo
- Se respetan las categorías canon: Paramecia, Zoan (incluidas antiguas y míticas) y Logia.
- Hay frutas canon y frutas originales. Las originales tienen que sentirse de One Piece, ni rebuscadas ni fuera de tono.
- **Cada fruta es un objeto del mundo**, con estado: tiene dueño, está en tránsito, escondida o perdida. Se venden, se roban y aparecen donde nadie las espera.
- **Cuando un usuario muere, la fruta reaparece** y la puede conseguir cualquiera: el jugador, un NPC original o un personaje canon.
- **No sabés qué comiste** salvo que tengas acceso al catálogo de frutas, un objeto raro.
- Muy pocas en el East Blue.

### Haki y combate
- El Haki no está disponible al principio. Se aprende tras experiencias fuertes.
- **La derrota casi nunca mata.** Cada rival tiene una intención (matar, derrotar, capturar, humillar, reclutar) según su personalidad, su facción y el contexto.
- La derrota abre caminos: prisión, subasta, perder el barco, rescatar a un compañero. Podés perderlo todo y quedar marcado.

---

## En discusión
- **Personajes canon.** Dos opciones:
  - *Opción 2, nueva generación:* el mundo, las instituciones, los lugares y la historia hasta la ejecución de Roger son canon y se mencionan por nombre, solo en texto. Todos los personajes vivos son originales, incluidos los grandes puestos (Emperadores, almirantes, Shichibukai). Recomendación de Claude.
  - *Opción 3, canon a distancia:* los personajes canon existen solo en el diario, los rumores y las recompensas, y nunca aparecen en persona salvo que el autor aporte sus sprites. El autor duda: no tiene sentido que estén y nunca se los vea. Está probando herramientas de pixel art para ver si le resulta viable.
- **Punto de inicio:** si el juego arranca en la isla de origen con la salida disponible en 10 a 15 días, o si el prólogo puede terminar directamente con el zarpe.
- **Herramientas para que no haga falta apurarse:** Log Pose que tarda en cargar, peligro que escala, islas con profundidad.
- **Sistema de combate.** Merece una sesión propia.
- Cómo se reparte el formato A dentro del B: qué dispara una página de manga y qué se resuelve en el mapa.
- Si los personajes canon siguen el canon después de la fecha de inicio o actúan según la simulación (quizás como opción de partida).
- Mapa del mundo: ¿hay un modo con el mapa entero conocido desde el inicio?
- Detalle de la simulación del pasado: cuántos años, qué eventos, qué escala.
- Lista de razas, rarezas y costos (hay que verificar contra el canon).
- Catálogo de frutas: cuántas, cuáles canon, cómo diseñar las originales.
- Stack técnico: web con TypeScript y una librería 2D (propuesta, sin cerrar).

## Descartado
- Formato C (carta náutica) como formato principal. Puede quedar alguna idea suelta, por ejemplo para el mapa del mundo.
- Copiar las estructuras de RimWorld o Project Zomboid. Son referencias de gráficos simples con sistemas complejos, no de mecánicas.

---

## Límites conocidos
- **Arte de personajes canon:** Claude no dibuja personajes canon reconocibles, ni siquiera simplificados o en pixel, porque lo que cuenta es que se reconozcan, no el nivel de detalle. Si el autor quiere sprites canon, los hace o los encarga él (no usar sprites sacados de juegos oficiales). Ver "En discusión".
- **Separar motor y contenido:** el motor es un simulador de mundo pirata y One Piece es un paquete de datos. Facilita una publicación futura.
- **Lore:** los datos canon que aporte Claude se verifican antes de darlos por buenos. El autor tiene la última palabra sobre el canon.
