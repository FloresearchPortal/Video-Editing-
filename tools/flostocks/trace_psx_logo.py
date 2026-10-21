"""Trace the PSX logo PNG into per-part vector paths (bars, letters, ring, name glyphs).
    .venv/bin/python -I tools/flostocks/trace_psx_logo.py media/library/psx/psx-logo.png <out.json>
then tools/flostocks/build_psx_layered_svg.py <out.json> media/library/psx/psx-logo-layered.svg"""
import cv2, numpy as np, json, sys
SRC = sys.argv[1]; OUT = sys.argv[2]
S = 8
im = cv2.imread(SRC, cv2.IMREAD_UNCHANGED)                      # BGRA
H, W = im.shape[:2]
big = cv2.resize(im, (W * S, H * S), interpolation=cv2.INTER_CUBIC).astype(np.float32)
b, g, r, a = [big[..., i] for i in range(4)]
alpha = a / 255.0
gold = ((r > g + 15) & (r > b + 40)).astype(np.float32) * alpha
green = ((g > r + 25) & (g > b + 10)).astype(np.float32) * alpha
comps = []
for name, m in (("green", green), ("gold", gold)):
    m = cv2.GaussianBlur(m, (0, 0), S * 0.45)
    mask = (m > 0.5).astype(np.uint8) * 255
    cnts, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    hier = hier[0] if hier is not None else []
    for i, c in enumerate(cnts):
        if hier[i][3] != -1: continue                          # holes are attached to their parent below
        area = cv2.contourArea(c)
        if area < (S * S) * 6: continue
        paths = [c]
        j = hier[i][2]
        while j != -1:
            if cv2.contourArea(cnts[j]) > S * S * 2: paths.append(cnts[j])
            j = hier[j][0]
        x, y, w, h = cv2.boundingRect(c)
        cm = np.zeros(mask.shape, np.uint8); cv2.drawContours(cm, [c], -1, 255, -1)
        col = cv2.mean(big[..., :3], mask=cm)[:3]
        d = ""
        for p in paths:
            ap = cv2.approxPolyDP(p, S * 0.18, True).reshape(-1, 2) / S
            d += "M" + " L".join(f"{px:.2f},{py:.2f}" for px, py in ap) + "Z"
        comps.append({"kind": name, "bbox": [round(x / S, 1), round(y / S, 1), round(w / S, 1), round(h / S, 1)],
                      "color": "#%02x%02x%02x" % (int(col[2]), int(col[1]), int(col[0])), "d": d, "area": area / S / S})
json.dump({"w": W, "h": H, "comps": comps}, open(OUT, "w"))
for i, c in enumerate(sorted(comps, key=lambda c: (c["kind"], c["bbox"][1], c["bbox"][0]))):
    print(c["kind"], c["bbox"], c["color"], round(c["area"]), len(c["d"]))
