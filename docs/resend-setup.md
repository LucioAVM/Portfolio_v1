# Resend — Email del formulario de contacto

Turnstile ya valida que no sea un bot. **Resend** envía el mensaje a tu casilla.

## Modo sandbox (sin dominio propio)

Ideal para empezar. Limitación: solo podés enviar a **emails que verificaste en Resend**.

### 1. Crear cuenta

1. [resend.com](https://resend.com) → Sign up
2. Verificá tu email personal (el que querés recibir mensajes)

### 2. API key

1. Dashboard → **API Keys** → **Create API Key**
2. Permiso: **Sending access**
3. Copiá la key (empieza con `re_`) — solo se muestra una vez

### 3. Variables en Cloudflare Pages

**Workers & Pages** → **portfolio-v1** → **Settings** → **Environment variables**

| Variable | Valor | Entorno |
| --- | --- | --- |
| `RESEND_API_KEY` | `re_...` | Production (+ Preview opcional) |
| `CONTACT_TO_EMAIL` | Tu email verificado en Resend | Production |
| `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` | Production |

Guardar → **Retry deployment** en el último deploy (o push a `main`).

### 4. Probar

1. Abrí `https://portfolio-v1-1ho.pages.dev/contacto`
2. Enviá un mensaje de prueba
3. Revisá bandeja (y spam) del `CONTACT_TO_EMAIL`

Si falla con **502 Email delivery failed**: key incorrecta, email destino no verificado, o límite sandbox.

## Modo producción (con dominio propio)

1. Resend → **Domains** → agregar tu dominio
2. Configurar DNS (SPF/DKIM que indique Resend)
3. Cambiar `CONTACT_FROM_EMAIL` a algo como `contacto@tudominio.com`
4. Actualizar widget Turnstile con el dominio nuevo

## Local (opcional)

Copiá keys a `.dev.vars` (gitignored):

```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=tu@email.com
CONTACT_FROM_EMAIL=onboarding@resend.dev
TURNSTILE_SECRET_KEY=...
```

Probar con:

```bash
npm run pages:dev
```

## Seguridad

- `RESEND_API_KEY` **nunca** en el repo
- El email del destinatario vive solo en env vars, no en HTML público
