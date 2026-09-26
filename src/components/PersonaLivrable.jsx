import { useId, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { CATEGORIES, EXEMPLES } from '../data/livrables';

/* ════════════════════════════════════════════════════════════
   VOTRE CLIENT IDÉAL — le livrable, tel qu'on le remet.

   Une personne, pas une tranche d'âge. Au centre, son portrait ; autour,
   ses centres d'intérêt en constellation ; dessous, sa journée en réseau,
   avec le moment où votre offre peut la faire venir ; puis où la trouver,
   quoi lui dire, et la zone où elle vit.

   Les couleurs ne décorent pas : chacune dit une catégorie (son quotidien,
   là où la toucher, ce qui compte pour elle, le moment clé), et la légende
   le rappelle. Ce qui touche directement l'offre reste à l'indigo de la
   marque.

   Trois exemples en onglets : un coffee shop, un artisan, un logiciel. Le
   ciblage vaut pour tous les projets, et c'est ce que l'on montre.
   ════════════════════════════════════════════════════════════ */

const BASE = import.meta.env.BASE_URL;

/* Les accords : Claire (la), Marc et Julie (les). */
const accords = (ex) => (ex.nom.includes(' et ')
  ? { la: 'les', lui: 'leur', sa: 'leur', ses: 'leurs', elle: 'eux' }
  : { la: 'la', lui: 'lui', sa: 'sa', ses: 'ses', elle: 'elle' });

const nomCategorie = (cat, a) => {
  if (cat === 'valeur') return `Ce qui compte pour ${a.elle}`;
  if (cat === 'cle') return `Le moment où ${a.elle === 'eux' ? 'ils peuvent' : 'elle peut'} venir`;
  if (cat === 'vie') return `${a.sa.charAt(0).toUpperCase()}${a.sa.slice(1)} quotidien`;
  return CATEGORIES[cat].nom;
};

/* La constellation : les intérêts sur une ellipse autour du portrait. */
function Constellation({ ex }) {
  const n = ex.interets.length;
  const points = ex.interets.map((it, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const x = 50 + Math.cos(a) * 33;
    const y = 50 + Math.sin(a) * 36;
    /* L'étiquette se pose du côté opposé au trait qui arrive du centre :
       au-dessus du nœud dans la moitié haute, en dessous dans la moitié
       basse. Centrée, elle ne déborde jamais du cadre. */
    return { ...it, x, y, haut: y < 49 };
  });
  return (
    <div className="pl-const" data-const>
      <svg className="pl-const__traits" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {points.map((p) => (
          <line key={p.t} className={`pl-const__trait pl-c--${p.cat}`} x1="50" y1="50" x2={p.x} y2={p.y} />
        ))}
      </svg>
      <div className="pl-const__centre">
        <img src={`${BASE}personas/${ex.photo}.webp`} alt="" loading="lazy" decoding="async" width="144" height="144" />
      </div>
      <ul className="pl-const__liste">
        {points.map((p) => (
          <li
            key={p.t}
            className={`pl-const__point${p.haut ? ' is-haut' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className={`pl-noeud pl-c--${p.cat}`} aria-hidden="true" />
            <span className="pl-const__t">{p.t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Journee({ ex, a }) {
  return (
    <div className="pl-jour" data-jour>
      <span className="pl-jour__fil" aria-hidden="true" />
      <ol className="pl-jour__liste">
      {ex.journee.map((m) => (
        <li key={m.h + m.t} className={`pl-jour__moment${m.cat === 'cle' ? ' is-cle' : ''}`}>
          <span className="pl-jour__h">{m.h}</span>
          <span className={`pl-noeud pl-c--${m.cat}`} aria-hidden="true" />
          <span className="pl-jour__t">
            {m.t}
            {m.cat === 'cle' && <span className="pl-jour__cle">{nomCategorie('cle', a)}</span>}
          </span>
        </li>
      ))}
      </ol>
    </div>
  );
}

function Zone({ ex }) {
  /* Quelques points pour dire « vos clients sont là », presque tous dans
     le cercle : c'est ce que la discovery dessine. */
  const clients = [[38, 40], [58, 36], [63, 58], [44, 62], [52, 47], [30, 55], [70, 45], [49, 28], [36, 70], [80, 70]];
  return (
    <figure className="pl-zone">
      <svg viewBox="0 0 100 100" className="pl-zone__carte" aria-hidden="true">
        <circle cx="50" cy="50" r="44" className="pl-zone__anneau pl-zone__anneau--3" />
        <circle cx="50" cy="50" r="30" className="pl-zone__anneau pl-zone__anneau--2" />
        <circle cx="50" cy="50" r="16" className="pl-zone__anneau pl-zone__anneau--1" />
        {clients.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" className="pl-zone__client" />)}
        <circle cx="50" cy="50" r="4.2" className="pl-zone__vous" />
      </svg>
      <figcaption>
        <strong>{ex.zone.rayon}</strong> {ex.zone.dit}
      </figcaption>
    </figure>
  );
}

export default function PersonaLivrable({ titre = true }) {
  const racine = useRef(null);
  const base = useId().replace(/:/g, '');
  const [actif, setActif] = useState(0);
  const ex = EXEMPLES[actif];
  const a = accords(ex);

  /* La première fois, tout arrive de la profondeur quand on atteint le
     livrable ; ensuite, changer d'exemple fait repartir le panneau seul,
     et la constellation, la journée et la zone se redessinent. */
  const vu = useRef(false);
  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const entree = !vu.current;
    const tl = gsap.timeline(entree ? {
      scrollTrigger: { trigger: racine.current, start: 'top 78%', once: true, onEnter: () => { vu.current = true; } },
    } : {});
    if (entree) tl.from(racine.current, { z: -520, rotateX: -14, y: 60, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0);
    else tl.from(q('.pl-panneau'), { z: -380, rotateX: -10, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0);
    tl.fromTo(q('.pl-portrait__cadre'),
      { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1, ease: 'power4.inOut', clearProps: 'clipPath' }, 0.05)
      .from(q('.pl-const__trait'), { attr: { x2: 50, y2: 50 }, duration: 0.8, ease: 'power3.out', stagger: 0.05 }, 0.3)
      .from(q('.pl-const__point'), { scale: 0.2, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.8)', stagger: 0.06 }, 0.35)
      .fromTo(q('.pl-jour__fil'), { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1, ease: 'power2.inOut' }, 0.45)
      .from(q('.pl-jour__moment'), { z: -260, y: 18, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0.55)
      .from(q('.pl-zone__client'), { attr: { r: 0 }, duration: 0.5, ease: 'back.out(2)', stagger: 0.04 }, 0.7);
  }, { scope: racine, dependencies: [actif], revertOnUpdate: true });

  const clavier = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const k = (actif + (e.key === 'ArrowRight' ? 1 : EXEMPLES.length - 1)) % EXEMPLES.length;
    setActif(k);
    const btn = racine.current.querySelectorAll('[role="tab"]')[k];
    if (btn) btn.focus();
  };

  return (
    <div className={`pl-livrable pl-accent--${ex.accent}`} ref={racine} data-soi>
      <div className="pl-onglets" role="tablist" aria-label="Trois exemples de client idéal" onKeyDown={clavier}>
        {EXEMPLES.map((e, i) => (
          <button
            key={e.id}
            type="button"
            role="tab"
            id={`${base}-t${i}`}
            aria-selected={i === actif}
            aria-controls={`${base}-p`}
            tabIndex={i === actif ? 0 : -1}
            className={`pl-onglet pl-accent--${e.accent}${i === actif ? ' is-actif' : ''}`}
            onClick={() => setActif(i)}
          >
            <span className="pl-onglet__noeud" aria-hidden="true" />
            {e.onglet}
          </button>
        ))}
      </div>

      <div className="pl-panneau" role="tabpanel" id={`${base}-p`} aria-labelledby={`${base}-t${actif}`} key={ex.id}>
        <p className="pl-projet"><span>Le projet :</span> {ex.projet.charAt(0).toLowerCase() + ex.projet.slice(1)}.</p>

        <div className="pl-grille">
          <figure className="pl-portrait">
            <div className="pl-portrait__cadre" data-incliner>
              <img
                src={`${BASE}personas/${ex.photo}.webp`}
                alt={ex.alt}
                loading="lazy"
                decoding="async"
                width="960"
                height="1200"
              />
            </div>
            <figcaption>
              {titre ? <h3 className="pl-nom">{ex.nom}</h3> : <p className="pl-nom">{ex.nom}</p>}
              <p className="pl-qui">{ex.qui}</p>
              <p className="pl-mention">Personne et portrait inventés pour l’exemple.</p>
            </figcaption>
          </figure>

          <div className="pl-analyse">
            <ul className="pl-decide">
              <li className="pl-decide__oui">
                <span className="pl-noeud pl-c--vie" aria-hidden="true" />
                <span><strong>Ce qui {a.la} décide :</strong> {ex.decide}</span>
              </li>
              <li className="pl-decide__non">
                <span className="pl-noeud pl-noeud--creux pl-c--valeur" aria-hidden="true" />
                <span><strong>Ce qui {a.la} freine :</strong> {ex.freine}</span>
              </li>
            </ul>

            <section className="pl-bloc" aria-label={`${a.ses.charAt(0).toUpperCase()}${a.ses.slice(1)} centres d’intérêt`}>
              <h4 className="pl-bloc__t">{a.ses.charAt(0).toUpperCase()}{a.ses.slice(1)} centres d’intérêt, reliés à votre offre</h4>
              <Constellation ex={ex} />
            </section>

            <section className="pl-bloc" aria-label={`${a.sa.charAt(0).toUpperCase()}${a.sa.slice(1)} journée`}>
              <h4 className="pl-bloc__t">{a.sa.charAt(0).toUpperCase()}{a.sa.slice(1)} journée, et le moment où vous pouvez {a.la} faire venir</h4>
              <Journee ex={ex} a={a} />
            </section>

            <div className="pl-bas">
              <section className="pl-bloc" aria-label={`Où ${a.la} trouver`}>
                <h4 className="pl-bloc__t">Où {a.la} trouver</h4>
                <ul className="pl-canaux">
                  {ex.canaux.map((c) => (
                    <li key={c}><span className="pl-noeud pl-c--media" aria-hidden="true" />{c}</li>
                  ))}
                </ul>
              </section>
              <section className="pl-bloc" aria-label={`Quoi ${a.lui} dire`}>
                <h4 className="pl-bloc__t">Quoi {a.lui} dire</h4>
                <blockquote className="pl-message">«&nbsp;{ex.message}&nbsp;»</blockquote>
                <h4 className="pl-bloc__t">{a.sa.charAt(0).toUpperCase()}{a.sa.slice(1)} zone</h4>
                <Zone ex={ex} />
              </section>
            </div>

            <p className="pl-change"><strong>Ce que ça change pour vous :</strong> {ex.change}</p>
          </div>
        </div>

        <ul className="pl-legende" aria-label="Ce que disent les couleurs">
          {['offre', 'vie', 'media', 'valeur', 'cle'].map((cat) => (
            <li key={cat}><span className={`pl-noeud pl-c--${cat}`} aria-hidden="true" />{nomCategorie(cat, a)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
