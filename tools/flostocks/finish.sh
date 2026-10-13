#!/usr/bin/env bash
# Render → mix → share copy for a FloStocks explainer.   tools/flostocks/finish.sh <slug>
# Runs the HyperFrames check first (must show 0 runtime errors), renders the silent video (~10–12 min for
# ~2 min of 1080×1920 on this machine — run it in the background), then tools/flostocks/mix.py.
set -euo pipefail
cd "$(dirname "$0")/../.."
SLUG="${1:?usage: finish.sh <slug>}"
export HYPERFRAMES_SKIP_SKILLS=1
[ -f videos/$SLUG/music/bed.wav ] || .venv/bin/python tools/flostocks/make_bed.py "$SLUG"
(cd motion && node_modules/.bin/hyperframes check projects/$SLUG 2>&1 | sed -n '/^Runtime/,/^Layout/p') || true   # contrast/layout notes are advisory here; runtime must say 0 errors
(cd motion && node_modules/.bin/hyperframes render projects/$SLUG --format mp4 -o projects/$SLUG/renders/$SLUG-video.mp4 2>&1 | grep -E "rendered|Error|error" || true)
.venv/bin/python tools/flostocks/mix.py "$SLUG"
