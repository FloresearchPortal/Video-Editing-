"""Voice-over prep for "What is an IPO" (client notes): drop the lead-in before the script ("Hi, so"),
tighten every pause to a natural beat, and give the WhatsApp recording a studio polish — all local/free.

    .venv/bin/python videos/what-is-an-ipo/prep_vo.py   → edit/vo_studio.wav (+ edit/vo_cuts.json)
"""
import json, re, subprocess
from pathlib import Path

HERE = Path(__file__).parent
ROOT = HERE.parents[1]
SRC = HERE / "raw/vo_original.wav"
START = 1.74          # script starts at "Aap ke dost…" (1.9 s); "Hi, so" before it is cut
PAUSE = 0.22          # every silence longer than this is shortened to this
OUT = HERE / "edit/vo_studio.wav"


def silences(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(path), "-af", "silencedetect=n=-38dB:d=0.3", "-f", "null", "-"],
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
        "highpass=f=80", "arnndn=m=tools/models/rnnoise/sh.rnnn:mix=0.9",        # broadband noise / room hiss
        "equalizer=f=220:t=q:w=1.0:g=-2.5",                                        # phone-mic mud
        "equalizer=f=3300:t=q:w=1.2:g=3",                                          # presence / clarity
        "highshelf=f=9500:g=2.5",                                                  # air
        "deesser=i=0.35",                                                          # tame the lifted sibilance
        "acompressor=threshold=-21dB:ratio=3:attack=6:release=90:makeup=2",       # even, broadcast-like level
        "afade=t=in:d=0.04", "loudnorm=I=-16:TP=-1.5:LRA=7", "aresample=48000",
    ])
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-af", chain, "-ac", "1", str(OUT)], check=True, cwd=ROOT)
    nd = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(OUT)]))
    print(f"{dur:.1f}s raw → {nd:.1f}s ({len(keep)} speech runs)  → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
