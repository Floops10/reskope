/* ════════════════════════════════════════════════════════════
   L'ATELIER — la grille et ce qu'on y pose.

   Les blocs vivent dans des CASES, pas en coordonnées libres. Un plan qui
   s'aligne tout seul reste lisible ; un plan où tout flotte redevient le
   désordre qu'on est venu ranger. C'est aussi ce qui permet de dire « cette
   case est prise » sans calcul de collision.
   ════════════════════════════════════════════════════════════ */

export const CASE = { w: 4, d: 3.5, cols: 8, rows: 6 };
export const SOL = { W: CASE.w * CASE.cols, D: CASE.d * CASE.rows, pas: CASE.w };
export const BLOC = { w: 3, d: 2.6 };

/* LE NIVEAU D'UTILISATION — ce qui manquait pour que le plan dise quelque
   chose. Un outil ne se résume pas à ce qu'il coûte : ce qui compte, c'est
   l'écart entre la place qu'il prend et ce qu'on en tire. Le bloc porte donc
   les deux : sa hauteur est la place, et la part pleine est l'usage. Un
   grand volume presque vide se repère d'un coup d'œil, sans légende. */
export const USAGES = [
  { v: 1, fr: 'À plein', en: 'Fully' },
  { v: 0.8, fr: 'Presque à plein', en: 'Almost fully' },
  { v: 0.6, fr: 'Moyennement', en: 'Moderately' },
  { v: 0.4, fr: 'Peu', en: 'Little' },
  { v: 0.2, fr: 'Presque pas', en: 'Barely' },
  { v: 0, fr: 'Pas du tout', en: 'Not at all' },
];

export function nomUsage(u, lang = 'fr') {
  let p = USAGES[0];
  for (const x of USAGES) if (Math.abs(x.v - u) < Math.abs(p.v - u)) p = x;
  return p[lang === 'en' ? 'en' : 'fr'];
}

/* D'une case vers le monde des livrets (x, y au sol, z vers le haut). */
export function mondeDe(bl) {
  return {
    ...bl,
    x: bl.col * CASE.w + (CASE.w - BLOC.w) / 2,
    y: bl.row * CASE.d + (CASE.d - BLOC.d) / 2,
    w: BLOC.w,
    d: BLOC.d,
  };
}

/* La case sous un point du plan, ou rien si on est hors du plateau. */
export function caseDe(x, z) {
  const col = Math.floor((x + SOL.W / 2) / CASE.w);
  const row = Math.floor((z + SOL.D / 2) / CASE.d);
  if (col < 0 || col >= CASE.cols || row < 0 || row >= CASE.rows) return null;
  return { col, row };
}
