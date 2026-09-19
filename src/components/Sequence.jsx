import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { paves, SOL_TAILLE, CENTRE } from '../lib/figures';
import { cubeColore, ARETE, graine, doux, clamp01 } from '../lib/troisd';

/* ============================================================
   LA SÉQUENCE — l'offre se joue toute seule, en volume.

   Une vidéo, mais calculée. Les blocs ne se posent pas : ils arrivent du
   lointain, chacun de sa direction, et se rangent à leur place. Puis la
   caméra glisse vers l'étape suivante, le réseau se tend derrière elle, et
   ainsi de suite jusqu'au bout, en boucle. Rien à faire pour que ça démarre,
   rien à lire pour comprendre : on voit la chaîne se construire.

   Tout flotte en permanence — un léger balancement propre à chaque bloc.
   C'est ce qui sépare une scène en volume d'un dessin à plat qu'on aurait
   simplement incliné.

   La scène n'est montée que lorsqu'elle approche de l'écran, et elle se met
   en pause dès qu'elle le quitte ou que l'onglet passe derrière : personne ne
   doit payer un moteur 3D pour une section qu'il ne regardera pas.
   ============================================================ */

/* Les temps d'une étape, en secondes. */
const ARRIVEE = 1.7;
const TENUE = 2.3;
const TRANSIT = 1.3;
const CYCLE = ARRIVEE + TENUE + TRANSIT;
/* L'écart entre deux étapes dans le monde. */
const PAS = SOL_TAILLE.W + 7;

function enTrois(p, i) {
  return {
    i,
    pos: [p.x + p.w / 2 - CENTRE.x, (p.z0 + p.z1) / 2, p.y + p.d / 2 - CENTRE.y],
    taille: [p.w, Math.max(p.z1 - p.z0, 0.01), p.d],
    creux: p.creux,
  };
}

/* L'avancement d'une étape, déduit de la seule horloge partagée. Chaque
   élément fait son calcul dans sa propre boucle : il n'y a rien à écrire dans
   un tableau commun, donc rien qui puisse se désynchroniser. */
function avanceDe(horloge, etape, n) {
  const total = n * CYCLE;
  const t = horloge.current % total;
  const i = Math.floor(t / CYCLE);
  if (etape < i) return 1;
  if (etape > i) return 0;
  return clamp01((t - i * CYCLE) / ARRIVEE);
}

function avanceFil(horloge, fil, n) {
  const total = n * CYCLE;
  const t = horloge.current % total;
  const i = Math.floor(t / CYCLE);
  if (fil < i - 1) return 1;
  if (fil > i - 1) return 0;
  return clamp01((t - i * CYCLE + TRANSIT) / TRANSIT);
}

/* Un bloc : il vient de loin, il se range, il flotte. */
function Bloc({ bl, decalage, geo, horloge, etape, n }) {
  const maille = useRef(null);
  const depart = useMemo(() => {
    const a = graine(bl.i + decalage * 31, 3) * Math.PI * 2;
    const d = 26 + graine(bl.i, 5) * 22;
    return [
      bl.pos[0] + Math.cos(a) * d,
      bl.pos[1] + 14 + graine(bl.i, 7) * 20,
      bl.pos[2] + Math.sin(a) * d,
    ];
  }, [bl, decalage]);

  useFrame((etat) => {
    const m = maille.current;
    if (!m) return;
    /* Chaque bloc part un peu après le précédent : la scène se remplit,
       elle n'apparaît pas d'un bloc. */
    const t = clamp01((avanceDe(horloge, etape, n) - graine(bl.i, 11) * 0.38) / 0.62);
    const e = doux(t);
    const flot = Math.sin(etat.clock.elapsedTime * 0.7 + graine(bl.i, 13) * 9) * 0.08 * e;

    m.position.set(
      depart[0] + (bl.pos[0] - depart[0]) * e,
      depart[1] + (bl.pos[1] - depart[1]) * e + flot,
      depart[2] + (bl.pos[2] - depart[2]) * e
    );
    const r = (1 - e) * 1.6;
    m.rotation.set(r * (graine(bl.i, 17) - 0.5), r * (graine(bl.i, 19) - 0.5), r * (graine(bl.i, 23) - 0.5));
    const s = 0.2 + 0.8 * e;
    m.scale.set(bl.taille[0] * s, bl.taille[1] * s, bl.taille[2] * s);
    m.visible = t > 0.001;
  });

  if (bl.creux) {
    return (
      <mesh ref={maille}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial visible={false} />
        <Edges threshold={1} color={ARETE.creux} />
      </mesh>
    );
  }
  return (
    <mesh ref={maille} geometry={geo}>
      <meshBasicMaterial vertexColors toneMapped={false} />
      <Edges threshold={15} color={ARETE.plein} />
    </mesh>
  );
}

