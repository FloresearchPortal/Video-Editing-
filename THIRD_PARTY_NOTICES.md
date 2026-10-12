# Third-party notices

| Path in this repo | Source | Licence |
|---|---|---|
| `.claude/skills/video-use/` | github.com/browser-use/video-use | MIT (see its `LICENSE`) |
| `.claude/skills/{clean-cut,clean-audio,make-tsx,fake-screencast,suggest-sfx,vidtsx-2d-generator,brand-setup}/`, `tools/`, `remotion/`, `brand.md`, `media/` (logos, workspace, example, piano chords) | github.com/hassancs91/claude-youtube-editor | MIT (below). ElevenLabs-generated music/SFX and paid-API tools were removed. |
| `assets/fonts/Poppins-*.ttf` | github.com/google/fonts (Poppins, Indian Type Foundry) | SIL Open Font License 1.1 (`assets/fonts/OFL.txt`) |
| `.claude/skills/remotion-*/` (not committed) | github.com/remotion-dev/skills via `scripts/install-remotion-skills.sh` | upstream terms; Remotion licence applies |
| `models/*.tflite` (not committed, auto-downloaded) | MediaPipe selfie segmenter, BlazeFace | Apache-2.0 |
| Python deps | faster-whisper (MIT), mediapipe (Apache-2.0), OpenCV (Apache-2.0), Pillow (MIT-CMU), NumPy (BSD) | as listed |

Modifications in this repo: free-mode notes added to the imported skills, `tools/transcribe.py`
falls back to local faster-whisper, `tools/clean_voice.py` defaults to RNNoise.

## claude-youtube-editor — MIT License

MIT License

Copyright (c) 2026 Hasan Aboul Hasan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
