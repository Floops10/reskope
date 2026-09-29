import { useRef, useEffect } from 'react';
import { instant } from '../lib/scrub';

/* ════════════════════════════════════════════════════════════
   LA TRAME DE FOND — le réseau de la marque, derrière tout le site.

   Un seul réseau, quatre façons de vivre, une par marque (html[data-marque]) :

   - Reskope, la dérive : quelques nœuds dérivent lentement, les plus
     proches se relient, et le réseau se tend vers la souris ;
   - Create, l'éclosion : les nœuds naissent à l'horizon, sous la lumière
     de l'aube, grandissent en montant et se relient comme des pousses ;
   - Define, la mise en ordre : chaque nœud a sa place sur une grille,
     le réseau se range sans cesse, et la souris montre les alignements ;
   - Elevate, l'altitude : trois étages de nœuds, en vraie perspective,
     reliés entre eux, qui tournent lentement comme vus d'avion.

   Canvas (performance), couleur lue sur la marque (--trame, --trame-vive),
   toujours très légère : c'est un fond, jamais un sujet.

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

const densite = (w, h) => Math.max(7, Math.min(16, Math.round((w * h) / 80000)));
const hasard = (a, b) => a + Math.random() * (b - a);
const rgba = (c, a) => `rgba(${c},${Math.max(0, Math.min(1, a)).toFixed(3)})`;

/* ── Reskope : la dérive ─────────────────────────────────── */
function derive() {
  const nodes = [];
  return {
    taille(w, h) {
      const n = densite(w, h);
      while (nodes.length < n) {
        nodes.push({ x: hasard(0, w), y: hasard(0, h), vx: hasard(-0.07, 0.07), vy: hasard(-0.07, 0.07), r: hasard(0.8, 2.3) });
      }
      nodes.length = n;
      nodes.forEach((p) => { p.x = Math.min(p.x, w); p.y = Math.min(p.y, h); });
    },
    dessiner(ctx, w, h, t, souris, bouger, c) {
      const LD = Math.min(Math.min(w, h) * 0.2, 200);
      const ATTRAIT = 190;
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
            ctx.strokeStyle = rgba(c.trame, (1 - d / LD) * 0.07);
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
        const dc = Math.hypot(n.x - souris.x, n.y - souris.y);
        const pres = dc < ATTRAIT ? 1 - dc / ATTRAIT : 0;
        if (pres > 0) {
          ctx.strokeStyle = rgba(c.trame, pres * 0.42);
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
        ctx.fillStyle = rgba(c.trame, 0.13 + 0.42 * pres);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  };
}

/* ── Create : l'éclosion ─────────────────────────────────────
   Chaque nœud a une profondeur z (0 loin, 1 près) : les proches montent
   plus vite, sont plus gros et plus nets. Ils naissent sous l'horizon,
   plutôt au centre, là où la lumière de l'aube est la plus forte. */
function eclosion() {
  const nodes = [];
  const naitre = (w, h, partout) => {
    const z = Math.random();
    const centre = (Math.random() + Math.random() + Math.random()) / 3;
    return {
      x: centre * w,
      y: partout ? hasard(h * 0.1, h + 10) : h + hasard(4, 40),
      z,
      v: 0.12 + z * 0.3,
      phase: hasard(0, Math.PI * 2),
      balance: hasard(6, 18),
      age: partout ? hasard(0, 1) : 0,
    };
  };
  let W = 0;
  let H = 0;
  return {
    taille(w, h) {
      W = w;
      H = h;
      const n = Math.round(densite(w, h) * 1.25);
      while (nodes.length < n) nodes.push(naitre(w, h, true));
      nodes.length = n;
    },
    dessiner(ctx, w, h, t, souris, bouger, c) {
      const pos = nodes.map((n) => {
        if (bouger) {
          n.y -= n.v;
          n.age = Math.min(1, n.age + 0.004);
          if (n.y < -20) Object.assign(n, naitre(W, H, false));
        }
        const x = n.x + Math.sin(t * 0.0006 + n.phase) * n.balance * (0.4 + n.z);
        /* Visible en montant, s'efface en haut de l'écran : une lumière
           qui naît en bas et se perd dans le ciel. */
        const hauteur = 1 - n.y / h;
        const vie = Math.min(1, n.age * 3) * Math.max(0, Math.min(1, (1 - hauteur) * 1.6));
        const dc = Math.hypot(x - souris.x, n.y - souris.y);
        const chaleur = dc < 170 ? 1 - dc / 170 : 0;
        return { x, y: n.y, z: n.z, vie, chaleur, r: 0.9 + n.z * 2.2 * (0.5 + hauteur * 0.7) };
      });
      const LD = Math.min(Math.min(w, h) * 0.18, 170);
      for (let i = 0; i < pos.length; i++) {
        const a = pos[i];
        for (let j = i + 1; j < pos.length; j++) {
          const b = pos[j];
          if (Math.abs(a.z - b.z) > 0.45) continue;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LD) {
            ctx.strokeStyle = rgba(c.trame, (1 - d / LD) * 0.11 * Math.min(a.vie, b.vie));
            ctx.lineWidth = 0.6 + 0.5 * Math.min(a.z, b.z);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of pos) {
        if (p.vie <= 0) continue;
        const halo = p.r * (4 + 3 * p.chaleur);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo);
        g.addColorStop(0, rgba(c.vive, (0.16 + 0.3 * p.chaleur) * p.vie));
        g.addColorStop(1, rgba(c.vive, 0));
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, halo, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(c.trame, (0.22 + 0.4 * p.chaleur) * p.vie);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  };
}

/* ── Define : la mise en ordre ───────────────────────────────
   Des places sur une grille, des nœuds qui les rejoignent avec un ressort
   ferme. De temps en temps, l'un d'eux change de place : le réseau se
   range sans cesse, et les liens ne relient que des voisins de grille. */
function rangement() {
  let places = [];
  let colonnes = 0;
  let pas = 140;
  let ox = 0;
  let oy = 0;
  const nodes = [];
  let prochain = 0;
  const libre = (k) => !nodes.some((n) => n.place === k);
  return {
    taille(w, h) {
      pas = Math.max(110, Math.min(170, Math.round(w / 9)));
      colonnes = Math.floor(w / pas) + 1;
      const lignes = Math.floor(h / pas) + 1;
      ox = (w - (colonnes - 1) * pas) / 2;
      oy = (h - (lignes - 1) * pas) / 2;
      places = [];
      for (let r = 0; r < lignes; r++) for (let q = 0; q < colonnes; q++) places.push([ox + q * pas, oy + r * pas]);
      const n = Math.min(places.length - 2, Math.round(densite(w, h) * 1.4));
      nodes.length = 0;
      const ordre = places.map((_, k) => k).sort(() => Math.random() - 0.5);
      for (let i = 0; i < n; i++) {
        const k = ordre[i];
        nodes.push({ place: k, x: places[k][0] + hasard(-pas, pas), y: places[k][1] + hasard(-pas, pas), vx: 0, vy: 0, phase: hasard(0, 6.28) });
      }
    },
    dessiner(ctx, w, h, t, souris, bouger, c) {
      if (bouger && t > prochain) {
        prochain = t + hasard(1400, 2600);
        const n = nodes[Math.floor(Math.random() * nodes.length)];
        if (n) {
          const voisins = [n.place - 1, n.place + 1, n.place - colonnes, n.place + colonnes]
            .filter((k) => k >= 0 && k < places.length && Math.abs((k % colonnes) - (n.place % colonnes)) <= 1 && libre(k));
          if (voisins.length) n.place = voisins[Math.floor(Math.random() * voisins.length)];
        }
      }
      for (const n of nodes) {
        const [tx, ty] = places[n.place];
        if (bouger) {
          n.vx = (n.vx + (tx - n.x) * 0.012) * 0.82;
          n.vy = (n.vy + (ty - n.y) * 0.012) * 0.82;
          n.x += n.vx;
          n.y += n.vy;
        } else {
          n.x = tx;
          n.y = ty;
        }
      }
      /* La souris : la ligne et la colonne où elle passe s'éclairent. */
      if (souris.x > -1000) {
        const col = Math.round((souris.x - ox) / pas);
        const lig = Math.round((souris.y - oy) / pas);
        ctx.strokeStyle = rgba(c.vive, 0.16);
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 6]);
        ctx.beginPath();
        ctx.moveTo(ox + col * pas, 0);
        ctx.lineTo(ox + col * pas, h);
        ctx.moveTo(0, oy + lig * pas);
        ctx.lineTo(w, oy + lig * pas);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      const parPlace = new Map(nodes.map((n) => [n.place, n]));
      ctx.lineWidth = 0.8;
      for (const n of nodes) {
        for (const k of [n.place + 1, n.place + colonnes]) {
          const m = parPlace.get(k);
          if (!m || (k === n.place + 1 && k % colonnes === 0)) continue;
          ctx.strokeStyle = rgba(c.trame, 0.12);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        const dc = Math.hypot(n.x - souris.x, n.y - souris.y);
        const pres = dc < 190 ? 1 - dc / 190 : 0;
        const s = 3.2 + 2.2 * pres;
        const y = n.y + Math.sin(t * 0.0012 + n.phase) * 1.2;
        ctx.fillStyle = rgba(c.trame, 0.2 + 0.45 * pres);
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(n.x - s / 2, y - s / 2, s, s, 1);
        else ctx.rect(n.x - s / 2, y - s / 2, s, s);
        ctx.fill();
      }
    },
  };
}

/* ── Elevate : l'altitude ────────────────────────────────────
   Des nœuds en vraie 3D, rangés sur trois étages : vus d'en haut, en
   perspective, ils tournent lentement. Chaque étage se relie à lui-même,
   et quelques liaisons verticales relient les étages entre eux : des
   outils qui se parlent, d'un niveau de l'entreprise à l'autre. */
function altitude() {
  const nodes = [];
  const verticaux = [];
  let R = 300;
  return {
    taille(w, h) {
      R = Math.min(w, h) * 0.42;
      nodes.length = 0;
      verticaux.length = 0;
      const parEtage = Math.max(8, Math.round(densite(w, h) * 0.9));
      [-1, 0, 1].forEach((etage) => {
        for (let i = 0; i < parEtage; i++) {
          const a = (i / parEtage) * Math.PI * 2 + hasard(-0.3, 0.3);
          const r = R * Math.sqrt(hasard(0.08, 1));
          nodes.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, y: etage * R * 0.42, etage, phase: hasard(0, 6.28) });
        }
      });
      /* Les liaisons entre étages : chaque nœud d'un étage, relié au plus
         proche de l'étage du dessus, une fois sur trois. */
      nodes.forEach((n, i) => {
        if (n.etage === 1 || i % 3) return;
        let best = -1;
        let bd = Infinity;
        nodes.forEach((m, j) => {
          if (m.etage !== n.etage + 1) return;
          const d = Math.hypot(n.x - m.x, n.z - m.z);
          if (d < bd) { bd = d; best = j; }
        });
        if (best >= 0) verticaux.push([i, best]);
      });
    },
    dessiner(ctx, w, h, t, souris, bouger, c) {
      const angle = t * 0.00007;
      const penteSouris = souris.x > -1000 ? (souris.y / h - 0.5) * 0.18 : 0;
      const tourneSouris = souris.x > -1000 ? (souris.x / w - 0.5) * 0.35 : 0;
      const tilt = 0.52 + penteSouris;
      const cx = w * 0.64;
      const cy = h * 0.52;
      const foc = R * 3.2;
      const proj = nodes.map((n) => {
        const a = angle + tourneSouris;
        const x = n.x * Math.cos(a) - n.z * Math.sin(a);
        const z0 = n.x * Math.sin(a) + n.z * Math.cos(a);
        const flotte = Math.sin(t * 0.0005 + n.etage * 1.7 + n.phase * 0.1) * 6;
        const y0 = n.y + flotte;
        const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
        const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
        const k = foc / (foc + z + R);
        return { x: cx + x * k, y: cy - y * k, k, etage: n.etage };
      });
      const LD = R * 0.62;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].etage !== nodes[j].etage) continue;
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].z - nodes[j].z);
          if (d > LD) continue;
          const a = proj[i];
          const b = proj[j];
          ctx.strokeStyle = rgba(c.trame, (1 - d / LD) * 0.13 * Math.min(a.k, b.k));
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([1.5, 4]);
      for (const [i, j] of verticaux) {
        const a = proj[i];
        const b = proj[j];
        ctx.strokeStyle = rgba(c.vive, 0.22 * Math.min(a.k, b.k));
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      for (const p of proj) {
        const dc = Math.hypot(p.x - souris.x, p.y - souris.y);
        const pres = dc < 170 ? 1 - dc / 170 : 0;
        ctx.fillStyle = rgba(p.etage === 1 ? c.vive : c.trame, (0.16 + 0.12 * p.k + 0.4 * pres) * p.k);
        ctx.beginPath();
        ctx.arc(p.x, p.y, (1.1 + 1.6 * p.k) * (1 + pres), 0, Math.PI * 2);
        ctx.fill();
      }
    },
  };
}

