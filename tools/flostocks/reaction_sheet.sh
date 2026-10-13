#!/usr/bin/env bash
# Character / reaction approval sheet for a FloStocks explainer (show the client BEFORE new acting goes in).
#   tools/flostocks/reaction_sheet.sh <slug>   → motion/projects/<slug>/_reactions/renders/reactions.mp4 + snapshot
# Edit motion/projects/<slug>/_reactions/index.html (the `cells` list) for the video's cast, then re-run.
set -euo pipefail
cd "$(dirname "$0")/../.."
SLUG="${1:?usage: reaction_sheet.sh <slug>}"; P="motion/projects/$SLUG"; R="$P/_reactions"
mkdir -p "$R/assets"
[ -f "$R/index.html" ] || cp motion/templates/flostocks-explainer/_reactions/index.html "$R/"
cp "$P"/{kit.js,cast.js,icons.js,avatars.js,hyperframes.json} "$R/"
[ -e "$R/assets/brand" ] || ln -s ../../../../brands/flostocks "$R/assets/brand"
cd motion; export HYPERFRAMES_SKIP_SKILLS=1
rm -rf "projects/$SLUG/_reactions/snaps"
node_modules/.bin/hyperframes snapshot "projects/$SLUG/_reactions" --at 1.0 --no-end -o "projects/$SLUG/_reactions/snaps" >/dev/null 2>&1 || true
node_modules/.bin/hyperframes render "projects/$SLUG/_reactions" --format mp4 -o "projects/$SLUG/_reactions/renders/reactions.mp4" 2>&1 | grep -E "rendered|rror" || true
ls "projects/$SLUG/_reactions/snaps/"*.png "projects/$SLUG/_reactions/renders/reactions.mp4"
