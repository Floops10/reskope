import { useEffect, useRef, useState } from 'react';
import { MOTION } from '../data/motion';
import AxoScene from './AxoScene';

/* ════════════════════════════════════════════════════════════
   UN ÉCRAN RÉSERVÉ AU MOTION DESIGN.

   La place est prise dès maintenant, au bon format : quand la vidéo
   HyperFrames arrivera, rien ne bougera dans la page (pas de saut de mise
   en page, pas de section à reprendre). En attendant, l'écran montre
   l'affiche : la scène de la mission projetée en axonométrie, qui est déjà
   une explication en soi.

   La vidéo n'est demandée qu'à l'approche, ne joue que visible, et ne joue
   jamais toute seule si le visiteur a demandé moins d'animations.
   ════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL;

export default function MotionSlot({ id, className = '' }) {
  const m = MOTION[id];
  const cadre = useRef(null);
  const video = useRef(null);
  const [proche, setProche] = useState(false);
  const [lecture, setLecture] = useState(false);
  const [reduit] = useState(() => typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* Proche : on pose les sources. Visible : on lit. Hors champ : on arrête. */
  useEffect(() => {
    if (!m || !m.pret) return undefined;
    const el = cadre.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setProche(true); return undefined; }
    const approche = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setProche(true); approche.disconnect(); }
    }, { rootMargin: '600px 0px' });
    const vue = new IntersectionObserver(([e]) => {
      const v = video.current;
      if (!v) return;
      if (e.isIntersecting && !reduit) v.play().then(() => setLecture(true)).catch(() => {});
      else { v.pause(); setLecture(false); }
    }, { threshold: 0.35 });
    approche.observe(el);
    vue.observe(el);
    return () => { approche.disconnect(); vue.disconnect(); };
  }, [m, reduit]);

  if (!m) return null;

  const style = { '--mslot-ratio': m.ratio, '--mslot-ratio-m': m.ratioMobile || m.ratio };

  return (
    <figure className={`mslot ${className}`} style={style} data-motion-slot={id}>
      <div className="mslot__cadre" ref={cadre}>
        {m.pret ? (
          <>
            <video
              ref={video}
              className="mslot__video"
              muted
              loop
              playsInline
              preload="none"
              aria-label={m.titre}
            >
              {proche && <source src={`${BASE}motion/${id}.webm`} type="video/webm" />}
              {proche && <source src={`${BASE}motion/${id}.mp4`} type="video/mp4" />}
            </video>
            {reduit && !lecture && (
              <button
                type="button"
                className="mslot__lire"
                onClick={() => video.current?.play().then(() => setLecture(true)).catch(() => {})}
              >
                Lire la vidéo
              </button>
            )}
          </>
        ) : (
          <AxoScene
            nom={m.affiche.scene}
            etape={m.affiche.etape}
            className="mslot__affiche"
            titre={m.titre}
          />
        )}
        {import.meta.env.DEV && !m.pret && (
          <span className="mslot__dev" aria-hidden="true">
            Motion · {id} · {m.ratio} · {m.duree}
          </span>
        )}
      </div>
    </figure>
  );
}
