import { useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import Page from '../components/Page';
import ConstatHero from '../components/ConstatHero';

const ConstatFlow = lazy(() => import('../components/ConstatFlow'));
import MorphTitle from '../components/MorphTitle';
import { VolumeTournant as CasVolume } from '../components/Paliers';
import Net3D from '../components/Net3D';
import { GLYPH_SHAPES } from '../lib/net3d';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import ReservePme from '../components/ReservePme';
import { useProfil } from '../profil';
import { PASSERELLE } from '../data/profils';
import { CONSTAT } from '../data/constat';

/* LE CONSTAT — l'étude de marché en expérience (niveau home) :
   1. HERO plein écran : titre morph + la semaine qui s'évapore (47 %).
   2. LA DORSALE : une ligne-réseau se trace et relie les 4 preuves ; chaque
      chiffre surgit de la profondeur, son graphique se joue, sources ↗ + (i).
   3. « Et chez vous ? » — la bascule (titre morph), le closing.
   4. POUR QUI : cartes épurées à glyphe 3D, hover incliné (sans 1-2-3). */

const CONTENT = {
  fr: {
    metaTitle: 'Le constat · le coût invisible du désordre numérique',
    metaDesc:
      "47 % de la semaine part dans les e-mails et la recherche d'information. Les chiffres sourcés du coût invisible, et pour qui Reskope agit.",
    eyebrow: 'Le constat',
    heroTitle: 'Un coût que personne ne voit.',
    heroTease:
      'Chaque semaine, vos outils vous coûtent des heures. On a mesuré combien, et surtout pourquoi.',
    heroLead:
      "Outils dispersés, saisies en double, information introuvable : le coût n'apparaît sur aucune facture. Mais il est réel, mesuré, documenté.",
    heroSourcesLabel: "L'étude, sourcée",
    heroSources: ['McKinsey', 'Asana', 'Harvard Business Review', 'Okta'],
    heroCue: 'Voir les chiffres',
    bridgeTitle: 'Et chez vous ?',
    bridgeText:
      "Ces chiffres ne sortent pas d'une plaquette commerciale. Si une partie seulement se vérifie chez vous, l'audit se rembourse tout seul.",
    bridgeBtn: 'Estimer votre situation',
    film: {
      weekLabel: 'Une semaine de travail : 35 heures.',
      weekText: 'Cinq jours, une équipe qui avance. En apparence.',
      lostCap: "de la semaine part dans les e-mails et la recherche d'information.",
      lostCapFull: "Près de la moitié de la semaine part dans les e-mails et la recherche d'information.",
      hoursCap: '16,5 heures perdues, par personne, chaque semaine.',
      hoursCalc: '47 % × 35 h ≈ 16,5 h par personne et par semaine.',
      costValue: 465000,
      costCap: "Pour une équipe de 20 personnes, ça se chiffre en centaines de milliers d'euros par an.",
      costCalc: '16,5 h × 47 semaines × 20 personnes × 30 €/h chargé ≈ 465 000 € par an.',
      teamCaption: 'Une équipe de 20 personnes.',
      whyTitle: 'Pourquoi tant de temps perdu ?',
      whyCap: 'Parce que les outils ne se parlent pas.',
      orderCap: 'Alors on remet de l’ordre.',
      orderText: 'Chaque heure rendue à vos équipes, c’est du temps pour leur vrai métier.',
      synthCap: 'Le désordre a un coût. Le remettre en ordre aussi, mais il se rembourse.',
      mckLabel: 'McKinsey · The Social Economy (2012)',
      mckUrl: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
    },
    targetsEyebrow: 'Pour qui ?',
    targetsTitle: 'Pour ceux qui se reconnaissent ici.',
    targets: [
      { title: 'La PME qui grossit', size: '10 à 80 personnes', desc: "Les outils se sont accumulés au fil des années. Chacun a ses habitudes, personne n'a la vue d'ensemble. On audite, on priorise, on remet de l'ordre.", cta: 'Voir un exemple de bilan', to: '/exemple' },
      { title: "L'équipe en transition", size: '20 à 150 personnes', desc: "Une transformation numérique est en cours. Vous voulez un état des lieux honnête avant d'investir dans un nouvel outil.", cta: 'Voir la méthode', to: '/methode' },
      { title: 'Le dirigeant qui reprend la main', size: '10 à 50 personnes', desc: "La personne qui savait comment tout tenait a quitté l'entreprise. Les accès, les abonnements, les fichiers : plus personne n'a la carte. On la refait.", cta: 'Voir les offres', to: '/offres' },
    ],
  },
  en: {
    metaTitle: 'The findings · the invisible cost of digital clutter',
    metaDesc:
      '47% of the workweek goes into email and information hunting. The sourced numbers behind the invisible cost, and who Reskope acts for.',
    eyebrow: 'The findings',
    heroTitle: 'A cost nobody sees.',
    heroTease:
      'Every week, your tools cost you hours. We measured how many, and above all why.',
    heroLead:
      'Scattered tools, double entry, unfindable information: the cost shows on no invoice. Yet it is real, measured, documented.',
    heroSourcesLabel: 'The study, sourced',
    heroSources: ['McKinsey', 'Asana', 'Harvard Business Review', 'Okta'],
    heroCue: 'See the numbers',
    bridgeTitle: 'What about you?',
    bridgeText:
      'These numbers do not come from a sales brochure. If only part of them holds true for you, the audit pays for itself.',
    bridgeBtn: 'Assess your situation',
    film: {
      weekLabel: 'One working week: 35 hours.',
      weekText: 'Five days, a team moving forward. Seemingly.',
      lostCap: 'of the week goes into email and searching for information.',
      lostCapFull: 'Nearly half of the week goes into email and searching for information.',
      hoursCap: '16.5 hours lost, per person, every week.',
      hoursCalc: '47% × 35h ≈ 16.5h per person per week.',
      costValue: 465000,
      costCap: 'For a team of 20 people, that adds up to hundreds of thousands of euros a year.',
      costCalc: '16.5h × 47 weeks × 20 people × €30/h loaded ≈ €465,000 per year.',
      teamCaption: 'A team of 20 people.',
      whyTitle: 'Why so much lost time?',
      whyCap: 'Because the tools don’t talk to each other.',
      orderCap: 'So we put things back in order.',
      orderText: 'Every hour handed back to your teams is time for their real work.',
      synthCap: 'Clutter has a cost. So does fixing it, but it pays for itself.',
      mckLabel: 'McKinsey · The Social Economy (2012)',
      mckUrl: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
    },
    targetsEyebrow: 'Who for?',
    targetsTitle: 'For those who recognize themselves here.',
    targets: [
      { title: 'The growing SME', size: '10 to 80 people', desc: 'Tools piled up over the years. Everyone has their habits, no one has the full picture. We audit, prioritize, put things back in order.', cta: 'See an example report', to: '/exemple' },
      { title: 'The team in transition', size: '20 to 150 people', desc: 'A digital transformation is under way. You want an honest assessment before investing in a new tool.', cta: 'See the method', to: '/methode' },
      { title: 'The owner taking back control', size: '10 to 50 people', desc: 'The person who knew how everything fitted together has left. Access, subscriptions, files: nobody holds the map any more. We redraw it.', cta: 'See the offers', to: '/offres' },
    ],
  },
};

/* POUR QUI — cartes épurées : un glyphe réseau 3D par profil, hover incliné,
   révélation en 3D. Aucun index 01/02/03, aucune ligne décorative. */
function TargetsShow({ eyebrow, title, targets, pont, versTpe }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    /* Entrée « rideau » : chaque carte se dévoile par balayage (clip-path)
       en se posant, avec un léger flou qui se dissipe — plus feutré qu'un
       simple slide. Le glyphe et le contenu suivent en cascade interne. */
    const cards = rootRef.current.querySelectorAll('.tgt');
    gsap.set(cards, {
      clipPath: 'inset(0% 0% 100% 0% round 18px)',
      y: 64, autoAlpha: 0, filter: 'blur(10px)',
    });
    cards.forEach((card, i) => {
      const inner = card.querySelectorAll('.tgt__glyph, .tgt__size, .tgt__title, .tgt__desc, .tgt__link');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current.querySelector('.tgt-grid'), start: 'top 80%' },
        delay: i * 0.14,
      });
      tl.to(card, {
        clipPath: 'inset(0% 0% 0% 0% round 18px)',
        y: 0, autoAlpha: 1, filter: 'blur(0px)',
        duration: 1.05, ease: 'power4.out',
      }, 0)
        .from(inner, {
          y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07,
        }, 0.18)
        .set(card, { clearProps: 'clipPath,filter,willChange' });
    });
  }, { scope: rootRef });

  return (
    <section className="section tgt-show couture-claire" aria-labelledby="tgt-title" ref={rootRef}>
      <div className="container">
        <Reveal className="section__head section__head--center">
          <RevealItem as="p" className="eyebrow eyebrow--index">{eyebrow}</RevealItem>
          <RevealItem>
            <MorphTitle as="h2" text={title} textClass="h2" id="tgt-title" />
          </RevealItem>
        </Reveal>

        {/* Trois encadrés arrondis avec pastille d'effectif, titre, texte
            et flèche : le gabarit qu'on voit partout. Ce sont trois
            situations, elles se lisent comme trois situations. */}
        <div className="plr plr--cas">
          {targets.map((t, i) => (
            <div className="plr__item" key={t.title}>
              <CasVolume nom={`palier${i + 1}`} />
              <p className="plr__taille">{t.size}</p>
              <p className="plr__mask"><span className="plr__t">{t.title}</span></p>
              <p className="plr__d">{t.desc}</p>
              <Link className="plr__lien" to={t.to}>
                {t.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Personne ne se reconnaît dans ces trois cas ? Alors c'est
            probablement qu'on est plus petit que ça, et la page suivante
            n'est pas celle-ci. On le dit ici plutôt que de laisser
            quelqu'un lire une étude qui ne le concerne pas. */}
        <Reveal>
          <RevealItem className="pont pont--sous">
            <span className="pont__txt">{pont.txt}</span>
            <button type="button" className="pont__btn" onClick={versTpe}>
              {pont.act}
              <span aria-hidden="true">→</span>
            </button>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

export default function Pourquoi() {
  const { lang } = useLang();
  const { setProfil } = useProfil();
  /* Cette page démontre le coût du désordre numérique dans une structure
     déjà équipée : elle n'est servie qu'en version PME, et le menu TPE ne
     la propose pas. Elle n'a donc pas de variante. */
  const c = CONTENT[lang];
  const data = CONSTAT[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>

      {/* Cette page part d'un parc d'outils déjà en place : elle ne
          concerne pas une entreprise qui n'en a pas encore. */}
      <ReservePme pour="pme" />

      {/* 1 — Ouverture : statement + accroche + sources, glyphe réseau 3D */}
      <ConstatHero
        
        eyebrow={c.eyebrow}
        title={c.heroTitle}
        teaser={c.heroTease}
        lead={c.heroLead}
        sourcesLabel={c.heroSourcesLabel}
        sources={c.heroSources}
        cue={c.heroCue}
      />

      {/* 2 — La matière (WebGL) : la semaine, 47 % s'évapore, heures, euros,
             les 3 causes, puis tout converge et dessine le R */}
      <Suspense fallback={<div className="cflw-loading" aria-hidden="true" />}>
        <ConstatFlow
          cards={data.cards}
          film={c.film}
          sourceLabel={data.sourceLabel}
          calcLabel={data.calcLabel}
          locale={lang}
        />
      </Suspense>

      {/* 3 — Et chez vous ? La bascule reprend le geste de l'ouverture :
             une grande question, puis un ourlet en bas qui porte les
             sources et l'action. Le réseau passe derrière le texte au lieu
             de tourner à côté de lui. */}
      <section className="constat-bridge" data-cursor-dark data-nav-dark>
        <div className="constat-bridge__decor" aria-hidden="true">
          <span className="constat-bridge__champ">
            <Net3D shape={GLYPH_SHAPES[3]} size={620} speed={0.34} tiltX={0.35} nodeR={2.6} />
          </span>
        </div>
        <div className="container constat-bridge__inner">
          <Reveal>
            <RevealItem>
              <MorphTitle as="h2" text={c.bridgeTitle} textClass="constat-bridge__title" netClass="morph__net--cream" />
            </RevealItem>
            <RevealItem as="p" className="constat-bridge__text">{c.bridgeText}</RevealItem>
          </Reveal>

          <Reveal className="constat-bridge__pied">
            <RevealItem className="constat-bridge__sources">
              <span className="constat-bridge__lab">{c.heroSourcesLabel}</span>
              <span className="constat-bridge__chips">
                {c.heroSources.map((s) => (
                  <span className="constat-bridge__chip" key={s}>{s}</span>
                ))}
              </span>
            </RevealItem>
            <RevealItem className="constat-bridge__act">
              <Link to="/contact" className="btn btn--on-dark" data-cursor-label={c.bridgeBtn}>
                {c.bridgeBtn}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* 4 — Pour qui */}
      <TargetsShow
        eyebrow={c.targetsEyebrow}
        title={c.targetsTitle}
        targets={c.targets}
        pont={PASSERELLE[lang].pme}
        versTpe={() => setProfil('tpe')}
      />

    </Page>
  );
}
