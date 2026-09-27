/* ════════════════════════════════════════════════════════════
   RESKOPE · MOTION v2 : les effets de texte (GSAP, déterministes).
   ════════════════════════════════════════════════════════════ */
var TY = (function () {
  /* [data-mots] : chaque mot dans un masque ; un enfant (accent, point)
     reste un seul mot ; <br> reste un saut de ligne. */
  function mot(texte, el) {
    var m = document.createElement('span');
    m.className = 'masque';
    m.setAttribute('data-layout-allow-overlap', '');
    var w = el || document.createElement('span');
    if (!el) w.textContent = texte;
    w.classList.add('mot');
    w.setAttribute('data-layout-allow-overlap', '');
    w.setAttribute('data-layout-allow-overflow', '');
    m.appendChild(w);
    return m;
  }
  function decouper(racine) {
    (racine || document).querySelectorAll('[data-mots]').forEach(function (node) {
      var frag = [];
      Array.from(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          c.textContent.split(/([ \t\n\r]+)/).forEach(function (m) {
            if (!m) return;
            if (/^[ \t\n\r]+$/.test(m)) frag.push(document.createTextNode(' '));
            else frag.push(mot(m, null));
          });
        } else if (c.nodeType === 1 && c.tagName === 'BR') {
          frag.push(c);
        } else if (c.nodeType === 1) {
          frag.push(mot(null, c));
        }
      });
      node.textContent = '';
      frag.forEach(function (f) { node.appendChild(f); });
    });
  }
  /* Les mots montent de derrière leur ligne. */
  function monte(tl, sel, t, o) {
    o = o || {};
    return tl.fromTo(sel + ' .mot', { yPercent: 118 }, { yPercent: 0, duration: o.duree || 0.62, ease: o.ease || 'expo.out', stagger: { each: o.pas || 0.06 }, immediateRender: true }, t);
  }
  /* Montée + mise au point (flou vers net). */
  function monteFlou(tl, sel, t, o) {
    o = o || {};
    return tl.fromTo(sel + ' .mot', { yPercent: 105, filter: 'blur(14px)' }, { yPercent: 0, filter: 'blur(0px)', duration: o.duree || 0.75, ease: o.ease || 'expo.out', stagger: { each: o.pas || 0.065 } }, t);
  }
  /* Arrive trop gros et flou, claque en place, secousse de trois images. */
  function slam(tl, sel, t, o) {
    o = o || {};
    var d = o.duree || 0.3;
    tl.fromTo(sel, { scale: o.de || 1.55, filter: 'blur(24px)', opacity: 0 }, { scale: 1, filter: 'blur(0px)', opacity: 1, duration: d, ease: 'expo.out' }, t);
    var f = 1 / 30, a = o.force || 1;
    tl.to(sel, { keyframes: [
      { x: 9 * a, y: -5 * a, duration: f, ease: 'none' },
      { x: -6 * a, y: 4 * a, duration: f, ease: 'none' },
      { x: 3 * a, y: -2 * a, duration: f, ease: 'none' },
      { x: 0, y: 0, duration: f, ease: 'none' }
    ] }, t + d * 0.45);
  }
  /* Sort en accélérant : c'est la vitesse qui fait la coupe. */
  function sortie(tl, sel, t, o) {
    o = o || {};
    return tl.to(sel, { y: o.y === undefined ? -70 : o.y, scale: o.scale || 1, filter: 'blur(16px)', opacity: 0, duration: o.duree || 0.24, ease: 'power3.in' }, t);
  }
  /* Un éclair blanc de deux images. */
  function eclair(tl, sel, t, o) {
    o = o || {};
    tl.fromTo(sel, { opacity: 0 }, { opacity: o.max || 0.9, duration: 1 / 30, ease: 'none', immediateRender: false }, t);
    tl.to(sel, { opacity: 0, duration: o.fondu || 0.28, ease: 'power2.out' }, t + 2 / 30);
  }
  function compteur(tl, el, de, a, t, d, fmt, ease) {
    var o = { v: de };
    el.textContent = fmt(de);
    return tl.to(o, { v: a, duration: d, ease: ease || 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); } }, t);
  }
  /* Le contenu d'un plan n'est visible que dans sa fenêtre (le plan lui-même
     est un clip que HyperFrames montre et cache ; ceci sert l'aperçu). */
  function voir(tl, id, t0, t1, derniere) {
    tl.set('#' + id, { autoAlpha: 0 }, 0);
    tl.set('#' + id, { autoAlpha: 1 }, t0);
    if (!derniere) tl.set('#' + id, { autoAlpha: 0 }, t1);
  }
  return { decouper: decouper, monte: monte, monteFlou: monteFlou, slam: slam, sortie: sortie, eclair: eclair, compteur: compteur, voir: voir };
})();
