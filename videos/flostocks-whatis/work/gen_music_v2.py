"""Synthesise the v2 (high-energy) music bed for the FloStocks reel — 100 % local,
no samples, no third-party rights (numpy + scipy synthesis).

150 BPM = exactly 12 video frames per beat at 30 fps, so every cut in FsReelV2
lands on the grid. A minor, Am–F–C–G.

  bars 0–3   intro groove under the iMessage chat (filtered arp, hats, rim)
  bar  4     build: accelerating snare roll + noise riser + pitch sweep
  bars 5–25  DROP: four-on-the-floor, saw bass, supersaw stabs, lead arp, claps
  bar  26    outro under the end card (pad + tail)

    .venv/bin/python videos/flostocks-whatis/work/gen_music_v2.py
Writes: videos/flostocks-whatis/edit/music_bed_v2.wav (43.2 s, 48 kHz stereo)
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, lfilter, lfilter_zi

SR = 48000
BPM = 150.0
BEAT = 60.0 / BPM            # 0.4 s
BAR = 4 * BEAT               # 1.6 s
BARS = 27
DUR = BARS * BAR
N = int(DUR * SR)
DROP_BAR = 5
OUTRO_BAR = 26
rng = np.random.default_rng(11)

NOTE = {"A": 220.0, "B": 246.94, "C": 261.63, "D": 293.66, "E": 329.63, "F": 349.23, "G": 392.0}
PROG = [("A", "C", "E"), ("F", "A", "C"), ("C", "E", "G"), ("G", "B", "D")]
ROOT = {"A": 55.0, "F": 43.65, "C": 65.41, "G": 49.0}


def at(sec: float) -> int:
    return int(round(sec * SR))


def place(buf: np.ndarray, clip: np.ndarray, sec: float, gain: float = 1.0) -> None:
    i = at(sec)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i] * gain


def env(n: int, decay: float) -> np.ndarray:
    return np.exp(-np.arange(n) / SR * decay)


def saw(freq: float, n: int, phase: float = 0.0) -> np.ndarray:
    x = np.arange(n) / SR * freq + phase
    return 2.0 * (x - np.floor(x + 0.5))


def lowpass(x: np.ndarray, hz: float, order: int = 2) -> np.ndarray:
    b, a = butter(order, min(hz, SR * 0.45) / (SR / 2), "low")
    return lfilter(b, a, x)


def highpass(x: np.ndarray, hz: float) -> np.ndarray:
    b, a = butter(2, hz / (SR / 2), "high")
    return lfilter(b, a, x)


def sweep_lowpass(x: np.ndarray, cutoff: np.ndarray, block: int = 256) -> np.ndarray:
    """Time-varying 2-pole low-pass (block-wise coefficients, carried state)."""
    out = np.zeros_like(x)
    zi = None
    for s in range(0, len(x), block):
        e = min(len(x), s + block)
        b, a = butter(2, float(np.clip(cutoff[s], 60, SR * 0.45)) / (SR / 2), "low")
        if zi is None:
            zi = lfilter_zi(b, a) * 0
        out[s:e], zi = lfilter(b, a, x[s:e], zi=zi)
    return out


# ---- drums ------------------------------------------------------------------
kn = at(0.32)
kt = np.arange(kn) / SR
KICK = np.sin(2 * np.pi * np.cumsum(45 + 160 * np.exp(-kt * 35)) / SR) * env(kn, 9.0)
KICK += 0.4 * rng.standard_normal(kn) * env(kn, 220.0)  # click
KICK = np.tanh(KICK * 1.6)

cn = at(0.22)
CLAP = highpass(rng.standard_normal(cn), 900) * env(cn, 22.0)
for d in (0.008, 0.017):  # flam
    CLAP[at(d):] += highpass(rng.standard_normal(cn - at(d)), 900) * env(cn - at(d), 30.0) * 0.6

hn = at(0.045)
HAT = highpass(rng.standard_normal(hn), 7000) * env(hn, 95.0)
on = at(0.22)
OHAT = highpass(rng.standard_normal(on), 6500) * env(on, 14.0)
sn = at(0.12)
SNARE = (highpass(rng.standard_normal(sn), 1500) * 0.8 + np.sin(2 * np.pi * 190 * np.arange(sn) / SR) * 0.5) * env(sn, 30.0)
rn = at(0.05)
RIM = highpass(rng.standard_normal(rn), 2500) * env(rn, 120.0) * 0.8

drums = np.zeros(N)
for bar in range(BARS):
    b0 = bar * BAR
    drop = DROP_BAR <= bar < OUTRO_BAR
    for beat in range(4):
        t0 = b0 + beat * BEAT
        if drop:
            place(drums, KICK, t0, 1.0)
            place(drums, OHAT, t0 + BEAT / 2, 0.32)
            if beat in (1, 3):
                place(drums, CLAP, t0, 0.75)
            for s in range(4):
                place(drums, HAT, t0 + s * BEAT / 4, 0.22 if s % 2 else 0.12)
        elif bar < 4:
            place(drums, HAT, t0 + BEAT / 2, 0.25)
            if beat in (1, 3):
                place(drums, RIM, t0, 0.5)
            if bar >= 2 and beat == 0:
                place(drums, KICK, t0, 0.55)
    if bar == 4:  # build: snare roll 8ths -> 16ths -> 32nds, rising
        hits = [i * BEAT / 2 for i in range(4)] + [2 * BEAT + i * BEAT / 4 for i in range(4)] + [3 * BEAT + i * BEAT / 8 for i in range(8)]
        for k, h in enumerate(hits):
            place(drums, SNARE, b0 + h, 0.25 + 0.6 * k / len(hits))
        for beat in range(4):
            place(drums, KICK, b0 + beat * BEAT, 0.5)

# ---- bass: offbeat-pumping saw, sub under it -------------------------------
bass = np.zeros(N)
for bar in range(DROP_BAR, OUTRO_BAR):
    r = ROOT[PROG[bar % 4][0]]
    for e in range(8):
        n = at(BEAT / 2 * 0.92)
        x = np.arange(n) / SR
        tone = (saw(r * 2, n) * 0.55 + np.sin(2 * np.pi * r * x) * 0.9) * np.minimum(1, x * 300) * env(n, 2.5)
        place(bass, tone, bar * BAR + e * BEAT / 2, 0.5)
bass = lowpass(bass, 900)

# ---- supersaw chord stabs (drop) + pad (everywhere) -------------------------
stabs = np.zeros(N)
pad = np.zeros(N)
for bar in range(BARS):
    chord = PROG[bar % 4]
    b0 = bar * BAR
    n = at(BAR)
    x = np.arange(n) / SR
    fade = np.minimum(1, x * 3) * np.minimum(1, (BAR - x) * 3)
    p = sum(np.sin(2 * np.pi * NOTE[c] * x + k) + 0.3 * np.sin(2 * np.pi * NOTE[c] * 2 * x) for k, c in enumerate(chord))
    place(pad, p * fade, b0, 0.06)
    if DROP_BAR <= bar < OUTRO_BAR:
        for hit in (0, 1.5, 3, 3.5):  # syncopated stab rhythm
            sn_ = at(BEAT * 0.45)
            stab = np.zeros(sn_)
            for c in chord:
                for det in (-0.012, -0.005, 0.0, 0.006, 0.013):
                    stab += saw(NOTE[c] * 2 * (1 + det), sn_, phase=rng.random())
            stab *= env(sn_, 7.0) / 15.0
            place(stabs, stab, b0 + hit * BEAT, 0.9)
stabs = lowpass(stabs, 5200)

# ---- arp: 16ths through the chord; filtered in the intro, open in the drop ---
arp = np.zeros(N)
for bar in range(BARS - 1):
    chord = PROG[bar % 4]
    for s in range(16):
        f = NOTE[chord[s % 3]] * (2 if s % 8 < 5 else 4)
        n = at(BEAT / 4 * 1.05)
        x = np.arange(n) / SR
        tone = (np.sign(np.sin(2 * np.pi * f * x)) * 0.4 + np.sin(2 * np.pi * f * x)) * env(n, 14.0)
        place(arp, tone, bar * BAR + s * BEAT / 4, 0.13)
cut = np.full(N, 9000.0)
cut[: at(4 * BAR)] = np.linspace(500, 2600, at(4 * BAR))
cut[at(4 * BAR): at(5 * BAR)] = np.linspace(2600, 9000, at(BAR))
arp = sweep_lowpass(arp, cut)

# ---- build riser + downlifter ----------------------------------------------
fx = np.zeros(N)
rn_ = at(BAR)
xr = np.arange(rn_) / rn_
riser = highpass(rng.standard_normal(rn_), 500) * xr ** 2.2
riser += np.sin(2 * np.pi * np.cumsum(200 + 1400 * xr ** 2) / SR) * xr ** 2 * 0.4
place(fx, riser, 4 * BAR, 0.5)
dn = at(1.4)
down = highpass(rng.standard_normal(dn), 300) * env(dn, 3.0)
place(fx, lowpass(down, 3000), DROP_BAR * BAR, 0.35)

# ---- sidechain pump (drop only) --------------------------------------------
pump = np.ones(N)
for bar in range(DROP_BAR, OUTRO_BAR):
    for beat in range(4):
        i = at(bar * BAR + beat * BEAT)
        n = at(0.24)
        j = min(N, i + n)
        pump[i:j] *= 0.3 + 0.7 * (np.arange(j - i) / n) ** 0.8

# outro: let the pad ring, fade everything to silence over the last bar
music = (bass + stabs + arp * 0.9 + pad) * pump
mix = drums * 0.85 + music + fx
mix[: at(4 * BAR)] *= 1.6  # lift the intro groove so the chat isn't quiet
tail = np.ones(N)
o = at(OUTRO_BAR * BAR)
tail[o:] = np.linspace(1, 0, N - o) ** 1.5
mix *= tail

delay = at(0.011)
wide = (stabs + arp + pad) * pump * tail * 0.3
left = mix + wide
right = mix.copy()
right[delay:] += wide[:-delay]
peak = max(np.abs(left).max(), np.abs(right).max())
stereo = (np.stack([left, right], axis=1) / peak * 0.89).astype(np.float32)

out = Path(__file__).resolve().parent.parent / "edit" / "music_bed_v2.wav"
out.parent.mkdir(parents=True, exist_ok=True)
raw = out.with_suffix(".raw")
raw.write_bytes(stereo.tobytes())
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw),
     "-af", "acompressor=threshold=-14dB:ratio=3:attack=5:release=80,alimiter=limit=0.92", str(out)],
    check=True,
)
raw.unlink()
print(f"wrote {out} ({DUR:.1f}s)")
