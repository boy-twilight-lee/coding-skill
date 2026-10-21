import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
const bundle = await build({
  entryPoints: [fileURLToPath(new URL('../src/app.mjs', import.meta.url))],
  bundle: true,
  write: false,
  format: 'iife',
  platform: 'browser',
  target: 'es2020',
  minify: false
});
const template = await readFile(new URL('../src/app.html', import.meta.url), 'utf8');
const style = await readFile(new URL('../src/app.css', import.meta.url), 'utf8');
const html = template.replace('/* APP_STYLES */', () => style).replace('/* APP_SCRIPT */', () => bundle.outputFiles[0].text.replace(/<\/script/gi, '<\\/script'));
await writeFile(new URL('../dist/app.html', import.meta.url), html);
await build({
  entryPoints: [fileURLToPath(new URL('../src/server.mjs', import.meta.url))],
  outfile: fileURLToPath(new URL('../dist/server.mjs', import.meta.url)),
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  banner: { js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);" }
});
console.log('Built dist/app.html and dist/server.mjs');
