# Setup — everything free

## 1. System tools
| Tool | Why | Install |
|---|---|---|
| ffmpeg + ffprobe | all decoding, encoding, filters, audio mix | macOS `brew install ffmpeg` · Ubuntu `sudo apt install ffmpeg` · Windows `winget install Gyan.FFmpeg` |
| Python 3.10+ | reelkit + tools | python.org or your package manager |
| libEGL (Linux servers only) | MediaPipe segmentation | `sudo apt install libegl1 libgles2` |
| Node.js 18+ (optional) | only for the Remotion motion-graphics skills | nodejs.org |

## 2. Python environment
```bash
python -m venv .venv                       # or: uv venv .venv
.venv/bin/pip install -r requirements.txt  # Windows: .venv\Scripts\pip install -r requirements.txt
.venv/bin/python -m reelkit.sfx_gen        # synthesise the free SFX pack once
./scripts/install-remotion-skills.sh       # optional: Remotion motion-graphics skills
```
First runs download the Whisper model (~0.5 GB, Hugging Face cache) and two small MediaPipe
models into `models/` — after that everything runs offline.

## 3. Make a reel
```bash
mkdir -p myreel/raw && cp ~/footage/*.mp4 myreel/raw/
.venv/bin/python -m reelkit.transcribe myreel/raw/clip1.mp4 -o myreel/edit/transcripts/clip1.json
# write myreel/timeline.json (see .claude/skills/reel-editor/SKILL.md) — or just ask Claude:
#   "edit myreel like the reference: timeline, captions, zooms, music"
.venv/bin/python -m reelkit.make_reel myreel/timeline.json --preview   # fast half-res check
.venv/bin/python -m reelkit.make_reel myreel/timeline.json             # full 1080x1920
```

## 4. Free music sources (check each track's licence page before use)
| Source | Licence | Attribution |
|---|---|---|
| Pixabay Music — pixabay.com/music | Pixabay Content License (free, commercial OK) | not required |
| YouTube Audio Library — studio.youtube.com → Audio Library | free for your videos | some tracks require it (shown per track) |
| Free Music Archive — freemusicarchive.org | per track (prefer CC0 / CC BY) | required for CC BY |
| Incompetech (Kevin MacLeod) — incompetech.com | CC BY 4.0 | required |
Avoid commercial chart music: Instagram/TikTok/YouTube will mute or claim it.
Log every track's source + licence in `<project>/edit/credits.txt`.

## 5. Costs at a glance
| Feature | Free path used here | Paid alternatives (NOT used by default) |
|---|---|---|
| Transcription | faster-whisper (local) | ElevenLabs Scribe, AssemblyAI |
| Captions, zooms, tracking, transitions, grade | reelkit (ffmpeg + MediaPipe + OpenCV) | — |
| Music | royalty-free libraries above | ElevenLabs Music |
| SFX | `reelkit.sfx_gen` (synthesised) | ElevenLabs SFX |
| Denoise | RNNoise via ffmpeg `arnndn` (`tools/clean_voice.py --method rnnoise`) | ElevenLabs Voice Isolator |
| Motion graphics (optional) | Remotion — **free only for individuals, non-profits and companies of ≤3 people**; larger companies need a paid Remotion company licence | — |
