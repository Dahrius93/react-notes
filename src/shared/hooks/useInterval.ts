import { useEffect, useEffectEvent } from 'react'

/**
 * Declarative `setInterval`. Pass `null` as delay to pause it.
 * The callback always sees fresh props/state without restarting the timer.
 *
 * @example
 * useInterval(() => setSeconds((s) => s + 1), isRunning ? 1000 : null)
 */
export function useInterval(callback: () => void, delay: number | null) {
  const onTick = useEffectEvent(callback)

  useEffect(() => {
    if (delay === null) return
    const id = setInterval(() => onTick(), delay)
    return () => clearInterval(id)
  }, [delay])
}
