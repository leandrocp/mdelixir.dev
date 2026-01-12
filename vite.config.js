import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import tidewave from 'tidewave/vite-plugin';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tidewave(),
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
