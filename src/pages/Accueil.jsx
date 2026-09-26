import { Link } from 'react-router-dom';
import Page from '../components/Page';
import HeroFormation from '../components/HeroFormation';
import Chemins from '../components/Chemins';
import Frise from '../components/Frise';
import Amorce from '../components/Amorce';
import Semaine from '../components/Semaine';
import MotionSlot from '../components/MotionSlot';
import Noeuds from '../components/Noeuds';
import Debut from '../components/Debut';
import Duo from '../components/Duo';
import Questions from '../components/Questions';
import SwapLabel from '../components/SwapLabel';
import { PRIX } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   L'ACCUEIL — les questions du dirigeant, dans l'ordre où il se les pose.

   Est-ce que c'est pour moi ? (les trois situations)
   Concrètement, vous faites quoi ? (la mission, traversée en ville)
   Combien de temps ça me prend ? (sa semaine, jour par jour)
   Qu'est-ce que j'ai à la fin ? (ce qu'on remet)
   Combien ça coûte, et comment on commence ? (le prix, le premier échange)
   Pourquoi vous faire confiance ? (deux visages, et la franchise)
   Et ce qui me fait encore hésiter. (les questions)

   Une section qui ne répond à aucune de ces questions n'a rien à faire ici,
   quelle que soit la qualité de son animation. Voir src/data/persona.js.
   ════════════════════════════════════════════════════════════ */

const HERO = {
  heroTitle: 'On vous aide à décider, et on construit la suite.',
  heroDit: 'Avant que vous engagiez de l’argent, on va écouter vos clients. Vous décidez sur ce qu’ils disent, et on construit seulement ce qui a été validé.',
  primary: 'Parlons de votre situation',
  ghost: 'Voir un exemple complet',
  ghostTo: '/exemple',
  longPhrase: 'Reskope, c’est Thomy et Florian. On est à côté de vous quand vous décidez, et derrière l’écran quand il faut construire.',
};

const LIVRABLES = [
  { texte: 'Vos hypothèses, chacune avec son verdict', suite: 'Confirmée, contredite ou encore ouverte, et les preuves qui vont avec.' },
  { texte: 'Les mots de vos clients, classés', suite: 'Ce qui les décide, ce qui les freine, cité mot pour mot.' },
  { texte: 'Deux ou trois portraits de vos vrais clients', suite: 'Tirés des entretiens, pas imaginés en réunion.' },
  { texte: 'Ce qu’on a testé, et ce que ça a donné', suite: 'Un prix, une page, un devis plus clair : un essai qui coûte peu.' },
  { texte: 'Une synthèse rangée comme un financeur la lit', suite: 'Prête à entrer dans votre business plan, ou à montrer à un associé.' },
];

const QUESTIONS = [
  { q: 'Et si vous me dites que mon projet ne tient pas ?', r: 'Alors vous l’apprenez pour le prix d’une mission, et pas pour celui d’un prêt. Souvent, le projet ne tombe pas : il se déplace vers une cible ou un prix qui tiennent.' },
  { q: 'Vous allez déranger mes clients ?', r: 'C’est vous qui les prévenez, ils savent pourquoi on les appelle, et ils peuvent refuser. L’entretien dure moins d’une heure, et on ne garde pas leurs coordonnées après la mission.' },
  { q: 'Je n’ai pas beaucoup de temps.', r: 'Comptez une heure et demie par semaine : une heure le premier lundi, trente minutes chaque vendredi. Le reste, c’est nous qui le faisons, et vous voyez tout ce qu’on fait.' },
  { q: 'Qu’est-ce que je reçois, concrètement ?', r: 'Des documents dont vous vous servez le lendemain : vos hypothèses avec leurs preuves, les mots de vos clients, des portraits, et une synthèse rangée comme un financeur la lit. Pas un rapport de cinquante pages.' },
  { q: 'Vous rédigez mon business plan ?', r: 'Non. On le relit, on le challenge, et on vous aide à le nourrir de preuves. C’est vous qui allez le défendre : il doit rester le vôtre.' },
  { q: 'Et si j’ai besoin d’autre chose ensuite ?', r: 'On vous le propose seulement si la mission l’a montré : un outil, un site, un cadre de marque. Et si ce n’est pas notre métier, on vous le dit, et on vous oriente vers quelqu’un dont c’est le métier.' },
];

export default function Accueil() {
  return (
    <Page>
      {/* Le premier écran : ce qu'on fait pour lui, dit tout de suite. Le R
          se forme au défilement et les présentations arrivent ensuite, dans
          l'ordre d'une vraie rencontre : le sujet, puis les noms. */}
      <HeroFormation c={HERO} />

      {/* Est-ce que c'est pour moi ? Il se reconnaît dans une phrase. */}
      <Chemins />

      {/* Concrètement, vous faites quoi ? La mission, traversée. */}
      <Frise />

      {/* Combien de temps ça me prend ? */}
      <Amorce id="temps" lead="Une heure et demie de votre temps par semaine, pas plus.">
        <Semaine legende={false} />
        <p className="am__p">
          Une heure le premier lundi pour écrire ce que vous croyez, trente minutes chaque vendredi pour
          voir ce qui revient, et une heure à la fin pour décider. Si vous voulez écouter un entretien, vous
          êtes le bienvenu, mais rien ne vous y oblige.
        </p>
      </Amorce>

      {/* Qu'est-ce que j'ai entre les mains à la fin ? L'emplacement du
          film est réservé dès maintenant, au bon format ; en attendant,
          l'affiche montre la même scène que le dernier quartier de la ville. */}
      <Amorce id="fin" lead="Ce que vous avez entre les mains à la fin." large>
        <MotionSlot id="accueil-livrables" />
        <Noeuds items={LIVRABLES} />
        <p className="am__suite">
          <Link to="/exemple" className="lien-fleche">
            Voir une mission complète, du début à la fin
            <span aria-hidden="true">→</span>
          </Link>
        </p>
      </Amorce>

      {/* Combien ça coûte, et comment on commence ? */}
      <Amorce id="prix" lead={PRIX.titre}>
        <Debut />
        <p className="am__micro">{PRIX.micro}</p>
        <div className="am__actions">
          <Link to="/contact" className="btn btn--primary" data-cursor-label="Écrire">
            <SwapLabel>Parlons de votre situation</SwapLabel>
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
          <Link to="/nos-offres" className="btn btn--ghost">
            <SwapLabel>Toutes nos offres</SwapLabel>
          </Link>
        </div>
      </Amorce>

      {/* Pourquoi vous faire confiance ? */}
      <Duo />

      {/* Ce qui fait encore hésiter, avant de décrocher. */}
      <Questions titre="Ce qu’on nous demande avant de se lancer." items={QUESTIONS} />
    </Page>
  );
}
