import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* Chiffres — façon « Recognition » de Noomo : un grand titre à gauche,
   et à droite une table de lignes (libellé + GRAND chiffre) séparées par
   des filets. Les chiffres COMPTENT (GSAP) quand la section entre à
   l'écran ; les lignes se révèlent en cascade. DA réseau (indigo/crème). */
export default function BigStats({ eyebrow, title, rows }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const nums = [...root.querySelectorAll('.bigstats__num')];

    if (instant()) {
      nums.forEach((el) => { el.textContent = el.dataset.display; });
      return;
    }

    // Révélation des lignes
    gsap.from(root.querySelectorAll('.bigstats__row'), {
      yPercent: 40, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: root, start: 'top 72%' },
    });
    gsap.from(root.querySelectorAll('.bigstats__head > *'), {
      yPercent: 60, autoAlpha: 0, duration: 0.85, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: root, start: 'top 80%' },
    });

    // Count-up : chaque chiffre monte de 0 à sa valeur
    nums.forEach((el) => {
      const value = parseFloat(el.dataset.value);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      if (Number.isNaN(value)) {
        el.textContent = el.dataset.display;
        return;
      }
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: value,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => {
          el.textContent = prefix + proxy.v.toFixed(decimals).replace('.', ',') + suffix;
        },
      });
    });
  }, { scope: rootRef });

  return (
    <section className="section bigstats" ref={rootRef} data-cursor-dark>
      <div className="container bigstats__grid">
        <div className="bigstats__head">
          <p className="eyebrow bigstats__eyebrow">{eyebrow}</p>
          <h2 className="bigstats__title">{title}</h2>
        </div>

        <div className="bigstats__rows">
          {rows.map((r) => (
            <div className="bigstats__row" key={r.label}>
              <span className="bigstats__label">{r.label}</span>
              <span
                className="bigstats__num"
                data-value={r.value ?? ''}
                data-decimals={r.decimals ?? 0}
                data-prefix={r.prefix ?? ''}
                data-suffix={r.suffix ?? ''}
                data-display={r.display}
              >
                {r.display}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
