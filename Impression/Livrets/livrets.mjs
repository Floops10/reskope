/* ════════════════════════════════════════════════════════════
   LES LIVRETS RESKOPE : un livret complet (20 pages) et un livret de
   8 pages par espace (en projet, 1 à 10 personnes, 10 à 250 personnes).

   Même mise en page que la version de septembre (A4, crème, bande basse
   sable, cadres à nœuds, volumes en axonométrie, séparateurs indigo),
   mise à jour avec l'offre du site : les trois espaces, leurs missions,
   leurs couleurs d'explication (soleil, menthe, ciel, corail, lilas) et
   les deux polices maison, Reskope Sans et Reskope Network.

   Le contenu vient d'abord des données du site (src/data, tech/src/data) :
   quand une offre change sur le site, on relance ce script.

   Règles de dessin (mémoire du projet, sept versions refusées avant celle
   de septembre) :
   · le réseau porte une donnée, jamais la décoration ;
   · des phrases courtes avec un verbe, pas de style nominal martelé ;
   · rien ne se superpose : un libellé ne tombe jamais sur un volume ;
   · de vraies axonométries, X = (x − y)·cos30, Y = (x + y)·sin30 − z,
     trois faces dans les trois indigos, triées de l'arrière vers l'avant ;
   · libellé au-dessus du sommet arrière pour un objet du fond, sous
     l'arête avant pour un objet de devant ;
   · les couleurs d'explication servent à distinguer, jamais à décorer
     un titre.

   Lancer :  node Impression/Livrets/livrets.mjs [filtre]
   Sorties : Impression/Livrets/*.pdf (et les pages HTML dans html/)
   ════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, tmpdir } from 'node:os';
import { OFFRE, POLES, PRIX, DEBUT } from '../../src/data/offres.js';
import { ESPACES } from '../../src/data/espaces.js';
import { DUO } from '../../src/data/duo.js';
import { EXEMPLES, CATEGORIES } from '../../src/data/livrables.js';
import { OFFERS_TPE, PREUVES_TPE, JALONS_TPE, HOME_TPE } from '../../tech/src/data/profils.js';
import { OFFERS } from '../../tech/src/data/site.js';

const ICI = dirname(fileURLToPath(import.meta.url));
const DEPOT = resolve(ICI, '..', '..');
const HTML = join(ICI, 'html');
const CHROME = join(homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell');

/* ── Coordonnées imprimées ─────────────────────────────────── */
const CONTACT = {
  tel: '06 20 23 55 20',
  mail: 'florian.bouchart@hotmail.fr',
  site: 'reskope.fr',
  rdv: 'cal.com/florian-bouchart',
  siret: 'SIRET 939 285 003 00017',
  lieux: 'Valenciennes et Lille · Hauts-de-France',
  legal: 'Reskope : Florian Bouchart, entrepreneur individuel · SIRET 939 285 003 00017 · TVA non applicable, art. 293 B du CGI',
};

/* ── Couleurs de la charte ─────────────────────────────────── */
const C = {
  indigo: '#1C0CB3', vif: '#5B4BE6', nuit: '#130982', lilas: '#8B7FF0',
  creme: '#F0EEE8', sable: '#E6E2D8', encre: '#0E0B1F', gris: '#5C5951',
  trame: '#D3CEEA', papier: '#E4E0EE', fond: '#2D1EC6',
  soleil: '#F2A93B', menthe: '#2FAE8E', ciel: '#3B9DE8', corail: '#EF6F5E',
};
const ACCENT = { creation: C.soleil, tpe: C.menthe, pme: C.ciel };
const CAT = Object.fromEntries(Object.entries(CATEGORIES).map(([k, v]) => [k, { nom: v.nom, c: C[v.couleur] }]));

/* ── Typographie ───────────────────────────────────────────── */
const PT = 0.3528; // millimètres par point
const COS = Math.cos(Math.PI / 6);
const f2 = (v) => String(Math.round(v * 100) / 100);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/* espaces fines insécables à la française, et entre les milliers */
const typo = (s) => esc(s)
  .replace(/ ([:;?!»%€])/g, ' $1')
  .replace(/« /g, '« ')
  .replace(/(\d) (?=\d{3}\b)/g, '$1 ');
/* mini-balisage : **gras**, {{indigo}} */
const md = (s) => typo(s)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\{\{(.+?)\}\}/g, '<span class="c">$1</span>');
const couper = (t, max) => {
  const mots = t.split(' '), lignes = [];
  let l = '';
  for (const m of mots) {
    if (l && (l + ' ' + m).length > max) { lignes.push(l); l = m; } else l = l ? l + ' ' + m : m;
  }
  if (l) lignes.push(l);
  return lignes;
};
const txt = (s) => { const t = String(s).trim(); return t.endsWith('.') ? t.slice(0, -1) : t; };

/* ════════════════════════════════════════════════════════════
   LA TOILE : un dessin SVG à l'échelle 1:1 en millimètres.
   Les épaisseurs et les corps de texte sont donc réels à l'impression.
   ════════════════════════════════════════════════════════════ */
const pts = (P) => P.map((p) => `${f2(p[0])},${f2(p[1])}`).join(' ');

class Toile {
  constructor(s = 1, { halo = C.creme } = {}) {
    this.s = s; this.halo = halo; this.el = [];
    this.b = [Infinity, Infinity, -Infinity, -Infinity];
  }
  iso(x, y, z = 0) { return [(x - y) * COS * this.s, ((x + y) * 0.5 - z) * this.s]; }
  _b(x, y) {
    const b = this.b;
    if (x < b[0]) b[0] = x;
    if (y < b[1]) b[1] = y;
    if (x > b[2]) b[2] = x;
    if (y > b[3]) b[3] = y;
  }
  brut(s, P = []) { this.el.push(s); for (const [x, y] of P) this._b(x, y); return this; }
  poly(P, attrs) { return this.brut(`<polygon points="${pts(P)}" ${attrs}/>`, P); }
  trait(a, b, { c = C.vif, ep = 0.3, tirets = null, op = null } = {}) {
    return this.brut(`<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${c}" stroke-width="${f2(ep)}" stroke-linecap="round"${tirets ? ` stroke-dasharray="${tirets}"` : ''}${op != null ? ` stroke-opacity="${op}"` : ''}/>`, [a, b]);
  }
  chemin(P, { c = C.indigo, ep = 0.4, tirets = null } = {}) {
    return this.brut(`<polyline points="${pts(P)}" fill="none" stroke="${c}" stroke-width="${f2(ep)}" stroke-linecap="round" stroke-linejoin="round"${tirets ? ` stroke-dasharray="${tirets}"` : ''}/>`, P);
  }
  rond([x, y], r, c, { contour = null, ep = 0.3, op = null } = {}) {
    this._b(x - r, y - r); this._b(x + r, y + r);
    const trait = contour ? ` stroke="${contour}" stroke-width="${f2(ep)}"` : '';
    return this.brut(`<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${c}"${trait}${op != null ? ` fill-opacity="${op}"` : ''}/>`);
  }
  /* un libellé ; `lignes` peut être un tableau. y = ligne de base de la première ligne. */
  texte([x, y], lignes, { pt = 6.4, poids = 600, c = C.encre, ancre = 'start', ls = 0, maj = false, lh = 1.24, halo = true } = {}) {
    const L = (Array.isArray(lignes) ? lignes : [lignes]).map((l) => (maj ? l.toUpperCase() : l));
    const fs = pt * PT;
    const n = Math.max(...L.map((l) => l.length));
    const larg = n * fs * (maj ? 0.66 : 0.53) + n * ls * fs;
    const x0 = ancre === 'start' ? x : ancre === 'end' ? x - larg : x - larg / 2;
    this._b(x0, y - fs * 0.78);
    this._b(x0 + larg, y + (L.length - 1) * fs * lh + fs * 0.24);
    const h = halo && this.halo ? ` stroke="${this.halo}" stroke-width="${f2(fs * 0.34)}" stroke-linejoin="round" paint-order="stroke"` : '';
    const tsp = L.map((l, i) => `<tspan x="${f2(x)}" dy="${i ? f2(fs * lh) : 0}">${typo(l)}</tspan>`).join('');
    return this.brut(`<text x="${f2(x)}" y="${f2(y)}" font-size="${f2(fs)}" font-weight="${poids}" fill="${c}" text-anchor="${ancre}"${ls ? ` letter-spacing="${f2(ls * fs)}"` : ''}${h}>${tsp}</text>`);
  }
  /* un volume : trois faces pleines, ou le fil de fer des arêtes vues */
  bloc(x, y, z, w, d, h, { creux = false, c = C.vif, ep = 0.26, faces = null } = {}) {
    const P = (a, b, cc) => this.iso(a, b, cc);
    const H = z + h;
    const dessus = [P(x, y, H), P(x + w, y, H), P(x + w, y + d, H), P(x, y + d, H)];
    if (creux) {
      this.poly(dessus, `fill="none" stroke="${c}" stroke-width="${f2(ep)}" stroke-linejoin="round"`);
      for (const [a, b] of [[x, y + d], [x + w, y + d], [x + w, y]]) this.trait(P(a, b, z), P(a, b, H), { c, ep });
      this.trait(P(x, y + d, z), P(x + w, y + d, z), { c, ep });
      this.trait(P(x + w, y + d, z), P(x + w, y, z), { c, ep });
      return this;
    }
    const droite = [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, H), P(x + w, y, H)];
    const gauche = [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, H), P(x, y + d, H)];
    const [cd, cr, cg] = faces || [C.vif, C.indigo, C.nuit];
    this.poly(gauche, `fill="${cg}" stroke="${cg}" stroke-width="0.06" stroke-linejoin="round"`);
    this.poly(droite, `fill="${cr}" stroke="${cr}" stroke-width="0.06" stroke-linejoin="round"`);
    this.poly(dessus, `fill="${cd}" stroke="${cd}" stroke-width="0.06" stroke-linejoin="round"`);
    return this;
  }
  /* un plan quadrillé, la référence de toute axonométrie */
  plan(x0, y0, w, d, pas, { z = 0, fond = null, op = null, ep = 0.15, bord = 0.3, grille = true } = {}) {
    const P = (a, b) => this.iso(a, b, z);
    const coins = [P(x0, y0), P(x0 + w, y0), P(x0 + w, y0 + d), P(x0, y0 + d)];
    if (fond) this.poly(coins, `fill="${fond}" stroke="none"${op != null ? ` fill-opacity="${op}"` : ''}`);
    if (grille) {
      for (let x = x0 + pas; x < x0 + w - 0.01; x += pas) this.trait(P(x, y0), P(x, y0 + d), { c: C.trame, ep });
      for (let y = y0 + pas; y < y0 + d - 0.01; y += pas) this.trait(P(x0, y), P(x0 + w, y), { c: C.trame, ep });
    }
    return this.poly(coins, `fill="none" stroke="${C.lilas}" stroke-width="${f2(bord)}" stroke-linejoin="round"`);
  }
  svg(pad = 1.2) {
    const [x0, y0, x1, y1] = this.b;
    const X = x0 - pad, Y = y0 - pad, W = x1 - x0 + 2 * pad, H = y1 - y0 + 2 * pad;
    return { w: W, h: H, html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f2(X)} ${f2(Y)} ${f2(W)} ${f2(H)}" width="${f2(W)}mm" height="${f2(H)}mm" style="display:block;overflow:visible">${this.el.join('')}</svg>` };
  }
}

/* Pose un dessin dans une boîte de la page (en mm), centré par défaut. */
function poser(d, x, y, w, h, { h: ah = 'c', v = 'm', nom = '' } = {}) {
  if (d.w > w + 0.5 || d.h > h + 0.5) console.warn(`  ⚠ dessin ${nom} trop grand : ${f2(d.w)}×${f2(d.h)} pour ${w}×${h}`);
  const jc = { g: 'flex-start', c: 'center', d: 'flex-end' }[ah];
  const ai = { h: 'flex-start', m: 'center', b: 'flex-end' }[v];
  return `<div class="a" style="left:${x}mm;top:${y}mm;width:${w}mm;height:${h}mm;display:flex;justify-content:${jc};align-items:${ai}">${d.html}</div>`;
}

/* ════════════════════════════════════════════════════════════
   LE LOGO (fichiers officiels de scripts/logo.py, jamais redessiné)
   ════════════════════════════════════════════════════════════ */
