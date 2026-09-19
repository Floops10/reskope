import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { construireFrise } from '../lib/frise';
import { projeter, VIEWBOX } from '../lib/figures';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { FRISE } from '../data/frise';
import Explorateur from './Explorateur';

/* ============================================================
   LA FRISE — une seule planche, et l'offre entière se lit dessus.

   Le site montrait quatre petits dessins côte à côte. Quatre objets sans
   rapport les uns avec les autres, qu'il fallait ouvrir un par un pour
   comprendre. Ici, une seule scène : la vie de l'entreprise de gauche à
   droite, avec à chaque moment ce qui coince et ce qu'on pose à cet
   endroit-là. On voit d'un coup d'œil où on en est et ce qui vient après.

   Elle se joue au défilement comme une séquence : le sol se pose, chaque
   étape monte à son tour, le réseau se tend entre elles. Il n'y a rien à
   ouvrir pour comprendre — la version en volume est là pour aller plus loin.

   Le dessin est en SVG et non en WebGL : sur un téléphone, une planche
   vectorielle coûte quelques milliers de polygones au lieu d'un contexte 3D,
   elle reste nette à tous les zooms, et son texte est du vrai texte.

   Sur écran étroit, la planche d'ensemble n'aurait plus été lisible : chaque
   étape reprend alors son propre dessin, posé contre son texte.
   ============================================================ */

const GRAND = '(min-width: 900px)';

function useGrandEcran() {
  const [grand, setGrand] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(GRAND).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(GRAND);
    const change = (e) => setGrand(e.matches);
    mq.addEventListener('change', change);
    return () => mq.removeEventListener('change', change);
  }, []);
  return grand;
}

/* Un emblème seul, pour la version étroite. */
function Emblement({ nom }) {
  const { sol, volumes } = useMemo(() => projeter(nom, 0), [nom]);
  return (
    <svg className="frz__mini" viewBox={VIEWBOX} aria-hidden="true">
      <g className="frz__sol">
        {sol.lignes.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />)}
      </g>
      {volumes.map((v, i) => (
        <g key={i}>
          {v.faces && v.faces.map((f, k) => <polygon key={k} className={f.cls} points={f.d} />)}
          {v.lignes && v.lignes.map((l, k) => (
            <line key={k} className="axo-f" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function Frise() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = (FRISE[profil] || FRISE.pme)[lang] || FRISE.pme.fr;
  const grand = useGrandEcran();

  const racine = useRef(null);
  const [vue, setVue] = useState(-1);      // l'étape sous le curseur
  const [ouverte, setOuverte] = useState(null);

  const planche = useMemo(
    () => construireFrise(c.etapes.map((e) => e.figure)),
    [c.etapes]
  );

  /* La séquence : le sol se pose, les étapes montent l'une après l'autre, le
     réseau se tend derrière elles. Une seule variable pilote tout, et le
     rendu se fait en CSS — rien ne recalcule de géométrie au défilement. */
  useGSAP(() => {
    const el = racine.current;
    if (!el) return undefined;
    if (instant()) { el.style.setProperty('--p', '1'); return undefined; }
    el.style.setProperty('--p', '0');
    const st = ScrollTrigger.create({
      trigger: el.querySelector('.frz__planche') || el,
      start: 'top 82%',
      end: 'bottom 55%',
      scrub: 0.8,
      onUpdate: (self) => el.style.setProperty('--p', self.progress.toFixed(3)),
    });
    return () => st.kill();
  }, { scope: racine, dependencies: [profil, lang, grand] });

  const ouvrir = useCallback((figure) => setOuverte(figure), []);

  return (
    <section className="section frz" ref={racine} aria-labelledby="frz-titre">
      <div className="container">
        <p className="eyebrow eyebrow--index">{c.sur}</p>
        <h2 className="h2 frz__titre" id="frz-titre">{c.titre}</h2>
        <p className="lead frz__lead">{c.lead}</p>

        {grand && (
          <div className="frz__planche">
            <svg className="frz__svg" viewBox={planche.viewBox} aria-hidden="true">
              {planche.etapes.map((e, i) => (
                <g className="frz__sol" key={`s${i}`} style={{ '--i': i }}>
                  {e.sol.lignes.map((l, k) => (
                    <line key={k} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
                  ))}
                  <polygon className="frz__cadre" points={e.sol.cadre} />
                </g>
              ))}

              {/* Le réseau passe DERRIÈRE les volumes : il relie les étapes
                  sans jamais barrer le dessin. */}
              <path className="frz__lien" d={planche.cheminLien} pathLength="1" />

              {planche.etapes.map((e, i) => (
                <g
                  className={`frz__etape${vue === i ? ' is-vue' : ''}`}
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
            </svg>
          </div>
        )}

        <ol className="frz__etapes">
          {c.etapes.map((e, i) => (
            <li
              className="frz__case"
              key={e.figure}
              style={{ '--i': i }}
              onPointerEnter={() => setVue(i)}
              onPointerLeave={() => setVue(-1)}
            >
              {!grand && <Emblement nom={e.figure} />}
              <p className="frz__quand">{e.quand}</p>
              <h3 className="frz__nom">{e.nom}</h3>
              <p className="frz__dit">{e.dit}</p>
              <button
                type="button"
                className="frz__ouvrir"
                onClick={() => ouvrir(e.figure)}
                onFocus={() => setVue(i)}
                onBlur={() => setVue(-1)}
              >
                {c.ouvrir}
                <span aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ol>

        {/* Ce qu'on fait quand on ne sait pas faire. C'est la phrase que
            personne n'écrit, et c'est celle qui engage le plus. */}
        <p className="frz__posture">{c.posture}</p>

        <Link to="/offres" className="btn btn--ghost frz__act">
          {c.act}
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {ouverte && <Explorateur figure={ouverte} onFermer={() => setOuverte(null)} />}
    </section>
  );
}
