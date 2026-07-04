# Checklist producción — Fase 5

Pasos manuales post-deploy en `https://portfolio-v1-1ho.pages.dev`.

## Turnstile (Cloudflare Dashboard)

- [x] Widget `portfolio-contact` con hostname `portfolio-v1-1ho.pages.dev`
- [x] Env vars `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` en Pages
- [x] Formulario probado en URL real

## Resend (email)

- [x] Cuenta + API key en Pages
- [x] `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
- [x] Email de prueba recibido
- [ ] Con dominio propio: verificar DNS en Resend y actualizar remitente

## CSP

- [x] `Content-Security-Policy` enforce en [`public/_headers`](../public/_headers)
- [x] Turnstile + formulario OK en producción
- Nota: `unsafe-inline` documentado (Astro + Tailwind) — ver [[seguridad]]

## SEO y dominio

- [x] `site` alineado a `portfolio-v1-1ho.pages.dev`
- [x] `robots.txt` y `security.txt` alineados
- [x] [securityheaders.com](https://securityheaders.com) — **grado A** (2026-07-04)
- [ ] Dominio propio → CF Custom domains → redirect 301 desde `*.pages.dev`
- [ ] Retirar PII del Linktree viejo

## Backlog (cuando quieras)

- [ ] `public/cv.pdf` + fotos 3D en `src/assets/`
- [ ] Referencias visuales en [[design-direction]]
- [ ] Más proyectos reales en MDX

## CI

GitHub Actions ya corre: `validate:i18n`, `build`, `npm audit`.

Cada push a `main` → redeploy automático en Cloudflare Pages.
