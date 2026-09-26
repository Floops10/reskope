import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { buildR3D } from '../lib/net3d';
import Net3D from './Net3D';
import SwapLabel from './SwapLabel';
import BusinessCard from './BusinessCard';
import { useT } from '../i18n';
import { CONTACT } from '../data/site';
import { PORTES } from '../data/offres';
import { SITE_NUMERIQUE } from '../data/seo';

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
  const f = useT().footer;
  const rShape = buildR3D(14, 0.6);
  /* Clôture courte et directe : la même phrase que le bouton de l'en-tête,
     pour que le visiteur retrouve en bas ce qu'on lui a proposé en haut. */
  const statement = 'Parlons de votre situation.';

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

    /* Colonnes : chaque ligne monte derrière son propre masque, colonne
       après colonne. Une cascade d'opacité sur trois blocs entiers ne se
       voit pas ; ligne à ligne, si. */
    gsap.from(rootRef.current.querySelectorAll('.footer2__col > *'), {
      yPercent: 105, autoAlpha: 0, duration: 0.65, ease: 'power4.out', stagger: 0.035,
      /* Sans clearProps, une ligne pouvait rester sur son décalage de départ
         et se poser sur la suivante — c'est ce qui faisait passer « Carte de
         visite » par-dessus la ville. Une fois montée, la ligne ne garde
         aucune transformation. */
      clearProps: 'transform,visibility,opacity',
      scrollTrigger: { trigger: rootRef.current.querySelector('.footer2__grid'), start: 'top 90%' },
    });

    /* Le générique de fin : les lettres du nom, dans l'alphabet réseau de
       la marque, montent une à une derrière leur masque. Un balayage de
       clip faisait passer un rideau sur un mot déjà écrit ; ici le mot
       s'écrit. Et une fois posé, il répond au curseur : les lettres se
       soulèvent sur son passage, comme une touche qu'on effleure. */
    const word = wordRef.current;
    const lettres = [...word.querySelectorAll('.footer2__lettre > i')];
    gsap.from(lettres, {
      yPercent: 118, duration: 1, ease: 'power4.out', stagger: 0.055,
      scrollTrigger: { trigger: word, start: 'top 96%' },
    });

    let detacheVague = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const vers = lettres.map((ch) => gsap.quickTo(ch, 'y', { duration: 0.6, ease: 'power3.out' }));
      const zone = word.parentNode;
      const onde = (e) => {
        const r = zone.getBoundingClientRect();
        const x = e.clientX - r.left;
        lettres.forEach((ch, i) => {
          const c = ch.getBoundingClientRect();
          const d = (c.left + c.width / 2 - r.left) - x;
          /* Une cloche : la lettre sous le curseur monte le plus, ses
             voisines suivent en s'amortissant. */
          vers[i](-26 * Math.exp(-((d / 190) ** 2)));
        });
      };
      const repos = () => lettres.forEach((_, i) => vers[i](0));
      zone.addEventListener('pointermove', onde);
      zone.addEventListener('pointerleave', repos);
      detacheVague = () => {
        zone.removeEventListener('pointermove', onde);
        zone.removeEventListener('pointerleave', repos);
      };
    }

    /* Parallaxe des couches de poussière : l'univers a de la profondeur */
    [0, 1, 2].forEach((layer) => {
      gsap.fromTo(rootRef.current.querySelectorAll(`.footer2__dust--${layer}`),
        { yPercent: -30 - layer * 22 },
        {
          yPercent: 10 + layer * 8, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        });
    });

    /* La poussière s'allume : au lieu d'être là depuis toujours, l'univers
       prend feu quand le pied de page arrive. */
    gsap.from(rootRef.current.querySelectorAll('.footer2__dust'), {
      autoAlpha: 0, scale: 0.2, duration: 0.9, ease: 'power2.out',
      stagger: { each: 0.004, from: 'random' },
      scrollTrigger: { trigger: rootRef.current, start: 'top 85%' },
    });

    return () => { split?.revert(); detacheVague?.(); };
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
        <Link to="/contact" className="btn btn--on-dark footer2__cta" data-cursor-label="Écrire">
          <SwapLabel>Nous écrire</SwapLabel>
          <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="container footer2__grid">
        {/* Les trois situations d'abord, comme dans le menu : c'est par
            elles qu'on entre chez nous. */}
        <nav className="footer2__col" aria-label="Pour commencer">
          <span className="footer2__heading">Pour commencer</span>
          {PORTES.map((p) => <Link key={p.id} to={p.slug}>{p.court}</Link>)}
        </nav>

        <nav className="footer2__col" aria-label="Le site">
          <span className="footer2__heading">Le site</span>
          <Link to="/nos-offres">Nos offres</Link>
          <Link to="/comment-ca-se-passe">Comment ça se passe</Link>
          <Link to="/exemple">Un exemple complet</Link>
          <Link to="/qui-on-est">Qui on est</Link>
          {/* L'autre site de Reskope : l'audit et la cartographie des outils,
              en version TPE et PME, en français et en anglais. */}
          <a href={SITE_NUMERIQUE.url}>{SITE_NUMERIQUE.lien}</a>
        </nav>

        <div className="footer2__col">
          <span className="footer2__heading">Nous joindre</span>
          {CONTACT.ouverte && <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>}
          <Link to="/contact">Nous écrire</Link>
          <button type="button" className="footer2__card-btn" onClick={() => setCardOpen(true)}>
            {f.card} <span aria-hidden="true">→</span>
          </button>
          {/* D'où on part : sans adresse à afficher, dire la zone est une
              information. */}
          <span className="footer2__zone">Valenciennes et Lille</span>
        </div>
      </div>

      {/* Générique de fin : le wordmark en police réseau */}
      {/* Le générique de fin. Les lettres sont découpées dans le balisage
          plutôt que par un plugin : elles doivent monter derrière leur
          masque ET répondre au curseur, et un découpage qui se défait au
          démontage rendait les deux fragiles. */}
      <div className="footer2__word-wrap" aria-hidden="true">
        <span className="footer2__word" ref={wordRef}>
          {'Reskope'.split('').map((l, i) => (
            <span className="footer2__lettre" key={i}><i>{l}</i></span>
          ))}
        </span>
      </div>

      <div className="container footer2__legal">
        <nav className="footer2__legal-links" aria-label="Informations légales">
          <Link to="/mentions-legales">{f.mentions}</Link>
          <Link to="/confidentialite">{f.privacy}</Link>
          <Link to="/cgu">{f.terms}</Link>
          <Link to="/cgv">{f.sales}</Link>
        </nav>
        <p>© {new Date().getFullYear()} Reskope · On vous aide à décider, et on construit la suite.</p>
      </div>

      {cardOpen && <BusinessCard onClose={() => setCardOpen(false)} />}
    </footer>
  );
}
