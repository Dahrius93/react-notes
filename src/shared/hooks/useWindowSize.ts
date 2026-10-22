import { useState } from 'react'
import { useEventListener } from './useEventListener'

export type WindowSize = { width: number; height: number }

function getWindowSize(): WindowSize {
  return { width: window.innerWidth, height: window.innerHeight }
}

/** Current window size, updated on resize. */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState(getWindowSize)
  useEventListener('resize', () => setSize(getWindowSize()))
  return size
}
