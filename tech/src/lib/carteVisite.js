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

export const CARTE = { W: 850, H: 550, FOND_PERDU: 30, MARGE: 48 };

const INDIGO = '#1C0CB3';
const CREME = '#F0EEE8';
const FONT = "'Reskope Sans', 'Helvetica Neue', Arial, sans-serif";

/* Ce que dit la carte, en deux langues. */
export const TEXTES = {
  fr: { slogan: ['On vous aide à décider,', 'et on construit la suite.'], lieux: 'Valenciennes · Lille' },
  en: { slogan: ['We help you decide,', 'and we build what comes next.'], lieux: 'Valenciennes · Lille, France' },
};

const pt = (v) => v * 3.5278; // un point typographique, en dixièmes de millimètre
const n2 = (v) => Number(v.toFixed(2));
const echapper = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function texte(x, y, contenu, { taille, poids = 400, coul = CREME, op = 1, anc = 'start', ls = 0, peinture = null }) {
  return `<text x="${n2(x)}" y="${n2(y)}" font-family="${FONT}" font-size="${n2(taille)}" font-weight="${poids}" fill="${peinture || coul}"`
    + `${op < 1 && !peinture ? ` fill-opacity="${op}"` : ''}${anc !== 'start' ? ` text-anchor="${anc}"` : ''}${ls ? ` letter-spacing="${ls}"` : ''}>${echapper(contenu)}</text>`;
}

/* ── Des couleurs pleines, jamais de transparence ──────────────
   Un élément « crème à 30 % » est peint dans la couleur qu'il aurait sur le
   fond, calculée d'avance : le fond est un dégradé, alors la peinture en est
   un aussi, de même centre et de mêmes arrêts. À l'œil, rien ne change ; dans
   le PDF, il n'y a plus aucune transparence (certains lecteurs et certains
   imprimeurs la rendent mal), et ce qui passe derrière le grand R est caché
   pour de vrai. */
const rvb = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const hexa = (t) => `#${t.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const melange = (dessus, dessous, op) => { const a = rvb(dessus), b = rvb(dessous); return hexa(a.map((v, i) => v * op + b[i] * (1 - op))); };

function peintures(prefixe, { cx, cy, r, arrets }) {
  const defs = new Map();
  return {
    fond: () => `url(#${prefixe}-fond)`,
    peindre(coul, op) {
      const id = `${prefixe}-${coul.slice(1)}-${Math.round(op * 1000)}`;
      if (!defs.has(id)) defs.set(id, arrets.map(([o, c]) => `<stop offset="${o}" stop-color="${melange(coul, c, op)}"/>`).join(''));
      return `url(#${id})`;
    },
    defs() {
      const grad = (id, stops) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${n2(cx)}" cy="${n2(cy)}" r="${r}">${stops}</radialGradient>`;
      return `<defs>${grad(`${prefixe}-fond`, arrets.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join(''))}${[...defs].map(([id, stops]) => grad(id, stops)).join('')}</defs>`;
    },
  };
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

/* Les nœuds et les segments du R, sur la carte, pour une position et une échelle. */
function rSurCarte(geo, tx, ty, s) {
  const N = geo.rNodes.map(([x, y]) => [tx + x * s, ty + y * s]);
  return { noeuds: N, segments: geo.rLinks.map(([a, b]) => [N[a], N[b]]) };
}

/* ── La constellation ────────────────────────────────────────
   Quelques nœuds placés à la main, qui prolongent le R : chacun est relié à
   un nœud du R ou à un autre nœud de la constellation, rien ne flotte. Trois
   plans de profondeur : devant, les nœuds sont plus gros et plus lumineux ;
   au fond, plus petits et plus pâles. Peu d'éléments, mais qui respirent. */
