/* Généré par scripts/cartes.mjs depuis src/lib/carteVisite.js : ne pas modifier à la main. */
(function () {
/* ════════════════════════════════════════════════════════════
   LES CARTES DE VISITE (85 × 55 mm, le format standard).

   Un seul dessin pour tous les supports : la fenêtre « Carte de visite »
   du site (components/BusinessCard.jsx), les fichiers de l'imprimeur
   (scripts/cartes.mjs) et la carte virtuelle. Le module ne touche ni au
   DOM ni à React : il rend des morceaux de SVG, que chacun enveloppe.

   Recto, la personne, sur l'indigo : le logo, le nom, ce qu'elle mène,
   ses coordonnées ; et un grand R ton sur ton, taillé dans le bord droit.
   Verso, la marque, sur le crème : le R, le mot, la phrase, et les trois
   marques nommées sans plus. Rien d'autre : pas de trame en décor.

   Unités : 1 = 0,1 mm. La carte fait 850 × 550 ; pour l'imprimeur, le fond
   déborde de 30 (3 mm de fond perdu) et aucun texte n'approche le bord à
   moins de 4,5 mm.

   Le R et le mot du logo ne sont jamais redessinés : leur géométrie arrive
   en paramètre (`geo`), depuis logo/geometrie.json ou Logo.jsx et
   data/logoMot.js, et le R garde ses rapports (traits 3, nœuds 5,5,
   jonction 7 pour 92).
   ════════════════════════════════════════════════════════════ */

const CARTE = { W: 850, H: 550, FOND_PERDU: 30, MARGE: 48 };

const INDIGO = '#1C0CB3';
const CREME = '#F0EEE8';
const FONT = "'Reskope Sans', 'Helvetica Neue', Arial, sans-serif";

/* Ce que dit la carte, en deux langues. */
const TEXTES = {
  fr: { slogan: ['On vous aide à décider,', 'et on construit la suite.'], lieux: 'Valenciennes · Lille' },
  en: { slogan: ['We help you decide,', 'and we build what comes next.'], lieux: 'Valenciennes · Lille, France' },
};

const pt = (v) => v * 3.5278; // un point typographique, en dixièmes de millimètre
const n2 = (v) => Number(v.toFixed(2));
const echapper = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function texte(x, y, contenu, { taille, poids = 400, coul = CREME, op = 1, anc = 'start', ls = 0 }) {
  return `<text x="${n2(x)}" y="${n2(y)}" font-family="${FONT}" font-size="${n2(taille)}" font-weight="${poids}" fill="${coul}"`
    + `${op < 1 ? ` fill-opacity="${op}"` : ''}${anc !== 'start' ? ` text-anchor="${anc}"` : ''}${ls ? ` letter-spacing="${ls}"` : ''}>${echapper(contenu)}</text>`;
}

/* ── Le logo, tel que dans l'en-tête du site ─────────────────── */
function rTrace(geo, coul) {
  const liens = geo.rLinks.map(([a, b]) => `<line x1="${geo.rNodes[a][0]}" y1="${geo.rNodes[a][1]}" x2="${geo.rNodes[b][0]}" y2="${geo.rNodes[b][1]}"/>`).join('');
  const noeuds = geo.rNodes.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 3 ? geo.jonction : geo.noeud}"/>`).join('');
  return `<g stroke="${coul}" stroke-width="${geo.trait}" fill="none" stroke-linecap="round">${liens}</g><g fill="${coul}">${noeuds}</g>`;
}

/* Le logo horizontal. (x, y) : bord gauche du R et centre des capitales ;
   corps : taille du mot. Le R est centré sur les capitales à 1,2 fois
   leur hauteur, comme dans l'en-tête : on ne fait que changer d'échelle. */
function logo(geo, x, y, corps, coul) {
  const s = corps / geo.corpsMot;
  const tx = x - geo.rBoite[0] * s;
  const ty = y - 76 * s;
  return `<g transform="translate(${n2(tx)},${n2(ty)}) scale(${s.toFixed(5)})">${rTrace(geo, coul)}<path fill="${coul}" d="${geo.motD}"/></g>`;
}

/* Le mot du logo seul, centré sur cx, posé sur sa ligne de base. */
function mot(geo, cx, base, corps, coul) {
  const s = corps / geo.corpsMot;
  const [x0, , x1] = geo.motBoite;
  return `<g transform="translate(${n2(cx - ((x0 + x1) / 2) * s)},${n2(base - geo.baseMot * s)}) scale(${s.toFixed(5)})"><path fill="${coul}" d="${geo.motD}"/></g>`;
}

/* ── Le réseau en profondeur ─────────────────────────────────
   Comme la trame du site (HeroNetwork) : des nœuds posés dans un volume et
   vus en perspective. Les plus proches sont plus gros et plus lumineux, les
   plus lointains s'effacent. Chaque nœud est relié à ses deux voisins les
   plus proches dans le volume, et le R de la carte est pris dedans : ses
   nœuds sont reliés au réseau, rien ne flotte. Le réseau ne passe jamais
   sous un texte : les zones de texte sont réservées.
   Le tirage est fixe (graine) : la carte est la même à chaque fabrication. */
function hasard(graine) {
  let a = graine >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const dansRect = (x, y, [x0, y0, x1, y1], m = 0) => x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m;
function coupeRect([ax, ay], [bx, by], r) {
  for (let k = 0; k <= 40; k++) {
    const t = k / 40;
    if (dansRect(ax + (bx - ax) * t, ay + (by - ay) * t, r, 6)) return true;
  }
  return false;
}
const distSegment = ([px, py], [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy;
  const t = l ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l)) : 0;
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
};

/* points : les nœuds tirés au hasard [x, y, profondeur] déjà projetés ; r : les
   nœuds du R sur la carte, avec ses segments ; reserves : les rectangles des
   textes ; voile(x, y) : 0 à 1, pour effacer le réseau vers le texte. */
function reseauProfond({ points, rNoeuds, rSegments, reserves, voile, coul, fort }) {
  const garde = points.filter(([x, y]) => !reserves.some((r) => dansRect(x, y, r, 10))
    && !rSegments.some(([a, b]) => distSegment([x, y], a, b) < 22));
  const liens = [];
  const vu = new Set();
  const d3 = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1], (q[2] - p[2]) * 260);
  const relier = (i, j) => {
    const cle = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (i !== j && !vu.has(cle)) { vu.add(cle); liens.push([garde[i], garde[j]]); }
  };
  // D'un seul tenant : l'arbre couvrant le plus court (Prim)…
  if (garde.length) {
    const dans = new Set([0]);
    while (dans.size < garde.length) {
      let best = null;
      for (const i of dans) {
        garde.forEach((q, j) => {
          if (dans.has(j)) return;
          const d = d3(garde[i], q);
          if (!best || d < best.d) best = { i, j, d };
        });
      }
      dans.add(best.j);
      relier(best.i, best.j);
    }
  }
  // … et chaque nœud rejoint aussi son plus proche voisin : des mailles, pas une ligne.
  garde.forEach((p, i) => {
    const v = garde.map((q, j) => ({ j, d: d3(p, q) })).filter(({ j }) => j !== i).sort((u, w) => u.d - w.d)[0];
    if (v) relier(i, v.j);
  });
  // Le R est pris dans le réseau : chacun de ses nœuds rejoint le nœud le plus proche.
  rNoeuds.forEach((n) => {
    const q = garde.map((p) => ({ p, d: Math.hypot(p[0] - n[0], p[1] - n[1]) })).sort((u, v) => u.d - v.d)[0];
    if (q && q.d < 190) liens.push([[n[0], n[1], 0.15], q.p]);
  });
  const proche = (z) => 1 - z; // 1 devant, 0 au fond
  const out = [];
  for (const [a, b] of liens) {
    if (reserves.some((r) => coupeRect(a, b, r))) continue;
    const f = proche((a[2] + b[2]) / 2);
    const v = Math.min(voile(a[0], a[1]), voile(b[0], b[1]));
    const op = (0.05 + fort * 0.6 * f * f) * v;
    if (op < 0.012) continue;
    out.push(`<line x1="${n2(a[0])}" y1="${n2(a[1])}" x2="${n2(b[0])}" y2="${n2(b[1])}" stroke="${coul}" stroke-opacity="${op.toFixed(3)}" stroke-width="${n2(0.8 + 1.7 * f)}" stroke-linecap="round"/>`);
  }
  for (const [x, y, z] of garde) {
    const f = proche(z);
    const op = (0.08 + fort * f * f) * voile(x, y);
    if (op < 0.015) continue;
    out.push(`<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2(1.8 + 7.2 * f * f)}" fill="${coul}" fill-opacity="${Math.min(op, 0.95).toFixed(3)}"/>`);
  }
  return out.join('');
}

