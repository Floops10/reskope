/* ════════════════════════════════════════════════════════════
   LE LIVRABLE, MONTRÉ : VOTRE CLIENT IDÉAL.

   Ce qu'une personne qui crée ou reprend une entreprise emporte à la fin
   d'une discovery, ce n'est pas un rapport : c'est une personne. Qui elle
   est, ce qui la décide, à quoi ressemble sa journée, où la trouver et quoi
   lui dire. Trois exemples, parce que ça vaut pour tous les projets, d'un
   coffee shop à un logiciel.

   Les projets, les personnes et les portraits sont inventés pour l'exemple
   (les portraits sont générés) ; la forme est exactement celle du livrable.

   Les catégories portent les couleurs d'explication de la charte :
     offre    ce qui touche directement ce que vous vendez   (indigo)
     vie      son quotidien                                  (menthe)
     media    là où l'on peut la toucher                     (ciel)
     valeur   ce qui compte pour elle                        (corail)
     cle      LE moment où vous pouvez la faire venir        (soleil)
   ════════════════════════════════════════════════════════════ */

export const CATEGORIES = {
  offre: { nom: 'Lien direct avec votre offre', couleur: 'indigo' },
  vie: { nom: 'Son quotidien', couleur: 'menthe' },
  media: { nom: 'Là où la toucher', couleur: 'ciel' },
  valeur: { nom: 'Ce qui compte pour elle', couleur: 'corail' },
  cle: { nom: 'Le moment où elle peut venir', couleur: 'soleil' },
};

