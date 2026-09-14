import { useEffect, useRef } from 'react'
import { FLAVOURS } from '../data/nosenic'
import { prefersReducedMotion } from '../lib/motion'

interface Props {
  /** Stop simulating while the hero is off-screen. */
  active: boolean
}

interface Ribbon {
  /** Recent positions, head last. Drawn as one smooth curve. */
  xs: number[]
  ys: number[]
  age: number
  life: number
  width: number
  speed: number
  /** Phase of the ribbon's own flutter across the wind. */
  phase: number
  /** Small lead or lag on the shared palette, so a gust is not one flat colour. */
  hueShift: number
}

const PALETTE = FLAVOURS.map((flavour) => hexToRgb(flavour.ink))
/** How long each flavour colour leads the wind before handing over. */
const COLOUR_MS = 3400
/** Frames simulated before the first paint, so the hero opens mid-gust. */
const WARM_UP = 90
const TRAIL = 70

function hexToRgb(hex: string): [number, number, number] {
  const value = parseInt(hex.slice(1), 16)
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255]
}

function paletteAt(position: number): [number, number, number] {
  const count = PALETTE.length
  const wrapped = ((position % count) + count) % count
  const index = Math.floor(wrapped)
  const mix = wrapped - index
  // Smoothstep, so each colour holds for a beat before the next blends in.
  const eased = mix * mix * (3 - 2 * mix)
  const from = PALETTE[index]
  const to = PALETTE[(index + 1) % count]
  return [
    Math.round(from[0] + (to[0] - from[0]) * eased),
    Math.round(from[1] + (to[1] - from[1]) * eased),
    Math.round(from[2] + (to[2] - from[2]) * eased),
  ]
}

/** Layered sines at low frequency: long sweeping curves that drift over time. */
function windAngle(x: number, y: number, t: number) {
  return (
    -0.14 +
    Math.sin(x * 0.0013 + t * 0.00023) * 0.28 +
    Math.sin(y * 0.0019 - t * 0.00017) * 0.2 +
    Math.sin((x + y * 0.6) * 0.0008 + t * 0.00011) * 0.16
  )
}

/**
 * Ribbons of coloured light carried across the hero by a flowing wind. The
 * whole gust shifts through the seven flavour colours; the cursor stirs it.
 */
