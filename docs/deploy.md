# Deploy — Cloudflare Pages

Configuracion de hosting, variables de entorno y email en produccion.

## Hosting

| Parametro | Valor |
| --- | --- |
| Plataforma | Cloudflare Pages (gratis) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 22 (`.nvmrc`) |
| Adapter Astro | **No** instalar `@astrojs/cloudflare` |

Sitio estatico + `functions/` en la raiz del repo (Pages Functions nativas).

## Dominio

### Fase inicial

- URL gratis: `nombre.pages.dev`
- Suficiente para desarrollo, pruebas y compartir con recruiters

### Fase produccion

- Dominio propio (~$8.500 ARS/ano `.com.ar` u otro TLD)
- DNS en Cloudflare
- Redirect opcional de `*.pages.dev` al dominio canonico

## Conexion Git (Fase 5)

1. Repo en GitHub
2. Cloudflare Pages → Connect to Git
3. Branch de produccion: `main`
4. Preview deployments en PRs (recomendado)

## Variables de entorno (produccion)

Configurar en Cloudflare Pages → Settings → Environment variables:

| Variable | Entorno | Descripcion |
| --- | --- | --- |
| `TURNSTILE_SECRET_KEY` | Production + Preview | Secret de Turnstile (no la site key) |
| `RESEND_API_KEY` | Production + Preview | API key de Resend |
| `CONTACT_TO_EMAIL` | Production + Preview | Destino del formulario |
| `CONTACT_FROM_EMAIL` | Production + Preview | Remitente (dominio verificado en Resend) |
| `PUBLIC_TURNSTILE_SITE_KEY` | Production + Preview | Site key Turnstile (pública) |

**Preview:** usar las mismas claves de test de Turnstile o claves separadas segun prefieras.

Local: ver [[desarrollo]] (`.dev.vars`).

## Turnstile en produccion

1. Crear widget en Cloudflare Dashboard → Turnstile
2. Site key → frontend (variable publica o env de build)
3. Secret key → env var `TURNSTILE_SECRET_KEY` (solo server)

## Email con Resend

### Sandbox (sin dominio)

- Funciona limitado: solo emails a direcciones verificadas en Resend
- Util para probar el flujo antes del dominio

### Produccion (con dominio)

1. Agregar dominio en Resend
2. Configurar registros DNS (SPF, DKIM segun Resend)
3. Verificar dominio
4. Actualizar `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` y remitente en la Function

**Mailchannels** queda como alternativa post-DNS si se prefiere; Resend es el primario acordado.

## Headers de seguridad

- Archivo `public/_headers` se sirve automaticamente en CF Pages
- Verificar en deploy real (no en `npm run preview`)
- Rollout CSP: Report-Only → enforce ([[seguridad]])

## Checklist pre-deploy (Fase 5)

- [ ] Build pasa en CI
- [ ] Env vars configuradas en CF
- [ ] Turnstile widget apunta al dominio correcto
- [ ] Formulario envia email en preview deploy
- [ ] `_headers` activos (securityheaders.com)
- [ ] Sitemap y robots.txt
- [ ] Sin PII en HTML
- [ ] Linktree viejo sin datos personales expuestos

## CI sugerido (Fase 5)

```yaml
# .github/workflows/ci.yml (borrador)
# - npm ci
# - npm run build
# - npm audit --audit-level=high
```

## Rollback

- Cloudflare Pages mantiene historial de deployments
- Rollback instantaneo desde el dashboard a un deploy anterior

## Referencias

- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Resend + Cloudflare](https://resend.com/docs)
