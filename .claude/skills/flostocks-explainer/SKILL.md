---
name: flostocks-explainer
description: Make a FloStocks (flostocks.com) explainer reel — a 9:16 Pakistan-stock-market motion-graphics video built on a Roman-Urdu voice-over, in the house style of "What is PSX". Use whenever the user wants a FloStocks / PSX / KSE-100 / investing / stock-market explainer, a "video like the PSX one", a finance reel with characters, charts, the FloStocks app and the logo + disclaimer ending, or wants to edit one of these reels. Covers intake, VO transcription, beat sheet, the house kit (white chart-paper world, candles/line charts, Notionists characters with body acting, FloStocks app UI, one smooth scene wipe, icon→logo CTA), the overlap audit, render, mix, delivery and every client preference learned so far. 100% free and local.
---

# FloStocks explainer reels

The house format: a **9:16, ~1–2 min explainer about the Pakistan stock market**, told over the client's
**Roman-Urdu voice-over**, with kinetic titles, real finance graphics (candlesticks, line charts, the KSE-100,
the FloStocks app), a small cast of Notionists characters who act out the story, and the **FloStocks icon →
full logo** ending with the **disclaimer** underneath. Reference build: `motion/projects/what-is-psx/`
(scenes.js = 20 scenes, every pattern below is in there) and the delivered video
`videos/what-is-psx/output/what-is-psx-final.mp4`.

Free-first (repo rule): local Whisper, HyperFrames (Apache-2.0), DiceBear Notionists (CC0), synthesized
music/SFX, ffmpeg. Never call a paid API. Never use `hyperframes ... --describe` (Gemini).

---

## 1. The client's rules (learned on "What is PSX" — apply them from the first draft)

Look & brand
- **White / light theme only.** Background `#F7F8F7` chart paper (faint price grid + a drifting market line).
  Dark backgrounds were rejected ("the white background was more neater and aligned with my brand").
- Brand green `#38D100` (text green `#1E9600`, deep `#1F7A00`), ink `#0B0F14`, red `#E4002B` only for falls.
  Fonts: Manrope (titles), Inter (body), IBM Plex Mono (numbers). Logos in `media/library/logos/`.
- **Finance touch everywhere**: real line charts and candlesticks (grid, price axis, natural price path),
  KSE-100 / PSX symbols from `media/library/psx/market.json`, the FloStocks app UI for any buying/holding.
  Pakistan-stock-market themed throughout. Never cartoon metaphors (e.g. no water for "doobna" → use a
  bad-news alert + red candles + a falling price card).
- **No subtitles and no ticker strip.** On-screen kinetic titles carry the key words; the VO carries the rest.

Opening & ending
- **Frame 0 = the PSX logo alone** (instant hook), then it docks top and a live KSE-100 card builds
  (`K.psxHook`). The **one candlestick chart moves with the VO** — sideways, rally on "upar", sell-off on
  "neeche". Do not add a separate line chart over it.
- **Ending = FloStocks icon alone → glides into the full logo** as the wordmark unrolls (`K.ctaLogo`), then
  "FOLLOW FLOSTOCKS", then the **disclaimer underneath** (verbatim, `K.DISCLAIMER`). No abstract bars/lines.

Motion & camera
- **Calm, professional, energetic through content, not shake.** Barely-there camera drift; push-ins ≤ 5 %.
  No snap zooms, whips, glitches, slams, bounces or overshoot (`back.out`/`bounce`/`elastic` are banned on
  characters and text).
- **Every scene change is the same smooth wipe** (`K.linkScenes()`): next scene sweeps in left→right behind
  a thin green edge. The frame must visibly change; never a blank or double-exposed frame.
- **Prices never roll or count** ("feels like buffering"): show the value; when it changes use `K.swap`
  (old value lifts out, new settles in). Step-wise app inputs (quantity 1→5) go at a readable ~0.26 s/step.
- **Nothing overlaps — ever.** No title, number, card, character or icon may touch another, and no text may
  leave the frame (30 px side / 40 px top-bottom margins). Run the audit (§5) — it must come back clean.
- One question mark per question. No decorative clutter (no number clouds, sparkles, "!" marks, emoji badges).

Characters (Notionists, `cast.js` + `avatars.js`)
- **Only where the story needs them.** Never a narrator character.
- Style "B · Balanced" green: Ahmed (green shirt, thin mustache — the business owner), Aap (green cap — the
  viewer/investor), Sana (green hijab), Bilal (beard), Ayesha, Usman, Zara. Nothing between the eyebrows.
- **Eyes always open — no blinking.** Expressive but adequate faces ("delight" for love/kamaal is happy, not subtle).
- **Act with the body, one motion per reaction** — the pose moves in, holds, eases back; no repeated waving,
  pumping, nodding or shaking (looked cartoonish). Reactions: `joy`, `shock`, `worry`, `think`, `love`,
  `helpless` (both palms up — "paisay bilkul nahi"), `buy`, `proud`.
