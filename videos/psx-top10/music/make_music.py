"""Original 128 BPM electronic score for the PSX Top 10 reel, synthesised from scratch (numpy only,
no samples, so no licence issues). Every cue is read from the shared timeline
(remotion/src/projects/psx-top10/timeline.json), so the music accents land on the same beats as the
picture. No separate sound effects; the arrangement itself carries the accents.

  .venv/bin/python videos/psx-top10/music/make_music.py [-o videos/psx-top10/output/music.wav]

Master: -14 LUFS integrated, true peak <= -1.5 dBTP (measured with pyloudnorm + 4x oversampling).
The silent beat (build.silence) is written as exact digital zeros.
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

def duck(at, depth=0.6, rel=0.13):
    n = int(0.5 * SR); t = t_(n)
    e = min(len(sidechain), at + n)
    sidechain[at:e] = np.minimum(sidechain[at:e], (1 - depth * np.exp(-t / rel))[:e - at])

music_bed = [np.zeros_like(mixL), np.zeros_like(mixL)]  # ducked layer (bass, pad, arp)
def put_bed(sig, at, gain=1.0):
    s = sig if sig.ndim == 2 else np.stack([sig, sig])
    e = min(len(mixL), at + s.shape[1])
    music_bed[0][at:e] += gain * s[0, :e - at]; music_bed[1][at:e] += gain * s[1, :e - at]

hook, ex, cd, bu, dr, rk, cta = (S[k] for k in ('hook', 'explain', 'countdown', 'build', 'drop', 'ranking', 'cta'))
rank_beats = []
b = cd['start']
for r in range(10, 1, -1):
    rank_beats.append(b); b += cd['beats_rank2'] if r == 2 else cd['beats_per_company']
top3_beat = rank_beats[10 - cd['top3_from_rank']]
end_beat = END_S / BEAT

def energy(beat):
    """'light' | 'groove' | 'full' | None per beat."""
    if beat < hook['end']: return 'groove'
    if beat < ex['end']: return 'light'
    if beat < top3_beat: return 'groove'
    if beat < bu['start']: return 'full'
    if beat < dr['start']: return None
    if beat < cta['start']: return 'full'
    return 'soft'

# frame-1 hit + title-word stabs
put(kick(1.1), 0); put(sub_hit(1.0, 1.4), 0); put(crash(1.0), 0)
put(stab(chord_at(0)[1], 1.2, 0.6), 0)
for w in hook['words']:
    put(stab(chord_at(w)[1], 0.85, 0.32, 3200), b2s(w))
# explainer card plucks
for i, c in enumerate(ex['cards']):
    put(stab(chord_at(c)[1], 0.45, 0.25, 2000), b2s(c))
# rank changes: stab + low hit
for i, rb in enumerate(rank_beats):
    big = rb >= top3_beat
    put(stab(chord_at(rb)[1], 1.0 if big else 0.85, 0.45, 3400 if big else 2800), b2s(rb))
    put(sub_hit(0.75 if big else 0.6, 0.9), b2s(rb))
    if big: put(crash(0.6), b2s(rb))

# grid: drums + bass + pads/arps by energy
beat = 0.0
while beat < end_beat:
    en = energy(beat)
    s0 = b2s(beat)
    if en is not None:
        bar_root, ch = chord_at(beat)
        kick_on = not (en == 'soft' and beat >= cta['static_from'] - 0.01)
        if beat >= 1 and kick_on:
            kl = {'light': 0.7, 'groove': 0.95, 'full': 1.0, 'soft': 0.5}[en]
            if not (beat == 0):
                put(kick(kl), s0); duck(s0, 0.65 if en != 'soft' else 0.35)
        if en in ('groove', 'full') and int(beat) % 2 == 1 and beat >= 2:
            put(clap(0.8 if en == 'groove' else 0.9), s0)
        if en in ('groove', 'full', 'light') and beat >= 1:
            put(hat(0.7 if en == 'light' else 0.9, open_=(en == 'full')), b2s(beat + 0.5), pan=0.25)
            if en == 'full':
                put(hat(0.45), b2s(beat + 0.25), pan=-0.3); put(hat(0.45), b2s(beat + 0.75), pan=-0.3)
        # bass on the off-beat 8th (classic house), quieter in the explainer
        if en in ('groove', 'full', 'light') and beat >= 1:
            bl = {'light': 0.55, 'groove': 0.9, 'full': 1.0}[en]
            put_bed(bass(note(bar_root), int(BEAT * 0.5 * SR), bl), b2s(beat + 0.5))
        # arp (top 3 + ranking) and pads
        if en == 'full':
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
# CTA: soft high pluck arp in eighths until the hold, then pad only
bb = cta['start']
while bb < end_beat - 2:
    ch = chord_at(bb)[1]
    put_bed(pluck(note(ch[int(bb * 2) % 3]) * 2, 1.1, 2000), b2s(bb))
    bb += 0.5

# build: stabs on "And" / "number one?", snare roll + tonal riser into the silent beat
put(stab(chord_at(bu['and'])[1], 0.8, 0.4), b2s(bu['and']))
put(stab(chord_at(bu['number_one'])[1], 0.9, 0.4), b2s(bu['number_one']))
sil0, sil1 = b2s(bu['silence'][0]), b2s(bu['silence'][1])
rs, re_ = b2s(bu['start']), sil0
k = 0; pos = bu['start']
while pos < bu['silence'][0] - 1e-6:
    prog = (pos - bu['start']) / (bu['silence'][0] - bu['start'])
    put(snare(0.8 + 1.4 * prog), b2s(pos))
    pos += 0.25 if prog < 0.5 else 0.125
n = re_ - rs; t = t_(n)
f = 110 * 2 ** (3 * (t / t[-1]) ** 1.5)
riser = np.zeros(n)
for i, dc in enumerate((-12, 0, 12)):
    ph = 2 * np.pi * np.cumsum(f * 2 ** (dc / 1200)) / SR
    for h in range(1, 7):
        riser += np.sin(h * ph + i) / h
riser *= (0.15 + 0.85 * (t / t[-1]) ** 1.6) * 0.22
put(np.stack([riser * 0.9, riser * 1.1]), rs)
# drop + #1 hold (pulse each beat) + OGDC reveal hit + value landing
d0 = dr['start']
put(kick(1.2), b2s(d0)); put(sub_hit(1.2, 2.2, 40), b2s(d0)); put(crash(1.2, 2.4), b2s(d0))
put(stab(chord_at(d0)[1] + [chord_at(d0)[1][0][:-1] + '5'], 1.3, 0.9, 4200, 1.3), b2s(d0))
for i in range(1, dr['hold_beats']):
    put(stab(chord_at(d0 + i)[1], 0.6, 0.3, 3000), b2s(d0 + i))
put(sub_hit(1.0, 1.4), b2s(dr['contract'])); put(crash(0.8), b2s(dr['contract']))
put(stab(chord_at(dr['contract'])[1], 1.1, 0.6, 3800), b2s(dr['contract']))
put(stab(chord_at(dr['value_lands'])[1], 0.8, 0.35, 3600), b2s(dr['value_lands']))
# ranking entry + CTA arrival
put(stab(chord_at(rk['start'])[1], 0.9, 0.45), b2s(rk['start'])); put(crash(0.5), b2s(rk['start']))
put(stab(chord_at(cta['start'])[1], 0.7, 0.8, 1800), b2s(cta['start'])); put(sub_hit(0.6, 1.6), b2s(cta['start']))

# ---------------------------------------------------------------- mix + master
L = mixL + music_bed[0] * sidechain
R = mixR + music_bed[1] * sidechain
x = np.stack([L, R])[:, :N]
x = np.tanh(x * 0.9) / 0.9  # gentle glue saturation
# fade to silence over the last 3 s (CTA)
fade_n = int(3.0 * SR)
x[:, -fade_n:] *= np.cos(np.linspace(0, np.pi / 2, fade_n)) ** 2
# exact digital silence for the silent beat (tiny 5 ms fade into it)
fi = int(0.005 * SR)
x[:, sil0 - fi:sil0] *= np.linspace(1, 0, fi)
x[:, sil0:sil1] = 0.0

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
    y[:, sil0:sil1] = 0.0
lufs = meter.integrated_loudness(y.T)
tp = 20 * np.log10(true_peak(y))
print(f'music: {N / SR:.3f} s, {lufs:.2f} LUFS, true peak {tp:.2f} dBTP, silent beat {sil0 / SR:.3f}-{sil1 / SR:.3f} s max |x|={np.abs(y[:, sil0:sil1]).max()}')

ap = argparse.ArgumentParser(); ap.add_argument('-o', default=str(ROOT / 'videos/psx-top10/output/music.wav'))
out = Path(ap.parse_args().o); out.parent.mkdir(parents=True, exist_ok=True)
raw = out.with_suffix('.f32')
y.T.astype('<f4').tofile(raw)
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', str(raw), '-c:a', 'pcm_s24le', str(out)], check=True)
raw.unlink()
print('->', out)
