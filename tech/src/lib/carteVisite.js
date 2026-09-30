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

/* ════════════════════════════════════════════════════════════
   RECTO : la personne, sur l'indigo
   p = { prenom, nom, titre, domaine: [lignes], tel, mail }
   ════════════════════════════════════════════════════════════ */
const minusculeInitiale = (t) => t.charAt(0).toLowerCase() + t.slice(1);

export function recto(p, { geo, lang = 'fr', adresse = 'reskope.fr', pour = '', pourMot = 'Pour' } = {}) {
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
  const s = 4.1;
  const tx = W - 214 - 36 * s, ty = H / 2 - 80 * s;
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
export function verso({ geo, lang = 'fr' } = {}) {
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
export function svgImpression(corps, { largeur = '91mm', hauteur = '61mm' } = {}) {
  const { W, H, FOND_PERDU: B } = CARTE;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B} ${-B} ${W + 2 * B} ${H + 2 * B}" width="${largeur}" height="${hauteur}">${corps}</svg>`;
}
