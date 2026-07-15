import { useState, useRef } from 'react';
import { R_NODES, R_LINKS } from './Logo';
import { useT } from '../i18n';

/* Carte de visite SVG — 85 × 54 mm → viewBox 850 × 540 */
const W = 850;
const H = 540;
const FONT = "'Neue Einstellung', 'Helvetica Neue', system-ui, sans-serif";
const CREAM = '#F0EEE8';
const INDIGO = '#1c0cb3';

/* Coordonnées encodées : elles s'affichent sur la carte (destinée à être
   partagée) mais n'apparaissent PAS en clair dans le code livré, donc ne sont
   pas moissonnables par les robots collecteurs. Décodées à l'affichage. */
const dec = (s) => (typeof atob !== 'undefined' ? atob(s) : '');
const PHONE = dec('KzMzIDYgMjAgMjMgNTUgMjI=');
const EMAIL = dec('Zmxvcmlhbi5ib3VjaGFydEBob3RtYWlsLmZy');

function RMark({ x, y, scale = 1, color = CREAM, sw = 6, nr = 7 }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <g stroke={color} strokeWidth={sw} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {R_LINKS.map(([a, b], i) => (
          <line key={i} x1={R_NODES[a][0]} y1={R_NODES[a][1]} x2={R_NODES[b][0]} y2={R_NODES[b][1]} />
        ))}
      </g>
      <g fill={color}>
        {R_NODES.map(([nx, ny], i) => (
          <circle key={i} cx={nx} cy={ny} r={i === 3 ? nr * 1.25 : nr} />
        ))}
      </g>
    </g>
  );
}

/* Trame originale (12 nœuds) — même composition que la v1 */
const TRAME = [
  [300, 82],  [418, 110], [520, 88],  [360, 180],
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
function CardFront({ pour, t, svgRef }) {
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="bcard__svg">
      <defs>
        <clipPath id="bcardClip">
          <rect width={W} height={H} rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#bcardClip)">
        <rect width={W} height={H} fill={INDIGO} />

        {/* Trame diffuse (composition originale) */}
        <g opacity="0.18">
          <Trame color={CREAM} />
        </g>

        {/* Connecteurs trame → R */}
        <g stroke={CREAM} strokeWidth="1.4" opacity="0.22">
          <line x1={560} y1={178} x2={668} y2={180} />
          <line x1={540} y1={292} x2={668} y2={330} />
          <line x1={560} y1={446} x2={668} y2={456} />
        </g>

        {/* Grand R — légèrement plus grand qu'original, saigne à droite */}
        {/* scale=3.0 : fût à x=668, y=180-456 ; arche/jambe off-card à droite */}
        <RMark x={560} y={90} scale={3.0} color={CREAM} sw={1.6} nr={2.4} />

        {/* Wordmark */}
        <RMark x={58} y={46} scale={0.5} color={CREAM} sw={8} nr={6} />
        <text x={128} y={90} fill={CREAM} fontSize={36} fontWeight="600" letterSpacing="-0.02em" fontFamily={FONT}>
          Reskope
        </text>

        {/* Filet + tagline (comble le vide haut) */}
        <line x1={58} y1={112} x2={300} y2={112} stroke={CREAM} strokeWidth="1" opacity="0.15" />
        <text x={58} y={140} fill={CREAM} fontSize={15} letterSpacing="0.04em" opacity="0.48" fontFamily={FONT}>
          Audit &amp; cartographie numérique
        </text>

        {/* Personnalisation optionnelle */}
        {pour && (
          <text x={58} y={168} fill={CREAM} fontSize={16} opacity="0.65" fontFamily={FONT}>
            {t.pour} {pour}
          </text>
        )}

        {/* Identité — remontée de ~40px vs l'original, légèrement plus grande */}
        <text x={58} y={292} fill={CREAM} fontSize={52} fontWeight="600" letterSpacing="-0.025em" fontFamily={FONT}>
          Florian Bouchart
        </text>
        <line x1={58} y1={314} x2={390} y2={314} stroke={CREAM} strokeWidth="1.5" opacity="0.22" />
        <text x={58} y={348} fill={CREAM} fontSize={18} opacity="0.72" fontFamily={FONT}>
          {t.role1}
        </text>
        <text x={58} y={374} fill={CREAM} fontSize={16.5} opacity="0.55" fontFamily={FONT}>
          {t.role2}
        </text>

        {/* Contact */}
        <line x1={58} y1={414} x2={310} y2={414} stroke={CREAM} strokeWidth="1" opacity="0.10" />
        <text x={58} y={454} fill={CREAM} fontSize={18} opacity="0.88" fontFamily={FONT}>
          {PHONE}
        </text>
        <text x={58} y={482} fill={CREAM} fontSize={17} opacity="0.82" fontFamily={FONT}>
          {EMAIL}
        </text>

        {/* URL */}
        <text x={W - 44} y={H - 26} textAnchor="end" fill={CREAM} fontSize={15} letterSpacing="0.06em" opacity="0.38" fontFamily={FONT}>
          reskope.fr
        </text>
      </g>
    </svg>
  );
}

