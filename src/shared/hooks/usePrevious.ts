import { useState } from 'react'

/**
 * Value from the previous render in which `value` was different.
 *
 * Uses state instead of a ref: reading `ref.current` during render is
 * discouraged in React 19 because it makes the output unpredictable.
 * Calling setState during render (guarded by a condition) is the pattern
 * recommended by the React docs for "storing information from previous renders".
 */
export function usePrevious<T>(value: T): T | undefined {
  const [current, setCurrent] = useState(value)
  const [previous, setPrevious] = useState<T | undefined>(undefined)

  if (!Object.is(value, current)) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}
