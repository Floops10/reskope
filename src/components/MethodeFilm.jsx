import { useRef, useMemo, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { useMediaQuery } from '../hooks/useMediaQuery';

/* ============================================================
   LA MÉTHODE — DU DÉSORDRE AU SYSTÈME (le parcours).

   UNE SEULE matière : 88 nœuds qui, au scroll, passent du chaos
   à un système ordonné, jalon par jalon. Le même « parc d'outils »
   se réorganise sous vos yeux, c'est ça qui rend la méthode lisible :

   0 AUJOURD'HUI   nuage éparpillé, mal relié (avant)
   1 CADRAGE       un cadre se dessine : on définit le terrain de jeu
   2 AUDIT         un balayage observe chaque nœud (salarié par salarié)
   3 BILAN         les nœuds se trient en 3 priorités (diagnostic classé)
   4 MISE EN ŒUVRE ils s'alignent dans une grille : quick wins d'abord
   5 AUTONOMIE     la grille se câble en système stable qui tient seul

   Le plateau est en vraie profondeur (rotationX/Y + translateZ par
   scène, regard curseur). Un PANNEAU unique porte le jalon courant ;
   une frise de 5 stations situe le parcours (« vous démarrez ici » sur
   l'audit). Mobile / reduced / onglet caché : liste des jalons lisible.
   ============================================================ */

const N = 88;
const COLS = 11;
const ROWS = 8;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ph = (p, a, b) => clamp01((p - a) / (b - a));
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

/* Frontières des 6 scènes sur p 0..1 */
const B = [0.13, 0.29, 0.47, 0.66, 0.85];
const TW = 0.05;                 // demi-fenêtre de morph

/* Grille cible (le système) */
const gx = (c) => 0.13 + 0.74 * (c / (COLS - 1));
const gy = (r) => 0.20 + 0.60 * (r / (ROWS - 1));

/* Caméra par scène : [rotationX, rotationY, translateZ] — on descend
   d'un regard plongeant (chaos) vers une vue frontale (système ordonné) */
const CAM = [
  [15, -5, -60],
  [11, 4, -22],
  [6, -3, 0],
  [9, 3, -8],
  [4, -2, 8],
  [0, 0, 16],
];

function buildLayouts() {
  const L = Array.from({ length: 6 }, () => Array(N));
  const cell = (i) => [i % COLS, Math.floor(i / COLS)];

  /* 0 · Aujourd'hui : nuage éparpillé en amas */
  for (let i = 0; i < N; i++) {
    const ang = rnd(i, 1) * Math.PI * 2;
    const rad = 0.10 + rnd(i, 2) * 0.34;
    L[0][i] = [clamp01(0.5 + Math.cos(ang) * rad * 1.2), clamp01(0.5 + Math.sin(ang) * rad * 0.95)];
  }

  /* 1 · Cadrage : grille lâche contenue dans un cadre centré */
  for (let i = 0; i < N; i++) {
    const [c, r] = cell(i);
    const fx = 0.26 + 0.48 * (c / (COLS - 1));
    const fy = 0.26 + 0.48 * (r / (ROWS - 1));
    L[1][i] = [fx + (rnd(i, 3) - 0.5) * 0.04, fy + (rnd(i, 4) - 0.5) * 0.05];
  }

  /* 2 · Audit : carte étendue, légèrement irrégulière (le vrai quotidien) */
  for (let i = 0; i < N; i++) {
    const [c, r] = cell(i);
    L[2][i] = [gx(c) + (rnd(i, 5) - 0.5) * 0.022, gy(r) + (rnd(i, 6) - 0.5) * 0.03];
  }

  /* 3 · Bilan : tri en 3 tiers de priorité */
  const orderByPrio = Array.from({ length: N }, (_, i) => i).sort((a, b) => rnd(a, 7) - rnd(b, 7));
  const nA = Math.round(N * 0.18);          // priorités hautes
  const nB = Math.round(N * 0.34);          // priorités moyennes
  const tierY = [0.30, 0.52, 0.74];
  orderByPrio.forEach((idx, rank) => {
    let tier, within, count;
    if (rank < nA) { tier = 0; within = rank; count = nA; }
    else if (rank < nA + nB) { tier = 1; within = rank - nA; count = nB; }
    else { tier = 2; within = rank - nA - nB; count = N - nA - nB; }
    const x = 0.12 + 0.76 * ((within + 0.5) / count);
    L[3][idx] = [x, tierY[tier] + (rnd(idx, 8) - 0.5) * 0.03];
  });
  const topSet = new Set(orderByPrio.slice(0, nA));

  /* 4 & 5 · Grille = le système */
  for (let i = 0; i < N; i++) {
    const [c, r] = cell(i);
    L[4][i] = [gx(c), gy(r)];
    L[5][i] = [gx(c), gy(r)];
  }

  return { L, topSet };
}

/* Traits de la grille (blueprint du système) en % du plateau */
function gridLines() {
  const lines = [];
  for (let r = 0; r < ROWS; r++) {
    lines.push({ x1: gx(0) * 100, y1: gy(r) * 100, x2: gx(COLS - 1) * 100, y2: gy(r) * 100 });
  }
  for (let c = 0; c < COLS; c++) {
    lines.push({ x1: gx(c) * 100, y1: gy(0) * 100, x2: gx(c) * 100, y2: gy(ROWS - 1) * 100 });
  }
  return lines;
}

export default function MethodeFilm({ jalons, film, labels, locale }) {
  const isDesktop = useMediaQuery('(min-width: 981px)');
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const boardRef = useRef(null);
  const nodeRefs = useRef([]);
  const frameRef = useRef(null);
  const gridLineRefs = useRef([]);
  const scanRef = useRef(null);
  const gridBgRef = useRef(null);
  const panelRefs = useRef([]);
  const railFillRef = useRef(null);
  const stationRefs = useRef([]);
  const [chapter, setChapter] = useState(0);

  const { L, topSet } = useMemo(buildLayouts, []);
  const depths = useMemo(() => Array.from({ length: N }, (_, i) => rnd(i, 9)), []);
  const stags = useMemo(() => Array.from({ length: N }, (_, i) => rnd(i, 10)), []);
  const strokes = useMemo(gridLines, []);

  useGSAP(() => {
    if (instant() || !isDesktop) return;
    const root = rootRef.current;
    const board = boardRef.current;
    const nodes = nodeRefs.current;
    const synthEl = root.querySelector('.mflm__synth');

    if (frameRef.current) { frameRef.current.style.strokeDasharray = '1'; frameRef.current.style.strokeDashoffset = '1'; }
    gridLineRefs.current.forEach((l) => { if (l) { l.style.strokeDasharray = '1'; l.style.strokeDashoffset = '1'; } });

    let bw = 0, bh = 0;
    const measure = () => { const r = board.getBoundingClientRect(); bw = r.width; bh = r.height; };
    measure();

    const bounds = [[0, B[0]], [B[0], B[1]], [B[1], B[2]], [B[2], B[3]], [B[3], B[4]], [B[4], 1]];

    const render = (p) => {
      /* Scène courante */
      let k = 0;
      for (let i = 0; i < B.length; i++) if (p >= B[i]) k = i + 1;
      setChapter((c) => (c === k ? c : k));

      /* Caméra : bascule + profondeur interpolées entre scènes */
      const tB = k === 0 ? 1 : smooth(ph(p, B[k - 1] - TW, B[k - 1] + TW));
      const C0 = CAM[Math.max(0, k - 1)], C1 = CAM[k];
      const rx = k === 0 ? CAM[0][0] : C0[0] + (C1[0] - C0[0]) * tB;
      const ry = k === 0 ? CAM[0][1] : C0[1] + (C1[1] - C0[1]) * tB;
      const cz = k === 0 ? CAM[0][2] : C0[2] + (C1[2] - C0[2]) * tB;
      gsap.set(board, { rotationX: rx, rotationY: ry, z: cz, transformPerspective: 1400 });

      /* Balayage de l'audit (scène 2) */
      const scanT = k === 2 ? clamp01(ph(p, B[1], B[2] - 0.01)) : (k > 2 ? 1 : 0);
      const scanX = 0.06 + 0.88 * scanT;
      if (scanRef.current) {
        scanRef.current.style.opacity = (k === 2 ? 0.9 : 0).toFixed(2);
        scanRef.current.style.transform = `translateX(${(scanX * bw).toFixed(1)}px)`;
      }

      /* Nœuds : interpolation scène k-1 -> k, avec quick wins qui filent d'abord */
      for (let i = 0; i < N; i++) {
        let x, y;
        if (k === 0) {
          [x, y] = L[0][i];
        } else {
          const bnd = B[k - 1];
          const stg = (k === 4 && topSet.has(i)) ? stags[i] * 0.2 : stags[i];
          const t = smooth(clamp01((ph(p, bnd - TW, bnd + TW) - stg * 0.28) / 0.72));
          const A = L[k - 1][i], Bt = L[k][i];
          x = A[0] + (Bt[0] - A[0]) * t;
          y = A[1] + (Bt[1] - A[1]) * t;
        }

        /* Vie par scène */
        if (k === 0) { x += Math.cos(p * 30 + i) * 0.006; y += Math.sin(p * 26 + i * 1.3) * 0.006; }
        if (k === 5) { const b = Math.sin(p * 22 + i * 0.5) * 0.0035; x += b; y += b * 0.7; }

        const el = nodes[i];
        const d = depths[i];
        const observed = k === 2 && L[2][i][0] <= scanX;
        const bright = observed || (k === 3 && topSet.has(i)) || (k === 4 && topSet.has(i)) || k === 5;
        const sc = (0.6 + 0.7 * d) * (bright ? 1.25 : 1);
        el.style.transform = `translate3d(${(x * bw).toFixed(1)}px, ${(y * bh).toFixed(1)}px, 0) scale(${sc.toFixed(2)})`;
        el.style.opacity = ((k === 2 && !observed) ? 0.3 : 0.42 + 0.55 * d).toFixed(2);
        el.classList.toggle('is-bright', bright);
      }

      /* Cadre du cadrage : se dessine scène 1, s'efface ensuite */
      const frameT = k === 1 ? smooth(ph(p, B[0] + 0.005, B[0] + 0.075))
        : (k > 1 ? 1 - smooth(ph(p, B[1] - TW, B[1] + TW)) : 0);
      if (frameRef.current) {
        frameRef.current.style.strokeDashoffset = (1 - frameT).toFixed(3);
        frameRef.current.style.opacity = frameT.toFixed(2);
      }

      /* Grille du système : se câble scènes 4-5 */
      const gridT = k >= 4 ? smooth(ph(p, B[3] + 0.01, B[3] + 0.13)) : 0;
      gridLineRefs.current.forEach((l, i) => {
        if (l) l.style.strokeDashoffset = (1 - clamp01(gridT * 1.4 - i * 0.02)).toFixed(3);
      });

      /* Blueprint de fond : s'affirme à mesure que l'ordre s'installe */
      if (gridBgRef.current) gridBgRef.current.style.opacity = (0.015 + 0.085 * smooth(clamp01((p - 0.4) / 0.5))).toFixed(3);

      /* Panneau d'info : un seul, contenu par scène */
      bounds.forEach(([a, b], i) => {
        const el = panelRefs.current[i];
        if (!el) return;
        const inT = i === 0 ? clamp01((p + 0.08) / 0.08) : smooth(ph(p, a - 0.012, a + 0.05));
        const outT = i === 5 ? 0 : smooth(ph(p, b - 0.05, b + 0.012));
        const t = inT * (1 - outT);
        el.style.opacity = t.toFixed(3);
        el.style.transform = `translateY(${(26 * (1 - inT) - 20 * outT).toFixed(1)}px)`;
        el.style.pointerEvents = t > 0.5 ? 'auto' : 'none';
      });

      /* Frise : progression + station active (l'intro n'active rien) */
      if (railFillRef.current) railFillRef.current.style.transform = `scaleX(${clamp01((p - 0.04) / 0.86).toFixed(4)})`;
      stationRefs.current.forEach((n, i) => {
        if (!n) return;
        n.classList.toggle('is-on', k - 1 >= i);
        n.classList.toggle('is-active', k - 1 === i);
      });

      /* Synthèse finale */
      const sy = smooth(ph(p, 0.965, 1));
      gsap.set(synthEl, { autoAlpha: sy, y: 24 * (1 - sy) });
    };

    render(0);
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 7,
      pin: stageRef.current,
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onUpdate: (self) => render(self.progress),
    });

    /* Regard caméra */
    let onMove = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const rxT = gsap.quickTo(stageRef.current.querySelector('.mflm__cam'), 'rotationX', { duration: 1.2, ease: 'power3.out' });
      const ryT = gsap.quickTo(stageRef.current.querySelector('.mflm__cam'), 'rotationY', { duration: 1.2, ease: 'power3.out' });
      onMove = (e) => {
        ryT((e.clientX / window.innerWidth - 0.5) * 5);
        rxT(-(e.clientY / window.innerHeight - 0.5) * 4);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    return () => { st.kill(); if (onMove) window.removeEventListener('pointermove', onMove); };
  }, { scope: rootRef, dependencies: [isDesktop, locale] });

  const flat = !isDesktop || instant();

  /* ————— Poster (mobile / reduced / instant) : la liste des jalons ————— */
  if (flat) {
    return (
      <section className="mfilm-flat">
        <div className="container">
          <p className="eyebrow eyebrow--index">{film.introKicker}</p>
          <h2 className="mfilm-flat__title">{film.introTitle}</h2>
          <p className="mfilm-flat__lead">{film.introText}</p>
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

  const kickers = locale === 'fr'
    ? ['Aujourd’hui', 'Cadrage', 'Audit', 'Bilan', 'Mise en œuvre', 'Autonomie']
    : ['Today', 'Framing', 'Audit', 'Report', 'Delivery', 'Autonomy'];

  return (
    <section className="mflm" ref={rootRef}>
      <div className="mflm__stage" ref={stageRef} data-cursor-dark>
        <div className="mflm__bg" aria-hidden="true"><div className="hero2__grain" /></div>
        <div className="mflm__gridbg" ref={gridBgRef} aria-hidden="true" />

        <div className="mflm__cam">
          <div className="mflm__board" ref={boardRef} aria-hidden="true">
            {/* balayage de l'audit */}
            <span className="mflm__scan" ref={scanRef} />

            {/* cadre du cadrage + grille du système */}
            <svg className="mflm__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect
                ref={frameRef}
                className="mflm__frame"
                x="26" y="26" width="48" height="48"
                pathLength="1" vectorEffect="non-scaling-stroke"
              />
              {strokes.map((s, i) => (
                <line
                  key={`g${i}`}
                  ref={(el) => { gridLineRefs.current[i] = el; }}
                  className="mflm__grid-line"
                  x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  pathLength="1" vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {/* les 88 nœuds : le parc d'outils */}
            {Array.from({ length: N }, (_, i) => (
              <span key={i} className="mflm__node" ref={(el) => { nodeRefs.current[i] = el; }} />
            ))}
          </div>
        </div>

        {/* PANNEAU D'INFO : une seule zone de lecture */}
        <div className="mflm__panelzone">
          {/* 0 — Aujourd'hui */}
          <div className="mflm__panel" ref={(el) => { panelRefs.current[0] = el; }}>
            <p className="mflm__kicker">{kickers[0]}</p>
            <p className="mflm__headline">{film.introTitle}</p>
            <p className="mflm__body">{film.introText}</p>
          </div>
          {/* 1..5 — les jalons */}
          {jalons.map((j, i) => (
            <div className="mflm__panel" key={j.n} ref={(el) => { panelRefs.current[i + 1] = el; }}>
              <p className="mflm__kicker">
                {labels.milestone} {j.n} · {kickers[i + 1]}
                {j.here && <span className="mflm__here">{labels.here}</span>}
              </p>
              <p className="mflm__headline">{j.title}</p>
              <p className="mflm__body">{j.text}</p>
              <p className="mflm__deliver"><span>{labels.youGet}</span>{j.deliver}</p>
            </div>
          ))}
        </div>

        {/* Synthèse finale */}
        <div className="mflm__synth"><p>{film.synthCap}</p></div>

        {/* Frise des 5 jalons */}
        <div className="mflm__rail" aria-hidden="true">
          <span className="mflm__rail-line"><i ref={railFillRef} /></span>
          <span className="mflm__stations">
            {jalons.map((j, i) => (
              <span
                key={j.n}
                className={`mflm__station${j.here ? ' has-here' : ''}`}
                ref={(el) => { stationRefs.current[i] = el; }}
              >
                <span className="mflm__station-cap">
                  <b className="mflm__station-num">{j.n}</b>
                  <b className="mflm__station-lab">{j.label}</b>
                </span>
                <b className="mflm__station-dot" />
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
