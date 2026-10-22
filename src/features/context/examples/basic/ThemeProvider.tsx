import { useState, type ReactNode } from 'react'
import { ThemeContext, type Theme } from './ThemeContext'

// Owns the state and makes it available to everything inside `children`
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')

  const value = {
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
  }

  // React 19: the context itself is the provider (before: <ThemeContext.Provider>)
  return <ThemeContext value={value}>{children}</ThemeContext>
}
