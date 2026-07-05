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

/* FOOTER — scène de clôture (« fin de film »).
   Bloc indigo plein : déclaration + CTA (révélés ligne à ligne au scroll),
   colonnes de navigation sobres, le R de la marque en VRAI 3D qui tourne
   lentement, et en signature finale le wordmark « Reskope » GÉANT en police
   réseau, révélé par balayage — le générique de fin. */
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

    return () => split?.revert();
  }, { scope: rootRef });

  return (
    <footer className="footer2" ref={rootRef} data-cursor-dark>
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
          <a href="/reskope-logo.svg" download>{f.logo}</a>
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
        <p>© {new Date().getFullYear()} Reskope · {f.rights}</p>
      </div>

      {cardOpen && <BusinessCard onClose={() => setCardOpen(false)} />}
    </footer>
  );
}
