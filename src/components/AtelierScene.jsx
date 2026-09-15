import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { CASE, SOL, caseDe } from '../lib/atelier';

/* ============================================================
   L'ATELIER — le plateau sur lequel on pose son propre système.

   Même langue que les univers des offres : un sol quadrillé, des volumes aux
   trois indigos de la charte. La différence, c'est que les blocs sont à
   l'utilisateur. Il en pose, les nomme, les déplace de case en case, les
   relie, et voit tout de suite ce que ça donne vu d'en haut.

   Les blocs vivent dans des cases (voir src/lib/atelier.js) : un plan qui
   s'aligne tout seul reste lisible, et « cette case est prise » se répond
   sans calcul de collision.
   ============================================================ */

const TEINTES = {
  plein: ['#5B4BE6', '#1C0CB3', '#130982'],
  neuf: ['#A79CF7', '#6B5BEA', '#4B3CC9'],
};

function cubeColore(teinte) {
  const g = new THREE.BoxGeometry(1, 1, 1);
  const [haut, cote, ombre] = TEINTES[teinte];
  const c = [cote, ombre, haut, ombre, cote, ombre].map((h) => new THREE.Color(h));
  const col = new Float32Array(g.attributes.position.count * 3);
  for (let face = 0; face < 6; face++) {
    for (let k = 0; k < 4; k++) {
      const i = face * 4 + k;
      col[i * 3] = c[face].r; col[i * 3 + 1] = c[face].g; col[i * 3 + 2] = c[face].b;
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

function Bloc({ bl, geo, choisi, surLien, onDown, onEnter, onLeave }) {
  const maille = useRef(null);
  const etat = useRef({ h: bl.h });

  const cx = bl.x + bl.w / 2 - SOL.W / 2;
  const cz = bl.y + bl.d / 2 - SOL.D / 2;

  useFrame((_, dt) => {
    const e = etat.current;
    e.h += (bl.h - e.h) * Math.min(dt * 8, 1);
    const m = maille.current;
    if (!m) return;
    const h = Math.max(e.h, 0.05);
    m.scale.set(bl.w, h, bl.d);
    m.position.set(cx, h / 2, cz);
  });

  const commun = {
    ref: maille,
    onPointerDown: (e) => { e.stopPropagation(); onDown(bl.id, e); },
    onPointerOver: (e) => { e.stopPropagation(); onEnter(bl.id); },
    onPointerOut: () => onLeave(bl.id),
  };

  const halo = (choisi || surLien) && (
    <mesh position={[cx, 0.06, cz]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[bl.w + 1.1, bl.d + 1.1]} />
      <meshBasicMaterial color={surLien ? '#A79CF7' : '#1C0CB3'} transparent opacity={0.3} />
    </mesh>
  );

  if (bl.etat === 'creux') {
    return (
      <group>
        {halo}
        <mesh {...commun}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial visible={false} />
          <Edges threshold={1} color="#1C0CB3" />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {halo}
      <mesh {...commun} geometry={geo}>
        <meshBasicMaterial vertexColors toneMapped={false} />
        <Edges threshold={15} color={choisi ? '#F0EEE8' : '#130982'} />
      </mesh>
    </group>
  );
}

function Fil({ a, c }) {
  const pa = [a.x + a.w / 2 - SOL.W / 2, a.h, a.y + a.d / 2 - SOL.D / 2];
  const pc = [c.x + c.w / 2 - SOL.W / 2, c.h, c.y + c.d / 2 - SOL.D / 2];
  const dx = pc[0] - pa[0];
  const dz = pc[2] - pa[2];
  const dy = pc[1] - pa[1];
  const L = Math.hypot(dx, dy, dz) || 1;
  const milieu = [(pa[0] + pc[0]) / 2, (pa[1] + pc[1]) / 2, (pa[2] + pc[2]) / 2];
  const q = useMemo(() => {
    const dir = new THREE.Vector3(dx, dy, dz).normalize();
    return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
  }, [dx, dy, dz]);
  return (
    <mesh position={milieu} quaternion={q}>
      <boxGeometry args={[L, 0.26, 0.26]} />
      <meshBasicMaterial color="#6B5BEA" toneMapped={false} />
    </mesh>
  );
}

function Sol({ onPlan }) {
  const geo = useMemo(() => {
    const pts = [];
    const dx = -SOL.W / 2, dz = -SOL.D / 2;
    for (let i = 0; i <= CASE.cols; i++) pts.push(i * CASE.w + dx, 0, dz, i * CASE.w + dx, 0, SOL.D + dz);
    for (let j = 0; j <= CASE.rows; j++) pts.push(dx, 0, j * CASE.d + dz, SOL.W + dx, 0, j * CASE.d + dz);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <group>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color="#1C0CB3" transparent opacity={0.3} />
      </lineSegments>
      {/* Le plan de saisie : invisible, mais c'est lui qui reçoit les clics
          dans le vide et qui donne la case sous le curseur pendant qu'on
          traîne un bloc. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerDown={(e) => onPlan('appui', e)}
        onPointerUp={(e) => onPlan('relache', e)}
      >
        <planeGeometry args={[SOL.W, SOL.D]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Cadrage({ camRef }) {
  const size = useThree((s) => s.size);
  useEffect(() => {
    const cam = camRef.current;
    if (!cam) return;
    const rayon = Math.hypot(SOL.W, SOL.D) / 2 + 2.6;
    cam.zoom = Math.min(size.width, size.height) / (rayon * 1.9);
    cam.updateProjectionMatrix();
  }, [camRef, size]);
  return null;
}

function Plateau({ blocs, liens, choisi, lienDe, mode, onChoisir, onDeplacer, onPoser, onLier, onTraine }) {
  const geos = useMemo(() => ({ plein: cubeColore('plein'), neuf: cubeColore('neuf') }), []);
  const [survol, setSurvol] = useState(null);
  const [traine, setTraine] = useState(null);
  const bouge = useRef(false);
  const camera = useThree((s) => s.camera);
  const toile = useThree((s) => s.gl.domElement);

  /* Le déplacement ne passe pas par les événements du maillage : pendant
     qu'on traîne, le pointeur survole les autres blocs, sort du plateau,
     revient — et les événements se perdent. On lance donc le rayon nous-même
     sur le plan du sol, à chaque mouvement de la fenêtre. Le geste ne décroche
     plus, même si le doigt sort de la scène. */
  useEffect(() => {
    if (!traine) return undefined;
    const plan = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const rayon = new THREE.Raycaster();
    const ecran = new THREE.Vector2();
    const touche = new THREE.Vector3();

    const bouger = (e) => {
      const r = toile.getBoundingClientRect();
      ecran.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
      rayon.setFromCamera(ecran, camera);
      if (!rayon.ray.intersectPlane(plan, touche)) return;
      const c = caseDe(touche.x, touche.z);
      if (!c) return;
      bouge.current = true;
      onDeplacer(traine, c);
    };
    const finir = () => { setTraine(null); onTraine(false); };

    window.addEventListener('pointermove', bouger);
    window.addEventListener('pointerup', finir);
    window.addEventListener('pointercancel', finir);
    return () => {
      window.removeEventListener('pointermove', bouger);
      window.removeEventListener('pointerup', finir);
      window.removeEventListener('pointercancel', finir);
    };
  }, [traine, camera, toile, onDeplacer, onTraine]);

  const surPlan = (quoi, e) => {
    /* Un clic dans le vide pose un outil : c'est le geste le plus court pour
       commencer, et il n'y a rien à lire avant de l'essayer. */
    if (quoi === 'relache') {
      if (!traine && !bouge.current && mode === 'poser') {
        const c = caseDe(e.point.x, e.point.z);
        if (c) onPoser(c);
      }
      bouge.current = false;
    }
    if (quoi === 'appui') bouge.current = false;
  };

  const surBloc = (id) => {
    if (mode === 'lier') { onLier(id); return; }
    onChoisir(id);
    bouge.current = false;
    setTraine(id);
    onTraine(true);
  };

  const parId = useMemo(() => Object.fromEntries(blocs.map((x) => [x.id, x])), [blocs]);

  return (
    <group>
      <Sol onPlan={surPlan} />

      {liens.map((l, i) => {
        const a = parId[l.de];
        const c = parId[l.vers];
        if (!a || !c) return null;
        return <Fil key={i} a={a} c={c} />;
      })}

      {blocs.map((bl) => (
        <Bloc
          key={bl.id}
          bl={bl}
          geo={geos[bl.etat === 'neuf' ? 'neuf' : 'plein']}
          choisi={choisi === bl.id}
          surLien={lienDe === bl.id || (mode === 'lier' && survol === bl.id)}
          onDown={surBloc}
          onEnter={setSurvol}
          onLeave={() => setSurvol(null)}
        />
      ))}

      {blocs.map((bl) => (
        <Html
          key={`m${bl.id}`}
          position={[bl.x + bl.w / 2 - SOL.W / 2, bl.h + 1.1, bl.y + bl.d / 2 - SOL.D / 2]}
          center
          zIndexRange={[6, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <span className={`atl__mot${choisi === bl.id ? ' is-on' : ''}`}>{bl.nom}</span>
        </Html>
      ))}
    </group>
  );
}

export default function AtelierScene(props) {
  const cam = useRef(null);
  /* Pendant qu'on traîne un bloc, la caméra ne doit pas suivre le doigt :
     on coupe les contrôles par une propriété plutôt qu'en écrivant dans
     l'objet que le hook nous rend. */
  const [traine, setTraine] = useState(false);
  return (
    <Canvas
      className="atl__canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <OrthographicCamera ref={cam} makeDefault position={[18, 15, 18]} near={-200} far={400} />
      <Cadrage camRef={cam} />
      <Plateau {...props} onTraine={setTraine} />
      <OrbitControls
        makeDefault
        enabled={!traine}
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
