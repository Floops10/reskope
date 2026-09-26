import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { Observer } from 'gsap/Observer';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, Observer, useGSAP);

/* iOS : la barre d'URL qui se rétracte redimensionne le viewport et faisait
   « sauter » ScrollTrigger. On ignore ces resizes mobiles. */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, SplitText, Flip, Observer, useGSAP };
