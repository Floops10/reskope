import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import MorphTitle from '../components/MorphTitle';
import HeroNetwork from '../components/HeroNetwork';
import Quiz from '../components/Quiz';
import { Reveal, RevealItem } from '../components/Reveal';
import { gsap, useGSAP } from '../lib/gsap';
import { useLang } from '../i18n';
import { CONTACT, FORMSUBMIT_URL } from '../data/site';

/* CONTACT — clair, net, fonctionnel.
   1. HERO-FORMULAIRE : le formulaire est DANS le premier écran (carte de
      verre révélée par balayage), la réassurance à gauche (délais, cadre,
      étapes), le fond réseau vivant. Zéro friction : on arrive, on écrit.
   2. LE QUESTIONNAIRE : mis en scène proprement (3 repères clairs), le
      Quiz guide vers la bonne offre et envoie en un clic. */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const CONTENT = {
  fr: {
    metaTitle: 'Contact · parlons de vos outils',
    metaDesc:
      "Un premier échange de 30 minutes, sans engagement, pour comprendre votre contexte et voir s'il y a quelque chose à faire.",
    eyebrow: 'Contact',
    title: 'Parlons de vos outils.',
    lead: "Décrivez votre contexte en trois lignes. Je vous réponds sous 24 h, franchement : s'il n'y a rien à faire, je vous le dis.",
    points: [
      'Réponse sous 24 h, directement par moi',
      'Un échange de 30 minutes, sans engagement',
      'Un seul interlocuteur, du diagnostic à la livraison',
    ],
    nextTitle: 'Ce qui se passe ensuite',
    next: [
      { n: '01', label: 'On échange 30 minutes sur votre contexte' },
      { n: '02', label: 'Je vous dis honnêtement s’il y a un sujet' },
      { n: '03', label: 'Vous recevez un cadrage clair, chiffré' },
    ],
    directLabel: 'Ou par e-mail, tout simplement',
    name: 'Votre nom',
    email: 'Votre e-mail',
    message: 'Votre message',
    messagePh: 'Votre équipe, vos outils, ce qui coince…',
    submit: 'Envoyer le message',
    sending: 'Envoi en cours…',
    successTitle: 'Message envoyé !',
    successText: 'Je vous réponds sous 24 h.',
    errorText: 'Une erreur est survenue. Réessayez ou écrivez-moi directement.',
    consent: 'En envoyant ce message, vous acceptez que vos données soient utilisées pour vous répondre, conformément à la',
    consentLink: 'politique de confidentialité',
    quizEyebrow: 'Encore plus simple',
    quizTitle: 'Laissez-vous guider.',
    quizLead: 'Le questionnaire cerne votre besoin et prépare votre demande : vous validez, j’ai tout.',
    quizMarks: [
      { n: '01', label: '2 minutes, 8 questions' },
      { n: '02', label: 'Une recommandation chiffrée' },
      { n: '03', label: 'Votre demande pré-remplie, envoyée en 1 clic' },
    ],
  },
  en: {
    metaTitle: "Contact · let's talk about your tools",
    metaDesc:
      "A first 30-minute conversation, no strings attached, to understand your context and see whether there's something worth doing.",
    eyebrow: 'Contact',
    title: 'Talk about your tools.',
    lead: "Describe your context in three lines. I reply within 24 h, frankly: if there is nothing worth doing, I say so.",
    points: [
      'Reply within 24 h, directly from me',
      'A 30-minute conversation, no strings attached',
      'One point of contact, from diagnosis to delivery',
    ],
    nextTitle: 'What happens next',
    next: [
      { n: '01', label: 'We talk for 30 minutes about your context' },
      { n: '02', label: 'I tell you honestly whether there is a case' },
      { n: '03', label: 'You receive a clear, quantified scoping' },
    ],
    directLabel: 'Or simply by email',
    name: 'Your name',
    email: 'Your email',
    message: 'Your message',
    messagePh: 'Your team, your tools, what gets in the way…',
    submit: 'Send the message',
    sending: 'Sending…',
    successTitle: 'Message sent!',
    successText: "I'll get back to you within 24 h.",
    errorText: 'Something went wrong. Please try again or write to me directly.',
    consent: 'By sending this message, you agree that your data will be used to reply to you, in accordance with the',
    consentLink: 'privacy policy',
    quizEyebrow: 'Even simpler',
    quizTitle: 'Let it guide you.',
    quizLead: 'The questionnaire pinpoints your need and prepares your request: you approve, I have everything.',
    quizMarks: [
      { n: '01', label: '2 minutes, 8 questions' },
      { n: '02', label: 'A quantified recommendation' },
      { n: '03', label: 'Your request pre-filled, sent in 1 click' },
    ],
  },
};

