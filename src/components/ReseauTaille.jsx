import { useMemo } from 'react';

/* ════════════════════════════════════════════════════════════
   LA TAILLE D'UNE ENTREPRISE, DESSINÉE EN RÉSEAU.

   Un point seul pour un projet (et, en pointillé, les clients qu'il va
   chercher), un petit réseau pour une TPE, un grand pour une PME. On lit la
   différence avant d'avoir lu un mot : c'est le réseau de la marque qui
   grandit avec l'entreprise.

   Les nœuds sont posés en spirale (l'angle d'or), chacun relié à ses deux
   plus proches voisins déjà posés : le dessin est toujours le même, et il a
   l'air d'avoir poussé plutôt que d'avoir été rangé.
   ════════════════════════════════════════════════════════════ */

const OR = Math.PI * (3 - Math.sqrt(5));

export default function ReseauTaille({ n, className = '' }) {
  const dessin = useMemo(() => {
    if (n <= 1) {
      /* Le projet, et les clients qu'il n'a pas encore. */
      const futurs = [0, 1, 2, 3, 4].map((i) => {
        const a = -Math.PI / 2 + (i / 5) * Math.PI * 2 + 0.3;
        return [Math.cos(a) * 30, Math.sin(a) * 30];
      });
      return {
        noeuds: [{ x: 0, y: 0, r: 7 }],
        futurs,
        liens: futurs.map(([x, y]) => ({ x1: 0, y1: 0, x2: x, y2: y, futur: true })),
      };
    }
    const k = 40 / Math.sqrt(n);
    const noeuds = Array.from({ length: n }, (_, i) => {
      const r = k * Math.sqrt(i + 0.5);
      const a = i * OR;
      return { x: Math.cos(a) * r, y: Math.sin(a) * r, r: i === 0 ? 5.6 : 3.2 + (i % 3) * 0.5 };
    });
    const liens = [];
    for (let i = 1; i < n; i++) {
      const proches = noeuds
        .slice(0, i)
        .map((m, j) => ({ j, d: Math.hypot(m.x - noeuds[i].x, m.y - noeuds[i].y) }))
        .sort((u, v) => u.d - v.d)
        .slice(0, 2);
      proches.forEach(({ j }) => liens.push({ x1: noeuds[j].x, y1: noeuds[j].y, x2: noeuds[i].x, y2: noeuds[i].y }));
    }
    return { noeuds, futurs: [], liens };
  }, [n]);

  return (
    <svg className={`rt ${className}`} viewBox="-50 -50 100 100" aria-hidden="true">
      <g className="rt__liens">
        {dessin.liens.map((l, i) => (
          <line key={i} className={`rt__l${l.futur ? ' rt__l--futur' : ''}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>
      {dessin.futurs.map(([x, y], i) => (
        <circle key={`f${i}`} className="rt__n rt__n--futur" cx={x} cy={y} r="4.2" />
      ))}
      {dessin.noeuds.map((m, i) => (
        <circle key={i} className={`rt__n${i === 0 ? ' rt__n--coeur' : ''}`} cx={m.x} cy={m.y} r={m.r} />
      ))}
    </svg>
  );
}
