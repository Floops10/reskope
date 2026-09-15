/* ============================================================
   CE QUI CHANGE ENTRE UNE TPE ET UNE PME.

   Uniquement les écarts : tout ce qui n'est pas ici reste le contenu du
   site, identique pour les deux. Une TPE de trois personnes n'a pas de
   système d'information à cartographier, elle a un site à refaire et des
   devis qu'elle recopie à la main. Le fond du métier ne change pas, la
   porte d'entrée si.

   Chaque page qui varie garde un chemin vers l'autre version : le profil
   décide de ce qu'on montre en premier, jamais de ce qu'on cache.
   ============================================================ */

export const HOME_TPE = {
  fr: {
    metaTitle: 'Sites, boutiques et identité de marque pour TPE',
    metaDesc:
      'On construit ce qui vous manque : site vitrine, boutique en ligne, prise de rendez-vous, identité de marque. Facturé à la journée, code et accès à votre nom.',

    heroTitle: 'On construit ce qui vous manque.',
    heroDit: 'Votre site, votre boutique, votre prise de rendez-vous et l’identité qui va avec. Et vous repartez avec les clés.',
    line1: 'Pas de site, ou un site qui date. Des rendez-vous pris au téléphone. Une image qui ne vous ressemble plus. Rien de tout ça n’est un problème d’outils : c’est ce qui n’existe pas encore.',
    line2: 'Reskope conçoit et développe votre site, votre boutique, votre prise de rendez-vous, et pose l’identité qui va avec. Facturé à la journée, par petites étapes, et vous repartez avec les clés.',
    mark1: 'n’existe pas encore',
    mark2: 'les clés',
    closing: 'Ce qui vous manque. Construit.',
    offerings: [
      { title: 'Site et boutique', sub: 'Un site qui tient debout, une boutique qui encaisse, des pages qui servent.' },
      { title: 'Prise de rendez-vous', sub: 'Créneaux en ligne, confirmation, rappel la veille. Vous ne rappelez plus personne.' },
      { title: 'Identité de marque', sub: 'Le positionnement d’abord, les couleurs ensuite. Des règles, pas une image.' },
      { title: 'Aide au lancement', sub: 'Le modèle, les chiffres, les fournisseurs. Avant d’ouvrir, et avant d’emprunter.' },
    ],
    primary: 'Démarrer un projet',
    ghost: 'Ce qu’on construit',
    ghostTo: '/offres',
    sting: 'Un seul interlocuteur. Les clés à la fin.',

    longPhrase:
      'Reskope, c’est un partenaire technique qui construit ce qui vous manque, le met en ligne, vous montre comment il marche, et vous laisse le code. Vous n’avez besoin de personne pour continuer.',

    svTitle: 'Ce qu’on construit, concrètement.',
    services: [
      'Site vitrine',
      'Boutique en ligne',
      'Prise de rendez-vous',
      'Identité de marque',
      'Fichier clients',
      'Programme de fidélité',
      'Modèle économique & chiffres',
      'Reprise d’un site existant',
    ],

    whyTitle: 'Pas une agence qui livre une maquette.',
    whyLead:
      'Quelqu’un qui construit vraiment l’outil, le met en ligne, vous montre comment il marche, et vous laisse le code. Sur le terrain, pas depuis un open space.',

    pillarsTitle: 'Trois étapes, zéro surprise.',
    pillars: [
      { id: 'audit', title: 'Cadrage', text: 'Une demi-journée pour comprendre ce que vous vendez et à qui. On écrit ce qu’on fait, en combien de jours et pour quel prix. Vous décidez après.' },
      { id: 'conception', title: 'Construction', text: 'On avance par petites étapes, facturées à la journée. Vous voyez chaque brique fonctionner avant qu’on passe à la suivante, et vous pouvez vous arrêter à la fin de chacune.' },
      { id: 'deploiement', title: 'Les clés', text: 'On met en ligne, on vous montre comment ça marche, et on vous remet le code, les fichiers sources et les accès à votre nom. Ensuite, vous êtes libre.' },
    ],

    statsEyebrow: 'Nos engagements',
    statsTitle: 'Ce qu’on s’engage à tenir.',
    stats: [
      { label: 'jours pour un site vitrine sobre, mis en ligne et vérifié', display: '5', value: 5, prefix: '', suffix: '', decimals: 0 },
      { label: 'du code et des fichiers sources remis, à votre nom', display: '100 %', value: 100, prefix: '', suffix: ' %', decimals: 0 },
      { label: 'de la démarche au grand jour : étapes, prix, accès', display: '100 %', value: 100, prefix: '', suffix: ' %', decimals: 0 },
      { label: 'donnée gardée de notre côté une fois la mission finie', display: '0', value: null },
    ],

    ctaSub: 'Un premier échange de 30 minutes, sans engagement. Vous nous dites ce que vous voulez construire, et on vous dit franchement en combien de temps et pour quel prix.',
    ctaBtn: 'Parlons de votre projet',
  },
  en: {
    metaTitle: 'Websites, shops and brand identity for small businesses',
    metaDesc:
      'We build what you are missing: website, online shop, booking, brand identity. Billed by the day, code and access in your name.',

    heroTitle: 'We build what you are missing.',
    heroDit: 'Your site, your shop, your booking, and the identity that goes with it. And you leave with the keys.',
    line1: 'No website, or one that has aged. Appointments taken by phone. An image that no longer looks like you. None of that is a tooling problem: it is what does not exist yet.',
    line2: 'Reskope designs and builds your website, your shop, your booking system, and sets the identity that goes with it. Billed by the day, in small steps, and you leave with the keys.',
    mark1: 'does not exist yet',
    mark2: 'the keys',
    closing: 'What you are missing. Built.',
    offerings: [
      { title: 'Website and shop', sub: 'A site that stands up, a shop that takes payment, pages that earn their place.' },
      { title: 'Online booking', sub: 'Slots, confirmation, reminder the day before. You stop calling people back.' },
      { title: 'Brand identity', sub: 'Positioning first, colours second. Rules, not an image.' },
      { title: 'Launch support', sub: 'The model, the figures, the suppliers. Before you open, and before you borrow.' },
    ],
    primary: 'Start a project',
    ghost: 'What we build',
    ghostTo: '/offres',
    sting: 'One contact. The keys at the end.',

    longPhrase:
      'Reskope is a technical partner who builds what you are missing, puts it live, shows you how it works, and leaves you the code. You need nobody to carry on.',

    svTitle: 'What we build, concretely.',
    services: [
      'Website',
      'Online shop',
      'Online booking',
      'Brand identity',
      'Client records',
      'Loyalty programme',
      'Business model & figures',
      'Rework of an existing site',
    ],

    whyTitle: 'Not an agency that delivers a mockup.',
    whyLead:
      'Someone who actually builds the tool, puts it online, shows you how it works, and leaves you the code. On site, not from an open space.',

    pillarsTitle: 'Three steps, no surprises.',
    pillars: [
      { id: 'audit', title: 'Framing', text: 'Half a day to understand what you sell and to whom. We write what we will do, in how many days and for what price. You decide afterwards.' },
      { id: 'conception', title: 'Build', text: 'We move in small steps, billed by the day. You see each brick work before we move to the next, and you can stop at the end of any of them.' },
      { id: 'deploiement', title: 'The keys', text: 'We put it live, show you how it works, and hand over the code, the source files and the access in your name. Then you are free.' },
    ],

    statsEyebrow: 'Our commitments',
    statsTitle: 'What we commit to.',
    stats: [
      { label: 'days for a plain website, live and checked', display: '5', value: 5, prefix: '', suffix: '', decimals: 0 },
      { label: 'of the code and source files handed over, in your name', display: '100%', value: 100, prefix: '', suffix: '%', decimals: 0 },
      { label: 'of the process in the open: steps, price, access', display: '100%', value: 100, prefix: '', suffix: '%', decimals: 0 },
      { label: 'data kept on our side once the engagement ends', display: '0', value: null },
    ],

    ctaSub: 'A first 30-minute conversation, no commitment. You tell us what you want to build, and we tell you frankly how long it takes and what it costs.',
    ctaBtn: 'Talk about your project',
  },
};

