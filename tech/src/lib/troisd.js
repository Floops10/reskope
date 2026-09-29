import * as THREE from 'three';
import { palette3d } from './palette3d';

/* ════════════════════════════════════════════════════════════
   LE VOLUME — les couleurs de la charte, cuites dans la géométrie.

   Les trois teintes de la marque (les indigos de Reskope, les ambres de
   Create, les verts de Define, les bleus d'Elevate) ne sont pas un
   éclairage, ce sont les couleurs des trois faces, comme sur les planches
   imprimées. En les cuisant dans les sommets,
   un bloc ne demande plus qu'une seule matière — donc un seul appel de
   dessin au lieu de six. C'est ce qui permet d'animer quarante blocs sans
   que la scène traîne.
   ════════════════════════════════════════════════════════════ */

/* Les faces viennent de la palette de la marque (voir palette3d.js). */
export function cubeColore(teinte = 'plein', pal = palette3d()) {
  const g = new THREE.BoxGeometry(1, 1, 1);
  const [haut, cote, ombre] = pal[teinte] || pal.plein;
  const c = [cote, ombre, haut, ombre, cote, ombre].map((h) => new THREE.Color(h));
  const col = new Float32Array(g.attributes.position.count * 3);
  for (let face = 0; face < 6; face++) {
    for (let k = 0; k < 4; k++) {
      const i = face * 4 + k;
      col[i * 3] = c[face].r; col[i * 3 + 1] = c[face].g; col[i * 3 + 2] = c[face].b;
    }
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

/* Un nombre stable tiré d'un entier : deux blocs voisins n'arrivent jamais
   du même endroit, mais ils en arrivent toujours du même à chaque lecture. */
export function graine(i, sel = 1) {
  const v = Math.sin(i * 127.1 + sel * 311.7) * 43758.5453;
  return v - Math.floor(v);
}

export const doux = (t) => (t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2);
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
