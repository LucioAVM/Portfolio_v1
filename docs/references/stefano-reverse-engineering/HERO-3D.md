# Hero 3D — símbolos flotantes (DecorationFloatingLetters)

> Fuente primaria: descompilación de `C3JuQ95o.js` → `assets-manifest/floating-letters-component.txt`

---

## 1. Arquitectura DOM

```html
<!-- Capas superpuestas (todas sticky dentro del hero) -->
<div class="absolute inset-0 h-full">
  <!-- Watermark marquee (ver MOTION.md) -->
  <DecorationScrollingText />

  <!-- Canvas WebGL -->
  <div class="height-inner-frame sticky inset-0" floating-letters-trigger>
    <TresCanvas clear-alpha="0" class="height-inner-frame sticky">
      <!-- escena Three.js -->
    </TresCanvas>
  </div>
</div>

<!-- Texto hero (encima o debajo según z-index) -->
<section>
  <div class="height-inner-frame container …">
    <span gsap="supertitle">…</span>
    <h1 gsap="title">…</h1>
    <p gsap="subtitle">…</p>
    <div class="scroll-line …" gsap="streak"></div>
  </div>
</section>
```

**Clave:** `height-inner-frame sticky inset-0` hace que watermark + canvas permanezcan fijos mientras el contenido de la sección hace scroll dentro de `#frame-content`.

---

## 2. Props del componente

```ts
props: {
  letters: { type: Array, required: true }  // 4 strings de 1 carácter desde Storyblok
}
```

Valores CMS actuales (jul 2026): ver [CMS-DATA.md](./CMS-DATA.md).

---

## 3. Geometría de texto (TextGeometry)

| Parámetro | Valor | Notas |
| --- | --- | --- |
| `font` | `/fonts/OS_subset.json` | Typeface Three.js |
| `size` | por letra: `0.5` … `1.25` | Ver tabla posiciones |
| `height` | `0.05` | Profundidad de extrusión (unidades Three) |
| `bevel-size` | `0.06` | Tamaño del bisel |
| `bevel-thickness` | `0.1` | Grosor del bisel |
| `curve-segments` | `12` | Suavizado contorno |
| `bevel-segments` | `12` | Suavizado bisel |
| `bevelEnabled` | implícito `true` | En ExtrudeGeometry base |

**Corrección vs análisis anterior:** los valores `bevelSize: 8`, `height: 50` eran defaults de la librería Three en el bundle, **no** los del componente. Los props del componente son los de la tabla (escala ~0.05–1.25).

---

## 4. Material

```js
TresMeshPhysicalMaterial({
  color: '#444',
  roughness: 0.5,
  metalness: 0.25,
  ior: 2,
})
```

| Propiedad | Valor | Efecto visual |
| --- | --- | --- |
| Tipo | **MeshPhysicalMaterial** | Reflejos más ricos que Standard |
| Color base | `#444` | Gris medio — cara frontal lee ~`#111`–`#444` según luz |
| Roughness | `0.5` | Semi-mate |
| Metalness | `0.25` | Leve brillo metálico en bisel |
| IOR | `2` | Refracción (contribuye al rim en ángulos) |

**No usa** `emissive`, `text-stroke` ni capas CSS. El rim claro es **iluminación**, no stroke blanco.

---

## 5. Iluminación de escena

```js
TresDirectionalLight({ color: '#fff', intensity: 1, position: [-2, -2, 6] })
TresAmbientLight({ intensity: 0.5 })
```

- Una luz direccional desde arriba-izquierda-frente (`-2, -2, 6`)
- Ambient al 50% para rellenar sombras
- **No** hay PointLight en el componente final (a diferencia de defaults Three en el bundle)

---

## 6. Cámara

```js
const t = ref(1.25);  // factor de distancia, animado en scroll
const cameraPosition = computed(() => [2*t, 3*t, 4*t]);
// TresPerspectiveCamera position=cameraPosition, look-at=[0,0,0]
```

En scroll, `t` va de `1.25` → `-0.2` (acerca/aleja cámara — efecto zoom inverso).

---

## 7. Posición por letra (4 slots)

### Desktop (`lg` breakpoint)

| Índice | size | position `[x,y,z]` | rotation `[rx,ry,rz]` |
| --- | --- | --- | --- |
| 0 | 1.25 | `[-5 - p.x, 0, 0]` | `[0, -d, 0]` |
| 1 | 1.0 | `[3 + p.x, 0, -2]` | `[0, d, 0]` |
| 2 | 0.5 | `[0, 0, 2 + p.y]` | `[d, 0, 0]` |
| 3 | 0.75 | `[0, 0, -2 - p.y]` | `[-d, 0, 0]` |

