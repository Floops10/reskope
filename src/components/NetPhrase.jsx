import { useRef, useMemo, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { layoutWord } from '../lib/netfont';

/* NetPhrase — une phrase = un RÉSEAU qui se forme parfaitement.
   Chaque MOT est un graphe (netfont : tracés identiques à la police Reskope),
   sur sa propre ligne, TOUS À LA MÊME TAILLE (hauteur de lettre uniforme via
   --np-max-aspect). Formation : le mot arrive en 3D (bas-gauche / bas-droite,
   alterné), ses nœuds surgissent (pop) et ses liens se câblent.

   Deux modes :
   - autonome (défaut) : formation déclenchée par ScrollTrigger ;
   - piloté (`active` fourni) : le parent décide (rail caméra HomeCinema) —
     true => formation, false => reset.
   reduced-motion / onglet caché : réseau déjà formé (statique). */
const PAD = 12;

function buildWord(word) {
  const { nodes, links, width, height } = layoutWord(word);
  const vbW = width + PAD * 2;
  const vbH = height + PAD * 2;
  return {
    nodes,
    links,
    paths: links.map(([a, b]) => `M${nodes[a][0]} ${nodes[a][1]} L${nodes[b][0]} ${nodes[b][1]}`),
    vb: `${-PAD} ${-PAD} ${vbW} ${vbH}`,
    aspect: vbW / vbH,
  };
}

/* Aspect (largeur/hauteur) du mot le plus large d'une phrase — sert à
   dimensionner toutes les phrases à la même taille de lettre. */
export function phraseAspect(text) {
  return Math.max(...text.split(' ').filter(Boolean).map((w) => buildWord(w).aspect));
}

export default function NetPhrase({ text, index = 0, maxAspect, active }) {
  const rootRef = useRef(null);
  const apiRef = useRef(null);
  const words = useMemo(() => text.split(' ').filter(Boolean).map(buildWord), [text]);
  const side = index % 2 === 0 ? -1 : 1; // pair = bas-gauche, impair = bas-droite
  const aspect = maxAspect || Math.max(...words.map((w) => w.aspect));
  const controlled = active !== undefined;

  useGSAP(() => {
    if (instant()) return;
    const root = rootRef.current;
    const wordEls = [...root.querySelectorAll('.netphrase__word')];

    const from3D = {
      autoAlpha: 0,
      yPercent: 66,
      xPercent: side * 32,
      rotationX: 52,
      rotationY: side * -30,
      scale: 0.92,
    };

    const groups = wordEls.map((wEl) => {
      const links = [...wEl.querySelectorAll('.np-link')];
      const nodes = [...wEl.querySelectorAll('.np-node')];
      links.forEach((l) => {
        const len = l.getTotalLength();
        l.style.strokeDasharray = `${len}`;
        l.style.strokeDashoffset = `${len}`;
      });
      gsap.set(nodes, { transformOrigin: '50% 50%', scale: 0, autoAlpha: 0 });
      gsap.set(wEl, {
        transformPerspective: 1200,
        transformOrigin: side < 0 ? 'left bottom' : 'right bottom',
        ...from3D,
      });
      return { wEl, links, nodes };
    });

    const play = () => {
      groups.forEach(({ wEl, links, nodes }, wi) => {
        gsap.killTweensOf([wEl, ...nodes, ...links]);
        const tl = gsap.timeline({ delay: wi * 0.08 });
        tl.to(wEl, {
          autoAlpha: 1, yPercent: 0, xPercent: 0, rotationX: 0, rotationY: 0, scale: 1,
          duration: 0.8, ease: 'power4.out',
        }, 0);
        tl.to(nodes, {
          scale: 1, autoAlpha: 1, duration: 0.34, ease: 'back.out(2)',
          stagger: { each: 0.006, from: 'random' },
        }, 0.08);
        tl.to(links, {
          strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut',
          stagger: { each: 0.006, from: 'start' },
        }, 0.18);
      });
    };

    /* Le réseau SE DÉFAIT (inverse exact de la formation) : les liens se
       décâblent, les nœuds s'éteignent en désordre, le mot repart en 3D. */
    const disassemble = () => {
      groups.forEach(({ wEl, links, nodes }, wi) => {
        gsap.killTweensOf([wEl, ...nodes, ...links]);
        const tl = gsap.timeline({ delay: wi * 0.05 });
        tl.to(links, {
          strokeDashoffset: (i, el) => el.getTotalLength(),
          duration: 0.26, ease: 'power1.in',
          stagger: { each: 0.004, from: 'end' },
        }, 0);
        tl.to(nodes, {
          scale: 0, autoAlpha: 0, duration: 0.28, ease: 'power2.in',
          stagger: { each: 0.004, from: 'random' },
        }, 0.06);
        tl.to(wEl, { ...from3D, duration: 0.45, ease: 'power2.in' }, 0.08);
      });
    };

    apiRef.current = { play, reset: disassemble };

    if (!controlled) {
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top 78%',
        onEnter: play,
        onLeaveBack: disassemble,
      });
      return () => { st.kill(); apiRef.current = null; };
    }

    return () => { apiRef.current = null; };
  }, { scope: rootRef, dependencies: [text] });

  /* Mode piloté : le parent bascule `active` */
  useEffect(() => {
    if (!controlled) return;
    const api = apiRef.current;
    if (!api) return;
    if (active) api.play();
    else api.reset();
  }, [active, controlled]);

  return (
    <div className="netphrase" ref={rootRef} aria-label={text} style={{ '--np-max-aspect': aspect.toFixed(3) }}>
      {words.map((w, wi) => (
        <div className="netphrase__word" key={wi}>
          <svg viewBox={w.vb} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g className="np-links">
              {w.paths.map((d, i) => <path key={i} className="np-link" d={d} />)}
            </g>
            <g className="np-nodes">
              {w.nodes.map(([x, y], i) => (
                <circle key={i} className="np-node" cx={x} cy={y} r="4.2" />
              ))}
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}
