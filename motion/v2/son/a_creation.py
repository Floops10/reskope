"""Film A · en projet : ré majeur, 120 à la minute, 24 s.

La musique suit l'image : une étincelle seule (une cloche), le doute (si
mineur), la montée, puis le temps fort quand les douze futurs clients
s'allument, une note chacun, en montant. Le portrait se pose, le business
plan s'accroche, le saut accélère tout, et le logo tombe sur un grand
accord de ré.
"""
import os, sys
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from synthe import hz, ech, SR
from morceau import Morceau
import instruments as I

D = 24.0
m = Morceau(D, 120, graine=2026)
tp = m.tp  # 0,5 s
r = m.rng

# ── L'harmonie ──────────────────────────────────────────────────
ACC = {
    'Dmaj9': ['D3', 'A3', 'C#4', 'E4', 'F#4'], 'Bm11': ['B2', 'F#3', 'A3', 'D4', 'E4'],
    'D': ['D3', 'F#3', 'A3', 'C#4'], 'Aadd9': ['A2', 'E3', 'B3', 'C#4'], 'Bm7': ['B2', 'F#3', 'A3', 'D4'],
    'Gmaj7': ['G2', 'D3', 'F#3', 'B3'], 'D2': ['D3', 'A3', 'D4', 'F#4'], 'A': ['A2', 'E3', 'A3', 'C#4'],
    'Em7': ['E3', 'G3', 'B3', 'D4'], 'G': ['G2', 'D3', 'G3', 'B3'], 'Dfin': ['D2', 'A2', 'D3', 'F#3', 'A3', 'E4'],
}
grille = [(0, 2, 'Dmaj9'), (2, 3.95, 'Bm11'), (4, 6, 'D'), (6, 8, 'Aadd9'), (8, 10, 'Bm7'), (10, 12, 'Gmaj7'),
          (12, 14, 'D2'), (14, 15, 'A'), (15, 16, 'Em7'), (16, 17, 'G'), (17, 17.95, 'A'), (18, 23.2, 'Dfin')]
nappe = I.nappe([(a, b, [hz(n) for n in ACC[c]]) for a, b, c in grille], D, r, coupure=1500,
                brillance=lambda t: np.where(t < 4, 0.55 + 0.1 * t, np.where((t > 15) & (t < 18), 1 + 1.6 * ((t - 15) / 3) ** 2, 1.0)))
# L'intro reste en retrait : le temps fort doit frapper.
tn = np.arange(nappe.shape[1]) / SR
nappe *= np.where(tn < 3.6, 0.5, np.where(tn < 4.0, 0.5 + 0.5 * (tn - 3.6) / 0.4, 1.0))[None, :]
m.poser('nappe', nappe, 0, 0.8, rev=0.35)

# ── La basse : croches à contretemps, la fondamentale de chaque accord ──
FOND = {'D': 'D2', 'Aadd9': 'A1', 'Bm7': 'B1', 'Gmaj7': 'G1', 'D2': 'D2', 'A': 'A1', 'Dfin': 'D2'}
notes_b = []
for a, b, c in grille:
    if c not in FOND or a < 4:
        continue
    if c == 'Dfin':
        notes_b.append((18.0, 3.6, hz('D1')))
        continue
    t = a
    while t < b - 1e-6:
        notes_b.append((t + tp / 2, tp * 0.42, hz(FOND[c])))
        t += tp
m.poser('basse', I.basse(notes_b, D, r, rondeur=0.4, coupure=420), 0, 0.34)
m.poser('basse', I.basse([(2.0, 1.9, hz('B1'))], D, r, rondeur=0.2), 0, 0.12)

# ── La batterie ──────────────────────────────────────────────────
for k in range(22):                      # 4,0 → 14,5 : quatre temps
    m.kick(4.0 + k * tp)
for k in range(4):                       # 18 → 19,5 : le logo, au ralenti
    m.kick(18.0 + k * 2 * tp, gain=0.8 if k else 1.0)
for b in range(4, 15, 2):                # les claquements sur 2 et 4
    for tt in (b + tp, b + 3 * tp):
        if tt < 15:
            m.poser('batterie', I.claque(r), tt, 0.4, rev=0.18)
