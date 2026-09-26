import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { LogoMark } from './Logo';
import { lockScroll } from '../lib/smoothScroll';
import { GLYPH_SHAPES } from '../lib/net3d';
import Net3D from './Net3D';
import SwapLabel from './SwapLabel';
import { PORTES_CREATION } from '../data/offres';
import { fiche } from '../data/seo';
import { ESPACES, adresseEspace } from '../data/espaces';
import Espaces from './Espaces';
import { openCalModal, isCalConfigured } from '../lib/cal';

/* NAV — un en-tête minimal, et un menu qui commence par le visiteur.

   Le menu ne s'ouvre plus sur une liste de pages : il s'ouvre sur les trois
   situations qui amènent un dirigeant chez nous, dans ses mots, et chacune
   mène à la page qui lui répond. Les pages du site viennent ensuite, plus
   petites. Quelqu'un qui ne sait pas encore ce qu'il cherche se reconnaît
   dans une phrase ; il ne se reconnaît pas dans « Nos offres ».

   La chorégraphie reste celle de la marque : le voile s'assombrit, une lame
   indigo glisse, le panneau crème la suit avec un léger retard, puis les
   lignes montent une à une derrière leurs masques. Fermeture : la même,
   rejouée à l'envers et accélérée. */

const PAGES = [
  { to: '/nos-offres', label: 'Nos offres' },
  { to: '/comment-ca-se-passe', label: 'Comment ça se passe' },
  { to: '/exemple', label: 'Un exemple complet' },
  { to: '/qui-on-est', label: 'Qui on est' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { pathname } = useLocation();
  /* L'espace de la page : l'aiguillage n'en a pas, les pages communes
     (contact, qui on est...) non plus. */
  const route = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  const espace = fiche(route)?.espace || null;
  const aiguillage = route === '/';

  /* Deux intentions, deux boutons : écrire mène au formulaire, réserver
     ouvre l'agenda. Si Cal.com n'est pas joignable, on bascule sur le
     formulaire plutôt que de laisser un bouton muet. */
  const book = (e) => {
    e.preventDefault();
    setOpen(false);
    openCalModal().catch(() => {
      window.location.href = `${import.meta.env.BASE_URL}contact`;
    });
  };

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

  /* Changer de page referme le menu. L'ajustement se fait pendant le rendu,
     pas dans un effet : on évite un rendu de plus avec le menu encore ouvert. */
  const [adresse, setAdresse] = useState(pathname);
  if (adresse !== pathname) {
    setAdresse(pathname);
    setOpen(false);
  }

  /* Contraste : le header passe en clair quand une section sombre
     ([data-nav-dark]) est sous la barre. Calcul en pixels, recalculé au
     défilement ; un MutationObserver re-collecte quand les pages montent. */
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

  /* Chorégraphie d'ouverture (fermeture = reverse accéléré). */
  useGSAP(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = menuRef.current.querySelectorAll('.menu2__row');
    const voix = menuRef.current.querySelectorAll('.menu2__voix');
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
        .fromTo(rows, { yPercent: 130 }, { yPercent: 0, duration: 0.75, stagger: 0.05 }, 0.42)
        .fromTo(voix, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.5)
        .fromTo(foot, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.55 }, 0.72)
        .fromTo(decor, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 0.55, scale: 1, duration: 0.7, ease: 'power2.out' }, 0.6);
    }
    menuTl.current = tl;
  }, { scope: menuRef });

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
          <div className="nav__marque">
            <Link to={espace === 'creation' ? '/creation' : '/'} className="wordmark" aria-label="Reskope, accueil">
              <LogoMark className="wordmark__mark" />
              <span className="wordmark__text">Reskope</span>
            </Link>
            {/* Les trois espaces, toujours visibles : on sait où l'on est, et
                on change en un geste. Sur l'aiguillage, la question suffit. */}
            {!aiguillage && <Espaces actif={espace} className="nav__espaces" />}
          </div>

          <div className="nav__actions">
            <div className="nav__ctas">
              <Link to="/contact" className="nav__cta nav__cta--ghost">
                <SwapLabel>Nous écrire</SwapLabel>
              </Link>
              {isCalConfigured && (
                <button type="button" className="nav__cta nav__cta--solid" onClick={book}>
                  <SwapLabel>Réserver 30 min</SwapLabel>
                  <span className="nav__cta-arrow" aria-hidden="true">→</span>
                </button>
              )}
            </div>
            <button
              type="button"
              className={`nav__menu-btn${open ? ' is-open' : ''}`}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              aria-controls="menu-principal"
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

      {/* Pastille compacte : quand le header se détache au défilement, seul
          le menu reste, en verre flouté en haut à droite. */}
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

      <div className={`menu2${open ? ' is-open' : ''}`} ref={menuRef} id="menu-principal">
        <div
          className="menu2__backdrop"
          aria-hidden="true"
          ref={backdropRef}
          onClick={() => setOpen(false)}
        />
        <div className="menu2__layer" aria-hidden="true" ref={layerRef} />
        <div className="menu2__panel" ref={panelRef} aria-hidden={!open}>

          {/* Les trois situations d'abord : chacune dit, dans les mots du
              dirigeant, ce qui l'amène. */}
          <nav className="menu2__links menu2__links--portes" aria-label="Vous créez ou reprenez une entreprise">
            {PORTES_CREATION.map((p) => (
              <NavLink
                key={p.id}
                to={p.slug}
                className={({ isActive }) => `menu2__link menu2__porte${isActive ? ' is-current' : ''}`}
              >
                <span className="menu2__mask">
                  <span className="menu2__row">
                    <span className="menu2__node" aria-hidden="true" />
                    <span className="menu2__label">{p.court}</span>
                    <span className="menu2__arrow" aria-hidden="true">→</span>
                  </span>
                </span>
                <span className="menu2__voix">« {p.amorce} »</span>
              </NavLink>
            ))}
          </nav>

          <nav className="menu2__links menu2__links--pages" aria-label="Pages">
            {PAGES.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `menu2__link menu2__page${isActive ? ' is-current' : ''}`}
              >
                <span className="menu2__mask">
                  <span className="menu2__row">
                    <span className="menu2__label">{l.label}</span>
                  </span>
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Les deux autres espaces, pour qui dirige déjà une entreprise. */}
          <nav className="menu2__entreprises" aria-label="Vous dirigez une entreprise">
            {ESPACES.filter((e) => e.id !== 'creation').map((e) => (
              <a key={e.id} href={adresseEspace(e.id)} className={`menu2__espace esp--${e.accent}`}>
                <i className="esp__point" aria-hidden="true" />
                <span className="menu2__espace-t">{e.court}</span>
                <span className="menu2__espace-d">{e.taille}</span>
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </nav>

          <div className="menu2__foot">
            <div className="menu2__foot-actions">
              <Link to="/contact" className="btn btn--ghost">
                <SwapLabel>Nous écrire</SwapLabel>
              </Link>
              {isCalConfigured && (
                <button type="button" className="btn btn--primary" onClick={book}>
                  <SwapLabel>Réserver 30 min</SwapLabel>
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </button>
              )}
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
