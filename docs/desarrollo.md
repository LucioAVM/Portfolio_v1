# Desarrollo local

Comandos, entorno y limitaciones conocidas para trabajar en el portfolio.

## Requisitos

| Herramienta | Version |
| --- | --- |
| Node.js | 22 LTS (`.nvmrc`) |
| npm | incluido con Node |
| Wrangler | CLI de Cloudflare (Fase 3+, formulario) |

## Dos modos de desarrollo

### 1. Solo frontend (Astro)

```bash
npm run dev
```

- Hot reload rapido
- Content Collections, i18n, Tailwind, MDX
- **No ejecuta** Pages Functions (`/api/contact`)

### 2. Frontend + Functions (Wrangler)

```bash
npm run build
npx wrangler pages dev dist
```

- Simula Cloudflare Pages con Functions
- **Obligatorio** para probar formulario de contacto y Turnstile end-to-end
- Rebuild manual tras cambios en `functions/` o en el sitio estatico

**Regla:** no dar por validado el formulario solo con `astro dev`.

## Variables locales (`.dev.vars`)

Archivo en la **raiz del repo** (gitignored). Formato:

```
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
RESEND_API_KEY=re_xxxxxxxx
CONTACT_TO_EMAIL=tu@email.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
```

Wrangler lo carga automaticamente en `wrangler pages dev`.

**Nunca** commitear `.dev.vars`. Usar `.dev.vars.example` con placeholders (Fase 3).

## Turnstile — claves de prueba

| Clave | Uso |
| --- | --- |
| Site key (visible) | `1x00000000000000000000AA` |
| Secret key (server) | `1x0000000000000000000000000000000AA` |

Siempre pasan la verificacion. Solo para desarrollo.

Docs: [Turnstile testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/)

## Email en local

- **Resend sandbox:** funciona sin dominio propio; emails solo a la cuenta verificada en Resend.
- **Mailchannels:** no envia desde `*.pages.dev` sin DNS; no usar como primario en dev.

## Estructura relevante (post Fase 2)

```
Portfolio/
├── src/
│   ├── content.config.ts
│   ├── content/projects/{es,en}/
│   ├── pages/          # ES (raiz)
│   └── pages/en/       # EN
├── functions/
│   └── api/contact.ts
├── public/
│   └── _headers
├── .dev.vars           # local only
└── dist/               # output build
```

## Comandos utiles (Fase 2+)

```bash
npm run dev          # Astro dev server
npm run build        # Genera dist/
npm run preview      # Preview estatico (sin CF headers reales)
npm audit            # Supply chain check
```

## Limitaciones conocidas

| Limitacion | Mitigacion |
| --- | --- |
| `npm run preview` no aplica `_headers` de CF | Probar CSP en deploy preview de CF |
| `astro dev` no corre Functions | `wrangler pages dev dist` |
| Resend sandbox limitado | Dominio propio en Fase 5 |
| CSP `unsafe-inline` por Tailwind | Documentado en [[seguridad]] |

## Flujo recomendado por tarea

| Tarea | Comando |
| --- | --- |
| UI, layouts, MDX | `npm run dev` |
| Formulario contacto | `build` + `wrangler pages dev dist` |
| Validar CSP | Deploy preview en Cloudflare |
| Ver headers en prod | `curl -I https://tuproyecto.pages.dev` |
| Audit dependencias | `npm audit --audit-level=high` |
