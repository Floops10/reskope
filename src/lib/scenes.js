/* ════════════════════════════════════════════════════════════
   LES SCÈNES — une offre, expliquée en volume.

   La planche de l'accueil montre une silhouette : quatre volumes qui disent
   « voilà de quoi on parle ». Ici on entre dedans, et le dessin doit faire
   tout le travail : chaque bloc porte son nom, les liens montrent ce qui
   circule, et l'objet CHANGE d'une étape à l'autre — un trou se remplit,
   des équipes se mettent au même niveau, une ressaisie à la main devient une
   passerelle. Le texte à côté ne fait que commenter ce qu'on voit bouger.

   Repère du monde : x vers la droite, y vers la profondeur, z vers le haut.
   C'est celui des livrets et de src/lib/axo.js, pour que la même géométrie
   puisse être imprimée à plat ou montée en trois dimensions.

   Un bloc : { id, x, y, w, d, h, z0, etat, nom: [fr, en] }
     plein  un outil en service
     creux  payé, jamais ouvert — ou pas encore là
     neuf   ce qu'on apporte
     socle  le plateau sur lequel tout repose

   Un lien : { de, vers, etat, z, via }
     pose      la liaison existe, une information la parcourt
     manquant  il n'y a rien : quelqu'un fait le trajet à la main

   Une étape :
     ids       les blocs qui restent allumés (les autres s'effacent)
     mots      ceux qui portent leur nom à l'écran — trois se lisent, quinze non
     liens     les liaisons montrées, posées ou manquantes
     hauteurs  les blocs qui changent de taille : c'est par là que la scène
               se transforme au lieu de se contenter de changer de texte
   Et `apparition` liste, au niveau de la scène, les blocs qui n'existent
   qu'à partir de l'étape qui les nomme — le trou avant la brique, la
   passerelle avant le premier trajet automatique.
   ════════════════════════════════════════════════════════════ */

const b = (id, x, y, w, d, h, etat, nom, z0 = 0) => ({ id, x, y, w, d, h, z0, etat, nom });

/* ── PME 1 · AUDIT ET CARTOGRAPHIE ─────────────────────────── */
/* Un parc d'outils réel : quinze blocs, trois jamais ouverts, deux qui font
   le même travail, et un qui coûte à lui seul plus que trois autres. */
const PARC = [
  ['metier', 0, 0, 6.8, 'plein', ['Logiciel métier', 'Core software']],
  ['compta', 1, 0, 4.2, 'plein', ['Comptabilité', 'Accounting']],
  ['crm', 2, 0, 4.6, 'plein', ['CRM', 'CRM']],
  ['devis', 3, 0, 3.8, 'plein', ['Devis et factures', 'Quotes and invoices']],
  ['stock', 4, 0, 2.6, 'plein', ['Stock', 'Stock']],
  ['mails', 0, 1, 3.2, 'plein', ['Messagerie', 'Email']],
  ['drive', 1, 1, 2.4, 'plein', ['Drive', 'Drive']],
  ['crm2', 2, 1, 3.4, 'plein', ['Le deuxième CRM', 'The second CRM']],
  ['planning', 3, 1, 2.2, 'plein', ['Planning', 'Scheduling']],
  ['paie', 4, 1, 3.0, 'plein', ['Paie', 'Payroll']],
  ['sauvegarde', 0, 2, 2.0, 'plein', ['Sauvegarde', 'Backup']],
  ['archives', 1, 2, 1.8, 'creux', ['Archives', 'Archives']],
  ['temps', 2, 2, 2.2, 'creux', ['Suivi du temps', 'Time tracking']],
  ['intranet', 3, 2, 2.8, 'creux', ['Intranet', 'Intranet']],
  ['signature', 4, 2, 1.6, 'plein', ['Signature', 'E-signature']],
].map(([id, i, j, h, etat, nom]) => b(id, 1 + i * 4.2, 1.2 + j * 4.4, 3, 2.6, h, etat, nom));

