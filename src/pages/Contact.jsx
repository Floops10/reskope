import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import MorphTitle from '../components/MorphTitle';
import Booking from '../components/Booking';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { FORMSUBMIT_URL } from '../data/site';

/* ════════════════════════════════════════════════════════════
   CONTACT — on arrive, on se situe, on écrit.

   Le formulaire est dans le premier écran. Il commence par la seule
   question qui nous aide vraiment à répondre vite : où en êtes-vous ? Les
   trois situations du site y sont, dans ses mots, et celle d'où l'on vient
   est déjà cochée. Le message se pré-remplit d'une phrase de départ qu'on
   peut effacer : personne ne sait par quoi commencer un message à un
   inconnu.
   ════════════════════════════════════════════════════════════ */

const SITUATIONS = [
  { id: 'idee', label: 'J’ai une idée à tester', amorce: 'Mon idée, en deux phrases : ' },
  { id: 'clients', label: 'Je veux comprendre mes clients', amorce: 'Ce qui a changé ces derniers mois : ' },
  { id: 'dossier', label: 'Mon dossier doit être relu', amorce: 'Mon rendez-vous avec le financeur est prévu le : ' },
  { id: 'autre', label: 'Autre chose', amorce: '' },
];

const ENSUITE = [
  'On vous répond sous vingt-quatre heures pour caler trente minutes.',
  'On échange trente minutes, gratuitement. Si on ne peut pas vous aider, on vous le dit.',
  'Sous quarante-huit heures, vous recevez une proposition écrite, avec un prix fixe.',
];

const BOOKING = {
  title: 'Trente minutes, à l’heure qui vous arrange.',
  lead: 'Choisissez directement un créneau dans notre agenda. Vous nous racontez votre situation, et on vous dit franchement si on peut vous aider, ou non.',
  points: [
    { value: '30 min', label: 'Au téléphone ou en visio, comme vous préférez' },
    { value: '0 €', label: 'Gratuit, sans engagement et sans relance commerciale' },
    { value: '48 h', label: 'Pour recevoir ensuite une proposition écrite, à prix fixe' },
  ],
  cta: 'Choisir un créneau',
  ctaFallback: 'Écrire plutôt',
  loading: 'Ouverture de l’agenda…',
  or: 'Vous préférez écrire ?',
  error: 'L’agenda n’a pas pu s’ouvrir. Réessayez, ou passez directement par',
  privacy: 'L’agenda est fourni par Cal.com. Son script n’est chargé qu’au moment où vous cliquez : tant que vous ne demandez pas de rendez-vous, aucune donnée ne quitte ce site.',
};

