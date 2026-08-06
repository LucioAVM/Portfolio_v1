# Brief de producto — Portfolio Lucio Monsalbo

> **Estado:** borrador cerrado para loop (2026-08-06).  
> **Referencia de formato:** [stefanobartoletti.it](https://www.stefanobartoletti.it/) — composición y metáfora, no contenido ni marca.  
> **Fuente de verdad de rutas/contenido:** [[sitemap]], [[modelo-contenido]], [[design-direction]].

## 1. Objetivo

Portfolio = **pitch de contratación + vitrina multi-pilar**.

Quien llega (recruiter, hiring manager, cliente de encargos 3D) debe entender en &lt; 60 s:

1. Quién sos y qué problema resolvés
2. Evidencia en **dev**, **ciber** e **impresión 3D**
3. Contexto humano (sobre mí / voluntariados)
4. Cómo contactarte

No es un clone de Stefano. Es **tu historia** con el **lenguaje visual/UX** de ese tipo de sitio (shell tipo SO, ventanas, acento por sección, home cinematográfica).

## 2. Audiencia (prioridad)

| Prioridad | Audiencia | Qué necesita ver |
| --- | --- | --- |
| 1 | Empleo **dev** y **ciber** (igual peso) | Proyectos codeados + labs/writeups publicables + stack |
| 2 | Encargos / interés en **impresión 3D** | Piezas, proceso, calidad, CTA de contacto |
| — | Público general | Home clara; no asumir jerga sin ancla |

## 3. Posicionamiento (cerrado)

| Campo | Valor |
| --- | --- |
| ID | **P2** |
| ES | **De problemas a soluciones que funcionan** — código, ciber e impresión 3D |
| EN | **From problems to solutions that work** — code, cyber & 3D printing |
| Ángulo | Problem → solution |

**Reglas del chamullo:**

- Una promesa + evidencia debajo (proyectos), no adjetivos sueltos (“apasionado”, “innovador”)
- Mismos pilares en ES y EN (tono, no traducción literal forzada)
- No inventar logros, clientes, certs ni números

> Aplicar en hero + `about.ts` + `ui.*.json` en la primera pasada del loop.

## 4. Arquitectura de mensaje

### Home (pantallazo)

Orden narrativo:

1. Hero — nombre + rol elegido + tagline
2. About en ventanas — bio, dónde, portrait, hobbies reales, me-online
3. Highlights — 3–6 `featured` mezclando pilares (mín. 1 por pilar si hay contenido)
4. Puentes — CTAs a `/proyectos`, `/ciberseguridad`, `/impresion-3d`
5. Confianza — voluntariados / referidos (solo si hay contenido real)
6. CTA contacto / colaboración

Detalle profundo = páginas de pilar. Home no es el catálogo completo.

### Pilares

| Pilar | Ruta | Qué entra | Qué no |
| --- | --- | --- | --- |
| Programación | `/proyectos` (+ filtro `dev`) | Repos, demos, apps, CLIs | Tutoriales genéricos sin obra propia |
| Ciberseguridad | `/ciberseguridad` | Máquinas, labs, writeups **publicables** | Exploits no sanitizados, datos de terceros, hallazgos sin [[checklist-writeup]] |
| Impresión 3D | `/impresion-3d` | Piezas, proceso, materiales, encargos | Stock photos / renders ajenos como propios |
| Sobre mí | `/sobre-mi` | Bio, voluntariados, skills, hobbies reales | Bio genérica tipo LinkedIn vacía |

Una sola collection `projects` (`category`: `dev` \| `ciberseguridad` \| `impresion3d`) — ver [[modelo-contenido]].

## 5. Referidos / “testimonials”

Equivalente a la sección de Stefano “Nice things people say”, pero **solo con referidos reales**.

Fuentes válidas (ejemplos):

- Personas / orgs de voluntariados
- Compañeros de lab o estudio
- Quienes encargaron piezas 3D o usaron un proyecto tuyo

Reglas:

- Pedir permiso explícito + texto aprobado (o paráfrasis acordada)
- Nombre + rol/contexto (ej. “Voluntariado X”) — sin inventar cargos
- **Decisión 2026-08-06:** referidos se piden **después** → sección **fuera de este loop** (no placeholders falsos)
- No pedir reviews genéricas de internet; preferir 2–4 frases cortas de gente que te vio laburar

## 6. Inventario de contenido (pre-loop / paralelo)

Lucio confirma que el material existe; falta **localizarlo y cargarlo**.

| Bucket | Acción | Criterio “listo para sitio” |
| --- | --- | --- |
| Dev | Listar repos/apps showables | Título, summary, link github/demo, cover opcional |
| Ciber | Listar máquinas/writeups | Pasan [[checklist-writeup]]; `draft: true` hasta OK |
| 3D | Fotos + fichas de piezas | Foto propia, material/tags, sin EXIF sensible |
| Sobre mí | Bio + voluntariados | Fechas/roles reales; sin PII de terceros |
| Referidos | Pedir 2–4 quotes | Texto + permiso |

Mientras tanto: placeholders **marcados** (`TODO` / `draft`) — nunca hechos inventados.

## 7. Sí / No del loop de implementación

### Sí

- Composición/motion al lenguaje Stefano (shell, ventanas, hero, reveals, acento por sección)
- Home multi-pilar según §4
- Vitrinas y filtros según modelo existente
- Iterar con Browser: referencia ↔ `localhost` hasta checklist verde
- i18n ES/EN donde ya esté cableado
- CSP grado A; stack Astro + Tailwind + anime.js

### No

- Copiar copy, tipografías PP, assets o clientes de Stefano
- GSAP / Three.js / Storyblok / WebGL “porque Stefano”
- Inventar proyectos, referidos, certs o métricas
- Publicar writeups sin checklist
- Scope creep: blog, shop, CTF interactivo, analytics innecesario
- Cambiar mapa de rutas sin pedido explícito
- Commit / push sin pedido explícito

## 8. Prioridad del trabajo (elección del agente)

Orden para no gastar tokens al pedo:

| Orden | Foco | Por qué |
| --- | --- | --- |
| 0 | ~~Cerrar posicionamiento + brief~~ | **Hecho** (P2 + referidos diferidos) |
| 1 | Estructura home multi-pilar + CTAs + copy P2 | Mensaje claro aunque el polish falte |
| 2 | Loop visual/motion con Browser | Donde más tokens + más valor “wow” |
| 3 | Carga de contenido real + referidos | Paralelo: Lucio junta assets; Agent integra |
| 4 | Pulido fino / edge cases | Solo cuando 1–3 estén OK |

## 9. Estrategia de modelos (optimizar tokens)

Pools (ver dashboard Spending):

- **Cursor Models** (Grok 4.5, Composer 2.5) — te queda casi todo → **caballo de batalla**
- **Other Models** (~$20 API) — Opus / GPT high, etc. → **quirúrgico**

| Fase | Modelo sugerido | Pool |
| --- | --- | --- |
| Plan / decisiones de copy y arquitectura | Modelo fuerte 1 vez (p.ej. Opus / GPT high) | Other — sesión corta |
| Loop de implementación + Browser + CSS/motion | **Composer 2.5** o **Grok 4.5** | Cursor Models |
| Atasco visual difícil / refactor gordo | 1 pasada Other Models, luego volver a Composer/Grok | Mix |
| Autocomplete / edits chicos | Auto / Composer | Cursor / bundled |

**Reglas anti-desperdicio:**

1. Un chat largo con checklist de aceptación (no 20 chats que re-leen el repo)
2. Brief + `AGENTS.md` como ancla (no renegociar el concepto cada prompt)
3. No usar Opus para “ajustá 4px el padding”
4. Browser en el loop; no pegar 40 capturas a mano
5. Inventario de contenido lo junta Lucio offline; el Agent no “busca en tu cabeza”

## 10. Checklist de aceptación (loop)

El Agent no declara “listo” hasta:

- [x] Posicionamiento elegido aplicado en hero + about
- [x] Home muestra los 4 pilares (directo o vía CTA claro)
- [x] Highlights mezclan categorías cuando hay `featured`
- [x] Shell/ventanas/hero reconocibles vs referencia **sin** ser clone de contenido
- [ ] Desktop + mobile OK en Browser
- [x] Sin referidos falsos; sección ausente si no hay quotes
- [ ] Sin PII en HTML; writeups draft si no pasan checklist
- [ ] `prefers-reduced-motion` respetado

## 11. Inputs pendientes (no bloquean el loop)

1. Inventario crudo de proyectos / piezas / writeups (paralelo)
2. Pedir referidos cuando toque fase contenido
3. Fotos / covers reales cuando existan
