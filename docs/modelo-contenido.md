# Modelo de contenido

> **Estado Fase 1:** cerrado. Fuente de verdad para Content Collections, i18n y showcase.

## Estrategia i18n

| Regla | Detalle |
| --- | --- |
| Carpetas por locale | `src/content/projects/es/` y `en/` |
| Slug compartido | Mismo `slug` en frontmatter para pares ES/EN |
| Monolingual | `monolingual: true` si solo existe en un idioma |
| UI estática | `src/i18n/ui.es.json`, `ui.en.json` |
| Rutas traducidas | ES en raíz; EN en `/en/` — ver [[sitemap]] y `src/i18n/config.ts` |
| Validación CI | `npm run validate:i18n` en cada push/PR |

### Paridad de slugs

Script `scripts/validate-i18n.mjs`:

1. Lee todos los `.md`/`.mdx` en `es/` y `en/`
2. Extrae `slug` y `monolingual` del frontmatter
3. Falla si un slug en un locale no tiene par en el otro y `monolingual !== true`

**Cambio de idioma en UI:** debe resolver al mismo `slug` en el otro locale o ocultar el switch en páginas monolingües.

## Collection: `projects`

Archivo: `src/content.config.ts` (Astro 5+)

Loader: `glob` sobre `src/content/projects/**/*.{md,mdx}` — el id incluye locale (`es/cli-tool-c`, `en/cli-tool-c`).

### Frontmatter

| Campo | Tipo | Requerido | Notas |
| --- | --- | --- | --- |
| `title` | string | sí | Por locale |
| `summary` | string | sí | Una línea para cards |
| `description` | string | no | SEO / detalle |
| `slug` | string | sí | Compartido entre idiomas; `^[a-z0-9-]+$` |
| `category` | enum | sí | `dev` \| `ciberseguridad` \| `impresion3d` |
| `tags` | enum[] | no | Whitelist — ver abajo |
| `tech` | string[] | no | Stack libre (nombres de herramientas/lenguajes) |
| `links` | object | no | `github`, `demo`, `download`, `video` — solo HTTPS |
| `media` | object | no | `cover`, `screenshots[]`, `gallery[]` — paths relativos |
| `featured` | boolean | no | default `false` |
| `order` | number | no | Orden manual (menor = más arriba) |
| `date` | date | sí | Publicación |
| `draft` | boolean | no | default `false`; oculto en prod y sitemap |
| `monolingual` | boolean | no | default `false` |

### Whitelist de tags

Validados en build con Zod `z.enum()`. Definidos en `src/data/project-tags.ts`. Ampliar solo actualizando ese archivo y esta tabla.

| Grupo | Tags permitidos |
| --- | --- |
| Desarrollo | `C`, `CLI`, `Android`, `Kotlin`, `iOS`, `Desktop`, `Web`, `Python`, `Rust`, `Go`, `Java` |
| Ciber | `XSS`, `CTF`, `Writeup`, `Lab`, `Pentest`, `OWASP` |
| Impresión 3D | `PETG`, `PLA`, `Resina`, `Functional`, `Decorative`, `Prototype` |

**Query params de filtros:** solo valores de esta whitelist se aceptan en `?tag=` (sanitizar en runtime — ver `src/utils/projects.ts`).

### Validación Zod

- URLs: `.url()` + refine `https://`
- `slug`: regex `^[a-z0-9-]+$`
- `category`: enum estricto
- `tags`: cada elemento del enum

### Campo `media`

Opcional. Paths relativos a `src/assets/` (preferido) o referenciados en MDX.

```yaml
media:
  cover: ./covers/cli-tool-c.webp
  screenshots:
    - ./screenshots/cli-01.webp
  gallery:
    - ./gallery/stand-front.webp
```

**Pipeline de imágenes (Fase 4):**

- Imágenes optimizadas en `src/assets/` (no `public/` crudo)
- Formato WebP/AVIF; objetivo ≤ 500 KB por imagen post-compresión
- Strip EXIF antes de commit
- Componente `<Image>` de Astro en UI
- Git LFS solo si el volumen de fotos HD lo exige

### Showcase por tipo de proyecto

La UI muestra bloques según campos presentes — sin plantillas separadas por archivo:

| Campo presente | Bloque en ficha |
| --- | --- |
| `links.github` | Botón repositorio |
| `links.demo` | Enlace live |
| `links.download` | Descarga / store |
| `links.video` | Embed o link externo |
| `media.cover` / MDX | Hero visual |
| `media.screenshots` / galería MDX | Grid de capturas |
| Contenido MDX | Cuerpo (writeups, README-style) |

### Ejemplos por categoría

**`dev` — CLI en C**

```yaml
category: dev
tags: ["C", "CLI"]
links:
  github: https://github.com/org/repo
featured: true
```

**`ciberseguridad` — writeup**

```yaml
category: ciberseguridad
tags: ["Web", "XSS"]
draft: true   # hasta pasar [[checklist-writeup]]
```

**`impresion3d` — pieza**

```yaml
category: impresion3d
tags: ["PETG", "Functional"]
links:
  demo: https://...
```

## Collection: `minimi-quotes`

Frases bilingües en carpetas `src/content/minimi-quotes/es/` y `en/`.

| Campo | Tipo | Requerido |
| --- | --- | --- |
| `text` | string | sí — sin HTML embebido |
| `context` | enum | no — `general`, `ciber`, `dev`, `3d` |
| `order` | number | no |

Paridad por convención: mismos archivos `01-general.md`, `02-ciber.md` en ambos locales (no validado en CI aún).

## Datos estáticos: `src/data/links.ts`

Página `/links` estilo Linktree — **sin PII en HTML**.

```ts
interface LinkItem {
  id: string;
  label: { es: string; en: string };
  url: string;           // solo HTTPS
  icon?: string;
  featured?: boolean;
}
```

Enlaces centralizados aquí; no hardcodear URLs sueltas en componentes.

## Categorías y navegación

| category | Vista principal | Filtro en proyectos |
| --- | --- | --- |
| `dev` | `/proyectos` | `?category=dev` |
| `ciberseguridad` | `/ciberseguridad` | índice de writeups |
| `impresion3d` | `/impresion-3d` | vista filtrada |

**Una sola collection** — no existe `prints/` ni contenido duplicado.

## Política de datos expuestos

Ver [[seguridad]] (sección Privacidad). Resumen Fase 1:

| Dato | En el sitio |
| --- | --- |
| Email / teléfono | **No** en HTML |
| CV online | Resumen o PDF sin PII |
| Formulario | Turnstile + Pages Function (Fase 3) |
| Canal alternativo | LinkedIn (`LINKEDIN_URL` en `links.ts`) |

## Comportamiento `draft`

- `draft: true` → excluido de listados en producción (`import.meta.env.PROD`)
- Visible en `astro dev` para preview
- Excluido del sitemap generado
- Writeups ciber: obligatorio `draft: true` hasta [[checklist-writeup]]

## Archivos de referencia

| Archivo | Rol |
| --- | --- |
| `src/content.config.ts` | Schema Zod |
| `src/data/project-tags.ts` | Whitelist de tags |
| `src/utils/projects.ts` | Filtros, drafts, sanitización query params |
| `src/i18n/config.ts` | `routeMap` ES/EN |
| `scripts/validate-i18n.mjs` | Paridad slugs |
