import { useEffect, useRef, useState } from 'react'
import DeviceMorph from './DeviceMorph'
import { FLAVOURS, packSrc, packWorldsFor } from '../data/nosenic'
import { prefersReducedMotion } from '../lib/motion'

interface Props {
  /** Pause the carousel while the hero is off-screen or the tab is hidden. */
  active: boolean
}

const COUNT = FLAVOURS.length
/** How long each flavour holds the centre before the next slides in. */
const HOLD_MS = 2800
/** After a swipe or tap, give the reader this long before autoplay resumes. */
const RESUME_MS = 7000

/** Signed distance from the centre, wrapped so the ring has no seam. */
const offsetOf = (index: number, current: number) => {
  let offset = index - current
  if (offset > COUNT / 2) offset -= COUNT
  if (offset < -COUNT / 2) offset += COUNT
  return offset
}

/**
 * Phone-only hero stage: the seven pouches on a 3D ring, one large in the
 * centre and its neighbours turning away to either side. It rotates on its own,
 * follows swipes and taps, and repaints the page accent with the flavour in
 * front. Each time a pack comes round again it wears its next visual world.
 */
export default function MobilePackStage({ active }: Props) {
  const [current, setCurrent] = useState(0)
  // How many times each pack has come to the front; picks its world.
  const [visits, setVisits] = useState(() => FLAVOURS.map((_, index) => index))
  const resumeAt = useRef(0)
  const touch = useRef<{ x: number; y: number } | null>(null)

  const currentRef = useRef(0)

  const show = (index: number, fromUser: boolean) => {
    const next = ((index % COUNT) + COUNT) % COUNT
    if (fromUser) resumeAt.current = Date.now() + RESUME_MS
    if (next === currentRef.current) return
    currentRef.current = next
    setCurrent(next)
    setVisits((counts) => counts.map((value, i) => (i === next ? value + 1 : value)))
  }

  useEffect(() => {
    if (!active || prefersReducedMotion()) return
    const id = window.setInterval(() => {
      if (Date.now() >= resumeAt.current) show(currentRef.current + 1, false)
    }, HOLD_MS)
    return () => window.clearInterval(id)
  }, [active])

  // The flavour in front owns the page colour while this stage is on screen.
  useEffect(() => {
    if (!active || !window.matchMedia('(max-width: 767.98px)').matches) return
    const flavour = FLAVOURS[current]
    const style = document.documentElement.style
    style.setProperty('--accent', flavour.accent)
    style.setProperty('--accent-ink', flavour.ink)
  }, [current, active])

  const flavour = FLAVOURS[current]
  const worlds = packWorldsFor(flavour.id)
  const world = worlds[visits[current] % worlds.length]

  return (
    <div className="flex min-h-0 flex-1 flex-col md:hidden" aria-roledescription="carousel">
      <div
        className="relative mt-3 min-h-[230px] flex-1 select-none"
        style={{ perspective: '1100px', touchAction: 'pan-y' }}
        onTouchStart={(event) => {
          const point = event.touches[0]
          touch.current = { x: point.clientX, y: point.clientY }
        }}
        onTouchEnd={(event) => {
          const start = touch.current
          touch.current = null
          if (!start) return
          const point = event.changedTouches[0]
          const dx = point.clientX - start.x
          const dy = point.clientY - start.y
          // Leave mostly-vertical drags to the page scroll.
          if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            show(current + (dx < 0 ? 1 : -1), true)
          }
        }}
      >
        {/* Pool of flavour light on the floor under the centre pack. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[8%] bottom-[-6%] h-[38%] rounded-[50%] blur-2xl transition-[background] duration-700"
          style={{
            background:
              'radial-gradient(closest-side, color-mix(in srgb, var(--accent) 55%, transparent), transparent)',
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            animation: prefersReducedMotion()
              ? undefined
              : 'float-idle 5s ease-in-out infinite',
          }}
        >
          {FLAVOURS.map((item, index) => {
            const offset = offsetOf(index, current)
            const distance = Math.abs(offset)
            const itemWorlds = packWorldsFor(item.id)
            const itemWorld = itemWorlds[visits[index] % itemWorlds.length]
            const isFront = offset === 0
            return (
              <button
                key={item.id}
                type="button"
                tabIndex={isFront || distance === 1 ? 0 : -1}
                aria-label={isFront ? `${item.name}, in front` : `Show ${item.name}`}
                aria-hidden={distance >= 3 ? true : undefined}
                onClick={() => (isFront ? undefined : show(index, true))}
                className="absolute bottom-0 left-1/2 aspect-[389/600] h-[92%] cursor-pointer"
                style={{
                  zIndex: 10 - distance,
                  opacity: distance >= 3 ? 0 : 1 - distance * 0.22,
                  pointerEvents: distance >= 3 ? 'none' : 'auto',
                  transform: `translateX(-50%) translateX(${offset * 58}%) translateZ(${
                    -distance * 140
                  }px) rotateY(${offset * -34}deg) scale(${1 - Math.min(distance, 3) * 0.14})`,
                  filter: `brightness(${1 - distance * 0.22})`,
                  transition:
                    'transform 850ms cubic-bezier(.22,.9,.24,1), opacity 850ms ease, filter 850ms ease',
                }}
              >
                <DeviceMorph
                  flavour={item.id}
                  world={itemWorld.id}
                  alt={`NoseNic ${item.name} retail pouch, ${itemWorld.name} series`}
                  loading={distance <= 1 ? 'eager' : 'lazy'}
                  srcFor={packSrc}
                  width={389}
                  height={600}
                  tone="saturate(1.4) contrast(1.1) brightness(1.05)"
                  className="h-full w-full"
                />
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 text-center">
        <p
          className="display text-[clamp(26px,8vw,36px)] transition-colors duration-700"
          style={{ color: 'var(--accent-ink)' }}
        >
          {flavour.name}
        </p>
        <p className="eyebrow mt-2 text-[11px]" style={{ color: 'var(--muted)' }}>
          {flavour.character.join(' / ')} · {world.name}
        </p>
      </div>

      <div className="mt-2 flex justify-center" role="tablist" aria-label="Flavours">
        {FLAVOURS.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === current}
            aria-label={item.name}
            onClick={() => show(index, true)}
            className="flex h-11 w-9 cursor-pointer items-center justify-center"
          >
            <span
              className="block h-1.5 rounded-full transition-all duration-500"
              style={{
                width: index === current ? 22 : 6,
                background: index === current ? item.accent : 'var(--line)',
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
