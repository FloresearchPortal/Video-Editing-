"""Brand kit helpers: brand/brand.json -> caption style, watermark, end card.

    python -m reelkit.brand endcard [-o brand/endcard.png] [--cta "Open your PSX account"] [--no-disclaimer]
    python -m reelkit.brand style   [-o brand/caption_style.json]      # caption style JSON from the brand
    python -m reelkit.brand show                                        # print the kit

In a timeline: "brand": true  (make_reel then uses the brand caption style + watermark, and
the QA gate checks brand rules). Add the end card as the last clip:
    {"src": "brand/endcard.png", "dur": 2.5, "zoom": "pull", "transition": {"type": "dip", "dur": 0.3}}
"""
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

from .common import ROOT, load_json, save_json

BRAND = ROOT / "brand" / "brand.json"


def load_brand(path: str | Path | None = None) -> dict:
    return load_json(path or BRAND)


def hex_rgb(h: str) -> list[int]:
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def rpath(p: str) -> Path:
    return (ROOT / p).resolve()


def caption_style(b: dict | None = None) -> dict:
    """Caption style overrides (reelkit.captions DEFAULT_STYLE keys) in the brand's look."""
    b = b or load_brand()
    f = b["fonts"]["files"]
    v = b.get("video", {})
    style = {
        "fonts": {"hero": str(rpath(f["display"])), "bold": str(rpath(f["body_bold"])),
                  "light": str(rpath(f["body_light"])), "light_italic": str(rpath(f["body_light2"]))},
        "colors": {"text": [255, 255, 255], "accents": [hex_rgb(c) for c in v.get("caption_accents", [])]
                   or [hex_rgb(b["colors"]["green"])]},
        "hero_slant_deg": v.get("caption_slant_deg", 0),
    }
    wm = v.get("watermark")
    if wm:
        style["watermark"] = {**wm, "path": str(rpath(b["logo"][wm.get("logo", "icon_on_dark")]))}
    return style


def endcard(out: Path, w: int = 1080, h: int = 1920, cta: str | None = None, disclaimer: bool = True,
            b: dict | None = None) -> Path:
    b = b or load_brand()
    c = b["colors"]
    f = b["fonts"]["files"]
    ink, green = tuple(hex_rgb(c["ink"])), tuple(hex_rgb(c["green"]))
    img = Image.new("RGB", (w, h), ink)
    # soft brand-green glow behind the logo (the site's green-glow token)
    glow = Image.new("L", (w, h), 0)
    ImageDraw.Draw(glow).ellipse([w * 0.05, h * 0.28, w * 0.95, h * 0.58], fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(w * 0.12))
    img = Image.composite(Image.new("RGB", (w, h), green), img, glow)
    d = ImageDraw.Draw(img)

    logo = Image.open(rpath(b["logo"]["full_on_dark"])).convert("RGBA")
    lw = int(w * 0.82)
    logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.LANCZOS)
    ly = int(h * 0.36)
    img.paste(logo, ((w - lw) // 2, ly), logo)

    def centered(text, font, y, fill):
        tw = d.textlength(text, font=font)
        d.text(((w - tw) / 2, y), text, font=font, fill=fill)

    tag = ImageFont.truetype(str(rpath(f["body_light2"])), int(w * 0.042))
    centered(b["tagline"], tag, ly + logo.height + int(h * 0.02), (230, 236, 230))

    cta = cta or b["ctas"][0]
    btn_font = ImageFont.truetype(str(rpath(f["display_bold"])), int(w * 0.05))
    label = f"{cta}  →"
    tw = d.textlength(label, font=btn_font)
    bx0, by0 = (w - tw) / 2 - w * 0.06, h * 0.64
    bx1, by1 = (w + tw) / 2 + w * 0.06, by0 + w * 0.12
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=int(w * 0.06), fill=green)
    d.text(((w - tw) / 2, by0 + (by1 - by0 - btn_font.size * 1.2) / 2), label, font=btn_font, fill=ink)

    url = ImageFont.truetype(str(rpath(f["mono"])), int(w * 0.04))
    centered(b["website"], url, by1 + h * 0.03, (255, 255, 255))
    handle = b.get("socials", {}).get("instagram")
    if handle:
        centered(handle, ImageFont.truetype(str(rpath(f["body_light2"])), int(w * 0.034)),
                 by1 + h * 0.03 + w * 0.065, (170, 180, 172))

    disc = b.get("video", {}).get("disclaimer")
    if disclaimer and disc:
        small = ImageFont.truetype(str(rpath(f["body_light2"])), int(w * 0.024))
        words, lines, cur = disc.split(), [], ""
        for word in words:
            t = (cur + " " + word).strip()
            if d.textlength(t, font=small) > w * 0.84:
                lines.append(cur)
                cur = word
            else:
                cur = t
        lines.append(cur)
        y = h * 0.90 - len(lines) * small.size * 1.35
        for ln in lines:
            centered(ln, small, y, (150, 158, 152))
            y += small.size * 1.35
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out)
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("endcard")
    p.add_argument("-o", "--out", default=str(ROOT / "brand" / "endcard.png"))
    p.add_argument("--cta")
    p.add_argument("--no-disclaimer", action="store_true")
    p.add_argument("--size", default="1080x1920")
    p = sub.add_parser("style")
    p.add_argument("-o", "--out", default=str(ROOT / "brand" / "caption_style.json"))
    sub.add_parser("show")
    a = ap.parse_args()
    if a.cmd == "endcard":
        w, h = (int(x) for x in a.size.split("x"))
        print(endcard(Path(a.out), w, h, a.cta, not a.no_disclaimer))
    elif a.cmd == "style":
        save_json(a.out, caption_style())
        print(a.out)
    else:
        import json
        print(json.dumps(load_brand(), indent=2))


if __name__ == "__main__":
    main()
