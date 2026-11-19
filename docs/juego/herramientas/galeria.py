# Galería de armas LPC: cada arma sobre el grumete, caminando y atacando (PNG fijo + GIF animado).
import json, os
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__)); L = S + '/lpc/spritesheets/'; OUT = S + '/galeria/'
body = Image.open('/home/user/one-peak/docs/juego/assets/personajes/grumete.png').convert('RGBA')
BROW = {'walk': 0, 'slash': 4, 'thrust': 8, 'shoot': 12}; BN = {'walk': 9, 'slash': 6, 'thrust': 8, 'shoot': 13}; ROW = {'up': 0, 'left': 1, 'down': 2, 'right': 3}
pick = open(S + '/wpick.txt').read().split()
W = [('sword/arming', 'Espada de armas', 'Espadas'), ('sword/longsword', 'Mandoble', 'Espadas'), ('sword/longsword_alt', 'Mandoble (variante)', 'Espadas'), ('sword/saber', 'Sable', 'Espadas'), ('sword/scimitar', 'Cimitarra', 'Espadas'),
     ('sword/katana', 'Katana', 'Espadas'), ('sword/rapier', 'Estoque', 'Espadas'), ('sword/dagger', 'Daga', 'Espadas'),
     ('blunt/waraxe', 'Hacha de guerra', 'Contundentes'), ('blunt/mace', 'Maza', 'Contundentes'), ('blunt/flail', 'Mangual', 'Contundentes'), ('blunt/club', 'Garrote', 'Contundentes'),
     ('tools/axe', 'Hacha de leñador', 'Herramientas'), ('tools/hammer', 'Martillo', 'Herramientas'), ('tools/pickaxe', 'Pico', 'Herramientas'), ('tools/whip', 'Látigo', 'Herramientas'),
     ('polearm/spear', 'Lanza', 'De asta'), ('polearm/longspear', 'Lanza larga', 'De asta'), ('polearm/dragonspear', 'Lanza dragón', 'De asta'), ('polearm/trident', 'Tridente', 'De asta'),
     ('polearm/halberd', 'Alabarda', 'De asta'), ('polearm/scythe', 'Guadaña', 'De asta'), ('polearm/cane', 'Bastón', 'De asta'),
     ('ranged/bow', 'Arco', 'A distancia'), ('ranged/crossbow', 'Ballesta', 'A distancia'), ('ranged/slingshot', 'Tirachinas', 'A distancia'), ('ranged/boomerang', 'Bumerán', 'A distancia')]
def files_of(w): pre = 'spritesheets/' + ('' if w.startswith('tools') else 'weapon/') + w + '/'; return [p[len('spritesheets/'):] for p in pick if p.startswith(pre)]
def classify(p, w):
    q = p.lower(); name = w.split('/')[-1]
    if 'hurt' in q or 'combat_idle' in q or '/idle' in q or 'reverse' in q or 'backslash' in q or 'halfslash' in q or 'arrow' in q: return None
    if 'great' in q or 'recurve' in q: return None
    if 'female' in q or '/thin/' in q: return None
    anim = 'thrust' if 'thrust' in q else 'slash' if 'slash' in q else 'shoot' if 'shoot' in q else 'walk' if 'walk' in q else 'slash'
    if w.endswith('whip') and anim == 'slash': anim = 'thrust'
    back = any(k in q for k in ['behind', '/bg', 'background', 'bg.png'])
    f = q.split('/')[-1][:-4]; score = 3 if f == 'steel' else 2 if f == name or f == 'normal' else 1
    return anim, back, score
def pick_files(w):
    best = {}
    for p in files_of(w):
        c = classify(p, w)
        if not c: continue
        anim, back, sc = c
        if (anim, back) not in best or sc > best[(anim, back)][0]: best[(anim, back)] = (sc, p)
    return {k: Image.open(L + v[1]).convert('RGBA') for k, v in best.items()}
def frame(layers, anim, d, f):
    cv = Image.new('RGBA', (192, 192)); bn = min(f, BN[anim] - 1)
    for back in (True, False):
        if back is False: cv.alpha_composite(body.crop((bn * 64, (BROW[anim] + ROW[d]) * 64, bn * 64 + 64, (BROW[anim] + ROW[d]) * 64 + 64)), (64, 64))
        im = layers.get((anim, back))
        if im is None: continue
        c = im.height // 4; k = min(f, im.width // c - 1); fr = im.crop((k * c, ROW[d] * c, k * c + c, ROW[d] * c + c)); cv.alpha_composite(fr, ((192 - c) // 2, (192 - c) // 2))
    return cv.crop((24, 24, 168, 168))
BG = (54, 92, 62, 255); out = []
for i, (w, n, cat) in enumerate(W, 1):
    lay = pick_files(w); atk = next((a for a in ['slash', 'thrust', 'shoot'] if (a, False) in lay or (a, True) in lay), None)
    peak = {'slash': 3, 'thrust': 5, 'shoot': 8}.get(atk, 0)
    cells = [frame(lay, 'walk', 'down', 0), frame(lay, 'walk', 'right', 0)] + ([frame(lay, atk, 'right', peak), frame(lay, atk, 'down', peak)] if atk else [])
    strip = Image.new('RGBA', (144 * len(cells), 144), BG)
    for k, c in enumerate(cells): strip.alpha_composite(c, (k * 144, 0))
    strip = strip.resize((strip.width * 2, strip.height * 2), Image.NEAREST); fn = f'{i:02d}'; strip.save(OUT + fn + '.png')
    if atk:
        frames = []
        for k in list(range(BN[atk])) + [BN[atk] - 1] * 3 + [0] * 0:
            g = Image.new('RGBA', (288, 144), BG); g.alpha_composite(frame(lay, atk, 'right', k), (0, 0)); g.alpha_composite(frame(lay, atk, 'down', k), (144, 0))
            frames.append(g.resize((576, 288), Image.NEAREST).convert('P', palette=Image.ADAPTIVE, colors=128))
        for _ in range(4): frames.append(frames[0])
        frames[0].save(OUT + fn + '.gif', save_all=True, append_images=frames[1:], duration=[90] * (len(frames) - 4) + [220] * 4, loop=0, disposal=2)
    out.append({'n': i, 'id': w, 'nombre': n, 'cat': cat, 'gif': bool(atk), 'atk': atk, 'capas': sorted(f'{a}{"/detrás" if b else ""}' for a, b in lay)})
    print(fn, n, atk, sorted(lay))
json.dump(out, open(OUT + 'armas.json', 'w'), ensure_ascii=False)
