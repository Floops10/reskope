/* ════════════════════════════════════════════════════════════
   LES TROIS ESPACES DU SITE — la même liste que src/data/espaces.js du
   site principal, avec l'anglais en plus : l'espace des entreprises est
   bilingue, celui des projets est en français pour l'instant.

   L'espace « en projet » est servi par l'autre application (le site
   principal) : on y va par un vrai chargement de page. TPE et PME sont ici,
   et passer de l'une à l'autre garde la page où l'on est.
   ════════════════════════════════════════════════════════════ */

export const ESPACES = [
  {
    id: 'creation',
    accent: 'soleil',
    fr: { court: 'En projet', titre: 'Vous créez ou reprenez une entreprise' },
    en: { court: 'Starting out', titre: 'You are starting or taking over a business (pages in French)' },
  },
  {
    id: 'tpe',
    accent: 'menthe',
    fr: { court: 'TPE', titre: 'Entreprise de 1 à 10 personnes' },
    en: { court: 'SMB', titre: 'A business of 1 to 10 people' },
  },
  {
    id: 'pme',
    accent: 'ciel',
    fr: { court: 'PME', titre: 'Entreprise de 10 à 250 personnes' },
    en: { court: 'SME', titre: 'A business of 10 to 250 people' },
  },
];
