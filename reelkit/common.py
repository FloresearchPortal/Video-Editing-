"""Shared helpers for reelkit: paths, ffmpeg frame I/O, easing, subject segmentation."""
from __future__ import annotations

import json
import math
import os
import shutil
import subprocess
from pathlib import Path

import numpy as np

os.environ.setdefault("GLOG_minloglevel", "2")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "2")

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "assets" / "fonts"
MODELS = ROOT / "models"

MODEL_URLS = {
    "selfie_segmenter.tflite": "https://storage.googleapis.com/mediapipe-models/image_segmenter/"
                               "selfie_segmenter/float16/latest/selfie_segmenter.tflite",
    "blaze_face_short_range.tflite": "https://storage.googleapis.com/mediapipe-models/face_detector/"
                                     "blaze_face_short_range/float16/latest/blaze_face_short_range.tflite",
}


def need(tool: str) -> None:
    if not shutil.which(tool):
        raise SystemExit(f"{tool} not found on PATH — install it (free): see SETUP.md")


def model_path(name: str) -> Path:
    """Return a local MediaPipe model, downloading it once (free, Apache-2.0)."""
    p = MODELS / name
    if not p.exists():
        import urllib.request
        MODELS.mkdir(parents=True, exist_ok=True)
        print(f"downloading {name} …")
        urllib.request.urlretrieve(MODEL_URLS[name], p)
    return p


def load_json(p: str | Path):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def save_json(p: str | Path, data) -> None:
    Path(p).parent.mkdir(parents=True, exist_ok=True)
    Path(p).write_text(json.dumps(data, indent=2), encoding="utf-8")


# ── easing ────────────────────────────────────────────────────────────────
def ease_in_out(t: float) -> float:
    t = min(max(t, 0.0), 1.0)
    return 4 * t * t * t if t < 0.5 else 1 - (-2 * t + 2) ** 3 / 2


def ease_out(t: float) -> float:
    t = min(max(t, 0.0), 1.0)
    return 1 - (1 - t) ** 3


def keyframes_at(kfs: list, t: float) -> float:
    """kfs = [[time, value, ("ease"|"step"|"linear")?], ...] sorted by time."""
    if not kfs:
        return 1.0
    if t <= kfs[0][0]:
        return float(kfs[0][1])
    for a, b in zip(kfs, kfs[1:]):
        if a[0] <= t <= b[0]:
            mode = b[2] if len(b) > 2 else "ease"
            if mode == "step":
                return float(b[1]) if t >= b[0] else float(a[1])
            span = max(b[0] - a[0], 1e-6)
            u = (t - a[0]) / span
            u = u if mode == "linear" else ease_in_out(u)
            return a[1] + (b[1] - a[1]) * u
    return float(kfs[-1][1])


# ── ffmpeg frame I/O ──────────────────────────────────────────────────────
def probe(path: str | Path) -> dict:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-print_format", "json", "-show_format", "-show_streams", str(path)],
        capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def has_audio(path: str | Path) -> bool:
    return any(s.get("codec_type") == "audio" for s in probe(path)["streams"])


def duration(path: str | Path) -> float:
    return float(probe(path)["format"]["duration"])


IMAGE_EXT = {".png", ".jpg", ".jpeg", ".webp", ".bmp"}


def is_image(path: str | Path) -> bool:
    return Path(path).suffix.lower() in IMAGE_EXT


class FrameReader:
    """Decode a time range of a video (auto-rotated, resampled to fps) as BGR uint8 frames."""

    def __init__(self, src, start: float, dur: float, fps: float, max_h: int = 2160):
        vf = f"fps={fps},scale=-2:'min(ih,{max_h})':flags=lanczos"
        first = subprocess.run(
            ["ffmpeg", "-v", "error", "-ss", f"{start:.3f}", "-i", str(src), "-frames:v", "1",
             "-vf", vf, "-f", "image2pipe", "-vcodec", "png", "-"],
            capture_output=True, check=True).stdout
        import cv2
        img = cv2.imdecode(np.frombuffer(first, np.uint8), cv2.IMREAD_COLOR)
        self.h, self.w = img.shape[:2]
        self.proc = subprocess.Popen(
            ["ffmpeg", "-v", "error", "-ss", f"{start:.3f}", "-i", str(src), "-t", f"{dur:.3f}",
             "-vf", vf, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
            stdout=subprocess.PIPE)
        self.size = self.w * self.h * 3
        self.last = img

    def read(self):
        buf = self.proc.stdout.read(self.size)
        if len(buf) < self.size:
            return self.last  # pad the tail with the last frame (keeps A/V frame-exact)
        self.last = np.frombuffer(buf, np.uint8).reshape(self.h, self.w, 3)
        return self.last

    def close(self):
        if self.proc.poll() is None:
            self.proc.kill()  # stopping early is normal (e.g. grabbing one frame) — no broken-pipe noise
        self.proc.stdout.close()
        self.proc.wait()


class FrameWriter:
    """Encode BGR frames to H.264 (libx264, free) with an optional ffmpeg -vf chain."""

    def __init__(self, path, w: int, h: int, fps: float, vf: str | None = None, crf: int = 18):
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        cmd = ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24",
               "-s", f"{w}x{h}", "-r", str(fps), "-i", "-"]
        if vf:
            cmd += ["-vf", vf]
        cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", str(crf), "-pix_fmt", "yuv420p",
                "-movflags", "+faststart", str(path)]
        self.proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    def write(self, frame: np.ndarray):
        self.proc.stdin.write(np.ascontiguousarray(frame, dtype=np.uint8).tobytes())

    def close(self):
        self.proc.stdin.close()
        if self.proc.wait() != 0:
            raise RuntimeError("ffmpeg encode failed")


