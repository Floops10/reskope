/* ════════════════════════════════════════════════════════════
   LES OFFRES — une seule source pour le site, la carte et les livrets.

   Onze offres, mais trois portes d'entrée seulement : c'est par elles qu'un
   client arrive. Les autres se proposent une fois la confiance installée,
   et vivent sur la page « Nos offres ».

   Chaque porte répond aux questions du persona dans l'ordre où il se les
   pose (voir src/data/persona.js) : est-ce pour moi, qu'est-ce que vous
   faites, combien de temps ça me prend, qu'est-ce que je reçois, qu'est-ce
   que vous ne faites pas, et ensuite.

   Pas de prix affiché : la règle est écrite (prix fixe, annoncé avant de
   commencer), le montant se donne après le premier échange.
   ════════════════════════════════════════════════════════════ */

export const POLES = {
  discovery: {
    nom: 'Discovery',
    ligne: 'Aller chercher la preuve chez vos clients.',
    mene: 'Florian mène, Thomy en appui.',
  },
  bp: {
    nom: 'Business plan et financement',
    ligne: 'Mettre cette preuve au service de votre décision.',
    mene: 'Thomy mène, Florian en appui.',
  },
  construire: {
    nom: 'Construire la suite',
    ligne: 'Seulement ce qui a été validé, par petites étapes.',
    mene: 'Florian mène.',
  },
};

export const STATUTS = {
  porte: 'Pour commencer',
  suite: 'Après une première mission',
  plustard: 'Bientôt',
};

/* Les niveaux où l'on intervient, de l'entreprise entière à la tâche. */
export const MAILLES = {
  entreprise: 'L’entreprise',
  marque: 'La marque',
  offre: 'Une offre ou une idée',
  segment: 'Un groupe de clients',
  parcours: 'Un parcours',
  tache: 'Une tâche',
};

/* ── LES TROIS PORTES ─────────────────────────────────────── */

const idee = {
  id: 'idee',
  slug: '/tester-une-idee',
  pole: 'discovery',
  statut: 'porte',
  mene: 'Florian',
  scene: 'hypotheses',
  motion: 'porte-idee',
  amorce: 'Je suis sûr de mon idée, mais je n’ai jamais demandé à un client.',
  nom: 'Tester votre idée, et trouver votre client idéal',
  court: 'Tester votre idée',
  accroche: 'Avant d’engager vos économies ou un prêt, on confronte votre idée aux gens qui devraient l’acheter. Vous repartez avec le portrait de votre client idéal, l’endroit où le trouver et ce qu’il faut lui dire.',
  faits: {
    duree: '3 à 4 semaines',
    temps: '1 h 30 par semaine',
    prix: 'Prix fixe, écrit avant de commencer',
    livre: 'Le portrait de votre client idéal, et comment le trouver',
  },
  pourVous: [
    'Vous préparez une création d’entreprise, et la banque vous demande une étude de marché.',
    'Vous voulez lancer une nouvelle offre, et vous hésitez à investir.',
    'Vous n’avez eu que l’avis de vos proches, et vous savez qu’il ne suffit pas.',
  ],
  deroule: [
    { quand: 'Le premier lundi', quoi: 'On écrit avec vous ce qui doit être vrai pour que le projet tienne : qu’il y a des clients, qu’ils paieront ce prix, qu’on sait où les trouver.', vous: '1 heure avec nous' },
    { quand: 'La première semaine', quoi: 'On trouve dix à douze personnes de votre cible, et on les interroge sur ce qu’elles vivent aujourd’hui, jamais sur ce qu’elles feraient.', vous: 'Rien, sauf si vous voulez écouter un entretien' },
    { quand: 'Le premier vendredi', quoi: 'On vous montre ce qui revient, avec leurs mots. Vous choisissez ce qu’on vérifie ensuite.', vous: '30 minutes' },
    { quand: 'La deuxième semaine', quoi: 'On teste le plus risqué pour de vrai : un prix, une page, une précommande.', vous: 'Votre accord sur le test' },
    { quand: 'Le dernier vendredi', quoi: 'On vous remet tout, et vous décidez : continuer, ajuster ou arrêter.', vous: '1 heure' },
  ],
  recevez: [
    'Le portrait de votre client idéal : qui il est, ce qui le décide, ce qui le freine',
    'Où le trouver : ses lieux, ses canaux, et votre zone de chalandise',
    'Quoi lui dire : les mots qui le font venir, tirés des entretiens',
    'Vos hypothèses, chacune avec son verdict et ses preuves',
    'Le prix testé, et la façon dont il a été reçu',
    'Une synthèse prête à entrer dans votre business plan',
  ],
  demande: 'Une heure le premier lundi, trente minutes chaque vendredi, et une heure pour la restitution. Si vous avez déjà des contacts dans votre cible, on commence par eux ; sinon, on les trouve.',
  pas: [
    'Un questionnaire en ligne à cinq cents réponses',
    'Une étude uniquement documentaire',
    'Vous promettre que l’idée marchera',
  ],
  suite: ['bp', 'marque', 'solution'],
  faq: [
    { q: 'C’est quoi, concrètement, un client idéal ?', r: 'Une personne précise, pas une tranche d’âge : ce qu’elle fait de ses journées, ce qui la décide, où elle passe, ce qu’elle paierait. On la dessine à partir des entretiens, et on en tire l’endroit où la trouver et ce qu’il faut lui dire. Vous en voyez trois exemples sur la page Créer ou reprendre.' },
    { q: 'Et si le résultat dit que mon idée ne tient pas ?', r: 'Alors vous l’apprenez pour le prix d’une mission, et pas pour celui d’un prêt. Souvent, l’idée ne tombe pas : elle se déplace vers une cible ou un prix qui tiennent.' },
    { q: 'Vous trouvez vous-mêmes les personnes à interroger ?', r: 'Oui, si vous n’avez pas encore de clients. On passe par les réseaux locaux, les recommandations et le terrain. Si vous avez des contacts, on commence par eux.' },
    { q: 'Ça remplace l’étude de marché de mon business plan ?', r: 'Ça en devient la partie la plus solide : des entretiens, des chiffres qu’on sait expliquer, et un test réel. Les chiffres du secteur se trouvent en ligne ; ce que vos clients vont faire, non.' },
  ],
  cta: 'Parlons de votre idée',
};

