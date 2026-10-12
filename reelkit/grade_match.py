"""Match a reference's colour grade: measure the reference's look and bake a 3D LUT (.cube) that
maps YOUR footage onto it. The LUT works in DaVinci Resolve (free), Premiere, Final Cut, CapCut
and in reelkit (`"grade": "lut:grades/my_look.cube"`). 100% free/local.

    # 1) profile the reference once (skip intro/outro cards with --range)
    python -m reelkit.grade_match profile ref.mp4 [more refs/images] --range 0:40 -o grades/ref.profile.json
    # 2) bake a LUT for your camera/footage (pass 1+ representative clips or stills)
    python -m reelkit.grade_match lut grades/ref.profile.json raw/a.mp4 raw/b.mp4 -o grades/my_look.cube
    # 3) check it: side-by-side stills of source | graded | reference
    python -m reelkit.grade_match compare grades/my_look.cube raw/a.mp4 ref.mp4 -o grades/compare.png

What is matched (in CIE Lab): the tone curve (luminance quantiles), the colour cast of shadows /
midtones / highlights (teal shadows, warm highlights…), contrast of each colour axis per tonal
zone, and saturation per hue sector (e.g. punchy skies, restrained skin). Spatial effects
(vignette, blur, grain) can't live in a LUT — add them separately (reelkit grade chain or a
Resolve window). Without the reference's ungraded originals no tool can recover the colourist's
exact node tree; this matches the RESULT on your footage, which is what "looks the same" means.
"""
from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

import cv2
import numpy as np

from .common import duration, is_image, load_json, need, save_json

ZONES = ("shadows", "midtones", "highlights")
HUE_SECTORS = 12
GRID = 33