- Hands: only when they say something (cup of chai on "chai kamaal hai", pointing on BUY). **No hands** on
  sellers, or on darr/umeed/bharosa-type emotion beats (`{ gesture: "none" }`). No "…" think bubble there.
- A character "in" a place is already there when the scene opens (Ahmed is in his dhaaba, not walking in).
- **Show a character/reaction sheet for approval before using new characters or new acting** (§4).

Sound
- VO is king: music bed ducked under it, **SFX sparse and quiet** (gains 0.10–0.22, only big visual hits,
  sidechain-ducked) — loud/frequent SFX were rejected. Master −14 LUFS / −1 dBTP.

Working with the client
- Show work in progress as snapshots / short MP4s, apply each note exactly, re-check the whole video after
  every round (the audit + a contact sheet), commit and push every round.
- Use models efficiently (client's instruction): do the creative/complex work yourself; hand basic
  mechanical jobs (asset fetching, data lookups) to a smaller/cheaper subagent.

---

## 2. Workflow

```bash
# 0. intake: VO file, the Roman-Urdu script, topic, disclaimer (default K.DISCLAIMER), any app screens/data
tools/flostocks/new_explainer.sh <slug> /path/to/vo.mp3        # scaffolds videos/<slug> + motion/projects/<slug>
#    save the client's script as videos/<slug>/script.txt (primes Roman-Urdu spelling)
.venv/bin/python tools/flostocks/transcribe_vo.py <slug>        # → edit/vo.words.json + timed lines
# 1. refresh market data if the video shows prices (see "Market data") → media/library/psx/market.json + market.js
# 2. beat sheet: one scene per VO sentence/idea, cue = the word's start time (write it at the top of scenes.js)
# 3. build scenes.js from the starter + recipes (§3); preview frames:
cd motion && HYPERFRAMES_SKIP_SKILLS=1 node_modules/.bin/hyperframes snapshot projects/<slug> --at 0.3,2.5,... --no-end -o projects/<slug>/snaps
# 4. QA: runtime check (0 errors) + overlap audit (clean) + read the contact sheets yourself
HYPERFRAMES_SKIP_SKILLS=1 node_modules/.bin/hyperframes check projects/<slug>
cd .. && node tools/flostocks/overlap_audit.cjs motion/projects/<slug>
# 5. sound cues: videos/<slug>/edit/cues.json  [[t, "whoosh"|"pop"|"click"|"coin"|"impact"|..., 0.10–0.2], ...]
# (new cast/acting? tools/flostocks/reaction_sheet.sh <slug> → approval first)
# 6. render + mix + share copy (≈12 min for 2 min of video → run in the background)
tools/flostocks/finish.sh <slug>
# 7. deliver (§6)
```

Timing: every cue comes from `vo.words.json` (word start times). Titles land on their word; characters
react on the emotional word; scene starts sit on sentence starts. The composition length is VO + ~6 s for
the logo + disclaimer hold (set by the scaffold in `index.html data-duration`).

---

## 3. The kit (`motion/templates/flostocks-explainer/`, copied into each project)

One paused GSAP timeline `K.tl`; all times are absolute seconds. Seek-safe: no `Math.random` (use `K.rnd`),
`immediateRender:false` on delayed `fromTo`s, hide-until-shown with `autoAlpha`.

| need | call |
|---|---|
| scene layer (then `K.linkScenes()` once at the end) | `const s = scene(t0, t1, { push: 1.03 })` |
| PSX hook (logo alone → KSE-100 card, candles follow VO) | `psxHook(s, { tDock, tUp, tDown })` → `{logo, card, idx, chip, cd}` |
| kinetic title (`*word*` = green accent, `|` = line break) | `kin(s, "MARKET *UPAR*", { y, size, accent, color, x, w })` + `charsIn.rise/slam/flip/drop/words(box, t)` / `charsOut.*` |
| candlesticks (grid + price axis, print in VO-timed ranges) | `candles(p, { x, y, w, h, n, start, grid: true, axis: [...top→bottom], trend: (p, r) => Δ })` → `.grow(t)` / `.growRange(t, i0, i1, stagger)` |
| line chart (natural path, area, tracking dot) | `line(p, [[x,y]...0–1], { x, y, w, h, color, grid, axis })` → `.draw(t, dur)` |
| gauge (demand / supply) | `gauge(p, "DEMAND", { x, y, color, start })` → `.to(v, t)` |
| price / value | `roller(p, { text, size, color })` + `roll(box, t)` (fade-in) · change: `swap(el, "Rs 200", t)` |
| character | `who(p, "ahmed", x, y, size, { expr, gesture })`, `life(w, t0, t1)` (breathing), `react.<kind>(w, t, ...)`, `CAST.expr/gesture(tl, w.av, name, t)` |
| FloStocks app (client's UI) | `K.app(p, x, y, scale)` → refs (`phone, actions.Buy, sheet, dim, qty, plus, total, buyBtn, toast, card, value, price, chg, ...`) + `K.tap(A, fx, fy, t, target)` |
| icons (stall, miniStall, bank, crate, lock, phone, coin, ticket, clock, sofa, shield, bulb, skyline) | `icon(p, name, x, y, w, h, ...)` |
| CTA | `ctaLogo(s, t, { tDisc })` (icon → logo → FOLLOW button → disclaimer) |
| scan accent (e.g. "record scratch" moment) | `glitch(t)` (a soft terminal scan line) |

Expressions: neutral smile happy grin talk wow worried shocked think delight (no blink).
Gestures: none hand handPhone point pointLongArm ok okLongArm waveLongArm waveOkLongArms shrug cup.
New faces/colours: `node make_avatars.cjs mid` regenerates `avatars.js` (Notionists seeds in `CAST`).

## Scene recipes (all in `motion/projects/what-is-psx/scenes.js`)
- **Hook** S1 · **question → "main samjhata hoon"** S2 (one "?") · **story owner at work** S3 (Ahmed already
  inside his dhaaba, queue of customers, "+1") · **dream vs reality** S4 (skyline + mini stalls → helpless shrug, "Rs 0")
- **company → shares** S5–S6 (dhaaba tiles to the public, LISTED badge, 1,000-dot grid, "1 SHARE = Rs 100")
- **capital raised** S7 (1,000 × Rs 100 = Rs 1,00,000, "BINA BANK KE") · **hissay = shares** S8
- **viewer buys in the FloStocks app** S9 (Aap with chai on "kamaal", app → Buy → qty 1→5 → order placed)
- **price up** S10–S11 (6 mahine baad, price card line chart 100→200, app value 500→1,000, +Rs 500 / ×2)
- **why: demand vs supply** S12–S15 (news alert, buyers with BUY tags, gauges, crate + lock "SIRF 1,000 SHARES", rising chart)
- **bad news → panic selling → price down** S16 (ALERT card, red candles, ACHAI ▼30%, sellers without hands, gauges flip, falling chart)
- **volatility** S17 (choppy candles + line, ▲ UPAR / ▼ NEECHE chips)
- **people behind numbers** S18 (watchlist rows → faces; DARR / UMEED / BHAROSA, body-only acting)
- **regulated marketplace** S19 (PSX + shield, buyer ⇄ seller: money one lane, SHARE tickets the other)
- **CTA** S20 (PSX ko aasaan zubaan mein → icon → logo → FOLLOW → "mushkil nahi, SIMPLE." → disclaimer)

---

## 4. Approval sheets (before new characters / acting go into a video)
`tools/flostocks/reaction_sheet.sh <slug>` stages `motion/projects/<slug>/_reactions/` (the project's current kit +
the template sheet: joy, helpless, think, kamaal-with-chai, wow, buy, darr/umeed/bharosa without hands),
renders `renders/reactions.mp4` (6 s) and a snapshot. Edit the `cells` list for the video's cast, re-run,
send the MP4 + snapshot, and wait for the client's OK.

## 5. QA gates (all must pass before rendering)
1. `hyperframes check` → **Runtime: 0 errors** (lint/contrast notes on approval sheets are fine).
2. `node tools/flostocks/overlap_audit.cjs motion/projects/<slug>` → **empty** (it skips scene-wipe windows
   automatically; `roller … FRAME-EDGE` lines are the full-width roller box — check those by eye). Tag solid
   cards/phones/logos with `data-ov`; wrap intended groups (character inside a stall) in `data-ov-group`.
3. Snapshots across the whole timeline (every ~4 s + each cue) — read every contact sheet yourself.
4. After the mix: loudness ≈ −14 LUFS (mix.py prints it), spot-check 4 frames from the final file.

## 6. Delivery
- `SendUserFile` the share copy (`videos/<slug>/output/FloStocks-<Slug>.mp4`, ≤ 30 MB).
- The client also wants a link: `git add -f videos/<slug>/output/<slug>-final.mp4` (master, <100 MB),
  commit, push, and give the GitHub blob URL. Code is committed every round anyway (repo stop-hook).

## Market data
`media/library/psx/market.json` = `{date, source, kse100:{level, change_pct, change_points}, stocks:[{symbol, price, change_pct}]}`.
Refresh per video from https://dps.psx.com.pk/indices and https://dps.psx.com.pk/company/<SYMBOL> (WebFetch, or
a small subagent), note the snapshot time, then regenerate the project's `market.js`
(`python3 -c "import json;print('window.MARKET = '+json.dumps(json.load(open('media/library/psx/market.json')))+';')" > motion/projects/<slug>/market.js`).

## Gotchas
- SVG ids must be unique per character instance (cast.js suffixes them) — shared ids blank other copies.
- A scene starting at t=0 must not be hidden at 0 (linkScenes handles it).
- `fromTo` renders its from-state immediately unless `immediateRender:false` — pre-roll states leak.
- The hyperframes binary: run from `motion/` with `HYPERFRAMES_SKIP_SKILLS=1`; never `--describe`.
- Don't `pkill -f` a pattern that matches your own shell.
- `finish.sh` takes ~12 min for ~2 min of 1080×1920 — run it in the background.
