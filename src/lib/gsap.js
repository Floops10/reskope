import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* iOS : la barre d'URL qui se rétracte redimensionne le viewport et faisait
   « sauter » ScrollTrigger. On ignore ces resizes mobiles (c'est ce qui avait
   fait fuir ScrollTrigger auparavant). */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
