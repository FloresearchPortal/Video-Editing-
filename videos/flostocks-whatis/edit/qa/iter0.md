# QA report — NOT PASSED

File: `/home/user/Video-Editing-/videos/flostocks-whatis/edit/final.mp4`

FAIL 11 · WARN 28 · INFO 0

- ❌ **audio.music_too_loud** (music): music only -54.5 LU under the voice (want 15–25) — speech gets buried on phone speakers
- ❌ **audio.dead_air** (assemble): 2 silent gap(s) in speech: 0.0-28.3s, 29.7-56.1s
- ❌ **picture.black** (assemble): black frames 0.00–2.17s
- ❌ **picture.black** (assemble): black frames 18.40–18.97s
- ❌ **picture.black** (assemble): black frames 21.93–22.10s
- ❌ **picture.black** (assemble): black frames 22.13–22.43s
- ❌ **picture.black** (assemble): black frames 24.00–24.37s
- ❌ **picture.black** (assemble): black frames 24.43–25.70s
- ❌ **picture.black** (assemble): black frames 29.00–29.30s
- ❌ **picture.black** (assemble): black frames 44.00–44.37s
- ❌ **grade.skin_orange** (assemble): skin too orange/saturated (hue 134°, chroma 99)
- ⚠️ **picture.freeze** (assemble): frozen picture from 0.53s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 2.43s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 3.93s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 5.90s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 8.10s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 9.87s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 10.97s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 13.20s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 19.17s (clip 1: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 21.10s (clip 1: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 23.17s (clip 1: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 24.63s (clip 2: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 26.40s (clip 2: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 29.57s (clip 3: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 32.93s (clip 3: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 36.70s (clip 4: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 41.23s (clip 4: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 42.10s (clip 4: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 47.70s (clip 5: source ends early or out-point past the footage?)
- ⚠️ **framing.no_subject** (assemble): clip 0: speaker not found in most frames (b-roll? check framing)
- ⚠️ **framing.no_subject** (assemble): clip 1: speaker not found in most frames (b-roll? check framing)
- ⚠️ **framing.no_subject** (assemble): clip 2: speaker not found in most frames (b-roll? check framing)
- ⚠️ **framing.no_subject** (assemble): clip 3: speaker not found in most frames (b-roll? check framing)
- ⚠️ **framing.no_subject** (assemble): clip 4: speaker not found in most frames (b-roll? check framing)
- ⚠️ **framing.no_subject** (assemble): clip 5: speaker not found in most frames (b-roll? check framing)
- ⚠️ **framing.no_subject** (assemble): clip 6: speaker not found in most frames (b-roll? check framing)
- ⚠️ **grade.clipping** (assemble): 13.0% of the picture is clipped white
- ⚠️ **pacing.long_shot** (assemble): a 17.0s shot with no cut/zoom change — add a punch-in

## Measurements
```
{
 "format": {
  "width": 1080,
  "height": 1920,
  "fps": 30.0,
  "duration": 57.5,
  "vcodec": "h264",
  "pix_fmt": "yuv420p",
  "acodec": "aac",
  "sample_rate": "48000"
 },
 "loudness": {
  "integrated_lufs": -14.0,
  "true_peak_dbfs": -0.8
 },
 "mix": {
  "speech_db": "-13.3",
  "voice_over_music_db": -54.5,
  "balance_source": "stems",
  "duration": 57.43
 },
 "picture": {
  "black": [
   [
    0.0,
    2.16667
   ],
   [
    18.4,
    18.9667
   ],
   [
    21.9333,
    22.1
   ],
   [
    22.1333,
    22.4333
   ],
   [
    24.0,
    24.3667
   ],
   [
    24.4333,
    25.7
   ],
   [
    29.0,
    29.3
   ],
   [
    44.0,
    44.3667
   ]
  ],
  "freeze_starts": [
   0.533333,
   2.43333,
   3.93333,
   5.9,
   8.1,
   9.86667,
   10.9667,
   13.2,
   19.1667,
   21.1,
   23.1667,
   24.6333,
   26.4,
   29.5667,
   32.9333,
   36.7,
   41.2333,
   42.1,
   47.7
  ]
 },
 "framing_skin": {
  "framing": {},
  "skin": {
   "L_p75_median": 72.4,
   "hue_median": 133.9,
   "chroma_median": 98.7,
   "samples": 2
  }
 },
 "captions": {},
 "brand": {},
 "pacing": {
  "mean_shot_s": 7.86,
  "longest_s": 17.0
 }
}
```
