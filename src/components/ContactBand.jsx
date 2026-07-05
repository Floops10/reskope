import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import FloatingNet3D from './FloatingNet3D';
import SwapLabel from './SwapLabel';

/* CTA final — façon Noomo : une déclaration GÉANTE en capitales qui parle
   du client (pas de nous), révélée ligne par ligne derrière un masque au
   scroll, un globe-réseau 3D qui flotte, puis l'invitation + le bouton.
   Fond indigo plein (bloc de marque), DA réseau. */
export default function ContactBand({ statement, sub, cta }) {
  const rootRef = useRef(null);
  const stRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    let split = null;
    try {
      split = new SplitText(stRef.current, { type: 'lines', mask: 'lines', linesClass: 'ctaband__line' });
    } catch { split = null; }

    if (split) {
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 0.95,
        ease: 'power4.out',
        stagger: 0.09,
        scrollTrigger: { trigger: rootRef.current, start: 'top 68%' },
      });
    }
    gsap.from(rootRef.current.querySelectorAll('.ctaband__foot > *'), {
      y: 26, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: rootRef.current, start: 'top 45%' },
    });

    return () => split?.revert();
  }, { scope: rootRef });

  return (
    <section className="ctaband" ref={rootRef} data-cursor-dark>
      <FloatingNet3D className="ctaband__net" points={17} size={230} speed={0.8} tiltX={0.4} />
      <div className="container ctaband__inner">
        <h2 className="ctaband__statement" ref={stRef}>{statement}</h2>
        <div className="ctaband__foot">
          <p className="ctaband__sub">{sub}</p>
          <Link to="/contact" className="btn btn--on-dark ctaband__btn" data-cursor-label={cta}>
            <SwapLabel>{cta}</SwapLabel>
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
