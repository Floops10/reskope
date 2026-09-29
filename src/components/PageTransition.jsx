import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '../lib/gsap';
import { useLang } from '../i18n';
import { R_NODES, R_LINKS, R_SCATTER, linkD } from './Logo';
import { MARQUES, poserMarque } from '../data/marques';
import { marqueDeLAdresse as marqueDeDestination } from '../lib/marqueRoute';

/* Une phrase par destination, tirée au hasard : le temps de chargement
   devient un micro-moment de marque (promesse, chiffre, ou invitation).
   Ici, celles de l'accueil et de Reskope Create, reprises de leurs pages. */
const PHRASES = {
  fr: {
    '/':                                ['Une méthode, trois moments.', 'On vous aide à décider, et on construit la suite.'],
    '/creation':                        ['Avant d’investir, on va voir vos futurs clients.', 'On trouve le client qui fera vivre votre projet.'],
    '/tester-une-idee':                 ['Des faits vécus, pas des intentions.', 'Votre idée, face à ceux qui l’achèteront.'],
    '/construire-votre-business-plan':  ['Un business plan qui part de votre client.', 'Chaque chiffre a sa source.'],
    '/comprendre-vos-clients':          ['Comprendre pourquoi vos clients achètent.', 'On part de ce que disent vos clients.'],
    '/relire-votre-dossier':            ['Relu comme un financeur le lira.', 'Avant la banque, une relecture.'],
    '/nos-offres':                      ['Un prix fixe, écrit avant de commencer.', 'On commence par une mission de départ.'],
    '/comment-ca-se-passe':             ['Comment se déroule une mission.', 'Ce qu’on fait, et dans quel ordre.'],
    '/exemple':                         ['Une mission complète, de bout en bout.', 'Un exemple, du premier échange au livrable.'],
    '/qui-on-est':                      ['Thomy et Florian, à Valenciennes et à Lille.', 'Deux personnes sur votre projet.'],
    '/contact':                         ['Réponse sous 24 h, par l’un de nous deux.', 'Trente minutes, sans engagement.', 'S’il n’y a rien à faire, on vous le dit.'],
    _default:                           ['On vous aide à décider, et on construit la suite.'],
  },
  en: {
    '/':                       ['Your systems, finally legible.', 'We open the hood.', 'Clutter has a cost. We measure it.'],
    '/pourquoi':               ['16.5 hours lost per person, every week.', 'A cost nobody sees.', 'The numbers, sourced.'],
    '/methode':                ['Five milestones, no blind spots.', 'You validate every step.', 'Nothing is imposed.'],
    '/offres':                 ['Prices shown, quote is free.', 'The audit is deducted if we continue.', 'Report guaranteed or not charged.'],
    '/exemple':                ['The deliverable, before you pay.', 'Exactly what you receive.', 'A real audit, in detail.'],
    '/a-propos':               ['Two people, one engagement.', 'Field first, tech second.', 'No outsourcing.'],
    '/contact':                ['A reply within 24 h, from one of us.', 'Thirty minutes, no strings attached.', 'If there’s nothing to do, we say so.'],
    '/numerique-responsable':  ['Fewer tools, fewer servers.', 'Simplifying means consuming less.', 'Sobriety, no greenwashing.'],
    _default:                  ['Map. Connect. Simplify.', 'Take back control.'],
  },
};

/* Retire la base du site (« /reskope », ou rien à la racine d'un domaine)
   pour retrouver la route applicative. */
const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');
const routeOf = (pathname) => (BASE_URL && pathname.startsWith(BASE_URL) ? pathname.slice(BASE_URL.length) : pathname) || '/';

function pickPhrase(lang, pathname) {
  const table = PHRASES[lang] || PHRASES.fr;
  const list = table[routeOf(pathname)] || table._default;
  return list[Math.floor(Math.random() * list.length)];
}

/* Transition de page — rideau indigo + le R réseau qui s'ASSEMBLE (nœuds
   dispersés qui convergent avec un léger rebond, liens qui se tracent, halo
   qui respire, wordmark qui monte), puis RÉVÉLATION de la nouvelle page :
   le logo grandit et s'efface pendant que le rideau se replie vers le haut. */

/* Chaque marque a sa façon de révéler une page :
   - Reskope et Elevate replient le rideau vers le haut (Elevate monte) ;
   - Create le laisse se fondre dans l'horizon, comme la lumière de l'aube ;
   - Define le range sur le côté, d'un seul geste. */
