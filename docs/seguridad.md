# Seguridad — Security by design

Portfolio orientado a empleabilidad en ciberseguridad: el sitio debe demostrar criterio, no solo verse bien.

## Threat model

### En scope

- XSS via MDX, componentes o URLs mal validadas
- Supply chain (dependencias npm)
- Secretos filtrados al repo
- OSINT / PII expuesta (email, telefono)
- Writeups con info sensible
- Headers debiles
- Links maliciosos en frontmatter
- EXIF/metadata en imagenes y PDF

### Fuera de scope

- SQL injection, RCE propio, session hijacking
- WAF pago
- Pentest formal

## Principios (no negociables)

1. **Zero trust en contenido** — frontmatter y links validados en build (Zod).
2. **Minimo privilegio** — sin scripts terceros innecesarios; sin `eval`; sin `set:html` sin sanitizar.
3. **Defensa en profundidad** — Zod + escape Astro + CSP + headers HTTP.
4. **Fail secure** — build roto no deploya; `draft: true` para WIP.
5. **Documentar** — cambios de CSP y terceros se anotan aca.

## Validaciones (build-time)

| Capa | Regla |
| --- | --- |
| URLs | Solo `https://`; rechazar `javascript:`, `data:`, IPs privadas |
| Slugs | `^[a-z0-9-]+$` |
| Categories | `dev` \| `ciberseguridad` \| `impresion3d` |
| Tags | Whitelist |
| Links pagina | Centralizados en `src/data/links.ts` |

## HTTP Security Headers

Archivo: `public/_headers` (unica fuente de CSP; **no** Astro experimental CSP).

| Header | Valor |
| --- | --- |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| X-Frame-Options | DENY |
| X-Content-Type-Options | nosniff |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | camera=(), microphone=(), geolocation=(), payment=() |

### CSP (rollout)

1. Empezar con `Content-Security-Policy-Report-Only`
2. Probar en **deploy real** de Cloudflare (no `npm run preview`)
3. Enforce antes del launch publico

Entradas minimas para Turnstile:

```
script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com
style-src 'self' 'unsafe-inline'
frame-src https://challenges.cloudflare.com
connect-src 'self' https://challenges.cloudflare.com
```

`unsafe-inline` en script/style: tradeoff aceptado para Astro + Tailwind (documentado).

## Contacto seguro

- **Sin PII en HTML** (no mailto, wa.me, telefono).
- Formulario: Turnstile client + **Siteverify server-side** en Pages Function.
- Email via **Resend** (primario); dominio + DNS requerido para produccion.
- Secrets: `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` solo en env vars CF / `.dev.vars`.

Ver [[desarrollo]] y [[deploy]].

## Privacidad (OSINT)

| Dato | Politica |
| --- | --- |
| Email | Solo en env vars; no en HTML |
| Telefono | No publicar |
| CV PDF | Sin telefono/email; revisar metadata |
| Fotos | Strip EXIF antes de subir |
| Linktree viejo | Retirar PII al migrar |

## Supply chain

- `package-lock.json` commiteado
- `npm audit --audit-level=high` en CI
- Dependabot/Renovate
- Node 22 pin (`.nvmrc`)

## security.txt

Ruta: `public/.well-known/security.txt`

Campos obligatorios (RFC 9116):

```
Contact: https://tudominio.com/links
Expires: 2027-07-01T00:00:00Z
Preferred-Languages: es, en
```

## Verificacion pre-launch

- [ ] securityheaders.com grade A
- [ ] CSP enforce sin violaciones
- [ ] npm audit limpio (high+)
- [ ] Repo sin secretos
- [ ] Writeups pasaron [[checklist-writeup]]
- [ ] EXIF removido

## Registro de terceros en CSP

| Servicio | script-src | connect-src | Notas |
| --- | --- | --- | --- |
| Turnstile | challenges.cloudflare.com | challenges.cloudflare.com | Fase 3 |
| Resend | — | api.resend.com | Fase 3 (server-side only) |

_Agregar fila aca cada vez que se integre un tercero nuevo._
