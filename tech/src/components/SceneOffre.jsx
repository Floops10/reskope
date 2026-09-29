import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SCENES } from '../lib/scenes';
import { cubeColore } from '../lib/troisd';
import { usePalette3d } from '../lib/palette3d';

/* ============================================================
   L'UNIVERS D'UNE OFFRE — la planche du livret, montée en volume.

   Ce n'est pas une décoration qui tourne : c'est un schéma. Chaque bloc
   porte son nom, les liens montrent ce qui circule (ou ce qui ne circule
   pas), et la scène SE TRANSFORME d'une étape à l'autre — un trou se
   remplit, six équipes se mettent au même niveau, une ressaisie à la main
   devient une passerelle. Quand on clique une étape, on ne change pas de
   texte : on change l'objet.

   La caméra est ORTHOGRAPHIQUE, comme la projection des livrets. Une
   perspective aurait donné plus de profondeur, mais l'axonométrie est la
   langue de la marque : en tournant autour, on reconnaît le dessin qu'on
   vient de quitter. Les faces portent les trois indigos de la charte, dans
   le même ordre qu'à plat. Ce n'est pas un éclairage : ce sont les couleurs.
   ============================================================ */


/* Du monde des livrets (x, y au sol, z vers le haut) vers celui de three. */
function enTrois(p, centre) {
  return {
    ...p,
    cx: p.x + p.w / 2 - centre.x,
    cz: p.y + p.d / 2 - centre.y,
    base: p.z0,
  };
}

const lerp = (a, b, t) => a + (b - a) * t;

function Bloc({ bloc, geo, eteint, hauteur, montre, onClick }) {
  const pal = usePalette3d();
  const maille = useRef(null);
  const mat = useRef(null);
  const aretes = useRef(null);
  const etat = useRef({ o: 1, h: bloc.h, v: 1 });

  useFrame((_, dt) => {
    const k = Math.min(dt * 6, 1);
    const e = etat.current;
    const cibleO = eteint ? 0.2 : 1;
    const cibleV = montre ? 1 : 0.001;
    e.o = lerp(e.o, cibleO, k);
    e.h = lerp(e.h, hauteur, k);
    e.v = lerp(e.v, cibleV, k);

    const m = maille.current;
    if (!m) return;
    const h = Math.max(e.h * e.v, 0.001);
    m.scale.set(bloc.w, h, bloc.d);
    m.position.set(bloc.cx, bloc.base + h / 2, bloc.cz);
    m.visible = e.v > 0.01;

    /* Une matière qui passe en transparent change de programme de rendu :
       sans needsUpdate, three garde le shader opaque et l'opacité ne fait
       rien. On ne lève le drapeau qu'au changement d'état. */
    const t = e.o < 0.985;
    if (mat.current) {
      mat.current.opacity = e.o;
      if (mat.current.transparent !== t) {
        mat.current.transparent = t;
        mat.current.depthWrite = !t;
        mat.current.needsUpdate = true;
      }
    }
    if (aretes.current?.material) {
      aretes.current.material.opacity = bloc.etat === 'creux' ? e.o * 0.75 : e.o * 0.85;
      aretes.current.visible = e.v > 0.01;
    }
  });

  const clic = (e) => { e.stopPropagation(); onClick(bloc.id); };

  if (bloc.etat === 'creux') {
    return (
      <mesh ref={maille} onClick={clic}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial visible={false} />
        <Edges ref={aretes} threshold={1} color={pal.arete.creux} transparent />
      </mesh>
    );
  }

  return (
    <mesh ref={maille} geometry={geo} onClick={clic}>
      <meshBasicMaterial ref={mat} vertexColors toneMapped={false} />
      <Edges ref={aretes} threshold={15} color={pal.arete[bloc.etat] || pal.arete.plein} transparent />
    </mesh>
  );
}

/* UN LIEN — ce qui circule, ou ce qui ne circule pas.

   Posé, c'est une barre pleine, et un point la parcourt : l'information
   passe toute seule. Manquant, c'est une suite de petits cubes qui monte et
   redescend en arc — un pointillé en volume, qui dit qu'il n'y a pas de
   liaison mais quelqu'un qui fait le trajet. La différence entre les deux se
   voit d'un coup d'œil, sans légende.

   Les extrémités rentrent de deux unités dans les blocs : un trait qui part
   du centre géométrique traverse le volume et brouille le dessin. */
const INSET = 2;

function pointsArc(a, c, z, pic, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push([
      lerp(a[0], c[0], u),
      z + pic * Math.sin(u * Math.PI),
      lerp(a[1], c[1], u),
    ]);
  }
  return pts;
}

