import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';

/* Inclinaison 3D au survol : l'élément s'oriente légèrement vers le curseur
   (perspective portée par le parent). Desktop / pointeur fin uniquement. */
export default function Tilt({ children, className = '', max = 9 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const rY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      rY(px * max);
      rX(-py * max);
    };
    const onLeave = () => { rX(0); rY(0); };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`tilt ${className}`}>
      {children}
    </div>
  );
}
