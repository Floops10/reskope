/* ════════════════════════════════════════════════════════════
   RESKOPE · MOTION v2 : le monde 3D de la marque (Three.js).

   Un espace sombre et profond où la marque vit en réseau : des nœuds
   lumineux, des liens de lumière, de la poussière, des traînées de vitesse.
   Comme une vraie caméra : profondeur de champ (les points hors du plan de
   netteté deviennent des disques de bokeh), halo sur ce qui brille, flou de
   mouvement quand ça va vite, aberration sur la vitesse, grain.

   Les couleurs de la charte restent exactes : pas de courbe « film » sur
   tout l'écran, seules les hautes lumières sont comprimées (un genou doux),
   si bien que l'indigo et le fond sortent tels quels.

   Règle d'or : tout l'état se calcule à partir du temps t. HyperFrames peut
   demander n'importe quelle image dans n'importe quel ordre, et le flou de
   mouvement rééchantillonne entre deux images en rappelant simplement
   poser(t) à des instants intermédiaires.
   ════════════════════════════════════════════════════════════ */
const W = 1080, H = 1920, FPS = 30;
const { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass, LineSegments2, LineSegmentsGeometry, LineMaterial } = window.TROIS;

/* ── Outils ─────────────────────────────────────────────────── */
function prng(graine) {
  let a = graine >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a, b, p) => a + (b - a) * p;
const mix3 = (a, b, p) => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul3 = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const len3 = (a) => Math.hypot(a[0], a[1], a[2]);
const EASES = {};
function ease(nom) { return nom ? (EASES[nom] || (EASES[nom] = gsap.parseEase(nom))) : (x) => x; }
/* Progression 0 → 1 dans la fenêtre [t0, t1], avec une courbe. */
function fen(t, t0, t1, nom) { return ease(nom)(clamp01((t - t0) / (t1 - t0))); }
/* Une bosse : 0 → 1 → 0 entre t0 et t1, sommet au milieu. */
function bosse(t, t0, t1) { const p = clamp01((t - t0) / (t1 - t0)); return Math.sin(p * Math.PI); }
/* Une piste de clés : [[t, valeur, courbe vers cette clé], ...] → f(t). */
function piste(cles) {
  const e = cles.map((k) => ease(k[2]));
  return function (t) {
    if (t <= cles[0][0]) return cles[0][1];
    for (let i = 1; i < cles.length; i++) {
      if (t <= cles[i][0]) {
        const t0 = cles[i - 1][0], v0 = cles[i - 1][1], t1 = cles[i][0], v1 = cles[i][1];
        const p = e[i](clamp01((t - t0) / (t1 - t0)));
        return Array.isArray(v0) ? v0.map((a, j) => a + (v1[j] - a) * p) : v0 + (v1 - v0) * p;
      }
    }
    return cles[cles.length - 1][1];
  };
}
/* Un bruit doux et déterministe (somme de sinus), pour la caméra portée. */
function houle(t, graine, f = 1) {
  const g = graine * 12.9898;
  return (Math.sin(t * 1.13 * f + g) * 0.5 + Math.sin(t * 2.31 * f + g * 1.7) * 0.3 + Math.sin(t * 4.07 * f + g * 2.3) * 0.2);
}
/* Couleurs de la charte, en linéaire, à multiplier par une intensité (HDR). */
function coul(hex, k = 1) {
  const c = new THREE.Color(hex);
  return [c.r * k, c.g * k, c.b * k];
}
const C = {
  creme: '#F0EEE8', indigo: '#1C0CB3', dessus: '#5B4BE6', encre: '#0E0B1F', fond: '#06041A',
  soleil: '#F2A93B', menthe: '#2FAE8E', ciel: '#3B9DE8', corail: '#EF6F5E', lilas: '#8B7FF0',
};
/* Des points répartis sur une sphère (spirale de Fibonacci), sans hasard. */
function fibonacci(n, rayon) {
  const pts = [], or = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), a = or * i;
    pts.push([Math.cos(a) * r * rayon, y * rayon, Math.sin(a) * r * rayon]);
  }
  return pts;
}

/* ── La nuée : des points lumineux (nœuds, poussière, places vides) ──
   forme 0 : une lueur (poussière, étoile) ; 1 : un anneau (une place vide) ;
   2 : un disque plein, net (un nœud du réseau). Hors du plan de netteté,
   chaque point devient un disque de bokeh qui garde son énergie. */
