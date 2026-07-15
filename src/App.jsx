import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ScrollTrigger } from './lib/gsap';
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll';
import { initContentGuard } from './lib/contentGuard';
import ScrollToTop from './components/ScrollToTop';
import Cursor from './components/Cursor';
import PageTransition from './components/PageTransition';
import Interactions from './components/Interactions';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pourquoi from './pages/Pourquoi';
import Methode from './pages/Methode';
import Offres from './pages/Offres';
import Exemple from './pages/Exemple';
import Ecologie from './pages/Ecologie';
import APropos from './pages/APropos';
import Contact from './pages/Contact';
import { MentionsLegales, Confidentialite, CGU, CGV } from './pages/Legales';

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
      <Cursor />
      <PageTransition />
      <Interactions />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pourquoi" element={<Pourquoi />} />
        <Route path="/methode" element={<Methode />} />
        <Route path="/offres" element={<Offres />} />
        <Route path="/exemple" element={<Exemple />} />
        <Route path="/numerique-responsable" element={<Ecologie />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
        <Route path="/confidentialite" element={<Confidentialite />} />
        <Route path="/cgu" element={<CGU />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </MotionConfig>
  );
}
