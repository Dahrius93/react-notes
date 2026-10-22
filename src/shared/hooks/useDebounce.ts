import { useEffect, useState } from 'react'

/**
 * Returns `value` only after it has stopped changing for `delayMs`.
 * Typical use: wait for the user to stop typing before searching.
 *
 * @example
 * const debouncedQuery = useDebounce(query, 300)
 */
export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    // A new value before the delay expires cancels the pending update
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}
