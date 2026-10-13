"""Final mix for a FloStocks explainer: silent HyperFrames render + VO + music bed + a sparse, quiet SFX bus.
Music and SFX are both sidechain-ducked under the voice (the client's rule: effects never cover a word);
the whole mix is loudness-normalised for Reels (-14 LUFS / -1 dBTP). Also writes a <30 MB share copy.

    .venv/bin/python tools/flostocks/mix.py <slug>

Inputs:  motion/projects/<slug>/renders/<slug>-video.mp4, videos/<slug>/raw/vo.*, videos/<slug>/music/bed.wav,
         videos/<slug>/edit/cues.json  ([[time_s, sfx_name, gain], ...]; gains 0.10–0.22, only big visual hits)
Outputs: videos/<slug>/output/<slug>-final.mp4 (master) and FloStocks-<Slug>.mp4 (two-pass x264, ~28 MB)
"""
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
GEN = ROOT / "media/library/sfx/generated"


def run(cmd): subprocess.run(cmd, check=True)


def main():
    slug = sys.argv[1]
    V = ROOT / "videos" / slug
    video = ROOT / "motion/projects" / slug / "renders" / f"{slug}-video.mp4"
    vo = next(V.glob("raw/vo.*")); bed = V / "music/bed.wav"
    out = V / "output" / f"{slug}-final.mp4"; out.parent.mkdir(parents=True, exist_ok=True)
    cues = json.loads((V / "edit/cues.json").read_text()) if (V / "edit/cues.json").exists() else []
    lib = {p.stem: p for p in GEN.glob("*.wav")}
    lib.update({p.stem: p for p in (V / "music").glob("*.wav") if p.stem != "bed"})
    dur = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)]).strip())
    inputs = ["-i", str(video), "-i", str(vo), "-i", str(bed)]
    parts = [f"[1:a]aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:{dur:.3f},asplit=3[vo][sc1][sc2]",
             f"[2:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.26,atrim=0:{dur:.3f},afade=t=out:st={dur - 3:.3f}:d=3[bed]",
             "[bed][sc1]sidechaincompress=threshold=0.025:ratio=8:attack=25:release=450:makeup=1[mus]"]
    labels = []
    for k, (t, name, g) in enumerate(cues):
        if name not in lib: sys.exit(f"unknown sfx '{name}' — have: {', '.join(sorted(lib))}")
        inputs += ["-i", str(lib[name])]; ms = int(t * 1000)
        parts.append(f"[{3 + k}:a]aresample=48000,aformat=channel_layouts=stereo,volume={min(g, 0.25)},adelay={ms}|{ms}[s{k}]")
        labels.append(f"[s{k}]")
    if labels:
        parts.append(f"{''.join(labels)}amix=inputs={len(labels)}:normalize=0,apad,atrim=0:{dur:.3f},highpass=f=120,lowpass=f=9000[sfxraw]")
        parts.append("[sfxraw][sc2]sidechaincompress=threshold=0.02:ratio=5:attack=8:release=250:makeup=1[sfx]")
        parts.append("[vo][mus][sfx]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[out]")
    else:
        parts.append("[sc2]anullsink;[vo][mus]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1.0:LRA=11,aresample=48000[out]")
    run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(parts), "-map", "0:v", "-map", "[out]",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-t", f"{dur:.3f}", str(out)])
    r = subprocess.run(["ffmpeg", "-nostats", "-i", str(out), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    summ = r[r.rfind("Summary:"):]
    I = next(l for l in summ.splitlines() if l.strip().startswith("I:")).split()[1]
    print(f"master: {out.relative_to(ROOT)}  ({out.stat().st_size / 1e6:.1f} MB, {I} LUFS)")
    # share copy under the 30 MB upload limit: two-pass x264 sized to ~27 MB total
    share = out.parent / ("FloStocks-" + "-".join(w.capitalize() if w != "psx" else "PSX" for w in slug.split("-")) + ".mp4")
    if out.stat().st_size < 28e6:                       # already small enough to send as-is
        share.write_bytes(out.read_bytes()); print(f"share:  {share.relative_to(ROOT)}  (copy of master)"); return
    vbr = max(800, int((27e6 * 8 / dur - 256e3) / 1000))
    with tempfile.TemporaryDirectory() as td:
        log = str(Path(td) / "x264")
        run(["ffmpeg", "-v", "error", "-y", "-i", str(out), "-c:v", "libx264", "-preset", "slow", "-b:v", f"{vbr}k", "-pass", "1", "-passlogfile", log, "-an", "-f", "null", "/dev/null"])
        run(["ffmpeg", "-v", "error", "-y", "-i", str(out), "-c:v", "libx264", "-preset", "slow", "-b:v", f"{vbr}k", "-pass", "2", "-passlogfile", log,
             "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", str(share)])
    print(f"share:  {share.relative_to(ROOT)}  ({share.stat().st_size / 1e6:.1f} MB)")


if __name__ == "__main__":
    main()
