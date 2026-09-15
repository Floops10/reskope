import Page from '../components/Page';
import HeroFormation from '../components/HeroFormation';
import HomeCinema from '../components/HomeCinema';
import LongPhrase from '../components/LongPhrase';
import PreuvesTpe from '../components/PreuvesTpe';
import CeQuOnFait from '../components/CeQuOnFait';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { HOME_TPE } from '../data/profils';

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
    metaTitle: 'Conseil & ingénierie numérique',
    metaDesc:
      'Reskope cartographie et audite vos outils sur le terrain, salarié par salarié, puis relie, simplifie et construit ce qui manque. Démarche ouverte, gains chiffrés.',

    /* — 1. Hero — */
    /* La première ligne de la page dit deux choses en une : le métier, et
       la version qu'on est en train de lire. Quelqu'un qui arrive par un
       lien partagé ne passe pas par la porte d'entrée et ne sait pas que le
       site existe en deux versions ; il l'apprend ici, en une ligne. */
    heroSur: 'Conseil et ingénierie numérique · version PME, de 10 à 250 personnes',
    heroBascule: 'Vous êtes moins de dix ? Voir la version TPE',
    heroTitle: 'Vos équipes perdent des heures dans leurs outils.',
    /* Le premier écran annonçait un problème sans jamais dire ce qu'on
       vend. Cette ligne le dit, avec les quatre verbes qu'on retrouve
       juste en dessous : personne ne devrait avoir à faire défiler pour
       savoir de quoi il s'agit. */
    heroDit: 'On fait le tour de vos outils, on relie ce qui doit l’être, on construit ce qui manque, et on forme vos équipes.',
    line1: "Des outils qui ne se parlent pas, la même information saisie trois fois, et des abonnements que plus personne n'ouvre. Ça n'apparaît sur aucune facture, et ça vous coûte quand même.",
    line2: "On fait le tour, on range, on relie, et on construit ce qui manque. Vous voyez chaque étape, vous la validez, et vous pouvez vous arrêter à la fin de chacune.",
    mark1: 'saisie trois fois',
    mark2: 'construit',
    closing: 'On remet de l’ordre. Vous gardez les clés.',
    offerings: [
      { title: 'Audit et cartographie', sub: 'Deux à cinq jours sur place. Vous repartez avec le document, quelle que soit la suite.' },
      { title: 'Liaisons entre outils', sub: 'On branche ce que vous avez déjà. Rien à racheter.' },
      { title: 'Outils sur mesure', sub: 'Par petites étapes, que vous validez une par une.' },
      { title: 'Formation et suivi', sub: 'Une demi-journée de prise en main, puis on reste joignable.' },
    ],
    primary: 'Démarrer un audit',
    ghost: 'Le constat',
    sting: 'Deux personnes sur votre dossier. Et rien qui se décide sans vous.',

    /* — 2. Manifesto : la marque en une phrase — */
    longPhrase:
      'Reskope, c’est Thomy et Florian. On est à côté de vous quand vous décidez, et derrière l’écran quand il faut construire.',

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
      'Une vingtaine d’outils qu’on maîtrise, qu’on connecte ou qu’on remplace. En voici quelques-uns ; si le vôtre n’y est pas, c’est justement le métier.',

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
        text: 'On identifie les priorités par impact. On conçoit les connexions, automatisations et outils manquants. Rien n’est imposé : vous validez chaque étape.',
      },
      {
        id: 'deploiement',
        title: 'Déploiement',
        text: 'On construit, on intègre, on teste. Puis on vous rend un système qui tourne et vos équipes qui savent s’en servir.',
      },
    ],

    /* — 7. Engagements — Reskope démarre : aucun chiffre de performance
       client tant qu'il n'y a pas de client. Uniquement des engagements
       tenables et vérifiables. */
    statsEyebrow: 'Nos engagements',
    statsTitle: 'Ce qu’on s’engage à tenir.',
    stats: [
      { label: 'outils qu’on maîtrise et sur lesquels on intervient', display: '20', value: 20, prefix: '', suffix: '', decimals: 0 },
      { label: 'jours maximum entre le premier entretien et la remise du bilan', display: '10', value: 10, prefix: '', suffix: '', decimals: 0 },
      { label: 'de la démarche au grand jour : accès, jalons, livrables', display: '100 %', value: 100, prefix: '', suffix: ' %', decimals: 0 },
      { label: 'bilan garanti : s’il ne vous apporte rien d’exploitable, vous ne le payez pas', display: '0 €', value: null },
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
    metaTitle: 'Digital consulting & engineering',
    metaDesc:
      'Reskope maps and audits your tools on the ground, employee by employee, then connects, simplifies and builds what is missing. Open process, quantified gains.',

    heroSur: 'Digital consulting & engineering · SME version, 10 to 250 people',
    heroBascule: 'Fewer than ten of you? See the small-business version',
    heroTitle: 'Your teams lose hours inside their tools.',
    heroDit: 'We go through every tool, connect what needs connecting, build what is missing, and train your teams.',
    line1: "Tools that don't talk to each other, the same information typed in three times, and subscriptions nobody opens any more. It shows on no invoice, and it costs you anyway.",
    line2: 'We go through everything, tidy up, connect, and build what is missing. You see each step, you approve it, and you can stop at the end of any of them.',
    mark1: 'three times',
    mark2: 'builds',
    closing: 'We put things in order. You keep the keys.',
    offerings: [
      { title: 'Audit and mapping', sub: 'Two to five days on site. You leave with the document, whatever you decide next.' },
      { title: 'Links between tools', sub: 'We plug in what you already have. Nothing to buy again.' },
      { title: 'Tools built for you', sub: 'In small steps, approved one by one.' },
      { title: 'Training and support', sub: 'Half a day of handover, then we stay reachable.' },
    ],
    primary: 'Start an audit',
    ghost: 'The findings',
    sting: 'Two people on your file. And nothing decided without you.',

    longPhrase:
      'Reskope is Thomy and Florian. We are beside you when you decide, and behind the screen when it has to be built.',

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
      "Around twenty tools we master, connect or replace. Here are a few; if yours isn't listed, that's precisely the job.",

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
        text: 'We build, integrate and test. Then we hand back a system that runs, and teams who know how to use it.',
      },
    ],

    statsEyebrow: 'My commitments',
    statsTitle: 'What I commit to.',
    stats: [
      { label: 'tools I master and work on', display: '20', value: 20, prefix: '', suffix: '', decimals: 0 },
      { label: 'days max between the first interview and the report', display: '10', value: 10, prefix: '', suffix: '', decimals: 0 },
      { label: 'of the process in the open: access, milestones, deliverables', display: '100%', value: 100, prefix: '', suffix: '%', decimals: 0 },
      { label: 'guaranteed report: if it gives you nothing actionable, you don’t pay for it', display: '€0', value: null },
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
  const { profil } = useProfil();
  /* Une TPE n'a pas de système d'information à cartographier. On ne
     dédouble pas la page : on superpose les seuls écarts. Tout ce qui
     n'est pas dans HOME_TPE reste identique pour les deux profils. */
  const c = profil === 'tpe' ? { ...CONTENT[lang], ...HOME_TPE[lang] } : CONTENT[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>

      {/* 1 — Hero : titre à gauche, R 3D qui se forme au scroll puis tourne.
             key={lang + profil} : remonte proprement quand la langue OU le
             profil change (sinon le calque réseau du titre se superpose à
             la version sans-serif — le défaut se voyait en basculant de
             PME à TPE, les deux accroches restaient l'une sur l'autre). */}
      <HeroFormation key={lang + profil} c={c} />

      {/* 2 — CE QU'ON FAIT, tout de suite. Avant, il fallait traverser huit
             écrans avant de savoir ce qu'on vend ; celui qui arrive doit
             l'avoir compris en dix secondes. Quatre verbes, quatre volumes
             dessinés dans la langue des livrets, et pas un prix : on ne
             chiffre rien avant que le visiteur sache ce qu'il achète. */}
      <CeQuOnFait key={`fait-${profil}`} />

      {/* 3 — La marque en une phrase (mots révélés au scrub) */}
      <LongPhrase text={c.longPhrase} />

      {/* 3 — En version TPE seulement : les deux chiffres qui posent le
             sujet. La version PME a une page entière pour ça (« Le
             constat »), qui ne vaut rien chez quelqu'un sans outils. */}
      {profil === 'tpe' && <PreuvesTpe />}

      {/* 3 — Traversée caméra 3D : constat → réponse → bascule → offres →
             signature. FIN de la home : le footer (scène de clôture) suit. */}
      <HomeCinema key={`cine-${profil}`} c={c} lang={lang} />

    </Page>
  );
}
