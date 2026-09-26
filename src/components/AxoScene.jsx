import { useMemo } from 'react';
import { SCENES } from '../lib/scenes';
import { projeterPave, projeterSol, PR } from '../lib/axo';

/* ════════════════════════════════════════════════════════════
   UNE SCÈNE, À PLAT — la même géométrie que la 3D, projetée en SVG.

   Les scènes de src/lib/scenes.js vivent en trois dimensions dans la ville
   et dans l'explorateur. Ici on les projette une fois, en axonométrie, pour
   les endroits où un moteur 3D serait de trop : l'affiche d'un emplacement
   de motion design, l'illustration d'une porte d'entrée, le poster d'un
   écran avant que la vidéo n'arrive. C'est le même dessin, donc on ne
   change pas de langue graphique d'un endroit à l'autre.

   `etape` choisit l'état de la scène : les blocs de cette étape restent
   pleins, les autres s'effacent, et les noms qu'elle porte s'écrivent.
   ════════════════════════════════════════════════════════════ */

const ANGLE = 0; // l'angle des livrets : on ne tourne pas une affiche

export default function AxoScene({ nom, etape = null, noms = true, className = '', titre }) {
  const scene = SCENES[nom];

  const dessin = useMemo(() => {
    if (!scene) return null;
    const { W, D, pas } = scene.sol;
    const cx = W / 2;
    const cy = D / 2;
    const e = etape === null ? null : scene.etapes[Math.min(etape, scene.etapes.length - 1)];
    const allumes = e && e.ids && e.ids.length ? new Set(e.ids) : null;
    const apparition = new Set(scene.apparition || []);
    /* Un bloc qui n'apparaît qu'à une étape n'existe pas avant elle. */
    const visibles = scene.blocs.filter((bl) => {
      if (!apparition.has(bl.id)) return true;
      if (etape === null) return false;
      return scene.etapes.slice(0, etape + 1).some((x) => (x.ids || []).includes(bl.id) || (x.mots || []).includes(bl.id));
    });

    const volumes = visibles.map((bl) => {
      const v = projeterPave(
        { x: bl.x, y: bl.y, w: bl.w, d: bl.d, z0: bl.z0, z1: bl.z0 + bl.h, creux: bl.etat === 'creux' },
        ANGLE, cx, cy
      );
      return { bl, v, eteint: allumes ? !allumes.has(bl.id) : false };
    });
    /* L'ordre de tracé suit la profondeur : ce qui est devant recouvre ce
       qui est derrière. Les couches d'une même pile se trient par hauteur. */
    volumes.sort((a, b) => (a.v.prof - b.v.prof) || (a.bl.z0 - b.bl.z0));

    const sol = projeterSol(W, D, pas, ANGLE, cx, cy);

    /* Les étiquettes : au-dessus du sommet arrière pour ce qui est au fond,
       sous l'arête avant pour ce qui est devant. Sinon le nom retombe sur
       un autre volume (règle des livrets). */
    const mots = new Set(e ? e.mots || [] : []);
    const etiquettes = noms ? visibles
      .filter((bl) => mots.has(bl.id))
      .map((bl) => {
        const devant = bl.y + bl.d / 2 > D / 2;
        const [x, y] = devant
          ? PR(bl.x + bl.w, bl.y + bl.d, bl.z0)
          : PR(bl.x, bl.y, bl.z0 + bl.h);
        return { id: bl.id, texte: bl.nom[0], x, y: devant ? y + 1.6 : y - 1.1, devant };
      }) : [];

    /* Les liens de l'étape, tirés d'un sommet à l'autre. */
    const parId = Object.fromEntries(scene.blocs.map((bl) => [bl.id, bl]));
    const liens = (e && e.liens ? e.liens : []).map((l, i) => {
      const a = parId[l.de];
      const b = parId[l.vers];
      if (!a || !b) return null;
      const pa = PR(a.x + a.w / 2, a.y + a.d / 2, l.z ?? a.z0 + a.h);
      const pb = PR(b.x + b.w / 2, b.y + b.d / 2, l.z ?? b.z0 + b.h);
      return { i, pa, pb, etat: l.etat };
    }).filter(Boolean);

    /* Le cadre : tout ce qui est dessiné, étiquettes comprises. */
    const xs = [];
    const ys = [];
    const pousser = (x, y) => { xs.push(x); ys.push(y); };
    sol.cadre.split(' ').forEach((p) => { const [x, y] = p.split(',').map(Number); pousser(x, y); });
    volumes.forEach(({ v }) => {
      (v.faces || []).forEach((f) => f.d.split(' ').forEach((p) => { const [x, y] = p.split(',').map(Number); pousser(x, y); }));
      (v.lignes || []).forEach((l) => { pousser(l.x1, l.y1); pousser(l.x2, l.y2); });
    });
    etiquettes.forEach((t) => { pousser(t.x - 0.5, t.y - 1); pousser(t.x + t.texte.length * 0.52, t.y + 0.4); });
    const x0 = Math.min(...xs) - 1.2;
    const y0 = Math.min(...ys) - 1.2;
    const w = Math.max(...xs) - x0 + 1.2;
    const h = Math.max(...ys) - y0 + 1.2;

    return { sol, volumes, etiquettes, liens, vb: `${x0.toFixed(2)} ${y0.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)}` };
  }, [scene, etape, noms]);

  if (!dessin) return null;

  return (
    <svg
      className={`axs ${className}`}
      viewBox={dessin.vb}
      role={titre ? 'img' : undefined}
      aria-label={titre}
      aria-hidden={titre ? undefined : true}
    >
      <g className="axs__sol">
        <polygon points={dessin.sol.cadre} className="axs__cadre" />
        {dessin.sol.lignes.map((l, i) => (
          <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
        ))}
      </g>
      {dessin.liens.map((l) => (
        <line
          key={`l${l.i}`}
          className={`axs__lien axs__lien--${l.etat}`}
          x1={l.pa[0]} y1={l.pa[1]} x2={l.pb[0]} y2={l.pb[1]}
        />
      ))}
      {dessin.volumes.map(({ bl, v, eteint }) => (
        <g key={bl.id} className={`axs__bloc axs__bloc--${bl.etat}${eteint ? ' is-eteint' : ''}`}>
          {v.faces && v.faces.map((f, i) => <polygon key={i} className={f.cls} points={f.d} />)}
          {v.lignes && v.lignes.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
        </g>
      ))}
      {dessin.etiquettes.map((t) => (
        <text key={t.id} className="axs__nom" x={t.x} y={t.y}>{t.texte}</text>
      ))}
    </svg>
  );
}
