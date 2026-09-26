import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMagnetic } from '../animations/magnetic';
import { initInclinaison } from '../animations/inclinaison';

/* Couche d'interactions globales (réattachée à chaque page car le DOM des
   boutons change avec la route) : CTA magnétiques, et cartes qui
   s'inclinent sous la souris (data-incliner). */
export default function Interactions() {
  const { pathname } = useLocation();

  /* L'inclinaison écoute le document entier : elle n'a pas besoin d'être
     rattachée à chaque page. */
  useEffect(() => initInclinaison(), []);

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