const clients = {
  id: 'clients',
  slug: '/comprendre-vos-clients',
  pole: 'discovery',
  statut: 'porte',
  mene: 'Florian',
  scene: 'entretiens',
  motion: 'porte-clients',
  amorce: 'On fait autant de devis qu’avant, et on en signe moins.',
  /* La même mission, vue par la personne qui reprend une entreprise. */
  amorceReprise: 'Je reprends une entreprise, et je veux savoir si ses clients resteront.',
  nom: 'Comprendre pourquoi vos clients achètent, ou partent',
  court: 'Comprendre vos clients',
  accroche: 'Vous avez des explications en tête : le prix, la concurrence, internet. On va demander à vos clients gagnés, perdus et partis ce qui les a vraiment décidés.',
  faits: {
    duree: '3 à 4 semaines',
    temps: '1 h 30 par semaine',
    prix: 'Prix fixe, écrit avant de commencer',
    livre: 'Votre client idéal, et les moments qui décident d’une vente',
  },
  pourVous: [
    'Vos devis restent sans réponse plus souvent qu’avant.',
    'Des clients fidèles ne reviennent plus, sans rien dire.',
    'Vous voulez savoir ce qui vous distingue vraiment, avant d’investir dans une nouvelle vitrine.',
    'Vous reprenez une entreprise, et vous voulez savoir si ses clients resteront après le départ du cédant.',
  ],
  deroule: [
    { quand: 'Le premier lundi', quoi: 'On choisit ensemble les clients à appeler : ceux qui ont signé, ceux qui ont refusé, ceux qui sont partis. Vous les prévenez, ou vous nous transmettez ceux qui ont accepté.', vous: '1 heure, et quelques messages à vos clients' },
    { quand: 'La première semaine', quoi: 'Huit à douze entretiens sur leur dernier achat ou leur dernier refus : ce qu’ils ont comparé, ce qui les a fait hésiter, ce qui les a décidés.', vous: 'Rien' },
    { quand: 'Le premier vendredi', quoi: 'On vous montre le parcours de vos clients, et les moments où tout se joue.', vous: '30 minutes' },
    { quand: 'La deuxième semaine', quoi: 'On teste la correction la plus prometteuse sur vos prochaines affaires : un devis plus lisible, un rappel plus rapide.', vous: 'Votre équipe applique le test' },
    { quand: 'Le dernier vendredi', quoi: 'Vous recevez les pistes classées par impact, chacune avec ce qu’elle coûte.', vous: '1 heure' },
  ],
  recevez: [
    'La carte du parcours de vos clients, de la première demande à la décision',
    'Les trois à cinq moments qui décident d’une vente',
    'Le portrait de votre client idéal, où en trouver d’autres, et quoi leur dire',
    'Les pistes classées, chacune avec un test possible',
  ],
  demande: 'Une heure le premier lundi, trente minutes chaque vendredi, et l’accord des clients qu’on appelle. Ils savent pourquoi on les contacte, et ils peuvent refuser.',
  pas: [
    'Une enquête de satisfaction',
    'Un audit marketing',
    'Appeler vos clients sans qu’ils sachent à quoi servent leurs réponses',
  ],
  suite: ['solution', 'construire', 'continue'],
  faq: [
    { q: 'Mes clients vont-ils accepter de vous parler ?', r: 'La plupart acceptent quand vous les prévenez vous-même et que l’appel dure moins d’une heure. Les clients perdus parlent souvent plus librement à quelqu’un d’extérieur qu’à vous.' },
    { q: 'Pourquoi ne pas envoyer un questionnaire ?', r: 'Un questionnaire vous dit ce que les gens pensent faire. Un entretien sur un achat précis vous dit ce qu’ils ont fait. C’est cette différence qui explique vos devis.' },
    { q: 'Et après ?', r: 'Si la correction demande un outil, par exemple un devis plus rapide à produire ou un suivi des relances, on peut le construire. Sinon, vous repartez avec ce qu’il faut changer, et c’est tout.' },
  ],
  cta: 'Parlons de vos clients',
};

