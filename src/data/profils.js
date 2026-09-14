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
    metaTitle: 'Sites, outils et automatisations pour TPE · Reskope',
    metaDesc:
      'Reskope construit ce qui vous manque et répare ce qui coince : site vitrine, boutique, prise de réservation, liaisons entre vos outils. Facturé à la journée, code et accès à votre nom.',

    heroTitle: 'Vous passez vos soirées sur ce qui devrait tourner tout seul.',
    line1: 'Un site qui date, des devis recopiés à la main, un agenda qui ne parle à rien. Chaque heure passée là-dessus est une heure en moins sur votre métier.',
    line2: 'Reskope construit ce qui vous manque et répare ce qui coince : site vitrine, boutique, prise de réservation, liaisons entre vos outils. Facturé à la journée, et vous repartez avec les clés.',
    mark1: 'recopiés',
    mark2: 'construit',
    closing: 'Moins de saisie. Plus de métier.',
    offerings: [
      { title: 'Site et boutique', sub: 'Un site qui tient debout, une boutique qui encaisse, des pages qui servent.' },
      { title: 'Prise de réservation', sub: 'Créneaux, confirmation, rappel la veille. Vous ne rappelez plus personne.' },
      { title: 'Liaisons entre outils', sub: 'Devis vers facture, export comptable, alertes. Fini la double saisie.' },
      { title: 'Identité de marque', sub: 'Le positionnement d’abord, les couleurs ensuite. Des règles, pas une image.' },
    ],
    primary: 'Démarrer un projet',
    sting: 'Un seul interlocuteur. Les clés à la fin.',

    longPhrase:
      'Reskope, c’est un partenaire technique qui construit ce qui vous manque, répare ce qui coince, et vous laisse les clés. Moins de saisie, plus de temps pour votre vrai métier.',

    svTitle: 'Ce qu’on construit, concrètement.',
    services: [
      'Site vitrine',
      'Boutique en ligne',
      'Prise de réservation',
      'Fichier clients',
      'Programme de fidélité',
      'Liaisons entre outils',
      'Reprise d’un outil existant',
      'Identité de marque',
    ],

    whyTitle: 'Pas une agence qui livre une maquette.',
    whyLead:
      'Quelqu’un qui construit vraiment l’outil, le met en ligne, vous montre comment il marche, et vous laisse le code. Sur le terrain, pas depuis un open space.',

    pillarsTitle: 'Trois étapes, zéro surprise.',
    pillars: [
      {
        id: 'audit',
        title: 'Cadrage',
        text: 'Une demi-journée pour comprendre votre métier et ce qui vous prend du temps. On écrit ce qu’on fait, en combien de jours et pour quel prix. Vous décidez après.',
      },
      {
        id: 'conception',
        title: 'Construction',
        text: 'On avance par petites étapes, facturées à la journée. Vous voyez chaque brique fonctionner avant qu’on passe à la suivante, et vous pouvez vous arrêter à la fin de chacune.',
      },
      {
        id: 'deploiement',
        title: 'Prise en main',
        text: 'On met en ligne, on vous montre comment ça marche, et on vous remet le code, les fichiers sources et les accès à votre nom. Ensuite, vous êtes libre.',
      },
    ],

    exploreTitle: 'Explorez à votre rythme.',
    dest: [
      { to: '/pourquoi', label: 'Le constat', desc: 'Le temps perdu, et pour qui on agit' },
      { to: '/methode', label: 'La méthode', desc: '5 jalons, en toute transparence' },
      { to: '/offres', label: 'Offres', desc: 'Facturé à la journée, devis détaillé' },
      { to: '/numerique-responsable', label: 'Numérique responsable', desc: 'Moins d’outils, moins d’empreinte' },
    ],

    ctaSub: 'Un premier échange de 30 minutes, sans engagement. Vous nous dites ce qui vous prend du temps, et on vous dit franchement si on peut vous en faire gagner.',
    ctaBtn: 'Parlons de votre projet',
  },
  en: {
    metaTitle: 'Websites, tools and automation for small businesses · Reskope',
    metaDesc:
      'Reskope builds what you are missing and fixes what gets in the way: website, online shop, booking, links between your tools. Billed by the day, code and access in your name.',

    heroTitle: 'You spend your evenings on what should run by itself.',
    line1: 'A dated website, quotes retyped by hand, a calendar that talks to nothing. Every hour spent there is an hour away from your trade.',
    line2: 'Reskope builds what you are missing and fixes what gets in the way: website, shop, booking, links between your tools. Billed by the day, and you leave with the keys.',
    mark1: 'retyped',
    mark2: 'builds',
    closing: 'Less typing. More trade.',
    offerings: [
      { title: 'Website and shop', sub: 'A site that stands up, a shop that takes payment, pages that earn their place.' },
      { title: 'Online booking', sub: 'Slots, confirmation, reminder the day before. You stop calling people back.' },
      { title: 'Links between tools', sub: 'Quote to invoice, accounting export, alerts. No more double entry.' },
      { title: 'Brand identity', sub: 'Positioning first, colours second. Rules, not an image.' },
    ],
    primary: 'Start a project',
    sting: 'One contact. The keys at the end.',

    longPhrase:
      'Reskope is a technical partner who builds what you are missing, fixes what gets in the way, and hands you the keys. Less typing, more time for your real trade.',

    svTitle: 'What we build, concretely.',
    services: [
      'Website',
      'Online shop',
      'Online booking',
      'Client records',
      'Loyalty programme',
      'Links between tools',
      'Rework of an existing tool',
      'Brand identity',
    ],

    whyTitle: 'Not an agency that delivers a mockup.',
    whyLead:
      'Someone who actually builds the tool, puts it online, shows you how it works, and leaves you the code. On site, not from an open space.',

    pillarsTitle: 'Three steps, no surprises.',
    pillars: [
      { id: 'audit', title: 'Framing', text: 'Half a day to understand your trade and what eats your time. We write what we will do, in how many days and for what price. You decide afterwards.' },
      { id: 'conception', title: 'Build', text: 'We move in small steps, billed by the day. You see each brick work before we move to the next, and you can stop at the end of any of them.' },
      { id: 'deploiement', title: 'Handover', text: 'We put it live, show you how it works, and hand over the code, the source files and the access in your name. Then you are free.' },
    ],

    exploreTitle: 'Explore at your own pace.',
    dest: [
      { to: '/pourquoi', label: 'The findings', desc: 'Time lost, and who we act for' },
      { to: '/methode', label: 'The method', desc: '5 milestones, in full transparency' },
      { to: '/offres', label: 'Offers', desc: 'Billed by the day, detailed quote' },
      { to: '/numerique-responsable', label: 'Responsible digital', desc: 'Fewer tools, smaller footprint' },
    ],

    ctaSub: 'A first 30-minute conversation, no commitment. You tell us what eats your time, and we tell you frankly whether we can give some back.',
    ctaBtn: 'Talk about your project',
  },
};