/* Les deux chiffres qui posent le sujet chez une TPE. Ils ne parlent pas
   de désordre — il n'y a rien à ranger chez quelqu'un qui n'a pas encore
   d'outils — mais du fait que presque tout le monde sait que c'est
   indispensable, et qu'un tiers ne l'a toujours pas fait. */
export const PREUVES_TPE = {
  fr: {
    intro: 'Deux chiffres qui ne viennent pas de nous.',
    items: [
      { n: 95, unite: ' %', t: 'des TPE et PME jugent leur présence sur internet indispensable ou utile à leur activité.', src: 'Afnic · Réussir avec le web', url: 'https://www.afnic.fr/observatoire-ressources/actualites/etude-afnic-la-presence-en-ligne-des-tpe-et-pme-francaises-progresse-leurs-pratiques-de-securite-aussi/' },
      { n: 33, unite: ' %', t: 'n’ont pourtant toujours pas de site internet. Ce n’est pas la conviction qui manque : c’est le temps.', src: 'Afnic · Réussir avec le web', url: 'https://www.afnic.fr/observatoire-ressources/actualites/etude-afnic-la-presence-en-ligne-des-tpe-et-pme-francaises-progresse-leurs-pratiques-de-securite-aussi/' },
    ],
  },
  en: {
    intro: 'Two figures that are not ours.',
    items: [
      { n: 95, unite: '%', t: 'of French small businesses consider their online presence essential or useful to their activity.', src: 'Afnic · Réussir avec le web', url: 'https://www.afnic.fr/observatoire-ressources/actualites/etude-afnic-la-presence-en-ligne-des-tpe-et-pme-francaises-progresse-leurs-pratiques-de-securite-aussi/' },
      { n: 33, unite: '%', t: 'still have no website at all. Conviction is not what is missing: time is.', src: 'Afnic · Réussir avec le web', url: 'https://www.afnic.fr/observatoire-ressources/actualites/etude-afnic-la-presence-en-ligne-des-tpe-et-pme-francaises-progresse-leurs-pratiques-de-securite-aussi/' },
    ],
  },
};

