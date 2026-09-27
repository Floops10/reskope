"""Deuxième proposition « Reskope Sans » : de vraies lettres de texte, deux caractères."""
from sans import Lettres, TENDUE, ELAN, compose

INK, CREME, NUIT = '#1C0CB3', '#F0EEE8', '#16123a'
PARA = ("On vous aide à décider, et on construit la suite. Reskope accompagne les dirigeants de TPE et de PME : "
        "on regarde vos outils, on comprend vos clients, puis on choisit ensemble ce qui compte vraiment.")

T86, T112 = Lettres(TENDUE, 86).jeu(), Lettres(TENDUE, 112).jeu()
E86, E112 = Lettres(ELAN, 86).jeu(), Lettres(ELAN, 112).jeu()


def bloc(nom, amorce, details, j, jg):
    return f'''<article class="piste">
    <h3>{nom}</h3>
    <p class="sous">{amorce}</p>
    <div class="mot">{compose(j, "Reskope", 150)}</div>
    <div class="alpha">{compose(j, "abcdeghiklmnopqrstuv", 60)}</div>
    <div class="alpha">{compose(jg, "cartographie, décisions, construction", 44)}</div>
    <div class="para">{compose(j, PARA, 18, 660, couleur=NUIT)}</div>
    <ul class="traits">{"".join(f"<li>{d}</li>" for d in details)}</ul>
  </article>'''


zoom = compose(T86, 'abdpqg', 190)

