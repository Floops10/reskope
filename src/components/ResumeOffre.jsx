import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP, SplitText } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { RESUME } from '../data/profils';

/* ============================================================
   LE RÉSUMÉ DE FIN — ce qu'on vend, en quatre lignes.

   Il remplace le panneau qui se remplissait en marge pendant la
   traversée. Celui-là passait par-dessus les titres, et un sommaire qui
   s'accumule sur le côté se reconnaît au premier coup d'œil.

   Ici : pas de cartes, pas de grille. Quatre lignes pleine largeur, du
   gros caractère, et le prix aligné à droite. C'est la mise en page d'un
   sommaire d'édition, pas d'un tableau comparatif — et c'est la seule
   endroit de l'accueil où un prix apparaît, ce qui est voulu : quelqu'un
   qui vient de regarder toute la traversée se demande combien ça coûte.

   Chaque ligne est un lien : la survoler la remplit d'indigo et fait
   glisser son nom. L'état n'est pas une bordure qui s'allume, c'est la
   ligne entière qui bascule — on sait où on pointe même du coin de l'œil.
   ============================================================ */
export default function ResumeOffre() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = (RESUME[profil] || RESUME.pme)[lang] || (RESUME[profil] || RESUME.pme).fr;
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const el = racine.current;
    const lignes = el.querySelectorAll('.rsm__l');

    /* Chaque ligne monte derrière son propre masque, l'une après
       l'autre. C'est le geste des engagements de la page « à propos » :
       le site a déjà ce vocabulaire, autant le parler. */
    lignes.forEach((l, i) => {
      gsap.from(l.querySelector('.rsm__in'), {
        yPercent: 108, duration: 0.85, ease: 'power4.out',
        scrollTrigger: { trigger: l, start: 'top 90%' },
        delay: i * 0.04,
      });
    });

    const titre = el.querySelector('.rsm__label');
    if (!titre) return undefined;
    let sp = null;
    try {
      sp = new SplitText(titre, { type: 'chars' });
      gsap.from(sp.chars, {
        autoAlpha: 0, duration: 0.5, ease: 'power2.out', stagger: 0.022,
        scrollTrigger: { trigger: el, start: 'top 84%' },
      });
    } catch { /* la police n'est pas prête : le titre reste net, c'est tout */ }
    return () => sp?.revert();
  }, { scope: racine, dependencies: [lang, profil] });

  return (
    <section className="rsm" ref={racine} aria-labelledby="rsm-t">
      <div className="container">
        <h2 className="rsm__label" id="rsm-t">{c.label}</h2>
      </div>

      <div className="rsm__liste">
        {c.lignes.map((l, i) => (
          <Link className="rsm__l" to="/offres" key={l.nom}>
            <span className="rsm__in">
              <span className="container rsm__row">
                <span className="rsm__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="rsm__txt">
                  <span className="rsm__nom">{l.nom}</span>
                  <span className="rsm__quoi">{l.quoi}</span>
                </span>
                <span className="rsm__meta">
                  <span className="rsm__duree">{l.duree}</span>
                  <span className="rsm__prix">{l.prix}</span>
                </span>
                <span className="rsm__fleche" aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="container rsm__pied">
        <p>{c.pied}</p>
        <Link className="rsm__cta" to="/offres">
          {c.cta}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
