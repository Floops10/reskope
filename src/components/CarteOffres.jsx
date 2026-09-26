import { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { OFFRE, OFFRES, LIENS, POLES, STATUTS } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   LA CARTE DES OFFRES — ce qu'une mission apporte à la suivante.

   Onze offres, et on n'en achète jamais onze. Ce qui compte pour le
   dirigeant, c'est de voir où il entre et où ça peut mener : la carte le
   montre d'un coup d'œil. Les trois points pleins sont les portes d'entrée,
   les autres se proposent ensuite, le pointillé viendra plus tard. Chaque
   flèche porte ce qu'elle transmet.

   Deux dessins pour une même carte. Sur grand écran, le réseau posé sur ses
   trois pôles, celui du livret. Sur téléphone, un diagramme en arcs : les
   offres en colonne, les liens en arcs dans la marge, et le libellé du lien
   qui s'écrit sous l'offre qu'on touche. Le même graphe, lisible au pouce.

   Le plan arrive de la profondeur et se couche, puis les points s'allument
   un à un et les liens se tracent. Toucher un point ouvre son offre.
   ════════════════════════════════════════════════════════════ */

/* Le réseau du livret, en coordonnées de la carte (1100 × 700). */
const POS = {
  continue: [92, 180], idee: [300, 205], clients: [92, 330], solution: [300, 450], equipes: [92, 505],
  dossier: [620, 205], financeurs: [870, 150], modele: [870, 330], marque: [640, 455],
  construire: [440, 629], autonomie: [690, 629],
};
const LBL = {
  continue: ['Écouter vos clients', 'chaque semaine'],
  idee: ['Tester votre idée', 'avant d’investir'],
  clients: ['Pourquoi vos clients', 'achètent, ou partent'],
  solution: ['Trouver la solution', 'et la tester'],
  equipes: ['Comment vos équipes', 'travaillent vraiment'],
  dossier: ['Relire votre dossier', 'avant les financeurs'],
  financeurs: ['Préparer le passage', 'devant les financeurs'],
  modele: ['Nourrir votre', 'business plan'],
  marque: ['Poser le cadre', 'de votre marque'],
  construire: ['Construire la', 'solution validée'],
  autonomie: ['Passer le relais', 'à vos équipes'],
};
const ZONES = [
  { pole: 'discovery', x: 24, y: 70, w: 470, h: 480, titre: [48, 36] },
  { pole: 'bp', x: 560, y: 70, w: 516, h: 460, titre: [584, 36] },
  { pole: 'construire', x: 360, y: 565, w: 560, h: 112, titre: [384, 594], court: true },
];
/* Les libellés sont à droite des points : un lien qui partirait tout droit
   vers la droite les traverserait. Ces courbes passent par en dessous ou
   par au-dessus. */
const CTRL = {
  'dossier>idee': [380, 80], 'idee>modele': [330, 330], 'idee>marque': [340, 420],
  'idee>solution': [362, 330],
  'clients>solution': [110, 460], 'equipes>construire': [110, 625], 'solution>construire': [320, 560],
  'dossier>financeurs': [640, 110], 'construire>autonomie': [470, 700],
};
const R = { porte: 15, suite: 10, plustard: 9 };

/* L'ordre de la colonne sur téléphone : pôle par pôle, les portes d'abord. */
const COLONNE = [
  { pole: 'discovery', ids: ['idee', 'clients', 'solution', 'equipes', 'continue'] },
  { pole: 'bp', ids: ['dossier', 'modele', 'financeurs', 'marque'] },
  { pole: 'construire', ids: ['construire', 'autonomie'] },
];

const unit = (x, y) => { const n = Math.hypot(x, y) || 1; return [x / n, y / n]; };

function useEtroit() {
  const requete = '(max-width: 760px)';
  const [etroit, setEtroit] = useState(() => typeof window !== 'undefined' && window.matchMedia(requete).matches);
  useEffect(() => {
    const m = window.matchMedia(requete);
    const suivre = () => setEtroit(m.matches);
    m.addEventListener('change', suivre);
    return () => m.removeEventListener('change', suivre);
  }, []);
  return etroit;
}

export default function CarteOffres({ onChoisir }) {
  const racine = useRef(null);
  const navigate = useNavigate();
  const etroit = useEtroit();
  const [chaud, setChaud] = useState(null);

  const ouvrir = (id) => {
    const o = OFFRE[id];
    if (o.slug) { navigate(o.slug); return; }
    if (onChoisir) onChoisir(id);
  };

  /* ── Le réseau (grand écran) ── */
  const reseau = useMemo(() => {
    const liens = LIENS.map(([de, vers, dit], i) => {
      const a = OFFRE[de];
      const b = OFFRE[vers];
      const [ax, ay] = POS[de];
      const [bx, by] = POS[vers];
      const len = Math.hypot(bx - ax, by - ay);
      const ux = (bx - ax) / len;
      const uy = (by - ay) / len;
      const fixe = CTRL[`${de}>${vers}`];
      const bend = (i % 2 ? 1 : -1) * Math.min(60, len * 0.16);
      const [cx, cy] = fixe || [(ax + bx) / 2 - uy * bend, (ay + by) / 2 + ux * bend];
      const u1 = unit(cx - ax, cy - ay);
      const u2 = unit(bx - cx, by - cy);
      const sx = ax + u1[0] * (R[a.statut] + 5);
      const sy = ay + u1[1] * (R[a.statut] + 5);
      const ex = bx - u2[0] * (R[b.statut] + 7);
      const ey = by - u2[1] * (R[b.statut] + 7);
      return {
        de, vers, dit,
        d: `M${sx.toFixed(1)},${sy.toFixed(1)} Q${cx},${cy} ${ex.toFixed(1)},${ey.toFixed(1)}`,
        mx: 0.25 * sx + 0.5 * cx + 0.25 * ex,
        my: 0.25 * sy + 0.5 * cy + 0.25 * ey - 8,
      };
    });
    return { liens };
  }, []);

  /* ── La colonne en arcs (téléphone) ── */
  const colonne = useMemo(() => {
    const X = 70;
    const lignes = [];
    const y = {};
    let h = 30;
    COLONNE.forEach((g) => {
      lignes.push({ type: 'pole', pole: g.pole, y: h + 8 });
      h += 52;
      g.ids.forEach((id) => {
        y[id] = h;
        lignes.push({ type: 'offre', id, y: h });
        h += 70;
      });
      h += 14;
    });
    const arcs = LIENS.map(([de, vers, dit]) => {
      const ya = y[de];
      const yb = y[vers];
      const ecart = Math.min(58, 10 + Math.abs(yb - ya) * 0.12);
      const sens = yb > ya ? 1 : -1;
      const ra = R[OFFRE[de].statut] + 4;
      const rb = R[OFFRE[vers].statut] + 6;
      return {
        de, vers, dit,
        d: `M${X - ra},${ya + sens * 2} C${X - ecart - 14},${ya} ${X - ecart - 14},${yb} ${X - rb},${yb - sens * 2}`,
      };
    });
    return { X, lignes, arcs, h: h + 10 };
  }, []);

  /* Le plan arrive de la profondeur et se couche, puis la carte se
     construit : points, liens, noms. Une seule fois, à l'entrée. */
  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const plan = q('.co__plan')[0];
    const tl = gsap.timeline({ scrollTrigger: { trigger: racine.current, start: 'top 78%' } });
    tl.fromTo(plan,
      { z: -520, rotateX: 38, y: 60, autoAlpha: 0 },
      { z: 0, rotateX: 0, y: 0, autoAlpha: 1, duration: 1.3, ease: 'power3.out' }, 0);
    tl.from(q('.co__zone, .co__pole'), { autoAlpha: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08 }, 0.35);
    tl.from(q('.co__point'), {
      scale: 0, transformOrigin: 'center center', duration: 0.55, ease: 'back.out(2.2)',
      stagger: { each: 0.06, from: 'start' },
    }, 0.55);
    const traits = q('.co__lien');
    traits.forEach((p) => {
      const l = p.getTotalLength ? p.getTotalLength() : 400;
      gsap.set(p, { strokeDasharray: l, strokeDashoffset: l });
    });
    tl.to(traits, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut', stagger: 0.07 }, 0.9);
    tl.from(q('.co__nom'), { autoAlpha: 0, y: 8, duration: 0.5, ease: 'power2.out', stagger: 0.04 }, 0.8);
    tl.set(traits, { clearProps: 'strokeDasharray,strokeDashoffset' });
  }, { scope: racine, dependencies: [etroit] });

  const estChaud = (l) => chaud && (l.de === chaud || l.vers === chaud);
  const voisin = (id) => chaud && (id === chaud || LIENS.some(([a, b]) => (a === chaud && b === id) || (b === chaud && a === id)));

  const point = (id, x, y, avecNom, nomX) => {
    const o = OFFRE[id];
    const lbl = LBL[id];
    return (
      <g
        key={id}
        className={`co__noeud co__noeud--${o.statut}${chaud === id ? ' is-chaud' : ''}${chaud && !voisin(id) ? ' is-loin' : ''}`}
        role="link"
        tabIndex={0}
        aria-label={`${o.nom}. ${STATUTS[o.statut]}.`}
        onMouseEnter={() => setChaud(id)}
        onMouseLeave={() => setChaud(null)}
        onFocus={() => setChaud(id)}
        onBlur={() => setChaud(null)}
        onClick={() => ouvrir(id)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ouvrir(id); } }}
      >
        <circle className="co__halo" cx={x} cy={y} r={R[o.statut] + 12} />
        <circle className="co__point" cx={x} cy={y} r={R[o.statut]} />
        {avecNom && (
          <text className="co__nom" x={nomX ?? x + R[o.statut] + 12} y={y - 4}>
            <tspan x={nomX ?? x + R[o.statut] + 12} dy="0">{lbl[0]}</tspan>
            <tspan x={nomX ?? x + R[o.statut] + 12} dy="1.2em">{lbl[1]}</tspan>
          </text>
        )}
      </g>
    );
  };

  return (
    <figure className={`co${etroit ? ' co--colonne' : ''}`} ref={racine}>
      <div className="co__scene">
        {etroit ? (
          <svg
            className={`co__plan${chaud ? ' is-attentif' : ''}`}
            viewBox={`0 0 400 ${colonne.h}`}
            role="group"
            aria-label="Carte des offres de Reskope"
          >
            <defs>
              <marker id="co-fleche-m" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className="co__pointe" />
              </marker>
            </defs>
            {colonne.arcs.map((l) => (
              <path key={`${l.de}-${l.vers}`} className={`co__lien${estChaud(l) ? ' is-chaud' : ''}`} d={l.d} markerEnd="url(#co-fleche-m)" />
            ))}
            {colonne.lignes.map((ln) => {
              if (ln.type === 'pole') {
                return <text key={`pole-${ln.pole}`} className="co__pole" x={colonne.X - 18} y={ln.y}>{POLES[ln.pole].nom}</text>;
              }
              const o = OFFRE[ln.id];
              const sortants = LIENS.filter(([a]) => a === ln.id);
              return (
                <g key={`offre-${ln.id}`}>
                  {point(ln.id, colonne.X, ln.y, false)}
                  <text className={`co__nom co__nom--ligne${o.statut === 'porte' ? ' is-porte' : ''}`} x={colonne.X + 28} y={ln.y + 5}>
                    {LBL[ln.id].join(' ')}
                  </text>
                  <text className="co__statut" x={colonne.X + 28} y={ln.y + 25}>
                    {chaud === ln.id && sortants.length
                      ? `Mène à : ${sortants.map(([, b]) => OFFRE[b].court || LBL[b].join(' ')).join(', ')}`
                      : STATUTS[o.statut]}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <svg
            className={`co__plan${chaud ? ' is-attentif' : ''}`}
            viewBox="0 0 1100 710"
            role="group"
            aria-label="Carte des offres de Reskope"
          >
            <defs>
              <marker id="co-fleche" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" className="co__pointe" />
              </marker>
            </defs>
            {ZONES.map((z) => (
              <g key={z.pole}>
                <rect className={`co__zone co__zone--${z.pole}`} x={z.x} y={z.y} width={z.w} height={z.h} rx="30" />
                <text className="co__pole" x={z.titre[0]} y={z.titre[1]}>{POLES[z.pole].nom}</text>
                {!z.court && <text className="co__pole-ligne" x={z.titre[0]} y={z.titre[1] + 22}>{POLES[z.pole].ligne}</text>}
              </g>
            ))}
            {reseau.liens.map((l) => (
              <path key={`${l.de}-${l.vers}`} className={`co__lien${estChaud(l) ? ' is-chaud' : ''}`} d={l.d} markerEnd="url(#co-fleche)" />
            ))}
            {reseau.liens.map((l) => (
              <text key={`t-${l.de}-${l.vers}`} className={`co__dit${estChaud(l) ? ' is-chaud' : ''}`} x={l.mx} y={l.my} textAnchor="middle">{l.dit}</text>
            ))}
            {OFFRES.map((o) => point(o.id, POS[o.id][0], POS[o.id][1], true))}
          </svg>
        )}
      </div>

      <figcaption className="co__legende">
        <span><i className="co__cle co__cle--porte" aria-hidden="true" />{STATUTS.porte}</span>
        <span><i className="co__cle co__cle--suite" aria-hidden="true" />{STATUTS.suite}</span>
        <span><i className="co__cle co__cle--plustard" aria-hidden="true" />{STATUTS.plustard}</span>
      </figcaption>

      {/* Le graphe, écrit : pour un lecteur d'écran et pour les moteurs. */}
      <ul className="sr-only">
        {LIENS.map(([de, vers, dit]) => (
          <li key={`${de}-${vers}`}>{OFFRE[de].nom} mène à {OFFRE[vers].nom} : {dit}.</li>
        ))}
      </ul>
    </figure>
  );
}
