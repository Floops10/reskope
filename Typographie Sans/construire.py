"""Reskope Sans (caractère « Tendue ») : construction de la police complète.

Chaque lettre est assemblée à partir de formes simples (fûts, bols en
super-ellipse, diagonales), combinées par opérations booléennes
(skia-pathops). La graisse est réglée par l'épaisseur du fût : toutes les
graisses sortent du même code.

Particularités : courbes tendues entre le cercle et le carré, coupes
horizontales, jonctions affinées avec une petite encoche, t coupé à 45°,
points légèrement carrés, chiffres à chasse fixe.

Lancer (Python avec skia-pathops, fontTools, brotli) :
    python construire.py            → polices dans ./polices et ../public/fonts
    python construire.py --planche  → planche de contrôle (planche.html)

Unités : 1000 par cadratin, ligne de base y = 0, y vers le haut.
"""
import math
import os
import sys

from pathops import Path, op, PathOp
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.areaPen import AreaPen

XH, ASC, CAP, DSC = 516, 742, 700, -216
OS, OSC = 12, 14
K_E, K_I, K_POINT = 0.70, 0.76, 0.74
AXE = 300                      # axe des signes mathématiques et des flèches

GRAISSES = {                   # nom : (poids CSS, épaisseur du fût)
    'Light': (300, 64),
    'Regular': (400, 86),
    'Medium': (500, 99),
    'SemiBold': (600, 112),
    'Bold': (700, 128),
}

# ------------------------------------------------------------------ formes
GRAND = 5000


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


def boite(cx, cy, rx, ry, k=K_E):
    """Super-ellipse en quatre cubiques (k = 0,552 : cercle ; plus grand : plus tendu)."""
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


def I(a, *bs):
    for b in bs:
        a = op(a, b, PathOp.INTERSECTION)
    return a


def dessus(y):
    return rect(-GRAND, y, GRAND, GRAND)


def dessous(y):
    return rect(-GRAND, -GRAND, GRAND, y)


def droite_de(x):
    return rect(x, -GRAND, GRAND, GRAND)


def gauche_de(x):
    return rect(-GRAND, -GRAND, x, GRAND)


def bande_y(y0, y1):
    return rect(-GRAND, y0, GRAND, y1)


def diag(p0, p1, e):
    """Trait droit entre deux points, bouts horizontaux, épaisseur perpendiculaire e."""
    (x0, y0), (x1, y1) = p0, p1
    ang = math.atan2(abs(y1 - y0), abs(x1 - x0))
    w = e / max(math.sin(ang), 0.25)
    return poly([(x0 - w / 2, y0), (x0 + w / 2, y0), (x1 + w / 2, y1), (x1 - w / 2, y1)])


def barre(p0, p1, e):
    """Trait droit à bouts perpendiculaires (pour l'astérisque, les flèches)."""
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0)
    nx, ny = -(y1 - y0) / L * e / 2, (x1 - x0) / L * e / 2
    return poly([(x0 + nx, y0 + ny), (x1 + nx, y1 + ny), (x1 - nx, y1 - ny), (x0 - nx, y0 - ny)])


def transforme(p, a, b, c, d, e, f):
    q = Path()
    p.draw(TransformPen(q.getPen(), (a, b, c, d, e, f)))
    return q


def deplace(p, dx, dy):
    return transforme(p, 1, 0, 0, 1, dx, dy)


def tourne(p, deg, cx, cy):
    t = math.radians(deg)
    c, s = math.cos(t), math.sin(t)
    return transforme(p, c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy)


def miroir_x(p, axe):
    return transforme(p, -1, 0, 0, 1, 2 * axe, 0)


def vide():
    return Path()