class Nuee {
  constructor(monde, n, { additif = true } = {}) {
    this.n = n;
    this.pos = new Float32Array(n * 3);
    this.col = new Float32Array(n * 3);
    this.tai = new Float32Array(n);
    this.alp = new Float32Array(n);
    this.forme = new Float32Array(n);
    const g = new THREE.BufferGeometry();
    this.attrs = {
      position: new THREE.BufferAttribute(this.pos, 3),
      aCol: new THREE.BufferAttribute(this.col, 3),
      aTai: new THREE.BufferAttribute(this.tai, 1),
      aAlp: new THREE.BufferAttribute(this.alp, 1),
      aForme: new THREE.BufferAttribute(this.forme, 1),
    };
    for (const k in this.attrs) g.setAttribute(k, this.attrs[k]);
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uEchelle: { value: 1 }, uFoyer: { value: 10 }, uOuverture: { value: 0 },
        uBrume: { value: 0.012 }, uConserve: { value: 0.55 }, uMaxPx: { value: 460 },
      },
      vertexShader: `
        attribute vec3 aCol; attribute float aTai; attribute float aAlp; attribute float aForme;
        uniform float uEchelle; uniform float uFoyer; uniform float uOuverture; uniform float uBrume; uniform float uConserve; uniform float uMaxPx;
        varying vec3 vCol; varying float vAlp; varying float vForme; varying float vFlou;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float z = max(0.05, -mv.z);
          float base = aTai * uEchelle / z;
          float coc = uOuverture * uEchelle * abs(1.0 / uFoyer - 1.0 / z);
          float taille = min(sqrt(base * base + coc * coc) + 1.2, uMaxPx);
          float energie = pow(clamp((base * base + 1.4) / (taille * taille), 0.0, 1.0), uConserve);
          gl_PointSize = taille;
          vCol = aCol; vForme = aForme;
          vFlou = clamp(coc / taille, 0.0, 1.0);
          vAlp = aAlp * energie * exp(-uBrume * uBrume * z * z);
          if (-mv.z < 0.05 || aTai <= 0.0) vAlp = 0.0;
        }`,
      fragmentShader: `
        varying vec3 vCol; varying float vAlp; varying float vForme; varying float vFlou;
        void main(){
          vec2 d = gl_PointCoord - 0.5; float r = length(d) * 2.0;
          if (r > 1.0 || vAlp < 0.001) discard;
          float aa = max(fwidth(r) * 1.5, 0.002);
          float lueur = pow(1.0 - r, 2.4) + 0.3 * (1.0 - smoothstep(0.0, 0.3, r));
          float disque = 1.0 - smoothstep(1.0 - aa, 1.0, r);
          float bokeh = (1.0 - smoothstep(1.0 - max(aa, 0.08), 1.0, r)) * (0.72 + 0.28 * smoothstep(0.45, 0.95, r));
          float anneau = (1.0 - smoothstep(0.0, max(aa, 0.06), abs(r - 0.82) - 0.06)) * (1.0 - vFlou) + bokeh * vFlou * 0.5;
          float a;
          if (vForme < 0.5) a = mix(lueur, bokeh, vFlou);
          else if (vForme < 1.5) a = anneau;
          else a = mix(disque, bokeh, vFlou);
          a *= vAlp;
          if (a < 0.0015) discard;
          gl_FragColor = vec4(vCol * a, a);
        }`,
      transparent: true, depthWrite: false, depthTest: true,
      blending: additif ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.obj = new THREE.Points(g, this.mat);
    this.obj.frustumCulled = false;
    monde.scene.add(this.obj);
    monde.nuees.push(this);
  }
  poser(i, p, c, taille, alpha = 1, forme = 0) {
    this.pos[i * 3] = p[0]; this.pos[i * 3 + 1] = p[1]; this.pos[i * 3 + 2] = p[2];
    this.col[i * 3] = c[0]; this.col[i * 3 + 1] = c[1]; this.col[i * 3 + 2] = c[2];
    this.tai[i] = taille; this.alp[i] = alpha; this.forme[i] = forme;
  }
  cacher(i) { this.alp[i] = 0; this.tai[i] = 0; }
  toutCacher() { this.alp.fill(0); this.tai.fill(0); }
  maj() { for (const k in this.attrs) this.attrs[k].needsUpdate = true; }
}

