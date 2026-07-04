import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const projectsDir = path.join(root, 'src/content/projects');

function listSlugs(locale) {
  const dir = path.join(projectsDir, locale);
  /** @type {Map<string, { monolingual: boolean }>} */
  const map = new Map();
  if (!fs.existsSync(dir)) return map;

  for (const file of fs.readdirSync(dir)) {
    if (!/\.(md|mdx)$/.test(file)) continue;
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const slugMatch = content.match(/^slug:\s*["']?([^"'\n]+)["']?/m);
    const monoMatch = content.match(/^monolingual:\s*(true|false)/m);
    const slug = slugMatch?.[1]?.trim();
    if (!slug) {
      console.error(`Missing slug in ${locale}/${file}`);
      process.exit(1);
    }
    map.set(slug, { monolingual: monoMatch?.[1] === 'true' });
  }
  return map;
}

const es = listSlugs('es');
const en = listSlugs('en');
let failed = false;

for (const [slug, meta] of es) {
  if (!meta.monolingual && !en.has(slug)) {
    console.error(`Missing EN pair for slug: ${slug}`);
    failed = true;
  }
}

for (const [slug, meta] of en) {
  if (!meta.monolingual && !es.has(slug)) {
    console.error(`Missing ES pair for slug: ${slug}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('i18n slug parity OK');
