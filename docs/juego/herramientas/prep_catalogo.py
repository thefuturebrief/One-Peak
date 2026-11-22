# Arma el catálogo de personalización: resuelve cada pieza LPC para cada cuerpo, baja solo esos archivos
# y los copia a docs/juego/assets/lpc/ con un catalogo.json que el juego usa para componer al personaje.
import json, os, shutil, subprocess, sys
S = os.path.dirname(os.path.abspath(__file__)); REPO = S + '/lpc'; OUT = '/home/user/one-peak/docs/juego/assets/lpc'
files = set(open(S + '/lpc-files.txt').read().split('\n'))
ALT = {'male': ['male', 'adult', ''], 'female': ['female', 'thin', 'adult', ''], 'muscular': ['muscular', 'male', 'adult', ''], 'teen': ['teen', 'male', 'adult', ''], 'child': ['child', 'adult', '']}
def res(base, body, color=None):
    for v in ALT[body]:
        root = 'spritesheets/' + base + ('/' + v if v else '')
        p = f'{root}/walk/{color}.png' if color else f'{root}/walk.png'
        if p in files: return p
    return None
BODIES = ['male', 'female', 'muscular', 'teen']
# id, nombre, base, material (paleta para recolorear), color de archivo de partida (si la pieza solo viene por colores), cuerpos permitidos
CAT = {
  'pelo': [('messy1', 'Revuelto'), ('spiked', 'De punta'), ('bedhead', 'Despeinado'), ('shorthawk', 'Cresta'), ('buzzcut', 'Rapado'), ('curly_short', 'Rizado corto'), ('afro', 'Afro'), ('dreadlocks_short', 'Rastas'), ('parted', 'Raya al lado'), ('bob', 'Melena corta'), ('pixie', 'Corto'), ('long_straight', 'Largo liso'), ('curly_long', 'Rizado largo'), ('bangs_bun', 'Moño'), ('long', 'Largo'), ('unkempt', 'Salvaje')],
  'arriba': [('tshirt', 'Camiseta', 'torso/clothes/shortsleeve/tshirt', None, None), ('longsleeve', 'Manga larga', 'torso/clothes/longsleeve/longsleeve', None, None), ('formal', 'Camisa', 'torso/clothes/longsleeve/formal', None, ['male', 'muscular', 'teen']), ('abotonada', 'Camisa abotonada', 'torso/clothes/longsleeve/longsleeve2_buttoned', None, None), ('pico', 'Cuello de pico', 'torso/clothes/longsleeve/longsleeve2_vneck', None, None), ('rebeca', 'Rebeca', 'torso/clothes/longsleeve/longsleeve2_cardigan', None, None), ('blusa', 'Blusa', 'torso/clothes/blouse_longsleeve', 'white', ['female']), ('sinmangas', 'Sin mangas', 'torso/clothes/sleeveless/sleeveless2', None, None), ('nada', 'Nada', None, None, ['male', 'muscular', 'teen'])],
  'encima': [('nada', 'Nada', None, None, None), ('chaleco', 'Chaleco', 'torso/clothes/vest_open', 'white', ['male', 'muscular']), ('levita', 'Levita', 'torso/jacket/frock', 'white', ['male', 'muscular']), ('chaqueta', 'Chaqueta de cuello', 'torso/jacket/collared', 'white', ['male', 'muscular', 'teen']), ('chaleco_cerrado', 'Chaleco cerrado', 'torso/clothes/vest', 'white', ['male', 'muscular', 'teen']), ('tabardo', 'Tabardo', 'torso/jacket/tabard', 'white', None), ('corse', 'Corsé', 'torso/clothes/corset', 'white', ['female'])],
  'abajo': [('pants', 'Pantalón', 'legs/pants', None, None), ('pantaloons', 'Bombacho', 'legs/pantaloons', None, None), ('shorts', 'Corto', 'legs/shorts/shorts', None, None), ('falda', 'Falda', 'legs/skirts/plain', None, None), ('vestir', 'De vestir', 'legs/formal', None, None), ('rayas', 'De vestir a rayas', 'legs/formal_striped', None, None)],
  'pies': [('botas', 'Botas', 'feet/boots/fold', None, None), ('zapatos', 'Zapatos', 'feet/shoes/basic', None, None), ('sandalias', 'Sandalias', 'feet/sandals', None, None), ('descalzo', 'Descalzo', None, None, None)],
  'cabeza': [('nada', 'Nada', None, None, None), ('cinta', 'Cinta', 'hat/headband/tied/adult', None, None), ('panuelo', 'Pañuelo', 'hat/cloth/bandana2/adult', None, None), ('bandana', 'Bandana', 'hat/cloth/bandana/adult', None, None), ('tricornio', 'Tricornio', 'hat/pirate/tricorne/basic/adult', None, None), ('bicornio', 'Bicornio', 'hat/pirate/bicorne/athwart/basic/adult', None, None),
    ('kerchief', 'Pañuelo pirata', 'hat/pirate/kerchief/adult', None, None), ('bombin', 'Bombín', 'hat/formal/bowler/adult', None, None), ('chistera', 'Chistera', 'hat/formal/tophat/adult', None, None), ('gorra', 'Gorra de cuero', 'hat/cloth/leather_cap/adult', None, None),
    ('pluma', 'Gorra con pluma', 'hat/cloth/leather_cap/feather/adult', None, None), ('cofia', 'Cofia', 'hat/pirate/bonnie/adult', None, None), ('chambergo', 'Chambergo', 'hat/pirate/cavalier/adult', None, None)],
  'accesorio': [('nada', 'Nada', None, None, None), ('gafas', 'Gafas redondas', 'facial/glasses/round/adult', None, None), ('parche', 'Parche', 'facial/patches/eyepatch/ambi/adult', None, None), ('monoculo', 'Monóculo', 'facial/monocle/left/adult', None, None),
    ('pendientes', 'Pendientes', 'facial/earrings/simple', None, None), ('guantes', 'Guantes', 'arms/hands/gloves', None, None), ('corbata', 'Corbata', 'neck/tie/necktie', None, None), ('bufanda', 'Bufanda', 'neck/scarf', None, None)],
}
need, cat = {}, {'cuerpos': [['male', 'Masculino'], ['female', 'Femenino'], ['muscular', 'Fornido'], ['teen', 'Menudo']], 'capas': {}, 'fijas': {}}
def take(src, name):
    need[src] = name; return 'assets/lpc/' + name
