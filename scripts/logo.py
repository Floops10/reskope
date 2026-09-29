"""Les fichiers du logo Reskope, refaits depuis une seule géométrie.

La marque : le R réseau de src/components/Logo.jsx, sur un R de 92 de haut
(du nœud du haut au nœud du bas) : traits de 3, nœuds de 5,5, jonction de 7.
On ne change jamais ces rapports : un R aux traits épaissis n'est plus le logo.

Le logo horizontal reprend l'en-tête du site : le R mesure 1,2 fois la hauteur
des capitales du mot, il est centré sur elles, et le mot commence à une
hauteur de capitale des nœuds de droite du R. Le mot est vectorisé (Reskope
Sans SemiBold, approche de -0,02 em, crénage du navigateur) : aucun
fichier ne dépend d'une police installée.

Les trois marques (Create, Define, Elevate) gardent ce R à l'identique : il
reste indigo, seul son nœud de jonction prend la couleur vive de la marque, et
le nom de la marque suit le mot, en Reskope Sans Medium, à sa couleur. Comme
dans l'en-tête du site.

Sorties :
  logo/ et public/logo/   marque, logo horizontal et mot, en indigo, crème, encre ;
                          pour chaque marque, le logo (sur clair, sur sombre) et
                          le R au nœud allumé
  logo/geometrie.json     la géométrie, lue par les scripts d'impression
  src/data/logoMot.js     le mot vectorisé, pour les cartes de visite du site
  tech/src/data/logoMot.js (copie pour l'espace TPE et PME)

Lancer : ~/.claude/skills/seo/.venv/bin/python scripts/logo.py
"""
import asyncio, base64, json, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from playwright.async_api import async_playwright

DEPOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POLICE = os.path.join(DEPOT, 'public/fonts/ReskopeSans-SemiBold.woff2')
UPM = TTFont(POLICE)['head'].unitsPerEm   # le navigateur mesure en unités de police si la taille = UPM
EXE = os.path.expanduser('~/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell')

MOT = 'Reskope'
COULEURS = {'indigo': '#1C0CB3', 'creme': '#F0EEE8', 'encre': '#0E0B1F'}
POLICE_MARQUE = os.path.join(DEPOT, 'public/fonts/ReskopeSans-Medium.woff2')
# Les mêmes que styles/marques.css : le nom sur clair, le nœud allumé, le nom sur sombre.
MARQUES = {
    'create': {'nom': 'Create', 'action': '#9C4F06', 'vif': '#F2A93B', 'clair': '#F5C36B'},
    'define': {'nom': 'Define', 'action': '#0B6B52', 'vif': '#2FAE8E', 'clair': '#7FE0C2'},
    'elevate': {'nom': 'Elevate', 'action': '#0B3D91', 'vif': '#3B9DE8', 'clair': '#8CC8F5'},
}

# Le R (unités du logo) : les mêmes nœuds et liens que Logo.jsx.
R_NOEUDS = [(36, 30), (92, 30), (104, 62), (36, 80), (36, 122), (104, 122)]
R_LIENS = [(0, 3), (3, 4), (0, 1), (1, 2), (2, 3), (3, 5)]
TRAIT, NOEUD, JONCTION = 3, 5.5, 7

# L'en-tête : R de 27 px de large (viewBox de 132), mot en 22,4 px, écart 0,55 rem.
U = 27 / 132                          # px par unité du logo
TAILLE = 22.4 / U                     # corps du mot, en unités du logo
ECART_PX = 0.55 * 16                  # entre la boîte du R et celle du mot
MARGE = 16                            # air autour de l'encre, dans les fichiers


def nombre(v):
    s = f'{v:.2f}'.rstrip('0').rstrip('.')
    return '0' if s in ('-0', '') else s


async def positions_navigateur(mot=MOT, police=POLICE):
    """Abscisses de chaque lettre, crénage et approche compris (unités de la police)."""
    b64 = base64.b64encode(open(police, 'rb').read()).decode()
    html = (f"<style>@font-face{{font-family:RS;src:url(data:font/woff2;base64,{b64}) format('woff2');font-weight:600}}</style>"
            f"<svg width='20000' height='3000'><text id='t' x='0' y='2500' font-family='RS' font-weight='600' font-size='{UPM}' "
            f"style='letter-spacing:-0.02em;font-kerning:normal'>{mot}</text></svg>")
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE)
        pg = await b.new_page()
        await pg.set_content(html)
        await pg.evaluate('document.fonts.ready')
        await pg.wait_for_timeout(150)
        xs = await pg.evaluate(f"[...'{mot}'].map((c, i) => document.getElementById('t').getStartPositionOfChar(i).x)")
        xs.append(await pg.evaluate(f"document.getElementById('t').getEndPositionOfChar({len(mot) - 1}).x"))
        await b.close()
    return xs


