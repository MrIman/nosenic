import { useRef, useState } from 'react'
import { CONTACT_EMAIL, FLAVOURS } from '../data/nosenic'
import { revealIn, useGSAP } from '../lib/motion'

type Status = 'idle' | 'sending' | 'done' | 'manual'

/**
 * Newsletter sign-up. One field, one consent box; on success the band keeps
 * the flavour it landed on. Delivery mirrors the order form: the serverless
 * function mails the inbox, and if it cannot, the reader gets the same message
 * ready to send from their own mail app.
 */
export default function Newsletter() {
  const root = useRef<HTMLElement>(null)
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  // Which flavour colours this band; picked once so it stays put.
  const flavour = useRef(FLAVOURS[Math.floor(Math.random() * FLAVOURS.length)]).current

  useGSAP(
    () => {
      if (root.current) revealIn(root.current)
    },
    { scope: root },
  )

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
      setStatus(response.ok && body?.ok ? 'done' : 'manual')
    } catch {
      setStatus('manual')
    }
  }

  return (
    <section
      ref={root}
      id="newsletter"
      className="relative px-5 py-24 sm:px-8 sm:py-28 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(52% 60% at 50% 100%, color-mix(in srgb, ${flavour.accent} 28%, transparent) 0%, transparent 70%)`,
        }}
      />

      <div className="mx-auto max-w-3xl text-center">
        <p
          data-reveal
          className="eyebrow will-reveal translate-y-6"
          style={{ color: flavour.ink }}
        >
          Newsletter
        </p>

        <h2
          data-reveal
          className="display will-reveal mt-6 translate-y-6 text-[clamp(32px,5.6vw,72px)]"
        >
          New flavours first.
        </h2>

        <p
          data-reveal
          className="will-reveal mx-auto mt-6 max-w-[46ch] translate-y-6 text-[16px] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Launches, new visual worlds and trade news — a few times a year, never more.
        </p>

        {status === 'done' ? (
          <p
            data-reveal
            className="display will-reveal mx-auto mt-10 max-w-[24ch] translate-y-6 text-[clamp(22px,3vw,34px)]"
            style={{ color: flavour.ink }}
          >
            You&rsquo;re on the list.
          </p>
        ) : (
          <form data-reveal onSubmit={submit} className="will-reveal mt-10 translate-y-6">
            <div className="mx-auto flex max-w-xl flex-col gap-3 sm:flex-row">
              <label className="flex-1">
                <span className="sr-only">Email address</span>
                <input
                  required
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-14 w-full rounded-full border bg-transparent px-6 text-center text-[16px] text-bone outline-none transition-colors duration-200 placeholder:text-bone/30 focus:border-[color:var(--accent-ink)] sm:text-left"
                  style={{ borderColor: 'var(--line)' }}
                />
              </label>
              <button
                type="submit"
                disabled={status === 'sending' || !consent}
                className="inline-flex h-14 shrink-0 cursor-pointer items-center justify-center rounded-full px-8 text-[16px] font-medium text-ink transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: flavour.accent }}
              >
                {status === 'sending' ? 'Signing up…' : 'Sign up'}
              </button>
            </div>

            <label className="mx-auto mt-5 flex max-w-xl cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[color:var(--accent)]"
              />
              <span className="text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                I am 18 or over and agree to receive emails from NoseNic. I can unsubscribe at
                any time — see the{' '}
                <a href="/privacy" className="underline underline-offset-2 hover:text-bone">
                  privacy policy
                </a>
                .
              </span>
            </label>

            {status === 'manual' && (
              <p className="mx-auto mt-6 max-w-xl text-[14px] leading-relaxed">
                We could not sign you up from here.{' '}
                <a href={mailto} className="underline underline-offset-2">
                  Send us a quick email instead
                </a>{' '}
                and we will add you.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
