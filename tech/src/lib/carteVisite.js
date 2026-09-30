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
const INDIGO_TON = '#3322C9'; // le grand R du recto, ton sur ton
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

/* ════════════════════════════════════════════════════════════
   RECTO : la personne, sur l'indigo
   p = { prenom, nom, titre, domaine: [lignes], tel, mail }
   ════════════════════════════════════════════════════════════ */
const minusculeInitiale = (t) => t.charAt(0).toLowerCase() + t.slice(1);

export function recto(p, { geo, lang = 'fr', adresse = 'reskope.fr', pour = '', pourMot = 'Pour' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B, MARGE: M } = CARTE;
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${INDIGO}"/>`];

  // Le grand R, ton sur ton, taillé dans le bord droit : sa jonction au milieu de la hauteur.
  const s = 4.1;
  out.push(`<g transform="translate(${n2(W - 214 - 36 * s)},${n2(H / 2 - 80 * s)}) scale(${s})">${rTrace(geo, INDIGO_TON)}</g>`);

  // Le logo et le lieu, en haut à gauche.
  out.push(logo(geo, M, 88, 40, CREME));
  out.push(texte(M, 132, T.lieux, { taille: pt(5.6), op: 0.58, ls: 0.4 }));
  if (pour) out.push(texte(M, 162, `${pourMot} ${pour}`, { taille: pt(5.8), op: 0.66 }));

  // Le nom, puis ce qu'il ou elle mène.
  out.push(texte(M - 2, 318, `${p.prenom} ${p.nom}`, { taille: pt(15.5), poids: 600, ls: -1 }));
  out.push(texte(M, 358, `${p.titre} · ${minusculeInitiale(p.domaine.join(' '))}`, { taille: pt(6), op: 0.8 }));

  // Les coordonnées, en pied.
  out.push(texte(M, 440, p.tel, { taille: pt(6.4), poids: 500 }));
  out.push(texte(M, 468, p.mail, { taille: pt(6.2), op: 0.9 }));
  out.push(texte(M, 496, adresse, { taille: pt(6.2), op: 0.62 }));
  return out.join('');
}

/* ════════════════════════════════════════════════════════════
   VERSO : la marque, sur le crème
   ════════════════════════════════════════════════════════════ */
export function verso({ geo, lang = 'fr' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B } = CARTE;
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${CREME}"/>`];

  // Le R, centré : ses rapports ne changent jamais, seule sa taille.
  const s = 2.15;
  const [bx0, by0, bx1, by1] = geo.rBoite;
  out.push(`<g transform="translate(${n2(W / 2 - ((bx0 + bx1) / 2) * s)},${n2(172 - ((by0 + by1) / 2) * s)}) scale(${s})">${rTrace(geo, INDIGO)}</g>`);

  // Le mot, la phrase, et les trois marques nommées sans plus.
  out.push(mot(geo, W / 2, 368, 50, INDIGO));
  out.push(texte(W / 2, 426, `${T.slogan[0]} ${T.slogan[1]}`, { taille: pt(6.3), coul: INDIGO, op: 0.75, anc: 'middle' }));
  out.push(texte(W / 2, H - 58, 'Create  ·  Define  ·  Elevate', { taille: pt(5.4), coul: INDIGO, op: 0.5, anc: 'middle', ls: 1.2 }));
  return out.join('');
}

/* Enveloppes prêtes à l'emploi. */
export function svgImpression(corps, { largeur = '91mm', hauteur = '61mm' } = {}) {
  const { W, H, FOND_PERDU: B } = CARTE;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B} ${-B} ${W + 2 * B} ${H + 2 * B}" width="${largeur}" height="${hauteur}">${corps}</svg>`;
}
