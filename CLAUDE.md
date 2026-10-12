# CLAUDE.md — Video-Editing-

Short-form video editing workspace (Reels / TikTok / Shorts). **Free-first rule: use only free,
local tools. Never call a paid API (ElevenLabs, AssemblyAI, fal.ai, Gemini, Descript…) or
suggest a paid plan unless the user explicitly asks for it.** Setup and costs: `SETUP.md`.

## Which skill
| The user wants to… | Skill |
|---|---|
| edit a video / make a reel / "like the reference" — timeline, captions, zoom-ins, camera tracking, transitions, music | **`/reel-editor`** (default, 100% free: `reelkit/`) |
| cut long raw talking-head footage, remove fillers, cut-editor UI | `/clean-cut` (local Whisper, free) |
| conversational multi-take editing, colour grade, burned subtitles | `/video-use` (use its *free mode* note) |
| colour grade like the reference / make a LUT / DaVinci Resolve | **`/davinci-resolve-grade`** (`reelkit.grade_match`; Resolve free gets a .cube — Resolve automation needs paid Studio, don't use it) |
| denoise / clean the voice | `/clean-audio` (RNNoise, free) |
| add / build sound effects | `/suggest-sfx` + `python -m reelkit.sfx_gen` |
| custom motion graphics, animated title cards, fake screencasts | `/make-tsx`, `/fake-screencast`, `/vidtsx-2d-generator`, `/remotion-*` (install: `scripts/install-remotion-skills.sh`) — Remotion is free only for individuals / ≤3-person companies |
| channel brand (fonts, colours) for the Remotion shots | `/brand-setup` |

## Layout
```
reelkit/        free editing pipeline: transcribe, assemble (tracking/zoom/transitions/grade),
                captions (kinetic, behind-subject), music (ducking, loudnorm), sfx_gen, review, make_reel
assets/fonts/   Poppins (SIL OFL) — caption typography
models/         MediaPipe models, auto-downloaded on first use (gitignored)
tools/          cut pipeline tools (clean-cut, clean-audio, mixing, YouTube upload)
remotion/       Remotion project for motion-graphics shots (optional, licence above)
media/library/  reusable assets (logos, sfx); add only free-licensed files and record the licence
videos/         per-video projects (raw footage is gitignored)
```

## Conventions
- Run Python as `.venv/bin/python -m reelkit.<tool>` from the repo root.
- Iterate with `--preview`, check `python -m reelkit.review <video>` contact sheets by eye before
  saying an edit is done.
- Footage and renders never go in git (see `.gitignore`); timelines, transcripts and styles do.
- Every music/SFX file needs a known free licence, logged in the project's `edit/credits.txt`
  or the library catalog.
