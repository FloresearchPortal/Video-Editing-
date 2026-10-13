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
| **FloStocks explainer reel** (PSX / KSE-100 / investing topic from a Roman-Urdu VO, "like the PSX video") | **`/flostocks-explainer`** skill or the `flostocks-explainer` agent (`.claude/agents/`) — house kit `motion/templates/flostocks-explainer/`, tools `tools/flostocks/` (scaffold, transcribe, overlap audit, bed, mix, finish); reference `motion/projects/what-is-psx/` |
| motion graphics: animated titles, lower thirds, stat/stock-ticker cards, logo stings, end cards, graphic/shader transitions, kinetic type, charts, maths animation, SFX for graphics — FloStocks brand by default | **`/motion-editor`** (HyperFrames, Apache-2.0, free for everyone; workspace `motion/`; places graphics on reels via the timeline's `"overlays"`) — it routes to the vendored HyperFrames, iart.ai, Manim and gl-transitions skills (refresh: `scripts/install-motion-skills.sh`) |
| existing Remotion shots, fake screencasts | `/make-tsx`, `/fake-screencast`, `/vidtsx-2d-generator`, `/remotion-*` (install: `scripts/install-remotion-skills.sh`) — Remotion is free only for individuals / ≤3-person companies |
| channel brand (fonts, colours) for the Remotion shots | `/brand-setup` |

## Layout
```
reelkit/        free editing pipeline: transcribe, assemble (tracking/zoom/transitions/grade),
                captions (kinetic, behind-subject), overlay (motion graphics), music (ducking,
                loudnorm), sfx_gen, review, make_reel
motion/         HyperFrames workspace: templates/ (house + FloStocks overlays), brands/ (tokens,
                OFL fonts), projects/ (per-video motion work); renders/ is gitignored
assets/fonts/   Poppins (SIL OFL) — caption typography
models/         MediaPipe models, auto-downloaded on first use (gitignored)
tools/          cut pipeline tools (clean-cut, clean-audio, mixing, YouTube upload); tools/flostocks/ = explainer-reel pipeline
remotion/       Remotion project for the imported long-form pipeline (optional, licence above)
media/library/  reusable assets (logos, sfx, psx/ = PSX logo + market snapshot); add only free-licensed files and record the licence
videos/         per-video projects (raw footage is gitignored)
```

## Conventions
- Run Python as `.venv/bin/python -m reelkit.<tool>` from the repo root.
- Iterate with `--preview`, check `python -m reelkit.review <video>` contact sheets by eye before
  saying an edit is done.
- Footage and renders never go in git (see `.gitignore`); timelines, transcripts and styles do.
- Every music/SFX file needs a known free licence, logged in the project's `edit/credits.txt`
  or the library catalog.
