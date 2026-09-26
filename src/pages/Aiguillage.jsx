import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import ReseauTaille from '../components/ReseauTaille';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { ESPACES, adresseEspace } from '../data/espaces';

/* ════════════════════════════════════════════════════════════
   L'AIGUILLAGE — une question, trois réponses, et rien d'autre.

   L'ancienne entrée posait la question TPE ou PME après un écran de texte.
   Ici, la question est la première chose qu'on lit, et elle est concrète :
   où en est votre entreprise ? En projet, de 1 à 10 personnes, de 10 à 250.
   Chacune mène à un espace qui ne parle que de ce qui la concerne.

   Pas de barrière pour autant : un lien profond, un favori ou un moteur
   mènent directement aux pages, sans passer par ici, et le sélecteur de
   l'en-tête permet de changer d'espace à tout moment.
   ════════════════════════════════════════════════════════════ */

function Choix({ e }) {
  const contenu = (
    <>
      <span className="aig__reseau"><ReseauTaille n={e.noeuds} /></span>
      <span className="aig__taille">{e.id === 'creation' ? 'En projet' : e.taille}</span>
      <span className="aig__qui">{e.id === 'creation' ? 'Je crée ou je reprends une entreprise' : `Une ${e.court}`}</span>
      <span className="aig__dit">{e.dit}</span>
      <span className="aig__fleche" aria-hidden="true">→</span>
    </>
  );
  const classe = `aig__carte aig--${e.accent}`;
  /* L'espace « en projet » est dans cette application ; les espaces TPE et
     PME sont servis à part, on y va par un vrai chargement de page. */
  return e.id === 'creation'
    ? <Link to="/creation" className={classe} data-cursor-label="Entrer">{contenu}</Link>
    : <a href={adresseEspace(e.id)} className={classe} data-cursor-label="Entrer">{contenu}</a>;
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
      .from(q('.rt__n'), {
        scale: 0, transformOrigin: 'center center', duration: 0.5, ease: 'back.out(2.2)',
        stagger: { each: 0.012, from: 'start' },
      }, 0.7)
      .from(q('.rt__l'), { autoAlpha: 0, duration: 0.6, ease: 'power2.out', stagger: 0.01 }, 0.9)
      .from(q('.aig__pied'), { autoAlpha: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 1.2);
  }, { scope: racine });

  return (
    <Page className="aig">
      <section className="aig__in container" ref={racine} aria-labelledby="aig-q">
        <h1 className="aig__q" id="aig-q">Où en est votre entreprise&nbsp;?</h1>
        <p className="aig__sous">Choisissez : on vous parle de ce qui vous concerne, et seulement de ça.</p>

        <ul className="aig__choix">
          {ESPACES.map((e) => (
            <li key={e.id}><Choix e={e} /></li>
          ))}
        </ul>

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