const COMPORTEMENTS = { reskope: derive, create: eclosion, define: rangement, elevate: altitude };

const couleurs = () => {
  const s = getComputedStyle(document.documentElement);
  return {
    trame: s.getPropertyValue('--trame').trim() || '28, 12, 179',
    vive: s.getPropertyValue('--trame-vive').trim() || '91, 75, 230',
  };
};

export default function HeroNetwork() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const fige = instant();

    let w = 0;
    let h = 0;
    let raf = null;
    const souris = { x: -9999, y: -9999 };
    let marque = null;
    let vie = null;
    let c = couleurs();

    const resize = () => {
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      vie?.taille(w, h);
    };

    /* La marque change (on passe de l'accueil à Create sans recharger) :
       le réseau change de nature, et de couleur. */
    const adopter = () => {
      const m = document.documentElement.dataset.marque || 'reskope';
      c = couleurs();
      if (m === marque && vie) return;
      marque = m;
      vie = (COMPORTEMENTS[m] || derive)();
      vie.taille(w, h);
      if (fige) dessiner(false);
    };

    const dessiner = (bouger) => {
      ctx.clearRect(0, 0, w, h);
      vie?.dessiner(ctx, w, h, performance.now(), souris, bouger, c);
    };

    resize();
    adopter();
    const veille = new MutationObserver(adopter);
    veille.observe(document.documentElement, { attributes: true, attributeFilter: ['data-marque'] });

    if (fige) {
      dessiner(false);
      const figer = () => { resize(); dessiner(false); };
      window.addEventListener('resize', figer);
      return () => {
        veille.disconnect();
        window.removeEventListener('resize', figer);
      };
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
      veille.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', oublier);
      window.removeEventListener('blur', oublier);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilite);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero2__net" aria-hidden="true" />;
}