const dossier = {
  id: 'dossier',
  slug: '/relire-votre-dossier',
  pole: 'bp',
  statut: 'porte',
  mene: 'Thomy',
  scene: 'relecture',
  motion: 'porte-dossier',
  amorce: 'Mon rendez-vous à la banque approche, et je ne sais pas si mon dossier tient.',
  nom: 'Relire votre dossier avant les financeurs',
  court: 'Relire votre dossier',
  accroche: 'On relit votre business plan avec les yeux de ceux qui vont le juger, avant qu’ils le jugent. Vous savez où il est solide, où il ne l’est pas encore, et quelles questions vous attendent.',
  faits: {
    duree: '1 à 2 semaines',
    temps: '2 heures en tout',
    prix: 'Prix fixe, écrit avant de commencer',
    livre: 'Des retours classés, et les questions qu’on vous posera',
  },
  pourVous: [
    'Vous allez présenter un projet de création ou de reprise à une banque ou à un réseau de prêt d’honneur.',
    'On vous a demandé de revoir votre prévisionnel.',
    'Vous avez écrit votre dossier seul, et personne ne l’a relu avec un œil de financeur.',
  ],
  deroule: [
    { quand: 'À réception', quoi: 'On lit tout le dossier, dans l’ordre où un financeur le lit.', vous: 'Nous l’envoyer' },
    { quand: 'Dans la semaine', quoi: 'On le passe à la grille de ce que regardent les financeurs : la cohérence entre le marché, vos besoins et votre rentabilité.', vous: 'Rien' },
    { quand: 'La restitution', quoi: 'Une heure pour vous présenter les retours, classés par priorité, et les questions qui vont tomber.', vous: '1 heure' },
    { quand: 'Après vos corrections', quoi: 'On relit une seconde fois ce que vous avez modifié.', vous: 'Nous renvoyer le dossier' },
  ],
  recevez: [
    'Des retours classés par priorité, du bloquant au détail',
    'Les questions que le financeur vous posera, et comment y répondre',
    'La liste des preuves qui manquent, et comment les obtenir',
  ],
  demande: 'Votre dossier complet, une heure pour la restitution, et une heure de plus si vous voulez qu’on prépare l’entretien ensemble.',
  pas: [
    'Rédiger votre business plan à votre place',
    'Garantir l’accord du financeur',
    'Remplacer votre expert-comptable',
  ],
  suite: ['financeurs', 'bp', 'idee'],
  faq: [
    { q: 'Vous écrivez le business plan ?', r: 'Non. On le relit, on le challenge, et on vous aide à le nourrir. Le dossier doit rester le vôtre : c’est vous qui allez le défendre.' },
    { q: 'Et s’il manque une étude de marché ?', r: 'On vous le dit, et on vous montre comment l’obtenir. Si le calendrier le permet, une mission « Tester votre idée » produit exactement les preuves qui manquent.' },
    { q: 'Qui relit ?', r: 'Thomy, qui a accompagné pendant deux ans des créateurs d’entreprise jusqu’à leur passage devant les financeurs. Florian relit avec elle les chiffres et les preuves de terrain.' },
  ],
  cta: 'Parlons de votre dossier',
};

