#!/usr/bin/env bash
# Cut the v7 render into per-section approval clips with a quick preview mix
# (music_v7 + sfx_v7, loudness-normalised). Not the delivery master — that goes
# through reelkit.refine after the sections are approved.
#   bash videos/flostocks-whatis/work/preview_sections_v7.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=../../remotion/out/FsReelV7.mp4
OUT=edit/sections_v7
mkdir -p "$OUT"
ffmpeg -v error -y -i edit/audio/music_v7.wav -i edit/audio/sfx_v7.wav \
  -filter_complex "[0]volume=0.85[m];[1]volume=0.8[s];[m][s]amix=inputs=2:normalize=0[a]" -map "[a]" -ar 48000 "$OUT/mix_raw.wav"
I=$(ffmpeg -nostats -i "$OUT/mix_raw.wav" -af ebur128 -f null - 2>&1 | awk '/I:/{v=$2} END{print v}')
G=$(python3 -c "print(-14 - ($I))")
ffmpeg -v error -y -i "$OUT/mix_raw.wav" -af "volume=${G}dB,alimiter=limit=0.84:level=false" "$OUT/mix_preview.wav"
echo "preview mix: ${I} LUFS -> gain ${G} dB"
ffmpeg -v error -y -i "$SRC" -i "$OUT/mix_preview.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest "$OUT/full_preview.mp4"
# name  start_frame  end_frame   (30 fps; bars on the 124 BPM grid from DROP=314)
while read -r name a b; do
  ss=$(python3 -c "print($a/30)"); to=$(python3 -c "print($b/30)")
  ffmpeg -nostdin -v error -y -ss "$ss" -to "$to" -i "$OUT/full_preview.mp4" -c:v libx264 -crf 18 -preset veryfast -pix_fmt yuv420p -c:a aac -b:a 192k "$OUT/$name.mp4"
  echo "$name  $ss-$to s"
done <<'LIST'
1_chat_to_flostocks      0    430
2_market_open_learn    430    778
3_research_tools_reg   778    953
4_everything_drop      953   1185
5_cta_ending          1185   1490
LIST
