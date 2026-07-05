import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instant } from '../lib/scrub';
import { Reveal, RevealItem } from './Reveal';
import RiseText from './RiseText';

const TOOLS = [
  'Notion', 'Airtable', 'Make', 'n8n', 'Webflow',
  'Supabase', 'Slack', 'HubSpot', 'Figma', 'Pipedrive',
  'Bubble', 'Monday', 'Zapier',
];

/* Nœuds distribués sur le pourtour — le réseau encadre le texte central */
const INIT_POS = [
  [0.04, 0.08], [0.96, 0.12], [0.06, 0.92], [0.94, 0.88], [0.02, 0.50],
  [0.98, 0.50], [0.48, 0.03], [0.52, 0.97], [0.18, 0.20], [0.82, 0.78],
  [0.15, 0.80], [0.85, 0.22], [0.50, 0.06],
];

const INDIGO = '#1C0CB3';

export default function WhyReskope({ c }) {
  const sectionRef = useRef(null);
  const canvasRef  = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas  = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w, h, maxDist;
    let fadeProgress = 0;
    let visible      = false;
    let raf          = null;

    const setup = () => {
      w = section.offsetWidth;
      h = section.offsetHeight;
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maxDist = Math.min(w, h) * 0.30;
      hub.x = w * 0.50;
      hub.y = h * 0.50;
    };

    /* Init nœuds outils */
    const nodes = TOOLS.map((label, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.18 + Math.random() * 0.18;
      return {
        x: INIT_POS[i][0] * (section.offsetWidth || 1280),
        y: INIT_POS[i][1] * (section.offsetHeight || 720),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        label,
        isHub: false,
        alpha: 0,
      };
    });

    /* Hub R */
    const hub = {
      x: (section.offsetWidth || 1280) * 0.50,
      y: (section.offsetHeight || 720) * 0.50,
      vx: 0, vy: 0, label: 'R', isHub: true, alpha: 0,
    };
    nodes.push(hub);

    setup();

    /* Dessin d'une frame */
    const drawFrame = () => {
      ctx.clearRect(0, 0, w, h);

      if (visible && fadeProgress < 1) fadeProgress = Math.min(fadeProgress + 0.007, 1);

      const pad = 40;
      nodes.forEach((n, i) => {
        if (n.isHub) return;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < pad) { n.x = pad; n.vx =  Math.abs(n.vx); }
        if (n.x > w - pad) { n.x = w - pad; n.vx = -Math.abs(n.vx); }
        if (n.y < pad) { n.y = pad; n.vy =  Math.abs(n.vy); }
        if (n.y > h - pad) { n.y = h - pad; n.vy = -Math.abs(n.vy); }
        n.alpha = Math.max(0, Math.min(1, (fadeProgress - i * 0.055) * 6));
      });
      hub.alpha = Math.max(0, Math.min(1, (fadeProgress - 0.55) * 6));

      /* Lignes proximité */
      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i];
        if (a.alpha < 0.01) continue;
        for (let j = i + 1; j < nodes.length - 1; j++) {
          const b = nodes[j];
          if (b.alpha < 0.01) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= maxDist) continue;
          const a0 = Math.min(a.alpha, b.alpha) * (1 - d / maxDist) * 0.45;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(28,12,179,${a0.toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      /* Lignes hub */
      if (hub.alpha > 0.01) {
        const diag = Math.hypot(w, h);
        nodes.forEach((n) => {
          if (n.isHub || n.alpha < 0.01) return;
          const d  = Math.hypot(n.x - hub.x, n.y - hub.y);
          const a0 = Math.min(n.alpha, hub.alpha) * (0.12 + 0.42 * (1 - d / diag));
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(hub.x, hub.y);
          ctx.strokeStyle = `rgba(28,12,179,${a0.toFixed(3)})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        });
      }

      /* Nœuds outils */
      nodes.forEach((n) => {
        if (n.isHub || n.alpha < 0.01) return;
        ctx.save();
        ctx.globalAlpha = n.alpha * 0.65;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = INDIGO;
        ctx.fill();
        ctx.globalAlpha = n.alpha * 0.45;
        ctx.font = `11px 'Neue Einstellung', sans-serif`;
        ctx.fillStyle = INDIGO;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(n.label, n.x, n.y + 9);
        ctx.restore();
      });

      /* Hub R */
      if (hub.alpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = hub.alpha;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 24, 0, Math.PI * 2);
        ctx.fillStyle = INDIGO;
        ctx.fill();
        ctx.font = `500 15px 'Neue Einstellung', sans-serif`;
        ctx.fillStyle = '#F0EEE8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('R', hub.x, hub.y + 1);
        ctx.restore();
      }
    };

    const loop = () => {
      drawFrame();
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => setup();

    /* instant() = onglet caché ou reduced-motion : RAF suspendu → dessin immédiat */
    if (instant()) {
      visible = true;
      fadeProgress = 1;
      nodes.forEach((n) => { n.alpha = 1; });
      hub.alpha = 1;
      drawFrame();
      window.addEventListener('resize', onResize);
      return () => { window.removeEventListener('resize', onResize); };
    }

    /* IntersectionObserver : fade-in quand la section entre dans le viewport */
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { visible = true; io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(section);

    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      io.disconnect();
    };
  }, []);

  return (
    <div className="why-reskope" ref={sectionRef}>
      <canvas ref={canvasRef} className="why-reskope__canvas" aria-hidden="true" />

      <div className="why-reskope__copy">
        <Reveal>
          <RevealItem as="p" className="eyebrow eyebrow--index">{c.whyEyebrow}</RevealItem>
          <RiseText as="h2" className="h2 why-reskope__title" text={c.whyTitle} />
          <RevealItem as="p" className="lead why-reskope__lead">{c.whyLead}</RevealItem>
          <RevealItem>
            <Link to="/a-propos" className="btn btn--ghost" data-cursor-label="Explorer">
              {c.whyLink}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </RevealItem>
        </Reveal>
      </div>
    </div>
  );
}
