import { useEffect, useEffectEvent } from 'react'

type ListenerTarget = Window | Document | HTMLElement | null

/**
 * Subscribes to a DOM event and removes the listener on unmount.
 *
 * The handler can change on every render without re-subscribing:
 * `useEffectEvent` always calls its latest version.
 *
 * @example
 * useEventListener('keydown', (e) => e.key === 'Escape' && close())
 */
export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target: ListenerTarget = window,
) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    if (!target) return
    const listener = (event: Event) => onEvent(event as WindowEventMap[K])
    target.addEventListener(type, listener)
    return () => target.removeEventListener(type, listener)
  }, [type, target])
}
