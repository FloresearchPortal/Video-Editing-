// Render helper for PSX TOP 10 series episodes (2D, no WebGL).
//   node scripts/top10.mjs stills <outDir> <episodeDir> [--scale=0.5] [frame ...]
//   node scripts/top10.mjs video  <out.mp4> <episodeDir> [--scale=0.5]
// episodeDir = folder under src/projects (e.g. top10-mcap); composition id is always "Top10".
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [mode, out, ep, ...rest] = process.argv.slice(2);
const scale = Number((rest.find((a) => a.startsWith('--scale=')) || '--scale=1').split('=')[1]);
const frames = rest.filter((a) => !a.startsWith('--')).map(Number);

await import('./gen-font-data.mjs');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'projects', ep, 'index.ts'), publicDir: path.join(root, '..', 'media') });
const composition = await selectComposition({ serveUrl, id: 'Top10' });

if (mode === 'stills') {
  mkdirSync(out, { recursive: true });
  for (const frame of frames.length ? frames : [0]) {
    await renderStill({ serveUrl, composition, output: path.join(out, `f${String(frame).padStart(4, '0')}.png`), frame, scale, imageFormat: 'png', overwrite: true });
    console.log('still', frame);
  }
} else if (mode === 'video') {
  const t = Date.now();
  await renderMedia({
    serveUrl, composition, outputLocation: out, scale, codec: 'h264', pixelFormat: 'yuv420p', crf: 8,
    imageFormat: 'jpeg', jpegQuality: 95, muted: true, overwrite: true, concurrency: 4, timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { const p = Math.round(progress * 100); if (p % 10 === 0 && p !== globalThis.__p) { globalThis.__p = p; console.log(`  ${p}%  ${((Date.now() - t) / 1000).toFixed(0)}s`); } },
  });
  console.log('->', out, `${((Date.now() - t) / 1000).toFixed(0)}s`);
}
