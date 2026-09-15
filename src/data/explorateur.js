/* ════════════════════════════════════════════════════════════
   L'EXPLORATEUR — ce que chaque pièce de chaque scène veut dire.

   Sur la planche, les volumes sont dessinés à plat. Ici, la même géométrie
   est montée en vrai trois dimensions : on tourne autour, on se rapproche,
   et chaque pièce porte une étiquette qu'on peut ouvrir. Le but n'est pas
   de faire joli, c'est de rendre l'offre lisible sans la paraphraser : un
   chantier se comprend mieux en tournant autour qu'en lisant la phrase qui
   le décrit.

   `pieces` désigne des pavés par leur index dans la figure. L'ordre est
   celui de src/lib/figures.js, et il ne doit pas bouger sans qu'on
   rerègle ces repères.
   ════════════════════════════════════════════════════════════ */

export const EXPLORATEUR = {
  /* ── PME ───────────────────────────────────────────────────── */
  inventaire: {
    fr: {
      titre: 'On fait le tour de vos outils',
      intro: 'Chaque bloc posé sur le sol est un outil que vous payez. Sa hauteur, c’est ce qu’il vous coûte sur l’année. Tournez autour : ce qui est creux se voit tout de suite.',
      pieces: [
        { idx: [0, 2, 3, 5, 6, 8], nom: 'Un outil, un bloc',
          dit: 'Un logiciel, un abonnement, un service. On les recense un par un, en partant de ce que les gens ouvrent vraiment, pas de la liste des factures.' },
        { idx: [1, 7], nom: 'Payé, jamais ouvert',
          dit: 'Le fil de fer, ce sont les comptes actifs que plus personne n’utilise. C’est presque toujours là que se trouve la première économie.' },
        { idx: [4], nom: 'Le plus coûteux',
          dit: 'Le bloc le plus haut n’est pas forcément le plus utile. On regarde ce qu’il vous rend, et ce qu’une alternative ferait pour moins cher.' },
      ],
      fin: 'Vous repartez avec le tableau complet, coût par coût, que vous nous confiiez la suite ou non.',
    },
    en: {
      titre: 'We go through every tool',
      intro: 'Every block on the ground is a tool you pay for. Its height is what it costs you over a year. Turn around it: the hollow ones show up at once.',
      pieces: [
        { idx: [0, 2, 3, 5, 6, 8], nom: 'One tool, one block',
          dit: 'A piece of software, a subscription, a service. We list them one by one, starting from what people actually open, not from the invoices.' },
        { idx: [1, 7], nom: 'Paid for, never opened',
          dit: 'The wireframes are the live accounts nobody uses any more. That is almost always where the first saving is.' },
        { idx: [4], nom: 'The most expensive',
          dit: 'The tallest block is not always the most useful. We look at what it gives you, and what a cheaper alternative would do.' },
      ],
      fin: 'You leave with the full table, cost by cost, whether you entrust us with the rest or not.',
    },
  },

  liaison: {
    fr: {
      titre: 'On relie ce qui ne se parle pas',
      intro: 'Deux outils, et rien entre les deux. Aujourd’hui c’est quelqu’un qui fait le trajet à la main, plusieurs fois par jour.',
      pieces: [
        { idx: [0], nom: 'Là où l’information naît',
          dit: 'Le devis, la commande, la fiche client. Elle est saisie une fois, correctement, à l’endroit prévu pour ça.' },
        { idx: [1], nom: 'La passerelle',
          dit: 'Une fois posée, elle travaille sans vous. Le devis accepté devient une facture, l’export part au comptable, l’alerte tombe au bon moment.' },
        { idx: [2], nom: 'Là où elle doit arriver',
          dit: 'La compta, le planning, le suivi. La même information, jamais retapée, donc jamais différente d’un outil à l’autre.' },
      ],
      fin: 'On branche ce que vous avez déjà. Rien à racheter, rien à migrer de force.',
    },
    en: {
      titre: 'We connect what does not talk',
      intro: 'Two tools, and nothing in between. Today somebody makes the trip by hand, several times a day.',
      pieces: [
        { idx: [0], nom: 'Where the information starts',
          dit: 'The quote, the order, the client record. Entered once, properly, in the place meant for it.' },
        { idx: [1], nom: 'The bridge',
          dit: 'Once built, it works without you. An accepted quote becomes an invoice, the export reaches the accountant, the alert fires on time.' },
        { idx: [2], nom: 'Where it has to arrive',
          dit: 'Accounts, scheduling, follow-up. The same information, never retyped, so never different from one tool to the next.' },
      ],
      fin: 'We plug in what you already have. Nothing to buy again, nothing forced into a migration.',
    },
  },

  chantier: {
    fr: {
      titre: 'On construit ce qui manque',
      intro: 'On ne repart pas de zéro. Les couches pleines sont ce que vous avez déjà ; on pose la suivante par-dessus.',
      pieces: [
        { idx: [0], nom: 'Ce qui existe',
          dit: 'Vos outils, vos données, vos habitudes. On garde tout ce qui marche, même si ce n’est pas ce qu’on aurait choisi.' },
        { idx: [1, 2], nom: 'Ce qu’on reprend',
          dit: 'On remet à jour et on simplifie ce qui coince, par petites étapes que vous validez une par une.' },
        { idx: [3], nom: 'Ce qu’on ajoute',
          dit: 'La brique qui manque : un outil interne, une automatisation, un site. Le code et les accès sont à vous à la fin.' },
      ],
      fin: 'Vous voyez chaque étape fonctionner avant qu’on passe à la suivante, et vous pouvez vous arrêter à la fin de chacune.',
    },
    en: {
      titre: 'We build what is missing',
      intro: 'We do not start from nothing. The solid layers are what you already have; we put the next one on top.',
      pieces: [
        { idx: [0], nom: 'What exists',
          dit: 'Your tools, your data, your habits. We keep everything that works, even what we would not have chosen.' },
        { idx: [1, 2], nom: 'What we rework',
          dit: 'We update and simplify what gets in the way, in small steps you approve one by one.' },
        { idx: [3], nom: 'What we add',
          dit: 'The missing brick: an internal tool, an automation, a website. The code and the access are yours at the end.' },
      ],
      fin: 'You see each step working before we move to the next, and you can stop at the end of any of them.',
    },
  },

  estrade: {
    fr: {
      titre: 'On forme vos équipes',
      intro: 'L’outil tourne : c’est le point de départ, pas l’arrivée. Un logiciel que personne n’ouvre ne vaut rien.',
      pieces: [
        { idx: [0], nom: 'L’outil, en place',
          dit: 'Installé, relié, testé sur vos vrais dossiers. Pas sur un jeu d’essai qui marche toujours.' },
        { idx: [1, 2, 3], nom: 'Les gens qui s’en servent',
          dit: 'Chacun apprend ce qui le concerne, sur son poste. Pas une formation générale de trois heures que personne ne retient.' },
        { idx: [3], nom: 'Et après',
          dit: 'On reste joignable le temps qu’il faut. Quand plus personne n’a besoin de nous, c’est qu’on a bien travaillé.' },
      ],
      fin: 'Une demi-journée de prise en main, puis vos équipes continuent sans nous.',
    },
    en: {
      titre: 'We train your teams',
      intro: 'The tool runs: that is the start, not the finish. Software nobody opens is worth nothing.',
      pieces: [
        { idx: [0], nom: 'The tool, in place',
          dit: 'Installed, connected, tested on your real files. Not on a demo set that always works.' },
        { idx: [1, 2, 3], nom: 'The people using it',
          dit: 'Each person learns what concerns them, at their own desk. Not a three-hour general session nobody remembers.' },
        { idx: [3], nom: 'And afterwards',
          dit: 'We stay reachable as long as needed. When nobody needs us any more, we did the job.' },
      ],
      fin: 'Half a day of handover, then your teams carry on without us.',
    },
  },

  /* ── TPE ───────────────────────────────────────────────────── */
  vitrine: {
    fr: {
      titre: 'On met votre entreprise en ligne',
      intro: 'Un site n’est pas une brochure posée sur internet. C’est un socle, une façade, et ce que vous vendez dessus.',
      pieces: [
        { idx: [0], nom: 'Le socle',
          dit: 'L’hébergement, le nom de domaine, les sauvegardes, la vitesse. Tout est à votre nom, dès le premier jour.' },
        { idx: [1], nom: 'La façade',
          dit: 'Ce que voit quelqu’un qui ne vous connaît pas : qui vous êtes, ce que vous faites, comment vous joindre. En trois secondes.' },
        { idx: [2, 3], nom: 'Ce que vous vendez',
          dit: 'Vos produits ou vos prestations, avec le paiement s’il en faut un, et un formulaire dont les messages arrivent vraiment.' },
      ],
      fin: 'Vous repartez avec le code, les fichiers sources et tous les accès.',
    },
    en: {
      titre: 'We put your business online',
      intro: 'A website is not a brochure parked on the internet. It is a base, a front, and what you sell on it.',
      pieces: [
        { idx: [0], nom: 'The base',
          dit: 'Hosting, domain name, backups, speed. All in your name, from day one.' },
        { idx: [1], nom: 'The front',
          dit: 'What a stranger sees: who you are, what you do, how to reach you. In three seconds.' },
        { idx: [2, 3], nom: 'What you sell',
          dit: 'Your products or services, with payment if you need it, and a form whose messages actually arrive.' },
      ],
      fin: 'You leave with the code, the source files and every access.',
    },
  },

  creneaux: {
    fr: {
      titre: 'On prend vos rendez-vous à votre place',
      intro: 'Votre semaine, vue de dessus. Chaque dalle est un créneau que quelqu’un peut réserver sans vous appeler.',
      pieces: [
        { idx: [0, 1, 3, 4], nom: 'Vos créneaux',
          dit: 'Vous décidez quand vous êtes disponible, et le reste ne s’affiche pas. Les horaires suivent votre agenda existant.' },
        { idx: [5], nom: 'Un rendez-vous pris',
          dit: 'Confirmation immédiate, rappel la veille, et le créneau disparaît des disponibilités. Vous ne rappelez plus personne.' },
        { idx: [2], nom: 'Ce qui reste libre',
          dit: 'Une annulation rouvre le créneau toute seule, et la personne suivante peut le prendre.' },
      ],
      fin: 'Le lien avec l’agenda que vous utilisez déjà est compris dans le chantier.',
    },
    en: {
      titre: 'We take your bookings for you',
      intro: 'Your week, seen from above. Each slab is a slot somebody can book without calling you.',
      pieces: [
        { idx: [0, 1, 3, 4], nom: 'Your slots',
          dit: 'You decide when you are available, and the rest is not shown. The hours follow the calendar you already use.' },
        { idx: [5], nom: 'A booked slot',
          dit: 'Instant confirmation, reminder the day before, and the slot leaves the availability list. You stop calling people back.' },
        { idx: [2], nom: 'What stays open',
          dit: 'A cancellation reopens the slot on its own, and the next person can take it.' },
      ],
      fin: 'The link to the calendar you already use is part of the job.',
    },
  },

  cadre: {
    fr: {
      titre: 'On pose votre identité',
      intro: 'Une identité, ce n’est pas un logo. C’est un bloc, et le cadre de règles qui le tient en place partout où il apparaît.',
      pieces: [
        { idx: [1], nom: 'Votre marque',
          dit: 'Le nom, le ton, les couleurs, les formes. Ce qui fait qu’on vous reconnaît sans lire le nom.' },
        { idx: [0], nom: 'Les règles autour',
          dit: 'Où va le logo, quelle taille, quelle couleur sur quel fond, quelle police pour quoi. Un document que vous gardez.' },
      ],
      fin: 'Vous pouvez vous en servir sans nous, et n’importe quel imprimeur ou graphiste peut reprendre le dossier.',
    },
    en: {
      titre: 'We set your identity',
      intro: 'An identity is not a logo. It is a block, and the frame of rules that holds it in place wherever it shows up.',
      pieces: [
        { idx: [1], nom: 'Your brand',
          dit: 'The name, the tone, the colours, the shapes. What makes you recognisable before the name is read.' },
        { idx: [0], nom: 'The rules around it',
          dit: 'Where the logo goes, what size, which colour on which ground, which typeface for what. A document you keep.' },
      ],
      fin: 'You can use it without us, and any printer or designer can pick the file up.',
    },
  },

  rampe: {
    fr: {
      titre: 'On prépare votre lancement',
      intro: 'Quatre marches avant d’ouvrir. Chacune plus haute que la précédente, et aucune ne se saute.',
      pieces: [
        { idx: [0], nom: 'Le besoin réel',
          dit: 'Ce que vous voulez vendre, à qui, et pourquoi ils achèteraient chez vous plutôt qu’ailleurs.' },
        { idx: [1], nom: 'Le modèle',
          dit: 'Le coût de revient, le prix, le volume qu’il faut pour tenir. Les chiffres qui nourriront votre dossier.' },
        { idx: [2], nom: 'Les fournisseurs',
          dit: 'Qui fabrique, qui livre, qui facture. On cherche avec vous, on compare, on écrit ce qui a été dit.' },
        { idx: [3], nom: 'L’ouverture',
          dit: 'Le minimum qui fonctionne pour ouvrir, sans vous disperser. Le reste attendra que ça tourne.' },
      ],
      fin: 'On ne rédige pas votre business plan à votre place : on réunit avec vous ce qui va le nourrir.',
    },
    en: {
      titre: 'We get your launch ready',
      intro: 'Four steps before you open. Each higher than the last, and none of them skipped.',
      pieces: [
        { idx: [0], nom: 'The real need',
          dit: 'What you want to sell, to whom, and why they would buy from you rather than elsewhere.' },
        { idx: [1], nom: 'The model',
          dit: 'True cost, price, the volume you need to hold. The figures that will feed your file.' },
        { idx: [2], nom: 'The suppliers',
          dit: 'Who makes it, who delivers, who invoices. We search with you, compare, and write down what was agreed.' },
        { idx: [3], nom: 'Opening day',
          dit: 'The minimum that works to open, without scattering yourself. The rest waits until it runs.' },
      ],
      fin: 'We do not write your business plan for you: we gather with you what will feed it.',
    },
  },
};

/* Les libellés de l'explorateur lui-même. */
export const EXPL_MOTS = {
  fr: {
    ouvrir: 'Ouvrir en trois dimensions',
    fermer: 'Fermer',
    tourner: 'Faites glisser pour tourner',
    piece: 'Les pièces',
  },
  en: {
    ouvrir: 'Open in three dimensions',
    fermer: 'Close',
    tourner: 'Drag to turn',
    piece: 'The parts',
  },
};

/* Quelle figure va avec quelle offre. La planche de l'accueil et la page
   des offres nomment les mêmes quatre choses ; il ne doit pas y avoir deux
   univers pour un seul chantier. Les quatre premiers identifiants sont ceux
   de la version PME, les quatre suivants ceux de la version TPE. */
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
