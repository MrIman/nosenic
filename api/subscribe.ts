import type { VercelRequest, VercelResponse } from '@vercel/node'
import { INBOX, sendMail } from './_mail'

/**
 * Newsletter sign-ups: tells the inbox, and welcomes the subscriber from the
 * brand address. Without RESEND_API_KEY it answers 503 so the page can fall
 * back to the reader's own mail app.
 */
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

  const notified = await sendMail(key, {
    to: INBOX,
    replyTo: email,
    subject: `Newsletter sign-up — ${email}`,
    text: `${email} asked to join the NoseNic newsletter (consent given on the website).`,
  })

  // The welcome note is a courtesy; a failure there must not lose the sign-up.
  await sendMail(key, {
    to: email,
    subject: 'Welcome to NoseNic',
    text: [
      'Thanks for signing up.',
      '',
      'You will hear from us when a new flavour or visual world launches — a few',
      'times a year, never more.',
      '',
      `To unsubscribe, reply to this email or write to ${INBOX}.`,
      '',
      'NoseNic — Nasal Inhaler Series',
      'This product contains nicotine. Nicotine is an addictive chemical. 18+ only.',
    ].join('\n'),
  })

  if (!notified) {
    return response.status(502).json({ ok: false, error: 'send-failed' })
  }
  return response.status(200).json({ ok: true })
}
