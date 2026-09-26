import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { LangProvider } from './i18n.jsx';
import { ProfilProvider, useProfil, BASE } from './profil.jsx';

/* ============================================================
   Le site existe en deux versions, et la version vit dans l'adresse :
   /reskope/tpe/... et /reskope/pme/...

   Une fois le basename posé sur /reskope/tpe, chaque <Link to="/offres">
   du site pointe tout seul au bon endroit : pas un lien n'a eu besoin
   d'être réécrit. La clé sur le routeur le force à se remonter quand on
   change de version, sinon il continue de mesurer les chemins avec
   l'ancien préfixe.
   ============================================================ */
function Racine() {
  const { profil } = useProfil();

  /* Pas de version dans l'adresse : ces adresses sont servies par le site
     principal (en ligne comme en développement), qui pose la question à
     l'entrée. Si l'on arrive quand même ici, on y retourne. */
  useEffect(() => {
    if (!profil) window.location.replace(`${BASE}/`);
  }, [profil]);

  if (!profil) return null;

  return (
    <BrowserRouter key={profil} basename={`${BASE}/${profil}`}>
      <App />
    </BrowserRouter>
  );
}

/* L'ancienne entrée rangeait la taille d'entreprise et « porte déjà vue »
   dans le navigateur. La version vit maintenant dans l'adresse : on efface
   ces deux clés, et il ne reste que ce que la politique de confidentialité
   annonce (la langue, et le schéma de l'atelier). */
try {
  localStorage.removeItem('reskope-profil');
  sessionStorage.removeItem('reskope-porte-vue');
} catch { /* stockage indisponible : rien à effacer */ }

/* En développement, le rechargement à chaud réévalue ce module : sans
   ce garde-fou, createRoot est appelé plusieurs fois sur le même nœud et
   React se plaint à chaque sauvegarde. */
const hote = document.getElementById('root');
const racine = hote.__reskopeRoot || createRoot(hote);
hote.__reskopeRoot = racine;

racine.render(
  <LangProvider>
    <ProfilProvider>
      <Racine />
    </ProfilProvider>
  </LangProvider>
);
