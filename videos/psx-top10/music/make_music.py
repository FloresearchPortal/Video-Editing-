"""Original 140 BPM electronic score for the PSX Top 10 reel, synthesised from scratch (numpy only,
no samples, so no licence issues). Every cue is read from the shared timeline
(remotion/src/projects/psx-top10/timeline.json), so the music accents land on the same beats as the
picture: `sections` set the energy, `cues` (impact / hit / stab / pluck / riser / fill) are the hits.
No separate sound effects; the arrangement itself carries the accents.

  .venv/bin/python videos/psx-top10/music/make_music.py [-o videos/psx-top10/output/music.wav]

Master: -14 LUFS integrated, true peak <= -1.5 dBTP (measured with pyloudnorm + 4x oversampling).
"""
import argparse, json, subprocess
from pathlib import Path
import numpy as np
import pyloudnorm as pyln

ROOT = Path(__file__).resolve().parents[3]
TL = json.loads((ROOT / 'remotion/src/projects/psx-top10/timeline.json').read_text())
SR = 48000
BEAT = 60 / TL['bpm']
S = TL['sections']
FPS = TL['fps']
END_S = (round(S['cta']['static_from'] * BEAT * FPS) + S['cta']['hold_seconds'] * FPS) / FPS
N = int(round(END_S * SR))
RNG = np.random.default_rng(128)

def b2s(beat):  # beat -> sample index
    return int(round(beat * BEAT * SR))

def note(name):
    names = {'C': -9, 'D': -7, 'E': -5, 'F': -4, 'G': -2, 'A': 0, 'B': 2}
    n, octv = name[:-1], int(name[-1])
    semis = names[n[0]] + (1 if '#' in n else 0) + (octv - 4) * 12
    return 440 * 2 ** (semis / 12)

# A minor: Am - F - C - G, one chord per bar (4 beats)
PROG = [('A2', ['A3', 'C4', 'E4']), ('F2', ['F3', 'A3', 'C4']), ('C3', ['G3', 'C4', 'E4']), ('G2', ['G3', 'B3', 'D4'])]
def chord_at(beat):
    return PROG[int(beat // 4) % 4]

def t_(n):
    return np.arange(n) / SR

def env_ad(n, a, d):
    t = t_(n)
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) / d)

def additive_saw(freq, n, cutoff, detune_cents=0.0, phase=0.0):
    """Band-limited saw with a gentle 2-pole low-pass roll-off applied per harmonic."""
    f = freq * 2 ** (detune_cents / 1200)
    t = t_(n)
    out = np.zeros(n)
    for k in range(1, int(min(18000, cutoff * 5) / f) + 1):
        w = (1 / k) / (1 + (k * f / cutoff) ** 4)
        if w < 1e-4:
            break
        out += w * np.sin(2 * np.pi * k * f * t + phase * k)
    return out

def hp_noise(n, cutoff, q=1.0):
    x = RNG.standard_normal(n)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    X *= 1 / (1 + (cutoff / np.maximum(fr, 1)) ** (2 * q))
    return np.fft.irfft(X, n)

def bp_noise(n, lo, hi):
    x = RNG.standard_normal(n)
    X = np.fft.rfft(x)
    fr = np.fft.rfftfreq(n, 1 / SR)
    X *= (1 / (1 + (lo / np.maximum(fr, 1)) ** 4)) * (1 / (1 + (fr / hi) ** 4))
    return np.fft.irfft(X, n)

# ---------------------------------------------------------------- instruments (mono unless noted)
def kick(level=1.0, n=int(0.42 * SR)):
    t = t_(n)
    f = 46 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.22)
    click = hp_noise(n, 2500) * np.exp(-t / 0.004) * 0.25
    return level * np.tanh(1.6 * (body + click)) * 0.9

def sub_hit(level=1.0, dur=1.6, f0=44):
    n = int(dur * SR); t = t_(n)
    f = f0 + 60 * np.exp(-t / 0.06)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return level * np.tanh(1.3 * np.sin(ph)) * np.exp(-t / (dur / 3.2)) * env_ad(n, 0.002, 10)

