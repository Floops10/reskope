import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SCENES } from '../lib/scenes';
import { cubeColore, ARETE, graine, doux, clamp01 } from '../lib/troisd';

/* ============================================================
   LA SÉQUENCE — l'offre se joue, en volume, et elle s'annote.

   Ce sont les MÊMES scènes que celles de l'explorateur : quinze outils nommés
   pour l'audit, la ressaisie à la main et la passerelle pour la mise en ordre,
   les couches et le trou pour le sur-mesure. L'accueil montrait jusqu'ici des
   emblèmes de trois blocs pendant que le détail dormait ailleurs — d'où
   l'impression que l'offre n'était pas claire. Il n'y a plus qu'un objet par
   chantier, et on le retrouve identique quand on entre dedans.

   Les blocs n'apparaissent pas : ils arrivent du lointain, chacun de sa
   direction, en tournant sur eux-mêmes, et se rangent. Puis des annotations
   se posent sur les pièces qui comptent — une amorce, un mot, « ça, c'est
   ça » — et la caméra glisse vers le chantier suivant pendant qu'un fil se
   tend derrière elle.

   Rien ne tourne tant que la section n'est pas à l'écran : le moteur se monte
   à l'approche et sa boucle s'arrête dès qu'on la quitte. Un moteur 3D ne
   doit rien coûter à qui ne le regarde pas.
   ============================================================ */

const ARRIVEE = 1.7;
const TENUE = 3.2;
const TRANSIT = 1.3;
const CYCLE = ARRIVEE + TENUE + TRANSIT;
const PAS = 30;
/* Deux annotations par chantier : trois se marchent dessus, une n'explique
   pas la chaîne. */
const ANNOTES = 2;

function centreDe(scene) {
  return { x: scene.sol.W / 2, y: scene.sol.D / 2 };
}

function enTrois(p, c, i) {
  return {
    i,
    id: p.id,
    pos: [p.x + p.w / 2 - c.x, p.z0 + p.h / 2, p.y + p.d / 2 - c.y],
    haut: p.z0 + p.h,
    taille: [p.w, Math.max(p.h, 0.01), p.d],
    etat: p.etat,
  };
}

/* Les annotations d'un chantier : le nom de l'étape, posé sur la pièce dont
   elle parle. C'est la scène qui explique, pas un paragraphe à côté. */
function annotationsDe(scene, lang) {
  const parId = Object.fromEntries(scene.blocs.map((b) => [b.id, b]));
  const out = [];
  for (const e of scene.etapes) {
    const id = (e.mots && e.mots[0]) || (e.ids && e.ids[0]);
    const bl = id && parId[id];
    if (!bl) continue;
    out.push({ id, texte: (e[lang] || e.fr).nom });
    if (out.length === ANNOTES) break;
  }
  return out;
}

function avanceDe(horloge, etape, n) {
  const t = horloge.current % (n * CYCLE);
  const i = Math.floor(t / CYCLE);
  if (etape < i) return 1;
  if (etape > i) return 0;
  return clamp01((t - i * CYCLE) / ARRIVEE);
}

function avanceFil(horloge, fil, n) {
  const t = horloge.current % (n * CYCLE);
  const i = Math.floor(t / CYCLE);
  if (fil < i - 1) return 1;
  if (fil > i - 1) return 0;
  return clamp01((t - i * CYCLE + TRANSIT) / TRANSIT);
}

/* L'apparition d'une annotation : après que les blocs se sont rangés, et
   l'une après l'autre. */
function avanceNote(horloge, etape, rang, n) {
  const t = horloge.current % (n * CYCLE);
  const i = Math.floor(t / CYCLE);
  if (i !== etape) return 0;
  const local = t - i * CYCLE;
  const debut = ARRIVEE + 0.25 + rang * 0.85;
  if (local > ARRIVEE + TENUE) return clamp01((ARRIVEE + TENUE + 0.5 - local) / 0.5);
  return clamp01((local - debut) / 0.5);
}

