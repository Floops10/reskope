import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { useLang } from '../i18n';
import { PREUVES_TPE } from '../data/profils';
import { instant } from '../lib/scrub';
import { champ, VIEWBOX_CHAMP } from '../lib/figures';

/* ============================================================
   Les deux chiffres qui posent le sujet, version TPE.

   Un pourcentage écrit en gros, c'est une affirmation : on le croit ou on
   ne le croit pas. Cent blocs posés sur un sol, dont quatre-vingt-quinze
   pleins et cinq en fil de fer, c'est une quantité : on peut la compter.
   Le chiffre monte pendant que les blocs se lèvent, et les deux arrivent
   ensemble au même endroit.

   Le dessin est celui des livrets : même projection, mêmes trois indigos
   sur les trois faces. La page verte et la planche de l'accueil parlent la
   même langue, il n'y a pas de raison que les chiffres en parlent une autre.
   ============================================================ */

function Champ({ item, i }) {
  const racine = useRef(null);
  const valeurRef = useRef(null);
  const { sol, volumes } = champ(item.n);

  useGSAP(() => {
    const el = racine.current;
    const blocs = el.querySelectorAll('.pv3__b');
    const val = valeurRef.current;
    const ecrire = (v) => { val.firstChild.nodeValue = String(Math.round(v)); };

    if (instant()) { ecrire(item.n); return; }

    ecrire(0);
    gsap.set(blocs, { autoAlpha: 0, y: 3 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top 76%' },
      delay: i * 0.18,
    });

    /* Le sol se trace d'un trait, puis les blocs arrivent du fond vers
       l'avant, dans l'ordre où ils sont posés. Le compteur suit la même
       durée : quand le dernier bloc se pose, le chiffre est juste. */
    tl.from(el.querySelectorAll('.pv3__sol line'), {
      opacity: 0, duration: 0.5, ease: 'none', stagger: 0.02,
    }, 0);
    tl.to(blocs, {
      autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out',
      stagger: { each: 0.011, from: 'start' },
    }, 0.22);
    tl.to({ v: 0 }, {
      v: item.n, duration: blocs.length * 0.011 + 0.42, ease: 'none',
      onUpdate() { ecrire(this.targets()[0].v); },
    }, 0.22);
    tl.from(el.querySelectorAll('.pv3__t, .pv3__src'), {
      y: 14, autoAlpha: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07,
    }, 0.5);
  }, { scope: racine, dependencies: [item.n] });

  return (
    <div className="pv3" ref={racine}>
      <svg className="pv3__champ" viewBox={VIEWBOX_CHAMP} aria-hidden="true">
        <g className="pv3__sol">
          {sol.lignes.map((l, k) => <line key={k} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />)}
        </g>
        {volumes.map((v, k) => (
          <g className="pv3__b" key={k}>
            {v.faces && v.faces.map((f, q) => <polygon key={q} className={f.cls} points={f.d} />)}
            {v.lignes && v.lignes.map((l, q) => (
              <line key={q} className="axo-f" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
            ))}
          </g>
        ))}
      </svg>

      <p className="pv3__v">
        <span ref={valeurRef}>{item.n}</span>
        <em>{item.unite}</em>
      </p>
      <p className="pv3__t">{item.t}</p>
      <a className="pv3__src" href={item.url} target="_blank" rel="noopener noreferrer">
        {item.src}
      </a>
    </div>
  );
}

export default function PreuvesTpe() {
  const { lang } = useLang();
  const c = PREUVES_TPE[lang] || PREUVES_TPE.fr;

  return (
    <section className="prv" aria-label={c.intro}>
      <div className="container">
        <p className="prv__intro">{c.intro}</p>
        <div className="prv__grid">
          {c.items.map((it, i) => <Champ key={it.n} item={it} i={i} />)}
        </div>
      </div>
    </section>
  );
}
