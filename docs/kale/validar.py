# Valida plano.json: solapes entre edificios, edificios fuera de la isla, puertas sin camino, caminos que atraviesan edificios, coherencia interior.
import json,sys,math
P=json.load(open(sys.argv[1]));M=P['mapa'];B=P['edificios'];err=[]
def inside(pt,poly):
    x,y=pt;c=False
    for i in range(len(poly)):
        x1,y1=poly[i];x2,y2=poly[(i+1)%len(poly)]
        if (y1>y)!=(y2>y) and x<(x2-x1)*(y-y1)/(y2-y1)+x1:c=not c
    return c
def segs(path):
    for a,b in zip(path,path[1:]):
        n=int(max(abs(b[0]-a[0]),abs(b[1]-a[1]))*4)+1
        for i in range(n+1):yield (a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n)
rects=[(b['id'],b['ext']['x'],b['ext']['y'],b['ext']['w'],b['ext']['d']) for b in B]
for o in M['objetos']:
    if 'w' in o and o['t'] not in('empalizada','grada'):rects.append((o['n'],o['x'],o['y'],o['w'],o['h']))
for i,a in enumerate(rects):
    for b in rects[i+1:]:
        if a[1]<b[1]+b[3] and b[1]<a[1]+a[3] and a[2]<b[2]+b[4] and b[2]<a[2]+a[4]:err.append(f'se pisan: {a[0]} y {b[0]}')
for b in B:
    e=b['ext'];corn=[(e['x'],e['y']),(e['x']+e['w'],e['y']),(e['x'],e['y']+e['d']),(e['x']+e['w'],e['y']+e['d'])]
    if not e.get('pilotes'):
        for c in corn:
            if not inside(c,M['costa']):err.append(f"{b['id']}: esquina {c} fuera de la isla")
    door=(e['x']+e['puerta'],e['y']+e['d'])
    near=min(math.dist(door,p) for c in M['caminos'] for p in segs(c['p']))
    if near>1.2:err.append(f"{b['id']}: la puerta {door} no tiene camino (el más cercano a {near:.1f})")
    for c in M['caminos']:
        for p in segs(c['p']):
            if e['x']+.3<p[0]<e['x']+e['w']-.3 and e['y']+.3<p[1]<e['y']+e['d']-.3:err.append(f"camino {c['n'] or c['p']} atraviesa {b['id']}");break
    if 'int' in b:
        I=b['int']
        for d in I['puertas']:
            if not(0<=d[0]<=I['w'] and 0<=d[1]<=I['h']):err.append(f"{b['id']}: puerta fuera del interior")
        for w in I['ventanas']:
            x,y,o=w[0],w[1],w[2]
            if not(x in(0,I['w']) or y in(0,I['h'])):err.append(f"{b['id']}: ventana {w} no está en una pared exterior")
        for m in I['muebles']:
            if m[1]<0 or m[2]<0 or m[1]+m[3]>I['w']+.01 or m[2]+m[4]>I['h']+.01:err.append(f"{b['id']}: mueble {m[0]} se sale")
print('\n'.join(err) or 'plano sin errores')
