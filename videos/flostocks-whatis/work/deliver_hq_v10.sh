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