/* Les quatre choses qu'on peut acheter quand on est une TPE. Elles sont
   les mêmes partout : sur l'accueil, dans la traversée, dans le résumé
   de fin et sur la page des offres. Avant, l'accueil annonçait « aide au
   lancement » pendant que la page des offres vendait « liaisons entre
   outils » : deux listes différentes pour la même entreprise, et un
   visiteur qui se demande laquelle est la vraie.

   La reprise d'un outil existant et les liaisons entre logiciels ne sont
   pas une cinquième offre : elles font partie du chantier « site », parce
   que c'est là qu'elles se posent. */
export const OFFERS_TPE = {
  fr: [
    {
      id: 'site', name: 'Site et boutique', tagline: 'Une vitrine qui tient debout.',
      features: [
        'Site vitrine ou boutique en ligne',
        'Formulaire de contact et prise de rendez-vous',
        'Paiement, livraison, stock si vous vendez',
        'Liaisons avec vos outils : devis vers facture, export comptable',
        'Le code, les fichiers sources et les accès à votre nom',
      ],
      cta: 'En discuter', featured: true, detailTitle: 'Ce que ça donne concrètement',
      detail: 'On part de ce que vous vendez et de qui vous achète. Une vitrine sobre sort en cinq à huit jours de travail, une boutique un peu plus. Si vous avez déjà des outils, on les relie plutôt que de les remplacer : le devis part en facture, la facture part chez le comptable, et vous arrêtez de retaper les mêmes lignes. À la fin, vous repartez avec tout.',
      pricingFactors: ['Nombre de pages et de gabarits', 'Vente en ligne ou simple vitrine', 'Outils existants à relier ou à reprendre'],
    },
    {
      id: 'reservation', name: 'Prise de rendez-vous', tagline: 'Vous ne rappelez plus personne.',
      features: [
        'Créneaux en ligne, confirmation automatique',
        'Rappel la veille, relance des clients endormis',
        'Lien avec votre agenda existant',
        'Fichier clients avec historique',
        'Carte de fidélité dématérialisée si vous en voulez une',
      ],
      cta: 'En discuter', featured: false, detailTitle: 'Ce que ça donne concrètement',
      detail: 'Le client réserve depuis votre site, il reçoit sa confirmation, il est rappelé la veille, et votre agenda est à jour sans que personne y touche. Les deux heures par semaine que vous passiez au téléphone n’existent plus.',
      pricingFactors: ['Nombre de prestations et de ressources à gérer', 'Agenda et outils déjà en place', 'Paiement de l’acompte en ligne ou non'],
    },
    {
      id: 'marque', name: 'Identité de marque', tagline: 'Le positionnement d’abord.',
      features: [
        'Ce que vous voulez que vos clients ressentent',
        'À qui vous parlez, tranché avec des chiffres',
        'Nom, ton, couleurs, matières, règles d’usage',
        'La liste de ce qu’il faut produire, chiffrée',
        'Un document de règles, pas une image à interpréter',
      ],
      cta: 'En discuter', featured: false, detailTitle: 'Ce que ça donne concrètement',
      detail: 'Trois à cinq jours étalés sur deux ou trois semaines. On commence par vous et par vos clients, jamais par les couleurs. Vous repartez avec des règles écrites, utilisables par n’importe quel imprimeur ou graphiste sans nous.',
      pricingFactors: ['Création complète ou reprise d’une identité existante', 'Nombre de supports à couvrir', 'Production des visuels incluse ou non'],
    },
    {
      id: 'lancement', name: 'Aide au lancement', tagline: 'Avant d’ouvrir, et avant d’emprunter.',
      features: [
        'Le besoin réel, creusé en deux ou trois rendez-vous',
        'Le modèle économique, éprouvé avant de s’engager',
        'Le coût de revient et le seuil à partir duquel vous vous payez',
        'Les chiffres et les hypothèses qui nourriront votre dossier',
        'La recherche de fournisseurs et de prestataires, en option',
      ],
      cta: 'En discuter', featured: false, detailTitle: 'Ce que ça donne concrètement',
      detail: 'On ne rédige pas votre business plan à votre place : on rassemble avec vous tout ce qui va le nourrir, et on vérifie que ce que vous voulez faire et ce que vous ferez réellement restent la même chose. Vous repartez avec un prévisionnel en tableur, formules ouvertes.',
      pricingFactors: ['État du dossier au départ', 'Nombre de produits ou de prestations à chiffrer', 'Recherche de fournisseurs incluse ou non'],
    },
  ],
  en: [
    { id: 'site', name: 'Website and shop', tagline: 'A storefront that stands up.',
      features: ['Website or online shop', 'Contact form and online booking', 'Payment, delivery, stock if you sell',
                 'Links to your tools: quote to invoice, accounting export', 'Code, source files and access in your name'],
      cta: 'Discuss it', featured: true, detailTitle: 'What it looks like in practice',
      detail: 'We start from what you sell and who buys from you. A plain site takes five to eight working days, a shop a little longer. If you already have tools, we connect them rather than replace them. At the end you leave with everything.',
      pricingFactors: ['Number of pages and templates', 'Online sales or plain storefront', 'Existing tools to connect or rework'] },
    { id: 'reservation', name: 'Online booking', tagline: 'You stop calling people back.',
      features: ['Online slots, automatic confirmation', 'Reminder the day before, win-back for dormant clients',
                 'Linked to your existing calendar', 'Client records with history', 'Digital loyalty card if you want one'],
      cta: 'Discuss it', featured: false, detailTitle: 'What it looks like in practice',
      detail: 'The client books from your site, gets a confirmation, is reminded the day before, and your calendar stays up to date without anyone touching it. The two hours a week you spent on the phone no longer exist.',
      pricingFactors: ['Number of services and resources', 'Calendar and tools already in place', 'Online deposit or not'] },
    { id: 'marque', name: 'Brand identity', tagline: 'Positioning first.',
      features: ['What you want your customers to feel', 'Who you speak to, decided with figures',
                 'Name, tone, colours, materials, usage rules', 'The list of what to produce, priced', 'A rulebook, not an image to interpret'],
      cta: 'Discuss it', featured: false, detailTitle: 'What it looks like in practice',
      detail: 'Three to five days spread over two or three weeks. We start from you and your customers, never from the colours. You leave with written rules any printer or designer can use without us.',
      pricingFactors: ['Full creation or rework of an existing identity', 'Number of media to cover', 'Visual production included or not'] },
    { id: 'lancement', name: 'Launch support', tagline: 'Before you open, and before you borrow.',
      features: ['The real need, dug out over two or three meetings', 'The business model, tested before you commit',
                 'Unit cost and the point from which you pay yourself', 'The figures and assumptions that will feed your file',
                 'Supplier and provider sourcing, as an option'],
      cta: 'Discuss it', featured: false, detailTitle: 'What it looks like in practice',
      detail: 'We do not write your business plan for you: we gather everything that will feed it, and we check that what you want to do and what you will actually do remain the same thing. You leave with a forecast spreadsheet, formulas open.',
      pricingFactors: ['State of the file at the start', 'Number of products or services to price', 'Supplier sourcing included or not'] },
  ],
};

