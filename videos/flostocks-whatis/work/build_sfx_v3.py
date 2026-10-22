"""Build the v3 sound-design stem (one WAV) from the Mixkit SFX in edit/audio/.

Cue times mirror remotion/src/lib/flostocks-v3/{timing.ts,ChatReal.tsx,Scenes*.tsx}:
121 BPM grid, drop on frame 224, scene cuts on bar lines. Each effect is placed by its
measured anchor (onset for clicks/pops, peak for whooshes/impacts) so the hit lands on
the frame it belongs to. Sources are peak-normalised first, then gains applied.

    .venv/bin/python videos/flostocks-whatis/work/build_sfx_v3.py
Writes edit/audio/sfx_v3.wav (git-ignored with the rest of edit/audio).
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

SR = 48000
FPS = 30
BEATF = FPS * 60 / 121.0
BARF = BEATF * 4
DROP = 224
END = round(DROP + 23 * BARF)
TOTAL_S = END / FPS + 2.5  # + end card

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

# ---- chat ------------------------------------------------------------------------
PER_CHAR = 1.3
for text, start in (("PMEX?", 25), ("Wo tou pmex ke top broker nai?", 68)):
    for i, ch in enumerate(text):
        cues.append((round(start + i * PER_CHAR), "key_tap.mp3", 0.32 + 0.08 * ((i * 37) % 5) / 4))
for f in (41, 111):
    cues.append((f, "msg_send.mp3", 0.55))
for f in (16, 62, 128, 142):
    cues.append((f, "msg_receive.mp3", 0.6))
cues.append((168, "msg_receive.mp3", 0.85))
cues.append((DROP - 2, "whoosh_fast.mp3", 0.75))       # punch-through into the drop
cues.append((DROP, "zoom_impact.mp3", 0.95))
cues.append((DROP, "logo_impact.mp3", 0.55))           # its long build rises under the chat

# ---- scene transitions (whoosh peaks on the cut) ----------------------------------
whooshes = ["whoosh_fast2.mp3", "whoosh_fast.mp3", "sweep_scifi.mp3"]
for i, k in enumerate([2, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21]):
    cues.append((bar_f(k) - 1, whooshes[i % 3], 0.5 if whooshes[i % 3] != "sweep_scifi.mp3" else 0.6))

# ---- UI moments ---------------------------------------------------------------------
for n in (2, 3, 4, 5):                                   # account steps tick
    cues.append((beat_f(3, n), "ui_select.mp3", 0.38))
cues.append((beat_f(3, 6), "confirm.mp3", 0.5))         # account ready
cues.append((beat_f(5, 6), "zoom_impact.mp3", 0.45))    # 100% FREE stamp
cues.append((beat_f(7, 1.5), "sparkle.mp3", 0.45))      # analyzer ring starts
cues.append((beat_f(9, 4), "zoom_impact.mp3", 0.45))    # research badge
for i in range(4):                                       # trust badges
    cues.append((beat_f(17, 2 + i * 0.75), "ui_select.mp3", 0.32))
for n in (0, 2, 4):                                      # LEARN / ANALYZE / INVEST
    cues.append((beat_f(19, n), "zoom_impact.mp3", 0.55))
cues.append((beat_f(19, 6), "sparkle.mp3", 0.6))        # logo
click = beat_f(21, 4.5)
cues.append((click, "ui_select.mp3", 0.6))
cues.append((click + 2, "confirm.mp3", 0.45))
for i in range(13):                                      # URL types itself
    cues.append((click + 4 + i * (2 * BEATF / 13), "key_tap.mp3", 0.28))
cues.append((END - 1, "whoosh_fast2.mp3", 0.4))          # into the end card

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
dst = AUDIO / "sfx_v3.wav"
raw = dst.with_suffix(".raw")
raw.write_bytes(out.astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw), str(dst)], check=True)
raw.unlink()
print(f"{len(cues)} cues -> {dst} ({len(out) / SR:.1f}s, peak {peak:.2f})")
