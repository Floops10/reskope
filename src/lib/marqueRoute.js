import { marqueDeLaRouteDuSite } from '../data/marques';

/* ════════════════════════════════════════════════════════════
   LA MARQUE D'UNE ADRESSE DU SITE PRINCIPAL.

   Les pages de l'espace « en projet » parlent au nom de Reskope Create.
   L'accueil parle au nom de Reskope. Les pages de la maison (qui on est,
   contact, mentions) gardent la marque d'où l'on vient : quelqu'un qui lit
   Create et clique sur « Nous écrire » reste chez Create ; arrivé
   directement, il est chez Reskope. Rien n'est enregistré : la mémoire dure
   le temps de la visite, dans la page.

   La correspondance elle-même vit dans data/marques.js, partagée avec
   l'espace des entreprises (Define et Elevate).
   ════════════════════════════════════════════════════════════ */

let derniere = 'reskope';

/** La marque d'une route de l'application (« /creation » → « create »). */
export function marqueDeLaRoute(route) {
  derniere = marqueDeLaRouteDuSite(route, derniere);
  return derniere;
}

/** Même chose pour une adresse complète, base du site comprise. */
export function marqueDeLAdresse(pathname) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const route = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return marqueDeLaRoute(route || '/');
}
