#!/usr/bin/env bash
# Final audio master for the v9 reel (replaces reelkit.music's single-pass loudnorm, which acts
# as an AGC and flattens the quiet build into the 0:11 drop). Linear two-pass loudnorm keeps the
# build -> drop contrast; a true-peak-safe limiter (4x oversampled) keeps it under -1 dBTP.
#   bash videos/flostocks-whatis/work/master_v9.sh   -> edit/final_review.mp4
set -euo pipefail
cd "$(dirname "$0")/../edit"
V=../../../remotion/out/FsReelV9.mp4
MIX="[1:a]volume=0.9[m];[2:a]volume=0.8[s];[m][s]amix=inputs=2:normalize=0:duration=first"
ffmpeg -nostdin -v error -y -i "$V" -i audio/music_v9.wav -i audio/sfx_v9.wav -filter_complex "$MIX[a]" -map "[a]" -ar 48000 mix_v9.wav
J=$(ffmpeg -nostdin -hide_banner -i mix_v9.wav -af loudnorm=I=-14:TP=-1.5:LRA=20:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p')
g() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
AF="loudnorm=I=-14:TP=-1.5:LRA=20:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
AF="$AF,aresample=192000,alimiter=limit=0.80:level=false:attack=1:release=40,aresample=48000"
ffmpeg -nostdin -v error -y -i "$V" -i mix_v9.wav -map 0:v -map 1:a -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 17 -preset medium -r 30 \
  -af "$AF" -c:a aac -b:a 192k -ar 48000 -movflags +faststart -shortest final_review.mp4
rm -f mix_v9.wav
ffmpeg -nostdin -hide_banner -i final_review.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+I:|Peak:" | tail -2
