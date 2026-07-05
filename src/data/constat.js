/* ============================================================
   LE CONSTAT — chiffres de l'étude de marché, TOUS sourcés.
   Chaque entrée : le chiffre, ce qu'il veut dire, la source
   cliquable (URL directe), et le détail du calcul quand on
   dérive quelque chose nous-mêmes (affiché dans l'infobulle i).
   ============================================================ */

export const CONSTAT = {
  fr: {
    intro: {
      eyebrow: 'Le chiffre qui résume tout',
      value: 47,
      suffix: ' %',
      display: '47 %',
      title: "de la semaine part dans les e-mails et la recherche d'information.",
      caption:
        'Près de la moitié du temps de travail d’un salarié « de bureau » ne produit rien : il fait circuler de l’information au lieu de l’utiliser.',
      legend: [
        { label: 'Gestion des e-mails', v: '28 %', tone: 'a' },
        { label: 'Recherche d’information', v: '19 %', tone: 'b' },
        { label: 'Travail réel', v: '53 %', tone: 'rest' },
      ],
      source: {
        label: 'McKinsey Global Institute · The Social Economy (2012)',
        url: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
      },
      calc: '28 % (gestion des e-mails) + 19 % (recherche d’information et de collègues) = 47 %. Sur une semaine de 35 h, cela représente ≈ 16,5 h par personne.',
      calcLabel: 'Voir le calcul',
    },
    cards: [
      {
        id: 'wow',
        kicker: 'Le travail autour du travail',
        value: 58, suffix: ' %', display: '58 %', decimals: 0,
        title: 'du temps passe à coordonner le travail. Pas à le faire.',
        desc: 'Réunions de statut, relances, mises à jour d’outils, chasse aux validations : le « work about work » dévore la majorité de la semaine — et il ne figure dans aucune fiche de poste.',
        source: {
          label: 'Asana · Anatomy of Work Global Index 2023',
          url: 'https://asana.com/resources/anatomy-of-work',
        },
        calc: null,
        chart: 'split',
        theme: 'cream',
        chartData: { a: 58, b: 42, la: 'Coordination', lb: 'Vrai métier' },
      },
      {
        id: 'dup',
        kicker: 'Le travail en double',
        value: 209, suffix: ' h', display: '209 h', decimals: 0,
        title: 'par an et par personne, perdues à refaire un travail déjà fait.',
        desc: 'Ressaisies entre outils, documents recréés faute de les retrouver, informations redemandées : chaque année, des semaines entières partent à reproduire l’existant.',
        source: {
          label: 'Asana · Anatomy of Work Global Index 2023',
          url: 'https://asana.com/resources/anatomy-of-work',
        },
        calc: '209 h ÷ 35 h ≈ 6 semaines de travail par an. Réparti sur ≈ 47 semaines travaillées : ≈ 4,4 h par semaine et par personne.',
        chart: 'weeks',
        theme: 'indigo',
        chartData: { total: 47, filled: 6, unit: 'semaines' },
      },
      {
        id: 'toggle',
        kicker: 'La taxe de bascule',
        value: 1200, suffix: '', display: '1 200', decimals: 0,
        title: 'bascules entre applications, chaque jour, par personne.',
        desc: 'Changer d’application n’est jamais gratuit : le cerveau se réoriente à chaque bascule. Près de 4 h par semaine s’évaporent dans ces allers-retours invisibles.',
        source: {
          label: 'Harvard Business Review (2022) · le « toggle tax »',
          url: 'https://hbr.org/2022/08/how-much-time-and-energy-do-we-waste-toggling-between-applications',
        },
        calc: '≈ 4 h par semaine mesurées par l’étude × 47 semaines travaillées ≈ 188 h par an, soit ≈ 5 semaines de 35 h. Valorisé à 30 € chargés de l’heure : ≈ 5 600 € par an et par personne.',
        chart: 'spark',
        theme: 'ink',
        chartData: {},
      },
      {
        id: 'apps',
        kicker: 'L’empilement d’outils',
        value: 93, suffix: '', display: '93', decimals: 0,
        title: 'applications déployées en moyenne par entreprise.',
        desc: 'Chaque outil ajouté promet un gain. Sans vue d’ensemble, il ajoute surtout un silo, une licence, des doublons — et encore plus de bascules.',
        source: {
          label: 'Okta · Businesses at Work 2024',
          url: 'https://www.okta.com/reports/businesses-at-work/',
        },
        calc: 'Moyenne mesurée sur le parc clients Okta (ETI et grands comptes). Dans une PME française, on compte plus souvent 15 à 40 outils : le mécanisme de dispersion est identique, à plus petite échelle.',
        chart: 'grid',
        theme: 'cream',
        chartData: { total: 93 },
      },
    ],
    sourceLabel: 'Source',
    calcLabel: 'Comment ce chiffre est calculé',
  },

  en: {
    intro: {
      eyebrow: 'The number that says it all',
      value: 47,
      suffix: '%',
      display: '47%',
      title: 'of the workweek goes into email and hunting for information.',
      caption:
        'Nearly half of a knowledge worker’s time produces nothing: it moves information around instead of using it.',
      legend: [
        { label: 'Managing email', v: '28%', tone: 'a' },
        { label: 'Searching for information', v: '19%', tone: 'b' },
        { label: 'Actual work', v: '53%', tone: 'rest' },
      ],
      source: {
        label: 'McKinsey Global Institute · The Social Economy (2012)',
        url: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
      },
      calc: '28% (managing email) + 19% (searching for information and colleagues) = 47%. On a 35-hour week, that is ≈ 16.5 hours per person.',
      calcLabel: 'See the math',
    },
    cards: [
      {
        id: 'wow',
        kicker: 'Work about work',
        value: 58, suffix: '%', display: '58%', decimals: 0,
        title: 'of the time goes into coordinating work. Not doing it.',
        desc: 'Status meetings, follow-ups, tool updates, chasing approvals: “work about work” eats most of the week — and appears in no job description.',
        source: {
          label: 'Asana · Anatomy of Work Global Index 2023',
          url: 'https://asana.com/resources/anatomy-of-work',
        },
        calc: null,
        chart: 'split',
        theme: 'cream',
        chartData: { a: 58, b: 42, la: 'Coordination', lb: 'Real work' },
      },
      {
        id: 'dup',
        kicker: 'Duplicated work',
        value: 209, suffix: 'h', display: '209h', decimals: 0,
        title: 'per person, per year, lost redoing work that was already done.',
        desc: 'Re-entering data between tools, recreating documents that couldn’t be found, asking again for the same information: entire weeks go into reproducing what exists.',
        source: {
          label: 'Asana · Anatomy of Work Global Index 2023',
          url: 'https://asana.com/resources/anatomy-of-work',
        },
        calc: '209h ÷ 35h ≈ 6 working weeks per year. Spread over ≈ 47 worked weeks: ≈ 4.4h per week per person.',
        chart: 'weeks',
        theme: 'indigo',
        chartData: { total: 47, filled: 6, unit: 'weeks' },
      },
      {
        id: 'toggle',
        kicker: 'The toggle tax',
        value: 1200, suffix: '', display: '1,200', decimals: 0,
        title: 'switches between applications, every day, per person.',
        desc: 'Switching apps is never free: the brain reorients after every toggle. Nearly 4 hours a week evaporate in these invisible back-and-forths.',
        source: {
          label: 'Harvard Business Review (2022) · the “toggle tax”',
          url: 'https://hbr.org/2022/08/how-much-time-and-energy-do-we-waste-toggling-between-applications',
        },
        calc: '≈ 4h per week measured by the study × 47 worked weeks ≈ 188h per year — about 5 full 35-hour weeks. At a loaded cost of €30/h: ≈ €5,600 per person per year.',
        chart: 'spark',
        theme: 'ink',
        chartData: {},
      },
      {
        id: 'apps',
        kicker: 'Tool sprawl',
        value: 93, suffix: '', display: '93', decimals: 0,
        title: 'applications deployed on average per company.',
        desc: 'Every added tool promises a gain. Without an overview, it mostly adds a silo, a license, duplicates — and even more toggling.',
        source: {
          label: 'Okta · Businesses at Work 2024',
          url: 'https://www.okta.com/reports/businesses-at-work/',
        },
        calc: 'Average measured across Okta’s customer base (mid-market and enterprise). A French SME more often runs 15 to 40 tools: the sprawl mechanism is identical, at a smaller scale.',
        chart: 'grid',
        theme: 'cream',
        chartData: { total: 93 },
      },
    ],
    sourceLabel: 'Source',
    calcLabel: 'How this number is calculated',
  },
};
