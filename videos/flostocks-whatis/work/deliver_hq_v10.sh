#!/usr/bin/env bash
# High-quality delivery master: the PNG-frame / CRF 12 render (HQ=1 render-chunks.sh) with the
# mastered audio from final_review.mp4 (master_v10.sh) — the video stream is copied, not re-encoded.
#   HQ=1 remotion/scripts/render-chunks.sh FsReelV10 1294 240 2
#   bash videos/flostocks-whatis/work/deliver_hq_v10.sh   -> edit/FloStocks_WhatIsFloStocks_1080x1920.mp4
set -euo pipefail
cd "$(dirname "$0")/../edit"
ffmpeg -nostdin -v error -y -i ../../../remotion/out/FsReelV10.hq.mp4 -i final_review.mp4 -map 0:v -map 1:a \
  -c copy -movflags +faststart -shortest FloStocks_WhatIsFloStocks_1080x1920.mp4
ffprobe -v error -show_entries format=duration,bit_rate:stream=codec_name,width,height,pix_fmt -of compact FloStocks_WhatIsFloStocks_1080x1920.mp4

# Phone-safe delivery (WhatsApp / phone players): Main profile, CFR 30, keyframe every second,
# no B-frames, BT.709 tags — one encode from the HQ render.
ffmpeg -nostdin -v error -y -i ../../../remotion/out/FsReelV10.hq.mp4 -i final_review.mp4 -map 0:v -map 1:a \
  -vf "fps=30,format=yuv420p" -fps_mode cfr -r 30 -c:v libx264 -profile:v main -level:v 4.0 -preset slow -crf 15 -maxrate 12M -bufsize 16M \
  -g 30 -keyint_min 30 -sc_threshold 0 -bf 0 -refs 3 -x264-params "open-gop=0" \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart -shortest FloStocks_WhatIsFloStocks_phone.mp4
