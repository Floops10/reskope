"""Film C · PME : 100 à la minute, 24 s. Ré mineur, puis fa majeur au relevé.

Posé et précis : une horloge (tic-tac en croches) sur un bourdon grave ; les
îlots montent ; la même information est tapée trois fois (trois rafales de
touches, un grésillement corail) ; 209 heures tombent (six notes qui
chutent) ; au relevé laser, tout passe en majeur et le rythme s'installe ;
chaque lien s'allume, l'information file d'un bout à l'autre ; les
semaines reviennent (six notes qui remontent) ; cinq marches, cinq notes ;
et les îlots deviennent le R, sur un accord de fa.
"""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from synthe import hz, ech, SR, reponse
from morceau import Morceau
import instruments as I

D = 24.0
m = Morceau(D, 100, graine=100)
tp = m.tp            # 0,6 s
MES = 4 * tp         # 2,4 s
r = m.rng
T = dict(ilots=MES, saisie=2 * MES, cout=3 * MES, releve=4 * MES, relie=5 * MES, heures=6 * MES, etapes=7 * MES, marque=8 * MES)
T['flashR'] = T['marque'] + 0.3
T_R = 8 * MES + 1.3

# ── L'harmonie ──────────────────────────────────────────────────
ACC = {
    'Dm9': ['D3', 'F3', 'A3', 'C4', 'E4'], 'Bbmaj7': ['Bb2', 'F3', 'A3', 'D4'], 'Gm7': ['G2', 'D3', 'F3', 'Bb3'], 'A7sus': ['A2', 'E3', 'G3', 'D4'],
    'F': ['F2', 'C3', 'A3', 'C4', 'F4'], 'C': ['C3', 'G3', 'C4', 'E4'], 'Dm7': ['D3', 'A3', 'C4', 'F4'], 'Bb': ['Bb2', 'F3', 'Bb3', 'D4'],
    'Fmaj9': ['F2', 'C3', 'E3', 'G3', 'A3', 'C4'], 'Ffin': ['F2', 'C3', 'F3', 'A3', 'C4', 'G4'],
}
M_ = lambda k: k * MES
grille = [(0, M_(1), 'Dm9'), (M_(1), M_(2), 'Bbmaj7'), (M_(2), M_(3), 'Gm7'), (M_(3), M_(4) - 0.07, 'A7sus'),
          (M_(4), M_(5), 'F'), (M_(5), M_(6), 'C'), (M_(6), M_(6) + 2 * tp, 'Dm7'), (M_(6) + 2 * tp, M_(7), 'Bb'),
          (M_(7), M_(8), 'C'), (T['flashR'], D - 1.2, 'Ffin')]
nappe = I.nappe([(a, b, [hz(n) for n in ACC[c]]) for a, b, c in grille], D, r, coupure=1300, attaque=0.8, relache=1.6, voix=6, desaccord=0.09,
                brillance=lambda t: np.where(t < M_(4), 0.5 + 0.35 * t / M_(4), 1.0))
tn = np.arange(nappe.shape[1]) / SR
nappe *= np.where(tn < M_(4), 0.62, 1.0)[None, :]
m.poser('nappe', nappe, 0, 0.8, rev=0.45)

# ── La basse ─────────────────────────────────────────────────────
FOND = {'Dm9': 'D1', 'Bbmaj7': 'Bb0', 'Gm7': 'G1', 'A7sus': 'A1', 'F': 'F1', 'C': 'C2', 'Dm7': 'D2', 'Bb': 'Bb1', 'Ffin': 'F1'}
nb_ = []
for a, b, c in grille:
    if c == 'Ffin':
        nb_.append((T['flashR'], 3.2, hz('F1')))
        continue
    t = a
    while t < b - 1e-6:
        if a < M_(4):
            nb_.append((t, tp * 0.8, hz(FOND[c])))           # des noires tenues, sombres
            t += tp
        else:
            nb_.append((t + tp / 2, tp * 0.38, hz(FOND[c])))  # le relevé : contretemps
            nb_.append((t + tp * 0.75, tp * 0.18, hz(FOND[c]) * 2))
            t += tp
m.poser('basse', I.basse(nb_, D, r, rondeur=0.35, coupure=380), 0, 0.26)

# ── La batterie ──────────────────────────────────────────────────
for k in range(8):                                    # le problème : une pulsation feutrée
    m.poser('batterie', I.grosse_caisse(r, 110, 46, 0.03, 0.26, 0.08), M_(2) + k * tp, 0.5)
t = T['releve']
while t < T['marque'] - 1e-6:                         # le relevé : le rythme s'installe
    b = int(round((t - T['releve']) / tp))
    m.kick(t, f0=140, f1=44, tau_a=0.34)
    if b % 2 == 1:
        m.poser('batterie', I.caisse_claire(r, 0.34), t, 0.34, rev=0.35)
        m.poser('batterie', I.claque(r, clair=0.8), t, 0.22, rev=0.3)
    for q in range(4):
        m.poser('batterie', I.charley(r), t + q * tp / 4, [0.1, 0.05, 0.08, 0.05][q], pan=-0.2 if q % 2 else 0.2)
    t += tp