def mot_chemin(police, xs, x0, y0, echelle, mot=MOT):
    """Le mot en un seul chemin, origine (x0, ligne de base y0), échelle par unité de police."""
    gs, cmap = police.getGlyphSet(), police.getBestCmap()
    morceaux, boite = [], [1e9, 1e9, -1e9, -1e9]
    for lettre, x in zip(mot, xs):
        g = cmap[ord(lettre)]
        m = (echelle, 0, 0, -echelle, x0 + x * echelle, y0)
        pen = SVGPathPen(gs, ntos=nombre)
        gs[g].draw(TransformPen(pen, m))
        morceaux.append(pen.getCommands())
        bp = BoundsPen(gs)
        gs[g].draw(TransformPen(bp, m))
        if bp.bounds:
            a, b_, c, d = bp.bounds
            boite = [min(boite[0], a), min(boite[1], b_), max(boite[2], c), max(boite[3], d)]
    return ' '.join(morceaux), boite


def r_svg(coul, coeur=None):
    liens = ''.join(f'<path d="M{R_NOEUDS[a][0]} {R_NOEUDS[a][1]}L{R_NOEUDS[b][0]} {R_NOEUDS[b][1]}"/>' for a, b in R_LIENS)
    noeuds = ''.join(f'<circle cx="{x}" cy="{y}" r="{JONCTION if i == 3 else NOEUD}"'
                     + (f' fill="{coeur}"' if coeur and i == 3 else '') + '/>' for i, (x, y) in enumerate(R_NOEUDS))
    return (f'<g fill="none" stroke="{coul}" stroke-width="{TRAIT}" stroke-linecap="round">{liens}</g>'
            f'<g fill="{coul}">{noeuds}</g>')


def fichier(boite, corps, titre='Reskope', couleurs='Indigo #1C0CB3 · crème #F0EEE8 · encre #0E0B1F'):
    x0, y0, x1, y1 = boite[0] - MARGE, boite[1] - MARGE, boite[2] + MARGE, boite[3] + MARGE
    w, h = x1 - x0, y1 - y0
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<!-- {titre} · logo officiel (scripts/logo.py). Fond transparent, texte vectorisé.\n'
            '     R : traits 3, nœuds 5,5, jonction 7 pour 92 de haut. Ne pas épaissir les traits.\n'
            f'     {couleurs} -->\n'
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{nombre(x0)} {nombre(y0)} {nombre(w)} {nombre(h)}" '
            f'width="{nombre(w)}" height="{nombre(h)}" role="img" aria-label="{titre}"><title>{titre}</title>{corps}</svg>\n')


