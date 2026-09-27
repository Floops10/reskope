"""Film B · TPE : 128 à la minute, 26,25 s. Mi mineur la nuit, sol majeur le jour.

Le soir : le téléphone vibre, une pulsation retenue. Les situations défilent
sur des accords mineurs, un passage d'air à chaque panneau traversé. Au
temps fort le jour se lève : groove franc, et chaque bloc qui se pose fait
son petit « toc » (les instants exacts viennent du même tirage que l'image).
Les créneaux se prennent en montant la gamme, le téléphone ne sonne plus
qu'une douce notification, cinq notes pour cinq jours, le tintement de la
clé, et le logo sur sol majeur.
"""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from synthe import hz, ech, SR
from morceau import Morceau
import instruments as I

D = 26.25
m = Morceau(D, 128, graine=128)
tp = m.tp
MES = 4 * tp
r = m.rng
T = dict(couloir=2 * MES, jour=4 * MES, tour=5 * MES, vue=6 * MES, agenda=7 * MES, calme=8 * MES, jours=9 * MES, cles=10 * MES, marque=11 * MES)
T['flashR'] = T['marque'] + tp * 0.8
T_R = 11 * MES + 1.3


def mulberry32(graine):
    """Le même tirage que prng() dans monde.js (mêmes nombres, même ordre)."""
    a = graine & 0xFFFFFFFF
    def suivant():
        nonlocal a
        a = (a + 0x6D2B79F5) & 0xFFFFFFFF
        t = a
        t = ((t ^ (t >> 15)) * (t | 1)) & 0xFFFFFFFF
        t ^= (t + (((t ^ (t >> 7)) * (t | 61)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((t ^ (t >> 14)) & 0xFFFFFFFF) / 4294967296
    return suivant


# Les instants où chaque bloc se pose (même ordre que CONSTR dans le film).
hasard = mulberry32(128128)
TAILLES = [18, 2 + 5 + 20, 9, 1 + 5]
poses = []
for ci, nb in enumerate(TAILLES):
    for i in range(nb):
        arr = T['jour'] + 0.12 + ci * 0.15 + i * 0.026 + hasard() * 0.05
        for _ in range(5):
            hasard()
        poses.append((arr + 0.34, ci, i))

# ── L'harmonie ──────────────────────────────────────────────────
ACC = {
    'Em9': ['E3', 'G3', 'B3', 'D4', 'F#4'], 'Cmaj7': ['C3', 'G3', 'B3', 'E4'], 'Am7': ['A2', 'E3', 'G3', 'C4'], 'B7': ['B2', 'F#3', 'A3', 'D#4'],
    'G': ['G2', 'D3', 'B3', 'D4'], 'D/F#': ['F#2', 'D3', 'A3', 'D4'], 'Em7': ['E3', 'G3', 'B3', 'D4'], 'C': ['C3', 'G3', 'C4', 'E4'],
    'D': ['D3', 'A3', 'D4', 'F#4'], 'Gfin': ['G2', 'D3', 'G3', 'B3', 'D4', 'A4'],
}
M_ = lambda k: k * MES
grille = [(0, M_(2), 'Em9'), (M_(2), M_(2) + 2 * tp, 'Em9'), (M_(2) + 2 * tp, M_(3), 'Cmaj7'), (M_(3), M_(3) + 2 * tp, 'Am7'), (M_(3) + 2 * tp, M_(4) - 0.06, 'B7'),
          (M_(4), M_(5), 'G'), (M_(5), M_(6), 'D/F#'), (M_(6), M_(7), 'Em7'), (M_(7), M_(8), 'Cmaj7'), (M_(8), M_(9), 'G'), (M_(9), M_(10), 'D'),
          (M_(10), M_(10) + 2 * tp, 'C'), (M_(10) + 2 * tp, M_(11) - 0.05, 'D'), (T['flashR'], D - 1.2, 'Gfin')]
nappe = I.nappe([(a, b, [hz(n) for n in ACC[c]]) for a, b, c in grille], D, r, coupure=1500,
                brillance=lambda t: np.where(t < M_(4), 0.45 + 0.1 * t / M_(4), 1.0))
tn = np.arange(nappe.shape[1]) / SR
nappe *= np.where(tn < M_(2), 0.45, np.where(tn < M_(4), 0.7, 1.0))[None, :]
m.poser('nappe', nappe, 0, 0.72, rev=0.32)

# ── La basse ─────────────────────────────────────────────────────
FOND = {'Em9': 'E1', 'Cmaj7': 'C2', 'Am7': 'A1', 'B7': 'B1', 'G': 'G1', 'D/F#': 'F#1', 'Em7': 'E1', 'C': 'C2', 'D': 'D2', 'Gfin': 'G1'}
nb_ = []
for a, b, c in grille:
    if c == 'Gfin':
        nb_.append((T['flashR'], 3.2, hz('G1')))
        continue
    t = a
    while t < b - 1e-6:
        if a < M_(2):                        # la nuit : une pulsation sourde, en croches
            nb_.append((t, tp * 0.35, hz(FOND[c])))
            t += tp / 2
            continue
        if a < M_(4):                        # les situations : double croches tendues
            nb_.append((t, tp * 0.2, hz(FOND[c]) * (2 if int(round((t - a) / (tp / 4))) % 4 == 3 else 1)))
            t += tp / 4
            continue
        # le jour : contretemps et octave, la basse « house »
        nb_.append((t + tp / 2, tp * 0.4, hz(FOND[c]) * (2 if int(round((t - a) / tp)) % 2 else 1)))
        t += tp
m.poser('basse', I.basse(nb_, D, r, rondeur=0.45, coupure=480), 0, 0.33)

# ── La batterie ──────────────────────────────────────────────────
for k in range(8):                                   # les situations : grosse caisse feutrée
    m.poser('batterie', I.grosse_caisse(r, 120, 50, 0.03, 0.2, 0.1), M_(2) + k * tp, 0.45)
t = T['jour']
while t < T['marque'] - 1e-6:                        # le jour : quatre temps
    calme = T['calme'] <= t < T['jours']
    if not calme or int(round((t - T['calme']) / tp)) % 2 == 0:
        m.kick(t, gain=0.9 if calme else 1.0)
    t += tp
for k in range(8):                                   # le logo
    m.kick(T['flashR'] + k * 2 * tp, gain=0.75 if k else 1.0) if T['flashR'] + k * 2 * tp < D - 2 else None
t = T['jour']
while t < T['marque'] - 1e-6:
    b = int(round((t - T['jour']) / tp))
    if b % 2 == 1:
        m.poser('batterie', I.claque(r), t, 0.38, rev=0.16)
    if not (T['calme'] <= t < T['jours']):
        m.poser('batterie', I.charley(r, ouvert=True, duree=0.22), t + tp / 2, 0.12, pan=0.2)
        for q in (0, 1, 3):
            m.poser('batterie', I.charley(r), t + q * tp / 4, 0.07 if q else 0.1, pan=-0.2)
    t += tp
for k in range(16):                                  # la nuit : un tic de charleston
    m.poser('batterie', I.charley(r, duree=0.04), k * tp / 2 + tp / 4, 0.04, pan=0.3)
m.poser('batterie', I.roulement(r, M_(4) - 6.82, 8, 32, 128), 6.82, 0.35, rev=0.2)

# ── Les mélodies et les accents ─────────────────────────────────
# Les panneaux : un accord frappé à chaque arrivée.
for t0, acc in ((3.99, 'Em9'), (4.95, 'Cmaj7'), (5.88, 'Am7'), (6.82, 'B7')):
    for n in ACC[acc][1:]:
        m.poser('melodie', I.pincee(hz(n) * 2, r, 0.5, haut=3000, bas=600, tau_a=0.22), t0, 0.1, pan=(-0.3 if n[0] in 'EG' else 0.3), rev=0.2, ech_=0.2)
    m.poser('bruitages', I.impact(r, 0.9, 110, 55, 0.25), t0, 0.22)
# Les blocs qui se posent : un « toc » accordé chacun.
PENTA = ['G4', 'A4', 'B4', 'D5', 'E5', 'G5', 'A5', 'B5']
for k, (tpose, ci, i) in enumerate(poses):
    f = hz(PENTA[(ci * 3 + i * 2) % len(PENTA)])
    g = 0.2 if i == 0 else 0.1
    m.poser('bruitages', I.pose_bloc(r, f), tpose, g, pan=((i * 37) % 11 - 5) / 8)
# La visite : une note par construction.
for j, n in enumerate(['G4', 'B4', 'D5', 'G5']):
    m.poser('melodie', I.pincee(hz(n), r, 0.55, haut=5200, tau_a=0.28), T['tour'] + j * tp, 0.3, pan=[-0.3, 0.3, -0.3, 0.3][j], rev=0.25, ech_=0.3)
    m.poser('bruitages', I.souffle(0.3, r, pic=2800, bas=700, pan=(0.5, -0.5), attaque=0.5), T['tour'] + j * tp - 0.1, 0.2)
# Le riff du jour (mesures 5, 7, 9).
RIFF = {M_(5): ['D5', 'A4', 'F#4', 'A4'], M_(6): ['B4', 'G4', 'E4', 'G4'], M_(9) + tp * 0.0: ['A4', 'F#4', 'D4', 'F#4']}
for a, notes in RIFF.items():
    for k in range(8):
        tt = a + tp / 2 + k * tp / 2
        m.poser('melodie', I.pincee(hz(notes[k % 4]), r, 0.35, haut=3600, tau_a=0.15), tt, 0.14, pan=(-0.35 if k % 2 else 0.35), ech_=0.3)
# Les étiquettes de la vue d'ensemble.
for j, n in enumerate(['D6', 'E6', 'G6', 'A6']):
    m.poser('melodie', I.bulle(hz(n), r), T['vue'] + 0.3 + j * 0.12, 0.26, pan=0.4, rev=0.2)
# Les créneaux se prennent tout seuls, en montant la gamme.
for k, n in enumerate(['G5', 'A5', 'B5', 'C6', 'D6', 'E6', 'F#6', 'G6']):
    tk = T['agenda'] + 0.3 + k * tp * 0.4
    m.poser('melodie', I.cloche_fm(hz(n), 0.9, ratio=2.0, indice=1.4, tau_i=0.15, tau_a=0.25), tk, 0.2, pan=((k % 4) - 1.5) / 3, rev=0.25)
# La notification du téléphone calme.
m.poser('melodie', I.carillon([hz('B5'), hz('E6'), hz('G#6') / 1.0594 * 1.0], r, 0.09), T['calme'] + 0.32, 0.25, rev=0.35, ech_=0.2)
# Cinq jours : cinq notes, la dernière met le site en ligne.
for i, n in enumerate(['D5', 'E5', 'F#5', 'A5', 'D6']):
    tj = T['jours'] + tp * 0.5 + i * tp * 0.75
    m.poser('melodie', I.pincee(hz(n), r, 0.6, haut=6000, tau_a=0.3), tj, 0.26 + 0.04 * i, pan=(i - 2) / 4, rev=0.25, ech_=0.25)
m.poser('bruitages', m.sfx('sparkle'), T['jours'] + tp * 3.5, 0.16, rev=0.3)
m.poser('melodie', I.cloche_fm(hz('D6'), 1.6, ratio=2.0) + I.cloche_fm(hz('A6'), 1.6), T['jours'] + tp * 3.5, 0.2, rev=0.4)
# La clé : un tintement métallique quand elle apparaît.
for k, (f, d) in enumerate(((hz('B5'), 0.0), (hz('F#6'), 0.07), (hz('B6'), 0.15))):
    m.poser('melodie', I.cloche_fm(f, 1.4, ratio=1.41, indice=2.2, tau_i=0.2, tau_a=0.45), T['cles'] + 0.35 + d, 0.2, pan=(k - 1) * 0.4, rev=0.35)
# Les traits du R, puis le logo.
for k, n in enumerate(['G5', 'B5', 'D6', 'G6', 'B6', 'D7']):
    m.poser('melodie', I.tic(r, hz(n), 0.08, bois=0.2), T['flashR'] + 0.3 + k * 0.08, 0.22, pan=(k - 2.5) / 4)
m.poser('melodie', I.cloche_fm(hz('G5'), 3.0, ratio=2.0, tau_a=1.2) + 0.6 * I.cloche_fm(hz('D6'), 3.0, tau_a=1.0), T_R, 0.3, rev=0.55, ech_=0.25)
m.poser('melodie', I.bulle(hz('G6'), r, 0.3), T_R + 2.1, 0.3, rev=0.3)
m.poser('melodie', I.tic(r, 3000, 0.06), T_R + 2.5, 0.15)

# ── Les bruitages ────────────────────────────────────────────────
for t0 in (0.0, tp, M_(1), M_(1) + tp):                               # le téléphone vibre
    m.poser('bruitages', I.vibreur(r), t0, 0.5)
m.poser('bruitages', I.souffle(0.55, r, pic=3200, bas=500, pan=(0, 0), attaque=0.9, grave=0.3), M_(2) - 0.5, 0.4)   # on plonge
m.poser('bruitages', I.impact(r, 1.2, 80, 40, 0.3), M_(2), 0.3)
for a, b in ((4.64, 4.95), (5.58, 5.88), (6.52, 6.82)):               # les panneaux traversés
    m.poser('bruitages', I.souffle(b - a + 0.15, r, pic=3400, bas=600, pan=(-0.6, 0.6), attaque=0.6, grave=0.25), a - 0.03, 0.34)
m.poser('bruitages', I.montee(M_(4) - 6.82, r, 500, 8000, (164.8, 329.6)), 6.82, 0.32)
m.poser('bruitages', I.cymbale_inverse(r, 0.68), 6.82, 0.25)
m.poser('bruitages', I.impact(r, 2.2, 66, 34, 0.5), T['jour'], 0.55, rev=0.35)            # le jour se lève
m.poser('bruitages', I.cymbale(r, 2.6), T['jour'], 0.24, rev=0.25)
m.poser('bruitages', I.souffle(1.2, r, pic=2200, bas=300, pan=(0.2, -0.2), attaque=0.3, grave=0.3), T['jour'] + 0.02, 0.3)
m.poser('bruitages', I.souffle(0.45, r, pic=2400, bas=500, pan=(-0.4, 0.4), attaque=0.5), T['vue'] - 0.05, 0.25)
m.poser('bruitages', I.souffle(0.35, r, pic=2600, bas=600, pan=(0.4, -0.4), attaque=0.5), T['agenda'] - 0.05, 0.22)
m.poser('bruitages', I.souffle(0.35, r, pic=2600, bas=600, pan=(-0.4, 0.4), attaque=0.5), T['calme'] - 0.05, 0.22)
m.poser('bruitages', I.impact(r, 0.9, 100, 50, 0.25), T['jours'] + 0.04, 0.3)
m.poser('bruitages', I.souffle(0.35, r, pic=2600, bas=600, pan=(0.4, -0.4), attaque=0.5), T['cles'] - 0.05, 0.22)
m.poser('bruitages', I.souffle(0.6, r, pic=3600, bas=400, pan=(0, 0), attaque=0.8, grave=0.35), T['marque'] - 0.05, 0.4)   # tout s'envole
m.poser('bruitages', I.montee(tp * 0.8 + 0.05, r, 800, 9000, (196, 392)), T['marque'], 0.3)
m.poser('bruitages', I.impact(r, 2.6, 64, 34, 0.55), T['flashR'], 0.6, rev=0.45)
m.poser('bruitages', I.cymbale(r, 3.0), T['flashR'], 0.24, rev=0.3)
m.poser('bruitages', I.souffle(0.9, r, pic=1600, bas=300, pan=(0.3, -0.3), attaque=0.5), T_R + 0.35, 0.2)
m.poser('bruitages', m.sfx('sparkle'), T_R + 0.8, 0.12, rev=0.3)

for a, z in ((M_(4) - 0.07, M_(4)), (T['flashR'] - 0.08, T['flashR'])):
    i, j = ech(a), ech(z)
    for b in list(m.bus.values()) + [m.envoi_rev, m.envoi_echo]:
        b.g[:, i:j] *= np.linspace(1, 0.05, j - i)

sortie = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sortie', 'b-tpe.m4a')
print(m.mixer(sortie))
print(sortie)
