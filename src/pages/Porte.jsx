import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { LogoMark } from '../components/Logo';
import NetWord from '../components/NetWord';
import Net3D from '../components/Net3D';
import { GLYPH_SHAPES } from '../lib/net3d';
import { useLang, LangToggle } from '../i18n';
import { useProfil } from '../profil';
import { instant } from '../lib/scrub';

/* ============================================================
   LA PORTE — le seul écran avant d'entrer.

   Le site existe en deux versions. Plutôt que de basculer un contenu
   derrière le dos du visiteur, on lui demande une fois, franchement, et
   on l'envoie dans la sienne. L'adresse changera avec lui.

   Ce n'est pas une modale : c'est une page, avec sa propre adresse. Une
   modale se ferme par réflexe et laisse quelqu'un dans une version qu'il
   n'a pas choisie ; une porte se franchit.

   Elle n'est vue qu'une fois : au retour, la racine renvoie directement
   dans la version retenue.
   ============================================================ */

const T = {
  fr: {
    kicker: 'Conseil et ingénierie numérique',
    q1: 'Vous',
    q2: 'êtes…',
    lead: 'Le site existe en deux versions, parce qu’on ne propose pas la même chose à une entreprise de trois personnes et à une PME de quatre-vingts. Choisissez la vôtre : vous pourrez changer à tout moment, en haut de page.',
    choix: {
      tpe: {
        sigle: 'TPE',
        taille: 'De 1 à 10 personnes',
        quoi: 'Un site, une boutique, une prise de réservation, des outils qui se parlent enfin.',
        entrer: 'Entrer',
      },
      pme: {
        sigle: 'PME',
        taille: 'De 10 à 250 personnes',
        quoi: 'L’audit et la cartographie de vos outils, poste par poste, puis la mise en œuvre.',
        entrer: 'Entrer',
      },
    },
    pied: 'Valenciennes et Lille · sur place dans les Hauts-de-France, à distance partout ailleurs',
  },
  en: {
    kicker: 'Digital consulting and engineering',
    q1: 'You',
    q2: 'are…',
    lead: 'The site comes in two versions, because we do not offer the same thing to a three-person business and to an eighty-person SME. Pick yours: you can switch at any time, at the top of the page.',
    choix: {
      tpe: {
        sigle: 'SMB',
        taille: '1 to 10 people',
        quoi: 'A website, a shop, online booking, tools that finally talk to each other.',
        entrer: 'Enter',
      },
      pme: {
        sigle: 'SME',
        taille: '10 to 250 people',
        quoi: 'The audit and mapping of your tools, desk by desk, then the delivery.',
        entrer: 'Enter',
      },
    },
    pied: 'Valenciennes and Lille · on site across the Hauts-de-France, remote everywhere else',
  },
};

export default function Porte() {
  const { lang } = useLang();
  const { setProfil } = useProfil();
  const t = T[lang] || T.fr;
  const racine = useRef(null);

  useEffect(() => {
    document.title = lang === 'fr'
      ? 'Reskope · conseil et ingénierie numérique pour TPE et PME'
      : 'Reskope · digital consulting and engineering for small businesses and SMEs';
  }, [lang]);

  useGSAP(() => {
    if (instant()) return;
    gsap.from(racine.current.querySelectorAll('.porte__monte'), {
      y: 26, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.12,
    });
  }, { scope: racine, dependencies: [lang] });

  return (
    <main className="porte" ref={racine}>
      <div className="porte__trame" aria-hidden="true" />

      <header className="porte__tete">
        <span className="wordmark">
          <LogoMark className="wordmark__mark" />
          <span className="wordmark__text">Reskope</span>
        </span>
        <LangToggle />
      </header>

      <div className="container porte__inner">
        <p className="eyebrow porte__kicker porte__monte">{t.kicker}</p>
        <h1 className="porte__t porte__monte">
          <span className="porte__mot">
            <span className="porte__ghost">{t.q1}</span>
            <NetWord className="porte__net" heightEm={1.12}>{t.q1}</NetWord>
          </span>{' '}
          <span>{t.q2}</span>
        </h1>
        <p className="porte__lead porte__monte">{t.lead}</p>

        <div className="porte__choix porte__monte">
          {['tpe', 'pme'].map((id, i) => {
            const c = t.choix[id];
            return (
              <button type="button" key={id} className="porte__opt" onClick={() => setProfil(id)}>
                <span className="porte__solide" aria-hidden="true">
                  <Net3D shape={GLYPH_SHAPES[i === 0 ? 1 : 0]} size={104} nodeR={3.2} speed={0.7 + i * 0.2} />
                </span>
                <span className="porte__sigle">{c.sigle}</span>
                <span className="porte__taille">{c.taille}</span>
                <span className="porte__quoi">{c.quoi}</span>
                <span className="porte__entrer">{c.entrer} <span aria-hidden="true">→</span></span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="porte__pied porte__monte">{t.pied}</p>
    </main>
  );
}
