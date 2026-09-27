"""Reskope Sans : lettres construites par contours (pas par trait monoline).

Chaque lettre est assemblée à partir de formes simples (fûts, bols en
super-ellipse, diagonales) combinées par opérations booléennes (skia-pathops),
avec :
  - un léger contraste (les horizontales plus fines que les verticales) ;
  - des jonctions affinées (le bol ou l'arche mord dans le fût) ;
  - des débordements optiques (les ronds dépassent un peu les lignes).

Deux styles :
  Tendue : courbes tendues entre le cercle et le carré, coupes horizontales ;
  Elan   : courbes rondes, coupes obliques qui montent vers la droite.
Unités : 1000 par cadratin, ligne de base y = 0, y vers le haut.
"""
import math
from pathops import Path, op, PathOp
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

XH, ASC, CAP, DSC = 516, 742, 700, -216
OS, OSC = 12, 14


# ------------------------------------------------------------ outils de forme
def rect(x0, y0, x1, y1):
    p = Path()
    p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(x1, y1); p.lineTo(x0, y1); p.close()
    return p


def poly(pts):
    p = Path()
    p.moveTo(*pts[0])
    for q in pts[1:]:
        p.lineTo(*q)
    p.close()
    return p


def boite(cx, cy, rx, ry, k):
    """Super-ellipse approchée par quatre cubiques ; k = 0,552 donne un cercle,
    plus k grandit, plus la courbe est tendue vers le carré."""
    p = Path()
    p.moveTo(cx + rx, cy)
    p.cubicTo(cx + rx, cy + k * ry, cx + k * rx, cy + ry, cx, cy + ry)
    p.cubicTo(cx - k * rx, cy + ry, cx - rx, cy + k * ry, cx - rx, cy)
    p.cubicTo(cx - rx, cy - k * ry, cx - k * rx, cy - ry, cx, cy - ry)
    p.cubicTo(cx + k * rx, cy - ry, cx + rx, cy - k * ry, cx + rx, cy)
    p.close()
    return p


def U(*ps):
    r = ps[0]
    for q in ps[1:]:
        r = op(r, q, PathOp.UNION)
    return r


def D(a, *bs):
    for b in bs:
        a = op(a, b, PathOp.DIFFERENCE)
    return a


def I(a, b):
    return op(a, b, PathOp.INTERSECTION)


GRAND = 4000


def dessus(y):
    return rect(-GRAND, y, GRAND, GRAND)


def dessous(y):
    return rect(-GRAND, -GRAND, GRAND, y)


def droite_de(x):
    return rect(x, -GRAND, GRAND, GRAND)


def gauche_de(x):
    return rect(-GRAND, -GRAND, x, GRAND)


def demi_plan(x, y, angle, cote):
    """Demi-plan au-dessus (cote=+1) ou au-dessous (cote=-1) de la droite
    qui passe par (x, y) avec l'angle donné (degrés)."""
    t = math.tan(math.radians(angle))
    x0, x1 = x - GRAND, x + GRAND
    y0, y1 = y - GRAND * t, y + GRAND * t
    if cote > 0:
        return poly([(x0, y0), (x1, y1), (x1, y1 + 2 * GRAND), (x0, y0 + 2 * GRAND)])
    return poly([(x0, y0), (x1, y1), (x1, y1 - 2 * GRAND), (x0, y0 - 2 * GRAND)])


def diag(p0, p1, epaisseur):
    """Trait diagonal à bouts horizontaux, d'épaisseur perpendiculaire donnée."""
    (x0, y0), (x1, y1) = p0, p1
    ang = math.atan2(abs(y1 - y0), abs(x1 - x0))
    w = epaisseur / max(math.sin(ang), 0.2)
    return poly([(x0 - w / 2, y0), (x0 + w / 2, y0), (x1 + w / 2, y1), (x1 - w / 2, y1)])


def deplace(p, dx, dy, sx=1, sy=1):
    q = Path()
    p.draw(TransformPen(q.getPen(), (sx, 0, 0, sy, dx, dy)))
    return q


def svg_d(p):
    pen = SVGPathPen(None)
    p.draw(pen)
    return pen.getCommands()


# ------------------------------------------------------------ styles
class Style:
    def __init__(self, nom, k_ext, k_int, coupe, point_k, t_coupe):
        self.nom, self.k_ext, self.k_int = nom, k_ext, k_int
        self.coupe = coupe          # angle des coupes de terminaisons (0 = horizontal)
        self.point_k = point_k      # tension des points (0,552 = rond)
        self.t_coupe = t_coupe      # angle de la coupe en haut du t


