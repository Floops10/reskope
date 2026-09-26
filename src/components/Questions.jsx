import { useId, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   LES QUESTIONS QU'ON NOUS POSE — celles qu'un dirigeant se pose avant de
   décrocher son téléphone.

   La question est une ligne qu'on ouvre ; la réponse se déplie dessous. Le
   nœud devant la question suit la convention de tout le site : en fil de
   fer tant que la question est ouverte à la supposition, plein quand la
   réponse est là.

   Les questions arrivent de la profondeur, une par une, au rythme du
   défilement. Pas d'encadré, pas de filet entre elles : la question en
   encre, la réponse en gris, et du blanc.
   ════════════════════════════════════════════════════════════ */

function Question({ q, r, ouverte, basculer, id }) {
  const corps = useRef(null);

  /* La réponse se déplie en hauteur réelle, mesurée : une hauteur fixe
     coupait les réponses longues sur téléphone. */
  useGSAP(() => {
    const el = corps.current;
    if (!el) return;
    if (instant()) {
      gsap.set(el, { height: ouverte ? 'auto' : 0 });
      return;
    }
    gsap.to(el, {
      height: ouverte ? 'auto' : 0,
      duration: ouverte ? 0.55 : 0.36,
      ease: ouverte ? 'power3.out' : 'power2.in',
    });
    gsap.fromTo(el.firstChild,
      { y: ouverte ? 14 : 0, autoAlpha: ouverte ? 0 : 1 },
      { y: 0, autoAlpha: ouverte ? 1 : 0, duration: ouverte ? 0.5 : 0.2, delay: ouverte ? 0.08 : 0, ease: 'power2.out' });
  }, { dependencies: [ouverte] });

  return (
    <li className={`qs__item${ouverte ? ' is-ouverte' : ''}`}>
      <h3 className="qs__h">
        <button
          type="button"
          className="qs__q"
          aria-expanded={ouverte}
          aria-controls={`${id}-r`}
          id={`${id}-q`}
          onClick={basculer}
        >
          <span className="qs__noeud" aria-hidden="true" />
          <span className="qs__texte">{q}</span>
          <span className="qs__signe" aria-hidden="true" />
        </button>
      </h3>
      <div
        className="qs__corps"
        id={`${id}-r`}
        role="region"
        aria-labelledby={`${id}-q`}
        ref={corps}
        style={{ height: 0 }}
      >
        <p className="qs__r">{r}</p>
      </div>
    </li>
  );
}

export default function Questions({ titre = 'Les questions qu’on nous pose', items, ouverteParDefaut = 0, children }) {
  const racine = useRef(null);
  const base = useId().replace(/:/g, '');
  const [ouverte, setOuverte] = useState(ouverteParDefaut);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.from(q('.qs__titre'), {
      z: -600, y: 44, rotateX: -26, autoAlpha: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: racine.current, start: 'top 80%' },
    });
    q('.qs__item').forEach((el, i) => {
      gsap.from(el, {
        z: -480 - i * 60, y: 40, rotateX: -22, autoAlpha: 0,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  }, { scope: racine });

  return (
    <section className="qs" ref={racine} aria-labelledby={`${base}-t`}>
      <div className="container qs__in">
        <div className="qs__tete">
          <h2 className="qs__titre" id={`${base}-t`}>{titre}</h2>
        </div>
        <ul className="qs__liste">
          {items.map((it, i) => (
            <Question
              key={it.q}
              id={`${base}-${i}`}
              q={it.q}
              r={it.r}
              ouverte={ouverte === i}
              basculer={() => setOuverte((o) => (o === i ? -1 : i))}
            />
          ))}
        </ul>
        {children && <div className="qs__apres">{children}</div>}
      </div>
    </section>
  );
}
