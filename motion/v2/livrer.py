"""Les fichiers à poster, tirés des rendus HyperFrames (motion/v2/rendus/).

Pour chaque film :
  - <film>-9x16.mp4 : le vertical 1080 × 1920 (Reels, TikTok, Shorts, stories),
    H.264 + AAC, démarrage rapide (faststart) ;
  - <film>-4x5.mp4  : le recadrage 1080 × 1350 pour les fils Instagram et
    LinkedIn (tout le texte a été placé dans cette zone dès le départ) ;
  - <film>-couverture.jpg : l'image de couverture (la signature finale).

Lancer : ~/.claude/skills/seo/.venv/bin/python motion/v2/livrer.py [en-projet|TPE|PME ...]
"""
import os, subprocess, sys

ICI = os.path.dirname(os.path.abspath(__file__))
RENDUS = os.path.join(ICI, 'rendus')
SORTIE = os.path.join(RENDUS, 'a-poster')
FF = os.environ.get('HYPERFRAMES_FFMPEG_PATH', '/private/tmp/claude-501/-Users-florian-bouchart-Library-Mobile-Documents-com-apple-CloudDocs-1-Mariage/f839b389-7588-48e0-8423-613b2b15ef21/scratchpad/hf/node_modules/ffmpeg-static/ffmpeg')
FILMS = {'Reskope-en-projet': 23.4, 'Reskope-TPE': 25.6, 'Reskope-PME': 23.4}
H264 = ['-c:v', 'libx264', '-preset', 'slow', '-crf', '19', '-profile:v', 'high', '-level:v', '4.2', '-pix_fmt', 'yuv420p',
        '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-movflags', '+faststart']


def ff(*args):
    subprocess.run([FF, '-v', 'error', '-y', *args], check=True)


os.makedirs(SORTIE, exist_ok=True)
for film, t_couv in FILMS.items():
    if len(sys.argv) > 1 and not any(a in film for a in sys.argv[1:]):
        continue
    src = os.path.join(RENDUS, film + '.mp4')
    if not os.path.exists(src):
        print(f'{film} : pas de rendu')
        continue
    ff('-i', src, *H264, os.path.join(SORTIE, f'{film}-9x16.mp4'))
    ff('-i', src, '-vf', 'crop=1080:1350:0:285', *H264, os.path.join(SORTIE, f'{film}-4x5.mp4'))
    ff('-ss', str(t_couv), '-i', src, '-frames:v', '1', '-q:v', '2', os.path.join(SORTIE, f'{film}-couverture.jpg'))
    tailles = [os.path.getsize(os.path.join(SORTIE, f'{film}-{s}')) // (1 << 20) for s in ('9x16.mp4', '4x5.mp4')]
    print(f'{film} : 9:16 {tailles[0]} Mo · 4:5 {tailles[1]} Mo')
