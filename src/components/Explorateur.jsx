import { Suspense, lazy, useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { SCENES, EXPL_MOTS } from '../lib/scenes';
import { lockScroll, getLenis } from '../lib/smoothScroll';

const SceneOffre = lazy(() => import('./SceneOffre'));

/* ============================================================
   L'EXPLORATEUR — on clique sur une offre, elle s'ouvre en volume.

   Ce panneau n'est pas une fiche avec un décor animé : c'est un schéma
   qu'on parcourt. Chaque étape transforme la scène — un trou se remplit,
   des équipes se mettent au même niveau, une ressaisie à la main devient une
   passerelle — et le texte à côté ne fait que dire ce qu'on voit changer. On
   peut aussi cliquer un bloc dans la scène : l'étape qui en parle s'ouvre.

   Le panneau est un portail sur le corps du document : posé dans la page,
   il aurait hérité des transformations et des recadrages des sections
   épinglées, et le plein écran serait tombé au mauvais endroit.

   La scène n'est chargée qu'à l'ouverture. Personne ne doit payer le poids
   d'un moteur 3D pour lire une page qu'il ne fera que parcourir.
   ============================================================ */

export default function Explorateur({ figure, onFermer, plus }) {
  const { lang } = useLang();
  const scene = SCENES[figure];
  const m = EXPL_MOTS[lang] || EXPL_MOTS.fr;
  const c = scene ? (scene[lang] || scene.fr) : null;

  const [active, setActive] = useState(0);
  const panneau = useRef(null);
  const rendu = useRef(null);

  const reduit = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Échap ferme, et le focus reste dans le panneau tant qu'il est ouvert :
     un panneau qu'on ne peut pas quitter au clavier est un piège. */
  useEffect(() => {
    const avant = document.activeElement;
    lockScroll(true);
    /* Sans Lenis (mouvement réduit), le scroll est natif : rien ne l'arrête,
       et la page continuerait de défiler derrière le panneau. On coupe alors
       le débordement du corps. Avec Lenis, on ne touche à rien : masquer la
       barre de défilement décalerait toute la page d'un coup. */
    const natif = !getLenis();
    const avantOverflow = document.body.style.overflow;
    if (natif) document.body.style.overflow = 'hidden';
    const touche = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onFermer(); return; }
      if (e.key !== 'Tab' || !panneau.current) return;
      const f = panneau.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!f.length) return;
      const prem = f[0];
      const dern = f[f.length - 1];
      if (e.shiftKey && document.activeElement === prem) { e.preventDefault(); dern.focus(); }
      else if (!e.shiftKey && document.activeElement === dern) { e.preventDefault(); prem.focus(); }
    };
    document.addEventListener('keydown', touche);
    const t = setTimeout(() => rendu.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', touche);
      clearTimeout(t);
      lockScroll(false);
      if (natif) document.body.style.overflow = avantOverflow;
      if (avant && avant.focus) avant.focus();
    };
  }, [onFermer]);

  /* Cliquer un volume dans la scène ouvre l'étape qui en parle. */
  const surBloc = useCallback((id) => {
    if (!scene) return;
    const k = scene.etapes.findIndex((e) => (e.ids || []).includes(id));
    if (k >= 0) setActive(k);
  }, [scene]);

  if (!c) return null;
  const etape = scene.etapes[active];
  const dit = etape[lang] || etape.fr;
  const dernier = active === scene.etapes.length - 1;

  return createPortal(
    <div className="expl3d" role="dialog" aria-modal="true" aria-label={c.titre} ref={panneau}>
      <button type="button" className="expl3d__fond" aria-label={m.fermer} onClick={onFermer} />

      <div className="expl3d__cadre">
        {/* La scène occupe la plus grande part : c'est elle qui explique. */}
        <div className="expl3d__scene" data-cursor-prise>
          <Suspense fallback={<div className="expl3d__attente" aria-hidden="true" />}>
            <SceneOffre
              nom={figure}
              etape={etape}
              onBloc={surBloc}
              reduit={reduit}
              lang={lang}
            />
          </Suspense>
          <p className="expl3d__aide" aria-hidden="true">{m.tourner}</p>
        </div>

        <div className="expl3d__texte">
          <button type="button" className="expl3d__fermer" onClick={onFermer} ref={rendu}>
            <span>{m.fermer}</span>
            <i aria-hidden="true" />
          </button>

          <h2 className="expl3d__titre">{c.titre}</h2>
          <p className="expl3d__intro">{c.intro}</p>

          {/* Les étapes : on en choisit une, la scène se transforme et
              l'explication suit. Cliquer un volume fait la même chose, dans
              l'autre sens. */}
          <div className="expl3d__pieces">
            {scene.etapes.map((e, i) => (
              <button
                type="button"
                key={i}
                className={`expl3d__piece${i === active ? ' is-on' : ''}`}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
              >
                {(e[lang] || e.fr).nom}
              </button>
            ))}
          </div>

          <p className="expl3d__dit" key={active}>{dit.dit}</p>

          {!dernier && (
            <button
              type="button"
              className="expl3d__suite"
              onClick={() => setActive((k) => Math.min(k + 1, scene.etapes.length - 1))}
            >
              {m.etape}
              <span aria-hidden="true">→</span>
            </button>
          )}

          <p className="expl3d__fin">{c.fin}</p>

          {/* Ouvert depuis la page des offres, le volume porte aussi ce que
              contient le chantier et ce qui en fait bouger le prix : on ne
              renvoie pas le visiteur ailleurs pour finir sa lecture. */}
          {plus && (
            <div className="expl3d__plus">
              <p className="expl3d__detail">{plus.detail}</p>
              <p className="expl3d__tarif">{plus.tarifLabel}</p>
              <ul className="expl3d__facteurs">
                {plus.facteurs.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <Link to={plus.cta.to} className="btn btn--primary expl3d__cta" onClick={onFermer}>
                {plus.cta.label}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
