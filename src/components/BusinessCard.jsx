import { useState, useRef } from 'react';
import { R_NODES, R_LINKS } from './Logo';
import CroixReseau from './CroixReseau';
import { MOT_LOGO, MOT_BOITE, R_BOITE, CORPS_MOT, BASE_MOT } from '../data/logoMot';
import { useT, useLang } from '../i18n';
import { ADRESSE_AFFICHEE } from '../data/site';

/* ════════════════════════════════════════════════════════════
   LES CARTES DE VISITE — celle de Florian, ou celle de Thomy.

   85 × 54 mm, viewBox 850 × 540, recto indigo et verso crème, à
   télécharger en SVG pour l'imprimeur. On choisit d'abord la personne ; le
   recto porte son nom, ce qu'elle mène, et ses coordonnées.

   Les coordonnées s'affichent sur la carte (elle est faite pour être
   partagée) mais n'apparaissent pas en clair dans le code livré : les
   robots qui moissonnent les adresses ne les trouvent pas.

   Le logo y est celui de l'en-tête, aux mêmes proportions (R et mot
   vectorisé, voir scripts/logo.py), et le fichier téléchargé embarque la
   police : il ne s'ouvre plus en Helvetica chez l'imprimeur.
   ════════════════════════════════════════════════════════════ */

const W = 850;
const H = 540;
const FONT = "'Reskope Sans', 'Helvetica Neue', system-ui, sans-serif";
const CREAM = '#F0EEE8';
const INDIGO = '#1c0cb3';

const dec = (s) => (typeof atob !== 'undefined' ? atob(s) : '');

/* La police de la marque, embarquée dans le fichier téléchargé. */
const POLICES = [['ReskopeSans-Regular.woff2', 400], ['ReskopeSans-SemiBold.woff2', 600]];
const enBase64 = (buf) => {
  const octets = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < octets.length; i += 0x8000) bin += String.fromCharCode(...octets.subarray(i, i + 0x8000));
  return btoa(bin);
};
async function policesEmbarquees() {
  const regles = await Promise.all(POLICES.map(async ([fichier, poids]) => {
    const rep = await fetch(`${import.meta.env.BASE_URL}fonts/${fichier}`);
    if (!rep.ok) throw new Error(fichier);
    const b64 = enBase64(await rep.arrayBuffer());
    return `@font-face{font-family:'Reskope Sans';src:url(data:font/woff2;base64,${b64}) format('woff2');font-weight:${poids};}`;
  }));
  return regles.join('');
}

const PERSONNES = {
  florian: {
    prenom: 'Florian',
    nom: 'Florian Bouchart',
    tel: 'KzMzIDYgMjAgMjMgNTUgMjA=',
    mail: 'Zmxvcmlhbi5ib3VjaGFydEBob3RtYWlsLmZy',
    fr: 'Cofondateur · discovery, sites et outils',
    en: 'Co-founder · discovery, websites and tools',
  },
  thomy: {
    prenom: 'Thomy',
    nom: 'Thomy Phanzu',
    tel: 'KzMzIDcgNjEgMjUgNDQgNjU=',
    mail: 'dGhvbXlwaGFuenVAaWNsb3VkLmNvbQ==',
    fr: 'Cofondatrice · business plan, marque et financement',
    en: 'Co-founder · business plan, brand and funding',
  },
};

const MOTS = {
  fr: { qui: 'La carte de', slogan: 'On vous aide à décider, et on construit la suite.', lieux: 'Valenciennes · Lille' },
  en: { qui: 'Card of', slogan: 'We help you decide, and we build what comes next.', lieux: 'Valenciennes · Lille, France' },
};

/* Le R de la marque, toujours aux proportions du logo (Logo.jsx) : traits 3,
   nœuds 5,5, jonction 7. On change sa taille, jamais ces rapports. */
function RTrace({ color }) {
  return (
    <>
      <g stroke={color} strokeWidth="3" fill="none" strokeLinecap="round">
        {R_LINKS.map(([a, b], i) => (
          <line key={i} x1={R_NODES[a][0]} y1={R_NODES[a][1]} x2={R_NODES[b][0]} y2={R_NODES[b][1]} />
        ))}
      </g>
      <g fill={color}>
        {R_NODES.map(([nx, ny], i) => (
          <circle key={i} cx={nx} cy={ny} r={i === 3 ? 7 : 5.5} />
        ))}
      </g>
    </>
  );
}

