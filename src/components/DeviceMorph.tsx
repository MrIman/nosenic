import { useEffect, useRef, useState } from 'react'
import { deviceSrc, type FlavourId } from '../data/nosenic'

interface Props {
  flavour: FlavourId
  /** World slug whose artwork should be showing. */
  world: string
  alt: string
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

/**
 * One product shot that can change its visual world without ever flashing a
 * gap: the next artwork is decoded off-screen and only cuts in once loaded.
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
  const [shown, setShown] = useState(world)
  const [pending, setPending] = useState<string | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setPending(world === shown ? null : world)
  }, [world, shown])

  return (
    <span className={className} style={{ position: 'relative', display: 'block' }} data-device>
      <img
        ref={imageRef}
        src={srcFor(shown, flavour)}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        className="h-full w-full object-contain object-bottom"
        style={{ filter: `${tone} drop-shadow(0 26px 34px rgb(0 0 0 / 0.55))`.trim() }}
      />
      {pending && (
        <img
          key={pending}
          src={srcFor(pending, flavour)}
          alt=""
          aria-hidden="true"
          decoding="async"
          onLoad={() => {
            setShown(pending)
            const node = imageRef.current
            if (!node) return
            node.animate(
              [
                { opacity: 0.25, transform: 'scale(1.035)' },
                { opacity: 1, transform: 'scale(1)' },
              ],
              { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' },
            )
          }}
          style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}
        />
      )}
    </span>
  )
}
