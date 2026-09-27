"""Cartes de visite Reskope au format imprimeur.
85 × 55 mm, fond perdu 3 mm (document 91 × 61 mm), PDF vectoriel recto-verso,
polices incorporées, plus des aperçus PNG. L'adresse imprimée vient de
site.config.mjs (DOMAINE) : relancer ce script une fois le domaine branché."""
import asyncio, base64, json, os, re
from playwright.async_api import async_playwright

DEPOT = '/Users/florian.bouchart/Developer/2-Reskope'
SORTIE = os.path.join(DEPOT, 'Impression', 'Cartes de visite')
EXE = os.path.expanduser('~/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell')

conf = open(os.path.join(DEPOT, 'site.config.mjs'), encoding='utf-8').read()
m = re.search(r"^export const ADRESSE_AFFICHEE = '([^']+)'", conf, re.M)
ADRESSE = m.group(1) if m else 'reskope.fr'

b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
POLICE_R = b64(os.path.join(DEPOT, 'public/fonts/ReskopeSans-Regular.woff2'))
POLICE_S = b64(os.path.join(DEPOT, 'public/fonts/ReskopeSans-SemiBold.woff2'))

INDIGO, CREME = '#1c0cb3', '#F0EEE8'
FONT = "'Reskope Sans', sans-serif"
# Le logo : la géométrie de scripts/logo.py (R officiel et mot vectorisé).
GEO = json.load(open(os.path.join(DEPOT, 'logo', 'geometrie.json'), encoding='utf-8'))
R_NODES = GEO['r_noeuds']
R_LINKS = GEO['r_liens']
TRAME = [(300, 82), (418, 110), (520, 88), (360, 180), (470, 198), (560, 178), (300, 252), (432, 268), (540, 292), (500, 384), (560, 446), (430, 402)]
TRAME_LIENS = [(0, 1), (1, 2), (1, 3), (3, 4), (4, 5), (3, 6), (4, 7), (7, 8), (8, 9), (9, 10), (7, 11), (6, 7), (2, 5)]

PERSONNES = {
    'florian': dict(nom='Florian Bouchart', role='Cofondateur · discovery, sites et outils', tel='+33 6 20 23 55 22', mail='florian.bouchart@hotmail.fr'),
    'thomy': dict(nom='Thomy Phanzu', role='Cofondatrice · business plan, marque et financement', tel='+33 7 61 25 44 65', mail='thomyphanzu@icloud.com'),
}
SLOGAN = 'On vous aide à décider, et on construit la suite.'

# Mise en page (unités de la carte : 1 = 0,1 mm). Le petit logo du recto a
# des traits de 0,12 mm : ce sont les proportions du logo, pas une erreur.
LOGO_CORPS = 44      # taille du mot dans le logo du recto (logo de 22 mm)
GRAND_R_OP = 0.3     # le grand R du recto, en filigrane comme la trame
VERSO_R = 2.4        # le R du verso
VERSO_HAUT = 76      # hauteur de son nœud du haut

def r_trace(couleur):
    # Le R tel quel : traits 3, nœuds 5,5, jonction 7. On change sa taille,
    # jamais ces rapports.
    l = ''.join(f'<line x1="{R_NODES[a][0]}" y1="{R_NODES[a][1]}" x2="{R_NODES[b][0]}" y2="{R_NODES[b][1]}"/>' for a, b in R_LINKS)
    c = ''.join(f'<circle cx="{nx}" cy="{ny}" r="{GEO["jonction"] if i == 3 else GEO["noeud"]}"/>' for i, (nx, ny) in enumerate(R_NODES))
    return (f'<g stroke="{couleur}" stroke-width="{GEO["trait"]}" fill="none" stroke-linecap="round">{l}</g>'
            f'<g fill="{couleur}">{c}</g>')

def r_mark(x, y, s, couleur, op=1):
    return f'<g transform="translate({x},{y}) scale({s})" opacity="{op}">{r_trace(couleur)}</g>'

def logo(x, y, corps, couleur):
    # Le logo horizontal, comme dans l'en-tête du site. (x, y) : bord gauche
    # du R et centre des capitales ; corps : taille du mot.
    s = corps / GEO['corps_mot']
    tx, ty = x - GEO['r_boite'][0] * s, y - 76 * s
    return (f'<g transform="translate({tx:.2f},{ty:.2f}) scale({s:.5f})">{r_trace(couleur)}'
            f'<path fill="{couleur}" d="{GEO["mot_d"]}"/></g>')

def mot(cx, base, corps, couleur):
    # Le mot du logo seul, centré sur cx, posé sur la ligne de base.
    s = corps / GEO['corps_mot']
    x0, _, x1, _ = GEO['mot_boite']
    return (f'<g transform="translate({cx - (x0 + x1) / 2 * s:.2f},{base - GEO["ligne_de_base"] * s:.2f}) scale({s:.5f})">'
            f'<path fill="{couleur}" d="{GEO["mot_d"]}"/></g>')

def trame(couleur):
    l = ''.join(f'<line x1="{TRAME[a][0]}" y1="{TRAME[a][1]}" x2="{TRAME[b][0]}" y2="{TRAME[b][1]}"/>' for a, b in TRAME_LIENS)
    c = ''.join(f'<circle cx="{x}" cy="{y}" r="3.4" opacity="0.7"/>' for x, y in TRAME)
    return f'<g stroke="{couleur}" fill="{couleur}"><g stroke-width="1.4" opacity="0.5">{l}</g>{c}</g>'

