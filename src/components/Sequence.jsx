import { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree, invalidate } from '@react-three/fiber';
import { OrthographicCamera, Edges, Html } from '@react-three/drei';
import * as THREE from 'three';
import { SCENES } from '../lib/scenes';
import { cubeColore, ARETE, graine } from '../lib/troisd';
import {
  QUARTIERS, phase, avanceQuartier, avanceNote, avanceRoute, voyageur, regard,
  clamp01, doux,
} from '../lib/ville';

/* ============================================================
   LA VILLE — les quatre chantiers, traversés au défilement.

   Ce ne sont plus quatre vignettes : c'est une ville. Chaque chantier est un
   quartier posé à sa place, relié au suivant par une route, et un voyageur
   ouvre le chemin. Il dit où l'on se trouve mieux qu'une légende ne le
   ferait. La caméra ne fait que le suivre : elle se resserre quand il
   s'arrête dans un quartier, elle s'ouvre quand il reprend la route.

   Les quartiers sont les MÊMES scènes que celles de l'explorateur — quinze
   outils nommés pour l'audit, la ressaisie à la main pour la mise en ordre.
   Ils se construisent à l'approche, bloc par bloc, venus du lointain, puis
   s'annotent : une amorce monte d'une pièce et le mot se pose au bout.

   Tout est une fonction de l'avancement au défilement, rien n'est animé par
   une horloge. Le moteur est en mode « à la demande » : il ne dessine que
   lorsqu'on bouge, et il ne coûte rien à l'arrêt. C'est ce qui permet une
   scène de cette densité sans peser sur la page.
   ============================================================ */

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

function annotationsDe(scene, lang, max = 2) {
  const parId = Object.fromEntries(scene.blocs.map((b) => [b.id, b]));
  const out = [];
  for (const e of scene.etapes) {
    const id = (e.mots && e.mots[0]) || (e.ids && e.ids[0]);
    if (id && parId[id]) out.push({ id, texte: (e[lang] || e.fr).nom });
    if (out.length === max) break;
  }
  return out;
}

/* Un bloc : il vient du lointain pendant qu'on approche du quartier. */
function Bloc({ bl, quartier, geos, avance }) {
  const maille = useRef(null);
  const depart = useMemo(() => {
    const a = graine(bl.i + quartier * 31, 3) * Math.PI * 2;
    const d = 22 + graine(bl.i, 5) * 26;
    return [
      bl.pos[0] + Math.cos(a) * d,
      bl.pos[1] + 12 + graine(bl.i, 7) * 20,
      bl.pos[2] + Math.sin(a) * d,
    ];
  }, [bl, quartier]);

  useFrame(() => {
    const m = maille.current;
    if (!m) return;
    const t = clamp01((avance.current - graine(bl.i, 11) * 0.45) / 0.55);
    const e = doux(t);
    m.position.set(
      depart[0] + (bl.pos[0] - depart[0]) * e,
      depart[1] + (bl.pos[1] - depart[1]) * e,
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

function Sol({ scene, avance }) {
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
    if (ligne.current) ligne.current.material.opacity = 0.32 * clamp01(avance.current * 2.2);
  });
  return (
    <lineSegments ref={ligne} geometry={geo}>
      <lineBasicMaterial color="#1C0CB3" transparent opacity={0} />
    </lineSegments>
  );
}

function Note({ bl, texte, avance, rang }) {
  const groupe = useRef(null);
  const tige = useRef(null);
  const mot = useRef(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3));
    return g;
  }, []);
  const hauteur = 2.4 + rang * 2.4;
  /* Un décalage latéral d'un rang à l'autre : à la même abscisse, deux
     pastilles se mordaient quand les pièces annotées étaient voisines. */
  const cote = rang % 2 === 0 ? -1 : 1;

  /* L'étiquette est toujours montée, et c'est sa feuille de style qu'on écrit
     image par image. Piloter son apparition par un état React la faisait
     disparaître au hasard : en mode « à la demande », un rendu React ne
     s'accompagne d'aucune image, et l'état pouvait se poser sans que rien ne
     vienne le confirmer. */
  useFrame(() => {
    const a = avance.current;
    const g = groupe.current;
    if (!g) return;
    g.position.set(bl.pos[0], bl.haut, bl.pos[2]);
    g.visible = a > 0.01;
    if (tige.current) {
      tige.current.scale.set(1, hauteur * doux(a), 1);
      tige.current.material.opacity = 0.6 * a;
    }
    if (mot.current) {
      const e = doux(clamp01((a - 0.35) / 0.65));
      mot.current.style.opacity = e.toFixed(3);
      mot.current.style.transform = `translateY(${((1 - e) * 10).toFixed(2)}px) scale(${(0.9 + e * 0.1).toFixed(3)})`;
    }
  });

  return (
    <group ref={groupe}>
      <lineSegments ref={tige} geometry={geo}>
        <lineBasicMaterial color="#1C0CB3" transparent opacity={0} />
      </lineSegments>
      <Html position={[cote * 1.6, hauteur + 0.55, 0]} center zIndexRange={[6, 0]} style={{ pointerEvents: 'none' }}>
        <span className="seq__note" ref={mot}>{texte}</span>
      </Html>
    </group>
  );
}

