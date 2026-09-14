import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Porte from './pages/Porte.jsx';
import { LangProvider } from './i18n.jsx';
import {
  ProfilProvider, useProfil, profilMemorise, cheminInterne, BASE,
} from './profil.jsx';

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
  const { profil, adopter } = useProfil();

  /* Pas de version dans l'adresse. Deux cas se règlent tout seuls :
     - on a déjà choisi lors d'une visite précédente : on entre
       directement, sans repasser par la porte ;
     - un lien profond ancien (/reskope/offres) : on le rattache à la
       version PME, celle du contenu historique, plutôt que de laisser
       une page vide ou une 404.
     La réécriture se fait dans un effet, pas pendant le rendu : React
     n'aime pas qu'on touche à l'historique en plein rendu, et la règle
     vaut aussi quand ça « marche quand même ». */
  const memoire = profilMemorise();
  const interne = cheminInterne();
  const aRattacher = !profil && (memoire || interne !== '/') ? (memoire || 'pme') : null;

  useEffect(() => {
    if (!aRattacher) return;
    const dest = `${BASE}/${aRattacher}${interne === '/' ? '' : interne}`;
    window.history.replaceState({}, '', dest + window.location.search + window.location.hash);
    adopter(aRattacher);
  }, [aRattacher, interne, adopter]);

  if (!profil) return aRattacher ? null : <Porte />;

  return (
    <BrowserRouter key={profil} basename={`${BASE}/${profil}`}>
      <App />
    </BrowserRouter>
  );
}

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
