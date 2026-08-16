import { useLang } from '../i18n';

/* ZONE D'INTERVENTION — carte dessinée en SVG, dans le langage réseau de la
   marque (villes = nœuds, déplacements = liens), plus un lien d'itinéraire.

   Pourquoi pas une iframe Google Maps : elle déposerait des cookies tiers
   chez chaque visiteur, imposerait d'ouvrir la CSP à Google, et jurerait
   avec la DA. Le lien « Itinéraire » n'ouvre une carte que si l'utilisateur
   le demande — même principe que Cal.com. */

const BASE = { name: 'Valenciennes', x: 50, y: 52, base: true };
const VILLES = [
  BASE,
  { name: 'Lille', x: 34, y: 24 },
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
    lead: 'Basé à Valenciennes, j’interviens sur place dans tout le Hainaut et les Hauts-de-France. L’audit se fait chez vous, salarié par salarié — c’est ce qui en fait la valeur.',
    radius: 'Déplacement sans frais dans un rayon de 60 km',
    beyond: 'Au-delà, les frais sont annoncés dans le devis, jamais après.',
    itinerary: 'Ouvrir l’itinéraire',
    baseLabel: 'Point de départ',
  },
  en: {
    eyebrow: 'Service area',
    title: 'On site, not remote.',
    lead: 'Based in Valenciennes, I work on site across the Hainaut area and the Hauts-de-France region. The audit happens at your premises, employee by employee — that is what makes it worth something.',
    radius: 'No travel charge within a 60 km radius',
    beyond: 'Beyond that, travel costs are stated in the quote, never afterwards.',
    itinerary: 'Open directions',
    baseLabel: 'Starting point',
  },
};

export default function ZoneMap() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  /* geo: ouvre l'app de cartes native ; fallback web si non supportée */
  const directions = 'https://www.openstreetmap.org/directions?to=50.3573%2C3.5234';

  return (
    <section className="zone" aria-labelledby="zone-title">
      <div className="container zone__inner">
        <div className="zone__copy">
          <p className="eyebrow eyebrow--index">{c.eyebrow}</p>
          <h2 className="h2" id="zone-title">{c.title}</h2>
          <p className="lead">{c.lead}</p>
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
          <svg viewBox="0 0 100 100" role="img" aria-label={c.lead}>
            {/* rayon d'intervention */}
            <circle className="zone__radius" cx={BASE.x} cy={BASE.y} r="34" />
            {/* liens depuis la base */}
            <g className="zone__links">
              {VILLES.filter((v) => !v.base).map((v) => (
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
            {c.baseLabel} · Valenciennes
          </p>
        </div>
      </div>
    </section>
  );
}
