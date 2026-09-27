"""L'image de partage du site (public/og-image.png, 1200 × 630).

C'est la vignette qui s'affiche quand on colle le lien du site sur LinkedIn,
WhatsApp ou dans un message. Elle reprend la carte de visite : fond indigo,
la trame, le logo de l'en-tête (scripts/logo.py), le slogan, et les trois
espaces du site avec leurs couleurs.

Lancer : ~/.claude/skills/seo/.venv/bin/python scripts/image-partage.py
"""
import asyncio, base64, json, os
from playwright.async_api import async_playwright

DEPOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXE = os.path.expanduser('~/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell')
GEO = json.load(open(os.path.join(DEPOT, 'logo', 'geometrie.json'), encoding='utf-8'))
b64 = lambda p: base64.b64encode(open(os.path.join(DEPOT, p), 'rb').read()).decode()

INDIGO, CREME = '#1C0CB3', '#F0EEE8'
ESPACES = [('En projet', '#F2A93B'), ('TPE, 1 à 10 personnes', '#2FAE8E'), ('PME, 10 à 250 personnes', '#3B9DE8')]
TRAME = [(300, 82), (418, 110), (520, 88), (360, 180), (470, 198), (560, 178), (300, 252), (432, 268), (540, 292), (500, 384), (560, 446), (430, 402)]
TRAME_LIENS = [(0, 1), (1, 2), (1, 3), (3, 4), (4, 5), (3, 6), (4, 7), (7, 8), (8, 9), (9, 10), (7, 11), (6, 7), (2, 5)]


def r_trace(coul):
    n, l = GEO['r_noeuds'], GEO['r_liens']
    liens = ''.join(f'<line x1="{n[a][0]}" y1="{n[a][1]}" x2="{n[b][0]}" y2="{n[b][1]}"/>' for a, b in l)
    noeuds = ''.join(f'<circle cx="{x}" cy="{y}" r="{GEO["jonction"] if i == 3 else GEO["noeud"]}"/>' for i, (x, y) in enumerate(n))
    return (f'<g stroke="{coul}" stroke-width="{GEO["trait"]}" fill="none" stroke-linecap="round">{liens}</g>'
            f'<g fill="{coul}">{noeuds}</g>')


def logo(x, y, corps, coul):
    s = corps / GEO['corps_mot']
    return (f'<g transform="translate({x - GEO["r_boite"][0] * s:.2f},{y - 76 * s:.2f}) scale({s:.5f})">'
            f'{r_trace(coul)}<path fill="{coul}" d="{GEO["mot_d"]}"/></g>')


def trame():
    l = ''.join(f'<line x1="{TRAME[a][0]}" y1="{TRAME[a][1]}" x2="{TRAME[b][0]}" y2="{TRAME[b][1]}"/>' for a, b in TRAME_LIENS)
    c = ''.join(f'<circle cx="{x}" cy="{y}" r="3.4"/>' for x, y in TRAME)
    return f'<g stroke="{CREME}" fill="{CREME}"><g stroke-width="1.4" opacity="0.5">{l}</g><g opacity="0.7">{c}</g></g>'


def html():
    espaces = ''.join(f'<li><i style="background:{c}"></i>{t}</li>' for t, c in ESPACES)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
@font-face {{ font-family: 'Reskope Sans'; src: url(data:font/woff2;base64,{b64('public/fonts/ReskopeSans-Regular.woff2')}) format('woff2'); font-weight: 400; }}
@font-face {{ font-family: 'Reskope Sans'; src: url(data:font/woff2;base64,{b64('public/fonts/ReskopeSans-SemiBold.woff2')}) format('woff2'); font-weight: 600; }}
html, body {{ margin: 0; }}
.og {{ position: relative; width: 1200px; height: 630px; overflow: hidden; background: {INDIGO}; color: {CREME}; font-family: 'Reskope Sans', sans-serif; }}
.og svg {{ position: absolute; inset: 0; }}
.og h1 {{ position: absolute; left: 80px; top: 196px; margin: 0; width: 820px; font-size: 76px; line-height: 1.04; font-weight: 600; letter-spacing: -0.03em; }}
.og ul {{ position: absolute; left: 80px; bottom: 72px; margin: 0; padding: 0; list-style: none; display: flex; gap: 14px; }}
.og li {{ display: flex; align-items: center; gap: 12px; padding: 12px 22px 12px 16px; border-radius: 999px; background: rgba(240, 238, 232, 0.1); font-size: 27px; }}
.og li i {{ width: 16px; height: 16px; border-radius: 50%; flex: none; }}
</style></head><body><div class="og">
<svg width="1200" height="630" viewBox="0 0 1200 630">
  <g opacity="0.2" transform="translate(470,-20) scale(1.3)">{trame()}</g>
  <g opacity="0.3" transform="translate(830,60) scale(4)">{r_trace(CREME)}</g>
  {logo(80, 104, 46, CREME)}
</svg>
<h1>On vous aide à décider, et on construit la suite.</h1>
<ul>{espaces}</ul>
</div></body></html>"""


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=EXE)
        pg = await b.new_page(viewport={'width': 1200, 'height': 630}, device_scale_factor=1)
        await pg.set_content(html())
        await pg.evaluate('document.fonts.ready')
        await pg.wait_for_timeout(200)
        await pg.screenshot(path=os.path.join(DEPOT, 'public', 'og-image.png'), clip={'x': 0, 'y': 0, 'width': 1200, 'height': 630})
        await b.close()
    print('public/og-image.png', os.path.getsize(os.path.join(DEPOT, 'public', 'og-image.png')) // 1024, 'Ko')


if __name__ == '__main__':
    asyncio.run(main())