function svgLogo(fichier, hauteurMm, style = '') {
  let s = readFileSync(join(DEPOT, 'logo', fichier), 'utf8');
  s = s.replace(/<\?xml[^>]*>/, '').replace(/<!--[\s\S]*?-->/g, '').replace(/<title>[^<]*<\/title>/, '').trim();
  const vb = s.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
  const w = (hauteurMm * vb[2]) / vb[3];
  return s.replace(/width="[^"]*"/, `width="${f2(w)}mm"`).replace(/height="[^"]*"/, `height="${f2(hauteurMm)}mm" style="display:block;${style}"`).replace(/role="img" aria-label="Reskope"/, 'aria-hidden="true"');
}
const logo = (clair) => svgLogo(`reskope-logo-${clair ? 'creme' : 'indigo'}.svg`, 7.2);
const marque = (clair, h, style = '') => svgLogo(`reskope-marque-${clair ? 'creme' : 'indigo'}.svg`, h, style);

/* ════════════════════════════════════════════════════════════
   STYLES
   ════════════════════════════════════════════════════════════ */
const polices = [['Light', 300], ['Regular', 400], ['Medium', 500], ['SemiBold', 600], ['Bold', 700]]
  .map(([n, w]) => `@font-face{font-family:'Reskope Sans';src:url('file://${DEPOT}/public/fonts/ReskopeSans-${n}.woff2') format('woff2');font-weight:${w};}`).join('')
  + `@font-face{font-family:'Reskope Network';src:url('file://${DEPOT}/public/fonts/Reskope-Network.woff2') format('woff2');}`;

const CSS = `${polices}
@page{size:210mm 297mm;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:${C.creme}}
body{font-family:'Reskope Sans',sans-serif;color:${C.encre};-webkit-print-color-adjust:exact;print-color-adjust:exact;font-kerning:normal}
.page{position:relative;width:210mm;height:297mm;overflow:hidden;background:${C.creme};break-after:page}
.page:last-child{break-after:auto}
.page.indigo{background:${C.indigo};color:${C.creme}}
.a{position:absolute}
.bande{position:absolute;left:0;right:0;bottom:0;background:${C.sable}}
.rubrique{position:absolute;right:20mm;top:20.4mm;font-size:6.3pt;letter-spacing:.24em;text-transform:uppercase;color:${C.vif};font-weight:500}
.indigo .rubrique{color:rgba(240,238,232,.72)}
.titre{font-size:22pt;line-height:1.1;font-weight:600;letter-spacing:-.014em;color:${C.encre}}
.intro{font-size:8.8pt;line-height:1.72;color:${C.gris}}
.lead{font-size:10.2pt;line-height:1.62;color:${C.gris}}
.lab{font-size:6.2pt;letter-spacing:.22em;text-transform:uppercase;color:${C.vif};font-weight:500;display:flex;align-items:center;gap:2.6mm;white-space:nowrap;line-height:1.2}
.chip{background:${C.vif};color:#fff;border-radius:.8mm;padding:.75mm 1.8mm .6mm;font-size:5.3pt;letter-spacing:.16em}
.h3{font-size:9.6pt;font-weight:600;color:${C.indigo};line-height:1.3;margin-bottom:2mm}
.h2{font-size:11pt;font-weight:600;color:${C.encre};line-height:1.25}
.corps{font-size:8.3pt;line-height:1.68;color:${C.gris}}
.corps b,.lead b,.intro b,.note b{color:${C.encre};font-weight:600}
.faits{font-size:8pt;line-height:1.6;color:${C.indigo}}
.src{font-size:6.1pt;line-height:1.5;color:${C.gris}}
.note{font-size:7pt;line-height:1.6;color:${C.gris}}
.chiffre{font-size:23pt;font-weight:600;color:${C.indigo};letter-spacing:-.02em;line-height:1;white-space:nowrap}
.chiffre.grand{font-size:29pt}
.leg{font-size:7.7pt;line-height:1.5;color:${C.gris};margin-top:2.2mm}
.etude{font-size:5.7pt;letter-spacing:.2em;text-transform:uppercase;color:${C.vif};margin-top:2.4mm}
.c{color:${C.indigo}}
ul.puces{list-style:none}
ul.puces li{position:relative;padding-left:7.6mm;font-size:9.1pt;line-height:1.45;color:${C.encre}}
ul.puces li+li{margin-top:4.3mm}
ul.puces li::before{content:'';position:absolute;left:0;top:1.3mm;width:2.2mm;height:2.2mm;border-radius:50%;background:var(--p,${C.indigo})}
ul.fines li{font-size:8pt;line-height:1.62;color:${C.gris};padding-left:6.6mm}
ul.fines li::before{top:1.2mm;width:2mm;height:2mm}
ul.fines li b{color:${C.encre};font-weight:600}
ul.fines li+li{margin-top:3.4mm}
.pied{position:absolute;left:20mm;right:20mm;bottom:10.5mm;display:flex;justify-content:space-between;align-items:center;font-size:6.2pt;color:${C.gris};letter-spacing:.02em}
.pied .g{display:flex;align-items:center;gap:2.2mm}
.pied .m{position:absolute;left:50%;transform:translateX(-50%);letter-spacing:.12em}
.indigo .pied{color:rgba(240,238,232,.62)}
.som .l{display:flex;justify-content:space-between;align-items:baseline;gap:4mm;padding:2.3mm 0 2.1mm;border-bottom:.2mm solid rgba(28,12,179,.16);font-size:8.5pt;font-weight:500;color:${C.encre}}
.som .l span:last-child{color:${C.indigo};font-weight:600;font-size:7.4pt;letter-spacing:.06em}
.cols{position:absolute;display:grid}
`;

/* ════════════════════════════════════════════════════════════
   BRIQUES DE PAGE
   ════════════════════════════════════════════════════════════ */
const A = (x, y, w, html, cls = '', style = '') => `<div class="a ${cls}" style="left:${x}mm;top:${y}mm;width:${w}mm;${style}">${html}</div>`;
const pied = (folio, clair) => `<div class="pied"><span class="g">${marque(clair, 3.4)}${typo(CONTACT.siret)}</span>${folio ? `<span class="m">${folio}</span>` : ''}<span>${CONTACT.tel}</span></div>`;

function page({ rubrique = '', contenu, folio = '', indigo = false, bande = 0, fond = '' }) {
  return `
<section class="page${indigo ? ' indigo' : ''}">
  ${fond}
  ${bande ? `<div class="bande" style="height:${bande}mm"></div>` : ''}
  <div class="a" style="left:20mm;top:17.8mm">${logo(indigo)}</div>
  <div class="rubrique">${typo(rubrique)}</div>
  ${contenu}
  ${pied(folio, indigo)}
</section>`;
}
const titre = (lignes, x = 20, y = 41, w = 90, style = '') => A(x, y, w, lignes.map(typo).join('<br>'), 'titre', style);
const intro = (s, x = 122, y = 43.4, w = 68) => A(x, y, w, md(s), 'intro');
const lab = (t, exemple = false) => `<div class="lab">${typo(t)}${exemple ? '<span class="chip">EXEMPLE</span>' : ''}</div>`;
const puces = (items, { fines = false, couleur = null } = {}) =>
  `<ul class="puces${fines ? ' fines' : ''}"${couleur ? ` style="--p:${couleur}"` : ''}>${items.map((it) => {
    const [t, c] = Array.isArray(it) ? it : [it, null];
    return `<li${c ? ` style="--p:${c}"` : ''}>${md(t)}</li>`;
  }).join('')}</ul>`;
const chiffre = (valeur, legende, etude = '', { grand = false, w = 40 } = {}) =>
  `<div style="width:${w}mm"><div class="chiffre${grand ? ' grand' : ''}">${typo(valeur)}</div><div class="leg">${md(legende)}</div>${etude ? `<div class="etude">${typo(etude)}</div>` : ''}</div>`;

/* Le fil des temps : n nœuds reliés au-dessus de n colonnes. */
function fil(y, n, { x = 20, w = 170, couleur = C.indigo, trait = C.lilas } = {}) {
  const gap = n > 3 ? 5 : 7.9;
  const col = (w - gap * (n - 1)) / n;
  const cx = (i) => x + i * (col + gap) + col / 2;
  const t = new Toile(1, { halo: null });
  t.trait([cx(0), 0], [cx(n - 1), 0], { c: trait, ep: 0.3 });
  for (let i = 0; i < n; i++) t.rond([cx(i), 0], 1.45, couleur);
  const d = t.svg(0);
  return `<div class="a" style="left:${f2(cx(0) - 1.45)}mm;top:${f2(y - 1.45)}mm">${d.html}</div>`;
}
function colonnes(y, items, { x = 20, w = 170, titreCls = 'h3' } = {}) {
  const n = items.length;
  const gap = n > 3 ? 5 : 7.9;
  return `<div class="cols" style="left:${x}mm;top:${y}mm;width:${w}mm;grid-template-columns:repeat(${n},1fr);column-gap:${gap}mm">${items.map(([h, p]) => `<div><div class="${titreCls}">${typo(h)}</div><div class="corps">${md(p)}</div></div>`).join('')}</div>`;
}
const temps = (y, items, opts = {}) => fil(y, items.length, opts) + colonnes(y + 7.2, items, opts);

/* Le grand cadre : un filet fin, un nœud à chaque coin, du papier millimétré. */
function cadre(x, y, w, h, dessin, { nom = '' } = {}) {
  const t = new Toile(1, { halo: null });
  for (let gx = 4; gx < w - 0.5; gx += 4) t.trait([gx, 0], [gx, h], { c: C.papier, ep: 0.12 });
  for (let gy = 4; gy < h - 0.5; gy += 4) t.trait([0, gy], [w, gy], { c: C.papier, ep: 0.12 });
  t.poly([[0, 0], [w, 0], [w, h], [0, h]], `fill="none" stroke="${C.vif}" stroke-width="0.3"`);
  for (const p of [[0, 0], [w, 0], [0, h], [w, h]]) t.rond(p, 1.25, C.indigo);
  const fondCadre = t.svg(0);
  return `<div class="a" style="left:${f2(x - 1.25)}mm;top:${f2(y - 1.25)}mm">${fondCadre.html}</div>${poser(dessin, x + 3, y + 3, w - 6, h - 6, { nom })}`;
}

/* ════════════════════════════════════════════════════════════
   LES RÉSEAUX : la taille d'une entreprise en nœuds
   ════════════════════════════════════════════════════════════ */
/* 1 nœud : une personne et son projet. 7 : une personne et six autour.
   26 : un centre, cinq équipes, quatre personnes par équipe. */
function grappe(n, R, r) {
  const N = [{ p: [0, 0], role: 'centre' }], L = [];
  if (n === 7) {
    for (let k = 0; k < 6; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 3 + 0.18;
      const rr = R * (k % 2 ? 0.86 : 1.04);
      N.push({ p: [Math.cos(a) * rr, Math.sin(a) * rr], role: 'feuille' }); L.push([0, k + 1]);
    }
  } else if (n === 26) {
    for (let k = 0; k < 5; k++) {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5 + 0.3;
      const hub = [Math.cos(a) * R, Math.sin(a) * R];
      N.push({ p: hub, role: 'pivot' }); const ih = N.length - 1; L.push([0, ih]);
      for (const da of [-66, -22, 22, 66]) {
        const b = a + (da * Math.PI) / 180;
        N.push({ p: [hub[0] + Math.cos(b) * r, hub[1] + Math.sin(b) * r], role: 'feuille' }); L.push([ih, N.length - 1]);
      }
    }
  }
  return { N, L };
}
function dessinerGrappe(t, g, [cx, cy], { couleur, lien, ep = 0.32, rc = 2.1, rp = 1.5, rf = 1.2, centre = null } = {}) {
  for (const [a, b] of g.L) t.trait([cx + g.N[a].p[0], cy + g.N[a].p[1]], [cx + g.N[b].p[0], cy + g.N[b].p[1]], { c: lien, ep });
  for (const n of g.N) {
    const r = n.role === 'centre' ? rc : n.role === 'pivot' ? rp : rf;
    t.rond([cx + n.p[0], cy + n.p[1]], r, n.role === 'centre' && centre ? centre : couleur);
  }
}
const GRAPPES = { creation: grappe(1), tpe: grappe(7, 1, 0), pme: grappe(26, 1, 0.56) };
const echelle = (g, R) => ({ N: g.N.map((n) => ({ ...n, p: [n.p[0] * R, n.p[1] * R] })), L: g.L });

/* Le réseau de fond des pages indigo : discret, jamais sous un texte. */
function reseauFond(noeuds, liens) {
  const t = new Toile(1, { halo: null });
  for (const [a, b] of liens) t.trait(noeuds[a], noeuds[b], { c: C.fond, ep: 0.45 });
  for (const p of noeuds) t.rond(p, 1.9, C.fond);
  return `<svg class="a" style="left:0;top:0" width="210mm" height="297mm" viewBox="0 0 210 297">${t.el.join('')}</svg>`;
}

/* ════════════════════════════════════════════════════════════
   LES PLANTES : la vie d'un projet, de la graine à la forêt
   ════════════════════════════════════════════════════════════ */
