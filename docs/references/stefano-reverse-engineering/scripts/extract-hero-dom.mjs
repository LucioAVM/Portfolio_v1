import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const h = fs.readFileSync(path.join(dir, '../raw/home.html'), 'utf8');

for (const attr of ['supertitle', 'title', 'subtitle', 'streak', 'spotlight', 'spotlight-box']) {
  const needle = `gsap="${attr}"`;
  const i = h.indexOf(needle);
  console.log(`\n=== ${attr} @ ${i} ===`);
  if (i >= 0) console.log(h.slice(i - 200, i + 600));
}
