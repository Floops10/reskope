import { useRef, useMemo, useState, useLayoutEffect, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollTrigger, useGSAP } from '../lib/gsap';

/* ============================================================
   LA MÉTHODE — LE VOL (WebGL, v7).

   Un vaisseau qui SERPENTE dans une nuit crème de réseau. Chaque jalon est
   un AMAS dont la FORME évoque son sens (cadre, grille, priorités, modules
   reliés, boucle). Le réseau vit et réagit à la souris. Le texte HTML net
   arrive posé au-dessus de l'amas. La page S'ARRÊTE sur chaque jalon (snap).
   Survoler un point d'amas affiche les détails du jalon.

   Robustesse scroll : holder en STICKY (pas de pin GSAP fragile) + snap
   ScrollTrigger sur le smooth-scroll Lenis. reduced-motion => liste.
   ============================================================ */

const CREAM = '#f0eee8';
const INDIGO = new THREE.Color('#1c0cb3');
const INDIGO_BRIGHT = new THREE.Color('#5b4be6');
const TOTAL = 74;
const CT = [0.15, 0.33, 0.51, 0.69, 0.86];          // profondeur (t) des 5 amas
const SNAP = [0.02, ...CT, 0.99];                     // arrêts (intro + 5 + sortie)

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
const zAt = (t) => -t * TOTAL;
/* Chemin sinueux (vaisseau qui serpente) */
const pathX = (t) => Math.sin(t * Math.PI * 2.3) * 4.6 + Math.sin(t * Math.PI * 5.0 + 1) * 1.1;
const pathY = (t) => Math.sin(t * Math.PI * 1.7 + 0.6) * 2.3;

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ——— Formes d'amas propres à chaque jalon (offsets locaux, plan XY) ——— */
function shapeFor(kind) {
  const nodes = [], links = [];
  const add = (x, y, z) => (nodes.push([x, y, z]), nodes.length - 1);
  if (kind === 'frame') {           // Cadrage : un cadre
    const w = 1.5, h = 1.05, per = [];
    const edge = (x1, y1, x2, y2, n) => { for (let i = 0; i < n; i++) per.push(add(x1 + (x2 - x1) * (i / n), y1 + (y2 - y1) * (i / n), (rnd(i, 1) - 0.5) * 0.3)); };
    edge(-w, h, w, h, 4); edge(w, h, w, -h, 3); edge(w, -h, -w, -h, 4); edge(-w, -h, -w, h, 3);
    for (let i = 0; i < per.length; i++) links.push([per[i], per[(i + 1) % per.length]]);
  } else if (kind === 'grid') {     // Audit : une grille observée
    const g = [], N = 4;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) g[r * N + c] = add((c - 1.5) * 0.95, (r - 1.5) * 0.95, (rnd(r * 4 + c, 2) - 0.5) * 0.4);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { if (c < N - 1) links.push([g[r * N + c], g[r * N + c + 1]]); if (r < N - 1) links.push([g[r * N + c], g[(r + 1) * N + c]]); }
  } else if (kind === 'tiers') {    // Bilan : priorités (pyramide)
    const rows = [[-1.6, -0.55, 0.5, 1.55], [-0.9, 0.05, 1.0], [0.05]];
    const idx = [];
    rows.forEach((row, r) => { idx[r] = row.map((x) => add(x, 1.1 - r * 1.1, (rnd(r, 3) - 0.5) * 0.3)); });
    idx.forEach((row) => { for (let i = 0; i < row.length - 1; i++) links.push([row[i], row[i + 1]]); });
    idx[0].forEach((n, i) => { if (idx[1][i]) links.push([n, idx[1][i]]); });
    idx[1].forEach((n) => links.push([n, idx[2][0]]));
  } else if (kind === 'modules') {  // Mise en œuvre : modules reliés
    const block = (ox, oy) => { const b = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) b.push(add(ox + c * 0.8, oy + r * 0.8, (rnd(r + c, 4) - 0.5) * 0.3)); for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) links.push([b[i], b[j]]); return b; };
    const a = block(-1.7, -0.4), b = block(0.9, 0.2), c = block(-0.4, 1.3);
    links.push([a[1], c[0]], [c[3], b[0]], [a[1], b[2]]);
  } else {                           // Autonomie : boucle fermée
    const N = 13, R = 1.3, ring = [];
    for (let i = 0; i < N; i++) { const an = (i / N) * Math.PI * 2; ring.push(add(Math.cos(an) * R, Math.sin(an) * R * 0.8, (rnd(i, 5) - 0.5) * 0.3)); }
    for (let i = 0; i < N; i++) links.push([ring[i], ring[(i + 1) % N]]);
    for (let i = 0; i < N; i += 3) links.push([ring[i], ring[(i + Math.floor(N / 2)) % N]]);
  }
  return { nodes, links };
}
const KINDS = ['frame', 'grid', 'tiers', 'modules', 'loop'];

