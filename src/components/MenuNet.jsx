import { useEffect, useRef } from 'react';
import { R_NODES, R_LINKS } from './Logo';

/* Réseau « R » de la marque qui s'assemble à l'ouverture du menu :
   les nœuds convergent depuis un état dispersé, les liens se tracent.
   Tout est piloté en CSS via la classe .is-on (état du menu). */

const AMB = [
  [12, 58], [150, 28], [180, 86], [150, 150],
  [70, 168], [18, 140], [120, 8], [206, 140],
];
const NODES = [...R_NODES, ...AMB];
const HUB = 3; // nœud de jonction du R
const LINKS = [
  ...R_LINKS,
  [6, 3], [1, 7], [2, 8], [5, 9], [4, 10], [3, 11], [7, 12], [8, 13],
];

/* Décalage déterministe (pas de random) : état « dispersé » autour de la cible. */
function scatter(i) {
  const a = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  const b = Math.sin(i * 78.233 + 1.7) * 12543.197;
  return [((a - Math.floor(a)) - 0.5) * 80, ((b - Math.floor(b)) - 0.5) * 80];
}

export default function MenuNet({ open }) {
  const ref = useRef(null);

  useEffect(() => {
    const lines = ref.current?.querySelectorAll('.mn-link') ?? [];
    lines.forEach((l) => {
      const x1 = +l.getAttribute('x1');
      const y1 = +l.getAttribute('y1');
      const x2 = +l.getAttribute('x2');
      const y2 = +l.getAttribute('y2');
      const len = Math.hypot(x2 - x1, y2 - y1);
      l.style.strokeDasharray = `${len}`;
      l.style.setProperty('--len', `${len}`);
    });
  }, []);

  return (
    <svg
      ref={ref}
      className={`menunet${open ? ' is-on' : ''}`}
      viewBox="0 0 224 186"
      fill="none"
      aria-hidden="true"
    >
      <g className="mn-links">
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            className="mn-link"
            style={{ '--i': i }}
            x1={NODES[a][0]}
            y1={NODES[a][1]}
            x2={NODES[b][0]}
            y2={NODES[b][1]}
          />
        ))}
      </g>
      <g className="mn-nodes">
        {NODES.map(([x, y], i) => {
          const [sx, sy] = scatter(i);
          return (
            <circle
              key={i}
              className="mn-node"
              style={{ '--i': i, '--sx': `${sx}px`, '--sy': `${sy}px` }}
              cx={x}
              cy={y}
              r={i === HUB ? 5 : i < 6 ? 4 : 3}
            />
          );
        })}
      </g>
    </svg>
  );
}
