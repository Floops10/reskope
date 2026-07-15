import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollTrigger, useGSAP } from '../lib/gsap';

/* ============================================================
   NUMÉRIQUE RESPONSABLE — « L'ALLÈGEMENT » (WebGL, v4).
   Même moteur 3D que le Constat et les Offres, au vert :
   un nuage d'outils-particules ; le superflu S'ÉTEINT sous le
   scroll (compteur en %) ; ce qui reste migre et dessine une
   VRAIE FEUILLE (pointe fine, base arrondie, nervure centrale
   courbée, nervures latérales, tige, légère pliure 3D), qui
   ondule doucement en finale. Snap sur les 3 temps.
   ============================================================ */

const BG = '#053a1e';
const N = 620;
const CD_SNAP = [0.06, 0.5, 0.92];
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ph = (p, a, b) => clamp01((p - a) / (b - a));
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ——— La VRAIE feuille ———
   Axe vertical : base (t=0) en bas arrondie, POINTE fine en haut (t=1).
   Le limbe se cambre (bend) et se plie légèrement le long de la nervure
   centrale (z). Une tige part de la base. */
const L_BASE = -1.75;
const L_LEN = 4.4;
const W_MAX = 1.42;
const leafW = (t) => W_MAX * Math.pow(Math.sin(Math.PI * Math.min(t, 0.999)), 0.72) * (1 - 0.34 * t);
const leafBend = (t) => 0.34 * Math.sin(Math.PI * t * 0.92);
const leafPt = (t, side) => {
  const y = L_BASE + L_LEN * t;
  const w = leafW(t);
  return [leafBend(t) + side * w, y, side * 0.22 * Math.sin(Math.PI * t)];
};
const midPt = (t) => [leafBend(t), L_BASE + L_LEN * t, 0];

function buildLeaf() {
  const pts = [];       // cibles des survivants
  const segs = [];      // nervures/contour (paires d'index dans pts)
  const add = (p) => (pts.push(p), pts.length - 1);

  /* contour : 2 × 30 points */
  const CN = 30;
  const left = [], right = [];
  for (let k = 1; k <= CN; k++) {
    const t = k / (CN + 1);
    left.push(add(leafPt(t, -1)));
    right.push(add(leafPt(t, 1)));
  }
  for (let k = 0; k < CN - 1; k++) {
    segs.push([left[k], left[k + 1]]);
    segs.push([right[k], right[k + 1]]);
  }
  /* pointe + base ferment le contour */
  const tip = add(midPt(1));
  const base = add(midPt(0));
  segs.push([left[CN - 1], tip], [right[CN - 1], tip], [left[0], base], [right[0], base]);

  /* nervure centrale : 12 points */
  const mid = [];
  for (let k = 0; k <= 11; k++) mid.push(add(midPt(0.04 + (k / 11) * 0.92)));
  for (let k = 0; k < 11; k++) segs.push([mid[k], mid[k + 1]]);

  /* nervures latérales : 5 paires, inclinées vers la pointe */
  const veinTs = [0.18, 0.34, 0.5, 0.66, 0.8];
  veinTs.forEach((t0) => {
    [-1, 1].forEach((side) => {
      const from = add(midPt(t0));
      const chain = [from];
      const VS = 4;
      for (let k = 1; k <= VS; k++) {
        const f = k / VS;
        const tEdge = Math.min(t0 + 0.14, 0.97);
        const t = t0 + (tEdge - t0) * f;
        const w = leafW(t) * f * 0.94;
        chain.push(add([leafBend(t) + side * w, L_BASE + L_LEN * t, side * 0.2 * Math.sin(Math.PI * t) * f]));
      }
      for (let k = 0; k < VS; k++) segs.push([chain[k], chain[k + 1]]);
    });
  });

  /* tige : 6 points qui descendent en s'incurvant */
  const stem = [];
  for (let k = 0; k <= 5; k++) {
    const f = k / 5;
    stem.push(add([-0.12 * f * f * 3, L_BASE - f * 1.15, 0]));
  }
  for (let k = 0; k < 5; k++) segs.push([stem[k], stem[k + 1]]);

  return { pts, segs };
}

