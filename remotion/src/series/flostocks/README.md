# FLOSTOCKS EXPLAINS — series kit

One visual system for every episode, built from flostocks.com and the FloStocks logo.

## Language
- **Brand-bar wipe** (`BrandWipe`): the logo mark (two green slanted bars + one ink bar) sweeps
  right → left. The frame is fully covered `SWAP` (8) frames after the wipe starts; swap scenes there.
  The ink bar is a slim stripe, so the frame is never all ink.
- **Kinetic type** (`Punch`): Poppins Black Italic caps (the logo's italic). A line slides in,
  un-skews, sharpens and settles on its beat.
- **PSX ticker strip** (`TickerStrip`): the site's market ticker bar: a fixed PSX live tag plus the
  episode's tickers, at the top of content scenes.
- **Episode card** (`EpisodeCard`): brand-green card with the "FLOSTOCKS EXPLAINS · EP nn" pill, a giant
  italic title (with an optional slot-rolling number), a subtitle and a market label.
- **Leaderboard** (`Leaderboard`): dark trading-board panel that counts down N → 1, one row per beat,
  with rank, [logo], ticker, value + unit and a proportional bar; #1 gets the lime treatment and a
  "No. 1" tag; optional total line and source.
- **End card** (`EndCard`): logo, KNOW THE MARKET. INVEST SMARTER., FOLLOW FLOSTOCKS, By Floret
  Capitals and the market-risk line; builds in about a beat, then holds still.
- **Backdrop**: the site hero's white-to-mint wash, soft green light and a faint grid.
- **Tokens** (`theme.ts`): logo green `#2C9C00`, lime `#3ACC00`, ink `#0B0F14`, site greys and lines,
  `SLANT` −10°, site easing, Poppins only (fonts in `media/series/flostocks/fonts`).

## Episode recipe (EP 01 = `src/projects/psx-top10`)
1. `timeline.json`: BPM, `sections` (each with an `energy` for the music: light, groove, full or soft),
   `wipes` (beats), and `cues` (music hits). The music generator reads the same file.
2. Episode-specific scenes (hook, concept) built from `Punch` and the theme; the rest from the kit.
3. Compose in `src/shots/<episode>/`: `Backdrop` → scenes → `TickerStrip` → `EndCard` →
   `BrandWipe` (one at `-SWAP` for the frame-1 reveal, then one per entry in `wipes`).
4. Build and QA with `videos/<episode>/build.py --preview`, then without `--preview` for the final.

Structure that works for the series (about 15–20 s): hook question → episode card → the one idea
(kinetic) → the data (leaderboard or similar) → end card.
