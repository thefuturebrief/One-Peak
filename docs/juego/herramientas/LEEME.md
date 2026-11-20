# Herramientas de armado

Scripts que generaron los recursos de `assets/`. Se corren desde una carpeta que tenga un clon parcial del
Universal LPC Spritesheet Character Generator en `lpc/` y la lista de archivos del repositorio en `lpc-files.txt`.

- `lpc-chars-vecinos.js`: los vecinos de Shells Town (pescador, panadera, anciana, herrero, comerciante, moza, estibador).
- `lpc-chars-shells.js`: los personajes de Shells Town (Rufo, Iria, Tobi, Severin, Brisco, Quill). Se arman igual, con `CHARS=./lpc-chars-shells.js node lpc-build2.js`.
- `lpc-chars.js` y `lpc-build2.js`: componen los personajes fijos (`assets/personajes/*.png`) con todas las animaciones (caminar, tajo, estocada, disparo y caída) en una sola hoja. Las capas `code:` (gorra y cuello de la Marina) se dibujan sobre la cabeza de cada cuadro. `lpc-build.js` es la versión vieja, solo caminar.
- `prep_armas2.py`: arma un atlas por tipo de arma (`assets/armas/<tipo>.png`) en su tamaño nativo (64, 128 o 192), con todas las animaciones, y el índice `armas.json`. `prep_armas.py` es la versión vieja (dos atlas por arma, delante y detrás).
- El sonido no usa archivos: `audio.js` lo genera en el navegador.
- `prep_catalogo.py`: arma el catálogo de personalización (`assets/lpc/`), con las capas sueltas (cada una con sus cinco animaciones), las paletas y los tonos de piel y pelo mezclados.

- `galeria.py`: arma las imágenes de la Armería (cada arma LPC sobre el grumete, quieta y atacando). Necesita `wpick.txt` con la lista de archivos de armas.