# ------------------------------------------------------------------ dessin
class Tendue:
    def __init__(self, V):
        self.V = V
        self.H = round(0.84 * V)
        self.g = V - 86                           # élargissement avec la graisse
        self.Vc, self.Hc = V * 1.05, round(0.84 * V) * 1.04
        self.tp = V * 1.16                        # taille des points

    # --- briques
    def anneau(self, cx, cy, rx, ry, V=None, H=None):
        V = self.V if V is None else V
        H = self.H if H is None else H
        return D(boite(cx, cy, rx, ry, K_E), boite(cx, cy, rx - V, ry - H, K_I))

    def point(self, cx, cy, taille=None):
        t = taille or self.tp
        return boite(cx, cy, t / 2, t / 2, K_POINT)

    def R(self):
        return 262 + self.g * 0.5

    def bol_fut(self, x_fut, cote, y0, y1, rx=None, V=None, H=None, ybas=None, yhaut=None):
        """Bol accroché à un fût. cote = +1 : bol à droite. Le contour extérieur
        plonge dans le fût : la jonction s'affine et une encoche se forme."""
        V = self.V if V is None else V
        H = self.H if H is None else H
        rx = rx or self.R() * 0.95
        ybas = -OS if ybas is None else ybas
        yhaut = XH + OS if yhaut is None else yhaut
        cy, ry = (ybas + yhaut) / 2, (yhaut - ybas) / 2
        e_ext, e_int = 0.50, 0.08
        if cote < 0:
            xr_ext = x_fut + e_ext * V
            xl_ext = xr_ext - 2 * rx
            xl_int, xr_int = xl_ext + V, x_fut + e_int * V
        else:
            xl_ext = x_fut + V - e_ext * V
            xr_ext = xl_ext + 2 * rx
            xl_int, xr_int = x_fut + V - e_int * V, xr_ext - V
        ext = boite((xl_ext + xr_ext) / 2, cy, (xr_ext - xl_ext) / 2, ry, K_E)
        inte = boite((xl_int + xr_int) / 2, cy, (xr_int - xl_int) / 2, ry - H, K_I)
        return U(rect(x_fut, y0, x_fut + V, y1), D(ext, inte))

    def arche(self, x0, x1, haut=None, V=None, H=None):
        """Arche de n entre le fût gauche (x0) et le bord droit (x1)."""
        V = self.V if V is None else V
        H = self.H if H is None else H
        haut = haut or XH + OS * 0.5
        yc = XH * 0.40
        xg_ext, xg_int = x0 + V * 0.42, x0 + V * 0.80
        ext = U(I(boite((xg_ext + x1) / 2, yc, (x1 - xg_ext) / 2, haut - yc, K_E), dessus(yc)),
                rect(x1 - V, 0, x1, yc + 1))
        inte = U(I(boite((xg_int + x1 - V) / 2, yc, (x1 - V - xg_int) / 2, haut - H - yc, K_I), dessus(yc)),
                 rect(xg_int, -60, x1 - V, yc + 1))
        return D(ext, inte)

    def bol_cap(self, ybas, yhaut, xb):
        """Panse de capitale (B D P R) : plate contre le fût, tendue à droite."""
        Vc, Hc = self.Vc, self.Hc
        cyb, ryb = (yhaut + ybas) / 2, (yhaut - ybas) / 2
        rxb = min(ryb * 1.05, xb - Vc * 1.2)
        cxb = xb - rxb
        ext = U(I(boite(cxb, cyb, rxb, ryb, K_E), droite_de(cxb)), rect(0, ybas, cxb + 1, yhaut))
        inte = U(I(boite(cxb, cyb, rxb - Vc, ryb - Hc, K_I), droite_de(cxb)), rect(Vc, ybas + Hc, cxb + 1, yhaut - Hc))
        return D(ext, inte), cxb

    def en_v(self, w, h, dh, f, y0=0):
        """V pointu à fond plat (v, V, et les deux moitiés de w/W)."""
        xc = w / 2
        pente = h / (xc - f)
        y_int = h - (xc - dh) * pente
        return deplace(poly([(0, h), (dh, h), (xc, y_int), (w - dh, h), (w, h), (xc + f, 0), (xc - f, 0)]), 0, y0)

    # --- accents (posés sur l'axe x = 0)
    def aigu(self, cap=False):
        V = self.V
        if cap:
            return diag((-50, CAP + 64), (62, CAP + 178), V * 0.80)
        return diag((-52, XH + 118), (58, XH + 250), V * 0.82)

    def grave(self, cap=False):
        return miroir_x(self.aigu(cap), 0)

    def circonflexe(self, cap=False):
        V = self.V
        y0, y1, w = (CAP + 64, CAP + 176, 118) if cap else (XH + 118, XH + 244, 120)
        return I(U(diag((-w, y0), (0, y1), V * 0.78), diag((w, y0), (0, y1), V * 0.78)), dessous(y1))

    def trema(self, cap=False):
        y = CAP + 120 if cap else XH + 176
        t = self.tp * 0.96
        return U(self.point(-105, y, t), self.point(105, y, t))

    def cedille(self):
        V, H = self.V, self.H
        tige = rect(-V * 0.36, -78, V * 0.36, 30)
        crochet = I(self.anneau(8, -146, 96, 76, V * 0.74, H * 0.74), U(droite_de(8), dessous(-146)))
        return U(tige, D(crochet, gauche_de(-118)))

    # --- dessin de tous les glyphes
    def glyphes(self):
        V, H, g, Vc, Hc, tp = self.V, self.H, self.g, self.Vc, self.Hc, self.tp
        G = {}
        R = self.R()
        cy, ry = XH / 2, XH / 2 + OS

        # ---------------- minuscules
        G['o'] = self.anneau(R, cy, R, ry)
        rc = R * 0.93
        G['c'] = D(self.anneau(rc, cy, rc, ry), rect(rc * 1.05, cy - ry * 0.34, GRAND, cy + ry * 0.30))
        re_ = R * 0.97
        yb, hb = cy + ry * 0.07, H * 0.94
        G['e'] = U(D(self.anneau(re_, cy, re_, ry), rect(re_ * 1.02, cy - ry * 0.30, GRAND, yb - hb / 2)),
                   rect(V * 0.4, yb - hb / 2, 2 * re_ - V * 0.4, yb + hb / 2))

        def s_forme(h, larg, V_, H_, os_):
            rxl = larg / 2
            rxu = rxl * 0.94
            ryl = (h + 2 * os_ + H_) / 2 / 1.94
            ryu = 0.94 * ryl
            cyu, cyl = h + os_ - ryu, -os_ + ryl
            cxs = rxl
            haut = I(self.anneau(cxs, cyu, rxu, ryu, V_, H_), U(dessus(cyu), gauche_de(cxs)))
            haut = D(haut, rect(cxs + rxu * 0.08, cyu - ryu * 2, GRAND, cyu + ryu * 0.02))
            bas = I(self.anneau(cxs, cyl, rxl, ryl, V_, H_), U(dessous(cyl), droite_de(cxs)))
            bas = D(bas, rect(-GRAND, cyl - ryl * 0.02, cxs - rxl * 0.08, GRAND))
            return U(haut, bas)

        G['s'] = s_forme(XH, 2 * R * 0.80, V, H, OS)

        wbol = 2 * R * 0.95
        xd = wbol - V * 0.5
        G['d'] = self.bol_fut(xd, -1, 0, ASC)
        G['a'] = self.bol_fut(xd, -1, 0, XH)
        G['q'] = self.bol_fut(xd, -1, DSC, XH)
        G['b'] = self.bol_fut(0, +1, 0, ASC)
        G['p'] = self.bol_fut(0, +1, DSC, XH)
        corps = self.bol_fut(xd, -1, DSC + 150, XH)
        rxh, ryh = (xd + V - 18) / 2, 150 + 12
        cyh = DSC + ryh - OS
        crochet = I(self.anneau(xd + V - rxh, cyh + 30, rxh, ryh + 30), dessous(cyh + 30))
        crochet = D(crochet, rect(-GRAND, cyh + 26, xd + V - rxh, GRAND))
        G['g'] = U(corps, crochet)

        G['l'] = rect(0, 0, V, ASC)
        G['ı'] = rect(0, 0, V, XH)
        G['i'] = U(G['ı'], self.point(V / 2, XH + 140 + tp / 2))
        xj = 150 + g * 0.4
        rxj, ryj = xj + V * 0.5, 138
        cyj = DSC + ryj - OS * 0.5
        hj = D(I(self.anneau(xj + V - rxj, cyj, rxj, ryj), dessous(cyj)), gauche_de(xj + V - rxj - 70))
        G['ȷ'] = U(rect(xj, cyj - 1, xj + V, XH), hj)
        G['j'] = U(G['ȷ'], self.point(xj + V / 2, XH + 140 + tp / 2))

        wn = 468 + g
        G['n'] = U(rect(0, 0, V, XH), self.arche(0, wn))
        G['h'] = U(rect(0, 0, V, ASC), self.arche(0, wn))
        G['u'] = transforme(G['n'], -1, 0, 0, -1, wn, XH)
        wm = 736 + g * 1.6
        mid = wm / 2 + V / 2
        G['m'] = U(rect(0, 0, V, XH), self.arche(0, mid), self.arche(mid - V, wm))
        wr = 300 + g * 0.6
        G['r'] = U(rect(0, 0, V, XH), I(self.arche(0, wr + 140), gauche_de(wr)))

        xt, ht = 118 + g * 0.2, XH + 176
        tige = D(rect(xt, 0, xt + V, ht), poly([(xt - 1, ht - V), (xt + V + 1, ht + 1), (xt - 1, ht + 1)]))
        G['t'] = U(tige, rect(0, XH - H, xt + V + 150 + g * 0.3, XH))

        # f : fût, crochet en haut coupé droit, barre à hauteur d'x
        xf = 110 + g * 0.2
        rxf, ryf = 150 + g * 0.35, 150
        cyf = ASC + OS * 0.4 - ryf
        crochet_f = D(I(self.anneau(xf + rxf, cyf, rxf, ryf), dessus(cyf)), droite_de(xf + V + 150 + g * 0.3))
        G['f'] = U(rect(xf, 0, xf + V, cyf + 1), crochet_f, rect(0, XH - H, xf + V + 150 + g * 0.3, XH))

        wk = 420 + g * 0.7
        yj = XH * 0.36
        bras = diag((V * 0.6, yj), (wk - 62, XH), V * 0.96)
        jambe = diag((V + 70, yj + 70), (wk - 36, 0), V * 1.02)
        G['k'] = U(rect(0, 0, V, ASC), I(U(bras, jambe), bande_y(0, XH)))

        wv, dh, f = 470 + g * 0.8, V * 1.14, V * 0.36
        G['v'] = self.en_v(wv, XH, dh, f)
        ww = 736 + g * 1.4
        e_w = V * 0.98
        b1, b2, t1 = ww * 0.265, ww * 0.735, ww * 0.5
        G['w'] = I(U(diag((e_w * 0.55, XH), (b1, 0), e_w), diag((b1, 0), (t1, XH), e_w * 0.92),
                     diag((t1, XH), (b2, 0), e_w * 0.92), diag((b2, 0), (ww - e_w * 0.55, XH), e_w)), bande_y(0, XH))
        wx = 456 + g * 0.8
        G['x'] = I(U(diag((V * 0.52, XH), (wx - V * 0.52, 0), V * 1.0), diag((wx - V * 0.52, XH), (V * 0.52, 0), V * 0.94)), bande_y(0, XH))
        wy = 470 + g * 0.8
        px, xm = wy - dh / 2 * 0.95, wy / 2 + V * 0.05
        x_q = px + (xm - px) * (XH - DSC) / XH
        G['y'] = I(U(diag((dh / 2 * 0.95, XH), (xm, 0), V * 1.0), diag((px, XH), (x_q, DSC), V * 1.02)), bande_y(DSC, XH))
        wz = 420 + g * 0.7
        G['z'] = U(rect(0, XH - H, wz, XH), rect(0, 0, wz, H), I(diag((wz - V * 0.62, XH - H), (V * 0.62, H), V * 0.98), bande_y(H - 1, XH - H + 1)))

        # œ : o + e qui partagent une paroi
        ro = R * 0.92
        o_g = self.anneau(ro, cy, ro, ry)
        e_d = deplace(G['e'], 2 * ro - V, 0)
        G['œ'] = U(o_g, e_d)

        # ---------------- capitales
        cyC, ryC = CAP / 2, CAP / 2 + OSC
        rO = 338 + g * 0.6
        G['O'] = self.anneau(rO, cyC, rO, ryC, Vc, Hc)
        G['Q'] = U(G['O'], I(diag((rO + rO * 0.18, cyC - ryC * 0.42), (2 * rO + 24, -70), Vc * 0.96), dessus(-70)))
        rCc = 318 + g * 0.6
        G['C'] = D(self.anneau(rCc, cyC, rCc, ryC, Vc, Hc), rect(rCc * 1.05, cyC - ryC * 0.30, GRAND, cyC + ryC * 0.28))
        y_barG = cyC - ryC * 0.02
        G['G'] = U(D(self.anneau(rCc, cyC, rCc, ryC, Vc, Hc), rect(rCc * 1.05, y_barG, GRAND, cyC + ryC * 0.28)),
                   rect(rCc + 30, y_barG - Hc, 2 * rCc, y_barG))
        wH = 590 + g
        G['H'] = U(rect(0, 0, Vc, CAP), rect(wH - Vc, 0, wH, CAP), rect(0, CAP * 0.49 - Hc / 2, wH, CAP * 0.49 + Hc / 2))
        G['I'] = rect(0, 0, Vc, CAP)
        G['L'] = U(rect(0, 0, Vc, CAP), rect(0, 0, 430 + g * 0.4, Hc))
        wE = 440 + g * 0.4
        G['E'] = U(rect(0, 0, Vc, CAP), rect(0, CAP - Hc, wE, CAP), rect(0, CAP * 0.5 - Hc / 2, wE * 0.9, CAP * 0.5 + Hc / 2), rect(0, 0, wE, Hc))
        G['F'] = U(rect(0, 0, Vc, CAP), rect(0, CAP - Hc, wE, CAP), rect(0, CAP * 0.48 - Hc / 2, wE * 0.9, CAP * 0.48 + Hc / 2))
        wT = 560 + g * 0.6
        G['T'] = U(rect(0, CAP - Hc, wT, CAP), rect(wT / 2 - Vc / 2, 0, wT / 2 + Vc / 2, CAP))
        bolP, _ = self.bol_cap(CAP * 0.40, CAP, 470 + g * 0.5)
        G['P'] = U(rect(0, 0, Vc, CAP), bolP)
        ybR = CAP * 0.44
        bolR, cxR = self.bol_cap(ybR, CAP, 470 + g * 0.5)
        wR = 520 + g * 0.6
        jambeR = I(diag((cxR - 20, ybR + Hc / 2), (wR - 60, 0), Vc * 1.02), dessous(ybR + Hc * 0.6), dessus(0))
        G['R'] = U(rect(0, 0, Vc, CAP), bolR, jambeR)
        bolD, _ = self.bol_cap(0, CAP, 600 + g * 0.6)
        G['D'] = U(rect(0, 0, Vc, CAP), bolD)
        yB = CAP * 0.47
        bolB1, _ = self.bol_cap(yB - Hc / 2, CAP, 452 + g * 0.5)
        bolB2, _ = self.bol_cap(0, yB + Hc / 2, 500 + g * 0.5)
        G['B'] = U(rect(0, 0, Vc, CAP), bolB1, bolB2)
        wU = 600 + g
        cyU = CAP * 0.40
        fondU = I(self.anneau(wU / 2, cyU, wU / 2, cyU + OSC, Vc, Hc), dessous(cyU))
        G['U'] = U(rect(0, cyU - 1, Vc, CAP), rect(wU - Vc, cyU - 1, wU, CAP), fondU)
        wJ = 470 + g * 0.8
        cyJ = CAP * 0.36
        fondJ = D(I(self.anneau(wJ / 2, cyJ, wJ / 2, cyJ + OSC, Vc, Hc), dessous(cyJ)), rect(-GRAND, cyJ * 0.55, wJ * 0.18, GRAND))
        G['J'] = U(rect(wJ - Vc, cyJ - 1, wJ, CAP), fondJ)
        G['S'] = s_forme(CAP, 520 + g * 0.8, Vc, Hc, OSC)
        wA, fa, dA = 650 + g, Vc * 0.92, Vc * 1.16
        xcA = wA / 2
        h_ext = poly([(0, 0), (xcA - fa / 2, CAP), (xcA + fa / 2, CAP), (wA, 0)])
        # bords intérieurs parallèles aux extérieurs, décalés de dA
        xl0, xr0 = dA, wA - dA
        xl1, xr1 = xcA - fa / 2 + dA, xcA + fa / 2 - dA
        # intersection des deux bords intérieurs
        t_ = (xr0 - xl0) / ((xl1 - xl0) - (xr1 - xr0))
        yi = t_ * CAP
        xi = xl0 + t_ * (xl1 - xl0)
        A_corps = poly([(0, 0), (xcA - fa / 2, CAP), (xcA + fa / 2, CAP), (wA, 0), (xr0, 0), (xi, yi), (xl0, 0)])
        G['A'] = U(A_corps, I(rect(0, CAP * 0.27, wA, CAP * 0.27 + Hc), h_ext))
        wV = 632 + g
        G['V'] = self.en_v(wV, CAP, dA, fa / 2 * 0.95)
        wW = 920 + g * 1.4
        eW = Vc * 1.0
        b1, b2, t1 = wW * 0.26, wW * 0.74, wW * 0.5
        G['W'] = I(U(diag((eW * 0.55, CAP), (b1, 0), eW), diag((b1, 0), (t1, CAP), eW * 0.9),
                     diag((t1, CAP), (b2, 0), eW * 0.9), diag((b2, 0), (wW - eW * 0.55, CAP), eW)), bande_y(0, CAP))
        wX = 610 + g
        G['X'] = I(U(diag((Vc * 0.55, CAP), (wX - Vc * 0.55, 0), Vc * 1.02), diag((wX - Vc * 0.55, CAP), (Vc * 0.55, 0), Vc * 0.96)), bande_y(0, CAP))
        wY = 610 + g
        ymY = CAP * 0.42
        G['Y'] = U(I(U(diag((Vc * 0.55, CAP), (wY / 2, ymY), Vc * 1.0), diag((wY - Vc * 0.55, CAP), (wY / 2, ymY), Vc * 0.96)), bande_y(ymY - 40, CAP)),
                   rect(wY / 2 - Vc / 2, 0, wY / 2 + Vc / 2, ymY + 10))
        wZ = 550 + g * 0.8
        G['Z'] = U(rect(0, CAP - Hc, wZ, CAP), rect(0, 0, wZ, Hc), I(diag((wZ - Vc * 0.62, CAP - Hc), (Vc * 0.62, Hc), Vc * 1.0), bande_y(Hc - 1, CAP - Hc + 1)))
        wK = 590 + g
        yjK = CAP * 0.37
        G['K'] = U(rect(0, 0, Vc, CAP), I(U(diag((Vc * 0.6, yjK), (wK - 80, CAP), Vc * 0.98), diag((Vc + 96, yjK + 92), (wK - 44, 0), Vc * 1.04)), bande_y(0, CAP)))
        wM = 720 + g
        dM = Vc * 0.92
        G['M'] = U(rect(0, 0, Vc, CAP), rect(wM - Vc, 0, wM, CAP),
                   I(U(diag((Vc * 0.5 + 40, CAP), (wM / 2, 0), dM), diag((wM - Vc * 0.5 - 40, CAP), (wM / 2, 0), dM)), bande_y(0, CAP)))
        wN = 620 + g
        G['N'] = U(rect(0, 0, Vc, CAP), rect(wN - Vc, 0, wN, CAP), I(diag((Vc * 0.55, CAP), (wN - Vc * 0.55, 0), Vc * 0.96), bande_y(0, CAP)))
        rOE = 300 + g * 0.5
        wEe = 420 + g * 0.4
        G['Œ'] = U(I(self.anneau(rOE, cyC, rOE, ryC, Vc, Hc), gauche_de(rOE)), rect(rOE - 1, 0, rOE + Vc, CAP),
                   rect(rOE, CAP - Hc, rOE + wEe, CAP), rect(rOE, CAP * 0.5 - Hc / 2, rOE + wEe * 0.88, CAP * 0.5 + Hc / 2), rect(rOE, 0, rOE + wEe, Hc))

        # ---------------- chiffres (chasse fixe)
        r0x = 240 + g * 0.5
        G['0'] = self.anneau(r0x, cyC, r0x, ryC, V * 1.02, H * 1.02)
        x1 = 150 + g * 0.3
        G['1'] = U(rect(x1, 0, x1 + V * 1.02, CAP), I(diag((x1 - 118, CAP - 158), (x1 + V * 0.35, CAP), V * 0.92), dessous(CAP), gauche_de(x1 + V)))
        rx2, ry2 = 226 + g * 0.5, 196
        cy2 = CAP + OS - ry2
        arc2 = U(I(self.anneau(rx2, cy2, rx2, ry2), dessus(cy2)), I(self.anneau(rx2, cy2, rx2, ry2), droite_de(rx2), bande_y(cy2 - ry2 * 0.45, cy2)))
        G['2'] = U(arc2, I(diag((2 * rx2 - V * 0.62, cy2 - ry2 * 0.32), (V * 0.62, H * 0.5), V * 1.0), bande_y(H * 0.4, cy2)), rect(0, 0, 2 * rx2, H * 1.02))
        r3u, r3l = 205 + g * 0.5, 228 + g * 0.5
        ry3u, ry3l = 168, 196
        cy3u, cy3l = CAP + OS - ry3u, -OS + ry3l
        haut3 = D(self.anneau(r3l, cy3u, r3u, ry3u), rect(-GRAND, cy3u - ry3u * 2, r3l - r3u * 0.1, cy3u + ry3u * 0.18))
        bas3 = D(self.anneau(r3l, cy3l, r3l, ry3l), rect(-GRAND, cy3l - ry3l * 0.22, r3l - r3l * 0.1, GRAND))
        G['3'] = U(haut3, bas3)
        x4, yb4, w4 = 300 + g * 0.6, CAP * 0.25, 470 + g * 0.8
        G['4'] = U(rect(x4, 0, x4 + V, CAP), rect(0, yb4, w4, yb4 + H * 1.02), I(diag((x4 + V * 0.45, CAP), (V * 0.55, yb4 + H * 0.5), V * 0.94), bande_y(yb4, CAP), gauche_de(x4 + V)))
        r5x, r5y = 232 + g * 0.5, 212
        cy5 = -OS + r5y
        bol5 = D(self.anneau(r5x, cy5, r5x, r5y), rect(-GRAND, cy5 - r5y * 0.30, r5x * 0.9, cy5 + r5y * 0.46))
        x5 = 14
        G['5'] = U(bol5, rect(x5, cy5 + r5y * 0.30, x5 + V, CAP), rect(x5, CAP - H * 1.02, 2 * r5x - 10, CAP))
        r6x, r6y = 236 + g * 0.5, 222
        cy6 = -OS + r6y
        contre6 = boite(r6x, cy6, r6x - V, r6y - H, K_I)
        trait6 = D(I(diag((V * 0.55, cy6 + r6y * 0.05), (r6x + r6x * 0.42, CAP), V * 0.98), bande_y(cy6, CAP)), contre6)
        G['6'] = U(self.anneau(r6x, cy6, r6x, r6y), trait6)
        w7 = 470 + g * 0.8
        G['7'] = U(rect(0, CAP - H * 1.02, w7, CAP), I(diag((w7 - V * 0.62, CAP - H * 0.5), (w7 * 0.36, 0), V * 1.0), bande_y(0, CAP - H)))
        r8u, r8l = 206 + g * 0.5, 234 + g * 0.5
        ry8u, ry8l = 170, 200
        G['8'] = U(self.anneau(r8l, CAP + OS - ry8u, r8u, ry8u), self.anneau(r8l, -OS + ry8l, r8l, ry8l))
        G['9'] = transforme(G['6'], -1, 0, 0, -1, 2 * r6x, CAP)

        # ---------------- ponctuation et signes
        G['.'] = self.point(tp / 2, tp / 2)
        virg = U(self.point(tp / 2, tp / 2), diag((tp * 0.62, tp * 0.35), (tp * 0.12, -150), V * 0.72))
        G[','] = virg
        G[':'] = U(self.point(tp / 2, tp / 2), self.point(tp / 2, XH - tp / 2))
        G[';'] = U(virg, self.point(tp / 2, XH - tp / 2))
        G['!'] = U(rect(tp / 2 - V * 0.5, tp + 120, tp / 2 + V * 0.5, CAP), self.point(tp / 2, tp / 2))
        rq, ryq = 196 + g * 0.4, 170
        cyq = CAP + OS - ryq
        arcq = U(I(self.anneau(rq, cyq, rq, ryq), dessus(cyq)), I(self.anneau(rq, cyq, rq, ryq), droite_de(rq), bande_y(cyq - ryq, cyq)))
        G['?'] = U(arcq, rect(rq - V / 2, tp + 120, rq + V / 2, cyq - ryq + H), self.point(rq, tp / 2))
        G['¡'] = transforme(G['!'], 1, 0, 0, -1, 0, XH)
        hq = 230
        G["'"] = rect(0, CAP - hq, V * 0.84, CAP)
        G['"'] = U(rect(0, CAP - hq, V * 0.84, CAP), rect(V * 0.84 + 90, CAP - hq, 2 * V * 0.84 + 90, CAP))
        apos = deplace(virg, 0, CAP - tp + 8)
        G['’'] = apos
        G['‘'] = deplace(tourne(apos, 180, tp / 2, CAP - tp / 2 + 8), 0, -140)
        G['”'] = U(apos, deplace(apos, tp + 70, 0))
        G['“'] = U(G['‘'], deplace(G['‘'], tp + 70, 0))

        def chevron(w, h, e, y):
            return I(U(diag((w, y + h / 2), (0, y), e), diag((0, y), (w, y - h / 2), e)), bande_y(y - h / 2, y + h / 2))

        ch = chevron(170, 250, V * 0.82, XH * 0.5)
        G['«'] = U(ch, deplace(ch, 190, 0))
        G['»'] = miroir_x(G['«'], (170 + 190) / 2)
        G['‹'] = ch
        G['›'] = miroir_x(ch, 85)
        hp = ASC - DSC + 40
        rp = 150 + g * 0.2
        paren = I(self.anneau(rp * 1.9, (ASC + DSC) / 2, rp * 1.9, hp / 2, V * 0.94, H * 0.94), gauche_de(rp * 1.9 - 20))
        G['('] = paren
        G[')'] = miroir_x(paren, (rp * 1.9 - 20) / 2)
        cr = V * 0.92
        G['['] = U(rect(0, DSC - 20, cr, ASC + 20), rect(0, ASC + 20 - H, 170, ASC + 20), rect(0, DSC - 20, 170, DSC - 20 + H))
        G[']'] = miroir_x(G['['], 85)
        ym = (ASC + DSC) / 2
        acc = U(rect(90, ym + 40, 90 + cr, ASC + 20), rect(90, DSC - 20, 90 + cr, ym - 40), rect(0, ym - cr / 2, 90 + cr, ym + cr / 2),
                rect(90, ASC + 20 - H, 90 + cr + 110, ASC + 20), rect(90, DSC - 20, 90 + cr + 110, DSC - 20 + H))
        G['{'] = acc
        G['}'] = miroir_x(acc, (90 + cr + 110) / 2)
        yt = XH * 0.46
        G['-'] = rect(0, yt - H * 0.52, 260 + g * 0.5, yt + H * 0.52)
        G['–'] = rect(0, yt - H * 0.52, 500, yt + H * 0.52)
        G['—'] = rect(0, yt - H * 0.52, 940, yt + H * 0.52)
        G['_'] = rect(0, DSC + 10, 520, DSC + 10 + H)
        G['/'] = I(diag((V * 0.5, DSC + 10), (380 - V * 0.5, CAP + 40), V * 0.92), bande_y(DSC + 10, CAP + 40))
        G['\\'] = miroir_x(G['/'], 190)
        G['|'] = rect(0, DSC, V * 0.9, ASC + 20)
        # &
        rL, ryL = 226 + g * 0.5, 212
        cyL = -OS + ryL
        bas_e = D(self.anneau(rL, cyL, rL, ryL), rect(rL - 30, cyL + ryL * 0.08, GRAND, GRAND))
        rU_, ryU = 142 + g * 0.3, 128
        cxU, cyU2 = rL * 0.86, CAP + OS - ryU
        boucle = self.anneau(cxU, cyU2, rU_, ryU)
        jambe_e = I(diag((cxU - rU_ * 0.55, cyU2 - ryU * 0.72), (2 * rL + 60, 0), V * 1.0), bande_y(0, cyU2 - ryU * 0.5))
        G['&'] = U(bas_e, boucle, jambe_e)
        # @
        rA_ = 420 + g * 0.5
        cyA_ = XH / 2 + 20
        grand = D(self.anneau(rA_, cyA_, rA_, rA_ * 0.94, V * 0.9, H * 0.9), rect(rA_ * 1.2, cyA_ - rA_ * 2, GRAND, cyA_ - rA_ * 0.18))
        petit_a = deplace(self.bol_fut(2 * 176 - V * 0.5, -1, 70, XH - 30, rx=176, ybas=70 - OS, yhaut=XH - 30 + OS), rA_ - 176 - 20, 0)
        G['@'] = U(grand, petit_a)
        G['#'] = U(I(diag((150, -20), (206, CAP - 40), V * 0.88), bande_y(-20, CAP - 40)), I(diag((350, -20), (406, CAP - 40), V * 0.88), bande_y(-20, CAP - 40)),
                   rect(40, 200, 520, 200 + H), rect(60, 440, 540, 440 + H))
        G['$'] = U(G['S'], rect(260 + g * 0.4 - V * 0.4, -100, 260 + g * 0.4 + V * 0.4, CAP + 100))
        rpc = 110 + g * 0.2
        G['%'] = U(self.anneau(rpc, CAP - 140, rpc, 140, V * 0.86, H * 0.86), self.anneau(560 - rpc, 140, rpc, 140, V * 0.86, H * 0.86),
                   I(diag((40, -10), (520, CAP + 10), V * 0.9), bande_y(-10, CAP + 10)))
        ast_c, ast_r = (180, CAP - 170), 150
        G['*'] = U(*[barre((ast_c[0] - ast_r * math.cos(math.radians(a)), ast_c[1] - ast_r * math.sin(math.radians(a))),
                           (ast_c[0] + ast_r * math.cos(math.radians(a)), ast_c[1] + ast_r * math.sin(math.radians(a))), V * 0.82) for a in (90, 30, 150)])
        lm = 460
        G['+'] = U(rect(0, AXE - H * 0.5, lm, AXE + H * 0.5), rect(lm / 2 - V * 0.5, AXE - lm / 2, lm / 2 + V * 0.5, AXE + lm / 2))
        G['−'] = rect(0, AXE - H * 0.5, lm, AXE + H * 0.5)
        G['='] = U(rect(0, AXE + 70, lm, AXE + 70 + H), rect(0, AXE - 70 - H, lm, AXE - 70))
        G['<'] = chevron(380, 420, V * 0.9, AXE)
        G['>'] = miroir_x(G['<'], 190)
        G['×'] = U(barre((60, AXE - 170), (400, AXE + 170), V * 0.9), barre((60, AXE + 170), (400, AXE - 170), V * 0.9))
        G['÷'] = U(G['−'], self.point(lm / 2, AXE + 170), self.point(lm / 2, AXE - 170))

        def tilde(y, w=460, h=90):
            rr = w / 4
            a1 = I(self.anneau(rr, y - h / 2 + 20, rr, h, V * 0.9, H * 0.9), dessus(y - h / 2 + 20))
            a2 = I(self.anneau(3 * rr - V * 0.9 / 2 + V * 0.45, y + h / 2 - 20, rr, h, V * 0.9, H * 0.9), dessous(y + h / 2 - 20))
            return U(a1, a2)

        G['~'] = tilde(AXE)
        G['≈'] = U(tilde(AXE + 100), tilde(AXE - 100))
        G['^'] = I(U(diag((0, CAP - 250), (170, CAP), V * 0.86), diag((340, CAP - 250), (170, CAP), V * 0.86)), dessous(CAP))
        G['`'] = self.grave()
        G['´'] = self.aigu()
        G['¨'] = self.trema()
        G['°'] = self.anneau(130, CAP - 130, 130, 130, V * 0.86, H * 0.86)
        G['·'] = self.point(tp / 2, XH * 0.52)
        G['•'] = self.point(tp * 0.9, XH * 0.52, tp * 1.8)
        G['…'] = U(self.point(tp / 2, tp / 2), self.point(tp / 2 + 250, tp / 2), self.point(tp / 2 + 500, tp / 2))
        rE, ryE = 300 + g * 0.5, CAP / 2 + OSC
        euro = D(self.anneau(rE + 90, cyC, rE, ryE, Vc, Hc), rect(rE + 90 + rE * 0.05, cyC - ryE * 0.30, GRAND, cyC + ryE * 0.28))
        G['€'] = U(euro, rect(0, CAP * 0.58 - Hc / 2, rE + 140, CAP * 0.58 + Hc / 2), rect(0, CAP * 0.40 - Hc / 2, rE + 110, CAP * 0.40 + Hc / 2))
        # £
        rl_ = 160 + g * 0.3
        xl_ = 110
        cyl_ = CAP + OS - rl_
        crochet_l = D(I(self.anneau(xl_ + rl_, cyl_, rl_, rl_), dessus(cyl_)), droite_de(xl_ + 2 * rl_ - 10))
        G['£'] = U(rect(xl_, H, xl_ + V, cyl_ + 1), crochet_l, rect(0, CAP * 0.40 - H / 2, 330, CAP * 0.40 + H / 2), rect(0, 0, 470, H))
        rCo = 350 + g * 0.3
        cp = self.anneau(rCo, CAP / 2, rCo, rCo, V * 0.72, H * 0.72)
        petit_c = D(self.anneau(rCo, CAP / 2, 170, 180, V * 0.8, H * 0.8), rect(rCo + 30, CAP / 2 - 70, GRAND, CAP / 2 + 60))
        G['©'] = U(cp, petit_c)

        # flèches : fût à mi-hauteur d'x, tête ouverte
        ya, La, ha = XH * 0.5, 560, 200
        e_a = V * 0.92
        fleche = U(rect(0, ya - e_a / 2 * 0.92, La - 20, ya + e_a / 2 * 0.92),
                   I(U(barre((La - ha, ya + ha), (La, ya), e_a), barre((La - ha, ya - ha), (La, ya), e_a)), gauche_de(La + 1)))
        G['→'] = fleche
        G['←'] = miroir_x(fleche, La / 2)
        G['↑'] = tourne(fleche, 90, La / 2, ya)
        G['↓'] = tourne(fleche, -90, La / 2, ya)
        G['↗'] = tourne(fleche, 45, La / 2, ya)
        G['↘'] = tourne(fleche, -45, La / 2, ya)
        G['↔'] = U(I(fleche, droite_de(La / 2)), I(miroir_x(fleche, La / 2), gauche_de(La / 2 + 1)))
        G['✓'] = U(barre((20, 280), (190, 90), V * 0.98), barre((170, 80), (500, 560), V * 0.98))

        # ---------------- accentuées
        def pose(base, acc, dx=0):
            x0, _, x1, _ = G[base].bounds
            return U(G[base], deplace(acc, (x0 + x1) / 2 + dx, 0))

        for b, lettres in (('a', 'àâä'), ('e', 'èéêë'), ('u', 'ùûü'), ('o', 'ôö'), ('ı', 'îï'), ('y', 'ÿ')):
            for lt in lettres:
                acc = {'à': self.grave(), 'è': self.grave(), 'ù': self.grave(), 'é': self.aigu(),
                       'â': self.circonflexe(), 'ê': self.circonflexe(), 'û': self.circonflexe(), 'ô': self.circonflexe(), 'î': self.circonflexe(),
                       'ä': self.trema(), 'ë': self.trema(), 'ü': self.trema(), 'ö': self.trema(), 'ï': self.trema(), 'ÿ': self.trema()}[lt]
                dx = 0
                if b == 'a':
                    dx = -V * 0.25          # centré sur la panse, pas sur le fût
                if b == 'u':
                    dx = -V * 0.25
                G[lt] = pose(b, acc, dx)
        x0, _, x1, _ = G['c'].bounds
        G['ç'] = U(G['c'], deplace(self.cedille(), (x0 + x1) / 2 - 12, 0))
        for b, lettres in (('A', 'ÀÂÄ'), ('E', 'ÈÉÊË'), ('I', 'ÎÏ'), ('O', 'ÔÖ'), ('U', 'ÙÛÜ')):
            for lt in lettres:
                acc = {'À': self.grave(True), 'È': self.grave(True), 'Ù': self.grave(True), 'É': self.aigu(True),
                       'Â': self.circonflexe(True), 'Ê': self.circonflexe(True), 'Î': self.circonflexe(True), 'Ô': self.circonflexe(True), 'Û': self.circonflexe(True),
                       'Ä': self.trema(True), 'Ë': self.trema(True), 'Ï': self.trema(True), 'Ö': self.trema(True), 'Ü': self.trema(True)}[lt]
                dx = -Vc * 0.2 if b == 'E' else 0
                G[lt] = pose(b, acc, dx)
        x0, _, x1, _ = G['C'].bounds
        G['Ç'] = U(G['C'], deplace(self.cedille(), (x0 + x1) / 2 - 10, 0))
        G['Ÿ'] = pose('Y', self.trema(True))
        return G


