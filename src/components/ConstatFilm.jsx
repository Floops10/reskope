import { useRef, useMemo, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { R_NODES, R_LINKS } from './Logo';
import InfoTip from './InfoTip';

/* ============================================================
   LE CONSTAT — LA MATIÈRE DU TEMPS (v7).

   UNE SEULE matière : 120 nœuds plein écran qui se MÉTAMORPHOSENT
   en continu au scroll. Le même temps circule de scène en scène,
   c'est ça qui fait comprendre l'étude :

   1 LA SEMAINE   5 colonnes de nœuds (35 h) remplissent l'écran
   2 47 %         le haut des colonnes s'allume et FLOTTE : évaporé
   3 EN HEURES    la matière se reforme en CADRAN : 16,5 h / 35
   4 EN EUROS     elle devient L'ÉQUIPE : 20 barres en perspective
   5 LE POURQUOI  elle éclate en 3 causes reliées à un hub (réseau)
   6 L'ORDRE      elle converge et DESSINE LE R : remettre de l'ordre

   Le plateau est en vraie profondeur : chaque nœud a une profondeur
   (échelle/opacité), le plateau bascule différemment à chaque scène
   (rotationX/Y) et suit le curseur. Un PANNEAU D'INFO unique (bas
   gauche, verre teinté) porte chiffre compté + propos + source ↗ +
   calcul (i) : une seule zone de lecture, rien ne se chevauche.
   Mobile / reduced / onglet caché : poster empilé lisible.
   ============================================================ */

const N = 120;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ph = (p, a, b) => clamp01((p - a) / (b - a));
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

/* Frontières des 6 scènes sur p 0..1 */
const B = [0.16, 0.335, 0.515, 0.705, 0.885];
const TW = 0.055;              // demi-fenêtre de morph
const LOST_COUNT = 56;         // ≈ 47 % de 120

/* Bascule 3D du plateau par scène (rotationX, rotationY) */
const TILT = [
  [8, -4], [14, 3], [2, 0], [18, -6], [6, 4], [0, 0],
];

/* ——— Les 6 dispositions (coordonnées 0..1 du plateau) ——— */
function buildLayouts() {
  const L = Array.from({ length: 6 }, () => Array(N));

  /* 0 · Semaine : 5 colonnes × 24, pleine hauteur */
  for (let i = 0; i < N; i++) {
    const ci = i % 5;
    const ri = Math.floor(i / 5);
    L[0][i] = [0.10 + 0.8 * (ci / 4), 0.90 - 0.78 * (ri / 23)];
  }
  /* Perdus = les plus hauts (47 %) : indices triés par y asc */
  const byHeight = Array.from({ length: N }, (_, i) => i)
    .sort((a, b) => L[0][a][1] - L[0][b][1]);
  const lostSet = new Set(byHeight.slice(0, LOST_COUNT));

  /* 1 · 47 % : identiques, mais les perdus décollent (dérive haute) */
  for (let i = 0; i < N; i++) {
    const [x, y] = L[0][i];
    L[1][i] = lostSet.has(i)
      ? [x + (rnd(i, 5) - 0.5) * 0.07, y - 0.05 - rnd(i, 6) * 0.06]
      : [x, y + 0.015];
  }

  /* 2 · Cadran : anneau plein écran, départ à midi */
  for (let k = 0; k < N; k++) {
    const i = byHeight[k];                      // perdus d'abord → arc continu
    const a = -Math.PI / 2 + (k / N) * Math.PI * 2;
    L[2][i] = [0.5 + Math.cos(a) * 0.30, 0.5 + Math.sin(a) * 0.40];
  }

  /* 3 · L'équipe : 20 barres × 6 */
  for (let i = 0; i < N; i++) {
    const ci = i % 20;
    const ri = Math.floor(i / 20);
    L[3][i] = [0.06 + 0.88 * (ci / 19), 0.78 - 0.4 * (ri / 5)];
  }

  /* 4 · Le pourquoi : 3 amas + hub */
  const centers = [[0.17, 0.24], [0.83, 0.28], [0.5, 0.8]];
  for (let i = 0; i < N; i++) {
    if (i === 0) { L[4][i] = [0.5, 0.47]; continue; }   // hub
    const c = centers[i % 3];
    const r = 0.035 + rnd(i, 7) * 0.075;
    const a = rnd(i, 8) * Math.PI * 2;
    L[4][i] = [c[0] + Math.cos(a) * r * 0.8, c[1] + Math.sin(a) * r];
  }

  /* 5 · Le R : 120 nœuds échantillonnés le long des traits du R */
  const scale = 0.0048, ox = 0.5 - 66 * scale, oy = 0.5 - 76 * scale;
  const segs = R_LINKS.map(([a, b]) => {
    const A = R_NODES[a], Bp = R_NODES[b];
    return { A, B: Bp, len: Math.hypot(Bp[0] - A[0], Bp[1] - A[1]) };
  });
  const total = segs.reduce((s, g) => s + g.len, 0);
  let acc = 0;
  const stops = segs.map((g) => { const st = acc / total; acc += g.len; return { ...g, st, en: acc / total }; });
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const g = stops.find((s) => t >= s.st && t <= s.en) || stops[stops.length - 1];
    const lt = (t - g.st) / Math.max(g.en - g.st, 1e-6);
    L[5][i] = [
      ox + (g.A[0] + (g.B[0] - g.A[0]) * lt) * scale * (66 / 66) + 0,
      oy + (g.A[1] + (g.B[1] - g.A[1]) * lt) * scale,
    ];
  }

  return { L, lostSet };
}

