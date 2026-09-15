import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant, mouvementRefuse } from '../lib/scrub';
import { projeter, VIEWBOX } from '../lib/figures';

/* ============================================================
   SELON LA TAILLE — une série qui monte, pas trois cartes.

   C'était un encadré arrondi, avec une bordure, une pastille pleine
   portant l'effectif, un titre, une ligne colorée, un paragraphe, un filet
   de séparation et une liste à puces. Sept signaux de gabarit pour dire
   une chose simple : plus vous êtes nombreux, plus le sol se peuple.

   Alors le sol se peuple : deux blocs, six, onze. Le reste est du texte,
   sans cadre, sans puce et sans filet. Et les volumes tournent au survol,
   comme partout ailleurs sur le site.
   ============================================================ */

const VITESSE = 1 / 8;

export function VolumeTournant({ nom }) {
  const [survol, setSurvol] = useState(false);
  const [theta, setTheta] = useState(0);
  const tour = useRef({ t: 0, raf: 0, dernier: 0 });

  useEffect(() => {
    const e = tour.current;
    if (mouvementRefuse()) return undefined;
    if (!survol && e.t % (Math.PI * 2) === 0) return undefined;
    e.dernier = 0;
    const cible = survol ? Infinity : Math.ceil(e.t / (Math.PI * 2)) * Math.PI * 2;
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
  }, [survol]);

  const { sol, volumes, reperes } = projeter(nom, theta);
  const entrer = useCallback(() => setSurvol(true), []);
  const sortir = useCallback(() => setSurvol(false), []);

  return (
    <span
      className="plr__dessin"
      onPointerEnter={entrer}
      onPointerLeave={sortir}
      onFocus={entrer}
      onBlur={sortir}
      tabIndex={0}
    >
      <svg className="axo" viewBox={VIEWBOX} aria-hidden="true">
        <g className="axo__sol">
          {sol.lignes.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />)}
          <polygon className="axo__cadre" points={sol.cadre} />
        </g>
        {volumes.map((v, i) => (
          <g className="axo__v" key={i}>
            {v.faces && v.faces.map((f, k) => <polygon key={k} className={f.cls} points={f.d} />)}
          </g>
        ))}
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
    </span>
  );
}

export default function Paliers({ tiers }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const el = racine.current;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 80%' } });
    el.querySelectorAll('.plr__item').forEach((it, i) => {
      tl.from(it.querySelectorAll('.axo__sol line, .axo__cadre'), {
        opacity: 0, duration: 0.4, ease: 'none', stagger: 0.012,
      }, i * 0.14)
        .from(it.querySelectorAll('.axo__v'), {
          y: 4.5, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.6)', stagger: 0.05,
        }, i * 0.14 + 0.12)
        .from(it.querySelectorAll('.plr__t'), {
          yPercent: 112, duration: 0.65, ease: 'power4.out',
        }, i * 0.14 + 0.22)
        .from(it.querySelectorAll('.plr__d, .plr__ex'), {
          y: 14, autoAlpha: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06,
        }, i * 0.14 + 0.34);
    });
  }, { scope: racine });

  return (
    <div className="plr" ref={racine}>
      {tiers.map((t, i) => (
        <div className="plr__item" key={t.range}>
          <VolumeTournant nom={`palier${i + 1}`} />
          <p className="plr__taille">{t.range}</p>
          <p className="plr__mask"><span className="plr__t">{t.principle}</span></p>
          <p className="plr__d">{t.detail}</p>
          {t.wins && t.wins.length > 0 && (
            <p className="plr__ex">
              {t.wins.map((w, k) => (k === 0 ? w : w.charAt(0).toLowerCase() + w.slice(1))).join(', ')}.
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
