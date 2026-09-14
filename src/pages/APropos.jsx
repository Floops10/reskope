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

/* Les deux portraits sont servis par le site lui-même. Avant, la photo
   venait d'un hébergeur tiers : une requête sortante à chaque visite, une
   dépendance sur laquelle on n'a aucune main, et un seul visage alors
   qu'ils sont deux. */
const PHOTOS = {
  thomy: `${import.meta.env.BASE_URL}thomy.jpg`,
  florian: `${import.meta.env.BASE_URL}florian.jpg`,
};

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CONTENT = {
  fr: {
    metaTitle: 'À propos · Thomy et Florian, le digital vu du terrain',
    metaDesc:
      "Thomy et Florian, les deux personnes derrière Reskope. Une conviction : la productivité se gagne en comprenant ceux qui font le travail. Nos engagements, et ce qui est efficace selon votre taille.",
    eyebrow: 'À propos',
    title: "Terrain d'abord, technique ensuite.",
    lead: "Reskope, c'est une conviction : la productivité ne se décrète pas d'en haut. Elle se gagne en comprenant ceux qui font le travail. On est deux à la porter.",
    duo: [
      { id: 'thomy', nom: 'Thomy', role: 'Stratégie · Modèle · Financement', alt: 'Thomy, cofondatrice de Reskope' },
      { id: 'florian', nom: 'Florian', role: 'Sites · Outils métier · Cartographie', alt: 'Florian Bouchart, cofondateur de Reskope' },
    ],
    hello: "Bonjour, nous c'est Thomy et Florian.",
    bio: [
      "On ne fait pas du conseil à la chaîne. Sur chaque dossier, on s'investit comme s'il s'agissait de notre propre entreprise à faire grandir.",
      "Thomy tient le sens, la stratégie et l'identité : ce que vous voulez faire, le modèle qui tient, et jusqu'à la recherche de financement. Florian tient la technique : les sites, les outils métier, et les logiciels qu'on relie entre eux. Les deux métiers se nourrissent l'un l'autre, et c'est ce qui fait qu'un dossier avance d'un seul tenant.",
      "C'est une passion avant d'être un métier. On passe le temps qu'il faut sur chaque mission, parce qu'on veut un résultat concret et durable, pas une présentation qui fait joli. La qualité passe avant le reste : on ne bâcle jamais un projet pour aller plus vite ou facturer davantage.",
    ],
    principesEyebrow: 'Nos engagements',
    principesTitle: 'Ce sur quoi on ne transige pas.',
    principes: [
      { num: '01', title: "On s'investit comme si c'était la nôtre", text: "Votre entreprise, on la traite comme la nôtre. On s'implique sur la durée, on cherche à la faire grandir, pas à boucler une mission au plus vite." },
      { num: '02', title: 'La qualité passe avant tout', text: "On préfère un chantier vraiment bien fait à trois bâclés. On ne sacrifie jamais le résultat pour aller plus vite ou facturer davantage. Le travail doit tenir dans le temps." },
      { num: '03', title: 'Tout au grand jour', text: "Démarche posée à l'avance, bilan montré avant que vous achetiez. Vous savez toujours où va votre budget, et pourquoi." },
      { num: '04', title: 'Votre autonomie, pas votre dépendance', text: "Le but n'est pas de vous lier à nous. À la fin, vos équipes maîtrisent leurs outils et continuent sans nous. Un système qui tient debout tout seul." },
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
      'Stratégie & modèle économique',
      'Cartographie des process',
      'Priorisation (impact / effort)',
      'Cahier des charges & cadrage (AMOA)',
      'Identité de marque & direction artistique',
      'Automatisation (no-code & code)',
      'Développement web & outils métier',
      'Conduite du changement',
    ],
    ctaH: 'On se parle ?',
    ctaP: "Trente minutes, sans engagement. Vous repartez au minimum avec un regard extérieur honnête sur vos outils.",
    ctaBtn: 'Prendre contact',
  },
  en: {
    metaTitle: 'About · the digital, seen from the ground',
    metaDesc:
      'Thomy and Florian, the two people behind Reskope. One conviction: productivity is won by understanding those who do the work. What we stand for, and what works depending on your size.',
    eyebrow: 'About',
    title: 'Field first, tech second.',
    lead: 'Reskope is a conviction: productivity is not decreed from the top. It is won by understanding those who do the work. There are two of us behind it.',
    duo: [
      { id: 'thomy', nom: 'Thomy', role: 'Strategy · Model · Funding', alt: 'Thomy, co-founder of Reskope' },
      { id: 'florian', nom: 'Florian', role: 'Websites · Business tools · Mapping', alt: 'Florian Bouchart, co-founder of Reskope' },
    ],
    hello: "Hi, we're Thomy and Florian.",
    bio: [
      "We don't do assembly-line consulting. On every engagement, we get involved as if it were our own company to grow.",
      'Thomy holds meaning, strategy and identity: what you want to do, the model that holds, and all the way to raising funds. Florian holds the technical side: the websites, the business tools, and the software we connect to each other. The two trades feed each other, and that is what makes an engagement move as one piece.',
      "It's a passion before it's a job. We spend the time each mission needs, because we want a concrete, lasting result, not a presentation that just looks nice. Quality comes before everything: we never rush a project to go faster or bill more.",
    ],
    principesEyebrow: 'Our commitments',
    principesTitle: 'What we never compromise on.',
    principes: [
      { num: '01', title: 'We commit as if it were ours', text: 'Your company, we treat as our own. We get involved for the long run, we try to grow it, not just close a mission as fast as possible.' },
      { num: '02', title: 'Quality comes first', text: "We'd rather do one job really well than three badly. We never sacrifice the result to go faster or bill more. The work has to last." },
      { num: '03', title: 'Everything out in the open', text: 'Process set in advance, report shown before you buy. You always know where your budget goes, and why.' },
      { num: '04', title: 'Your autonomy, not your dependence', text: "The goal isn't to tie you to us. In the end, your teams master their tools and carry on without us. A system that stands on its own." },
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
      'Strategy & business model',
      'Process mapping',
      'Prioritization (impact / effort)',
      'Specifications & scoping (business analysis)',
      'Brand identity & art direction',
      'Automation (no-code & code)',
      'Web development & business tools',
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
    const masks = root.querySelectorAll('.ahero__photo-mask');
    const img = root.querySelector('.ahero__img');
    if (masks.length && img) {
      /* Les deux portraits se dévoilent l'un après l'autre, pas ensemble :
         l'œil les lit alors comme deux personnes, pas comme une image. */
      gsap.fromTo(masks,
        { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.3, ease: 'power4.inOut', delay: 0.35, stagger: 0.14 });
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
              {/* Deux visages, pas un. Chaque portrait porte son nom et son
                  domaine : c'est la première chose qu'on doit comprendre
                  en arrivant ici. */}
              <div className="ahero__duo">
                {c.duo.map((p) => (
                  <figure className="ahero__pf" key={p.id}>
                    <div className="ahero__photo-mask">
                      <img className="ahero__img" src={PHOTOS[p.id]} alt={p.alt} loading="eager" />
                    </div>
                    <figcaption className="ahero__pf-cap">
                      <span className="ahero__pf-nom">{p.nom}</span>
                      <span className="ahero__pf-role">{p.role}</span>
                    </figcaption>
                  </figure>
                ))}
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