/* Les nœuds et les segments du R, sur la carte, pour une position et une échelle. */
function rSurCarte(geo, tx, ty, s) {
  const N = geo.rNodes.map(([x, y]) => [tx + x * s, ty + y * s]);
  return { noeuds: N, segments: geo.rLinks.map(([a, b]) => [N[a], N[b]]) };
}
const lisser = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const largeurTexte = (t, taille) => t.length * taille * 0.55; // estimation, pour réserver la place

/* Le grand R du recto : sa jonction au milieu de la hauteur, sa jambe taillée par le bord droit. */
function grandR() {
  const { W, H } = CARTE;
  const s = 4.1;
  return { s, tx: W - 214 - 36 * s, ty: H / 2 - 80 * s };
}

/* Le masque du vernis sélectif (finition optionnelle) : le grand R du recto et
   le logo, en noir plein sur blanc. Le réseau n'y est pas : ses traits sont
   trop fins pour un vernis. */
function vernisRecto({ geo } = {}) {
  const { W, H, FOND_PERDU: B, MARGE: M } = CARTE;
  const { s, tx, ty } = grandR();
  return `<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="#FFFFFF"/>`
    + `<g transform="translate(${n2(tx)},${n2(ty)}) scale(${s})">${rTrace(geo, '#000000')}</g>`
    + logo(geo, M, 88, 40, '#000000');
}

