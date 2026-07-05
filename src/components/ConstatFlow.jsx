import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { R_NODES, R_LINKS } from './Logo';
import InfoTip from './InfoTip';

/* ============================================================
   LE CONSTAT — LA MATIÈRE (WebGL, v8 ultra-fluide).

   Même architecture éprouvée que la Méthode (sticky + snap + texte DOM
   lisible sur voile flouté) mais une animation OPPOSÉE : ici on ne voyage
   pas, c'est LA MATIÈRE qui se transforme devant la caméra. ~620 particules
   GPU (instancing, zéro DOM par frame) racontent l'étude :

   1 LA SEMAINE   5 colonnes de particules : 35 h de travail
   2 47 %         le haut s'allume et S'ÉVAPORE (McKinsey)
   3 EN HEURES    les perdues se reforment en CADRAN : 16,5 h
   4 EN EUROS     tout devient L'ÉQUIPE : 20 barres, 465 000 €/an
   5 LE POURQUOI  la matière éclate en 3 causes + hub (Okta, HBR, Asana)
   6 L'ORDRE      elle converge et DESSINE LE R de la marque

   Chiffres comptés, sources cliquables ↗, calculs dans le (i).
   Fluide PC ET téléphone. reduced-motion => poster lisible.
   ============================================================ */

