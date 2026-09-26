/* ════════════════════════════════════════════════════════════
   APERÇU DU SITE ASSEMBLÉ — comme GitHub Pages le servira.

   Les deux applications (l'espace « en projet » et l'espace TPE/PME) ne se
   voient ensemble qu'une fois construites et réunies dans dist/. Ce petit
   serveur les sert sous /reskope/ avec les mêmes règles que GitHub Pages :
   un dossier sert son index.html, un dossier sans barre finale est redirigé,
   une adresse inconnue reçoit 404.html avec le statut 404.

     npm run build && npm run apercu     puis http://localhost:5190/reskope/
   ════════════════════════════════════════════════════════════ */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const BASE = '/reskope';
const PORT = Number(process.env.PORT) || 5190;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json',
  '.mp4': 'video/mp4', '.webm': 'video/webm',
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const chemin = decodeURIComponent(url.pathname);
  if (!chemin.startsWith(BASE)) {
    res.writeHead(302, { Location: `${BASE}/` });
    res.end();
    return;
  }
  let fichier = join(DIST, chemin.slice(BASE.length));
  if (!fichier.startsWith(DIST)) {
    res.writeHead(403);
    res.end();
    return;
  }
  try {
    if ((await stat(fichier)).isDirectory()) {
      if (!chemin.endsWith('/')) {
        res.writeHead(301, { Location: `${chemin}/${url.search}` });
        res.end();
        return;
      }
      fichier = join(fichier, 'index.html');
    }
    const corps = await readFile(fichier);
    res.writeHead(200, { 'Content-Type': TYPES[extname(fichier)] || 'application/octet-stream' });
    res.end(corps);
  } catch {
    const corps = await readFile(join(DIST, '404.html'));
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(corps);
  }
}).listen(PORT, () => console.log(`Site assemblé : http://localhost:${PORT}${BASE}/`));
