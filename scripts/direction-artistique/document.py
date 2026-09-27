# -*- coding: utf-8 -*-
"""Direction artistique Reskope, en .docx (Word), écrit sans bibliothèque :
un paquet OOXML (zip) avec document, styles, puces, pied de page et images.
Les images viennent de visuels.py (à lancer avant), des cartes de visite
et de l'image de partage du site."""
import os, re, zipfile, datetime
from xml.sax.saxutils import escape
from PIL import Image

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOT = os.path.dirname(os.path.dirname(ICI))
DA = os.path.join(ICI, 'visuels')
CARTES = os.path.join(DEPOT, 'Impression', 'Cartes de visite')
SORTIE = os.path.join(DEPOT, 'Impression', 'Reskope - Direction artistique.docx')
NB = ' '

def typo(t):
    t = re.sub(r'(?<=\S) ([:;!?])', NB + r'\1', t)
    return t.replace('« ', '«' + NB).replace(' »', NB + '»').replace("'", '’')

FONT = 'Avenir Next'
INDIGO, ENCRE, GRIS = '1C0CB3', '0E0B1F', '5C5951'

# ── les images ─────────────────────────────────────────────
images = []  # (rId, nom, chemin)
def image(chemin, largeur_cm):
    rid = f'rIdImg{len(images) + 1}'
    nom = f'image{len(images) + 1}.png'
    images.append((rid, nom, chemin))
    w, h = Image.open(chemin).size
    cx = int(largeur_cm * 360000)
    cy = int(cx * h / w)
    n = len(images)
    return (f'<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="{cx}" cy="{cy}"/>'
            f'<wp:docPr id="{n}" name="Image {n}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>'
            f'<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic>'
            f'<pic:nvPicPr><pic:cNvPr id="{n}" name="{nom}"/><pic:cNvPicPr/></pic:nvPicPr>'
            f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
            f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
            f'</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>')

# ── les briques de texte ───────────────────────────────────
def run(texte, gras=False, couleur=None, taille=None, italique=False):
    rpr = ''
    if gras: rpr += '<w:b/>'
    if italique: rpr += '<w:i/>'
    if couleur: rpr += f'<w:color w:val="{couleur}"/>'
    if taille: rpr += f'<w:sz w:val="{taille * 2}"/><w:szCs w:val="{taille * 2}"/>'
    return f'<w:r>{"<w:rPr>" + rpr + "</w:rPr>" if rpr else ""}<w:t xml:space="preserve">{escape(typo(texte))}</w:t></w:r>'

def riche(texte, **k):
    """**gras** en ligne."""
    morceaux = re.split(r'(\*\*[^*]+\*\*)', texte)
    return ''.join(run(m[2:-2], gras=True, **k) if m.startswith('**') else run(m, **k) for m in morceaux if m)

def p(texte='', style=None, centre=False, apres=None, avant=None, runs=None, fond=None, couleur=None):
    ppr = ''
    if style: ppr += f'<w:pStyle w:val="{style}"/>'
    if fond: ppr += f'<w:shd w:val="clear" w:color="auto" w:fill="{fond}"/>'
    if avant is not None or apres is not None:
        av = '' if avant is None else ' w:before="%s"' % avant
        ap = '' if apres is None else ' w:after="%s"' % apres
        ppr += '<w:spacing' + av + ap + '/>'
    if centre: ppr += '<w:jc w:val="center"/>'
    contenu = runs if runs is not None else riche(texte, couleur=couleur)
    return f'<w:p>{"<w:pPr>" + ppr + "</w:pPr>" if ppr else ""}{contenu}</w:p>'

def h1(t): return p(t, 'Titre1')
def h2(t): return p(t, 'Titre2')
def puce(t): return f'<w:p><w:pPr><w:pStyle w:val="Puce"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr></w:pPr>{riche(t)}</w:p>'
def saut(): return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
def img(chemin, cm, centre=True):
    jc = '<w:jc w:val="center"/>' if centre else ''
    return '<w:p><w:pPr><w:spacing w:before="120" w:after="200"/>' + jc + '</w:pPr>' + image(chemin, cm) + '</w:p>'
