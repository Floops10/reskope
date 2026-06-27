import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMagnetic } from '../animations/magnetic';

/* Couche d'interactions globales (réattachée à chaque page car le DOM des
   boutons change avec la route). Aujourd'hui : CTA magnétiques. */
export default function Interactions() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cleanup = () => {};
    const id = requestAnimationFrame(() => {
      cleanup = initMagnetic();
    });
    return () => {
      cancelAnimationFrame(id);
      cleanup();
    };
  }, [pathname]);

  return null;
}
