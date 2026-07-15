import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { LogoMark } from './Logo';
import { lockScroll } from '../lib/smoothScroll';
import { GLYPH_SHAPES } from '../lib/net3d';
import Net3D from './Net3D';
import SwapLabel from './SwapLabel';
import { useT, useLang, LangToggle } from '../i18n';
import { CONTACT } from '../data/site';

/* NAV — header minimal + MENU refait (exigence premium).
   Ouverture en couches : le voile s'assombrit, une lame indigo glisse,
   le panneau crème la suit avec un léger retard (profondeur), puis les
   liens — GRANDS, numérotés — montent un à un derrière leurs masques,
   le pied arrive en dernier, un objet réseau 3D flotte en décor.
   Fermeture : la même chorégraphie, rejouée à l'envers, accélérée.
   Survol d'un lien : la ligne s'indente, le numéro s'allume, la flèche
   arrive, un nœud-réseau pulse. Mobile : panneau plein écran, même soin. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { pathname } = useLocation();
  const { lang } = useLang();
  const t = useT();
  const tabs = Object.entries(t.nav.tabs);

  const menuRef = useRef(null);
  const backdropRef = useRef(null);
  const layerRef = useRef(null);
  const panelRef = useRef(null);
  const menuTl = useRef(null);

  /* Nav qui se masque au défilement vers le bas, réapparaît vers le haut.
     Durci pour mobile : y clampé à 0 (rebond iOS), seuil de 6px (évite le
     clignotement pendant l'inertie), toujours visible près du haut. */
  useEffect(() => {
    let last = Math.max(0, window.scrollY);
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      setScrolled(y > 24);
      const delta = y - last;
      if (y < 90) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  /* Contraste : le header passe en clair quand une section sombre
     ([data-nav-dark]) est SOUS la barre. Calcul en pixels (hauteur réelle du
     header), recalculé au scroll : déterministe sur mobile, là où une bande
     en % du viewport laissait le logo invisible dans la zone frontière.
     Un MutationObserver re-collecte quand les pages lazy montent. */
  useEffect(() => {
    let els = [];
    let raf = 0;
    const check = () => {
      raf = 0;
      const d = els.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 80 && r.bottom >= 24;
      });
      setDark((p) => (p === d ? p : d));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check); };
    const collect = () => {
      els = [...document.querySelectorAll('[data-nav-dark]')];
      schedule();
    };
    collect();
    const mo = new MutationObserver(collect);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    lockScroll(open);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Chorégraphie d'ouverture (fermeture = reverse accéléré) */
  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = menuRef.current.querySelectorAll('.menu2__row');
    const head = menuRef.current.querySelector('.menu2__head');
    const foot = menuRef.current.querySelector('.menu2__foot');
    const decor = menuRef.current.querySelector('.menu2__decor');

    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } });
    tl.set(menuRef.current, { visibility: 'visible' }, 0);
    if (reduce) {
      tl.set([layerRef.current, panelRef.current], { xPercent: 0 }, 0)
        .fromTo(menuRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0);
    } else {
      tl.fromTo(backdropRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .fromTo(layerRef.current, { xPercent: 101 }, { xPercent: 0, duration: 0.6, ease: 'power4.inOut' }, 0)
        .fromTo(panelRef.current, { xPercent: 103 }, { xPercent: 0, duration: 0.72, ease: 'power4.inOut' }, 0.1)
        .fromTo(head, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.44)
        .fromTo(rows, { yPercent: 130 }, { yPercent: 0, duration: 0.75, stagger: 0.06 }, 0.42)
        .fromTo(foot, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.68)
        .fromTo(decor, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 0.55, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.6);
    }
    menuTl.current = tl;
  }, { scope: menuRef, dependencies: [lang] });

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (open) tl.timeScale(1).play();
    else tl.timeScale(1.5).reverse();
  }, [open]);

  return (
    <>
      <nav
        className={`nav${scrolled || open ? ' is-scrolled' : ''}${open ? ' is-open' : ''}${hidden && !open ? ' is-hidden' : ''}${dark && !open ? ' nav--dark' : ''}`}
        aria-label="Navigation principale"
      >
        <div className="container nav__inner">
          <Link to="/" className="wordmark" aria-label="Reskope, accueil">
            <LogoMark className="wordmark__mark" />
            <span className="wordmark__text">Reskope</span>
          </Link>

          <div className="nav__actions">
            <LangToggle className="nav__lang" />
            <Link to="/contact" className="btn btn--primary nav__cta">
              <SwapLabel>{t.nav.cta}</SwapLabel>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className={`nav__menu-btn${open ? ' is-open' : ''}`}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`burger${open ? ' is-open' : ''}`}>
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Pastille compacte : quand le header se détache au scroll, seul le
          menu reste, en verre flouté en haut à droite */}
      <button
        type="button"
        className={`nav-pill${hidden && !open ? ' is-on' : ''}${dark ? ' nav-pill--dark' : ''}`}
        aria-label="Ouvrir le menu"
        tabIndex={hidden && !open ? 0 : -1}
        onClick={() => setOpen(true)}
      >
        <span className="burger">
          <i />
          <i />
        </span>
      </button>

      <div className={`menu2${open ? ' is-open' : ''}`} ref={menuRef}>
        <div
          className="menu2__backdrop"
          aria-hidden="true"
          ref={backdropRef}
          onClick={() => setOpen(false)}
        />
        <div className="menu2__layer" aria-hidden="true" ref={layerRef} />
        <div className="menu2__panel" ref={panelRef} aria-hidden={!open}>

          <p className="menu2__head">{t.nav.menuEyebrow}</p>

          <nav className="menu2__links" aria-label="Pages">
            {tabs.map(([to, label], i) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `menu2__link${isActive ? ' is-current' : ''}`}
              >
                <span className="menu2__mask">
                  <span className="menu2__row">
                    <span className="menu2__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="menu2__node" aria-hidden="true" />
                    <span className="menu2__label">{label}</span>
                    <span className="menu2__arrow" aria-hidden="true">→</span>
                  </span>
                </span>
              </NavLink>
            ))}
          </nav>

          <div className="menu2__foot">
            <div className="menu2__contact">
              <a href={`mailto:${CONTACT.email}`} className="menu2__contact-link">{CONTACT.email}</a>
            </div>
            <div className="menu2__foot-actions">
              <Link to="/contact" className="btn btn--primary">
                <SwapLabel>{t.nav.cta}</SwapLabel>
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
              <LangToggle className="menu2__lang" />
            </div>
          </div>

          <div className="menu2__decor" aria-hidden="true">
            <Net3D shape={GLYPH_SHAPES[2]} size={150} speed={0.6} tiltX={0.4} nodeR={3} />
          </div>
        </div>
      </div>
    </>
  );
}
