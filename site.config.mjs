/* ════════════════════════════════════════════════════════════
   L'ADRESSE DU SITE, EN UN SEUL ENDROIT.

   Aujourd'hui le site est servi par GitHub Pages sous
   https://floops10.github.io/reskope/. Le jour où le nom de domaine est
   branché (GitHub Pages, « Custom domain »), il suffit d'écrire ici :

     export const DOMAINE = 'reskope.fr';

   Le site passe alors à la racine (https://reskope.fr/) : les deux
   applications, le pré-rendu (canoniques, plan du site, robots.txt,
   llms.txt, données structurées), les renvois des anciennes adresses et les
   cartes de visite suivent, et la construction écrit dist/CNAME pour que
   GitHub Pages garde le domaine à chaque publication.
   ════════════════════════════════════════════════════════════ */

export const DOMAINE = null;

/** L'origine, sans barre finale : « https://floops10.github.io ». */
export const ORIGINE = DOMAINE ? `https://${DOMAINE}` : 'https://floops10.github.io';

/** Le chemin du site sous l'origine, sans barre finale : « /reskope », ou « » à la racine. */
export const BASE = DOMAINE ? '' : '/reskope';

/** L'adresse complète de l'accueil, avec sa barre finale. */
export const URL_SITE = `${ORIGINE}${BASE}/`;

/** L'adresse telle qu'on l'imprime (cartes de visite) : le nom de domaine
    choisi, reskope.fr, même avant qu'il soit branché. */
export const ADRESSE_AFFICHEE = 'reskope.fr';
