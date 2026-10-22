import type { RefObject } from 'react'
import { useEventListener } from './useEventListener'

/**
 * Calls `handler` when the user presses the pointer outside the element in `ref`.
 * Typical use: close dropdowns, popovers and menus.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null)
 * useOnClickOutside(ref, close)
 */
export function useOnClickOutside(ref: RefObject<HTMLElement | null>, handler: (event: PointerEvent) => void) {
  useEventListener(
    'pointerdown',
    (event) => {
      const element = ref.current
      if (!element || element.contains(event.target as Node)) return
      handler(event)
    },
    document,
  )
}