def piece(base, color, bodies):
    out = {}
    for b in bodies:
        p = res(base, b, color) or (res(base, 'male', color) if b == 'muscular' else None)
        if p: out[b] = take(p, base.replace('/', '_') + '__' + p.split('/')[-3 if color else -2] + ('_' + color if color else '') + '.png')
    return out
# piezas fijas: cuerpo, cabeza, ojos, cejas
cat['fijas']['cuerpo'] = {b: take(res(f'body/bodies/{b}', b), f'cuerpo_{b}.png') for b in BODIES}
for face in ['male', 'female']:
    for small in ['', '_small']:
        cat['fijas'][f'cabeza_{face}{small}'] = take(res(f'head/heads/human/{face}{small}', 'male'), f'cabeza_{face}{small}.png')
cat['fijas']['ojos'] = take(res('eyes/human/adult/default', 'male', 'blue'), 'ojos.png')  # archivo azul: sus colores están en la paleta y se pueden recolorear
cat['fijas']['cejas_gruesas'] = take(res('eyes/eyebrows/thick/adult', 'male'), 'cejas_gruesas.png')
cat['fijas']['cejas_finas'] = take(res('eyes/eyebrows/thin/adult', 'male'), 'cejas_finas.png')
cat['capas']['pelo'] = [{'id': i, 'n': n, 'mat': 'hair', 'f': {b: take(res(f'hair/{i}/adult', b), f'pelo_{i}.png') for b in BODIES}} for i, n in CAT['pelo']]
for k in ['arriba', 'encima', 'abajo', 'pies', 'cabeza', 'accesorio']:
    cat['capas'][k] = []
    for i, n, base, color, bodies in CAT[k]:
        bodies = bodies or BODIES
        f = piece(base, color, bodies) if base else {b: None for b in bodies}
        if base and not f: print('sin archivos:', k, i); continue
        cat['capas'][k].append({'id': i, 'n': n, 'mat': 'cloth', 'f': f})