for k in range(4):
    m.kick(T['flashR'] + k * 2 * tp, gain=0.75 if k else 1.0, f0=140, f1=42, tau_a=0.4)
m.poser('batterie', I.roulement(r, 1.0, 8, 32, 100), T['releve'] - 1.0, 0.3, rev=0.25)

# ── L'horloge : tic-tac en croches pendant tout le problème ─────
for k in range(int(M_(4) / (tp / 2))):
    t = k * tp / 2
    m.poser('melodie', I.tic(r, 2400 if k % 2 == 0 else 1800, 0.05, bois=0.35), t, 0.14 if k % 2 == 0 else 0.1, pan=0.25 if k % 2 else -0.25)
# Les 47 semaines qui apparaissent : une pluie de petits tics.
for i in range(47):
    m.poser('melodie', I.tic(r, 3200 + (i % 6) * 180, 0.03, bois=0.1), 0.05 + i * 0.012 + 0.08, 0.035, pan=((i % 6) - 2.5) / 3)
# Le piano, clairsemé.
for t0, n in ((0.35, 'D4'), (0.95, 'A4'), (1.55, 'F4'), (2.4, 'Bb3'), (3.0, 'F4'), (3.6, 'D4')):
    m.poser('melodie', I.piano_fm(hz(n)), t0, 0.28, rev=0.45, ech_=0.25)

# ── Les accents ─────────────────────────────────────────────────
for k in range(5):                                            # les îlots montent
    m.poser('bruitages', I.ascension(hz(['D3', 'F3', 'A3', 'C4', 'E4'][k]), r, 0.8), T['ilots'] + 0.15 + k * 0.14, 0.22)
for j, n in enumerate(['A5', 'C6', 'D6', 'E6', 'F6']):         # les étiquettes
    m.poser('melodie', I.bulle(hz(n), r), T['ilots'] + 0.9 + j * 0.15, 0.22, pan=[-0.4, 0.4, -0.4, 0.4, -0.4][j], rev=0.2)
touche = m.sfx('key-press')
for k, t0 in enumerate((T['saisie'] + 0.15, T['saisie'] + tp + 0.15, T['saisie'] + 2 * tp + 0.15)):   # saisi trois fois
    for q in range(4):
        m.poser('bruitages', touche, t0 + q * 0.0625, 0.3, pan=(k - 1) * 0.4)
    m.poser('bruitages', m.sfx('glitch-3')[:, :ech(0.45)], t0 + 0.25, 0.22, pan=(k - 1) * 0.4)
    m.poser('melodie', I.cloche_fm(hz(['A5', 'G#5', 'G5'][k]), 0.8, ratio=1.41, indice=2.0, tau_a=0.3), t0 + 0.25, 0.15, pan=(k - 1) * 0.4)
    if k:
        m.poser('bruitages', I.souffle(0.3, r, pic=2600, bas=700, pan=(-(k - 1.5), k - 1.5), attaque=0.7), t0 - 0.25, 0.18)
m.poser('bruitages', I.impact(r, 1.6, 90, 42, 0.35), T['saisie'] + 3 * tp, 0.42, rev=0.3)       # « trois fois. »
m.poser('bruitages', I.impact(r, 1.8, 70, 36, 0.4), T['cout'] + 0.04, 0.45, rev=0.35)            # 209 h
for p in range(6):                                                                                  # les semaines tombent
    m.poser('melodie', I.chute(hz(['A5', 'G5', 'F5', 'E5', 'D5', 'C5'][p]), r, 0.7), T['cout'] + 0.45 + p * 0.1, 0.2, pan=(p - 2.5) / 4, rev=0.3)
m.poser('bruitages', I.montee(1.0, r, 400, 8000, (146.8, 293.7)), T['releve'] - 1.0, 0.32)
m.poser('bruitages', I.cymbale_inverse(r, 1.0), T['releve'] - 1.0, 0.22)
m.poser('bruitages', I.impact(r, 2.4, 60, 32, 0.5), T['releve'], 0.55, rev=0.4)                   # le relevé
m.poser('bruitages', I.cymbale(r, 2.6), T['releve'], 0.2, rev=0.3)
m.poser('bruitages', I.balayage(1.25, r), T['releve'] + 0.1, 0.3, rev=0.3)
for k in range(7):                                                                                  # la carte se trace
    m.poser('melodie', I.tic(r, hz(['F6', 'A6', 'C7', 'F6', 'A6', 'C7', 'F7'][k]), 0.06, bois=0.1), T['releve'] + 0.6 + k * 0.1, 0.12, pan=(k - 3) / 4)
