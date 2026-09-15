import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { figure, VIEWBOX } from '../lib/figures';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { FAIT } from '../data/profils';

/* ============================================================
   CE QU'ON FAIT — la réponse, tout de suite.

   Le visiteur arrivait sur une accroche, puis huit écrans de traversée
   avant de savoir ce qu'on vend. Ce bloc est posé juste sous l'accroche :
   quatre choses, dites avec des verbes, et le détail des prix laissé à la
   page des offres. Personne n'a envie d'un tarif avant d'avoir compris ce
   qu'il achète.

   Le dessin est celui des livrets : sol quadrillé, volumes en axonométrie,
   les trois indigos de la charte sur les trois faces. Les quatre sols sont
   à la même échelle et se prolongent l'un l'autre, donc la rangée se lit
   comme une planche, pas comme quatre vignettes posées côte à côte.
   ============================================================ */

function Figure({ nom }) {
  const { sol, volumes } = figure(nom);
  return (
    <svg className="axo" viewBox={VIEWBOX} aria-hidden="true">
      <g className="axo__sol">
        {sol.lignes.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
        <polygon className="axo__cadre" points={sol.cadre} />
      </g>
      {volumes.map((v, i) => (
        <g className="axo__v" key={i}>
          {v.faces && v.faces.map((f, k) => <polygon key={k} className={f.cls} points={f.d} />)}
          {v.lignes && v.lignes.map((l, k) => (
            <line key={k} className="axo-f" x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>
      ))}
    </svg>
  );
}

export default function CeQuOnFait() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = (FAIT[profil] || FAIT.pme)[lang] || (FAIT[profil] || FAIT.pme).fr;
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const el = racine.current;

    /* Le sol se trace, puis les volumes se posent dessus, un par un et de
       gauche à droite. C'est l'ordre dans lequel on construit vraiment. */
    el.querySelectorAll('.axo').forEach((svg, i) => {
      const lignes = svg.querySelectorAll('.axo__sol line, .axo__cadre');
      const vols = svg.querySelectorAll('.axo__v');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: svg.closest('.fait__item'), start: 'top 88%' },
        delay: i * 0.12,
      });
      tl.from(lignes, { opacity: 0, duration: 0.5, ease: 'none', stagger: 0.012 }, 0)
        .from(vols, { y: 5, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 }, 0.18);
    });

    gsap.from(el.querySelectorAll('.fait__nom, .fait__quoi'), {
      y: 16, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.05,
      scrollTrigger: { trigger: el.querySelector('.fait__rangee'), start: 'top 84%' },
    });
  }, { scope: racine, dependencies: [lang, profil] });

  return (
    <section className="fait" ref={racine} aria-labelledby="fait-t">
      <div className="container">
        <p className="fait__sur">{c.sur}</p>
        <h2 className="fait__titre" id="fait-t">{c.titre}</h2>

        <div className="fait__rangee">
          {c.items.map((it) => (
            <div className="fait__item" key={it.nom}>
              <span className="fait__dessin"><Figure nom={it.figure} /></span>
              <h3 className="fait__nom">{it.nom}</h3>
              <p className="fait__quoi">{it.quoi}</p>
            </div>
          ))}
        </div>

        <div className="fait__pied">
          <p>{c.pied}</p>
          <Link className="btn btn--ghost" to="/offres">
            {c.act}
            <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
