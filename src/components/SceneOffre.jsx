import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { paves, SOL_TAILLE, CENTRE } from '../lib/figures';

/* ============================================================
   L'UNIVERS D'UNE OFFRE — la planche du livret, montée en volume.

   La géométrie n'est pas redessinée : ce sont exactement les pavés de
   src/lib/figures.js, ceux qui servent déjà à la planche imprimée et au
   dessin de l'accueil. Le papier en montre un angle, ici on les montre
   tous.

   La caméra est ORTHOGRAPHIQUE, comme la projection du livret. Une
   perspective aurait donné plus de profondeur, mais l'axonométrie est la
   langue de la marque : en tournant autour, on reconnaît le dessin qu'on
   vient de quitter. Et les six faces portent les trois indigos de la
   charte, dans le même ordre qu'à plat — le dessus le plus clair, les
   côtés plus sombres. Ce n'est pas un éclairage : ce sont les couleurs.
   ============================================================ */

const INDIGO = '#1C0CB3';
const INDIGO_CLAIR = '#5B4BE6';
const INDIGO_SOMBRE = '#130982';

/* Ordre des faces d'un BoxGeometry : +x, -x, +y, -y, +z, -z.
   +y est le dessus, donc l'indigo clair. */
function materiaux() {
  const c = (h) => new THREE.MeshBasicMaterial({ color: h });
  return [c(INDIGO), c(INDIGO_SOMBRE), c(INDIGO_CLAIR), c(INDIGO_SOMBRE), c(INDIGO), c(INDIGO_SOMBRE)];
}

/* Du monde du livret (x, y au sol, z vers le haut) vers celui de three
   (y vers le haut), recentré sur le milieu du sol. */
function enTrois(p) {
  return {
    pos: [p.x + p.w / 2 - CENTRE.x, (p.z0 + p.z1) / 2, p.y + p.d / 2 - CENTRE.y],
    taille: [p.w, p.z1 - p.z0, p.d],
    creux: p.creux,
    haut: p.z1,
  };
}

/* Un pavé. L'effacement des pièces non choisies est piloté image par image
   en écrivant directement dans les matériaux : passer par un état React à
   chaque image relancerait un rendu complet soixante fois par seconde pour
   une opacité. */
function Pave({ boite, eteint, onClick, mats }) {
  const val = useRef(1);
  const trans = useRef(false);
  const aretes = useRef(null);

  useFrame((_, dt) => {
    const cible = eteint ? 0.13 : 1;
    const v = val.current + (cible - val.current) * Math.min(dt * 7, 1);
    if (Math.abs(v - val.current) < 0.0015 && Math.abs(v - cible) < 0.0015) return;
    val.current = v;

    /* Basculer un matériau en transparent change le programme de rendu :
       sans needsUpdate, three garde le shader opaque et l'opacité n'a
       aucun effet. On ne le lève qu'au changement d'état, parce qu'une
       recompilation à chaque image coûterait la scène entière. */
    const t = v < 0.995;
    const bascule = t !== trans.current;
    trans.current = t;
    mats.forEach((m) => {
      m.opacity = v;
      if (bascule) { m.transparent = t; m.depthWrite = !t; m.needsUpdate = true; }
    });
    const a = aretes.current;
    if (a && a.material) {
      a.material.opacity = boite.creux ? v * 0.55 : v * 0.9;
      if (!a.material.transparent) { a.material.transparent = true; a.material.needsUpdate = true; }
    }
  });

  if (boite.creux) {
    return (
      <mesh position={boite.pos} onClick={onClick}>
        <boxGeometry args={boite.taille} />
        <meshBasicMaterial visible={false} />
        <Edges ref={aretes} threshold={1} color={INDIGO} />
      </mesh>
    );
  }

  return (
    <mesh position={boite.pos} material={mats} onClick={onClick}>
      <boxGeometry args={boite.taille} />
      <Edges ref={aretes} threshold={15} color={INDIGO_SOMBRE} />
    </mesh>
  );
}

