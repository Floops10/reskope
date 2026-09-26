import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   LE DÉROULÉ — ce qu'on fait, et ce qu'on vous demande, jour par jour.

   Un emploi du temps, pas une liste d'étapes numérotées : le moment à
   gauche, ce qu'on fait au centre, et à droite ce que ça vous demande à
   vous. C'est la colonne qu'un dirigeant lit en premier, alors elle a son
   propre signe : un nœud plein quand on a besoin de vous, en fil de fer
   quand on travaille seuls.

   L'axe se trace pendant qu'on descend, et chaque moment arrive de la
   profondeur quand l'axe l'atteint.
   ════════════════════════════════════════════════════════════ */

const LIBRE = /^rien/i;

export default function Deroule({ etapes }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.fromTo(q('.drl__axe i'), { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: racine.current, start: 'top 72%', end: 'bottom 70%', scrub: 0.6 },
    });
    q('.drl__pas').forEach((el) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%' } });
      tl.from(el.querySelector('.drl__point'), { scale: 0, duration: 0.45, ease: 'back.out(2.6)' }, 0)
        .from(el.querySelectorAll('.drl__quand, .drl__quoi, .drl__vous'), {
          z: -460, y: 34, rotateX: -22, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09,
        }, 0.05);
    });
  }, { scope: racine });

  return (
    <ol className="drl" ref={racine} data-soi>
      <span className="drl__axe" aria-hidden="true"><i /></span>
      {etapes.map((e) => (
        <li className="drl__pas" key={e.quand}>
          <span className="drl__point" aria-hidden="true" />
          <p className="drl__quand">{e.quand}</p>
          <p className="drl__quoi">{e.quoi}</p>
          <p className={`drl__vous${LIBRE.test(e.vous) ? ' is-libre' : ''}`}>
            <span className="drl__signe" aria-hidden="true" />
            <span className="sr-only">Ce que ça vous demande : </span>
            {e.vous}
          </p>
        </li>
      ))}
    </ol>
  );
}
