# Armas — plan

## Estado

Ya está en el juego (`docs/juego/armas.js`, atlas en `docs/juego/assets/armas/`):

- **Catálogo con grados.** Veinte armas originales con nombre, más el arma de tu padre y una de madera para cada tipo.
- **Siete tipos con piezas LPC recoloreadas:**
  - katana, con la forma del sable curvo, porque la katana de LPC es diminuta;
  - espada, estoque, daga, lanza, hacha y maza.
- **Pistola y mosquete dibujados por código.** En la cadera al caminar; con el brazo extendido, fogonazo y humo en la pose de disparar.
- **Iconos dibujados por código** para la bolsa y los avisos.
- **En la pelea, cada tipo cambia la opción principal y la animación:** la lanza mantiene a distancia, el hacha y la maza aturden, la daga arriesga más.

Falta: armas con aura en el mundo, cuánto Haki aguanta cada grado, y dos espadas a la vez.

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
