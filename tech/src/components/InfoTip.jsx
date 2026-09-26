import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* ⓘ accessible — popover rendu en portail + position clampée au viewport
   (ne dépasse jamais l'écran, contrairement à un positionnement absolu). */
export default function InfoTip({ children, label = 'Plus d’informations' }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 300 });
  const btnRef = useRef(null);
  const popRef = useRef(null);
  const id = useId();

  const place = () => {
    const b = btnRef.current?.getBoundingClientRect();
    if (!b) return;
    const width = Math.min(300, window.innerWidth - 32);
    let left = b.left + b.width / 2 - width / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - width - 16));
    setPos({ top: b.bottom + 10, left, width });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onDoc = (e) => {
      if (!btnRef.current?.contains(e.target) && !popRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDoc);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open]);

  return (
    <span className="infotip">
      <button
        ref={btnRef}
        type="button"
        className="infotip__btn"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((o) => !o)}
      >
        i
      </button>
      {open &&
        createPortal(
          <span
            ref={popRef}
            id={id}
            role="tooltip"
            className="infotip__pop"
            style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }}
          >
            {children}
          </span>,
          document.body
        )}
    </span>
  );
}
