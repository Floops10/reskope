import { useMarque } from './useMarque';

/* ════════════════════════════════════════════════════════════
   LES COULEURS DU VOLUME, MARQUE PAR MARQUE.

   Les scènes 3D ne lisent pas le CSS : leurs couleurs sont cuites dans la
   géométrie (voir troisd.js). Chaque marque a donc ici ses trois faces
   (le dessus éclairé, le côté, l'ombre), comme sur les planches imprimées,
   et les couleurs de ses arêtes, de ses lignes et de son papier.

   Reskope   les trois indigos de la charte
   Create    trois ambres, du soleil au cuivre
   Define    trois verts, de la menthe au sapin
   Elevate   trois bleus, du ciel à la nuit
   ════════════════════════════════════════════════════════════ */

export const PALETTES_3D = {
  reskope: {
    plein: ['#5B4BE6', '#1C0CB3', '#130982'],
    neuf: ['#A79CF7', '#6B5BEA', '#4B3CC9'],
    socle: ['#2A1E7A', '#190C5C', '#120741'],
    arete: { plein: '#130982', neuf: '#3A2BAE', socle: '#0D0535', creux: '#1C0CB3' },
    action: '#1C0CB3',
    vif: '#5B4BE6',
    clair: '#A79CF7',
    fond: '#F0EEE8',
    encre: '#0E0B1F',
    froid: '#3B3763',
  },
  create: {
    plein: ['#F2A93B', '#C9731A', '#9C4F06'],
    neuf: ['#F9D08C', '#F0AE55', '#D98C2B'],
    socle: ['#7A3D03', '#5C2D02', '#3F1F01'],
    arete: { plein: '#7A3D03', neuf: '#B8660F', socle: '#2E1600', creux: '#9C4F06' },
    action: '#9C4F06',
    vif: '#F2A93B',
    clair: '#F9D08C',
    fond: '#F6EEE2',
    encre: '#1A1208',
    froid: '#4A3B2A',
  },
  define: {
    plein: ['#2FAE8E', '#0B6B52', '#07513E'],
    neuf: ['#93DDC8', '#52C3A6', '#23997A'],
    socle: ['#07513E', '#053D2F', '#032A20'],
    arete: { plein: '#07513E', neuf: '#138A6A', socle: '#021E17', creux: '#0B6B52' },
    action: '#0B6B52',
    vif: '#2FAE8E',
    clair: '#93DDC8',
    fond: '#EDF4F0',
    encre: '#0B1814',
    froid: '#2F4A41',
  },
  elevate: {
    plein: ['#3B9DE8', '#0B3D91', '#072A66'],
    neuf: ['#9FCDF4', '#5DAEEC', '#2F7FD1'],
    socle: ['#072A66', '#051F4C', '#031533'],
    arete: { plein: '#072A66', neuf: '#1F63B8', socle: '#020E26', creux: '#0B3D91' },
    action: '#0B3D91',
    vif: '#3B9DE8',
    clair: '#9FCDF4',
    fond: '#EDF1F7',
    encre: '#0A1024',
    froid: '#2E3D5C',
  },
};

/** La palette 3D de la marque de la page, au moment de l'appel. */
export function palette3d(marque = document.documentElement.dataset.marque) {
  return PALETTES_3D[marque] || PALETTES_3D.reskope;
}

/** La même, suivie : la scène se recolore si la marque change. */
export function usePalette3d() {
  return PALETTES_3D[useMarque()] || PALETTES_3D.reskope;
}
