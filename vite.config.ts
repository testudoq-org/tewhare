import { defineConfig } from 'vitest/config';
import { copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

export default defineConfig({
  root: 'public',
  publicDir: false,
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: "src/main.ts",
      output: {
        entryFileNames: 'app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: '/index.html'
  }
});

