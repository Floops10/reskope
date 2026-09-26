import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { makeScrub, pinProgress, instant } from '../lib/scrub';

/* Nœuds du « R » réseau (A, C, D, M, B, F) — signature de la marque. */
export const R_NODES = [
  [36, 30], // A — haut du fût / haut de la boucle
  [92, 30], // C — haut droite
  [104, 62], // D — droite
  [36, 80], // M — jonction (sur le fût)
  [36, 122], // B — bas du fût
  [104, 122], // F — bas de la jambe
];
export const R_LINKS = [
  [0, 3], // A-M (fût haut)
  [3, 4], // M-B (fût bas)
  [0, 1], // A-C (barre haute)
  [1, 2], // C-D (droite)
  [2, 3], // D-M (fermeture de la boucle)
  [3, 5], // M-F (jambe)
];
export const R_SCATTER = [
  [16, 18],
  [116, 10],
  [120, 104],
  [12, 132],
  [70, 146],
  [98, 70],
];

export const linkD = (coords, [a, b]) =>
  `M${coords[a][0]} ${coords[a][1]} L${coords[b][0]} ${coords[b][1]}`;

/* Marque statique (nav, footer, etc.) — hérite de la couleur via currentColor. */
export function LogoMark({ className = '', title = 'Reskope' }) {
  return (
    <svg
      className={`logomark ${className}`}
      viewBox="0 0 132 150"
      role="img"
      aria-label={title}
    >
      <g stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round">
        {R_LINKS.map((lk, i) => (
          <path key={i} d={linkD(R_NODES, lk)} />
        ))}
      </g>
      <g fill="currentColor">
        {R_NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 3 ? 7 : 5.5} />
        ))}
      </g>
    </svg>
  );
}

/* Version qui s'assemble au scroll : nœuds dispersés -> « R », liens qui se tracent.
   Piloté par la progression de scroll du conteneur fourni (hero). */
export function HeroLogo({ containerRef, mode = 'scroll' }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = instant();
    const links = el.querySelectorAll('.rl-link');
    const nodes = el.querySelectorAll('.rl-node');

    links.forEach((l) => {
      const len = l.getTotalLength();
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = reduce ? 0 : len;
    });

    if (reduce) {
      nodes.forEach((n, i) => {
        gsap.set(n, { x: R_NODES[i][0] - R_SCATTER[i][0], y: R_NODES[i][1] - R_SCATTER[i][1] });
      });
      return;
    }

    const scrub = mode === 'scroll';
    const enter = mode === 'enter';
    const tl = gsap.timeline({ paused: scrub || enter, delay: scrub ? 0 : 0.2 });
    nodes.forEach((n, i) => {
      tl.to(
        n,
        {
          x: R_NODES[i][0] - R_SCATTER[i][0],
          y: R_NODES[i][1] - R_SCATTER[i][1],
          ease: 'power2.inOut',
          duration: 0.6,
        },
        0
      );
    });
    tl.to(links, { strokeDashoffset: 0, duration: 0.5, stagger: 0.04, ease: 'power1.inOut' }, 0.35);

    // mode "enter" : la marque se forme quand elle entre dans le viewport
    if (enter) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              tl.play();
              obs.disconnect();
            }
          });
        },
        { rootMargin: '0px 0px -12% 0px' }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        tl.kill();
      };
    }

    if (!scrub) {
      return () => tl.kill();
    }
    const container = containerRef && containerRef.current;
    if (!container) {
      tl.progress(1);
      return () => tl.kill();
    }
    const cleanup = makeScrub(() => pinProgress(container), (p) => tl.progress(p));
    return () => {
      cleanup();
      tl.kill();
    };
  }, [containerRef, mode]);

  return (
    <svg
      ref={root}
      className="rlogo"
      viewBox="0 0 132 150"
      role="img"
      aria-label="Logo Reskope qui se forme au défilement"
    >
      <g className="rlogo__links" stroke="var(--indigo)" strokeWidth="3" fill="none" strokeLinecap="round">
        {R_LINKS.map((lk, i) => (
          <path key={i} className="rl-link" d={linkD(R_NODES, lk)} />
        ))}
      </g>
      <g fill="var(--indigo)">
        {R_NODES.map((_, i) => (
          <circle
            key={i}
            className="rl-node"
            cx={R_SCATTER[i][0]}
            cy={R_SCATTER[i][1]}
            r={i === 3 ? 7 : 5.5}
          />
        ))}
      </g>
    </svg>
  );
}
