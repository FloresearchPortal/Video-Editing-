"""One command, whole edit: assemble -> transcribe the cut -> kinetic captions -> motion-graphics
overlays -> music bed.

    python -m reelkit.make_reel timeline.json [--preview] [--from captions]

Every stage writes into the timeline's `output` paths (default edit/), so a stage can be re-run
alone after a tweak: --from transcribe|captions|overlays|music.
"""
from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

from .common import ROOT, load_json, save_json

STAGES = ["assemble", "transcribe", "captions", "overlays", "music"]


def run(mod: str, *args: str) -> None:
    print(f"\n=== {mod} {' '.join(args)}")
    env = {**os.environ, "PYTHONPATH": os.pathsep.join(filter(None, [str(ROOT), os.environ.get("PYTHONPATH")]))}
    subprocess.run([sys.executable, "-m", f"reelkit.{mod}", *args], check=True, env=env)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("timeline")
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--from", dest="start", choices=STAGES, default="assemble")
    a = ap.parse_args()

    tlp = Path(a.timeline).resolve()
    base = tlp.parent
    tl = load_json(tlp)
    o = tl.get("output", {})
    stage1 = base / o.get("stage1", "edit/stage1.mp4")
    words = base / o.get("words", "edit/stage1.words.json")
    captioned = base / o.get("captioned", "edit/stage2_captions.mp4")
    overlaid = base / o.get("overlaid", "edit/stage3_overlays.mp4")
    final = base / o.get("final", "edit/final.mp4")
    todo = STAGES[STAGES.index(a.start):]

    if "assemble" in todo:
        run("assemble", str(tlp), *(["--preview"] if a.preview else []))
    if "transcribe" in todo:
        cap = tl.get("captions", {})
        run("transcribe", str(stage1), "-o", str(words), "--model", cap.get("model", "small"),
            *(["--language", cap["language"]] if cap.get("language") else []),
            *(["--keyterms", str(base / cap["keyterms"])] if cap.get("keyterms") else []))
    if "captions" in todo:
        cap = tl.get("captions", {})
        if cap.get("enabled", True):
            style = base / "edit" / "caption_style.json"
            save_json(style, {k: v for k, v in cap.items()
                              if k not in ("enabled", "model", "language", "keyterms")})
            run("captions", str(stage1), str(words), str(captioned), "--style", str(style))
        else:
            shutil.copy(stage1, captioned)
    ovs = tl.get("overlays", [])
    if "overlays" in todo:
        if ovs:
            spec = base / "edit" / "overlays.json"
            save_json(spec, ovs)
            run("overlay", str(captioned), str(spec), str(overlaid), "--base", str(base))
        else:
            shutil.copy(captioned, overlaid)
    if "music" in todo:
        m = tl.get("music")
        if m and m.get("src"):
            args = [str(overlaid), str(base / m["src"]), str(final),
                    "--volume", str(m.get("volume", 0.22)), "--start", str(m.get("start", 0)),
                    "--lufs", str(m.get("lufs", -14))]
            if not m.get("duck", True):
                args.append("--no-duck")
            sfx = [f"t={s['t']}:{base / s['src']}:{s.get('gain', 0.6)}" for s in tl.get("sfx", [])]
            if ovs:  # SFX attached to overlays, timed from where each overlay landed
                from .overlay import resolve, sfx_cues
                sfx += [f"t={c['t']}:{c['src']}:{c['gain']}"
                        for c in sfx_cues(resolve(ovs, base, base / "edit" / "overlays"))]
            if sfx:
                args += ["--sfx", *sfx]
            run("music", *args)
        else:
            shutil.copy(overlaid, final)
    print(f"\nfinal: {final}")


if __name__ == "__main__":
    main()
