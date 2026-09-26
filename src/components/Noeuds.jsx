import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   UNE LISTE, DANS LA LANGUE DU RÉSEAU.

   Chaque élément porte un nœud : plein pour ce qu'on vous remet, en fil de
   fer pour ce qu'on ne fait pas. C'est la même convention que les volumes
   du site : on n'a pas besoin de la légende pour comprendre.

   Les éléments arrivent de la profondeur l'un après l'autre, et le fil
   vertical qui les relie se trace en même temps : la liste se construit
   sous les yeux, elle n'apparaît pas d'un bloc.
   ════════════════════════════════════════════════════════════ */

export default function Noeuds({ items, etat = 'plein', className = '', grand = false }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const tl = gsap.timeline({ scrollTrigger: { trigger: racine.current, start: 'top 86%' } });
    tl.fromTo(q('.nds__fil'), { scaleY: 0 }, { scaleY: 1, duration: 0.3 + items.length * 0.14, ease: 'power2.inOut' }, 0);
    tl.from(q('.nds__item'), {
      z: -380, y: 30, rotateX: -24, autoAlpha: 0,
      duration: 0.8, ease: 'power3.out', stagger: 0.12,
    }, 0.05);
    tl.from(q('.nds__noeud'), {
      scale: 0, duration: 0.45, ease: 'back.out(2.6)', stagger: 0.12,
    }, 0.25);
  }, { scope: racine });

  return (
    <ul className={`nds nds--${etat}${grand ? ' nds--grand' : ''} ${className}`} ref={racine} data-soi>
      <span className="nds__fil" aria-hidden="true" />
      {items.map((t) => (
        <li className="nds__item" key={typeof t === 'string' ? t : t.texte}>
          <span className="nds__noeud" aria-hidden="true" />
          {typeof t === 'string' ? (
            <span className="nds__t">{t}</span>
          ) : (
            <span className="nds__t">
              {t.texte}
              {t.suite && <span className="nds__suite">{t.suite}</span>}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