const inventaire = {
  sol: { W: 22, D: 14, pas: 2.2 },
  blocs: PARC,
  liens: [],
  fr: {
    titre: 'On fait le tour de vos outils',
    intro: 'Voilà un parc d’outils vu de dessus. Un bloc, un abonnement. Sa hauteur, c’est ce qu’il vous coûte sur l’année. Tournez autour : ce qui cloche se voit sans qu’on ait besoin de l’écrire.',
    fin: 'Vous repartez avec ce plan et le tableau des coûts, que vous nous confiiez la suite ou non.',
  },
  en: {
    titre: 'We go through every tool',
    intro: 'This is a software estate seen from above. One block, one subscription. Its height is what it costs you over a year. Turn around it: what is wrong shows up without anyone writing it down.',
    fin: 'You leave with this map and the cost table, whether you entrust us with the rest or not.',
  },
  etapes: [
    {
      ids: [],
      mots: ['metier', 'compta', 'mails', 'crm'],
      fr: { nom: 'Un outil, un bloc', dit: 'On part de ce que les gens ouvrent vraiment, pas de la liste des prélèvements. Chaque poste est rencontré, chaque outil est posé sur le plan avec ce qu’il coûte.' },
      en: { nom: 'One tool, one block', dit: 'We start from what people actually open, not from the list of direct debits. Every role is interviewed, every tool is placed on the map with what it costs.' },
    },
    {
      ids: ['archives', 'temps', 'intranet'],
      fr: { nom: 'Payé, jamais ouvert', dit: 'Les trois blocs en fil de fer sont des comptes actifs que plus personne n’ouvre. On les retrouve à chaque fois, et c’est presque toujours là que se trouve la première économie.' },
      en: { nom: 'Paid for, never opened', dit: 'The three wireframe blocks are live accounts nobody opens any more. We find them every single time, and that is almost always where the first saving is.' },
    },
    {
      ids: ['crm', 'crm2'],
      liens: [{ de: 'crm', vers: 'crm2', etat: 'manquant', z: 5.4 }],
      fr: { nom: 'Deux fois la même chose', dit: 'Deux outils pour le même travail, arrivés à deux ans d’écart, chacun avec la moitié des clients dedans. Personne ne l’a décidé : ça s’est empilé.' },
      en: { nom: 'The same thing twice', dit: 'Two tools for the same job, bought two years apart, each holding half the customers. Nobody decided this: it piled up.' },
    },
    {
      ids: ['metier'],
      fr: { nom: 'Le plus coûteux', dit: 'Le bloc le plus haut n’est pas forcément le plus utile. On regarde ce qu’il vous rend vraiment, et ce qu’une alternative ferait pour moins cher, sans jamais vous pousser à changer pour changer.' },
      en: { nom: 'The most expensive', dit: 'The tallest block is not necessarily the most useful. We look at what it really gives you, and what a cheaper alternative would do, without ever pushing you to change for the sake of it.' },
    },
  ],
};

/* ── PME 2 · AUDIT ET MISE EN ORDRE ────────────────────────── */
const liaison = {
  sol: { W: 22, D: 14, pas: 2.2 },
  apparition: ['main', 'pont'],
  blocs: [
    b('devis', 1.2, 1.6, 3.8, 3.2, 4.4, 'plein', ['Le devis signé', 'The signed quote']),
    b('commande', 1.2, 8.4, 3.8, 3.2, 3.6, 'plein', ['La commande', 'The order']),
    b('main', 9.4, 5.2, 2.4, 2.4, 6.2, 'creux', ['La ressaisie à la main', 'Retyping by hand']),
    b('pont', 5.4, 6.1, 11.4, 0.9, 0.7, 'neuf', ['La passerelle', 'The bridge'], 3.6),
    b('facture', 17, 1.6, 3.8, 3.2, 4.0, 'plein', ['La facture', 'The invoice']),
    b('compta', 17, 8.4, 3.8, 3.2, 4.6, 'plein', ['La compta', 'The books']),
  ],
  liens: [],
  fr: {
    titre: 'On relie ce qui ne se parle pas',
    intro: 'À gauche, là où l’information naît. À droite, là où elle doit arriver. Au milieu, aujourd’hui, il n’y a rien, alors quelqu’un fait le trajet à la main, plusieurs fois par jour.',
    fin: 'On branche ce que vous avez déjà. Rien à racheter, rien à migrer de force.',
  },
  en: {
    titre: 'We connect what does not talk',
    intro: 'On the left, where the information starts. On the right, where it has to arrive. In the middle, today, there is nothing, so somebody makes the trip by hand, several times a day.',
    fin: 'We plug in what you already have. Nothing to buy again, nothing forced into a migration.',
  },
  etapes: [
    {
      ids: ['devis', 'commande'],
      fr: { nom: 'Là où l’information naît', dit: 'Le devis, la commande, la fiche client. Elle est saisie une fois, correctement, à l’endroit prévu pour ça. Ce bout-là marche déjà : on n’y touche pas.' },
      en: { nom: 'Where the information starts', dit: 'The quote, the order, the customer record. Entered once, properly, in the place meant for it. That part already works: we leave it alone.' },
    },
    {
      ids: ['devis', 'commande', 'main', 'facture', 'compta'],
      mots: ['main'],
      liens: [
        { de: 'devis', vers: 'main', etat: 'manquant', z: 4.2 },
        { de: 'main', vers: 'compta', etat: 'manquant', z: 4.2 },
      ],
      fr: { nom: 'Le trajet à la main', dit: 'Le détour en fil de fer, c’est une personne. Elle ouvre un outil, copie, ouvre l’autre, colle. Vingt minutes par jour, une faute de frappe de temps en temps, et personne pour s’en apercevoir avant la relance du client.' },
      en: { nom: 'The trip by hand', dit: 'That wireframe detour is a person. They open one tool, copy, open the other, paste. Twenty minutes a day, the occasional typo, and nobody notices until the customer chases.' },
    },
    {
      ids: ['devis', 'commande', 'pont', 'facture', 'compta'],
      mots: ['pont'],
      liens: [
        { de: 'devis', vers: 'facture', etat: 'pose', z: 4.1 },
        { de: 'commande', vers: 'compta', etat: 'pose', z: 4.1 },
      ],
      fr: { nom: 'La passerelle', dit: 'Une fois posée, elle travaille sans vous. Le devis accepté devient une facture, l’export part au comptable, l’alerte tombe au bon moment. Le point qui circule sur la passerelle, c’est votre information : elle ne repasse plus par personne.' },
      en: { nom: 'The bridge', dit: 'Once built, it works without you. An accepted quote becomes an invoice, the export reaches the accountant, the alert fires on time. The dot travelling along the bridge is your information: it no longer goes through anybody.' },
    },
    {
      ids: ['facture', 'compta'],
      liens: [
        { de: 'devis', vers: 'facture', etat: 'pose', z: 4.1 },
        { de: 'commande', vers: 'compta', etat: 'pose', z: 4.1 },
      ],
      fr: { nom: 'Là où elle doit arriver', dit: 'La compta, le planning, le suivi. La même information, jamais retapée, donc jamais différente d’un outil à l’autre. C’est ça qu’on achète en réalité : arrêter de se demander quel écran dit vrai.' },
      en: { nom: 'Where it has to arrive', dit: 'Accounts, scheduling, follow-up. The same information, never retyped, so never different from one tool to the next. That is what you are really buying: no longer wondering which screen is telling the truth.' },
    },
  ],
};

