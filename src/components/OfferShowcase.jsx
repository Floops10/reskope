import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { getLenis } from '../lib/smoothScroll';
import { useMediaQuery } from '../hooks/useMediaQuery';
import NetworkText from './NetworkText';

/* ============================================================
   OFFRES — vitrine en scroll horizontal pinné (agency-grade).
   Le stage se fige, 4 panneaux plein écran défilent latéralement
   au scroll (GSAP pin + scrub). Chaque offre porte un glyphe
   « réseau » 3D qui suit le curseur, un grand index, et le nom en
   NetworkText (lettres-nœuds réactives). Un effet de focus met le
   panneau central net et repousse les voisins. Constellation de
   progression cliquable en bas.
   Mobile / reduced-motion : pile verticale premium, lisible, statique.
   ============================================================ */

/* Glyphes réseau — un « graphe » distinct par offre, dans le langage
   nœuds/liens de la marque. Repère 0..100. */
const GLYPHS = [
  {
    // Audit — loupe / exploration : un cœur dense + une sonde
    nodes: [[38, 38], [58, 30], [66, 52], [50, 62], [34, 56], [30, 40], [78, 74], [88, 88]],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 3], [3, 6], [6, 7]],
    hub: 3,
  },
  {
    // Audit + Mise en œuvre — deux amas reliés : on identifie, on règle
    nodes: [[24, 34], [16, 56], [34, 62], [40, 44], [70, 40], [82, 30], [86, 56], [72, 64], [55, 52]],
    links: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [3, 8], [8, 4]],
    hub: 8,
  },
  {
    // Développement — cœur qui rayonne : on construit
    nodes: [[50, 50], [50, 20], [76, 34], [80, 64], [56, 82], [28, 74], [20, 42], [38, 26]],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [1, 7], [2, 3], [4, 5]],
    hub: 0,
  },
  {
    // Suivi — boucle continue : on reste dans la boucle
    nodes: [[50, 22], [72, 32], [80, 55], [66, 76], [40, 78], [22, 58], [28, 34], [50, 50]],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [7, 0], [7, 3]],
    hub: 7,
  },
];

function OfferGlyph({ glyph, index }) {
  return (
    <svg className="offer-show__glyph-svg" viewBox="0 0 100 100" aria-hidden="true">
      {/* anneaux orbitaux */}
      <circle className="offer-show__glyph-ring" cx="50" cy="50" r="46" />
      <circle className="offer-show__glyph-ring offer-show__glyph-ring--2" cx="50" cy="50" r="34" />
      <g className="offer-show__glyph-links">
        {glyph.links.map(([a, b], i) => (
          <line
            key={i}
            x1={glyph.nodes[a][0]} y1={glyph.nodes[a][1]}
            x2={glyph.nodes[b][0]} y2={glyph.nodes[b][1]}
            style={{ '--i': i }}
          />
        ))}
      </g>
      <g className="offer-show__glyph-nodes">
        {glyph.nodes.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y}
            r={i === glyph.hub ? 4.6 : 3}
            className={i === glyph.hub ? 'is-hub' : ''}
            style={{ '--i': i }}
          />
        ))}
      </g>
      <text className="offer-show__glyph-index" x="50" y="54">{String(index + 1).padStart(2, '0')}</text>
    </svg>
  );
}