export const PRICES_TPE = {
  fr: {
    site: { amount: 'dès 1 900 €', note: 'Vitrine dès 1 900 € · boutique dès 3 200 € · liaisons avec vos outils à 450 €/jour', type: 'Forfait' },
    reservation: { amount: 'dès 1 400 €', note: 'Créneaux, confirmation et rappels · lien avec votre agenda existant compris', type: 'Forfait' },
    marque: { amount: 'dès 1 600 €', note: '3 à 5 jours étalés sur deux à trois semaines · document de règles compris', type: 'Forfait' },
    lancement: { amount: 'dès 1 200 €', note: '2 à 4 jours selon l’état du dossier · recherche de fournisseurs chiffrée à part', type: 'Forfait' },
  },
  en: {
    site: { amount: 'from €1,900', note: 'Storefront from €1,900 · shop from €3,200 · integrations at €450/day', type: 'Fixed price' },
    reservation: { amount: 'from €1,400', note: 'Slots, confirmation and reminders · link to your existing calendar included', type: 'Fixed price' },
    marque: { amount: 'from €1,600', note: '3 to 5 days over two or three weeks · rulebook included', type: 'Fixed price' },
    lancement: { amount: 'from €1,200', note: '2 to 4 days depending on the file · supplier sourcing priced separately', type: 'Fixed price' },
  },
};

export const OFFRES_TPE = {
  fr: {
    metaTitle: 'Offres & tarifs TPE · site, réservation, marque, lancement',
    metaDesc:
      'Quatre chantiers courts, prix affichés : site et boutique dès 1 900 €, prise de rendez-vous dès 1 400 €, identité de marque dès 1 600 €, aide au lancement dès 1 200 €. Ce qui est fixe, ce qui varie.',
    title: 'Quatre chantiers, quatre façons de gagner du temps.',
    directP: 'Si votre besoin est clair et que vous voulez passer directement à la réalisation, écrivez-nous. On gagne du temps tous les deux.',
    lead: 'Chaque chantier est différent, mais les tarifs sont clairs dès le départ. On définit ensemble le périmètre, vous savez ce que vous payez et pourquoi, et vous pouvez vous arrêter à la fin de chaque étape.',
    billing: {
      kicker: 'Transparence',
      title: 'Comment on facture.',
      text: 'Un jour d’intervention = 450 €. Les chantiers courts sont au forfait, annoncé avant de démarrer ; le reste est au temps passé, estimé et validé avec vous. On avance par petites étapes que vous validez une par une, et vous pouvez vous arrêter à la fin de chacune. Aucune surprise sur la facture.',
      note: 'Devis gratuit, valable 30 jours. Tarifs nets, TVA non applicable, article 293 B du CGI. Le code, les fichiers sources et les accès vous sont remis à la fin, quelle que soit la suite.',
    },
  },
  en: {
    metaTitle: 'Offers & pricing for small businesses · site, booking, brand, launch',
    metaDesc:
      'Four short projects, prices shown: website and shop from €1,900, booking from €1,400, brand identity from €1,600, launch support from €1,200. What is fixed, what varies.',
    title: 'Four projects, four ways to win time back.',
    directP: 'If your need is clear and you want to go straight to delivery, write to us. It saves everyone time.',
    lead: 'Every project is different, but pricing is clear from the start. We define the scope together, you know what you pay and why, and you can stop at the end of any stage.',
    billing: {
      kicker: 'Transparency',
      title: 'How we bill.',
      text: 'One day on the job = €450. Short projects are fixed-price, announced before we start; the rest is time spent, estimated and approved with you. We move in small steps you approve one by one, and you can stop at the end of any of them. No surprises on the invoice.',
      note: 'Free quote, valid 30 days. Net prices, VAT not applicable, article 293 B of the French tax code. Code, source files and access are handed over at the end, whatever happens next.',
    },
  },
};

