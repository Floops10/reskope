/* ════════════════════════════════════════════════════════════
   RESKOPE · MOTION v2 : la signature, commune aux trois films.

   Le R arrive en grand (le R 3D de chaque film se pose exactement sur ce
   dessin), puis il se range à gauche du mot pour former le logo officiel
   (logo/geometrie.json : traits 3, nœuds 5,5, jonction 7 pour 92 de haut),
   la phrase de marque monte, puis l'appel et l'adresse.
   ════════════════════════════════════════════════════════════ */
var FIN = (function () {
  /* s0 : échelle du grand R (px par unité du logo), c0 : son centre à l'écran.
     s1 : échelle du logo complet, c1 : le centre du logo complet. */
  var LOGO = { s0: 4.348, c0: [540, 740], s1: 1.4938, boite: [29, 24.5, 577.95, 139.85], c1: [540, 760] };
  LOGO.r1 = [LOGO.c1[0] + (70 - (LOGO.boite[0] + LOGO.boite[2]) / 2) * LOGO.s1, LOGO.c1[1] + (76 - (LOGO.boite[1] + LOGO.boite[3]) / 2) * LOGO.s1];
  /* Les six nœuds du R à l'écran, en grand (pour y poser le R 3D). */
  var R_NOEUDS_LOGO = [[36, 30], [92, 30], [104, 62], [36, 80], [36, 122], [104, 122]];
  LOGO.ecran = R_NOEUDS_LOGO.map(function (n) { return [LOGO.c0[0] + (n[0] - 70) * LOGO.s0, LOGO.c0[1] + (n[1] - 76) * LOGO.s0]; });

  var etat = { p: 0, mot: 0 };
  function poser() {
    var p = etat.p, s = LOGO.s0 + (LOGO.s1 - LOGO.s0) * p;
    var cx = LOGO.c0[0] + (LOGO.r1[0] - LOGO.c0[0]) * p, cy = LOGO.c0[1] + (LOGO.r1[1] - LOGO.c0[1]) * p;
    document.getElementById('logo-groupe').setAttribute('transform', 'translate(' + (cx - 70 * s).toFixed(2) + ' ' + (cy - 76 * s).toFixed(2) + ') scale(' + s.toFixed(4) + ')');
    document.getElementById('coupe-rect').setAttribute('width', (440 * etat.mot).toFixed(2));
    document.getElementById('logo-mot').setAttribute('transform', 'translate(' + (-26 * (1 - etat.mot)).toFixed(2) + ' 0)');
  }
  /* t0 : le R HTML remplace le R 3D. La suite se cale dessus. */
  function installer(tl, t0, duree) {
    poser();
    TY.voir(tl, 'p-fin', t0 - 0.05, duree, true);
    tl.fromTo('#logo', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none', immediateRender: true }, t0);
    tl.to(etat, { p: 1, duration: 0.85, ease: 'expo.inOut', onUpdate: poser }, t0 + 0.4);
    tl.to(etat, { mot: 1, duration: 0.8, ease: 'expo.out', onUpdate: poser }, t0 + 0.85);
    TY.monteFlou(tl, '#fin-slogan .ligne:nth-child(1)', t0 + 1.15, { duree: 0.7, pas: 0.05 });
    TY.monteFlou(tl, '#fin-slogan .ligne:nth-child(2)', t0 + 1.4, { duree: 0.7, pas: 0.05 });
    tl.fromTo('#pilule', { scale: 0.6, opacity: 0, filter: 'blur(10px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'back.out(1.8)' }, t0 + 2.1);
    tl.fromTo('#fin-url', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, t0 + 2.5);
  }
  return { LOGO: LOGO, installer: installer };
})();
