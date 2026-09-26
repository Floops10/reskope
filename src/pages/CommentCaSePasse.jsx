import { Suspense, lazy, useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import Amorce from '../components/Amorce';
import Semaine from '../components/Semaine';
import MotionSlot from '../components/MotionSlot';
import Noeuds from '../components/Noeuds';
import Compte from '../components/Compte';
import Questions from '../components/Questions';
import SwapLabel from '../components/SwapLabel';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { PERSONA } from '../data/persona';

const MethodeFlight = lazy(() => import('../components/MethodeFlight'));

/* ════════════════════════════════════════════════════════════
   COMMENT ÇA SE PASSE — la page de ceux qui veulent vérifier.

   Le dirigeant qui arrive ici a déjà compris ce qu'on fait ; il veut savoir
   comment, et s'il peut nous faire confiance avec ses clients. Le vol en
   3D traverse les cinq moments d'une mission ; viennent ensuite son temps,
   ce qu'on fait des réponses de ses clients, la manière dont on lit les
   chiffres, et les mots de la méthode pour ceux qui les connaissent.
   ════════════════════════════════════════════════════════════ */

const JALONS = [
  {
    n: 'echange', label: 'Le premier échange',
    title: 'On écoute votre situation.',
    text: 'Trente minutes, gratuites. Vous nous racontez votre projet et la décision qui vous attend. Si on ne peut pas vous aider, on vous le dit à ce moment-là.',
    deliver: 'Une proposition écrite sous 48 heures, avec un prix fixe.',
  },
  {
    n: 'cadrage', label: 'Le cadrage',
    title: 'On écrit ce qui doit être vrai.',
    text: 'Une heure ensemble pour lister ce que vous croyez sur vos clients, et le classer par risque. On commence par ce qui ferait tout tomber.',
    deliver: 'Vos hypothèses, classées de la plus risquée à la moins risquée.',
  },
  {
    n: 'terrain', label: 'Le terrain',
    title: 'On va voir vos clients.',
    text: 'Dix à douze entretiens de quarante-cinq minutes, sur ce qu’ils ont vécu, jamais sur ce qu’ils feraient. Chaque vendredi, on vous montre ce qui revient.',
    deliver: 'Les mots de vos clients, classés par ce qui revient.',
  },
  {
    n: 'test', label: 'Le test',
    title: 'On essaie pour de vrai.',
    text: 'La piste la plus prometteuse est testée avec le moins de moyens possible : un prix, une page, un devis plus clair. On mesure ce qui se passe.',
    deliver: 'Un résultat mesuré, plutôt qu’une opinion.',
  },
  {
    n: 'decision', label: 'La décision',
    title: 'Vous décidez, sur des preuves.',
    text: 'On vous remet tout en une heure. Vous continuez, vous ajustez ou vous arrêtez. Et si la suite demande un outil, on peut le construire.',
    deliver: 'Une synthèse prête pour votre dossier.',
  },
];

const FILM = {
  introTitle: 'Du premier échange à votre décision.',
  introText: 'Cinq moments, et rien ne se décide sans vous.',
  synthCap: 'À la fin, c’est vous qui décidez.',
};
const LABELS = {
  milestone: 'Étape',
  here: '',
  youGet: 'Ce que vous avez en main',
  hint: 'Survolez un point du réseau pour le détail',
};

const CLIENTS = [
  { texte: 'Ils savent pourquoi on les appelle, et ils peuvent refuser', suite: 'C’est vous qui les prévenez, avec un message qu’on écrit ensemble.' },
  { texte: 'On ne leur vend rien', suite: 'L’entretien porte sur ce qu’ils ont vécu avec vous, et sur rien d’autre.' },
  { texte: 'Leurs mots sont cités sans leur nom', suite: 'Ce qu’on vous remet dit ce qui a été dit, jamais qui l’a dit.' },
  { texte: 'Rien n’est enregistré sans leur accord', suite: 'Et un enregistrement est effacé à la fin de la mission.' },
  { texte: 'Leurs coordonnées ne sont pas gardées', suite: 'On les efface quand la mission se termine.' },
];

const TERMES = {
  discovery: 'Discovery', persona: 'Persona', hypothese: 'Hypothèse', test: 'Test', sprint: 'Sprint',
};

const QUESTIONS = [
  { q: 'Combien de personnes interrogez-vous ?', r: 'Dix à douze en général. Au-delà, on apprend rarement quelque chose de nouveau : les mêmes sujets reviennent. En dessous de huit, on ne sait pas encore distinguer un avis d’un motif.' },
  { q: 'Et si je n’ai pas encore de clients ?', r: 'On interroge les gens qui devraient l’être : on les trouve par les réseaux locaux, les recommandations et le terrain. C’est le cas de la plupart des créations d’entreprise.' },
  { q: 'Pourquoi pas un questionnaire en ligne ?', r: 'Un questionnaire vous dit ce que les gens pensent faire. Un entretien sur un moment précis vous dit ce qu’ils ont fait, et pourquoi. C’est cette différence qui évite de se tromper de décision.' },
  { q: 'Est-ce que je peux arrêter en cours de route ?', r: 'Oui. Chaque vendredi, vous voyez où on en est, et vous pouvez dire stop. Ce que ça change au prix est écrit dans la proposition, avant de commencer.' },
];

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
    <header className="oh oh--court" ref={racine}>
      <div className="container">
        <h1 className="oh__titre">Comment se déroule une mission.</h1>
        <p className="oh__lead">
          Du premier échange à votre décision : ce qu’on fait, ce que ça vous demande, et ce qu’on fait des
          réponses de vos clients.
        </p>
      </div>
    </header>
  );
}

