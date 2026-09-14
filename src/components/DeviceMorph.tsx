import { useEffect, useRef, useState } from 'react'
import { deviceSrc, type FlavourId } from '../data/nosenic'

interface Props {
  flavour: FlavourId
  /** World slug whose artwork should be showing. */
  world: string
  alt: string
  /** Must give the box a size (height plus aspect ratio): the layers fill it. */
  className?: string
  loading?: 'eager' | 'lazy'
  /** Where a world/flavour's artwork lives. Defaults to the inhaler set. */
  srcFor?: (world: string, flavour: FlavourId) => string
  /** Intrinsic size of the artwork, for layout before it decodes. */
  width?: number
  height?: number
  /** Extra CSS filter applied before the drop shadow, e.g. to push colour. */
  tone?: string
}

interface Layer {
  id: number
  world: string
  /** Decoded and fading in (or fully in). */
  shown: boolean
}

/** Long enough to read as a dissolve, short enough to keep up with the row. */
const FADE_MS = 700

/**
 * One product shot that changes its visual world by cross-dissolving: each new
 * artwork is stacked on top, fades in once decoded, and only then are the
 * layers beneath it dropped — so there is never a gap or a flash.
 */
export default function DeviceMorph({
  flavour,
  world,
  alt,
  className,
  loading = 'lazy',
  srcFor = deviceSrc,
  width = 374,
  height = 670,
  tone = '',
}: Props) {
  const nextId = useRef(1)
  const revealed = useRef(new Set<number>([0]))
  const [layers, setLayers] = useState<Layer[]>([{ id: 0, world, shown: true }])

  useEffect(() => {
    setLayers((previous) =>
      previous[previous.length - 1].world === world
        ? previous
        : [...previous, { id: nextId.current++, world, shown: false }],
    )
  }, [world])

  const reveal = (id: number) => {
    if (revealed.current.has(id)) return
    revealed.current.add(id)
    // Wait a frame so the layer paints at opacity 0 before transitioning up.
    requestAnimationFrame(() =>
      setLayers((previous) =>
        previous.map((layer) => (layer.id === id ? { ...layer, shown: true } : layer)),
      ),
    )
    // transitionend never fires if the fade is skipped (hidden tab, reduced
    // motion), so settle on a timer too rather than letting layers pile up.
    window.setTimeout(() => settle(id), FADE_MS + 200)
  }

  const settle = (id: number) => {
    setLayers((previous) => {
      const index = previous.findIndex((layer) => layer.id === id)
      // Never drop what is underneath a layer that is not visible yet.
      return index > 0 && previous[index].shown ? previous.slice(index) : previous
    })
  }

  const top = [...layers].reverse().find((layer) => layer.shown)

  return (
    <span
      className={className}
      style={{
        position: 'relative',
        display: 'block',
        // On the wrapper, so two stacked layers mid-dissolve cast one shadow.
        filter: `${tone} drop-shadow(0 26px 34px rgb(0 0 0 / 0.55))`.trim(),
      }}
      data-device
    >
      {layers.map((layer, index) => {
        const current = layer === top
        return (
          <img
            key={layer.id}
            src={srcFor(layer.world, flavour)}
            alt={current ? alt : ''}
            aria-hidden={current ? undefined : true}
            loading={index === 0 ? loading : 'eager'}
            decoding="async"
            width={width}
            height={height}
            ref={(node) => {
              // A cached image can finish before React attaches onLoad.
              if (node && !layer.shown && node.complete && node.naturalWidth > 0)
                reveal(layer.id)
            }}
            onLoad={() => {
              if (!layer.shown) reveal(layer.id)
            }}
            onTransitionEnd={() => {
              if (layer.shown) settle(layer.id)
            }}
            className="absolute inset-0 h-full w-full object-contain object-bottom"
            style={{
              opacity: layer.shown ? 1 : 0,
              transition:
                index === 0 ? undefined : `opacity ${FADE_MS}ms cubic-bezier(.4,0,.2,1)`,
            }}
          />
        )
      })}
    </span>
  )
}
