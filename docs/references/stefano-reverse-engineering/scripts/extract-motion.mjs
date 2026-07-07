import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const js = fs.readFileSync(path.join(dir, '../assets-manifest/CveH2aTz.js'), 'utf8');

// Lenis init
const lenisIdx = js.indexOf('new Lenis');
console.log('Lenis @', lenisIdx);
console.log(js.slice(lenisIdx - 200, lenisIdx + 800).replace(/\s+/g, ' '));

// title animation hook
for (const kw of ['supertitle', 'subtitle', 'streak', 'spotlight-box']) {
  const i = js.indexOf(`gsap="${kw}"`);
  if (i >= 0) {
    console.log(`\n=== ${kw} ===`);
    console.log(js.slice(i - 300, i + 500).replace(/\s+/g, ' '));
  }
}

// scrolling text animation yB function
const scrollIdx = js.indexOf('function yB');
if (scrollIdx < 0) {
  const yb = js.indexOf('yB=()=>');
  console.log('\n=== scrolling yB ===');
  console.log(js.slice(yb, yb + 600).replace(/\s+/g, ' '));
} else {
  console.log('\n=== scrolling yB ===');
  console.log(js.slice(scrollIdx, scrollIdx + 600).replace(/\s+/g, ' '));
}