/* Les offres d'une TPE : pas d'audit poste par poste, des chantiers
   courts facturés à la journée. Même forme que OFFERS dans site.js, pour
   que la page et la vitrine n'aient rien à savoir du profil. */
export const OFFERS_TPE = {
  fr: [
    {
      id: 'site',
      name: 'Site et boutique',
      tagline: 'Une vitrine qui tient debout.',
      features: [
        'Site vitrine ou boutique en ligne',
        'Formulaire de contact et prise de rendez-vous',
        'Paiement, livraison, stock si vous vendez',
        'Référencement de base et pages qui chargent vite',
        'Le code, les fichiers sources et les accès à votre nom',
      ],
      cta: 'En discuter',
      featured: true,
      detailTitle: 'Ce que ça donne concrètement',
      detail: 'On part de ce que vous vendez et de qui vous achète. Le site sort en quelques jours pour une vitrine sobre, un peu plus pour une boutique. On avance par petites étapes que vous validez une par une, et à la fin vous repartez avec tout : le code, les sources, l’hébergement à votre nom.',
      pricingFactors: [
        'Nombre de pages et de gabarits',
        'Vente en ligne ou simple vitrine',
        'Contenus et photos fournis ou à produire',
      ],
    },
    {
      id: 'reservation',
      name: 'Réservation et fidélité',
      tagline: 'Vous ne rappelez plus personne.',
      features: [
        'Créneaux en ligne, confirmation automatique',
        'Rappel la veille, relance des clients endormis',
        'Lien avec votre agenda existant',
        'Fichier clients avec historique et relances',
        'Carte de fidélité dématérialisée si vous en voulez une',
      ],
      cta: 'En discuter',
      featured: false,
      detailTitle: 'Ce que ça donne concrètement',
      detail: 'Le client réserve depuis votre site, il reçoit sa confirmation, il est rappelé la veille, et votre agenda est à jour sans que personne y touche. Ce qui vous prenait deux heures par semaine au téléphone n’existe plus.',
      pricingFactors: [
        'Nombre de prestations et de ressources à gérer',
        'Agenda et outils déjà en place',
        'Paiement de l’acompte en ligne ou non',
      ],
    },
    {
      id: 'liaisons',
      name: 'Liaisons et reprise d’outils',
      tagline: 'Fini la double saisie.',
      features: [
        'Devis vers facture, export vers le comptable, alertes',
        'Mise à jour et simplification d’un outil existant',
        'Suppression des ressaisies d’un outil à l’autre',
        'Travail par itérations courtes, facturé à la journée',
        'Formation de vos équipes à la fin',
      ],
      cta: 'En discuter',
      featured: false,
      detailTitle: 'Ce que ça donne concrètement',
      detail: 'On regarde ce que vous recopiez d’un endroit à l’autre, et on le relie. Pas besoin de tout remplacer : la plupart du temps, il suffit de faire parler entre eux les outils que vous avez déjà.',
      pricingFactors: [
        'Nombre d’outils à relier',
        'Existence ou non d’une interface de connexion',
        'Reprise légère ou refonte d’un outil ancien',
      ],
    },
    {
      id: 'marque',
      name: 'Identité de marque',
      tagline: 'Le positionnement d’abord.',
      features: [
        'Ce que vous voulez que vos clients ressentent',
        'À qui vous parlez, tranché avec des chiffres',
        'Nom, ton, couleurs, matières, règles d’usage',
        'La liste de ce qu’il faut produire, chiffrée',
        'Un document de règles, pas une image à interpréter',
      ],
      cta: 'En discuter',
      featured: false,
      detailTitle: 'Ce que ça donne concrètement',
      detail: 'Trois à cinq jours étalés sur deux ou trois semaines. On commence par vous et par vos clients, jamais par les couleurs. Vous repartez avec des règles écrites, utilisables par n’importe quel imprimeur ou graphiste sans nous.',
      pricingFactors: [
        'Création complète ou reprise d’une identité existante',
        'Nombre de supports à couvrir',
        'Production des visuels incluse ou non',
      ],
    },
  ],
  en: [
    {
      id: 'site',
      name: 'Website and shop',
      tagline: 'A storefront that stands up.',
      features: [
        'Website or online shop',
        'Contact form and online booking',
        'Payment, delivery, stock if you sell',
        'Basic SEO and pages that load fast',
        'Code, source files and access in your name',
      ],
      cta: 'Discuss it',
      featured: true,
      detailTitle: 'What it looks like in practice',
      detail: 'We start from what you sell and who buys from you. A plain site takes a few days, a shop a little longer. We move in small steps you approve one by one, and at the end you leave with everything: code, sources, hosting in your name.',
      pricingFactors: ['Number of pages and templates', 'Online sales or plain storefront', 'Content and photos supplied or to be produced'],
    },
    {
      id: 'reservation',
      name: 'Booking and loyalty',
      tagline: 'You stop calling people back.',
      features: [
        'Online slots, automatic confirmation',
        'Reminder the day before, win-back for dormant clients',
        'Linked to your existing calendar',
        'Client records with history and follow-ups',
        'Digital loyalty card if you want one',
      ],
      cta: 'Discuss it',
      featured: false,
      detailTitle: 'What it looks like in practice',
      detail: 'The client books from your site, gets a confirmation, is reminded the day before, and your calendar stays up to date without anyone touching it. The two hours a week you spent on the phone no longer exist.',
      pricingFactors: ['Number of services and resources', 'Calendar and tools already in place', 'Online deposit or not'],
    },
    {
      id: 'liaisons',
      name: 'Integrations and tool rework',
      tagline: 'No more double entry.',
      features: [
        'Quote to invoice, accounting export, alerts',
        'Update and simplification of an existing tool',
        'End of retyping from one tool into another',
        'Short iterations, billed by the day',
        'Training for your team at the end',
      ],
      cta: 'Discuss it',
      featured: false,
      detailTitle: 'What it looks like in practice',
      detail: 'We look at what you retype from one place to another, and we connect it. Most of the time there is no need to replace anything: the tools you already have just need to talk to each other.',
      pricingFactors: ['Number of tools to connect', 'Whether a connection interface exists', 'Light rework or full rebuild of an older tool'],
    },
    {
      id: 'marque',
      name: 'Brand identity',
      tagline: 'Positioning first.',
      features: [
        'What you want your customers to feel',
        'Who you speak to, decided with figures',
        'Name, tone, colours, materials, usage rules',
        'The list of what to produce, priced',
        'A rulebook, not an image to interpret',
      ],
      cta: 'Discuss it',
      featured: false,
      detailTitle: 'What it looks like in practice',
      detail: 'Three to five days spread over two or three weeks. We start from you and your customers, never from the colours. You leave with written rules any printer or designer can use without us.',
      pricingFactors: ['Full creation or rework of an existing identity', 'Number of media to cover', 'Visual production included or not'],
    },
  ],
};

