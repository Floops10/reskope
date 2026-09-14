import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLang } from './i18n';

/* ============================================================
   PROFIL — TPE ou PME.

   Le site raconte une seule chose très bien : l'audit et la cartographie,
   qui s'adressent à une PME. Or on ne propose pas la même chose à une
   entreprise de trois personnes : un audit poste par poste chez elle n'a
   aucun sens. Plutôt que de dédoubler le site, on ajoute un second axe à
   côté de la langue — même mécanique, même persistance, même bascule dans
   le header. Deux sites en un, sans rien casser.

   Rien n'est interdit à personne : le profil choisit ce qu'on montre en
   premier, jamais ce qu'on rend inaccessible. Chaque page qui varie
   propose le chemin vers l'autre version.

   `data-profil` est posé sur <html> : une section peut donc apparaître ou
   disparaître en CSS seul, sans plomberie dans chaque page.
   ============================================================ */

const ProfilContext = createContext({ profil: 'pme', setProfil: () => {} });

const VALIDES = ['tpe', 'pme'];

export function ProfilProvider({ children }) {
  const [profil, setProfilState] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const s = localStorage.getItem('reskope-profil');
      if (VALIDES.includes(s)) return s;
    }
    /* Par défaut la PME : c'est le contenu historique du site, celui qui
       existe et qui est complet. Une TPE qui bascule trouve le sien. */
    return 'pme';
  });

  useEffect(() => {
    document.documentElement.dataset.profil = profil;
    try {
      localStorage.setItem('reskope-profil', profil);
    } catch {
      /* navigation privée : le choix vaut pour la session, c'est tout */
    }
  }, [profil]);

  const setProfil = useCallback((p) => {
    if (VALIDES.includes(p)) setProfilState(p);
  }, []);

  return (
    <ProfilContext.Provider value={{ profil, setProfil }}>
      {children}
    </ProfilContext.Provider>
  );
}

export function useProfil() {
  return useContext(ProfilContext);
}

/** Choisit entre deux valeurs selon le profil courant. */
export function useSelonProfil() {
  const { profil } = useProfil();
  return useCallback((tpe, pme) => (profil === 'tpe' ? tpe : pme), [profil]);
}

const MOTS = {
  fr: {
    aria: 'Taille de votre structure',
    label: 'Vous êtes',
    tpe: 'TPE',
    pme: 'PME',
    tpeTitre: 'TPE — de 1 à 10 personnes',
    pmeTitre: 'PME — de 10 à 250 personnes',
  },
  en: {
    aria: 'Size of your organisation',
    label: 'You are',
    tpe: 'SMB',
    pme: 'SME',
    tpeTitre: 'Small business — 1 to 10 people',
    pmeTitre: 'SME — 10 to 250 people',
  },
};

/* La bascule reprend exactement la grammaire de FR / EN : même pilule,
   même poids, posée juste à côté. C'est ce qui fait comprendre en une
   seconde qu'il s'agit d'un réglage et pas d'un lien. */
export function ProfilToggle({ className = '', avecLabel = true }) {
  const { profil, setProfil } = useProfil();
  const { lang } = useLang();
  const m = MOTS[lang] || MOTS.fr;

  return (
    <div className={`proftoggle ${className}`}>
      {avecLabel && <span className="proftoggle__label" aria-hidden="true">{m.label}</span>}
      <div className="langtoggle proftoggle__pilule" role="group" aria-label={m.aria}>
        <button
          type="button"
          className={`langtoggle__opt${profil === 'tpe' ? ' is-on' : ''}`}
          aria-pressed={profil === 'tpe'}
          title={m.tpeTitre}
          onClick={() => setProfil('tpe')}
        >
          {m.tpe}
        </button>
        <button
          type="button"
          className={`langtoggle__opt${profil === 'pme' ? ' is-on' : ''}`}
          aria-pressed={profil === 'pme'}
          title={m.pmeTitre}
          onClick={() => setProfil('pme')}
        >
          {m.pme}
        </button>
      </div>
    </div>
  );
}
