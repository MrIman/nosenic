import { useRef } from 'react'
import { FLAVOURS, WORLDS, deviceSrc } from '../data/nosenic'
import { revealIn, useGSAP } from '../lib/motion'

export default function Worlds() {
  const root = useRef<HTMLElement>(null)
  const pouches = WORLDS.filter((world) => world.pouch)

  useGSAP(
    () => {
      if (root.current) revealIn(root.current)
    },
    { scope: root },
  )

  return (
    <section ref={root} id="worlds" className="relative py-24 sm:py-32">
      <div className="px-5 sm:px-8 lg:px-10">
        <div className="rule mb-12 sm:mb-16" />
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div data-reveal className="will-reveal translate-y-6">
            <p className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
              07 — Visual worlds
            </p>
            <h2 className="display mt-4 text-[clamp(34px,6vw,86px)]">
              10 visual worlds.
              <br />
              One brand.
            </h2>
          </div>
          <div data-reveal className="will-reveal max-w-[42ch] translate-y-6">
            <p className="text-[clamp(16px,1.7vw,21px)] leading-relaxed">
              NoseNic transforms flavour into visual experience.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed" style={{ color: 'var(--muted)' }}>
              Every series creates a different world. Every world has its own personality. Every
              product remains unmistakably NoseNic.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14 sm:mt-20">
        {WORLDS.map((world, index) => (
          <div
            key={world.id}
            className="marquee relative overflow-hidden border-t"
            style={{ borderColor: 'var(--line)' }}
          >
            <div
              className="marquee-track items-center py-4"
              style={
                {
                  '--marquee-duration': `${52 + index * 5}s`,
                  '--marquee-direction': index % 2 ? 'reverse' : 'normal',
                } as React.CSSProperties
              }
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
                  <span className="flex items-baseline gap-3 pl-8 pr-6 sm:pl-14">
                    <span className="display text-[clamp(20px,2.4vw,34px)] whitespace-nowrap">
                      {world.name}
                    </span>
                    <span
                      className="eyebrow text-[9px] whitespace-nowrap"
                      style={{ color: 'var(--muted)' }}
                    >
                      {world.note}
                    </span>
                  </span>
                  {FLAVOURS.map((flavour) => (
                    <img
                      key={flavour.id}
                      src={deviceSrc(world.id, flavour.id)}
                      alt={copy === 0 ? `NoseNic ${flavour.name}, ${world.name} series` : ''}
                      loading="lazy"
                      decoding="async"
                      width={374}
                      height={670}
                      className="mx-3 h-[68px] w-auto sm:h-[92px]"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="rule" />
      </div>

      <div className="mt-20 px-5 sm:mt-24 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h3
            data-reveal
            className="display will-reveal translate-y-6 text-[clamp(24px,3.2vw,44px)]"
          >
            Same brand, on the shelf.
          </h3>
          <p
            data-reveal
            className="eyebrow will-reveal translate-y-6 text-[10px]"
            style={{ color: 'var(--muted)' }}
          >
            Retail pouches &mdash; drag &rarr;
          </p>
        </div>
      </div>

      <ul
        className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:gap-6 sm:px-8 lg:px-10"
        style={{ scrollbarWidth: 'none' }}
      >
        {pouches.map((world) => (
          <li key={world.id} className="w-[68vw] shrink-0 snap-center sm:w-[38vw] lg:w-[24vw]">
            <div className="overflow-hidden rounded-sm bg-bone">
              <img
                src={`/pouches/${world.id}.webp`}
                alt={`NoseNic retail pouch, ${world.name} series`}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
            </div>
            <p className="display mt-4 text-[clamp(16px,1.7vw,22px)]">{world.name}</p>
            <p className="eyebrow mt-1 text-[9px]" style={{ color: 'var(--muted)' }}>
              {world.note}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
