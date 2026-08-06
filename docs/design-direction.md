# Dirección visual — Portfolio Lucio Monsalbo

> Estado: **aprobado para implementación 3C** (propuesta base; referencias del usuario pendientes de reemplazar).

## Referencias

| Referencia | Qué tomamos | Qué no |
| --- | --- | --- |
| [stefanobartoletti.it](https://www.stefanobartoletti.it/) | Hero split text, watermark, símbolos dev, scroll reveal, app-shell sutil, barra progreso | GSAP, Three.js, sidebar completa, fuentes PP |
| Portfolios cyber oscuros | Tags mono, fondo profundo, acentos neón contenidos | — |
| Dev portfolios minimal | Grid amplio, jerarquía clara | — |

Auditoría detallada: [`docs/references/stefano-bartoletti-audit.md`](references/stefano-bartoletti-audit.md)

**Refactor composicional (pendiente Pro):** [`docs/references/PRO-REFACTOR-INSTRUCTIONS.md`](references/PRO-REFACTOR-INSTRUCTIONS.md) · [`stefano-refactor-brief.md`](references/stefano-refactor-brief.md)

## Paleta

| Token | Dark (default) | Light |
| --- | --- | --- |
| `--color-bg` | `#08090c` | `#f4f4f5` |
| `--color-surface` | `#111318` | `#ffffff` |
| `--color-surface-elevated` | `#181b24` | `#fafafa` |
| `--color-border` | `#252a36` | `#e4e4e7` |
| `--color-text` | `#f4f4f5` | `#18181b` |
| `--color-muted` | `#94949e` | `#52525b` |
| `--color-accent` | `#8fff86` (lima home; otras secciones varían) | `#059669` |
| `--color-accent-secondary` | `#22d3ee` (cyan) | `#0891b2` |
| `--color-cyber` | `#a78bfa` (violet, writeups) | `#7c3aed` |

## Tipografía

- **Sans:** system-ui stack (self-host opcional en Fase 5 para CSP)
- **Mono:** `ui-monospace` para badges, tags, detalles técnicos
- **Display:** tracking tight en H1, uppercase opcional en labels de sección

## Densidad y layout

- Max width contenido: `72rem` (6xl)
- **App-shell:** marco viewport (`app-shell` + borde interior), barra progreso scroll derecha
- Hero: cinematográfico centrado — split text, watermark, símbolos `{#>}` SVG/CSS parallax, spotlight
- Cards: borde + hover glow accent; entrada con scroll reveal
- Mobile: nav hamburger; minimi oculta en `< md`

## minimi

- Posición: fixed bottom-right
- Identidad visual v3: **chibi pulido** — cabeza+capucha en un solo path, torso pill, brazos unidos al hombro; cara simétrica con cursor cyan mínimo junto al ojo derecho
- Estilo: burbuja glass con esquina terminal; glow alineado al hero (emerald suave, sin cyan dual fuerte)
- Animación: sistema modular (`src/lib/minimi/`) — idle float + head tilt sutil + breathe, parpadeo simétrico + blink cursor accent, saludo al expandir; solo `transform`/`opacity`
- Minimizar persistente (`localStorage.minimi-minimized`); migración desde `minimi-dismissed`
- Pausa animaciones si minimizado, pestaña oculta o `prefers-reduced-motion`

## Dark / light

- Default: **dark** (on-brand ciber)
- Toggle en header; respeta `prefers-color-scheme` en primera visita
- Contraste: focus ring accent 2px; WCAG AA en texto body

## Componentes clave

| Componente | Tratamiento |
| --- | --- |
| Header | Sticky glass, chrome dots decorativos, nav activo accent |
| Hero | Split text anime.js, watermark, parallax símbolos, CTAs stagger |
| ProjectCard | Category chip color-coded, mono tags |
| Links | Botones full-width, featured con gradiente |
| Form | Inputs con borde sutil, focus accent |

## Go/No-Go 3C

- [x] Paleta definida
- [x] Tratamiento minimi definido
- [x] Referencia Stefano documentada en `docs/references/`
- [ ] Capturas personales del usuario en `docs/references/assets/stefano/` (opcional)