def clap(level=1.0):
    n = int(0.3 * SR); t = t_(n)
    nz = bp_noise(n, 900, 6000)
    e = np.zeros(n)
    for d in (0, 0.009, 0.018):
        e += np.where(t >= d, np.exp(-(t - d) / 0.008), 0) * 0.6
    e += np.where(t >= 0.024, np.exp(-(t - 0.024) / 0.09), 0)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05) * 0.4
    return level * (nz / np.abs(nz).max() * e + tone) * 0.5

def snare(level=1.0):
    n = int(0.22 * SR); t = t_(n)
    nz = bp_noise(n, 1500, 9000); nz /= np.abs(nz).max()
    return level * (nz * np.exp(-t / 0.06) * 0.7 + np.sin(2 * np.pi * 210 * t) * np.exp(-t / 0.04) * 0.5)

def hat(level=1.0, open_=False):
    n = int((0.32 if open_ else 0.06) * SR); t = t_(n)
    nz = hp_noise(n, 7500, 2); nz /= np.abs(nz).max()
    return level * nz * np.exp(-t / (0.12 if open_ else 0.014)) * 0.35

def stab(notes, level=1.0, dur=0.42, cutoff=2600, width=1.0):
    """Supersaw chord stab, stereo (detuned voices spread L/R)."""
    n = int(dur * SR)
    L = np.zeros(n); R = np.zeros(n)
    for nm in notes:
        f = note(nm)
        for i, dc in enumerate((-14, -6, 0, 6, 14)):
            v = additive_saw(f, n, cutoff, dc, phase=i * 1.3)
            pan = (dc / 14) * 0.6 * width
            L += v * (1 - pan) * 0.5; R += v * (1 + pan) * 0.5
    e = env_ad(n, 0.004, dur / 3.2)
    g = level * 0.11
    return np.stack([L * e * g, R * e * g])

def pad(notes, n, level=1.0, cutoff=1300, attack=0.6):
    L = np.zeros(n); R = np.zeros(n)
    for nm in notes:
        f = note(nm)
        for i, dc in enumerate((-9, 0, 9)):
            v = additive_saw(f, n, cutoff, dc, phase=i)
            L += v * (1.2 if dc < 0 else 0.8); R += v * (1.2 if dc > 0 else 0.8)
    t = t_(n)
    e = np.minimum(1, t / attack) * np.minimum(1, (n / SR - t) / 0.25)
    return np.stack([L, R]) * e * level * 0.035

def bass(freq, n, level=1.0, cutoff=700):
    v = additive_saw(freq, n, cutoff) + 0.6 * np.sin(2 * np.pi * freq * t_(n))
    return level * v * env_ad(n, 0.003, 0.16) * 0.45

def pluck(freq, level=1.0, cutoff=3200):
    n = int(0.2 * SR)
    return level * additive_saw(freq, n, cutoff) * env_ad(n, 0.002, 0.06) * 0.22

def crash(level=1.0, dur=1.8):
    n = int(dur * SR); t = t_(n)
    nz = hp_noise(n, 4000, 1); nz /= np.abs(nz).max()
    return level * nz * np.exp(-t / 0.55) * 0.22

# ---------------------------------------------------------------- arrangement
mixL = np.zeros(N + SR * 3); mixR = np.zeros(N + SR * 3)
sidechain = np.ones_like(mixL)

def put(sig, at, gain=1.0, pan=0.0):
    if sig.ndim == 1:
        l, r = sig * (1 - pan), sig * (1 + pan)
    else:
        l, r = sig[0], sig[1]
    e = min(len(mixL), at + l.shape[0])
    mixL[at:e] += gain * l[:e - at]; mixR[at:e] += gain * r[:e - at]

def duck(at, depth=0.6, rel=0.12):
    n = int(0.5 * SR); t = t_(n)
    e = min(len(sidechain), at + n)
    sidechain[at:e] = np.minimum(sidechain[at:e], (1 - depth * np.exp(-t / rel))[:e - at])

