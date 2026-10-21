"""Build the layered PSX logo SVG (class bar / ltr / ring mask .rm / .ln0-2 .gl / #glint) from trace JSON."""
import json, sys
data = json.load(open(sys.argv[1])); out = sys.argv[2]
C = data["comps"]
GOLD = "#D1A246"
bars = sorted([c for c in C if c["kind"] == "green" and c["bbox"][1] < 60], key=lambda c: c["bbox"][0])
letters = sorted([c for c in C if c["kind"] == "green" and c["bbox"][1] >= 60], key=lambda c: c["bbox"][0])
ring = max([c for c in C if c["kind"] == "gold"], key=lambda c: c["area"])
text = [c for c in C if c["kind"] == "gold" and c is not ring]
lines = [sorted([c for c in text if lo <= c["bbox"][1] < hi], key=lambda c: c["bbox"][0]) for lo, hi in ((200, 225), (225, 255), (255, 290))]
assert len(bars) == 6 and len(letters) == 3 and [len(l) for l in lines] == [8, 13, 7], ([len(l) for l in lines])
BAR_COL = ["#106B37", "#106B37", "#109246", "#109246", "#5DB747", "#5DB747"]
LET_COL = ["#0D592D", "#109346", "#5DB747"]
svg_bars = "".join(f'<path class="bar" d="{c["d"]}" fill="{BAR_COL[i]}"/>' for i, c in enumerate(bars))
svg_lets = "".join(f'<path class="ltr" d="{c["d"]}" fill="{LET_COL[i]}"/>' for i, c in enumerate(letters))
svg_text = "".join(f'<g class="ln ln{k}">' + "".join(f'<path class="gl" d="{c["d"]}"/>' for c in l) + "</g>" for k, l in enumerate(lines))
clip = "".join(f'<path d="{c["d"]}"/>' for c in bars + letters)
# ring geometry for the draw-on mask: fitted circle, drawn from the bottom outward to both open ends
x0, y0, w, h = ring["bbox"]; cx = x0 + w / 2; r = w / 2; cy = y0 + h - r
import math
top = (y0 - cy) / r                                  # sin of the end angle (negative = above centre)
a_end = math.degrees(math.asin(max(-1, min(1, top))))   # e.g. -25
def pt(deg): return (cx + r * math.cos(math.radians(deg)), cy + r * math.sin(math.radians(deg)))
bx, by = pt(90); lx, ly = pt(180 - a_end); rx, ry = pt(a_end)
arcL = f"M{bx:.2f},{by:.2f} A{r:.2f},{r:.2f} 0 0 1 {lx:.2f},{ly:.2f}"
arcR = f"M{bx:.2f},{by:.2f} A{r:.2f},{r:.2f} 0 0 0 {rx:.2f},{ry:.2f}"
svg = f'''<svg id="psx" viewBox="0 0 {data["w"]} {data["h"]}" role="img" aria-label="Pakistan Stock Exchange Limited logo">
  <defs>
    <clipPath id="markClip">{clip}</clipPath>
    <mask id="ringMask" maskUnits="userSpaceOnUse" x="-20" y="-20" width="{data["w"] + 40}" height="{data["h"] + 40}">
      <path class="rm" d="{arcL}" pathLength="100" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="butt"/>
      <path class="rm" d="{arcR}" pathLength="100" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="butt"/>
    </mask>
    <linearGradient id="glintGrad" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <path id="ring" d="{ring["d"]}" fill="{GOLD}" mask="url(#ringMask)"/>
  <g id="bars">{svg_bars}</g>
  <g id="letters">{svg_lets}</g>
  <g id="name" fill="{GOLD}">{svg_text}</g>
  <g clip-path="url(#markClip)"><rect id="glint" x="-60" y="-10" width="46" height="170" fill="url(#glintGrad)" transform="skewX(-18)"/></g>
</svg>'''
open(out, "w").write(svg)
print("ok", len(svg), "ring", round(cx, 1), round(cy, 1), round(r, 1), round(a_end, 1))
