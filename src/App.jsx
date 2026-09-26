import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollTrigger } from './lib/gsap';
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll';
import { initContentGuard } from './lib/contentGuard';
import { nouvelleAdresse } from './data/seo';
import ScrollToTop from './components/ScrollToTop';
import Cursor from './components/Cursor';
import HeroNetwork from './components/HeroNetwork';
import PageTransition from './components/PageTransition';
import Interactions from './components/Interactions';
import Nav from './components/Nav';
import Breadcrumb from './components/Breadcrumb';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';

/* L'accueil part avec le paquet principal ; toutes les autres pages ne sont
   demandées qu'à la visite. Le dirigeant qui lit l'accueil sur son
   téléphone, entre deux rendez-vous, ne télécharge rien d'autre. */
const PortePage = lazy(() => import('./pages/PortePage'));
const NosOffres = lazy(() => import('./pages/NosOffres'));
const CommentCaSePasse = lazy(() => import('./pages/CommentCaSePasse'));
const Exemple = lazy(() => import('./pages/Exemple'));
const ExempleBilan = lazy(() => import('./pages/ExempleBilan'));
const Atelier = lazy(() => import('./pages/Atelier'));
const QuiOnEst = lazy(() => import('./pages/QuiOnEst'));
const Contact = lazy(() => import('./pages/Contact'));
const MentionsLegales = lazy(() => import('./pages/Legales').then((m) => ({ default: m.MentionsLegales })));
const Confidentialite = lazy(() => import('./pages/Legales').then((m) => ({ default: m.Confidentialite })));
const CGU = lazy(() => import('./pages/Legales').then((m) => ({ default: m.CGU })));
const CGV = lazy(() => import('./pages/Legales').then((m) => ({ default: m.CGV })));
const NotFound = lazy(() => import('./pages/Etats').then((m) => ({ default: m.NotFound })));
const Merci = lazy(() => import('./pages/Etats').then((m) => ({ default: m.Merci })));

/* Une ancienne adresse : on la renvoie vers la page qui dit aujourd'hui la
   même chose, sans laisser d'entrée dans l'historique. */
function Ancienne() {
  const { pathname } = useLocation();
  return <Navigate to={nouvelleAdresse(pathname) || '/'} replace />;
}

export default function App() {
  useEffect(() => {
    initSmoothScroll();
    const releaseGuard = initContentGuard();
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 600);
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      releaseGuard();
      destroySmoothScroll();
    };
  }, []);

  return (
    <>
      <a className="evitement" href="#contenu">Aller au contenu</a>
      <ScrollToTop />
      {/* La trame de la marque, posée une seule fois derrière tout le site. */}
      <div className="fond" aria-hidden="true"><HeroNetwork /></div>
      <Cursor />
      <PageTransition />
      <Interactions />
      <Nav />
      <Suspense fallback={<main id="contenu" className="attente-page" />}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/tester-une-idee" element={<PortePage key="idee" id="idee" />} />
          <Route path="/comprendre-vos-clients" element={<PortePage key="clients" id="clients" />} />
          <Route path="/relire-votre-dossier" element={<PortePage key="dossier" id="dossier" />} />
          <Route path="/nos-offres" element={<NosOffres />} />
          <Route path="/comment-ca-se-passe" element={<CommentCaSePasse />} />
          <Route path="/exemple" element={<Exemple />} />
          <Route path="/exemple-bilan" element={<ExempleBilan />} />
          <Route path="/atelier" element={<Atelier />} />
          <Route path="/qui-on-est" element={<QuiOnEst />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/merci" element={<Merci />} />

          {/* Les adresses de l'ancienne version du site. */}
          <Route path="/tpe/*" element={<Ancienne />} />
          <Route path="/pme/*" element={<Ancienne />} />
          <Route path="/offres" element={<Ancienne />} />
          <Route path="/methode" element={<Ancienne />} />
          <Route path="/a-propos" element={<Ancienne />} />
          <Route path="/pourquoi" element={<Ancienne />} />
          <Route path="/numerique-responsable" element={<Ancienne />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/* Fil d'Ariane en fin de page : la nav est fixe et transparente
          au-dessus des premiers écrans, un bandeau en haut passerait sous
          le logo. */}
      <Breadcrumb />
      <Footer />
    </>
  );
}
