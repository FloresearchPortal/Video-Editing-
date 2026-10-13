// Motion kit for "What is PSX": layout helpers, kinetic type, brand slabs, counters, line-art icons
// (Notionists-matching: black 7px strokes, white fills, FloStocks green accents) and transitions.
// Everything is placed on ONE paused GSAP timeline (window.TL) at absolute VO times.
(function () {
  const C = { ink: "#0B0F14", g: "#38D100", g2: "#2AA300", g3: "#1F7A00", wash: "#DDF3D2", bg: "#F3F8EF",
              red: "#E4002B", gold: "#E6A817", grey: "#8A948F", white: "#FFFFFF" };
  const tl = gsap.timeline({ paused: true });
  const stage = document.getElementById("stage");

  function el(parent, css = {}, html = "", cls = "") {
    const d = document.createElement("div");
    d.className = ("abs " + cls).trim();
    Object.assign(d.style, Object.fromEntries(Object.entries(css).map(([k, v]) => [k, typeof v === "number" && !["opacity", "zIndex", "fontWeight", "lineHeight"].includes(k) ? v + "px" : v])));
    d.innerHTML = html;
    (parent || stage).appendChild(d);
    return d;
  }
  // a scene: full-frame layer visible on [t0, t1)
  function scene(t0, t1, bg) {
    const s = el(stage, { left: 0, top: 0, width: 1080, height: 1920, background: bg || "transparent" }, "", "scene");
    if (t0 > 0) tl.set(s, { autoAlpha: 0 }, 0).set(s, { autoAlpha: 1 }, t0);
    tl.set(s, { autoAlpha: 0 }, t1);
    return s;
  }
  // character
  function who(parent, name, x, y, size, o = {}) {
    const box = el(parent, { left: x, top: y, width: size, height: size }, "", "who");
    const inner = el(box, { left: 0, top: 0, width: size, height: size });
    CAST.mount(inner, name, o);
    box.av = inner;
    return box;
  }
  // kinetic text: words revealed from a mask, staggered. hl = {word: colour}
  function words(parent, text, o) {
    const size = o.size || 96, lh = o.lh || 1.12;
    const box = el(parent, { left: o.x ?? 60, top: o.y, width: o.w ?? 960, textAlign: o.align || "center",
      font: `${o.weight || 800} ${size}px/${lh} ${o.font || "Manrope"}`, color: o.color || C.ink, letterSpacing: (o.track ?? -0.02) + "em" }, "", "words");
    const spans = [];
    text.split(" ").forEach((w, i) => {
      if (w === "|") { box.appendChild(document.createElement("br")); return; }
      const m = document.createElement("span"); m.className = "wm";
      const s = document.createElement("span"); s.className = "w"; s.textContent = w;
      const key = w.replace(/[^\w₨.,!?%-]/g, "");
      if (o.hl && (o.hl[w] || o.hl[key])) s.style.color = o.hl[w] || o.hl[key];
      m.appendChild(s); box.appendChild(m); box.appendChild(document.createTextNode(" ")); spans.push(s);
    });
    box.spans = spans;
    return box;
  }
  function reveal(box, t, o = {}) {
    tl.fromTo(box.spans, { yPercent: 115, rotation: o.rot ?? 4 }, { yPercent: 0, rotation: 0, duration: o.dur || 0.42, ease: o.ease || "expo.out", stagger: o.stagger ?? 0.06 }, t);
  }
  function hideWords(box, t, dur = 0.25) {
    tl.to(box.spans, { yPercent: -115, duration: dur, ease: "power2.in", stagger: 0.025 }, t);
  }
  // slanted brand slab with text
  function slab(parent, text, o) {
    const bg = o.bg || C.g, col = o.color || C.ink;
    const box = el(parent, { left: o.x, top: o.y, height: o.h || (o.size || 64) * 1.45 }, "", "slab");
    box.innerHTML = `<div class="slab-bg" style="background:${bg}"></div><div class="slab-t" style="font-size:${o.size || 64}px;color:${col}">${text}</div>`;
    if (o.center) { box.style.left = "0px"; box.style.width = "1080px"; box.classList.add("center"); }
    return box;
  }
  function slabIn(box, t) {
    const bg = box.querySelector(".slab-bg"), tx = box.querySelector(".slab-t");
    tl.fromTo(bg, { scaleX: 0, skewX: -14 }, { scaleX: 1, skewX: -14, duration: 0.38, ease: "expo.out" }, t)
      .fromTo(tx, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.32, ease: "expo.out" }, t + 0.1);
  }
  function slabOut(box, t) {
    tl.to(box, { scale: 0.8, opacity: 0, duration: 0.22, ease: "power2.in" }, t);
  }
  // pop in/out of any element
  const pop = (e, t, d = 0.45, from = 0.4) => tl.fromTo(e, { scale: from, opacity: 0 }, { scale: 1, opacity: 1, duration: d, ease: "back.out(1.8)" }, t);
  const popOut = (e, t, d = 0.22) => tl.to(e, { scale: 0.6, opacity: 0, duration: d, ease: "power2.in" }, t);
  const rise = (e, t, dy = 80, d = 0.5) => tl.fromTo(e, { y: dy, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "expo.out" }, t);
  const slideIn = (e, t, dx, d = 0.5) => tl.fromTo(e, { x: dx, opacity: 0 }, { x: 0, opacity: 1, duration: d, ease: "expo.out" }, t);
  // numeric counter (seek-safe: value derived from a tweened proxy)
  function counter(e, from, to, t, d, fmt) {
    const p = { v: from };
    e.textContent = fmt(from);
    tl.fromTo(p, { v: from }, { v: to, duration: d, ease: "power3.out", immediateRender: false, onUpdate: () => { e.textContent = fmt(p.v); } }, t);
    tl.call(() => { e.textContent = fmt(to); }, null, t + d + 0.01);
  }
  const pk = (n) => Math.round(n).toLocaleString("en-PK");          // 1,00,000 grouping
  const en = (n) => Math.round(n).toLocaleString("en-US");          // 1,000

  // ── line-art icons (viewBox 0 0 W H, stroke ink 7) ─────────────────────────
  const S = `stroke="${C.ink}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"`;
  const ICON = {
    stall: (sign = "AHMED CHAI", part) => part === "back" ? `<svg viewBox="0 0 800 640"><rect x="70" y="150" width="660" height="440" fill="#fff" ${S}/></svg>` : `<svg viewBox="0 0 800 640">
      ${part === "front" ? "" : `<rect x="70" y="150" width="660" height="440" fill="#fff" ${S}/>`}
      <rect x="110" y="80" width="580" height="90" rx="14" fill="${C.ink}"/>
      <text x="400" y="142" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="52" fill="${C.g}" letter-spacing="3">${sign}</text>
      <g class="awning">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${40 + i * 90},180 h90 v70 a45,45 0 0 1 -90,0Z" fill="${i % 2 ? "#fff" : C.g}" ${S}/>`).join("")}</g>
      <rect x="40" y="170" width="720" height="16" fill="${C.ink}"/>
      <g class="counter"><rect x="40" y="430" width="720" height="170" rx="10" fill="#fff" ${S}/>
      <path d="M40,470 h720" ${S}/><rect x="300" y="500" width="200" height="60" rx="10" fill="${C.wash}" ${S}/>
      <text x="400" y="542" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="30" fill="${C.ink}">CHAI ☕</text></g>
      <g class="cups">${[600, 660].map((x) => `<path d="M${x},380 h44 l-6,50 h-32Z" fill="#fff" ${S}/><path d="M${x + 8},360 q-8,-14 0,-28 q8,-14 0,-28" class="steam" fill="none" stroke="${C.grey}" stroke-width="5" stroke-linecap="round"/>`).join("")}
      <path d="M130,380 h110 l-10,50 h-90Z" fill="${C.wash}" ${S}/><path d="M150,380 q-10,-40 35,-40 q45,0 35,40" fill="#fff" ${S}/></g>
    </svg>`,
    miniStall: () => `<svg viewBox="0 0 200 180"><rect x="20" y="50" width="160" height="120" fill="#fff" ${S}/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${14 + i * 43},44 h43 v28 a21.5,21.5 0 0 1 -43,0Z" fill="${i % 2 ? "#fff" : C.g}" ${S}/>`).join("")}
      <rect x="30" y="118" width="140" height="52" fill="#fff" ${S}/><rect x="40" y="8" width="120" height="30" rx="6" fill="${C.ink}"/>
      <text x="100" y="30" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="17" fill="${C.g}">CHAI</text></svg>`,
    city: () => `<svg viewBox="0 0 700 300">${[[20, 120, 90], [120, 60, 80], [210, 150, 70], [290, 30, 100], [400, 110, 80], [490, 70, 90], [590, 140, 90]]
      .map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${300 - y}" fill="#fff" ${S}/>${[0, 1, 2].map((r) => `<rect x="${x + 18}" y="${y + 24 + r * 44}" width="16" height="20" fill="${C.wash}"/><rect x="${x + w - 34}" y="${y + 24 + r * 44}" width="16" height="20" fill="${C.wash}"/>`).join("")}`).join("")}
      <path d="M0,296 h700" ${S}/></svg>`,
    wallet: () => `<svg viewBox="0 0 420 300"><rect x="20" y="60" width="380" height="220" rx="28" fill="#fff" ${S}/>
      <path d="M20,110 h380" ${S}/><rect x="300" y="140" width="100" height="70" rx="16" fill="${C.wash}" ${S}/><circle cx="335" cy="175" r="10" fill="${C.ink}"/>
      <path d="M60,60 l40,-40 l60,40" fill="none" ${S}/><g class="moth"><path d="M150,170 q-30,-30 -40,0 q10,25 40,0 q30,-30 40,0 q-10,25 -40,0" fill="#fff" ${S}/></g></svg>`,
    bank: () => `<svg viewBox="0 0 360 320"><path d="M20,110 L180,24 L340,110Z" fill="#fff" ${S}/>
      ${[60, 130, 200, 270].map((x) => `<rect x="${x}" y="120" width="30" height="140" fill="#fff" ${S}/>`).join("")}
      <rect x="20" y="260" width="320" height="40" fill="#fff" ${S}/><text x="180" y="96" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="34" fill="${C.ink}">BANK</text></svg>`,
    exchange: () => `<svg viewBox="0 0 600 440"><path d="M30,140 L300,30 L570,140Z" fill="#fff" ${S}/>
      <text x="300" y="118" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="52" fill="${C.g3}">PSX</text>
      ${[70, 170, 270, 370, 470].map((x) => `<rect x="${x}" y="150" width="50" height="210" fill="#fff" ${S}/>`).join("")}
      <rect x="30" y="360" width="540" height="56" fill="#fff" ${S}/><path d="M30,150 h540" ${S}/></svg>`,
    shield: () => `<svg viewBox="0 0 200 230"><path d="M100,12 L184,44 V112 C184,170 146,206 100,222 C54,206 16,170 16,112 V44Z" fill="${C.g}" ${S}/>
      <path d="M60,116 l28,28 l54,-60" fill="none" stroke="${C.ink}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lock: () => `<svg viewBox="0 0 160 190"><path d="M40,80 V56 a40,40 0 0 1 80,0 V80" fill="none" ${S}/><rect x="16" y="80" width="128" height="96" rx="18" fill="${C.g}" ${S}/><circle cx="80" cy="122" r="12" fill="${C.ink}"/><path d="M80,128 v22" ${S}/></svg>`,
    crate: () => `<svg viewBox="0 0 460 340"><rect x="20" y="40" width="420" height="280" rx="18" fill="#fff" ${S}/>
      ${[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4, 5, 6, 7].map((c) => `<rect x="${52 + c * 46}" y="${70 + r * 46}" width="34" height="34" rx="6" fill="${(r + c) % 3 ? C.wash : C.g}" stroke="${C.ink}" stroke-width="3"/>`).join("")).join("")}</svg>`,
    sofa: () => `<svg viewBox="0 0 800 300"><rect x="40" y="70" width="720" height="150" rx="40" fill="${C.wash}" ${S}/>
      <rect x="10" y="120" width="110" height="150" rx="34" fill="#fff" ${S}/><rect x="680" y="120" width="110" height="150" rx="34" fill="#fff" ${S}/>
      <rect x="110" y="170" width="580" height="90" rx="22" fill="#fff" ${S}/><path d="M120,262 v30 M680,262 v30" ${S}/></svg>`,
    phone: () => `<svg viewBox="0 0 400 640"><rect x="10" y="10" width="380" height="620" rx="54" fill="${C.ink}"/><rect x="30" y="34" width="340" height="572" rx="36" fill="#fff"/>
      <rect x="150" y="48" width="100" height="22" rx="11" fill="${C.ink}"/></svg>`,
    calendar: () => `<svg viewBox="0 0 360 380"><rect x="20" y="40" width="320" height="320" rx="26" fill="#fff" ${S}/>
      <path d="M20,120 h320" ${S}/><rect x="20" y="40" width="320" height="80" rx="26" fill="${C.g}" ${S}/><path d="M100,20 v50 M260,20 v50" ${S}/></svg>`,
    coin: () => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#F2C94C" ${S}/><circle cx="50" cy="50" r="30" fill="${C.gold}"/><text x="50" y="62" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#5A3B00">Rs</text></svg>`,
    ticket: (t = "SHARE") => `<svg viewBox="0 0 240 140"><rect x="8" y="8" width="224" height="124" rx="20" fill="${C.g}" ${S}/>
      <circle cx="8" cy="70" r="18" fill="${C.bg}" ${S}/><circle cx="232" cy="70" r="18" fill="${C.bg}" ${S}/>
      <text x="120" y="84" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="40" fill="${C.ink}">${t}</text></svg>`,
    arrowUp: (c = C.g) => `<svg viewBox="0 0 120 120"><path d="M60,104 V22 M24,56 L60,18 L96,56" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    arrowDown: (c = C.red) => `<svg viewBox="0 0 120 120"><path d="M60,16 V98 M24,64 L60,102 L96,64" fill="none" stroke="${c}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bubble: () => `<svg viewBox="0 0 860 300" preserveAspectRatio="none"><path d="M40,20 H820 a30,30 0 0 1 30,30 V200 a30,30 0 0 1 -30,30 H420 L360,290 L370,230 H40 a30,30 0 0 1 -30,-30 V50 a30,30 0 0 1 30,-30Z" fill="#fff" ${S}/></svg>`,
    cloud: () => `<svg viewBox="0 0 760 520"><path d="M130,420 C40,420 30,300 110,280 C80,180 200,120 270,170 C300,70 470,60 500,160 C580,110 700,170 660,270 C740,300 720,430 620,420Z" fill="#fff" ${S}/>
      <circle cx="120" cy="470" r="26" fill="#fff" ${S}/><circle cx="70" cy="505" r="14" fill="#fff" ${S}/></svg>`,
  };
  const icon = (parent, name, x, y, w, h, arg, arg2) => el(parent, { left: x, top: y, width: w, height: h }, ICON[name](arg, arg2), "icon");

  // a line chart path (points 0..1) drawn on with stroke-dash
  function chart(parent, pts, o) {
    const W = o.w, H = o.h, pad = 10;
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${(pad + x * (W - 2 * pad)).toFixed(1)},${(pad + (1 - y) * (H - 2 * pad)).toFixed(1)}`).join(" ");
    const box = el(parent, { left: o.x, top: o.y, width: W, height: H },
      `<svg viewBox="0 0 ${W} ${H}" style="overflow:visible"><path class="ln" d="${d}" fill="none" stroke="${o.color || C.g}" stroke-width="${o.sw || 14}" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    const p = box.querySelector(".ln");
    const len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    box.draw = (t, d2 = 1) => tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: d2, ease: "power2.inOut", immediateRender: false }, t);
    box.path = p; box.len = len;
    return box;
  }
  // horizontal meter bar
  function meter(parent, label, o) {
    const box = el(parent, { left: o.x, top: o.y, width: o.w || 840, height: 120 },
      `<div class="m-lab">${label}</div><div class="m-track"><div class="m-fill" style="background:${o.color || C.g}"></div></div><div class="m-arrow"></div>`, "meter");
    const f = box.querySelector(".m-fill");
    gsap.set(f, { scaleX: o.start ?? 0.3 });
    box.to = (v, t, d = 0.8, arrow) => {
      tl.to(f, { scaleX: v, duration: d, ease: "power3.out" }, t);
      if (arrow) tl.set(box.querySelector(".m-arrow"), { innerHTML: arrow }, t);
    };
    return box;
  }

  // ── transitions ─────────────────────────────────────────────────────────────
  const wipeLayer = el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 50, pointerEvents: "none" }, "", "wipes");
  // brand wipe: three slanted bars rise and cover the frame at `cut` (covered cut-0.06 .. cut+0.06)
  function wipe(cut, colors = [C.g, C.g3, C.ink]) {
    const bars = colors.map((c, i) => el(wipeLayer, { left: -300 + i * 470, top: 0, width: 760, height: 1920, background: c }));
    bars.forEach((b) => gsap.set(b, { skewX: -16, yPercent: 120 }));
    tl.to(bars, { yPercent: 0, duration: 0.34, ease: "power3.in", stagger: 0.03 }, cut - 0.4)
      .to(bars, { yPercent: -120, duration: 0.36, ease: "power3.out", stagger: 0.03 }, cut + 0.04);
  }
  // whip: out-scene slides left with blur, in-scene enters from right
  function whip(outS, inS, t, dir = -1) {
    tl.to(outS, { x: dir * 1100, filter: "blur(18px)", duration: 0.3, ease: "power3.in" }, t - 0.3)
      .fromTo(inS, { x: -dir * 1100, filter: "blur(18px)" }, { x: 0, filter: "blur(0px)", duration: 0.36, ease: "power3.out", immediateRender: false }, t);
  }
  // zoom-through: out-scene scales up past camera, in-scene scales up from small
  function zoomThrough(outS, inS, t) {
    tl.to(outS, { scale: 2.6, opacity: 0, filter: "blur(10px)", duration: 0.32, ease: "power3.in", transformOrigin: "50% 45%" }, t - 0.32)
      .fromTo(inS, { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.42, ease: "expo.out", immediateRender: false }, t);
  }
  // push up
  function pushUp(outS, inS, t) {
    tl.to(outS, { yPercent: -100, duration: 0.42, ease: "power3.inOut" }, t - 0.21)
      .fromTo(inS, { yPercent: 100 }, { yPercent: 0, duration: 0.42, ease: "power3.inOut", immediateRender: false }, t - 0.21);
  }
  // red glitch flash
  function glitch(t) {
    const f = el(wipeLayer, { left: 0, top: 0, width: 1080, height: 1920, background: C.red, opacity: 0 });
    tl.to(f, { opacity: 0.85, duration: 0.05 }, t - 0.12).to(f, { opacity: 0, duration: 0.05 }, t - 0.06)
      .to(f, { opacity: 0.6, duration: 0.04 }, t + 0.02).to(f, { opacity: 0, duration: 0.12 }, t + 0.07)
      .fromTo(stage, { x: -18 }, { x: 0, duration: 0.3, ease: "elastic.out(1,0.3)" }, t);
  }
  function shake(t, amp = 14, target = stage) {
    tl.fromTo(target, { x: amp, y: -amp / 2 }, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1.2,0.25)", immediateRender: false }, t);
  }

  window.K = { C, tl, stage, el, scene, who, words, reveal, hideWords, slab, slabIn, slabOut, pop, popOut, rise, slideIn,
               counter, pk, en, ICON, icon, chart, meter, wipe, whip, zoomThrough, pushUp, glitch, shake };
})();