const bp = {
  id: 'bp',
  slug: '/construire-votre-business-plan',
  pole: 'bp',
  statut: 'porte',
  mene: 'Thomy',
  scene: 'rampe',
  motion: 'porte-bp',
  amorce: 'Je dois faire un business plan, et je ne sais pas par où commencer.',
  nom: 'Construire votre business plan, de votre client à vos chiffres',
  court: 'Construire votre business plan',
  accroche: 'On ne l’écrit pas à votre place : on le construit avec vous, en commençant par le chapitre qui décide de tous les autres, votre client. Viennent ensuite l’offre et le prix, les chiffres, le financement, la marque et le plan pour vos premiers clients.',
  faits: {
    duree: '4 à 6 semaines',
    temps: '2 heures par semaine',
    prix: 'Prix fixe, écrit avant de commencer',
    livre: 'Un business plan que vous savez défendre',
  },
  pourVous: [
    'Vous créez une entreprise, et une banque, un réseau de prêt ou un associé vous demande un business plan.',
    'Vous reprenez une entreprise, et vous devez présenter votre projet de reprise.',
    'Vous avez un tableur de chiffres, mais pas encore l’histoire qui va avec.',
  ],
  deroule: [
    { quand: 'La première semaine', quoi: 'On part de votre client : qui il est, ce qu’il achète aujourd’hui, ce qui le ferait venir chez vous. On va le rencontrer.', vous: '1 heure avec nous' },
    { quand: 'La deuxième semaine', quoi: 'On fixe l’offre et le prix à partir de ce que vos clients ont dit, et on dessine votre zone de chalandise.', vous: '1 heure' },
    { quand: 'La troisième semaine', quoi: 'On construit les chiffres : chiffre d’affaires, charges, trésorerie, besoin de financement. Chaque hypothèse a sa source.', vous: '2 heures, avec vos devis et vos contraintes' },
    { quand: 'La quatrième semaine', quoi: 'On pose le cadre de votre marque, avec des maquettes de logo, et le plan pour vos premiers clients : quoi dire, où, à qui.', vous: '1 heure' },
    { quand: 'La dernière semaine', quoi: 'On relit le tout comme un financeur, et on prépare avec vous les questions qu’on vous posera.', vous: '1 heure' },
  ],
  recevez: [
    'Le portrait de votre client idéal, et l’endroit où le trouver',
    'Votre offre et votre prix, justifiés par ce que vos clients ont dit',
    'Un prévisionnel sur trois ans, chaque chiffre avec sa source',
    'Le cadre de votre marque, et des pistes de logo en maquette',
    'Le plan pour aller chercher vos premiers clients',
    'Un dossier prêt pour la banque, relu comme elle le lira',
  ],
  demande: 'Deux heures par semaine en moyenne, vos devis et vos contraintes, et l’accord de quelques futurs clients pour un entretien. Si vous n’en connaissez pas encore, on les trouve.',
  pas: [
    'Écrire le business plan à votre place : c’est vous qui allez le défendre',
    'Remplacer votre expert-comptable pour les comptes officiels',
    'Être une agence de communication : on vous accompagne avec la théorie et des maquettes, et on vous oriente quand un spécialiste est utile',
  ],
  suite: ['financeurs', 'marque', 'construire'],
  faq: [
    { q: 'Pourquoi commencer par le client, et pas par les chiffres ?', r: 'Parce que tous les chiffres en découlent : votre chiffre d’affaires, c’est un nombre de clients multiplié par ce qu’ils achètent. Si le client est flou, le prévisionnel l’est aussi, et le banquier le voit.' },
    { q: 'Vous faites vraiment le logo ?', r: 'On fait des maquettes à partir du cadre de votre marque, pour que vous puissiez démarrer. On n’est pas graphistes diplômés : si votre projet mérite un spécialiste, on vous le dit et on lui transmet le cadre.' },
    { q: 'Et si je n’ai pas encore de local ni de devis ?', r: 'On construit avec des hypothèses sourcées, et on les signale comme telles. Le business plan vit : vous le mettrez à jour quand les devis arriveront.' },
  ],
  cta: 'Parlons de votre business plan',
};

