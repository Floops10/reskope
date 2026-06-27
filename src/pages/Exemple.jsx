import { useEffect, useRef } from 'react';
import Page from '../components/Page';
import PageHeader from '../components/PageHeader';
import CTASection from '../components/CTASection';
import Stagger from '../components/Stagger';
import InfoTip from '../components/InfoTip';
import Stat from '../components/Stat';
import { Reveal, RevealItem } from '../components/Reveal';
import { gsap } from '../lib/gsap';
import { makeScrub, enterProgress, instant } from '../lib/scrub';
import { useLang } from '../i18n';

/* ============================================================
   GÉOMÉTRIE NEUTRE (indépendante de la langue)
   ============================================================ */
const PHASE_X = [90, 356, 622, 888];

const TB_ORDER = ['crm', 'excel', 'devis', 'compta'];
const TB_POS = { crm: { cx: 186, cy: 76 }, excel: { cx: 66, cy: 190 }, devis: { cx: 306, cy: 190 }, compta: { cx: 186, cy: 282 } };
const TB_LINKS = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];

const TA_HUB_POS = { cx: 186, cy: 178 };
const TA_ORDER = ['crm', 'devis', 'compta', 'atelier'];
const TA_POS = { crm: { cx: 66, cy: 80 }, devis: { cx: 306, cy: 80 }, compta: { cx: 66, cy: 276 }, atelier: { cx: 306, cy: 276 } };

const RECO_POS = { R1: { effort: 2, impact: 3 }, R2: { effort: 1, impact: 3 }, R3: { effort: 1, impact: 2 }, R4: { effort: 2, impact: 2 } };
const PX = { 1: 150, 2: 290, 3: 430 };
const PY = { 1: 330, 2: 225, 3: 120 };
const ACTION = [
  { ids: ['R1', 'R2'], accent: true },
  { ids: ['R3'], accent: false },
  { ids: ['R4'], accent: false },
];

/* ============================================================
   CONTENU BILINGUE
   ============================================================ */
