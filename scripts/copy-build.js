import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const publicDir = join(root, 'public');

const builtJs = join(dist, 'app.js');
if (existsSync(builtJs)) {
  copyFileSync(builtJs, join(publicDir, 'app.js'));
  console.log('Copied app.js to public/');
} else {
  console.warn('Built app.js not found at', builtJs);
}
