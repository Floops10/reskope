import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { Reveal, RevealItem } from '../components/Reveal';
import { LogoMark } from '../components/Logo';
import { useLang } from '../i18n';
import { CONTACT } from '../data/site';

/* Pages d'état : 404 (route inconnue) et remerciement (après envoi d'une
   demande). Toutes deux ramènent vers une action utile plutôt que de laisser
   le visiteur dans une impasse. */

const CONTENT = {
  fr: {
    notFound: {
      meta: 'Page introuvable · Reskope',
      code: '404',
      title: 'Cette page n’existe pas.',
      lead: 'Le lien est peut-être ancien, ou l’adresse comporte une coquille. Voici les pages les plus utiles.',
      links: [
        { to: '/offres', label: 'Les offres et les tarifs' },
        { to: '/exemple', label: 'Un exemple de bilan complet' },
        { to: '/methode', label: 'La méthode, jalon par jalon' },
        { to: '/contact', label: 'Me contacter directement' },
      ],
      cta: 'Retour à l’accueil',
    },
    thanks: {
      meta: 'Message envoyé · Reskope',
      code: 'Merci',
      title: 'Votre message est parti.',
      lead: 'Je vous réponds sous 24 h, directement — pas un accusé de réception automatique. Si votre demande ne relève pas de mon métier, je vous le dirai franchement.',
      nextTitle: 'Ce qui se passe maintenant',
      next: [
        'Je lis votre message et je regarde votre contexte.',
        'Je vous propose un créneau de 30 minutes, sans engagement.',
        'À l’issue de l’échange, vous recevez un cadrage clair et chiffré.',
      ],
      meanwhile: 'En attendant, vous pouvez consulter un exemple de bilan complet — exactement ce que vous recevriez à l’issue d’un audit.',
      cta: 'Voir un exemple de bilan',
      home: 'Retour à l’accueil',
      urgent: 'Besoin de me joindre plus vite ?',
    },
  },
  en: {
    notFound: {
      meta: 'Page not found · Reskope',
      code: '404',
      title: 'This page does not exist.',
      lead: 'The link may be old, or the address contains a typo. Here are the most useful pages.',
      links: [
        { to: '/offres', label: 'Offers and pricing' },
        { to: '/exemple', label: 'A full example report' },
        { to: '/methode', label: 'The method, milestone by milestone' },
        { to: '/contact', label: 'Contact me directly' },
      ],
      cta: 'Back to home',
    },
    thanks: {
      meta: 'Message sent · Reskope',
      code: 'Thank you',
      title: 'Your message is on its way.',
      lead: 'I reply within 24 h, personally — not an automated acknowledgement. If your request is outside my scope, I will tell you frankly.',
      nextTitle: 'What happens now',
      next: [
        'I read your message and look at your context.',
        'I offer you a 30-minute slot, no strings attached.',
        'After the conversation, you receive a clear, quantified scoping.',
      ],
      meanwhile: 'In the meantime, you can browse a full example report — exactly what you would receive after an audit.',
      cta: 'See an example report',
      home: 'Back to home',
      urgent: 'Need to reach me faster?',
    },
  },
};

export function NotFound() {
  const { lang } = useLang();
  const c = CONTENT[lang].notFound;

  return (
    <Page title={c.meta} description={c.lead}>
      <section className="state-page">
        <div className="container state-page__inner">
          <Reveal>
            <RevealItem>
              <span className="state-page__mark" aria-hidden="true"><LogoMark /></span>
            </RevealItem>
            <RevealItem as="p" className="state-page__code">{c.code}</RevealItem>
            <RevealItem as="h1" className="state-page__title">{c.title}</RevealItem>
            <RevealItem as="p" className="state-page__lead">{c.lead}</RevealItem>
            <RevealItem>
              <ul className="state-page__links">
                {c.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}>{l.label}<span aria-hidden="true">→</span></Link>
                  </li>
                ))}
              </ul>
            </RevealItem>
            <RevealItem>
              <Link to="/" className="btn btn--primary">
                {c.cta}<span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}

export function Merci() {
  const { lang } = useLang();
  const c = CONTENT[lang].thanks;

  return (
    <Page title={c.meta} description={c.lead}>
      <section className="state-page state-page--thanks">
        <div className="container state-page__inner">
          <Reveal>
            <RevealItem>
              <span className="state-page__mark state-page__mark--ok" aria-hidden="true"><LogoMark /></span>
            </RevealItem>
            <RevealItem as="p" className="state-page__code">{c.code}</RevealItem>
            <RevealItem as="h1" className="state-page__title">{c.title}</RevealItem>
            <RevealItem as="p" className="state-page__lead">{c.lead}</RevealItem>

            <RevealItem>
              <div className="state-page__next">
                <p className="state-page__next-title">{c.nextTitle}</p>
                <ol className="state-page__steps">
                  {c.next.map((s, i) => (
                    <li key={s}><b aria-hidden="true">{i + 1}</b>{s}</li>
                  ))}
                </ol>
              </div>
            </RevealItem>

            <RevealItem as="p" className="state-page__meanwhile">{c.meanwhile}</RevealItem>

            <RevealItem>
              <div className="state-page__actions">
                <Link to="/exemple" className="btn btn--primary">
                  {c.cta}<span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
                <Link to="/" className="btn btn--ghost">{c.home}</Link>
              </div>
            </RevealItem>

            <RevealItem as="p" className="state-page__urgent">
              {c.urgent} <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </RevealItem>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
