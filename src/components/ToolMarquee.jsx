import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';

const ROW1 = ['Notion', 'Airtable', 'Make', 'n8n', 'Webflow', 'Supabase', 'Zapier', 'HubSpot'];
const ROW2 = ['Bubble', 'Slack', 'Pipedrive', 'Monday', 'Figma', 'Intercom', 'Brevo', 'Stripe'];

function MarqueeRow({ tools, speed = 36, reverse = false }) {
  const trackRef = useRef(null);
  const rowRef   = useRef(null);
  const doubled  = [...tools, ...tools];

  useGSAP(() => {
    if (instant()) return;
    const tr = trackRef.current;
    if (!tr) return;

    if (reverse) gsap.set(tr, { xPercent: -50 });

    const tween = gsap.to(tr, {
      xPercent: reverse ? 0 : -50,
      ease: 'none',
      duration: speed,
      repeat: -1,
    });

    const row = rowRef.current;
    const pause  = () => tween.pause();
    const resume = () => tween.resume();
    row?.addEventListener('mouseenter', pause);
    row?.addEventListener('mouseleave', resume);

    return () => {
      row?.removeEventListener('mouseenter', pause);
      row?.removeEventListener('mouseleave', resume);
    };
  }, { scope: rowRef });

  return (
    <div className="tool-marquee__row" ref={rowRef} aria-hidden="true">
      <div className="tool-marquee__track" ref={trackRef}>
        {doubled.map((t, i) => (
          <span key={i} className="tool-marquee__item">{t}</span>
        ))}
      </div>
    </div>
  );
}

export default function ToolMarquee({ eyebrow }) {
  return (
    <section className="tool-marquee-section">
      {eyebrow && (
        <p className="container tool-marquee__eyebrow eyebrow eyebrow--index">
          {eyebrow}
        </p>
      )}
      <MarqueeRow tools={ROW1} speed={38} reverse={false} />
      <MarqueeRow tools={ROW2} speed={34} reverse={true} />
    </section>
  );
}
