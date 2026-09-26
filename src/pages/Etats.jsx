import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { Reveal, RevealItem } from '../components/Reveal';
import { LogoMark } from '../components/Logo';
import { PORTES } from '../data/offres';

/* Pages d'état : 404 (adresse inconnue) et remerciement (après l'envoi d'un
   message). Toutes deux ramènent vers une action utile plutôt que de laisser
   le visiteur dans une impasse. */

export function NotFound() {
  return (
    <Page title="Page introuvable" description="Cette adresse n’existe pas, ou plus. Voici les pages les plus utiles du site Reskope.">
      {/* Fond presque noir : le header et le curseur y passent en clair. */}
      <section className="state-page" data-nav-dark data-cursor-dark>
        <div className="container state-page__inner">
          <Reveal>
            <RevealItem>
              <span className="state-page__mark" aria-hidden="true"><LogoMark /></span>
            </RevealItem>
            <RevealItem as="h1" className="state-page__title">Cette page n’existe pas.</RevealItem>
            <RevealItem as="p" className="state-page__lead">
              Le lien est peut-être ancien, ou l’adresse comporte une coquille. Vous étiez peut-être dans l’une
              de ces situations :
            </RevealItem>
            <RevealItem>
              <ul className="state-page__links">
                {PORTES.map((p) => (
                  <li key={p.id}>
                    <Link to={p.slug}>{p.nom}<span aria-hidden="true">→</span></Link>
                  </li>
                ))}
                <li>
                  <Link to="/nos-offres">Toutes nos offres<span aria-hidden="true">→</span></Link>
                </li>
              </ul>
            </RevealItem>
            <RevealItem>
              <Link to="/" className="btn btn--primary">
                Retour à l’accueil<span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}

export function Merci() {
  return (
    <Page>
      <section className="state-page state-page--thanks" data-nav-dark data-cursor-dark>
        <div className="container state-page__inner">
          <Reveal>
            <RevealItem>
              <span className="state-page__mark state-page__mark--ok" aria-hidden="true"><LogoMark /></span>
            </RevealItem>
            <RevealItem as="h1" className="state-page__title">Votre message est parti.</RevealItem>
            <RevealItem as="p" className="state-page__lead">
              On vous répond sous vingt-quatre heures, directement, et pas par un accusé de réception
              automatique. Si votre demande ne relève pas de notre métier, on vous le dit franchement.
            </RevealItem>

            <RevealItem>
              <div className="state-page__next">
                <p className="state-page__next-title">Ce qui se passe maintenant</p>
                <ol className="state-page__steps state-page__steps--fil">
                  <li>On lit votre message, et on vous propose trente minutes.</li>
                  <li>On échange, gratuitement, sur votre situation.</li>
                  <li>Sous quarante-huit heures, vous recevez une proposition écrite, avec un prix fixe.</li>
                </ol>
              </div>
            </RevealItem>

            <RevealItem as="p" className="state-page__meanwhile">
              En attendant, vous pouvez voir une mission complète, du premier lundi à la décision.
            </RevealItem>

            <RevealItem>
              <div className="state-page__actions">
                <Link to="/exemple" className="btn btn--primary">
                  Voir un exemple complet<span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
                <Link to="/" className="btn btn--on-dark btn--ghost-dark">Retour à l’accueil</Link>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
