/* ════════════════════════════════════════════════════════════
   LES EMPLACEMENTS DE MOTION DESIGN — prêts pour HyperFrames.

   Chaque emplacement réserve déjà sa place dans la page, au bon format,
   avec une affiche dessinée dans la langue de la marque : le site est
   complet sans les vidéos, et il le reste si l'une d'elles ne charge pas.

   Pour brancher une vidéo :
     1. rendre la composition HyperFrames au format indiqué ;
     2. déposer public/motion/<id>.mp4 (H.264) et public/motion/<id>.webm ;
     3. passer `pret` à true ci-dessous. Rien d'autre à toucher.

   La vidéo ne se charge qu'à l'approche de l'écran, joue en boucle, sans
   son, et s'arrête hors de vue. Avec « réduire les animations », l'affiche
   reste, et un bouton permet de lancer la lecture.
   ════════════════════════════════════════════════════════════ */

export const MOTION = {
  'creation-client-ideal': {
    titre: 'Comment naît le portrait de votre client idéal',
    ou: 'Créer ou reprendre, section « Votre client idéal »',
    ratio: '16 / 9',
    ratioMobile: '4 / 5',
    duree: '20 à 25 secondes, en boucle',
    affiche: { scene: 'synthese', etape: 1 },
    script: [
      'Un point seul : votre projet.',
      'Des personnes arrivent de la profondeur, une par entretien.',
      'Ce qu’elles disent se relie ; des groupes se forment.',
      'Un portrait se dessine, sa journée s’allume, sa zone se trace sur la carte.',
    ],
    pret: false,
  },
  'porte-idee': {
    titre: 'Tester une idée, en vingt secondes',
    ou: 'Page « Tester votre idée », premier écran',
    ratio: '1 / 1',
    duree: '15 à 20 secondes, en boucle',
    affiche: { scene: 'hypotheses', etape: 1 },
    script: [
      'Votre projet au centre, quatre hypothèses en fil de fer.',
      'Dix personnes de la cible arrivent de la profondeur.',
      'Deux hypothèses se remplissent, deux restent vides.',
    ],
    pret: false,
  },
  'porte-clients': {
    titre: 'Comprendre vos clients, en vingt secondes',
    ou: 'Page « Comprendre vos clients », premier écran',
    ratio: '1 / 1',
    duree: '15 à 20 secondes, en boucle',
    affiche: { scene: 'entretiens', etape: 1 },
    script: [
      'Onze clients autour de votre offre : signés, perdus, partis.',
      'Chacun se relie à l’offre, le temps de son entretien.',
      'Trois tours montent : ce qui décide d’une vente.',
    ],
    pret: false,
  },
  'porte-bp': {
    titre: 'Votre business plan, en vingt secondes',
    ou: 'Page « Construire votre business plan », premier écran',
    ratio: '1 / 1',
    duree: '15 à 20 secondes, en boucle',
    affiche: { scene: 'rampe', etape: 1 },
    script: [
      'Au centre, votre client idéal.',
      'L’offre, les chiffres, la marque viennent s’y accrocher, dans cet ordre.',
      'Le dossier se referme, prêt pour la banque.',
    ],
    pret: false,
  },
  'porte-dossier': {
    titre: 'Relire un dossier, en vingt secondes',
    ou: 'Page « Relire votre dossier », premier écran',
    ratio: '1 / 1',
    duree: '15 à 20 secondes, en boucle',
    affiche: { scene: 'relecture', etape: 1 },
    script: [
      'Le dossier se pose, chapitre par chapitre.',
      'Deux chapitres restent en fil de fer : pas de preuve.',
      'Les preuves arrivent et viennent les remplir.',
    ],
    pret: false,
  },
  'comment-semaine': {
    titre: 'Une semaine de mission',
    ou: 'Page « Comment ça se passe », après le déroulé',
    ratio: '16 / 9',
    ratioMobile: '4 / 5',
    duree: '25 à 30 secondes, en boucle',
    affiche: { scene: 'synthese', etape: 0 },
    script: [
      'Lundi : une heure avec vous, les hypothèses s’écrivent.',
      'Du mardi au jeudi : les entretiens, un par un.',
      'Jeudi soir : ce qui revient se range.',
      'Vendredi : trente minutes, et vous décidez.',
    ],
    pret: false,
  },
};
