import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   CE QUI REVIENT, AVEC LEURS MOTS.

   Chaque sujet est un nœud, d'autant plus gros que plus de personnes en ont
   parlé ; les citations y sont suspendues, une par personne, avec ce que
   cette personne a fait : signé, refusé, ou pas revenue. On lit la
   synthèse de haut en bas, et on peut vérifier chaque ligne : si on ne
   peut pas dire qui l'a dit, on ne l'écrit pas.

   Le nœud arrive de la profondeur, le fil se tend, et les citations s'y
   accrochent une à une.
   ════════════════════════════════════════════════════════════ */

const ISSUE = { signe: 'a signé', refuse: 'n’a pas signé', parti: 'n’est pas revenu' };

export default function Verbatims({ sujets, total = 11 }) {
  const racine = useRef(null);
  const max = Math.max(...sujets.map((s) => s.n));

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    q('.vb__sujet').forEach((col, k) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: col, start: 'top 82%' } });
      tl.from(col.querySelector('.vb__hub'), { z: -500, scale: 0.2, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.8)' }, k * 0.12)
        .from(col.querySelector('.vb__tete'), { z: -360, y: 20, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, k * 0.12 + 0.15)
        .fromTo(col.querySelector('.vb__fil'), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: 'power2.inOut' }, k * 0.12 + 0.3)
        .from(col.querySelectorAll('.vb__cite'), {
          z: -420, y: 30, rotateX: -18, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.14,
        }, k * 0.12 + 0.4);
    });
  }, { scope: racine });

  return (
    <div className="vb" ref={racine} data-soi>
      {sujets.map((s) => (
        <section
          className="vb__sujet"
          key={s.nom}
          aria-label={`${s.nom}, ${s.n} personnes sur ${total}`}
          style={{ '--vb-r': `${1.6 + (s.n / max) * 2.4}rem` }}
        >
          <div className="vb__haut">
            <span className="vb__hub" aria-hidden="true">{s.n}</span>
            <div className="vb__tete">
              <h3 className="vb__nom">{s.nom}</h3>
              <p className="vb__n">{s.n} personnes sur {total}</p>
            </div>
          </div>
          <ul className="vb__liste">
            <span className="vb__fil" aria-hidden="true" />
            {s.citations.map((c) => (
              <li className="vb__cite" key={c.t}>
                <span className={`vb__noeud vb__noeud--${c.issue}`} aria-hidden="true" />
                <blockquote className="vb__t">« {c.t} »</blockquote>
                <p className="vb__qui">{c.qui}, {ISSUE[c.issue]}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
