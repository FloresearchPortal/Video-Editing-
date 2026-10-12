"""Assemble a timeline into a picture-locked edit: cuts, subject-tracked reframe, zooms,
transitions, colour grade, outro cards. Voice audio follows the cuts frame-exactly.

    python -m reelkit.assemble timeline.json            # -> output.stage1 (default edit/stage1.mp4)

See .claude/skills/reel-editor/SKILL.md for the timeline schema.
"""
from __future__ import annotations

import argparse
import math
import subprocess
import tempfile
from pathlib import Path

import cv2
import numpy as np

from .common import (FrameReader, FrameWriter, Subject, ease_in_out, has_audio, is_image,
                     keyframes_at, lerp_series, load_json, mux, need, smooth)

GRADES = {
    # teal shadows / warm highlights, gentle S-curve, a touch of saturation, soft vignette
    "teal_orange": "colorbalance=rs=-0.06:gs=0.01:bs=0.09:rm=0.02:gm=0.0:bm=-0.02:rh=0.07:gh=0.02:bh=-0.07,"
                   "curves=all='0/0 0.25/0.21 0.5/0.5 0.75/0.79 1/1',eq=saturation=1.12,vignette=angle=PI/5",
    "clean": "eq=contrast=1.04:saturation=1.06",
    "moody": "colorbalance=rs=-0.04:bs=0.06:rh=0.04:bh=-0.03,curves=all='0/0.03 0.3/0.24 0.7/0.74 1/0.97',"
             "eq=saturation=0.92,vignette=angle=PI/4",
    "none": None,
}

def resolve_grade(spec: str | None, base: Path) -> str | None:
    """Preset name, "lut:path.cube[+vignette]" (e.g. a reelkit.grade_match LUT), or a raw -vf chain."""
    if not spec or spec == "none":
        return None
    if spec.startswith("lut:"):
        path, *extras = spec[4:].split("+")
        lut = (base / path).resolve()
        if not lut.exists():
            raise SystemExit(f"grade LUT not found: {lut} (bake one with python -m reelkit.grade_match lut …)")
        chain = [f"lut3d=file='{lut}':interp=tetrahedral"]
        if "vignette" in extras:
            chain.append("vignette=angle=PI/5")
        return ",".join(chain)
    return GRADES.get(spec, spec)


def zoom_kfs(clip: dict, dur: float) -> list:
    z = clip.get("zoom", "none")
    if isinstance(z, (int, float)):
        return [[0, float(z)]]
    if isinstance(z, list):
        return z
    base = float(clip.get("zoom_base", 1.0))
    if z == "push":
        return [[0, base], [dur, base * 1.12, "linear"]]
    if z == "pull":
        return [[0, base * 1.12], [dur, base, "linear"]]
    if z == "punch":
        return [[0, base], [dur / 2, base * 1.3, "step"]]
    return [[0, base]]


# ── subject tracking ──────────────────────────────────────────────────────
def track_clip(src, start, dur, fps, subject: Subject, every: int = 3) -> list[dict]:
    """Sample the subject every `every` frames -> smoothed [(t, hx, hy, head)]."""
    rd = FrameReader(src, start, dur, fps)
    n = max(1, round(dur * fps))
    raw = []
    for i in range(n):
        f = rd.read()
        if i % every == 0 or i == n - 1:
            loc = subject.locate(f)
            if loc:
                raw.append((i / fps, loc["hx"], loc["hy"], loc["head"]))
    rd.close()
    if not raw:
        return []
    ts = [r[0] for r in raw]
    out = []
    for k, s in ((1, 6), (2, 10), (3, 8)):  # x follows a bit faster than y; head size slowest
        out.append(smooth([r[k] for r in raw], s * 3 / every))
    return [{"t": t, "hx": x, "hy": y, "head": h} for t, x, y, h in zip(ts, *out)]