/* ── LA SUITE ─────────────────────────────────────────────── */

const suite = [
  {
    id: 'solution', pole: 'discovery', statut: 'suite', mene: 'Florian', scene: 'chantier',
    nom: 'Trouver la solution, et la tester',
    accroche: 'Vous savez ce qui coince. Avant de payer un développement, on imagine plusieurs solutions et on teste la plus prometteuse avec de vrais utilisateurs.',
    pourQui: 'Une entreprise qui a identifié une piste, souvent après une première mission.',
    recevez: ['La solution retenue, et ses preuves', 'Un plan de travail prêt pour la construire'],
    duree: '2 à 3 semaines',
  },
  {
    id: 'financeurs', pole: 'bp', statut: 'suite', mene: 'Thomy', scene: 'relecture',
    nom: 'Préparer le passage devant les financeurs',
    accroche: 'On répète avant le vrai rendez-vous : le pitch, les chiffres, et les questions qui déstabilisent.',
    pourQui: 'Toute personne qui va défendre son projet devant une banque, un réseau de financement ou un associé.',
    recevez: ['Un pitch prêt', 'Les questions difficiles, et vos réponses'],
    duree: 'Une semaine',
  },
  {
    id: 'marque', pole: 'bp', statut: 'suite', mene: 'Thomy', scene: 'cadre',
    nom: 'Poser votre marque, et communiquer',
    accroche: 'Une marque ne commence pas par un logo : elle part de votre client idéal. On pose le cadre (positionnement, ton, couleurs), on dessine des maquettes de logo pour démarrer, et on vous accompagne sur votre communication : quoi dire, où, à qui. On n’est ni graphistes diplômés ni agence de communication, et on vous le dit : quand un spécialiste est utile, on lui transmet le cadre.',
    pourQui: 'Les créateurs et les repreneurs, et les entreprises qui repositionnent leur offre.',
    recevez: ['Le cadre de votre marque, écrit', 'Des maquettes de logo pour démarrer', 'Le plan de communication pour vos premiers clients', 'La liste des supports à produire, dans l’ordre, avec un budget'],
    duree: '3 à 5 jours sur deux à trois semaines',
  },
  {
    id: 'equipes', pole: 'discovery', statut: 'suite', mene: 'Florian', scene: 'inventaire',
    nom: 'Comprendre comment vos équipes travaillent',
    accroche: 'La même information est saisie trois fois, et personne ne sait qui utilise quoi. On fait le tour, poste par poste, avant de toucher à un seul outil.',
    pourQui: 'Les entreprises de dix à cinquante personnes où les outils se sont empilés.',
    recevez: ['La carte de vos outils et de ce qui circule entre eux', 'Les tâches répétitives, chiffrées', 'Les améliorations, classées'],
    duree: '2 à 5 jours sur place, puis la synthèse',
    /* Ces deux pages vivent dans l'espace PME. */
    liens: [
      { espace: 'pme/exemple/', label: 'Voir un exemple de bilan' },
      { espace: 'pme/atelier/', label: 'Dessiner vos outils vous-même' },
    ],
  },
  {
    id: 'construire', pole: 'construire', statut: 'suite', mene: 'Florian', scene: 'chantier',
    nom: 'Construire la solution validée',
    accroche: 'Un site, une automatisation, un outil métier. On construit seulement ce qui a été validé, par petites étapes que vous testez une par une.',
    pourQui: 'Les entreprises qui sortent d’une mission avec une solution testée.',
    recevez: ['L’outil, le code et les accès à votre nom', 'La mesure du gain, avant et après'],
    duree: 'Estimée en jours avant de démarrer',
  },
  {
    id: 'autonomie', pole: 'construire', statut: 'suite', mene: 'Florian', scene: 'estrade',
    nom: 'Passer le relais à vos équipes',
    accroche: 'À la fin, vos équipes savent faire sans nous. Une prise en main, une documentation, et on reste joignables.',
    pourQui: 'Toutes les entreprises, en fin de mission.',
    recevez: ['Une équipe autonome', 'Une documentation écrite pour elle'],
    duree: 'Une demi-journée, puis un suivi léger',
  },
  {
    id: 'continue', pole: 'discovery', statut: 'plustard', mene: 'Florian',
    nom: 'Écouter vos clients chaque semaine',
    accroche: 'Un entretien par semaine, des hypothèses tenues à jour, un point par mois. Pour les entreprises qui font évoluer une offre ou un outil en continu.',
    pourQui: 'Les entreprises dont l’offre ou l’outil évolue chaque mois.',
    recevez: ['Des décisions prises sur des preuves fraîches'],
    duree: 'Au mois',
  },
];

