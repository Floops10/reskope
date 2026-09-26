import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   UNE AMORCE, ET CE QU'ELLE IMPLIQUE.

   La règle du site : aucun texte ne commence froid. Une phrase en grand dit
   de quoi il s'agit ; le détail suit à côté, plus petit. Sur grand écran,
   la phrase tient à gauche pendant que le détail défile à droite : on ne
   perd jamais la question pendant qu'on lit la réponse.

   La phrase arrive de la profondeur, légèrement basculée, et se redresse ;
   chaque bloc du détail la suit, un par un, au rythme du défilement.
   ════════════════════════════════════════════════════════════ */

export default function Amorce({
  id,
  lead,
  sous,
  as: Titre = 'h2',
  children,
  className = '',
  sombre = false,
  large = false,
}) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    gsap.from(q('.am__lead, .am__sous'), {
      z: -720, y: 56, rotateX: -30, autoAlpha: 0,
      duration: 1.05, ease: 'power3.out', stagger: 0.14,
      scrollTrigger: { trigger: racine.current, start: 'top 80%' },
    });
    /* Un bloc qui porte sa propre entrée (une liste qui arrive élément par
       élément, un schéma qui se construit) le signale par data-soi. */
    q('.am__corps > *:not([data-soi])').forEach((el, i) => {
      gsap.from(el, {
        z: -420 - (i % 3) * 80, y: 40, rotateX: -18, autoAlpha: 0,
        duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    });
  }, { scope: racine });

  return (
    <section
      className={`am${large ? ' am--large' : ''}${sombre ? ' am--sombre' : ''} ${className}`}
      ref={racine}
      aria-labelledby={id ? `${id}-t` : undefined}
      id={id}
      {...(sombre ? { 'data-nav-dark': true, 'data-cursor-dark': true } : {})}
    >
      <div className="container am__in">
        <div className="am__tient">
          <Titre className="am__lead" id={id ? `${id}-t` : undefined}>{lead}</Titre>
          {sous && <p className="am__sous">{sous}</p>}
        </div>
        <div className="am__corps">{children}</div>
      </div>
    </section>
  );
}
