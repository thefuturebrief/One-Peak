# Acto 1: Shells Town

Diseño de la primera isla después de Kalé. Camino pirata.

**Estado:**
- hecho en la versión 0.8 (`docs/juego/shells.js` e `islas/shells.json`);
- probado de principio a fin con los tres compañeros (`shells-test.js`);
- el guardado funciona en la isla.

## Decisiones de fondo

### El forastero: la Medusa Gris
- **Así lo llaman en el mar.** Su nombre real sigue en secreto.
- **La pista sin decirla:**
  - el barco de Dorne lleva una medusa en la bandera;
  - la foto del baúl muestra a cinco hombres en una cubierta;
  - el forastero se hace llamar la Medusa Gris.

  El jugador puede sospechar que él fue el capitán de ese barco y que Dorne se quedó con el barco y la bandera cuando la tripulación se rompió. Nadie lo confirma.
- **Su fruta, más adelante:** relacionada con la medusa (veneno o electricidad). Por ahora no se ve.

### La Terminal Gris
- **El juego transcurre después del incendio del canon.** Los sobrevivientes la reconstruyeron con lo que quedó, y la ciudad alta la quiere borrar otra vez. Las razones:
  - funciona sea cual sea el año exacto;
  - no recrea el incendio del canon;
  - da un conflicto con memoria, el rencor del fuego;
  - hace de Ama Sel una sobreviviente.

### Frutas: reglas de rareza
- **Probabilidad al sortear las tres frutas de la subasta:**

  | Tipo | Peso de cada fruta | Con un catálogo de 10 Paramecia, 6 Zoan, 4 Logia y 1 Zoan mítica |
  |---|---|---|
  | Paramecia | 1 | |
  | Zoan (común o prehistórica) | 1 | |
  | Logia | 0,35 | sale al menos una en ~22 % de las partidas |
  | Zoan mítica | 0,06 | sale en ~1 % de las partidas |

- **Logia al principio:** como nadie tiene Haki en el East Blue, una Logia sería casi invencible. Contrapesos:
  - recién aprendes a usarla en un momento clave;
  - al principio la intangibilidad cuesta aguante y no es automática (regla del juego, no del canon);
  - cada elemento tiene su debilidad;
  - algunos marines llevan armas de kairoseki.
- **Técnicas según el tipo:**
  - las Zoan no lanzan proyectiles: transformaciones, golpes, movilidad;
  - las Logia sí: elemento, intangibilidad, área;
  - las Paramecia, lo que pida cada una.
- **El momento de comerla:** en la subasta, por impulso, en medio del caos. No sabes usarla hasta la pelea final de Loguetown, donde se despierta y te salva.
- **Las otras dos frutas:**
  - una se la lleva tu rival para la Marina;
  - la otra se pierde y reaparece más adelante.

## Resumen del acto

La Medusa Gris te deja de madrugada en una cala, cerca de Shells Town. Esa mañana un pescador vio un barco negro en la cala, así que la Marina busca a un "pirata de la cala".

En la ciudad conocés a tres candidatos a compañero. Cada uno tiene un objeto que le confiscó la base. Eliges a uno, y al día siguiente, durante el desfile por la visita de un vicealmirante, se cuelan juntos en la base a recuperarlo.

Al salir por la muralla, un tropiezo dispara el cañón de saludo. La bala cruza la plaza y hace pedazos la estatua del comandante en el momento justo en que la destapan.

Sigue la huida:
1. tu rival, el cadete Severin, te cierra el paso: primera pelea;
2. carrera hasta el muelle;
3. pagas lo que tengas por el pasaje en un mercante que zarpa a Goa;
4. desde el muelle, el rival jura que te va a encontrar.

## Personajes

| Quién | Qué es | Detalle |
|---|---|---|
| **Cadete Darío Severin** | Rival, recluta de la Marina | Recto, orgulloso, buen espadachín (espada corta). Cree en las reglas porque vio lo que pasa sin ellas. Fue compañero de Tobi en la academia. |
| **Capitán Pelayo Brisco** | Jefe de la base | Vanidoso y ceremonioso. Mandó hacer una estatua suya para la visita del vicealmirante. No es cruel: es ridículo. |
| **Rufo Brasa** | Candidato: cocinero de la cantina El Caldero | Grandote, risa fácil, no soporta ver a nadie con hambre. Le confiscaron las cuchillas por darle un sartenazo a un marine que no quería pagar. Pelea con martillo de cocina. Sueña con un plato con algo de cada mar. |
| **Iria Vendaval** | Candidata: copista en la oficina de cartas de la base | Callada, rápida, lee el tiempo en las nubes. Le confiscaron la carta de su madre, que muestra una isla que no figura en ninguna carta oficial. Quiere encontrar esa isla. |
| **Tobías "Tobi" Garra** | Candidato: exrecluta | Lo echaron por insubordinación: defendió a un civil de un oficial. Pelea por apuestas en el Foso, junto a los almacenes del muelle. Le confiscaron la lanza de su padre. Conoce a Severin desde la academia. |
| **Capitana Hesper Quill** | Mercante de *La Tortuga Parda* | Zarpa a Goa el día del desfile al mediodía. Cobra caro y no pregunta. |
| **Doña Celes** | Dueña de la Posada La Concha | Cama por 20 ฿ y rumores gratis. |
| **Lalo** | Pescador | Vio el barco negro en la cala y se lo contó a toda la ciudad, cada vez más grande. |
| **Sargento Pardo y marines** | Guardia, puerta, patrullas | Llevan espada corta, pistola o mosquete. |

