# Versión 0.7: zarpar

Plan de trabajo. Cada fase se cierra con su prueba antes de pasar a la siguiente.

**Estado:**
- las cinco fases están hechas y probadas;
- queda para la versión 0.8: Goa (Terminal Gris) y Loguetown como Acto 1.

## Decisiones previas

- **Armas para todos.** Se usan las 27 armas de LPC, más la pistola y el mosquete dibujados por código. Se reparten en tres grupos:
  - **Comunes**, las que lleva cualquiera: daga, espada corta, sable, lanza, hacha de leñador, martillo, garrote, arco, tirachinas, pistola y mosquete.
  - **De oficio**, las de quien sabe usarlas: mandoble, maza, cimitarra, estoque, ballesta, alabarda y pico.
  - **De personaje**, las que lleva gente importante: katana, guadaña, tridente, lanza larga, lanza dragón, mangual, hacha de guerra, mandoble fino, látigo y bumerán.
- **Para empezar se elige entre las más distintas:** sable, mandoble, espada corta, martillo, hacha de leñador, lanza, arco, daga o puños.
- **Quién lleva qué en Kalé:**
  - Marines rasos: espada corta, pistola o mosquete.
  - La teniente: estoque.
  - Dorne: guadaña, la "garra" que le da el apodo.
  - Sus piratas: cimitarra y garrote.
  - El forastero: katana a la espalda, sin desenvainar nunca.
  - Brin: un remo.
  - Yago: las de madera.
- **Por defecto las armas se ven con sus colores originales.** Solo las que tienen nombre llevan un color propio, aplicado con cuidado para no ensuciar los filos.
- **La isla después de Kalé**, siempre canon:
  - **Camino pirata: Reino de Goa (isla Dawn).** Es la siguiente en la ruta del East Blue, y la Terminal Gris es un buen lugar para que un novato sin nada empiece desde abajo. El forastero te deja ahí porque tiene asuntos pendientes.
  - **Camino marine: Loguetown.** La teniente es de ahí y su barco vuelve a la base.
  - Las dos islas se construyen en la versión siguiente, cada una con su plano, como Kalé. Esta versión llega hasta que se ven en el horizonte.

## Fases

### 1. Armas
- Un atlas por arma, con todas sus animaciones (caminar, tajo, estocada, disparo) en su tamaño original. Se cargan solo cuando alguien las lleva.
- Un catálogo con pieza, grupo, grado y nombre.
- Las opciones de pelea dependen de la familia del arma:
  - corte, golpe, asta, distancia y fuego;
  - el arco dispara;
  - el martillo y el hacha aturden;
  - la lanza mantiene a distancia.
- Reparto entre la gente según lo de arriba.
- **Prueba:** cada arma se dibuja quieta y atacando en el juego, sin errores, y el duelo y la plaza se juegan con las nuevas.

### 2. Kalé más vivo y economía
- **Berries:** vuelve el monedero. Empiezas con 300 ฿.
- **Tiendas:**
  - Gaspar: cuerda, anzuelos, vendas, una daga y un garrote.
  - Nell: pan, que da aguante para la próxima pelea.
  - Mara: un guiso.
  - El doctor: emulsión.
  - Gaspar también te compra cosas.
- **Encargos chicos:**
  - Rosa te pide llevarle pescado a Mara.
  - Nell, pan al doctor.
  - Gaspar perdió su catalejo en la playa.
  - Brin paga por ayudar con las redes.
- **El faro abre de día:** libros viejos, el diario del farero y Lin estudiando.
- **El destacamento:** la sala de guardia se puede visitar de día. Hay un sargento y un tablón.
- **Rangos visibles en la Marina:**
  - marinero: gorra con banda azul;
  - sargento: banda dorada y pañuelo rojo;
  - teniente: abrigo sobre los hombros;
  - capitán: traje blanco y abrigo.
- **Prueba:** comprar, vender y completar cada encargo; entrar y salir del faro y del destacamento.

### 3. Barcos a los que se sube
- Cada barco tiene una cubierta (dibujada a medida, con mar alrededor) y un camarote (armado con el mismo sistema que las casas).
- **La Corneja, la balandra del forastero:** amarrada en el muelle desde la tarde. Se sube por la pasarela. Antes de decidir, él te para.
- **El barco de la Marina:** amarrado en la punta del muelle después de los refuerzos. Tiene marineros en cubierta.
- **El barco negro** queda fondeado lejos: sin bote no se llega.
- **Prueba:** subir, recorrer y bajar de cada barco, sin quedar atrapado.

### 4. Zarpar
- **Tiza mejor en todas las escenas:**
  - sombreado a rayas, trazos gruesos y finos, borrones;
  - un poco de tiza de color para lo importante;
  - escenas rehechas: la introducción, la partida, el mar abierto y la llegada.
- **Camino pirata:**
  1. Tiza de la partida.
  2. Despiertas en el camarote de La Corneja, en alta mar. El cuarto se mece.
  3. Se puede investigar: la carta náutica del East Blue (se guarda en la bolsa), una foto vieja (pista sobre tu padre), el cuaderno de bitácora y una botella.
  4. Entra el forastero y hay una conversación larga. Habla de tu padre, de la brújula y del retrato si los tienes, de Dorne y de quién es él. Al final te dice que tiene asuntos pendientes, que no lo vas a ver en un tiempo y que te deja en Goa con un nombre a quien buscar.
  5. Subes a cubierta, Goa aparece en el horizonte y viene la tiza de la llegada.
- **Camino marine:**
  1. Despiertas en las literas.
  2. Hay un uniforme sobre tu cama: al ponértelo, tu personaje cambia de ropa.
  3. Entra la teniente. Habla de la Marina, de un expediente con tu apellido en Loguetown y de lo que te espera.
  4. Cubierta y llegada a Loguetown.
- **Prueba:** los dos caminos completos, del muelle a la llegada, sin errores.

### 5. Sonido y música
- **Generados en el navegador, sin archivos:**
  - de fondo: mar, viento, gaviotas de día, grillos de noche;
  - efectos: campana, puertas, golpes, tajos, haki, tiza, páginas, monedas;
  - temas cortos: Kalé de día, tensión en la plaza, noche y mar abierto.
- **Opciones:** música y efectos por separado.
- **Prueba:** que suene solo después del primer clic, que se pueda apagar y que no se acumulen sonidos.