const INK_BG = '#0e0b1f';
const N = 620;
const COLS = 5;
const PER = N / COLS;                       // 124 par colonne
const CD = [0.03, 0.2, 0.38, 0.56, 0.74, 0.92];   // centres des 6 états
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ph = (p, a, b) => clamp01((p - a) / (b - a));
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ——— Les 6 états de la matière : positions, couleurs, échelles ——— */
function buildStates() {
  const S = 6;
  const pos = Array.from({ length: S }, () => new Float32Array(N * 3));
  const col = Array.from({ length: S }, () => new Float32Array(N * 3));
  const scl = Array.from({ length: S }, () => new Float32Array(N));

  const COLD = new THREE.Color('#3b3763');
  const CREAM = new THREE.Color('#f0eee8');
  const BRIGHT = new THREE.Color('#5b4be6');
  const mix = (a, b, t) => a.clone().lerp(b, t);
  const setC = (s, i, c) => { col[s][i * 3] = c.r; col[s][i * 3 + 1] = c.g; col[s][i * 3 + 2] = c.b; };
  const setP = (s, i, x, y, z) => { pos[s][i * 3] = x; pos[s][i * 3 + 1] = y; pos[s][i * 3 + 2] = z; };

  /* 0 · LA SEMAINE : 5 colonnes × (4 large × 31 haut) */
  const lost = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const ci = Math.floor(i / PER);
    const k = i % PER;
    const ix = k % 4, iy = Math.floor(k / 4);
    const x = -4.4 + ci * 2.2 + (ix - 1.5) * 0.34 + (rnd(i, 1) - 0.5) * 0.06;
    const y = -2.6 + iy * 0.172 + (rnd(i, 2) - 0.5) * 0.05;
    setP(0, i, x, y, (rnd(i, 3) - 0.5) * 0.5);
    lost[i] = iy >= 17 ? 1 : 0;             // le haut ≈ 47 %
    setC(0, i, mix(COLD, CREAM, 0.5));
    scl[0][i] = 1;
  }
  const lostIdx = [];
  for (let i = 0; i < N; i++) if (lost[i]) lostIdx.push(i);
  const nLost = lostIdx.length;

  /* 1 · 47 % S'ÉVAPORE : les perdues décollent, le reste s'assombrit */
  for (let i = 0; i < N; i++) {
    const x0 = pos[0][i * 3], y0 = pos[0][i * 3 + 1], z0 = pos[0][i * 3 + 2];
    if (lost[i]) {
      setP(1, i, x0 + (rnd(i, 4) - 0.5) * 1.5, y0 + 1.1 + rnd(i, 5) * 1.9, z0 + (rnd(i, 6) - 0.5) * 1.6);
      setC(1, i, BRIGHT); scl[1][i] = 1.3;
    } else {
      setP(1, i, x0, y0 - 0.18, z0);
      setC(1, i, mix(COLD, CREAM, 0.16)); scl[1][i] = 0.85;
    }
  }

  /* 2 · EN HEURES : les perdues forment un cadran, le reste s'éloigne */
  lostIdx.forEach((i, k) => {
    const a = -Math.PI / 2 + (k / nLost) * Math.PI * 2;
    setP(2, i, Math.cos(a) * 2.55 + (rnd(i, 7) - 0.5) * 0.08, 0.15 + Math.sin(a) * 2.55 + (rnd(i, 8) - 0.5) * 0.08, (rnd(i, 9) - 0.5) * 0.4);
    setC(2, i, BRIGHT); scl[2][i] = 1.15;
  });
  for (let i = 0; i < N; i++) if (!lost[i]) {
    setP(2, i, (rnd(i, 10) - 0.5) * 13, (rnd(i, 11) - 0.5) * 7.5, -3 - rnd(i, 12) * 4);
    setC(2, i, mix(COLD, CREAM, 0.09)); scl[2][i] = 0.6;
  }

  /* 3 · EN EUROS : l'équipe, 20 barres */
  for (let i = 0; i < N; i++) {
    const b = i % 20;
    const j = Math.floor(i / 20);
    const x = -4.75 + b * 0.5 + ((j % 2) * 0.16 - 0.08);
    const y = -2.3 + Math.floor(j / 2) * 0.29;
    setP(3, i, x, y, (rnd(i, 13) - 0.5) * 0.4);
    setC(3, i, mix(COLD, CREAM, 0.55)); scl[3][i] = 1;
  }

  /* 4 · LE POURQUOI : hub + 3 causes */
  const centers = [[-3.4, 1.7], [3.4, 1.9], [0, -2.3]];
  for (let i = 0; i < N; i++) {
    if (i < 42) {
      setP(4, i, (rnd(i, 14) - 0.5) * 0.7, (rnd(i, 15) - 0.5) * 0.55, (rnd(i, 16) - 0.5) * 0.5);
      setC(4, i, BRIGHT); scl[4][i] = 1.4;
    } else {
      const c = centers[i % 3];
      const a = rnd(i, 17) * Math.PI * 2, r = 0.25 + rnd(i, 18) * 1.05;
      setP(4, i, c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r * 0.72, (rnd(i, 19) - 0.5) * 0.9);
      setC(4, i, mix(COLD, CREAM, 0.5)); scl[4][i] = 1;
    }
  }

  /* 5 · L'ORDRE : la matière dessine le R de la marque */
  const sR = 0.036, cxR = 66, cyR = 76;
  const segs = R_LINKS.map(([a, b]) => {
    const A = R_NODES[a], B = R_NODES[b];
    return { A, B, len: Math.hypot(B[0] - A[0], B[1] - A[1]) };
  });
  const total = segs.reduce((s, g) => s + g.len, 0);
  let acc = 0;
  const stops = segs.map((g) => { const st = acc / total; acc += g.len; return { ...g, st, en: acc / total }; });
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const g = stops.find((s) => t >= s.st && t <= s.en) || stops[stops.length - 1];
    const lt = (t - g.st) / Math.max(g.en - g.st, 1e-6);
    const rx = g.A[0] + (g.B[0] - g.A[0]) * lt;
    const ry = g.A[1] + (g.B[1] - g.A[1]) * lt;
    setP(5, i, (rx - cxR) * sR + (rnd(i, 20) - 0.5) * 0.05, (cyR - ry) * sR + (rnd(i, 21) - 0.5) * 0.05, (rnd(i, 22) - 0.5) * 0.3);
    setC(5, i, mix(BRIGHT, CREAM, 0.3)); scl[5][i] = 1.08;
  }

  /* Traits du R (fondu à l'état 6) */
  const rLines = [];
  R_LINKS.forEach(([a, b]) => {
    rLines.push((R_NODES[a][0] - cxR) * sR, (cyR - R_NODES[a][1]) * sR, 0, (R_NODES[b][0] - cxR) * sR, (cyR - R_NODES[b][1]) * sR, 0);
  });

  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) seeds[i] = rnd(i, 23);

  return { pos, col, scl, seeds, rLines };
}

