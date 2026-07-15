import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { R_NODES, R_LINKS, R_SCATTER, linkD } from './Logo';

/* Transition de page — rideau indigo + le R réseau qui s'ASSEMBLE (nœuds
   dispersés qui convergent avec un léger rebond, liens qui se tracent, halo
   qui respire, wordmark qui monte), puis RÉVÉLATION de la nouvelle page :
   le logo grandit et s'efface pendant que le rideau se replie vers le haut. */

const COVER = 'inset(0% 0% 0% 0%)';        // plein écran
const HIDE_UP = 'inset(0% 0% 100% 0%)';    // replié vers le haut = page révélée

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PageTransition() {
  const overlayRef = useRef(null);
  const stageRef = useRef(null);
  const logoRef = useRef(null);
  const wordRef = useRef(null);
  const haloRef = useRef(null);
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  /* Initialise les paths SVG + le listener de clic (couverture) */
  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    const links = logo.querySelectorAll('.pt-link');
    const nodes = logo.querySelectorAll('.pt-node');

    const initLinks = () => {
      links.forEach((l) => {
        const len = l.getTotalLength();
        l.style.strokeDasharray = len;
        l.style.strokeDashoffset = len;
      });
    };
    initLinks();

    const cover = () => {
      gsap.killTweensOf([overlay, stageRef.current, haloRef.current, wordRef.current, ...nodes, ...links]);

      /* Couverture INSTANTANÉE (aucun flash pendant le changement de route) */
      gsap.set(overlay, { clipPath: COVER });
      gsap.set(stageRef.current, { autoAlpha: 1, scale: 1 });
      gsap.set(haloRef.current, { scale: 0.5, autoAlpha: 0 });
      gsap.set(wordRef.current, { autoAlpha: 0, yPercent: 65 });
      nodes.forEach((n) => gsap.set(n, { x: 0, y: 0 }));
      initLinks();

      /* Assemblage chorégraphié du R (resserré pour rester lisible avant la révélation) */
      const tl = gsap.timeline();
      tl.to(haloRef.current, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 0);
      nodes.forEach((n, i) => {
        tl.to(n, {
          x: R_NODES[i][0] - R_SCATTER[i][0],
          y: R_NODES[i][1] - R_SCATTER[i][1],
          ease: 'back.out(1.6)',
          duration: 0.5,
        }, 0.018 * i);
      });
      tl.to(links, { strokeDashoffset: 0, duration: 0.4, stagger: 0.03, ease: 'power1.inOut' }, 0.2);
      tl.to(wordRef.current, { autoAlpha: 0.92, yPercent: 0, duration: 0.42, ease: 'power3.out' }, 0.3);
    };

    const onLinkClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || /^(https?:|mailto:|tel:|#|\/\/)/.test(href)) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      /* Même page : pas de transition (sinon le rideau resterait bloqué) */
      if (a.pathname === window.location.pathname) return;
      if (reduced()) return;
      cover();
    };

    /* Capture : on passe AVANT React Router (qui met à jour l'URL de façon
       synchrone au clic), sinon la garde « même page » verrait déjà la
       nouvelle URL et sauterait toujours la couverture. */
    document.addEventListener('click', onLinkClick, true);
    return () => document.removeEventListener('click', onLinkClick, true);
  }, []);

  /* Révèle la nouvelle page : logo qui grandit/s'efface + rideau qui se replie */
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (reduced()) {
      gsap.set(overlay, { clipPath: HIDE_UP });
      return;
    }

    const tl = gsap.timeline({ delay: 0.58 });
    tl.to(stageRef.current, { scale: 1.16, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0);
    tl.to(overlay, { clipPath: HIDE_UP, duration: 0.62, ease: 'power4.inOut' }, 0.08);
  }, [pathname]);

  return (
    <div ref={overlayRef} className="page-transition" aria-hidden="true">
      <div className="page-transition__stage" ref={stageRef}>
        <span className="page-transition__halo" ref={haloRef} aria-hidden="true" />
        <div className="page-transition__logo">
          <svg
            ref={logoRef}
            className="rlogo rlogo--transition"
            viewBox="0 0 132 150"
            role="presentation"
          >
            <g stroke="var(--cream)" strokeWidth="3" fill="none" strokeLinecap="round">
              {R_LINKS.map((lk, i) => (
                <path key={i} className="pt-link" d={linkD(R_NODES, lk)} />
              ))}
            </g>
            <g fill="var(--cream)">
              {R_NODES.map((_, i) => (
                <circle
                  key={i}
                  className="pt-node"
                  cx={R_SCATTER[i][0]}
                  cy={R_SCATTER[i][1]}
                  r={i === 3 ? 7 : 5.5}
                />
              ))}
            </g>
          </svg>
        </div>
        <span className="page-transition__word" ref={wordRef}>Reskope</span>
      </div>
    </div>
  );
}