def mux(video, audio, out) -> None:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(video), "-i", str(audio),
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
                    "-shortest", str(out)], check=True)


# ── subject segmentation / face detection (MediaPipe, free) ────────────────
class Subject:
    """Person mask + face box per frame. Masks are float32 HxW in [0,1]."""

    def __init__(self, faces: bool = True):
        from mediapipe.tasks.python import BaseOptions, vision
        self._mp = __import__("mediapipe")
        self.seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(
            base_options=BaseOptions(model_asset_path=str(model_path("selfie_segmenter.tflite"))),
            output_confidence_masks=True, output_category_mask=False))
        self.face = None
        if faces:
            self.face = vision.FaceDetector.create_from_options(vision.FaceDetectorOptions(
                base_options=BaseOptions(model_asset_path=str(model_path("blaze_face_short_range.tflite"))),
                min_detection_confidence=0.5))

    def close(self):
        for task in (self.seg, self.face):
            if task is not None:
                try:
                    task.close()
                except Exception:
                    pass
        self.seg = self.face = None

    def _img(self, bgr):
        import cv2
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        return self._mp.Image(image_format=self._mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb))

    def mask(self, bgr, work: int = 512) -> np.ndarray:
        import cv2
        h, w = bgr.shape[:2]
        s = work / max(h, w)
        small = cv2.resize(bgr, (max(1, int(w * s)), max(1, int(h * s))), interpolation=cv2.INTER_AREA)
        m = self.seg.segment(self._img(small)).confidence_masks[0].numpy_view().astype(np.float32)
        m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
        return np.clip((m - 0.35) / 0.3, 0, 1)  # harden edges a little, keep feather

    def face_box(self, bgr):
        """Largest face as (cx, cy, w, h) in pixels, or None."""
        if self.face is None:
            return None
        import cv2
        h, w = bgr.shape[:2]
        s = 640 / max(h, w)
        small = cv2.resize(bgr, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA) if s < 1 else bgr
        s = min(s, 1.0)
        dets = self.face.detect(self._img(small)).detections
        if not dets:
            return None
        b = max(dets, key=lambda d: d.bounding_box.width * d.bounding_box.height).bounding_box
        return ((b.origin_x + b.width / 2) / s, (b.origin_y + b.height / 2) / s, b.width / s, b.height / s)

    def locate(self, bgr) -> dict | None:
        """Subject anchor: head centre + body box. Face if visible, else from the person mask."""
        m = self.mask(bgr, work=256)
        ys, xs = np.nonzero(m > 0.5)
        if len(xs) < 50:
            fb = self.face_box(bgr)
            if not fb:
                return None
            return {"hx": fb[0], "hy": fb[1], "head": fb[3], "top": fb[1] - fb[3], "bottom": bgr.shape[0]}
        top, bottom = ys.min(), ys.max()
        band = ys < top + 0.15 * (bottom - top)  # the head region of the silhouette
        hx, hy = float(xs[band].mean()), float(top + 0.07 * (bottom - top))
        head = 0.14 * (bottom - top)
        fb = self.face_box(bgr)
        if fb and abs(fb[0] - hx) < 0.25 * bgr.shape[1]:
            hx, hy, head = fb[0], fb[1], fb[3]
        return {"hx": hx, "hy": hy, "head": float(head), "top": float(top), "bottom": float(bottom)}


def smooth(values: list[float], strength: float) -> list[float]:
    """Forward-backward exponential smoothing — a calm 'camera operator' follow."""
    if not values:
        return values
    a = 1.0 / max(strength, 1.0)
    fwd = [values[0]]
    for v in values[1:]:
        fwd.append(fwd[-1] + a * (v - fwd[-1]))
    bwd = [fwd[-1]]
    for v in reversed(fwd[:-1]):
        bwd.append(bwd[-1] + a * (v - bwd[-1]))
    return list(reversed(bwd))


def lerp_series(samples: list[tuple[float, float]], t: float) -> float:
    if t <= samples[0][0]:
        return samples[0][1]
    for (t0, v0), (t1, v1) in zip(samples, samples[1:]):
        if t0 <= t <= t1:
            return v0 + (v1 - v0) * (t - t0) / max(t1 - t0, 1e-6)
    return samples[-1][1]


__all__ = [n for n in dir() if not n.startswith("_")] + ["math"]
