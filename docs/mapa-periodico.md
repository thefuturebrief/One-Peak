# Mapa del mundo y periódico

Diseño para aprobar antes de construir. Decidido por el autor:
- **El mapa:** te lo da la capitana Quill en la Tortuga Parda, y Kalé no figura en él.
- **El periódico:** cuesta 10 berries.

La geografía del canon la doy de memoria; lo dudoso va marcado *(verificar)*.

## 1. El mapa del mundo

### Cómo llega
1. **En la Tortuga Parda, rumbo a Goa:** te toca fregar cubierta como parte del pasaje. Quill te llama a su camarote y extiende sobre la mesa una carta náutica impresa del East Blue: «Si vas a ir por ahí sin saber leer una carta, mejor que aprendas en mi barco».
2. **Buscás Kalé y no está.** En su lugar hay mar vacío.
3. **El momento clave:** sacás la carta que encontraste en la Corneja, la de la Medusa Gris, donde alguien escribió a mano «Kalé» junto a una isla sin nombre. Las comparás: en la impresa, ahí no hay nada. Quill frunce el ceño: «Treinta años navegando el East Blue y nunca vi esa isla. Y yo las vi todas».
4. **La dibujás a lápiz sobre la carta impresa.** Desde ese momento, Kalé es la única isla del mapa dibujada a mano.
5. **Diario:** «Kalé no existe en las cartas impresas. Alguien la borró, o nunca dejó que la dibujaran».

Este momento tiene su escena en tiza: la carta sobre la mesa y tu dedo marcando el lugar vacío. Ata tres hilos que ya existen: Lin dice que Kalé no sale en los mapas, la carta de la Corneja tiene a Kalé escrita a mano y la Medusa conoció a tu padre.

### Qué muestra
**Vista del mundo**, el esquema clásico:
- la **Red Line** de norte a sur y la **Grand Line** de este a oeste, cruzándose;
- los **Calm Belts** a los dos lados de la Grand Line;
- los cuatro **Blues**, uno en cada cuarto. En qué cuarto va cada uno está *(por verificar)*; mi recuerdo es North arriba a la izquierda, East arriba a la derecha, West abajo a la izquierda y South abajo a la derecha;
- **Reverse Mountain** en el cruce por donde se entra a la Grand Line, con las cuatro corrientes subiendo;
- **Mary Geoise** en el otro cruce, sobre la Red Line;
- el **Paraíso** de un lado de la Red Line y el **Nuevo Mundo** del otro.

**Vista del East Blue** (la que más se usa al principio):
- la zona del East Blue ampliada, con las islas de tu lista: Goa con la Terminal Gris, Shells Town, Orange Town, Villa Syrup, el Baratie, Conomi (Arlong Park) y Loguetown, cerca de Reverse Mountain;
- Kalé, hecha a mano;
- y otras islas sin nombre como relleno.

Más adelante se suman vistas del Paraíso y del Nuevo Mundo. Las posiciones son aproximadas al canon *(verificar)*, ajustadas para que el viaje se lea bien.

### Estados de una isla
| Estado | Cómo se ve | Cómo se pasa a ese estado |
|---|---|---|
| **Silueta** | Una mancha de tinta sin nombre, con un «?» chico | Así empiezan todas, salvo las que ya conocés |
| **Conocida** | Contorno con relieve rayado y el nombre en letra de cartógrafo. Al tocarla, lo que sabés de ella | Un rumor, una noticia, un cartel, alguien que te habla de ella o una carta comprada |
| **Visitada** | Dibujo con color suave (bosques, pueblo, faro), un sello de tinta con el nombre y el día de tu llegada | Pisarla |

Kalé es un caso aparte: siempre a lápiz, como la dibujaste vos.

### La ruta
- Una línea de puntos une las islas en el orden en que llegaste: Kalé, Shells Town, Goa...
- Cada tramo lleva el nombre del barco y los días de viaje, en letra chica: «La Corneja, 1 día», «La Tortuga Parda, 3 días».
- Un barquito marca dónde estás. En el mar, va sobre la ruta.

### Al tocar una isla
- Una ficha con el nombre, el mar y lo que sabés, sacado del diario (rumores, gente y noticias de esa isla).
- Si la visitaste, también el sello y a quién conociste ahí.
- Si es silueta: «Isla sin nombre. Nadie te ha hablado de ella».

### Cómo se usa
- **Se abre** desde la bolsa (la «Carta náutica») o con la tecla M.
- **Vistas:** dos niveles, mundo y East Blue. Se pasa de una a otra tocando la zona, o con los botones.
- **Moverse:** arrastrar, y ruedita o pellizco para acercar.
- **Estilo:** pergamino con tinta sepia y mar rayado a pluma, una rosa de los vientos y los nombres a mano. Mismo vidrio oscuro y oro en botones y fichas.
- **En celular:** la ficha de la isla sale abajo, como una hoja.

