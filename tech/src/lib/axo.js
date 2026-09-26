/* ============================================================
   AXONOMÉTRIE — le même moteur que les livrets imprimés, mais qui tourne.

   Le livret dessine tout en projection isométrique : un sol quadrillé, des
   volumes posés dessus, trois faces reprenant les trois indigos de la
   charte. C'est la langue graphique de ce qu'on rend au client.

   Sur le papier, l'angle est figé. À l'écran il n'y a aucune raison qu'il
   le reste : les volumes sont gardés en coordonnées de monde (x, y sur le
   sol, z vers le haut) et projetés à chaque image. Une rotation autour de
   l'axe vertical suffit à faire le tour de l'objet.

     tourner(x, y, θ) fait pivoter le point autour du centre du sol
     PR(x, y, z)      = ((x - y)·cos30, (x + y)·sin30 - z)

   L'ordre de tracé suit x + y APRÈS rotation : ce qui est devant se pose
   par-dessus ce qui est derrière, quel que soit l'angle.
   ============================================================ */

export const C30 = Math.cos(Math.PI / 6);
export const S30 = Math.sin(Math.PI / 6);

export function PR(x, y, z = 0) {
  return [(x - y) * C30, (x + y) * S30 - z];
}

/* Pivote un point du sol autour d'un centre. */
export function tourner(x, y, theta, cx, cy) {
  if (!theta) return [x, y];
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const dx = x - cx;
  const dy = y - cy;
  return [cx + dx * c - dy * s, cy + dx * s + dy * c];
}

/* Un pavé, en coordonnées de monde. On garde les huit sommets plutôt que
   les faces déjà projetées : c'est ce qui permet de le faire tourner. */
export function pave(x, y, w, d, z0, z1, creux = false) {
  return { x, y, w, d, z0, z1, creux };
}

/* Projette un pavé à un angle donné. Renvoie les trois faces visibles, ou
   l'armature si le volume est creux, et la profondeur qui sert au tri. */
export function projeterPave(p, theta, cx, cy) {
  const coins = [[p.x, p.y], [p.x + p.w, p.y], [p.x + p.w, p.y + p.d], [p.x, p.y + p.d]]
    .map(([x, y]) => tourner(x, y, theta, cx, cy));
  const T = coins.map(([x, y]) => PR(x, y, p.z1));
  const B = coins.map(([x, y]) => PR(x, y, p.z0));
  const prof = coins.reduce((a, [x, y]) => a + x + y, 0) / 4;
  const pts = (a) => a.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

  if (p.creux) {
    const l = [];
    for (let i = 0; i < 4; i++) l.push([T[i], T[(i + 1) % 4]], [B[i], B[(i + 1) % 4]], [B[i], T[i]]);
    return { prof, lignes: l.map(([a, b]) => ({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] })) };
  }

  /* Les deux faces latérales visibles dépendent de l'angle : on garde
     celles dont la normale regarde vers l'observateur. En axonométrie,
     ça revient à comparer la profondeur des deux arêtes basses. */
  const cotes = [[0, 1], [1, 2], [2, 3], [3, 0]]
    .map(([a, b]) => ({ a, b, prof: coins[a][0] + coins[a][1] + coins[b][0] + coins[b][1] }))
    .sort((u, v) => v.prof - u.prof)
    .slice(0, 2)
    .sort((u, v) => (B[u.a][0] + B[u.b][0]) - (B[v.a][0] + B[v.b][0]));

  return {
    prof,
    faces: [
      { cls: 'axo-l', d: pts([B[cotes[0].a], B[cotes[0].b], T[cotes[0].b], T[cotes[0].a]]) },
      { cls: 'axo-r', d: pts([B[cotes[1].a], B[cotes[1].b], T[cotes[1].b], T[cotes[1].a]]) },
      { cls: 'axo-t', d: pts(T) },
    ],
  };
}

/* Le sol : un quadrillage et son cadre, tournés eux aussi. */
export function projeterSol(W, D, pas, theta, cx, cy) {
  const suite = (t) => {
    const s = [];
    for (let k = 0; k * pas <= t; k++) s.push(k * pas);
    if (t % pas > pas * 0.15) s.push(t);
    return s;
  };
  const pt = (x, y) => { const [a, b] = tourner(x, y, theta, cx, cy); return PR(a, b, 0); };
  const lignes = [];
  for (const i of suite(W)) { const a = pt(i, 0), b = pt(i, D); lignes.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }); }
  for (const j of suite(D)) { const a = pt(0, j), b = pt(W, j); lignes.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }); }
  const cadre = [[0, 0], [W, 0], [W, D], [0, D]].map(([x, y]) => pt(x, y));
  return { lignes, cadre: cadre.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ') };
}
