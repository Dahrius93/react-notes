import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { createMemoryRouter, MemoryRouter, useLocation } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { App } from '../basic/App'
import { dataRoutes } from '../data/routes'
import { ProtectedApp } from '../protected/ProtectedApp'
import { PostsApp } from '../slug/PostsApp'

/** Shows the current URL, to assert on redirects. */
function LocationDisplay() {
  const { pathname, search } = useLocation()
  return <p data-testid="location">{pathname + search}</p>
}

/** MemoryRouter = a router that keeps the history in memory: perfect for tests. */
function renderWithRouter(ui: ReactNode, initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      {ui}
      <LocationDisplay />
    </MemoryRouter>,
  )
}

/** Fake JSONPlaceholder: answers by URL path. */
function mockApi(routes: Record<string, unknown>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) => {
      const { pathname, search } = new URL(url)
      const key = pathname + search
      return key in routes
        ? new Response(JSON.stringify(routes[key]), { headers: { 'Content-Type': 'application/json' } })
        : new Response('{}', { status: 404 })
    }),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('basic routing', () => {
  it('navigates with <Link> without reloading', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)

    await user.click(screen.getByRole('link', { name: 'Chi siamo' }))

    expect(screen.getByRole('heading', { name: 'Chi siamo' })).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('/about')
  })

  it('renders the 404 route for unknown URLs', () => {
    renderWithRouter(<App />, '/does-not-exist')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })
})

describe('slug', () => {
  it('redirects to the canonical URL when the slug is missing', async () => {
    mockApi({ '/posts/3': { id: 3, userId: 1, title: 'Ciao Mondò!', body: '...' } })
    renderWithRouter(<PostsApp />, '/posts/3')

    expect(await screen.findByRole('heading', { name: 'Ciao Mondò!' })).toBeInTheDocument()
    expect(screen.getByTestId('location')).toHaveTextContent('/posts/3/ciao-mondo')
  })
})

describe('protected routes', () => {
  function renderProtected(initialPath: string) {
    return renderWithRouter(
      <AuthProvider storageKey="test-auth">
        <ProtectedApp />
      </AuthProvider>,
      initialPath,
    )
  }

  it('redirects anonymous users to /login, remembering the page', () => {
    renderProtected('/orders')

    expect(screen.getByTestId('location')).toHaveTextContent('/login')
    expect(screen.getByText('/orders')).toBeInTheDocument() // "Devi accedere per vedere /orders"
  })

  it('shows the page to logged-in users', () => {
    localStorage.setItem('test-auth', JSON.stringify({ id: 1, username: 'Bret', name: 'Leanne Graham' }))
    renderProtected('/orders')

    expect(screen.getByText(/I tuoi ordini/)).toBeInTheDocument()
  })
})

describe('data mode', () => {
  it('renders the loader data, or the ErrorBoundary on a 404', async () => {
    mockApi({ '/users': [{ id: 1, name: 'Leanne Graham' }] })
    // Data routers are tested with createMemoryRouter + RouterProvider
    const router = createMemoryRouter(dataRoutes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)

    expect(await screen.findByRole('link', { name: 'Leanne Graham' }, { timeout: 3000 })).toBeInTheDocument()

    await router.navigate('/users/999')
    expect(await screen.findByText(/404 · Utente non trovato/, {}, { timeout: 3000 })).toBeInTheDocument()
  })
})
