import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
  SITE, PAGES, url, fiche, RENOMMEES, ANCIENS_PROFILS, ANCIENNES_ROUTES, nouvelleAdresse,
} from '../src/data/seo.js';
import { OFFRES, OFFRE } from '../src/data/offres.js';

/* ════════════════════════════════════════════════════════════
   LE PRÉ-RENDU — écrire un vrai fichier par adresse.

   Le site est une application à routage client. Sur GitHub Pages, une adresse
   qui ne correspond à aucun fichier renvoie 404. Ce script tourne après
   `vite build`. Il reprend la coquille produite par Vite et en écrit une copie
   par adresse, avec :
     - le titre, la description et la canonique de CETTE page
     - ses balises de partage et son schema
     - un contenu lisible sans JavaScript, et les liens vers les autres pages

   Le contenu statique est posé DANS #root : React le remplace au montage. Un
   robot qui n'exécute pas le JavaScript lit donc du vrai texte et suit de
   vrais liens, et un visiteur voit l'application. Ce qui est écrit dans le
   HTML est ce que la page raconte : il n'y a pas deux versions du discours.

   Il écrit aussi une page de renvoi pour chaque adresse de l'ancienne version
   du site (/tpe/..., /pme/..., /offres...) : elles ont été partagées et
   indexées, elles ne doivent pas mourir en 404.
   ════════════════════════════════════════════════════════════ */

const DIST = resolve(process.cwd(), 'dist');
const ech = (t) => String(t)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

const coquille = readFileSync(resolve(DIST, 'index.html'), 'utf8');

/* On retire de la coquille tout ce qui est propre à une page, pour le
   réécrire ensuite. Sans ça, la canonique de l'accueil serait recopiée sur
   toutes les autres adresses. */
function nettoyer(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '<!--TITRE-->')
    .replace(/<meta\s+name="description"[\s\S]*?\/>/i, '')
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/i, '')
    .replace(/<meta\s+property="og:(title|description|url|type)"[\s\S]*?\/>/gi, '')
    .replace(/<meta\s+name="twitter:(title|description)"[\s\S]*?\/>/gi, '')
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/i, '<!--SCHEMA-->');
}
const base = nettoyer(coquille);

/* ── Le schema ──────────────────────────────────────────────
   Deux fondateurs, pas d'adresse e-mail tant que la boîte n'existe pas, et
   pas de prix : le site n'en affiche aucun. Un balisage qui ment est pire
   que pas de balisage. */
const CABINET = {
  '@type': 'ProfessionalService',
  '@id': `${SITE.origine}${SITE.base}/#cabinet`,
  name: SITE.marque,
  slogan: 'On vous aide à décider, et on construit la suite.',
  description: 'On interroge les clients des dirigeants de TPE et de PME, on relit leur business plan avec les yeux d’un financeur, et on construit seulement ce qui a été validé.',
  url: `${SITE.origine}${SITE.base}/`,
  image: `${SITE.origine}${SITE.base}${SITE.image}`,
  founder: [
    { '@type': 'Person', name: 'Thomy Delzenne' },
    { '@type': 'Person', name: 'Florian Bouchart' },
  ],
  areaServed: [
    { '@type': 'AdministrativeArea', name: SITE.region },
    { '@type': 'City', name: 'Valenciennes' },
    { '@type': 'City', name: 'Lille' },
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Valenciennes',
    addressRegion: SITE.region,
    addressCountry: 'FR',
  },
  knowsLanguage: ['fr'],
};

const PARENT = {
  '/tester-une-idee': '/nos-offres',
  '/comprendre-vos-clients': '/nos-offres',
  '/relire-votre-dossier': '/nos-offres',
  '/exemple-bilan': '/exemple',
};

function service(o) {
  return {
    '@type': 'Service',
    name: o.nom,
    description: o.accroche,
    serviceType: o.pole === 'bp' ? 'Business plan et financement' : o.pole === 'construire' ? 'Réalisation' : 'Discovery',
    provider: { '@id': CABINET['@id'] },
    areaServed: CABINET.areaServed,
    ...(o.slug ? { url: url(o.slug) } : {}),
  };
}

