import { pave, projeterPave, projeterSol, PR, tourner } from './axo';

/* ════════════════════════════════════════════════════════════
   L'EXPORT — le schéma de l'atelier, dessiné comme une planche.

   Ce que le visiteur compose à l'écran en trois dimensions, il doit pouvoir
   l'emporter. On ne fait pas une capture d'écran du WebGL : on reprojette la
   même géométrie avec le moteur des livrets, à l'angle canonique. Le fichier
   qui sort est un vrai dessin vectoriel, à la bonne échelle, avec les trois
   indigos de la charte — imprimable, et lisible par un banquier comme par un
   prestataire.

   La police est embarquée en base64 dans le fichier : sans elle, le SVG
   ouvert ailleurs retomberait sur une police système, et le PNG rendu à
   partir de ce SVG aussi (une image ne charge aucune ressource externe).
   ════════════════════════════════════════════════════════════ */

const TOP = '#5B4BE6';
const DROITE = '#1C0CB3';
const GAUCHE = '#130982';
const TRAIT = '#130982';
const CREME = '#F0EEE8';
const ENCRE = '#0E0B1F';

const ech = (v) => Number(v).toFixed(2);

/* Une fois chargée, la police reste en mémoire : on ne la relit pas à chaque
   export. Si la lecture échoue, on continue sans — un dessin sans la bonne
   police vaut mieux qu'un bouton qui ne fait rien. */
let policePromesse = null;
export function chargerPolice(base = '') {
  if (!policePromesse) {
    policePromesse = fetch(`${base}fonts/NeueEinstellung-Regular.woff`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('police'))))
      .then((buf) => {
        let s = '';
        const o = new Uint8Array(buf);
        for (let i = 0; i < o.length; i++) s += String.fromCharCode(o[i]);
        return btoa(s);
      })
      .catch(() => null);
  }
  return policePromesse;
}

