# Shell de aplicación — stefanobartoletti.it

> Metáfora "sistema operativo / ventana de app". Complementa [stefano-analisis-completo.md](../stefano-analisis-completo.md) §1.

---

## 1. Jerarquía DOM

```
html[data-theme="darkGreen"]
└── body
    └── #__nuxt
        └── .frame-outer / dashboard
            ├── FrameTop          → barra título + controles ventana
            ├── WidgetDashboard   → sidebar iconos
            ├── #frame-content    → SCROLL (Lenis)
            │   ├── capas sticky (watermark + 3D)
            │   └── page sections (Storyblok)
            ├── FrameBottom       → status bar
            └── FrameCover        → overlay transiciones
```

---

## 2. Barra superior (`FrameTop`)

| Elemento | Detalle |
| --- | --- |
| Monograma | `S` en cuadrado |
| Título | `stefano <bartoletti>` — parte entre `<>` usa `text-primary` |
| Controles | `– □ ×` decorativos (WidgetWindowIcons) |
| Ancho frame | `w-[500px]` en mobile frame → responsive full |

---

## 3. Sidebar (`WidgetDashboard`)

Navegación actual (payload site-config, dic 2025):

| Orden | Ruta | Label |
| --- | --- | --- |
| 1 | `/` | Home |
| 2 | `/about` | About |
| 3 | `/work` | Work |
| 4 | — | Achievements (nuevo vs auditoría jul 2026) |
| 5 | `/contact` | Contact |

**Nota:** Experiments ya no aparece en nav principal; la ruta `/experiments` puede existir pero no está en header_nav capturado.

Icono activo: tintado con `text-primary` del tema de la página destino.

---

## 4. Área de scroll (`#frame-content`)

| Propiedad | Valor |
| --- | --- |
| Rol | Único contenedor con overflow scroll |
| Integración | Lenis instance + ScrollTrigger scroller |
| Reset en navegación | `scrollTop = 0` al cambiar página (CveH2aTz.js) |
| Progreso | Expuesto a barra vertical derecha (`scrollProgress`) |

**Equivalente Lucio:** `#app-scroll` en `BaseLayout.astro`.

---

## 5. Barra inferior (`FrameBottom`)

| Elemento | Contenido |
| --- | --- |
| Ubicación | "Based in Bologna" (dinámico desde Storyblok `location_current`) |
| Reloj | "Local time HH:MM" en vivo |
| Sociales | Iconos linkedin, instagram, x, bluesky, github |
| CTA | `let's-get-in-touch →` |
| Breadcrumb | `home › section` (WidgetBreadcrumbs) |

---

## 6. Ventanas internas (`DecorationWindowFrame`)

Paneles flotantes con mini title bar:

```
┌ about-me ──────── – □ × ┐
│  contenido markdown     │
│  o imagen / social      │
└─────────────────────────┘
```

| Prop CMS | Uso |
| --- | --- |
| `window_title` | Texto barra ventana |
| `content_type` | `markdown` \| `image` \| `social` |
| `top`, `left`, `right`, `bottom` | Posición % en escritorio |
| `desktop_cols` | Ancho en grid 12 cols |
| `mobile_full_width` | Stack en móvil |

Posicionamiento: `xl:absolute` con CSS variables `--d-width` calculadas.

---

## 7. Temas por página

`data-theme` en `<html>` sincronizado con campo Storyblok `theme`:

| Página | theme |
| --- | --- |
| Home | darkGreen |
| About | darkBlue |
| Work | darkRed |
| Contact | darkAqua |

Cada tema redefine `--color-primary` y tokens Tailwind `primary`, `base-300`, etc.

---

## 8. Clase `height-inner-frame`

Usada en:
- Watermark sticky
- Canvas 3D sticky
- Contenedor texto hero

Patrón: **altura = viewport del frame**, `position: sticky; inset: 0` para que el fondo del hero no se mueva mientras el texto/sections scrollean.

---

## 9. Responsive

| Breakpoint | Comportamiento |
| --- | --- |
| Mobile | Frame simulado; ventanas stack vertical |
| `md` | Paneles empiezan a superponerse |
| `xl` | Layout escritorio completo; ventanas absolutas; símbolos 3D reposicionados (`lg` breakpoint en Three) |

---

## 10. Mapeo a componentes Lucio

| Stefano | Lucio |
| --- | --- |
| FrameTop | `TitleBar.astro` |
| FrameBottom | `StatusBar.astro` |
| WidgetDashboard | Nav en sidebar (layout) |
| #frame-content | `#app-scroll` |
| DecorationWindowFrame | `DraggableWindow.astro` + `Panel.astro` |
| height-inner-frame | Por implementar explícitamente en hero layers |
