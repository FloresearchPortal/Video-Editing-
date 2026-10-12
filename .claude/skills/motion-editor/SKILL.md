---
name: motion-editor
description: Motion-graphics editor for this repo, 100% free and local — designs, builds, renders and places animated graphics on reels and videos: kinetic titles and hooks, lower thirds / name straps, stat and stock-ticker cards, logo stings, end cards / CTAs, animated charts and diagrams, maths animation, graphic and shader transitions (wipes, glitch, spin, 125 GLSL gl-transitions), plus the sound that goes with them (synthesized SFX, Web Audio scores, free music, ducking). Use whenever the user wants motion graphics, animation, an animated overlay, a title card, a lower third, a logo animation, a transition, kinetic typography, "make it look like an After Effects edit", on-brand FloStocks graphics, or sound design for graphics. Orchestrates HyperFrames (default engine, Apache-2.0), the iart.ai craft skills, Manim and gl-transitions, and composites onto reels through reelkit. Raw talking-head cutting stays with /reel-editor.
---

# motion-editor — the free motion-graphics department

You are the motion designer on this repo. You turn a brief (or a reel's transcript) into
designed, timed, rendered graphics, give them sound, and land them on the edit. Everything is
free and local: **HyperFrames** (Apache-2.0, HTML + GSAP → video, free for everyone) is the
default engine, **reelkit** composites onto reels, **ffmpeg** mixes. Never call a paid
generator (ElevenLabs, Suno, OpenRouter/Lyria, HeyGen cloud/TTS, fal.ai…) and never sign the
user up for anything unless they ask. Remotion is optional and licence-limited (free for
individuals and companies of ≤3 people only).

Setup once: `scripts/install-motion-skills.sh --tools` (skills are already vendored; `--tools`
installs the pinned HyperFrames CLI + its headless Chrome, playwright-core, gl-transitions, Manim).
Workspace: `motion/` — run HyperFrames as `npx hyperframes …` **from `motion/`** with
`HYPERFRAMES_SKIP_SKILLS=1` set (stops it touching the vendored skills).

## 1. Pick the engine

| The graphic is… | Build it with | Skill(s) to load |
|---|---|---|
| Overlay on a reel: title, strap, stat, ticker, CTA, wipe | a `motion/templates/*` template via the reel timeline's `"overlays"` (§3) | this skill only |
| A new/custom overlay or full-screen motion beat (≤ ~30 s) | HyperFrames project in `motion/projects/<video>/` | `/hyperframes-core`, `/hyperframes-animation`, `/hyperframes-keyframes`, `/motion-graphics` |
| A named look or effect (glitch, CRT, grain, confetti, chart, terminal, map) | search the registry before hand-building: `npx hyperframes catalog` / `add` | `/hyperframes-registry` |
| Designed cards over a whole talking-head video (16:9 or 9:16) | HyperFrames | `/talking-head-recut` |
| A full faceless explainer / multi-scene motion video | HyperFrames | `/faceless-explainer` or `/general-video` |
| Maths, graphs of functions, geometric proofs | Manim (`.venv/bin/manim -qh -t --format mov`, alpha) | `/manim` |
| Charts from data, bar-chart races, infographics, flow diagrams | HyperFrames (or SVG/D3 inside it) | `/chart-animation`, `/animated-infographic`, `/diagram-animation` |
| Zero-asset hand-drawn canvas film, transparent broadcast lower thirds | Chrome canvas + `render.mjs` (playwright-core in `motion/`) | `/javascript-animation`, `/lower-thirds` |
| A shader transition between two shots or slides | GLSL from `motion/gl-transitions/transitions/` (all 125; npm's `gl-transitions` has 67) inside a HyperFrames/WebGL shot | `/gl-transitions` |
| Cuts between real clips in a reel | reelkit transitions (§4) — no render engine needed | `/reel-editor` |
| Existing Remotion shots (`remotion/`) | keep them in Remotion | `/make-tsx`, `/vidtsx-2d-generator`, `remotion-*` |

Craft knowledge to pull in whenever you design (all tech-agnostic): `/motion-art-direction`
(motion language, restraint), `/animation-principles` (easing, timing, overshoot),
`/shot-composition` (grids, safe areas, 9:16 vs 16:9), `/kinetic-typography`, `/color-motion`,
`/motion-background`, `/logo-animation`, `/beat-sync-editing`. Sound: `/soundtrack`,
`/hyperframes-audio`, `/suggest-sfx` (§5).

## 2. Workflow (every job)

1. **Brief → beat list.** Read the script / transcript (`edit/stage1.words.json` for a reel,
   word times in seconds). Write `motion/projects/<video>/BEATS.md`: one line per graphic —
   start time = the word it illustrates, duration, template or "custom", text, brand, SFX.
   Sync to the words: a graphic appears on its word (−0.1 s), never before it is said.
2. **Brand.** Default brand is **FloStocks** (§6) unless the user names another; for the reel
   house style use the plain templates (Poppins + coral/teal/yellow).
3. **Template first.** Reuse `motion/templates/` via `--variables`. Build custom only for what no
   template covers; copy the closest template into `motion/projects/<video>/<shot>/` and edit.
   If it is reusable, promote it into `motion/templates/` with a `template.json`.
4. **Gate.** `npx hyperframes check <dir>` must pass (0 errors) before any render. Intentional
   masked reveals / translucent plates trip `text_occluded` / `container_overflow`: mark the
   element `data-layout-allow-occlusion` / `data-layout-allow-overflow`, don't redesign.
5. **Look before rendering long things:** `npx hyperframes snapshot <dir> --at 0.3,1.2,3` and
   open the PNGs (never add `--describe`: it calls the paid Gemini API).
6. **Render.** Overlays: `npx hyperframes render <dir> --format mov -o renders/<name>.mov`
   (ProRes 4444 with alpha). Full-screen beats: `--format mp4`. Drafts: `--quality draft`.
7. **Place it** (§3), **sound it** (§5), **review** the composite:
   `.venv/bin/python -m reelkit.review <final.mp4> --every 0.5` and look at every graphic frame
   (in, hold, out). Fix and re-render before calling it done.

## 3. Placing graphics on a reel (`timeline.json` → `"overlays"`)

`reelkit.make_reel` runs `assemble → transcribe → captions → overlays → music`. Overlays are
rendered on demand from templates (cached in `edit/overlays/` by content + variables) and
composited with alpha over the captioned video; their SFX are mixed in the music stage.

```json
"overlays": [
  {"template": "flostocks-logo-sting", "vars": {"tagline": "learn the PSX. free."}, "t": 0.0, "sfx": true},
  {"template": "flostocks-lower-third", "vars": {"name": "Sam Lee", "role": "Floret Capitals"}, "t": 1.4, "sfx": true},
  {"template": "flostocks-ticker", "vars": {"symbol": "KSE-100", "value": 118452.36, "change": 1.84}, "t": 6.2, "sfx": true},
  {"template": "flostocks-wipe", "cut": 12.6, "sfx": true},
  {"src": "motion/projects/reel-3/renders/chart.mov", "t": 15.0, "dur": 3.5},
  {"src": "motion/projects/reel-3/renders/badge.mov", "t": 20, "x": 700, "y": 160, "scale": 0.4}
]
```
- `template` = folder in `motion/templates/` (or a path to any HyperFrames project); `vars` →
  `--variables`. `src` = any pre-rendered file (MOV/WebM with alpha, or opaque MP4 for a
  cut-away). Paths are relative to the timeline.
- `t` = start in the reel (s). `cut` = place a transition so the frame is fully covered on that
  cut (uses the template's `anchor`). `dur` trims. No `x/y/scale` = full-frame fit; with them,
  coordinates are in 1080-wide design pixels.
- `"sfx": true` = the template's suggested sound (`template.json`); or
  `{"src": "...", "at": 0.25, "gain": 0.5}` relative to the overlay start.
- Re-run only what changed: `python -m reelkit.make_reel timeline.json --from overlays`.
- Not a reel? `python -m reelkit.overlay in.mp4 overlays.json out.mp4` does the same on any video
  and prints the SFX cues; mix them with `python -m reelkit.music … --sfx t=…:file:gain`.
- Opaque end cards (`flostocks-cta`) can also be the last **clip**: render to MP4 and use it
  as a clip `src` (audio is silent; music/SFX come from the music stage).

## 4. Transitions

| Between… | Use |
|---|---|
| Two real clips in a reel | clip `"transition"` in assemble: `cut`, `zoom_blur`, `whip`, `flash` (light leak), `dip`, **`glitch`** (RGB split + slice tear), **`spin`** (rotational blur). Dur 0.3–0.4 s. |
| A designed graphic wipe over a cut | overlay `{"template": "flostocks-wipe" \| "shape-wipe", "cut": <t>}` — covers 0.34–0.44 s, so the cut is invisible |
| Scenes inside a HyperFrames video | `/hyperframes-animation` → `transitions` + registry transition blocks; shader transitions via `/gl-transitions` |
| Shots in a Remotion video | `@remotion/transitions` (`/remotion-best-practices`) |

Rhythm rules: one transition style family per video, max ~1 flashy transition per 5 s, put a
whoosh on every graphic wipe (cut − 0.4 s), cut to the downbeat when music is driving (`/beat-sync-editing`).

## 5. Sound for motion

- **SFX (owned, free):** `python -m reelkit.sfx_gen` → `media/library/sfx/generated/`:
  whoosh, swoosh_short, impact, riser, pop, tick, shimmer, glitch, click, bass_drop, sparkle.
  Map: strap/slide-in → swoosh_short · wipe → whoosh · title slam → impact or bass_drop ·
  number lands → sparkle or pop · ticker digits / UI → click or tick · glitch transition → glitch.
- **Bundled stock SFX:** `.claude/skills/media-use/audio/assets/sfx/` (19 Pixabay-licence files,
  free for commercial use; keep them inside the project, don't redistribute as a pack).
- **Music:** free sources in SETUP.md only; log every track in `edit/credits.txt`. Or write a
  score in code with `/soundtrack` (Web Audio, rendered offline — you own it).
- **Mix:** reels → reelkit.music (ducks music under voice, −14 LUFS). Inside a HyperFrames
  piece → `/hyperframes-audio` (fades, carve, EQ, limiter). SFX sit ~6–10 dB under the voice;
  never two hits within 0.15 s; graphics that move without sound feel cheap, but not every
  micro-move needs one.

## 6. Brand: FloStocks (default)

Tokens: `motion/brands/flostocks/brand.json` (from flostocks.com). Green `#38D100` (gains,
keywords, CTAs) · logo green `#2AA300` · deep `#1F7A00` · ink `#062600` · night `#0B0F14`
(plates, cards) · wash `#EAF9E4` · gold `#E6A817` (sparingly: "free", premium) · loss
`#E4002B` (only for falling prices). Fonts (SIL OFL, shipped in `motion/brands/flostocks/fonts`):
**Manrope** 800 headlines/names, **Inter** labels, **IBM Plex Mono** every number.
Logos: `media/library/logos/flostocks-*` (`-on-dark` variants for footage/dark cards).
Motif: the logo's three slanted bars (parallelograms, `skewX(-20deg)`, green/green/white) —
reuse it for straps, wipes and accents instead of inventing shapes. Energy: credible finance,
fast `expo.out` entries, no bouncy numbers, ▲/▼ always coloured by direction.
Don't fabricate market data: tickers show numbers the user gave or that are labelled as examples.
To make this the channel brand for Remotion and brand.md too, run `/brand-setup`.

## 7. Templates (`motion/templates/`, 1080×1920, alpha unless noted)

| Template | What | Key vars | Len |
|---|---|---|---|
| `flostocks-logo-sting` | bars shoot up → logo lands, masked glint, tagline (dark card; `bg:"none"` = alpha) | `tagline`, `bg` | 3 s |
| `flostocks-lower-third` | mark bars + dark plate, Manrope name, green role | `name`, `role` | 4.5 s |
| `flostocks-ticker` | symbol, price count-up, ▲/▼ pill, sparkline draw-on | `symbol`, `name`, `value`, `decimals`, `change`, `points` | 4 s |
| `flostocks-wipe` | slanted bars cover the cut | — (use `cut`) | 0.8 s |
| `flostocks-cta` | opaque end card: logo, headline, URL pill | `headline`, `line`, `url` | 4 s |
| `kinetic-title` | reel house-style hook: light lead / huge italic keyword / bold tail | `lead`, `keyword`, `tail`, `accent` | 3.5 s |
| `lower-third` | house-style strap | `name`, `role`, `accent` | 4.5 s |
| `stat-pop` | number count-up card | `value`, `decimals`, `prefix`, `suffix`, `label`, `accent` | 3.5 s |
| `shape-wipe` | three-colour skewed wipe | `c1`, `c2`, `c3` (use `cut`) | 0.8 s |

New template checklist: `index.html` with `data-composition-variables`, inline `@font-face`
to shipped fonts (`assets/fonts` → repo Poppins, `assets/brand` → brand folder, `assets/logos`
→ `media/library/logos`, all symlinks), one paused GSAP timeline on `window.__timelines["main"]`,
`template.json` (`description`, `duration`, `anchor`, `sfx`), passes `check`, eyeballed render.

## 8. Design rules (9:16 reels)

- **Safe zones:** keep text out of the top 220 px, the bottom 380 px (platform UI) and the
  right 140 px (buttons). Never over the face; straps go lower-left, titles upper third.
- **Timing:** entries 0.3–0.6 s ease-out, exits 0.25–0.35 s ease-in, hold ≥ 1.5 s per line
  read (≈ 3 words/s). One hero motion at a time; ≤ 2 graphics on screen.
- **Hierarchy:** one accent colour per graphic; size contrast over colour contrast; numbers in mono.
- **Consistency:** same easing family, same skew angle, same corner radius across a video.
- **Captions:** reel captions sit around the head/chest/upper third — when a title or card owns
  the upper third, set that span's caption block lower or skip it (`captions.emphasis`/style), and
  never stack a stat card on a caption block.

## 9. Gotchas

- GSAP `fromTo` renders its *from* state immediately, even at a later position — a pulse/ring
  set to start visible will show early; add `immediateRender: false`.
- No CSS `transform` on an element you also tween with GSAP (lint `gsap_css_transform_conflict`);
  never tween `.clip` elements themselves — animate a child.
- A named `font-family` needs an in-file `@font-face` to a local file, or lint fails.
- Render cost: ~5 s of wall time per second of 1080×1920 on this CPU; the overlay cache means
  unchanged overlays never re-render. MOV alpha files are large — `motion/renders/` and
  `**/edit/overlays/` are gitignored.
- WebM alpha needs the libvpx decoder (`reelkit.overlay` handles it); prefer MOV.
- `npx hyperframes doctor` diagnoses Chrome/ffmpeg; `npx hyperframes browser ensure` fetches Chrome.
- Updating the vendored skills: `scripts/install-motion-skills.sh --latest`, review the diff,
  then bump the pins in that script (and `motion/package.json` + `HYPERFRAMES_CLI` together).
