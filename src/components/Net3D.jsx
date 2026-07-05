import { useRef, useEffect } from 'react';
import { instant } from '../lib/scrub';
import { project } from '../lib/net3d';

/* Net3D — rend un objet réseau en VRAI volume (nœuds [x,y,z] + liens),
   tourné dans l'espace et projeté en perspective à chaque frame : les
   nœuds parallaxent entre eux, les liens suivent — un solide, pas un
   dessin plat incliné. Rotation continue organique (tumble).
   reduced-motion / onglet caché : une pose 3D figée lisible. */
export default function Net3D({
  shape,
  size = 160,
  speed = 1,
  tiltX = 0.6,
  nodeR = 3,
  focal = 380,
  className = '',
  style,
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const nodeEls = [...svg.querySelectorAll('.n3d-node')];
    const linkEls = [...svg.querySelectorAll('.n3d-link')];

    const render = (ax, ay) => {
      const proj = project(shape.nodes, ax, ay, focal);
      let zMin = Infinity, zMax = -Infinity;
      proj.forEach((p) => { if (p.z < zMin) zMin = p.z; if (p.z > zMax) zMax = p.z; });
      const span = Math.max(zMax - zMin, 1);
      for (let i = 0; i < nodeEls.length; i++) {
        const p = proj[i];
        const el = nodeEls[i];
        const zn = 1 - (p.z - zMin) / span; // 1 = proche
        const r = (i === shape.hub || i === shape.hub2 ? nodeR * 1.55 : nodeR) * p.s;
        el.setAttribute('cx', p.x.toFixed(2));
        el.setAttribute('cy', p.y.toFixed(2));
        el.setAttribute('r', r.toFixed(2));
        el.style.opacity = (0.34 + 0.66 * zn).toFixed(3);
      }
      for (let k = 0; k < linkEls.length; k++) {
        const [a, b] = shape.links[k];
        const pa = proj[a], pb = proj[b];
        const el = linkEls[k];
        el.setAttribute('d', `M${pa.x.toFixed(2)} ${pa.y.toFixed(2)} L${pb.x.toFixed(2)} ${pb.y.toFixed(2)}`);
        const zn = 1 - ((pa.z + pb.z) / 2 - zMin) / span;
        el.style.opacity = (0.16 + 0.5 * zn).toFixed(3);
      }
    };

    if (instant()) {
      render(0.45, 0.8);
      return;
    }

    let ay = Math.random() * Math.PI * 2;
    let raf;
    const tick = () => {
      ay += 0.0065 * speed;
      const ax = 0.3 + Math.sin(ay * 0.7) * 0.28 * tiltX; // tumble organique
      render(ax, ay);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shape, speed, tiltX, nodeR, focal]);

  return (
    <div className={`n3d ${className}`} style={{ width: size, height: size, ...style }} aria-hidden="true">
      <svg ref={svgRef} viewBox="-70 -70 140 140">
        <g>{shape.links.map((_, i) => <path key={i} className="n3d-link" />)}</g>
        <g>{shape.nodes.map((_, i) => <circle key={i} className="n3d-node" />)}</g>
      </svg>
    </div>
  );
}
