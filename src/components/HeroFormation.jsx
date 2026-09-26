import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, ScrollTrigger, useGSAP } from '../lib/gsap';

/* reduced-motion SEUL déclenche l'état statique (pas document.hidden :
   un chargement en onglet caché restait figé pour toujours). */
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
import { buildR3D, GLYPH_SHAPES, project, lerp3, easeInOut } from '../lib/net3d';
import Net3D from './Net3D';
import SwapLabel from './SwapLabel';

/* HERO FORMATION v4.
   TITRE : statement pleine largeur (2 lignes). Au survol, chaque lettre
   BASCULE sur elle-même (vague gauche→droite) et se relève en police
   RÉSEAU Reskope — même taille, même place (calque superposé), transition
   play/reverse : fluide et interruptible à tout moment.
   SCROLL : le titre dérive vers la gauche puis ses lettres se désassemblent
   (le réseau se défait) pendant que le R 3D VOYAGE VERS LE CENTRE en
   grossissant, boucle son tour à 360°, et LIBÈRE les 4 glyphes de marque
   (ceux qui peuplent ensuite la traversée caméra).
   Mobile : pile lisible, formation à l'entrée. instant() : état formé. */

const FOCAL = 430;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

function rnd(i, s) {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

/* Directions de libération des 4 glyphes (éventail autour du R) */
const GLYPH_DIRS = [
  [-1.1, -0.65],
  [1.05, -0.55],
  [-0.95, 0.7],
  [1.1, 0.6],
];

export default function HeroFormation({ c }) {
  const rootRef = useRef(null);
  const svgRef = useRef(null);
  const wrapRef = useRef(null);
  const titleRef = useRef(null);
  const netTitleRef = useRef(null);
  const visualRef = useRef(null);
  const actionsRef = useRef(null);
  const ditRef = useRef(null);
  const presRef = useRef(null);
  const glyphRefs = useRef([]);

  const shape = useMemo(() => buildR3D(16, 0.66), []);
  const scatter = useMemo(
    () => shape.nodes.map((_, i) => [
      (rnd(i, 1) - 0.5) * 300,
      (rnd(i, 2) - 0.5) * 260,
      (rnd(i, 3) - 0.5) * 320,
    ]),
    [shape]
  );

  useGSAP(() => {
    const svg = svgRef.current;
    const nodeEls = [...svg.querySelectorAll('.hf-node')];
    const linkEls = [...svg.querySelectorAll('.hf-link')];

    const charData = { els: [], vecs: [], touche: [] };
    /* Déclarés ici, créés plus bas : render() s'en sert pour laisser le titre
       au repos avant de le défaire. */
    let intro = null;
    let hoverTl = null;
    let progression = 0;
    /* Les mots de la présentation : ils arrivent de la profondeur quand le
       R a fini de se former, exactement comme la phrase de marque plus bas
       dans la page. Même grammaire de mouvement partout. */
    const presData = { els: [], vecs: [], pas: 0.01 };
    let fxDesktop = false;
    let fxMobile = false;
    let centerShift = 0;
    let montee = 0;

    /* Rendu à la progression p :
       R : 0→0.55 formation · 0.6→1 tour 360° · 0.55→0.85 voyage au centre
       + grossit · 0.88→1 libération des glyphes.
       Texte : dérive gauche continue · 0.56→0.9 désassemblage. */
    const render = (p, overrideAy = null) => {
      const form = clamp01(p / 0.55);
      const spin = clamp01((p - 0.6) / 0.4);
      const ay = overrideAy !== null ? overrideAy : -0.4 * (1 - easeInOut(form)) + easeInOut(spin) * Math.PI * 2;
      const ax = 0.14 + Math.sin(easeInOut(spin) * Math.PI) * 0.24;

      const pos = shape.nodes.map((target, i) => {
        const ti = easeInOut(clamp01((form - i * 0.014) / 0.82));
        return lerp3(scatter[i], target, ti);
      });
      const proj = project(pos, ax, ay, FOCAL);

      let zMin = Infinity, zMax = -Infinity;
      proj.forEach((q) => { if (q.z < zMin) zMin = q.z; if (q.z > zMax) zMax = q.z; });
      const span = Math.max(zMax - zMin, 1);

      for (let i = 0; i < nodeEls.length; i++) {
        const q = proj[i];
        const zn = 1 - (q.z - zMin) / span;
        const base = i === shape.hub || i === shape.hub2 ? 6.4 : 5;
        nodeEls[i].setAttribute('cx', q.x.toFixed(2));
        nodeEls[i].setAttribute('cy', q.y.toFixed(2));
        nodeEls[i].setAttribute('r', (base * q.s).toFixed(2));
        nodeEls[i].style.opacity = (0.25 + 0.75 * (0.3 + 0.7 * zn) * (0.35 + 0.65 * form)).toFixed(3);
      }
      for (let k = 0; k < linkEls.length; k++) {
        const [a, b] = shape.links[k];
        const qa = proj[a], qb = proj[b];
        const el = linkEls[k];
        el.setAttribute('d', `M${qa.x.toFixed(2)} ${qa.y.toFixed(2)} L${qb.x.toFixed(2)} ${qb.y.toFixed(2)}`);
        const draw = clamp01((form - 0.5 - k * 0.011) / 0.32);
        el.style.strokeDashoffset = (1 - draw).toFixed(3);
        const zn = 1 - ((qa.z + qb.z) / 2 - zMin) / span;
        el.style.opacity = (draw * (0.3 + 0.6 * zn)).toFixed(3);
      }

      if (fxDesktop || fxMobile) {
        /* Texte : désassemblage lettre à lettre (le réseau se défait) */
        const fondu = 1 - clamp01((p - 0.46) / 0.16);
        gsap.set(actionsRef.current, { autoAlpha: fondu });
        if (ditRef.current) gsap.set(ditRef.current, { autoAlpha: fondu });
        const { els, vecs, touche } = charData;
        for (let i = 0; i < els.length; i++) {
          const d = easeInOut(clamp01((p - 0.56 - i * 0.0045) / 0.3));
          if (d <= 0) {
            /* Remonté avant le début du désassemblage : la lettre reprend
               exactement sa place (une seule fois, pour ne pas lutter avec
               l'arrivée du titre ni avec le survol). */
            if (touche[i]) {
              gsap.set(els[i], { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 });
              touche[i] = false;
            }
            continue;
          }
          /* Le titre doit être entièrement arrivé et au repos avant de se
             défaire : l'arrivée ou le survol, s'ils finissaient après,
             remettaient les lettres en place une fois le défilement
             terminé. C'était le titre qui « revient ». */
          if (intro && intro.progress() < 1) intro.progress(1);
          if (hoverTl && hoverTl.progress() > 0) hoverTl.pause(0);
          const v = vecs[i];
          gsap.set(els[i], {
            x: v[0] * d, y: v[1] * d, rotation: v[2] * d, scale: 1 - 0.4 * d, opacity: 1 - d,
          });
          touche[i] = true;
        }

        /* PRÉSENTATION : le R vient de se former, le titre s'en va, et
           « Reskope, c'est Thomy et Florian » se pose sous le réseau. Les
           mots remontent de la profondeur un par un ; c'est la poignée de
           main du site, elle ne pouvait pas arriver par une fondu plat. */
        const pe = presData.els;
        for (let i = 0; i < pe.length; i++) {
          /* Le décalage est réparti sur la phrase, pas fixé par mot : en
             anglais elle est plus courte, et un pas constant laissait les
             derniers mots en vol quand le hero se terminait. */
          const d = easeInOut(clamp01((p - 0.42 - i * presData.pas) / 0.24));
          const v = presData.vecs[i];
          const r = 1 - d;
          pe[i].style.transform =
            `translate3d(${(v[0] * r).toFixed(1)}px, ${(v[1] * r).toFixed(1)}px, ${(v[2] * r).toFixed(0)}px)`
            + ` rotateX(${(v[3] * r).toFixed(1)}deg) rotateZ(${(v[4] * r).toFixed(1)}deg)`;
          pe[i].style.opacity = d.toFixed(3);
        }
      }

      if (fxDesktop) {
        /* Mouvement caméra du texte (layout large uniquement) */
        gsap.set(wrapRef.current.parentNode, { xPercent: -30 * easeInOut(clamp01(p / 0.9)) });

        /* R : voyage vers le centre + grossit */
        const tv = easeInOut(clamp01((p - 0.55) / 0.3));
        gsap.set(visualRef.current, { x: centerShift * tv, scale: 1 + 0.5 * tv });

        /* Libération des glyphes à la fin du tour */
        const tg = easeInOut(clamp01((p - 0.88) / 0.12));
        glyphRefs.current.forEach((g, i) => {
          if (!g) return;
          const [dx, dy] = GLYPH_DIRS[i % GLYPH_DIRS.length];
          gsap.set(g, {
            x: dx * 290 * tg,
            y: dy * 210 * tg,
            scale: 0.3 + 0.7 * tg,
            autoAlpha: clamp01(tg * 2.2),
            rotation: dx * 14 * tg,
          });
        });
      }

      if (fxMobile) {
        /* R : il grandit et descend au milieu de l'écran pendant que le
           titre se défait. Sur téléphone il n'y a pas de place pour un
           voyage latéral ; c'est donc la taille qui fait l'arrivée, et le
           réseau finit par occuper la page, seul. */
        const tv = easeInOut(clamp01((p - 0.5) / 0.34));
        gsap.set(visualRef.current, { scale: 1 + 2.4 * tv, y: montee * tv });
      }
    };

    linkEls.forEach((l) => {
      l.setAttribute('pathLength', '1');
      l.style.strokeDasharray = '1';
      l.style.strokeDashoffset = '1';
    });

    if (prefersReduced()) {
      gsap.set(netTitleRef.current, { autoAlpha: 0 });
      render(0.55, 0.5);
      return;
    }

    /* Splits : base (sans) + calque réseau (même taille, même place) */
    let split = null;
    let netSplit = null;
    let presSplit = null;
    try {
      split = new SplitText(titleRef.current, { type: 'words,chars' });
      netSplit = new SplitText(netTitleRef.current, { type: 'words,chars' });
    } catch { split = null; netSplit = null; }
    if (presRef.current) {
      try { presSplit = new SplitText(presRef.current, { type: 'words' }); } catch { presSplit = null; }
      if (presSplit) {
        presData.els = presSplit.words;
        presData.vecs = presSplit.words.map((_, i) => [
          (rnd(i, 11) - 0.5) * 110,
          40 + rnd(i, 12) * 90,
          -620 - rnd(i, 13) * 520,
          -38 - rnd(i, 14) * 46,
          (rnd(i, 15) - 0.5) * 22,
        ]);
        presData.pas = 0.2 / Math.max(presSplit.words.length - 1, 1);
        presSplit.words.forEach((w) => { w.style.opacity = '0'; });
      }
    }

    if (split) {
      charData.els = split.chars;
      charData.vecs = split.chars.map((_, i) => [
        (rnd(i, 7) - 0.5) * 260,
        (rnd(i, 8) - 0.5) * 190,
        (rnd(i, 9) - 0.5) * 44,
      ]);
      charData.touche = split.chars.map(() => false);
    }
    if (netSplit) gsap.set(netSplit.chars, { autoAlpha: 0 });

    intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (split) {
      intro.from(split.chars, { yPercent: 112, autoAlpha: 0, duration: 0.9, stagger: 0.013 }, 0.12);
    }
    if (ditRef.current) intro.from(ditRef.current, { y: 20, autoAlpha: 0, duration: 0.7 }, 0.5);
    intro.from(actionsRef.current, { y: 24, autoAlpha: 0, duration: 0.7 }, 0.6);

    /* Morph survol : VAGUE de bascule lettre à lettre — la lettre sans
       plonge (rotationX), la lettre réseau se relève à sa place exacte.
       Une seule timeline play/reverse : fluide et interruptible. */
    if (split && netSplit) {
      hoverTl = gsap.timeline({ paused: true });
      /* Des valeurs de départ ÉCRITES, pas relevées : un survol commencé
         pendant l'arrivée du titre relevait une opacité à mi-chemin, et le
         retour s'y arrêtait. Le titre restait à moitié effacé. */
      hoverTl.fromTo(split.chars, { rotationX: 0, autoAlpha: 1 }, {
        rotationX: -92, autoAlpha: 0,
        transformOrigin: '50% 100%',
        duration: 0.32, ease: 'power2.in',
        stagger: { each: 0.011 },
        immediateRender: false,
      }, 0);
      hoverTl.fromTo(netSplit.chars,
        { rotationX: 92, autoAlpha: 0, transformOrigin: '50% 0%' },
        {
          rotationX: 0, autoAlpha: 1,
          duration: 0.5, ease: 'back.out(1.5)',
          stagger: { each: 0.011 },
        }, 0.14);
    }
    /* Le survol attend que le titre soit posé, et se tait pendant qu'il se
       défait au défilement. */
    const onEnter = (e) => {
      if (!hoverTl || (e && e.pointerType && e.pointerType !== 'mouse')) return;
      if (intro.progress() < 1 || progression > 0.4) return;
      hoverTl.timeScale(1).play();
    };
    const onLeave = () => hoverTl && hoverTl.progress() > 0 && hoverTl.timeScale(1.35).reverse();

    const mm = gsap.matchMedia();

    /* Desktop : tout est piloté au scroll (stage sticky en CSS) */
    mm.add('(min-width: 881px)', () => {
      fxDesktop = true;

      const computeShift = () => {
        // yPercent -50 reprend le centrage vertical CSS (gsap possède le transform)
        gsap.set(visualRef.current, { x: 0, scale: 1, yPercent: -50 });
        const r = visualRef.current.getBoundingClientRect();
        centerShift = window.innerWidth / 2 - (r.left + r.width / 2);
      };
      computeShift();
      // glyphes : centrés sur le R, prêts à être libérés
      glyphRefs.current.forEach((g) => g && gsap.set(g, { xPercent: -50, yPercent: -50, autoAlpha: 0 }));

      render(0);
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onRefresh: computeShift,
        onUpdate: (self) => {
          progression = self.progress;
          /* Le survol n'a pas sa place pendant le désassemblage : il se
             replie vite, et render() le remet à zéro avant la première
             lettre qui s'en va. */
          if (progression > 0.4 && hoverTl && hoverTl.progress() > 0 && !hoverTl.reversed()) {
            hoverTl.timeScale(3).reverse();
          }
          render(progression);
        },
      });
      const wrap = wrapRef.current;
      wrap.addEventListener('pointerenter', onEnter);
      wrap.addEventListener('pointerleave', onLeave);
      return () => {
        st.kill();
        fxDesktop = false;
        wrap.removeEventListener('pointerenter', onEnter);
        wrap.removeEventListener('pointerleave', onLeave);
      };
    });

    /* Mobile : la MÊME histoire au scroll (stage sticky en CSS) — le R se
       forme, boucle son tour, le titre se désassemble. */
    mm.add('(max-width: 880px)', () => {
      fxMobile = true;
      /* Distance entre le centre du R et le centre de la scène : c'est ce
         qu'il lui reste à parcourir pour finir au milieu. Mesuré, pas
         deviné, parce que la hauteur du titre change avec la langue. */
      const mesurer = () => {
        gsap.set(visualRef.current, { y: 0, scale: 1 });
        const scene = rootRef.current.querySelector('.heroform__stage');
        const rv = visualRef.current.getBoundingClientRect();
        const rs = scene.getBoundingClientRect();
        montee = (rs.top + rs.height / 2) - (rv.top + rv.height / 2);
      };
      mesurer();
      render(0);
      const st = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onRefresh: mesurer,
        onUpdate: (self) => { progression = self.progress; render(progression); },
      });
      return () => { st.kill(); fxMobile = false; };
    });

    return () => { mm.revert(); split?.revert(); netSplit?.revert(); presSplit?.revert(); };
  }, { scope: rootRef });

  return (
    <header className="heroform" ref={rootRef} id="top">
      <div className="heroform__stage">
        <div className="heroform__bg" aria-hidden="true">
          <div className="hero2__grain" />
        </div>

        <div className="heroform__visual" aria-hidden="true" ref={visualRef}>
          <svg className="heroform__r" ref={svgRef} viewBox="-118 -118 236 236">
            <g>{shape.links.map((_, i) => <path key={i} className="hf-link" />)}</g>
            <g>{shape.nodes.map((_, i) => <circle key={i} className="hf-node" />)}</g>
          </svg>
          {/* Les 4 glyphes, libérés à la fin du tour du R */}
          <div className="heroform__glyphs">
            {GLYPH_SHAPES.map((shp, i) => (
              <span
                key={i}
                className="heroform__glyph"
                ref={(el) => { glyphRefs.current[i] = el; }}
              >
                <Net3D shape={shp} size={86 + i * 12} speed={1 + i * 0.2} tiltX={0.5} nodeR={3} />
              </span>
            ))}
          </div>
        </div>

        <div className="container heroform__copy">
          {/* La version du site ne s'annonce plus ici. La porte d'entrée
              pose la question une bonne fois, et le sélecteur du header la
              rappelle en permanence : répéter « vous êtes plus de dix ? »
              au-dessus du titre alourdissait le premier écran pour dire ce
              que le visiteur vient déjà de choisir. */}
          <div className="heroform__titlewrap" ref={wrapRef}>
            <h1 className="heroform__title" ref={titleRef}>{c.heroTitle}</h1>
            <div className="heroform__title heroform__title--net" ref={netTitleRef} aria-hidden="true">
              {c.heroTitle}
            </div>
          </div>
          {/* Ce qu'on vend, dit tout de suite. Le titre pose le sujet, cette
              ligne dit ce qu'on fait : elle tient dans le premier écran,
              avant tout défilement. */}
          {c.heroDit && <p className="heroform__dit" ref={ditRef}>{c.heroDit}</p>}
          <div className="heroform__actions" ref={actionsRef}>
            <Link to="/contact" className="btn btn--primary" data-cursor-label="Y aller">
              <SwapLabel>{c.primary}</SwapLabel>
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            {/* La destination suit la version : « le constat » n'existe
                qu'en PME, et un bouton qui mène à une page retirée du
                menu est le meilleur moyen de perdre quelqu'un. */}
            <Link to={c.ghostTo || '/pourquoi'} className="btn btn--ghost">
              <SwapLabel>{c.ghost}</SwapLabel>
            </Link>
          </div>
        </div>

        {/* Les présentations, une fois le R formé. Le titre dit le problème,
            le R prend le centre, et là seulement on dit qui parle. C'est
            l'ordre d'une vraie rencontre : le sujet, puis les noms. */}
        {c.longPhrase && (
          <div className="heroform__presente">
            <p className="heroform__presente-t" ref={presRef}>{c.longPhrase}</p>
          </div>
        )}

      </div>
    </header>
  );
}
