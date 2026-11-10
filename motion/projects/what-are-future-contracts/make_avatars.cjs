// Builds avatars.js — the cast in Notionists (by Zoish, CC0; DiceBear code MIT) with FloStocks
// green accents. Each character is stored as its SVG layer groups plus swappable alternatives for
// the face parts (expressions) and the hand gesture, so the timeline can change them per frame.
// Run: node make_avatars.cjs
const { createAvatar } = require('../../node_modules/@dicebear/core');
const notionists = require('../../node_modules/@dicebear/notionists');

const G = '#38D100', G2 = '#2AA300', G3 = '#1F7A00', WASH = '#CFF2BF';
const v = (n) => 'variant' + String(n).padStart(2, '0');

const EXPR = {             // eyes, brows, lips
  neutral: [4, 4, 4], smile: [4, 4, 22], happy: [4, 12, 3], grin: [4, 12, 25], talk: [4, 4, 8],
  wow: [5, 12, 15], worried: [4, 13, 18], shocked: [5, 12, 15], think: [4, 2, 20], blink: [4, 4, 22], delight: [4, 12, 25],
  grinOpen: [4, 12, 25], bigO: [5, 1, 15], puzzled: [4, 13, 18],          // client-approved Set 2 (KSE-100 hook): grin, big O, puzzled
};
const GEST = ['hand', 'handPhone', 'point', 'pointLongArm', 'ok', 'okLongArm', 'waveLongArm', 'waveOkLongArms'];

// shirt: fill for the clothing's white areas; hairTint: recolour hair blacks (hijab) / whites (cap)
const LEVEL = process.argv[2] || 'less';
const SH = { more: [G, G, G, WASH, G, WASH, WASH, G], mid: [G, '#fff', G, '#fff', WASH, '#fff', WASH, '#fff'], less: Array(8).fill('#fff') }[LEVEL];
const CAST = {
  ahmed:  { hair: 16, beard: 9, body: 13, shirt: SH[0] },
  aap:    { hair: 'hat', body: 11, shirt: SH[1], hatTint: G },
  guide:  { hair: 38, body: 3, shirt: SH[2], glasses: 4 },
  sana:   { hair: 62, body: 1, shirt: SH[3], hijabTint: G3 },
  bilal:  { hair: 22, beard: 2, body: 5, shirt: SH[4] },
  ayesha: { hair: 39, body: 14, shirt: SH[5] },
  usman:  { hair: 54, beard: 8, body: 7, shirt: SH[6] },
  zara:   { hair: 48, body: 12, shirt: SH[7] },
  rehan:  { hair: 1, beard: 12, body: 20, shirt: '#1B2A44' },   // suited institutional investor (navy suit, tie)
  anchor: { hair: 55, body: 13, shirt: '#2C9E00', glasses: 8 }, // TV news anchor (client pick: male, option A - side part, clear glasses, lapel blazer #2C9E00)
  abbu:   { hair: 5, beard: 10, body: 10, glasses: 3, shirt: '#F4F1E8', vest: G3, hairTint: '#8C9196', beardTint: '#8C9196' },  // Abbu (client pick A: grey hair + moustache, reading glasses, green waistcoat over cream kurta)
  cousin: { hair: 3, body: 16, shirt: G3 },                     // cousin (client pick B: swept hair, deep-green blazer)
  batsman:{ hair: 6, beard: 11, body: 14, shirt: '#0E6B2E', helmet: 1, pak: 1 },  // senior batsman: helmet + Pakistan-style kit; holds the bat via gesture "bat"
  bhai:   { hair: 40, beard: 5, body: 18, shirt: '#2C9E00' },  // Bhai (client pick B: curly hair, curled moustache, green jacket over a black tee)
};

// cricket batsman extras (client-approved): helmet over the head (drawn above the brows), Pakistan-style kit print
const HELMET = '<g class="helmet"><path d="M512,830 C478,470 700,318 900,316 C1090,314 1222,430 1232,628 L1262,668 Q1268,690 1244,694 L780,700 C700,702 668,760 676,860 Q560,880 512,830Z" fill="#0B3D1E" stroke="#0B0F14" stroke-width="16" stroke-linejoin="round"/>' +
  '<path d="M600,500 C700,400 860,368 980,380" fill="none" stroke="#1F7A00" stroke-width="22" stroke-linecap="round" opacity=".9"/>' +
  '<path d="M780,694 L1252,682" stroke="#0B0F14" stroke-width="18" stroke-linecap="round"/>' +
  '<path d="M1170,700 C1190,800 1188,930 1150,1012 M720,1012 H1150 M720,860 V1012" fill="none" stroke="#C9CED3" stroke-width="16" stroke-linecap="round"/>' +
  '<path d="M1170,700 C1190,800 1188,930 1150,1012 M720,1012 H1150 M720,860 V1012" fill="none" stroke="#0B0F14" stroke-width="4" stroke-linecap="round" opacity=".55"/></g>';
