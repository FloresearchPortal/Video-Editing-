"""Voice-over prep for "What are Future Contracts" (client notes): cut the leading breath,
tighten every pause to a natural beat, and give the WhatsApp recording a studio polish — all local/free.

    .venv/bin/python videos/what-is-an-ipo/prep_vo.py   → edit/vo_studio.wav (+ edit/vo_cuts.json)
"""
import json, re, subprocess
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[1]
SRC = HERE / "raw/vo_original.wav"
START = 1.78          # script starts at "Bhai ne kaha" (1.85 s); the breath before it is cut
PAUSE = 0.10          # client: "skip the empty places" - every gap longer than this is cut down to this
OUT = HERE / "edit/vo_studio.wav"


def silences(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(path), "-af", "silencedetect=n=-38dB:d=0.16", "-f", "null", "-"],
                       capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", r)]
    en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", r)]
    return list(zip(st, en))


def main():
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(SRC)]))
    keep, t = [], START
    for a, b in silences(SRC):
        if b <= START: continue
        a = max(a, START)
        if b - a <= PAUSE: continue
        keep.append((t, a + PAUSE / 2)); t = b - PAUSE / 2
    end = min(dur, t + 30)
    tail = [s for s in silences(SRC) if s[0] > t]
    keep.append((t, min(end, tail[0][0] + 0.15) if tail else end))
    json.dump({"start": START, "pause": PAUSE, "keep": [[round(a, 3), round(b, 3)] for a, b in keep]}, open(HERE / "edit/vo_cuts.json", "w"), indent=1)
    sel = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in keep)
    chain = ",".join([
        f"aselect='{sel}'", "asetpts=N/SR/TB",
        # studio treatment (client: "make the audio sound as if it's properly recorded in a recording studio")
        "highpass=f=70",                                                            # rumble
        "afftdn=nr=14:nf=-48:tn=1",                                                 # adaptive broadband denoise (tracks the noise)
        "arnndn=m=tools/models/rnnoise/sh.rnnn:mix=1",                             # voice-trained denoise, full strength
        "agate=threshold=0.02:ratio=2.5:attack=4:release=140:range=0.1:knee=4",    # downward expander: room tail between words down ~20 dB
        "dynaudnorm=f=120:g=7:p=0.85:m=14:r=0.5",                                   # lift trailing-off phrase ends
        "bass=g=2:f=110:w=0.7",                                                     # warmth / proximity
        "equalizer=f=300:t=q:w=1.2:g=-3",                                          # boxy phone-room resonance
        "equalizer=f=3500:t=q:w=1.0:g=2.5",                                        # presence / clarity
        "highshelf=f=10000:g=2",                                                   # air
        "deesser=i=0.4",                                                           # sibilance
        "acompressor=threshold=-24dB:ratio=2.5:attack=8:release=120:makeup=2",     # leveling
        "acompressor=threshold=-14dB:ratio=4:attack=3:release=60:makeup=1",        # peak control
        "alimiter=limit=0.89:attack=2:release=40",
        "afade=t=in:d=0.04", "loudnorm=I=-16:TP=-1.5:LRA=7", "aresample=48000",
    ])
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-af", chain, "-ac", "1", str(OUT)], check=True, cwd=ROOT)
    nd = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(OUT)]))
    print(f"{dur:.1f}s raw → {nd:.1f}s ({len(keep)} speech runs)  → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