/* Traits du R en % du plateau (pour le tracé final) */
function rStrokes() {
  const scale = 0.0048, ox = 0.5 - 66 * scale, oy = 0.5 - 76 * scale;
  return R_LINKS.map(([a, b]) => ({
    x1: (ox + R_NODES[a][0] * scale) * 100, y1: (oy + R_NODES[a][1] * scale) * 100,
    x2: (ox + R_NODES[b][0] * scale) * 100, y2: (oy + R_NODES[b][1] * scale) * 100,
  }));
}

export default function ConstatFilm({ cards, film, sourceLabel, calcLabel, locale }) {
  const isDesktop = useMediaQuery('(min-width: 981px)');
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const boardRef = useRef(null);
  const nodeRefs = useRef([]);
  const spineRefs = useRef([]);
  const whyLineRefs = useRef([]);
  const rLineRefs = useRef([]);
  const panelRefs = useRef([]);
  const numRefs = useRef({});
  const satRefs = useRef([]);
  const railRef = useRef(null);
  const railNodeRefs = useRef([]);
  const [chapter, setChapter] = useState(0);

  const fmt = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US');
  const fmt1 = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  const { L, lostSet } = useMemo(buildLayouts, []);
  const depths = useMemo(() => Array.from({ length: N }, (_, i) => rnd(i, 9)), []);
  const stags = useMemo(() => Array.from({ length: N }, (_, i) => rnd(i, 10)), []);
  const strokes = useMemo(rStrokes, []);
  const whyCards = cards.filter((c) => ['apps', 'toggle', 'wow'].includes(c.id));
  const days = locale === 'fr' ? ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  useGSAP(() => {
    if (instant() || !isDesktop) return;
    const root = rootRef.current;
    const board = boardRef.current;
    const nodes = nodeRefs.current;
    const dayEls = [...board.querySelectorAll('.cflm__day')];
    const synthEl = root.querySelector('.cflm__synth');

    whyLineRefs.current.forEach((l) => { if (l) { l.style.strokeDasharray = '1'; l.style.strokeDashoffset = '1'; } });
    rLineRefs.current.forEach((l) => { if (l) { l.style.strokeDasharray = '1'; l.style.strokeDashoffset = '1'; } });

    let bw = 0, bh = 0;
    const measure = () => { const r = board.getBoundingClientRect(); bw = r.width; bh = r.height; };
    measure();

    const bounds = [[0, B[0]], [B[0], B[1]], [B[1], B[2]], [B[2], B[3]], [B[3], B[4]], [B[4], 1]];

    const render = (p) => {
      /* Scène courante + morph local */
      let k = 0;
      for (let i = 0; i < B.length; i++) if (p >= B[i]) k = i + 1;
      setChapter((c) => (c === k ? c : k));

      /* Plateau : bascule 3D interpolée entre scènes */
      const tB = k === 0 ? 1 : smooth(ph(p, B[k - 1] - TW, B[k - 1] + TW));
      const T0 = TILT[Math.max(0, k - 1)], T1 = TILT[k];
      const rx = k === 0 ? TILT[0][0] : T0[0] + (T1[0] - T0[0]) * tB;
      const ry = k === 0 ? TILT[0][1] : T0[1] + (T1[1] - T0[1]) * tB;
      gsap.set(board, { rotationX: rx, rotationY: ry, transformPerspective: 1300 });

      /* Nœuds : interpolation entre la scène k-1 et k autour de la frontière */
      for (let i = 0; i < N; i++) {
        let x, y;
        if (k === 0) {
          [x, y] = L[0][i];
        } else {
          const bnd = B[k - 1];
          const t = smooth(clamp01((ph(p, bnd - TW, bnd + TW) - stags[i] * 0.25) / 0.75));
          const A = L[k - 1][i], Bt = L[k][i];
          x = A[0] + (Bt[0] - A[0]) * t;
          y = A[1] + (Bt[1] - A[1]) * t;
        }

        /* Vie par scène */
        if (k === 1 && lostSet.has(i)) {
          y += Math.sin(p * 60 + i) * 0.006;
          x += Math.cos(p * 47 + i * 2) * 0.004;
        }
        if (k === 2) {
          const wob = Math.sin(p * 40 + i * 0.6) * 0.004;
          x += wob; y += wob * 0.6;
        }

        const el = nodes[i];
        const d = depths[i];
        const isLost = lostSet.has(i);
        const bright = (k === 1 && isLost) || (k === 2 && isLost) || (k === 4 && i === 0) || k === 5;
        const sc = (0.62 + 0.75 * d) * (bright ? 1.25 : 1) * (k === 4 && i === 0 ? 2.1 : 1);
        el.style.transform = `translate3d(${(x * bw).toFixed(1)}px, ${(y * bh).toFixed(1)}px, 0) scale(${sc.toFixed(2)})`;
        el.style.opacity = (k === 1 && !isLost ? 0.28 : 0.42 + 0.58 * d).toFixed(2);
        el.classList.toggle('is-bright', bright);
      }

      /* Colonnes-jours : visibles scènes 0-1 */
      const daysOp = k <= 1 ? 1 : 1 - smooth(ph(p, B[1] - TW, B[1] + TW));
      dayEls.forEach((d2) => { d2.style.opacity = (daysOp * 0.6).toFixed(2); });
      spineRefs.current.forEach((s) => { if (s) s.style.opacity = (daysOp * 0.5).toFixed(2); });

      /* Lignes du pourquoi : se tracent scène 4 */
      const whyT = k === 4 ? smooth(ph(p, B[3] + 0.01, B[3] + 0.09)) : (k > 4 ? 1 - smooth(ph(p, B[4] - TW, B[4] + TW)) : 0);
      whyLineRefs.current.forEach((l, i) => {
        if (l) l.style.strokeDashoffset = (1 - clamp01(whyT * 1.4 - i * 0.18)).toFixed(3);
      });
      satRefs.current.forEach((s, i) => {
        if (!s) return;
        const t = k === 4 ? smooth(ph(p, B[3] + 0.02 + i * 0.015, B[3] + 0.08 + i * 0.015)) : (k > 4 ? 0 : 0);
        s.style.opacity = t.toFixed(2);
        s.style.transform = `translate(-50%, -50%) translateY(${(14 * (1 - t)).toFixed(1)}px)`;
      });

      /* Traits du R : se tracent scène 5 */
      const rT = k === 5 ? smooth(ph(p, B[4] + 0.015, B[4] + 0.08)) : 0;
      rLineRefs.current.forEach((l, i) => {
        if (l) l.style.strokeDashoffset = (1 - clamp01(rT * 1.5 - i * 0.12)).toFixed(3);
      });

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

      /* Compteurs */
      if (numRefs.current.pct) numRefs.current.pct.textContent = Math.round(47 * smooth(ph(p, B[0], B[0] + 0.09))) + ' %';
      if (numRefs.current.hrs) numRefs.current.hrs.textContent = fmt1.format(16.5 * smooth(ph(p, B[1], B[1] + 0.09))) + ' h';
      if (numRefs.current.eur) numRefs.current.eur.textContent = fmt.format(Math.round(film.costValue * smooth(ph(p, B[2], B[2] + 0.11)))) + ' €';

      /* Synthèse (scène 6 fin) : voile + statement */
      const sy = smooth(ph(p, 0.965, 1));
      gsap.set(synthEl, { autoAlpha: sy, y: 24 * (1 - sy) });

      /* Rail */
      if (railRef.current) railRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      railNodeRefs.current.forEach((n, i) => {
        if (n) n.classList.toggle('is-on', i === 0 ? true : p >= B[i - 1]);
      });
    };

    render(0);
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 7.5,
      pin: stageRef.current,
      scrub: 1,
      invalidateOnRefresh: true,
      onRefresh: measure,
      onUpdate: (self) => render(self.progress),
    });

    /* Regard caméra */
    let onMove = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const rxT = gsap.quickTo(stageRef.current.querySelector('.cflm__cam'), 'rotationX', { duration: 1.2, ease: 'power3.out' });
      const ryT = gsap.quickTo(stageRef.current.querySelector('.cflm__cam'), 'rotationY', { duration: 1.2, ease: 'power3.out' });
      onMove = (e) => {
        ryT((e.clientX / window.innerWidth - 0.5) * 5);
        rxT(-(e.clientY / window.innerHeight - 0.5) * 4);
      };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    return () => { st.kill(); if (onMove) window.removeEventListener('pointermove', onMove); };
  }, { scope: rootRef, dependencies: [isDesktop, locale] });

  const flat = !isDesktop || instant();

  /* ————— Poster (mobile / reduced / instant) ————— */
  if (flat) {
    return (
      <section className="cfilm cfilm--flat">
        <div className="container cfilm__flat">
          <div className="cfilm__flat-copy">
            <p className="eyebrow eyebrow--index">{film.weekLabel}</p>
            <p className="cfilm__big cfilm__big--sm">47 %</p>
            <p className="cfilm__cap-text">{film.lostCapFull}</p>
            <p className="cfilm__big cfilm__big--sm">16,5 h</p>
            <p className="cfilm__cap-text">{film.hoursCap}</p>
            <p className="cfilm__big cfilm__big--sm">{fmt.format(film.costValue)} €</p>
            <p className="cfilm__cap-text">
              {film.costCap}
              <InfoTip label={calcLabel}><strong>{calcLabel}.</strong> {film.costCalc}</InfoTip>
            </p>
          </div>
          <div className="cfilm__flat-why">
            <h3 className="cfilm__why-title">{film.whyTitle}</h3>
            <div className="cfy-flat">
              {whyCards.map((c) => (
                <div className="cfy-flat-item" key={c.id}>
                  <span className="cfy-flat-val">{c.display}</span>
                  <span className="cfy-flat-lab">{c.kicker}</span>
                  <a className="statcard__source" href={c.source.url} target="_blank" rel="noreferrer noopener">
                    <span className="statcard__source-dot" aria-hidden="true" />{c.source.label}<span aria-hidden="true">↗</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const kickers = (locale === 'fr'
    ? ['La semaine', 'Le temps évaporé', 'En heures', 'En euros', 'Le pourquoi', 'L’ordre']
    : ['The week', 'Evaporated time', 'In hours', 'In euros', 'The why', 'Order']);

  return (
    <section className="cflm" ref={rootRef}>
      <div className="cflm__stage" ref={stageRef} data-cursor-dark>
        <div className="cflm__bg" aria-hidden="true"><div className="hero2__grain" /></div>

        <div className="cflm__cam">
          {/* LE PLATEAU : la matière plein écran */}
          <div className="cflm__board" ref={boardRef} aria-hidden="true">
            {/* fûts des 5 jours */}
            {[0, 1, 2, 3, 4].map((ci) => (
              <span
                key={`s${ci}`}
                className="cflm__spine"
                ref={(el) => { spineRefs.current[ci] = el; }}
                style={{ left: `${(0.10 + 0.8 * (ci / 4)) * 100}%` }}
              />
            ))}
            {/* étiquettes jours */}
            {days.map((d, ci) => (
              <span key={d} className="cflm__day" style={{ left: `${(0.10 + 0.8 * (ci / 4)) * 100}%` }}>{d}</span>
            ))}
            {/* lignes du pourquoi + traits du R */}
            <svg className="cflm__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
              {[[17, 24], [83, 28], [50, 80]].map(([x, y], i) => (
                <line
                  key={`w${i}`}
                  ref={(el) => { whyLineRefs.current[i] = el; }}
                  className="cflm__whyline"
                  x1="50" y1="47" x2={x} y2={y}
                  pathLength="1" vectorEffect="non-scaling-stroke"
                />
              ))}
              {strokes.map((s, i) => (
                <line
                  key={`r${i}`}
                  ref={(el) => { rLineRefs.current[i] = el; }}
                  className="cflm__rline"
                  x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                  pathLength="1" vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            {/* étiquettes des 3 causes (scène 5) */}
            {whyCards.map((c, i) => (
              <div
                key={c.id}
                className={`cflm__sat cflm__sat--${i}`}
                ref={(el) => { satRefs.current[i] = el; }}
              >
                <span className="cflm__sat-val">{c.display}</span>
                <span className="cflm__sat-lab">{c.kicker}</span>
              </div>
            ))}
            {/* les 120 nœuds */}
            {Array.from({ length: N }, (_, i) => (
              <span key={i} className="cflm__node" ref={(el) => { nodeRefs.current[i] = el; }} />
            ))}
          </div>
        </div>

        {/* PANNEAU D'INFO : une seule zone de lecture */}
        <div className="cflm__panelzone">
          <div className="cflm__panel" ref={(el) => { panelRefs.current[0] = el; }}>
            <p className="cflm__kicker">01 · {kickers[0]}</p>
            <p className="cflm__headline">{film.weekLabel}</p>
            <p className="cflm__body">{film.weekText}</p>
          </div>
          <div className="cflm__panel" ref={(el) => { panelRefs.current[1] = el; }}>
            <p className="cflm__kicker">02 · {kickers[1]}</p>
            <p className="cflm__num" ref={(el) => { numRefs.current.pct = el; }}>0 %</p>
            <p className="cflm__body">{film.lostCap}</p>
            <div className="cflm__srcrow">
              <a className="statcard__source" href={film.mckUrl} target="_blank" rel="noreferrer noopener" data-cursor-label={sourceLabel}>
                <span className="statcard__source-dot" aria-hidden="true" />{film.mckLabel}<span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="cflm__panel" ref={(el) => { panelRefs.current[2] = el; }}>
            <p className="cflm__kicker">03 · {kickers[2]}</p>
            <p className="cflm__num" ref={(el) => { numRefs.current.hrs = el; }}>0 h</p>
            <p className="cflm__body">{film.hoursCap}</p>
          </div>
          <div className="cflm__panel" ref={(el) => { panelRefs.current[3] = el; }}>
            <p className="cflm__kicker">04 · {kickers[3]}</p>
            <p className="cflm__num" ref={(el) => { numRefs.current.eur = el; }}>0 €</p>
            <p className="cflm__body">
              {film.costCap}
              <InfoTip label={calcLabel}><strong>{calcLabel}.</strong> {film.costCalc}</InfoTip>
            </p>
          </div>
          <div className="cflm__panel" ref={(el) => { panelRefs.current[4] = el; }}>
            <p className="cflm__kicker">05 · {kickers[4]}</p>
            <p className="cflm__headline">{film.whyCap}</p>
            <div className="cflm__srcrow">
              {whyCards.map((c) => (
                <a key={c.id} className="statcard__source" href={c.source.url} target="_blank" rel="noreferrer noopener" data-cursor-label={sourceLabel}>
                  <span className="statcard__source-dot" aria-hidden="true" />{c.source.label}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </div>
          <div className="cflm__panel" ref={(el) => { panelRefs.current[5] = el; }}>
            <p className="cflm__kicker">06 · {kickers[5]}</p>
            <p className="cflm__headline">{film.orderCap}</p>
            <p className="cflm__body">{film.orderText}</p>
          </div>
        </div>

        {/* Synthèse finale */}
        <div className="cflm__synth"><p>{film.synthCap}</p></div>

        {/* Rail + 6 nœuds */}
        <div className="cflm__rail" aria-hidden="true">
          <span className="cflm__rail-line"><i ref={railRef} /></span>
          <span className="cflm__rail-nodes">
            {Array.from({ length: 6 }, (_, i) => (
              <b key={i} ref={(el) => { railNodeRefs.current[i] = el; }} />
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