function Matter({ states, progress, mouse }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const lineMatRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cc = useMemo(() => new THREE.Color(), []);
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(states.rLines, 3));
    return g;
  }, [states]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const p = clamp01(progress.current);
    let k = 0;
    for (let i = 0; i < CD.length - 1; i++) if (p >= CD[i]) k = i;
    const local = ph(p, CD[k], CD[k + 1]);
    const { pos, col, scl, seeds } = states;
    const m = meshRef.current;
    const A = pos[k], B = pos[k + 1], CA = col[k], CB = col[k + 1], SA = scl[k], SB = scl[k + 1];
    for (let i = 0; i < N; i++) {
      const st = smooth(clamp01((local - seeds[i] * 0.3) / 0.7));
      const x = A[i * 3] + (B[i * 3] - A[i * 3]) * st;
      const y = A[i * 3 + 1] + (B[i * 3 + 1] - A[i * 3 + 1]) * st;
      const z = A[i * 3 + 2] + (B[i * 3 + 2] - A[i * 3 + 2]) * st;
      const bob = Math.sin(time * 1.15 + seeds[i] * 9) * 0.035;
      dummy.position.set(x, y + bob, z);
      dummy.scale.setScalar(0.05 * (SA[i] + (SB[i] - SA[i]) * st));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      cc.setRGB(
        CA[i * 3] + (CB[i * 3] - CA[i * 3]) * st,
        CA[i * 3 + 1] + (CB[i * 3 + 1] - CA[i * 3 + 1]) * st,
        CA[i * 3 + 2] + (CB[i * 3 + 2] - CA[i * 3 + 2]) * st
      );
      m.setColorAt(i, cc);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;

    /* traits du R : fondu sur le dernier état */
    if (lineMatRef.current) lineMatRef.current.opacity = 0.5 * smooth(ph(p, CD[4] + 0.08, CD[5]));

    /* la matière respire avec la souris */
    if (groupRef.current) {
      groupRef.current.rotation.y += (mouse.current.x * 0.22 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-mouse.current.y * 0.14 - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, N]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial ref={lineMatRef} color="#5b4be6" transparent opacity={0} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

function CamRig({ progress, mouse }) {
  useFrame((state) => {
    const p = clamp01(progress.current);
    const cam = state.camera;
    const tx = Math.sin(p * Math.PI * 2) * 0.5 + mouse.current.x * 0.8;
    const ty = Math.sin(p * Math.PI * 1.3 + 0.4) * 0.3 + mouse.current.y * 0.5;
    cam.position.x += (tx - cam.position.x) * 0.05;
    cam.position.y += (ty - cam.position.y) * 0.05;
    cam.position.z += ((9.2 - p * 1.6) - cam.position.z) * 0.05;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function splitWords(text) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((w, i) => <span className="cflw__w" key={i} style={{ '--i': i }}>{w}</span>)}
      </span>
    </>
  );
}

export default function ConstatFlow({ cards, film, sourceLabel, calcLabel, locale }) {
  const rootRef = useRef(null);
  const railFillRef = useRef(null);
  const synthRef = useRef(null);
  const copyRef = useRef(null);
  const scrimRef = useRef(null);
  const numRefs = useRef({});
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const reduced = prefersReduced();

  const states = useMemo(buildStates, []);
  const whyCards = cards.filter((c) => ['apps', 'toggle', 'wow'].includes(c.id));
  const fmt = useMemo(() => new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US'), [locale]);
  const fmt1 = useMemo(() => new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }), [locale]);

  const kickers = locale === 'fr'
    ? ['La semaine', 'Le temps évaporé', 'En heures', 'En euros', 'Le pourquoi', 'L’ordre']
    : ['The week', 'Evaporated time', 'In hours', 'In euros', 'The why', 'Order'];

  useGSAP(() => {
    if (reduced) return;
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      snap: { snapTo: CD, duration: { min: 0.2, max: 0.7 }, delay: 0.06, ease: 'power2.inOut' },
      onUpdate: (self) => {
        const p = self.progress;
        progress.current = p;
        let best = 0, bd = 9;
        CD.forEach((c, i) => { const d = Math.abs(p - c); if (d < bd) { bd = d; best = i; } });
        setActive((a) => (a === best ? a : best));
        /* les compteurs finissent un peu AVANT le point de snap : au repos,
           le chiffre est toujours complet (47 %, jamais 46 %) */
        if (numRefs.current.pct) numRefs.current.pct.textContent = Math.round(47 * smooth(ph(p, CD[1] - 0.14, CD[1] - 0.02))) + ' %';
        if (numRefs.current.hrs) numRefs.current.hrs.textContent = fmt1.format(16.5 * smooth(ph(p, CD[2] - 0.14, CD[2] - 0.02))) + ' h';
        if (numRefs.current.eur) numRefs.current.eur.textContent = fmt.format(Math.round(film.costValue * smooth(ph(p, CD[3] - 0.14, CD[3] - 0.02)))) + ' €';
        if (railFillRef.current) railFillRef.current.style.transform = `scaleX(${clamp01((p - 0.03) / 0.89)})`;
        const f = clamp01((p - 0.955) / 0.045);
        if (synthRef.current) { synthRef.current.style.opacity = f; synthRef.current.style.transform = `translateY(${(24 * (1 - f)).toFixed(1)}px)`; }
        if (copyRef.current) copyRef.current.style.opacity = 1 - f;
        if (scrimRef.current) scrimRef.current.style.opacity = 1 - f;
      },
    });
    const onMove = (e) => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5; };
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) window.addEventListener('pointermove', onMove, { passive: true });
    return () => { st.kill(); window.removeEventListener('pointermove', onMove); };
  }, { scope: rootRef, dependencies: [locale] });

  /* ————— Poster (reduced-motion) ————— */
  if (reduced) {
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

  return (
    <section className="cflw" ref={rootRef}>
      <div className="cflw__holder" data-cursor-dark>
        <Canvas
          className="cflw__canvas"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 9.2], fov: 50, near: 0.1, far: 60 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={[INK_BG]} />
          <fog attach="fog" args={[INK_BG, 11, 26]} />
          <Matter states={states} progress={progress} mouse={mouse} />
          <CamRig progress={progress} mouse={mouse} />
        </Canvas>

        {/* voile flouté derrière le texte */}
        <div className="cflw__scrim" ref={scrimRef} aria-hidden="true" />

        {/* le texte : overlay fixe, lisible */}
        <div className="cflw__copy" ref={copyRef}>
          {/* 01 la semaine */}
          <article className={`cflw__panel${active === 0 ? ' is-active' : ''}`}>
            <p className="cflw__kicker">01 · {kickers[0]}</p>
            <h2 className="cflw__headline">{splitWords(film.weekLabel)}</h2>
            <p className="cflw__body">{splitWords(film.weekText)}</p>
          </article>
          {/* 02 47 % */}
          <article className={`cflw__panel${active === 1 ? ' is-active' : ''}`}>
            <p className="cflw__kicker">02 · {kickers[1]}</p>
            <p className="cflw__num" ref={(el) => { numRefs.current.pct = el; }}>0 %</p>
            <p className="cflw__body">{splitWords(film.lostCap)}</p>
            <div className="cflw__srcrow">
              <a className="statcard__source" href={film.mckUrl} target="_blank" rel="noreferrer noopener" data-cursor-label={sourceLabel}>
                <span className="statcard__source-dot" aria-hidden="true" />{film.mckLabel}<span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
          {/* 03 en heures */}
          <article className={`cflw__panel${active === 2 ? ' is-active' : ''}`}>
            <p className="cflw__kicker">03 · {kickers[2]}</p>
            <p className="cflw__num" ref={(el) => { numRefs.current.hrs = el; }}>0 h</p>
            <p className="cflw__body">
              {splitWords(film.hoursCap)}
              <InfoTip label={calcLabel}><strong>{calcLabel}.</strong> {film.hoursCalc}</InfoTip>
            </p>
          </article>
          {/* 04 en euros */}
          <article className={`cflw__panel${active === 3 ? ' is-active' : ''}`}>
            <p className="cflw__kicker">04 · {kickers[3]}</p>
            <p className="cflw__num" ref={(el) => { numRefs.current.eur = el; }}>0 €</p>
            <p className="cflw__body">
              {splitWords(film.costCap)}
              <InfoTip label={calcLabel}><strong>{calcLabel}.</strong> {film.costCalc}</InfoTip>
            </p>
          </article>
          {/* 05 le pourquoi */}
          <article className={`cflw__panel${active === 4 ? ' is-active' : ''}`}>
            <p className="cflw__kicker">05 · {kickers[4]}</p>
            <h2 className="cflw__headline">{splitWords(film.whyCap)}</h2>
            <ul className="cflw__causes">
              {whyCards.map((c) => (
                <li key={c.id}>
                  <span className="cflw__cause-val">{c.display}</span>
                  <span className="cflw__cause-lab">{c.kicker}</span>
                  <a className="statcard__source" href={c.source.url} target="_blank" rel="noreferrer noopener" data-cursor-label={sourceLabel}>
                    <span className="statcard__source-dot" aria-hidden="true" />{c.source.label}<span aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </article>
          {/* 06 l'ordre */}
          <article className={`cflw__panel${active === 5 ? ' is-active' : ''}`}>
            <p className="cflw__kicker">06 · {kickers[5]}</p>
            <h2 className="cflw__headline">{splitWords(film.orderCap)}</h2>
            <p className="cflw__body">{splitWords(film.orderText)}</p>
          </article>
        </div>

        {/* rail de progression */}
        <div className="cflw__rail" aria-hidden="true">
          <span className="cflw__rail-line"><i ref={railFillRef} /></span>
          <span className="cflw__rail-dots">
            {kickers.map((kk, i) => (
              <span className={`cflw__rail-dot${active === i ? ' is-active' : ''}${active >= i ? ' is-on' : ''}`} key={kk}>
                <b>{String(i + 1).padStart(2, '0')}</b><em>{kk}</em>
              </span>
            ))}
          </span>
        </div>

        {/* synthèse */}
        <div className="cflw__synth" ref={synthRef}><p>{film.synthCap}</p></div>
      </div>
    </section>
  );
}