/* Les pages qui ne concernent qu'un profil.

   Deux pages ne concernent que les PME. L'exemple de bilan est le compte
   rendu d'un audit mené poste par poste. Et « le constat » démontre le
   coût du désordre numérique : chez quelqu'un qui n'a pas encore de
   site, il n'y a pas de désordre, il y a une absence. Les deux sortent
   donc du menu en version TPE, et la version TPE pose son propre sujet
   sur l'accueil, avec ses propres chiffres.

   On ne la SUPPRIME pas pour autant : l'URL reste valide, elle garde sa
   valeur pour les moteurs, et quiconque y arrive par un lien externe la
   lit normalement — avec un bandeau qui dit franchement à qui elle
   s'adresse et propose la bascule. Rediriger de force serait hostile. */

export const PAGES_PROFIL = { '/exemple': 'pme', '/pourquoi': 'pme' };

export const RESERVE = {
  fr: {
    pme: {
      txt: 'Cette page s’adresse aux PME de dix personnes et plus : elle part d’un parc d’outils déjà en place. Vous consultez le site en version TPE.',
      act: 'Passer en version PME',
      autre: 'Voir les offres TPE',
      autreTo: '/offres',
    },
    tpe: {
      txt: 'Cette page s’adresse aux entreprises de moins de dix personnes. Vous consultez le site en version PME.',
      act: 'Passer en version TPE',
      autre: 'Voir les offres PME',
      autreTo: '/offres',
    },
  },
  en: {
    pme: {
      txt: 'This page is aimed at SMEs of ten people and above: it starts from a set of tools already in place. You are browsing the small-business version of the site.',
      act: 'Switch to the SME version',
      autre: 'See small-business offers',
      autreTo: '/offres',
    },
    tpe: {
      txt: 'This page is aimed at businesses under ten people. You are browsing the SME version of the site.',
      act: 'Switch to the small-business version',
      autre: 'See SME offers',
      autreTo: '/offres',
    },
  },
};





/* ============================================================
   LA MÉTHODE, VERSION TPE.

   Les cinq jalons du site partent d'un audit mené salarié par salarié.
   Chez une entreprise de cinq personnes il n'y a personne à interroger
   pendant trois jours : le parcours commence par un cadrage court et
   enchaîne sur la construction. Même transparence, autre rythme.
   ============================================================ */
export const JALONS_TPE = {
  fr: [
    { n: '01', label: 'Cadrage', title: 'On comprend votre métier.',
      text: `Une demi-journée chez vous ou en visio : ce que vous vendez, comment vous travaillez, et ce qui vous prend du temps tous les jours.`,
      deliver: 'Le périmètre écrit, et le prix.', here: true },
    { n: '02', label: 'Devis', title: 'On chiffre avant de commencer.',
      text: `Ce qu'on fait, poste par poste : ce qui est au forfait, ce qui est à la journée, et le total. Vous décidez ensuite, sans engagement.`,
      deliver: 'Un devis détaillé, valable 30 jours.', here: false },
    { n: '03', label: 'Construction', title: 'On avance par petites étapes.',
      text: `Vous voyez chaque brique fonctionner avant qu'on passe à la suivante. Rien n'est caché jusqu'à la livraison, et vous pouvez vous arrêter à la fin de chacune.`,
      deliver: 'Des morceaux qui marchent, un par un.', here: false },
    { n: '04', label: 'Mise en ligne', title: 'On installe et on vérifie.',
      text: `Le site, l'outil ou la liaison passent en production. On teste avec vous, sur vos vrais dossiers, pas sur un jeu d'essai.`,
      deliver: 'Ce qui est prévu, en ligne et vérifié.', here: false },
    { n: '05', label: 'Les clés', title: 'Vous repartez avec tout.',
      text: `Le code, les fichiers sources, l'hébergement et les accès à votre nom. Une demi-journée de prise en main, et vous êtes libre de continuer seul.`,
      deliver: 'Les clés, et personne à qui demander la permission.', here: false },
  ],
  en: [
    { n: '01', label: 'Framing', title: 'We understand your trade.',
      text: `Half a day at your place or by video: what you sell, how you work, and what eats your time every day.`,
      deliver: 'The scope, written down, and the price.', here: true },
    { n: '02', label: 'Quote', title: 'We price before we start.',
      text: `What we will do, item by item: what is fixed-price, what is by the day, and the total. You decide afterwards, no commitment.`,
      deliver: 'A detailed quote, valid 30 days.', here: false },
    { n: '03', label: 'Build', title: 'We move in small steps.',
      text: `You see each brick work before we move to the next. Nothing is hidden until delivery, and you can stop at the end of any of them.`,
      deliver: 'Working pieces, one at a time.', here: false },
    { n: '04', label: 'Go live', title: 'We install and check.',
      text: `The site, the tool or the integration goes into production. We test with you, on your real files, not on a demo set.`,
      deliver: 'What was planned, live and verified.', here: false },
    { n: '05', label: 'The keys', title: 'You leave with everything.',
      text: `Code, source files, hosting and access in your name. Half a day of handover, and you are free to carry on alone.`,
      deliver: 'The keys, and nobody to ask permission from.', here: false },
  ],
};

