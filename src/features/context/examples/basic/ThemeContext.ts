import { createContext } from 'react'

export type Theme = 'light' | 'dark'

// What every component will be able to read
export type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

// Default value `null` = "there is no provider above me".
// useTheme checks it to catch a forgotten <ThemeProvider>.
export const ThemeContext = createContext<ThemeContextValue | null>(null)
