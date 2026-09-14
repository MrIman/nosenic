import { useRef } from 'react'
import { revealIn, useGSAP } from '../lib/motion'

export default function Statement() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (root.current) revealIn(root.current)
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative px-5 pb-20 pt-24 sm:px-8 sm:pt-32 lg:px-10">
      <div className="rule mb-14" />

      <p
        data-reveal
        className="eyebrow will-reveal translate-y-6"
        style={{ color: 'var(--accent-ink)' }}
      >
        08 — Brand statement
      </p>

      <h2
        data-reveal
        className="display will-reveal mt-6 translate-y-6 text-[clamp(46px,13vw,210px)]"
      >
        Breaking
        <br />
        flavour.
      </h2>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <p
          data-reveal
          className="will-reveal max-w-[46ch] translate-y-6 text-[clamp(16px,1.8vw,22px)] leading-relaxed"
        >
          Discover a new sensory nicotine format built around flavour, variety and everyday
          moments.
        </p>
        <p
          data-reveal
          className="display will-reveal translate-y-6 text-[clamp(20px,2.4vw,34px)] leading-[1.05] lg:text-right"
          style={{ color: 'var(--accent-ink)' }}
        >
          7 flavours.
          <br />
          10 visual worlds.
          <br />
          One brand.
        </p>
      </div>
    </section>
  )
}
