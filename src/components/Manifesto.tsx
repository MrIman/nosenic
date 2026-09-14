import { useRef } from 'react'
import { PRODUCT_TAGS } from '../data/nosenic'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'

const STATEMENT =
  'NoseNic is a sensory nicotine nasal inhaler created around distinctive flavour experiences, a discreet format and everyday convenience.'

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-word]', { opacity: 1 })
        return
      }

      gsap.to('[data-word]', {
        opacity: 1,
        ease: 'none',
        stagger: 0.4,
        scrollTrigger: {
          trigger: '[data-statement]',
          start: 'top 78%',
          end: 'bottom 58%',
          scrub: 0.4,
        },
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="format-intro"
      className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
    >
      <div className="rule mb-12 sm:mb-16" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-16">
        <div>
          <p className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
            02 — The format
          </p>
          <h2 className="display mt-5 text-[clamp(34px,5.2vw,74px)]">
            A new sensory
            <br />
            nicotine format.
          </h2>
        </div>

        <div>
          <p
            data-statement
            className="text-[clamp(21px,2.7vw,38px)] leading-[1.28] tracking-[-0.015em]"
          >
            {STATEMENT.split(' ').map((word, index) => (
              <span key={`${word}-${index}`} data-word className="opacity-[0.16]">
                {word}{' '}
              </span>
            ))}
          </p>

          <ul className="mt-10 flex flex-wrap gap-2">
            {PRODUCT_TAGS.map((tag) => (
              <li
                key={tag}
                className="eyebrow rounded-full border px-4 py-2 text-[10px]"
                style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
              >
                {tag}
              </li>
            ))}
          </ul>

          <p
            className="mt-10 max-w-[52ch] text-[16px] leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            A different way to experience flavour — built for people who enjoy distinctive
            flavour experiences in a discreet, smoke-free format.
          </p>
        </div>
      </div>
    </section>
  )
}
