/* ============================================================
   AXONOMÉTRIE — le même moteur que les livrets imprimés.

   Le livret dessine tout en projection isométrique : un sol quadrillé, des
   volumes posés dessus, trois faces reprenant les trois indigos de la
   charte. C'est la langue graphique de ce qu'on rend au client. Le site
   parlait une autre langue ; il parle maintenant la même.

   Les formules sont celles du générateur PDF, au caractère près, pour que
   l'écran et le papier tombent exactement pareil :
     PR(x, y, z) = ((x - y)·cos30, (x + y)·sin30 - z)
   x et y courent sur le sol, z monte. L'ordre de tracé suit x + y : ce qui
   est devant se pose par-dessus ce qui est derrière.
   ============================================================ */

const C30 = Math.cos(Math.PI / 6);
const S30 = Math.sin(Math.PI / 6);

export function PR(x, y, z = 0) {
  return [(x - y) * C30, (x + y) * S30 - z];
}

const pts = (a) => a.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

/* Un volume plein : face gauche, face droite, dessus. Les trois faces
   suffisent, les autres ne sont jamais visibles sous cet angle. */
export function volume(x, y, w, d, z0, z1) {
  const T = [PR(x, y, z1), PR(x + w, y, z1), PR(x + w, y + d, z1), PR(x, y + d, z1)];
  const B = [PR(x, y, z0), PR(x + w, y, z0), PR(x + w, y + d, z0), PR(x, y + d, z0)];
  return {
    profondeur: x + y,
    faces: [
      { cls: 'axo-l', d: pts([B[3], B[2], T[2], T[3]]) },
      { cls: 'axo-r', d: pts([B[1], B[2], T[2], T[1]]) },
      { cls: 'axo-t', d: pts(T) },
    ],
  };
}

/* Le même volume, mais en fil de fer : dans le livret il sert à montrer ce
   qui est payé et jamais ouvert. Ici, ce qui reste à construire. */
export function fil(x, y, w, d, z0, z1) {
  const T = [PR(x, y, z1), PR(x + w, y, z1), PR(x + w, y + d, z1), PR(x, y + d, z1)];
  const B = [PR(x, y, z0), PR(x + w, y, z0), PR(x + w, y + d, z0), PR(x, y + d, z0)];
  const l = [];
  for (let i = 0; i < 4; i++) l.push([T[i], T[(i + 1) % 4]]);
  l.push([B[1], B[2]], [B[2], B[3]]);
  for (const i of [1, 2, 3]) l.push([B[i], T[i]]);
  return { profondeur: x + y, lignes: l.map(([a, b]) => ({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] })) };
}

/* Le sol : un quadrillage et son cadre. */
export function plan(W, D, pas) {
  const suite = (t) => {
    const s = [];
    for (let k = 0; k * pas <= t; k++) s.push(k * pas);
    if (t % pas > pas * 0.15) s.push(t);
    return s;
  };
  const lignes = [];
  for (const i of suite(W)) { const a = PR(i, 0), b = PR(i, D); lignes.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }); }
  for (const j of suite(D)) { const a = PR(0, j), b = PR(W, j); lignes.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }); }
  return { lignes, cadre: pts([PR(0, 0), PR(W, 0), PR(W, D), PR(0, D)]) };
}

/* Peintre : le plus loin d'abord. */
export function ordonner(volumes) {
  return [...volumes].sort((a, b) => a.profondeur - b.profondeur);
}