function buildNet() {
  const nodes = [];   // {x,y,z,s,cluster,seed}
  const links = [];
  CT.forEach((t, ci) => {
    const cx = pathX(t), cy = pathY(t), cz = zAt(t);
    const shp = shapeFor(KINDS[ci]);
    const start = nodes.length;
    shp.nodes.forEach(([x, y, z], k) => nodes.push({ x: cx + x, y: cy + y, z: cz + z, s: 0.075 + rnd(ci * 20 + k, 6) * 0.03, cluster: ci, seed: rnd(ci * 20 + k, 7) }));
    shp.links.forEach(([a, b]) => links.push([start + a, start + b]));
  });
  for (let k = 0; k < 90; k++) {          // poussière d'ambiance
    const t = rnd(k, 5), a = rnd(k, 6) * Math.PI * 2, rr = 2 + rnd(k, 7) * 5;
    nodes.push({ x: pathX(t) + Math.cos(a) * rr, y: pathY(t) + Math.sin(a) * rr * 0.7, z: zAt(t) + (rnd(k, 8) - 0.5) * 5, s: 0.03 + rnd(k, 9) * 0.04, cluster: -1, seed: rnd(k, 3) });
  }
  const node2cluster = nodes.map((n) => n.cluster);
  return { nodes, links, node2cluster };
}

function Network({ net, mouse, progress, activeCluster, hovered, setHovered }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const { nodes, links } = net;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    for (let i = 0; i < nodes.length; i++) meshRef.current.setColorAt(i, INDIGO);
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [nodes]);

  const lineGeo = useMemo(() => {
    const pos = [];
    links.forEach(([a, b]) => pos.push(nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    return g;
  }, [nodes, links]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const m = meshRef.current;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const near = clamp01(1 - Math.abs(n.z - zAt(progress.current)) / 20);
      const bob = Math.sin(t * 1.3 + n.seed * 8) * 0.05;
      dummy.position.set(n.x + mouse.current.x * near * 0.7, n.y + bob + mouse.current.y * near * 0.5, n.z);
      const hot = n.cluster >= 0 && (n.cluster === activeCluster || n.cluster === hovered);
      dummy.scale.setScalar(n.s * (hot ? 1.6 : 1));
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      m.setColorAt(i, hot ? INDIGO_BRIGHT : INDIGO);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    if (groupRef.current) {
      groupRef.current.rotation.y += (mouse.current.x * 0.12 - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-mouse.current.y * 0.08 - groupRef.current.rotation.x) * 0.05;
    }
  });

  const onMove = (e) => { const c = net.node2cluster[e.instanceId]; setHovered(c >= 0 ? c : -1); };
  const onOut = () => setHovered(-1);

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, nodes.length]} onPointerMove={onMove} onPointerOut={onOut}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={INDIGO} transparent opacity={0.24} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

function Rig({ progress, mouse }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const p = clamp01(progress.current);
    const tx = pathX(p) + mouse.current.x * 1.6;
    const ty = pathY(p) + mouse.current.y * 1.0;
    camera.position.x += (tx - camera.position.x) * 0.055;
    camera.position.y += (ty - camera.position.y) * 0.055;
    camera.position.z += (zAt(p) + 3 - camera.position.z) * 0.07;
    const la = Math.min(p + 0.04, 1);
    look.set(pathX(la), pathY(la), zAt(la) - 3);
    camera.lookAt(look);
  });
  return null;
}

function splitWords(text) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((w, i) => <span className="mfl__w" key={i} style={{ '--i': i }}>{w}</span>)}
      </span>
    </>
  );
}

