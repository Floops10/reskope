"""Construit les trois films Reskope v2 au format HyperFrames (vertical 1080 × 1920).

Chaque film part de motion/v2/src/films/<film>.html et devient un projet
HyperFrames autonome dans motion/v2/films/<Dossier>/ : un index.html où tout
est incorporé (police de la marque, Three.js, le moteur 3D, les images), et
la bande-son à côté dans assets/.

Three.js vient du dépôt (node_modules), rassemblé par rolldown en un seul
script : aucun appel réseau au rendu, sauf GSAP, chargé comme HyperFrames
l'attend.

Lancer : ~/.claude/skills/seo/.venv/bin/python motion/v2/construire.py [film ...]
"""
import base64, io, json, os, re, shutil, subprocess, sys

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOT = os.path.dirname(os.path.dirname(ICI))
SRC = os.path.join(ICI, 'src')
CACHE = os.path.join(ICI, '.cache')
FILMS = ['a-creation', 'b-tpe', 'c-pme']
# Le nom du dossier devient le nom du projet dans HyperFrames.
DOSSIERS = {'a-creation': 'Reskope-en-projet-v2', 'b-tpe': 'Reskope-TPE-v2', 'c-pme': 'Reskope-PME-v2'}
NOMS = {'a-creation': 'Reskope, en projet', 'b-tpe': 'Reskope, TPE', 'c-pme': 'Reskope, PME'}
# L'appel de fin, celui de l'espace du site.
APPELS = {'a-creation': 'Parlons de votre projet', 'b-tpe': 'Parlons de votre projet', 'c-pme': 'Démarrer un audit'}


def lire(*chemin):
    return open(os.path.join(*chemin), encoding='utf-8').read()


def b64(chemin):
    return base64.b64encode(open(os.path.join(DEPOT, chemin), 'rb').read()).decode()


def polices():
    regles = []
    for fichier, poids in [('NeueEinstellung-Regular.woff2', 400), ('NeueEinstellung-Medium.woff2', 500), ('NeueEinstellung-SemiBold.woff2', 600)]:
        regles.append(
            "@font-face { font-family: 'Neue Einstellung'; font-weight: %d; font-style: normal; font-display: block;"
            " src: url(data:font/woff2;base64,%s) format('woff2'); }" % (poids, b64('public/fonts/' + fichier)))
    return '\n'.join(regles)


def trois():
    """Three.js et les modules utilisés, en un script (mis en cache)."""
    os.makedirs(CACHE, exist_ok=True)
    sortie = os.path.join(CACHE, 'trois.js')
    entree = os.path.join(SRC, 'trois.js')
    if not os.path.exists(sortie) or os.path.getmtime(sortie) < os.path.getmtime(entree):
        subprocess.run([os.path.join(DEPOT, 'node_modules/.bin/rolldown'), entree, '-f', 'iife', '-m', '-p', 'browser', '-o', sortie],
                       cwd=DEPOT, check=True, capture_output=True)
    code = lire(sortie)
    # Three.js tire ses identifiants au hasard et garde une boucle d'animation
    # (jamais lancée ici) : on remplace l'un par un tirage à graine fixe et on
    # débranche l'autre, pour un rendu strictement déterministe.
    alea = ('var __alea=(function(){var a=0x2F6B;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;'
            't=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};})();')
    code = code.replace('Math.random()', '__alea()').replace('requestAnimationFrame', 'boucleNonUtilisee')
    return (alea + code).replace('</script', '<\\/script')


def image_webp(chemin, largeur=None, qualite=86):
    """Une image du dépôt, redimensionnée si besoin, en data URI WebP."""
    from PIL import Image
    im = Image.open(os.path.join(DEPOT, chemin)).convert('RGB')
    if largeur and im.width > largeur:
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    tampon = io.BytesIO()
    im.save(tampon, 'WEBP', quality=qualite, method=6)
    return 'data:image/webp;base64,' + base64.b64encode(tampon.getvalue()).decode()


def verifier_scripts(film, source):
    """Les scripts classiques partagent la portée globale : une variable
    déclarée deux fois (ou une faute de syntaxe) arrête tout le film."""
    scripts = re.findall(r'<script>(.*?)</script>', source, flags=re.S)[1:]
    chemin = os.path.join(CACHE, film + '-verif.js')
    open(chemin, 'w', encoding='utf-8').write('\n;\n'.join(scripts))
    r = subprocess.run(['node', '--check', chemin], capture_output=True, text=True)
    if r.returncode:
        raise SystemExit(f'{film} : erreur de script\n' + r.stderr[:1200])


def construire(film):
    geo = json.load(open(os.path.join(DEPOT, 'logo', 'geometrie.json'), encoding='utf-8'))
    source = lire(SRC, 'films', film + '.html')
    remplacements = {
        '{{POLICES}}': polices(),
        '{{TYPE_CSS}}': lire(SRC, 'type.css'),
        '{{TROIS}}': trois(),
        '{{TYPE_JS}}': lire(SRC, 'type.js'),
        '{{MONDE_JS}}': lire(SRC, 'monde.js'),
        '{{FIN_JS}}': lire(SRC, 'fin.js'),
        '{{FIN_HTML}}': lire(SRC, 'fin.html').replace('{{APPEL}}', APPELS[film]),
        '{{MOT_LOGO}}': geo['mot_d'],
    }
    son = os.path.join(ICI, 'son', 'sortie', film + '.m4a')
    duree = source.split('data-duration="', 1)[1].split('"', 1)[0]
    remplacements['{{AUDIO}}'] = (
        f'<audio id="bande-son" src="assets/bande-son.m4a" data-start="0" data-duration="{duree}" data-track-index="2" data-volume="1"></audio>'
        if os.path.exists(son) else '')
    if '{{PORTRAIT_CLAIRE}}' in source:
        remplacements['{{PORTRAIT_CLAIRE}}'] = image_webp('public/personas/claire.webp', 720)
    manquants = [m for m in re.findall(r'\{\{[A-Z_]+\}\}', source) if m not in remplacements]
    if manquants:
        raise SystemExit(f'{film} : repères sans valeur : {manquants}')
    for cle, valeur in remplacements.items():
        source = source.replace(cle, valeur)
    source = source.replace('{{MOT_LOGO}}', geo['mot_d'])
    verifier_scripts(film, source)
    dossier = os.path.join(ICI, 'films', DOSSIERS[film])
    os.makedirs(os.path.join(dossier, 'assets'), exist_ok=True)
    open(os.path.join(dossier, 'index.html'), 'w', encoding='utf-8').write(source)
    if os.path.exists(son):
        shutil.copyfile(son, os.path.join(dossier, 'assets', 'bande-son.m4a'))
    json.dump({'$schema': 'https://hyperframes.heygen.com/schema/hyperframes.json',
               'paths': {'blocks': 'compositions', 'components': 'compositions/components', 'assets': 'assets'},
               'media': {'autoProxy': True}},
              open(os.path.join(dossier, 'hyperframes.json'), 'w', encoding='utf-8'), indent=2)
    json.dump({'id': 'reskope-v2-' + film, 'name': NOMS[film]},
              open(os.path.join(dossier, 'meta.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{film} : {os.path.getsize(os.path.join(dossier, "index.html")) // 1024} Ko'
          + ('' if os.path.exists(son) else ' (sans bande-son)'))


if __name__ == '__main__':
    for f in (sys.argv[1:] or FILMS):
        construire(f)