export default function Contact() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const rootRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [trap, setTrap] = useState(''); // honeypot anti-bot : doit rester vide
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (trap) { setStatus('sent'); return; } // bot détecté : on ignore silencieusement
    setStatus('sending');
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Contact Reskope · ${form.name}`,
          _template: 'table',
          _honey: trap,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  useGSAP(() => {
    if (reduced()) return;
    const root = rootRef.current;
    gsap.from(root.querySelectorAll('.ctc__reveal'), {
      y: 28, autoAlpha: 0, duration: 0.85, ease: 'power3.out', stagger: 0.08, delay: 0.12,
    });
    /* la carte formulaire se révèle par balayage, puis flotte à peine */
    const card = root.querySelector('.ctc__card');
    if (card) {
      gsap.fromTo(card,
        { clipPath: 'inset(0% 0% 100% 0% round 22px)', y: 34 },
        { clipPath: 'inset(0% 0% 0% 0% round 22px)', y: 0, duration: 1.15, ease: 'power4.out', delay: 0.35,
          onComplete: () => gsap.set(card, { clearProps: 'clipPath' }) });
    }
  }, { scope: rootRef, dependencies: [lang] });

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      <div ref={rootRef}>
        {/* 1 — HERO-FORMULAIRE : on arrive, on écrit */}
        <header className="ctc" key={lang}>
          <div className="ctc__bg" aria-hidden="true">
            <HeroNetwork />
            <div className="hero2__grain" />
          </div>

          <div className="container ctc__grid">
            <div className="ctc__copy">
              <p className="eyebrow eyebrow--index ctc__reveal">{c.eyebrow}</p>
              <div className="ctc__reveal">
                <MorphTitle as="h1" text={c.title} textClass="ctc__title" intro />
              </div>
              <p className="lead ctc__lead ctc__reveal">{c.lead}</p>

              <ul className="ctc__points ctc__reveal">
                {c.points.map((pt) => (
                  <li key={pt}><span className="ctc__dot" aria-hidden="true" />{pt}</li>
                ))}
              </ul>

              <div className="ctc__next ctc__reveal">
                <span className="ctc__next-title">{c.nextTitle}</span>
                <ol className="ctc__steps">
                  {c.next.map((s) => (
                    <li key={s.n}><b>{s.n}</b>{s.label}</li>
                  ))}
                </ol>
              </div>

              <p className="ctc__direct ctc__reveal">
                <span>{c.directLabel}</span>
                <a href={`mailto:${CONTACT.email}`} className="link link--lg">{CONTACT.email}</a>
              </p>
            </div>

            {/* Le formulaire, dans le premier écran */}
            <div className="ctc__card" aria-label={c.title}>
              {status === 'sent' ? (
                <div className="ctc__success">
                  <span className="quiz__done" aria-hidden="true" />
                  <p className="ctc__success-title">{c.successTitle}</p>
                  <p className="ctc__success-text">{c.successText}</p>
                </div>
              ) : (
                <form className="ctc__form" onSubmit={onSubmit}>
                  {/* Honeypot anti-bot : invisible pour un humain, laissé vide */}
                  <input
                    type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                    className="ctc__hp" value={trap} onChange={(e) => setTrap(e.target.value)}
                  />
                  <label className="ctc__field">
                    <span>{c.name}</span>
                    <input type="text" name="name" value={form.name} onChange={update} required autoComplete="name" />
                  </label>
                  <label className="ctc__field">
                    <span>{c.email}</span>
                    <input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" />
                  </label>
                  <label className="ctc__field">
                    <span>{c.message}</span>
                    <textarea name="message" rows="6" value={form.message} onChange={update} required placeholder={c.messagePh} />
                  </label>
                  {status === 'error' && <p className="ctc__error">{c.errorText}</p>}
                  <button type="submit" className="btn btn--primary ctc__submit" disabled={status === 'sending'}>
                    {status === 'sending' ? c.sending : c.submit}
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </button>
                  <p className="ctc__consent">
                    {c.consent} <Link to="/confidentialite">{c.consentLink}</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </header>

        {/* 2 — LE QUESTIONNAIRE : guidé, clair, organisé */}
        <section className="section section--tint ctc-quiz" id="qcm">
          <div className="container">
            <Reveal className="section__head section__head--center">
              <RevealItem as="p" className="eyebrow eyebrow--index">{c.quizEyebrow}</RevealItem>
              <RevealItem>
                <MorphTitle as="h2" text={c.quizTitle} textClass="h2" />
              </RevealItem>
              <RevealItem as="p" className="lead">{c.quizLead}</RevealItem>
            </Reveal>

            <Reveal className="ctc-quiz__marks" amount={0.2}>
              {c.quizMarks.map((m) => (
                <RevealItem as="div" className="ctc-quiz__mark" key={m.n}>
                  <b>{m.n}</b>
                  <span>{m.label}</span>
                </RevealItem>
              ))}
            </Reveal>

            <Reveal className="quiz-wrap" amount={0.1}>
              <RevealItem>
                <Quiz />
              </RevealItem>
            </Reveal>
          </div>
        </section>
      </div>
    </Page>
  );
}