function constellation({ R, satellites, liens, coul, fort = 1, peindre }) {
  const plan = { devant: { r: 10.5, op: 0.46 }, milieu: { r: 6.8, op: 0.3 }, fond: { r: 4.2, op: 0.17 } };
  const pos = (k) => (typeof k === 'number' ? { p: R[k], z: 'r' } : { p: satellites[k].p, z: satellites[k].plan });
  const out = [];
  for (const [a, b] of liens) {
    const A = pos(a), B = pos(b);
    const z = [A.z, B.z].includes('fond') ? 'fond' : [A.z, B.z].includes('milieu') ? 'milieu' : 'devant';
    out.push(`<line x1="${n2(A.p[0])}" y1="${n2(A.p[1])}" x2="${n2(B.p[0])}" y2="${n2(B.p[1])}" stroke="${peindre(coul, plan[z].op * 0.62 * fort)}" stroke-width="${z === 'devant' ? 2.6 : z === 'milieu' ? 2 : 1.5}" stroke-linecap="round"/>`);
  }
  for (const { p, plan: z } of Object.values(satellites)) {
    out.push(`<circle cx="${n2(p[0])}" cy="${n2(p[1])}" r="${plan[z].r}" fill="${peindre(coul, plan[z].op * fort)}"/>`);
  }
  return out.join('');
}

/* Le R posé directement dans le repère de la carte (sans transformation), pour que sa
   peinture en dégradé suive le fond exactement. Mêmes rapports : traits 3, nœuds 5,5,
   jonction 7 pour 92, multipliés par l'échelle. */
function rPeint(geo, tx, ty, s, peinture) {
  const N = geo.rNodes.map(([x, y]) => [tx + x * s, ty + y * s]);
  const liens = geo.rLinks.map(([a, b]) => `<line x1="${n2(N[a][0])}" y1="${n2(N[a][1])}" x2="${n2(N[b][0])}" y2="${n2(N[b][1])}"/>`).join('');
  const noeuds = N.map(([x, y], i) => `<circle cx="${n2(x)}" cy="${n2(y)}" r="${n2((i === 3 ? geo.jonction : geo.noeud) * s)}"/>`).join('');
  return `<g stroke="${peinture}" stroke-width="${n2(geo.trait * s)}" fill="none" stroke-linecap="round">${liens}</g><g fill="${peinture}">${noeuds}</g>`;
}

/* Le grand R du recto : sa jonction au milieu de la hauteur, sa jambe taillée par le bord droit. */
function grandR() {
  const { W, H } = CARTE;
  const s = 4.1;
  return { s, tx: W - 214 - 36 * s, ty: H / 2 - 80 * s };
}

/* Le masque du vernis sélectif (finition optionnelle) : le grand R du recto et
   le logo, en noir plein sur blanc. Le réseau n'y est pas : ses traits sont
   trop fins pour un vernis. */
