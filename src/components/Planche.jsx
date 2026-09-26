import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import AxoScene from './AxoScene';

/* ════════════════════════════════════════════════════════════
   UNE PLANCHE — une scène de mission, posée dans la page.

   La même géométrie que la ville et que l'explorateur, projetée à plat pour
   les endroits où un moteur 3D serait de trop. Elle n'apparaît pas : elle
   arrive de la profondeur, couchée, se redresse, puis flotte à peine, comme
   tout ce qui vit sur ce site.
   ════════════════════════════════════════════════════════════ */

export default function Planche({ scene, etape = 0, legende, titre, noms = true, className = '' }) {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    gsap.from(racine.current.querySelector('.pl__vol'), {
      z: -640, rotateX: 42, y: 70, autoAlpha: 0,
      duration: 1.3, ease: 'power3.out',
      scrollTrigger: { trigger: racine.current, start: 'top 84%' },
    });
    if (legende) {
      gsap.from(racine.current.querySelector('.pl__legende'), {
        z: -300, y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out', delay: 0.4,
        scrollTrigger: { trigger: racine.current, start: 'top 84%' },
      });
    }
  }, { scope: racine });

  return (
    <figure className={`pl ${className}`} ref={racine} data-soi>
      <div className="pl__vol">
        <div className="pl__flotte">
          <AxoScene nom={scene} etape={etape} noms={noms} titre={titre || legende} />
        </div>
      </div>
      {legende && <figcaption className="pl__legende">{legende}</figcaption>}
    </figure>
  );
}
