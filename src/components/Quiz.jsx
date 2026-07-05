import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../i18n';
import { FORMSUBMIT_URL } from '../data/site';

/* Contenu bilingue. Les `tags` sont des clés neutres (identiques fr/en) :
   c'est la logique de reco. Seuls les libellés changent. */
const T = {
  fr: {
    questions: [
      {
        id: 'connect', q: 'Vos outils communiquent-ils entre eux ?', type: 'single',
        options: [
          { label: 'Oui, tout est connecté', tags: [] },
          { label: 'En partie seulement', tags: ['integration'] },
          { label: 'Non, chacun dans son coin', tags: ['integration', 'donnees'] },
          { label: 'Je ne sais pas trop', tags: ['audit'] },
        ],
      },
      {
        id: 'temps', q: 'Quelles tâches vous prennent le plus de temps ?', hint: 'Plusieurs choix possibles.', type: 'multi',
        options: [
          { label: 'Saisies ou ressaisies en double', tags: ['automatisation', 'integration'] },
          { label: 'Relances et e-mails répétitifs', tags: ['automatisation'] },
          { label: 'Reporting et tableaux à la main', tags: ['automatisation', 'donnees'] },
          { label: 'Copier-coller entre logiciels', tags: ['automatisation', 'integration'] },
          { label: 'Rien de particulier', tags: [] },
        ],
      },
      {
        id: 'donnees', q: 'Vos données sont-elles fiables et au même endroit ?', type: 'single',
        options: [
          { label: 'Oui, une source unique', tags: [] },
          { label: 'Éparpillées dans plusieurs outils', tags: ['donnees', 'integration'] },
          { label: 'Souvent en doublon ou contradictoires', tags: ['donnees'] },
        ],
      },
      {
        id: 'manque', q: 'Un logiciel vous manque-t-il pour un besoin précis ?', type: 'single',
        options: [
          { label: 'Oui, clairement', tags: ['developpement'] },
          { label: 'Peut-être, à creuser', tags: ['developpement', 'audit'] },
          { label: 'Non', tags: [] },
        ],
      },
      {
        id: 'vieux', q: 'Un de vos outils actuels est-il vieux ou inadapté ?', type: 'single',
        options: [
          { label: 'Oui, il faudrait le refaire', tags: ['refonte'] },
          { label: 'Il fait le job, sans plus', tags: ['refonte'] },
          { label: 'Non, ils sont récents', tags: [] },
        ],
      },
      {
        id: 'synergie', q: 'L’information circule-t-elle bien entre vos équipes ?', type: 'single',
        options: [
          { label: 'Oui, ça circule bien', tags: [] },
          { label: 'Moyennement', tags: ['synergie'] },
          { label: 'Non, beaucoup se perd', tags: ['synergie', 'integration'] },
        ],
      },
      {
        id: 'priorite', q: 'Qu’est-ce qui compte le plus pour vous ?', hint: 'Plusieurs choix possibles.', type: 'multi',
        options: [
          { label: 'Gagner du temps', tags: ['automatisation'] },
          { label: 'Réduire les coûts', tags: ['cout'] },
          { label: 'Fiabiliser les données', tags: ['donnees'] },
          { label: 'Faire évoluer un outil', tags: ['refonte', 'developpement'] },
        ],
      },
      {
        id: 'taille', q: 'Combien de personnes sont concernées ?', type: 'single',
        options: [
          { label: '1 à 5', tags: [], size: 'une petite équipe (1 à 5 personnes)' },
          { label: '6 à 20', tags: [], size: 'une équipe de 6 à 20 personnes' },
          { label: 'Plus de 20', tags: [], size: 'une équipe de plus de 20 personnes' },
        ],
      },
    ],
    needLabel: {
      automatisation: 'automatiser des tâches répétitives',
      integration: 'connecter vos outils entre eux',
      donnees: 'fiabiliser et centraliser vos données',
      refonte: 'refondre un outil existant',
      developpement: 'développer un logiciel sur-mesure',
      synergie: 'améliorer le partage d’information entre équipes',
      cout: 'maîtriser vos coûts logiciels',
    },
    offers: {
      audit: { name: 'L’Audit', price: 'dès 1 490 €' },
      delivery: { name: 'Audit + Mise en œuvre', price: '450 €/jour' },
      custom: { name: 'Sur-mesure, après un audit de cadrage', price: 'sur devis' },
    },
    defaultSize: 'votre équipe',
    message: ({ needs, offer, size }) => {
      const lines = ['Bonjour,', '', 'Je viens de remplir le questionnaire sur le site Reskope.', '', `Mon contexte : ${size}.`];
      if (needs.length) {
        lines.push('', 'Ce que j’aimerais améliorer :');
        needs.forEach((n) => lines.push(`- ${n}`));
      }
      lines.push('', `L’accompagnement qui semble correspondre : ${offer}.`, '', 'Peut-on en discuter ?', '');
      return lines.join('\n');
    },
    subjectPrefix: 'Reskope · demande d’accompagnement',
    subjectFallback: 'questionnaire',
    ui: {
      eyebrow: 'Votre accompagnement',
      recoLead: 'D’après vos réponses, le plus juste pour vous :',
      subNeeds: 'On se concentrerait surtout sur :',
      subNone: 'Tout semble déjà bien en place. Un audit léger confirmerait qu’il n’y a rien à gratter, ou révélerait les derniers gains cachés.',
      msgLabel: 'Votre message (modifiable)',
      name: 'Nom', email: 'E-mail',
      back: 'Revenir', send: 'Envoyer ma demande',
      sending: 'Envoi en cours…',
      successTitle: 'Demande envoyée !',
      successText: 'Je vous réponds sous 24 h, avec une première idée de la marche à suivre.',
      errorText: 'Une erreur est survenue. Réessayez, ou écrivez-moi directement.',
      note: 'Aucun engagement. J’ajuste avec vous lors d’un premier échange.',
      question: 'Question', prev: 'Précédent', next: 'Suivant', seeReco: 'Voir mon accompagnement',
    },
  },
  en: {
    questions: [
      {
        id: 'connect', q: 'Do your tools talk to each other?', type: 'single',
        options: [
          { label: 'Yes, everything is connected', tags: [] },
          { label: 'Only partly', tags: ['integration'] },
          { label: 'No, each on its own', tags: ['integration', 'donnees'] },
          { label: "I'm not sure", tags: ['audit'] },
        ],
      },
      {
        id: 'temps', q: 'Which tasks take you the most time?', hint: 'Multiple choices.', type: 'multi',
        options: [
          { label: 'Double or re-entered data', tags: ['automatisation', 'integration'] },
          { label: 'Repetitive follow-ups and emails', tags: ['automatisation'] },
          { label: 'Manual reporting and spreadsheets', tags: ['automatisation', 'donnees'] },
          { label: 'Copy-pasting between apps', tags: ['automatisation', 'integration'] },
          { label: 'Nothing in particular', tags: [] },
        ],
      },
      {
        id: 'donnees', q: 'Is your data reliable and in one place?', type: 'single',
        options: [
          { label: 'Yes, a single source', tags: [] },
          { label: 'Scattered across several tools', tags: ['donnees', 'integration'] },
          { label: 'Often duplicated or contradictory', tags: ['donnees'] },
        ],
      },
      {
        id: 'manque', q: 'Are you missing software for a specific need?', type: 'single',
        options: [
          { label: 'Yes, clearly', tags: ['developpement'] },
          { label: 'Maybe, worth exploring', tags: ['developpement', 'audit'] },
          { label: 'No', tags: [] },
        ],
      },
      {
        id: 'vieux', q: 'Is one of your current tools old or ill-suited?', type: 'single',
        options: [
          { label: 'Yes, it should be rebuilt', tags: ['refonte'] },
          { label: 'It does the job, barely', tags: ['refonte'] },
          { label: "No, they're recent", tags: [] },
        ],
      },
      {
        id: 'synergie', q: 'Does information flow well between your teams?', type: 'single',
        options: [
          { label: 'Yes, it flows well', tags: [] },
          { label: 'So-so', tags: ['synergie'] },
          { label: 'No, a lot gets lost', tags: ['synergie', 'integration'] },
        ],
      },
      {
        id: 'priorite', q: 'What matters most to you?', hint: 'Multiple choices.', type: 'multi',
        options: [
          { label: 'Save time', tags: ['automatisation'] },
          { label: 'Cut costs', tags: ['cout'] },
          { label: 'Make data reliable', tags: ['donnees'] },
          { label: 'Evolve a tool', tags: ['refonte', 'developpement'] },
        ],
      },
      {
        id: 'taille', q: 'How many people are involved?', type: 'single',
        options: [
          { label: '1 to 5', tags: [], size: 'a small team (1 to 5 people)' },
          { label: '6 to 20', tags: [], size: 'a team of 6 to 20 people' },
          { label: 'More than 20', tags: [], size: 'a team of more than 20 people' },
        ],
      },
    ],
    needLabel: {
      automatisation: 'automate repetitive tasks',
      integration: 'connect your tools together',
      donnees: 'make your data reliable and centralized',
      refonte: 'rebuild an existing tool',
      developpement: 'build custom software',
      synergie: 'improve information sharing between teams',
      cout: 'keep your software costs under control',
    },
    offers: {
      audit: { name: 'The Audit', price: 'from €1,490' },
      delivery: { name: 'Audit + Delivery', price: '€450/day' },
      custom: { name: 'Custom, after a scoping audit', price: 'on quote' },
    },
    defaultSize: 'your team',
    message: ({ needs, offer, size }) => {
      const lines = ['Hello,', '', 'I just filled in the questionnaire on the Reskope site.', '', `My context: ${size}.`];
      if (needs.length) {
        lines.push('', "What I'd like to improve:");
        needs.forEach((n) => lines.push(`- ${n}`));
      }
      lines.push('', `The support that seems to fit: ${offer}.`, '', 'Can we discuss it?', '');
      return lines.join('\n');
    },
    subjectPrefix: 'Reskope · support request',
    subjectFallback: 'questionnaire',
    ui: {
      eyebrow: 'Your support',
      recoLead: 'Based on your answers, the best fit for you:',
      subNeeds: "We'd focus mainly on:",
      subNone: "Everything seems already in place. A light audit would confirm there's nothing left to scrape, or reveal the last hidden gains.",
      msgLabel: 'Your message (editable)',
      name: 'Name', email: 'Email',
      back: 'Back', send: 'Send my request',
      sending: 'Sending…',
      successTitle: 'Request sent!',
      successText: "I'll get back to you within 24 h, with a first idea of the way forward.",
      errorText: 'Something went wrong. Please try again, or write to me directly.',
      note: 'No strings attached. I adjust it with you during a first conversation.',
      question: 'Question', prev: 'Back', next: 'Next', seeReco: 'See my support',
    },
  },
};

