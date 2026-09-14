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
    directP: 'Si votre besoin est clair et que vous voulez passer directement à la réalisation, écrivez-nous. On gagne du temps tous les deux.',
    lead: 'Chaque chantier est différent, mais les tarifs sont clairs dès le départ. On définit ensemble le périmètre, vous savez ce que vous payez et pourquoi, et vous pouvez vous arrêter à la fin de chaque étape.',
    billing: {
      kicker: 'Transparence',
      title: 'Comment on facture.',
      text: 'Un jour d’intervention = 450 €. Les chantiers courts sont au forfait, annoncé avant de démarrer ; le reste est au temps passé, estimé et validé avec vous. On avance par petites étapes que vous validez une par une, et vous pouvez vous arrêter à la fin de chacune. Aucune surprise sur la facture.',
      note: 'Devis gratuit, valable 30 jours. Tarifs nets, TVA non applicable, article 293 B du CGI. Le code, les fichiers sources et les accès vous sont remis à la fin, quelle que soit la suite.',
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
      note: 'Free quote, valid 30 days. Net prices, VAT not applicable, article 293 B of the French tax code. Code, source files and access are handed over at the end, whatever happens next.',
    },
  },
};

/* Les pages qui ne concernent qu'un profil.

   L'exemple de bilan est le compte rendu d'un audit mené poste par poste
   chez une PME. Chez une entreprise de trois personnes, cette prestation
   n'existe pas : la page n'a rien à y faire. On la retire donc du menu
   en version TPE.

   On ne la SUPPRIME pas pour autant : l'URL reste valide, elle garde sa
   valeur pour les moteurs, et quiconque y arrive par un lien externe la
   lit normalement — avec un bandeau qui dit franchement à qui elle
   s'adresse et propose la bascule. Rediriger de force serait hostile. */
export const PAGES_PROFIL = { '/exemple': 'pme' };

