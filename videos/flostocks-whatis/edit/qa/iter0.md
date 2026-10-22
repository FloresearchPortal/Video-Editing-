# QA report — NOT PASSED

File: `/home/user/Video-Editing-/videos/flostocks-whatis/edit/final.mp4`

FAIL 2 · WARN 3 · INFO 0

- ❌ **audio.music_too_loud** (music): music only -56.7 LU under the voice (want 15–25) — speech gets buried on phone speakers
- ❌ **audio.dead_air** (assemble): 2 silent gap(s) in speech: 0.0-28.3s, 29.7-54.2s
- ⚠️ **framing.no_subject** (assemble): clip 0: speaker not found in most frames (b-roll? check framing)
- ⚠️ **grade.clipping** (assemble): 23.1% of the picture is clipped white
- ⚠️ **pacing.long_shot** (assemble): a 53.1s shot with no cut/zoom change — add a punch-in

## Measurements
```
{
 "format": {
  "width": 1080,
  "height": 1920,
  "fps": 30.0,
  "duration": 55.6,
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
  "speech_db": "-15.4",
  "voice_over_music_db": -56.7,
  "balance_source": "stems",
  "duration": 55.53
 },
 "picture": {
  "black": [],
  "freeze_starts": []
 },
 "framing_skin": {
  "framing": {}
 },
 "captions": {},
 "brand": {},
 "pacing": {
  "mean_shot_s": 53.1,
  "longest_s": 53.1
 }
}
```