const PAK = '<g class="kit"><path d="M520,1180 L840,1330 L1160,1180" fill="none" stroke="#7CDB4A" stroke-width="26" stroke-linejoin="round"/>' +
  '<text x="840" y="1540" text-anchor="middle" font-family="Manrope, Inter, sans-serif" font-weight="800" font-size="104" letter-spacing="6" fill="#FFFFFF">PAKISTAN</text>' +
  '<path d="M840,1590 l14,30 33,4 -24,22 6,33 -29,-16 -29,16 6,-33 -24,-22 33,-4z" fill="#FFFFFF"/></g>';

// split the top-level layer groups inside <g mask=...>
function layers(svg) {
  const start = svg.indexOf('<g mask=');
  const open = svg.indexOf('>', start) + 1;
  const out = [];
  let i = open, depth = 0, from = -1;
  const re = /<\/?g\b[^>]*>/g;
  re.lastIndex = open;
  let m;
  while ((m = re.exec(svg))) {
    if (m[0].startsWith('</')) {
      if (depth === 0) break;          // end of the mask group
      depth--;
      if (depth === 0) out.push(svg.slice(from, re.lastIndex));
    } else {
      if (depth === 0) from = m.index;
      if (!m[0].endsWith('/>')) depth++;
    }
  }
  return { head: svg.slice(0, open), groups: out, tail: '</g></svg>' };
}

function render(c, expr, gesture) {
  const [e, b, l] = EXPR[expr];
  return createAvatar(notionists, {
    seed: 'flo', backgroundColor: ['transparent'],
    hair: [c.hair === 'hat' ? 'hat' : v(c.hair)], body: [v(c.body)],
    beard: [v(c.beard || 1)], beardProbability: c.beard ? 100 : 0,
    glasses: [v(c.glasses || 1)], glassesProbability: c.glasses ? 100 : 0,
    gesture: [gesture], gestureProbability: 100, bodyIconProbability: 0,
    eyes: [v(e)], brows: [v(b)], lips: [v(l)], nose: [v(14)],   // short low nose: nothing between the brows
  }).toString();
}

const recolor = (g, from, to) => g.split(`fill="${from}"`).join(`fill="${to}"`);

const out = {};
for (const [name, c] of Object.entries(CAST)) {
  const base = layers(render(c, 'smile', 'hand'));
  const n = base.groups.length;
  const alt = { expr: {}, gesture: {} };
  const varying = new Set();
  for (const ex of Object.keys(EXPR)) {
    const g = layers(render(c, ex, 'hand')).groups;
    if (g.length !== n) throw new Error(`${name}/${ex}: layer count changed`);
    alt.expr[ex] = {};
    g.forEach((s, i) => { if (s !== base.groups[i]) varying.add(i); });
    alt.expr[ex] = g;
  }
  const exprIdx = [...varying].sort((a, b) => a - b);
  const gestIdx = n - 1;               // the gesture layer is drawn last
  for (const ge of GEST) alt.gesture[ge] = layers(render(c, 'smile', ge)).groups[gestIdx];
  // FloStocks accents: clothing (layer 1) white -> brand green; cap white -> green; hijab black -> deep green
  const groups = base.groups.slice();
  if (c.vest) groups[1] = recolor(groups[1], '#000', c.vest);          // waistcoat panels (body 10)
  groups[1] = recolor(groups[1], '#fff', c.shirt);
  if (c.pak) groups[1] = groups[1] + PAK;
  if (c.hairTint) groups[2] = recolor(groups[2], '#000', c.hairTint);  // grey hair
  if (c.beardTint) groups[4] = recolor(groups[4], '#000', c.beardTint); // grey moustache / beard
  if (c.hatTint) groups[2] = recolor(groups[2], '#fff', c.hatTint);
  if (c.hijabTint) groups[2] = recolor(groups[2], '#000', c.hijabTint);
  const expr = Object.fromEntries(Object.entries(alt.expr).map(([k, g]) => [k, exprIdx.map((i) => g[i])]));
  if (c.helmet) {                       // no hair; the helmet rides on the brows layer so it sits above brows/eyes in every expression
    groups[2] = '<g></g>';
    const k8 = exprIdx.indexOf(8);
    groups[8] = groups[8] + HELMET;
    for (const e of Object.keys(expr)) expr[e][k8] = expr[e][k8] + HELMET;
  }
  out[name] = {
    head: base.head.replace('<svg ', '<svg class="av" '),
    groups,
    exprIdx,
    gestIdx,
    expr,
    gesture: alt.gesture,
  };
}
require('fs').writeFileSync(__dirname + (process.argv[3] || '/avatars.js'), (process.argv[4] || 'window.AVDATA') + ' = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length, 'characters; face layers', out.ahmed.exprIdx, 'gesture layer', out.ahmed.gestIdx);
