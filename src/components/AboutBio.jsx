import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

const PHOTO = 'https://www.image2url.com/r2/default/images/1782253442600-884214d2-7945-4d3c-b79f-6b7586efd15b.png';

/* Scène "portrait" cinématique :
   Desktop — section collante 340svh :
     Layer 1 : formule d'intro plein écran (visible dès l'entrée)
     Layer 2 : grille 3 col (greeting gauche | photo centre | bio droite)
     Scroll 0–15 % : Layer 1 reste, le lecteur a le temps de lire
     Scroll 12–30 % : cross-fade Layer 1 → Layer 2
     Scroll 22–65 % : photo se révèle (clip-path)
     Scroll 52–80 % : colonne bio glisse depuis la droite
   Mobile — révélations séquentielles sans sticky */
export default function AboutBio({ hello, bio, photoAlt }) {
  const sceneRef    = useRef(null);
  const layer1Ref   = useRef(null);
  const layer2Ref   = useRef(null);
  const photoWrapRef = useRef(null);
  const imgRef      = useRef(null);
  const bioColRef   = useRef(null);
  const q1Ref       = useRef(null);
  const q2Ref       = useRef(null);

  useGSAP(
    () => {
      if (instant()) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 881px)', () => {
        gsap.set(layer1Ref.current, { autoAlpha: 1 });
        gsap.set(layer2Ref.current, { autoAlpha: 0 });
        gsap.set(photoWrapRef.current, { clipPath: 'inset(0% 0% 100% 0% round 16px)' });
        gsap.set(imgRef.current, { yPercent: -12 });
        gsap.set(bioColRef.current, { autoAlpha: 0, x: 52 });
        gsap.set([q1Ref.current, q2Ref.current], { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sceneRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
          defaults: { ease: 'power3.out' },
        });

        tl
          .to(layer1Ref.current,    { autoAlpha: 0, duration: 0.18 }, 0.12)
          .to(layer2Ref.current,    { autoAlpha: 1, duration: 0.18 }, 0.19)
          .to(photoWrapRef.current, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 0.46 }, 0.23)
          .to(imgRef.current,       { yPercent: 12, ease: 'none', duration: 1 }, 0)
          .to([q1Ref.current, q2Ref.current], { autoAlpha: 0.38, duration: 0.24 }, 0.32)
          .to(q1Ref.current,        { y: -55, ease: 'none', duration: 0.7 }, 0.26)
          .to(q2Ref.current,        { y: 48,  ease: 'none', duration: 0.7 }, 0.26)
          .to(bioColRef.current,    { autoAlpha: 1, x: 0, duration: 0.36 }, 0.53);
      });

      mm.add('(max-width: 880px)', () => {
        gsap.from(photoWrapRef.current, {
          clipPath: 'inset(0% 0% 100% 0% round 12px)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: photoWrapRef.current, start: 'top 82%' },
        });
        bioColRef.current?.querySelectorAll('p').forEach((p) => {
          gsap.from(p, {
            autoAlpha: 0,
            y: 22,
            duration: 0.72,
            ease: 'power3.out',
            scrollTrigger: { trigger: p, start: 'top 89%' },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sceneRef }
  );

  return (
    <section className="about-bio" ref={sceneRef}>
      <div className="about-bio__stage">

        {/* Guillemets décoratifs (desktop) */}
        <span ref={q1Ref} className="about-bio__quote about-bio__quote--open" aria-hidden="true">«</span>
        <span ref={q2Ref} className="about-bio__quote about-bio__quote--close" aria-hidden="true">»</span>

        {/* Layer 1 : greeting plein écran */}
        <div className="about-bio__layer1" ref={layer1Ref} aria-hidden="true">
          <h2 className="about-bio__hero-text">{hello}</h2>
        </div>

        {/* Layer 2 : grille 3 colonnes */}
        <div className="about-bio__layer2 container" ref={layer2Ref}>
          <div className="about-bio__left">
            <h2 className="about-bio__greeting">{hello}</h2>
          </div>

          <div className="about-bio__photo-wrap" ref={photoWrapRef}>
            <img
              ref={imgRef}
              src={PHOTO}
              alt={photoAlt}
              className="about-bio__img"
              loading="lazy"
            />
          </div>

          <div className="about-bio__right" ref={bioColRef}>
            {bio.map((p, i) => (
              <p key={i} className="about-bio__p">{p}</p>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
