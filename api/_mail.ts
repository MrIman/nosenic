/**
 * Shared Resend call for the order and newsletter endpoints.
 *
 * Vercel ignores files whose name starts with an underscore, so this is a
 * helper rather than a route.
 */
export const INBOX = process.env.ORDER_INBOX ?? 'info@nosenic.com'

/** Everything a reader receives comes from the brand address. */
export const FROM = process.env.MAIL_FROM ?? `NoseNic <${INBOX}>`

interface Mail {
  to: string
  subject: string
  text: string
  replyTo?: string
}

export async function sendMail(key: string, mail: Mail) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [mail.to],
      reply_to: mail.replyTo ?? INBOX,
      subject: mail.subject,
      text: mail.text,
    }),
  })

  if (!response.ok) {
    console.error('resend failed', response.status, await response.text())
  }
  return response.ok
}