music_bed = [np.zeros_like(mixL), np.zeros_like(mixL)]  # ducked layer (bass, pad, arp)
def put_bed(sig, at, gain=1.0):
    s = sig if sig.ndim == 2 else np.stack([sig, sig])
    e = min(len(mixL), at + s.shape[1])
    music_bed[0][at:e] += gain * s[0, :e - at]; music_bed[1][at:e] += gain * s[1, :e - at]

intro, title, ex, srt, chart, cta = (S[k] for k in ('intro', 'title', 'explain', 'sort', 'chart', 'cta'))
end_beat = END_S / BEAT
riser_spans = [(c['beat'], c['to']) for c in TL['cues'] if c['type'] in ('riser', 'fill')]

def energy(beat):
    """'light' | 'groove' | 'full' | 'soft' per beat."""
    if beat < intro['burst']: return 'groove'
    if beat < intro['end']: return 'full'
    if beat < title['end']: return 'groove'
    if beat < ex['end']: return 'light'
    if beat < srt['end']: return 'groove'
    if beat < cta['start']: return 'full'
    return 'soft'

def in_riser(beat):
    return any(a <= beat < b for a, b in riser_spans)

# grid: drums + bass + arps by energy
beat = 0.0
while beat < end_beat:
    en = energy(beat)
    s0 = b2s(beat)
    bar_root, ch = chord_at(beat)
    kick_on = not (en == 'soft' and beat >= cta['static_from'] - 0.01) and not in_riser(beat)
    if kick_on and beat > 0:
        put(kick({'light': 0.75, 'groove': 1.0, 'full': 1.05, 'soft': 0.5}[en]), s0); duck(s0, 0.65 if en != 'soft' else 0.3)
    if en in ('groove', 'full') and int(beat) % 2 == 1 and not in_riser(beat):
        put(clap(0.85 if en == 'groove' else 0.95), s0)
    if en != 'soft':
        put(hat(0.75 if en == 'light' else 0.95, open_=(en == 'full')), b2s(beat + 0.5), pan=0.25)
        if en == 'full':
            put(hat(0.5), b2s(beat + 0.25), pan=-0.3); put(hat(0.5), b2s(beat + 0.75), pan=-0.3)
        bl = {'light': 0.55, 'groove': 0.95, 'full': 1.05}[en]
        put_bed(bass(note(bar_root), int(BEAT * 0.5 * SR), bl), b2s(beat + 0.5))
        if en == 'full':  # 16th arp
            for k, nm in enumerate((ch * 2)[:4]):
                f = note(nm) * (2 if k % 2 else 1)
                put_bed(np.stack([pluck(f, 0.9) * 0.8, pluck(f, 0.9) * 1.2]), b2s(beat + k * 0.25))
    beat += 1

