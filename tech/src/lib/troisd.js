import * as THREE from 'three';

/* ════════════════════════════════════════════════════════════
   LE VOLUME — les couleurs de la charte, cuites dans la géométrie.

   Les trois indigos ne sont pas un éclairage, ce sont les couleurs des trois
   faces, comme sur les planches imprimées. En les cuisant dans les sommets,
   un bloc ne demande plus qu'une seule matière — donc un seul appel de
   dessin au lieu de six. C'est ce qui permet d'animer quarante blocs sans
   que la scène traîne.
   ════════════════════════════════════════════════════════════ */

export const TEINTES = {
  plein: ['#5B4BE6', '#1C0CB3', '#130982'],
  neuf: ['#A79CF7', '#6B5BEA', '#4B3CC9'],
  socle: ['#2A1E7A', '#190C5C', '#120741'],
};

export const ARETE = { plein: '#130982', neuf: '#3A2BAE', socle: '#0D0535', creux: '#1C0CB3' };

export function cubeColore(teinte = 'plein') {
  const g = new THREE.BoxGeometry(1, 1, 1);
  const [haut, cote, ombre] = TEINTES[teinte] || TEINTES.plein;
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
