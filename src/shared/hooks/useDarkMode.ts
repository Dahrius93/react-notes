import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useMediaQuery } from './useMediaQuery'

export type Theme = 'light' | 'dark' | 'system'

/**
 * Theme preference persisted in localStorage. Toggles the `dark` class
 * on <html>, which Tailwind's `dark:` variant reads (see index.css).
 * Call it once, near the root of the app.
 */
export function useDarkMode() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const isDark = theme === 'dark' || (theme === 'system' && prefersDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return { theme, setTheme, isDark }
}
