import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const js = fs.readFileSync(path.join(dir, '../assets-manifest/CveH2aTz.js'), 'utf8');
const kws = [
  'spotlight',
  'supertitle',
  'subtitle',
  'lenisScroll',
  'frame-content',
  'DecorationScrollingText',
  'spotlight-box',
  'darkGreen',
  '#8fff86',
  '#0f0f0f',
  'gsap="title"',
  'btn-label',
  'streak',
];

for (const kw of kws) {
  let idx = 0;
  let n = 0;
  while (n < 2) {
    const i = js.indexOf(kw, idx);
    if (i < 0) break;
    console.log(`\n=== ${kw} @${i} ===`);
    console.log(js.slice(i, i + 600).replace(/\s+/g, ' '));
    idx = i + kw.length;
    n++;
  }
}
