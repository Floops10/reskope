import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import { useProfil } from '../profil';
import { RESERVE } from '../data/profils';

/* ============================================================
   Le bandeau d'une page qui ne concerne pas le profil courant.

   On ne redirige pas et on ne cache pas le contenu : quelqu'un peut
   arriver ici par un lien, un moteur de recherche ou une carte de visite,
   et se faire renvoyer ailleurs sans explication est la pire des
   réponses. On dit franchement à qui la page s'adresse, on propose la
   bascule en un clic, et on laisse lire.

   `pour` = le profil auquel la page est destinée. Le bandeau ne s'affiche
   que si le visiteur n'est pas celui-là.
   ============================================================ */
export default function ReservePme({ pour = 'pme' }) {
  const { lang } = useLang();
  const { profil, setProfil } = useProfil();
  if (profil === pour) return null;

  const r = RESERVE[lang][pour];

  return (
    <aside className="resv" role="note">
      <div className="container resv__inner">
        <span className="resv__node" aria-hidden="true" />
        <p className="resv__txt">{r.txt}</p>
        <div className="resv__actions">
          <button type="button" className="resv__btn" onClick={() => setProfil(pour)}>
            {r.act}
            <span aria-hidden="true">→</span>
          </button>
          <Link className="resv__lien" to={r.autreTo}>{r.autre}</Link>
        </div>
      </div>
    </aside>
  );
}
