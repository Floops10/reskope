/* ============================================================
   Contenu centralisé, bilingue (fr / en). Édite ici prix,
   coordonnées, sources. Les composants lisent STATS[lang], etc.
   ============================================================ */

export const CONTACT = {
  email: 'hello@reskope.fr',
};

/* ------------------------------------------------------------------
   Destination du formulaire (service FormSubmit).

   ⚠️ POUR MASQUER DÉFINITIVEMENT TON E-MAIL — colle ton ALIAS FormSubmit
   dans FORMSUBMIT_ALIAS ci-dessous. Comment l'obtenir (1 fois, gratuit) :
     1. Depuis le site en ligne, envoie un message via le formulaire.
     2. FormSubmit t'envoie un e-mail « Activate … » : il contient un
        identifiant aléatoire (ex. a1b2c3d4e5f6...).
     3. Colle CET identifiant dans FORMSUBMIT_ALIAS. Ton adresse n'apparaît
        alors plus nulle part, et rien ne change côté réception ni délivrabilité.

   En attendant l'alias, on route vers ta boîte SANS écrire l'adresse en
   clair dans le code livré : elle est encodée puis reconstruite à l'exécution,
   donc invisible pour les robots collecteurs d'e-mails.
   ------------------------------------------------------------------ */
const FORMSUBMIT_ALIAS = ''; // ← colle ici ton alias FormSubmit (recommandé)
const _inbox = typeof atob !== 'undefined'
  ? atob('Zmxvcmlhbi5ib3VjaGFydEBob3RtYWlsLmZy')
  : '';
export const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${FORMSUBMIT_ALIAS || _inbox}`;

/* Statistiques EXTERNES, toujours sourcées (le ⓘ affiche la source). */
export const STATS = {
  fr: [
    {
      id: 'workaboutwork',
      value: 60,
      suffix: '%',
      label: `du temps englouti par le « travail autour du travail » : chercher l'information, jongler entre les apps, réunions de statut.`,
      source: {
        label: 'Asana, Anatomy of Work Index 2021',
        url: 'https://www.businesswire.com/news/home/20210114005374/en/Asana-Anatomy-of-Work-Index-2021-Work-About-Work-Is-Dominating-in-a-Distributed-World',
      },
    },
    {
      id: 'duplicated',
      value: 6.5,
      decimals: 1,
      suffix: 'h',
      label: `par semaine et par salarié, perdues en travail dupliqué ou jugé inutile.`,
      source: {
        label: 'Asana, Anatomy of Work Index 2021',
        url: 'https://www.businesswire.com/news/home/20210114005374/en/Asana-Anatomy-of-Work-Index-2021-Work-About-Work-Is-Dominating-in-a-Distributed-World',
      },
    },
    {
      id: 'email',
      value: 47,
      suffix: '%',
      label: `du temps passé à gérer ses e-mails (28 %) et à chercher de l'information (19 %).`,
      source: {
        label: 'McKinsey Global Institute, The Social Economy, 2012',
        url: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
      },
    },
    {
      id: 'automation',
      value: 30,
      suffix: '%',
      label: `des activités sont automatisables dans 60 % des métiers, soit près d'1,5 jour par semaine.`,
      source: {
        label: 'McKinsey, A Future That Works, 2017',
        url: 'https://www.mckinsey.com/featured-insights/digital-disruption/harnessing-automation-for-a-future-that-works',
      },
    },
  ],
  en: [
    {
      id: 'workaboutwork',
      value: 60,
      suffix: '%',
      label: 'of time swallowed by "work about work": searching for information, juggling apps, status meetings.',
      source: {
        label: 'Asana, Anatomy of Work Index 2021',
        url: 'https://www.businesswire.com/news/home/20210114005374/en/Asana-Anatomy-of-Work-Index-2021-Work-About-Work-Is-Dominating-in-a-Distributed-World',
      },
    },
    {
      id: 'duplicated',
      value: 6.5,
      decimals: 1,
      suffix: 'h',
      label: 'per week per employee, lost to duplicated or needless work.',
      source: {
        label: 'Asana, Anatomy of Work Index 2021',
        url: 'https://www.businesswire.com/news/home/20210114005374/en/Asana-Anatomy-of-Work-Index-2021-Work-About-Work-Is-Dominating-in-a-Distributed-World',
      },
    },
    {
      id: 'email',
      value: 47,
      suffix: '%',
      label: 'of time spent managing emails (28%) and searching for information (19%).',
      source: {
        label: 'McKinsey Global Institute, The Social Economy, 2012',
        url: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
      },
    },
    {
      id: 'automation',
      value: 30,
      suffix: '%',
      label: 'of activities are automatable in 60% of jobs, nearly 1.5 days a week.',
      source: {
        label: 'McKinsey, A Future That Works, 2017',
        url: 'https://www.mckinsey.com/featured-insights/digital-disruption/harnessing-automation-for-a-future-that-works',
      },
    },
  ],
};