function plante(t, [x, y], stade, couleur, k = 1) {
  const ep = 0.42 * Math.min(1.25, Math.max(0.8, k));
  const noeud = (p, r) => t.rond(p, r * k, couleur);
  const branche = (p, long, angle, prof) => {
    const q = [p[0] + Math.sin(angle) * long * k, p[1] - Math.cos(angle) * long * k];
    t.trait(p, q, { c: couleur, ep });
    if (prof > 0) {
      branche(q, long * 0.66, angle - 0.52, prof - 1);
      branche(q, long * 0.66, angle + 0.52, prof - 1);
      noeud(q, 1.05);
    } else noeud(q, 1.25);
  };
  if (stade === 0) { noeud([x, y - 1.6 * k], 1.7); return; }
  const tronc = (base, h, prof, long) => {
    const haut = [base[0], base[1] - h * k];
    t.trait(base, haut, { c: couleur, ep });
    noeud(haut, 1.05);
    branche(haut, long, -0.5, prof - 1);
    branche(haut, long, 0.5, prof - 1);
  };
  if (stade === 1) tronc([x, y], 5, 1, 5);
  if (stade === 2) tronc([x, y], 6.5, 2, 6);
  if (stade === 3) tronc([x, y], 8.5, 3, 7);
  if (stade === 4) {
    tronc([x - 6.5 * k, y + 1.2 * k], 5.5, 2, 5.2);
    tronc([x + 6.5 * k, y + 1.2 * k], 5, 2, 4.8);
    tronc([x, y - 0.4 * k], 8, 3, 6.4);
  }
}
const STADES = [
  { nom: 'La graine', sous: 'Avant de créer', c: C.soleil },
  { nom: 'La pousse', sous: 'Vous créez', c: C.soleil },
  { nom: 'La floraison', sous: '1 à 10 personnes', c: C.menthe },
  { nom: 'L’arbre', sous: '10 à 250 personnes', c: C.ciel },
  { nom: 'La forêt', sous: 'Au-delà', c: C.indigo },
];
function iconePlante(stade, { k = 1, clair = false } = {}) {
  const t = new Toile(k, { halo: null });
  t.bloc(0, 0, 0, 10, 10, 1.6, { faces: clair ? ['#4232D6', '#2E1FC4', '#2214AC'] : null });
  const sommet = t.iso(5, 5, 1.6);
  const couleur = clair ? [C.soleil, C.soleil, C.menthe, C.ciel, C.creme][stade] : STADES[stade].c;
  plante(t, sommet, stade, couleur, k * 1.05);
  return t.svg(0.6);
}

/* ════════════════════════════════════════════════════════════
   LES DESSINS DE CHAQUE PAGE
   ════════════════════════════════════════════════════════════ */

/* Métier 1 : dix à douze entretiens autour de votre projet. */
function dessinEntretiens() {
  const t = new Toile(0.62);
  t.plan(0, 0, 44, 44, 11);
  const c = [22, 22];
  const autour = [];
  for (let k = 0; k < 12; k++) {
    const a = (k * Math.PI * 2) / 12 + 0.26;
    autour.push([c[0] + Math.cos(a) * 17, c[1] + Math.sin(a) * 17]);
  }
  for (const p of autour) t.trait(t.iso(p[0], p[1]), t.iso(c[0], c[1]), { c: C.lilas, ep: 0.28 });
  t.bloc(18, 18, 0, 8, 8, 12);
  for (const p of autour) t.rond(t.iso(p[0], p[1]), 1.15, C.indigo);
  return t.svg();
}
/* Métier 2 : les chapitres du business plan, votre client à la base. */
function dessinChapitres() {
  const t = new Toile(0.62);
  t.plan(0, 0, 40, 40, 10);
  for (let i = 0; i < 6; i++) t.bloc(9, 9, i * 4.4, 22, 22, 3.4, i === 0 ? {} : { faces: ['#8578EE', '#5546DA', '#3E30C0'] });
  const a = t.iso(31, 31, 0);
  t.texte([a[0], a[1] + 6.4], 'Votre client', { pt: 6, ancre: 'middle' });
  return t.svg();
}
/* Métier 3 : de petites étapes, testées une par une. */
function dessinEtapes() {
  const t = new Toile(0.62);
  t.plan(0, 0, 58, 26, 8);
  [4, 8, 12, 16].forEach((hh, i) => t.bloc(3 + i * 11, 7, 0, 9, 12, hh));
  t.bloc(3 + 4 * 11, 7, 0, 9, 12, 20, { creux: true, c: C.vif });
  return t.svg();
}

/* La bonne fée : votre projet, vous dessus, nous à côté. */
function dessinPosture() {
  const t = new Toile(0.95);
  t.plan(0, 0, 80, 80, 10);
  t.bloc(26, 26, 0, 28, 28, 28);
  const vous = t.iso(40, 40, 28), nous = t.iso(84, 22, 28), sol = t.iso(84, 22, 0);
  t.trait(nous, sol, { c: C.lilas, ep: 0.3, tirets: '1.2 1.2' });
  t.rond(sol, 0.9, C.lilas);
  t.trait(vous, nous, { c: C.indigo, ep: 0.5 });
  t.rond(vous, 2.3, C.indigo); t.rond(nous, 2.3, C.indigo);
  const arriere = t.iso(26, 26, 28);
  t.texte([arriere[0], arriere[1] - 3.2], 'Vous', { pt: 7, ancre: 'middle' });
  t.texte([nous[0] + 4, nous[1] + 1.2], 'Nous', { pt: 7 });
  const g = t.iso(26, 54, 20);
  t.texte([g[0] - 3.5, g[1]], 'Votre projet', { pt: 7, ancre: 'end' });
  return t.svg();
}

/* La vie d'un projet : cinq plateaux en rang, une plante par étape. */
function dessinVie() {
  const t = new Toile(1.1);
  STADES.forEach((st, i) => {
    const x = i * 17, y = -i * 17;
    t.bloc(x, y, 0, 12, 12, 2.2);
    const sommet = t.iso(x + 6, y + 6, 2.2);
    plante(t, sommet, i, st.c, 1.28);
    const haut = [8, 16, 23, 31, 31][i];
    t.texte([sommet[0], sommet[1] - haut], st.nom, { pt: 7, ancre: 'middle' });
    const avant = t.iso(x + 12, y + 12, 0);
    t.texte([avant[0], avant[1] + 5.2], st.sous, { pt: 5.3, poids: 500, c: C.gris, ancre: 'middle', maj: true, ls: 0.14 });
  });
  return t.svg();
}

/* Le portrait du client idéal : les nœuds sont ses traits, la couleur dit lequel. */
function dessinPortrait(ex) {
  const t = new Toile(0.74);
  t.plan(0, 0, 60, 60, 10);
  const place = [
    { p: [26, 2], cote: 'd' }, { p: [2, 26], cote: 'g' }, { p: [22, 54], cote: 'g' },
    { p: [52, 20], cote: 'd' }, { p: [58, 36], cote: 'b' }, { p: [36, 58], cote: 'b' },
  ];
  const noeuds = ex.interets.slice(0, 6).map((it, i) => ({ ...place[i], t: it.t, c: CAT[it.cat].c }));
  const centre = t.iso(30, 30);
  for (const n of noeuds) t.trait(t.iso(...n.p), centre, { c: n.c, ep: 0.42 });
  t.bloc(26, 26, 0, 8, 8, 11);
  const fs = 6.2 * PT, lh = fs * 1.24;
  for (const n of noeuds) {
    const p = t.iso(...n.p);
    t.rond(p, 1.55, n.c);
    const L = couper(n.t, 13);
    if (n.cote === 'd') t.texte([p[0] + 2.8, p[1] + fs * 0.34 - ((L.length - 1) * lh) / 2], L, { pt: 6.2 });
    if (n.cote === 'g') t.texte([p[0] - 2.8, p[1] + fs * 0.34 - ((L.length - 1) * lh) / 2], L, { pt: 6.2, ancre: 'end' });
    if (n.cote === 'b') t.texte([p[0], p[1] + 4.6], L, { pt: 6.2, ancre: 'middle' });
  }
  const haut = t.iso(26, 26, 11);
  t.texte([haut[0], haut[1] - 2.6], ex.nom, { pt: 6.6, c: C.indigo, ancre: 'middle' });
  return t.svg();
}

/* Sa journée : la position d'un nœud donne l'heure. */
function dessinJournee(ex, largeur = 80, halo = C.sable) {
  const t = new Toile(1, { halo });
  const h0 = 7, h1 = 22, y = 17;
  const X = (h) => 3 + ((h - h0) / (h1 - h0)) * (largeur - 6);
  t.trait([X(h0), y], [X(h1), y], { c: C.lilas, ep: 0.32 });
  for (let h = 8; h <= 22; h += 2) t.trait([X(h), y - 0.9], [X(h), y + 0.9], { c: C.lilas, ep: 0.22 });
  ex.journee.forEach((j, i) => {
    const m = j.h.match(/(\d+)\s*h(?:\s*(\d+))?/);
    const h = Number(m[1]) + (m[2] ? Number(m[2]) / 60 : 0);
    const x = X(h), cle = j.cat === 'cle';
    t.rond([x, y], cle ? 2.3 : 1.45, CAT[j.cat].c);
    const L = couper(j.t, 13);
    const ancre = x < 12 ? 'start' : x > largeur - 12 ? 'end' : 'middle';
    const dx = ancre === 'start' ? -1.2 : ancre === 'end' ? 1.2 : 0;
    if (i % 2 === 0) {
      t.texte([x + dx, y - 4.4 - L.length * 2.45], j.h, { pt: 6.1, c: C.indigo, ancre });
      t.texte([x + dx, y - 4.4 - (L.length - 1) * 2.45], L, { pt: 5.6, poids: 500, c: C.gris, ancre, lh: 1.26 });
    } else {
      t.texte([x + dx, y + 6.2], j.h, { pt: 6.1, c: C.indigo, ancre });
      t.texte([x + dx, y + 8.9], L, { pt: 5.6, poids: 500, c: C.gris, ancre, lh: 1.26 });
    }
  });
  return t.svg(0.8);
}

/* Le prévisionnel : trois années traversées par le plan du seuil. */
function dessinPrevisionnel() {
  const ans = [{ n: 'An 1', v: 82000 }, { n: 'An 2', v: 118000 }, { n: 'An 3', v: 145000 }];
  const seuil = 104000, k = 0.00026, w = 15, pas = 19;
  const t = new Toile(0.76);
  const zS = seuil * k;
  /* sous le seuil d'abord, puis le plan translucide, puis ce qui dépasse */
  ans.forEach((a, i) => t.bloc(i * pas, 0, 0, w, w, Math.min(a.v * k, zS)));
  t.plan(-6, -6, 2 * pas + w + 12, w + 12, 100, { z: zS, fond: C.lilas, op: 0.22, grille: false, bord: 0.3 });
  ans.forEach((a, i) => { if (a.v * k > zS) t.bloc(i * pas, 0, zS, w, w, a.v * k - zS); });
  /* libellé sous l'arête avant de chaque année */
  ans.forEach((a, i) => {
    const p = t.iso(i * pas + w, w, 0);
    t.texte([p[0] + 1, p[1] + 3.6], a.n, { pt: 6.3, ancre: 'end' });
    t.texte([p[0] + 1, p[1] + 3.6 + 6.3 * PT * 1.25], `${(a.v / 1000).toFixed(0)} 000 €`, { pt: 6.2, c: C.indigo, ancre: 'end' });
  });
  const s = t.iso(2 * pas + w + 6, -6, zS);
  t.texte([s[0] + 2.2, s[1] + 0.2], ['Seuil', `${(seuil / 1000).toFixed(0)} 000 €`], { pt: 5.4, poids: 500, c: C.gris, maj: true, ls: 0.12 });
  return t.svg();
}

