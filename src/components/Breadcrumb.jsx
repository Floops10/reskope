import { Link, useLocation } from 'react-router-dom';
import { fiche, url } from '../data/seo';

/* Fil d'Ariane : situe le visiteur et donne à Google la hiérarchie du site.
   Rendu uniquement sur les pages intérieures. Le JSON-LD BreadcrumbList
   accompagne le rendu visuel : c'est lui qui produit le chemin sous le lien
   dans les résultats. Les libellés viennent de la table de référencement,
   la même que le pré-rendu. */

/* Les trois missions par lesquelles on commence vivent sous « Nos offres » :
   le fil le dit, et le visiteur qui arrive par un moteur remonte d'un cran
   vers l'ensemble de l'offre plutôt que vers l'accueil. */
const PARENT = {
  '/tester-une-idee': '/nos-offres',
  '/comprendre-vos-clients': '/nos-offres',
  '/relire-votre-dossier': '/nos-offres',
  '/exemple-bilan': '/exemple',
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const route = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  if (route === '/') return null;

  const f = fiche(route);
  if (!f) return null; // route inconnue (404) : pas de fil d'Ariane

  const chaine = [{ route: '/', label: 'Accueil' }];
  if (PARENT[route]) chaine.push({ route: PARENT[route], label: fiche(PARENT[route]).fil });
  chaine.push({ route, label: f.fil });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: chaine.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.label, item: url(c.route),
    })),
  };

  return (
    <nav className="crumb" aria-label="Fil d’Ariane">
      <div className="container crumb__inner">
        <ol>
          {chaine.map((c, i) => (
            <li key={c.route}>
              {i > 0 && <span className="crumb__sep" aria-hidden="true"><span className="crumb__node" /></span>}
              {i < chaine.length - 1
                ? <Link to={c.route}>{c.label}</Link>
                : <span aria-current="page">{c.label}</span>}
            </li>
          ))}
        </ol>
      </div>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </nav>
  );
}
