import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import Amorce from '../components/Amorce';
import MotionSlot from '../components/MotionSlot';
import Noeuds from '../components/Noeuds';
import Deroule from '../components/Deroule';
import Semaine from '../components/Semaine';
import Questions from '../components/Questions';
import Explorateur from '../components/Explorateur';
import SwapLabel from '../components/SwapLabel';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { OFFRE, POLES } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   UNE PORTE D'ENTRÉE — la page d'une situation.

   Les trois pages suivent le même ordre, qui est celui des questions du
   dirigeant (src/data/persona.js) :
     est-ce pour moi → ce qu'on fait, jour par jour → ce que ça vous demande
     → ce que vous recevez → ce qu'on ne fait pas → et après → vos questions.

   Le premier écran répond déjà à tout en quatre faits : la durée, votre
   temps, le prix, ce que vous recevez. Le reste de la page est là pour qui
   veut vérifier.
   ════════════════════════════════════════════════════════════ */

/* Le temps qu'on vous demande, jour par jour (voir Semaine.jsx). */
const MINUTES = {
  idee: [60, 0, 0, 0, 30, 0, 0, 0, 0, 30, 0, 0, 0, 0, 60],
  clients: [60, 0, 0, 0, 30, 0, 0, 0, 0, 30, 0, 0, 0, 0, 60],
  dossier: [0, 0, 0, 0, 0, 0, 60, 0, 0, 60],
  bp: [60, 0, 0, 0, 0, 60, 0, 0, 0, 0, 120, 0, 0, 0, 0, 60, 0, 0, 0, 0, 0, 0, 0, 0, 60],
};

const FAITS = [
  ['duree', 'Durée'],
  ['temps', 'Votre temps'],
  ['prix', 'Prix'],
  ['livre', 'Vous recevez'],
];

function Tete({ p, onVoir }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(q('.ph__voix'), { z: -500, y: 30, rotateX: -24, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, 0)
      .from(q('.ph__titre'), { z: -760, y: 60, rotateX: -32, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0.1)
      .from(q('.ph__accroche'), { z: -420, y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, 0.35)
      .from(q('.ph__fait'), { z: -360, y: 26, rotateX: -18, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.5)
      .from(q('.ph__actions'), { z: -300, y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.75)
      .from(q('.ph__visuel'), { z: -600, rotateY: -16, rotateX: 10, autoAlpha: 0, duration: 1.3, ease: 'power3.out' }, 0.2);
  }, { scope: racine });

  return (
    <header className="ph" ref={racine}>
      <div className="container ph__in">
        <div className="ph__texte">
          <p className="ph__voix">« {p.amorce} »</p>
          <h1 className="ph__titre">{p.nom}</h1>
          <p className="ph__accroche">{p.accroche}</p>
          <dl className="ph__faits">
            {FAITS.map(([cle, label]) => (
              <div className="ph__fait" key={cle}>
                <dt>{label}</dt>
                <dd>{p.faits[cle]}</dd>
              </div>
            ))}
          </dl>
          <div className="ph__actions">
            <Link to="/contact" state={{ situation: p.id }} className="btn btn--primary" data-cursor-label="Écrire">
              <SwapLabel>{p.cta}</SwapLabel>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <button type="button" className="btn btn--ghost" onClick={onVoir}>
              <SwapLabel>Voir la mission en 3D</SwapLabel>
            </button>
          </div>
          <p className="ph__mene">{POLES[p.pole].mene}</p>
        </div>
        <div className="ph__visuel">
          <MotionSlot id={p.motion} />
        </div>
      </div>
    </header>
  );
}

function Suite({ ids }) {
  const racine = useRef(null);
  const navigate = useNavigate();

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const tl = gsap.timeline({ scrollTrigger: { trigger: racine.current, start: 'top 80%' } });
    tl.from(q('.sui__titre'), { z: -640, y: 50, rotateX: -28, autoAlpha: 0, duration: 1, ease: 'power3.out' }, 0)
      .fromTo(q('.sui__fil'), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.inOut' }, 0.2)
      .from(q('.sui__noeud'), { scale: 0, duration: 0.45, ease: 'back.out(2.4)', stagger: 0.2 }, 0.3)
      .from(q('.sui__offre'), { z: -460, y: 36, rotateX: -20, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.35);
  }, { scope: racine });

  return (
    <section className="sui" ref={racine} aria-labelledby="sui-t">
      <div className="container">
        <h2 className="sui__titre" id="sui-t">Et après ? Ce que cette mission peut ouvrir.</h2>
        <div className="sui__rang">
          <span className="sui__fil" aria-hidden="true" />
          {ids.map((id) => {
            const o = OFFRE[id];
            return (
              <article className="sui__offre" key={id}>
                <span className={`sui__noeud sui__noeud--${o.statut}`} aria-hidden="true" />
                <h3 className="sui__nom">{o.nom}</h3>
                <p className="sui__dit">{o.accroche}</p>
                <button
                  type="button"
                  className="lien-fleche sui__lien"
                  onClick={() => navigate(o.slug || '/nos-offres', o.slug ? undefined : { state: { offre: id } })}
                >
                  {o.slug ? 'Voir cette mission' : 'Voir dans nos offres'}
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            );
          })}
        </div>
        <p className="sui__note">
          Rien de tout cela n’est inclus d’office : on vous le propose seulement si la mission l’a montré.
        </p>
      </div>
    </section>
  );
}

export default function PortePage({ id }) {
  const p = OFFRE[id];
  const [ouverte, setOuverte] = useState(false);

  return (
    <Page>
      <Tete p={p} onVoir={() => setOuverte(true)} />

      <Amorce id="pour-vous" lead="C’est pour vous si vous vous reconnaissez ici.">
        <Noeuds items={p.pourVous} grand />
      </Amorce>

      <Amorce id="deroule" lead="Ce qu’on fait, et ce que ça vous demande, jour par jour." large>
        <Deroule etapes={p.deroule} />
        <Semaine minutes={MINUTES[id]} />
      </Amorce>

      <Amorce id="recevez" lead="Ce que vous avez entre les mains à la fin.">
        <Noeuds items={p.recevez} />
        <p className="am__suite">
          <Link to="/exemple" className="lien-fleche">
            Voir une mission complète, du début à la fin
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Amorce>

      <Amorce id="demande" lead="Ce qu’on vous demande, et ce qu’on ne fait pas.">
        <p className="am__p am__p--fort">{p.demande}</p>
        <Noeuds items={p.pas} etat="creux" />
      </Amorce>

      <Suite ids={p.suite} />

      <Questions titre="Les questions qu’on nous pose sur cette mission." items={p.faq}>
        <p className="qs__relance">Une autre question ? Posez-la directement, on vous répond sous vingt-quatre heures.</p>
        <Link to="/contact" state={{ situation: p.id }} className="btn btn--primary">
          <SwapLabel>{p.cta}</SwapLabel>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </Questions>

      {ouverte && (
        <Explorateur
          figure={p.scene}
          onFermer={() => setOuverte(false)}
          plus={{ cta: { to: '/contact', state: { situation: p.id }, label: p.cta } }}
        />
      )}
    </Page>
  );
}
