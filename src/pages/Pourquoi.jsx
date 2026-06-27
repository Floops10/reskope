import { Link } from 'react-router-dom';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import Stat from '../components/Stat';
import WeekBar from '../components/WeekBar';
import InfoTip from '../components/InfoTip';
import NetField from '../components/NetField';
import CTASection from '../components/CTASection';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import { STATS } from '../data/site';

const CONTENT = {
  fr: {
    metaTitle: 'Pourquoi · le coût invisible du désordre numérique',
    metaDesc:
      "Le travail autour du travail engloutit jusqu'à 60 % du temps. Pour qui Reskope agit, et notre plus-value : ne rien vous cacher.",
    eyebrow: 'Pourquoi',
    title: 'Désordre numérique : un coût que personne ne voit.',
    lead: "Outils dispersés, saisies en double, recherche d'information : le coût ne se voit pas sur une facture, mais il est bien réel. Voici ce qu'il représente, et pour qui on agit.",
    coutEyebrow: 'Le coût invisible',
    coutTitle: 'Où part vraiment le temps de vos équipes.',
    weekCaption:
      "Près d'une demi-semaine, par personne, part dans les e-mails et la recherche d'information.",
    weekSourceLabel: 'Source du chiffre',
    weekSource:
      'McKinsey Global Institute, The Social Economy, 2012 (28 % e-mails et 19 % recherche d’information).',
    targetsEyebrow: 'Pour qui ?',
    targetsTitle: 'Pas pour tout le monde, mais pour ceux qui reconnaissent leurs outils ici.',
    plusEyebrow: 'Notre plus-value',
    plusTitle: 'Concrètement : ne rien vous cacher.',
    plusLead:
      "La transparence n'est pas un argument marketing, c'est notre méthode. Trois preuves que vous pouvez vérifier dès maintenant.",
    targets: [
      { num: '01', title: 'La PME qui grossit', size: '10 à 80 pers.', desc: "Les outils se sont accumulés au fil des années. Tout le monde a ses habitudes, personne n'a de vue d'ensemble. On audite, on priorise, on remet de l'ordre.", cta: 'Voir un exemple de bilan', to: '/exemple' },
      { num: '02', title: "L'équipe en transition", size: '20 à 150 pers.', desc: "Un projet de transformation numérique est en cours. Vous avez besoin d'un état des lieux honnête avant d'investir dans un nouvel outil.", cta: 'Voir la méthode', to: '/methode' },
      { num: '03', title: "L'artisan & le TPE", size: "Jusqu'à 20 pers.", desc: "Devis, factures, planning, échanges clients : tout est dispersé. Quelques automatisations bien choisies libèrent plusieurs heures chaque semaine.", cta: 'Voir les offres', to: '/offres' },
    ],
    pillars: [
      { title: 'Cadre clair', text: 'Un périmètre défini et des offres lisibles avant de commencer. Aucun devis-surprise.', to: '/offres', cta: 'Voir les offres' },
      { title: 'Démarche ouverte', text: "Chaque jalon est posé à l'avance. Vous savez toujours ce qui suit.", to: '/methode', cta: 'Voir la démarche' },
      { title: 'Bilan montré', text: "Un audit réel et détaillé, en accès libre. Vous voyez avant d'acheter.", to: '/exemple', cta: 'Voir un exemple' },
    ],
  },
  en: {
    metaTitle: 'Why · the invisible cost of digital clutter',
    metaDesc:
      'Work about work swallows up to 60% of the time. Who Reskope acts for, and our added value: hiding nothing from you.',
    eyebrow: 'Why',
    title: 'Digital clutter has a cost nobody sees.',
    lead: 'Scattered tools, double data entry, hunting for information: the cost never shows on an invoice, yet it is very real. Here is what it represents, and who we act for.',
    coutEyebrow: 'The invisible cost',
    coutTitle: "Where your teams' time really goes.",
    weekCaption: 'Almost half a week, per person, goes into emails and searching for information.',
    weekSourceLabel: 'Source of the figure',
    weekSource:
      'McKinsey Global Institute, The Social Economy, 2012 (28% email, 19% information search).',
    targetsEyebrow: 'Who for?',
    targetsTitle: 'Not for everyone, but for those who recognize their tools here.',
    plusEyebrow: 'Our added value',
    plusTitle: 'Concretely: hiding nothing from you.',
    plusLead:
      'Transparency is not a marketing line, it is our method. Three proofs you can check right now.',
    targets: [
      { num: '01', title: 'The growing SME', size: '10 to 80 people', desc: 'Tools piled up over the years. Everyone has their habits, no one has the full picture. We audit, prioritize, put things back in order.', cta: 'See an example report', to: '/exemple' },
      { num: '02', title: 'The team in transition', size: '20 to 150 people', desc: 'A digital transformation is under way. You need an honest assessment before investing in a new tool.', cta: 'See the method', to: '/methode' },
      { num: '03', title: 'The craftsman & micro-business', size: 'Up to 20 people', desc: 'Quotes, invoices, scheduling, client exchanges: everything is scattered. A few well-chosen automations free up several hours each week.', cta: 'See the offers', to: '/offres' },
    ],
    pillars: [
      { title: 'Clear scope', text: 'A defined scope and readable offers before we start. No surprise quotes.', to: '/offres', cta: 'See the offers' },
      { title: 'Open process', text: 'Every milestone is set in advance. You always know what comes next.', to: '/methode', cta: 'See the method' },
      { title: 'Report shown', text: 'A real, detailed audit, freely accessible. You see before you buy.', to: '/exemple', cta: 'See an example' },
    ],
  },
};

