// Runs before every test file (vite.config.ts → test.setupFiles)
import '@testing-library/jest-dom/vitest' // DOM matchers: toBeInTheDocument, toHaveTextContent...
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup() // unmount what the test rendered
  localStorage.clear() // no state leaking between tests
  vi.unstubAllGlobals() // undo vi.stubGlobal('fetch', ...) and friends
})

// jsdom does not implement scrollTo (used by <ScrollRestoration />)
window.scrollTo = vi.fn() as typeof window.scrollTo

// jsdom does not implement matchMedia (used by useMediaQuery / useDarkMode)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
