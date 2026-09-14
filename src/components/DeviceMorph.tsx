import { useEffect, useRef, useState } from 'react'
import { deviceSrc, type FlavourId } from '../data/nosenic'

interface Props {
  flavour: FlavourId
  /** World slug whose artwork should be showing. */
  world: string
  alt: string
  className?: string
  loading?: 'eager' | 'lazy'
}

/**
 * One inhaler that can change its visual world without ever flashing a gap:
 * the next artwork is decoded off-screen and only cuts in once it has loaded.
 */
export default function DeviceMorph({
  flavour,
  world,
  alt,
  className,
  loading = 'lazy',
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
        src={deviceSrc(shown, flavour)}
        alt={alt}
        loading={loading}
        decoding="async"
        width={374}
        height={670}
        className="h-full w-full object-contain"
        style={{ filter: 'drop-shadow(0 26px 34px rgb(0 0 0 / 0.55))' }}
      />
      {pending && (
        <img
          key={pending}
          src={deviceSrc(pending, flavour)}
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
