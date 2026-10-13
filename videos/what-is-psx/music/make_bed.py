"""Synthesizes the music bed + two SFX for the what-is-psx reel. Pure numpy math, seeded, original."""
import os, re, subprocess, wave
import numpy as np

SR, DUR, BPM = 48000, 114.0, 112
BAR = 4 * 60 / BPM
STEP = BAR / 16
HERE = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(7)
mid = lambda m: 440.0 * 2 ** ((np.asarray(m, float) - 69) / 12)

def tt(d): return np.arange(int(d * SR)) / SR
def fade(x, a=0.004, r=0.012):
    x = x.copy(); na, nr = int(a * SR), int(r * SR)
    x[:na] *= np.linspace(0, 1, na); x[-nr:] *= np.linspace(1, 0, nr); return x
def fft_filter(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    g = 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-9)) ** 8) / np.sqrt(1 + (f / hi) ** 8)
    return np.fft.irfft(X * g, len(x))
def noise(d, lo, hi): return fft_filter(rng.standard_normal(int(d * SR)), lo, hi)

# ---------- instruments (each returns mono or (L, R)) ----------
def kick():
    t = tt(0.32); f = 45 + 80 * np.exp(-t / 0.028)
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.11), 0.001, 0.02)
def clap():
    t = tt(0.25); e = sum(np.exp(-(t - d) / 0.045) * (t >= d) for d in (0, .011, .022))
    n = noise(0.25, 900, 3500); return fade(n / np.abs(n).max() * e / e.max(), 0.001, 0.02)
def hat():
    t = tt(0.09); n = noise(0.09, 6000, 10000); return fade(n / np.abs(n).max() * np.exp(-t / 0.018), 0.0005, 0.01)
def bass(f, d):
    t = tt(d); e = np.minimum(1, t / 0.006) * np.exp(-t / 0.5)
    return fade((np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) + 0.12 * np.sin(6 * np.pi * f * t)) * e, 0.004, 0.02)
def saw_lp(f, d, fc=3200, decay=0.13, det=1.0):
    t = tt(d); x = np.zeros_like(t); f *= det
    for k in range(1, 40):
        if k * f > 12000: break
        x += np.sin(2 * np.pi * k * f * t + k) / k / np.sqrt(1 + (k * f / fc) ** 4)
    return fade(x * np.exp(-t / decay), 0.003, 0.03)
def pad(f, d, rel=0.3, det=1.0):
    t = tt(d + rel); f *= det
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) + 0.1 * np.sin(6 * np.pi * f * t)
    e = np.minimum(1, t / 0.25) * np.minimum(1, np.clip((d + rel - t) / rel, 0, 1)); return x * e
def bell(f, d=0.5):
    t = tt(d); x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dc) for r, a, dc in ((1, 1, d / 3), (2.01, .3, d / 5), (4.07, .1, d / 8)))
    return fade(x, 0.002, 0.03)

# ---------- score ----------
CH = {'C': (60, 64, 67, 36), 'G': (55, 59, 62, 43), 'Am': (57, 60, 64, 45), 'F': (53, 57, 60, 41)}
P1, P2 = ['C', 'G', 'Am', 'F'], ['Am', 'F', 'C', 'G']
EDGE = [1, 25, 39, 46]                       # bar lines nearest 2.2 / 54 / 84 / 99 s
FIN = 108.0
def section(t):
    return 'finale' if t >= FIN else 'intro' if t < EDGE[0] * BAR else 'full' if t < EDGE[1] * BAR else \
           'var' if t < EDGE[2] * BAR else 'thin' if t < EDGE[3] * BAR else 'cta'
# gains: kick clap hat bass stab arp pad
G = {'intro': (1, 0, .6, 1, 1, 0, .5), 'full': (1, 1, 1, 1, 1, .8, .5), 'var': (1, 1, 1, 1, 1.05, 0, .5),
     'thin': (.6, 0, 0, .5, 0, 0, .65), 'cta': (1, 1, 1, 1, 1, 1, .5)}
def chord(b):
    t = b * BAR
    return 'C' if t >= FIN - BAR * .9 and b >= 50 else P2[(b - EDGE[1]) % 4] if EDGE[1] <= b < EDGE[2] else \
           P1[(b - EDGE[3]) % 4] if b >= EDGE[3] else P1[b % 4]

N = int(DUR * SR)
mix = np.zeros((2, N)); duck = np.ones(N); pads = np.zeros((2, N))
def put(buf, x, t0, gl, gr=None):
    i = int(round(t0 * SR)); n = min(len(x), N - i)
    if n <= 0: return
    buf[0, i:i + n] += x[:n] * gl; buf[1, i:i + n] += x[:n] * (gl if gr is None else gr)