const CONTENT = {
  fr: {
    metaTitle: 'Exemple de bilan · un audit réel, détaillé',
    metaDesc:
      "Une mission réellement menée dans une PME de 18 personnes (données anonymisées) : ce que j'ai observé, mesuré et recommandé, étape par étape.",
    eyebrow: 'Étude de cas · audit réel, anonymisé',
    title: "Audit d'une PME : ce que j'ai vu, mesuré, recommandé.",
    lead: "Une mission que j'ai réellement menée dans une PME de 18 personnes. Données anonymisées à des fins d'illustration. Ce que j'ai observé, mesuré et recommandé, étape par étape.",
    meta: [
      { k: 'Secteur', v: 'Agencement sur-mesure' },
      { k: 'Effectif', v: '18 personnes · 3 pôles' },
      { k: 'Format', v: '9 entretiens · 4 outils audités' },
      { k: 'Durée', v: '6 jours · restitution en S3' },
    ],
    ctxEyebrow: 'Le contexte',
    ctxTitle: 'Une croissance rapide, des outils empilés.',
    ctxLead:
      "En quelques années, les logiciels s'étaient ajoutés au fil des besoins, sans jamais être reliés. Le dirigeant ressentait une perte de temps diffuse mais ne pouvait pas la nommer. Mon rôle : la rendre visible, la chiffrer, puis la résorber.",
    ctxSub:
      'Trois pôles concernés, neuf collaborateurs rencontrés en entretien individuel, une heure chacun, sans leur manager dans la pièce.',
    keyFigs: [
      { v: '9', l: 'entretiens individuels' },
      { v: '4', l: 'outils cartographiés' },
      { v: '6', l: 'jours de mission' },
      { v: '3', l: 'irritants majeurs isolés' },
    ],
    methodEyebrow: 'La méthode',
    methodTitle: "Comment j'ai travaillé.",
    methodLead: "Quatre phases, six jours. Rien n'est inventé : tout part du terrain.",
    phases: [
      { n: '01', label: 'Cadrage', sub: 'J1 · J2', desc: 'On définit le périmètre, les pôles à rencontrer et les outils à cartographier.' },
      { n: '02', label: 'Entretiens', sub: 'J3 – J8 · 9 pers.', desc: 'Un à un. Chaque salarié raconte sa journée-type et ses frictions sans filtre.' },
      { n: '03', label: 'Analyse', sub: 'J9 – J12', desc: 'Synthèse des irritants, cartographie des flux, chiffrage des pertes de temps.' },
      { n: '04', label: 'Bilan', sub: 'J13', desc: 'Rapport complet, matrice impact/effort, recommandations priorisées, restitution orale.' },
    ],
    methodAria: 'Les 4 phases de la méthodologie',
    constatsEyebrow: '01 · Les constats',
    constatsTitle: 'Ce que les entretiens ont révélé.',
    constatsLead:
      'Trois pôles, trois frictions distinctes, environ neuf heures par semaine perdues, identifiables dès les premiers entretiens.',
    constatTime: 'h/sem perdues',
    constatInfoLabel: 'Comment ce chiffre est estimé',
    constatInfoStrong: 'Estimation Reskope.',
    constatInfoBody:
      ' Temps moyen déclaré en entretien sur les tâches de ressaisie, recherche et relance pour ce pôle. Fourchette basse.',
    constats: [
      { pole: 'Commercial', time: '3,5', tools: ['Excel devis', 'CRM', 'E-mail'], obs: 'Chaque devis était saisi trois fois : sur Excel, recopié dans le CRM, puis renvoyé par e-mail. Les relances se faisaient de mémoire, sans suivi.', quote: 'Je refais le même devis à trois endroits.' },
      { pole: 'Atelier', time: '2', tools: ['OF papier', 'Devis Excel'], obs: "Les ordres de fabrication étaient ressaisis manuellement depuis les devis. Les changements de commande arrivaient tard, à l'oral, d'où des erreurs de production.", quote: 'On découvre les modifs trop tard.' },
      { pole: 'Administration', time: '4', tools: ['Comptabilité', 'CRM', 'Tableaux Excel'], obs: 'Le rapprochement facturation / comptabilité se faisait ligne à ligne. Les impayés étaient relancés au cas par cas, sans calendrier, sans historique.', quote: 'Je passe mes vendredis à pointer.' },
    ],
    diagEyebrow: '02 · Le diagnostic',
    diagTitle: 'Le temps perdu, mis en chiffres.',
    stats: [
      { value: 9, suffix: 'h', label: 'perdues chaque semaine sur les trois pôles identifiés.', note: "Somme des temps déclarés en entretien (Commercial 3,5 h + Atelier 2 h + Administration 4 h). Fourchette basse, non extrapolée à toute l'équipe." },
      { value: 5, suffix: 'h', label: 'perdues par personne et par semaine, en moyenne.', note: 'Chiffre dérivé des entretiens, rapporté aux personnes directement concernées par les irritants identifiés.' },
      { value: 3, label: "irritants majeurs concentraient l'essentiel des pertes." },
      { value: 2, label: "d'entre eux réglables en moins de deux semaines (quick wins)." },
    ],
    cartoEyebrow: '03 · La cartographie',
    cartoTitle: "Quatre outils. Du chaos à l'ordre.",
    cartoLead:
      "Avant l'audit, chaque outil fonctionnait en silo, toutes les données ressaisies à la main entre chacun. Après mise en œuvre, un seul flux automatisé.",
    beforeTitle: "Avant l'audit",
    afterTitle: 'Après mise en œuvre',
    toolLabels: { crm: 'CRM', excel: 'Excel', devis: 'Devis', compta: 'Compta', atelier: 'Atelier' },
    hub: ['Plateforme', 'centralisée'],
    pain: 'Ressaisie · Données éparpillées · Relances à la main',
    gainLine: 'Saisie unique · Automatisé · Synchronisé',
    beforeAria: 'Outils avant : flux croisés, ressaisies manuelles',
    afterAria: 'Outils après : flux centralisés, automatisés',
    recosEyebrow: '04 · Les recommandations',
    recosTitle: 'Priorisées par impact et par effort.',
    recosLead:
      "Chaque piste positionnée sur une matrice. En haut à gauche : les quick wins, fort impact, faible effort. C'est par là qu'on a commencé.",
    recos: [
      { id: 'R1', title: 'Relier devis → CRM → facturation', gain: '≈ 3 h/sem', detail: 'Un seul outil de devis/facture connecté au CRM. La donnée saisie une fois, reprise partout. Zéro recopie, zéro erreur de montant.' },
      { id: 'R2', title: 'Automatiser les relances clients', gain: '≈ 2 h/sem', detail: 'Séquence e-mails J+7 / J+15 / J+30, déclenchée à la validation de facture, stoppée au paiement. Mise en place en trois jours.' },
      { id: 'R3', title: 'Centraliser les docs atelier ↔ bureau', gain: '≈ 1,5 h/sem', detail: 'Espace partagé structuré par affaire, notification à chaque modification. Fini les versions perdues sur clé USB.' },
      { id: 'R4', title: 'Fusionner deux outils redondants', gain: '−1 abonnement', detail: "Deux logiciels se recoupaient. Migration sur un seul, formation de l'équipe, une interface de moins à connaître." },
    ],
    matrixAria: 'Matrice impact / effort des recommandations',
    quickWins: 'Quick wins',
    effortAxis: 'Effort →',
    impactAxis: 'Impact ↑',
    planEyebrow: "05 · Le plan d'action",
    planTitle: "Les quick wins d'abord, le fond ensuite.",
    weeksLabels: ['Semaines 1–2', 'Semaines 3–4', 'Semaines 5–8'],
    rexEyebrow: '06 · Le résultat',
    rexQuote: '« En six semaines, on a récupéré nos vendredis. Et plus personne ne ressaisit un devis. »',
    rexNote1:
      'Les deux quick wins déployés en première quinzaine, le cœur du système en semaines 3 à 8. Six semaines après la restitution : 9 heures récupérées par semaine sur les trois pôles, une facture qui ne passe plus entre trois outils, un responsable commercial qui relance sans regarder sa liste.',
    rexNote2:
      "C'est cette mission qui m'a convaincu que l'audit terrain, salarié par salarié, est le point de départ le plus honnête, et le plus efficace. C'est précisément pour ça que j'ai lancé Reskope.",
    ctaTitle: "Et si le prochain audit, c'était le vôtre ?",
    ctaText: 'Le même travail, mené chez vous, avec vos chiffres et vos équipes.',
  },
  en: {
    metaTitle: 'Example report · a real, detailed audit',
    metaDesc:
      'A mission actually carried out in an 18-person SME (anonymized data): what I observed, measured and recommended, step by step.',
    eyebrow: 'Case study · real audit, anonymized',
    title: 'Audit of an SME: what I saw, measured, recommended.',
    lead: 'A mission I actually ran in an 18-person SME. Data anonymized for illustration. What I observed, measured and recommended, step by step.',
    meta: [
      { k: 'Sector', v: 'Custom fit-out' },
      { k: 'Headcount', v: '18 people · 3 units' },
      { k: 'Format', v: '9 interviews · 4 tools audited' },
      { k: 'Duration', v: '6 days · debrief in week 3' },
    ],
    ctxEyebrow: 'The context',
    ctxTitle: 'Fast growth, piled-up tools.',
    ctxLead:
      "Over a few years, software had piled up as needs arose, never connected. The owner felt a diffuse loss of time but couldn't name it. My role: make it visible, quantify it, then absorb it.",
    ctxSub:
      'Three units involved, nine employees met one-on-one, an hour each, without their manager in the room.',
    keyFigs: [
      { v: '9', l: 'one-on-one interviews' },
      { v: '4', l: 'tools mapped' },
      { v: '6', l: 'days of work' },
      { v: '3', l: 'major pain points isolated' },
    ],
    methodEyebrow: 'The method',
    methodTitle: 'How I worked.',
    methodLead: 'Four phases, six days. Nothing is invented: it all starts on the ground.',
    phases: [
      { n: '01', label: 'Framing', sub: 'D1 · D2', desc: 'We define the scope, the units to meet and the tools to map.' },
      { n: '02', label: 'Interviews', sub: 'D3 – D8 · 9 people', desc: 'One by one. Each employee describes their typical day and frictions, unfiltered.' },
      { n: '03', label: 'Analysis', sub: 'D9 – D12', desc: 'Synthesis of pain points, mapping of flows, quantification of lost time.' },
      { n: '04', label: 'Report', sub: 'D13', desc: 'Full report, impact/effort matrix, prioritized recommendations, oral debrief.' },
    ],
    methodAria: 'The 4 phases of the methodology',
    constatsEyebrow: '01 · The findings',
    constatsTitle: 'What the interviews revealed.',
    constatsLead:
      'Three units, three distinct frictions, about nine hours a week lost, identifiable from the first interviews.',
    constatTime: 'h/wk lost',
    constatInfoLabel: 'How this figure is estimated',
    constatInfoStrong: 'Reskope estimate.',
    constatInfoBody:
      ' Average time reported in interviews for re-entry, search and follow-up tasks in this unit. Conservative range.',
    constats: [
      { pole: 'Sales', time: '3.5', tools: ['Excel quotes', 'CRM', 'Email'], obs: 'Every quote was entered three times: in Excel, copied into the CRM, then sent by email. Follow-ups were done from memory, untracked.', quote: 'I redo the same quote in three places.' },
      { pole: 'Workshop', time: '2', tools: ['Paper work orders', 'Excel quotes'], obs: 'Work orders were re-entered by hand from the quotes. Order changes arrived late, verbally, causing production errors.', quote: 'We find out about changes too late.' },
      { pole: 'Admin', time: '4', tools: ['Accounting', 'CRM', 'Excel sheets'], obs: 'Invoicing/accounting reconciliation was done line by line. Unpaid invoices were chased case by case, with no schedule, no history.', quote: 'I spend my Fridays ticking boxes.' },
    ],
    diagEyebrow: '02 · The diagnosis',
    diagTitle: 'Lost time, put into figures.',
    stats: [
      { value: 9, suffix: 'h', label: 'lost each week across the three identified units.', note: 'Sum of times reported in interviews (Sales 3.5h + Workshop 2h + Admin 4h). Conservative range, not extrapolated to the whole team.' },
      { value: 5, suffix: 'h', label: 'lost per person per week, on average.', note: 'Figure derived from the interviews, relative to the people directly affected by the identified pain points.' },
      { value: 3, label: 'major pain points concentrated most of the losses.' },
      { value: 2, label: 'of them fixable in under two weeks (quick wins).' },
    ],
    cartoEyebrow: '03 · The mapping',
    cartoTitle: 'Four tools. From chaos to order.',
    cartoLead:
      'Before the audit, each tool worked in a silo, all data re-entered by hand between them. After delivery, a single automated flow.',
    beforeTitle: 'Before the audit',
    afterTitle: 'After delivery',
    toolLabels: { crm: 'CRM', excel: 'Excel', devis: 'Quotes', compta: 'Accounting', atelier: 'Workshop' },
    hub: ['Central', 'platform'],
    pain: 'Re-entry · Scattered data · Manual follow-ups',
    gainLine: 'Single entry · Automated · Synced',
    beforeAria: 'Tools before: crossed flows, manual re-entry',
    afterAria: 'Tools after: centralized, automated flows',
    recosEyebrow: '04 · The recommendations',
    recosTitle: 'Prioritized by impact and effort.',
    recosLead:
      "Each option placed on a matrix. Top-left: the quick wins, high impact, low effort. That's where we started.",
    recos: [
      { id: 'R1', title: 'Link quotes → CRM → invoicing', gain: '≈ 3 h/wk', detail: 'A single quote/invoice tool connected to the CRM. Data entered once, reused everywhere. Zero re-entry, zero amount errors.' },
      { id: 'R2', title: 'Automate client follow-ups', gain: '≈ 2 h/wk', detail: 'Email sequence D+7 / D+15 / D+30, triggered when an invoice is issued, stopped on payment. Set up in three days.' },
      { id: 'R3', title: 'Centralize workshop ↔ office docs', gain: '≈ 1.5 h/wk', detail: 'Shared space structured by project, notification on every change. No more versions lost on a USB stick.' },
      { id: 'R4', title: 'Merge two redundant tools', gain: '−1 subscription', detail: 'Two apps overlapped. Migration to one, team training, one less interface to learn.' },
    ],
    matrixAria: 'Impact / effort matrix of the recommendations',
    quickWins: 'Quick wins',
    effortAxis: 'Effort →',
    impactAxis: 'Impact ↑',
    planEyebrow: '05 · The action plan',
    planTitle: 'Quick wins first, the deeper work next.',
    weeksLabels: ['Weeks 1–2', 'Weeks 3–4', 'Weeks 5–8'],
    rexEyebrow: '06 · The result',
    rexQuote: '“In six weeks, we got our Fridays back. And nobody re-enters a quote anymore.”',
    rexNote1:
      'The two quick wins deployed in the first fortnight, the core of the system in weeks 3 to 8. Six weeks after the debrief: 9 hours recovered per week across the three units, an invoice that no longer travels between three tools, a sales lead who follows up without checking a list.',
    rexNote2:
      "This mission convinced me that the on-the-ground audit, employee by employee, is the most honest starting point, and the most effective. That's exactly why I started Reskope.",
    ctaTitle: 'What if the next audit were yours?',
    ctaText: 'The same work, run at your place, with your figures and your teams.',
  },
};