/* ── PME 3 · OUTILS SUR MESURE ─────────────────────────────── */
const chantier = {
  sol: { W: 20, D: 14, pas: 2 },
  apparition: ['trou', 'brique', 'cles'],
  blocs: [
    b('socle1', 2, 2, 16, 10, 2.2, 'plein', ['Vos outils actuels', 'The tools you have']),
    b('socle2', 3.6, 3.2, 12.8, 7.6, 2.0, 'plein', ['Vos données', 'Your data'], 2.2),
    b('socle3', 5.2, 4.4, 9.6, 5.2, 1.8, 'plein', ['Vos habitudes', 'How you work'], 4.2),
    b('trou', 7.4, 5.4, 5.2, 3.2, 2.4, 'creux', ['Ce qui manque', 'What is missing'], 6),
    b('brique', 7.4, 5.4, 5.2, 3.2, 2.4, 'neuf', ['Ce qu’on construit', 'What we build'], 6),
    b('cles', 16.4, 10.6, 2.2, 2.2, 1.4, 'neuf', ['Le code et les accès', 'The code and the access']),
  ],
  liens: [],
  fr: {
    titre: 'On construit ce qui manque',
    intro: 'On ne repart pas de zéro. Les couches pleines sont ce que vous avez déjà : vos outils, vos données, vos façons de faire. On pose la suivante par-dessus, à la taille exacte du trou.',
    fin: 'On chiffre après le cadrage, jamais avant, et vous pouvez vous arrêter à la fin de chaque étape.',
  },
  en: {
    titre: 'We build what is missing',
    intro: 'We do not start from scratch. The solid layers are what you already have: your tools, your data, your habits. We put the next one on top, cut to the exact size of the gap.',
    fin: 'We price after the framing, never before, and you can stop at the end of any step.',
  },
  etapes: [
    {
      ids: ['socle1', 'socle2', 'socle3'],
      fr: { nom: 'Ce qui existe', dit: 'Trois couches pleines : les outils en place, les données dedans, et la manière dont vos équipes travaillent aujourd’hui. On construit avec, pas contre.' },
      en: { nom: 'What exists', dit: 'Three solid layers: the tools in place, the data inside them, and the way your teams work today. We build with that, not against it.' },
    },
    {
      ids: ['socle1', 'socle2', 'socle3', 'trou'],
      mots: ['trou'],
      fr: { nom: 'Le trou', dit: 'Le vide au sommet, c’est le geste que personne ne sait faire sans Excel ni copier-coller. On le mesure avant de couper quoi que ce soit : neuf fois sur dix il est plus petit qu’on ne le craignait.' },
      en: { nom: 'The gap', dit: 'The hollow at the top is the task nobody can do without a spreadsheet and copy-paste. We measure it before cutting anything: nine times out of ten it is smaller than feared.' },
    },
    {
      ids: ['socle1', 'socle2', 'socle3', 'brique'],
      mots: ['brique'],
      fr: { nom: 'La brique qu’on pose', dit: 'Une automatisation, un écran, un petit outil interne. Elle a exactement la forme du trou, ni plus ni moins, et elle s’appuie sur les couches du dessous au lieu de les remplacer.' },
      en: { nom: 'The brick we lay', dit: 'An automation, a screen, a small internal tool. It has exactly the shape of the gap, no more, and it rests on the layers below instead of replacing them.' },
    },
    {
      ids: ['socle1', 'socle2', 'socle3', 'brique', 'cles'],
      mots: ['cles'],
      fr: { nom: 'Vous gardez les clés', dit: 'À la livraison on vous remet le code, les fichiers sources et les accès à votre nom. Si vous ne voulez plus travailler avec nous, tout continue de tourner sans nous.' },
      en: { nom: 'You keep the keys', dit: 'On delivery we hand over the code, the source files and the access in your name. If you stop working with us, everything keeps running without us.' },
    },
  ],
};