TENDUE = Style('Tendue', 0.70, 0.76, 0, 0.74, 45)
ELAN = Style('Élan', 0.575, 0.585, 20, 0.552, 20)


class Lettres:
    def __init__(self, st, V):
        self.st, self.V = st, V
        self.H = round(0.84 * V)
        self.gras = V - 86                     # élargissement avec la graisse
        self.g = {}

    # -- briques
    def anneau(self, cx, cy, rx, ry, V=None, H=None):
        V, H = V or self.V, H or self.H
        return D(boite(cx, cy, rx, ry, self.st.k_ext), boite(cx, cy, rx - V, ry - H, self.st.k_int))

    def point(self, cx, cy, taille):
        return boite(cx, cy, taille / 2, taille / 2, self.st.point_k)

    def ouverture(self, x, y_haut, y_bas, x_paroi=None):
        """Zone à retirer à droite de x, entre deux coupes de terminaison.
        Les coupes sont ancrées sur la paroi (x_paroi) : c'est là que la
        terminaison doit tomber à la hauteur voulue, quelle que soit l'inclinaison."""
        a = self.st.coupe
        xp = x_paroi if x_paroi is not None else x
        return I(I(droite_de(x), demi_plan(xp, y_bas, a, +1)), demi_plan(xp, y_haut, a, -1))

    # -- bols (x = hauteur d'x)
    def rx_o(self):
        return 262 + self.gras * 0.5

    def bol_fut(self, x_fut, cote, y0, y1, rx=None, e_ext=0.50, e_int=0.08):
        """Bol accroché à un fût (b d p q a g). cote = +1 : bol à droite du fût.
        Le contour extérieur du bol plonge dans le fût (e_ext) : la jonction
        s'affine et une petite encoche se forme là où le bol rejoint le fût."""
        V, H = self.V, self.H
        rx = rx or self.rx_o() * 0.95
        ry, cy = XH / 2 + OS, XH / 2
        if cote < 0:
            xr_ext = x_fut + e_ext * V
            xl_ext = xr_ext - 2 * rx
            xl_int, xr_int = xl_ext + V, x_fut + e_int * V
        else:
            xl_ext = x_fut + V - e_ext * V
            xr_ext = xl_ext + 2 * rx
            xl_int, xr_int = x_fut + V - e_int * V, xr_ext - V
        ext = boite((xl_ext + xr_ext) / 2, cy, (xr_ext - xl_ext) / 2, ry, self.st.k_ext)
        inte = boite((xl_int + xr_int) / 2, cy, (xr_int - xl_int) / 2, ry - H, self.st.k_int)
        fut = rect(x_fut, y0, x_fut + V, y1)
        return U(fut, D(ext, inte)), (xl_ext + xr_ext) / 2, rx

    def arche(self, x0, x1, y_bas=0, haut=None):
        """Arche de n entre le fût gauche (x0) et le bord droit (x1)."""
        V, H = self.V, self.H
        haut = haut or XH + OS * 0.5
        yc = XH * 0.40
        xg_ext, xg_int = x0 + V * 0.42, x0 + V * 0.80
        ext = U(I(boite((xg_ext + x1) / 2, yc, (x1 - xg_ext) / 2, haut - yc, self.st.k_ext), dessus(yc)),
                rect(x1 - V, y_bas, x1, yc + 1))
        inte = U(I(boite((xg_int + x1 - V) / 2, yc, (x1 - V - xg_int) / 2, haut - H - yc, self.st.k_int), dessus(yc)),
                 rect(xg_int, y_bas - 50, x1 - V, yc + 1))
        return D(ext, inte)

    # -- minuscules
    def construire(self):
        V, H, st, g = self.V, self.H, self.st, self.g
        R = self.rx_o()
        cy, ry = XH / 2, XH / 2 + OS

        g['o'] = self.anneau(R, cy, R, ry)

        rc = R * 0.93
        g['c'] = D(self.anneau(rc, cy, rc, ry), self.ouverture(rc + rc * 0.05, cy + ry * 0.30, cy - ry * 0.34, 2 * rc))

        re_ = R * 0.97
        yb = cy + ry * 0.07
        hb = H * 0.94
        barre = rect(V * 0.4, yb - hb / 2, 2 * re_ - V * 0.4, yb + hb / 2)
        ouv = I(self.ouverture(re_ + re_ * 0.02, yb - hb / 2 + (GRAND if st.coupe else 0), cy - ry * 0.30, 2 * re_), dessous(yb - hb / 2))
        g['e'] = U(D(self.anneau(re_, cy, re_, ry), ouv), barre)

        # s : deux anneaux empilés, le bas un peu plus large
        rxl = R * 0.80
        rxu = rxl * 0.94
        ryl = (XH + 2 * OS + H) / 2 / 1.94
        ryu = 0.94 * ryl
        cyu, cyl = XH + OS - ryu, -OS + ryl
        cxs = rxl
        haut = I(self.anneau(cxs, cyu, rxu, ryu), U(dessus(cyu), gauche_de(cxs)))
        haut = D(haut, I(self.ouverture(cxs + rxu * 0.08, cyu + ryu * 0.02, cyu - ryu * 2), dessous(cyu + ryu * 0.02)))
        bas = I(self.anneau(cxs, cyl, rxl, ryl), U(dessous(cyl), droite_de(cxs)))
        a = st.coupe
        coupe_bas = I(I(gauche_de(cxs - rxl * 0.08), demi_plan(cxs - rxl * 0.08, cyl - ryl * 0.02, a, +1)), dessus(-GRAND))
        bas = D(bas, coupe_bas)
        g['s'] = U(haut, bas)

        # fûts
        g['l'] = rect(0, 0, V, ASC)
        taille_point = V * 1.16
        g['i'] = U(rect(0, 0, V, XH), self.point(V / 2, XH + 150 + taille_point / 2 - 10, taille_point))

        # n m h u r
        wn = 468 + self.gras
        g['n'] = U(rect(0, 0, V, XH), self.arche(0, wn))
        g['h'] = U(rect(0, 0, V, ASC), self.arche(0, wn))
        u = U(rect(0, 0, V, XH), self.arche(0, wn))
        g['u'] = deplace(u, wn, XH, -1, -1)
        wm = 736 + self.gras * 1.6
        mid = wm / 2 + V / 2
        g['m'] = U(rect(0, 0, V, XH), self.arche(0, mid), self.arche(mid - V, wm))
        wr = 300 + self.gras * 0.6
        r_arche = I(self.arche(0, wr + 140), gauche_de(wr))
        if st.coupe:
            r_arche = I(r_arche, demi_plan(wr - 30, XH * 0.6, 90 - st.coupe, +1))
        g['r'] = U(rect(0, 0, V, XH), r_arche)

        # bols avec fût : d b p q a g
        wbol = 2 * R * 0.95
        d_, _, _ = self.bol_fut(wbol - V * 0.5, -1, 0, ASC)
        g['d'] = d_
        a_, _, _ = self.bol_fut(wbol - V * 0.5, -1, 0, XH)
        g['a'] = a_
        q_, _, _ = self.bol_fut(wbol - V * 0.5, -1, DSC, XH)
        g['q'] = q_
        b_, _, _ = self.bol_fut(0, +1, 0, ASC)
        g['b'] = b_
        p_, _, _ = self.bol_fut(0, +1, DSC, XH)
        g['p'] = p_
        # g : q dont le fût se termine par un crochet
        xf = wbol - V * 0.5
        corps, cxg, rxg = self.bol_fut(xf, -1, DSC + 150, XH)
        rxh = (xf + V - 18) / 2
        ryh = 150 + 12
        cyh = DSC + ryh - OS
        crochet = I(self.anneau(xf + V - rxh, cyh + 30, rxh, ryh + 30), dessous(cyh + 30))
        term = I(gauche_de(xf + V - rxh), demi_plan(xf + V - rxh, cyh + 30, -st.coupe, +1))
        crochet = D(crochet, I(term, dessus(cyh + 30 - 4)))
        g['g'] = U(corps, crochet)

        # t
        xt = 118
        ht = XH + 176
        tige = D(rect(xt, 0, xt + V, ht), demi_plan(xt, ht - V * math.tan(math.radians(st.t_coupe)), st.t_coupe, +1))
        g['t'] = U(tige, rect(0, XH - H, xt + V + 150, XH))

        # k
        wk = 420 + self.gras * 0.7
        yj = XH * 0.36
        bras = diag((V * 0.6, yj), (wk - 62, XH), V * 0.96)
        jambe = diag((V + 70, yj + 70), (wk - 36, 0), V * 1.02)
        g['k'] = U(rect(0, 0, V, ASC), I(U(bras, jambe), I(dessus(0), dessous(XH))))

        # v
        wv = 470 + self.gras * 0.8
        dh = V * 1.14
        f = V * 0.36
        xc = wv / 2
        # intersection des bords intérieurs
        pente = XH / (xc - f)
        y_int = XH - (xc - dh) * pente
        g['v'] = poly([(0, XH), (dh, XH), (xc, y_int), (wv - dh, XH), (wv, XH), (xc + f, 0), (xc - f, 0)])

        # ponctuation
        tp = V * 1.16
        g['.'] = self.point(tp / 2, tp / 2, tp)
        g[','] = U(self.point(tp / 2, tp / 2, tp), diag((tp * 0.62, tp * 0.35), (tp * 0.12, -150), V * 0.72))
        g[':'] = U(self.point(tp / 2, tp / 2, tp), self.point(tp / 2, XH - tp / 2, tp))

        # capitales
        Vc, Hc = V * 1.05, H * 1.04
        g['O'] = self.anneau(338 + self.gras * 0.6, CAP / 2, 338 + self.gras * 0.6, CAP / 2 + OSC, Vc, Hc)
        g['T'] = U(rect(0, CAP - Hc, 560, CAP), rect(280 - Vc / 2, 0, 280 + Vc / 2, CAP))
        wE = 440 + self.gras * 0.4
        g['E'] = U(rect(0, 0, Vc, CAP), rect(0, CAP - Hc, wE, CAP), rect(0, CAP * 0.5 - Hc / 2, wE * 0.9, CAP * 0.5 + Hc / 2), rect(0, 0, wE, Hc))

        def bol_cap(ybas, xb):
            cyb, ryb = (CAP + ybas) / 2, (CAP - ybas) / 2
            rxb = min(ryb * 1.05, xb - Vc * 1.2)
            cxb = xb - rxb
            ext = U(I(boite(cxb, cyb, rxb, ryb, st.k_ext), droite_de(cxb)), rect(0, ybas, cxb + 1, CAP))
            inte = U(I(boite(cxb, cyb, rxb - Vc, ryb - Hc, st.k_int), droite_de(cxb)), rect(Vc, ybas + Hc, cxb + 1, CAP - Hc))
            return D(ext, inte), cxb

        bolP, _ = bol_cap(CAP * 0.40, 470 + self.gras * 0.5)
        g['P'] = U(rect(0, 0, Vc, CAP), bolP)
        ybR = CAP * 0.44
        bolR, cxR = bol_cap(ybR, 470 + self.gras * 0.5)
        wR = 520 + self.gras * 0.6
        jambeR = I(diag((cxR - 20, ybR + Hc / 2), (wR - 60, 0), Vc * 1.02), dessous(ybR + Hc * 0.6))
        g['R'] = U(rect(0, 0, Vc, CAP), bolR, I(jambeR, dessus(0)))
        wM = 720 + self.gras
        dM = Vc * 0.92
        g['M'] = U(rect(0, 0, Vc, CAP), rect(wM - Vc, 0, wM, CAP),
                   I(U(diag((Vc * 0.5 + 40, CAP), (wM / 2, 0), dM), diag((wM - Vc * 0.5 - 40, CAP), (wM / 2, 0), dM)), I(dessus(0), dessous(CAP))))

        # accents (posés plus tard sur a et e)
        self.aigu = diag((0, XH + 118), (110, XH + 250), V * 0.82)
        self.grave = diag((110, XH + 118), (0, XH + 250), V * 0.82)
        return g

    # approches : gauche, droite (types : f = fût, r = rond, o = ouvert, d = diagonale)
    APPROCHES = {
        'o': 'rr', 'c': 'ro', 'e': 'rr', 's': 'rr', 'l': 'ff', 'i': 'ff', 'n': 'ff', 'h': 'ff', 'u': 'ff', 'm': 'ff',
        'r': 'fo', 'd': 'rf', 'a': 'rf', 'q': 'rf', 'b': 'fr', 'p': 'fr', 'g': 'rf', 't': 'oo', 'k': 'fd', 'v': 'dd',
        '.': 'pp', ',': 'pp', ':': 'pp', 'O': 'rr', 'T': 'oo', 'E': 'fo', 'P': 'fr', 'R': 'fd', 'M': 'ff',
    }

    def espaces(self):
        base = {'f': 62, 'r': 40, 'o': 22, 'd': 14, 'p': 50}
        k = 1 + self.gras / 400
        return {c: v * k for c, v in base.items()}

    def jeu(self):
        """Renvoie {caractère: (d SVG, chasse)} prêt à composer."""
        g = self.construire()
        sp = self.espaces()
        out = {}
        for c, p in g.items():
            x0, y0, x1, y1 = p.bounds
            gauche, droite = self.APPROCHES[c]
            chasse = sp[gauche] + (x1 - x0) + sp[droite]
            q = deplace(p, sp[gauche] - x0, 0)
            out[c] = (q, chasse)
        for base, acc, nom in (('e', self.aigu, 'é'), ('e', self.grave, 'è'), ('a', self.grave, 'à')):
            p, chasse = out[base]
            x0, _, x1, _ = p.bounds
            ax0, _, ax1, _ = acc.bounds
            dx = (x0 + x1) / 2 - (ax0 + ax1) / 2
            out[nom] = (U(p, deplace(acc, dx, 0)), chasse)
        out[' '] = (Path(), 232 + self.gras * 0.4)
        return {c: (svg_d(p), ch) for c, (p, ch) in out.items()}


