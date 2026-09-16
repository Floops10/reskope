import { useEffect, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { LogoMark } from '../components/Logo';
import NetWord from '../components/NetWord';
import Net3D from '../components/Net3D';
import { GLYPH_SHAPES } from '../lib/net3d';
import { useLang, LangToggle } from '../i18n';
import { useProfil, BASE } from '../profil';
import { PORTE, SITE } from '../data/seo';
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
    kicker: 'Conseil et ingénierie numérique · Valenciennes et Lille',
    titre: 'On remet vos outils numériques en ordre.',
    pitch: 'On rencontre vos équipes sur le terrain, on cartographie les outils que vous payez, on supprime les doublons, on relie ce qui ne communique pas et on construit ce qui manque.',
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
    kicker: 'Digital consulting and engineering · Valenciennes and Lille',
    titre: 'We put your digital tools back in order.',
    pitch: 'We meet your teams on the ground, map the tools you pay for, remove the duplicates, connect what does not communicate and build what is missing.',
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

  /* Le titre vient de la même table que le pré-rendu : ce qu'un moteur a lu
     dans le fichier servi et ce que le visiteur a dans son onglet doivent
     être la même phrase. */
  useEffect(() => {
    document.title = lang === 'fr'
      ? `${PORTE.titre} · ${SITE.marque}`
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
        {/* Le titre dit ce qu'on fait, pas ce qu'on demande. La racine est
            l'adresse la plus forte du site : elle ne peut pas se contenter
            d'une question, sinon c'est tout ce qu'un moteur y trouve. */}
        <h1 className="porte__t porte__monte">{t.titre}</h1>
        <p className="porte__pitch porte__monte">{t.pitch}</p>

        <p className="porte__q porte__monte" id="porte-q">
          <span className="porte__mot">
            <span className="porte__ghost">{t.q1}</span>
            <NetWord className="porte__net" heightEm={1.12}>{t.q1}</NetWord>
          </span>{' '}
          <span>{t.q2}</span>
        </p>
        <p className="porte__lead porte__monte">{t.lead}</p>

        <div className="porte__choix porte__monte">
          {['tpe', 'pme'].map((id, i) => {
            const c = t.choix[id];
            return (
              <a
                key={id}
                className="porte__opt"
                href={`${BASE}/${id}`}
                onClick={(e) => { e.preventDefault(); setProfil(id); }}
              >
                <span className="porte__solide" aria-hidden="true">
                  <Net3D shape={GLYPH_SHAPES[i === 0 ? 1 : 0]} size={104} nodeR={3.2} speed={0.7 + i * 0.2} />
                </span>
                <span className="porte__sigle">{c.sigle}</span>
                <span className="porte__taille">{c.taille}</span>
                <span className="porte__quoi">{c.quoi}</span>
                <span className="porte__entrer">{c.entrer} <span aria-hidden="true">→</span></span>
              </a>
            );
          })}
        </div>
      </div>

      <p className="porte__pied porte__monte">{t.pied}</p>
    </main>
  );
}
