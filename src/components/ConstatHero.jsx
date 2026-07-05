import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import HeroNetwork from './HeroNetwork';
import Net3D from './Net3D';
import { GLYPH_SHAPES } from '../lib/net3d';
import MorphTitle from './MorphTitle';

/* CONSTAT — L'OUVERTURE. Une entrée éditoriale qui donne envie d'aller plus
   loin : le titre bascule en police réseau au survol, une phrase d'accroche
   annonce ce qui suit (des heures, un coût, un pourquoi), et une ligne de
   sources signale une vraie étude, pas une plaquette. Aucun chiffre précis
   ici : le film qui suit les révèle un à un. Un glyphe réseau 3D dérive à
   droite, le fond réagit au curseur. Entrée chorégraphiée, sans pin fragile. */
export default function ConstatHero({ eyebrow, title, teaser, lead, sourcesLabel, sources = [], cue = 'Scroll' }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    gsap.from(rootRef.current.querySelectorAll('.chero__reveal'), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.15,
    });
    gsap.from(rootRef.current.querySelector('.chero__cue'), {
      autoAlpha: 0, y: -8, duration: 0.6, delay: 1,
    });
  }, { scope: rootRef });

  return (
    <header className="chero" ref={rootRef} id="top">
      <div className="chero__bg" aria-hidden="true">
        <HeroNetwork />
        <div className="hero2__grain" />
      </div>

      <div className="container chero__grid">
        <div className="chero__copy">
          <p className="eyebrow eyebrow--index chero__reveal">{eyebrow}</p>
          <div className="chero__reveal">
            <MorphTitle as="h1" text={title} textClass="chero__title" intro />
          </div>
          {teaser && <p className="chero__tease chero__reveal">{teaser}</p>}
          <p className="lead chero__lead chero__reveal">{lead}</p>

          {sources.length > 0 && (
            <div className="chero__sources chero__reveal">
              <span className="chero__sources-lab">{sourcesLabel}</span>
              <span className="chero__sources-list">
                {sources.map((s) => (
                  <span className="chero__src" key={s}>{s}</span>
                ))}
              </span>
            </div>
          )}
        </div>

        <div className="chero__viz chero__reveal" aria-hidden="true">
          <span className="chero__glyph">
            <Net3D shape={GLYPH_SHAPES[1]} size={300} speed={0.6} tiltX={0.45} nodeR={3.4} />
          </span>
        </div>
      </div>

      <div className="chero__cue" aria-hidden="true">
        <span>{cue}</span>
        <i />
      </div>
    </header>
  );
}
