import { useState, useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

/* Accordéon FAQ avec animation de hauteur GSAP (pas de display:none).
   L'icône — tourne à 45° pour former un × quand l'item est ouvert. */
function FaqItem({ q, a, isOpen, onToggle }) {
  const bodyRef = useRef(null);
  const first   = useRef(true);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;

    if (first.current) {
      /* Premier rendu : pas d'animation, juste l'état initial */
      gsap.set(body, { height: isOpen ? 'auto' : 0, overflow: 'hidden', autoAlpha: isOpen ? 1 : 0 });
      first.current = false;
      return;
    }

    if (isOpen) {
      gsap.fromTo(body,
        { height: 0, autoAlpha: 0 },
        { height: 'auto', autoAlpha: 1, duration: 0.42, ease: 'power3.out', overwrite: true }
      );
    } else {
      gsap.to(body, { height: 0, autoAlpha: 0, duration: 0.32, ease: 'power3.in', overwrite: true });
    }
  }, [isOpen]);

  return (
    <div className={`home-faq__item${isOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="home-faq__q"
        onClick={onToggle}
        aria-expanded={isOpen}
        data-cursor-label={isOpen ? 'Fermer' : 'Afficher'}
      >
        <span>{q}</span>
        <span className="home-faq__icon" aria-hidden="true" />
      </button>
      <div className="home-faq__body" ref={bodyRef}>
        <p className="home-faq__a">{a}</p>
      </div>
    </div>
  );
}

export default function HomeFaq({ items }) {
  const [open, setOpen] = useState(-1);

  return (
    <div className="home-faq">
      {items.map((item, i) => (
        <FaqItem
          key={item.q}
          q={item.q}
          a={item.a}
          isOpen={open === i}
          onToggle={() => setOpen(open === i ? -1 : i)}
        />
      ))}
    </div>
  );
}
