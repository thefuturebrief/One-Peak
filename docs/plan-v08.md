# Versión 0.8 en adelante: el viaje pirata

Plan de trabajo. Cada fase se cierra con su prueba antes de pasar a la siguiente.

## Lo que ya está decidido

### Historia
- **Kalé fue la introducción.** La historia pasa a ser la nuestra: el viaje pirata, los rivales, los conflictos de cada isla y los compañeros que se suman, a un ritmo que no regale nada.
- **El padre atraviesa toda la historia, pero en segundo plano.** Aparece alguna vez en el medio y recién se vuelve central cerca del final.

### Caminos y ruta
- **Primero se hace solo el camino pirata.** El marine se hace después, si hace falta. Elegir la Marina sigue terminando en "Fin del Acto 0".
- **Ruta:** una parada corta, después Goa, después Loguetown y recién ahí la Grand Line.

### Tripulación
- **Compañeros:** en la parada corta conocés a varios candidatos y al final de ese arco eliges uno. En Loguetown se suma el tercero (contándote a vos).
- **El nombre de la tripulación** lo eliges con Corso en el desayuno (hecho).
- **La bandera** se diseña más adelante: símbolo, colores y texto, al tener barco.

### El forastero
- **Es el Cuervo.** Su nombre real queda en secreto hasta un evento lejano.

### Loguetown y las frutas
- **La subasta** es clandestina, en el sótano de una taberna o tras una puerta de callejón.
- **Tu rival, un recluta de la Marina,** se cuela encapuchado.
- **Se subastan tres frutas,** sacadas al azar de un catálogo de 20 a 30. Se ve el diseño, nunca el nombre.
- **El cierre** es una pelea con un usuario de fruta.

### Otros sistemas
- **Periódico** que llega con una gaviota mensajera, una vez por día. Trae noticias que influyen en el juego.
- **Primer cartel de recompensa** después de Loguetown. Depende de lo que hayas decidido en las tres islas.
- **Mapa del mundo** con todas las islas como siluetas sin descubrir. Es el mapa de todo el juego.

## Propuestas (abiertas a discusión)

### La parada corta
La recomendación es **Shells Town**.
- El Cuervo te deja en una cala de contrabandistas cerca de la ciudad. Un barco como el suyo no entra a un puerto de la Marina.
- **Es el Acto 1:**
  - candidatos a compañero;
  - tu primer bote;
  - el mapa.
- **Siembra al rival:** lo ves por primera vez como cadete de la base.
- **El rival crece de isla en isla:** se lo cruza en Shells Town, después en Goa, y en Loguetown entra encapuchado a la subasta.
- **Alternativas:**
  - una isla propia, con libertad total;
  - Villa Foosha, que queda en la misma isla que Goa, así que no sería una parada aparte.

### Los actos
| Acto | Isla | Qué se consigue |
|---|---|---|
| 1 | Shells Town | primer compañero, bote, mapa |
| 2 | Goa y la Terminal Gris | Ama Sel (la pista del Cuervo), el conflicto con la ciudad alta, el rumor de la subasta |
| 3 | Loguetown | subasta, fruta, pelea con el usuario, tercer miembro, primer cartel al salir |

El bote del Acto 1 no cruza Reverse Mountain. En Loguetown hace falta un barco de verdad, o un motivo para conseguirlo.

### Frutas
- **Cuándo comerla:** se elige entre las tres en medio del caos y se come cuando quieras, desde la bolsa.
  - Si la comes en calma, en el bote, de noche y con tus compañeros, hay una escena propia.
  - Si vas perdiendo la pelea con el usuario, aparece la opción de comerla ahí, como último recurso.
- **Las dos que no elegiste no desaparecen:**
  - una se la lleva tu rival para la Marina;
  - la otra se pierde en el caos y reaparece más adelante en manos de otro personaje.
- **La plata:**
  - no pagas, te cuelas;
  - el asalto del usuario de fruta desata el caos;
  - una fruta no se puede vender en el East Blue: nadie paga esa cifra sin que se entere la Marina.
- **Catálogo:**
  - unas 24 frutas, del canon y originales, cada una con tipo, diseño, descripción y tres técnicas iniciales;
  - las técnicas son datos sobre un sistema común (proyectil, área, transformación, mejora), así cada fruta no exige código propio.
  - Los diseños se presentan en una hoja para aprobar antes de entrar al juego.

### Periódico
- Llega cada mañana con dos a cuatro noticias armadas con el estado del mundo.
- Algunas noticias tienen efecto:
  - precios;
  - patrullas;
  - rumores que revelan islas en el mapa.

### Recompensa
- La fama se empieza a registrar ya: peleas, a quién ayudaste, qué robaste, a quién dejaste ir.
- El cartel de después de Loguetown se calcula con todo eso.

## Fases de la versión 0.8
1. **Barco y detalles (hecho):**
   - la cubierta de la Corneja y la Gaviota detallada;
   - la escotilla ya no traba;
   - cosas para mirar;
   - el nombre de la tripulación con Corso;
   - el Cuervo sin nombre.
2. **Motor de islas:**
   - cada isla con su plano;
   - el juego carga la que toca;
   - se puede guardar en el mar y en otras islas.
   - Prueba: Kalé igual que hoy, guardar y continuar a bordo.
3. **Mapa del mundo:**
   - un archivo de islas con posición y mar, según `docs/islas.md`;
   - la geografía del canon (Red Line, Grand Line, Calm Belts, los cuatro Blues);
   - las islas en tres estados: silueta, descubierta y visitada.
   - El dibujo, último y con su propia revisión.
4. **Periódico diario.**
5. **Catálogo de frutas:** datos y hoja de diseños para aprobar. El sistema de comer y usar entra con Loguetown.
6. **La parada corta**, cuando la isla esté decidida.

## Lo que falta decidir
- La parada corta: ¿Shells Town, una isla propia u otra?
- La Terminal Gris: ¿antes o después del incendio del canon? Depende del año en que transcurre el juego.
- El apodo del forastero: ¿se queda "el Cuervo"? Encaja con su barco, la Corneja, y con la pista que ya te da.
