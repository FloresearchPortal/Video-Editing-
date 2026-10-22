"""Original soundtrack for the v5 FloStocks reel — composed in the style of the reference
showreel (128 BPM, D minor, four-on-the-floor kick with heavy sidechain pump, a pinging
high synth note that follows the harmony, risers into section changes, a break, a hard
stop, and a D-major final chord). No samples; everything is synthesised here, so the
track is original work owned by this repo. Arranged to the v5 video timeline:

    0 – 8.20 s   silence (the chat plays with only message sounds)
    8.20 – DROP  ping + pad fade in from "but", noise riser builds into the drop
    DROP + bars  0–11 main groove (fills every 2 bars on the section cuts)
                 11–12 break (no kick, riser + snare roll) under REGULATED
                 12–14 re-drop, hype montage, extra perc; last beat = hard stop
                 14–17 final impact, CTA groove 1 bar, then D-major chord swell + tail

    .venv/bin/python videos/flostocks-whatis/work/gen_music_v5.py
Writes edit/audio/music_v5.wav (git-ignored with edit/audio).
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, lfilter, lfilter_zi

SR = 48000
BPM = 128.0
BEAT = 60.0 / BPM
BAR = 4 * BEAT
FPS = 30
DROP_S = 314 / FPS
BUT_S = 246 / FPS
SHOW_BARS = 17
TAIL = 3.0
DUR = DROP_S + SHOW_BARS * BAR + TAIL
N = int(DUR * SR)
rng = np.random.default_rng(128)


def at(s: float) -> int:
    return int(round(s * SR))


def bar_t(k: float) -> float:
    return DROP_S + k * BAR


def place(buf, clip, s, gain=1.0):
    i = at(s)
    if i >= len(buf) or i + len(clip) <= 0:
        return
    if i < 0:
        clip, i = clip[-i:], 0
    j = min(len(buf), i + len(clip))
    buf[i:j] += clip[: j - i] * gain


def env(n, decay):
    return np.exp(-np.arange(n) / SR * decay)


def lp(x, hz, order=2):
    b, a = butter(order, min(hz, SR * 0.45) / (SR / 2), "low")
    return lfilter(b, a, x)


def hp(x, hz, order=2):
    b, a = butter(order, hz / (SR / 2), "high")
    return lfilter(b, a, x)


def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), min(hi, SR * 0.45) / (SR / 2)], "band")
    return lfilter(b, a, x)


def sweep_lp(x, cutoff, block=256):
    out = np.zeros_like(x)
    zi = None
    for s in range(0, len(x), block):
        e = min(len(x), s + block)
        b, a = butter(2, float(np.clip(cutoff[s], 40, SR * 0.45)) / (SR / 2), "low")
        if zi is None:
            zi = lfilter_zi(b, a) * 0
        out[s:e], zi = lfilter(b, a, x[s:e], zi=zi)
    return out


def saw(f, n, ph=0.0):
    x = np.arange(n) / SR * f + ph
    return 2 * (x - np.floor(x + 0.5))


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


# ---- harmony: Dm | Bb | F | C (i–VI–III–VII); final chord D major ---------------------------
PROG = [(50, [74, 77, 81]), (46, [70, 74, 77]), (53, [72, 77, 81]), (48, [72, 76, 79])]
PING = [86, 86, 84, 84]  # D6 over Dm/Bb, C6 over F/C (as the reference moves D6 -> C6)

# ---- instruments ------------------------------------------------------------------------------
kn = at(0.42)
kt = np.arange(kn) / SR
KICK = np.sin(2 * np.pi * np.cumsum(46 + 190 * np.exp(-kt * 32)) / SR) * env(kn, 7.5)
KICK += 0.5 * hp(rng.standard_normal(kn), 3000) * env(kn, 260)
KICK = np.tanh(KICK * 2.2) * 0.9

cn = at(0.3)
CLAP = np.zeros(cn)
for d in (0.0, 0.009, 0.019, 0.03):
    seg = bp(rng.standard_normal(cn - at(d)), 900, 7000) * env(cn - at(d), 24 if d == 0.03 else 60)
    CLAP[at(d):] += seg
CLAP *= 0.6

hn = at(0.05)
HAT = hp(rng.standard_normal(hn), 8000) * env(hn, 110)
on_ = at(0.28)
OHAT = hp(rng.standard_normal(on_), 7000) * env(on_, 12)
sn = at(0.16)
SNARE = (bp(rng.standard_normal(sn), 1200, 9000) * 0.9 + np.sin(2 * np.pi * 200 * np.arange(sn) / SR) * 0.5) * env(sn, 24)
rimn = at(0.04)
TICK = hp(rng.standard_normal(rimn), 4000) * env(rimn, 160)


def ping(midi, n_s=0.42):
    n = at(n_s)
    x = np.arange(n) / SR
    f = hz(midi)
    tone = (np.sin(2 * np.pi * f * x) + 0.45 * np.sin(2 * np.pi * 2 * f * x + 0.3) + 0.22 * np.sin(2 * np.pi * 3 * f * x)
            + 0.35 * saw(f * 1.004, n) + 0.35 * saw(f * 0.996, n))
    return tone * env(n, 9) * np.minimum(1, x * 2000)


def supersaw_chord(notes, n_s, voices=7, spread=0.018):
    n = at(n_s)
    out = np.zeros(n)
    for m in notes:
        for v in range(voices):
            det = (v - (voices - 1) / 2) / ((voices - 1) / 2) * spread
            out += saw(hz(m) * (1 + det), n, ph=rng.random())
    return out / (len(notes) * voices)


def reverb_ir(seconds=2.4, decay=3.2):
    n = at(seconds)
    ir = rng.standard_normal((n, 2)) * env(n, decay)[:, None]
    ir[:, 0] = lp(ir[:, 0], 9000)
    ir[:, 1] = lp(ir[:, 1], 9000)
    return ir / np.abs(ir).sum(0).max() * 6


IR = reverb_ir()

drums = np.zeros(N)
bass = np.zeros(N)
pads = np.zeros(N)
pings = np.zeros(N)
fx = np.zeros(N)
perc = np.zeros(N)

# ---- intro build from "but" to the drop (no kick) ---------------------------------------------
build_len = DROP_S - BUT_S
t8 = BUT_S
while t8 < DROP_S - 1e-6:
    k = (t8 - BUT_S) / build_len
    place(pings, ping(86, 0.5), t8, 0.15 + 0.35 * k)
    t8 += BEAT / 2
pad_n = at(build_len + 0.05)
pad_build = supersaw_chord(PROG[0][1], build_len + 0.05)
pad_build = sweep_lp(pad_build, np.linspace(300, 3500, len(pad_build)))
pad_build *= np.linspace(0, 1, len(pad_build)) ** 1.6
place(pads, pad_build, BUT_S, 0.9)
rn = at(build_len)
xr = np.arange(rn) / rn
riser = hp(rng.standard_normal(rn), 600) * xr ** 2.4
riser = sweep_lp(riser, 600 + 11000 * xr ** 2)
riser += np.sin(2 * np.pi * np.cumsum(220 + 1800 * xr ** 2.2) / SR) * xr ** 2.2 * 0.25
place(fx, riser, BUT_S, 0.55)
# snare roll on the last bar of the build
for i in range(16):
    s = DROP_S - BAR + i * BAR / 16
    if s >= BUT_S:
        place(drums, SNARE, s, 0.15 + 0.5 * i / 15)


def section(k0: int, k1: int, kick=True, extra=False):
    for k in range(k0, k1):
        root, chord = PROG[k % 4]
        b0 = bar_t(k)
        for beat in range(4):
            tb = b0 + beat * BEAT
            if kick:
                place(drums, KICK, tb, 1.0)
                place(drums, OHAT, tb + BEAT / 2, 0.16)
                if beat in (1, 3):
                    place(drums, CLAP, tb, 0.8)
            for s16 in range(4):
                place(drums, HAT, tb + s16 * BEAT / 4, 0.12 if s16 % 2 else 0.065)
            if extra:
                place(perc, TICK, tb + 3 * BEAT / 4, 0.5)
                place(perc, TICK, tb + BEAT / 4, 0.35)
        # offbeat bass (8ths) on the root, octave pops
        for e in range(8):
            n = at(BEAT / 2 * 0.9)
            x = np.arange(n) / SR
            f = hz(root - 12 if e % 2 == 0 else root)
            tone = (saw(f, n) * 0.6 + np.sin(2 * np.pi * f * x) * 0.8) * np.minimum(1, x * 400) * env(n, 4)
            place(bass, tone, b0 + e * BEAT / 2, 0.55 if kick else 0.25)
        # chord stabs/pad for the bar
        place(pads, supersaw_chord(chord, BAR * 0.98), b0, 0.3 if kick else 0.28)
        place(pads, supersaw_chord([m - 12 for m in chord], BAR * 0.98), b0, 0.5 if kick else 0.42)  # warm low voicing
        # high ping in 8ths following the harmony (+ a ghost echo)
        for e in range(8):
            place(pings, ping(PING[k % 4]), b0 + e * BEAT / 2, 0.17)
            place(pings, ping(PING[k % 4] + 12, 0.25), b0 + e * BEAT / 2 + BEAT * 0.75, 0.08)


def fill_into(k: int, strength=1.0):
    """short reverse swell + snare 16ths in the last beat before bar k"""
    s = bar_t(k) - BEAT
    n = at(BEAT)
    xr = np.arange(n) / n
    sw = hp(rng.standard_normal(n), 2000) * xr ** 3
    place(fx, sw, s, 0.45 * strength)
    for i in range(4):
        place(drums, SNARE, s + i * BEAT / 4, (0.25 + 0.15 * i) * strength)


# ---- arrangement ------------------------------------------------------------------------------
section(0, 11)
for k in (1, 3, 5, 6, 7, 9, 10):
    fill_into(k, 0.8)
section(11, 12, kick=False)                    # break under REGULATED
rn = at(BAR)
xr = np.arange(rn) / rn
riser2 = sweep_lp(hp(rng.standard_normal(rn), 500) * xr ** 2.2, 500 + 12000 * xr ** 2)
place(fx, riser2, bar_t(11), 0.6)
for i in range(16):
    place(drums, SNARE, bar_t(11) + BAR / 2 + i * BAR / 32, 0.1 + 0.55 * i / 15)
section(12, 14, extra=True)                     # hype re-drop
# stutter the last half-bar of the hype, then a hard stop on its last beat
# final: impact on bar 14, one bar of groove, then the D-major swell to the end
section(14, 15)
dmaj = [62, 66, 69, 74, 78, 81]
swell_len = (SHOW_BARS - 15) * BAR + TAIL
swell = supersaw_chord(dmaj, swell_len, voices=9, spread=0.022)
swell = sweep_lp(swell, np.concatenate([np.linspace(1500, 7000, at(BAR)), np.full(max(0, at(swell_len) - at(BAR)), 7000.0)])[: at(swell_len)])
swell *= np.minimum(1, np.arange(len(swell)) / at(0.08)) * np.exp(-np.arange(len(swell)) / SR * 0.35)
place(pads, swell, bar_t(15), 1.0)
for e in range(8 * 2):
    place(pings, ping(86 if e % 4 != 3 else 90, 0.6), bar_t(15) + e * BEAT / 2, 0.38 * np.exp(-e * 0.08))
bn = at(swell_len)
xb = np.arange(bn) / SR
sub = np.sin(2 * np.pi * hz(38) * xb) * np.exp(-xb * 0.6) * np.minimum(1, xb * 200)
place(bass, sub, bar_t(15), 0.6)

# impacts on the drop, hype re-drop and the final
in_ = at(2.5)
xi = np.arange(in_) / SR
IMPACT = np.sin(2 * np.pi * np.cumsum(40 + 80 * np.exp(-xi * 8)) / SR) * np.exp(-xi * 2.2) + 0.6 * lp(rng.standard_normal(in_), 4000) * np.exp(-xi * 5)
for s, g in ((DROP_S, 0.8), (bar_t(12), 0.6), (bar_t(14), 0.9)):
    place(fx, IMPACT, s, g)

# ---- sidechain pump (heavy, like the reference) -------------------------------------------------
pump = np.ones(N)
for k in list(range(0, 11)) + list(range(12, 15)):
    for beat in range(4):
        i = at(bar_t(k) + beat * BEAT)
        n = at(0.3)
        j = min(N, i + n)
        pump[i:j] *= 0.18 + 0.82 * (np.arange(j - i) / n) ** 0.7

pads = lp(pads, 4200)
bass = lp(bass, 1400)
music = (pads * 0.8 + bass) * pump + pings * (0.6 + 0.4 * pump)

# stutter: chop the last half-bar of the hype into 1/16 gates, then hard stop for one beat
s0, s1 = at(bar_t(14) - BAR / 2), at(bar_t(14) - BEAT)
gate = np.ones(N)
step = at(BEAT / 4)
for i in range(s0, s1, step):
    gate[i + step // 2 : i + step] = 0.0
gate[s1 : at(bar_t(14))] = 0.0
music *= gate
drums *= gate
perc *= gate
fx[s1 : at(bar_t(14))] *= 0.0

dry = drums * 0.9 + perc * 0.6 + music + fx
dry[: at(BUT_S)] = 0.0  # the chat stays silent until "but"

# stereo + reverb send on pads/pings
wet_src = (pads * 0.5 * pump + pings * 0.6)
wet_src[: at(BUT_S)] = 0
wet = np.stack([fftconvolve(wet_src, IR[:, 0])[:N], fftconvolve(wet_src, IR[:, 1])[:N]], axis=1) * 0.22
delay = at(0.012)
L = dry + wet[:, 0]
R = dry.copy()
R[delay:] += (pads * 0.25 * pump)[:-delay]
R += wet[:, 1]
# fade-in from "but" (music) — silence before it
# warm master tilt like the reference (its spectrum falls ~30 dB from the lows to 4 kHz+)
L = L - 0.8 * hp(L, 2800, 1)
R = R - 0.8 * hp(R, 2800, 1)
fade = np.clip((np.arange(N) / SR - BUT_S) / (DROP_S - BUT_S), 0, 1) ** 1.3
fade[at(DROP_S):] = 1
L *= fade
R *= fade
peak = max(np.abs(L).max(), np.abs(R).max())
st = (np.stack([L, R], axis=1) / peak * 0.9).astype(np.float32)

out = Path(__file__).resolve().parent.parent / "edit" / "audio" / "music_v5.wav"
out.parent.mkdir(parents=True, exist_ok=True)
raw = out.with_suffix(".raw")
raw.write_bytes(st.tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw),
                "-af", "acompressor=threshold=-16dB:ratio=3:attack=4:release=90:makeup=2,alimiter=limit=0.93",
                str(out)], check=True)
raw.unlink()
print(f"wrote {out} ({DUR:.2f}s, drop at {DROP_S:.3f}s, final at {bar_t(14):.3f}s)")
