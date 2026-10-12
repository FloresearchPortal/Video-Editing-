"""Test → fix → re-render loop. Renders the reel, runs the QA gate, turns every fixable issue into a
concrete change (timeline / caption style / mix / grade), re-runs only the stages that change
affects, and repeats until the reel passes or nothing more can be fixed automatically.

    python -m reelkit.refine timeline.json [--max-iter 3] [--skip-render]

Never edits your timeline: the working copy is <timeline>.refined.json next to it.
Outputs: edit/final_approved.mp4 (passed) or edit/final_review.mp4 (needs a human), plus
edit/qa/summary.md (every check, every change made, what's left).
"""
from __future__ import annotations

import argparse
import copy
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

from .common import ROOT, keyframes_at, load_json, save_json
from .qa import PLATFORM, clip_windows, run_qa, to_markdown

STAGES = ["assemble", "transcribe", "captions", "music", "deliver"]


def run_stage_from(tl_path: Path, stage: str) -> None:
    env = {**os.environ, "PYTHONPATH": os.pathsep.join(filter(None, [str(ROOT), os.environ.get("PYTHONPATH")]))}
    print(f"\n### render from: {stage}")
    subprocess.run([sys.executable, "-m", "reelkit.make_reel", str(tl_path), "--from", stage], check=True, env=env)


def deliver(final: Path, measured_lufs: float | None = None) -> None:
    """Platform master: H.264 High yuv420p, AAC 48 kHz, two-pass loudnorm to -14 LUFS / -1 dBTP."""
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(final), "-af",
                          f"loudnorm=I={PLATFORM['lufs']}:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    js = json.loads(err[err.rfind("{"):err.rfind("}") + 1])
    af = (f"loudnorm=I={PLATFORM['lufs']}:TP=-1.5:LRA=11:measured_I={js['input_i']}:measured_TP={js['input_tp']}:"
          f"measured_LRA={js['input_lra']}:measured_thresh={js['input_thresh']}:offset={js['target_offset']}:"
          "linear=true,aresample=48000")
    tmp = final.with_suffix(".deliver.mp4")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(final), "-c:v", "libx264", "-profile:v", "high",
                    "-pix_fmt", "yuv420p", "-crf", "17", "-preset", "medium", "-r", "30", "-af", af,
                    "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", "-shortest",
                    str(tmp)], check=True)
    tmp.replace(final)


