import { useState, useCallback, useRef, useEffect, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { invalidate } from '@react-three/fiber';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { mouvementRefuse } from '../lib/scrub';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { FRISE } from '../data/frise';
import Explorateur from './Explorateur';

const Sequence = lazy(() => import('./Sequence'));

/* ============================================================
   CE QU'ON FAIT — la ville, traversée au défilement.

   La section reste collée pendant qu'on descend, et c'est le défilement qui
   fait avancer le voyageur d'un quartier à l'autre. Rien ne tourne tout seul :
   le moteur ne dessine qu'une image par mouvement, et zéro à l'arrêt. C'est
   ce qui permet une scène de cette densité sans que la page en souffre.

   À l'écran, le nom du chantier où l'on se trouve et un bouton pour y entrer.
   Le détail attend derrière ce bouton — la ville, elle, se lit.
   ============================================================ */

export default function Frise() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = (FRISE[profil] || FRISE.pme)[lang] || FRISE.pme.fr;

  const racine = useRef(null);
  const avance = useRef(0);
  const [proche, setProche] = useState(false);
  const [actif, setActif] = useState(0);
  const [ouverte, setOuverte] = useState(null);
  const reduit = mouvementRefuse();

  /* Le moteur se monte un peu avant d'entrer à l'écran, jamais au chargement
     de la page : personne ne doit payer un moteur 3D pour un écran qu'il n'a
     pas encore atteint. */
  useEffect(() => {
    const el = racine.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setProche(true); return undefined; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setProche(true); io.disconnect(); } },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(() => {
    const el = racine.current;
    if (!el || reduit) { avance.current = 0.08; return undefined; }
    const st = ScrollTrigger.create({
      trigger: el.querySelector('.seq__rail'),
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        avance.current = self.progress;
        /* Une image par mouvement : c'est le défilement qui dessine. */
        invalidate();
      },
    });
    return () => st.kill();
  }, { scope: racine, dependencies: [profil, lang, reduit] });

  /* La liste des figures doit garder la MÊME identité d'un rendu à l'autre :
     recréée à chaque fois, elle relançait les porteurs de la scène à zéro
     juste après que le défilement les avait remplis — et comme le moteur ne
     dessine qu'à la demande, plus aucune image ne venait les réécrire. Les
     annotations ne s'affichaient jamais. */
  const figures = useMemo(() => c.etapes.map((e) => e.figure), [c.etapes]);

  const surQuartier = useCallback((i) => setActif((v) => (v === i ? v : i)), []);
  const etape = c.etapes[actif] || c.etapes[0];

  return (
    <section className="seq" ref={racine} aria-labelledby="seq-titre">
      {/* Le titre vit AVANT la traversée, en flux normal. Posé dans le
          conteneur collant, il se serait superposé à la scène. */}
      <div className="container seq__tete">
        <p className="eyebrow eyebrow--index">{c.sur}</p>
        <h2 className="h2 seq__titre" id="seq-titre">{c.titre}</h2>
      </div>

      {/* Le rail donne la longueur de la traversée ; la scène s'y colle. */}
      <div className="seq__rail">
        <div className="seq__holder">
          <div className="seq__scene">
            {proche && (
              <Suspense fallback={<div className="seq__attente" aria-hidden="true" />}>
                <Sequence
                  figures={figures}
                  lang={lang}
                  avance={avance}
                  onQuartier={surQuartier}
                />
              </Suspense>
            )}
          </div>

          <div className="container seq__pied">
            <p className="seq__quand" key={`q${etape.figure}`}>{etape.quand}</p>
            <p className="seq__nom" key={etape.figure}>{etape.nom}</p>
            <button type="button" className="seq__ouvrir" onClick={() => setOuverte(etape.figure)}>
              {c.ouvrir}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Où l'on en est dans la ville : quatre quartiers, celui qu'on visite. */}
          <div className="seq__jalons" aria-hidden="true">
            {c.etapes.map((e, i) => (
              <span key={e.figure} className={`seq__jalon${i === actif ? ' is-ici' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      {/* La scène est un canvas : un lecteur d'écran n'en tire rien. La chaîne
          est donc aussi écrite, pour lui et pour les moteurs. */}
      <div className="container seq__apres">
        <ol className="sr-only">
          {c.etapes.map((e) => (
            <li key={e.figure}>{e.quand} : {e.nom}. {e.dit}</li>
          ))}
        </ol>
        <p className="seq__posture">{c.posture}</p>
        <Link to="/offres" className="btn btn--ghost seq__act">
          {c.act}
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {ouverte && <Explorateur figure={ouverte} onFermer={() => setOuverte(null)} />}
    </section>
  );
}
