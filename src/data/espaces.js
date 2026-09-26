/* ════════════════════════════════════════════════════════════
   LES TROIS PERSONNES À QUI RESKOPE PARLE.

   Un seul site, trois façons de parler : à la personne qui crée ou reprend
   une entreprise, au dirigeant d'une TPE, à celui d'une PME. La question qui
   les sépare est la plus simple possible : combien êtes-vous ? Chacune a son
   espace, sa couleur d'accent, et ne voit pas les offres des autres.

   L'espace « en projet » vit dans cette application ; les espaces TPE et PME
   vivent dans l'application tech/, à leurs adresses d'origine. Passer de
   l'un à l'autre recharge donc la page, et c'est voulu : ce sont deux sites
   sous une seule adresse.

   (La même liste existe dans tech/src/data/espaces.js : garder les deux
   identiques.)
   ════════════════════════════════════════════════════════════ */

export const ESPACES = [
  {
    id: 'creation',
    court: 'En projet',
    question: 'Je crée ou je reprends une entreprise',
    taille: 'Votre projet',
    sous: 'Créer ou reprendre',
    dit: 'Trouver vos clients, construire votre business plan, convaincre la banque.',
    chemin: 'creation/',
    accent: 'soleil',
    noeuds: 1,
  },
  {
    id: 'tpe',
    court: 'TPE',
    question: 'Je dirige une entreprise de 1 à 10 personnes',
    taille: '1 à 10 personnes',
    sous: '1 à 10 personnes',
    dit: 'Être trouvé, être joignable, gagner du temps : site, rendez-vous, identité.',
    chemin: 'tpe/',
    accent: 'menthe',
    noeuds: 7,
  },
  {
    id: 'pme',
    court: 'PME',
    question: 'Je dirige une entreprise de 10 à 250 personnes',
    taille: '10 à 250 personnes',
    sous: '10 à 250 personnes',
    dit: 'Des outils qui se parlent, des équipes qui gagnent du temps : audit, liaisons, sur mesure.',
    chemin: 'pme/',
    accent: 'ciel',
    noeuds: 26,
  },
];

export const ESPACE = Object.fromEntries(ESPACES.map((e) => [e.id, e]));

/** L'adresse d'un espace, sous la base du site (« /reskope/creation/ »). */
export const adresseEspace = (id) => `${import.meta.env.BASE_URL}${ESPACE[id].chemin}`;
