import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { ThemeProvider } from '../ThemeProvider'
import { useTheme } from '../useTheme'

describe('basic theme context', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shares the theme with every component inside the provider', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <App />
      </ThemeProvider>,
    )

    expect(screen.getByText('light')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /scuro/i }))
    expect(screen.getByText('dark')).toBeInTheDocument()
  })

  it('useTheme throws when the provider is missing', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used inside <ThemeProvider>')
  })
})
