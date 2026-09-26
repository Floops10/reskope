import { CAL_LINK } from '../data/site';

/* Prise de rendez-vous Cal.com — chargement à la demande.

   Parti pris de confidentialité : le script Cal.com n'est JAMAIS chargé au
   rendu d'une page. Il l'est à la première interaction volontaire (clic sur
   un bouton « prendre rendez-vous »). Tant que personne ne clique, aucune
   requête ne part vers un tiers — ce qui permet d'écrire noir sur blanc dans
   la politique de confidentialité que rien n'est transmis sans action. */

const CAL_EMBED = 'https://app.cal.com/embed/embed.js';

/* Valeur laissée par défaut dans site.js : tant qu'elle n'a pas été remplacée
   par un vrai lien, on n'ouvre PAS le pop-up (il afficherait une page Cal.com
   inexistante). Les boutons se comportent alors comme de simples liens vers
   le formulaire de contact. Dès que le lien est renseigné, le pop-up s'active
   partout, sans autre modification. */
const PLACEHOLDER = 'reskope/30min';
export const isCalConfigured = CAL_LINK !== PLACEHOLDER && Boolean(CAL_LINK);

let calPromise = null;
let watching = false;

/* Le site masque le curseur système (`cursor: none` sur `*`) au profit d'un
   curseur maison en z-index 9998. La modale Cal.com passe AU-DESSUS : plus
   aucun pointeur n'était visible une fois l'agenda ouvert, donnant
   l'impression que la page ne répondait plus.

   On surveille donc la présence de <cal-modal-box> et on pose une classe sur
   <html> : le CSS rend alors le curseur natif et masque le curseur maison,
   le temps que la modale reste ouverte. */
function watchModalForCursor() {
  if (watching || typeof document === 'undefined') return;
  watching = true;
  const root = document.documentElement;
  const sync = () => {
    root.classList.toggle('has-overlay', Boolean(document.querySelector('cal-modal-box')));
  };
  new MutationObserver(sync).observe(document.body, { childList: true, subtree: true });
  sync();
}

function bootstrap() {
  return new Promise((resolve, reject) => {
    /* Amorce officielle Cal.com : installe la file d'attente puis le script */
    (function (C, A, L) {
      const p = (a, ar) => { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const s = d.createElement('script');
          s.src = A;
          s.async = true;
          s.onload = () => resolve(C.Cal);
          s.onerror = () => reject(new Error('cal-embed-failed'));
          d.head.appendChild(s);
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === 'string') { cal.ns[namespace] = api; p(api, ar); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, CAL_EMBED, 'init');

    window.Cal('init', { origin: 'https://cal.com' });
    /* Habillage aux couleurs de la marque */
    window.Cal('ui', {
      styles: { branding: { brandColor: '#1c0cb3' } },
      hideEventTypeDetails: false,
      layout: 'month_view',
    });

    /* Filet de sécurité : si le script était déjà en cache navigateur,
       l'événement onload peut ne pas repasser. */
    setTimeout(() => resolve(window.Cal), 1500);
  });
}

/** Charge Cal.com (une seule fois) puis ouvre l'agenda en pop-up.
    Rejette si le lien n'est pas encore configuré : l'appelant retombe alors
    sur son comportement de repli (navigation vers /contact). */
export function openCalModal() {
  if (!isCalConfigured) return Promise.reject(new Error('cal-not-configured'));
  if (!calPromise) calPromise = bootstrap();
  return calPromise.then((Cal) => {
    watchModalForCursor();
    Cal('modal', { calLink: CAL_LINK, config: { layout: 'month_view' } });
  });
}

/** Lien de repli, si le pop-up ne peut pas s'ouvrir. */
export const CAL_FALLBACK_URL = `https://cal.com/${CAL_LINK}`;
