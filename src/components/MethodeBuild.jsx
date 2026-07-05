import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ============================================================
   LA MÉTHODE — L'ATELIER (le système qui s'assemble).

   Identité PROPRE, opposée au Constat : monde CLAIR, et au lieu d'une
   matière qui se morphe sur place, on TOURNE AUTOUR d'un objet 3D qui se
   CONSTRUIT. Chaque jalon = une plaque de verre qui débarque d'une
   direction DIFFÉRENTE et se verrouille dans une pile en profondeur ; la
   caméra orbite au scroll ; le texte accompagne ; un HUD vertical situe.

   0 DISPERSÉ      les outils flottent, épars (avant)
   1 CADRAGE       1re plaque arrive de la gauche : on pose le cadre
   2 AUDIT         2e plaque plonge du haut : on observe
   3 BILAN         3e plaque vient de la droite : on priorise
   4 MISE EN ŒUVRE 4e plaque monte du bas : on exécute
   5 AUTONOMIE     5e plaque sort de la profondeur : le système s'allume

   Tourne aussi sur MOBILE (pas de gate desktop) : responsive, sans
   parallaxe curseur en tactile. reduced-motion / onglet caché => liste.
   ============================================================ */

const JN = 5;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ph = (p, a, b) => clamp01((p - a) / (b - a));
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

/* Frontières d'arrivée des 5 plaques (p 0..1) */
const B = [0.13, 0.30, 0.48, 0.66, 0.83];
const TW = 0.06;
const GAP = 52;                    // écart de profondeur entre plaques empilées

/* Direction d'où débarque chaque plaque (fractions du plateau) + rotation */
const DIR = [
  { x: -1.35, y: -0.15, z: -0.3, rY: 46, rX: 8 },   // 1 · de la gauche
  { x: 0.12, y: -1.30, z: -0.3, rY: -24, rX: 26 },  // 2 · du haut
  { x: 1.35, y: 0.10, z: -0.3, rY: -46, rX: 8 },    // 3 · de la droite
  { x: -0.10, y: 1.28, z: -0.3, rY: 22, rX: -16 },  // 4 · du bas
  { x: 0, y: 0, z: -1.7, rY: 0, rX: 0 },            // 5 · de la profondeur
];

/* Nuage « outils dispersés » de l'intro */
const SEED = Array.from({ length: 18 }, (_, i) => ({
  x: 50 + (rnd(i, 1) - 0.5) * 62,
  y: 50 + (rnd(i, 2) - 0.5) * 54,
  z: (rnd(i, 3) - 0.5) * 260,
  s: 4 + rnd(i, 4) * 4,
}));

