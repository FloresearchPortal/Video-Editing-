"""Kinetic word-by-word captions in the "stacked phrase" social style:
lowercase words build up a phrase block with mixed weights/sizes — a big bold-italic accent
keyword, medium bold words, thin connector words — each word blurs/fades in on its spoken
time, and the keyword can sit BEHIND the speaker (person segmentation, free MediaPipe model).

    python -m reelkit.captions in.mp4 words.json out.mp4 [--style style.json] [--preview]

words.json: reelkit.transcribe output (scribe shape, seconds) on the SAME timeline as in.mp4.
Optional per-phrase overrides: style.json -> {"emphasis": ["deal", "offended"], ...}.
"""
from __future__ import annotations

import argparse
import random
import re
import subprocess
import tempfile
from dataclasses import dataclass, field
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

from .common import (FONTS, FrameReader, FrameWriter, Subject, ease_out, has_audio, load_json,
                     need, probe, save_json)

STOP = set("""a an the and or but so if of to in on at by for with from as is are was were be been am
i you he she it we they me him her us them my your his its our their this that these those there here
do does did not no just like um uh oh yeah then than too very really can could would should will
what when where who how why all some any about into over up down out""".split())

DEFAULT_STYLE = {
    "fonts": {
        "hero": "Poppins-ExtraBoldItalic.ttf",
        "bold": "Poppins-Bold.ttf",
        "light": "Poppins-ExtraLight.ttf",
        "light_italic": "Poppins-LightItalic.ttf",
    },
    # sizes as a fraction of output width
    "size": {"hero": 0.18, "bold": 0.095, "light": 0.07},
    "colors": {"text": [255, 255, 255], "accents": [[240, 122, 90], [111, 211, 224], [242, 212, 92],
                                                    [255, 255, 255]]},
    "accent_every": 2,           # every Nth phrase gets a coloured keyword (others stay white)
    "behind_subject": True,      # keyword slips behind the speaker when it overlaps them
    "max_cover": 0.35,           # …but only if the speaker hides less than this share of it
    "shadow": 0.45,              # soft drop-shadow opacity
    "max_words": 5,
    "max_gap": 0.45,             # a pause longer than this starts a new phrase (s)
    "word_in": 0.16,             # per-word reveal duration (s)
    "phrase_out": 0.14,
    "hold": 0.5,                 # linger after the phrase's last word if no phrase follows
    "lowercase": True,
    "emphasis": [],              # force these words to be the hero keyword
    "seed": 7,
    "hero_slant_deg": 0,         # brand italic: shear keyword sprites (e.g. 10 for FloStocks' slanted wordmark)
    "watermark": None,           # {"path": logo.png, "position": "top-right", "width": 0.11, "opacity": 0.85}
    "positions": ["head", "chest", "upper"],  # rotation of block placements (QA may drop "head")
    "keep_case": [],             # never lowercase these (brand names, tickers)
    "replace": {},               # transcript fixes, e.g. {"flow stocks": "FloStocks", "psx": "PSX"}
    "safe_zone": {"top": 0.10, "bottom": 0.22, "left": 0.06, "right": 0.14},  # Reels/TikTok UI overlap
}


@dataclass
class Word:
    text: str
    start: float
    end: float
    role: str = "bold"
    color: tuple = (255, 255, 255)
    behind: bool = False
    sprite: np.ndarray | None = None   # premultiplied RGBA float32
    x: int = 0
    y: int = 0


@dataclass
class Phrase:
    words: list = field(default_factory=list)
    start: float = 0.0
    end: float = 0.0


def load_words(p) -> list[dict]:
    data = load_json(p)
    ws = data.get("words", data if isinstance(data, list) else [])
    out = []
    for w in ws:
        if w.get("type", "word") != "word":
            continue
        s, e = float(w["start"]), float(w["end"])
        if s > 1000:  # assemblyai ms
            s, e = s / 1000, e / 1000
        out.append({"text": w["text"], "start": s, "end": e})
    return out


