import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Rolling world index for each inhaler in a row. One device changes at a time
 * so the row reads as a wave rather than a strobe. Idle while `enabled` is
 * false, which keeps off-screen rows from re-rendering.
 */
export function useWorldCycle(count: number, worlds: number, stepMs = 460, enabled = true) {
  const [indices, setIndices] = useState(() =>
    Array.from({ length: count }, (_, i) => (i * 3) % worlds),
  )

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return

    let tick = 0
    const id = window.setInterval(() => {
      const slot = tick % count
      tick += 1
      setIndices((prev) => prev.map((world, i) => (i === slot ? (world + 1) % worlds : world)))
    }, stepMs)

    return () => window.clearInterval(id)
  }, [count, worlds, stepMs, enabled])

  return indices
}
