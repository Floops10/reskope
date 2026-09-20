import { useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import Quiz from '../components/Quiz';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import { OFFERS, FAQ } from '../data/site';
import { useProfil } from '../profil';
import { OFFERS_TPE, PRICES_TPE, OFFRES_TPE, FAQ_TPE, PASSERELLE } from '../data/profils';

const OffersShowcase = lazy(() => import('../components/OffersShowcase'));

const CONTENT = {
  fr: {
    metaTitle: 'Nos offres · ce que contient chaque chantier',
    metaDesc:
      "Quatre façons de travailler ensemble : audit et cartographie, mise en ordre, outils sur mesure, formation et suivi. Le prix dépend de votre situation, il est écrit avant qu’on commence, et il ne bouge plus.",
    eyebrow: 'Offres',
    title: 'Quatre façons de travailler ensemble.',
    lead: "Chaque mission est différente, donc chaque prix l'est aussi. On chiffre après avoir regardé, et le montant est écrit avant qu'on commence.",
    action: 'Pas sûr ? Trouvez votre offre',
    badge: 'Le plus choisi',
    pricingLabel: 'Ce qui influence le tarif',
    comprendLabel: 'Ce que ça comprend',
    prices: {
      audit: { amount: 'Sur devis', type: 'Forfait, annoncé avant de démarrer', note: 'Chiffré en jours après un premier échange, et écrit avant qu’on commence.' },
      'audit-plus': { amount: 'Sur devis', type: 'Audit déduit', note: 'L’audit est intégralement déduit si vous nous confiez la suite.' },
      developpement: { amount: 'Sur devis', type: 'Selon ce qu’il y a à construire', note: 'Chiffré après le cadrage, jamais avant.' },
      suivi: { amount: 'Sur devis', type: 'Abonnement mensuel', note: 'Sans engagement de durée, résiliable à tout moment.' },
    },
    billing: {
      kicker: 'Transparence',
      title: 'Comment on facture.',
      lead: 'On n’affiche pas de tarif, et ce n’est pas pour cacher quelque chose.',
      faits: [
        'Deux entreprises de la même taille n’ont jamais le même chantier.',
        'On regarde votre situation, et on chiffre en jours.',
        'Le montant est écrit avant de commencer. Ensuite il ne bouge plus.',
        'L’audit est intégralement déduit si vous nous confiez la suite.',
      ],
      note: 'Devis gratuit, valable 30 jours. Tarifs nets, TVA non applicable, article 293 B du CGI. L’audit est intégralement déduit du devis de mise en œuvre si vous nous la confiez.',
    },
    directH: "Vous savez déjà ce qu'il vous faut ?",
    directP: "Pas besoin de passer par l'audit : si votre problème est clair et que vous voulez juste passer à la réalisation, écrivez-nous directement. On gagne du temps tous les deux.",
    directBtn: 'M\'écrire directement',
    qcmEyebrow: 'Pas sûr de votre besoin ?',
    qcmTitle: "Deux minutes pour cibler ce qu'il vous faut.",
    qcmLead:
      "Quelques questions, et on vous propose l'accompagnement le plus juste. Pas le plus cher : le plus utile.",
    faqEyebrow: 'Questions fréquentes',
    faqTitle: "Ce qu'on nous demande souvent.",
    faqLead: "Une question qui n'est pas là ? Écrivez-nous, on répond vite et franchement.",
  },
  en: {
    metaTitle: 'Our offers · what each project contains',
    metaDesc:
      'Four ways to work together: audit and mapping, tidy-up, tools built for you, training and support. The price depends on your situation, it is written down before we start, and it does not move.',
    eyebrow: 'Offers',
    title: 'Four ways to work together.',
    lead: 'Every engagement is different, so every price is too. We price after looking, and the figure is written down before we start.',
    action: 'Not sure? Find your offer',
    badge: 'Most chosen',
    pricingLabel: 'What influences the price',
    comprendLabel: 'What it includes',
    prices: {
      audit: { amount: 'On quote', type: 'Fixed price, agreed before we start', note: 'Priced in days after a first conversation, and written down before we begin.' },
      'audit-plus': { amount: 'On quote', type: 'Audit deducted', note: 'The audit is fully deducted if you entrust us with the delivery.' },
      developpement: { amount: 'On quote', type: 'By what has to be built', note: 'Priced after the framing, never before.' },
      suivi: { amount: 'On quote', type: 'Monthly', note: 'No fixed term, cancel any time.' },
    },
    billing: {
      kicker: 'Transparency',
      title: 'How we bill.',
      lead: 'We do not display rates, and it is not to hide anything.',
      faits: [
        'Two companies of the same size never have the same job.',
        'We look at your situation, and we price it in days.',
        'The figure is written down before we start. After that it does not move.',
        'The audit is fully deducted if you entrust us with the delivery.',
      ],
      note: 'Free quote, valid 30 days. Net prices, VAT not applicable, article 293 B of the French Tax Code. The audit is fully deducted from the delivery quote if you entrust it to us.',
    },
    directH: 'Already know what you need?',
    directP: 'No need to go through the audit: if your problem is clear and you just want to move to delivery, write to us directly. Everyone saves time.',
    directBtn: 'Write to us directly',
    qcmEyebrow: 'Not sure what you need?',
    qcmTitle: 'Two minutes to pinpoint what you need.',
    qcmLead:
      'A few questions, and we suggest the most fitting support. Not the most expensive: the most useful.',
    faqEyebrow: 'Frequent questions',
    faqTitle: "What I'm often asked.",
    faqLead: "A question that's not here? Write to us, we answer fast and frankly.",
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
  const { profil, setProfil } = useProfil();
  /* Chez une TPE il n'y a pas d'effectif à facturer : les chantiers sont
     courts et au forfait. Seul l'en-tête et le pavé de facturation
     changent, le QCM et la FAQ valent pour les deux. */
  const c = profil === 'tpe' ? { ...CONTENT[lang], ...OFFRES_TPE[lang] } : CONTENT[lang];
  /* Le jeu d'offres suit le profil : une TPE de trois personnes ne se
     voit pas proposer un audit poste par poste, ça n'aurait pas de sens.
     La passerelle en bas de page mène à l'autre version : le profil
     choisit ce qu'on montre en premier, pas ce qu'on rend inaccessible. */
  const offers = profil === 'tpe' ? OFFERS_TPE[lang] : OFFERS[lang];
  const prices = profil === 'tpe' ? PRICES_TPE[lang] : c.prices;
  const pont = PASSERELLE[lang][profil];
  const faq = profil === 'tpe' ? FAQ_TPE[lang] : FAQ[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      {/* Intro + 4 offres : scènes plein écran nuit qui s'enchaînent (WebGL) */}
      <Suspense fallback={<div className="ofs-loading" aria-hidden="true" />}>
        <OffersShowcase
          key={lang + profil}
          offers={offers}
          prices={prices}
          billing={c.billing}
          badge={c.badge}
          intro={{ eyebrow: c.eyebrow, title: c.title, lead: c.lead, action: c.action }}
          labels={{ pricing: c.pricingLabel, comprend: c.comprendLabel }}
          locale={lang}
        />
      </Suspense>

      {/* La passerelle vers l'autre profil. Elle est posée juste sous les
          offres, là où la question se pose vraiment : « et si je ne suis
          pas dans la bonne case ? ». Un bouton, pas un lien de page :
          c'est un réglage qu'on change, on reste où on est. */}
      <section className="section section--tight couture-claire">
        <div className="container">
          <Reveal>
            <RevealItem className="pont">
              <span className="pont__txt">{pont.txt}</span>
              <button
                type="button"
                className="pont__btn"
                onClick={() => setProfil(profil === 'tpe' ? 'pme' : 'tpe')}
              >
                {pont.act}
                <span aria-hidden="true">→</span>
              </button>
            </RevealItem>
          </Reveal>
        </div>
      </section>

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

    </Page>
  );
}
