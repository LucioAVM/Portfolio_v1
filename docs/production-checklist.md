# Checklist producción — Fase 5

Pasos manuales post-deploy en `https://portfolio-v1-1ho.pages.dev`.

## Turnstile (Cloudflare Dashboard)

- [x] Widget `portfolio-contact` con hostname `portfolio-v1-1ho.pages.dev`
- [x] Env vars `PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` en Pages
- [x] Formulario probado en URL real

## Resend (email) — **siguiente paso**

1. Cuenta en [resend.com](https://resend.com)
2. Sandbox: emails solo a dirección verificada
3. Variables en Cloudflare Pages:

| Variable | Valor |
| --- | --- |
| `RESEND_API_KEY` | API key |
| `CONTACT_TO_EMAIL` | Tu email |
| `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` (sandbox) o remitente verificado |

4. Con dominio propio: verificar DNS en Resend y actualizar remitente

## CSP

- **Estado actual:** `Content-Security-Policy` enforce en [`public/_headers`](../public/_headers)
- Verificar en deploy real: consola sin violaciones + Turnstile funcional
- Rollback: volver a `Content-Security-Policy-Report-Only` si algo rompe

## SEO y dominio

- [ ] `site` en `astro.config.mjs` = URL canónica final
- [ ] `robots.txt` y `security.txt` alineados
- [ ] Probar [securityheaders.com](https://securityheaders.com)
- [ ] Dominio propio → CF Custom domains → redirect 301 desde `*.pages.dev`
- [ ] Retirar PII del Linktree viejo

## CI

GitHub Actions ya corre: `validate:i18n`, `build`, `npm audit`.

Cada push a `main` → redeploy automático en Cloudflare Pages.
