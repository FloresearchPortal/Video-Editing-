"""Composite motion-graphics overlays (alpha MOV/WebM, or HyperFrames templates rendered on demand)
onto a video. ffmpeg only for the composite; HyperFrames (motion/, Apache-2.0) for template renders.

    python -m reelkit.overlay in.mp4 overlays.json out.mp4 [--base DIR]

overlays.json is a list (the same list as a timeline's "overlays"):
    {"template": "lower-third", "vars": {"name": "Sam Lee"}, "t": 1.2}
    {"template": "shape-wipe", "cut": 6.4}                 # t = cut - the template's anchor
    {"src": "motion/renders/logo.mov", "t": 9.0, "dur": 2, "x": 40, "y": 60, "scale": 0.5}
`template` is a folder in motion/templates/ or a path to any HyperFrames project; `vars` become
`--variables`. Full-frame overlays (no x/y/scale) are fitted to the video size. Each overlay may
carry "sfx": {"src": ..., "at": 0.0, "gain": 0.6} (path relative to the JSON) or "sfx": true for the
template's suggested sound (motion/templates/<name>/template.json); make_reel mixes them in the music stage.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
from pathlib import Path

from .common import ROOT, duration, load_json, need

MOTION = ROOT / "motion"
HF_VERSION = json.loads((MOTION / "package.json").read_text())["devDependencies"]["hyperframes"]


def template_dir(name: str, base: Path) -> Path:
    for cand in (base / name, MOTION / "templates" / name, Path(name)):
        if (cand / "index.html").exists():
            return cand.resolve()
    raise SystemExit(f"overlay template not found: {name} (looked in {base}, motion/templates/)")


def template_meta(tdir: Path) -> dict:
    p = tdir / "template.json"
    return load_json(p) if p.exists() else {}


def hyperframes_cmd() -> list[str]:
    local = MOTION / "node_modules" / ".bin" / "hyperframes"
    if local.exists():
        return [str(local)]
    need("npx")
    return ["npx", "--yes", f"hyperframes@{HF_VERSION}"]


def render_template(tdir: Path, variables: dict, cache: Path) -> Path:
    """Render a HyperFrames project to ProRes 4444 (alpha), cached by content + variables."""
    h = hashlib.sha1()
    for f in sorted(tdir.rglob("*")):
        if f.is_file() and f.suffix in (".html", ".css", ".js", ".json"):
            h.update(f.relative_to(tdir).as_posix().encode())
            h.update(f.read_bytes())
    h.update(json.dumps(variables, sort_keys=True).encode())
    out = cache / f"{tdir.name}-{h.hexdigest()[:10]}.mov"
    if out.exists():
        return out
    cache.mkdir(parents=True, exist_ok=True)
    cmd = [*hyperframes_cmd(), "render", str(tdir), "--format", "mov", "-o", str(out), "--quiet"]
    if variables:
        cmd += ["--variables", json.dumps(variables)]
    print(f"rendering {tdir.name} {variables or ''}")
    subprocess.run(cmd, check=True, cwd=MOTION, env={**os.environ, "HYPERFRAMES_SKIP_SKILLS": "1"})
    return out


def resolve(overlays: list, base: Path, cache: Path) -> list[dict]:
    """Fill in src (rendering templates) and absolute start t for every overlay."""
    done = []
    for ov in overlays:
        ov = dict(ov)
        anchor, sfx = 0.0, ov.get("sfx")
        if ov.get("template"):
            tdir = template_dir(ov["template"], base)
            meta = template_meta(tdir)
            anchor = float(meta.get("anchor", 0.0))
            if sfx is True and meta.get("sfx"):  # the template's suggested sound (repo-relative path)
                sfx = {**meta["sfx"], "src": str(ROOT / meta["sfx"]["src"])}
            ov["src"] = str(render_template(tdir, ov.get("vars") or {}, cache))
        else:
            ov["src"] = str((base / ov["src"]).resolve())
        if isinstance(sfx, dict):
            sfx = {**sfx, "src": str((base / sfx["src"]).resolve())}
        ov["sfx"] = sfx if isinstance(sfx, dict) else None
        if "cut" in ov:
            ov["t"] = float(ov["cut"]) - float(ov.get("anchor", anchor))
        ov["t"] = max(0.0, float(ov.get("t", 0.0)))
        ov["dur"] = float(ov.get("dur") or duration(ov["src"]))
        done.append(ov)
    return done


def composite(video: str, overlays: list[dict], out: str, crf: int = 18) -> None:
    need("ffmpeg")
    w, h = (int(x) for x in subprocess.check_output(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
         "-of", "csv=p=0", video], text=True).strip().split(","))
    inputs, parts, last = ["-i", video], [], "[0:v]"
    for k, ov in enumerate(overlays):
        if ov["src"].lower().endswith(".webm"):
            inputs += ["-c:v", "libvpx-vp9"]  # the native decoder drops VP9 alpha
        inputs += ["-i", ov["src"]]
        t, d = ov["t"], ov["dur"]
        if "scale" in ov or "x" in ov or "y" in ov:
            fit = f"scale=iw*{float(ov.get('scale', 1.0)) * w / 1080:.5f}:-2"  # templates are authored at 1080 wide
            pos = f"{int(float(ov.get('x', 0)) * w / 1080)}:{int(float(ov.get('y', 0)) * w / 1080)}"
        else:
            fit, pos = f"scale={w}:{h}", "0:0"
        parts.append(f"[{k + 1}:v]trim=0:{d:.3f},{fit},format=yuva444p,setpts=PTS-STARTPTS+{t:.3f}/TB[o{k}]")
        parts.append(f"{last}[o{k}]overlay={pos}:eof_action=pass:enable='between(t,{t:.3f},{t + d:.3f})'[v{k}]")
        last = f"[v{k}]"
    if not overlays:
        shutil.copy(video, out)
        return
    parts.append(f"{last}format=yuv420p[vout]")
    cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(parts),
           "-map", "[vout]", "-map", "0:a?", "-c:v", "libx264", "-preset", "medium", "-crf", str(crf),
           "-c:a", "copy", "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True)
    print(f"wrote {out}")


def sfx_cues(overlays: list[dict]) -> list[dict]:
    """SFX attached to resolved overlays, as timeline sfx entries at absolute times."""
    cues = []
    for ov in overlays:
        s = ov.get("sfx")
        if s:
            cues.append({"t": round(ov["t"] + float(s.get("at", 0.0)), 3),
                         "src": s["src"], "gain": s.get("gain", 0.6)})
    return cues


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("overlays", help="JSON list of overlays (or a timeline.json with an 'overlays' key)")
    ap.add_argument("out")
    ap.add_argument("--base", help="directory overlay paths are relative to (default: the JSON's folder)")
    ap.add_argument("--crf", type=int, default=18)
    a = ap.parse_args()
    spec = load_json(a.overlays)
    spec = spec.get("overlays", []) if isinstance(spec, dict) else spec
    base = Path(a.base or Path(a.overlays).resolve().parent)
    ovs = resolve(spec, base, base / "edit" / "overlays")
    composite(a.video, ovs, a.out, a.crf)
    for c in sfx_cues(ovs):
        print(f"sfx cue: t={c['t']} {c['src']} gain={c['gain']}")


if __name__ == "__main__":
    main()
