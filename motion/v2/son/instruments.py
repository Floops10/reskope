"""Les instruments et les bruitages, tous synthétisés."""
import numpy as np
from synthe import (SR, ech, sinus, scie, carre, bruit, svf, egaliseur, passe_haut, passe_bas, cloche, etagere,
                    fondus, enveloppe)


# ── Batterie ───────────────────────────────────────────────────────
def grosse_caisse(rng, f0=150.0, f1=47.0, tau_p=0.038, tau_a=0.3, clic=0.3, duree=0.55, pression=1.5):
    n = ech(duree)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / tau_p)
    corps = sinus(f, n) * np.exp(-t / tau_a)
    k = np.tanh(corps * pression) / np.tanh(pression)
    c = bruit(ech(0.005), rng) * np.linspace(1, 0, ech(0.005)) ** 2
    c = egaliseur(c, passe_haut(2500, 2))[0]
    k[:len(c)] += c * clic
    return fondus(k, 0.0003, 0.03)


def claque(rng, duree=0.4, clair=1.0):
    n = ech(duree)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for d in (0.0, 0.0105, 0.0215):
        i, m = ech(d), ech(0.011)
        s[i:i + m] += bruit(m, rng) * np.exp(-np.arange(m) / SR / 0.0035)
    s += bruit(n, rng) * np.exp(-t / 0.12) * (t > 0.024) * 0.75
    s = egaliseur(s, lambda f: passe_haut(850, 2)(f) * passe_bas(7500 * clair, 2)(f) * cloche(1500, 4, 0.8)(f))[0]
    return fondus(s * 0.55, 0.0003, 0.03)


def caisse_claire(rng, duree=0.3):
    n = ech(duree)
    t = np.arange(n) / SR
    corps = sinus(190 * (1 + 0.25 * np.exp(-t / 0.01)), n) * np.exp(-t / 0.05) * 0.6
    tim = egaliseur(bruit(n, rng), lambda f: passe_haut(1200, 2)(f) * passe_bas(9000, 1)(f))[0] * np.exp(-t / 0.1) * 0.5
    return fondus(np.tanh((corps + tim) * 1.3), 0.0003, 0.02)


def charley(rng, ouvert=False, duree=None):
    duree = duree or (0.3 if ouvert else 0.07)
    n = ech(duree)
    t = np.arange(n) / SR
    nz = bruit(n, rng)
    met = sum(carre(fr, n, rng.random()) for fr in (3460, 4870, 6310, 8210)) * 0.18
    s = egaliseur(nz * 0.8 + met, lambda f: passe_haut(7200, 2)(f) * cloche(10500, 3, 0.6)(f))[0]
    s *= np.exp(-t / (0.09 if ouvert else 0.018))
    return fondus(s * 0.35, 0.0003, 0.01)


def cymbale(rng, duree=2.6, eclat=1.0):
    n = ech(duree)
    t = np.arange(n) / SR
    nz = egaliseur(bruit(n, rng), lambda f: passe_haut(3200, 2)(f) * cloche(8200, 3, 1.2)(f))[0]
    met = sum(carre(fr, n, rng.random()) for fr in (547, 811, 1277, 1723, 2339, 3161, 4003)) * 0.05
    met = egaliseur(met, passe_haut(2600, 2))[0]
    s = (nz * 0.7 + met) * (np.exp(-t / 0.95) * 0.75 + np.exp(-t / 0.1) * 0.45 * eclat)
    return fondus(s * 0.42, 0.0003, 0.15)


def cymbale_inverse(rng, duree=1.4):
    s = cymbale(rng, duree=duree + 0.4)[:ech(duree)][::-1].copy()
    return fondus(s, 0.05, 0.004)


def roulement(rng, duree, debut=8, fin=32, tempo=120.0):
    """Roulement de caisse claire qui accélère (de croches à triples croches)."""
    n = ech(duree)
    s = np.zeros(n)
    t = 0.0
    while t < duree:
        p = t / duree
        div = debut * (fin / debut) ** p
        coup = caisse_claire(rng, 0.12) * (0.25 + 0.75 * p ** 1.6)
        i = ech(t)
        j = min(n, i + len(coup))
        s[i:j] += coup[:j - i]
        t += (60.0 / tempo) * 4 / div
    return s


# ── Basse, nappes, pincées, cloches ─────────────────────────────────
def basse(notes, duree_totale, rng, rondeur=0.25, coupure=260):
    """notes : [(début, durée, fréquence)]. Sinus + un peu de scie filtrée ; mono."""
    s = np.zeros(ech(duree_totale + 2))
    for t0, d, f in notes:
        n = ech(d + 0.06)
        t = np.arange(n) / SR
        o = sinus(f, n) + 0.3 * sinus(2 * f, n) * np.exp(-t / 0.08)
        o += rondeur * svf(scie(f, n), coupure + 700 * np.exp(-t / 0.05), 0.8)
        env = np.minimum(1, t / 0.006) * np.where(t < d, 1.0, np.exp(-(t - d) / 0.03))
        o = fondus(o * env, 0.002, 0.01)
        i = ech(t0)
        s[i:i + n] += o[:len(s) - i] if i + n > len(s) else o
    return np.tanh(s * 1.2) / 1.2


