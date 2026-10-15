// Render helper for the PSX showreel (WebGL via ANGLE/SwiftShader in headless Chrome).
//   node scripts/psx-reel.mjs stills <outDir> <compId> [--scale=0.5] [frame ...]
//   node scripts/psx-reel.mjs video  <out.mp4> <compId> [--scale=0.5]
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [mode, out, id, ...rest] = process.argv.slice(2);
const scale = Number((rest.find((a) => a.startsWith('--scale=')) || '--scale=1').split('=')[1]);
const gl = (rest.find((a) => a.startsWith('--gl=')) || '--gl=angle').split('=')[1];
const frames = rest.filter((a) => !a.startsWith('--')).map(Number);
// --range=a-b renders only those frames (build.py runs several processes in parallel, one browser each:
// several software-WebGL contexts in ONE browser can deadlock, separate processes cannot)
const rangeArg = (rest.find((a) => a.startsWith('--range=')) || '').split('=')[1];
const frameRange = rangeArg ? rangeArg.split('-').map(Number) : undefined;
const chromiumOptions = { gl };

await import('./gen-font-data.mjs');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'projects', 'psx-reel', 'index.ts'), publicDir: path.join(root, '..', 'media') });
const composition = await selectComposition({ serveUrl, id, chromiumOptions });

if (mode === 'stills') {
  mkdirSync(out, { recursive: true });
  for (const frame of frames.length ? frames : [0]) {
    const t = Date.now();
    await renderStill({ serveUrl, composition, output: path.join(out, `f${String(frame).padStart(4, '0')}.png`), frame, scale, imageFormat: 'png', overwrite: true, chromiumOptions, timeoutInMilliseconds: 180000 });
    console.log('still', frame, `${((Date.now() - t) / 1000).toFixed(1)}s`);
  }
} else if (mode === 'video') {
  const t = Date.now();
  await renderMedia({
    serveUrl, composition, outputLocation: out, scale, codec: 'h264', pixelFormat: 'yuv420p', crf: 8,
    imageFormat: 'jpeg', jpegQuality: 95, muted: true, overwrite: true, chromiumOptions, concurrency: 1, frameRange, timeoutInMilliseconds: 300000,
    onProgress: ({ progress }) => { const p = Math.round(progress * 100); if (p % 10 === 0 && p !== globalThis.__p) { globalThis.__p = p; console.log(`  ${p}%  ${((Date.now() - t) / 1000).toFixed(0)}s`); } },
  });
  console.log('->', out, `${((Date.now() - t) / 1000).toFixed(0)}s`);
}