# ------------------------------------------------------------------ approches
# gauche/droite : f = fût, r = rond, o = ouvert, d = diagonale, p = ponctuation, s = signe
APPROCHES = {
    'a': 'rf', 'b': 'fr', 'c': 'ro', 'd': 'rf', 'e': 'rr', 'f': 'oo', 'g': 'rf', 'h': 'ff', 'i': 'ff', 'ı': 'ff', 'j': 'of', 'ȷ': 'of',
    'k': 'fd', 'l': 'ff', 'm': 'ff', 'n': 'ff', 'o': 'rr', 'p': 'fr', 'q': 'rf', 'r': 'fo', 's': 'rr', 't': 'oo', 'u': 'ff', 'v': 'dd',
    'w': 'dd', 'x': 'dd', 'y': 'dd', 'z': 'oo', 'œ': 'rr',
    'A': 'dd', 'B': 'fr', 'C': 'ro', 'D': 'fr', 'E': 'fo', 'F': 'fo', 'G': 'rf', 'H': 'ff', 'I': 'ff', 'J': 'or', 'K': 'fd', 'L': 'fo',
    'M': 'ff', 'N': 'ff', 'O': 'rr', 'P': 'fr', 'Q': 'rr', 'R': 'fd', 'S': 'rr', 'T': 'oo', 'U': 'ff', 'V': 'dd', 'W': 'dd', 'X': 'dd',
    'Y': 'dd', 'Z': 'oo', 'Œ': 'ro',
}
BASE_ACCENT = {c: b for b, lst in (('a', 'àâä'), ('e', 'èéêë'), ('u', 'ùûü'), ('o', 'ôö'), ('ı', 'îï'), ('y', 'ÿ'), ('c', 'ç'),
                                   ('A', 'ÀÂÄ'), ('E', 'ÈÉÊË'), ('I', 'ÎÏ'), ('O', 'ÔÖ'), ('U', 'ÙÛÜ'), ('C', 'Ç'), ('Y', 'Ÿ')) for c in lst}