/* ════════════════════════════════════════════════════════════
   RECTO : la personne, sur l'indigo
   p = { prenom, nom, titre, domaine: [lignes], tel, mail }
   ════════════════════════════════════════════════════════════ */
const minusculeInitiale = (t) => t.charAt(0).toLowerCase() + t.slice(1);

function recto(p, { geo, lang = 'fr', adresse = 'reskope.fr', pour = '', pourMot = 'Pour' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B, MARGE: M } = CARTE;
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${INDIGO}"/>`];

  // Les textes, et la place qu'ils occupent (le réseau n'y passe pas).
  const nom = `${p.prenom} ${p.nom}`;
  const role = `${p.titre} · ${minusculeInitiale(p.domaine.join(' '))}`;
  const lignes = [
    { t: T.lieux, x: M, y: 158, taille: pt(5.6), op: 0.58, ls: 0.4 },
    ...(pour ? [{ t: `${pourMot} ${pour}`, x: M, y: 214, taille: pt(6), op: 0.72 }] : []),
    { t: nom, x: M - 2, y: 322, taille: pt(15.5), poids: 600, ls: -1 },
    { t: role, x: M, y: 362, taille: pt(6), op: 0.8 },
    { t: p.tel, x: M, y: 440, taille: pt(6.4), poids: 500 },
    { t: p.mail, x: M, y: 468, taille: pt(6.2), op: 0.9 },
    { t: adresse, x: M, y: 496, taille: pt(6.2), op: 0.62 },
  ];
  const reserves = [[M - 10, 40, 300, 170], ...lignes.map((l) => [l.x - 6, l.y - l.taille * 0.8, l.x + largeurTexte(l.t, l.taille) + 16, l.y + l.taille * 0.3])];

  // Le grand R, pris dans le réseau, taillé dans le bord droit.
  const { s, tx, ty } = grandR();
  const R = rSurCarte(geo, tx, ty, s);
  const alea = hasard(7);
  const points = Array.from({ length: 84 }, () => {
    const z = alea();
    const f = 1 / (1 + z * 1.25);
    const X = 380 + alea() * 580, Y = -50 + alea() * 650;
    return [700 + (X - 700) * f, 275 + (Y - 275) * f, z];
  });
  out.push(reseauProfond({
    points, rNoeuds: R.noeuds, rSegments: R.segments, reserves,
    voile: (x) => lisser(380, 580, x), coul: CREME, fort: 0.5,
  }));
  out.push(`<g transform="translate(${n2(tx)},${n2(ty)}) scale(${s})" opacity="0.3">${rTrace(geo, CREME)}</g>`);

  // Le logo, puis les textes.
  out.push(logo(geo, M, 88, 40, CREME));
  for (const l of lignes) out.push(texte(l.x, l.y, l.t, { taille: l.taille, poids: l.poids || 400, op: l.op ?? 1, ls: l.ls || 0 }));
  return out.join('');
}

