import { useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import Net3D from './Net3D';
import { GLYPH_SHAPES } from '../lib/net3d';
import { Reveal, RevealItem } from './Reveal';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { CONTACT, FORMULAIRE } from '../data/site';
import { openCalModal, CAL_FALLBACK_URL, isCalConfigured } from '../lib/cal';

/* PRENDRE RENDEZ-VOUS — la scène reste entièrement dans la DA Reskope ;
   Cal.com n'apparaît qu'en surcouche, au clic (voir src/lib/cal.js). */

export default function Booking({ c }) {
  const { lang } = useLang();
  const rootRef = useRef(null);
  const [state, setState] = useState('idle'); // idle | loading | ready | error

  useGSAP(() => {
    if (instant()) return;
    gsap.from(rootRef.current.querySelectorAll('.bk__reveal'), {
      y: 26, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: rootRef.current, start: 'top 74%' },
    });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: rootRef.current.querySelector('.bk__points'), start: 'top 88%' },
    });
    tl.from(rootRef.current.querySelectorAll('.bk__point-rule'), {
      scaleX: 0, transformOrigin: 'left center', duration: 0.7, ease: 'power3.inOut', stagger: 0.12,
    }, 0);
    tl.from(rootRef.current.querySelectorAll('.bk__point-value'), {
      yPercent: 115, duration: 0.7, ease: 'power4.out', stagger: 0.12,
    }, 0.18);
    tl.from(rootRef.current.querySelectorAll('.bk__point-label'), {
      autoAlpha: 0, y: 10, duration: 0.55, ease: 'power2.out', stagger: 0.12,
    }, 0.34);
  }, { scope: rootRef });

  const openCal = async () => {
    if (state === 'loading') return;
    setState('loading');
    try {
      await openCalModal();
      setState('ready');
    } catch {
      setState('error');
    }
  };

  return (
    <section className="bk" ref={rootRef} id="rendez-vous" data-cursor-dark data-nav-dark>
      <div className="bk__decor" aria-hidden="true">
        <Net3D shape={GLYPH_SHAPES[2]} size={280} speed={0.5} tiltX={0.4} nodeR={3} />
      </div>

      <div className="container bk__inner">
        <Reveal>
          <RevealItem as="p" className="eyebrow bk__eyebrow bk__reveal">{c.eyebrow}</RevealItem>
          <RevealItem as="h2" className="bk__title bk__reveal">{c.title}</RevealItem>
          <RevealItem as="p" className="bk__lead bk__reveal">{c.lead}</RevealItem>
        </Reveal>

        {/* Les trois faits du rendez-vous. Le filet de chaque colonne se
            trace de gauche à droite, puis la valeur monte derrière son
            masque : ils arrivent dans l'ordre, comme trois cotes qu'on
            poserait sur un plan. La pastille est partie, le filet suffit. */}
        <ul className="bk__points">
          {c.points.map((p) => (
            <li key={p.label}>
              <span className="bk__point-rule" aria-hidden="true" />
              <span className="bk__point-mask">
                <span className="bk__point-value">{p.value}</span>
              </span>
              <span className="bk__point-label">{p.label}</span>
            </li>
          ))}
        </ul>

        <div className="bk__actions bk__reveal">
          {/* Tant que le lien Cal.com n'est pas renseigné, le CTA renvoie vers
              le formulaire ci-dessus plutôt que d'ouvrir un agenda inexistant. */}
          {isCalConfigured ? (
            <button type="button" className="bk__cta" onClick={openCal} disabled={state === 'loading'}>
              <span className="bk__cta-glow" aria-hidden="true" />
              <span className="bk__cta-label">{state === 'loading' ? c.loading : c.cta}</span>
              <span className="bk__cta-arrow" aria-hidden="true">→</span>
            </button>
          ) : (
            <a className="bk__cta" href="#contact-form">
              <span className="bk__cta-glow" aria-hidden="true" />
              <span className="bk__cta-label">{c.ctaFallback}</span>
              <span className="bk__cta-arrow" aria-hidden="true">→</span>
            </a>
          )}

          <p className="bk__alt">
            {c.or}{' '}
            {CONTACT.ouverte ? (
              <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            ) : (
              <Link className="link" to="/contact">{FORMULAIRE[lang] || FORMULAIRE.fr}</Link>
            )}
          </p>
        </div>

        {state === 'error' && (
          <p className="bk__error" role="alert">
            {c.error} <a className="link" href={CAL_FALLBACK_URL} target="_blank" rel="noopener noreferrer">cal.com</a>.
          </p>
        )}

        <p className="bk__privacy bk__reveal">{c.privacy}</p>
      </div>
    </section>
  );
}