CHIFFRES = '0123456789'


def espaces(g):
    k = 1 + g / 400
    return {c: v * k for c, v in {'f': 62, 'r': 40, 'o': 22, 'd': 14, 'p': 50, 's': 60}.items()}


# ------------------------------------------------------------------ assemblage
NOMS = {' ': 'space', ' ': 'uni00A0', ' ': 'uni202F', ' ': 'uni2009'}


def nom_glyphe(c):
    if c in NOMS:
        return NOMS[c]
    from fontTools.agl import UV2AGL
    return UV2AGL.get(ord(c), 'uni%04X' % ord(c))


def mettre_en_place(t):
    """Renvoie {caractère: (Path placé, chasse)}."""
    G = t.glyphes()
    sp = espaces(t.g)
    out = {}
    tab = 600 + t.g * 0.8                         # chasse des chiffres
    for c, p in G.items():
        if c in CHIFFRES:
            x0, _, x1, _ = p.bounds
            out[c] = (deplace(p, (tab - (x1 - x0)) / 2 - x0, 0), tab)
            continue
        base = BASE_ACCENT.get(c, c)
        if c in ('j', 'ȷ'):
            xj = 150 + t.g * 0.4
            out[c] = (deplace(p, sp['f'] - xj, 0), sp['f'] + t.V + sp['f'])
            continue
        if base in APPROCHES:
            gauche, droite = APPROCHES[base]
            bx0, _, bx1, _ = G[base].bounds
            x0 = bx0
            chasse = sp[gauche] + (bx1 - bx0) + sp[droite]
            out[c] = (deplace(p, sp[gauche] - x0, 0), chasse)
        else:                                     # ponctuation et signes
            x0, _, x1, _ = p.bounds if p.bounds else (0, 0, 0, 0)
            m = sp['p'] if c in '.,:;!?¡…·' else sp['s']
            if c in '’‘”“\'"':
                m = sp['p'] * 0.9
            out[c] = (deplace(p, m - x0, 0), (x1 - x0) + 2 * m)
    esp = 236 + t.g * 0.4
    out[' '] = (Path(), esp)
    out[' '] = (Path(), esp)
    out[' '] = (Path(), esp * 0.5)
    out[' '] = (Path(), esp * 0.6)
    return out