### Mobile (sin `lg`)

| Índice | size | position | rotation |
| --- | --- | --- | --- |
| 0 | 1.0 | `[-1, 1.5, 0]` | `[0, -d, 0]` |
| 1 | 1.25 | `[1, -2, 0]` | `[0, d, 0]` |
| 2 | 0.5 | `[0, 0, 1.5]` | `[d, 0, 0]` |
| 3 | 0.75 | `[0, 0, -1.5]` | `[-d, 0, 0]` |

Donde:
- `p = { x: f.x * 0.5, y: f.y * 0.5 }` — offset por mouse suavizado
- `d` — ángulo Y global, animado `0 → π/2` en scroll

---

## 8. Parallax por mouse

```js
const { x, y } = useMouse();  // m0() en bundle
const normalized = {
  x: (x - width/2) / (width/2),
  y: (y - height/2) / (height/2),
};
const f = ref({ x: 0, y: 0 });

watch(normalized, (S) => {
  gsap.to(f.value, { x: S.x, y: S.y, duration: 5, ease: 'power2.out' });
});

// Rotación del grupo entero
const groupRotation = computed(() => [
  0 + f.value.y * 0.075,
  0 + f.value.x * 0.075,
  0,
]);
```

**Sensación:** movimiento lento (5s), amplitud moderada (7.5% en Y, 7.5% en X).

---

## 9. Animación de scroll (ScrollTrigger)

```js
gsap.context(() => {
  const canvas = selector('canvas');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: sceneScope,           // [floating-letters-trigger]
      scroller: '#frame-content',
      start: 'top 0%',
      end: 'bottom 50%',
      scrub: true,
    },
  });
  tl.to(t, { value: -0.2 }, 0);                    // zoom cámara
  tl.to(d, { value: Math.PI / 2 }, 0);            // rotación global
  tl.to(canvas, { filter: 'blur(10px)', ease: 'Expo.easeIn' }, 0);
}, sceneScope);
```

| Propiedad | Inicio | Fin scroll |
| --- | --- | --- |
| Factor cámara `t` | 1.25 | -0.2 |
| Rotación `d` | 0 | π/2 (~90°) |
| Canvas CSS filter | none | blur(10px) |
| Easing scroll | scrub lineal | blur con Expo.easeIn |

---

## 10. Render canvas

- `clear-alpha: 0` — fondo transparente; se ven glows CSS detrás
- Canvas sticky — permanece en viewport durante scroll del hero
- `renderMode` Tres: probablemente `on-demand` o `always` según visibilidad

---

## 11. Mapeo a réplica Lucio (Three.js sin Tres)

### Contrato existente reutilizable

`src/lib/motion/hero-symbol-light.ts` expone `--sym-face`, `--sym-bevel-*`, `--sym-rim-strength` para CSS. En WebGL:

| CSS var | Three.js equivalente |
| --- | --- |
| `--sym-face` | `mesh.material.color` |
| `--sym-bevel-color` | segunda luz o gradient en normal map |
| `--sym-rim-strength` | `directionalLight.intensity` × rim factor |
| `progress` (scroll) | interpolar camera Z, rotation Y, postprocessing blur |

### Pasos mínimos WebGL

1. `FontLoader` + `TextGeometry` con mismos bevel params
2. `MeshPhysicalMaterial` `#444`, roughness 0.5, metalness 0.25
3. `DirectionalLight(-2,-2,6)` + `AmbientLight(0.5)`
4. Canvas `position:fixed/sticky` en `.hero-symbol-layer`
5. En `hero-scroll.ts`: en lugar de transform CSS, actualizar cámara + `rotation.y` + `composer` blur

### CSP

- Cargar Three desde `node_modules` vía Vite bundle
- Sin `eval`; shaders embebidos como strings en módulo TS
- `worker` no requerido para esta escena simple

---

## 12. Por qué CSS no alcanza

| Efecto Stefano | CSS Lucio actual | Gap |
| --- | --- | --- |
| Bisel redondeado real | `::after` plano desplazado | Sin curvatura en silueta |
| Rim por reflexión | `text-shadow` / stroke | Borde duro, no luz |
| Blur al salir del foco | `opacity` + `scale` | Falta desenfoque óptico |
| Material físico | Colores fijos por capa | Sin respuesta a ángulo |

**Estimación:** CSS optimizado ~85%; WebGL con mismos params ~95–98%.