/* Les prix des offres TPE. Même forme que `prices` dans la page Offres :
   un montant, une note qui dit ce qui le fait varier, et la nature du
   tarif. Chez une TPE tout est à la journée ou au forfait court — il n'y
   a pas d'effectif à facturer. */
export const PRICES_TPE = {
  fr: {
    site: { amount: 'dès 1 900 €', note: 'Vitrine dès 1 900 € · boutique dès 3 200 € · selon le nombre de pages et la vente en ligne', type: 'Forfait' },
    reservation: { amount: 'dès 1 400 €', note: 'Créneaux, confirmation et rappels · lien avec votre agenda existant compris', type: 'Forfait' },
    liaisons: { amount: '450 €/jour', note: 'Compter 3 à 6 jours pour relier deux ou trois outils · estimation donnée avant de démarrer', type: 'Au temps passé' },
    marque: { amount: 'dès 1 600 €', note: '3 à 5 jours étalés sur deux à trois semaines · document de règles compris', type: 'Forfait' },
  },
  en: {
    site: { amount: 'from €1,900', note: 'Storefront from €1,900 · shop from €3,200 · depending on pages and online sales', type: 'Fixed price' },
    reservation: { amount: 'from €1,400', note: 'Slots, confirmation and reminders · link to your existing calendar included', type: 'Fixed price' },
    liaisons: { amount: '€450/day', note: 'Count 3 to 6 days to connect two or three tools · estimate given before we start', type: 'Time spent' },
    marque: { amount: 'from €1,600', note: '3 to 5 days over two or three weeks · rulebook included', type: 'Fixed price' },
  },
};

