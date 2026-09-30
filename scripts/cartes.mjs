/* ════════════════════════════════════════════════════════════
   LES CARTES DE VISITE, POUR L'IMPRIMEUR ET POUR L'ÉCRAN.

   Format standard : 85 × 55 mm, fond perdu de 3 mm (pages de 91 × 61 mm),
   PDF vectoriel recto verso, polices incorporées. Le dessin
   vient de src/lib/carteVisite.js, le même que la fenêtre « Carte de
   visite » du site et la carte virtuelle.

     node scripts/cartes.mjs              PDF + aperçus dans Impression/Cartes de visite,
                                          et le dessin de la carte virtuelle (carte-visite.js)
     node scripts/cartes.mjs --apercu D   aperçus seulement, dans le dossier D

   Impression par chrome-headless-shell (jamais Safari, qui réduit les pages).
   L'adresse imprimée vient de site.config.mjs (ADRESSE_AFFICHEE).
   ════════════════════════════════════════════════════════════ */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync, rmSync, copyFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir, tmpdir } from 'node:os';
import { CARTE, recto, verso } from '../src/lib/carteVisite.js';

const DEPOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = join(homedir(), 'Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-arm64/chrome-headless-shell');
const args = process.argv.slice(2);
const APERCU = args.includes('--apercu') ? args[args.indexOf('--apercu') + 1] : null;
const SORTIE = APERCU || join(DEPOT, 'Impression', 'Cartes de visite');
const PLAQUETTES = join(homedir(), 'Developer', 'Reskope-Plaquettes', 'Cartes de visite');

const conf = readFileSync(join(DEPOT, 'site.config.mjs'), 'utf8');
const ADRESSE = (conf.match(/^export const ADRESSE_AFFICHEE = '([^']+)'/m) || [])[1] || 'reskope.fr';

const g = JSON.parse(readFileSync(join(DEPOT, 'logo', 'geometrie.json'), 'utf8'));
const GEO = { rNodes: g.r_noeuds, rLinks: g.r_liens, trait: g.trait, noeud: g.noeud, jonction: g.jonction, motD: g.mot_d, rBoite: g.r_boite, motBoite: g.mot_boite, corpsMot: g.corps_mot, baseMot: g.ligne_de_base };

export const PERSONNES = {
  florian: {
    prenom: 'Florian', nom: 'Bouchart', tel: '+33 6 20 23 55 20', mail: 'florian.bouchart@hotmail.fr',
    fr: { titre: 'Cofondateur', domaine: ['Discovery, sites et outils'] },
    en: { titre: 'Co-founder', domaine: ['Discovery, websites and tools'] },
  },
  thomy: {
    prenom: 'Thomy', nom: 'Phanzu', tel: '+33 7 61 25 44 65', mail: 'thomyphanzu@icloud.com',
    fr: { titre: 'Cofondatrice', domaine: ['Business plan, marque', 'et financement'] },
    en: { titre: 'Co-founder', domaine: ['Business plan, brand', 'and funding'] },
  },
};
const personne = (id, lang = 'fr') => ({ ...PERSONNES[id], ...PERSONNES[id][lang] });

const b64 = (f) => readFileSync(join(DEPOT, 'public', 'fonts', f)).toString('base64');
const POLICES = [['ReskopeSans-Regular.woff2', 400], ['ReskopeSans-Medium.woff2', 500], ['ReskopeSans-SemiBold.woff2', 600]]
  .map(([f, w]) => `@font-face{font-family:'Reskope Sans';src:url(data:font/woff2;base64,${b64(f)}) format('woff2');font-weight:${w}}`).join('');

const { W, H, FOND_PERDU: B } = CARTE;
const svgRogne = (corps, px) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${px}" height="${Math.round(px * H / W)}">${corps}</svg>`;
const svgPerdu = (corps) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-B} ${-B} ${W + 2 * B} ${H + 2 * B}" width="91mm" height="61mm">${corps}</svg>`;

/* ── Chrome sans tête : un profil jetable, effacé après chaque passage ── */
function chrome(argsChrome, attendu) {
  return new Promise((ok, ko) => {
    if (existsSync(attendu)) rmSync(attendu);
    const profil = join(tmpdir(), `cartes-${process.pid}-${Date.now()}`);
    const p = spawn(CHROME, ['--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--allow-file-access-from-files',
      `--user-data-dir=${profil}`, '--virtual-time-budget=6000', '--run-all-compositor-stages-before-draw', ...argsChrome], { stdio: 'ignore' });
    let taille = -1, stable = 0, tours = 0;
    const t = setInterval(() => {
      tours++;
      if (existsSync(attendu)) {
        const s = statSync(attendu).size;
        stable = s > 0 && s === taille ? stable + 1 : 0;
        taille = s;
      }
      if (stable >= 2 || tours > 120) {
        clearInterval(t);
        try { p.kill('SIGKILL'); } catch { /* déjà fini */ }
        rmSync(profil, { recursive: true, force: true });
        if (stable >= 2) ok(taille); else ko(new Error(`Chrome bloqué : ${attendu}`));
      }
    }, 400);
  });
}

