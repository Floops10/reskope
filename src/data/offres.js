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
  nom: 'Tester votre idée avant d’investir',
  court: 'Tester votre idée',
  accroche: 'Avant d’engager vos économies ou un prêt, on confronte votre idée aux gens qui devraient l’acheter. Vous décidez ensuite sur ce qu’ils ont dit, et plus seulement sur ce que vous espérez.',
  faits: {
    duree: '3 à 4 semaines',
    temps: '1 h 30 par semaine',
    prix: 'Prix fixe, écrit avant de commencer',
    livre: 'Une synthèse prête pour votre business plan',
  },
  pourVous: [
    'Vous préparez une création d’entreprise, et la banque vous demande une étude de marché.',
    'Vous voulez lancer une nouvelle offre, et vous hésitez à investir.',
    'Vous n’avez eu que l’avis de vos proches, et vous savez qu’il ne suffit pas.',
  ],
  deroule: [
    { quand: 'Le premier lundi', quoi: 'On écrit avec vous ce qui doit être vrai pour que le projet tienne : qu’il y a des clients, qu’ils paieront ce prix, qu’on sait où les trouver.', vous: '1 heure avec nous' },
    { quand: 'La première semaine', quoi: 'On trouve dix à douze personnes de votre cible, et on les interroge sur ce qu’elles vivent aujourd’hui, jamais sur ce qu’elles feraient.', vous: 'Rien, sauf si vous voulez écouter un entretien' },
    { quand: 'Le premier vendredi', quoi: 'On vous montre ce qui revient, avec leurs mots. Vous choisissez ce qu’on vérifie ensuite.', vous: '30 minutes' },
    { quand: 'La deuxième semaine', quoi: 'On teste le plus risqué pour de vrai : un prix, une page, une précommande.', vous: 'Votre accord sur le test' },
    { quand: 'Le dernier vendredi', quoi: 'On vous remet tout, et vous décidez : continuer, ajuster ou arrêter.', vous: '1 heure' },
  ],
  recevez: [
    'Vos hypothèses, chacune avec son verdict et ses preuves',
    'Deux ou trois portraits de vos futurs clients, tirés des entretiens',
    'Leurs mots, classés : ce qui les décide, ce qui les freine',
    'Le prix testé, et la façon dont il a été reçu',
    'Une synthèse prête à entrer dans votre business plan',
  ],
  demande: 'Une heure le premier lundi, trente minutes chaque vendredi, et une heure pour la restitution. Si vous avez déjà des contacts dans votre cible, on commence par eux ; sinon, on les trouve.',
  pas: [
    'Un questionnaire en ligne à cinq cents réponses',
    'Une étude uniquement documentaire',
    'Vous promettre que l’idée marchera',
  ],
  suite: ['modele', 'solution', 'marque'],
  faq: [
    { q: 'Et si le résultat dit que mon idée ne tient pas ?', r: 'Alors vous l’apprenez pour le prix d’une mission, et pas pour celui d’un prêt. Souvent, l’idée ne tombe pas : elle se déplace vers une cible ou un prix qui tiennent.' },
    { q: 'Vous trouvez vous-mêmes les personnes à interroger ?', r: 'Oui, si vous n’avez pas encore de clients. On passe par les réseaux locaux, les recommandations et le terrain. Si vous avez des contacts, on commence par eux.' },
    { q: 'Ça remplace l’étude de marché de mon business plan ?', r: 'Ça en devient la partie la plus solide : des entretiens, des chiffres qu’on sait expliquer, et un test réel. Les chiffres du secteur se trouvent en ligne ; ce que vos clients vont faire, non.' },
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
  nom: 'Comprendre pourquoi vos clients achètent, ou partent',
  court: 'Comprendre vos clients',
  accroche: 'Vous avez des explications en tête : le prix, la concurrence, internet. On va demander à vos clients gagnés, perdus et partis ce qui les a vraiment décidés.',
  faits: {
    duree: '3 à 4 semaines',
    temps: '1 h 30 par semaine',
    prix: 'Prix fixe, écrit avant de commencer',
    livre: 'Les moments qui décident d’une vente, et quoi changer',
  },
  pourVous: [
    'Vos devis restent sans réponse plus souvent qu’avant.',
    'Des clients fidèles ne reviennent plus, sans rien dire.',
    'Vous voulez savoir ce qui vous distingue vraiment, avant d’investir dans une nouvelle vitrine.',
  ],
  deroule: [
    { quand: 'Le premier lundi', quoi: 'On choisit ensemble les clients à appeler : ceux qui ont signé, ceux qui ont refusé, ceux qui sont partis. Vous les prévenez, ou vous nous transmettez ceux qui ont accepté.', vous: '1 heure, et quelques messages à vos clients' },
    { quand: 'La première semaine', quoi: 'Huit à douze entretiens sur leur dernier achat ou leur dernier refus : ce qu’ils ont comparé, ce qui les a fait hésiter, ce qui les a décidés.', vous: 'Rien' },
    { quand: 'Le premier vendredi', quoi: 'On vous montre le parcours de vos clients, et les moments où tout se joue.', vous: '30 minutes' },
    { quand: 'La deuxième semaine', quoi: 'On teste la correction la plus prometteuse sur vos prochaines affaires : un devis plus lisible, un rappel plus rapide.', vous: 'Votre équipe applique le test' },
    { quand: 'Le dernier vendredi', quoi: 'Vous recevez les pistes classées par impact, chacune avec ce qu’elle coûte.', vous: '1 heure' },
  ],
  recevez: [
    'La carte du parcours de vos clients, de la première demande à la décision',
    'Les trois à cinq moments qui décident d’une vente',
    'Des portraits de clients tirés des entretiens',
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
    { q: 'Mes clients vont-ils accepter de vous parler ?', r: 'La plupart acceptent quand vous les prévenez vous-même et que l’appel dure moins d’une heure. Les clients perdus parlent souvent plus librement à quelqu’un d’extérieur qu’à vous.' },
    { q: 'Pourquoi ne pas envoyer un questionnaire ?', r: 'Un questionnaire vous dit ce que les gens pensent faire. Un entretien sur un achat précis vous dit ce qu’ils ont fait. C’est cette différence qui explique vos devis.' },
    { q: 'Et après ?', r: 'Si la correction demande un outil, par exemple un devis plus rapide à produire ou un suivi des relances, on peut le construire. Sinon, vous repartez avec ce qu’il faut changer, et c’est tout.' },
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
    { quand: 'Dans la semaine', quoi: 'On le passe à la grille de ce que regardent les financeurs : la cohérence entre le marché, vos besoins et votre rentabilité.', vous: 'Rien' },
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
  suite: ['financeurs', 'modele', 'idee'],
  faq: [
    { q: 'Vous écrivez le business plan ?', r: 'Non. On le relit, on le challenge, et on vous aide à le nourrir. Le dossier doit rester le vôtre : c’est vous qui allez le défendre.' },
    { q: 'Et s’il manque une étude de marché ?', r: 'On vous le dit, et on vous montre comment l’obtenir. Si le calendrier le permet, une mission « Tester votre idée » produit exactement les preuves qui manquent.' },
    { q: 'Qui relit ?', r: 'Thomy, qui a accompagné pendant deux ans des créateurs d’entreprise jusqu’à leur passage devant les financeurs. Florian relit avec elle les chiffres et les preuves de terrain.' },
  ],
  cta: 'Parlons de votre dossier',
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
    id: 'modele', pole: 'bp', statut: 'suite', mene: 'Thomy', scene: 'rampe',
    nom: 'Nourrir votre business plan',
    accroche: 'On ne rédige pas votre business plan : on le nourrit. Votre modèle, vos hypothèses chiffrées, et les preuves de terrain qui les rendent crédibles.',
    pourQui: 'Les porteurs de projet et les jeunes entreprises qui construisent leur dossier.',
    recevez: ['Un modèle économique clair', 'Des hypothèses chiffrées et sourcées', 'Les chapitres marché et clientèle, nourris de preuves'],
    duree: '2 à 3 semaines',
  },
  {
    id: 'financeurs', pole: 'bp', statut: 'suite', mene: 'Thomy', scene: 'relecture',
    nom: 'Préparer le passage devant les financeurs',
    accroche: 'On répète avant le vrai rendez-vous : le pitch, les chiffres, et les questions qui déstabilisent.',
    pourQui: 'Toute personne qui va défendre son projet devant une banque, un réseau de financement ou un associé.',
    recevez: ['Un pitch prêt', 'Les questions difficiles, et vos réponses'],
    duree: 'Une semaine',
  },
  {
    id: 'marque', pole: 'bp', statut: 'suite', mene: 'Thomy', scene: 'cadre',
    nom: 'Poser le cadre de votre marque',
    accroche: 'Une marque ne commence pas par un logo. Elle part des portraits de vos clients et de votre positionnement, et se traduit en règles que n’importe quel graphiste peut suivre. On n’est pas graphistes diplômés, et on vous le dit.',
    pourQui: 'Les créateurs, et les entreprises qui repositionnent leur offre.',
    recevez: ['Un document de règles de marque', 'La liste des supports à produire, dans l’ordre, avec un budget'],
    duree: '3 à 5 jours sur deux à trois semaines',
  },
  {
    id: 'equipes', pole: 'discovery', statut: 'suite', mene: 'Florian', scene: 'inventaire',
    nom: 'Comprendre comment vos équipes travaillent',
    accroche: 'La même information est saisie trois fois, et personne ne sait qui utilise quoi. On fait le tour, poste par poste, avant de toucher à un seul outil.',
    pourQui: 'Les entreprises de dix à cinquante personnes où les outils se sont empilés.',
    recevez: ['La carte de vos outils et de ce qui circule entre eux', 'Les tâches répétitives, chiffrées', 'Les améliorations, classées'],
    duree: '2 à 5 jours sur place, puis la synthèse',
    liens: [
      { to: '/exemple-bilan', label: 'Voir un exemple de bilan' },
      { to: '/atelier', label: 'Dessiner vos outils vous-même' },
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

export const PORTES = [idee, clients, dossier];
export const SUITE = suite;
export const OFFRES = [...PORTES, ...SUITE];
export const OFFRE = Object.fromEntries(OFFRES.map((o) => [o.id, o]));
export const PORTE_PAR_SLUG = Object.fromEntries(PORTES.map((p) => [p.slug, p]));

/* Ce qu'une mission apporte à la suivante : les liens de la carte. */
export const LIENS = [
  ['dossier', 'idee', 'il manque des preuves'],
  ['idee', 'modele', 'les preuves nourrissent le dossier'],
  ['idee', 'marque', 'les portraits fondent la marque'],
  ['idee', 'solution', 'une piste à tester'],
  ['clients', 'solution', 'une piste à creuser'],
  ['equipes', 'construire', 'une tâche à outiller'],
  ['solution', 'construire', 'une solution validée'],
  ['dossier', 'financeurs', 'un dossier à défendre'],
  ['modele', 'financeurs', 'un dossier prêt'],
  ['construire', 'autonomie', 'votre équipe reprend la main'],
];

/* Le prix, dit une seule fois et partout pareil. */
export const PRIX = {
  titre: 'Un prix fixe, écrit avant de commencer.',
  texte: 'Le premier échange est gratuit et dure trente minutes. Si on pense ne pas pouvoir vous aider, on vous le dit à ce moment-là. Sinon, vous recevez sous quarante-huit heures une proposition écrite, avec un prix qui ne bougera plus.',
  micro: 'TVA non applicable : le prix écrit est le prix que vous payez.',
};

/* Comment on commence : trois moments, rien de payant avant le troisième. */
export const DEBUT = [
  { quand: 'Aujourd’hui', quoi: 'Un premier échange de trente minutes, gratuit, au téléphone ou en visio.' },
  { quand: 'Sous 48 heures', quoi: 'Une proposition écrite, avec un prix fixe qui ne bougera plus.' },
  { quand: 'Quand vous dites oui', quoi: 'La mission commence un lundi, par une heure avec vous.' },
];