export default function Pourquoi() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const stats = STATS[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      <PageHeader eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

      {/* LE COÛT */}
      <section className="section section--tight" aria-labelledby="cout-title">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.coutEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2" id="cout-title">{c.coutTitle}</RevealItem>
          </Reveal>

          <Reveal className="weekbar-wrap" amount={0.2}>
            <RevealItem>
              <WeekBar />
            </RevealItem>
            <RevealItem as="p" className="weekbar-caption">
              {c.weekCaption}
              <InfoTip label={c.weekSourceLabel}>
                <strong>Source.</strong> {c.weekSource}
              </InfoTip>
            </RevealItem>
          </Reveal>

          <Reveal className="benefits__grid" amount={0.15}>
            {stats.map((s) => (
              <RevealItem key={s.id}>
                <Stat {...s} />
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* POUR QUI */}
      <section className="section section--tint" aria-labelledby="targets-title">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.targetsEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2" id="targets-title">{c.targetsTitle}</RevealItem>
          </Reveal>

          <Reveal className="targets" amount={0.1}>
            {c.targets.map((t) => (
              <RevealItem className="target-card" key={t.num}>
                <div className="target-card__head">
                  <span className="target-card__num">{t.num}</span>
                  <span className="target-card__size">{t.size}</span>
                </div>
                <h3 className="target-card__title">{t.title}</h3>
                <p className="target-card__desc">{t.desc}</p>
                <Link className="link" to={t.to}>{t.cta} →</Link>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* PLUS-VALUE */}
      <section className="section" aria-labelledby="transp-title">
        <div className="transp-net" aria-hidden="true">
          <NetField variant="cluster" />
        </div>
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.plusEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2" id="transp-title">{c.plusTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.plusLead}</RevealItem>
          </Reveal>

          <Reveal className="pillars" amount={0.15}>
            {c.pillars.map((p, i) => (
              <RevealItem className="pillar pillar--link" key={p.title}>
                <span className="pillar__num">{`0${i + 1}`}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <Link className="link" to={p.to}>{p.cta} →</Link>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <CTASection />
    </Page>
  );
}
