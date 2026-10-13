"""Word-level VO transcript for a FloStocks explainer (local faster-whisper, free).

    .venv/bin/python tools/flostocks/transcribe_vo.py <slug> [--model medium] [--language ur]

Writes videos/<slug>/edit/vo.words.json  ([{"w","s","e"}], seconds) and prints the VO as timed lines —
every cue in scenes.js comes from these times. Roman-Urdu VO: save the client script as videos/<slug>/script.txt first — it primes Latin
spelling. Whisper still spells loosely; match cue words by sound.
"""
import argparse, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from reelkit.transcribe import transcribe_words  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("slug"); ap.add_argument("--model", default="medium"); ap.add_argument("--language", help="leave unset for Roman-Urdu VO (the script primes Latin spelling); en would TRANSLATE")
    ap.add_argument("--script", help="script text used to prime Roman-Urdu spelling (default videos/<slug>/script.txt)")
    a = ap.parse_args()
    raw = ROOT / "videos" / a.slug / "raw"
    vo = next((p for p in raw.glob("vo.*")), None)
    if not vo: sys.exit(f"no vo.* in {raw}")
    sp = Path(a.script) if a.script else ROOT / "videos" / a.slug / "script.txt"
    # priming with the Roman-Urdu script keeps Whisper in Latin script (unprimed it drifts to Devanagari/Urdu)
    terms = sp.read_text().split()[:60] if sp.exists() else None
    if not terms: print("! no script.txt — save the client's Roman-Urdu script there first for Latin-script output")
    words, _lang = transcribe_words(vo, model=a.model, language=a.language, keyterms=terms)
    out = [{"w": w["text"].strip().strip(","), "s": round(w["start"], 2), "e": round(w["end"], 2)} for w in words if w.get("text", "").strip().strip(",")]
    dst = ROOT / "videos" / a.slug / "edit" / "vo.words.json"
    dst.write_text(json.dumps(out, ensure_ascii=False, indent=0))
    line, t0 = [], None
    for w in out:
        t0 = w["s"] if t0 is None else t0
        line.append(f'{w["w"]}')
        if len(line) >= 8 or w["w"].endswith((".", "?", "!")):
            print(f"{t0:7.2f}  " + " ".join(f"{x}" for x in line)); line, t0 = [], None
    if line: print(f"{t0:7.2f}  " + " ".join(line))
    print(f"\n{len(out)} words → {dst.relative_to(ROOT)}  (VO ends {out[-1]['e']:.2f}s)")


if __name__ == "__main__":
    main()
