import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import MorphTitle from '../components/MorphTitle';
import Tilt from '../components/Tilt';
import Net3D from '../components/Net3D';
import HeroNetwork from '../components/HeroNetwork';
import { GLYPH_SHAPES } from '../lib/net3d';
import Stagger from '../components/Stagger';
import { Reveal, RevealItem } from '../components/Reveal';
import { gsap, SplitText, ScrollTrigger, useGSAP } from '../lib/gsap';
import { useLang } from '../i18n';

/* À PROPOS — « LE PORTRAIT » (v3, refonte entière).
   1. HERO intégré plein écran : titre morphing (police réseau au survol),
      PHOTO révélée par balayage + parallaxe, glyphe 3D, fond réseau vivant.
   2. LE RÉCIT : « Bonjour, moi c'est Florian. » géant + la bio révélée
      LIGNE À LIGNE, entre les guillemets « » de la marque qui dérivent.
   3. LES ENGAGEMENTS = grandes lignes typographiques masquées (Noomo).
   4. LES PALIERS = cartes rideau + glyphe réseau 3D + tilt.
   5. LES COMPÉTENCES = nœuds en cascade.
   6. Clôture personnelle. */

const PHOTO = 'https://www.image2url.com/r2/default/images/1782253442600-884214d2-7945-4d3c-b79f-6b7586efd15b.png';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      { num: '03', title: 'Tout au grand jour', text: "Démarche posée à l'avance, bilan montré avant que vous achetiez. Vous savez toujours où va votre budget, et pourquoi." },
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
    ctaH: 'On se parle ?',
    ctaP: "Trente minutes, sans engagement. Vous repartez au minimum avec un regard extérieur honnête sur vos outils.",
    ctaBtn: 'Prendre contact',
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
      { num: '03', title: 'Everything out in the open', text: 'Process set in advance, report shown before you buy. You always know where your budget goes, and why.' },
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
    ctaH: 'Shall we talk?',
    ctaP: 'Thirty minutes, no strings attached. At the very least you leave with an honest outside look at your tools.',
    ctaBtn: 'Get in touch',
  },
};

