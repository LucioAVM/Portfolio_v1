# Comparativa: Stefano vs Portfolio Lucio

> Estado Lucio: jul 2026, rama refactor home en curso.  
> **No se modificó código** en esta investigación.

---

## 1. Stack

| Capa | Stefano | Lucio |
| --- | --- | --- |
| Framework | Nuxt 3 + Vue | Astro 7 |
| Estilos | Tailwind 4 | Tailwind 4 |
| Motion | GSAP + Lenis | anime.js |
| 3D | Tres + Three.js | CSS pseudo-3D |
| CMS | Storyblok | Markdown / i18n JSON |
| CSP | No auditado | **Grado A** (restricción fuerte) |

---

## 2. Shell / layout

| Feature | Stefano | Lucio | Gap |
| --- | --- | --- | --- |
| Title bar | ✅ FrameTop | ✅ `TitleBar.astro` | Menor |
| Status bar | ✅ FrameBottom | ✅ `StatusBar.astro` | Menor |
| Sidebar nav | ✅ 5 items | ✅ Implementado | Achievements N/A |
| Scroll container | `#frame-content` | `#app-scroll` | Equivalente |
| Scroll progress | ✅ Barra derecha | Parcial | Afinar |
| Ventanas flotantes | ✅ Storyblok panels | 🟡 `DraggableWindow` / `Panel` | En progreso |
| Page transition cover | ✅ | ❌ | Opcional |

---

## 3. Hero — fondo

| Feature | Stefano | Lucio | Gap |
| --- | --- | --- | --- |
| Color fondo | `#0f0f0f` | `#090a09` (`--color-bg`) | Muy cercano |
| Glows | 2× `spotlight-box` blur 100–200px | 2 glows `AppBackground` | Cercano; revisar opacidad |
| Glow scroll | Animado con scroll | ✅ `bg-glows.ts` | OK |
| Watermark | Marquee horizontal infinito | Palabra estática `.hero-watermark` | **Alto** |
| Sticky layers | `height-inner-frame` | Parcial en hero | **Medio** |

---

## 4. Hero — símbolos 3D

| Feature | Stefano | Lucio | Gap |
| --- | --- | --- | --- |
| Tecnología | WebGL TextGeometry | CSS capas `.hero-symbol-*` | **Crítico** |
| Material | MeshPhysical `#444` | `#111` face + `::before/::after` | **Crítico** |
| Bisel | Geometría real bevel 0.06/0.1 | Simulado con offsets | **Crítico** |
| Luces | Directional + Ambient 3D | `hero-symbol-light.ts` → CSS vars | Aproximación |
| Mouse parallax | GSAP 5s, grupo rotación | ❌ o mínimo | **Alto** |
| Scroll | Cámara + rot π/2 + blur canvas | scale 4.5× + dispersión vw/vh | **Alto** |
| Símbolos home | `{ > # /` | Verificar en `Hero.astro` | Verificar chars |
| Cantidad | 4 | 4 | OK |

### Archivos Lucio relevantes

| Archivo | Rol |
| --- | --- |
| `src/components/Hero.astro` | Markup símbolos + watermark |
| `src/styles/global.css` | Material CSS `.hero-symbol-3d` |
| `src/lib/motion/hero-scroll.ts` | Dispersión + fade texto |
| `src/lib/motion/hero-symbol-light.ts` | API luces (reutilizable en WebGL) |

---

## 5. Hero — tipografía

| Feature | Stefano | Lucio |
| --- | --- | --- |
| H1 size | ~72px, PP Object Sans | Space Grotesk, compact lh 0.92 |
| Supertitle | `text-xs uppercase tracking-wider` | Similar |
| Acento inline | `text-primary` span | `accent` prop |
| Scroll line | `scroll-line` + `gsap="streak"` | Por verificar |

---

## 6. Motion — secciones bajo hero

| Feature | Stefano | Lucio |
| --- | --- | --- |
| Reveal palabras | SplitText + scrub | `scroll-reveal.ts` |
| Slide in panels | GSAP batch | Parcial |
| Reduced motion | Touch off | ✅ `prefers-reduced-motion` |

---

## 7. Puntuación de fidelidad (estimada)

| Área | % | Notas |
| --- | --- | --- |
| Shell / layout | ~80% | Ventanas en progreso |
| Glows / fondo | ~85% | Ajuste fino |
| Watermark | ~40% | Falta marquee |
| Símbolos 3D | ~85% CSS / necesita WebGL para 95%+ | Principal blocker visual |
| Hero scroll | ~70% | Falta blur + rotación 3D |
| Motion secciones | ~60% | Falta SplitText-level polish |

---

## 8. Decisiones técnicas pendientes

1. **¿WebGL para símbolos?** — Recomendado para réplica exacta (ver REPLICATION-PLAN.md)
2. **¿Marquee watermark?** — Bajo esfuerzo, alto impacto visual
3. **¿Mantener anime.js?** — Sí (restricción proyecto); mapear timelines GSAP manualmente
4. **¿Three.js en bundle?** — ~150KB gzipped; evaluar lazy load en hero only
