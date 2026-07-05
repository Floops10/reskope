import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { Reveal, RevealItem } from './Reveal';

const ICONS = {
  audit: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="17" cy="17" r="10" stroke="currentColor" strokeWidth="1.5" />
      <line x1="24.5" y1="24.5" x2="34" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  conception: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M9 30L13 25.5L29 8L32 11L15.5 28.5L9 30Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M13 25.5L15.5 28.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M26 11L29 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  deploiement: (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <polyline points="18,8 32,8 32,22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="9" y1="32" x2="31" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function MethodPillars({ c }) {
  const gridRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    gsap.from(gridRef.current?.querySelectorAll('.pillar-card') ?? [], {
      autoAlpha: 0,
      y: 48,
      duration: 0.72,
      stagger: 0.13,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 76%',
      },
    });
  }, { scope: gridRef });

  return (
    <section className="method-pillars section">
      <div className="container">
        <Reveal className="section__head">
          <RevealItem as="p" className="eyebrow eyebrow--index">{c.pillarsEyebrow}</RevealItem>
          <RevealItem as="h2" className="h2">{c.pillarsTitle}</RevealItem>
        </Reveal>

        <div className="pillars-grid" ref={gridRef}>
          {c.pillars.map((p) => (
            <div className="pillar-card" key={p.id}>
              <div className="pillar-card__icon">{ICONS[p.id]}</div>
              <h3 className="pillar-card__title">{p.title}</h3>
              <p className="pillar-card__text">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
