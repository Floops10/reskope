import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import NetWord from './NetWord';

/* ============================================================
   OFFRES — LE SHOWCASE (WebGL, nuit + réseau lumineux).

   Dès l'arrivée : une scène NUIT avec une matière de ~512 particules
   (pas de page blanche). On scrolle, chaque scène s'enchaîne (snap) et
   la matière se reforme en EMBLÈME de chaque offre pendant que le texte
   + le PRIX s'affichent, nets, par-dessus :

   0 INTRO           une sphère-réseau              « Quatre façons… »
   1 AUDIT           une loupe (comprendre)          dès 1 490 €
   2 AUDIT + MISE     des modules reliés (on relie)  450 €/jour
   3 DÉVELOPPEMENT    une structure (on construit)   sur devis
   4 SUIVI            une boucle (on reste)           dès 190 €/mois
   5 FACTURATION      un axe de jours (transparence)  comment je facture

   reduced-motion => liste lisible. Détail au clic. Fond indigo profond.
   ============================================================ */

const INK = '#0b0920';
const N = 512;
const CD = [0.03, 0.21, 0.39, 0.57, 0.75, 0.93];       // 6 scènes
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ph = (p, a, b) => clamp01((p - a) / (b - a));
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ——— Les 6 emblèmes (positions cibles des particules) ——— */
function buildStates() {
  const S = 6;
  const pos = Array.from({ length: S }, () => new Float32Array(N * 3));
  const set = (s, i, x, y, z) => { pos[s][i * 3] = x; pos[s][i * 3 + 1] = y; pos[s][i * 3 + 2] = z; };
  const jz = (i, k) => (rnd(i, k) - 0.5) * 0.5;

  /* 0 · INTRO — une sphère-réseau (Fibonacci) */
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    const inc = Math.acos(1 - 2 * t);
    const az = i * 2.399963229;
    const R = 2.5 + jz(i, 30) * 0.4;
    set(0, i, R * Math.sin(inc) * Math.cos(az), R * Math.sin(inc) * Math.sin(az) * 0.92, R * Math.cos(inc));
  }

  /* 1 · AUDIT — une loupe (anneau + manche) */
  const ringN = Math.floor(N * 0.72);
  for (let i = 0; i < N; i++) {
    if (i < ringN) {
      const a = (i / ringN) * Math.PI * 2;
      set(1, i, Math.cos(a) * 2 + jz(i, 1) * 0.4, Math.sin(a) * 2 + 0.4 + jz(i, 2) * 0.4, jz(i, 3));
    } else {
      const t = (i - ringN) / (N - ringN);
      set(1, i, -1.4 - t * 2.1 + jz(i, 4) * 0.3, -1.0 - t * 2.1 + jz(i, 5) * 0.3, jz(i, 6));
    }
  }

  /* 2 · AUDIT + MISE EN ŒUVRE — 3 modules reliés */
  const centers = [[-2.5, 1.2], [2.5, 1.4], [0, -2.1]];
  for (let i = 0; i < N; i++) {
    const c = centers[i % 3];
    const a = rnd(i, 7) * Math.PI * 2;
    const r = 0.25 + rnd(i, 8) * 1.05;
    set(2, i, c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r * 0.8, jz(i, 9) * 1.4);
  }

  /* 3 · DÉVELOPPEMENT — une structure (grille 3D) */
  const side = 8;
  for (let i = 0; i < N; i++) {
    const gx = i % side, gy = Math.floor(i / side) % side, gz = Math.floor(i / (side * side)) % side;
    set(3, i, (gx - 3.5) * 0.62 + jz(i, 10) * 0.14, (gy - 3.5) * 0.62 + jz(i, 11) * 0.14, (gz - 3.5) * 0.62 + jz(i, 12) * 0.14);
  }

  /* 4 · SUIVI — une boucle (tore) */
  for (let i = 0; i < N; i++) {
    const A = (i / N) * Math.PI * 2;
    const B = rnd(i, 13) * Math.PI * 2;
    const R = 2.1, r = 0.52;
    set(4, i, (R + r * Math.cos(B)) * Math.cos(A), (R + r * Math.cos(B)) * Math.sin(A) * 0.82, r * Math.sin(B) + jz(i, 14) * 0.3);
  }

  /* 5 · FACTURATION — des jours (barres) sur un axe */
  const bars = [-3.2, -1.6, 0, 1.6, 3.2];
  const heights = [1.6, 2.4, 1.2, 3.0, 2.0];
  for (let i = 0; i < N; i++) {
    const b = i % bars.length;
    const t = rnd(i, 15);
    set(5, i, bars[b] + jz(i, 16) * 0.3, -2.2 + t * heights[b] + jz(i, 17) * 0.2, jz(i, 18) * 0.3);
  }

  const seeds = new Float32Array(N);
  for (let i = 0; i < N; i++) seeds[i] = rnd(i, 23);
  return { pos, seeds };
}