/* ——— VERSO ——— */
/* R grand et centré sur fond crème — beaucoup plus présent que l'original (scale 1.5 → 2.7) */
function CardBack({ t, svgRef }) {
  /* Centrage horizontal : x_offset = W/2 − midX·scale = 425 − 70·2.7 = 236 */
  /* Centrage vertical top à y=64 : y_offset = 64 − 30·2.7 = −17            */
  const SC = 2.7;
  const RX = W / 2 - 70 * SC;        // 236
  const RY = 64 - 30 * SC;            // -17  →  R.top = 64, R.bottom = 313

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="bcard__svg">
      <defs>
        <clipPath id="bcardClipBack">
          <rect width={W} height={H} rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#bcardClipBack)">
        <rect width={W} height={H} fill={CREAM} />

        {/* Trame très subtile */}
        <g opacity="0.07">
          <Trame color={INDIGO} />
        </g>

        {/* Grand R centré — scale 2.7 (vs 1.5 original = 80% plus grand) */}
        <RMark x={RX} y={RY} scale={SC} color={INDIGO} sw={1.8} nr={2.8} />

        {/* Marque + rôle */}
        <text x={W / 2} y={378} textAnchor="middle" fill={INDIGO} fontSize={52} fontWeight="600" letterSpacing="-0.02em" fontFamily={FONT}>
          Reskope
        </text>
        <line x1={220} y1={402} x2={630} y2={402} stroke={INDIGO} strokeWidth="1" opacity="0.18" />
        <text x={W / 2} y={430} textAnchor="middle" fill={INDIGO} fontSize={19} opacity="0.66" fontFamily={FONT}>
          {t.role1}
        </text>
        <text x={W / 2} y={456} textAnchor="middle" fill={INDIGO} fontSize={17} opacity="0.50" fontFamily={FONT}>
          {t.role2}
        </text>
        <text x={W / 2} y={504} textAnchor="middle" fill={INDIGO} fontSize={15} letterSpacing="0.06em" opacity="0.38" fontFamily={FONT}>
          reskope.fr
        </text>
      </g>
    </svg>
  );
}

export default function BusinessCard({ onClose }) {
  const tt = useT();
  const t = tt.card;
  const [pour, setPour] = useState('');
  const [side, setSide] = useState('front');
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const downloadSVG = () => {
    const svg = (side === 'front' ? frontRef : backRef).current;
    if (!svg) return;
    const str = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([str], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const suffix = side === 'front'
      ? (pour ? `recto-${pour.toLowerCase().replace(/\s+/g, '-')}` : 'recto')
      : 'verso';
    a.download = `reskope-carte-${suffix}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bcard-modal" role="dialog" aria-modal="true" aria-label="Reskope">
      <div className="bcard-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="bcard-panel">
        <button className="bcard-close" onClick={onClose} aria-label="Fermer">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <p className="eyebrow eyebrow--index" style={{ marginBottom: '0.4rem' }}>{t.eyebrow}</p>
        <h3 className="bcard-panel__title">{t.panelTitle}</h3>

        <div className={`bcard-flip${side === 'back' ? ' is-back' : ''}`}>
          <div className="bcard-flip__inner">
            <div className="bcard-face bcard-face--front">
              <CardFront pour={pour} t={t} svgRef={frontRef} />
            </div>
            <div className="bcard-face bcard-face--back">
              <CardBack t={t} svgRef={backRef} />
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