export default function MethodeFlight({ jalons, film, labels }) {
  const rootRef = useRef(null);
  const hudFillRef = useRef(null);
  const synthRef = useRef(null);
  const copyRef = useRef(null);
  const scrimRef = useRef(null);
  const progress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(-1);
  const reduced = prefersReduced();

  const net = useMemo(buildNet, []);
  const kickers = labels.milestone === 'Jalon'
    ? ['Avant', 'Cadrage', 'Audit', 'Bilan', 'Mise en œuvre', 'Autonomie']
    : ['Before', 'Framing', 'Audit', 'Report', 'Delivery', 'Autonomy'];

  const stations = useMemo(() => ([
    { num: '', kicker: kickers[0], title: film.introTitle, body: film.introText, deliver: '', here: false, pos: [pathX(0.03), pathY(0.03) + 1.7, zAt(0.03)] },
    ...jalons.map((j, i) => ({
      num: j.n, kicker: `${labels.milestone} ${j.n} · ${kickers[i + 1]}`,
      title: j.title, body: j.text, deliver: j.deliver, here: j.here,
      pos: [pathX(CT[i]), pathY(CT[i]) + 1.9, zAt(CT[i])],
    })),
  ]), [jalons, film, labels]);

  useGSAP(() => {
    if (reduced) return;
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      snap: { snapTo: SNAP, duration: { min: 0.2, max: 0.7 }, delay: 0.06, ease: 'power2.inOut' },
      onUpdate: (self) => {
        const p = self.progress;
        progress.current = p;
        let best = 0, bd = 9;
        [0.02, ...CT].forEach((s, i) => { const d = Math.abs(p - s); if (d < bd) { bd = d; best = i; } });
        setActive((a) => (a === best ? a : best));
        if (hudFillRef.current) hudFillRef.current.style.transform = `scaleX(${clamp01((p - 0.02) / 0.86)})`;
        const f = clamp01((p - 0.9) / 0.08);
        if (synthRef.current) { synthRef.current.style.opacity = f; synthRef.current.style.transform = `translateY(${(24 * (1 - f)).toFixed(1)}px)`; }
        if (copyRef.current) copyRef.current.style.opacity = 1 - f;
        if (scrimRef.current) scrimRef.current.style.opacity = 1 - f;
      },
    });
    const onMove = (e) => { mouse.current.x = e.clientX / window.innerWidth - 0.5; mouse.current.y = e.clientY / window.innerHeight - 0.5; };
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) window.addEventListener('pointermove', onMove, { passive: true });
    return () => { st.kill(); window.removeEventListener('pointermove', onMove); };
  }, { scope: rootRef, dependencies: [] });

  if (reduced) {
    return (
      <section className="mfl-flat">
        <div className="container">
          <p className="eyebrow eyebrow--index">{film.introKicker}</p>
          <h2 className="mfl-flat__title">{film.introTitle}</h2>
          <p className="mfl-flat__lead">{film.introText}</p>
          <div className="jalons-list">
            {jalons.map((j) => (
              <div className={`jalon-card${j.here ? ' is-here' : ''}`} key={j.n}>
                <span className="jalon-card__num">{j.n}</span>
                <span className="jalon-card__body">
                  <span className="jalon-card__label">{j.label}{j.here && <span className="jalon-card__here">{labels.here}</span>}</span>
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

  const hoveredStation = hovered >= 0 ? hovered + 1 : -1;

  return (
    <section className="mfl" ref={rootRef}>
      <div className="mfl__holder">
        <Canvas
          className="mfl__canvas"
          dpr={[1, 2]}
          camera={{ position: [0, 0.4, 4], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={[CREAM]} />
          <fog attach="fog" args={[CREAM, 7, 34]} />
          <Network net={net} mouse={mouse} progress={progress} activeCluster={active - 1} hovered={hovered} setHovered={setHovered} />
          <Rig progress={progress} mouse={mouse} />
        </Canvas>

        {/* fond flouté derrière le texte pour la lisibilité */}
        <div className="mfl__scrim" ref={scrimRef} aria-hidden="true" />

        {/* texte : overlay fixe, bien placé et lisible (hors 3D) */}
        <div className="mfl__copy" ref={copyRef}>
          {stations.map((s, i) => {
            const shown = active === i || hoveredStation === i;
            return (
              <article className={`mfl__panel${shown ? ' is-active' : ''}`} key={i}>
                {s.num && <span className="mfl__num" aria-hidden="true">{s.num}</span>}
                <p className="mfl__kicker">{s.kicker}{s.here && <span className="mfl__here">{labels.here}</span>}</p>
                <h2 className="mfl__title">{splitWords(s.title)}</h2>
                <p className="mfl__body">{splitWords(s.body)}</p>
                {s.deliver && <p className="mfl__deliver"><span>{labels.youGet}</span>{s.deliver}</p>}
              </article>
            );
          })}
        </div>

        <div className="mfl__hud" aria-hidden="true">
          <span className="mfl__hud-line"><i ref={hudFillRef} /></span>
          <span className="mfl__hud-dots">
            {jalons.map((j, i) => (
              <span className={`mfl__hud-dot${active - 1 === i ? ' is-active' : ''}${active - 1 >= i ? ' is-on' : ''}`} key={j.n}>
                <b>{j.n}</b><em>{j.label}</em>
              </span>
            ))}
          </span>
        </div>

        <div className="mfl__hint" aria-hidden="true">{labels.hint}</div>
        <div className="mfl__synth" ref={synthRef}><p>{film.synthCap}</p></div>
      </div>
    </section>
  );
}
