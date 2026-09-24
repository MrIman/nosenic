import { useState } from 'react'
import { CONTACT_EMAIL } from '../data/nosenic'

export type NewsletterStatus = 'idle' | 'sending' | 'done' | 'manual'

/** Set once someone signs up, so the popup stops asking. */
export const JOINED_KEY = 'nosenic:newsletter-joined'

export const readFlag = (key: string) => {
  try {
    return window.localStorage.getItem(key) === 'yes'
  } catch {
    return false
  }
}

export const writeFlag = (key: string) => {
  try {
    window.localStorage.setItem(key, 'yes')
  } catch {
    /* Private mode: the flag simply does not stick. */
  }
}

/** Sign-up state shared by the newsletter band and the popup. */
export function useNewsletter() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<NewsletterStatus>('idle')

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    'Newsletter sign-up',
  )}&body=${encodeURIComponent(`Please add ${email} to the NoseNic newsletter.`)}`

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const body = await response.json().catch(() => null)
      const ok = response.ok && body?.ok
      // Either way the address is with us, so never ask this reader again.
      writeFlag(JOINED_KEY)
      setStatus(ok ? 'done' : 'manual')
    } catch {
      writeFlag(JOINED_KEY)
      setStatus('manual')
    }
  }

  return { email, setEmail, consent, setConsent, status, submit, mailto }
}