def nappe(accords, duree_totale, rng, coupure=1600.0, voix=5, desaccord=0.11, attaque=0.45, relache=1.2, lfo=0.18, brillance=None):
    """accords : [(début, fin, [fréquences])]. Supersaw doux, stéréo large."""
    N = ech(duree_totale + 3)
    out = np.zeros((2, N))
    for c in range(2):
        brut = np.zeros(N)
        for t0, t1, fr in accords:
            n = ech(t1 - t0 + relache)
            t = np.arange(n) / SR
            env = np.where(t < attaque, np.sin(np.pi / 2 * t / attaque) ** 2, 1.0)
            env *= np.where(t < t1 - t0, 1.0, np.exp(-(t - (t1 - t0)) / (relache / 3)))
            for f in fr:
                o = np.zeros(n)
                for v in range(voix):
                    dv = desaccord * (v - (voix - 1) / 2) / ((voix - 1) / 2) + rng.normal(0, 0.01)
                    o += scie(f * 2 ** (dv / 12), n, rng.random())
                i = ech(t0)
                brut[i:i + n] += (o / voix * env)[:N - i]
        t = np.arange(N) / SR
        fc = coupure * (1 + 0.25 * np.sin(2 * np.pi * lfo * t + c * 1.3))
        if brillance is not None:
            fc = fc * brillance(t)
        out[c] = svf(brut, fc, 0.6)
    return out * 0.5


def pincee(f, rng, duree=0.5, haut=5200.0, bas=420.0, tau_f=0.085, tau_a=0.24, q=0.9):
    n = ech(duree)
    t = np.arange(n) / SR
    o = scie(f, n, rng.random()) * 0.55 + carre(f * 1.002, n, rng.random(), 0.32) * 0.45
    s = svf(o, bas + (haut - bas) * np.exp(-t / tau_f), q)
    s *= np.exp(-t / tau_a)
    return fondus(s * 0.5, 0.0008, 0.02)


def cloche_fm(f, duree=1.8, ratio=3.5, indice=2.6, tau_i=0.4, tau_a=0.75):
    n = ech(duree)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t + indice * np.exp(-t / tau_i) * np.sin(2 * np.pi * f * ratio * t)) * np.exp(-t / tau_a)
    return fondus(s * 0.4, 0.0008, 0.05)


def piano_fm(f, duree=2.2, tau_a=0.9):
    """Un piano électrique (FM 1:1 et une lame aiguë)."""
    n = ech(duree)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t + 1.3 * np.exp(-t / 0.5) * np.sin(2 * np.pi * f * t))
    s += 0.25 * np.sin(2 * np.pi * f * 7.02 * t) * np.exp(-t / 0.05)
    s *= np.exp(-t / tau_a) * (1 - 0.3 * np.exp(-t / 0.01))
    return fondus(s * 0.35, 0.0008, 0.08)


def bulle(f, rng, duree=0.22):
    """Un petit « pop » accordé (une étiquette qui apparaît)."""
    n = ech(duree)
    t = np.arange(n) / SR
    s = sinus(f * (1 + 0.6 * np.exp(-t / 0.012)), n) * np.exp(-t / 0.06)
    s += 0.3 * sinus(f * 2.01, n) * np.exp(-t / 0.03)
    return fondus(s * 0.5, 0.0005, 0.02)


def tic(rng, hauteur=2600.0, duree=0.06, bois=0.5):
    n = ech(duree)
    t = np.arange(n) / SR
    s = sinus(hauteur, n) * np.exp(-t / 0.009)
    s += egaliseur(bruit(n, rng), passe_haut(4200, 2))[0] * np.exp(-t / 0.004) * bois
    return fondus(s * 0.45, 0.0003, 0.01)


# ── Bruitages de mouvement ─────────────────────────────────────────
def souffle(duree, rng, pic=2400.0, bas=450.0, pan=(-0.7, 0.7), attaque=0.55, grave=0.0):
    """Un passage d'air : bruit filtré qui monte puis redescend, et traverse l'image."""
    n = ech(duree)
    t = np.arange(n) / SR
    p = t / duree
    env = np.where(p < attaque, (p / attaque) ** 2, ((1 - p) / (1 - attaque)) ** 1.6)
    fc = bas + (pic - bas) * env ** 1.2
    s = svf(bruit(n, rng), fc, 1.2, 'bp') * env
    if grave:
        s += grave * sinus(70 + 40 * env, n) * env
    a = (pan[0] + (pan[1] - pan[0]) * p + 1) * np.pi / 4
    return fondus(np.vstack([s * np.cos(a), s * np.sin(a)]) * 1.2, 0.005, 0.02)


