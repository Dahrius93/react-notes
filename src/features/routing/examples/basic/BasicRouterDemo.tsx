import { RouterSandbox } from '@/docs/RouterSandbox'
import { App } from './App'

// In a real app: <BrowserRouter><App /></BrowserRouter> in main.tsx.
// Here a sandbox with an in-memory router and a fake address bar.
export function BasicRouterDemo() {
  return (
    <RouterSandbox>
      <App />
    </RouterSandbox>
  )
}
