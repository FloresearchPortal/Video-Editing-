---
name: psx-top10
description: The FloStocks PSX TOP 10 episode bot. Turns a short content brief (episode, title, the top-10 data, source + date) into a finished 13.4 s 1080x1920 motion-graphics reel in the LOCKED series style (white FloStocks theme, Poppins, ticker-wall + split-flap TOP 10 intro, logo-lockup title, countdown ranking chart, KNOW THE MARKET / INVEST SMARTER CTA, original music), validated, rendered, QA'd and delivered. Use whenever the user wants a new "Top 10" / PSX rankings video, a new episode of the series, "make another one like this", or sends a top-10 list or brief.
---

# /psx-top10 — the PSX TOP 10 episode bot

**The style is locked.** Never edit `remotion/src/series/top10/*` (theme, layout, motion, timeline,
music cues, CTA, disclaimer) for an episode. An episode is ONLY a brief: `videos/top10/<slug>/brief.json`.
If the user asks for a style change, that is a series change: confirm it applies to every episode, then
change the kit, re-render EP 01 to check, and commit it separately.

What the user sends: see `videos/top10/BRIEF.md` (4 items). Reference brief: `videos/top10/ep01-market-cap/brief.json`.

## Steps
1. **Collect the brief.** If anything required is missing, ask once for exactly the missing items (use
   the BRIEF.md table). Defaults: heading `["TOP 10 BY", "<METRIC>"]`, pill `IN PSX`. Uppercase all
   display lines. (The series has no explainer section; an `explainer` block in a brief is ignored.)
2. **Data.** Never invent numbers. Market cap / price / shares: fetch with
   `python3 videos/psx-top10/data/fetch_psx.py --date "<close date>"` (writes the PSX Data Portal numbers;
   copy the top 10 into the brief). Any other metric: use the user's values and source verbatim. Put units
   in `value_format` (`pre`/`post`: Rs, %, bn, mn) and pick decimals that keep the labels short.
3. **Write** `videos/top10/<slug>/brief.json` (slug: `epNN-<metric>`, lowercase-dashes) and validate:
   `.venv/bin/python videos/top10/make_episode.py videos/top10/<slug>/brief.json --check`
   Fix every ERROR by shortening copy / changing units, not by touching the kit. Mention WARNs to the user.
4. **Preview:** `... make_episode.py <brief> --preview` (~1 min). Look at `edit/contact_sheet.png` by eye:
   nothing clipped or overlapping, values correct, #1 highlighted, source line present.
5. **Deliver:** `... make_episode.py <brief>` (1080x1920, ~1.5 min). It runs the QA gate (format, ≤ 20 s,
   −14 LUFS, true peak ≤ −1.5 dBTP, still CTA hold, no black frames, faststart) and writes
   `edit/final_approved.mp4` (passed) or `edit/final_review.mp4` + `edit/qa/summary.md` (open items).
   This QA is the series' quality gate (`reelkit.refine` is for footage timelines and does not apply).
   Send the MP4 + contact sheet with SendUserFile; report QA numbers and missing logos.
6. **Commit** the brief (renders are gitignored) and push.

## Logos
Official company logos live in `media/library/logos/psx/<TICKER>.png|svg|webp|jpg`; the bot picks them up
automatically and lists missing ones. Only add files the user supplied; never draw, trace or fetch a
look-alike. A missing logo simply has no logo slot.

## Finance rules
No return promises (the validator blocks "guarantee", "risk-free", "will double", "buy now", …). The
market-risk disclaimer on the end card is part of the locked CTA and is never removed.
