import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Page from '../components/Page';
import MorphTitle from '../components/MorphTitle';
import NetWord from '../components/NetWord';
import Net3D from '../components/Net3D';
import { GLYPH_SHAPES } from '../lib/net3d';
import { gsap, useGSAP } from '../lib/gsap';
import { useLang } from '../i18n';
import { BILAN, CARTO_NODES, CARTO_LINKS } from '../data/bilan';

/* ============================================================
   EXEMPLE DE BILAN — l'explorateur interactif.
   Pas un document qui défile : une interface. Sept volets (onglets),
   chacun avec ses interactions : chiffres comptés, barres avant/après,
   accordéon des constats, CARTOGRAPHIE DU SI avant/après cliquable,
   board d'actions filtrable, feuille de route priorisée.
   ============================================================ */

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* — Chiffre compté à l'apparition — */
function CountStat({ s, locale }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const fmt = new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
      minimumFractionDigits: s.decimals || 0,
      maximumFractionDigits: s.decimals || 0,
    });
    const render = (v) => {
      el.textContent = `${s.prefix || ''}${fmt.format(v)}${s.suffix || ''}`;
    };
    if (s.mode === 'fromto') {
      el.textContent = `${s.value} → ${s.to}`;
      return;
    }
    if (reduced()) { render(s.value); return; }
    const proxy = { v: 0 };
    const tw = gsap.to(proxy, {
      v: s.value, duration: 1.4, ease: 'power3.out', delay: 0.15,
      onUpdate: () => render(proxy.v),
    });
    return () => tw.kill();
  }, [s, locale]);
  return (
    <div className="bilan-stat">
      <span className="bilan-stat__num" ref={ref}>0</span>
      <span className="bilan-stat__label">{s.label}</span>
    </div>
  );
}

/* — Barres avant / après (temps) — */
function fmtMin(min) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}
function TimeRows({ t }) {
  const rootRef = useRef(null);
  useEffect(() => {
    if (reduced()) return;
    const bars = rootRef.current.querySelectorAll('.bilan-time__bar i');
    const tw = gsap.fromTo(bars, { scaleX: 0 }, {
      scaleX: 1, duration: 1.1, ease: 'power4.out', stagger: 0.08, delay: 0.2,
    });
    return () => tw.kill();
  }, [t]);
  const max = Math.max(...t.rows.map((r) => r.before));
  return (
    <div className="bilan-time" ref={rootRef}>
      {t.rows.map((r) => (
        <div className="bilan-time__row" key={r.label}>
          <div className="bilan-time__head">
            <span className="bilan-time__label">{r.label}</span>
            <span className="bilan-time__unit">{r.unit}</span>
          </div>
          <div className="bilan-time__bars">
            <div className="bilan-time__bar bilan-time__bar--before">
              <i style={{ width: `${(r.before / max) * 100}%` }} />
              <b>{t.unitBefore} · {fmtMin(r.before)}</b>
            </div>
            <div className="bilan-time__bar bilan-time__bar--after">
              <i style={{ width: `${(r.after / max) * 100}%` }} />
              <b>{t.unitAfter} · {fmtMin(r.after)}</b>
            </div>
          </div>
          <span className="bilan-time__gain">−{Math.round((1 - r.after / r.before) * 100)} %</span>
        </div>
      ))}
      <p className="bilan-note">{t.note}</p>
    </div>
  );
}

/* — Accordéon des constats — */
function Findings({ c }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="bilan-acc">
      {c.items.map((it, i) => {
        const on = open === i;
        return (
          <div className={`bilan-acc__item${on ? ' is-open' : ''}`} key={it.title}>
            <button type="button" className="bilan-acc__q" aria-expanded={on} onClick={() => setOpen(on ? -1 : i)}>
              <span className={`bilan-acc__sev bilan-acc__sev--${it.sev}`} aria-hidden="true">
                <i /><i /><i />
              </span>
              <span className="bilan-acc__title">{it.title}</span>
              <span className="bilan-acc__icon" aria-hidden="true" />
            </button>
            <div className="bilan-acc__a"><p>{it.text}</p></div>
          </div>
        );
      })}
    </div>
  );
}

