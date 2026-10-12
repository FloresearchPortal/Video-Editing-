---
name: quality-gate
description: Final quality gate for every video in this repo. Tests the output of all the editing skills (cut, framing/tracking, grade, captions, music mix, brand, delivery specs) with measurable checks, automatically fixes what it can (re-cutting dead air, reframing, grade trims, caption placement/size/term fixes, music level, loudness re-master, branded end card), re-renders only the affected stages, repeats until the reel passes, and only then hands over the final MP4 with a QA summary. Use ALWAYS before giving the user a finished video, and whenever the user asks to "check", "test", "QA", "polish", "refine", "make it better" or "is it ready to post".
---

# quality-gate — test, fix, re-render, then deliver

**Rule: never hand the user a final MP4 that hasn't passed this gate.** If it can't pass
automatically, deliver `final_review.mp4` and say exactly what is still open.

Free and local (ffmpeg + MediaPipe + numpy). Run from the repo root with `.venv/bin/python`.

## One command
```
python -m reelkit.refine <project>/timeline.json [--max-iter 3] [--skip-render]
```
1. Renders the reel at full 1080×1920 (`make_reel`) and masters it: H.264 High yuv420p,
   AAC 48 kHz, two-pass loudnorm to −14 LUFS / −1 dBTP.
2. Runs every check (`reelkit/qa.py`) and writes `edit/qa/iterN.md|json`.
3. Converts each FAIL (and WARN that has a fix) into a change in the working copy
   `<timeline>.refined.json` (your timeline is never edited), re-runs from the EARLIEST stage that
   change affects (assemble → transcribe → captions → music → deliver), and re-tests.
4. Stops when it passes, when nothing more is fixable, or after `--max-iter`. A fix that didn't work
   after two tries is left for a human instead of looping.
5. Writes `edit/final_approved.mp4` (passed) or `edit/final_review.mp4`, plus `edit/qa/summary.md`
   (iterations, every automatic change, what's still open).

QA only (no changes): `python -m reelkit.qa <project>/timeline.json`.

## What is tested → what gets fixed automatically
| Area | Check (threshold) | Automatic fix |
|---|---|---|
| Delivery | 1080×1920, 30 fps, H.264 yuv420p, AAC 48 kHz, A/V lengths match, ≤ 90 s | full-res render, re-master |
| Loudness | −14 ±1 LUFS integrated, true peak ≤ −1 dBTP | two-pass loudnorm |
| Voice vs music | voice 12–24 dB over the bed in pauses (FAIL < 9 dB, WARN > 30 dB) | music volume ×0.7 / ×1.3 |
| Dead air | silence > 0.7 s inside speech, > 0.45 s lead-in | split the clip → jump cut with a punch-in |
| Clicks | sample jumps at cut points | (report) |
| Black / frozen frames | black > 0.12 s not from a short dip; freezes > 0.8 s | dip → zoom-blur transition |
| Framing | head x 0.3–0.7, head y 0.18–0.5, speaker found | per-clip `offset_x`, `head_y`, wider zoom |
| Skin / grade | lit-side face L ≤ 80 (natural 65–76), not orange (hue/chroma), not pink; < 3 % clipped | grade trims (`grade_extra`: gamma, saturation) |
| Captions | inside the Reels/TikTok UI safe zone; not covering the face; keyword height ≥ 3.5 % of frame; phrases readable (≥ 0.35 s after last word); first caption < 1 s | safe margins, drop "head" placements, size ×1.1, longer holds |
| Transcript | low-confidence words listed for review | — |
| Brand (`"brand": true`) | end card present; watermark; brand terms spelled right (FloStocks, Floret Capitals, PSX); no "guaranteed returns / risk-free" claims | add end card, caption term replacements; compliance = human |
| Pacing | no shot > 7 s without a cut/zoom change | (report — add a punch-in) |

## How to work with it
- Before running, make sure the project timeline is complete (`/reel-editor`) and the grade LUT is
  baked if the user wants the reference look (`/davinci-resolve-grade`).
- After it finishes, READ `edit/qa/summary.md` and the last contact sheet
  (`python -m reelkit.review edit/final_approved.mp4 --every 0.5`) and look at it yourself: the
  numbers catch technical faults, your eyes catch taste (awkward cut, wrong keyword emphasised).
  Taste fixes → edit the refined timeline / caption `emphasis` and run refine again with
  `--skip-render` off.
- Anything in "Still open" goes to the user in plain words with the timestamp, e.g. "0:12 —
  the script says 'guaranteed returns'; regulated finance content can't say that. Re-record or cut?".
- Deliver: send `final_approved.mp4` (or `final_review.mp4` + the open items) and the summary.

## Brand (FloStocks by Floret Capitals)
Brand kit: `brand/brand.json` (colours, fonts, logos, tagline, CTAs, socials, disclaimer) — see
`brand/README.md`. `"brand": true` in a timeline turns on the brand caption style + logo watermark
and the brand checks above. End card: `python -m reelkit.brand endcard`.
