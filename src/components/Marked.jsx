import { useRef, useEffect } from 'react';
import { instant } from '../lib/scrub';

/* Souligne un mot-clé dans une phrase avec un trait SVG « tracé main »
   qui se dessine quand le mot entre dans le viewport. Le reste de la
   phrase est rendu normalement. `word` doit être présent dans `text`. */
const D = 'M0 8 C 67 4 133 12 200 8';

export default function Marked({ text, word, as: Tag = 'span', className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const path = ref.current?.querySelector('.kw__line');
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    if (instant()) {
      path.style.strokeDashoffset = '0';
      return;
    }
    path.style.strokeDashoffset = `${len}`;
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            path.style.transition = 'stroke-dashoffset 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.2s';
            path.style.strokeDashoffset = '0';
            obs.disconnect();
          }
        });
      },
      { threshold: 0.55 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [text, word]);

  if (!word || !text.includes(word)) {
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }
  const i = text.indexOf(word);
  return (
    <Tag ref={ref} className={className}>
      {text.slice(0, i)}
      <span className="kw">
        {word}
        <svg className="kw__svg" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
          <path className="kw__line" d={D} />
        </svg>
      </span>
      {text.slice(i + word.length)}
    </Tag>
  );
}
