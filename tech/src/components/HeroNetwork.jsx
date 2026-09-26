import { useRef, useEffect } from 'react';
import { instant } from '../lib/scrub';

/* Réseau VIVANT en fond de hero : des nœuds dérivent lentement, des liens
   se tissent entre les plus proches, et se tendent vers le curseur quand il
   passe — la trame de la marque, discrète et en mouvement. Canvas (perf).
   Indigo à faible opacité sur crème. reduced-motion => trame figée légère. */
const INDIGO = '28, 12, 179';

export default function HeroNetwork({ count = 26 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0, h = 0, raf = null;
    const mouse = { x: -9999, y: -9999 };
    let nodes = [];

    const seed = () => {
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 0.8 + Math.random() * 1.6,
      }));
    };

    const resize = () => {
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!nodes.length) seed();
    };

    const linkDist = () => Math.min(w, h) * 0.2;
    const cursorDist = 210;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const LD = linkDist();

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // liens entre nœuds proches
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < LD) {
            const a = (1 - d / LD) * 0.13;
            ctx.strokeStyle = `rgba(${INDIGO},${a.toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        // Liaison au curseur : les nœuds proches se relient ET sont ATTIRÉS
        // vers le curseur (le réseau réagit au curseur — signature de la marque)
        const dc = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        if (dc < cursorDist) {
          const a = (1 - dc / cursorDist) * 0.5;
          ctx.strokeStyle = `rgba(${INDIGO},${a.toFixed(3)})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
          n.x += (mouse.x - n.x) * 0.0022;
          n.y += (mouse.y - n.y) * 0.0022;
        }

        ctx.fillStyle = `rgba(${INDIGO},${(0.2 + (dc < cursorDist ? 0.45 * (1 - dc / cursorDist) : 0)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();

    if (instant()) {
      // figé : une seule passe lisible
      draw();
      cancelAnimationFrame(raf);
      window.addEventListener('resize', resize);
      return () => window.removeEventListener('resize', resize);
    }

    const onMouse = (e) => {
      const r = parent.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };

    window.addEventListener('mousemove', onMouse, { passive: true });
    parent.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      parent.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="hero2__net" aria-hidden="true" />;
}
