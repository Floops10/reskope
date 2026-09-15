import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant, mouvementRefuse } from '../lib/scrub';
import { projeter, VIEWBOX } from '../lib/figures';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { FAIT } from '../data/profils';

/* ============================================================
   CE QU'ON FAIT — la planche.

   Le visiteur arrivait sur une accroche, puis huit écrans de traversée
   avant de savoir ce qu'on vend. Ce bloc est posé juste sous l'accroche :
   quatre choses, dites avec des verbes, et le détail laissé à la page des
   offres.

   Le dessin est celui des livrets, mais il n'est pas figé. Les volumes sont
   gardés en coordonnées de monde et projetés à chaque image : au survol, la
   scène fait un tour complet sur elle-même et le dessin se nomme en même
   temps, chaque étiquette suivant la pièce qu'elle désigne. Sur le papier
   on ne peut montrer qu'un angle ; ici on les montre tous.
   ============================================================ */

/* Vitesse du tour, en tours par seconde. Un tour en huit secondes : assez
   lent pour qu'on voie la forme, assez vif pour qu'on comprenne qu'elle
   tourne sans avoir à attendre. */
const VITESSE = 1 / 8;

function useAngle(actif) {
  const [theta, setTheta] = useState(0);
  const ref = useRef({ t: 0, raf: 0, dernier: 0, sens: 0 });

  useEffect(() => {
    const e = ref.current;
    if (mouvementRefuse()) return undefined;

    /* À la sortie du survol, on ne revient pas en arrière : on finit le
       tour jusqu'au prochain multiple de 360°. Un objet qui repart à
       reculons trahit l'animation ; un objet qui finit son tour, non. */
    e.sens = actif ? 1 : (e.t % (Math.PI * 2) === 0 ? 0 : 1);
    if (!e.sens) return undefined;

    e.dernier = 0;
    const cible = actif ? Infinity : Math.ceil(e.t / (Math.PI * 2)) * Math.PI * 2;

    const pas = (ms) => {
      if (!e.dernier) e.dernier = ms;
      const dt = Math.min((ms - e.dernier) / 1000, 0.05);
      e.dernier = ms;
      e.t = Math.min(e.t + dt * VITESSE * Math.PI * 2, cible);
      setTheta(e.t);
      if (e.t < cible) e.raf = requestAnimationFrame(pas);
      else { e.t %= Math.PI * 2; e.raf = 0; }
    };
    e.raf = requestAnimationFrame(pas);
    return () => { cancelAnimationFrame(e.raf); e.raf = 0; };
  }, [actif]);

  return theta;
}

function Figure({ nom, theta }) {
  const { sol, volumes, cote, reperes } = projeter(nom, theta);
  return (
    <svg className="axo" viewBox={VIEWBOX} aria-hidden="true">
      {/* La cote descend du haut du cadre jusqu'au sommet du volume : elle
          relie le nom à ce qu'il nomme, et elle suit la rotation. */}
      <line className="axo__cote" x1={cote.x} y1={cote.y1} x2={cote.x} y2={cote.y2} />

      <g className="axo__sol">
        {sol.lignes.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
        <polygon className="axo__cadre" points={sol.cadre} />
      </g>

      {volumes.map((v, i) => (
        <g className="axo__v" key={i}>
          {v.faces && v.faces.map((f, k) => <polygon key={k} className={f.cls} points={f.d} />)}
          {v.lignes && v.lignes.map((l, k) => (
            <line key={k} className="axo-f" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>
      ))}

      {/* Les repères : au survol, le dessin se nomme. Une amorce part de la
          pièce concernée et le mot se pose au bout. */}
      <g className="axo__reperes">
        {reperes.map((r, i) => (
          <g key={i}>
            <circle className="axo__rep-pt" cx={r.x1} cy={r.y1} r="0.45" />
            <line className="axo__rep-tige" x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
            <text className="axo__rep-mot" x={r.tx} y={r.ty} textAnchor={r.ancre}>{r.t}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function Item({ it }) {
  const [survol, setSurvol] = useState(false);
  const theta = useAngle(survol);
  const entrer = useCallback(() => setSurvol(true), []);
  const sortir = useCallback(() => setSurvol(false), []);

  return (
    <div
      className="fait__item"
      onPointerEnter={entrer}
      onPointerLeave={sortir}
      onFocus={entrer}
      onBlur={sortir}
      tabIndex={0}
    >
      <h3 className="fait__nom">{it.nom}</h3>
      <span className="fait__dessin"><Figure nom={it.figure} theta={theta} /></span>
      <p className="fait__quoi">{it.quoi}</p>
    </div>
  );
}

export default function CeQuOnFait() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = (FAIT[profil] || FAIT.pme)[lang] || (FAIT[profil] || FAIT.pme).fr;
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const el = racine.current;

    /* Une seule ligne de temps pour toute la planche : elle se monte dans
       l'ordre où on dessinerait le plan. Quatre timelines indépendantes
       déclenchées chacune de leur côté donnaient quatre petites entrées
       identiques, c'est exactement ce qui fait « gabarit ». */
    const tl = gsap.timeline({
      scrollTrigger: { trigger: el.querySelector('.fait__planche'), start: 'top 82%' },
    });

    tl.from(el.querySelectorAll('.fait__nom'), {
      yPercent: 110, duration: 0.7, ease: 'power4.out', stagger: 0.09,
    }, 0);

    tl.from(el.querySelectorAll('.axo__cote'), {
      scaleY: 0, transformOrigin: 'top center', duration: 0.5, ease: 'power2.out', stagger: 0.09,
    }, 0.2);

    el.querySelectorAll('.axo').forEach((svg, i) => {
      const lignes = svg.querySelectorAll('.axo__sol line, .axo__cadre');
      const vols = svg.querySelectorAll('.axo__v');
      /* Le sol d'abord, les volumes ensuite : un volume ne flotte pas, il
         se pose sur quelque chose. */
      tl.from(lignes, { opacity: 0, duration: 0.4, ease: 'none', stagger: 0.01 }, 0.3 + i * 0.09)
        .from(vols, {
          y: 4.5, autoAlpha: 0, duration: 0.62, ease: 'back.out(1.6)', stagger: 0.05,
        }, 0.42 + i * 0.09);
    });

    tl.from(el.querySelectorAll('.fait__quoi'), {
      y: 14, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07,
    }, 0.62);

    gsap.from(el.querySelectorAll('.fait__pied > *'), {
      y: 16, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: el.querySelector('.fait__pied'), start: 'top 92%' },
    });
  }, { scope: racine, dependencies: [lang, profil] });

  return (
    <section className="fait" ref={racine} aria-labelledby="fait-t">
      <div className="container">
        <p className="fait__sur">{c.sur}</p>
        <h2 className="fait__titre" id="fait-t">{c.titre}</h2>

        <div className="fait__planche">
          <div className="fait__rangee">
            {c.items.map((it) => <Item key={it.nom} it={it} />)}
          </div>
        </div>

        <div className="fait__pied">
          <p>{c.pied}</p>
          <Link className="btn btn--ghost" to="/offres">
            {c.act}
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
