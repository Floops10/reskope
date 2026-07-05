import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { R_NODES, R_LINKS, R_SCATTER, linkD } from './Logo';

/* Transition de page — overlay indigo + R qui s'assemble, puis wipe top→bottom. */
export default function PageTransition() {
  const overlayRef = useRef(null);
  const logoRef    = useRef(null);
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  /* Initialise les paths SVG et attache le listener de clic */
  useEffect(() => {
    const overlay = overlayRef.current;
    const logo    = logoRef.current;
    if (!overlay || !logo) return;

    const links = logo.querySelectorAll('.pt-link');
    const nodes = logo.querySelectorAll('.pt-node');

    const initLinks = () => {
      links.forEach((l) => {
        const len = l.getTotalLength();
        l.style.strokeDasharray  = len;
        l.style.strokeDashoffset = len;
      });
    };
    initLinks();

    const reset = () => {
      nodes.forEach((n) => gsap.set(n, { x: 0, y: 0 }));
      initLinks();
    };

    const onLinkClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || /^(https?:|mailto:|#|\/\/)/.test(href)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      reset();
      gsap.set(overlay, { scaleY: 1 });

      /* Nœuds volent vers leur position finale */
      const tl = gsap.timeline();
      nodes.forEach((n, i) => {
        tl.to(n, {
          x: R_NODES[i][0] - R_SCATTER[i][0],
          y: R_NODES[i][1] - R_SCATTER[i][1],
          ease: 'power2.inOut',
          duration: 0.42,
        }, 0);
      });
      tl.to(links, {
        strokeDashoffset: 0,
        duration: 0.36,
        stagger: 0.032,
        ease: 'power1.inOut',
      }, 0.22);
    };

    document.addEventListener('click', onLinkClick);
    return () => document.removeEventListener('click', onLinkClick);
  }, []);

  /* Révèle la nouvelle page en effaçant l'overlay */
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(overlayRef.current, { scaleY: 0 });
      return;
    }
    /* Délai 0.38s — laisse le R finir de se former avant de wiper */
    gsap.fromTo(
      overlayRef.current,
      { scaleY: 1, transformOrigin: 'top center' },
      { scaleY: 0, duration: 0.6, ease: 'power4.inOut', delay: 0.38 }
    );
  }, [pathname]);

  return (
    <div ref={overlayRef} className="page-transition" aria-hidden="true">
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
    </div>
  );
}