export default function OfferShowcase({ offers, badge }) {
  const isDesktop = useMediaQuery('(min-width: 981px)');
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const panelRefs = useRef([]);
  const glyphRefs = useRef([]);
  const dotRefs = useRef([]);
  const progressRef = useRef(null);
  const startScrollRef = useRef(0);
  const pinDistRef = useRef(0);

  /* — Scroll horizontal pinné + focus dynamique (desktop only) — */
  useGSAP(() => {
    if (!isDesktop || instant()) return;
    const root = rootRef.current;
    const track = trackRef.current;
    const panels = panelRefs.current.filter(Boolean);
    if (!track || !panels.length) return;

    const getDist = () => track.scrollWidth - window.innerWidth;

    const tween = gsap.to(track, {
      x: () => -getDist(),
      ease: 'none',
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => '+=' + getDist(),
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          startScrollRef.current = self.start;
          pinDistRef.current = self.end - self.start;
        },
      },
    });

    /* Focus : le panneau au centre est net (échelle 1, opacité 1),
       les voisins reculent — lu en rAF depuis la position réelle. */
    let raf;
    const cx = () => window.innerWidth / 2;
    const render = () => {
      const center = cx();
      let best = 0, bestDist = Infinity;
      panels.forEach((panel, i) => {
        const r = panel.getBoundingClientRect();
        const pc = r.left + r.width / 2;
        const dist = Math.abs(pc - center);
        const norm = Math.min(dist / window.innerWidth, 1);
        const scale = 1 - norm * 0.14;
        const opacity = 1 - norm * 0.72;
        const inner = panel.querySelector('.offer-show__inner');
        if (inner) {
          inner.style.opacity = opacity.toFixed(3);
          inner.style.transform = `scale(${scale.toFixed(3)})`;
        }
        // parallaxe du glyphe (profondeur)
        const glyph = glyphRefs.current[i];
        if (glyph) glyph.style.setProperty('--par', `${(pc - center) * 0.04}px`);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      // dots + ligne de progression
      dotRefs.current.forEach((d, i) => d && d.classList.toggle('is-active', i === best));
      if (progressRef.current) {
        const p = pinDistRef.current
          ? Math.min(Math.max((window.scrollY - startScrollRef.current) / pinDistRef.current, 0), 1)
          : 0;
        progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => { cancelAnimationFrame(raf); tween.scrollTrigger?.kill(); tween.kill(); };
  }, { scope: rootRef, dependencies: [isDesktop] });

  /* — Tilt 3D des glyphes selon le curseur — */
  useEffect(() => {
    if (!isDesktop || instant()) return;
    const root = rootRef.current;
    if (!root) return;
    let mx = 0, my = 0, raf;
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const tick = () => {
      glyphRefs.current.forEach((g) => {
        if (!g) return;
        g.style.setProperty('--rx', `${(-my * 14).toFixed(2)}deg`);
        g.style.setProperty('--ry', `${(mx * 18).toFixed(2)}deg`);
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, [isDesktop]);

  const goToPanel = (i) => {
    const target = startScrollRef.current + (pinDistRef.current * i) / Math.max(offers.length - 1, 1);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.1 });
    else window.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <section className={`offer-show${isDesktop ? '' : ' offer-show--stack'}`} ref={rootRef} data-cursor-dark>
      <div className="offer-show__track" ref={trackRef}>
        {offers.map((o, i) => (
          <article
            className={`offer-show__panel${o.featured ? ' is-featured' : ''}`}
            key={o.id}
            ref={(el) => { panelRefs.current[i] = el; }}
          >
            <div className="offer-show__inner">
              <div className="offer-show__lead">
                <span className="offer-show__index">{String(i + 1).padStart(2, '0')}</span>
                <span className="offer-show__count">/ {String(offers.length).padStart(2, '0')}</span>
                {o.featured && <span className="offer-show__ribbon">{badge}</span>}
              </div>

              <div className="offer-show__body">
                <p className="offer-show__eyebrow">Offre</p>
                <h3 className="offer-show__name">
                  <NetworkText as="span" text={o.name} radius={90} hot="#ffffff" />
                </h3>
                <p className="offer-show__tagline">{o.tagline}</p>
                <p className="offer-show__detail">{o.detail}</p>

                <ul className="offer-show__features">
                  {o.features.slice(0, 5).map((f) => (
                    <li key={f}><span className="offer-show__feat-node" aria-hidden="true" />{f}</li>
                  ))}
                </ul>

                <Link to="/contact" className="btn btn--on-dark offer-show__cta" data-cursor-label={o.cta}>
                  {o.cta}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
              </div>

              <div className="offer-show__glyph" ref={(el) => { glyphRefs.current[i] = el; }}>
                <OfferGlyph glyph={GLYPHS[i % GLYPHS.length]} index={i} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {isDesktop && (
        <div className="offer-show__nav" aria-hidden="true">
          <div className="offer-show__progress"><span ref={progressRef} /></div>
          <div className="offer-show__dots">
            {offers.map((o, i) => (
              <button
                key={o.id}
                type="button"
                className="offer-show__dot"
                ref={(el) => { dotRefs.current[i] = el; }}
                onClick={() => goToPanel(i)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
              </button>
            ))}
          </div>
          <span className="offer-show__hint">Faites défiler</span>
        </div>
      )}
    </section>
  );
}