/* ============================================================
   COMPOSANTS SVG ANIMÉS
   ============================================================ */
function ProcessTimeline({ phases, aria }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const segs = el.querySelectorAll('.pt-seg');
    const dots = el.querySelectorAll('.pt-dot');
    const reveals = el.querySelectorAll('.pt-reveal');
    segs.forEach((l) => {
      const len = l.getTotalLength();
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = instant() ? 0 : len;
    });
    if (instant()) { gsap.set([dots, reveals], { opacity: 1, scale: 1 }); return; }
    const ctx = gsap.context(() => {
      gsap.set(dots, { scale: 0, transformOrigin: 'center', opacity: 0 });
      gsap.set(reveals, { opacity: 0, y: 8 });
      const tl = gsap.timeline({ paused: true });
      tl.to(segs, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' }, 0);
      tl.to(dots, { scale: 1, opacity: 1, duration: 0.3, stagger: 0.12, ease: 'back.out(1.6)', transformOrigin: 'center' }, 0.12);
      tl.to(reveals, { opacity: 1, y: 0, duration: 0.3, stagger: 0.1, ease: 'power2.out' }, 0.22);
      return makeScrub(() => enterProgress(el, 0.9, 0.45), (p) => tl.progress(p));
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="ptl-wrap">
      <svg viewBox="0 0 978 148" className="ptl-svg" role="img" aria-label={aria}>
        <line className="pt-rail" x1={PHASE_X[0]} y1={60} x2={PHASE_X[3]} y2={60} />
        {PHASE_X.slice(0, -1).map((x, i) => (
          <line key={i} className="pt-seg" x1={x} y1={60} x2={PHASE_X[i + 1]} y2={60} />
        ))}
        {phases.map((p, i) => (
          <g key={p.n}>
            <circle className="pt-dot" cx={PHASE_X[i]} cy={60} r={18} />
            <text className="pt-num" x={PHASE_X[i]} y={66} textAnchor="middle">{p.n}</text>
          </g>
        ))}
        {phases.map((p, i) => (
          <g key={`l-${p.n}`} className="pt-reveal">
            <text className="pt-label" x={PHASE_X[i]} y={103} textAnchor="middle">{p.label}</text>
            <text className="pt-sub" x={PHASE_X[i]} y={124} textAnchor="middle">{p.sub}</text>
          </g>
        ))}
      </svg>
      <div className="ptl-descs">
        {phases.map((p) => (
          <p key={p.n} className="ptl-desc">{p.desc}</p>
        ))}
      </div>
    </div>
  );
}

function ToolMapBefore({ labels, pain, aria }) {
  return (
    <svg viewBox="0 0 372 348" className="tmap" role="img" aria-label={aria}>
      {TB_LINKS.map(([a, b], i) => {
        const A = TB_POS[TB_ORDER[a]], B = TB_POS[TB_ORDER[b]];
        return <line key={i} className="tmap-link tmap-link--before" x1={A.cx} y1={A.cy} x2={B.cx} y2={B.cy} />;
      })}
      {TB_ORDER.map((id) => {
        const n = TB_POS[id];
        return (
          <g key={id} transform={`translate(${n.cx - 46}, ${n.cy - 20})`}>
            <rect className="tmap-node tmap-node--before" x={0} y={0} width={92} height={40} rx={8} />
            <text className="tmap-label" x={46} y={25} textAnchor="middle">{labels[id]}</text>
          </g>
        );
      })}
      <text className="tmap-pain" x={186} y={338} textAnchor="middle">{pain}</text>
    </svg>
  );
}

function ToolMapAfter({ labels, hub, gainLine, aria }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const links = el.querySelectorAll('.tmap-link--after');
    links.forEach((l) => {
      const len = l.getTotalLength();
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = instant() ? 0 : len;
    });
    if (instant()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.to(links, { strokeDashoffset: 0, duration: 0.5, stagger: 0.08, ease: 'power1.inOut' });
      return makeScrub(() => enterProgress(el, 0.85, 0.4), (p) => tl.progress(p));
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} viewBox="0 0 372 348" className="tmap" role="img" aria-label={aria}>
      {TA_ORDER.map((id) => {
        const n = TA_POS[id];
        return <line key={id} className="tmap-link tmap-link--after" x1={TA_HUB_POS.cx} y1={TA_HUB_POS.cy} x2={n.cx} y2={n.cy} />;
      })}
      <g transform={`translate(${TA_HUB_POS.cx - 52}, ${TA_HUB_POS.cy - 28})`}>
        <rect className="tmap-node tmap-node--hub" x={0} y={0} width={104} height={56} rx={8} />
        <text className="tmap-label tmap-label--hub" x={52} y={22} textAnchor="middle">{hub[0]}</text>
        <text className="tmap-label tmap-label--hub" x={52} y={40} textAnchor="middle">{hub[1]}</text>
      </g>
      {TA_ORDER.map((id) => {
        const n = TA_POS[id];
        return (
          <g key={id} transform={`translate(${n.cx - 46}, ${n.cy - 20})`}>
            <rect className="tmap-node tmap-node--after" x={0} y={0} width={92} height={40} rx={8} />
            <text className="tmap-label" x={46} y={25} textAnchor="middle">{labels[id]}</text>
          </g>
        );
      })}
      <text className="tmap-gain" x={186} y={338} textAnchor="middle">{gainLine}</text>
    </svg>
  );
}

function ImpactMatrix({ recos, quickWins, effortAxis, impactAxis, aria }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dots = el.querySelectorAll('.im-dot');
    if (instant()) { gsap.set(dots, { opacity: 1, y: 0 }); return; }
    const ctx = gsap.context(() => {
      gsap.set(dots, { opacity: 0, y: 16 });
      const tl = gsap.timeline({ paused: true });
      tl.to(dots, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out' });
      return makeScrub(() => enterProgress(el, 0.85, 0.45), (p) => tl.progress(p));
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={ref} className="imatrix" viewBox="0 0 520 400" role="img" aria-label={aria}>
      <rect className="im-quad" x="70" y="70" width="220" height="160" rx="8" />
      <text className="im-quad-label" x="80" y="94">{quickWins}</text>
      <line className="im-axis" x1="70" y1="70" x2="70" y2="350" />
      <line className="im-axis" x1="70" y1="350" x2="470" y2="350" />
      <text className="im-axis-label" x="72" y="378">{effortAxis}</text>
      <text className="im-axis-label" x="22" y="220" textAnchor="middle" style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
        {impactAxis}
      </text>
      {recos.map((r) => {
        const pos = RECO_POS[r.id];
        return (
          <g className="im-dot" key={r.id}>
            <circle cx={PX[pos.effort]} cy={PY[pos.impact]} r="23" className="im-disc" />
            <text x={PX[pos.effort]} y={PY[pos.impact] + 6} textAnchor="middle" className="im-tag">{r.id}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ActionPlan({ recos, weeksLabels }) {
  const weeks = ACTION.map((w, i) => ({ ...w, label: weeksLabels[i] }));
  return (
    <div className="action-plan">
      {weeks.map((w) => (
        <div key={w.label} className={`action-week${w.accent ? ' action-week--accent' : ''}`}>
          <span className="action-week__label">{w.label}</span>
          <div className="action-week__items">
            {w.ids.map((id) => {
              const r = recos.find((x) => x.id === id);
              return (
                <div key={id} className="action-item">
                  <span className="action-item__id">{id}</span>
                  <span className="action-item__title">{r.title}</span>
                  <span className="action-item__gain">{r.gain}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function Exemple() {
  const { lang } = useLang();
  const c = CONTENT[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      <PageHeader eyebrow={c.eyebrow} title={c.title} lead={c.lead} />

      {/* Fiche client */}
      <section className="section section--tight">
        <div className="container">
          <Reveal>
            <RevealItem>
              <dl className="report-meta">
                {c.meta.map(({ k, v }) => (
                  <div className="report-meta__item" key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* Contexte + chiffres clés */}
      <section className="section">
        <div className="container case-split">
          <Reveal className="case-split__text">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.ctxEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.ctxTitle}</RevealItem>
            <RevealItem as="p" className="lead" style={{ marginTop: '1rem' }}>{c.ctxLead}</RevealItem>
            <RevealItem as="p" style={{ color: 'var(--muted)', marginTop: '0.85rem' }}>{c.ctxSub}</RevealItem>
          </Reveal>
          <Stagger className="case-split__figs" stagger={0.12} y={48}>
            {c.keyFigs.map(({ v, l }) => (
              <div className="key-fig" key={l}>
                <span className="key-fig__v">{v}</span>
                <span className="key-fig__l">{l}</span>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Méthodologie */}
      <section className="section section--tint">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.methodEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.methodTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.methodLead}</RevealItem>
          </Reveal>
          <ProcessTimeline phases={c.phases} aria={c.methodAria} />
        </div>
      </section>

      {/* Constats terrain */}
      <section className="section">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.constatsEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.constatsTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.constatsLead}</RevealItem>
          </Reveal>
          <Stagger className="constats" stagger={0.13} y={64}>
            {c.constats.map((ct) => (
              <div className="constat" key={ct.pole}>
                <div className="constat__head">
                  <h3>{ct.pole}</h3>
                  <span className="constat__time">
                    ~{ct.time} {c.constatTime}
                    <InfoTip label={c.constatInfoLabel}>
                      <strong>{c.constatInfoStrong}</strong>{c.constatInfoBody}
                    </InfoTip>
                  </span>
                </div>
                <div className="constat__tools">
                  {ct.tools.map((t) => <span key={t} className="chip">{t}</span>)}
                </div>
                <p className="constat__obs">{ct.obs}</p>
                <blockquote className="constat__quote">« {ct.quote} »</blockquote>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Diagnostic chiffré */}
      <section className="section section--tint">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.diagEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.diagTitle}</RevealItem>
          </Reveal>
          <Stagger className="benefits__grid" stagger={0.12} y={56}>
            {c.stats.map((s, i) => (
              <div key={i}>
                <Stat value={s.value} suffix={s.suffix} label={s.label} note={s.note} />
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Cartographie avant / après */}
      <section className="section">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.cartoEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.cartoTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.cartoLead}</RevealItem>
          </Reveal>
          <div className="tmap-split">
            <div className="tmap-col">
              <p className="tmap-title tmap-title--before">{c.beforeTitle}</p>
              <ToolMapBefore labels={c.toolLabels} pain={c.pain} aria={c.beforeAria} />
            </div>
            <div className="tmap-arrow" aria-hidden="true">→</div>
            <div className="tmap-col">
              <p className="tmap-title tmap-title--after">{c.afterTitle}</p>
              <ToolMapAfter labels={c.toolLabels} hub={c.hub} gainLine={c.gainLine} aria={c.afterAria} />
            </div>
          </div>
        </div>
      </section>

      {/* Recommandations + matrice */}
      <section className="section section--tint">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.recosEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.recosTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.recosLead}</RevealItem>
          </Reveal>
          <div className="case-recos">
            <Reveal className="case-recos__viz">
              <RevealItem>
                <ImpactMatrix recos={c.recos} quickWins={c.quickWins} effortAxis={c.effortAxis} impactAxis={c.impactAxis} aria={c.matrixAria} />
              </RevealItem>
            </Reveal>
            <Stagger className="case-recos__list" stagger={0.1} y={48}>
              {c.recos.map((r) => (
                <div className="case-reco" key={r.id}>
                  <div className="case-reco__top">
                    <span className="case-reco__id">{r.id}</span>
                    <h3>{r.title}</h3>
                    <span className="case-reco__gain">{r.gain}</span>
                  </div>
                  <p>{r.detail}</p>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* Plan d'action */}
      <section className="section">
        <div className="container">
          <Reveal className="section__head">
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.planEyebrow}</RevealItem>
            <RevealItem as="h2" className="h2">{c.planTitle}</RevealItem>
          </Reveal>
          <Reveal>
            <RevealItem>
              <ActionPlan recos={c.recos} weeksLabels={c.weeksLabels} />
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* REX */}
      <section className="section section--tint">
        <div className="container rex">
          <Reveal>
            <RevealItem as="p" className="eyebrow eyebrow--index">{c.rexEyebrow}</RevealItem>
            <RevealItem as="blockquote" className="rex__quote">{c.rexQuote}</RevealItem>
            <RevealItem as="p" className="rex__note">{c.rexNote1}</RevealItem>
            <RevealItem as="p" className="rex__note" style={{ marginTop: '0.85rem' }}>{c.rexNote2}</RevealItem>
          </Reveal>
        </div>
      </section>

      <CTASection title={c.ctaTitle} text={c.ctaText} />
    </Page>
  );
}