# ------------------------------------------------------------------ crénage
def crenage_fea():
    """Quelques paires de crénage essentielles (classes)."""
    def cl(s):
        return '[' + ' '.join(nom_glyphe(c) for c in s) + ']'
    minus_rondes = 'acdegoqsœàâäèéêëôöç'
    paires = [
        ('T', minus_rondes + 'mnpruvwxyzıùûü', -70), ('T', '.,:;', -80), ('T', 'AÀÂÄ', -60), ('T', 'OQCG', -20),
        ('VW', minus_rondes, -45), ('VW', '.,', -80), ('VW', 'AÀÂÄ', -50),
        ('Y', minus_rondes, -65), ('Y', '.,', -90), ('Y', 'AÀÂÄ', -60),
        ('AÀÂÄ', 'TVWY', -60), ('AÀÂÄ', '’"\'', -60), ('AÀÂÄ', 'vwy', -30),
        ('L', 'TVWY', -80), ('L', '’"\'', -90), ('L', 'y', -40),
        ('PF', '.,', -90), ('PF', 'AÀÂÄ', -45), ('P', minus_rondes, -20),
        ('R', 'TVWY', -20), ('K', 'OQCG', -20), ('k', minus_rondes, -18),
        ('rvwy', '.,', -55), ('f', '.,', -40), ('f', 'f', -10),
        ('«‹', 'AVWYT', -10), ('(', 'j', 30),
        ('’', 'sdcaeoq', -30), ('’', 'lnm', -10),
    ]
    lignes = ['languagesystem DFLT dflt;', 'languagesystem latn dflt;', 'feature kern {']
    for g_, d_, v in paires:
        lignes.append(f'  pos {cl(g_)} {cl(d_)} {v};')
    lignes.append('} kern;')
    return '\n'.join(lignes)


