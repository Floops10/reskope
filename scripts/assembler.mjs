import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/* ════════════════════════════════════════════════════════════
   RÉUNIR LES DEUX ESPACES EN UN SEUL SITE.

   Reskope parle à trois personnes : celle qui crée ou reprend une
   entreprise, le dirigeant d'une TPE, celui d'une PME. Les deux dernières
   ont leur propre application (dossier tech/), aux adresses d'origine
   /reskope/tpe/... et /reskope/pme/... ; la première et l'aiguillage vivent
   dans l'application principale.

   Les deux applications se construisent chacune de leur côté ; ce script
   pose ensuite les pages TPE et PME et leurs fichiers techniques dans le
   dossier final, et fusionne le plan du site et le llms.txt. Un seul
   dossier, une seule publication, une seule adresse.
   ════════════════════════════════════════════════════════════ */

const RACINE = process.cwd();
const DIST = resolve(RACINE, 'dist');
const TECH = resolve(RACINE, 'dist-tech');

if (!existsSync(TECH)) {
  console.error('dist-tech introuvable : lancer « npm run build:tech » avant l’assemblage.');
  process.exit(1);
}

/* Les pages et les fichiers de l'espace TPE et PME. La coquille racine et
   le repli 404 de cette application restent de côté : la racine du site est
   l'aiguillage, et le repli est celui de l'application principale. */
for (const dossier of ['tpe', 'pme', 'tech-assets']) {
  const source = resolve(TECH, dossier);
  if (!existsSync(source)) continue;
  cpSync(source, resolve(DIST, dossier), { recursive: true });
}

/* Le plan du site : une seule liste d'adresses. */
const plan = readFileSync(resolve(DIST, 'sitemap.xml'), 'utf8');
const planTech = readFileSync(resolve(TECH, 'sitemap.xml'), 'utf8');
const entrees = [...planTech.matchAll(/<url>[\s\S]*?<\/url>/g)]
  .map((m) => m[0])
  .filter((u) => /\/(tpe|pme)\//.test(u));
writeFileSync(resolve(DIST, 'sitemap.xml'), plan.replace('</urlset>', `${entrees.map((u) => `  ${u.trim()}`).join('\n')}\n</urlset>`));

/* Le llms.txt : les pages des entreprises à la suite de celles des
   créateurs. */
const llms = readFileSync(resolve(DIST, 'llms.txt'), 'utf8');
const llmsTech = readFileSync(resolve(TECH, 'llms.txt'), 'utf8');
const lignes = llmsTech.split('\n').filter((l) => l.startsWith('- [') && /\/(tpe|pme)\//.test(l));
const tpe = lignes.filter((l) => l.includes('/tpe/'));
const pme = lignes.filter((l) => l.includes('/pme/'));
writeFileSync(resolve(DIST, 'llms.txt'), llms.replace(/\n## Contact/, `\n## Pour les TPE, de 1 à 10 personnes\n${tpe.join('\n')}\n\n## Pour les PME, de 10 à 250 personnes\n${pme.join('\n')}\n\n## Contact`));

rmSync(TECH, { recursive: true, force: true });
console.log(`Assemblage : ${entrees.length} pages TPE et PME réunies au site.`);
