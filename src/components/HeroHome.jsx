import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { R_NODES, R_LINKS, R_SCATTER } from './Logo';
import HeroNetwork from './HeroNetwork';
import FloatingNet3D from './FloatingNet3D';
import NetPhrase, { phraseAspect } from './NetPhrase';
import SwapLabel from './SwapLabel';
import Marked from './Marked';
import Tilt from './Tilt';
import { Reveal, RevealItem } from './Reveal';

const HUB = 3;

/* HERO — layout « volet » (gauche qui défile, R figé à droite), DA épurée.
   GAUCHE : récit qui défile — accroche centrée, deux paragraphes (hover 3D),
   ligne de bascule + CTA. DROITE : le « R » se FORME vite puis fait un TOUR
   360° sur lui-même en 3D (façon Noomo). Fond : réseau vivant discret + grain,
   fixés derrière ; le curseur REPOUSSE le réseau. */
export default function HeroHome({ c }) {
  const heroRef = useRef(null);
  const sceneRef = useRef(null);
  const titleRef = useRef(null);
  const rWrapRef = useRef(null);
  const rSvgRef = useRef(null);

  const maxAspect = useMemo(
    () => Math.max(...c.offerings.map((o) => phraseAspect(o.title))),
    [c.offerings]
  );

  /* Accroche : révélation masquée ligne par ligne à l'ouverture */
  useGSAP(() => {
    if (instant()) return;
    if (!window.matchMedia('(min-width: 881px)').matches) return;
    let split = null;
    try {
      split = new SplitText(titleRef.current, { type: 'lines', mask: 'lines', linesClass: 'hero2p__tline' });
    } catch { split = null; }
    if (split) {
      gsap.from(split.lines, {
        yPercent: 120, duration: 1.15, ease: 'power4.out', stagger: 0.12, delay: 0.2,
      });
    }
    return () => split?.revert();
  }, { scope: heroRef });

  /* R : formation rapide (nœuds convergent + liens se tracent) PUIS tour à
     360° sur l'axe Y en 3D, piloté par le scroll du hero. */
  useGSAP(() => {
    if (instant()) return;
    if (!window.matchMedia('(min-width: 881px)').matches) return;
    const svg = rSvgRef.current;
    const nodes = svg.querySelectorAll('.r-node');
    const links = svg.querySelectorAll('.r-link');

    links.forEach((l) => {
      const len = l.getTotalLength();
      l.style.strokeDasharray = `${len}`;
      l.style.strokeDashoffset = `${len}`;
    });
    nodes.forEach((n, i) => {
      gsap.set(n, { x: R_SCATTER[i][0] - R_NODES[i][0], y: R_SCATTER[i][1] - R_NODES[i][1], opacity: 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sceneRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        invalidateOnRefresh: true,
      },
    });
    // Formation RAPIDE (premier ~20 % du scroll)
    tl.to(nodes, { opacity: 1, duration: 0.03, stagger: 0.004 }, 0);
    tl.to(nodes, { x: 0, y: 0, ease: 'power3.inOut', duration: 0.17, stagger: 0.008 }, 0.02);
    tl.to(links, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.14, stagger: 0.008 }, 0.08);
    // Puis TOUR à 360° sur lui-même
    tl.to(rWrapRef.current, { rotationY: 360, ease: 'power1.inOut', duration: 0.6 }, 0.28);
  }, { scope: heroRef });

  return (
    <header className="hero-home" ref={heroRef} id="top">
      <section className="hero2p" ref={sceneRef}>
        {/* Fond fixe : réseau vivant (réagit au curseur) + objets réseau 3D flottants + grain */}
        <div className="hero2p__bg" aria-hidden="true">
          <HeroNetwork />
          <FloatingNet3D className="fnet--a" points={15} size={190} speed={0.9} tiltX={0.35} />
          <FloatingNet3D className="fnet--b" points={11} size={124} speed={1.35} tiltX={0.6} />
          <FloatingNet3D className="fnet--c" points={19} size={150} speed={0.65} tiltX={0.2} />
          <div className="hero2__grain" />
          <div className="hero2p__cue">
            <span>Scroll</span>
            <i />
          </div>
        </div>

        <div className="container hero2p__grid">
          {/* GAUCHE : le récit qui défile */}
          <div className="hero2p__scroller">
            <div className="hero2p__step hero2p__step--intro">
              <h1 className="hero2p__title" ref={titleRef}>{c.heroTitle}</h1>
            </div>

            <Reveal className="hero2p__step" amount={0.5}>
              <RevealItem>
                <Tilt className="hero2p__line-tilt">
                  <p className="hero2p__line">
                    <Marked text={c.line1} word={c.mark1} />
                  </p>
                </Tilt>
              </RevealItem>
            </Reveal>

            <Reveal className="hero2p__step" amount={0.5}>
              <RevealItem>
                <Tilt className="hero2p__line-tilt">
                  <p className="hero2p__line">
                    <Marked text={c.line2} word={c.mark2} />
                  </p>
                </Tilt>
              </RevealItem>
            </Reveal>

            <Reveal className="hero2p__step hero2p__step--final" amount={0.4}>
              <RevealItem as="p" className="hero2p__closing">{c.closing}</RevealItem>
              <RevealItem>
                <div className="hero2p__actions">
                  <Link to="/contact" className="btn btn--primary" data-cursor-label="Y aller">
                    <SwapLabel>{c.primary}</SwapLabel>
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </Link>
                  <Link to="/pourquoi" className="btn btn--ghost">
                    <SwapLabel>{c.ghost}</SwapLabel>
                  </Link>
                </div>
              </RevealItem>
            </Reveal>
          </div>

          {/* DROITE : figée — le R se forme puis tourne */}
          <div className="hero2p__sticky" aria-hidden="true">
            <div className="hero2p__r" ref={rWrapRef}>
              <svg className="hero2p__r-svg" ref={rSvgRef} viewBox="0 0 132 150" fill="none">
                <g>
                  {R_LINKS.map(([a, b], i) => (
                    <line key={i} className="r-link"
                      x1={R_NODES[a][0]} y1={R_NODES[a][1]}
                      x2={R_NODES[b][0]} y2={R_NODES[b][1]} />
                  ))}
                </g>
                <g>
                  {R_NODES.map(([x, y], i) => (
                    <circle key={i} className="r-node" cx={x} cy={y} r={i === HUB ? 7 : 5.5} />
                  ))}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Offres : titre RÉSEAU (se forme) + sous-titre ── */}
      {c.offerings.map((o, i) => (
        <section key={i} className="netphrase-section">
          <div className="container">
            <NetPhrase text={o.title} index={i} maxAspect={maxAspect} />
            <p className="netphrase__sub">{o.sub}</p>
          </div>
        </section>
      ))}

    </header>
  );
}