export default function WindLights({ active }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointer = useRef({ x: -9999, y: -9999, vx: 0, vy: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context || prefersReducedMotion()) return

    let width = 0
    let height = 0
    let ribbons: Ribbon[] = []
    // ?windclock=12000 starts the gust later in its colour cycle — visual QA only.
    let clock = import.meta.env.DEV
      ? Number(new URLSearchParams(window.location.search).get('windclock')) || 0
      : 0
    let frame = 0

    const spawn = (scatter = false): Ribbon => {
      // Fresh ribbons blow in over the left third (they fade in, so nothing
      // pops); the opening set is scattered across the whole hero.
      const x = scatter ? Math.random() * width : -60 + Math.random() * (width * 0.35 + 60)
      const y = Math.random() * height
      // Most ribbons are fine filaments; a few are broad, soft bands of light.
      const band = Math.random() < 0.14
      return {
        xs: [x],
        ys: [y],
        age: scatter ? Math.random() * 120 : 0,
        life: 320 + Math.random() * 380,
        width: band ? 5 + Math.random() * 5 : 1.1 + Math.random() * 2,
        speed: band ? 2 + Math.random() * 1.6 : 2.6 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        hueShift: Math.random() * 0.45,
      }
    }

    const advance = () => {
      clock += 16.7
      // A phone is a third as wide, so slow the wind or ribbons cross it in a blink.
      const pace = Math.min(1, Math.max(0.5, width / 1200))
      const { x: px, y: py, vx, vy } = pointer.current

      for (let i = 0; i < ribbons.length; i += 1) {
        const ribbon = ribbons[i]
        const last = ribbon.xs.length - 1
        const x = ribbon.xs[last]
        const y = ribbon.ys[last]

        const angle = windAngle(x, y, clock)
        // Gust fronts roll across the hero and briefly push harder.
        const gust = 1 + Math.max(0, Math.sin(x * 0.0026 - clock * 0.0009)) * 0.9
        let dx = Math.cos(angle) * ribbon.speed * gust * pace
        let dy =
          Math.sin(angle) * ribbon.speed * gust * pace +
          Math.sin(ribbon.age * 0.034 + ribbon.phase) * 1.35

        const ox = x - px
        const oy = y - py
        const distance = ox * ox + oy * oy
        if (distance < 40000) {
          const pull = 1 - distance / 40000
          dx += vx * 0.3 * pull
          dy += vy * 0.3 * pull
        }

        ribbon.xs.push(x + dx)
        ribbon.ys.push(y + dy)
        if (ribbon.xs.length > TRAIL) {
          ribbon.xs.shift()
          ribbon.ys.shift()
        }
        ribbon.age += 1

        const tailX = ribbon.xs[0]
        if (ribbon.age > ribbon.life || tailX > width + 40 || y < -140 || y > height + 140) {
          ribbons[i] = spawn()
        }
      }

      pointer.current.vx *= 0.9
      pointer.current.vy *= 0.9
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'lighter'
      context.lineCap = 'round'
      context.lineJoin = 'round'

      const base = clock / COLOUR_MS
      // Keep the glow in proportion on narrow screens.
      const thickness = 0.55 + 0.45 * Math.min(1, Math.max(0.5, width / 1200))

      for (const ribbon of ribbons) {
        const count = ribbon.xs.length
        if (count < 4) continue

        const fade = Math.sin(Math.min(1, ribbon.age / ribbon.life) * Math.PI)
        const headX = ribbon.xs[count - 1]
        const headY = ribbon.ys[count - 1]
        const [r, g, b] = paletteAt(base + ribbon.hueShift + headX / (width * 3))

        const gradient = context.createLinearGradient(ribbon.xs[0], ribbon.ys[0], headX, headY)
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`)
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${0.55 * fade})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${0.95 * fade})`)

        context.beginPath()
        context.moveTo(ribbon.xs[0], ribbon.ys[0])
        for (let p = 1; p < count - 1; p += 1) {
          const mx = (ribbon.xs[p] + ribbon.xs[p + 1]) / 2
          const my = (ribbon.ys[p] + ribbon.ys[p + 1]) / 2
          context.quadraticCurveTo(ribbon.xs[p], ribbon.ys[p], mx, my)
        }
        context.lineTo(headX, headY)

        // Wide soft halo first, then the bright filament on top.
        context.strokeStyle = gradient
        const broad = ribbon.width > 3.5
        context.globalAlpha = broad ? 0.09 : 0.24
        context.lineWidth = ribbon.width * (broad ? 4 : 10) * thickness
        context.stroke()
        context.globalAlpha = broad ? 0.5 : 1
        context.lineWidth = ribbon.width * thickness
        context.stroke()
      }

      context.globalAlpha = 1
      context.globalCompositeOperation = 'source-over'
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      // ResizeObserver reports once on observe(); resetting the bitmap clears
      // it, so skip calls that would not change the size.
      if (rect.width === width && rect.height === height) return
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      const count = Math.round(Math.min(120, Math.max(34, (width * height) / 11000)))
      ribbons = Array.from({ length: count }, () => spawn(true))
      for (let i = 0; i < WARM_UP; i += 1) advance()
      draw()
    }

    const loop = () => {
      advance()
      draw()
      frame = requestAnimationFrame(loop)
    }

    const onPointer = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const state = pointer.current
      if (state.x > -9000) {
        state.vx = x - state.x
        state.vy = y - state.y
      }
      state.x = x
      state.y = y
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    window.addEventListener('pointermove', onPointer, { passive: true })
    if (active) frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [active])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  )
}
