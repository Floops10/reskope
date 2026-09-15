import { volume, fil, plan, ordonner } from './axo';

/* ============================================================
   LES FIGURES — huit petites scènes en axonométrie, au vocabulaire
   du livret : des volumes posés sur un sol quadrillé.

   Elles ne sont pas des pictogrammes. Une icône essaie de ressembler à la
   chose ; ici le volume EST la chose, à l'échelle où on la manipule : un
   parc d'outils est un champ de blocs de hauteurs inégales, une liaison est
   une passerelle entre deux blocs, un chantier est un empilement dont la
   dernière couche n'est pas encore pleine.

   Toutes partagent le même sol et la même échelle : posées côte à côte,
   leurs quadrillages se prolongent et la rangée se lit comme une planche
   unique, pas comme quatre vignettes.
   ============================================================ */

const SOL = { W: 16, D: 12, pas: 4 };

/* Assez de marge pour le plus haut des volumes et pour le débord gauche
   du sol. Fixe et commun aux huit figures : c'est ce qui aligne la rangée. */
export const CADRE = { x: -11.6, y: -9, w: 26.6, h: 24 };
export const VIEWBOX = `${CADRE.x} ${CADRE.y} ${CADRE.w} ${CADRE.h}`;

const bloc = (x, y, w, d, h, z0 = 0) => volume(x, y, w, d, z0, z0 + h);

/* Un parc d'outils : beaucoup de blocs, aucun à la même hauteur, et deux
   qui ne sont que du fil de fer — payés, jamais ouverts. */
function inventaire() {
  const H = [3.4, 5.2, 2.1, 4.3, 6.0, 2.8, 3.9, 1.6, 4.8];
  const v = [];
  let k = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const h = H[k++];
      if (k === 4 || k === 8) v.push({ ...fil(i * 5 + 0.7, j * 4 + 0.7, 3.4, 2.6, 0, h), creux: true });
      else v.push(bloc(i * 5 + 0.7, j * 4 + 0.7, 3.4, 2.6, h));
    }
  }
  return v;
}

/* Deux blocs, et la passerelle qui les relie. Ils sont alignés sur le même
   y pour que la passerelle coure le long d'un seul axe : posés en diagonale,
   elle se perdait derrière le bloc de devant. */
function liaison() {
  return [
    bloc(0.6, 3.4, 3.6, 4.4, 5.4),
    bloc(4.2, 5.1, 6.8, 1.1, 0.8, 3.4),
    bloc(11, 3.4, 3.6, 4.4, 5.4),
  ];
}

/* Un empilement en cours : trois couches pleines, la quatrième encore
   en fil de fer, posée juste au-dessus. */
function chantier() {
  return [
    bloc(1.4, 1.4, 11, 8, 2.2),
    bloc(2.8, 2.6, 8.4, 5.8, 2.2, 2.2),
    bloc(4.2, 3.8, 5.6, 3.6, 2.2, 4.4),
    { ...fil(5.4, 4.8, 3.4, 2, 7.4, 9.6), creux: true },
  ];
}

/* Une estrade et ce qui se tient dessus : ce qu'on laisse derrière soi.
   Les trois blocs sont posés en diagonale et de hauteurs franchement
   différentes, sinon ils se recouvrent et ne forment qu'une masse. */
function estrade() {
  return [
    bloc(0.8, 0.8, 13.6, 9.8, 1.2),
    bloc(1.9, 1.9, 2.4, 2.2, 5.8, 1.2),
    bloc(6.2, 4.1, 2.4, 2.2, 3.1, 1.2),
    bloc(10.4, 6.3, 2.4, 2.2, 4.6, 1.2),
  ];
}

/* Une rangée de créneaux, et un seul de pris. Les dalles avancent le long
   d'un seul axe : en diagonale, elles se seraient lues comme un escalier. */
function creneaux() {
  const v = [];
  for (let i = 0; i < 5; i++) v.push(bloc(0.8 + i * 3, 4.2, 2.4, 4.6, 1.1));
  v.push(bloc(6.9, 4.8, 2.4, 3.4, 5.6, 1.1));
  return v;
}

/* Un bloc plein tenu dans un cadre : le repère qu'on pose autour. */
function cadre() {
  return [
    { ...fil(0.8, 0.8, 13.6, 9.8, 0, 8.4), creux: true },
    bloc(4.6, 3.4, 6, 4.4, 5),
  ];
}

/* Une rampe : chaque marche plus haute que la précédente. Elle progresse
   sur x seulement, sinon les marches se superposent au lieu de s'éloigner. */
function rampe() {
  return [0, 1, 2, 3].map((i) => bloc(0.9 + i * 3.4, 4.4, 2.8, 3.4, 1.9 + i * 1.9));
}

/* Une façade et son socle : ce qui se voit du dehors. Le panneau est posé
   au fond du socle et les deux volumes devant lui, sinon il les recouvre :
   sous cet angle, ce qui a le plus grand x + y passe toujours devant. */
function vitrine() {
  return [
    bloc(0.8, 0.8, 13.6, 9.8, 1),
    bloc(1.4, 1.4, 11.8, 0.9, 7.6, 1),
    bloc(2.6, 5.2, 2.6, 2.6, 2.4, 1),
    bloc(7.6, 6.4, 2.6, 2.6, 3.8, 1),
  ];
}

const FIGURES = { inventaire, liaison, chantier, estrade, creneaux, cadre, rampe, vitrine };

/* Rend une figure prête à poser dans un <svg> : le sol, puis les volumes
   du plus lointain au plus proche. */
export function figure(nom) {
  const f = FIGURES[nom] || FIGURES.inventaire;
  return { sol: plan(SOL.W, SOL.D, SOL.pas), volumes: ordonner(f()) };
}
