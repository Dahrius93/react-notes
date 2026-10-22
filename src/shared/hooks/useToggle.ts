import { useCallback, useState } from 'react'

/**
 * Boolean state with stable helper actions.
 *
 * @example
 * const [isOpen, { toggle, setOff }] = useToggle()
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => setValue((v) => !v), [])
  const setOn = useCallback(() => setValue(true), [])
  const setOff = useCallback(() => setValue(false), [])

  return [value, { toggle, setOn, setOff, set: setValue }] as const
}
