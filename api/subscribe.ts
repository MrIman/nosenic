import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Newsletter sign-ups. Same contract as api/order: mails the inbox through
 * Resend when RESEND_API_KEY is set, otherwise 503 so the page can fall back
 * to the reader's own mail app.
 */
const INBOX = process.env.ORDER_INBOX ?? 'info@nosenic.com'
const FROM = process.env.ORDER_FROM ?? 'NoseNic orders <orders@nosenic.com>'

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false, error: 'method-not-allowed' })
  }

  const email = String((request.body as { email?: string })?.email ?? '').trim()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return response.status(400).json({ ok: false, error: 'invalid-email' })
  }

  const key = process.env.RESEND_API_KEY
  if (!key) {
    return response.status(503).json({ ok: false, error: 'email-not-configured' })
  }

  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [INBOX],
      reply_to: email,
      subject: `Newsletter sign-up — ${email}`,
      text: `${email} asked to join the NoseNic newsletter (consent given on the website).`,
    }),
  })

  if (!sent.ok) {
    console.error('resend failed', sent.status, await sent.text())
    return response.status(502).json({ ok: false, error: 'send-failed' })
  }

  return response.status(200).json({ ok: true })
}
