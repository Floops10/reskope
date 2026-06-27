import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { HeroLogo } from '../components/Logo';
import SceneHook from '../components/SceneHook';
import NetField from '../components/NetField';
import CTASection from '../components/CTASection';
import Marked from '../components/Marked';
import RiseText from '../components/RiseText';
import { Reveal, RevealItem } from '../components/Reveal';
import { useGSAP } from '../lib/gsap';
import { heroIntro } from '../animations/hero';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useLang } from '../i18n';

const CONTENT = {
  fr: {
    metaTitle: 'Conseil & ingénierie numérique',
    metaDesc:
      'Reskope cartographie et audite vos outils sur le terrain, salarié par salarié, puis relie, simplifie et construit ce qui manque. Démarche ouverte, gains chiffrés.',
    eyebrow: 'Audit & cartographie numérique',
    heroTitle: 'Vos équipes perdent des heures dans leurs outils.',
    moment2: 'On cartographie. On relie. On simplifie.',
    moment3: 'On construit ce qui manque.',
    line1: "Des outils qui ne se parlent pas, des informations éparpillées, des usages que personne n'a vraiment cartographiés. Le coût ne se voit pas sur une facture, mais il est bien réel.",
    line2: "Reskope cartographie votre écosystème numérique, outil par outil et usage par usage. Puis on relie, on simplifie et on construit ce qui manque : du site web à l'outil métier, jusqu'aux automatisations. Toujours au grand jour, jalon après jalon.",
    sub: "On cartographie vos outils et vos usages, on relie, on simplifie, on construit ce qui manque. Toujours au grand jour, jalon après jalon.",
    mark1: 'cartographiés',
    mark2: 'construit',
    markSub: 'cartographie',
    startEyebrow: 'Par où commencer',
    startTitle: 'Explorez à votre rythme.',
    primary: 'Parler de vos outils',
    ghost: 'Le constat',
    dest: [
      { to: '/pourquoi', label: 'Le constat', desc: "Le coût caché, et pour qui on agit" },
      { to: '/methode', label: 'La méthode', desc: '5 jalons, en toute transparence' },
      { to: '/offres', label: 'Offres', desc: 'Packages clairs, devis sur-mesure' },
      { to: '/exemple', label: 'Exemple de bilan', desc: 'Un audit réel, détaillé' },
    ],
    ecoEyebrow: 'Numérique responsable',
    ecoTitle: "Simplifier vos outils, c'est aussi consommer moins.",
    ecoLead: "Moins d'outils, moins de serveurs, moins de doublons. L'angle écologique de notre démarche a sa propre page.",
    ecoBtn: "Découvrir l'angle écologique",
  },
  en: {
    metaTitle: 'Consulting & digital engineering',
    metaDesc:
      'Reskope maps and audits your tools on the ground, employee by employee, then connects, simplifies and builds what is missing. Open process, quantified gains.',
    eyebrow: 'Digital audit & mapping',
    heroTitle: 'Your teams lose hours inside their tools.',
    moment2: 'We map. We connect. We simplify.',
    moment3: 'We build what is missing.',
    line1: "Tools that don't talk to each other, scattered information, usage no one has really mapped. The cost is hidden, but it is very real.",
    line2: 'Reskope maps your digital ecosystem, tool by tool and use by use. Then we connect, simplify and build what is missing: from websites to business tools and automations. Always in the open, milestone by milestone.',
    sub: "We map your tools and how they're used, we connect, simplify and build what is missing. Always in the open, milestone by milestone.",
    mark1: 'mapped',
    mark2: 'build',
    markSub: 'map',
    startEyebrow: 'Where to start',
    startTitle: 'Explore at your own pace.',
    primary: 'Talk about your tools',
    ghost: 'The findings',
    dest: [
      { to: '/pourquoi', label: 'The findings', desc: 'The hidden cost, and who we act for' },
      { to: '/methode', label: 'The method', desc: '5 milestones, in full transparency' },
      { to: '/offres', label: 'Offers', desc: 'Clear scope, custom quotes' },
      { to: '/exemple', label: 'Example report', desc: 'A real, detailed audit' },
    ],
    ecoEyebrow: 'Responsible digital',
    ecoTitle: 'Simplifying your tools also means consuming less.',
    ecoLead: 'Fewer tools, fewer servers, fewer duplicates. The ecological angle of our approach has its own page.',
    ecoBtn: 'Explore the ecological angle',
  },
};