const html = (corps, style = '') => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>${POLICES}
html,body{margin:0;padding:0}${style}</style></head><body>${corps}</body></html>`;

async function capture(corps, largeur, hauteur, png, style = '') {
  const f = join(tmpdir(), `carte-${process.pid}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(f, html(corps, style));
  await chrome([`--window-size=${largeur},${hauteur}`, '--force-device-scale-factor=1', `--screenshot=${png}`, `file://${f}`], png);
  rmSync(f);
}

async function pdf(pages, sortie) {
  const f = join(tmpdir(), `carte-${process.pid}-${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(f, html(pages.map((p) => `<div class="page">${p}</div>`).join(''),
    '@page{size:91mm 61mm;margin:0}.page{width:91mm;height:61mm;overflow:hidden;break-after:page}.page:last-child{break-after:auto}.page svg{display:block}'));
  await chrome(['--no-pdf-header-footer', `--print-to-pdf=${sortie}`, `file://${f}`], sortie);
  rmSync(f);
}

/* Le masque du vernis sélectif (finition optionnelle) : ce qui est noir sera verni.
   On vernit le grand R ton sur ton du recto et le logo, jamais le texte : sur
   l'indigo mat, le R apparaît quand la carte accroche la lumière. */
function masqueVernis(corps) {
  return corps
    .replace(/<text[\s\S]*?<\/text>/g, '')
    .replace(/^<rect ([^>]*?)fill="#[0-9A-Fa-f]{6}"/, '<rect $1fill="#FFFFFF"')
    .replace(/(fill|stroke)="#(?!FFFFFF)[0-9A-Fa-f]{6}"/g, '$1="#000000"')
    .replace(/ (fill|stroke)-opacity="[\d.]+"/g, '');
}

async function main() {
  mkdirSync(SORTIE, { recursive: true });
  const faces = {};
  for (const id of Object.keys(PERSONNES)) {
    faces[id] = { recto: recto(personne(id), { geo: GEO, adresse: ADRESSE }), verso: verso({ geo: GEO }) };
  }
  // Aperçus à 300 dpi, sans le fond perdu : 85 × 55 mm = 1004 × 650 px.
  for (const [id, f] of Object.entries(faces)) {
    for (const face of ['recto', 'verso']) {
      await capture(svgRogne(f[face], 1004), 1004, 650, join(SORTIE, `apercu-${id}-${face}.png`), 'svg{display:block}');
    }
  }
  // La planche : les deux rectos et le verso, côte à côte.
  const carte = (c) => `<div class="c">${svgRogne(c, 520)}</div>`;
  await capture(`<div class="pl"><div class="col">${carte(faces.florian.recto)}${carte(faces.thomy.recto)}</div>${carte(faces.florian.verso)}</div>`, 1240, 820,
    join(SORTIE, 'planche.png'),
    'body{background:#e6e3dc}.pl{display:flex;gap:56px;justify-content:center;align-items:center;height:820px}.col{display:flex;flex-direction:column;gap:48px}.c{border-radius:16px;overflow:hidden;box-shadow:0 30px 60px -30px rgba(14,11,31,.55),0 2px 6px rgba(14,11,31,.12)}.c svg{display:block}');
  if (APERCU) return console.log('aperçus :', SORTIE);

  for (const [id, f] of Object.entries(faces)) {
    await pdf([svgPerdu(f.recto), svgPerdu(f.verso)], join(SORTIE, `reskope-carte-${id}.pdf`));
  }
  await pdf([svgPerdu(masqueVernis(faces.florian.recto))], join(SORTIE, 'option-vernis-selectif-recto.pdf'));
  // La carte virtuelle : le même dessin, en script classique (la page s'ouvre aussi en double-cliquant).
  const module = readFileSync(join(DEPOT, 'src', 'lib', 'carteVisite.js'), 'utf8').replace(/^export /gm, '');
  writeFileSync(join(DEPOT, 'Carte de visite virtuelle', 'carte-visite.js'),
    `/* Généré par scripts/cartes.mjs depuis src/lib/carteVisite.js : ne pas modifier à la main. */\n(function () {\n${module}\nwindow.CarteVisite = { CARTE, TEXTES, recto, verso, GEO: ${JSON.stringify(GEO)} };\n})();\n`);
  mkdirSync(PLAQUETTES, { recursive: true });
  for (const id of Object.keys(faces)) {
    for (const f of [`reskope-carte-${id}.pdf`, `apercu-${id}-recto.png`, `apercu-${id}-verso.png`]) copyFileSync(join(SORTIE, f), join(PLAQUETTES, f));
  }
  for (const f of ['planche.png', 'option-vernis-selectif-recto.pdf', 'A LIRE avant impression.txt']) if (existsSync(join(SORTIE, f))) copyFileSync(join(SORTIE, f), join(PLAQUETTES, f));
  console.log('adresse imprimée :', ADRESSE, '· PDF et aperçus :', SORTIE, '· copie :', PLAQUETTES);
}

main().catch((e) => { console.error(e); process.exit(1); });