# pads: explainer (light) and CTA (soft), one per bar
for b0, b1, lvl, cut in ((ex['start'], ex['end'], 0.8, 1100), (cta['start'], end_beat + 1, 3.2, 1000)):
    bb = b0
    while bb < b1:
        nb = min(b1, (bb // 4 + 1) * 4)
        put_bed(pad(chord_at(bb)[1], b2s(nb) - b2s(bb) + int(0.2 * SR), lvl, cut), b2s(bb))
        bb = nb
# CTA: soft high pluck arp in eighths
bb = cta['start']
while bb < end_beat - 1.5:
    put_bed(pluck(note(chord_at(bb)[1][int(bb * 2) % 3]) * 2, 1.1, 2000), b2s(bb))
    bb += 0.5

def riser(b0, b1, level=1.0):
    rs, re_ = b2s(b0), b2s(b1)
    n = re_ - rs; t = t_(n)
    f = 110 * 2 ** (3 * (t / t[-1]) ** 1.5)
    x = np.zeros(n)
    for i, dc in enumerate((-12, 0, 12)):
        ph = 2 * np.pi * np.cumsum(f * 2 ** (dc / 1200)) / SR
        for h in range(1, 7):
            x += np.sin(h * ph + i) / h
    x *= (0.15 + 0.85 * (t / t[-1]) ** 1.6) * 0.22 * level
    put(np.stack([x * 0.9, x * 1.1]), rs)

def roll(b0, b1, level=1.0):
    pos = b0
    while pos < b1 - 1e-6:
        prog = (pos - b0) / max(1e-6, b1 - b0)
        put(snare((0.8 + 1.4 * prog) * level), b2s(pos))
        pos += 0.25 if prog < 0.5 else 0.125

# cues from the shared timeline
for c in TL['cues']:
    b, ty = c['beat'], c['type']
    at, ch = b2s(b), chord_at(b)[1]
    if ty == 'impact':
        put(kick(1.2), at); put(sub_hit(1.15, 1.8, 40), at); put(crash(1.1, 2.0), at); duck(at, 0.8, 0.18)
        put(stab(ch + [ch[0][:-1] + '5'], 1.3, 0.7, 4200, 1.3), at)
    elif ty == 'hit':
        put(kick(1.05), at); put(sub_hit(0.8, 1.0), at); put(crash(0.55), at)
        put(stab(ch, 1.0, 0.45, 3600), at)
    elif ty == 'stab':
        put(stab(ch, 0.9, 0.35, 3400), at)
    elif ty == 'pluck':
        put(stab(ch, 0.55, 0.25, 2200), at)
    elif ty == 'riser':
        riser(b, c['to'], 1.0 if c['to'] - b > 1 else 0.7); roll(b, c['to'], 0.8 if c['to'] - b > 1 else 0.6)
    elif ty == 'fill':
        roll(b, c['to'], 0.9)

# ---------------------------------------------------------------- mix + master
L = mixL + music_bed[0] * sidechain
R = mixR + music_bed[1] * sidechain
x = np.stack([L, R])[:, :N]
x = np.tanh(x * 0.9) / 0.9  # gentle glue saturation
# fade to silence over the last 2 s (CTA)
fade_n = int(2.0 * SR)
x[:, -fade_n:] *= np.cos(np.linspace(0, np.pi / 2, fade_n)) ** 2

def true_peak(y):
    up = np.fft.irfft(np.fft.rfft(y, axis=1), y.shape[1] * 4, axis=1) * 4
    return np.abs(up).max()

def limit(y, ceiling):
    """Look-ahead peak limiter on the 4x-oversampled envelope (5 ms attack, 80 ms release)."""
    up = np.abs(np.fft.irfft(np.fft.rfft(y, axis=1), y.shape[1] * 4, axis=1) * 4).max(0)
    pk = up.reshape(-1, 4).max(1)
    need = np.minimum(1, ceiling / np.maximum(pk, 1e-9))
    la = int(0.005 * SR)
    # look-ahead min over the window, then smooth release
    from numpy.lib.stride_tricks import sliding_window_view
    pad_ = np.concatenate([need, np.ones(la)])
    g = sliding_window_view(pad_, la + 1).min(1)[:len(need)]
    rel = np.exp(-1 / (0.08 * SR))
    out = np.empty_like(g); cur = 1.0
    for i, v in enumerate(g):
        cur = v if v < cur else v + (cur - v) * rel
        out[i] = cur
    return y * out

meter = pyln.Meter(SR)
target, ceil_db = -14.0, -1.6
y = x.copy()
for _ in range(6):
    lufs = meter.integrated_loudness(y.T)
    y = y * 10 ** ((target - lufs) / 20)
    y = limit(y, 10 ** (ceil_db / 20))
lufs = meter.integrated_loudness(y.T)
tp = 20 * np.log10(true_peak(y))
print(f'music: {N / SR:.3f} s, {lufs:.2f} LUFS, true peak {tp:.2f} dBTP')

ap = argparse.ArgumentParser(); ap.add_argument('-o', default=str(ROOT / 'videos/psx-top10/output/music.wav'))
out = Path(ap.parse_args().o); out.parent.mkdir(parents=True, exist_ok=True)
raw = out.with_suffix('.f32')
y.T.astype('<f4').tofile(raw)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', str(raw), '-c:a', 'pcm_s24le', str(out)], check=True)
raw.unlink()
print('->', out)
