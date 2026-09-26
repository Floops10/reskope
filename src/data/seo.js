/* ════════════════════════════════════════════════════════════
   LE RÉFÉRENCEMENT — une seule source pour tout ce qui se lit sans JS.

   Le site est une application : tant que le JavaScript n'a pas tourné, la
   page servie est une coquille vide. Google sait exécuter le JS, mais avec
   un budget ; les robots des IA (GPTBot, PerplexityBot, ClaudeBot) ne
   l'exécutent pas du tout. Et sur GitHub Pages, une adresse qui ne
   correspond à aucun fichier renvoie 404.

   Ce fichier est la table qui règle les trois problèmes d'un coup. Au build,
   scripts/prerender.mjs écrit un vrai fichier HTML par adresse, avec son
   titre, sa description, sa canonique, ses balises de partage, son schema et
   un résumé lisible sans JS. À l'exécution, Page.jsx relit la même table pour
   tenir les balises à jour pendant la navigation. Le plan du site, le
   llms.txt et le fil d'Ariane en sortent aussi.

   Règles d'écriture :
   - titre : 50 caractères MAXIMUM, sans « · Reskope » (ajouté partout)
   - description : entre 120 et 158, sinon Google la coupe
   - le résumé dit ce que la page dit vraiment. Pas de texte écrit pour le
     robot : ce qu'il lit est ce que le visiteur lit.
   ════════════════════════════════════════════════════════════ */

export const SITE = {
  origine: 'https://floops10.github.io',
  base: '/reskope',
  marque: 'Reskope',
  image: '/og-image.png',
  villes: ['Valenciennes', 'Lille'],
  region: 'Hauts-de-France',
};

/* Toujours avec la barre finale : un serveur de fichiers statiques redirige
   /contact vers /contact/ en 301, et une canonique ne doit jamais pointer
   vers une redirection. */
export const url = (route) => {
  const fin = route === '/' ? '' : `${route.replace(/^\//, '')}/`;
  return `${SITE.origine}${SITE.base}/${fin}`;
};

/* Les pages, dans l'ordre où elles comptent pour le visiteur. `fil` est le
   libellé court du fil d'Ariane. `porte` marque les trois missions par
   lesquelles on commence : le schema les déclare comme des services. */