def apply_replacements(words: list[dict], rep: dict) -> list[dict]:
    """Fix mis-heard terms (brand names, tickers). Keys may span several words; matching ignores
    case and punctuation, the replacement keeps the last word's trailing punctuation."""
    if not rep:
        return words
    norm = lambda t: re.sub(r"[^\w']", "", t.lower())
    rules = sorted(((k.lower().split(), v) for k, v in rep.items()), key=lambda r: -len(r[0]))
    out, i = [], 0
    while i < len(words):
        for keys, val in rules:
            n = len(keys)
            if [norm(w["text"]) for w in words[i:i + n]] == [norm(k) for k in keys]:
                tail = re.search(r"[.,!?;:]+$", words[i + n - 1]["text"])
                out.append({"text": val + (tail.group(0) if tail else ""), "start": words[i]["start"],
                            "end": words[i + n - 1]["end"]})
                i += n
                break
        else:
            out.append(words[i])
            i += 1
    return out


def phrases_from(words: list[dict], st: dict) -> list[Phrase]:
    ps, cur = [], Phrase()
    for i, w in enumerate(words):
        if cur.words:
            gap = w["start"] - cur.words[-1].end
            prev = cur.words[-1].text
            if gap > st["max_gap"] or len(cur.words) >= st["max_words"] or re.search(r"[.?!,;:]$", prev):
                ps.append(cur)
                cur = Phrase()
        cur.words.append(Word(w["text"], w["start"], w["end"]))
    if cur.words:
        ps.append(cur)
    # don't strand a connector word ("…tell you the") at a phrase end — carry it forward
    for p, q in zip(ps, ps[1:]):
        while (len(p.words) > 2 and re.sub(r"\W", "", p.words[-1].text.lower()) in STOP
               and not re.search(r"[.?!,;:]$", p.words[-1].text)
               and q.words[0].start - p.words[-1].end < st["max_gap"]):
            q.words.insert(0, p.words.pop())
    for p in ps:
        p.start = p.words[0].start
    for i, p in enumerate(ps):
        nxt = ps[i + 1].start if i + 1 < len(ps) else p.words[-1].end + st["hold"] + st["phrase_out"]
        p.end = min(nxt, p.words[-1].end + st["hold"] + 1.0)
    return ps


def clean(t: str, lower: bool) -> str:
    t = re.sub(r"[\"“”]", "", t).strip()
    t = re.sub(r"[,;:]$", "", t)
    return t.lower() if lower else t


