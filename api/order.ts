import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Receives an order from /order and mails it to the inbox.
 *
 * Sending needs RESEND_API_KEY (and a verified sender domain). Without it the
 * function answers 503 and the page falls back to the customer's own mail app,
 * so orders are never silently lost.
 */
const INBOX = process.env.ORDER_INBOX ?? 'info@nosenic.com'
const FROM = process.env.ORDER_FROM ?? 'NoseNic orders <orders@nosenic.com>'

interface OrderPayload {
  reference?: string
  text?: string
  details?: { company?: string; email?: string }
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ ok: false, error: 'method-not-allowed' })
  }

  const { reference, text, details } = (request.body ?? {}) as OrderPayload
  if (!reference || !text || !details?.email) {
    return response.status(400).json({ ok: false, error: 'incomplete-order' })
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
      reply_to: details.email,
      subject: `NoseNic order ${reference} — ${details.company ?? 'new customer'}`,
      text,
    }),
  })

  if (!sent.ok) {
    console.error('resend failed', sent.status, await sent.text())
    return response.status(502).json({ ok: false, error: 'send-failed' })
  }

  return response.status(200).json({ ok: true, reference })
}
