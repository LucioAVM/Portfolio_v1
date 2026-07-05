# Análisis de ingeniería inversa — stefanobartoletti.it

> **Fecha:** 2026-07-04 · **Fase:** análisis fresco (reemplaza a `stefano-bartoletti-audit.md`)
> **Fuentes:** sitio en vivo (inspección DOM + CDP) + 15 capturas del usuario + video de scroll
> **Referencia:** [stefanobartoletti.it](https://www.stefanobartoletti.it/)
> **Objetivo:** tomar la **composición y el lenguaje visual** para el portfolio de Lucio (Astro + Tailwind + anime.js), sin copiar stack ni contenido.

---

## 1. Concepto rector: metáfora de "sistema operativo / app de escritorio"

El sitio entero simula un **escritorio de un SO**. No es solo un marco decorativo: es la idea central que organiza todo.

### 1.1 Shell exterior (la "ventana de la app")

```
+--[ barra de título:  stefano <bartoletti>            – □ × ]--+
| S |                                                            |
| ▭ |                     ÁREA DE CONTENIDO                       |
| ▭ |                  (hero / ventanas internas)                 |
| ⚡|                                                            |
| ✉ |                                                            |
|---+------------------------------------------------------------|
| 🔍| Based in Bologna · Local time 03:25   [social] let's-get-in-touch → |
+--------------------------------------------------------------+
```

- **Barra de título superior:** monograma `S` + texto `stefano <bartoletti>` (el `<…>` en color de acento). Controles ventana a la derecha (minimizar / maximizar / cerrar) — decorativos pero animados.
- **Sidebar / dock izquierdo:** logo arriba + 5 iconos de sección (home, about, work, experiments, contact) + buscador (`🔍`) abajo. El icono activo se tiñe con el acento de la sección.
- **Barra de estado inferior:** ubicación (`Based in Bologna`) · reloj local en vivo (`Local time HH:MM`) · fila de iconos sociales · CTA `let's-get-in-touch →` · breadcrumb (`home › work`).
- **Barra de progreso de scroll** vertical fina en el borde derecho, teñida con el acento.

### 1.2 Ventanas internas (lo que faltaba en la auditoría anterior)

El contenido **no** son secciones planas: son **ventanas flotantes tipo app**, cada una con su mini barra de título y controles `– □ ×`. Observadas:

| Ventana | Contenido | Dónde |
| --- | --- | --- |
| `about-me` | Editor de código: líneas numeradas (1,2,3…), keywords resaltadas en varios colores | Home, About |
| `where-i-work` | Ubicación + disponibilidad remota | Home, About |
| `me-online` | Lista de redes numerada (linkedin, instagram, x, bluesky, github) | Home, About |
| `hobbies` | Lista numerada (Swimming, Reading, Hiking, Gaming) | Home |
| `collaborations` | Con quién le gusta colaborar | About |
| `portrait` | Foto sobre fondo **croma verde** | Home, About |
| `techs` | Grid de logos (Nuxt, Vue, Tailwind, GSAP, JS, CSS, Storyblok, Netlify) | About |
| `write-me` | Formulario de contacto (ver §4.5) | Contact |

Las ventanas se disponen **superpuestas y descentradas**, como escritorio real (unas tapan a otras parcialmente).

---

## 2. Firma visual: **color de acento por sección**

Cada sección tiene su propio acento que tiñe **todo**: el `<…>` del título, los símbolos 3D, el glow radial de fondo, la palabra-acento del H1, el icono activo del sidebar y la barra de scroll.

| Sección | Supertítulo | H1 (palabra acento en **negrita**) | Acento (hex exacto) |
| --- | --- | --- | --- |
| Home | HOME | Hi, I'm Stefano, a **creative** developer | `#8fff86` verde lima |
| About | ABOUT | Let's get to know **each other** | `#4d81ee` azul |
| Work | WORK | A collection of my best **projects** | `#e14f62` carmín |
| Experiments | EXPERIMENTS | Beyond projects: some **experiments** | `#e1b84f` oro |
| Contact | CONTACT | Do you want to talk about a **project**? | `#91d1f8` cian |

**Neutros compartidos:**

| Token | Valor |
| --- | --- |
| Fondo | `#0f0f0f` |
| Texto cuerpo (muted) | `#9d9d9d` |
| Texto títulos | blanco |
| Variable CSS base | `--color-primary: #8fff86` |

---

## 3. Tipografía y elementos gráficos

- **Titulares (H1/H2):** `PP Object Sans` — sans geométrica, weight 400, H1 ≈ 72px. *(Fuente de pago; requiere alternativa libre.)*
- **Cuerpo / mono / labels:** `PP Neue Machina Inktrap` — mono-display con detalle "inktrap". *(Fuente de pago; requiere alternativa libre.)*
- **Símbolos 3D flotantes (WebGL):** giran en parallax y **cambian por sección**: Home `{ # >` · About `< [ ]` · Work `[ * ( $` · Experiments `( % & { }` · Contact `& # @ ?`. Estética de "3D extruido gris oscuro".
- **Watermark tipográfico gigante** de fondo, muy tenue (`develop`, `stefano`, `love`…), detrás del hero.
- **Glow radial** de fondo centrado, del color de la sección.

---

## 4. Estructura por página

Todas las páginas son navegación real (URL propia `/about/`, `/work/`…) con **transición** (monograma `S` gigante animado en el centro) y **preloader** inicial (barra `stefano <bartoletti>` + spinner sobre glow radial). El scroll está **virtualizado** (smooth scroll JS; el wheel nativo no mueve el documento).

### 4.1 Home
1. **Hero:** supertitle `HOME` + H1 split + subtítulo + símbolos 3D + watermark.
2. **About teaser:** H2 `Your creative web developer` → cluster de ventanas (`about-me`, `where-i-work`, `me-online`, `hobbies`, `portrait`) + botón `about-me →`.
3. **Projects highlight:** H2 → cards `01 / 02 / 03` (nombre + año a la derecha + tags de stack) + botón `all-projects →`.
4. **Testimonios:** carrusel `Nice things people say about my work` (3 slides).
5. **Footer app.**

### 4.2 About
Hero `Let's get to know each other` → ventanas (`about-me` extendido, `where-i-work`, `me-online`, `collaborations`, `portrait`) → H2 `Some of the techs I like to work with` + ventana `techs` (grid de logos) → testimonios → footer.

### 4.3 Work
Hero `A collection of my best projects` → **lista completa** de proyectos `01`–`07` (número, nombre, año, tags de stack; hover con acento) → testimonios → bloque `collaboration: Let's work together on your next project` → footer.

### 4.4 Experiments
Hero `Beyond projects: some experiments` → lista open-source como **acordeones** (`01 Nuxt Social Share`, `02 ESLint Config`) con descripción y acciones (GitHub Repo, Documentation) → testimonios → footer.

### 4.5 Contact
Hero `Do you want to talk about a project?` → ventana `write-me` con formulario: `full-name*`, `company`, `website`, `email*`, `your-message*`, checkbox de Privacy Policy, botón `send-it-over! ✉` → footer.

---

## 5. Motion (comportamiento observado)

| Elemento | Trigger | Efecto |
| --- | --- | --- |
| Preloader | load | barra + spinner, luego revela shell |
| Transición de página | click nav | monograma `S` gigante entra/sale |
| H1 | load | split por palabras, stagger entrada |
| Supertitle / subtitle | load | fade + slide |
| Símbolos 3D | load + mouse | parallax + rotación continua |
| Watermark | load | deriva horizontal lenta |
| Reloj inferior | runtime | actualiza `Local time` en vivo |
| Ventanas | scroll in | entran con stagger/slide |
| Cards proyecto | scroll in | reveal + hover acento |
| Barra scroll | scroll | fill proporcional teñido |

Stack de motion original: **GSAP + ScrollTrigger + Three.js** (Nuxt/Vue). No se replica 1:1.

---

## 6. Traducción al stack de Lucio

| Referencia | Adaptación Lucio |
| --- | --- |
| Nuxt / Vue | Astro 7 (islas) |
| GSAP + ScrollTrigger | anime.js v4 + IntersectionObserver |
| Three.js (símbolos WebGL) | SVG/CSS 3D con parallax de mouse (sin WebGL) |
| Smooth scroll virtualizado | scroll nativo (mejor a11y + CSP) |
| Fuentes PP (pago) | alternativas libres self-host (CSP grado A) |
| Ventanas draggables JS | **decisión abierta** (ver plan): ventanas estáticas estilizadas vs draggables |
| 5 secciones | 8 secciones de Lucio (Inicio, Proyectos, Ciberseguridad, Impresión 3D, Sobre mí, Contacto, Links, CV) |
| Testimonios | omitir en v1 (sin contenido real) |
| Contenido dev genérico | identidad Lucio: dev + ciberseguridad + impresión 3D |

---

## 7. Qué tomamos / qué NO

**Tomamos:** metáfora de app de escritorio (shell + barra de título + dock + status bar), color de acento por sección, hero con palabra-acento + símbolos + watermark, ventanas de contenido con barra de título, projects numerados, barra de progreso de scroll, reloj en vivo.

**Adaptamos:** paleta a la identidad ciber de Lucio, copy ES/EN propio, símbolos sin WebGL, fuentes libres.

**No copiamos:** Three.js full-screen, GSAP, fuentes PP de pago, testimonios falsos, smooth-scroll virtualizado, sidebar completa forzada en mobile.

---

## 8. Estado de implementación

### Fase 0 — Fundaciones + shell global ✅ (a verificar en build)

- `src/lib/sections.ts`: mapa de acento por sección + dock + iconos + `sectionFromPath`.
- `src/components/layout/TitleBar.astro`, `SidebarNav.astro`, `StatusBar.astro`.
- `src/layouts/BaseLayout.astro`: ventana fija (grid `title / dock+main / status`), acento por sección vía `--color-accent` inline, scroll interno (`#app-scroll`).
- `src/lib/motion/clock.ts`: reloj local en vivo.
- `global.css`: estilos del shell + fuentes libres self-host (Space Grotesk / Space Mono).

### Fase 1 — Hero ✅ (a verificar en build)

- `Hero.astro` full-bleed (sin card), palabra-acento, símbolos + watermark, hooks de motion intactos.

### Pendiente

- **Fuentes:** colocar `.woff2` en `public/fonts/` (ver README de handoff). Sin ellos cae a system-ui.
- **Fase 2:** ventanas de contenido (`AppWindow` + about-me editor, portrait, techs).
- **Fase 3:** proyectos numerados 01/02/03.
- **Fase 4:** formulario en ventana `write-me`.
- **Fase 5:** motion de ventanas + transición de página.
- Verificar `Header.astro` / `Footer.astro` (quedaron sin uso; borrar en limpieza posterior).
