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

const ProfilContext = createContext({
  profil: 'pme', setProfil: () => {}, choisi: true, demander: () => {}, passer: () => {},
});

const VALIDES = ['tpe', 'pme'];
const CLE = 'reskope-profil';

export function ProfilProvider({ children }) {
  const [profil, setProfilState] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const s = localStorage.getItem(CLE);
      if (VALIDES.includes(s)) return s;
    }
    /* Par défaut la PME : c'est le contenu historique du site, celui qui
       existe et qui est complet. Une TPE qui bascule trouve le sien. */
    return 'pme';
  });

  /* `choisi` distingue « n'a pas encore répondu » de « a répondu PME ».
     Sans cette nuance, on ne saurait pas à qui poser la question, et on
     la reposerait à chaque visite — ce qui est le meilleur moyen de se
     faire fermer au deuxième passage. */
  const [choisi, setChoisi] = useState(() => {
    if (typeof localStorage === 'undefined') return true;
    return VALIDES.includes(localStorage.getItem(CLE));
  });

  useEffect(() => {
    document.documentElement.dataset.profil = profil;
  }, [profil]);

  const setProfil = useCallback((p, memoriser = true) => {
    if (!VALIDES.includes(p)) return;
    setProfilState(p);
    if (memoriser) {
      setChoisi(true);
      try {
        localStorage.setItem(CLE, p);
      } catch {
        /* navigation privée : le choix vaut pour la session, c'est tout */
      }
    }
  }, []);

  /* Rouvrir la question depuis n'importe où. */
  const demander = useCallback(() => setChoisi(false), []);

  /* « Je regarde d'abord » : on ferme sans rien retenir. La question ne
     revient pas pendant la visite, et le réglage reste dans le header.
     On ne mémorise pas un non-choix comme s'il en était un. */
  const passer = useCallback(() => setChoisi(true), []);

  return (
    <ProfilContext.Provider value={{ profil, setProfil, choisi, demander, passer }}>
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
