import { Link } from 'react-router-dom';
import { Reveal, RevealItem } from './Reveal';
import { useT } from '../i18n';
import { CONTACT } from '../data/site';

export default function CTASection({ title, text }) {
  const t = useT();
  const c = t.cta;
  return (
    <section className="section contact" aria-label={c.aria}>
      <div className="container contact__inner">
        <Reveal className="contact__text">
          <RevealItem as="p" className="eyebrow eyebrow--index">
            {c.eyebrow}
          </RevealItem>
          <RevealItem as="h2" className="contact__title">
            {title || c.title}
          </RevealItem>
          <RevealItem as="p" className="contact__lead">
            {text || c.text}
          </RevealItem>
        </Reveal>
        <Reveal className="contact__actions">
          <RevealItem as="div" className="contact__actions-row">
            <Link className="btn btn--primary" to="/contact">
              {c.primary}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            {CONTACT.ouverte && (
              <a className="btn btn--ghost" href={`mailto:${CONTACT.email}`}>
                {c.secondary}
              </a>
            )}
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}