def legende(t): return p(t, 'Legende', centre=True)

def tableau(lignes, largeurs_cm, entete=True, fonds=None, bordures=True):
    tw = [int(c * 567) for c in largeurs_cm]
    bord = ('<w:tblBorders>' + ''.join(f'<w:{c} w:val="single" w:sz="4" w:space="0" w:color="D9D6CE"/>' for c in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV')) + '</w:tblBorders>') if bordures else \
        ('<w:tblBorders>' + ''.join(f'<w:{c} w:val="nil"/>' for c in ('top', 'left', 'bottom', 'right', 'insideH', 'insideV')) + '</w:tblBorders>')
    x = f'<w:tbl><w:tblPr><w:tblW w:w="{sum(tw)}" w:type="dxa"/><w:jc w:val="center"/>{bord}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="110" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="110" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>'
    x += ''.join(f'<w:gridCol w:w="{w}"/>' for w in tw) + '</w:tblGrid>'
    for i, ligne in enumerate(lignes):
        x += '<w:tr>'
        for j, cel in enumerate(ligne):
            fond = None
            texte_coul = None
            if entete and i == 0:
                fond, texte_coul = INDIGO, 'F0EEE8'
            elif fonds and fonds.get((i, j)):
                fond, texte_coul = fonds[(i, j)]
            shd = f'<w:shd w:val="clear" w:color="auto" w:fill="{fond}"/>' if fond else ''
            contenu = cel if cel.startswith('<w:') else p(cel, 'Cellule', runs=riche(cel, couleur=texte_coul) if texte_coul else None)
            x += f'<w:tc><w:tcPr><w:tcW w:w="{tw[j]}" w:type="dxa"/>{shd}<w:vAlign w:val="center"/></w:tcPr>{contenu}</w:tc>'
        x += '</w:tr>'
    return x + '</w:tbl>' + p('', apres=120)

# ── les couleurs ───────────────────────────────────────────
def rvb(h): return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
def cmjn(h):
    r, g, b = (v / 255 for v in rvb(h))
    k = 1 - max(r, g, b)
    if k >= 1: return (0, 0, 0, 100)
    c, m, y = ((1 - v - k) / (1 - k) for v in (r, g, b))
    return tuple(round(v * 100) for v in (c, m, y, k))
def lum(h):
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (f(v / 255) for v in rvb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
def contraste(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)
def mele(a, b, t):  # t de a dans b
    return ''.join(f'{round(x * t + y * (1 - t)):02X}' for x, y in zip(rvb(a), rvb(b)))

COULEURS = [
    ('Indigo', '1C0CB3', 'La marque : logo, boutons, liens, bande du moment fort.'),
    ('Crème', 'F0EEE8', 'Le fond du site et des supports.'),
    ('Encre', '0E0B1F', 'Le texte.'),
    ('Soleil', 'F2A93B', 'L’espace « en projet », le client idéal, le moment clé.'),
    ('Menthe', '2FAE8E', 'L’espace TPE, le quotidien, ce que ça rapporte.'),
    ('Ciel', '3B9DE8', 'L’espace PME, les chiffres, là où toucher la personne.'),
    ('Corail', 'EF6F5E', 'Ce qui compte pour elle, ce que ça évite.'),
    ('Lilas', '8B7FF0', 'Le business plan, les premiers clients.'),
]

# ── le corps du document ───────────────────────────────────
b = []
b.append(p('', apres=600))
b.append(img(os.path.join(DA, 'logo-creme.png'), 16))
b.append(p('Direction artistique', 'Titre', centre=True))
b.append(p('Reskope · version du 28 septembre 2026', 'SousTitre', centre=True))
b.append(p('', apres=300))
b.append(p('Ce document fixe la façon dont Reskope se montre : le logo, les couleurs, la typographie, le réseau, les volumes, le mouvement, la mise en page, les images et le ton. Il vaut pour le site, les cartes de visite, le livret et le motion design.', 'Chapeau', centre=True))
b.append(saut())

b.append(h1('L’essentiel, en une page'))
b.append(p('**La marque en une phrase :** On vous aide à décider, et on construit la suite.', 'Encadre', fond='ECE7F9'))
for t in [
    '**Un monde en réseau.** Des nœuds et des liens, partout : ils portent l’information, jamais la décoration.',
    '**L’indigo et le crème font la marque.** Cinq couleurs servent à expliquer, et seulement à ça.',
    '**Tout arrive de la profondeur et flotte.** Rien n’entre à plat.',
    '**Au centre, ou dans de bonnes cases.** Jamais un bloc calé sur un bord ; un fond qui aide à lire.',
    '**Trois publics, trois façons de parler :** la personne qui crée ou reprend, la TPE, la PME.',
    '**Ce qui se clique se voit,** et réagit au survol.',
    '**On le dit franchement :** les exemples sont signalés, les portraits générés aussi.',
]:
    b.append(puce(t))
b.append(saut())

b.append(h1('Le logo'))
b.append(p('Le R de Reskope est un réseau : six nœuds, six liens. Le nœud de jonction, au milieu du fût, est plus gros : c’est là que tout se relie. À côté, le nom en Reskope Sans SemiBold, notre police, serré d’un cheveu (−2 %).'))
b.append(tableau([[img(os.path.join(DA, 'logo-creme.png'), 8.1), img(os.path.join(DA, 'logo-indigo.png'), 8.1)]], [8.5, 8.5], entete=False, bordures=False))
b.append(legende('Indigo sur crème ; crème sur indigo. En noir et blanc : encre sur blanc.'))
b.append(img(os.path.join(DA, 'logo-construction.png'), 16.5))
b.append(legende('La construction du R et du logo horizontal.'))
b.append(h2('Les règles'))
for t in [
    '**Les proportions du R ne changent jamais :** pour un R de 92 de haut (du nœud du haut au nœud du bas), des traits de 3, des nœuds de 5,5 de rayon, une jonction de 7. On l’agrandit ou on le réduit, on n’épaissit jamais ses traits.',
    '**Le logo horizontal suit l’en-tête du site :** le R fait 1,2 fois la hauteur des capitales du nom, il est centré sur elles, et le nom commence à une hauteur de capitale de ses nœuds de droite.',
    '**Les fichiers** (le R seul, le logo horizontal, le nom seul, en indigo, crème et encre) sont dans le dossier « logo » du site, texte vectorisé : ils s’ouvrent partout, même sans la police.',
    '**L’icône d’onglet** reprend le R crème sur un carré indigo arrondi ; seule entorse, ses traits sont un peu renforcés pour rester lisibles à 16 pixels.',
    '**Zone de protection :** un espace libre égal à la moitié de la hauteur du R, tout autour.',
    '**Taille minimale :** le R seul, 24 px à l’écran et 6 mm à l’impression ; avec le nom, 90 px et 22 mm.',
    '**Sur téléphone,** le R porte seul la marque dans l’en-tête : il y est plus grand (34 px).',
    '**Jamais :** déformé, incliné, ombré, en dégradé, dans une autre couleur que l’indigo, le crème ou l’encre, ni posé sur une photo chargée.',
]:
    b.append(puce(t))
b.append(saut())

b.append(h1('Les couleurs'))
b.append(p('La marque reste bleue et blanche : l’indigo et le crème. Pour expliquer, cinq couleurs de plus ; chacune dit une chose, dans les schémas, et chaque espace du site en porte une en accent.'))
b.append(img(os.path.join(DA, 'palette.png'), 16.5))
lignes = [['Couleur', 'Hexa', 'RVB', 'CMJN indicatif', 'Rôle']]
fonds = {}
for i, (n, h, role) in enumerate(COULEURS, start=1):
    c, m, y, k = cmjn(h)
    texte = 'F0EEE8' if lum(h) < 0.25 else ENCRE
    lignes.append([n, f'#{h}', ' '.join(str(v) for v in rvb(h)), f'C{c} M{m} J{y} N{k}', role])
    fonds[(i, 0)] = (h, texte)
b.append(tableau(lignes, [2.4, 2.2, 2.6, 3.4, 6.4], fonds=fonds))
b.append(p('Le CMJN est une conversion directe, à valider sur un bon à tirer : l’indigo ternit souvent à l’impression. Pour un indigo plus vif, tester C 100 M 90 J 0 N 0.', 'Petit'))
b.append(h2('Les règles'))
for t in [
    'L’indigo porte la marque et les actions : boutons, liens, bande du moment fort.',
    'Les couleurs d’explication ne décorent jamais un titre ni un bouton.',
    'Un espace, un accent : **soleil** pour « en projet », **menthe** pour les TPE, **ciel** pour les PME.',
    'Une mission, une couleur : le client idéal au soleil, le business plan au lilas, le dossier au ciel, les clients à la menthe.',
    'Les bandes de fond sont des versions pâles (16 à 18 % de la couleur sur le crème) : deux ou trois par page au plus, et une bande indigo pour le moment fort.',
]:
    b.append(puce(t))
b.append(h2('La lisibilité'))
pales = [('Crème', 'F0EEE8'), ('Soleil pâle', mele('F2A93B', 'F0EEE8', 0.18)), ('Menthe pâle', mele('2FAE8E', 'F0EEE8', 0.16)), ('Ciel pâle', mele('3B9DE8', 'F0EEE8', 0.16)), ('Indigo', '1C0CB3')]
lignes = [['Fond', 'Encre', 'Indigo', 'Gris soutenu', 'Crème']]
fonds = {}
for i, (n, f) in enumerate(pales, start=1):
    txt = 'F0EEE8' if lum(f) < 0.25 else ENCRE
    fonds[(i, 0)] = (f, txt)
    lignes.append([n] + [f'{contraste(c, f):.1f} : 1' for c in (ENCRE, INDIGO, GRIS, 'F0EEE8')])
b.append(tableau(lignes, [3.4, 3.2, 3.2, 3.2, 3.2], fonds=fonds))
b.append(p('Seuil à respecter : 4,5 : 1 pour le texte courant. Sur les bandes pâles, le texte secondaire prend le gris soutenu (#5C5951) ; sur l’indigo, le texte est crème.', 'Petit'))
b.append(saut())

b.append(h1('La typographie'))
b.append(img(os.path.join(DA, 'typo.png'), 16.5))
for t in [
    '**Reskope Sans** pour tout le texte : Regular 400 pour lire, Medium 500 pour les liens et les étiquettes, SemiBold 600 pour les titres. Elle existe aussi en Light 300 et en Bold 700.',
    '**Reskope Network**, la police dessinée en réseau, pour le nom de la marque et quelques grands mots : jamais pour du texte courant.',
    '**Échelle du site :** titre de page 2,3 à 4,8 rem ; titre de section 1,75 à 3 rem ; texte 1 à 1,12 rem ; interligne 1,6 à 1,7 ; 60 à 70 signes par ligne.',
    '**Écriture :** espace insécable avant « : ; ! ? » et dans les guillemets français ; pas de tiret cadratin ; pas de petites capitales espacées au-dessus des titres ; « vous » pour le lecteur, « on » pour Reskope.',
]:
    b.append(puce(t))
b.append(p('**Nos deux polices sont à nous.** Reskope Sans pour le texte et Reskope Network pour les grands mots sont dessinées pour la marque : aucune licence à payer. Pour les installer dans Word, Pages ou Canva, les fichiers sont dans le dossier « Typographie Sans » du projet.', 'Encadre', fond='FBEBD1'))
b.append(saut())

b.append(h1('Le réseau'))
b.append(p('Le réseau est la langue de la marque. Un nœud, c’est une chose ; un lien, une relation ; une couleur, une catégorie. Il a trois usages.'))
for t in [
    '**La trame :** en fond, très légère, peu dense ; elle reste sur les bords des bandes et ne passe jamais derrière un texte à lire. La souris l’attire, jamais un doigt.',
    '**Les schémas :** le réseau porte l’information, par exemple la taille d’une entreprise (un nœud, sept, vingt-six), le client idéal et ses centres d’intérêt, le business plan et ses cinq parties.',
    '**Le mot-symbole :** le R, et « Reskope » écrit en police réseau.',
]:
    b.append(puce(t))
b.append(img(os.path.join(DA, 'ecran-aiguillage.png'), 16.5))
b.append(legende('L’entrée du site : trois tailles d’entreprise, dessinées en réseau.'))
b.append(img(os.path.join(DA, 'ecran-livrable.png'), 16.5))
b.append(legende('Le livrable « votre client idéal » : ses centres d’intérêt en constellation, sa journée en réseau.'))
b.append(saut())

b.append(h1('Les volumes'))
b.append(p('Les chiffres et les étapes se posent en volume, en axonométrie à 30°, comme sur une maquette. Trois faces d’indigo : dessus #5B4BE6, droite #1C0CB3, gauche #130982. Un volume plein, c’est vérifié ; en fil de fer, pas encore. Les couleurs d’explication s’y posent quand elles portent un sens : ce que ça évite en corail, ce que ça rapporte en menthe.'))
b.append(img(os.path.join(DA, 'ecran-balance.png'), 16.5))
b.append(legende('« Un investissement léger, et des gains qui se voient » : un bloc pour la mission, une pile pour ce qu’elle évite et rapporte.'))

b.append(h1('Le mouvement'))
for t in [
    '**Tout arrive de la profondeur** et se redresse ; rien n’entre à plat par un simple glissement.',
    '**Trois entrées, pour varier :** la profondeur, le pivot (depuis le côté, comme une porte qu’on pousse), la bascule (depuis le haut, vers l’avant).',
    '**Les schémas se construisent :** les traits se tracent, les nœuds apparaissent, un influx parcourt les liens.',
    '**Les liens :** aucun soulignement au repos. Au survol, un trait se dessine de gauche à droite, puis un fond léger monte derrière le texte ; les flèches avancent, les cartes s’inclinent en volume sous la souris.',
    '**Rythme :** 0,3 à 1,1 seconde, des courbes douces ; le mouvement suit la lecture, il ne la retarde jamais.',
    '**Mouvement réduit :** si le visiteur l’a demandé, tout reste lisible et à sa place, sans animation.',
]:
    b.append(puce(t))
b.append(saut())

b.append(h1('La mise en page'))
for t in [
    '**Chaque section s’ouvre par une phrase d’amorce,** centrée ; le détail suit dessous.',
    '**Une colonne de lecture au centre** (42 rem, soit 60 à 70 signes) ; les schémas prennent une colonne plus large (64 rem), toujours au centre.',
    '**De bonnes cases** pour ce qui se clique : cartes et tuiles, avec un bouton visible (« Entrer → »).',
    '**Des espaces réguliers :** un bloc est à égale distance de ce qui le précède et de ce qui le suit.',
    '**Des bandes de couleur** pour rythmer : un fond pâle pour ce qu’on reçoit ou ce que ça coûte, une bande indigo pour le moment fort.',
    '**Le menu occupe tout l’écran,** de haut en bas, sur téléphone comme sur ordinateur : l’en-tête s’efface quand il s’ouvre, et le menu porte sa propre croix.',
    '**La croix parle réseau, comme le burger :** quatre liens partis d’un nœud central, un nœud au bout de chacun. Elle se construit à l’ouverture du menu, et ses bras se resserrent au survol. Toutes les croix de fermeture du site sont celle-ci.',
]:
    b.append(puce(t))
b.append(img(os.path.join(DA, 'ecran-bp.png'), 16.5))
b.append(legende('La bande indigo du moment fort : le business plan, en réseau.'))
b.append(img(os.path.join(DA, 'ecran-menu.png'), 16.5))
b.append(legende('Le menu : sa croix, les trois espaces en tuiles, les missions, les pages, sur toute la hauteur.'))
b.append(saut())

b.append(h1('Les images'))
for t in [
    '**Des photos de reportage :** une personne au travail, dans son lieu réel, en lumière naturelle. Jamais de pose de banque d’images, jamais un écran seul.',
    '**Les portraits d’exemple sont générés,** et on le dit sous l’image. On les recadre pour écarter les détails qui trahissent (écritures, écrans, étiquettes) et on les garde petits sur téléphone.',
    '**L’équipe :** fond clair, cadrage aux épaules, regard franc.',
]:
    b.append(puce(t))

b.append(h1('Le ton'))
b.append(p('Trois publics, trois façons de parler. Toujours « vous » et « on », des phrases simples, jamais en mode vendeur ; on dit aussi ce qu’on ne fait pas.'))
b.append(tableau([
    ['Public', 'Ton', 'Exemple', 'Couleur'],
    ['En projet (créer, reprendre)', 'Chaleureux et concret. « Votre projet », « vos futurs clients », jamais de méthode dans les mots.', '« On trouve le client qui fera vivre votre projet. »', 'Soleil'],
    ['TPE, de 1 à 10 personnes', 'Direct et pratique. Des phrases courtes, des durées, des résultats.', '« Vous arrêtez de rappeler le soir. »', 'Menthe'],
    ['PME, de 10 à 250 personnes', 'Posé et chiffré. Du temps gagné, des coûts, des équipes, des sources.', '« Vos équipes perdent des heures dans leurs outils. On vous dit combien, et où. »', 'Ciel'],
], [3.6, 5.2, 5.4, 2.8], fonds={(1, 3): ('F2A93B', ENCRE), (2, 3): ('2FAE8E', ENCRE), (3, 3): ('3B9DE8', ENCRE)}))
b.append(saut())

b.append(h1('Les supports'))
b.append(h2('Les cartes de visite'))
b.append(p('85 × 55 mm. Au recto, sur l’indigo : le logo horizontal en haut à gauche, exactement celui de l’en-tête ; le nom, ce que la personne mène, ses coordonnées ; un grand R en filigrane, avec la trame. Au verso, sur le crème : le R, le nom, la phrase de marque. Aucun filet horizontal, l’adresse reskope.fr. Fichiers prêts pour l’imprimeur dans « Impression / Cartes de visite ».'))
b.append(tableau([[img(os.path.join(CARTES, 'apercu-florian-recto.png'), 8.1), img(os.path.join(CARTES, 'apercu-florian-verso.png'), 8.1)],
                  [img(os.path.join(CARTES, 'apercu-thomy-recto.png'), 8.1), img(os.path.join(CARTES, 'apercu-thomy-verso.png'), 8.1)]], [8.5, 8.5], entete=False, bordures=False))
b.append(h2('L’image de partage'))
b.append(p('La vignette qui s’affiche quand on colle le lien du site sur LinkedIn ou dans un message : le logo, la phrase de marque, les trois espaces avec leurs couleurs, le grand R en filigrane.'))
b.append(img(os.path.join(DEPOT, 'public', 'og-image.png'), 14))
b.append(h2('Le site'))
b.append(p('Une entrée qui pose une seule question (« Où en est votre entreprise ? »), trois espaces, un sélecteur toujours visible à côté du logo.'))
b.append(img(os.path.join(DA, 'ecran-tuiles.png'), 14))
b.append(h2('Le livret'))
b.append(p('Un livret complet de 20 pages et un livret de 8 pages par espace, en A4 : la bande sable en bas de page, les cadres à nœuds et les volumes du site. Ils se régénèrent à partir des données du site, dans « Impression / Livrets ».'))
b.append(h2('Les films'))
b.append(p('Trois films verticaux de 24 à 26 secondes, un par espace, en vraie 3D et avec leur musique originale, en 9:16 et en 4:5, prêts à poster. Chacun finit sur le logo, la phrase de marque et reskope.fr.'))

b.append(h1('Ce qu’on ne fait jamais'))
for t in [
    'Déformer ou recolorer le logo, ou épaissir les traits du R.',
    'Dessiner une croix de fermeture sans ses nœuds : comme le burger, elle parle réseau.',
    'Utiliser une couleur d’explication pour décorer.',
    'Faire entrer un élément à plat, sans profondeur.',
    'Caler un bloc sur un bord, ou poser un texte sur un fond qui gêne la lecture.',
    'Écrire en petites capitales espacées au-dessus d’un titre, ou avec des tirets cadratins.',
    'Montrer un exemple ou un portrait généré sans le dire.',
    'Souligner un texte par défaut, ou laisser un lien sans réaction au survol.',
    'Tracer des filets horizontaux pour séparer : l’espace et les bandes suffisent.',
]:
    b.append(puce(t))

corps = ''.join(b)

NS = ('xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" '
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" '
      'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" '
      'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" '
      'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"')
document = (f'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document {NS}><w:body>{corps}'
            '<w:sectPr><w:footerReference w:type="default" r:id="rIdPied"/><w:pgSz w:w="11906" w:h="16838"/>'
            '<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>'
            '<w:titlePg/></w:sectPr></w:body></w:document>')

def style(sid, nom, taille, couleur=ENCRE, gras=False, avant=0, apres=120, jc=None, base='Normal', interligne=None, italique=False, garde=False):
    ligne = (' w:line="%s" w:lineRule="auto"' % interligne) if interligne else ''
    aligne = ('<w:jc w:val="%s"/>' % jc) if jc else ''
    garder = '<w:keepNext/>' if garde else ''
    return (f'<w:style w:type="paragraph" w:styleId="{sid}"><w:name w:val="{nom}"/><w:basedOn w:val="{base}"/><w:qFormat/>'
            f'<w:pPr>{garder}<w:spacing w:before="{avant}" w:after="{apres}"{ligne}/>{aligne}</w:pPr>'
            f'<w:rPr><w:rFonts w:ascii="{FONT}" w:hAnsi="{FONT}" w:cs="{FONT}" w:eastAsia="{FONT}"/>{"<w:b/>" if gras else ""}{"<w:i/>" if italique else ""}<w:color w:val="{couleur}"/><w:sz w:val="{taille * 2}"/><w:szCs w:val="{taille * 2}"/></w:rPr></w:style>')

styles = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
          '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
          f'<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="{FONT}" w:hAnsi="{FONT}" w:cs="{FONT}" w:eastAsia="{FONT}"/>'
          f'<w:color w:val="{ENCRE}"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="fr-FR"/></w:rPr></w:rPrDefault>'
          '<w:pPrDefault><w:pPr><w:spacing w:after="140" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>'
          f'<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:rPr><w:rFonts w:ascii="{FONT}" w:hAnsi="{FONT}" w:cs="{FONT}" w:eastAsia="{FONT}"/></w:rPr></w:style>'
          + style('Titre', 'Title', 40, ENCRE, True, 240, 80, 'center')
          + style('SousTitre', 'Subtitle', 13, GRIS, False, 0, 120, 'center')
          + style('Chapeau', 'Chapeau', 12, GRIS, False, 0, 160, 'center', interligne=320)
          + style('Titre1', 'heading 1', 22, INDIGO, True, 240, 200, garde=True)
          + style('Titre2', 'heading 2', 14, ENCRE, True, 260, 100, garde=True)
          + style('Puce', 'List Bullet', 10.5, ENCRE, False, 0, 90, interligne=290)
          + style('Legende', 'caption', 9, GRIS, False, 0, 260, 'center', italique=True)
          + style('Petit', 'Petit', 9, GRIS, False, 0, 160)
          + style('Encadre', 'Encadré', 11, ENCRE, False, 120, 200, interligne=300)
          + style('Cellule', 'Cellule', 9.5, ENCRE, False, 0, 0)
          + '</w:styles>')

numbering = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
             '<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'
             '<w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="singleLevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/>'
             f'<w:lvlText w:val="●"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="397" w:hanging="283"/></w:pPr><w:rPr><w:color w:val="{INDIGO}"/><w:sz w:val="14"/></w:rPr></w:lvl></w:abstractNum>'
             '<w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>')

pied = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:p><w:pPr><w:jc w:val="center"/></w:pPr>'
        f'<w:r><w:rPr><w:color w:val="{GRIS}"/><w:sz w:val="16"/></w:rPr><w:t xml:space="preserve">Reskope · Direction artistique · </w:t></w:r>'
        f'<w:r><w:rPr><w:color w:val="{GRIS}"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r>'
        f'<w:r><w:rPr><w:color w:val="{GRIS}"/><w:sz w:val="16"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r>'
        f'<w:r><w:rPr><w:color w:val="{GRIS}"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r>'
        f'<w:r><w:rPr><w:color w:val="{GRIS}"/><w:sz w:val="16"/></w:rPr><w:t>1</w:t></w:r>'
        f'<w:r><w:rPr><w:color w:val="{GRIS}"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>')

