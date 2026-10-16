# PSX TOP 10 — FloStocks series kit

Fast, kinetic 2D motion graphics in the FloStocks PSX Weekly language: white grid paper, PSX ticker
bands with motion blur, split-flap boards, chart builds, slanted green band wipes and the logo lockup.
Poppins only, white brand theme, 1080×1920 @ 30 fps, under 20 s, 150 BPM (12 frames per beat).

| Section | Beats | Changes per episode? | Component |
|---|---|---|---|
| Intro: ticker wall → split-flap **TOP 10** → ranking bars → slant wipe → logo lockup "PSX TOP 10 / RANKINGS" | 0–10 | **never** | `SeriesIntro` |
| Topic title (kinetic lines, green band) | 10–16 | text | `TopicTitle` ← `episode.title` |
| Explainer: the basis of the ranking as one formula, A × B = RESULT, with a worked example | 16–28 | content | `Explainer` ← `episode.explainer` |
| Rankings chart, countdown #10 → #1 on the beat, total + source | 28–45 | data | `Rankings` ← `episode.rankings` |
| CTA: logo lockup, **KNOW THE MARKET, / INVEST SMARTER.**, flostocks.com, disclaimer | 45– (still from 46.5) | **never** | `CtaCard` |

Transitions (always the same): FloStocks bar wipe → ticker-band shutter → bar wipe → slant band wipe.
The series header (logo + `PSX TOP 10 · EP xx`) sits on every content scene.

## New episode
1. Copy `remotion/src/projects/top10-mcap/` to `remotion/src/projects/top10-<topic>/`.
2. Replace `data.json` with the new data (keep numbers sourced; finance rules: no return promises).
3. Edit `episode.ts`: `ep`, the title lines, the explainer formula (labels, notes, worked example,
   takeaway), the ranking heading, value format (`pre`/`post`/`decimals`), total and source line.
   Copy is auto-sized to fit (Poppins metrics in `metrics.json`), so long titles never overflow.
4. Keep `timeline.json` (series beat grid + music cues); only change cues if a section's motion changes.
5. Company logos: put the official files under `media/` and map `TICKER -> path` in `logos.json`.
   Never redraw or fake a logo; a missing logo simply has no logo slot.
6. Build, review the contact sheet, then run `/quality-gate` before delivery.

```
.venv/bin/python videos/psx-top10/build.py --series=top10-mcap --preview   # half size, with music + QA
.venv/bin/python videos/psx-top10/build.py --series=top10-mcap             # 1080x1920 delivery
```
(`--series=top10-<topic>` builds another episode folder; output: `videos/psx-top10/output/<folder>.mp4`.)