function DestGrid({ dest }) {
  return (
    <div className="dest-grid">
      {dest.map((d, i) => (
        <Link key={d.to} to={d.to} className="dest-card">
          <span className="dest-card__num">{`0${i + 1}`}</span>
          <span className="dest-card__label">{d.label}</span>
          <span className="dest-card__desc">{d.desc}</span>
          <span className="dest-card__arrow" aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}

function HeroPinned({ c }) {
  const heroRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const cueRef = useRef(null);
  useGSAP(
    () => heroIntro({ eyebrow: eyebrowRef.current, title: titleRef.current, cue: cueRef.current }),
    { scope: heroRef }
  );
  return (
    <header className="hero hero--pinned" ref={heroRef} id="top">
      <div className="container hero__grid">
        <div className="hero__scroller">
          <div className="hero__step hero__intro">
            <p className="eyebrow" ref={eyebrowRef}>{c.eyebrow}</p>
            <h1 className="display" ref={titleRef}>{c.heroTitle}</h1>
          </div>

          <Reveal className="hero__step" amount={0.6}>
            <RevealItem as="p" className="hero__line">
              <Marked text={c.line1} word={c.mark1} />
            </RevealItem>
          </Reveal>

          <Reveal className="hero__step" amount={0.6}>
            <RevealItem as="p" className="hero__line">
              <Marked text={c.line2} word={c.mark2} />
            </RevealItem>
          </Reveal>

          <Reveal className="hero__step hero__step--final" amount={0.4}>
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.startEyebrow}</RevealItem>
            <RevealItem>
              <DestGrid dest={c.dest} />
            </RevealItem>
          </Reveal>
        </div>

        <div className="hero__sticky" aria-hidden="true">
          <HeroLogo containerRef={heroRef} mode="scroll" />
        </div>
      </div>
      <div className="hero__cue" ref={cueRef} aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </header>
  );
}

function HeroCompact({ c }) {
  const scope = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const linksRef = useRef(null);
  useGSAP(
    () =>
      heroIntro({
        eyebrow: eyebrowRef.current,
        title: titleRef.current,
        extras: [subRef.current, linksRef.current],
      }),
    { scope }
  );
  return (
    <header className="hero hero--compact" id="top" ref={scope}>
      <div className="hero__bg-net" aria-hidden="true">
        <NetField variant="cluster" />
      </div>
      <div className="container">
        <div className="hero__copy">
          <div className="hero__compact-logo" aria-hidden="true">
            <HeroLogo mode="mount" />
          </div>
          <p className="eyebrow" ref={eyebrowRef}>{c.eyebrow}</p>
          <h1 className="display" ref={titleRef}>{c.heroTitle}</h1>
          <p className="lead hero__sub" ref={subRef}>
            <Marked text={c.sub} word={c.markSub} />
          </p>
          <div className="hero__links" ref={linksRef}>
            <Link to="/contact" className="btn btn--primary">
              {c.primary}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/pourquoi" className="btn btn--ghost">
              {c.ghost}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const isDesktop = useMediaQuery('(min-width: 881px)');
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      {isDesktop ? <SceneHook c={c} /> : <HeroCompact c={c} />}

      {/* Récit détaillé (conservé) — desktop : suite du hook */}
      {isDesktop && (
        <section className="section home-recit" aria-label="Le constat, en clair">
          <div className="container">
            <Reveal className="home-recit__inner">
              <RevealItem as="p" className="hero__line">
                <Marked text={c.line1} word={c.mark1} />
              </RevealItem>
              <RevealItem as="p" className="hero__line">
                <Marked text={c.line2} word={c.mark2} />
              </RevealItem>
            </Reveal>
          </div>
        </section>
      )}

      {/* Par où commencer — partagé desktop + mobile */}
      <section className="section section--tight" id="start" aria-labelledby="start-title">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.startEyebrow}</RevealItem>
            <RiseText as="h2" className="h2" id="start-title" text={c.startTitle} />
          </Reveal>
          <Reveal amount={0.1}>
            <RevealItem>
              <DestGrid dest={c.dest} />
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* Teaser — numérique responsable */}
      <section className="section eco-teaser" aria-labelledby="eco-teaser-title">
        <div className="container">
          <Reveal className="eco-teaser__inner">
            <div className="eco-teaser__text">
              <RevealItem as="p" className="eyebrow eyebrow--eco">{c.ecoEyebrow}</RevealItem>
              <RiseText as="h2" className="h2 eco-teaser__title" id="eco-teaser-title" text={c.ecoTitle} />
              <RevealItem as="p" className="eco-teaser__lead">{c.ecoLead}</RevealItem>
              <RevealItem>
                <Link to="/numerique-responsable" className="btn btn--eco">
                  {c.ecoBtn}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
              </RevealItem>
            </div>
            <RevealItem as="div" className="eco-teaser__art" aria-hidden="true">
              <NetField variant="leaf" />
            </RevealItem>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </Page>
  );
}