function schemaDe(route, f) {
  const adresse = url(route);
  const fil = [{ '@type': 'ListItem', position: 1, name: 'Accueil', item: url('/') }];
  if (PARENT[route]) fil.push({ '@type': 'ListItem', position: 2, name: fiche(PARENT[route]).fil, item: url(PARENT[route]) });
  if (route !== '/') fil.push({ '@type': 'ListItem', position: fil.length + 1, name: f.fil, item: adresse });

  const blocs = [
    {
      '@type': 'WebPage',
      '@id': `${adresse}#page`,
      url: adresse,
      name: `${f.titre} · ${SITE.marque}`,
      description: f.description,
      inLanguage: 'fr',
      isPartOf: { '@type': 'WebSite', name: SITE.marque, url: url('/') },
      about: { '@id': CABINET['@id'] },
    },
    { '@type': 'BreadcrumbList', itemListElement: fil },
  ];

  if (route === '/') blocs.push(CABINET);
  if (f.porte) blocs.push(service(OFFRE[f.porte]));
  if (route === '/nos-offres') {
    blocs.push({
      '@type': 'ItemList',
      name: f.titre,
      itemListElement: OFFRES.filter((o) => o.statut !== 'plustard').map((o, i) => ({
        '@type': 'ListItem', position: i + 1, item: service(o),
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': blocs };
}

/* ── Le contenu lisible sans JavaScript ─────────────────────
   Le titre, le résumé, et pour les trois missions ce que la page affiche :
   les faits, à qui elle s'adresse, ce qu'on reçoit et les questions. Puis
   les liens vers les autres pages. React remplace ce bloc au montage. */
function corps(route, f) {
  const liens = PAGES
    .filter((p) => p.route !== route)
    .map((p) => `<li><a href="${url(p.route)}">${ech(p.titre)}</a></li>`)
    .join('');

  let detail = '';
  if (f.porte) {
    const o = OFFRE[f.porte];
    detail = `
      <p>« ${ech(o.amorce)} »</p>
      <dl>
        <dt>Durée</dt><dd>${ech(o.faits.duree)}</dd>
        <dt>Votre temps</dt><dd>${ech(o.faits.temps)}</dd>
        <dt>Prix</dt><dd>${ech(o.faits.prix)}</dd>
        <dt>Vous recevez</dt><dd>${ech(o.faits.livre)}</dd>
      </dl>
      <h2>C’est pour vous si</h2>
      <ul>${o.pourVous.map((t) => `<li>${ech(t)}</li>`).join('')}</ul>
      <h2>Ce que vous recevez</h2>
      <ul>${o.recevez.map((t) => `<li>${ech(t)}</li>`).join('')}</ul>
      <h2>Les questions qu’on nous pose</h2>
      ${o.faq.map((q) => `<h3>${ech(q.q)}</h3><p>${ech(q.r)}</p>`).join('')}`;
  }

  return `<div class="pre-seo">
      <h1>${ech(f.h1)}</h1>
      <p>${ech(f.resume)}</p>${detail}
      <nav aria-label="Pages du site"><ul>${liens}</ul></nav>
      <p>Reskope, Thomy et Florian, à Valenciennes et à Lille. On vous aide à décider, et on construit la suite.</p>
    </div>`;
}

function page(route, f) {
  const adresse = url(route);
  const titre = `${f.titre} · ${SITE.marque}`;
  const tete = [
    `<meta name="description" content="${ech(f.description)}" />`,
    `<link rel="canonical" href="${adresse}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${ech(titre)}" />`,
    `<meta property="og:description" content="${ech(f.description)}" />`,
    `<meta property="og:url" content="${adresse}" />`,
    `<meta name="twitter:title" content="${ech(titre)}" />`,
    `<meta name="twitter:description" content="${ech(f.description)}" />`,
  ].join('\n    ');

  return base
    .replace('<!--TITRE-->', `<title>${ech(titre)}</title>\n    ${tete}`)
    .replace('<!--SCHEMA-->', `<script type="application/ld+json">${JSON.stringify(schemaDe(route, f))}</script>`)
    .replace('<div id="root"></div>', `<div id="root">${corps(route, f)}</div>`);
}

/* Une ancienne adresse : un renvoi immédiat, une canonique vers la nouvelle
   page, et un lien pour qui n'aurait pas été renvoyé. Aucun script : la
   balise suffit, et les moteurs la traitent comme une redirection. */
function renvoi(cible) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${cible}" />
    <link rel="canonical" href="${cible}" />
    <title>Cette page a déménagé · ${SITE.marque}</title>
  </head>
  <body>
    <p>Cette page a déménagé : <a href="${cible}">la retrouver sur le site Reskope dédié à vos outils numériques</a>.</p>
  </body>
</html>
`;
}

function ecrire(chemin, contenu) {
  const cible = resolve(DIST, chemin);
  mkdirSync(dirname(cible), { recursive: true });
  writeFileSync(cible, contenu);
}

/* ── Production ─────────────────────────────────────────────── */
for (const p of PAGES) {
  const chemin = p.route === '/' ? 'index.html' : `${p.route.slice(1)}/index.html`;
  ecrire(chemin, page(p.route, p));
}

/* Le repli du routage client reste la coquille NUE : une adresse inconnue ne
   doit pas se faire passer pour l'accueil. */
ecrire('404.html', coquille);

/* Les anciennes adresses. */
let renvois = 0;
const anciennes = [
  ...ANCIENS_PROFILS.flatMap((profil) => ANCIENNES_ROUTES.map((route) => `/${profil}${route === '/' ? '' : route}`)),
  ...RENOMMEES,
];
for (const ancienne of anciennes) {
  ecrire(`${ancienne.slice(1)}/index.html`, renvoi(nouvelleAdresse(ancienne)));
  renvois += 1;
}

const jour = new Date().toISOString().slice(0, 10);
ecrire('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((p) => `  <url><loc>${url(p.route)}</loc><lastmod>${jour}</lastmod><changefreq>${p.freq}</changefreq><priority>${p.priorite}</priority></url>`).join('\n')}
</urlset>
`);

/* llms.txt : la carte du site pour les moteurs de réponse. Google l'ignore,
   mais il coûte trois lignes et les autres commencent à le lire. */
const portes = PAGES.filter((p) => p.porte);
const autres = PAGES.filter((p) => !p.porte && parseFloat(p.priorite) >= 0.5);
ecrire('llms.txt', `# Reskope

> On vous aide à décider, et on construit la suite. Reskope accompagne les
> dirigeants de TPE et de PME des Hauts-de-France au moment où ils
> s'apprêtent à engager de l'argent : on interroge leurs clients, on relit
> leur business plan avec les yeux d'un financeur, et on construit seulement
> ce qui a été validé. Thomy et Florian, à Valenciennes et à Lille.

## Pour commencer
${portes.map((p) => `- [${p.titre}](${url(p.route)}) : ${p.description}`).join('\n')}

## Le site
${autres.map((p) => `- [${p.titre}](${url(p.route)}) : ${p.description}`).join('\n')}

## Contact
Formulaire : ${url('/contact')}
`);

console.log(`Pré-rendu : ${PAGES.length} pages, ${renvois} renvois, plan du site et llms.txt écrits dans dist/`);
