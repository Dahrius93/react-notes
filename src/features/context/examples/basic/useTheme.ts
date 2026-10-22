import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

// Components call useTheme() instead of useContext(ThemeContext):
// one import, a non-null type, and a clear error if the provider is missing
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used inside <ThemeProvider>')
  }
  return context
}