/* ── Les liens : des traits de lumière d'épaisseur réelle ──
   En pixels (monde = false) ou en unités du monde (monde = true, la
   perspective les affine au loin). */
class Liens {
  constructor(monde, max, { largeur = 2.4, enMonde = false, additif = true, brume = true, pointille = null } = {}) {
    this.max = max; this.n = 0; this.monde = monde; this.brume = brume; this.pointille = pointille;
    this.pos = new Float32Array(max * 6);
    this.col = new Float32Array(max * 6);
    this.geo = new LineSegmentsGeometry();
    this.geo.setPositions(this.pos);
    this.geo.setColors(this.col);
    this.mat = new LineMaterial({ linewidth: largeur, vertexColors: true, transparent: true, depthWrite: false,
      blending: additif ? THREE.AdditiveBlending : THREE.NormalBlending, worldUnits: enMonde });
    this.mat.resolution.set(W, H);
    if (pointille) { this.mat.dashed = true; this.mat.dashSize = pointille[0]; this.mat.gapSize = pointille[1]; this.mat.dashScale = 1; }
    this.obj = new LineSegments2(this.geo, this.mat);
    this.obj.frustumCulled = false;
    monde.scene.add(this.obj);
    monde.liens.push(this);
  }
  vider() { this.n = 0; }
  /* Un lien de a vers b, tracé sur la fraction p (0 → 1), couleurs HDR.
     de > 0 : le trait part de là (une impulsion qui voyage, par exemple). */
  ajouter(a, b, ca, cb, p = 1, de = 0) {
    if (this.n >= this.max || p - de <= 0.001) return;
    const d = de > 0 ? mix3(a, b, de) : a;
    const q = p >= 1 ? b : mix3(a, b, p);
    const i = this.n * 6;
    this.pos[i] = d[0]; this.pos[i + 1] = d[1]; this.pos[i + 2] = d[2];
    this.pos[i + 3] = q[0]; this.pos[i + 4] = q[1]; this.pos[i + 5] = q[2];
    let cd = cb && de > 0 ? mix3(ca, cb, de) : ca;
    let cq = cb ? (p >= 1 ? cb : mix3(ca, cb, p)) : ca;
    if (this.brume) { cd = mul3(cd, this.monde.att(d)); cq = mul3(cq, this.monde.att(q)); }
    this.col[i] = cd[0]; this.col[i + 1] = cd[1]; this.col[i + 2] = cd[2];
    this.col[i + 3] = cq[0]; this.col[i + 4] = cq[1]; this.col[i + 5] = cq[2];
    this.n++;
  }
  maj() {
    this.pos.fill(0, this.n * 6); this.col.fill(0, this.n * 6);
    this.geo.setPositions(this.pos);
    this.geo.setColors(this.col);
    if (this.pointille && this.n > 0) this.obj.computeLineDistances();
    this.obj.visible = this.n > 0;
  }
}

/* ── Les blocs : le volume des planches de la marque ──
   Chaque bloc a trois teintes cuites (le dessus, le côté, l'ombre), comme
   sur le site et les documents imprimés, et un filet plus sombre sur ses
   arêtes. Pas d'éclairage : c'est un dessin, en vrai volume. */
