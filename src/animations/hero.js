import { gsap, SplitText } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* Entrée cinématique du hero : plan d'ouverture chorégraphié.
   1. l'eyebrow monte    2. le titre se révèle LIGNE PAR LIGNE (masque, SplitText)
   3. les éléments secondaires arrivent  4. le repère de scroll apparaît.
   instant() (reduced-motion / onglet caché) => rien (tout reste visible).
   Retourne une fonction de nettoyage (kill + revert du split). */
export function heroIntro({ eyebrow, title, extras = [], cue }) {
  if (instant() || !title) return () => {};

  // SplitText défensif : si indisponible, on anime le titre entier (fallback).
  let split = null;
  let lineVars;
  try {
    split = new SplitText(title, { type: 'lines', mask: 'lines', linesClass: 'hero-l' });
    lineVars = { yPercent: 118, autoAlpha: 0, duration: 1.05, stagger: 0.12 };
  } catch {
    split = { lines: [title], revert: () => {} };
    lineVars = { y: 34, autoAlpha: 0, duration: 1, stagger: 0 };
  }

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  if (eyebrow) {
    tl.from(eyebrow, { y: 22, autoAlpha: 0, duration: 0.7 }, 0.1);
  }
  tl.from(split.lines, lineVars, 0.28);
  const realExtras = extras.filter(Boolean);
  if (realExtras.length) {
    tl.from(realExtras, { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, '-=0.55');
  }
  if (cue) {
    tl.from(cue, { autoAlpha: 0, y: -8, duration: 0.7 }, '-=0.25');
  }

  return () => {
    tl.kill();
    split.revert();
  };
}