for k in range(88):                      # charleston en doubles croches
    t = 4.0 + k * tp / 4
    if t >= 15:
        break
    acc = [0.45, 0.25, 1.0, 0.3][k % 4]
    m.poser('batterie', I.charley(r, ouvert=(k % 8 == 6)), t, 0.11 * acc, pan=0.25 if k % 2 else -0.15)
m.poser('batterie', I.roulement(r, 1.0, 8, 32, 120), 3.0, 0.36, rev=0.2)
m.poser('batterie', I.roulement(r, 2.0, 8, 48, 120), 16.0, 0.42, rev=0.25)

# ── Les mélodies ─────────────────────────────────────────────────
# Intro : un scintillement en doubles croches, très doux.
ARP1 = ['D5', 'F#5', 'A5', 'C#6', 'E6', 'C#6', 'A5', 'F#5']
for k in range(12):
    t = 0.5 + k * tp / 2
    m.poser('melodie', I.pincee(hz(ARP1[k % 8]), r, 0.35, haut=3200, tau_a=0.16), t, 0.13 * (0.4 + 0.6 * k / 11), pan=(-0.4 if k % 2 else 0.4), ech_=0.5)
ARP2 = ['B4', 'D5', 'F#5', 'A5']
for k in range(6):
    m.poser('melodie', I.pincee(hz(ARP2[k % 4]), r, 0.4, haut=2400, tau_a=0.2), 2.0 + k * tp / 2 + 0.25, 0.1, pan=(-0.3 if k % 2 else 0.3), ech_=0.45)
# Les douze clients : une note chacun, en montant (pentatonique de ré).
PENTA = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5', 'B5', 'D6', 'E6']
for j in range(12):
    m.poser('melodie', I.pincee(hz(PENTA[j]), r, 0.55, haut=5000, tau_a=0.26), 4.0 + j * 0.25, 0.36, pan=np.sin(j * 1.7) * 0.5, rev=0.25, ech_=0.3)
# Le riff (mesures 4 à 7), sur les accords.
RIFF = {6: ['E5', 'C#5', 'A4', 'B4'], 8: ['F#5', 'D5', 'B4', 'A4'], 10: ['D5', 'B4', 'F#5', 'G5'], 12: ['A5', 'F#5', 'D5', 'E5']}
for a, notes in RIFF.items():
    for k in range(8):
        t = a + 0.25 + k * tp / 2 * 1.0
        if 7.5 <= t < 8.8 or 9.6 <= t < 10.2:
            continue
        m.poser('melodie', I.pincee(hz(notes[k % 4]), r, 0.4, haut=3800, tau_a=0.18), t, 0.2, pan=(-0.35 if k % 2 else 0.35), ech_=0.35)
for j, n in enumerate(['A4', 'D5', 'F#5', 'A5']):          # le business plan s'accroche
    m.poser('melodie', I.pincee(hz(n), r, 0.6, haut=6000, tau_a=0.3), 12.25 + j * 0.25, 0.28, pan=[-0.4, 0.4, -0.2, 0.2][j], rev=0.3, ech_=0.3)

# ── Les cloches et les bulles ────────────────────────────────────
m.poser('melodie', I.cloche_fm(hz('D6'), 2.4), 0.5, 0.32, rev=0.5, ech_=0.3)
m.poser('melodie', I.cloche_fm(hz('A6'), 2.0, ratio=2.0), 0.52, 0.12, rev=0.5)
m.poser('melodie', I.cloche_fm(hz('A5'), 1.8) + I.cloche_fm(hz('E6'), 1.8, ratio=2.0), 6.0, 0.28, rev=0.4)
m.poser('melodie', I.cloche_fm(hz('F#6'), 2.0, ratio=2.0) + I.cloche_fm(hz('A6'), 2.0), 9.75, 0.25, rev=0.5, ech_=0.25)
for j, n in enumerate(['A5', 'B5', 'D6', 'E6']):           # les étiquettes du portrait
    m.poser('melodie', I.bulle(hz(n), r), 10.25 + j * 0.2, 0.3, pan=[-0.5, 0.5, -0.4, 0.4][j], rev=0.2)
for j, n in enumerate(['D6', 'E6', 'F#6', 'A6']):          # les étiquettes du business plan
    m.poser('melodie', I.bulle(hz(n), r), 13.25 + j * 0.25, 0.26, pan=[0.5, -0.5, 0.5, -0.5][j], rev=0.2)
