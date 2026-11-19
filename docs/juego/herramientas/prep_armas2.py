# Un atlas por arma LPC con sus animaciones en tamaño original (delante y detrás del cuerpo) y un índice armas.json.
# Filas por animación: 4 direcciones (arriba, izquierda, abajo, derecha). Se cargan en el juego solo si alguien lleva esa arma.
import json, os, sys
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, S)
L = S + '/lpc/spritesheets/'; OUT = '/home/user/one-peak/docs/juego/assets/armas/'
CLAVE = {'sword/arming': 'espada_corta', 'sword/longsword': 'mandoble', 'sword/longsword_alt': 'mandoble_fino', 'sword/saber': 'sable', 'sword/scimitar': 'cimitarra', 'sword/katana': 'katana', 'sword/rapier': 'estoque', 'sword/dagger': 'daga',
  'blunt/waraxe': 'hacha_guerra', 'blunt/mace': 'maza', 'blunt/flail': 'mangual', 'blunt/club': 'garrote', 'tools/axe': 'hacha', 'tools/hammer': 'martillo', 'tools/pickaxe': 'pico', 'tools/whip': 'latigo',
  'polearm/spear': 'lanza', 'polearm/longspear': 'lanza_larga', 'polearm/dragonspear': 'lanza_dragon', 'polearm/trident': 'tridente', 'polearm/halberd': 'alabarda', 'polearm/scythe': 'guadana', 'polearm/cane': 'baston',
  'ranged/bow': 'arco', 'ranged/crossbow': 'ballesta', 'ranged/slingshot': 'tirachinas', 'ranged/boomerang': 'bumeran'}
NF = {'walk': 9, 'slash': 6, 'thrust': 8, 'shoot': 13}
pick = open(S + '/wpick.txt').read().split()
def files_of(w): pre = 'spritesheets/' + ('' if w.startswith('tools') else 'weapon/') + w + '/'; return [p[len('spritesheets/'):] for p in pick if p.startswith(pre)]
def classify(p, w):
    q = p.lower(); name = w.split('/')[-1]
    if any(k in q for k in ['hurt', 'combat_idle', '/idle', 'reverse', 'backslash', 'halfslash', 'arrow', 'great', 'recurve', 'female', '/thin/']): return None
    anim = 'thrust' if 'thrust' in q else 'slash' if 'slash' in q else 'shoot' if 'shoot' in q else 'walk' if 'walk' in q else 'slash'
    if w.endswith('whip') and anim == 'slash': anim = 'thrust'
    back = any(k in q for k in ['behind', '/bg', 'background', 'bg.png'])
    f = q.split('/')[-1][:-4]; return anim, back, 3 if f == 'steel' else 2 if f in (name, 'normal') else 1
def pick_files(w):
    best = {}
    for p in files_of(w):
        c = classify(p, w)
        if c and ((c[0], c[1]) not in best or c[2] > best[(c[0], c[1])][0]): best[(c[0], c[1])] = (c[2], p)
    return {k: Image.open(L + v[1]).convert('RGBA') for k, v in best.items()}
man = {}
os.makedirs(OUT, exist_ok=True)
for w, key in CLAVE.items():
    lay = pick_files(w)
    if w == 'ranged/bow' and ('shoot', False) in lay:  # la flecha va con el arco al disparar
        arrow = Image.open(L + 'weapon/ranged/bow/arrow/shoot/arrow.png').convert('RGBA'); base = lay[('shoot', False)].copy(); base.alpha_composite(arrow.crop((0, 0, base.width, base.height))); lay[('shoot', False)] = base
    parts = []
    for (anim, back), im in sorted(lay.items(), key=lambda kv: (kv[0][0], kv[0][1])):
        c = im.height // 4; n = min(NF[anim], im.width // c); parts.append((anim, back, c, n, im.crop((0, 0, n * c, 4 * c))))
    W = max(p[4].width for p in parts); H = sum(p[4].height for p in parts); atlas = Image.new('RGBA', (W, H)); y = 0; entry = {}
    for anim, back, c, n, im in parts:
        atlas.paste(im, (0, y)); entry.setdefault(anim, {})['b' if back else 'f'] = [y, c, n]; y += im.height
    atlas.save(OUT + key + '.png', optimize=True); man[key] = entry
    print(key, {a: {k: v for k, v in e.items()} for a, e in entry.items()}, atlas.size)
json.dump(man, open(OUT + 'armas.json', 'w'))
