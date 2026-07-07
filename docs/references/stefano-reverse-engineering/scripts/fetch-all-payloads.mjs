import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const pages = ['about', 'work', 'contact'];

for (const page of pages) {
  const html = fs.readFileSync(path.join(dir, `../raw/${page}.html`), 'utf8');
  const m = html.match(/__NUXT_DATA__[^>]+data-src="([^"]+)"/);
  if (!m) {
    console.log(page, 'no payload url');
    continue;
  }
  const url = `https://www.stefanobartoletti.it${m[1]}`;
  const res = await fetch(url);
  const text = await res.text();
  const outPath = path.join(dir, `../raw/${page}-payload.json`);
  fs.writeFileSync(outPath, text);
  const data = JSON.parse(text);

  function resolve(idx, depth = 0, seen = new Set()) {
    if (depth > 30 || seen.has(idx)) return '[cycle]';
    const v = data[idx];
    if (v === undefined) return undefined;
    if (Array.isArray(v)) {
      seen.add(idx);
      return v.map((item) =>
        typeof item === 'number' && Number.isInteger(item)
          ? resolve(item, depth + 1, new Set(seen))
          : item,
      );
    }
    if (v && typeof v === 'object') {
      seen.add(idx);
      const out = {};
      for (const [k, val] of Object.entries(v)) {
        out[k] =
          typeof val === 'number' && Number.isInteger(val) && !k.endsWith('_uid') && k !== 'id'
            ? resolve(val, depth + 1, new Set(seen))
            : val;
      }
      return out;
    }
    return v;
  }

  // find story content with floating_chars
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    if (v && typeof v === 'object' && !Array.isArray(v) && v.floating_chars !== undefined) {
      const resolved = resolve(i);
      console.log(`\n=== ${page.toUpperCase()} ===`);
      console.log(
        JSON.stringify(
          {
            theme: resolved.theme,
            floating_chars: resolved.floating_chars,
            scrolling_text: resolved.scrolling_text,
          },
          null,
          2,
        ),
      );
      break;
    }
  }
}
