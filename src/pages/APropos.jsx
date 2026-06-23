import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import moiPhoto from '../assets/moi.jpg';

const CONTENT = {
  fr: {
    metaTitle: 'À propos · le digital vu du terrain',
    metaDesc:
      "Florian Bouchart, fondateur de Reskope. Une conviction : la productivité se gagne en comprenant ceux qui font le travail. Mes engagements et ce qui est efficace selon votre taille.",
    eyebrow: 'À propos',
    title: "Terrain d'abord, technique ensuite.",
    lead: "Reskope, c'est une conviction : la productivité ne se décrète pas d'en haut. Elle se gagne en comprenant ceux qui font le travail.",
    photoAlt: 'Florian Bouchart, fondateur de Reskope',
    hello: "Bonjour, moi c'est Florian.",
    bio: [
      "Je ne fais pas du conseil à la chaîne. Pour chaque client, je m'investis comme s'il s'agissait de ma propre entreprise à faire grandir.",
      "C'est une passion avant d'être un métier. Je passe le temps qu'il faut sur chaque mission, parce que je veux un résultat concret et durable, pas une présentation qui fait joli. La qualité passe avant le reste : je ne bâcle jamais un projet pour aller plus vite ou facturer davantage.",
      "Conseil, ingénierie numérique et développement web : trois leviers que je combine pour vous rendre du temps et remettre vos outils au service de vos équipes. C'est dans ce travail concret que je veux m'engager pleinement aujourd'hui.",
    ],
    principesEyebrow: 'Mes engagements',
    principesTitle: 'Ce sur quoi je ne transige jamais.',
    principes: [
      { num: '01', title: "Je m'investis comme si c'était la mienne", text: "Votre entreprise, je la traite comme la mienne. Je m'implique sur la durée, je cherche à la faire grandir, pas à boucler une mission au plus vite." },
      { num: '02', title: 'La qualité passe avant tout', text: "Je préfère un chantier vraiment bien fait à trois bâclés. Je ne sacrifie jamais le résultat pour aller plus vite ou facturer davantage. Le travail doit tenir dans le temps." },
      { num: '03', title: 'Tout au grand jour', text: "Prix affichés, démarche posée à l'avance, bilan montré avant que vous achetiez. Vous savez toujours où va votre budget, et pourquoi." },
      { num: '04', title: 'Votre autonomie, pas votre dépendance', text: "Mon but n'est pas de vous lier à moi. À la fin, vos équipes maîtrisent leurs outils et continuent sans moi. Un système qui tient debout tout seul." },
    ],
    sizeEyebrow: 'Selon nous',
    sizeTitle: 'Ce qui est efficace dépend de votre taille.',
    sizeLead: "Il n'y a pas de stack universelle. Ce qui marche à 15 personnes ne marche pas à 80. Voici notre lecture, par palier.",
    tiers: [
      { range: '5 à 20 pers.', label: 'Petite équipe', principle: '1 à 2 outils centraux, bien maîtrisés.', detail: "À ce stade, la complexité tue la productivité. L'objectif : un seul endroit pour chaque type d'information, et l'automatisation des tâches qui reviennent tous les jours.", wins: ['CRM simplifié', 'Outil de planning partagé', 'Automatisation des relances'] },
      { range: '20 à 80 pers.', label: 'Équipe moyenne', principle: "Connecter l'existant avant d'acheter du neuf.", detail: "Les équipes ont leurs habitudes. Plutôt que d'imposer un nouvel outil, on cartographie ce qui existe et on construit les passerelles qui manquent, sans migration forcée.", wins: ['Plateforme centrale', 'Intégrations entre outils', 'Reporting automatisé'] },
      { range: '80 à 200 pers.', label: 'Entreprise en croissance', principle: 'Segmenter par métier, orchestrer par les données.', detail: "La complexité est réelle et légitime. On la cartographie pôle par pôle, on identifie les doublons entre équipes, et on pose les bases d'une architecture durable.", wins: ['Cartographie par pôle', 'APIs et flux de données', 'Gouvernance des accès'] },
    ],
    skillsEyebrow: 'Compétences',
    skillsTitle: 'Du besoin à la solution.',
    skills: [
      'Recueil du besoin & entretiens',
      'Cartographie des process',
      'Priorisation (impact / effort)',
      'Cahier des charges & cadrage (AMOA)',
      'Automatisation (no-code & code)',
      'Développement web',
      'Conduite du changement',
    ],
  },
  en: {
    metaTitle: 'About · the digital, seen from the ground',
    metaDesc:
      'Florian Bouchart, founder of Reskope. One conviction: productivity is won by understanding those who do the work. What I stand for, and what works depending on your size.',
    eyebrow: 'About',
    title: 'Field first, tech second.',
    lead: 'Reskope is a conviction: productivity is not decreed from the top. It is won by understanding those who do the work.',
    photoAlt: 'Florian Bouchart, founder of Reskope',
    hello: "Hi, I'm Florian.",
    bio: [
      "I don't do assembly-line consulting. For every client, I get involved as if it were my own company to grow.",
      "It's a passion before it's a job. I spend the time each mission needs, because I want a concrete, lasting result, not a presentation that just looks nice. Quality comes before everything: I never rush a project to go faster or bill more.",
      'Consulting, digital engineering and web development: three levers I combine to give you back time and put your tools back at the service of your teams. This concrete work is what I want to fully commit to today.',
    ],
    principesEyebrow: 'My commitments',
    principesTitle: 'What I never compromise on.',
    principes: [
      { num: '01', title: 'I commit as if it were mine', text: "Your company, I treat as my own. I get involved for the long run, I try to grow it, not just close a mission as fast as possible." },
      { num: '02', title: 'Quality comes first', text: "I'd rather do one job really well than three badly. I never sacrifice the result to go faster or bill more. The work has to last." },
      { num: '03', title: 'Everything out in the open', text: 'Prices shown, process set in advance, report shown before you buy. You always know where your budget goes, and why.' },
      { num: '04', title: 'Your autonomy, not your dependence', text: "My goal isn't to tie you to me. In the end, your teams master their tools and carry on without me. A system that stands on its own." },
    ],
    sizeEyebrow: 'In our view',
    sizeTitle: 'What works depends on your size.',
    sizeLead: "There is no universal stack. What works at 15 people doesn't work at 80. Here is our reading, by tier.",
    tiers: [
      { range: '5 to 20 people', label: 'Small team', principle: '1 to 2 core tools, well mastered.', detail: 'At this stage, complexity kills productivity. The goal: a single place for each type of information, and automating the tasks that come back every day.', wins: ['Simplified CRM', 'Shared planning tool', 'Automated follow-ups'] },
      { range: '20 to 80 people', label: 'Mid-size team', principle: 'Connect what exists before buying new.', detail: 'Teams have their habits. Rather than imposing a new tool, we map what exists and build the missing bridges, with no forced migration.', wins: ['Central platform', 'Tool integrations', 'Automated reporting'] },
      { range: '80 to 200 people', label: 'Growing company', principle: 'Segment by function, orchestrate through data.', detail: 'The complexity is real and legitimate. We map it function by function, identify duplicates across teams, and lay the foundations of a durable architecture.', wins: ['Mapping by function', 'APIs and data flows', 'Access governance'] },
    ],
    skillsEyebrow: 'Skills',
    skillsTitle: 'From the need to the solution.',
    skills: [
      'Needs gathering & interviews',
      'Process mapping',
      'Prioritization (impact / effort)',
      'Specifications & scoping (business analysis)',
      'Automation (no-code & code)',
      'Web development',
      'Change management',
    ],
  },
};

