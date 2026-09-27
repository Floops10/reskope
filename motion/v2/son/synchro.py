"""Vérifie qu'un MP4 rendu porte bien la bande-son, sans décalage.

On corrèle l'enveloppe d'énergie du son extrait du MP4 avec celle de la
bande-son d'origine : le pic de corrélation donne le décalage (0 attendu,
à ± 1 image près).
"""
import subprocess, sys
import numpy as np
from synthe import FFMPEG, SR


def lire(chemin):
    brut = subprocess.run([FFMPEG, '-v', 'error', '-i', chemin, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(brut, dtype=np.float32).astype(float)


def enveloppe(x, pas=240):
    n = len(x) // pas
    return np.sqrt(np.mean(x[:n * pas].reshape(n, pas) ** 2, axis=1))


mp4, ref = sys.argv[1], sys.argv[2]
a, b = enveloppe(lire(mp4)), enveloppe(lire(ref))
n = min(len(a), len(b))
a, b = a[:n] - a[:n].mean(), b[:n] - b[:n].mean()
lags = range(-60, 61)
c = [np.dot(a[max(0, l):n + min(0, l)], b[max(0, -l):n - max(0, l)]) for l in lags]
best = list(lags)[int(np.argmax(c))]
print(f'décalage : {best * 240 / SR * 1000:+.1f} ms (une image = 33,3 ms) · corrélation {max(c) / (np.linalg.norm(a) * np.linalg.norm(b)):.3f}')
