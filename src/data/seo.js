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
   libellé court du fil d'Ariane. `porte` marque les missions par lesquelles
   on commence : le schema les déclare comme des services. `espace` dit à qui
   la page parle : le sélecteur de l'en-tête l'allume ; une page commune
   (contact, qui on est...) n'en a pas. */
export const PAGES = [
  {
    route: '/', priorite: '1.0', freq: 'weekly', fil: 'Accueil',
    titre: 'Créer ou faire grandir votre entreprise',
    description: 'Vous créez ou reprenez une entreprise, ou vous dirigez une TPE ou une PME : Reskope vous aide à décider, et construit la suite. À Valenciennes et à Lille.',
    h1: 'Où en est votre entreprise ?',
    resume: 'Reskope accompagne trois personnes, et parle à chacune de ce qui la concerne : celle qui crée ou reprend une entreprise (trouver ses clients, construire son business plan, convaincre la banque), le dirigeant d’une TPE de 1 à 10 personnes (être trouvé, être joignable, gagner du temps), et celui d’une PME de 10 à 250 personnes (des outils qui se parlent, des équipes qui gagnent du temps). Thomy et Florian, à Valenciennes et à Lille.',
  },
  {
    route: '/creation', espace: 'creation', priorite: '1.0', freq: 'weekly', fil: 'Créer ou reprendre',
    titre: 'Créer ou reprendre une entreprise',
    description: 'Avant d’ouvrir, sachez qui sera votre client : on va le rencontrer, on bâtit votre business plan avec ses réponses, et on vous aide à convaincre la banque.',
    h1: 'On trouve le client qui fera vivre votre projet.',
    resume: 'Pour la personne qui crée ou reprend une entreprise, d’un coffee shop à un logiciel : on va rencontrer vos futurs clients, et vous repartez avec le portrait de votre client idéal, l’endroit où le trouver et ce qu’il faut lui dire. Avec ses réponses, on construit votre business plan, de l’offre et du prix au prévisionnel et au financement, et on vous accompagne sur votre marque et votre communication. On fait ce que vous n’avez pas envie de faire, à un prix fixe, écrit avant de commencer.',
  },
  {
    route: '/tester-une-idee', espace: 'creation', priorite: '0.9', freq: 'monthly', fil: 'Tester votre idée', porte: 'idee',
    titre: 'Tester votre idée, trouver votre client idéal',
    description: 'Dix à douze entretiens avec votre cible : vous repartez avec le portrait de votre client idéal, où le trouver, quoi lui dire, et un prix testé pour de vrai.',
    h1: 'Tester votre idée avant d’investir',
    resume: 'Avant d’engager vos économies ou un prêt, on confronte votre idée aux gens qui devraient l’acheter. En trois à quatre semaines : vos hypothèses écrites et classées par risque, dix à douze entretiens avec votre cible, un test réel sur ce qui est le plus risqué, souvent le prix, et le portrait de votre client idéal, avec l’endroit où le trouver et ce qu’il faut lui dire. Une heure et demie de votre temps par semaine, un prix fixe écrit avant de commencer.',
  },
  {
    route: '/construire-votre-business-plan', espace: 'creation', priorite: '0.9', freq: 'monthly', fil: 'Construire votre business plan', porte: 'bp',
    titre: 'Construire votre business plan',
    description: 'Un business plan construit à partir de votre client : offre et prix, prévisionnel sourcé, financement, marque et communication. Sans l’écrire à votre place.',
    h1: 'Construire votre business plan, de votre client à vos chiffres',
    resume: 'On ne rédige pas votre business plan à votre place : on le construit avec vous, en commençant par le chapitre qui décide de tous les autres, votre client. Viennent ensuite l’offre et le prix, un prévisionnel dont chaque chiffre a sa source, le financement, le cadre de votre marque avec des maquettes de logo, et le plan pour aller chercher vos premiers clients. Le dossier est relu comme un financeur le lira.',
  },
  {
    route: '/relire-votre-dossier', espace: 'creation', priorite: '0.9', freq: 'monthly', fil: 'Relire votre dossier', porte: 'dossier',
    titre: 'Relecture de business plan avant la banque',
    description: 'On relit votre business plan avec les yeux du financeur : retours classés par priorité, questions à préparer, preuves à trouver. En une à deux semaines.',
    h1: 'Relire votre dossier avant les financeurs',
    resume: 'On relit votre business plan dans l’ordre où un financeur le lit, et on le passe à la grille de ce qu’il regarde : la cohérence entre le marché, vos besoins et votre rentabilité. Vous recevez des retours classés du bloquant au détail, les questions qu’on vous posera, et la liste des preuves qui manquent. On ne rédige pas le dossier à votre place : c’est vous qui allez le défendre.',
  },
  {
    route: '/comprendre-vos-clients', priorite: '0.9', freq: 'monthly', fil: 'Comprendre vos clients', porte: 'clients',
    titre: 'Comprendre pourquoi vos clients achètent',
    description: 'Vous signez moins de devis, ou vous reprenez une entreprise ? On interroge ses clients gagnés, perdus et partis pour trouver ce qui décide d’une vente.',
    h1: 'Comprendre pourquoi vos clients achètent, ou partent',
    resume: 'Pour une entreprise qui existe déjà, ou pour celle que vous reprenez : on interroge huit à douze clients, ceux qui ont signé, ceux qui ont refusé et ceux qui sont partis, sur leur dernier achat ou leur dernier refus. Vous recevez la carte de leur parcours, les moments qui décident d’une vente, les portraits de vos clients, et des pistes classées, chacune avec un test possible.',
  },
  {
    route: '/nos-offres', espace: 'creation', priorite: '0.8', freq: 'monthly', fil: 'Nos offres',
    titre: 'Nos offres pour créer ou reprendre',
    description: 'Trouver votre client idéal, construire votre business plan, convaincre la banque, poser votre marque, lancer vos premiers clients. Un prix fixe, écrit avant.',
    h1: 'Tout ce qu’on fait pour votre projet, et comment ça s’enchaîne.',
    resume: 'Pour créer ou reprendre une entreprise : trouver votre client idéal, construire votre business plan, relire votre dossier et préparer le passage devant les financeurs, poser le cadre de votre marque et votre communication, puis construire ce qui a été validé. On commence par l’une des missions de départ, et les autres se proposent ensuite, jamais d’office.',
  },
  {
    route: '/comment-ca-se-passe', espace: 'creation', priorite: '0.8', freq: 'monthly', fil: 'Comment ça se passe',
    titre: 'Comment se déroule une mission',
    description: 'Du premier échange gratuit à la décision : les étapes d’une mission, le temps qu’on vous demande chaque semaine et ce qu’on fait des données de vos clients.',
    h1: 'Comment se déroule une mission.',
    resume: 'Un premier échange gratuit de trente minutes, une proposition écrite sous quarante-huit heures, puis cinq étapes : le cadrage de vos hypothèses, les entretiens avec vos clients, le test de la piste la plus prometteuse et la décision. Une heure et demie de votre temps par semaine. Vos clients savent pourquoi on les appelle, peuvent refuser, et leurs coordonnées ne sont pas gardées après la mission.',
  },
  {
    route: '/exemple', priorite: '0.7', freq: 'monthly', fil: 'Exemple de mission',
    titre: 'Exemple de mission : une entreprise de rénovation',
    description: 'Un cas d’école complet : les hypothèses de départ, onze entretiens, ce qui revient, comment lire les chiffres, le test mené et la synthèse remise.',
    h1: 'Pourquoi une entreprise de rénovation signait moins de devis.',
    resume: 'Une mission complète, présentée comme elle se déroule : le dirigeant d’une entreprise de rénovation de huit personnes signe moins de devis qu’avant et pense que c’est le prix. Onze entretiens plus tard, sept clients parlent spontanément du délai de réponse, et deux seulement du prix. La page montre les hypothèses, les citations, la manière de lire ces chiffres, les portraits, le test et la synthèse remise. L’entreprise est inventée pour l’exemple, la méthode est la nôtre.',
  },
  {
    route: '/qui-on-est', priorite: '0.6', freq: 'yearly', fil: 'Qui on est',
    titre: 'Qui on est : Thomy et Florian',
    description: 'Thomy mène le business plan et le financement, Florian la discovery et la technique. Deux personnes, à Valenciennes et à Lille, sur chaque dossier.',
    h1: 'Bonjour, nous c’est Thomy et Florian.',
    resume: 'Reskope, ce sont deux personnes. Thomy mène le business plan, la stratégie et le passage devant les financeurs ; elle a accompagné pendant deux ans des créateurs d’entreprise jusqu’à ce rendez-vous. Florian mène les entretiens avec vos clients et la partie technique : les sites, les outils, et ce qu’on relie entre eux. Aucun des deux ne reste dans son couloir. Reskope démarre : on n’a pas encore de clients à citer, alors on montre la méthode en entier.',
  },
  {
    route: '/contact', priorite: '0.9', freq: 'yearly', fil: 'Contact',
    titre: 'Parlons de votre situation',
    description: 'Un premier échange gratuit de trente minutes pour comprendre votre situation. Si on ne peut pas vous aider, on vous le dit. Sinon, un prix écrit sous 48 h.',
    h1: 'Parlons de votre situation.',
    resume: 'Dites-nous en quelques lignes où vous en êtes, ou réservez directement un premier échange de trente minutes. Il est gratuit. Si on pense ne pas pouvoir vous aider, on vous le dit à ce moment-là ; sinon, vous recevez sous quarante-huit heures une proposition écrite, avec un prix qui ne bougera plus.',
  },
  { route: '/mentions-legales', priorite: '0.2', freq: 'yearly', fil: 'Mentions légales', titre: 'Mentions légales', description: 'Mentions légales du site Reskope : éditeur du site, directeur de publication, hébergement, propriété intellectuelle et limites de responsabilité.', h1: 'Mentions légales.', resume: 'Informations légales du site : éditeur, directeur de publication, hébergeur, propriété intellectuelle et limites de responsabilité.' },
  { route: '/confidentialite', priorite: '0.2', freq: 'yearly', fil: 'Confidentialité', titre: 'Politique de confidentialité', description: 'Quelles données le site Reskope collecte, pourquoi, combien de temps elles sont conservées, qui les reçoit et comment exercer vos droits.', h1: 'Politique de confidentialité.', resume: 'Les données collectées par le formulaire de contact et la prise de rendez-vous, leur finalité, leur durée de conservation, leurs destinataires et la manière d’exercer vos droits.' },
  { route: '/cgu', priorite: '0.2', freq: 'yearly', fil: 'CGU', titre: 'Conditions générales d’utilisation', description: 'Conditions générales d’utilisation du site Reskope : accès au site, usage autorisé, propriété du contenu publié et droit applicable.', h1: 'Conditions générales d’utilisation.', resume: 'Les règles d’accès et d’usage du site, la propriété du contenu publié et le droit applicable.' },
  { route: '/cgv', priorite: '0.2', freq: 'yearly', fil: 'CGV', titre: 'Conditions générales de vente', description: 'Conditions générales de vente Reskope : proposition écrite, prix fixe, facturation, délais, propriété des livrables et données de vos clients.', h1: 'Conditions générales de vente.', resume: 'Les conditions de vente des missions : proposition écrite, prix fixe, acompte, facturation, délais, propriété des livrables, traitement des données de vos clients et recours en cas de litige.' },
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

/* ── Les adresses qui vivent ailleurs dans le site ───────────
   Les espaces TPE et PME ont leur propre application, à leurs adresses
   d'origine (/tpe/... et /pme/...). Quelques anciennes adresses sans espace
   y renvoient, vers la même page. */
export const VERS_ENTREPRISES = {
  '/offres': 'pme/offres',
  '/methode': 'pme/methode',
  '/a-propos': 'pme/a-propos',
  '/pourquoi': 'pme/pourquoi',
  '/numerique-responsable': 'pme/numerique-responsable',
  '/atelier': 'pme/atelier',
  '/exemple-bilan': 'pme/exemple',
};

/** Le chemin (sous la base) d'une adresse qui vit dans l'espace des
    entreprises, ou null. */
/* Les pages de l'espace des entreprises qui n'existent, en fichier, que
   dans l'espace PME : les pages légales (communes aux deux espaces) et
   l'exemple de bilan. Chargées directement depuis l'espace TPE, elles
   arrivent ici (la page d'erreur du site est celle de cette application) ;
   on les renvoie vers leur exemplaire PME plutôt que vers l'accueil. */
const PME_SEULEMENT = ['mentions-legales', 'confidentialite', 'cgu', 'cgv', 'exemple'];

export function versEntreprises(chemin) {
  const propre = chemin !== '/' ? chemin.replace(/\/+$/, '') : '/';
  if (VERS_ENTREPRISES[propre]) return `${VERS_ENTREPRISES[propre]}/`;
  const [premier, second] = propre.split('/').filter(Boolean);
  if (premier !== 'tpe' && premier !== 'pme') return null;
  if (second && PME_SEULEMENT.includes(second)) return `pme/${second}/`;
  return `${premier}/`;
}
