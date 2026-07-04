# Backlog de ideas

Features memorables y mejoras futuras. Clasificadas para no sobreingenierizar la base.

## Leyenda

| Impacto base | Significado |
| --- | --- |
| Si | Condiciona arquitectura desde el arranque |
| No | Backlog; implementar cuando la base funcione |

## En la base (contemplado desde Fase 2-3)

| Idea | Impacto base | Estado |
| --- | --- | --- |
| anime.js v4 como unica lib de animacion | Si | pendiente Fase 3 |
| Slot de minimi en layout + collection de frases bilingue | Si | pendiente Fase 3 |
| Pagina `/links` estilo Linktree propia | Si | pendiente Fase 3 |
| Formulario Turnstile + Pages Function | Si | pendiente Fase 3 |

## Backlog (despues de base funcionando)

| Idea | Descripcion | Prioridad |
| --- | --- | --- |
| minimi — rotacion de frases | Logica random + animacion SVG | alta |
| minimi context-aware | Frases segun seccion (3D, ciber, dev) | alta |
| Micro-interaccion SVG `createDrawable` | Efecto dibujado en hero/divisores | media |
| Easter egg Konami | minimi reacciona o mini-terminal en ciber | baja |
| Filtros URL compartibles | `?category=dev&tag=C` | media |
| Analytics privacy-friendly | Plausible o Umami | baja |
| Self-host fonts | Menos terceros en CSP | media |
| Dominio propio + redirect pages.dev | SEO y profesionalismo | alta (Fase 5) |

## Descartado / no hacer

| Idea | Motivo |
| --- | --- |
| Web3Forms + Turnstile gratis | Turnstile en Web3Forms es Pro |
| mailto / telefono en HTML | Scraping y spam |
| `@astrojs/cloudflare` adapter | Pages Functions nativas alcanzan; adapter v13+ sin Pages |
| Astro experimental CSP + `_headers` | CSP duplicado |

## Notas

- Agregar nuevas ideas aca antes de implementarlas.
- Marcar estado: `idea` → `planificado` → `en curso` → `hecho`.
