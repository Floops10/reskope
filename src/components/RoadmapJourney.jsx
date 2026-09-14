import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { gsap } from '../lib/gsap';
import { makeScrub, pinProgress } from '../lib/scrub';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useLang } from '../i18n';
import { JALONS } from '../data/site';

const LABELS = {
  fr: {
    milestone: 'Jalon',
    here: 'vous démarrez ici',
    youGet: 'Ce que vous obtenez',
    netAria: 'Vos outils, du désordre au système, au fil des jalons.',
    trackAria: 'Frise des jalons',
    hint: 'Le parcours se déroule au défilement. Cliquez un jalon pour y revenir.',
  },
  en: {
    milestone: 'Milestone',
    here: 'you start here',
    youGet: 'What you get',
    netAria: 'Your tools, from clutter to a system, milestone by milestone.',
    trackAria: 'Milestones timeline',
    hint: 'The journey unfolds as you scroll. Click a milestone to jump back.',
  },
};

/* Réseau désordre -> ordre, qui se réorganise au fil des jalons (ADN de marque). */
const S = [
  [60, 120], [210, 50], [340, 140],
  [120, 210], [270, 170], [300, 250],
  [70, 330], [180, 300], [340, 320],
];
const G = [
  [80, 90], [200, 90], [320, 90],
  [80, 200], [200, 200], [320, 200],
  [80, 310], [200, 310], [320, 310],
];
const LOOSE = [[0, 4], [1, 3], [2, 6], [4, 7], [3, 2], [1, 8], [5, 0], [6, 4]];
const GRID = [
  [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8],
  [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8],
];
const TX = [100, 300, 500, 700, 900];
const TY = 46;

function Network({ aria }) {
  return (
    <svg className="jnet" viewBox="0 0 400 400" role="img" aria-label={aria}>
      {LOOSE.map(([a, b], i) => (
        <path key={`l${i}`} className="jn-loose" strokeWidth="1" d={`M${S[a][0]} ${S[a][1]} L${S[b][0]} ${S[b][1]}`} />
      ))}
      {GRID.map(([a, b], i) => (
        <path key={`g${i}`} className="jn-grid" strokeWidth="1.4" d={`M${G[a][0]} ${G[a][1]} L${G[b][0]} ${G[b][1]}`} />
      ))}
      {S.map(([x, y], i) => (
        <circle key={`n${i}`} className="jn-node" cx={x} cy={y} r={i === 4 ? 8 : 6} />
      ))}
    </svg>
  );
}

function Detail({ j, index, total, L }) {
  return (
    <div className="jpanel__inner">
      <div className="jpanel__progress" aria-hidden="true">
        <span className="jpanel__count">
          <span key={`c${j.n}`} className="jpanel__count-now">{j.n}</span>
          <span className="jpanel__count-total">/ 0{total}</span>
        </span>
        <span className="jpanel__bar">
          <span
            className="jpanel__bar-fill"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </span>
      </div>
      <div key={j.n} className="jpanel__fade">
        <p className="jpanel__eyebrow">
          {L.milestone} {j.n} · {j.label}
          {j.here && <span className="jpanel__here">{L.here}</span>}
        </p>
        <h3 className="jpanel__title">{j.title}</h3>
        <p className="jpanel__text">{j.text}</p>
        <p className="jpanel__deliver">
          <span>{L.youGet}</span>
          {j.deliver}
        </p>
      </div>
    </div>
  );
}

