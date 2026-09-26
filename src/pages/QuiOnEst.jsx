import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import MorphTitle from '../components/MorphTitle';
import Net3D from '../components/Net3D';
import Amorce from '../components/Amorce';
import Noeuds from '../components/Noeuds';
import ZoneMap from '../components/ZoneMap';
import SwapLabel from '../components/SwapLabel';
import { GLYPH_SHAPES } from '../lib/net3d';
import { gsap, SplitText, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { DUO } from '../data/duo';
import { POLES } from '../data/offres';

/* ════════════════════════════════════════════════════════════
   QUI ON EST — les deux personnes qui feront le travail.

   Le dirigeant veut savoir à qui il confie ses clients et son dossier. On
   lui montre deux visages, ce que chacun mène, comment on travaille, et on
   lui dit franchement ce qu'on n'a pas encore : des clients à citer, et un
   diplôme de graphiste.
   ════════════════════════════════════════════════════════════ */

const PHOTOS = {
  thomy: `${import.meta.env.BASE_URL}thomy.jpg`,
  florian: `${import.meta.env.BASE_URL}florian.jpg`,
};

const BIO = [
  'On ne fait pas du conseil à la chaîne. Sur chaque dossier, on s’investit comme s’il s’agissait de notre propre entreprise.',
  'Thomy mène le business plan, la stratégie et le passage devant les financeurs. Elle a accompagné pendant deux ans des créateurs d’entreprise jusqu’à ce rendez-vous, et elle sait ce qu’un financeur lit en premier.',
  'Florian mène les entretiens avec vos clients, de la première question à la synthèse, puis la partie technique quand la suite en demande : les sites, les outils, et ce qu’on relie entre eux.',
  'Aucun des deux ne reste dans son couloir : Florian a lui aussi accompagné des créations d’entreprise et relit les chiffres des dossiers, et Thomy est en appui sur chaque discovery. C’est ce qui fait qu’un dossier avance d’un seul tenant, de la preuve à la décision.',
];

const SERMENTS = [
  { title: 'On vous dit quand on ne peut pas vous aider', text: 'Dès le premier échange, et gratuitement. On préfère perdre une mission que vous en vendre une qui ne servirait pas votre décision.' },
  { title: 'Le prix est écrit avant de commencer', text: 'Une proposition écrite, un prix fixe, et plus rien ne bouge ensuite. Vous savez ce que vous payez avant de dire oui.' },
  { title: 'Vos clients restent les vôtres', text: 'Ils savent pourquoi on les appelle, ils peuvent refuser, et on ne garde pas leurs coordonnées après la mission.' },
  { title: 'Votre autonomie, pas votre dépendance', text: 'À la fin, vous savez refaire ce qu’on a fait. Le but n’est pas de vous lier à nous, c’est que vous décidiez mieux sans nous.' },
];

const FRANCHISE = [
  { texte: 'Reskope démarre', suite: 'On n’a pas encore de clients à vous citer. On vous montre donc la méthode en entier, et un exemple complet, en disant qu’il est inventé.' },
  { texte: 'On n’est pas graphistes diplômés', suite: 'On pose le cadre d’une marque, ses règles et ce qu’il faut produire. Quand une identité demande un spécialiste, on le dit, et on lui transmet le cadre.' },
  { texte: 'On travaille avec les TPE et les PME', suite: 'Pas avec les grands groupes : à deux, on ne sait pas les servir correctement, et on préfère le dire.' },
];

export default function QuiOnEst() {
  const racine = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const root = racine.current;
    gsap.from(root.querySelectorAll('.ahero__reveal'), {
      z: -520, y: 40, rotateX: -22, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.09, delay: 0.15,
    });
    const masks = root.querySelectorAll('.ahero__photo-mask');
    if (masks.length) {
      gsap.fromTo(masks,
        { clipPath: 'inset(100% 0% 0% 0% round 18px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.3, ease: 'power4.inOut', delay: 0.35, stagger: 0.14 });
      gsap.from(root.querySelectorAll('.ahero__pf-filet'), { scaleX: 0, duration: 0.8, ease: 'power3.inOut', delay: 0.95, stagger: 0.14 });
      gsap.from(root.querySelectorAll('.ahero__pf-nom'), { yPercent: 110, duration: 0.7, ease: 'power4.out', delay: 1.05, stagger: 0.14 });
      gsap.from(root.querySelectorAll('.ahero__pf-role, .ahero__pf-dit'), {
        z: -200, y: 12, autoAlpha: 0, duration: 0.6, ease: 'power3.out', delay: 1.2, stagger: 0.07,
      });
    }

    /* Le récit : la phrase d'entrée arrive de la profondeur, puis le reste
       se révèle ligne à ligne. */
    const splits = [];
    const lead = root.querySelector('.astory__lead');
    if (lead) {
      gsap.from(lead, {
        z: -700, y: 48, rotateX: -30, autoAlpha: 0, duration: 1.05, ease: 'power3.out',
        scrollTrigger: { trigger: lead, start: 'top 86%' },
      });
    }
    root.querySelectorAll('.astory__p').forEach((p) => {
      try {
        const sp = new SplitText(p, { type: 'lines', mask: 'lines' });
        splits.push(sp);
        gsap.from(sp.lines, {
          yPercent: 110, duration: 0.85, ease: 'power4.out', stagger: 0.07,
          scrollTrigger: { trigger: p, start: 'top 84%' },
        });
      } catch { /* le texte reste lisible tel quel */ }
    });

    /* Les engagements : l'engagement monte derrière son masque, et la
       justification s'éclaire mot à mot pendant qu'on descend. */
    root.querySelectorAll('.serment').forEach((el) => {
      const dit = el.querySelector('.serment__dit');
      const suite = el.querySelector('.serment__suite');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none reverse' },
      });
      tl.fromTo(dit, { yPercent: 118 }, { yPercent: 0, duration: 0.8, ease: 'power4.out' }, 0);
      try {
        const sp = new SplitText(suite, { type: 'words' });
        splits.push(sp);
        gsap.set(sp.words, { opacity: 0.16 });
        gsap.to(sp.words, {
          opacity: 1, ease: 'none', stagger: 0.28, duration: 0.3,
          scrollTrigger: { trigger: el, start: 'top 76%', end: 'bottom 62%', scrub: 0.7 },
        });
      } catch {
        tl.fromTo(suite, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.3);
      }
    });

    return () => splits.forEach((s) => s.revert());
  }, { scope: racine });

  return (
    <Page>
      <div ref={racine}>
        <header className="ahero">
          <div className="ahero__bg" aria-hidden="true">
            <div className="hero2__grain" />
          </div>
          <div className="container ahero__grid">
            <div className="ahero__copy">
              <div className="ahero__reveal">
                <MorphTitle as="h1" text="Bonjour, nous c’est Thomy et Florian." textClass="ahero__title" intro />
              </div>
              <p className="lead ahero__lead ahero__reveal">
                Deux personnes, à Valenciennes et à Lille, et les mêmes sur votre dossier du premier échange à la
                fin. On vous aide à décider, et on construit la suite.
              </p>
            </div>
            <div className="ahero__viz ahero__reveal">
              <span className="ahero__glyph" aria-hidden="true">
                <Net3D shape={GLYPH_SHAPES[1]} size={120} speed={0.6} tiltX={0.45} nodeR={2.8} />
              </span>
              <div className="ahero__duo">
                {DUO.map((p) => (
                  <figure className="ahero__pf" key={p.id}>
                    <div className="ahero__photo-mask">
                      <img className="ahero__img" src={PHOTOS[p.id]} alt={p.alt} loading="eager" width="1200" height="1440" />
                    </div>
                    <figcaption className="ahero__pf-cap">
                      <span className="ahero__pf-filet" aria-hidden="true" />
                      <span className="ahero__pf-nom">{p.nom}</span>
                      <span className="ahero__pf-role">{p.mene}</span>
                      <span className="ahero__pf-dit">{p.dit}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="astory" aria-label="Notre histoire">
          <div className="container astory__inner">
            <div className="astory__ask">
              <p className="astory__lead">
                <span className="astory__mark" aria-hidden="true">«&#8239;</span>
                {BIO[0]}
              </p>
            </div>
            <div className="astory__body">
              {BIO.slice(1).map((p, i, arr) => (
                <p key={p} className="astory__p">
                  {p}
                  {i === arr.length - 1 && <span className="astory__mark astory__mark--fin" aria-hidden="true">&#8239;»</span>}
                </p>
              ))}
            </div>
          </div>
        </section>

        <Amorce id="qui-mene" lead="Qui mène quoi, sur votre dossier.">
          <dl className="lex">
            {Object.values(POLES).map((p) => (
              <div className="lex__ligne" key={p.nom}>
                <dt className="lex__terme">{p.nom}</dt>
                <dd className="lex__dit">{p.ligne} {p.mene}</dd>
              </div>
            ))}
          </dl>
        </Amorce>

        <section className="section section--tint" aria-labelledby="serments-t">
          <div className="container">
            <h2 className="serments__titre" id="serments-t">Ce sur quoi on ne transige pas.</h2>
            <div className="serments">
              {SERMENTS.map((m) => (
                <p className="serment" key={m.title}>
                  <span className="serment__mask">
                    <span className="serment__dit">{m.title}.</span>
                  </span>
                  <span className="serment__suite">{m.text}</span>
                </p>
              ))}
            </div>
          </div>
        </section>

        <Amorce id="franchise" lead="Ce qu’on préfère vous dire tout de suite.">
          <Noeuds items={FRANCHISE} etat="creux" />
        </Amorce>

        <ZoneMap />

        <section className="ex-fin" aria-labelledby="qo-fin-t">
          <div className="container ex-fin__in">
            <h2 className="ex-fin__titre" id="qo-fin-t">On se parle ?</h2>
            <p className="ex-fin__p">
              Trente minutes, gratuites. Au minimum, vous repartez avec un regard extérieur honnête sur votre
              projet.
            </p>
            <div className="ex-fin__actions">
              <Link to="/contact" className="btn btn--primary">
                <SwapLabel>Parlons de votre situation</SwapLabel>
                <span className="btn__arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