export default function Contact() {
  const racine = useRef(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  const depart = SITUATIONS.find((s) => s.id === state?.situation) || null;
  /* L'atelier envoie ici le relevé du schéma qu'on vient de composer : on
     arrive avec le message déjà écrit, il n'y a plus qu'à signer. */
  const [form, setForm] = useState({
    situation: depart ? depart.id : '',
    name: '',
    email: '',
    entreprise: '',
    message: state?.message || (depart ? depart.amorce : ''),
  });
  const [trap, setTrap] = useState(''); // honeypot anti-robot : doit rester vide
  const [status, setStatus] = useState('idle'); // idle | sending | error

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /* Changer de situation remplace la phrase de départ, mais seulement si
     on n'a encore rien écrit d'autre : on n'efface jamais un vrai message. */
  const choisir = (id) => {
    setForm((f) => {
      const avant = SITUATIONS.find((s) => s.id === f.situation);
      const vide = !f.message.trim() || (avant && f.message === avant.amorce);
      const apres = SITUATIONS.find((s) => s.id === id);
      return { ...f, situation: id, message: vide ? apres.amorce : f.message };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (trap) { navigate('/merci'); return; } // robot : on ignore sans le lui dire
    setStatus('sending');
    const situation = SITUATIONS.find((s) => s.id === form.situation);
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          entreprise: form.entreprise,
          situation: situation ? situation.label : 'Non précisée',
          message: form.message,
          _subject: `Contact Reskope · ${situation ? situation.label : 'Nouvelle demande'} · ${form.name}`,
          _template: 'table',
          _honey: trap,
        }),
      });
      if (res.ok) {
        navigate('/merci');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  useGSAP(() => {
    if (instant()) return;
    const root = racine.current;
    gsap.from(root.querySelectorAll('.ctc__reveal'), {
      z: -480, y: 36, rotateX: -20, autoAlpha: 0, duration: 0.95, ease: 'power3.out', stagger: 0.08, delay: 0.12,
    });
    const fil = root.querySelector('.ctc__fil i');
    const pts = root.querySelectorAll('.ctc__steps li > i');
    if (fil) {
      const tl = gsap.timeline({ delay: 0.55 });
      tl.fromTo(fil, { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.fromTo(pts, { scale: 0.2, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.4)', stagger: 0.3 }, 0.1);
    }
    const card = root.querySelector('.ctc__card');
    if (card) {
      gsap.fromTo(card,
        { clipPath: 'inset(0% 0% 100% 0% round 22px)', z: -300, rotateX: 14 },
        {
          clipPath: 'inset(0% 0% 0% 0% round 22px)', z: 0, rotateX: 0, duration: 1.15, ease: 'power4.out', delay: 0.35,
          onComplete: () => gsap.set(card, { clearProps: 'clipPath,transform' }),
        });
    }
  }, { scope: racine });

  return (
    <Page>
      <div ref={racine}>
        <header className="ctc">
          <div className="ctc__bg" aria-hidden="true">
            <div className="hero2__grain" />
          </div>

          <div className="container ctc__grid">
            <div className="ctc__copy">
              <div className="ctc__reveal">
                <MorphTitle as="h1" text="Parlons de votre situation." textClass="ctc__title" intro />
              </div>
              <p className="lead ctc__lead ctc__reveal">
                Dites-nous en quelques lignes où vous en êtes. On vous répond sous vingt-quatre heures, et si on
                ne peut pas vous aider, on vous le dit franchement.
              </p>

              <div className="ctc__next ctc__reveal">
                <p className="ctc__next-title">Ce qui se passe ensuite</p>
                <ol className="ctc__steps">
                  <span className="ctc__fil" aria-hidden="true"><i /></span>
                  {ENSUITE.map((s) => (
                    <li key={s}><i aria-hidden="true" />{s}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="ctc__card" id="contact-form">
              <form className="ctc__form" onSubmit={onSubmit} noValidate={false}>
                {/* Piège à robots : invisible pour un humain, laissé vide. */}
                <input
                  type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" name="_honey"
                  className="ctc__hp" value={trap} onChange={(e) => setTrap(e.target.value)}
                />

                <fieldset className="ctc__situ">
                  <legend>Où en êtes-vous ?</legend>
                  <div className="ctc__choix">
                    {SITUATIONS.map((s) => (
                      <label key={s.id} className={`ctc__puce${form.situation === s.id ? ' is-on' : ''}`}>
                        <input
                          type="radio"
                          name="situation"
                          value={s.id}
                          checked={form.situation === s.id}
                          onChange={() => choisir(s.id)}
                        />
                        <span className="ctc__puce-noeud" aria-hidden="true" />
                        {s.label}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <label className="ctc__field">
                  <span>Votre nom</span>
                  <input type="text" name="name" value={form.name} onChange={update} required autoComplete="name" />
                </label>
                <label className="ctc__field">
                  <span>Votre e-mail</span>
                  <input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" inputMode="email" />
                </label>
                <label className="ctc__field">
                  <span>Votre entreprise ou votre projet <em>(facultatif)</em></span>
                  <input type="text" name="entreprise" value={form.entreprise} onChange={update} autoComplete="organization" />
                </label>
                <label className="ctc__field">
                  <span>Votre message</span>
                  <textarea
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={update}
                    required
                    placeholder="Où vous en êtes, et la décision qui vous attend."
                  />
                </label>

                {status === 'error' && (
                  <p className="ctc__error" role="alert">
                    Le message n’est pas parti. Vérifiez votre connexion et réessayez : ce que vous avez écrit est
                    toujours là.
                  </p>
                )}
                <button type="submit" className="btn btn--primary ctc__submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </button>
                <p className="ctc__consent">
                  Vos réponses servent uniquement à vous répondre. Le détail est dans la{' '}
                  <Link to="/confidentialite">politique de confidentialité</Link>.
                </p>
              </form>
            </div>
          </div>
        </header>

        <Booking c={BOOKING} />
      </div>
    </Page>
  );
}
