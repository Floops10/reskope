import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useCountUp } from '../hooks/useCountUp';
import { useLang } from '../i18n';
import { PREUVES_TPE } from '../data/profils';
import { instant } from '../lib/scrub';

/* ============================================================
   Les deux chiffres qui posent le sujet, version TPE.

   La version PME a une page entière pour ça, « Le constat ». Ce
   raisonnement ne tient pas chez quelqu'un qui n'a pas encore de site :
   il n'y a pas de désordre, il y a une absence. Ici on pose le sujet en
   deux chiffres, et on s'arrête là.

   Pas d'intertitre, pas de grande phrase d'introduction : les chiffres
   sont le propos. Un bandeau qui empile sur-titre, titre et chapô avant
   de dire quoi que ce soit, c'est du remplissage — et ça se voit.

   Le fond reste celui de la page. Une bande d'une autre couleur pour
   trois lignes de texte découpe la page pour rien.
   ============================================================ */

function Chiffre({ item, i }) {
  const [ref, valeur] = useCountUp(item.n, { duration: 1500 + i * 220 });
  return (
    <div className="prv__item">
      <span className="prv__rule" aria-hidden="true" />
      <span className="prv__v" ref={ref}>
        {Math.round(valeur)}
        <em>{item.unite}</em>
      </span>
      <span className="prv__t">{item.t}</span>
      <a className="prv__src" href={item.url} target="_blank" rel="noopener noreferrer">
        {item.src}
      </a>
    </div>
  );
}

export default function PreuvesTpe() {
  const { lang } = useLang();
  const c = PREUVES_TPE[lang] || PREUVES_TPE.fr;
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const el = racine.current;
    /* Le trait se trace, le chiffre monte, la phrase suit : trois temps
       très courts qui donnent au bloc le même vocabulaire d'entrée que
       le reste du site, au lieu d'une apparition brute. */
    gsap.from(el.querySelectorAll('.prv__rule'), {
      scaleX: 0, transformOrigin: 'left center', duration: 0.9, ease: 'power3.out',
      stagger: 0.14, scrollTrigger: { trigger: el, start: 'top 78%' },
    });
    gsap.from(el.querySelectorAll('.prv__t, .prv__src, .prv__intro'), {
      y: 18, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 74%' },
    });
  }, { scope: racine, dependencies: [lang] });

  return (
    <section className="prv" ref={racine} aria-label={c.intro}>
      <div className="container">
        <p className="prv__intro">{c.intro}</p>
        <div className="prv__grid">
          {c.items.map((it, i) => <Chiffre key={it.n} item={it} i={i} />)}
        </div>
      </div>
    </section>
  );
}
