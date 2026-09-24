import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'

const STORAGE_KEY = 'nosenic:age-confirmed'

/** localStorage throws in some privacy modes; a gate must not break on that. */
const remembered = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'yes'
  } catch {
    return false
  }
}

const remember = () => {
  try {
    window.localStorage.setItem(STORAGE_KEY, 'yes')
  } catch {
    /* Nothing to do: the gate simply asks again next time. */
  }
}

/**
 * Age check shown over the site on a first visit. "Yes" is remembered, so it
 * asks once per browser; "No" leaves the reader on a closed door.
 */
export default function AgeGate() {
  const [open, setOpen] = useState(() => !remembered())
  const [refused, setRefused] = useState(false)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('scroll-locked')
    confirmRef.current?.focus()
    return () => document.documentElement.classList.remove('scroll-locked')
  }, [open])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/95 p-3 backdrop-blur-xl sm:p-6"
    >
      <div
        className="w-full max-w-4xl rounded-lg border p-6 sm:p-10 lg:p-14"
        style={{ borderColor: 'var(--accent-ink)' }}
      >
        <div className="flex items-start justify-between gap-6">
          <Logo title="NoseNic" className="block h-[26px] w-auto text-bone sm:h-[34px]" />
          <span className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
            18+ only
          </span>
        </div>

        {refused ? (
          <>
            <h1
              id="age-gate-title"
              className="display mt-12 text-[clamp(30px,5.4vw,64px)] sm:mt-16"
            >
              Sorry — come back at 18.
            </h1>
            <p
              className="mt-6 max-w-[46ch] text-[clamp(15px,1.7vw,19px)] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              This site is for adults aged 18 or over only. You can close this tab now.
            </p>
            <button
              type="button"
              onClick={() => setRefused(false)}
              className="mt-8 inline-flex h-12 cursor-pointer items-center rounded-full border px-6 text-[15px] transition-colors duration-200 hover:bg-bone hover:text-ink"
              style={{ borderColor: 'var(--line)' }}
            >
              Back
            </button>
          </>
        ) : (
          <>
            <h1
              id="age-gate-title"
              className="display mt-12 text-[clamp(34px,6.6vw,84px)] sm:mt-16"
            >
              Are you 18 or older?
            </h1>

            <p
              className="mt-7 max-w-[54ch] text-[clamp(15px,1.7vw,19px)] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              This website contains nicotine product information and is intended only for adults
              aged 18 or over.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                ref={confirmRef}
                type="button"
                onClick={() => {
                  remember()
                  setOpen(false)
                }}
                className="inline-flex h-14 cursor-pointer items-center justify-center rounded-full px-10 text-[16px] font-medium text-ink transition-opacity duration-200 hover:opacity-90"
                style={{ background: 'var(--accent)' }}
              >
                Yes, I am 18+
              </button>
              <button
                type="button"
                onClick={() => setRefused(true)}
                className="inline-flex h-14 cursor-pointer items-center justify-center rounded-full border px-10 text-[16px] transition-colors duration-200 hover:bg-bone hover:text-ink"
                style={{ borderColor: 'var(--line)' }}
              >
                No, I am under 18
              </button>
            </div>

            <p className="mt-9 text-[13px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Nicotine is an addictive chemical. Please do not enter if you are under 18.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
