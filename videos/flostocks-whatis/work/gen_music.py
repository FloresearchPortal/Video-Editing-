"""Synthesise the music bed for the FloStocks "What is FloStocks?" reel — 100% local, no
samples, no third-party rights (deterministic numpy synthesis, like reelkit.sfx_gen).

Minimal driving electronic bed: 126 BPM, A minor, four-on-the-floor kick, off-beat hats,
sub bass, plucked arp and a soft pad with a sidechain-style pump so it sits under SFX.

    .venv/bin/python videos/flostocks-whatis/work/gen_music.py
Writes: videos/flostocks-whatis/edit/music_bed.wav (~62 s, 48 kHz stereo)
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

SR = 48000
BPM = 126.0
BEAT = 60.0 / BPM
BARS = 33  # ~62.9 s
DUR = BARS * 4 * BEAT
N = int(DUR * SR)
t = np.arange(N) / SR

rng = np.random.default_rng(7)


def env_exp(n: int, decay: float) -> np.ndarray:
    x = np.arange(n) / SR
    return np.exp(-x * decay)


def place(buf: np.ndarray, clip: np.ndarray, at_s: float, gain: float = 1.0) -> None:
    i = int(at_s * SR)
    j = min(N, i + len(clip))
    if i < N:
        buf[i:j] += clip[: j - i] * gain


# ---- drums ------------------------------------------------------------------
kick_len = int(0.28 * SR)
kt = np.arange(kick_len) / SR
kick = np.sin(2 * np.pi * (48 + 90 * np.exp(-kt * 28)) * kt) * env_exp(kick_len, 11.0)

hat_len = int(0.05 * SR)
hat = rng.standard_normal(hat_len) * env_exp(hat_len, 90.0) * 0.32

clap_len = int(0.16 * SR)
clap = rng.standard_normal(clap_len) * env_exp(clap_len, 26.0) * 0.5

drums = np.zeros(N)
beats = int(DUR / BEAT)
for b in range(beats):
    bt = b * BEAT
    bar = b // 4
    if 1 <= bar < BARS - 1:  # one-bar intro/outro without kick
        place(drums, kick, bt, 0.95)
    place(drums, hat, bt + BEAT / 2, 0.8)
    if bar >= 2 and b % 4 == 2:
        place(drums, clap, bt, 0.65)

# ---- notes ------------------------------------------------------------------
A1, A2 = 55.0, 110.0
AM = {"A": 110.0, "C": 130.81, "D": 146.83, "E": 164.81, "F": 174.61, "G": 196.0}
# Am — F — C — G progression, one chord per bar
PROG = [("A", "C", "E"), ("F", "A", "C"), ("C", "E", "G"), ("G", "D", "E")]


def pluck(freq: float, dur_s: float) -> np.ndarray:
    n = int(dur_s * SR)
    x = np.arange(n) / SR
    wave = np.sign(np.sin(2 * np.pi * freq * x)) * 0.35 + np.sin(2 * np.pi * freq * x) * 0.65
    return wave * env_exp(n, 9.0)


bass = np.zeros(N)
arp = np.zeros(N)
pad = np.zeros(N)
for bar in range(BARS):
    chord = PROG[bar % 4]
    bar_t = bar * 4 * BEAT
    root = AM[chord[0]]
    # sub bass: root, eighth notes
    for e in range(8):
        at = bar_t + e * BEAT / 2
        nlen = int(BEAT / 2 * 0.9 * SR)
        x = np.arange(nlen) / SR
        f = root / 2 if root >= A2 else root
        note = np.sin(2 * np.pi * f * x) * np.minimum(1, x * 200) * np.exp(-x * 3.0)
        place(bass, note, at, 0.5)
    # arp: chord tones, sixteenths, two octaves up
    if 2 <= bar < BARS - 1:
        for s in range(16):
            at = bar_t + s * BEAT / 4
            f = AM[chord[s % 3]] * (4 if s % 8 < 6 else 8)
            place(arp, pluck(f, BEAT / 4 * 1.1), at, 0.16)
    # pad: triad, whole bar
    nlen = int(4 * BEAT * SR)
    x = np.arange(nlen) / SR
    fade = np.minimum(1, x * 4) * np.minimum(1, (4 * BEAT - x) * 2)
    tri = sum(np.sin(2 * np.pi * AM[c] * 2 * x + k) for k, c in enumerate(chord))
    place(pad, tri * fade, bar_t, 0.085)

mix = drums + bass + arp + pad

# sidechain-style pump against the kick grid
pump = np.ones(N)
for b in range(beats):
    if 1 <= (b // 4) < BARS - 1:
        i = int(b * BEAT * SR)
        n = int(0.22 * SR)
        j = min(N, i + n)
        x = np.arange(j - i) / (j - i)
        pump[i:j] *= 0.45 + 0.55 * x
mix = drums * 0.9 + (bass + arp + pad) * pump

# gentle stereo: haas-delayed arp/pad on the right
delay = int(0.012 * SR)
right = np.copy(mix)
right[delay:] += (arp + pad)[:-delay] * pump[:-delay] * 0.35
left = mix + (arp + pad) * pump * 0.35

peak = max(np.abs(left).max(), np.abs(right).max())
left, right = left / peak * 0.85, right / peak * 0.85
stereo = np.stack([left, right], axis=1).astype(np.float32)

out = Path(__file__).resolve().parent.parent / "edit" / "music_bed.wav"
out.parent.mkdir(parents=True, exist_ok=True)
raw = out.with_suffix(".raw")
raw.write_bytes(stereo.tobytes())
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw),
     "-af", "lowpass=f=14000,alimiter=limit=0.9", str(out)],
    check=True,
)
raw.unlink()
print(f"wrote {out} ({DUR:.1f}s)")
