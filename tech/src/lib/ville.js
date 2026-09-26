/* ════════════════════════════════════════════════════════════
   LA VILLE — quatre quartiers, une route, et un voyageur.

   Les chantiers ne sont plus alignés comme des diapositives : ils forment une
   ville. On y entre par le premier quartier, on suit la route jusqu'au
   suivant, et un voyageur ouvre le chemin. C'est lui qui dit où l'on se
   trouve, et la caméra ne fait que le suivre — elle se resserre quand il
   s'arrête dans un quartier, elle s'ouvre quand il reprend la route.

   Tout est une fonction de l'avancement au défilement. Rien n'est animé par
   une horloge : le moteur ne dessine que lorsqu'on bouge, et il ne coûte
   rien à l'arrêt.

   La chronologie, en fractions de l'avancement total :
     un arrêt  = 0,17   (le quartier se pose, puis s'annote)
     une route = 0,1067 (le voyageur traverse, le fil se tend)
     4 arrêts + 3 routes = 1
   ════════════════════════════════════════════════════════════ */

export const QUARTIERS = [
  { pos: [0, 0] },
  { pos: [36, 9] },
  { pos: [66, -19] },
  { pos: [100, -6] },
];

export const ARRET = 0.17;
export const ROUTE = 0.1067;

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const doux = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);
const mel = (a, b, t) => a + (b - a) * t;

/* Le début de l'arrêt d'un quartier, dans l'avancement total. */
export const debut = (i) => i * (ARRET + ROUTE);

/* Où l'on en est : dans un quartier, ou sur la route entre deux. */
export function phase(p) {
  const t = clamp01(p);
  for (let i = 0; i < QUARTIERS.length; i++) {
    const d = debut(i);
    if (t < d + ARRET) return { type: 'arret', i, u: clamp01((t - d) / ARRET) };
    if (i < QUARTIERS.length - 1 && t < d + ARRET + ROUTE) {
      return { type: 'route', i, u: clamp01((t - d - ARRET) / ROUTE) };
    }
  }
  return { type: 'arret', i: QUARTIERS.length - 1, u: 1 };
}

/* L'arrivée d'un quartier : il se pose juste avant qu'on y entre, pour qu'on
   le voie se construire en s'approchant, jamais une fois sur place. */
export function avanceQuartier(p, i) {
  const d = debut(i);
  return clamp01((p - (d - 0.07)) / 0.15);
}

/* Les annotations se posent une fois le quartier construit, l'une après
   l'autre, et se replient quand le voyageur repart. */
export function avanceNote(p, i, rang) {
  const d = debut(i);
  const ouvre = d + 0.06 + rang * 0.035;
  const ferme = d + ARRET - 0.015;
  if (p < ouvre) return 0;
  if (p > ferme) return clamp01((ferme + 0.03 - p) / 0.03);
  return clamp01((p - ouvre) / 0.03);
}

/* La route se trace pendant qu'on la parcourt. */
export function avanceRoute(p, i) {
  const d = debut(i) + ARRET;
  return clamp01((p - d) / ROUTE);
}

/* La position du voyageur. Dans un quartier il en fait le tour ; sur la
   route il file d'un quartier à l'autre en passant par un léger sommet. */
export function voyageur(p) {
  const f = phase(p);
  const a = QUARTIERS[f.i].pos;
  if (f.type === 'arret') {
    const ang = -0.9 + f.u * Math.PI * 1.25;
    const r = 13 - doux(f.u) * 2.5;
    return [a[0] + Math.cos(ang) * r, 5.2 + Math.sin(f.u * Math.PI) * 1.4, a[1] + Math.sin(ang) * r];
  }
  const b = QUARTIERS[f.i + 1].pos;
  const u = doux(f.u);
  return [mel(a[0], b[0], u), 5.2 + Math.sin(u * Math.PI) * 5.5, mel(a[1], b[1], u)];
}

/* Ce que la caméra vise, et de combien elle se resserre. 0 = large (sur la
   route), 1 = serré (dans un quartier). */
export function regard(p) {
  const f = phase(p);
  const v = voyageur(p);
  const q = QUARTIERS[f.i].pos;
  if (f.type === 'arret') {
    /* Elle glisse du voyageur vers le cœur du quartier pendant l'arrêt. */
    const t = doux(clamp01(f.u * 1.6));
    return { x: mel(v[0], q[0], t), z: mel(v[2], q[1], t), serre: doux(clamp01(f.u * 2.2)) };
  }
  const b = QUARTIERS[f.i + 1].pos;
  const u = doux(f.u);
  return { x: mel(q[0], b[0], u), z: mel(q[1], b[1], u), serre: 1 - Math.sin(u * Math.PI) * 0.85 };
}
