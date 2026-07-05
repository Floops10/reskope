import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import MorphTitle from './MorphTitle';

/* MÉTHODE — L'OUVERTURE IMMERSIVE. Un champ en perspective : un sol quadrillé
   qui fuit vers l'horizon, un nuage d'« outils » (nœuds) suspendus en
   profondeur, et au centre un germe (le futur système) qui pulse. Le champ
   réagit au curseur (desktop) ou respire seul (mobile). Entrée chorégraphiée :
   le sol se pose, les nœuds surgissent, le germe s'allume, le titre bascule.
   Monde CLAIR, à l'opposé du Constat : chaque page son identité. */

const CLOUD = Array.from({ length: 26 }, (_, i) => {
  const r = (s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
  return {
    x: 6 + r(1) * 88,
    y: 10 + r(2) * 66,
    z: -320 + r(3) * 620,
    s: 4 + r(5) * 5,
    dur: 3 + r(6) * 3.5,
    op: 0.22 + r(4) * 0.6,
  };
});

export default function MethodeHero({ eyebrow, title, tease, cue }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    const root = rootRef.current;
    const scene = root.querySelector('.mhero__scene');
    const nodes = gsap.utils.toArray(root.querySelectorAll('.mhero__cnode'));

    /* Profondeur des nœuds : posée dans tous les cas (même statique) */
    nodes.forEach((el, i) => gsap.set(el, { z: CLOUD[i].z }));

    if (instant()) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.mhero__floor', { autoAlpha: 0, scale: 0.86, duration: 1.3 }, 0)
      .from(nodes, { scale: 0, autoAlpha: 0, duration: 0.9, stagger: { each: 0.02, from: 'random' } }, 0.25)
      .from('.mhero__seed', { autoAlpha: 0, scale: 0.35, duration: 1, ease: 'back.out(1.6)' }, 0.6)
      .from('.mhero__reveal', { yPercent: 60, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.5)
      .from('.mhero__cue', { autoAlpha: 0, y: -8, duration: 0.6 }, 1.2);

    /* Dérive continue des nœuds (vie du champ) */
    nodes.forEach((el, i) => {
      gsap.to(el, { y: '+=14', duration: CLOUD[i].dur, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: CLOUD[i].dur * 0.3 });
    });

    /* Parallaxe : regard curseur (desktop) ou respiration (mobile) */
    let onMove = null, sway = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const rY = gsap.quickTo(scene, 'rotationY', { duration: 1, ease: 'power3.out' });
      const rX = gsap.quickTo(scene, 'rotationX', { duration: 1, ease: 'power3.out' });
      onMove = (e) => { rY((e.clientX / window.innerWidth - 0.5) * 10); rX(-(e.clientY / window.innerHeight - 0.5) * 6 + 4); };
      window.addEventListener('pointermove', onMove, { passive: true });
    } else {
      gsap.set(scene, { rotationX: 4 });
      sway = gsap.to(scene, { rotationY: 7, duration: 5.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }

    return () => { if (onMove) window.removeEventListener('pointermove', onMove); if (sway) sway.kill(); };
  }, { scope: rootRef });

  return (
    <header className="mhero" ref={rootRef} id="top">
      <div className="mhero__stage" aria-hidden="true">
        <div className="mhero__scene">
          <div className="mhero__floor" />
          <div className="mhero__cloud">
            {CLOUD.map((n, i) => (
              <span
                key={i}
                className="mhero__cnode"
                style={{ left: `${n.x}%`, top: `${n.y}%`, width: `${n.s}px`, height: `${n.s}px`, opacity: n.op }}
              />
            ))}
          </div>
          <span className="mhero__seed">
            <svg viewBox="0 0 140 140">
              <g className="mhero__seed-links">
                <line x1="70" y1="70" x2="70" y2="26" /><line x1="70" y1="70" x2="112" y2="52" />
                <line x1="70" y1="70" x2="104" y2="104" /><line x1="70" y1="70" x2="36" y2="100" />
                <line x1="70" y1="70" x2="28" y2="48" /><line x1="70" y1="26" x2="112" y2="52" />
                <line x1="28" y1="48" x2="36" y2="100" />
              </g>
              <g className="mhero__seed-nodes">
                <circle cx="70" cy="26" r="4" /><circle cx="112" cy="52" r="4" /><circle cx="104" cy="104" r="4" />
                <circle cx="36" cy="100" r="4" /><circle cx="28" cy="48" r="4" />
                <circle cx="70" cy="70" r="7" className="mhero__seed-core" />
              </g>
            </svg>
          </span>
        </div>
        <div className="mhero__vignette" />
      </div>

      <div className="container mhero__copy">
        <p className="eyebrow eyebrow--index mhero__reveal">{eyebrow}</p>
        <div className="mhero__title-wrap">
          <MorphTitle as="h1" text={title} textClass="mhero__title" intro />
        </div>
        <p className="mhero__tease mhero__reveal">{tease}</p>
      </div>

      <div className="mhero__cue" aria-hidden="true"><span>{cue}</span><i /></div>
    </header>
  );
}
