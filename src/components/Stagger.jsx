import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* Groupe d'éléments qui entrent UN PAR UN au scroll (montée + focus-in),
   et REPARTENT si on remonte (toggleActions play ↔ reverse) — l'effet
   « ever-t » : ça vient, ça s'en va. GSAP ScrollTrigger, cleanup SPA via
   useGSAP(scope). instant() (reduced-motion / onglet caché) => visible. */
export default function Stagger({
  as: Tag = 'div',
  className = '',
  children,
  sel = ':scope > *',
  y = 64,
  dur = 0.8,
  stagger = 0.13,
  start = 'top 82%',
  end = 'bottom 30%',
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const items = root.querySelectorAll(sel);
      if (!items.length) return;
      if (instant()) {
        gsap.set(items, { opacity: 1, y: 0, filter: 'none' });
        return;
      }
      gsap.set(items, { opacity: 0, y, filter: 'blur(8px)' });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: dur,
        ease: 'power3.out',
        stagger,
        scrollTrigger: {
          trigger: root,
          start,
          end,
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
