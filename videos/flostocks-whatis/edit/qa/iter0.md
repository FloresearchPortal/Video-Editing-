# QA report — NOT PASSED

File: `/home/user/Video-Editing-/videos/flostocks-whatis/edit/final.mp4`

FAIL 4 · WARN 20 · INFO 0

- ❌ **audio.music_too_loud** (music): music only -55.9 LU under the voice (want 15–25) — speech gets buried on phone speakers
- ❌ **audio.dead_air** (assemble): 2 silent gap(s) in speech: 0.0-28.3s, 29.7-48.3s
- ❌ **grade.skin_overexposed** (assemble): faces too bright (lit side L≈98, natural 65–76)
- ❌ **brand.endcard** (brand): no branded end card (logo + CTA + disclaimer) at the end
- ⚠️ **picture.freeze** (assemble): frozen picture from 0.00s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 1.63s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 2.93s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 6.20s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 8.30s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 11.50s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 17.40s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 19.97s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 24.93s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 26.97s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 32.50s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 36.67s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 38.47s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 40.60s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 41.77s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 44.03s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 47.83s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **framing.no_subject** (assemble): clip 0: speaker not found in most frames (b-roll? check framing)
- ⚠️ **grade.clipping** (assemble): 50.4% of the picture is clipped white
- ⚠️ **pacing.long_shot** (assemble): a 49.7s shot with no cut/zoom change — add a punch-in

## Measurements
```
{
 "format": {
  "width": 1080,
  "height": 1920,
  "fps": 30.0,
  "duration": 49.67,
  "vcodec": "h264",
  "pix_fmt": "yuv420p",
  "acodec": "aac",
  "sample_rate": "48000"
 },
 "loudness": {
  "integrated_lufs": -14.0,
  "true_peak_dbfs": -1.2
 },
 "mix": {
  "speech_db": "-19.1",
  "voice_over_music_db": -55.9,
  "balance_source": "stems",
  "duration": 49.62
 },
 "picture": {
  "black": [],
  "freeze_starts": [
   0.0,
   1.63333,
   2.93333,
   6.2,
   8.3,
   11.5,
   17.4,
   19.9667,
   24.9333,
   26.9667,
   32.5,
   36.6667,
   38.4667,
   40.6,
   41.7667,
   44.0333,
   47.8333
  ]
 },
 "framing_skin": {
  "framing": {},
  "skin": {
   "L_p75_median": 98.1,
   "hue_median": 101.9,
   "chroma_median": 0.8,
   "samples": 2
  }
 },
 "captions": {},
 "brand": {},
 "pacing": {
  "mean_shot_s": 49.67,
  "longest_s": 49.67
 }
}
```
