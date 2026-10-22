import { App } from './App'
import { ThemeProvider } from './ThemeProvider'

// Same thing you would write in main.tsx: the provider wraps the whole <App />
export function BasicContextDemo() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}
