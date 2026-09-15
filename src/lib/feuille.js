/* ════════════════════════════════════════════════════════════
   LA FEUILLE — un seul profil, deux rendus.

   La page verte en montre deux : un filigrane en SVG derrière le titre, et
   une feuille qui se reforme en volume pendant qu'on scrolle. Les deux
   décrivaient la même plante avec deux formules différentes, et aucune des
   deux ne ressemblait vraiment à une feuille : la largeur montait trop vite,
   la base restait carrée, la pointe était émoussée, et le contour du
   filigrane était une ligne brisée de vingt-cinq segments qu'on voyait
   facetter dès qu'on regardait de près.

   Ici, un profil unique, et il est botanique :

     largeur(t)   t^0.55 · (1-t)^0.95, normalisé — la feuille est la plus
                  large vers le tiers bas, s'arrondit à la base et file
                  franchement vers la pointe (limbe acuminé)
     cambrure(t)  la nervure centrale ne monte pas droit : elle s'incline
                  doucement, comme une feuille qui cherche la lumière
     epaisseur(t) le limbe se plie de part et d'autre de la nervure — nul
                  en 2D, utile pour la version en volume

   Et le tracé SVG passe par des Béziers cubiques obtenues d'une spline de
   Catmull-Rom : plus aucune facette, quel que soit le zoom.
   ════════════════════════════════════════════════════════════ */

const P = 0.55;
const Q = 0.95;
/* La valeur maximale du profil brut, pour le normaliser à 1. */
const T_MAX = P / (P + Q);
const V_MAX = Math.pow(T_MAX, P) * Math.pow(1 - T_MAX, Q);

export function largeur(t) {
  const u = Math.min(Math.max(t, 0), 1);
  return (Math.pow(u, P) * Math.pow(1 - u, Q)) / V_MAX;
}

export function cambrure(t) {
  return Math.sin(Math.PI * Math.min(Math.max(t, 0), 1) * 0.86);
}

export function epaisseur(t) {
  return Math.sin(Math.PI * Math.min(Math.max(t, 0), 1));
}

/* Une spline de Catmull-Rom rendue en Béziers cubiques. C'est ce qui sépare
   un contour dessiné d'un contour échantillonné. */
function lisser(pts, fermer = false) {
  if (pts.length < 2) return '';
  const p = (i) => pts[Math.min(Math.max(i, 0), pts.length - 1)];
  const n = (v) => v.map((x) => x.toFixed(2)).join(',');
  let d = `M${n(pts[0])}`;
  const dernier = fermer ? pts.length : pts.length - 1;
  for (let i = 0; i < dernier; i++) {
    const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${n(c1)} ${n(c2)} ${n(p2)}`;
  }
  return d;
}

/* Le filigrane du hero. `base` et `pointe` sont en coordonnées du viewBox,
   `demi` est la demi-largeur maximale du limbe. */
export function cheminFeuille({ base = [50, 108], pointe = [56, 12], demi = 29, courbe = 7 } = {}) {
  const haut = base[1] - pointe[1];
  const axe = (t) => [
    base[0] + (pointe[0] - base[0]) * t + courbe * cambrure(t),
    base[1] - haut * t,
  ];
  /* La normale à l'axe, pour poser la largeur perpendiculairement : une
     largeur posée à l'horizontale donne une feuille penchée qui s'écrase. */
  const bord = (t, cote) => {
    const e = 0.004;
    const a = axe(Math.max(t - e, 0));
    const b = axe(Math.min(t + e, 1));
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    const w = demi * largeur(t);
    const c = axe(t);
    return [c[0] + (cote * -dy / L) * w, c[1] + (cote * dx / L) * w];
  };

  /* Répartition en cosinus : les points se resserrent à la base et à la
     pointe, là où le contour tourne le plus vite. */
  const N = 26;
  const ts = Array.from({ length: N }, (_, k) => {
    const u = (k + 0.5) / N;
    return 0.5 - 0.5 * Math.cos(Math.PI * u);
  });
  const gauche = ts.map((t) => bord(t, -1));
  const droite = [...ts].reverse().map((t) => bord(t, 1));

  const contour = `${lisser([base, ...gauche, pointe])} `
    + `${lisser([pointe, ...droite, base]).replace(/^M[^C]*/, '')} Z`;

  const nervure = lisser(Array.from({ length: 14 }, (_, k) => axe(0.02 + (k / 13) * 0.94)));

  /* Les nervures secondaires partent de l'axe et rejoignent le bord en
     s'infléchissant vers la pointe. Elles raccourcissent à mesure qu'on
     monte, comme sur une vraie feuille. */
  const secondaires = [0.14, 0.3, 0.46, 0.62, 0.78].map((t0) => (
    [-1, 1].map((cote) => {
      const t1 = Math.min(t0 + 0.16, 0.95);
      const d = axe(t0);
      const f = bord(t1, cote * 0.9);
      const ctrl = [
        d[0] + (f[0] - d[0]) * 0.45,
        d[1] + (f[1] - d[1]) * 0.78,
      ];
      return `M${d[0].toFixed(2)},${d[1].toFixed(2)} Q${ctrl[0].toFixed(2)},${ctrl[1].toFixed(2)} ${f[0].toFixed(2)},${f[1].toFixed(2)}`;
    }).join(' ')
  )).join(' ');

  const tige = `M${base[0]},${base[1]} C${base[0] - 1},${base[1] + 5} ${base[0] - 3},${base[1] + 8} ${base[0] - 6},${base[1] + 11}`;

  return { contour, nervure, secondaires, tige };
}
