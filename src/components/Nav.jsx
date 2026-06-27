import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LogoMark } from './Logo';
import MenuNet from './MenuNet';
import { useT, LangToggle } from '../i18n';
import { CONTACT } from '../data/site';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const t = useT();
  const tabs = Object.entries(t.nav.tabs);

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
          <nav className="navmenu__links" aria-label="Pages">
            <p className="navmenu__eyebrow">{t.nav.menuEyebrow}</p>
            {tabs.map(([to, label], i) => (
              <NavLink key={to} to={to} className="navmenu__link" style={{ '--i': i }}>
                <span className="navmenu__num">{`0${i + 1}`}</span>
                <span className="navmenu__text">{label}</span>
                <span className="navmenu__arrow" aria-hidden="true">→</span>
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
