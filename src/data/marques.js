/* ════════════════════════════════════════════════════════════
   UNE MARQUE MÈRE, TROIS MARQUES.

   Reskope fait une seule chose : vous aider à décider, puis construire la
   suite. Mais on ne parle pas de la même façon à quelqu'un qui se lance, au
   dirigeant d'une entreprise de cinq personnes et à celui d'une entreprise
   de quatre-vingts. D'où trois marques, une par moment de la vie d'une
   entreprise, qui gardent la même méthode et le même R :

     Reskope Create    se lancer                créer ou reprendre     ambre
     Reskope Define    prendre forme            1 à 10 personnes       menthe
     Reskope Elevate   prendre de la hauteur    10 à 250 personnes     ciel

   La marque d'une page vit dans html[data-marque] : les couleurs, les
   formes, la trame de fond, la transition et le logo en découlent (voir
   styles/marques.css). L'accueil et les pages de la maison (qui on est,
   contact, mentions) parlent au nom de Reskope.

   La même liste existe dans l'autre application (tech/src/data/marques.js) :
   garder les deux identiques.
   ════════════════════════════════════════════════════════════ */

export const MERE = {
  id: 'reskope',
  nom: 'Reskope',
  teinte: '#f0eee8',
  fr: { promesse: 'On vous aide à décider, et on construit la suite.' },
  en: { promesse: 'We help you decide, then we build what comes next.' },
};

export const MARQUES = {
  create: {
    id: 'create',
    teinte: '#f6eee2',
    nom: 'Create',
    espace: 'creation',
    couleur: 'soleil',
    fr: {
      moment: 'Se lancer',
      pour: 'Créer ou reprendre',
      qui: 'Vous créez ou reprenez une entreprise',
      signature: 'Avant d’investir, on va voir vos futurs clients.',
    },
    en: {
      moment: 'Getting started',
      pour: 'Start or take over',
      qui: 'You are starting or taking over a business',
      signature: 'Before you invest, we go and meet your future customers.',
    },
  },
  define: {
    id: 'define',
    teinte: '#edf4f0',
    nom: 'Define',
    espace: 'tpe',
    couleur: 'menthe',
    fr: {
      moment: 'Prendre forme',
      pour: '1 à 10 personnes',
      qui: 'Vous dirigez une entreprise de 1 à 10 personnes',
      signature: 'Être trouvé, être joignable, gagner du temps.',
    },
    en: {
      moment: 'Taking shape',
      pour: '1 to 10 people',
      qui: 'You run a business of 1 to 10 people',
      signature: 'Get found, be reachable, save time.',
    },
  },
  elevate: {
    id: 'elevate',
    teinte: '#edf1f7',
    nom: 'Elevate',
    espace: 'pme',
    couleur: 'ciel',
    fr: {
      moment: 'Prendre de la hauteur',
      pour: '10 à 250 personnes',
      qui: 'Vous dirigez une entreprise de 10 à 250 personnes',
      signature: 'Des outils qui se parlent, des équipes qui avancent.',
    },
    en: {
      moment: 'Scaling up',
      pour: '10 to 250 people',
      qui: 'You run a business of 10 to 250 people',
      signature: 'Tools that talk to each other, teams that move forward.',
    },
  },
};

/** Les trois marques, dans l'ordre de la vie d'une entreprise. */
export const ORDRE = ['create', 'define', 'elevate'];

/** La marque d'un espace du site (« creation », « tpe », « pme »). */
export const MARQUE_DE_L_ESPACE = { creation: 'create', tpe: 'define', pme: 'elevate' };

/* Les pages de l'espace « en projet » (site principal), et les pages de la
   maison, qui gardent la marque d'où l'on vient. */
const PAGES_CREATE = new Set([
  '/creation', '/tester-une-idee', '/construire-votre-business-plan', '/comprendre-vos-clients',
  '/relire-votre-dossier', '/nos-offres', '/comment-ca-se-passe', '/exemple',
]);
const PAGES_MAISON = new Set(['/qui-on-est', '/contact', '/merci', '/mentions-legales', '/confidentialite', '/cgu', '/cgv']);

/** La marque d'une adresse du site, base retirée : « /tpe/offres » → « define ».
    `depuis` : la marque de la page qu'on quitte, que gardent les pages de la maison. */
export function marqueDeLaRouteDuSite(route, depuis = 'reskope') {
  const c = route.replace(/\/+$/, '') || '/';
  if (/^\/tpe(\/|$)/.test(c)) return 'define';
  if (/^\/pme(\/|$)/.test(c)) return 'elevate';
  if (PAGES_CREATE.has(c)) return 'create';
  if (PAGES_MAISON.has(c)) return depuis;
  return 'reskope';
}

/** Pose la marque sur la page : tout le reste en découle. */
export function poserMarque(id) {
  const m = MARQUES[id] ? id : 'reskope';
  const html = document.documentElement;
  if (html.dataset.marque !== m) html.dataset.marque = m;
  /* La barre du navigateur, sur téléphone, prend le ciel de la marque. */
  const teinte = document.querySelector('meta[name="theme-color"]');
  if (teinte) teinte.setAttribute('content', (MARQUES[m] || MERE).teinte);
  return m;
}

/** « Reskope Create », ou « Reskope » pour la maison. */
export const nomComplet = (id) => (MARQUES[id] ? `Reskope ${MARQUES[id].nom}` : 'Reskope');