settings = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
            '<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:defaultTabStop w:val="708"/>'
            '<w:characterSpacingControl w:val="doNotCompress"/><w:compat><w:compatSetting w:name="compatibilityMode" w:uri="http://schemas.microsoft.com/office/word" w:val="15"/></w:compat></w:settings>')

rels_doc = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
            '<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
            '<Relationship Id="rIdSettings" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>'
            '<Relationship Id="rIdNum" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>'
            '<Relationship Id="rIdPied" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/>'
            + ''.join(f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/{nom}"/>' for rid, nom, _ in images)
            + '</Relationships>')

types = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
         '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
         '<Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/>'
         '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>'
         '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>'
         '<Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/>'
         '<Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/>'
         '<Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/>'
         '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
         '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>')

rels = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>'
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
        '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>')

maintenant = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
core = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Reskope, direction artistique</dc:title><dc:creator>Reskope</dc:creator><dc:language>fr-FR</dc:language>'
        f'<dcterms:created xsi:type="dcterms:W3CDTF">{maintenant}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">{maintenant}</dcterms:modified></cp:coreProperties>')
app = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">'
       '<Application>Reskope</Application></Properties>')

os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
with zipfile.ZipFile(SORTIE, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('[Content_Types].xml', types)
    z.writestr('_rels/.rels', rels)
    z.writestr('docProps/core.xml', core)
    z.writestr('docProps/app.xml', app)
    z.writestr('word/document.xml', document)
    z.writestr('word/styles.xml', styles)
    z.writestr('word/settings.xml', settings)
    z.writestr('word/numbering.xml', numbering)
    z.writestr('word/footer1.xml', pied)
    z.writestr('word/_rels/document.xml.rels', rels_doc)
    for rid, nom, chemin in images:
        im = Image.open(chemin)
        if im.width > 2000:  # des images légères, nettes à l'impression
            im = im.convert('RGB').resize((2000, round(im.height * 2000 / im.width)), Image.LANCZOS)
        from io import BytesIO
        tampon = BytesIO(); im.save(tampon, 'PNG', optimize=True)
        z.writestr(f'word/media/{nom}', tampon.getvalue())
print(SORTIE, os.path.getsize(SORTIE) // 1024, 'Ko,', len(images), 'images')
