# CLAUDE.md — Video-Editing-

Short-form video editing workspace (Reels / TikTok / Shorts). **Free-first rule: use only free,
local tools. Never call a paid API (ElevenLabs, AssemblyAI, fal.ai, Gemini, Descript…) or
suggest a paid plan unless the user explicitly asks for it.** Setup and costs: `SETUP.md`.

**Delivery rule: every finished video goes through `/quality-gate` (`python -m reelkit.refine`)
before the user gets it.** Only `edit/final_approved.mp4` is "done"; otherwise deliver
`final_review.mp4` with the open items.

**Brand: FloStocks by Floret Capitals** (flostocks.com). Kit in `brand/brand.json` + `brand/README.md`.
Use `"brand": true` in every timeline (brand captions, logo watermark, brand checks) and end
on the branded end card. Finance content: never promise returns; keep the market-risk disclaimer.

## Which skill
| The user wants to… | Skill |
|---|---|
| edit a video / make a reel / "like the reference" — timeline, captions, zoom-ins, camera tracking, transitions, music | **`/reel-editor`** (default, 100% free: `reelkit/`) |
| test / QA / polish / "is it ready" — and ALWAYS before handing over a final MP4 | **`/quality-gate`** (`reelkit.refine`: test → auto-fix → re-render → deliver) |
| cut long raw talking-head footage, remove fillers, cut-editor UI | `/clean-cut` (local Whisper, free) |
| conversational multi-take editing, colour grade, burned subtitles | `/video-use` (use its *free mode* note) |
| colour grade like the reference / make a LUT / DaVinci Resolve | **`/davinci-resolve-grade`** (`reelkit.grade_match`; Resolve free gets a .cube — Resolve automation needs paid Studio, don't use it) |
| denoise / clean the voice | `/clean-audio` (RNNoise, free) |
| add / build sound effects | `/suggest-sfx` + `python -m reelkit.sfx_gen` |
| custom motion graphics, animated title cards, fake screencasts | `/make-tsx`, `/fake-screencast`, `/vidtsx-2d-generator`, `/remotion-*` (install: `scripts/install-remotion-skills.sh`) — Remotion is free only for individuals / ≤3-person companies |
| channel brand (fonts, colours) for the Remotion shots | `/brand-setup` — seed it from `brand/brand.json` (FloStocks), don't re-interview |

## Layout
```
reelkit/        free editing pipeline: transcribe, assemble (tracking/zoom/transitions/grade),
                captions (kinetic, behind-subject), music (ducking, loudnorm), sfx_gen, review, make_reel
brand/          FloStocks brand kit: brand.json, logos (light/dark), end card
assets/fonts/   Poppins + Manrope + Inter + IBM Plex Mono (SIL OFL) — caption/brand typography
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
- Per-video creative briefs live in `videos/<name>/BRIEF.md` (client keywords, story, motion rules) — read it before touching that video.
- Every music/SFX file needs a known free licence, logged in the project's `edit/credits.txt`
  or the library catalog.
