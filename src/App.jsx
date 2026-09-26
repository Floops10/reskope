import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ScrollTrigger } from './lib/gsap';
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll';
import { initContentGuard } from './lib/contentGuard';
import { versEntreprises } from './data/seo';
import ScrollToTop from './components/ScrollToTop';
import Cursor from './components/Cursor';
import HeroNetwork from './components/HeroNetwork';
import PageTransition from './components/PageTransition';
import Interactions from './components/Interactions';
import Nav from './components/Nav';
import Breadcrumb from './components/Breadcrumb';
import Footer from './components/Footer';
import Aiguillage from './pages/Aiguillage';

/* L'aiguillage part avec le paquet principal ; toutes les autres pages ne
   sont demandées qu'à la visite. Qui arrive sur son téléphone, entre deux
   rendez-vous, ne télécharge que la question. */
const Creation = lazy(() => import('./pages/Creation'));
const PortePage = lazy(() => import('./pages/PortePage'));
const NosOffres = lazy(() => import('./pages/NosOffres'));
const CommentCaSePasse = lazy(() => import('./pages/CommentCaSePasse'));
const Exemple = lazy(() => import('./pages/Exemple'));
const QuiOnEst = lazy(() => import('./pages/QuiOnEst'));
const Contact = lazy(() => import('./pages/Contact'));
const MentionsLegales = lazy(() => import('./pages/Legales').then((m) => ({ default: m.MentionsLegales })));
const Confidentialite = lazy(() => import('./pages/Legales').then((m) => ({ default: m.Confidentialite })));
const CGU = lazy(() => import('./pages/Legales').then((m) => ({ default: m.CGU })));
const CGV = lazy(() => import('./pages/Legales').then((m) => ({ default: m.CGV })));
const NotFound = lazy(() => import('./pages/Etats').then((m) => ({ default: m.NotFound })));
const Merci = lazy(() => import('./pages/Etats').then((m) => ({ default: m.Merci })));

/* Une adresse qui vit dans l'espace des entreprises (TPE et PME), servi par
   l'autre application du site : on y va par un vrai chargement de page, sans
   laisser d'entrée dans l'historique. En développement, cet espace tourne à
   part (npm run dev:tech) : on le dit plutôt que de boucler. */
function VersEntreprises() {
  const { pathname } = useLocation();
  const cible = versEntreprises(pathname);
  /* Garde-fou : si la page visée manquait à la construction, on reviendrait
     ici indéfiniment. Dans ce cas, on s'arrête sur l'accueil de l'espace. */
  const ici = (p) => p.replace(/\/+$/, '');
  const vers = cible && ici(`/${cible}`) === ici(pathname) ? `${cible.split('/')[0]}/` : cible;
  const dev = import.meta.env.DEV;
  useEffect(() => {
    if (vers && !dev) window.location.replace(`${import.meta.env.BASE_URL}${vers}`);
  }, [vers, dev]);
  if (!vers) return <Navigate to="/" replace />;
  if (dev) {
    return (
      <main id="contenu" className="attente-page attente-page--dev">
        <p>En développement, l’espace des entreprises tourne à part : <code>npm run dev:tech</code>, puis <code>localhost:5182{import.meta.env.BASE_URL}{vers}</code>.</p>
      </main>
    );
  }
  return <main id="contenu" className="attente-page" />;
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
          <Route path="/" element={<Aiguillage />} />
          <Route path="/creation" element={<Creation />} />
          <Route path="/tester-une-idee" element={<PortePage key="idee" id="idee" />} />
          <Route path="/construire-votre-business-plan" element={<PortePage key="bp" id="bp" />} />
          <Route path="/comprendre-vos-clients" element={<PortePage key="clients" id="clients" />} />
          <Route path="/relire-votre-dossier" element={<PortePage key="dossier" id="dossier" />} />
          <Route path="/nos-offres" element={<NosOffres />} />
          <Route path="/comment-ca-se-passe" element={<CommentCaSePasse />} />
          <Route path="/exemple" element={<Exemple />} />
          <Route path="/qui-on-est" element={<QuiOnEst />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/confidentialite" element={<Confidentialite />} />
          <Route path="/cgu" element={<CGU />} />
          <Route path="/cgv" element={<CGV />} />
          <Route path="/merci" element={<Merci />} />

          {/* L'espace des entreprises, et les anciennes adresses qui y mènent. */}
          <Route path="/tpe/*" element={<VersEntreprises />} />
          <Route path="/pme/*" element={<VersEntreprises />} />
          <Route path="/offres" element={<VersEntreprises />} />
          <Route path="/methode" element={<VersEntreprises />} />
          <Route path="/a-propos" element={<VersEntreprises />} />
          <Route path="/pourquoi" element={<VersEntreprises />} />
          <Route path="/numerique-responsable" element={<VersEntreprises />} />
          <Route path="/atelier" element={<VersEntreprises />} />
          <Route path="/exemple-bilan" element={<VersEntreprises />} />

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
