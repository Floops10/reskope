import { pave, projeterPave, projeterSol, PR, tourner } from './axo';

/* ============================================================
   LES FIGURES — huit petites scènes en axonométrie, au vocabulaire
   du livret : des volumes posés sur un sol quadrillé.

   Elles ne sont pas des pictogrammes. Une icône essaie de ressembler à la
   chose ; ici le volume EST la chose, à l'échelle où on la manipule : un
   parc d'outils est un champ de blocs de hauteurs inégales, une liaison est
   une passerelle entre deux blocs, un chantier est un empilement dont la
   dernière couche n'est pas encore pleine.

   Tout est gardé en coordonnées de monde. Le composant projette à l'angle
   qu'il veut, ce qui permet de faire tourner la scène sous le curseur.
   ============================================================ */

const SOL = { W: 16, D: 12, pas: 4 };
export const CENTRE = { x: SOL.W / 2, y: SOL.D / 2 };

/* Le cadre doit contenir la figure SOUS TOUS LES ANGLES. Le calculer à la
   main était faux : un bloc posé au coin du sol déborde du cercle
   circonscrit, et les hauteurs varient d'une figure à l'autre. On le
   mesure donc sur la géométrie réelle, en échantillonnant un tour complet.
   Quelques milliers de projections au chargement du module, une fois. */
function etendue(listeDePaves, cx, cy, pas = 12) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let d = 0; d < 360; d += pas) {
    const th = (d * Math.PI) / 180;
    for (const p of listeDePaves) {
      const v = projeterPave(p, th, cx, cy);
      const pts = v.faces
        ? v.faces.flatMap((f) => f.d.split(' ').map((q) => q.split(',').map(Number)))
        : v.lignes.flatMap((l) => [[l.x1, l.y1], [l.x2, l.y2]]);
      for (const [x, y] of pts) {
        if (x < x0) x0 = x; if (x > x1) x1 = x;
        if (y < y0) y0 = y; if (y > y1) y1 = y;
      }
    }
  }
  return { x0, y0, x1, y1 };
}

const bloc = (x, y, w, d, h, z0 = 0) => pave(x, y, w, d, z0, z0 + h, false);
const creux = (x, y, w, d, h, z0 = 0) => pave(x, y, w, d, z0, z0 + h, true);

/* Un parc d'outils : beaucoup de blocs, aucun à la même hauteur, et deux
   qui ne sont que du fil de fer — payés, jamais ouverts. */
function inventaire() {
  const H = [3.4, 5.2, 2.1, 4.3, 6.0, 2.8, 3.9, 1.6, 4.8];
  const v = [];
  let k = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const h = H[k++];
      const f = (k === 4 || k === 8) ? creux : bloc;
      v.push(f(i * 5 + 0.7, j * 4 + 0.7, 3.4, 2.6, h));
    }
  }
  return v;
}

/* Deux blocs, et la passerelle qui les relie. */
function liaison() {
  return [
    bloc(0.6, 3.4, 3.6, 4.4, 5.4),
    bloc(4.2, 5.1, 6.8, 1.1, 0.8, 3.4),
    bloc(11, 3.4, 3.6, 4.4, 5.4),
  ];
}

/* Un empilement en cours : trois couches pleines, la quatrième encore en
   fil de fer, posée juste au-dessus. */
function chantier() {
  return [
    bloc(1.4, 1.4, 11, 8, 2.2),
    bloc(2.8, 2.6, 8.4, 5.8, 2.2, 2.2),
    bloc(4.2, 3.8, 5.6, 3.6, 2.2, 4.4),
    creux(5.4, 4.8, 3.4, 2, 2.2, 7.4),
  ];
}

/* Une estrade et ce qui se tient dessus : ce qu'on laisse derrière soi. */
function estrade() {
  return [
    bloc(0.8, 0.8, 13.6, 9.8, 1.2),
    bloc(1.9, 1.9, 2.4, 2.2, 5.8, 1.2),
    bloc(6.2, 4.1, 2.4, 2.2, 3.1, 1.2),
    bloc(10.4, 6.3, 2.4, 2.2, 4.6, 1.2),
  ];
}

/* Une rangée de créneaux, et un seul de pris. */
function creneaux() {
  const v = [];
  for (let i = 0; i < 5; i++) v.push(bloc(0.8 + i * 3, 4.2, 2.4, 4.6, 1.1));
  v.push(bloc(6.9, 4.8, 2.4, 3.4, 5.6, 1.1));
  return v;
}

/* Un bloc plein tenu dans un cadre : le repère qu'on pose autour. */
function cadre() {
  return [creux(0.8, 0.8, 13.6, 9.8, 8.4), bloc(4.6, 3.4, 6, 4.4, 5)];
}