export const METHODE_TPE = {
  fr: {
    metaTitle: 'La méthode · du cadrage aux clés, étape par étape',
    metaDesc:
      'Cadrage, devis, construction par petites étapes, mise en ligne, remise des clés. Rien n’est engagé avant d’être chiffré, et vous pouvez vous arrêter à la fin de chaque étape.',
    film: {
      introTitle: 'On construit, vous gardez la main.',
      introText: 'Ce qui vous manque aujourd’hui. Un parcours court pour le construire, et vous le remettre entre les mains.',
      synthCap: 'Cinq étapes. Et les clés à la fin.',
    },
    calloutTitle: 'Le livrable : un outil qui tourne, et le code avec.',
    calloutText:
      'À la fin, vous repartez avec ce qui a été construit, les fichiers sources, l’hébergement et les accès à votre nom. Vous faites vos modifications vous-même, ou vous nous les confiez : dans les deux cas, rien ne vous retient.',
    calloutBtn: 'Voir ce qu’on construit',
    calloutTo: '/offres',
  },
  en: {
    metaTitle: 'The method · from framing to the keys, step by step',
    metaDesc:
      'Framing, quote, build in small steps, go live, handover. Nothing is committed before it is priced, and you can stop at the end of any step.',
    film: {
      introTitle: 'We build, you keep control.',
      introText: 'What you are missing today. A short journey to build it, and hand it over to you.',
      synthCap: 'Five steps. And the keys at the end.',
    },
    calloutTitle: 'The deliverable: a tool that runs, and the code with it.',
    calloutText:
      'At the end you leave with what was built, the source files, the hosting and the access in your name. You make your own changes, or you entrust them to us: either way, nothing holds you back.',
    calloutBtn: 'See what we build',
    calloutTo: '/offres',
  },
};


/* À propos : les paliers de taille. En version TPE, parler de « 80 à 200
   personnes » ne sert à rien ; on redescend l'échelle là où le lecteur
   se trouve vraiment. Le reste de la page (les deux portraits, la bio,
   les engagements) vaut pour tout le monde. */
export const APROPOS_TPE = {
  fr: {
    sizeTitle: 'Ce qui est efficace dépend de votre taille.',
    sizeLead: 'Il n’y a pas d’outil universel. Ce qui marche à deux ne marche pas à dix. Voici notre lecture, par palier.',
    tiers: [
      { range: '1 à 3 pers.', label: 'Vous, et peut-être une main', principle: 'Un seul endroit, et zéro double saisie.', detail: 'À ce stade, chaque outil en plus est une charge. L’objectif : un endroit pour les clients, un pour les devis et factures, et une liaison entre les deux pour ne jamais retaper la même ligne.', wins: ['Site vitrine', 'Devis vers facture', 'Agenda relié'] },
      { range: '3 à 6 pers.', label: 'Petite équipe', principle: 'Automatiser ce qui revient toutes les semaines.', detail: 'Les rendez-vous, les rappels, les relances : tout ce qui se répète peut se faire sans vous. C’est là qu’on récupère les premières heures, et ce sont souvent des soirées.', wins: ['Prise de réservation', 'Rappels automatiques', 'Fichier clients'] },
      { range: '6 à 10 pers.', label: 'Structure qui s’installe', principle: 'Relier avant d’acheter du neuf.', detail: 'Vos habitudes sont prises et elles fonctionnent. Plutôt que d’imposer un nouvel outil, on relie ceux que vous avez déjà et on remplace seulement ce qui coince vraiment.', wins: ['Liaisons entre outils', 'Reprise d’un outil ancien', 'Identité de marque'] },
    ],
  },
  en: {
    sizeTitle: 'What works depends on your size.',
    sizeLead: 'There is no universal tool. What works at two does not work at ten. Here is our reading, by tier.',
    tiers: [
      { range: '1 to 3 people', label: 'You, and maybe one pair of hands', principle: 'One place, and zero double entry.', detail: 'At this stage every extra tool is a burden. The goal: one place for clients, one for quotes and invoices, and a link between the two so you never retype the same line.', wins: ['Website', 'Quote to invoice', 'Linked calendar'] },
      { range: '3 to 6 people', label: 'Small team', principle: 'Automate what comes back every week.', detail: 'Appointments, reminders, follow-ups: everything repetitive can run without you. That is where the first hours come back, and they are often evenings.', wins: ['Online booking', 'Automatic reminders', 'Client records'] },
      { range: '6 to 10 people', label: 'A business settling in', principle: 'Connect before buying new.', detail: 'Your habits are set and they work. Rather than imposing a new tool, we connect the ones you already have and replace only what really gets in the way.', wins: ['Tool integrations', 'Rework of an older tool', 'Brand identity'] },
    ],
  },
};