function Lien({ a, bDest, z, pose, pic = 0, seed }) {
  const pal = usePalette3d();
  const point = useRef(null);
  const t = useRef(seed);

  const { deb, fin, longueur, angle, perles } = useMemo(() => {
    const dx = bDest.cx - a.cx;
    const dz = bDest.cz - a.cz;
    const L = Math.hypot(dx, dz) || 1;
    const ux = dx / L;
    const uz = dz / L;
    const d0 = [a.cx + ux * INSET, a.cz + uz * INSET];
    const d1 = [bDest.cx - ux * INSET, bDest.cz - uz * INSET];
    const util = Math.max(L - INSET * 2, 0.6);
    return {
      deb: d0,
      fin: d1,
      longueur: util,
      angle: Math.atan2(dz, dx),
      perles: pointsArc(d0, d1, z, pic, Math.max(4, Math.round(util / 1.3))),
    };
  }, [a, bDest, z, pic]);

  useFrame((_, dt) => {
    if (!pose || !point.current) return;
    t.current = (t.current + dt * 0.4) % 1;
    const u = t.current;
    point.current.position.set(lerp(deb[0], fin[0], u), z, lerp(deb[1], fin[1], u));
  });

  /* Les deux bouts d'une liaison sont des nœuds : le schéma se lit alors
     comme un réseau posé sur les volumes, et pas seulement comme des cubes
     reliés par un trait. */
  const bouts = (
    <>
      <mesh position={[deb[0], z, deb[1]]}>
        <boxGeometry args={[0.52, 0.52, 0.52]} />
        <meshBasicMaterial color={pal.clair} toneMapped={false} />
      </mesh>
      <mesh position={[fin[0], z, fin[1]]}>
        <boxGeometry args={[0.52, 0.52, 0.52]} />
        <meshBasicMaterial color={pal.clair} toneMapped={false} />
      </mesh>
    </>
  );

  if (!pose) {
    return (
      <group>
        {bouts}
        {perles.map((p, i) => (
          <mesh key={i} position={p}>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshBasicMaterial color={pal.vif} transparent opacity={0.55} toneMapped={false} />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <group>
      {bouts}
      <mesh position={[(deb[0] + fin[0]) / 2, z, (deb[1] + fin[1]) / 2]} rotation={[0, -angle, 0]}>
        <boxGeometry args={[longueur, 0.3, 0.3]} />
        <meshBasicMaterial color={pal.neuf[1]} toneMapped={false} />
        <Edges threshold={15} color={pal.neuf[2]} />
      </mesh>
      <mesh ref={point}>
        <boxGeometry args={[0.62, 0.62, 0.62]} />
        <meshBasicMaterial color={pal.fond} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* L'étiquette : une tige qui part du sommet du bloc et le mot au bout. C'est
   la cote des planches imprimées, en volume. Elle ne s'affiche que pour les
   blocs dont parle l'étape en cours — quinze étiquettes à l'écran ne se
   lisent pas, trois se lisent. */
function Etiquette({ bloc, hauteur, texte, tige = 1.5 }) {
  const pal = usePalette3d();
  const haut = bloc.base + hauteur;
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));
    return g;
  }, []);
  return (
    <group position={[bloc.cx, haut, bloc.cz]}>
      <lineSegments geometry={geo} scale={[1, tige, 1]}>
        <lineBasicMaterial color={pal.action} transparent opacity={0.6} />
      </lineSegments>
      <Html position={[0, tige + 0.42, 0]} center zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
        <span className="expl3d__mot">{texte}</span>
      </Html>
    </group>
  );
}

function Sol({ W, D, pas }) {
  const pal = usePalette3d();
  const geo = useMemo(() => {
    const pts = [];
    const dx = -W / 2, dz = -D / 2;
    for (let i = 0; i <= W + 0.001; i += pas) pts.push(i + dx, 0, dz, i + dx, 0, D + dz);
    for (let j = 0; j <= D + 0.001; j += pas) pts.push(dx, 0, j + dz, W + dx, 0, j + dz);
    pts.push(dx, 0, dz, W + dx, 0, dz, W + dx, 0, dz, W + dx, 0, D + dz,
      W + dx, 0, D + dz, dx, 0, D + dz, dx, 0, D + dz, dx, 0, dz);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [W, D, pas]);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={pal.action} transparent opacity={0.26} />
    </lineSegments>
  );
}

function Plateau({ scene, blocs, etape, onBloc, tourne, lang }) {
  const pal = usePalette3d();
  const groupe = useRef(null);
  const geos = useMemo(() => ({
    plein: cubeColore('plein', pal),
    neuf: cubeColore('neuf', pal),
    socle: cubeColore('socle', pal),
  }), [pal]);

  useFrame((_, dt) => {
    if (tourne && groupe.current) groupe.current.rotation.y += dt * 0.16;
  });

  const vises = etape?.ids || [];
  const mots = etape?.mots || vises;
  const hauteurs = etape?.hauteurs || {};
  /* Une étape qui ne vise personne montre tout à pleine valeur : c'est le
     cas des scènes dont l'étape décrit l'ensemble plutôt qu'une pièce. */
  const eteintPar = vises.length > 0;
  const nes = scene.apparition || [];
  const parId = useMemo(() => Object.fromEntries(blocs.map((x) => [x.id, x])), [blocs]);

  return (
    <group ref={groupe}>
      <Sol {...scene.sol} />

      {blocs.map((bl) => (
        <Bloc
          key={bl.id}
          bloc={bl}
          geo={geos[bl.etat] || geos.plein}
          eteint={eteintPar && !vises.includes(bl.id)}
          hauteur={hauteurs[bl.id] ?? bl.h}
          montre={!nes.includes(bl.id) || vises.includes(bl.id) || mots.includes(bl.id)}
          onClick={onBloc}
        />
      ))}

      {(etape?.liens || []).map((l, i) => {
        const a = parId[l.de];
        const c = parId[l.vers];
        if (!a || !c) return null;
        return (
          <Lien
            key={i}
            a={a}
            bDest={c}
            z={l.z ?? 3}
            pic={l.etat === 'pose' ? 0 : (l.pic ?? 1.8)}
            pose={l.etat === 'pose'}
            seed={i * 0.37}
          />
        );
      })}

      {mots.map((id, i) => {
        const bl = parId[id];
        const texte = bl?.nom?.[lang === 'en' ? 1 : 0];
        if (!bl || !texte) return null;
        /* Les tiges alternent de longueur : à quatre étiquettes sur une même
           rangée, toutes à la même hauteur, les mots se chevauchaient. */
        return (
          <Etiquette
            key={id}
            bloc={bl}
            hauteur={hauteurs[id] ?? bl.h}
            texte={texte}
            tige={1.2 + (i % 3) * 1.15}
          />
        );
      })}
    </group>
  );
}

/* Cadre la caméra sur l'emprise du sol, quelle que soit la taille du
   conteneur. Le zoom d'une caméra three se règle en écrivant dedans ; c'est
   l'interface de la bibliothèque, d'où la dérogation à la règle qui interdit
   de modifier ce que rend un hook. */
function Cadrage({ camRef, sol }) {
  const size = useThree((s) => s.size);
  useEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    const rayon = Math.hypot(sol.W, sol.D) / 2 + 2.2;
    cam.zoom = Math.min(size.width, size.height) / (rayon * 1.92);
    cam.updateProjectionMatrix();
  }, [camRef, size, sol]);
  return null;
}

