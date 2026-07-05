import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import InfoTip from './InfoTip';
import { SplitBar, WeeksBar, ToggleSpark, AppsGrid } from './ConstatCharts';

/* ============================================================
   STAT STACK — l'étude de marché en cartes EMPILÉES au scroll :
   chaque carte vient se poser sur la précédente (sticky), qui
   recule doucement (échelle + voile) — un paquet de preuves qui
   s'épaissit. Chaque carte : chiffre GÉANT compté, graphique
   animé, source cliquable (↗), et infobulle (i) qui montre le
   calcul quand le chiffre est dérivé par nos soins.
   ============================================================ */

function Chart({ card }) {
  switch (card.chart) {
    case 'split': return <SplitBar a={card.chartData.a} b={card.chartData.b} la={card.chartData.la} lb={card.chartData.lb} />;
    case 'weeks': return <WeeksBar total={card.chartData.total} filled={card.chartData.filled} unit={card.chartData.unit} />;
    case 'spark': return <ToggleSpark />;
    case 'grid': return <AppsGrid total={card.chartData.total} />;
    default: return null;
  }
}

export default function StatStack({ cards, sourceLabel, calcLabel, locale }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const els = [...root.querySelectorAll('.statcard')];
    const nums = [...root.querySelectorAll('.statcard__value')];

    if (instant()) {
      nums.forEach((el) => { el.textContent = el.dataset.display; });
      return;
    }

    /* Chiffres : count-up quand la carte arrive */
    nums.forEach((el) => {
      const value = parseFloat(el.dataset.value);
      const suffix = el.dataset.suffix || '';
      const fmt = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 });
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: value, duration: 1.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
        onUpdate: () => { el.textContent = fmt.format(Math.round(proxy.v)) + suffix; },
      });
    });

    /* Contenu : cascade à l'arrivée de chaque carte */
    els.forEach((card) => {
      gsap.from(card.querySelectorAll('.statcard__reveal'), {
        y: 34, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: card, start: 'top 74%' },
      });
    });

    /* Empilement : la carte couverte recule (échelle + voile) */
    els.forEach((card, i) => {
      const next = els[i + 1];
      if (!next) return;
      gsap.to(card, {
        scale: 0.94,
        autoAlpha: 0.45,
        transformOrigin: 'center top',
        ease: 'none',
        scrollTrigger: {
          trigger: next,
          start: 'top bottom-=120',
          end: 'top top+=140',
          scrub: true,
        },
      });
    });
  }, { scope: rootRef, dependencies: [locale] });

  return (
    <div className="statstack" ref={rootRef}>
      {cards.map((card, i) => (
        <article
          key={card.id}
          className={`statcard statcard--${card.theme}`}
          style={{ '--i': i }}
        >
          <div className="statcard__inner">
            <div className="statcard__main">
              <p className="statcard__kicker statcard__reveal">
                <span className="statcard__kicker-num">{String(i + 1).padStart(2, '0')}</span>
                {card.kicker}
              </p>
              <p className="statcard__value statcard__reveal" data-value={card.value} data-suffix={card.suffix} data-display={card.display}>
                {card.display}
              </p>
              <h3 className="statcard__title statcard__reveal">{card.title}</h3>
              <p className="statcard__desc statcard__reveal">{card.desc}</p>

              <div className="statcard__foot statcard__reveal">
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

            <div className="statcard__chart statcard__reveal">
              <Chart card={card} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
