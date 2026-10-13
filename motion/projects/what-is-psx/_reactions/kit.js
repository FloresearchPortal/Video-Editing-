// FloStocks kinetic kit v2 — dark trading-terminal look, camera rig, per-letter kinetic type,
// rolling digits, ticker tapes, candles, gauges, sticker characters with acted reactions.
// Everything lands on ONE paused GSAP timeline (K.tl) at absolute VO times.
(function () {
  const C = { ink: "#0B0F14", text: "#0B0F14", night: "#0B0F14", g: "#38D100", gt: "#1E9600", g2: "#2AA300", g3: "#1F7A00", lime: "#7CFF4F",
              white: "#FFFFFF", mute: "#6B7570", red: "#E4002B", gold: "#E6A817", panel: "#FFFFFF", line: "#E3E9E5", bg: "#F7F8F7" };
  const tl = gsap.timeline({ paused: true });
  const stage = document.getElementById("stage");

  // ── determinism ──────────────────────────────────────────────────────────
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const pick = (a) => a[Math.floor(rnd() * a.length)];

  function el(parent, css = {}, html = "", cls = "") {
    const d = document.createElement("div");
    d.className = ("abs " + cls).trim();
    for (const [k, v] of Object.entries(css)) d.style[k] = typeof v === "number" && !["opacity", "zIndex", "fontWeight", "lineHeight", "flexGrow"].includes(k) ? v + "px" : v;
    d.innerHTML = html;
    (parent || stage).appendChild(d);
    return d;
  }

  // ── world: background, grid, glow, grain, vignette, camera ────────────────
  const bg = el(stage, { left: 0, top: 0, width: 1080, height: 1920, background: `radial-gradient(90% 60% at 50% 42%, #FFFFFF 0%, #F2F7EF 75%)` });
  const grid = el(stage, { left: -200, top: -200, width: 1480, height: 2320, opacity: 0.55,
    backgroundImage: "linear-gradient(rgba(31,122,0,.06) 2px, transparent 2px), linear-gradient(90deg, rgba(31,122,0,.06) 2px, transparent 2px)",
    backgroundSize: "90px 90px" });
  tl.fromTo(grid, { x: 0, y: 0 }, { x: -90, y: -180, duration: 114, ease: "none" }, 0);
  const glow = el(stage, { left: 140, top: 560, width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,209,0,.10), rgba(56,209,0,0) 65%)" });
  tl.fromTo(glow, { scale: 0.9 }, { scale: 1.15, duration: 6, yoyo: true, repeat: 18, ease: "sine.inOut" }, 0);
  const cam = el(stage, { left: 0, top: 0, width: 1080, height: 1920 }, "", "cam");   // scenes live in the camera
  const fx = el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 60, pointerEvents: "none" }, "", "fx");
  el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 70, pointerEvents: "none",
    background: "radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 60%, rgba(31,60,20,.08) 100%)" });
  el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 71, pointerEvents: "none", opacity: 0.05, mixBlendMode: "multiply",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")` });

  // camera moves
  const punch = (t, s = 1.12, d = 0.35, x = 0, y = 0) => tl.to(cam, { scale: s, x, y, duration: d, ease: "expo.out" }, t);
  const camReset = (t, d = 0.4) => tl.to(cam, { scale: 1, x: 0, y: 0, rotation: 0, duration: d, ease: "expo.inOut" }, t);
  function shake(t, amp = 18, n = 6, target = cam) {
    for (let i = 0; i < n; i++) tl.to(target, { x: (i % 2 ? -1 : 1) * amp * (1 - i / n), y: (i % 3 - 1) * amp * 0.5 * (1 - i / n), duration: 0.04, ease: "none" }, t + i * 0.04);
    tl.to(target, { x: 0, y: 0, duration: 0.08 }, t + n * 0.04);
  }
  function flash(t, color = "#38D100", peak = 0.35, d = 0.18) {
    const f = el(fx, { left: 0, top: 0, width: 1080, height: 1920, background: color, opacity: 0 });
    tl.to(f, { opacity: peak, duration: 0.03 }, t).to(f, { opacity: 0, duration: d, ease: "power2.out" }, t + 0.03);
  }

  // scene layer: visible on [t0, t1); slow camera push inside the scene keeps every hold alive
  function scene(t0, t1, o = {}) {
    const s = el(cam, { left: 0, top: 0, width: 1080, height: 1920 }, "", "scene");
    if (t0 > 0) tl.set(s, { autoAlpha: 0 }, 0).set(s, { autoAlpha: 1 }, t0);
    tl.set(s, { autoAlpha: 0 }, t1);
    if (o.push !== false) tl.fromTo(s, { scale: 1 }, { scale: o.push || 1.06, duration: t1 - t0, ease: "none", immediateRender: false }, t0);
    return s;
  }

  // ── kinetic type ──────────────────────────────────────────────────────────
  // text with "|" = line break, "*word*" = accent colour. Returns box with .chars and .words
  function kin(parent, text, o = {}) {
    const size = o.size || 140;
    const box = el(parent, { left: o.x ?? 40, top: o.y ?? 600, width: o.w ?? 1000, textAlign: o.align || "center",
      font: `${o.weight || 800} ${size}px/${o.lh || 1.02} ${o.font || "Manrope"}`, color: o.color || C.text,
      letterSpacing: (o.track ?? -0.035) + "em", textTransform: o.upper === false ? "none" : "uppercase" }, "", "kin");
    box.chars = []; box.words = [];
    text.split(" ").forEach((w) => {
      if (w === "|") { box.appendChild(document.createElement("br")); return; }
      const acc = /^\*.*\*[,.!?]*$/.test(w);
      const clean = w.replace(/\*/g, "");
      const ws = document.createElement("span"); ws.className = "kw";
      if (acc) { ws.style.color = o.accent || C.gt; }
      [...clean].forEach((ch) => { const c = document.createElement("span"); c.className = "kc"; c.textContent = ch; ws.appendChild(c); box.chars.push(c); });
      box.appendChild(ws); box.appendChild(document.createTextNode(" ")); box.words.push(ws);
    });
    return box;
  }
  const charsIn = {
    slam: (b, t, st = 0.022) => tl.fromTo(b.chars, { scale: 2.6, opacity: 0, filter: "blur(14px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.36, ease: "expo.out", stagger: st }, t),
    flip: (b, t, st = 0.03) => tl.fromTo(b.chars, { rotationX: -95, y: 50, opacity: 0, transformPerspective: 700, transformOrigin: "50% 100%" }, { rotationX: 0, y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)", stagger: st }, t),
    rise: (b, t, st = 0.025) => tl.fromTo(b.chars, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.42, ease: "expo.out", stagger: st }, t),
    drop: (b, t, st = 0.03) => tl.fromTo(b.chars, { yPercent: -160, rotation: -14, opacity: 0 }, { yPercent: 0, rotation: 0, opacity: 1, duration: 0.55, ease: "bounce.out", stagger: st }, t),
    stretch: (b, t) => tl.fromTo(b, { scaleX: 2.6, scaleY: 0.25, opacity: 0, filter: "blur(10px)" }, { scaleX: 1, scaleY: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }, t),
    words: (b, t, st = 0.09) => tl.fromTo(b.words, { scale: 0.3, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.42, ease: "back.out(2.2)", stagger: st }, t),
  };
  // scramble: characters cycle through glyphs then lock left→right
  function scramble(b, t, d = 0.6, set = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%▲▼") {
    const finals = b.chars.map((c) => c.textContent);
    b.chars.forEach((c, i) => {
      const lock = t + d * (i + 1) / b.chars.length;
      for (let k = t; k < lock; k += 0.05) tl.set(c, { textContent: set[Math.floor(rnd() * set.length)] }, k);
      tl.set(c, { textContent: finals[i] }, lock);
    });
    tl.fromTo(b, { opacity: 0 }, { opacity: 1, duration: 0.05 }, t);
  }
  const charsOut = {
    blast: (b, t) => b.chars.forEach((c, i) => tl.to(c, { x: (rnd() - 0.5) * 900, y: (rnd() - 0.5) * 900, rotation: (rnd() - 0.5) * 360, scale: 0.4, opacity: 0, duration: 0.45, ease: "power3.in" }, t + i * 0.006)),
    zoom: (b, t) => tl.to(b, { scale: 4, opacity: 0, filter: "blur(16px)", duration: 0.35, ease: "power3.in" }, t),
    drop: (b, t) => tl.to(b.chars, { yPercent: 160, opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.01 }, t),
    up: (b, t) => tl.to(b, { y: -220, opacity: 0, duration: 0.3, ease: "power3.in" }, t),
  };
  // skewed brand bar that wipes in behind a box
  function bar(parent, x, y, w, h, color = C.g, t, d = 0.35) {
    const b = el(parent, { left: x, top: y, width: w, height: h, background: color, borderRadius: 12, transformOrigin: "0% 50%" });
    gsap.set(b, { skewX: -14 });
    tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, duration: d, ease: "expo.out", immediateRender: true }, t);
    return b;
  }

  // ── rolling digits (slot machine) ─────────────────────────────────────────
  // fmt string like "Rs 1,00,000": digits roll from `from` value string of same shape
  function roller(parent, o) {
    const box = el(parent, { left: o.x, top: o.y, width: o.w || 1080, height: o.size * 1.2, textAlign: "center",
      font: `600 ${o.size}px/1.2 'IBM Plex Mono'`, color: o.color || C.text, whiteSpace: "nowrap" }, "", "roller");
    box.cols = [];
    [...o.text].forEach((ch) => {
      if (/\d/.test(ch)) {
        const col = document.createElement("span"); col.className = "rc";
        col.innerHTML = `<span class="rs">${Array.from({ length: 30 }, (_, i) => i % 10).join("<br>")}</span>`;
        col.dataset.d = ch; box.appendChild(col); box.cols.push(col);
      } else { const s = document.createElement("span"); s.textContent = ch; box.appendChild(s); }
    });
    tl.set(box, { autoAlpha: 0 }, 0);           // hidden until it rolls
    return box;
  }
  function roll(box, t, d = 1.0) {
    tl.set(box, { autoAlpha: 1 }, t);
    box.cols.forEach((col, i) => {
      const target = 20 + Number(col.dataset.d);       // land in the third cycle
      tl.fromTo(col.firstChild, { yPercent: 0 }, { yPercent: -(target / 30) * 100, duration: d + i * 0.06, ease: "power3.out", immediateRender: true }, t);
    });
  }

  // ── characters as acted stickers ──────────────────────────────────────────
  const STK = "drop-shadow(0 16px 20px rgba(20,40,20,.18))";
  function who(parent, name, x, y, size, o = {}) {
    const box = el(parent, { left: x, top: y, width: size, height: size }, "", "who");
    const inner = el(box, { left: 0, top: 0, width: size, height: size, filter: STK, transformOrigin: "50% 100%" });
    CAST.mount(inner, name, o);
    box.av = inner; box.size = size;
    return box;
  }
  const SYM = {
    ex: `<svg viewBox="0 0 120 200"><path d="M40,10 h40 l-8,120 h-24Z M60,150 a22,22 0 1 1 0,44 a22,22 0 1 1 0,-44Z" fill="${C.red}" stroke="#0B0F14" stroke-width="6" stroke-linejoin="round"/></svg>`,
    q: `<svg viewBox="0 0 140 200"><path d="M30,60 a40,40 0 1 1 64,30 c-14,10 -20,18 -20,38" fill="none" stroke="${C.g}" stroke-width="26" stroke-linecap="round"/><circle cx="74" cy="176" r="16" fill="${C.g}"/></svg>`,
    sweat: `<svg viewBox="0 0 60 90"><path d="M30,4 C30,4 4,46 4,60 a26,26 0 0 0 52,0 C56,46 30,4 30,4Z" fill="#6EC8FF" stroke="#0B0F14" stroke-width="5"/></svg>`,
    star: `<svg viewBox="0 0 100 100"><path d="M50,4 L61,39 L96,50 L61,61 L50,96 L39,61 L4,50 L39,39Z" fill="${C.gold}" stroke="#0B0F14" stroke-width="4" stroke-linejoin="round"/></svg>`,
    heart: `<svg viewBox="0 0 100 90"><path d="M50,86 C10,58 4,36 14,20 C26,2 46,8 50,24 C54,8 74,2 86,20 C96,36 90,58 50,86Z" fill="${C.red}" stroke="#0B0F14" stroke-width="5"/></svg>`,
    burst: (c = C.g) => `<svg viewBox="-100 -100 200 200">${Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2; return `<line x1="${Math.cos(a) * 52}" y1="${Math.sin(a) * 52}" x2="${Math.cos(a) * 96}" y2="${Math.sin(a) * 96}" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`; }).join("")}</svg>`,
    wobble: `<svg viewBox="0 0 120 60"><path d="M6,30 q14,-22 28,0 t28,0 t28,0 t28,0" fill="none" stroke="#6EC8FF" stroke-width="8" stroke-linecap="round"/></svg>`,
  };
  const sym = (parent, k, x, y, w, h, arg) => el(parent, { left: x, top: y, width: w, height: h }, typeof SYM[k] === "function" ? SYM[k](arg) : SYM[k], "icon");
  // head anchor inside a Notionists box (fraction of size)
  const head = (w) => ({ x: w.size * 0.5, y: w.size * 0.3 });

  // corporate acting: face change + restrained body motion + one thin ring; no cartoon symbols
  function pulse(w, t, color, scaleTo = 1.25) {
    const r = el(w, { left: w.size * 0.12, top: w.size * 0.02, width: w.size * 0.76, height: w.size * 0.76, borderRadius: "50%", border: `5px solid ${color}`, opacity: 0 });
    r.style.zIndex = -1;
    tl.fromTo(r, { scale: 0.8, opacity: 0.7 }, { scale: scaleTo, opacity: 0, duration: 0.7, ease: "power2.out" }, t);
  }
  // expressive but restrained: clear faces + readable body acting + one small brand-coloured accent
  function sparkle(w, x, y, t, sz = 46) {
    const sp = el(w, { left: x, top: y, width: sz, height: sz }, `<svg viewBox="0 0 100 100"><path d="M50,0 C54,36 64,46 100,50 C64,54 54,64 50,100 C46,64 36,54 0,50 C36,46 46,36 50,0Z" fill="${C.g}"/></svg>`);
    tl.fromTo(sp, { scale: 0, rotation: -45, opacity: 1 }, { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(3)" }, t).to(sp, { scale: 0, opacity: 0, duration: 0.25 }, t + 0.8);
  }
  // ── body rig (cast.js splits every character into head / shoulders / arm) ──
  // svgOrigin is in Notionists viewBox units (1744²): neck ≈ (860,1130), shoulders anchored at the bottom edge,
  // arms pivot where they enter the frame. Acting = anticipation → action → follow-through → settle.
  const NECK = "860 1130", HIPS = "860 1760";
  const ARM_O = { hand: "1290 1760", handPhone: "1300 1760", point: "1290 1760", ok: "1270 1760",
                  pointLongArm: "1520 1760", okLongArm: "1520 1760", waveLongArm: "1520 1760", waveOkLongArms: "872 1760" };
  // pose(w, t, {h:[rot, x, y], b:[scaleY, scaleX], a:[rot, scaleY], g:gesture}, dur, ease) — the head rides
  // on the shoulders, so a shrug (b scaleY > 1) lifts the head by the same amount
  function pose(w, t, p, d = 0.25, ease = "power2.out") {
    const r = w.av.rig; if (!r) return;
    const [hr = 0, hx = 0, hy = 0] = p.h || [], [sy = 1, sx = 1] = p.b || [], [ar = 0, as = 1] = p.a || [];
    tl.to(r.head, { rotation: hr, x: hx, y: hy - (sy - 1) * 680, svgOrigin: NECK, duration: d, ease }, t);
    tl.to(r.body, { scaleY: sy, scaleX: sx, svgOrigin: HIPS, duration: d, ease }, t);
    tl.to(r.arm, { rotation: ar, scaleY: as, svgOrigin: ARM_O[p.g] || ARM_O.waveLongArm, duration: d, ease }, t);
  }
  const rest = (w, t, d = 0.45, g) => pose(w, t, { g }, d, "power2.out");
  // an arm flies in: hidden gesture swaps at t, arm grows from its root (no pop-in)
  function armIn(w, t, g, rot = 0) {
    CAST.gesture(tl, w.av, g, t);
    tl.fromTo(w.av.rig.arm, { scaleY: 0.55, rotation: rot - 10, svgOrigin: ARM_O[g] }, { scaleY: 1, rotation: rot, svgOrigin: ARM_O[g], duration: 0.28, ease: "power2.out", immediateRender: false }, t);
  }
  const wag = (w, t, g, amp, n, dt) => { for (let k = 0; k < n; k++) tl.to(w.av.rig.arm, { rotation: k % 2 ? -amp : amp, svgOrigin: ARM_O[g], duration: dt, ease: "sine.inOut" }, t + k * dt); };
  const nods = (w, t, amp, n, dt, base = 0) => { for (let k = 0; k < n; k++) tl.to(w.av.rig.head, { rotation: base + (k % 2 ? -amp * 0.4 : amp), svgOrigin: NECK, duration: dt, ease: "sine.inOut" }, t + k * dt); };

  const react = {
    // JOY: crouch, then both arms shoot up, chest lifts, head thrown back, hop; arms pump, head bobs
    joy(w, t, o = {}) {
      const g = o.gesture || "waveOkLongArms", s = w.size;
      CAST.expr(tl, w.av, o.face || "grin", t);
      pose(w, t, { h: [3, 0, 18], b: [0.95, 1.03], g }, 0.1, "power2.in");
      armIn(w, t + 0.1, g);
      pose(w, t + 0.1, { h: [-7, 0, -14], b: [1.06, 0.98], g }, 0.2);
      wag(w, t + 0.42, g, 6, 4, 0.16); nods(w, t + 0.42, 5, 4, 0.16, -2);
      rest(w, t + 1.08, 0.45, g);
      pulse(w, t + 0.1, o.color || C.g);
    },
    // SHOCK: hand flies up palm-out, whole body recoils back, shoulders jump, head jerks back; frozen tremble; slow recover
    shock(w, t, o = {}) {
      const g = o.gesture || "waveLongArm", s = w.size;
      CAST.expr(tl, w.av, o.face || "shocked", t);
      armIn(w, t, g, -4);
      pose(w, t, { h: [-9, -18, -26], b: [1.07, 0.96], a: [-4, 1], g }, 0.09, "power3.out");
      tl.to(w.av, { x: -s * 0.05, rotation: -7, scale: 1.06, transformOrigin: "50% 100%", duration: 0.09, ease: "power3.out" }, t)
        .to(w.av, { x: -s * 0.035, rotation: -5, scale: 1.03, duration: 0.5, ease: "sine.out" }, t + 0.09)
        .to(w.av, { x: 0, rotation: 0, scale: 1, duration: 0.5, ease: "power2.out" }, t + 0.95);
      for (let k = 0; k < 6; k++) tl.to(w.av.rig.head, { x: -18 + (k % 2 ? -5 : 5), svgOrigin: NECK, duration: 0.05 }, t + 0.12 + k * 0.05);
      pose(w, t + 0.95, { h: [-2, 0, 0], b: [1.02, 1], a: [0, 1], g }, 0.5, "sine.inOut");
      pulse(w, t, o.ring || C.red, 1.2);
      const h = head(w);
      const ex = el(w, { left: h.x + s * 0.24, top: h.y - s * 0.38, width: 34, height: 70 }, `<svg viewBox="0 0 34 70"><rect x="8" y="0" width="18" height="44" rx="9" fill="${C.red}"/><circle cx="17" cy="60" r="9" fill="${C.red}"/></svg>`);
      tl.fromTo(ex, { scale: 0, y: 20 }, { scale: 1, y: 0, rotation: 10, duration: 0.3, ease: "power2.out" }, t).to(ex, { scale: 0, opacity: 0, duration: 0.2 }, t + 1.0);
    },
    // WORRY: hand to chest, shoulders hunch in, head drops and shakes slowly, weight sways
    worry(w, t, d = 1.6) {
      const g = "hand", s = w.size;
      CAST.expr(tl, w.av, "worried", t);
      armIn(w, t, g);
      pose(w, t, { h: [7, 6, 34], b: [0.93, 1.03], g }, 0.55, "power2.out");
      tl.to(w.av, { y: s * 0.05, rotation: -3, scale: 0.97, transformOrigin: "50% 100%", duration: 0.6, ease: "power2.out" }, t);
      for (let k = 0; k < 4; k++) tl.to(w.av.rig.head, { rotation: k % 2 ? 9 : 2, x: k % 2 ? 10 : 0, svgOrigin: NECK, duration: 0.28, ease: "sine.inOut" }, t + 0.55 + k * 0.28);
      for (let k = 0; k < 3; k++) tl.to(w.av, { x: k % 2 ? 5 : -5, duration: Math.max(0.2, (d - 0.6) / 3), ease: "sine.inOut" }, t + 0.6 + k * Math.max(0.2, (d - 0.6) / 3));
      tl.to(w.av, { x: 0, duration: 0.2 }, t + d);
    },
    // THINK: finger to chin, head tilts and turns up, weight shifts onto one side, finger taps; head straightens on the idea
    think(w, t, d = 1.4) {
      const g = "hand", s = w.size;
      CAST.expr(tl, w.av, "think", t);
      armIn(w, t, g);
      pose(w, t, { h: [10, 14, -8], b: [1.01, 1], g }, 0.5, "sine.inOut");
      tl.to(w.av, { rotation: 4, x: s * 0.02, transformOrigin: "50% 100%", duration: 0.55, ease: "sine.inOut" }, t);
      for (let k = 0; k < 3; k++) tl.to(w.av.rig.arm, { rotation: -5, svgOrigin: ARM_O[g], duration: 0.12, yoyo: true, repeat: 1, ease: "sine.inOut" }, t + 0.55 + k * 0.32);
      pose(w, t + d * 0.75, { h: [-3, 0, -10], b: [1.04, 1], g }, 0.25, "power2.out");
      tl.to(w.av, { rotation: 0, x: 0, duration: 0.3, ease: "power2.out" }, t + d * 0.75);
      const h = head(w);
      const dots = el(w, { left: h.x + s * 0.2, top: h.y - s * 0.34, width: 96, height: 44, borderRadius: 22, background: "#fff", border: "3px solid #E3E9E5", boxShadow: "0 8px 18px rgba(20,40,20,.12)" },
        `<div style="display:flex;gap:9px;justify-content:center;align-items:center;height:100%">${[0, 1, 2].map(() => '<i style="width:12px;height:12px;border-radius:6px;background:#6B7570;display:block"></i>').join("")}</div>`);
      tl.fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, t).to(dots, { scale: 0, opacity: 0, duration: 0.2 }, t + d);
      dots.querySelectorAll("i").forEach((d2, i) => tl.to(d2, { opacity: 0.35, duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, t + 0.3 + i * 0.1));
    },
    // LOVE ("kamaal!"): OK-sign shoots up, head tilts happily, shoulder shimmy with two little hops
    love(w, t, o = {}) {
      const g = o.gesture || "okLongArm", s = w.size;
      CAST.expr(tl, w.av, "delight", t);
      armIn(w, t, g);
      pose(w, t, { h: [-8, -6, -12], b: [1.05, 1], g }, 0.2);
      tl.to(w.av, { rotation: -4, duration: 0.35, ease: "sine.inOut" }, t)
        .to(w.av, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, t + 0.8);
      for (let k = 0; k < 4; k++) pose(w, t + 0.2 + k * 0.15, { h: [k % 2 ? -8 : 4, 0, -12], b: [k % 2 ? 1.06 : 0.99, k % 2 ? 0.99 : 1.02], a: [k % 2 ? -5 : 5, 1], g }, 0.15, "sine.inOut");
      rest(w, t + 0.9, 0.4, g);
      pulse(w, t, C.g, 1.22); pulse(w, t + 0.34, C.g, 1.3);
    },
    // BUY: leans in and pumps the pointing arm, head nodding along — urgency
    buy(w, t, d = 1.4) {
      const g = "pointLongArm", s = w.size;
      CAST.expr(tl, w.av, "grin", t);
      armIn(w, t, g);
      tl.to(w.av, { rotation: 5, x: s * 0.03, transformOrigin: "50% 100%", duration: 0.2, ease: "power2.out" }, t);
      pose(w, t, { h: [4, 8, 6], b: [1.03, 1], g }, 0.2);
      const n = Math.max(2, Math.round((d - 0.3) / 0.22));
      for (let k = 0; k < n; k++) { tl.to(w.av.rig.arm, { rotation: -6, svgOrigin: ARM_O[g], duration: 0.1, yoyo: true, repeat: 1, ease: "power2.out" }, t + 0.25 + k * 0.22);
        tl.to(w.av.rig.head, { rotation: 8, svgOrigin: NECK, duration: 0.1, yoyo: true, repeat: 1, ease: "sine.inOut" }, t + 0.25 + k * 0.22); }
      tl.to(w.av, { rotation: 0, x: 0, duration: 0.35, ease: "power2.out" }, t + d);
      rest(w, t + d, 0.35, g);
    },
    // PROUD (bharosa): OK at the chest, chest puffs out, chin up, two firm nods
    proud(w, t, o = {}) {
      const g = "ok", s = w.size;
      CAST.expr(tl, w.av, o.face || "happy", t);
      armIn(w, t, g);
      pose(w, t, { h: [-5, 0, -22], b: [1.07, 1.03], g }, 0.3, "power2.out");
      tl.to(w.av, { scale: 1.04, transformOrigin: "50% 100%", duration: 0.3, ease: "power2.out" }, t);
      nods(w, t + 0.45, 7, 4, 0.16, -5);
      pose(w, t + 1.2, { h: [-2, 0, -8], b: [1.03, 1.01], g }, 0.4, "sine.inOut");
      tl.to(w.av, { scale: 1, duration: 0.4, ease: "sine.inOut" }, t + 1.2);
      pulse(w, t, o.color || C.g, 1.25);
    },
  };
  const talk = (w, times, rest = "smile") => { CAST.talk(tl, w.av, times, rest); };
  // idle: slow breathing on the inner <svg> (separate element from the acted parts, so no tween fights)
  const life = (w, t0, t1, face = "smile", s = 1) => {
    const sv = w.av.querySelector("svg"); if (!sv) return;
    const ph = (s * 0.37) % 1.6;
    for (let t = t0 + ph; t < t1 - 1.6; t += 3.2)
      tl.to(sv, { scaleY: 1.014, scaleX: 0.996, transformOrigin: "50% 100%", duration: 1.6, ease: "sine.inOut" }, t).to(sv, { scaleY: 1, scaleX: 1, duration: 1.6, ease: "sine.inOut" }, t + 1.6);
  };
  const enter = (w, t, from = "bottom") => {
    const v = { bottom: { y: 500 }, left: { x: -900 }, right: { x: 900 }, pop: { scale: 0.2 } }[from];
    tl.fromTo(w, { ...v, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, t);
  };

  // ── data visuals ──────────────────────────────────────────────────────────
  function tape(parent, items, o) {
    const row = el(parent, { left: 0, top: o.y, height: o.h || 90, whiteSpace: "nowrap", font: `600 ${o.size || 46}px/${o.h || 90}px 'IBM Plex Mono'` }, "", "tape");
    const one = items.map(([s, p, ch]) => `<span style="margin-right:56px"><b style="color:${C.text}">${s}</b> <span style="color:${C.mute}">${p}</span> <span style="color:${ch >= 0 ? C.gt : C.red}">${ch >= 0 ? "▲" : "▼"} ${Math.abs(ch).toFixed(2)}%</span></span>`).join("");
    row.innerHTML = one + one + one;
    if (o.bg) row.style.background = o.bg;
    return row;
  }
  function candles(parent, o) {
    const n = o.n || 18, W = o.w, H = o.h, cw = W / n;
    let v = 0.5; const data = [];
    for (let i = 0; i < n; i++) { const dir = o.trend(i / (n - 1), rnd); const open = v; v = Math.min(0.95, Math.max(0.05, v + dir)); data.push([open, v, Math.max(open, v) + rnd() * 0.06, Math.min(open, v) - rnd() * 0.06]); }
    const svg = data.map(([op, cl, hi, lo], i) => {
      const up = cl >= op, x = i * cw + cw * 0.2, w = cw * 0.6, c = up ? C.g : C.red;
      const y1 = H * (1 - Math.max(op, cl)), y2 = H * (1 - Math.min(op, cl));
      return `<g class="cdl"><line x1="${x + w / 2}" x2="${x + w / 2}" y1="${H * (1 - hi)}" y2="${H * (1 - lo)}" stroke="${c}" stroke-width="5"/><rect x="${x}" y="${y1}" width="${w}" height="${Math.max(6, y2 - y1)}" rx="4" fill="${c}"/></g>`;
    }).join("");
    const box = el(parent, { left: o.x, top: o.y, width: W, height: H }, `<svg viewBox="0 0 ${W} ${H}" style="overflow:visible">${svg}</svg>`);
    box.c = box.querySelectorAll(".cdl");
    box.grow = (t, st = 0.05) => tl.fromTo(box.c, { scaleY: 0, opacity: 0, transformOrigin: "50% 50%" }, { scaleY: 1, opacity: 1, duration: 0.3, ease: "back.out(2)", stagger: st }, t);
    return box;
  }
  function line(parent, pts, o) {
    const W = o.w, H = o.h;
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${(x * W).toFixed(1)},${((1 - y) * H).toFixed(1)}`).join(" ");
    const box = el(parent, { left: o.x, top: o.y, width: W, height: H },
      `<svg viewBox="0 0 ${W} ${H}" style="overflow:visible"><path class="ln" d="${d}" fill="none" stroke="${o.color || C.g}" stroke-width="${o.sw || 12}" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 14px ${o.color || C.g})"/></svg>`);
    const p = box.querySelector(".ln"), len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    box.draw = (t, dd = 1) => tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: dd, ease: "power2.inOut", immediateRender: false }, t);
    box.path = p;
    return box;
  }
  // semicircle gauge with needle; v in 0..1
  function gauge(parent, label, o) {
    const box = el(parent, { left: o.x, top: o.y, width: 440, height: 300 },
      `<svg viewBox="0 0 440 300"><path d="M40,240 A180,180 0 0 1 400,240" fill="none" stroke="#E3E9E5" stroke-width="34" stroke-linecap="round"/>
       <path class="arc" d="M40,240 A180,180 0 0 1 400,240" fill="none" stroke="${o.color || C.g}" stroke-width="34" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
       <g class="needle"><path d="M220,240 L214,90 L226,90Z" fill="#0B0F14"/></g><circle cx="220" cy="240" r="22" fill="#0B0F14"/></svg>
       <div class="abs" style="left:0;top:262px;width:440px;text-align:center;font:800 40px Manrope;color:#0B0F14;letter-spacing:.06em">${label}</div>`);
    const needle = box.querySelector(".needle"), arc = box.querySelector(".arc");
    gsap.set(needle, { rotation: -90 + (o.start ?? 0.2) * 180, svgOrigin: "220 240" });
    gsap.set(arc, { strokeDashoffset: 100 - (o.start ?? 0.2) * 100 });
    box.to = (v, t, d = 0.9) => tl.to(needle, { rotation: -90 + v * 180, svgOrigin: "220 240", duration: d, ease: "elastic.out(1,0.5)" }, t).to(arc, { strokeDashoffset: 100 - v * 100, duration: d * 0.7, ease: "power3.out" }, t);
    return box;
  }

  // ── transitions ────────────────────────────────────────────────────────────
  function wipe(cut, colors = [C.g, C.g3, C.night]) {
    const bars = colors.map((c, i) => el(fx, { left: -300 + i * 470, top: 0, width: 760, height: 1920, background: c }));
    bars.forEach((b) => gsap.set(b, { skewX: -16, yPercent: 120 }));
    tl.to(bars, { yPercent: 0, duration: 0.3, ease: "power3.in", stagger: 0.03 }, cut - 0.36)
      .to(bars, { yPercent: -120, duration: 0.34, ease: "power3.out", stagger: 0.03 }, cut + 0.03);
  }
  function slices(cut, color = C.g3, n = 6) {
    const s = Array.from({ length: n }, (_, i) => el(fx, { left: 0, top: i * (1920 / n), width: 1080, height: 1920 / n + 2, background: color }));
    s.forEach((b, i) => gsap.set(b, { xPercent: i % 2 ? 100 : -100 }));
    tl.to(s, { xPercent: 0, duration: 0.24, ease: "power3.in", stagger: 0.02 }, cut - 0.3)
      .to(s, { xPercent: (i) => (i % 2 ? -100 : 100), duration: 0.28, ease: "power3.out", stagger: 0.02 }, cut + 0.02);
  }
  function whip(outS, inS, t, dir = -1) {
    tl.to(outS, { x: dir * 1200, filter: "blur(24px)", duration: 0.26, ease: "power3.in" }, t - 0.26)
      .fromTo(inS, { x: -dir * 1200, filter: "blur(24px)" }, { x: 0, filter: "blur(0px)", duration: 0.32, ease: "power3.out", immediateRender: false }, t);
  }
  function zoomThrough(outS, inS, t, ox = "50%", oy = "45%") {
    tl.to(outS, { scale: 5, opacity: 0, filter: "blur(14px)", duration: 0.3, ease: "power3.in", transformOrigin: `${ox} ${oy}` }, t - 0.3)
      .fromTo(inS, { scale: 0.4, opacity: 0, filter: "blur(10px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out", immediateRender: false }, t);
  }
  function glitch(t, d = 0.35) {
    const r = el(fx, { left: 0, top: 0, width: 1080, height: 1920, background: "rgba(255,51,85,.35)", mixBlendMode: "screen", opacity: 0 });
    const g = el(fx, { left: 0, top: 0, width: 1080, height: 1920, background: "rgba(56,209,0,.3)", mixBlendMode: "screen", opacity: 0 });
    for (let k = 0; k < 6; k++) {
      const at = t + k * (d / 6);
      tl.set(r, { opacity: k % 2 ? 0 : 1, x: (rnd() - 0.5) * 40, clipPath: `inset(${rnd() * 80}% 0 ${rnd() * 15}% 0)` }, at)
        .set(g, { opacity: k % 2 ? 1 : 0, x: (rnd() - 0.5) * 40, clipPath: `inset(${rnd() * 15}% 0 ${rnd() * 80}% 0)` }, at)
        .set(cam, { x: (rnd() - 0.5) * 30 }, at);
    }
    tl.set([r, g], { opacity: 0 }, t + d).set(cam, { x: 0 }, t + d);
  }

  window.K = { C, tl, stage, cam, fx, el, scene, kin, charsIn, charsOut, scramble, bar, roller, roll, who, sym, react, pose, talk, life, enter,
               tape, candles, line, gauge, wipe, slices, whip, zoomThrough, glitch, flash, shake, punch, camReset, rnd, pick };
})();