/* Contact : ce qu'on promet à l'écran n'est pas tout à fait la même chose
   selon la taille de celui qui écrit. */
export const CONTACT_TPE = {
  fr: {
    metaTitle: 'Contact · parlons de votre projet',
    title: 'Parlons de votre projet.',
    lead: 'Décrivez votre besoin en trois lignes. On vous répond sous 24 h, franchement : si ce n’est pas pour nous, on vous le dit.',
    quizLead: 'Le questionnaire cerne votre besoin et prépare votre demande : vous validez, on a tout.',
  },
  en: {
    metaTitle: 'Contact · let us talk about your project',
    title: 'Let us talk about your project.',
    lead: 'Describe your need in three lines. We reply within 24 h, frankly: if it is not for us, we say so.',
    quizLead: 'The questionnaire pins down your need and prepares your request: you confirm, we have everything.',
  },
};


/* La FAQ, version TPE. Celle du site répond sur l'audit, le bilan et les
   effectifs : trois sujets qui ne se posent pas à cinq personnes. Ici on
   répond aux vraies questions d'un patron de TPE — délai, propriété du
   code, et ce qui se passe s'il veut arrêter en cours de route. */
export const FAQ_TPE = {
  fr: [
    { q: 'Combien de temps pour avoir mon site en ligne ?',
      a: `Un site vitrine sobre sort en cinq à huit jours de travail, étalés sur deux à trois semaines pour laisser le temps des allers-retours. Une boutique demande davantage, autour de dix à quinze jours. Le nombre exact est écrit dans le devis avant qu'on commence.` },
    { q: 'Est-ce que le code m’appartient à la fin ?',
      a: `Oui, entièrement, et sans condition. Le code, les fichiers sources, l'hébergement et les noms de domaine sont mis à votre nom. Vous pouvez reprendre le travail avec n'importe qui, ou le continuer vous-même. Rien n'est verrouillé de notre côté.` },
    { q: 'Et si je veux arrêter en cours de route ?',
      a: `Vous pouvez vous arrêter à la fin de n'importe quelle étape. On avance par petites étapes que vous validez une par une, donc vous ne payez jamais pour quelque chose que vous n'avez pas vu fonctionner. Ce qui est fait vous reste, sources comprises.` },
    { q: 'Faut-il remplacer les outils qu’on utilise déjà ?',
      a: `Presque jamais. La plupart du temps il suffit de les faire parler entre eux : le devis part en facture, la facture part chez le comptable, et vous arrêtez de retaper les mêmes lignes. On ne remplace que ce qui coince vraiment, et on vous dit pourquoi.` },
    { q: 'Vous travaillez avec des entreprises d’une seule personne ?',
      a: `Oui. Un artisan seul, un commerce de deux personnes : c'est souvent là que quelques heures rendues chaque semaine changent le plus de choses. En revanche, on ne vous vendra pas un audit poste par poste : à cette taille, ça n'a pas de sens.` },
  ],
  en: [
    { q: 'How long before my site is live?',
      a: `A plain website takes five to eight working days, spread over two or three weeks to leave room for feedback. A shop takes longer, around ten to fifteen days. The exact number is written into the quote before we start.` },
    { q: 'Do I own the code at the end?',
      a: `Yes, entirely and unconditionally. Code, source files, hosting and domain names are put in your name. You can hand the work to anyone else, or carry on yourself. Nothing is locked on our side.` },
    { q: 'What if I want to stop halfway?',
      a: `You can stop at the end of any step. We move in small steps you approve one by one, so you never pay for something you have not seen working. What is done stays yours, sources included.` },
    { q: 'Do we have to replace the tools we already use?',
      a: `Almost never. Most of the time it is enough to make them talk to each other: the quote becomes an invoice, the invoice reaches your accountant, and you stop retyping the same lines. We only replace what really gets in the way, and we tell you why.` },
    { q: 'Do you work with one-person businesses?',
      a: `Yes. A sole trader, a two-person shop: that is often where a few hours given back each week change the most. What we will not sell you is a desk-by-desk audit: at that size it makes no sense.` },
  ],
};

/* Les pages d'état (404, message envoyé) renvoient vers l'exemple de
   bilan. En version TPE cette page est réservée à l'autre profil : on
   renvoie donc ailleurs plutôt que dans un cul-de-sac. */
export const ETATS_TPE = {
  fr: {
    meanwhile: 'En attendant, vous pouvez regarder ce qu’on construit et à quel prix : tout est affiché.',
    cta: 'Voir ce qu’on construit',
    to: '/offres',
    urgent: 'Besoin de nous joindre plus vite ?',
  },
  en: {
    meanwhile: 'In the meantime, you can look at what we build and what it costs: everything is on the page.',
    cta: 'See what we build',
    to: '/offres',
    urgent: 'Need to reach us faster?',
  },
};

