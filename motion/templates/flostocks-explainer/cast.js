// Runtime for the Notionists cast in avatars.js (window.AVDATA).
// CAST.mount(el, name, {expr, gesture}) draws a character into `el` (an SVG with every face/gesture
// alternative stacked); CAST.expr / CAST.gesture switch alternatives at a timeline time (seek-safe
// tl.set), CAST.blinks / CAST.talk / CAST.bob add life.
(function () {
  const D = window.AVDATA;
  const EXPRS = ["neutral", "smile", "happy", "grin", "talk", "wow", "worried", "shocked", "think", "blink", "delight"];
  const GESTS = ["none", "hand", "handPhone", "point", "pointLongArm", "ok", "okLongArm", "waveLongArm", "waveOkLongArms", "shrug", "cup"];
  // extra poses built from the Notionists arms: both open palms up (helpless shrug), and a hand holding a chai cup
  const CUP = '<g class="cup"><path d="M1192,1232 h196 l-20,170 q-3,20 -24,20 h-108 q-21,0 -24,-20 Z" fill="#fff" stroke="#0B0F14" stroke-width="14" stroke-linejoin="round"/><path d="M1199,1290 h182 l-5,42 h-172 Z" fill="#38D100"/><path d="M1388,1262 q58,0 54,52 q-4,46 -64,50" fill="none" stroke="#0B0F14" stroke-width="14" stroke-linecap="round"/><path d="M1250,1200 q-16,-30 0,-60 q16,-30 0,-60 M1320,1200 q-16,-30 0,-60 q16,-30 0,-60" fill="none" stroke="#C9D3CD" stroke-width="12" stroke-linecap="round"/></g>';
  const extraGesture = (d, g) => g === "shrug" ? d.gesture.waveLongArm + `<g transform="matrix(-1 0 0 1 1744 0)">${d.gesture.waveLongArm}</g>` : g === "cup" ? d.gesture.hand + CUP : null;

  let mounted = 0;
  function mount(el, name, o = {}) {
    const d = D[name];
    const ex = o.expr || "smile", ge = o.gesture || "none";
    const part = (g, i) => {
      const k = d.exprIdx.indexOf(i);
      if (k >= 0) return EXPRS.map((e) => `<g data-x="${e}" opacity="${e === ex ? 1 : 0}">${d.expr[e][k]}</g>`).join("");
      if (i === d.gestIdx) return GESTS.map((g2) => `<g data-g="${g2}" opacity="${g2 === ge ? 1 : 0}">${g2 === "none" ? "" : extraGesture(d, g2) ?? d.gesture[g2]}</g>`).join("");
      return g;
    };
    // rig: base (head+neck skin) under the clothes, then the rest of the head, then the arm/gesture layer —
    // each in its own group so head, shoulders and arms can act separately
    const headRest = d.groups.map((g, i) => (i === 0 || i === 1 || i === d.gestIdx ? "" : part(g, i))).join("");
    const parts = [`<g class="rg-hd0">${part(d.groups[0], 0)}</g>`, `<g class="rg-bd">${part(d.groups[1], 1)}</g>`,
                   `<g class="rg-hd">${headRest}</g>`, `<g class="rg-arm">${part(d.groups[d.gestIdx], d.gestIdx)}</g>`];
    // unique SVG ids per instance: shared ids (viewboxMask) would all resolve to the first copy,
    // and when that copy's scene is hidden every other character's mask goes blank
    const n = ++mounted;
    el.innerHTML = (d.head + parts.join("") + "</g></svg>")
      .replace(/id="([^"]+)"/g, `id="$1_m${n}"`).replace(/url\(#([^)]+)\)/g, `url(#$1_m${n})`).replace(/href="#([^"]+)"/g, `href="#$1_m${n}"`);
    el.classList.add("cast");
    el.rig = { head: [el.querySelector(".rg-hd0"), el.querySelector(".rg-hd")], body: el.querySelector(".rg-bd"), arm: el.querySelector(".rg-arm") };
    return el;
  }
  const sw = (tl, el, attr, val, at) =>
    el.querySelectorAll(`[data-${attr}]`).forEach((g) => tl.set(g, { opacity: g.dataset[attr] === val ? 1 : 0 }, at));
  const expr = (tl, el, e, at) => sw(tl, el, "x", e, at);
  const gesture = (tl, el, g, at) => sw(tl, el, "g", g, at);

  // no blinking: eyes stay open (client preference); kept as a no-op so callers don't change
  function blinks() {}
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
