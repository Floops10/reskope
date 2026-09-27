"""Les visuels du document de direction artistique : logo, construction du R,
palette, typographie, et des écrans du site pris sur le serveur de
développement (npm run dev, port 5181, qui doit tourner).

Lancer : ~/.claude/skills/seo/.venv/bin/python scripts/direction-artistique/visuels.py
Puis   : ~/.claude/skills/seo/.venv/bin/python scripts/direction-artistique/document.py
"""
import asyncio, base64, os
from playwright.async_api import async_playwright
EXE = os.path.expanduser('~/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell')
ICI = os.path.dirname(os.path.abspath(__file__))
D = os.path.dirname(os.path.dirname(ICI))
OUT = os.path.join(ICI, 'visuels')
os.makedirs(OUT, exist_ok=True)
b64 = lambda p: base64.b64encode(open(p, 'rb').read()).decode()
FONTS = f"""@font-face {{ font-family: 'Reskope Sans'; src: url(data:font/woff2;base64,{b64(D + '/public/fonts/ReskopeSans-Regular.woff2')}) format('woff2'); font-weight: 400; }}
@font-face {{ font-family: 'Reskope Sans'; src: url(data:font/woff2;base64,{b64(D + '/public/fonts/ReskopeSans-Medium.woff2')}) format('woff2'); font-weight: 500; }}
@font-face {{ font-family: 'Reskope Sans'; src: url(data:font/woff2;base64,{b64(D + '/public/fonts/ReskopeSans-SemiBold.woff2')}) format('woff2'); font-weight: 600; }}
@font-face {{ font-family: 'Reskope Network'; src: url(data:font/woff2;base64,{b64(D + '/public/fonts/Reskope-Network.woff2')}) format('woff2'); }}
body {{ margin: 0; font-family: 'Reskope Sans', sans-serif; }}"""
R_NODES = [(36, 30), (92, 30), (104, 62), (36, 80), (36, 122), (104, 122)]
R_LINKS = [(0, 3), (3, 4), (0, 1), (1, 2), (2, 3), (3, 5)]
def r(coul):
    # Le R officiel : traits 3, nœuds 5,5, jonction 7 (scripts/logo.py)
    l = ''.join(f'<line x1="{R_NODES[a][0]}" y1="{R_NODES[a][1]}" x2="{R_NODES[b][0]}" y2="{R_NODES[b][1]}"/>' for a, b in R_LINKS)
    c = ''.join(f'<circle cx="{x}" cy="{y}" r="{7 if i == 3 else 5.5}"/>' for i, (x, y) in enumerate(R_NODES))
    return f'<g stroke="{coul}" stroke-width="3" fill="none" stroke-linecap="round">{l}</g><g fill="{coul}">{c}</g>'

def fichier_logo(nom):
    t = open(f'{D}/public/logo/{nom}.svg', encoding='utf-8').read()
    return t[t.index('<svg'):]

