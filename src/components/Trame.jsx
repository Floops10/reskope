import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { makeScrub, scrollProgress, instant } from '../lib/scrub';

const NODES = [
  [80, 90],
  [200, 60],
  [320, 110],
  [120, 200],
  [280, 195],
  [70, 305],
  [200, 250],
  [330, 300],
  [200, 200],
];
const LINKS = [
  [0, 1], [1, 2], [0, 3], [2, 4], [3, 8], [4, 8],
  [1, 8], [6, 8], [3, 5], [4, 7], [5, 6], [6, 7],
];

export default function Trame() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = instant();
    const links = el.querySelectorAll('.trame-link');
    const nodes = el.querySelectorAll('.trame-node');

    links.forEach((l) => {
      const len = l.getTotalLength();
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = reduce ? 0 : len;
    });

    if (reduce) {
      gsap.set(nodes, { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(nodes, { opacity: 0, scale: 0, transformOrigin: 'center' });
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to(links, { strokeDashoffset: 0, duration: 1.1, stagger: 0.06 }, 0).to(
        nodes,
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05 },
        0.35
      );
    }, el);

    const cleanup = makeScrub(scrollProgress, (p) =>
      gsap.set(el, { yPercent: -7 * p })
    );

    return () => {
      cleanup();
      ctx.revert();
    };
  }, []);

  return (
    <svg
      ref={root}
      className="trame"
      viewBox="0 0 400 400"
      role="img"
      aria-label="Schéma d'un système numérique structuré : des nœuds reliés par des connexions nettes."
    >
      {LINKS.map(([a, b], i) => (
        <path
          key={i}
          className="trame-link"
          strokeWidth="1.25"
          d={`M${NODES[a][0]} ${NODES[a][1]} L${NODES[b][0]} ${NODES[b][1]}`}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <circle key={i} className="trame-node" cx={x} cy={y} r={i === 8 ? 7 : 5} />
      ))}
    </svg>
  );
}
