import Page from '../components/Page';
import HeroFormation from '../components/HeroFormation';
import HomeCinema from '../components/HomeCinema';
import LongPhrase from '../components/LongPhrase';
import { useLang } from '../i18n';

/* HOME — structure calquée sur noomoagency.com, DA réseau Reskope :
   1. Hero (récit volet + R qui se forme et tourne) + offres-réseau
   2. Manifesto (phrase longue, mots révélés au scrub — « At Noomo, we… »)
   3. Services (grandes lignes typographiques — « Services »)
   4. Outils (deux colonnes — « Clients »)
   5. Philosophie (réseau canvas + copy — « Great work… »)
   6. Méthode (3 jalons — slot « testimonials »)
   7. Chiffres (table count-up — « Recognition »)
   8. Explorer (cartes — « Insights »)
   9. CTA géant (« BUT WE'RE HERE NOT TO TALK ABOUT OURSELVES… ») */

const CONTENT = {
  fr: {
    metaTitle: 'Conseil & ingénierie numérique · Reskope',
    metaDesc:
      'Reskope cartographie et audite vos outils sur le terrain, salarié par salarié, puis relie, simplifie et construit ce qui manque. Démarche ouverte, gains chiffrés.',

    /* — 1. Hero — */
    heroTitle: 'Vos équipes perdent des heures dans leurs outils.',
    line1: "Des outils qui ne se parlent pas, des données éparpillées, des usages que personne n'a cartographiés. Un coût invisible — mais bien réel.",
    line2: "Reskope cartographie votre écosystème, puis relie, simplifie et construit ce qui manque : du site à l'outil métier, jusqu'aux automatisations. Au grand jour, jalon après jalon.",
    mark1: 'cartographiés',
    mark2: 'construit',
    closing: 'Cartographiez vos SI. Reprenez le contrôle.',
    offerings: [
      { title: 'Audit numérique', sub: 'On cartographie vos outils et vos usages, salarié par salarié.' },
      { title: 'Refonte d’outils', sub: 'On relie, on simplifie et on remet de l’ordre dans l’écosystème.' },
      { title: 'Automatisation', sub: 'On supprime les tâches répétitives : intégrations, workflows, IA.' },
      { title: 'Alternatives économiques', sub: 'Des outils sobres et justes, à la place des usines à gaz.' },
    ],
    primary: 'Démarrer un audit',
    ghost: 'Le constat',
    sting: 'Un seul interlocuteur. Tout au grand jour.',

    /* — 2. Manifesto : la marque en une phrase — */
    longPhrase:
      'Reskope, c’est un partenaire technique qui cartographie vos outils, les relie, les simplifie, et construit ce qui manque. Moins de friction, plus de temps pour votre vrai métier.',

    /* — 3. Services — */
    svEyebrow: 'Services',
    svTitle: 'Ce qu’on fait, concrètement.',
    services: [
      'Audit numérique',
      'Cartographie du SI',
      'Refonte d’outils',
      'Automatisations & IA',
      'Intégrations entre outils',
      'Sites web & outils métier',
      'Alternatives économiques',
      'Suivi mensuel',
    ],

    /* — 4. Outils — */
    toolsEyebrow: 'Outils maîtrisés',
    toolsTitle: 'Le terrain de jeu.',
    toolsLead:
      'Plus de 40 outils audités, connectés ou remplacés. En voici quelques-uns — et si le vôtre n’y est pas, c’est justement le métier.',

    /* — 5. Philosophie — */
    whyEyebrow: 'Notre différence',
    whyTitle: 'Pas un cabinet qui livre un deck.',
    whyLead:
      'Un partenaire technique qui ouvre le capot, vous montre ce qui ne fonctionne pas, et le répare. Sur le terrain, pas depuis un open space.',
    whyLink: 'En savoir plus',

    /* — 6. Méthode — */
    pillarsEyebrow: 'La méthode',
    pillarsTitle: 'Trois étapes, zéro surprise.',
    pillars: [
      {
        id: 'audit',
        title: 'Audit',
        text: 'On vient chez vous. On observe, on écoute, on cartographie chaque outil et chaque usage réel. En 2 à 5 jours, vous avez une vue complète de ce qui coince.',
      },
      {
        id: 'conception',
        title: 'Conception',
        text: 'On identifie les priorités par impact. On conçoit les connexions, automatisations et outils manquants. Rien n’est imposé : vous validez chaque étape.',
      },
      {
        id: 'deploiement',
        title: 'Déploiement',
        text: 'On construit, on intègre, on teste. Puis on vous rend un système qui tourne et vos équipes qui savent s’en servir.',
      },
    ],

    /* — 7. Chiffres — */
    statsEyebrow: 'Des résultats qui se mesurent',
    statsTitle: 'Le sérieux se prouve avec des chiffres, pas des promesses.',
    stats: [
      { label: 'outils maîtrisés et audités', display: '+40', value: 40, prefix: '+', suffix: '', decimals: 0 },
      { label: 'retour sur investissement moyen constaté', display: '3,5×', value: 3.5, prefix: '', suffix: '×', decimals: 1 },
      { label: 'jours maximum pour la première cartographie complète', display: '10', value: 10, prefix: '', suffix: '', decimals: 0 },
      { label: 'de la démarche au grand jour : accès, jalons, livrables', display: '100 %', value: 100, prefix: '', suffix: ' %', decimals: 0 },
    ],

    /* — 8. Explorer — */
    exploreEyebrow: 'Aller plus loin',
    exploreTitle: 'Explorez à votre rythme.',
    dest: [
      { to: '/pourquoi', label: 'Le constat', desc: 'Le coût caché, et pour qui on agit' },
      { to: '/methode', label: 'La méthode', desc: '5 jalons, en toute transparence' },
      { to: '/offres', label: 'Offres', desc: 'Packages clairs, devis sur-mesure' },
      { to: '/exemple', label: 'Exemple de bilan', desc: 'Un audit réel, détaillé' },
    ],

    /* — 9. CTA géant — */
    ctaStatement:
      'Mais on n’est pas là pour parler de nous. On est là pour parler de vous, vos équipes, vos outils et votre temps.',
    ctaSub: 'Un premier échange de 30 minutes, sans engagement. On regarde vos outils, et on vous dit franchement s’il y a quelque chose à faire.',
    ctaBtn: 'Parlons de vos outils',
  },

  en: {
    metaTitle: 'Digital consulting & engineering · Reskope',
    metaDesc:
      'Reskope maps and audits your tools on the ground, employee by employee, then connects, simplifies and builds what is missing. Open process, quantified gains.',

    heroTitle: 'Your teams lose hours inside their tools.',
    line1: "Tools that don't talk to each other, scattered data, usage no one has mapped. A hidden cost — but a very real one.",
    line2: 'Reskope maps your ecosystem, then connects, simplifies and builds what is missing: from websites to business tools and automations. In the open, milestone by milestone.',
    mark1: 'mapped',
    mark2: 'builds',
    closing: 'Map your systems. Take back control.',
    offerings: [
      { title: 'Digital audit', sub: "We map your tools and how they're really used, person by person." },
      { title: 'Tool redesign', sub: 'We connect, simplify and put your ecosystem back in order.' },
      { title: 'Automation', sub: 'We remove repetitive work: integrations, workflows, AI.' },
      { title: 'Affordable alternatives', sub: 'Lean, honest tools instead of bloated all-in-ones.' },
    ],
    primary: 'Start an audit',
    ghost: 'The findings',
    sting: 'One partner. Everything in the open.',

    longPhrase:
      'Reskope is a technical partner who maps your tools, connects them, simplifies them, and builds what is missing. Less friction, more time for your real work.',

    svEyebrow: 'Services',
    svTitle: 'What we actually do.',
    services: [
      'Digital audit',
      'Systems mapping',
      'Tool redesign',
      'Automations & AI',
      'Tool integrations',
      'Websites & business tools',
      'Affordable alternatives',
      'Monthly retainer',
    ],

    toolsEyebrow: 'Tools we master',
    toolsTitle: 'The playing field.',
    toolsLead:
      "40+ tools audited, connected or replaced. Here are a few — and if yours isn't listed, that's precisely the job.",

    whyEyebrow: 'Our difference',
    whyTitle: 'Not a firm that delivers a deck.',
    whyLead:
      'A technical partner who opens the hood, shows you what isn’t working, and fixes it. On the ground, not from an open-plan office.',
    whyLink: 'Learn more',

    pillarsEyebrow: 'The method',
    pillarsTitle: 'Three steps, zero surprises.',
    pillars: [
      {
        id: 'audit',
        title: 'Audit',
        text: 'We come to you. We observe, listen, and map every tool and every real workflow. In 2 to 5 days, you have a complete picture of what is getting in the way.',
      },
      {
        id: 'conception',
        title: 'Design',
        text: 'We identify priorities by impact. We design the missing connections, automations and tools. Nothing is imposed: you validate every step.',
      },
      {
        id: 'deploiement',
        title: 'Deployment',
        text: 'We build, integrate and test. Then we hand back a system that runs — and teams who know how to use it.',
      },
    ],

    statsEyebrow: 'Results that can be measured',
    statsTitle: 'Seriousness is proven with numbers, not promises.',
    stats: [
      { label: 'tools mastered and audited', display: '+40', value: 40, prefix: '+', suffix: '', decimals: 0 },
      { label: 'average return on investment observed', display: '3.5×', value: 3.5, prefix: '', suffix: '×', decimals: 1 },
      { label: 'days max for the first complete mapping', display: '10', value: 10, prefix: '', suffix: '', decimals: 0 },
      { label: 'of the process in the open: access, milestones, deliverables', display: '100%', value: 100, prefix: '', suffix: '%', decimals: 0 },
    ],

    exploreEyebrow: 'Go further',
    exploreTitle: 'Explore at your own pace.',
    dest: [
      { to: '/pourquoi', label: 'The findings', desc: 'The hidden cost, and who we act for' },
      { to: '/methode', label: 'The method', desc: '5 milestones, in full transparency' },
      { to: '/offres', label: 'Offers', desc: 'Clear scope, custom quotes' },
      { to: '/exemple', label: 'Example report', desc: 'A real, detailed audit' },
    ],

    ctaStatement:
      "But we're not here to talk about us. We're here to talk about you, your teams, your tools and your time.",
    ctaSub: 'A first 30-minute conversation, no strings attached. We look at your tools and tell you frankly if there is something worth doing.',
    ctaBtn: 'Talk about your tools',
  },
};

export default function Home() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>

      {/* 1 — Hero : titre à gauche, R 3D qui se forme au scroll puis tourne.
             key={lang} : remonte proprement au changement de langue (sinon le
             calque réseau du titre se superpose à la version sans-serif). */}
      <HeroFormation key={lang} c={c} />

      {/* 2 — La marque en une phrase (mots révélés au scrub) */}
      <LongPhrase text={c.longPhrase} />

      {/* 3 — Traversée caméra 3D : constat → réponse → bascule → offres →
             signature. FIN de la home : le footer (scène de clôture) suit. */}
      <HomeCinema c={c} lang={lang} />

    </Page>
  );
}
