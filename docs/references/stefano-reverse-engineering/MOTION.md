# Motion y scroll — stefanobartoletti.it

---

## 1. Modelo de scroll

```
┌─ frame-primary (shell) ─────────────────────────┐
│  frame-top (title bar)                          │
│  ┌─ sidebar ─┬─ #frame-content (Lenis) ───────┐ │
│  │           │  ┌─ sticky layers ─────────────┐ │ │
│  │           │  │ watermark (marquee)       │ │ │
│  │           │  │ canvas 3D (sticky)        │ │ │
│  │           │  └───────────────────────────┘ │ │
│  │           │  section hero (texto)          │ │
│  │           │  section panels…               │ │
│  │           │  … más secciones …             │ │
│  └───────────┴────────────────────────────────┘ │
│  frame-bottom (status bar)                       │
└─────────────────────────────────────────────────┘
```

- **Scroller:** `#frame-content` (no `window`)
- **Lenis:** `lerp: 0.05` en programmatic scroll; `progress` → barra lateral %
- **ScrollTrigger:** siempre `scroller: document.querySelector("#frame-content")`
- **Touch:** varios composables retornan `{}` si `ScrollTrigger.isTouch === 1` (desactivan animaciones pesadas)

---

## 2. Watermark (`DecorationScrollingText`)

### DOM

```html
<div class="height-inner-frame sticky inset-0 flex … overflow-hidden">
  <span gsap="scrolling-text" class="
    whitespace-nowrap text-[20rem] font-extrabold lowercase
    leading-none text-[black] opacity-10
    md:text-[30rem] xl:text-[40rem]
  "> developer</span>
  <span gsap="scrolling-text"> developer</span>  <!-- duplicado -->
</div>
```

### Animación GSAP (`yB` en CveH2aTz.js)

```js
const spans = selector('[gsap="scrolling-text"]');
const width = spans[0].offsetWidth;
gsap.timeline({ repeat: -1 })
  .to(spans, { xPercent: -100, duration: width / 30, ease: 'none' });
```

| Propiedad | Valor |
| --- | --- |
| Dirección | Horizontal izquierda |
| Velocidad | `offsetWidth / 30` segundos por ciclo |
| Loop | Infinito (`repeat: -1`) |
| Duplicación | 2 spans para continuidad seamless |
| Color | `text-black` opacity 10% |
| Tamaño | 20rem → 30rem (md) → 40rem (xl) |

**Diferencia Lucio:** watermark estático centrado con `opacity: 0.05`. Para réplica: marquee horizontal con anime.js `translateX` loop.

---

## 3. Glows / spotlight

### DOM (2 círculos)

```html
<!-- Top: visible -->
<div class="… spotlight-top right-1/2 top-1/2 … opacity-50" gsap="spotlight-box">
  <div class="size-full rounded-full bg-primary opacity-50
    blur-[100px] md:blur-[150px] lg:blur-[100px] xl:blur-[200px]"
    gsap="spotlight"></div>
</div>

<!-- Bottom: oculto inicialmente -->
<div class="… spotlight-bottom … opacity-0" gsap="spotlight-box">
  <div class="… same blur …" gsap="spotlight"></div>
</div>
```

| Token | Valor |
| --- | --- |
| Color | `bg-primary` (acento del tema) |
| Opacidad círculo | 50% × 50% del div |
| Blur responsive | 100–200px |
| Posición | `fixed`, aspect-square, ancho 100% → 1/3 en lg |
| Clases | `spotlight-top` / `spotlight-bottom` — probable crossfade en scroll |

**Lucio actual:** 2 glows en `AppBackground.astro` + `bg-glows.ts` con scroll cruzado — arquitectura similar; ajustar blur/opacidad según tabla.

---

## 4. Hero text hooks

### Markup (home)

