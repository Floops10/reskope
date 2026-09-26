import { useLayoutEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   VOTRE BUSINESS PLAN, EN ENTIER — ce qu'il couvre, et dans quel ordre.

   Un business plan n'est pas un tableur : c'est un client, une offre, des
   chiffres, une marque et un plan pour les premiers clients, qui se tiennent
   les uns les autres. Au centre, le dossier ; autour, ses cinq parties, chacune
   dans sa couleur d'explication, avec la personne qui la mène. Les liens
   disent les dépendances : le client fixe l'offre, l'offre fixe les chiffres,
   le portrait fonde la marque.

   Les parties sont posées par une grille (le texte a toujours sa place, à
   toutes les largeurs) ; les traits sont tirés ensuite entre les nœuds
   réellement affichés, et retirés à chaque changement de taille. Un influx
   parcourt la chaîne en continu : on voit dans quel sens le travail avance.
   ════════════════════════════════════════════════════════════ */

const PARTIES = [
  { id: 'client', nom: 'Votre client idéal', dit: 'Qui il est, où le trouver, quoi lui dire', mene: 'Florian mène', couleur: 'soleil', cote: 'gauche' },
  { id: 'offre', nom: 'Votre offre et votre prix', dit: 'Justifiés par ce que vos clients ont dit', mene: 'À deux', couleur: 'menthe', cote: 'droite' },
  { id: 'chiffres', nom: 'Vos chiffres et votre financement', dit: 'Un prévisionnel dont chaque chiffre a sa source', mene: 'Thomy mène', couleur: 'ciel', cote: 'droite' },
  { id: 'marque', nom: 'Votre marque et votre communication', dit: 'Le cadre, des maquettes de logo, quoi dire et où', mene: 'Thomy mène', couleur: 'corail', cote: 'gauche' },
  { id: 'premiers', nom: 'Vos premiers clients', dit: 'Le plan pour aller les chercher, semaine par semaine', mene: 'Florian mène', couleur: 'lilas', cote: 'bas' },
];
/* Les dépendances : de ce qui décide vers ce qui en découle. */
const CHAINE = [['client', 'offre'], ['offre', 'chiffres'], ['client', 'marque'], ['marque', 'premiers'], ['chiffres', 'premiers']];

export default function ReseauBP() {
  const racine = useRef(null);
  const scene = useRef(null);
  const [plan, setPlan] = useState(null);

  /* Mesure : le centre de chaque nœud, dans le repère de la scène. On lit
     les positions de mise en page (offsetLeft, offsetTop) et pas les
     boîtes affichées : pendant leur arrivée, les parties sont basculées en
     profondeur, et les traits doivent viser leur place finale. */
  useLayoutEffect(() => {
    const el = scene.current;
    if (!el) return undefined;
    let image = 0;
    const centre = (n) => {
      let x = n.offsetWidth / 2;
      let y = n.offsetHeight / 2;
      for (let e = n; e && e !== el; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; }
      return [x, y];
    };
    const mesurer = () => {
      cancelAnimationFrame(image);
      image = requestAnimationFrame(() => {
        if (!el.clientWidth) return;
        const pts = {};
        el.querySelectorAll('[data-noeud]').forEach((n) => { pts[n.dataset.noeud] = centre(n); });
        setPlan({ w: el.clientWidth, h: el.clientHeight, pts });
      });
    };
    mesurer();
    const ro = new ResizeObserver(mesurer);
    ro.observe(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(mesurer);
    return () => { ro.disconnect(); cancelAnimationFrame(image); };
  }, []);

  const pret = Boolean(plan);

  useGSAP(() => {
    if (!pret || instant()) return;
    const q = gsap.utils.selector(racine);
    const tl = gsap.timeline({ scrollTrigger: { trigger: racine.current, start: 'top 78%' } });
    tl.from(q('.rbp__coeur'), { z: -600, scale: 0.4, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.6)' }, 0)
      .fromTo(q('.rbp__rayon'), { attr: { 'stroke-dashoffset': 1 } }, { attr: { 'stroke-dashoffset': 0 }, duration: 0.8, ease: 'power3.out', stagger: 0.08 }, 0.3)
      .from(q('.rbp__partie'), { z: -480, y: 30, rotateX: -20, autoAlpha: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1 }, 0.4)
      .from(q('.rbp__dep'), { autoAlpha: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 1);
    /* L'influx : un trait court qui suit la chaîne, sans fin. */
    q('.rbp__influx').forEach((c, i) => {
      gsap.fromTo(c, { attr: { 'stroke-dashoffset': 0 } }, {
        attr: { 'stroke-dashoffset': -100 }, duration: 3.2, ease: 'none', repeat: -1, delay: 1.4 + i * 0.35,
      });
    });
  }, { scope: racine, dependencies: [pret] });

  const p = plan ? plan.pts : {};
  const coeur = p.coeur;

  return (
    <figure className="rbp" ref={racine} data-soi>
      <div className="rbp__scene" ref={scene}>
        {plan && coeur && (
          <svg className="rbp__traits" viewBox={`0 0 ${plan.w} ${plan.h}`} aria-hidden="true">
            {PARTIES.filter((x) => p[x.id]).map((x) => (
              <line
                key={x.id}
                className={`rbp__rayon pl-c--${x.couleur}`}
                x1={coeur[0]} y1={coeur[1]} x2={p[x.id][0]} y2={p[x.id][1]}
                pathLength="1"
              />
            ))}
            {CHAINE.filter(([a, b]) => p[a] && p[b]).map(([a, b]) => (
              <g key={`${a}-${b}`}>
                <line className="rbp__dep" x1={p[a][0]} y1={p[a][1]} x2={p[b][0]} y2={p[b][1]} />
                <line className="rbp__influx" x1={p[a][0]} y1={p[a][1]} x2={p[b][0]} y2={p[b][1]} pathLength="100" />
              </g>
            ))}
          </svg>
        )}
        <div className="rbp__coeur" data-noeud="coeur">
          <span>Votre business plan</span>
        </div>
        <ul className="rbp__liste">
          {PARTIES.map((x) => (
            <li key={x.id} className={`rbp__partie rbp--${x.cote} rbp__partie--${x.id}`}>
              <span className={`rbp__noeud pl-c--${x.couleur}`} data-noeud={x.id} aria-hidden="true" />
              <span className="rbp__texte">
                <span className="rbp__nom">{x.nom}</span>
                <span className="rbp__dit">{x.dit}</span>
                <span className="rbp__mene">{x.mene}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="rbp__legende">
        Les liens disent l’ordre : votre client fixe votre offre, votre offre fixe vos chiffres, et son portrait fonde
        votre marque.
      </figcaption>
    </figure>
  );
}
