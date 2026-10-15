// Render helper for the PSX Top 10 reel (bundles once).
//   node scripts/psx-top10.mjs stills <outDir> [frame ...]   -> PNG per frame (default: key frames)
//   node scripts/psx-top10.mjs video  <out.mp4> [--scale=0.5] -> silent H.264 yuv420p
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [mode, out, ...rest] = process.argv.slice(2);
const scale = Number((rest.find((a) => a.startsWith('--scale=')) || '--scale=1').split('=')[1]);
const frames = rest.filter((a) => !a.startsWith('--')).map(Number);

await import('./gen-font-data.mjs');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'projects', 'psx-top10', 'index.ts'), publicDir: path.join(root, '..', 'media') });
const composition = await selectComposition({ serveUrl, id: 'PsxTop10' });

if (mode === 'stills') {
  mkdirSync(out, { recursive: true });
  const list = frames.length ? frames : [0, 8, 20, 40, 60, 90, 120, 160, 200, 225, 250, 270, 330, 520, 760, 880, 925, 945, 990, 1010, 1040, 1070, 1110, 1150, 1170, 1200, 1330];
  for (const frame of list) {
    const file = path.join(out, `f${String(frame).padStart(4, '0')}.png`);
    await renderStill({ serveUrl, composition, output: file, frame, scale, imageFormat: 'png', overwrite: true });
    console.log('still', frame);
  }
} else if (mode === 'video') {
  await renderMedia({
    serveUrl, composition, outputLocation: out, scale, codec: 'h264', pixelFormat: 'yuv420p', crf: 8,
    imageFormat: 'jpeg', jpegQuality: 95, muted: true, overwrite: true, concurrency: 4, timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { const p = Math.round(progress * 100); if (p % 10 === 0 && p !== globalThis.__p) { globalThis.__p = p; console.log(`  ${p}%`); } },
  });
  console.log('\n->', out);
}
