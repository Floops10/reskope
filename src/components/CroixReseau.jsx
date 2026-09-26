/* ════════════════════════════════════════════════════════════
   LA CROIX DE FERMETURE, dessinée comme le reste de la marque.

   Le burger du menu, ce sont deux liens avec un nœud à chaque bout. La croix
   parle la même langue : quatre liens qui partent d'un nœud central (la
   jonction, un peu plus grosse, comme au milieu du R), un nœud à chaque bout.
   Au survol, les bras se resserrent vers le centre, comme les nœuds du burger
   glissent vers l'intérieur.

   Les liens partent du centre : le menu les fait pousser à l'ouverture
   (stroke-dashoffset), et les nœuds apparaissent au bout.
   ════════════════════════════════════════════════════════════ */

const C = 12;
const BOUT = 4.5;
const RESSERRE = 1.3;
const BRAS = [
  [BOUT, BOUT],
  [24 - BOUT, BOUT],
  [24 - BOUT, 24 - BOUT],
  [BOUT, 24 - BOUT],
];

export default function CroixReseau({ className = '' }) {
  return (
    <svg className={`croix ${className}`} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {BRAS.map(([x, y], i) => (
        <g
          key={i}
          className="croix__bras"
          style={{ '--dx': `${Math.sign(C - x) * RESSERRE}px`, '--dy': `${Math.sign(C - y) * RESSERRE}px` }}
        >
          <line className="croix__lien" x1={C} y1={C} x2={x} y2={y} strokeDasharray="11" />
          <circle className="croix__n" cx={x} cy={y} r="2.5" />
        </g>
      ))}
      <circle className="croix__coeur" cx={C} cy={C} r="3.2" />
    </svg>
  );
}
