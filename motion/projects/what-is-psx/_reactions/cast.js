// Runtime for the Notionists cast in avatars.js (window.AVDATA).
// CAST.mount(el, name, {expr, gesture}) draws a character into `el` (an SVG with every face/gesture
// alternative stacked); CAST.expr / CAST.gesture switch alternatives at a timeline time (seek-safe
// tl.set), CAST.blinks / CAST.talk / CAST.bob add life.
(function () {
  const D = window.AVDATA;
  const EXPRS = ["neutral", "smile", "happy", "grin", "talk", "wow", "worried", "shocked", "think", "blink"];
  const GESTS = ["none", "hand", "handPhone", "point", "pointLongArm", "ok", "okLongArm", "waveLongArm", "waveOkLongArms"];

  let mounted = 0;
  function mount(el, name, o = {}) {
    const d = D[name];
    const ex = o.expr || "smile", ge = o.gesture || "none";
    const parts = d.groups.map((g, i) => {
      const k = d.exprIdx.indexOf(i);
      if (k >= 0) return EXPRS.map((e) => `<g data-x="${e}" opacity="${e === ex ? 1 : 0}">${d.expr[e][k]}</g>`).join("");
      if (i === d.gestIdx) return GESTS.map((g2) => `<g data-g="${g2}" opacity="${g2 === ge ? 1 : 0}">${g2 === "none" ? "" : d.gesture[g2]}</g>`).join("");
      return g;
    });
    // unique SVG ids per instance: shared ids (viewboxMask) would all resolve to the first copy,
    // and when that copy's scene is hidden every other character's mask goes blank
    const n = ++mounted;
    el.innerHTML = (d.head + parts.join("") + "</g></svg>")
      .replace(/id="([^"]+)"/g, `id="$1_m${n}"`).replace(/url\(#([^)]+)\)/g, `url(#$1_m${n})`).replace(/href="#([^"]+)"/g, `href="#$1_m${n}"`);
    el.classList.add("cast");
    return el;
  }
  const sw = (tl, el, attr, val, at) =>
    el.querySelectorAll(`[data-${attr}]`).forEach((g) => tl.set(g, { opacity: g.dataset[attr] === val ? 1 : 0 }, at));
  const expr = (tl, el, e, at) => sw(tl, el, "x", e, at);
  const gesture = (tl, el, g, at) => sw(tl, el, "g", g, at);

  // blink: swap to the blink face for 0.12 s, then back to `face` (deterministic spacing)
  function blinks(tl, el, t0, t1, face = "smile", seed = 1) {
    for (let t = t0 + 0.6 + (seed % 5) * 0.29; t < t1 - 0.3; t += 2.3 + ((seed * 7 + Math.floor(t)) % 9) * 0.13) {
      expr(tl, el, "blink", t); expr(tl, el, face, t + 0.12);
    }
  }
  // lip flap on a list of word times, ending on `rest`
  function talk(tl, el, times, rest = "smile") {
    times.forEach((t, i) => expr(tl, el, i % 2 ? "smile" : "talk", t));
    if (times.length) expr(tl, el, rest, times[times.length - 1] + 0.22);
  }
  // gentle idle bob (y + tiny rotation) between t0 and t1
  function bob(tl, el, t0, t1, amp = 6) {
    for (let t = t0; t < t1 - 0.9; t += 1.8) {
      tl.to(el, { y: -amp, rotation: 0.8, duration: 0.9, ease: "sine.inOut" }, t)
        .to(el, { y: 0, rotation: -0.6, duration: 0.9, ease: "sine.inOut" }, t + 0.9);
    }
  }
  window.CAST = { mount, expr, gesture, blinks, talk, bob, EXPRS, GESTS };
})();