# la familia: Marla y Corso se componen igual, con tu piel y tu pelo
cat['familia'] = {
  'marla': {'cuerpo': take(res('body/bodies/female', 'female'), 'cuerpo_female.png'), 'capas': [
    [take(res('head/heads/human/female', 'female'), 'cabeza_female.png'), 'body'], [take(res('eyes/human/adult/default', 'female', 'blue'), 'ojos.png'), 'eye', 'green'], [take(res('eyes/eyebrows/thin/adult', 'female'), 'cejas_finas.png'), 'hair'],
    [take(res('feet/sandals', 'female'), 'feet_sandals__thin.png'), 'cloth', 'brown'], [take(res('legs/pants', 'female'), 'legs_pants__thin.png'), 'cloth', 'brown'], [take(res('torso/clothes/shortsleeve/tshirt', 'female'), 'torso_clothes_shortsleeve_tshirt__female.png'), 'cloth', 'rose'],
    [take(res('torso/aprons/apron', 'female', 'white'), 'delantal_female.png'), 'cloth', 'white'], [take(res('hair/bangs_bun/adult', 'female'), 'pelo_bangs_bun.png'), 'hair']]},
  'corso': {'cuerpo': take(res('body/bodies/child', 'child'), 'cuerpo_child.png'), 'capas': [
    [take(res('head/heads/human/child', 'child'), 'cabeza_child.png'), 'body'], [take(res('legs/pants/child', 'child', 'blue') or 'spritesheets/legs/pants/child/walk/blue.png', 'pantalon_child.png'), 'none'],
    [take('spritesheets/torso/clothes/shirt/child/walk/red.png', 'camisa_child.png'), 'none'], [take('spritesheets/hair/relm_short/child/walk.png', 'pelo_nino_corto.png'), 'hair']]},
}
# cada capa lleva todas sus animaciones en una sola imagen: caminar, tajo, estocada, disparo y caída (filas como en lpc-build2.js)
ANIMS = [('walk', 0, 9, 4), ('slash', 4, 6, 4), ('thrust', 8, 8, 4), ('shoot', 12, 13, 4), ('hurt', 16, 6, 1)]
def anim_src(src, a): return src.replace('/walk.png', f'/{a}.png') if src.endswith('/walk.png') else src.replace('/walk/', f'/{a}/')
# heridas y vendas que se ven en el personaje (las demás se dibujan por código en el juego)
cat['marcas'] = {'herida_brazos': take('spritesheets/body/wound/arm/walk.png', 'herida_brazo.png'), 'herida_cara': take('spritesheets/body/wound/mouth/walk.png', 'herida_boca.png'),
  'venda_cabeza': take(res('hat/headband/thick/adult', 'male'), 'venda_cabeza.png'), 'venda_brazos': {b: take(res('arms/bracers', b), 'venda_brazos_' + res('arms/bracers', b).split('/')[-2] + '.png') for b in BODIES}}
missing = [s for s in need if s not in files]
if missing: print('faltan en el repo:', missing); sys.exit(1)
allsrc = {anim_src(s, a) for s in need for a, *_ in ANIMS} & files
subprocess.run(['git', '-C', REPO, 'sparse-checkout', 'add', '--no-cone', *['/' + s for s in allsrc]], check=True)
from PIL import Image
os.makedirs(OUT, exist_ok=True); cat['anims'] = {}
for src, name in need.items():
    atlas = Image.new('RGBA', (832, 17 * 64)); have = []
    for a, row, n, rows in ANIMS:
        f = anim_src(src, a)
        if f in files: atlas.paste(Image.open(REPO + '/' + f).convert('RGBA').crop((0, 0, n * 64, rows * 64)), (0, row * 64)); have.append(a)
    atlas.save(OUT + '/' + name, optimize=True); cat['anims']['assets/lpc/' + name] = have
cat['paletas'] = {m: json.load(open(f'{REPO}/palette_definitions/{m}/{m}_ulpc.json')) for m in ['body', 'hair', 'cloth', 'eye']}
# tonos que LPC no trae: mezclas entre sus paletas (el índice 0 es el contorno y no se toca)
def mix(a, b, t, keep0=True):
    h = lambda c: [int(c[i:i + 2], 16) for i in (1, 3, 5)]
    return [a[i] if keep0 and i == 0 else '#%02x%02x%02x' % tuple(round(x + (y - x) * t) for x, y in zip(h(a[i]), h(b[i]))) for i in range(len(a))]
B, Hh = cat['paletas']['body'], cat['paletas']['hair']
B['pale'] = mix(B['light'], ['#000000', '#c88a80', '#f0c0a8', '#f8dcc8', '#fff0e6', '#fffaf8'], .55)
B['wheat'] = mix(B['light'], B['bronze'], .3); B['latte'] = mix(B['light'], B['bronze'], .58); B['cinnamon'] = mix(B['light'], B['brown'], .72)
Hh['caramel'] = mix(Hh['light_brown'], Hh['ginger'], .4, False); Hh['auburn'] = mix(Hh['chestnut'], Hh['red'], .35, False); Hh['honey'] = mix(Hh['blonde'], Hh['light_brown'], .5, False); Hh['silver'] = mix(Hh['platinum'], Hh['gray'], .5, False)
json.dump(cat, open(OUT + '/catalogo.json', 'w'), ensure_ascii=False)
print('piezas:', len(need), 'tamaño:', sum(os.path.getsize(OUT + '/' + n) for n in set(need.values())) // 1024, 'KB')
json.dump(list(need), open(S + '/catalogo-fuentes.json', 'w'))