/* Une réservation : ce que fait le client en bas, ce qui se déclenche en haut. */
function dessinReservation() {
  const t = new Toile(0.62);
  const H = 30, W = 62, D = 36, y0 = 18;
  const xs = [10, 31, 52];
  const client = ['Il réserve', 'Il confirme', 'Il vient'];
  const outils = ['Agenda à jour', 'Rappel la veille', 'Fiche client à jour'];
  t.plan(0, 0, W, D, 12);
  xs.forEach((x) => t.trait(t.iso(x, y0, 0), t.iso(x, y0, H), { c: C.lilas, ep: 0.28, tirets: '1.1 1.1' }));
  t.plan(0, 0, W, D, 12, { z: H, fond: C.creme, op: 0.78 });
  t.chemin(xs.map((x) => t.iso(x, y0, 0)), { c: C.menthe, ep: 0.5 });
  t.chemin(xs.map((x) => t.iso(x, y0, H)), { c: C.indigo, ep: 0.5 });
  /* en bas, le libellé part vers la gauche sous le nœud ; en haut, vers la droite au-dessus */
  xs.forEach((x, i) => { const p = t.iso(x, y0, 0); t.rond(p, 1.7, C.menthe); t.texte([p[0] - 1.6, p[1] + 4.4], client[i], { pt: 6.2, ancre: 'end' }); });
  xs.forEach((x, i) => { const p = t.iso(x, y0, H); t.rond(p, 1.7, C.indigo); const L = couper(outils[i], 13); t.texte([p[0] + 1.6, p[1] - 2.6 - (L.length - 1) * 6.2 * PT * 1.24], L, { pt: 6.2 }); });
  const a = t.iso(0, D, H), b = t.iso(0, D, 0);
  t.texte([a[0] - 2.2, a[1] + 0.8], 'Vos outils', { pt: 5.3, poids: 500, c: C.gris, ancre: 'end', maj: true, ls: 0.14 });
  t.texte([b[0] - 2.2, b[1] + 0.8], 'Votre client', { pt: 5.3, poids: 500, c: C.gris, ancre: 'end', maj: true, ls: 0.14 });
  return t.svg();
}

/* En jours : le plein dit le minimum, le fil de fer le maximum. */
function dessinJours(chantiers) {
  const t = new Toile(1.05);
  const k = 4.6;
  t.plan(-4, -4, 70, 22, 7);
  chantiers.forEach((c, i) => {
    const x = i * 22;
    t.bloc(x, 1, 0, 14, 13, c.min * k);
    t.bloc(x, 1, c.min * k, 14, 13, (c.max - c.min) * k, { creux: true, c: C.vif, ep: 0.3 });
  });
  chantiers.forEach((c, i) => {
    const p = t.iso(i * 22 + 14, 1, c.max * k);
    t.texte([p[0] + 2.6, p[1] + 0.6], c.nom, { pt: 7.4 });
    t.texte([p[0] + 2.6, p[1] + 4.2], c.jours, { pt: 7, c: C.indigo });
  });
  return t.svg();
}

/* Les abonnements en volume : la hauteur dit le coût, le fil de fer ce qui dort. */
const ABOS = [
  { n: 'CRM', v: 2400, sert: 1080, x: 0, y: 0 },
  { n: 'Stockage', v: 600, sert: 240, x: 24, y: 8 },
  { n: 'Signature', v: 432, sert: 144, x: 42, y: 16 },
];
const DORT = ABOS.reduce((s, a) => s + a.v - a.sert, 0);
const euros = (v) => `${v.toLocaleString('fr-FR').replace(/\s/g, ' ')} €`;
function dessinAbonnements() {
  const t = new Toile(0.8);
  const k = 0.011;
  t.plan(-5, -5, 64, 36, 9);
  ABOS.forEach((a) => {
    t.bloc(a.x, a.y, 0, 13, 13, a.sert * k);
    t.bloc(a.x, a.y, a.sert * k, 13, 13, (a.v - a.sert) * k, { creux: true, c: C.vif, ep: 0.3 });
  });
  ABOS.forEach((a) => {
    const p = t.iso(a.x + 13, a.y, a.v * k);
    t.texte([p[0] + 2.4, p[1] + 0.2], a.n, { pt: 6.6 });
    t.texte([p[0] + 2.4, p[1] + 3.3], euros(a.v), { pt: 6.4, c: C.indigo });
  });
  return t.svg();
}

/* Une donnée, un seul endroit : avant, quatre copies ; après, une seule chaîne. */
function dessinDonnee(halo = C.sable) {
  const t = new Toile(0.74, { halo });
  t.plan(0, 0, 52, 34, 6.5);
  const outils = ['Caisse', 'Stock', 'Compta', 'Banque'];
  const av = outils.map((n, i) => t.iso(6 + i * 13, 12));
  const ap = outils.map((n, i) => t.iso(6 + i * 13, 26));
  t.chemin(av, { c: C.lilas, ep: 0.34, tirets: '1.3 1.3' });
  t.chemin(ap, { c: C.indigo, ep: 0.6 });
  av.forEach((p, i) => { t.rond(p, 1.3, C.lilas); t.texte([p[0] + 1.8, p[1] - 1.7], outils[i], { pt: 6.1 }); });
  ap.forEach((p) => t.rond(p, 1.9, C.indigo));
  const a0 = t.iso(0, 12), b0 = t.iso(0, 26);
  t.texte([a0[0] - 2.2, a0[1] + 0.8], 'Avant', { pt: 5.3, poids: 500, c: C.gris, ancre: 'end', maj: true, ls: 0.14 });
  t.texte([b0[0] - 2.2, b0[1] + 0.8], 'Après', { pt: 5.3, poids: 500, c: C.gris, ancre: 'end', maj: true, ls: 0.14 });
  return t.svg();
}

/* Le déroulé d'un audit : la taille d'un nœud dit la durée du temps. */
function dessinDeroule() {
  const t = new Toile(1.02);
  const etapes = [
    { n: 'Cadrage', r: 1.6 }, { n: 'Audit', r: 3.3 }, { n: 'Bilan', r: 2.2 },
    { n: 'Mise en ordre', r: 2.7 }, { n: 'Formation', r: 1.8 },
  ];
  t.plan(0, 0, 100, 22, 11);
  const P = etapes.map((e, i) => t.iso(10 + i * 20, 11, 13));
  const S = etapes.map((e, i) => t.iso(10 + i * 20, 11, 0));
  etapes.forEach((e, i) => { t.trait(P[i], S[i], { c: C.lilas, ep: 0.28, tirets: '1.1 1.1' }); t.rond(S[i], 0.8, C.lilas); });
  t.chemin(P, { c: C.indigo, ep: 0.55 });
  /* le chemin descend vers la droite : le libellé se pose en haut à droite du nœud */
  etapes.forEach((e, i) => {
    t.rond(P[i], e.r, C.indigo);
    t.texte([P[i][0] + e.r * 0.8 + 1.4, P[i][1] - e.r * 0.8 - 1.2], e.n, { pt: 7 });
  });
  return t.svg();
}

/* La carte de votre clientèle : la hauteur dit ce qu'un type de client pèse. */
function dessinClientele() {
  const t = new Toile(0.72);
  t.plan(0, 0, 54, 54, 9);
  /* de l'arrière vers l'avant */
  t.bloc(0, 0, 0, 10, 10, 8, { creux: true, c: C.vif });
  t.bloc(0, 34, 0, 12, 12, 13, { creux: true, c: C.vif });
  t.bloc(36, 2, 0, 12, 12, 15, { creux: true, c: C.vif });
  t.bloc(24, 24, 0, 14, 14, 26);
  const e = t.iso(0, 0, 8); t.texte([e[0], e[1] - 2.6], 'Étudiants', { pt: 6.4, ancre: 'middle' });
  const f = t.iso(12, 46, 0); t.texte([f[0], f[1] + 4.4], 'Familles', { pt: 6.4, ancre: 'middle' });
  const b = t.iso(48, 14, 0); t.texte([b[0], b[1] + 4.4], 'Bureaux', { pt: 6.4, ancre: 'middle' });
  const h = t.iso(38, 38, 0); t.texte([h[0], h[1] + 4.6], 'Habitués', { pt: 6.6, c: C.indigo, ancre: 'middle' });
  return t.svg();
}

/* Les deux cartes : sur place (le rayon sans frais), à distance (tout le reste). */
function carteNord(w, h) {
  const t = new Toile(1, { halo: C.creme });
  const k = 0.72, ox = 24, oy = 18;
  const geo = (lat, lon) => [ox + (lon - 3.06) * 70.6 * k, oy + (50.63 - lat) * 111 * k];
  const villes = [
    ['Lille', 50.63, 3.06, 'g', 1], ['Valenciennes', 50.36, 3.52, 'd', 1], ['Douai', 50.37, 3.08, 'g'], ['Arras', 50.29, 2.78, 'b'],
    ['Cambrai', 50.18, 3.23, 'b'], ['Maubeuge', 50.28, 3.97, 'b'], ['Saint-Amand', 50.45, 3.43, 'd'], ['Le Quesnoy', 50.25, 3.64, 'b'],
  ].map(([n, la, lo, o, fort]) => ({ n, p: geo(la, lo), o, fort }));
  const L = villes[0].p, V = villes[1].p, R = 60 * k;
  const c = (p, attrs) => `<circle cx="${f2(p[0])}" cy="${f2(p[1])}" r="${f2(R)}" ${attrs}/>`;
  /* la zone sans frais : l'union des deux cercles de 60 km, et son seul contour */
  t.brut(`<defs><clipPath id="nord-cadre"><rect x="0" y="0" width="${w}" height="${h}"/></clipPath>`
    + `<mask id="hors-v"><rect x="-99" y="-99" width="300" height="300" fill="#fff"/>${c(V, 'fill="#000"')}</mask>`
    + `<mask id="hors-l"><rect x="-99" y="-99" width="300" height="300" fill="#fff"/>${c(L, 'fill="#000"')}</mask></defs>`
    + `<g clip-path="url(#nord-cadre)"><g fill="${C.lilas}" opacity="0.13">${c(L, '')}${c(V, '')}</g>`
    + c(L, `fill="none" stroke="${C.lilas}" stroke-width="0.3" stroke-dasharray="1.2 1.2" mask="url(#hors-v)"`)
    + c(V, `fill="none" stroke="${C.lilas}" stroke-width="0.3" stroke-dasharray="1.2 1.2" mask="url(#hors-l)"`) + '</g>', [[0, 0], [w, h]]);
  t.trait(L, V, { c: C.indigo, ep: 0.5 });
  for (const v of villes.slice(2)) {
    const base = Math.hypot(v.p[0] - L[0], v.p[1] - L[1]) < Math.hypot(v.p[0] - V[0], v.p[1] - V[1]) ? L : V;
    t.trait(base, v.p, { c: C.indigo, ep: 0.3 });
  }
  for (const v of villes) {
    t.rond(v.p, v.fort ? 2.4 : 1.4, C.indigo);
    if (v.fort) t.rond(v.p, 4.2, 'none', { contour: C.indigo, ep: 0.3 });
    const d = v.fort ? 5.4 : 2.8, pt = v.fort ? 6.8 : 6, poids = v.fort ? 600 : 500;
    if (v.o === 'g') t.texte([v.p[0] - d, v.p[1] + 0.9], v.n, { pt, ancre: 'end', poids });
    if (v.o === 'd') t.texte([v.p[0] + d, v.p[1] + 0.9], v.n, { pt, poids });
    if (v.o === 'b') t.texte([v.p[0], v.p[1] + d + 1.8], v.n, { pt, ancre: 'middle', poids });
  }
  t.texte([3, 71], '60 km autour', { pt: 5.6, poids: 500, c: C.vif });
  return { html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}mm" height="${h}mm" style="display:block">${t.el.join('')}</svg>`, w, h };
}
function carteFrance(w, h) {
  const t = new Toile(1, { halo: C.creme });
  const k = 0.083, ox = 44, oy = 7;
  const geo = (lat, lon) => [ox + (lon - 3.06) * 75 * k, oy + (50.63 - lat) * 111 * k];
  const L = geo(50.63, 3.06);
  const villes = [
    ['Paris', 48.86, 2.35, 'hg'], ['Rennes', 48.11, -1.68, 'g'], ['Nantes', 47.22, -1.55, 'g'], ['Bordeaux', 44.84, -0.58, 'g'],
    ['Toulouse', 43.6, 1.44, 'g'], ['Lyon', 45.76, 4.84, 'd'], ['Marseille', 43.3, 5.37, 'd'], ['Strasbourg', 48.58, 7.75, 'b'],
  ].map(([n, la, lo, o]) => ({ n, p: geo(la, lo), o }));
  const europe = [L[0] + 26, L[1] + 3];
  t.trait(L, europe, { c: C.lilas, ep: 0.32, tirets: '1.2 1.2' });
  for (const v of villes) t.trait(L, v.p, { c: C.indigo, ep: 0.3 });
  for (const v of villes) {
    t.rond(v.p, 1.4, C.indigo);
    if (v.o === 'g') t.texte([v.p[0] - 2.8, v.p[1] + 0.9], v.n, { pt: 6, poids: 500, ancre: 'end' });
    if (v.o === 'hg') t.texte([v.p[0] - 2.2, v.p[1] - 1.7], v.n, { pt: 6, poids: 500, ancre: 'end' });
    if (v.o === 'd') t.texte([v.p[0] + 2.8, v.p[1] + 0.9], v.n, { pt: 6, poids: 500 });
    if (v.o === 'b') t.texte([v.p[0], v.p[1] + 4.6], v.n, { pt: 6, poids: 500, ancre: 'middle' });
  }
  t.rond(europe, 1.4, C.lilas);
  t.texte([europe[0], europe[1] + 4.6], 'Europe', { pt: 6, poids: 500, c: C.gris, ancre: 'middle' });
  t.rond(L, 2.4, C.indigo); t.rond(L, 4.2, 'none', { contour: C.indigo, ep: 0.3 });
  t.texte([L[0] - 5.4, L[1] + 0.9], 'Lille', { pt: 6.8, ancre: 'end' });
  return { html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}mm" height="${h}mm" style="display:block">${t.el.join('')}</svg>`, w, h };
}

