"""Final mix for "What is PSX" (v2): silent HyperFrames render + VO + synthesized music bed + a SPARSE,
quiet SFX bus. Both the music and the SFX bus are sidechain-ducked under the voice, so effects never
cover a word; the whole mix is loudness-normalised for Reels (-14 LUFS / -1 dBTP).

    .venv/bin/python videos/what-is-psx/mix.py
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).parent
VIDEO = ROOT / "motion/projects/what-is-psx/renders/what-is-psx-video.mp4"
VO = HERE / "raw/vo.mp3"
BED = HERE / "music/bed.wav"
OUT = HERE / "output/what-is-psx-final.mp4"
GEN = ROOT / "media/library/sfx/generated"
SFX = {n: GEN / f"{n}.wav" for n in ["whoosh", "swoosh_short", "impact", "riser", "pop", "tick", "glitch", "click", "bass_drop", "sparkle"]}
SFX["coin"] = HERE / "music/coin.wav"
SFX["crowd"] = HERE / "music/crowd.wav"

# (time s, sfx, gain) — only the big visual hits; voice always wins
CUES = [
    (1.45, "shimmer", .08), (2.35, "whoosh", .1), (3.28, "swoosh_short", .14), (4.30, "bass_drop", .2), (5.10, "whoosh", .12),
    (8.08, "whoosh", .12), (14.42, "whoosh", .12), (17.72, "swoosh_short", .13), (25.25, "pop", .14),
    (32.30, "coin", .12), (42.95, "click", .2), (43.92, "tick", .1), (44.30, "click", .2), (44.90, "whoosh", .12),
    (53.40, "coin", .2), (61.40, "crowd", .2), (67.20, "click", .18), (73.45, "swoosh_short", .13), (75.75, "bass_drop", .17),
    (82.60, "bass_drop", .15), (86.44, "impact", .22), (94.80, "pop", .12), (98.75, "whoosh", .12),
    (103.05, "sparkle", .18), (106.42, "impact", .13),
]


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(VIDEO)]).strip())
    inputs = ["-i", str(VIDEO), "-i", str(VO), "-i", str(BED)]
    parts = [
        "[1:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:%.3f,asplit=3[vo][sc1][sc2]" % dur,
        "[2:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.26,atrim=0:%.3f,afade=t=out:st=%.3f:d=3[bed]" % (dur, dur - 3),
        "[bed][sc1]sidechaincompress=threshold=0.025:ratio=8:attack=25:release=450:makeup=1[mus]",
    ]
    labels = []
    for k, (t, name, g) in enumerate(CUES):
        inputs += ["-i", str(SFX[name])]
        ms = int(t * 1000)
        parts.append(f"[{3 + k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={g},adelay={ms}|{ms}[s{k}]")
        labels.append(f"[s{k}]")
    parts.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad,atrim=0:{dur:.3f},"
                 f"highpass=f=120,lowpass=f=9000[sfxraw]")
    parts.append("[sfxraw][sc2]sidechaincompress=threshold=0.02:ratio=5:attack=8:release=250:makeup=1[sfx]")
    parts.append("[vo][mus][sfx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[out]")
    cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(parts),
           "-map", "0:v", "-map", "[out]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-t", f"{dur:.3f}", str(OUT)]
    subprocess.run(cmd, check=True)
    print("final:", OUT)


if __name__ == "__main__":
    main()
