import { useRef, useEffect } from 'react';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   LA TRAME DE FOND — le réseau de la marque, derrière tout le site.

   Quelques nœuds dérivent lentement, les plus proches se relient, et le
   réseau se tend vers la souris quand elle passe. Canvas (performance),
   indigo très léger sur crème.

   Trois règles, apprises à l'usage :
   - la densité suit la surface de l'écran : le même nombre de nœuds sur un
     téléphone et sur un grand écran faisait, sur le téléphone, une toile
     serrée derrière le texte ;
   - seule une SOURIS attire le réseau. Un doigt qui touche l'écran pour
     défiler ou pour appuyer sur un bouton envoyait tout le réseau vers ce
     point, et il y restait ;
   - rien ne tourne quand l'onglet est caché.
   Mouvement réduit : une seule image, figée.
   ════════════════════════════════════════════════════════════ */

const INDIGO = '28, 12, 179';
const densite = (w, h) => Math.max(7, Math.min(16, Math.round((w * h) / 80000)));

export default function HeroNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let raf = null;
    const souris = { x: -9999, y: -9999 };
    const nodes = [];

    const nouveau = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      r: 0.8 + Math.random() * 1.5,
    });

    const resize = () => {
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = densite(w, h);
      while (nodes.length < n) nodes.push(nouveau());
      nodes.length = n;
      nodes.forEach((p) => { p.x = Math.min(p.x, w); p.y = Math.min(p.y, h); });
    };

    const LIEN = () => Math.min(Math.min(w, h) * 0.2, 200);
    const ATTRAIT = 190;

    const dessiner = (bouger) => {
      ctx.clearRect(0, 0, w, h);
      const LD = LIEN();
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (bouger) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const d = Math.hypot(n.x - m.x, n.y - m.y);
          if (d < LD) {
            ctx.strokeStyle = `rgba(${INDIGO},${((1 - d / LD) * 0.07).toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
        /* La souris : les nœuds proches s'y relient et s'en approchent. */
        const dc = Math.hypot(n.x - souris.x, n.y - souris.y);
        const pres = dc < ATTRAIT ? 1 - dc / ATTRAIT : 0;
        if (pres > 0) {
          ctx.strokeStyle = `rgba(${INDIGO},${(pres * 0.42).toFixed(3)})`;
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(souris.x, souris.y);
          ctx.stroke();
          if (bouger) {
            n.x += (souris.x - n.x) * 0.002;
            n.y += (souris.y - n.y) * 0.002;
          }
        }
        ctx.fillStyle = `rgba(${INDIGO},${(0.13 + 0.42 * pres).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    resize();

    if (instant()) {
      dessiner(false);
      const figer = () => { resize(); dessiner(false); };
      window.addEventListener('resize', figer);
      return () => window.removeEventListener('resize', figer);
    }

    const boucle = () => {
      dessiner(true);
      raf = requestAnimationFrame(boucle);
    };
    const onPointer = (e) => {
      if (e.pointerType !== 'mouse') return;
      souris.x = e.clientX;
      souris.y = e.clientY;
    };
    const oublier = () => { souris.x = -9999; souris.y = -9999; };
    const onVisibilite = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        raf = requestAnimationFrame(boucle);
      }
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', oublier);
    window.addEventListener('blur', oublier);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibilite);
    raf = requestAnimationFrame(boucle);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', oublier);
      window.removeEventListener('blur', oublier);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilite);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero2__net" aria-hidden="true" />;
}
