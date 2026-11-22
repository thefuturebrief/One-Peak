# Genera islas/goa.json: el Reino de Goa (Acto 2). Diseño en docs/goa.md; esquema en docs/goa-plano.png.
# Se corre desde docs/juego: python3 herramientas/goa_plano.py
import json

W, H = 112, 80
# ---------- interiores: piezas de planta reutilizables ----------
def tienda(w, h, muebles, nombre='Tienda', suelo='madera', puerta=None, ventanas=True):
    p = puerta if puerta is not None else w / 2 - .5
    return {'w': w, 'h': h, 'cuartos': [[nombre, 0, 0, w, h, suelo]], 'paredes': [], 'puertas': [[p, h, 'h', 1, 'calle']],
            'ventanas': [[1.5, 0, 'h', 1.5, 'N'], [w - 3, 0, 'h', 1.5, 'N']] if ventanas else [], 'muebles': muebles}

def dos(w, h, corte, a, b, muebles, sa='madera', sb='madera', paso=None):
    """Dos cuartos, uno al fondo (a) y otro delante (b) con la puerta a la calle."""
    px = paso if paso is not None else w - 2.5
    return {'w': w, 'h': h, 'cuartos': [[a, 0, 0, w, corte, sa], [b, 0, corte, w, h - corte, sb]], 'paredes': [[0, corte, w, corte]],
            'puertas': [[px, corte, 'h', 1, 'al fondo'], [w / 2 - .5, h, 'h', 1, 'calle']],
            'ventanas': [[1.5, 0, 'h', 1.5, 'N'], [w - 3.5, 0, 'h', 1.5, 'N']], 'muebles': muebles}

E = []  # edificios
def ed(id, n, x, y, w, d, techo, fachada, entra=None, **k):
    ext = {'x': x, 'y': y, 'w': w, 'd': d, 'techo': techo, 'fachada': fachada, 'puerta': k.pop('puerta', round(w / 2, 1))}
    ext.setdefault('ventanas', [round(w * .2, 1), round(w * .8, 1)])
    ext.update(k)
    if 'ventanas' in k: ext['ventanas'] = k['ventanas']
    b = {'id': id, 'n': n, 'entrable': entra is not None, 'ext': ext}
    if entra: b['int'] = entra
    E.append(b)

# ---------- Ciudad Alta (dentro de la muralla: x 4–66, y 1.5–24) ----------
mansion = {'w': 16, 'h': 11, 'cuartos': [
    ['Despacho del marqués', 0, 0, 5, 4.5, 'madera'], ['Salón de baile', 5, 0, 11, 6.5, 'piedra'], ['Comedor', 0, 4.5, 5, 6.5, 'madera'],
    ['Vestíbulo', 5, 6.5, 6, 4.5, 'piedra'], ['Cocina', 11, 6.5, 5, 4.5, 'piedra']],
    'paredes': [[5, 0, 5, 6.5], [0, 4.5, 5, 4.5], [5, 6.5, 16, 6.5], [11, 6.5, 11, 11], [5, 6.5, 5, 11]],
    'puertas': [[7.5, 6.5, 'h', 1.5, 'al salón'], [5, 8, 'v', 1, 'al comedor'], [2, 4.5, 'h', 1, 'al despacho'], [11, 8.5, 'v', 1, 'a la cocina'], [7.5, 11, 'h', 1.5, 'jardín']],
    'ventanas': [[1.2, 0, 'h', 1.5, 'N'], [7, 0, 'h', 1.5, 'N'], [12, 0, 'h', 1.5, 'N'], [1, 11, 'h', 1.5, 'S'], [13, 11, 'h', 1.5, 'S']],
    'muebles': [['Escritorio', 1, 1.4, 2.6, 1.2], ['Libros', .3, .2, 1.6, .8], ['Cofre', 3.5, .3, 1.2, .9], ['Estante', 2.1, .2, 1.3, .8],
                ['Alfombra', 7, 1.5, 7, 3.5], ['Planta', 5.4, .3, .7, .7], ['Planta', 15, .3, .7, .7], ['Banco', 5.6, 5.4, 2.4, .7], ['Banco', 13, 5.4, 2.4, .7],
                ['Mesa', 1, 6.4, 3, 2.2], ['Silla', .4, 7, .8, .8], ['Silla', 3.9, 7, .8, .8], ['Alacena', .3, 4.7, 1.6, .8], ['Botellero', 2.3, 4.7, 1.4, .8],
                ['Alfombra', 6.5, 7.5, 3, 2.5], ['Planta', 5.3, 6.8, .7, .7], ['Planta', 10.1, 6.8, .7, .7],
                ['Fogón', 11.3, 6.8, 1.8, .9], ['Despensa', 13.6, 6.8, 1.6, .8], ['Mesa', 12, 8.6, 2.6, 1.2], ['Sacos', 14.6, 9.6, 1.1, 1]],
    'notas': 'La mansión del marqués Teodoro de Albamar. En el despacho, la invitación a la subasta y la escritura de la costa.'}