/* Le pont entre les deux versions : personne ne doit se retrouver enfermé
   dans son profil. */
export const PASSERELLE = {
  fr: {
    tpe: { txt: 'Vous dirigez plutôt une PME de dix personnes ou plus ? Le sujet n’est plus de construire, mais de remettre de l’ordre.', act: 'Voir la version PME' },
    pme: { txt: 'Vous êtes plutôt une TPE de moins de dix personnes ? On construit plutôt qu’on n’audite.', act: 'Voir la version TPE' },
  },
  en: {
    tpe: { txt: 'Do you actually run an SME of ten people or more?', act: 'See the SME version' },
    pme: { txt: 'Are you rather a small business under ten people?', act: 'See the small-business version' },
  },
};

/* ════════════════════════════════════════════════════════════
   CE QU'ON FAIT — la réponse en quatre verbes, posée juste sous
   l'accroche de l'accueil.

   Écrit dans la langue du livret : des phrases courtes, « on », du
   concret, et rien qui essaie de vendre. Aucun prix : le visiteur doit
   comprendre ce qu'il achète avant de voir combien ça coûte, et la page
   des offres est là pour ça.
   ════════════════════════════════════════════════════════════ */
export const FAIT = {
  pme: {
    fr: {
      sur: 'Ce qu’on fait',
      titre: 'On remet vos outils en ordre, et on vous laisse les clés.',
      items: [
        { figure: 'inventaire', nom: 'On fait le tour de vos outils',
          quoi: 'Chaque personne, chaque abonnement, chaque donnée. Vous repartez avec le tableau complet, coût par coût.' },
        { figure: 'liaison', nom: 'On relie ce qui ne se parle pas',
          quoi: 'Le devis qui devient facture, l’export qui part au comptable. Fin des saisies en double.' },
        { figure: 'chantier', nom: 'On construit ce qui manque',
          quoi: 'Un outil interne, une automatisation, un site. Le code et les accès sont à vous.' },
        { figure: 'estrade', nom: 'On forme vos équipes',
          quoi: 'Un outil que personne n’ouvre ne sert à rien. On reste jusqu’à ce qu’il tourne sans nous.' },
      ],
      pied: 'Chaque chantier se prend séparément. Si celui où vous en êtes vous suffit, on ne vous vendra pas le suivant.',
      act: 'Le détail, et ce que ça coûte',
    },
    en: {
      sur: 'What we do',
      titre: 'We put your tools back in order, and hand you the keys.',
      items: [
        { figure: 'inventaire', nom: 'We go through every tool',
          quoi: 'Every person, every subscription, every piece of data. You leave with the full table, cost by cost.' },
        { figure: 'liaison', nom: 'We connect what does not talk',
          quoi: 'The quote that becomes an invoice, the export that reaches the accountant. No more double entry.' },
        { figure: 'chantier', nom: 'We build what is missing',
          quoi: 'An internal tool, an automation, a website. The code and the access are yours.' },
        { figure: 'estrade', nom: 'We train your teams',
          quoi: 'A tool nobody opens is worth nothing. We stay until it runs without us.' },
      ],
      pied: 'Each project stands on its own. If the stage you are at is enough, we will not sell you the next one.',
      act: 'The detail, and what it costs',
    },
  },
  tpe: {
    fr: {
      sur: 'Ce qu’on fait',
      titre: 'On construit ce qui vous manque, et on vous laisse les clés.',
      items: [
        { figure: 'vitrine', nom: 'On met votre entreprise en ligne',
          quoi: 'Un site, une boutique, un formulaire qui arrive vraiment. Vous repartez avec les clés.' },
        { figure: 'creneaux', nom: 'On prend vos rendez-vous à votre place',
          quoi: 'Créneaux en ligne, confirmation, rappel la veille. Vous ne rappelez plus personne.' },
        { figure: 'cadre', nom: 'On pose votre identité',
          quoi: 'Le nom, le ton, les couleurs, et les règles pour vous en servir sans nous.' },
        { figure: 'rampe', nom: 'On prépare votre lancement',
          quoi: 'Le modèle, le coût de revient, les fournisseurs. Avant d’ouvrir, et avant d’emprunter.' },
      ],
      pied: 'Chaque chantier se prend séparément. Et on vous dit franchement quand vous n’avez besoin de rien.',
      act: 'Le détail, et ce que ça coûte',
    },
    en: {
      sur: 'What we do',
      titre: 'We build what you are missing, and hand you the keys.',
      items: [
        { figure: 'vitrine', nom: 'We put your business online',
          quoi: 'A site, a shop, a form that actually reaches you. You leave with the keys.' },
        { figure: 'creneaux', nom: 'We take your bookings for you',
          quoi: 'Slots online, confirmation, reminder the day before. You stop calling people back.' },
        { figure: 'cadre', nom: 'We set your identity',
          quoi: 'The name, the tone, the colours, and the rules to use them without us.' },
        { figure: 'rampe', nom: 'We get your launch ready',
          quoi: 'The model, the true cost, the suppliers. Before you open, and before you borrow.' },
      ],
      pied: 'Each project stands on its own. And we tell you plainly when you need nothing at all.',
      act: 'The detail, and what it costs',
    },
  },
};
