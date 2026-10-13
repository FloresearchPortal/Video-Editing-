"""Final mix for "What is PSX": the silent HyperFrames render + VO + synthesized music bed (ducked
under the voice) + SFX on the on-screen hits, loudness-normalised for Reels (-14 LUFS / -1 dBTP).

    .venv/bin/python videos/what-is-psx/mix.py
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
HERE = Path(__file__).parent
VIDEO = ROOT / "motion/projects/what-is-psx/renders/what-is-psx-video.mp4"
VO = HERE / "raw/vo.mp3"
BED = HERE / "music/bed.wav"
OUT = HERE / "output/what-is-psx-final.mp4"
GEN = ROOT / "media/library/sfx/generated"
SFX = {n: GEN / f"{n}.wav" for n in ["whoosh", "swoosh_short", "impact", "riser", "pop", "tick", "shimmer", "glitch", "click", "bass_drop", "sparkle"]}
SFX["coin"] = HERE / "music/coin.wav"
SFX["crowd"] = HERE / "music/crowd.wav"

# (time s, sfx, gain) — synced to the animation cues in scenes.js
CUES = [
    (0.1, "pop", .35), (0.38, "pop", .3), (0.66, "pop", .3), (0.94, "pop", .3), (1.16, "impact", .55),
    (3.22, "swoosh_short", .4), (4.25, "glitch", .3), (5.05, "whoosh", .45), (6.5, "pop", .3), (7.28, "sparkle", .4),
    (8.05, "whoosh", .5), (8.75, "pop", .35), (9.45, "pop", .3), (12.1, "sparkle", .35), (12.95, "crowd", .5),
    (14.4, "whoosh", .4), (16.18, "pop", .3), (16.42, "pop", .3), (16.66, "pop", .3), (16.5, "impact", .3),
    (17.75, "swoosh_short", .35), (18.56, "glitch", .3), (19.95, "swoosh_short", .4), (22.2, "click", .4),
    (22.8, "swoosh_short", .35), (23.65, "whoosh", .5), (25.25, "impact", .6), (26.2, "riser", .35),
    (28.05, "pop", .4), (29.55, "whoosh", .4), (32.3, "coin", .55), (32.62, "sparkle", .3), (34.0, "impact", .45),
    (34.55, "whoosh", .4), (35.05, "pop", .25), (36.4, "swoosh_short", .3), (38.3, "pop", .35), (39.05, "whoosh", .4),
    (40.2, "pop", .35), (42.8, "swoosh_short", .3), (44.0, "coin", .5), (44.85, "whoosh", .5), (45.4, "tick", .4),
    (45.6, "tick", .4), (45.8, "tick", .4), (46.56, "pop", .3), (46.82, "pop", .3), (47.08, "pop", .3),
    (49.75, "sparkle", .4), (50.45, "whoosh", .4), (53.45, "coin", .6), (53.5, "sparkle", .35), (54.55, "whoosh", .5),
    (55.1, "pop", .4), (57.15, "swoosh_short", .3), (61.4, "crowd", .55), (63.6, "riser", .3), (64.75, "swoosh_short", .35),
    (65.05, "impact", .45), (67.18, "click", .5), (68.4, "whoosh", .4), (69.3, "pop", .3), (70.14, "pop", .3),
    (71.24, "impact", .4), (72.24, "sparkle", .4), (73.5, "glitch", .5), (75.6, "bass_drop", .45), (77.0, "crowd", .5),
    (78.5, "tick", .35), (79.95, "tick", .35), (81.86, "bass_drop", .35), (83.65, "whoosh", .5), (86.44, "impact", .6),
    (86.75, "bass_drop", .5), (87.8, "swoosh_short", .3), (88.0, "tick", .3), (90.95, "pop", .3), (91.8, "pop", .3),
    (92.65, "pop", .3), (93.6, "swoosh_short", .35), (94.8, "sparkle", .4), (96.4, "pop", .25), (97.9, "swoosh_short", .25),
    (98.7, "whoosh", .5), (100.74, "pop", .3), (102.35, "whoosh", .45), (103.05, "sparkle", .5), (103.36, "click", .5),
    (105.4, "glitch", .25), (106.42, "impact", .45), (108.5, "shimmer", .35),
]


def run(cmd):
    print(" ".join(map(str, cmd[:6])), "…")
    subprocess.run(list(map(str, cmd)), check=True)


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    tmp = HERE / "edit/with_vo.mp4"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    # 1) VO under the picture, padded to the video length
    run(["ffmpeg", "-v", "error", "-y", "-i", VIDEO, "-i", VO, "-filter_complex", "[1:a]aresample=48000,apad[a]",
         "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-shortest", tmp])
    # 2) music bed (sidechain-ducked under the VO) + SFX + loudnorm -14 LUFS
    sfx = [f"t={t}:{SFX[n]}:{g}" for t, n, g in CUES]
    run([sys.executable, "-m", "reelkit.music", tmp, BED, OUT, "--volume", "0.3", "--fade-in", "0.05", "--fade-out", "2.5",
         "--lufs", "-14", "--sfx", *sfx])
    print("final:", OUT)


if __name__ == "__main__":
    main()
