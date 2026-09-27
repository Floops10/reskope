/* Three.js et ses modules, rassemblés en un seul script classique pour que
   chaque film tienne dans un fichier, sans réseau (construire.py le passe
   dans rolldown). */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

window.THREE = THREE;
window.TROIS = { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass, LineSegments2, LineSegmentsGeometry, LineMaterial };