/* Jalons de la démarche (roadmap interactive). */
export const JALONS = {
  fr: [
    {
      n: '01', label: 'Cadrage', title: 'On définit le terrain de jeu.',
      text: `Un premier échange pour cerner votre contexte, vos objectifs et le périmètre. Vous savez où on va avant même de commencer.`,
      deliver: 'Une feuille de route partagée.', here: false,
    },
    {
      n: '02', label: 'Audit', title: 'On observe, salarié par salarié.',
      text: `Entretiens individuels et cartographie de vos outils et de vos process. C'est l'étape de départ proposée aujourd'hui.`,
      deliver: `La photo fidèle de votre quotidien numérique.`, here: true,
    },
    {
      n: '03', label: 'Bilan', title: 'On partage un diagnostic priorisé.',
      text: `Constats, gains estimés et recommandations classées par impact. On le relit et on le valide ensemble.`,
      deliver: 'Un rapport clair, que vous gardez.', here: false,
    },
    {
      n: '04', label: 'Mise en œuvre', title: 'On exécute, jalon par jalon.',
      text: `Les quick wins d'abord, puis les chantiers de fond. Vous cochez chaque étape avec moi, à votre rythme.`,
      deliver: 'Des outils qui travaillent enfin pour vous.', here: false,
    },
    {
      n: '05', label: 'Autonomie', title: 'Vos équipes reprennent la main.',
      text: `Outils en place, équipes formées, gains mesurés. Vous continuez sans dépendre de qui que ce soit.`,
      deliver: 'Un système durable, et des gains chiffrés.', here: false,
    },
  ],
  en: [
    {
      n: '01', label: 'Framing', title: 'We define the playing field.',
      text: 'A first conversation to pin down your context, your goals and the scope. You know where we are going before we even start.',
      deliver: 'A shared roadmap.', here: false,
    },
    {
      n: '02', label: 'Audit', title: 'We observe, employee by employee.',
      text: 'One-on-one interviews and a map of your tools and processes. This is the starting step offered today.',
      deliver: 'A faithful picture of your digital day-to-day.', here: true,
    },
    {
      n: '03', label: 'Report', title: 'We share a prioritized diagnosis.',
      text: 'Findings, estimated gains and recommendations ranked by impact. We review and validate it together.',
      deliver: 'A clear report, yours to keep.', here: false,
    },
    {
      n: '04', label: 'Delivery', title: 'We execute, milestone by milestone.',
      text: 'Quick wins first, then the deeper work. You tick off each step with me, at your own pace.',
      deliver: 'Tools that finally work for you.', here: false,
    },
    {
      n: '05', label: 'Autonomy', title: 'Your teams take back control.',
      text: 'Tools in place, teams trained, gains measured. You carry on without depending on anyone.',
      deliver: 'A lasting system, with quantified gains.', here: false,
    },
  ],
};

