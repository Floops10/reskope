import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { DEBUT } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   COMMENT ON COMMENCE — trois moments, un fil.

   « Comment on commence ? » est la dernière question avant de décrocher.
   La réponse tient en trois moments reliés par un fil : il se tend du
   premier au dernier, et chaque nœud s'allume quand le fil l'atteint.
   Rien n'est payant avant le troisième.
   ════════════════════════════════════════════════════════════ */

export default function Debut({ etapes = DEBUT }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const tl = gsap.timeline({ scrollTrigger: { trigger: racine.current, start: 'top 84%' } });
    tl.fromTo(q('.dbt__fil i'), { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1.3, ease: 'power2.inOut' }, 0);
    tl.from(q('.dbt__noeud'), { scale: 0, duration: 0.5, ease: 'back.out(2.4)', stagger: 0.42 }, 0.05);
    tl.from(q('.dbt__pas p'), {
      z: -420, y: 26, rotateX: -20, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.14,
    }, 0.12);
  }, { scope: racine });

  return (
    <ol className="dbt" ref={racine} data-soi>
      <span className="dbt__fil" aria-hidden="true"><i /></span>
      {etapes.map((e, i) => (
        <li className={`dbt__pas${i === etapes.length - 1 ? ' is-dernier' : ''}`} key={e.quand}>
          <span className="dbt__noeud" aria-hidden="true" />
          <p className="dbt__quand">{e.quand}</p>
          <p className="dbt__quoi">{e.quoi}</p>
        </li>
      ))}
    </ol>
  );
}
