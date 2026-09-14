import { useRef, useState } from 'react'
import DeviceMorph from './DeviceMorph'
import { FLAVOURS, WORLDS } from '../data/nosenic'
import { ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { useInView } from '../hooks/useInView'
import { useWorldCycle } from '../hooks/useWorldCycle'

export default function FlavourJourney() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [bump, setBump] = useState<number[]>(() => FLAVOURS.map(() => 0))
  const activeRef = useRef(0)
  const inView = useInView(root)
  const worldIndices = useWorldCycle(FLAVOURS.length, WORLDS.length, 1400, inView)

  const paint = (index: number) => {
    activeRef.current = index
    const flavour = FLAVOURS[index]
    const style = document.documentElement.style
    style.setProperty('--accent', flavour.accent)
    style.setProperty('--accent-ink', flavour.ink)
  }

  useGSAP(
    () => {
      // The range owns the page accent from the moment it comes into view.
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 70%',
        onEnter: () => paint(activeRef.current),
        onEnterBack: () => paint(activeRef.current),
      })

      const media = gsap.matchMedia()

      // Desktop: pin the section and drive the track sideways with the scroll.
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const element = track.current
        const section = root.current
        if (!element || !section) return

        const distance = () => element.scrollWidth - window.innerWidth

        gsap.to(element, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.55,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.round(self.progress * (FLAVOURS.length - 1))
              setActive((current) => {
                if (current !== index) paint(index)
                return index
              })
            },
          },
        })
      })

      // Small screens scroll the panels natively, so just follow the snap point.
      media.add('(max-width: 1023.98px)', () => {
        const element = track.current
        if (!element) return

        const onScroll = () => {
          const index = Math.round(
            (element.scrollLeft / (element.scrollWidth - element.clientWidth || 1)) *
              (FLAVOURS.length - 1),
          )
          setActive((current) => {
            if (current !== index) paint(index)
            return index
          })
        }

        element.addEventListener('scroll', onScroll, { passive: true })
        return () => element.removeEventListener('scroll', onScroll)
      })
    },
    { scope: root },
  )

  const step = (direction: 1 | -1) => {
    const element = track.current
    if (!element) return
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <section
      ref={root}
      id="flavours"
      /* Phones get a natural-height swipe carousel; the pinned full-screen
         track is for wide screens only. */
      className="relative pb-16 pt-24 lg:h-svh lg:overflow-hidden lg:p-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 55% at 78% 55%, color-mix(in srgb, var(--accent) 30%, transparent) 0%, transparent 68%)',
        }}
      />

      <header className="z-20 flex items-baseline justify-between px-5 sm:px-8 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-0 lg:px-10 lg:pt-24">
        <div>
          <p className="eyebrow" style={{ color: 'var(--accent-ink)' }}>
            03 — The range
          </p>
          <h2 className="display mt-3 text-[clamp(30px,4.4vw,60px)]">Choose your flavour.</h2>
        </div>
        <p className="eyebrow hidden lg:block" style={{ color: 'var(--muted)' }}>
          Scroll &rarr;
        </p>
      </header>

      <div
        ref={track}
        className="journey-track flex lg:h-full"
        style={{ scrollbarWidth: 'none' }}
        aria-label="Flavours"
      >
        {FLAVOURS.map((flavour, index) => {
          const world = WORLDS[(worldIndices[index] + bump[index]) % WORLDS.length]
          return (
            <article
              key={flavour.id}
              aria-label={`${index + 1} of ${FLAVOURS.length}: ${flavour.name}`}
              className="flex w-screen shrink-0 snap-center flex-col gap-8 px-5 pt-10 sm:px-8 lg:h-full lg:flex-row lg:items-center lg:justify-center lg:gap-16 lg:px-10 lg:pb-16 lg:pt-40"
            >
              <div className="order-2 lg:order-1 lg:max-w-[46ch] lg:flex-1">
                <p
                  className="display text-[clamp(40px,7vw,96px)] leading-none"
                  style={{ color: 'var(--accent-ink)', opacity: 0.28 }}
                >
                  0{index + 1}
                </p>
                <h3 className="display mt-2 text-[clamp(38px,6.4vw,88px)]">{flavour.name}</h3>

                <ul className="mt-5 flex flex-wrap gap-x-2.5 gap-y-2">
                  {flavour.character.map((word) => (
                    <li
                      key={word}
                      className="eyebrow rounded-full px-3.5 py-2 text-[11px] text-ink"
                      style={{ background: 'var(--accent)' }}
                    >
                      {word}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 max-w-[46ch] text-[clamp(16px,1.5vw,20px)] leading-relaxed">
                  {flavour.short}
                </p>

                <p
                  className="eyebrow mt-5 text-[11px] leading-loose"
                  style={{ color: 'var(--muted)' }}
                >
                  {flavour.mood.join(' / ')}
                </p>
              </div>

              <div className="order-1 flex flex-col items-center lg:order-2 lg:flex-1">
                <button
                  type="button"
                  onClick={() =>
                    setBump((prev) => prev.map((value, i) => (i === index ? value + 1 : value)))
                  }
                  aria-label={`${flavour.name} — show the next visual world`}
                  className="block cursor-pointer transition-transform duration-300 hover:-translate-y-1.5 active:scale-[0.97]"
                >
                  <DeviceMorph
                    flavour={flavour.id}
                    world={world.id}
                    alt={`NoseNic ${flavour.name} nasal inhaler, ${world.name} series`}
                    className="aspect-[374/670] h-[clamp(210px,36vh,300px)] lg:h-[clamp(180px,42vh,440px)]"
                  />
                </button>
                <span className="eyebrow mt-4 text-center text-[11px]">
                  <span className="block" style={{ color: 'var(--accent-ink)' }}>
                    {world.name} series
                  </span>
                  <span className="mt-1 block" style={{ color: 'var(--muted)' }}>
                    Tap to change world
                  </span>
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <footer className="z-20 mt-10 flex items-center gap-3 px-5 sm:px-8 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:gap-4 lg:px-10 lg:pb-6">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={active === 0}
          aria-label="Previous flavour"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-opacity duration-200 disabled:opacity-30 lg:hidden"
          style={{ borderColor: 'var(--line)' }}
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <span className="eyebrow text-[11px] tabular-nums" style={{ color: 'var(--muted)' }}>
          0{active + 1} / 07
        </span>
        <span className="h-px flex-1" style={{ background: 'var(--line)' }}>
          <span
            className="block h-px origin-left transition-transform duration-500"
            style={{
              background: 'var(--accent)',
              transform: `scaleX(${(active + 1) / FLAVOURS.length})`,
            }}
          />
        </span>
        <span
          className="eyebrow hidden text-[11px] lg:inline"
          style={{ color: 'var(--muted)' }}
        >
          Keep scrolling
        </span>
        <button
          type="button"
          onClick={() => step(1)}
          disabled={active === FLAVOURS.length - 1}
          aria-label="Next flavour"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-opacity duration-200 disabled:opacity-30 lg:hidden"
          style={{ borderColor: 'var(--line)' }}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </footer>
    </section>
  )
}
