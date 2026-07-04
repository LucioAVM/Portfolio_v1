/// <reference types="@cloudflare/workers-types" />

interface Env {
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const ip = context.request.headers.get('CF-Connecting-IP') ?? '0.0.0.0';

  try {
    const form = await context.request.formData();
    const honeypot = form.get('website')?.toString() ?? '';
    if (honeypot) {
      return Response.json({ error: 'Invalid submission' }, { status: 400 });
    }

    const name = form.get('name')?.toString().trim() ?? '';
    const message = form.get('message')?.toString().trim() ?? '';
    const token =
      form.get('turnstileToken')?.toString() ??
      form.get('cf-turnstile-response')?.toString() ??
      '';

    if (!name || name.length > 100 || !message || message.length > 2000 || !token) {
      return Response.json({ error: 'Invalid input' }, { status: 400 });
    }

    const secret = context.env.TURNSTILE_SECRET_KEY;
    if (!secret) {
      return Response.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const valid = await verifyTurnstile(token, secret, ip);
    if (!valid) {
      return Response.json({ error: 'Captcha failed' }, { status: 403 });
    }

    const apiKey = context.env.RESEND_API_KEY;
    const to = context.env.CONTACT_TO_EMAIL;
    const from = context.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

    if (apiKey && to) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `Portfolio contact from ${name}`,
          text: `From: ${name}\nIP: ${ip}\n\n${message}`,
        }),
      });
      if (!emailRes.ok) {
        return Response.json({ error: 'Email delivery failed' }, { status: 502 });
      }
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
};
