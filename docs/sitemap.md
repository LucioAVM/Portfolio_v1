# Sitemap y wireframes

> **Estado Fase 1:** cerrado. Mapa de rutas + wireframes textuales por sección.

## Convención de rutas

- **ES (default):** sin prefijo — `/proyectos`, `/contacto`
- **EN:** prefijo `/en/` — `/en/projects`, `/en/contact`
- **Contenido MDX:** carpetas `es/` y `en/` (independiente de nombres de ruta traducidos)
- **Mapa programático:** `src/i18n/config.ts` → `routeMap`

## Mapa de rutas

### Español (default, sin prefijo)

| Ruta | Página | Descripción |
| --- | --- | --- |
| `/` | Home | Hero, proyectos destacados, CTA contacto |
| `/proyectos` | Proyectos | Grid + filtros `?category=` `?tag=` |
| `/proyectos/[slug]` | Detalle | MDX + links + galería |
| `/ciberseguridad` | Ciber | Índice writeups + certs |
| `/impresion-3d` | 3D | Vista filtrada `category: impresion3d` |
| `/sobre-mi` | Bio | Presentación + skills |
| `/contacto` | Contacto | Form + Turnstile |
| `/links` | Links | Linktree propio, sin PII |
| `/cv` | CV | Resumen o PDF sin PII |
| `/404` | Error | 404 localizado |

### English (`/en/`)

| Ruta | Equivalente ES |
| --- | --- |
| `/en/` | Home |
| `/en/projects` | `/proyectos` |
| `/en/projects/[slug]` | `/proyectos/[slug]` |
| `/en/cybersecurity` | `/ciberseguridad` |
| `/en/3d-printing` | `/impresion-3d` |
| `/en/about` | `/sobre-mi` |
| `/en/contact` | `/contacto` |
| `/en/links` | `/links` |
| `/en/cv` | `/cv` |
| `/en/404` | `/404` |

### API (Pages Function)

| Ruta | Método | Descripción |
| --- | --- | --- |
| `/api/contact` | POST | Turnstile Siteverify + Resend |

No incluir `/api/` en sitemap.

## Navegación global

```
[Logo / Home]
Proyectos | Ciber | 3D | Sobre mí | Contacto | Links | CV
[Toggle tema] [ES ↔ EN]
[minimi slot — colapsado en mobile]
```

## Wireframes textuales

### Home `/` y `/en/`

```
[Nav global]
[Hero: nombre + rol + tagline bilingüe vía ui.json]
[CTA: Ver proyectos | Contactar]
[Grid: hasta 3 proyectos featured]
[Sección secundaria: enlace a Ciber o 3D según featured]
[Footer: links legales mínimos + año]
[minimi slot — dismissible, aria-live polite]
```

### Proyectos `/proyectos` y `/en/projects`

```
[Título + descripción desde ui.json]
[Filtros: pills category (dev | ciberseguridad | impresion3d)]
[Filtros: tags disponibles — solo whitelist]
[Estado URL: ?category=dev&tag=C — compartible]
[Grid de ProjectCards: cover, title, summary, tags]
[Empty state si filtro sin resultados]
[Pagination si > N proyectos — backlog]
```

### Detalle `/proyectos/[slug]`

```
[Breadcrumb: Proyectos > título]
[Título + meta: fecha, category, tech, tags]
[Cover image si media.cover]
[Contenido MDX]
[Links: repo | demo | download | video — solo los definidos]
[Galería screenshots si aplica]
[Navegación: ← Volver | Siguiente proyecto →]
[hreflang + canonical — Fase 2]
```

### Ciber `/ciberseguridad` y `/en/cybersecurity`

```
[Intro: enfoque en seguridad + empleabilidad]
[Lista writeups — cards filtradas category=ciberseguridad]
[Sección certificaciones — placeholder hasta Fase 4]
[CTA: contacto o LinkedIn]
```

### 3D `/impresion-3d` y `/en/3d-printing`

```
[Intro emprendimiento / hobby]
[Grid o masonry de piezas — category=impresion3d]
[CTA: contacto para encargos]
```

### Sobre mí `/sobre-mi` y `/en/about`

```
[Foto o avatar — sin EXIF]
[Bio corta + propuesta de valor]
[Skills agrupadas: dev | ciber | 3D]
[Timeline opcional — Fase 4]
[CTA: CV | Contacto | LinkedIn]
```

### CV `/cv` y `/en/cv`

```
[Resumen profesional en HTML]
[Botón descarga PDF — sin teléfono/email en PDF público]
[Link a proyectos destacados]
[Nota: versión completa solo bajo demanda vía LinkedIn/form]
```

### Links `/links` y `/en/links`

```
[Avatar / logo]
[Lista vertical de botones desde src/data/links.ts]
[featured primero]
[Sin email, teléfono, wa.me ni mailto:]
[Footer mínimo]
```

### Contacto `/contacto` y `/en/contact`

```
[Título + texto de privacidad]
[Form: nombre, mensaje]
[Honeypot oculto — anti-bot]
[Turnstile widget]
[Submit → POST /api/contact]
[Mensaje éxito / error]
[Fallback visible: LinkedIn si form falla]
```

### 404 `/404` y `/en/404`

```
[Mensaje localizado — ui.json]
[Link a Home y Proyectos]
[Mismo layout y nav que el resto del sitio]
```

## SEO (implementación Fase 2/5)

- `sitemap.xml` — integración Astro; excluir drafts y `/404`
- `robots.txt`
- `hreflang` + `canonical` por página
- OG/Twitter meta por ruta
- JSON-LD: `Person` en home, `CreativeWork` en detalle de proyecto

## Cambio de idioma

| Contexto | Comportamiento |
| --- | --- |
| Página estática | `routeMap[key][locale]` |
| Detalle proyecto | Mismo `slug` → ruta equivalente en otro locale |
| Proyecto `monolingual` | Ocultar switch o mostrar aviso |
| 404 | Mantener prefijo `/en/` si aplica |
