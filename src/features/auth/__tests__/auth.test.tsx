import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../authContext'
import { AuthProvider } from '../AuthProvider'
import { LoginForm } from '../LoginForm'
import { UserMenu } from '../UserMenu'

const bret = { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'bret@example.com' }

// JSONPlaceholder `/users?username=X` returns an array (empty when not found)
const fetchMock = vi.fn(async (url: string) => {
  const username = new URL(url).searchParams.get('username')
  const body = username === 'Bret' ? [bret] : []
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } })
})

describe('auth', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('useAuth throws a clear error outside <AuthProvider>', () => {
    // React logs the thrown error: silence it for this test
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used inside <AuthProvider>')
  })

  it('logs in with an existing username and shows the user in the menu', async () => {
    const user = userEvent.setup()
    // A wrapper with the providers: the usual way to test context consumers
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserMenu />
          <LoginForm />
        </AuthProvider>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Username'), 'Bret')
    await user.type(screen.getByLabelText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Accedi' }))

    expect(await screen.findByRole('button', { name: /Bret/ })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('react-notes:auth-user') ?? 'null')).toMatchObject({ username: 'Bret' })
  })

  it('shows an error for an unknown username', async () => {
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>,
    )

    await user.type(screen.getByLabelText('Username'), 'nobody')
    await user.type(screen.getByLabelText('Password'), 'secret')
    await user.click(screen.getByRole('button', { name: 'Accedi' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Username o password non validi')
  })

  it('restores the session from localStorage and logs out', async () => {
    localStorage.setItem('react-notes:auth-user', JSON.stringify(bret))
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserMenu />
        </AuthProvider>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /Bret/ }))
    await user.click(screen.getByRole('menuitem', { name: 'Esci' }))

    expect(screen.queryByRole('button', { name: /Bret/ })).not.toBeInTheDocument()
  })
})