ed('mansion', 'Mansión del marqués de Albamar', 5.5, 3, 14, 8, 'pizarra-azul', 'estuco', mansion, color='blanco', pisos=3, puerta=7,
   ventanas=[1.6, 4, 10, 12.4], ventanasAlto=[1.6, 4, 7, 10, 12.4], balcon=[7], emblema='corona', chimenea=11.6, puertaColor='azul')
ed('palacio', 'Palacio Real de Goa', 23, 2.6, 24, 7, 'pizarra-azul', 'columnas', None, pisos=3, puerta=12, ventanas=[3, 6.5, 17.5, 21],
   ventanasAlto=[3, 6.5, 9.5, 12, 14.5, 17.5, 21], balcon=[12], emblema='corona', bandera=True, puertaColor='azul')
archivo = tienda(9, 6, [['Estante', .3, .2, 1.6, .8], ['Libros', 2.1, .2, 1.6, .8], ['Libros', 4, .2, 1.6, .8], ['Estante', 5.9, .2, 1.6, .8], ['Libros', 7.4, .2, 1.4, .8],
                        ['Escritorio', 1, 2.4, 2.6, 1.2], ['Mesa', 5, 2.6, 3, 1.2], ['Cofre', 7.6, 4.4, 1.2, .9], ['Planta', .3, 4.9, .7, .7]], 'Archivo Real', 'piedra')
ed('archivo', 'Archivo Real', 50, 3, 9.5, 6, 'pizarra-azul', 'columnas', archivo, pisos=2, ventanas=[1.6, 7.9], ventanasAlto=[1.6, 4.75, 7.9], emblema='corona', puertaColor='azul')
guardia = dos(9, 6, 2.6, 'Armero', 'Cuerpo de guardia', [['Barriles', .3, .2, 1.2, 1.8], ['Cajas', 1.8, .3, 1.5, 1.1], ['Cofre', 6.6, .3, 1.3, .9],
                       ['Mesa', 1.2, 3.6, 2.6, 1.2], ['Banco', 1.2, 5.1, 2.6, .6], ['Escritorio', 5.6, 3.5, 2.4, 1.1], ['Estante', 4, 2.8, 1.4, .8]], 'piedra', 'piedra')
ed('guardia_real', 'Cuartel de la Guardia Real', 23.5, 15.6, 9.5, 4.4, 'pizarra-azul', 'piedra', guardia, emblema='corona', ventanas=[1.6, 7.9], flores=False, puertaColor='marron')
joyas = tienda(5, 4.4, [['Mostrador', 1, 1.6, 3, 1], ['Estante', .3, .2, 1.4, .8], ['Cofre', 3.4, .3, 1.2, .9], ['Planta', 4.1, 3.4, .7, .7]], 'Joyería Oropel')
ed('joyeria', 'Joyería Oropel', 37, 15.6, 5, 4.4, 'pizarra', 'estuco', joyas, color='blanco', letrero='monedas', toldo='azul', ventanas=[1.1, 3.9], puertaColor='azul')
perfume = tienda(5, 4.4, [['Mostrador', 1, 1.6, 3, 1], ['Botellero', .3, .2, 1.4, .8], ['Remedios', 3.2, .2, 1.5, .8], ['Planta', .3, 3.4, .7, .7]], 'Perfumería Violeta')
ed('perfumeria', 'Perfumería Violeta', 42.6, 15.6, 5, 4.4, 'tejas-roja', 'estuco', perfume, color='rosa', letrero='frasco', toldo='rojo', ventanas=[1.1, 3.9], puertaColor='verde')
for i, (x, c, t) in enumerate([(50, 'celeste', 'pizarra'), (57.5, 'ocre', 'tejas-roja')]):
    ed(f'noble{i + 1}', 'Casa noble', x, 15.6, 6.5, 4.4, t, 'estuco', None, color=c, pisos=2, ventanas=[1.4, 5.1], ventanasAlto=[1.4, 3.25, 5.1], balcon=[3.25])