# ── fixes: issue -> (earliest stage to re-run, description) ─────────────────
def apply_fix(issue: dict, tl: dict, base: Path, fps: float) -> tuple[str, str] | None:
    fx = issue.get("fix") or {}
    act = fx.get("action")
    cap = tl.setdefault("captions", {})
    if act == "full_res":
        return "assemble", "render at full 1080x1920"
    if act in ("reencode", "loudness"):
        return "deliver", "re-master: H.264/AAC 48k, two-pass loudnorm to -14 LUFS / -1 dBTP"
    if act == "music_volume" and tl.get("music"):
        old = float(tl["music"].get("volume", 0.22))
        tl["music"]["volume"] = round(min(max(old * fx["factor"], 0.02), 2.5), 3)
        return "music", f"music bed {old:.2f} → {tl['music']['volume']:.2f}"
    if act == "grade_extra":
        extra = tl.setdefault("grade_extra", [])
        name = fx["filter"].split("=")[0] + "=" + fx["filter"].split("=")[1].split(":")[0]  # e.g. "hue=s"
        prev = next((f for f in extra if f.startswith(name + "=")), None)
        if prev is None:
            extra.append(fx["filter"])
            return "assemble", f"grade trim: {fx['filter']}"
        # same correction again → it wasn't enough: escalate by the same step, within sane bounds
        old_v, step = float(prev.split("=")[-1]), float(fx["filter"].split("=")[-1])
        new_v = round(min(max(old_v * step, 0.6), 1.4), 3)
        if new_v == old_v:
            return None
        extra[extra.index(prev)] = f"{name}={new_v}"
        if name == "hue=s" and not any(f.startswith("colorbalance") for f in extra):
            extra.append("colorbalance=rm=-0.03:bm=0.02")   # pull warm midtones (skin) back toward neutral
        return "assemble", f"grade trim escalated: {name}={new_v}"
    if act == "reframe":
        c = tl["clips"][fx["clip"]]
        notes = []
        if "offset_x" in fx:
            c["offset_x"] = round(float(c.get("offset_x", 0)) - fx["offset_x"], 3)
            notes.append(f"offset_x={c['offset_x']}")
        if "head_y" in fx:
            c["head_y"] = fx["head_y"]
            notes.append(f"head_y={fx['head_y']}")
        if "zoom_scale" in fx:
            z = c.get("zoom", "none")
            if isinstance(z, (int, float)):
                c["zoom"] = round(max(1.0, z * fx["zoom_scale"]), 3)
            else:
                c["zoom_base"] = round(max(1.0, float(c.get("zoom_base", 1.0)) * fx["zoom_scale"]), 3)
            notes.append("wider framing")
        return "assemble", f"clip {fx['clip']} reframed ({', '.join(notes)})"
    if act == "soften_dip":
        i = fx["clip"]
        t = tl["clips"][i].get("transition") or {}
        if t.get("type") == "dip":
            tl["clips"][i]["transition"] = {"type": "zoom_blur", "dur": 0.3}
            return "assemble", f"clip {i}: dip-to-black → zoom-blur transition"
        return None
    if act == "cut_gaps":
        return cut_gaps(tl, fx["gaps"], fps)
    if act == "caption_margins":
        sz = cap.setdefault("safe_zone", {"top": 0.10, "bottom": 0.22, "left": 0.06, "right": 0.14})
        for k in sz:
            sz[k] = round(min(sz[k] + 0.02, 0.3), 3)
        return "captions", f"caption safe margins → {sz}"
    if act == "caption_positions":
        pos = cap.get("positions", ["head", "chest", "upper"])
        if fx["drop"] not in pos or len(pos) == 1:
            return None
        cap["positions"] = [p for p in pos if p != fx["drop"]]
        return "captions", f"caption placements → {cap['positions']} (keep type off the face)"
    if act == "caption_size":
        size = cap.setdefault("size", {"hero": 0.18, "bold": 0.095, "light": 0.07})
        for k in size:
            size[k] = round(min(size[k] * fx["factor"], 0.24), 4)
        return "captions", f"caption sizes ×{fx['factor']}"
    if act == "caption_phrasing":
        mp = round(float(cap.get("min_phrase", 0.0)) + 0.4, 2)
        if mp > 1.2:
            return None
        cap["min_phrase"] = mp
        return "captions", f"merge phrases shorter than {mp}s into their neighbour (readable on a phone)"
    if act == "replace_terms":
        rep = cap.setdefault("replace", {})
        new = {k: v for k, v in fx["replace"].items() if rep.get(k) != v}
        if not new:
            return None
        rep.update(new)
        return "captions", f"caption term fixes {new}"
    if act == "add_endcard":
        from .brand import endcard
        card = endcard(base / "edit" / "endcard.png")
        tl["clips"].append({"src": os.path.relpath(card, base), "dur": 2.5, "zoom": "pull",
                            "transition": {"type": "dip", "dur": 0.3}})
        return "assemble", "appended branded end card"
    if act == "rerun":
        return fx["stage"], f"re-run {fx['stage']}"
    return None