function Bloc({ bl, decalage, geos, horloge, etape, n }) {
  const maille = useRef(null);
  const depart = useMemo(() => {
    const a = graine(bl.i + decalage * 31, 3) * Math.PI * 2;
    const d = 24 + graine(bl.i, 5) * 26;
    return [
      bl.pos[0] + Math.cos(a) * d,
      bl.pos[1] + 12 + graine(bl.i, 7) * 22,
      bl.pos[2] + Math.sin(a) * d,
    ];
  }, [bl, decalage]);

  useFrame((etat) => {
    const m = maille.current;
    if (!m) return;
    const t = clamp01((avanceDe(horloge, etape, n) - graine(bl.i, 11) * 0.42) / 0.58);
    const e = doux(t);
    const flot = Math.sin(etat.clock.elapsedTime * 0.7 + graine(bl.i, 13) * 9) * 0.07 * e;

    m.position.set(
      depart[0] + (bl.pos[0] - depart[0]) * e,
      depart[1] + (bl.pos[1] - depart[1]) * e + flot,
      depart[2] + (bl.pos[2] - depart[2]) * e
    );
    const r = (1 - e) * 1.7;
    m.rotation.set(
      r * (graine(bl.i, 17) - 0.5),
      r * (graine(bl.i, 19) - 0.5),
      r * (graine(bl.i, 23) - 0.5)
    );
    const s = 0.18 + 0.82 * e;
    m.scale.set(bl.taille[0] * s, bl.taille[1] * s, bl.taille[2] * s);
    m.visible = t > 0.001;
  });

  if (bl.etat === 'creux') {
    return (
      <mesh ref={maille}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial visible={false} />
        <Edges threshold={1} color={ARETE.creux} />
      </mesh>
    );
  }
  const teinte = bl.etat === 'neuf' ? 'neuf' : bl.etat === 'socle' ? 'socle' : 'plein';
  return (
    <mesh ref={maille} geometry={geos[teinte]}>
      <meshBasicMaterial vertexColors toneMapped={false} />
      <Edges threshold={15} color={ARETE[teinte] || ARETE.plein} />
    </mesh>
  );
}

function Sol({ scene, horloge, etape, n }) {
  const ligne = useRef(null);
  const geo = useMemo(() => {
    const pts = [];
    const { W, D, pas } = scene.sol;
    const c = centreDe(scene);
    for (let i = 0; i <= W + 0.001; i += pas) pts.push(i - c.x, 0, -c.y, i - c.x, 0, D - c.y);
    for (let j = 0; j <= D + 0.001; j += pas) pts.push(-c.x, 0, j - c.y, W - c.x, 0, j - c.y);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [scene]);
  useFrame(() => {
    if (ligne.current) {
      ligne.current.material.opacity = 0.3 * clamp01(avanceDe(horloge, etape, n) * 2.4);
    }
  });
  return (
    <lineSegments ref={ligne} geometry={geo}>
      <lineBasicMaterial color="#1C0CB3" transparent opacity={0} />
    </lineSegments>
  );
}

/* Une annotation : une amorce qui part du sommet de la pièce, et le mot au
   bout. Elle se plie et disparaît quand le chantier s'éloigne. */
function Note({ bl, texte, horloge, etape, rang, n }) {
  const groupe = useRef(null);
  const tige = useRef(null);
  const [vu, setVu] = useState(false);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));
    return g;
  }, []);

  const hauteur = 2.2 + rang * 1.7;

  useFrame((etat) => {
    const a = avanceNote(horloge, etape, rang, n);
    const g = groupe.current;
    if (!g) return;
    const flot = Math.sin(etat.clock.elapsedTime * 0.6 + rang * 2.1) * 0.09 * a;
    g.position.set(bl.pos[0], bl.haut + flot, bl.pos[2]);
    g.visible = a > 0.01;
    if (tige.current) {
      tige.current.scale.set(1, hauteur * doux(a), 1);
      tige.current.material.opacity = 0.55 * a;
    }
    setVu((v) => (v === a > 0.45 ? v : a > 0.45));
  });

  return (
    <group ref={groupe}>
      <lineSegments ref={tige} geometry={geo}>
        <lineBasicMaterial color="#1C0CB3" transparent opacity={0} />
      </lineSegments>
      {vu && (
        <Html position={[0, hauteur + 0.5, 0]} center zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
          <span className="seq__note">{texte}</span>
        </Html>
      )}
    </group>
  );
}

function Fil({ depart, arrivee, horloge, fil, n }) {
  const maille = useRef(null);
  const L = arrivee - depart;
  useFrame(() => {
    const m = maille.current;
    if (!m) return;
    const t = avanceFil(horloge, fil, n);
    m.scale.set(Math.max(L * t, 0.001), 1, 1);
    m.position.set(depart + (L * t) / 2, 8.5, 0);
    m.visible = t > 0.01;
  });
  return (
    <mesh ref={maille}>
      <boxGeometry args={[1, 0.24, 0.24]} />
      <meshBasicMaterial color="#6B5BEA" toneMapped={false} />
    </mesh>
  );
}