# ------------------------------------------------------------------ export
def construire_police(nom_graisse, poids, V, dossier, dossier_web):
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.ttGlyphPen import TTGlyphPen
    from fontTools.pens.cu2quPen import Cu2QuPen
    from fontTools.ttLib.woff2 import compress

    t = Tendue(V)
    place = mettre_en_place(t)
    ordre = ['.notdef'] + [nom_glyphe(c) for c in place]
    cmap, glyfs, hmtx = {}, {}, {}

    # .notdef : un rectangle vide
    pen = TTGlyphPen(None)
    nd = D(rect(60, 0, 440, CAP), rect(60 + V * 0.5, V * 0.5, 440 - V * 0.5, CAP - V * 0.5))
    nd.draw(Cu2QuPen(pen, 1.0, reverse_direction=False))
    glyfs['.notdef'] = pen.glyph()
    hmtx['.notdef'] = (500, 60)

    for c, (p, chasse) in place.items():
        n = nom_glyphe(c)
        cmap[ord(c)] = n
        pen = TTGlyphPen(None)
        if p.bounds:
            ap = AreaPen()
            p.draw(ap)
            # TrueType : contours extérieurs dans le sens horaire (aire négative)
            p.draw(Cu2QuPen(pen, 1.0, reverse_direction=ap.value > 0))
        glyfs[n] = pen.glyph()
        lsb = round(p.bounds[0]) if p.bounds else 0
        hmtx[n] = (round(chasse), lsb)

    fb = FontBuilder(1000, isTTF=True)
    fb.setupGlyphOrder(ordre)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyfs)
    fb.setupHorizontalMetrics(hmtx)
    fb.setupHorizontalHeader(ascent=1000, descent=-300, lineGap=0)
    style = {'Regular': 'Regular'}.get(nom_graisse, nom_graisse)
    fb.setupNameTable({
        'copyright': 'Copyright 2026 Reskope. Dessinée pour Reskope.',
        'familyName': 'Reskope Sans' if nom_graisse in ('Regular', 'Bold') else f'Reskope Sans {nom_graisse}',
        'styleName': style if nom_graisse in ('Regular', 'Bold') else 'Regular',
        'uniqueFontIdentifier': f'Reskope Sans {nom_graisse} 1.000',
        'fullName': f'Reskope Sans {nom_graisse}',
        'psName': f'ReskopeSans-{nom_graisse}',
        'version': 'Version 1.000',
        'typographicFamily': 'Reskope Sans',
        'typographicSubfamily': nom_graisse,
        'manufacturer': 'Reskope',
        'designer': 'Reskope (Florian Bouchart, avec Claude)',
    })
    sel = 0x40 if nom_graisse == 'Regular' else (0x20 if nom_graisse == 'Bold' else 0)
    fb.setupOS2(version=4, usWeightClass=poids, fsType=0, achVendID='RSKP', fsSelection=sel | 0x80,
                sTypoAscender=1000, sTypoDescender=-300, sTypoLineGap=0,
                usWinAscent=1050, usWinDescent=330, sxHeight=XH, sCapHeight=CAP,
                ulUnicodeRange1=0b11, ulCodePageRange1=0b1)
    fb.setupPost(isFixedPitch=0, underlinePosition=-120, underlineThickness=round(t.H * 0.8))
    from fontTools.misc.timeTools import timestampNow
    maintenant = timestampNow()
    fb.setupHead(unitsPerEm=1000, fontRevision=1.0, macStyle=(1 if nom_graisse == 'Bold' else 0), created=maintenant, modified=maintenant)
    fb.addOpenTypeFeatures(crenage_fea())
    os.makedirs(dossier, exist_ok=True)
    ttf = os.path.join(dossier, f'ReskopeSans-{nom_graisse}.ttf')
    fb.save(ttf)
    if dossier_web:
        os.makedirs(dossier_web, exist_ok=True)
        compress(ttf, os.path.join(dossier_web, f'ReskopeSans-{nom_graisse}.woff2'))
    return ttf, len(ordre)


