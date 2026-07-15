import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from '../lib/gsap';
import { scrollToTop } from '../lib/smoothScroll';

/* Changement de page = TOUJOURS repartir du haut.
   useLayoutEffect (avant peinture) + double application : la nouvelle page
   (souvent lazy) peut monter après coup et re-mesurer le document — on
   ré-applique donc après la transition pour que rien ne nous ramène en bas. */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    const toTop = () => {
      scrollToTop(true);
      window.scrollTo(0, 0);
    };
    toTop();
    const r = requestAnimationFrame(() => {
      toTop();
      ScrollTrigger.refresh();
    });
    const t1 = setTimeout(toTop, 250);
    const t2 = setTimeout(() => {
      toTop();
      ScrollTrigger.refresh();
    }, 650);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);
  return null;
}
