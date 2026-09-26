import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import HeroFormation from '../components/HeroFormation';
import Chemins from '../components/Chemins';
import Frise from '../components/Frise';
import Amorce from '../components/Amorce';
import Semaine from '../components/Semaine';
import MotionSlot from '../components/MotionSlot';
import PersonaLivrable from '../components/PersonaLivrable';
import ReseauBP from '../components/ReseauBP';
import Balance from '../components/Balance';
import Debut from '../components/Debut';
import Duo from '../components/Duo';
import Questions from '../components/Questions';
import SwapLabel from '../components/SwapLabel';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { PRIX, PORTES_CREATION } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   CRÉER OU REPRENDRE — l'espace de la personne qui se lance.

   Ses questions, dans l'ordre où elle se les pose :
     est-ce pour moi ?                  (ses situations, dans ses mots)
     qu'est-ce que je reçois ?          (son client idéal, montré)
     comment vous le trouvez ?          (la mission, traversée en ville)
     que couvre le business plan ?      (le réseau de ce qu'il contient)
     est-ce que ça vaut le coup ?       (le raisonnement, dessiné)
     combien de temps, combien ?        (sa semaine, le prix, le début)
     qui êtes-vous ?                    (deux visages)
     et ce qui fait encore hésiter.     (les questions)

   Le ton est celui qu'on emploie avec quelqu'un qui porte son projet :
   concret, chaleureux, jamais de méthode dans les mots. Voir
   src/data/persona.js.
   ════════════════════════════════════════════════════════════ */

const HERO = {
  heroTitle: 'On trouve le client qui fera vivre votre projet.',
  heroDit: 'Vous créez ou reprenez une entreprise. On va rencontrer vos futurs clients, on construit votre business plan avec leurs réponses, et vous savez qui cibler, et comment.',
  primary: 'Parlons de votre projet',
  ghost: 'Toutes nos offres',
  ghostTo: '/nos-offres',
  longPhrase: 'Reskope, c’est Thomy et Florian. On est à côté de vous quand vous décidez, et derrière l’écran quand il faut construire.',
};

const QUESTIONS = [
  { q: 'C’est quoi, concrètement, un client idéal ?', r: 'Une personne précise, pas une tranche d’âge : ce qu’elle fait de ses journées, ce qui la décide, où elle passe, ce qu’elle paierait. On la dessine à partir des entretiens avec vos futurs clients, et on en tire l’endroit où la trouver et ce qu’il faut lui dire. Vous en voyez trois exemples plus haut.' },
  { q: 'Et si vous me dites que mon projet ne tient pas ?', r: 'Alors vous l’apprenez pour le prix d’une mission, et pas pour celui d’un prêt. Souvent, le projet ne tombe pas : il se déplace vers une cible ou un prix qui tiennent.' },
  { q: 'Vous rédigez mon business plan ?', r: 'Non. On le construit avec vous, on le challenge, et on le nourrit de ce que vos clients ont dit. C’est vous qui allez le défendre : il doit rester le vôtre.' },
  { q: 'Et la communication, le logo ?', r: 'On vous accompagne : le cadre de votre marque, des maquettes de logo pour démarrer, et ce qu’il faut dire à votre client idéal, où et quand. On n’est ni graphistes diplômés ni agence de communication : quand un spécialiste est utile, on vous le dit, et on lui transmet le cadre.' },
  { q: 'Je n’ai pas beaucoup de temps.', r: 'Comptez une heure et demie à deux heures par semaine. Le reste, c’est nous qui le faisons : c’est justement ce que vous n’avez pas envie de faire.' },
  { q: 'Est-ce que ça vaut vraiment le coup ?', r: 'Une mission coûte bien moins qu’un bail, des travaux ou un prêt engagés sur la mauvaise cible. On ne vous promet pas de chiffre : on vous montre où se jouent les gains, et on les mesure avec vous.' },
];

/* Le livrable a sa propre section, pleine largeur : il se regarde, il ne
   tient pas dans une colonne. */
function Livrable() {
  const racine = useRef(null);
  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.from(q('.liv__titre, .liv__dit'), {
      z: -640, y: 50, rotateX: -26, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.14,
      scrollTrigger: { trigger: racine.current, start: 'top 80%' },
    });
  }, { scope: racine });

  return (
    <section className="liv" id="livrable" ref={racine} aria-labelledby="liv-t">
      <div className="container">
        <div className="liv__tete">
          <div className="liv__texte">
            <h2 className="liv__titre" id="liv-t">Ce que vous recevez : votre client idéal.</h2>
            <p className="liv__dit">
              Pas un rapport de cinquante pages : une personne. Qui elle est, ce qui la décide, à quoi ressemble sa
              journée, où la trouver et quoi lui dire. C’est à partir d’elle qu’on construit tout le reste, de votre
              prix à votre communication.
            </p>
          </div>
          <MotionSlot id="creation-client-ideal" className="liv__film" />
        </div>
        <PersonaLivrable />
      </div>
    </section>
  );
}

export default function Creation() {
  return (
    <Page>
      <HeroFormation c={HERO} />

      <Chemins question="Laquelle de ces situations est la vôtre ?" portes={PORTES_CREATION} />

      <Livrable />

      <Frise />

      <Amorce id="bp" lead="Votre business plan, en entier." large fond="indigo">
        <ReseauBP />
        <p className="am__p">
          On fait ce que vous n’avez pas envie de faire : l’étude de vos clients, les chiffres, le dossier, et la
          communication de départ. Pour la marque, on vous accompagne avec la théorie et des maquettes de logo ; on
          n’est pas une agence de communication, et on vous oriente quand un spécialiste est utile.
        </p>
        <p className="am__suite">
          <Link to="/construire-votre-business-plan" className="lien-fleche">
            Construire votre business plan avec nous<span aria-hidden="true">→</span>
          </Link>
        </p>
      </Amorce>

      <Amorce id="rentable" lead="Un investissement léger, et des gains qui se voient." large entree="pivot">
        <Balance />
        <p className="am__p">
          Ce qui coûte cher dans un projet, ce n’est presque jamais l’étude : ce sont les décisions prises sans elle.
          On ne vous promet pas un chiffre ; on vous montre où se jouent les gains, et on les mesure avec vous.
        </p>
      </Amorce>

      <Amorce id="temps" lead="Une heure et demie de votre temps par semaine, pas plus." entree="bascule">
        <Semaine legende={false} />
        <p className="am__p">
          Une heure le premier lundi pour écrire ce que vous croyez, trente minutes chaque vendredi pour voir ce qui
          revient, et une heure à la fin pour décider. Si vous voulez écouter un entretien, vous êtes le bienvenu,
          mais rien ne vous y oblige.
        </p>
      </Amorce>

      <Amorce id="prix" lead={PRIX.titre} fond="menthe">
        <Debut />
        <p className="am__micro">{PRIX.micro}</p>
        <div className="am__actions">
          <Link to="/contact" state={{ situation: 'idee' }} className="btn btn--primary" data-cursor-label="Écrire">
            <SwapLabel>Parlons de votre projet</SwapLabel>
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
          <Link to="/nos-offres" className="btn btn--ghost">
            <SwapLabel>Toutes nos offres</SwapLabel>
          </Link>
        </div>
      </Amorce>

      <Duo />

      <Questions titre="Ce qu’on nous demande avant de se lancer." items={QUESTIONS} />
    </Page>
  );
}
