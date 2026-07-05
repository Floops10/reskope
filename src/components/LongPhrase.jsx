import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';

/* Phrase accroche — texte révélé mot par mot au scroll.
   reduced-motion SEUL désactive (pas document.hidden : un chargement en
   onglet caché figeait le texte à opacité 0.1 pour toujours). */
export default function LongPhrase({ text }) {
  const containerRef = useRef(null);
  const phraseRef    = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let split = null;
    try {
      split = new SplitText(phraseRef.current, { type: 'words' });
      gsap.set(split.words, { opacity: 0.1 });

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
        },
      }).to(split.words, {
        opacity: 1,
        ease: 'none',
        stagger: { each: 0.45 },
        duration: 0.45,
      });
    } catch {}

    return () => split?.revert();
  }, { scope: containerRef });

  return (
    <section className="long-phrase" ref={containerRef}>
      <div className="long-phrase__stage">
        <p className="long-phrase__text" ref={phraseRef}>{text}</p>
      </div>
    </section>
  );
}