/* Une rampe : chaque marche plus haute que la précédente. */
function rampe() {
  return [0, 1, 2, 3].map((i) => bloc(0.9 + i * 3.4, 4.4, 2.8, 3.4, 1.9 + i * 1.9));
}

/* Une façade et son socle : ce qui se voit du dehors. */
function vitrine() {
  return [
    bloc(0.8, 0.8, 13.6, 9.8, 1),
    bloc(1.4, 1.4, 11.8, 0.9, 7.6, 1),
    bloc(2.6, 5.2, 2.6, 2.6, 2.4, 1),
    bloc(7.6, 6.4, 2.6, 2.6, 3.8, 1),
  ];
}

/* Un palier de taille : n blocs sur le sol. Plus l'entreprise est grande,
   plus le sol se peuple. C'est la même idée que la frise du livret, dite
   avec les volumes plutôt qu'avec des plantes. */
function palier(n) {
  const H = [4.6, 2.4, 6.1, 3.2, 5.3, 2.0, 4.1, 3.7, 5.8, 2.8, 4.9, 3.4];
  const v = [];
  for (let k = 0; k < n; k++) {
    const i = k % 4, j = Math.floor(k / 4);
    v.push(bloc(i * 3.8 + 0.8, j * 3.8 + 0.8, 2.8, 2.6, H[k % H.length]));
  }
  return v;
}

const FIGURES = {
  inventaire, liaison, chantier, estrade, creneaux, cadre, rampe, vitrine,
  palier1: () => palier(2),
  palier2: () => palier(6),
  palier3: () => palier(11),
};

/* Le cadre commun aux huit figures : l'union de leurs étendues sur un tour
   complet, plus une marge. Commun, pour que les huit soient à la même
   échelle et que leurs sols s'alignent d'une colonne à l'autre. */
export const CADRE = (() => {
  const solFictif = [pave(0, 0, SOL.W, SOL.D, 0, 0, true)];
  let e = etendue(solFictif, CENTRE.x, CENTRE.y);
  for (const f of Object.values(FIGURES)) {
    const u = etendue(f(), CENTRE.x, CENTRE.y);
    e = { x0: Math.min(e.x0, u.x0), y0: Math.min(e.y0, u.y0), x1: Math.max(e.x1, u.x1), y1: Math.max(e.y1, u.y1) };
  }
  const m = 1.1;
  return { x: e.x0 - m, y: e.y0 - m, w: e.x1 - e.x0 + 2 * m, h: e.y1 - e.y0 + 2 * m };
})();
export const VIEWBOX =
  `${CADRE.x.toFixed(2)} ${CADRE.y.toFixed(2)} ${CADRE.w.toFixed(2)} ${CADRE.h.toFixed(2)}`;
const [CX] = PR(CENTRE.x, CENTRE.y, 0);

/* ── LES REPÈRES ────────────────────────────────────────────────────
   Au survol, le dessin s'explique. Chaque repère est un point du monde
   et un mot ; l'amorce et le texte se recalculent à chaque angle, donc
   l'étiquette suit la pièce pendant que la scène tourne. */
const REPERES = {
  palier1: [[2.2, 2.1, 4.6, 'un outil']],
  palier2: [[2.2, 2.1, 4.6, 'un outil'], [12.2, 2.1, 3.2, 'et ça s’ajoute']],
  palier3: [[2.2, 2.1, 4.6, 'un outil'], [5.9, 5.9, 5.3, 'et ça s’empile']],
  inventaire: [[12.4, 10, 4.8, 'un outil'], [7.4, 2, 4.3, 'jamais ouvert']],
  liaison: [[2.4, 5.6, 5.4, 'un outil'], [7.6, 5.6, 4.2, 'la liaison']],
  chantier: [[6.9, 5.6, 6.6, 'ce qui existe'], [7.1, 5.8, 9.6, 'ce qu’on ajoute']],
  estrade: [[7.6, 5.7, 1.2, 'l’outil'], [11.6, 7.4, 5.8, 'vos équipes']],
  creneaux: [[2, 6.5, 1.1, 'créneaux'], [8.1, 6.5, 6.7, 'un rendez-vous']],
  cadre: [[7.6, 5.6, 5, 'votre marque'], [14.4, 10.6, 8.4, 'les règles']],
  rampe: [[2.3, 6.1, 1.9, 'le modèle'], [11.4, 6.1, 7.6, 'l’ouverture']],
  vitrine: [[7.3, 1.85, 8.6, 'votre site'], [5.9, 7.8, 3.4, 'la boutique']],
};
const LONG = 2.4;

/* Projette une figure entière à un angle donné. Tout se recalcule : le
   sol, les volumes, l'ordre de tracé, la cote et les repères. */
