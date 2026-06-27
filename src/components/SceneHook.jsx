import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { R_NODES, R_LINKS } from './Logo';

/* SCENE 01 — HOOK. Le pitch en mouvement : désordre → ordre.
   Stage STICKY (robuste) + scrub GSAP. Au scroll : le réseau dispersé
   (outils éparpillés) se réorganise et forme le R (le système remis en
   ordre), pendant que le texte passe du PROBLÈME → l'ACTION (on cartographie,
   on relie, on simplifie) → la CONSTRUCTION. Profondeur : texte / réseau /
   fond à vitesses différentes. Desktop uniquement (mobile = HeroCompact).
   instant() / reduced-motion => statique lisible (géré aussi en CSS). */

const HUB = 3;
function scatter(i) {
  const a = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  const b = Math.sin(i * 78.233 + 1.7) * 12543.197;
  return [(a - Math.floor(a) - 0.5) * 120, (b - Math.floor(b) - 0.5) * 120];
}

export default function SceneHook({ c }) {
  const sceneRef = useRef(null);
  const eyebrowRef = useRef(null);
  const m1Ref = useRef(null);
  const m2Ref = useRef(null);
  const m3Ref = useRef(null);
  const netRef = useRef(null);
  const bgRef = useRef(null);
  const cueRef = useRef(null);

  useGSAP(
    () => {
      if (instant()) return;
      const root = sceneRef.current;
      const nodes = root.querySelectorAll('.sh-node');
      const links = root.querySelectorAll('.sh-link');

      links.forEach((l) => {
        const len = l.getTotalLength();
        l.style.strokeDasharray = `${len}`;
        l.style.strokeDashoffset = `${len}`;
      });

      const mm = gsap.matchMedia();

      mm.add('(min-width: 881px)', () => {
        // état initial : réseau dispersé (le désordre)
        nodes.forEach((n, i) => {
          const [sx, sy] = scatter(i);
          gsap.set(n, { x: sx, y: sy, opacity: 0 });
        });

        // entrée au chargement : eyebrow + problème + nœuds qui surgissent
        gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .from(eyebrowRef.current, { y: 22, autoAlpha: 0, duration: 0.7 }, 0.1)
          .from(m1Ref.current, { y: 28, autoAlpha: 0, duration: 1 }, 0.22)
          .to(nodes, { opacity: 1, duration: 0.9, stagger: 0.03 }, 0.2)
          .from(cueRef.current, { autoAlpha: 0, y: -8, duration: 0.6 }, 0.7);

        // scène scrubbée : le réseau s'ordonne, le récit avance
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        tl.to(nodes, { x: 0, y: 0, ease: 'none', duration: 0.85, stagger: { each: 0.012 } }, 0)
          .to(links, { strokeDashoffset: 0, ease: 'none', duration: 0.8, stagger: 0.012 }, 0.06)
          .to(netRef.current, { yPercent: -7, ease: 'none', duration: 1 }, 0)
          .to(bgRef.current, { yPercent: 16, ease: 'none', duration: 1 }, 0)
          .to(m1Ref.current, { autoAlpha: 0, yPercent: -12, ease: 'power2.in', duration: 0.16 }, 0.26)
          .fromTo(
            m2Ref.current,
            { autoAlpha: 0, yPercent: 14 },
            { autoAlpha: 1, yPercent: 0, ease: 'power3.out', duration: 0.2 },
            0.3
          )
          .to(m2Ref.current, { autoAlpha: 0, yPercent: -12, ease: 'power2.in', duration: 0.16 }, 0.56)
          .fromTo(
            m3Ref.current,
            { autoAlpha: 0, yPercent: 14 },
            { autoAlpha: 1, yPercent: 0, ease: 'power3.out', duration: 0.2 },
            0.6
          );

        // repère scroll : s'efface dès qu'on amorce la descente
        gsap.to(cueRef.current, {
          autoAlpha: 0,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: '12% top', scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: sceneRef }
  );

  return (
    <section className="scene scene--hook" ref={sceneRef} id="top">
      <div className="scene__stage">
        <div className="scene__bg" aria-hidden="true" ref={bgRef} />
        <div className="container scene__inner">
          <div className="scene__copy">
            <p className="eyebrow" ref={eyebrowRef}>{c.eyebrow}</p>
            <div className="scene__moments">
              <h1 className="display scene__moment scene__moment--1" ref={m1Ref}>{c.heroTitle}</h1>
              <p className="display scene__moment scene__moment--2" ref={m2Ref}>{c.moment2}</p>
              <p className="display scene__moment scene__moment--3" ref={m3Ref}>{c.moment3}</p>
            </div>
          </div>
          <div className="scene__net" aria-hidden="true" ref={netRef}>
            <svg viewBox="16 10 108 132" fill="none">
              <g>
                {R_LINKS.map(([a, b], i) => (
                  <line
                    key={i}
                    className="sh-link"
                    x1={R_NODES[a][0]}
                    y1={R_NODES[a][1]}
                    x2={R_NODES[b][0]}
                    y2={R_NODES[b][1]}
                  />
                ))}
              </g>
              <g>
                {R_NODES.map(([x, y], i) => (
                  <circle key={i} className="sh-node" cx={x} cy={y} r={i === HUB ? 5.5 : 4.5} />
                ))}
              </g>
            </svg>
          </div>
        </div>
        <div className="scene__cue" ref={cueRef} aria-hidden="true">
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}
