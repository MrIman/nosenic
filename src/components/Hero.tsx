import { useRef } from 'react'
import DeviceMorph from './DeviceMorph'
import WindLights from './WindLights'
import { FLAVOURS, WORLDS } from '../data/nosenic'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/motion'
import { useInView } from '../hooks/useInView'
import { useWorldCycle } from '../hooks/useWorldCycle'

const TICKER = ['7 FLAVOURS', '10 VISUAL WORLDS', 'ONE BRAND', 'SMOKE-FREE', 'ON-THE-GO']

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  const inView = useInView(root)
  const worldIndices = useWorldCycle(FLAVOURS.length, WORLDS.length, 460, inView)

  useGSAP(
    () => {
      const reduced = prefersReducedMotion()
      if (reduced) {
        gsap.set('[data-hero-line] span, [data-hero-meta], [data-hero-device]', {
          opacity: 1,
          y: 0,
          yPercent: 0,
        })
        return
      }

      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })

      intro
        .from('[data-hero-line] span', {
          yPercent: 108,
          duration: 1.15,
          stagger: 0.09,
        })
        .from(
          '[data-hero-device]',
          {
            yPercent: 60,
            opacity: 0,
            duration: 1.1,
            stagger: { each: 0.06, from: 'center' },
          },
          '-=0.85',
        )
        .from('[data-hero-meta]', { opacity: 0, y: 18, duration: 0.8, stagger: 0.08 }, '-=0.75')

      // Pointer parallax: the row leans away from the cursor, outer devices most.
      const devices = gsap.utils.toArray<HTMLElement>('[data-hero-device]')
      const setters = devices.map((device, index) => {
        const depth = 1 + Math.abs(index - (devices.length - 1) / 2) * 0.55
        return {
          x: gsap.quickTo(device, 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(device, 'y', { duration: 0.9, ease: 'power3.out' }),
          depth,
        }
      })

      const onMove = (event: PointerEvent) => {
        const dx = event.clientX / window.innerWidth - 0.5
        const dy = event.clientY / window.innerHeight - 0.5
        setters.forEach(({ x, y, depth }) => {
          x(dx * 26 * depth)
          y(dy * 14 * depth)
        })
      }

      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: root },
  )

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate flex h-svh min-h-[600px] flex-col overflow-hidden pt-20 sm:pt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-18%] top-[10%] -z-10 opacity-60 transition-[background] duration-700"
        style={{
          background:
            'radial-gradient(58% 46% at 50% 78%, color-mix(in srgb, var(--accent) 42%, transparent) 0%, transparent 70%)',
        }}
      />

      <WindLights active={inView} />

      <div className="flex flex-1 flex-col justify-between px-5 sm:px-8 lg:px-10">
        <div>
          <div className="relative mt-6 sm:mt-8">
            <h1 className="display text-[clamp(64px,min(19vw,38vh),300px)]">
              {['NoseNic'].map((word) => (
                <span
                  key={word}
                  data-hero-line
                  className="block overflow-hidden"
                  /* Line-height 0.82 clips ascenders, so widen the mask without moving the line. */
                  style={{
                    padding: '0.1em 0 0.14em',
                    margin: '-0.1em 0 -0.14em',
                  }}
                >
                  <span className="block">{word}</span>
                </span>
              ))}
            </h1>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
              <p
                data-hero-meta
                className="display text-[clamp(24px,3.4vw,48px)]"
                style={{ color: 'var(--accent-ink)' }}
              >
                New nicotine trend
              </p>
              <p
                data-hero-meta
                className="hidden max-w-[38ch] text-[15px] leading-relaxed sm:block"
                style={{ color: 'var(--muted)' }}
              >
                Seven flavours. Ten visual worlds. One brand — every inhaler below is
                re-dressing itself as you watch.
              </p>
            </div>
          </div>
        </div>

        <div
          ref={rowRef}
          className="relative flex items-end justify-center gap-[3px] sm:gap-3 lg:gap-5"
        >
          {FLAVOURS.map((flavour, index) => {
            const world = WORLDS[worldIndices[index] % WORLDS.length]
            const lift = Math.abs(index - 3)
            return (
              <div
                key={flavour.id}
                data-hero-device
                className="flex shrink-0 flex-col items-center"
                style={{
                  marginBottom: `${(3 - lift) * 8}px`,
                  willChange: 'transform',
                }}
              >
                <DeviceMorph
                  flavour={flavour.id}
                  world={world.id}
                  alt={`NoseNic ${flavour.name} nasal inhaler, ${world.name} series`}
                  loading="eager"
                  /* Sized off the shorter axis so seven of them always fit the row. */
                  className="aspect-[374/670] h-[clamp(70px,min(22vh,20.5vw),190px)]"
                />
                <span className="eyebrow mt-3 hidden text-center text-[9px] leading-[1.5] lg:block">
                  <span className="block" style={{ color: 'var(--muted)' }}>
                    {flavour.name}
                  </span>
                  <span className="block" style={{ color: 'var(--accent-ink)' }}>
                    {world.name}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div
        className="marquee overflow-hidden border-y py-2.5"
        style={{ borderColor: 'var(--line)' }}
      >
        <div
          className="marquee-track"
          style={{ '--marquee-duration': '38s' } as React.CSSProperties}
        >
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {TICKER.map((item) => (
                <span key={item} className="flex items-center">
                  <span className="display px-6 text-[clamp(15px,1.6vw,22px)]">{item}</span>
                  <span aria-hidden="true" style={{ color: 'var(--accent-ink)' }}>
                    &#10035;
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
