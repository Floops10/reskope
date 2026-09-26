import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   COMPTER DES PERSONNES, PAS DES POURCENTAGES.

   Onze entretiens ne font pas un sondage : « 64 % » laisserait croire à
   une mesure qu'on n'a pas faite. On montre donc les personnes, une par
   une. Chaque rang est un sujet qui est revenu dans les entretiens ; chaque
   nœud est une personne interrogée ; il est plein si elle en a parlé sans
   qu'on le lui souffle.

   Les onze arrivent de la profondeur, puis ceux qui en ont parlé se
   remplissent. On lit « sept sur onze » avant d'avoir lu le chiffre.
   ════════════════════════════════════════════════════════════ */

export default function Compte({ rangs, total = 11, legende }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    q('.cpt__rang').forEach((r, k) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 88%' } });
      tl.from(r.querySelector('.cpt__sujet'), { z: -380, y: 22, rotateX: -18, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0)
        .from(r.querySelectorAll('.cpt__p'), {
          z: -300, scale: 0.2, autoAlpha: 0, duration: 0.6, ease: 'power3.out',
          stagger: { each: 0.04, from: 'start' },
        }, 0.1)
        .from(r.querySelectorAll('.cpt__p.is-plein i'), {
          scale: 0, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.06,
        }, 0.55 + k * 0.05)
        .from(r.querySelector('.cpt__n'), { autoAlpha: 0, y: 10, duration: 0.5, ease: 'power2.out' }, 0.8);
    });
  }, { scope: racine });

  return (
    <figure className="cpt" ref={racine} data-soi>
      {rangs.map((r) => {
        const sur = r.total || total;
        return (
          <div className="cpt__rang" key={r.sujet}>
            <p className="cpt__sujet">{r.sujet}</p>
            <p className="cpt__gens" role="img" aria-label={`${r.n} ${r.unite || 'personnes'} sur ${sur}`}>
              {Array.from({ length: sur }, (_, i) => (
                <span key={i} className={`cpt__p${i < r.n ? ' is-plein' : ''}`}><i /></span>
              ))}
            </p>
            <p className="cpt__n" aria-hidden="true">{r.n} sur {sur}</p>
          </div>
        );
      })}
      {legende && <figcaption className="cpt__legende">{legende}</figcaption>}
    </figure>
  );
}