function echapper(t) {
  return String(t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/* Le dessin complet. `blocs` et `liens` sont ceux de l'atelier, en
   coordonnées de monde ; le reste n'est que mise en page. */
export function svgSchema({ blocs, liens, sol, titre, note, police }) {
  const cx = sol.W / 2;
  const cy = sol.D / 2;
  const theta = 0;

  const volumes = blocs
    .map((bl) => ({
      bl,
      v: projeterPave(pave(bl.x, bl.y, bl.w, bl.d, 0, bl.h, bl.etat === 'creux'), theta, cx, cy),
    }))
    .sort((a, b) => a.v.prof - b.v.prof);

  const quadrillage = projeterSol(sol.W, sol.D, sol.pas, theta, cx, cy);

  /* L'emprise réelle du dessin, pour que le cadre colle au contenu quelle
     que soit la hauteur des blocs posés. */
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const manger = (x, y) => {
    if (x < x0) x0 = x; if (x > x1) x1 = x;
    if (y < y0) y0 = y; if (y > y1) y1 = y;
  };
  quadrillage.lignes.forEach((l) => { manger(l.x1, l.y1); manger(l.x2, l.y2); });
  volumes.forEach(({ v }) => {
    const pts = v.faces
      ? v.faces.flatMap((f) => f.d.split(' ').map((q) => q.split(',').map(Number)))
      : v.lignes.flatMap((l) => [[l.x1, l.y1], [l.x2, l.y2]]);
    pts.forEach(([x, y]) => manger(x, y));
  });

  const centreDe = (bl) => {
    const [rx, ry] = tourner(bl.x + bl.w / 2, bl.y + bl.d / 2, theta, cx, cy);
    return PR(rx, ry, bl.h);
  };

  /* Les étiquettes : le nom au-dessus du bloc, au bout d'une tige. Un simple
     décalage alterné ne suffisait pas — deux blocs proches en profondeur
     écrivaient l'un sur l'autre. On pose donc chaque nom au plus près de son
     volume, et on le remonte d'un cran tant qu'il mord sur un nom déjà posé.
     0,58 par caractère est la largeur moyenne de la police à ce corps. */
  const poses = [];
  const etiquettes = volumes.map(({ bl }) => {
    const [px, py] = centreDe(bl);
    const demi = (String(bl.nom).length * 0.58) / 2 + 0.4;
    let haut = py - 1.5;
    for (let garde = 0; garde < 14; garde++) {
      const heurte = poses.some((q) => (
        Math.abs(q.haut - haut) < 1.5 && Math.abs(q.px - px) < q.demi + demi
      ));
      if (!heurte) break;
      haut -= 1.55;
    }
    poses.push({ px, haut, demi });
    manger(px - demi, haut - 1.1);
    manger(px + demi, haut + 0.4);
    return { bl, px, py, haut };
  });

  const parId = Object.fromEntries(blocs.map((bl) => [bl.id, bl]));
  const traits = liens.map((l) => {
    const a = parId[l.de];
    const c = parId[l.vers];
    if (!a || !c) return null;
    const [ax, ay] = centreDe(a);
    const [bx, by] = centreDe(c);
    return { ax, ay, bx, by };
  }).filter(Boolean);

  const m = 6;
  const bas = titre ? 7 : 3;
  const vb = [x0 - m, y0 - m - 4, (x1 - x0) + m * 2, (y1 - y0) + m * 2 + 4 + bas];
  const larg = 1400;
  const haut = Math.round((larg * vb[3]) / vb[2]);

  const face = (f) => (f.cls === 'axo-t' ? TOP : f.cls === 'axo-r' ? DROITE : GAUCHE);

  const corps = volumes.map(({ v }) => {
    if (v.lignes) {
      return `<g stroke="${DROITE}" stroke-width="0.14" fill="none" stroke-linecap="round">`
        + v.lignes.map((l) => `<line x1="${ech(l.x1)}" y1="${ech(l.y1)}" x2="${ech(l.x2)}" y2="${ech(l.y2)}"/>`).join('')
        + '</g>';
    }
    return `<g stroke="${TRAIT}" stroke-width="0.1" stroke-linejoin="round">`
      + v.faces.map((f) => `<polygon points="${f.d}" fill="${face(f)}"/>`).join('')
      + '</g>';
  }).join('');

  /* Les liaisons passent au-dessus des volumes ET du fond : un trait d'une
     seule couleur disparaissait sur l'un ou sur l'autre. On le double d'une
     gaine crème, comme un câble gainé. */
  const fils = traits.map((t) => {
    const seg = `x1="${ech(t.ax)}" y1="${ech(t.ay)}" x2="${ech(t.bx)}" y2="${ech(t.by)}"`;
    return `<line ${seg} stroke="${CREME}" stroke-width="0.62" stroke-linecap="round"/>`
      + `<line ${seg} stroke="${DROITE}" stroke-width="0.28" stroke-linecap="round"/>`
      + `<circle cx="${ech(t.ax)}" cy="${ech(t.ay)}" r="0.42" fill="${CREME}" stroke="${DROITE}" stroke-width="0.14"/>`
      + `<circle cx="${ech(t.bx)}" cy="${ech(t.by)}" r="0.42" fill="${CREME}" stroke="${DROITE}" stroke-width="0.14"/>`;
  }).join('');

  /* Le nom est posé sur une pastille crème, comme à l'écran : l'encre sur
     une face indigo ne se lisait pas, et un nom qu'on ne lit pas ne sert à
     rien sur un plan qu'on imprime. */
  const mots = etiquettes.map(({ bl, px, py, haut: hy }) => {
    const larg = String(bl.nom).length * 0.58 + 0.9;
    return `<line x1="${ech(px)}" y1="${ech(py)}" x2="${ech(hy + 0.4 < py ? px : px)}" y2="${ech(hy + 0.4)}" stroke="${DROITE}" stroke-width="0.08" opacity="0.5"/>`
      + `<rect x="${ech(px - larg / 2)}" y="${ech(hy - 1.05)}" width="${ech(larg)}" height="1.5" rx="0.75" `
      + `fill="${CREME}" stroke="${DROITE}" stroke-width="0.06" stroke-opacity="0.35"/>`
      + `<text x="${ech(px)}" y="${ech(hy)}" text-anchor="middle" font-size="1.1" fill="${ENCRE}">${echapper(bl.nom)}</text>`;
  }).join('');

  const fonte = police
    ? `@font-face{font-family:'Neue Einstellung';src:url(data:font/woff;base64,${police}) format('woff');font-weight:400;}`
    : '';

  const pied = titre
    ? `<text x="${ech(vb[0] + 1.5)}" y="${ech(vb[1] + vb[3] - 2.4)}" font-size="1.5" fill="${ENCRE}">${echapper(titre)}</text>`
      + (note ? `<text x="${ech(vb[0] + 1.5)}" y="${ech(vb[1] + vb[3] - 0.6)}" font-size="1.05" fill="#6E6A61">${echapper(note)}</text>` : '')
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${larg}" height="${haut}" `
    + `viewBox="${ech(vb[0])} ${ech(vb[1])} ${ech(vb[2])} ${ech(vb[3])}">`
    + `<style>${fonte}text{font-family:'Neue Einstellung',system-ui,-apple-system,'Segoe UI',sans-serif;}</style>`
    + `<rect x="${ech(vb[0])}" y="${ech(vb[1])}" width="${ech(vb[2])}" height="${ech(vb[3])}" fill="${CREME}"/>`
    + `<g stroke="${DROITE}" stroke-width="0.06" opacity="0.28">`
    + quadrillage.lignes.map((l) => `<line x1="${ech(l.x1)}" y1="${ech(l.y1)}" x2="${ech(l.x2)}" y2="${ech(l.y2)}"/>`).join('')
    + `</g>`
    + corps
    + fils
    + mots
    + pied
    + `</svg>`;
}

/* Le même dessin en PNG. On passe par le SVG plutôt que par une capture du
   WebGL : la capture aurait rendu les étiquettes en HTML par-dessus, donc
   invisibles, et une image d'écran ne s'imprime pas. */
export function svgVersPng(svg, echelle = 2) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const m = svg.match(/width="(\d+)" height="(\d+)"/);
    const w = m ? +m[1] : 1400;
    const h = m ? +m[2] : 900;
    img.onload = () => {
      const cv = document.createElement('canvas');
      cv.width = w * echelle;
      cv.height = h * echelle;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = CREME;
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, 0, 0, cv.width, cv.height);
      cv.toBlob((b) => (b ? resolve(b) : reject(new Error('png'))), 'image/png');
    };
    img.onerror = () => reject(new Error('svg'));
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export function telecharger(nom, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
