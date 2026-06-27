import { gsap } from '../lib/gsap';

/* CTA magnétiques : le bouton est attiré vers le curseur, retour élastique
   au départ. Présence « vivante » sans gadget. Desktop + pointeur fin
   uniquement ; respecte prefers-reduced-motion. Échec = bénin (le bouton
   reste normal). Retourne une fonction de nettoyage. */
export function initMagnetic(root = document) {
  if (typeof window === 'undefined') return () => {};
  if (
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return () => {};
  }

  const els = [...root.querySelectorAll('.btn, [data-magnetic]')];
  const cleanups = [];

  els.forEach((el) => {
    const arrow = el.querySelector('.btn__arrow');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const axTo = arrow ? gsap.quickTo(arrow, 'x', { duration: 0.5, ease: 'power3' }) : null;
    const ayTo = arrow ? gsap.quickTo(arrow, 'y', { duration: 0.5, ease: 'power3' }) : null;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * 0.34);
      yTo(dy * 0.5);
      if (axTo) {
        axTo(dx * 0.12);
        ayTo(dy * 0.18);
      }
    };
    const leave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.4)' });
      if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.set(el, { x: 0, y: 0 });
      if (arrow) gsap.set(arrow, { x: 0, y: 0 });
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
