#!/usr/bin/env bash
# Install the free motion-graphics skill stack used by /motion-editor into .claude/skills/.
#
#   scripts/install-motion-skills.sh            # skills only, at the pinned commits below
#   scripts/install-motion-skills.sh --latest   # skills from each repo's default branch (then review the diff)
#   scripts/install-motion-skills.sh --tools    # also install the render toolchain (see install_tools)
#
# Every source is MIT or Apache-2.0, so the skills are vendored (committed) with their upstream
# licence copied next to them as LICENSE.upstream; THIRD_PARTY_NOTICES.md lists them. Each SKILL.md
# gets this repo's free-first note after its frontmatter. The Remotion skills (no upstream licence)
# stay in scripts/install-remotion-skills.sh and are not committed.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
dest="$root/.claude/skills"
latest=0; tools=0
for a in "$@"; do
  case "$a" in
    --latest) latest=1 ;;
    --tools) tools=1 ;;
    -h|--help) sed -n 2,12p "$0"; exit 0 ;;
    *) echo "unknown option: $a" >&2; exit 2 ;;
  esac
done
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT

HYPERFRAMES_CLI=0.8.149   # keep in step with motion/package.json

# repo | pinned commit | licence | note key | "src-dir:skill ..." (src-dir relative to the repo root)
SOURCES=(
  "heygen-com/hyperframes|86521b94f592bcf0ca86aba63068893cf658af16|Apache-2.0|hyperframes|skills:hyperframes skills:hyperframes-core skills:hyperframes-animation skills:hyperframes-keyframes skills:hyperframes-creative skills:hyperframes-audio skills:hyperframes-cli skills:hyperframes-registry skills:hyperframes-studio skills:media-use skills:motion-graphics skills:general-video skills:talking-head-recut skills:faceless-explainer"
  "iart-ai/motion-design-skills|3c129f769d90a1328c209c386492333c9ac62312|MIT|iart|skills:animation-principles skills:motion-art-direction skills:shot-composition skills:color-motion skills:motion-background skills:logo-animation skills:beat-sync-editing"
  "iart-ai/kinetic-typography-skills|fccc94bd325d824235ee9e715e65abde57b6513a|MIT|iart|skills:kinetic-typography"
  "iart-ai/lower-thirds-skills|aa8ef7ed9fa59d0a79fc57701e493cfd8197b5d8|MIT|iart|skills:lower-thirds"
  "iart-ai/manim-skills|a15833c44de5108a3ee68f178a1fca126aa7c6d8|MIT|iart|skills:manim"
  "iart-ai/explainer-video-skills|3e2d411b725d9a72939cf8e5eb81579e751373e7|MIT|iart|skills:diagram-animation"
  "iart-ai/data-animation-skills|8ce2709c3992490251e8a991535b1945f01c6865|MIT|iart|skills:chart-animation skills:animated-infographic"
  "iart-ai/javascript-animation-skills|f7d0882a313249cbd43f0e4e9e209b1622870253|MIT|iart|skills:javascript-animation skills:soundtrack"
  "gl-transitions/gl-transitions|b2dfdcfbec079af4a05306d32b9366aa495c5155|MIT|gltransitions|skills:gl-transitions"
)

lock="$dest/MOTION_SKILLS.lock"
echo "# written by scripts/install-motion-skills.sh — skill <- repo@commit (licence)" > "$lock.new"

for entry in "${SOURCES[@]}"; do
  IFS='|' read -r repo ref licence note skills <<<"$entry"
  dir="$tmp/${repo//\//_}"
  if [ "$latest" = 1 ]; then
    git clone -q --depth 1 "https://github.com/$repo.git" "$dir"
  else
    git init -q "$dir"
    git -C "$dir" fetch -q --depth 1 "https://github.com/$repo.git" "$ref"
    git -C "$dir" checkout -q FETCH_HEAD
  fi
  commit="$(git -C "$dir" rev-parse HEAD)"
  for pair in $skills; do
    src="$dir/${pair%%:*}/${pair#*:}"; name="${pair#*:}"
    [ -f "$src/SKILL.md" ] || { echo "missing $repo/${pair%%:*}/$name — upstream layout changed" >&2; exit 1; }
    rm -rf "$dest/$name"
    cp -r "$src" "$dest/$name"
    [ -f "$dest/$name/LICENSE" ] || cp "$dir/LICENSE" "$dest/$name/LICENSE.upstream"
    python3 "$root/scripts/_free_first_note.py" "$dest/$name/SKILL.md" "$note"
    echo "$name <- $repo@$commit ($licence)" >> "$lock.new"
    echo "installed $name  ($repo@${commit:0:7}, $licence)"
  done
  if [ "$repo" = gl-transitions/gl-transitions ]; then  # all 125 GLSL sources (npm 1.43.0 ships only 67)
    rm -rf "$root/motion/gl-transitions"; mkdir -p "$root/motion/gl-transitions"
    cp -r "$dir/transitions" "$dir/LICENSE" "$root/motion/gl-transitions/"
    echo "motion/gl-transitions <- $repo@$commit ($licence)" >> "$lock.new"
  fi
done
mv "$lock.new" "$lock"

install_tools() {
  # HyperFrames CLI + its pinned headless Chrome (Apache-2.0). No HeyGen account needed for local renders.
  (cd "$root/motion" && npm install --no-audit --no-fund)
  (cd "$root/motion" && npx --yes "hyperframes@$HYPERFRAMES_CLI" telemetry disable || true)
  (cd "$root/motion" && npx --yes "hyperframes@$HYPERFRAMES_CLI" browser ensure)
  # motion/package.json also brings playwright-core (canvas renders for /javascript-animation, /lower-thirds;
  # if no matching Chromium is installed: npx playwright install chromium) and gl-transitions (GLSL sources).
  # Manim (MIT) for maths/diagram shots. Needs cairo + pango; LaTeX only for Tex/MathTex.
  if [ -x "$root/.venv/bin/pip" ]; then
    "$root/.venv/bin/pip" install -q "manim>=0.19" || echo "manim: sudo apt-get update && sudo apt-get install libcairo2-dev libpango1.0-dev pkg-config (macOS: brew install cairo pango pkg-config), then retry" >&2
  else
    echo "no .venv yet — create it first (SETUP.md §2), then re-run with --tools for Manim" >&2
  fi
  "$root/.venv/bin/python" -m reelkit.sfx_gen 2>/dev/null || true
}
[ "$tools" = 1 ] && install_tools
echo "done — see .claude/skills/motion-editor/SKILL.md"
