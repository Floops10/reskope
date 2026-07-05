import { useRef, useMemo } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* WeekDrain — la semaine de travail en 5 colonnes de nœuds. La part basse
   (53 %) = travail réel, solide. La part haute (47 %) = temps évaporé : ses
   nœuds « tombent » lentement et s'estompent, en boucle — le temps qui fuit.
   Langage réseau de la marque. instant() : état posé, sans boucle. */
const DAYS = ['L', 'M', 'M', 'J', 'V'];
const PER_COL = 11;      // nœuds par jour
const LOST = 0.47;

export default function WeekDrain() {
  const ref = useRef(null);

  const cols = useMemo(() => {
    return DAYS.map((d, ci) => {
      const nodes = Array.from({ length: PER_COL }, (_, i) => {
        const frac = i / (PER_COL - 1);       // 0 bas → 1 haut
        return { lost: frac > 1 - LOST, frac, ci, i };
      });
      return { d, nodes };
    });
  }, []);

  useGSAP(() => {
    const root = ref.current;
    const kept = root.querySelectorAll('.wd-node--kept');
    const lost = root.querySelectorAll('.wd-node--lost');
    const links = root.querySelectorAll('.wd-link');
    const boundary = root.querySelectorAll('.wd-boundary');

    if (instant()) return;

    // Montée des colonnes (du bas vers le haut)
    gsap.from([...kept, ...lost], {
      scale: 0, autoAlpha: 0, transformOrigin: '50% 50%',
      duration: 0.5, ease: 'back.out(1.7)',
      stagger: { each: 0.012, from: 'end', grid: 'auto' },
      scrollTrigger: { trigger: root, start: 'top 82%' },
    });
    gsap.from(links, {
      scaleY: 0, transformOrigin: '50% 100%',
      duration: 0.5, ease: 'power2.out', stagger: 0.02,
      scrollTrigger: { trigger: root, start: 'top 82%' },
    });
    boundary.forEach((b) => { b.style.strokeDasharray = '1'; b.style.strokeDashoffset = '1'; });
    gsap.to(boundary, {
      strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', delay: 0.4,
      scrollTrigger: { trigger: root, start: 'top 82%' },
    });

    // Drain continu : les nœuds « perdus » tombent et se régénèrent
    lost.forEach((n, i) => {
      gsap.to(n, {
        y: 16, autoAlpha: 0.15,
        duration: 1.4 + (i % 5) * 0.2,
        ease: 'power1.in',
        repeat: -1, yoyo: true, delay: (i % 7) * 0.18,
        scrollTrigger: { trigger: root, start: 'top 85%' },
      });
    });
  }, { scope: ref });

  // Géométrie SVG
  const W = 260, H = 320, pad = 26;
  const colW = (W - pad * 2) / DAYS.length;
  const usableH = H - pad * 2 - 24;
  const gap = usableH / (PER_COL - 1);
  const yOf = (frac) => pad + usableH - frac * usableH;
  const xOf = (ci) => pad + colW * ci + colW / 2;

  return (
    <svg ref={ref} className="weekdrain" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {/* liens verticaux (le fût de chaque jour) */}
      {cols.map((col, ci) => (
        <line
          key={`l${ci}`} className="wd-link"
          x1={xOf(ci)} y1={yOf(0)} x2={xOf(ci)} y2={yOf(1)}
        />
      ))}
      {/* ligne de bascule 47 % */}
      <path
        className="wd-boundary" pathLength="1"
        d={`M${pad - 6} ${yOf(1 - LOST)} L${W - pad + 6} ${yOf(1 - LOST)}`}
      />
      {/* nœuds */}
      {cols.map((col) =>
        col.nodes.map((n) => (
          <circle
            key={`${n.ci}-${n.i}`}
            className={`wd-node wd-node--${n.lost ? 'lost' : 'kept'}`}
            cx={xOf(n.ci)} cy={yOf(n.frac)} r={n.frac > 1 - LOST ? 3 : 3.6}
          />
        ))
      )}
      {/* labels jours */}
      {cols.map((col, ci) => (
        <text key={`t${ci}`} className="wd-day" x={xOf(ci)} y={H - 8}>{col.d}</text>
      ))}
    </svg>
  );
}