# ---------- Ciudad Central ----------
# banda 0: entre la muralla (y 24) y la Calle de los Mercaderes (y 31)
posada = dos(9, 6, 2.8, 'Cuartos', 'Posada', [['Cama', .4, .2, 1.4, 2.2], ['Cama', 2.4, .2, 1.4, 2.2], ['Cama', 5.2, .2, 1.4, 2.2], ['Baúl', 7.4, .3, 1.2, .9],
                     ['Barra', 1, 3.6, 3.4, 1], ['Botellero', .3, 2.9, 1.6, .8], ['Mesa', 5.6, 4, 1.8, 1.1], ['Taburetes', 5.4, 5.2, 2.2, .6]])
ed('posada_goa', 'Posada El Farol Azul', 13.4, 25.2, 9, 5, 'pizarra', 'piedra', posada, pisos=2, ventanasAlto=[1.8, 4.5, 7.2], letrero='concha', toldo='azul', chimenea=7.6, puertaColor='azul')
ed('banos', 'Baños de Goa', 4.6, 25.4, 6.4, 4.8, 'tejas-ocre', 'arcos', None, ventanas=[])
for i, (x, w, c, t) in enumerate([(25.4, 3.2, 'blanco', 'tejas-roja'), (29, 3.4, 'ocre', 'tejas'), (37.8, 3.6, 'rosa', 'tejas-roja'), (41.8, 3.4, 'verde', 'tejas-ocre'), (53, 3.8, 'celeste', 'pizarra'), (58.2, 6, 'blanco', 'tejas')]):
    ed(f'casa_a{i}', 'Casa', x, 25.4, w, 4.8, t, 'estuco', None, color=c, pisos=2, ventanas=[round(w * .25, 1), round(w * .75, 1)], ventanasAlto=[round(w * .25, 1), round(w * .75, 1)], balcon=[round(w * .75, 1)] if i % 2 else [])
botica = tienda(5, 4.8, [['Mostrador', 1, 1.6, 3, 1], ['Remedios', .3, .2, 1.5, .8], ['Remedios', 3.2, .2, 1.5, .8], ['Camilla', .3, 3.2, 1, 1.4]], 'Botica')
ed('botica', 'Botica del Puerto', 47.4, 25.4, 5, 4.8, 'pizarra-verde', 'ladrillo', botica, letrero='frasco', puertaColor='verde')

# banda A: Mercaderes (31) → Puente (40)
herreria = tienda(7, 5.8, [['Fogón', .3, .2, 2.2, 1], ['Estufa', 3, .2, 1.4, 1], ['Banco de aparejos', 4.8, .3, 1.9, .9], ['Barril', .4, 3.6, .9, .9], ['Mesa', 2.2, 2.6, 2.6, 1.2], ['Cajas', 5.2, 4, 1.4, 1]], 'Herrería', 'piedra')
ed('herreria', 'Herrería Yunque', 4, 33.4, 7, 5.8, 'pizarra', 'ladrillo', herreria, chimenea=1.6, letrero='martillo', puertaColor='marron')
armeria = dos(9, 6.2, 2.4, 'Taller', 'Armería', [['Banco de aparejos', .4, .3, 2, .9], ['Fogón', 3, .2, 2, .9], ['Barriles', 7.3, .2, 1.2, 1.8], ['Cajas', 5.4, .4, 1.5, 1],
                       ['Mostrador', 2.6, 4, 3.8, 1], ['Cofre', 7.4, 5.1, 1.2, .9]], 'piedra', 'madera')
ed('armeria_goa', 'Armería Hierro y Pólvora', 13.5, 33, 9, 6.2, 'pizarra', 'piedra', armeria, pisos=2, ventanas=[1.6, 7.4], ventanasAlto=[1.6, 4.5, 7.4], letrero='espadas', toldo='rojo', chimenea=1.4, flores=False, puertaColor='roja')
sastre = dos(8.4, 6.2, 2.4, 'Taller de costura', 'Sastrería', [['Mesa', .5, .5, 2.6, 1.1], ['Estante', 3.6, .2, 1.6, .8], ['Lonas', 5.6, .3, 1.6, 1], ['Biombo', 7.4, .3, .8, 1.6],
                      ['Mostrador', 1, 3.6, 3, 1], ['Alfombra', 4.5, 3.4, 3, 2], ['Biombo', 7.3, 3.2, .8, 1.6], ['Planta', .3, 5.3, .7, .7]], 'madera', 'madera', paso=1)