# ------------------------------------------------------------------ planche de contrôle
def planche(fichier='planche.html'):
    lignes = []
    jeu_txt = ('abcdefghijklmnopqrstuvwxyz àâäçéèêëîïôöùûüÿœ ABCDEFGHIJKLMNOPQRSTUVWXYZ ÀÂÇÉÈÊËÎÏÔÙÛÜŒ '
               '0123456789 .,:;!?¡…·•\'"’‘“”«»‹›()[]{}-–—_/\\|&@#$%*+−=<>×÷~≈^`°€£©→←↑↓↗↘↔✓')
    for nom, (poids, V) in GRAISSES.items():
        place = mettre_en_place(Tendue(V))
        s = 0.056
        x, morceaux, ligne_y = 0.0, [], 0
        for c in jeu_txt:
            if c == ' ':
                x += place[' '][1]
                continue
            if c not in place:
                continue
            p, ch = place[c]
            pen = SVGPathPen(None)
            p.draw(pen)
            morceaux.append(f'<path transform="translate({x:.0f} {-ligne_y})" d="{pen.getCommands()}"/>')
            x += ch
            if x > 17000:
                x, ligne_y = 0, ligne_y + 1300
        h = ligne_y + 1300
        lignes.append(f'<p style="font:12px system-ui;margin:10px 0 0">{nom} ({poids})</p><svg width="{17600 * s:.0f}" height="{h * s:.0f}" viewBox="0 0 17600 {h}"><g fill="#1C0CB3" transform="translate(0 {ASC + 80}) scale(1 -1)">{"".join(morceaux)}</g></svg>')
    open(fichier, 'w', encoding='utf-8').write('<!doctype html><meta charset="utf-8"><body style="margin:16px;background:#F0EEE8">' + ''.join(lignes) + '</body>')


if __name__ == '__main__':
    ici = os.path.dirname(os.path.abspath(__file__))
    if '--planche' in sys.argv:
        planche(os.path.join(ici, 'planche.html'))
        print('planche ok')
    else:
        web = os.path.join(ici, '..', 'public', 'fonts')
        for nom, (poids, V) in GRAISSES.items():
            ttf, n = construire_police(nom, poids, V, os.path.join(ici, 'polices'), web)
            print(f'{nom:9s} {poids}  {n} glyphes  {os.path.getsize(ttf) // 1024} Ko')
