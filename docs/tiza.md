# Escenas en tiza: rediseño

Las escenas en tiza son las intros y los cortes entre momentos: la intro de Kalé, la partida, la noche en el mar, la llegada a Shells Town, la huida y el fin del Acto 1. Según la devolución del autor, todas se ven mal: partes sobrepuestas que no encajan.

Prototipo con cuatro escenas rehechas, al lado de cómo se ven hoy: https://claude.ai/artifact/TcaskzNXhsWwgRYH6uG71t

## Diagnóstico (11 escenas revisadas)
1. **Nada tapa a nada.** Las líneas de lo que está detrás atraviesan lo que está delante: la loma de Shells Town pasa por dentro de las casas, la isla de Goa cruza el arco, el mástil corta las velas. Todo parece transparente y encimado.
2. **Cosas flotando.** Las casas de Kalé están pegadas encima de la isla como calcomanías. El muelle y la base de la huida cuelgan en el aire. La isla de la partida tiene un muelle que la atraviesa.
3. **Escalas sin criterio.** Una persona es casi tan alta como una casa, el barco del fondo es más grande que la isla de delante y el sol se sienta encima de la loma.
4. **Figuras de palitos.** No combinan con los barcos y las casas, que tienen sombreado. Además no se distingue quién es quién.
5. **Sin foco.** Muchos elementos chicos y dispersos, con mucho vacío entre ellos. El ojo no sabe dónde mirar.
6. **Detalles que confunden:** dos ventanas superpuestas en la casa, humo hecho de garabatos y la rosa de los vientos suelta en el mar.

## Reglas nuevas
### Composición
- **Un foco por escena,** que ocupe entre el 40 y el 60 % del ancho. Como mucho, dos elementos secundarios.
- **Horizonte fijo** entre el 62 y el 68 % de la altura, siempre recto. Cielo arriba; mar o tierra abajo.
- **Profundidad en tres planos:** el fondo (horizonte, islas lejanas, astros), el medio (el foco) y el frente (muelle, playa o figuras, más grandes y cortados por el borde si hace falta).
- **Escala coherente dentro de cada plano.** Una persona mide alrededor de 2/3 de una puerta, y el barco del frente es más grande que el del fondo.

### Dibujo
- **Lo de delante tapa lo de detrás.** Cada forma cerrada borra la pizarra en su interior antes de dibujarse. Es la regla que más cambia el resultado.
- **Todo apoya en algo:** las casas y los árboles sobre el contorno real de la isla, los barcos en la línea del agua y las personas en el suelo o en la cubierta. Solo flotan las aves, los astros y el humo.
- **Figuras con volumen:**
  - una silueta reconocible: cabeza, torso relleno, brazos y piernas gruesos;
  - cada personaje con su seña: la Medusa Gris con capucha y capa oscura, Severin con la gorra azul de la Marina, Marla con moño y Corso más pequeño;
  - el protagonista, sin rasgos, para que sirva a cualquier jugador.
- **Tres rellenos y nada más:**
  - rayado para lo sólido (tierra, cascos, ropa);
  - polvo para lo suave (velas, astros, luces);
  - rayado denso para lo oscuro (el barco de Dorne, la capa de la Medusa).
- **Color con significado:**
  - blanco para todo;
  - amarillo para la luz (faro, ventanas, sol, farol);
  - rojo para el peligro (la bandera y la medusa de Dorne);
  - azul para la Marina.
  - Nunca dos colores en el mismo objeto.

### Ritmo
- **El dibujo cuenta en orden:** primero el fondo (horizonte, astros), después el foco, después el frente y al final los toques de color.
- **Duración:** el dibujo tarda unos 3,5 segundos; después aparece el texto.
- **Vida al terminar:** el mar se mueve apenas y la cámara se acerca muy despacio (un 3 % en 9 segundos), sin distraer.