def crop_window(fw, fh, ow, oh, zoom, track, t, clip):
    """Return (x0, y0, cw, ch) source crop for the output aspect, zoom and tracked subject."""
    aspect = ow / oh
    ch0 = fh if fw / fh >= aspect else fw / aspect
    cw0 = ch0 * aspect
    cw, ch = cw0 / zoom, ch0 / zoom
    cx, cy = fw / 2, fh / 2
    if track:
        samples_x = [(s["t"], s["hx"]) for s in track]
        samples_y = [(s["t"], s["hy"]) for s in track]
        hx, hy = lerp_series(samples_x, t), lerp_series(samples_y, t)
        cx = hx + float(clip.get("offset_x", 0)) * cw
        # Put the head at ~1/3 from the top of the frame (rule of thirds, room for captions above)
        head_frac = float(clip.get("head_y", 0.36))
        cy = hy + (0.5 - head_frac) * ch
    x0 = min(max(cx - cw / 2, 0), fw - cw)
    y0 = min(max(cy - ch / 2, 0), fh - ch)
    return x0, y0, cw, ch


def render_crop(frame, win, ow, oh):
    x0, y0, cw, ch = win
    # sub-pixel accurate crop+scale via affine warp (no jitter on slow pushes)
    sx, sy = ow / cw, oh / ch
    m = np.float32([[sx, 0, -x0 * sx], [0, sy, -y0 * sy]])
    return cv2.warpAffine(frame, m, (ow, oh), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)


# ── transitions (applied across a cut, no overlap — audio stays a straight concat) ──
def zoom_blur(img, amount: float):
    """Radial zoom blur, amount 0..1."""
    if amount <= 0.01:
        return img
    h, w = img.shape[:2]
    acc = img.astype(np.float32)
    steps = 8
    for i in range(1, steps + 1):
        s = 1 + amount * 0.18 * i / steps
        m = cv2.getRotationMatrix2D((w / 2, h / 2), 0, s)
        acc += cv2.warpAffine(img, m, (w, h), borderMode=cv2.BORDER_REFLECT).astype(np.float32)
    return (acc / (steps + 1)).astype(np.uint8)


def motion_blur_x(img, amount: float, shift: float):
    if amount <= 0.01 and abs(shift) < 1:
        return img
    h, w = img.shape[:2]
    k = max(1, int(amount * 0.12 * w)) | 1
    kernel = np.zeros((1, k), np.float32)
    kernel[0, :] = 1.0 / k
    out = cv2.filter2D(img, -1, kernel)
    m = np.float32([[1, 0, shift], [0, 1, 0]])
    return cv2.warpAffine(out, m, (w, h), borderMode=cv2.BORDER_REFLECT)


def light_leak(img, amount: float, phase: float):
    if amount <= 0.01:
        return img
    h, w = img.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx, cy = w * (0.2 + 0.6 * phase), h * 0.25
    r = np.exp(-(((xx - cx) / (0.7 * w)) ** 2 + ((yy - cy) / (0.6 * h)) ** 2))
    glow = np.dstack([r * 170, r * 215, r * 255]) * amount  # warm (BGR)
    out = img.astype(np.float32) * (1 - 0.35 * amount) + glow + 40 * amount
    return np.clip(out, 0, 255).astype(np.uint8)


def apply_transition(img, kind: str, side: str, p: float, ow: int):
    """p: 0 at the far edge of the transition window -> 1 at the cut."""
    p = ease_in_out(p)
    if kind == "zoom_blur":
        img = zoom_blur(img, p)
        s = 1 + (0.25 * p if side == "out" else 0.25 * p)
        m = cv2.getRotationMatrix2D((img.shape[1] / 2, img.shape[0] / 2), 0, s)
        return cv2.warpAffine(img, m, (img.shape[1], img.shape[0]), borderMode=cv2.BORDER_REFLECT)
    if kind == "whip":
        d = -1 if side == "out" else 1
        return motion_blur_x(img, p, d * -0.35 * ow * p)
    if kind == "flash":
        return light_leak(img, p, 0.3 if side == "out" else 0.7)
    if kind == "dip":
        return (img.astype(np.float32) * (1 - p)).astype(np.uint8)
    return img


