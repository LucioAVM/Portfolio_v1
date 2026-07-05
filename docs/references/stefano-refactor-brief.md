# Brief refactor — composición tipo Stefano Bartoletti

> **Fase actual:** clon composicional (parecido a la referencia).  
> **Fase siguiente:** identidad propia Lucio (copy, fotos, paleta cyber).  
> **Referencia:** [stefanobartoletti.it](https://www.stefanobartoletti.it/)  
> **Auditoría técnica:** [stefano-bartoletti-audit.md](./stefano-bartoletti-audit.md)

## Objetivo

Refactorizar el **home** (`/` y `/en/`) para que la **composición** se parezca a la referencia: app-shell, hero escena completa, projects numerados, footer tipo desktop app. Después se personaliza; ahora importa estructura, ritmo y motion coherentes.

## Problema de la implementación actual

| Síntoma | Causa |
| --- | --- |
| Sensación “plantilla con efectos” | Checklist de features sin jerarquía visual |
| Doble marco | `app-shell` + hero `rounded-2xl border` |
| Copy rígido | Split `prefix \| accent \| suffix` artificial |
| App-shell a medias | Dots decorativos sin sidebar ni footer app |
| Ruido visual | Watermark + símbolos + grid + spotlight + scroll bar apilados |
| Scroll bar vs minimi | Competencia en borde derecho inferior |

## Mapa de secciones (home)

| Orden | Sección referencia | Componente objetivo | Prioridad |
| --- | --- | --- | --- |
| 0 | App shell | `AppShell.astro` + `BaseLayout.astro` | P0 |
| 1 | Sidebar nav (desktop) | `SidebarNav.astro` | P0 |
| 2 | Top bar nombre | `Header.astro` refactor | P0 |
| 3 | Hero stage | `Hero.astro` refactor total | P0 |
| 4 | About teaser | `AboutTeaser.astro` | P1 |
| 5 | Projects highlight | `ProjectsHighlight.astro` | P0 |
| 6 | Collaboration CTA | `CollaborationCta.astro` | P1 |
| 7 | Footer app | `Footer.astro` refactor | P0 |
| 8 | Scroll streak | `ScrollProgress` (existente, ajustar posición) | P1 |

## Wireframe

```
+--[app border]------------------------------------------+
| [=][ ][x]          lucio <monsalbo>                     |
| SID |                                                  |
| [H] |     Home (supertitle mono)                       |
| [A] |     Hi, I'm Lucio, a [creative] developer        |
| [W] |     subtitle...                                  |
| [C] |     {  #  >  (depth/parallax)   build (watermark)|
|     |                                                  |
|     |     Projects highlight                           |
|     |     [01] [02] [03]                               |
|     |     [all projects]                               |
|     |     collaboration → let's get in touch           |
|-----+--------------------------------------------------|
| meta | links | CTA                           [scroll|] |
+--------------------------------------------------------+
                                              minimi -->
```

## Adaptación vs referencia

| Referencia | Nuestra v1 |
| --- | --- |
| Verde lima `#8fff86` | `--color-accent` emerald |
| Fuentes PP Object Sans / Machina | system-ui + mono (CSP self) |
| WebGL símbolos 3D | CSS 3D / SVG + parallax mouse |
| GSAP + ScrollTrigger | anime.js + IntersectionObserver |
| Watermark `develop` | `build` (i18n, luego `secure`/`cyber`) |
| Testimonials carrusel | **Fuera de scope** (sin contenido falso) |
| Sidebar siempre | Sidebar `lg+`; hamburger `< lg` |

## Copy hero (i18n)

Patrón referencia: *"Hi, I'm Stefano, a **creative** developer"*

**ES**

| Key | Valor sugerido |
| --- | --- |
| `hero.supertitle` | Inicio |
| `hero.line1` | Hola, soy Lucio, |
| `hero.accent` | creativo |
| `hero.line2` | desarrollador |
| `hero.watermark` | build |

**EN**

| Key | Valor sugerido |
| --- | --- |
| `hero.supertitle` | Home |
| `hero.line1` | Hi, I'm Lucio, |
| `hero.accent` | creative |
| `hero.line2` | developer |
| `hero.watermark` | build |

Subtitle: reutilizar `site.tagline`.

## Archivos a CREAR

```
src/components/layout/AppShell.astro
src/components/layout/SidebarNav.astro
src/components/home/ProjectsHighlight.astro
src/components/home/AboutTeaser.astro
src/components/home/CollaborationCta.astro
```

Opcional: `src/lib/motion/shell.ts` (hover nav).

## Archivos a REFACTOR

- `src/layouts/BaseLayout.astro`
- `src/components/Hero.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/components/ProjectCard.astro` (variante numerada)
- `src/styles/global.css`
- `src/lib/motion/hero.ts`
- `src/lib/motion/scroll-reveal.ts` (si simplifica)
- `src/pages/index.astro`, `src/pages/en/index.astro`
- `src/i18n/ui.es.json`, `src/i18n/ui.en.json`

## NO TOCAR

- `functions/api/contact.ts`
- `public/_headers` (CSP grado A)
- `src/lib/minimi/*` (solo evitar solapamiento con scroll bar)
- `src/content/**`
- Páginas secundarias salvo impacto global del shell

## Motion spec

| Elemento | Trigger | Props animadas | Timing |
| --- | --- | --- | --- |
| supertitle | load | opacity, translateY | 600ms |
| h1 palabras | load | stagger opacity, translateY | 70ms stagger |
| subtitle | load | opacity, translateY | 700ms, delay 400ms |
| CTAs | load | stagger | 80ms, delay 620ms |
| símbolos | load + mouse | scale, translate | parallax leve |
| watermark | load | translateX loop | 25–30s linear |
| h2 sección | scroll in | opacity, translateY | 650ms |
| cards | scroll in | stagger slideIn | 90ms |

Solo `transform` y `opacity`. Respetar `prefers-reduced-motion`.

## Criterios de aceptación

- [ ] Hero es escena principal, sin card `rounded-2xl` anidada
- [ ] Shell: sidebar desktop + footer app + top bar nombre mono
- [ ] H1 con una palabra accent (rol/adjetivo)
- [ ] Watermark + símbolos visibles, no compiten con H1
- [ ] Projects 01/02/03 con tags mono
- [ ] CTA contacto en footer o bloque collaboration
- [ ] Scroll streak no tapa minimi (offset o z-index)
- [ ] Sin GSAP, sin Three.js, sin deps nuevas
- [ ] `npm run build` + `npm run validate:i18n` OK
- [ ] NO commit, NO push

## Fase 2 (post-refactor)

- Copy y watermark propios (ciber/security)
- Fotos en project cards
- Testimonials reales o omitir
- Fuente display self-hosted
- Extender shell a páginas internas
