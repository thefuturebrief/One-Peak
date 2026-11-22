# Herramientas de armado

Scripts que generaron los recursos de `assets/`. Se corren desde una carpeta que tenga un clon parcial del
Universal LPC Spritesheet Character Generator en `lpc/` y la lista de archivos del repositorio en `lpc-files.txt`.

- `lpc-chars-vecinos.js`: los vecinos de Shells Town (pescador, panadera, anciana, herrero, comerciante, moza, estibador).
- `lpc-chars-goa.js`: la gente de Goa: 15 personajes con nombre (Ama Sel, Vardán, el marqués, Duval, Fina, Isolda, Teo, Bram, la Abuela Coque, los Gorriones, Mola, Ferro y Madame Lis) y 43 variantes por clase (nobles, Guardia Real, criados, mercaderes, marineros, gente de la Terminal y críos), armadas con una semilla fija. Se cargan al llegar a la isla.
- `goa_plano.py`: genera `islas/goa.json` (barrios, calles, 54 edificios con 19 interiores, puestos y objetos). Se corre desde `docs/juego`.
- `lpc-chars-shells2.js`: los 16 diseños propios de Shells Town que reemplazan a los que repetían sprites de Kalé (ids `s_*`: Pipo, Lalo, Marta, Amaro, Celes, la marinera, Bruto, Pardo, Ruiz, cinco marines, Clara y Goyo).
- `lpc-chars-shells.js`: los personajes de Shells Town (Rufo, Iria, Tobi, Severin, Brisco, Quill). Se arman igual, con `CHARS=./lpc-chars-shells.js node lpc-build2.js`.
- `lpc-chars.js` y `lpc-build2.js`: componen los personajes fijos (`assets/personajes/*.png`) con todas las animaciones (caminar, tajo, estocada, disparo y caída) en una sola hoja. Las capas `code:` (gorra y cuello de la Marina) se dibujan sobre la cabeza de cada cuadro. `lpc-build.js` es la versión vieja, solo caminar.
- `prep_armas2.py`: arma un atlas por tipo de arma (`assets/armas/<tipo>.png`) en su tamaño nativo (64, 128 o 192), con todas las animaciones, y el índice `armas.json`. `prep_armas.py` es la versión vieja (dos atlas por arma, delante y detrás).
- El sonido no usa archivos: `audio.js` lo genera en el navegador.
- `prep_catalogo.py`: arma el catálogo de personalización (`assets/lpc/`), con las capas sueltas (cada una con sus cinco animaciones), las paletas y los tonos de piel y pelo mezclados.

- `galeria.py`: arma las imágenes de la Armería (cada arma LPC sobre el grumete, quieta y atacando). Necesita `wpick.txt` con la lista de archivos de armas.

## Pruebas (`pruebas/`)
Necesitan el juego servido en local: `cd docs/juego && python3 -m http.server 8765`.

- **`shells2-test.js <rufo|nerea|niklas>`:** Shells Town entero con ese compañero. Con `PERDER=1` pierde la pelea con Severin.
- **`tapados.js [shells|kale|goa]`:** a todas las horas, avisa si un mueble, puesto o edificio tapa a alguien, si alguien pisa un mueble o si dos personas quedan una encima de otra.
- **`hueco.js <isla> "id:edificio:x,y" ...`:** busca el sitio libre más cercano a ese punto de la planta donde la persona no quede tapada. `edificio` puede ser `town`.
- **`escenas-test.js [ids]`:** abre cada escena suelta por enlace y comprueba que arranca sin errores y sin tocar el guardado.