function Matter({ states, progress, mouse }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cc = useMemo(() => new THREE.Color(), []);
  const A = useMemo(() => new THREE.Color('#5b4be6'), []);
  const B = useMemo(() => new THREE.Color('#f0eee8'), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const p = clamp01(progress.current);
    let k = 0;
    for (let i = 0; i < CD.length - 1; i++) if (p >= CD[i]) k = i;
    k = Math.min(k, states.pos.length - 2);
    const local = ph(p, CD[k], CD[k + 1]);
    const { pos, seeds } = states;
    const P0 = pos[k], P1 = pos[k + 1];
    const m = meshRef.current;
    for (let i = 0; i < N; i++) {
      const st = smooth(clamp01((local - seeds[i] * 0.32) / 0.68));
      const x = P0[i * 3] + (P1[i * 3] - P0[i * 3]) * st;
      const y = P0[i * 3 + 1] + (P1[i * 3 + 1] - P0[i * 3 + 1]) * st;
      const z = P0[i * 3 + 2] + (P1[i * 3 + 2] - P0[i * 3 + 2]) * st;
      const bob = Math.sin(time * 1.1 + seeds[i] * 9) * 0.04;
      dummy.position.set(x, y + bob, z);
      dummy.scale.setScalar(0.052 + seeds[i] * 0.02);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      cc.copy(A).lerp(B, seeds[i] * 0.5);
      m.setColorAt(i, cc);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (groupRef.current) {
      groupRef.current.rotation.y += (mouse.current.x * 0.3 - groupRef.current.rotation.y) * 0.045;
      groupRef.current.rotation.x += (-mouse.current.y * 0.18 - groupRef.current.rotation.x) * 0.045;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, N]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function CamRig({ progress, mouse }) {
  useFrame((state) => {
    const p = clamp01(progress.current);
    const cam = state.camera;
    const tx = Math.sin(p * Math.PI * 2) * 0.5 + mouse.current.x * 0.7;
    const ty = Math.sin(p * Math.PI * 1.4 + 0.5) * 0.3 + mouse.current.y * 0.45;
    cam.position.x += (tx - cam.position.x) * 0.05;
    cam.position.y += (ty - cam.position.y) * 0.05;
    cam.position.z += (8.6 - cam.position.z) * 0.05;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

function splitWords(text) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((w, i) => <span className="ofs__w" key={i} style={{ '--i': i }}>{w}</span>)}
      </span>
    </>
  );
}

export default function OffersShowcase({ offers, prices, billing, badge, labels, intro, locale }) {
  const rootRef = useRef(null);
  const railFillRef = useRef(null);
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const [detail, setDetail] = useState(false);
  const reduced = prefersReduced();

  const states = useMemo(buildStates, []);
  const introWord = intro.title.split(' ')[0];
  const introRest = intro.title.slice(introWord.length).replace(/^\s+/, '');

  /* intro + 4 offres + facturation = 6 panneaux */
  const panels = useMemo(() => ([
    { kind: 'intro' },
    ...offers.map((o) => ({ kind: 'offer', o, price: prices[o.id] })),
    { kind: 'billing' },
  ]), [offers, prices]);

  const railLabels = [intro.eyebrow, ...offers.map((o) => o.name), billing.title.replace(/\.$/, '')];

  const toQuiz = (e) => { e.preventDefault(); document.getElementById('qcm')?.scrollIntoView({ behavior: 'smooth' }); };

  useGSAP(() => {
    if (reduced) return;
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      snap: { snapTo: CD, duration: { min: 0.2, max: 0.6 }, delay: 0.05, ease: 'power2.inOut' },
      onUpdate: (self) => {
        const p = self.progress;
        progress.current = p;
        let best = 0, bd = 9;
        CD.forEach((c, i) => { const d = Math.abs(p - c); if (d < bd) { bd = d; best = i; } });
        setActive((a) => { if (a !== best) setDetail(false); return a === best ? a : best; });
        if (railFillRef.current) railFillRef.current.style.transform = `scaleX(${clamp01((p - 0.03) / 0.9)})`;
      },
    });
    const onMove = (e) => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5; };
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) window.addEventListener('pointermove', onMove, { passive: true });
    return () => { st.kill(); window.removeEventListener('pointermove', onMove); };
  }, { scope: rootRef, dependencies: [locale] });

  /* ————— Fallback lisible (reduced-motion) ————— */
  if (reduced) {
    return (
      <section className="ofs-flat">
        <div className="container">
          <p className="eyebrow eyebrow--index">{intro.eyebrow}</p>
          <h1 className="ofs-flat__title">{intro.title}</h1>
          <p className="ofs-flat__lead">{intro.lead}</p>
          {offers.map((o) => {
            const pr = prices[o.id];
            return (
              <div className={`ofs-flat__card${o.featured ? ' is-featured' : ''}`} key={o.id}>
                <div className="ofs-flat__top">
                  <h3>{o.name}</h3>
                  <span className="ofs-flat__price">{pr.amount}</span>
                </div>
                <p className="ofs-flat__tag">{o.tagline}</p>
                <ul>{o.features.map((f, k) => <li key={k}>{f}</li>)}</ul>
                <Link to="/contact" className="btn btn--ghost">{o.cta}<span className="btn__arrow" aria-hidden="true">→</span></Link>
              </div>
            );
          })}
          <p className="ofs-flat__billing"><strong>{billing.title}</strong> {billing.text}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="ofs" ref={rootRef}>
      <div className="ofs__holder">
        <Canvas
          className="ofs__canvas"
          dpr={[1, 2]}
          camera={{ position: [0, 0, 9], fov: 52, near: 0.1, far: 40 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={[INK]} />
          <fog attach="fog" args={[INK, 9, 20]} />
          <Matter states={states} progress={progress} mouse={mouse} />
          <CamRig progress={progress} mouse={mouse} />
        </Canvas>

        <div className="ofs__scrim" aria-hidden="true" />

        <div className="ofs__copy">
          {panels.map((pn, i) => {
            const shown = active === i;

            if (pn.kind === 'intro') {
              return (
                <article className={`ofs__panel ofs__panel--intro${shown ? ' is-active' : ''}`} key="intro">
                  <p className="ofs__kicker">{intro.eyebrow}</p>
                  <h1 className="ofs__intro-title">
                    <span className="sr-only">{intro.title}</span>
                    <span aria-hidden="true">
                      <NetWord className="ofs__netword">{introWord}</NetWord>{introRest ? ` ${introRest}` : ''}
                    </span>
                  </h1>
                  <p className="ofs__intro-lead">{intro.lead}</p>
                  <a href="#qcm" className="btn btn--on-dark ofs__intro-cta" onClick={toQuiz} data-cursor-label={intro.action}>
                    {intro.action}<span className="btn__arrow" aria-hidden="true">↓</span>
                  </a>
                  <span className="ofs__cue">{intro.cue}<i /></span>
                </article>
              );
            }

            if (pn.kind === 'billing') {
              return (
                <article className={`ofs__panel ofs__panel--billing${shown ? ' is-active' : ''}`} key="billing">
                  <p className="ofs__kicker">{billing.kicker}</p>
                  <h2 className="ofs__name">{splitWords(billing.title)}</h2>
                  <p className="ofs__billing-text">{billing.text}</p>
                  <p className="ofs__billing-note">{billing.note}</p>
                </article>
              );
            }

            const { o, price } = pn;
            const isOpen = shown && detail;
            return (
              <article className={`ofs__panel${o.featured ? ' is-featured' : ''}${shown ? ' is-active' : ''}`} key={o.id}>
                <p className="ofs__kicker">
                  {labels.offer} {String(i).padStart(2, '0')}
                  {o.featured && <span className="ofs__badge">{badge}</span>}
                </p>
                <h2 className="ofs__name">{splitWords(o.name)}</h2>
                <p className="ofs__tagline">{o.tagline}</p>

                <div className="ofs__price">
                  <span className="ofs__price-amount">{price.amount}</span>
                  <span className="ofs__price-type">{price.type}</span>
                  <span className="ofs__price-note">{price.note}</span>
                </div>

                <ul className="ofs__features">
                  {o.features.map((f, k) => (
                    <li key={k}><span className="ofs__dot" aria-hidden="true" />{f}</li>
                  ))}
                </ul>

                <div className="ofs__actions">
                  <Link to="/contact" className={`btn ${o.featured ? 'btn--primary' : 'btn--on-dark'}`} data-cursor-label={o.cta}>
                    {o.cta}<span className="btn__arrow" aria-hidden="true">→</span>
                  </Link>
                  <button type="button" className="ofs__toggle" aria-expanded={isOpen} onClick={() => setDetail((d) => !d)}>
                    {isOpen ? labels.hide : labels.detail}
                    <span className="ofs__toggle-icon" aria-hidden="true" />
                  </button>
                </div>

                <div className={`ofs__detail${isOpen ? ' is-open' : ''}`}>
                  <div className="ofs__detail-inner">
                    <p className="ofs__detail-text">{o.detail}</p>
                    <p className="ofs__pricing-label">{labels.pricing}</p>
                    <ul className="ofs__pricing">
                      {o.pricingFactors.map((f, k) => <li key={k}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* frise des scènes */}
        <div className="ofs__rail" aria-hidden="true">
          <span className="ofs__rail-line"><i ref={railFillRef} /></span>
          <span className="ofs__rail-dots">
            {railLabels.map((lab, i) => (
              <span className={`ofs__rail-dot${active === i ? ' is-active' : ''}${active >= i ? ' is-on' : ''}`} key={i}>
                <b>{String(i).padStart(2, '0')}</b><em>{lab}</em>
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
