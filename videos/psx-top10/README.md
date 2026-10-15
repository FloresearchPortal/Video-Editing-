# FLOSTOCKS EXPLAINS · EP 01 — Top 10 companies by market capitalization in PSX

9:16 Instagram Reel, 1080 × 1920, 30 fps, 17.0 s, H.264 yuv420p (BT.709) + AAC 48 kHz,
−14 LUFS, true peak ≤ −1.5 dBTP, faststart. Built in Remotion, so every frame is deterministic code.
The music is an original 140 BPM track synthesised by `music/make_music.py` (numpy, no samples),
so there is nothing to license.

## Where things live
| What | Path |
|---|---|
| **Timing (one shared file)** | `remotion/src/projects/psx-top10/timeline.json`: sections in beats; the visuals *and* the music read it |
| Data | `remotion/src/projects/psx-top10/data.json` (written by `data/fetch_psx.py`) |
| Series kit | `remotion/src/series/flostocks/` (see its README): BrandWipe, Punch, TickerStrip, EpisodeCard, Leaderboard, EndCard, Backdrop, theme. Fonts + FloStocks logos in `media/series/flostocks/` |
| Episode scenes | `remotion/src/projects/psx-top10/`: `Hook` (WHO ARE / THE BIGGEST / ON THE PSX?), `Concept` (MARKET CAP = SHARE PRICE × TOTAL SHARES → BIGGER VALUE = HIGHER RANK); the episode card, countdown leaderboard and end card come from the kit |
| Composition | `remotion/src/shots/psx-top10/PsxTop10.tsx` (id `PsxTop10`) |
| Logos | `media/projects/psx-top10/logos/<TICKER>.png` + `remotion/src/projects/psx-top10/logos.json` |
| Font (SIL OFL) | **Poppins only**: `media/series/flostocks/fonts/` (Black → Regular, plus italics). Digits use fixed-width cells (`Num.tsx`) because Poppins has no tabular figures; ▲ is drawn as SVG because Poppins has no such glyph |
| Music | `music/make_music.py` → `output/music.wav` |
| Build + QA | `build.py` → `output/psx-top10.mp4`, `output/qa.json`, `output/contact_sheet.png`, `output/stills/` |

## Re-render
From the repo root (one-time: `cd remotion && npm ci`, then `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt pyloudnorm`):
```bash
.venv/bin/python videos/psx-top10/build.py --preview   # half size: output/psx-top10_preview.mp4 + contact sheet
.venv/bin/python videos/psx-top10/build.py             # final:     output/psx-top10.mp4
```
`build.py` writes the music, renders the picture (`remotion/scripts/psx-top10.mjs`, its own entry point,
fully offline), muxes and re-encodes for delivery, then runs QA:
- format;
- duration ≤ 20 s;
- the CTA's final hold (`cta.hold_seconds`, 1 s) pixel-still;
- loudness and true peak, measured on the delivered AAC;
- no black frames.

It also renders a still at every transition. For live editing, run `cd remotion && npx remotion studio src/projects/psx-top10/index.ts`.

## Update the data
1. Run this **after the 3:30 PM PKT close**:
   ```bash
   python3 videos/psx-top10/data/fetch_psx.py --date "15 Oct 2026"
   ```
   For each company it reads the closing price and shares outstanding from `dps.psx.com.pk/company/<TICKER>`.
   It computes market cap = close × shares, ranks about 40 large caps (the reference 10 plus NBP, NESTLE,
   ENGROH, EFERT, HUBC and others) and writes `data.json`. That file holds the top 10, the share of the
   total, the font size that fits each name, and the cut-off list.
2. If you run it the next morning instead, use `--price ldcp`, because the board then shows the new day's trading.
3. If a different company enters the top 10, the script warns you. Add its short name and sector to `NAMES` in
   the script, and its logo (below).
4. The source line and the ranking header take the date from `--date`.

## Logos
- Put the official files in `media/projects/psx-top10/logos/` and list them in `logos.json` with their pixel
  size (`file`, `w`, `h`).
- Logos only ever scale proportionally. The chart shows a logo column only once all ten official files
  are present; until then the rows show the rank and ticker only, never a stand-in.

## Change timing
- Edit `timeline.json`, which is in beats: 1 beat = 0.4286 s = 12.857 frames at 140 BPM.
  `sections` place the scenes and set the music's energy; `cues` are the music hits.
- If you move `cta.static_from`, update `durationInSeconds` in `PsxTop10.tsx`. The composition throws an error
  telling you the right value if they disagree.

## Showreel cut (3D) — `remotion/src/projects/psx-reel`
One continuous camera move through a real-time 3D market (three.js via `@remotion/three`, rendered
headless with WebGL/SwiftShader, `--gl=swangle`), about 20 s at 140 BPM, every move on a beat:
1. **Ignite**: a lime spark draws the price line through a dark void, and ~1,500 instanced candlesticks
   erupt behind it. "PAKISTAN / STOCK EXCHANGE".
2. **City**: the camera cranes up over the candle skyline. "WHO ARE / THE BIGGEST?"
3. **Share**: the camera dives to one share coin (SHARE PRICE). 80 coins fly in and stack into a tower
   (× ALL SHARES), which solidifies into a glowing monolith (= MARKET CAP).
4. **Towers**: ten glass towers at true market-cap heights rise #10 → #1 on the beat, each labelled
   (rank, ticker, Rs bn, drawn in Poppins). The camera dollies down the row, takes a low-angle hero shot
   of #1 OGDC, then a diagonal wide of all ten: TOP 10 · Rs 7.23 trillion.
5. **Logo**: the towers sink and the FloStocks logo mark rises as three slanted 3D bars. The camera
   pushes through them to a white flash and the series end card.

Post: bloom, vignette, film grain, fog. Camera keyframes and all timing are in `timeline.ts` /
`timeline.json` (the music reads the same file).
```bash
.venv/bin/python videos/psx-top10/build.py --reel --preview   # output/psx-top10_reel_preview.mp4
.venv/bin/python videos/psx-top10/build.py --reel             # full 1080x1920
```