## Plano

Unas 64 × 44 casillas, como Kalé.

- **Sur: el puerto.**
  - muelle comercial con *La Tortuga Parda* amarrada;
  - mercado de pescado;
  - almacenes;
  - el Foso, un ring de arena detrás de los almacenes.
- **Centro: la plaza,** con la estatua del capitán Brisco tapada con una lona hasta el desfile, y el tablón de anuncios.
- **Norte, en alto: la base de la Marina.**
  - muralla de piedra con portón;
  - patio de armas;
  - cuartel entrable con varios cuartos: guardia, oficina de cartas, despacho del capitán, almacén de decomisos;
  - batería con cañones en la muralla que da a la plaza.
- **Oeste:** la cantina El Caldero y la Posada La Concha.
- **Este:** casas y la tienda.
- **Fuera de la ciudad, al suroeste:** la cala con rocas y una senda por la costa hasta la ciudad.

## Escenas

### Día 1
1. **La cala, de madrugada.** La Medusa Gris te lleva en el bote hasta la arena y se despide. Te da 150 ฿ y te dice: "Desde aquí salen mercantes a Goa. Busca a Ama Sel."
2. **La entrada a la ciudad.** Severin interroga a los recién llegados por lo del barco negro. Primer encuentro, sin pelea. Le puedes mentir, bromear o callarte, y él se queda con tu cara.
3. **La ciudad.**
   - Te enteras de la visita del vicealmirante, del desfile de mañana y de la estatua.
   - En el muelle, Quill cobra 300 ฿ por persona hasta Goa, al subir. Zarpa mañana a las 12.
4. **Los candidatos**, cada uno con un encargo que da plata y confianza:
   - **Rufo:** ayudar en la cantina (traer pescado del mercado, servir mesas);
   - **Iria:** llevar sus copias al tablón y encontrar su compás, perdido en la playa;
   - **Tobi:** pelear en el Foso; ganar paga bien.
5. **La elección.** Con confianza suficiente aparece "Vente conmigo. Mañana zarpo a Goa". Cuando uno acepta, los otros se despiden. Tu compañero propone recuperar su objeto durante el desfile, con la base medio vacía.
6. **La noche.** Posada (20 ฿) o la playa.

### Día 2
1. **A las 11, el desfile.** La gente va a la plaza.
2. **Cómo entran a la base**, según el compañero:
   - **Rufo** lleva el banquete por la puerta de la cocina;
   - **Iria** tiene pase de copista;
   - **Tobi** conoce un desagüe bajo la muralla.
3. **Dentro de la base:**
   - la llave del almacén está en el despacho;
   - el guardia de la puerta del despacho se duerme si no haces ruido;
   - recuperan el objeto en el almacén.
4. **La salida por la batería.**
   - Ya prendieron la mecha del cañón de saludo para las 12.
   - Tu compañero tropieza (cada uno a su manera) y el cañón gira.
   - **Escena:** la bala cruza la plaza y destroza la estatua justo cuando cae la lona.
   - Brisco grita "¡¡MI ESTATUA!!" y todos miran a la muralla.
5. **La pelea con Severin**, en la escalera del portón.
   - Si ganas, pasas.
   - Si pierdes, tu compañero lo derriba como mejor sabe.
   - En los dos casos, Severin se queda con tu cara.
6. **La huida al muelle.** Quill ya suelta amarras y pide todo lo que tengas: "Con la Marina detrás, el pasaje vale el doble". Si no alcanza: "Fregaréis la cubierta hasta Goa".
7. **El cierre.**
   - **Desde el muelle:** Severin promete encontrarte.
   - **Tiza:** el mercante rumbo a Goa.
   - Fin del Acto 1.

### Fama
Desde ahora se anota lo que hiciste:
- la estatua;
- la pelea con un cadete;
- a quién ayudaste.

Esto alimenta el periódico y el cartel de después de Loguetown.

## Pruebas
- **Recorrido con cada uno de los tres compañeros:**
  1. llegada;
  2. elección;
  3. desfile;
  4. cañonazo;
  5. pelea (ganada y perdida);
  6. huida;
  7. fin.
- **Guardar y continuar** en Shells Town en cada etapa.
- **Plano validado** con `docs/kale/validar.py`.
- **Kalé sigue igual:** toda la regresión de la versión 0.7.