export function projeter(nom, theta = 0) {
  const paves = (FIGURES[nom] || FIGURES.inventaire)();
  const volumes = paves
    .map((p) => projeterPave(p, theta, CENTRE.x, CENTRE.y))
    .sort((a, b) => a.prof - b.prof);

  /* Le sommet réel du dessin, pour y accrocher la cote. */
  let sx = 0, sy = Infinity;
  for (const v of volumes) {
    const pts = v.faces
      ? v.faces.flatMap((f) => f.d.split(' ').map((q) => q.split(',').map(Number)))
      : v.lignes.flatMap((l) => [[l.x1, l.y1], [l.x2, l.y2]]);
    for (const [x, y] of pts) if (y < sy) { sy = y; sx = x; }
  }

  const reperes = (REPERES[nom] || []).map(([x, y, z, t]) => {
    const [rx, ry] = tourner(x, y, theta, CENTRE.x, CENTRE.y);
    const [px, py] = PR(rx, ry, z);
    /* L'amorce part du côté où il y a de la place : si la pièce est dans
       la moitié gauche du cadre, elle file à gauche, et inversement. */
    const droite = px >= CX;
    const dx = droite ? LONG : -LONG;
    let tx = px + dx + (droite ? 0.7 : -0.7);
    let ty = py - LONG * 0.55 + 0.42;

    /* La scène tourne, l'étiquette suit : à certains angles elle sortirait
       du cadre et irait mordre sur la colonne d'à côté. On la ramène
       dedans, et l'amorce vient la rejoindre plutôt que de rester en l'air.
       0,6 par caractère est la largeur moyenne de la police à ce corps. */
    const larg = t.length * 0.6;
    const g = CADRE.x + 0.3;
    const d2 = CADRE.x + CADRE.w - 0.3;
    if (droite) tx = Math.min(tx, d2 - larg);
    else tx = Math.max(tx, g + larg);
    ty = Math.min(Math.max(ty, CADRE.y + 1), CADRE.y + CADRE.h - 0.6);

    return {
      x1: px, y1: py,
      x2: tx - (droite ? 0.7 : -0.7), y2: ty - 0.42,
      tx, ty,
      ancre: droite ? 'start' : 'end',
      t,
    };
  });

  return {
    sol: projeterSol(SOL.W, SOL.D, SOL.pas, theta, CENTRE.x, CENTRE.y),
    volumes,
    cote: { x: sx, y1: CADRE.y, y2: sy - 0.7 },
    reperes,
  };
}

/* ── Un pourcentage, en volume ──────────────────────────────────────
   Cent blocs sur un sol, dont N pleins et le reste en fil de fer. Une
   barre de progression dit « quatre-vingt-quinze pour cent » ; cent blocs
   posés côte à côte le montrent, et on peut les compter. */
const CHAMP = { n: 10, pas: 1.55, c: 1.15 };
const T_CHAMP = CHAMP.n * CHAMP.pas;
export const CENTRE_CHAMP = { x: T_CHAMP / 2, y: T_CHAMP / 2 };
export const CADRE_CHAMP = (() => {
  const p = [];
  for (let j = 0; j < CHAMP.n; j++) for (let i = 0; i < CHAMP.n; i++) {
    p.push(bloc(i * CHAMP.pas, j * CHAMP.pas, CHAMP.c, CHAMP.c, 1.5));
  }
  /* Le champ est carré : un quart de tour suffit à couvrir toutes ses
     silhouettes, et c'est quatre fois moins de calcul. */
  const e = etendue(p, CENTRE_CHAMP.x, CENTRE_CHAMP.y, 15);
  const m = 0.8;
  return { x: e.x0 - m, y: e.y0 - m, w: e.x1 - e.x0 + 2 * m, h: e.y1 - e.y0 + 2 * m };
})();
export const VIEWBOX_CHAMP =
  `${CADRE_CHAMP.x.toFixed(2)} ${CADRE_CHAMP.y.toFixed(2)} ${CADRE_CHAMP.w.toFixed(2)} ${CADRE_CHAMP.h.toFixed(2)}`;

export function champ(pourcent, theta = 0) {
  const pleins = Math.round(Math.max(0, Math.min(100, pourcent)));
  const paves = [];
  let k = 0;
  for (let j = 0; j < CHAMP.n; j++) {
    for (let i = 0; i < CHAMP.n; i++) {
      const f = k < pleins ? bloc : creux;
      paves.push(f(i * CHAMP.pas, j * CHAMP.pas, CHAMP.c, CHAMP.c, 1.5));
      k++;
    }
  }
  const volumes = paves
    .map((p) => projeterPave(p, theta, CENTRE_CHAMP.x, CENTRE_CHAMP.y))
    .sort((a, b) => a.prof - b.prof);
  return {
    sol: projeterSol(T_CHAMP, T_CHAMP, CHAMP.pas * 2, theta, CENTRE_CHAMP.x, CENTRE_CHAMP.y),
    volumes,
    pleins,
  };
}
