# Instrucciones para refactor con modelo Pro

Documentación de soporte para el refactor composicional del home inspirado en [stefanobartoletti.it](https://www.stefanobartoletti.it/).

## Configuración Cursor

| Setting | Valor recomendado |
| --- | --- |
| **Modelo** | Opus 4.8 High |
| **Auto** | OFF |
| **Modo** | Agent |
| **Workspace** | Raíz del repo `Portfolio` |
| **MAX Mode** | Opcional |

## Lectura obligatoria (orden)

1. [stefano-refactor-brief.md](./stefano-refactor-brief.md)
2. [stefano-bartoletti-audit.md](./stefano-bartoletti-audit.md)
3. [../design-direction.md](../design-direction.md)
4. [../../public/_headers](../../public/_headers)
5. Capturas en `assets/stefano/` y `assets/lucio-before/` (si existen)

## Prompt maestro

Copiar en un chat nuevo (Agent + Opus 4.8 High, Auto OFF):

---

```markdown
# Refactor home — composición tipo stefanobartoletti.it

Lee OBLIGATORIAMENTE antes de editar:
- docs/references/stefano-refactor-brief.md
- docs/references/stefano-bartoletti-audit.md
- docs/design-direction.md
- public/_headers

Sigue la regla del proyecto `.cursor/rules/stefano-home-refactor.mdc`.

## Objetivo
Refactorizar HOME (`/` y `/en/`) para que la COMPOSICIÓN se parezca a https://www.stefanobartoletti.it/
Fase clon composicional; identidad Lucio viene después.

## Stack fijo
- Astro 7, Tailwind 4, anime.js v4
- NO GSAP, NO Three.js, NO nuevas dependencias
- CSP grado A intacto
- Bilingüe ES/EN (ui.es.json + ui.en.json)
- minimi: mantener; no rediseñar mascota

## Proceso
1. Escribir plan de composición (8 bullets) antes de editar
2. Crear AppShell + SidebarNav
3. Refactor Hero full-bleed (sin card rounded)
4. ProjectsHighlight 01/02/03
5. Footer app + CollaborationCta
6. Motion hero + scroll reveal
7. QA: npm run build && npm run validate:i18n

## Reglas
- Un solo marco principal (shell global, hero sin borde card)
- Priorizar composición sobre checklist de efectos
- Si un efecto no mejora jerarquía, eliminarlo
- NO commit, NO push
```

---

## Adjuntos recomendados al chat

| Carpeta | Contenido |
| --- | --- |
| `docs/references/assets/stefano/` | Capturas referencia (hero, projects, footer) |
| `docs/references/assets/lucio-before/` | Capturas sitio actual antes del refactor Pro |

## Checklist post-refactor

- [ ] Hero legible en 3 s (quién + qué)
- [ ] Sin doble borde card + shell
- [ ] Sidebar `lg+`, hamburger mobile
- [ ] Projects numerados
- [ ] minimi usable (no solapada)
- [ ] `prefers-reduced-motion` OK
- [ ] Documentar cambios en brief (sección "Estado post-refactor")

## Enlaces

- [Brief técnico](./stefano-refactor-brief.md)
- [Auditoría](./stefano-bartoletti-audit.md)
- [Dirección visual](../design-direction.md)
