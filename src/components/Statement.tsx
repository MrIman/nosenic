import { useRef } from 'react'
import { revealIn, useGSAP } from '../lib/motion'

/**
 * A quiet close after the loud worlds section: one headline, one line of copy.
 * The logo and contact live in the footer directly below, so none here.
 */
export default function Statement() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (root.current) revealIn(root.current)
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative px-5 pb-20 pt-24 sm:px-8 sm:pb-28 sm:pt-32 lg:px-10"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p
          data-reveal
          className="eyebrow will-reveal translate-y-6"
          style={{ color: 'var(--muted)' }}
        >
          Brand statement
        </p>

        <h2
          data-reveal
          className="display will-reveal mt-6 translate-y-6 text-[clamp(40px,7vw,104px)]"
        >
          Breaking flavour.
        </h2>

        <p
          data-reveal
          className="will-reveal mx-auto mt-8 max-w-[44ch] translate-y-6 text-[clamp(16px,1.6vw,19px)] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Discover a new sensory nicotine format built around flavour, variety and everyday
          moments.
        </p>

        <p
          data-reveal
          className="eyebrow will-reveal mt-8 flex translate-y-6 flex-wrap justify-center gap-x-3 gap-y-1"
          style={{ color: 'var(--accent-ink)' }}
        >
          {/* Wrap between the phrases, never inside one. */}
          {['7 flavours', '10 visual worlds', 'One brand'].map((phrase, index, all) => (
            <span key={phrase} className="whitespace-nowrap">
              {phrase}
              {/* Separator trails its phrase, so a wrapped line never starts with one. */}
              {index < all.length - 1 && (
                <span aria-hidden="true" className="ml-3">
                  ·
                </span>
              )}
            </span>
          ))}
        </p>
      </div>
    </section>
  )
}
