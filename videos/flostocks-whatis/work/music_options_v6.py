"""Cut music-option previews for the v6 approval round.

Each option is a free Mixkit track (Mixkit Stock Music Free License) edited to the reel's
shape: fade-in from "but" (2.27 s before the drop), drop 1 (8 bars), the last bars of a
break/build, drop 2, then a short tail. Splices sit on the beat grid measured from each
track (tempo + phase), with 12 ms crossfades. Sources are downloaded to edit/audio/mixkit/
(git-ignored; Mixkit forbids standalone redistribution).

    .venv/bin/python videos/flostocks-whatis/work/music_options_v6.py
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "edit" / "audio" / "mixkit"
OUT = ROOT / "edit" / "music_options"
PRE = 2.27  # "but" -> drop in the chat timeline

# id, title, beat (s), drop1, (break-tail start, end), drop2 start, bars in drop1/drop2
OPTIONS = [  # beat = 60/BPM exactly; times snapped to the measured grid (zero drift)
    ("A", 470, "Golden Storm", 60 / 127, 15.3271, (41.7838, 45.5633), 45.5633, 8, 8),
    ("B", 468, "Expressive Courage", 60 / 127, 15.3261, (56.9009, 60.6804), 60.6804, 8, 8),
    ("C", 371, "Cat Walk", 60 / 130, 29.9705, (85.3551, 89.0474), 89.0474, 8, 8),
    ("D", 115, "Kraft Twerk", 60 / 118, 36.6087, (32.5409, 36.6087), 52.8799, 8, 8),
    ("E", 136, "Infected Mushroom Vibes", 60 / 145, 33.3634, (30.0531, 33.3634), 46.6048, 8, 8),
    ("F", 719, "Drum and Bass Vibes", 60 / 88, 21.8422, (41.6149, 43.6604), 43.6604, 8, 4),
]


def load(i: int) -> np.ndarray:
    SRC.mkdir(parents=True, exist_ok=True)
    p = SRC / f"{i}.mp3"
    if not p.exists():
        subprocess.run(["curl", "-fsSL", "-A", "Mozilla/5.0", "-o", str(p), f"https://assets.mixkit.co/music/{i}/{i}.mp3"], check=True)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(p), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)


EARLY = 0.010  # splice just before each transient so attacks survive the crossfade


def cut(x, a, b):
    return x[int(round((a - EARLY) * SR)) : int(round((b - EARLY) * SR))].copy()


def join(parts, xf=0.012):
    n = int(xf * SR)
    out = parts[0]
    for p in parts[1:]:
        r = np.linspace(0, 1, n)[:, None]
        mid = out[-n:] * (1 - r) + p[:n] * r
        out = np.concatenate([out[:-n], mid, p[n:]])
    return out


for tag, i, title, beat, d1, (b0, b1), d2, n1, n2 in OPTIONS:
    x = load(i)
    bar = beat * 4
    pre = cut(x, d1 - PRE, d1)
    pre *= (np.linspace(0, 1, len(pre)) ** 1.6)[:, None]
    tail = cut(x, d2 + n2 * bar, d2 + n2 * bar + 2 * bar)
    tail *= (np.linspace(1, 0, len(tail)) ** 2.2)[:, None]
    y = join([pre, cut(x, d1, d1 + n1 * bar), cut(x, b0, b1), cut(x, d2, d2 + n2 * bar), tail])
    wav = OUT / f"_{tag}.wav"
    OUT.mkdir(parents=True, exist_ok=True)
    raw = wav.with_suffix(".raw")
    raw.write_bytes(y.astype(np.float32).tobytes())
    name = OUT / f"{tag}_{title.lower().replace(' ', '_')}.mp3"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw),
                    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-b:a", "192k", str(name)], check=True)
    raw.unlink()
    print(f"{tag} {title:26} {len(y) / SR:5.1f}s  ({60 / beat:.0f} BPM)  -> {name.name}")