/* ════════════════════════════════════════════════════════════
   LES PAGES
   ════════════════════════════════════════════════════════════ */
const E = Object.fromEntries(ESPACES.map((e) => [e.id, e]));
const tpe = Object.fromEntries(OFFERS_TPE.fr.map((o) => [o.id, o]));
const pme = Object.fromEntries(OFFERS.fr.map((o) => [o.id, o]));
const NOMS = { creation: 'Créer ou reprendre', tpe: '1 à 10 personnes', pme: '10 à 250 personnes' };

/* ── Couverture ─────────────────────────────────────────────── */
function couverture({ sur = null } = {}) {
  const t = new Toile(1, { halo: null });
  const centres = { creation: [36, 0], tpe: [96, -2], pme: [158, 0] };
  for (const e of ESPACES) {
    const actif = !sur || sur === e.id;
    const g = echelle(GRAPPES[e.id], e.id === 'pme' ? 15.5 : 11.5);
    dessinerGrappe(t, g, centres[e.id], {
      couleur: actif ? ACCENT[e.id] : '#4435D0', lien: actif ? 'rgba(240,238,232,.42)' : '#3A2BCB',
      ep: 0.34, rc: e.id === 'creation' ? 2.6 : 2.1, rp: 1.55, rf: 1.25,
    });
    t.texte([centres[e.id][0], 33], e.id === 'creation' ? 'En projet' : e.taille, {
      pt: 5.8, poids: 500, c: actif ? C.creme : '#5446D6', ancre: 'middle', maj: true, ls: 0.2, halo: false,
    });
  }
  const g = t.svg(0);
  const slogan = {
    '': ['On vous aide à décider,', 'et on construit la suite.'],
    creation: ['Avant d’ouvrir,', 'sachez qui sera votre client.'],
    tpe: ['On construit ce qui vous manque,', 'et vous gardez les clés.'],
    pme: ['Des outils qui se parlent,', 'des équipes qui gagnent du temps.'],
  }[sur || ''];
  const rub = sur ? `Livret · ${NOMS[sur]}` : 'Conseil et ingénierie numérique · Créateurs, TPE et PME';
  return `
<section class="page indigo">
  <div class="a" style="left:20mm;top:17.8mm">${logo(true)}</div>
  <div class="rubrique">${typo(rub)}</div>
  <div class="a" style="left:${f2(20 + (170 - g.w) / 2)}mm;top:40mm">${g.html}</div>
  <div class="a" style="left:18.8mm;top:112mm;font-family:'Reskope Network';font-size:44mm;line-height:1;color:${C.creme};white-space:nowrap">RESKOPE</div>
  ${A(20, 196, 158, slogan.map(typo).join('<br>'), '', 'font-size:25pt;line-height:1.12;font-weight:600;letter-spacing:-.018em;color:#fff')}
  <div class="a" style="right:20mm;top:199mm;font-size:6.6pt;letter-spacing:.26em;color:rgba(240,238,232,.72)">2026</div>
  ${pied('', true)}
</section>`;
}

/* ── Pour qui, et ce que contient le livret ─────────────────── */
function sommaire(lignes) {
  return `<div class="som">${lignes.map(([t, f]) => `<div class="l"><span>${typo(t)}</span><span>${f}</span></div>`).join('')}</div>`;
}
function pagePourQui({ folio }) {
  const lignes = [
    ['creation', '**Vous créez ou reprenez une entreprise.** On vous aide à trouver vos clients, à construire votre business plan et à convaincre la banque.'],
    ['tpe', '**Vous dirigez une entreprise de 1 à 10 personnes.** On vous aide à être trouvé, à être joignable et à gagner du temps : un site, la prise de rendez-vous, une identité.'],
    ['pme', '**Vous dirigez une entreprise de 10 à 250 personnes.** On fait le tour de vos outils, on relie ceux qui doivent se parler, et on construit ce qui manque.'],
  ];
  const rangee = ([id, texte], i) => {
    const t = new Toile(1, { halo: null });
    dessinerGrappe(t, echelle(GRAPPES[id], id === 'pme' ? 6.6 : 7.4), [0, 0], {
      couleur: ACCENT[id], lien: C.lilas, ep: 0.28, rc: id === 'creation' ? 2.1 : 1.6, rp: 1.2, rf: 1,
    });
    const y = 113 + i * 25;
    return poser(t.svg(0.4), 20, y - 3, 26, 24, { nom: 'grappe' }) + A(52, y + 3.2, 104, md(texte), 'corps', 'font-size:8.9pt;line-height:1.6');
  };
  const s = [
    ['Trois métiers, un seul dossier', '03'], ['Thomy et Florian', '04'], ['La bonne fée sur votre épaule', '05'],
    ['La vie de votre projet', '06'], ['Ce qu’on vend, selon où vous en êtes', '07'],
    ['Créer ou reprendre', '08'], ['1 à 10 personnes', '11'], ['10 à 250 personnes', '14'],
    ['Votre marque', '17'], ['Où on intervient', '18'], ['Comment on démarre', '19'],
  ];
  return page({
    rubrique: 'Le livret', folio, bande: 101,
    contenu: `
    ${titre(['Pour qui on travaille,', 'et ce qu’il y a', 'dans ce livret.'])}
    ${intro('On travaille avec celles et ceux qui créent ou reprennent une entreprise, avec les TPE et avec les PME. C’est un choix : à deux, on préfère suivre quelques projets de près plutôt que beaucoup de loin.')}
    ${A(20, 101, 100, lab('À qui on s’adresse'))}
    ${A(122, 100.2, 68, typo('Le nombre de nœuds dit la taille de l’entreprise.'), 'note')}
    ${lignes.map(rangee).join('')}
    ${A(20, 206, 100, lab('Ce que contient ce livret'))}
    ${A(20, 213, 82, sommaire(s.slice(0, 5)))}
    ${A(108, 213, 82, sommaire(s.slice(5)))}`,
  });
}
function pagePourQuiEspace(id, { folio }) {
  const intros = {
    creation: 'Ce livret est consacré à celles et ceux qui créent ou reprennent une entreprise : **trouver vos clients, construire votre business plan, convaincre la banque.**',
    tpe: 'Ce livret est consacré aux entreprises de 1 à 10 personnes : **être trouvé, être joignable, gagner du temps**, avec un site, la prise de rendez-vous et une identité.',
    pme: 'Ce livret est consacré aux entreprises de 10 à 250 personnes : **des outils qui se parlent, et des équipes qui gagnent du temps.**',
  };
  const situations = {
    creation: [
      '**La banque vous demande une étude de marché.** On interroge dix à douze personnes de votre cible, et vous repartez avec le portrait de votre client idéal.',
      '**Vous devez faire un business plan, et vous ne savez pas par où commencer.** On le construit avec vous, en commençant par votre client.',
      '**Votre rendez-vous à la banque approche.** On relit votre dossier avec les yeux du financeur, et on prépare avec vous les questions qu’on vous posera.',
    ],
    tpe: HOME_TPE.fr.conditions.slice(0, 3).map((c, i) => `**${c}** ${[
      'Une vitrine sobre sort en cinq à huit jours de travail, et vous repartez avec les clés.',
      'On met en place les créneaux en ligne, la confirmation et le rappel la veille.',
      'On repart de vous et de vos clients, puis on écrit les règles de votre marque.',
    ][i]}`),
    pme: [
      '**Vous payez des logiciels sans savoir lesquels servent.** On ouvre chaque abonnement et on mesure ce qu’il coûte au regard de ce qu’il apporte.',
      '**Vos équipes se plaignent d’avoir trop d’outils.** On rencontre chaque personne une demi-heure et on relève ce qu’elle utilise réellement.',
      '**La même information existe à trois endroits.** On la suit d’un bout à l’autre et on détermine lequel de vos outils fait foi.',
    ],
  }[id];
  const pages = { creation: ['Tester votre idée', 'Votre business plan'], tpe: ['Ce qui vous manque', 'En jours de travail'], pme: ['Trop d’outils', 'Le déroulé d’un audit'] }[id];
  const s = [['Trois métiers, un seul dossier', '03'], ['Thomy et Florian', '04'], [pages[0], '06'], [pages[1], '07'], ['Comment on démarre', '08']];
  const autres = ESPACES.filter((e) => e.id !== id).map((e) => [NOMS[e.id], ACCENT[e.id]]).concat([['Le livret complet', C.indigo]]);
  const stade = { creation: 1, tpe: 2, pme: 3 }[id];
  return page({
    rubrique: `Livret · ${NOMS[id]}`, folio, bande: 101,
    contenu: `
    ${titre(['À qui s’adresse', 'ce livret, et ce', 'qu’il contient.'])}
    ${intro(intros[id])}
    ${A(20, 101, 100, lab('À qui on s’adresse'))}
    ${A(20, 110, 116, puces(situations, { fines: true, couleur: ACCENT[id] }))}
    ${poser(iconePlante(stade, { k: [0, 2.1, 1.9, 1.5][stade] }), 146, 104, 44, 70, { nom: 'plante espace' })}
    ${A(20, 206, 100, lab('Ce que contient ce livret'))}
    ${A(20, 213, 82, sommaire(s))}
    ${A(108, 206, 82, lab('Les autres livrets'))}
    ${A(108, 214, 82, puces(autres, { fines: true }))}
    ${A(108, 249, 82, typo('Sur simple demande, par e-mail ou au téléphone.'), 'note')}`,
  });
}

/* ── Trois métiers ──────────────────────────────────────────── */
function pageMetiers({ folio }) {
  const rangs = [
    { d: dessinEntretiens(), h: txt(POLES.discovery.ligne), l: `D’abord · Discovery · ${txt(POLES.discovery.mene).split(',')[0]}`, p: 'On interroge dix à douze personnes de votre cible sur ce qu’elles vivent aujourd’hui, jamais sur ce qu’elles feraient. Si votre entreprise tourne déjà, on va voir vos clients gagnés, perdus et partis.' },
    { d: dessinChapitres(), h: txt(POLES.bp.ligne), l: `Ensuite · Business plan · ${txt(POLES.bp.mene).split(',')[0]}`, p: 'On construit votre business plan en commençant par votre client, puis l’offre et le prix, les chiffres, le financement et la marque. Et on vous prépare au rendez-vous avec la banque.' },
    { d: dessinEtapes(), h: 'Construire seulement ce qui a été validé', l: `Et après · Construire la suite · ${txt(POLES.construire.mene)}`, p: 'Un site, une prise de rendez-vous, une automatisation ou un outil métier. On avance par petites étapes que vous testez une par une, et tout est à votre nom.' },
  ];
  return page({
    rubrique: 'Le cabinet', folio, bande: 73,
    contenu: `
    ${titre(['On commence', 'toujours par', 'vos clients.'])}
    ${intro('Ce que vos clients disent nourrit votre business plan, et seul ce qui a été validé devient un outil. Chacun de ces trois métiers a quelqu’un qui le mène.')}
    ${rangs.map((r, i) => {
      const y = 80 + i * 47;
      return poser(r.d, 18, y, 52, 40, { nom: 'métier' }) + A(80, y + 5, 110, `<div class="h2">${typo(r.h)}</div><div class="lab" style="margin:2.2mm 0 2.6mm">${typo(r.l)}</div><div class="corps">${md(r.p)}</div>`);
    }).join('')}
    ${A(20, 240, 160, md('**Notre plus-value, c’est d’être la bonne fée sur votre épaule :** à côté de vous quand vous décidez, et derrière l’écran quand il faut construire.'), '', `font-size:12pt;line-height:1.55;color:${C.gris}`)}`,
  });
}

