import { useRef, useMemo, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/* ============================================================
   LA MÉTHODE — VOL CINÉMATOGRAPHIQUE (v5).

   Un seul geste : une CAMÉRA qui AVANCE dans une nuit-réseau. On suit une
   colonne vertébrale ; 5 ANNEAUX (les jalons = modules d'un système) émergent
   du lointain, on les TRAVERSE, le texte arrive net et posé à chacun. La nuit
   S'ÉCLAIRCIT au fil du parcours et ÉCLOT en clair (crème) à l'autonomie, pour
   s'enchaîner sans couture avec le reste du site.

   Sobre, contrasté, une seule direction. Le vide et la profondeur font le
   cinéma, pas la densité. reduced-motion => liste. En DEV, window.__mcin(p)
   pilote la caméra (vérif visuelle plan par plan).
   ============================================================ */

const JN = 5;
const DEPTH = 6200;              // profondeur totale du vol (px)
const RINGN = 12;                // nœuds par anneau
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const smooth = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const ph = (p, a, b) => clamp01((p - a) / (b - a));
const rnd = (i, s) => { const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return v - Math.floor(v); };

/* Profondeur (paramètre 0..1) de chaque anneau le long du vol */
const RD = [0.15, 0.32, 0.49, 0.66, 0.83];
/* Centres de lecture (0 = intro, puis les 5 anneaux) */
const CD = [0.02, RD[0], RD[1], RD[2], RD[3], RD[4]];

/* Colonne vertébrale : léger serpentement (fractions) */
const pathX = (d) => Math.sin(d * Math.PI * 1.7) * 0.16;
const pathY = (d) => Math.sin(d * Math.PI * 1.15 + 0.5) * 0.09;

/* Couleur nuit -> crème */
const INK = [14, 11, 31];
const CREAM = [242, 240, 233];
const mixc = (t) => `rgb(${INK.map((c, i) => Math.round(c + (CREAM[i] - c) * t)).join(',')})`;

/* Opacité selon la profondeur écran (surgit du lointain, file derrière) */
const depthOp = (z) => {
  const appear = clamp01((z + 3400) / 2000);
  const pass = 1 - clamp01((z + 90) / 460);
  return Math.max(0, Math.min(appear, pass));
};

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Words({ text }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((w, i) => (
          <span className="mcin__w" key={i}><span className="mcin__wi">{w}</span></span>
        ))}
      </span>
    </>
  );
}

