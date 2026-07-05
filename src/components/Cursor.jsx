import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export default function Cursor() {
  const dotRef   = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dot   = dotRef.current;
    const label = labelRef.current;
    if (!dot || !label) return;

    gsap.set(dot,   { autoAlpha: 0 });
    gsap.set(label, { autoAlpha: 0, scale: 0.75, xPercent: -50 });

    let visible = false;

    /* Texte du label — jamais le contenu visible de l'élément, toujours contextuel */
    const getLabel = (el) => {
      const target = el?.closest('a, button, .btn, [data-cursor-label]');
      if (!target) return null;

      // Attribut explicite — toujours prioritaire
      if (target.dataset.cursorLabel) return target.dataset.cursorLabel;

      // Logo → "Accueil"
      if (target.closest('.wordmark')) return 'Accueil';

      // Bascule de langue → pas de label (répète l'info visible)
      if (target.closest('[class*="lang"]') || target.dataset.lang) return null;

      // Burger menu
      if (target.closest('.nav__menu-btn')) return null;

      // Boutons d'action → intention générique
      if (
        target.classList.contains('btn--primary') ||
        target.classList.contains('btn--ghost') ||
        target.tagName === 'BUTTON'
      ) return 'Y aller';

      // Liens de nav menu → nom de la page
      if (target.classList.contains('navmenu__link')) {
        const txt = target.querySelector('.navmenu__text')?.textContent?.trim();
        return txt || 'Explorer';
      }

      // Liens de navigation ordinaires → pas de label (déjà lisible)
      if (target.tagName === 'A') return null;

      return null;
    };

    /* Remonte le DOM jusqu'au premier fond non transparent */
    const getComputedBg = (el) => {
      let node = el;
      while (node && node !== document.body) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
        node = node.parentElement;
      }
      return null;
    };

    const isDark = (bg) => {
      if (!bg) return false;
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return false;
      return (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.35;
    };

    const applyDark = (el) => {
      const dark = isDark(getComputedBg(el));
      dot.classList.toggle('cursor-dot--dark', dark);
      label.classList.toggle('cursor-label--dark', dark);
    };

    const onMove = (e) => {
      gsap.set(dot,   { x: e.clientX, y: e.clientY });
      gsap.set(label, { x: e.clientX, y: e.clientY - 36 });
      if (!visible) {
        visible = true;
        gsap.to(dot, { autoAlpha: 1, duration: 0.35 });
      }
      // Détecte fond sombre sous le curseur (pointer-events:none → retourne l'élément dessous)
      const under = document.elementFromPoint(e.clientX, e.clientY);
      applyDark(under);
    };

    const onOver = (e) => {
      const isHover = !!e.target.closest('a, button, .btn, [data-cursor-hover]');
      dot.classList.toggle('cursor-dot--hover', isHover);

      const txt = getLabel(e.target);
      if (txt) {
        label.textContent = txt;
        gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.22, ease: 'back.out(1.4)' });
      } else {
        gsap.to(label, { autoAlpha: 0, scale: 0.75, duration: 0.16 });
      }
    };

    const hide = () => {
      gsap.to(dot,   { autoAlpha: 0, duration: 0.28 });
      gsap.to(label, { autoAlpha: 0, scale: 0.75, duration: 0.18 });
    };
    const show = () => { if (visible) gsap.to(dot, { autoAlpha: 1, duration: 0.28 }); };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.documentElement.removeEventListener('mouseenter', show);
    };
  }, []);

  return (
    <>
      <div ref={dotRef}   className="cursor-dot"   aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
}
