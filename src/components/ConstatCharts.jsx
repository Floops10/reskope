import { useRef, useMemo, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ============================================================
   Graphiques du CONSTAT — SVG faits main, langage de la marque.
   Deux modes : autonome (ScrollTrigger à l'entrée en viewport) ou
   PILOTÉ (`active` fourni : le rail décide quand jouer/défaire).
   instant() : état final statique.
   ============================================================ */

function useControlled(active, apiRef) {
  useEffect(() => {
    if (active === undefined) return;
    const api = apiRef.current;
    if (!api) return;
    if (active) api.play();
    else api.reset();
  }, [active, apiRef]);
}

/* — Donut 28 % + 19 % (mode autonome uniquement, hors rail) — */
export function Donut47() {
  const ref = useRef(null);
  const R = 74;
  const C = 2 * Math.PI * R;
  const segA = C * 0.28;
  const segB = C * 0.19;

  useGSAP(() => {
    const [a, b] = ref.current.querySelectorAll('.dn-seg');
    if (instant()) {
      a.style.strokeDasharray = `${segA} ${C}`;
      b.style.strokeDasharray = `${segB} ${C}`;
      return;
    }
    gsap.set(a, { strokeDasharray: `0 ${C}` });
    gsap.set(b, { strokeDasharray: `0 ${C}` });
    const st = { trigger: ref.current, start: 'top 80%' };
    gsap.to(a, { strokeDasharray: `${segA} ${C}`, duration: 1.1, ease: 'power3.inOut', scrollTrigger: st });
    gsap.to(b, { strokeDasharray: `${segB} ${C}`, duration: 1.1, ease: 'power3.inOut', delay: 0.35, scrollTrigger: st });
  }, { scope: ref });

  return (
    <svg ref={ref} className="donut47" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r={R} className="dn-rest" />
      <circle cx="100" cy="100" r={R} className="dn-seg dn-seg--a" transform="rotate(-90 100 100)" />
      <circle cx="100" cy="100" r={R} className="dn-seg dn-seg--b" transform={`rotate(${-90 + 0.28 * 360} 100 100)`} />
      <circle cx="100" cy="26" r="5" className="dn-node" />
    </svg>
  );
}

/* — Barre 58 / 42 : coordination vs vrai métier — */
export function SplitBar({ a = 58, b = 42, la, lb, active }) {
  const ref = useRef(null);
  const apiRef = useRef(null);

  useGSAP(() => {
    const fill = ref.current.querySelector('.sb-fill');
    if (instant()) {
      fill.style.transform = 'scaleX(1)';
      return;
    }
    gsap.set(fill, { scaleX: 0 });
    const play = () => gsap.to(fill, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', overwrite: true });
    const reset = () => gsap.to(fill, { scaleX: 0, duration: 0.35, ease: 'power2.in', overwrite: true });
    apiRef.current = { play, reset };
    if (active === undefined) {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 82%', onEnter: play, onLeaveBack: reset });
    }
  }, { scope: ref });
  useControlled(active, apiRef);

  return (
    <div className="splitbar" ref={ref} aria-hidden="true">
      <div className="splitbar__labels">
        <span>{la} · {a} %</span>
        <span>{lb} · {b} %</span>
      </div>
      <div className="splitbar__track">
        <span className="sb-fill" style={{ width: `${a}%` }} />
      </div>
    </div>
  );
}

/* — 47 semaines, dont N englouties — */
export function WeeksBar({ total = 47, filled = 6, unit, active }) {
  const ref = useRef(null);
  const apiRef = useRef(null);

  useGSAP(() => {
    const bars = ref.current.querySelectorAll('.wk--lost');
    if (instant()) return;
    gsap.set(bars, { scaleY: 0, transformOrigin: '50% 100%' });
    const play = () => gsap.to(bars, { scaleY: 1, duration: 0.5, ease: 'back.out(1.8)', stagger: 0.09, overwrite: true });
    const reset = () => gsap.to(bars, { scaleY: 0, duration: 0.3, ease: 'power2.in', overwrite: true });
    apiRef.current = { play, reset };
    if (active === undefined) {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 82%', onEnter: play, onLeaveBack: reset });
    }
  }, { scope: ref });
  useControlled(active, apiRef);

  return (
    <div className="weeksbar" ref={ref} aria-hidden="true">
      <div className="weeksbar__bars">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`wk${i < filled ? ' wk--lost' : ''}`} />
        ))}
      </div>
      <p className="weeksbar__caption">≈ {filled} {unit} / {total}</p>
    </div>
  );
}

/* — Zigzag des bascules — */
export function ToggleSpark({ active }) {
  const ref = useRef(null);
  const apiRef = useRef(null);
  const d = useMemo(() => {
    const peaks = 26;
    const w = 320, h = 56;
    let path = `M0 ${h - 6}`;
    for (let i = 1; i <= peaks; i++) {
      const x = (i / peaks) * w;
      const y = i % 2 === 1 ? 6 : h - 6;
      path += ` L${x.toFixed(1)} ${y}`;
    }
    return path;
  }, []);

  useGSAP(() => {
    const line = ref.current.querySelector('.tg-line');
    const dot = ref.current.querySelector('.tg-dot');
    if (instant()) {
      line.style.strokeDashoffset = '0';
      return;
    }
    line.style.strokeDasharray = '1';
    line.style.strokeDashoffset = '1';
    const pulse = gsap.to(dot, {
      scale: 1.6, transformOrigin: '50% 50%', repeat: -1, yoyo: true,
      duration: 0.6, ease: 'power1.inOut', paused: true,
    });
    const play = () => {
      gsap.to(line, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut', overwrite: true });
      pulse.play();
    };
    const reset = () => {
      gsap.to(line, { strokeDashoffset: 1, duration: 0.35, ease: 'power2.in', overwrite: true });
      pulse.pause(0);
    };
    apiRef.current = { play, reset };
    if (active === undefined) {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 82%', onEnter: play, onLeaveBack: reset });
    }
  }, { scope: ref });
  useControlled(active, apiRef);

  return (
    <svg ref={ref} className="togglespark" viewBox="0 0 320 56" aria-hidden="true">
      <path className="tg-line" d={d} pathLength="1" />
      <circle className="tg-dot" cx="320" cy="50" r="5" />
    </svg>
  );
}

/* — 93 applications : la grille qui déborde — */
export function AppsGrid({ total = 93, active }) {
  const ref = useRef(null);
  const apiRef = useRef(null);
  const cols = 13;

  useGSAP(() => {
    const dots = ref.current.querySelectorAll('.ag-dot');
    if (instant()) return;
    gsap.set(dots, { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' });
    const play = () => gsap.to(dots, {
      scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2)',
      stagger: { each: 0.012, from: 'random' }, overwrite: true,
    });
    const reset = () => gsap.to(dots, { scale: 0, autoAlpha: 0, duration: 0.25, overwrite: true });
    apiRef.current = { play, reset };
    if (active === undefined) {
      ScrollTrigger.create({ trigger: ref.current, start: 'top 82%', onEnter: play, onLeaveBack: reset });
    }
  }, { scope: ref });
  useControlled(active, apiRef);

  return (
    <div className="appsgrid" ref={ref} aria-hidden="true" style={{ '--ag-cols': cols }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className="ag-dot" style={{ opacity: 0.4 + 0.6 * ((i % 7) / 6) }} />
      ))}
    </div>
  );
}
