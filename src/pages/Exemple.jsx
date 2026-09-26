import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import Amorce from '../components/Amorce';
import Noeuds from '../components/Noeuds';
import Planche from '../components/Planche';
import Verbatims from '../components/Verbatims';
import Compte from '../components/Compte';
import Semaine from '../components/Semaine';
import SwapLabel from '../components/SwapLabel';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   UN EXEMPLE COMPLET — une mission « Comprendre vos clients », du premier
   lundi à la décision.

   Reskope démarre : on n'a pas encore de mission réelle à montrer, et on ne
   va pas en inventer une en la faisant passer pour vraie. Ce cas d'école le
   dit en tête de page et le répète à la fin. L'entreprise, les personnes et
   les chiffres sont inventés ; les questions, les documents et la manière
   de lire les chiffres sont ceux qu'on applique.

   La page doit rester complète : c'est ici qu'un dirigeant voit ce qu'il
   aura entre les mains, sans avoir à nous croire sur parole.
   ════════════════════════════════════════════════════════════ */

const CROYAIT = [
  'Nos prix sont trop hauts face aux artisans qui cassent les prix.',
  'Les clients comparent tout sur internet avant d’appeler.',
  'On manque de visibilité : il faudrait refaire le site.',
];

const INTERROGES = [
  { texte: 'Quatre clients qui ont signé dans l’année', suite: 'Pour comprendre ce qui a fait la différence, vu de chez eux.' },
  { texte: 'Quatre personnes qui ont demandé un devis sans le signer', suite: 'Ce sont elles qui expliquent la baisse. Elles parlent volontiers à quelqu’un d’extérieur.' },
  { texte: 'Trois anciens clients qui ne sont pas revenus', suite: 'Pour savoir ce qui se passe après un premier chantier.' },
];

const QUESTIONS_POSEES = [
  'Racontez-moi comment le projet est né. Qu’est-ce qui vous a décidé à demander des devis ?',
  'Combien d’entreprises avez-vous contactées, et comment les aviez-vous trouvées ?',
  'Que s’est-il passé entre votre demande et le moment où vous avez reçu le devis ?',
  'Quand vous avez eu les devis en main, comment les avez-vous comparés ?',
  'Qu’est-ce qui vous a fait choisir, ou renoncer ?',
];

const SUJETS = [
  {
    nom: 'Le délai de réponse',
    n: 7,
    citations: [
      { t: 'J’ai attendu le devis trois semaines. Entre-temps, l’autre était déjà venu mesurer.', qui: 'Une propriétaire', issue: 'refuse' },
      { t: 'Ils sont venus le surlendemain, c’est pour ça que je les ai pris.', qui: 'Un client', issue: 'signe' },
      { t: 'Je ne savais même pas s’ils avaient bien reçu ma demande.', qui: 'Un couple', issue: 'refuse' },
      { t: 'J’ai rappelé deux fois pour avoir une date de visite.', qui: 'Un ancien client', issue: 'parti' },
    ],
  },
  {
    nom: 'Le devis difficile à lire',
    n: 5,
    citations: [
      { t: 'Trois pages de lignes, je ne savais pas ce qui était compris dedans.', qui: 'Un propriétaire', issue: 'refuse' },
      { t: 'L’autre devis tenait sur une page, avec le prix pièce par pièce.', qui: 'Une cliente', issue: 'refuse' },
      { t: 'J’ai dû appeler pour comprendre la ligne « divers ».', qui: 'Un ancien client', issue: 'parti' },
    ],
  },
  {
    nom: 'Le prix',
    n: 2,
    citations: [
      { t: 'C’était un peu plus cher, mais ils avaient l’air sérieux.', qui: 'Un client', issue: 'signe' },
      { t: 'Le prix, on s’y attendait, c’est le prix de la qualité.', qui: 'Une cliente', issue: 'signe' },
    ],
  },
];

const PORTRAITS = [
  {
    nom: 'Le propriétaire pressé',
    fait: 'Il veut que les travaux commencent avant l’été. Il retient la première entreprise sérieuse qui se déplace.',
    decide: 'la vitesse de réponse',
    cite: 'Le premier qui rappelle a le chantier.',
  },
  {
    nom: 'Le comparateur prudent',
    fait: 'Il demande trois devis et les pose côte à côte sur la table de la cuisine. Il élimine celui qu’il ne comprend pas.',
    decide: 'un devis lisible, pièce par pièce',
    cite: 'L’autre tenait sur une page.',
  },
  {
    nom: 'Le fidèle déçu',
    fait: 'Il a déjà fait appel à l’entreprise. Il n’est pas revenu parce qu’il est resté sans nouvelles après un appel.',
    decide: 'qu’on se souvienne de lui',
    cite: 'Je pensais qu’ils me rappelleraient.',
  },
];

