import { useState, useMemo, useCallback, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../components/Page';
import { useLang } from '../i18n';
import { CASE, SOL, mondeDe } from '../lib/atelier';
import { svgSchema, svgVersPng, telecharger, chargerPolice } from '../lib/exportAxo';

const AtelierScene = lazy(() => import('../components/AtelierScene'));

/* ============================================================
   L'ATELIER — le visiteur pose son propre système d'information.

   Tout le site explique nos chantiers avec des volumes. Ici on retourne
   l'outil : c'est le visiteur qui pose ses blocs, les nomme, les relie, et
   voit son parc vu de dessus. Personne, dans une TPE ou une PME, n'a jamais
   dessiné ce plan — et c'est en le dessinant qu'on se rend compte que quatre
   outils ne sont reliés à rien, ou qu'on paie deux fois la même chose.

   À la fin, le dessin se télécharge — en image ou en vectoriel, à la langue
   graphique des livrets — et le relevé part dans le formulaire de contact,
   déjà écrit. On ne demande rien pour l'utiliser : ni compte, ni adresse.

   Rien ne part d'ici : le schéma vit dans le navigateur du visiteur, et
   nulle part ailleurs tant qu'il ne décide pas de nous l'envoyer.
   ============================================================ */

const CLE = 'reskope.atelier.v1';

const DEPART = {
  fr: [
    { nom: 'Logiciel métier', h: 5.6, etat: 'plein' },
    { nom: 'Comptabilité', h: 3.6, etat: 'plein' },
    { nom: 'Devis et factures', h: 3.2, etat: 'plein' },
    { nom: 'Messagerie', h: 2.8, etat: 'plein' },
    { nom: 'Planning', h: 2.2, etat: 'plein' },
    { nom: 'Drive', h: 2, etat: 'plein' },
  ],
  en: [
    { nom: 'Core software', h: 5.6, etat: 'plein' },
    { nom: 'Accounting', h: 3.6, etat: 'plein' },
    { nom: 'Quotes and invoices', h: 3.2, etat: 'plein' },
    { nom: 'Email', h: 2.8, etat: 'plein' },
    { nom: 'Scheduling', h: 2.2, etat: 'plein' },
    { nom: 'Drive', h: 2, etat: 'plein' },
  ],
};

const CONTENT = {
  fr: {
    metaTitle: 'L’atelier · dessinez votre système d’information',
    metaDesc:
      'Posez vos outils sur un plan, reliez ceux qui se parlent, et voyez en deux minutes ce que personne n’a jamais dessiné chez vous. Gratuit, sans compte, et le dessin s’emporte.',
    eyebrow: 'L’atelier',
    titre: 'Dessinez votre système d’information.',
    lead: 'Un bloc par outil que vous payez. Sa hauteur, c’est la place qu’il prend chez vous — ce qu’il coûte, ou ce qu’il vous fait perdre. Reliez ceux qui se parlent vraiment. En deux minutes vous avez le plan que personne n’a jamais dessiné chez vous.',
    aide: [
      'Cliquez une case vide pour poser un outil.',
      'Glissez un bloc pour le déplacer, cliquez-le pour le renommer.',
      'Passez en mode liaison, puis cliquez deux blocs pour les relier.',
    ],
    poser: 'Poser un outil',
    lier: 'Relier deux outils',
    finLier: 'Terminer les liaisons',
    exemple: 'Partir d’un exemple',
    vider: 'Tout effacer',
    nomDefaut: 'Nouvel outil',
    champNom: 'Nom de l’outil',
    place: 'La place qu’il prend',
    jamais: 'On ne l’ouvre jamais',
    supprimer: 'Retirer cet outil',
    releve: 'Ce que dit votre plan',
    outils: (n) => `${n} outil${n > 1 ? 's' : ''} posé${n > 1 ? 's' : ''}`,
    dormants: (n) => `${n} payé${n > 1 ? 's' : ''} sans être ouvert${n > 1 ? 's' : ''}`,
    isoles: (n) => `${n} relié${n > 1 ? 's' : ''} à rien`,
    liens: (n) => `${n} liaison${n > 1 ? 's' : ''}`,
    verdicts: {
      vide: 'Posez un premier bloc : vous verrez le reste venir tout seul.',
      isoles: 'Des outils qui ne sont reliés à rien, ce sont des informations qu’une personne recopie à la main d’un écran à l’autre. C’est là que part le temps que personne ne compte.',
      dormants: 'Un outil qu’on paie sans l’ouvrir se remarque rarement tout seul : il passe en prélèvement, tous les mois, pendant des années.',
      doublons: 'Deux outils portent le même nom sur votre plan. C’est presque toujours deux abonnements pour un seul besoin, arrivés à deux ans d’écart.',
      propre: 'Rien d’alarmant sur ce plan : les outils sont reliés et vous les ouvrez tous. Gardez ce dessin, il vaudra le jour où quelqu’un proposera d’en ajouter un.',
    },
    emporter: 'Emporter le dessin',
    png: 'En image',
    svg: 'En vectoriel',
    envoyer: 'Nous l’envoyer',
    envoiNote: 'Le bouton ouvre le formulaire de contact avec le relevé déjà écrit. Joignez l’image si vous voulez qu’on regarde le plan.',
    prive: 'Rien ne part d’ici. Le schéma reste dans votre navigateur tant que vous ne nous l’envoyez pas.',
    titreExport: 'Mon système d’information',
    noteExport: 'Dessiné avec l’atelier Reskope',
    message: (r) => `Bonjour,\n\nJ’ai dessiné mon système d’information avec votre atelier. Voilà ce que ça donne :\n\n${r}\n\nJ’aimerais qu’on en parle.`,
  },
  en: {
    metaTitle: 'The workshop · map your information system',
    metaDesc:
      'Place your tools on a plan, connect the ones that talk to each other, and see in two minutes what nobody has ever drawn at your company. Free, no account, and the drawing is yours to keep.',
    eyebrow: 'The workshop',
    titre: 'Map your information system.',
    lead: 'One block per tool you pay for. Its height is the room it takes up — what it costs, or what it makes you lose. Connect the ones that really talk to each other. In two minutes you have the plan nobody has ever drawn at your company.',
    aide: [
      'Click an empty cell to place a tool.',
      'Drag a block to move it, click it to rename it.',
      'Switch to link mode, then click two blocks to connect them.',
    ],
    poser: 'Place a tool',
    lier: 'Connect two tools',
    finLier: 'Done connecting',
    exemple: 'Start from an example',
    vider: 'Clear everything',
    nomDefaut: 'New tool',
    champNom: 'Tool name',
    place: 'The room it takes',
    jamais: 'Nobody ever opens it',
    supprimer: 'Remove this tool',
    releve: 'What your plan says',
    outils: (n) => `${n} tool${n > 1 ? 's' : ''} placed`,
    dormants: (n) => `${n} paid for and never opened`,
    isoles: (n) => `${n} connected to nothing`,
    liens: (n) => `${n} connection${n > 1 ? 's' : ''}`,
    verdicts: {
      vide: 'Place a first block: the rest follows on its own.',
      isoles: 'Tools connected to nothing mean information a person retypes by hand from one screen to the next. That is where the time nobody counts goes.',
      dormants: 'A tool you pay for without opening rarely gets noticed: it goes out by direct debit, every month, for years.',
      doublons: 'Two tools share the same name on your plan. That is almost always two subscriptions for one need, bought two years apart.',
      propre: 'Nothing alarming here: the tools are connected and you open all of them. Keep this drawing, it will be worth having the day somebody suggests adding one more.',
    },
    emporter: 'Take the drawing',
    png: 'As an image',
    svg: 'As vector',
    envoyer: 'Send it to us',
    envoiNote: 'The button opens the contact form with the summary already written. Attach the image if you want us to look at the plan.',
    prive: 'Nothing leaves this page. The map stays in your browser until you decide to send it to us.',
    titreExport: 'My information system',
    noteExport: 'Drawn with the Reskope workshop',
    message: (r) => `Hello,\n\nI mapped my information system with your workshop. Here is what it shows:\n\n${r}\n\nI would like to talk it through.`,
  },
};

let compteur = 0;
const neuf = () => `o${Date.now().toString(36)}${(compteur++).toString(36)}`;

/* Un plan illisible ne doit pas empêcher d'en faire un neuf. */
function lire() {
  try {
    const d = JSON.parse(localStorage.getItem(CLE) || '{}');
    return {
      blocs: Array.isArray(d.blocs) ? d.blocs : [],
      liens: Array.isArray(d.liens) ? d.liens : [],
    };
  } catch {
    return { blocs: [], liens: [] };
  }
}

export default function Atelier() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const navigate = useNavigate();

  /* Le plan est au visiteur : il le retrouve tel quel s'il revient. On le
     relit à l'initialisation plutôt que dans un effet, pour ne pas afficher
     un plateau vide le temps d'un rendu. */
  const [blocs, setBlocs] = useState(() => lire().blocs);
  const [liens, setLiens] = useState(() => lire().liens);
  const [choisi, setChoisi] = useState(null);
  const [mode, setMode] = useState('poser');
  const [lienDe, setLienDe] = useState(null);

  useEffect(() => {
    try { localStorage.setItem(CLE, JSON.stringify({ blocs, liens })); } catch { /* quota, navigation privée */ }
  }, [blocs, liens]);

  useEffect(() => { chargerPolice(import.meta.env.BASE_URL); }, []);

  const libre = useCallback((col, row, sauf) => (
    !blocs.some((b) => b.col === col && b.row === row && b.id !== sauf)
  ), [blocs]);

  const poser = useCallback((cell) => {
    if (!libre(cell.col, cell.row)) return;
    const id = neuf();
    setBlocs((v) => [...v, { id, col: cell.col, row: cell.row, h: 2.6, etat: 'plein', nom: c.nomDefaut }]);
    setChoisi(id);
  }, [libre, c.nomDefaut]);

  const deplacer = useCallback((id, cell) => {
    setBlocs((v) => {
      if (v.some((b) => b.col === cell.col && b.row === cell.row && b.id !== id)) return v;
      return v.map((b) => (b.id === id ? { ...b, ...cell } : b));
    });
  }, []);

  const modifier = (id, champs) => setBlocs((v) => v.map((b) => (b.id === id ? { ...b, ...champs } : b)));

  const retirer = (id) => {
    setBlocs((v) => v.filter((b) => b.id !== id));
    setLiens((v) => v.filter((l) => l.de !== id && l.vers !== id));
    setChoisi(null);
  };

  const relier = useCallback((id) => {
    setLienDe((de) => {
      if (!de) return id;
      if (de === id) return null;
      setLiens((v) => (
        v.some((l) => (l.de === de && l.vers === id) || (l.de === id && l.vers === de))
          ? v.filter((l) => !((l.de === de && l.vers === id) || (l.de === id && l.vers === de)))
          : [...v, { de, vers: id }]
      ));
      return null;
    });
  }, []);

  /* Un parc ne se range pas en ligne : l'exemple arrive éparpillé, comme il
     l'est vraiment chez les gens. C'est le désordre de départ qu'on vient
     regarder en face. */
  const PLACES = [[0, 1], [2, 0], [4, 1], [1, 3], [3, 3], [5, 2]];
  const exemple = () => {
    const v = DEPART[lang].map((b, i) => ({
      ...b, id: neuf(), col: PLACES[i][0], row: PLACES[i][1],
    }));
    setBlocs(v);
    setLiens([{ de: v[2].id, vers: v[1].id }]);
    setChoisi(null);
  };

  /* Cliquer une case vide reste le geste le plus court, mais il faut l'avoir
     deviné : le bouton pose l'outil dans la première case libre. */
  const poserAuto = () => {
    for (let row = 0; row < CASE.rows; row++) {
      for (let col = 0; col < CASE.cols; col++) {
        if (libre(col, row)) { poser({ col, row }); return; }
      }
    }
  };

  const vider = () => { setBlocs([]); setLiens([]); setChoisi(null); setLienDe(null); };

  const monde = useMemo(() => blocs.map(mondeDe), [blocs]);

  const lecture = useMemo(() => {
    const relies = new Set(liens.flatMap((l) => [l.de, l.vers]));
    const isoles = blocs.filter((b) => !relies.has(b.id)).length;
    const dormants = blocs.filter((b) => b.etat === 'creux').length;
    const noms = blocs.map((b) => b.nom.trim().toLowerCase());
    const doublons = noms.some((n, i) => n && noms.indexOf(n) !== i);
    let verdict = c.verdicts.propre;
    if (!blocs.length) verdict = c.verdicts.vide;
    else if (doublons) verdict = c.verdicts.doublons;
    else if (isoles > 1) verdict = c.verdicts.isoles;
    else if (dormants) verdict = c.verdicts.dormants;
    return { isoles, dormants, verdict, total: blocs.length, liens: liens.length };
  }, [blocs, liens, c.verdicts]);

  const releve = [
    c.outils(lecture.total),
    c.liens(lecture.liens),
    lecture.dormants ? c.dormants(lecture.dormants) : null,
    lecture.isoles ? c.isoles(lecture.isoles) : null,
  ].filter(Boolean);

  const dessiner = async () => {
    const police = await chargerPolice(import.meta.env.BASE_URL);
    return svgSchema({
      blocs: monde, liens, sol: SOL,
      titre: c.titreExport, note: c.noteExport, police,
    });
  };

  const versSvg = async () => {
    const svg = await dessiner();
    telecharger('systeme-information.svg', new Blob([svg], { type: 'image/svg+xml' }));
  };

  const versPng = async () => {
    const svg = await dessiner();
    try {
      telecharger('systeme-information.png', await svgVersPng(svg));
    } catch {
      telecharger('systeme-information.svg', new Blob([svg], { type: 'image/svg+xml' }));
    }
  };

  const envoyer = () => {
    const detail = blocs.map((b) => `- ${b.nom}${b.etat === 'creux' ? ' (jamais ouvert)' : ''}`).join('\n');
    navigate('/contact', { state: { message: c.message(`${releve.join(' · ')}\n\n${detail}`) } });
  };

  const bloc = blocs.find((b) => b.id === choisi) || null;

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>
      <section className="section atl">
        <div className="container">
          <p className="eyebrow eyebrow--index">{c.eyebrow}</p>
          <h1 className="h1 atl__titre">{c.titre}</h1>
          <p className="lead atl__lead">{c.lead}</p>

          <div className="atl__plan">
            <div className="atl__scene" data-cursor-prise>
              <Suspense fallback={<div className="atl__attente" aria-hidden="true" />}>
                <AtelierScene
                  blocs={monde}
                  liens={liens}
                  choisi={choisi}
                  lienDe={lienDe}
                  mode={mode}
                  onChoisir={setChoisi}
                  onDeplacer={deplacer}
                  onPoser={poser}
                  onLier={relier}
                />
              </Suspense>
              <ul className="atl__aide" aria-hidden="true">
                {c.aide.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>

            <div className="atl__cote">
              <div className="atl__outils">
                <button type="button" className="atl__mode atl__mode--fort" onClick={poserAuto}>
                  {c.poser}
                </button>
                <button
                  type="button"
                  className={`atl__mode${mode === 'lier' ? ' is-on' : ''}`}
                  onClick={() => { setMode(mode === 'lier' ? 'poser' : 'lier'); setLienDe(null); }}
                >
                  {mode === 'lier' ? c.finLier : c.lier}
                </button>
                <button type="button" className="atl__mode" onClick={exemple}>{c.exemple}</button>
                {blocs.length > 0 && (
                  <button type="button" className="atl__mode atl__mode--sobre" onClick={vider}>{c.vider}</button>
                )}
              </div>

              {bloc && (
                <div className="atl__fiche">
                  <label className="atl__champ">
                    <span>{c.champNom}</span>
                    <input
                      type="text"
                      value={bloc.nom}
                      maxLength={38}
                      onChange={(e) => modifier(bloc.id, { nom: e.target.value })}
                    />
                  </label>

                  <div className="atl__champ">
                    <span>{c.place}</span>
                    <input
                      type="range"
                      min="1" max="7" step="0.5"
                      value={bloc.h}
                      onChange={(e) => modifier(bloc.id, { h: Number(e.target.value) })}
                    />
                  </div>

                  <label className="atl__bascule">
                    <input
                      type="checkbox"
                      checked={bloc.etat === 'creux'}
                      onChange={(e) => modifier(bloc.id, { etat: e.target.checked ? 'creux' : 'plein' })}
                    />
                    <span>{c.jamais}</span>
                  </label>

                  <button type="button" className="atl__retirer" onClick={() => retirer(bloc.id)}>
                    {c.supprimer}
                  </button>
                </div>
              )}

              <div className="atl__releve">
                <h2 className="atl__releve-titre">{c.releve}</h2>
                <p className="atl__chiffres">{releve.join(' · ')}</p>
                <p className="atl__verdict">{lecture.verdict}</p>
              </div>

              <div className="atl__emporter">
                <h2 className="atl__releve-titre">{c.emporter}</h2>
                <div className="atl__boutons">
                  <button type="button" className="btn btn--ghost" onClick={versPng} disabled={!blocs.length}>
                    {c.png}
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={versSvg} disabled={!blocs.length}>
                    {c.svg}
                  </button>
                </div>
                <button type="button" className="btn btn--primary atl__envoyer" onClick={envoyer} disabled={!blocs.length}>
                  {c.envoyer}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </button>
                <p className="atl__note">{c.envoiNote}</p>
                <p className="atl__note">{c.prive}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
