import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import InfoTip from './InfoTip';
import { SplitBar, WeeksBar, ToggleSpark, AppsGrid } from './ConstatCharts';

/* CONSTAT — LA DORSALE. Une descente verticale : une ligne-réseau se trace
   sur le côté au fil du scroll et relie les preuves ; à chaque nœud, un
   chiffre GÉANT surgit depuis la profondeur (z + flou), son graphique se
   joue, la source ↗ et le calcul (i) apparaissent. Pas des slides : un seul
   fil continu qui s'épaissit. instant()/mobile : posé, lisible. */

function Chart({ card }) {
  switch (card.chart) {
    case 'split': return <SplitBar a={card.chartData.a} b={card.chartData.b} la={card.chartData.la} lb={card.chartData.lb} />;
    case 'weeks': return <WeeksBar total={card.chartData.total} filled={card.chartData.filled} unit={card.chartData.unit} />;
    case 'spark': return <ToggleSpark />;
    case 'grid': return <AppsGrid total={card.chartData.total} />;
    default: return null;
  }
}

export default function ConstatJourney({ cards, sourceLabel, calcLabel, locale }) {
  const rootRef = useRef(null);
  const fillRef = useRef(null);
  const nodeRefs = useRef([]);

  const fmt = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US');

  useGSAP(() => {
    const root = rootRef.current;
    const nums = [...root.querySelectorAll('.cjstat__value')];
    const stats = [...root.querySelectorAll('.cjstat')];

    if (instant()) {
      nums.forEach((el) => { el.textContent = el.dataset.display; });
      if (fillRef.current) fillRef.current.style.transform = 'scaleY(1)';
      nodeRefs.current.forEach((n) => n && n.classList.add('is-on'));
      return;
    }

    /* La ligne se trace au scroll */
    gsap.fromTo(fillRef.current, { scaleY: 0 }, {
      scaleY: 1, ease: 'none', transformOrigin: 'top',
      scrollTrigger: { trigger: root, start: 'top 60%', end: 'bottom 75%', scrub: 0.6 },
    });

    stats.forEach((stat, i) => {
      const num = nums[i];
      const value = parseFloat(num.dataset.value);
      const suffix = num.dataset.suffix || '';

      /* Chiffre : surgit depuis la profondeur + se compte */
      gsap.from(num, {
        z: -620, autoAlpha: 0, filter: 'blur(14px)',
        duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: stat, start: 'top 74%' },
      });
      ScrollTrigger.create({
        trigger: stat, start: 'top 74%', once: true,
        onEnter: () => {
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: value, duration: 1.4, ease: 'power2.out',
            onUpdate: () => { num.textContent = fmt.format(Math.round(proxy.v)) + suffix; },
          });
        },
      });

      /* Contenu : cascade */
      gsap.from(stat.querySelectorAll('.cjstat__reveal'), {
        y: 28, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: stat, start: 'top 72%' },
      });

      /* Le nœud de la dorsale s'allume */
      const node = nodeRefs.current[i];
      if (node) {
        ScrollTrigger.create({
          trigger: stat, start: 'top 66%',
          onEnter: () => node.classList.add('is-on'),
          onLeaveBack: () => node.classList.remove('is-on'),
        });
      }
    });
  }, { scope: rootRef, dependencies: [locale] });

  return (
    <section className="cjourney" ref={rootRef}>
      <span className="cjourney__rail" aria-hidden="true">
        <i ref={fillRef} />
      </span>

      <div className="cjourney__list">
        {cards.map((card, i) => (
          <article className={`cjstat cjstat--${i % 2 === 0 ? 'l' : 'r'}`} key={card.id}>
            <span
              className="cjstat__node"
              aria-hidden="true"
              ref={(el) => { nodeRefs.current[i] = el; }}
            />
            <div className="cjstat__number">
              <p className="cjstat__kicker cjstat__reveal">
                <span className="cjstat__kicker-num">{String(i + 1).padStart(2, '0')}</span>
                {card.kicker}
              </p>
              <p className="cjstat__value" data-value={card.value} data-suffix={card.suffix} data-display={card.display} aria-hidden="true">
                0{card.suffix}
              </p>
              <p className="sr-only">{card.display}</p>
            </div>

            <div className="cjstat__body">
              <h3 className="cjstat__title cjstat__reveal">{card.title}</h3>
              <p className="cjstat__desc cjstat__reveal">{card.desc}</p>
              <div className="cjstat__chart cjstat__reveal"><Chart card={card} /></div>
              <div className="cjstat__foot cjstat__reveal">
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
          </article>
        ))}
      </div>
    </section>
  );
}
