import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import SwapLabel from './SwapLabel';
import { useLang } from '../i18n';
import { useProfil, BASE } from '../profil';
import { AILLEURS } from '../data/site';

/* ════════════════════════════════════════════════════════════
   VOTRE CLIENT IDÉAL — la mission qui vaut pour toutes les entreprises.

   Remettre ses outils en ordre ne sert à rien si l'on ne sait pas qui l'on
   veut servir. Cette section le dit à la TPE comme à la PME, chacune dans
   son ton (direct pour l'une, posé et chiffré pour l'autre), et montre le
   livrable en réseau : au centre une personne, autour ce qu'on sait d'elle
   à la fin de la mission.

   La mission elle-même est décrite une seule fois pour tout le site, dans
   « Comprendre vos clients » ; cette section y mène.
   ════════════════════════════════════════════════════════════ */

const TEXTES = {
  tpe: {
    fr: {
      q: 'Et vos clients, vous savez où en trouver d’autres ?',
      noeuds: ['Qui ils sont', 'Ce qui les décide', 'Où les trouver', 'Quoi leur dire', 'Votre zone'],
      centre: 'Votre client idéal',
      fin: 'On va voir vos meilleurs clients, on dessine leur portrait, et vous savez où en trouver d’autres, et quoi leur dire. Trois à quatre semaines, une heure et demie de votre temps par semaine.',
      exemple: 'Exemple : Marc et Julie, les clients idéaux d’une entreprise de chauffage. Personnes et portrait inventés.',
      photo: 'marc-julie',
    },
    en: {
      q: 'Your customers: do you know where to find more of them?',
      noeuds: ['Who they are', 'What makes them buy', 'Where to find them', 'What to tell them', 'Your area'],
      centre: 'Your ideal customer',
      fin: 'We meet your best customers, draw their portrait, and you know where to find more of them and what to tell them. Three to four weeks, an hour and a half of your time per week.',
      exemple: 'Example: Marc and Julie, the ideal customers of a heating business. People and portrait are invented.',
      photo: 'marc-julie',
    },
  },
  pme: {
    fr: {
      q: 'Pourquoi vos clients vous choisissent, et où trouver les suivants.',
      noeuds: ['Qui ils sont', 'Ce qui les décide', 'Où les trouver', 'Quoi leur dire', 'Votre marché'],
      centre: 'Votre client idéal',
      fin: 'Dix à douze entretiens avec vos clients et vos prospects, le portrait de votre client idéal, et un plan pour le cibler : canaux, message, zone. À faire avant d’investir dans un outil, un recrutement commercial ou une campagne.',
      exemple: 'Exemple : Sophie, la cliente idéale d’un éditeur de logiciel. Personne et portrait inventés.',
      photo: 'sophie',
    },
    en: {
      q: 'Why your customers choose you, and where to find the next ones.',
      noeuds: ['Who they are', 'What makes them buy', 'Where to find them', 'What to tell them', 'Your market'],
      centre: 'Your ideal customer',
      fin: 'Ten to twelve interviews with your customers and prospects, a portrait of your ideal customer, and a plan to reach them: channels, message, area. Worth doing before investing in a tool, a sales hire or a campaign.',
      exemple: 'Example: Sophie, the ideal customer of a software publisher. Person and portrait are invented.',
      photo: 'sophie',
    },
  },
};

/* Les couleurs d'explication du site : chaque nœud dit une catégorie. */
const COULEURS = ['menthe', 'corail', 'ciel', 'indigo', 'soleil'];

export default function Ciblage() {
  const racine = useRef(null);
  const { lang } = useLang();
  const { profil } = useProfil();
  const t = (TEXTES[profil] || TEXTES.pme)[lang] || TEXTES.pme.fr;
  const n = t.noeuds.length;
  const points = t.noeuds.map((label, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { label, x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 38, haut: Math.sin(a) < -0.1, couleur: COULEURS[i] };
  });

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.from(q('.cib__q'), {
      z: -760, y: 54, rotateX: -34, autoAlpha: 0, duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: racine.current, start: 'top 78%' },
    });
    const tl = gsap.timeline({ scrollTrigger: { trigger: q('.cib__reseau')[0], start: 'top 80%' } });
    tl.from(q('.cib__centre'), { z: -600, scale: 0.5, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0)
      .from(q('.cib__trait'), { attr: { x2: 50, y2: 50 }, duration: 0.8, ease: 'power3.out', stagger: 0.07 }, 0.3)
      .from(q('.cib__noeud'), { z: -300, scale: 0.3, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.08 }, 0.4)
      .from(q('.cib__fin, .cib__cta, .cib__exemple'), { z: -420, y: 36, autoAlpha: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1 }, 0.7);
  }, { scope: racine, dependencies: [lang, profil], revertOnUpdate: true });

  return (
    <section className="cib" ref={racine} aria-labelledby="cib-q">
      <div className="container cib__in">
        <div className="cib__ask">
          <h2 className="cib__q" id="cib-q">{t.q}</h2>
        </div>

        <div className="cib__corps">
          <figure className="cib__reseau">
            <svg className="cib__traits" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {points.map((p) => (
                <line key={p.label} className={`cib__trait cib--${p.couleur}`} x1="50" y1="50" x2={p.x} y2={p.y} />
              ))}
            </svg>
            <div className="cib__centre">
              <img src={`${BASE}/personas/${t.photo}.webp`} alt="" width="960" height="1200" loading="lazy" decoding="async" />
              <span>{t.centre}</span>
            </div>
            <ul className="cib__noeuds">
              {points.map((p) => (
                <li
                  key={p.label}
                  className={`cib__noeud${p.haut ? ' is-haut' : ''}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <i className={`cib__point cib--${p.couleur}`} aria-hidden="true" />
                  {p.label}
                </li>
              ))}
            </ul>
            <figcaption className="cib__exemple">{t.exemple}</figcaption>
          </figure>

          <p className="cib__fin">{t.fin}</p>
          <div className="cib__cta">
            <a
              href={`${BASE}/${AILLEURS.clients.chemin}`}
              className="btn btn--primary"
              hrefLang={lang === 'en' ? 'fr' : undefined}
              data-cursor-label={lang === 'en' ? 'Go' : 'Y aller'}
            >
              <SwapLabel>{AILLEURS.clients[lang] || AILLEURS.clients.fr}</SwapLabel>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
