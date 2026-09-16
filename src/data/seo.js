/* ════════════════════════════════════════════════════════════
   LE RÉFÉRENCEMENT — une seule source pour tout ce qui se lit sans JS.

   Le site est une application : tant que le JavaScript n'a pas tourné, la
   page servie est une coquille vide. Google sait exécuter le JS, mais avec
   un budget ; les robots des IA (GPTBot, PerplexityBot, ClaudeBot) ne
   l'exécutent pas du tout. Et sur GitHub Pages, une adresse qui ne
   correspond à aucun fichier renvoie 404 : toutes les pages du site sauf
   l'accueil étaient donc introuvables pour un moteur.

   Ce fichier est la table qui règle les trois problèmes d'un coup. Au build,
   scripts/prerender.mjs écrit un vrai fichier HTML par adresse, avec son
   titre, sa description, sa canonique, ses balises de partage, son schema et
   un résumé lisible sans JS. À l'exécution, Page.jsx relit la même table pour
   tenir les balises à jour pendant la navigation. Le plan du site et le
   llms.txt en sortent aussi. Une seule liste d'adresses, donc rien ne peut
   diverger.

   Règles d'écriture :
   - titre : 60 caractères MAXIMUM, « · Reskope » compris (10 de plus)
   - description : entre 120 et 158, sinon Google la coupe
   - le résumé doit dire ce que la page dit vraiment. Pas de texte écrit pour
     le robot : ce qu'il lit est ce que le visiteur lit.
   ════════════════════════════════════════════════════════════ */

export const SITE = {
  origine: 'https://floops10.github.io',
  base: '/reskope',
  marque: 'Reskope',
  image: '/og-image.png',
  villes: ['Valenciennes', 'Lille'],
  region: 'Hauts-de-France',
};

/* Toujours avec la barre finale. Un serveur de fichiers statiques (GitHub
   Pages comme n'importe quel autre) redirige /pme/offres vers /pme/offres/ en
   301 : déclarer la forme sans barre, c'est faire pointer sa propre canonique
   vers une redirection. */
