"""Synthesise transition sound effects with ffmpeg — no samples, no licences, you own the output.

    python -m reelkit.sfx_gen [--out media/library/sfx/clips]      # writes all presets
    python -m reelkit.sfx_gen --only whoosh impact

Presets: whoosh (zoom/whip transitions), swoosh_short, impact (hard cut / keyword hit),
riser (build into a punch-in), pop (word/graphic pop), tick (subtle UI tick), shimmer (light leak),
glitch (glitch transition / data hit), click (UI click, cursor), bass_drop (title slam / reveal),
sparkle (stat or logo landing).
"""
from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

from .common import ROOT

PRESETS = {
    # band-passed noise whose centre frequency sweeps up then down, with a swell envelope
    "whoosh": ("anoisesrc=d=0.9:c=pink:a=0.9",
               "highpass=f=250,lowpass=f=6000,"
               "bandpass=f=1200:width_type=o:w=2.2,"
               "volume='if(lt(t,0.55),pow(t/0.55,2),pow((0.9-t)/0.35,1.6))':eval=frame,"
               "afade=t=out:st=0.75:d=0.15,volume=4"),
    "swoosh_short": ("anoisesrc=d=0.4:c=white:a=0.6",
                     "highpass=f=900,lowpass=f=9000,volume='sin(PI*t/0.4)':eval=frame,volume=3"),
    "impact": ("sine=f=55:d=0.8",
               "volume='exp(-6*t)':eval=frame,aeval='val(0)*0.9+0.1*sin(2*PI*110*t)*exp(-12*t)',"
               "lowpass=f=400,volume=3"),
    "riser": ("anoisesrc=d=1.6:c=pink:a=0.8",
              "highpass=f=400,bandpass=f=2500:width_type=o:w=3,"
              "volume='pow(t/1.6,2.2)':eval=frame,afade=t=out:st=1.5:d=0.1,volume=5"),
    "pop": ("sine=f=900:d=0.12",
            "aeval='sin(2*PI*(900-3000*t)*t)*exp(-35*t)',volume=1.4"),
    "tick": ("sine=f=2400:d=0.05", "volume='exp(-90*t)':eval=frame,volume=6"),
    "shimmer": ("sine=f=1760:d=1.2",
                "aeval='(sin(2*PI*1760*t)+0.6*sin(2*PI*2640*t)+0.4*sin(2*PI*3520*t))/2*sin(PI*t/1.2)',"
                "aecho=0.8:0.7:60|120:0.4|0.3,volume=0.8"),
    # bit-crushed noise gated into stutters, plus a falling square-ish tone
    "glitch": ("anoisesrc=d=0.45:c=white:a=0.7",
               "aeval='val(0)*gt(sin(2*PI*23*t),0.1)+0.5*sgn(sin(2*PI*(700-900*t)*t))*gt(sin(2*PI*11*t),0.4)',"
               "acrusher=bits=6:samples=6,highpass=f=300,volume='exp(-3*t)':eval=frame,volume=0.9"),
    "click": ("sine=f=3200:d=0.04",
              "aeval='(sin(2*PI*3200*t)+0.5*sin(2*PI*5100*t))*exp(-160*t)',volume=1.6"),
    "bass_drop": ("sine=f=40:d=1.4",
                  "aeval='sin(2*PI*(120*t-30*t*t))*exp(-2.4*t)',lowpass=f=300,volume=1.5"),
    "sparkle": ("sine=f=2000:d=0.9",
                "aeval='(sin(2*PI*2093*t)*lt(t,0.3)+sin(2*PI*2637*t)*gte(t,0.08)+sin(2*PI*3136*t)*gte(t,0.16))"
                "*exp(-5*t)/2',aecho=0.7:0.6:45|90:0.35|0.25,volume=2.8"),
}


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--out", default=str(ROOT / "media" / "library" / "sfx" / "generated"))
    ap.add_argument("--only", nargs="*")
    a = ap.parse_args()
    out = Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    for name, (src, af) in PRESETS.items():
        if a.only and name not in a.only:
            continue
        dst = out / f"{name}.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", src, "-af",
                        af + ",aformat=sample_rates=48000:channel_layouts=stereo,alimiter=limit=0.89",
                        str(dst)], check=True)
        print(dst)


if __name__ == "__main__":
    main()
