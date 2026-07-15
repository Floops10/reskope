import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://formsubmit.co",
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
  base: '/reskope/',
  plugins: [react(), securityMeta(), spaFallback()],
  build: {
    // Pas de script inline injecté → script-src 'self' reste strict.
    modulePreload: { polyfill: false },
  },
})