export const OFFERS = {
  fr: [
    {
      id: 'audit',
      name: 'Audit numérique',
      tagline: `Comprendre avant d'agir.`,
      features: [
        'Entretiens individuels avec vos équipes',
        'Cartographie complète de vos outils et usages',
        'Identification des doublons, frictions et coûts cachés',
        'Bilan priorisé par impact, que vous gardez',
        'Recommandations actionnables : vous décidez de la suite',
      ],
      cta: 'Demander un audit',
      featured: false,
      detailTitle: 'Ce que ça donne concrètement',
      detail: `Je passe 2 à 5 jours sur le terrain avec vos équipes, de visu. J'analyse chaque outil utilisé, chaque usage réel, chaque friction. À la fin, vous recevez un bilan priorisé par impact, pas par complexité technique, que vous gardez quelle que soit la suite. Vous n'avez aucune obligation de continuer avec moi.`,
      pricingFactors: [
        `Nombre d'équipes ou de sites à couvrir`,
        `Complexité de l'écosystème d'outils`,
        `Format du livrable (rapport seul ou rapport + présentation)`,
      ],
    },
    {
      id: 'audit-plus',
      name: 'Audit + Mise en œuvre',
      tagline: 'On identifie, je règle.',
      features: [
        `Tout l'audit numérique, inclus`,
        'Réalisation : intégrations, automatisations, site web',
        `Développement d'outils sur-mesure si besoin`,
        'Facturable à la journée (estimation fournie en amont)',
        'Vous choisissez : je fais tout, ou vous reprenez la main',
      ],
      cta: 'En discuter',
      featured: true,
      detailTitle: 'Ce que ça donne concrètement',
      detail: `L'audit d'abord, même rigueur, même présence terrain. Puis la réalisation : intégrations entre outils, automatisations, site web ou application métier. Chaque journée de réalisation est estimée avant démarrage et tracée avec vous. Si à mi-chemin vous voulez reprendre la main, c'est possible.`,
      pricingFactors: [
        `Périmètre de réalisation défini après l'audit`,
        `Nombre de jours d'implémentation estimés`,
        `Développements sur-mesure éventuels (code ou no-code)`,
      ],
    },
    {
      id: 'developpement',
      name: 'Développement & automatisation',
      tagline: 'Votre besoin est cadré, je construis.',
      features: [
        'Site web ou application métier sur-mesure',
        'Automatisations (n8n, BI, intelligence artificielle)',
        'Intégrations entre vos outils existants',
        `Pas besoin de passer par l'audit si le besoin est clair`,
        'Estimation de jours fournie avant démarrage',
      ],
      cta: 'Décrire mon besoin',
      featured: false,
      detailTitle: 'Ce que ça donne concrètement',
      detail: `Vous avez un besoin clair : un site, une application métier, une automatisation, une intégration. Pas besoin d'audit préalable. Je construis de la maquette au déploiement, sans intermédiaire. Tout est estimé en jours avant de démarrer, vous savez ce que vous payez et pourquoi.`,
      pricingFactors: [
        `Complexité fonctionnelle (pages, logique métier, APIs)`,
        `Technologies retenues (no-code, développement, IA)`,
        `Délai souhaité et contraintes de disponibilité`,
      ],
    },
    {
      id: 'suivi',
      name: 'Suivi mensuel',
      tagline: 'Je reste dans la boucle.',
      features: [
        'Contrôles réguliers de vos outils et automatisations',
        'Petites modifications à la demande',
        'Un interlocuteur disponible quand vous avez besoin',
        'Réponse rapide, sans ticket, sans agence',
        'Engagement mensuel, résiliable à tout moment',
      ],
      cta: 'Parlons du suivi',
      featured: false,
      detailTitle: 'Ce que ça donne concrètement',
      detail: `Je reste disponible après la mission. Contrôles réguliers, petites corrections, réponses rapides. Un seul interlocuteur qui connaît déjà vos outils, pas besoin de tout réexpliquer à chaque fois. Résiliable à tout moment, sans pénalité.`,
      pricingFactors: [
        `Volume d'intervention mensuel estimé`,
        `Nombre d'outils et automatisations à surveiller`,
        `Fréquence des points de suivi et disponibilité souhaitée`,
      ],
    },
  ],
  en: [
    {
      id: 'audit',
      name: 'Digital audit',
      tagline: 'Understand before you act.',
      features: [
        'One-on-one interviews with your teams',
        'Full map of your tools and how they are used',
        'Identifying overlaps, friction points and hidden costs',
        'Prioritized report by impact, yours to keep',
        'Actionable recommendations: you decide what happens next',
      ],
      cta: 'Request an audit',
      featured: false,
      detailTitle: 'What it actually delivers',
      detail: `I spend 2 to 5 days on the ground with your teams, in person. I analyse every tool in use, every real workflow, every friction point. At the end, you receive a report prioritized by actual impact, not technical complexity, yours to keep regardless of what you do next.`,
      pricingFactors: [
        `Number of teams or sites to cover`,
        `Complexity of the existing tool ecosystem`,
        `Deliverable format (report only or report + presentation)`,
      ],
    },
    {
      id: 'audit-plus',
      name: 'Audit + Delivery',
      tagline: 'We identify, I fix.',
      features: [
        'Full digital audit, included',
        'Delivery: integrations, automations, website',
        'Custom tool development if needed',
        'Day-rate billing (estimate provided upfront)',
        'You choose: I do it all, or you take over',
      ],
      cta: "Let's talk",
      featured: true,
      detailTitle: 'What it actually delivers',
      detail: `The audit first, same rigour, same on-site presence. Then delivery: tool integrations, automations, website or business app. Every implementation day is estimated before we start and tracked with you. If halfway through you want to take over, that's fine.`,
      pricingFactors: [
        `Delivery scope defined after the audit`,
        `Estimated number of implementation days`,
        `Custom development if needed (code or no-code)`,
      ],
    },
    {
      id: 'developpement',
      name: 'Development & automation',
      tagline: 'Your need is clear, I build it.',
      features: [
        'Custom website or business application',
        'Automations (n8n, BI, artificial intelligence)',
        'Integrations between your existing tools',
        'No audit needed if the brief is already clear',
        'Day estimate provided before start',
      ],
      cta: 'Describe my need',
      featured: false,
      detailTitle: 'What it actually delivers',
      detail: `You have a clear need: a website, a business app, an automation, an integration. No prior audit needed. I build from mockup to deployment, no middleman. Everything is estimated in days before we start, you know what you are paying and why.`,
      pricingFactors: [
        `Functional complexity (pages, business logic, APIs)`,
        `Chosen technologies (no-code, development, AI)`,
        `Target timeline and availability constraints`,
      ],
    },
    {
      id: 'suivi',
      name: 'Monthly retainer',
      tagline: 'I stay in the loop.',
      features: [
        'Regular checks on your tools and automations',
        'Small changes on request',
        'One point of contact whenever you need it',
        'Fast response, no tickets, no agency',
        'Monthly commitment, cancel any time',
      ],
      cta: 'Talk about ongoing support',
      featured: false,
      detailTitle: 'What it actually delivers',
      detail: `I stay available after the engagement. Regular checks, small fixes, fast responses. One point of contact who already knows your setup, no need to explain everything from scratch each time. Cancel any time, no penalty.`,
      pricingFactors: [
        `Estimated monthly intervention volume`,
        `Number of tools and automations to monitor`,
        `Desired check-in frequency and availability`,
      ],
    },
  ],
};