export const url = (profil, route) => {
  const fin = route === '/' ? '' : `${route}/`;
  return `${SITE.origine}${SITE.base}${profil ? `/${profil}` : ''}/${fin}`.replace(/([^:])\/\//g, '$1/');
};

/* Les pages, dans l'ordre où elles comptent. `profils` limite une page à une
   version quand l'autre n'a rien à en faire : proposer un exemple d'audit
   poste par poste à une entreprise de trois personnes n'aurait pas de sens. */
export const PAGES = [
  { route: '/', priorite: '1.0', freq: 'weekly' },
  { route: '/pourquoi', priorite: '0.8', freq: 'monthly' },
  { route: '/methode', priorite: '0.8', freq: 'monthly' },
  { route: '/offres', priorite: '0.9', freq: 'monthly' },
  { route: '/atelier', priorite: '0.8', freq: 'monthly' },
  { route: '/exemple', priorite: '0.7', freq: 'monthly', profils: ['pme'] },
  { route: '/numerique-responsable', priorite: '0.6', freq: 'yearly' },
  { route: '/a-propos', priorite: '0.6', freq: 'yearly' },
  { route: '/contact', priorite: '0.9', freq: 'yearly' },
  { route: '/mentions-legales', priorite: '0.2', freq: 'yearly', profils: ['pme'] },
  { route: '/confidentialite', priorite: '0.2', freq: 'yearly', profils: ['pme'] },
  { route: '/cgu', priorite: '0.2', freq: 'yearly', profils: ['pme'] },
  { route: '/cgv', priorite: '0.2', freq: 'yearly', profils: ['pme'] },
];

export const PROFILS = ['pme', 'tpe'];

/* La porte : l'adresse racine. Elle n'est pas une redirection déguisée, c'est
   une vraie page qui explique le site et mène aux deux versions. */
export const PORTE = {
  titre: 'Conseil numérique à Valenciennes et Lille',
  description: 'On audite les outils numériques des TPE et PME des Hauts-de-France, on relie ce qui ne se parle pas et on construit ce qui manque.',
  h1: 'On remet vos outils numériques en ordre.',
  resume: 'Reskope est un cabinet de conseil et d’ingénierie numérique installé à Valenciennes et à Lille. On rencontre vos équipes sur le terrain, on cartographie les outils que vous payez, on supprime les doublons, on relie ce qui ne communique pas et on construit ce qui manque. Le site existe en deux versions : celle des TPE, artisans et commerçants, et celle des PME de plus de dix personnes.',
};

/* ── LA VERSION PME ───────────────────────────────────────── */
const PME = {
  '/': {
    titre: 'Audit des outils numériques de votre PME',
    description: 'Audit et cartographie des outils numériques de votre PME, poste par poste, à Valenciennes et Lille. On relie ce qui ne se parle pas.',
    h1: 'Vos outils vous coûtent plus que ce que vous croyez.',
    resume: 'On vient compter, poste par poste, ce que vos logiciels vous coûtent vraiment : les abonnements payés sans être ouverts, les outils achetés deux fois pour le même travail, et les informations qu’une personne recopie à la main d’un écran à l’autre. On repart avec la carte complète de votre parc, puis on relie ce qui doit l’être et on construit ce qui manque.',
    mots: ['audit numérique PME', 'cartographie des outils', 'conseil numérique Valenciennes'],
  },
  '/pourquoi': {
    titre: 'Le coût invisible du désordre numérique',
    description: 'Près de la moitié de la semaine de travail part dans les e-mails et la recherche d’information. Les chiffres sourcés du désordre numérique en entreprise.',
    h1: 'Un coût que personne ne voit.',
    resume: 'Le temps perdu à chercher une information, à ressaisir une donnée d’un logiciel à l’autre ou à attendre une validation ne figure sur aucune facture. Cette page rassemble les chiffres sourcés de ce coût invisible, ce qu’il représente en heures et en euros pour une PME, et pourquoi il grossit tout seul.',
    mots: ['temps perdu outils entreprise', 'coût du désordre numérique'],
  },
  '/methode': {
    titre: 'Notre méthode, du cadrage à l’autonomie',
    description: 'Cadrage, audit sur le terrain, bilan chiffré, mise en œuvre, autonomie. Le déroulé complet d’un chantier Reskope, étape par étape et sans engagement caché.',
    h1: 'On ne propose rien avant d’avoir compris.',
    resume: 'Cadrage, audit poste par poste, bilan chiffré, mise en œuvre, puis autonomie : chaque étape est décrite, chiffrée avant d’être engagée, et vous pouvez vous arrêter à la fin de n’importe laquelle. On ne propose jamais une solution avant d’avoir fait le diagnostic.',
    mots: ['méthode audit numérique', 'déroulé audit outils'],
  },
  '/offres': {
    titre: 'Nos offres : audit, mise en ordre, outils',
    description: 'Quatre façons de travailler ensemble : audit et cartographie, mise en ordre, outils sur mesure, formation et suivi. Le prix est écrit avant qu’on commence.',
    h1: 'Quatre façons de travailler ensemble.',
    resume: 'Quatre chantiers : l’audit et la cartographie de vos outils, la mise en ordre qui relie ce qui ne se parle pas, les outils construits sur mesure quand rien d’existant ne convient, et la formation avec un suivi mensuel. Chaque offre s’ouvre en volume pour montrer concrètement ce qu’elle contient. Le prix dépend de votre situation, il est écrit avant le démarrage, et il ne bouge plus.',
    mots: ['audit numérique PME tarif', 'automatisation PME', 'outil métier sur mesure'],
  },
  '/atelier': {
    titre: 'Cartographier votre système d’information',
    description: 'Posez vos outils sur un plan en 3D, reliez ceux qui se parlent, voyez ce que vous payez sans l’utiliser. Gratuit, sans compte, et le schéma se télécharge.',
    h1: 'Dessinez votre système d’information.',
    resume: 'Un outil gratuit pour poser vous-même le plan de vos logiciels : un bloc par outil, sa hauteur pour la place qu’il prend chez vous, sa part pleine pour ce que vous en tirez vraiment, et des liaisons entre ceux qui communiquent. Le relevé vous dit combien d’outils ne sont reliés à rien et combien sont payés sans être ouverts. Le schéma se télécharge en image ou en vectoriel. Aucun compte, rien ne quitte votre navigateur.',
    mots: ['cartographier son système d’information', 'schéma système d’information'],
  },
  '/exemple': {
    titre: 'Exemple de bilan d’audit numérique',
    description: 'À quoi ressemble un bilan Reskope : outils recensés, doublons, coûts cachés, recommandations chiffrées. Un cas d’école complet, librement consultable.',
    h1: 'À quoi ressemble un bilan.',
    resume: 'Un bilan d’audit complet, présenté comme il est remis : le recensement des outils, les doublons trouvés, les coûts cachés, le temps perdu chiffré, et les recommandations classées par impact. C’est un cas d’école construit pour l’exemple, pas le dossier d’un client réel.',
    mots: ['exemple bilan audit numérique', 'rapport audit informatique PME'],
  },
  '/numerique-responsable': {
    titre: 'Numérique responsable : simplifier, c’est réduire',
    description: 'Moins d’outils superflus, c’est moins de serveurs, moins de stockage et moins de matériel à remplacer. Notre position sur la sobriété numérique en entreprise.',
    h1: 'Simplifier réduit aussi votre empreinte.',
    resume: 'Notre métier réduit le désordre numérique. Or moins d’outils superflus, c’est mécaniquement moins de serveurs sollicités, moins de données dupliquées, moins de matériel à remplacer et moins de temps passé. L’efficacité et la sobriété avancent dans le même sens, et cette page explique où cela s’arrête.',
    mots: ['numérique responsable PME', 'sobriété numérique entreprise'],
  },
  '/a-propos': {
    titre: 'Qui sommes-nous : Thomy et Florian',
    description: 'Thomy tient la stratégie et l’identité, Florian la technique. Deux métiers qui se nourrissent l’un l’autre, pour que le dossier avance d’un seul tenant.',
    h1: 'Bonjour, nous c’est Thomy et Florian.',
    resume: 'Reskope, ce sont deux personnes. Thomy tient le sens, la stratégie et l’identité : ce que vous voulez faire, le modèle qui tient, jusqu’à la recherche de financement. Florian tient la technique : les sites, les outils métier et les logiciels qu’on relie entre eux. On ne fait pas du conseil à la chaîne.',
    mots: ['cabinet conseil numérique Valenciennes'],
  },
  '/contact': {
    titre: 'Nous contacter',
    description: 'Parlons de vos outils. Un premier échange sans engagement pour comprendre votre situation, à Valenciennes, à Lille ou partout dans les Hauts-de-France.',
    h1: 'Parlons de vos outils.',
    resume: 'Écrivez-nous en décrivant votre situation en quelques lignes, ou réservez directement un premier échange de trente minutes. On intervient sur place dans tout le Hainaut et les Hauts-de-France, sans frais de déplacement dans un rayon de soixante kilomètres.',
    mots: ['audit numérique Valenciennes contact'],
  },
  '/mentions-legales': { titre: 'Mentions légales', description: 'Mentions légales du site Reskope : éditeur du site, directeur de publication, hébergement, propriété intellectuelle et limites de responsabilité.', h1: 'Mentions légales', resume: 'Informations légales du site : éditeur, directeur de publication, hébergeur, propriété intellectuelle et limites de responsabilité.' },
  '/confidentialite': { titre: 'Politique de confidentialité', description: 'Quelles données le site Reskope collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits.', h1: 'Politique de confidentialité', resume: 'Les données collectées par le formulaire de contact, leur finalité, leur durée de conservation et la manière d’exercer vos droits d’accès, de rectification et de suppression.' },
  '/cgu': { titre: 'Conditions générales d’utilisation', description: 'Conditions générales d’utilisation du site Reskope : accès, usage autorisé, propriété du contenu et droit applicable.', h1: 'Conditions générales d’utilisation', resume: 'Les règles d’accès et d’usage du site, la propriété du contenu publié et le droit applicable.' },
  '/cgv': { titre: 'Conditions générales de vente', description: 'Conditions générales de vente Reskope : devis, facturation, délais, propriété des livrables et médiation de la consommation.', h1: 'Conditions générales de vente', resume: 'Les conditions de vente des prestations : devis, acompte, facturation, délais, propriété des livrables et recours en cas de litige.' },
};

/* ── LA VERSION TPE ───────────────────────────────────────── */
const TPE = {
  '/': {
    titre: 'Site internet et outils pour TPE et artisans',
    description: 'Site vitrine, boutique en ligne, prise de rendez-vous et identité de marque pour les TPE, artisans et commerçants de Valenciennes et de Lille.',
    h1: 'Ce qui vous manque pour être trouvé et joignable.',
    resume: 'On construit ce qui manque aux petites entreprises : un site qui dit en une phrase ce que vous faites et pour qui, une boutique si vous vendez, une prise de rendez-vous en ligne pour arrêter de rappeler tout le monde le soir, et l’identité qui va avec. Facturé à la journée, code et accès à votre nom.',
    mots: ['création site internet TPE Valenciennes', 'site internet artisan'],
  },
  '/pourquoi': {
    titre: 'Ce que le désordre numérique vous coûte',
    description: 'Rappeler les clients, retrouver un devis, ressaisir la même information : le temps que ça prend chez une petite entreprise, et ce qu’il représente.',
    h1: 'Un coût que personne ne voit.',
    resume: 'Rappeler six personnes le soir, retrouver un devis dans sa boîte mail, retaper la même adresse dans trois outils : ce temps-là ne figure sur aucune facture. Cette page met des chiffres sourcés sur ce que ça coûte à une petite entreprise.',
    mots: ['temps perdu artisan administratif'],
  },
  '/methode': {
    titre: 'Comment on travaille, étape par étape',
    description: 'Cadrage, devis écrit, construction par petites étapes, mise en ligne, remise des clés. Rien n’est engagé avant d’être chiffré, et vous gardez tout.',
    h1: 'Du cadrage aux clés.',
    resume: 'Une demi-journée de cadrage pour comprendre ce que vous vendez et à qui, un devis écrit avant de commencer, une construction par petites étapes que vous voyez fonctionner l’une après l’autre, la mise en ligne, puis la remise du code, des fichiers sources et des accès à votre nom.',
    mots: ['création site internet étapes', 'devis site internet TPE'],
  },
  '/offres': {
    titre: 'Site, boutique, rendez-vous en ligne, marque',
    description: 'Quatre chantiers courts pour TPE : site et boutique, prise de rendez-vous en ligne, identité de marque, aide au lancement. Prix écrit avant de commencer.',
    h1: 'Quatre chantiers courts.',
    resume: 'Site vitrine et boutique en ligne, prise de rendez-vous qui se branche sur votre agenda, identité de marque qui part de ce que vous vendez vraiment, et aide au lancement pour préparer un dossier de financement. Chaque offre s’ouvre en volume pour montrer ce qu’elle contient. Le prix dépend de votre projet et il est écrit avant le démarrage.',
    mots: ['prise de rendez-vous en ligne artisan', 'boutique en ligne TPE', 'identité de marque artisan'],
  },
  '/atelier': {
    titre: 'Dessinez les outils de votre entreprise',
    description: 'Posez vos outils sur un plan en 3D, reliez ceux qui se parlent, voyez ce que vous payez sans l’utiliser. Gratuit, sans compte, et le schéma se télécharge.',
    h1: 'Dessinez votre système d’information.',
    resume: 'Un outil gratuit pour poser le plan de vos logiciels : un bloc par outil, sa hauteur pour la place qu’il prend, sa part pleine pour ce que vous en tirez, et des liens entre ceux qui communiquent. Vous voyez tout de suite ce qui n’est relié à rien et ce que vous payez sans l’ouvrir. Le schéma se télécharge, aucun compte n’est demandé.',
    mots: ['cartographier ses outils', 'schéma outils entreprise'],
  },
  '/numerique-responsable': {
    titre: 'Numérique responsable : simplifier, c’est réduire',
    description: 'Moins d’outils superflus, c’est moins de serveurs, moins de stockage et moins de matériel à remplacer. Notre position sur la sobriété numérique.',
    h1: 'Simplifier réduit aussi votre empreinte.',
    resume: 'Moins d’outils superflus, c’est mécaniquement moins de serveurs sollicités, moins de données dupliquées et moins de matériel à remplacer. L’efficacité et la sobriété avancent dans le même sens, et cette page explique honnêtement où cela s’arrête.',
    mots: ['numérique responsable petite entreprise'],
  },
  '/a-propos': {
    titre: 'Qui sommes-nous : Thomy et Florian',
    description: 'Thomy tient la stratégie et l’identité, Florian la technique. Deux métiers qui se nourrissent l’un l’autre, pour que votre projet avance d’un seul tenant.',
    h1: 'Bonjour, nous c’est Thomy et Florian.',
    resume: 'Reskope, ce sont deux personnes. Thomy tient le sens, la stratégie et l’identité, jusqu’à la recherche de financement. Florian tient la technique : les sites, les boutiques et les outils qu’on relie entre eux. On s’investit sur chaque dossier comme s’il s’agissait de notre propre entreprise.',
    mots: ['agence web Valenciennes artisan'],
  },
  '/contact': {
    titre: 'Nous contacter',
    description: 'Parlons de votre projet. Un premier échange sans engagement, à Valenciennes, à Lille ou partout dans les Hauts-de-France, sans frais de déplacement.',
    h1: 'Parlons de votre projet.',
    resume: 'Décrivez votre projet en quelques lignes, ou réservez un premier échange de trente minutes. On se déplace dans tout le Hainaut et les Hauts-de-France, sans frais dans un rayon de soixante kilomètres.',
    mots: ['création site internet Valenciennes contact'],
  },
};

export const META = { pme: PME, tpe: TPE };

/* La fiche d'une page, quelle que soit la version. Les pages légales ne sont
   décrites que côté PME : elles sont identiques, et les dupliquer dans les
   deux versions reviendrait à publier deux fois le même texte. */
export function fiche(profil, route) {
  const table = META[profil] || META.pme;
  return table[route] || META.pme[route] || null;
}

/* Toutes les adresses à produire au build et à déclarer dans le plan du site. */
export function adresses() {
  const out = [];
  for (const p of PAGES) {
    for (const profil of p.profils || PROFILS) {
      if (!fiche(profil, p.route)) continue;
      out.push({ profil, ...p });
    }
  }
  return out;
}
