// Render helper for PSX TOP 10 series episodes (2D, no WebGL). The episode is a brief JSON passed as
// input props to the one generic entry (src/projects/top10). Called by videos/top10/make_episode.py.
//   node scripts/top10.mjs stills <outDir>  --brief=<brief.json> [--scale=0.5] [frame ...]
//   node scripts/top10.mjs video  <out.mp4> --brief=<brief.json> [--scale=0.5]
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { mkdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [mode, out, ...rest] = process.argv.slice(2);
const arg = (k, d) => (rest.find((a) => a.startsWith(`--${k}=`)) || `--${k}=${d}`).split('=').slice(1).join('=');
const scale = Number(arg('scale', '1'));
const briefPath = arg('brief', '');
if (!briefPath) throw new Error('--brief=<brief.json> is required');
const inputProps = { brief: JSON.parse(readFileSync(briefPath, 'utf8')) };
const frames = rest.filter((a) => !a.startsWith('--')).map(Number);

await import('./gen-font-data.mjs');
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'projects', 'top10', 'index.ts'), publicDir: path.join(root, '..', 'media') });
const composition = await selectComposition({ serveUrl, id: 'Top10', inputProps });

if (mode === 'stills') {
  mkdirSync(out, { recursive: true });
  for (const frame of frames.length ? frames : [0]) {
    await renderStill({ serveUrl, composition, inputProps, output: path.join(out, `f${String(frame).padStart(4, '0')}.png`), frame, scale, imageFormat: 'png', overwrite: true });
    console.log('still', frame);
  }
} else if (mode === 'video') {
  const t = Date.now();
  await renderMedia({
    serveUrl, composition, inputProps, outputLocation: out, scale, codec: 'h264', pixelFormat: 'yuv420p', crf: 8,
    imageFormat: 'jpeg', jpegQuality: 95, muted: true, overwrite: true, concurrency: 4, timeoutInMilliseconds: 120000,
    onProgress: ({ progress }) => { const p = Math.round(progress * 100); if (p % 10 === 0 && p !== globalThis.__p) { globalThis.__p = p; console.log(`  ${p}%  ${((Date.now() - t) / 1000).toFixed(0)}s`); } },
  });
  console.log('->', out, `${((Date.now() - t) / 1000).toFixed(0)}s`);
}
