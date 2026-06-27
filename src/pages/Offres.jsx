import { useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import Stagger from '../components/Stagger';
import Quiz from '../components/Quiz';
import NetField from '../components/NetField';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import { OFFERS, FAQ } from '../data/site';

const CONTENT = {
  fr: {
    metaTitle: 'Offres · audit, mise en œuvre, suivi',
    metaDesc:
      "Quatre façons de travailler ensemble : l'Audit, l'Audit + mise en œuvre, le développement sur-mesure, et le suivi mensuel. Devis après échange.",
    eyebrow: 'Offres',
    title: 'Quatre façons de travailler ensemble.',
    lead: "Chaque mission est différente. On définit ensemble le périmètre, puis je vous propose une estimation claire avant de démarrer.",
    action: 'Pas sûr ? Trouvez votre offre',
    badge: 'Le plus choisi',
    swipe: 'Glissez pour comparer →',
    directH: 'Vous savez déjà ce qu\'il vous faut ?',
    directP: "Pas besoin de passer par l'audit : si votre problème est clair et que vous voulez juste passer à la réalisation, écrivez-moi directement. On gagne du temps tous les deux.",
    directBtn: "M'écrire directement",
    qcmEyebrow: 'Pas sûr de votre besoin ?',
    qcmTitle: "Deux minutes pour cibler ce qu'il vous faut.",
    qcmLead:
      "Quelques questions, et je vous propose l'accompagnement le plus juste. Pas le plus cher : le plus utile.",
    faqEyebrow: 'Questions fréquentes',
    faqTitle: "Ce qu'on me demande souvent.",
    faqLead: "Une question qui n'est pas là ? Écrivez-moi, je réponds vite et franchement.",
  },
  en: {
    metaTitle: 'Offers · audit, delivery, retainer',
    metaDesc:
      'Four ways to work together: the Audit, Audit + delivery, custom development, and monthly retainer. Quote after a conversation.',
    eyebrow: 'Offers',
    title: 'Four ways to work together.',
    lead: 'Every engagement is different. We define the scope together, then I give you a clear estimate before we start.',
    action: 'Not sure? Find your offer',
    badge: 'Most chosen',
    swipe: 'Swipe to compare →',
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
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        lead={c.lead}
        action={
          <a
            href="#qcm"
            className="btn btn--ghost"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('qcm')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {c.action}
            <span className="btn__arrow" aria-hidden="true">↓</span>
          </a>
        }
      />

      <section className="section section--tight">
        <div className="container">
          <Stagger className="offers offers--snap" stagger={0.16} y={70}>
            {offers.map((o) => (
              <div className={`offer${o.featured ? ' offer--featured' : ''}`} key={o.id}>
                {o.featured && <span className="offer__badge">{c.badge}</span>}
                <h3>{o.name}</h3>
                <p className="offer__tagline">{o.tagline}</p>
                <ul className="offer__features">
                  {o.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link className={`btn ${o.featured ? 'btn--primary' : 'btn--ghost'} offer__cta`} to="/contact">
                  {o.cta}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </Stagger>
          <p className="offers__swipe" aria-hidden="true">{c.swipe}</p>

          <Reveal className="direct-band" amount={0.15}>
            <RevealItem className="direct-band__inner">
              <div className="direct-band__text">
                <h2 className="direct-band__title">{c.directH}</h2>
                <p>{c.directP}</p>
              </div>
              <Link to="/contact" className="btn btn--primary direct-band__btn">
                {c.directBtn}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* QCM */}
      <section className="section section--tint" id="qcm">
        <div className="container">
          <div className="net-band" aria-hidden="true">
            <NetField variant="constellation" />
          </div>
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
