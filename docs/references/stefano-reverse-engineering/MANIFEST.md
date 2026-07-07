# Manifiesto de capturas

> Generado 2026-07-07. Archivos en `raw/` y `assets-manifest/` están en `.gitignore`.

---

## HTML prerenderizado (`raw/`)

| Archivo | Ruta origen |
| --- | --- |
| `home.html` | `/` |
| `about.html` | `/about` |
| `work.html` | `/work` |
| `contact.html` | `/contact` |
| `experiments.html` | `/experiments` |
| `home-payload.json` | `/_payload.json?…` |
| `about-payload.json` | (generado por script) |
| `work-payload.json` | (generado por script) |
| `contact-payload.json` | (generado por script) |

---

## Bundles JS/CSS (`assets-manifest/`)

| Archivo | ~Tamaño | Contenido |
| --- | --- | --- |
| `entry.C3FUNIhI.css` | grande | Tailwind compilado |
| `CveH2aTz.js` | ~640KB | Nuxt app, GSAP, Lenis, scrolling text |
| `C3JuQ95o.js` | ~850KB | Three.js, Tres, DecorationFloatingLetters |
| `+40 chunks` | varios | Rutas, componentes lazy |

Lista completa: `nuxt-chunks-home.txt`

---

## Extracciones derivadas

| Archivo | Script |
| --- | --- |
| `floating-letters-component.txt` | `extract-floating.mjs` |
| `three-extract.txt` | `extract-three.mjs` |
| `main-chunk-extract.txt` | `extract-main-chunk.mjs` |
| `motion-extract.txt` | `extract-motion.mjs` |
| `hero-dom.txt` | `extract-hero-dom.mjs` |
| `home-html-extract.txt` | `extract-home-html.mjs` |
| `home-hero-cms.json` | `resolve-hero.mjs` |
| `all-pages-hero.json` | `fetch-all-payloads.mjs` |
| `gsap-hooks.txt` | grep manual |
| `page-themes.txt` | grep manual |

---

## Scripts re-ejecutables (`scripts/`)

| Script | Función |
| --- | --- |
| `fetch-payload.mjs` | Descarga payload home |
| `fetch-all-payloads.mjs` | Payloads about/work/contact |
| `resolve-payload.mjs` | Resuelve refs Nuxt (home completo) |
| `resolve-hero.mjs` | Extrae theme + symbols + sections |
| `parse-payload.mjs` | Walk campos relevantes |
| `extract-floating.mjs` | Componente 3D completo |
| `extract-three.mjs` | Keywords Three.js en bundle |
| `extract-main-chunk.mjs` | Lenis, scrolling, btn |
| `extract-motion.mjs` | Motion patterns |
| `extract-hero-dom.mjs` | Snippets DOM hero |
| `extract-home-html.mjs` | gsap attrs + watermark |

---

## Pendiente de captura

- `/fonts/OS_subset.json`
- Screenshots por % scroll
- Video comparativo
- Payload `experiments` resuelto
