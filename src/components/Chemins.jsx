import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { PORTES } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   LES CHEMINS — « laquelle de ces situations vous ressemble ? »

   C'est le vrai point d'entrée du site. Le visiteur ne choisit pas une
   offre dans un menu : il reconnaît sa phrase. Chacune est écrite dans ses
   mots, et mène à la page qui lui répond.

   La question tient à gauche pendant que les situations montent une par
   une, de la profondeur, à droite. Le « et / ou » dit qu'on peut être dans
   plusieurs à la fois : c'est souvent le cas.

   Chaque situation porte un nœud : en fil de fer au repos, plein quand on
   s'y arrête. C'est la même convention que les volumes du site, où plein
   veut dire « vérifié », et ici « c'est moi ».
   ════════════════════════════════════════════════════════════ */

export default function Chemins({
  question = 'Laquelle de ces situations vous ressemble ?',
  fin = 'Aucune ne vous ressemble tout à fait ? Racontez-nous la vôtre.',
  finLien = 'Parlons de votre situation',
}) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);

    gsap.from(q('.ch__q'), {
      z: -760, y: 54, rotateX: -34, autoAlpha: 0,
      duration: 1.05, ease: 'power3.out',
      scrollTrigger: { trigger: racine.current, start: 'top 78%' },
    });

    /* Chaque situation attend son tour de défilement. */
    q('.ch__item').forEach((el, i) => {
      const lien = el.querySelector('.ch__et');
      const corps = el.querySelector('.ch__corps');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
      });
      if (lien) tl.from(lien, { z: -260, autoAlpha: 0, y: 18, duration: 0.5, ease: 'power2.out' }, 0);
      tl.from(corps, {
        z: -640 - i * 90, y: 64, x: (i % 2 ? 1 : -1) * 34, rotateX: -32, rotateZ: (i % 2 ? 1 : -1) * 4,
        autoAlpha: 0, duration: 1, ease: 'power3.out',
      }, lien ? 0.14 : 0);
    });

    gsap.from(q('.ch__fin'), {
      z: -520, y: 44, rotateX: -24, autoAlpha: 0, duration: 0.95, ease: 'power3.out',
      scrollTrigger: { trigger: q('.ch__fin')[0], start: 'top 90%' },
    });
  }, { scope: racine });

  return (
    <section className="ch" ref={racine} aria-labelledby="ch-q">
      <div className="container ch__in">
        <div className="ch__ask">
          <h2 className="ch__q" id="ch-q">{question}</h2>
        </div>

        <div className="ch__cases">
          <ul className="ch__list">
            {PORTES.map((p, i) => (
              <li className="ch__item" key={p.id}>
                {i > 0 && <span className="ch__et" aria-hidden="true">et / ou</span>}
                <Link to={p.slug} className="ch__corps" data-cursor-label="Voir">
                  <span className="ch__noeud" aria-hidden="true" />
                  <span className="ch__voix">« {p.amorce} »</span>
                  <span className="ch__nom">
                    {p.nom}
                    <span className="ch__fleche" aria-hidden="true">→</span>
                  </span>
                  <span className="ch__faits">{p.faits.duree} · {p.faits.temps} de votre temps</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="ch__fin">
            {fin}{' '}
            <Link to="/contact" className="ch__finlien">
              {finLien}
              <span aria-hidden="true"> →</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
