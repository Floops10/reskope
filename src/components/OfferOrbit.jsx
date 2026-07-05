import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { instant } from '../lib/scrub';
import { useMediaQuery } from '../hooks/useMediaQuery';
import NetworkText from './NetworkText';

/* Glyphes réseau — variations minimales du langage nœuds/liens de la marque. */
function IconAudit() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.7" />
      <line x1="12.6" y1="12.6" x2="17" y2="17" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="8.5" cy="8.5" r="1.6" fill="currentColor" />
    </svg>
  );
}
function IconAuditPlus() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="5" cy="6" r="3" fill="currentColor" />
      <circle cx="15" cy="14" r="3" fill="currentColor" />
      <line x1="7.2" y1="8.1" x2="12.8" y2="11.9" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}
function IconBuild() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.2" fill="currentColor" />
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const r1 = 4.2, r2 = 7.6;
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={10 + Math.cos(rad) * r1} y1={10 + Math.sin(rad) * r1}
            x2={10 + Math.cos(rad) * r2} y2={10 + Math.sin(rad) * r2}
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
function IconLoop() {
  return (
    <svg viewBox="0 0 20 20" fill="none">
      <path d="M4 10a6 6 0 0 1 10.2-4.3M16 10a6 6 0 0 1-10.2 4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M14.4 3.8 14.2 5.7 12.3 5.5M5.6 16.2 5.8 14.3 7.7 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
const ICONS = [IconAudit, IconAuditPlus, IconBuild, IconLoop];

/* Relations offre -> offres apparentées, par index (progression naturelle). */
const RELATIONS = [[1], [0, 2, 3], [1, 3], [1, 2]];

export default function OfferOrbit({ offers, badge, pricingLabel }) {
  const isDesktop = useMediaQuery('(min-width: 881px)');
  const reduced = instant();
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const angleRef = useRef(0);
  const [, forceTick] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const nodeCount = offers.length;

  /* Rotation continue (rAF), en pause dès qu'une offre est ouverte ou en reduced-motion */
  useEffect(() => {
    if (!isDesktop || reduced) return;
    const loop = () => {
      if (activeId === null) {
        angleRef.current = (angleRef.current + 0.12) % 360;
        forceTick((n) => (n + 1) % 1000000);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isDesktop, reduced, activeId]);

  /* Au clic, on recentre le nœud actif en haut de l'orbite (angle fixe) :
     sans ça, la carte de détail hérite de la position courante du nœud —
     qui tourne en continu — et peut s'ouvrir coupée par overflow:hidden
     si le nœud est passé dans la moitié basse du cercle. */
  const toggle = (id) => {
    setActiveId((cur) => {
      const next = cur === id ? null : id;
      if (next !== null) {
        const idx = offers.findIndex((o) => o.id === id);
        angleRef.current = (270 - (idx / nodeCount) * 360 + 360) % 360;
        forceTick((n) => (n + 1) % 1000000);
      }
      return next;
    });
  };

  const relatedOf = (id) => (RELATIONS[id] || []).map((i) => offers[i]?.id).filter(Boolean);
  const isRelated = (id) => activeId !== null && relatedOf(activeId).includes(id);

  /* Positions orbitales (desktop) */
  const radius = 190;
  const positions = offers.map((_, i) => {
    const angle = ((i / nodeCount) * 360 + angleRef.current) % 360;
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * radius,
      y: Math.sin(rad) * radius,
      angle,
    };
  });

  const activeIndex = offers.findIndex((o) => o.id === activeId);

  if (!isDesktop) {
    /* Mobile : liste verticale de nœuds, tap pour développer inline */
    return (
      <div className="offer-orbit offer-orbit--stack" data-cursor-dark>
        {offers.map((o, i) => {
          const Icon = ICONS[i % ICONS.length];
          const open = activeId === o.id;
          return (
            <div key={o.id} className={`offer-orbit__stack-item${open ? ' is-open' : ''}`}>
              <button
                type="button"
                className="offer-orbit__stack-head"
                onClick={() => toggle(o.id)}
                aria-expanded={open}
              >
                <span className="offer-orbit__node-icon"><Icon /></span>
                <span className="offer-orbit__stack-name">
                  {o.name}
                  {o.featured && <span className="offer-orbit__badge">{badge}</span>}
                </span>
                <span className="offer-orbit__stack-toggle" aria-hidden="true">{open ? '×' : '+'}</span>
              </button>
              {open && (
                <div className="offer-orbit__stack-body">
                  <p>{o.detail}</p>
                  <p className="offer-orbit__factors-label">{pricingLabel}</p>
                  <ul className="offer-orbit__factors">
                    {o.pricingFactors.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  <Link to="/contact" className="btn btn--primary" data-cursor-label={o.cta}>
                    {o.cta}
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`offer-orbit${activeId !== null ? ' is-active' : ''}`} ref={containerRef} data-cursor-dark>
      <div className="offer-orbit__stage">
        {/* Anneau d'orbite — trace le chemin, ancre visuellement les nœuds */}
        <span className="offer-orbit__ring" aria-hidden="true" />

        {/* Hub central */}
        <div className="offer-orbit__hub">
          <span className="offer-orbit__hub-ping" />
          <span className="offer-orbit__hub-ping offer-orbit__hub-ping--2" />
          <span className="offer-orbit__hub-dot" />
        </div>

        {/* Rayons hub -> nœuds, façon graphe réseau */}
        <svg className="offer-orbit__web" viewBox="-220 -220 440 440" aria-hidden="true">
          {positions.map((p, i) => (
            <line
              key={i}
              x1="0" y1="0" x2={p.x} y2={p.y}
              className={`offer-orbit__spoke${activeIndex === i ? ' is-active' : ''}${isRelated(offers[i].id) ? ' is-related' : ''}`}
            />
          ))}
        </svg>

        {/* Nœuds orbitaux */}
        {offers.map((o, i) => {
          const Icon = ICONS[i % ICONS.length];
          const p = positions[i];
          const open = activeId === o.id;
          const related = isRelated(o.id);
          return (
            <div
              key={o.id}
              className={`offer-orbit__node${open ? ' is-open' : ''}${related ? ' is-related' : ''}`}
              style={{ transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px)` }}
              onClick={() => toggle(o.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggle(o.id)}
              aria-expanded={open}
            >
              <span className="offer-orbit__node-icon"><Icon /></span>
              <span className="offer-orbit__node-label">
                <NetworkText as="span" text={o.name} radius={70} />
                {o.featured && <span className="offer-orbit__badge">{badge}</span>}
              </span>

              {open && (
                <div className="offer-orbit__card" onClick={(e) => e.stopPropagation()}>
                  <p className="offer-orbit__card-tagline">{o.tagline}</p>
                  <p className="offer-orbit__card-detail">{o.detail}</p>
                  <p className="offer-orbit__factors-label">{pricingLabel}</p>
                  <ul className="offer-orbit__factors">
                    {o.pricingFactors.map((f) => <li key={f}>{f}</li>)}
                  </ul>
                  {relatedOf(o.id).length > 0 && (
                    <div className="offer-orbit__related">
                      {relatedOf(o.id).map((rid) => {
                        const r = offers.find((x) => x.id === rid);
                        return (
                          <button
                            key={rid}
                            type="button"
                            className="offer-orbit__related-btn"
                            onClick={() => toggle(rid)}
                          >
                            {r?.name} →
                          </button>
                        );
                      })}
                    </div>
                  )}
                  <Link to="/contact" className="btn btn--primary" data-cursor-label={o.cta}>
                    {o.cta}
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
