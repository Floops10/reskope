import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import NetWord from './NetWord';
import { Reveal, RevealItem } from './Reveal';

/* En-tête de page : le premier mot du titre se forme via la trame réseau
   (NetWord), les mots suivants arrivent mot par mot via SplitText (delay pour
   laisser le NetWord se former d'abord). Le lead suit via Reveal standard. */
export default function PageHeader({ eyebrow, title, lead, tone = 'default', action }) {
  const word = title.split(' ')[0];
  const rest = title.slice(word.length).replace(/^\s+/, '');
  const restRef = useRef(null);

  useGSAP(
    () => {
      if (instant() || !restRef.current || !rest) return;

      let split = null;
      try {
        split = new SplitText(restRef.current, { type: 'words' });
        gsap.from(split.words, {
          autoAlpha: 0,
          yPercent: 65,
          duration: 0.88,
          ease: 'power4.out',
          stagger: 0.072,
          delay: 0.55,
        });
      } catch {
        gsap.from(restRef.current, {
          autoAlpha: 0,
          y: 30,
          duration: 0.9,
          ease: 'power4.out',
          delay: 0.45,
        });
      }

      return () => split?.revert();
    },
    { scope: restRef }
  );

  return (
    <header className={`pagehead${tone === 'eco' ? ' pagehead--eco' : ''}`}>
      <div className={`container${action ? ' pagehead__inner' : ''}`}>
        <div className="pagehead__main">
          {eyebrow && (
            <Reveal onMount>
              <RevealItem as="p" className="eyebrow eyebrow--index">
                {eyebrow}
              </RevealItem>
            </Reveal>
          )}

          <h1 className="pagehead__title">
            <span className="pagehead__title-word">
              <span className="pagehead__title-ghost">{word}</span>
              <NetWord className="pagehead__netword">{word}</NetWord>
            </span>
            {rest && (
              <>
                {' '}
                <span className="pagehead__title-rest" ref={restRef}>
                  {rest}
                </span>
              </>
            )}
          </h1>

          {lead && (
            <Reveal>
              <RevealItem as="p" className="lead pagehead__lead">
                {lead}
              </RevealItem>
            </Reveal>
          )}
        </div>

        {action && <div className="pagehead__action">{action}</div>}
      </div>
    </header>
  );
}
