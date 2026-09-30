/* ════════════════════════════════════════════════════════════
   LES CARTES DE VISITE, AU FORMAT VERTICAL EUROPÉEN (55 × 85 mm).

   Un seul dessin pour tous les supports : la fenêtre « Carte de visite »
   du site (components/BusinessCard.jsx), les fichiers de l'imprimeur
   (scripts/cartes.mjs) et la carte virtuelle. Le module ne touche ni au
   DOM ni à React : il rend des morceaux de SVG, que chacun enveloppe.

   Une idée par face, comme sur toute bonne carte de visite :
     recto, la personne, sur l'indigo : le logo, le nom en grand, ce
       qu'elle mène, et ses coordonnées rattachées à un même fil ;
     verso, la marque, sur le crème : le R en grand, le mot, la phrase,
       les trois marques nommées sans plus, et l'adresse du site.
   La carte ne détaille pas les offres : on la donne après en avoir parlé,
   et le site est dessus.

   Unités : 1 = 0,1 mm. La carte fait 550 × 850 ; pour l'imprimeur, le fond
   déborde de 30 (3 mm de fond perdu) et rien d'important n'approche le
   bord à moins de 4,5 mm.

   Le R et le mot du logo ne sont jamais redessinés : leur géométrie arrive
   en paramètre (`geo`), depuis logo/geometrie.json ou Logo.jsx et
   data/logoMot.js, et le R garde ses rapports (traits 3, nœuds 5,5,
   jonction 7 pour 92).
   ════════════════════════════════════════════════════════════ */

export const CARTE = { W: 550, H: 850, FOND_PERDU: 30, MARGE: 45 };

const INDIGO = '#1C0CB3';
const CREME = '#F0EEE8';
const FONT = "'Reskope Sans', 'Helvetica Neue', Arial, sans-serif";

/* Les trois marques, avec les couleurs de styles/marques.css. */
const MARQUES = {
  create: { nom: 'Create', action: '#9C4F06' },
  define: { nom: 'Define', action: '#0B6B52' },
  elevate: { nom: 'Elevate', action: '#0B3D91' },
};

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
   RECTO : la personne, sur l'indigo de la marque
   p = { prenom, nom, titre, domaine: [lignes], tel, mail }
   ════════════════════════════════════════════════════════════ */
export function recto(p, { geo, lang = 'fr', adresse = 'reskope.fr', pour = '', pourMot = 'Pour' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B, MARGE: M } = CARTE;
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${INDIGO}"/>`];

  // Le logo, en tête, comme sur le site.
  out.push(logo(geo, M, 86, 44, CREME));

  // Le nom, sur deux lignes : le prénom, puis le nom de famille, plus appuyé.
  const yNom = 392;
  out.push(texte(M - 3, yNom, p.prenom, { taille: pt(17), poids: 400, ls: -0.8 }));
  out.push(texte(M - 3, yNom + 66, p.nom, { taille: pt(17), poids: 600, ls: -0.8 }));

  // Ce qu'il ou elle mène.
  let y = yNom + 66 + 62;
  out.push(texte(M, y, p.titre, { taille: pt(7.4), poids: 500 }));
  for (const ligne of p.domaine) {
    y += 29;
    out.push(texte(M, y, ligne, { taille: pt(6.8), op: 0.7 }));
  }
  if (pour) {
    y += 40;
    out.push(texte(M, y, `${pourMot} ${pour}`, { taille: pt(6.8), op: 0.6 }));
  }

  // Les coordonnées, en pied : chacune rattachée à un nœud, sur un même fil.
  const contacts = [
    { t: p.tel, taille: pt(7.2), poids: 500, op: 1 },
    { t: p.mail, taille: pt(6.8), poids: 400, op: 0.9 },
    { t: adresse, taille: pt(6.8), poids: 400, op: 0.9 },
    { t: T.lieux, taille: pt(6.8), poids: 400, op: 0.62 },
  ];
  const pas = 44;
  const yDernier = H - M - 18;
  const ys = contacts.map((_, i) => yDernier - (contacts.length - 1 - i) * pas);
  const nx = M + 5;
  out.push(`<line x1="${nx}" y1="${n2(ys[0])}" x2="${nx}" y2="${n2(ys[ys.length - 1])}" stroke="${CREME}" stroke-opacity="0.45" stroke-width="2.4"/>`);
  contacts.forEach((c, i) => {
    out.push(`<circle cx="${nx}" cy="${n2(ys[i])}" r="${i === 0 ? 6 : 4.6}" fill="${CREME}"/>`);
    out.push(texte(M + 30, ys[i] + c.taille * 0.35, c.t, { taille: c.taille, poids: c.poids, op: c.op }));
  });
  return out.join('');
}

/* ════════════════════════════════════════════════════════════
   VERSO : la marque, sur le crème
   ════════════════════════════════════════════════════════════ */
export function verso({ geo, lang = 'fr', adresse = 'reskope.fr' } = {}) {
  const T = TEXTES[lang] || TEXTES.fr;
  const { W, H, FOND_PERDU: B, MARGE: M } = CARTE;
  const out = [`<rect x="${-B}" y="${-B}" width="${W + 2 * B}" height="${H + 2 * B}" fill="${CREME}"/>`];

  // Le R, grand, centré : ses rapports ne changent jamais, seule sa taille.
  const s = 3.25;
  const [bx0, by0, bx1, by1] = geo.rBoite;
  const tx = W / 2 - ((bx0 + bx1) / 2) * s;
  const ty = 318 - ((by0 + by1) / 2) * s;
  out.push(`<g transform="translate(${n2(tx)},${n2(ty)}) scale(${s})">${rTrace(geo, INDIGO)}</g>`);

  // Le mot, sous le R.
  out.push(mot(geo, W / 2, 566, 60, INDIGO));

  // La phrase de la marque.
  T.slogan.forEach((l, i) => out.push(texte(W / 2, 636 + i * 28, l, { taille: pt(6.9), coul: INDIGO, op: 0.78, anc: 'middle' })));

  // Les trois marques, nommées sans plus, puis le site.
  const noms = ['create', 'define', 'elevate'].map((id) => `<tspan fill="${MARQUES[id].action}">${MARQUES[id].nom}</tspan>`);
  out.push(`<text x="${W / 2}" y="${H - M - 52}" font-family="${FONT}" font-size="${n2(pt(6.4))}" font-weight="500" text-anchor="middle" letter-spacing="0.6">${noms.join(`<tspan fill="${INDIGO}" fill-opacity="0.35">  ·  </tspan>`)}</text>`);
  out.push(texte(W / 2, H - M - 12, adresse, { taille: pt(6.4), coul: INDIGO, op: 0.55, anc: 'middle', ls: 0.8 }));
  return out.join('');
}

/* Enveloppes prêtes à l'emploi. */
export function svgImpression(corps, { largeur = '61mm', hauteur = '91mm' } = {}) {
  const { W, H, FOND_PERDU: B } = CARTE;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B} ${-B} ${W + 2 * B} ${H + 2 * B}" width="${largeur}" height="${hauteur}">${corps}</svg>`;
}