/* Le sol : le même quadrillage que sur la planche, à plat. */
function Sol() {
  const geo = useMemo(() => {
    const pts = [];
    const { W, D, pas } = SOL_TAILLE;
    const dx = -CENTRE.x, dz = -CENTRE.y;
    for (let i = 0; i <= W; i += pas) pts.push(i + dx, 0, dz, i + dx, 0, D + dz);
    for (let j = 0; j <= D; j += pas) pts.push(dx, 0, j + dz, W + dx, 0, j + dz);
    pts.push(dx, 0, dz, W + dx, 0, dz, W + dx, 0, dz, W + dx, 0, D + dz,
      W + dx, 0, D + dz, dx, 0, D + dz, dx, 0, D + dz, dx, 0, dz);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={INDIGO} transparent opacity={0.3} />
    </lineSegments>
  );
}

/* Le repère posé au-dessus de la pièce choisie. Il vit dans la scène, donc
   il tourne avec elle : en faisant le tour de l'objet on ne perd jamais de
   vue la pièce dont on est en train de lire l'explication. */
function Repere({ boites, piece }) {
  const cible = useMemo(() => {
    if (!piece) return null;
    const dedans = piece.idx.filter((i) => i >= 0 && i < boites.length);
    if (!dedans.length) return null;
    /* Le plus haut du groupe : un repère posé sur un volume masqué par un
       autre ne désigne rien. */
    let haut = boites[dedans[0]];
    dedans.forEach((i) => { if (boites[i].haut > haut.haut) haut = boites[i]; });
    return [haut.pos[0], haut.pos[1] + haut.taille[1] / 2 + 0.9, haut.pos[2]];
  }, [boites, piece]);

  if (!cible) return null;
  return (
    <Html position={cible} center zIndexRange={[4, 0]} style={{ pointerEvents: 'none' }}>
      <span className="expl3d__pin" />
    </Html>
  );
}

/* Le plateau tourne doucement tant qu'on ne le touche pas. Dès qu'on
   l'attrape, il obéit ; on le relâche, il repart. */
function Plateau({ boites, pieceActive, onPiece, tourne }) {
  const groupe = useRef(null);
  const mats = useMemo(() => boites.map(() => materiaux()), [boites]);

  useFrame((_, dt) => {
    if (tourne && groupe.current) groupe.current.rotation.y += dt * 0.18;
  });

  const eteint = (i) => !!pieceActive && !pieceActive.idx.includes(i);

  return (
    <group ref={groupe}>
      <Sol />
      {boites.map((b, i) => (
        <Pave
          key={i}
          boite={b}
          mats={mats[i]}
          eteint={eteint(i)}
          onClick={(e) => { e.stopPropagation(); onPiece(i); }}
        />
      ))}
      <Repere boites={boites} piece={pieceActive} />
    </group>
  );
}

/* Cadre la caméra sur l'emprise du sol, quelle que soit la taille du
   conteneur : le même objet doit tenir dans le panneau comme en plein
   écran. Le zoom d'une caméra three se règle en écrivant dedans ; c'est
   l'interface de la bibliothèque, pas un contournement, d'où la dérogation
   à la règle qui interdit de modifier ce que rend un hook. */
function Cadrage({ camRef }) {
  const size = useThree((s) => s.size);
  useEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    const rayon = Math.hypot(SOL_TAILLE.W, SOL_TAILLE.D) / 2 + 3;
    cam.zoom = Math.min(size.width, size.height) / (rayon * 2.15);
    cam.updateProjectionMatrix();
  }, [camRef, size]);
  return null;
}

export default function SceneOffre({ nom, pieceActive, onPiece, reduit }) {
  const boites = useMemo(() => paves(nom).map(enTrois), [nom]);
  const [attrape, setAttrape] = useState(false);
  const cam = useRef(null);

  return (
    <Canvas
      className="expl3d__canvas"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      onPointerDown={() => setAttrape(true)}
      onPointerUp={() => setAttrape(false)}
      onPointerLeave={() => setAttrape(false)}
    >
      {/* L'angle de départ est celui de la planche : 30° d'élévation, 45°
          de rotation. On reconnaît le dessin d'où on vient. */}
      <OrthographicCamera ref={cam} makeDefault position={[18, 14, 18]} near={-100} far={200} />
      <Cadrage camRef={cam} />
      <Plateau
        boites={boites}
        pieceActive={pieceActive}
        onPiece={onPiece}
        tourne={!attrape && !reduit}
      />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom
        minZoom={8}
        maxZoom={90}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 2 - 0.06}
        rotateSpeed={0.8}
        zoomSpeed={0.6}
      />
    </Canvas>
  );
}
