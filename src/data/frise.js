/* ════════════════════════════════════════════════════════════
   LA FRISE — une seule planche, et l'offre entière se lit dessus.

   Le site montrait quatre petits dessins côte à côte : quatre objets sans
   rapport les uns avec les autres, qu'il fallait ouvrir un par un pour
   comprendre. Ici, un seul schéma. Il tient sur une ligne : la vie de
   l'entreprise, de gauche à droite, avec à chaque moment ce qui coince et ce
   qu'on pose à cet endroit-là. On voit d'un coup d'œil où on en est, ce qui
   vient après, et qu'on peut s'arrêter à n'importe quelle étape.

   Il s'anime au défilement comme une séquence : le sol se pose, chaque étape
   monte à son tour, le réseau se tend entre elles. Pas besoin d'ouvrir la
   version en volume pour comprendre — elle est là pour aller plus loin.

   Chaque étape renvoie à sa scène en trois dimensions (src/lib/scenes.js) :
   le petit emblème et le grand univers décrivent le même objet.
   ════════════════════════════════════════════════════════════ */

export const FRISE = {
  pme: {
    fr: {
      sur: 'Ce qu’on fait',
      titre: 'À chaque moment de votre entreprise, ce qui coince, et ce qu’on pose.',
      lead: 'Quatre chantiers, dans l’ordre où ils arrivent. Vous entrez là où vous en êtes, et vous vous arrêtez quand ça vous suffit.',
      etapes: [
        {
          figure: 'inventaire',
          quand: 'Ça s’est accumulé',
          nom: 'On fait le tour de vos outils',
          dit: 'Vingt abonnements arrivés un par un, dont trois que personne n’ouvre et deux qui font le même travail.',
        },
        {
          figure: 'liaison',
          quand: 'Ça ne se parle pas',
          nom: 'On relie ce qui ne se parle pas',
          dit: 'Le devis qui devient facture tout seul, l’export qui part au comptable. Fin des saisies en double.',
        },
        {
          figure: 'chantier',
          quand: 'Il manque une pièce',
          nom: 'On construit ce qui manque',
          dit: 'Une automatisation, un écran, un petit outil interne, à la taille exacte du trou. Le code est à vous.',
        },
        {
          figure: 'estrade',
          quand: 'Ça doit tenir sans nous',
          nom: 'On forme vos équipes',
          dit: 'Un outil que la moitié de l’équipe n’ose pas ouvrir est une dépense. On reste jusqu’à ce qu’il tourne seul.',
        },
      ],
      posture: 'Ce qu’on ne sait pas faire, on vous le dit tout de suite. Si on s’engage et qu’on se trompe, c’est nous qui reprenons le travail, pas vous qui le payez deux fois.',
      act: 'Le détail de chaque chantier',
      ouvrir: 'Voir cette étape en 3D',
    },
    en: {
      sur: 'What we do',
      titre: 'At each stage of your company, what jams, and what we put in place.',
      lead: 'Four projects, in the order they come up. You start where you are, and stop when it is enough.',
      etapes: [
        { figure: 'inventaire', quand: 'It piled up', nom: 'We go through every tool', dit: 'Twenty subscriptions bought one at a time, three nobody opens and two doing the same job.' },
        { figure: 'liaison', quand: 'Nothing talks', nom: 'We connect what does not talk', dit: 'The quote that becomes an invoice on its own, the export that reaches the accountant. No more double entry.' },
        { figure: 'chantier', quand: 'A piece is missing', nom: 'We build what is missing', dit: 'An automation, a screen, a small internal tool, cut to the size of the gap. The code is yours.' },
        { figure: 'estrade', quand: 'It must run without us', nom: 'We train your teams', dit: 'A tool half the team dares not open is an expense. We stay until it runs on its own.' },
      ],
      posture: 'What we cannot do, we say straight away. If we commit and get it wrong, we redo the work; you do not pay for it twice.',
      act: 'What each project involves',
      ouvrir: 'See this stage in 3D',
    },
  },

  tpe: {
    fr: {
      sur: 'Ce qu’on fait',
      titre: 'De l’idée à la boutique qui tourne, ce qu’on pose à chaque étape.',
      lead: 'Quatre chantiers courts, dans l’ordre où ils arrivent. Vous entrez là où vous en êtes, et vous vous arrêtez quand ça vous suffit.',
      etapes: [
        {
          figure: 'rampe',
          quand: 'Avant d’ouvrir',
          nom: 'On prépare votre lancement',
          dit: 'Le modèle, les chiffres, le dossier que vous défendrez devant la banque. On ne l’écrit pas à votre place, on le nourrit.',
        },
        {
          figure: 'vitrine',
          quand: 'On doit vous trouver',
          nom: 'On met votre entreprise en ligne',
          dit: 'Une page qui dit en une phrase ce que vous faites et pour qui, quatre pages derrière, une boutique si vous vendez.',
        },
        {
          figure: 'creneaux',
          quand: 'On doit vous joindre',
          nom: 'On prend vos rendez-vous',
          dit: 'Vos vraies disponibilités, la réservation en autonomie, la confirmation qui part seule. Vous arrêtez de rappeler le soir.',
        },
        {
          figure: 'cadre',
          quand: 'On doit vous reconnaître',
          nom: 'On pose votre identité',
          dit: 'Ce que vous vendez vraiment, à qui vous parlez, les mots et les couleurs qui vont avec. Le logo vient en dernier.',
        },
      ],
      posture: 'Ce qu’on ne sait pas faire, on vous le dit tout de suite. Si on s’engage et qu’on se trompe, c’est nous qui reprenons le travail, pas vous qui le payez deux fois.',
      act: 'Le détail de chaque chantier',
      ouvrir: 'Voir cette étape en 3D',
    },
    en: {
      sur: 'What we do',
      titre: 'From the idea to the shop that runs, what we put in place at each step.',
      lead: 'Four short projects, in the order they come up. You start where you are, and stop when it is enough.',
      etapes: [
        { figure: 'rampe', quand: 'Before opening', nom: 'We get your launch ready', dit: 'The model, the numbers, the file you will defend at the bank. We do not write it for you, we feed it.' },
        { figure: 'vitrine', quand: 'People must find you', nom: 'We put your business online', dit: 'A page saying in one sentence what you do and who for, four pages behind it, a shop if you sell.' },
        { figure: 'creneaux', quand: 'People must reach you', nom: 'We take your bookings', dit: 'Your real openings, self-service booking, the confirmation that sends itself. You stop calling back at night.' },
        { figure: 'cadre', quand: 'People must recognise you', nom: 'We set your identity', dit: 'What you actually sell, who you speak to, the words and colours that follow. The logo comes last.' },
      ],
      posture: 'What we cannot do, we say straight away. If we commit and get it wrong, we redo the work; you do not pay for it twice.',
      act: 'What each project involves',
      ouvrir: 'See this stage in 3D',
    },
  },
};