# ------------------------------------------------------------ composition
def compose(jeu, texte, corps_px, largeur_px=None, couleur='#1C0CB3', interligne=1.45, approche=0):
    """Compose un texte (retour à la ligne automatique) en SVG."""
    s = corps_px / 1000
    lignes, courante, largeur = [], [], 0.0
    # espace insécable fine avant : ; ? ! (typographie française, jamais de coupure)
    for signe in ':;?!':
        texte = texte.replace(' ' + signe, '\u00a0' + signe)
    mots = texte.split(' ')
    esp = jeu[' '][1]
    jeu = dict(jeu)
    jeu['\u00a0'] = ('', esp * 0.55)

    def chasse_mot(m):
        return sum(jeu[c][1] + approche for c in m if c in jeu)

    for m in mots:
        w = chasse_mot(m)
        ajout = w if not courante else esp + w
        if largeur_px and courante and (largeur + ajout) * s > largeur_px:
            lignes.append(courante)
            courante, largeur = [m], w
        else:
            courante.append(m)
            largeur += ajout
    if courante:
        lignes.append(courante)
    pas = 1000 * interligne
    morceaux, larg_max = [], 0
    for i, ligne in enumerate(lignes):
        x = 0.0
        y = -(i * pas)
        for j, m in enumerate(ligne):
            if j:
                x += esp
            for c in m:
                if c not in jeu:
                    continue
                d, ch = jeu[c]
                if d:
                    morceaux.append(f'<path transform="translate({x:.1f} {y:.1f})" d="{d}"/>')
                x += ch + approche
        larg_max = max(larg_max, x)
    haut_u = ASC + 40
    bas_u = -(len(lignes) - 1) * pas + DSC - 40
    w_px = (largeur_px if largeur_px else larg_max * s) + 2
    h_px = (haut_u - bas_u) * s
    return (f'<svg class="spec" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w_px / s:.0f} {haut_u - bas_u:.0f}" width="{w_px:.0f}" height="{h_px:.0f}" role="img" aria-label="{texte[:80]}">'
            f'<g fill="{couleur}" transform="translate(0 {haut_u}) scale(1 -1)">{"".join(morceaux)}</g></svg>')


if __name__ == '__main__':
    lignes = []
    for st in (TENDUE, ELAN):
        for V in (86, 112):
            jeu = Lettres(st, V).jeu()
            lignes.append(f'<p style="margin:6px 0 2px;font:12px system-ui">{st.nom} · fût {V}</p>' + compose(jeu, 'Reskope abcdeghiklmnopqrstuv OTEPRM éèà ., :', 64))
            lignes.append(compose(jeu, 'On vous aide à décider, et on construit la suite. Reskope accompagne les dirigeants de TPE et de PME : on regarde vos outils, on comprend vos clients, puis on choisit ensemble ce qui compte vraiment.', 18, 760, couleur='#16123a'))
    open('sans.html', 'w', encoding='utf-8').write('<!doctype html><meta charset="utf-8"><body style="margin:20px;background:#F0EEE8">' + ''.join(lignes) + '</body>')
    print('ok')
