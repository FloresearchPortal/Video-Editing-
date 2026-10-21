#!/usr/bin/env bash
# Scaffold a new FloStocks explainer reel from the house kit.
#   tools/flostocks/new_explainer.sh <slug> <voiceover-file>
# Creates videos/<slug>/{raw,edit,music,output} and motion/projects/<slug>/ (kit + starter scenes),
# wires brand/logo/PSX assets, sets the composition length from the VO, writes market.js.
set -euo pipefail
cd "$(dirname "$0")/../.."
SLUG="${1:?usage: new_explainer.sh <slug> <voiceover-file>}"; VO="${2:?voiceover file required}"
[[ "$SLUG" =~ ^[a-z0-9-]+$ ]] || { echo "slug must be lowercase-kebab"; exit 1; }
V="videos/$SLUG"; P="motion/projects/$SLUG"; T="motion/templates/flostocks-explainer"
[ -e "$P" ] && { echo "$P already exists"; exit 1; }
mkdir -p "$V/raw" "$V/edit" "$V/music" "$V/output"
ext="${VO##*.}"; cp "$VO" "$V/raw/vo.$ext"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V/raw/vo.$ext")
# composition = VO + ~6 s tail for the logo + disclaimer hold, rounded up
COMP=$(python3 -c "import math;print(math.ceil(float('$DUR')+6))")
mkdir -p "$P/assets"
cp "$T"/{kit.js,cast.js,icons.js,app.js,avatars.js,make_avatars.cjs,hyperframes.json,scenes.js,psxlogo.js} "$P/"
sed "s/__DUR__/$COMP/g" "$T/index.html" > "$P/index.html"
ln -s ../../../brands/flostocks "$P/assets/brand"
ln -s ../../../../media/library/logos "$P/assets/logos"
ln -s ../../../../media/library/psx "$P/assets/psx"
python3 - "$P" <<'PY'
import json, sys
m = json.load(open("media/library/psx/market.json"))
open(sys.argv[1] + "/market.js", "w").write("window.MARKET = " + json.dumps(m) + ";\n")
PY
cat > "$V/edit/cues.json" <<'J'
[
  [1.5, "whoosh", 0.10]
]
J
printf "# Credits / licences for %s\nmusic/bed.wav: original, synthesized by tools/flostocks/make_bed.py (seeded numpy) - no third-party audio\nSFX: media/library/sfx/generated (reelkit.sfx_gen, original)\n" "$SLUG" > "$V/edit/credits.txt"
echo "scaffolded:"
echo "  $V   (raw/vo.$ext, VO ${DUR}s)"
echo "  $P   (composition ${COMP}s)"
echo "next: .venv/bin/python tools/flostocks/transcribe_vo.py $SLUG"
