import { useRef, useEffect } from 'react';
import { gsap } from '../lib/gsap';
import { instant } from '../lib/scrub';

const CX = 200;
const CY = 175;

const TOOLS = [
  { x: 72,  y: 52,  label: 'Notion',   anchor: 'middle', ly: 36  },
  { x: 328, y: 52,  label: 'Airtable', anchor: 'middle', ly: 36  },
  { x: 36,  y: 178, label: 'Make',     anchor: 'end',    ly: 195 },
  { x: 364, y: 178, label: 'n8n',      anchor: 'start',  ly: 195 },
  { x: 82,  y: 302, label: 'HubSpot',  anchor: 'middle', ly: 318 },
  { x: 318, y: 302, label: 'Webflow',  anchor: 'middle', ly: 318 },
];

function linelen(t) {
  return Math.ceil(Math.sqrt((CX - t.x) ** 2 + (CY - t.y) ** 2)) + 4;
}

export default function MapAnim() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const lines   = [...svg.querySelectorAll('.ma-line')];
    const nodes   = [...svg.querySelectorAll('.ma-node')];
    const lbls    = [...svg.querySelectorAll('.ma-label')];
    const centerG = svg.querySelector('.ma-center');

    lines.forEach((l, i) => {
      const len = linelen(TOOLS[i]);
      l.setAttribute('stroke-dasharray', len);
      l.setAttribute('stroke-dashoffset', len);
    });

    gsap.set([lines, nodes, lbls, centerG], { autoAlpha: 0 });

    if (instant()) {
      gsap.set([lines, nodes, lbls, centerG], { autoAlpha: 1 });
      lines.forEach(l => l.setAttribute('stroke-dashoffset', '0'));
      return;
    }

    let running = true;

    const runLoop = () => {
      if (!running) return;

      lines.forEach((l, i) => {
        const len = linelen(TOOLS[i]);
        l.setAttribute('stroke-dashoffset', len);
        gsap.set(l, { autoAlpha: 1 });
      });
      gsap.set([nodes, lbls, centerG], { autoAlpha: 0 });

      const tl = gsap.timeline({
        onComplete: () => gsap.delayedCall(0.5, runLoop),
      });

      tl.to(centerG, { autoAlpha: 1, duration: 0.38, ease: 'power2.out' })
        .to(nodes, { autoAlpha: 1, duration: 0.28, stagger: 0.1, ease: 'power2.out' }, 0.25)
        .to(lbls,  { autoAlpha: 1, duration: 0.28, stagger: 0.1, ease: 'power2.out' }, 0.25)
        .to(lines, { strokeDashoffset: 0, duration: 0.52, stagger: 0.1, ease: 'power3.inOut' }, 0.4)
        .to(lines, { autoAlpha: 0, duration: 0.38, stagger: 0.06, ease: 'power2.in' }, '>+2.2')
        .to(nodes, { autoAlpha: 0, duration: 0.28, stagger: 0.06, ease: 'power2.in' }, '<+=0.25')
        .to(lbls,  { autoAlpha: 0, duration: 0.28, stagger: 0.06, ease: 'power2.in' }, '<')
        .to(centerG, { autoAlpha: 0, duration: 0.28, ease: 'power2.in' }, '<+=0.2');
    };

    runLoop();

    return () => {
      running = false;
      gsap.killTweensOf([...lines, ...nodes, ...lbls, centerG]);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 400 352"
      fill="none"
      className="mapanim"
      role="img"
      aria-label="Cartographie de votre système d'information"
    >
      {TOOLS.map((t, i) => (
        <line
          key={`l${i}`}
          className="ma-line"
          x1={t.x} y1={t.y}
          x2={CX}  y2={CY}
          stroke="var(--indigo)"
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      ))}

      {TOOLS.map((t, i) => (
        <g key={`n${i}`}>
          <circle
            className="ma-node"
            cx={t.x} cy={t.y} r="7"
            fill="var(--indigo)"
            fillOpacity="0.1"
            stroke="var(--indigo)"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <text
            className="ma-label"
            x={t.anchor === 'end' ? t.x - 14 : t.anchor === 'start' ? t.x + 14 : t.x}
            y={t.ly}
            textAnchor={t.anchor}
            fill="var(--muted)"
            fontSize="10"
            fontFamily="var(--font)"
            letterSpacing="0.07em"
          >
            {t.label}
          </text>
        </g>
      ))}

      <g className="ma-center">
        <circle cx={CX} cy={CY} r="22" fill="var(--indigo)" />
        <text
          x={CX} y={CY + 5}
          textAnchor="middle"
          fill="var(--cream)"
          fontSize="14"
          fontFamily="var(--font)"
          fontWeight="500"
          letterSpacing="0.04em"
        >
          R
        </text>
      </g>
    </svg>
  );
}
