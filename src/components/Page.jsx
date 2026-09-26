import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE, fiche, url } from '../data/seo';

/* Enveloppe de page. Elle tient aussi les balises de référencement.

   Le build écrit déjà un fichier HTML complet par adresse (voir
   scripts/prerender.mjs) : c'est ce que lisent les moteurs. Mais dès qu'on
   navigue à l'intérieur du site, plus aucune page n'est rechargée : il faut
   donc remettre à jour le titre, la description, la canonique et les balises
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

export default function Page({ children, title, description, className }) {
  const { pathname } = useLocation();

  useEffect(() => {
    /* Une adresse pré-rendue se termine par une barre (/contact/), une
       adresse atteinte par navigation interne non. C'est la même page. */
    const route = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
    const f = fiche(route);
    const t = f ? f.titre : title;
    const d = f ? f.description : description;
    const complet = t ? `${t} · ${SITE.marque}` : `${SITE.marque} · On vous aide à décider, et on construit la suite`;

    document.title = complet;
    if (d) {
      baliser('meta[name="description"]', 'name', 'description', d);
      baliser('meta[property="og:description"]', 'property', 'og:description', d);
      baliser('meta[name="twitter:description"]', 'name', 'twitter:description', d);
    }
    baliser('meta[property="og:title"]', 'property', 'og:title', complet);
    baliser('meta[name="twitter:title"]', 'name', 'twitter:title', complet);

    const adresse = url(route);
    baliser('link[rel="canonical"]', 'rel', 'canonical', adresse);
    baliser('meta[property="og:url"]', 'property', 'og:url', adresse);
  }, [pathname, title, description]);

  return <main id="contenu" className={className}>{children}</main>;
}