/* La route : une bande posée au sol qui se trace à mesure qu'on la parcourt. */
function Route({ de, vers, avance }) {
  const maille = useRef(null);
  const { milieu, longueur, angle } = useMemo(() => {
    const dx = vers[0] - de[0];
    const dz = vers[1] - de[1];
    return {
      milieu: [(de[0] + vers[0]) / 2, 0.06, (de[1] + vers[1]) / 2],
      longueur: Math.hypot(dx, dz),
      angle: Math.atan2(dz, dx),
    };
  }, [de, vers]);

  useFrame(() => {
    const m = maille.current;
    if (!m) return;
    const t = clamp01(avance.current);
    m.scale.set(Math.max(longueur * t, 0.001), 1, 1);
    m.position.set(de[0] + ((vers[0] - de[0]) * t) / 2, 0.06, de[1] + ((vers[1] - de[1]) * t) / 2);
    m.visible = t > 0.005;
  });

  return (
    <mesh ref={maille} rotation={[0, -angle, 0]} position={milieu}>
      <boxGeometry args={[1, 0.12, 1.5]} />
      <meshBasicMaterial color="#6B5BEA" transparent opacity={0.55} toneMapped={false} />
    </mesh>
  );
}

/* Le voyageur : c'est lui qui dit où l'on se trouve. */
function Voyageur({ avance }) {
  const cube = useRef(null);
  const ombre = useRef(null);
  useFrame(() => {
    const p = voyageur(avance.current);
    if (cube.current) {
      cube.current.position.set(p[0], p[1], p[2]);
      cube.current.rotation.y = avance.current * 24;
      cube.current.rotation.x = avance.current * 15;
    }
    if (ombre.current) ombre.current.position.set(p[0], 0.08, p[2]);
  });
  return (
    <group>
      <mesh ref={cube}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshBasicMaterial color="#F0EEE8" toneMapped={false} />
        <Edges threshold={15} color="#1C0CB3" />
      </mesh>
      {/* Le repère au sol : on sait toujours à l'aplomb de quoi il passe. */}
      <mesh ref={ombre} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.9, 24]} />
        <meshBasicMaterial color="#1C0CB3" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function Quartier({ nom, index, geos, lang, avance, notes }) {
  const scene = SCENES[nom];
  const c = useMemo(() => centreDe(scene), [scene]);
  const blocs = useMemo(() => scene.blocs.map((p, i) => enTrois(p, c, i)), [scene, c]);
  const notesPosees = useMemo(() => {
    const parId = Object.fromEntries(blocs.map((b) => [b.id, b]));
    return annotationsDe(scene, lang)
      .map((a) => ({ ...a, bl: parId[a.id] }))
      .filter((a) => a.bl);
  }, [scene, blocs, lang]);

  return (
    <group position={[QUARTIERS[index].pos[0], 0, QUARTIERS[index].pos[1]]}>
      <Sol scene={scene} avance={avance} />
      {blocs.map((bl) => (
        <Bloc key={bl.i} bl={bl} quartier={index} geos={geos} avance={avance} />
      ))}
      {notesPosees.map((a, r) => (
        <Note key={a.id} bl={a.bl} texte={a.texte} avance={notes[r]} rang={r} />
      ))}
    </group>
  );
}