export const PORTES = [idee, bp, dossier, clients];

/* Les situations de l'espace « en projet » : la reprise d'une entreprise y
   mène à la même mission que pour une entreprise qui existe, dite avec les
   mots de celui qui reprend. */
export const PORTES_CREATION = [idee, bp, dossier, { ...clients, amorce: clients.amorceReprise }];

/* Les offres qu'on montre à la personne qui crée ou reprend, par pôle. */
export const ORDRE_CREATION = {
  discovery: ['idee', 'clients', 'solution'],
  bp: ['bp', 'dossier', 'financeurs', 'marque'],
  construire: ['construire'],
};
export const SUITE = suite;
export const OFFRES = [...PORTES, ...SUITE];
export const OFFRE = Object.fromEntries(OFFRES.map((o) => [o.id, o]));
export const PORTE_PAR_SLUG = Object.fromEntries(PORTES.map((p) => [p.slug, p]));

/* Ce qu'une mission apporte à la suivante : les liens de la carte des
   offres de l'espace « en projet ». */
export const LIENS = [
  ['idee', 'bp', 'le client idéal nourrit le dossier'],
  ['clients', 'bp', 'les clients de l’entreprise reprise'],
  ['idee', 'marque', 'le portrait fonde la marque'],
  ['bp', 'marque', 'la marque entre au dossier'],
  ['bp', 'dossier', 'un dossier à relire'],
  ['dossier', 'financeurs', 'un dossier à défendre'],
  ['dossier', 'idee', 'il manque des preuves'],
  ['idee', 'solution', 'une piste à tester'],
  ['solution', 'construire', 'une solution validée'],
  ['marque', 'construire', 'un site à construire'],
];

/* Le prix, dit une seule fois et partout pareil. */
export const PRIX = {
  titre: 'Un prix fixe, écrit avant de commencer.',
  texte: 'Le premier échange est gratuit et dure trente minutes. Si on pense ne pas pouvoir vous aider, on vous le dit à ce moment-là. Sinon, vous recevez sous quarante-huit heures une proposition écrite, avec un prix qui ne bougera plus.',
  micro: 'TVA non applicable : le prix écrit est le prix que vous payez.',
};

/* Comment on commence : trois moments, rien de payant avant le troisième. */
export const DEBUT = [
  { quand: 'Aujourd’hui', quoi: 'Un premier échange de trente minutes, gratuit, au téléphone ou en visio.' },
  { quand: 'Sous 48 heures', quoi: 'Une proposition écrite, avec un prix fixe qui ne bougera plus.' },
  { quand: 'Quand vous dites oui', quoi: 'La mission commence un lundi, par une heure avec vous.' },
];
