import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const js = fs.readFileSync(path.join(dir, '../assets-manifest/C3JuQ95o.js'), 'utf8');

const start = js.indexOf('DecorationFloatingLetters');
console.log('Component at:', start);
console.log(js.slice(start, start + 8000).replace(/\s+/g, ' '));
