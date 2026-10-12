"""Insert this repo's free-first note after a vendored SKILL.md's frontmatter (idempotent).

    python3 scripts/_free_first_note.py <SKILL.md> <hyperframes|iart|gltransitions>

Used by scripts/install-motion-skills.sh; edit the notes here, then re-run the installer.
"""
import re
import sys

MARK = "> **Free-first repo note"

NOTES = {
    "hyperframes": (
        "> **Free-first repo note (added by scripts/install-motion-skills.sh).** In this repo, editing raw "
        "talking-head footage into a reel (cuts, tracking, zooms, captions, music) is `/reel-editor`, not this "
        "skill; come here for motion graphics, through `/motion-editor`. HyperFrames is Apache-2.0 and free "
        "for everyone, so it is this repo's default engine for new motion graphics; the orchestrator is "
        "`/motion-editor` and the workspace is `motion/` (CLI pinned in `motion/package.json`: run `npx hyperframes …` "
        "from `motion/`). Stay local and free: render locally (never `cloud`, `lambda`, `cloudrun` or `publish`); "
        "do not ask the user to sign in to HeyGen or install the `heygen` CLI; run media-use as "
        "`resolve --local-only` and take SFX from its bundled Pixabay set, `media/library/sfx/` or "
        "`python -m reelkit.sfx_gen`, music from the free sources in SETUP.md, voice from local Kokoro "
        "(`npx hyperframes tts`), transcripts from `reelkit.transcribe`. Skip the `usage` check when the command "
        "is unavailable. These skills are vendored: do not run `npx hyperframes skills update`, `npx skills add` "
        "or `hyperframes init` without `HYPERFRAMES_SKIP_SKILLS=1`; a workflow skill that is not installed here "
        "falls back to `/general-video`. Refresh them with `scripts/install-motion-skills.sh`.\n"
    ),
    "iart": (
        "> **Free-first repo note (added by scripts/install-motion-skills.sh).** MIT craft skill from iart.ai; use "
        "it for the motion know-how, orchestrated by `/motion-editor`. Where it renders with Remotion, mind "
        "Remotion's licence (free only for individuals and companies of ≤3 people); otherwise build the shot "
        "in HyperFrames (`/hyperframes-core`, workspace `motion/`) or with this skill's own Chrome/canvas or "
        "Manim path. Never use paid generators (OpenRouter/Lyria, ElevenLabs, Suno…) unless the user asks: "
        "music comes from SETUP.md's free sources or a Web Audio score, SFX from `media/library/sfx/` or "
        "`python -m reelkit.sfx_gen`. Ignore links that upsell iart.ai.\n"
    ),
    "gltransitions": (
        "> **Free-first repo note (added by scripts/install-motion-skills.sh).** MIT. In this repo use the GLSL "
        "sources inside HyperFrames shader transitions or WebGL shots (all 125 sources are vendored in `motion/gl-transitions/transitions/`); "
        "the FFmpeg route needs a custom ffmpeg build, so for cuts between real clips use reelkit's transitions "
        "(`/reel-editor`) instead. Orchestrated by `/motion-editor`.\n"
    ),
}


def main() -> None:
    path, key = sys.argv[1], sys.argv[2]
    s = open(path, encoding="utf-8").read()
    if MARK in s:
        return
    m = re.match(r"---\n.*?\n---\n", s, re.S)
    if not m:
        raise SystemExit(f"{path}: no frontmatter")
    s = s[:m.end()] + "\n" + NOTES[key] + s[m.end():]
    open(path, "w", encoding="utf-8").write(s)


if __name__ == "__main__":
    main()
