#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reskope Network — police « réseau » fidèle au site.
Reprend EXACTEMENT l'alphabet de src/lib/netfont.js (A-Z, 0-3, ?, &),
tracé monoline (nœuds aux sommets uniquement), et complète l'ensemble
dans le même style : 4-9, minuscules (petites capitales), accents FR,
ponctuation et symboles.

Repère source (netfont) : x →, y ↓, hauteur de capitale = 100,
y=0 en haut, y=100 sur la ligne de base.  Conversion vers la police :
  fontX = x * S            fontY = (100 - y) * S      (S = 7 → cap = 700)

Rendu calé sur le site : nœud r=4 et trait stroke-width=4 (sur cap 100)
  → en police : rayon 28, épaisseur 28.
"""
import math
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen

EM = 1000
S = 7                 # 100 (netfont) -> 700 (cap police)
R = 28                # rayon nœud  = 4 * 7
HW = 14               # demi-épaisseur trait = (4 * 7) / 2
TRACK = 16            # interlettre netfont
LC = 0.72             # échelle des minuscules (petites capitales)
ASC = 760
DESC = -260

# ============================================================
# Alphabet du site (copie conforme de netfont.js)
# n = nœuds [x,y] (y vers le bas) · l = liens [i,j]
# ============================================================
GLYPHS = {
    'A': {'w':64,'n':[[0,100],[32,0],[64,100],[14,57],[50,57]],'l':[[0,1],[1,2],[3,4]]},
    'B': {'w':54,'n':[[0,0],[0,100],[44,16],[44,38],[6,50],[48,64],[48,86]],'l':[[0,1],[0,2],[2,3],[3,4],[4,5],[5,6],[6,1]]},
    'C': {'w':60,'n':[[60,20],[34,0],[8,28],[8,72],[34,100],[60,80]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5]]},
    'D': {'w':58,'n':[[0,0],[0,100],[34,8],[56,38],[56,62],[34,92]],'l':[[0,1],[0,2],[2,3],[3,4],[4,5],[5,1]]},
    'E': {'w':50,'n':[[50,0],[0,0],[0,50],[38,50],[0,100],[50,100]],'l':[[0,1],[1,2],[2,3],[2,4],[4,5]]},
    'F': {'w':50,'n':[[50,0],[0,0],[0,50],[38,50],[0,100]],'l':[[0,1],[1,2],[2,3],[2,4]]},
    'G': {'w':62,'n':[[60,20],[34,0],[8,28],[8,72],[34,100],[60,82],[60,56],[38,56]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7]]},
    'H': {'w':56,'n':[[0,0],[0,100],[56,0],[56,100],[0,50],[56,50]],'l':[[0,1],[2,3],[4,5]]},
    'I': {'w':20,'n':[[10,0],[10,100],[0,0],[20,0],[0,100],[20,100]],'l':[[0,1],[2,3],[4,5]]},
    'J': {'w':44,'n':[[44,0],[44,76],[24,98],[6,80]],'l':[[0,1],[1,2],[2,3]]},
    'K': {'w':54,'n':[[0,0],[0,100],[50,0],[8,54],[50,100]],'l':[[0,1],[2,3],[3,4]]},
    'L': {'w':46,'n':[[0,0],[0,100],[46,100]],'l':[[0,1],[1,2]]},
    'M': {'w':68,'n':[[0,100],[0,0],[34,52],[68,0],[68,100]],'l':[[0,1],[1,2],[2,3],[3,4]]},
    'N': {'w':58,'n':[[0,100],[0,0],[58,100],[58,0]],'l':[[0,1],[1,2],[2,3]]},
    'O': {'w':66,'n':[[33,0],[8,26],[8,74],[33,100],[58,74],[58,26]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]},
    'P': {'w':52,'n':[[0,100],[0,0],[46,14],[46,42],[0,56]],'l':[[0,1],[1,2],[2,3],[3,4]]},
    'Q': {'w':68,'n':[[33,0],[8,26],[8,74],[33,100],[58,74],[58,26],[40,72],[64,102]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[6,7]]},
    'R': {'w':54,'n':[[0,100],[0,0],[46,14],[46,42],[0,56],[50,100]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5]]},
    'S': {'w':54,'n':[[52,16],[28,0],[6,22],[28,48],[48,70],[26,98],[2,82]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
    'T': {'w':54,'n':[[0,0],[54,0],[27,0],[27,100]],'l':[[0,1],[2,3]]},
    'U': {'w':56,'n':[[0,0],[0,68],[28,100],[56,68],[56,0]],'l':[[0,1],[1,2],[2,3],[3,4]]},
    'V': {'w':60,'n':[[0,0],[30,100],[60,0]],'l':[[0,1],[1,2]]},
    'W': {'w':84,'n':[[0,0],[17,100],[42,32],[67,100],[84,0]],'l':[[0,1],[1,2],[2,3],[3,4]]},
    'X': {'w':56,'n':[[0,0],[56,100],[56,0],[0,100],[28,50]],'l':[[0,4],[4,1],[2,4],[4,3]]},
    'Y': {'w':56,'n':[[0,0],[56,0],[28,52],[28,100]],'l':[[0,2],[1,2],[2,3]]},
    'Z': {'w':54,'n':[[0,0],[54,0],[0,100],[54,100]],'l':[[0,1],[1,2],[2,3]]},
    '0': {'w':56,'n':[[28,0],[6,26],[6,74],[28,100],[50,74],[50,26]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]]},
    '1': {'w':30,'n':[[4,22],[22,0],[22,100]],'l':[[0,1],[1,2]]},
    '2': {'w':52,'n':[[4,22],[26,0],[48,22],[4,100],[50,100]],'l':[[0,1],[1,2],[2,3],[3,4]]},
    '3': {'w':52,'n':[[4,14],[30,0],[48,24],[22,50],[48,76],[30,100],[4,86]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
    '?': {'w':46,'n':[[4,20],[24,0],[42,22],[24,48],[24,66],[24,96]],'l':[[0,1],[1,2],[2,3],[3,4]]},
    '&': {'w':60,'n':[[58,100],[20,0],[40,24],[4,58],[22,100],[54,52]],'l':[[1,2],[2,3],[3,4],[4,5],[5,0]]},
}

# ============================================================
# Complément, MÊME style monoline (chiffres 4-9 + ponctuation)
# ============================================================
EXTRA = {
    '4': {'w':56,'n':[[40,0],[40,100],[4,64],[56,64]],'l':[[0,1],[0,2],[2,3]]},
    '5': {'w':54,'n':[[50,0],[4,0],[4,46],[30,40],[52,66],[28,100],[4,82]],'l':[[1,0],[1,2],[2,3],[3,4],[4,5],[5,6]]},
    '6': {'w':58,'n':[[52,18],[30,2],[8,32],[6,66],[26,100],[50,86],[52,62],[30,48],[10,58]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,3]]},
    '7': {'w':56,'n':[[2,0],[54,0],[22,100]],'l':[[0,1],[1,2]]},
    '8': {'w':54,'n':[[27,0],[8,15],[8,37],[27,50],[46,37],[46,15],[46,63],[46,85],[27,100],[8,85],[8,63]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[3,6],[6,7],[7,8],[8,9],[9,10],[10,3]]},
    '9': {'w':58,'n':[[6,82],[28,98],[50,68],[52,34],[32,0],[8,14],[6,38],[28,52],[48,42]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,3]]},
    '.': {'w':14,'n':[[6,90]],'l':[]},
    ',': {'w':16,'n':[[9,88],[1,108]],'l':[[0,1]]},
    ':': {'w':14,'n':[[6,42],[6,84]],'l':[]},
    ';': {'w':16,'n':[[8,42],[8,84],[0,104]],'l':[[1,2]]},
    '!': {'w':14,'n':[[7,0],[7,62],[7,90]],'l':[[0,1]]},
    "'": {'w':14,'n':[[8,0],[2,24]],'l':[[0,1]]},
    '"': {'w':30,'n':[[8,0],[2,24],[24,0],[18,24]],'l':[[0,1],[2,3]]},
    '-': {'w':36,'n':[[2,52],[34,52]],'l':[[0,1]]},
    '–': {'w':46,'n':[[0,52],[46,52]],'l':[[0,1]]},
    '—': {'w':66,'n':[[0,52],[66,52]],'l':[[0,1]]},
    '_': {'w':50,'n':[[0,108],[50,108]],'l':[[0,1]]},
    '(': {'w':30,'n':[[26,-6],[8,28],[8,72],[26,106]],'l':[[0,1],[1,2],[2,3]]},
    ')': {'w':30,'n':[[6,-6],[24,28],[24,72],[6,106]],'l':[[0,1],[1,2],[2,3]]},
    '[': {'w':28,'n':[[24,-6],[8,-6],[8,106],[24,106]],'l':[[0,1],[1,2],[2,3]]},
    ']': {'w':28,'n':[[6,-6],[22,-6],[22,106],[6,106]],'l':[[0,1],[1,2],[2,3]]},
    '{': {'w':30,'n':[[26,-6],[14,8],[14,40],[6,50],[14,60],[14,92],[26,106]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
    '}': {'w':30,'n':[[6,-6],[18,8],[18,40],[26,50],[18,60],[18,92],[6,106]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},
    '/': {'w':38,'n':[[2,106],[36,-6]],'l':[[0,1]]},
    '\\':{'w':38,'n':[[2,-6],[36,106]],'l':[[0,1]]},
    '#': {'w':52,'n':[[18,6],[12,98],[38,6],[32,98],[4,38],[48,38],[2,66],[46,66]],'l':[[0,1],[2,3],[4,5],[6,7]]},
    '%': {'w':60,'n':[[50,4],[8,100],[8,8],[24,8],[24,30],[8,30],[40,72],[56,72],[56,94],[40,94]],'l':[[0,1],[2,3],[3,4],[4,5],[5,2],[6,7],[7,8],[8,9],[9,6]]},
    '+': {'w':48,'n':[[24,30],[24,78],[2,54],[46,54]],'l':[[0,1],[2,3]]},
    '=': {'w':48,'n':[[4,42],[44,42],[4,66],[44,66]],'l':[[0,1],[2,3]]},
    '*': {'w':36,'n':[[18,6],[18,46],[3,15],[33,41],[33,15],[3,41]],'l':[[0,1],[2,3],[4,5]]},
    '<': {'w':46,'n':[[40,14],[6,52],[40,90]],'l':[[0,1],[1,2]]},
    '>': {'w':46,'n':[[6,14],[40,52],[6,90]],'l':[[0,1],[1,2]]},
    '@': {'w':72,'n':[[44,40],[36,30],[26,36],[24,52],[34,60],[44,54],[46,30],[58,72],[36,86],[10,72],[8,30],[33,8],[58,24]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]]},
    '€': {'w':58,'n':[[52,20],[30,6],[10,30],[10,70],[30,94],[52,80],[2,44],[40,44],[2,60],[34,60]],'l':[[0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[8,9]]},
    '£': {'w':54,'n':[[50,18],[30,4],[12,22],[12,50],[4,62],[40,62],[12,74],[10,92],[4,100],[52,100]],'l':[[0,1],[1,2],[2,3],[3,8],[4,5],[8,9]]},
}
# $ = S du site + barre verticale
_s = GLYPHS['S']
EXTRA['$'] = {'w':54,'n':_s['n']+[[27,-8],[27,108]],'l':_s['l']+[[7,8]]}

ALL = {}
ALL.update(GLYPHS)
ALL.update(EXTRA)

# ============================================================
# Noms de glyphes (AGL)
# ============================================================
NAME = {
    ' ':'space','.':'period',',':'comma',':':'colon',';':'semicolon',
    '!':'exclam','?':'question',"'":'quotesingle','"':'quotedbl',
    '-':'hyphen','–':'endash','—':'emdash','_':'underscore',
    '(':'parenleft',')':'parenright','[':'bracketleft',']':'bracketright',
    '{':'braceleft','}':'braceright','/':'slash','\\':'backslash',
    '&':'ampersand','@':'at','#':'numbersign','%':'percent','+':'plus',
    '=':'equal','*':'asterisk','<':'less','>':'greater',
    '€':'Euro','$':'dollar','£':'sterling',
    '0':'zero','1':'one','2':'two','3':'three','4':'four','5':'five',
    '6':'six','7':'seven','8':'eight','9':'nine',
    'é':'eacute','è':'egrave','ê':'ecircumflex','ë':'edieresis',
    'à':'agrave','â':'acircumflex','ä':'adieresis','ç':'ccedilla',
    'î':'icircumflex','ï':'idieresis','ô':'ocircumflex','ö':'odieresis',
    'û':'ucircumflex','ù':'ugrave','ü':'udieresis','œ':'oe',
    'É':'Eacute','È':'Egrave','Ê':'Ecircumflex','Ë':'Edieresis',
    'À':'Agrave','Â':'Acircumflex','Ç':'Ccedilla','Î':'Icircumflex',
    'Ï':'Idieresis','Ô':'Ocircumflex','Û':'Ucircumflex','Ù':'Ugrave',
    'Œ':'OE',
}
def gname(ch):
    return NAME.get(ch, ch)   # A-Z, a-z : nom littéral

# ============================================================
# Géométrie (contours pleins, sens horaire, remplissage nonzero)
# ============================================================
def signed_area(p):
    a = 0.0
    for i in range(len(p)):
        x1,y1 = p[i]; x2,y2 = p[(i+1)%len(p)]
        a += x1*y2 - x2*y1
    return a/2.0

def poly(pen, pts):
    if len(pts) < 3: return
    if signed_area(pts) > 0:
        pts = pts[::-1]
    pen.moveTo((round(pts[0][0]),round(pts[0][1])))
    for q in pts[1:]:
        pen.lineTo((round(q[0]),round(q[1])))
    pen.closePath()

def circle(pen, cx, cy, r, N=18):
    pts = [(cx+r*math.cos(-2*math.pi*k/N), cy+r*math.sin(-2*math.pi*k/N)) for k in range(N)]
    rc = r/math.cos(math.pi/N)
    pen.moveTo((round(pts[0][0]),round(pts[0][1])))
    for k in range(N):
        ac = -2*math.pi*(k+0.5)/N
        ctrl = (cx+rc*math.cos(ac), cy+rc*math.sin(ac))
        nxt = pts[(k+1)%N]
        pen.qCurveTo((round(ctrl[0]),round(ctrl[1])),(round(nxt[0]),round(nxt[1])))
    pen.closePath()

def edge(pen, a, b, hw):
    ax,ay=a; bx,by=b
    dx,dy=bx-ax,by-ay
    L=math.hypot(dx,dy)
    if L<1e-6: return
    ux,uy=dx/L,dy/L; nx,ny=-uy,ux
    poly(pen, [(ax+nx*hw,ay+ny*hw),(bx+nx*hw,by+ny*hw),
               (bx-nx*hw,by-ny*hw),(ax-nx*hw,ay-ny*hw)])

# ============================================================
# Construction d'un glyphe
# ============================================================
def to_font(spec, s):
    """netfont -> nœuds police (mis à l'échelle s), liens, chasse(px)."""
    nodes = [(x*S*s, (100-y)*S*s) for (x,y) in spec['n']]
    return nodes, [list(e) for e in spec['l']], spec['w']*S*s

def add_accent(nodes, edges, kind, s):
    xs=[p[0] for p in nodes]; ys=[p[1] for p in nodes]
    cx=(min(xs)+max(xs))/2.0; top=max(ys); bot=min(ys)
    g=58*s
    base=len(nodes)
    if kind=='acute':
        nodes += [(cx-30*s,top+g),(cx+34*s,top+g+48*s)]; edges += [[base,base+1]]
    elif kind=='grave':
        nodes += [(cx-34*s,top+g+48*s),(cx+30*s,top+g)]; edges += [[base,base+1]]
    elif kind=='circ':
        nodes += [(cx-44*s,top+g),(cx,top+g+60*s),(cx+44*s,top+g)]
        edges += [[base,base+1],[base+1,base+2]]
    elif kind=='dieresis':
        nodes += [(cx-36*s,top+g+22*s),(cx+36*s,top+g+22*s)]   # 2 points isolés
    elif kind=='cedilla':
        nodes += [(cx+4*s,bot+4*s),(cx-6*s,bot-52*s),(cx-60*s,bot-82*s)]
        edges += [[base,base+1],[base+1,base+2]]
    return nodes, edges

def make_glyph(nodes, edges, advance_units, s):
    r=max(2,round(R*s)); hw=max(1,round(HW*s))
    tx=TRACK/2.0*S*s
    nodes=[(x+tx,y) for (x,y) in nodes]
    pen=TTGlyphPen(None)
    for a,b in edges:
        edge(pen, nodes[a], nodes[b], hw)
    xs=[]
    for (x,y) in nodes:
        circle(pen, x, y, r); xs += [x-r, x+r]
    adv=round((advance_units + TRACK*S*s))
    lsb=round(min(xs)) if xs else 0
    g=pen.glyph()
    # coords entières
    c=g.coordinates
    for i in range(len(c)):
        c[i]=(int(round(c[i][0])), int(round(c[i][1])))
    return g, adv, lsb

# ============================================================
# Jeu de caractères à produire
# ============================================================
UPPERS = [c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
DIGITS = [c for c in '0123456789']
PUNCT  = list(".,:;!?'\"-–—_()[]{}/\\&@#%+=*<>€$£")

ACC = {  # accentué -> (base, type, casse_haute)
    'é':('E','acute',0),'è':('E','grave',0),'ê':('E','circ',0),'ë':('E','dieresis',0),
    'à':('A','grave',0),'â':('A','circ',0),'ä':('A','dieresis',0),'ç':('C','cedilla',0),
    'î':('I','circ',0),'ï':('I','dieresis',0),'ô':('O','circ',0),'ö':('O','dieresis',0),
    'û':('U','circ',0),'ù':('U','grave',0),'ü':('U','dieresis',0),
    'É':('E','acute',1),'È':('E','grave',1),'Ê':('E','circ',1),'Ë':('E','dieresis',1),
    'À':('A','grave',1),'Â':('A','circ',1),'Ç':('C','cedilla',1),'Î':('I','circ',1),
    'Ï':('I','dieresis',1),'Ô':('O','circ',1),'Û':('U','circ',1),'Ù':('U','grave',1),
}

order=['.notdef']; glyphs={}; metrics={}; cmap={}

# .notdef
pen=TTGlyphPen(None)
poly(pen, [(60,0),(60,700),(400,700),(400,0)])
poly(pen, [(110,50),(350,50),(350,650),(110,650)])
glyphs['.notdef']=pen.glyph(); metrics['.notdef']=(460,60);

def register(ch, glyph, adv, lsb):
    nm=gname(ch)
    if nm in glyphs: return
    glyphs[nm]=glyph; metrics[nm]=(adv,lsb)
    order.append(nm); cmap[ord(ch)]=nm

# espace
g=TTGlyphPen(None).glyph()
glyphs['space']=g; metrics['space']=(round((38+TRACK)*S),0)
order.append('space'); cmap[ord(' ')]='space'

# Majuscules + chiffres + ponctuation (échelle 1)
for ch in UPPERS+DIGITS+PUNCT:
    nodes,edges,w = to_font(ALL[ch], 1.0)
    g,adv,lsb = make_glyph(nodes,edges,w,1.0)
    register(ch,g,adv,lsb)

# Minuscules = petites capitales (échelle LC)
for up in UPPERS:
    nodes,edges,w = to_font(ALL[up], LC)
    g,adv,lsb = make_glyph(nodes,edges,w,LC)
    register(up.lower(),g,adv,lsb)

# Lettres accentuées (composées)
for ch,(base,kind,upper) in ACC.items():
    s = 1.0 if upper else LC
    nodes,edges,w = to_font(ALL[base], s)
    nodes,edges = add_accent(nodes,edges,kind,s)
    g,adv,lsb = make_glyph(nodes,edges,w,s)
    register(ch,g,adv,lsb)

# Apostrophe typographique (U+2019) + guillemet simple ouvrant (U+2018)
# + prime (U+02BC) : tous rendus par le glyphe apostrophe déjà tracé.
for _cp in (0x2019, 0x2018, 0x02BC):
    cmap[_cp] = 'quotesingle'

# Ligatures œ / Œ
def ligature(c1,c2,s):
    n1,e1,w1 = to_font(ALL[c1], s)
    n2,e2,w2 = to_font(ALL[c2], s)
    gap = (ALL[c1]['w'] + 10) * S * s
    n2 = [(x+gap,y) for (x,y) in n2]
    off=len(n1)
    edges = e1 + [[a+off,b+off] for (a,b) in e2]
    nodes = n1 + n2
    w_units = gap + w2
    return nodes,edges,w_units
for ch,(c1,c2,up) in {'Œ':('O','E',1),'œ':('O','E',0)}.items():
    s = 1.0 if up else LC
    nodes,edges,w = ligature(c1,c2,s)
    g,adv,lsb = make_glyph(nodes,edges,w,s)
    register(ch,g,adv,lsb)

# ============================================================
# Assemblage
# ============================================================
fb=FontBuilder(EM, isTTF=True)
fb.setupGlyphOrder(order)
fb.setupCharacterMap(cmap)
fb.setupGlyf(glyphs)
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=900, descent=-320)
fb.setupNameTable({
    "familyName":"Reskope Network","styleName":"Regular",
    "fullName":"Reskope Network Regular","psName":"ReskopeNetwork-Regular",
    "version":"Version 2.0","copyright":"Reskope — Florian Bouchart",
})
fb.setupOS2(sTypoAscender=ASC, sTypoDescender=DESC, sTypoLineGap=90,
            usWinAscent=900, usWinDescent=320)
fb.setupPost()
fb.font.save("Reskope-Network.ttf")
print("OK — %d glyphes -> Reskope-Network.ttf" % (len(order)-1))