export const FAQ = {
  fr: [
    {
      q: 'Combien de temps dure un audit ?',
      a: `Selon la taille de l'équipe, comptez de quelques jours à deux semaines entre les entretiens, l'analyse et la restitution du bilan.`,
    },
    {
      q: 'Faut-il changer tous nos outils ?',
      a: `Rarement. L'objectif est de mieux utiliser l'existant, de connecter ce qui doit l'être, et de n'ajouter un outil que lorsqu'il fait gagner du temps.`,
    },
    {
      q: `Le bilan m'engage-t-il à prendre la mise en œuvre ?`,
      a: `Non. Le bilan est un livrable autonome : vous pouvez l'appliquer vous-même, avec votre équipe, ou me confier la réalisation.`,
    },
    {
      q: 'Travaillez-vous avec les petites structures ?',
      a: `Oui. L'approche terrain, salarié par salarié, est particulièrement efficace dans les TPE, PME et équipes en croissance.`,
    },
  ],
  en: [
    {
      q: 'How long does an audit take?',
      a: 'Depending on team size, count from a few days to two weeks across the interviews, the analysis and the report debrief.',
    },
    {
      q: 'Do we have to replace all our tools?',
      a: 'Rarely. The goal is to make better use of what exists, connect what needs connecting, and add a tool only when it saves time.',
    },
    {
      q: 'Does the report commit me to the delivery phase?',
      a: 'No. The report is a standalone deliverable: you can apply it yourself, with your team, or entrust the delivery to me.',
    },
    {
      q: 'Do you work with small organizations?',
      a: 'Yes. The on-the-ground, employee-by-employee approach is especially effective in small businesses, SMEs and growing teams.',
    },
  ],
};
