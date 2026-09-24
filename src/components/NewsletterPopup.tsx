import { useEffect, useState } from 'react'
import { FLAVOURS } from '../data/nosenic'
import { prefersReducedMotion } from '../lib/motion'
import { JOINED_KEY, readFlag, useNewsletter, writeFlag } from '../hooks/useNewsletter'

/** Set the moment the card first appears, so it is offered once per browser. */
const SEEN_KEY = 'nosenic:newsletter-seen'
const AGE_KEY = 'nosenic:age-confirmed'
/** How far down the page the reader has to be before we interrupt. */
const TRIGGER = 0.35

/**
 * Invitation to the newsletter that slides in once the reader is into the
 * page. Shown a single time per browser — dismissed or ignored, it does not
 * come back — and never to someone who already signed up. The band further
 * down the page stays available either way.
 */
export default function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const { email, setEmail, consent, setConsent, status, submit, mailto } = useNewsletter()
  const [flavour] = useState(() => FLAVOURS[Math.floor(Math.random() * FLAVOURS.length)])

  useEffect(() => {
    // ?popup=now opens it straight away — visual QA only.
    if (
      import.meta.env.DEV &&
      new URLSearchParams(window.location.search).get('popup') === 'now'
    ) {
      setOpen(true)
      return
    }
    if (readFlag(SEEN_KEY) || readFlag(JOINED_KEY)) return

    const onScroll = () => {
      // Wait for the age gate: interrupting on top of it would be rude.
      if (!readFlag(AGE_KEY)) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0 || window.scrollY / max < TRIGGER) return

      window.removeEventListener('scroll', onScroll)
      writeFlag(SEEN_KEY)
      setOpen(true)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Sent from the popup: let the reader read the thank-you, then get out of the way.
  useEffect(() => {
    if (status !== 'done') return
    const id = window.setTimeout(() => setOpen(false), 3600)
    return () => window.clearTimeout(id)
  }, [status])

  if (!open) return null

  return (
    <aside
      role="dialog"
      aria-label="Newsletter"
      className="fixed inset-x-3 bottom-3 z-[90] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[400px]"
      style={{
        animation: prefersReducedMotion()
          ? undefined
          : 'popup-in 520ms cubic-bezier(.22,.9,.24,1) both',
      }}
    >
      <div
        className="relative rounded-lg border bg-ink-soft/95 p-6 backdrop-blur-xl sm:p-7"
        style={{ borderColor: flavour.accent }}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute right-2 top-2 flex size-11 cursor-pointer items-center justify-center text-[18px] text-bone/60 transition-colors duration-200 hover:text-bone"
        >
          &times;
        </button>

        {status === 'done' ? (
          <>
            <p className="eyebrow" style={{ color: flavour.ink }}>
              Newsletter
            </p>
            <p className="display mt-3 text-[26px]">You&rsquo;re on the list.</p>
          </>
        ) : (
          <>
            <p className="eyebrow" style={{ color: flavour.ink }}>
              Newsletter
            </p>
            <p className="display mt-3 pr-10 text-[clamp(22px,5vw,28px)]">
              New flavours first.
            </p>
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Launches and new visual worlds, a few times a year.
            </p>

            <form onSubmit={submit} className="mt-5">
              <label>
                <span className="sr-only">Email address</span>
                <input
                  required
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 w-full rounded-full border bg-transparent px-5 text-[16px] text-bone outline-none transition-colors duration-200 placeholder:text-bone/30 focus:border-[color:var(--accent-ink)]"
                  style={{ borderColor: 'var(--line)' }}
                />
              </label>

              <label className="mt-3 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-0.5 size-5 shrink-0 cursor-pointer"
                  style={{ accentColor: flavour.accent }}
                />
                <span className="text-[12px] leading-relaxed" style={{ color: 'var(--muted)' }}>
                  I am 18 or over and agree to receive emails from NoseNic — see the{' '}
                  <a href="/privacy" className="underline underline-offset-2 hover:text-bone">
                    privacy policy
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'sending' || !consent}
                className="mt-4 inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-full text-[15px] font-medium text-ink transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: flavour.accent }}
              >
                {status === 'sending' ? 'Signing up…' : 'Sign up'}
              </button>

              {status === 'manual' && (
                <p className="mt-3 text-[13px] leading-relaxed">
                  We could not sign you up from here.{' '}
                  <a href={mailto} className="underline underline-offset-2">
                    Send us an email
                  </a>{' '}
                  and we will add you.
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </aside>
  )
}
