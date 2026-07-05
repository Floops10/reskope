import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* Services — liste façon Noomo : grandes lignes typographiques empilées,
   index numéroté, révélation en cascade au scroll (chaque ligne monte
   derrière un masque), survol = la ligne s'indente, le fond se teinte et
   une flèche + un nœud-réseau apparaissent. Toute la liste renvoie vers
   /offres. DA réseau, zéro image. */
export default function ServiceRows({ eyebrow, title, items }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const rows = rootRef.current.querySelectorAll('.svrows__inner');
    gsap.from(rows, {
      yPercent: 110,
      duration: 0.85,
      ease: 'power4.out',
      stagger: 0.07,
      scrollTrigger: { trigger: rootRef.current, start: 'top 74%' },
    });
    const head = rootRef.current.querySelectorAll('.svrows__head > *');
    gsap.from(head, {
      yPercent: 80, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: rootRef.current, start: 'top 82%' },
    });
  }, { scope: rootRef });

  return (
    <section className="section svrows" ref={rootRef}>
      <div className="container">
        <div className="svrows__head">
          <p className="eyebrow eyebrow--index">{eyebrow}</p>
          <h2 className="svrows__title">{title}</h2>
        </div>

        <ul className="svrows__list">
          {items.map((label, i) => (
            <li className="svrows__row" key={label}>
              <Link to="/offres" className="svrows__link" data-cursor-label="Voir les offres">
                <span className="svrows__mask">
                  <span className="svrows__inner">
                    <span className="svrows__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="svrows__label">{label}</span>
                    <span className="svrows__end" aria-hidden="true">
                      <span className="svrows__node" />
                      <span className="svrows__arrow">→</span>
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
