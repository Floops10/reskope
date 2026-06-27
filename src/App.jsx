import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ScrollTrigger } from './lib/gsap';
import { initSmoothScroll, destroySmoothScroll } from './lib/smoothScroll';
import ScrollToTop from './components/ScrollToTop';
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

export default function App() {
  useEffect(() => {
    initSmoothScroll();
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
    const t = setTimeout(refresh, 600);
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      destroySmoothScroll();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
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
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </MotionConfig>
  );
}