def cut_gaps(tl: dict, gaps: list[dict], fps: float) -> tuple[str, str] | None:
    """Split clips at silent gaps; the far side becomes a punch-in jump cut (pro talking-head style)."""
    done = 0
    for g in sorted(gaps, key=lambda g: -g["start"]):
        wins = clip_windows(tl, fps)
        w = next((w for w in wins if w["start"] <= (g["start"] + g["end"]) / 2 < w["end"]), None)
        if w is None or w["image"]:
            continue
        c = tl["clips"][w["index"]]
        cin, cout = float(c.get("in", 0)), float(c["out"])
        s0 = cin + (g["start"] - w["start"]) + 0.12      # keep the word's tail
        s1 = cin + (g["end"] - w["start"]) - 0.08        # keep the next word's onset
        if s1 - s0 < 0.25:
            continue
        lead = s0 - cin < 0.15                           # silence at the very start of the clip
        trail = cout - s1 < 0.15
        if lead:
            c["in"] = round(s1, 3)
        elif trail:
            c["out"] = round(s0, 3)
        else:
            dur = cout - cin
            z = c.get("zoom", "none")
            z_here = z if isinstance(z, (int, float)) else keyframes_at(
                z if isinstance(z, list) else [[0, float(c.get("zoom_base", 1.0))]], (s1 - cin))
            a = {**c, "out": round(s0, 3)}
            b = {**copy.deepcopy(c), "in": round(s1, 3), "transition": {"type": "cut"},
                 "zoom": round(min(float(z_here) * 1.12 if float(z_here) < 1.2 else float(z_here) / 1.12, 1.6), 3)}
            if isinstance(z, list):
                a["zoom"] = float(keyframes_at(z, 0))
            tl["clips"][w["index"]:w["index"] + 1] = [a, b]
        done += 1
    return ("assemble", f"removed {done} silent gap(s) (jump cuts with punch-ins)") if done else None


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("timeline")
    ap.add_argument("--max-iter", type=int, default=3)
    ap.add_argument("--skip-render", action="store_true", help="QA the existing render first")
    a = ap.parse_args()

    src = Path(a.timeline).resolve()
    base = src.parent
    work = src.with_name(src.stem + ".refined.json")
    tl = load_json(src)
    tl.setdefault("output", {})
    # the working copy renders into the same folders as the original
    save_json(work, tl)
    o = tl["output"]
    fps = float(o.get("fps", 30))
    final = base / o.get("final", "edit/final.mp4")
    qa_dir = base / "edit" / "qa"
    log, attempts, history = [], {}, []

    stage = None if (a.skip_render and final.exists()) else "assemble"
    for it in range(a.max_iter + 1):
        if stage == "deliver":
            deliver(final)
        elif stage:
            run_stage_from(work, stage)
            deliver(final)   # every render is mastered for the platforms
        rep = run_qa(work, final)
        save_json(qa_dir / f"iter{it}.json", rep)
        (qa_dir / f"iter{it}.md").write_text(to_markdown(rep), encoding="utf-8")
        history.append({"iter": it, "counts": rep.get("counts"), "passed": rep.get("passed")})
        print(f"\n=== QA iteration {it}: {rep.get('counts')} passed={rep.get('passed')}")
        if rep.get("passed") and not any(i["severity"] == "WARN" and i.get("fix") for i in rep["issues"]):
            break
        if it == a.max_iter:
            break
        tl = load_json(work)
        stages, changed = [], []
        for issue in rep["issues"]:
            if issue["severity"] == "INFO" or not issue.get("fix"):
                continue
            key = issue["id"] + json.dumps(issue["fix"].get("clip", ""))
            attempts[key] = attempts.get(key, 0) + 1
            if attempts[key] > 2:          # tried twice already — leave it for a human
                continue
            res = apply_fix(issue, tl, base, fps)
            if res:
                stages.append(res[0])
                changed.append(f"iter {it}: [{issue['id']}] {res[1]}")
        if not stages:
            break
        save_json(work, tl)
        log += changed
        for c in changed:
            print("  fix:", c)
        stage = min(stages, key=STAGES.index)

    passed = bool(rep.get("passed"))
    out = base / "edit" / ("final_approved.mp4" if passed else "final_review.mp4")
    shutil.copy(final, out)
    left = [i for i in rep["issues"] if i["severity"] in ("FAIL", "WARN")]
    md = [f"# Refine summary — {'APPROVED' if passed else 'NEEDS REVIEW'}", "",
          f"Deliverable: `{out.relative_to(base)}`  ·  working timeline: `{work.name}`", "",
          "## Iterations", *[f"- iter {h['iter']}: {h['counts']}" for h in history], "",
          "## Changes made automatically", *([f"- {c}" for c in log] or ["- none needed"]), "",
          "## Still open", *([f"- {i['severity']} **{i['id']}**: {i['message']}" for i in left] or ["- nothing"]), "",
          "Full measurements: `edit/qa/iter*.json`"]
    (qa_dir / "summary.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    print("\n".join(md))


if __name__ == "__main__":
    main()
