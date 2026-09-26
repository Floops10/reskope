/* Label à permutation verticale au survol du bouton parent (.btn) :
   le texte glisse vers le haut, une copie identique le remplace par le bas.
   Alternative « stylée » au magnétisme. La copie est portée par ::after
   (attr data-text) côté CSS. */
export default function SwapLabel({ children }) {
  return (
    <span className="btn__swap" data-text={children}>
      <span>{children}</span>
    </span>
  );
}
