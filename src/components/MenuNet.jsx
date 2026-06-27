import { useEffect, useRef } from 'react';
import { R_NODES, R_LINKS } from './Logo';

/* Le « R » de la marque qui s'assemble à l'ouverture du menu : les nœuds
   convergent depuis un état dispersé, les liens se tracent. Forme propre,
   strictement le R (pas de nœuds parasites). Piloté CSS via .is-on. */

const HUB = 3; // jonction du R

/* Décalage déterministe (pas de random) : état « dispersé » autour de la cible. */
function scatter(i) {
  const a = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  const b = Math.sin(i * 78.233 + 1.7) * 12543.197;
  return [((a - Math.floor(a)) - 0.5) * 64, ((b - Math.floor(b)) - 0.5) * 64];
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
      viewBox="8 6 124 140"
      fill="none"
      aria-hidden="true"
    >
      <g className="mn-links">
        {R_LINKS.map(([a, b], i) => (
          <line
            key={i}
            className="mn-link"
            style={{ '--i': i }}
            x1={R_NODES[a][0]}
            y1={R_NODES[a][1]}
            x2={R_NODES[b][0]}
            y2={R_NODES[b][1]}
          />
        ))}
      </g>
      <g className="mn-nodes">
        {R_NODES.map(([x, y], i) => {
          const [sx, sy] = scatter(i);
          return (
            <circle
              key={i}
              className="mn-node"
              style={{ '--i': i, '--sx': `${sx}px`, '--sy': `${sy}px` }}
              cx={x}
              cy={y}
              r={i === HUB ? 6 : 5}
            />
          );
        })}
      </g>
    </svg>
  );
}
