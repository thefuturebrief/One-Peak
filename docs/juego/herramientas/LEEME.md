# Herramientas de armado

Scripts que generaron los recursos de `assets/`. Se corren desde una carpeta que tenga un clon parcial del
Universal LPC Spritesheet Character Generator en `lpc/` y la lista de archivos del repositorio en `lpc-files.txt`.

- `lpc-chars.js` y `lpc-build2.js`: componen los personajes fijos (`assets/personajes/*.png`) con todas las animaciones (caminar, tajo, estocada, disparo y caída) en una sola hoja. Las capas `code:` (gorra y cuello de la Marina) se dibujan sobre la cabeza de cada cuadro. `lpc-build.js` es la versión vieja, solo caminar.
- `prep_armas.py`: arma los atlas de armas (`assets/armas/`), delante y detrás del cuerpo.
- `prep_catalogo.py`: arma el catálogo de personalización (`assets/lpc/`), con las capas sueltas (cada una con sus cinco animaciones), las paletas y los tonos de piel y pelo mezclados.

- `galeria.py`: arma las imágenes de la Armería (cada arma LPC sobre el grumete, quieta y atacando). Necesita `wpick.txt` con la lista de archivos de armas.