ed('sastreria', 'Sastrería La Aguja de Oro', 25.4, 33, 8.4, 6.2, 'tejas-ocre', 'estuco', sastre, color='ocre', pisos=2, ventanas=[1.6, 6.8], ventanasAlto=[1.6, 4.2, 6.8], balcon=[4.2], letrero='aguja', toldo='verde', puertaColor='verde')
taberna = {'w': 9.2, 'h': 6.6, 'cuartos': [['Cocina', 0, 0, 3.6, 2.8, 'piedra'], ['La Ballena Varada', 0, 2.8, 9.2, 3.8, 'madera'], ['Bodega', 3.6, 0, 5.6, 2.8, 'piedra']],
           'paredes': [[0, 2.8, 9.2, 2.8], [3.6, 0, 3.6, 2.8]], 'puertas': [[1.3, 2.8, 'h', 1, 'a la cocina'], [6, 2.8, 'h', 1, 'a la bodega'], [4.1, 6.6, 'h', 1, 'calle']],
           'ventanas': [[1, 6.6, 'h', 1.5, 'S'], [7, 6.6, 'h', 1.5, 'S']],
           'muebles': [['Fogón y pila', .3, .2, 2.2, .9], ['Despensa', 2.6, .2, .9, .8], ['Barriles', 4, .2, 1.2, 2], ['Barriles', 5.4, .2, 1.2, 2], ['Sacos', 7.4, .3, 1.4, 1.2],
                       ['Barra', .4, 3.4, 3.2, 1], ['Botellero', 4.2, 2.9, 1.6, .8], ['Mesa', 5.2, 4, 1.6, 1.1], ['Mesa', 7.2, 4, 1.6, 1.1], ['Taburetes', 5, 5.3, 4, .6]]}
ed('ballena', 'Taberna La Ballena Varada', 36.4, 32.6, 9.2, 6.6, 'tejas', 'entramado', taberna, pisos=2, ventanasAlto=[1.8, 4.6, 7.4], chimenea=1.8, letrero='jarra', puertaColor='marron')
pan = tienda(5, 5.2, [['Mostrador', 1, 1.6, 3, 1], ['Estufa', .3, .2, 1.5, 1], ['Sacos', 3.4, .3, 1.3, 1], ['Cajas', .3, 3.8, 1.2, 1]], 'Panadería')
ed('panaderia_goa', 'Panadería del Molino', 47.4, 34, 5, 5.2, 'tejas-roja', 'estuco', pan, color='blanco', chimenea=3.8, letrero='pan', toldo='rojo', puertaColor='azul')
ed('casa_b0', 'Casa', 53, 34.2, 3.8, 5, 'tejas', 'ladrillo', None, ventanas=[1, 2.8])
empeno = tienda(6, 5.6, [['Mostrador', 1.4, 1.8, 3.2, 1], ['Estante', .3, .2, 1.6, .8], ['Baúl', 2.3, .3, 1.2, .9], ['Cajas', 4.2, .3, 1.5, 1], ['Juguetes', .3, 3.6, 1.2, 1], ['Barril', 5, 4.4, .8, .8]], 'Casa de empeño')
ed('empeno', 'Casa de empeño La Segunda Vida', 58.2, 33.6, 6, 5.6, 'pizarra', 'ladrillo', empeno, letrero='monedas', puertaColor='roja')

# banda B: Puente (40) → Molino (49), con la Plaza del Mercado en el centro
carto = tienda(7, 5.2, [['Mesa', 1.6, 1.8, 3.6, 1.4], ['Mapa', .3, .2, 2.4, .9], ['Mapa', 3.4, .2, 2.4, .9], ['Libros', 5.6, .2, 1.2, .8], ['Silla', 1, 2.1, .8, .8], ['Planta', 6.1, 4.3, .7, .7]], 'Cartografía')
ed('cartografa', 'Cartografía Mapp', 4, 43, 7, 5.2, 'pizarra-azul', 'entramado', carto, letrero='mapa', puertaColor='azul')
mercado = tienda(9.4, 6.6, [['Mostrador', .6, 1.8, 2.6, 1], ['Mostrador', 3.4, 1.8, 2.6, 1], ['Mostrador', 6.2, 1.8, 2.6, 1], ['Cajas', .3, .2, 1.4, 1], ['Sacos', 2.2, .2, 1.4, 1.1],
                        ['Barriles', 7.6, .2, 1.2, 1.4], ['Cajas', .4, 4.9, 1.4, 1], ['Sacos', 7.4, 4.9, 1.4, 1.1]], 'Mercado cubierto', 'piedra', ventanas=False)
