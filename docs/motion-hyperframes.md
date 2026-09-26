# Les emplacements de motion design (étape HyperFrames)

Le site réserve déjà la place de cinq films. Chaque emplacement montre en attendant
une affiche : la scène de la mission projetée en axonométrie, dans la langue de la
marque. Le site est donc complet sans les vidéos, et il le reste si l'une d'elles ne
charge pas.

La liste fait foi dans `src/data/motion.js` (titre, page, format, durée, scène
d'affiche et script de chaque film).

| Emplacement | Page | Format | Durée |
|---|---|---|---|
| `accueil-livrables` | Accueil, « Ce que vous avez entre les mains à la fin » | 16/9, 4/5 sur téléphone | 20 à 25 s, en boucle |
| `porte-idee` | Tester votre idée, premier écran | 1/1 | 15 à 20 s, en boucle |
| `porte-clients` | Comprendre vos clients, premier écran | 1/1 | 15 à 20 s, en boucle |
| `porte-dossier` | Relire votre dossier, premier écran | 1/1 | 15 à 20 s, en boucle |
| `comment-semaine` | Comment ça se passe, « Votre temps » | 16/9, 4/5 sur téléphone | 25 à 30 s, en boucle |

## Brancher un film

1. Rendre la composition HyperFrames au format indiqué :
   16/9 en 1920 × 1080, 4/5 en 1080 × 1350, 1/1 en 1080 × 1080.
2. Exporter deux fichiers : `public/motion/<id>.mp4` (H.264) et
   `public/motion/<id>.webm` (VP9). Pas de piste son.
3. Passer `pret: true` pour cet emplacement dans `src/data/motion.js`.

Rien d'autre à toucher : le lecteur se charge à l'approche de l'écran, joue sans son
et en boucle, s'arrête hors de vue, et laisse l'affiche en place avec un bouton
« Lire la vidéo » pour les visiteurs qui ont demandé moins d'animations.

## Ce que le film doit respecter

- La charte : indigo `#1C0CB3`, crème `#F0EEE8`, encre `#0E0B1F`, les trois faces
  des volumes (`#5B4BE6` dessus, `#1C0CB3` droite, `#130982` gauche), la police
  Neue Einstellung.
- La même géométrie que le site : les scènes de `src/lib/scenes.js` (plein = vérifié,
  fil de fer = pas encore vérifié, clair = ce que la mission apporte).
- Tout arrive de la profondeur et flotte ; jamais d'entrée à plat par un simple
  glissement.
- Très peu de mots, posés dans la scène, jamais un paragraphe sous la scène.
- Un poids raisonnable pour le téléphone : viser moins de 2,5 Mo par fichier.
- La première image doit ressembler à l'affiche actuelle, pour que le passage de
  l'affiche au film ne se voie pas.

La vidéo est servie par le site lui-même : la politique de sécurité (CSP) n'a pas à
être modifiée, et aucun service tiers n'est appelé.
