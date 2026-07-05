import { useRef, useState, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { GLYPH_SHAPES } from '../lib/net3d';
import Net3D from './Net3D';
import InfoTip from './InfoTip';
import { SplitBar, WeeksBar, ToggleSpark, AppsGrid } from './ConstatCharts';

/* ============================================================
   CONSTAT — LE RAIL DES PREUVES, version VIVANTE. Un chiffre par
   écran, panneaux crème → indigo → encre → crème qui glissent au
   scroll — mais plus un simple slide : chaque panneau a de la
   PROFONDEUR (le contenu recule et pivote légèrement quand il
   n'est pas au point), un INDEX FANTÔME géant en parallaxe
   inverse, un glyphe de marque en vrai 3D qui tourne, du grain.
   À chaque arrivée : cascade de reveals + chiffre compté +
   graphique joué. Rail-réseau de progression en bas.
   Mobile / reduced : pile verticale, graphiques autonomes.
   ============================================================ */

const THEMES = ['cream', 'indigo', 'ink', 'cream'];

function Chart({ card, active }) {
  switch (card.chart) {
    case 'split': return <SplitBar a={card.chartData.a} b={card.chartData.b} la={card.chartData.la} lb={card.chartData.lb} active={active} />;
    case 'weeks': return <WeeksBar total={card.chartData.total} filled={card.chartData.filled} unit={card.chartData.unit} active={active} />;
    case 'spark': return <ToggleSpark active={active} />;
    case 'grid': return <AppsGrid total={card.chartData.total} active={active} />;
    default: return null;
  }
}

export default function ConstatRide({ cards, sourceLabel, calcLabel, locale }) {
  const isDesktop = useMediaQuery('(min-width: 881px)');
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const panelRefs = useRef([]);
  const contentRefs = useRef([]);
  const ghostRefs = useRef([]);
  const valueRefs = useRef([]);
  const nodeRefs = useRef([]);
  const lineRef = useRef(null);
  const countedRef = useRef(new Set());
  const [activeIdx, setActiveIdx] = useState(-1);
  const [flat, setFlat] = useState(false);

  const fmt = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US');

  useGSAP(() => {
    const root = rootRef.current;
    const nums = [...root.querySelectorAll('.cride__value')];

    if (instant()) {
      setFlat(true);
      nums.forEach((el) => { el.textContent = el.dataset.display; });
      return;
    }

    if (!isDesktop) {
      /* Mobile : pile verticale, chiffres comptés à l'entrée */
      setFlat(true);
      nums.forEach((el) => {
        const value = parseFloat(el.dataset.value);
        const suffix = el.dataset.suffix || '';
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: value, duration: 1.3, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
          onUpdate: () => { el.textContent = fmt.format(Math.round(proxy.v)) + suffix; },
        });
      });
      gsap.utils.toArray(root.querySelectorAll('.cride__panel')).forEach((panel) => {
        gsap.from(panel.querySelectorAll('.cride__reveal'), {
          y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: panel, start: 'top 76%' },
        });
      });
      return;
    }

    /* — Desktop : rail horizontal pinné, avec PROFONDEUR — */
    const track = trackRef.current;
    const n = cards.length;

    gsap.to(track, {
      xPercent: -100 * (n - 1) / n,
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => '+=' + n * window.innerHeight * 0.92,
        pin: stageRef.current,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (lineRef.current) lineRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
          const idx = Math.min(n - 1, Math.floor(p * n + 0.35));
          setActiveIdx((cur) => (cur === idx ? cur : idx));
          stageRef.current.dataset.theme = THEMES[idx % THEMES.length];
          nodeRefs.current.forEach((node, i) => {
            if (node) node.classList.toggle('is-on', p * n >= i + 0.3);
          });

          /* Profondeur : le panneau hors point recule et pivote ;
             le chiffre et l'index fantôme parallaxent à contre-courant */
          for (let i = 0; i < n; i++) {
            const off = i - p * (n - 1);           // 0 = au point
            const a = Math.min(Math.abs(off), 1);
            const content = contentRefs.current[i];
            if (content) {
              gsap.set(content, {
                scale: 1 - 0.055 * a,
                rotationY: off * 5,
                autoAlpha: 1 - 0.28 * a,
                transformPerspective: 1100,
              });
            }
            const v = valueRefs.current[i];
            if (v) gsap.set(v, { xPercent: off * 7 });
            const g = ghostRefs.current[i];
            if (g) gsap.set(g, { xPercent: -off * 22 });
          }
        },
      },
    });
  }, { scope: rootRef, dependencies: [isDesktop] });

  /* À CHAQUE arrivée d'un panneau : cascade de reveals + compte (1re fois) */
  useEffect(() => {
    if (flat || activeIdx < 0) return;
    const panel = panelRefs.current[activeIdx];
    if (panel) {
      gsap.fromTo(panel.querySelectorAll('.cride__reveal'),
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.055, overwrite: 'auto' });
    }
    if (!countedRef.current.has(activeIdx)) {
      countedRef.current.add(activeIdx);
      const el = valueRefs.current[activeIdx];
      if (el) {
        const value = parseFloat(el.dataset.value);
        const suffix = el.dataset.suffix || '';
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: value, duration: 1.35, ease: 'power2.out',
          onUpdate: () => { el.textContent = fmt.format(Math.round(proxy.v)) + suffix; },
        });
      }
    }
  }, [activeIdx, flat]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className={`cride${flat ? ' cride--flat' : ''}`} ref={rootRef}>
      <div className="cride__stage" ref={stageRef} data-theme="cream">
        <div className="cride__track" ref={trackRef}>
          {cards.map((card, i) => {
            const theme = THEMES[i % THEMES.length];
            const dark = theme !== 'cream';
            return (
              <article
                className={`cride__panel cride__panel--${theme}`}
                key={card.id}
                ref={(el) => { panelRefs.current[i] = el; }}
                {...(dark ? { 'data-cursor-dark': '' } : {})}
              >
                <div className="hero2__grain" aria-hidden="true" />
                <span
                  className="cride__ghost"
                  aria-hidden="true"
                  ref={(el) => { ghostRefs.current[i] = el; }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="cride__glyph" aria-hidden="true">
                  <Net3D shape={GLYPH_SHAPES[i % GLYPH_SHAPES.length]} size={96} speed={0.75 + i * 0.15} tiltX={0.45} nodeR={2.8} />
                </span>

                <div className="container cride__grid" ref={(el) => { contentRefs.current[i] = el; }}>
                  <div className="cride__main">
                    <p className="cride__kicker cride__reveal">
                      <span className="cride__kicker-num">{String(i + 1).padStart(2, '0')}</span>
                      {card.kicker}
                    </p>
                    <p
                      className="cride__value cride__reveal"
                      ref={(el) => { valueRefs.current[i] = el; }}
                      data-value={card.value}
                      data-suffix={card.suffix}
                      data-display={card.display}
                      aria-hidden="true"
                    >
                      0{card.suffix}
                    </p>
                    <p className="sr-only">{card.display}</p>
                    <h3 className="cride__title cride__reveal">{card.title}</h3>
                    <p className="cride__desc cride__reveal">{card.desc}</p>
                    <div className="cride__foot cride__reveal">
                      <a
                        className="statcard__source"
                        href={card.source.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        data-cursor-label={sourceLabel}
                      >
                        <span className="statcard__source-dot" aria-hidden="true" />
                        {card.source.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                      {card.calc && (
                        <InfoTip label={calcLabel}>
                          <strong>{calcLabel}.</strong> {card.calc}
                        </InfoTip>
                      )}
                    </div>
                  </div>

                  <div className="cride__chart cride__reveal">
                    <Chart card={card} active={flat ? undefined : activeIdx === i} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!flat && (
          <div className="cride__rail" aria-hidden="true">
            <span className="cride__rail-line"><i ref={lineRef} /></span>
            <div className="cride__rail-nodes">
              {cards.map((card, i) => (
                <span
                  key={card.id}
                  className="cride__rail-node"
                  ref={(el) => { nodeRefs.current[i] = el; }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