/* ── Thomy et Florian ───────────────────────────────────────── */
function pageDuo({ folio }) {
  const photo = (id, x) => {
    const t = new Toile(1, { halo: null });
    t.poly([[0, 0], [80, 0], [80, 98], [0, 98]], `fill="none" stroke="${C.vif}" stroke-width="0.3"`);
    for (const p of [[0, 0], [80, 0], [0, 98], [80, 98]]) t.rond(p, 1.25, C.indigo);
    return `<div class="a" style="left:${x}mm;top:101mm;width:80mm;height:98mm;background:url('file://${ICI}/photos/${id}.jpg') center/cover no-repeat"></div><div class="a" style="left:${x - 1.25}mm;top:99.75mm">${t.svg(0).html}</div>`;
  };
  const fiche = (d, x, tags, texte) => A(x, 208, 80, `<div class="h2" style="font-size:12.5pt">${typo(d.nom)}</div><div class="lab" style="margin:1.8mm 0 3mm">${typo(tags)}</div><div class="corps" style="font-size:8pt;line-height:1.62">${md(texte)}</div>`);
  const [th, fl] = DUO;
  return page({
    rubrique: 'Le cabinet', folio, bande: 204,
    contenu: `
    ${titre(['On travaille', 'tous les deux sur', 'le même dossier.'])}
    ${intro('Thomy mène le business plan et le passage devant les financeurs. Florian mène les entretiens avec vos clients, et construit les outils. Les deux métiers se nourrissent l’un l’autre : c’est ce qui fait qu’un dossier avance vite et d’un seul tenant.')}
    ${photo(th.id, 20)}${photo(fl.id, 110)}
    ${fiche(th, 20, 'Business plan · Financement · Marque', `${th.dit} Avec vous, elle construit le business plan à partir de ce que vos clients ont dit, prépare le passage devant les financeurs et pose le cadre de votre marque.`)}
    ${fiche(fl, 110, 'Discovery · Sites · Outils métier', 'Il conduit la discovery de bout en bout : il trouve les personnes à interroger, mène les entretiens et en tire les preuves. Quand la suite demande un site ou un outil, il le conçoit et le développe. Il accompagne aussi les créations d’entreprise et les business plans.')}
    ${A(20, 268, 170, typo('On se déplace · on vous donne le prix avant de commencer · les fichiers et les accès sont à votre nom'), 'faits')}`,
  });
}

/* ── La bonne fée ───────────────────────────────────────────── */
function pagePosture({ folio }) {
  return page({
    rubrique: 'Notre posture', folio, bande: 112.5,
    contenu: `
    ${titre(['La bonne fée', 'sur votre épaule.'])}
    ${intro('C’est l’image qui nous correspond le mieux. On est là quand vous réfléchissez, quand vous hésitez, quand il faut trancher. **Mais on ne décide jamais à votre place.**')}
    ${A(20, 78, 100, lab('À côté, pas à la place'))}
    ${cadre(20, 85.5, 170, 92.5, dessinPosture(), { nom: 'posture' })}
    ${A(20, 197, 80, puces([
      '**On est à côté, pas à la place.** Vous connaissez votre métier bien mieux que nous, et c’est votre projet. On apporte le recul qu’on perd forcément quand on est dans le projet tous les jours.',
      '**On part de vos clients.** Avant de vous conseiller quoi que ce soit, on va leur parler. Ce qu’ils vivent compte plus que nos avis.',
    ], { fines: true }))}
    ${A(110, 197, 80, puces([
      '**On vise votre autonomie.** Les outils qu’on construit, on vous les laisse et on vous apprend à vous en servir. Quand vous n’avez plus besoin de nous, c’est qu’on a bien travaillé.',
      '**On ne se met pas de frontière.** Ni géographique, ni par secteur. Si le projet a du sens et qu’on peut vous être utiles, on trouve le moyen de s’organiser.',
    ], { fines: true }))}
    ${A(20, 248, 100, lab('Notre mission'))}
    ${A(20, 255, 160, typo('On n’est pas là pour prendre votre place. On est là pour que vous décidiez plus vite et plus sereinement, sur des preuves, et pour construire ce que vous avez décidé.'), '', `font-size:10.2pt;line-height:1.6;color:${C.gris}`)}`,
  });
}

/* ── La vie d'un projet ─────────────────────────────────────── */
function pageVie({ folio }) {
  const b = (i, texte) => [`**${STADES[i].nom}** {{${STADES[i].sous}}} · ${texte}`, STADES[i].c];
  return page({
    rubrique: 'La vie d’un projet', folio, bande: 107,
    contenu: `
    ${titre(['Là où on intervient', 'dans la vie', 'de votre projet.'])}
    ${intro('Un projet ne se ressemble pas d’une année sur l’autre. Vous n’avez pas besoin de nous à toutes les étapes, et on vous le dira franchement.')}
    ${cadre(20, 92, 170, 88, dessinVie(), { nom: 'vie' })}
    ${A(20, 199, 100, lab('Ce qu’on fait à chaque étape'))}
    ${A(20, 207, 80, puces([
      b(0, 'Vous avez une idée. On la confronte aux gens qui devraient l’acheter.'),
      b(1, 'On construit votre business plan, on relit votre dossier et on vous prépare aux financeurs.'),
      b(2, 'L’activité tient. On vous aide à être trouvé, à être joignable et à gagner du temps.'),
    ], { fines: true }))}
    ${A(110, 207, 80, puces([
      b(3, 'Vous avez des équipes. On fait le tour de vos outils, on relie ce qui doit l’être et on forme tout le monde.'),
      b(4, 'Vous tenez seuls et le projet continue de grandir. On repasse quand vous nous appelez, pas avant.'),
    ], { fines: true }))}
    ${A(116.6, 256, 73.4, typo('Chaque étape se prend séparément. Et si l’étape où vous en êtes vous suffit, on ne vous vendra pas la suivante.'), 'note')}`,
  });
}

/* ── Ce qu'on vend ──────────────────────────────────────────── */
function pageCatalogue({ folio }) {
  const o = OFFRE;
  const groupes = [
    { stade: 1, h: 'Vous créez ou reprenez une entreprise', l: 'En projet', items: [
      `**${o.idee.court}** {{${o.idee.faits.duree}}} · le portrait de votre client idéal, et où le trouver`,
      `**${o.bp.court}** {{${o.bp.faits.duree}}} · un dossier que vous savez défendre`,
      `**${o.dossier.court}** {{${o.dossier.faits.duree}}} · des retours classés, avant les financeurs`,
      `**${o.clients.court}** {{${o.clients.faits.duree}}} · pourquoi ils achètent, ou partent`,
      `**Préparer les financeurs** {{${o.financeurs.duree.toLowerCase()}}} · le pitch, et les questions difficiles`,
      '**Poser votre marque** {{3 à 5 jours}} · le cadre écrit, et des maquettes de logo',
    ] },
    { stade: 2, h: 'Vous dirigez une entreprise de 1 à 10 personnes', l: 'Une TPE', items: [
      `**${tpe.site.name}** {{5 à 8 jours pour une vitrine}} · ${txt(tpe.site.tagline).toLowerCase()}`,
      `**${tpe.reservation.name}** {{sur devis}} · créneaux en ligne, rappel la veille`,
      `**${tpe.marque.name}** {{3 à 5 jours}} · le positionnement d’abord, les couleurs ensuite`,
      `**${tpe.lancement.name}** {{2 à 4 jours}} · avant d’ouvrir, et avant d’emprunter`,
    ] },
    { stade: 3, h: 'Vous dirigez une entreprise de 10 à 250 personnes', l: 'Une PME', items: [
      `**${pme.audit.name}** {{2 à 5 jours sur place}} · un bilan priorisé, que vous gardez`,
      `**${pme['audit-plus'].name}** {{à la journée}} · on fait le tour, puis on range`,
      `**${pme.developpement.name}** {{estimés en jours}} · un site, une application, une automatisation`,
      `**${pme.suivi.name}** {{au mois}} · résiliable à tout moment`,
    ] },
  ];
  let y = 96;
  const blocs = groupes.map((g) => {
    const html = poser(iconePlante(g.stade, { k: [1.25, 1.25, 1.1, 0.88][g.stade] }), 18, y - 4, 28, 30, { nom: 'plante' })
      + A(57, y, 133, `<div class="h2">${typo(g.h)}</div><div class="lab" style="margin:1.8mm 0 3mm">${typo(g.l)}</div>${puces(g.items, { fines: true, couleur: STADES[g.stade].c })}`);
    y += 20 + g.items.length * 6.9;
    return html;
  }).join('');
  return page({
    rubrique: 'Nos missions', folio, bande: 213,
    contenu: `
    ${titre(['Ce qu’on vend,', 'selon où vous', 'en êtes.'])}
    ${intro('Chaque mission a un prix fixe, écrit avant de commencer. Ce qu’il y a dedans ne bouge pas ; la durée dépend de votre situation, et elle est écrite noir sur blanc dans la proposition.')}
    ${blocs}
    ${A(57, 262, 133, typo(`Vous pouvez vous arrêter à la fin de chaque mission : ce qui est fait vous reste, fichiers sources compris. ${PRIX.micro}`), 'note')}`,
  });
}