const TEINTES_BLOC = {
  plein: ['#5B4BE6', '#1C0CB3', '#130982'],
  neuf: ['#A79CF7', '#6B5BEA', '#4B3CC9'],
  creme: ['#FFFFFF', '#E4E1EE', '#C9C4DE'],
  papier: ['#F0EEE8', '#D9D5E4', '#BDB7D4'],
  encre: ['#2A2450', '#1A1538', '#110D26'],
  soleil: ['#FFD08A', '#F2A93B', '#C98319'],
  menthe: ['#7FE0C4', '#2FAE8E', '#1E7F66'],
  ciel: ['#8CCBFA', '#3B9DE8', '#2273B8'],
  corail: ['#FFA89B', '#EF6F5E', '#C24A3B'],
  lilas: ['#C4BDFA', '#8B7FF0', '#6457C9'],
};
class Blocs {
  constructor(monde, max, { arete = 0.022, areteCouleur = '#0D0535' } = {}) {
    this.max = max; this.n = 0; this.monde = monde;
    const g = new THREE.BoxGeometry(1, 1, 1);
    this.haut = new Float32Array(max * 3); this.cote = new Float32Array(max * 3); this.ombre = new Float32Array(max * 3);
    this.ech = new Float32Array(max * 3); this.eclat = new Float32Array(max);
    this.attrs = {
      aHaut: new THREE.InstancedBufferAttribute(this.haut, 3), aCote: new THREE.InstancedBufferAttribute(this.cote, 3),
      aOmbre: new THREE.InstancedBufferAttribute(this.ombre, 3), aEch: new THREE.InstancedBufferAttribute(this.ech, 3),
      aEclat: new THREE.InstancedBufferAttribute(this.eclat, 1),
    };
    for (const k in this.attrs) g.setAttribute(k, this.attrs[k]);
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uArete: { value: arete }, uAreteC: { value: new THREE.Color(areteCouleur) }, uFond: { value: new THREE.Color(C.fond) }, uBrume: { value: 0.02 } },
      vertexShader: `
        attribute vec3 aHaut; attribute vec3 aCote; attribute vec3 aOmbre; attribute vec3 aEch; attribute float aEclat;
        varying vec3 vCol; varying vec3 vLoc; varying vec3 vN; varying vec3 vEch; varying float vProf; varying float vEclat;
        void main(){
          vec3 n = normal;
          vCol = n.y > 0.5 ? aHaut : (abs(n.x) > 0.5 ? aCote : aOmbre);
          vLoc = position; vN = n; vEch = aEch; vEclat = aEclat;
          vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          vProf = -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uArete; uniform vec3 uAreteC; uniform vec3 uFond; uniform float uBrume;
        varying vec3 vCol; varying vec3 vLoc; varying vec3 vN; varying vec3 vEch; varying float vProf; varying float vEclat;
        void main(){
          /* Les deux coordonnées dans la face, en unités du monde. */
          vec2 uv; vec2 e;
          if (abs(vN.x) > 0.5) { uv = vLoc.yz; e = vEch.yz; } else if (abs(vN.y) > 0.5) { uv = vLoc.xz; e = vEch.xz; } else { uv = vLoc.xy; e = vEch.xy; }
          vec2 d = (0.5 - abs(uv)) * e;
          float bord = min(d.x, d.y);
          float w = fwidth(bord);
          float filet = 1.0 - smoothstep(uArete - w, uArete + w, bord);
          vec3 col = vCol;
          if (abs(vN.y) < 0.5) col *= mix(0.8, 1.0, smoothstep(-0.5, 0.15, vLoc.y));
          col = mix(col, uAreteC, filet * 0.85);
          col *= 1.0 + vEclat;
          float att = exp(-uBrume * uBrume * vProf * vProf);
          gl_FragColor = vec4(mix(uFond, col, att), 1.0);
        }`,
    });
    this.obj = new THREE.InstancedMesh(g, this.mat, max);
    this.obj.frustumCulled = false;
    this.obj.count = 0;
    this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.e = new THREE.Euler(); this.v = new THREE.Vector3(); this.s = new THREE.Vector3();
    monde.scene.add(this.obj);
    monde.blocs.push(this);
  }
  vider() { this.n = 0; }
  /* Un bloc : centre, taille (l, h, p), rotation (x, y, z), teinte, éclat (0 = normal). */
  ajouter(p, taille, rot, teinte, eclat = 0) {
    if (this.n >= this.max || taille[0] * taille[1] * taille[2] <= 1e-9) return;
    const i = this.n;
    const t = Array.isArray(teinte) ? teinte : TEINTES_BLOC[teinte] || TEINTES_BLOC.plein;
    const c = t.map((h) => new THREE.Color(h));
    this.haut.set([c[0].r, c[0].g, c[0].b], i * 3); this.cote.set([c[1].r, c[1].g, c[1].b], i * 3); this.ombre.set([c[2].r, c[2].g, c[2].b], i * 3);
    this.ech.set(taille, i * 3); this.eclat[i] = eclat;
    this.e.set(rot[0], rot[1], rot[2]); this.q.setFromEuler(this.e);
    this.m.compose(this.v.set(p[0], p[1], p[2]), this.q, this.s.set(taille[0], taille[1], taille[2]));
    this.obj.setMatrixAt(i, this.m);
    this.n++;
  }
  maj() {
    this.obj.count = this.n;
    this.obj.instanceMatrix.needsUpdate = true;
    for (const k in this.attrs) this.attrs[k].needsUpdate = true;
    this.mat.uniforms.uBrume.value = this.monde.brume;
  }
}

