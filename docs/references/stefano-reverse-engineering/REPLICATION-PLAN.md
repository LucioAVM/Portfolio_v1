# Plan de réplica — stefanobartoletti.it → Portfolio Lucio

> Documento de trabajo para la fase de implementación. **No ejecutar sin aprobación explícita.**

---

## Objetivo

Alcanzar **≥95% fidelidad visual** en hero + shell, respetando:

- Astro 7 + anime.js (no GSAP)
- CSP grado A
- Bilingüe ES/EN
- Minimi (mascota) se mantiene
- Sin copiar contenido ni fuentes comerciales de Stefano

---

## Fase 0 — Preparación (COMPLETADA en esta investigación)

- [x] Carpeta `docs/references/stefano-reverse-engineering/`
- [x] HTML + payloads + bundles descargados
- [x] Componente `DecorationFloatingLetters` descompilado
- [x] Documentación STACK, HERO-3D, MOTION, SHELL, CMS
- [x] `.gitignore` para assets pesados
- [ ] Screenshots scroll manual
- [ ] Descargar `OS_subset.json` o generar typeface propio

---

## Fase 1 — Quick wins (sin WebGL)

**Esfuerzo:** 1–2 días · **Impacto visual:** medio

| Tarea | Archivos | Spec Stefano |
| --- | --- | --- |
| Watermark marquee | `Hero.astro`, nuevo `watermark-marquee.ts` | 2 spans, `xPercent -100`, duration `width/30` |
| Ajustar glows | `global.css`, `AppBackground.astro` | blur 100–200px, opacity 50%×50% |
| Símbolos CMS correctos | `index.astro`, i18n | `{ > # /` en home |
| `height-inner-frame` sticky | `Hero.astro`, `global.css` | watermark + símbolos sticky |
| Scroll line streak | `Hero.astro`, motion | `.scroll-line` bottom-6 h-24 |

---

## Fase 2 — Símbolos CSS mejorados (opcional intermedia)

**Esfuerzo:** 2–3 días · **Impacto:** ~85–90% sin WebGL

Solo si se pospone Three.js:

1. Eliminar cualquier stroke blanco / `-webkit-text-stroke`
2. Alinear material a `#444` base con variación por luz
3. Key light desde `[-2,-2,6]` equivalente → sup-izq-frente (no sup-der)
4. Mouse parallax suave (5s ease) en `hero-scroll.ts`
5. Añadir `filter: blur()` progresivo en símbolos al scroll (imitar canvas)

**Límite:** sin bisel real, el rim nunca será idéntico.

---

## Fase 3 — WebGL símbolos (réplica exacta)

**Esfuerzo:** 4–6 días · **Impacto:** 95%+

### Arquitectura propuesta

```
Hero.astro
├── .hero-watermark (marquee)
├── <canvas id="hero-symbols-canvas">  ← sticky, clear alpha 0
└── .hero-content (texto)

src/lib/webgl/
├── hero-scene.ts       # init Three scene
├── text-symbol.ts      # TextGeometry + MeshPhysicalMaterial
├── hero-camera.ts      # camera t: 1.25 → -0.2
└── hero-scroll-sync.ts # bridge hero-scroll progress → scene

Reutilizar:
└── hero-symbol-light.ts  # mapear SymbolLightState → light intensities
```

### Parámetros exactos (copiar de HERO-3D.md)

```ts
const TEXT_PARAMS = {
  height: 0.05,
  bevelEnabled: true,
  bevelSize: 0.06,
  bevelThickness: 0.1,
  curveSegments: 12,
  bevelSegments: 12,
};

const MATERIAL = {
  color: 0x444444,
  roughness: 0.5,
  metalness: 0.25,
  ior: 2,
};

const LIGHTS = [
  { type: 'directional', color: 0xffffff, intensity: 1, position: [-2, -2, 6] },
  { type: 'ambient', intensity: 0.5 },
];
```

### Scroll sync

| progress 0→1 | Acción |
| --- | --- |
| camera factor | 1.25 → -0.2 |
| rotation Y | 0 → π/2 |
| canvas filter | blur 0 → 10px |
| dispersión | Mantener lógica `CORNER_VECTORS` actual |

### CSP checklist

- [ ] Three importado como ES module (Vite)
- [ ] Sin `new Function` / eval
- [ ] Font JSON desde `/public/fonts/` (self-hosted)
- [ ] `script-src 'self'` compatible

### Bundle

- Lazy: `import('./hero-scene')` solo en home
- `client:visible` o `client:idle` en Astro
- Dispose geometry/material on navigate away

---

## Fase 4 — Shell y ventanas

| Tarea | Referencia |
| --- | --- |
| Paneles posicionados % | `section-info-panels` CMS |
| Draggable windows | `DraggableWindow.astro` |
| About code editor window | `AboutSection.astro` |
| Transición página | `FrameCover` opcional |

---

## Fase 5 — Motion secciones

| Stefano hook | Implementación anime.js |
| --- | --- |
| reveal words | Split manual + stagger opacity |
| slideIn | scale 0.95 + opacity |
| fadeIn | scale 0.75 + Expo ease |
| btn hover | char translateY loop |

Archivo existente: `scroll-reveal.ts`, `scroll-focus.ts`, `windows.ts`

---

## Estrategias evaluadas

| Estrategia | Pros | Contras | Veredicto |
| --- | --- | --- | --- |
| A. CSS puro mejorado | Sin deps, CSP fácil | Techo ~85% | Intermedia |
| B. WebGL Three.js | Réplica exacta | +150KB, complejidad | **Recomendada** |
| C. Spline / R3F | Autoría visual | React, CSP, stack | Descartada |
| D. Copiar bundle Stefano | Rápido | Legal, Nuxt, GSAP | Descartada |
| E. Pre-render PNG/WebM | Ligero | Sin parallax 3D real | Descartada |

---

## Orden de implementación recomendado

```
Fase 1 (marquee + glows + sticky)
    ↓
Decisión usuario: ¿WebGL?
    ↓ sí                    ↓ no
Fase 3 WebGL              Fase 2 CSS max
    ↓                         ↓
Fase 4 shell                Fase 4 shell
    ↓                         ↓
Fase 5 motion               Fase 5 motion
```

---

## Criterios de aceptación (QA)

### Hero reposo
- [ ] 4 símbolos visibles con bisel legible
- [ ] Rim en borde superior-izquierdo (luz direccional)
- [ ] Watermark marquee lento detrás
- [ ] Glows verdes (home) sin banding

### Hero scroll 0→100%
- [ ] Símbolos crecen y dispersan
- [ ] Blur progresivo al salir
- [ ] Texto hero fade escalonado
- [ ] Sin jank > 16ms/frame en desktop

### A11y
- [ ] `prefers-reduced-motion`: escena estática
- [ ] Símbolos `aria-hidden`
- [ ] CSP sin regresiones

### Build
- [ ] `npm run build` OK
- [ ] `npm run validate:i18n` OK

---

## Referencias rápidas

- Parámetros 3D: [HERO-3D.md](./HERO-3D.md)
- Datos CMS: [CMS-DATA.md](./CMS-DATA.md)
- Motion: [MOTION.md](./MOTION.md)
- Código fuente minificado: `assets-manifest/floating-letters-component.txt`
