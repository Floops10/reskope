import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import HeroNetwork from './HeroNetwork';
import MorphTitle from './MorphTitle';

/* ============================================================
   LE CONSTAT — L'OUVERTURE.

   Avant : une colonne de texte à gauche, un glyphe réseau qui tournait à
   droite. C'est la mise en page par défaut, celle qu'on voit partout, et
   elle obligeait à remplir la colonne de texte pour équilibrer l'image.

   Ici c'est une une de journal. Le titre occupe toute la largeur, sans
   rien à côté de lui. Le réseau reste là où il a toujours été, en fond,
   ambiant : il habite la page au lieu de lui disputer la place.

   En bas, une ligne d'ourlet : le sous-titre à gauche, les sources au
   milieu, l'invitation à descendre à droite. Trois informations courtes
   sur une seule ligne plutôt que trois paragraphes empilés.
   ============================================================ */
export default function ConstatHero({ eyebrow, title, teaser, lead, sourcesLabel, sources = [], cue }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const el = rootRef.current;
    /* Le titre arrive d'abord, seul, puis l'ourlet du bas se trace et son
       contenu suit. Deux temps : on lit le titre avant le reste. */
    gsap.from(el.querySelectorAll('.chero__reveal'), {
      y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.09, delay: 0.15,
    });
    gsap.from(el.querySelector('.chero__ourlet'), {
      scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power4.out', delay: 0.5,
    });
    gsap.from(el.querySelectorAll('.chero__ourlet-cell'), {
      y: 16, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, delay: 0.72,
    });
  }, { scope: rootRef });

  return (
    <header className="chero" ref={rootRef} id="top">
      <div className="chero__bg" aria-hidden="true">
        <HeroNetwork />
        <div className="hero2__grain" />
      </div>

      <div className="container chero__une">
        <p className="eyebrow eyebrow--index chero__reveal">{eyebrow}</p>
        <div className="chero__bloc">
          <div className="chero__reveal">
            <MorphTitle as="h1" text={title} textClass="chero__title" intro />
          </div>
          {teaser && <p className="chero__tease chero__reveal">{teaser}</p>}
        </div>
      </div>

      <div className="chero__pied">
        <div className="container">
          <span className="chero__ourlet" aria-hidden="true" />
          <div className="chero__bande">
            {lead && <p className="chero__lead chero__ourlet-cell">{lead}</p>}

            {sources.length > 0 && (
              <div className="chero__sources chero__ourlet-cell">
                <span className="chero__sources-lab">{sourcesLabel}</span>
                <span className="chero__sources-list">
                  {sources.map((s) => (
                    <span className="chero__src" key={s}>{s}</span>
                  ))}
                </span>
              </div>
            )}

            {cue && (
              <span className="chero__cue chero__ourlet-cell" aria-hidden="true">
                {cue}
                <i />
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
