import { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import CTASection from '../components/CTASection';
import Quiz from '../components/Quiz';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import { OFFERS, FAQ } from '../data/site';

const OffersShowcase = lazy(() => import('../components/OffersShowcase'));

const CONTENT = {
  fr: {
    metaTitle: 'Offres & tarifs · audit, mise en œuvre, suivi',
    metaDesc:
      "Quatre façons de travailler ensemble, prix affichés : Audit dès 1 490 €, réalisation à 450 €/jour, développement sur devis, suivi dès 190 €/mois. Ce qui est fixe, ce qui varie.",
    eyebrow: 'Offres',
    title: 'Quatre façons de travailler ensemble.',
    lead: "Chaque mission est différente, mais les tarifs sont clairs dès le départ. On définit ensemble le périmètre, et vous savez ce que vous payez, et pourquoi.",
    action: 'Pas sûr ? Trouvez votre offre',
    cue: 'Défiler',
    badge: 'Le plus choisi',
    offerLabel: 'Offre',
    pricingLabel: 'Ce qui influence le tarif',
    detailLabel: 'Voir les détails',
    hideLabel: 'Réduire',
    prices: {
      audit: { amount: 'dès 1 490 €', note: 'Forfait, 2 à 5 jours selon la taille', type: 'Prix fixe' },
      'audit-plus': { amount: '450 €/jour', note: 'Audit inclus, réalisation estimée avant de démarrer', type: 'Au temps passé' },
      developpement: { amount: 'Sur devis · dès ~1 900 €', note: 'Estimé en jours (450 €/j) avant de démarrer', type: 'Selon la complexité' },
      suivi: { amount: 'dès 190 €/mois', note: 'Abonnement, résiliable à tout moment', type: 'Abonnement' },
    },
    billing: {
      kicker: 'Transparence',
      title: 'Comment je facture.',
      text: 'Un jour d’intervention = 450 €. L’audit et l’abonnement sont à prix fixe. La réalisation dépend du temps passé et de la complexité, estimée et validée avec vous avant de démarrer. Aucune surprise sur la facture.',
      note: 'Devis gratuit après un premier échange.',
    },
    directH: "Vous savez déjà ce qu'il vous faut ?",
    directP: "Pas besoin de passer par l'audit : si votre problème est clair et que vous voulez juste passer à la réalisation, écrivez-moi directement. On gagne du temps tous les deux.",
    directBtn: 'M\'écrire directement',
    qcmEyebrow: 'Pas sûr de votre besoin ?',
    qcmTitle: "Deux minutes pour cibler ce qu'il vous faut.",
    qcmLead:
      "Quelques questions, et je vous propose l'accompagnement le plus juste. Pas le plus cher : le plus utile.",
    faqEyebrow: 'Questions fréquentes',
    faqTitle: "Ce qu'on me demande souvent.",
    faqLead: "Une question qui n'est pas là ? Écrivez-moi, je réponds vite et franchement.",
  },
  en: {
    metaTitle: 'Offers & pricing · audit, delivery, retainer',
    metaDesc:
      'Four ways to work together, prices shown: Audit from €1,490, delivery at €450/day, custom development on quote, retainer from €190/month. What is fixed, what varies.',
    eyebrow: 'Offers',
    title: 'Four ways to work together.',
    lead: 'Every engagement is different, but pricing is clear from the start. We define the scope together, and you know what you pay, and why.',
    action: 'Not sure? Find your offer',
    cue: 'Scroll',
    badge: 'Most chosen',
    offerLabel: 'Offer',
    pricingLabel: 'What influences the price',
    detailLabel: 'See details',
    hideLabel: 'Hide',
    prices: {
      audit: { amount: 'from €1,490', note: 'Fixed package, 2 to 5 days by size', type: 'Fixed price' },
      'audit-plus': { amount: '€450/day', note: 'Audit included, delivery estimated upfront', type: 'Time-based' },
      developpement: { amount: 'On quote · from ~€1,900', note: 'Estimated in days (€450/day) upfront', type: 'By complexity' },
      suivi: { amount: 'from €190/month', note: 'Subscription, cancel anytime', type: 'Subscription' },
    },
    billing: {
      kicker: 'Transparency',
      title: 'How I bill.',
      text: 'One day of work = €450. The audit and the retainer are fixed price. Delivery depends on time and complexity, estimated and agreed with you before we start. No surprises on the invoice.',
      note: 'Free quote after a first conversation.',
    },
    directH: 'Already know what you need?',
    directP: 'No need to go through the audit: if your problem is clear and you just want to move to delivery, write to me directly. We both save time.',
    directBtn: 'Write to me directly',
    qcmEyebrow: 'Not sure what you need?',
    qcmTitle: 'Two minutes to pinpoint what you need.',
    qcmLead:
      'A few questions, and I suggest the most fitting support. Not the most expensive: the most useful.',
    faqEyebrow: 'Frequent questions',
    faqTitle: "What I'm often asked.",
    faqLead: "A question that's not here? Write to me, I answer fast and frankly.",
  },
};

function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={item.q}>
            <button
              type="button"
              className="faq__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{item.q}</span>
              <span className="faq__icon" aria-hidden="true" />
            </button>
            <div className="faq__a">
              <p>{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Offres() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const offers = OFFERS[lang];
  const faq = FAQ[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      {/* Intro + 4 offres : scènes plein écran nuit qui s'enchaînent (WebGL) */}
      <Suspense fallback={<div className="ofs-loading" aria-hidden="true" />}>
        <OffersShowcase
          key={lang}
          offers={offers}
          prices={c.prices}
          billing={c.billing}
          badge={c.badge}
          intro={{ eyebrow: c.eyebrow, title: c.title, lead: c.lead, cue: c.cue, action: c.action }}
          labels={{ offer: c.offerLabel, pricing: c.pricingLabel, detail: c.detailLabel, hide: c.hideLabel }}
          locale={lang}
        />
      </Suspense>

      {/* Bande directe */}
      <section className="section">
        <div className="container">
          <Reveal className="direct-band" amount={0.15}>
            <RevealItem className="direct-band__inner">
              <div className="direct-band__text">
                <h2 className="direct-band__title">{c.directH}</h2>
                <p>{c.directP}</p>
              </div>
              <Link
                to="/contact"
                className="btn btn--primary direct-band__btn"
                data-cursor-label={c.directBtn}
              >
                {c.directBtn}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* QCM en vedette */}
      <section className="section section--tint" id="qcm">
        <div className="container">
          <Reveal className="section__head section__head--center">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.qcmEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.qcmTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.qcmLead}</RevealItem>
          </Reveal>
          <Reveal className="quiz-wrap" amount={0.1}>
            <RevealItem>
              <Quiz />
            </RevealItem>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container faq-layout">
          <Reveal className="faq-layout__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.faqEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.faqTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.faqLead}</RevealItem>
          </Reveal>
          <Reveal className="faq-layout__list">
            <RevealItem>
              <Faq items={faq} />
            </RevealItem>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </Page>
  );
}