ed('mercado', 'Mercado cubierto', 13.4, 41.6, 9.4, 6.6, 'tejas-roja', 'arcos', mercado, ventanas=[], puerta=4.7)
veleria = tienda(8.6, 5.8, [['Lonas', .3, .3, 2, 1.1], ['Sogas', 2.6, .3, 1.4, 1], ['Redes', 4.4, .2, 1.8, .9], ['Mesa', 1.2, 2.6, 4, 1.4], ['Canas', 7.2, .2, 1.2, 1], ['Mostrador', 5.6, 3.8, 2.6, 1]], 'Velería')
ed('veleria', 'Velería Teo Lona', 47.4, 42.4, 8.6, 5.8, 'tablas', 'madera', veleria, letrero='vela', toldo='azul', puertaColor='marron')
ed('casa_b1', 'Casa', 58.2, 43.2, 6, 5, 'pizarra', 'piedra', None, chimenea=4.6)

# banda C: Molino (49) → Paseo del Puerto (58)
for i, (x, w, f, c, t) in enumerate([(25.4, 4, 'estuco', 'celeste', 'tejas-roja'), (29.6, 4.2, 'entramado', None, 'tejas'), (36.4, 4.4, 'estuco', 'blanco', 'tejas-ocre'),
                                       (41.2, 4, 'ladrillo', None, 'pizarra'), (47.4, 4, 'estuco', 'verde', 'tejas-roja'), (51.8, 4.4, 'madera', None, 'tejas')]):
    k = {'color': c} if c else {}
    ed(f'casa_c{i}', 'Casa', x, 52.2, w, 5, t, f, None, ventanas=[round(w * .25, 1), round(w * .75, 1)], chimenea=round(w * .7, 1) if i % 2 else None, **k)
lonja = tienda(6.6, 5.6, [['Mostrador', .6, 1.8, 2.6, 1], ['Mostrador', 3.6, 1.8, 2.6, 1], ['Barriles', .3, .2, 1.2, 1.4], ['Cajas', 5, .3, 1.4, 1], ['Redes', 2, .2, 2, .9]], 'Lonja', 'piedra', ventanas=False)
ed('lonja', 'Lonja del pescado', 58.2, 51.6, 6.6, 5.6, 'tablas', 'madera', lonja, ventanas=[], letrero='concha', toldo='azul')

# ---------- Puerto ----------
for i, (x, w) in enumerate([(3.4, 6.4), (13.4, 7.6), (25.4, 7.4), (37, 4.8), (45, 6.6), (56, 7)]):
    ed(f'almacen{i}', 'Almacén', x, 59.6, w, 3.8, 'tablas', 'madera', None, ventanas=[], puerta=round(w / 2, 1))

# ---------- Terminal Gris (al este del barranco) ----------
lata = dos(7, 5, 2, 'Almacén', 'Cantina de Lata', [['Barriles', .3, .2, 1.2, 1.5], ['Cajas', 1.8, .3, 1.4, 1], ['Sacos', 5.2, .3, 1.4, 1],
                    ['Barra', .4, 2.6, 3, 1], ['Mesa', 4.4, 3.2, 1.6, 1], ['Taburetes', 4.2, 4.3, 2.4, .5]], 'madera', 'madera', paso=5.5)
ed('cantina_lata', 'Cantina de Lata', 95, 43.6, 7, 5, 'tablas', 'chapas', lata, letrero='jarra', pilotes=True, ventanas=[1.4, 5.6])
taller = {'w': 9, 'h': 5.4, 'cuartos': [['Taller de Ama Sel', 0, 0, 9, 5.4, 'madera']], 'paredes': [], 'puertas': [[4, 5.4, 'h', 1.2, 'calle']],
          'ventanas': [[1.5, 0, 'h', 1.5, 'N'], [6, 0, 'h', 1.5, 'N']],
          'muebles': [['Mesa', 1, 1.6, 3.6, 1.6], ['Banco de aparejos', 5.4, .3, 2, .9], ['Lonas', 7.5, .3, 1.3, 1.2], ['Sogas', .3, .3, 1.3, .9],
                      ['Mapa', 2.2, .2, 2.4, .9], ['Cajas', 7.4, 3.8, 1.4, 1.1], ['Barril', .4, 4.3, .8, .8], ['Estufa', 5.6, 2.6, 1.3, .9]]}