export const RESERVE = {
  fr: {
    pme: {
      txt: 'Ce bilan est un exemple d’audit mené poste par poste, une prestation qui s’adresse aux PME de dix personnes et plus. Vous consultez le site en version TPE.',
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
      txt: 'This report is an example of a desk-by-desk audit, a service aimed at SMEs of ten people and above. You are browsing the small-business version of the site.',
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
   LE CONSTAT, VERSION TPE.

   Les chiffres sourcés ne changent pas : ils portent sur un salarié
   « de bureau », pas sur la taille de l'entreprise. Ce qui change, c'est
   l'ÉCHELLE de la démonstration et la personne à qui on parle. Chiffrer
   une équipe de vingt personnes devant un patron qui en a quatre, c'est
   le meilleur moyen de lui faire fermer la page.
   ============================================================ */
export const POURQUOI_TPE = {
  fr: {
    metaTitle: 'Le constat · le temps que vos outils vous prennent',
    metaDesc:
      'Près de la moitié de la semaine part dans les e-mails et la recherche d’information. Les chiffres sourcés, ramenés à une entreprise de cinq personnes.',
    heroTitle: 'Le temps que personne ne compte.',
    heroTease:
      'Chaque semaine, vos outils vous prennent des heures. On a mesuré combien, et surtout pourquoi.',
    heroLead:
      'Devis recopiés, agenda qui ne parle à rien, information qu’on cherche deux fois : ce temps n’apparaît sur aucune facture. Il sort pourtant de votre semaine, et souvent de vos soirées.',
    bridgeTitle: 'Et chez vous ?',
    bridgeText:
      'Ces chiffres ne sortent pas d’une plaquette commerciale. Si une seule de ces heures se vérifie chez vous, un chantier bien choisi la rend pour de bon.',
    bridgeBtn: 'Voir ce qu’on construit',
    film: {
      costValue: 116000,
      costCap: 'Pour une entreprise de cinq personnes, c’est déjà plus de cent mille euros par an.',
      costCalc: '16,5 h × 47 semaines × 5 personnes × 30 €/h chargé ≈ 116 000 € par an.',
      teamCaption: 'Une entreprise de cinq personnes.',
      orderText: 'Chaque heure rendue, c’est une heure de plus sur votre métier, ou une soirée de moins au bureau.',
      synthCap: 'Ce temps a un coût. Le récupérer en a un aussi, bien plus petit.',
    },
    targetsTitle: 'Pour ceux qui se reconnaissent ici.',
    targets: [
      { title: 'L’artisan', size: 'Jusqu’à 10 personnes', desc: 'Devis, factures, planning, échanges clients : tout est dispersé, et une bonne partie se fait le soir. Deux ou trois liaisons bien choisies rendent plusieurs heures par semaine.', cta: 'Voir ce qu’on construit', to: '/offres' },
      { title: 'Le commerce et le service', size: 'De 2 à 10 personnes', desc: 'Vous prenez les rendez-vous au téléphone, vous rappelez la veille, vous relancez à la main. Tout ça se fait sans vous, et mieux.', cta: 'Voir les offres', to: '/offres' },
      { title: 'La jeune structure', size: 'Moins de 5 personnes', desc: 'Vous démarrez, vous n’avez pas encore de mauvaises habitudes. C’est le meilleur moment pour poser des outils justes, et une marque qui vous ressemble.', cta: 'Voir la méthode', to: '/methode' },
    ],
  },
  en: {
    metaTitle: 'The findings · the time your tools take from you',
    metaDesc:
      'Nearly half the week goes into email and hunting for information. The sourced figures, brought down to a five-person business.',
    heroTitle: 'The time nobody counts.',
    heroTease: 'Every week, your tools take hours from you. We measured how many, and above all why.',
    heroLead:
      'Quotes retyped, a calendar that talks to nothing, information you look for twice: that time appears on no invoice. It still comes out of your week, and often out of your evenings.',
    bridgeTitle: 'And at your place?',
    bridgeText:
      'These figures do not come from a sales brochure. If even one of those hours holds true for you, a well-chosen project gives it back for good.',
    bridgeBtn: 'See what we build',
    film: {
      costValue: 116000,
      costCap: 'For a five-person business, that is already more than a hundred thousand euros a year.',
      costCalc: '16.5 h × 47 weeks × 5 people × €30/h loaded ≈ €116,000 per year.',
      teamCaption: 'A five-person business.',
      orderText: 'Every hour given back is an hour more on your trade, or an evening less at the desk.',
      synthCap: 'That time has a cost. Getting it back has one too, a much smaller one.',
    },
    targetsTitle: 'For those who recognize themselves here.',
    targets: [
      { title: 'The craftsman', size: 'Up to 10 people', desc: 'Quotes, invoices, scheduling, client messages: all scattered, and a good part of it done in the evening. Two or three well-chosen links give back several hours a week.', cta: 'See what we build', to: '/offres' },
      { title: 'Retail and services', size: 'From 2 to 10 people', desc: 'You take bookings by phone, you call back the day before, you chase by hand. All of that runs without you, and better.', cta: 'See the offers', to: '/offres' },
      { title: 'The young business', size: 'Under 5 people', desc: 'You are starting out, with no bad habits yet. It is the best moment to set up the right tools, and a brand that looks like you.', cta: 'See the method', to: '/methode' },
    ],
  },
};

/* La seule carte du constat qui parle vraiment de taille : chez Okta la
   moyenne est mesurée sur des grands comptes. On la ramène à l'échelle
   d'une TPE plutôt que de laisser un chiffre qui ne parle à personne. */
export const CONSTAT_TPE = {
  fr: {
    apps: {
      kicker: 'L’empilement d’outils',
      title: 'applications déployées en moyenne par entreprise.',
      desc: 'Même à cinq, les outils s’accumulent : un pour les devis, un pour la compta, un pour le planning, un pour les photos de chantier. Chacun promet un gain et ajoute une saisie.',
      calc: 'Moyenne mesurée sur le parc clients Okta (grands comptes). Dans une TPE française, on compte plutôt 5 à 15 outils : le mécanisme de dispersion est identique, à plus petite échelle.',
    },
  },
  en: {
    apps: {
      kicker: 'The tool pile-up',
      title: 'applications deployed on average per company.',
      desc: 'Even at five people, tools pile up: one for quotes, one for accounting, one for scheduling, one for site photos. Each promises a gain and adds an entry.',
      calc: 'Average measured across Okta’s customer base (large accounts). In a French small business it is more like 5 to 15 tools: the scattering mechanism is identical, at a smaller scale.',
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
      text: `Une demi-journée chez vous ou en visio : ce que vous vendez, comment vous travaillez, et ce qui vous prend du temps tous les jours.`,
      deliver: 'Le périmètre écrit, et le prix.', here: true },
    { n: '02', label: 'Devis', title: 'On chiffre avant de commencer.',
      text: `Ce qu'on fait, poste par poste : ce qui est au forfait, ce qui est à la journée, et le total. Vous décidez ensuite, sans engagement.`,
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
      introText: 'Des outils qui vous prennent du temps aujourd’hui. Un parcours court pour les remettre à leur place.',
      synthCap: 'Cinq étapes. Et les clés à la fin.',
    },
    calloutTitle: 'Le livrable : un outil qui tourne, et le code avec.',
    calloutText:
      'À la fin, vous repartez avec ce qui a été construit, les fichiers sources, l’hébergement et les accès à votre nom. Vous faites vos modifications vous-même, ou vous nous les confiez : dans les deux cas, rien ne vous retient.',
    calloutBtn: 'Voir ce qu’on construit',
    calloutTo: '/offres',
  },
  en: {
    metaTitle: 'The method · from framing to the keys, step by step',
    metaDesc:
      'Framing, quote, build in small steps, go live, handover. Nothing is committed before it is priced, and you can stop at the end of any step.',
    film: {
      introTitle: 'We build, you keep control.',
      introText: 'Tools that take your time today. A short journey to put them back in their place.',
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
      { range: '1 à 3 pers.', label: 'Vous, et peut-être une main', principle: 'Un seul endroit, et zéro double saisie.', detail: 'À ce stade, chaque outil en plus est une charge. L’objectif : un endroit pour les clients, un pour les devis et factures, et une liaison entre les deux pour ne jamais retaper la même ligne.', wins: ['Site vitrine', 'Devis vers facture', 'Agenda relié'] },
      { range: '3 à 6 pers.', label: 'Petite équipe', principle: 'Automatiser ce qui revient toutes les semaines.', detail: 'Les rendez-vous, les rappels, les relances : tout ce qui se répète peut se faire sans vous. C’est là qu’on récupère les premières heures, et ce sont souvent des soirées.', wins: ['Prise de réservation', 'Rappels automatiques', 'Fichier clients'] },
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
    lead: 'Décrivez votre besoin en trois lignes. On vous répond sous 24 h, franchement : si ce n’est pas pour nous, on vous le dit.',
    quizLead: 'Le questionnaire cerne votre besoin et prépare votre demande : vous validez, on a tout.',
  },
  en: {
    lead: 'Describe your need in three lines. We reply within 24 h, frankly: if it is not for us, we say so.',
    quizLead: 'The questionnaire pins down your need and prepares your request: you confirm, we have everything.',
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