/* ── Les ombres de contact : un halo doux posé au sol sous chaque objet ── */
class Ombres {
  constructor(monde, max, { couleur = '#1C0CB3' } = {}) {
    const g = new THREE.PlaneGeometry(1, 1);
    g.rotateX(-Math.PI / 2);
    this.alp = new Float32Array(max); this.flou = new Float32Array(max);
    this.attrs = { aAlp: new THREE.InstancedBufferAttribute(this.alp, 1), aFlou: new THREE.InstancedBufferAttribute(this.flou, 1) };
    for (const k in this.attrs) g.setAttribute(k, this.attrs[k]);
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uC: { value: new THREE.Color(couleur) } },
      vertexShader: `attribute float aAlp; attribute float aFlou; varying vec2 vUv; varying float vAlp; varying float vFlou;
        void main(){ vUv = uv; vAlp = aAlp; vFlou = aFlou; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform vec3 uC; varying vec2 vUv; varying float vAlp; varying float vFlou;
        void main(){
          vec2 d = abs(vUv - 0.5) * 2.0;
          float r = length(max(d - (1.0 - vFlou), 0.0)) / max(vFlou, 0.001);
          float a = (1.0 - smoothstep(0.0, 1.0, r)); a = a * a * vAlp;
          if (a < 0.002) discard;
          gl_FragColor = vec4(uC, a);
        }`,
      transparent: true, depthWrite: false,
    });
    this.max = max; this.n = 0;
    this.obj = new THREE.InstancedMesh(g, this.mat, max);
    this.obj.count = 0; this.obj.frustumCulled = false; this.obj.renderOrder = -10;
    this.m = new THREE.Matrix4(); this.q = new THREE.Quaternion(); this.v = new THREE.Vector3(); this.s = new THREE.Vector3();
    monde.scene.add(this.obj);
    monde.ombres.push(this);
  }
  vider() { this.n = 0; }
  /* Au sol en p (y = hauteur du sol), largeur l, profondeur pr, opacité, douceur (0 → 1). */
  ajouter(p, l, pr, alpha, flou = 0.4, angle = 0) {
    if (this.n >= this.max || alpha <= 0.002) return;
    this.q.setFromAxisAngle(this.v.set(0, 1, 0), angle);
    this.m.compose(this.v.set(p[0], p[1], p[2]), this.q, this.s.set(l, 1, pr));
    this.obj.setMatrixAt(this.n, this.m);
    this.alp[this.n] = alpha; this.flou[this.n] = flou;
    this.n++;
  }
  maj() {
    this.obj.count = this.n;
    this.obj.instanceMatrix.needsUpdate = true;
    for (const k in this.attrs) this.attrs[k].needsUpdate = true;
  }
}

/* ── Un panneau : du texte posé dans l'espace (une vraie surface 3D) ──
   Dessiné une fois dans une toile à la police de la marque, puis traité
   comme n'importe quel objet : perspective, profondeur, flou de mouvement. */