def assign_roles(ps: list[Phrase], st: dict, rng: random.Random) -> None:
    forced = {w.lower() for w in st["emphasis"]}
    keep = {re.sub(r"\W", "", v) for v in st["replace"].values()} | set(st.get("keep_case", []))
    accents = [tuple(c) for c in st["colors"]["accents"]]
    for pi, p in enumerate(ps):
        def score(w):
            k = re.sub(r"\W", "", w.text.lower())
            if k in forced:
                return 100
            return -1 if k in STOP else len(k)
        hero = max(p.words, key=score)
        has_hero = score(hero) >= 4 or score(hero) == 100
        for w in p.words:
            k = re.sub(r"\W", "", w.text.lower())
            if has_hero and w is hero:
                w.role = "hero"
                w.color = accents[(pi // st["accent_every"]) % len(accents)] \
                    if pi % st["accent_every"] == 0 else tuple(st["colors"]["text"])
                w.behind = st["behind_subject"]
            elif k in STOP:
                w.role = "light"
            else:
                w.role = "bold"
            w.text = clean(w.text, st["lowercase"] and re.sub(r"\W", "", w.text) not in keep)


def slant(spr: np.ndarray, deg: float) -> np.ndarray:
    """Shear a sprite to the right (synthetic italic matching a slanted brand wordmark)."""
    h, w = spr.shape[:2]
    k = np.tan(np.radians(deg))
    pad = int(np.ceil(k * h))
    return cv2.warpAffine(spr, np.float32([[1, -k, pad], [0, 1, 0]]), (w + pad, h), flags=cv2.INTER_LINEAR,
                          borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))


def load_watermark(wm: dict | None, ow: int, oh: int):
    """Premultiplied BGRA logo sprite + (x, y), or None."""
    if not wm:
        return None
    from PIL import Image
    logo = Image.open(wm["path"]).convert("RGBA")
    tw = int(ow * wm.get("width", 0.11))
    logo = logo.resize((tw, max(1, int(logo.height * tw / logo.width))), Image.LANCZOS)
    a = np.asarray(logo).astype(np.float32) / 255.0
    a[..., :3] *= a[..., 3:4]
    spr = a[..., [2, 1, 0, 3]] * float(wm.get("opacity", 0.85))
    m = int(ow * 0.045)
    top = int(oh * 0.06)
    pos = wm.get("position", "top-right")
    x = ow - tw - m if "right" in pos else m
    y = top if "top" in pos else oh - spr.shape[0] - int(oh * 0.24)
    return spr, x, y


def make_sprite(text: str, font: ImageFont.FreeTypeFont, color, shadow: float) -> np.ndarray:
    l, t, r, b = font.getbbox(text)
    pad = int(font.size * 0.35)
    w, h = r - l + 2 * pad, b - t + 2 * pad
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    if shadow > 0:
        sh = Image.new("L", (w, h), 0)
        ImageDraw.Draw(sh).text((pad - l + font.size * 0.03, pad - t + font.size * 0.05), text, font=font,
                                fill=int(255 * shadow))
        sh = sh.filter(ImageFilter.GaussianBlur(font.size * 0.08))
        img.putalpha(sh)
    ImageDraw.Draw(img).text((pad - l, pad - t), text, font=font, fill=tuple(color) + (255,))
    a = np.asarray(img).astype(np.float32) / 255.0
    a[..., :3] *= a[..., 3:4]                      # premultiply
    return a[..., [2, 1, 0, 3]].copy()             # RGBA -> BGRA


def layout(ps: list[Phrase], ow: int, oh: int, st: dict, fonts: dict, anchors: list, rng: random.Random):
    """Stack each phrase into lines: hero on its own line, small words tucked around it."""
    for pi, p in enumerate(ps):
        for w in p.words:
            f = fonts["light_italic" if (w.role == "light" and rng.random() < 0.35) else w.role]
            w.sprite = make_sprite(w.text, f, w.color, st["shadow"])
            if w.role == "hero" and st.get("hero_slant_deg"):
                w.sprite = slant(w.sprite, st["hero_slant_deg"])
            # a long keyword at hero size can be wider than the phone screen: fit the safe width
            safe_w = ow * (1 - st["safe_zone"]["left"] - st["safe_zone"]["right"]) * 1.12  # sprites carry padding
            if w.sprite.shape[1] > safe_w:
                k = safe_w / w.sprite.shape[1]
                w.sprite = cv2.resize(w.sprite, None, fx=k, fy=k, interpolation=cv2.INTER_AREA)
        lines, cur, cur_w = [], [], 0
        maxw = ow * (1 - st["safe_zone"]["left"] - st["safe_zone"]["right"])
        for w in p.words:
            sw = w.sprite.shape[1]
            if w.role == "hero" or (cur and cur[-1].role == "hero") or cur_w + sw > maxw:
                if cur:
                    lines.append(cur)
                cur, cur_w = [], 0
            cur.append(w)
            cur_w += sw * 0.86
        if cur:
            lines.append(cur)
        # line heights overlap a little (tight, layered look)
        heights = [max(w.sprite.shape[0] for w in ln) for ln in lines]
        # true extent: words overlap by 14 %, the last word doesn't
        widths = [sum(w.sprite.shape[1] for w in ln[:-1]) * 0.86 + ln[-1].sprite.shape[1] for ln in lines]
        block_h = sum(h * 0.62 for h in heights)
        block_w = max(widths)
        anchor = anchors[pi]  # (cx, cy) of the block in output px
        sz = st["safe_zone"]
        cx = min(max(anchor[0], block_w / 2 + ow * sz["left"]), ow - block_w / 2 - ow * sz["right"])
        y = anchor[1] - block_h / 2
        y = min(max(y, oh * sz["top"]), oh * (1 - sz["bottom"]) - block_h)
        for li, (ln, h, wdt) in enumerate(zip(lines, heights, widths)):
            stagger = rng.uniform(-0.08, 0.08) * ow if len(lines) > 1 else 0
            x = cx - wdt / 2 + stagger
            inset = 0.18 * h  # sprites carry shadow padding around the ink
            x = min(max(x, ow * sz["left"] - inset), ow * (1 - sz["right"]) + inset - wdt)
            for w in ln:
                w.x = int(x)
                w.y = int(y + (h - w.sprite.shape[0]) * 0.5)
                x += w.sprite.shape[1] * 0.86
            y += h * 0.62


def compose(dst: np.ndarray, spr: np.ndarray, x: int, y: int, alpha: float) -> None:
    """Premultiplied 'over' of a BGRA sprite onto a float32 BGRA layer."""
    h, w = spr.shape[:2]
    H, W = dst.shape[:2]
    x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, W), min(y + h, H)
    if x0 >= x1 or y0 >= y1:
        return
    s = spr[y0 - y:y1 - y, x0 - x:x1 - x] * alpha
    d = dst[y0:y1, x0:x1]
    d *= (1 - s[..., 3:4])
    d += s