export function vernisRecto({ geo } = {}) {
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

export function recto(p, { geo, lang = 'fr', adresse = 'reskope.fr', pour = '', pourMot = 'Pour' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B, MARGE: M } = CARTE;
  const { s, tx, ty } = grandR();
  const R = rSurCarte(geo, tx, ty, s).noeuds; // 0 haut du fût, 1 haut droite, 2 droite, 3 jonction, 4 bas du fût, 5 bas de la jambe
  const [jx, jy] = R[3];
  // L'indigo, et une lumière douce derrière le cœur du R : la carte a de la profondeur.
  const P = peintures('r', { cx: jx, cy: jy, r: 720, arrets: [[0, '#4B3BDB'], [0.3, '#2E1EC9'], [0.62, INDIGO], [1, '#16099C']] });
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${P.fond()}"/>`];

  // La constellation, qui prolonge le R vers le haut et vers le bas.
  out.push(constellation({
    R,
    coul: CREME,
    peindre: P.peindre,
    satellites: {
      a: { p: [548, 118], plan: 'fond' },
      b: { p: [452, 52], plan: 'fond' },
      c: { p: [748, 148], plan: 'milieu' },
      d: { p: [812, 92], plan: 'fond' },
      e: { p: [722, 392], plan: 'devant' },
      f: { p: [806, 506], plan: 'milieu' },
      g: { p: [572, 520], plan: 'fond' },
    },
    liens: [[0, 'a'], ['a', 'b'], [0, 'c'], [3, 'c'], ['c', 'd'], ['d', 1], [4, 'e'], ['e', 'f'], [4, 'g'], ['e', 3]],
  }));
  // Le grand R, opaque : ce qui passe derrière lui est caché. Sa peinture vit dans le repère
  // de la carte, d'où la transformation inverse sur le dégradé : on peint le R au trait, à plat.
  out.push(rPeint(geo, tx, ty, s, P.peindre(CREME, 0.34)));

  // Le logo et le lieu, puis la personne.
  out.push(logo(geo, M, 88, 40, CREME));
  out.push(texte(M, 158, T.lieux, { taille: pt(5.6), ls: 0.4, peinture: P.peindre(CREME, 0.58) }));
  if (pour) out.push(texte(M, 214, `${pourMot} ${pour}`, { taille: pt(6), peinture: P.peindre(CREME, 0.72) }));
  out.push(`<text x="${M - 2}" y="324" font-family="${FONT}" font-size="${n2(pt(16))}" fill="${CREME}" letter-spacing="-1"><tspan font-weight="400">${echapper(p.prenom)}</tspan><tspan font-weight="600"> ${echapper(p.nom)}</tspan></text>`);
  out.push(texte(M, 364, `${p.titre} · ${minusculeInitiale(p.domaine.join(' '))}`, { taille: pt(6), peinture: P.peindre(CREME, 0.8) }));

  // Les coordonnées, en pied, un peu plus aérées.
  out.push(texte(M, 430, p.tel, { taille: pt(6.4), poids: 500 }));
  out.push(texte(M, 464, p.mail, { taille: pt(6.2), peinture: P.peindre(CREME, 0.9) }));
  out.push(texte(M, 498, adresse, { taille: pt(6.2), peinture: P.peindre(CREME, 0.62) }));
  out.push(P.defs());
  return out.join('');
}

/* ════════════════════════════════════════════════════════════
   VERSO : la marque, sur le crème
   ════════════════════════════════════════════════════════════ */
export function verso({ geo, lang = 'fr' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B } = CARTE;
  const P = peintures('v', { cx: W / 2, cy: 190, r: 560, arrets: [[0, '#FBFAF7'], [0.6, CREME], [1, '#E7E2D8']] });
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${P.fond()}"/>`];

  // Le R, centré : ses rapports ne changent jamais, seule sa taille.
  const s = 2.15;
  const [bx0, by0, bx1, by1] = geo.rBoite;
  const tx = W / 2 - ((bx0 + bx1) / 2) * s, ty = 172 - ((by0 + by1) / 2) * s;
  const R = rSurCarte(geo, tx, ty, s).noeuds;

  // Quelques nœuds autour de lui, reliés à lui : le R est un réseau qui s'ouvre.
  out.push(constellation({
    R,
    coul: INDIGO,
    fort: 0.62,
    peindre: P.peindre,
    satellites: {
      a: { p: [268, 96], plan: 'milieu' },
      b: { p: [176, 176], plan: 'fond' },
      c: { p: [246, 252], plan: 'fond' },
      d: { p: [592, 70], plan: 'milieu' },
      e: { p: [672, 168], plan: 'fond' },
      f: { p: [604, 262], plan: 'fond' },
    },
    liens: [[0, 'a'], ['a', 'b'], [3, 'c'], ['b', 'c'], [1, 'd'], ['d', 'e'], [2, 'e'], [5, 'f'], ['e', 'f']],
  }));
  out.push(`<g transform="translate(${n2(tx)},${n2(ty)}) scale(${s})">${rTrace(geo, INDIGO)}</g>`);

  // Le mot, la phrase, et les trois marques nommées sans plus.
  out.push(mot(geo, W / 2, 368, 50, INDIGO));
  out.push(texte(W / 2, 426, `${T.slogan[0]} ${T.slogan[1]}`, { taille: pt(6.3), anc: 'middle', peinture: P.peindre(INDIGO, 0.75) }));
  out.push(texte(W / 2, H - 58, 'Create  ·  Define  ·  Elevate', { taille: pt(5.4), anc: 'middle', ls: 1.2, peinture: P.peindre(INDIGO, 0.5) }));
  out.push(P.defs());
  return out.join('');
}

/* Enveloppes prêtes à l'emploi. */
export function svgImpression(corps, { largeur = '91mm', hauteur = '61mm' } = {}) {
  const { W, H, FOND_PERDU: B } = CARTE;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B} ${-B} ${W + 2 * B} ${H + 2 * B}" width="${largeur}" height="${hauteur}">${corps}</svg>`;
}
