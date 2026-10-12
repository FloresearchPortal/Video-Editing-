"""Quality gate: test a reel render against measurable delivery, audio, picture, caption and
brand rules. Every issue says which stage caused it and (when possible) how to fix it, so
reelkit.refine can apply the fix and re-render.

    python -m reelkit.qa timeline.json [--final edit/final.mp4] [-o edit/qa/report.json]

Severity: FAIL blocks delivery, WARN is reported, INFO is a note.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
from dataclasses import asdict, dataclass, field
from pathlib import Path

import cv2
import numpy as np

from .common import FrameReader, Subject, is_image, load_json, probe, save_json

PLATFORM = {"width": 1080, "height": 1920, "fps": 30, "max_seconds": 90, "lufs": -14.0, "lufs_tol": 1.0,
            "true_peak": -1.0}


@dataclass
class Issue:
    id: str
    severity: str            # FAIL | WARN | INFO
    stage: str               # assemble | transcribe | captions | music | deliver | brand
    message: str
    metric: dict = field(default_factory=dict)
    fix: dict | None = None  # machine-actionable hint for reelkit.refine


# ── helpers ───────────────────────────────────────────────────────────────
def ffmpeg_stderr(args: list[str]) -> str:
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True).stderr


def clip_windows(tl: dict, fps: float) -> list[dict]:
    """Final-timeline [start, end) of each clip (frame-exact, as assemble lays them out)."""
    t, out = 0.0, []
    for i, c in enumerate(tl["clips"]):
        dur = float(c.get("dur", 2.5)) if is_image(c["src"]) else float(c["out"]) - float(c.get("in", 0))
        n = max(1, round(dur * fps))
        out.append({"index": i, "start": t, "end": t + n / fps, "image": is_image(c["src"]),
                    "transition": (c.get("transition") or {}).get("type", "cut")})
        t += n / fps
    return out


def clip_at(windows, t):
    for w in windows:
        if w["start"] <= t < w["end"]:
            return w
    return windows[-1] if windows else None


def load_words(p: Path) -> list[dict]:
    if not p.exists():
        return []
    d = load_json(p)
    return [w for w in d.get("words", []) if w.get("type", "word") == "word"]


# ── checks ────────────────────────────────────────────────────────────────
def check_format(final: Path, issues: list[Issue]) -> dict:
    pr = probe(final)
    v = next((s for s in pr["streams"] if s["codec_type"] == "video"), None)
    a = next((s for s in pr["streams"] if s["codec_type"] == "audio"), None)
    dur = float(pr["format"]["duration"])
    num, den = (v.get("r_frame_rate", "0/1") if v else "0/1").split("/")
    fps = float(num) / float(den or 1)
    info = {"width": v and v["width"], "height": v and v["height"], "fps": round(fps, 3), "duration": round(dur, 2),
            "vcodec": v and v["codec_name"], "pix_fmt": v and v.get("pix_fmt"), "acodec": a and a["codec_name"],
            "sample_rate": a and a.get("sample_rate")}
    if not v or (v["width"], v["height"]) != (PLATFORM["width"], PLATFORM["height"]):
        issues.append(Issue("format.size", "FAIL", "assemble", f"frame is {info['width']}x{info['height']}, "
                            "Reels/TikTok/Shorts need 1080x1920 (render without --preview)", info,
                            {"action": "full_res"}))
    if abs(fps - PLATFORM["fps"]) > 0.05:
        issues.append(Issue("format.fps", "WARN", "assemble", f"{fps:g} fps (expected 30)", info))
    if info["vcodec"] != "h264" or info["pix_fmt"] != "yuv420p":
        issues.append(Issue("format.codec", "FAIL", "deliver", "video must be H.264 yuv420p for all platforms", info,
                            {"action": "reencode"}))
    if not a:
        issues.append(Issue("format.audio", "FAIL", "music", "no audio track", info))
    elif info["acodec"] != "aac" or str(info["sample_rate"]) != "48000":
        issues.append(Issue("format.audio_codec", "WARN", "deliver", "audio should be AAC 48 kHz", info,
                            {"action": "reencode"}))
    if dur > PLATFORM["max_seconds"]:
        issues.append(Issue("format.length", "WARN", "assemble", f"{dur:.1f}s is long for a reel (≤ 60–90 s)", info))
    a_dur = float(a.get("duration", dur)) if a else dur
    v_dur = float(v.get("duration", dur)) if v else dur
    if abs(a_dur - v_dur) > 0.12:
        issues.append(Issue("format.av_length", "WARN", "deliver", f"audio {a_dur:.2f}s vs video {v_dur:.2f}s",
                            info, {"action": "reencode"}))
    return info


def check_loudness(final: Path, issues: list[Issue], tl: dict) -> dict:
    err = ffmpeg_stderr(["-i", str(final), "-af", "ebur128=peak=true", "-f", "null", "-"])
    tail = err[err.rfind("Summary:"):]
    I = float(re.search(r"I:\s+(-?[\d.]+) LUFS", tail).group(1))
    tp = re.search(r"Peak:\s+(-?[\d.]+) dBFS", tail)
    tp = float(tp.group(1)) if tp else 0.0
    m = {"integrated_lufs": I, "true_peak_dbfs": tp}
    if abs(I - PLATFORM["lufs"]) > PLATFORM["lufs_tol"]:
        issues.append(Issue("audio.loudness", "FAIL", "music",
                            f"loudness {I:.1f} LUFS, target {PLATFORM['lufs']:.0f} ±{PLATFORM['lufs_tol']:.0f}", m,
                            {"action": "loudness", "measured": I}))
    if tp > PLATFORM["true_peak"] + 0.3:
        issues.append(Issue("audio.true_peak", "FAIL", "music", f"true peak {tp:.1f} dBFS (max -1.0)", m,
                            {"action": "loudness", "measured": I}))
    return m


def audio_mono(path: Path, sr: int = 16000) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1", "-ar", str(sr),
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def check_mix(final: Path, words: list[dict], windows, issues: list[Issue], tl: dict) -> dict:
    """Voice vs music balance (speech vs pause level) and dead air."""
    sr = 16000
    x = audio_mono(final, sr)
    dur = len(x) / sr
    end_speech = max((w["end"] for w in words), default=0)
    speech = np.zeros(len(x), bool)
    for w in words:
        speech[int(w["start"] * sr):int(w["end"] * sr)] = True
    db = lambda seg: 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-9)
    m = {}
    if speech.any():
        m["speech_db"] = round(db(x[speech]), 1)
    # pauses: gaps ≥ 0.35 s between words (not lead-in, not tail/end card)
    gaps = [(a["end"], b["start"]) for a, b in zip(words, words[1:]) if b["start"] - a["end"] >= 0.35]
    if gaps and tl.get("music", {}).get("src") and "speech_db" in m:
        pause = np.concatenate([x[int((g0 + 0.08) * sr):int((g1 - 0.08) * sr)] for g0, g1 in gaps])
        if len(pause) > sr * 0.3:
            m["pause_db"] = round(db(pause), 1)
            gap_db = m["speech_db"] - m["pause_db"]
            m["voice_over_music_db"] = round(gap_db, 1)
            if gap_db < 12:
                issues.append(Issue("audio.music_too_loud", "FAIL", "music",
                                    f"music only {gap_db:.1f} dB under the voice (want 12–24 dB) — speech will "
                                    "be hard to follow on phone speakers", m, {"action": "music_volume", "factor": 0.7}))
            elif gap_db > 30:
                issues.append(Issue("audio.music_inaudible", "WARN", "music",
                                    f"music {gap_db:.1f} dB under the voice — barely audible", m,
                                    {"action": "music_volume", "factor": 1.3}))
    # dead air inside clips (not across intentional cuts, not on image/end cards)
    dead = []
    seq = [{"start": 0.0, "end": 0.0}] + words
    for a, b in zip(seq, seq[1:]):
        g0, g1 = a["end"], b["start"]
        w = clip_at(windows, (g0 + g1) / 2)
        if g1 - g0 > (0.45 if a is seq[0] else 0.7) and w and not w["image"]:
            dead.append({"start": round(g0, 2), "end": round(g1, 2), "clip": w["index"]})
    if dead:
        issues.append(Issue("audio.dead_air", "FAIL", "assemble",
                            f"{len(dead)} silent gap(s) in speech: " +
                            ", ".join(f"{d['start']:.1f}-{d['end']:.1f}s" for d in dead[:6]), {"gaps": dead},
                            {"action": "cut_gaps", "gaps": dead}))
    # clicks at cuts: sample jumps at clip boundaries
    clicks = []
    for w in windows[1:]:
        i = int(w["start"] * sr)
        if 2 < i < len(x) - 2 and abs(float(x[i]) - float(x[i - 1])) > 0.25:
            clicks.append(round(w["start"], 2))
    if clicks:
        issues.append(Issue("audio.clicks", "WARN", "assemble", f"possible clicks at cuts {clicks}", {"at": clicks}))
    m["duration"] = round(dur, 2)
    return m


def check_picture(final: Path, windows, issues: list[Issue], tl: dict) -> dict:
    err = ffmpeg_stderr(["-i", str(final), "-vf", "blackdetect=d=0.12:pic_th=0.97,freezedetect=n=0.002:d=0.8",
                         "-an", "-f", "null", "-"])
    blacks = [(float(a), float(b)) for a, b in re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", err)]
    freezes = [float(t) for t in re.findall(r"freeze_start: ([\d.]+)", err)]
    m = {"black": blacks, "freeze_starts": freezes}
    for b0, b1 in blacks:
        cut = min(windows, key=lambda w: abs(w["start"] - (b0 + b1) / 2))
        intentional = cut["transition"] == "dip" and b1 - b0 < 0.25
        if not intentional:
            issues.append(Issue("picture.black", "FAIL", "assemble", f"black frames {b0:.2f}–{b1:.2f}s",
                                {"start": b0, "end": b1}, {"action": "soften_dip", "clip": cut["index"]}))
    for f0 in freezes:
        w = clip_at(windows, f0 + 0.1)
        if w and not w["image"]:
            issues.append(Issue("picture.freeze", "WARN", "assemble", f"frozen picture from {f0:.2f}s "
                                f"(clip {w['index']}: source ends early or out-point past the footage?)",
                                {"start": f0, "clip": w["index"]}))
    return m


def check_framing_and_skin(video: Path, windows, issues: list[Issue], tl: dict, every: float = 0.5) -> dict:
    """Subject placement per clip + skin exposure/colour on the faces."""
    pr = probe(video)
    dur = float(pr["format"]["duration"])
    rd = FrameReader(video, 0, dur, 1 / every, max_h=960)
    subj = Subject()
    per_clip: dict[int, list] = {}
    skin = []
    clipped = []
    n = int(dur / every)
    for k in range(n):
        f = rd.read()
        t = k * every
        w = clip_at(windows, t + 1e-3)
        if not w or w["image"]:
            continue
        h, wd = f.shape[:2]
        lab = cv2.cvtColor(f.astype(np.float32) / 255, cv2.COLOR_BGR2LAB)
        clipped.append(float((lab[..., 0] > 99).mean()))
        loc = subj.locate(f)
        fb = subj.face_box(f)
        per_clip.setdefault(w["index"], []).append(
            None if loc is None else (loc["hx"] / wd, loc["hy"] / h, loc["top"] / h))
        if fb:
            cx, cy, bw, bh = fb
            x0, x1 = int(cx - bw * 0.25), int(cx + bw * 0.25)
            y0, y1 = int(cy - bh * 0.15), int(cy + bh * 0.2)
            reg = lab[max(y0, 0):y1, max(x0, 0):x1].reshape(-1, 3)
            if len(reg) > 50:
                skin.append({"t": round(t, 2), "clip": w["index"], "L": float(np.percentile(reg[:, 0], 75)),
                             "a": float(np.median(reg[:, 1])), "b": float(np.median(reg[:, 2]))})
    rd.close()
    subj.close()

    framing = {}
    for ci, locs in per_clip.items():
        seen = [l for l in locs if l]
        if len(seen) < max(1, len(locs) // 2):
            issues.append(Issue("framing.no_subject", "WARN", "assemble",
                                f"clip {ci}: speaker not found in most frames (b-roll? check framing)",
                                {"clip": ci}))
            continue
        hx = float(np.median([l[0] for l in seen]))
        hy = float(np.median([l[1] for l in seen]))
        top = float(np.min([l[2] for l in seen]))
        framing[ci] = {"head_x": round(hx, 3), "head_y": round(hy, 3), "top": round(top, 3)}
        if not 0.3 <= hx <= 0.7:
            issues.append(Issue("framing.off_center", "FAIL", "assemble",
                                f"clip {ci}: speaker at x={hx:.2f} of frame (want 0.3–0.7)", framing[ci],
                                {"action": "reframe", "clip": ci, "offset_x": round(0.5 - hx, 3)}))
        if hy < 0.14 or hy > 0.6:
            issues.append(Issue("framing.head_height", "FAIL" if hy < 0.1 else "WARN", "assemble",
                                f"clip {ci}: head at y={hy:.2f} (want 0.18–0.5; headroom/captions space)",
                                framing[ci], {"action": "reframe", "clip": ci, "head_y": 0.34, "zoom_scale": 0.9}))
    m = {"framing": framing}
    if skin:
        L = np.array([s["L"] for s in skin])
        a = np.array([s["a"] for s in skin])
        b = np.array([s["b"] for s in skin])
        hue = np.degrees(np.arctan2(b, a))
        chroma = np.hypot(a, b)
        m["skin"] = {"L_p75_median": round(float(np.median(L)), 1), "hue_median": round(float(np.median(hue)), 1),
                     "chroma_median": round(float(np.median(chroma)), 1), "samples": len(skin)}
        hot = [s for s in skin if s["L"] > 80]
        if len(hot) > 0.25 * len(skin):
            issues.append(Issue("grade.skin_overexposed", "FAIL", "assemble",
                                f"faces too bright (lit side L≈{np.median(L):.0f}, natural 65–76)", m["skin"],
                                {"action": "grade_extra", "filter": "eq=gamma=0.93"}))
        elif np.median(L) < 48:
            issues.append(Issue("grade.skin_dark", "WARN", "assemble",
                                f"faces dark (L≈{np.median(L):.0f})", m["skin"],
                                {"action": "grade_extra", "filter": "eq=gamma=1.06"}))
        med_h, med_c = float(np.median(hue)), float(np.median(chroma))
        if med_c > 30 or (med_h > 62 and med_c > 22):
            issues.append(Issue("grade.skin_orange", "FAIL", "assemble",
                                f"skin too orange/saturated (hue {med_h:.0f}°, chroma {med_c:.0f})", m["skin"],
                                {"action": "grade_extra", "filter": "hue=s=0.88"}))
        elif med_h < 15:
            issues.append(Issue("grade.skin_pink", "WARN", "assemble",
                                f"skin reads pink/magenta (hue {med_h:.0f}°) — re-bake the LUT "
                                "(/davinci-resolve-grade)", m["skin"]))
    if clipped and float(np.mean(clipped)) > 0.03:
        issues.append(Issue("grade.clipping", "WARN", "assemble",
                            f"{100 * np.mean(clipped):.1f}% of the picture is clipped white", {}))
    return m


def check_captions(layout_p: Path, words: list[dict], video: Path, issues: list[Issue], tl: dict) -> dict:
    if not layout_p.exists():
        if tl.get("captions", {}).get("enabled", True):
            issues.append(Issue("captions.missing", "FAIL", "captions", "no caption layout found — captions stage "
                                "didn't run", {}, {"action": "rerun", "stage": "captions"}))
        return {}
    lay = load_json(layout_p)
    ow, oh = lay["size"]
    sz = lay["safe_zone"]
    outside, tiny, short, face_hits = [], [], [], []
    subj = Subject()
    vdur = float(probe(video)["format"]["duration"])
    for p in lay["phrases"]:
        ws = p["words"]
        if p["end"] - p["start"] < 0.6:          # whole phrase barely on screen
            short.append(round(p["start"], 2))
        for w in ws:
            x, y, bw, bh = w["box"]
            pad = 0.18 * bh  # sprites include shadow padding
            if (x + pad < ow * sz["left"] - 4 or x + bw - pad > ow * (1 - sz["right"]) + 4
                    or y + pad < oh * sz["top"] - 4 or y + bh - pad > oh * (1 - sz["bottom"]) + 4):
                outside.append(w["text"])
            if w["role"] != "light" and bh < oh * 0.035:
                tiny.append(w["text"])
        # front text over the face, sampled at the middle of the phrase
        tmid = min((p["start"] + p["end"]) / 2, vdur - 0.2)  # last phrase may outlast the picture
        rd = FrameReader(video, tmid, 0.1, 30)
        f = rd.read()
        rd.close()
        fb = subj.face_box(f)
        if fb:
            cx, cy, fw, fh = fb
            fx0, fy0, fx1, fy1 = cx - fw / 2, cy - fh / 2, cx + fw / 2, cy + fh / 2
            cover = 0.0
            for w in ws:
                if w["behind"]:
                    continue
                x, y, bw, bh = w["box"]
                ix = max(0, min(fx1, x + bw * 0.85) - max(fx0, x + bw * 0.15))
                iy = max(0, min(fy1, y + bh * 0.8) - max(fy0, y + bh * 0.2))
                cover += ix * iy
            if cover / (fw * fh) > 0.12:
                face_hits.append(round(p["start"], 2))
    subj.close()
    m = {"phrases": len(lay["phrases"]), "outside_safe": outside, "tiny": tiny, "short_phrases": short,
         "over_face": face_hits}
    if outside:
        issues.append(Issue("captions.safe_zone", "FAIL", "captions",
                            f"{len(outside)} word(s) under the app UI / off the safe area: {outside[:5]}", m,
                            {"action": "caption_margins"}))
    if face_hits:
        issues.append(Issue("captions.over_face", "FAIL", "captions",
                            f"captions cover the face at {face_hits[:6]} s", m,
                            {"action": "caption_positions", "drop": "head"}))
    if tiny:
        issues.append(Issue("captions.too_small", "WARN", "captions", f"small words on a phone: {tiny[:5]}", m,
                            {"action": "caption_size", "factor": 1.1}))
    if len(short) > max(1, 0.15 * len(lay["phrases"])):
        issues.append(Issue("captions.flashing", "WARN", "captions",
                            f"{len(short)} phrases are on screen < 0.6 s (too fast to read): {short[:6]}", m,
                            {"action": "caption_phrasing"}))
    # nothing over end cards / title cards
    cards = [w for w in clip_windows(tl, lay.get("fps", 30)) if w["image"]]
    over = [round(p["start"], 2) for p in lay["phrases"] for w in cards if p["start"] < w["start"] + 0.05 < p["end"]
            or w["start"] <= p["start"] < w["end"]]
    if over:
        issues.append(Issue("captions.over_card", "FAIL", "captions", f"captions run over the end/title card at {over}",
                            m, {"action": "rerun", "stage": "captions"}))
    # hook: something on screen in the first second
    if lay["phrases"] and lay["phrases"][0]["start"] > 1.0:
        issues.append(Issue("captions.late_hook", "WARN", "assemble",
                            f"first caption at {lay['phrases'][0]['start']:.1f}s — hooks land in the first second", m))
    # low-confidence words (possible mis-hearing) → human review list
    low = [w["text"] for w in words if w.get("logprob", 1) < 0.45]
    if low:
        issues.append(Issue("captions.low_confidence", "INFO", "transcribe",
                            f"check spelling of: {sorted(set(low))[:12]}", {"words": low}))
    return m


def check_brand(tl: dict, layout_p: Path, words: list[dict], issues: list[Issue], base: Path) -> dict:
    if not tl.get("brand"):
        return {}
    from .brand import load_brand
    b = load_brand()
    m = {}
    last = tl["clips"][-1]["src"]
    if "endcard" not in Path(last).name:
        issues.append(Issue("brand.endcard", "FAIL", "brand", "no branded end card (logo + CTA + disclaimer) at the "
                            "end", {}, {"action": "add_endcard"}))
    if layout_p.exists() and not load_json(layout_p).get("watermark"):
        issues.append(Issue("brand.watermark", "WARN", "captions", "no logo watermark", {},
                            {"action": "rerun", "stage": "captions"}))
    # brand names heard wrong
    text = " ".join(w["text"] for w in words).lower()
    misheard = {}
    for bad, good in {"flow stocks": "FloStocks", "flo stocks": "FloStocks", "flowstocks": "FloStocks",
                      "flow stock": "FloStocks", "floret capital": "Floret Capitals",
                      "florett capitals": "Floret Capitals", "p.s.x": "PSX", "psx": "PSX",
                      "pakistan stock exchange": "Pakistan Stock Exchange"}.items():
        if re.search(rf"\b{re.escape(bad)}\b", text):
            misheard[bad] = good
    if misheard:
        issues.append(Issue("brand.terms", "FAIL", "captions",
                            "brand/market terms in the captions need fixing: " +
                            ", ".join(f"'{k}'→'{v}'" for k, v in misheard.items()), {"replace": misheard},
                            {"action": "replace_terms", "replace": misheard}))
    # finance compliance: never promise returns
    risky = [p for p in ("guaranteed return", "guaranteed profit", "risk free", "risk-free", "double your money",
                         "sure shot") if p in text]
    if risky:
        issues.append(Issue("brand.compliance", "FAIL", "transcribe",
                            f"regulated-finance red flags in the script: {risky} — needs a human edit", {}))
    return m


# ── main ──────────────────────────────────────────────────────────────────
def run_qa(tl_path: Path, final: Path | None = None) -> dict:
    tl = load_json(tl_path)
    base = tl_path.parent
    o = tl.get("output", {})
    final = final or base / o.get("final", "edit/final.mp4")
    stage1 = base / o.get("stage1", "edit/stage1.mp4")
    words_p = base / o.get("words", "edit/stage1.words.json")
    captioned = base / o.get("captioned", "edit/stage2_captions.mp4")
    layout_p = captioned.with_suffix(".layout.json")
    fps = float(o.get("fps", 30))
    for c in tl["clips"]:
        c["src"] = str((base / c["src"]).resolve())
    windows = clip_windows(tl, fps)
    words = load_words(words_p)
    issues: list[Issue] = []
    metrics = {}
    if not final.exists():
        issues.append(Issue("deliver.missing", "FAIL", "assemble", f"{final} not rendered", {},
                            {"action": "rerun", "stage": "assemble"}))
        return {"final": str(final), "issues": [asdict(i) for i in issues], "metrics": metrics}
    metrics["format"] = check_format(final, issues)
    metrics["loudness"] = check_loudness(final, issues, tl)
    metrics["mix"] = check_mix(final, words, windows, issues, tl)
    metrics["picture"] = check_picture(final, windows, issues, tl)
    metrics["framing_skin"] = check_framing_and_skin(stage1 if stage1.exists() else final, windows, issues, tl)
    metrics["captions"] = check_captions(layout_p, words, stage1 if stage1.exists() else final, issues, tl)
    metrics["brand"] = check_brand(tl, layout_p, words, issues, base)
    # pacing
    lens = [w["end"] - w["start"] for w in windows if not w["image"]]
    if lens:
        metrics["pacing"] = {"mean_shot_s": round(float(np.mean(lens)), 2), "longest_s": round(max(lens), 2)}
        if max(lens) > 7:
            issues.append(Issue("pacing.long_shot", "WARN", "assemble",
                                f"a {max(lens):.1f}s shot with no cut/zoom change — add a punch-in", metrics["pacing"]))
    order = {"FAIL": 0, "WARN": 1, "INFO": 2}
    issues.sort(key=lambda i: order[i.severity])
    return {"final": str(final), "passed": not any(i.severity == "FAIL" for i in issues),
            "counts": {s: sum(i.severity == s for i in issues) for s in order},
            "issues": [asdict(i) for i in issues], "metrics": metrics}


def to_markdown(rep: dict) -> str:
    icon = {"FAIL": "❌", "WARN": "⚠️", "INFO": "ℹ️"}
    lines = [f"# QA report — {'PASSED' if rep.get('passed') else 'NOT PASSED'}", "",
             f"File: `{rep['final']}`", ""]
    if "counts" in rep:
        lines.append(f"FAIL {rep['counts']['FAIL']} · WARN {rep['counts']['WARN']} · INFO {rep['counts']['INFO']}")
        lines.append("")
    for i in rep["issues"]:
        lines.append(f"- {icon[i['severity']]} **{i['id']}** ({i['stage']}): {i['message']}")
    m = rep.get("metrics", {})
    if m:
        lines += ["", "## Measurements", "```", json.dumps(m, indent=1, default=str)[:4000], "```"]
    return "\n".join(lines) + "\n"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("timeline")
    ap.add_argument("--final")
    ap.add_argument("-o", "--out")
    a = ap.parse_args()
    tlp = Path(a.timeline).resolve()
    rep = run_qa(tlp, Path(a.final).resolve() if a.final else None)
    out = Path(a.out) if a.out else tlp.parent / "edit" / "qa" / "report.json"
    save_json(out, rep)
    out.with_suffix(".md").write_text(to_markdown(rep), encoding="utf-8")
    print(to_markdown(rep))


if __name__ == "__main__":
    main()
