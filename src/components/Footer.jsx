import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { buildR3D } from '../lib/net3d';
import Net3D from './Net3D';
import SwapLabel from './SwapLabel';
import BusinessCard from './BusinessCard';
import { useT, useLang } from '../i18n';
import { CONTACT } from '../data/site';

/* FOOTER — L'UNIVERS de clôture (plein écran).
   On termine EN IMMERSION dans le réseau de la marque : une poussière
   d'étoiles-nœuds en profondeur (3 couches de parallaxe), des halos, le R
   en vrai 3D qui tourne, la déclaration + CTA révélés ligne à ligne, les
   colonnes sobres, puis le wordmark « Reskope » GÉANT en police réseau,
   révélé par balayage. Rang légal complet (mentions, confidentialité, CGU). */

const DUST = Array.from({ length: 34 }, (_, i) => {
  const r = (s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };
  return {
    x: 2 + r(1) * 96,
    y: 3 + r(2) * 92,
    s: 2 + r(3) * 3.6,
    o: 0.14 + r(4) * 0.5,
    layer: i % 3,                       // 3 profondeurs de parallaxe
    dur: 2.6 + r(5) * 3.4,
    delay: r(6) * 4,
  };
});

export default function Footer() {
  const [cardOpen, setCardOpen] = useState(false);
  const rootRef = useRef(null);
  const stRef = useRef(null);
  const wordRef = useRef(null);
  const t = useT();
  const { lang } = useLang();
  const f = t.footer;
  const tabs = t.nav.tabs;
  const rShape = buildR3D(14, 0.6);
  // Clôture courte et directe : pas de paragraphe qui alourdit la scène
  const statement = lang === 'fr' ? 'Parlons de vos outils.' : 'Let’s talk about your tools.';

  useGSAP(() => {
    if (instant()) return;

    /* Déclaration : lignes masquées */
    let split = null;
    try {
      split = new SplitText(stRef.current, { type: 'lines', mask: 'lines', linesClass: 'footer2__stline' });
    } catch { split = null; }
    if (split) {
      gsap.from(split.lines, {
        yPercent: 115, duration: 0.9, ease: 'power4.out', stagger: 0.09,
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
      });
    }

    /* Colonnes : cascade discrète */
    gsap.from(rootRef.current.querySelectorAll('.footer2__col'), {
      y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: rootRef.current.querySelector('.footer2__grid'), start: 'top 88%' },
    });

    /* Wordmark géant : balayage de révélation + lettres qui montent */
    const word = wordRef.current;
    gsap.fromTo(word,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power4.inOut',
        scrollTrigger: { trigger: word, start: 'top 96%' },
      });
    gsap.from(word, {
      yPercent: 24, duration: 1.4, ease: 'power4.out',
      scrollTrigger: { trigger: word, start: 'top 96%' },
    });

    /* Parallaxe des couches de poussière : l'univers a de la profondeur */
    [0, 1, 2].forEach((layer) => {
      gsap.fromTo(rootRef.current.querySelectorAll(`.footer2__dust--${layer}`),
        { yPercent: -30 - layer * 22 },
        {
          yPercent: 10 + layer * 8, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        });
    });

    return () => split?.revert();
  }, { scope: rootRef });

  return (
    <footer className="footer2 footer2--universe" ref={rootRef} data-cursor-dark data-nav-dark>
      {/* L'univers : poussière d'étoiles-nœuds en 3 profondeurs + halos */}
      <div className="footer2__cosmos" aria-hidden="true">
        {DUST.map((d, i) => (
          <span
            key={i}
            className={`footer2__dust footer2__dust--${d.layer}`}
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: `${d.s}px`,
              height: `${d.s}px`,
              opacity: d.o,
              animationDuration: `${d.dur}s`,
              animationDelay: `${d.delay}s`,
            }}
          />
        ))}
      </div>

      <Net3D shape={rShape} size={190} speed={0.45} tiltX={0.3} nodeR={4.2} className="footer2__net" />

      <div className="container footer2__top">
        <p className="footer2__statement" ref={stRef}>{statement}</p>
        <Link to="/contact" className="btn btn--on-dark footer2__cta" data-cursor-label={f.cta}>
          <SwapLabel>{f.cta}</SwapLabel>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="container footer2__grid">
        <nav className="footer2__col" aria-label={f.site}>
          <span className="footer2__heading">{f.site}</span>
          <Link to="/">{f.home}</Link>
          <Link to="/pourquoi">{tabs['/pourquoi']}</Link>
          <Link to="/methode">{tabs['/methode']}</Link>
          <Link to="/offres">{tabs['/offres']}</Link>
        </nav>

        <nav className="footer2__col" aria-label={f.resources}>
          <span className="footer2__heading">{f.resources}</span>
          <Link to="/exemple">{tabs['/exemple']}</Link>
          <Link to="/numerique-responsable">{tabs['/numerique-responsable']}</Link>
          <Link to="/a-propos">{tabs['/a-propos']}</Link>
          <Link to="/contact">{f.talk}</Link>
        </nav>

        <div className="footer2__col">
          <span className="footer2__heading">{f.contact}</span>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <Link to="/contact">{f.talk}</Link>
          <button type="button" className="footer2__card-btn" onClick={() => setCardOpen(true)}>
            {f.card} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Générique de fin : le wordmark en police réseau */}
      <div className="footer2__word-wrap" aria-hidden="true">
        <span className="footer2__word" ref={wordRef}>Reskope</span>
      </div>

      <div className="container footer2__legal">
        <nav className="footer2__legal-links" aria-label={f.mentions}>
          <Link to="/mentions-legales">{f.mentions}</Link>
          <Link to="/confidentialite">{f.privacy}</Link>
          <Link to="/cgu">{f.terms}</Link>
          <Link to="/cgv">{f.sales}</Link>
        </nav>
        <p>© {new Date().getFullYear()} Reskope · {f.rights}</p>
      </div>

      {cardOpen && <BusinessCard onClose={() => setCardOpen(false)} />}
    </footer>
  );
}
