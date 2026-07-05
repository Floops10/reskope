import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { Reveal, RevealItem } from './Reveal';

/* Counter animation pour les stats numériques.
   Les stats sans `value` (ex: "< 10 j") font juste un reveal sans comptage. */
function Counter({ stat }) {
  const valRef = useRef(null);

  useGSAP(() => {
    if (instant() || stat.value == null) return;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: stat.value,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (!valRef.current) return;
        const v = stat.decimals ? obj.v.toFixed(stat.decimals).replace('.', ',') : Math.round(obj.v);
        valRef.current.textContent = (stat.prefix ?? '') + v + (stat.suffix ?? '');
      },
      scrollTrigger: {
        trigger: valRef.current,
        start: 'top 80%',
        once: true,
      },
    });
  }, { scope: valRef });

  return (
    <div className="stat-item">
      <p ref={valRef} className="stat-item__value">
        {stat.display}
      </p>
      <p className="stat-item__label">{stat.label}</p>
    </div>
  );
}

export default function StatsSection({ c }) {
  return (
    <section className="stats-section" data-cursor-dark>
      <div className="container">
        <Reveal className="stats-section__head">
          <RevealItem as="p" className="eyebrow eyebrow--inverted">{c.statsEyebrow}</RevealItem>
        </Reveal>
        <div className="stats-grid">
          {c.stats.map((s) => (
            <Counter key={s.id} stat={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
