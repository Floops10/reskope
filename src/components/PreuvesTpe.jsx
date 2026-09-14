import { Reveal, RevealItem } from './Reveal';
import { useLang } from '../i18n';
import { PREUVES_TPE } from '../data/profils';

/* ============================================================
   Les deux chiffres qui posent le sujet, version TPE.

   La version PME a une page entière pour ça, « Le constat » : elle
   démontre le coût du désordre numérique. Ce raisonnement ne tient pas
   chez quelqu'un qui n'a pas encore de site — il n'y a pas de désordre,
   il y a une absence. On pose donc le sujet autrement, et en deux
   chiffres : presque tout le monde sait que c'est indispensable, et un
   sur trois ne l'a toujours pas fait.

   Les deux viennent de l'Afnic, avec le lien. Un chiffre sans source ne
   vaut rien, et celui-là sert à convaincre quelqu'un de dépenser.
   ============================================================ */
export default function PreuvesTpe() {
  const { lang } = useLang();
  const c = PREUVES_TPE[lang] || PREUVES_TPE.fr;

  return (
    <section className="prv" aria-labelledby="prv-t">
      <div className="container">
        <Reveal className="prv__head">
          <RevealItem as="p" className="eyebrow eyebrow--index">{c.eyebrow}</RevealItem>
          <RevealItem as="h2" className="h2" id="prv-t">{c.titre}</RevealItem>
          <RevealItem as="p" className="lead prv__lead">{c.lead}</RevealItem>
        </Reveal>

        <Reveal className="prv__grid">
          {c.items.map((it) => (
            <RevealItem key={it.v} className="prv__item">
              <span className="prv__v">{it.v}</span>
              <span className="prv__t">{it.t}</span>
              <a className="prv__src" href={it.url} target="_blank" rel="noopener noreferrer">
                {it.src}
              </a>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
