import { useLang } from '../i18n';
import { useProfil, cheminInterne, BASE } from '../profil';
import { ESPACES } from '../data/espaces';
import { MARQUES, MARQUE_DE_L_ESPACE } from '../data/marques';

/* ════════════════════════════════════════════════════════════
   LE SÉLECTEUR DE MARQUE — « Create · Define · Elevate », dans l'en-tête.

   La même pastille que sur le reste du site, à la même place, à côté du
   logo : on voit en permanence qu'il y a trois espaces, lequel on regarde,
   et comment passer à un autre en un geste. Entre TPE et PME, on reste sur
   la page où l'on est (les offres PME mènent aux offres TPE) ; l'espace
   « en projet » est une autre application, on y va par un vrai lien.

   Ce sont de vrais liens : un clic du milieu ouvre l'autre espace dans un
   onglet, et un lecteur d'écran annonce des liens, pas des réglages.
   ════════════════════════════════════════════════════════════ */

export default function Espaces({ className = '' }) {
  const { lang } = useLang();
  const { profil, setProfil } = useProfil();
  const interne = cheminInterne();

  return (
    <nav className={`esp ${className}`} aria-label={lang === 'en' ? 'Your situation' : 'Votre situation'}>
      {ESPACES.map((e) => {
        const marque = MARQUES[MARQUE_DE_L_ESPACE[e.id]];
        const m = { ...(e[lang] || e.fr), titre: `Reskope ${marque.nom} · ${(marque[lang] || marque.fr).qui}` };
        const contenu = (
          <>
            <i className={`esp__point esp--${e.accent}`} aria-hidden="true" />
            {marque.nom}
          </>
        );
        if (e.id === profil) {
          return <span key={e.id} className="esp__seg is-actif" aria-current="true" title={m.titre}>{contenu}</span>;
        }
        if (e.id === 'creation') {
          return (
            <a key={e.id} href={`${BASE}/creation/`} className="esp__seg" title={m.titre} hrefLang={lang === 'en' ? 'fr' : undefined}>
              {contenu}
            </a>
          );
        }
        const href = `${BASE}/${e.id}${interne === '/' ? '/' : `${interne}/`}`;
        const basculer = (ev) => {
          if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault();
          setProfil(e.id);
        };
        return <a key={e.id} href={href} className="esp__seg" title={m.titre} onClick={basculer}>{contenu}</a>;
      })}
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════
   LES TUILES D'ESPACE — le même choix, en grand, en tête du menu et dans le
   pied de page : le point de couleur, le nom, la taille d'entreprise, et
   une flèche. On voit que c'est un bouton, et à quoi il mène.
   ════════════════════════════════════════════════════════════ */

export function EspacesTuiles({ className = '' }) {
  const { lang } = useLang();
  const { profil, setProfil } = useProfil();
  const interne = cheminInterne();
  const en = lang === 'en';

  return (
    <nav className={`espt ${className}`} aria-label={en ? 'Choose your space' : 'Choisir votre espace'}>
      {ESPACES.map((e) => {
        const marque = MARQUES[MARQUE_DE_L_ESPACE[e.id]];
        const ici = e.id === profil;
        const classe = `espt__tuile espt--${e.accent}${ici ? ' is-actif' : ''}`;
        const contenu = (
          <>
            <i className={`esp__point esp--${e.accent}`} aria-hidden="true" />
            <span className="espt__nom"><span className="espt__mere">Reskope </span>{marque.nom}</span>
            <span className="espt__sous">{(marque[lang] || marque.fr).pour}</span>
            <span className="espt__etat" aria-hidden="true">
              {ici ? (en ? 'You are here' : 'Vous êtes ici') : (en ? 'Enter →' : 'Entrer →')}
            </span>
          </>
        );
        if (ici) return <span key={e.id} className={classe} aria-current="true">{contenu}</span>;
        if (e.id === 'creation') {
          return <a key={e.id} href={`${BASE}/creation/`} className={classe} hrefLang={en ? 'fr' : undefined}>{contenu}</a>;
        }
        const href = `${BASE}/${e.id}${interne === '/' ? '/' : `${interne}/`}`;
        const basculer = (ev) => {
          if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
          ev.preventDefault();
          setProfil(e.id);
        };
        return <a key={e.id} href={href} className={classe} onClick={basculer}>{contenu}</a>;
      })}
    </nav>
  );
}
