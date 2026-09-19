import { useState, useCallback, useRef, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { mouvementRefuse } from '../lib/scrub';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { FRISE } from '../data/frise';
import Explorateur from './Explorateur';

const Sequence = lazy(() => import('./Sequence'));

/* ============================================================
   CE QU'ON FAIT — la chaîne, jouée en volume.

   Un visiteur ne lira pas. Cette section ne lui demande donc rien : la scène
   se joue toute seule, les blocs arrivent du lointain, se rangent, la caméra
   glisse vers l'étape suivante et le fil se tend derrière elle. On voit la
   chaîne se construire, et on comprend l'ordre sans qu'une phrase l'explique.

   Le seul texte à l'écran est le nom de l'étape en cours, posé dans la scène,
   et un bouton pour entrer dedans. Le détail attend derrière ce bouton.

   Le moteur n'est monté que lorsque la section approche : personne ne doit
   payer le poids d'un moteur 3D pour une page qu'il ne fera que parcourir.
   ============================================================ */

export default function Frise() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = (FRISE[profil] || FRISE.pme)[lang] || FRISE.pme.fr;

  const racine = useRef(null);
  const [proche, setProche] = useState(false);
  const [actif, setActif] = useState(0);
  const [ouverte, setOuverte] = useState(null);
  const reduit = mouvementRefuse();

  useEffect(() => {
    const el = racine.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setProche(true); return undefined; }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setProche(true); io.disconnect(); } },
      { rootMargin: '400px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const surEtape = useCallback((i) => setActif(i), []);
  const etape = c.etapes[actif] || c.etapes[0];

  return (
    <section className="section seq" ref={racine} aria-labelledby="seq-titre">
      <div className="container seq__tete">
        <p className="eyebrow eyebrow--index">{c.sur}</p>
        <h2 className="h2 seq__titre" id="seq-titre">{c.titre}</h2>
      </div>

      <div className="seq__scene">
        {proche && (
          <Suspense fallback={<div className="seq__attente" aria-hidden="true" />}>
            <Sequence
              figures={c.etapes.map((e) => e.figure)}
              mots={c.etapes.map((e) => e.quand)}
              onEtape={surEtape}
              reduit={reduit}
            />
          </Suspense>
        )}
      </div>

      <div className="container seq__pied">
        {/* Une ligne, celle de l'étape en cours, et de quoi entrer dedans. */}
        <p className="seq__nom" key={etape.figure}>{etape.nom}</p>
        <button type="button" className="seq__ouvrir" onClick={() => setOuverte(etape.figure)}>
          {c.ouvrir}
          <span aria-hidden="true">→</span>
        </button>

        {/* La scène est un canvas : un lecteur d'écran n'en tire rien. La
            chaîne est donc aussi écrite, pour lui et pour les moteurs. */}
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