function Matter({ progress, mouse, deadRef }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const lineMatRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const cc = useMemo(() => new THREE.Color(), []);
  const CREAM = useMemo(() => new THREE.Color('#efeee6'), []);
  const GREEN = useMemo(() => new THREE.Color('#7ddfa8'), []);
  const DIM = useMemo(() => new THREE.Color('#9fc4ad'), []);

  const data = useMemo(() => {
    const { pts, segs } = buildLeaf();
    const KEEP = pts.length;                          // ~140 survivants
    /* nuage initial : tous les outils, dispersés en profondeur */
    const cloud = Array.from({ length: N }, (_, i) => [
      (rnd(i, 1) - 0.5) * 10.4,
      (rnd(i, 2) - 0.5) * 5.6,
      (rnd(i, 3) - 0.5) * 3.2,
    ]);
    /* survivants répartis uniformément dans le nuage */
    const keepIdx = Array.from({ length: KEEP }, (_, k) => Math.round((k * (N - 1)) / (KEEP - 1)));
    const keepSet = new Set(keepIdx);
    const leafOf = new Map(keepIdx.map((idx, k) => [idx, pts[k]]));
    const order = Array.from({ length: N }, (_, i) => i)
      .filter((i) => !keepSet.has(i))
      .sort((a, b) => rnd(a, 4) - rnd(b, 4));
    const rankOf = new Map(order.map((idx, r) => [idx, r]));
    /* géométrie des nervures */
    const linePos = [];
    segs.forEach(([a, b]) => linePos.push(...pts[a], ...pts[b]));
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
    const seeds = new Float32Array(N);
    for (let i = 0; i < N; i++) seeds[i] = rnd(i, 5);
    return { cloud, keepSet, leafOf, order, rankOf, lineGeo, seeds, deadTotal: order.length };
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const p = clamp01(progress.current);
    const m = meshRef.current;
    const { cloud, keepSet, leafOf, order, rankOf, seeds } = data;

    let dead = 0;
    for (let i = 0; i < N; i++) {
      const [cx, cy, cz] = cloud[i];
      const bob = Math.sin(time * 0.9 + seeds[i] * 9) * 0.05;
      if (keepSet.has(i)) {
        const [lx, ly, lz] = leafOf.get(i);
        const t = smooth(ph(p, 0.4 + seeds[i] * 0.1, 0.72 + seeds[i] * 0.08));
        dummy.position.set(cx + (lx - cx) * t, cy + bob * (1 - t) + (ly - cy) * t, cz + (lz - cz) * t);
        dummy.scale.setScalar(0.045 + t * 0.02);
        cc.copy(CREAM).lerp(GREEN, t);
      } else {
        const r = rankOf.get(i);
        const die = 0.1 + (r / order.length) * 0.4;
        const d = smooth(ph(p, die, die + 0.05));
        if (p >= die + 0.03) dead++;
        dummy.position.set(cx + (rnd(i, 6) - 0.5) * 0.6 * d, cy + bob * (1 - d) - d * 0.7, cz);
        dummy.scale.setScalar(0.042 * (1 - d));
        cc.copy(DIM).lerp(CREAM, 0.3 * (1 - d));
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, cc);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (deadRef.current) {
      deadRef.current.textContent = `${Math.round((dead / data.deadTotal) * 100)} %`;
    }

    /* nervures : apparition pendant la formation */
    if (lineMatRef.current) lineMatRef.current.opacity = 0.55 * smooth(ph(p, 0.55, 0.8));

    /* la feuille respire : ondulation en finale + regard souris */
    if (groupRef.current) {
      const alive = smooth(ph(p, 0.82, 0.9));
      groupRef.current.rotation.z = Math.sin(time * 0.7) * 0.05 * alive;
      groupRef.current.rotation.y += (mouse.current.x * 0.35 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-mouse.current.y * 0.2 - groupRef.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, N]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={data.lineGeo}>
        <lineBasicMaterial ref={lineMatRef} color="#7ddfa8" transparent opacity={0} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

function CamRig({ progress, mouse }) {
  useFrame((state) => {
    const p = clamp01(progress.current);
    const cam = state.camera;
    const tx = Math.sin(p * Math.PI * 1.6) * 0.5 + mouse.current.x * 0.7;
    const ty = Math.sin(p * Math.PI) * 0.25 + mouse.current.y * 0.4;
    cam.position.x += (tx - cam.position.x) * 0.05;
    cam.position.y += (ty - cam.position.y) * 0.05;
    cam.position.z += ((8.8 - p * 1.4) - cam.position.z) * 0.05;
    cam.lookAt(0, 0.15, 0);
  });
  return null;
}

export default function EcoAllege({ t }) {
  const rootRef = useRef(null);
  const deadRef = useRef(null);
  const capRefs = useRef([]);
  const stepRefs = useRef([]);
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [, setPhase] = useState(0);
  const reduced = prefersReduced();

  useGSAP(() => {
    if (reduced) { progress.current = 1; return; }
    const apply = (p) => {
      progress.current = p;
      const phase = p < 0.32 ? 0 : p < 0.72 ? 1 : 2;
      setPhase((prev) => {
        if (prev !== phase) {
          capRefs.current.forEach((cap, i) => cap && cap.classList.toggle('is-on', i === phase));
          stepRefs.current.forEach((s, i) => {
            if (!s) return;
            s.classList.toggle('is-on', i <= phase);
            s.classList.toggle('is-active', i === phase);
          });
        }
        return phase;
      });
      rootRef.current.querySelector('.epg__glow')?.classList.toggle('is-lit', p > 0.84);
    };
    apply(0);
    if (import.meta.env && import.meta.env.DEV) window.__eco = apply;
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      snap: { snapTo: CD_SNAP, duration: { min: 0.25, max: 0.8 }, delay: 0.08, ease: 'power2.inOut' },
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(self.progress),
    });
    const onMove = (e) => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5; };
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) window.addEventListener('pointermove', onMove, { passive: true });
    return () => { st.kill(); window.removeEventListener('pointermove', onMove); if (window.__eco) delete window.__eco; };
  }, { scope: rootRef, dependencies: [] });

  return (
    <section className="epg" ref={rootRef} aria-label={t.caps[2]}>
      <div className="epg__stage">
        <Canvas
          className="epg__canvas"
          dpr={[1, 2]}
          camera={{ position: [0, 0.15, 8.8], fov: 50, near: 0.1, far: 40 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={[BG]} />
          <fog attach="fog" args={[BG, 9, 20]} />
          <Matter progress={progress} mouse={mouse} deadRef={deadRef} />
          <CamRig progress={progress} mouse={mouse} />
        </Canvas>

        <div className="epg__glow" aria-hidden="true" />

        <div className="epg__hud" aria-hidden="true">
          <span className="epg__count"><b ref={deadRef}>0 %</b> {t.counterLabel}</span>
          <span className="epg__kicker">{t.kicker}</span>
        </div>

        <div className="epg__scrim" aria-hidden="true" />

        <div className="epg__caps">
          {t.caps.map((cap, i) => (
            <p className={`epg__cap${i === 0 ? ' is-on' : ''}`} key={i} ref={(el) => { capRefs.current[i] = el; }}>
              {cap.split(' ').map((w, k) => (
                <span className="epg__w" key={k} style={{ '--i': k }}>{w}</span>
              ))}
            </p>
          ))}
        </div>

        <div className="epg__steps" aria-hidden="true">
          {t.caps.map((_, i) => (
            <span className={`epg__step${i === 0 ? ' is-on is-active' : ''}`} key={i} ref={(el) => { stepRefs.current[i] = el; }}>
              0{i + 1}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
