import { copyFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/* L'espace TPE et PME : une seconde application, construite à côté de
   l'espace créateurs et réunie avec lui dans le même site (voir
   scripts/assembler.mjs). Elle garde ses adresses d'origine, /reskope/tpe/...
   et /reskope/pme/..., et range ses fichiers techniques à part pour ne
   jamais écraser ceux de l'autre application. */
const ICI = dirname(fileURLToPath(import.meta.url))
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BASE, URL_SITE } from '../site.config.mjs'

process.env.VITE_SITE_URL = URL_SITE

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
    const outDir = resolve(ICI, '../dist-tech')
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
  root: ICI,
  /* Les polices, les portraits et le logo sont ceux du site entier. */
  publicDir: resolve(ICI, '../public'),
  base: `${BASE}/`,
  plugins: [react(), securityMeta(), spaFallback()],
  build: {
    outDir: resolve(ICI, '../dist-tech'),
    emptyOutDir: true,
    assetsDir: 'tech-assets',
    // Pas de script inline injecté → script-src 'self' reste strict.
    modulePreload: { polyfill: false },
  },
})
