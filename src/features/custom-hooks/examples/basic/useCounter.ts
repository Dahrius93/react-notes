import { useState } from 'react'

// A custom hook is a function whose name starts with "use" and that calls other hooks
export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount((c) => c + 1)
  const decrement = () => setCount((c) => c - 1)
  const reset = () => setCount(initialValue)

  // Return only what components need
  return { count, increment, decrement, reset }
}
