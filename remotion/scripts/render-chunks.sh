#!/usr/bin/env bash
# Render one long composition in frame chunks, each in a fresh browser, retrying a
# chunk that fails, then stitch the chunks losslessly into out/<id>.mp4.
# For long, heavy compositions where a render tab occasionally crashes and the
# relaunched tab hangs (seen on small 4-core containers).
#
#   scripts/render-chunks.sh <CompId> <totalFrames> [chunkFrames=240] [concurrency=2]
set -euo pipefail

ID="$1"
TOTAL="$2"
CHUNK="${3:-240}"
CONC="${4:-2}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$ROOT/out/chunks-$ID"
mkdir -p "$WORK"
: > "$WORK/list.txt"

start=0
n=0
while [ "$start" -lt "$TOTAL" ]; do
  end=$(( start + CHUNK - 1 ))
  [ "$end" -ge "$TOTAL" ] && end=$(( TOTAL - 1 ))
  part="$WORK/part$(printf '%02d' "$n").mp4"
  if [ ! -s "$part" ]; then
    ok=0
    for attempt in 1 2 3; do
      echo "chunk $n: frames $start-$end (attempt $attempt)"
      if node "$ROOT/scripts/render-all.mjs" --scale=1 --frames="$start-$end" --concurrency="$CONC" "$ID" > "$WORK/part$n.log" 2>&1 \
         && grep -q "done: 1 shot" "$WORK/part$n.log"; then
        mv "$ROOT/out/$ID.mp4" "$part"
        ok=1
        break
      fi
      echo "  chunk $n failed: $(tr '\r' '\n' < "$WORK/part$n.log" | grep -oE 'delayRender\(\)[^.]*|Protocol error[^.]*' | head -1)"
    done
    [ "$ok" = 1 ] || { echo "chunk $n failed 3 times — giving up"; exit 1; }
  fi
  echo "file '$part'" >> "$WORK/list.txt"
  start=$(( end + 1 ))
  n=$(( n + 1 ))
done

ffmpeg -v error -y -f concat -safe 0 -i "$WORK/list.txt" -c copy "$ROOT/out/$ID.mp4"
echo "stitched $n chunks -> out/$ID.mp4 ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ROOT/out/$ID.mp4")s)"