export default function APropos() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const pageRef = useRef(null);

  useGSAP(() => {
    if (reduced()) return;
    const root = pageRef.current;

    /* HERO : cascade d'entrée + PHOTO révélée par balayage + parallaxe */
    gsap.from(root.querySelectorAll('.ahero__reveal'), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.15,
    });
    const mask = root.querySelector('.ahero__photo-mask');
    const img = root.querySelector('.ahero__img');
    if (mask && img) {
      gsap.fromTo(mask,
        { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.3, ease: 'power4.inOut', delay: 0.35 });
      /* parallaxe UNIQUEMENT vers le bas : le visage reste toujours cadré */
      gsap.fromTo(img, { yPercent: 0, scale: 1.06 }, {
        yPercent: 8, scale: 1, ease: 'none',
        scrollTrigger: { trigger: root.querySelector('.ahero'), start: 'top top', end: 'bottom top', scrub: true },
      });
    }

    /* LE RÉCIT : bio révélée LIGNE À LIGNE + guillemets en dérive */
    let splits = [];
    root.querySelectorAll('.astory__p').forEach((p) => {
      try {
        const sp = new SplitText(p, { type: 'lines', mask: 'lines' });
        splits.push(sp);
        gsap.from(sp.lines, {
          yPercent: 110, duration: 0.85, ease: 'power4.out', stagger: 0.07,
          scrollTrigger: { trigger: p, start: 'top 84%' },
        });
      } catch { /* fallback : reveal simple */ }
    });
    const q1 = root.querySelector('.astory__quote--open');
    const q2 = root.querySelector('.astory__quote--close');
    if (q1 && q2) {
      gsap.to(q1, { y: -70, ease: 'none', scrollTrigger: { trigger: root.querySelector('.astory'), start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to(q2, { y: 60, ease: 'none', scrollTrigger: { trigger: root.querySelector('.astory'), start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    /* LES ENGAGEMENTS : chaque grande ligne monte derrière son masque,
       puis son texte se dévoile — et repart si on remonte */
    root.querySelectorAll('.serment').forEach((el) => {
      const row = el.querySelector('.serment__row');
      const text = el.querySelector('.serment__text');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 84%', toggleActions: 'play none none reverse' },
      });
      tl.fromTo(row, { yPercent: 120 }, { yPercent: 0, duration: 0.85, ease: 'power4.out' }, 0)
        .fromTo(text, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.28);
    });

    /* LES PALIERS : entrée rideau (le langage des cartes du site) */
    const cards = root.querySelectorAll('.about-tiers .tgt');
    if (cards.length) {
      gsap.set(cards, { clipPath: 'inset(0% 0% 100% 0% round 18px)', y: 60, autoAlpha: 0, filter: 'blur(9px)' });
      cards.forEach((card, i) => {
        const inner = card.querySelectorAll('.tgt__glyph, .tgt__size, .tgt__title, .about-tier__principle, .tgt__desc, .about-tier__wins');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.querySelector('.about-tiers'), start: 'top 80%' },
          delay: i * 0.13,
        });
        tl.to(card, { clipPath: 'inset(0% 0% 0% 0% round 18px)', y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 1, ease: 'power4.out' }, 0)
          .from(inner, { y: 24, autoAlpha: 0, duration: 0.65, ease: 'power3.out', stagger: 0.06 }, 0.18)
          .set(card, { clearProps: 'clipPath,filter,willChange' });
      });
    }

    return () => splits.forEach((s) => s.revert());
  }, { scope: pageRef, dependencies: [lang] });

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      <div ref={pageRef}>
        {/* 1 — HERO intégré : titre morphing + PHOTO révélée + fond vivant */}
        <header className="ahero" key={lang}>
          <div className="ahero__bg" aria-hidden="true">
            <HeroNetwork />
            <div className="hero2__grain" />
          </div>
          <div className="container ahero__grid">
            <div className="ahero__copy">
              <p className="eyebrow eyebrow--index ahero__reveal">{c.eyebrow}</p>
              <div className="ahero__reveal">
                <MorphTitle as="h1" text={c.title} textClass="ahero__title" intro />
              </div>
              <p className="lead ahero__lead ahero__reveal">{c.lead}</p>
            </div>
            <div className="ahero__viz ahero__reveal">
              <span className="ahero__glyph" aria-hidden="true">
                <Net3D shape={GLYPH_SHAPES[1]} size={120} speed={0.6} tiltX={0.45} nodeR={2.8} />
              </span>
              <div className="ahero__photo-mask">
                <img className="ahero__img" src={PHOTO} alt={c.photoAlt} loading="eager" />
              </div>
            </div>
          </div>
        </header>

        {/* 2 — LE RÉCIT : la bio, ligne à ligne, entre les « » de la marque */}
        <section className="astory" aria-label={c.hello}>
          <span className="astory__quote astory__quote--open" aria-hidden="true">«</span>
          <span className="astory__quote astory__quote--close" aria-hidden="true">»</span>
          <div className="container astory__inner">
            <Reveal>
              <RevealItem>
                <MorphTitle as="h2" text={c.hello} textClass="astory__hello" />
              </RevealItem>
            </Reveal>
            <div className="astory__cols">
              {c.bio.map((p, i) => (
                <p key={i} className="astory__p">{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* MES ENGAGEMENTS : grandes lignes typographiques */}
        <section className="section section--tint" aria-labelledby="principes-title">
          <div className="container">
            <Reveal className="section__head">
              <RevealItem as="p" className="eyebrow eyebrow--index">{c.principesEyebrow}</RevealItem>
              <RevealItem>
                <MorphTitle as="h2" text={c.principesTitle} textClass="h2" id="principes-title" />
              </RevealItem>
            </Reveal>
            <div className="serments">
              {c.principes.map((m) => (
                <div className="serment" key={m.num}>
                  <div className="serment__mask">
                    <div className="serment__row">
                      <span className="serment__num">{m.num}</span>
                      <span className="serment__node" aria-hidden="true" />
                      <h3 className="serment__title">{m.title}</h3>
                    </div>
                  </div>
                  <p className="serment__text">{m.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SELON LA TAILLE : cartes rideau + glyphes réseau 3D */}
        <section className="section" aria-labelledby="size-title">
          <div className="container">
            <Reveal className="section__head">
              <RevealItem as="p" className="eyebrow eyebrow--index">{c.sizeEyebrow}</RevealItem>
              <RevealItem>
                <MorphTitle as="h2" text={c.sizeTitle} textClass="h2" id="size-title" />
              </RevealItem>
              <RevealItem as="p" className="lead">{c.sizeLead}</RevealItem>
            </Reveal>
            <div className="tgt-grid about-tiers">
              {c.tiers.map((t, i) => (
                <Tilt className="tgt" key={t.range} max={7}>
                  <span className="tgt__glyph" aria-hidden="true">
                    <Net3D shape={GLYPH_SHAPES[i % GLYPH_SHAPES.length]} size={72} speed={0.8} tiltX={0.5} nodeR={2.6} />
                  </span>
                  <span className="tgt__size">{t.range}</span>
                  <h3 className="tgt__title">{t.label}</h3>
                  <p className="about-tier__principle">{t.principle}</p>
                  <p className="tgt__desc">{t.detail}</p>
                  <ul className="about-tier__wins">
                    {t.wins.map((w) => <li key={w}>{w}</li>)}
                  </ul>
                </Tilt>
              ))}
            </div>
          </div>
        </section>

        {/* COMPÉTENCES : la chaîne de nœuds */}
        <section className="section section--tint">
          <div className="container">
            <Reveal className="section__head">
              <RevealItem as="p" className="eyebrow eyebrow--index">{c.skillsEyebrow}</RevealItem>
              <RevealItem>
                <MorphTitle as="h2" text={c.skillsTitle} textClass="h2" />
              </RevealItem>
            </Reveal>
            <div className="skillpath">
              <Stagger className="skillpath__chips" sel=".skillchip" stagger={0.07} y={26}>
                {c.skills.map((s) => (
                  <span className="skillchip" key={s}>
                    <i aria-hidden="true" />
                    {s}
                  </span>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        {/* Clôture personnelle */}
        <section className="section">
          <div className="container">
            <div className="direct-band">
              <div className="direct-band__inner">
                <div className="direct-band__text">
                  <h2 className="direct-band__title">{c.ctaH}</h2>
                  <p>{c.ctaP}</p>
                </div>
                <Link to="/contact" className="btn btn--primary direct-band__btn" data-cursor-label={c.ctaBtn}>
                  {c.ctaBtn}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