/* ════════════════════════════════════════════════════════════
   VERSO : la marque, sur le crème
   ════════════════════════════════════════════════════════════ */
function verso({ geo, lang = 'fr' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B } = CARTE;
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${CREME}"/>`];

  // Le R, centré : ses rapports ne changent jamais, seule sa taille.
  const s = 2.15;
  const [bx0, by0, bx1, by1] = geo.rBoite;
  const tx = W / 2 - ((bx0 + bx1) / 2) * s, ty = 172 - ((by0 + by1) / 2) * s;
  const R = rSurCarte(geo, tx, ty, s);

  // Autour de lui, un réseau léger, qui s'efface avant les textes.
  const reserves = [[W / 2 - 170, 300, W / 2 + 170, 380], [W / 2 - 300, 400, W / 2 + 300, 438], [W / 2 - 200, 470, W / 2 + 200, 500]];
  const alea = hasard(11);
  const points = Array.from({ length: 76 }, () => {
    const a = alea() * Math.PI * 2;
    const r = 0.4 + Math.sqrt(alea()) * 0.62;
    const z = alea();
    return [W / 2 + Math.cos(a) * r * 470, 172 + Math.sin(a) * r * 240, z];
  });
  out.push(reseauProfond({
    points, rNoeuds: R.noeuds, rSegments: R.segments, reserves,
    voile: (x, y) => 1 - lisser(240, 320, y), coul: INDIGO, fort: 0.24,
  }));
  out.push(`<g transform="translate(${n2(tx)},${n2(ty)}) scale(${s})">${rTrace(geo, INDIGO)}</g>`);

  // Le mot, la phrase, et les trois marques nommées sans plus.
  out.push(mot(geo, W / 2, 368, 50, INDIGO));
  out.push(texte(W / 2, 426, `${T.slogan[0]} ${T.slogan[1]}`, { taille: pt(6.3), coul: INDIGO, op: 0.75, anc: 'middle' }));
  out.push(texte(W / 2, H - 58, 'Create  ·  Define  ·  Elevate', { taille: pt(5.4), coul: INDIGO, op: 0.5, anc: 'middle', ls: 1.2 }));
  return out.join('');
}

/* Enveloppes prêtes à l'emploi. */
function svgImpression(corps, { largeur = '91mm', hauteur = '61mm' } = {}) {
  const { W, H, FOND_PERDU: B } = CARTE;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B} ${-B} ${W + 2 * B} ${H + 2 * B}" width="${largeur}" height="${hauteur}">${corps}</svg>`;
}

