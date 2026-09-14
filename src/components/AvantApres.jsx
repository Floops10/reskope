import { useEffect, useRef, useMemo } from 'react';
import { project, buildR3D, easeInOut } from '../lib/net3d';
import { makeScrub, pinProgress, instant } from '../lib/scrub';
import { useLang } from '../i18n';
import { useProfil } from '../profil';

/* ============================================================
   AVANT / APRÈS — le message de la marque en une seule image.

   Une nuée de nœuds désordonnés, reliés n'importe comment, se réorganise
   au scroll jusqu'à dessiner le R. C'est littéralement ce qu'on vend :
   le même parc d'outils, remis en ordre.

   Pourquoi c'est en 3D réelle et pas un dessin qui s'incline : les nœuds
   ont chacun un z, ils sont projetés en perspective image par image, et
   ils se parallaxent pendant la rotation. Un plan incliné ne produit pas
   ça, et l'œil fait la différence immédiatement.

   La section est épinglée : on avance dans la transformation en
   scrollant, on peut s'arrêter au milieu, revenir en arrière. Même
   principe que le vol de la page Méthode.
   ============================================================ */

const N_SAT = 22;          // les nœuds satellites autour du R
const RAYON = 138;         // dispersion de l'état désordonné

/* Désordre déterministe : jamais Math.random, sinon la scène saute d'un
   rendu à l'autre et l'animation de retour ne revient pas au même point. */
const bruit = (i, k) => {
  const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return v - Math.floor(v) - 0.5;
};

function construire() {
  const R = buildR3D(20, 1.45);
  const nR = R.nodes.length;

  /* L'état ORDONNÉ : le R en volume, entouré d'une couronne régulière.
     Chaque satellite trouve sa place, aucun ne reste en travers. */
  const ordre = [...R.nodes];
  for (let i = 0; i < N_SAT; i += 1) {
    const a = (i / N_SAT) * Math.PI * 2;
    const couche = i % 2 === 0 ? 30 : -30;
    ordre.push([Math.cos(a) * 176, Math.sin(a) * 132, couche]);
  }

  /* L'état DÉSORDONNÉ : les mêmes nœuds, dispersés. */
  const chaos = ordre.map((_, i) => [
    bruit(i, 1) * RAYON * 2.3,
    bruit(i, 2) * RAYON * 1.5,
    bruit(i, 3) * RAYON * 1.6,
  ]);

  /* Deux familles de liens à l'arrivée, et c'est important : le R doit
     être le sujet, la couronne le décor. Même trait pour les deux, et on
     obtient une roue de vélo où la lettre disparaît. */
  const liensR = [...R.links];
  const liensSat = [];
  for (let i = 0; i < N_SAT; i += 1) {
    liensSat.push([nR + i, nR + ((i + 1) % N_SAT)]);
    if (i % 7 === 0) liensSat.push([nR + i, R.hub]);
  }

  /* Les liens du désordre : des raccords arbitraires entre nœuds
     éloignés. C'est exactement ce qu'on trouve dans un parc d'outils qui
     s'est empilé sans plan. */
  const liensChaos = [];
  const total = ordre.length;
  for (let i = 0; i < total; i += 1) {
    const j = Math.floor(Math.abs(bruit(i, 7)) * 2 * total) % total;
    const k = Math.floor(Math.abs(bruit(i, 11)) * 2 * total) % total;
    if (j !== i) liensChaos.push([i, j]);
    if (k !== i && i % 3 === 0) liensChaos.push([i, k]);
  }

  return { ordre, chaos, liensR, liensSat, liensChaos, hub: R.hub, nR, total };
}

/* Le titre change de sens selon la version, et ce n'est pas une nuance
   de vocabulaire : chez une PME on REMET EN ORDRE un parc qui existe,
   chez une TPE on CONSTRUIT ce qui n'existe pas encore. Raconter le
   désordre à quelqu'un qui n'a pas d'outils, c'est parler d'un problème
   qu'il n'a pas. */
const T = {
  fr: {
    avant: 'Aujourd’hui',
    apres: 'Après',
    pme: { titre: 'Le même parc d’outils. Remis en ordre.' },
    tpe: { titre: 'Ce qui vous manque. Construit.' },
  },
  en: {
    avant: 'Today',
    apres: 'After',
    pme: { titre: 'The same set of tools. Put back in order.' },
    tpe: { titre: 'What you are missing. Built.' },
  },
};