for k in range(7):                                                                                  # les liens s'allument
    m.poser('melodie', I.etincelle(hz(['F5', 'G5', 'A5', 'C6', 'D6', 'F6', 'G6'][k]), r), T['relie'] + k * 0.07, 0.2, pan=(k - 3) / 4, rev=0.25)
for h, n in enumerate(['C5', 'F5', 'A5', 'C6']):                                                   # l'information file une fois
    m.poser('melodie', I.pincee(hz(n), r, 0.5, haut=5600, tau_a=0.25), T['relie'] + 0.9 + h * 0.3, 0.24, pan=[-0.4, 0.4, -0.4, 0.4][h], ech_=0.3)
m.poser('bruitages', I.souffle(1.25, r, pic=3000, bas=600, pan=(-0.6, 0.6), attaque=0.7), T['relie'] + 0.9, 0.22)
m.poser('bruitages', I.souffle(0.5, r, pic=2200, bas=500, pan=(0, 0), attaque=0.4), T['heures'] - 0.3, 0.25)   # la grille revient
for p in range(6):                                                                                  # les semaines reviennent
    m.poser('melodie', I.ascension(hz(['C5', 'D5', 'F5', 'G5', 'A5', 'C6'][p]), r, 0.7), T['heures'] + 0.35 + p * 0.1, 0.24, pan=(p - 2.5) / 4, rev=0.3)
m.poser('melodie', I.cloche_fm(hz('F5'), 2.0, ratio=2.0) + I.cloche_fm(hz('C6'), 2.0), T['heures'] + 0.98, 0.22, rev=0.45)
m.poser('bruitages', I.souffle(0.8, r, pic=2000, bas=400, pan=(0.4, -0.4), attaque=0.5), T['etapes'] - 0.3, 0.22)  # l'escalier
for i, n in enumerate(['F5', 'G5', 'A5', 'C6', 'D6']):                                               # cinq marches
    m.poser('melodie', I.pincee(hz(n), r, 0.6, haut=6000, tau_a=0.3), T['etapes'] + 0.5 + i * tp * 0.5, 0.26 + 0.03 * i, pan=(i - 2) / 4, rev=0.25, ech_=0.25)
for t0 in (T['saisie'] + 3 * tp, T['releve'] + 0.08 + tp, T['releve'] + 0.08 + 1.5 * tp, T['heures'] + 0.08 + 1.5 * tp, T['etapes'] + 0.08, T['etapes'] + 0.08 + tp):
    m.poser('bruitages', I.impact(r, 0.7, 120, 60, 0.2), t0, 0.16)                                  # les mots qui claquent
m.poser('bruitages', I.montee(0.9, r, 600, 9000, (174.6, 349.2)), T['marque'] - 0.6, 0.3)
m.poser('bruitages', I.souffle(0.8, r, pic=3000, bas=400, pan=(0, 0), attaque=0.6, grave=0.3), T['marque'] - 0.2, 0.32)
m.poser('bruitages', I.impact(r, 2.6, 62, 32, 0.55), T['flashR'], 0.6, rev=0.45)
m.poser('bruitages', I.cymbale(r, 3.0), T['flashR'], 0.22, rev=0.3)
for k, n in enumerate(['F5', 'A5', 'C6', 'F6', 'A6', 'C7']):
    m.poser('melodie', I.tic(r, hz(n), 0.08, bois=0.2), T['flashR'] + 0.2 + k * 0.06, 0.22, pan=(k - 2.5) / 4)
m.poser('melodie', I.cloche_fm(hz('F5'), 3.0, ratio=2.0, tau_a=1.2) + 0.6 * I.cloche_fm(hz('C6'), 3.0, tau_a=1.0), T_R, 0.3, rev=0.55, ech_=0.25)
m.poser('bruitages', I.souffle(0.9, r, pic=1600, bas=300, pan=(0.3, -0.3), attaque=0.5), T_R + 0.35, 0.2)
m.poser('bruitages', m.sfx('sparkle'), T_R + 0.8, 0.12, rev=0.3)
m.poser('melodie', I.bulle(hz('F6'), r, 0.3), T_R + 2.1, 0.3, rev=0.3)
m.poser('melodie', I.tic(r, 3000, 0.06), T_R + 2.5, 0.15)

for a, z in ((T['releve'] - 0.07, T['releve']), (T['flashR'] - 0.08, T['flashR'])):
    i, j = ech(a), ech(z)
    for b in list(m.bus.values()) + [m.envoi_rev, m.envoi_echo]:
        b.g[:, i:j] *= np.linspace(1, 0.05, j - i)

sortie = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sortie', 'c-pme.m4a')
print(m.mixer(sortie, rev=reponse(3.4, 0.025, 0.9, 13)))
print(sortie)