export const EXEMPLES = [
  {
    id: 'cafe',
    onglet: 'Un coffee shop',
    projet: 'Ouvrir un coffee shop dans le centre de Valenciennes',
    photo: 'claire',
    alt: 'Portrait d’une femme d’une trentaine d’années dans un café, une tasse à la main',
    nom: 'Claire, 34 ans',
    qui: 'Cheffe de projet, en télétravail deux jours par semaine. Elle habite le centre-ville, à dix minutes à pied.',
    decide: 'Un endroit calme pour travailler deux heures, du bon café, une prise au mur.',
    freine: 'Les cafés bruyants, le wifi qui coupe, se sentir de trop avec son ordinateur.',
    interets: [
      { t: 'Café de spécialité', cat: 'offre' },
      { t: 'Télétravail', cat: 'vie' },
      { t: 'Course à pied le dimanche', cat: 'vie' },
      { t: 'Instagram local', cat: 'media' },
      { t: 'Produits locaux', cat: 'valeur' },
      { t: 'Librairies indépendantes', cat: 'valeur' },
    ],
    journee: [
      { h: '8 h', t: 'Dépose sa fille à l’école', cat: 'vie' },
      { h: '9 h 30', t: 'Première visio', cat: 'vie' },
      { h: '12 h 30', t: 'Déjeuner rapide, près de chez elle', cat: 'media' },
      { h: '14 h', t: 'Cherche un endroit calme pour deux heures', cat: 'cle' },
      { h: '18 h 30', t: 'Courses au centre-ville', cat: 'media' },
      { h: '21 h', t: 'Instagram et podcasts', cat: 'media' },
    ],
    canaux: [
      'Instagram, dans un rayon de deux kilomètres',
      'Les groupes de parents d’élèves du quartier',
      'Les espaces de coworking de la ville',
      'Les clubs de course du dimanche',
    ],
    message: 'Un café où l’on peut travailler deux heures sans se sentir de trop.',
    zone: { rayon: '1,5 km', dit: 'Le centre-ville et les quartiers où l’on télétravaille.' },
    change: 'Les horaires dès 8 h, les prises au mur, une formule du midi, le calme de l’après-midi : tout part d’elle.',
    accent: 'soleil',
  },
  {
    id: 'chauffage',
    onglet: 'Un artisan',
    projet: 'Reprendre une entreprise de chauffage de quatre personnes',
    photo: 'marc-julie',
    alt: 'Portrait d’un couple d’une quarantaine d’années dans la cuisine de leur maison',
    nom: 'Marc et Julie, 42 et 40 ans',
    qui: 'Propriétaires d’une maison de 1975, à vingt minutes de Valenciennes. Deux enfants, deux salaires, une facture d’énergie qui grimpe.',
    decide: 'Savoir combien ils économiseront, un seul interlocuteur du devis aux aides, un rendez-vous rapide.',
    freine: 'Le démarchage insistant, les aides qu’on ne comprend pas, trois semaines d’attente pour un devis.',
    interets: [
      { t: 'Économies d’énergie', cat: 'offre' },
      { t: 'Aides à la rénovation', cat: 'offre' },
      { t: 'Bricolage le samedi', cat: 'vie' },
      { t: 'Le groupe Facebook du quartier', cat: 'media' },
      { t: 'Avis des voisins', cat: 'valeur' },
      { t: 'Un artisan qui répond vite', cat: 'valeur' },
    ],
    journee: [
      { h: '7 h 15', t: 'Départ au travail', cat: 'vie' },
      { h: '12 h 30', t: 'Lit un article sur les aides', cat: 'media' },
      { h: '18 h', t: 'La facture d’énergie arrive', cat: 'cle' },
      { h: '20 h 30', t: 'Compare trois devis en ligne', cat: 'media' },
      { h: 'Samedi', t: 'Parle travaux avec les voisins', cat: 'valeur' },
    ],
    canaux: [
      'La recherche locale sur Google, avec des avis',
      'Le bouche-à-oreille du lotissement',
      'Le groupe Facebook du quartier',
      'Les magasins de bricolage de la zone',
    ],
    message: 'En une visite, on vous dit combien vous économiserez, et quelles aides vous toucherez.',
    zone: { rayon: '20 minutes', dit: 'Les lotissements des années 1970 autour de Valenciennes.' },
    change: 'Un rappel sous 48 heures, un devis d’une page avec les aides déduites, des photos de chantiers voisins : tout part d’eux.',
    accent: 'menthe',
  },
  {
    id: 'logiciel',
    onglet: 'Un logiciel',
    projet: 'Lancer un logiciel de relance des factures pour les cabinets comptables',
    photo: 'sophie',
    alt: 'Portrait d’une femme d’une quarantaine d’années à son bureau',
    nom: 'Sophie, 46 ans',
    qui: 'Elle dirige un cabinet d’expertise comptable de huit personnes. De mars à mai, ses journées débordent.',
    decide: 'Gagner du temps en période fiscale, sans changer les outils de son équipe.',
    freine: 'Un outil de plus à apprendre, et la sécurité des données de ses clients.',
    interets: [
      { t: 'Relances de factures', cat: 'offre' },
      { t: 'Réglementation', cat: 'valeur' },
      { t: 'LinkedIn', cat: 'media' },
      { t: 'Conférences de la profession', cat: 'media' },
      { t: 'Former son équipe', cat: 'valeur' },
      { t: 'Randonnée', cat: 'vie' },
    ],
    journee: [
      { h: '8 h 30', t: 'Point avec l’équipe', cat: 'vie' },
      { h: '10 h', t: 'Relance ses clients au téléphone', cat: 'cle' },
      { h: '13 h', t: 'LinkedIn en déjeunant', cat: 'media' },
      { h: '17 h', t: 'Rendez-vous client', cat: 'vie' },
      { h: '21 h', t: 'Termine les dossiers en retard', cat: 'valeur' },
    ],
    canaux: [
      'LinkedIn, auprès des dirigeants de cabinets',
      'Les salons et conférences de la profession',
      'Les éditeurs de logiciels comptables',
      'Les groupements de cabinets indépendants',
    ],
    message: 'Vos relances partent seules, depuis l’outil que votre équipe utilise déjà.',
    zone: { rayon: 'Toute la France', dit: 'Ce qui compte, c’est la taille du cabinet, de 5 à 20 personnes, pas la distance.' },
    change: 'Une intégration avant une nouvelle interface, une démo de dix minutes, un essai hors période fiscale : tout part d’elle.',
    accent: 'ciel',
  },
];
