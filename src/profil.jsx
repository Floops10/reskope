import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLang } from './i18n';

/* ============================================================
   DEUX SITES DANS UN SITE.

   Reskope sert deux contenus : celui d'une TPE et celui d'une PME. Un
   audit poste par poste chez une entreprise de trois personnes n'a aucun
   sens, et l'inverse non plus.

   La première version basculait le contenu en place, le profil caché
   dans le stockage local. Résultat : on changeait de site sans jamais
   savoir sur lequel on était. Le profil vit donc maintenant DANS
   L'ADRESSE — /tpe/offres et /pme/offres sont deux pages différentes.

   Ce que ça règle, et qu'aucun réglage caché ne pouvait régler :
   - on sait toujours où on est, c'est écrit dans la barre d'adresse ;
   - un lien envoyé à quelqu'un ouvre la bonne version ;
   - « précédent » et « suivant » font ce qu'on attend ;
   - chaque version s'indexe séparément.

   Techniquement tout tient dans le `basename` du routeur : une fois posé
   sur /reskope/tpe, chaque <Link to="/offres"> du site pointe tout seul
   au bon endroit. Pas un lien n'a eu besoin d'être réécrit.
   ============================================================ */

export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const PROFILS = ['tpe', 'pme'];
const CLE = 'reskope-profil';

/** Le profil lu dans l'adresse, ou null si l'adresse n'en porte pas. */
export function profilDeLUrl(pathname = window.location.pathname) {
  const reste = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const seg = reste.replace(/^\//, '').split('/')[0];
  return PROFILS.includes(seg) ? seg : null;
}

/** Le chemin à l'intérieur d'une version (sans la base ni le profil). */
export function cheminInterne(pathname = window.location.pathname) {
  const reste = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const parts = reste.replace(/^\//, '').split('/');
  if (PROFILS.includes(parts[0])) parts.shift();
  const p = parts.filter(Boolean).join('/');
  return p ? `/${p}` : '/';
}

export function profilMemorise() {
  try {
    const s = localStorage.getItem(CLE);
    return PROFILS.includes(s) ? s : null;
  } catch {
    return null;
  }
}

const ProfilContext = createContext({ profil: null, setProfil: () => {}, adopter: () => {} });

export function ProfilProvider({ children }) {
  const [profil, setProfilState] = useState(() => profilDeLUrl());

  useEffect(() => {
    document.documentElement.dataset.profil = profil || 'porte';
    if (!profil) return;
    try {
      localStorage.setItem(CLE, profil);
    } catch {
      /* navigation privée : le choix vaut pour la visite, c'est tout */
    }
  }, [profil]);

  /* Changer de version, c'est changer d'adresse. On reste sur la page où
     on est : quelqu'un qui lit les offres en TPE et bascule en PME
     atterrit sur les offres PME, pas sur un accueil qu'il a déjà vu. */
  const setProfil = useCallback((p) => {
    if (!PROFILS.includes(p) || p === profil) return;
    const interne = cheminInterne();
    const dest = `${BASE}/${p}${interne === '/' ? '' : interne}`;
    window.history.pushState({}, '', dest + window.location.search + window.location.hash);
    setProfilState(p);
  }, [profil]);

  /* Adopter une version sans toucher à l'historique : sert quand
     l'adresse vient d'être réécrite (lien ancien sans version, ou retour
     d'un visiteur qui avait déjà choisi). */
  const adopter = useCallback((p) => {
    if (PROFILS.includes(p)) setProfilState(p);
  }, []);

  /* Les boutons précédent et suivant du navigateur doivent pouvoir
     ramener sur l'autre version : on relit l'adresse à chaque retour. */
  useEffect(() => {
    const relire = () => setProfilState(profilDeLUrl());
    window.addEventListener('popstate', relire);
    return () => window.removeEventListener('popstate', relire);
  }, []);

  return (
    <ProfilContext.Provider value={{ profil, setProfil, adopter }}>
      {children}
    </ProfilContext.Provider>
  );
}

export function useProfil() {
  return useContext(ProfilContext);
}

const MOTS = {
  fr: {
    aria: 'Version du site',
    label: 'Vous êtes',
    tpe: 'TPE',
    pme: 'PME',
    tpeTitre: 'Version TPE : de 1 à 10 personnes',
    pmeTitre: 'Version PME : de 10 à 250 personnes',
  },
  en: {
    aria: 'Site version',
    label: 'You are',
    tpe: 'SMB',
    pme: 'SME',
    tpeTitre: 'Small-business version: 1 to 10 people',
    pmeTitre: 'SME version: 10 to 250 people',
  },
};

/* La bascule reprend la pilule de FR / EN, posée juste à côté : on
   comprend en une seconde que c'est un réglage du site, et la version
   active est celle qui est allumée. */
export function ProfilToggle({ className = '', avecLabel = true }) {
  const { profil, setProfil } = useProfil();
  const { lang } = useLang();
  const m = MOTS[lang] || MOTS.fr;
  if (!profil) return null;

  return (
    <div className={`proftoggle ${className}`}>
      {avecLabel && <span className="proftoggle__label" aria-hidden="true">{m.label}</span>}
      <div className="langtoggle proftoggle__pilule" role="group" aria-label={m.aria}>
        {PROFILS.map((p) => (
          <button
            key={p}
            type="button"
            className={`langtoggle__opt${profil === p ? ' is-on' : ''}`}
            aria-pressed={profil === p}
            title={m[`${p}Titre`]}
            onClick={() => setProfil(p)}
          >
            {m[p]}
          </button>
        ))}
      </div>
    </div>
  );
}
