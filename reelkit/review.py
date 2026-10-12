"""Contact sheet of a render so the edit can be checked by eye (frames every N seconds).

    python -m reelkit.review video.mp4 [-o sheet.png] [--every 1.0] [--cols 8]
"""
from __future__ import annotations

import argparse
import math
import subprocess
from pathlib import Path

from .common import duration


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("-o", "--out")
    ap.add_argument("--every", type=float, default=1.0)
    ap.add_argument("--cols", type=int, default=8)
    ap.add_argument("--width", type=int, default=240, help="thumbnail width")
    a = ap.parse_args()
    n = max(1, math.ceil(duration(a.video) / a.every))
    rows = math.ceil(n / a.cols)
    out = a.out or str(Path(a.video).with_suffix(".sheet.png"))
    vf = (f"fps=1/{a.every},scale={a.width}:-2,"
          f"drawtext=text='%{{pts\\:hms}}':x=6:y=6:fontsize=14:fontcolor=white:box=1:boxcolor=black@0.5,"
          f"tile={a.cols}x{rows}")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-vf", vf, "-frames:v", "1", out], check=True)
    print(out)


if __name__ == "__main__":
    main()
