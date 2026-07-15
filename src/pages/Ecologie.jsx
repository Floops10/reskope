import { useLayoutEffect, useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import MorphTitle from '../components/MorphTitle';
import { Reveal, RevealItem } from '../components/Reveal';
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../lib/gsap';
import { useLang } from '../i18n';
import { CONTACT } from '../data/site';

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

const CONTENT = {
  fr: {
    metaTitle: "Numérique responsable · simplifier, c'est consommer moins",
    metaDesc:
      "L'angle écologique de Reskope : alléger votre stack d'outils réduit serveurs, stockage et données dupliquées. Une sobriété numérique sans effort supplémentaire.",
    eyebrow: 'Numérique responsable',
    title: 'Simplifier réduit aussi votre empreinte.',
    lead: "Notre métier réduit le désordre numérique. Or, moins d'outils superflus, c'est mécaniquement moins de serveurs, moins de stockage et moins d'énergie. L'efficacité et la sobriété avancent dans le même sens.",
    purge: {
      kicker: 'L’allègement, en 3 temps',
      counterLabel: 'du superflu éteint',
      caps: [
        'Chaque point est un outil. Chacun fait tourner des serveurs, quelque part.',
        'La plupart sont superflus : doublons, licences dormantes, silos. On les éteint.',
        'Ce qui reste se relie, et travaille. La sobriété a la forme de l’essentiel.',
      ],
    },
    factsEyebrow: 'Le constat',
    factsTitle: 'Le numérique « invisible » a un coût bien réel.',
    facts: [
      { num: 68, suffix: ' %', stat: '68 %', label: 'des licences SaaS sous-utilisées', detail: 'Chaque application inutilisée fait tourner des serveurs, stocke vos données et facture une licence. Rien ne le justifie.', source: 'Gartner, 2023' },
      { num: 9.4, decimals: 1, stat: '9,4', label: 'applications par salarié en moyenne', detail: 'Chaque app est un silo. Plus il y en a, plus la donnée est dupliquée, vieillie, et énergivore à maintenir.', source: 'Okta, Businesses at Work, 2023' },
      { num: 2, prefix: '× ', stat: '× 2', label: 'moins de stockage et de doublons', detail: "En passant de 6 à 3 outils, nos clients divisent leurs données redondantes, et l'empreinte de stockage qui va avec.", source: 'Estimation Reskope' },
    ],
    savingsEyebrow: "Ce qu'un projet économise",
    savingsTitle: 'Quatre économies, au-delà du temps gagné.',
    savings: [
      { title: 'Moins de serveurs sollicités', text: "Chaque outil supprimé, c'est des machines qui ne tournent plus pour rien dans un datacenter. La sobriété logicielle est une sobriété énergétique." },
      { title: 'Moins de données dupliquées', text: "Une donnée saisie une seule fois, au bon endroit, c'est moins de stockage, moins de sauvegardes redondantes, moins de synchronisations permanentes." },
      { title: 'Moins de matériel à remplacer', text: "Des outils plus légers et mieux choisis allongent la durée de vie des postes. On évite le renouvellement matériel dicté par des logiciels trop lourds." },
      { title: "Moins de temps, donc moins d'énergie", text: "Le temps gagné par vos équipes, c'est aussi moins de réunions, moins d'e-mails, moins d'allers-retours numériques. La productivité rejoint la sobriété." },
    ],
    posEyebrow: 'Notre position',
    posTitle: 'On ne vend pas du « green », on évite du superflu.',
    posLead:
      "Pas de greenwashing : la sobriété n'est pas un argument ajouté, c'est la conséquence directe de notre travail. Un audit qui supprime trois outils redondants a un effet écologique réel, et il est gratuit pour la planète comme pour votre budget.",
    posBtn: 'Parler de votre stack',
    ctaTitle: 'Et si on allégeait vos outils ?',
    ctaLead:
      'Un premier échange pour mesurer ce que vous pourriez simplifier, pour vos équipes comme pour votre empreinte.',
    ctaPrimary: 'Parler de vos outils',
    ctaSecondary: 'Écrire un message',
  },
  en: {
    metaTitle: 'Responsible digital · simplifying means consuming less',
    metaDesc:
      "Reskope's ecological angle: trimming your tool stack cuts servers, storage and duplicated data. Digital sobriety with no extra effort.",
    eyebrow: 'Responsible digital',
    title: 'Simplifying also cuts your footprint.',
    lead: 'Our work reduces digital clutter. And fewer superfluous tools mechanically means fewer servers, less storage and less energy. Efficiency and sobriety move in the same direction.',
    purge: {
      kicker: 'The lightening, in 3 steps',
      counterLabel: 'of the superfluous switched off',
      caps: [
        'Each dot is a tool. Each one keeps servers running, somewhere.',
        'Most are superfluous: duplicates, dormant licences, silos. We switch them off.',
        'What remains connects, and works. Sobriety takes the shape of the essential.',
      ],
    },
    factsEyebrow: 'The reality',
    factsTitle: '“Invisible” digital has a very real cost.',
    facts: [
      { num: 68, suffix: '%', stat: '68%', label: 'of SaaS licenses underused', detail: 'Every unused app keeps servers running, stores your data and bills a license. Nothing justifies it.', source: 'Gartner, 2023' },
      { num: 9.4, decimals: 1, stat: '9.4', label: 'apps per employee on average', detail: 'Every app is a silo. The more there are, the more data is duplicated, stale and energy-hungry to maintain.', source: 'Okta, Businesses at Work, 2023' },
      { num: 2, prefix: '× ', stat: '× 2', label: 'less storage and fewer duplicates', detail: 'Going from 6 to 3 tools, our clients halve their redundant data, and the storage footprint that goes with it.', source: 'Reskope estimate' },
    ],
    savingsEyebrow: 'What a project saves',
    savingsTitle: 'Four savings, beyond the time gained.',
    savings: [
      { title: 'Fewer servers running', text: 'Each removed tool means machines no longer running for nothing in a datacenter. Software sobriety is energy sobriety.' },
      { title: 'Less duplicated data', text: 'Data entered once, in the right place, means less storage, fewer redundant backups, fewer constant syncs.' },
      { title: 'Less hardware to replace', text: "Lighter, better-chosen tools extend the life of your machines. You avoid hardware renewal driven by software that's too heavy." },
      { title: 'Less time, so less energy', text: 'The time your teams save also means fewer meetings, fewer emails, fewer digital back-and-forths. Productivity meets sobriety.' },
    ],
    posEyebrow: 'Our stance',
    posTitle: "We don't sell “green”, we avoid the superfluous.",
    posLead:
      'No greenwashing: sobriety is not an add-on argument, it is the direct consequence of our work. An audit that removes three redundant tools has a real ecological effect, and it is free for the planet as much as for your budget.',
    posBtn: 'Talk about your stack',
    ctaTitle: 'What if we lightened your tools?',
    ctaLead:
      'A first conversation to measure what you could simplify, for your teams as much as for your footprint.',
    ctaPrimary: 'Talk about your tools',
    ctaSecondary: 'Send a message',
  },
};

/* L'ALLÈGEMENT — scène signature en WebGL (lazy : three ne charge
   que sur cette page), même moteur 3D que le Constat et les Offres. */
const EcoAllege = lazy(() => import('../components/EcoAllege'));

/* La feuille du hero (filigrane) : MÊME profil botanique que la scène 3D,
   projeté en 2D — pointe fine, base arrondie, nervure courbée, tige. */
function heroLeafPath() {
  const W = (t) => 30 * Math.pow(Math.sin(Math.PI * Math.min(t, 0.999)), 0.72) * (1 - 0.34 * t);
  const B = (t) => 8 * Math.sin(Math.PI * t * 0.92);
  const pt = (t, side) => `${50 + B(t) + side * W(t)},${106 - 96 * t}`;
  const steps = Array.from({ length: 25 }, (_, k) => (k + 1) / 26);
  const left = steps.map((t) => pt(t, -1));
  const right = [...steps].reverse().map((t) => pt(t, 1));
  const outline = `M50,106 L${left.join(' L')} L50,10 L${right.join(' L')} Z`;
  const mid = `M50,104 Q${50 + B(0.5)},${106 - 48} 50,12`;
  const stem = `M50,106 Q48,114 44,119`;
  const veins = [0.22, 0.4, 0.58, 0.74].map((t0) => {
    const t1 = Math.min(t0 + 0.14, 0.96);
    return [-1, 1].map((sd) => `M${50 + B(t0)},${106 - 96 * t0} L${pt(t1, sd * 0.94)}`).join(' ');
  }).join(' ');
  return { outline, mid, stem, veins };
}
const HERO_LEAF = heroLeafPath();

export default function Ecologie() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const pageRef = useRef(null);

  useLayoutEffect(() => {
    document.documentElement.classList.add('eco-theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute('content');
    meta?.setAttribute('content', '#0B6B35');
    return () => {
      document.documentElement.classList.remove('eco-theme');
      if (prev) meta?.setAttribute('content', prev);
    };
  }, []);

  /* Stats comptées + parallaxe de la feuille de fond */
  useGSAP(() => {
    if (reduced()) return;
    const root = pageRef.current;

    root.querySelectorAll('.eco-fact__stat[data-num]').forEach((el) => {
      const num = parseFloat(el.dataset.num);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const fmt = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals,
      });
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: num, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: () => { el.textContent = `${prefix}${fmt.format(proxy.v)}${suffix}`; },
      });
    });

    /* Le manifeste se révèle MOT À MOT au scroll (comme la home) */
    const stanceLead = root.querySelector('.eco-stance .eco__lead');
    let split = null;
    if (stanceLead) {
      try {
        split = new SplitText(stanceLead, { type: 'words' });
        gsap.set(split.words, { opacity: 0.13 });
        gsap.to(split.words, {
          opacity: 1, ease: 'none', stagger: 0.35, duration: 0.35,
          scrollTrigger: { trigger: stanceLead, start: 'top 78%', end: 'top 30%', scrub: 0.8 },
        });
      } catch { split = null; }
    }

    /* Hero : parallaxe des couches (canopée en profondeur) + la feuille
       filigrane qui dérive en tournant à peine */
    gsap.to(root.querySelector('.eco-hero__dust--0'), {
      yPercent: -16, ease: 'none',
      scrollTrigger: { trigger: root.querySelector('.eco-hero'), start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(root.querySelector('.eco-hero__dust--1'), {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: root.querySelector('.eco-hero'), start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(root.querySelector('.eco-hero__leafmark'), {
      yPercent: 18, rotation: 3, ease: 'none',
      scrollTrigger: { trigger: root.querySelector('.eco-hero'), start: 'top top', end: 'bottom top', scrub: true },
    });

    /* Stats : entrée rideau + le FIL qui les relie se dessine */
    const facts = root.querySelectorAll('.eco-fact');
    gsap.set(facts, { clipPath: 'inset(0% 0% 100% 0% round 14px)', y: 44, autoAlpha: 0, filter: 'blur(8px)' });
    gsap.to(facts, {
      clipPath: 'inset(0% 0% 0% 0% round 14px)', y: 0, autoAlpha: 1, filter: 'blur(0px)',
      duration: 1, ease: 'power4.out', stagger: 0.14,
      scrollTrigger: { trigger: root.querySelector('.eco-facts-wrap'), start: 'top 80%' },
      onComplete: () => gsap.set(facts, { clearProps: 'clipPath,filter' }),
    });

    /* La chaîne des économies : le rail se remplit, chaque maillon s'allume */
    const chain = root.querySelector('.eco-chain');
    if (chain) {
      gsap.fromTo(chain.querySelector('.eco-chain__rail i'), { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: chain, start: 'top 72%', end: 'bottom 55%', scrub: 0.6 },
      });
      chain.querySelectorAll('.eco-chain__item').forEach((item) => {
        gsap.fromTo(item, { opacity: 0.18, x: 46 }, {
          opacity: 1, x: 0, ease: 'power2.out',
          scrollTrigger: {
            trigger: item, start: 'top 86%', end: 'top 52%', scrub: 0.6,
            onUpdate: (self) => item.classList.toggle('is-on', self.progress > 0.65),
          },
        });
      });
    }

    return () => split?.revert();
  }, { scope: pageRef, dependencies: [lang] });

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      <div ref={pageRef}>
        {/* Hero PLEIN ÉCRAN : le titre-réseau respire dans une canopée à deux
            profondeurs, la FEUILLE veille en filigrane, un cue invite. */}
        <div className="eco-hero">
          <svg className="eco-hero__leafmark" viewBox="0 0 100 124" aria-hidden="true">
            <path className="eco-hero__leafmark-blade" d={HERO_LEAF.outline} />
            <path d={HERO_LEAF.mid} />
            <path d={HERO_LEAF.veins} />
            <path d={HERO_LEAF.stem} />
          </svg>
          {[0, 1].map((layer) => (
            <div className={`eco-hero__dust eco-hero__dust--${layer}`} aria-hidden="true" key={layer}>
              {Array.from({ length: 10 }, (_, i) => {
                const k = i + layer * 10;
                return (
                  <span
                    key={k}
                    style={{
                      left: `${4 + rnd(k, 11) * 92}%`,
                      top: `${8 + rnd(k, 12) * 80}%`,
                      width: `${(layer ? 2.5 : 4) + rnd(k, 13) * 4}px`,
                      height: `${(layer ? 2.5 : 4) + rnd(k, 13) * 4}px`,
                      opacity: (layer ? 0.1 : 0.16) + rnd(k, 14) * 0.28,
                      animationDuration: `${5 + rnd(k, 15) * 6}s`,
                      animationDelay: `${rnd(k, 16) * 5}s`,
                    }}
                  />
                );
              })}
            </div>
          ))}
          <PageHeader tone="eco" eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
        </div>

        {/* L'ALLÈGEMENT — la scène signature (WebGL) */}
        <Suspense fallback={<div className="epg-loading" aria-hidden="true" />}>
          <EcoAllege t={c.purge} />
        </Suspense>

        {/* CHIFFRES */}
        <section className="section section--tight" aria-labelledby="eco-facts-title">
          <div className="container">
            <Reveal className="section__head">
              <RevealItem as="p" className="eyebrow eyebrow--eco">{c.factsEyebrow}</RevealItem>
              <RevealItem as="h2" className="h2 eco__h2" id="eco-facts-title">{c.factsTitle}</RevealItem>
            </Reveal>

            <div className="eco-facts-wrap">
              <div className="eco-facts">
                {c.facts.map((f) => (
                  <div className="eco-fact" key={f.label}>
                    <span
                      className="eco-fact__stat"
                      data-num={f.num}
                      data-decimals={f.decimals || 0}
                      data-prefix={f.prefix || ''}
                      data-suffix={f.suffix || ''}
                    >
                      {f.stat}
                    </span>
                    <span className="eco-fact__label">{f.label}</span>
                    <p className="eco-fact__detail">{f.detail}</p>
                    <span className="eco-fact__source">{f.source}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CE QUE ÇA ÉCONOMISE — bande sobre : la chaîne EST le visuel */}
        <section className="section section--eco-band" aria-labelledby="eco-savings-title">
          <div className="container">
            <Reveal className="section__head">
              <RevealItem as="p" className="eyebrow eyebrow--eco">{c.savingsEyebrow}</RevealItem>
              <RevealItem as="h2" className="h2 eco__h2" id="eco-savings-title">{c.savingsTitle}</RevealItem>
            </Reveal>

            {/* LA CHAÎNE : une ligne se remplit au scroll et allume chaque
                économie l'une après l'autre */}
            <div className="eco-chain">
              <span className="eco-chain__rail" aria-hidden="true"><i /></span>
              {c.savings.map((s, i) => (
                <div className="eco-chain__item" key={s.title}>
                  <span className="eco-chain__node" aria-hidden="true" />
                  <span className="eco-chain__num" aria-hidden="true">{`0${i + 1}`}</span>
                  <div className="eco-chain__body">
                    <h3 className="eco-chain__title">{s.title}</h3>
                    <p className="eco-chain__text">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POSITION */}
        <section className="section" aria-labelledby="eco-pos-title">
          <div className="container">
            <Reveal className="eco-stance">
              <RevealItem as="p" className="eyebrow eyebrow--eco">{c.posEyebrow}</RevealItem>
              <RevealItem>
                <MorphTitle as="h2" text={c.posTitle} textClass="h2 eco__h2" netClass="morph__net--eco" id="eco-pos-title" />
              </RevealItem>
              <RevealItem as="p" className="lead eco__lead">{c.posLead}</RevealItem>
              <RevealItem>
                <Link to="/contact" className="btn btn--eco-solid">
                  {c.posBtn}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
              </RevealItem>
            </Reveal>
          </div>
        </section>

        {/* CTA vert */}
        <section className="section eco-cta" aria-label={c.ctaTitle}>
          <div className="container">
            <Reveal>
              <RevealItem as="h2" className="eco-cta__title">{c.ctaTitle}</RevealItem>
              <RevealItem as="p" className="eco-cta__lead">{c.ctaLead}</RevealItem>
              <RevealItem className="eco-cta__actions">
                <Link className="btn btn--eco-solid" to="/contact">
                  {c.ctaPrimary}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
                <a className="btn btn--eco" href={`mailto:${CONTACT.email}`}>
                  {c.ctaSecondary}
                </a>
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </div>
    </Page>
  );
}