export default function CommentCaSePasse() {
  return (
    <Page>
      <Tete />

      <Suspense fallback={<div className="mfl-loading" aria-hidden="true" />}>
        <MethodeFlight jalons={JALONS} film={FILM} labels={LABELS} />
      </Suspense>

      <Amorce id="temps" lead="Votre temps, semaine par semaine." large>
        <Semaine />
        <MotionSlot id="comment-semaine" />
      </Amorce>

      <Amorce id="vos-clients" lead="Ce qu’on fait des réponses de vos clients." fond="ciel">
        <Noeuds items={CLIENTS} />
        <p className="am__p">
          Pour ces entretiens, on traite des données de vos clients pour votre compte : le cadre est écrit
          dans nos <Link to="/cgv" className="lien-souligne">conditions de vente</Link>, et vous pouvez nous
          demander à tout moment ce qu’on en a fait.
        </p>
      </Amorce>

      <Amorce id="chiffres" lead="Sept personnes sur onze, ce n’est pas 64 %." entree="pivot">
        <Compte
          rangs={[
            { sujet: 'Le délai de réponse', n: 7 },
            { sujet: 'Le devis difficile à lire', n: 5 },
            { sujet: 'Le prix', n: 2 },
          ]}
          legende="Un nœud par personne interrogée, plein si elle en a parlé sans qu’on le lui demande. Chiffres de l’exemple, inventés pour l’illustrer."
        />
        <p className="am__p">
          Onze entretiens ne font pas un sondage, alors on n’en tire pas de pourcentage. Mais quand sept
          personnes sur onze parlent du même problème sans qu’on le leur souffle, c’est un signal fort, et
          c’est la première chose à regarder.
        </p>
        <p className="am__p">
          Ce qui donne du poids à un sujet : qu’il soit venu spontanément, qu’il s’appuie sur un moment
          précis que la personne raconte, et qu’il revienne chez des clients qui n’ont rien à voir entre eux.
          Et le contraire compte aussi : le prix, dont tout le monde parlait en interne, n’est cité que par
          deux clients. On le note, et on ne dépense pas là.
        </p>
        <p className="am__suite">
          <Link to="/exemple" className="lien-fleche">
            Voir l’exemple complet<span aria-hidden="true">→</span>
          </Link>
        </p>
      </Amorce>

      <Amorce id="mots" lead="Les mots de la méthode, si vous les connaissez." entree="bascule">
        <dl className="lex">
          {Object.entries(PERSONA.mots).map(([terme, dit]) => (
            <div className="lex__ligne" key={terme}>
              <dt className="lex__terme">{TERMES[terme] || terme}</dt>
              <dd className="lex__dit">{dit.charAt(0).toUpperCase() + dit.slice(1)}.</dd>
            </div>
          ))}
        </dl>
        <p className="am__p">
          On travaille comme une équipe produit : des hypothèses, des entretiens, des tests courts, une
          décision chaque semaine. On garde simplement ces mots pour nous, et on vous parle de vos clients.
        </p>
      </Amorce>

      <Questions titre="Ce qu’on nous demande sur la méthode." items={QUESTIONS}>
        <Link to="/contact" className="btn btn--primary">
          <SwapLabel>Parlons de votre situation</SwapLabel>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </Questions>
    </Page>
  );
}