const RIDEAUX = {
  reskope: { plein: 'inset(0% 0% 0% 0%)', cache: 'inset(0% 0% 100% 0%)', ease: 'power4.inOut', monte: 0 },
  create: { plein: 'circle(150% at 50% 100%)', cache: 'circle(0% at 50% 100%)', ease: 'power3.inOut', monte: 0 },
  define: { plein: 'inset(0% 0% 0% 0%)', cache: 'inset(0% 0% 0% 100%)', ease: 'expo.inOut', monte: 0 },
  elevate: { plein: 'inset(0% 0% 0% 0%)', cache: 'inset(0% 0% 100% 0%)', ease: 'power4.inOut', monte: -90 },
};
const rideau = () => RIDEAUX[document.documentElement.dataset.marque] || RIDEAUX.reskope;

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function PageTransition() {
  const overlayRef = useRef(null);
  const stageRef = useRef(null);
  const logoRef = useRef(null);
  const wordRef = useRef(null);
  const motRef = useRef(null);
  const haloRef = useRef(null);
  const lineRef = useRef(null);
  const { pathname } = useLocation();
  const { lang } = useLang();
  const langRef = useRef(lang);
  langRef.current = lang;
  const isFirst = useRef(true);

  /* Initialise les paths SVG + le listener de clic (couverture) */
  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) return;

    const links = logo.querySelectorAll('.pt-link');
    const nodes = logo.querySelectorAll('.pt-node');

    const initLinks = () => {
      links.forEach((l) => {
        const len = l.getTotalLength();
        l.style.strokeDasharray = len;
        l.style.strokeDashoffset = len;
      });
    };
    initLinks();

    const cover = (destination) => {
      gsap.killTweensOf([overlay, stageRef.current, haloRef.current, wordRef.current, lineRef.current, ...nodes, ...links]);

      /* La phrase du chargement dépend de la page visée */
      if (lineRef.current) {
        lineRef.current.textContent = pickPhrase(langRef.current, destination);
      }

      /* La page d'arrivée change peut-être de marque (de l'accueil vers
         Create, de Define vers Elevate) : le rideau prend tout de suite la
         couleur de la destination, et le logo son nom. */
      const m = poserMarque(marqueDeDestination(destination));
      if (motRef.current) motRef.current.textContent = MARQUES[m] ? MARQUES[m].nom : '';
      /* Couverture INSTANTANÉE (aucun flash pendant le changement de route) */
      gsap.set(overlay, { clipPath: rideau().plein });
      gsap.set(stageRef.current, { autoAlpha: 1, scale: 1, y: 0 });
      gsap.set(haloRef.current, { scale: 0.62, autoAlpha: 0 });
      gsap.set(wordRef.current, { autoAlpha: 0, yPercent: 65 });
      gsap.set(lineRef.current, { autoAlpha: 0, yPercent: 60 });
      nodes.forEach((n) => gsap.set(n, { x: 0, y: 0 }));
      initLinks();

      /* Assemblage chorégraphié du R (resserré pour rester lisible avant la révélation) */
      const tl = gsap.timeline();
      tl.to(haloRef.current, { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, 0);
      nodes.forEach((n, i) => {
        tl.to(n, {
          x: R_NODES[i][0] - R_SCATTER[i][0],
          y: R_NODES[i][1] - R_SCATTER[i][1],
          ease: 'back.out(1.6)',
          duration: 0.5,
        }, 0.018 * i);
      });
      tl.to(links, { strokeDashoffset: 0, duration: 0.4, stagger: 0.03, ease: 'power1.inOut' }, 0.2);
      tl.to(wordRef.current, { autoAlpha: 0.92, yPercent: 0, duration: 0.42, ease: 'power3.out' }, 0.3);
      tl.to(lineRef.current, { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: 'power3.out' }, 0.42);
    };

    const onLinkClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || /^(https?:|mailto:|tel:|#|\/\/)/.test(href)) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      /* Même page : pas de transition (sinon le rideau resterait bloqué) */
      if (a.pathname === window.location.pathname) return;
      if (reduced()) return;
      cover(a.pathname);
    };

    /* Capture : on passe AVANT React Router (qui met à jour l'URL de façon
       synchrone au clic), sinon la garde « même page » verrait déjà la
       nouvelle URL et sauterait toujours la couverture. */
    document.addEventListener('click', onLinkClick, true);
    return () => document.removeEventListener('click', onLinkClick, true);
  }, []);

  /* Révèle la nouvelle page : logo qui grandit/s'efface + rideau qui se replie */
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const overlay = overlayRef.current;
    if (!overlay) return;

    const r = rideau();
    if (reduced()) {
      gsap.set(overlay, { clipPath: r.cache });
      return;
    }

    const tl = gsap.timeline({ delay: 0.58 });
    tl.to(stageRef.current, { scale: 1.16, y: r.monte, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, 0);
    tl.to(overlay, { clipPath: r.cache, duration: 0.62, ease: r.ease }, 0.08);
  }, [pathname]);

  return (
    <div ref={overlayRef} className="page-transition" aria-hidden="true">
      <div className="page-transition__stage" ref={stageRef}>
        <span className="page-transition__halo" ref={haloRef} aria-hidden="true" />
        <div className="page-transition__logo">
          <svg
            ref={logoRef}
            className="rlogo rlogo--transition"
            viewBox="0 0 132 150"
            role="presentation"
          >
            <g stroke="var(--cream)" strokeWidth="3" fill="none" strokeLinecap="round">
              {R_LINKS.map((lk, i) => (
                <path key={i} className="pt-link" d={linkD(R_NODES, lk)} />
              ))}
            </g>
            <g fill="var(--cream)">
              {R_NODES.map((_, i) => (
                <circle
                  key={i}
                  className="pt-node"
                  cx={R_SCATTER[i][0]}
                  cy={R_SCATTER[i][1]}
                  r={i === 3 ? 7 : 5.5}
                />
              ))}
            </g>
          </svg>
        </div>
        <span className="page-transition__word" ref={wordRef}>Reskope<span className="page-transition__marque" ref={motRef} /></span>
        <p className="page-transition__line" ref={lineRef} />
      </div>
    </div>
  );
}
