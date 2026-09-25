import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  root: 'www',
  envDir: resolve('.'),
  publicDir: false,
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve('www/index.html'),
        cozinha: resolve('www/cozinha.html'),
      },
    },
  },
});