function Chantier({ nom, index, geos, horloge, n, lang, actif }) {
  const scene = SCENES[nom];
  const c = useMemo(() => centreDe(scene), [scene]);
  const blocs = useMemo(() => scene.blocs.map((p, i) => enTrois(p, c, i)), [scene, c]);
  const notes = useMemo(() => {
    const parId = Object.fromEntries(blocs.map((b) => [b.id, b]));
    return annotationsDe(scene, lang)
      .map((a) => ({ ...a, bl: parId[a.id] }))
      .filter((a) => a.bl);
  }, [scene, blocs, lang]);

  return (
    <group position={[index * PAS, 0, 0]}>
      <Sol scene={scene} horloge={horloge} etape={index} n={n} />
      {blocs.map((bl) => (
        <Bloc key={bl.i} bl={bl} decalage={index} geos={geos} horloge={horloge} etape={index} n={n} />
      ))}
      {actif && notes.map((a, r) => (
        <Note key={a.id} bl={a.bl} texte={a.texte} horloge={horloge} etape={index} rang={r} n={n} />
      ))}
    </group>
  );
}

function Camera({ camRef, cible }) {
  const size = useThree((s) => s.size);
  const pos = useRef(0);

  useEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    /* Cadré sur la plus large des scènes, pour qu'aucune ne déborde. */
    const rayon = 19;
    cam.zoom = Math.min(size.width / (rayon * 2.2), size.height / (rayon * 1.45));
    cam.updateProjectionMatrix();
  }, [camRef, size]);

  useFrame((etat, dt) => {
    const cam = camRef.current;
    if (!cam) return;
    pos.current += (cible.current - pos.current) * Math.min(dt * 2.1, 1);
    const t = etat.clock.elapsedTime;
    cam.position.set(pos.current + 20, 15 + Math.sin(t * 0.3) * 0.8, 20 + Math.cos(t * 0.25) * 0.8);
    cam.lookAt(pos.current, 3.6, 0);
  });
  return null;
}

function Scene({ figures, onEtape, reduit, lang, enVue }) {
  const cam = useRef(null);
  const cible = useRef(0);
  const geos = useMemo(() => ({
    plein: cubeColore('plein'),
    neuf: cubeColore('neuf'),
    socle: cubeColore('socle'),
  }), []);
  const horloge = useRef(reduit ? ARRIVEE + 1 : 0);
  const [actif, setActif] = useState(0);

  useFrame((_, dt) => {
    /* Double garde : la boucle de rendu est coupée par la propriété du
       canevas, et l'horloge ne tourne pas non plus. Une section qu'on ne
       regarde pas ne doit rien consommer, et elle ne doit pas non plus
       avoir « avancé toute seule » quand on y revient. */
    if (reduit || !enVue) return;
    horloge.current += dt;
    const t = horloge.current % (figures.length * CYCLE);
    const i = Math.min(Math.floor(t / CYCLE), figures.length - 1);
    cible.current = i * PAS;
    setActif((v) => (v === i ? v : i));
  });

  useEffect(() => { onEtape(actif); }, [actif, onEtape]);

  return (
    <>
      <OrthographicCamera ref={cam} makeDefault position={[20, 15, 20]} near={-400} far={800} />
      <Camera camRef={cam} cible={cible} />
      {figures.map((nom, i) => (
        <Chantier
          key={nom}
          nom={nom}
          index={i}
          geos={geos}
          horloge={horloge}
          n={figures.length}
          lang={lang}
          actif={actif === i}
        />
      ))}
      {figures.slice(1).map((nom, i) => (
        <Fil key={nom} depart={i * PAS + 12} arrivee={(i + 1) * PAS - 12} horloge={horloge} fil={i} n={figures.length} />
      ))}
    </>
  );
}

export default function Sequence({ figures, onEtape, reduit, lang, enVue }) {
  return (
    <Canvas
      className="seq__canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      /* La boucle s'arrête dès que la section quitte l'écran. */
      frameloop={enVue && !reduit ? 'always' : 'never'}
    >
      <Scene figures={figures} onEtape={onEtape} reduit={reduit} lang={lang} enVue={enVue} />
    </Canvas>
  );
}
