/* LE PETIT PAVÉ — le signe qui dit « volume ».

   La même géométrie axonométrique que les planches et les livrets, réduite
   à un seul bloc : trois faces, trois valeurs. Il sert de repère partout où
   il faut annoncer qu'un objet se déplie en volume, ou marquer un rang sans
   écrire un numéro. Les couleurs viennent de la feuille de style, pas d'ici :
   posé sur la nuit il prend les indigos, sur le vert il prend les verts. */
export default function CubeGlyph({ className = '' }) {
  return (
    <svg className={`cubg ${className}`.trim()} viewBox="-10 -11 20 22" aria-hidden="true">
      <polygon className="cubg__h" points="0,-9 8.66,-4 0,1 -8.66,-4" />
      <polygon className="cubg__d" points="8.66,-4 8.66,5 0,10 0,1" />
      <polygon className="cubg__g" points="-8.66,-4 0,1 0,10 -8.66,5" />
    </svg>
  );
}
