import { pave, projeterPave, PR } from './axo';
import { paves, SOL_TAILLE } from './figures';

/* ════════════════════════════════════════════════════════════
   LA GÉOMÉTRIE DE LA FRISE — quatre emblèmes sur une même ligne.

   Les figures de src/lib/figures.js sont dessinées chacune sur son propre
   sol. Ici on les aligne sur une seule planche : le résultat n'est plus une
   collection de vignettes, c'est une scène, et on peut y tendre un réseau
   d'un bout à l'autre.

   Le décalage se fait EN DIAGONALE, (+d, −d). En axonométrie, avancer sur x
   déplace aussi vers le bas : quatre cases posées sur x donnaient un escalier
   qui plongeait. Sur la diagonale, la composante verticale (x + y) ne bouge
   pas — la frise reste horizontale à l'écran, comme une ligne de temps.

   Tout est projeté à l'angle canonique des livrets. La frise ne tourne pas :
   c'est une planche, et une planche se lit.
   ════════════════════════════════════════════════════════════ */

const CELL = { W: SOL_TAILLE.W, D: SOL_TAILLE.D, pas: SOL_TAILLE.pas };
/* Un demi-écart : le décalage est appliqué deux fois, en + sur x et en − sur y. */
const DEMI = 10.5;
/* Le nœud flotte plus haut que le plus haut volume des huit figures (8,4). */
const HAUT = 11.5;

const pt = (x, y, z = 0) => PR(x, y, z);

function solCase(ox, oy) {
  const lignes = [];
  const bord = (a, b, c, d) => {
    const p = pt(a + ox, b + oy);
    const q = pt(c + ox, d + oy);
    lignes.push({ x1: p[0], y1: p[1], x2: q[0], y2: q[1] });
  };
  for (let i = 0; i <= CELL.W + 0.001; i += CELL.pas) bord(i, 0, i, CELL.D);
  for (let j = 0; j <= CELL.D + 0.001; j += CELL.pas) bord(0, j, CELL.W, j);
  const cadre = [[0, 0], [CELL.W, 0], [CELL.W, CELL.D], [0, CELL.D]]
    .map(([x, y]) => pt(x + ox, y + oy))
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');
  return { lignes, cadre };
}

export function construireFrise(figures) {
  const etapes = figures.map((nom, i) => {
    const ox = i * DEMI;
    const oy = -i * DEMI;
    const volumes = paves(nom)
      .map((p) => pave(p.x + ox, p.y + oy, p.w, p.d, p.z0, p.z1, p.creux))
      .map((p) => projeterPave(p, 0, 0, 0))
      .sort((a, b) => a.prof - b.prof);
    const mx = ox + CELL.W / 2;
    const my = oy + CELL.D / 2;
    return {
      nom,
      volumes,
      sol: solCase(ox, oy),
      noeud: pt(mx, my, HAUT),
      ancre: pt(mx, my, 0),
    };
  });

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const manger = (x, y) => {
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  };
  etapes.forEach((e) => {
    manger(e.noeud[0], e.noeud[1]);
    e.sol.lignes.forEach((l) => { manger(l.x1, l.y1); manger(l.x2, l.y2); });
    e.volumes.forEach((v) => {
      const pts = v.faces
        ? v.faces.flatMap((f) => f.d.split(' ').map((q) => q.split(',').map(Number)))
        : v.lignes.flatMap((l) => [[l.x1, l.y1], [l.x2, l.y2]]);
      pts.forEach(([x, y]) => manger(x, y));
    });
  });
  const m = 1.8;
  const cadre = { x: x0 - m, y: y0 - m, w: x1 - x0 + 2 * m, h: y1 - y0 + 2 * m };

  const cheminLien = etapes
    .map(({ noeud: [x, y] }, i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`)
    .join(' ');

  /* La fenêtre : on ne montre pas la frise entière, on la traverse. Elle est
     cadrée sur une étape à la fois, avec ce qu'il faut de voisinage pour voir
     d'où l'on vient et où l'on va. Le déplacement se fait ensuite en
     translatant la scène, pas en recalculant la géométrie. */
  const LARGE = 46;
  const x0f = etapes[0].noeud[0] - LARGE / 2;
  const fenetre = `${x0f.toFixed(2)} ${cadre.y.toFixed(2)} ${LARGE} ${cadre.h.toFixed(2)}`;
  const arrets = etapes.map((e) => e.noeud[0] - etapes[0].noeud[0]);

  return {
    viewBox: `${cadre.x.toFixed(2)} ${cadre.y.toFixed(2)} ${cadre.w.toFixed(2)} ${cadre.h.toFixed(2)}`,
    fenetre,
    arrets,
    etapes,
    cheminLien,
  };
}
