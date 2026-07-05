import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import { Reveal, RevealItem } from '../components/Reveal';
import { useLang } from '../i18n';
import { JALONS } from '../data/site';

const MethodeFlight = lazy(() => import('../components/MethodeFlight'));

/* LA MÉTHODE — le vol cinématographique (WebGL) :
   1. LE VOL : caméra qui traverse une structure-réseau (fond crème), texte
      HTML net ancré en 3D, jalon par jalon.
   2. LIVRABLE : le bilan que vous gardez. */

const CONTENT = {
  fr: {
    metaTitle: 'La méthode · votre système, assemblé jalon par jalon',
    metaDesc:
      "Reskope ne propose jamais de solution avant le diagnostic. Cadrage, audit, bilan, mise en œuvre, autonomie : le parcours qui assemble vos outils en un système clair, en toute transparence.",
    labels: { milestone: 'Jalon', here: 'vous démarrez ici', youGet: 'Ce que vous obtenez', hint: 'Survolez un point du réseau pour les détails' },
    film: {
      introKicker: 'La méthode',
      introTitle: 'On assemble votre système.',
      introText: 'Des outils épars aujourd’hui. Un parcours clair pour en faire un système qui tient tout seul.',
      synthCap: 'Cinq jalons. Un système qui tient tout seul.',
    },
    calloutTitle: 'Le livrable : un bilan que vous gardez.',
    calloutText:
      "À la fin de l'audit, vous repartez avec un document clair : constats, cartographie, recommandations priorisées et gains estimés. Vous l'appliquez vous-même ou vous m'en confiez la mise en œuvre.",
    calloutBtn: 'Voir un exemple de bilan',
  },
  en: {
    metaTitle: 'The method · your system, assembled milestone by milestone',
    metaDesc:
      'Reskope never proposes a solution before the diagnosis. Framing, audit, report, delivery, autonomy: the journey that assembles your tools into a clear system, in full transparency.',
    labels: { milestone: 'Milestone', here: 'you start here', youGet: 'What you get', hint: 'Hover a network point for details' },
    film: {
      introKicker: 'The method',
      introTitle: 'We assemble your system.',
      introText: 'Scattered tools today. A clear journey to turn them into a system that stands on its own.',
      synthCap: 'Five milestones. A system that stands on its own.',
    },
    calloutTitle: 'The deliverable: a report you keep.',
    calloutText:
      'At the end of the audit, you leave with a clear document: findings, mapping, prioritized recommendations and estimated gains. You apply it yourself, or you entrust the delivery to me.',
    calloutBtn: 'See an example report',
  },
};

export default function Methode() {
  const { lang } = useLang();
  const c = CONTENT[lang];
  const jalons = JALONS[lang];

  return (
    <Page title={c.metaTitle} description={c.metaDesc}>

      {/* 1 — Le vol : la traversée de la structure-réseau */}
      <Suspense fallback={<div className="mfl-loading" aria-hidden="true" />}>
        <MethodeFlight jalons={jalons} film={c.film} labels={c.labels} />
      </Suspense>

      {/* 2 — Le livrable */}
      <section className="section">
        <div className="container">
          <Reveal className="callout">
            <RevealItem as="h2" className="h2">{c.calloutTitle}</RevealItem>
            <RevealItem as="p" className="lead">{c.calloutText}</RevealItem>
            <RevealItem>
              <Link className="btn btn--ghost" to="/exemple">
                {c.calloutBtn}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </RevealItem>
          </Reveal>
        </div>
      </section>

    </Page>
  );
}
