"""Build the v7 sound-design stem (one WAV) from the Mixkit SFX in edit/audio/.

Cue times mirror remotion/src/lib/flostocks-v7/{timing.ts,ChatV7.tsx,ScenesV7*.tsx}:
124 BPM grid, drop on frame 314, scene cuts on bar lines. Each effect is placed by its
measured anchor (onset for clicks/pops, peak for whooshes/impacts) so the hit lands on
the frame it belongs to. Sources are peak-normalised first, then gains applied.

    .venv/bin/python videos/flostocks-whatis/work/build_sfx_v7.py
Writes edit/audio/sfx_v7.wav (git-ignored with the rest of edit/audio).
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

SR = 48000
FPS = 30
BEATF = FPS * 60 / 124.0
BARF = BEATF * 4
DROP = 314
END = round(DROP + 20 * BARF)
TOTAL_S = 1490 / FPS

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

# ---- chat (silent bed: only message sounds), then the app-launch zoom -------------------
for f in (40, 130, 220, 246):
    cues.append((f, "msg_receive.mp3", 0.6))
cues.append((276, "msg_receive.mp3", 0.8))
for f in (84, 176):
    cues.append((f, "msg_send.mp3", 0.55))
cues.append((287, "ui_select.mp3", 0.35))             # focus: bubble lifts
cues.append((DROP - 2, "whoosh_fast.mp3", 0.6))       # window zoom
cues.append((DROP, "zoom_impact.mp3", 0.55))          # lands with the drop

# ---- drop A ------------------------------------------------------------------------------
cues.append((beat_f(0, 1) + 7, "whoosh_fast2.mp3", 0.28))   # mark slides into the lockup
cues.append((beat_f(0, 1.5) + 8, "sweep_scifi.mp3", 0.25))  # wordmark wipe
cues.append((beat_f(0, 4) + 6, "whoosh_fast2.mp3", 0.3))    # lockup lifts, headline
for n in (6, 6.5):
    cues.append((beat_f(0, n) + 4, "ui_select.mp3", 0.3))   # licence chips
cues.append((bar_f(2), "whoosh_fast2.mp3", 0.3))            # market card
for n in (1, 2, 3):
    cues.append((beat_f(2, n), "key_tap.mp3", 0.4))          # segmented control
for i in range(5):
    cues.append((beat_f(2, 4 + i * 0.5), "ui_select.mp3", 0.22))  # watchlist rows
for i in range(4):
    cues.append((beat_f(4, 1.5 + i) + 4, "confirm.mp3", 0.3))     # checklist ticks
cues.append((beat_f(4, 6) + 6, "sparkle.mp3", 0.3))          # ready to trade
for n in (2.5, 5):
    cues.append((beat_f(6, n) + 5, "whoosh_fast2.mp3", 0.28))  # carousel
# ---- break, stop bar ------------------------------------------------------------------
cues.append((beat_f(8, 0.5) + 14, "sweep_scifi.mp3", 0.22))  # analyzer gauge
for n in (1, 2, 3):
    cues.append((beat_f(9, n), "key_tap.mp3", 0.4))          # calculator tabs
cues.append((bar_f(10), "logo_impact.mp3", 0.45))            # regulated hit
# ---- drop B --------------------------------------------------------------------------
cues.append((bar_f(11) + 6, "whoosh_fast.mp3", 0.5))         # bento flies in
for i in range(6):
    cues.append((beat_f(11, 4 + i), "ui_select.mp3", 0.32))  # tile highlights
cues.append((beat_f(11, 12) + 4, "whoosh_fast2.mp3", 0.4))   # grid clears
cues.append((beat_f(11, 12) + 8, "zoom_impact.mp3", 0.35))   # All of PSX.
# ---- CTA / outro ----------------------------------------------------------------------
cues.append((bar_f(15) + 2, "zoom_impact.mp3", 0.4))
cues.append((beat_f(15, 1.5) + 6, "ui_select.mp3", 0.35))    # button
cues.append((beat_f(15, 4), "key_tap.mp3", 0.7))             # tap
cues.append((beat_f(15, 4) + 2, "confirm.mp3", 0.35))
cues.append((beat_f(15, 8) + 8, "sparkle.mp3", 0.25))        # lockup + disclaimer

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
dst = AUDIO / "sfx_v7.wav"
raw = dst.with_suffix(".raw")
raw.write_bytes(out.astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw), str(dst)], check=True)
raw.unlink()
print(f"{len(cues)} cues -> {dst} ({len(out) / SR:.1f}s, peak {peak:.2f})")
