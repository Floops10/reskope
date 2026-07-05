import { useEffect, useRef } from 'react';

/* Position souris (ou 1er point tactile) relative à containerRef, mise à jour
   dans un ref pour éviter les re-rendus — à lire dans une boucle rAF. */
export function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const setFromEvent = (x, y) => {
      const el = containerRef?.current;
      const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0 };
      positionRef.current = { x: x - rect.left, y: y - rect.top };
    };
    const onMouseMove = (e) => setFromEvent(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      const t = e.touches[0];
      if (t) setFromEvent(t.clientX, t.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}
