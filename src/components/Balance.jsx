import { useMemo, useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { projeterPave, PR } from '../lib/axo';

/* ════════════════════════════════════════════════════════════
   CE QUE ÇA COÛTE, CE QUE ÇA ÉVITE, CE QUE ÇA RAPPORTE.

   Le raisonnement, dessiné : à gauche un seul bloc, la mission ; à droite
   une pile, ce qu'elle vous évite (en corail) et ce qu'elle vous rapporte
   (en menthe). Les hauteurs ne sont pas des montants : elles disent où se
   trouve le poids. Ce qui coûte cher dans un projet, ce n'est presque
   jamais l'étude, ce sont les décisions prises sans elle.

   Les blocs tombent de haut, un par un, sur la pile, dans la même
   axonométrie que le reste du site.
   ════════════════════════════════════════════════════════════ */

const PILE = [
  { id: 'bail', sens: 'evite', t: 'Un bail, des travaux ou un stock engagés sur la mauvaise cible' },
  { id: 'soirs', sens: 'evite', t: 'Des semaines d’étude de marché faites seul, le soir' },
  { id: 'refus', sens: 'evite', t: 'Un dossier refusé, et des mois perdus' },
  { id: 'clients', sens: 'rapporte', t: 'Des clients mieux ciblés, qui achètent et reviennent' },
  { id: 'zone', sens: 'rapporte', t: 'Une zone de chalandise qui s’élargit, parce que vous savez où ils sont' },
];

const L = 5;
const P = 5;
const H = 1.35;

export default function Balance() {
  const racine = useRef(null);

  const geo = useMemo(() => {
    const cx = 9;
    const cy = P / 2;
    const mission = projeterPave({ x: 0, y: 0, w: L - 1.5, d: P - 1.5, z0: 0, z1: H }, 0, cx, cy);
    const blocs = PILE.map((b, i) => ({
      ...b,
      v: projeterPave({ x: 10, y: 0, w: L, d: P, z0: i * (H + 0.12), z1: i * (H + 0.12) + H }, 0, cx, cy),
    }));
    const sol = [[-2, -2], [18, -2], [18, P + 2], [-2, P + 2]].map(([x, y]) => PR(x - cx + cx, y, 0));
    /* L'étiquette se pose sur le sol, devant l'angle avant du bloc. */
    const [mx, my] = PR(L - 1.5, P - 1.5, 0);
    return { mission, blocs, sol, etiquetteMission: { x: mx, y: my + 1.4 } };
  }, []);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const tl = gsap.timeline({ scrollTrigger: { trigger: racine.current, start: 'top 78%' } });
    tl.from(q('.bal__mission'), { y: -14, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0)
      .from(q('.bal__bloc'), { y: -30, autoAlpha: 0, duration: 0.65, ease: 'bounce.out', stagger: 0.22 }, 0.3)
      .from(q('.bal__raison'), { z: -300, x: 20, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.22 }, 0.35);
  }, { scope: racine });

  return (
    <figure className="bal" ref={racine} data-soi>
      <svg className="bal__svg" viewBox="-8.4 -3 26.3 16" role="img" aria-label="Un seul bloc pour la mission, une pile de cinq blocs pour ce qu’elle évite et ce qu’elle rapporte.">
        <polygon className="bal__sol" points={geo.sol.map((p) => p.join(',')).join(' ')} />
        <g className="bal__mission">
          {geo.mission.faces.map((f, i) => <polygon key={i} className={f.cls} points={f.d} />)}
        </g>
        {geo.blocs.map((b) => (
          <g key={b.id} className={`bal__bloc bal__bloc--${b.sens}`}>
            {b.v.faces.map((f, i) => <polygon key={i} className={f.cls} points={f.d} />)}
          </g>
        ))}
        <text className="bal__etiquette" x={geo.etiquetteMission.x} y={geo.etiquetteMission.y} textAnchor="middle">La mission</text>
      </svg>
      <ol className="bal__raisons">
        {[...PILE].reverse().map((b) => (
          <li key={b.id} className={`bal__raison bal__raison--${b.sens}`}>
            <span className="bal__puce" aria-hidden="true" />
            <span>
              <strong>{b.sens === 'evite' ? 'Ça vous évite :' : 'Ça vous rapporte :'}</strong> {b.t}
            </span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
