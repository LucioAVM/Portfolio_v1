import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const h = fs.readFileSync(path.join(dir, '../raw/home.html'), 'utf8');

const gsap = [...h.matchAll(/gsap="([^"]+)"/g)].map((m) => m[1]);
console.log('gsap attrs unique:', [...new Set(gsap)]);

const letters = h.match(/"letters":\[[^\]]+\]/);
console.log('\nletters:', letters?.[0]);

const symbols = h.match(/floatingLetters[^,]{0,120}/gi);
console.log('\nfloatingLetters:', symbols?.slice(0, 3));

// watermark section
const wm = h.indexOf('scrolling-text');
console.log('\nwatermark ctx:', h.slice(wm - 100, wm + 400));

// spotlight
const sp = h.indexOf('spotlight');
console.log('\nspotlight ctx:', h.slice(sp - 50, sp + 500));
