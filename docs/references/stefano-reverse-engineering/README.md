# Ingeniería inversa — stefanobartoletti.it

> **Fecha de captura:** 2026-07-07  
> **URL:** https://www.stefanobartoletti.it/  
> **Objetivo:** documentar con precisión técnica cómo está construido el sitio de referencia para replicar composición, motion y material 3D en el portfolio de Lucio (Astro + anime.js, sin modificar código de producción hasta decisión explícita).

---

## Índice de documentación

| Archivo | Contenido |
| --- | --- |
| [STACK.md](./STACK.md) | Stack real (Nuxt, GSAP, Lenis, Tres/Three.js, Storyblok) |
| [SHELL.md](./SHELL.md) | Metáfora "app de escritorio", frame, navegación, scroll |
| [HERO-3D.md](./HERO-3D.md) | Símbolos WebGL: geometría, material, luces, scroll, mouse |
| [MOTION.md](./MOTION.md) | Hooks GSAP, Lenis, ScrollTrigger, watermark marquee |
| [CMS-DATA.md](./CMS-DATA.md) | Datos Storyblok por página (símbolos, temas, textos) |
| [COMPARISON-LUCIO.md](./COMPARISON-LUCIO.md) | Stefano vs implementación actual del portfolio |
| [REPLICATION-PLAN.md](./REPLICATION-PLAN.md) | Plan de réplica por fases y decisiones pendientes |

---

## Estructura de esta carpeta

```
stefano-reverse-engineering/
├── README.md                 ← este archivo
├── STACK.md … REPLICATION-PLAN.md
├── raw/                      ← HTML prerenderizado + payloads Nuxt
│   ├── home.html, about.html, work.html, contact.html, experiments.html
│   ├── home-payload.json, *-payload.json
├── assets-manifest/          ← bundles JS/CSS descargados + extracciones
│   ├── entry.C3FUNIhI.css
│   ├── C3JuQ95o.js             (Three.js + Tres + DecorationFloatingLetters)
│   ├── CveH2aTz.js             (Nuxt app shell + GSAP + Lenis)
│   ├── floating-letters-component.txt
│   ├── hero-dom.txt, home-hero-cms.json, all-pages-hero.json
│   └── …
└── scripts/                  ← utilidades de extracción (re-ejecutables)
    ├── fetch-payload.mjs
    ├── extract-floating.mjs
    ├── extract-three.mjs
    └── …
```

**Nota:** esta carpeta está en `.gitignore` (bundles pesados, HTML de terceros). Solo la documentación `.md` en la raíz debería versionarse si se desea compartir el análisis sin los binarios.

---

## Hallazgos críticos (resumen ejecutivo)

### Lo que Stefano usa de verdad

| Capa | Tecnología |
| --- | --- |
| Framework | **Nuxt 3** + Vue 3 + Vite |
| CMS | **Storyblok** (contenido, temas, símbolos por página) |
| Motion | **GSAP** + **ScrollTrigger** + **SplitText** (Club) |
| Scroll | **Lenis** virtualizado en `#frame-content` |
| 3D hero | **Tres** (Vue Three.js) + **TextGeometry** con bisel |
| Estilos | **Tailwind CSS 4** + tokens `data-theme` |
| Hosting | Netlify (inferido por tech stack en About) |

### Lo que NO es CSS puro

Los símbolos `{ > # /` del hero **no** son capas CSS ni `text-stroke`. Son meshes **MeshPhysicalMaterial** extruidos con bisel, renderizados en canvas WebGL transparente (`clear-alpha: 0`) superpuesto al hero con `position: sticky`.

### Diferencia principal vs portfolio Lucio (jul 2026)

| Aspecto | Stefano | Lucio actual |
| --- | --- | --- |
| Símbolos 3D | WebGL TextGeometry + bisel real | Pseudo-3D CSS + `hero-symbol-light.ts` |
| Motion lib | GSAP + Lenis | anime.js + scroll nativo |
| Watermark | Marquee horizontal infinito (2 spans) | Palabra estática centrada |
| Scroll hero | Blur canvas + rotación π/2 + zoom cámara | Scale + dispersión radial CSS |

**Conclusión:** para réplica visual ≥95% de los símbolos, la vía realista es **WebGL** (Three.js puro en Astro, sin Vue/Tres), reutilizando el contrato `--sym-*` de `hero-symbol-light.ts` como API de luces.

---

## Cómo re-ejecutar la investigación

```bash
# Desde la raíz del repo
node docs/references/stefano-reverse-engineering/scripts/fetch-payload.mjs
node docs/references/stefano-reverse-engineering/scripts/fetch-all-payloads.mjs
node docs/references/stefano-reverse-engineering/scripts/extract-floating.mjs
node docs/references/stefano-reverse-engineering/scripts/resolve-hero.mjs
```

Para HTML fresco, descargar manualmente o con `fetch` las rutas `/`, `/about`, `/work`, `/contact` y guardar en `raw/`.

---

## Relación con otros docs del repo

- [stefano-analisis-completo.md](../stefano-analisis-completo.md) — auditoría visual previa (jul 2026); algunos símbolos CMS difieren de la captura actual
- [stefano-refactor-brief.md](../stefano-refactor-brief.md) — spec de implementación para Lucio
- [PRO-REFACTOR-INSTRUCTIONS.md](../PRO-REFACTOR-INSTRUCTIONS.md) — checklist activo del refactor

---

## Pendientes de captura manual

- [ ] Screenshots por sección a distintos % de scroll (0%, 25%, 50%, 75%, 100% del hero)
- [ ] Grabación de video comparativa scroll hero (símbolos + blur)
- [ ] Descarga de `/fonts/OS_subset.json` (fuente 3D de Stefano)
- [ ] Inspección DevTools → Performance del canvas durante scroll
- [ ] Página Experiments (`darkYellow`) — payload completo si se reactiva en nav