const REMIS = [
  { texte: 'Ses trois hypothèses, avec leur verdict', suite: 'Le prix : contredite. Internet : vraie, mais sans effet sur le choix. Le site : aucune preuve, rien à engager maintenant.' },
  { texte: 'Les onze entretiens, résumés, avec les citations', suite: 'Sans les noms : ce qui a été dit, jamais qui l’a dit.' },
  { texte: 'Trois portraits de ses clients', suite: 'Avec, pour chacun, ce qui le décide.' },
  { texte: 'Le test, son résultat, et la façon de continuer à le mesurer', suite: 'Un tableau d’une ligne par demande, tenu par l’assistante.' },
  { texte: 'Une page de décision', suite: 'Ce qu’on arrête, ce qu’on garde, ce qu’on essaie ensuite.' },
];

function Tete() {
  const racine = useRef(null);
  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.timeline({ delay: 0.15 })
      .from(q('.oh__titre'), { z: -760, y: 60, rotateX: -32, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0)
      .from(q('.oh__lead'), { z: -420, y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out' }, 0.25)
      .from(q('.ex__nature'), { z: -300, y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.45);
  }, { scope: racine });

  return (
    <header className="oh" ref={racine}>
      <div className="container">
        <h1 className="oh__titre">Pourquoi une entreprise de rénovation signait moins de devis.</h1>
        <p className="oh__lead">
          Une mission « Comprendre vos clients », du premier lundi à la décision : les hypothèses, les
          entretiens, ce qui revient, les chiffres et la façon de les lire, le test, et ce que le dirigeant
          a eu entre les mains.
        </p>
        <p className="ex__nature">
          <span className="ex__nature-noeud" aria-hidden="true" />
          Cas d’école : l’entreprise, les personnes et les chiffres sont inventés pour l’exemple. Les
          questions, les documents et la manière de lire les chiffres sont ceux qu’on applique.
        </p>
      </div>
    </header>
  );
}

export default function Exemple() {
  return (
    <Page>
      <Tete />

      <Amorce id="depart" lead="Au départ, un dirigeant sûr que c’était le prix.">
        <blockquote className="ex__voix">
          « On fait autant de devis qu’avant, et on en signe moins. Les gens comparent tout sur internet, on
          est trop chers. »
        </blockquote>
        <p className="am__p">
          Rénovation intérieure, huit personnes, près de Valenciennes. Une quarantaine de devis par
          trimestre : un sur trois était signé il y a deux ans, un sur cinq aujourd’hui. Le dirigeant hésitait
          entre baisser ses prix et refaire son site. Deux dépenses, et aucune preuve que l’une ou l’autre
          réglerait le problème.
        </p>
        <p className="am__p am__p--fort">Le premier lundi, on a écrit ce qu’il croyait :</p>
        <Noeuds items={CROYAIT} etat="creux" />
        <Planche
          scene="hypotheses"
          etape={1}
          noms={false}
          legende="Au centre, son entreprise. Autour, ce qu’il croit : en fil de fer, parce que personne ne l’a encore vérifié."
        />
      </Amorce>

      <Amorce id="qui" lead="Onze personnes, choisies pour se contredire.">
        <Noeuds items={INTERROGES} />
        <p className="am__p">
          Le dirigeant a prévenu chacune par un message qu’on avait écrit ensemble. Deux ont refusé : on en a
          appelé deux autres. Chaque entretien a duré trente à cinquante minutes, au téléphone, sur leur
          dernier projet de travaux.
        </p>
        <Planche
          scene="entretiens"
          etape={1}
          legende="Onze personnes autour de l’offre. La hauteur de chaque bloc, c’est le temps qu’elle nous a accordé."
        />
      </Amorce>

      <Amorce id="questions" lead="On ne demande jamais « pourquoi vous n’avez pas signé ? ».">
        <p className="am__p">
          Une question directe appelle une réponse polie, et souvent : « c’était trop cher ». On fait plutôt
          raconter un moment précis, dans l’ordre, et les vraies raisons sortent d’elles-mêmes. Voici le fil
          qu’on a suivi :
        </p>
        <ol className="ex__guide">
          {QUESTIONS_POSEES.map((q) => <li key={q}>{q}</li>)}
        </ol>
        <p className="am__p">
          Pas de question sur ce qu’ils feraient « si » : ce qu’on imagine faire et ce qu’on fait vraiment
          sont rarement la même chose.
        </p>
      </Amorce>

      <section className="ex-vb" aria-labelledby="revient-t">
        <div className="container">
          <h2 className="ex-vb__titre" id="revient-t">Ce qui revient, avec leurs mots.</h2>
          <p className="ex-vb__lead">
            Un sujet par colonne, d’autant plus gros que plus de personnes en ont parlé sans qu’on le leur
            demande. Sous chaque citation, ce que la personne a fait.
          </p>
          <Verbatims sujets={SUJETS} />
        </div>
      </section>

      <Amorce id="chiffres" lead="Comment on lit ces chiffres.">
        <Compte
          rangs={[
            { sujet: 'Le délai de réponse', n: 7 },
            { sujet: 'Le devis difficile à lire', n: 5 },
            { sujet: 'Le prix', n: 2 },
          ]}
          legende="Un nœud par personne interrogée, plein si elle en a parlé d’elle-même."
        />
        <p className="am__p am__p--fort">Sept sur onze, ce n’est pas 64 %.</p>
        <p className="am__p">
          Onze entretiens ne font pas un sondage : ils disent ce qui compte et pourquoi, pas combien de
          clients pensent la même chose. On n’en tire donc aucun pourcentage.
        </p>
        <p className="am__p">
          Ce qui rend le délai sérieux : personne ne l’a cité parce qu’on le lui demandait, chacun a raconté
          un moment précis, et il revient autant chez ceux qui ont signé que chez ceux qui ont refusé.
        </p>
        <p className="am__p">
          Ce qui rend le prix secondaire : deux personnes seulement en parlent, et toutes les deux ont signé
          quand même. Ce qu’on n’en conclut pas, c’est que le prix n’a aucune importance. Seulement qu’il
          n’explique pas la baisse, et que baisser les prix n’aurait sans doute rien réglé.
        </p>
      </Amorce>

      <Amorce id="portraits" lead="Trois portraits, tirés des entretiens." large>
        <Planche
          scene="synthese"
          etape={1}
          legende="Les mêmes onze personnes, regroupées par ce qu’elles font, pas par leur âge ou leur métier."
        />
        <div className="ex__portraits">
          {PORTRAITS.map((p) => (
            <article className="ex__portrait" key={p.nom}>
              <span className="ex__portrait-noeud" aria-hidden="true" />
              <h3 className="ex__portrait-nom">{p.nom}</h3>
              <p className="ex__portrait-fait">{p.fait}</p>
              <p className="ex__portrait-decide"><span>Ce qui le décide :</span> {p.decide}</p>
              <p className="ex__portrait-cite">« {p.cite} »</p>
            </article>
          ))}
        </div>
      </Amorce>

      <Amorce id="test" lead="Un essai de quatre semaines, qui ne coûte presque rien.">
        <p className="am__p am__p--fort">
          Rappeler chaque demande sous quarante-huit heures, et envoyer un devis d’une page, prix pièce par
          pièce, avec le détail en annexe.
        </p>
        <p className="am__p">
          Ce que ça a coûté : un modèle de devis et un rappel dans l’agenda de l’assistante. Ce qu’on a
          mesuré : les devis signés sur les demandes de ces quatre semaines, comparés aux mêmes semaines de
          l’année d’avant.
        </p>
        <Compte
          rangs={[
            { sujet: 'Pendant le test', n: 4, total: 9, unite: 'devis signés' },
            { sujet: 'Les mêmes semaines, un an avant', n: 2, total: 10, unite: 'devis signés' },
          ]}
          legende="Un nœud par devis envoyé, plein s’il a été signé."
        />
        <p className="am__p">
          Quatre sur neuf, sur un mois, ne prouve rien à lui seul. Mais ça va dans le sens des onze
          entretiens, pour presque rien : on continue, et on mesure encore deux mois avant d’engager la
          moindre dépense.
        </p>
      </Amorce>

      <Amorce id="remis" lead="Ce que le dirigeant a eu entre les mains.">
        <Noeuds items={REMIS} />
        <Planche
          scene="decision"
          etape={0}
          noms={false}
          legende="Ses hypothèses, après les entretiens : pleines quand ses clients les ont confirmées, en fil de fer quand ils les ont contredites."
        />
        <p className="am__p am__p--fort">
          Il n’a pas baissé ses prix, et il n’a pas refait son site. Il a changé sa façon de répondre.
        </p>
      </Amorce>

      <Amorce id="temps" lead="Ce que ça lui a demandé : trois heures, sur trois semaines.">
        <Semaine />
      </Amorce>

      <section className="ex-fin" aria-labelledby="ex-fin-t">
        <div className="container ex-fin__in">
          <h2 className="ex-fin__titre" id="ex-fin-t">Et chez vous ?</h2>
          <p className="ex-fin__p">
            C’est la mission « Comprendre vos clients ». Le prix est fixe et écrit avant de commencer, et le
            premier échange est gratuit.
          </p>
          <div className="ex-fin__actions">
            <Link to="/comprendre-vos-clients" className="btn btn--primary">
              <SwapLabel>Voir la mission</SwapLabel>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/contact" state={{ situation: 'clients' }} className="btn btn--ghost">
              <SwapLabel>Parlons de vos clients</SwapLabel>
            </Link>
          </div>
          <p className="ex-fin__note">
            Rappel : ce cas est inventé pour l’exemple. Un autre exemple complet existe, celui du{' '}
            <Link to="/exemple-bilan" className="lien-souligne">bilan des outils d’une équipe de vingt-quatre personnes</Link>.
          </p>
        </div>
      </section>
    </Page>
  );
}
