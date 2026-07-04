# Portfolio personal

Sitio estático bilingüe (ES/EN) con Astro, Tailwind, MDX y Cloudflare Pages.

## Stack

- Astro 7 + Tailwind 4 + MDX
- anime.js v4 (mascota minimi)
- Cloudflare Pages Functions (`/api/contact`)

## Comandos

```bash
npm install
npm run dev          # Astro dev server
npm run build        # Build a dist/
npm run validate:i18n
npm run pages:dev    # Probar Pages Functions
```

## Documentación

Ver carpeta [`docs/`](./docs/README.md).

## Seguridad

- Sin PII en HTML público
- Turnstile + Resend en formulario de contacto
- CSP vía `public/_headers`

## Deploy

Cloudflare Pages — ver [docs/deploy.md](./docs/deploy.md).
