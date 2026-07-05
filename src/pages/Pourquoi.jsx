import { useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import Page from '../components/Page';
import ConstatHero from '../components/ConstatHero';

const ConstatFlow = lazy(() => import('../components/ConstatFlow'));
import MorphTitle from '../components/MorphTitle';
import Tilt from '../components/Tilt';
import Net3D from '../components/Net3D';
import { GLYPH_SHAPES } from '../lib/net3d';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
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
      "47 % de la semaine part dans les e-mails et la recherche d'information. Les chiffres sourcés du coût invisible, et pour qui Reskope agit.",
    eyebrow: 'Le constat',
    heroTitle: 'Un coût que personne ne voit.',
    heroTease:
      'Chaque semaine, vos outils vous coûtent des heures. On a mesuré combien, et surtout pourquoi.',
    heroLead:
      "Outils dispersés, saisies en double, information introuvable : le coût n'apparaît sur aucune facture. Mais il est réel, mesuré, documenté.",
    heroSourcesLabel: "L'étude, sourcée",
    heroSources: ['McKinsey', 'Asana', 'Harvard Business Review', 'Okta'],
    heroCue: 'Voir les chiffres',
    bridgeTitle: 'Et chez vous ?',
    bridgeText:
      "Ces chiffres viennent de McKinsey, Asana, Harvard Business Review et Okta — pas d'une plaquette commerciale. Si une partie seulement se vérifie chez vous, l'audit se rembourse tout seul.",
    bridgeBtn: 'Estimer votre situation',
    film: {
      weekLabel: 'Une semaine de travail : 35 heures.',
      weekText: 'Cinq jours, une équipe qui avance. En apparence.',
      lostCap: "de la semaine part dans les e-mails et la recherche d'information.",
      lostCapFull: "Près de la moitié de la semaine part dans les e-mails et la recherche d'information.",
      hoursCap: '16,5 heures perdues, par personne, chaque semaine.',
      hoursCalc: '47 % × 35 h ≈ 16,5 h par personne et par semaine.',
      costValue: 465000,
      costCap: "Pour une équipe de 20 personnes, ça se chiffre en centaines de milliers d'euros par an.",
      costCalc: '16,5 h × 47 semaines × 20 personnes × 30 €/h chargé ≈ 465 000 € par an.',
      teamCaption: 'Une équipe de 20 personnes.',
      whyTitle: 'Pourquoi tant de temps perdu ?',
      whyCap: 'Parce que les outils ne se parlent pas.',
      orderCap: 'Alors on remet de l’ordre.',
      orderText: 'Chaque heure rendue à vos équipes, c’est du temps pour leur vrai métier.',
      synthCap: 'Le désordre a un coût. Le remettre en ordre aussi, mais il se rembourse.',
      mckLabel: 'McKinsey · The Social Economy (2012)',
      mckUrl: 'https://www.mckinsey.com/industries/technology-media-and-telecommunications/our-insights/the-social-economy',
    },
    targetsEyebrow: 'Pour qui ?',
    targetsTitle: 'Pour ceux qui se reconnaissent ici.',
    targets: [
      { title: 'La PME qui grossit', size: '10 à 80 personnes', desc: "Les outils se sont accumulés au fil des années. Chacun a ses habitudes, personne n'a la vue d'ensemble. On audite, on priorise, on remet de l'ordre.", cta: 'Voir un exemple de bilan', to: '/exemple' },
      { title: "L'équipe en transition", size: '20 à 150 personnes', desc: "Une transformation numérique est en cours. Vous voulez un état des lieux honnête avant d'investir dans un nouvel outil.", cta: 'Voir la méthode', to: '/methode' },
      { title: "L'artisan & la TPE", size: "Jusqu'à 20 personnes", desc: 'Devis, factures, planning, échanges clients : tout est dispersé. Quelques automatisations bien choisies libèrent plusieurs heures par semaine.', cta: 'Voir les offres', to: '/offres' },
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
      'These numbers come from McKinsey, Asana, Harvard Business Review and Okta — not from a sales brochure. If only part of them holds true for you, the audit pays for itself.',
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
      { title: 'The craftsman & micro-business', size: 'Up to 20 people', desc: 'Quotes, invoices, scheduling, client exchanges: everything is scattered. A few well-chosen automations free up several hours a week.', cta: 'See the offers', to: '/offres' },
    ],
  },
};

/* POUR QUI — cartes épurées : un glyphe réseau 3D par profil, hover incliné,
   révélation en 3D. Aucun index 01/02/03, aucune ligne décorative. */
function TargetsShow({ eyebrow, title, targets }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    gsap.from(rootRef.current.querySelectorAll('.tgt'), {
      rotationX: 24, y: 70, autoAlpha: 0,
      transformPerspective: 1000, transformOrigin: '50% 100%',
      duration: 0.9, ease: 'power3.out', stagger: 0.14,
      scrollTrigger: { trigger: rootRef.current.querySelector('.tgt-grid'), start: 'top 78%' },
    });
  }, { scope: rootRef });

  return (
    <section className="section tgt-show" aria-labelledby="tgt-title" ref={rootRef}>
      <div className="container">
        <Reveal className="section__head section__head--center">
          <RevealItem as="p" className="eyebrow eyebrow--index">{eyebrow}</RevealItem>
          <RevealItem>
            <MorphTitle as="h2" text={title} textClass="h2" id="tgt-title" />
          </RevealItem>
        </Reveal>

        <div className="tgt-grid">
          {targets.map((t, i) => (
            <Tilt className="tgt" key={t.title} max={7}>
              <span className="tgt__glyph" aria-hidden="true">
                <Net3D shape={GLYPH_SHAPES[i % GLYPH_SHAPES.length]} size={72} speed={0.8} tiltX={0.5} nodeR={2.6} />
              </span>
              <span className="tgt__size">{t.size}</span>
              <h3 className="tgt__title">{t.title}</h3>
              <p className="tgt__desc">{t.desc}</p>
              <Link className="tgt__link" to={t.to}>
                {t.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Pourquoi() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const data = CONSTAT[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>

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

      {/* 3 — Et chez vous ? (bascule + closing) */}
      <section className="constat-bridge" data-cursor-dark>
        <div className="container constat-bridge__inner">
          <Reveal>
            <RevealItem>
              <MorphTitle as="h2" text={c.bridgeTitle} textClass="constat-bridge__title" netClass="morph__net--cream" />
            </RevealItem>
            <RevealItem as="p" className="constat-bridge__text">{c.bridgeText}</RevealItem>
            <RevealItem>
              <Link to="/contact" className="btn btn--on-dark" data-cursor-label={c.bridgeBtn}>
                {c.bridgeBtn}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* 4 — Pour qui */}
      <TargetsShow eyebrow={c.targetsEyebrow} title={c.targetsTitle} targets={c.targets} />

    </Page>
  );
}
