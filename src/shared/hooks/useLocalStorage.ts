import { useEffect, useState } from 'react'
import { useEventListener } from './useEventListener'

function readValue<T>(key: string, initialValue: T | (() => T)): T {
  const fallback = () => (initialValue instanceof Function ? initialValue() : initialValue)
  try {
    const stored = window.localStorage.getItem(key)
    return stored === null ? fallback() : (JSON.parse(stored) as T)
  } catch {
    // Storage blocked (private mode) or invalid JSON: use the initial value
    return fallback()
  }
}

/**
 * `useState` persisted in localStorage (as JSON) and synced across browser tabs.
 *
 * @example
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
 */
export function useLocalStorage<T>(key: string, initialValue: T | (() => T)) {
  const [value, setValue] = useState<T>(() => readValue(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Quota exceeded or storage blocked: keep working in memory only
    }
  }, [key, value])

  // The `storage` event fires in the *other* tabs when one tab writes
  useEventListener('storage', (event) => {
    if (event.key === key) setValue(readValue(key, initialValue))
  })

  return [value, setValue] as const
}