/* ── PME 4 · FORMATION ET SUIVI ────────────────────────────── */
const GENS = [
  ['g1', 4.2, 3.0, 1.6, ['Atelier', 'Workshop']],
  ['g2', 4.2, 8.4, 2.4, ['Bureau', 'Office']],
  ['g3', 8.6, 10.2, 1.2, ['Terrain', 'Field']],
  ['g4', 13.4, 8.4, 2.8, ['Accueil', 'Front desk']],
  ['g5', 13.4, 3.0, 2.0, ['Compta', 'Accounts']],
  ['g6', 8.6, 1.4, 3.2, ['Direction', 'Management']],
].map(([id, x, y, h, nom]) => b(id, x, y, 2, 1.8, h, 'plein', nom, 1.2));

const estrade = {
  sol: { W: 20, D: 14, pas: 2 },
  apparition: ['rdv'],
  blocs: [
    b('plateau', 2, 2, 16, 10, 1.2, 'socle', ['Votre équipe', 'Your team']),
    b('outil', 8.4, 5.6, 3.2, 2.8, 5.0, 'plein', ['L’outil', 'The tool'], 1.2),
    ...GENS,
    b('rdv', 16.6, 10.8, 2, 2, 1, 'neuf', ['Le rendez-vous qui revient', 'The recurring session']),
  ],
  liens: [],
  fr: {
    titre: 'On forme vos équipes',
    intro: 'L’outil au centre, les gens autour. La hauteur d’un bloc, c’est ce que la personne sait en faire aujourd’hui. Un outil que la moitié de l’équipe n’ose pas ouvrir n’est pas un outil : c’est une dépense.',
    fin: 'Une demi-journée, une journée ou deux par mois, sans engagement de durée.',
  },
  en: {
    titre: 'We train your teams',
    intro: 'The tool in the middle, the people around it. A block’s height is what that person can do with it today. A tool half the team does not dare open is not a tool: it is an expense.',
    fin: 'Half a day, one day or two a month, with no fixed term.',
  },
  etapes: [
    {
      ids: ['outil'],
      fr: { nom: 'L’outil', dit: 'Celui que vous venez d’installer, ou celui que vous payez depuis trois ans. Peu importe : il ne rend que ce que les gens savent lui demander.' },
      en: { nom: 'The tool', dit: 'The one you just installed, or the one you have been paying for three years. Either way, it only gives back what people know how to ask of it.' },
    },
    {
      ids: ['plateau', 'outil', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
      mots: ['g2', 'g3', 'g6'],
      fr: { nom: 'Le vrai niveau', dit: 'Six blocs, six hauteurs différentes. Deux personnes s’en servent bien, trois s’en servent de travers, une l’évite complètement. C’est ce déséquilibre qu’on vient chercher, pas la moyenne.' },
      en: { nom: 'The real level', dit: 'Six blocks, six different heights. Two people use it well, three use it sideways, one avoids it entirely. That imbalance is what we come looking for, not the average.' },
    },
    {
      ids: ['plateau', 'outil', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6'],
      mots: ['g3'],
      hauteurs: { g1: 3.2, g2: 3.2, g3: 3.2, g4: 3.2, g5: 3.2, g6: 3.2 },
      fr: { nom: 'Tout le monde au même niveau', dit: 'On forme par métier, avec vos propres dossiers à l’écran, pas avec un jeu de données inventé. Les blocs montent ensemble : c’est le moment où l’outil commence à rendre ce qu’il coûte.' },
      en: { nom: 'Everyone at the same level', dit: 'We train role by role, using your own files on screen, not a made-up dataset. The blocks rise together: that is when the tool starts paying for itself.' },
    },
    {
      ids: [],
      mots: ['rdv'],
      hauteurs: { g1: 3.2, g2: 3.2, g3: 3.2, g4: 3.2, g5: 3.2, g6: 3.2 },
      fr: { nom: 'Le rendez-vous qui revient', dit: 'Une demi-journée par mois, au même moment. On reprend ce qui coince, on ajuste, on note ce qui a changé. Sans ce rendez-vous, le niveau redescend en six mois.' },
      en: { nom: 'The session that comes back', dit: 'Half a day a month, at the same time. We pick up what is stuck, adjust, write down what changed. Without that session, the level drops back within six months.' },
    },
  ],
};

/* ── TPE 1 · SITE ET BOUTIQUE ──────────────────────────────── */
const vitrine = {
  sol: { W: 22, D: 14, pas: 2.2 },
  apparition: ['boutique', 'v1', 'v2', 'v3'],
  blocs: [
    b('terrain', 2, 2, 18, 10, 0.8, 'socle', ['Votre entreprise', 'Your business']),
    b('facade', 3, 2.8, 15, 1.2, 7.2, 'plein', ['Votre site', 'Your site'], 0.8),
    b('p1', 3.4, 5.6, 2.8, 2.4, 2.6, 'plein', ['Ce que vous faites', 'What you do'], 0.8),
    b('p2', 7.2, 5.6, 2.8, 2.4, 2.0, 'plein', ['Vos réalisations', 'Your work'], 0.8),
    b('p3', 11, 5.6, 2.8, 2.4, 2.4, 'plein', ['Vos tarifs', 'Your prices'], 0.8),
    b('p4', 14.8, 5.6, 2.8, 2.4, 3.2, 'plein', ['Vous joindre', 'Reaching you'], 0.8),
    b('boutique', 15.4, 9.2, 3.4, 2.2, 3.4, 'neuf', ['La boutique', 'The shop'], 0.8),
    b('v1', 4.4, 9.6, 1.4, 1.2, 0.8, 'neuf', ['Un client qui cherche', 'A customer searching'], 0.8),
    b('v2', 7.4, 10.2, 1.4, 1.2, 0.8, 'neuf', ['', ''], 0.8),
    b('v3', 10.4, 9.6, 1.4, 1.2, 0.8, 'neuf', ['', ''], 0.8),
  ],
  liens: [],
  fr: {
    titre: 'On met votre entreprise en ligne',
    intro: 'La grande façade, c’est ce qu’on voit de vous en premier. Derrière, quatre pages seulement : celles auxquelles un client veut vraiment une réponse avant de vous appeler.',
    fin: 'Le site vous appartient : hébergement, nom de domaine et fichiers sources sont à votre nom.',
  },
  en: {
    titre: 'We put your business online',
    intro: 'The tall front is what people see of you first. Behind it, only four pages: the ones a customer actually wants an answer to before calling you.',
    fin: 'The site is yours: hosting, domain name and source files are all in your name.',
  },
  etapes: [
    {
      ids: ['facade'],
      fr: { nom: 'Ce qu’on voit d’abord', dit: 'Une page d’accueil qui dit en une phrase ce que vous faites et pour qui. Pas un carrousel, pas un slogan : la phrase que vous dites déjà au téléphone.' },
      en: { nom: 'What people see first', dit: 'A home page that says in one sentence what you do and who for. Not a carousel, not a slogan: the sentence you already say on the phone.' },
    },
    {
      ids: ['terrain', 'facade', 'p1', 'p2', 'p3', 'p4'],
      mots: ['p1', 'p2', 'p3', 'p4'],
      fr: { nom: 'Les pages qui comptent', dit: 'Ce que vous faites, ce que vous avez déjà fait, ce que ça coûte, comment vous joindre. Quatre blocs. Tout le reste attend d’être demandé.' },
      en: { nom: 'The pages that matter', dit: 'What you do, what you have already done, what it costs, how to reach you. Four blocks. Everything else waits until somebody asks for it.' },
    },
    {
      ids: ['terrain', 'facade', 'boutique'],
      mots: ['boutique'],
      fr: { nom: 'Vendre en ligne', dit: 'Si vous vendez, la boutique se pose à côté, avec le paiement et les livraisons. Si vous ne vendez pas en ligne, on ne la construit pas : c’est une page de moins à tenir à jour.' },
      en: { nom: 'Selling online', dit: 'If you sell, the shop sits alongside, with payment and shipping. If you do not sell online, we do not build it: that is one less page to keep up to date.' },
    },
    {
      ids: [],
      mots: ['v1'],
      fr: { nom: 'Le client qui vous trouve', dit: 'Les petits blocs qui approchent cherchent votre métier dans votre ville. On écrit les pages pour qu’ils tombent sur vous, et on vérifie que le site s’affiche vite sur un téléphone en 4G.' },
      en: { nom: 'The customer who finds you', dit: 'The small blocks moving in are searching for your trade in your town. We write the pages so they land on you, and we check the site loads fast on a phone.' },
    },
  ],
};

/* ── TPE 2 · PRISE DE RENDEZ-VOUS ──────────────────────────── */
const SEMAINE = [];
for (let j = 0; j < 4; j++) {
  for (let i = 0; i < 5; i++) {
    const id = `c${i}${j}`;
    const pris = (i === 1 && j === 1) || (i === 3 && j === 0) || (i === 0 && j === 3);
    /* Deux créneaux seulement portent leur nom : il suffit d'un plein et
       d'un creux nommés pour que les dix-huit autres se lisent tout seuls. */
    const nom = (i === 1 && j === 1) ? ['Déjà pris', 'Already taken']
      : (i === 4 && j === 2) ? ['Libre', 'Free'] : ['', ''];
    SEMAINE.push(b(id, 1.6 + i * 3.4, 1.4 + j * 2.6, 2.6, 1.8, pris ? 2.4 : 0.6, pris ? 'plein' : 'creux', nom));
  }
}
const creneaux = {
  sol: { W: 20, D: 13, pas: 2 },
  apparition: ['confirme', 'tel'],
  blocs: [
    ...SEMAINE,
    b('nouveau', 1.6 + 2 * 3.4, 1.4 + 2 * 2.6, 2.6, 1.8, 0.6, 'neuf', ['Le rendez-vous qu’on vient de prendre', 'The booking just made']),
    b('confirme', 17.2, 10.4, 1.8, 1.8, 1.2, 'neuf', ['La confirmation qui part seule', 'The confirmation that sends itself']),
    b('tel', 0.6, 10.4, 1.8, 1.8, 3.4, 'creux', ['Le téléphone qui sonne', 'The phone that rings']),
  ],
  liens: [],
  fr: {
    titre: 'On prend vos rendez-vous à votre place',
    intro: 'Votre semaine, vue de dessus. Les creux sont vos disponibilités réelles, celles de votre agenda ; les blocs pleins sont déjà pris. Un client choisit lui-même, quand il veut, y compris à vingt-deux heures.',
    fin: 'Ça se branche sur l’agenda que vous utilisez déjà. Vous ne changez rien à votre façon de travailler.',
  },
  en: {
    titre: 'We take your bookings for you',
    intro: 'Your week, seen from above. The hollows are your real openings, straight from your calendar; the solid blocks are already taken. A customer picks one themselves, whenever they want, including at ten at night.',
    fin: 'It plugs into the calendar you already use. Nothing changes in the way you work.',
  },
  etapes: [
    {
      ids: [],
      mots: ['c11', 'c42'],
      fr: { nom: 'Vos vraies disponibilités', dit: 'Les creux viennent de votre agenda, pas d’un tableau à tenir à jour. Vous bloquez un après-midi dans votre téléphone, il disparaît de la page dans la minute.' },
      en: { nom: 'Your real openings', dit: 'The hollows come from your calendar, not from a table you have to maintain. You block an afternoon on your phone and it disappears from the page within the minute.' },
    },
    {
      ids: [],
      mots: ['nouveau'],
      hauteurs: { nouveau: 2.4 },
      fr: { nom: 'Un client réserve', dit: 'Il choisit son créneau, laisse son nom et son numéro, et c’est fini. Pas de compte à créer, pas de mot de passe : c’est la première raison pour laquelle les gens abandonnent.' },
      en: { nom: 'A customer books', dit: 'They pick a slot, leave a name and a number, and that is it. No account to create, no password: that is the first reason people give up.' },
    },
    {
      ids: [],
      mots: ['confirme'],
      hauteurs: { nouveau: 2.4 },
      fr: { nom: 'La confirmation part seule', dit: 'Le client reçoit sa confirmation, vous recevez la vôtre, et un rappel part la veille. Les oublis de rendez-vous, c’est là qu’ils se jouent.' },
      en: { nom: 'The confirmation sends itself', dit: 'The customer gets their confirmation, you get yours, and a reminder goes out the day before. That is where no-shows are won or lost.' },
    },
    {
      ids: [],
      mots: ['tel'],
      hauteurs: { nouveau: 2.4 },
      fr: { nom: 'Le téléphone se tait', dit: 'Le bloc en fil de fer, ce sont les appels que vous ne prenez plus : « vous auriez une place jeudi ? ». Ils ne disparaissent pas tous, mais vous arrêtez de rappeler six personnes le soir.' },
      en: { nom: 'The phone goes quiet', dit: 'The wireframe block is the calls you no longer take: "any chance of a slot on Thursday?". They do not all vanish, but you stop calling six people back in the evening.' },
    },
  ],
};

/* ── TPE 3 · IDENTITÉ DE MARQUE ────────────────────────────── */
const cadre = {
  sol: { W: 20, D: 14, pas: 2 },
  apparition: ['cadre', 'r1', 'r2', 'r3', 'r4', 'dehors'],
  blocs: [
    b('cadre', 1.4, 1.4, 17.2, 11.2, 8, 'creux', ['Le cadre', 'The frame']),
    b('marque', 7.2, 5.4, 5.6, 3.6, 4.4, 'plein', ['Ce que vous vendez, vraiment', 'What you actually sell']),
    b('r1', 3.2, 2.6, 2.6, 1.8, 1.6, 'neuf', ['À qui vous parlez', 'Who you speak to']),
    b('r2', 14.2, 2.6, 2.6, 1.8, 1.6, 'neuf', ['Ce que vous promettez', 'What you promise']),
    b('r3', 3.2, 9.6, 2.6, 1.8, 1.6, 'neuf', ['Vos mots', 'Your words']),
    b('r4', 14.2, 9.6, 2.6, 1.8, 1.6, 'neuf', ['Vos couleurs', 'Your colours']),
    b('dehors', 17.4, 0.2, 2, 1.6, 1.2, 'creux', ['Ce qu’on écarte', 'What we leave out']),
  ],
  liens: [],
  fr: {
    titre: 'On pose votre identité',
    intro: 'Au centre, ce que vous vendez vraiment, qui n’est souvent pas ce qui est écrit sur la devanture. Autour, le cadre : quatre règles qui tiennent, et tout ce qui n’y rentre pas reste dehors.',
    fin: 'Ce n’est pas un logo qu’on vend : c’est le cadre qui permet de décider vite, ensuite, sans nous.',
  },
  en: {
    titre: 'We set your identity',
    intro: 'In the middle, what you actually sell, which is often not what the shopfront says. Around it, the frame: four rules that hold, and anything that does not fit stays outside.',
    fin: 'We are not selling a logo: we are selling the frame that lets you decide quickly afterwards, without us.',
  },
  etapes: [
    {
      ids: ['marque'],
      fr: { nom: 'Ce que vous vendez vraiment', dit: 'Un plombier ne vend pas de la plomberie, il vend de ne plus y penser. On cherche cette phrase-là avec vous, en partant de ce que vos clients disent quand ils vous recommandent.' },
      en: { nom: 'What you actually sell', dit: 'A plumber does not sell plumbing, they sell never having to think about it again. We look for that sentence with you, starting from what your customers say when they recommend you.' },
    },
    {
      ids: ['marque', 'cadre'],
      mots: ['cadre'],
      fr: { nom: 'Le cadre', dit: 'Il ne se voit pas sur une carte de visite, et c’est pourtant lui qui fait tout le travail. Une fois posé, chaque choix devient rapide : cette photo, ce mot, ce prix, dedans ou dehors.' },
      en: { nom: 'The frame', dit: 'It never shows on a business card, yet it does all the work. Once it is set, every choice becomes quick: this photo, this word, this price, in or out.' },
    },
    {
      ids: ['marque', 'cadre', 'r1', 'r2', 'r3', 'r4'],
      mots: ['r1', 'r2', 'r3', 'r4'],
      fr: { nom: 'Les quatre règles', dit: 'À qui vous parlez, ce que vous promettez, les mots que vous employez, les couleurs et le logo qui vont avec. Dans cet ordre : le dessin vient en dernier, parce qu’il découle du reste.' },
      en: { nom: 'The four rules', dit: 'Who you speak to, what you promise, the words you use, the colours and logo that go with them. In that order: the drawing comes last, because it follows from the rest.' },
    },
    {
      ids: [],
      mots: ['dehors'],
      fr: { nom: 'Ce qu’on écarte', dit: 'Le bloc resté dehors compte autant que les autres. On écrit aussi ce que vous ne faites pas et à qui vous ne vous adressez pas : c’est ce qui vous évite de dire oui à la mauvaise affaire.' },
      en: { nom: 'What we leave out', dit: 'The block left outside matters as much as the rest. We also write down what you do not do and who you do not serve: that is what stops you saying yes to the wrong job.' },
    },
  ],
};

/* ── TPE 4 · AIDE AU LANCEMENT ─────────────────────────────── */
const rampe = {
  sol: { W: 20, D: 13, pas: 2 },
  apparition: ['m2', 'm3', 'm4', 'banque', 'reste'],
  blocs: [
    b('m1', 1.4, 4.6, 3.2, 3.6, 2.0, 'plein', ['Le modèle', 'The model']),
    b('m2', 5.4, 4.6, 3.2, 3.6, 3.8, 'plein', ['Les chiffres', 'The numbers']),
    b('m3', 9.4, 4.6, 3.2, 3.6, 5.6, 'plein', ['Le dossier', 'The file']),
    b('m4', 13.4, 4.6, 3.2, 3.6, 7.4, 'neuf', ['L’ouverture', 'Opening day']),
    b('banque', 17.4, 9.6, 2, 2, 2.4, 'creux', ['La banque', 'The bank']),
    b('reste', 17.4, 1.4, 2, 2, 1.2, 'creux', ['Ce qui attend', 'What waits']),
  ],
  liens: [],
  fr: {
    titre: 'On prépare votre lancement',
    intro: 'Quatre marches, dans cet ordre. On ne rédige pas votre business plan à votre place : on vous aide à le nourrir, avec des chiffres que vous pouvez défendre en face d’un banquier.',
    fin: 'Vous restez propriétaire de tout, et vous pouvez vous arrêter à la fin de chaque marche.',
  },
  en: {
    titre: 'We get your launch ready',
    intro: 'Four steps, in that order. We do not write your business plan for you: we help you feed it, with numbers you can defend in front of a banker.',
    fin: 'You own everything, and you can stop at the end of any step.',
  },
  etapes: [
    {
      ids: ['m1'],
      fr: { nom: 'On part du modèle', dit: 'Qui paie, combien, à quelle fréquence. Une demi-journée à poser ça noir sur blanc évite six mois à construire ce que personne n’achète.' },
      en: { nom: 'We start from the model', dit: 'Who pays, how much, how often. Half a day writing that down saves six months building something nobody buys.' },
    },
    {
      ids: ['m1', 'm2'],
      mots: ['m2'],
      fr: { nom: 'On chiffre', dit: 'Le coût d’un client, le prix de revient, le point où vous êtes à l’équilibre. Ce sont les seuls chiffres qu’un banquier regarde vraiment, et ce sont ceux qu’on prépare avec vous.' },
      en: { nom: 'We put numbers on it', dit: 'The cost of acquiring a customer, your unit cost, the point where you break even. Those are the only numbers a banker really looks at, and those are the ones we prepare with you.' },
    },
    {
      ids: ['m1', 'm2', 'm3', 'banque'],
      mots: ['m3', 'banque'],
      fr: { nom: 'Le dossier qu’on présente', dit: 'Le plan, les chiffres, les preuves. On ne signe rien à votre place et on n’est pas votre comptable : on met en forme ce que vous allez défendre, et on répète l’entretien si vous voulez.' },
      en: { nom: 'The file you present', dit: 'The plan, the numbers, the evidence. We do not sign anything for you and we are not your accountant: we shape what you are going to defend, and we rehearse the meeting if you want.' },
    },
    {
      ids: [],
      mots: ['m4', 'reste'],
      fr: { nom: 'L’ouverture', dit: 'Le strict nécessaire pour ouvrir : le site, la prise de rendez-vous, la facturation. Le bloc resté en fil de fer, c’est tout le reste : il attend que ça tourne, et souvent il n’est jamais nécessaire.' },
      en: { nom: 'Opening day', dit: 'The bare minimum to open: the site, the bookings, the invoicing. The block left as a wireframe is everything else. It waits until things are running, and often it is never needed at all.' },
    },
  ],
};

export const SCENES = {
  inventaire, liaison, chantier, estrade, vitrine, creneaux, cadre, rampe,
};

/* Quelle scène va avec quelle offre. Les quatre premiers identifiants sont
   ceux de la version PME, les quatre suivants ceux de la version TPE. */
export const FIGURE_OFFRE = {
  audit: 'inventaire',
  'audit-plus': 'liaison',
  developpement: 'chantier',
  suivi: 'estrade',
  site: 'vitrine',
  reservation: 'creneaux',
  marque: 'cadre',
  lancement: 'rampe',
};

/* Les libellés de l'explorateur lui-même. */
export const EXPL_MOTS = {
  fr: {
    ouvrir: 'Ouvrir en 3D',
    fermer: 'Fermer',
    tourner: 'Faites glisser pour tourner, molette pour approcher',
    etape: 'Étape suivante',
    precedent: 'Étape précédente',
    atelier: 'Poser votre propre schéma',
  },
  en: {
    ouvrir: 'Open in 3D',
    fermer: 'Close',
    tourner: 'Drag to turn, scroll to zoom',
    etape: 'Next step',
    precedent: 'Previous step',
    atelier: 'Lay out your own map',
  },
};