m.poser('melodie', I.cloche_fm(hz('D6'), 3.0, ratio=2.0, tau_a=1.2) + 0.6 * I.cloche_fm(hz('A6'), 3.0, tau_a=1.0), 19.4, 0.3, rev=0.55, ech_=0.25)
for k, n in enumerate(['D5', 'F#5', 'A5', 'D6', 'F#6', 'A6']):   # les traits du R
    m.poser('melodie', I.tic(r, hz(n) * 2, 0.08, bois=0.2), 18.42 + k * 0.1, 0.25, pan=(k - 2.5) / 4)
m.poser('melodie', I.bulle(hz('D6'), r, 0.3), 21.5, 0.32, rev=0.3)
m.poser('melodie', I.tic(r, 3000, 0.06), 21.9, 0.15)

# ── Les bruitages, calés sur l'image ─────────────────────────────
m.poser('bruitages', I.souffle(0.62, r, pic=4200, bas=900, pan=(0, 0), attaque=0.85), -0.12, 0.35)       # l'étincelle arrive
m.poser('bruitages', m.sfx('sparkle'), 0.48, 0.18, rev=0.3)
m.poser('bruitages', I.souffle(1.3, r, pic=1800, bas=260, pan=(0.3, -0.3), attaque=0.45, grave=0.4), 1.92, 0.5, rev=0.2)   # le recul
m.poser('bruitages', I.montee(1.0, r, fond=(146.8, 293.7)), 3.0, 0.4, rev=0.2)
m.poser('bruitages', I.cymbale_inverse(r, 1.0), 3.0, 0.24)
m.poser('bruitages', I.impact(r), 4.0, 0.5, rev=0.3)
m.poser('bruitages', I.cymbale(r), 4.0, 0.2, rev=0.2)
m.poser('bruitages', I.impact(r, 1.0, 90, 45, 0.3), 6.0, 0.35)
for w in range(3):                                                                       # les réponses reviennent
    m.poser('bruitages', I.souffle(0.5, r, pic=2600 + 500 * w, bas=700, pan=(0.6, 0), attaque=0.85), 7.5 + w * 0.36, 0.22)
m.poser('bruitages', I.souffle(1.35, r, pic=3000, bas=400, pan=(-0.5, 0.5), attaque=0.8, grave=0.3), 8.45, 0.45, rev=0.25)  # le portrait se forme
m.poser('bruitages', I.montee(1.2, r, 600, 7000, (220, 440)), 8.55, 0.22)
m.poser('bruitages', I.impact(r, 1.4, 70, 40, 0.25), 9.75, 0.42, rev=0.35)
m.poser('bruitages', I.souffle(0.5, r, pic=2200, bas=600, pan=(0, 0), attaque=0.3), 11.98, 0.25)      # la carte rétrécit
m.poser('bruitages', I.montee(3.0, r, 300, 9000, (110, 880), courbe=2.0), 15.0, 0.4, rev=0.25)         # le saut
m.poser('bruitages', I.souffle(3.0, r, pic=4200, bas=300, pan=(-0.2, 0.2), attaque=0.9, grave=0.4), 15.0, 0.34)
m.poser('bruitages', m.sfx('whoosh-cinematic'), 14.9, 0.3)
m.poser('bruitages', I.cymbale_inverse(r, 1.5), 16.5, 0.3)
m.poser('bruitages', I.impact(r, 2.8, 64, 34, 0.55), 18.0, 0.62, rev=0.45)
m.poser('bruitages', I.cymbale(r, 3.2), 18.0, 0.26, rev=0.3)
m.poser('bruitages', I.souffle(0.9, r, pic=1600, bas=300, pan=(0.3, -0.3), attaque=0.5), 19.75, 0.22)    # le R se range
m.poser('bruitages', m.sfx('sparkle'), 20.2, 0.12, rev=0.3)

# La respiration : tout se tait un instant avant le temps fort et avant le logo.
for a, z in ((3.93, 4.0), (17.9, 18.0)):
    i, j = ech(a), ech(z)
    for b in list(m.bus.values()) + [m.envoi_rev, m.envoi_echo]:
        b.g[:, i:j] *= np.linspace(1, 0.05, j - i)

sortie = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sortie', 'a-creation.m4a')
print(m.mixer(sortie))
print(sortie)
