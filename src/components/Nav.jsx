import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogoMark } from './Logo';
import MenuNet from './MenuNet';
import { useT, useLang, LangToggle } from '../i18n';
import { CONTACT } from '../data/site';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const { pathname } = useLocation();
  const { lang } = useLang();
  const t = useT();
  const tabs = Object.entries(t.nav.tabs);
  const activeIndex = tabs.findIndex(([to]) => to === pathname);

  const linksRef = useRef(null);
  const spineRef = useRef(null);
  const routeRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* Positionne la dorsale réseau (spine) et le lien qui se trace au survol
     (route) du nœud de la page courante vers le nœud survolé. */
  useLayoutEffect(() => {
    const place = () => {
      const cont = linksRef.current;
      if (!cont) return;
      const nodes = [...cont.querySelectorAll('.navmenu__node')];
      if (!nodes.length) return;
      const base = cont.getBoundingClientRect();
      const cy = (el) => {
        const r = el.getBoundingClientRect();
        return r.top - base.top + r.height / 2;
      };
      const r0 = nodes[0].getBoundingClientRect();
      const cx = r0.left - base.left + r0.width / 2;
      const ys = nodes.map(cy);

      const spine = spineRef.current;
      if (spine) {
        spine.style.left = `${cx}px`;
        spine.style.top = `${ys[0]}px`;
        spine.style.height = `${ys[ys.length - 1] - ys[0]}px`;
      }
      const route = routeRef.current;
      if (!route) return;
      route.style.left = `${cx}px`;
      const aI = activeIndex >= 0 ? activeIndex : 0;
      if (hovered == null || hovered === aI) {
        route.style.top = `${ys[aI]}px`;
        route.style.height = '0px';
        route.style.opacity = '0';
        return;
      }
      const aY = ys[aI];
      const hY = ys[hovered];
      route.style.top = `${Math.min(aY, hY)}px`;
      route.style.height = `${Math.abs(hY - aY)}px`;
      route.style.opacity = '1';
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [hovered, activeIndex, open, lang, pathname]);

  return (
    <>
      <nav
        className={`nav${scrolled || open ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}
        aria-label="Navigation principale"
      >
        <div className="container nav__inner">
          <Link to="/" className="wordmark" aria-label="Reskope, accueil">
            <LogoMark className="wordmark__mark" />
            <span>Reskope</span>
          </Link>

          <div className="nav__actions">
            <LangToggle className="nav__lang" />
            <Link to="/contact" className="btn btn--primary nav__cta">
              {t.nav.cta}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className={`nav__menu-btn${open ? ' is-open' : ''}`}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="nav__menu-label">{open ? t.nav.close : t.nav.menu}</span>
              <span className={`burger${open ? ' is-open' : ''}`}>
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div className={`navmenu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <div className="navmenu__inner">
          <nav
            className="navmenu__links"
            ref={linksRef}
            aria-label="Pages"
            onMouseLeave={() => setHovered(null)}
          >
            <p className="navmenu__eyebrow">{t.nav.menuEyebrow}</p>
            <span className="navmenu__spine" aria-hidden="true" ref={spineRef} />
            <span className="navmenu__route" aria-hidden="true" ref={routeRef} />
            {tabs.map(([to, label], i) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `navmenu__link${isActive ? ' is-current' : ''}`}
                style={{ '--i': i }}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(null)}
              >
                <span className="navmenu__node" aria-hidden="true" />
                <span className="navmenu__text">{label}</span>
              </NavLink>
            ))}
          </nav>

          <aside className="navmenu__aside" style={{ '--i': tabs.length }}>
            <MenuNet open={open} />
            <p className="navmenu__eyebrow">{t.nav.asideEyebrow}</p>
            <p className="navmenu__title">{t.nav.asideTitle}</p>
            <div className="navmenu__contact">
              <a href={`mailto:${CONTACT.email}`} className="navmenu__contact-link">
                {CONTACT.email}
              </a>
              <a href="tel:+33620235522" className="navmenu__contact-link">
                +33 6 20 23 55 22
              </a>
            </div>
            <div className="navmenu__foot">
              <Link to="/contact" className="btn btn--primary navmenu__cta">
                {t.nav.cta}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
              <LangToggle className="navmenu__lang" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
