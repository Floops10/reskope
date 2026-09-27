# Reskope

Le site de Reskope (conseil et ingénierie numérique, Valenciennes et Lille),
et tout ce qui porte la marque : logo, polices, livrets, cartes, films.

## Le site

- `src/` : l'aiguillage et l'espace « en projet » (React + Vite).
- `tech/` : les espaces TPE et PME, en français et en anglais. C'est une
  seconde appli Vite, assemblée avec la première au moment du build.
- `site.config.mjs` : l'adresse du site (domaine, base des chemins).
- `public/` : polices, logo, image de partage, photos.

Commandes :

- `npm run dev` : un seul serveur de développement pour les trois espaces.
- `npm run build` : build principal, pré-rendu, build de `tech/`, puis
  assemblage des deux dans `dist/`.
- `npm run apercu` : le site assemblé, servi comme il le sera en ligne.
- `npm run deploy` : build puis publication sur GitHub Pages.

Une page absente de `src/data/seo.js` n'est pas pré-rendue : Google ne la
voit pas.

## La marque

- `logo/` : les fichiers officiels du logo, générés par `scripts/logo.py`.
  Le R se réduit ou s'agrandit, ses traits ne s'épaississent jamais.
- `Typographie Sans/` : Reskope Sans, la police du texte, dessinée par
  `construire.py` (voir son LISEZ-MOI pour l'installer ou la régénérer).
- `Typographie Reseau/` : Reskope Network, la police des titres en réseau.
- `scripts/` : logo, image de partage, cartes à imprimer, pré-rendu,
  assemblage et aperçu du site.

## Les supports

- `Impression/Livrets/` : le livret complet (20 pages) et un livret de
  8 pages par espace, générés par `livrets.mjs` à partir des données du
  site. Relancer `node Impression/Livrets/livrets.mjs` après un changement
  d'offre.
- `Impression/Cartes de visite/` : les cartes de Florian et de Thomy,
  prêtes à imprimer.
- `Impression/Reskope - Direction artistique.docx` : le document de
  direction artistique.
- `Carte de visite virtuelle/` : la carte à partager en ligne.
- `motion/v2/` : les trois films de marque (HyperFrames), leur musique et
  leurs rendus (les rendus ne sont pas versionnés).
- `docs/` : les emplacements vidéo prévus sur le site.
