---
name: davinci-resolve-grade
description: Colour grade footage to match a reference video/image (default — the user's reference reel) using only free tools, and hand the grade to DaVinci Resolve (free edition) as a .cube LUT plus a node recipe. Use when the user wants to "colour grade like the reference", "match the colours", "make a LUT", "grade in DaVinci Resolve", "teal and orange like the reference", match shots to each other, or set up Resolve's Color page for this look. Measures the reference look (tone curve, shadow/mid/highlight casts, per-hue saturation) with reelkit.grade_match, bakes a LUT for the user's own camera footage, verifies it numerically and visually, applies it in reelkit renders, and installs it into Resolve's LUT folder.
---

# davinci-resolve-grade — match the reference grade, free

## The honest constraints (tell the user when relevant)
- **DaVinci Resolve free cannot be driven by Claude.** Since Resolve 21.1 Blackmagic moved Python
  scripting to Resolve Studio (paid, ~$295); external scripting was always Studio-only. MCP servers
  for Resolve (e.g. lordhoell/davinci-resolve-mcp) therefore need Studio — **don't install or
  suggest them** under this repo's free-first rule unless the user says they own Studio.
- What Resolve free *does* do: load `.cube` LUTs, node grading, Shot Match, gallery stills
  and split-screen wipes. So Claude produces the grade as a **LUT + recipe**, the user applies it
  in Resolve with a couple of clicks — or reelkit applies it directly in the render (no Resolve).
- Nobody can recover a colourist's exact node tree from a finished video. "Exactly like the
  reference" = making the user's footage land on the same colours. That is measured below
  (CIE ΔE; ≤ ~3 average is visually the same look, ~2.3 is a just-noticeable difference).

## Workflow
Run from the repo root with `.venv/bin/python`.

1. **Profile the reference** (already done for the user's reference reel →
   `grades/reference.profile.json`; redo only for a new reference). Sample only the graded
   footage — skip intro/outro cards and logo frames with `--range`:
   ```
   python -m reelkit.grade_match profile <reference.mp4|still.jpg ...> --range 0:40 -o grades/<name>.profile.json
   ```
   It prints the look in Resolve terms (Lift/Gamma/Gain cast directions, black/white points).
   Stills work too — pass several frames if the user gives a "reference image".

2. **Bake a LUT for the user's camera.** Use 2–6 representative clips from the SAME camera
   and picture profile, shot in conditions similar to the reference (outdoor daylight for the
   house look). One LUT per camera/profile/lighting setup:
   ```
   python -m reelkit.grade_match lut grades/reference.profile.json raw/a.mp4 raw/b.mp4 -o grades/<camera>_look.cube [--strength 0.8]
   ```
   Defaults are built for footage whose content differs from the reference: the grade's tint is
   read from near-neutral pixels only (so the reference's blue sky isn't mistaken for a teal
   grade), skin resists the tint (`--skin-protect 0.8`), and each clip keeps its own exposure
   (exposure is node 1's job). Add `--match-exposure` only when the footage is the same kind of
   scene as the reference and should also copy its brightness.
   Log footage (S-Log/V-Log/C-Log/Apple Log): convert to Rec.709 first (the camera maker's free
   conversion LUT, or Resolve's Color Space Transform) and bake from the converted clips.

3. **Verify before handing over.** Make the comparison still and LOOK at it:
   ```
   python -m reelkit.grade_match compare grades/<camera>_look.cube raw/a.mp4 <reference.mp4> --t 3 --ref-t 6 -o grades/compare.png
   ```
   Check skin stays natural (not teal), skies/greens match, no banding or clipped whites.
   Too strong → re-bake with `--strength 0.7–0.85`. Mixed lighting → bake per-scene LUTs.

4. **Use it.**
   - In reelkit renders: `"grade": "lut:grades/<camera>_look.cube+vignette"` in the timeline
     (`+vignette` adds the reference's soft edge darkening, which a LUT can't hold).
   - In DaVinci Resolve (free):
     `python -m reelkit.grade_match resolve grades/<camera>_look.cube` copies it into Resolve's LUT
     folder (`--dir` to override). Then in Resolve: Project Settings → Color Management → Lookup
     Tables → **Update Lists**.

## Resolve (free) node recipe to give the user
Timeline at Rec.709 Gamma 2.4, clips already Rec.709 (or converted from log in node 1).
1. **Node 1 – Balance** (per clip): Primaries → set exposure so skin sits around 60–70 IRE on the
   waveform; neutralise white balance (Temp/Tint) so whites read white. Use *right-click → Shot
   Match to This Clip* to even out clips first.
2. **Node 2 – Look**: right-click → LUTs → reelkit → `<camera>_look.cube`. Put it on a **Group
   (post-clip)** or the **Timeline** node graph so every clip shares it. Lower Key Output Gain
   (Key tab) to dial strength.
3. **Node 3 – Vignette**: Window → circle, softness ~40–50, invert, Gain wheel master −0.05…−0.1.
4. **Node 4 – Trims** (optional): Hue vs Sat to calm over-saturated greens; Lum vs Sat to keep
   highlights clean.
To compare: grab a still from the reference (import it, Gallery → Grab Still) and use split-screen
wipe (Ctrl/Cmd+W) against the graded clip.
Export from Resolve free: Deliver → H.264, 1080×1920 for Reels — then run the reelkit captions /
music stages on that export if they weren't done in Resolve.

## The user's reference look (measured)
Measured on neutral pixels: blue-tinted shadows, slightly teal mids, near-neutral highlights;
high contrast with a deep black point (crushed but not clipped) and a soft shoulder; warm skin
and ground, punchy blue sky (per-hue saturation), soft vignette. Numbers in
`grades/reference.profile.json`.

## Accuracy record
Test: the reference reel was flattened two different ways (low-contrast warm/green; log-like
lifted blacks + 45% saturation + green tint), then matched back with a LUT baked from the
flattened copy (`--match-exposure`). Average ΔE vs the true reference: 11.3 → **3.2** and 13.8 → **3.8**; luminance
error < 1.3 L; overall saturation matched to within 1%; skin and sky colours within ~1–2 units.
