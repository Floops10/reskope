# Les trois films Reskope, v2

La v1 (motion/, 50 à 60 s, en 16:9) a été refusée le 27/09/2026 : trop longue,
pas assez dynamique, trop « fait par une IA ». La v2 repart de zéro avec
cette consigne : plus court, beaucoup plus dynamique, de la vraie 3D, des
réseaux qui arrivent, de la vitesse, le niveau des très grandes marques, et
trois films vraiment différents, parce qu'ils ne parlent pas aux mêmes
personnes.

## Ce qui est commun aux trois

- **Format** : vertical 1080 × 1920, 30 images par seconde, pour les réseaux
  (Reels, TikTok, Shorts, stories, LinkedIn). Tout ce qui se lit reste dans
  la zone centrale 4:5 (de 300 à 1620 px), pour qu'on puisse recadrer en
  carré ou en 4:5 sans rien perdre.
- **Durée** : 24 à 26 s (contre 51 à 60 s en v1).
- **3D réelle** : un moteur Three.js écrit pour la marque (`src/monde.js`) :
  profondeur de champ avec bokeh, halo sur ce qui brille, flou de mouvement
  par accumulation d'images, aberration sur la vitesse, grain, et un fond en
  dégradé qui garde les couleurs de la charte exactes (pas de courbe
  « film » sur l'écran entier, seules les hautes lumières sont comprimées).
- **Deux matières** : le réseau (nœuds et liens de lumière) et les blocs aux
  trois teintes cuites des planches de la marque (le dessus, le côté,
  l'ombre, un filet sur les arêtes).
- **Typographie** : Reskope Sans, énorme, peu de mots, des phrases avec
  un verbe. Mots qui montent de derrière leur ligne, qui claquent en place,
  qui sortent en accélérant.
- **La signature** (`src/fin.js`, `src/fin.html`) : chaque film forme le R en
  3D dans sa propre matière, le pose exactement sur le dessin officiel
  (`logo/geometrie.json` : traits 3, nœuds 5,5, jonction 7), puis le logo
  complet, « On vous aide à décider, et on construit la suite. », l'appel
  de l'espace et reskope.fr, sur l'indigo.
- **Son** (`son/`) : une musique originale par film, composée et synthétisée
  en code (aucun droit à payer), calée à l'image près : chaque coupe tombe
  sur un temps, chaque apparition a son accent. Mixée à -14 LUFS, crête
  vraie à -1 dB (la norme des plateformes). Quelques bruitages viennent de
  la bibliothèque de HyperFrames (licence Pixabay, usage commercial libre).
- **Interdits respectés** : pas de tiret cadratin, pas de petites capitales
  espacées, pas de numérotation 01/02/03, pas de filet, pas de soulignement,
  le logo jamais épaissi, aucun chiffre sans source.

## Film A · En projet (Inès, qui crée ou reprend)

**Monde** : la nuit, puis l'indigo de la marque qui monte à mesure que le
réseau se construit. **Fil** : soleil. **Musique** : ré majeur, 120 à la
minute, lumineuse. **Ton** : chaleureux, « votre projet », « vos futurs
clients ».

| Temps | Image | Texte |
|---|---|---|
| 0 à 2 s | Une étincelle soleil arrive du fond et éclot, en très gros plan. | Vous avez une idée. |
| 2 à 4 s | La caméra recule d'un coup : l'idée est seule dans un champ de places vides. | Personne ne l'a encore vérifiée. |
| 4 à 8 s | Temps fort : douze futurs clients s'allument un par un (une note chacun), reliés à l'idée ; la caméra tourne autour. | On va rencontrer vos futurs clients. 10 à 12 personnes de votre cible. |
| 8 à 12 s | Leurs réponses reviennent le long des liens ; des milliers de grains volent des clients et forment le portrait. | Votre client idéal. Qui elle est, ce qui la décide, où la trouver, quoi lui dire. |
| 12 à 15 s | Le portrait devient le centre du business plan : l'offre, les chiffres, la marque, les premiers clients s'y accrochent. | Leurs réponses nourrissent votre business plan. |
| 15 à 18 s | Le saut : on traverse tout, en vitesse lumière. | Vous décidez avant d'engager vos économies. |
| 18 à 24 s | La lumière se ramasse en R, puis le logo. | Parlons de votre projet. |

## Film B · TPE (Karim, artisan)

**Monde** : le soir (la nuit, le téléphone), puis le jour : un monde clair où
la marque construit en blocs, vu d'en haut comme sur ses planches. **Fil** :
menthe. **Musique** : 128 à la minute, mi mineur la nuit, sol majeur le
jour, un groove franc. **Ton** : direct et pratique, des durées, des
résultats.

| Temps | Image | Texte |
|---|---|---|
| 0 à 3,75 s | 21:47, le téléphone vibre sur la table : 4 appels manqués. | Le soir, vous rappelez vos clients pour caler des rendez-vous. |
| 3,75 à 7,5 s | On plonge et on traverse quatre panneaux de verre, à toute vitesse. | Votre site date. Tout passe par le téléphone. Votre image ne vous ressemble plus. On ne vous trouve pas en ligne. |
| 7,5 à 9,4 s | Le dernier panneau éclate, le jour se lève, les blocs tombent et construisent. | On construit ce qui vous manque. |
| 9,4 à 13 s | La caméra descend la colonne : le site et la boutique, l'agenda, l'identité, le lancement. | Les quatre offres, puis leur vue d'ensemble. |
| 13 à 15 s | L'agenda se remplit tout seul (une note par créneau). | Vos clients réservent en ligne. |
| 15 à 17 s | Le téléphone, posé, calme : rendez-vous confirmé, rappel envoyé. | Et vous ne rappelez plus personne. |
| 17 à 18,8 s | Cinq blocs, cinq jours, le site passe en ligne. | 5 jours pour un site vitrine, mis en ligne et vérifié. |
| 18,8 à 20,6 s | Une clé en blocs tourne sur elle-même. | Le code et les accès sont à votre nom. |
| 20,6 à 26,25 s | Tout s'envole et devient le R, puis le logo. | Parlons de votre projet. |

## Film C · PME (Nathalie, 24 personnes)

**Monde** : un plan technique, la nuit : des îlots d'outils en blocs aux
filets clairs, l'information qui circule. **Fil** : ciel. **Musique** : 100 à
la minute, ré mineur, puis fa majeur au relevé, plus cinématique. **Ton** :
posé et chiffré, avec la source.

| Temps | Image | Texte |
|---|---|---|
| 0 à 2,4 s | L'année de travail : 47 semaines en grille, une horloge qui bat. | Où part le temps ? |
| 2,4 à 4,8 s | Les outils montent en îlots, chacun seul. | Vos outils ne se parlent pas. (Devis, Planning, Comptabilité, Stock, E-mails) |
| 4,8 à 7,2 s | La même information est tapée dans trois outils, à la main. | La même information est saisie trois fois. |
| 7,2 à 9,6 s | Six semaines tombent de l'année. | 209 h par an et par personne, perdues à refaire un travail déjà fait. Source : Asana, Anatomy of Work Global Index 2023 |
| 9,6 à 12 s | Temps fort : un relevé laser traverse les îlots, la carte se trace en pointillés. | En 2 à 5 jours sur place, on cartographie vos outils. |
| 12 à 14,4 s | Les liens s'allument, l'information file une seule fois d'un bout à l'autre. | On relie ce que vous avez déjà. Rien à racheter. |
| 14,4 à 16,8 s | Les semaines perdues remontent dans l'année. | Vos équipes récupèrent leurs heures. |
| 16,8 à 19,2 s | Un escalier de cinq marches qui s'allument une à une. | Vous validez chaque étape. |
| 19,2 à 24 s | Les cinq îlots et l'information deviennent les six nœuds du R, puis le logo. | Démarrer un audit. |

## Fabrication

```
motion/v2/
  src/monde.js        le moteur 3D (nuée, liens, blocs, panneaux, fond, finition, flou)
  src/type.css|js     la typographie et ses effets
  src/fin.js|html     la signature commune
  src/trois.js        Three.js rassemblé par rolldown (depuis node_modules)
  src/films/*.html    les trois films
  son/                synthèse (synthe.py, instruments.py, morceau.py), une partition par film, analyse.py
  construire.py       assemble chaque film en un projet HyperFrames autonome (films/<nom>/)
```

1. `~/.claude/skills/seo/.venv/bin/python motion/v2/son/a_creation.py` (et
   `b_tpe.py`, `c_pme.py`) : la bande-son, dans `son/sortie/`.
2. `~/.claude/skills/seo/.venv/bin/python motion/v2/construire.py` : les trois
   projets HyperFrames dans `films/`.
3. Dans chaque dossier de `films/` : `npx hyperframes lint`, `check`, puis
   `render --crf 17 -f 30 --browser-gpu` (la 3D passe par le GPU du Mac :
   environ 5 minutes par film).
