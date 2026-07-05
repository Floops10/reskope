import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* Texte réactif au curseur : chaque lettre s'illumine (échelle + couleur)
   selon sa proximité à la souris — les lettres se comportent comme des
   nœuds du réseau qui « s'allument » au passage. `hot` = couleur d'allumage
   (indigo par défaut ; passer une teinte claire sur fond sombre). */
export default function NetworkText({ as: Tag = 'span', text, className = '', radius = 90, hot = '#1c0cb3' }) {
  const ref = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const el = ref.current;
    let split;
    try {
      // words,chars : les lettres restent groupées par mot → pas de coupure
      // en plein milieu d'un mot lors du retour à la ligne.
      split = new SplitText(el, { type: 'words,chars' });
    } catch {
      return;
    }

    const restColor = getComputedStyle(el).color;
    const setters = split.chars.map((ch) => {
      const scaleX = gsap.quickTo(ch, 'scaleX', { duration: 0.4, ease: 'power2.out' });
      const scaleY = gsap.quickTo(ch, 'scaleY', { duration: 0.4, ease: 'power2.out' });
      return {
        scale: (v) => { scaleX(v); scaleY(v); },
        color: gsap.quickTo(ch, 'color', { duration: 0.4, ease: 'power2.out' }),
      };
    });

    let mouseX = -9999;
    let mouseY = -9999;
    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener('mousemove', onMove);

    let raf;
    const tick = () => {
      split.chars.forEach((ch, i) => {
        const r = ch.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(mouseX - cx, mouseY - cy);
        const proximity = Math.exp(-((d / radius) ** 2));
        setters[i].scale(1 + proximity * 0.22);
        setters[i].color(proximity > 0.02 ? gsap.utils.interpolate(restColor, hot, proximity) : restColor);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      split.revert();
    };
  }, { scope: ref });

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