/* — Cartographie du SI avant/après — */
function CartoMap({ c }) {
  const [view, setView] = useState('avant');
  const [sel, setSel] = useState('erp');
  const nodeById = useMemo(() => Object.fromEntries(CARTO_NODES.map((n) => [n.id, n])), []);
  const pos = (n) => (view === 'avant' ? n.a : n.b);
  const selNode = sel && nodeById[sel] && c.nodes[sel] ? { ...nodeById[sel], ...c.nodes[sel] } : null;

  const renderLinks = (list, phase) => (
    <g className={`bilan-carto__links bilan-carto__links--${phase}`}>
      {list.map(([a, b]) => {
        const pa = phase === 'avant' ? nodeById[a].a : nodeById[a].b;
        const pb = phase === 'avant' ? nodeById[b].a : nodeById[b].b;
        if (!pa || !pb) return null;
        return <line key={`${a}-${b}`} x1={pa[0]} y1={pa[1]} x2={pb[0]} y2={pb[1]} />;
      })}
    </g>
  );

  return (
    <div className="bilan-carto">
      <div className="bilan-carto__bar">
        <div className="bilan-carto__toggle" role="tablist" aria-label={c.title}>
          <span className={`bilan-carto__thumb${view === 'apres' ? ' is-right' : ''}`} aria-hidden="true" />
          <button type="button" role="tab" aria-selected={view === 'avant'} className={view === 'avant' ? 'is-on' : ''} onClick={() => setView('avant')}>
            {c.before}
          </button>
          <button type="button" role="tab" aria-selected={view === 'apres'} className={view === 'apres' ? 'is-on' : ''} onClick={() => setView('apres')}>
            {c.after}
          </button>
        </div>
        <div className="bilan-carto__legend" aria-hidden="true">
          {Object.entries(c.statuses).map(([k, lab]) => (
            <span key={k} className={`bilan-carto__lg bilan-carto__lg--${k}`}><i />{lab}</span>
          ))}
        </div>
      </div>

      <div className="bilan-carto__body">
        <div className="bilan-carto__mapwrap">
          <svg className={`bilan-carto__map is-${view}`} viewBox="0 0 100 60" role="img" aria-label={c.title}>
            {renderLinks(CARTO_LINKS.avant, 'avant')}
            {renderLinks(CARTO_LINKS.apres, 'apres')}
            {CARTO_NODES.map((n) => {
              const p = pos(n) || n.a || n.b;
              const off = !pos(n);
              const info = c.nodes[n.id];
              return (
                <g
                  key={n.id}
                  className={`bilan-carto__node bilan-carto__node--${n.status}${off ? ' is-off' : ''}${sel === n.id ? ' is-sel' : ''}`}
                  style={{ transform: `translate(${p[0]}px, ${p[1]}px)` }}
                  onClick={() => !off && setSel(n.id)}
                  role="button"
                  tabIndex={off ? -1 : 0}
                  aria-label={info.label}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !off && (e.preventDefault(), setSel(n.id))}
                >
                  <circle className="bilan-carto__halo" r="4.4" />
                  <circle className="bilan-carto__dot" r={n.big ? 2.6 : 1.8} />
                  <text y={n.ly || (n.big ? -4.4 : -3.2)}>{info.label}</text>
                </g>
              );
            })}
          </svg>
          <p className="bilan-carto__hint" aria-hidden="true">{c.hint}</p>
        </div>

        {selNode && (
          <aside key={sel} className="bilan-carto__detail">
            <span className={`bilan-carto__status bilan-carto__status--${selNode.status}`}>
              {c.statuses[selNode.status]}
            </span>
            <h4>{selNode.label}</h4>
            <p className="bilan-carto__group">{c.groupLabel} · {selNode.group}</p>
            <p className="bilan-carto__note">{selNode.note}</p>
          </aside>
        )}
      </div>
    </div>
  );
}

