# Guia de uso eficiente de Cursor

Como sacarle el maximo provecho a Cursor mientras construimos este portfolio.

## Modos de trabajo

### Plan (Planificar)

- **Cuando usarlo:** antes de codear algo grande o ambiguo (arquitectura, i18n, seguridad, sitemap).
- **Que hace:** investiga, propone un plan por fases, detecta riesgos. No modifica codigo hasta que confirmes.
- **Ejemplo en este proyecto:** todo el diseno inicial del portfolio se hizo en Plan mode.

### Agent (Agente)

- **Cuando usarlo:** implementacion, crear archivos, ejecutar comandos, iterar sobre codigo.
- **Que hace:** edita el repo, corre builds, instala dependencias.
- **Regla:** mover el workspace al proyecto (`Portfolio/`) antes de codear; no arrancar desde home.

### Ask (Consulta)

- **Cuando usarlo:** preguntas puntuales, explicar codigo, revisar un snippet sin tocar nada.
- **Que hace:** solo lectura; ideal para aprender o decidir sin side effects.

## Auto vs modelos Pro

### Auto

- Cursor elige el modelo segun la tarea.
- **Bueno para:** tareas rutinarias, edits chicos, exploracion rapida, seguir un plan ya cerrado.
- **Limitacion:** puede no ser el mejor modelo para decisiones arquitectonicas complejas.

### Modelos Pro (elegir explicitamente)

- **Cuando conviene elegir uno:**
  - Diseno de arquitectura o seguridad
  - Debugging dificil (CSP, i18n, Pages Functions)
  - Refactors que tocan muchos archivos
  - Writeups de ciber o validaciones Zod estrictas
- **Tip:** en tareas criticas, nombrar el modelo en el prompt si queres consistencia.

### Recomendacion para este portfolio

| Tarea | Modo | Modelo |
| --- | --- | --- |
| Planificar fase nueva | Plan | Pro |
| Scaffolding Astro | Agent | Auto o Pro |
| Formulario + Turnstile | Agent | Pro |
| Docs / contenido MDX | Agent | Auto |
| Debug CSP en deploy | Agent | Pro |

## Reglas (Rules)

### User rules

- Preferencias globales tuyas (idioma, formato Markdown, no commitear sin pedir, etc.).
- Viven en configuracion de Cursor; aplican a todos los proyectos.

### Project rules

- Convenciones **solo de este repo** (`.cursor/rules/` o reglas de proyecto).
- Ejemplos utiles para el portfolio:
  - "Siempre validar URLs HTTPS en Zod"
  - "No PII en HTML"
  - "ES en raiz de pages/, EN en pages/en/"

**Cuando crear una rule de proyecto:** cuando el agente repite el mismo error 2+ veces.

## MCP (Model Context Protocol)

Servidores que extienden lo que el agente puede hacer:

- **cursor-app-control:** mover workspace, crear proyecto, abrir recursos.
- **cursor-ide-browser:** probar el sitio en browser (post-deploy).

**Buena practica:** antes de llamar un MCP, el agente debe leer el schema del tool. No asumir parametros.

## Prompting efectivo

### Hacer

- Dar **contexto y objetivo**: "Fase 2: inicializar Astro con i18n ES/EN, sin adapter cloudflare".
- Referenciar **archivos concretos**: `@docs/seguridad.md`.
- Pedir **alcance acotado**: "solo el schema Zod de projects, no toques el layout".
- Iterar por fases: no "haceme todo el portfolio" en un solo mensaje.

### Evitar

- Prompts vagos: "mejorame la pagina".
- Mezclar planificacion e implementacion en el mismo turno sin confirmar.
- Pedir commitear/pushear sin revisar el diff.

### Plantilla util

```
Contexto: Fase X del portfolio (ver docs/README.md).
Objetivo: [una cosa concreta].
Restricciones: [no tocar Y, seguir docs/seguridad.md].
Criterio de listo: [build pasa / tests / checklist].
```

## Flujo recomendado por fase

1. **Plan** — cerrar decisiones y riesgos.
2. **Agent** — implementar una fase.
3. **Revisar** diff + probar localmente (`docs/desarrollo.md`).
4. **Commit** solo cuando vos lo pidas.

## Errores comunes

| Error | Solucion |
| --- | --- |
| Codear desde home en vez del proyecto | `move_agent_to_root` a `Portfolio/` |
| Saltear Fase 1 (modelo de contenido) | Cerrar schema Zod antes del UI |
| Probar formulario solo con `astro dev` | Usar `wrangler pages dev dist` |
| Confiar en CSP en `npm run preview` | Verificar headers en deploy real de CF |
| Exponer secrets en el repo | `.dev.vars` + env vars en Cloudflare |

## Recursos

- [Documentacion Astro i18n](https://docs.astro.build/en/guides/internationalization/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)
