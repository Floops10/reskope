import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

/* Attire l'élément vers le curseur quand il s'en approche, retour élastique
   à la sortie. Desktop / pointeur fin uniquement, reduced-motion respecté.
   Renvoie une ref à poser sur l'élément (bouton, lien). */
export function useMagnetic({ strength = 0.35, radius = 90 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    let active = false;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const reach = Math.max(r.width, r.height) / 2 + radius;
      if (Math.hypot(dx, dy) < reach) {
        active = true;
        xTo(dx * strength);
        yTo(dy * strength);
      } else if (active) {
        active = false;
        xTo(0);
        yTo(0);
      }
    };
    const onLeave = () => { active = false; xTo(0); yTo(0); };

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength, radius]);

  return ref;
}
