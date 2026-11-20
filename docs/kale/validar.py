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
rects=[(b['id'],b['ext']['x'],b['ext']['y'],b['ext']['w'],b['ext']['d']) for b in B if not b.get('oculto')]
for o in M['objetos']:
    if 'w' in o and o['t'] not in('empalizada','grada','muralla'):rects.append((o['n'],o['x'],o['y'],o['w'],o['h']))
for i,a in enumerate(rects):
    for b in rects[i+1:]:
        if a[1]<b[1]+b[3] and b[1]<a[1]+a[3] and a[2]<b[2]+b[4] and b[2]<a[2]+a[4]:err.append(f'se pisan: {a[0]} y {b[0]}')
for o in M['objetos']:
    if o['t']!='muralla':continue
    for b in B:
        e=b['ext']
        if b.get('oculto'):continue
        inside_x=o['x']<e['x']+e['w'] and e['x']<o['x']+o['w'];inside_y=o['y']<e['y']+e['d'] and e['y']<o['y']+o['h']
        if inside_x and inside_y and not(o['x']+.6<=e['x'] and e['x']+e['w']<=o['x']+o['w']-.6 and o['y']+.6<=e['y'] and e['y']+e['d']<=o['y']+o['h']-.6):err.append(f"{b['id']} pisa la muralla")
for b in B:
    if b.get('oculto'):continue  # solo interior (la batería de la muralla): se entra por un objeto, no por una puerta de calle
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

# cuartos: sin superponerse, cada puerta une dos cuartos (o un cuarto con la calle) y todos se alcanzan desde la entrada
def room_at(rooms,x,y):
    return next((i for i,(n,rx,ry,rw,rh,f) in enumerate(rooms) if rx<x<rx+rw and ry<y<ry+rh),None)
for b in B:
    if 'int' not in b: continue
    I=b['int'];rooms=I['cuartos']
    for i,a in enumerate(rooms):
        for c in rooms[i+1:]:
            if a[1]<c[1]+c[3]-1e-6 and c[1]<a[1]+a[3]-1e-6 and a[2]<c[2]+c[4]-1e-6 and c[2]<a[2]+a[4]-1e-6:err.append(f"{b['id']}: se superponen {a[0]} y {c[0]}")
    edges={};start=None
    for x,y,o,ln,to in I['puertas']:
        m=(x+ln/2,y) if o=='h' else (x,y+ln/2)
        sides=[room_at(rooms,m[0],m[1]-.3),room_at(rooms,m[0],m[1]+.3)] if o=='h' else [room_at(rooms,m[0]-.3,m[1]),room_at(rooms,m[0]+.3,m[1])]
        sides=[s for s in sides if s is not None]
        if not sides:err.append(f"{b['id']}: la puerta {[x,y]} no da a ningún cuarto")
        if len(sides)==1:start=sides[0]
        if len(sides)==2:edges.setdefault(sides[0],set()).add(sides[1]);edges.setdefault(sides[1],set()).add(sides[0])
    # cuartos sin pared entre ellos o con el mismo nombre cuentan como conectados
    def covered(x1,y1,x2,y2):
        return any((y1==y2 and wy1==wy2==y1 and min(wx1,wx2)<=x1 and max(wx1,wx2)>=x2) or (x1==x2 and wx1==wx2==x1 and min(wy1,wy2)<=y1 and max(wy1,wy2)>=y2) for wx1,wy1,wx2,wy2 in I['paredes'])
    for i,a in enumerate(rooms):
        for j,c in enumerate(rooms):
            if i>=j:continue
            link=a[0]==c[0]
            for (p,q) in ((a,c),(c,a)):
                if abs(p[1]+p[3]-q[1])<1e-6:
                    lo,hi=max(p[2],q[2]),min(p[2]+p[4],q[2]+q[4])
                    if hi-lo>1e-6 and not covered(q[1],lo,q[1],hi):link=True
                if abs(p[2]+p[4]-q[2])<1e-6:
                    lo,hi=max(p[1],q[1]),min(p[1]+p[3],q[1]+q[3])
                    if hi-lo>1e-6 and not covered(lo,q[2],hi,q[2]):link=True
            if link:edges.setdefault(i,set()).add(j);edges.setdefault(j,set()).add(i)
    if start is None:err.append(f"{b['id']}: no tiene puerta a la calle");continue
    seen={start};st=[start]
    while st:
        k=st.pop()
        for n in edges.get(k,()):
            if n not in seen:seen.add(n);st.append(n)
    for i,r in enumerate(rooms):
        if i not in seen:err.append(f"{b['id']}: no se puede llegar a {r[0]}")
print('\n'.join(err) or 'plano sin errores')
