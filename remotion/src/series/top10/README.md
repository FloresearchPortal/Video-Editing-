# PSX TOP 10 — FloStocks series kit

Fast, kinetic 2D motion graphics in the FloStocks PSX Weekly language: white grid paper, PSX ticker
bands with motion blur, split-flap boards, chart builds, slanted green band wipes and the logo lockup.
Poppins only, white brand theme, 1080×1920 @ 30 fps, 13.4 s, 150 BPM (12 frames per beat).

| Section | Beats | Changes per episode? | Component |
|---|---|---|---|
| Intro: ticker-band wall → split-flap **TOP 10** board + PSX RANKINGS tag, hold, zoom-through | 0–6 | **never** | `SeriesIntro` |
| Topic lockup: logo, rule, 2–3 title lines (ink, then green), loading pill with label, flostocks.com | 6–13 | text | `TopicTitle` ← `episode.title` |
| Rankings chart, countdown #10 → #1 on the beat, total + source | 13–29 | data | `Rankings` ← `episode.rankings` |
| CTA: logo lockup, **KNOW THE MARKET, / INVEST SMARTER.**, flostocks.com, disclaimer | 29– (still from 30.5) | **never** | `CtaCard` |

Transitions (always the same): zoom-through → ticker-band shutter → slant band wipe.
The series header (logo + `PSX TOP 10 · EP xx`) sits on every content scene.

## New episode — the bot (`/psx-top10`)
**The style is locked: an episode is only a brief.** Nothing in this folder changes per episode.

1. Fill a brief: what to send is in `videos/top10/BRIEF.md`; EP 01's is `videos/top10/ep01-market-cap/brief.json`.
2. `.venv/bin/python videos/top10/make_episode.py videos/top10/<slug>/brief.json --check` validates it
   (line lengths fitted from the Poppins metrics, 10 rows, units, source, finance wording).
3. `... make_episode.py <brief> --preview`, then `... make_episode.py <brief>` renders 1080x1920, runs QA and
   writes `videos/top10/<slug>/edit/final_approved.mp4` (or `final_review.mp4` + `qa/summary.md`).

The brief reaches the one generic entry (`src/projects/top10`) as input props (`scripts/top10.mjs --brief=`),
`brief.ts` maps it onto the components, and `timeline.json` here is the locked beat grid the music is
synthesised from (cached once in `videos/top10/_music/`). Company logos: official files only, in
`media/library/logos/psx/<TICKER>.png|svg`; picked up automatically, a missing logo has no slot.
