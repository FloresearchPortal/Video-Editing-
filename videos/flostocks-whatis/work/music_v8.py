"""v8 soundtrack: a launch-video edit of Mixkit "Take this Higher" (#1012, Michael Ramir C.,
EDM, 124 BPM, D major) — Mixkit Stock Music Free License. Built to the reel's timeline:

    0.00–6.20   silent (chat; message sounds only)
    6.20        a filtered BUILD fades in gently from "yes they are" (frame 186): the groove
                under a low-pass that opens up — no hit, so nothing reads as the drop early;
                the punchline turns green on one of its beats (frame 272)
   10.516       one beat of silence while the bubble finishes opening
   11.000       DROP (frame 330) = bar 0, exactly 0:11 — full band hits as the FloStocks logo lands
    bars 0–8    drop A
    bar 8       break riser
    bar 9       stop bar: one hit, then three beats of silence ("Regulated.")
    bars 10–16  DROP B (the same big drop again)
    bar 16      one bar of the track's own decaying outro (CTA + disclaimer hold), then the end

The client wants NO vocals, so the edit is cut from the track's instrumental stem: Demucs
(htdemucs, two-stem, run locally — free) removes the vocal chops; the beat grid is unchanged,
so the picture stays in sync. The stop beats were vocal-only, so they become true silence.

Every splice is on the measured beat grid (124.000 BPM, phase 0.459 s, zero drift), 10 ms
before the transient, with a 12 ms crossfade.

    .venv/bin/python videos/flostocks-whatis/work/music_v8.py   -> edit/audio/music_v8.wav
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
MP3 = ROOT / "edit" / "audio" / "mixkit" / "1012.mp3"
SRC = ROOT / "edit" / "audio" / "mixkit" / "1012_instrumental.wav"  # vocals removed
OUT = ROOT / "edit" / "audio" / "music_v8.wav"
URL = "https://assets.mixkit.co/music/1012/1012.mp3"

BPM = 124.0
BEAT = 60 / BPM
PHASE = 0.459
DROP_S = 330 / 30
BUT_S = 186 / 30  # music starts at "yes they are" (name kept from the earlier cut)
EARLY = 0.010


def t(k: float) -> float:
    return PHASE + k * BEAT


def load() -> np.ndarray:
    if not MP3.exists():
        MP3.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(["curl", "-fsSL", "-A", "Mozilla/5.0", "-o", str(MP3), URL], check=True)
    if not SRC.exists():  # instrumental stem (needs `pip install demucs` in the venv)
        tmp = SRC.parent / "_sep"
        subprocess.run([sys.executable, "-m", "demucs", "--two-stems=vocals", "-n", "htdemucs", "-o", str(tmp), str(MP3)], check=True)
        (tmp / "htdemucs" / MP3.stem / "no_vocals.wav").rename(SRC)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(SRC), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2)


def cut(x, a, b):
    return x[int(round((a - EARLY) * SR)) : int(round((b - EARLY) * SR))].copy()


def join(parts, xf=0.012):
    n = int(xf * SR)
    out = parts[0]
    for p in parts[1:]:
        r = np.linspace(0, 1, n)[:, None]
        out = np.concatenate([out[:-n], out[-n:] * (1 - r) + p[:n] * r, p[n:]])
    return out


x = load()
# build: the groove right before the track's pre-drop hit, low-passed with a rising cutoff
build = cut(x, t(55) - (DROP_S - BUT_S - BEAT), t(55))
n = len(build)
cut_hz = 350 * (7000 / 350) ** (np.linspace(0, 1, n) ** 1.6)  # 350 Hz -> 7 kHz
out_b = np.zeros_like(build)
zi = np.zeros((1, 2, 2))  # (sections, state, channel)
for i in range(0, n, 512):
    sos = butter(2, min(cut_hz[i], SR / 2 - 100), "low", fs=SR, output="sos")
    for ch in range(2):
        out_b[i : i + 512, ch], zi[:, :, ch] = sosfilt(sos, build[i : i + 512, ch], zi=zi[:, :, ch])
ramp = np.clip(np.arange(n) / (SR * 2.2), 0, 1) ** 2  # slight, slow fade-in over 2.2 s from "yes they are"
pre = out_b * (ramp * 0.45)[:, None]  # stays well under the drop so the logo hit is the biggest moment
gap = np.zeros((int(round(BEAT * SR)), 2), np.float32)  # one silent beat into the drop
pre = np.concatenate([pre, gap])
tail = cut(x, t(187), t(191))
tail *= (np.linspace(1, 0, len(tail)) ** 1.3)[:, None]
show = join([
    pre,
    cut(x, t(59), t(91)),    # drop A, 8 bars
    cut(x, t(103), t(107)),  # break riser, 1 bar
    cut(x, t(55), t(59)),    # stop bar: hit + 3 beats of silence
    cut(x, t(59), t(83)),    # drop B, 6 bars
    tail,                    # outro decay, 1 bar
])
lead = np.zeros((int(round(BUT_S * SR)), 2), np.float32)
y = np.concatenate([lead, show])
y = np.concatenate([y, np.zeros((int(0.6 * SR), 2), np.float32)])
raw = OUT.with_suffix(".raw")
raw.write_bytes(y.astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw), str(OUT)], check=True)
raw.unlink()
barf = BEAT * 4 * 30
print(f"{OUT.name}: {len(y) / SR:.2f}s, drop at {DROP_S:.3f}s, bar = {barf:.3f} frames, end of outro = frame {330 + 17 * barf:.0f}")
