import { useRef, useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { GLYPH_SHAPES, buildR3D } from '../lib/net3d';

/* reduced-motion SEUL donne la pile statique (jamais la largeur d'écran ni
   document.hidden : la traversée joue aussi sur téléphone). */
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
import Net3D from './Net3D';
import NetPhrase, { phraseAspect } from './NetPhrase';
import SwapLabel from './SwapLabel';
import Marked from './Marked';
import HeroNetwork from './HeroNetwork';

/* ============================================================
   CAMERA RIDE — la traversée 3D (après le hero-formation).
   Chaque scène a SA PROPRE chorégraphie : certaines émergent de la
   profondeur, d'autres entrent par le côté (pan caméra), par le bas
   (contre-plongée), par le haut (plongée), avec du roulis — et les
   transitions se CHEVAUCHENT : pendant qu'une scène s'échappe, la
   suivante est déjà en train d'arriver. Autour : poussière de
   profondeur + les 4 glyphes de marque en VRAI volume (Net3D) qui
   tournent sur eux-mêmes en traversant le champ. Le curseur oriente
   la caméra. Scènes : 0 constat · 1 réponse · 2 bascule+CTA ·
   3-6 offres (titres-réseau) · 7 signature (R 3D, reste au point).
   Mobile / reduced-motion / onglet caché : pile statique lisible.
   ============================================================ */

const SCENES = 8;

/* Chorégraphies : in = d'où la scène arrive · out = comment elle s'échappe */
const CHOREO = [
  { in: { z: -1300, yPercent: 10, rotationX: 8, blur: 10 },  out: { xPercent: -72, rotationY: 30, z: 240, blur: 8 } },
  { in: { xPercent: 64, rotationY: -28, z: -420, blur: 8 },  out: { yPercent: -78, rotationX: 32, z: 200, blur: 8 } },
  { in: { z: -1500, blur: 12 },                              out: { z: 980, blur: 4 } },
  { in: { yPercent: 70, rotationX: -26, z: -380, blur: 8 },  out: { xPercent: 58, rotationY: -24, rotationZ: -10, z: 220, blur: 8 } },
  { in: { xPercent: -64, rotationY: 26, z: -420, blur: 8 },  out: { z: 900, rotationZ: 6, blur: 6 } },
  { in: { z: -1200, rotationZ: 8, blur: 10 },                out: { yPercent: 74, rotationX: -30, z: 200, blur: 8 } },
  { in: { yPercent: -70, rotationX: 26, z: -380, blur: 8 },  out: { xPercent: 70, rotationY: -30, z: 240, blur: 8 } },
  { in: { z: -1400, blur: 10 },                              out: null },
];

const NEUTRAL = {
  z: 0, xPercent: 0, yPercent: 0,
  rotationX: 0, rotationY: 0, rotationZ: 0,
  autoAlpha: 1, filter: 'blur(0px)',
};

/* Convertit une entrée CHOREO en état GSAP complet */
function st({ blur = 0, ...rest }) {
  return {
    z: 0, xPercent: 0, yPercent: 0, rotationX: 0, rotationY: 0, rotationZ: 0,
    autoAlpha: 0, filter: `blur(${blur}px)`,
    ...rest,
  };
}

/* Poussière de profondeur (positions déterministes) */
function makeDust(n) {
  const rnd = (i, s) => {
    const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  return Array.from({ length: n }, (_, i) => ({
    left: 4 + rnd(i, 1) * 92,
    top: 6 + rnd(i, 2) * 88,
    size: 1.5 + rnd(i, 3) * 2.6,
    depth: rnd(i, 4),
  }));
}

export default function HomeCinema({ c }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const camScrollRef = useRef(null);
  const sceneRefs = useRef([]);
  const dustRefs = useRef([]);
  const iconRefs = useRef([]);
  const progressRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [staticMode, setStaticMode] = useState(false);

  const dust = useMemo(() => makeDust(26), []);
  const rShape = useMemo(() => buildR3D(14, 0.6), []);
  const maxAspect = useMemo(
    () => Math.max(...c.offerings.map((o) => phraseAspect(o.title))),
    [c.offerings]
  );

  useGSAP(() => {
    if (prefersReduced()) {
      setStaticMode(true);
      return;
    }
    const scenes = sceneRefs.current.filter(Boolean);
    if (scenes.length !== SCENES) return;

    scenes.forEach((sc, i) => gsap.set(sc, st(CHOREO[i].in)));

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top top',
        end: () => '+=' + SCENES * window.innerHeight,
        pin: stageRef.current,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (progressRef.current) {
            progressRef.current.style.transform = `scaleY(${self.progress.toFixed(4)})`;
          }
          const idx = Math.min(SCENES - 1, Math.floor(self.progress * SCENES + 0.3));
          setActiveIdx((cur) => (cur === idx ? cur : idx));
        },
      },
    });

    /* Scènes : arrivée fluide, sortie qui CHEVAUCHE l'arrivée suivante */
    scenes.forEach((sc, i) => {
      const t0 = i;
      tl.to(sc, { ...NEUTRAL, duration: 0.6, ease: 'power3.out' }, t0);
      if (CHOREO[i].out) {
        tl.to(sc, {
          ...st({ ...CHOREO[i].out }),
          duration: 0.58, ease: 'power3.in',
        }, t0 + 0.72);
      }
    });

    /* La caméra dérive en continu (pan/tilt/dolly), jamais figée */
    tl.to(camScrollRef.current, {
      keyframes: [
        { rotationY: -5, rotationX: 2, z: 30, duration: 1, ease: 'power1.inOut' },
        { rotationY: 4, rotationX: -2, z: -20, duration: 1, ease: 'power1.inOut' },
        { rotationY: -3, rotationX: 3, z: 40, duration: 1, ease: 'power1.inOut' },
        { rotationY: 5, rotationX: -3, z: -10, duration: 1, ease: 'power1.inOut' },
        { rotationY: -4, rotationX: 2, z: 30, duration: 1, ease: 'power1.inOut' },
        { rotationY: 3, rotationX: -2, z: -25, duration: 1, ease: 'power1.inOut' },
        { rotationY: -5, rotationX: 3, z: 20, duration: 1, ease: 'power1.inOut' },
        { rotationY: 0, rotationX: 0, z: 0, duration: 1, ease: 'power1.inOut' },
      ],
    }, 0);

    /* Poussière : approche en continu de la caméra */
    dustRefs.current.forEach((d, i) => {
      if (!d) return;
      const depth = dust[i].depth;
      gsap.set(d, { z: -1500 + depth * 500 });
      tl.to(d, { z: 500 + depth * 500, ease: 'none', duration: SCENES }, 0);
    });

    /* Glyphes 3D : chacun traverse le champ sur sa plage */
    iconRefs.current.forEach((ic, i) => {
      if (!ic) return;
      const from = 0.5 + i * 1.75;
      gsap.set(ic, { z: -900, autoAlpha: 0 });
      tl.to(ic, { autoAlpha: 0.95, duration: 0.35, ease: 'power1.out' }, from)
        .to(ic, { z: 430, ease: 'none', duration: 2.3 }, from)
        .to(ic, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, from + 1.8);
    });
  }, { scope: rootRef, dependencies: [] });

  /* Regard caméra au curseur (pointeur fin uniquement) */
  useEffect(() => {
    if (prefersReduced()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const cam = stageRef.current?.querySelector('.cine__cam-mouse');
    if (!cam) return;
    const rx = gsap.quickTo(cam, 'rotationX', { duration: 1.1, ease: 'power3.out' });
    const ry = gsap.quickTo(cam, 'rotationY', { duration: 1.1, ease: 'power3.out' });
    const onMove = (e) => {
      ry((e.clientX / window.innerWidth - 0.5) * 6);
      rx(-(e.clientY / window.innerHeight - 0.5) * 4.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const flat = staticMode;
  const setScene = (i) => (el) => { sceneRefs.current[i] = el; };

  return (
    <section className={`cine${flat ? ' cine--stack' : ''}`} ref={rootRef}>
      <div className="cine__stage" ref={stageRef}>
        <div className="cine__bg" aria-hidden="true">
          <HeroNetwork />
          <div className="hero2__grain" />
        </div>

        <div className="cine__cam-mouse">
          <div className="cine__cam-scroll" ref={camScrollRef}>

            {/* Poussière de profondeur */}
            <div className="cine__dust" aria-hidden="true">
              {dust.map((p, i) => (
                <span
                  key={i}
                  ref={(el) => { dustRefs.current[i] = el; }}
                  style={{
                    left: `${p.left}%`,
                    top: `${p.top}%`,
                    width: p.size,
                    height: p.size,
                    opacity: 0.16 + p.depth * 0.3,
                  }}
                />
              ))}
            </div>

            {/* Glyphes de marque en VRAI volume, rotation continue */}
            <div className="cine__icons" aria-hidden="true">
              {GLYPH_SHAPES.map((shape, i) => (
                <span
                  key={i}
                  className={`cine__icon cine__icon--${i}`}
                  ref={(el) => { iconRefs.current[i] = el; }}
                >
                  <Net3D shape={shape} size="100%" speed={0.9 + i * 0.25} tiltX={0.5 + (i % 2) * 0.4} nodeR={3.4} />
                </span>
              ))}
            </div>

            {/* ── Scène 0 : le constat ── */}
            <div className="cine__scene" ref={setScene(0)}>
              <div className="container cine__center">
                <p className="cine__line"><Marked text={c.line1} word={c.mark1} /></p>
              </div>
            </div>

            {/* ── Scène 1 : la réponse ── */}
            <div className="cine__scene" ref={setScene(1)}>
              <div className="container cine__center">
                <p className="cine__line"><Marked text={c.line2} word={c.mark2} /></p>
              </div>
            </div>

            {/* ── Scène 2 : la bascule ── */}
            <div className="cine__scene" ref={setScene(2)}>
              <div className="container cine__center">
                <p className="cine__closing">{c.closing}</p>
                <div className="cine__actions cine__actions--center">
                  <Link to="/contact" className="btn btn--primary" data-cursor-label="Y aller">
                    <SwapLabel>{c.primary}</SwapLabel>
                    <span className="btn__arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Scènes 3-6 : les offres (titres-réseau) ── */}
            {c.offerings.map((o, i) => (
              <div className="cine__scene" key={o.title} ref={setScene(3 + i)}>
                <div className="container cine__center">
                  <NetPhrase
                    text={o.title}
                    index={i}
                    maxAspect={maxAspect}
                    active={flat ? true : activeIdx === 3 + i}
                  />
                  <p className="netphrase__sub">{o.sub}</p>
                </div>
              </div>
            ))}

            {/* ── Scène 7 : signature — R 3D qui tourne, reste au point ── */}
            <div className="cine__scene" ref={setScene(7)}>
              <div className="container cine__center">
                <Net3D shape={rShape} size={210} speed={0.55} tiltX={0.35} nodeR={4.6} className="cine__sting-net" />
                <p className="cine__sting">{c.sting}</p>
              </div>
            </div>

          </div>
        </div>

        {/* HUD : compteur + progression */}
        {!flat && (
          <div className="cine__hud" aria-hidden="true">
            <span className="cine__count">
              {String(Math.min(Math.max(activeIdx, 0) + 1, SCENES)).padStart(2, '0')} / {String(SCENES).padStart(2, '0')}
            </span>
            <span className="cine__track"><i ref={progressRef} /></span>
          </div>
        )}
      </div>
    </section>
  );
}