page = f'''<title>Reskope Sans</title>
<meta name="description" content="Deuxième proposition de police de texte maison pour Reskope : deux caractères dessinés en vrais contours, comparés à Neue Einstellung.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap">
<style>
@font-face {{ font-family: 'Reskope Network'; src: url('Reskope-Network.ttf') format('truetype'); font-display: swap; }}
:root {{ --indigo: {INK}; --creme: {CREME}; --creme-2: #E6E2D8; --nuit: {NUIT}; --gris: #4d4a66; color-scheme: light; }}
* {{ box-sizing: border-box; }}
body {{ margin: 0; background: var(--creme); color: var(--nuit); font-family: 'Jost', 'Futura', 'Avenir Next', 'Segoe UI', sans-serif; font-size: 18px; line-height: 1.6; -webkit-font-smoothing: antialiased; }}
.bande {{ padding: 64px 18px; }}
.bande.sombre {{ background: var(--indigo); color: var(--creme); }}
.bande.claire {{ background: var(--creme-2); }}
.col {{ max-width: 860px; margin: 0 auto; }}
.amorce {{ text-align: center; font-size: 23px; line-height: 1.45; font-weight: 500; max-width: 40ch; margin: 0 auto 20px; text-wrap: balance; }}
.detail {{ text-align: center; max-width: 62ch; margin: 0 auto 14px; }}
h1, h2 {{ font-family: 'Reskope Network', 'Jost', sans-serif; font-weight: 400; color: var(--indigo); text-align: center; margin: 0 0 22px; line-height: 1.05; }}
.sombre h2, .sombre h1 {{ color: var(--creme); }}
h1 {{ font-size: clamp(54px, 11vw, 104px); }}
h2 {{ font-size: clamp(34px, 6vw, 52px); }}
h3 {{ font-size: 26px; font-weight: 600; margin: 0 0 6px; color: var(--indigo); text-align: center; }}
.sous {{ text-align: center; margin: 0 auto 22px; color: var(--gris); max-width: 46ch; }}
.spec {{ display: block; max-width: 100%; height: auto; margin: 0 auto; }}
.piste {{ background: var(--creme); border-radius: 22px; padding: 30px 22px 22px; margin: 0 0 18px; }}
.piste .mot {{ margin: 6px 0 14px; }}
.piste .alpha {{ margin: 0 0 12px; }}
.piste .para {{ background: #fff; border-radius: 14px; padding: 16px 16px 8px; margin: 18px 0 16px; }}
.traits {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }}
.traits li {{ background: var(--creme-2); border-radius: 12px; padding: 10px 14px; text-align: center; font-size: 16px; }}
.compare {{ display: grid; gap: 12px; margin: 26px 0 0; }}
.compare figure {{ margin: 0; background: #fff; border-radius: 16px; padding: 16px 16px 10px; }}
.compare figcaption {{ text-align: center; font-size: 15px; color: var(--gris); margin-top: 8px; }}
.compare img {{ display: block; width: 100%; max-width: 765px; height: auto; margin: 0 auto; }}
.duo-titre {{ background: #fff; border-radius: 18px; padding: 26px 20px 16px; margin: 0 0 14px; }}
.duo-titre .t {{ font-family: 'Reskope Network', sans-serif; color: var(--indigo); font-size: clamp(30px, 5.6vw, 46px); line-height: 1.15; text-align: center; margin: 0 0 16px; }}
.duo-titre figcaption {{ text-align: center; font-size: 15px; color: var(--gris); margin-top: 6px; }}
.reco {{ background: var(--indigo); color: var(--creme); border-radius: 18px; padding: 22px 24px; margin: 22px auto 0; max-width: 64ch; text-align: center; }}
.reco strong {{ color: #fff; }}
.liste {{ list-style: none; padding: 0; margin: 26px auto 0; max-width: 64ch; display: grid; gap: 10px; }}
.liste li {{ background: var(--creme); border-radius: 14px; padding: 13px 18px; text-align: center; color: var(--nuit); }}
.pieds {{ text-align: center; font-size: 14px; color: var(--gris); padding: 28px 18px 60px; }}
@media (max-width: 640px) {{ .amorce {{ font-size: 20px; }} body {{ font-size: 17px; }} .piste {{ padding: 24px 14px 16px; }} }}
</style>

<section class="bande">
  <div class="col">
    <h1>Reskope Sans</h1>
    <p class="amorce">Deuxième proposition. Cette fois, de vraies lettres de texte, et plus de nœuds : ils restent la signature de vos titres.</p>
    <p class="detail">La déclinaison arrondie du réseau que tu as aimée, je la garde du côté des titres. Pour le texte, je suis reparti de zéro : des lettres dessinées en contours, avec des épaisseurs, des jonctions et des courbes travaillées une par une. Tout ce que tu vois ci-dessous est composé avec ces lettres, rien n'est une police existante.</p>
  </div>
</section>

<section class="bande claire">
  <div class="col">
    <h2>Ce qui change</h2>
    <p class="amorce">Une police de texte se joue dans des détails qu'on ne voit pas, mais qu'on sent en lisant.</p>
    <div class="piste" style="padding:26px 16px 18px">{zoom}</div>
    <ul class="liste">
      <li>Les horizontales sont un peu plus fines que les verticales : l'œil lit la lettre comme régulière.</li>
      <li>Là où la panse rejoint le fût (a, b, d, p, q, g), le trait s'affine et forme une petite encoche : la lettre reste nette en petit, et gagne du caractère en grand.</li>
      <li>Les ronds dépassent un peu des lignes, sinon ils paraîtraient plus petits que les lettres droites.</li>
      <li>L'espace autour de chaque lettre dépend de sa forme (droite, ronde, ouverte, diagonale) : le gris du paragraphe est régulier.</li>
    </ul>
  </div>
</section>

<section class="bande">
  <div class="col">
    <h2>Deux caractères</h2>
    <p class="amorce">Même squelette, deux personnalités. Les deux sont nettes, comme tu les préfères.</p>
    {bloc("Tendue", "Des courbes tendues entre le cercle et le carré, la forme de vos écrans. Précise, moderne, numérique.",
          ["Le o, le e, le g : des ronds qui tirent vers le carré.", "Des coupes horizontales, nettes, sur c, e, s, r et g.", "Un t coupé à 45 degrés en haut, comme au cutter.", "Des points légèrement carrés, sur le i et la ponctuation."], T86, T112)}
    {bloc("Élan", "Des courbes rondes, cousines de Neue Einstellung, et des coupes obliques qui montent vers la droite. Chaleureuse, en mouvement.",
          ["Le o, le e, le g : de vrais ronds, comme aujourd'hui.", "Des coupes obliques qui montent vers la droite, comme une flèche : on construit la suite.", "Le haut du t et le bout du r suivent la même pente.", "Des points ronds."], E86, E112)}
    <div class="reco"><strong>Ma recommandation : Tendue.</strong> C'est la plus personnelle des deux, et la plus nette. Sa courbe tendue fait le lien avec vos titres sans les copier : les angles du réseau, arrondis. Élan est plus douce et plus proche de ce que vous avez déjà.</div>
  </div>
</section>

<section class="bande claire">
  <div class="col">
    <h2>À côté de vos titres</h2>
    <p class="amorce">Une police de texte se choisit aussi à côté de son titre.</p>
    <figure class="duo-titre"><div class="t">On vous aide à décider</div>{compose(T86, PARA, 18, 660, couleur=NUIT)}<figcaption>Titre en Reskope Network, texte en Tendue</figcaption></figure>
    <figure class="duo-titre"><div class="t">On vous aide à décider</div>{compose(E86, PARA, 18, 660, couleur=NUIT)}<figcaption>Titre en Reskope Network, texte en Élan</figcaption></figure>
  </div>
</section>

<section class="bande">
  <div class="col">
    <h2>Par rapport à aujourd'hui</h2>
    <p class="amorce">Le même paragraphe, dans la police actuelle et dans les deux nouvelles.</p>
    <div class="compare">
      <figure><img src="neue-paragraphe.png" alt="Le paragraphe en Neue Einstellung" width="1530" height="147"><figcaption>Neue Einstellung, aujourd'hui (licence Hanken Design)</figcaption></figure>
      <figure>{compose(T86, PARA, 18, 760, couleur=NUIT)}<figcaption>Tendue</figcaption></figure>
      <figure>{compose(E86, PARA, 18, 760, couleur=NUIT)}<figcaption>Élan</figcaption></figure>
    </div>
    <p class="detail" style="margin-top:22px">Les minuscules sont un peu plus grandes que dans Neue Einstellung, pour mieux se lire à l'écran. Le l dépasse le I, pour ne plus confondre Il1.</p>
  </div>
</section>

<section class="bande sombre">
  <div class="col">
    <h2>La suite</h2>
    <p class="amorce">Tu choisis Tendue ou Élan, et je dessine le reste.</p>
    <ul class="liste">
      <li>Les lettres qui manquent (f, j, w, x, y, z), toutes les capitales, les chiffres à largeur fixe, les accents et la ponctuation française, la flèche de vos tuiles.</li>
      <li>Les graisses, du léger au gras, dans un seul fichier variable, plus les fichiers fixes pour Word, Pages et Canva.</li>
      <li>Je te montre l'ensemble avant de générer quoi que ce soit, puis je remplace Neue Einstellung partout : site, appli tech, films, cartes, images de partage.</li>
      <li>Ensuite, le livret, avec les deux polices.</li>
    </ul>
  </div>
</section>

<p class="pieds">Deuxième proposition, 27 septembre 2026. Les lettres Reskope Sans sont dessinées par le code du dépôt : elles vous appartiennent. Les textes courants de cette page sont en Jost, en attendant.</p>
'''
import re as _re
NB = '\u00a0'
def _typo(t):
    t = t.replace('« ', '«' + NB).replace(' »', NB + '»')
    return _re.sub(r' ([:;?!])', NB + r'\1', t)
_out, _pos = [], 0
for _m in _re.finditer(r'<style>.*?</style>|<[^>]+>', page, _re.S):
    _out.append(_typo(page[_pos:_m.start()])); _out.append(_m.group(0)); _pos = _m.end()
_out.append(_typo(page[_pos:]))
page = ''.join(_out)
open('page2/reskope-sans.html', 'w', encoding='utf-8').write(page)
print('ok', len(page))
