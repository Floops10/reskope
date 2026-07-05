import { useRef } from 'react';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

/* MorphTitle — le morph signature du hero, réutilisable partout :
   au survol, chaque lettre BASCULE sur elle-même (vague gauche→droite)
   et se relève en police RÉSEAU Reskope — même taille, même place
   (calque superposé). Une timeline play/reverse : fluide, interruptible.
   `textClass` = classes typographiques appliquées aux DEUX couches.
   `intro` = arrivée des lettres en cascade au montage.
   Desktop + pointeur fin uniquement ; instant() : couche réseau masquée. */
export default function MorphTitle({
  as: Tag = 'h2',
  text,
  textClass = '',
  wrapClass = '',
  netClass = '',
  intro = false,
  id,
}) {
  const wrapRef = useRef(null);
  const baseRef = useRef(null);
  const netRef = useRef(null);

  useGSAP(() => {
    const net = netRef.current;
    if (instant()) {
      gsap.set(net, { autoAlpha: 0 });
      return;
    }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      gsap.set(net, { autoAlpha: 0 });
      return;
    }

    let sBase = null;
    let sNet = null;
    try {
      sBase = new SplitText(baseRef.current, { type: 'words,chars' });
      sNet = new SplitText(net, { type: 'words,chars' });
    } catch {
      gsap.set(net, { autoAlpha: 0 });
      return;
    }
    gsap.set(sNet.chars, { autoAlpha: 0 });

    if (intro) {
      gsap.from(sBase.chars, {
        yPercent: 112, autoAlpha: 0, duration: 0.85,
        ease: 'power4.out', stagger: 0.012, delay: 0.15,
      });
    }

    const tl = gsap.timeline({ paused: true });
    tl.to(sBase.chars, {
      rotationX: -92, autoAlpha: 0,
      transformOrigin: '50% 100%',
      duration: 0.3, ease: 'power2.in',
      stagger: { each: 0.011 },
    }, 0);
    tl.fromTo(sNet.chars,
      { rotationX: 92, autoAlpha: 0, transformOrigin: '50% 0%' },
      { rotationX: 0, autoAlpha: 1, duration: 0.48, ease: 'back.out(1.5)', stagger: { each: 0.011 } },
      0.13);

    const onEnter = () => tl.timeScale(1).play();
    const onLeave = () => tl.timeScale(1.35).reverse();
    const wrap = wrapRef.current;
    wrap.addEventListener('pointerenter', onEnter);
    wrap.addEventListener('pointerleave', onLeave);

    return () => {
      wrap.removeEventListener('pointerenter', onEnter);
      wrap.removeEventListener('pointerleave', onLeave);
      sBase?.revert();
      sNet?.revert();
    };
    // `key={text}` (JSX) remonte les titres au changement de langue → DOM
    // neuf pour SplitText ; revertOnUpdate nettoie l'ancien contexte avant.
  }, { scope: wrapRef, dependencies: [text], revertOnUpdate: true });

  return (
    <span className={`morph ${wrapClass}`} ref={wrapRef}>
      <Tag key={text} className={`morph__base ${textClass}`} ref={baseRef} id={id}>{text}</Tag>
      <span key={`${text}·net`} className={`morph__net ${textClass} ${netClass}`} aria-hidden="true" ref={netRef}>
        {text}
      </span>
    </span>
  );
}
