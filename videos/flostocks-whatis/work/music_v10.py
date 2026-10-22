"""v10 soundtrack: launch edit of Mixkit "Take this Higher" (#1012, Michael Ramir C., 124 BPM) —
Mixkit Stock Music Free License — cut from its instrumental stem (vocals removed locally with
Demucs, see music_v8.py), plus a synthesised noise riser + snare roll (made here, no samples).

    0.00–3.73   silent (chat; message sounds only)
    3.73        BUILD starts under "Wo tou pmex ke top broker nai?" (frame 112): the groove under a
                low-pass that opens up, gain rising slowly through the last three messages
    9.07        the punchline turns green on a beat (frame 272) — the build is clearly loud now;
                a riser + accelerating snare roll push into the drop
   11.000       DROP (frame 330) — the green message cuts straight to the FloStocks logo on it
    bars 0–8    drop A
    bar 8       break riser  ┐ "Regulated."
    bar 9       stop bar: one hit, three beats of silence  ┘
    bars 10–13  drop B (feature montage)
    bar 13      build: the break + riser + accelerating snare roll ("All of PSX. One account.")
    bar 14      the CTA drop ("Open your PSX account today.")
    bars 15–16.5  the beat goes silent: decaying outro under the logo + disclaimer

Every splice sits on the measured beat grid (124.000 BPM, phase 0.459 s), 10 ms before the
transient, with 12 ms crossfades; the build is phase-locked so its beats land on the video grid.

    .venv/bin/python videos/flostocks-whatis/work/music_v10.py   -> edit/audio/music_v10.wav
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "edit" / "audio" / "mixkit" / "1012_instrumental.wav"  # built by music_v8.py
OUT = ROOT / "edit" / "audio" / "music_v10.wav"

BPM = 124.0
BEAT = 60 / BPM
BAR = 4 * BEAT
PHASE = 0.459
EARLY = 0.010
START_S = 112 / 30  # "Wo tou pmex ke top broker nai?"
GREEN_S = 272 / 30
DROP_S = 330 / 30
rng = np.random.default_rng(7)


def t(k: float) -> float:
    return PHASE + k * BEAT


def load() -> np.ndarray:
    if not SRC.exists():
        raise SystemExit(f"missing {SRC} — run work/music_v8.py once (downloads + separates the track)")
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


def sweep(x: np.ndarray, hz: np.ndarray, kind: str) -> np.ndarray:
    """2nd-order Butterworth whose cutoff follows `hz` (block-wise, state carried)."""
    out = np.zeros_like(x)
    zi = np.zeros((1, 2, x.shape[1]))
    for i in range(0, len(x), 512):
        sos = butter(2, float(np.clip(hz[i], 40, SR / 2 - 200)), kind, fs=SR, output="sos")
        for ch in range(x.shape[1]):
            out[i : i + 512, ch], zi[:, :, ch] = sosfilt(sos, x[i : i + 512, ch], zi=zi[:, :, ch])
    return out


def riser(seconds: float, peak_db: float) -> np.ndarray:
    n = int(seconds * SR)
    noise = rng.standard_normal((n, 2)).astype(np.float32) * 0.5
    u = np.linspace(0, 1, n)
    y = sweep(noise, 300 * (9000 / 300) ** u, "high")
    return y * (10 ** ((peak_db - 30 * (1 - u) ** 1.5) / 20))[:, None]


def roll(seconds: float, peak_db: float) -> np.ndarray:
    """Accelerating snare roll: quarters → 8ths → 16ths → 32nds, crescendo, over `seconds`."""
    n = int(seconds * SR)
    out = np.zeros((n, 2), np.float32)
    hit_n = int(0.07 * SR)
    burst = rng.standard_normal(hit_n).astype(np.float32)
    burst = sosfilt(butter(2, [1500, 7000], "band", fs=SR, output="sos"), burst) * np.exp(-np.linspace(0, 9, hit_n))
    bars = seconds / BAR
    pos = 0.0
    while pos < seconds - 0.01:
        u = pos / seconds
        div = 1 if u < 0.25 else 2 if u < 0.5 else 4 if u < 0.75 else 8
        if bars < 1.5:  # one-bar roll: start at 8ths
            div = 2 if u < 0.25 else 4 if u < 0.6 else 8
        i = int(pos * SR)
        g = 10 ** ((peak_db - 24 * (1 - u)) / 20)
        j = min(n, i + hit_n)
        out[i:j] += (burst[: j - i] * g)[:, None]
        pos += BEAT / div
    return out


x = load()

# ---- the build (phase-locked: source k(55-n) lands n beats before the drop) -------------
gap = 0.5 * BEAT  # the groove stops half a beat before the drop; the riser carries through
b0 = t(55) - (DROP_S - START_S)
build = cut(x, b0, t(55) - gap)
n = len(build)
T = START_S + np.arange(n) / SR
g_lin = np.clip((T - START_S) / (GREEN_S - START_S), 0, 1)
g_db = np.where(T < GREEN_S, -40 + 34 * g_lin ** 0.8, -6 + 3 * np.clip((T - GREEN_S) / (DROP_S - GREEN_S), 0, 1))
lp = np.where(T < GREEN_S, 300 * (2600 / 300) ** g_lin, 2600 * (9000 / 2600) ** np.clip((T - GREEN_S) / (DROP_S - GREEN_S), 0, 1))
build = sweep(build, lp, "low") * (10 ** (g_db / 20))[:, None]
pre = np.concatenate([build, np.zeros((int(round(gap * SR)), 2), np.float32)])
fx_start = int(round((GREEN_S - START_S) * SR))
r = riser(DROP_S - GREEN_S, -14) + roll(DROP_S - GREEN_S, -16)
pre[fx_start : fx_start + len(r)] += r[: len(pre) - fx_start]

# ---- build bar before the CTA: the break, with a riser + accelerating snare roll ----------
build_bar = cut(x, t(103), t(107))
fx = riser(BAR, -13)
rl = roll(BAR, -14)
build_bar[: len(fx)] += fx[: len(build_bar)]
build_bar[: len(rl)] += rl[: len(build_bar)]

tail = cut(x, t(187), t(193))
tail *= (np.linspace(1, 0, len(tail)) ** 1.4)[:, None]

show = join([
    pre,
    cut(x, t(59), t(91)),    # drop A, 8 bars
    cut(x, t(103), t(107)),  # break riser, 1 bar
    cut(x, t(55), t(59)),    # stop bar: hit + 3 beats of silence
    cut(x, t(59), t(71)),    # drop B, 3 bars
    build_bar,               # build into the CTA, 1 bar
    cut(x, t(59), t(63)),    # CTA drop, 1 bar
    tail,                    # beat goes silent: decaying outro, 1.5 bars
])
lead = np.zeros((int(round(START_S * SR)), 2), np.float32)
y = np.concatenate([lead, show, np.zeros((int(0.3 * SR), 2), np.float32)])
y = y / max(1.0, float(np.abs(y).max()) / 0.95)
raw = OUT.with_suffix(".raw")
raw.write_bytes(y.astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw), str(OUT)], check=True)
raw.unlink()
print(f"{OUT.name}: {len(y) / SR:.2f}s, drop at {DROP_S:.3f}s, end of outro = frame {330 + 16.5 * BAR * 30:.0f}")
