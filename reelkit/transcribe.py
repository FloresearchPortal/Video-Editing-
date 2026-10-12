"""Free, local, word-level transcription with faster-whisper (MIT). No API key, no per-minute cost.

    python -m reelkit.transcribe <video|audio> [-o out.json] [--model small] [--language en]
                                 [--keyterms terms.txt] [--format scribe|assemblyai] [--srt out.srt]

Output formats (both drop-in for the other skills in this repo):
  scribe      {"words":[{"type":"word"|"spacing","text","start","end","speaker_id"}]}  seconds
              — the ElevenLabs Scribe shape that video-use's helpers read.
  assemblyai  {"status":"completed","text","words":[{"text","start","end","confidence","speaker"}]}  ms
              — the shape tools/transcribe.py writes for /clean-cut.

The first run downloads the model once (~0.5 GB for "small") into the Hugging Face cache.
Models: tiny / base / small (default, good on CPU) / medium / large-v3 (best, slow on CPU).
"""
from __future__ import annotations

import argparse
import subprocess
from pathlib import Path

from .common import save_json

# Whisper tends to drop disfluencies; a prompt written with fillers nudges it to keep them
# (cut decisions need to SEE "um", "uh", false starts).
FILLER_PROMPT = "Umm, so, uh, I was like, you know, hmm... Okay. Let me, uh, let me think."


def load_audio(src: Path):
    """16 kHz mono float32 samples via ffmpeg (sidesteps PyAV version clashes)."""
    import numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(src), "-vn", "-ac", "1", "-ar", "16000",
                          "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def transcribe_words(src: str | Path, model: str = "small", language: str | None = None,
                     keyterms: list[str] | None = None, keep_fillers: bool = True) -> tuple[list[dict], str]:
    """Return ([{text, start, end, confidence}] in seconds, language)."""
    from faster_whisper import WhisperModel

    audio = load_audio(Path(src))
    prompt = FILLER_PROMPT if keep_fillers else ""
    if keyterms:
        prompt = (prompt + " Terms: " + ", ".join(keyterms[:60]) + ".").strip()
    wm = WhisperModel(model, device="auto", compute_type="int8")
    segments, info = wm.transcribe(audio, language=language, word_timestamps=True,
                                   initial_prompt=prompt or None, vad_filter=False,
                                   condition_on_previous_text=False)
    words = []
    for seg in segments:
        for w in seg.words or []:
            text = w.word.strip()
            if text:
                words.append({"text": text, "start": round(w.start, 3), "end": round(w.end, 3),
                              "confidence": round(w.probability, 3)})
    return words, info.language


def to_scribe(words: list[dict], language: str) -> dict:
    out = []
    for i, w in enumerate(words):
        if i:
            gap_s = words[i - 1]["end"]
            out.append({"type": "spacing", "text": " ", "start": gap_s, "end": w["start"],
                        "speaker_id": "speaker_0"})
        out.append({"type": "word", "text": w["text"], "start": w["start"], "end": w["end"],
                    "speaker_id": "speaker_0", "logprob": w["confidence"]})
    return {"language_code": language, "text": " ".join(w["text"] for w in words), "words": out,
            "engine": "faster-whisper (local)"}


def to_assemblyai(words: list[dict], language: str) -> dict:
    return {"status": "completed", "language_code": language, "speech_model": "faster-whisper-local",
            "text": " ".join(w["text"] for w in words),
            "words": [{"text": w["text"], "start": int(w["start"] * 1000), "end": int(w["end"] * 1000),
                       "confidence": w["confidence"], "speaker": "A"} for w in words]}


def to_srt(words: list[dict], max_words: int = 4) -> str:
    def ts(t):
        h, rem = divmod(t, 3600)
        m, s = divmod(rem, 60)
        return f"{int(h):02}:{int(m):02}:{int(s):02},{int((s % 1) * 1000):03}"
    lines, i, n = [], 0, 1
    while i < len(words):
        chunk = words[i:i + max_words]
        lines += [str(n), f"{ts(chunk[0]['start'])} --> {ts(chunk[-1]['end'])}",
                  " ".join(w["text"] for w in chunk), ""]
        i += max_words
        n += 1
    return "\n".join(lines)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("src")
    ap.add_argument("-o", "--out")
    ap.add_argument("--model", default="small")
    ap.add_argument("--language")
    ap.add_argument("--keyterms", help="text file, one term per line (# comments ok)")
    ap.add_argument("--format", choices=["scribe", "assemblyai"], default="scribe")
    ap.add_argument("--srt", help="also write a plain SRT here")
    ap.add_argument("--no-fillers", action="store_true", help="let Whisper clean up disfluencies")
    a = ap.parse_args()

    terms = []
    if a.keyterms and Path(a.keyterms).exists():
        terms = [ln.strip() for ln in Path(a.keyterms).read_text().splitlines()
                 if ln.strip() and not ln.startswith("#")]
    words, lang = transcribe_words(a.src, a.model, a.language, terms, keep_fillers=not a.no_fillers)
    out = Path(a.out or Path(a.src).with_suffix(".words.json"))
    save_json(out, to_scribe(words, lang) if a.format == "scribe" else to_assemblyai(words, lang))
    if a.srt:
        Path(a.srt).write_text(to_srt(words), encoding="utf-8")
    print(f"{out}: {len(words)} words, language={lang}")


if __name__ == "__main__":
    main()