/* Les deux états, chiffrés. Ce ne sont pas des promesses de résultat :
   ce sont les constats qu'on fait et ce qu'on remet en face. */
const ETATS = {
  fr: {
    pme: {
      avant: [['17', 'outils, dont personne n’a la liste'], ['3', 'endroits où vit la même donnée'], ['0', 'vue d’ensemble']],
      apres: [['1', 'tableau de vos outils, coût par coût'], ['1', 'endroit qui fait foi'], ['1', 'plan de chantiers chiffré en jours']],
    },
    tpe: {
      avant: [['0', 'site, ou un site qui date de 2016'], ['2 h', 'par semaine à prendre des rendez-vous au téléphone'], ['0', 'client qui vous trouve le dimanche soir']],
      apres: [['1', 'site en ligne, à votre nom'], ['1', 'agenda qui se remplit tout seul'], ['1', 'jeu de clés, code et sources compris']],
    },
  },
  en: {
    pme: {
      avant: [['17', 'tools nobody has a list of'], ['3', 'places the same data lives in'], ['0', 'overall view']],
      apres: [['1', 'table of your tools, cost by cost'], ['1', 'place that is authoritative'], ['1', 'plan of work priced in days']],
    },
    tpe: {
      avant: [['0', 'website, or one dating from 2016'], ['2 h', 'a week taking appointments by phone'], ['0', 'customer finding you on a Sunday evening']],
      apres: [['1', 'site live, in your name'], ['1', 'calendar that fills itself'], ['1', 'set of keys, code and sources included']],
    },
  },
};

