# Stack técnico — stefanobartoletti.it

> Evidencia: bundles en `assets-manifest/`, HTML en `raw/`, payloads Nuxt resueltos.

---

## 1. Runtime y build

| Pieza | Evidencia |
| --- | --- |
| **Nuxt 3** | `__NUXT_DATA__`, chunks `/_nuxt/*.js`, `nuxt-root` en `CveH2aTz.js` |
| **Vue 3** | Composition API (`setup`, `ref`, `computed`, `onMounted`) |
| **Vite** | `import.meta.url`, code-splitting por ruta |
| **Tailwind CSS 4** | `entry.C3FUNIhI.css` con `@layer properties` |
| **TypeScript** | Código compilado; fuentes no expuestas |

---

## 2. CMS y datos

| Pieza | Detalle |
| --- | --- |
| **Storyblok** | Plugin `useStoryblokApi`, directiva `v-editable`, componentes `StoryblokComponent` |
| **Contenido** | Páginas: `home`, `about`, `work`, `contact`; secciones tipadas (`section-hero`, `section-info-panels`, etc.) |
| **Temas** | Campo `theme` en story + `data-theme` en `<html>` |
| **Símbolos 3D** | Campo `floating_chars: string[]` (4 caracteres por página) |
| **Watermark** | Campo `scrolling_text: string` (una palabra) |

Ver [CMS-DATA.md](./CMS-DATA.md) para valores exactos por ruta.

---

## 3. Animación y scroll

| Librería | Uso |
| --- | --- |
| **GSAP** | Timeline principal; hooks vía atributos `gsap="…"` |
| **ScrollTrigger** | Scroller custom `#frame-content`; `scrub`, `batch`, `start/end` por sección |
| **SplitText** | Reveal de palabras (`reveal`), botones (`btn-label` chars) |
| **Lenis** | Instancia en Pinia store (`lenisInstance`); `lerp: 0.05` en `scrollTo`; progreso expuesto como `scrollProgress` |

### Patrón de integración Lenis ↔ ScrollTrigger

```js
// Fragmento reconstruido desde CveH2aTz.js (~offset 200467)
// - Lenis escucha scroll en contenedor virtual
// - scrollProgress = lenis.progress * 100
// - ScrollTrigger.scroller = document.querySelector("#frame-content")
// - Tras resize: lenisInstance.resize() + ScrollTrigger.refresh(true) (DSBRQsfq.js, delay 501ms)
```

**Importante:** el scroll **no** es `window`; es el div `#frame-content` dentro del shell.

---

## 4. 3D (hero)

| Librería | Uso |
| --- | --- |
| **Three.js** | Incluido en chunk `C3JuQ95o.js` (~850KB) |
| **Tres** | Wrapper Vue: `TresCanvas`, `TresGroup`, `TresPerspectiveCamera`, luces, materiales |
| **TextGeometry** | Fuente JSON `/fonts/OS_subset.json` |
| **Componente** | `DecorationFloatingLetters` (export en `C3JuQ95o.js`) |

No hay React Three Fiber ni modelos GLTF para los símbolos: todo es texto extruido procedural.

---

## 5. Hooks GSAP (`gsap="…"`)

Lista completa detectada en home HTML:

```
spotlight-box, spotlight, scrolling-text, supertitle, title, subtitle, streak,
reveal-t, reveal, slideIn, avatar, btn-label, btn-icon, fadeIn
```

Chunks que implementan hooks (muestra):

| Hook | Archivo | Comportamiento |
| --- | --- | --- |
| `scrolling-text` | `CveH2aTz.js` (`yB`) | Marquee: `xPercent: -100`, `duration: offsetWidth/30`, `repeat: -1` |
| `reveal` / `reveal-t` | `BurCr-ge.js` | SplitText words, scrub 5, start 85%→75% |
| `slideIn` | `BmtHwUa-.js` | scale 0.95→1, batch onEnter/onLeaveBack |
| `fadeIn` | `DnLu7KYZ.js` | scale 0.75→1, Expo.easeOut |
| `avatar` | `Cssl27Mo.js` | bottom -1rem, scrub 10 |
| `btn-label` / `btn-icon` | `CveH2aTz.js` | SplitText chars + icon slide on hover |
| Floating letters scroll | `C3JuQ95o.js` | Ver [HERO-3D.md](./HERO-3D.md) |

Los hooks `supertitle`, `title`, `subtitle`, `streak`, `spotlight` están en el HTML pero su lógica puede estar inline en chunks de página no aislados por string literal (minificación).

---

## 6. Fuentes tipográficas

| Uso | Fuente (referencia visual / auditoría previa) |
| --- | --- |
| Display / H1 | PP Object Sans (comercial) |
| Mono / UI | PP Neue Machina Inktrap (comercial) |
| **3D symbols** | Subset custom `OS_subset.json` en `/fonts/` |

Para réplica en Lucio: Space Grotesk / Space Mono ya en uso son alternativas aceptables; para 3D exacto hace falta generar un `typeface.json` compatible con Three.js FontLoader.

---

## 7. Temas CSS (`data-theme`)

| Theme | Página | Acento (auditoría visual) |
| --- | --- | --- |
| `darkGreen` | Home | `#8fff86` |
| `darkBlue` | About | `#4d81ee` |
| `darkRed` | Work | `#e14f62` |
| `darkYellow` | Experiments | `#e1b84f` |
| `darkAqua` | Contact | `#91d1f8` |

Token Tailwind: `bg-primary`, `text-primary` mapeados al acento del tema activo.

---

## 8. Analytics y SEO

- Ahrefs analytics (`analytics.ahrefs.com`)
- OG images dinámicas `/_og/s/c_DefaultPage.png`
- `nuxt-seo-utils` plugin

---

## 9. Implicaciones para Lucio

| Stefano | Adaptación Lucio |
| --- | --- |
| GSAP + Lenis | **anime.js** + scroll en `#app-scroll` (ya existe) |
| Tres + Vue | **Three.js** directo en componente Astro client-side |
| Storyblok | Contenido estático / i18n JSON |
| SplitText | CSS stagger o anime.js split manual |
| Club GSAP plugins | No disponibles → reimplementar reveals con anime |

**Restricción del proyecto:** CSP grado A — cualquier WebGL debe cargarse sin `eval`, sin inline scripts no hasheados; usar módulos ES desde `src/lib/`.