export default function MethodeJourney({ jalons, film, labels, locale }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const spaceRef = useRef(null);
  const camRef = useRef(null);
  const starRefs = useRef([]);
  const boneRefs = useRef([]);
  const ringRefs = useRef([]);
  const momentRefs = useRef([]);
  const hudFillRef = useRef(null);
  const hudDotRefs = useRef([]);
  const [chapter, setChapter] = useState(0);
  const reduced = prefersReduced();

  const kickers = locale === 'fr'
    ? ['Avant', 'Cadrage', 'Audit', 'Bilan', 'Mise en œuvre', 'Autonomie']
    : ['Before', 'Framing', 'Audit', 'Report', 'Delivery', 'Autonomy'];

  /* Étoiles-réseau d'ambiance (éparses, en profondeur) */
  const stars = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
    x: (rnd(i, 1) - 0.5) * 2.6, y: (rnd(i, 2) - 0.5) * 1.9,
    z: -(0.03 + rnd(i, 3) * 0.95) * DEPTH, s: 2 + rnd(i, 4) * 3, o: 0.3 + rnd(i, 5) * 0.5,
  })), []);
  /* Colonne vertébrale : points le long du chemin */
  const bones = useMemo(() => Array.from({ length: 40 }, (_, i) => {
    const d = (i + 0.5) / 40;
    return { x: pathX(d) * 40, y: pathY(d) * 26, z: -d * DEPTH, s: 2.5 + (i % 3) };
  }), []);

  const moments = useMemo(() => ([
    { kicker: kickers[0], num: '', title: film.introTitle, body: film.introText, deliver: '', here: false },
    ...jalons.map((j, i) => ({
      kicker: `${labels.milestone} ${j.n} · ${kickers[i + 1]}`,
      num: j.n, title: j.title, body: j.text, deliver: j.deliver, here: j.here,
    })),
  ]), [jalons, film, labels, locale]);

  useGSAP(() => {
    if (reduced) return;
    const root = rootRef.current;
    const stage = stageRef.current;
    const space = spaceRef.current;
    const synthEl = root.querySelector('.mcin__synth');
    const fogEl = root.querySelector('.mcin__fog');
    const hudEl = root.querySelector('.mcin__hud');

    const moWords = momentRefs.current.map((el) => ({
      el,
      title: el ? [...el.querySelectorAll('.mcin__title .mcin__wi')] : [],
      body: el ? [...el.querySelectorAll('.mcin__body .mcin__wi')] : [],
      meta: el ? [...el.querySelectorAll('.mcin__meta')] : [],
      num: el ? el.querySelector('.mcin__num') : null,
    }));

    const runWords = (list, localIn, localOut) => {
      const n = Math.max(list.length, 1);
      list.forEach((w, k) => {
        const tin = smooth(clamp01((localIn - (k / n) * 0.4) / 0.6));
        const tout = smooth(clamp01((localOut - (k / n) * 0.2) / 0.8));
        w.style.opacity = (tin * (1 - tout)).toFixed(3);
        w.style.transform = `translateY(${(15 * (1 - tin) - 12 * tout).toFixed(1)}px)`;
      });
    };

    const render = (p) => {
      const camD = p;
      let k = 0;
      for (let i = 0; i < RD.length; i++) if (camD >= (i + 1 < RD.length ? (RD[i] + RD[i + 1]) / 2 : RD[i] - 0.001) && camD >= RD[i] - 0.08) k = i + 1;
      /* chapitre = anneau le plus proche */
      let near = 0, nd = 9; CD.forEach((c, i) => { const d = Math.abs(camD - c); if (d < nd) { nd = d; near = i; } });
      setChapter((c) => (c === near ? c : near));

      /* CAMÉRA : on avance dans la profondeur en déplaçant CHAQUE objet en Z
         (jamais le conteneur : il franchirait le plan de perspective et tout
         exploserait). La caméra suit aussi la colonne (décalage x/y). */
      const camZ = camD * DEPTH;
      const cx = pathX(camD) * 40;   // vw
      const cy = pathY(camD) * 26;   // vh

      /* Nuit qui s'éclaircit + réseau qui s'efface à l'éclosion */
      const bgL = smooth(clamp01((camD - 0.80) / 0.17));
      stage.style.backgroundColor = mixc(bgL);
      const netFade = 1 - smooth(clamp01((camD - 0.82) / 0.15));
      if (fogEl) fogEl.style.opacity = netFade.toFixed(3);
      if (hudEl) hudEl.style.opacity = netFade.toFixed(3);

      const place = (el, wx, wy, z, op) => {
        el.style.opacity = (z > 30 ? 0 : op).toFixed(3);
        el.style.transform = `translate(-50%, -50%) translate3d(${(wx - cx).toFixed(2)}vw, ${(wy - cy).toFixed(2)}vh, ${z.toFixed(1)}px)`;
      };
      starRefs.current.forEach((el, i) => {
        if (el) place(el, stars[i].x * 50, stars[i].y * 50, stars[i].z + camZ, depthOp(stars[i].z + camZ) * stars[i].o * netFade);
      });
      boneRefs.current.forEach((el, i) => {
        if (el) place(el, bones[i].x, bones[i].y, bones[i].z + camZ, depthOp(bones[i].z + camZ) * 0.85 * netFade);
      });
      ringRefs.current.forEach((el, i) => {
        if (!el) return;
        const z = -RD[i] * DEPTH + camZ;
        place(el, pathX(RD[i]) * 40, pathY(RD[i]) * 26, z, depthOp(z) * netFade);
        const focus = clamp01(1 - Math.abs(z + 130) / 520);
        el.classList.toggle('is-focus', focus > 0.5);
      });

      /* Texte : arrive net à chaque anneau */
      moWords.forEach((mo, i) => {
        if (!mo || !mo.el) return;
        const c = CD[i];
        const localIn = i === 0 ? clamp01((camD + 0.05) / 0.05) : smooth(ph(camD, c - 0.085, c - 0.02));
        const localOut = i === 5 ? smooth(ph(camD, 0.9, 0.99)) : smooth(ph(camD, c + 0.02, c + 0.085));
        const alive = localIn > 0.001 && localOut < 0.999;
        mo.el.style.opacity = alive ? '1' : '0';
        if (!alive) return;
        runWords(mo.title, localIn, localOut);
        runWords(mo.body, localIn, localOut);
        mo.meta.forEach((m, mi) => {
          const t = smooth(clamp01((localIn - 0.1 - mi * 0.08) / 0.55)) * (1 - smooth(clamp01(localOut / 0.7)));
          m.style.opacity = t.toFixed(3);
          m.style.transform = `translateY(${(12 * (1 - t)).toFixed(1)}px)`;
        });
        if (mo.num) {
          const t = smooth(clamp01(localIn / 0.6)) * (1 - smooth(clamp01(localOut / 0.7)));
          mo.num.style.opacity = (t * 0.85).toFixed(3);
          mo.num.style.transform = `translateY(${((1 - t) * 24).toFixed(1)}px)`;
        }
      });

      /* HUD */
      if (hudFillRef.current) hudFillRef.current.style.transform = `scaleX(${clamp01((camD - 0.02) / 0.84).toFixed(4)})`;
      hudDotRefs.current.forEach((n, i) => {
        if (!n) return;
        n.classList.toggle('is-on', camD >= RD[i] - 0.02);
        n.classList.toggle('is-active', near - 1 === i);
      });
      stage.style.setProperty('--mcin-fg', bgL > 0.5 ? 'var(--ink)' : 'var(--cream)');

      /* Éclosion finale */
      const finale = smooth(ph(camD, 0.9, 1));
      gsap.set(synthEl, { autoAlpha: finale, y: 26 * (1 - finale) });
    };

    render(0);
    if (import.meta.env && import.meta.env.DEV) window.__mcin = render;

    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 8,
      pin: stageRef.current,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => render(self.progress),
    });

    /* Regard caméra (desktop) : léger parallaxe sur le vaisseau */
    let onMove = null;
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const rY = gsap.quickTo(camRef.current, 'rotationY', { duration: 1.4, ease: 'power3.out' });
      const rX = gsap.quickTo(camRef.current, 'rotationX', { duration: 1.4, ease: 'power3.out' });
      onMove = (e) => { rY((e.clientX / window.innerWidth - 0.5) * 5); rX(-(e.clientY / window.innerHeight - 0.5) * 3.5); };
      window.addEventListener('pointermove', onMove, { passive: true });
    }

    return () => { st.kill(); if (onMove) window.removeEventListener('pointermove', onMove); if (window.__mcin) delete window.__mcin; };
  }, { scope: rootRef, dependencies: [locale] });

  /* ————— Fallback statique (reduced-motion) ————— */
  if (reduced) {
    return (
      <section className="mcin-flat">
        <div className="container">
          <p className="eyebrow eyebrow--index">{film.introKicker}</p>
          <h2 className="mcin-flat__title">{film.introTitle}</h2>
          <p className="mcin-flat__lead">{film.introText}</p>
          <div className="jalons-list">
            {jalons.map((j) => (
              <div className={`jalon-card${j.here ? ' is-here' : ''}`} key={j.n}>
                <span className="jalon-card__num">{j.n}</span>
                <span className="jalon-card__body">
                  <span className="jalon-card__label">
                    {j.label}
                    {j.here && <span className="jalon-card__here">{labels.here}</span>}
                  </span>
                  <h3>{j.title}</h3>
                  <p>{j.text}</p>
                  <p className="jalon-card__deliver"><strong>{labels.youGet} :</strong> {j.deliver}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mcin" ref={rootRef}>
      <div className="mcin__stage" ref={stageRef} data-cursor-dark>
        <div className="mcin__cam" ref={camRef}>
          <div className="mcin__space" ref={spaceRef}>
            {/* étoiles d'ambiance */}
            {stars.map((n, i) => (
              <span key={`s${i}`} className="mcin__star" ref={(el) => { starRefs.current[i] = el; }}
                style={{ width: `${n.s}px`, height: `${n.s}px`, transform: `translate(-50%,-50%) translate3d(${n.x * 50}vw, ${n.y * 50}vh, ${n.z}px)` }} />
            ))}
            {/* colonne vertébrale */}
            {bones.map((n, i) => (
              <span key={`b${i}`} className="mcin__bone" ref={(el) => { boneRefs.current[i] = el; }}
                style={{ width: `${n.s}px`, height: `${n.s}px`, transform: `translate(-50%,-50%) translate3d(${n.x}vw, ${n.y}vh, ${n.z}px)` }} />
            ))}
            {/* les 5 anneaux */}
            {RD.map((d, i) => (
              <div key={`r${i}`} className="mcin__ring" ref={(el) => { ringRefs.current[i] = el; }}
                style={{ transform: `translate(-50%,-50%) translate3d(${pathX(d) * 40}vw, ${pathY(d) * 26}vh, ${-d * DEPTH}px)` }}>
                <span className="mcin__ring-circle" />
                {Array.from({ length: RINGN }, (_, kk) => {
                  const a = (kk / RINGN) * 360;
                  return <span key={kk} className="mcin__ring-node" style={{ transform: `translate(-50%, -50%) rotate(${a}deg) translateY(calc(var(--mcin-nr) * -1))` }} />;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* brume / vignette cinématographique */}
        <div className="mcin__fog" aria-hidden="true" />

        {/* le texte, net et posé (colonne gauche) */}
        <div className="mcin__copy">
          {moments.map((mo, i) => (
            <article className="mcin__moment" key={i} ref={(el) => { momentRefs.current[i] = el; }}>
              {mo.num && <span className="mcin__num" aria-hidden="true">{mo.num}</span>}
              <p className="mcin__kicker mcin__meta">
                {mo.kicker}
                {mo.here && <span className="mcin__here">{labels.here}</span>}
              </p>
              <h2 className="mcin__title"><Words text={mo.title} /></h2>
              <p className="mcin__body"><Words text={mo.body} /></p>
              {mo.deliver && <p className="mcin__deliver mcin__meta"><span>{labels.youGet}</span>{mo.deliver}</p>}
            </article>
          ))}
        </div>

        {/* HUD */}
        <div className="mcin__hud" aria-hidden="true">
          <span className="mcin__hud-line"><i ref={hudFillRef} /></span>
          <span className="mcin__hud-dots">
            {jalons.map((j, i) => (
              <span className="mcin__hud-dot" key={j.n} ref={(el) => { hudDotRefs.current[i] = el; }}>
                <b>{j.n}</b><em>{j.label}</em>
              </span>
            ))}
          </span>
        </div>

        {/* Éclosion finale */}
        <div className="mcin__synth"><p>{film.synthCap}</p></div>
      </div>
    </section>
  );
}
