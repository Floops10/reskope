import { Link } from 'react-router-dom';
import { ESPACES, adresseEspace } from '../data/espaces';
import { MARQUES, MARQUE_DE_L_ESPACE } from '../data/marques';

/* ════════════════════════════════════════════════════════════
   LE SÉLECTEUR DE MARQUE — « Create · Define · Elevate », dans l'en-tête.

   On voit en permanence qu'il y a trois espaces, lequel on regarde, et
   comment passer à un autre en un geste. La même pastille existe dans
   l'espace TPE et PME, à la même place : on ne se perd pas en changeant.
   Chaque segment porte le nom de sa marque et son point de couleur ; le
   survol dit à qui elle s'adresse.
   ════════════════════════════════════════════════════════════ */

export default function Espaces({ actif, className = '' }) {
  return (
    <nav className={`esp ${className}`} aria-label="Votre situation">
      {ESPACES.map((e) => {
        const contenu = (
          <>
            <i className={`esp__point esp--${e.accent}`} aria-hidden="true" />
            {MARQUES[MARQUE_DE_L_ESPACE[e.id]].nom}
          </>
        );
        const m = MARQUES[MARQUE_DE_L_ESPACE[e.id]];
        const titre = `Reskope ${m.nom} · ${m.fr.qui}`;
        if (e.id === actif) {
          return <span key={e.id} className="esp__seg is-actif" aria-current="true" title={titre}>{contenu}</span>;
        }
        return e.id === 'creation'
          ? <Link key={e.id} to="/creation" className="esp__seg" title={titre}>{contenu}</Link>
          : <a key={e.id} href={adresseEspace(e.id)} className="esp__seg" title={titre}>{contenu}</a>;
      })}
    </nav>
  );
}

/* ════════════════════════════════════════════════════════════
   LES TUILES D'ESPACE — le même choix, en grand, en tête du menu et dans le
   pied de page.

   Chaque espace est une vraie tuile : son point de couleur, son nom, la
   taille d'entreprise qu'il concerne, et une flèche. On voit tout de suite
   que c'est un bouton, et à quoi il mène. Celle où l'on est est pleine.
   ════════════════════════════════════════════════════════════ */

export function EspacesTuiles({ actif, className = '', label = 'Choisir votre marque' }) {
  return (
    <nav className={`espt ${className}`} aria-label={label}>
      {ESPACES.map((e) => {
        const ici = e.id === actif;
        const classe = `espt__tuile espt--${e.accent}${ici ? ' is-actif' : ''}`;
        const contenu = (
          <>
            <i className={`esp__point esp--${e.accent}`} aria-hidden="true" />
            <span className="espt__nom"><span className="espt__mere">Reskope </span>{MARQUES[MARQUE_DE_L_ESPACE[e.id]].nom}</span>
            <span className="espt__sous">{MARQUES[MARQUE_DE_L_ESPACE[e.id]].fr.pour}</span>
            <span className="espt__etat" aria-hidden="true">{ici ? 'Vous êtes ici' : 'Entrer →'}</span>
          </>
        );
        if (ici) return <span key={e.id} className={classe} aria-current="true">{contenu}</span>;
        return e.id === 'creation'
          ? <Link key={e.id} to="/creation" className={classe}>{contenu}</Link>
          : <a key={e.id} href={adresseEspace(e.id)} className={classe}>{contenu}</a>;
      })}
    </nav>
  );
}