ed('taller_sel', 'Astillero de Ama Sel', 84, 53.6, 9, 5.4, 'tablas', 'madera', taller, letrero='barco', ventanas=[1.6, 7.4], chimenea=7.4)
chabolas = [(73.6, 33.6, 4), (78.6, 33.4, 4.4), (84.6, 33.8, 3.8), (90, 33.4, 4.4), (96.6, 33.6, 4), (101.6, 33.4, 4.6),
            (73.6, 44.4, 4.2), (106, 44.4, 4), (78, 22.6, 4.2), (90.4, 22.4, 4.6), (100.4, 22.8, 4)]
for i, (x, y, w) in enumerate(chabolas):
    ed(f'chabola{i}', 'Chabola', x, y, w, 3.6, 'tablas', 'chapas', None, pilotes=i % 3 == 0, ventanas=[round(w * .75, 1)], puerta=round(w * .3, 1))

# ---------- mapa ----------
costa = [[0, 0], [112, 0], [112, 62], [108, 68], [100, 72.5], [90, 73], [80, 71], [72, 69], [68, 67.5], [60, 67], [50, 67.2], [40, 67], [30, 67.3],
         [20, 67], [12, 67.5], [6, 69], [2, 72], [0, 73]]
C = lambda n, *p, **k: dict(n=n, p=[list(q) for q in p], **k)
caminos = [
    # Ciudad Alta (empedrada)
    C('Calle Alta', (6, 21.8), (64, 21.8), piedra=True), C('Paseo de los Faroles', (47, 12.4), (64, 12.4), piedra=True),
    C('Calle del Palacio', (35, 9.8), (35, 21.8), piedra=True), C('Calle del Archivo', (48.8, 12.4), (48.8, 21.8), piedra=True),
    C('Paseo del jardín', (12.5, 19.5), (12.5, 21.8), piedra=True),
    # Calle Real: de la Puerta Real al muelle grande
    C('Calle Real', (35, 21.8), (35, 66.6), piedra=True),
    C('Calle de los Mercaderes', (3, 31), (65, 31), piedra=True), C('Calle del Puente', (3, 40), (64.8, 40), piedra=True),
    C('Calle del Molino', (3, 49), (65, 49), piedra=True), C('Paseo del Puerto', (3, 58), (65, 58), piedra=True),
    C('Calle de los Tintes', (12, 31), (12, 58)), C('Calle del Lavadero', (24, 31), (24, 58)), C('Calle de la Lonja', (46, 31), (46, 58)), C('Calle del Faro', (57, 31), (57, 58)),
    C('Muelle del oeste', (11, 58), (11, 66.6)), C('Muelle de pescadores', (23, 58), (23, 66.6)), C('Muelle del este', (53, 58), (53, 66.6)),
    # el puente del barranco, el único paso a la Terminal
    C('Puente del Barranco', (64.6, 40), (71.4, 40), madera=True),
    # Terminal (tierra)
    C('Camino de la chatarra', (71.4, 40), (108, 40)), C('Senda de las chabolas', (72, 29.6), (106, 29.6)), C('Senda de la Fosa', (72, 50.4), (108, 50.4)),
    C('Bajada al astillero', (88.6, 14), (88.6, 50.4), (88.6, 61)), C('Senda del bosque', (88.6, 14), (100, 8), (108, 4)),
    C('Senda de la Fosa', (104.6, 40), (104.6, 50.4)),
]
objetos = [
    {'n': 'Muralla de la Ciudad Alta', 't': 'muralla', 'x': 4, 'y': 1.5, 'w': 62, 'h': 22.5, 'puerta': 35, 'torres': True, 'canones': [10, 20, 50, 60], 'suelo': False},
    {'n': 'Verja del jardín', 't': 'verja', 'x': 5, 'y': 11.4, 'w': 15, 'h': 8.1, 'puerta': 12.5},
    {'n': 'Estatua del rey', 't': 'rey', 'x': 35, 'y': 12.4},
    {'n': 'Fuente', 't': 'fuente', 'x': 28, 'y': 13.6}, {'n': 'Fuente', 't': 'fuente', 'x': 42, 'y': 13.6},
    {'n': 'Fuente del jardín', 't': 'fuente', 'x': 12.5, 'y': 16.4},
    {'n': 'Campanario', 't': 'campanario', 'x': 61.4, 'y': 13.8},
    {'n': 'Molino', 't': 'molino', 'x': 7.4, 'y': 55.2},
    {'n': 'Lavaderos', 't': 'lavadero', 'x': 14, 'y': 51.4, 'w': 8, 'h': 3.6},
    {'n': 'Tendedero', 't': 'tendedero', 'x': 14.4, 'y': 55.6, 'len': 7}, {'n': 'Tendedero', 't': 'tendedero', 'x': 4.4, 'y': 50.6, 'len': 4},
    {'n': 'Teatro de títeres', 't': 'titeres', 'x': 43.6, 'y': 48.4},
    {'n': 'Grúa', 't': 'grua', 'x': 20, 'y': 65.6}, {'n': 'Grúa', 't': 'grua', 'x': 48.6, 'y': 65.6},
    {'n': 'Faro', 't': 'fanal', 'x': 2.6, 'y': 69},
    {'n': 'Redes', 't': 'redes', 'x': 28, 'y': 65.4}, {'n': 'Nasas', 't': 'nasas', 'x': 31.4, 'y': 65.6}, {'n': 'Redes', 't': 'redes', 'x': 6.6, 'y': 65.6},
    {'n': 'Banco', 't': 'banco', 'x': 30.4, 'y': 15.8}, {'n': 'Banco', 't': 'banco', 'x': 39.6, 'y': 15.8},
    {'n': 'Tablón', 't': 'tablon', 'x': 37.4, 'y': 30.2},
    # Terminal
    {'n': 'Barricada de Bram', 't': 'barricada', 'x': 72.6, 'y': 37.6}, {'n': 'Barricada de Bram', 't': 'barricada', 'x': 72.6, 'y': 42.8},
    {'n': 'Montaña de chatarra', 't': 'chatarra', 'x': 80, 'y': 15, 'r': 6}, {'n': 'Montaña de chatarra', 't': 'chatarra', 'x': 98, 'y': 14, 'r': 7},
    {'n': 'Montaña de chatarra', 't': 'chatarra', 'x': 108, 'y': 30, 'r': 4}, {'n': 'Montaña de chatarra', 't': 'chatarra', 'x': 76, 'y': 56, 'r': 3.6},
    {'n': 'Memorial del Fuego', 't': 'memorial', 'x': 84.2, 'y': 45.4},
    {'n': 'Mercado de chatarra', 't': 'puestos_chatarra', 'x': 77, 'y': 36.4},
    {'n': 'Fosa de Chatarra', 't': 'foso', 'x': 96, 'y': 52.4, 'w': 9, 'h': 6},
    {'n': 'Fuerte de los Gorriones', 't': 'fuerte', 'x': 108, 'y': 50},
    {'n': 'Hoguera', 't': 'hoguera', 'x': 92.6, 'y': 37.4}, {'n': 'Hoguera', 't': 'hoguera', 'x': 80.4, 'y': 48.4}, {'n': 'Hoguera', 't': 'hoguera', 'x': 102, 'y': 48.4},
    {'n': 'Grada del astillero', 't': 'gradagoa', 'x': 87, 'y': 63, 'w': 17, 'h': 7},
    {'n': 'Grúa del astillero', 't': 'grua', 'x': 106, 'y': 63.4},
    {'n': 'Tendedero', 't': 'tendedero', 'x': 74, 'y': 38.4, 'len': 3.4}, {'n': 'Tendedero', 't': 'tendedero', 'x': 97, 'y': 38.2, 'len': 4},
    {'n': 'Cartel del camino', 't': 'cartel', 'x': 104.6, 'y': 6.6, 'texto': 'Villa Foosha · Monte Colubo'},
    {'n': 'Edicto', 't': 'edicto', 'x': 74.6, 'y': 41.4},
]
suelos = [
    {'t': 'losas', 'x': 4.4, 'y': 1.6, 'w': 61.2, 'h': 22.2},            # toda la Ciudad Alta, piedra blanca
    {'t': 'jardin', 'x': 5.2, 'y': 11.6, 'w': 14.6, 'h': 7.8},
    {'t': 'plaza', 'x': 23, 'y': 10, 'w': 24, 'h': 5.2, 'tono': 'alta'},
    {'t': 'chatarra', 'x': 70.4, 'y': 11, 'w': 41.6, 'h': 63},            # la Terminal entera, tierra quemada
    {'t': 'plaza', 'x': 80.6, 'y': 42.6, 'w': 7.4, 'h': 5.2, 'tono': 'quemada'},
    {'t': 'muelle_piedra', 'x': 2, 'y': 63.6, 'w': 63, 'h': 3.6},
    {'t': 'barranco', 'x': 66.2, 'w': 4.4, 'y0': 0, 'y1': 69, 'puente': 40},
]
props = [['barrel', 9.4, 64.6], ['barrel', 10.1, 64.9], ['crate', 15.2, 64.8], ['crate', 16.4, 65], ['sacks', 18, 64.8], ['logs', 25.2, 64.9], ['crate', 38.4, 64.8], ['barrel', 41.2, 64.7],
         ['sacks', 44, 64.8], ['crate', 55, 64.9], ['barrel', 57.6, 64.7], ['tuna', 60.4, 65], ['cart', 61.8, 56.6], ['crate', 63.4, 56.8], ['barrel', 23.4, 47.6], ['crate', 23.2, 42.2],
         ['sacks', 45.4, 42.4], ['barrel', 45.5, 47.8], ['cart', 10.6, 38.6], ['woodpile', 9.8, 47.6], ['barrel', 3.6, 38.8], ['crate', 33.6, 37.8], ['barrel', 52.6, 38.9],
         ['crate', 76.4, 31.2], ['barrel', 83.4, 37.8], ['logs', 86.4, 58.8], ['logs', 83, 60.2], ['crate', 90.6, 58.4], ['barrel', 102.8, 37.8], ['woodpile', 94.6, 49.6]]
