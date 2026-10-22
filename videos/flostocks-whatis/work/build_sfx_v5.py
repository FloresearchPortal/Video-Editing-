"""Build the v5 sound-design stem (one WAV) from the Mixkit SFX in edit/audio/.

Cue times mirror remotion/src/lib/flostocks-v5/{timing.ts,ChatV5.tsx,ScenesV5*.tsx}:
128 BPM grid, drop on frame 314, scene cuts on bar lines. Each effect is placed by its
measured anchor (onset for clicks/pops, peak for whooshes/impacts) so the hit lands on
the frame it belongs to. Sources are peak-normalised first, then gains applied.

    .venv/bin/python videos/flostocks-whatis/work/build_sfx_v5.py
Writes edit/audio/sfx_v5.wav (git-ignored with the rest of edit/audio).
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

SR = 48000
FPS = 30
BEATF = FPS * 60 / 128.0
BARF = BEATF * 4
DROP = 314
END = round(DROP + 17 * BARF)
TOTAL_S = 1360 / FPS  # CTA holds through the closing chord

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

# ---- chat (natural pace, silent bed: only message sounds) ---------------------------
for f in (40, 130, 220, 246):  # dots windows end on these frames
    cues.append((f, "msg_receive.mp3", 0.6))
cues.append((276, "msg_receive.mp3", 0.8))
for f in (84, 176):
    cues.append((f, "msg_send.mp3", 0.55))
cues.append((287, "sparkle.mp3", 0.4))                # focus: bubble lifts + turns green
cues.append((DROP - 2, "whoosh_fast.mp3", 0.75))      # the fast flood
cues.append((DROP, "zoom_impact.mp3", 0.95))

# ---- hard cuts on bar lines: light sweeps --------------------------------------------
for i, k in enumerate([2, 3, 5, 6, 7, 9, 10, 11]):
    cues.append((bar_f(k) - 1, "sweep_scifi.mp3" if i % 2 else "whoosh_fast2.mp3", 0.36))

# ---- scene moments ---------------------------------------------------------------------
for n in range(4):                                       # NEWS lines punch on 8ths
    cues.append((beat_f(0, n * 0.5), "ui_select.mp3", 0.45))
cues.append((bar_f(1) + 7, "logo_impact.mp3", 0.75))     # identity: mark slams down
cues.append((bar_f(1) + 7, "zoom_impact.mp3", 0.45))
cues.append((beat_f(1, 3.3), "whoosh_fast.mp3", 0.4))   # white disk
for i in range(3):                                        # how-it-works arrivals
    cues.append((beat_f(3, 1 + i * 0.75) + BEATF * 1.6 * 0.8, "confirm.mp3", 0.3))
for i in range(5):                                        # LEARN letters land
    cues.append((bar_f(5) + i * 3 + 9, "ui_select.mp3", 0.35))
cues.append((beat_f(6, 1), "whoosh_fast2.mp3", 0.5))    # ANALYZE whip
for k in range(11):                                        # candles print on the board
    cues.append((bar_f(7) + k * 3, "key_tap.mp3", 0.3))
cues.append((bar_f(7) + 40, "sparkle.mp3", 0.45))        # price line
for i in range(6):                                        # sector chips
    cues.append((beat_f(7, 4.75 + i * 0.375), "key_tap.mp3", 0.4))
for n in range(1, 4):                                     # PSX glyph morphs
    cues.append((beat_f(9, n), "ui_select.mp3", 0.4))
cues.append((beat_f(9, 1), "whoosh_fast2.mp3", 0.4))    # THE WHOLE PSX whip
for n in range(4):                                        # slot machine
    cues.append((beat_f(10, n), "key_tap.mp3", 0.45))
cues.append((bar_f(11) + 2, "whoosh_fast2.mp3", 0.5))     # REGULATED whip (music break)
cues.append((beat_f(11, 2.2), "confirm.mp3", 0.4))
for n in range(6):                                        # hype smash cuts
    cues.append((beat_f(12, n), "whoosh_fast2.mp3" if n % 2 else "sweep_scifi.mp3", 0.32))
for q in range(4):                                        # stutter 16ths
    cues.append((beat_f(12, 6 + q * 0.25), "key_tap.mp3", 0.5))
# beat 7 of the hype = the hard stop: deliberately silent
cues.append((bar_f(14) + 6, "logo_impact.mp3", 0.8))      # CTA mark lands
cues.append((beat_f(14, 1) + 9, "zoom_impact.mp3", 0.45)) # PSX letters drop
cues.append((beat_f(14, 3), "ui_select.mp3", 0.5))       # url pill
cues.append((beat_f(14, 4), "sparkle.mp3", 0.35))        # closing chord / licence row

# ---- mix ------------------------------------------------------------------------------
out = np.zeros((int(TOTAL_S * SR) + SR, 2), np.float32)
for f, name, g in cues:
    x = SFX[name]
    i = int(round((f / FPS - ANCH[name]) * SR))
    if i < 0:
        x, i = x[-i:], 0
    j = min(len(out), i + len(x))
    out[i:j] += x[: j - i] * g
# the hard stop before the CTA is dead air: gate every tail/pre-roll out of that beat
g0, g1 = int(beat_f(12, 6.95) / FPS * SR), int((bar_f(14) - 0.5) / FPS * SR)
fade = int(0.012 * SR)
out[g0 - fade:g0] *= np.linspace(1, 0, fade)[:, None]
out[g0:g1] = 0
peak = np.abs(out).max()
if peak > 0.95:
    out *= 0.95 / peak
dst = AUDIO / "sfx_v5.wav"
raw = dst.with_suffix(".raw")
raw.write_bytes(out.astype(np.float32).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw), str(dst)], check=True)
raw.unlink()
print(f"{len(cues)} cues -> {dst} ({len(out) / SR:.1f}s, peak {peak:.2f})")