/* Petit schéma réseau propre à chaque jalon (dans la plaque) */
const DIAGRAMS = [
  /* 1 Cadrage : le cadre */
  (<g><rect x="20" y="16" width="80" height="48" rx="4" className="d-frame" /><circle cx="20" cy="16" r="4" /><circle cx="100" cy="16" r="4" /><circle cx="100" cy="64" r="4" /><circle cx="20" cy="64" r="4" /></g>),
  /* 2 Audit : la grille observée */
  (<g><g className="d-net"><line x1="30" y1="24" x2="90" y2="24" /><line x1="30" y1="40" x2="90" y2="40" /><line x1="30" y1="56" x2="90" y2="56" /><line x1="30" y1="24" x2="30" y2="56" /><line x1="60" y1="24" x2="60" y2="56" /><line x1="90" y1="24" x2="90" y2="56" /></g>{[24, 40, 56].map((y) => [30, 60, 90].map((x, j) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" className={x === 60 && y === 40 ? 'd-hot' : ''} />))}</g>),
  /* 3 Bilan : les priorités */
  (<g><rect x="22" y="20" width="76" height="8" rx="4" className="d-hot" /><rect x="22" y="36" width="54" height="8" rx="4" /><rect x="22" y="52" width="34" height="8" rx="4" /><circle cx="102" cy="24" r="3.4" /><circle cx="80" cy="40" r="3.4" /><circle cx="60" cy="56" r="3.4" /></g>),
  /* 4 Mise en œuvre : les blocs reliés */
  (<g><g className="d-net"><line x1="34" y1="30" x2="60" y2="30" /><line x1="60" y1="30" x2="60" y2="50" /><line x1="60" y1="50" x2="86" y2="50" /><line x1="86" y1="30" x2="86" y2="50" /></g><rect x="26" y="22" width="16" height="16" rx="3" /><rect x="52" y="22" width="16" height="16" rx="3" className="d-hot" /><rect x="78" y="42" width="16" height="16" rx="3" /></g>),
  /* 5 Autonomie : la boucle fermée */
  (<g><g className="d-net"><path className="d-loop" d="M60 22 C86 22 92 42 78 54 C64 66 40 62 34 46 C29 33 42 22 60 22 Z" fill="none" /></g>{[[60, 22], [86, 32], [78, 54], [46, 58], [34, 40]].map(([x, y], j) => <circle key={j} cx={x} cy={y} r="3.6" className={j === 0 ? 'd-hot' : ''} />)}</g>),
];

export default function MethodeBuild({ jalons, film, labels, locale }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const deckRef = useRef(null);
  const plateRefs = useRef([]);
  const seedRefs = useRef([]);
  const panelRefs = useRef([]);
  const hudFillRef = useRef(null);
  const hudDotRefs = useRef([]);
  const [chapter, setChapter] = useState(0);

  const kickers = locale === 'fr'
    ? ['Dispersé', 'Cadrage', 'Audit', 'Bilan', 'Mise en œuvre', 'Autonomie']
    : ['Scattered', 'Framing', 'Audit', 'Report', 'Delivery', 'Autonomy'];

  useGSAP(() => {
    if (instant()) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    const deck = deckRef.current;
    const plates = plateRefs.current;
    const seeds = seedRefs.current;
    const synthEl = root.querySelector('.mbld__synth');

    let sw = 0, sh = 0;
    const measure = () => { const r = stage.getBoundingClientRect(); sw = r.width; sh = r.height; };
    measure();

    /* Profondeur de départ des nœuds « dispersés » */
    seeds.forEach((el, i) => el && gsap.set(el, { z: SEED[i].z }));

    const bounds = [[0, B[0]], [B[0], B[1]], [B[1], B[2]], [B[2], B[3]], [B[3], B[4]], [B[4], 1]];

    const render = (p) => {
      let k = 0;
      for (let i = 0; i < B.length; i++) if (p >= B[i]) k = i + 1;
      setChapter((c) => (c === k ? c : k));

      const finale = smooth(ph(p, 0.9, 1));

      /* Orbite caméra : on tourne autour de l'assemblage (annulée à la fin) */
      const orbitY = (16 - 40 * smooth(p)) * (1 - finale);
      const orbitX = 5 + 3 * Math.sin(p * Math.PI);
      gsap.set(deck, { rotationY: orbitY, rotationX: orbitX, transformPerspective: 1600 });

      /* Intro : les outils dispersés s'effacent quand la 1re plaque arrive */
      const arr0 = smooth(clamp01(ph(p, B[0] - TW, B[0] + TW)));
      seeds.forEach((el, i) => {
        if (!el) return;
        const drift = Math.sin(p * 20 + i) * 6;
        el.style.transform = `translate(-50%, -50%) translate3d(${drift.toFixed(1)}px, ${(-drift * 0.6).toFixed(1)}px, ${SEED[i].z}px)`;
        el.style.opacity = ((1 - arr0) * 0.7).toFixed(2);
      });

      /* Les 5 plaques : arrivée directionnelle -> verrouillage en pile */
      for (let i = 0; i < JN; i++) {
        const el = plates[i];
        if (!el) return;
        const arr = smooth(clamp01(ph(p, B[i] - TW, B[i] + TW * 1.7)));

        /* recul quand des plaques plus récentes arrivent */
        let pushBack = 0;
        for (let j = i + 1; j < JN; j++) pushBack += smooth(clamp01(ph(p, B[j] - TW, B[j] + TW)));

        /* focus continu : pic pendant le temps fort de cette plaque */
        const c0 = B[i], c1 = i + 1 < JN ? B[i + 1] : 1;
        const center = (c0 + c1) / 2, halfW = (c1 - c0) / 2 + 0.02;
        const focus = arr * clamp01(1 - Math.abs(p - center) / halfW);

        const S = DIR[i];
        const sx = S.x * sw, sy = S.y * sh, sz = S.z * 760;
        const dx = (i - 2) * 6, dy = (i - 2) * 8, dz = -pushBack * GAP + focus * 60;
        const x = sx + (dx - sx) * arr;
        const y = sy + (dy - sy) * arr;
        const z = sz + (dz - sz) * arr;
        const rY = S.rY + ((i - 2) * 3 - S.rY) * arr;
        const rX = S.rX + (11 - 3 * focus - S.rX) * arr;
        const sc = (0.9 + 0.1 * arr) * (1 + focus * 0.05);

        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateX(${rX.toFixed(1)}deg) rotateY(${rY.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
        el.style.opacity = (arr * (0.5 + 0.5 * focus)).toFixed(2);
        el.classList.toggle('is-focus', focus > 0.5);
        el.classList.toggle('is-live', finale > 0.2);
      }

      /* Panneau texte : un contenu par phase (droite desktop / bas mobile) */
      bounds.forEach(([a, b], i) => {
        const el = panelRefs.current[i];
        if (!el) return;
        const inT = i === 0 ? clamp01((p + 0.08) / 0.08) : smooth(ph(p, a - 0.02, a + 0.045));
        const outT = i === 5 ? 0 : smooth(ph(p, b - 0.045, b + 0.02));
        const t = inT * (1 - outT);
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translateY(${(22 * (1 - inT) - 16 * outT).toFixed(1)}px)`;
        el.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
      });

      /* HUD vertical */
      if (hudFillRef.current) hudFillRef.current.style.transform = `scaleY(${clamp01((p - 0.04) / 0.86).toFixed(4)})`;
      hudDotRefs.current.forEach((n, i) => {
        if (!n) return;
        n.classList.toggle('is-on', k - 1 >= i);
        n.classList.toggle('is-active', k - 1 === i);
      });

      /* Synthèse finale */
      gsap.set(synthEl, { autoAlpha: finale, y: 24 * (1 - finale) });
    };

    render(0);
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 6.5,
      pin: stageRef.current,
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onUpdate: (self) => render(self.progress),
    });

    /* Regard curseur (desktop only) sur la couche orbite */
    let onMove = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const orbit = stage.querySelector('.mbld__orbit');
      const rY = gsap.quickTo(orbit, 'rotationY', { duration: 1.2, ease: 'power3.out' });
      const rX = gsap.quickTo(orbit, 'rotationX', { duration: 1.2, ease: 'power3.out' });
      onMove = (e) => { rY((e.clientX / window.innerWidth - 0.5) * 8); rX(-(e.clientY / window.innerHeight - 0.5) * 5); };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    return () => { st.kill(); if (onMove) window.removeEventListener('pointermove', onMove); };
  }, { scope: rootRef, dependencies: [locale] });

  /* ————— Fallback statique (reduced-motion / onglet caché) ————— */
  if (instant()) {
    return (
      <section className="mbld-flat">
        <div className="container">
          <p className="eyebrow eyebrow--index">{film.introKicker}</p>
          <h2 className="mbld-flat__title">{film.introTitle}</h2>
          <p className="mbld-flat__lead">{film.introText}</p>
          <div className="jalons-list">
            {jalons.map((j) => (
              <div className={`jalon-card${j.here ? ' is-here' : ''}`} key={j.n}>
                <span className="jalon-card__num">{j.n}</span>
                <span className="jalon-card__body">
                  <span className="jalon-card__label">
                    {j.label}
                    {j.here && <span className="jalon-card__here">{labels.here}</span>}
                  </span>
                  <h3>{j.title}</h3>
                  <p>{j.text}</p>
                  <p className="jalon-card__deliver"><strong>{labels.youGet} :</strong> {j.deliver}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mbld" ref={rootRef}>
      <div className="mbld__stage" ref={stageRef}>
        <div className="mbld__grain hero2__grain" aria-hidden="true" />

        <div className="mbld__orbit" aria-hidden="true">
          <div className="mbld__deck" ref={deckRef}>
            {/* outils dispersés (intro) */}
            {SEED.map((n, i) => (
              <span
                key={`s${i}`}
                className="mbld__seed"
                ref={(el) => { seedRefs.current[i] = el; }}
                style={{ left: `${n.x}%`, top: `${n.y}%`, width: `${n.s}px`, height: `${n.s}px` }}
              />
            ))}
            {/* les 5 plaques */}
            {jalons.map((j, i) => (
              <div className="mbld__plate" key={j.n} ref={(el) => { plateRefs.current[i] = el; }}>
                <span className="mbld__plate-ghost">{j.n}</span>
                <svg className="mbld__plate-diagram" viewBox="0 0 120 80" aria-hidden="true">{DIAGRAMS[i]}</svg>
                <span className="mbld__plate-label">{j.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HUD vertical : les 5 jalons */}
        <div className="mbld__hud" aria-hidden="true">
          <span className="mbld__hud-line"><i ref={hudFillRef} /></span>
          <span className="mbld__hud-dots">
            {jalons.map((j, i) => (
              <span className="mbld__hud-dot" key={j.n} ref={(el) => { hudDotRefs.current[i] = el; }}>
                <b>{j.n}</b><em>{j.label}</em>
              </span>
            ))}
          </span>
        </div>

        {/* Panneau texte : un par phase */}
        <div className="mbld__panelzone">
          <div className="mbld__panel" ref={(el) => { panelRefs.current[0] = el; }}>
            <p className="mbld__kicker">{kickers[0]}</p>
            <p className="mbld__headline">{film.introTitle}</p>
            <p className="mbld__body">{film.introText}</p>
          </div>
          {jalons.map((j, i) => (
            <div className="mbld__panel" key={j.n} ref={(el) => { panelRefs.current[i + 1] = el; }}>
              <p className="mbld__kicker">
                {labels.milestone} {j.n} · {kickers[i + 1]}
                {j.here && <span className="mbld__here">{labels.here}</span>}
              </p>
              <p className="mbld__headline">{j.title}</p>
              <p className="mbld__body">{j.text}</p>
              <p className="mbld__deliver"><span>{labels.youGet}</span>{j.deliver}</p>
            </div>
          ))}
        </div>

        {/* Synthèse finale */}
        <div className="mbld__synth"><p>{film.synthCap}</p></div>
      </div>
    </section>
  );
}
