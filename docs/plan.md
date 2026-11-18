# Plan: qué mejorar y qué falta crear

Documento vivo. Complementa a `decisiones.md`: ahí está lo decidido; acá, el camino por delante. Se actualiza cada vez que cerramos un tema.

## 1. Mejorar lo que ya existe

### Personajes
- Cerrar la proporción (A, B o C) y pasar todo el elenco a la plantilla nueva.
- Ampliar las piezas: más peinados (trenzas, rastas, cresta, melena atada), más prendas (camisa abierta, kimono, gabardina, chaqueta corta, harapos), más calzado y más formas de cara.
- Paleta limitada por personaje, de cuatro a seis rampas, para que el conjunto no se vuelva ruidoso.
- Animaciones mínimas por personaje: caminar en cuatro direcciones, respirar, hablar, golpear, recibir un golpe y caer. Los personajes importantes tienen además un gesto propio.
- Retratos para diálogo hechos con el mismo sistema que el sprite, para que coincidan siempre.

### Mundo
- Más vida en la isla: puestos de mercado, gente sentada, perros y gatos, carretillas, redes tendidas, chicos jugando.
- Sombras proyectadas que cambian con la hora del día.
- Transiciones más suaves entre casillas (arena con pasto, camino con pasto).
- Interiores: taberna, casa del protagonista, astillero.

### Barco
- Verlo en las cuatro direcciones y navegando, con las velas desplegadas.
- Sistema de piezas: casco por tamaño, colores, velas, palos, castillo, cañones y mascarón.

### Interfaz
- Estados de botón (normal, encima, presionado, apagado), transiciones animadas y sonido.
- Bitácora, mapa y gente rediseñados con la interfaz nueva.

### Combate
- Animaciones de golpe propias por complexión.
- Efectos del kit (grieta, fuego, onda, etc.) con su escala de 1 a 5.
- Definir qué datos usa la simulación para decidir cada acción.

## 2. Diseñar ahora

### Prólogo jugable
Cinco escenas de infancia y adolescencia, comprimidas. Definen familia, oficio (dato de historia y rol a bordo), sueño y vínculos que atraviesan la partida. Terminan en "listo para zarpar" o "ya zarpaste".

### Simulación del pasado
Qué se simula antes de empezar (cuántos años, qué eventos), cómo se guarda y cómo se convierte en historias que los NPCs cuentan. Debe producir, como mínimo, la familia del jugador, los vecinos de su isla y un puñado de leyendas del East Blue.

### Facciones del East Blue
Marina (destacamentos, rangos, corrupción), piratas (tripulaciones chicas que van y vienen), cazarrecompensas, comerciantes y gente común. Cada una con objetivos, territorio y cómo reacciona al jugador.

### Economía
Berries, precios por isla, trabajos puntuales, deudas, compraventa de objetos raros (mapas, frutas) y el costo de un barco.

## 3. Ampliar el juego

- **Reputación y recompensa:** cómo el Gobierno decide que sos un criminal y cuánto vale tu cabeza, y cómo eso cambia el trato de cada facción.
- **Tripulación:** reclutar, lealtad, roles a bordo (navegante, cocinero, médico, carpintero, músico, arqueólogo, combatiente), conflictos internos y sueños propios de cada tripulante.
- **Navegación:** rutas, clima, eventos en el mar, provisiones y llegada a islas nuevas.
- **Primeras islas del East Blue:** con sus nombres oficiales y nuestra interpretación visual, más islas originales generadas.
- **Escalas de poder:** niveles por mar, frutas por dominio y afinidad, Haki.

## 4. Orden propuesto

1. Cerrar el estilo de personajes (iteración 4) y llevar la plantilla al elenco completo.
2. Prólogo: diseño en papel y una maqueta jugable corta.
3. Simulación del pasado y facciones del East Blue, en papel.
4. Primer prototipo jugable de una isla completa: caminar, hablar, un encuentro, una decisión importante, zarpar.
5. Navegación y segunda isla.

## 5. Preguntas abiertas

- ¿Proporción A, B o C?
- ¿El protagonista puede ser de cualquier complexión desde el inicio, o algunas (gigante, diminuto) dependen de la raza?
- ¿Cuántas escenas tiene el prólogo y cuánto dura en tiempo real?
