import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { R_NODES, R_LINKS } from './Logo';

/* Réseau piloté par GSAP ScrollTrigger (scrub) : au fil du scroll, les nœuds
   convergent depuis un état dispersé et les liens se tracent. C'est la trame
   de la marque qui « se réorganise au fil du parcours », déclinable par
   section sur toutes les pages. Nettoyage SPA assuré par useGSAP(scope).
   instant() (reduced-motion / onglet caché) => état final, sans animation. */

const SHAPES = {
  // Fil connecteur horizontal : relie une section à la suivante.
  thread: {
    vb: '0 0 1000 130',
    nodes: [
      [38, 74], [150, 34], [284, 90], [412, 42], [540, 80],
      [668, 32], [796, 86], [902, 48], [966, 72],
    ],
    links: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
      [1, 3], [4, 6], [2, 4],
    ],
    hub: 4,
  },
  // Le « R » de la marque.
  R: { vb: '20 14 100 124', nodes: R_NODES, links: R_LINKS, hub: 3 },
};

function scatter(i) {
  const a = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  const b = Math.sin(i * 78.233 + 1.7) * 12543.197;
  return [(a - Math.floor(a)) - 0.5, (b - Math.floor(b)) - 0.5];
}

export default function ScrollNet({ variant = 'thread', className = '', amp = 52 }) {
  const ref = useRef(null);
  const shape = SHAPES[variant] || SHAPES.thread;

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const nodeEls = root.querySelectorAll('.sn-node');
      const linkEls = root.querySelectorAll('.sn-link');

      linkEls.forEach((l) => {
        const len = l.getTotalLength();
        l.style.strokeDasharray = `${len}`;
        l.style.strokeDashoffset = `${len}`;
      });

      if (instant()) {
        gsap.set(nodeEls, { opacity: 1, x: 0, y: 0 });
        linkEls.forEach((l) => { l.style.strokeDashoffset = '0'; });
        return;
      }

      nodeEls.forEach((n, i) => {
        const [sx, sy] = scatter(i);
        gsap.set(n, { x: sx * amp, y: sy * amp, opacity: 0 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 90%',
          end: 'bottom 45%',
          scrub: 0.8,
        },
      });
      tl.to(nodeEls, { x: 0, y: 0, opacity: 1, ease: 'none', stagger: 0.04 }, 0)
        .to(linkEls, { strokeDashoffset: 0, ease: 'none', stagger: 0.04 }, 0.08);
    },
    { scope: ref }
  );

  return (
    <svg
      ref={ref}
      className={`scrollnet scrollnet--${variant} ${className}`}
      viewBox={shape.vb}
      fill="none"
      aria-hidden="true"
    >
      <g>
        {shape.links.map(([a, b], i) => (
          <line
            key={i}
            className="sn-link"
            x1={shape.nodes[a][0]}
            y1={shape.nodes[a][1]}
            x2={shape.nodes[b][0]}
            y2={shape.nodes[b][1]}
          />
        ))}
      </g>
      <g>
        {shape.nodes.map(([x, y], i) => (
          <circle key={i} className="sn-node" cx={x} cy={y} r={i === shape.hub ? 6 : 4} />
        ))}
      </g>
    </svg>
  );
}
