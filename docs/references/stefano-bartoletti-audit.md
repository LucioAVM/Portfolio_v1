# Auditoría — stefanobartoletti.it

> Referencia: [https://www.stefanobartoletti.it/](https://www.stefanobartoletti.it/)  
> Fecha auditoría automática: 2026-07-04  
> **Refactor Pro:** ver [stefano-refactor-brief.md](./stefano-refactor-brief.md) y [PRO-REFACTOR-INSTRUCTIONS.md](./PRO-REFACTOR-INSTRUCTIONS.md)  
> Capturas: `assets/stefano/` y `assets/lucio-before/`

## Resumen

Portfolio “creative developer” con app-shell tipo ventana, hero cinematográfico (split text + WebGL), scroll reveals y cards animadas. Stack Nuxt + GSAP + Three.js. Adaptamos **patrones** al portfolio de Lucio (Astro + anime.js, sin WebGL en v1).

## Stack detectado

| Capa | Tecnología |
| --- | --- |
| Framework | Nuxt / Vue |
| Motion | GSAP (atributos `gsap="..."` en DOM) |
| 3D hero | Canvas WebGL full-viewport (símbolos `{`, `#`, `>`) |
| Tipografías | PP Object Sans, PP Neue Machina Inktrap |
| Accent | `#8fff86` (lima) sobre fondo ~`#0a0a0a` |
| Analytics | PostHog, Ahrefs |

## Mapa de animaciones (GSAP hooks)

| Hook | Comportamiento | Prioridad | Adaptación Lucio | Costo |
| --- | --- | --- | --- | --- |
| `title` | Split text H1, stagger entrada | Alta | `hero.ts` + spans `data-hero-word` | Bajo |
| `supertitle` / `subtitle` | Fade/slide label y párrafo | Alta | anime.js opacity + translateY | Bajo |
| `scrolling-text` | Watermark gigante horizontal | Media | CSS + translateX loop en Hero | Bajo |
| `spotlight` | Glow radial por sección | Media | CSS radial existente + opacity | Bajo |
| `reveal` / `reveal-t` | Títulos al scroll | Alta | `scroll-reveal.ts` + IntersectionObserver | Bajo |
| `slideIn` | Cards about/proyectos | Alta | stagger en `[data-reveal-stagger]` | Bajo |
| `streak` | Barra progreso scroll vertical | Baja | `#scroll-progress` en BaseLayout | Bajo |
| `btn-label` / `btn-icon` | Micro-interacción CTAs | Baja | CSS hover (fase posterior) | Bajo |
| WebGL símbolos | Parallax 3D `{#>}` | Media | SVG + mouse parallax sin Three.js | Medio |
| App-shell sidebar | Nav lateral + marco ventana | Media | Borde viewport + header refinado | Medio |
| GSAP + Three.js 1:1 | Copia exacta | — | **No en v1** (CSP + peso) | Alto |

## Layout (composición)

- Marco viewport con controles decorativos (min/max/close).
- Sidebar iconográfica izquierda (Home, About, Work, etc.).
- Hero centrado: palabra acentuada en color (`creative`).
- Watermark tipográfica de fondo (`develop`).
- Footer con metadata (ubicación, hora) + redes + CTA.
- Proyectos numerados 01/02/03 con tags stack.
- Testimonios en carrusel.
- CTA final colaboración.

## Qué tomamos / qué no

| Tomamos | Adaptamos | No copiamos |
| --- | --- | --- |
| Ritmo entrada hero | Lima → emerald `#34d399` + cyan | Three.js full-screen |
| Split text + accent word | Copy ES/EN propio | Fuentes PP pagas |
| Watermark + símbolos dev | `build` / `{` `>` `#` SVG | Sidebar completa en mobile |
| Scroll reveal secciones | anime.js | GSAP ScrollTrigger |
| Barra progreso scroll | Delgada, accent emerald | PostHog / analytics extra |
| App-shell sutil | Borde + footer metadata | Controles ventana funcionales |

## Capturas del usuario (completar)

Subir en `docs/references/assets/stefano/` cuando estén disponibles:

| # | Sección | Archivo sugerido | Notas |
| --- | --- | --- | --- |
| 1 | Hero carga inicial | `01-hero.png` | |
| 2 | Scroll ~25% watermark | `02-scroll-watermark.png` | |
| 3 | Projects + hover | `03-projects.png` | |
| 4 | About-me | `04-about.png` | |
| 5 | Footer / CTA | `05-footer-cta.png` | |
| 6 | Mobile (opcional) | `06-mobile.png` | |

Video opcional: `scroll-demo.webm` (15 s home → projects).

## Implementación en este repo

| Fase | Archivos | Estado |
| --- | --- | --- |
| A — Auditoría + docs | `docs/references/` | Hecho |
| B–E — Intento Auto (checklist) | Hero, shell, motion | **Mal aplicado — pendiente refactor Pro** |
| **Pro refactor** | Ver [stefano-refactor-brief.md](./stefano-refactor-brief.md) | Pendiente |

Instrucciones modelo Pro: [PRO-REFACTOR-INSTRUCTIONS.md](./PRO-REFACTOR-INSTRUCTIONS.md)

## QA post-implementación

- [ ] `npm run build`
- [ ] `npm run validate:i18n`
- [ ] Hero anima con motion; respeta `prefers-reduced-motion`
- [ ] Scroll reveal en featured projects
- [ ] CSP grado A sin nuevos dominios
