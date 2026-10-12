# Third-party notices

| Path in this repo | Source | Licence |
|---|---|---|
| `.claude/skills/video-use/` | github.com/browser-use/video-use | MIT (see its `LICENSE`) |
| `.claude/skills/{clean-cut,clean-audio,make-tsx,fake-screencast,suggest-sfx,vidtsx-2d-generator,brand-setup}/`, `tools/`, `remotion/`, `brand.md`, `media/` (logos, workspace, example, piano chords) | github.com/hassancs91/claude-youtube-editor | MIT (below). ElevenLabs-generated music/SFX and paid-API tools were removed. |
| `assets/fonts/Poppins-*.ttf` | github.com/google/fonts (Poppins, Indian Type Foundry) | SIL Open Font License 1.1 (`assets/fonts/OFL.txt`) |
| `.claude/skills/{hyperframes,hyperframes-*,media-use,motion-graphics,general-video,talking-head-recut,faceless-explainer}/` | github.com/heygen-com/hyperframes (pinned in `scripts/install-motion-skills.sh`) | Apache-2.0 (`LICENSE.upstream` in each folder); bundled SFX in `media-use/audio/assets/sfx/` are Pixabay Content License (see its `CREDITS.md`) |
| `.claude/skills/{animation-principles,motion-art-direction,shot-composition,color-motion,motion-background,logo-animation,beat-sync-editing,kinetic-typography,lower-thirds,manim,diagram-animation,chart-animation,animated-infographic,javascript-animation,soundtrack}/` | github.com/iart-ai/*-skills (pinned, see `.claude/skills/MOTION_SKILLS.lock`) | MIT (`LICENSE.upstream`) |
| `.claude/skills/gl-transitions/`, `motion/gl-transitions/` | github.com/gl-transitions/gl-transitions | MIT (`LICENSE.upstream`, `motion/gl-transitions/LICENSE`) |
| `motion/brands/flostocks/fonts/` | github.com/google/fonts (Manrope, Inter, IBM Plex Mono) | SIL Open Font License 1.1 (`OFL-*.txt` alongside) |
| `media/library/logos/flostocks-*` | flostocks.com — the user's own brand | trademark of its owner; used for its own videos only |
| `.claude/skills/remotion-*/` (not committed) | github.com/remotion-dev/skills via `scripts/install-remotion-skills.sh` | upstream terms; Remotion licence applies |
| `models/*.tflite` (not committed, auto-downloaded) | MediaPipe selfie segmenter, BlazeFace | Apache-2.0 |
| Python deps | faster-whisper (MIT), mediapipe (Apache-2.0), OpenCV (Apache-2.0), Pillow (MIT-CMU), NumPy (BSD) | as listed |

Modifications in this repo: free-mode notes added to the imported skills (the vendored motion skills
get theirs from `scripts/_free_first_note.py`, otherwise unchanged), `tools/transcribe.py`
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