faroles = [[25, 10.6], [45, 10.6], [25, 15.2], [45, 15.2], [50, 11.6], [56, 11.6], [62, 11.6], [8, 22.6], [20, 22.6], [44, 22.6], [56, 22.6], [33.8, 24.8], [36.2, 24.8],
           [8, 31.8], [18, 31.8], [30, 31.8], [41, 31.8], [52, 31.8], [62, 31.8], [8, 40.8], [18, 40.8], [52, 40.8], [62.6, 40.8], [25.4, 40.6], [44.6, 40.6], [25.4, 48.4], [44.6, 48.4],
           [8, 49.8], [30, 49.8], [41, 49.8], [52, 49.8], [62, 49.8], [8, 58.8], [18, 58.8], [30, 58.8], [41, 58.8], [52, 58.8], [62, 58.8]]
animales = {'gatos': [[24.6, 39.2, 'naranja'], [46.6, 57.4, 'negro'], [87, 40.6, 'gris'], [14.6, 30.6, 'gris']],
            'gaviotas': [[34.4, 69.6], [35.6, 71.8], [22.6, 70.4], [11.4, 72], [52.6, 70.4], [44, 70.8]],
            'perro': [[64, 58.6], [96, 40.6]], 'gallinas': [[100, 31], [101, 31.4], [102.2, 31]],
            'palomas': [[31, 43.6], [32, 44], [38, 43.8], [39.2, 44.2], [33.6, 12], [36.6, 12.2], [27, 11.6], [43, 11.4]]}