class Panneau {
  constructor(monde, lignes, { corps = 150, graisse = 600, couleur = C.creme, largeur = 1800, interligne = 0.95, approche = -0.04, fond = null, bord = null, epBord = 3, rayon = 0, marge = 0, echelle = 0.01 } = {}) {
    const toile = document.createElement('canvas');
    const ctx = toile.getContext('2d');
    const police = `${graisse} ${corps}px 'Reskope Sans'`;
    ctx.font = police;
    const hLigne = corps * interligne;
    const hauteur = Math.ceil(hLigne * lignes.length + corps * 0.35 + marge * 2);
    toile.width = largeur + marge * 2; toile.height = hauteur;
    ctx.font = police;
    if ('letterSpacing' in ctx) ctx.letterSpacing = `${approche * corps}px`;
    if (fond) {
      ctx.fillStyle = fond;
      const r = rayon;
      ctx.beginPath();
      ctx.roundRect(epBord, epBord, toile.width - epBord * 2, toile.height - epBord * 2, r);
      ctx.fill();
      if (bord) { ctx.strokeStyle = bord; ctx.lineWidth = epBord; ctx.stroke(); }
    }
    ctx.fillStyle = couleur; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    lignes.forEach((l, i) => ctx.fillText(l, toile.width / 2, marge + corps * 0.86 + i * hLigne));
    this.tex = new THREE.CanvasTexture(toile);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 8;
    this.tex.generateMipmaps = true;
    this.tex.minFilter = THREE.LinearMipmapLinearFilter;
    this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false, toneMapped: false, side: THREE.DoubleSide, fog: false });
    this.l = toile.width * echelle; this.h = toile.height * echelle;
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(this.l, this.h), this.mat);
    this.obj.frustumCulled = false;
    monde.scene.add(this.obj);
  }
  poser(p, rot = [0, 0, 0], opacite = 1, echelle = 1, intensite = 1) {
    this.obj.position.set(p[0], p[1], p[2]);
    this.obj.rotation.set(rot[0], rot[1], rot[2]);
    this.obj.scale.setScalar(echelle);
    this.mat.opacity = opacite;
    this.mat.color.setScalar(intensite);
    this.obj.visible = opacite > 0.002;
  }
}

