# PSX assets

- `psx-logo.png`, `psx-logo-on-dark.png`: Pakistan Stock Exchange logo, taken from psx.com.pk. It is the PSX's trademark. Use it only to identify the exchange in editorial and educational content (FloStocks explainers), never as an endorsement or partnership mark.
- `market.json`: a snapshot of KSE-100 and per-symbol prices from dps.psx.com.pk (date inside the file). Refresh it for every new video (see `.claude/skills/flostocks-explainer/SKILL.md` → Market data).
- `psx-logo-layered.svg`: vector trace of `psx-logo.png` split into animatable parts (6 `.bar`, 3 `.ltr`, the ring with a draw-on mask `.rm`, name glyphs `.ln0-2 .gl`, `#glint`). Rebuild with `tools/flostocks/trace_psx_logo.py` + `build_psx_layered_svg.py`.
