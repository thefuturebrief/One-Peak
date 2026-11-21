# Armas — plan

## Estado (v0.7)

Ya está en el juego (`docs/juego/armas.js`, atlas en `docs/juego/assets/armas/`, índice en `armas.json`):

- **Las 27 armas de LPC, en tres grupos:**
  - **comunes:** daga, espada corta, sable, lanza, hacha de leñador, martillo, garrote, arco, tirachinas, pistola y mosquete;
  - **de oficio:** mandoble, maza, cimitarra, estoque, ballesta, alabarda y pico;
  - **de personajes importantes:** katana, guadaña, tridente, lanza larga, lanza dragón, mangual, hacha de guerra, mandoble fino, látigo y bumerán.
- **Ocho iniciales**, las más distintas entre sí: sable, mandoble, espada corta, martillo, hacha, lanza, arco y daga. Cada una tiene su versión del padre y una de madera.
- **Armas de los NPC:**
  - marines: espada corta, pistola o mosquete;
  - piratas: cimitarra, garrote y otras;
  - Dorne: Colmillo Negro, una guadaña;
  - la teniente: estoque.
- **Dibujo:**
  - cada pieza en su tamaño nativo (64, 128 o 192), centrada;
  - recoloreado solo de la hoja;
  - armas de fuego dibujadas por código;
  - iconos para todas las formas.
- **En la pelea:**
  - el golpe depende del tipo, y si no, de la familia (corte, golpe, asta, distancia, fuego);
  - el arma de fuego dispara una vez y después se golpea con la culata.

Falta:
- armas con aura en el mundo;
- cuánto Haki aguanta cada grado;
- dos espadas a la vez.

## Qué ofrece LPC y qué no

LPC tiene capas de arma que encajan sobre el mismo cuerpo que ya usamos, con sus animaciones de ataque:

| Familia | Piezas en LPC | Animación del cuerpo |
|---|---|---|
| Espadas | arming, longsword, katana, saber, scimitar, rapier, dagger, glowsword | `slash`, `backslash`, `halfslash` |
| Contundentes | club, mace, flail, waraxe (hacha) | `slash` |
| Astas | spear, longspear, trident, halberd, dragonspear, scythe, cane | `thrust` |
| A distancia | bow, crossbow, slingshot, boomerang | `shoot` |

Algunas tienen versión *oversize*, con un arco de golpe grande, que sirve para los ataques especiales.

Lo que no hay:

- Armas de fuego: ni pistolas, ni mosquetes, ni cañones de mano.
- Llevar dos o tres espadas a la vez: una capa de arma va en una sola mano.

## Cómo se mezclan

1. **El cuerpo ya sabe atacar.** Hoy solo bajamos la hoja de caminar. Habría que bajar también `slash`, `thrust`, `shoot` y `hurt` de cada capa que ya usamos: cuerpo, cabeza, ropa y pelo. `componer()` arma cada animación igual que arma la de caminar. Pesa unas 4 veces más, pero se carga solo al entrar en pelea.

2. **Armas LPC: capa más paleta.** Cada tipo usa la pieza LPC más parecida y se recolorea igual que la ropa: hoja, guarda y empuñadura.
   - Con eso salen decenas de armas distintas sin dibujar nada.
   - Una katana de hoja negra (*kokutō*) es la misma katana con otra paleta.

3. **Armas de fuego dibujadas por código, sobre la pose de `shoot`.** La pose de disparar con arco ya tiene el brazo extendido. Sobre ella se dibuja una pistola o un mosquete con el mismo contorno y la misma luz que los objetos de los interiores. Al disparar: fogonazo, humo y retroceso.
   - Para saber dónde está la mano en cada cuadro no hace falta medir a ojo. Se saca solo de una capa LPC chica, como la daga: el centro de su empuñadura en cada cuadro es la mano.

4. **Las legendarias.** Lleva su paleta única y un aura dibujada por código: un brillo leve, o chispas negras cuando hay Haki de armadura. El nombre aparece en la interfaz. No se dibuja un sprite nuevo para cada una.

## Datos de cada arma

```js
{ id: 'kurenai', nombre: 'Kurenai', tipo: 'katana', grado: 'ryo', paleta: {...}, aura: 'roja', historia: '...' }
```

Los grados son los del mundo: sin grado, Wazamono, Ryō Wazamono, Ō Wazamono y Saijō Ō Wazamono.

**Propuesta: las espadas con nombre del canon no se poseen.** Yoru, Wadō Ichimonji o Shūsui tienen dueño y forman parte de la trama, que no tocamos. Se las puede ver, se puede oír hablar de ellas, pero las que consigue el jugador son originales y siguen las reglas del mundo.

## Qué significa el grado en el juego

Si el grado fuera "más daño", contradiría al propio One Piece, donde el arma pesa menos que quien la empuña. Mi propuesta:

- **El tipo** decide el estilo, es decir, qué opciones de instinto aparecen:
  - la espada corta;
  - la lanza mantiene a distancia;
  - el martillo rompe la guardia;
  - la pistola tiene un solo disparo antes de recargar.
- **El grado** decide la resistencia y el filo:
  - si el arma se rompe o se mella al chocar con otra mejor;
  - si corta lo que una normal no corta, como el acero o la piedra;
  - y, más adelante, cuánto Haki aguanta sin quebrarse.
- **El portador** sigue siendo lo que más pesa en la tirada.

## Orden de trabajo

1. Bajar `slash`, `thrust`, `shoot` y `hurt` de las capas actuales y extender `componer()`.
2. Seis tipos LPC con paletas: espada, katana, daga, lanza, hacha y maza. Integrarlos en la pelea de instinto.
3. Pistola y mosquete por código, con anclaje de mano automático.
4. Grados, armas con nombre y aura.
5. Más adelante, y solo si hace falta: dos espadas. El santōryū no se puede hacer limpio con LPC; la espada en la boca habría que dibujarla aparte.

## Catálogo ordenado (v0.9, para la armería de Goa)
- **Familias:**
  - corte: daga, espada corta, sable, cimitarra, estoque, mandoble;
  - golpe: garrote, martillo, maza, hacha;
  - asta: lanza, bastón, alabarda;
  - a distancia: arco, ballesta, tirachinas;
  - fuego: pistola, mosquete.
- **Calidad de forja** para las armas sin grado (comunes y de oficio):
  - **tosca**: hoja oxidada, precio ×0,6, se mella;
  - **corriente**: ×1;
  - **fina**: acero pulido, ×2,5, aguanta y corta más.
- **Grado** (Wazamono y superiores): solo armas con nombre. Una en la vitrina de la armería de Goa, como meta.
- **No se venden:** las armas de personaje (katana, guadaña, tridente, lanza larga, lanza dragón, mangual, hacha de guerra, mandoble fino, látigo, bumerán) y las legendarias.
- **Armas de fuego:** un solo diseño de pistola y uno de mosquete para todo el mundo, piratas y marines. Se dibujan por código:
  - al disparar, en la mano según el cuadro, con retroceso, fogonazo y humo;
  - al caminar, la pistola en una funda en la cadera y el mosquete colgado a la espalda.
