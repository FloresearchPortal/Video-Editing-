// FloStocks explainer kit — white chart-paper world, calm camera rig, contained kinetic type, finance
// charts (candles / line with grid + price axis), gauges, Notionists characters with body-language
// reactions, one smooth scene wipe, reusable PSX hook + icon→logo CTA blocks.
// Everything lands on ONE paused GSAP timeline (K.tl) at absolute VO times.
// Built from the "What is PSX" reel; see .claude/skills/60sec/SKILL.md for the rules.
(function () {
  const C = { ink: "#0B0F14", text: "#0B0F14", night: "#0B0F14", g: "#38D100", gt: "#1E9600", g2: "#2AA300", g3: "#1F7A00", lime: "#7CFF4F",
              white: "#FFFFFF", mute: "#6B7570", red: "#E4002B", gold: "#E6A817", panel: "#FFFFFF", line: "#E3E9E5", bg: "#F7F8F7" };
  const tl = gsap.timeline({ paused: true });
  const DUR = +(document.getElementById("root") || {}).dataset?.duration || 60;   // composition length (index.html data-duration)
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
  // chart paper: fine horizontal price lines + faint time divisions, scrolling like a live chart
  const grid = el(stage, { left: -240, top: -120, width: 1560, height: 2160, opacity: 0.9,
    backgroundImage: "linear-gradient(rgba(31,122,0,.055) 2px, transparent 2px), linear-gradient(90deg, rgba(31,122,0,.03) 2px, transparent 2px)",
    backgroundSize: "120px 120px, 240px 120px" });
  tl.fromTo(grid, { x: 0 }, { x: -240, duration: DUR, ease: "none" }, 0);
  // faint full-width market line behind everything (seeded random walk), drifting left the whole video
  {
    let v = 0.55; const P = [];
    for (let i = 0; i <= 160; i++) { v = Math.min(0.9, Math.max(0.1, v + (rnd() - 0.48) * 0.06)); P.push(`${i ? "L" : "M"}${i * 24},${(1 - v) * 900}`); }
    const bgl = el(stage, { left: 0, top: 560, width: 3840, height: 900, opacity: 0.07 },
      `<svg viewBox="0 0 3840 900" width="3840" height="900"><path d="${P.join(" ")}" fill="none" stroke="#1F7A00" stroke-width="5" stroke-linejoin="round"/></svg>`);
    tl.fromTo(bgl, { x: 0 }, { x: -Math.min(2760, DUR * 24), duration: DUR, ease: "none" }, 0);
  }
  const glow = el(stage, { left: 140, top: 560, width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,209,0,.10), rgba(56,209,0,0) 65%)" });
  tl.fromTo(glow, { scale: 0.9 }, { scale: 1.15, duration: 6, yoyo: true, repeat: 18, ease: "sine.inOut" }, 0);
  // camera rig: a slow, continuous handheld-dolly drift (never a dead frame); cam inside it takes the push-ins
  const rig = el(stage, { left: 0, top: 0, width: 1080, height: 1920 });
  for (let t = 0, k = 0; t < DUR; t += 4, k++)
    tl.to(rig, { x: k % 2 ? -4 : 4, y: k % 3 === 0 ? -3 : 3, duration: 4, ease: "sine.inOut" }, t);
  const cam = el(rig, { left: 0, top: 0, width: 1080, height: 1920 }, "", "cam");   // scenes live in the camera
  const fx = el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 60, pointerEvents: "none" }, "", "fx");
  el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 70, pointerEvents: "none",
    background: "radial-gradient(120% 80% at 50% 45%, rgba(0,0,0,0) 60%, rgba(31,60,20,.08) 100%)" });
  el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 71, pointerEvents: "none", opacity: 0.05, mixBlendMode: "multiply",
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")` });

  // camera moves
  // push-ins ease in AND out (no snap zooms); the slow drift on the rig keeps moving underneath
  const punch = (t, s = 1.12, d = 0.35, x = 0, y = 0) => tl.to(cam, { scale: 1 + Math.min(0.05, (s - 1) * 0.4), x: x * 0.25, y: y * 0.25, duration: Math.max(0.7, d * 1.8), ease: "power2.inOut" }, t - 0.15);
  const camReset = (t, d = 0.4) => tl.to(cam, { scale: 1, x: 0, y: 0, rotation: 0, duration: Math.max(0.5, d * 1.4), ease: "power3.inOut" }, t);
  // a short damped jolt — only for market shocks; kept small so the frame never looks broken
  function shake(t, amp = 18, n = 6, target = cam) {
    const a = Math.min(8, amp * 0.35);
    for (let i = 0; i < 4; i++) tl.to(target, { x: (i % 2 ? -1 : 1) * a * (1 - i / 4), duration: 0.05, ease: "sine.inOut" }, t + i * 0.05);
    tl.to(target, { x: 0, duration: 0.1, ease: "sine.out" }, t + 0.2);
  }
  function flash(t, color = "#38D100", peak = 0.35, d = 0.18) {
    const f = el(fx, { left: 0, top: 0, width: 1080, height: 1920, background: color, opacity: 0 });
    tl.to(f, { opacity: Math.min(0.12, peak * 0.4), duration: 0.05 }, t).to(f, { opacity: 0, duration: d + 0.15, ease: "power2.out" }, t + 0.05);
  }

  // scene layer: visible on [t0, t1); slow camera push inside the scene keeps every hold alive
  const SCENES = [];
  function scene(t0, t1, o = {}) {
    const s = el(cam, { left: 0, top: 0, width: 1080, height: 1920 }, "", "scene");
    SCENES.push({ s, t0, t1 });
    if (o.push !== false) tl.fromTo(s, { scale: 1 }, { scale: 1 + Math.min(0.025, ((o.push || 1.06) - 1) * 0.5), duration: t1 - t0, ease: "none", immediateRender: false }, t0);
    return s;
  }

  // every scene change is the same smooth wipe: the incoming scene sweeps in left→right behind a thin green
  // edge while the outgoing one is uncovered in step — the frame always changes, nothing overlaps, no camera move
  const WIPE = 0.6;
  function linkScenes() {
    const S = SCENES.slice().sort((a, b) => a.t0 - b.t0);
    window.__sceneCuts = S.slice(1).map((x) => x.t0);     // read by tools/flostocks/overlap_audit.cjs
    S.forEach((cur, i) => {
      const prev = S[i - 1], T = cur.t0;
      if (i === 0) { if (T > 0) tl.set(cur.s, { autoAlpha: 0 }, 0).set(cur.s, { autoAlpha: 1 }, T); }
      else {
        const a = T - WIPE / 2, b = T + WIPE / 2;
        tl.set(cur.s, { autoAlpha: 0 }, 0).set(cur.s, { autoAlpha: 1 }, a);
        tl.fromTo(cur.s, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: WIPE, ease: "power2.inOut", immediateRender: false }, a)
          .set(cur.s, { clipPath: "none" }, b);
        tl.fromTo(prev.s, { clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 100%)", duration: WIPE, ease: "power2.inOut", immediateRender: false }, a)
          .set(prev.s, { autoAlpha: 0 }, b);
        const edge = el(fx, { left: -6, top: 0, width: 6, height: 1920, background: C.g2, boxShadow: `0 0 24px ${C.g}`, opacity: 0 });
        tl.set(edge, { opacity: 1 }, a).fromTo(edge, { x: 0 }, { x: 1086, duration: WIPE, ease: "power2.inOut", immediateRender: false }, a).set(edge, { opacity: 0 }, b);
      }
      if (i === S.length - 1) tl.set(cur.s, { autoAlpha: 0 }, cur.t1 + 0.01);
    });
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
  // calm, contained entrances: letters settle into their own footprint (no oversize slams, no bounce)
  const charsIn = {
    slam: (b, t, st = 0.022) => tl.fromTo(b.chars, { scale: 1.35, opacity: 0, filter: "blur(6px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.4, ease: "power3.out", stagger: st }, t),
    flip: (b, t, st = 0.03) => tl.fromTo(b.chars, { rotationX: -70, y: 24, opacity: 0, transformPerspective: 700, transformOrigin: "50% 100%" }, { rotationX: 0, y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: st }, t),
    rise: (b, t, st = 0.025) => tl.fromTo(b.chars, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.42, ease: "power3.out", stagger: st }, t),
    drop: (b, t, st = 0.03) => tl.fromTo(b.chars, { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.42, ease: "power3.out", stagger: st }, t),
    stretch: (b, t) => tl.fromTo(b, { scaleX: 1.25, scaleY: 0.8, opacity: 0, filter: "blur(6px)" }, { scaleX: 1, scaleY: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "power3.out" }, t),
    words: (b, t, st = 0.09) => tl.fromTo(b.words, { scale: 0.85, opacity: 0, y: 24 }, { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: st }, t),
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
    blast: (b, t) => tl.to(b.chars, { y: -30, opacity: 0, duration: 0.28, ease: "power2.in", stagger: 0.008 }, t),
    zoom: (b, t) => tl.to(b, { scale: 1.25, opacity: 0, duration: 0.3, ease: "power2.in" }, t),
    drop: (b, t) => tl.to(b.chars, { yPercent: 40, opacity: 0, duration: 0.28, ease: "power2.in", stagger: 0.01 }, t),
    up: (b, t) => tl.to(b, { y: -60, opacity: 0, duration: 0.28, ease: "power2.in" }, t),
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
      font: `600 ${o.size}px/1.2 'IBM Plex Mono'`, color: o.color || C.text, whiteSpace: "nowrap" }, o.text, "roller");
    tl.set(box, { autoAlpha: 0 }, 0);           // hidden until revealed
    return box;
  }
  function roll(box, t) {
    tl.set(box, { autoAlpha: 1 }, t).fromTo(box, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, t);
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
                  pointLongArm: "1520 1760", okLongArm: "1520 1760", waveLongArm: "1520 1760", waveOkLongArms: "872 1760", shrug: "872 1760", cup: "1290 1760", crossed: "872 1760" };
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
      pose(w, t + 0.95, { h: [-2, 0, 0], b: [1.02, 1], a: [0, 1], g }, 0.5, "sine.inOut");
      pulse(w, t, o.ring || C.red, 1.2);
      const h = head(w);
      // (no "!" mark — it collided with neighbouring graphics; the face + recoil carry the shock)
    },
    // WORRY: hand to chest, shoulders hunch in, head drops and shakes slowly, weight sways
    worry(w, t, d = 1.6, o = {}) {
      const g = o.gesture || "hand", s = w.size;
      CAST.expr(tl, w.av, "worried", t);
      if (g === "none") CAST.gesture(tl, w.av, "none", t); else armIn(w, t, g);
      pose(w, t, { h: [7, 6, 34], b: [0.93, 1.03], g }, 0.55, "power2.out");
      tl.to(w.av, { y: s * 0.05, rotation: -3, scale: 0.97, transformOrigin: "50% 100%", duration: 0.6, ease: "power2.out" }, t);
      tl.to(w.av, { x: 0, duration: 0.2 }, t + d);
    },
    // THINK: finger to chin, head tilts, weight shifts onto one side — one smooth move, held (static thought chip)
    think(w, t, d = 1.4, o = {}) {
      const g = o.gesture || "hand", s = w.size;
      CAST.expr(tl, w.av, "think", t);
      if (g === "none") CAST.gesture(tl, w.av, "none", t); else armIn(w, t, g);
      pose(w, t, { h: [10, 14, -8], b: [1.01, 1], g }, 0.5, "sine.inOut");
      tl.to(w.av, { rotation: 4, x: s * 0.02, transformOrigin: "50% 100%", duration: 0.55, ease: "sine.inOut" }, t);
      pose(w, t + d, {}, 0.5, "sine.inOut");                                  // one tilt in, hold, one ease back
      tl.to(w.av, { rotation: 0, x: 0, duration: 0.5, ease: "sine.inOut" }, t + d);
      if (o.dots === false) return;
      const h = head(w);
      const dots = el(w, { left: h.x + s * 0.2, top: h.y - s * 0.34, width: 96, height: 44, borderRadius: 22, background: "#fff", border: "3px solid #E3E9E5", boxShadow: "0 8px 18px rgba(20,40,20,.12)" },
        `<div style="display:flex;gap:9px;justify-content:center;align-items:center;height:100%">${[0, 1, 2].map(() => '<i style="width:12px;height:12px;border-radius:6px;background:#6B7570;display:block"></i>').join("")}</div>`);
      tl.fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" }, t).to(dots, { scale: 0, opacity: 0, duration: 0.2 }, t + d);
    },
    // LOVE ("kamaal!"): OK-sign shoots up, head tilts happily, shoulder shimmy with two little hops
    love(w, t, o = {}) {
      const g = o.gesture || "okLongArm", s = w.size;
      CAST.expr(tl, w.av, "delight", t);
      if (o.keep) tl.to(w.av.rig.arm, { rotation: -7, y: -40, svgOrigin: ARM_O[g], duration: 0.35, ease: "power2.out" }, t);
      else armIn(w, t, g);
      pose(w, t, { h: [-8, -6, -12], b: [1.05, 1], g }, 0.2);
      tl.to(w.av, { rotation: -4, duration: 0.35, ease: "sine.inOut" }, t)
        .to(w.av, { rotation: 0, duration: 0.5, ease: "sine.inOut" }, t + 0.8);
      rest(w, t + 0.9, 0.4, g);
      pulse(w, t, C.g, 1.22); pulse(w, t + 0.34, C.g, 1.3);
    },
    // HELPLESS ("paisay bilkul nahi"): both open palms up, shoulders raised, head tilted, worried face — one move, held
    helpless(w, t, d = 1.6) {
      const g = "shrug";
      CAST.expr(tl, w.av, "worried", t);
      armIn(w, t, g);
      pose(w, t, { h: [-7, -6, 16], b: [1.07, 0.98], g }, 0.4, "power2.out");
      pose(w, t + d, { h: [-3, 0, 8], b: [1.03, 1], g }, 0.6, "sine.inOut");
    },
    // BUY: leans in and pumps the pointing arm, head nodding along — urgency
    buy(w, t, d = 1.4) {
      const g = "pointLongArm", s = w.size;
      CAST.expr(tl, w.av, "grin", t);
      armIn(w, t, g);
      tl.to(w.av, { rotation: 5, x: s * 0.03, transformOrigin: "50% 100%", duration: 0.2, ease: "power2.out" }, t);
      pose(w, t, { h: [4, 8, 6], b: [1.03, 1], g }, 0.2);
      tl.to(w.av, { rotation: 0, x: 0, duration: 0.35, ease: "power2.out" }, t + d);
      rest(w, t + d, 0.35, g);
    },
    // PROUD (bharosa): OK at the chest, chest puffs out, chin up, two firm nods
    proud(w, t, o = {}) {
      const g = o.gesture || "ok", s = w.size;
      CAST.expr(tl, w.av, o.face || "happy", t);
      if (g === "none") CAST.gesture(tl, w.av, "none", t); else armIn(w, t, g);
      pose(w, t, { h: [-5, 0, -22], b: [1.07, 1.03], g }, 0.3, "power2.out");
      tl.to(w.av, { scale: 1.04, transformOrigin: "50% 100%", duration: 0.3, ease: "power2.out" }, t);
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
  // chart frame: horizontal price grid + right-hand price axis (labels top→bottom), like a trading screen
  function chartGrid(W, H, o) {
    const labs = o.axis || [], rows = o.rows || (labs.length > 1 ? labs.length - 1 : 4);
    let g = "";
    for (let r = 0; r <= rows; r++) {
      const y = (r / rows) * H;
      g += `<line x1="0" x2="${W}" y1="${y}" y2="${y}" stroke="#D9E3DC" stroke-width="2" stroke-dasharray="${r === rows ? "0" : "6 8"}"/>`;
      if (labs.length === rows + 1) g += `<text x="${W + 14}" y="${y + 9}" font-family="IBM Plex Mono" font-weight="600" font-size="24" fill="#8A948F">${labs[r]}</text>`;
    }
    return g;
  }
  function candles(parent, o) {
    const n = o.n || 18, W = o.w, H = o.h, cw = W / n;
    let v = o.start ?? 0.5; const data = [];
    for (let i = 0; i < n; i++) { const dir = o.trend(i / (n - 1), rnd); const open = v; v = Math.min(0.95, Math.max(0.05, v + dir)); data.push([open, v, Math.max(open, v) + rnd() * 0.06, Math.min(open, v) - rnd() * 0.06]); }
    const svg = data.map(([op, cl, hi, lo], i) => {
      const up = cl >= op, x = i * cw + cw * 0.18, w = cw * 0.64, c = up ? C.g2 : C.red;
      const y1 = H * (1 - Math.max(op, cl)), y2 = H * (1 - Math.min(op, cl));
      return `<g class="cdl"><line x1="${x + w / 2}" x2="${x + w / 2}" y1="${H * (1 - hi)}" y2="${H * (1 - lo)}" stroke="${c}" stroke-width="3"/><rect x="${x}" y="${y1}" width="${w}" height="${Math.max(5, y2 - y1)}" rx="2" fill="${c}"/></g>`;
    }).join("");
    const box = el(parent, { left: o.x, top: o.y, width: W, height: H },
      `<svg viewBox="0 0 ${W} ${H}" style="overflow:visible">${o.grid ? chartGrid(W, H, o) : ""}${svg}</svg>`);
    box.c = box.querySelectorAll(".cdl");
    // candles print left → right like a live session
    box.grow = (t, st = 0.05) => tl.fromTo(box.c, { scaleY: 0, opacity: 0, transformOrigin: "50% 50%" }, { scaleY: 1, opacity: 1, duration: 0.22, ease: "power3.out", stagger: st, immediateRender: false }, t);
    box.growRange = (t, i0, i1, st = 0.1) => tl.fromTo([...box.c].slice(i0, i1), { scaleY: 0, opacity: 0, transformOrigin: "50% 50%" }, { scaleY: 1, opacity: 1, duration: 0.3, ease: "power2.out", stagger: st, immediateRender: false }, t);
    gsap.set(box.c, { opacity: 0 });
    return box;
  }
  // line chart: the key points are densified into a natural price path (seeded micro-moves), with an area
  // fill, optional grid/price axis, and a dot that rides the tip while it draws
  let lineN = 0;
  function line(parent, pts, o) {
    const W = o.w, H = o.h, n = o.n || 56, noise = o.noise ?? 0.035, col = o.color || C.g2, id = "lg" + ++lineN;
    const P = [];
    for (let i = 0; i <= n; i++) {
      const x = pts[0][0] + (pts[pts.length - 1][0] - pts[0][0]) * (i / n);
      let k = 0; while (k < pts.length - 2 && pts[k + 1][0] < x) k++;
      const [x0, y0] = pts[k], [x1, y1] = pts[k + 1];
      let y = y0 + (y1 - y0) * Math.min(1, Math.max(0, (x - x0) / ((x1 - x0) || 1)));
      if (i && i < n) y += (rnd() - 0.5) * noise;
      P.push([x, Math.min(1, Math.max(0, y))]);
    }
    const d = P.map(([x, y], i) => `${i ? "L" : "M"}${(x * W).toFixed(1)},${((1 - y) * H).toFixed(1)}`).join(" ");
    const sw = Math.min(o.sw || 8, 9);
    const area = o.area === false ? "" : `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${col}" stop-opacity=".22"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
      <path class="ar" d="${d} L${(P[P.length - 1][0] * W).toFixed(1)},${H} L${(P[0][0] * W).toFixed(1)},${H} Z" fill="url(#${id})" style="clip-path:inset(0 100% 0 0)"/>`;
    const box = el(parent, { left: o.x, top: o.y, width: W, height: H },
      `<svg viewBox="0 0 ${W} ${H}" style="overflow:visible">${o.grid ? chartGrid(W, H, o) : ""}${area}<path class="ln" d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    const p = box.querySelector(".ln"), ar = box.querySelector(".ar"), len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    const dot = el(box, { left: -13, top: -13, width: 26, height: 26, borderRadius: "50%", background: col, border: "5px solid #fff", boxShadow: `0 0 0 4px ${col}33`, opacity: 0 });
    const x0 = P[0][0] * W, x1 = P[P.length - 1][0] * W;
    box.draw = (t, dd = 1) => {
      const pr = { v: 0 };
      tl.fromTo(pr, { v: 0 }, { v: 1, duration: dd, ease: "power1.inOut", immediateRender: false, onUpdate: () => {
        p.style.strokeDashoffset = len * (1 - pr.v);
        const q = p.getPointAtLength(len * pr.v);
        dot.style.transform = `translate(${q.x}px,${q.y}px)`;
        if (ar) ar.style.clipPath = `inset(0 ${Math.max(0, 100 - ((q.x - 0) / W) * 100)}% 0 0)`;
      } }, t);
      tl.set(dot, { opacity: 1 }, t).set(box, { autoAlpha: 1 }, t);
    };
    gsap.set(box, { autoAlpha: 0 });
    box.path = p; box.dot = dot; box.pts = P;
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

  // ── transitions: one finance vocabulary (bar-chart rise, chart-cursor sweep, smooth pan, terminal scan) ──
  // legacy transition calls — scene changes are all handled by linkScenes() now
  function wipe() {}
  function slices() {}
  function whip() {}
  function zoomThrough() {}
  // glitch → TERMINAL SCAN: a green scan line sweeps the screen with a soft trail (a quote refresh)
  function glitch(t, d = 0.35) {
    const sc = el(fx, { left: 0, top: -260, width: 1080, height: 260, opacity: 0,
      background: `linear-gradient(180deg, rgba(56,209,0,0) 0%, rgba(56,209,0,.16) 85%, ${C.g} 100%)` });
    tl.set(sc, { opacity: 1 }, t).fromTo(sc, { y: 0 }, { y: 2180, duration: Math.max(0.45, d * 1.4), ease: "power1.inOut", immediateRender: false }, t)
      .set(sc, { opacity: 0 }, t + Math.max(0.45, d * 1.4));
  }

  // ── always-on PSX ticker band (business-news strip), camera-independent ─────────────────
  function tickerBand(items, t0, t1, y = 1548) {
    const band = el(stage, { left: 0, top: y, width: 1080, height: 66, zIndex: 58, background: "#FFFFFF",
      borderTop: "2px solid #E3E9E5", borderBottom: "2px solid #E3E9E5", boxShadow: "0 10px 26px rgba(20,40,20,.08)", overflow: "hidden" });
    const row = el(band, { left: 236, top: 0, height: 66, whiteSpace: "nowrap", font: "600 28px/66px 'IBM Plex Mono'" });
    const one = items.map(([s2, pr, ch]) => `<span style="margin-right:44px"><b style="color:${C.text}">${s2}</b> <span style="color:${C.mute}">${pr}</span> <span style="color:${ch >= 0 ? C.gt : C.red}">${ch >= 0 ? "▲" : "▼"}${Math.abs(ch).toFixed(2)}%</span></span>`).join("");
    row.innerHTML = one + one + one + one;
    el(band, { left: 0, top: 0, width: 236, height: 66, background: C.ink, color: "#fff", font: "800 26px/66px Manrope", textAlign: "center", letterSpacing: ".04em" },
      `<span style="color:${C.g}">●</span> KSE-100`);
    gsap.set(band, { autoAlpha: 0 });
    tl.fromTo(band, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, t0)
      .to(band, { autoAlpha: 0, y: 40, duration: 0.35, ease: "power2.in" }, t1);
    const w = row.scrollWidth / 4 || 2400;
    for (let t = t0, k = 0; t < t1; t += 30, k++) tl.fromTo(row, { x: 0 }, { x: -w, duration: 30, ease: "none", immediateRender: false }, t);
    return band;
  }

  // psxLogo(parent, css, t0): OPTIONAL kinetic PSX logo build — made for "What is PSX" only; use it in another
  // video only if the client asks for it again. The approved kinetic PSX logo build (vector-traced layers), 2.25 s from t0:
  // bars rise like a bar chart → P·S·X slide up → gold ring draws from the bottom → name rises letter by letter → glint
  function psxLogo(parent, css, t0 = 0) {
    const box = el(parent, css, window.PSX_LOGO_SVG || "");
    const sv = box.querySelector("svg"); if (!sv) return box;
    Object.assign(sv.style, { width: "100%", height: "100%", overflow: "visible", display: "block" });
    const q = (s) => box.querySelectorAll(s);
    gsap.set(q(".bar"), { transformOrigin: "50% 100%" });
    tl.fromTo(q(".bar"), { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: "expo.out", stagger: 0.07 }, t0 + 0.05)
      .fromTo(q(".ltr"), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08 }, t0 + 0.40)
      .fromTo(q(".rm"), { strokeDasharray: 100, strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut" }, t0 + 0.55)
      .fromTo(q(".ln0 .gl"), { y: 9, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.025 }, t0 + 0.95)
      .fromTo(q(".ln1 .gl"), { y: 9, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.02 }, t0 + 1.05)
      .fromTo(q(".ln2 .gl"), { y: 9, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", stagger: 0.025 }, t0 + 1.15)
      .fromTo(q("#glint"), { x: 0 }, { x: 330, duration: 0.8, ease: "power2.inOut" }, t0 + 1.45);
    return box;
  }

  // ── reusable blocks ─────────────────────────────────────────────────────────
  // swap(el, text, t): a figure changes — old value lifts out, new one settles in (never count/roll prices)
  function swap(e, text, t) {
    tl.to(e, { y: -14, opacity: 0, duration: 0.12, ease: "power2.in" }, t)
      .set(e, { textContent: text }, t + 0.12)
      .fromTo(e, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: "power2.out", immediateRender: false }, t + 0.12);
  }
  // psxHook(scene, o): frame 0 = PSX logo alone; on o.tDock it docks top and a live KSE-100 card builds.
  // The ONE candlestick chart tells the VO: sideways, rally on o.tUp, sell-off on o.tDown (no extra line).
  // returns { logo, card, idx, chip, cd } — tag logo/card with data-ov for the overlap audit
  function psxHook(sc, o = {}) {
    const M = window.MARKET || {}, K100 = M.kse100 || { level: 165298.5, change_pct: 0.11, change_points: 174.09 };
    const f = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const tDock = o.tDock ?? 1.5, tUp = o.tUp, tDown = o.tDown;
    const logo = el(sc, { left: 290, top: 560, width: 500, height: 598 }, `<img src="assets/psx/psx-logo.png" style="width:100%;height:100%;object-fit:contain">`);
    tl.fromTo(logo, { scale: 1.14 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);
    tl.to(logo, { y: -585, scale: 0.36, duration: 0.7, ease: "power3.inOut" }, tDock);
    const card = el(sc, { left: 50, top: 400, width: 980, height: 820, borderRadius: 36, background: "#fff", border: "2px solid #E3E9E5", boxShadow: "0 30px 60px rgba(20,40,20,.10)" });
    tl.fromTo(card, { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, tDock + 0.5);
    el(card, { left: 44, top: 38, font: "800 34px Manrope", color: C.mute, letterSpacing: ".04em" }, "KSE-100 INDEX");
    el(card, { left: 790, top: 34, width: 150, height: 46, borderRadius: 23, background: "#EAF7E3", color: C.gt, font: "800 24px/46px Manrope", textAlign: "center" }, "● LIVE");
    const idx = el(card, { left: 44, top: 88, font: "700 96px/1 'IBM Plex Mono'", color: C.text, letterSpacing: "-.03em" }, f(K100.level));
    const chip = el(card, { left: 48, top: 200, height: 50, padding: "0 20px", borderRadius: 12, background: "#EAF7E3", color: C.gt, font: "700 30px/50px 'IBM Plex Mono'" },
      `▲ ${f(K100.change_points)} (${K100.change_pct.toFixed(2)}%)`);
    const lv = K100.level, ax = [1, 0.5, 0, -0.5, -1].map((k) => Math.round(lv / 100 + k * 6) * 100).map((v) => v.toLocaleString("en-US"));
    const cd = candles(card, { x: 44, y: 300, w: 780, h: 470, n: 26, start: 0.36, grid: true, axis: ax,
      trend: (p, r) => (p < 0.42 ? (r() - 0.5) * 0.06 : p < 0.74 ? 0.04 + r() * 0.03 : -(0.055 + r() * 0.03)) });
    cd.growRange(tDock + 0.7, 0, 11, 0.035);
    if (tUp != null) {
      cd.growRange(tUp, 11, 19, 0.1);
      swap(idx, f(lv + 820.4), tUp); tl.set(chip, { textContent: `▲ ${f(K100.change_points + 820.4)} (0.61%)` }, tUp + 0.05);
    }
    if (tDown != null) {
      cd.growRange(tDown, 19, 26, 0.1);
      swap(idx, f(lv - 688.25), tDown); tl.set(chip, { textContent: "▼ 688.25 (0.42%)", background: "#FDE8EC", color: C.red }, tDown + 0.05);
    }
    return { logo, card, idx, chip, cd };
  }
  // ctaLogo(scene, t, o): FloStocks icon appears alone (enlarged, centred) and glides left while the wordmark
  // unrolls into the full lockup; then "FOLLOW FLOSTOCKS" and (o.tDisc) the disclaimer underneath.
  const DISCLAIMER = "Trading and investing in the PSX involve market risks, price fluctuations, and potential financial losses. Past performance does not guarantee future results. Learn the risks before you trade.";
  function ctaLogo(sc, t, o = {}) {
    const fl = el(sc, { left: 90, top: 470, width: 900, height: 300, transformOrigin: "96px 123px" }, `<img src="assets/logos/flostocks-logo-full.png" style="width:100%;height:100%;object-fit:contain">`);
    gsap.set(fl, { autoAlpha: 0 });
    tl.set(fl, { autoAlpha: 1, x: 354, scale: 2.1, clipPath: "inset(0% 79.9% 0% 0%)" }, t)
      .fromTo(fl, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 2.1, duration: 0.5, ease: "power3.out", immediateRender: false }, t)
      .to(fl, { x: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" }, t + 0.53);
    const gl = el(sc, { left: 90, top: 470, width: 900, height: 300, overflow: "hidden",
      webkitMask: "url(assets/logos/flostocks-logo-full.png) center / contain no-repeat", mask: "url(assets/logos/flostocks-logo-full.png) center / contain no-repeat" },
      `<i style="position:absolute;top:-40%;left:0;width:140px;height:180%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.9),rgba(255,255,255,0))"></i>`);
    tl.fromTo(gl.firstChild, { xPercent: -150, skewX: -20 }, { xPercent: 800, duration: 0.8, ease: "power2.inOut" }, t + 1.5);
    const fol = el(sc, { left: 190, top: 810, width: 700, height: 116, background: C.g, borderRadius: 58, font: "800 52px/116px Manrope", whiteSpace: "nowrap", textAlign: "center", color: C.ink, boxShadow: `0 0 50px ${C.g}66` }, o.button || "FOLLOW FLOSTOCKS");
    tl.fromTo(fol, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, t + 1.5);
    let disc = null;
    if (o.tDisc != null) {
      disc = el(sc, { left: 100, top: 1000, width: 880, padding: "26px 30px", borderTop: `4px solid ${C.g}`, font: "500 31px/1.5 Inter", color: "#3F4A44", textAlign: "center" },
        `<div style="font:800 26px Manrope;letter-spacing:.16em;color:${C.g};margin-bottom:10px">DISCLAIMER</div>${o.disclaimer || DISCLAIMER}`);
      tl.fromTo(disc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, o.tDisc);
    }
    return { fl, fol, disc };
  }

  // seriesCard(scene, t, o): the approved "60 Seconds Investor" stopwatch card (client pick, Variation A):
  // a stopwatch sweeps a full green minute, SECONDS INVESTOR rises, SERIES pill, tagline, episode chip.
  // o = { tSweep, tTitle, tSeries, tTag, tEp, ep: "EP 01 · WHAT IS AN IPO", tag: "PSX ke terms, simple tareeqe se" }
  function seriesCard(sc, t, o = {}) {
    const T = (k, d) => o[k] ?? t + d;
    const watch = el(sc, { left: 260, top: 190, width: 560, height: 616 },
      `<svg viewBox="0 0 300 330" width="560" height="616" style="overflow:visible">
        <rect x="128" y="0" width="44" height="26" rx="8" fill="#0B0F14"/><rect x="141" y="22" width="18" height="18" fill="#0B0F14"/>
        <rect x="236" y="40" width="30" height="16" rx="6" fill="#0B0F14" transform="rotate(42 251 48)"/>
        <circle cx="150" cy="185" r="138" fill="#fff" stroke="#0B0F14" stroke-width="10"/>
        <circle cx="150" cy="185" r="112" fill="none" stroke="#E3E9E5" stroke-width="20"/>
        <circle class="arc" cx="150" cy="185" r="112" fill="none" stroke="${C.g}" stroke-width="20" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 150 185)"/>
        <g class="hand"><line x1="150" y1="185" x2="150" y2="96" stroke="#0B0F14" stroke-width="7" stroke-linecap="round"/></g><circle cx="150" cy="185" r="10" fill="#0B0F14"/>
        <text x="150" y="250" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="62" fill="#0B0F14">60</text>
        <text x="150" y="276" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="16" letter-spacing="3" fill="#6B7570">SEC</text></svg>`);
    tl.fromTo(watch, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, t);
    const ts = T("tSweep", 0.35);
    tl.fromTo(watch.querySelector(".arc"), { attr: { "stroke-dashoffset": 100 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.4, ease: "power2.inOut", immediateRender: false }, ts)
      .fromTo(watch.querySelector(".hand"), { rotation: 0, svgOrigin: "150 185" }, { rotation: 360, svgOrigin: "150 185", duration: 1.4, ease: "power2.inOut", immediateRender: false }, ts);
    const up = (e, tt, y = 20) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, tt);
    const t1 = el(sc, { left: 0, top: 860, width: 1080, textAlign: "center", font: "800 96px/1 Manrope", color: C.text, whiteSpace: "nowrap", letterSpacing: "-.02em" }, `SECONDS <span style="color:${C.gt}">INVESTOR</span>`);
    up(t1, T("tTitle", 0.9), 26);
    const t2 = el(sc, { left: 425, top: 990, width: 230, height: 66, borderRadius: 33, background: C.ink, color: "#fff", font: "800 30px/66px Manrope", textAlign: "center", letterSpacing: ".2em" }, "SERIES");
    up(t2, T("tSeries", 1.2));
    const t3 = el(sc, { left: 0, top: 1110, width: 1080, textAlign: "center", font: "700 46px Manrope", color: C.mute, whiteSpace: "nowrap" }, o.tag || "PSX ke terms, simple tareeqe se");
    up(t3, T("tTag", 1.5));
    let ep = null;
    if (o.ep) { ep = el(sc, { left: 0, top: 1196, width: 1080, textAlign: "center" },
      `<span style="display:inline-block;border:5px solid ${C.g};background:#fff;font:800 36px Manrope;padding:18px 40px;border-radius:999px;color:${C.text}">${o.ep}</span>`);
      up(ep, T("tEp", 1.8)); }
    return { watch, t1, t2, t3, ep };
  }

  window.K = { C, tl, stage, cam, fx, el, scene, kin, charsIn, charsOut, scramble, bar, roller, roll, who, sym, react, pose, talk, life, enter, linkScenes,
               tape, candles, line, gauge, tickerBand, wipe, slices, whip, zoomThrough, glitch, flash, shake, punch, camReset, rnd, pick, psxLogo, seriesCard, swap, psxHook, ctaLogo, DISCLAIMER, DUR };
})();