def montee(duree, rng, f_bas=380.0, f_haut=9000.0, fond=(110.0, 440.0), courbe=1.6):
    """Une montée : bruit en bande qui grimpe, deux scies qui s'élèvent, crescendo."""
    n = ech(duree)
    t = np.arange(n) / SR
    p = t / duree
    s = svf(bruit(n, rng), f_bas * (f_haut / f_bas) ** (p ** 1.4), 2.2, 'bp') * 0.7
    f = fond[0] * (fond[1] / fond[0]) ** (p ** 1.3)
    s += (scie(f, n) + scie(f * 1.006, n)) * 0.07
    s *= p ** courbe
    return fondus(s, 0.02, 0.004)


def impact(rng, duree=2.4, f0=62.0, f1=31.0, bruit_niv=0.45):
    n = ech(duree)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.22)
    sub = sinus(f, n) * np.exp(-t / 0.75)
    nz = egaliseur(bruit(n, rng) * np.exp(-t / 0.07), passe_bas(2600, 2))[0] * bruit_niv
    return fondus(np.tanh((sub + nz) * 1.6) * 0.8, 0.0004, 0.12)


def vibreur(rng, duree=0.26):
    """Le téléphone qui vibre sur une table."""
    n = ech(duree)
    t = np.arange(n) / SR
    s = carre(162 + 5 * np.sin(2 * np.pi * 21 * t), n)
    s = egaliseur(s, lambda f: passe_bas(1100, 2)(f) * passe_haut(80, 2)(f))[0]
    cliquetis = egaliseur(bruit(n, rng), lambda f: passe_haut(1800, 2)(f) * passe_bas(4200, 2)(f))[0] * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 162 * t))) * 0.25
    env = np.minimum(1, t / 0.012) * np.minimum(1, (duree - t) / 0.03)
    return fondus((s * 0.55 + cliquetis) * env, 0.002, 0.01)


def balayage(duree, rng):
    """Le relevé laser : une scie résonante qui balaie tout le spectre."""
    n = ech(duree)
    t = np.arange(n) / SR
    p = t / duree
    o = scie(110, n) + scie(110.6, n) + 0.5 * scie(220.4, n)
    s = svf(o, 250 * (9000 / 250) ** (0.5 - 0.5 * np.cos(np.pi * p)), 5.0) * 0.35
    s += sinus(900 + 1500 * p, n) * 0.05
    env = np.minimum(1, t / 0.08) * np.minimum(1, (duree - t) / 0.35)
    return fondus(s * env, 0.005, 0.02)


def etincelle(f, rng, duree=0.35):
    """Un « zap » : la mise sous tension d'un lien."""
    n = ech(duree)
    t = np.arange(n) / SR
    s = sinus(f * (1 + 2.5 * np.exp(-t / 0.025)), n) * np.exp(-t / 0.09) * 0.5
    s += egaliseur(bruit(n, rng), passe_haut(5000, 2))[0] * np.exp(-t / 0.01) * 0.3
    return fondus(s, 0.0004, 0.02)


def chute(f, rng, duree=0.5):
    """Un bloc qui tombe : une note qui glisse vers le grave."""
    n = ech(duree)
    t = np.arange(n) / SR
    s = sinus(f * np.exp(-t / 0.25), n) * np.exp(-t / 0.2)
    return fondus(s * 0.45, 0.001, 0.03)


def ascension(f, rng, duree=0.5):
    """L'inverse : une note qui remonte vers sa place."""
    n = ech(duree)
    t = np.arange(n) / SR
    s = sinus(f * (0.5 + 0.5 * (1 - np.exp(-t / 0.08))), n) * np.minimum(1, t / 0.03) * np.exp(-t / 0.3)
    return fondus(s * 0.45, 0.001, 0.03)


def pose_bloc(rng, hauteur=900.0):
    """Un bloc qui se pose : un toc boisé, court."""
    n = ech(0.12)
    t = np.arange(n) / SR
    s = sinus(hauteur * (1 + 0.4 * np.exp(-t / 0.004)), n) * np.exp(-t / 0.025)
    s += egaliseur(bruit(n, rng), lambda f: passe_haut(1500, 2)(f) * passe_bas(6000, 2)(f))[0] * np.exp(-t / 0.006) * 0.4
    return fondus(s * 0.5, 0.0003, 0.01)


def carillon(fs, rng, ecart=0.09):
    """Une notification : quelques notes de cloche, arpégées."""
    parts = [cloche_fm(f, 1.4, ratio=2.0, indice=1.6, tau_i=0.25, tau_a=0.5) for f in fs]
    n = ech(ecart * (len(fs) - 1)) + len(parts[0])
    s = np.zeros(n)
    for k, p in enumerate(parts):
        i = ech(ecart * k)
        s[i:i + len(p)] += p
    return s