/* ── Le fond : un dégradé radial, une lumière douce derrière le sujet ── */
class Fond {
  constructor(monde) {
    this.mat = new THREE.ShaderMaterial({
      uniforms: { uCentre: { value: new THREE.Color(C.fond) }, uBord: { value: new THREE.Color(C.fond) }, uPos: { value: new THREE.Vector2(0.5, 0.5) }, uRayon: { value: 0.8 } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.9999, 1.0); }`,
      fragmentShader: `uniform vec3 uCentre; uniform vec3 uBord; uniform vec2 uPos; uniform float uRayon; varying vec2 vUv;
        void main(){ vec2 d = (vUv - uPos) * vec2(1.0, 1.7778); float k = smoothstep(0.0, uRayon, length(d)); gl_FragColor = vec4(mix(uCentre, uBord, k * k * (3.0 - 2.0 * k)), 1.0); }`,
      depthTest: false, depthWrite: false,
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    this.obj = new THREE.Mesh(g, this.mat);
    this.obj.frustumCulled = false;
    this.obj.renderOrder = -1000;
    monde.scene.add(this.obj);
  }
  poser(centre, bord, pos = [0.5, 0.5], rayon = 0.8) {
    this.mat.uniforms.uCentre.value.set(centre);
    this.mat.uniforms.uBord.value.set(bord);
    this.mat.uniforms.uPos.value.set(pos[0], pos[1]);
    this.mat.uniforms.uRayon.value = rayon;
  }
  /* Deux teintes mélangées (hex), pour les fondus de fond. */
  static melange(a, b, p) { return '#' + new THREE.Color(a).lerp(new THREE.Color(b), clamp01(p)).getHexString(); }
}

/* ── La finition : genou doux sur les hautes lumières, vignette,
   aberration liée à la vitesse, grain (le même pour une même image). ── */
const FINITION = {
  uniforms: {
    tDiffuse: { value: null }, uAberration: { value: 0 }, uVignette: { value: 0.5 },
    uGrain: { value: 0.007 }, uImage: { value: 0 }, uExpo: { value: 1 }, uGenou: { value: 0.72 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uAberration; uniform float uVignette; uniform float uGrain; uniform float uImage; uniform float uExpo; uniform float uGenou;
    varying vec2 vUv;
    float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
    vec3 genou(vec3 x){
      float k = uGenou;
      vec3 haut = k + (1.0 - k) * (1.0 - exp(-(x - k) / (1.0 - k)));
      return mix(x, haut, step(vec3(k), x));
    }
    void main(){
      vec2 c = vUv - 0.5; float d = length(c * vec2(0.5625, 1.0)) * 1.9;
      vec2 off = c * uAberration * (0.25 + d);
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      col *= uExpo;
      /* Ce qui brûle tire vers le blanc, comme une vraie pellicule. */
      float pic = max(col.r, max(col.g, col.b));
      col = mix(col, vec3(pic), clamp((pic - 1.2) / 3.0, 0.0, 0.85));
      col = genou(col);
      col *= mix(1.0, smoothstep(1.25, 0.25, d), uVignette);
      float g = hash(gl_FragCoord.xy + vec2(uImage * 37.0, uImage * 17.0)) + hash(gl_FragCoord.xy * 1.37 + vec2(uImage * 11.0, 5.0)) - 1.0;
      col += g * uGrain * (0.3 + 0.7 * sqrt(max(col, 0.0)));
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`,
};

/* ── Le monde ─────────────────────────────────────────────── */
class Monde {
  constructor(canvas, { fond = C.fond, brume = 0.012, fov = 34, bloom = [0.9, 0.55, 0.62] } = {}) {
    this.nuees = []; this.liens = []; this.blocs = []; this.ombres = [];
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance', alpha: false });
    r.setPixelRatio(1); r.setSize(W, H, false);
    r.toneMapping = THREE.NoToneMapping;
    r.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.brume = brume;
    this.fond = new Fond(this);
    this.fond.poser(fond, fond);
    this.camera = new THREE.PerspectiveCamera(fov, W / H, 0.05, 900);
    const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
    this.composer = new EffectComposer(r, rt);
    this.composer.renderToScreen = false;
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new THREE.Vector2(W, H), bloom[0], bloom[1], bloom[2]);
    this.bloom.highPassUniforms.smoothWidth.value = 0.45;
    this.composer.addPass(this.bloom);
    this.finition = new ShaderPass(FINITION);
    this.composer.addPass(this.finition);
    this.composer.addPass(new OutputPass());
    /* Accumulation pour le flou de mouvement (moyenne des sous-images). */
    const opt = { type: THREE.HalfFloatType };
    this.accA = new THREE.WebGLRenderTarget(W, H, opt);
    this.accB = new THREE.WebGLRenderTarget(W, H, opt);
    const vs = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
    this.accMat = new THREE.ShaderMaterial({
      uniforms: { tPrec: { value: null }, tNeuf: { value: null }, uPoids: { value: 1 } }, vertexShader: vs,
      fragmentShader: `uniform sampler2D tPrec; uniform sampler2D tNeuf; uniform float uPoids; varying vec2 vUv;
        void main(){ gl_FragColor = mix(texture2D(tPrec, vUv), texture2D(tNeuf, vUv), uPoids); }`,
      depthTest: false, depthWrite: false,
    });
    this.copieMat = new THREE.ShaderMaterial({
      uniforms: { tSrc: { value: null } }, vertexShader: vs,
      fragmentShader: `uniform sampler2D tSrc; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv); }`,
      depthTest: false, depthWrite: false,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2));
    this.sceneQuad = new THREE.Scene(); this.sceneQuad.add(this.quad);
    this.camQuad = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.poser = () => ({ flou: 0 });
    this.echelle = 1;
  }
  /* Place la caméra : position, point visé, roulis, focale. */
  viser(pos, cible, roulis = 0, fov) {
    const cam = this.camera;
    if (fov && Math.abs(cam.fov - fov) > 1e-4) { cam.fov = fov; cam.updateProjectionMatrix(); }
    cam.position.set(pos[0], pos[1], pos[2]);
    const dir = new THREE.Vector3(cible[0] - pos[0], cible[1] - pos[1], cible[2] - pos[2]).normalize();
    /* Le roulis tourne le « haut » autour de l'axe de visée. */
    const haut = new THREE.Vector3(0, 1, 0);
    if (Math.abs(dir.y) > 0.999) haut.set(0, 0, -1);
    haut.applyAxisAngle(dir, roulis);
    cam.up.copy(haut);
    cam.lookAt(cible[0], cible[1], cible[2]);
    cam.updateMatrixWorld();
    this.echelle = H / (2 * Math.tan((cam.fov * Math.PI) / 360));
    for (const n of this.nuees) n.mat.uniforms.uEchelle.value = this.echelle;
  }
  /* La mise au point : distance du plan net, ouverture (0 = tout est net). */
  netete(foyer, ouverture) {
    for (const n of this.nuees) { n.mat.uniforms.uFoyer.value = Math.max(0.1, foyer); n.mat.uniforms.uOuverture.value = ouverture; }
  }
  /* L'atténuation dans la brume d'un point, vu de la caméra (pour les liens). */
  att(p) {
    const c = this.camera.position, dx = p[0] - c.x, dy = p[1] - c.y, dz = p[2] - c.z;
    return Math.exp(-(dx * dx + dy * dy + dz * dz) * this.brume * this.brume);
  }
  _rendreA(t) {
    const info = this.poser(t) || {};
    for (const n of this.nuees) { n.mat.uniforms.uBrume.value = this.brume; n.maj(); }
    for (const l of this.liens) l.maj();
    for (const b of this.blocs) b.maj();
    for (const o of this.ombres) o.maj();
    this.finition.uniforms.uImage.value = Math.round(t * FPS);
    this.finition.uniforms.uAberration.value = info.aberration || 0;
    this.finition.uniforms.uExpo.value = info.expo === undefined ? 1 : info.expo;
    this.composer.render();
    return info;
  }
  _dessiner(mat, cible) {
    this.quad.material = mat;
    this.renderer.setRenderTarget(cible);
    this.renderer.render(this.sceneQuad, this.camQuad);
  }
  /* Une image au temps t ; si la scène va vite, plusieurs sous-images
     moyennées le long d'un obturateur (le flou de mouvement d'une caméra).
     flou = 1 : obturateur ouvert sur une image entière (360°). */
  image(t) {
    const info = this._rendreA(t);
    const flou = info.flou || 0;
    if (flou < 0.03) {
      this.copieMat.uniforms.tSrc.value = this.composer.readBuffer.texture;
      this._dessiner(this.copieMat, null);
      return info;
    }
    const K = 1 + Math.min(11, Math.ceil(flou * 8));
    const obturateur = Math.min(flou, 1.6) / FPS;
    this.copieMat.uniforms.tSrc.value = this.composer.readBuffer.texture;
    this._dessiner(this.copieMat, this.accA);
    let prec = this.accA, suiv = this.accB;
    for (let k = 1; k < K; k++) {
      this._rendreA(t - (k / (K - 1)) * obturateur);
      this.accMat.uniforms.tPrec.value = prec.texture;
      this.accMat.uniforms.tNeuf.value = this.composer.readBuffer.texture;
      this.accMat.uniforms.uPoids.value = 1 / (k + 1);
      this._dessiner(this.accMat, suiv);
      const x = prec; prec = suiv; suiv = x;
    }
    this.copieMat.uniforms.tSrc.value = prec.texture;
    this._dessiner(this.copieMat, null);
    /* L'état final (étiquettes projetées, etc.) est celui de l'instant t. */
    this.poser(t);
    return info;
  }
}

/* ── La géométrie du R (logo/geometrie.json), centrée sur le R ── */
const R_NOEUDS = [[36, 30], [92, 30], [104, 62], [36, 80], [36, 122], [104, 122]];
const R_LIENS = [[0, 3], [3, 4], [0, 1], [1, 2], [2, 3], [3, 5]];
const R_CENTRE = [70, 76];
/* Les nœuds du R dans un plan, à l'échelle e (unités du monde par unité du logo). */
function rPlan(e, z = 0) {
  return R_NOEUDS.map((n) => [(n[0] - R_CENTRE[0]) * e, -(n[1] - R_CENTRE[1]) * e, z]);
}

/* Projection d'un point 3D vers l'écran (pour poser du texte HTML). */
const _v = new THREE.Vector3();
function versEcran(monde, p) {
  _v.set(p[0], p[1], p[2]).project(monde.camera);
  return { x: (_v.x * 0.5 + 0.5) * W, y: (-_v.y * 0.5 + 0.5) * H, devant: _v.z < 1 && _v.z > -1 };
}
/* Le point du monde qui tombe sur un pixel donné, à une distance d de la caméra. */
function depuisEcran(monde, x, y, d) {
  const cam = monde.camera;
  const nx = (x / W) * 2 - 1, ny = -((y / H) * 2 - 1);
  const v = new THREE.Vector3(nx, ny, 0.5).unproject(cam).sub(cam.position).normalize();
  const avant = new THREE.Vector3(); cam.getWorldDirection(avant);
  const k = d / v.dot(avant);
  return [cam.position.x + v.x * k, cam.position.y + v.y * k, cam.position.z + v.z * k];
}
