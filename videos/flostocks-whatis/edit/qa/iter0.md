# QA report — NOT PASSED

File: `/home/user/Video-Editing-/videos/flostocks-whatis/edit/final.mp4`

FAIL 4 · WARN 9 · INFO 0

- ❌ **audio.music_too_loud** (music): music only -56.5 LU under the voice (want 15–25) — speech gets buried on phone speakers
- ❌ **audio.dead_air** (assemble): 2 silent gap(s) in speech: 0.0-28.3s, 29.7-45.2s
- ❌ **picture.black** (assemble): black frames 16.37–16.63s
- ❌ **grade.skin_orange** (assemble): skin too orange/saturated (hue 134°, chroma 99)
- ⚠️ **picture.freeze** (assemble): frozen picture from 0.00s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 1.90s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 3.73s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 5.07s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 7.13s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **picture.freeze** (assemble): frozen picture from 9.40s (clip 0: source ends early or out-point past the footage?)
- ⚠️ **framing.no_subject** (assemble): clip 0: speaker not found in most frames (b-roll? check framing)
- ⚠️ **grade.clipping** (assemble): 24.9% of the picture is clipped white
- ⚠️ **pacing.long_shot** (assemble): a 44.1s shot with no cut/zoom change — add a punch-in

## Measurements
```
{
 "format": {
  "width": 1080,
  "height": 1920,
  "fps": 30.0,
  "duration": 46.6,
  "vcodec": "h264",
  "pix_fmt": "yuv420p",
  "acodec": "aac",
  "sample_rate": "48000"
 },
 "loudness": {
  "integrated_lufs": -14.0,
  "true_peak_dbfs": -0.9
 },
 "mix": {
  "speech_db": "-16.0",
  "voice_over_music_db": -56.5,
  "balance_source": "stems",
  "duration": 46.57
 },
 "picture": {
  "black": [
   [
    16.3667,
    16.6333
   ],
   [
    26.3,
    26.5333
   ]
  ],
  "freeze_starts": [
   0.0,
   1.9,
   3.73333,
   5.06667,
   7.13333,
   9.4
  ]
 },
 "framing_skin": {
  "framing": {},
  "skin": {
   "L_p75_median": 73.1,
   "hue_median": 133.9,
   "chroma_median": 98.7,
   "samples": 5
  }
 },
 "captions": {},
 "brand": {},
 "pacing": {
  "mean_shot_s": 44.13,
  "longest_s": 44.13
 }
}
```