def word_sprite_at(w: Word, t: float, p: Phrase, st: dict):
    """Return (sprite, x, y, alpha) for word w at time t, or None."""
    t_in = w.start - 0.04
    if t < t_in or t >= p.end:
        return None
    u = ease_out((t - t_in) / st["word_in"])
    out_u = 1.0
    if t > p.end - st["phrase_out"]:
        out_u = max(0.0, (p.end - t) / st["phrase_out"])
    alpha = u * out_u
    if alpha <= 0.01:
        return None
    spr = w.sprite
    scale = 1.0 + 0.18 * (1 - u) + 0.06 * (1 - out_u)
    blur = 9 * (1 - u) + 7 * (1 - out_u)
    if scale != 1.0:
        spr = cv2.resize(spr, None, fx=scale, fy=scale, interpolation=cv2.INTER_LINEAR)
    if blur > 0.6:
        k = int(blur) * 2 + 1
        spr = cv2.GaussianBlur(spr, (k, k), 0)
    h0, w0 = w.sprite.shape[:2]
    x = int(w.x - (spr.shape[1] - w0) / 2)
    y = int(w.y - (spr.shape[0] - h0) / 2 + 14 * (1 - u))
    return spr, x, y, alpha


POSITIONS = {"head": 0, "chest": 1, "upper": 2}


def plan_anchors(ps, video, fps, ow, oh, subject: Subject | None, rng, positions=("head", "chest", "upper")):
    """Alternate phrase positions: around the top of the head (keyword tucked behind it) /
    chest, in front / upper third. Returns (anchors, person masks at each phrase start)."""
    anchors, masks = [], []
    for pi, p in enumerate(ps):
        loc = mask = None
        if subject:
            rd = FrameReader(video, p.start, 0.1, fps)
            frame = cv2.resize(rd.read(), (ow, oh))
            rd.close()
            loc = subject.locate(frame)
            mask = subject.mask(frame)
        masks.append(mask)
        mode = POSITIONS[positions[pi % len(positions)]]
        if loc is None:
            anchors.append((ow / 2, oh * (0.28 if mode != 1 else 0.62)))
            continue
        hx, hy, head = loc["hx"], loc["hy"], loc["head"]
        if hy - head * 0.6 < oh * 0.16:
            mode = 1       # tight close-up: no headroom, never put type across the face
        if mode == 0:      # block straddles the crown of the head: keyword partly behind it
            anchors.append((hx + rng.uniform(-0.05, 0.05) * ow, hy - head * 0.9))
        elif mode == 1:    # on the chest, in front
            anchors.append((hx, min(hy + head * 2.6, oh * 0.66)))
        else:              # above the head, upper third
            anchors.append((ow / 2 + rng.uniform(-0.1, 0.1) * ow, max(oh * 0.2, hy - head * 2.2)))
    return anchors, masks


