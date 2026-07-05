import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { instant } from '../lib/scrub';
import { Reveal, RevealItem } from './Reveal';

export default function ChatMockup({ c }) {
  const sectionRef  = useRef(null);
  const clientRef   = useRef(null);
  const typingRef   = useRef(null);
  const responseRef = useRef(null);

  useGSAP(() => {
    if (instant()) return;

    gsap.set([clientRef.current, typingRef.current, responseRef.current], {
      autoAlpha: 0, y: 14,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 64%',
        once: true,
      },
    });

    tl.to(clientRef.current,   { autoAlpha: 1, y: 0, duration: 0.48, ease: 'power3.out' })
      .to(typingRef.current,   { autoAlpha: 1, y: 0, duration: 0.38, ease: 'power3.out' }, '+=0.7')
      .to(typingRef.current,   { autoAlpha: 0, y: -6, duration: 0.28, ease: 'power2.in' }, '+=1.4')
      .to(responseRef.current, { autoAlpha: 1, y: 0, duration: 0.48, ease: 'power3.out' }, '<+=0.05');
  }, { scope: sectionRef });

  return (
    <section className="chat-section section" ref={sectionRef}>
      <div className="container">
        <Reveal className="section__head section__head--center">
          <RevealItem as="p" className="eyebrow eyebrow--index">{c.chatEyebrow}</RevealItem>
          <RevealItem as="h2" className="h2">{c.chatTitle}</RevealItem>
        </Reveal>

        <div className="chat-mockup" aria-label={c.chatAriaLabel} role="region">
          {/* Message client */}
          <div className="chat-bubble chat-bubble--client" ref={clientRef}>
            <span className="chat-bubble__sender">{c.chatClient}</span>
            <p>{c.chatMsg1}</p>
          </div>

          {/* Indicateur de frappe */}
          <div className="chat-bubble chat-bubble--reskope chat-typing" ref={typingRef} aria-hidden="true">
            <span className="chat-bubble__sender">Reskope</span>
            <span className="typing-dots">
              <span /><span /><span />
            </span>
          </div>

          {/* Réponse Reskope */}
          <div className="chat-bubble chat-bubble--reskope" ref={responseRef}>
            <span className="chat-bubble__sender">Reskope</span>
            <p>{c.chatMsg2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
