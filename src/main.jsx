import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import './styles/v5.css';
import './styles/marques.css';
import App from './App.jsx';
import { LangProvider } from './i18n.jsx';

/* ============================================================
   Un seul site, à plat : /reskope/tester-une-idee, /reskope/contact...

   Il a existé en deux versions, TPE et PME, avec une porte d'entrée qui
   posait la question avant tout le reste. Le site parle maintenant à une
   seule personne, le dirigeant qui s'apprête à engager de l'argent, et ce
   sont ses trois situations qui servent de porte : elles sont sur l'accueil,
   pas devant. Les anciennes adresses sont renvoyées vers leurs pages
   actuelles (voir src/data/seo.js).
   ============================================================ */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/* En développement, le rechargement à chaud réévalue ce module : sans
   ce garde-fou, createRoot est appelé plusieurs fois sur le même nœud et
   React se plaint à chaque sauvegarde. */
const hote = document.getElementById('root');
const racine = hote.__reskopeRoot || createRoot(hote);
hote.__reskopeRoot = racine;

racine.render(
  <LangProvider>
    <BrowserRouter basename={BASE || '/'}>
      <App />
    </BrowserRouter>
  </LangProvider>
);
