"""Build the v9 sound-design stem (one WAV) from the Mixkit SFX in edit/audio/.

Cue times mirror remotion/src/lib/flostocks-v9/{timing.ts,ChatV9.tsx,ScenesV9*.tsx}:
124 BPM grid, drop on frame 314, scene cuts on bar lines. Each effect is placed by its
measured anchor (onset for clicks/pops, peak for whooshes/impacts) so the hit lands on
the frame it belongs to. Sources are peak-normalised first, then gains applied.

    .venv/bin/python videos/flostocks-whatis/work/build_sfx_v9.py
Writes edit/audio/sfx_v9.wav (git-ignored with the rest of edit/audio).
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

SR = 48000
FPS = 30
BEATF = FPS * 60 / 124.0
BARF = BEATF * 4
DROP = 330
END = round(DROP + 15.5 * BARF)
TOTAL_S = 1240 / FPS

AUDIO = Path(__file__).resolve().parent.parent / "edit" / "audio"


def bar_f(k: float) -> int:
    return round(DROP + k * BARF)


def beat_f(scene_bar: float, n: float) -> float:
    return bar_f(scene_bar) + n * BEATF


def load(name: str) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(AUDIO / name), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
    return x / (np.abs(x).max() + 1e-9) * 0.7  # peak-normalise to ~-3 dBFS


def anchor(x: np.ndarray, mode: str) -> float:
    env = np.convolve(np.abs(x).mean(1), np.ones(480) / 480, "same")
    db = 20 * np.log10(env + 1e-9)
    if mode == "peak":
        return float(np.argmax(db) / SR)
    return float(np.argmax(db > db.max() - 30) / SR)


SFX = {n: load(n) for n in [
    "key_tap.mp3", "msg_send.mp3", "msg_receive.mp3", "whoosh_fast.mp3", "whoosh_fast2.mp3", "sweep_scifi.mp3",
    "logo_impact.mp3", "zoom_impact.mp3", "ui_select.mp3", "confirm.mp3", "sparkle.mp3"]}
MODE = {"key_tap.mp3": "onset", "msg_send.mp3": "peak", "msg_receive.mp3": "onset", "whoosh_fast.mp3": "peak",
        "whoosh_fast2.mp3": "peak", "sweep_scifi.mp3": "peak", "logo_impact.mp3": "peak", "zoom_impact.mp3": "peak",
        "ui_select.mp3": "onset", "confirm.mp3": "onset", "sparkle.mp3": "peak"}
ANCH = {n: anchor(x, MODE[n]) for n, x in SFX.items()}

cues: list[tuple[float, str, float]] = []  # (frame where the anchor should land, file, gain)

# ---- chat: message sounds over the slow build -------------------------------------------
for f in (26, 80, 156, 199):
    cues.append((f, "msg_receive.mp3", 0.6))
cues.append((228, "msg_receive.mp3", 0.8))
for f in (52, 112):
    cues.append((f, "msg_send.mp3", 0.55))
cues.append((272, "ui_select.mp3", 0.3))              # green + lift, on a beat of the build
cues.append((DROP - 2, "whoosh_fast.mp3", 0.5))       # the green card opens
cues.append((DROP, "zoom_impact.mp3", 0.6))           # logo cuts in on the drop
cues.append((DROP, "logo_impact.mp3", 0.35))

# ---- drop A ------------------------------------------------------------------------------
cues.append((beat_f(0, 1) + 4, "whoosh_fast2.mp3", 0.28))    # mark -> lockup
cues.append((beat_f(0, 1.5) + 5, "sweep_scifi.mp3", 0.22))   # wordmark wipe
cues.append((bar_f(1) + 3, "whoosh_fast2.mp3", 0.28))        # lockup lifts
for n in (2.5, 3):
    cues.append((beat_f(1, n) + 3, "ui_select.mp3", 0.28))
cues.append((bar_f(2) + 2, "whoosh_fast2.mp3", 0.3))         # market (2x)
for n in (0.5, 1, 1.5):
    cues.append((beat_f(2, n), "key_tap.mp3", 0.35))
for i in range(5):
    cues.append((beat_f(2, 2 + i * 0.25) + 1, "ui_select.mp3", 0.18))
for i in range(4):
    cues.append((beat_f(3, 1 + i * 0.5) + 3, "confirm.mp3", 0.24))
cues.append((beat_f(3, 3) + 3, "sparkle.mp3", 0.22))
for i in range(3):
    cues.append((beat_f(4, 1 + i * 0.5) + 2, "ui_select.mp3", 0.22))
cues.append((bar_f(5) + 4, "sweep_scifi.mp3", 0.18))         # gauge (2x)
cues.append((beat_f(5, 2), "whoosh_fast2.mp3", 0.26))        # -> calculators
for n in (2.5, 3, 3.5):
    cues.append((beat_f(5, n), "key_tap.mp3", 0.32))
# ---- stop bar ----------------------------------------------------------------------------
cues.append((bar_f(6), "logo_impact.mp3", 0.45))             # Regulated. on the hit
for i in range(3):
    cues.append((beat_f(6, 1 + i * 0.5) + 2, "ui_select.mp3", 0.2))
# ---- drop B: feature montage ---------------------------------------------------------------
for i in range(5):
    cues.append((beat_f(7, 2 * i) + 3, "whoosh_fast2.mp3", 0.32))
for k in range(8):
    cues.append((beat_f(7, k * 0.25) + 4, "key_tap.mp3", 0.16))
cues.append((beat_f(7, 3), "key_tap.mp3", 0.5))
cues.append((beat_f(7, 3) + 4, "confirm.mp3", 0.3))
cues.append((beat_f(7, 5), "sweep_scifi.mp3", 0.2))
for n in (6, 7):
    cues.append((beat_f(7, n) + 3, "msg_receive.mp3", 0.32))
cues.append((beat_f(7, 10) + 2, "whoosh_fast.mp3", 0.35))
cues.append((beat_f(7, 12) + 2, "zoom_impact.mp3", 0.32))
# ---- why look abroad: chips fly away, pin lands ---------------------------------------------
for i in range(4):
    cues.append((beat_f(11, 0.5 + i * 0.5) + 2, "ui_select.mp3", 0.2))
cues.append((beat_f(11, 2) + 6, "whoosh_fast2.mp3", 0.25))
cues.append((beat_f(11, 6) + 5, "zoom_impact.mp3", 0.3))     # pin lands
# ---- CTA drop, then silence for the logo + details -----------------------------------------
cues.append((bar_f(13), "zoom_impact.mp3", 0.5))
cues.append((beat_f(13, 0.5) + 3, "ui_select.mp3", 0.3))
cues.append((beat_f(13, 2), "key_tap.mp3", 0.7))
cues.append((beat_f(13, 2) + 2, "confirm.mp3", 0.32))
cues.append((bar_f(14) + 2, "sparkle.mp3", 0.25))            # lockup + disclaimer (beat silent)

# ---- mix ------------------------------------------------------------------------------
out = np.zeros((int(TOTAL_S * SR) + SR, 2), np.float32)
for f, name, g in cues:
    x = SFX[name]
    i = int(round((f / FPS - ANCH[name]) * SR))
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(out), i + len(x))
    out[i:j] += x[: j - i] * g
peak = np.abs(out).max()
if peak > 0.95:
    out *= 0.95 / peak
dst = AUDIO / "sfx_v9.wav"
raw = dst.with_suffix(".raw")
raw.write_bytes(out.astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw), str(dst)], check=True)
raw.unlink()
print(f"{len(cues)} cues -> {dst} ({len(out) / SR:.1f}s, peak {peak:.2f})")
