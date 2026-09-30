import { useState, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { R_NODES, R_LINKS } from './Logo';
import CroixReseau from './CroixReseau';
import { MOT_LOGO, MOT_BOITE, R_BOITE, CORPS_MOT, BASE_MOT } from '../data/logoMot';
import { useT, useLang } from '../i18n';
import { ADRESSE_AFFICHEE } from '../data/site';
import { CARTE, recto, verso } from '../lib/carteVisite';

/* ════════════════════════════════════════════════════════════
   LES CARTES DE VISITE — celle de Florian, ou celle de Thomy.

   Format standard, 85 × 55 mm. Le dessin est exactement celui des
   fichiers de l'imprimeur et de la carte virtuelle (lib/carteVisite.js) :
   au recto la personne sur l'indigo, au verso la marque sur le crème. On
   choisit d'abord la personne, on peut écrire pour qui est la carte, et on
   la télécharge en SVG.

   Les coordonnées s'affichent sur la carte (elle est faite pour être
   partagée) mais n'apparaissent pas en clair dans le code livré : les
   robots qui moissonnent les adresses ne les trouvent pas.

   Le fichier téléchargé embarque la police : il ne s'ouvre plus en
   Helvetica chez l'imprimeur.
   ════════════════════════════════════════════════════════════ */

const { W, H } = CARTE;
/* Le R et le mot du logo, aux proportions de l'en-tête (Logo.jsx, scripts/logo.py). */
const GEO = { rNodes: R_NODES, rLinks: R_LINKS, trait: 3, noeud: 5.5, jonction: 7, motD: MOT_LOGO, rBoite: R_BOITE, motBoite: MOT_BOITE, corpsMot: CORPS_MOT, baseMot: BASE_MOT };

const dec = (s) => (typeof atob !== 'undefined' ? atob(s) : '');

/* La police de la marque, embarquée dans le fichier téléchargé. */
const POLICES = [['ReskopeSans-Regular.woff2', 400], ['ReskopeSans-Medium.woff2', 500], ['ReskopeSans-SemiBold.woff2', 600]];
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
    nomFamille: 'Bouchart',
    tel: 'KzMzIDYgMjAgMjMgNTUgMjA=',
    mail: 'Zmxvcmlhbi5ib3VjaGFydEBob3RtYWlsLmZy',
    fr: { titre: 'Cofondateur', domaine: ['Discovery, sites et outils'] },
    en: { titre: 'Co-founder', domaine: ['Discovery, websites and tools'] },
  },
  thomy: {
    prenom: 'Thomy',
    nomFamille: 'Phanzu',
    tel: 'KzMzIDcgNjEgMjUgNDQgNjU=',
    mail: 'dGhvbXlwaGFuenVAaWNsb3VkLmNvbQ==',
    fr: { titre: 'Cofondatrice', domaine: ['Business plan, marque', 'et financement'] },
    en: { titre: 'Co-founder', domaine: ['Business plan, brand', 'and funding'] },
  },
};

const MOTS = {
  fr: { qui: 'La carte de', recto: 'Carte de visite de', verso: 'Reskope : on vous aide à décider, et on construit la suite' },
  en: { qui: 'Card of', recto: 'Business card of', verso: 'Reskope: we help you decide, and we build what comes next' },
};

/* Une face : le dessin partagé, dans une carte aux coins arrondis. */
function Face({ corps, clip, label, svgRef }) {
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="bcard__svg" role="img" aria-label={label}>
      <defs>
        <clipPath id={clip}>
          <rect width={W} height={H} rx="20" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`} dangerouslySetInnerHTML={{ __html: corps }} />
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

  const faceRecto = useMemo(() => recto(
    { prenom: p.prenom, nom: p.nomFamille, tel: dec(p.tel), mail: dec(p.mail), ...(p[lang] || p.fr) },
    { geo: GEO, lang, adresse: ADRESSE_AFFICHEE, pour: pour.trim(), pourMot: t.pour },
  ), [p, lang, pour, t.pour]);
  const faceVerso = useMemo(() => verso({ geo: GEO, lang }), [lang]);

  const downloadSVG = async () => {
    const svg = (side === 'front' ? frontRef : backRef).current;
    if (!svg) return;
    const copie = svg.cloneNode(true);
    copie.setAttribute('width', '85mm');
    copie.setAttribute('height', '55mm');
    /* Pour l'imprimeur : la carte à angles droits, sans l'arrondi de l'écran. */
    copie.querySelector('defs')?.remove();
    copie.querySelector('g[clip-path]')?.removeAttribute('clip-path');
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

  /* La fenêtre est rendue sur la page elle-même, pas dans le pied de page :
     sinon elle hérite de son plan, et l'en-tête fixe passe devant. */
  return createPortal(
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

        <div className="bcard-corps">
          <div className={`bcard-flip${side === 'back' ? ' is-back' : ''}`}>
            <div className="bcard-flip__inner">
              <div className="bcard-face bcard-face--front">
                <Face corps={faceRecto} clip="bcardClip" label={`${m.recto} ${p.prenom} ${p.nomFamille}`} svgRef={frontRef} />
              </div>
              <div className="bcard-face bcard-face--back">
                <Face corps={faceVerso} clip="bcardClipBack" label={m.verso} svgRef={backRef} />
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
                maxLength={24}
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
    </div>,
    document.body,
  );
}