## Cambios técnicos (cuando se apruebe)
- **`tiza.js` gana:**
  - formas cerradas que borran lo de detrás;
  - figuras con volumen y poses (quieto, saluda, señala, corre, salta) y señas (capucha, capa, gorra, moño, pañuelo);
  - barcos con casco, velas hinchadas, jarcia y bandera;
  - islas con contorno y una función para apoyar cosas encima;
  - casas, faro, luna, sol y mar.
- **Ya probado en el prototipo:** todas esas piezas funcionan en las cuatro escenas.
- **Cada escena se reescribe** con las piezas nuevas siguiendo el guion de abajo.
- **Prueba:** se renderizan todas, terminadas y a mitad del dibujo, y se revisan una por una antes de entregar.

## Guion escena por escena
| Escena | Foco | Fondo | Frente | Texto (el actual) |
|---|---|---|---|---|
| **Kalé** (intro 1) | La isla entera, grande y centrada: colinas, casas en el contorno, el ancla y el faro con su haz | Horizonte, gaviotas y una rosa de los vientos chica en el cielo, como en una carta | Mar y un bote de pesca | «Kalé. Una isla pequeña del East Blue que no sale en ningún mapa.» |
| **La casa** (intro 2) | La casa del tejado de paja, grande, con humo que sube en espiral | Colina y cielo | Marla en la puerta (moño) y el cerco | «Vives con tu madre, Marla...» |
| **Corso** (intro 3) | Tú y Corso de espaldas en el muelle; Corso señala el mar | Sol bajo sobre el horizonte | Tablas del muelle | «Y con Corso, tu hermano pequeño...» |
| **El padre** (intro 4) | El marco vacío sobre la cómoda, grande | Una ventana con el mar y un barco que se aleja | Huellas en el suelo que van hacia la puerta | «De tu padre solo sabes una cosa...» |
| **El barco negro** (intro 5) | El barco de Dorne, oscuro, con la medusa roja en la vela | Luna y estrellas | El muelle de Kalé con un farol y tu silueta mirando | «Tienes diecisiete años...» |
| **La partida** | La Corneja alejándose, con el forastero encapuchado al timón | Kalé al fondo, con el faro encendido | El muelle; Corso saluda (o te pide la promesa) | El texto actual de la partida |
| **La noche en el mar** | La Corneja pequeña bajo una luna enorme y su reflejo | Estrellas | Olas grandes; la brújula temblando, si la llevas | El texto actual de la noche |
| **Shells Town** | La loma con la base de la Marina y la bandera azul | El sol saliendo detrás de la loma | La cala: el bote, la Medusa Gris y tú, señalando el pueblo | «Al amanecer, la Medusa Gris remó contigo...» |
| **La huida** | La Tortuga Parda soltando amarras, con tú y tu compañero en la borda | La base y la loma | El muelle con Severin, la gorra azul, señalando | «La Tortuga Parda salió del puerto...» |
| **Rumbo a Goa** (fin del Acto 1) | La Tortuga en mar abierto; tú y tu compañero sentados en cubierta, de espaldas | El sol bajo y, lejísimos, el humo de la Terminal Gris | La cubierta (barandilla y cuerdas) | El texto actual del final |
| **Loguetown** (Acto 3) | La ciudad con el cadalso en la plaza | El faro y el sol | El puerto con barcos | Se escribe al llegar |

Escenas nuevas que aparecerán con lo que sigue:
- **La carta náutica:** la carta extendida sobre la mesa de Quill. Falta Kalé, y tu dedo marca a lápiz dónde debería estar.
- **El primer periódico:** el News Coo posado en la barandilla con el diario en el pico.
- **Llegada a Goa:** la ciudad alta, la muralla y, al pie, la Terminal Gris humeando.

## Lo que necesito del autor
- ¿Te cierra el estilo del prototipo?
- ¿Algo que cambiar? Por ejemplo: más o menos color, figuras más detalladas o menos rayado.
- Con el visto bueno, rehago las 11 escenas siguiendo estas reglas.
