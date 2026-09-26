import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ScrollTrigger } from './lib/gsap';
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll';
import { initContentGuard } from './lib/contentGuard';
import ScrollToTop from './components/ScrollToTop';
import Cursor from './components/Cursor';
import HeroNetwork from './components/HeroNetwork';
import PageTransition from './components/PageTransition';
import Interactions from './components/Interactions';
import Nav from './components/Nav';
import Breadcrumb from './components/Breadcrumb';
import Footer from './components/Footer';
import Home from './pages/Home';

/* L'accueil part avec le paquet principal ; les autres pages ne sont
   demandées qu'à la visite. Elles tiraient toutes avec elles le moteur 3D
   (la vitrine des offres, l'atelier, le constat) : l'accueil d'une TPE
   téléchargeait près d'un mégaoctet de code qu'il n'utilisait pas. */
const Pourquoi = lazy(() => import('./pages/Pourquoi'));
const Methode = lazy(() => import('./pages/Methode'));
const Offres = lazy(() => import('./pages/Offres'));
const Exemple = lazy(() => import('./pages/Exemple'));
const Atelier = lazy(() => import('./pages/Atelier'));
const Ecologie = lazy(() => import('./pages/Ecologie'));
const APropos = lazy(() => import('./pages/APropos'));
const Contact = lazy(() => import('./pages/Contact'));
const MentionsLegales = lazy(() => import('./pages/Legales').then((m) => ({ default: m.MentionsLegales })));
const Confidentialite = lazy(() => import('./pages/Legales').then((m) => ({ default: m.Confidentialite })));
const CGU = lazy(() => import('./pages/Legales').then((m) => ({ default: m.CGU })));
const CGV = lazy(() => import('./pages/Legales').then((m) => ({ default: m.CGV })));
const NotFound = lazy(() => import('./pages/Etats').then((m) => ({ default: m.NotFound })));
const Merci = lazy(() => import('./pages/Etats').then((m) => ({ default: m.Merci })));

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
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      {/* La trame de la marque, posée UNE SEULE FOIS derrière tout le site.
          Chaque hero avait la sienne : sur l'accueil, deux réseaux se
          superposaient — celui du hero et celui du fond — et la densité
          changeait d'une page à l'autre. Il n'y en a plus qu'un, avec la
          densité d'origine du hero, et il est le même partout. */}
      <div className="fond" aria-hidden="true"><HeroNetwork /></div>
      <Cursor />
      <PageTransition />
      <Interactions />
      <Nav />
      <Suspense fallback={<main id="contenu" className="attente-page" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pourquoi" element={<Pourquoi />} />
        <Route path="/methode" element={<Methode />} />
        <Route path="/offres" element={<Offres />} />
        <Route path="/exemple" element={<Exemple />} />
        <Route path="/atelier" element={<Atelier />} />
        <Route path="/numerique-responsable" element={<Ecologie />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/merci" element={<Merci />} />
        {/* Route inconnue : page 404 dédiée (avant, la Home s'affichait
            silencieusement — mauvais pour l'utilisateur comme pour le SEO). */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
      {/* Fil d'Ariane en fin de page : la nav est fixe et transparente au-dessus
          de héros plein écran, un bandeau en haut passerait sous le logo. */}
      <Breadcrumb />
      <Footer />
    </MotionConfig>
  );
}
