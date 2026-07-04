# Portfolio — Documentacion del proyecto

Boveda de conocimiento (Obsidian-friendly) para el portfolio personal bilingue ES/EN.

## Objetivo

Sitio unico que centraliza desarrollo, ciberseguridad e impresion 3D para mejorar empleabilidad. Security-by-design desde el arranque.

## Decisiones cerradas

| Tema | Decision |
| --- | --- |
| Stack | Astro + Tailwind + MDX + anime.js v4 |
| i18n | ES default sin prefijo (`/proyectos`); EN en `/en/` |
| Hosting | Cloudflare Pages (gratis), build `dist/`, Node 22 |
| Contacto | Pages Function + Turnstile server-side + Resend |
| Seguridad | Zod build-time, `_headers` CSP, sin PII en HTML |
| Adapter | **No** `@astrojs/cloudflare`; `functions/` nativas de Pages |

## Fases

| Fase | Estado | Descripcion |
| --- | --- | --- |
| 0 | **hecho** | Documentacion y guia Cursor |
| 1 | **hecho** | Modelo de contenido, sitemap, wireframes |
| 2 | **casi hecho** | Scaffolding técnico — ver auditoría abajo |
| 3 | en curso | UI, formulario y minimi ya implementados (adelantado) |
| 4 | pendiente | Contenido real |
| 5 | pendiente | Deploy, SEO, CI |

## Indice de documentos

### Fase 0

- [[guia-cursor]] — Como usar Cursor de forma eficiente
- [[seguridad]] — Threat model, headers, validaciones
- [[checklist-writeup]] — Checklist antes de publicar writeups
- [[desarrollo]] — Comandos locales, `.dev.vars`, Turnstile test keys
- [[deploy]] — Cloudflare Pages, env vars, DNS email
- [[ideas]] — Backlog de features memorables

### Fase 1

- [[modelo-contenido]] — Schema Zod, tags whitelist, showcase, PII
- [[sitemap]] — Rutas ES/EN y wireframes textuales

## Auditoría Fase 2 (2026-07-04)

| Requisito | Estado |
| --- | --- |
| Node pin (`.nvmrc` + `engines`) | ✓ Node 22 |
| Git + `.gitignore` | ⚠ repo init, **sin commits** |
| Astro + Tailwind + MDX + i18n | ✓ |
| Sin `@astrojs/cloudflare` | ✓ |
| `content.config.ts` + Zod | ✓ |
| `site` + `prefixDefaultLocale: false` | ✓ |
| hreflang + canonical (`SeoHead`) | ✓ |
| `public/_headers` CSP Report-Only | ✓ (HSTS + URLs HTTPS corregidos) |
| Sin `experimental.csp` | ✓ |
| `functions/api/` | ✓ |
| Dependabot + CI | ✓ |
| `package-lock.json` | ✓ |
| `robots.txt` + `security.txt` | ✓ |
| `LICENSE` | ✓ MIT |
| `src/assets/` | ✓ carpeta creada |
| Primer commit en Git | ✗ pendiente |
| `site` URL real post-deploy | ✗ placeholder |

**Pendiente para cerrar Fase 2:** primer commit + actualizar `site` en `astro.config.mjs` al deployar.

## Pendiente (no bloquea Fase 0)

- Nombre de dominio propio
- Cuentas Cloudflare + GitHub (Fase 2+)
- Retirar PII del Linktree viejo (Fase 5)

## Nota sobre `docs/`

Esta carpeta es documentacion interna (boveda Obsidian). Astro no la publica en el deploy; vive solo en Git.

## Carpeta del proyecto

`c:\Users\UGIO\source\repos\_PP\Portfolio`