def image_frame(src, ow, oh, t, dur, clip):
    img = cv2.imread(str(src), cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    s = max(ow / w, oh / h)
    img = cv2.resize(img, (math.ceil(w * s), math.ceil(h * s)), interpolation=cv2.INTER_AREA)
    zoom = keyframes_at(zoom_kfs(clip, dur), t)
    win = crop_window(img.shape[1], img.shape[0], ow, oh, zoom, None, t, clip)
    return render_crop(img, win, ow, oh)


# ── audio ─────────────────────────────────────────────────────────────────
def clip_audio(clip, start, nframes, fps, dst):
    dur = nframes / fps
    src = clip["src"]
    if is_image(src) or not has_audio(src) or clip.get("mute"):
        cmd = ["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
               "-t", f"{dur:.6f}", "-c:a", "pcm_s16le", str(dst)]
    else:
        fade = min(0.012, dur / 4)
        cmd = ["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.3f}", "-i", str(src), "-t", f"{dur:.6f}",
               "-vn", "-ac", "2", "-ar", "48000",
               "-af", f"apad,atrim=0:{dur:.6f},afade=t=in:d={fade},afade=t=out:st={dur - fade:.6f}:d={fade},"
                      f"volume={clip.get('volume', 1.0)}",
               "-c:a", "pcm_s16le", str(dst)]
    subprocess.run(cmd, check=True)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("timeline")
    ap.add_argument("--preview", action="store_true", help="half resolution, fast encode")
    a = ap.parse_args()
    need("ffmpeg")

    tl = load_json(a.timeline)
    base = Path(a.timeline).resolve().parent
    o = tl.get("output", {})
    ow, oh, fps = int(o.get("width", 1080)), int(o.get("height", 1920)), float(o.get("fps", 30))
    if a.preview:
        ow, oh = ow // 2 // 2 * 2, oh // 2 // 2 * 2
    out = base / o.get("stage1", "edit/stage1.mp4")
    grade = resolve_grade(tl.get("grade", "teal_orange"), base)
    if tl.get("grade_extra"):  # corrections appended by the QA gate (exposure / saturation trims)
        grade = ",".join(filter(None, [grade, *tl["grade_extra"]]))

    clips = tl["clips"]
    for c in clips:
        c["src"] = str((base / c["src"]).resolve())
    subject = Subject() if any(c.get("track", True) and not is_image(c["src"]) for c in clips) else None

    tmp = Path(tempfile.mkdtemp(prefix="reelkit_"))
    silent = tmp / "video.mp4"
    wr = FrameWriter(silent, ow, oh, fps, vf=grade, crf=23 if a.preview else 17)
    wavs = []
    for ci, c in enumerate(clips):
        if is_image(c["src"]):
            start, dur = 0.0, float(c.get("dur", 2.5))
        else:
            start = float(c.get("in", 0))
            dur = float(c["out"]) - start
        n = max(1, round(dur * fps))
        t_in = (c.get("transition") or {})
        nxt = (clips[ci + 1].get("transition") or {}) if ci + 1 < len(clips) else {}
        in_kind, in_d = t_in.get("type", "cut"), float(t_in.get("dur", 0.3))
        out_kind, out_d = nxt.get("type", "cut"), float(nxt.get("dur", 0.3))
        print(f"[{ci + 1}/{len(clips)}] {Path(c['src']).name} {start:.2f}+{dur:.2f}s "
              f"zoom={c.get('zoom', 'none')} in={in_kind}")

        track = None
        if not is_image(c["src"]) and c.get("track", True) and subject:
            track = track_clip(c["src"], start, dur, fps, subject)
        kfs = zoom_kfs(c, dur)
        rd = None if is_image(c["src"]) else FrameReader(c["src"], start, dur, fps)
        for i in range(n):
            t = i / fps
            if rd:
                f = rd.read()
                zoom = keyframes_at(kfs, t)
                img = render_crop(f, crop_window(rd.w, rd.h, ow, oh, zoom, track, t, c), ow, oh)
            else:
                img = image_frame(c["src"], ow, oh, t, dur, c)
            half_in, half_out = in_d / 2, out_d / 2
            if ci > 0 and in_kind != "cut" and t < half_in:
                img = apply_transition(img, in_kind, "in", 1 - t / half_in, ow)
            if out_kind != "cut" and t > dur - half_out:
                img = apply_transition(img, out_kind, "out", (t - (dur - half_out)) / half_out, ow)
            wr.write(img)
        if rd:
            rd.close()
        wav = tmp / f"a{ci:03}.wav"
        clip_audio(c, start, n, fps, wav)
        wavs.append(wav)
    wr.close()
    if subject:
        subject.close()

    lst = tmp / "list.txt"
    lst.write_text("".join(f"file '{w}'\n" for w in wavs))
    voice = tmp / "voice.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-c", "copy", str(voice)], check=True)
    out.parent.mkdir(parents=True, exist_ok=True)
    mux(silent, voice, out)
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