K, C_, H = kick(), clap(), hat()
STAB1, STAB2 = {0, 3, 6, 10, 12}, {0, 3, 6, 8, 11, 14}
ARP = [0, 1, 2, 3, 2, 1, 2, 1]
stab_c, arp_n = {}, 0
for s in range(int(FIN / STEP) + 1):
    t = s * STEP
    if t >= FIN: break
    b, st = int(t // BAR), s % 16
    sec = section(t); gk, gc, gh, gb, gs, ga, gp = G[sec]; ch = chord(b); m = CH[ch]
    if st in (0, 8) and gk:
        put(mix, K, t, .95); n = min(int(.35 * SR), N - int(t * SR)); i = int(t * SR)
        duck[i:i + n] = np.minimum(duck[i:i + n], 1 - .4 * np.exp(-np.arange(n) / SR / .1))
    if st in (4, 12) and gc: put(mix, C_, t, .45)
    if st % 2 == 0 and gh: put(mix, H, t, gh * (.14 if st % 4 == 2 else .08), gh * (.08 if st % 4 == 2 else .14))
    if st in (0, 6, 8, 12) and gb:
        put(mix, bass(mid(m[3]), {0: 5, 6: 2, 8: 3, 12: 3}[st] * STEP - .01), t, .5 * gb)
    if gs and st in (STAB2 if sec == 'var' else STAB1):
        if ch not in stab_c: stab_c[ch] = [sum(saw_lp(mid(n + 12), .4, det=d) for n in m[:3]) for d in (.997, 1.003)]
        a = 1 if st == 0 else .75; put(mix, stab_c[ch][0], t, .06 * gs * a, .03 * gs * a); put(mix, stab_c[ch][1], t, .03 * gs * a, .06 * gs * a)
    if ga and st % 2 == 0:
        note = m[ARP[(st // 2) % 8] % 3] + 24 + (12 if ARP[(st // 2) % 8] == 3 else 0)
        p = .5 + .35 * (1 if (st // 2) % 2 else -1); put(mix, bell(mid(note)), t, .05 * ga * (1 - p) * 2, .05 * ga * p * 2)
for b in range(int(FIN / BAR) + 1):                  # pads, per bar
    t0 = b * BAR; gp = G[section(t0)][6]; d = min(t0 + BAR, FIN) - t0
    if d <= 0 or not gp: continue
    for n in CH[chord(b)][:3]:
        put(pads, pad(mid(n), d, det=.998), t0, .06 * gp, 0); put(pads, pad(mid(n), d, det=1.002), t0, 0, .06 * gp)
mix += pads * duck
# finale: resolving C major swell
t = tt(DUR - FIN); e = np.sin(np.clip(t / 1.2, 0, 1) * np.pi / 2) ** 2 * np.exp(-np.clip(t - 1.2, 0, None) / 1.6)
e *= np.clip((DUR - FIN - t) / 1.2, 0, 1)
fin = np.zeros((2, len(t)))
for n in (48, 52, 55, 60, 64, 67, 72):
    for ch_, d in ((0, .998), (1, 1.002)):
        f = mid(n) * d; fin[ch_] += (np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t)) * .04
fin += (np.sin(2 * np.pi * mid(36) * t) * e * .5)
fin *= e; i = int(FIN * SR); mix[:, i:i + fin.shape[1]] += fin[:, :N - i]
for k, n in enumerate((84, 88, 91, 96)):
    put(mix, bell(mid(n), 2.0), FIN + .06 + k * .14, .03 * (1 - k * .15))
mix[:, int((DUR - .6) * SR):] *= np.linspace(1, 0, N - int((DUR - .6) * SR))

# ---------- master ----------
def hp(x, fc=28):
    f = np.fft.rfftfreq(x.shape[-1], 1 / SR); return np.fft.irfft(np.fft.rfft(x) / (1 + (fc / np.maximum(f, 1e-9)) ** 4 + 0j), x.shape[-1])
def write(path, x):
    with wave.open(path, 'wb') as w:
        w.setnchannels(x.shape[0]); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x.T, -1, 1) * 32767).round().astype('<i2').tobytes())
def lufs(path):
    r = subprocess.run(['ffmpeg', '-i', path, '-af', 'ebur128=framelog=quiet:peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', r)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', r)[-1])
mix = np.stack([hp(mix[0]), hp(mix[1])]); mix -= mix.mean(axis=1, keepdims=True)
out = os.path.join(HERE, 'bed.wav'); gain = 1.0
for _ in range(6):
    y = np.tanh(mix * gain * 1.2) / np.tanh(1.2)
    pk = np.abs(y).max()
    if pk > 10 ** (-1.5 / 20): y *= 10 ** (-1.5 / 20) / pk
    write(out, y); I, P = lufs(out)
    if abs(I + 16) < .15 and P <= -1.45: break
    gain *= 10 ** ((-16 - I) / 20)
print(f'bed.wav  LUFS {I:.2f}  peak {P:.2f} dBFS  len {y.shape[1] / SR:.3f}s')
for a, b_ in ((0, 2.2), (2.2, 54), (54, 84), (84, 99), (99, 108), (108, 114)):
    seg = y[:, int(a * SR):int(b_ * SR)]; print(f'  RMS {a:6.1f}-{b_:5.1f}s: {20 * np.log10(np.sqrt((seg ** 2).mean())):6.2f} dBFS')

# ---------- SFX ----------
def peak3(x): return x / np.abs(x).max() * 10 ** (-3 / 20)
t = tt(0.6); coin = np.zeros_like(t)
for f0, t0, dc in ((1319, 0.0, .05), (1976, 0.075, .16)):
    tl = np.clip(t - t0, 0, None); on = (t >= t0)
    for r, a, k in ((1, 1, 1), (2.76, .5, .6), (5.4, .3, .35), (8.93, .15, .2)):
        coin += on * a * np.sin(2 * np.pi * f0 * r * tl) * np.exp(-tl / (dc * k)) * np.minimum(1, tl / 0.002)
coin = fade(coin, 0.001, 0.05); write(os.path.join(HERE, 'coin.wav'), np.stack([peak3(coin)] * 2))
d = 2.5; cr = np.zeros(int(d * SR))
for lo, hi in ((250, 600), (600, 1300), (1300, 2800)):
    m = fft_filter(rng.standard_normal(len(cr)), .5, 5); m /= np.abs(m).max()
    cr += noise(d, lo, hi) * np.clip(.55 + .45 * m, 0, 1) ** 2
cr = fade(cr, .35, .45)
write(os.path.join(HERE, 'crowd.wav'), np.stack([peak3(cr), peak3(np.roll(cr, 977))]))
print('coin.wav, crowd.wav written')
