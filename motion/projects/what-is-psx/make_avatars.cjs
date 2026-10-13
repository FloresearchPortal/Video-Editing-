// Builds avatars.js — the cast in Notionists (by Zoish, CC0; DiceBear code MIT) with FloStocks
// green accents. Each character is stored as its SVG layer groups plus swappable alternatives for
// the face parts (expressions) and the hand gesture, so the timeline can change them per frame.
// Run: node make_avatars.cjs
const { createAvatar } = require('@dicebear/core');
const notionists = require('@dicebear/notionists');

const G = '#38D100', G2 = '#2AA300', G3 = '#1F7A00', WASH = '#CFF2BF';
const v = (n) => 'variant' + String(n).padStart(2, '0');

const EXPR = {             // eyes, brows, lips
  neutral: [3, 4, 4], smile: [3, 4, 22], happy: [1, 4, 3], grin: [1, 4, 25], talk: [3, 4, 8],
  wow: [5, 12, 15], worried: [3, 13, 24], shocked: [5, 13, 11], think: [3, 2, 20], blink: [2, 4, 22],
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
};

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
  groups[1] = recolor(groups[1], '#fff', c.shirt);
  if (c.hatTint) groups[2] = recolor(groups[2], '#fff', c.hatTint);
  if (c.hijabTint) groups[2] = recolor(groups[2], '#000', c.hijabTint);
  out[name] = {
    head: base.head.replace('<svg ', '<svg class="av" '),
    groups,
    exprIdx,
    gestIdx,
    expr: Object.fromEntries(Object.entries(alt.expr).map(([k, g]) => [k, exprIdx.map((i) => g[i])])),
    gesture: alt.gesture,
  };
}
require('fs').writeFileSync(__dirname + (process.argv[3] || '/avatars.js'), (process.argv[4] || 'window.AVDATA') + ' = ' + JSON.stringify(out) + ';\n');
console.log(Object.keys(out).length, 'characters; face layers', out.ahmed.exprIdx, 'gesture layer', out.ahmed.gestIdx);