def t(x, y, txt, taille, op=1, poids=400, anc='start', ls='0', coul=CREME):
    return f'<text x="{x}" y="{y}" fill="{coul}" font-size="{taille}" font-weight="{poids}" opacity="{op}" text-anchor="{anc}" letter-spacing="{ls}" font-family="{FONT}">{txt}</text>'

def recto(p):
    # Coordonnées de la carte (850 × 540, comme sur le site), posées dans la
    # zone de coupe 85 × 55 mm, elle-même dans le document avec fond perdu.
    corps = (trame_bloc := f'<g opacity="0.18">{trame(CREME)}</g>') + \
        f'<g stroke="{CREME}" stroke-width="1.4" opacity="0.22"><line x1="560" y1="178" x2="668" y2="180"/><line x1="540" y1="292" x2="668" y2="330"/><line x1="560" y1="446" x2="668" y2="456"/></g>' + \
        r_mark(560, 90, 3.0, CREME, GRAND_R_OP) + logo(60, 77, LOGO_CORPS, CREME) + \
        t(58, 140, 'Valenciennes · Lille', 15, 0.55, ls='0.6') + \
        t(58, 292, p['nom'], 52, 1, 600, ls='-1.3') + \
        t(58, 348, p['role'], 18, 0.8) + t(58, 374, SLOGAN, 16, 0.58) + \
        t(58, 452, p['tel'], 18, 0.92) + t(58, 480, p['mail'], 17, 0.86) + \
        t(806, 500, ADRESSE, 15, 0.45, anc='end', ls='0.9')
    return svg(INDIGO, corps)

def verso():
    sc = VERSO_R
    corps = f'<g opacity="0.07">{trame(INDIGO)}</g>' + r_mark(425 - 70 * sc, VERSO_HAUT - 30 * sc, sc, INDIGO) + \
        mot(425, 378, 52, INDIGO) + \
        t(425, 440, SLOGAN, 19, 0.7, anc='middle', coul=INDIGO) + \
        t(425, 496, ADRESSE, 15, 0.45, anc='middle', ls='0.9', coul=INDIGO)
    return svg(CREME, corps)

def svg(fond, corps, recadrer=False):
    # Document : 910 × 610 unités (1 unité = 0,1 mm), coupe à 30 unités du bord.
    vb = '30 30 850 550' if recadrer else '0 0 910 610'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="100%" height="100%">'
            f'<rect x="0" y="0" width="910" height="610" fill="{fond}"/><g transform="translate(30,35)">{corps}</g></svg>')

STYLE = f"""<style>
@font-face {{ font-family: 'Reskope Sans'; src: url(data:font/woff2;base64,{POLICE_R}) format('woff2'); font-weight: 400; }}
@font-face {{ font-family: 'Reskope Sans'; src: url(data:font/woff2;base64,{POLICE_S}) format('woff2'); font-weight: 600; }}
@page {{ size: 91mm 61mm; margin: 0; }}
html, body {{ margin: 0; padding: 0; }}
.page {{ width: 91mm; height: 61mm; overflow: hidden; page-break-after: always; break-after: page; }}
.page:last-child {{ page-break-after: auto; break-after: auto; }}
.page svg {{ display: block; width: 91mm; height: 61mm; }}
</style>"""

async def main():
    os.makedirs(SORTIE, exist_ok=True)
    async with async_playwright() as pw:
        b = await pw.chromium.launch(executable_path=EXE)
        page = await b.new_page()
        for qui, p in PERSONNES.items():
            html = f'<!doctype html><html><head><meta charset="utf-8">{STYLE}</head><body><div class="page">{recto(p)}</div><div class="page">{verso()}</div></body></html>'
            await page.set_content(html)
            await page.evaluate('document.fonts.ready')
            await page.wait_for_timeout(300)
            await page.pdf(path=os.path.join(SORTIE, f'reskope-carte-{qui}.pdf'), width='91mm', height='61mm', print_background=True, prefer_css_page_size=True)
            # Aperçus à 300 dpi, sans le fond perdu (85 × 55 mm = 1004 × 650 px)
            for face, contenu in [('recto', recto(p)), ('verso', verso())]:
                ap = contenu.replace('viewBox="0 0 910 610"', 'viewBox="30 30 850 550"')
                await page.set_viewport_size({'width': 1004, 'height': 650})
                await page.set_content(f'<!doctype html><html><head><meta charset="utf-8">{STYLE}<style>body{{margin:0}} .ap svg{{width:1004px;height:650px;display:block}}</style></head><body><div class="ap">{ap}</div></body></html>')
                await page.evaluate('document.fonts.ready')
                await page.wait_for_timeout(200)
                await page.screenshot(path=os.path.join(SORTIE, f'apercu-{qui}-{face}.png'), clip={'x': 0, 'y': 0, 'width': 1004, 'height': 650})
        await b.close()
    print('adresse imprimée :', ADRESSE)
    for f in sorted(os.listdir(SORTIE)):
        print(f, os.path.getsize(os.path.join(SORTIE, f)) // 1024, 'Ko')

if __name__ == '__main__':
    asyncio.run(main())
