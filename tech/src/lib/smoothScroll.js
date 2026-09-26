import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/* Scroll à inertie (Lenis) synchronisé avec GSAP ScrollTrigger.
   C'est la « respiration » du site : le scroll devient fluide et pondéré,
   et toutes les scènes ScrollTrigger restent calées dessus.
   Désactivé si prefers-reduced-motion (scroll natif). Touch = natif (perf). */

let lenis = null;
let tick = null;

export function getLenis() {
  return lenis;
}

export function initSmoothScroll() {
  if (typeof window === 'undefined' || lenis) return lenis;
  // SPA : c'est nous qui gérons la position au changement de page,
  // sinon le navigateur restaure l'ancien scroll (on arrivait en bas).
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  lenis = new Lenis({
    lerp: 0.1,            // interpolation continue = scroll soyeux mais « ferme » (Noomo)
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  // Dev only : accès à l'instance pour piloter/tester le scroll précisément.
  if (import.meta.env.DEV) window.__lenis = lenis;

  tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroySmoothScroll() {
  if (!lenis) return;
  if (tick) gsap.ticker.remove(tick);
  lenis.destroy();
  lenis = null;
  tick = null;
}

/* Verrouille / déverrouille le scroll (ex. menu ouvert). */
export function lockScroll(locked) {
  if (lenis) {
    locked ? lenis.stop() : lenis.start();
  }
}

/* Va en haut (changement de page). */
export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo(0, 0);
}
