import { useSyncExternalStore } from 'react';

/* La marque de la page, lue sur html[data-marque] et suivie quand elle
   change (en naviguant d'un espace à l'autre sans recharger). Voir
   data/marques.js. */
const lire = () => document.documentElement.dataset.marque || 'reskope';

const abonner = (rappel) => {
  const veille = new MutationObserver(rappel);
  veille.observe(document.documentElement, { attributes: true, attributeFilter: ['data-marque'] });
  return () => veille.disconnect();
};

export function useMarque() {
  return useSyncExternalStore(abonner, lire, () => 'reskope');
}
