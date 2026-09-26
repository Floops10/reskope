import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE, URL_SITE } from './site.config.mjs'

/* Les pages d'entrée (index.html) lisent l'adresse du site ici :
   %VITE_SITE_URL% y est remplacé à la construction. */
process.env.VITE_SITE_URL = URL_SITE

const ICI = dirname(fileURLToPath(import.meta.url))

/* UN SEUL SERVEUR DE DÉVELOPPEMENT POUR TOUT LE SITE.
   En ligne, les deux applications sont réunies dans dist/ : l'espace « en
   projet » (ici) et l'espace TPE/PME (tech/). En développement, ce serveur
   sert aussi le second : toute page sous /reskope/tpe ou /reskope/pme reçoit
   la page d'entrée de tech/, dont le script est lu depuis tech/src. On passe
   d'un espace à l'autre comme en ligne, sans second serveur ni message
   d'attente. */
const entreprisesEnDev = () => ({
  name: 'reskope-entreprises-en-dev',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url || ''
      const chemin = url.split('?')[0]
      if (req.method !== 'GET' && req.method !== 'HEAD') return next()
      if (!new RegExp(`^${BASE}/(tpe|pme)(/|$)`).test(chemin)) return next()
      if (/\.[a-z0-9]+$/i.test(chemin)) return next()
      try {
        const brut = readFileSync(resolve(ICI, 'tech/index.html'), 'utf8')
          .replace('src="/src/main.jsx"', 'src="/tech/src/main.jsx"')
        const html = await server.transformIndexHtml(url, brut)
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
      } catch (e) {
        next(e)
      }
    })
  },
})

/* GitHub Pages ne route que des fichiers réels : un lien direct, un favori ou
   une actualisation sur /reskope/contact (route gérée côté client par React
   Router) renvoie une vraie 404 GitHub, PAS notre app. Astuce standard : on
   copie index.html en 404.html au build. GitHub Pages sert alors 404.html
   (donc notre app) pour toute route inconnue, et React Router prend la main
   pour afficher la bonne page. */
const spaFallback = () => ({
  name: 'reskope-spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const outDir = resolve(process.cwd(), 'dist')
    const index = resolve(outDir, 'index.html')
    if (existsSync(index)) copyFileSync(index, resolve(outDir, '404.html'))
  },
})

/* En-têtes de sécurité (CSP + Referrer-Policy) injectés en <meta> UNIQUEMENT
   au build de production. En dev, on ne les injecte pas pour ne pas casser le
   HMR (WebSocket) de Vite. GitHub Pages ne permet pas d'en-têtes HTTP, d'où la
   balise <meta> (frame-ancestors n'y est pas géré par les navigateurs : la
   protection anti-iframe n'est pas possible sur Pages, ce qui est sans impact
   réel pour un site vitrine sans authentification). */
/* Cal.com (prise de rendez-vous) est autorisé NOMMÉMENT, jamais par joker :
   embed.js est servi par app.cal.com, et le pop-up ouvre une iframe cal.com.
   Sans ces trois entrées, le navigateur bloque le script et le bouton retombe
   silencieusement sur le formulaire de contact. */
const CAL_SRC = 'https://app.cal.com https://cal.com'

const CSP = [
  "default-src 'self'",
  `script-src 'self' ${CAL_SRC}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  `connect-src 'self' https://formsubmit.co ${CAL_SRC}`,
  `frame-src 'self' ${CAL_SRC}`,
  "form-action 'self' https://formsubmit.co",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

const securityMeta = () => ({
  name: 'reskope-security-meta',
  apply: 'build',
  transformIndexHtml(html) {
    const tags =
      `    <meta http-equiv="Content-Security-Policy" content="${CSP}" />\n` +
      `    <meta name="referrer" content="strict-origin-when-cross-origin" />\n`
    return html.replace('</head>', `${tags}  </head>`)
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: `${BASE}/`,
  plugins: [react(), securityMeta(), spaFallback(), entreprisesEnDev()],
  /* Les dépendances des deux applications sont préparées dès le démarrage :
     ouvrir l'espace TPE/PME ne provoque pas de rechargement. */
  optimizeDeps: { entries: ['src/main.jsx', 'tech/src/main.jsx'] },
  build: {
    // Pas de script inline injecté → script-src 'self' reste strict.
    modulePreload: { polyfill: false },
  },
})