export default function SceneOffre({ nom, etape, onBloc, reduit, lang }) {
  const scene = SCENES[nom] || SCENES.inventaire;
  const centre = useMemo(() => ({ x: scene.sol.W / 2, y: scene.sol.D / 2 }), [scene]);
  const blocs = useMemo(() => scene.blocs.map((p) => enTrois(p, centre)), [scene, centre]);
  const [attrape, setAttrape] = useState(false);
  const cam = useRef(null);

  return (
    <Canvas
      className="expl3d__canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      onPointerDown={() => setAttrape(true)}
      onPointerUp={() => setAttrape(false)}
      onPointerLeave={() => setAttrape(false)}
    >
      {/* L'angle de départ est celui des planches : 30° d'élévation, 45° de
          rotation. On reconnaît le dessin d'où on vient. */}
      <OrthographicCamera ref={cam} makeDefault position={[18, 14, 18]} near={-200} far={400} />
      <Cadrage camRef={cam} sol={scene.sol} />
      <Plateau
        scene={scene}
        blocs={blocs}
        etape={etape}
        onBloc={onBloc}
        tourne={!attrape && !reduit}
        lang={lang}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minZoom={6}
        maxZoom={110}
        minPolarAngle={0.22}
        maxPolarAngle={Math.PI / 2 - 0.05}
        rotateSpeed={0.85}
        zoomSpeed={0.6}
      />
    </Canvas>
  );
}
