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
- **Prólogo de infancia y adolescencia** jugado de forma comprimida. Ahí se forman el sueño, las habilidades heredadas (por ejemplo, armas del dojo familiar) y los vínculos.
- **El oficio se resuelve en el prólogo, no se juega.** Es una simulación de piratas, no de carpinteros. Sale de tu origen y de tus decisiones de infancia, y define tus habilidades, tu rol en un barco (navegante, cocinero, carpintero naval, médico…) y parte de tu estilo de pelea. Se usa cuando hace falta; no hay "trabajar 4 horas".
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
- **Dos modos de inicio:** *Destino* (raza sorteada según cuánta gente de cada raza hay en el mundo; es el preferido) y *Libre* (elegís).

### Frutas del Diablo
- Se respetan las categorías canon: Paramecia, Zoan (incluidas antiguas y míticas) y Logia.
- Hay frutas canon (como objetos del mundo, con dueños originales) y frutas originales. Las originales tienen que sentirse de One Piece, ni rebuscadas ni fuera de tono.
- **Cada fruta es un objeto del mundo**, con estado: tiene dueño, está en tránsito, escondida o perdida. Se venden, se roban y aparecen donde nadie las espera.
- **Cuando un usuario muere, la fruta reaparece** y la puede conseguir cualquiera: el jugador o cualquier personaje del mundo.
- **No sabés qué comiste** salvo que tengas acceso al catálogo de frutas, un objeto raro.
- Muy pocas en el East Blue.

### Haki y combate
- El Haki no está disponible al principio. Se aprende tras experiencias fuertes.
- **La derrota casi nunca mata.** Cada rival tiene una intención (matar, derrotar, capturar, humillar, reclutar) según su personalidad, su facción y el contexto.
- La derrota abre caminos: prisión, subasta, perder el barco, rescatar a un compañero. Podés perderlo todo y quedar marcado.

---

## En discusión
- **Herramientas para que no haga falta apurarse:** Log Pose que tarda en cargar, peligro que escala, islas con profundidad.
- **Sistema de combate** (propuesta en curso; maqueta en `docs/maquetas/duelo-muelle.html`):
  - Un solo motor simula la pelea sobre el mapa B. Cada acción la decide el personaje (*instinto*, por defecto, con una intención fijada por el jugador) o el jugador (*al mando*, por turnos). Se puede cambiar de modo en cualquier momento.
  - La simulación se frena sola en los momentos críticos y ofrece decisiones. Hay una narración en texto al costado que muestra solo lo que importa, y el remate se abre como página de manga.
  - Los encuentros son más amplios que la pelea: hablar, mentir, sobornar, provocar, intimidar, huir o rendirse. Lo social cambia el combate.
  - Heridas por zona y órganos que quitan capacidades, calibradas al aguante de un shōnen. Cicatrices con historia, miedos y traumas superables. Las debilidades del rival se aprenden y son conocimiento.
  - Las frutas definen verbos de los que salen las técnicas. El Haki lo usa el personaje cuando lo necesita y puede despertar en una situación extrema.
  - Pendiente: peleas grupales (propuesta: una sola pelea donde los duelos aparecen solos, con órdenes a la tripulación).
- Cómo se reparte el formato A dentro del B: qué dispara una página de manga y qué se resuelve en el mapa.
- Mapa del mundo: ¿hay un modo con el mapa entero conocido desde el inicio?
- Detalle de la simulación del pasado: cuántos años, qué eventos, qué escala.
- Lista de razas, rarezas y costos (hay que verificar contra el canon).
- Catálogo de frutas: cuántas, cuáles canon, cómo diseñar las originales.
- Stack técnico: web con TypeScript y una librería 2D (propuesta, sin cerrar).

## Descartado
- Personajes canon vivos en el juego, ya sea dibujados o solo a distancia. Reemplazado por la nueva generación.
- Formato C (carta náutica) como formato principal. Puede quedar alguna idea suelta, por ejemplo para el mapa del mundo.
- Copiar las estructuras de RimWorld o Project Zomboid. Son referencias de gráficos simples con sistemas complejos, no de mecánicas.

---

## Límites conocidos
- **Arte de personajes canon:** Claude no dibuja personajes canon reconocibles, ni siquiera simplificados o en pixel, porque lo que cuenta es que se reconozcan, no el nivel de detalle. Por eso se eligió la nueva generación: todos los personajes vivos son originales.
- **Separar motor y contenido:** el motor es un simulador de mundo pirata y One Piece es un paquete de datos. Facilita una publicación futura.
- **Lore:** los datos canon que aporte Claude se verifican antes de darlos por buenos. El autor tiene la última palabra sobre el canon.