/* Ce qui change dans l'en-tête et le pavé de facturation de la page
   Offres. Le reste (QCM, FAQ, bande directe) vaut pour les deux. */
export const OFFRES_TPE = {
  fr: {
    metaTitle: 'Offres & tarifs TPE · site, réservation, liaisons, marque',
    metaDesc:
      'Quatre chantiers courts, prix affichés : site dès 1 900 €, réservation dès 1 400 €, liaisons entre outils à 450 €/jour, identité de marque dès 1 600 €. Ce qui est fixe, ce qui varie.',
    title: 'Quatre chantiers, quatre façons de gagner du temps.',
    directP: 'Si votre besoin est clair et que vous voulez passer directement à la réalisation, écrivez-moi. On gagne du temps tous les deux.',
    lead: 'Chaque chantier est différent, mais les tarifs sont clairs dès le départ. On définit ensemble le périmètre, vous savez ce que vous payez et pourquoi, et vous pouvez vous arrêter à la fin de chaque étape.',
    billing: {
      kicker: 'Transparence',
      title: 'Comment je facture.',
      text: 'Un jour d’intervention = 450 €. Les chantiers courts sont au forfait, annoncé avant de démarrer ; le reste est au temps passé, estimé et validé avec vous. On avance par petites étapes que vous validez une par une, et vous pouvez vous arrêter à la fin de chacune. Aucune surprise sur la facture.',
      note: 'Devis gratuit, valable 30 jours. Tarifs nets — TVA non applicable, article 293 B du CGI. Le code, les fichiers sources et les accès vous sont remis à la fin, quelle que soit la suite.',
    },
  },
  en: {
    metaTitle: 'Offers & pricing for small businesses · site, booking, integrations, brand',
    metaDesc:
      'Four short projects, prices shown: website from €1,900, booking from €1,400, integrations at €450/day, brand identity from €1,600. What is fixed, what varies.',
    title: 'Four projects, four ways to win time back.',
    directP: 'If your need is clear and you want to go straight to delivery, write to me. It saves us both time.',
    lead: 'Every project is different, but pricing is clear from the start. We define the scope together, you know what you pay and why, and you can stop at the end of any stage.',
    billing: {
      kicker: 'Transparency',
      title: 'How I bill.',
      text: 'One day on the job = €450. Short projects are fixed-price, announced before we start; the rest is time spent, estimated and approved with you. We move in small steps you approve one by one, and you can stop at the end of any of them. No surprises on the invoice.',
      note: 'Free quote, valid 30 days. Net prices — VAT not applicable, article 293 B of the French tax code. Code, source files and access are handed over at the end, whatever happens next.',
    },
  },
};

/* Le pont entre les deux versions : personne ne doit se retrouver enfermé
   dans son profil. */
export const PASSERELLE = {
  fr: {
    tpe: { txt: 'Vous dirigez plutôt une PME de dix personnes ou plus ?', act: 'Voir la version PME' },
    pme: { txt: 'Vous êtes plutôt une TPE de moins de dix personnes ?', act: 'Voir la version TPE' },
  },
  en: {
    tpe: { txt: 'Do you actually run an SME of ten people or more?', act: 'See the SME version' },
    pme: { txt: 'Are you rather a small business under ten people?', act: 'See the small-business version' },
  },
};
