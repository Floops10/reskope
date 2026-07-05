import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { GLYPH_SHAPES } from '../lib/net3d';
import Net3D from './Net3D';
import MorphTitle from './MorphTitle';
import InfoTip from './InfoTip';

/* ============================================================
   CONSTAT — L'OUVERTURE. La question, PILE AU CENTRE de l'écran,
   se transforme en police réseau au survol (morph du hero). Au
   scroll : elle s'efface pendant que LE chiffre (47 %) se compte
   au cœur d'un anneau qui SE DESSINE EN TOURNANT ; la légende
   s'égrène, la source arrive, puis tout plonge à travers la
   caméra — direction les preuves. Un glyphe 3D dérive en fond.
   Mobile / reduced : version posée, chiffre déjà formé.
   ============================================================ */

const R = 168;
const C = 2 * Math.PI * R;
const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function ConstatOpening({ eyebrow, question, data, sourceLabel }) {
  const rootRef = useRef(null);
  const innerRef = useRef(null);
  const headRef = useRef(null);
  const vizRef = useRef(null);
  const numRef = useRef(null);
  const ringGRef = useRef(null);
  const [flat, setFlat] = useState(false);

  const segA = C * 0.28;
  const segB = C * 0.19;

  useGSAP(() => {
    const root = rootRef.current;
    const arcs = root.querySelectorAll('.copen__seg');
    const legends = [...root.querySelectorAll('.copen__legend li')];
    const foot = root.querySelector('.copen__foot');

    const render = (p) => {
      /* la question s'efface vers le haut */
      const qOut = ease(clamp01((p - 0.14) / 0.18));
      gsap.set(headRef.current, {
        yPercent: -36 * qOut,
        autoAlpha: 1 - qOut,
        filter: `blur(${(5 * qOut).toFixed(1)}px)`,
      });

      /* le chiffre + l'anneau arrivent — l'anneau TOURNE en se dessinant */
      const vizIn = ease(clamp01((p - 0.2) / 0.22));
      gsap.set(vizRef.current, { autoAlpha: vizIn, scale: 0.82 + 0.18 * vizIn });
      gsap.set(ringGRef.current, { rotation: 14 + 30 * ease(clamp01((p - 0.2) / 0.5)), svgOrigin: '200 200' });

      const cnt = ease(clamp01((p - 0.24) / 0.4));
      numRef.current.textContent = Math.round(data.value * cnt) + data.suffix;

      const tA = ease(clamp01((p - 0.26) / 0.32));
      const tB = ease(clamp01((p - 0.36) / 0.3));
      arcs[0].style.strokeDasharray = `${(segA * tA).toFixed(1)} ${C}`;
      arcs[1].style.strokeDasharray = `${(segB * tB).toFixed(1)} ${C}`;

      /* légende + source en cascade */
      legends.forEach((li, i) => {
        const t = clamp01((p - (0.5 + i * 0.055)) / 0.09);
        li.style.opacity = t.toFixed(3);
        li.style.transform = `translateY(${(14 * (1 - t)).toFixed(1)}px)`;
      });
      const tf = clamp01((p - 0.68) / 0.08);
      foot.style.opacity = tf.toFixed(3);
      foot.style.transform = `translateY(${(14 * (1 - tf)).toFixed(1)}px)`;

      /* la plongée : tout traverse la caméra */
      const dive = ease(clamp01((p - 0.84) / 0.16));
      gsap.set(innerRef.current, {
        scale: 1 + 0.75 * dive,
        autoAlpha: 1 - dive,
        filter: `blur(${(8 * dive).toFixed(1)}px)`,
      });
    };

    if (instant()) {
      setFlat(true);
      render(0.72);
      gsap.set(headRef.current, { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)' });
      gsap.set(innerRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)' });
      return;
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 881px)', () => {
      render(0);
      const st = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate: (self) => render(self.progress),
        invalidateOnRefresh: true,
      });
      return () => st.kill();
    });

    /* Mobile : posé — question puis chiffre déjà formé, reveals doux */
    mm.add('(max-width: 880px)', () => {
      setFlat(true);
      render(0.72);
      gsap.set(headRef.current, { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)' });
      gsap.set(innerRef.current, { scale: 1, autoAlpha: 1, filter: 'blur(0px)' });
      gsap.from(root.querySelectorAll('.copen__viz, .copen__legend, .copen__foot'), {
        y: 30, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: vizRef.current, start: 'top 82%' },
      });
    });

    return () => mm.revert();
  }, { scope: rootRef });

  return (
    <header className={`copen${flat ? ' copen--flat' : ''}`} ref={rootRef} id="top">
      <div className="copen__stage">
        <div className="hero2__grain" aria-hidden="true" />
        <Net3D shape={GLYPH_SHAPES[2]} size={130} speed={0.55} tiltX={0.4} nodeR={2.8} className="copen__drift" />

        {/* La question — pile au centre, morph réseau au survol */}
        <div className="copen__head" ref={headRef}>
          <p className="eyebrow eyebrow--index">{eyebrow}</p>
          <MorphTitle as="h1" text={question} textClass="copen__q" intro />
        </div>

        <div className="copen__inner" ref={innerRef}>
          <div className="copen__viz" ref={vizRef}>
            <svg className="copen__ring" viewBox="0 0 400 400" aria-hidden="true">
              <circle cx="200" cy="200" r={R} className="copen__rest" />
              <g ref={ringGRef}>
                <circle cx="200" cy="200" r={R} className="copen__seg copen__seg--a" transform="rotate(-90 200 200)" />
                <circle
                  cx="200" cy="200" r={R} className="copen__seg copen__seg--b"
                  transform={`rotate(${-90 + 0.28 * 360} 200 200)`}
                />
                <circle cx="200" cy={200 - R} r="7" className="copen__node" />
                <circle
                  cx={200 + R * Math.cos((-90 + 0.28 * 360) * Math.PI / 180)}
                  cy={200 + R * Math.sin((-90 + 0.28 * 360) * Math.PI / 180)}
                  r="7" className="copen__node"
                />
                <circle
                  cx={200 + R * Math.cos((-90 + 0.47 * 360) * Math.PI / 180)}
                  cy={200 + R * Math.sin((-90 + 0.47 * 360) * Math.PI / 180)}
                  r="7" className="copen__node"
                />
              </g>
            </svg>
            <p className="copen__num" ref={numRef} aria-hidden="true">0{data.suffix}</p>
            <p className="sr-only">{data.display} {data.title}</p>
          </div>

          <ul className="copen__legend" aria-hidden="true">
            {data.legend.map((l) => (
              <li key={l.label} className={`legend legend--${l.tone}`}>
                <span className="legend__swatch" />
                {l.label} <strong>{l.v}</strong>
              </li>
            ))}
          </ul>

          <div className="copen__foot">
            <a
              className="statcard__source"
              href={data.source.url}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-label={sourceLabel}
            >
              <span className="statcard__source-dot" aria-hidden="true" />
              {data.source.label}
              <span aria-hidden="true">↗</span>
            </a>
            <InfoTip label={data.calcLabel}>
              <strong>{data.calcLabel}.</strong> {data.calc}
            </InfoTip>
          </div>
        </div>
      </div>
    </header>
  );
}