mapa = {'w': W, 'h': H, 'costa': costa, 'playa': [[100, 72.5], [108, 68], [112, 62], [112, 72], [104, 74]], 'acantilado': [[0, 64], [2, 64.4], [2.4, 70], [0, 72]],
        'bosque': [[96, 0], [112, 0], [112, 10], [104, 12], [96, 6]], 'arbolado': {'bosque': [96, 0, 16, 12], 'sueltos': [5.6, 11.6, 14, 7.6], 'n': 18},
        'caminos': caminos, 'plaza': {'x': 25.4, 'y': 41, 'w': 19.2, 'h': 7}, 'suelos': suelos,
        'muelle': [[10, 66.6, 2, 7.4], [22, 66.6, 2, 6.6], [34, 66.6, 2, 9], [52, 66.6, 2, 7], [8, 74, 30, 2]], 'botes': [[16, 71.6], [28, 72.6], [46, 71.8], [57, 71.2]],
        'objetos': objetos, 'props': props, 'faroles': faroles, 'margenN': 1.4, 'animales': animales,
        }
GENERO = ['fruta', 'verdura', 'pescado', 'telas', 'especias', 'cacharros', 'flores', 'pan', 'quesos', 'pescado', 'fruta']
puestos = [(x, 41.6) for x in (26, 28.8, 31.6, 37, 39.8, 42.6)] + [(x, 45) for x in (26, 28.8, 31.6, 37, 39.8)]
mapa['objetos'] += [{'n': 'Puesto de ' + gen, 't': 'puesto', 'x': x, 'y': y, 'g': gen, 'i': i} for i, ((x, y), gen) in enumerate(zip(puestos, GENERO))]
json.dump({'tile': 32, 'mapa': mapa, 'edificios': E}, open('islas/goa.json', 'w'), ensure_ascii=False, indent=0)
print(len(E), 'edificios,', sum(b['entrable'] for b in E), 'con interior')
