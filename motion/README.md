# motion/ — HyperFrames workspace (free motion graphics)

Driven by the `/motion-editor` skill (`.claude/skills/motion-editor/SKILL.md`). Setup:
`scripts/install-motion-skills.sh --tools` (or `npm install` here + `npx hyperframes browser ensure`).

```
templates/      reusable overlays (index.html + template.json); render with --variables
brands/         brand kits: brand.json tokens + OFL fonts (flostocks = default)
projects/       per-video motion work: BEATS.md + one HyperFrames project per custom shot
gl-transitions/ all 125 GLSL transitions (MIT), vendored by the installer
renders/        output (gitignored)
```

```bash
cd motion && export HYPERFRAMES_SKIP_SKILLS=1
npx hyperframes check templates/flostocks-ticker
npx hyperframes render templates/flostocks-ticker --format mov -o renders/kse.mov \
  --variables '{"symbol":"KSE-100","value":118452.36,"change":1.84}'
```
On a reel, list graphics under `"overlays"` in `timeline.json` instead — `reelkit.make_reel`
renders (cached) and composites them. Template assets are symlinks into `../../../assets/fonts`,
`../../brands/<brand>` and `../../../media/library/logos`.
