# QA report — NOT PASSED

File: `/home/user/Video-Editing-/videos/flostocks-whatis/edit/final.mp4`

FAIL 4 · WARN 11 · INFO 0

- ❌ **audio.music_too_loud** (music): music only -55.9 LU under the voice (want 15–25) — speech gets buried on phone speakers
- ❌ **audio.dead_air** (assemble): 2 silent gap(s) in speech: 0.0-28.3s, 29.7-42.8s
- ❌ **grade.skin_overexposed** (assemble): faces too bright (lit side L≈97, natural 65–76)
- ❌ **brand.endcard** (brand): no branded end card (logo + CTA + disclaimer) at the end
- ⚠️ **picture.freeze** (assemble): frozen picture from 0.00s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 1.50s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 2.60s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 5.33s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 7.93s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 11.80s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 28.57s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 39.83s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **framing.no_subject** (assemble): clip 0: speaker not found in most frames (b-roll? check framing)
- ⚠️ **grade.clipping** (assemble): 48.3% of the picture is clipped white
- ⚠️ **pacing.long_shot** (assemble): a 44.2s shot with no cut/zoom change — add a punch-in

## Measurements
```
{
 "format": {
  "width": 1080,
  "height": 1920,
  "fps": 30.0,
  "duration": 44.17,
  "vcodec": "h264",
  "pix_fmt": "yuv420p",
  "acodec": "aac",
  "sample_rate": "48000"
 },
 "loudness": {
  "integrated_lufs": -14.0,
  "true_peak_dbfs": -1.1
 },
 "mix": {
  "speech_db": "-20.0",
  "voice_over_music_db": -55.9,
  "balance_source": "stems",
  "duration": 44.12
 },
 "picture": {
  "black": [],
  "freeze_starts": [
   0.0,
   1.5,
   2.6,
   5.33333,
   7.93333,
   11.8,
   28.5667,
   39.8333
  ]
 },
 "framing_skin": {
  "framing": {},
  "skin": {
   "L_p75_median": 97.1,
   "hue_median": 75.3,
   "chroma_median": 0.6,
   "samples": 2
  }
 },
 "captions": {},
 "brand": {},
 "pacing": {
  "mean_shot_s": 44.17,
  "longest_s": 44.17
 }
}
```