function Track({ active, onPick, jalons, L }) {
  return (
    <svg className="jtrack" viewBox="0 0 1000 96" role="group" aria-label={L.trackAria}>
      <line className="jt-line jt-bg" x1={TX[0]} y1={TY} x2={TX[4]} y2={TY} />
      <line className="jt-line jt-fg" x1={TX[0]} y1={TY} x2={TX[4]} y2={TY} />
      {jalons.map((jal, i) => {
        const cls = ['jt-node', i === active ? 'is-active' : '', i < active ? 'is-done' : '']
          .filter(Boolean)
          .join(' ');
        return (
          <g
            key={jal.n}
            className={cls}
            role="button"
            tabIndex={0}
            aria-pressed={i === active}
            aria-label={`${L.milestone} ${jal.n} : ${jal.label}`}
            onClick={() => onPick(i)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onPick(i))}
          >
            <circle className="jt-hit" cx={TX[i]} cy={TY} r="30" />
            <circle className="jt-dot" cx={TX[i]} cy={TY} r={i === active ? 12 : 8} />
            <text className="jt-num" x={TX[i]} y={TY - 26} textAnchor="middle">{jal.n}</text>
            <text className="jt-label" x={TX[i]} y={TY + 38} textAnchor="middle">{jal.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function JalonsList({ active, onPick, jalons, L }) {
  return (
    <div className="jalons-list">
      {jalons.map((jal, i) => (
        <button
          type="button"
          key={jal.n}
          className={`jalon-card${jal.here ? ' is-here' : ''}${i === active ? ' is-active' : ''}`}
          onClick={() => onPick(i)}
        >
          <span className="jalon-card__num">{jal.n}</span>
          <span className="jalon-card__body">
            <span className="jalon-card__label">
              {jal.label}
              {jal.here && <span className="jalon-card__here">{L.here}</span>}
            </span>
            <h3>{jal.title}</h3>
            <p>{jal.text}</p>
            <p className="jalon-card__deliver">
              <strong>{L.youGet} :</strong> {jal.deliver}
            </p>
          </span>
        </button>
      ))}
    </div>
  );
}

export default function RoadmapJourney() {
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 881px)');
  const { lang } = useLang();
  const jalons = JALONS[lang];
  const L = LABELS[lang];
  const [active, setActive] = useState(0);
  const pinRef = useRef(null);
  const lastIdx = useRef(0);

  useEffect(() => {
    if (reduce || !isDesktop) return;
    const pin = pinRef.current;
    if (!pin) return;

    let cleanup = () => {};
    const ctx = gsap.context(() => {
      const nodes = pin.querySelectorAll('.jn-node');
      pin.querySelectorAll('.jn-grid').forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      const fg = pin.querySelector('.jt-fg');
      const flen = fg.getTotalLength();
      gsap.set(fg, { strokeDasharray: flen, strokeDashoffset: flen });

      const tl = gsap.timeline({ paused: true });
      nodes.forEach((el, i) => {
        tl.to(el, { x: G[i][0] - S[i][0], y: G[i][1] - S[i][1], duration: 0.55, ease: 'power2.inOut' }, 0);
      });
      tl.to('.jn-loose', { opacity: 0, duration: 0.3 }, 0);
      tl.to('.jn-grid', { strokeDashoffset: 0, duration: 0.45, stagger: 0.012, ease: 'power1.inOut' }, 0.2);
      tl.to('.jn-node', { fill: '#1c0cb3', duration: 0.25 }, 0.35);
      tl.to(fg, { strokeDashoffset: 0, duration: 1, ease: 'none' }, 0);

      cleanup = makeScrub(
        () => pinProgress(pin),
        (p) => {
          tl.progress(p);
          const idx = Math.min(jalons.length - 1, Math.floor(p * jalons.length));
          if (idx !== lastIdx.current) {
            lastIdx.current = idx;
            setActive(idx);
          }
        }
      );
    }, pin);

    return () => {
      cleanup();
      ctx.revert();
    };
  }, [reduce, isDesktop]);

  const onPick = (i) => {
    // Liste mobile / reduced-motion : sélection directe, pas de scrub à piloter.
    if (reduce || !isDesktop) {
      lastIdx.current = i;
      setActive(i);
      return;
    }
    // Desktop pinné : on défile jusqu'au jalon, le scrub fait le reste
    // (sinon le scrub réécrit `active` à la frame suivante → « ça bug »).
    const pin = pinRef.current;
    if (!pin) return;
    const total = pin.offsetHeight - window.innerHeight;
    const pinTop = pin.getBoundingClientRect().top + window.scrollY;
    const targetP = (i + 0.5) / jalons.length;
    window.scrollTo({ top: Math.round(pinTop + targetP * total), behavior: 'smooth' });
  };

  if (reduce || !isDesktop) {
    return (
      <div className="container">
        <JalonsList active={active} onPick={onPick} jalons={jalons} L={L} />
      </div>
    );
  }

  return (
    <div className="journey-pin" ref={pinRef}>
      <div className="journey__sticky">
        <div className="journey__stage container">
          <div className="journey__panel">
            <Detail j={jalons[active]} index={active} total={jalons.length} L={L} />
          </div>
          <div className="journey__viz">
            <Network aria={L.netAria} />
          </div>
        </div>
        <div className="journey__track-wrap container">
          <Track active={active} onPick={onPick} jalons={jalons} L={L} />
          <p className="journey__hint">{L.hint}</p>
        </div>
      </div>
    </div>
  );
}
