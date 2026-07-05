import { useState } from 'react';
import { Link } from 'react-router-dom';
import Stagger from './Stagger';

/* OFFRES — grille de cartes COMPARABLES (sobre & net, pensée pour un
   acheteur qui compare avant de choisir). Les 4 offres alignées, l'offre
   « le plus choisi » discrètement mise en avant. Un clic déplie le détail
   + « ce qui influence le tarif » directement dans la carte (grid-rows,
   fluide). Micro-interactions au survol, entrée en cascade. Zéro prix. */
export default function OfferGrid({ offers, badge, pricingLabel, detailLabel, hideLabel }) {
  const [open, setOpen] = useState(null);

  return (
    <section className="section ofg-section">
      <div className="container">
        <Stagger className="ofg" sel=".ofg__card" y={48} start="top 84%">
          {offers.map((o, i) => {
            const isOpen = open === i;
            return (
              <article
                className={`ofg__card${o.featured ? ' is-featured' : ''}${isOpen ? ' is-open' : ''}`}
                key={o.id}
              >
                {o.featured && <span className="ofg__badge">{badge}</span>}

                <div className="ofg__head">
                  <h3 className="ofg__name">{o.name}</h3>
                  <p className="ofg__tagline">{o.tagline}</p>
                </div>

                <ul className="ofg__features">
                  {o.features.map((f, k) => (
                    <li key={k}><span className="ofg__dot" aria-hidden="true" />{f}</li>
                  ))}
                </ul>

                <div className="ofg__foot">
                  <Link
                    to="/contact"
                    className={`btn ${o.featured ? 'btn--primary' : 'btn--ghost'} ofg__cta`}
                    data-cursor-label={o.cta}
                  >
                    {o.cta}
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </Link>
                  <button
                    type="button"
                    className="ofg__toggle"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {isOpen ? hideLabel : detailLabel}
                    <span className="ofg__toggle-icon" aria-hidden="true" />
                  </button>
                </div>

                <div className="ofg__detail">
                  <div className="ofg__detail-inner">
                    <div className="ofg__detail-body">
                      <p className="ofg__detail-title">{o.detailTitle}</p>
                      <p className="ofg__detail-text">{o.detail}</p>
                      <p className="ofg__pricing-label">{pricingLabel}</p>
                      <ul className="ofg__pricing">
                        {o.pricingFactors.map((p, k) => <li key={k}>{p}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