/* Le sol d'une étape : il se dessine avant que les blocs n'arrivent. */
function Sol({ horloge, etape, n }) {
  const ligne = useRef(null);
  const geo = useMemo(() => {
    const pts = [];
    const { W, D, pas } = SOL_TAILLE;
    const dx = -CENTRE.x, dz = -CENTRE.y;
    for (let i = 0; i <= W; i += pas) pts.push(i + dx, 0, dz, i + dx, 0, D + dz);
    for (let j = 0; j <= D; j += pas) pts.push(dx, 0, j + dz, W + dx, 0, j + dz);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useFrame(() => {
    if (ligne.current) ligne.current.material.opacity = 0.3 * clamp01(avanceDe(horloge, etape, n) * 2.4);
  });
  return (
    <lineSegments ref={ligne} geometry={geo}>
      <lineBasicMaterial color="#1C0CB3" transparent opacity={0} />
    </lineSegments>
  );
}

/* Le fil qui relie une étape à la suivante : il se tend quand la caméra part. */
function Fil({ depart, arrivee, horloge, fil, n }) {
  const maille = useRef(null);
  const L = arrivee - depart;
  useFrame(() => {
    const m = maille.current;
    if (!m) return;
    const t = avanceFil(horloge, fil, n);
    m.scale.set(Math.max(L * t, 0.001), 1, 1);
    m.position.set(depart + (L * t) / 2, 9.5, 0);
    m.visible = t > 0.01;
  });
  return (
    <mesh ref={maille}>
      <boxGeometry args={[1, 0.22, 0.22]} />
      <meshBasicMaterial color="#6B5BEA" toneMapped={false} />
    </mesh>
  );
}

function Etape({ nom, index, geo, horloge, n, mot, actif }) {
  const blocs = useMemo(() => paves(nom).map(enTrois), [nom]);
  const x = index * PAS;
  return (
    <group position={[x, 0, 0]}>
      <Sol horloge={horloge} etape={index} n={n} />
      {blocs.map((bl, k) => (
        <Bloc key={k} bl={{ ...bl, i: k }} decalage={index} geo={geo} horloge={horloge} etape={index} n={n} />
      ))}
      {/* Le nom vit DANS la scène, au bout d'une tige, comme sur les
          planches. Pas un paragraphe posé dessous. */}
      {actif && (
        <Html position={[0, 12.4, 0]} center zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
          <span className="seq__mot">{mot}</span>
        </Html>
      )}
    </group>
  );
}

/* La caméra glisse d'une étape à l'autre, et respire en permanence. */
function Camera({ camRef, cible }) {
  const size = useThree((s) => s.size);
  const pos = useRef(0);

  useEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    const rayon = Math.hypot(SOL_TAILLE.W, SOL_TAILLE.D) / 2 + 5;
    cam.zoom = Math.min(size.width / (rayon * 2.3), size.height / (rayon * 1.5));
    cam.updateProjectionMatrix();
  }, [camRef, size]);

  useFrame((etat, dt) => {
    const cam = camRef.current;
    if (!cam) return;
    pos.current += (cible.current - pos.current) * Math.min(dt * 2.2, 1);
    const t = etat.clock.elapsedTime;
    cam.position.set(pos.current + 20, 15 + Math.sin(t * 0.32) * 0.7, 20 + Math.cos(t * 0.27) * 0.7);
    cam.lookAt(pos.current, 3.4, 0);
  });
  return null;
}

function Scene({ figures, mots, onEtape, reduit }) {
  const cam = useRef(null);
  const cible = useRef(0);
  const geo = useMemo(() => cubeColore('plein'), []);
  const [actif, setActif] = useState(0);
  /* Une seule horloge pour toute la séquence. Tout le reste s'en déduit. */
  const horloge = useRef(reduit ? CYCLE * 10 : 0);

  useFrame((_, dt) => {
    if (reduit) return;
    horloge.current += dt;
    const t = horloge.current % (figures.length * CYCLE);
    const i = Math.min(Math.floor(t / CYCLE), figures.length - 1);
    cible.current = i * PAS;
    setActif((v) => (v === i ? v : i));
  });

  useEffect(() => { onEtape(actif); }, [actif, onEtape]);

  return (
    <>
      <OrthographicCamera ref={cam} makeDefault position={[20, 15, 20]} near={-300} far={600} />
      <Camera camRef={cam} cible={cible} />
      {figures.map((nom, i) => (
        <Etape
          key={nom}
          nom={nom}
          index={i}
          geo={geo}
          horloge={horloge}
          n={figures.length}
          mot={mots[i]}
          actif={actif === i}
        />
      ))}
      {figures.slice(1).map((_, i) => (
        <Fil key={i} depart={i * PAS + 9} arrivee={(i + 1) * PAS - 9} horloge={horloge} fil={i} n={figures.length} />
      ))}
    </>
  );
}

export default function Sequence({ figures, mots, onEtape, reduit }) {
  return (
    <Canvas
      className="seq__canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      frameloop="always"
    >
      <Scene figures={figures} mots={mots} onEtape={onEtape} reduit={reduit} />
    </Canvas>
  );
}
