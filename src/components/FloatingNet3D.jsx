import { useRef, useEffect, useMemo } from 'react';
import { instant } from '../lib/scrub';

/* FloatingNet3D — un objet RÉSEAU en vraie 3D : des nœuds répartis sur une
   sphère (Fibonacci) reliés à leurs voisins, tournés dans l'espace image par
   image (rotation X/Y + projection perspective) → l'objet tourne à 360° sur
   lui-même. Le conteneur flotte (dérive douce en CSS). Profondeur rendue par
   la taille/opacité des nœuds selon z. Adapté à la DA réseau (indigo).
   reduced-motion / onglet caché : une pose 3D figée, lisible. */

const R = 100;
const F = 360; // focale perspective

function spherePoints(n) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push([Math.cos(theta) * rad * R, y * R, Math.sin(theta) * rad * R]);
  }
  return pts;
}

function proximityEdges(pts, factor) {
  const maxD = R * factor;
  const e = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]);
      if (d < maxD) e.push([i, j]);
    }
  }
  return e;
}

export default function FloatingNet3D({
  points = 15,
  size = 200,
  edgeFactor = 1.02,
  speed = 1,
  tiltX = 0.35,
  className = '',
  style,
}) {
  const svgRef = useRef(null);
  const base = useMemo(() => {
    const pts = spherePoints(points);
    return { pts, edges: proximityEdges(pts, edgeFactor) };
  }, [points, edgeFactor]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const nodeEls = [...svg.querySelectorAll('.fn-node')];
    const linkEls = [...svg.querySelectorAll('.fn-link')];
    let ax = 0.5;
    let ay = 0.3;
    let raf = null;

    const render = () => {
      const cy = Math.cos(ay), sy = Math.sin(ay);
      const cx = Math.cos(ax), sx = Math.sin(ax);
      const proj = base.pts.map(([x, y, z]) => {
        // rotation Y
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        // rotation X
        const y1 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const s = F / (F + z2);
        return { x: x1 * s, y: y1 * s, z: z2, s };
      });
      for (let i = 0; i < nodeEls.length; i++) {
        const p = proj[i];
        const el = nodeEls[i];
        el.setAttribute('cx', p.x.toFixed(2));
        el.setAttribute('cy', p.y.toFixed(2));
        el.setAttribute('r', (2.6 * p.s).toFixed(2));
        el.style.opacity = (0.35 + 0.65 * ((p.z + R) / (2 * R))).toFixed(3);
      }
      for (let k = 0; k < linkEls.length; k++) {
        const [a, b] = base.edges[k];
        const pa = proj[a], pb = proj[b];
        const el = linkEls[k];
        el.setAttribute('d', `M${pa.x.toFixed(2)} ${pa.y.toFixed(2)} L${pb.x.toFixed(2)} ${pb.y.toFixed(2)}`);
        el.style.opacity = (0.12 + 0.4 * (((pa.z + pb.z) / 2 + R) / (2 * R))).toFixed(3);
      }
    };

    render();
    if (instant()) return;

    const tick = () => {
      ay += 0.0055 * speed;
      ax += 0.0055 * speed * tiltX;
      render();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [base, speed, tiltX]);

  const VB = 280;
  return (
    <div className={`fnet ${className}`} style={{ width: size, height: size, ...style }} aria-hidden="true">
      <svg ref={svgRef} viewBox={`${-VB / 2} ${-VB / 2} ${VB} ${VB}`}>
        <g className="fn-links">
          {base.edges.map((_, i) => <path key={i} className="fn-link" />)}
        </g>
        <g className="fn-nodes">
          {base.pts.map((_, i) => <circle key={i} className="fn-node" />)}
        </g>
      </svg>
    </div>
  );
}
