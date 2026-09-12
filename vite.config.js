import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import tidewave from 'tidewave/vite-plugin';
import { lumisHighlight } from './vite/lumis.js';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tidewave(),
    lumisHighlight(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
  },
})
