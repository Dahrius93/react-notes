import type { ReactNode } from 'react'
import { Button } from '@/shared/ui/Button'
import { useTheme } from './useTheme'

// Explicit classes (not Tailwind's dark:) because this theme is local to the demo
const themeClasses = {
  light: 'bg-white text-zinc-900 ring-zinc-200',
  dark: 'bg-zinc-800 text-zinc-100 ring-zinc-600',
}

function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  return <div className={`space-y-4 rounded-xl p-4 ring-1 ${themeClasses[theme]}`}>{children}</div>
}

// Deep in the tree: reads the theme without receiving any prop
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <Button size="sm" variant="secondary" onClick={toggleTheme}>
      {theme === 'light' ? '☾ Scuro' : '☀ Chiaro'}
    </Button>
  )
}

// Header doesn't use the theme and doesn't pass it on: no prop drilling
function Header() {
  return (
    <header className="flex items-center justify-between">
      <strong>La mia app</strong>
      <ThemeToggleButton />
    </header>
  )
}

function Card() {
  const { theme } = useTheme()
  return (
    <div className={`rounded-lg p-4 ring-1 ${themeClasses[theme]}`}>
      Tema attuale: <strong>{theme}</strong>
    </div>
  )
}

// App knows nothing about the theme: whoever needs it calls useTheme()
export function App() {
  return (
    <Layout>
      <Header />
      <Card />
    </Layout>
  )
}
