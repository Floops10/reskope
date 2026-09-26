import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { DUO } from '../data/duo';

/* ════════════════════════════════════════════════════════════
   QUI VOUS AUREZ EN FACE — deux visages, et ce que chacun mène.

   « Pourquoi vous faire confiance ? » est la question qu'un dirigeant se
   pose juste avant de décrocher. On n'a pas encore de clients à citer, et
   on ne va pas en inventer : alors on montre les deux personnes qui
   feront le travail, ce que chacune mène, et on le dit franchement.

   Les portraits se dévoilent l'un après l'autre, de bas en haut, puis
   flottent à peine. Le nœud entre eux se relie quand les deux sont là :
   c'est le même dossier, tenu à deux.
   ════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL;

export default function Duo({
  titre = 'Deux personnes sur votre dossier, du premier échange à la fin.',
  franchise = 'Reskope démarre. On n’a pas encore de clients à vous citer, et on ne va pas en inventer : on vous montre la méthode en entier, et un exemple complet.',
  lien = true,
}) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.from(q('.duo__titre'), {
      z: -700, y: 50, rotateX: -28, autoAlpha: 0, duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: racine.current, start: 'top 78%' },
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: q('.duo__gens')[0], start: 'top 82%' } });
    tl.fromTo(q('.duo__cadre'),
      { clipPath: 'inset(100% 0% 0% 0% round 16px)', z: -320, rotateX: -18 },
      { clipPath: 'inset(0% 0% 0% 0% round 16px)', z: 0, rotateX: 0, duration: 1.2, ease: 'power4.inOut', stagger: 0.16 }, 0)
      .from(q('.duo__nom'), { yPercent: 110, duration: 0.7, ease: 'power4.out', stagger: 0.16 }, 0.7)
      .from(q('.duo__mene, .duo__dit'), { z: -220, y: 18, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08 }, 0.85)
      .fromTo(q('.duo__fil'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.inOut' }, 1.05);
    gsap.from(q('.duo__franchise'), {
      z: -420, y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: q('.duo__franchise')[0], start: 'top 90%' },
    });
  }, { scope: racine });

  return (
    <section className="duo" ref={racine} aria-labelledby="duo-t">
      <div className="container duo__in">
        <h2 className="duo__titre" id="duo-t">{titre}</h2>

        <div className="duo__gens">
          <span className="duo__fil" aria-hidden="true" />
          {DUO.map((p) => (
            <figure className="duo__p" key={p.id}>
              <div className="duo__cadre">
                <img
                  className="duo__img"
                  src={`${BASE}${p.id}.jpg`}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  width="1200"
                  height="1440"
                />
              </div>
              <figcaption className="duo__cap">
                <span className="duo__masque"><span className="duo__nom">{p.nom}</span></span>
                <span className="duo__mene">{p.mene}</span>
                <span className="duo__dit">{p.dit}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="duo__franchise">
          {franchise}
          {lien && (
            <>
              {' '}
              <Link to="/qui-on-est" className="duo__lien">Qui on est<span aria-hidden="true"> →</span></Link>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
