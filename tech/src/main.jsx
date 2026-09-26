import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { LangProvider } from './i18n.jsx';
import { ProfilProvider, useProfil, cheminInterne, BASE } from './profil.jsx';

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

  /* Pas de version dans l'adresse. En ligne, ça n'arrive pas : toutes les
     adresses sans /tpe ni /pme sont servies par le site principal, qui
     pose la question (l'aiguillage) et renvoie les anciens liens profonds
     vers leur page. Ce cas ne se présente donc qu'en développement, où ce
     serveur tourne seul :
     - une adresse profonde sans version (/reskope/offres) est rattachée à
       la version PME, celle du contenu historique ;
     - la racine renvoie vers l'aiguillage du site principal, ou, en
       développement, propose les deux espaces.
     La réécriture se fait dans un effet, pas pendant le rendu. */
  const interne = cheminInterne();
  const aRattacher = !profil && interne !== '/' ? 'pme' : null;

  useEffect(() => {
    if (!aRattacher) return;
    const dest = `${BASE}/${aRattacher}${interne}`;
    window.history.replaceState({}, '', dest + window.location.search + window.location.hash);
    adopter(aRattacher);
  }, [aRattacher, interne, adopter]);

  useEffect(() => {
    if (profil || aRattacher || import.meta.env.DEV) return;
    window.location.replace(`${BASE}/`);
  }, [profil, aRattacher]);

  if (!profil) return aRattacher || !import.meta.env.DEV ? null : <ChoixDev />;

  return (
    <BrowserRouter key={profil} basename={`${BASE}/${profil}`}>
      <App />
    </BrowserRouter>
  );
}

/* En développement seulement : l'aiguillage vit dans le site principal
   (npm run dev), ce serveur-ci ne sert que les espaces des entreprises. */
function ChoixDev() {
  const lien = { display: 'block', margin: '0.6rem 0', color: '#1c0cb3', fontSize: '1.4rem' };
  return (
    <main style={{ padding: '18vh 8vw', fontFamily: 'system-ui, sans-serif', color: '#0e0b1f' }}>
      <p style={{ color: '#5c5951' }}>Espaces des entreprises, en développement. L’aiguillage est servi par le site principal.</p>
      <a style={lien} href={`${BASE}/tpe/`}>Espace TPE, de 1 à 10 personnes</a>
      <a style={lien} href={`${BASE}/pme/`}>Espace PME, de 10 à 250 personnes</a>
    </main>
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
