import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, '../raw/home-payload.json');

const res = await fetch(
  'https://www.stefanobartoletti.it/_payload.json?9428428f-a204-4b21-b206-9de8368b47fd',
);
const text = await res.text();
fs.writeFileSync(out, text);
console.log('bytes:', text.length);

const floating = text.match(/floating[^"]{0,80}/gi);
console.log('floating:', floating?.slice(0, 5));

const letters = text.match(/letters[^]]{0,120}/gi);
console.log('letters:', letters?.slice(0, 5));

// symbol chars in JSON strings
const symbols = [...text.matchAll(/"([#<>[\]()$%&{}@?]{1,2})"/g)].map((m) => m[1]);
console.log('symbol strings:', [...new Set(symbols)].slice(0, 20));
