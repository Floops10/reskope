import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

const DEFAULT_FR = [
  'AUDIT NUMÉRIQUE',
  'CARTOGRAPHIE',
  'SIMPLIFICATION',
  'AUTOMATISATION',
  'TRANSPARENCE',
  'GAIN DE TEMPS',
  'RÉSEAU D’OUTILS',
  'TERRAIN D’ABORD',
];

const DEFAULT_EN = [
  'DIGITAL AUDIT',
  'PROCESS MAPPING',
  'SIMPLIFICATION',
  'AUTOMATION',
  'TRANSPARENCY',
  'TIME RECLAIMED',
  'TOOL NETWORK',
  'FIELD FIRST',
];

/* Marquee infini : 2 copies du texte, xPercent -50 en boucle sans accroc.
   Pause on hover. instant() => statique. */
export default function Ticker({ items, lang = 'fr', speed = 44 }) {
  const trackRef = useRef(null);
  const defaults = lang === 'en' ? DEFAULT_EN : DEFAULT_FR;
  const list = items ?? defaults;
  const doubled = [...list, ...list];

  useGSAP(() => {
    if (instant()) return;
    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      ease: 'none',
      duration: speed,
      repeat: -1,
    });

    const pause = () => tween.pause();
    const resume = () => tween.resume();
    trackRef.current.parentElement?.addEventListener('mouseenter', pause);
    trackRef.current.parentElement?.addEventListener('mouseleave', resume);
    return () => {
      trackRef.current?.parentElement?.removeEventListener('mouseenter', pause);
      trackRef.current?.parentElement?.removeEventListener('mouseleave', resume);
    };
  }, { scope: trackRef });

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track" ref={trackRef}>
        {doubled.map((item, i) => (
          <span key={i} className="ticker__item">
            {item}
            <span className="ticker__dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
