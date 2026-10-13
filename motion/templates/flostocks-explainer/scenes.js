// FloStocks explainer — STARTER scenes. Replace with the real beat sheet for each video.
// Rules + workflow: .claude/skills/flostocks-explainer/SKILL.md. Full worked example (114 s, 20 scenes):
// motion/projects/what-is-psx/scenes.js.
//
// Every cue time is a VO word time from videos/<slug>/edit/vo.words.json — never guess timings.
// Scenes are plain layers; K.linkScenes() (bottom) wires ONE smooth wipe at every scene start.
(function () {
  const { C, tl, el, scene, kin, charsIn, charsOut, roller, roll, who, react, life, candles, line, gauge,
          swap, psxHook, ctaLogo, icon } = K;
  const X = CAST.expr;
  const M = window.MARKET || { stocks: [] };

  // ── beat sheet (seconds, from vo.words.json) ────────────────────────────────
  const BEAT = {
    psx: 1.2, up: 3.3, down: 4.3,            // S1 hook: "...PSX ka naam...", "market upar", "market neeche"
    s2: 5.4, s2why: 6.2,                      // S2 question
    s3: 8.5, s3joy: 9.6,                      // S3 a character beat
    s4: 11.5, s4buy: 12.4,                    // S4 app: buying shares
    s5: 14.6, s5up: 15.2,                     // S5 price chart
    s6: 17.0, s6disc: 18.6, end: 22,          // S6 CTA → logo → disclaimer
  };

  // ═══ S1 HOOK: PSX logo alone on frame 0 → live KSE-100 card; candles follow the VO ═══
  const s1 = scene(0, BEAT.s2, { push: 1.03 });
  const hook = psxHook(s1, { tDock: BEAT.psx + 0.3, tUp: BEAT.up, tDown: BEAT.down });
  const up = kin(s1, "MARKET *UPAR* ▲", { y: 1250, size: 96, accent: C.gt });
  tl.fromTo(up.chars, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.02 }, BEAT.up);
  tl.to(up, { opacity: 0, duration: 0.2 }, BEAT.down - 0.18);
  const dn = kin(s1, "MARKET *NEECHE* ▼", { y: 1250, size: 96, accent: C.red });
  tl.fromTo(dn.chars, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.02 }, BEAT.down);

  // ═══ S2 QUESTION: one question mark only (the title's) ═══
  const s2 = scene(BEAT.s2, BEAT.s3);
  const q1 = kin(s2, "LEKIN AKHIR", { y: 520, size: 80, color: C.mute });
  const q2 = kin(s2, "YE SAB HAI *KIA?*", { y: 640, size: 150 });
  charsIn.rise(q1, BEAT.s2 + 0.1); charsIn.slam(q2, BEAT.s2why, 0.03);

  // ═══ S3 CHARACTER BEAT: characters only where the story needs them; one motion per reaction ═══
  const s3 = scene(BEAT.s3, BEAT.s4);
  const t3 = kin(s3, "AHMED KA *DHAABA*", { y: 260, size: 110 }); charsIn.rise(t3, BEAT.s3 + 0.1);
  const ahmed = who(s3, "ahmed", 290, 560, 500, { expr: "smile" });
  tl.fromTo(ahmed, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, BEAT.s3 + 0.1);
  life(ahmed, BEAT.s3, BEAT.s4, "smile", 3);
  react.joy(ahmed, BEAT.s3joy);

  // ═══ S4 APP BEAT: the FloStocks app (user's design) for buying — readable pace, no counting ═══
  const s4 = scene(BEAT.s4, BEAT.s5);
  const A = K.app(s4, 330, 210, 0.8);
  tl.fromTo(A.phone, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, BEAT.s4 + 0.05);
  K.tap(A, 381, 472, BEAT.s4buy, A.actions.Buy);
  tl.to(A.dim, { opacity: 1, duration: 0.2 }, BEAT.s4buy + 0.05).to(A.sheet, { yPercent: 0, duration: 0.35, ease: "expo.out" }, BEAT.s4buy + 0.05);
  tl.set(A.qty, { textContent: "1" }, BEAT.s4buy).set(A.total, { textContent: "Rs 100" }, BEAT.s4buy);
  [0.3, 0.56, 0.82, 1.08].forEach((dt, i) => {
    K.tap(A, 538, 842, BEAT.s4buy + dt, A.plus);
    tl.set(A.qty, { textContent: String(i + 2) }, BEAT.s4buy + dt + 0.05).set(A.total, { textContent: "Rs " + (i + 2) * 100 }, BEAT.s4buy + dt + 0.05);
  });

  // ═══ S5 PRICE CHART: proper line chart (grid, price axis, tracking dot), price swap ═══
  const s5 = scene(BEAT.s5, BEAT.s6);
  const pc = el(s5, { left: 60, top: 520, width: 960, height: 640, background: "#fff", border: "3px solid #E3E9E5", borderRadius: 36, boxShadow: "0 24px 50px rgba(20,40,20,.10)" });
  el(pc, { left: 44, top: 36, font: "600 34px 'IBM Plex Mono'", color: C.mute }, "ACHAI · SHARE PRICE");
  const price = el(pc, { left: 44, top: 84, font: "700 96px 'IBM Plex Mono'", color: C.text }, "Rs 100");
  const pl = line(pc, [[0, 0.05], [0.3, 0.2], [0.55, 0.45], [0.8, 0.7], [1, 0.95]], { x: 44, y: 250, w: 830, h: 340, color: C.g2, grid: true, rows: 2, axis: ["200", "150", "100"] });
  tl.fromTo(pc, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, BEAT.s5 + 0.05);
  pl.draw(BEAT.s5up, 1.2);
  swap(price, "Rs 200", BEAT.s5up + 1.2);

  // ═══ S6 CTA: FloStocks icon → full logo, follow button, disclaimer underneath ═══
  const s6 = scene(BEAT.s6, BEAT.end, { push: false });
  const cta = ctaLogo(s6, BEAT.s6 + 0.1, { tDisc: BEAT.s6disc });

  K.linkScenes();
  // solid graphics the overlap audit must treat as boxes (tools/flostocks/overlap_audit.cjs)
  [hook.logo, hook.card, A.phone, pc, cta.fl].forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
