# Build Pipeline Specification

## Overview
The project uses Vite as a static site bundler. TypeScript source in `src/` is compiled to a single `app.js` file that is copied into `public/` for deployment.

## Configuration: `vite.config.ts`

### Root
- `root: 'public'` — serves static assets from `public/`
- `publicDir: false` — prevents Vite from copying `public/` into build output

### Build Output
- `outDir: '../dist'` — build artifacts go to `dist/`
- `emptyOutDir: true` — clean build each time
- Entry: `src/main.ts`
- Output: `app.js` (single entry file)
- Chunks: `assets/[name].js`
- Assets: `assets/[name].[ext]`

### Dev Server
- Port: `3000`
- Opens `/index.html` automatically

## Build Scripts

### `npm run dev`
Starts Vite dev server with HMR.

### `npm run build`
1. Runs `vite build` — bundles TypeScript to `dist/app.js`
2. Runs `node scripts/copy-build.js` — copies `dist/app.js` to `public/app.js`

### `npm run preview`
Serves the `public/` directory for production preview.

## Copy Script: `scripts/copy-build.js`
- Reads built `dist/app.js`
- Copies to `public/app.js` (overwriting previous build)
- This ensures `public/app.js` is always the latest compiled output

## Deployment
The `public/` folder is the deployable artifact:
- `index.html` — static HTML shell
- `styles.css` — all styles
- `app.js` — compiled application bundle
- No server-side processing required

## Supported Hosts
- Netlify, Cloudflare Pages, GitHub Pages, S3, or any static file host
- No build step required on the host — just upload `public/` contents
