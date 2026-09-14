import { useRef } from 'react'
import { MOMENTS } from '../data/nosenic'
import { useInView } from '../hooks/useInView'
import { revealIn, useGSAP } from '../lib/motion'

export default function Moments() {
  const root = useRef<HTMLElement>(null)
  const band = useRef<HTMLDivElement>(null)
  // autoplay would fetch the film on page load, so hold the src back until the
  // band is nearly in view.
  const near = useInView(band, '600px')
  const source = near
    ? window.matchMedia('(max-width: 767px)').matches
      ? '/video/nosenic-sport-sm.mp4'
      : '/video/nosenic-sport.mp4'
    : undefined

  useGSAP(
    () => {
      if (root.current) revealIn(root.current)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="moments" className="relative">
      <div
        ref={band}
        className="relative isolate flex min-h-svh items-end overflow-hidden lg:min-h-[112svh]"
      >
        <video
          /* Framed off the top third: that is where the face and the product sit. */
          className="absolute inset-0 -z-10 h-full w-full object-cover [object-position:50%_28%]"
          src={source}
          poster="/video/nosenic-sport-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-label="NoseNic Sport film"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          /* Just enough to keep the fixed nav legible; the copy carries its own
             scrim, so the middle of the frame stays pure film. */
          style={{
            background:
              'linear-gradient(180deg, rgb(8 8 10 / 0.58) 0%, rgb(8 8 10 / 0.06) 18%, rgb(8 8 10 / 0) 55%)',
          }}
        />

        <div
          className="w-full px-5 pb-14 pt-48 sm:px-8 lg:px-10"
          style={{
            background:
              'linear-gradient(180deg, rgb(8 8 10 / 0) 0%, rgb(8 8 10 / 0.62) 42%, rgb(8 8 10 / 0.97) 100%)',
          }}
        >
          <p
            data-reveal
            className="eyebrow will-reveal translate-y-6"
            style={{ color: 'var(--accent-ink)' }}
          >
            06 — Moments
          </p>
          <h2
            data-reveal
            className="display will-reveal mt-4 translate-y-6 text-[clamp(34px,6.4vw,92px)]"
          >
            Find your moment.
          </h2>
          <p
            data-reveal
            className="will-reveal mt-6 max-w-[44ch] translate-y-6 text-[clamp(15px,1.6vw,19px)] leading-relaxed"
          >
            Different moments. Different moods. Different flavours — from bright citrus and
            juicy berries to cool mint, spicy cinnamon and icy cola.
          </p>
        </div>
      </div>

      <ul
        className="grid gap-px sm:grid-cols-2 lg:grid-cols-3"
        style={{ background: 'var(--line)' }}
      >
        {MOMENTS.map((moment, index) => (
          <li
            key={moment.id}
            data-reveal
            className="group will-reveal translate-y-6 bg-ink px-6 py-10 transition-colors duration-300 hover:bg-ink-soft sm:px-8 sm:py-12"
          >
            <p className="eyebrow text-[10px]" style={{ color: 'var(--muted)' }}>
              0{index + 1}
            </p>
            <h3 className="display mt-4 text-[clamp(26px,3vw,42px)] transition-colors duration-300 group-hover:[color:var(--accent-ink)]">
              {moment.name}
            </h3>
            <p
              className="mt-3 max-w-[26ch] text-[16px] leading-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              {moment.line}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