export const PAGES = [
  {
    route: '/', priorite: '1.0', freq: 'weekly', fil: 'Accueil',
    titre: 'Tester votre projet auprès de vos clients',
    description: 'Avant d’engager de l’argent, on interroge vos clients, on relit votre business plan et on construit ce qui a été validé. À Valenciennes et à Lille.',
    h1: 'On vous aide à décider, et on construit la suite.',
    resume: 'Reskope accompagne les dirigeants de TPE et de PME des Hauts-de-France au moment où ils s’apprêtent à engager de l’argent : lancer une idée, investir dans une offre, présenter un dossier à la banque. On va interroger leurs clients, on relit leur business plan avec les yeux d’un financeur, et on construit seulement ce qui a été validé. Trois missions pour commencer : tester une idée, comprendre ses clients, relire son dossier.',
  },
  {
    route: '/tester-une-idee', priorite: '0.9', freq: 'monthly', fil: 'Tester votre idée', porte: 'idee',
    titre: 'Tester votre idée avant d’investir',
    description: 'Étude terrain pour créateurs et dirigeants : dix à douze entretiens avec votre cible, un test réel, et une synthèse prête pour votre business plan.',
    h1: 'Tester votre idée avant d’investir',
    resume: 'Avant d’engager vos économies ou un prêt, on confronte votre idée aux gens qui devraient l’acheter. En trois à quatre semaines : vos hypothèses écrites et classées par risque, dix à douze entretiens avec votre cible, un test réel sur ce qui est le plus risqué, souvent le prix, puis une synthèse prête à entrer dans votre business plan. Une heure et demie de votre temps par semaine, un prix fixe écrit avant de commencer.',
  },
  {
    route: '/comprendre-vos-clients', priorite: '0.9', freq: 'monthly', fil: 'Comprendre vos clients', porte: 'clients',
    titre: 'Comprendre pourquoi vos clients achètent',
    description: 'Vous signez moins de devis ? On interroge vos clients gagnés, perdus et partis pour trouver ce qui décide d’une vente, puis on teste la correction.',
    h1: 'Comprendre pourquoi vos clients achètent, ou partent',
    resume: 'Vous faites autant de devis qu’avant et vous en signez moins, ou des clients fidèles ne reviennent plus. On interroge huit à douze de vos clients, ceux qui ont signé, ceux qui ont refusé et ceux qui sont partis, sur leur dernier achat ou leur dernier refus. Vous recevez la carte de leur parcours, les moments qui décident d’une vente, et des pistes classées, chacune avec un test possible.',
  },
  {
    route: '/relire-votre-dossier', priorite: '0.9', freq: 'monthly', fil: 'Relire votre dossier', porte: 'dossier',
    titre: 'Relecture de business plan avant la banque',
    description: 'On relit votre business plan avec les yeux du financeur : retours classés par priorité, questions à préparer, preuves à trouver. En une à deux semaines.',
    h1: 'Relire votre dossier avant les financeurs',
    resume: 'On relit votre business plan dans l’ordre où un financeur le lit, et on le passe à la grille de ce qu’il regarde : la cohérence entre le marché, vos besoins et votre rentabilité. Vous recevez des retours classés du bloquant au détail, les questions qu’on vous posera, et la liste des preuves qui manquent. On ne rédige pas le dossier à votre place : c’est vous qui allez le défendre.',
  },
  {
    route: '/nos-offres', priorite: '0.8', freq: 'monthly', fil: 'Nos offres',
    titre: 'Nos offres, de la preuve à la réalisation',
    description: 'Trois missions pour commencer, puis le business plan, la marque, les outils et le passage de relais. Un prix fixe, écrit avant de commencer.',
    h1: 'Toutes nos offres, et comment elles s’enchaînent.',
    resume: 'On commence toujours par l’une de trois missions : tester une idée, comprendre ses clients ou relire son dossier. Les autres se proposent ensuite, quand on connaît votre situation : trouver et tester la solution, nourrir le business plan, préparer le passage devant les financeurs, poser le cadre de la marque, comprendre comment les équipes travaillent, construire la solution validée, et passer le relais aux équipes.',
  },
  {
    route: '/comment-ca-se-passe', priorite: '0.8', freq: 'monthly', fil: 'Comment ça se passe',
    titre: 'Comment se déroule une mission',
    description: 'Du premier échange gratuit à la décision : les étapes d’une mission, le temps qu’on vous demande chaque semaine et ce qu’on fait des données de vos clients.',
    h1: 'Comment se déroule une mission.',
    resume: 'Un premier échange gratuit de trente minutes, une proposition écrite sous quarante-huit heures, puis cinq étapes : le cadrage de vos hypothèses, les entretiens avec vos clients, le test de la piste la plus prometteuse et la décision. Une heure et demie de votre temps par semaine. Vos clients savent pourquoi on les appelle, peuvent refuser, et leurs coordonnées ne sont pas gardées après la mission.',
  },
  {
    route: '/exemple', priorite: '0.7', freq: 'monthly', fil: 'Exemple de mission',
    titre: 'Exemple de mission : une entreprise de rénovation',
    description: 'Un cas d’école complet : les hypothèses de départ, onze entretiens, ce qui revient, comment lire les chiffres, le test mené et la synthèse remise.',
    h1: 'Pourquoi une entreprise de rénovation signait moins de devis.',
    resume: 'Une mission complète, présentée comme elle se déroule : le dirigeant d’une entreprise de rénovation de huit personnes signe moins de devis qu’avant et pense que c’est le prix. Onze entretiens plus tard, sept clients parlent spontanément du délai de réponse, et deux seulement du prix. La page montre les hypothèses, les citations, la manière de lire ces chiffres, les portraits, le test et la synthèse remise. L’entreprise est inventée pour l’exemple, la méthode est la nôtre.',
  },
  {
    route: '/exemple-bilan', priorite: '0.5', freq: 'monthly', fil: 'Exemple de bilan',
    titre: 'Exemple de bilan des outils d’une PME',
    description: 'À quoi ressemble un bilan des outils d’une équipe : recensement, doublons, coûts cachés, recommandations chiffrées. Un cas d’école complet.',
    h1: 'À quoi ressemble un bilan.',
    resume: 'Le bilan de la mission « Comprendre comment vos équipes travaillent », présenté comme il est remis : le recensement des outils, les doublons trouvés, les coûts cachés, le temps perdu chiffré, et les recommandations classées par impact. C’est un cas d’école construit pour l’exemple, pas le dossier d’un client réel.',
  },
  {
    route: '/atelier', priorite: '0.5', freq: 'monthly', fil: 'L’atelier',
    titre: 'Cartographier les outils de votre entreprise',
    description: 'Posez vos outils sur un plan en 3D, reliez ceux qui se parlent, voyez ce que vous payez sans l’utiliser. Gratuit, sans compte, et le schéma se télécharge.',
    h1: 'Dessinez votre système d’information.',
    resume: 'Un outil gratuit pour poser vous-même le plan de vos logiciels : un bloc par outil, sa hauteur pour la place qu’il prend chez vous, sa part pleine pour ce que vous en tirez vraiment, et des liaisons entre ceux qui communiquent. Le schéma se télécharge en image ou en vectoriel. Aucun compte, rien ne quitte votre navigateur.',
  },
  {
    route: '/qui-on-est', priorite: '0.6', freq: 'yearly', fil: 'Qui on est',
    titre: 'Qui on est : Thomy et Florian',
    description: 'Thomy mène le business plan et le financement, Florian la discovery et la technique. Deux personnes, à Valenciennes et à Lille, sur chaque dossier.',
    h1: 'Bonjour, nous c’est Thomy et Florian.',
    resume: 'Reskope, ce sont deux personnes. Thomy mène le business plan, la stratégie et le passage devant les financeurs ; elle a accompagné pendant deux ans des créateurs d’entreprise jusqu’à ce rendez-vous. Florian mène les entretiens avec vos clients et la partie technique : les sites, les outils, et ce qu’on relie entre eux. Aucun des deux ne reste dans son couloir. Reskope démarre : on n’a pas encore de clients à citer, alors on montre la méthode en entier.',
  },
  {
    route: '/contact', priorite: '0.9', freq: 'yearly', fil: 'Contact',
    titre: 'Parlons de votre situation',
    description: 'Un premier échange gratuit de trente minutes pour comprendre votre situation. Si on ne peut pas vous aider, on vous le dit. Sinon, un prix écrit sous 48 h.',
    h1: 'Parlons de votre situation.',
    resume: 'Dites-nous en quelques lignes où vous en êtes, ou réservez directement un premier échange de trente minutes. Il est gratuit. Si on pense ne pas pouvoir vous aider, on vous le dit à ce moment-là ; sinon, vous recevez sous quarante-huit heures une proposition écrite, avec un prix qui ne bougera plus.',
  },
  { route: '/mentions-legales', priorite: '0.2', freq: 'yearly', fil: 'Mentions légales', titre: 'Mentions légales', description: 'Mentions légales du site Reskope : éditeur du site, directeur de publication, hébergement, propriété intellectuelle et limites de responsabilité.', h1: 'Mentions légales.', resume: 'Informations légales du site : éditeur, directeur de publication, hébergeur, propriété intellectuelle et limites de responsabilité.' },
  { route: '/confidentialite', priorite: '0.2', freq: 'yearly', fil: 'Confidentialité', titre: 'Politique de confidentialité', description: 'Quelles données le site Reskope collecte, pourquoi, combien de temps elles sont conservées, qui les reçoit et comment exercer vos droits.', h1: 'Politique de confidentialité.', resume: 'Les données collectées par le formulaire de contact et la prise de rendez-vous, leur finalité, leur durée de conservation, leurs destinataires et la manière d’exercer vos droits.' },
  { route: '/cgu', priorite: '0.2', freq: 'yearly', fil: 'CGU', titre: 'Conditions générales d’utilisation', description: 'Conditions générales d’utilisation du site Reskope : accès au site, usage autorisé, propriété du contenu publié et droit applicable.', h1: 'Conditions générales d’utilisation.', resume: 'Les règles d’accès et d’usage du site, la propriété du contenu publié et le droit applicable.' },
  { route: '/cgv', priorite: '0.2', freq: 'yearly', fil: 'CGV', titre: 'Conditions générales de vente', description: 'Conditions générales de vente Reskope : proposition écrite, prix fixe, facturation, délais, propriété des livrables et données de vos clients.', h1: 'Conditions générales de vente.', resume: 'Les conditions de vente des missions : proposition écrite, prix fixe, acompte, facturation, délais, propriété des livrables, traitement des données de vos clients et recours en cas de litige.' },
];