function RMark({ x, y, scale = 1, color = CREAM, opacity = 1 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      <RTrace color={color} />
    </g>
  );
}

/* Le logo horizontal, posé comme dans l'en-tête. (x, y) : bord gauche du R
   et centre des capitales ; corps : taille du mot. */
function LogoCarte({ x, y, corps, color }) {
  const s = corps / CORPS_MOT;
  const tx = x - R_BOITE[0] * s;
  const ty = y - 76 * s;
  return (
    <g transform={`translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(${s.toFixed(5)})`}>
      <RTrace color={color} />
      <path d={MOT_LOGO} fill={color} />
    </g>
  );
}

/* Le mot du logo seul, centré sur cx, posé sur sa ligne de base. */
function MotCarte({ cx, base, corps, color }) {
  const s = corps / CORPS_MOT;
  const tx = cx - ((MOT_BOITE[0] + MOT_BOITE[2]) / 2) * s;
  const ty = base - BASE_MOT * s;
  return <path d={MOT_LOGO} fill={color} transform={`translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(${s.toFixed(5)})`} />;
}

/* La trame (12 nœuds), la même que sur toutes les cartes Reskope. */
const TRAME = [
  [300, 82], [418, 110], [520, 88], [360, 180],
  [470, 198], [560, 178], [300, 252], [432, 268],
  [540, 292], [500, 384], [560, 446], [430, 402],
];
const TRAME_LINKS = [
  [0, 1], [1, 2], [1, 3], [3, 4], [4, 5],
  [3, 6], [4, 7], [7, 8], [8, 9], [9, 10],
  [7, 11], [6, 7], [2, 5],
];

function Trame({ color }) {
  return (
    <g stroke={color} fill={color}>
      <g strokeWidth="1.4" opacity="0.5">
        {TRAME_LINKS.map(([a, b], i) => (
          <line key={i} x1={TRAME[a][0]} y1={TRAME[a][1]} x2={TRAME[b][0]} y2={TRAME[b][1]} />
        ))}
      </g>
      {TRAME.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.4" opacity="0.7" />
      ))}
    </g>
  );
}

/* ——— RECTO ——— */
function CardFront({ p, pour, t, m, lang, svgRef }) {
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="bcard__svg">
      <defs>
        <clipPath id="bcardClip">
          <rect width={W} height={H} rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#bcardClip)">
        <rect width={W} height={H} fill={INDIGO} />
        <g opacity="0.18"><Trame color={CREAM} /></g>
        <g stroke={CREAM} strokeWidth="1.4" opacity="0.22">
          <line x1={560} y1={178} x2={668} y2={180} />
          <line x1={540} y1={292} x2={668} y2={330} />
          <line x1={560} y1={446} x2={668} y2={456} />
        </g>
        {/* Le grand R, en filigrane comme la trame : le logo, c'est celui du coin. */}
        <RMark x={560} y={90} scale={3.0} color={CREAM} opacity={0.3} />

        <LogoCarte x={60} y={77} corps={44} color={CREAM} />
        <text x={58} y={140} fill={CREAM} fontSize={15} letterSpacing="0.04em" opacity="0.52" fontFamily={FONT}>
          {m.lieux}
        </text>
        {pour && (
          <text x={58} y={168} fill={CREAM} fontSize={16} opacity="0.65" fontFamily={FONT}>
            {t.pour} {pour}
          </text>
        )}

        <text x={58} y={292} fill={CREAM} fontSize={52} fontWeight="600" letterSpacing="-0.025em" fontFamily={FONT}>
          {p.nom}
        </text>
        <text x={58} y={348} fill={CREAM} fontSize={18} opacity="0.78" fontFamily={FONT}>
          {p[lang] || p.fr}
        </text>
        <text x={58} y={374} fill={CREAM} fontSize={16} opacity="0.55" fontFamily={FONT}>
          {m.slogan}
        </text>
        <text x={58} y={454} fill={CREAM} fontSize={18} opacity="0.9" fontFamily={FONT}>
          {dec(p.tel)}
        </text>
        <text x={58} y={482} fill={CREAM} fontSize={17} opacity="0.84" fontFamily={FONT}>
          {dec(p.mail)}
        </text>
        <text x={W - 44} y={H - 26} textAnchor="end" fill={CREAM} fontSize={15} letterSpacing="0.06em" opacity="0.4" fontFamily={FONT}>
          {ADRESSE_AFFICHEE}
        </text>
      </g>
    </svg>
  );
}

