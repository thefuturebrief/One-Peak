# Atlas de armas LPC: arriba, celdas de 64 (caminar filas 0-3, estocada 4-7, caída 8); abajo, el tajo en celdas de 192 (6x4).
# Un archivo para la capa de delante y otro (_tras) para la que va detrás del cuerpo.
import os
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__)); W = S + '/lpc/spritesheets/weapon/'; OUT = '/home/user/one-peak/docs/juego/assets/armas'
T = {  # tipo: {capa: {anim: archivo}}
 'katana': {'f': {'walk': 'sword/saber/walk/saber.png', 'slash': 'sword/saber/attack_slash/saber.png', 'hurt': 'sword/saber/hurt/saber.png'},
            'b': {'walk': 'sword/saber/universal_behind/walk/saber.png', 'slash': 'sword/saber/attack_slash/behind/saber.png', 'hurt': 'sword/saber/universal_behind/hurt/saber.png'}},
 'espada': {'f': {'walk': 'sword/longsword/walk/longsword.png', 'slash': 'sword/longsword/attack_slash/longsword.png', 'hurt': 'sword/longsword/hurt/longsword.png'},
            'b': {'walk': 'sword/longsword/universal_behind/walk/longsword.png', 'slash': 'sword/longsword/attack_slash/behind/longsword.png', 'hurt': 'sword/longsword/universal_behind/hurt/longsword.png'}},
 'estoque': {'f': {'walk': 'sword/rapier/walk/rapier.png', 'slash': 'sword/rapier/attack_slash/rapier.png', 'hurt': 'sword/rapier/hurt/rapier.png'},
             'b': {'walk': 'sword/rapier/universal_behind/walk/rapier.png', 'slash': 'sword/rapier/attack_slash/behind/rapier.png'}},
 'daga': {'f': {'walk': 'sword/dagger/walk/dagger.png', 'slash': 'sword/dagger/slash/dagger.png', 'thrust': 'sword/dagger/thrust/dagger.png', 'hurt': 'sword/dagger/hurt/dagger.png'},
          'b': {'walk': 'sword/dagger/behind/walk/dagger.png', 'slash': 'sword/dagger/behind/slash/dagger.png'}},
 'lanza': {'f': {'walk': 'polearm/spear/foreground/walk/steel.png', 'thrust': 'polearm/spear/foreground/thrust/steel.png', 'hurt': 'polearm/spear/foreground/hurt/steel.png'},
           'b': {'walk': 'polearm/spear/background/walk/steel.png', 'thrust': 'polearm/spear/background/thrust/steel.png', 'hurt': 'polearm/spear/background/hurt/steel.png'}},
 'hacha': {'f': {'walk': 'blunt/waraxe/walk/waraxe.png', 'slash': 'blunt/waraxe/attack_slash/waraxe.png', 'hurt': 'blunt/waraxe/hurt/waraxe.png'},
           'b': {'walk': 'blunt/waraxe/behind/walk/waraxe.png', 'slash': 'blunt/waraxe/attack_slash/behind/waraxe.png'}},
 'maza': {'f': {'walk': 'blunt/mace/walk/mace.png', 'slash': 'blunt/mace/attack_slash/mace.png', 'thrust': 'blunt/mace/thrust/mace.png', 'hurt': 'blunt/mace/hurt/mace.png'},
          'b': {'walk': 'blunt/mace/universal_behind/walk/mace.png', 'slash': 'blunt/mace/attack_slash/behind/mace.png', 'hurt': 'blunt/mace/universal_behind/hurt/mace.png'}},
}
os.makedirs(OUT, exist_ok=True)
for t, layers in T.items():
    for k, anims in layers.items():
        a = Image.new('RGBA', (1152, 576 + 768))
        for an, f in anims.items():
            im = Image.open(W + f).convert('RGBA')
            if an == 'walk': a.paste(im.crop((0, 0, 576, 256)), (0, 0))
            elif an == 'thrust': a.paste(im.crop((0, 0, 512, 256)), (0, 256))
            elif an == 'hurt': a.paste(im.crop((0, 0, 384, 64)), (0, 512))
            elif an == 'slash':
                if im.width == 1152: a.paste(im, (0, 576))
                else:  # tajo en celdas de 64: centrado en celdas de 192
                    for r in range(4):
                        for c in range(6): a.alpha_composite(im.crop((c * 64, r * 64, c * 64 + 64, r * 64 + 64)), (c * 192 + 64, 576 + r * 192 + 64))
        a.save(f"{OUT}/{t}{'' if k == 'f' else '_tras'}.png", optimize=True)
    print(t, list(layers['f']))