function Camera({ camRef, avance }) {
  const size = useThree((s) => s.size);
  useFrame(() => {
    const cam = camRef.current;
    if (!cam) return;
    /* La caméra se pose EXACTEMENT là où le défilement la demande, sans
       lissage : le moteur ne dessine qu'une image par mouvement, un retard
       calculé image par image ne rattraperait jamais sa cible. Le moelleux
       vient du scrub du défilement, en amont. */
    const r = regard(avance.current);
    const rayon = 27 - r.serre * 11;
    cam.position.set(r.x + 22, 17, r.z + 22);
    cam.lookAt(r.x, 3.2, r.z);
    cam.zoom = Math.min(size.width / (rayon * 2.2), size.height / (rayon * 1.5));
    cam.updateProjectionMatrix();
  });
  return null;
}

function Scene({ figures, lang, avance, onQuartier }) {
  const cam = useRef(null);
  const geos = useMemo(() => ({
    plein: cubeColore('plein'),
    neuf: cubeColore('neuf'),
    socle: cubeColore('socle'),
  }), []);

  /* Un porteur par valeur animée. Ils sont créés une fois et seulement
     écrits dans la boucle : aucun rendu React pendant le défilement. */
  const porteurs = useMemo(() => ({
    quartiers: figures.map(() => ({ current: 0 })),
    notes: figures.map(() => [{ current: 0 }, { current: 0 }]),
    routes: figures.slice(1).map(() => ({ current: 0 })),
  }), [figures]);

  /* Un rendu React ne redessine rien en mode « à la demande » : après un
     changement de quartier, on redemande une image pour que la scène reparte
     des valeurs qu'on vient d'écrire. */
  useEffect(() => { invalidate(); }, [porteurs]);

  useFrame(() => {
    const p = avance.current;
    figures.forEach((_, i) => {
      porteurs.quartiers[i].current = avanceQuartier(p, i);
      porteurs.notes[i][0].current = avanceNote(p, i, 0);
      porteurs.notes[i][1].current = avanceNote(p, i, 1);
      if (i < figures.length - 1) porteurs.routes[i].current = avanceRoute(p, i);
    });
    onQuartier(phase(p).i);
  });

  return (
    <>
      <OrthographicCamera ref={cam} makeDefault position={[22, 17, 22]} near={-500} far={900} />
      <Camera camRef={cam} avance={avance} />
      {figures.map((nom, i) => (
        <Quartier
          key={nom}
          nom={nom}
          index={i}
          geos={geos}
          lang={lang}
          avance={porteurs.quartiers[i]}
          notes={porteurs.notes[i]}
        />
      ))}
      {figures.slice(1).map((nom, i) => (
        <Route key={nom} de={QUARTIERS[i].pos} vers={QUARTIERS[i + 1].pos} avance={porteurs.routes[i]} />
      ))}
      <Voyageur avance={avance} />
    </>
  );
}

export default function Sequence({ figures, lang, avance, onQuartier }) {
  return (
    <Canvas
      className="seq__canvas"
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      /* À la demande : une image dessinée par mouvement de défilement, zéro
         à l'arrêt. Un moteur 3D ne doit pas tourner pour rien. */
      frameloop="demand"
    >
      <Scene figures={figures} lang={lang} avance={avance} onQuartier={onQuartier} />
    </Canvas>
  );
}
