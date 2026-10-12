---
name: reel-editor
description: Full short-form video editor (Reels / TikTok / Shorts, 9:16) that runs 100% free and local — builds the timeline from raw talking-head clips, cuts dead air and fillers, subject-tracked vertical reframe ("camera tracking"), punch-in / push-in zooms, zoom-blur / whip / light-leak transitions, teal-orange grade, kinetic word-by-word captions in the stacked mixed-weight style with keywords tucked BEHIND the speaker, background music with voice ducking, synthesized transition SFX, and outro cards. Use whenever the user wants to edit a video, make a reel/short, set a timeline, caption a video, add zoom-ins, add background music, add transitions, or "edit it like the reference". Default editor for this repo; reach for Remotion skills only for custom motion graphics.
---

# reel-editor — free, local, full-scale editing

Everything here is free: **ffmpeg** (LGPL/GPL), **faster-whisper** (MIT) for word-level
transcripts, **MediaPipe** (Apache-2.0) for person segmentation + face tracking, **OpenCV**,
**Pillow**, **Poppins** (SIL OFL) in `assets/fonts/`. No API keys, no per-minute fees.
Never reach for a paid service (ElevenLabs, AssemblyAI, fal.ai, Descript, Gemini…) unless the
user explicitly asks for it.

Code lives in `reelkit/` (run from the repo root with `.venv/bin/python -m reelkit.<tool>`).
Setup: `SETUP.md`. Style reference this skill is tuned to: see **House style** below.

## Pipeline

```
raw clips ──transcribe──► pick takes / write timeline.json ──assemble──► edit/stage1.mp4
          ──transcribe stage1──► kinetic captions ──► edit/stage2_captions.mp4
          ──music + sfx + loudnorm──► edit/final.mp4
```
One command runs it all: `python -m reelkit.make_reel path/to/timeline.json [--preview]`
(`--from transcribe|captions|music` re-runs only the later stages after a tweak).

### 1. Ingest + transcribe the raw clips
```
python -m reelkit.transcribe raw/clip1.mp4 -o edit/transcripts/clip1.json [--keyterms terms.txt]
```
Word-level JSON in seconds (`words[].type=="word"` entries have `text,start,end`). Fillers are
kept on purpose so you can cut them. Default model `small` (CPU-friendly); `medium` /
`large-v3` for hard audio. Read the transcripts — they are the edit decision source.

### 2. Write the timeline (this is "setting the timeline")
Choose the best takes, cut fillers ("um", "uh", restarts) and dead air (> ~0.3 s inside a
sentence), keep breaths short. Each kept span becomes a clip. Pace for short-form: a new
clip, zoom change or transition every **2–4 s**. Put a hook in the first 2 s.

```json
{
  "output": {"width": 1080, "height": 1920, "fps": 30},
  "grade": "teal_orange",
  "clips": [
    {"src": "raw/a.mp4", "in": 0.32, "out": 3.10, "zoom": "push"},
    {"src": "raw/a.mp4", "in": 3.55, "out": 6.20, "zoom": 1.3,
     "transition": {"type": "zoom_blur", "dur": 0.3}},
    {"src": "raw/b.mp4", "in": 1.00, "out": 4.80, "zoom": "punch",
     "transition": {"type": "whip", "dur": 0.3}},
    {"src": "raw/c.mp4", "in": 0.50, "out": 3.90,
     "zoom": [[0, 1.0], [1.4, 1.25, "step"], [3.0, 1.35, "linear"]],
     "transition": {"type": "flash", "dur": 0.4}},
    {"src": "assets/outro.png", "dur": 2.0, "zoom": "pull",
     "transition": {"type": "dip", "dur": 0.3}}
  ],
  "captions": {"model": "small", "language": "en", "emphasis": ["deal", "offended"]},
  "music": {"src": "music/bed.mp3", "volume": 0.22, "duck": true},
  "sfx": [{"t": 3.1, "src": "media/library/sfx/generated/whoosh.wav", "gain": 0.5}]
}
```
Paths are relative to the timeline file (absolute paths also work).

