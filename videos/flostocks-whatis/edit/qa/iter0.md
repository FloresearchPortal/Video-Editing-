# QA report — NOT PASSED

File: `/home/user/Video-Editing-/videos/flostocks-whatis/edit/final.mp4`

FAIL 3 · WARN 3 · INFO 0

- ❌ **audio.music_too_loud** (music): music only -52.8 LU under the voice (want 15–25) — speech gets buried on phone speakers
- ❌ **audio.dead_air** (assemble): 2 silent gap(s) in speech: 0.0-28.3s, 29.7-41.1s
- ❌ **grade.skin_overexposed** (assemble): faces too bright (lit side L≈99, natural 65–76)
- ⚠️ **framing.no_subject** (assemble): clip 0: speaker not found in most frames (b-roll? check framing)
- ⚠️ **grade.clipping** (assemble): 23.2% of the picture is clipped white
- ⚠️ **pacing.long_shot** (assemble): a 40.0s shot with no cut/zoom change — add a punch-in

## Measurements
```
{
 "format": {
  "width": 1080,
  "height": 1920,
  "fps": 30.0,
  "duration": 42.5,
  "vcodec": "h264",
  "pix_fmt": "yuv420p",
  "acodec": "aac",
  "sample_rate": "48000"
 },
 "loudness": {
  "integrated_lufs": -14.1,
  "true_peak_dbfs": -0.9
 },
 "mix": {
  "speech_db": "-15.0",
  "voice_over_music_db": -52.8,
  "balance_source": "stems",
  "duration": 42.43
 },
 "picture": {
  "black": [],
  "freeze_starts": []
 },
 "framing_skin": {
  "framing": {},
  "skin": {
   "L_p75_median": 99.0,
   "hue_median": 128.5,
   "chroma_median": 1.1,
   "samples": 3
  }
 },
 "captions": {},
 "brand": {},
 "pacing": {
  "mean_shot_s": 40.0,
  "longest_s": 40.0
 }
}
```
