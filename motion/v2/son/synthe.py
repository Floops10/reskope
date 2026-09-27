"""La synthèse sonore des films Reskope (musique et bruitages), en numpy.

Tout est calculé, rien n'est échantillonné, sauf quelques bruitages de la
bibliothèque de HyperFrames (licence Pixabay, usage commercial libre) :
chaque son tombe à l'échantillon près sur l'image qui le justifie.

Principes de mixage : la basse reste mono, chaque note a ses fondus (pas de
clic), un passe-haut à 25 Hz retire le continu, le maître passe par une
saturation douce et un limiteur, puis ffmpeg ramène la sonie à -14 LUFS
(la norme des réseaux) avec un plafond à -1 dB crête vraie.
"""
import math, os, struct, subprocess
import numpy as np

SR = 48000
ICI = os.path.dirname(os.path.abspath(__file__))
SCRATCH = os.environ.get('RESKOPE_SCRATCH', '/private/tmp/claude-501/-Users-florian-bouchart-Library-Mobile-Documents-com-apple-CloudDocs-1-Mariage/f839b389-7588-48e0-8423-613b2b15ef21/scratchpad')
FFMPEG = os.environ.get('HYPERFRAMES_FFMPEG_PATH', os.path.join(SCRATCH, 'hf/node_modules/ffmpeg-static/ffmpeg'))
SFX = os.path.join(SCRATCH, 'hf/node_modules/hyperframes/dist/skills/media-use/audio/assets/sfx')


def ech(s):
    return int(round(s * SR))


def note(n):
    """Fréquence d'une note MIDI (69 = la 440)."""
    return 440.0 * 2 ** ((n - 69) / 12)


NOMS = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def midi(nom):
    """'F#3' → 54, 'Bb2' → 46."""
    b = NOMS[nom[0]]
    i = 1
    while i < len(nom) and nom[i] in '#b':
        b += 1 if nom[i] == '#' else -1
        i += 1
    return b + 12 * (int(nom[i:]) + 1)


def hz(nom):
    return note(midi(nom))


# ── Oscillateurs (à bande limitée : pas de repliement) ──────────────
def _phase(freq, n, phi0=0.0):
    inc = np.full(n, float(freq) / SR) if np.isscalar(freq) else np.asarray(freq, dtype=float) / SR
    ph = (phi0 + np.cumsum(inc) - inc[0]) % 1.0
    return ph, inc


def _polyblep(t, dt):
    out = np.zeros_like(t)
    m = t < dt
    x = t[m] / dt[m]
    out[m] = x + x - x * x - 1.0
    m = t > 1.0 - dt
    x = (t[m] - 1.0) / dt[m]
    out[m] = x * x + x + x + 1.0
    return out


def scie(freq, n, phi0=0.0):
    ph, inc = _phase(freq, n, phi0)
    return 2.0 * ph - 1.0 - _polyblep(ph, inc)


def carre(freq, n, phi0=0.0, largeur=0.5):
    ph, inc = _phase(freq, n, phi0)
    s = np.where(ph < largeur, 1.0, -1.0)
    s += _polyblep(ph, inc)
    s -= _polyblep((ph + 1.0 - largeur) % 1.0, inc)
    return s


def sinus(freq, n, phi0=0.0):
    ph, _ = _phase(freq, n, phi0)
    return np.sin(2 * np.pi * ph)


def bruit(n, rng):
    return rng.standard_normal(n)


# ── Enveloppes ─────────────────────────────────────────────────────
def enveloppe(n, attaque=0.005, declin=0.2, maintien=0.0, relache=0.05, duree=None):
    """ADSR à segments exponentiels ; duree = moment du relâchement (s)."""
    t = np.arange(n) / SR
    duree = duree if duree is not None else n / SR
    e = np.where(t < attaque, t / max(attaque, 1e-6), maintien + (1 - maintien) * np.exp(-(t - attaque) / max(declin, 1e-6)))
    rel = t >= duree
    if rel.any():
        v = e[np.argmax(rel)] if rel.any() else 0
        e[rel] = v * np.exp(-(t[rel] - duree) / max(relache, 1e-6))
    return e


def fondus(x, debut=0.002, fin=0.01):
    """Aucun son ne commence ni ne finit sec."""
    n = x.shape[-1]
    a, b = min(n, ech(debut)), min(n, ech(fin))
    if a:
        x[..., :a] *= np.linspace(0, 1, a)
    if b:
        x[..., n - b:] *= np.linspace(1, 0, b)
    return x


