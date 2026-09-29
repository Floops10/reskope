import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import ReseauTaille from '../components/ReseauTaille';
import NetWord from '../components/NetWord';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { ESPACES, adresseEspace } from '../data/espaces';
import { MARQUES, MARQUE_DE_L_ESPACE } from '../data/marques';

/* ════════════════════════════════════════════════════════════
   L'ACCUEIL — la maison Reskope, et ses trois marques.

   Une question, trois réponses, et rien d'autre. La question est la
   première chose qu'on lit, et elle est concrète : où en est votre
   entreprise ? Chaque réponse est une marque, dans ses propres couleurs :
   Create pour qui se lance, Define pour une entreprise de 1 à 10
   personnes, Elevate de 10 à 250. On voit trois mondes, et on voit que
   c'est la même maison : même R, même méthode, un réseau qui grandit avec
   l'entreprise (un nœud, sept, vingt-six), relié d'une carte à l'autre.

   Le risque d'une maison à trois marques, c'est d'avoir l'air de tout
   faire. D'où la phrase sous les cartes : une seule façon de travailler,
   trois façons d'en parler. Et chaque marque ne montre que ses offres.

   Pas de barrière pour autant : un lien profond, un favori ou un moteur
   mènent directement aux pages, sans passer par ici, et le sélecteur de
   l'en-tête permet de changer de marque à tout moment.
   ════════════════════════════════════════════════════════════ */

function Carte({ e }) {
  const m = MARQUES[MARQUE_DE_L_ESPACE[e.id]];
  const contenu = (
    <>
      <span className="aig__ciel" aria-hidden="true" />
      <span className="aig__reseau"><ReseauTaille n={e.noeuds} /></span>
      <span className="aig__marque">
        <span className="aig__mere" aria-hidden="true">Reskope</span>
        <span className="aig__nom" aria-hidden="true"><NetWord className="aig__netword" heightEm={1}>{m.nom}</NetWord></span>
        <span className="sr-only">{`Reskope ${m.nom}`}</span>
      </span>
      <span className="aig__moment">{m.fr.moment}</span>
      <span className="aig__qui">{m.fr.qui}</span>
      <span className="aig__dit">{e.dit}</span>
      <span className="aig__entrer" aria-hidden="true">Entrer<span className="aig__fleche">→</span></span>
    </>
  );
  const classe = `aig__carte aig--${m.id}`;
  /* Create est dans cette application ; Define et Elevate sont servis à
     part, on y va par un vrai chargement de page. */
  return e.id === 'creation'
    ? <Link to="/creation" className={classe} data-cursor-label="Entrer" data-incliner>{contenu}</Link>
    : <a href={adresseEspace(e.id)} className={classe} data-cursor-label="Entrer" data-incliner>{contenu}</a>;
}

export default function Aiguillage() {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const q = gsap.utils.selector(racine);
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from(q('.aig__q'), { z: -700, y: 50, rotateX: -30, autoAlpha: 0, duration: 1.1, ease: 'power3.out' }, 0)
      .from(q('.aig__sous'), { z: -300, y: 20, autoAlpha: 0, duration: 0.8, ease: 'power3.out' }, 0.25)
      .from(q('.aig__carte'), {
        z: -560, y: 70, rotateX: -24, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.14,
      }, 0.35)
      .from(q('.aig__fil'), { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'power2.inOut' }, 0.8)
      .from(q('.rt__n'), {
        scale: 0, transformOrigin: 'center center', duration: 0.5, ease: 'back.out(2.2)',
        stagger: { each: 0.012, from: 'start' },
      }, 0.7)
      .from(q('.rt__l'), { autoAlpha: 0, duration: 0.6, ease: 'power2.out', stagger: 0.01 }, 0.9)
      .from(q('.aig__pourquoi > *'), { y: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, 1.1)
      .from(q('.aig__pied'), { autoAlpha: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 1.3);
  }, { scope: racine });

  return (
    <Page className="aig">
      <section className="aig__in container" ref={racine} aria-labelledby="aig-q">
        <h1 className="aig__q" id="aig-q">Où en est votre entreprise&nbsp;?</h1>
        <p className="aig__sous">Une même méthode, trois moments. Choisissez le vôtre&nbsp;: on ne vous parle que de ce qui vous concerne.</p>

        <div className="aig__choix-cadre">
          {/* Le fil qui relie les trois marques : le même réseau, qui grandit. */}
          <span className="aig__fil" aria-hidden="true" />
          <ul className="aig__choix">
            {ESPACES.map((e) => (
              <li key={e.id}><Carte e={e} /></li>
            ))}
          </ul>
        </div>

        <div className="aig__pourquoi">
          <p className="aig__pourquoi-amorce">Une seule façon de travailler, trois façons d’en parler.</p>
          <p className="aig__pourquoi-detail">
            On fait toujours la même chose&nbsp;: on va voir sur le terrain, on vous aide à décider, et on construit la suite.
            Mais on ne parle pas de la même façon à quelqu’un qui se lance et au dirigeant d’une entreprise de quatre-vingts personnes.
            Chaque marque ne vous montre que ce qui vous concerne.
          </p>
        </div>

        <p className="aig__pied">
          Reskope, c’est Thomy et Florian, à Valenciennes et à Lille.{' '}
          <Link to="/qui-on-est" className="lien-souligne">Qui on est</Link>
          {' · '}
          <Link to="/contact" className="lien-souligne">Nous écrire</Link>
        </p>
      </section>
    </Page>
  );
}
