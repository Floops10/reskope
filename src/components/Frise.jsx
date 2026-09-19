import { useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { construireFrise } from '../lib/frise';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { FRISE } from '../data/frise';
import Explorateur from './Explorateur';

/* ============================================================
   LA FRISE — une séquence qu'on traverse, pas un paragraphe qu'on lit.

   Un visiteur ne veut pas lire, il veut comprendre du premier coup. Cette
   section prend donc toute la page et se joue au défilement : la scène se
   construit sous les yeux, étape par étape, et on avance dedans avec le doigt
   comme dans une vidéo qu'on tirerait à la main. Le texte à l'écran tient en
   deux lignes — le moment où le problème arrive, et ce qu'on pose à cet
   endroit-là. Tout le reste attend derrière un bouton.

   Ce bouton n'ouvre pas « la page des offres » : il ouvre l'étape où l'on se
   trouve, en volume, avec son détail. On entre dans l'animation là où on
   s'est arrêté.

   Le dessin est en SVG. Sur un téléphone, une planche vectorielle coûte
   quelques milliers de polygones au lieu d'un contexte 3D, elle reste nette à
   tous les zooms, et son texte est du vrai texte pour un moteur. La traversée
   se fait en translatant la scène : la géométrie n'est calculée qu'une fois.
   ============================================================ */

/* Les temps : une ouverture, les quatre étapes, la sortie. */
const TEMPS = 6;

export default function Frise() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = (FRISE[profil] || FRISE.pme)[lang] || FRISE.pme.fr;

  const racine = useRef(null);
  const [temps, setTemps] = useState(0);        // 0 ouverture, 1..4 étapes, 5 sortie
  const [ouverte, setOuverte] = useState(null);

  const planche = useMemo(
    () => construireFrise(c.etapes.map((e) => e.figure)),
    [c.etapes]
  );

  useGSAP(() => {
    const el = racine.current;
    if (!el) return undefined;
    const poser = (p) => {
      el.style.setProperty('--p', p.toFixed(4));
      /* La caméra s'arrête sur chaque étape puis glisse vers la suivante :
         une translation continue ne laisserait jamais le temps de lire. */
      const t = Math.min(Math.max(p * (TEMPS - 1), 0), TEMPS - 1);
      const i = Math.min(Math.floor(Math.max(t - 1, 0)), planche.arrets.length - 1);
      const j = Math.min(i + 1, planche.arrets.length - 1);
      const f = Math.min(Math.max(t - 1 - i, 0), 1);
      const doux = f < 0.5 ? 2 * f * f : 1 - ((-2 * f + 2) ** 2) / 2;
      const cam = planche.arrets[i] + (planche.arrets[j] - planche.arrets[i]) * doux;
      el.style.setProperty('--cam', (-cam).toFixed(3));
      setTemps((v) => {
        const n = Math.min(Math.round(t), TEMPS - 1);
        return v === n ? v : n;
      });
    };

    if (instant()) { poser(1); return undefined; }
    poser(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.7,
      onUpdate: (self) => poser(self.progress),
    });
    return () => st.kill();
  }, { scope: racine, dependencies: [profil, lang, planche] });

  const etape = temps >= 1 && temps <= 4 ? c.etapes[temps - 1] : null;
  const ouvrir = useCallback(() => {
    const e = temps >= 1 && temps <= 4 ? c.etapes[temps - 1] : c.etapes[0];
    setOuverte(e.figure);
  }, [temps, c.etapes]);

  return (
    <section className="frz" ref={racine} aria-labelledby="frz-titre">
      <div className="frz__holder">
        <svg className="frz__svg" viewBox={planche.fenetre} aria-hidden="true">
          <g className="frz__cam">
            {planche.etapes.map((e, i) => (
              <g className="frz__sol" key={`s${i}`} style={{ '--i': i }}>
                {e.sol.lignes.map((l, k) => (
                  <line key={k} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                ))}
                <polygon className="frz__cadre" points={e.sol.cadre} />
              </g>
            ))}

            <path className="frz__lien" d={planche.cheminLien} pathLength="1" />

            {planche.etapes.map((e, i) => (
              <g
                className={`frz__etape${temps === i + 1 ? ' is-ici' : ''}`}
                key={e.nom}
                style={{ '--i': i }}
              >
                {e.volumes.map((v, k) => (
                  <g key={k}>
                    {v.faces && v.faces.map((f, j) => (
                      <polygon key={j} className={f.cls} points={f.d} />
                    ))}
                    {v.lignes && v.lignes.map((l, j) => (
                      <line key={j} className="axo-f" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                    ))}
                  </g>
                ))}
                <line
                  className="frz__tige"
                  x1={e.ancre[0]} y1={e.ancre[1]}
                  x2={e.noeud[0]} y2={e.noeud[1]}
                />
                <circle className="frz__noeud" cx={e.noeud[0]} cy={e.noeud[1]} r="1.15" />
              </g>
            ))}
          </g>
        </svg>

        {/* Deux lignes à l'écran, jamais plus. Le reste attend le bouton. */}
        <div className="frz__dire">
          <div className={`frz__temps${temps === 0 ? ' is-ici' : ''}`}>
            <p className="eyebrow eyebrow--index">{c.sur}</p>
            <h2 className="frz__titre" id="frz-titre">{c.titre}</h2>
            <p className="frz__lead">{c.lead}</p>
          </div>

          {c.etapes.map((e, i) => (
            <div className={`frz__temps${temps === i + 1 ? ' is-ici' : ''}`} key={e.figure}>
              <p className="frz__quand">{e.quand}</p>
              <h3 className="frz__nom">{e.nom}</h3>
              <p className="frz__dit">{e.dit}</p>
            </div>
          ))}

          <div className={`frz__temps${temps === 5 ? ' is-ici' : ''}`}>
            <p className="frz__posture">{c.posture}</p>
            <Link to="/offres" className="btn btn--primary frz__act">
              {c.act}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {etape && (
          <button type="button" className="frz__plus" onClick={ouvrir}>
            {c.ouvrir}
            <span aria-hidden="true">→</span>
          </button>
        )}

        {/* Le repère de progression : où on en est dans la séquence. */}
        <div className="frz__jauge" aria-hidden="true">
          <i />
        </div>
      </div>

      {ouverte && <Explorateur figure={ouverte} onFermer={() => setOuverte(null)} />}
    </section>
  );
}