### Datos
Un archivo `islas.json` con una entrada por isla:
- id, nombre y mar;
- posición en el mapa del mundo (0 a 1000) y forma: semilla, tamaño y orientación, para dibujar la silueta;
- el estado inicial;
- y las pistas que la revelan: qué rumores, noticias o personas.

El estado guardado de cada isla y la ruta viven en la partida.

## 2. El periódico

### Cómo llega
- **Cuándo:** cada mañana, la primera vez que estás al aire libre o en cubierta entre las 7 y las 10.
- **Quién lo trae:** un **News Coo**, una gaviota con gorra y bolso de cartero, que baja y se posa al lado tuyo. Se dibuja por código con la misma luz y contorno que los personajes.
- **El trato:** «¿Comprar el periódico? (10 ฿)».
  - **Sí:** pagás y se abre.
  - **No:** el News Coo te mira ofendido y se va.
  - **Sin dinero:** el News Coo se va sin mirarte.
- **Archivo:** los periódicos que compraste se guardan en una pestaña del diario, «Periódicos», para releerlos.

### Cómo se ve
- **Una portada de diario de papel:**
  - cabecera con el nombre, el número y la fecha del mundo;
  - un titular grande con un grabado a pluma;
  - dos o tres noticias cortas en columnas;
  - de vez en cuando, un recuadro de «Se busca».
- **Legibilidad:** letra seria pero clara, papel cálido y nada de interfaz de menú.
- **El nombre:** en el canon, el diario se llama «Noticias Económicas del Mundo» *(verificar)*. Lo usamos sin mostrar a su dueño del canon.

### Qué trae (de 2 a 4 noticias)
| Tipo | Qué es | Ejemplo |
|---|---|---|
| **Lo tuyo** | Lo que hiciste, contado por otros, a partir de la fama | «Escándalo en Shells Town: destrozan la estatua del capitán Brisco el día de su inauguración» |
| **El mundo** | La época después de la ejecución de Roger: piratas nuevos, la Marina y el Gobierno | «La Marina refuerza las patrullas en el East Blue tras la ola de nuevos piratas» |
| **Rumores** | Pistas que **revelan islas en el mapa** | «Un pirata con un león se hace fuerte cerca de Orange Town» (Orange Town pasa a conocida) |
| **Lo local** | La isla donde estás o la próxima | «Goa: la ciudad alta prepara la visita de un noble» |
| **Con efecto** | Cambian algo del juego | «Mala temporada de pesca: sube el pescado» (precios); «Redadas en el puerto de Goa» (más patrullas) |

### Reglas
- **Una noticia nunca se repite.** Cada una tiene sus condiciones (dónde estás, qué hiciste, qué día es) y su prioridad.
- **Prioridad:** primero lo tuyo, si hay algo nuevo; después rumores y local; el mundo rellena.
- **Sin tu nombre (todavía):** hasta el cartel de recompensa de después de Loguetown, lo tuyo sale como «un joven desconocido». Detalles que cambian según lo que hiciste:
  - «acompañado de un cocinero», «de una mujer con un libro» o «de un exrecluta con una lanza»;
  - «hirió al cadete» o «escapó del cadete».
- **Para el cartel:** cada noticia tuya suma a la fama que después calcula el cartel.

### El primer periódico (a bordo de la Tortuga)
- **Titular:** «Escándalo en Shells Town: destrozan la estatua del capitán Brisco el día de su inauguración». Debajo: «Un joven desconocido y su cómplice escapan en un mercante. El cadete D. Severin, herido en su orgullo, jura atraparlos».
- **Rumor:** uno que revela Orange Town o Villa Syrup en el mapa.
- **Mundo:** la ola de piratas nuevos desde la ejecución del Rey de los Piratas.
- **Reacciones:** Quill lo lee por encima de tu hombro («¿Un joven desconocido? Qué modestos») y tu compañero comenta según quién sea.

## 3. Orden de construcción
1. **Datos de islas y vista del East Blue,** con estados y ruta.
2. **La escena de Quill y la carta,** con su tiza.
3. **El periódico:** News Coo, portada, archivo y las primeras 20 a 30 noticias.
4. **Vista del mundo completa.**
5. **Pruebas y entrega:** el juego entero y la escena suelta «A bordo de la Tortuga: la carta y el primer periódico».

## Lo que necesito del autor
- **La posición de los cuatro Blues**, si la tenés clara; si no, la verifico.
- **¿Te cierra la escena de la carta,** con las dos cartas comparadas?
- **¿La pestaña «Periódicos» en el diario,** o preferís que se guarden en la bolsa?
