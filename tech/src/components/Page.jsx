import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProfil } from '../profil';
import { fiche, url } from '../data/seo';
import { MARQUE_DE_L_ESPACE, nomComplet } from '../data/marques';

/* Enveloppe de page : contenu toujours visible (les entrées sont portées par
   les <Reveal>). Elle tient aussi les balises de référencement.

   Le build écrit déjà un fichier HTML complet par adresse (voir
   scripts/prerender.mjs) : c'est ce que lisent les moteurs. Mais dès qu'on
   navigue à l'intérieur du site, plus aucune page n'est rechargée — il faut
   donc remettre à jour le titre, la description, la CANONIQUE et les balises
   de partage à la main. Sans la canonique, un lien copié depuis la barre
   d'adresse pendant la navigation renvoyait vers l'accueil.

   La fiche vient de src/data/seo.js, la même table que le pré-rendu : ce que
   le visiteur a sous les yeux et ce que le robot a lu ne peuvent pas diverger. */

function baliser(selecteur, attribut, cle, valeur) {
  let el = document.head.querySelector(selecteur);
  if (!el) {
    el = document.createElement(selecteur.startsWith('link') ? 'link' : 'meta');
    el.setAttribute(attribut, cle);
    document.head.appendChild(el);
  }
  el.setAttribute(selecteur.startsWith('link') ? 'href' : 'content', valeur);
}

export default function Page({ children, title, description }) {
  const { pathname } = useLocation();
  const { profil } = useProfil();

  useEffect(() => {
    /* Une adresse pré-rendue se termine par une barre (/offres/), une adresse
       atteinte par navigation interne non (/offres). C'est la même page : on
       range la barre avant de chercher la fiche. */
    const route = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
    const f = fiche(profil || 'pme', route);
    const t = f ? f.titre : title;
    const d = f ? f.description : description;
    /* Le nom de la marque : « · Reskope Define » pour les TPE, « · Reskope Elevate » pour les PME. */
    const nom = nomComplet(MARQUE_DE_L_ESPACE[profil]);
    const complet = t ? `${t} · ${nom}` : `${nom} · Conseil et ingénierie numérique`;

    document.title = complet;
    if (d) {
      baliser('meta[name="description"]', 'name', 'description', d);
      baliser('meta[property="og:description"]', 'property', 'og:description', d);
      baliser('meta[name="twitter:description"]', 'name', 'twitter:description', d);
    }
    baliser('meta[property="og:title"]', 'property', 'og:title', complet);
    baliser('meta[name="twitter:title"]', 'name', 'twitter:title', complet);

    const adresse = url(profil, route);
    baliser('link[rel="canonical"]', 'rel', 'canonical', adresse);
    baliser('meta[property="og:url"]', 'property', 'og:url', adresse);
  }, [pathname, profil, title, description]);

  return <main>{children}</main>;
}