/* — Board d'actions filtrable — */
function ActionsBoard({ a }) {
  const [filter, setFilter] = useState('all');
  const types = Object.keys(a.types);
  const items = filter === 'all' ? a.items : a.items.filter((it) => it.type === filter);
  return (
    <div className="bilan-actions">
      <div className="bilan-actions__filters" role="tablist" aria-label={a.title}>
        <button type="button" role="tab" aria-selected={filter === 'all'} className={`bilan-chip${filter === 'all' ? ' is-on' : ''}`} onClick={() => setFilter('all')}>
          {a.all} <b>{a.items.length}</b>
        </button>
        {types.map((tp) => {
          const count = a.items.filter((it) => it.type === tp).length;
          return (
            <button type="button" role="tab" aria-selected={filter === tp} key={tp} className={`bilan-chip${filter === tp ? ' is-on' : ''}`} onClick={() => setFilter(tp)}>
              {a.types[tp]} <b>{count}</b>
            </button>
          );
        })}
      </div>
      <motion.div className="bilan-actions__grid" layout>
        <AnimatePresence mode="popLayout">
          {items.map((it) => (
            <motion.article
              layout
              key={it.title}
              className={`bilan-action bilan-action--${it.type}`}
              initial={{ opacity: 0, scale: 0.92, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="bilan-action__type">{a.types[it.type]}</span>
              <h4>{it.title}</h4>
              <p>{it.note}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* — Feuille de route priorisée — */
function RecoList({ r }) {
  return (
    <div className="bilan-recos">
      {[1, 2, 3].map((p) => (
        <div className="bilan-recos__group" key={p}>
          <span className="bilan-recos__p" aria-label={`Priorité ${p}`}>P{p}</span>
          <div className="bilan-recos__list">
            {r.items.filter((it) => it.p === p).map((it) => (
              <article className={`bilan-reco${it.done ? ' is-done' : ''}`} key={it.title}>
                <span className="bilan-reco__check" aria-hidden="true" />
                <div className="bilan-reco__body">
                  <h4>{it.title}</h4>
                  <p>{it.note}</p>
                  <div className="bilan-reco__meta">
                    <span>{r.impact} · {r.levels[it.impact]}</span>
                    <span>{r.effort} · {r.levels[it.effort]}</span>
                    <em>{it.done ? r.done : r.todo}</em>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ————————————————————————————————————————————————— */
/* — Hero compact : le 1er mot se forme en réseau, un dossier-glyphe 3D
     flotte à droite, les chips de mission arrivent en cascade, et le bilan
     commence juste dessous (fini l'écran blanc). — */
function BilanHero({ hero }) {
  const rootRef = useRef(null);
  const word = hero.title.split(' ')[0];
  const rest = hero.title.slice(word.length).replace(/^\s+/, '');

  useGSAP(() => {
    if (reduced()) return;
    gsap.from(rootRef.current.querySelectorAll('.bilan-hero__reveal'), {
      y: 26, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.1,
    });
    gsap.from(rootRef.current.querySelectorAll('.bilan-hero__chip'), {
      y: 14, autoAlpha: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06, delay: 0.5,
    });
  }, { scope: rootRef });

  return (
    <header className="bilan-hero" ref={rootRef}>
      <div className="container bilan-hero__grid">
        <div className="bilan-hero__copy">
          <p className="eyebrow eyebrow--index bilan-hero__reveal">{hero.eyebrow}</p>
          <h1 className="bilan-hero__title bilan-hero__reveal">
            <span className="bilan-hero__word">
              <span className="bilan-hero__ghost">{word}</span>
              <NetWord className="bilan-hero__netword">{word}</NetWord>
            </span>
            {rest ? ` ${rest}` : ''}
          </h1>
          <p className="bilan-hero__lead bilan-hero__reveal">{hero.lead}</p>
          <div className="bilan-hero__chips">
            {hero.chips.map((chip) => <span className="bilan-hero__chip" key={chip}>{chip}</span>)}
          </div>
        </div>
        <div className="bilan-hero__viz bilan-hero__reveal" aria-hidden="true">
          <span className="bilan-hero__glyph">
            <Net3D shape={GLYPH_SHAPES[0]} size={190} speed={0.6} tiltX={0.45} nodeR={3.2} />
          </span>
        </div>
      </div>
    </header>
  );
}

const TAB_IDS = ['resume', 'finances', 'temps', 'constats', 'carto', 'actions', 'recos'];

export default function Exemple() {
  const { lang } = useLang();
  const b = BILAN[lang];
  /* Deep-link : /exemple#carto ouvre directement le volet (partageable) */
  const [tab, setTab] = useState(() => {
    const h = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return TAB_IDS.includes(h) ? h : 'resume';
  });
  const goTab = (id) => {
    setTab(id);
    try { window.history.replaceState(null, '', `#${id}`); } catch { /* noop */ }
  };
  /* Suivre aussi les changements de hash (liens internes, précédent/suivant) */
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '');
      if (TAB_IDS.includes(h)) setTab(h);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const tabIndex = b.tabs.findIndex((t) => t.id === tab);

  return (
    <Page title={b.metaTitle} description={b.metaDesc}>
      {/* Hero COMPACT : une phrase, une animation, le bilan juste dessous */}
      <BilanHero key={lang} hero={b.hero} />

      {/* l'explorateur */}
      <section className="section section--tight">
        <div className="container bilan">
          <nav className="bilan__tabs" aria-label={b.hero.eyebrow}>
            {b.tabs.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`bilan__tab${tab === t.id ? ' is-on' : ''}`}
                aria-current={tab === t.id}
                onClick={() => goTab(t.id)}
              >
                <b>{String(i + 1).padStart(2, '0')}</b>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div className="bilan__panelwrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab + lang}
                className="bilan__panel"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="bilan__index">{String(tabIndex + 1).padStart(2, '0')} / {String(b.tabs.length).padStart(2, '0')}</p>

                {tab === 'resume' && (
                  <>
                    <MorphTitle as="h2" text={b.resume.title} textClass="bilan__h2" />
                    <p className="bilan__intro">{b.resume.verdict}</p>
                    <div className="bilan-stats">
                      {b.resume.stats.map((s) => <CountStat s={s} key={s.label} locale={lang} />)}
                    </div>
                    <ul className="bilan-points">
                      {b.resume.points.map((pt) => <li key={pt}>{pt}</li>)}
                    </ul>
                  </>
                )}

                {tab === 'finances' && (
                  <>
                    <MorphTitle as="h2" text={b.finances.title} textClass="bilan__h2" />
                    <div className="bilan-fin">
                      <div className="bilan-fin__col">
                        <h3>{b.finances.invest.heading}</h3>
                        {b.finances.invest.lines.map((l) => (
                          <div className="bilan-fin__line" key={l.label}><span>{l.label}</span><b>{l.value}</b></div>
                        ))}
                        <div className="bilan-fin__line bilan-fin__line--total">
                          <span>{b.finances.invest.total.label}</span><b>{b.finances.invest.total.value}</b>
                        </div>
                      </div>
                      <div className="bilan-fin__col bilan-fin__col--gains">
                        <h3>{b.finances.gains.heading}</h3>
                        {b.finances.gains.lines.map((l) => (
                          <div className="bilan-fin__line" key={l.label}><span>{l.label}</span><b>{l.value}</b></div>
                        ))}
                        <p className="bilan-note">{b.finances.gains.note}</p>
                      </div>
                    </div>
                    <div className="bilan-roi">
                      <CountStat s={b.finances.roi.stat} locale={lang} />
                      <div>
                        <h3>{b.finances.roi.label}</h3>
                        <p>{b.finances.roi.text}</p>
                      </div>
                    </div>
                  </>
                )}

                {tab === 'temps' && (
                  <>
                    <MorphTitle as="h2" text={b.temps.title} textClass="bilan__h2" />
                    <p className="bilan__intro">{b.temps.intro}</p>
                    <TimeRows t={b.temps} />
                  </>
                )}

                {tab === 'constats' && (
                  <>
                    <MorphTitle as="h2" text={b.constats.title} textClass="bilan__h2" />
                    <p className="bilan__intro">{b.constats.intro}</p>
                    <div className="bilan-quotes">
                      {b.constats.verbatims.map((v) => (
                        <blockquote className="bilan-quote" key={v.quote}>
                          <p>{v.quote}</p>
                          <cite>{v.role}</cite>
                        </blockquote>
                      ))}
                    </div>
                    <Findings c={b.constats} />
                  </>
                )}

                {tab === 'carto' && (
                  <>
                    <MorphTitle as="h2" text={b.carto.title} textClass="bilan__h2" />
                    <p className="bilan__intro">{b.carto.intro}</p>
                    <CartoMap c={b.carto} />
                  </>
                )}

                {tab === 'actions' && (
                  <>
                    <MorphTitle as="h2" text={b.actions.title} textClass="bilan__h2" />
                    <p className="bilan__intro">{b.actions.intro}</p>
                    <ActionsBoard a={b.actions} />
                  </>
                )}

                {tab === 'recos' && (
                  <>
                    <MorphTitle as="h2" text={b.recos.title} textClass="bilan__h2" />
                    <p className="bilan__intro">{b.recos.intro}</p>
                    <RecoList r={b.recos} />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* closing */}
      <section className="section">
        <div className="container">
          <div className="direct-band">
            <div className="direct-band__inner">
              <div className="direct-band__text">
                <h2 className="direct-band__title">{b.cta.title}</h2>
                <p>{b.cta.text}</p>
              </div>
              <Link to="/contact" className="btn btn--primary direct-band__btn" data-cursor-label={b.cta.btn}>
                {b.cta.btn}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