import json
GEO = json.load(open(f'{D}/logo/geometrie.json', encoding='utf-8'))

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE)
        page = await b.new_page(viewport={'width': 1200, 'height': 520}, device_scale_factor=2)
        # 1. Le logo, sur crème et sur indigo ; le R seul
        for nom, fond, fich in [('logo-creme', '#F0EEE8', 'reskope-logo-indigo'), ('logo-indigo', '#1c0cb3', 'reskope-logo-creme')]:
            html = f"""<html><head><style>{FONTS} .z{{width:1200px;height:520px;background:{fond};display:flex;align-items:center;justify-content:center}} .z svg{{width:900px;height:auto}}</style></head>
            <body><div class="z">{fichier_logo(fich)}</div></body></html>"""
            await page.set_content(html); await page.evaluate('document.fonts.ready'); await page.wait_for_timeout(200)
            await page.screenshot(path=f'{OUT}/{nom}.png')
        # 1 bis. La construction du R et du logo horizontal
        I, E = '#1c0cb3', '#0E0B1F'
        s_r = 2.4; ox, oy = 170, 150
        def P(x, y): return (ox + (x - 36) * s_r, oy + (y - 30) * s_r)
        (ax, ay), (cx_, cy_), (dx_, dy_), (mx, my), (bx, by) = P(36, 30), P(92, 30), P(104, 62), P(36, 80), P(36, 122)
        def rappel(x1, y1, x2, y2, txt, anc='start'):
            tx = x2 + (14 if anc == 'start' else -14)
            return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{E}" stroke-opacity=".35" stroke-width="1.2"/>'
                    f'<circle cx="{x2}" cy="{y2}" r="3" fill="{E}" fill-opacity=".45"/>'
                    f'<text x="{tx}" y="{y2 + 7}" text-anchor="{anc}" font-size="21" fill="{E}">{txt}</text>')
        haut = (f'<line x1="{ax - 70}" y1="{ay}" x2="{ax - 70}" y2="{by}" stroke="{E}" stroke-opacity=".35" stroke-width="1.2"/>'
                f'<circle cx="{ax - 70}" cy="{ay}" r="3" fill="{E}" fill-opacity=".45"/><circle cx="{ax - 70}" cy="{by}" r="3" fill="{E}" fill-opacity=".45"/>'
                f'<text x="{ax - 86}" y="{(ay + by) / 2 + 8}" text-anchor="end" font-size="24" font-weight="600" fill="{E}">92</text>')
        notes = (rappel((ax + cx_) / 2, ay, (ax + cx_) / 2 + 40, ay - 40, 'traits de 3')
                 + rappel(dx_, dy_, dx_ + 70, dy_ - 10, 'nœuds de 5,5')
                 + rappel(mx, my, mx + 100, my + 15, 'jonction de 7'))
        lk = fichier_logo('reskope-logo-indigo')
        html = f"""<html><head><style>{FONTS} .z{{position:relative;width:1200px;height:520px;background:#F0EEE8;font-family:'Reskope Sans'}}
        .z > svg.c{{position:absolute;left:0;top:0}} .lk{{position:absolute;left:700px;top:175px;width:430px}} .lk svg{{width:100%;height:auto;display:block}}
        .n{{position:absolute;left:700px;width:430px;font-size:21px;color:{E};line-height:1.4}} .n b{{font-weight:600}}</style></head>
        <body><div class="z"><svg class="c" width="1200" height="520" viewBox="0 0 1200 520" font-family="Reskope Sans">{haut}
        <g transform="translate({ox - 36 * s_r},{oy - 30 * s_r}) scale({s_r})">{r(I)}</g>{notes}</svg>
        <p class="n" style="top:70px"><b>Le R</b> se réduit ou s’agrandit, ses traits ne s’épaississent jamais.</p>
        <div class="lk">{lk}</div>
        <p class="n" style="top:330px"><b>Le logo horizontal :</b> le R fait 1,2 fois la hauteur des capitales, il est centré sur elles, et le nom commence à une capitale de ses nœuds.</p>
        </div></body></html>"""
        await page.set_content(html); await page.evaluate('document.fonts.ready'); await page.wait_for_timeout(250)
        await page.screenshot(path=f'{OUT}/logo-construction.png')
        # 2. La palette
        cols = [('Indigo', '#1C0CB3', '#F0EEE8', 'La marque'), ('Crème', '#F0EEE8', '#0E0B1F', 'Le fond'), ('Encre', '#0E0B1F', '#F0EEE8', 'Le texte'),
                ('Soleil', '#F2A93B', '#0E0B1F', 'En projet'), ('Menthe', '#2FAE8E', '#0E0B1F', 'TPE'), ('Ciel', '#3B9DE8', '#0E0B1F', 'PME'),
                ('Corail', '#EF6F5E', '#0E0B1F', 'Ce qui compte'), ('Lilas', '#8B7FF0', '#0E0B1F', 'Business plan')]
        blocs = ''.join(f'<div class="c" style="background:{f};color:{t}"><b>{n}</b><span>{f}</span><i>{role}</i></div>' for n, f, t, role in cols)
        html = f"""<html><head><style>{FONTS} .p{{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:28px;background:#F0EEE8;width:1144px}}
        .c{{height:190px;border-radius:18px;padding:22px;display:flex;flex-direction:column;justify-content:flex-end;gap:4px;box-shadow:inset 0 0 0 1px rgba(14,11,31,.08)}}
        .c b{{font-size:30px;font-weight:600;letter-spacing:-0.02em}} .c span{{font-size:19px;font-weight:500}} .c i{{font-style:normal;font-size:17px;opacity:.8}}</style></head><body><div class="p">{blocs}</div></body></html>"""
        await page.set_viewport_size({'width': 1200, 'height': 470})
        await page.set_content(html); await page.evaluate('document.fonts.ready'); await page.wait_for_timeout(200)
        await page.locator('.p').screenshot(path=f'{OUT}/palette.png')
        # 3. La typographie
        html = f"""<html><head><style>{FONTS} .t{{background:#F0EEE8;color:#0E0B1F;padding:40px 48px;width:1104px}}
        .t h1{{font-size:84px;font-weight:600;letter-spacing:-0.04em;line-height:1;margin:0}} .t h2{{font-size:44px;font-weight:600;letter-spacing:-0.03em;margin:28px 0 0}}
        .t p{{font-size:22px;line-height:1.6;color:#5c5951;max-width:44ch;margin:18px 0 0}} .t .n{{font-family:'Reskope Network';font-size:76px;color:#1c0cb3;margin-top:26px;letter-spacing:.02em}}
        .t .e{{display:flex;gap:26px;margin-top:22px;font-size:22px}} .t .e span:nth-child(1){{font-weight:400}} .t .e span:nth-child(2){{font-weight:500}} .t .e span:nth-child(3){{font-weight:600}}</style></head>
        <body><div class="t"><h1>On vous aide à décider.</h1><h2>Et on construit la suite.</h2><p>Reskope Sans pour tout le texte : notre police, des courbes tendues entre le cercle et le carré, lisible en grand comme en petit.</p>
        <div class="e"><span>Regular 400</span><span>Medium 500</span><span>SemiBold 600</span></div><div class="n">RESKOPE</div></div></body></html>"""
        await page.set_viewport_size({'width': 1200, 'height': 620})
        await page.set_content(html); await page.evaluate('document.fonts.ready'); await page.wait_for_timeout(200)
        await page.locator('.t').screenshot(path=f'{OUT}/typo.png')
        await b.close()

        # 4. Des écrans du site (serveur de développement)
        b = await p.chromium.launch(executable_path=EXE)
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}, device_scale_factor=1, reduced_motion='no-preference', locale='fr-FR')
        pg = await ctx.new_page()
        async def cap(route, sel, nom, attente=2600, avant=None, en_tete=False):
            await pg.goto('http://localhost:5181/reskope' + route, wait_until='networkidle')
            await pg.wait_for_timeout(1400)
            # l'en-tête est fixe : sur une capture qui défile, il retomberait au milieu de l'image
            if not en_tete: await pg.add_style_tag(content='.nav,.nav-pill,.evitement{visibility:hidden!important}')
            if avant: await pg.evaluate(avant); await pg.wait_for_timeout(1200)
            el = pg.locator(sel).first
            await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(attente)
            await el.screenshot(path=f'{OUT}/{nom}.png')
        await cap('/', '.aig__in', 'ecran-aiguillage', 2800, en_tete=True)
        await cap('/creation/', '.pl-livrable', 'ecran-livrable', 3200)
        await cap('/creation/', '#bp', 'ecran-bp', 3200)
        await cap('/creation/', '.bal', 'ecran-balance', 3000)
        await cap('/creation/', '.footer2__espaces', 'ecran-tuiles', 2000)
        await pg.goto('http://localhost:5181/reskope/creation/', wait_until='networkidle'); await pg.wait_for_timeout(1500)
        await pg.click('.nav__menu-btn'); await pg.wait_for_timeout(1600)
        await pg.screenshot(path=f'{OUT}/ecran-menu.png')
        await b.close()
    print(sorted(os.listdir(OUT)))
asyncio.run(main())
