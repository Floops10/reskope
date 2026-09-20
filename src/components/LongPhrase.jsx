import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';

/* ============================================================
   LA PHRASE — les mots arrivent de la profondeur.

   Ils étaient simplement passés d'un gris pâle au noir, mot après mot : une
   animation à plat, du genre qu'on voit partout. Ici chacun vient de loin
   derrière la page, incliné, et se redresse à sa place — le texte se compose
   dans l'espace au lieu de s'allumer sur une feuille.

   Chaque mot part d'une distance et d'une inclinaison qui lui sont propres,
   tirées de son rang : deux mots voisins n'arrivent jamais du même endroit,
   et la séquence reste pourtant la même à chaque lecture.

   Le mouvement reste piloté par le défilement : on avance dans la phrase, on
   ne la subit pas. Mouvement réduit : tout est posé, rien ne bouge.
   ============================================================ */

/* Un nombre stable tiré du rang du mot. */
const grain = (i, sel) => {
  const v = Math.sin(i * 12.9898 + sel * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

export default function LongPhrase({ text }) {
  const racine = useRef(null);
  const phrase = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let split = null;
    try {
      split = new SplitText(phrase.current, { type: 'words' });

      gsap.set(split.words, {
        opacity: 0,
        z: (i) => -700 - grain(i, 1) * 500,
        y: (i) => (grain(i, 2) - 0.5) * 90,
        x: (i) => (grain(i, 3) - 0.5) * 70,
        rotateX: (i) => -40 - grain(i, 4) * 45,
        rotateZ: (i) => (grain(i, 5) - 0.5) * 24,
        transformOrigin: '50% 50%',
        willChange: 'transform, opacity',
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: racine.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      }).to(split.words, {
        opacity: 1,
        z: 0,
        y: 0,
        x: 0,
        rotateX: 0,
        rotateZ: 0,
        ease: 'power2.out',
        stagger: { each: 0.32 },
        duration: 1,
      });
    } catch {
      /* Sans découpe en mots, la phrase reste lisible : c'est l'essentiel. */
    }

    return () => split?.revert();
  }, { scope: racine });

  return (
    <section className="long-phrase" ref={racine}>
      <div className="long-phrase__stage">
        <p className="long-phrase__text" ref={phrase}>{text}</p>
      </div>
    </section>
  );
}
