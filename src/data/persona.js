/* ════════════════════════════════════════════════════════════
   LE PERSONA — la seule personne pour qui ce site existe.

   Tout le reste du site se lit à travers lui. Une section qui ne répond à
   aucune de ses questions n'a rien à faire sur une page, quelle que soit
   la qualité de son animation.

   Ce portrait est une HYPOTHÈSE de travail, pas une vérité : il vient de
   ce que Reskope sait aujourd'hui (un prospect réel qui veut faire relire
   son business plan, le réseau de Thomy, les entreprises du beau-père et
   de Zohra). Il sera réécrit après les premiers entretiens de discovery,
   et le site avec lui.
   ════════════════════════════════════════════════════════════ */

export const PERSONA = {
  qui: 'Le dirigeant qui s’apprête à engager de l’argent',
  ou: 'Valenciennes, Lille et les Hauts-de-France',

  /* Les trois situations qui l'amènent. Ce sont les trois portes d'entrée
     du site, dans ses mots à lui. */
  situations: {
    idee: 'J’ai une idée, et je n’en ai parlé qu’à mes proches.',
    clients: 'Je fais autant de devis qu’avant, et j’en signe moins.',
    dossier: 'Mon rendez-vous à la banque approche, et je ne sais pas si mon dossier tient.',
  },

  /* Ce qu'il cherche en arrivant, dans l'ordre où il se le demande. Chaque
     page y répond dans cet ordre. */
  questions: [
    'Est-ce que c’est pour moi ?',
    'Concrètement, qu’est-ce que vous faites ?',
    'Combien de temps ça me prend, à moi ?',
    'Qu’est-ce que j’ai entre les mains à la fin ?',
    'Combien ça coûte ?',
    'Pourquoi vous faire confiance ?',
    'Comment on commence ?',
  ],

  /* Ce qu'il craint. Les réponses sont écrites avant qu'il pose la question. */
  craintes: [
    'Payer un consultant pour un rapport qu’il ne lira pas.',
    'Qu’on dérange ses clients, ou qu’on les lui fasse perdre.',
    'Y passer un temps qu’il n’a pas.',
    'Qu’on lui vende autre chose que ce qu’il est venu chercher.',
  ],

  /* Comment il lit : sur son téléphone, entre deux rendez-vous. Il ne lit
     pas les paragraphes, il lit la première phrase et décide s'il continue. */
  lecture: 'Mobile d’abord, peu de temps, la première phrase décide du reste.',

  /* Les mots qu'il emploie. Le vocabulaire de méthode reste sur la page
     « Comment ça se passe », où il rassure ceux qui le connaissent. */
  mots: {
    discovery: 'aller voir vos clients',
    persona: 'le portrait de vos vrais clients',
    hypothese: 'ce que vous croyez, et qu’on va vérifier',
    test: 'un essai qui coûte peu',
    sprint: 'une semaine de travail, avec un point le vendredi',
  },
};
