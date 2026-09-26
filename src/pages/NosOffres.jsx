import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Page from '../components/Page';
import Amorce from '../components/Amorce';
import CarteOffres from '../components/CarteOffres';
import Debut from '../components/Debut';
import Explorateur from '../components/Explorateur';
import SwapLabel from '../components/SwapLabel';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { scrollToEl } from '../lib/smoothScroll';
import { OFFRES, POLES, STATUTS, PRIX, ORDRE_CREATION } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   NOS OFFRES — tout ce qu'on sait faire, et par où on entre.

   La carte d'abord : on voit d'un coup d'œil les trois portes et ce vers
   quoi elles mènent. Puis les offres, rangées par pôle, avec pour chacune
   ce qu'elle apporte, à qui, et ce qu'on reçoit. Aucune n'est vendue
   d'office : les suites se proposent quand une première mission les a
   montrées.
   ════════════════════════════════════════════════════════════ */

const ORDRE = ORDRE_CREATION;
const BASE = import.meta.env.BASE_URL;

function Offre({ o, onVoir }) {
  const meta = [
    STATUTS[o.statut],
    o.faits ? o.faits.duree : o.duree,
    `${o.mene} mène`,
  ].filter(Boolean).join(' · ');

  return (
    <article className={`of of--${o.statut}`} id={`offre-${o.id}`}>
      <span className="of__noeud" aria-hidden="true" />
      <h3 className="of__nom">{o.nom}</h3>
      <p className="of__dit">{o.accroche}</p>
      <p className="of__meta">{meta}</p>
      {o.pourQui && <p className="of__qui"><span>Pour qui :</span> {o.pourQui}</p>}
      <ul className="of__recu" aria-label="Ce que vous recevez">
        {(o.recevez || []).map((r) => <li key={r}>{r}</li>)}
      </ul>
      <div className="of__actions">
        {o.slug && (
          <Link to={o.slug} className="lien-fleche">
            Voir la mission en détail<span aria-hidden="true">→</span>
          </Link>
        )}
        {!o.slug && o.scene && (
          <button type="button" className="lien-fleche" onClick={() => onVoir(o.scene)}>
            Voir en 3D<span aria-hidden="true">→</span>
          </button>
        )}
        {(o.liens || []).map((l) => (l.espace ? (
          <a key={l.espace} href={`${BASE}${l.espace}`} className="lien-fleche">
            {l.label}<span aria-hidden="true">→</span>
          </a>
        ) : (
          <Link key={l.to} to={l.to} className="lien-fleche">
            {l.label}<span aria-hidden="true">→</span>
          </Link>
        )))}
      </div>
    </article>
  );
}

function Tete() {
  const racine = useRef(null);
  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.timeline({ delay: 0.15 })
      .from(q('.oh__titre'), { z: -760, y: 60, rotateX: -32, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0)
      .from(q('.oh__lead'), { z: -420, y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, 0.25);
  }, { scope: racine });

  return (
    <header className="oh" ref={racine}>
      <div className="container">
        <h1 className="oh__titre">Tout ce qu’on fait pour votre projet, et comment ça s’enchaîne.</h1>
        <p className="oh__lead">
          On commence par l’une des missions en plein. Les autres se proposent ensuite, quand une première mission
          a montré qu’elles vous servent, et jamais d’office. Vous dirigez déjà une TPE ou une PME ? Vos offres sont
          dans votre espace, en haut de la page.
        </p>
      </div>
    </header>
  );
}

export default function NosOffres() {
  const { state } = useLocation();
  const [scene, setScene] = useState(null);

  const aller = (id) => scrollToEl(document.getElementById(`offre-${id}`));

  /* Arrivé depuis une autre page avec une offre en tête : on y descend une
     fois la page posée. */
  useEffect(() => {
    if (!state || !state.offre) return undefined;
    const t = setTimeout(() => aller(state.offre), 900);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <Page>
      <Tete />

      <section className="co-sec" aria-label="La carte des offres">
        <div className="container">
          <CarteOffres onChoisir={aller} />
        </div>
      </section>

      {Object.entries(ORDRE).map(([pole, ids]) => (
        <Amorce
          key={pole}
          id={`pole-${pole}`}
          lead={`${POLES[pole].nom} : ${POLES[pole].ligne.charAt(0).toLowerCase()}${POLES[pole].ligne.slice(1)}`}
          sous={POLES[pole].mene}
        >
          {ids.map((id) => <Offre key={id} o={OFFRES.find((o) => o.id === id)} onVoir={setScene} />)}
        </Amorce>
      ))}

      <Amorce id="prix" lead={PRIX.titre}>
        <Debut />
        <p className="am__micro">{PRIX.micro}</p>
        <div className="am__actions">
          <Link to="/contact" className="btn btn--primary" data-cursor-label="Écrire">
            <SwapLabel>Parlons de votre situation</SwapLabel>
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </Amorce>

      {scene && <Explorateur figure={scene} onFermer={() => setScene(null)} />}
    </Page>
  );
}