# ── Filtres ────────────────────────────────────────────────────────
def svf(x, fc, q=0.707, mode='lp'):
    """Filtre à variables d'état (TPT), coupure pouvant varier à chaque échantillon."""
    n = len(x)
    fc = np.broadcast_to(np.asarray(fc, dtype=float), (n,))
    g = np.tan(np.pi * np.clip(fc, 12.0, SR * 0.45) / SR)
    k = 1.0 / q
    a1 = 1.0 / (1.0 + g * (g + k))
    a2 = g * a1
    a3 = g * a2
    ic1 = ic2 = 0.0
    lp = np.empty(n); bp = np.empty(n)
    xs = x.tolist(); A1 = a1.tolist(); A2 = a2.tolist(); A3 = a3.tolist()
    for i in range(n):
        v3 = xs[i] - ic2
        v1 = A1[i] * ic1 + A2[i] * v3
        v2 = ic2 + A2[i] * ic1 + A3[i] * v3
        ic1 = 2.0 * v1 - ic1
        ic2 = 2.0 * v2 - ic2
        lp[i] = v2; bp[i] = v1
    if mode == 'lp':
        return lp
    if mode == 'bp':
        return bp * k
    return x - k * bp - lp


def egaliseur(x, gain):
    """Filtre à phase nulle par FFT : gain(f) → facteur, appliqué à chaque canal."""
    x = np.atleast_2d(x)
    n = x.shape[-1]
    N = 1 << (n - 1).bit_length()
    f = np.fft.rfftfreq(N, 1 / SR)
    G = gain(f)
    out = np.empty_like(x)
    for c in range(x.shape[0]):
        X = np.fft.rfft(x[c], N)
        out[c] = np.fft.irfft(X * G, N)[:n]
    return out


def passe_haut(f0, ordre=2):
    return lambda f: 1.0 / np.sqrt(1.0 + (f0 / np.maximum(f, 1e-3)) ** (2 * ordre))


def passe_bas(f0, ordre=2):
    return lambda f: 1.0 / np.sqrt(1.0 + (f / f0) ** (2 * ordre))


def etagere(f0, db, haut=True):
    """Étagère douce (haut ou bas) de db décibels."""
    g = 10 ** (db / 20)
    def h(f):
        s = 1.0 / (1.0 + (f0 / np.maximum(f, 1e-3)) ** 2) if haut else 1.0 / (1.0 + (np.maximum(f, 1e-3) / f0) ** 2)
        return 1.0 + (g - 1.0) * s
    return h


def cloche(f0, db, largeur=1.0):
    g = 10 ** (db / 20)
    return lambda f: 1.0 + (g - 1.0) * np.exp(-(np.log2(np.maximum(f, 1e-3) / f0) / largeur) ** 2)


# ── Réverbération et écho ─────────────────────────────────────────
def reponse(duree=2.6, predelai=0.018, clarte=1.0, graine=7, largeur=1.0):
    """Une salle synthétique : bruit décorrélé par canal, les aigus s'éteignent plus vite."""
    rng = np.random.default_rng(graine)
    n = ech(duree)
    t = np.arange(n) / SR
    N = 1 << (n - 1).bit_length()
    f = np.fft.rfftfreq(N, 1 / SR)
    ir = np.zeros((2, n + ech(predelai)))
    for c in range(2):
        X = np.fft.rfft(rng.standard_normal(N))
        bas = np.fft.irfft(X * (f < 400), N)[:n]
        mil = np.fft.irfft(X * ((f >= 400) & (f < 3500)), N)[:n]
        hau = np.fft.irfft(X * (f >= 3500), N)[:n]
        e = lambda k: np.exp(-t * 6.9 / (duree * k))
        s = bas * e(1.0) + mil * e(0.8) + hau * e(0.42 * clarte)
        s *= np.minimum(1.0, t / 0.012)
        ir[c, ech(predelai):] = s
    m = (ir[0] + ir[1]) / 2
    ir = m + (ir - m) * largeur
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


def convoluer(x, ir):
    x = np.atleast_2d(x)
    if x.shape[0] == 1:
        x = np.vstack([x, x])
    n = x.shape[1] + ir.shape[1]
    N = 1 << (n - 1).bit_length()
    out = np.zeros((2, n))
    for c in range(2):
        out[c] = np.fft.irfft(np.fft.rfft(x[c], N) * np.fft.rfft(ir[c], N), N)[:n]
    return out[:, :x.shape[1]]


def echo(x, temps, retour=0.35, n=6, croise=True, sombre=3500.0):
    """Écho ping-pong : chaque répétition plus douce et plus sombre."""
    x = np.atleast_2d(x)
    if x.shape[0] == 1:
        x = np.vstack([x, x])
    out = np.zeros_like(x)
    d = ech(temps)
    courant = x.copy()
    for k in range(1, n + 1):
        courant = egaliseur(courant, passe_bas(sombre, 1)) * retour
        if croise:
            courant = courant[::-1]
        dec = k * d
        if dec >= x.shape[1]:
            break
        out[:, dec:] += courant[:, :x.shape[1] - dec]
    return out


