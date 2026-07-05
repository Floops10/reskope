import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import FloatingNet3D from './FloatingNet3D';

/* Outils maîtrisés — équivalent « Clients » de Noomo : deux colonnes de noms
   qui se révèlent en cascade au scroll (GSAP ScrollTrigger), un accent réseau
   3D qui flotte, et une ligne d'accroche. DA réseau. */
const TOOLS = [
  'Notion', 'Airtable', 'Make', 'n8n', 'Webflow', 'Supabase', 'Slack',
  'HubSpot', 'Figma', 'Pipedrive', 'Bubble', 'Monday', 'Zapier', 'Google Workspace',
  'Stripe', 'Retool', 'Metabase', 'Brevo', 'Pennylane', 'Intercom',
];

export default function ToolsColumns({ eyebrow, title, lead }) {
  const rootRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;
    const items = rootRef.current.querySelectorAll('.toolcol__item');
    gsap.from(items, {
      yPercent: 100,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.03,
      scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
    });
    const head = rootRef.current.querySelectorAll('.toolcol__head > *');
    gsap.from(head, {
      yPercent: 60, autoAlpha: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
    });
  }, { scope: rootRef });

  const half = Math.ceil(TOOLS.length / 2);
  const columns = [TOOLS.slice(0, half), TOOLS.slice(half)];

  return (
    <section className="section toolcol" ref={rootRef}>
      <FloatingNet3D className="toolcol__net" points={16} size={220} speed={0.7} tiltX={0.3} />
      <div className="container toolcol__grid">
        <div className="toolcol__head">
          <p className="eyebrow eyebrow--index">{eyebrow}</p>
          <h2 className="toolcol__title">{title}</h2>
          {lead && <p className="lead toolcol__lead">{lead}</p>}
        </div>

        <div className="toolcol__cols">
          {columns.map((col, ci) => (
            <ul className="toolcol__list" key={ci}>
              {col.map((t) => (
                <li className="toolcol__row" key={t}>
                  <span className="toolcol__item">
                    <span className="toolcol__dot" aria-hidden="true" />
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
