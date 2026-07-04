# Dirección visual — Portfolio Lucio Monsalvo

> Estado: **aprobado para implementación 3C** (propuesta base; referencias del usuario pendientes de reemplazar).

## Referencias (pendiente tu input)

Agregar 2–3 URLs o capturas cuando las tengas. Placeholders de inspiración:

| Referencia | Qué tomar |
| --- | --- |
| Portfolios cyber oscuros | Tipografía monospace en tags, fondo profundo, acentos neón contenidos |
| Dev portfolios minimal | Grid amplio, jerarquía clara, CTAs discretos |
| *(tu link)* | *(completar)* |

## Paleta

| Token | Dark (default) | Light |
| --- | --- | --- |
| `--color-bg` | `#08090c` | `#f4f4f5` |
| `--color-surface` | `#111318` | `#ffffff` |
| `--color-surface-elevated` | `#181b24` | `#fafafa` |
| `--color-border` | `#252a36` | `#e4e4e7` |
| `--color-text` | `#f4f4f5` | `#18181b` |
| `--color-muted` | `#94949e` | `#52525b` |
| `--color-accent` | `#34d399` (emerald) | `#059669` |
| `--color-accent-secondary` | `#22d3ee` (cyan) | `#0891b2` |
| `--color-cyber` | `#a78bfa` (violet, writeups) | `#7c3aed` |

## Tipografía

- **Sans:** system-ui stack (self-host opcional en Fase 5 para CSP)
- **Mono:** `ui-monospace` para badges, tags, detalles técnicos
- **Display:** tracking tight en H1, uppercase opcional en labels de sección

## Densidad y layout

- Max width contenido: `72rem` (6xl)
- Hero: asimétrico, gradiente sutil + grid decorativo
- Cards: borde + hover glow accent
- Mobile: nav hamburger; minimi oculta en `< md`

## minimi

- Posición: fixed bottom-right
- Estilo: burbuja glass + SVG con acento emerald
- Animación: float suave; rotación frases 8s
- Dismiss persistente (`localStorage`)

## Dark / light

- Default: **dark** (on-brand ciber)
- Toggle en header; respeta `prefers-color-scheme` en primera visita
- Contraste: focus ring accent 2px; WCAG AA en texto body

## Componentes clave

| Componente | Tratamiento |
| --- | --- |
| Header | Sticky glass, logo nombre, nav underline activo |
| Hero | Gradiente mesh, CTAs primary/ghost |
| ProjectCard | Category chip color-coded, mono tags |
| Links | Botones full-width, featured con gradiente |
| Form | Inputs con borde sutil, focus accent |

## Go/No-Go 3C

- [x] Paleta definida
- [x] Tratamiento minimi definido
- [ ] Referencias personales del usuario (no bloquea v1 del rediseño)