export default function AvantApres() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const base = T[lang] || T.fr;
  const t = { ...base, ...(base[profil] || base.pme) };
  const e = (ETATS[lang] || ETATS.fr)[profil] || ETATS.fr.pme;

  const hote = useRef(null);
  const svg = useRef(null);
  const geo = useMemo(construire, []);

  useEffect(() => {
    const el = hote.current;
    const s = svg.current;
    if (!el || !s) return undefined;

    const nds = [...s.querySelectorAll('.aap-n')];
    const lo = [...s.querySelectorAll('.aap-lo')];
    const ls = [...s.querySelectorAll('.aap-ls')];
    const lc = [...s.querySelectorAll('.aap-lc')];
    const scene = el.querySelector('.aap__scene');
    const collant = el.querySelector('.aap__sticky');

    /* Le passage au sombre est un RIDEAU, pas un changement de couleur.
       Un panneau monte depuis le bas de l'écran, coins arrondis, et
       s'ouvre jusqu'au plein cadre ; il redescend en sortant. Interpoler
       une teinte de fond donnait une couture qu'on voyait à l'œil : ici
       il se passe quelque chose, et la page en dessous reste visible
       pendant l'ouverture.
       L'encre du texte, elle, suit bien la couverture du rideau. */
    const CREME = [240, 238, 232];
    const ENCRE = [14, 11, 31];
    const melange = (a, b, k) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(',')})`;
    const palier = (v, d, f) => Math.min(Math.max((v - d) / (f - d), 0), 1);
    const doux = (v) => v * v * (3 - 2 * v);

    const rendre = (p) => {
      const q = easeInOut(Math.min(Math.max(p, 0), 1));
      /* La rotation doit FINIR de face : le R n'est lisible que vu de
         face, et une remise en ordre qui s'achève sur un objet vu par la
         tranche ne montre rien du tout. On part donc de trois quarts, on
         traverse presque un tour, et on se pose à zéro. */
      const ay = (1 - q) * -1.9;
      const ax = 0.5 - q * 0.46;

      const pos = geo.ordre.map((o, i) => {
        const c = geo.chaos[i];
        return [c[0] + (o[0] - c[0]) * q, c[1] + (o[1] - c[1]) * q, c[2] + (o[2] - c[2]) * q];
      });
      const pr = project(pos, ax, ay, 620);

      let zmin = Infinity; let zmax = -Infinity;
      pr.forEach((v) => { if (v.z < zmin) zmin = v.z; if (v.z > zmax) zmax = v.z; });
      const span = Math.max(zmax - zmin, 1);

      nds.forEach((n, i) => {
        const v = pr[i];
        const proche = 1 - (v.z - zmin) / span;
        /* Les nœuds du R grossissent à l'arrivée, les satellites non :
           c'est ce qui fait ressortir la lettre du décor. */
        const estR = i < geo.nR;
        const base = i === geo.hub ? 6.2 : (estR ? 4.2 + q * 1.2 : 2.6);
        const r = base * v.s;
        n.setAttribute('cx', v.x.toFixed(2));
        n.setAttribute('cy', v.y.toFixed(2));
        n.setAttribute('r', r.toFixed(2));
        n.setAttribute('opacity', (0.26 + proche * 0.74).toFixed(3));
      });

      const trait = (els, paires, op) => els.forEach((L, i) => {
        const [a, b] = paires[i];
        L.setAttribute('x1', pr[a].x.toFixed(2)); L.setAttribute('y1', pr[a].y.toFixed(2));
        L.setAttribute('x2', pr[b].x.toFixed(2)); L.setAttribute('y2', pr[b].y.toFixed(2));
        L.setAttribute('opacity', op.toFixed(3));
      });
      /* Les liens arbitraires s'effacent dans le premier tiers, la
         structure apparaît dans le dernier : entre les deux, l'œil voit
         bien que quelque chose se range. */
      trait(lc, geo.liensChaos, Math.max(0, 1 - q * 2.2) * 0.34);
      trait(ls, geo.liensSat, Math.max(0, q * 1.6 - 0.6) * 0.34);
      trait(lo, geo.liensR, Math.max(0, q * 1.9 - 0.9) * 0.95);

      if (scene) scene.dataset.etat = q > 0.55 ? 'apres' : 'avant';

      /* p brut, pas q : le rideau suit le scroll linéairement, sinon
         l'adoucissement de la courbe le fait traîner. */
      const brut = Math.min(Math.max(p, 0), 1);
      const nuit = doux(Math.min(palier(brut, 0, 0.18), 1 - palier(brut, 0.84, 1)));
      if (collant) {
/* Le rideau n'arrive jamais de zéro : une lèvre sombre est déjà
           posée en bas de l'écran quand la section entre. On voit que
           quelque chose monte, au lieu de le voir apparaître. */
        collant.style.setProperty('--aap-y', `${((1 - nuit) * 86).toFixed(2)}%`);
        collant.style.setProperty('--aap-x', `${((1 - nuit) * 7).toFixed(2)}vw`);
        collant.style.setProperty('--aap-rad', `${((1 - nuit) * 40).toFixed(1)}px`);
        collant.style.setProperty('--aap-encre', melange(ENCRE, CREME, nuit));
        /* Le header ne passe en clair que quand le rideau le couvre. */
        if (nuit > 0.72) el.setAttribute('data-nav-dark', '');
        else el.removeAttribute('data-nav-dark');
      }
    };

    if (instant()) { rendre(1); return undefined; }
    return makeScrub(() => pinProgress(el), rendre, { smooth: 0.1 });
  }, [geo, profil, lang]);

  const Colonne = ({ id, titre, lignes }) => (
    <div className={`aap__col aap__col--${id}`}>
      <p className="aap__col-t">{titre}</p>
      <ul className="aap__list">
        {lignes.map(([v, l]) => (
          <li key={l}><b>{v}</b><span>{l}</span></li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className="aap" ref={hote} aria-labelledby="aap-t">
      <div className="aap__sticky">
        {/* Le rideau : un panneau sombre qui monte et s'ouvre. */}
        <div className="aap__rideau" aria-hidden="true" />
        <div className="container aap__inner">
          {/* Un seul titre, concret. Le sur-titre « Avant, après » ne
              disait rien que les deux colonnes ne disent déjà. */}
          <h2 className="aap__t" id="aap-t">{t.titre}</h2>

          <div className="aap__scene" data-etat="avant">
            <Colonne id="avant" titre={t.avant} lignes={e.avant} />

            <div className="aap__viz" aria-hidden="true">
              <svg ref={svg} viewBox="-260 -200 520 400" preserveAspectRatio="xMidYMid meet">
                <g className="aap__lc">
                  {geo.liensChaos.map((_, i) => <line className="aap-lc" key={`c${i}`} />)}
                </g>
                <g className="aap__ls">
                  {geo.liensSat.map((_, i) => <line className="aap-ls" key={`s${i}`} />)}
                </g>
                <g className="aap__lo">
                  {geo.liensR.map((_, i) => <line className="aap-lo" key={`o${i}`} />)}
                </g>
                <g className="aap__nd">
                  {geo.ordre.map((_, i) => <circle className="aap-n" key={`n${i}`} />)}
                </g>
              </svg>
            </div>

            <Colonne id="apres" titre={t.apres} lignes={e.apres} />
          </div>
        </div>
      </div>
    </section>
  );
}
