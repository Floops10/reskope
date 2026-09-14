import { useEffect, useRef } from 'react';
import { LogoMark } from './Logo';
import { lockScroll } from '../lib/smoothScroll';
import { useLang } from '../i18n';
import { useProfil } from '../profil';

/* ============================================================
   LA QUESTION D'ENTRÉE — TPE ou PME ?

   Le site sert deux contenus différents, et la pilule du header ne suffit
   pas : beaucoup de visiteurs ne la verront jamais. On pose donc la
   question une fois, à la première visite, et on n'y revient plus.

   Ce qu'on s'interdit :
   - la poser à chaque passage (c'est comme ça qu'on se fait fermer) ;
   - la poser avant que la page soit là (on laisse le hero se jouer une
     seconde, la question arrive ensuite) ;
   - enfermer qui que ce soit (« je regarde d'abord » ferme sans rien
     retenir, et la pilule du header reste disponible en permanence).

   Accessibilité : boîte de dialogue modale, focus piégé à l'intérieur,
   Échap ferme, et le focus revient là où il était.
   ============================================================ */

const T = {
  fr: {
    aria: 'Votre structure',
    kicker: 'Avant de commencer',
    titre: 'Vous êtes plutôt…',
    lead: 'On ne propose pas la même chose à une entreprise de trois personnes et à une PME de quatre-vingts. Dites-nous où vous vous situez : le site s’adapte, et vous pourrez changer d’avis à tout moment en haut de page.',
    tpe: {
      sigle: 'TPE',
      taille: 'De 1 à 10 personnes',
      quoi: 'Un site, une boutique, une prise de réservation, des outils qui se parlent enfin.',
    },
    pme: {
      sigle: 'PME',
      taille: 'De 10 à 250 personnes',
      quoi: 'L’audit et la cartographie de vos outils, poste par poste, puis la mise en œuvre.',
    },
    passer: 'Je regarde d’abord',
  },
  en: {
    aria: 'Your organisation',
    kicker: 'Before we start',
    titre: 'You are rather…',
    lead: 'We do not offer the same thing to a three-person business and to an eighty-person SME. Tell us where you stand: the site adapts, and you can change your mind at any time at the top of the page.',
    tpe: {
      sigle: 'SMB',
      taille: '1 to 10 people',
      quoi: 'A website, a shop, online booking, tools that finally talk to each other.',
    },
    pme: {
      sigle: 'SME',
      taille: '10 to 250 people',
      quoi: 'The audit and mapping of your tools, desk by desk, then the delivery.',
    },
    passer: 'I’ll look around first',
  },
};

export default function ChoixProfil() {
  const { choisi, setProfil, passer } = useProfil();
  const { lang } = useLang();
  const t = T[lang] || T.fr;

  const boite = useRef(null);
  const premier = useRef(null);
  const rendu = useRef(null);

  useEffect(() => {
    if (choisi) return undefined;

    rendu.current = document.activeElement;
    lockScroll(true);
    document.body.style.overflow = 'hidden';

    /* On laisse la page arriver avant de prendre la main. */
    const t0 = setTimeout(() => premier.current?.focus(), 620);

    const onKey = (e) => {
      if (e.key === 'Escape') { passer(); return; }
      if (e.key !== 'Tab' || !boite.current) return;
      /* Piège à focus : on ne sort pas de la boîte à la tabulation. */
      const f = boite.current.querySelectorAll('button, [href]');
      if (!f.length) return;
      const [deb, fin] = [f[0], f[f.length - 1]];
      if (e.shiftKey && document.activeElement === deb) { e.preventDefault(); fin.focus(); }
      else if (!e.shiftKey && document.activeElement === fin) { e.preventDefault(); deb.focus(); }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      clearTimeout(t0);
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      document.body.style.overflow = '';
      if (rendu.current instanceof HTMLElement) rendu.current.focus();
    };
  }, [choisi, passer]);

  if (choisi) return null;

  /* `ref` est un nom réservé pour un composant : on passe le nôtre. */
  const Choix = ({ id, focusRef }) => (
    <button
      type="button"
      ref={focusRef}
      className={`chp__opt chp__opt--${id}`}
      onClick={() => setProfil(id)}
    >
      <span className="chp__node" aria-hidden="true" />
      <span className="chp__sigle">{t[id].sigle}</span>
      <span className="chp__taille">{t[id].taille}</span>
      <span className="chp__quoi">{t[id].quoi}</span>
      <span className="chp__fleche" aria-hidden="true">→</span>
    </button>
  );

  return (
    <div className="chp" role="dialog" aria-modal="true" aria-labelledby="chp-t" aria-label={t.aria}>
      {/* Le fond ne ferme pas au clic : la question tient en deux boutons,
          un clic à côté serait presque toujours une erreur. */}
      <div className="chp__fond" aria-hidden="true" />
      <div className="chp__boite" ref={boite}>
        <LogoMark className="chp__logo" />
        <p className="chp__kicker">{t.kicker}</p>
        <h2 className="chp__t" id="chp-t">{t.titre}</h2>
        <p className="chp__lead">{t.lead}</p>

        <div className="chp__choix">
          <Choix id="tpe" focusRef={premier} />
          <Choix id="pme" />
        </div>

        <button type="button" className="chp__passer" onClick={passer}>
          {t.passer}
        </button>
      </div>
    </div>
  );
}
