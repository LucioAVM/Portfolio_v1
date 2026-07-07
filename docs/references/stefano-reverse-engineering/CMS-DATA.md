# Datos CMS (Storyblok) — por página

> Extraído de payloads Nuxt resueltos (`scripts/resolve-hero.mjs`, `fetch-all-payloads.mjs`).  
> Fecha captura: **2026-07-07**.

---

## 1. Campos globales del story (todas las páginas)

| Campo | Tipo | Uso |
| --- | --- | --- |
| `theme` | string | `data-theme` HTML + acento CSS |
| `floating_chars` | `string[4]` | Props `letters` → DecorationFloatingLetters |
| `scrolling_text` | string | Palabra watermark marquee |
| `sections` | blok[] | Contenido de la página |

---

## 2. Hero por ruta

### Home (`/`)

```json
{
  "theme": "darkGreen",
  "floating_chars": ["{", ">", "#", "/"],
  "scrolling_text": "developer",
  "hero": {
    "supertitle": "Home",
    "title": "Hi, I'm Stefano, a [creative] developer",
    "subtitle": "I bring value to web development projects by merging technical expertise with creativity and aesthetics."
  }
}
```

| Token | Valor |
| --- | --- |
| Acento | `#8fff86` (darkGreen) |
| Palabra acento en title | `creative` entre corchetes `[creative]` → `<span class="text-primary">` |

### About (`/about`)

```json
{
  "theme": "darkBlue",
  "floating_chars": ["<", "]", "!", "~"],
  "scrolling_text": "stefano"
}
```

Acento: `#4d81ee`

### Work (`/work`)

```json
{
  "theme": "darkRed",
  "floating_chars": ["[", ")", "$", "*"],
  "scrolling_text": "portfolio"
}
```

Acento: `#e14f62`

### Contact (`/contact`)

```json
{
  "theme": "darkAqua",
  "floating_chars": ["&", "?", "@", "#"],
  "scrolling_text": "hello"
}
```

Acento: `#91d1f8`

### Experiments (ruta `/experiments`, HTML capturado)

- `theme`: `darkGreen` en HTML capturado (puede variar)
- Símbolos según auditoría previa: `( % & { }` — **verificar** con payload actual si se reactiva

---

## 3. Correcciones vs auditoría jul 2026

| Página | Auditoría anterior | CMS actual (jul 2026) |
| --- | --- | --- |
| Home | `{ # >` (3 símbolos) | `{ > # /` (**4** símbolos, incluye `/`) |
| About | `< [ ]` | `< ] ! ~` |
| Work | `[ * ( $` | `[ ) $ *` |
| Contact | `& # @ ?` | `& ? @ #` (mismo set, distinto orden) |

---

## 4. Secciones Home (orden)

| # | component | title |
| --- | --- | --- |
| 1 | `section-hero` | Hi, I'm Stefano… |
| 2 | `section-info-panels` | Your [creative] web developer |
| 3 | `section-featured-projects` | Projects [highlight] |
| 4 | `section-testimonials` | — |
| 5 | `section-cta` | — |

### Paneles en `section-info-panels`

| window_title | content_type | Notas |
| --- | --- | --- |
| About Me | markdown | Keywords coloreadas `{.g}`, `{.b}`, `{.r}`, etc. |
| Where I work | markdown | Bologna + remote |
| Portrait | image | PNG sin fondo, Storyblok CDN |
| Hobbies | markdown | Swimming, Reading, Hiking, Gaming |
| Me Online | social | Links redes |

---

## 5. Formato de títulos con acento

Storyblok almacena: `Hi, I'm Stefano, a [creative] developer`

Render: regex reemplaza `[word]` → `<span class="text-primary transition-colors">word</span>`

**Lucio:** ya usa props `prefix`, `accent`, `suffix` en `Hero.astro` — equivalente.

---

## 6. Site config (global)

Desde payload inline `__NUXT_DATA__`:

| Campo | Valor |
| --- | --- |
| `site_title` | Stefano Bartoletti \| Freelance Web Developer |
| `default_theme` | darkGreen |
| `company_name` | Stefano Bartoletti |
| `email` / `phone` / `p_iva` | Datos contacto IT |
| `social` | linkedin, instagram, twitter/x, bluesky, github |
| `header_nav` | Home, About, Work, Achievements, Contact |

---

## 7. Uso en réplica Lucio

Propuesta de mapeo estático (sin Storyblok):

```ts
// src/data/hero.ts (futuro)
export const HERO_BY_PAGE = {
  home: {
    theme: 'green',
    symbols: ['{', '>', '#', '/'],
    watermark: 'developer',
  },
  // …
} as const;
```

i18n ES/EN: duplicar textos; símbolos pueden mantenerse iguales (son gráficos).
