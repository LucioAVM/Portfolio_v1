import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(
  fs.readFileSync(path.join(dir, '../raw/home-payload.json'), 'utf8'),
);

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

const home = resolve(217);
const content = home?.data?.story?.content ?? home;
const hero = {
  theme: content.theme,
  floating_chars: content.floating_chars,
  scrolling_text: content.scrolling_text,
  sections: content.sections?.map((s) => ({
    component: s.component,
    supertitle: s.supertitle,
    title: s.title,
    subtitle: s.subtitle,
  })),
};

console.log(JSON.stringify(hero, null, 2));
