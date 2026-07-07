import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const js = fs.readFileSync(path.join(dir, '../assets-manifest/C3JuQ95o.js'), 'utf8');

const needles = [
  'MeshStandardMaterial',
  'roughness',
  'metalness',
  'PointLight',
  'AmbientLight',
  'bevelEnabled',
  'bevelSize',
  'bevelThickness',
  'floating',
  'letters',
  'clearAlpha',
  'clearColor',
  'TresCanvas',
  'scrollProgress',
  '#8fff86',
  '#111',
  '0x111',
  '{',
  '>',
  '#',
];

for (const n of needles) {
  let i = 0;
  let count = 0;
  while ((i = js.indexOf(n, i)) !== -1 && count < 2) {
    const snippet = js.slice(Math.max(0, i - 100), i + 150).replace(/\s+/g, ' ');
    console.log(`\n=== ${n} @${i} ===\n${snippet}`);
    i += n.length;
    count++;
  }
}