# ── La console ─────────────────────────────────────────────────────
class Piste:
    """Un bus stéréo où l'on pose des sons à des instants précis."""

    def __init__(self, duree):
        self.duree = duree
        self.g = np.zeros((2, ech(duree + 4.0)))

    def poser(self, son, t, gain=1.0, pan=0.0):
        son = np.atleast_2d(np.asarray(son, dtype=float))
        if son.shape[0] == 1:
            a = (pan + 1) * math.pi / 4
            son = np.vstack([son[0] * math.cos(a), son[0] * math.sin(a)]) * math.sqrt(2)
        elif pan:
            a = (pan + 1) * math.pi / 4
            son = np.vstack([son[0] * math.cos(a) * math.sqrt(2), son[1] * math.sin(a) * math.sqrt(2)])
        i = ech(t)
        if i < 0:
            son = son[:, -i:]
            i = 0
        j = min(self.g.shape[1], i + son.shape[1])
        if j > i:
            self.g[:, i:j] += son[:, :j - i] * gain
        return self

    def __iadd__(self, autre):
        self.g += autre.g
        return self


def lire_sfx(nom, gain=1.0):
    """Un bruitage de la bibliothèque HyperFrames, décodé en 48 kHz stéréo."""
    chemin = os.path.join(SFX, nom + '.mp3')
    brut = subprocess.run([FFMPEG, '-v', 'error', '-i', chemin, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(brut, dtype=np.float32).reshape(-1, 2).T.astype(float) * gain


def pompe(duree, frappes, profondeur=0.6, relache=0.18, attaque=0.004):
    """Le souffle de la basse et des nappes sous la grosse caisse (sidechain)."""
    n = ech(duree + 4.0)
    g = np.ones(n)
    t = np.arange(n) / SR
    for tk in frappes:
        i = ech(tk)
        m = t >= tk
        seg = t[m] - tk
        v = profondeur * np.where(seg < attaque, seg / attaque, np.exp(-(seg - attaque) / relache))
        g[m] = np.minimum(g[m], 1 - v)
    return g


def limiteur(x, plafond=0.891, relache=0.08, avance=0.004):
    """Limiteur à anticipation : le gain descend avant la crête, remonte doucement."""
    pic = np.max(np.abs(x), axis=0)
    a = ech(avance)
    pic = np.maximum.reduce([np.roll(pic, -k) for k in range(0, a + 1, max(1, a // 8))])
    besoin = np.minimum(1.0, plafond / np.maximum(pic, 1e-9))
    g = np.empty_like(besoin)
    coef = math.exp(-1.0 / (relache * SR))
    v = 1.0
    b = besoin.tolist()
    for i in range(len(b)):
        v = b[i] if b[i] < v else b[i] + (v - b[i]) * coef
        g[i] = v
    return x * g


def ecrire_wav(chemin, x):
    """WAV 32 bits flottants, stéréo, 48 kHz."""
    x = np.asarray(x, dtype=np.float32)
    donnees = x.T.tobytes()
    with open(chemin, 'wb') as f:
        f.write(b'RIFF' + struct.pack('<I', 36 + len(donnees)) + b'WAVE')
        f.write(b'fmt ' + struct.pack('<IHHIIHH', 16, 3, 2, SR, SR * 8, 8, 32))
        f.write(b'data' + struct.pack('<I', len(donnees)) + donnees)


def matricer(bus, duree, sortie, cible_lufs=-14.0):
    """Somme, colle, limite, écrit le WAV puis l'AAC normalisé en sonie."""
    x = sum(b.g for b in bus)[:, :ech(duree)]
    x = egaliseur(x, passe_haut(25, 2))
    x = np.tanh(x * 0.9) / 0.9
    x = limiteur(x, 0.89)
    fin = ech(0.6)
    x[:, -fin:] *= np.linspace(1, 0, fin) ** 2
    os.makedirs(os.path.dirname(sortie), exist_ok=True)
    wav = sortie.replace('.m4a', '.wav')
    ecrire_wav(wav, x)
    # Mesure, puis normalisation (deux passes) à -14 LUFS, -1 dB crête vraie.
    mesure = subprocess.run([FFMPEG, '-hide_banner', '-i', wav, '-af', f'loudnorm=I={cible_lufs}:TP=-1.0:LRA=9:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    import json
    j = json.loads(mesure[mesure.rindex('{'):mesure.rindex('}') + 1])
    filtre = (f"loudnorm=I={cible_lufs}:TP=-1.0:LRA=9:measured_I={j['input_i']}:measured_TP={j['input_tp']}:"
              f"measured_LRA={j['input_lra']}:measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
    subprocess.run([FFMPEG, '-v', 'error', '-y', '-i', wav, '-af', filtre + ',aresample=48000', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', sortie], check=True)
    return j
