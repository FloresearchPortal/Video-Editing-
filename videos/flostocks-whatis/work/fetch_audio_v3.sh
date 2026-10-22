#!/usr/bin/env bash
# Fetch the v3 music bed and sound effects from Mixkit into edit/audio/ (git-ignored:
# the Mixkit licences forbid redistributing the files on their own, so they are not
# committed — re-run this script to restore them).
#
# Licences (read 2026-10-22):
#   Music — Mixkit Stock Music Free License (https://mixkit.co/license/#musicFree):
#     commercial use OK in social media video posts, online marketing ads, YouTube;
#     not for TV/radio broadcast, CDs/DVDs, video games; no remixing into a music-only
#     track; do not register on a rights-management (Content ID) service. No attribution.
#   SFX — Mixkit Sound Effects Free License (https://mixkit.co/license/#sfxFree):
#     commercial use OK incl. broadcast; do not redistribute standalone or register.
set -euo pipefail
OUT="$(cd "$(dirname "$0")/.." && pwd)/edit/audio"
mkdir -p "$OUT"
get() { [ -s "$OUT/$2" ] || curl -fsSL -A "Mozilla/5.0" -o "$OUT/$2" "$1"; echo "  $2"; }

# music: "What About Action?" (Mixkit #474), 121 BPM, drop downbeat at 63.6904 s
get https://assets.mixkit.co/music/474/474.mp3 music_what_about_action.mp3

# sound effects
get https://assets.mixkit.co/active_storage/sfx/2533/2533-preview.mp3 key_tap.mp3          # Single key type
get https://assets.mixkit.co/active_storage/sfx/166/166-preview.mp3   msg_send.mp3         # Fast small sweep transition
get https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3 msg_receive.mp3      # Bubble pop up alert notification
get https://assets.mixkit.co/active_storage/sfx/1492/1492-preview.mp3 whoosh_fast.mp3      # Cinematic whoosh fast transition
get https://assets.mixkit.co/active_storage/sfx/1490/1490-preview.mp3 whoosh_fast2.mp3     # Fast whoosh transition
get https://assets.mixkit.co/active_storage/sfx/3114/3114-preview.mp3 sweep_scifi.mp3      # Fast sci fi transition sweep
get https://assets.mixkit.co/active_storage/sfx/2900/2900-preview.mp3 logo_impact.mp3      # Movie logo intro impact
get https://assets.mixkit.co/active_storage/sfx/772/772-preview.mp3   zoom_impact.mp3      # Quick zoom impact
get https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3 ui_select.mp3        # Interface option select
get https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3 confirm.mp3          # Confirmation tone
get https://assets.mixkit.co/active_storage/sfx/2350/2350-preview.mp3 sparkle.mp3          # Magic sparkle whoosh
echo "audio -> $OUT"