/* Les pages qui existent pour le visiteur mais qu'on ne propose pas aux
   moteurs : elles n'ont de sens qu'au bout d'un parcours. */
export const HORS_INDEX = {
  '/merci': { fil: 'Message envoyé', titre: 'Message envoyé', description: 'Votre message est bien parti. On vous répond sous vingt-quatre heures, directement.' },
};

const PAR_ROUTE = Object.fromEntries(PAGES.map((p) => [p.route, p]));

/** La fiche d'une adresse, ou null si le site ne la connaît pas. */
export function fiche(route) {
  return PAR_ROUTE[route] || HORS_INDEX[route] || null;
}

/* ── Les anciennes adresses ──────────────────────────────────
   Le site a longtemps existé en deux versions, /tpe/... et /pme/..., avec
   d'autres noms de pages. Ces adresses ont été partagées et indexées : elles
   ne doivent pas tomber sur une 404. Chacune renvoie vers la page qui dit
   aujourd'hui la même chose, ou vers l'accueil quand plus rien ne lui
   correspond. */
export const RENOMMEES = {
  '/offres': '/nos-offres',
  '/methode': '/comment-ca-se-passe',
  '/a-propos': '/qui-on-est',
  '/pourquoi': '/',
  '/numerique-responsable': '/',
};

export const ANCIENS_PROFILS = ['tpe', 'pme'];

/* Les routes que l'ancienne version publiait sous chaque profil. */
export const ANCIENNES_ROUTES = [
  '/', '/pourquoi', '/methode', '/offres', '/atelier', '/exemple',
  '/numerique-responsable', '/a-propos', '/contact',
  '/mentions-legales', '/confidentialite', '/cgu', '/cgv',
];

/** Où envoyer une ancienne adresse (chemin interne, sans la base). */
export function nouvelleAdresse(chemin) {
  const propre = chemin !== '/' ? chemin.replace(/\/+$/, '') : '/';
  const parts = propre.split('/').filter(Boolean);
  if (ANCIENS_PROFILS.includes(parts[0])) {
    const reste = `/${parts.slice(1).join('/')}`;
    /* L'exemple de l'ancienne version était un bilan d'outils : il a gardé
       son contenu, sous un autre nom. */
    if (reste === '/exemple') return '/exemple-bilan';
    return RENOMMEES[reste] || (fiche(reste) ? reste : '/');
  }
  return RENOMMEES[propre] || null;
}