```html
<span gsap="supertitle" class="text-xs font-medium uppercase tracking-wider">Home</span>
<h1 gsap="title" class="lg:w-10/12">Hi, I'm Stefano, a <span class="text-primary">creative</span> developer</h1>
<p gsap="subtitle" class="w-11/12 md:w-10/12 lg:w-6/12 2xl:w-5/12">…</p>
<div class="scroll-line absolute bottom-6 h-24" gsap="streak"></div>
```

### Comportamiento inferido (auditoría + patrones GSAP)

| Hook | Comportamiento probable |
| --- | --- |
| `supertitle` | Fade/slide in al load o al entrar en viewport |
| `title` | SplitText líneas o palabras; stagger |
| `subtitle` | Delay respecto al title |
| `streak` | Línea vertical animada (scroll indicator) — clase `scroll-line` |

---

## 5. Scroll reveals (secciones bajo el hero)

### `reveal` + `reveal-t` (BurCr-ge.js)

```js
SplitText(revealEls, { type: 'words' });
gsap.from(words, {
  autoAlpha: 0, duration: 1, stagger: 0.2, ease: 'linear',
  scrollTrigger: {
    trigger: '[gsap="reveal-t"]',
    scroller: '#frame-content',
    start: 'top 85%', end: 'top 75%',
    scrub: 5,
    toggleActions: 'play none none reverse',
  },
});
```

### `slideIn` (BmtHwUa-.js)

- Initial: `scale: 0.95`, `autoAlpha: 0`, `transformOrigin: top center`
- Batch enter: `scale: 1`, `autoAlpha: 1`, stagger 0.1, `power1.inOut`
- start `top 85%`, end `top 80%`

### `fadeIn` (DnLu7KYZ.js)

- Initial: `scale: 0.75`, `autoAlpha: 0`
- Enter: `scale: 1`, `Expo.easeOut`, stagger 0.1

### `avatar` (Cssl27Mo.js)

- `bottom: -1rem` → scroll, scrub 10, start `top 90%` end `top 25%`

---

## 6. Botones (`btn-label`, `btn-icon`)

```js
SplitText(label, { type: 'chars' });
const tl = gsap.timeline({ paused: true });
tl.to(chars, { y: '-100%', ease: 'Expo.easeIn' })
  .set(chars, { y: '100%' })
  .to(chars, { y: 0, ease: 'Expo.easeOut' })
  .to(icon, { x: '100%', … }, 0) …
// play on hover
```

Efecto: rollover de caracteres + icono que sale y entra.

---

## 7. Hero 3D + scroll (resumen)

Ver [HERO-3D.md](./HERO-3D.md). Sincronizado con mismo `#frame-content`:
- Cámara zoom
- Rotación π/2
- Blur canvas 10px

**Lucio `hero-scroll.ts`:** equivalente parcial vía CSS transform; falta blur y rotación 3D real.

---

## 8. Page transition

```js
pageTransition: {
  name: 'page-transition',
  mode: 'out-in',
  onBeforeLeave() { transitionCoverActive = true },
  onAfterEnter() { transitionCoverActive = false },
}
```

Overlay `FrameCover` durante cambio de ruta.

---

## 9. Tabla de equivalencias anime.js (Lucio)

| Stefano (GSAP) | anime.js equivalente |
| --- | --- |
| `scrub: true` | `onScroll` + mapear progress manualmente |
| `ScrollTrigger.batch` | IntersectionObserver + stagger |
| SplitText words | spans por palabra en build o `textContent` split |
| Lenis lerp | `scroll-smooth` CSS o implementación ligera |
| `xPercent: -100` marquee | `anime({ translateX: ['0%','-50%'], loop: true })` |
| Canvas blur on scroll | CSS `filter` en canvas o WebGL composer |

---

## 10. `prefers-reduced-motion`

Stefano desactiva hooks en touch; no hay evidencia clara de `prefers-reduced-motion` en bundles — **Lucio debe mantenerlo** (ya implementado en `hero-scroll.ts` y `hero-symbol-light.ts`).
