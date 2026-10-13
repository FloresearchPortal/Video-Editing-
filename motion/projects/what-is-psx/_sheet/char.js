// FloStocks explainer characters — flat vector, no outlines, soft one-side shading.
// Each character is an SVG <g> in a 400x560 box (half body, head centre 200,150).
// Rig: .head (tilt/bob), .eyes (blink), .m-<mood> mouths, .brow-<calm|worry|up>,
// .armL/.armR rotate at the shoulder, .foreL/.foreR at the elbow, .propL/.propR stay upright.
(function () {
  const G = "#38D100", G2 = "#2AA300", G3 = "#1F7A00", G4 = "#0C5E06";
  const CREAM = "#F3EBDD", SLATE = "#2E3A40", WHITE = "#FFFFFF", GREY = "#C9D1CC";
  const HAIR = "#2B1E16", LIP = "#7A3326", INK = "#0B0F14";
  const SKIN = { a: ["#C68B59", "#A9703F"], b: ["#A8693F", "#8A532E"], c: ["#E2A97E", "#C98D62"], d: ["#8D5531", "#6E3F22"] };
  let uid = 0;

  const TORSO = "M78,560 C78,420 84,340 112,304 C134,276 164,264 200,264 C236,264 266,276 288,304 C316,340 322,420 322,560Z";
  const shade = (id) => `<path d="M228,264 C262,268 300,290 312,330 C322,380 322,470 322,560 L250,560 C262,450 258,340 228,264Z" fill="#000" opacity="0.13" clip-path="url(#tc${id})"/>`;

  function top(kind, c, id) {
    const clip = `<defs><clipPath id="tc${id}"><path d="${TORSO}"/></clipPath></defs>`;
    const base = (fill) => `${clip}<path d="${TORSO}" fill="${fill}"/>`;
    switch (kind) {
      case "kurta": return base(c || CREAM) + `<path d="M186,268 L200,300 L214,268 L200,276Z" fill="#00000022"/><rect x="196" y="300" width="8" height="120" rx="4" fill="#00000018"/>
        ${[322, 352, 382].map((y) => `<circle cx="200" cy="${y}" r="5" fill="${G3}"/>`).join("")}` + shade(id);
      case "apron": return base(CREAM) + `<path d="M132,330 C150,312 250,312 268,330 L284,560 L116,560Z" fill="${G}" clip-path="url(#tc${id})"/>
        <path d="M150,330 C158,280 242,280 250,330" fill="none" stroke="${G3}" stroke-width="9"/><rect x="168" y="420" width="64" height="44" rx="10" fill="${G3}"/>
        <text x="200" y="452" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="22" fill="${WHITE}">CHAI</text>` + shade(id);
      case "hoodie": return base(c || G) + `<path d="M144,272 C160,330 240,330 256,272 C238,262 162,262 144,272Z" fill="#00000026"/>
        <rect x="181" y="300" width="7" height="58" rx="3.5" fill="${WHITE}"/><rect x="212" y="300" width="7" height="58" rx="3.5" fill="${WHITE}"/>
        <path d="M136,470 L264,470 L250,540 L150,540Z" fill="#00000020"/>` + shade(id);
      case "shirt": return base(c || WHITE) + `<path d="M162,270 L200,322 L184,334 L148,290Z" fill="${c ? "#00000022" : "#E3E7E4"}"/><path d="M238,270 L200,322 L216,334 L252,290Z" fill="${c ? "#00000022" : "#E3E7E4"}"/>
        <rect x="196" y="322" width="8" height="238" fill="#00000014"/>` + shade(id);
      case "blazer": return base(SLATE) + `<path d="M170,268 L200,330 L230,268Z" fill="${WHITE}"/><path d="M193,300 L207,300 L212,420 L200,436 L188,420Z" fill="${G}"/>
        <path d="M150,282 L200,400 L176,300Z" fill="#00000030"/><path d="M250,282 L200,400 L224,300Z" fill="#00000030"/>` + shade(id);
      case "dupatta": return base(c || WHITE) + `<path d="M108,300 C150,340 250,340 292,300 L300,330 C250,380 150,380 100,330Z" fill="${G}"/>
        <path d="M268,318 L300,330 L312,560 L272,560Z" fill="${G2}"/>` + shade(id);
      default: return base(c || G) + `<path d="M168,268 C176,292 224,292 232,268Z" fill="#00000024"/>` + shade(id);  // tee
    }
  }

  const hairBack = {
    long: `<path d="M120,150 C100,260 104,350 140,380 L260,380 C296,350 300,260 280,150Z" fill="${HAIR}"/>`,
    hijab: (c) => `<path d="M118,160 C110,250 104,320 96,360 L304,360 C296,320 290,250 282,160Z" fill="${c}"/>`,
  };
  const hairFront = {
    short: `<path d="M134,140 C126,82 168,62 206,64 C250,66 276,92 268,142 C258,116 238,104 208,102 C182,112 156,116 134,140Z" fill="${HAIR}"/>`,
    quiff: `<path d="M134,146 C122,86 150,52 196,50 C228,44 270,60 272,110 L268,146 C262,118 240,100 214,98 C190,98 160,110 134,146Z" fill="${HAIR}"/><path d="M196,52 C226,40 262,52 262,80 C246,64 222,60 196,70Z" fill="#4A372B"/>`,
    curly: [[146, 104, 26], [176, 80, 28], [212, 74, 30], [246, 88, 27], [266, 118, 22], [136, 132, 20]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${HAIR}"/>`).join(""),
    long: `<path d="M134,150 C122,80 170,62 206,64 C248,66 280,96 268,156 C256,118 228,100 200,100 C188,124 158,138 134,150Z" fill="${HAIR}"/>`,
    bun: `<circle cx="200" cy="66" r="30" fill="${HAIR}"/><path d="M134,144 C128,88 168,72 204,74 C246,76 274,100 266,146 C252,112 222,100 200,102 C176,104 150,116 134,144Z" fill="${HAIR}"/>`,
    hijab: (c) => `<path d="M126,170 C118,92 160,62 200,62 C240,62 282,92 274,170 C262,120 236,98 200,98 C164,98 138,120 126,170Z" fill="${c}"/><path d="M200,62 C240,62 282,92 274,170 C268,130 252,104 226,92Z" fill="#00000022"/>`,
    cap: (c) => `<path d="M132,132 C130,70 270,68 270,132Z" fill="${c}"/><path d="M132,132 C150,122 250,122 270,132 L296,140 C300,146 290,150 270,146 C230,138 170,138 132,140Z" fill="${G4}"/><circle cx="201" cy="74" r="7" fill="${G4}"/>`,
  };

  function arm(side, sleeve, skin, prop) {
    const x = side === "L" ? 104 : 296;
    return `<g class="arm arm${side}">
      <rect x="${x - 26}" y="286" width="52" height="136" rx="26" fill="${sleeve}"/>
      <rect x="${x - 26}" y="286" width="52" height="136" rx="26" fill="#000" opacity="${side === "R" ? 0.12 : 0}"/>
      <g class="fore fore${side}">
        <rect x="${x - 24}" y="390" width="48" height="104" rx="24" fill="${sleeve}"/>
        <rect x="${x - 24}" y="390" width="48" height="104" rx="24" fill="#000" opacity="${side === "R" ? 0.12 : 0.05}"/>
        <circle cx="${x}" cy="504" r="23" fill="${skin[0]}"/><path d="M${x - 8},518 a14,10 0 0,0 16,0" fill="${skin[1]}"/>
        ${prop ? `<g transform="translate(${x},504)"><g class="prop prop${side}">${PROPS[prop]()}</g></g>` : ""}
      </g>
    </g>`;
  }

  function face(o, skin) {
    const B = `stroke="${HAIR}" stroke-width="7" stroke-linecap="round" fill="none"`;
    const L = `stroke="${LIP}" stroke-width="6" stroke-linecap="round" fill="none"`;
    return `
      <ellipse cx="166" cy="190" rx="13" ry="8" fill="#E9876F" opacity="0.32"/><ellipse cx="234" cy="190" rx="13" ry="8" fill="#E9876F" opacity="0.32"/>
      <g class="eyes"><ellipse cx="174" cy="160" rx="8" ry="10.5" fill="${HAIR}"/><ellipse cx="226" cy="160" rx="8" ry="10.5" fill="${HAIR}"/>
        <circle cx="177" cy="156" r="3" fill="#fff"/><circle cx="229" cy="156" r="3" fill="#fff"/></g>
      <g class="brow brow-calm"><path d="M160,138 Q173,131 186,137" ${B}/><path d="M214,137 Q227,131 240,138" ${B}/></g>
      <g class="brow brow-worry" opacity="0"><path d="M160,134 L186,142" ${B}/><path d="M240,134 L214,142" ${B}/></g>
      <g class="brow brow-up" opacity="0"><path d="M160,128 Q173,116 186,124" ${B}/><path d="M214,124 Q227,116 240,128" ${B}/></g>
      <path d="M198,166 C194,180 194,186 204,188 C208,188 210,184 208,182" fill="${skin[1]}"/>
      ${o.beard ? `<path d="M138,180 C142,232 172,250 200,250 C228,250 258,232 262,180 C250,212 228,214 200,214 C172,214 150,212 138,180Z" fill="${HAIR}" opacity="0.85"/>` : ""}
      ${o.mustache ? `<path d="M172,200 C182,188 196,192 200,197 C204,192 218,188 228,200 C216,206 206,203 200,201 C194,203 184,206 172,200Z" fill="${HAIR}"/>` : ""}
      <g class="m m-smile"><path d="M182,210 Q200,224 218,210" ${L}/></g>
      <g class="m m-grin" opacity="0"><path d="M178,206 Q200,238 222,206Z" fill="${LIP}"/><path d="M182,207 L218,207 L214,214 L186,214Z" fill="#fff"/></g>
      <g class="m m-o" opacity="0"><ellipse cx="200" cy="214" rx="10" ry="13" fill="${LIP}"/></g>
      <g class="m m-worry" opacity="0"><path d="M182,218 Q191,208 200,216 Q209,224 218,214" ${L}/></g>
      <g class="m m-flat" opacity="0"><path d="M186,214 L214,214" ${L}/></g>
      ${o.glasses ? `<g fill="none" stroke="${INK}" stroke-width="5"><rect x="150" y="142" width="46" height="36" rx="12"/><rect x="204" y="142" width="46" height="36" rx="12"/><path d="M196,156 L204,156"/></g>` : ""}`;
  }

  // opts: {skin:a|b|c|d, hair, hairColor (cap/hijab colour), top, topColor, sleeve, glasses, mustache, beard, propL, propR}
  function person(o = {}) {
    const id = ++uid;
    const skin = SKIN[o.skin || "a"];
    const topColor = o.topColor;
    const sleeve = o.sleeve || ({ kurta: CREAM, apron: CREAM, blazer: SLATE, dupatta: topColor || WHITE, shirt: topColor || WHITE }[o.top] || topColor || G);
    const h = o.hair || "short";
    const hc = o.hairColor || G;
    const back = h === "long" ? hairBack.long : h === "hijab" ? hairBack.hijab(hc) : "";
    const front = typeof hairFront[h] === "function" ? hairFront[h](hc) : hairFront[h];
    return `<g class="person">
      ${back}
      ${top(o.top || "tee", topColor, id)}
      ${arm("L", sleeve, skin, o.propL)}${arm("R", sleeve, skin, o.propR)}
      <g class="head">
        <path d="M180,206 L220,206 L222,268 C210,276 190,276 178,268Z" fill="${skin[1]}"/>
        <ellipse cx="134" cy="166" rx="14" ry="20" fill="${skin[0]}"/><ellipse cx="266" cy="166" rx="14" ry="20" fill="${skin[1]}"/>
        <path d="M136,150 C136,96 166,76 200,76 C234,76 264,96 264,150 C264,212 236,240 200,240 C164,240 136,212 136,150Z" fill="${skin[0]}"/>
        <path d="M232,82 C252,96 264,118 264,150 C264,208 238,238 204,240 C236,222 248,180 246,140 C244,112 238,94 232,82Z" fill="${skin[1]}" opacity="0.55"/>
        ${front}
        ${face(o, skin)}
      </g>
    </g>`;
  }

  const PROPS = {
    cup: () => `<path d="M-22,-40 L22,-40 L17,18 L-17,18Z" fill="${WHITE}"/><path d="M4,-40 L22,-40 L17,18 L2,18Z" fill="#00000014"/><path d="M-25,-48 L25,-48 L25,-37 L-25,-37Z" fill="${G}"/>
      <path class="steam" d="M-8,-58 Q-16,-72 -8,-86 Q0,-100 -8,-114" fill="none" stroke="#B9C2BD" stroke-width="6" stroke-linecap="round"/>
      <path class="steam" d="M10,-56 Q2,-70 10,-84 Q18,-98 10,-112" fill="none" stroke="#B9C2BD" stroke-width="6" stroke-linecap="round"/>`,
    phone: () => `<rect x="-28" y="-62" width="56" height="98" rx="12" fill="${INK}"/><rect x="-21" y="-53" width="42" height="72" rx="5" fill="${G}"/><path d="M-14,0 L-4,-12 L4,-4 L14,-22" stroke="${WHITE}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    kettle: () => `<path d="M-30,-30 Q0,-64 30,-30" fill="none" stroke="${SLATE}" stroke-width="8"/><path d="M-44,-22 Q-50,48 -32,58 L32,58 Q50,48 44,-22Z" fill="#AEB8B3"/>
      <path d="M8,-22 L44,-22 Q50,48 32,58 L8,58Z" fill="#00000018"/><path d="M44,0 L84,-32 L78,8Z" fill="#AEB8B3"/><rect x="-46" y="-28" width="92" height="12" rx="6" fill="${SLATE}"/>`,
    ticket: () => `<g transform="rotate(-10)"><rect x="-50" y="-38" width="100" height="60" rx="10" fill="${G}"/><rect x="-50" y="-38" width="100" height="14" rx="7" fill="${G3}"/>
      <text x="0" y="8" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="24" fill="${INK}">SHARE</text></g>`,
    coin: () => `<circle cx="0" cy="-30" r="32" fill="#F2C94C"/><circle cx="0" cy="-30" r="24" fill="#E6A817"/><text x="0" y="-21" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="24" fill="#5A3B00">Rs</text>`,
    note: () => `<g transform="rotate(-8)"><rect x="-54" y="-36" width="108" height="56" rx="6" fill="#7FCB6A"/><circle cx="0" cy="-8" r="15" fill="#5FAE4C"/><text x="0" y="-2" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="16" fill="#1E4D14">100</text></g>`,
  };

  function armTargets(root, side) {
    const x = side === "L" ? 104 : 296;
    return [root.querySelector(".arm" + side), root.querySelector(".fore" + side), `${x} 300`, `${x} 404`];
  }
  function pose(tl, root, side, sh, el, at, dur = 0.35, ease = "back.out(1.7)") {
    const [a, f, so, eo] = armTargets(root, side);
    const pr = root.querySelector(".prop" + side);
    if (tl === null) {
      gsap.set(a, { rotation: sh, svgOrigin: so }); gsap.set(f, { rotation: el, svgOrigin: eo });
      if (pr) gsap.set(pr, { rotation: -(sh + el), svgOrigin: "0 0" });
      return;
    }
    tl.to(a, { rotation: sh, svgOrigin: so, duration: dur, ease }, at).to(f, { rotation: el, svgOrigin: eo, duration: dur, ease }, at);
    if (pr) tl.to(pr, { rotation: -(sh + el), svgOrigin: "0 0", duration: dur, ease }, at);
  }
  function mood(tl, root, m, at, brow) {
    const b = brow || (m === "worry" ? "worry" : m === "o" ? "up" : "calm");
    root.querySelectorAll(".m").forEach((e) => { const on = e.classList.contains("m-" + m) ? 1 : 0; tl === null ? gsap.set(e, { opacity: on }) : tl.set(e, { opacity: on }, at); });
    root.querySelectorAll(".brow").forEach((e) => { const on = e.classList.contains("brow-" + b) ? 1 : 0; tl === null ? gsap.set(e, { opacity: on }) : tl.set(e, { opacity: on }, at); });
  }
  function blinks(tl, root, t0, t1, seed = 1) {
    const eyes = root.querySelector(".eyes");
    gsap.set(eyes, { svgOrigin: "200 160" });
    for (let t = t0 + 0.5 + (seed % 5) * 0.31; t < t1 - 0.2; t += 2.4 + ((seed * 7 + Math.floor(t)) % 9) * 0.12) {
      tl.to(eyes, { scaleY: 0.1, duration: 0.06, ease: "none" }, t).to(eyes, { scaleY: 1, duration: 0.08, ease: "none" }, t + 0.07);
    }
  }
  // idle life: gentle head sway
  function idle(tl, root, t0, t1, amp = 1) {
    const head = root.querySelector(".head");
    for (let t = t0; t < t1 - 0.8; t += 1.6) {
      tl.to(head, { rotation: 3 * amp, svgOrigin: "200 250", duration: 0.8, ease: "sine.inOut" }, t)
        .to(head, { rotation: -2 * amp, svgOrigin: "200 250", duration: 0.8, ease: "sine.inOut" }, t + 0.8);
    }
  }
  function talk(tl, root, times) { times.forEach((t, i) => mood(tl, root, i % 2 ? "smile" : "grin", t)); }

  window.CH = { person, PROPS, pose, mood, blinks, idle, talk, G, G2, G3, G4, CREAM, SLATE, WHITE, GREY, INK };
})();