def main():
    police = TTFont(POLICE)
    upm = police['head'].unitsPerEm
    xs = asyncio.run(positions_navigateur())
    # Hauteur réelle des capitales : celle du H.
    bp = BoundsPen(police.getGlyphSet())
    police.getGlyphSet()[police.getBestCmap()[ord('H')]].draw(bp)
    capitale = bp.bounds[3] / upm

    echelle = TAILLE / upm
    cap = capitale * TAILLE
    centre_r = (R_NOEUDS[0][1] + R_NOEUDS[4][1]) / 2          # 76
    base = centre_r + cap / 2                                  # capitales centrées sur le R
    # Comme dans l'en-tête : le mot part du bord droit de la boîte du R (132)
    # plus l'écart de 0,55 rem.
    x_mot = 132 + ECART_PX / U

    fin_mot = x_mot + xs[-1] * echelle
    d_logo, boite_mot = mot_chemin(police, xs, x_mot, base, echelle)
    boite_r = [R_NOEUDS[0][0] - JONCTION, R_NOEUDS[0][1] - NOEUD, R_NOEUDS[5][0] + NOEUD, R_NOEUDS[5][1] + NOEUD]
    boite_logo = [min(boite_r[0], boite_mot[0]), min(boite_r[1], boite_mot[1]), max(boite_r[2], boite_mot[2]), max(boite_r[3], boite_mot[3])]

    # Le mot seul, en unités de police ramenées à une capitale de 100.
    e_mot = 100 / (capitale * upm)
    d_seul, boite_seul = mot_chemin(police, xs, 0, 0, e_mot)

    for dossier in ('logo', 'public/logo'):
        os.makedirs(os.path.join(DEPOT, dossier), exist_ok=True)
        for nom, coul in COULEURS.items():
            ecrire = lambda f, t: open(os.path.join(DEPOT, dossier, f), 'w', encoding='utf-8').write(t)
            ecrire(f'reskope-marque-{nom}.svg', fichier(boite_r, r_svg(coul)))
            ecrire(f'reskope-logo-{nom}.svg', fichier(boite_logo, r_svg(coul) + f'<path fill="{coul}" d="{d_logo}"/>'))
            ecrire(f'reskope-mot-{nom}.svg', fichier(boite_seul, f'<path fill="{coul}" d="{d_seul}"/>'))

    # Les trois marques : le R de la maison, son nœud allumé, et le nom après
    # une espace, en Medium, à la couleur de la marque (comme dans l'en-tête).
    police_m = TTFont(POLICE_MARQUE)
    espace = police['hmtx']['space'][0] * echelle - 0.02 * TAILLE
    for id_m, m in MARQUES.items():
        xs_m = asyncio.run(positions_navigateur(m['nom'], POLICE_MARQUE))
        d_nom, boite_nom = mot_chemin(police_m, xs_m, fin_mot + espace, base, echelle, m['nom'])
        boite = [min(boite_logo[0], boite_nom[0]), min(boite_logo[1], boite_nom[1]),
                 max(boite_logo[2], boite_nom[2]), max(boite_logo[3], boite_nom[3])]
        titre = f"Reskope {m['nom']}"
        teintes = f"Indigo #1C0CB3 · nœud {m['vif']} · nom {m['action']} (sur clair), {m['clair']} (sur sombre)"
        for dossier in ('logo', 'public/logo'):
            ecrire = lambda f, t: open(os.path.join(DEPOT, dossier, f), 'w', encoding='utf-8').write(t)
            ecrire(f'reskope-{id_m}-logo.svg', fichier(boite, r_svg(COULEURS['indigo'], m['vif'])
                   + f'<path fill="{COULEURS["indigo"]}" d="{d_logo}"/><path fill="{m["action"]}" d="{d_nom}"/>', titre, teintes))
            ecrire(f'reskope-{id_m}-logo-creme.svg', fichier(boite, r_svg(COULEURS['creme'], m['vif'])
                   + f'<path fill="{COULEURS["creme"]}" d="{d_logo}"/><path fill="{m["clair"]}" d="{d_nom}"/>', titre, teintes))
            ecrire(f'reskope-{id_m}-marque.svg', fichier(boite_r, r_svg(COULEURS['indigo'], m['vif']), titre, teintes))

    geo = {
        'note': 'Unités du logo : le R va de y=30 à y=122. Généré par scripts/logo.py.',
        'r_noeuds': R_NOEUDS, 'r_liens': R_LIENS, 'trait': TRAIT, 'noeud': NOEUD, 'jonction': JONCTION,
        'mot_d': d_logo, 'mot_boite': [round(v, 2) for v in boite_mot],
        'logo_boite': [round(v, 2) for v in boite_logo], 'r_boite': boite_r,
        'corps_mot': round(TAILLE, 3), 'ligne_de_base': round(base, 3), 'capitale': round(cap, 3),
    }
    json.dump(geo, open(os.path.join(DEPOT, 'logo/geometrie.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

    module = ('/* Généré par scripts/logo.py : ne pas modifier à la main.\n'
              '   Le mot « Reskope » du logo, vectorisé, dans les unités du R (Logo.jsx) :\n'
              '   posé à côté du R exactement comme dans l’en-tête du site. */\n'
              f"export const MOT_LOGO = '{d_logo}';\n"
              f'/* Encre du mot seul et du R (x0, y0, x1, y1), corps du mot et ligne de base. */\n'
              f'export const MOT_BOITE = {json.dumps([round(v, 2) for v in boite_mot])};\n'
              f'export const R_BOITE = {json.dumps(boite_r)};\n'
              f'export const CORPS_MOT = {round(TAILLE, 3)};\n'
              f'export const BASE_MOT = {round(base, 3)};\n')
    for f in ('src/data/logoMot.js', 'tech/src/data/logoMot.js'):
        open(os.path.join(DEPOT, f), 'w', encoding='utf-8').write(module)

    print('corps du mot', round(TAILLE, 2), '· capitale', round(cap, 2), '· base', round(base, 2), '· départ du mot', round(x_mot, 2))
    print('logo', [round(v, 1) for v in boite_logo], '· mot seul', [round(v, 1) for v in boite_seul])


if __name__ == '__main__':
    main()
