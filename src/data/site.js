/* ============================================================
   Contenu centralisé, bilingue (fr / en). Édite ici prix,
   coordonnées, sources. Les composants lisent STATS[lang], etc.
   ============================================================ */

export const CONTACT = {
  email: 'hello@reskope.fr',
};

export const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/florian.bouchart@hotmail.fr';

/* Statistiques EXTERNES, toujours sourcées (le ⓘ affiche la source). */
export const STATS = {
  fr: [
    {
      id: 'workaboutwork',
      value: 60,
      suffix: '%',
      label:
        'du temps englouti par le « travail autour du travail » : chercher l’information, jongler entre les apps, réunions de statut.',
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
      label: 'par semaine et par salarié, perdues en travail dupliqué ou jugé inutile.',
      source: {
        label: 'Asana, Anatomy of Work Index 2021',
        url: 'https://www.businesswire.com/news/home/20210114005374/en/Asana-Anatomy-of-Work-Index-2021-Work-About-Work-Is-Dominating-in-a-Distributed-World',
      },
    },
    {
      id: 'email',
      value: 47,
      suffix: '%',
      label: 'du temps passé à gérer ses e-mails (28 %) et à chercher de l’information (19 %).',
      source: {
        label: 'McKinsey Global Institute, The Social Economy, 2012',
        url: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
      },
    },
    {
      id: 'automation',
      value: 30,
      suffix: '%',
      label:
        'des activités sont automatisables dans 60 % des métiers, soit près d’1,5 jour par semaine.',
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
      label:
        'of time swallowed by “work about work”: searching for information, juggling apps, status meetings.',
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
      text: 'Un premier échange pour cerner votre contexte, vos objectifs et le périmètre. Vous savez où on va avant même de commencer.',
      deliver: 'Une feuille de route partagée.', here: false,
    },
    {
      n: '02', label: 'Audit', title: 'On observe, salarié par salarié.',
      text: 'Entretiens individuels et cartographie de vos outils et de vos process. C’est l’étape de départ proposée aujourd’hui.',
      deliver: 'La photo fidèle de votre quotidien numérique.', here: true,
    },
    {
      n: '03', label: 'Bilan', title: 'On partage un diagnostic priorisé.',
      text: 'Constats, gains estimés et recommandations classées par impact. On le relit et on le valide ensemble.',
      deliver: 'Un rapport clair, que vous gardez.', here: false,
    },
    {
      n: '04', label: 'Mise en œuvre', title: 'On exécute, jalon par jalon.',
      text: 'Les quick wins d’abord, puis les chantiers de fond. Vous cochez chaque étape avec moi, à votre rythme.',
      deliver: 'Des outils qui travaillent enfin pour vous.', here: false,
    },
    {
      n: '05', label: 'Autonomie', title: 'Vos équipes reprennent la main.',
      text: 'Outils en place, équipes formées, gains mesurés. Vous continuez sans dépendre de qui que ce soit.',
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
      id: ‘audit’,
      name: ‘Audit numérique’,
      tagline: "Comprendre avant d’agir.",
      features: [
        ‘Entretiens individuels avec vos équipes’,
        ‘Cartographie complète de vos outils et usages’,
        ‘Identification des doublons, frictions et coûts cachés’,
        ‘Bilan priorisé par impact, que vous gardez’,
        ‘Recommandations actionnables : vous décidez de la suite’,
      ],
      cta: ‘Demander un audit’, featured: false,
    },
    {
      id: ‘audit-plus’,
      name: ‘Audit + Mise en œuvre’,
      tagline: ‘On identifie, je règle.’,
      features: [
        "Tout l’audit numérique, inclus",
        ‘Réalisation : intégrations, automatisations, site web’,
        "Développement d’outils sur-mesure si besoin",
        ‘Facturable à la journée (estimation fournie en amont)’,
        ‘Vous choisissez : je fais tout, ou vous reprenez la main’,
      ],
      cta: ‘En discuter’, featured: true,
    },
    {
      id: ‘developpement’,
      name: ‘Développement & automatisation’,
      tagline: ‘Votre besoin est cadré, je construis.’,
      features: [
        ‘Site web ou application métier sur-mesure’,
        ‘Automatisations (n8n, BI, intelligence artificielle)’,
        ‘Intégrations entre vos outils existants’,
        "Pas besoin de passer par l’audit si le besoin est clair",
        ‘Estimation de jours fournie avant démarrage’,
      ],
      cta: ‘Décrire mon besoin’, featured: false,
    },
    {
      id: ‘suivi’,
      name: ‘Suivi mensuel’,
      tagline: ‘Je reste dans la boucle.’,
      features: [
        ‘Contrôles réguliers de vos outils et automatisations’,
        ‘Petites modifications à la demande’,
        ‘Un interlocuteur disponible quand vous avez besoin’,
        ‘Réponse rapide, sans ticket, sans agence’,
        ‘Engagement mensuel, résiliable à tout moment’,
      ],
      cta: ‘Parlons du suivi’, featured: false,
    },
  ],
  en: [
    {
      id: ‘audit’,
      name: ‘Digital audit’,
      tagline: ‘Understand before you act.’,
      features: [
        ‘One-on-one interviews with your teams’,
        ‘Full map of your tools and how they are used’,
        ‘Identifying overlaps, friction points and hidden costs’,
        ‘Prioritized report by impact — yours to keep’,
        ‘Actionable recommendations: you decide what happens next’,
      ],
      cta: ‘Request an audit’, featured: false,
    },
    {
      id: ‘audit-plus’,
      name: ‘Audit + Delivery’,
      tagline: ‘We identify, I fix.’,
      features: [
        ‘Full digital audit, included’,
        ‘Delivery: integrations, automations, website’,
        ‘Custom tool development if needed’,
        ‘Day-rate billing (estimate provided upfront)’,
        ‘You choose: I do it all, or you take over’,
      ],
      cta: ‘Let\’s talk’, featured: true,
    },
    {
      id: ‘developpement’,
      name: ‘Development & automation’,
      tagline: ‘Your need is clear, I build it.’,
      features: [
        ‘Custom website or business application’,
        ‘Automations (n8n, BI, artificial intelligence)’,
        ‘Integrations between your existing tools’,
        ‘No audit needed if the brief is already clear’,
        ‘Day estimate provided before start’,
      ],
      cta: ‘Describe my need’, featured: false,
    },
    {
      id: ‘suivi’,
      name: ‘Monthly retainer’,
      tagline: ‘I stay in the loop.’,
      features: [
        ‘Regular checks on your tools and automations’,
        ‘Small changes on request’,
        ‘One point of contact whenever you need it’,
        ‘Fast response — no tickets, no agency’,
        ‘Monthly commitment, cancel any time’,
      ],
      cta: ‘Talk about ongoing support’, featured: false,
    },
  ],
};

export const FAQ = {
  fr: [
    {
      q: 'Combien de temps dure un audit ?',
      a: 'Selon la taille de l’équipe, comptez de quelques jours à deux semaines entre les entretiens, l’analyse et la restitution du bilan.',
    },
    {
      q: 'Faut-il changer tous nos outils ?',
      a: 'Rarement. L’objectif est de mieux utiliser l’existant, de connecter ce qui doit l’être, et de n’ajouter un outil que lorsqu’il fait gagner du temps.',
    },
    {
      q: 'Le bilan m’engage-t-il à prendre la mise en œuvre ?',
      a: 'Non. Le bilan est un livrable autonome : vous pouvez l’appliquer vous-même, avec votre équipe, ou me confier la réalisation.',
    },
    {
      q: 'Travaillez-vous avec les petites structures ?',
      a: 'Oui. L’approche terrain, salarié par salarié, est particulièrement efficace dans les TPE, PME et équipes en croissance.',
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
