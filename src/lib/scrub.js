/* Scrub maison — pilote une progression 0→1 au scroll, lissée en rAF.

   instant() : true si on ne peut pas animer (reduced-motion, ou onglet caché où
   requestAnimationFrame est gelé). Dans ce cas on affiche l'état FINAL plutôt que
   l'état initial, pour ne jamais montrer un contenu « avant animation » figé. */
export function instant() {
  if (typeof window === 'undefined') return true;
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.hidden
  );
}

/* La même question, mais sans le « l'onglet est caché ». Une animation
   déclenchée par le visiteur lui-même (un survol, un focus) ne peut pas
   commencer dans un onglet caché ; en revanche, la monter dépend de l'état
   de l'onglet au moment du MONTAGE, et un onglet ouvert en arrière-plan
   resterait figé une fois revenu au premier plan. Le navigateur ralentit
   déjà requestAnimationFrame dans les onglets cachés : il n'y a rien à
   économiser de plus. */
export function mouvementRefuse() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function pinProgress(el) {
  const total = el.offsetHeight - window.innerHeight;
  if (total <= 0) return 0;
  return Math.min(Math.max(-el.getBoundingClientRect().top / total, 0), 1);
}

export function enterProgress(el, startRatio = 0.85, endRatio = 0.45) {
  const vh = window.innerHeight;
  const start = vh * startRatio;
  const end = vh * endRatio;
  const top = el.getBoundingClientRect().top;
  return Math.min(Math.max((start - top) / (start - end), 0), 1);
}

export function scrollProgress() {
  return Math.min(window.scrollY / window.innerHeight, 1);
}

export function makeScrub(getProgress, render, { smooth = 0.16 } = {}) {
  // Onglet caché / reduced-motion : on fige sur l'état final (progress 1).
  if (instant()) {
    render(1);
    return () => {};
  }
  let cur = getProgress();
  let target = cur;
  let raf;
  render(cur);
  const onScroll = () => {
    target = getProgress();
  };
  const tick = () => {
    cur += (target - cur) * smooth;
    if (Math.abs(target - cur) < 0.0004) cur = target;
    render(cur);
    raf = requestAnimationFrame(tick);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  raf = requestAnimationFrame(tick);
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    cancelAnimationFrame(raf);
  };
}
