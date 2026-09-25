import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
await cp('www/assets', 'dist/assets', { recursive: true });
await cp('www/manifest.json', 'dist/manifest.json');
await cp('www/sw.js', 'dist/sw.js');