/* ── Séparateurs ────────────────────────────────────────────── */
const FONDS = {
  a: [[[168, 64], [206, 96], [182, 128], [214, 170], [150, 150], [196, 262], [140, 250], [96, 268], [52, 250], [6, 268]],
    [[0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [5, 6], [6, 7], [7, 8], [8, 9]]],
  b: [[[176, 52], [204, 82], [166, 110], [212, 150], [146, 146], [206, 244], [150, 258], [104, 246], [60, 266], [12, 250]],
    [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [5, 6], [6, 7], [7, 8], [8, 9]]],
};
function separateur({ num, lignes, sous, espace, stade, rubrique }) {
  const fond = reseauFond(...FONDS[num === '02' ? 'b' : 'a']);
  return page({
    indigo: true, rubrique, fond,
    contenu: `
    <div class="a" style="left:19mm;top:84mm;font-family:'Reskope Network';font-size:31mm;line-height:1;color:${C.creme}">${num}</div>
    ${A(20, 133, 140, lignes.map(typo).join('<br>'), '', 'font-size:31pt;line-height:1.05;font-weight:600;letter-spacing:-.02em;color:#fff')}
    ${A(20, 204, 104, typo(sous), '', 'font-size:9.4pt;line-height:1.6;color:rgba(240,238,232,.9)')}
    ${A(20, 222, 104, `<div style="display:flex;align-items:center;gap:2.2mm;font-size:6.2pt;letter-spacing:.22em;text-transform:uppercase;color:${C.creme}"><span style="width:2.4mm;height:2.4mm;border-radius:50%;background:${ACCENT[espace]}"></span>${typo(E[espace].question)}</div>`)}
    ${poser(iconePlante(stade, { k: [2.3, 2.3, 2.15, 1.72][stade], clair: true }), 142, 176, 48, 56, { nom: 'icône' })}`,
  });
}

/* ── Créer ou reprendre : tester votre idée ─────────────────── */
function pageIdee({ folio }) {
  const o = OFFRE.idee, ex = EXEMPLES[0];
  const legende = ['offre', 'vie', 'media', 'valeur'].map((k) => `<span style="display:inline-flex;align-items:center;gap:1.4mm;margin-right:3.4mm;white-space:nowrap"><span style="width:2mm;height:2mm;border-radius:50%;background:${CAT[k].c}"></span>${typo(CAT[k].nom)}</span>`).join('');
  return page({
    rubrique: '01 · Créer ou reprendre', folio, bande: 91,
    contenu: `
    ${A(110, 33, 80, lab('Le portrait de votre client idéal', true))}
    ${poser(dessinPortrait(ex), 110, 39, 80, 62, { nom: 'portrait' })}
    ${titre(['Avant d’ouvrir,', 'sachez qui sera', 'votre client.'], 20, 41, 86)}
    ${A(20, 84, 82, md(o.accroche), 'lead')}
    ${A(20, 123, 44, chiffre('10 à 12', 'personnes de votre cible, interrogées sur ce qu’elles vivent aujourd’hui'))}
    ${A(66, 123, 40, chiffre('1 h 30', `de votre temps par semaine, pendant ${o.faits.duree}`))}
    ${A(110, 104, 80, typo('Chaque nœud est un trait de sa vie, et sa couleur dit ce qu’il nous apprend :'), 'note')}
    ${A(110, 113, 80, legende, 'note', 'line-height:2')}
    ${temps(163, [
      ['On écrit ce qui doit être vrai', 'Qu’il y a des clients, qu’ils paieront ce prix, et qu’on sait où les trouver.'],
      ['On interroge votre cible', 'Dix à douze personnes, sur ce qu’elles vivent aujourd’hui, jamais sur ce qu’elles feraient.'],
      ['On teste pour de vrai', 'Le plus risqué d’abord : un prix, une page, une précommande. Ensuite, vous décidez.'],
    ])}
    ${A(20, 215, 82, lab('Ce que vous recevez'))}
    ${A(20, 223, 84, puces(['Le portrait de votre client idéal', 'Où le trouver, et quoi lui dire', 'Vos hypothèses, chacune avec son verdict', 'Le prix testé, et la façon dont il a été reçu']))}
    ${A(20, 265, 86, typo(`${o.faits.duree} · ${o.faits.temps} · prix fixe, écrit avant de commencer`), 'faits')}
    ${A(110, 215, 80, lab('Sa journée, heure par heure', true))}
    ${poser(dessinJournee(ex), 110, 221, 80, 36, { nom: 'journée' })}
    ${A(110, 258, 80, typo('La position de chaque nœud donne l’heure. Le plus gros, c’est le moment où elle peut venir chez vous.'), 'note')}`,
  });
}

/* ── Créer ou reprendre : votre business plan ───────────────── */
function pageBP({ folio }) {
  const o = OFFRE.bp;
  return page({
    rubrique: '01 · Créer ou reprendre', folio, bande: 91,
    contenu: `
    ${A(110, 33, 80, lab('Trois ans de prévisionnel', true))}
    ${poser(dessinPrevisionnel(), 110, 39, 80, 62, { nom: 'prévisionnel' })}
    ${titre(['Votre business plan,', 'de votre client', 'à vos chiffres.'], 20, 41, 86)}
    ${A(20, 84, 82, md('On ne l’écrit pas à votre place : on le construit avec vous, en commençant par le chapitre qui décide de tous les autres, votre client.'), 'lead')}
    ${A(20, 119, 44, chiffre('4 à 6', 'semaines, avec deux heures de votre temps par semaine'))}
    ${A(66, 119, 40, chiffre('3 ans', 'de prévisionnel, chaque chiffre avec sa source'))}
    ${A(110, 106, 80, typo('Chaque barre est le chiffre d’affaires prévu pour une année. Le plan qui les traverse, c’est le niveau à partir duquel vous commencez à vous payer.'), 'note')}
    ${temps(163, [
      ['On part de votre client', 'Qui il est, ce qu’il achète aujourd’hui, ce qui le ferait venir chez vous. On va le rencontrer.'],
      ['On construit les chiffres', 'Chiffre d’affaires, charges, trésorerie, besoin de financement : chaque hypothèse a sa source.'],
      ['On relit comme un financeur', 'On relit le tout avec ses yeux, et on prépare avec vous les questions qu’on vous posera.'],
    ])}
    ${A(20, 215, 82, lab('Ce que vous recevez'))}
    ${A(20, 223, 84, puces(['Votre offre et votre prix, justifiés', 'Un prévisionnel sur trois ans, sourcé', 'Le cadre de votre marque, et des pistes de logo', 'Un dossier relu comme la banque le lira']))}
    ${A(20, 265, 86, typo(`${o.faits.duree} · ${o.faits.temps} · on ne l’écrit pas à votre place`), 'faits')}
    ${A(110, 215, 80, lab('Autour du dossier'))}
    ${A(110, 223, 80, puces([
      `**${OFFRE.dossier.court}** {{${OFFRE.dossier.faits.duree}}} · si vous l’avez déjà écrit`,
      `**Préparer les financeurs** {{${OFFRE.financeurs.duree.toLowerCase()}}} · le pitch, et les questions qui déstabilisent`,
      '**Poser votre marque** {{3 à 5 jours}} · le cadre écrit, et des maquettes de logo',
    ], { fines: true }))}
    ${A(110, 262, 80, typo('On ne remplace pas votre expert-comptable pour les comptes officiels.'), 'note')}`,
  });
}

/* ── 1 à 10 personnes : ce qui vous manque ──────────────────── */
function pageTpeA({ folio }) {
  const [p1, p2] = PREUVES_TPE.fr.items;
  return page({
    rubrique: '02 · 1 à 10 personnes', folio, bande: 91,
    contenu: `
    ${A(110, 33, 80, lab('Ce qu’une réservation déclenche', true))}
    ${poser(dessinReservation(), 110, 39, 80, 62, { nom: 'réservation' })}
    ${titre(['On construit ce', 'qui vous manque, et', 'vous gardez les clés.'], 20, 41, 88)}
    ${A(20, 84, 82, md('Un site, une prise de rendez-vous, une identité : ce qui vous fait trouver, vous rend joignable et vous fait gagner du temps. On avance par petites étapes, et vous pouvez vous arrêter à la fin de chacune.'), 'lead')}
    ${A(20, 126, 44, chiffre(`${p1.n} %`, p1.t, `${p1.src.split(' · ')[0]} · Réussir avec le web`))}
    ${A(66, 126, 40, chiffre(`${p2.n} %`, 'n’ont pourtant toujours pas de site internet.', `${p2.src.split(' · ')[0]} · Réussir avec le web`))}
    ${A(110, 106, 80, `<div style="display:flex;gap:4mm;align-items:baseline"><span class="chiffre">0 donnée</span><span class="leg" style="margin:0">gardée de notre côté une fois la mission finie</span></div>`)}
    ${A(110, 118, 80, typo('Un client réserve depuis votre site. En bas, ce qu’il fait de son côté ; en haut, ce qui se déclenche chez vous sans que personne ait à y toucher.'), 'note')}
    ${temps(166, [
      [tpe.site.name, 'Une vitrine sobre sort en cinq à huit jours de travail. Si vous avez déjà des outils, on les relie plutôt que de les remplacer.'],
      [tpe.reservation.name, 'Créneaux en ligne, confirmation, rappel la veille et fichier clients, reliés à l’agenda que vous utilisez déjà.'],
      [tpe.marque.name, 'On commence par vous et par vos clients, jamais par les couleurs. Vous repartez avec des règles écrites.'],
    ])}
    ${A(20, 215, 82, lab('Ce que vous recevez'))}
    ${A(20, 223, 84, puces(['Le site ou l’outil, en ligne et vérifié', 'Le code et les fichiers sources', 'Les accès et l’hébergement à votre nom', 'Une demi-journée de prise en main']))}
    ${A(20, 265, 86, typo('un devis détaillé, valable 30 jours · de petites étapes, validées une par une'), 'faits')}
    ${A(110, 215, 80, lab('Avant d’ouvrir, et avant d’emprunter'))}
    ${A(110, 223, 80, `<div class="h3">${typo(tpe.lancement.name)}</div><div class="corps">${md('On creuse avec vous le besoin réel, le modèle économique, le coût de revient et le seuil à partir duquel vous vous payez. Vous repartez avec un prévisionnel en tableur, formules ouvertes.')}</div><div class="faits" style="margin-top:2.4mm">${typo('2 à 4 jours, selon l’état de votre dossier')}</div>`)}`,
  });
}

/* ── 1 à 10 personnes : en jours ────────────────────────────── */
function pageTpeB({ folio }) {
  const chantiers = [
    { nom: 'Site vitrine', min: 5, max: 8, jours: '5 à 8 jours' },
    { nom: 'Identité de marque', min: 3, max: 5, jours: '3 à 5 jours' },
    { nom: 'Aide au lancement', min: 2, max: 4, jours: '2 à 4 jours' },
  ];
  return page({
    rubrique: 'Ce qu’on construit', folio, bande: 97,
    contenu: `
    ${titre(['Ce qu’on construit,', 'en jours', 'de travail.'])}
    ${intro('Voici des ordres de grandeur pour un projet simple. **Le nombre exact de jours est écrit dans le devis**, avant qu’on commence. Une boutique ou une prise de rendez-vous se chiffrent au cas par cas.')}
    ${cadre(20, 88, 170, 92, dessinJours(chantiers), { nom: 'jours' })}
    ${A(20, 183.5, 170, typo('Le plein dit le minimum, le fil de fer le maximum.'), 'note')}
    ${A(20, 209, 100, lab('Comment ça se passe'))}
    ${fil(219, 5)}
    ${colonnes(226, JALONS_TPE.fr.map((j) => [j.label, j.deliver]))}
    ${A(20, 262, 170, typo('Vous voyez chaque brique fonctionner avant qu’on passe à la suivante, et vous pouvez vous arrêter à la fin de chacune.'), 'note')}`,
  });
}

/* ── 10 à 250 personnes : trop d'outils ─────────────────────── */
function pagePmeA({ folio }) {
  return page({
    rubrique: '03 · 10 à 250 personnes', folio, bande: 91,
    contenu: `
    ${A(110, 33, 80, lab('Vos abonnements, mis en volume', true))}
    ${poser(dessinAbonnements(), 110, 39, 80, 62, { nom: 'abonnements' })}
    ${titre(['Vos équipes', 'ne manquent pas', 'd’outils. Elles en ont', 'trop, et s’y perdent.'], 20, 41, 88)}
    ${A(20, 93, 82, md('C’est la remarque qui revient le plus souvent : des logiciels partout, plus personne ne sait lequel fait quoi, et la même information est saisie trois fois.'), 'lead')}
    ${A(20, 124, 44, chiffre('36 %', 'des licences logicielles payées ne servent jamais', 'Étude Zylo 2026'))}
    ${A(66, 124, 40, chiffre('118', 'applications en moyenne dans une entreprise', 'Étude BetterCloud 2026'))}
    ${A(110, 104, 80, `<div style="display:flex;gap:4mm;align-items:baseline"><span class="chiffre grand">${typo(euros(DORT))}</span><span class="leg" style="margin:0">d’abonnements payés et jamais ouverts, sur cet exemple</span></div>`)}
    ${A(110, 124, 80, typo('Chaque bloc est un outil, et sa hauteur c’est ce qu’il coûte sur l’année. Le plein, c’est ce qui sert ; le fil de fer au-dessus, ce sont les comptes payés que personne n’ouvre.'), 'note')}
    ${A(20, 150, 84, typo('Côté RGPD : on relève des usages et des coûts, jamais des personnes. Aucune donnée personnelle n’est copiée, et rien de ce qu’on a vu ne sort de chez vous.'), 'faits', 'font-size:7.4pt')}
    ${temps(171, [
      ['On voit chaque personne', 'Une demi-heure avec chacun : ce qu’il ouvre tous les jours, ce qu’il recopie d’un outil à l’autre, et ce qu’il n’ouvre jamais.'],
      ['On ouvre les abonnements', 'On regarde ce que chaque licence vous coûte, à quoi elle sert vraiment, et s’il en existe une moins chère qui fait la même chose.'],
      ['On suit une donnée', 'Le chiffre d’affaires d’un client : dans combien d’outils est-il stocké, et lequel dit vrai quand ils ne sont pas d’accord ?'],
    ])}
    ${A(20, 215, 82, lab('Ce que vous recevez'))}
    ${A(20, 223, 84, puces(['Le tableau de vos outils, coût par coût', 'Les doublons et les abonnements dormants', 'Le schéma de circulation de vos données', 'Les chantiers chiffrés en jours, classés par gain']))}
    ${A(20, 263, 86, typo('2 à 5 jours sur place · un bilan que vous gardez · s’il ne vous sert pas, vous ne le payez pas'), 'faits')}
    ${A(20, 272.5, 170, typo('Sources : Zylo, 2026 SaaS Management Index · BetterCloud, The 2026 State of SaaS Report'), 'src')}
    ${A(110, 215, 80, lab('Une donnée, un seul endroit', true))}
    ${poser(dessinDonnee(), 110, 221, 80, 37, { nom: 'donnée' })}
    ${A(110, 259.5, 80, typo('La même information dans quatre outils, c’est quatre mises à jour et aucune certitude. On la ramène à un seul endroit.'), 'note')}`,
  });
}

/* ── 10 à 250 personnes : le déroulé ────────────────────────── */
function pagePmeB({ folio }) {
  return page({
    rubrique: 'La méthode', folio, bande: 129,
    contenu: `
    ${titre(['Le déroulé', 'd’une mission', 'd’audit.'])}
    ${intro('Voici comment se déroule une mission, du premier rendez-vous jusqu’à la fin. **Et tant que vous n’avez pas signé le devis, vous n’êtes engagés à rien.**')}
    ${cadre(20, 78, 170, 80, dessinDeroule(), { nom: 'déroulé' })}
    ${A(20, 161.5, 170, typo('La taille de chaque nœud dit le temps que prend l’étape.'), 'note')}
    ${A(20, 178, 100, lab('Ce que chaque temps contient'))}
    ${A(20, 186, 82, puces([
      '**Cadrage.** On se met d’accord sur ce qu’on regarde, ce qu’on ne regarde pas, et sur le prix. Comptez une demi-journée.',
      '**Audit.** On vient sur place et on observe poste par poste, en prenant le temps de voir chaque personne. Deux à cinq jours.',
      '**Bilan.** Un document écrit, priorisé par impact, qu’on relit avec vous avant de vous le remettre.',
      '**Mise en ordre.** On engage les chantiers que vous avez retenus, dans l’ordre que vous choisissez.',
      '**Formation.** On accompagne les équipes pendant le changement. Un outil que personne n’utilise ne sert à rien.',
    ], { fines: true }))}
    ${A(110, 178, 80, lab('Après l’audit, vous choisissez'))}
    ${A(110, 186, 80, puces([
      `**${pme['audit-plus'].name}** {{à la journée}} · chaque journée est estimée avant de démarrer`,
      `**${pme.developpement.name}** {{estimés en jours}} · un site, une application métier, une automatisation`,
      `**${pme.suivi.name}** {{au mois}} · résiliable à tout moment, sans pénalité`,
      '**Ou rien du tout** · le bilan est à vous, vous pouvez l’appliquer avec votre équipe',
    ], { fines: true, couleur: C.ciel }))}
    ${A(110, 248, 80, md('**Et si le bilan ne vous apporte rien ?** Vous ne le payez pas. Vous avez sept jours après la remise pour nous le dire par écrit : on reprend le bilan, ou on annule la facture.'), 'note')}
    ${A(20, 268, 170, typo('Pendant toute la mission, vous avez accès à tout, et à la fin on ne garde rien : ni vos données, ni vos accès. C’est écrit dans le devis.'), 'src')}`,
  });
}

/* ── Votre marque ───────────────────────────────────────────── */
function pageMarque({ folio }) {
  return page({
    rubrique: 'Votre marque', folio, bande: 91,
    contenu: `
    ${A(110, 33, 80, lab('La carte de votre clientèle', true))}
    ${poser(dessinClientele(), 110, 39, 80, 62, { nom: 'clientèle' })}
    ${titre(['Une marque qui', 'vous ressemble.', 'Pas qui ressemble', 'à une autre.'], 20, 41, 86)}
    ${A(20, 93, 82, md('On commence par vous et par vos clients. Le positionnement d’abord, les couleurs ensuite : dans ce sens-là, chaque choix se justifie, et votre marque tient aussi bien sur une devanture que sur un écran.'), 'lead')}
    ${A(20, 134, 84, chiffre('1 segment', 'visé, les autres écartés volontairement : c’est ce qui rend une marque lisible', '', { w: 84 }))}
    ${A(110, 106, 80, typo('Chaque bloc est un type de client. Sa position dit ce qu’il dépense et à quelle fréquence il revient ; sa hauteur, ce qu’il pèse dans le chiffre d’affaires.'), 'note')}
    ${temps(166, [
      ['On part de vous', 'Ce que vous voulez que les gens ressentent en poussant votre porte, et ce que vous ne voulez surtout pas.'],
      ['On définit à qui vous parlez', 'Qui vient chez vous, ce qu’il dépense, à quelle fréquence il revient. Cela se tranche avec des chiffres.'],
      ['On écrit les règles', 'Le nom, le ton, les couleurs, les matières, et la liste de ce qu’il faut produire, dans l’ordre, avec un budget.'],
    ])}
    ${A(20, 215, 82, lab('Ce que vous recevez'))}
    ${A(20, 223, 84, puces(OFFRE.marque.recevez))}
    ${A(20, 268, 86, typo('3 à 5 jours étalés sur deux à trois semaines · un document de règles, pas une image à interpréter'), 'faits')}
    ${A(110, 215, 80, lab('Ce qui n’est pas notre métier'))}
    ${A(110, 223, 80, md('On n’est ni graphistes diplômés ni agence de communication, et on préfère vous le dire. On pose le cadre et on dessine des maquettes de logo pour que vous puissiez démarrer. **Si votre identité demande un vrai studio, on vous le dit et on transmet le cadre au graphiste de votre choix.**'), 'corps')}`,
  });
}

/* ── Où on intervient ───────────────────────────────────────── */
function pageCarte({ folio }) {
  const cadreCarte = (x, carte) => {
    const t = new Toile(1, { halo: null });
    const w = 82, h = 80;
    for (let gx = 4; gx < w - 0.5; gx += 4) t.trait([gx, 0], [gx, h], { c: C.papier, ep: 0.12 });
    for (let gy = 4; gy < h - 0.5; gy += 4) t.trait([0, gy], [w, gy], { c: C.papier, ep: 0.12 });
    t.poly([[0, 0], [w, 0], [w, h], [0, h]], `fill="none" stroke="${C.vif}" stroke-width="0.3"`);
    for (const p of [[0, 0], [w, 0], [0, h], [w, h]]) t.rond(p, 1.25, C.indigo);
    return `<div class="a" style="left:${x - 1.25}mm;top:97.75mm">${t.svg(0).html}</div><div class="a" style="left:${x}mm;top:99mm">${carte.html}</div>`;
  };
  return page({
    rubrique: 'Où on intervient', folio, bande: 80,
    contenu: `
    ${titre(['Sur place dans le Nord.', 'À distance partout ailleurs.'], 20, 41, 104, 'font-size:20pt')}
    ${intro('Tout ce qui demande d’être chez vous se fait chez vous : l’audit, la restitution, la formation des équipes. **Le reste se mène très bien à distance.**')}
    ${A(20, 92, 82, lab('Sur place · Hauts-de-France'))}
    ${A(108, 92, 82, lab('À distance · France et au-delà'))}
    ${cadreCarte(20, carteNord(82, 80))}
    ${cadreCarte(108, carteFrance(82, 80))}
    ${A(20, 184, 82, typo('On part de Valenciennes et de Lille. Le déplacement est sans frais dans un rayon de 60 km ; au-delà, il est écrit dans le devis, jamais ajouté après.'), 'note')}
    ${A(108, 184, 82, typo('Un business plan, un modèle économique, une identité, un site ou un outil : tout cela se mène en visioconférence et par écrit, sans rien changer à la qualité du suivi.'), 'note')}
    ${A(20, 234, 160, md('On ne se met pas de frontière, ni géographique ni sectorielle. **Ce qui compte, c’est que le projet ait du sens et qu’on puisse vous être utiles.**'), '', `font-size:12pt;line-height:1.55;color:${C.gris}`)}`,
  });
}

/* ── Comment on démarre ─────────────────────────────────────── */
function pageDebut({ folio }) {
  return page({
    rubrique: 'Comment on démarre', folio, bande: 201,
    contenu: `
    ${titre(['Trois étapes,', 'et rien d’engagé', 'avant le devis.'])}
    ${intro(PRIX.texte)}
    ${temps(117, DEBUT.map((d) => [d.quand, d.quoi]))}
    ${A(20, 172, 100, lab('Prendre un créneau'))}
    ${A(20, 180, 120, [CONTACT.rdv, CONTACT.mail, CONTACT.tel, CONTACT.site].map(typo).join('<br>'), '', `font-size:13.5pt;line-height:1.72;font-weight:600;color:${C.encre}`)}
    ${A(20, 232, 110, typo('Trente minutes, au téléphone ou en visio. On vous dit franchement si on est les bonnes personnes pour votre sujet, et sinon, on vous oriente.'), 'note')}
    <div class="a" style="left:140mm;top:176mm;opacity:.16">${marque(false, 64)}</div>`,
  });
}

/* ── Dos ────────────────────────────────────────────────────── */
function dos() {
  const fond = reseauFond(
    [[120, 18], [168, 40], [206, 30], [150, 86], [196, 104], [104, 62], [60, 40], [18, 58]],
    [[0, 1], [1, 2], [1, 3], [3, 4], [2, 4], [0, 5], [5, 6], [6, 7], [5, 3]],
  );
  return `
<section class="page indigo">
  ${fond}
  <div class="a" style="left:20mm;top:112mm">${marque(true, 26)}</div>
  ${A(20, 148, 170, ['On va voir vos clients,', 'on construit votre business plan,', 'et on construit la suite.'].map(typo).join('<br>'), '', 'font-size:17pt;line-height:1.28;font-weight:600;color:#fff')}
  ${A(20, 210, 90, [CONTACT.mail, CONTACT.tel, CONTACT.site].map(typo).join('<br>'), '', `font-size:8.2pt;line-height:1.8;color:${C.creme}`)}
  ${A(110, 210, 80, [CONTACT.lieux, `Rendez-vous : ${CONTACT.rdv}`].map(typo).join('<br>'), '', `font-size:8.2pt;line-height:1.8;color:${C.creme}`)}
  ${A(20, 277, 170, typo(CONTACT.legal), '', 'font-size:5.8pt;color:rgba(240,238,232,.55)')}
</section>`;
}

/* ════════════════════════════════════════════════════════════
   LES LIVRETS
   ════════════════════════════════════════════════════════════ */
const SEP = {
  creation: { num: '01', lignes: ['Créer ou', 'reprendre'], sous: E.creation.dit, espace: 'creation', stade: 1, rubrique: '3 à 6 semaines' },
  tpe: { num: '02', lignes: ['1 à 10', 'personnes'], sous: E.tpe.dit, espace: 'tpe', stade: 2, rubrique: '2 à 8 jours de travail' },
  pme: { num: '03', lignes: ['10 à 250', 'personnes'], sous: E.pme.dit, espace: 'pme', stade: 3, rubrique: '2 à 5 jours sur place' },
};
const PAGES_ESPACE = { creation: [pageIdee, pageBP], tpe: [pageTpeA, pageTpeB], pme: [pagePmeA, pagePmeB] };

function livretComplet() {
  return [
    couverture(),
    pagePourQui({ folio: '02' }),
    pageMetiers({ folio: '03' }),
    pageDuo({ folio: '04' }),
    pagePosture({ folio: '05' }),
    pageVie({ folio: '06' }),
    pageCatalogue({ folio: '07' }),
    separateur(SEP.creation), pageIdee({ folio: '09' }), pageBP({ folio: '10' }),
    separateur(SEP.tpe), pageTpeA({ folio: '12' }), pageTpeB({ folio: '13' }),
    separateur(SEP.pme), pagePmeA({ folio: '15' }), pagePmeB({ folio: '16' }),
    pageMarque({ folio: '17' }),
    pageCarte({ folio: '18' }),
    pageDebut({ folio: '19' }),
    dos(),
  ];
}
function livretEspace(id) {
  const [a, b] = PAGES_ESPACE[id];
  return [
    couverture({ sur: id }),
    pagePourQuiEspace(id, { folio: '02' }),
    pageMetiers({ folio: '03' }),
    pageDuo({ folio: '04' }),
    separateur(SEP[id]),
    a({ folio: '06' }),
    b({ folio: '07' }),
    pageDebut({ folio: '08' }),
  ];
}

const documentHtml = (titreDoc, pages) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(titreDoc)}</title><style>${CSS}</style></head><body>${pages.join('\n')}</body></html>`;

/* ── Impression PDF (chrome-headless-shell, jamais Safari) ─── */
function imprimer(html, pdf) {
  return new Promise((ok, ko) => {
    if (existsSync(pdf)) rmSync(pdf);
    const profil = join(tmpdir(), `livret-${process.pid}-${Date.now()}`);
    const p = spawn(CHROME, ['--headless', '--disable-gpu', '--no-sandbox', '--allow-file-access-from-files', `--user-data-dir=${profil}`,
      '--no-pdf-header-footer', '--virtual-time-budget=9000', '--run-all-compositor-stages-before-draw', `--print-to-pdf=${pdf}`, `file://${html}`], { stdio: 'ignore' });
    let taille = -1, stable = 0, tours = 0;
    const t = setInterval(() => {
      tours++;
      if (existsSync(pdf)) {
        const s = statSync(pdf).size;
        stable = s > 0 && s === taille ? stable + 1 : 0;
        taille = s;
      }
      if (stable >= 3 || tours > 240) {
        clearInterval(t);
        try { p.kill('SIGKILL'); } catch { /* déjà fini */ }
        rmSync(profil, { recursive: true, force: true });
        if (stable >= 3) ok(taille); else ko(new Error(`impression bloquée : ${pdf}`));
      }
    }, 500);
  });
}

async function main() {
  mkdirSync(HTML, { recursive: true });
  const cibles = [
    ['Reskope-Livret', 'Le livret Reskope', livretComplet],
    ['Reskope-Livret-Creer-ou-reprendre', 'Livret · Créer ou reprendre', () => livretEspace('creation')],
    ['Reskope-Livret-1-a-10-personnes', 'Livret · 1 à 10 personnes', () => livretEspace('tpe')],
    ['Reskope-Livret-10-a-250-personnes', 'Livret · 10 à 250 personnes', () => livretEspace('pme')],
  ];
  const filtres = process.argv.slice(2);
  for (const [nom, t, faire] of cibles) {
    if (filtres.length && !filtres.some((s) => nom.toLowerCase().includes(s.toLowerCase()))) continue;
    console.log(nom);
    const pages = faire();
    const html = join(HTML, `${nom}.html`);
    writeFileSync(html, documentHtml(t, pages));
    if (process.env.SANS_PDF) { console.log(`  ${pages.length} pages (html seul)`); continue; }
    const taille = await imprimer(html, join(ICI, `${nom}.pdf`));
    console.log(`  ${pages.length} pages · ${Math.round(taille / 1024)} Ko`);
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