function buildResult(answers, data) {
  const tags = new Set();
  let size = data.defaultSize;
  data.questions.forEach((quest) => {
    const a = answers[quest.id];
    if (!a) return;
    const picked = quest.options.filter((o) => a.includes(o.label));
    picked.forEach((o) => {
      o.tags.forEach((t) => tags.add(t));
      if (o.size) size = o.size;
    });
  });
  const needs = [...tags].filter((t) => t !== 'audit').map((t) => data.needLabel[t]).filter(Boolean);
  const heavy = tags.has('developpement') || tags.has('refonte');
  let offerKey;
  if (needs.length === 0) offerKey = 'audit';
  else if (heavy) offerKey = 'custom';
  else offerKey = 'delivery';
  return { needs, offerKey, size };
}

export default function Quiz() {
  const { lang } = useLang();
  const data = T[lang];
  const questions = data.questions;
  const ui = data.ui;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const total = questions.length;
  const isResult = step >= total;
  const result = useMemo(() => (isResult ? buildResult(answers, data) : null), [isResult, answers, data]);
  const offer = result ? data.offers[result.offerKey] : null;
  const msgFor = (r) => data.message({ needs: r.needs, offer: data.offers[r.offerKey].name, size: r.size });

  useEffect(() => {
    if (isResult && result) setMessage((m) => m || msgFor(result));
  }, [isResult, result, data]);

  const goResult = () => {
    const r = buildResult(answers, data);
    setMessage(msgFor(r));
    setStep(total);
  };

  const pick = (quest, label) => {
    setAnswers((prev) => {
      if (quest.type === 'multi') {
        const cur = prev[quest.id] || [];
        const next = cur.includes(label) ? cur.filter((l) => l !== label) : [...cur, label];
        return { ...prev, [quest.id]: next };
      }
      return { ...prev, [quest.id]: [label] };
    });
    if (quest.type === 'single') {
      setTimeout(() => setStep((s) => Math.min(s + 1, total)), 220);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, total));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const send = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: sender.name,
          email: sender.email,
          message,
          _subject: `${data.subjectPrefix} (${sender.name || data.subjectFallback})`,
          _captcha: 'false',
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (isResult) {
    if (status === 'sent') {
      return (
        <div className="quiz quiz--result quiz--sent">
          <span className="quiz__done" aria-hidden="true" />
          <h3 className="quiz__reco">{ui.successTitle}</h3>
          <p className="quiz__sub">{ui.successText}</p>
        </div>
      );
    }
    return (
      <div className="quiz quiz--result">
        <span className="quiz__eyebrow">{ui.eyebrow}</span>
        <p className="quiz__reco-lead">{ui.recoLead}</p>
        <div className="quiz__reco-head">
          <h3 className="quiz__reco">{offer.name}</h3>
          <span className="quiz__reco-price">{offer.price}</span>
        </div>
        {result.needs.length > 0 ? (
          <>
            <p className="quiz__sub">{ui.subNeeds}</p>
            <ul className="quiz__needs">
              {result.needs.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </>
        ) : (
          <p className="quiz__sub">{ui.subNone}</p>
        )}

        <form className="quiz__form" onSubmit={send}>
          <label>
            <span>{ui.msgLabel}</span>
            <textarea rows="7" value={message} onChange={(e) => setMessage(e.target.value)} />
          </label>
          <div className="quiz__id">
            <label>
              <span>{ui.name}</span>
              <input type="text" value={sender.name} onChange={(e) => setSender((s) => ({ ...s, name: e.target.value }))} required autoComplete="name" />
            </label>
            <label>
              <span>{ui.email}</span>
              <input type="email" value={sender.email} onChange={(e) => setSender((s) => ({ ...s, email: e.target.value }))} required autoComplete="email" />
            </label>
          </div>
          {status === 'error' && <p className="quiz__error">{ui.errorText}</p>}
          <div className="quiz__actions">
            <button type="button" className="btn btn--ghost" onClick={() => setStep(total - 1)}>
              {ui.back}
            </button>
            <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
              {status === 'sending' ? ui.sending : ui.send}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
          <p className="quiz__note">{ui.note}</p>
        </form>
      </div>
    );
  }

  const quest = questions[step];
  const selected = answers[quest.id] || [];

  return (
    <div className="quiz">
      <div className="quiz__bar" aria-hidden="true">
        <span style={{ width: `${(step / total) * 100}%` }} />
      </div>
      <div className="quiz__meta">
        <span>
          {ui.question} {step + 1} / {total}
        </span>
        {quest.hint && <span className="quiz__hint">{quest.hint}</span>}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={quest.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3 className="quiz__q">{quest.q}</h3>
          <div className="quiz__options">
            {quest.options.map((o) => {
              const on = selected.includes(o.label);
              return (
                <button
                  key={o.label}
                  type="button"
                  className={`quiz__opt${on ? ' is-on' : ''}`}
                  onClick={() => pick(quest, o.label)}
                  aria-pressed={on}
                >
                  <span className="quiz__check" aria-hidden="true" />
                  {o.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="quiz__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={prev}
          disabled={step === 0}
          style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
        >
          {ui.prev}
        </button>
        {step === total - 1 ? (
          <button type="button" className="btn btn--primary" onClick={goResult}>
            {ui.seeReco}
            <span className="btn__arrow" aria-hidden="true">→</span>
          </button>
        ) : (
          <button
            type="button"
            className="btn btn--primary"
            onClick={next}
            disabled={quest.type === 'multi' && selected.length === 0}
          >
            {ui.next}
            <span className="btn__arrow" aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
