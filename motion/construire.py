"""Construit les trois films Reskope au format HyperFrames.

Chaque film part de motion/src/<film>.html et devient un projet HyperFrames
autonome dans motion/films/<film>/ : un seul index.html où la police de la
marque, les photos de l'équipe, le logo et le code commun sont incorporés
(HyperFrames ne voit qu'un fichier, sans dossier à côté).

Lancer : ~/.claude/skills/seo/.venv/bin/python motion/construire.py [film ...]
"""
import base64, json, os, sys

ICI = os.path.dirname(os.path.abspath(__file__))
DEPOT = os.path.dirname(ICI)
FILMS = ['creation', 'tpe', 'pme']
# Le nom du dossier devient le nom du projet dans HyperFrames.
DOSSIERS = {'creation': 'Reskope-en-projet', 'tpe': 'Reskope-TPE', 'pme': 'Reskope-PME'}


def b64(chemin):
    return base64.b64encode(open(os.path.join(DEPOT, chemin), 'rb').read()).decode()


def polices():
    regles = []
    for fichier, poids in [('ReskopeSans-Regular.woff2', 400), ('ReskopeSans-Medium.woff2', 500), ('ReskopeSans-SemiBold.woff2', 600)]:
        regles.append(
            "@font-face { font-family: 'Reskope Sans'; font-weight: %d; font-style: normal; font-display: block;"
            " src: url(data:font/woff2;base64,%s) format('woff2'); }" % (poids, b64('public/fonts/' + fichier)))
    return '\n'.join(regles)


def construire(film):
    geo = json.load(open(os.path.join(DEPOT, 'logo', 'geometrie.json'), encoding='utf-8'))
    source = open(os.path.join(ICI, 'src', film + '.html'), encoding='utf-8').read()
    remplacements = {
        '{{POLICES}}': polices(),
        '{{COMMUN_CSS}}': open(os.path.join(ICI, 'src', 'commun.css'), encoding='utf-8').read(),
        '{{COMMUN_JS}}': open(os.path.join(ICI, 'src', 'commun.js'), encoding='utf-8').read(),
        '{{PHOTO_FLORIAN}}': 'data:image/webp;base64,' + b64('public/florian-480.webp'),
        '{{PHOTO_THOMY}}': 'data:image/webp;base64,' + b64('public/thomy-480.webp'),
        '{{MOT_LOGO}}': geo['mot_d'],
    }
    for cle, valeur in remplacements.items():
        source = source.replace(cle, valeur)
    reste = [c for c in ('{{', '}}') if c in source]
    if reste:
        raise SystemExit(f'{film} : un repère n\'a pas été remplacé')
    dossier = os.path.join(ICI, 'films', DOSSIERS[film])
    os.makedirs(dossier, exist_ok=True)
    open(os.path.join(dossier, 'index.html'), 'w', encoding='utf-8').write(source)
    json.dump({'$schema': 'https://hyperframes.heygen.com/schema/hyperframes.json',
               'paths': {'blocks': 'compositions', 'components': 'compositions/components', 'assets': 'assets'},
               'media': {'autoProxy': True}},
              open(os.path.join(dossier, 'hyperframes.json'), 'w', encoding='utf-8'), indent=2)
    noms = {'creation': 'Reskope, en projet', 'tpe': 'Reskope, TPE', 'pme': 'Reskope, PME'}
    json.dump({'id': 'reskope-' + film, 'name': noms[film]},
              open(os.path.join(dossier, 'meta.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'{film} : {os.path.getsize(os.path.join(dossier, "index.html")) // 1024} Ko')


if __name__ == '__main__':
    for f in (sys.argv[1:] or FILMS):
        construire(f)