**Clip keys**: `src` (video or image), `in`/`out` seconds (video) or `dur` (image),
`zoom` — number, `"push"` (slow 1.0→1.12), `"pull"`, `"punch"` (hard cut-in to 1.3× at the
midpoint), or keyframes `[[t, scale, "ease"|"linear"|"step"], …]` relative to clip start;
`track` (default true) — follow the speaker; `head_y` (default 0.36) — where the head sits
vertically in frame; `offset_x` — shift framing (fraction of frame width, ±);
`volume`, `mute`.
**Transitions** (into this clip): `cut` (default), `zoom_blur`, `whip`, `flash` (warm light
leak), `dip` (to black). They straddle the cut without overlapping, so audio stays in sync.
**Grades**: best = `"lut:grades/<camera>_look.cube+vignette"` — a LUT matched to the reference with
`/davinci-resolve-grade` (`reelkit.grade_match`). Quick presets: `teal_orange`, `moody`, `clean`, `none`,
or any raw ffmpeg `-vf` chain.

### 3. Camera tracking + zooms (what `assemble` does)
For each clip the speaker is located every 3 frames (person mask + face), the path is smoothed
forward-backward like a calm camera operator, and the 9:16 window follows it — so landscape
or loosely framed footage becomes a centred vertical shot. Zoom keyframes scale that window.
Use **punch-ins on the emphasis word** of a sentence (put a `step` keyframe at that word's
time minus ~0.05 s) and slow pushes on calm lines. Don't stack more than ~1.35× on 1080p
sources (softness); 4K sources can go to ~1.8×.

### 4. Captions (house style, `reelkit/captions.py`)
Runs on the *assembled* video, so the transcript is re-made on stage1 for frame-exact timing.
- lowercase words appear **one by one on their spoken time** with a quick blur/scale/fade-in;
- phrases of ≤5 words (break on pauses > 0.45 s and punctuation) stack into a tight block:
  **keyword** = big ExtraBold Italic, accent colour on every 2nd phrase (coral / teal /
  yellow), **content words** = Bold white, **connector words** = ExtraLight, small;
- blocks rotate between: around the crown of the head (keyword tucked **behind** the
  speaker via segmentation — only if ≥65% of it stays visible), the chest (in front), and
  the upper third; close-ups never get type across the face;
- override per video in `"captions"`: `emphasis` (force keywords), `colors.accents`,
  `size`, `fonts`, `behind_subject`, `max_words`, `max_gap`, `accent_every`, `lowercase`.
Check spelling of names/brands in the transcript before the captions pass (edit the words
JSON directly, then `--from captions`).

### 5. Music + SFX (`reelkit/music.py`)
Music is looped/trimmed, faded, **sidechain-ducked under the voice**, then the mix is
loudness-normalised to **-14 LUFS / -1 dBTP** (Reels/TikTok/Shorts). Default bed level 0.22.
SFX: `python -m reelkit.sfx_gen` synthesises whoosh / swoosh_short / impact / riser / pop /
tick / shimmer into `media/library/sfx/generated/` — free and owned by you. Put a whoosh on
zoom-blur/whip transitions (t = cut time − 0.25 s), an impact on hard punch-ins.
**Music must be free to use** — only from sources in SETUP.md (YouTube Audio Library,
Pixabay Music, Free Music Archive CC0/CC-BY, Incompetech CC-BY). Record the source and
licence of every track in `edit/credits.txt`; add attribution to the post caption when CC-BY.

### 6. Review before calling it done
`python -m reelkit.review edit/final.mp4 --every 0.5` → contact sheet PNG. Look at it:
framing (head in frame, not cut off), captions readable and not on the face, transitions on
the cuts, nothing black/frozen. Also listen for clicks at cuts and music level vs voice.
Use `--preview` (half-res) while iterating; render full-res for delivery.

## House style (from the user's reference reel)
9:16 1080×1920 @30, ~45–60 s. Outdoor talking head, cuts every 2–4 s across locations,
wide ↔ medium ↔ close via punch-ins, subject always centred, zoom-blur/whip and light-leak
transitions, teal sky / warm skin grade with vignette (matched LUT: `/davinci-resolve-grade`), stacked kinetic captions with accent
keywords partly behind the head, outro: headshot + name card, then logo card.

## Gotchas
- MediaPipe needs `libEGL` on headless Linux (`apt install libegl1 libgles2`).
- First run downloads the Whisper model (~0.5 GB for small) and two tiny MediaPipe models
  into `models/`. After that everything works offline.
- Rendering is CPU-bound (~1–2× realtime at 1080×1920). Iterate with `--preview`.
- Variable-frame-rate phone footage is resampled to the timeline fps — that's expected.
