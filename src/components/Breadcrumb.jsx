import { Link, useLocation } from 'react-router-dom';
import { useT, useLang } from '../i18n';

/* Fil d'Ariane — situe le visiteur et donne à Google la hiérarchie du site.
   Rendu uniquement sur les pages intérieures (jamais sur l'accueil, où il
   n'aurait rien à afficher). Le JSON-LD BreadcrumbList accompagne le rendu
   visuel : c'est lui qui produit le chemin sous le lien dans les résultats. */

const SITE = 'https://floops10.github.io/reskope';

/* Pages absentes du menu principal : leur libellé n'est pas dans t.nav.tabs */
const EXTRA = {
  fr: {
    '/contact': 'Contact',
    '/merci': 'Message envoyé',
    '/mentions-legales': 'Mentions légales',
    '/confidentialite': 'Confidentialité',
    '/cgu': 'CGU',
    '/cgv': 'CGV',
  },
  en: {
    '/contact': 'Contact',
    '/merci': 'Message sent',
    '/mentions-legales': 'Legal notice',
    '/confidentialite': 'Privacy',
    '/cgu': 'Terms of use',
    '/cgv': 'Terms of sale',
  },
};

export default function Breadcrumb() {
  const { pathname } = useLocation();
  const { lang } = useLang();
  const t = useT();

  if (pathname === '/' || pathname === '') return null;

  const label = t.nav.tabs?.[pathname] || EXTRA[lang]?.[pathname];
  if (!label) return null; // route inconnue (404) : pas de fil d'Ariane

  const home = lang === 'fr' ? 'Accueil' : 'Home';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: home, item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: label, item: `${SITE}${pathname}` },
    ],
  };

  return (
    <nav className="crumb" aria-label={lang === 'fr' ? "Fil d'Ariane" : 'Breadcrumb'}>
      <div className="container crumb__inner">
        <ol>
          <li>
            <Link to="/">{home}</Link>
          </li>
          <li aria-hidden="true" className="crumb__sep">
            <span className="crumb__node" />
          </li>
          <li>
            <span aria-current="page">{label}</span>
          </li>
        </ol>
      </div>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </nav>
  );
}