def limit_occlusion(ps, masks, max_cover: float) -> None:
    """A keyword may only hide behind the speaker if most of it stays readable."""
    for p, m in zip(ps, masks):
        for w in p.words:
            if not w.behind:
                continue
            if m is None:
                w.behind = False
                continue
            h, wd = w.sprite.shape[:2]
            ink = w.sprite[..., 3] > 0.5
            region = np.zeros_like(ink, dtype=np.float32)
            y0, x0 = max(w.y, 0), max(w.x, 0)
            y1, x1 = min(w.y + h, m.shape[0]), min(w.x + wd, m.shape[1])
            if y0 < y1 and x0 < x1:
                region[y0 - w.y:y1 - w.y, x0 - w.x:x1 - w.x] = m[y0:y1, x0:x1]
            cover = float((region * ink).sum() / max(ink.sum(), 1))
            if cover > max_cover:
                w.behind = False


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("video")
    ap.add_argument("words")
    ap.add_argument("out")
    ap.add_argument("--style", help="JSON overriding DEFAULT_STYLE keys")
    a = ap.parse_args()
    need("ffmpeg")

    st = dict(DEFAULT_STYLE)
    if a.style:
        st.update(load_json(a.style))
    rng = random.Random(st["seed"])

    vs = next(s for s in probe(a.video)["streams"] if s["codec_type"] == "video")
    num, den = (vs.get("r_frame_rate") or "30/1").split("/")
    fps = float(num) / float(den)
    dur = float(probe(a.video)["format"]["duration"])
    rd = FrameReader(a.video, 0, dur, fps)
    ow, oh = rd.w, rd.h

    fonts = {k: ImageFont.truetype(str(FONTS / v), int(st["size"]["light" if k == "light_italic" else k] * ow))
             for k, v in st["fonts"].items()}
    ps = phrases_from(apply_replacements(load_words(a.words), st["replace"]), st)
    assign_roles(ps, st, rng)
    subject = Subject() if st["behind_subject"] else None
    anchors, masks = plan_anchors(ps, a.video, fps, ow, oh, subject, rng, st["positions"])
    layout(ps, ow, oh, st, fonts, anchors, rng)
    limit_occlusion(ps, masks, st["max_cover"])
    del masks
    save_json(Path(a.out).with_suffix(".layout.json"), {
        "size": [ow, oh], "fps": fps, "safe_zone": st["safe_zone"], "watermark": bool(st.get("watermark")),
        "phrases": [{"start": p.start, "end": p.end, "words": [
            {"text": w.text, "start": w.start, "end": w.end, "role": w.role, "behind": w.behind,
             "color": list(w.color), "box": [w.x, w.y, int(w.sprite.shape[1]), int(w.sprite.shape[0])]}
            for w in p.words]} for p in ps]})
    print(f"{len(ps)} phrases, {sum(len(p.words) for p in ps)} words, {ow}x{oh}@{fps:g}")

    tmp = Path(tempfile.mkdtemp(prefix="reelkit_cap_"))
    silent = tmp / "v.mp4"
    wr = FrameWriter(silent, ow, oh, fps, crf=17)
    n = max(1, round(dur * fps))
    wmark = load_watermark(st.get("watermark"), ow, oh)
    pi = 0
    for i in range(n):
        t = i / fps
        frame = rd.read()
        while pi < len(ps) - 1 and t >= ps[pi].end:
            pi += 1
        active = [p for p in ps[max(0, pi - 1):pi + 2] if p.start - 0.05 <= t < p.end]
        back = front = None
        for p in active:
            for w in p.words:
                r = word_sprite_at(w, t, p, st)
                if not r:
                    continue
                if w.behind:
                    back = np.zeros((oh, ow, 4), np.float32) if back is None else back
                    compose(back, *r)
                else:
                    front = np.zeros((oh, ow, 4), np.float32) if front is None else front
                    compose(front, *r)
        if wmark is not None:  # logo bug sits under the captions
            base = np.zeros((oh, ow, 4), np.float32)
            compose(base, *wmark, 1.0)
            if front is not None:
                base = base * (1 - front[..., 3:4]) + front
            front = base
        if back is None and front is None:
            wr.write(frame)
            continue
        img = frame.astype(np.float32) / 255.0
        if back is not None:
            m = subject.mask(frame)[..., None]
            under = img * (1 - back[..., 3:4]) + back[..., :3]
            img = under * (1 - m) + img * m       # speaker stays in front of the keyword
        if front is not None:
            img = img * (1 - front[..., 3:4]) + front[..., :3]
        wr.write((np.clip(img, 0, 1) * 255).astype(np.uint8))
    rd.close()
    wr.close()
    if subject:
        subject.close()

    if has_audio(a.video):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(silent), "-i", a.video, "-map", "0:v",
                        "-map", "1:a", "-c", "copy", "-shortest", a.out], check=True)
    else:
        Path(a.out).write_bytes(silent.read_bytes())
    print(f"wrote {a.out}")


if __name__ == "__main__":
    main()