# ── sampling ──────────────────────────────────────────────────────────────
def sample_pixels(paths, rng: tuple[float, float] | None = None, per_source: int = 60,
                  width: int = 320) -> np.ndarray:
    """Return Nx3 float32 RGB in [0,1] sampled across the sources."""
    chunks = []
    for p in paths:
        p = str(p)
        if is_image(p):
            img = cv2.imread(p, cv2.IMREAD_COLOR)
            s = width / img.shape[1]
            frames = [cv2.resize(img, (width, int(img.shape[0] * s)), interpolation=cv2.INTER_AREA)]
        else:
            t0, t1 = rng if rng else (0.0, duration(p))
            fps = max(per_source / max(t1 - t0, 0.1), 0.05)
            raw = subprocess.run(
                ["ffmpeg", "-v", "error", "-ss", str(t0), "-to", str(t1), "-i", p,
                 "-vf", f"fps={fps},scale={width}:-2", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
                capture_output=True, check=True).stdout
            h = None
            probe_frame = subprocess.run(
                ["ffmpeg", "-v", "error", "-ss", str(t0), "-i", p, "-frames:v", "1",
                 "-vf", f"scale={width}:-2", "-f", "image2pipe", "-vcodec", "png", "-"],
                capture_output=True, check=True).stdout
            h = cv2.imdecode(np.frombuffer(probe_frame, np.uint8), cv2.IMREAD_COLOR).shape[0]
            n = len(raw) // (width * h * 3)
            frames = list(np.frombuffer(raw[:n * width * h * 3], np.uint8).reshape(n, h, width, 3))
        for f in frames:
            px = f.reshape(-1, 3)[:, ::-1].astype(np.float32) / 255.0
            chunks.append(px[:: max(1, len(px) // 6000)])
    return np.concatenate(chunks)


def to_lab(rgb: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(rgb.reshape(-1, 1, 3).astype(np.float32), cv2.COLOR_RGB2LAB).reshape(-1, 3)


def to_rgb(lab: np.ndarray) -> np.ndarray:
    return cv2.cvtColor(lab.reshape(-1, 1, 3).astype(np.float32), cv2.COLOR_LAB2RGB).reshape(-1, 3)


def zone_weights(L: np.ndarray) -> np.ndarray:
    """Smooth shadow/mid/highlight membership from L (0..100) -> Nx3, rows sum to 1."""
    x = np.clip(L / 100.0, 0, 1)
    sh = np.clip(1 - x / 0.45, 0, 1) ** 1.5
    hi = np.clip((x - 0.55) / 0.45, 0, 1) ** 1.5
    mid = np.clip(1 - sh - hi, 0, 1)
    w = np.stack([sh, mid, hi], 1) + 1e-6
    return w / w.sum(1, keepdims=True)


def hue_weights(a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """Soft membership of each pixel in HUE_SECTORS hue sectors -> NxK."""
    h = (np.degrees(np.arctan2(b, a)) + 360) % 360
    centers = np.arange(HUE_SECTORS) * 360 / HUE_SECTORS
    d = np.abs(((h[:, None] - centers[None, :]) + 180) % 360 - 180)
    w = np.clip(1 - d / (360 / HUE_SECTORS), 0, 1)
    return w / (w.sum(1, keepdims=True) + 1e-6)


def skin_weight(L: np.ndarray, a: np.ndarray, b: np.ndarray) -> np.ndarray:
    """0..1 membership of the skin-tone region: Lab hue ~-20..90 deg (pink to golden skin),
    low-moderate chroma, mid-bright. Excludes deep saturated reds (wine fabrics) and darks."""
    h = (np.degrees(np.arctan2(b, a)) + 540) % 360 - 180   # -180..180
    C = np.hypot(a, b)
    wh = np.clip(1 - np.abs(h - 35) / 55, 0, 1) ** 0.5
    wc = np.clip((C - 3) / 4, 0, 1) * np.clip((40 - C) / 10, 0, 1)
    wl = np.clip((L - 40) / 12, 0, 1) * np.clip((97 - L) / 6, 0, 1)
    return wh * wc * wl


def skin_stats(L, a, b):
    w = skin_weight(L, a, b) > 0.5
    return float(np.percentile(L[w], 75)) if w.sum() > 200 else None  # the lit side of faces


def skin_colour(L, a, b) -> dict:
    w = skin_weight(L, a, b) > 0.5
    if w.sum() <= 200:
        return {"skin_hue": None, "skin_C": None}
    return {"skin_hue": float(np.degrees(np.arctan2(np.median(b[w]), np.median(a[w])))),
            "skin_C": float(np.median(np.hypot(a[w], b[w])))}


def profile_of(rgb: np.ndarray) -> dict:
    lab = to_lab(rgb)
    # drop clipped whites (burned-in caption text, blown sky) and pure black bars
    keep = (lab[:, 0] < 97) & (lab[:, 0] > 1.5)
    lab = lab[keep]
    L, a, b = lab.T
    zw = zone_weights(L)
    zones = {}
    for i, z in enumerate(ZONES):
        w = zw[:, i]
        ws = w.sum() + 1e-6
        ma, mb = (w * a).sum() / ws, (w * b).sum() / ws
        sa = np.sqrt((w * (a - ma) ** 2).sum() / ws)
        sb = np.sqrt((w * (b - mb) ** 2).sum() / ws)
        # the grade's tint is read from near-neutral pixels (whites, greys, concrete) — the scene's
        # content colour (sky, foliage, skin) must not masquerade as a colour cast
        wn = w * np.exp(-(np.hypot(a, b) / 10.0) ** 2)
        wns = wn.sum() + 1e-6
        zones[z] = {"a": float(ma), "b": float(mb), "sa": float(sa), "sb": float(sb), "weight": float(ws / len(L)),
                    "na": float((wn * a).sum() / wns), "nb": float((wn * b).sum() / wns),
                    "neutral_mass": float(wns / len(L))}
    C = np.hypot(a - np.median(a), b - np.median(b))
    hw = hue_weights(a, b)
    sat = (hw * np.hypot(a, b)[:, None]).sum(0) / (hw.sum(0) + 1e-6)
    return {"L_quantiles": np.percentile(L, np.linspace(0, 100, 101)).round(3).tolist(),
            "zones": zones, "hue_chroma": sat.round(3).tolist(),
            "hue_mass": (hw.sum(0) / len(L)).round(5).tolist(),
            "chroma_median": float(np.median(C)), "chroma_mean": float(np.hypot(a, b).mean()),
            "skin_L": skin_stats(L, a, b),
            **skin_colour(L, a, b),
            "pixels": int(len(L))}


# ── transform ─────────────────────────────────────────────────────────────
def casts(prof: dict) -> np.ndarray:
    """Per-zone grade tint (a, b): neutral-pixel cast, falling back toward half the all-pixel mean
    when a zone has almost no neutral pixels."""
    out = []
    for z in ZONES:
        d = prof["zones"][z]
        if "na" not in d:  # profile from an older version
            out.append([d["a"] * 0.5, d["b"] * 0.5])
            continue
        trust = np.clip(d["neutral_mass"] / 0.03, 0, 1)
        out.append([trust * d["na"] + (1 - trust) * 0.5 * d["a"], trust * d["nb"] + (1 - trust) * 0.5 * d["b"]])
    return np.array(out)


def build_transform(src: dict, ref: dict, strength: float = 1.0, contrast_limit: float = 1.7,
                    calibrate: np.ndarray | None = None, match_exposure: bool = False,
                    skin_protect: float = 0.8, skin_max_L: float | None = 72.0,
                    skin_line: float = 0.85, natural_skin_hue: float = 52.0,
                    skin_chroma: tuple[float, float] = (16.0, 24.0), tone: str = "natural"):
    sat_cap = 1.15
    if tone == "match":
        # same-scene matching: the reference defines skin too (its warmth, its exposure)
        if ref.get("skin_C") is not None:
            skin_chroma = (max(ref["skin_C"] - 3, 6.0), ref["skin_C"] + 3)
        skin_max_L, skin_protect, sat_cap = None, 0.3, 1.3

    qs, qr = np.array(src["L_quantiles"]), np.array(ref["L_quantiles"])
    qs = np.maximum.accumulate(qs + np.arange(101) * 1e-4)  # strictly increasing
    fine = np.linspace(0, 100, 1001)

    if tone == "match":
        # full distribution match — exact when the footage is the same kind of scene as the reference
        xs = np.concatenate([[0], qs, [100]])
        ys = np.concatenate([[min(qr[0], qs[0])], qr, [max(qr[-1], 100 if qs[-1] >= 99 else qr[-1])]])
        ys = np.maximum.accumulate(ys)
        curve = np.interp(fine, xs, ys)
        curve = np.convolve(np.pad(curve, 25, mode="edge"), np.ones(51) / 51, mode="valid")
        slope = np.clip(np.gradient(curve, fine), 0.15, contrast_limit)
        limited = np.concatenate([[0.0], np.cumsum(slope[1:] * np.diff(fine))])
        w = np.interp(fine, xs[1:-1], np.gradient(np.arange(101.0)), left=0, right=0) + 1e-3
        curve = limited + np.average(curve - limited, weights=w)
        if not match_exposure:
            curve = curve - (np.interp(qs[50], fine, curve) - qs[50])
    else:
        # "natural": copy the reference's contrast CHARACTER, not its content's brightness —
        # clean black point, midtone punch (IQR ratio), safe whites; S-curve around this shot's midtone
        cm = qs[50] if not match_exposure else qr[50]
        tb = float(np.clip(qr[1], 4.0, 10.0)) if qs[1] > 10 else float(qs[1])
        tw = float(np.clip(qr[99], 86.0, 93.0)) if qs[99] < 86 else float(qs[99])
        k = float(np.clip((qr[75] - qr[25]) / max(qs[75] - qs[25], 1e-3), 1.0, 1.3))
        pts_x = [0.0, qs[1], qs[25], qs[50], qs[75], qs[99], 100.0]
        pts_y = [0.0, tb, cm - (qs[50] - qs[25]) * k, cm, cm + (qs[75] - qs[50]) * k, tw, 100.0]
        pts_y = list(np.maximum.accumulate(np.clip(pts_y, 0, 100)))
        curve = np.interp(fine, pts_x, pts_y)
        curve = np.convolve(np.pad(curve, 40, mode="edge"), np.ones(81) / 81, mode="valid")  # smooth S

    # soft shoulder so hair / skies / white shirts roll off instead of clipping
    curve = np.where(curve > 88, 88 + 12 * np.tanh((curve - 88) / 12), curve)
    curve = np.clip(np.maximum.accumulate(curve), 0, 100)
    skin_L = src.get("skin_L")
    if skin_max_L and skin_L:
        got = float(np.interp(skin_L, fine, curve))
        if got > skin_max_L:
            # bring the lit side of faces to ~skin_max_L: pull that rises from the midtone, so
            # shadows/mids keep their density and the face keeps most of its modelling
            # shift (don't squash) the face's range: full pull from ~10 L below the face upward,
            # ramping in through the shadows/mids, easing off toward white so whites don't grey out
            d = got - skin_max_L
            lo, hi = 30.0, max(got - 12.0, 35.0)
            ramp = np.clip((curve - lo) / (hi - lo), 0, 1)
            ramp = ramp * ramp * (3 - 2 * ramp)
            over = np.clip((curve - got) / max(100 - got, 1e-3), 0, 1)
            pull = d * ramp * (1 - 0.6 * over)
            curve = np.maximum.accumulate(curve - pull)

    zs = np.array([[src["zones"][z][k] for k in ("a", "b", "sa", "sb")] for z in ZONES])
    zr = np.array([[ref["zones"][z][k] for k in ("a", "b", "sa", "sb")] for z in ZONES])
    scale = np.clip(zr[:, 2:] / np.maximum(zs[:, 2:], 1e-3), 0.6, 1.8)
    hs, hr = np.array(src["hue_chroma"]), np.array(ref["hue_chroma"])
    ms, mr = np.array(src["hue_mass"]), np.array(ref["hue_mass"])
    reliable = (ms > 0.01) & (mr > 0.01)
    hue_gain = np.where(reliable, np.clip(hr / np.maximum(hs, 1e-3), 0.7, 1.5), 1.0)
    hue_gain = (np.roll(hue_gain, 1) + 2 * hue_gain + np.roll(hue_gain, -1)) / 4  # smooth around the wheel
    # the per-zone axis scaling already moves overall saturation — hue gains only redistribute it
    hue_gain = hue_gain / max(np.average(hue_gain, weights=ms + 1e-6), 1e-3)
    centers = np.arange(HUE_SECTORS) * 360 / HUE_SECTORS
    warm = (centers >= 15) & (centers <= 105)          # skin, blonde hair, wood: keep them natural
    hue_gain = np.where(warm, np.minimum(hue_gain, 1.0), hue_gain)

    cast_s, cast_r = casts(src), casts(ref)
    if tone == "match" and ref.get("skin_hue") is not None:
        skin_target_hue_pre = ref["skin_hue"]
    elif ref.get("skin_hue") is not None:
        skin_target_hue_pre = 0.7 * natural_skin_hue + 0.3 * ref["skin_hue"]
    else:
        skin_target_hue_pre = natural_skin_hue
    wb = np.zeros(2)
    if skin_line > 0 and src.get("skin_hue") is not None:
        # skin is the most reliable white-balance reference in people footage: if it sits off the
        # skin-tone line, the camera's WB is off — correct half of that globally, the rest on skin
        hs_, cs_ = np.radians(src["skin_hue"]), src["skin_C"]
        ct = float(np.clip(cs_, *skin_chroma))
        target = ct * np.array([np.cos(np.radians(skin_target_hue_pre)), np.sin(np.radians(skin_target_hue_pre))])
        wb = 0.5 * skin_line * (target - cs_ * np.array([np.cos(hs_), np.sin(hs_)]))
    # natural skin hue, nudged a little toward the reference's skin warmth
    skin_target_hue = skin_target_hue_pre
    sat_fix = 1.0

    def apply(rgb: np.ndarray) -> np.ndarray:
        lab = to_lab(np.clip(rgb, 0, 1))
        L, a, b = lab.T
        zw = zone_weights(L)
        mu_s = zw @ zs[:, :2]
        k = zw @ scale
        # 1) white balance: remove the camera's own cast everywhere (skin included)
        bal = -(zw @ cast_s) + wb * np.clip(L / 25, 0, 1)[:, None]   # blacks stay neutral
        a, b = a + bal[:, 0], b + bal[:, 1]
        # 2) skin onto the skin-tone line: natural hue, healthy (not orange) saturation
        sw = np.sqrt(skin_weight(L, a, b))
        if skin_line > 0:
            hue = np.arctan2(b, a)
            dh = (np.radians(skin_target_hue) - hue + np.pi) % (2 * np.pi) - np.pi
            C = np.hypot(a, b)
            C2 = C + (np.clip(C, *skin_chroma) - C) * sw * skin_line
            hue2 = hue + dh * sw * skin_line
            a, b = C2 * np.cos(hue2), C2 * np.sin(hue2)
        # 3) the creative look (reference tint + contrast per colour axis); skin resists it
        look = zw @ cast_r
        protect = 1 - skin_protect * sw
        kk = 1 + (k - 1) * protect[:, None]
        mu_b = mu_s + bal
        a2 = mu_b[:, 0] + (a - mu_b[:, 0]) * kk[:, 0] + look[:, 0] * protect
        b2 = mu_b[:, 1] + (b - mu_b[:, 1]) * kk[:, 1] + look[:, 1] * protect
        shift = bal + look
        g = hue_weights(a, b) @ hue_gain
        neutral = np.clip(np.hypot(a, b) / 12, 0, 1)  # leave greys' hue alone
        c0 = mu_s + shift
        a2 = c0[:, 0] + (a2 - c0[:, 0]) * (1 + (g - 1) * neutral)
        b2 = c0[:, 1] + (b2 - c0[:, 1]) * (1 + (g - 1) * neutral)
        sf = 1 + (sat_fix - 1) * protect
        a2, b2 = a2 * sf, b2 * sf
        L2 = np.interp(L, fine, curve)
        out = np.stack([L + (L2 - L) * strength, a + (a2 - a) * strength, b + (b2 - b) * strength], 1)
        return np.clip(to_rgb(out), 0, 1)

    if calibrate is not None and ref.get("chroma_mean"):
        # zone contrast x hue gains can overshoot overall saturation — calibrate on the source sample
        o = to_lab(apply(calibrate))
        keep = (o[:, 0] < 97) & (o[:, 0] > 1.5)
        got = np.hypot(o[keep, 1], o[keep, 2]).mean()
        sat_fix = float(np.clip(ref["chroma_mean"] / max(got, 1e-3), 0.7, sat_cap)) ** strength
    return apply


def write_cube(path: Path, fn, size: int = GRID, title: str = "reelkit match") -> None:
    r = np.linspace(0, 1, size, dtype=np.float32)
    # .cube order: red changes fastest, then green, then blue
    bb, gg, rr = np.meshgrid(r, r, r, indexing="ij")
    grid = np.stack([rr.ravel(), gg.ravel(), bb.ravel()], 1)
    out = fn(grid)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        f.write(f'TITLE "{title}"\n# generated by reelkit.grade_match (free)\nLUT_3D_SIZE {size}\n'
                "DOMAIN_MIN 0.0 0.0 0.0\nDOMAIN_MAX 1.0 1.0 1.0\n")
        np.savetxt(f, out, fmt="%.6f")


def describe(ref: dict) -> list[str]:
    """Plain-language + Resolve-wheel hints for the look (for manual tweaking in Resolve)."""
    out = []
    for (z, wheel), (a, b) in zip(zip(ZONES, ("Lift", "Gamma", "Gain")), casts(ref)):
        hue = (np.degrees(np.arctan2(b, a)) + 360) % 360
        name = ("magenta" if hue < 30 or hue >= 330 else "red/orange" if hue < 75 else "yellow" if hue < 110
                else "green" if hue < 165 else "teal/cyan" if hue < 230 else "blue" if hue < 280 else "purple")
        out.append(f"{z:<10} cast {name:<10} (a={a:+.1f}, b={b:+.1f})  -> Resolve {wheel} wheel toward {name}")
    q = ref["L_quantiles"]
    out.append(f"tone: black point L={q[1]:.1f}, median L={q[50]:.1f}, white point L={q[99]:.1f} "
               f"(contrast span {q[95] - q[5]:.1f})")
    return out


# ── commands ──────────────────────────────────────────────────────────────
def cmd_profile(a):
    rng = tuple(float(x) for x in a.range.split(":")) if a.range else None
    prof = profile_of(sample_pixels(a.refs, rng, a.samples))
    prof["sources"] = [str(p) for p in a.refs]
    save_json(a.out, prof)
    print(a.out)
    print("\n".join(describe(prof)))


def cmd_lut(a):
    ref = load_json(a.profile)
    px = sample_pixels(a.sources, None, a.samples)
    src = profile_of(px)
    fn = build_transform(src, ref, a.strength, calibrate=px[:: max(1, len(px) // 200000)],
                         match_exposure=a.match_exposure, skin_protect=a.skin_protect,
                         skin_max_L=a.skin_max_l or None, skin_line=a.skin_line,
                         tone=a.tone)
    write_cube(Path(a.out), fn, a.size, title=Path(a.out).stem)
    save_json(Path(a.out).with_suffix(".source.json"), src)
    print(a.out)


def cmd_compare(a):
    from .common import FrameReader
    lut = a.lut
    def still(p, t):
        if is_image(p):
            return cv2.imread(p)
        rd = FrameReader(p, t, 0.1, 30, max_h=720)
        f = rd.read().copy()
        rd.close()
        return f
    src = still(a.source, a.t)
    tmp = Path(a.out).with_suffix(".src.png")
    cv2.imwrite(str(tmp), src)
    graded = Path(a.out).with_suffix(".graded.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-vf", f"lut3d=file='{lut}'",
                    str(graded)], check=True)
    ref = still(a.reference, a.ref_t)
    tiles = [src, cv2.imread(str(graded)), ref]
    h = 720
    tiles = [cv2.resize(t, (int(t.shape[1] * h / t.shape[0]), h)) for t in tiles]
    for t, label in zip(tiles, ("source", "graded", "reference")):
        cv2.putText(t, label, (16, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.1, (255, 255, 255), 2, cv2.LINE_AA)
    cv2.imwrite(a.out, np.hstack(tiles))
    tmp.unlink(); graded.unlink()
    print(a.out)


RESOLVE_LUT_DIRS = {
    "darwin": "/Library/Application Support/Blackmagic Design/DaVinci Resolve/LUT",
    "win32": r"C:\ProgramData\Blackmagic Design\DaVinci Resolve\Support\LUT",
    "linux": "/opt/resolve/LUT",
}


def cmd_resolve(a):
    """Copy a LUT into DaVinci Resolve's LUT folder (free or Studio) under a 'reelkit' subfolder."""
    import shutil
    import sys
    base = Path(a.dir or RESOLVE_LUT_DIRS.get(sys.platform, RESOLVE_LUT_DIRS["linux"]))
    if not base.exists():
        raise SystemExit(f"Resolve LUT folder not found at {base}. In Resolve: Project Settings > Color "
                         "Management > Lookup Tables > Open LUT Folder, then pass it with --dir.")
    dst = base / "reelkit"
    dst.mkdir(exist_ok=True)
    shutil.copy2(a.lut, dst / Path(a.lut).name)
    print(f"copied to {dst / Path(a.lut).name}\nIn Resolve: Project Settings > Color Management > "
          "Lookup Tables > Update Lists (or restart), then right-click a node > LUTs > reelkit.")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    p = sub.add_parser("profile", help="measure a reference look")
    p.add_argument("refs", nargs="+")
    p.add_argument("--range", help="start:end seconds to sample (skip intro/outro cards)")
    p.add_argument("--samples", type=int, default=80, help="frames per source")
    p.add_argument("-o", "--out", default="grades/reference.profile.json")
    p.set_defaults(fn=cmd_profile)
    p = sub.add_parser("lut", help="bake a .cube mapping your footage onto a profile")
    p.add_argument("profile")
    p.add_argument("sources", nargs="+", help="representative clips/stills from YOUR camera")
    p.add_argument("--strength", type=float, default=1.0, help="0..1 blend toward the reference")
    p.add_argument("--match-exposure", action="store_true",
                   help="also copy the reference's overall brightness (default: keep each clip's exposure)")
    p.add_argument("--skin-protect", type=float, default=0.8, help="0..1 how much skin resists the grade")
    p.add_argument("--skin-max-l", type=float, default=72.0,
                   help="cap skin brightness (Lab L, ~65-72 is natural); 0 disables")
    p.add_argument("--tone", choices=["natural", "match"], default="natural",
                   help="natural: copy the reference's contrast character (any scene); "
                        "match: copy its full tonal distribution (same kind of scene, e.g. A/B shots)")
    p.add_argument("--skin-line", type=float, default=0.85,
                   help="0..1 pull skin onto the natural skin-tone line (fixes pink/orange skin)")
    p.add_argument("--size", type=int, default=GRID)
    p.add_argument("--samples", type=int, default=60)
    p.add_argument("-o", "--out", default="grades/match.cube")
    p.set_defaults(fn=cmd_lut)
    p = sub.add_parser("compare", help="source | graded | reference still")
    p.add_argument("lut")
    p.add_argument("source")
    p.add_argument("reference")
    p.add_argument("--t", type=float, default=1.0)
    p.add_argument("--ref-t", type=float, default=6.0)
    p.add_argument("-o", "--out", default="grades/compare.png")
    p.set_defaults(fn=cmd_compare)
    p = sub.add_parser("resolve", help="install a LUT into DaVinci Resolve's LUT folder")
    p.add_argument("lut")
    p.add_argument("--dir", help="override the Resolve LUT folder")
    p.set_defaults(fn=cmd_resolve)
    a = ap.parse_args()
    need("ffmpeg")
    a.fn(a)


if __name__ == "__main__":
    main()
