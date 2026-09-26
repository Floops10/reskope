import { Link } from 'react-router-dom';
import { ESPACES, adresseEspace } from '../data/espaces';

/* ════════════════════════════════════════════════════════════
   LE SÉLECTEUR D'ESPACE — « En projet · TPE · PME », dans l'en-tête.

   On voit en permanence qu'il y a trois espaces, lequel on regarde, et
   comment passer à un autre en un geste. La même pastille existe dans
   l'espace TPE et PME, à la même place : on ne se perd pas en changeant.
   Chaque segment porte le point de couleur de son espace.
   ════════════════════════════════════════════════════════════ */

export default function Espaces({ actif, className = '' }) {
  return (
    <nav className={`esp ${className}`} aria-label="Votre situation">
      {ESPACES.map((e) => {
        const contenu = (
          <>
            <i className={`esp__point esp--${e.accent}`} aria-hidden="true" />
            {e.court}
          </>
        );
        const titre = e.id === 'creation' ? 'Vous créez ou reprenez une entreprise' : `Entreprise de ${e.taille}`;
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
