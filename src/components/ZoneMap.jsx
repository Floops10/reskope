import { useLang } from '../i18n';
import { useProfil } from '../profil';

/* ZONE D'INTERVENTION — carte dessinée en SVG, dans le langage réseau de la
   marque (villes = nœuds, déplacements = liens), plus un lien d'itinéraire.

   Pourquoi pas une iframe Google Maps : elle déposerait des cookies tiers
   chez chaque visiteur, imposerait d'ouvrir la CSP à Google, et jurerait
   avec la DA. Le lien « Itinéraire » n'ouvre une carte que si l'utilisateur
   le demande — même principe que Cal.com. */

/* On est deux, et on n'est pas au même endroit : la carte porte deux points
   de départ, pas un seul avec l'autre ville en satellite. */
const BASE = { name: 'Valenciennes', x: 50, y: 52, base: true };
const VILLES = [
  BASE,
  { name: 'Lille', x: 34, y: 24, base: true },
  { name: 'Douai', x: 30, y: 46 },
  { name: 'Cambrai', x: 40, y: 74 },
  { name: 'Maubeuge', x: 76, y: 58 },
  { name: 'Saint-Amand', x: 58, y: 28 },
  { name: 'Le Quesnoy', x: 66, y: 76 },
];

const CONTENT = {
  fr: {
    eyebrow: 'Zone d’intervention',
    title: 'Sur le terrain, pas à distance.',
    lead: 'Basés à Valenciennes et à Lille, on intervient sur place dans tout le Hainaut et les Hauts-de-France. L’audit se fait chez vous, salarié par salarié : c’est ce qui en fait la valeur.',
    radius: 'Déplacement sans frais dans un rayon de 60 km',
    beyond: 'Au-delà, les frais sont annoncés dans le devis, jamais après.',
    itinerary: 'Ouvrir l’itinéraire',
    baseLabel: 'Points de départ',
    bases: 'Valenciennes et Lille',
    /* Chez une TPE il n'y a pas d'audit poste par poste : ce qui justifie
       le déplacement, c'est de voir le local, le métier et les clients. */
    leadTpe: 'Basés à Valenciennes et à Lille, on intervient sur place dans tout le Hainaut et les Hauts-de-France. On vient voir le local, le métier, la clientèle : un site qui ressemble vraiment à l’entreprise ne se fabrique pas en visioconférence.',
  },
  en: {
    eyebrow: 'Service area',
    title: 'On site, not remote.',
    lead: 'Based in Valenciennes and Lille, we work on site across the Hainaut area and the Hauts-de-France region. The audit happens at your premises, employee by employee: that is what makes it worth something.',
    radius: 'No travel charge within a 60 km radius',
    beyond: 'Beyond that, travel costs are stated in the quote, never afterwards.',
    itinerary: 'Open directions',
    baseLabel: 'Starting points',
    bases: 'Valenciennes and Lille',
    leadTpe: 'Based in Valenciennes and Lille, we work on site across the Hainaut area and the Hauts-de-France region. We come and see the premises, the trade, the customers: a site that genuinely looks like the business is not built over a video call.',
  },
};

export default function ZoneMap() {
  const { lang } = useLang();
  const { profil } = useProfil();
  const c = CONTENT[lang];
  const lead = profil === 'tpe' ? c.leadTpe : c.lead;
  /* geo: ouvre l'app de cartes native ; fallback web si non supportée */
  const directions = 'https://www.openstreetmap.org/directions?to=50.3573%2C3.5234';

  return (
    /* Elle arrive juste après la scène sombre de prise de rendez-vous :
       elle remonte par-dessus avec le même arrondi que partout ailleurs. */
    <section className="zone couture-claire" aria-labelledby="zone-title">
      <div className="container zone__inner">
        <div className="zone__copy">
          <p className="eyebrow eyebrow--index">{c.eyebrow}</p>
          <h2 className="h2" id="zone-title">{c.title}</h2>
          <p className="lead">{lead}</p>
          <ul className="zone__facts">
            <li><span className="zone__node" aria-hidden="true" />{c.radius}</li>
            <li><span className="zone__node" aria-hidden="true" />{c.beyond}</li>
          </ul>
          <a
            className="btn btn--ghost"
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.itinerary}
            <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="zone__map">
          <svg viewBox="0 0 100 100" role="img" aria-label={lead}>
            {/* rayon d'intervention */}
            <circle className="zone__radius" cx={BASE.x} cy={BASE.y} r="34" />
            {/* liens depuis la base */}
            {/* Le trait part de Valenciennes vers chaque ville, Lille
                comprise : les deux points de départ sont reliés. */}
            <g className="zone__links">
              {VILLES.filter((v) => v !== BASE).map((v) => (
                <line key={v.name} x1={BASE.x} y1={BASE.y} x2={v.x} y2={v.y} />
              ))}
            </g>
            {/* villes */}
            {VILLES.map((v) => (
              <g key={v.name} className={`zone__city${v.base ? ' is-base' : ''}`}>
                <circle cx={v.x} cy={v.y} r={v.base ? 3.4 : 2} />
                <text x={v.x} y={v.y - (v.base ? 6 : 4.5)}>{v.name}</text>
              </g>
            ))}
          </svg>
          <p className="zone__legend">
            <span className="zone__node zone__node--base" aria-hidden="true" />
            {c.baseLabel} · {c.bases}
          </p>
        </div>
      </div>
    </section>
  );
}
