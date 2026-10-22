# QA report — NOT PASSED

File: `/home/user/Video-Editing-/videos/flostocks-whatis/edit/final.mp4`

FAIL 4 · WARN 13 · INFO 0

- ❌ **audio.music_too_loud** (music): music only -56.0 LU under the voice (want 15–25) — speech gets buried on phone speakers
- ❌ **audio.dead_air** (assemble): 2 silent gap(s) in speech: 0.0-28.3s, 29.7-46.3s
- ❌ **grade.skin_overexposed** (assemble): faces too bright (lit side L≈97, natural 65–76)
- ❌ **brand.endcard** (brand): no branded end card (logo + CTA + disclaimer) at the end
- ⚠️ **picture.freeze** (assemble): frozen picture from 0.00s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 1.63s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 2.93s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 6.20s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 9.27s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 13.10s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 30.57s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 40.07s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 41.63s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 43.63s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **framing.no_subject** (assemble): clip 0: speaker not found in most frames (b-roll? check framing)
- ⚠️ **grade.clipping** (assemble): 49.7% of the picture is clipped white
- ⚠️ **pacing.long_shot** (assemble): a 47.7s shot with no cut/zoom change — add a punch-in

## Measurements
```
{
 "format": {
  "width": 1080,
  "height": 1920,
  "fps": 30.0,
  "duration": 47.67,
  "vcodec": "h264",
  "pix_fmt": "yuv420p",
  "acodec": "aac",
  "sample_rate": "48000"
 },
 "loudness": {
  "integrated_lufs": -14.1,
  "true_peak_dbfs": -1.1
 },
 "mix": {
  "speech_db": "-19.1",
  "voice_over_music_db": -56.0,
  "balance_source": "stems",
  "duration": 47.59
 },
 "picture": {
  "black": [],
  "freeze_starts": [
   0.0,
   1.63333,
   2.93333,
   6.2,
   9.26667,
   13.1,
   30.5667,
   40.0667,
   41.6333,
   43.6333
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
  "mean_shot_s": 47.67,
  "longest_s": 47.67
 }
}
```
