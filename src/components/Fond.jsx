import { useEffect, useRef } from 'react';
import { mouvementRefuse } from '../lib/scrub';

/* ============================================================
   LA TRAME — le réseau de la marque, derrière tout le site.

   Des nœuds qui dérivent lentement, et un lien qui se tend entre deux nœuds
   dès qu'ils sont assez proches : le réseau ne se dessine pas, il se
   fabrique tout seul sous les yeux. C'est l'idée même de ce qu'on vend, en
   fond de page. Le curseur attire légèrement ce qui passe à sa portée, alors
   la trame répond quand on bouge, sans jamais devenir un jeu.

   Elle est posée une seule fois, en fixe, derrière le contenu de toutes les
   pages. Les sections qui ont leur propre fond la recouvrent : une scène
   sombre reste une scène sombre, la trame ne vient pas la salir.

   Tenue en canvas et non en SVG : quarante nœuds redessinés soixante fois
   par seconde, c'est un seul élément dans le document au lieu de cent
   cinquante à déplacer. Et elle s'arrête dès que l'onglet passe derrière.
   ============================================================ */

const NOEUDS = 42;
const PORTEE = 168;        // distance en deçà de laquelle un lien se tend
const AIMANT = 190;        // portée du curseur
const VITESSE = 0.16;

export default function Fond() {
  const toile = useRef(null);

  useEffect(() => {
    const cv = toile.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d', { alpha: true });
    const fige = mouvementRefuse();

    let L = 0, H = 0, dpr = 1;
    let pts = [];
    const souris = { x: -9999, y: -9999 };
    let raf = 0;

    const semer = () => {
      pts = Array.from({ length: NOEUDS }, () => ({
        x: Math.random() * L,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * VITESSE,
        vy: (Math.random() - 0.5) * VITESSE,
        r: 1 + Math.random() * 1.4,
      }));
    };

    const mesurer = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      L = window.innerWidth;
      H = window.innerHeight;
      cv.width = Math.round(L * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${L}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!pts.length) semer();
    };

    const dessiner = () => {
      ctx.clearRect(0, 0, L, H);

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > PORTEE * PORTEE) continue;
          /* Le lien se tend d'autant plus qu'il est court : l'apparition est
             progressive, jamais un trait qui clignote. */
          const f = 1 - Math.sqrt(d2) / PORTEE;
          ctx.strokeStyle = `rgba(28, 12, 179, ${(f * 0.16).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(28, 12, 179, 0.26)';
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const pas = () => {
      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = L + 20; else if (p.x > L + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;

        const dx = souris.x - p.x;
        const dy = souris.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < AIMANT * AIMANT && d2 > 1) {
          const f = (1 - Math.sqrt(d2) / AIMANT) * 0.035;
          p.x += dx * f;
          p.y += dy * f;
        }
      }
      dessiner();
      raf = requestAnimationFrame(pas);
    };

    const bouger = (e) => { souris.x = e.clientX; souris.y = e.clientY; };
    const partir = () => { souris.x = -9999; souris.y = -9999; };
    /* Un onglet en arrière-plan ne doit rien calculer. */
    const visibilite = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!document.hidden && !fige) raf = requestAnimationFrame(pas);
    };

    mesurer();
    window.addEventListener('resize', mesurer);
    document.addEventListener('visibilitychange', visibilite);
    if (fige) {
      dessiner();
    } else {
      window.addEventListener('pointermove', bouger, { passive: true });
      window.addEventListener('pointerleave', partir);
      raf = requestAnimationFrame(pas);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', mesurer);
      document.removeEventListener('visibilitychange', visibilite);
      window.removeEventListener('pointermove', bouger);
      window.removeEventListener('pointerleave', partir);
    };
  }, []);

  return <canvas className="fond" ref={toile} aria-hidden="true" />;
}
