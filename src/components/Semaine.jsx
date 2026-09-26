import { useMemo, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { projeterPave, PR } from '../lib/axo';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   VOTRE TEMPS, JOUR PAR JOUR.

   La première question d'un dirigeant n'est pas « quelle méthode », c'est
   « combien de temps ça va me prendre ». Ce schéma y répond sans phrase :
   le calendrier de la mission est posé à plat, une plaque par jour, une
   rangée par semaine, et une colonne monte les jours où l'on a besoin de
   vous. Sa hauteur, c'est le temps qu'on vous demande. La plupart des jours
   restent en fil de fer : c'est nous qui travaillons.

   Les colonnes montent du plan quand le schéma entre à l'écran, une
   semaine après l'autre.
   ════════════════════════════════════════════════════════════ */

const JOURS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.'];
/* Les minutes demandées, jour par jour, sur trois semaines de mission. */
const TEMPS_MISSION = [60, 0, 0, 0, 30, 0, 0, 0, 0, 30, 0, 0, 0, 0, 60];

const L = 2.4;       // largeur d'une plaque, en unités du plan
const P = 2.4;       // profondeur
const ECART = 0.8;   // entre deux jours
const RANG = 1.5;    // entre deux semaines
const HAUT_H = 4.4;  // hauteur d'une heure
const EP = 0.18;     // épaisseur d'une plaque

const libelle = (m) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${String(r).padStart(2, '0')}` : `${h} h`;
};

export default function Semaine({ minutes = TEMPS_MISSION, legende = true }) {
  const racine = useRef(null);
  const colonnes = useRef([]);
  const semaines = Math.ceil(minutes.length / 5);

  const geo = useMemo(() => {
    const W = 5 * L + 4 * ECART;
    const D = semaines * P + (semaines - 1) * RANG;
    const cx = W / 2;
    const cy = D / 2;
    const jours = minutes.map((m, i) => {
      const s = Math.floor(i / 5);
      const x = (i % 5) * (L + ECART);
      const y = s * (P + RANG);
      const h = (m / 60) * HAUT_H;
      const plaque = projeterPave({ x, y, w: L, d: P, z0: 0, z1: EP, creux: m === 0 }, 0, cx, cy);
      return { i, s, x, y, m, h, plaque };
    });
    const yFin = (semaines - 1) * (P + RANG);
    const etiquettes = JOURS.map((j, k) => {
      const [x, y] = PR(k * (L + ECART) + L * 0.55, yFin + P + 0.9, 0);
      return { j, x, y: y + 1.1 };
    });
    const rangs = Array.from({ length: semaines }, (_, s) => {
      const [x, y] = PR(-0.9, s * (P + RANG) + P * 0.5, 0);
      return { s, x, y: y + 0.45 };
    });
    return { W, D, cx, cy, jours, etiquettes, rangs };
  }, [minutes, semaines]);

  /* Une colonne projetée à une hauteur donnée : la même fonction que pour
     les blocs des scènes, appelée à chaque image de la montée. */
  const dessiner = (k, t) => {
    const j = geo.jours[k];
    const g = colonnes.current[k];
    if (!g || j.m === 0) return;
    const v = projeterPave({ x: j.x + 0.3, y: j.y + 0.3, w: L - 0.6, d: P - 0.6, z0: EP, z1: EP + Math.max(j.h * t, 0.001) }, 0, geo.cx, geo.cy);
    const polys = g.querySelectorAll('polygon');
    v.faces.forEach((f, n) => { if (polys[n]) polys[n].setAttribute('points', f.d); });
    const val = g.querySelector('text');
    if (val) {
      /* L'étiquette se pose à droite du sommet de la colonne : c'est le côté
         que rien ne recouvre, quelle que soit la semaine. */
      const [tx, ty] = PR(j.x + L - 0.3, j.y + 0.3, EP + j.h * t);
      val.setAttribute('x', (tx + 0.45).toFixed(2));
      val.setAttribute('y', (ty + 0.35).toFixed(2));
      val.style.opacity = t > 0.85 ? '1' : '0';
    }
  };

  useGSAP(() => {
    const tout = (t) => geo.jours.forEach((_, k) => dessiner(k, t));
    if (instant()) { tout(1); return undefined; }
    tout(0);
    const etats = geo.jours.map(() => ({ t: 0 }));
    const tl = gsap.timeline({ paused: true });
    geo.jours.forEach((j, k) => {
      if (j.m === 0) return;
      tl.to(etats[k], {
        t: 1, duration: 1, ease: 'power3.out',
        onUpdate: () => dessiner(k, etats[k].t),
      }, j.s * 0.28 + (j.i % 5) * 0.05);
    });
    const st = gsap.timeline({
      scrollTrigger: { trigger: racine.current, start: 'top 78%', once: true, onEnter: () => tl.play() },
    });
    return () => { tl.kill(); st.kill(); };
  }, { scope: racine, dependencies: [geo] });

  /* Le cadre englobe le plan, les colonnes les plus hautes et les libellés :
     on le calcule sur la géométrie finale. */
  const vb = useMemo(() => {
    const pts = [];
    geo.jours.forEach((j) => {
      (j.plaque.faces || []).forEach((f) => f.d.split(' ').forEach((p) => pts.push(p.split(',').map(Number))));
      (j.plaque.lignes || []).forEach((l) => { pts.push([l.x1, l.y1]); pts.push([l.x2, l.y2]); });
      const [tx, ty] = PR(j.x, j.y, j.h + 1.2);
      pts.push([tx, ty]);
      if (j.m) {
        const [rx, ry] = PR(j.x + L, j.y, j.h);
        pts.push([rx + 4.2, ry]);
      }
    });
    geo.etiquettes.forEach((e) => pts.push([e.x - 1.6, e.y + 0.6], [e.x + 1.6, e.y]));
    geo.rangs.forEach((r) => pts.push([r.x - 9, r.y]));
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs) - 1;
    const y0 = Math.min(...ys) - 1;
    return `${x0.toFixed(1)} ${y0.toFixed(1)} ${(Math.max(...xs) - x0 + 2).toFixed(1)} ${(Math.max(...ys) - y0 + 1.5).toFixed(1)}`;
  }, [geo]);

  const parSemaine = Array.from({ length: semaines }, (_, s) => minutes.slice(s * 5, s * 5 + 5).reduce((a, b) => a + b, 0));
  const maxi = Math.max(...parSemaine);
  const recit = parSemaine.map((m, s) => `semaine ${s + 1} : ${m ? libelle(m) : 'rien'}`).join(', ');

  /* Les colonnes se tracent de l'arrière vers l'avant : ce qui est devant
     recouvre ce qui est derrière. */
  const ordre = geo.jours.map((j, k) => ({ j, k })).filter(({ j }) => j.m > 0)
    .sort((a, b) => (a.j.x + a.j.y) - (b.j.x + b.j.y));

  return (
    <figure className="sem" ref={racine} data-soi>
      <svg className="sem__svg" viewBox={vb} role="img" aria-label={`Votre temps pendant la mission, ${recit}.`}>
        {geo.jours.map((j) => (
          <g key={`p${j.i}`} className={`sem__plaque${j.m === 0 ? ' is-libre' : ''}`}>
            {j.plaque.faces && j.plaque.faces.map((f, n) => <polygon key={n} className={f.cls} points={f.d} />)}
            {j.plaque.lignes && j.plaque.lignes.map((l, n) => <line key={n} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />)}
          </g>
        ))}
        {geo.etiquettes.map((e) => (
          <text key={e.j} className="sem__jour" x={e.x} y={e.y} textAnchor="middle">{e.j}</text>
        ))}
        {ordre.map(({ j, k }) => (
          <g key={`c${j.i}`} className="sem__col" ref={(el) => { colonnes.current[k] = el; }}>
            <polygon className="axo-l" />
            <polygon className="axo-r" />
            <polygon className="axo-t" />
            <text className="sem__valeur">{libelle(j.m)}</text>
          </g>
        ))}
        {/* Les semaines se nomment par-dessus les colonnes : une colonne
            haute ne doit jamais cacher la ligne qu'elle occupe. */}
        {geo.rangs.map((r) => (
          <text key={`r${r.s}`} className="sem__semaine" x={r.x} y={r.y} textAnchor="end">Semaine {r.s + 1}</text>
        ))}
      </svg>
      {legende && (
        <figcaption className="sem__legende">
          <strong>{libelle(maxi)} par semaine, au plus.</strong> Les autres jours, c’est nous qui travaillons.
        </figcaption>
      )}
    </figure>
  );
}