window.CarteVisite = { CARTE, TEXTES, recto, verso, GEO: {"rNodes":[[36,30],[92,30],[104,62],[36,80],[36,122],[104,122]],"rLinks":[[0,3],[3,4],[0,1],[1,2],[2,3],[3,5]],"trait":3,"noeud":5.5,"jonction":7,"motD":"M182.25 114.33V37.67H212.69Q224.52 37.67 229.83 42.76Q235.14 47.86 235.14 59.14Q235.14 68.22 231.75 73.26Q228.35 78.3 220.91 79.83L242.04 114.33H226.6L206.01 80.6H195.17V114.33ZM222.22 59.14Q222.22 53 220.2 50.7Q218.17 48.4 212.69 48.4H195.17V69.87H212.69Q218.17 69.87 220.2 67.57Q222.22 65.27 222.22 59.14Z M304.57 86.08Q304.57 87.5 304.57 88.81H258.47Q258.91 98.23 262.63 101.79Q266.35 105.35 275.33 105.35Q282.67 105.35 286.5 103.05Q290.34 100.75 291.54 94.95H303.92Q302.16 105.79 295.21 110.72Q288.26 115.64 275.33 115.64Q260 115.64 253.1 108.63Q246.2 101.63 246.2 86.08Q246.2 70.52 253.1 63.52Q260 56.51 275.33 56.51Q290.67 56.51 297.62 63.52Q304.57 70.52 304.57 86.08ZM258.8 79.18H291.87Q290.88 72.28 287.11 69.54Q283.33 66.8 275.33 66.8Q267.45 66.8 263.62 69.54Q259.78 72.28 258.8 79.18Z M346.19 73.04Q346.19 69.43 343.89 68.12Q341.59 66.8 335.89 66.8Q329.98 66.8 327.74 68.22Q325.49 69.65 325.49 73.37Q325.49 77.1 327.74 78.46Q329.98 79.83 335.89 79.83Q348.49 79.83 354.24 84.1Q359.99 88.37 359.99 97.79Q359.99 107.1 354.24 111.37Q348.49 115.64 335.89 115.64Q323.3 115.64 317.61 111.48Q311.91 107.32 311.8 98.12H324.07Q324.07 102.17 326.64 103.76Q329.21 105.35 335.89 105.35Q342.57 105.35 345.15 103.71Q347.72 102.06 347.72 97.79Q347.72 93.41 345.15 91.77Q342.57 90.13 335.89 90.13Q323.96 90.13 318.59 86.13Q313.23 82.13 313.23 73.37Q313.23 64.5 318.59 60.5Q323.96 56.51 335.89 56.51Q347.61 56.51 352.98 60.45Q358.34 64.39 358.45 73.04Z M370.28 114.33V93.96H369.62L370.28 93.19V33.07H382.55V80.16L403.46 57.82H419.56L392.95 86.29H398.53L422.63 114.33H406.09L387.25 92.43L385.72 93.96H382.55V114.33Z M485.05 86.08Q485.05 101.63 477.88 108.63Q470.7 115.64 454.93 115.64Q439.05 115.64 431.94 108.63Q424.82 101.63 424.82 86.08Q424.82 70.52 431.94 63.52Q439.05 56.51 454.93 56.51Q470.7 56.51 477.88 63.52Q485.05 70.52 485.05 86.08ZM472.78 86.08Q472.78 78.74 471.14 74.52Q469.5 70.31 465.61 68.55Q461.72 66.8 454.93 66.8Q448.14 66.8 444.2 68.55Q440.26 70.31 438.67 74.52Q437.08 78.74 437.08 86.08Q437.08 93.41 438.67 97.63Q440.26 101.84 444.2 103.6Q448.14 105.35 454.93 105.35Q461.72 105.35 465.61 103.6Q469.5 101.84 471.14 97.63Q472.78 93.41 472.78 86.08Z M494.69 137.98V57.82H506.95V64.28Q513.74 56.51 529.4 56.51Q544.4 56.51 551.25 63.52Q558.09 70.52 558.09 86.08Q558.09 101.63 551.25 108.63Q544.4 115.64 529.4 115.64Q513.74 115.64 506.95 107.87V137.98ZM545.83 86.08Q545.83 78.74 543.97 74.52Q542.1 70.31 537.78 68.55Q533.45 66.8 525.9 66.8Q517.35 66.8 512.92 69.05Q508.48 71.29 506.95 76.88V95.27Q508.48 100.86 512.92 103.1Q517.35 105.35 525.9 105.35Q533.45 105.35 537.78 103.6Q542.1 101.84 543.97 97.63Q545.83 93.41 545.83 86.08Z M623.58 86.08Q623.58 87.5 623.58 88.81H577.48Q577.91 98.23 581.64 101.79Q585.36 105.35 594.34 105.35Q601.68 105.35 605.51 103.05Q609.34 100.75 610.55 94.95H622.92Q621.17 105.79 614.22 110.72Q607.26 115.64 594.34 115.64Q579.01 115.64 572.11 108.63Q565.21 101.63 565.21 86.08Q565.21 70.52 572.11 63.52Q579.01 56.51 594.34 56.51Q609.67 56.51 616.63 63.52Q623.58 70.52 623.58 86.08ZM577.8 79.18H610.88Q609.89 72.28 606.11 69.54Q602.33 66.8 594.34 66.8Q586.46 66.8 582.62 69.54Q578.79 72.28 577.8 79.18Z","rBoite":[29,24.5,109.5,127.5],"motBoite":[182.25,33.07,623.58,137.98],"corpsMot":109.511,"baseMot":114.329} };
})();