export default function APropos() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      <PageHeader eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

      <section className="section">
        <div className="container about__intro">
          <div className="about__photo">
            <img src={moiPhoto} alt={c.photoAlt} />
          </div>
          <Reveal className="about__text">
            <RevealItem as="h2" className="h2">{c.hello}</RevealItem>
            <RevealItem as="p" className="lead">{c.bio[0]}</RevealItem>
            <RevealItem as="p">{c.bio[1]}</RevealItem>
            <RevealItem as="p">{c.bio[2]}</RevealItem>
          </Reveal>
        </div>
      </section>

      {/* MES ENGAGEMENTS */}
      <section className="section section--tint" aria-labelledby="principes-title">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.principesEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2" id="principes-title">{c.principesTitle}</RevealItem>
          </Reveal>
          <Reveal className="manifesto" amount={0.1}>
            {c.principes.map((m) => (
              <RevealItem className="manifesto__item" key={m.num}>
                <span className="manifesto__num">{m.num}</span>
                <h3 className="manifesto__title">{m.title}</h3>
                <p className="manifesto__text">{m.text}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* SELON LA TAILLE */}
      <section className="section" aria-labelledby="size-title">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.sizeEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2" id="size-title">{c.sizeTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.sizeLead}</RevealItem>
          </Reveal>
          <Reveal className="size-tiers" amount={0.1}>
            {c.tiers.map((t) => (
              <RevealItem className="size-tier" key={t.range}>
                <div className="size-tier__head">
                  <span className="size-tier__range">{t.range}</span>
                  <span className="size-tier__label">{t.label}</span>
                </div>
                <p className="size-tier__principle">{t.principle}</p>
                <p className="size-tier__detail">{t.detail}</p>
                <ul className="size-tier__wins">
                  {t.wins.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* COMPÉTENCES */}
      <section className="section section--tint">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.skillsEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.skillsTitle}</RevealItem>
          </Reveal>
          <Reveal className="skills" amount={0.2}>
            {c.skills.map((s) => (
              <RevealItem as="span" className="skill" key={s}>{s}</RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <CTASection />
    </Page>
  );
}
