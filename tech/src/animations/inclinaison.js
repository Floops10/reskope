/* ════════════════════════════════════════════════════════════
   L'INCLINAISON — une carte qui se penche sous la souris.

   Tout élément marqué data-incliner bascule légèrement vers le point où se
   trouve la souris, en volume, puis se redresse quand elle s'en va. On
   passe par la propriété CSS « rotate » (un axe et un angle, lissés par une
   transition), jamais par « transform » : les arrivées au défilement
   pilotent déjà transform avec GSAP, et les deux se cumulent sans se
   marcher dessus.

   Souris seulement (un doigt ne survole rien), et rien si le visiteur a
   demandé moins d'animation.
   ════════════════════════════════════════════════════════════ */

const MAX = 7;

export function initInclinaison() {
  if (typeof window === 'undefined') return () => {};
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  let actif = null;

  const redresser = (el) => {
    el.classList.remove('is-incline');
    el.style.setProperty('--incl-x', '0');
    el.style.setProperty('--incl-y', '1');
    el.style.setProperty('--incl-a', '0deg');
  };

  const bouger = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.target instanceof Element ? e.target.closest('[data-incliner]') : null;
    if (el !== actif) {
      if (actif) redresser(actif);
      actif = el;
      if (el) el.classList.add('is-incline');
    }
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    const force = Math.min(1, Math.hypot(dx, dy) * 2);
    if (force < 0.02) return;
    /* L'axe est perpendiculaire au décalage : le coin sous la souris
       s'enfonce, comme une carte qu'on presse du doigt. */
    el.style.setProperty('--incl-x', (-dy).toFixed(3));
    el.style.setProperty('--incl-y', dx.toFixed(3));
    el.style.setProperty('--incl-a', `${(MAX * force).toFixed(2)}deg`);
  };

  const sortir = () => {
    if (actif) redresser(actif);
    actif = null;
  };

  document.addEventListener('pointermove', bouger, { passive: true });
  document.documentElement.addEventListener('pointerleave', sortir);
  window.addEventListener('blur', sortir);
  return () => {
    sortir();
    document.removeEventListener('pointermove', bouger);
    document.documentElement.removeEventListener('pointerleave', sortir);
    window.removeEventListener('blur', sortir);
  };
}