/* ——— VERSO ——— le R centré sur fond crème, commun aux deux cartes. */
function CardBack({ m, svgRef }) {
  const SC = 2.4;
  const RX = W / 2 - 70 * SC;
  const RY = 76 - 30 * SC;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="bcard__svg">
      <defs>
        <clipPath id="bcardClipBack">
          <rect width={W} height={H} rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#bcardClipBack)">
        <rect width={W} height={H} fill={CREAM} />
        <g opacity="0.07"><Trame color={INDIGO} /></g>
        <RMark x={RX} y={RY} scale={SC} color={INDIGO} />
        <MotCarte cx={W / 2} base={378} corps={52} color={INDIGO} />
        <text x={W / 2} y={440} textAnchor="middle" fill={INDIGO} fontSize={19} opacity="0.66" fontFamily={FONT}>
          {m.slogan}
        </text>
        <text x={W / 2} y={504} textAnchor="middle" fill={INDIGO} fontSize={15} letterSpacing="0.06em" opacity="0.4" fontFamily={FONT}>
          {ADRESSE_AFFICHEE}
        </text>
      </g>
    </svg>
  );
}

export default function BusinessCard({ onClose }) {
  const tt = useT();
  const t = tt.card;
  const { lang } = useLang();
  const m = MOTS[lang] || MOTS.fr;
  const [qui, setQui] = useState('florian');
  const [pour, setPour] = useState('');
  const [side, setSide] = useState('front');
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const p = PERSONNES[qui];

  const downloadSVG = async () => {
    const svg = (side === 'front' ? frontRef : backRef).current;
    if (!svg) return;
    const copie = svg.cloneNode(true);
    copie.setAttribute('width', '85mm');
    copie.setAttribute('height', '54mm');
    try {
      const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      style.textContent = await policesEmbarquees();
      copie.insertBefore(style, copie.firstChild);
    } catch {
      /* Hors ligne : le fichier part sans la police ; le logo, vectorisé, reste juste. */
    }
    const str = new XMLSerializer().serializeToString(copie);
    const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const suffix = side === 'front'
      ? (pour ? `recto-${pour.toLowerCase().replace(/\s+/g, '-')}` : 'recto')
      : 'verso';
    a.download = `reskope-carte-${qui}-${suffix}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bcard-modal" role="dialog" aria-modal="true" aria-label="Reskope">
      <div className="bcard-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="bcard-panel">
        <button className="bcard-close" onClick={onClose} aria-label={lang === 'en' ? 'Close' : 'Fermer'}>
          <CroixReseau />
        </button>

        <h3 className="bcard-panel__title">{t.panelTitle}</h3>

        {/* D'abord la personne : Florian ou Thomy. */}
        <div className="bcard-qui" role="radiogroup" aria-label={m.qui}>
          <span className="bcard-qui__label" aria-hidden="true">{m.qui}</span>
          {Object.entries(PERSONNES).map(([id, x]) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={qui === id}
              className={`bcard-qui__opt${qui === id ? ' is-on' : ''}`}
              onClick={() => setQui(id)}
            >
              {x.prenom}
            </button>
          ))}
        </div>

        <div className={`bcard-flip${side === 'back' ? ' is-back' : ''}`}>
          <div className="bcard-flip__inner">
            <div className="bcard-face bcard-face--front">
              <CardFront p={p} pour={pour} t={t} m={m} lang={lang} svgRef={frontRef} />
            </div>
            <div className="bcard-face bcard-face--back">
              <CardBack m={m} svgRef={backRef} />
            </div>
          </div>
        </div>

        <div className="bcard-controls">
          <label className="bcard-field">
            <span>{t.forLabel}</span>
            <input
              type="text"
              value={pour}
              onChange={(e) => setPour(e.target.value)}
              placeholder={t.forPh}
              className="bcard-input"
              maxLength={28}
            />
          </label>

          <div className="bcard-actions">
            <button
              type="button"
              onClick={() => setSide((s) => (s === 'front' ? 'back' : 'front'))}
              className="btn btn--ghost"
            >
              {side === 'front' ? t.seeBack : t.seeFront}
              <span className="btn__arrow" aria-hidden="true">↺</span>
            </button>
            <button type="button" onClick={downloadSVG} className="btn btn--primary">
              {side === 'front' ? t.dlFront : t.dlBack}
              <span className="btn__arrow" aria-hidden="true">↓</span>
            </button>
          </div>

          <p className="bcard-note">{t.note}</p>
        </div>
      </div>
    </div>
  );
}
