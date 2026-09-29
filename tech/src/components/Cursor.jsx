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

      /* Un choix, un onglet, une question qui se déplie, une fermeture :
         ce ne sont pas des destinations, « Y aller » n'y a pas de sens. */
      if (
        target.matches('[role="radio"], [role="tab"], [aria-pressed], [aria-expanded], [aria-label="Fermer"], [aria-label="Close"]')
      ) return null;

      // Boutons d'action → intention générique
      if (
        target.classList.contains('btn--primary') ||
        target.classList.contains('btn--ghost')
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

    /* LE CURSEUR RESTE VISIBLE SUR TOUT.
       Il porte la couleur d'action de la marque (l'ambre de Create, le vert
       de Define, le bleu d'Elevate). Sur un fond de la même famille (un
       bouton, le pied de page, une scène de nuit), il disparaissait. On
       mesure donc, sous le pointeur, le contraste entre sa couleur et le
       fond réel ; s'il tombe sous 3:1 (le seuil des éléments graphiques),
       il passe en crème, ou en encre si le crème ne se voit pas mieux. */
    const lire = (txt) => {
      if (!txt) return null;
      let m = txt.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
      if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
      m = txt.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)/);
      if (m) return [m[1] * 255, m[2] * 255, m[3] * 255, m[4] === undefined ? 1 : +m[4]];
      m = txt.trim().match(/^#([0-9a-f]{6})$/i);
      if (m) { const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255, 1]; }
      return null;
    };
    const luminance = ([r, g, b]) => {
      const f = (c) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const contraste = (a, b) => {
      const [x, y] = [luminance(a), luminance(b)].sort((u, v) => v - u);
      return (x + 0.05) / (y + 0.05);
    };

    /* Le fond réel sous le pointeur : le premier fond assez couvrant en
       remontant le DOM, et à défaut celui de la page. Un bouton survolé se
       remplit d'une autre couleur par un pseudo-élément (le cercle qui
       grandit depuis la flèche) : c'est ce remplissage qui compte. */
    const couvrant = (c) => c && c[3] >= 0.5;
    const fondSous = (el) => {
      for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
        if (node.matches(':hover')) {
          const avant = lire(getComputedStyle(node, '::before').backgroundColor);
          if (couvrant(avant) && node.matches('.btn, [data-cursor-hover]')) return avant;
        }
        const c = lire(getComputedStyle(node).backgroundColor);
        if (couvrant(c)) return c;
      }
      return lire(getComputedStyle(document.body).backgroundColor);
    };

    const TEINTES = ['cursor-dot--dark', 'cursor-dot--encre'];
    const appliquer = (el) => {
      const fond = fondSous(el);
      const racine = getComputedStyle(document.documentElement);
      const action = lire(racine.getPropertyValue('--indigo'));
      let teinte = null;
      if (fond && action && contraste(action, fond) < 3) {
        const creme = lire(racine.getPropertyValue('--cream-light')) || [247, 245, 240, 1];
        const encre = lire(racine.getPropertyValue('--ink')) || [14, 11, 31, 1];
        teinte = contraste(creme, fond) >= contraste(encre, fond) ? 'dark' : 'encre';
      }
      TEINTES.forEach((t) => dot.classList.toggle(t, t === `cursor-dot--${teinte}`));
      label.classList.toggle('cursor-label--dark', teinte === 'dark');
      label.classList.toggle('cursor-label--encre', teinte === 'encre');
    };

    /* Une mesure par image, pas une par mouvement de souris. Et au survol,
       deux mesures de plus, le temps que le remplissage du bouton se fasse. */
    let attente = null;
    let dernier = null;
    let relances = [];
    const mesurer = () => {
      attente = null;
      if (dernier) appliquer(document.elementFromPoint(dernier[0], dernier[1]));
    };
    const remesurer = () => {
      relances.forEach(clearTimeout);
      relances = [250, 620].map((d) => setTimeout(mesurer, d));
    };

    const onMove = (e) => {
      gsap.set(dot,   { x: e.clientX, y: e.clientY });
      gsap.set(label, { x: e.clientX, y: e.clientY - 36 });
      if (!visible) {
        visible = true;
        gsap.to(dot, { autoAlpha: 1, duration: 0.35 });
      }
      // Le fond sous le curseur (pointer-events:none → l'élément dessous), mesuré à la prochaine image.
      dernier = [e.clientX, e.clientY];
      if (!attente) attente = requestAnimationFrame(mesurer);
    };

    const onOver = (e) => {
      const isHover = !!e.target.closest('a, button, .btn, [data-cursor-hover]');
      dot.classList.toggle('cursor-dot--hover', isHover);
      if (!attente) attente = requestAnimationFrame(mesurer);
      remesurer();

      /* Au-dessus d'une scène qu'on attrape, le point devient une prise :
         un anneau assez grand pour qu'on le voie sur le plateau, et qui se
         referme quand on serre. Un point de six pixels ne suffisait pas là
         où il faut justement comprendre qu'on peut tourner l'objet. */
      dot.classList.toggle('cursor-dot--prise', !!e.target.closest('[data-cursor-prise]'));

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

    const serrer = () => dot.classList.add('cursor-dot--serre');
    const relacher = () => dot.classList.remove('cursor-dot--serre');

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('pointerdown', serrer, { passive: true });
    document.addEventListener('pointerup', relacher, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);
    document.documentElement.addEventListener('mouseenter', show);

    return () => {
      cancelAnimationFrame(attente);
      relances.forEach(clearTimeout);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('pointerdown', serrer);
      document.removeEventListener('pointerup', relacher);
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
