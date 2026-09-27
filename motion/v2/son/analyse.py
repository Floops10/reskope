"""Contrôle objectif d'une bande-son (on ne peut pas l'écouter ici).

- l'équilibre spectral moyen, par octave, comparé à une pente de référence ;
- la sonie momentanée (fenêtres de 400 ms), seconde par seconde ;
- les crêtes, le continu, les attaques détectées (pour vérifier le calage).
"""
import os, re, subprocess, sys
import numpy as np
from synthe import FFMPEG, SR

chemin = sys.argv[1]
brut = subprocess.run([FFMPEG, '-v', 'error', '-i', chemin, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
x = np.frombuffer(brut, dtype=np.float32).reshape(-1, 2).T.astype(float)
m = x.mean(axis=0)
print(f'durée {x.shape[1] / SR:.2f} s · crête {20 * np.log10(np.max(np.abs(x)) + 1e-12):.2f} dBFS · continu {np.mean(m):+.5f}')
# Spectre moyen par octave.
N = 1 << 15
fen = np.hanning(N)
acc = np.zeros(N // 2 + 1)
nb = 0
for i in range(0, len(m) - N, N // 2):
    acc += np.abs(np.fft.rfft(m[i:i + N] * fen)) ** 2
    nb += 1
f = np.fft.rfftfreq(N, 1 / SR)
bandes = [(20, 40), (40, 80), (80, 160), (160, 320), (320, 640), (640, 1280), (1280, 2560), (2560, 5120), (5120, 10240), (10240, 20000)]
ref = None
print('octave (Hz)      niveau   écart à une pente de -3 dB/oct (réf. 80-160 Hz)')
niv = []
for a, b in bandes:
    e = acc[(f >= a) & (f < b)].sum() / nb
    niv.append(10 * np.log10(e + 1e-20))
r = niv[2]
for k, (a, b) in enumerate(bandes):
    attendu = r - 3.0 * (k - 2)
    print(f'{a:>6}-{b:<6} {niv[k] - r:+7.1f} dB   {niv[k] - attendu:+6.1f}')
# Sonie momentanée par tranche d'une demi-seconde.
sortie = subprocess.run([FFMPEG, '-hide_banner', '-nostats', '-i', chemin, '-af', 'ebur128=framelog=info', '-f', 'null', '-'], capture_output=True, text=True).stderr
M = [(float(t), float(v)) for t, v in re.findall(r't:\s*([\d.]+)\s+TARGET.*?M:\s*(-?[\d.]+)', sortie)]
ligne = []
for s in np.arange(0.5, x.shape[1] / SR, 0.5):
    vals = [v for t, v in M if s - 0.25 <= t < s + 0.25]
    if vals:
        ligne.append(f'{s:4.1f}:{np.mean(vals):5.1f}')
print('sonie momentanée (LUFS) :')
for i in range(0, len(ligne), 8):
    print('  ' + '  '.join(ligne[i:i + 8]))
# Attaques (flux spectral) pour vérifier le calage sur l'image.
H = 512
spec = []
for i in range(0, len(m) - 2048, H):
    spec.append(np.abs(np.fft.rfft(m[i:i + 2048] * np.hanning(2048)))[:400])
spec = np.log1p(np.array(spec) * 10)
flux = np.maximum(0, np.diff(spec, axis=0)).sum(axis=1)
flux = (flux - np.median(flux)) / (np.std(flux) + 1e-9)
pics = [i for i in range(1, len(flux) - 1) if flux[i] > 3.0 and flux[i] >= flux[i - 1] and flux[i] >= flux[i + 1]]
temps = [round((i + 1) * H / SR, 3) for i in pics]
print('attaques fortes (s) :', ' '.join(f'{t:.2f}' for t in temps[:80]))
