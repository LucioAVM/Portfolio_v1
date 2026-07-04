# Checklist producción — Fase 5

Pasos manuales post-deploy en `https://portfolio-v1-1ho.pages.dev`.

## Turnstile (Cloudflare Dashboard)

1. **Turnstile** → Create widget
2. Hostnames: `portfolio-v1-1ho.pages.dev` (+ dominio propio cuando exista)
3. Copiar keys a **Pages → Settings → Environment variables**:

| Variable | Valor |
| --- | --- |
| `PUBLIC_TURNSTILE_SITE_KEY` | Site key del widget |
| `TURNSTILE_SECRET_KEY` | Secret key (solo server) |

4. Probar `/contacto` en URL **real** (no `astro dev`)

## Resend (email)

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
