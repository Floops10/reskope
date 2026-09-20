import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import SwapLabel from './SwapLabel';
import { instant } from '../lib/scrub';

/* ============================================================
   LES CONDITIONS — « on est fait pour vous si… »

   Avant, cette partie était une traversée caméra : trois phrases qui
   passaient devant l'objectif, puis le bouton. C'était beau et c'était
   illisible, parce qu'il fallait deviner qu'on nous décrivait, nous.

   Ici la question est posée franchement, et les situations montent une
   par une au défilement : que ce soit celle-là, et/ou celle-là, et/ou
   celle-là. Une seule suffit pour qu'on ait de quoi travailler, et c'est
   exactement ce que dit la dernière ligne, juste avant le bouton.

   Pas de scène épinglée : le défilement reste celui du visiteur. Les
   lignes, elles, continuent d'arriver de la profondeur — la grammaire de
   mouvement du site ne change pas parce qu'on a retiré la caméra.
   ============================================================ */

export default function Conditions({ c }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);

    /* La question : elle arrive de loin, comme tout le reste du site. */
    gsap.from(q('.cond__q'), {
      z: -760, y: 54, rotateX: -34, autoAlpha: 0,
      duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: racine.current, start: 'top 78%' },
    });

    /* Les situations, une par une : chacune a son propre déclencheur, donc
       chacune attend vraiment son tour de défilement. */
    q('.cond__item').forEach((el, i) => {
      const lien = el.querySelector('.cond__et');
      const mot = el.querySelector('.cond__t');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
      });
      if (lien) {
        tl.from(lien, { z: -260, autoAlpha: 0, y: 18, duration: 0.5, ease: 'power2.out' }, 0);
      }
      tl.from(mot, {
        z: -640 - i * 90, y: 64, x: (i % 2 ? 1 : -1) * 34, rotateX: -32, rotateZ: (i % 2 ? 1 : -1) * 5,
        autoAlpha: 0, duration: 1, ease: 'power3.out',
      }, lien ? 0.14 : 0);
    });

    /* La réponse et le bouton : ensemble, parce que c'est une seule idée. */
    gsap.from(q('.cond__fin, .cond__cta'), {
      z: -520, y: 44, rotateX: -24, autoAlpha: 0,
      duration: 0.95, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: q('.cond__fin')[0], start: 'top 88%' },
    });

    return () => ScrollTrigger.getAll().forEach((s) => { if (racine.current?.contains(s.trigger)) s.kill(); });
  }, { scope: racine });

  return (
    <section className="cond" ref={racine} aria-labelledby="cond-q">
      <div className="container cond__in">
        {/* La question tient à gauche pendant que les situations défilent à
            droite : elle reste posée tant qu'on n'y a pas répondu. */}
        <div className="cond__ask">
          <h2 className="cond__q" id="cond-q">{c.condQ}</h2>
        </div>

        <div className="cond__cases">
          <ul className="cond__list">
            {c.conditions.map((t, i) => (
              <li className="cond__item" key={t}>
                {i > 0 && <span className="cond__et" aria-hidden="true">{c.condEt}</span>}
                <span className="cond__t">{t}</span>
              </li>
            ))}
          </ul>

          <p className="cond__fin">{c.condFin}</p>
          <div className="cond__cta">
            <Link to="/contact" className="btn btn--primary" data-cursor-label="Y aller">
              <SwapLabel>{c.primary}</SwapLabel>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
