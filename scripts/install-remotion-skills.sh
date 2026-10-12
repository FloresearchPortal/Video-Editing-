#!/usr/bin/env bash
# Fetch the official Remotion agent skills into .claude/skills/ (not vendored in git: the upstream
# repo publishes no licence file). Optional — only needed for custom motion graphics.
# Remotion itself is free for individuals, non-profits and companies with <=3 people.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
git clone -q --depth 1 https://github.com/remotion-dev/skills.git "$tmp/skills"
for s in best-practices captions create docs interactivity markup multimedia render studio upgrade; do
  rm -rf "$root/.claude/skills/remotion-$s"
  cp -r "$tmp/skills/skills/remotion-$s" "$root/.claude/skills/"
  f="$root/.claude/skills/remotion-$s/SKILL.md"
  # prepend the repo's free-first licence note after the frontmatter
  python3 - "$f" <<'PY'
import re, sys
p = sys.argv[1]; s = open(p).read()
note = ("> **Licence (free-first repo):** Remotion is free for individuals, non-profits and companies with "
        "≤3 people; bigger companies need a paid Remotion company licence. For captions, zooms, transitions "
        "and music use the free `/reel-editor` skill; use Remotion only for custom motion graphics.\n")
m = re.match(r"---\n.*?\n---\n", s, re.S)
if note not in s:
    s = s[:m.end()] + "\n" + note + s[m.end():]
open(p, "w").write(s)
PY
  echo "installed remotion-$s"
done
