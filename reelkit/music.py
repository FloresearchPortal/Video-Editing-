"""Lay a background music bed under the voice: loop/trim to length, fade in/out, duck under
speech (sidechain compression), then loudness-normalise for social (-14 LUFS). ffmpeg only.

    python -m reelkit.music in.mp4 music.mp3 out.mp4 [--volume 0.22] [--start 0] [--no-duck]
                                                     [--lufs -14] [--sfx t=3.2:whoosh.wav ...]
"""
from __future__ import annotations

import argparse
import subprocess

from .common import duration, has_audio, need


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("music")
    ap.add_argument("out")
    ap.add_argument("--volume", type=float, default=0.22, help="music level before ducking (0-1)")
    ap.add_argument("--start", type=float, default=0.0, help="offset into the music file (s)")
    ap.add_argument("--fade-in", type=float, default=0.8)
    ap.add_argument("--fade-out", type=float, default=1.5)
    ap.add_argument("--no-duck", action="store_true")
    ap.add_argument("--lufs", type=float, default=-14.0)
    ap.add_argument("--sfx", nargs="*", default=[], help="t=<sec>:<file>[:<gain>] one-shot effects")
    a = ap.parse_args()
    need("ffmpeg")

    dur = duration(a.video)
    inputs = ["-i", a.video, "-stream_loop", "-1", "-ss", str(a.start), "-i", a.music]
    fo_st = max(0.0, dur - a.fade_out)
    music = (f"[1:a]atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,"
             f"volume={a.volume},afade=t=in:d={a.fade_in},afade=t=out:st={fo_st:.3f}:d={a.fade_out}[m]")
    parts = [music]
    if has_audio(a.video):
        parts.append("[0:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[v][sc]")
        if a.no_duck:
            parts.append("[m]anull[md]")
        else:
            parts.append("[m][sc]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=350:makeup=1[md]")
        mix = ["[v]", "[md]"]
    else:
        mix = ["[m]"]

    for k, spec in enumerate(a.sfx):
        t_part, f, *g = spec.split(":")
        t = float(t_part.split("=")[1])
        inputs += ["-i", f]
        idx = 2 + k
        parts.append(f"[{idx}:a]aformat=sample_rates=48000:channel_layouts=stereo,"
                     f"volume={g[0] if g else 0.6},adelay={int(t * 1000)}|{int(t * 1000)}[s{k}]")
        mix.append(f"[s{k}]")

    parts.append(f"{''.join(mix)}amix=inputs={len(mix)}:duration=first:normalize=0,"
                 f"loudnorm=I={a.lufs}:TP=-1.0:LRA=11,aresample=48000[out]")
    cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(parts),
           "-map", "0:v", "-map", "[out]", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
           "-t", f"{dur:.3f}", a.out]
    subprocess.run(cmd, check=True)
    print(f"wrote {a.out}")


if __name__ == "__main__":
    main()
