import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const payload = JSON.parse(
  fs.readFileSync(path.join(dir, '../raw/home-payload.json'), 'utf8'),
);

function walk(obj, path = '', hits = []) {
  if (obj && typeof obj === 'object') {
    if (Array.isArray(obj)) {
      obj.forEach((v, i) => walk(v, `${path}[${i}]`, hits));
    } else {
      for (const [k, v] of Object.entries(obj)) {
        const p = path ? `${path}.${k}` : k;
        if (
          /floating|scrolling|theme|letters|chars|symbol|hero|watermark/i.test(k) ||
          (typeof v === 'string' && /^(#|{|>|@|\[|\]|\(|\)|\$|%|&|\?)$/.test(v))
        ) {
          hits.push({ path: p, value: v });
        }
        walk(v, p, hits);
      }
    }
  }
  return hits;
}

const hits = walk(payload);
console.log('Relevant payload fields:');
for (const h of hits.slice(0, 80)) {
  const v =
    typeof h.value === 'string'
      ? h.value.slice(0, 120)
      : JSON.stringify(h.value)?.slice(0, 120);
  console.log(`- ${h.path}: ${v}`);
}
