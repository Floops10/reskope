/* ════════════════════════════════════════════════════════════
   RESKOPE · MOTION : les outils communs aux trois films.

   Tout est déterministe (HyperFrames rejoue le temps image par image) :
   aucun Math.random, aucune horloge. Les réseaux sont de vrais objets 3D
   (nœuds [x, y, z] et liens), tournés et projetés en perspective à chaque
   image, comme le réseau du site (src/lib/net3d.js).
   ════════════════════════════════════════════════════════════ */
var RK = (function () {
  var NS = 'http://www.w3.org/2000/svg';

  /* Le R de la marque (Logo.jsx) : traits 3, nœuds 5,5, jonction 7. */
  var R_NOEUDS = [[36, 30], [92, 30], [104, 62], [36, 80], [36, 122], [104, 122]];
  var R_LIENS = [[0, 3], [3, 4], [0, 1], [1, 2], [2, 3], [3, 5]];

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lisse(t) { t = clamp01(t); return t * t * (3 - 2 * t); }
  function sortie(t) { t = clamp01(t); return 1 - Math.pow(1 - t, 3); }

  /* Un tirage pseudo-aléatoire à graine : la même suite à chaque rendu. */
  function prng(graine) {
    var s = graine >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Rotation Y puis X, puis perspective (focale f). */
  function projeter(p, ax, ay, f) {
    var cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    var x1 = p[0] * cy - p[2] * sy;
    var z1 = p[0] * sy + p[2] * cy;
    var y1 = p[1] * cx - z1 * sx;
    var z2 = p[1] * sx + z1 * cx;
    var s = f / (f + z2);
    return { x: x1 * s, y: y1 * s, z: z2, s: s };
  }

  /* Le R extrudé : deux faces reliées par des entretoises (unités du logo,
     centré sur le milieu du R). */
  function r3d(profondeur) {
    var base = R_NOEUDS.map(function (n) { return [n[0] - 70, n[1] - 76]; });
    var noeuds = base.map(function (b) { return [b[0], b[1], profondeur]; })
      .concat(base.map(function (b) { return [b[0], b[1], -profondeur]; }));
    var liens = R_LIENS.slice()
      .concat(R_LIENS.map(function (l) { return [l[0] + 6, l[1] + 6]; }))
      .concat(base.map(function (_, i) { return [i, i + 6]; }));
    var rayons = noeuds.map(function (_, i) { return i % 6 === 3 ? 7 : 5.5; });
    return { noeuds: noeuds, liens: liens, rayons: rayons };
  }

  function el(nom, attrs, parent) {
    var e = document.createElementNS(NS, nom);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ── Le réseau 3D ─────────────────────────────────────────────
     def : noeuds, liens, rayons, couleurs (nœuds), couleurLien, trait,
     depart (positions dispersées, pour l'assemblage), cible (pour une
     métamorphose), focale. L'état se tweene ; rendre() redessine. */
  function Reseau(svg, def) {
    this.def = def;
    this.n = def.noeuds.length;
    this.etat = {
      ax: 0, ay: 0, zoom: 1, cx: 960, cy: 540,
      assemblage: def.depart ? 0 : 1, trace: 1, apparition: 1, morph: 0,
      opacite: 1, halo: 0
    };
    var g = el('g', {}, svg);
    this.gLiens = el('g', { 'stroke-linecap': 'round', fill: 'none' }, g);
    this.gNoeuds = el('g', {}, g);
    this.lignes = def.liens.map(function (l, i) {
      var c = (def.couleursLiens && def.couleursLiens[i]) || def.couleurLien || 'currentColor';
      return el('line', { stroke: c }, this.gLiens);
    }, this);
    this.halos = [];
    this.cercles = def.noeuds.map(function (_, i) {
      var c = (def.couleurs && def.couleurs[i]) || def.couleur || 'currentColor';
      if (def.halos && def.halos[i]) this.halos[i] = el('circle', { fill: c, opacity: 0 }, this.gNoeuds);
      /* creux : une place vide (quelqu'un qu'on n'a pas encore rencontré) */
      if (def.creux) return el('circle', { fill: 'none', stroke: c, 'stroke-width': def.creux, 'stroke-dasharray': '5 7' }, this.gNoeuds);
      return el('circle', { fill: c }, this.gNoeuds);
    }, this);
    this.impulsions = [];
    this.rendre();
  }
  Reseau.prototype.position = function (i) {
    var d = this.def, e = this.etat, p = d.noeuds[i];
    if (d.depart) {
      var etal = 0.55, a = clamp01((e.assemblage * (1 + etal) - (i / this.n) * etal));
      var k = sortie(a);
      p = [lerp(d.depart[i][0], p[0], k), lerp(d.depart[i][1], p[1], k), lerp(d.depart[i][2], p[2], k)];
    }
    if (d.cible && e.morph > 0) {
      var m = lisse(e.morph), c = d.cible[i];
      p = [lerp(p[0], c[0], m), lerp(p[1], c[1], m), lerp(p[2], c[2], m)];
    }
    return p;
  };
  Reseau.prototype.rendre = function () {
    var d = this.def, e = this.etat, f = d.focale || 900, z = e.zoom, n = this.n;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var q = projeter(this.position(i), e.ax, e.ay, f);
      pts.push({ x: e.cx + q.x * z, y: e.cy + q.y * z, s: q.s, z: q.z });
    }
    this.pts = pts;
    var L = this.lignes.length, fen = d.fenetre || 2.5, trait = (d.trait || 3) * z;
    for (var l = 0; l < L; l++) {
      var a = pts[d.liens[l][0]], b = pts[d.liens[l][1]];
      var fr = clamp01((e.trace * (L + fen) - l) / fen);
      var ln = this.lignes[l];
      ln.setAttribute('x1', a.x.toFixed(2)); ln.setAttribute('y1', a.y.toFixed(2));
      ln.setAttribute('x2', (a.x + (b.x - a.x) * fr).toFixed(2));
      ln.setAttribute('y2', (a.y + (b.y - a.y) * fr).toFixed(2));
      var prof = clamp01(0.3 + ((a.s + b.s) / 2 - 0.7) * 2.4);
      ln.setAttribute('stroke-width', (trait * (d.traitFixe ? 1 : (a.s + b.s) / 2)).toFixed(2));
      ln.setAttribute('opacity', (fr > 0.001 ? prof * e.opacite * (d.opaciteLiens || 1) : 0).toFixed(3));
    }
    var etalA = 0.6;
    for (var j = 0; j < n; j++) {
      var p = pts[j], ap = sortie(clamp01(e.apparition * (1 + etalA) - (j / n) * etalA));
      if (d.fixes && d.fixes.indexOf(j) >= 0) ap = 1;
      var pop = ap < 1 ? ap * (1 + 0.35 * Math.sin(ap * Math.PI)) : 1;
      var r = (d.rayons ? d.rayons[j] : 5.5) * z * p.s * pop;
      var c = this.cercles[j];
      c.setAttribute('cx', p.x.toFixed(2)); c.setAttribute('cy', p.y.toFixed(2));
      c.setAttribute('r', Math.max(0, r).toFixed(2));
      c.setAttribute('opacity', (clamp01(0.3 + (p.s - 0.7) * 2.4) * e.opacite * (ap > 0 ? 1 : 0)).toFixed(3));
      /* Une étiquette HTML qui suit son nœud dans l'espace. */
      if (d.etiquettes && d.etiquettes[j]) {
        var et = d.etiquettes[j], dx = et.dx || 0, dy = et.dy || 0;
        et.el.style.transform = 'translate(' + (p.x + dx * p.s).toFixed(1) + 'px,' + (p.y + dy * p.s).toFixed(1) + 'px) translate(' + (et.ax || '-50%') + ',' + (et.ay || '-50%') + ') scale(' + (0.82 + 0.18 * p.s).toFixed(3) + ')';
      }
      if (this.halos[j]) {
        var h = this.halos[j];
        h.setAttribute('cx', p.x.toFixed(2)); h.setAttribute('cy', p.y.toFixed(2));
        h.setAttribute('r', (r * (2.2 + 1.4 * e.halo)).toFixed(2));
        h.setAttribute('opacity', (0.16 * e.halo * e.opacite).toFixed(3));
      }
    }
    for (var k = 0; k < this.impulsions.length; k++) this.impulsions[k].dessiner();
    if (d.surRendu) d.surRendu(pts, e);
  };
  /* Un influx qui parcourt un lien (de son premier nœud vers le second). */
  Reseau.prototype.impulsion = function (lien, couleur, rayon) {
    var self = this;
    var o = { p: 0, v: 0, c: el('circle', { fill: couleur || 'currentColor', r: 0 }, this.gNoeuds) };
    o.dessiner = function () {
      var l = self.def.liens[lien], a = self.pts[l[0]], b = self.pts[l[1]];
      o.c.setAttribute('cx', (a.x + (b.x - a.x) * o.p).toFixed(2));
      o.c.setAttribute('cy', (a.y + (b.y - a.y) * o.p).toFixed(2));
      o.c.setAttribute('r', ((rayon || 4) * self.etat.zoom * lerp(a.s, b.s, o.p) * o.v).toFixed(2));
    };
    this.impulsions.push(o);
    o.dessiner();
    return o;
  };

  /* Un tween sur l'état d'un réseau, qui le redessine à chaque image. */
  function anime(tl, reseau, vars, t) {
    vars.onUpdate = function () { reseau.rendre(); };
    return tl.to(reseau.etat, vars, t);
  }
  function animeDe(tl, reseau, de, vers, t) {
    vers.onUpdate = function () { reseau.rendre(); };
    return tl.fromTo(reseau.etat, de, vers, t);
  }
  function influx(tl, reseau, imp, t, duree, ease) {
    tl.fromTo(imp, { p: 0, v: 0 }, { p: 1, v: 1, duration: duree, ease: ease || 'power1.inOut', onUpdate: function () { imp.dessiner(); } }, t);
    tl.to(imp, { v: 0, duration: 0.18, ease: 'power1.in', onUpdate: function () { imp.dessiner(); } }, t + duree - 0.02);
  }

  /* ── Le texte ─────────────────────────────────────────────────
     .decoupe : le texte est coupé en mots, qui arrivent de la profondeur. */
  function decouper(racine) {
    var cibles = (racine || document).querySelectorAll('.decoupe');
    for (var i = 0; i < cibles.length; i++) {
      var node = cibles[i];
      var morceaux = [];
      /* Interligne serré voulu (1,02) : les boîtes des mots se touchent d'une
         ligne à l'autre, jamais les lettres. On le déclare mot par mot. */
      var serre = node.hasAttribute('data-layout-allow-overlap');
      node.childNodes.forEach(function (c) {
        if (c.nodeType === 3) {
          /* On coupe aux espaces ordinaires seulement : l'espace insécable
             garde « et » collés à leur mot. */
          c.textContent.split(/([ \t\n\r]+)/).forEach(function (m) {
            if (!m) return;
            if (/^[ \t\n\r]+$/.test(m)) morceaux.push(document.createTextNode(' '));
            else {
              var s = document.createElement('span'); s.className = 'mot'; s.textContent = m;
              if (serre) s.setAttribute('data-layout-allow-overlap', '');
              morceaux.push(s);
            }
          });
        } else {
          c.classList.add('mot');
          morceaux.push(c);
        }
      });
      node.textContent = '';
      morceaux.forEach(function (m) { node.appendChild(m); });
    }
  }
  function mots(tl, sel, t, o) {
    o = o || {};
    return tl.from(sel + ' .mot', {
      z: o.z || -520, y: o.y === undefined ? 34 : o.y, autoAlpha: 0,
      duration: o.duree || 0.85, ease: o.ease || 'expo.out',
      stagger: { each: o.pas || 0.055, from: 'start' }
    }, t);
  }
  function surgit(tl, sel, t, o) {
    o = o || {};
    return tl.from(sel, {
      z: o.z || -900, y: o.y || 0, x: o.x || 0, rotationX: o.rx || 0, rotationY: o.ry || 0,
      autoAlpha: 0, duration: o.duree || 1.05, ease: o.ease || 'expo.out',
      stagger: o.pas ? { each: o.pas, from: 'start' } : 0
    }, t);
  }
  function pop(tl, sel, t, o) {
    o = o || {};
    return tl.from(sel, { scale: 0, autoAlpha: 0, duration: o.duree || 0.6, ease: o.ease || 'back.out(2)', stagger: o.pas ? { each: o.pas, from: 'start' } : 0 }, t);
  }
  /* Une respiration lente dans la fenêtre [t0, t1] : rien ne s'arrête. */
  function flotte(tl, sel, t0, t1, o) {
    o = o || {};
    var cycle = o.cycle || 2.6, n = Math.max(1, Math.floor((t1 - t0) / cycle));
    var v = { duration: cycle / 2, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1 };
    /* Relatif : l'élément respire autour de là où il s'est posé. */
    v.y = '+=' + (o.y !== undefined ? o.y : -10);
    if (o.x !== undefined) v.x = '+=' + o.x;
    if (o.r !== undefined) v.rotation = '+=' + o.r;
    if (o.s !== undefined) v.scale = o.s;
    return tl.to(sel, v, t0);
  }
  /* La caméra : un mouvement continu sur toute la scène, jamais d'arrêt net. */
  function camera(tl, sel, t0, t1, de, vers) {
    vers.duration = t1 - t0;
    vers.ease = vers.ease || 'none';
    return tl.fromTo(sel, de, vers, t0);
  }
  function compteur(tl, noeud, de, vers, t, duree, format) {
    var o = { v: de };
    noeud.textContent = format(de);
    return tl.to(o, { v: vers, duration: duree, ease: 'power2.out', onUpdate: function () { noeud.textContent = format(o.v); } }, t);
  }
  /* Les scènes hors ancre : visibles seulement dans leur fenêtre. */
  function voir(tl, id, debut, fin, derniere) {
    if (debut > 0) tl.set('#' + id, { autoAlpha: 1 }, debut);
    if (!derniere) tl.set('#' + id, { autoAlpha: 0 }, fin);
  }
  /* L'iris : un disque qui s'ouvre depuis un point et couvre le cadre. */
  function iris(tl, sel, x, y, t, duree) {
    return tl.fromTo(sel,
      { clipPath: 'circle(0px at ' + x + 'px ' + y + 'px)' },
      { clipPath: 'circle(2300px at ' + x + 'px ' + y + 'px)', duration: duree || 0.7, ease: 'power3.in' }, t);
  }

  /* ── Les volumes ──────────────────────────────────────────────
     <div class="cube" data-l="260" data-h="180" data-p="200" data-texte="Site">
     Six faces, centrées sur l'origine de l'élément. */
  function cubes(racine) {
    var liste = (racine || document).querySelectorAll('.cube[data-l]');
    for (var i = 0; i < liste.length; i++) {
      var c = liste[i], l = +c.dataset.l, h = +c.dataset.h, p = +c.dataset.p;
      var faces = [
        ['f-avant', l, h, 'translateZ(' + p / 2 + 'px)'],
        ['f-arriere', l, h, 'rotateY(180deg) translateZ(' + p / 2 + 'px)'],
        ['f-cote', p, h, 'rotateY(90deg) translateZ(' + l / 2 + 'px)'],
        ['f-cote2', p, h, 'rotateY(-90deg) translateZ(' + l / 2 + 'px)'],
        ['f-haut', l, p, 'rotateX(90deg) translateZ(' + h / 2 + 'px)'],
        ['f-bas', l, p, 'rotateX(-90deg) translateZ(' + h / 2 + 'px)']
      ];
      faces.forEach(function (f) {
        var d = document.createElement('div');
        d.className = f[0];
        d.style.width = f[1] + 'px';
        d.style.height = f[2] + 'px';
        d.style.left = (-f[1] / 2) + 'px';
        d.style.top = (-f[2] / 2) + 'px';
        d.style.transform = f[3];
        if (f[0] === 'f-avant' && c.dataset.texte) {
          var s = document.createElement('span');
          s.textContent = c.dataset.texte;
          d.appendChild(s);
        }
        c.appendChild(d);
      });
    }
  }

  /* ── La trame de fond : un réseau clairsemé, tiré à graine. ── */
  function trame(svg, graine, couleur, w, h) {
    var rnd = prng(graine), pts = [], cols = 9, rows = 6;
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      pts.push([(x + 0.2 + rnd() * 0.6) * (w / cols), (y + 0.2 + rnd() * 0.6) * (h / rows)]);
    }
    var g = el('g', { stroke: couleur, fill: couleur }, svg);
    for (var i = 0; i < pts.length; i++) {
      var cx = i % cols, cy = Math.floor(i / cols);
      [[1, 0], [0, 1], [1, 1]].forEach(function (d, k) {
        var j = (cy + d[1]) * cols + (cx + d[0]);
        if (cx + d[0] >= cols || cy + d[1] >= rows) return;
        if (k === 2 && rnd() > 0.35) return;
        el('line', { x1: pts[i][0], y1: pts[i][1], x2: pts[j][0], y2: pts[j][1], 'stroke-width': 1.4, opacity: 0.55 }, g);
      });
      el('circle', { cx: pts[i][0], cy: pts[i][1], r: 3 + rnd() * 2.5, opacity: 0.8 }, g);
    }
  }

  /* ── Le logo horizontal de l'en-tête (R + mot vectorisé). ── */
  function logo(svg, couleur, motD) {
    var g = el('g', {}, svg);
    var gl = el('g', { stroke: couleur, 'stroke-width': 3, 'stroke-linecap': 'round', fill: 'none' }, g);
    R_LIENS.forEach(function (l) {
      el('line', { x1: R_NOEUDS[l[0]][0], y1: R_NOEUDS[l[0]][1], x2: R_NOEUDS[l[1]][0], y2: R_NOEUDS[l[1]][1], 'class': 'logo-lien' }, gl);
    });
    var gn = el('g', { fill: couleur }, g);
    R_NOEUDS.forEach(function (n, i) { el('circle', { cx: n[0], cy: n[1], r: i === 3 ? 7 : 5.5, 'class': 'logo-noeud' }, gn); });
    el('path', { d: motD, fill: couleur, 'class': 'logo-mot' }, g);
    return g;
  }

  return {
    R_NOEUDS: R_NOEUDS, R_LIENS: R_LIENS, prng: prng, projeter: projeter, r3d: r3d,
    Reseau: Reseau, anime: anime, animeDe: animeDe, influx: influx,
    decouper: decouper, mots: mots, surgit: surgit, pop: pop, flotte: flotte, camera: camera,
    compteur: compteur, voir: voir, iris: iris, cubes: cubes, trame: trame, logo: logo, el: el,
    clamp01: clamp01, lerp: lerp
  };
})();
