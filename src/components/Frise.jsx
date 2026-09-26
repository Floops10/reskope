import { useState, useCallback, useRef, useEffect, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ScrollTrigger, useGSAP } from '../lib/gsap';
import { mouvementRefuse } from '../lib/scrub';
import { MISSION } from '../data/mission';
import Explorateur from './Explorateur';
import Noeuds from './Noeuds';

const Sequence = lazy(() => import('./Sequence'));

/* ============================================================
   UNE MISSION — la ville, traversée au défilement.

   La section reste collée pendant qu'on descend, et c'est le défilement qui
   fait avancer le voyageur d'un quartier à l'autre. Rien ne tourne tout seul :
   le moteur ne dessine qu'une image par mouvement, et zéro à l'arrêt. C'est
   ce qui permet une scène de cette densité sans que la page en souffre.

   À l'écran, le nom du chantier où l'on se trouve et un bouton pour y entrer.
   Le détail attend derrière ce bouton — la ville, elle, se lit.
   ============================================================ */

export default function Frise({ data = MISSION }) {
  const lang = 'fr';
  const c = data;

  const racine = useRef(null);
  const avance = useRef(0);
  /* La fonction qui redemande une image. Elle vient de la scène une fois
     montée : l'importer ici tirerait tout le moteur 3D dans le paquet
     principal, sur TOUTES les pages du site, avant même qu'on en ait besoin.
     C'est ce qui se passait, et ça coûtait trois cents kilo-octets à chaque
     première visite. */
  const redessiner = useRef(null);
  const [proche, setProche] = useState(false);
  const [pose, setPose] = useState(false);
  const [actif, setActif] = useState(0);
  const [ouverte, setOuverte] = useState(null);
  const reduit = mouvementRefuse();

  /* Le module du moteur n'est chargé qu'au PREMIER GESTE du visiteur, et
     seulement pendant un temps mort qui suit. Qui arrive sur la page et
     repart sans bouger ne télécharge rien ; qui descend, lui, a nécessairement
     fait un geste bien avant d'atteindre la section, et trouve le module déjà
     en cache. L'attente disparaît sans que personne paie pour rien. */
  useEffect(() => {
    let inactif;
    let fait = false;
    /* Pas d'écoute du défilement lui-même : l'application en déclenche un à
       chaque changement de page, et le navigateur en restaure un au retour.
       Seuls comptent les gestes qu'un programme ne produit pas. */
    const gestes = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

    const tirer = () => {
      if (fait) return;
      fait = true;
      import('./Sequence');
    };
    const amorcer = () => {
      gestes.forEach((g) => window.removeEventListener(g, amorcer));
      if (typeof requestIdleCallback === 'function') {
        inactif = requestIdleCallback(tirer, { timeout: 1200 });
      } else {
        inactif = setTimeout(tirer, 300);
      }
    };

    gestes.forEach((g) => window.addEventListener(g, amorcer, { passive: true, once: true }));
    return () => {
      gestes.forEach((g) => window.removeEventListener(g, amorcer));
      if (inactif === undefined) return;
      if (typeof cancelIdleCallback === 'function') cancelIdleCallback(inactif);
      clearTimeout(inactif);
    };
  }, []);

  /* Le moteur se MONTE un écran avant d'entrer en vue — pas plus tôt, sinon
     il se monterait dès l'arrivée sur la page et pèserait sur le premier
     affichage. Comme son module est déjà en cache, ce montage est immédiat. */
  useEffect(() => {
    const el = racine.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setProche(true); return undefined; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setProche(true); io.disconnect(); } },
      { rootMargin: '700px 0px' }
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
        if (redessiner.current) redessiner.current();
      },
    });
    return () => st.kill();
  }, { scope: racine, dependencies: [reduit] });

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
        <h2 className="h2 seq__titre" id="seq-titre">{c.titre}</h2>
      </div>

      {/* Le rail donne la longueur de la traversée ; la scène s'y colle. */}
      <div className="seq__rail">
        <div className="seq__holder">
          <div className="seq__scene">
            {/* Le sol du premier quartier, posé en attendant le moteur. C'est
                exactement ce que la scène dessine en premier : le raccord ne
                se voit pas, et l'espace n'est jamais vide. */}
            <svg
              className={`seq__poster${pose ? ' is-parti' : ''}`}
              viewBox="-30 -18 60 36"
              aria-hidden="true"
            >
              <g>
                {Array.from({ length: 9 }, (_, i) => {
                  const u = (i - 4) * 3.2;
                  return (
                    <g key={i}>
                      <line x1={u * 0.866 - 13.9} y1={u * 0.5 + 8} x2={u * 0.866 + 13.9} y2={u * 0.5 - 8} />
                      <line x1={-u * 0.866 - 13.9} y1={-u * 0.5 - 8} x2={-u * 0.866 + 13.9} y2={-u * 0.5 + 8} />
                    </g>
                  );
                })}
              </g>
            </svg>

            {proche && (
              <Suspense fallback={null}>
                <Sequence
                  figures={figures}
                  lang={lang}
                  avance={avance}
                  onQuartier={surQuartier}
                  onPose={() => setPose(true)}
                  onPret={(fn) => { redessiner.current = fn; }}
                />
              </Suspense>
            )}
          </div>

          {!reduit && (
          <div className="container seq__pied">
            {/* Une phrase, pas une étiquette au-dessus d'un titre : le moment
                et ce qu'on y fait se lisent d'un seul tenant. */}
            <p className="seq__nom" key={etape.figure}>
              <span className="seq__quand">{etape.quand},</span>{' '}
              {etape.nom.charAt(0).toLowerCase() + etape.nom.slice(1)}.
            </p>
            <button type="button" className="seq__ouvrir" onClick={() => setOuverte(etape.figure)}>
              {c.ouvrir}
              <span aria-hidden="true">→</span>
            </button>
          </div>
          )}

          {/* Où l'on en est dans la ville : quatre quartiers, celui qu'on visite. */}
          {!reduit && (
          <div className="seq__jalons" aria-hidden="true">
            {c.etapes.map((e, i) => (
              <span key={e.figure} className={`seq__jalon${i === actif ? ' is-ici' : ''}`} />
            ))}
          </div>
          )}
        </div>
      </div>

      {/* La scène est un canvas : un lecteur d'écran n'en tire rien. La chaîne
          est donc aussi écrite, pour lui et pour les moteurs. Et pour qui a
          demandé moins de mouvement, la traversée ne défile pas : les quatre
          étapes sont écrites en clair, sous la ville. */}
      <div className="container seq__apres">
        {reduit ? (
          <Noeuds
            grand
            className="seq__etapes"
            items={c.etapes.map((e) => ({
              texte: `${e.quand}, ${e.nom.charAt(0).toLowerCase()}${e.nom.slice(1)}.`,
              suite: e.dit,
            }))}
          />
        ) : (
          <ol className="sr-only">
            {c.etapes.map((e) => (
              <li key={e.figure}>{e.quand} : {e.nom}. {e.dit}</li>
            ))}
          </ol>
        )}
        <p className="seq__posture">{c.posture}</p>
        <Link to={c.actTo} className="btn btn--ghost seq__act">
          {c.act}
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {ouverte && <Explorateur figure={ouverte} onFermer={() => setOuverte(null)} />}
    </section>
  );
}
