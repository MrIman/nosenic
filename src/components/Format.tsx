import { useRef } from 'react'
import { FORMAT_TAGS, STEPS, deviceSrc } from '../data/nosenic'
import { gsap, prefersReducedMotion, revealIn, useGSAP } from '../lib/motion'

export default function Format() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (root.current) revealIn(root.current)
      if (prefersReducedMotion()) return

      // The inhaler drifts and turns a little as the section passes through.
      gsap.to('[data-format-device]', {
        yPercent: -14,
        rotate: 7,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="format" className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(46% 40% at 74% 40%, color-mix(in srgb, var(--accent) 20%, transparent) 0%, transparent 70%)',
        }}
      />

      <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div>
          <p
            data-reveal
            className="eyebrow will-reveal translate-y-6"
            style={{ color: 'var(--accent-ink)' }}
          >
            05 — The object
          </p>
          <h2
            data-reveal
            className="display will-reveal mt-4 translate-y-6 text-[clamp(34px,5.6vw,80px)]"
          >
            Small format.
            <br />
            Big sensory
            <br />
            experience.
          </h2>

          <p
            data-reveal
            className="will-reveal mt-8 max-w-[46ch] translate-y-6 text-[clamp(16px,1.7vw,21px)] leading-relaxed"
          >
            A compact nasal inhaler designed to fit naturally into everyday moments. Easy to
            carry. Easy to use. Ready when the moment calls for a different flavour.
          </p>

          <ul data-reveal className="will-reveal mt-8 flex translate-y-6 flex-wrap gap-2">
            {FORMAT_TAGS.map((tag) => (
              <li
                key={tag}
                className="eyebrow rounded-full border px-4 py-2 text-[10px]"
                style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            data-format-device
            src={deviceSrc('energy', 'double-mint')}
            alt="NoseNic nasal inhaler, Energy series"
            loading="lazy"
            decoding="async"
            width={374}
            height={670}
            className="h-[clamp(240px,44vh,480px)] w-auto"
            style={{ filter: 'drop-shadow(0 40px 60px rgb(0 0 0 / 0.6))' }}
          />
        </div>
      </div>

      <div className="mt-24 sm:mt-32">
        <div className="rule mb-10" />
        <h3
          data-reveal
          className="eyebrow will-reveal translate-y-6"
          style={{ color: 'var(--accent-ink)' }}
        >
          How to use
        </h3>

        <ol className="mt-8 grid gap-px sm:grid-cols-3" style={{ background: 'var(--line)' }}>
          {STEPS.map((step) => (
            <li
              key={step.no}
              data-reveal
              className="will-reveal translate-y-6 bg-ink px-6 py-10 sm:px-8 sm:py-12"
            >
              <p
                className="display text-[clamp(44px,6vw,86px)] leading-none"
                style={{ color: 'var(--accent-ink)' }}
              >
                {step.no}
              </p>
              <p className="display mt-5 text-[clamp(20px,2.2vw,30px)]">{step.name}</p>
              <p
                className="mt-3 max-w-[30ch] text-[16px] leading-relaxed"
                style={{ color: 'var(--muted)' }}
              >
                {step.line}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
