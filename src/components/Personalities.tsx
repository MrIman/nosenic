import { useEffect, useRef, useState } from 'react'
import { FLAVOURS, deviceSrc } from '../data/nosenic'
import { revealIn, useGSAP } from '../lib/motion'

export default function Personalities() {
  const root = useRef<HTMLElement>(null)
  const [hovered, setHovered] = useState<number | null>(null)
  // Row crossing the middle of the screen; hover takes over while the pointer is on the list.
  const [centred, setCentred] = useState<number | null>(null)
  const lit = hovered ?? centred

  useGSAP(
    () => {
      if (root.current) revealIn(root.current)
    },
    { scope: root },
  )

  // Light each row as it scrolls through the middle of the screen.
  useEffect(() => {
    const section = root.current
    if (!section) return
    const rows = [...section.querySelectorAll<HTMLElement>('[data-row]')]

    const update = () => {
      const middle = window.innerHeight / 2
      const index = rows.findIndex((row) => {
        const { top, bottom } = row.getBoundingClientRect()
        return top <= middle && bottom > middle
      })
      // Between the heading and the list (or past it) nothing is lit.
      setCentred(index === -1 ? null : index)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <section
      ref={root}
      id="personalities"
      className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-10"
    >
      <div className="rule mb-12 sm:mb-16" />

      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
        <div data-reveal className="will-reveal translate-y-6">
          <p className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
            04 — Personalities
          </p>
          <h2 className="display mt-4 text-[clamp(34px,5.6vw,80px)]">
            7 flavours.
            <br />7 personalities.
          </h2>
        </div>
        <p
          data-reveal
          className="will-reveal max-w-[38ch] translate-y-6 text-[16px] leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Every aroma gets its own character, its own three words and its own visual direction.
          Same brand, seven temperaments.
        </p>
      </div>

      <ul>
        {FLAVOURS.map((flavour, index) => {
          const isOn = lit === index
          return (
            <li
              key={flavour.id}
              data-reveal
              data-row={index}
              className="will-reveal translate-y-6"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <article
                className="group relative grid cursor-default items-start gap-x-8 gap-y-4 border-t py-7 transition-colors duration-300 sm:py-9 lg:grid-cols-[6ch_minmax(0,1.05fr)_minmax(0,1.4fr)_10ch]"
                style={{
                  borderColor: isOn ? flavour.accent : 'var(--line)',
                  background: isOn
                    ? `linear-gradient(90deg, color-mix(in srgb, ${flavour.accent} 13%, transparent), transparent 62%)`
                    : 'transparent',
                }}
              >
                <p
                  className="display text-[clamp(22px,2.4vw,34px)] leading-none transition-colors duration-300"
                  style={{ color: isOn ? flavour.ink : 'var(--muted)' }}
                >
                  0{index + 1}
                </p>

                <div>
                  <h3
                    className="display text-[clamp(28px,3.6vw,52px)] leading-[0.95] transition-colors duration-300"
                    style={{ color: isOn ? flavour.ink : undefined }}
                  >
                    {flavour.name}
                  </h3>
                  <p className="eyebrow mt-3 text-[11px]" style={{ color: 'var(--muted)' }}>
                    {flavour.character.join(' / ')}
                  </p>
                </div>

                <p className="max-w-[54ch] text-[16px] leading-relaxed">
                  {flavour.description}
                </p>

                <img
                  src={deviceSrc('minimal', flavour.id)}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  width={374}
                  height={670}
                  className="absolute right-0 top-7 h-16 w-auto transition-all duration-500 sm:top-9 lg:static lg:h-24 lg:justify-self-end"
                  style={{
                    opacity: isOn ? 1 : 0.32,
                    transform: isOn ? 'translateY(-6px) rotate(-3deg)' : 'none',
                    filter: isOn ? 'drop-shadow(0 18px 26px rgb(0 0 0 / 0.6))' : 'none',
                  }}
                />
              </article>
            </li>
          )
        })}
      </ul>
      <div className="rule" />
    </section>
  )
}
